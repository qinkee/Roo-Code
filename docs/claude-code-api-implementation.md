# Claude Code OpenAI兼容服务实施方案

## 一、项目概述

### 1.1 目标
将Claude Code CLI封装为独立的Node.js服务，提供OpenAI兼容的API接口，实现生产级可靠性。

### 1.2 核心原则
- **KISS原则**：保持简单直接，避免过度设计
- **生产就绪**：稳定、可监控、易维护
- **代码复用**：最大化利用现有Claude Code集成代码

## 二、技术架构

### 2.1 技术栈
```json
{
  "runtime": "Node.js 20+",
  "framework": "Express 4.x",
  "dependencies": {
    "express": "^4.18.0",
    "execa": "^8.0.0",
    "dotenv": "^16.0.0",
    "winston": "^3.0.0",
    "express-rate-limit": "^7.0.0",
    "helmet": "^7.0.0",
    "cors": "^2.8.0",
    "joi": "^17.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "nodemon": "^3.0.0",
    "@types/express": "^4.17.0"
  }
}
```

### 2.2 项目结构
```
claude-code-api/
├── src/
│   ├── server.ts              # 服务器入口
│   ├── config/
│   │   └── index.ts          # 配置管理
│   ├── routes/
│   │   ├── index.ts          # 路由注册
│   │   └── chat.ts           # chat completions路由
│   ├── controllers/
│   │   └── chat.controller.ts # 请求处理逻辑
│   ├── services/
│   │   ├── claude-code.service.ts  # Claude Code执行服务
│   │   └── converter.service.ts    # 格式转换服务
│   ├── middleware/
│   │   ├── error.ts          # 错误处理
│   │   ├── validation.ts     # 请求验证
│   │   └── auth.ts           # 认证(可选)
│   ├── utils/
│   │   ├── logger.ts         # 日志工具
│   │   └── stream.ts         # 流处理工具
│   └── types/
│       └── index.ts          # TypeScript类型定义
├── .env.example              # 环境变量示例
├── .gitignore
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

## 三、核心实现细节

### 3.1 配置管理 (config/index.ts)
```typescript
export const config = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0'
  },
  claude: {
    executable: process.env.CLAUDE_EXECUTABLE || 'claude',
    timeout: parseInt(process.env.CLAUDE_TIMEOUT || '600000'),
    maxOutputTokens: parseInt(process.env.MAX_OUTPUT_TOKENS || '8192')
  },
  rateLimit: {
    windowMs: 60 * 1000, // 1分钟
    max: parseInt(process.env.RATE_LIMIT_RPM || '60')
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  },
  auth: {
    enabled: process.env.AUTH_ENABLED === 'true',
    apiKeys: process.env.API_KEYS?.split(',') || []
  }
};
```

### 3.2 Claude Code服务 (services/claude-code.service.ts)
```typescript
import { execa } from 'execa';
import { logger } from '../utils/logger';

export class ClaudeCodeService {
  private activeProcesses = new Map<string, any>();

  async execute(messages: any[], options: any) {
    const processId = crypto.randomUUID();
    
    try {
      // 构建命令参数
      const args = this.buildArgs(options);
      
      // 启动Claude Code进程
      const process = execa(config.claude.executable, args, {
        stdin: 'pipe',
        stdout: 'pipe',
        stderr: 'pipe',
        timeout: config.claude.timeout
      });

      this.activeProcesses.set(processId, process);

      // 发送消息
      const input = this.formatInput(messages);
      process.stdin!.write(JSON.stringify(input));
      process.stdin!.end();

      // 返回流
      return {
        stream: process.stdout!,
        processId,
        cleanup: () => this.cleanup(processId)
      };
    } catch (error) {
      this.cleanup(processId);
      throw error;
    }
  }

  private buildArgs(options: any): string[] {
    return [
      'chat',
      '--model', options.model,
      '--message', '{"messages": $INPUT}',
      '--output', 'json',
      '--no-tools',
      '--max-tokens', String(options.max_tokens || config.claude.maxOutputTokens)
    ];
  }

