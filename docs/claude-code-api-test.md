 以下是几个测试命令：

  基础测试命令

  1. 健康检查

  curl http://localhost:3000/health

  2. 查看可用模型

  curl http://localhost:3000/v1/models

  3. 简单对话（流式响应）

  curl -X POST http://localhost:3000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
      "model": "claude-3-5-sonnet-20241022",
      "messages": [{"role": "user", "content": "你好，请用一句话介绍自己"}],
      "stream": true
    }'

  4. 非流式响应

  curl -X POST http://localhost:3000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
      "model": "claude-3-5-sonnet-20241022",
      "messages": [{"role": "user", "content": "2+2等于几？"}],
      "stream": false,
      "max_tokens": 50
    }'

  5. 带系统消息的请求

  curl -X POST http://localhost:3000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
      "model": "claude-3-5-sonnet-20241022",
      "messages": [
        {"role": "system", "content": "你是一个有帮助的助手，总是用中文回答。"},
        {"role": "user", "content": "What is the weather today?"}
      ],
      "stream": true
    }'

  6. 如果启用了认证（AUTH_ENABLED=true）

  curl -X POST http://localhost:3000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer your-api-key-here" \
    -d '{
      "model": "claude-3-5-sonnet-20241022",
      "messages": [{"role": "user", "content": "Hello"}],
      "stream": true
    }'

  7. 使用jq格式化非流式响应

  curl -s -X POST http://localhost:3000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
      "model": "claude-3-5-sonnet-20241022",
      "messages": [{"role": "user", "content": "列出3个编程语言"}],
      "stream": false
    }' | jq '.'

  8. 保存流式响应到文件

  curl -X POST http://localhost:3000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
      "model": "claude-3-5-sonnet-20241022",
      "messages": [{"role": "user", "content": "写一个简短的故事"}],
      "stream": true
    }' > response.txt

  9. 测试错误处理

  # 缺少必需字段
  curl -X POST http://localhost:3000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
      "messages": [{"role": "user", "content": "test"}]
    }'

  # 无效的模型名
  curl -X POST http://localhost:3000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
      "model": "invalid-model",
      "messages": [{"role": "user", "content": "test"}]
    }'

  10. 使用已创建的测试脚本

  # 运行完整测试套件
  ./test-api.sh

  # 带API密钥运行
  API_KEY=your-key ./test-api.sh

  # 测试远程服务器
  API_URL=http://your-server:3000 ./test-api.sh

  调试提示

  如果遇到问题，可以查看：
  1. 服务是否正常启动：curl http://localhost:3000/health
  2. Claude CLI是否可用：检查health返回的claude_cli状态
  3. 查看服务器日志了解详细错误信息