  private cleanup(processId: string) {
    const process = this.activeProcesses.get(processId);
    if (process) {
      process.kill();
      this.activeProcesses.delete(processId);
    }
  }
}
```

### 3.3 格式转换服务 (services/converter.service.ts)
```typescript
export class ConverterService {
  // OpenAI请求 -> Claude Code输入
  convertRequest(openaiRequest: any) {
    return {
      messages: openaiRequest.messages.map(msg => ({
        role: msg.role,
        content: this.filterContent(msg.content)
      })),
      model: this.mapModel(openaiRequest.model),
      max_tokens: openaiRequest.max_tokens
    };
  }

  // Claude Code流 -> OpenAI SSE格式
  async* convertStream(claudeStream: any) {
    let buffer = '';
    
    for await (const chunk of claudeStream) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        
        try {
          const data = JSON.parse(line);
          yield this.formatSSE(this.convertChunk(data));
        } catch (e) {
          logger.error('Parse error:', e);
        }
      }
    }
    
    // 发送结束标记
    yield 'data: [DONE]\n\n';
  }

  private convertChunk(claudeData: any) {
    if (claudeData.type === 'text') {
      return {
        choices: [{
          delta: { content: claudeData.text },
          index: 0
        }]
      };
    } else if (claudeData.type === 'usage') {
      return {
        usage: {
          prompt_tokens: claudeData.input_tokens,
          completion_tokens: claudeData.output_tokens,
          total_tokens: claudeData.input_tokens + claudeData.output_tokens
        }
      };
    }
  }

  private formatSSE(data: any): string {
    return `data: ${JSON.stringify(data)}\n\n`;
  }

  private filterContent(content: any): string {
    // 过滤图片等不支持的内容
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
      return content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('');
    }
    return '';
  }

  private mapModel(openaiModel: string): string {
    const modelMap: Record<string, string> = {
      'gpt-4': 'claude-3-5-sonnet-20241022',
      'gpt-4-turbo': 'claude-opus-4-20250514'
    };
    return modelMap[openaiModel] || openaiModel;
  }
}
```

### 3.4 Chat控制器 (controllers/chat.controller.ts)
```typescript
export class ChatController {
  constructor(
    private claudeService: ClaudeCodeService,
    private converter: ConverterService
  ) {}

  async createCompletion(req: Request, res: Response) {
    try {
      // 转换请求
      const claudeRequest = this.converter.convertRequest(req.body);
      
      // 执行Claude Code
      const { stream, cleanup } = await this.claudeService.execute(
        claudeRequest.messages,
        claudeRequest
      );

      // 设置SSE响应头
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // 流式响应
      const convertedStream = this.converter.convertStream(stream);
      
      for await (const chunk of convertedStream) {
        res.write(chunk);
      }

      res.end();
      cleanup();
    } catch (error) {
      cleanup();
      throw error;
    }
  }
}
```

### 3.5 错误处理中间件 (middleware/error.ts)
```typescript
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err);

  // Claude Code未找到
  if (err.code === 'ENOENT' && err.path?.includes('claude')) {
    return res.status(500).json({
      error: {
        message: 'Claude Code CLI not found. Please install it first.',
        type: 'claude_not_installed',
        code: 'CLAUDE_NOT_FOUND'
      }
    });
  }

  // 超时错误
  if (err.name === 'TimeoutError') {
    return res.status(504).json({
      error: {
        message: 'Request timeout',
        type: 'timeout',
        code: 'REQUEST_TIMEOUT'
      }
    });
  }

  // 默认错误
  res.status(500).json({
    error: {
      message: 'Internal server error',
      type: 'internal_error'
    }
  });
};
```

### 3.6 请求验证 (middleware/validation.ts)
```typescript
import Joi from 'joi';

const chatCompletionSchema = Joi.object({
  model: Joi.string().required(),
  messages: Joi.array().items(
    Joi.object({
      role: Joi.string().valid('system', 'user', 'assistant').required(),
      content: Joi.alternatives().try(
        Joi.string(),
        Joi.array()
      ).required()
    })
  ).required(),
  max_tokens: Joi.number().min(1).max(64000),
  temperature: Joi.number().min(0).max(2),
  stream: Joi.boolean().default(true)
});

export const validateChatCompletion = (req: Request, res: Response, next: NextFunction) => {
  const { error } = chatCompletionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
        type: 'invalid_request_error'
      }
    });
  }
  next();
};
```

### 3.7 主服务器 (server.ts)
```typescript
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './middleware/error';
import { logger } from './utils/logger';
import routes from './routes';

const app = express();

// 基础中间件
app.use(helmet());
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));

// 速率限制
const limiter = rateLimit(config.rateLimit);
app.use('/v1/', limiter);

// 健康检查
app.get('/health', async (req, res) => {
  const claudeAvailable = await checkClaudeAvailable();
  res.json({
    status: 'ok',
    claude_cli: claudeAvailable ? 'available' : 'not_found',
    timestamp: new Date().toISOString()
  });
});

// API路由
app.use('/v1', routes);

// 错误处理
app.use(errorHandler);

// 启动服务器
app.listen(config.server.port, config.server.host, () => {
  logger.info(`Server running on http://${config.server.host}:${config.server.port}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  // 清理所有活动进程
  process.exit(0);
});
```

## 四、部署配置

### 4.1 环境变量 (.env.example)
```bash
# 服务器配置
PORT=3000
HOST=0.0.0.0

# Claude配置
CLAUDE_EXECUTABLE=claude
CLAUDE_TIMEOUT=600000
MAX_OUTPUT_TOKENS=8192

# 安全配置
RATE_LIMIT_RPM=60
CORS_ORIGIN=*
AUTH_ENABLED=false
API_KEYS=

# 日志配置
LOG_LEVEL=info
```

### 4.2 Dockerfile
```dockerfile
FROM node:20-alpine

# 安装Claude Code CLI
RUN npm install -g @anthropic/claude-code

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .
RUN npm run build

EXPOSE 3000

# 使用非root用户
USER node

CMD ["node", "dist/server.js"]
```

### 4.3 生产部署脚本 (ecosystem.config.js)
```javascript
module.exports = {
  apps: [{
    name: 'claude-code-api',
    script: './dist/server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

## 五、测试用例

### 5.1 基础测试
```bash
# 健康检查
curl http://localhost:3000/health

# 简单对话测试
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "messages": [{"role": "user", "content": "Hello"}],
    "stream": true
  }'
```

### 5.2 性能测试
```bash
# 使用Apache Bench进行压力测试
ab -n 100 -c 10 -p request.json -T application/json \
   http://localhost:3000/v1/chat/completions
```

## 六、监控和维护

### 6.1 日志规范
- 使用结构化日志（JSON格式）
- 记录请求ID用于追踪
- 敏感信息脱敏

### 6.2 监控指标
- 请求响应时间
- 活跃进程数
- 错误率
- Claude CLI可用性

### 6.3 告警规则
- Claude CLI不可用
- 响应时间超过阈值
- 错误率超过5%

## 七、安全考虑

### 7.1 输入验证
- 严格的请求格式验证
- 消息内容长度限制
- 防止命令注入

### 7.2 资源限制
- 进程超时控制
- 并发请求限制
- 内存使用监控

### 7.3 访问控制
- 可选的API Key认证
- IP白名单（可选）
- HTTPS强制（生产环境）

## 八、后续优化方向

### 8.1 短期优化
- 添加响应缓存
- 优化错误重试机制
- 完善监控指标

### 8.2 长期优化
- 支持WebSocket连接
- 实现进程池管理
- 添加请求队列

## 九、实施步骤

### Phase 1: 基础功能（1-2天）
1. 项目初始化和基础架构
2. 实现核心Claude Code执行服务
3. 完成基本的API端点

### Phase 2: 生产特性（2-3天）
1. 添加错误处理和重试
2. 实现请求验证和安全特性
3. 添加日志和监控

### Phase 3: 测试和优化（1-2天）
1. 编写单元测试和集成测试
2. 性能测试和优化
3. 文档完善

### Phase 4: 部署上线（1天）
1. Docker镜像构建
2. 生产环境部署
3. 监控配置

这个方案遵循KISS原则，避免过度设计，同时确保生产级的可靠性和可维护性。重点在于稳定性和简洁性，后续可根据实际需求逐步优化。