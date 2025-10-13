// src/agent.ts
import { z as z4 } from "zod";

// src/provider-settings.ts
import { z as z3 } from "zod";

// src/model.ts
import { z } from "zod";
var reasoningEfforts = ["low", "medium", "high"];
var reasoningEffortsSchema = z.enum(reasoningEfforts);
var verbosityLevels = ["low", "medium", "high"];
var verbosityLevelsSchema = z.enum(verbosityLevels);
var modelParameters = ["max_tokens", "temperature", "reasoning", "include_reasoning"];
var modelParametersSchema = z.enum(modelParameters);
var isModelParameter = (value) => modelParameters.includes(value);
var modelInfoSchema = z.object({
  maxTokens: z.number().nullish(),
  maxThinkingTokens: z.number().nullish(),
  contextWindow: z.number(),
  supportsImages: z.boolean().optional(),
  supportsComputerUse: z.boolean().optional(),
  supportsPromptCache: z.boolean(),
  // Capability flag to indicate whether the model supports an output verbosity parameter
  supportsVerbosity: z.boolean().optional(),
  supportsReasoningBudget: z.boolean().optional(),
  requiredReasoningBudget: z.boolean().optional(),
  supportsReasoningEffort: z.boolean().optional(),
  supportedParameters: z.array(modelParametersSchema).optional(),
  inputPrice: z.number().optional(),
  outputPrice: z.number().optional(),
  cacheWritesPrice: z.number().optional(),
  cacheReadsPrice: z.number().optional(),
  description: z.string().optional(),
  modelType: z.string().optional(),
  reasoningEffort: reasoningEffortsSchema.optional(),
  minTokensPerCachePoint: z.number().optional(),
  maxCachePoints: z.number().optional(),
  cachableFields: z.array(z.string()).optional(),
  tiers: z.array(
    z.object({
      contextWindow: z.number(),
      inputPrice: z.number().optional(),
      outputPrice: z.number().optional(),
      cacheWritesPrice: z.number().optional(),
      cacheReadsPrice: z.number().optional()
    })
  ).optional()
});

// src/codebase-index.ts
import { z as z2 } from "zod";
var CODEBASE_INDEX_DEFAULTS = {
  MIN_SEARCH_RESULTS: 10,
  MAX_SEARCH_RESULTS: 200,
  DEFAULT_SEARCH_RESULTS: 50,
  SEARCH_RESULTS_STEP: 10,
  MIN_SEARCH_SCORE: 0,
  MAX_SEARCH_SCORE: 1,
  DEFAULT_SEARCH_MIN_SCORE: 0.4,
  SEARCH_SCORE_STEP: 0.05
};
var codebaseIndexConfigSchema = z2.object({
  codebaseIndexEnabled: z2.boolean().optional(),
  codebaseIndexQdrantUrl: z2.string().optional(),
  codebaseIndexEmbedderProvider: z2.enum(["openai", "ollama", "openai-compatible", "gemini", "mistral"]).optional(),
  codebaseIndexEmbedderBaseUrl: z2.string().optional(),
  codebaseIndexEmbedderModelId: z2.string().optional(),
  codebaseIndexEmbedderModelDimension: z2.number().optional(),
  codebaseIndexSearchMinScore: z2.number().min(0).max(1).optional(),
  codebaseIndexSearchMaxResults: z2.number().min(CODEBASE_INDEX_DEFAULTS.MIN_SEARCH_RESULTS).max(CODEBASE_INDEX_DEFAULTS.MAX_SEARCH_RESULTS).optional(),
  // OpenAI Compatible specific fields
  codebaseIndexOpenAiCompatibleBaseUrl: z2.string().optional(),
  codebaseIndexOpenAiCompatibleModelDimension: z2.number().optional()
});
var codebaseIndexModelsSchema = z2.object({
  openai: z2.record(z2.string(), z2.object({ dimension: z2.number() })).optional(),
  ollama: z2.record(z2.string(), z2.object({ dimension: z2.number() })).optional(),
  "openai-compatible": z2.record(z2.string(), z2.object({ dimension: z2.number() })).optional(),
  gemini: z2.record(z2.string(), z2.object({ dimension: z2.number() })).optional(),
  mistral: z2.record(z2.string(), z2.object({ dimension: z2.number() })).optional()
});
var codebaseIndexProviderSchema = z2.object({
  codeIndexOpenAiKey: z2.string().optional(),
  codeIndexQdrantApiKey: z2.string().optional(),
  codebaseIndexOpenAiCompatibleBaseUrl: z2.string().optional(),
  codebaseIndexOpenAiCompatibleApiKey: z2.string().optional(),
  codebaseIndexOpenAiCompatibleModelDimension: z2.number().optional(),
  codebaseIndexGeminiApiKey: z2.string().optional(),
  codebaseIndexMistralApiKey: z2.string().optional()
});

// src/provider-settings.ts
var extendedReasoningEffortsSchema = z3.union([reasoningEffortsSchema, z3.literal("minimal")]);
var providerNames = [
  "anthropic",
  "claude-code",
  "glama",
  "openrouter",
  "bedrock",
  "vertex",
  "openai",
  "ollama",
  "vscode-lm",
  "lmstudio",
  "gemini",
  "gemini-cli",
  "openai-native",
  "mistral",
  "moonshot",
  "deepseek",
  "doubao",
  "unbound",
  "requesty",
  "human-relay",
  "fake-ai",
  "xai",
  "groq",
  "chutes",
  "litellm",
  "huggingface",
  "cerebras",
  "sambanova",
  "zai",
  "fireworks",
  "io-intelligence"
];
var providerNamesSchema = z3.enum(providerNames);
var providerSettingsEntrySchema = z3.object({
  id: z3.string(),
  name: z3.string(),
  apiProvider: providerNamesSchema.optional(),
  // 添加model相关字段，支持不同provider的model字段
  modelId: z3.string().optional()
  // 通用的model字段
});
var DEFAULT_CONSECUTIVE_MISTAKE_LIMIT = 3;
var baseProviderSettingsSchema = z3.object({
  includeMaxTokens: z3.boolean().optional(),
  diffEnabled: z3.boolean().optional(),
  todoListEnabled: z3.boolean().optional(),
  fuzzyMatchThreshold: z3.number().optional(),
  modelTemperature: z3.number().nullish(),
  rateLimitSeconds: z3.number().optional(),
  consecutiveMistakeLimit: z3.number().min(0).optional(),
  // Model reasoning.
  enableReasoningEffort: z3.boolean().optional(),
  reasoningEffort: extendedReasoningEffortsSchema.optional(),
  modelMaxTokens: z3.number().optional(),
  modelMaxThinkingTokens: z3.number().optional(),
  // Model verbosity.
  verbosity: verbosityLevelsSchema.optional()
});
var apiModelIdProviderModelSchema = baseProviderSettingsSchema.extend({
  apiModelId: z3.string().optional()
});
var anthropicSchema = apiModelIdProviderModelSchema.extend({
  apiKey: z3.string().optional(),
  anthropicBaseUrl: z3.string().optional(),
  anthropicUseAuthToken: z3.boolean().optional(),
  anthropicBeta1MContext: z3.boolean().optional()
  // Enable 'context-1m-2025-08-07' beta for 1M context window
});
var claudeCodeSchema = apiModelIdProviderModelSchema.extend({
  claudeCodePath: z3.string().optional(),
  claudeCodeMaxOutputTokens: z3.number().int().min(1).max(2e5).optional()
});
var glamaSchema = baseProviderSettingsSchema.extend({
  glamaModelId: z3.string().optional(),
  glamaApiKey: z3.string().optional()
});
var openRouterSchema = baseProviderSettingsSchema.extend({
  openRouterApiKey: z3.string().optional(),
  openRouterModelId: z3.string().optional(),
  openRouterBaseUrl: z3.string().optional(),
  openRouterSpecificProvider: z3.string().optional(),
  openRouterUseMiddleOutTransform: z3.boolean().optional()
});
var bedrockSchema = apiModelIdProviderModelSchema.extend({
  awsAccessKey: z3.string().optional(),
  awsSecretKey: z3.string().optional(),
  awsSessionToken: z3.string().optional(),
  awsRegion: z3.string().optional(),
  awsUseCrossRegionInference: z3.boolean().optional(),
  awsUsePromptCache: z3.boolean().optional(),
  awsProfile: z3.string().optional(),
  awsUseProfile: z3.boolean().optional(),
  awsApiKey: z3.string().optional(),
  awsUseApiKey: z3.boolean().optional(),
  awsCustomArn: z3.string().optional(),
  awsModelContextWindow: z3.number().optional(),
  awsBedrockEndpointEnabled: z3.boolean().optional(),
  awsBedrockEndpoint: z3.string().optional()
});
var vertexSchema = apiModelIdProviderModelSchema.extend({
  vertexKeyFile: z3.string().optional(),
  vertexJsonCredentials: z3.string().optional(),
  vertexProjectId: z3.string().optional(),
  vertexRegion: z3.string().optional()
});
var openAiSchema = baseProviderSettingsSchema.extend({
  openAiBaseUrl: z3.string().optional(),
  openAiApiKey: z3.string().optional(),
  openAiLegacyFormat: z3.boolean().optional(),
  openAiR1FormatEnabled: z3.boolean().optional(),
  openAiModelId: z3.string().optional(),
  openAiCustomModelInfo: modelInfoSchema.nullish(),
  openAiUseAzure: z3.boolean().optional(),
  azureApiVersion: z3.string().optional(),
  openAiStreamingEnabled: z3.boolean().optional(),
  openAiHostHeader: z3.string().optional(),
  // Keep temporarily for backward compatibility during migration.
  openAiHeaders: z3.record(z3.string(), z3.string()).optional()
});
var ollamaSchema = baseProviderSettingsSchema.extend({
  ollamaModelId: z3.string().optional(),
  ollamaBaseUrl: z3.string().optional()
});
var vsCodeLmSchema = baseProviderSettingsSchema.extend({
  vsCodeLmModelSelector: z3.object({
    vendor: z3.string().optional(),
    family: z3.string().optional(),
    version: z3.string().optional(),
    id: z3.string().optional()
  }).optional()
});
var lmStudioSchema = baseProviderSettingsSchema.extend({
  lmStudioModelId: z3.string().optional(),
  lmStudioBaseUrl: z3.string().optional(),
  lmStudioDraftModelId: z3.string().optional(),
  lmStudioSpeculativeDecodingEnabled: z3.boolean().optional()
});
var geminiSchema = apiModelIdProviderModelSchema.extend({
  geminiApiKey: z3.string().optional(),
  googleGeminiBaseUrl: z3.string().optional(),
  enableUrlContext: z3.boolean().optional(),
  enableGrounding: z3.boolean().optional()
});
var geminiCliSchema = apiModelIdProviderModelSchema.extend({
  geminiCliOAuthPath: z3.string().optional(),
  geminiCliProjectId: z3.string().optional()
});
var openAiNativeSchema = apiModelIdProviderModelSchema.extend({
  openAiNativeApiKey: z3.string().optional(),
  openAiNativeBaseUrl: z3.string().optional()
});
var mistralSchema = apiModelIdProviderModelSchema.extend({
  mistralApiKey: z3.string().optional(),
  mistralCodestralUrl: z3.string().optional()
});
var deepSeekSchema = apiModelIdProviderModelSchema.extend({
  deepSeekBaseUrl: z3.string().optional(),
  deepSeekApiKey: z3.string().optional()
});
var doubaoSchema = apiModelIdProviderModelSchema.extend({
  doubaoBaseUrl: z3.string().optional(),
  doubaoApiKey: z3.string().optional()
});
var moonshotSchema = apiModelIdProviderModelSchema.extend({
  moonshotBaseUrl: z3.union([z3.literal("https://api.moonshot.ai/v1"), z3.literal("https://api.moonshot.cn/v1")]).optional(),
  moonshotApiKey: z3.string().optional()
});
var unboundSchema = baseProviderSettingsSchema.extend({
  unboundApiKey: z3.string().optional(),
  unboundModelId: z3.string().optional()
});
var requestySchema = baseProviderSettingsSchema.extend({
  requestyBaseUrl: z3.string().optional(),
  requestyApiKey: z3.string().optional(),
  requestyModelId: z3.string().optional()
});
var humanRelaySchema = baseProviderSettingsSchema;
var fakeAiSchema = baseProviderSettingsSchema.extend({
  fakeAi: z3.unknown().optional()
});
var xaiSchema = apiModelIdProviderModelSchema.extend({
  xaiApiKey: z3.string().optional()
});
var groqSchema = apiModelIdProviderModelSchema.extend({
  groqApiKey: z3.string().optional()
});
var huggingFaceSchema = baseProviderSettingsSchema.extend({
  huggingFaceApiKey: z3.string().optional(),
  huggingFaceModelId: z3.string().optional(),
  huggingFaceInferenceProvider: z3.string().optional()
});
var chutesSchema = apiModelIdProviderModelSchema.extend({
  chutesApiKey: z3.string().optional()
});
var litellmSchema = baseProviderSettingsSchema.extend({
  litellmBaseUrl: z3.string().optional(),
  litellmApiKey: z3.string().optional(),
  litellmModelId: z3.string().optional(),
  litellmUsePromptCache: z3.boolean().optional()
});
var cerebrasSchema = apiModelIdProviderModelSchema.extend({
  cerebrasApiKey: z3.string().optional()
});
var sambaNovaSchema = apiModelIdProviderModelSchema.extend({
  sambaNovaApiKey: z3.string().optional()
});
var zaiSchema = apiModelIdProviderModelSchema.extend({
  zaiApiKey: z3.string().optional(),
  zaiApiLine: z3.union([z3.literal("china"), z3.literal("international")]).optional()
});
var fireworksSchema = apiModelIdProviderModelSchema.extend({
  fireworksApiKey: z3.string().optional()
});
var ioIntelligenceSchema = apiModelIdProviderModelSchema.extend({
  ioIntelligenceModelId: z3.string().optional(),
  ioIntelligenceApiKey: z3.string().optional()
});
var defaultSchema = z3.object({
  apiProvider: z3.undefined()
});
var providerSettingsSchemaDiscriminated = z3.discriminatedUnion("apiProvider", [
  anthropicSchema.merge(z3.object({ apiProvider: z3.literal("anthropic") })),
  claudeCodeSchema.merge(z3.object({ apiProvider: z3.literal("claude-code") })),
  glamaSchema.merge(z3.object({ apiProvider: z3.literal("glama") })),
  openRouterSchema.merge(z3.object({ apiProvider: z3.literal("openrouter") })),
  bedrockSchema.merge(z3.object({ apiProvider: z3.literal("bedrock") })),
  vertexSchema.merge(z3.object({ apiProvider: z3.literal("vertex") })),
  openAiSchema.merge(z3.object({ apiProvider: z3.literal("openai") })),
  ollamaSchema.merge(z3.object({ apiProvider: z3.literal("ollama") })),
  vsCodeLmSchema.merge(z3.object({ apiProvider: z3.literal("vscode-lm") })),
  lmStudioSchema.merge(z3.object({ apiProvider: z3.literal("lmstudio") })),
  geminiSchema.merge(z3.object({ apiProvider: z3.literal("gemini") })),
  geminiCliSchema.merge(z3.object({ apiProvider: z3.literal("gemini-cli") })),
  openAiNativeSchema.merge(z3.object({ apiProvider: z3.literal("openai-native") })),
  mistralSchema.merge(z3.object({ apiProvider: z3.literal("mistral") })),
  deepSeekSchema.merge(z3.object({ apiProvider: z3.literal("deepseek") })),
  doubaoSchema.merge(z3.object({ apiProvider: z3.literal("doubao") })),
  moonshotSchema.merge(z3.object({ apiProvider: z3.literal("moonshot") })),
  unboundSchema.merge(z3.object({ apiProvider: z3.literal("unbound") })),
  requestySchema.merge(z3.object({ apiProvider: z3.literal("requesty") })),
  humanRelaySchema.merge(z3.object({ apiProvider: z3.literal("human-relay") })),
  fakeAiSchema.merge(z3.object({ apiProvider: z3.literal("fake-ai") })),
  xaiSchema.merge(z3.object({ apiProvider: z3.literal("xai") })),
  groqSchema.merge(z3.object({ apiProvider: z3.literal("groq") })),
  huggingFaceSchema.merge(z3.object({ apiProvider: z3.literal("huggingface") })),
  chutesSchema.merge(z3.object({ apiProvider: z3.literal("chutes") })),
  litellmSchema.merge(z3.object({ apiProvider: z3.literal("litellm") })),
  cerebrasSchema.merge(z3.object({ apiProvider: z3.literal("cerebras") })),
  sambaNovaSchema.merge(z3.object({ apiProvider: z3.literal("sambanova") })),
  zaiSchema.merge(z3.object({ apiProvider: z3.literal("zai") })),
  fireworksSchema.merge(z3.object({ apiProvider: z3.literal("fireworks") })),
  ioIntelligenceSchema.merge(z3.object({ apiProvider: z3.literal("io-intelligence") })),
  defaultSchema
]);
var providerSettingsSchema = z3.object({
  apiProvider: providerNamesSchema.optional(),
  ...anthropicSchema.shape,
  ...claudeCodeSchema.shape,
  ...glamaSchema.shape,
  ...openRouterSchema.shape,
  ...bedrockSchema.shape,
  ...vertexSchema.shape,
  ...openAiSchema.shape,
  ...ollamaSchema.shape,
  ...vsCodeLmSchema.shape,
  ...lmStudioSchema.shape,
  ...geminiSchema.shape,
  ...geminiCliSchema.shape,
  ...openAiNativeSchema.shape,
  ...mistralSchema.shape,
  ...deepSeekSchema.shape,
  ...doubaoSchema.shape,
  ...moonshotSchema.shape,
  ...unboundSchema.shape,
  ...requestySchema.shape,
  ...humanRelaySchema.shape,
  ...fakeAiSchema.shape,
  ...xaiSchema.shape,
  ...groqSchema.shape,
  ...huggingFaceSchema.shape,
  ...chutesSchema.shape,
  ...litellmSchema.shape,
  ...cerebrasSchema.shape,
  ...sambaNovaSchema.shape,
  ...zaiSchema.shape,
  ...fireworksSchema.shape,
  ...ioIntelligenceSchema.shape,
  ...codebaseIndexProviderSchema.shape
});
var providerSettingsWithIdSchema = providerSettingsSchema.extend({ id: z3.string().optional() });
var discriminatedProviderSettingsWithIdSchema = providerSettingsSchemaDiscriminated.and(
  z3.object({ id: z3.string().optional() })
);
var PROVIDER_SETTINGS_KEYS = providerSettingsSchema.keyof().options;
var MODEL_ID_KEYS = [
  "apiModelId",
  "glamaModelId",
  "openRouterModelId",
  "openAiModelId",
  "ollamaModelId",
  "lmStudioModelId",
  "lmStudioDraftModelId",
  "unboundModelId",
  "requestyModelId",
  "litellmModelId",
  "huggingFaceModelId",
  "ioIntelligenceModelId"
];
var getModelId = (settings) => {
  const modelIdKey = MODEL_ID_KEYS.find((key) => settings[key]);
  return modelIdKey ? settings[modelIdKey] : void 0;
};
var ANTHROPIC_STYLE_PROVIDERS = ["anthropic", "claude-code", "bedrock"];
var getApiProtocol = (provider, modelId) => {
  if (provider && ANTHROPIC_STYLE_PROVIDERS.includes(provider)) {
    return "anthropic";
  }
  if (provider && provider === "vertex" && modelId && modelId.toLowerCase().includes("claude")) {
    return "anthropic";
  }
  return "openai";
};

// src/agent.ts
var agentToolConfigSchema = z4.object({
  toolId: z4.string(),
  enabled: z4.boolean(),
  config: z4.record(z4.string(), z4.any()).optional()
});
var agentTodoSchema = z4.object({
  id: z4.string(),
  content: z4.string(),
  status: z4.enum(["pending", "in_progress", "completed"]),
  createdAt: z4.number(),
  updatedAt: z4.number(),
  priority: z4.enum(["low", "medium", "high"]).optional()
});
var agentTemplateSourceSchema = z4.object({
  type: z4.enum(["manual", "task"]),
  taskId: z4.string().optional(),
  taskDescription: z4.string().optional(),
  timestamp: z4.number()
});
var a2aAgentCardSchema = z4.object({
  name: z4.string(),
  description: z4.string(),
  skills: z4.array(z4.string()),
  url: z4.string().optional(),
  // 公网可访问的 A2A 端点
  capabilities: z4.object({
    messageTypes: z4.array(z4.string()),
    // 支持的消息类型
    taskTypes: z4.array(z4.string()),
    // 支持的任务类型
    dataFormats: z4.array(z4.string()),
    // 支持的数据格式
    maxConcurrency: z4.number().optional()
    // 最大并发数
  }),
  // 部署信息
  deployment: z4.object({
    type: z4.enum(["pc", "cloud", "docker"]),
    platform: z4.string(),
    region: z4.string().optional(),
    networkReachable: z4.boolean().optional()
    // 网络是否可达
  }).optional(),
  auth: z4.object({
    apiKey: z4.string().optional(),
    authType: z4.enum(["none", "apikey", "oauth"])
  }).optional()
});
var agentPermissionSchema = z4.object({
  action: z4.enum(["read", "execute", "modify", "admin"]),
  resource: z4.string(),
  // 资源路径或标识
  conditions: z4.object({
    timeRange: z4.tuple([z4.number(), z4.number()]).optional(),
    // 时间范围限制
    ipRange: z4.array(z4.string()).optional(),
    // IP范围限制
    userAgent: z4.string().optional(),
    // User-Agent限制
    maxUsage: z4.number().optional(),
    // 最大使用次数限制
    rateLimit: z4.number().optional()
    // 速率限制（每分钟）
  }).optional(),
  description: z4.string().optional()
  // 权限描述
});
var agentApiConfigSchema = providerSettingsSchema.extend({
  originalId: z4.string().optional(),
  // 原始配置ID（用于追踪来源）
  originalName: z4.string().optional(),
  // 原始配置名称
  createdAt: z4.number().optional()
  // 副本创建时间
});
var agentConfigSchema = z4.object({
  id: z4.string(),
  userId: z4.string(),
  name: z4.string(),
  avatar: z4.string(),
  roleDescription: z4.string(),
  apiConfigId: z4.string(),
  // 保留向后兼容
  apiConfig: agentApiConfigSchema.optional(),
  // 新增：嵌入式API配置
  mode: z4.string(),
  tools: z4.array(agentToolConfigSchema),
  todos: z4.array(agentTodoSchema),
  // 新增：A2A 和共享配置
  isPrivate: z4.boolean().optional().default(true),
  // 私有/共享标识，默认true
  shareScope: z4.enum(["friends", "groups", "public"]).optional(),
  // 共享范围：好友、群组、公开
  shareLevel: z4.number().optional(),
  // 共享级别：0=私有，1=好友，2=群组，3=公开
  a2aAgentCard: a2aAgentCardSchema.optional(),
  // A2A 协议智能体卡片
  a2aEndpoint: z4.string().optional(),
  // A2A 服务端点URL
  permissions: z4.array(agentPermissionSchema).optional(),
  // 访问权限列表
  allowedUsers: z4.array(z4.string()).optional(),
  // 好友级别：白名单用户ID
  allowedGroups: z4.array(z4.string()).optional(),
  // 群组级别：白名单群组ID
  deniedUsers: z4.array(z4.string()).optional(),
  // 用户黑名单
  // 发布状态相关字段
  isPublished: z4.boolean().optional().default(false),
  // 是否已发布
  publishInfo: z4.object({
    // 发布信息
    terminalType: z4.enum(["local", "cloud"]).optional(),
    // 发布终端类型
    serverPort: z4.number().optional(),
    // A2A服务器端口
    serverUrl: z4.string().optional(),
    // A2A服务器URL
    publishedAt: z4.string().optional(),
    // 发布时间
    serviceStatus: z4.enum(["online", "offline", "error"]).optional(),
    // 服务状态
    lastHeartbeat: z4.number().optional()
    // 最后心跳时间
  }).optional(),
  templateSource: agentTemplateSourceSchema.optional(),
  createdAt: z4.number(),
  updatedAt: z4.number(),
  lastUsedAt: z4.number().optional(),
  isActive: z4.boolean(),
  version: z4.number()
});
var agentListOptionsSchema = z4.object({
  sortBy: z4.enum(["name", "createdAt", "updatedAt", "lastUsedAt"]).optional(),
  sortOrder: z4.enum(["asc", "desc"]).optional(),
  filterByMode: z4.string().optional(),
  onlyActive: z4.boolean().optional(),
  limit: z4.number().optional(),
  offset: z4.number().optional()
});
var agentExportDataSchema = z4.object({
  agent: agentConfigSchema,
  metadata: z4.object({
    exportedAt: z4.number(),
    exportedBy: z4.string(),
    version: z4.string()
  })
});
var agentTemplateDataSchema = z4.object({
  apiConfigId: z4.string().optional(),
  mode: z4.string().optional(),
  tools: z4.array(z4.string()).optional(),
  templateSource: agentTemplateSourceSchema
});
var resourceQuotaSchema = z4.object({
  maxMemory: z4.number(),
  // 最大内存使用 (MB)
  maxCpuTime: z4.number(),
  // 最大CPU时间 (ms)
  maxFileOperations: z4.number(),
  // 最大文件操作次数
  maxNetworkRequests: z4.number(),
  // 最大网络请求次数
  maxExecutionTime: z4.number(),
  // 最大执行时间 (ms)
  workspaceAccess: z4.object({
    readOnly: z4.boolean(),
    allowedPaths: z4.array(z4.string()),
    deniedPaths: z4.array(z4.string()),
    tempDirectory: z4.string()
  })
});
var resourceUsageSchema = z4.object({
  memory: z4.number(),
  // 当前内存使用 (MB)
  cpuTime: z4.number(),
  // 当前CPU时间 (ms)
  fileOperations: z4.number(),
  // 当前文件操作次数
  networkRequests: z4.number(),
  // 当前网络请求次数
  startTime: z4.number(),
  // 启动时间戳
  lastUpdate: z4.number()
  // 最后更新时间戳
});
var agentInstanceSchema = z4.object({
  agentId: z4.string(),
  // 关联的智能体定义ID
  instanceId: z4.string(),
  // 实例唯一标识
  userId: z4.string(),
  // 实例所属用户
  // 部署信息
  deployment: z4.object({
    type: z4.enum(["pc", "cloud", "docker", "k8s"]),
    platform: z4.string(),
    // 'vscode' | 'docker' | 'k8s'
    location: z4.string().optional(),
    // 部署位置描述
    version: z4.string(),
    // void版本
    region: z4.string().optional()
    // 地理区域
  }),
  // 网络端点
  endpoint: z4.object({
    type: z4.enum(["local_only", "network_reachable", "hybrid"]),
    // 直连信息
    direct: z4.object({
      url: z4.string(),
      // HTTP服务端点
      protocol: z4.enum(["http", "https"]),
      port: z4.number().optional(),
      apiKey: z4.string().optional(),
      // API密钥
      healthCheckPath: z4.string()
      // 健康检查路径
    }).optional(),
    // IM桥接信息
    imBridge: z4.object({
      proxyId: z4.string(),
      // 代理标识
      channelId: z4.string().optional(),
      // 通道标识
      priority: z4.number()
      // 路由优先级
    }),
    networkReachable: z4.boolean().optional(),
    // 是否网络可达
    lastProbeTime: z4.number().optional()
    // 最后探测时间
  }),
  // 实例状态
  status: z4.object({
    state: z4.enum(["starting", "online", "offline", "error", "maintenance"]),
    startTime: z4.number(),
    lastSeen: z4.number(),
    currentLoad: z4.number(),
    // 当前负载 0-1
    errorCount: z4.number(),
    // 错误计数
    errorRate: z4.number(),
    // 错误率 0-1
    uptime: z4.number()
    // 运行时间
  }),
  // 性能指标
  metrics: z4.object({
    avgResponseTime: z4.number(),
    // 平均响应时间 (ms)
    successRate: z4.number(),
    // 成功率 0-1
    throughput: z4.number(),
    // 吞吐量 (req/s)
    memoryUsage: z4.number().optional(),
    // 内存使用率 0-1
    cpuUsage: z4.number().optional(),
    // CPU使用率 0-1
    lastUpdate: z4.number()
    // 最后更新时间
  }),
  // 资源配额
  resourceQuota: resourceQuotaSchema.optional(),
  // 元数据
  metadata: z4.object({
    createdAt: z4.number(),
    updatedAt: z4.number(),
    version: z4.number(),
    tags: z4.array(z4.string()).optional()
  })
});
var agentRequestSchema = z4.object({
  method: z4.string(),
  params: z4.any(),
  timeout: z4.number().optional(),
  priority: z4.enum(["low", "normal", "high"]).optional(),
  retries: z4.number().optional(),
  sourceAgentId: z4.string().optional(),
  sourceUserId: z4.string().optional()
});
var agentResponseSchema = z4.object({
  success: z4.boolean(),
  data: z4.any().optional(),
  error: z4.string().optional(),
  agentId: z4.string(),
  route: z4.enum(["direct", "im_bridge", "hybrid"]).optional(),
  timestamp: z4.number(),
  duration: z4.number().optional()
});
var agentEndpointSchema = z4.object({
  agentId: z4.string(),
  userId: z4.string(),
  type: z4.enum(["local_only", "network_reachable", "hybrid"]),
  directUrl: z4.string().optional(),
  // 直连URL
  apiKey: z4.string().optional(),
  // API密钥
  imProxyId: z4.string(),
  // IM代理标识
  networkReachable: z4.boolean().optional(),
  // 网络可达性
  lastProbeTime: z4.number().optional(),
  // 最后探测时间
  status: z4.object({
    state: z4.enum(["online", "offline", "busy", "error"]),
    lastSeen: z4.number(),
    currentLoad: z4.number(),
    errorRate: z4.number(),
    avgResponseTime: z4.number()
  }),
  deploymentType: z4.enum(["pc", "cloud", "docker", "serverless"])
});
var agentDiscoveryQuerySchema = z4.object({
  userId: z4.string(),
  capabilities: z4.array(z4.string()).optional(),
  categories: z4.array(z4.string()).optional(),
  tags: z4.array(z4.string()).optional(),
  deploymentTypes: z4.array(z4.string()).optional(),
  regions: z4.array(z4.string()).optional(),
  keywords: z4.string().optional(),
  onlyOnline: z4.boolean().optional(),
  visibility: z4.enum(["private", "friends", "groups", "public", "all"]).optional(),
  shareScope: z4.enum(["friends", "groups", "public"]).optional(),
  shareLevel: z4.number().optional(),
  sortBy: z4.enum(["relevance", "performance", "popularity", "rating"]).optional(),
  sortOrder: z4.enum(["asc", "desc"]).optional(),
  offset: z4.number().optional(),
  limit: z4.number().optional()
});
var agentDiscoveryResultSchema = z4.object({
  agentId: z4.string(),
  userId: z4.string(),
  name: z4.string(),
  description: z4.string(),
  avatar: z4.string(),
  // 匹配信息
  matchedCapabilities: z4.array(z4.string()),
  relevanceScore: z4.number(),
  // 部署信息
  deploymentType: z4.enum(["pc", "cloud", "docker", "serverless"]),
  region: z4.string().optional(),
  endpointType: z4.enum(["local_only", "network_reachable", "hybrid"]),
  // 性能指标
  currentLoad: z4.number(),
  avgResponseTime: z4.number(),
  errorRate: z4.number(),
  availability: z4.number(),
  // 使用统计
  totalCalls: z4.number(),
  successRate: z4.number(),
  rating: z4.number().optional(),
  // 权限信息
  isPrivate: z4.boolean(),
  hasAccess: z4.boolean(),
  // 元数据
  category: z4.string().optional(),
  tags: z4.array(z4.string()),
  createdAt: z4.number(),
  lastUsed: z4.number().optional()
});
var unifiedAgentRegistrySchema = z4.object({
  agentId: z4.string(),
  userId: z4.string(),
  name: z4.string(),
  avatar: z4.string(),
  description: z4.string(),
  // 能力信息
  capabilities: z4.object({
    tools: z4.array(z4.string()),
    skills: z4.array(z4.string()),
    categories: z4.array(z4.string())
  }),
  // 部署信息
  deployment: z4.object({
    type: z4.enum(["pc", "cloud", "docker", "serverless"]),
    region: z4.string().optional(),
    endpointType: z4.enum(["local_only", "network_reachable", "hybrid"]),
    directUrl: z4.string().optional(),
    imProxyId: z4.string().optional()
  }),
  // 状态信息
  status: z4.object({
    state: z4.enum(["online", "offline", "busy", "maintenance"]),
    lastSeen: z4.number(),
    currentLoad: z4.number(),
    errorRate: z4.number(),
    avgResponseTime: z4.number()
  }),
  // 共享配置
  sharing: z4.object({
    isPrivate: z4.boolean(),
    shareScope: z4.enum(["none", "friends", "groups", "public"]),
    shareLevel: z4.number().min(0).max(3),
    permissions: z4.array(z4.enum(["read", "execute", "modify"])),
    allowedUsers: z4.array(z4.string()),
    allowedGroups: z4.array(z4.string()),
    deniedUsers: z4.array(z4.string())
  }),
  // 元数据
  metadata: z4.object({
    createdAt: z4.number(),
    updatedAt: z4.number(),
    version: z4.string(),
    tags: z4.array(z4.string())
  })
});

// src/cloud.ts
import { z as z14 } from "zod";

// src/global-settings.ts
import { z as z12 } from "zod";

// src/history.ts
import { z as z6 } from "zod";

// src/message.ts
import { z as z5 } from "zod";
var clineAsks = [
  "followup",
  "command",
  "command_output",
  "completion_result",
  "tool",
  "api_req_failed",
  "resume_task",
  "resume_completed_task",
  "mistake_limit_reached",
  "browser_action_launch",
  "use_mcp_server",
  "auto_approval_max_req_reached"
];
var clineAskSchema = z5.enum(clineAsks);
var blockingAsks = [
  "api_req_failed",
  "mistake_limit_reached",
  "completion_result",
  "resume_task",
  "resume_completed_task",
  "command_output",
  "auto_approval_max_req_reached"
];
function isBlockingAsk(ask) {
  return blockingAsks.includes(ask);
}
var clineSays = [
  "error",
  "api_req_started",
  "api_req_finished",
  "api_req_retried",
  "api_req_retry_delayed",
  "api_req_deleted",
  "text",
  "reasoning",
  "completion_result",
  "user_feedback",
  "user_feedback_diff",
  "command_output",
  "shell_integration_warning",
  "browser_action",
  "browser_action_result",
  "mcp_server_request_started",
  "mcp_server_response",
  "subtask_result",
  "checkpoint_saved",
  "rooignore_error",
  "diff_error",
  "condense_context",
  "condense_context_error",
  "codebase_search_result",
  "user_edit_todos"
];
var clineSaySchema = z5.enum(clineSays);
var toolProgressStatusSchema = z5.object({
  icon: z5.string().optional(),
  text: z5.string().optional()
});
var contextCondenseSchema = z5.object({
  cost: z5.number(),
  prevContextTokens: z5.number(),
  newContextTokens: z5.number(),
  summary: z5.string()
});
var clineMessageSchema = z5.object({
  ts: z5.number(),
  type: z5.union([z5.literal("ask"), z5.literal("say")]),
  ask: clineAskSchema.optional(),
  say: clineSaySchema.optional(),
  text: z5.string().optional(),
  images: z5.array(z5.string()).optional(),
  partial: z5.boolean().optional(),
  reasoning: z5.string().optional(),
  conversationHistoryIndex: z5.number().optional(),
  checkpoint: z5.record(z5.string(), z5.unknown()).optional(),
  progressStatus: toolProgressStatusSchema.optional(),
  contextCondense: contextCondenseSchema.optional(),
  isProtected: z5.boolean().optional(),
  apiProtocol: z5.union([z5.literal("openai"), z5.literal("anthropic")]).optional(),
  metadata: z5.object({
    gpt5: z5.object({
      previous_response_id: z5.string().optional(),
      instructions: z5.string().optional(),
      reasoning_summary: z5.string().optional()
    }).optional(),
    taskId: z5.string().optional()
  }).optional()
});
var tokenUsageSchema = z5.object({
  totalTokensIn: z5.number(),
  totalTokensOut: z5.number(),
  totalCacheWrites: z5.number().optional(),
  totalCacheReads: z5.number().optional(),
  totalCost: z5.number(),
  contextTokens: z5.number()
});

// src/history.ts
var historyItemSchema = z6.object({
  id: z6.string(),
  number: z6.number(),
  ts: z6.number(),
  task: z6.string(),
  tokensIn: z6.number(),
  tokensOut: z6.number(),
  cacheWrites: z6.number().optional(),
  cacheReads: z6.number().optional(),
  totalCost: z6.number(),
  size: z6.number().optional(),
  workspace: z6.string().optional(),
  mode: z6.string().optional(),
  terminalNo: z6.number().optional(),
  // 🔥 智能体任务标记
  source: z6.enum(["user", "agent"]).optional(),
  // 任务来源：用户或智能体
  agentId: z6.string().optional(),
  // 智能体ID（仅当 source === "agent" 时存在）
  // 🔥 消息历史（用于查看已完成的智能体任务）
  clineMessages: z6.array(clineMessageSchema).optional()
});

// src/experiment.ts
import { z as z7 } from "zod";
var experimentIds = ["powerSteering", "multiFileApplyDiff", "preventFocusDisruption", "assistantMessageParser"];
var experimentIdsSchema = z7.enum(experimentIds);
var experimentsSchema = z7.object({
  powerSteering: z7.boolean().optional(),
  multiFileApplyDiff: z7.boolean().optional(),
  preventFocusDisruption: z7.boolean().optional(),
  assistantMessageParser: z7.boolean().optional()
});

// src/telemetry.ts
import { z as z8 } from "zod";
var telemetrySettings = ["unset", "enabled", "disabled"];
var telemetrySettingsSchema = z8.enum(telemetrySettings);
var TelemetryEventName = /* @__PURE__ */ ((TelemetryEventName2) => {
  TelemetryEventName2["TASK_CREATED"] = "Task Created";
  TelemetryEventName2["TASK_RESTARTED"] = "Task Reopened";
  TelemetryEventName2["TASK_COMPLETED"] = "Task Completed";
  TelemetryEventName2["TASK_MESSAGE"] = "Task Message";
  TelemetryEventName2["TASK_CONVERSATION_MESSAGE"] = "Conversation Message";
  TelemetryEventName2["LLM_COMPLETION"] = "LLM Completion";
  TelemetryEventName2["MODE_SWITCH"] = "Mode Switched";
  TelemetryEventName2["MODE_SELECTOR_OPENED"] = "Mode Selector Opened";
  TelemetryEventName2["TOOL_USED"] = "Tool Used";
  TelemetryEventName2["CHECKPOINT_CREATED"] = "Checkpoint Created";
  TelemetryEventName2["CHECKPOINT_RESTORED"] = "Checkpoint Restored";
  TelemetryEventName2["CHECKPOINT_DIFFED"] = "Checkpoint Diffed";
  TelemetryEventName2["TAB_SHOWN"] = "Tab Shown";
  TelemetryEventName2["MODE_SETTINGS_CHANGED"] = "Mode Setting Changed";
  TelemetryEventName2["CUSTOM_MODE_CREATED"] = "Custom Mode Created";
  TelemetryEventName2["CONTEXT_CONDENSED"] = "Context Condensed";
  TelemetryEventName2["SLIDING_WINDOW_TRUNCATION"] = "Sliding Window Truncation";
  TelemetryEventName2["CODE_ACTION_USED"] = "Code Action Used";
  TelemetryEventName2["PROMPT_ENHANCED"] = "Prompt Enhanced";
  TelemetryEventName2["TITLE_BUTTON_CLICKED"] = "Title Button Clicked";
  TelemetryEventName2["AUTHENTICATION_INITIATED"] = "Authentication Initiated";
  TelemetryEventName2["MARKETPLACE_ITEM_INSTALLED"] = "Marketplace Item Installed";
  TelemetryEventName2["MARKETPLACE_ITEM_REMOVED"] = "Marketplace Item Removed";
  TelemetryEventName2["MARKETPLACE_TAB_VIEWED"] = "Marketplace Tab Viewed";
  TelemetryEventName2["MARKETPLACE_INSTALL_BUTTON_CLICKED"] = "Marketplace Install Button Clicked";
  TelemetryEventName2["SHARE_BUTTON_CLICKED"] = "Share Button Clicked";
  TelemetryEventName2["SHARE_ORGANIZATION_CLICKED"] = "Share Organization Clicked";
  TelemetryEventName2["SHARE_PUBLIC_CLICKED"] = "Share Public Clicked";
  TelemetryEventName2["SHARE_CONNECT_TO_CLOUD_CLICKED"] = "Share Connect To Cloud Clicked";
  TelemetryEventName2["ACCOUNT_CONNECT_CLICKED"] = "Account Connect Clicked";
  TelemetryEventName2["ACCOUNT_CONNECT_SUCCESS"] = "Account Connect Success";
  TelemetryEventName2["ACCOUNT_LOGOUT_CLICKED"] = "Account Logout Clicked";
  TelemetryEventName2["ACCOUNT_LOGOUT_SUCCESS"] = "Account Logout Success";
  TelemetryEventName2["SCHEMA_VALIDATION_ERROR"] = "Schema Validation Error";
  TelemetryEventName2["DIFF_APPLICATION_ERROR"] = "Diff Application Error";
  TelemetryEventName2["SHELL_INTEGRATION_ERROR"] = "Shell Integration Error";
  TelemetryEventName2["CONSECUTIVE_MISTAKE_ERROR"] = "Consecutive Mistake Error";
  TelemetryEventName2["CODE_INDEX_ERROR"] = "Code Index Error";
  return TelemetryEventName2;
})(TelemetryEventName || {});
var appPropertiesSchema = z8.object({
  appName: z8.string(),
  appVersion: z8.string(),
  vscodeVersion: z8.string(),
  platform: z8.string(),
  editorName: z8.string(),
  language: z8.string(),
  mode: z8.string(),
  cloudIsAuthenticated: z8.boolean().optional()
});
var taskPropertiesSchema = z8.object({
  taskId: z8.string().optional(),
  apiProvider: z8.enum(providerNames).optional(),
  modelId: z8.string().optional(),
  diffStrategy: z8.string().optional(),
  isSubtask: z8.boolean().optional(),
  todos: z8.object({
    total: z8.number(),
    completed: z8.number(),
    inProgress: z8.number(),
    pending: z8.number()
  }).optional()
});
var gitPropertiesSchema = z8.object({
  repositoryUrl: z8.string().optional(),
  repositoryName: z8.string().optional(),
  defaultBranch: z8.string().optional()
});
var telemetryPropertiesSchema = z8.object({
  ...appPropertiesSchema.shape,
  ...taskPropertiesSchema.shape,
  ...gitPropertiesSchema.shape
});
var rooCodeTelemetryEventSchema = z8.discriminatedUnion("type", [
  z8.object({
    type: z8.enum([
      "Task Created" /* TASK_CREATED */,
      "Task Reopened" /* TASK_RESTARTED */,
      "Task Completed" /* TASK_COMPLETED */,
      "Conversation Message" /* TASK_CONVERSATION_MESSAGE */,
      "Mode Switched" /* MODE_SWITCH */,
      "Mode Selector Opened" /* MODE_SELECTOR_OPENED */,
      "Tool Used" /* TOOL_USED */,
      "Checkpoint Created" /* CHECKPOINT_CREATED */,
      "Checkpoint Restored" /* CHECKPOINT_RESTORED */,
      "Checkpoint Diffed" /* CHECKPOINT_DIFFED */,
      "Code Action Used" /* CODE_ACTION_USED */,
      "Prompt Enhanced" /* PROMPT_ENHANCED */,
      "Title Button Clicked" /* TITLE_BUTTON_CLICKED */,
      "Authentication Initiated" /* AUTHENTICATION_INITIATED */,
      "Marketplace Item Installed" /* MARKETPLACE_ITEM_INSTALLED */,
      "Marketplace Item Removed" /* MARKETPLACE_ITEM_REMOVED */,
      "Marketplace Tab Viewed" /* MARKETPLACE_TAB_VIEWED */,
      "Marketplace Install Button Clicked" /* MARKETPLACE_INSTALL_BUTTON_CLICKED */,
      "Share Button Clicked" /* SHARE_BUTTON_CLICKED */,
      "Share Organization Clicked" /* SHARE_ORGANIZATION_CLICKED */,
      "Share Public Clicked" /* SHARE_PUBLIC_CLICKED */,
      "Share Connect To Cloud Clicked" /* SHARE_CONNECT_TO_CLOUD_CLICKED */,
      "Account Connect Clicked" /* ACCOUNT_CONNECT_CLICKED */,
      "Account Connect Success" /* ACCOUNT_CONNECT_SUCCESS */,
      "Account Logout Clicked" /* ACCOUNT_LOGOUT_CLICKED */,
      "Account Logout Success" /* ACCOUNT_LOGOUT_SUCCESS */,
      "Schema Validation Error" /* SCHEMA_VALIDATION_ERROR */,
      "Diff Application Error" /* DIFF_APPLICATION_ERROR */,
      "Shell Integration Error" /* SHELL_INTEGRATION_ERROR */,
      "Consecutive Mistake Error" /* CONSECUTIVE_MISTAKE_ERROR */,
      "Code Index Error" /* CODE_INDEX_ERROR */,
      "Context Condensed" /* CONTEXT_CONDENSED */,
      "Sliding Window Truncation" /* SLIDING_WINDOW_TRUNCATION */,
      "Tab Shown" /* TAB_SHOWN */,
      "Mode Setting Changed" /* MODE_SETTINGS_CHANGED */,
      "Custom Mode Created" /* CUSTOM_MODE_CREATED */
    ]),
    properties: telemetryPropertiesSchema
  }),
  z8.object({
    type: z8.literal("Task Message" /* TASK_MESSAGE */),
    properties: z8.object({
      ...telemetryPropertiesSchema.shape,
      taskId: z8.string(),
      message: clineMessageSchema
    })
  }),
  z8.object({
    type: z8.literal("LLM Completion" /* LLM_COMPLETION */),
    properties: z8.object({
      ...telemetryPropertiesSchema.shape,
      inputTokens: z8.number(),
      outputTokens: z8.number(),
      cacheReadTokens: z8.number().optional(),
      cacheWriteTokens: z8.number().optional(),
      cost: z8.number().optional()
    })
  })
]);

// src/mode.ts
import { z as z10 } from "zod";

// src/tool.ts
import { z as z9 } from "zod";
var toolGroups = ["read", "edit", "browser", "command", "mcp", "modes"];
var toolGroupsSchema = z9.enum(toolGroups);
var toolNames = [
  "execute_command",
  "read_file",
  "write_to_file",
  "apply_diff",
  "insert_content",
  "search_and_replace",
  "search_files",
  "list_files",
  "list_code_definition_names",
  "browser_action",
  "use_mcp_tool",
  "access_mcp_resource",
  "ask_followup_question",
  "attempt_completion",
  "switch_mode",
  "new_task",
  "fetch_instructions",
  "codebase_search",
  "update_todo_list"
];
var toolNamesSchema = z9.enum(toolNames);
var toolUsageSchema = z9.record(
  toolNamesSchema,
  z9.object({
    attempts: z9.number(),
    failures: z9.number()
  })
);

// src/mode.ts
var groupOptionsSchema = z10.object({
  fileRegex: z10.string().optional().refine(
    (pattern) => {
      if (!pattern) {
        return true;
      }
      try {
        new RegExp(pattern);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid regular expression pattern" }
  ),
  description: z10.string().optional()
});
var groupEntrySchema = z10.union([toolGroupsSchema, z10.tuple([toolGroupsSchema, groupOptionsSchema])]);
var groupEntryArraySchema = z10.array(groupEntrySchema).refine(
  (groups) => {
    const seen = /* @__PURE__ */ new Set();
    return groups.every((group) => {
      const groupName = Array.isArray(group) ? group[0] : group;
      if (seen.has(groupName)) {
        return false;
      }
      seen.add(groupName);
      return true;
    });
  },
  { message: "Duplicate groups are not allowed" }
);
var modeConfigSchema = z10.object({
  slug: z10.string().regex(/^[a-zA-Z0-9-]+$/, "Slug must contain only letters numbers and dashes"),
  name: z10.string().min(1, "Name is required"),
  roleDefinition: z10.string().min(1, "Role definition is required"),
  whenToUse: z10.string().optional(),
  description: z10.string().optional(),
  customInstructions: z10.string().optional(),
  groups: groupEntryArraySchema,
  source: z10.enum(["global", "project"]).optional()
});
var customModesSettingsSchema = z10.object({
  customModes: z10.array(modeConfigSchema).refine(
    (modes) => {
      const slugs = /* @__PURE__ */ new Set();
      return modes.every((mode) => {
        if (slugs.has(mode.slug)) {
          return false;
        }
        slugs.add(mode.slug);
        return true;
      });
    },
    {
      message: "Duplicate mode slugs are not allowed"
    }
  )
});
var promptComponentSchema = z10.object({
  roleDefinition: z10.string().optional(),
  whenToUse: z10.string().optional(),
  description: z10.string().optional(),
  customInstructions: z10.string().optional()
});
var customModePromptsSchema = z10.record(z10.string(), promptComponentSchema.optional());
var customSupportPromptsSchema = z10.record(z10.string(), z10.string().optional());
var DEFAULT_MODES = [
  {
    slug: "architect",
    name: "\u{1F3D7}\uFE0F Architect",
    roleDefinition: "You are Roo, an experienced technical leader who is inquisitive and an excellent planner. Your goal is to gather information and get context to create a detailed plan for accomplishing the user's task, which the user will review and approve before they switch into another mode to implement the solution.",
    whenToUse: "Use this mode when you need to plan, design, or strategize before implementation. Perfect for breaking down complex problems, creating technical specifications, designing system architecture, or brainstorming solutions before coding.",
    description: "Plan and design before implementation",
    groups: ["read", ["edit", { fileRegex: "\\.md$", description: "Markdown files only" }], "browser", "mcp"],
    customInstructions: "1. Do some information gathering (using provided tools) to get more context about the task.\n\n2. You should also ask the user clarifying questions to get a better understanding of the task.\n\n3. Once you've gained more context about the user's request, break down the task into clear, actionable steps and create a todo list using the `update_todo_list` tool. Each todo item should be:\n   - Specific and actionable\n   - Listed in logical execution order\n   - Focused on a single, well-defined outcome\n   - Clear enough that another mode could execute it independently\n\n   **Note:** If the `update_todo_list` tool is not available, write the plan to a markdown file (e.g., `plan.md` or `todo.md`) instead.\n\n4. As you gather more information or discover new requirements, update the todo list to reflect the current understanding of what needs to be accomplished.\n\n5. Ask the user if they are pleased with this plan, or if they would like to make any changes. Think of this as a brainstorming session where you can discuss the task and refine the todo list.\n\n6. Include Mermaid diagrams if they help clarify complex workflows or system architecture. Please avoid using double quotes (\"\") and parentheses () inside square brackets ([]) in Mermaid diagrams, as this can cause parsing errors.\n\n7. Use the switch_mode tool to request that the user switch to another mode to implement the solution.\n\n**IMPORTANT: Focus on creating clear, actionable todo lists rather than lengthy markdown documents. Use the todo list as your primary planning tool to track and organize the work that needs to be done.**"
  },
  {
    slug: "code",
    name: "\u{1F4BB} Code",
    roleDefinition: "You are Roo, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices.",
    whenToUse: "Use this mode when you need to write, modify, or refactor code. Ideal for implementing features, fixing bugs, creating new files, or making code improvements across any programming language or framework.",
    description: "Write, modify, and refactor code",
    groups: ["read", "edit", "browser", "command", "mcp"]
  },
  {
    slug: "ask",
    name: "\u2753 Ask",
    roleDefinition: "You are Roo, a knowledgeable technical assistant focused on answering questions and providing information about software development, technology, and related topics.",
    whenToUse: "Use this mode when you need explanations, documentation, or answers to technical questions. Best for understanding concepts, analyzing existing code, getting recommendations, or learning about technologies without making changes.",
    description: "Get answers and explanations",
    groups: ["read", "browser", "mcp"],
    customInstructions: "You can analyze code, explain concepts, and access external resources. Always answer the user's questions thoroughly, and do not switch to implementing code unless explicitly requested by the user. Include Mermaid diagrams when they clarify your response."
  },
  {
    slug: "debug",
    name: "\u{1FAB2} Debug",
    roleDefinition: "You are Roo, an expert software debugger specializing in systematic problem diagnosis and resolution.",
    whenToUse: "Use this mode when you're troubleshooting issues, investigating errors, or diagnosing problems. Specialized in systematic debugging, adding logging, analyzing stack traces, and identifying root causes before applying fixes.",
    description: "Diagnose and fix software issues",
    groups: ["read", "edit", "browser", "command", "mcp"],
    customInstructions: "Reflect on 5-7 different possible sources of the problem, distill those down to 1-2 most likely sources, and then add logs to validate your assumptions. Explicitly ask the user to confirm the diagnosis before fixing the problem."
  },
  {
    slug: "orchestrator",
    name: "\u{1FA83} Orchestrator",
    roleDefinition: "You are Roo, a strategic workflow orchestrator who coordinates complex tasks by delegating them to appropriate specialized modes. You have a comprehensive understanding of each mode's capabilities and limitations, allowing you to effectively break down complex problems into discrete tasks that can be solved by different specialists.",
    whenToUse: "Use this mode for complex, multi-step projects that require coordination across different specialties. Ideal when you need to break down large tasks into subtasks, manage workflows, or coordinate work that spans multiple domains or expertise areas.",
    description: "Coordinate tasks across multiple modes",
    groups: [],
    customInstructions: "Your role is to coordinate complex workflows by delegating tasks to specialized modes. As an orchestrator, you should:\n\n1. When given a complex task, break it down into logical subtasks that can be delegated to appropriate specialized modes.\n\n2. For each subtask, use the `new_task` tool to delegate. Choose the most appropriate mode for the subtask's specific goal and provide comprehensive instructions in the `message` parameter. These instructions must include:\n    *   All necessary context from the parent task or previous subtasks required to complete the work.\n    *   A clearly defined scope, specifying exactly what the subtask should accomplish.\n    *   An explicit statement that the subtask should *only* perform the work outlined in these instructions and not deviate.\n    *   An instruction for the subtask to signal completion by using the `attempt_completion` tool, providing a concise yet thorough summary of the outcome in the `result` parameter, keeping in mind that this summary will be the source of truth used to keep track of what was completed on this project.\n    *   A statement that these specific instructions supersede any conflicting general instructions the subtask's mode might have.\n\n3. Track and manage the progress of all subtasks. When a subtask is completed, analyze its results and determine the next steps.\n\n4. Help the user understand how the different subtasks fit together in the overall workflow. Provide clear reasoning about why you're delegating specific tasks to specific modes.\n\n5. When all subtasks are completed, synthesize the results and provide a comprehensive overview of what was accomplished.\n\n6. Ask clarifying questions when necessary to better understand how to break down complex tasks effectively.\n\n7. Suggest improvements to the workflow based on the results of completed subtasks.\n\nUse subtasks to maintain clarity. If a request significantly shifts focus or requires a different expertise (mode), consider creating a subtask rather than overloading the current one."
  }
];

// src/vscode.ts
import { z as z11 } from "zod";
var codeActionIds = ["explainCode", "fixCode", "improveCode", "addToContext", "newTask"];
var terminalActionIds = ["terminalAddToContext", "terminalFixCommand", "terminalExplainCommand"];
var commandIds = [
  "activationCompleted",
  "plusButtonClicked",
  "promptsButtonClicked",
  "mcpButtonClicked",
  "historyButtonClicked",
  "marketplaceButtonClicked",
  "popoutButtonClicked",
  "accountButtonClicked",
  "settingsButtonClicked",
  "agentsButtonClicked",
  "openInNewTab",
  "showHumanRelayDialog",
  "registerHumanRelayCallback",
  "unregisterHumanRelayCallback",
  "handleHumanRelayResponse",
  "newTask",
  "executeTask",
  "executeTaskWithMode",
  "setCustomStoragePath",
  "importSettings",
  "focusInput",
  "acceptInput",
  "focusPanel",
  "imPlatform.manageToken",
  "imPlatform.setToken",
  "imPlatform.clearToken",
  "debugResetAllProfiles",
  "autoConfigureProvider",
  "switchToDefaultConfig",
  "receiveUserInfo",
  "sendCloudPCNotification",
  "testSetTerminalNo"
];
var languages = [
  "ca",
  "de",
  "en",
  "es",
  "fr",
  "hi",
  "id",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt-BR",
  "ru",
  "tr",
  "vi",
  "zh-CN",
  "zh-TW"
];
var languagesSchema = z11.enum(languages);
var isLanguage = (value) => languages.includes(value);

// src/global-settings.ts
var DEFAULT_WRITE_DELAY_MS = 1e3;
var DEFAULT_TERMINAL_OUTPUT_CHARACTER_LIMIT = 5e4;
var DEFAULT_USAGE_COLLECTION_TIMEOUT_MS = 3e4;
var globalSettingsSchema = z12.object({
  currentApiConfigName: z12.string().optional(),
  listApiConfigMeta: z12.array(providerSettingsEntrySchema).optional(),
  pinnedApiConfigs: z12.record(z12.string(), z12.boolean()).optional(),
  lastShownAnnouncementId: z12.string().optional(),
  customInstructions: z12.string().optional(),
  taskHistory: z12.array(historyItemSchema).optional(),
  condensingApiConfigId: z12.string().optional(),
  customCondensingPrompt: z12.string().optional(),
  autoApprovalEnabled: z12.boolean().optional(),
  alwaysAllowReadOnly: z12.boolean().optional(),
  alwaysAllowReadOnlyOutsideWorkspace: z12.boolean().optional(),
  alwaysAllowWrite: z12.boolean().optional(),
  alwaysAllowWriteOutsideWorkspace: z12.boolean().optional(),
  alwaysAllowWriteProtected: z12.boolean().optional(),
  writeDelayMs: z12.number().min(0).optional(),
  alwaysAllowBrowser: z12.boolean().optional(),
  alwaysApproveResubmit: z12.boolean().optional(),
  requestDelaySeconds: z12.number().optional(),
  alwaysAllowMcp: z12.boolean().optional(),
  alwaysAllowModeSwitch: z12.boolean().optional(),
  alwaysAllowSubtasks: z12.boolean().optional(),
  alwaysAllowExecute: z12.boolean().optional(),
  alwaysAllowFollowupQuestions: z12.boolean().optional(),
  followupAutoApproveTimeoutMs: z12.number().optional(),
  alwaysAllowUpdateTodoList: z12.boolean().optional(),
  allowedCommands: z12.array(z12.string()).optional(),
  deniedCommands: z12.array(z12.string()).optional(),
  commandExecutionTimeout: z12.number().optional(),
  commandTimeoutAllowlist: z12.array(z12.string()).optional(),
  preventCompletionWithOpenTodos: z12.boolean().optional(),
  allowedMaxRequests: z12.number().nullish(),
  allowedMaxCost: z12.number().nullish(),
  autoCondenseContext: z12.boolean().optional(),
  autoCondenseContextPercent: z12.number().optional(),
  maxConcurrentFileReads: z12.number().optional(),
  /**
   * Whether to include diagnostic messages (errors, warnings) in tool outputs
   * @default true
   */
  includeDiagnosticMessages: z12.boolean().optional(),
  /**
   * Maximum number of diagnostic messages to include in tool outputs
   * @default 50
   */
  maxDiagnosticMessages: z12.number().optional(),
  browserToolEnabled: z12.boolean().optional(),
  browserViewportSize: z12.string().optional(),
  screenshotQuality: z12.number().optional(),
  remoteBrowserEnabled: z12.boolean().optional(),
  remoteBrowserHost: z12.string().optional(),
  cachedChromeHostUrl: z12.string().optional(),
  enableCheckpoints: z12.boolean().optional(),
  ttsEnabled: z12.boolean().optional(),
  ttsSpeed: z12.number().optional(),
  soundEnabled: z12.boolean().optional(),
  soundVolume: z12.number().optional(),
  maxOpenTabsContext: z12.number().optional(),
  maxWorkspaceFiles: z12.number().optional(),
  showRooIgnoredFiles: z12.boolean().optional(),
  maxReadFileLine: z12.number().optional(),
  maxImageFileSize: z12.number().optional(),
  maxTotalImageSize: z12.number().optional(),
  terminalOutputLineLimit: z12.number().optional(),
  terminalOutputCharacterLimit: z12.number().optional(),
  terminalShellIntegrationTimeout: z12.number().optional(),
  terminalShellIntegrationDisabled: z12.boolean().optional(),
  terminalCommandDelay: z12.number().optional(),
  terminalPowershellCounter: z12.boolean().optional(),
  terminalZshClearEolMark: z12.boolean().optional(),
  terminalZshOhMy: z12.boolean().optional(),
  terminalZshP10k: z12.boolean().optional(),
  terminalZdotdir: z12.boolean().optional(),
  terminalCompressProgressBar: z12.boolean().optional(),
  diagnosticsEnabled: z12.boolean().optional(),
  rateLimitSeconds: z12.number().optional(),
  diffEnabled: z12.boolean().optional(),
  fuzzyMatchThreshold: z12.number().optional(),
  experiments: experimentsSchema.optional(),
  codebaseIndexModels: codebaseIndexModelsSchema.optional(),
  codebaseIndexConfig: codebaseIndexConfigSchema.optional(),
  language: languagesSchema.optional(),
  telemetrySetting: telemetrySettingsSchema.optional(),
  mcpEnabled: z12.boolean().optional(),
  enableMcpServerCreation: z12.boolean().optional(),
  remoteControlEnabled: z12.boolean().optional(),
  mode: z12.string().optional(),
  modeApiConfigs: z12.record(z12.string(), z12.string()).optional(),
  customModes: z12.array(modeConfigSchema).optional(),
  customModePrompts: customModePromptsSchema.optional(),
  customSupportPrompts: customSupportPromptsSchema.optional(),
  enhancementApiConfigId: z12.string().optional(),
  includeTaskHistoryInEnhance: z12.boolean().optional(),
  historyPreviewCollapsed: z12.boolean().optional(),
  profileThresholds: z12.record(z12.string(), z12.number()).optional(),
  hasOpenedModeSelector: z12.boolean().optional(),
  lastModeExportPath: z12.string().optional(),
  lastModeImportPath: z12.string().optional(),
  // IM integration data
  imContacts: z12.object({
    friends: z12.array(
      z12.object({
        id: z12.number(),
        nickName: z12.string(),
        headImage: z12.string(),
        deleted: z12.boolean(),
        online: z12.boolean(),
        onlineWeb: z12.boolean(),
        onlineApp: z12.boolean()
      })
    ).optional(),
    groups: z12.array(
      z12.object({
        id: z12.number(),
        name: z12.string(),
        ownerId: z12.number(),
        headImage: z12.string(),
        headImageThumb: z12.string(),
        notice: z12.string(),
        remarkNickName: z12.string(),
        showNickName: z12.string(),
        showGroupName: z12.string(),
        remarkGroupName: z12.string(),
        dissolve: z12.boolean(),
        quit: z12.boolean(),
        isBanned: z12.boolean(),
        reason: z12.string()
      })
    ).optional(),
    lastUpdated: z12.number().optional()
  }).optional(),
  // A2A testing mode configuration
  agentA2AMode: z12.object({
    enabled: z12.boolean(),
    agentId: z12.string(),
    agentName: z12.string(),
    serverUrl: z12.string(),
    serverPort: z12.number(),
    isDebugMode: z12.boolean().optional()
    // 标识是否为调试模式
  }).nullable().optional()
});
var GLOBAL_SETTINGS_KEYS = globalSettingsSchema.keyof().options;
var rooCodeSettingsSchema = providerSettingsSchema.merge(globalSettingsSchema);
var SECRET_STATE_KEYS = [
  "apiKey",
  "glamaApiKey",
  "openRouterApiKey",
  "awsAccessKey",
  "awsApiKey",
  "awsSecretKey",
  "awsSessionToken",
  "openAiApiKey",
  "geminiApiKey",
  "openAiNativeApiKey",
  "cerebrasApiKey",
  "deepSeekApiKey",
  "moonshotApiKey",
  "mistralApiKey",
  "unboundApiKey",
  "requestyApiKey",
  "xaiApiKey",
  "groqApiKey",
  "chutesApiKey",
  "litellmApiKey",
  "codeIndexOpenAiKey",
  "codeIndexQdrantApiKey",
  "codebaseIndexOpenAiCompatibleApiKey",
  "codebaseIndexGeminiApiKey",
  "codebaseIndexMistralApiKey",
  "huggingFaceApiKey",
  "sambaNovaApiKey",
  "fireworksApiKey",
  "ioIntelligenceApiKey"
];
var isSecretStateKey = (key) => SECRET_STATE_KEYS.includes(key);
var GLOBAL_STATE_KEYS = [...GLOBAL_SETTINGS_KEYS, ...PROVIDER_SETTINGS_KEYS].filter(
  (key) => !SECRET_STATE_KEYS.includes(key)
);
var isGlobalStateKey = (key) => GLOBAL_STATE_KEYS.includes(key);
var EVALS_SETTINGS = {
  apiProvider: "openrouter",
  openRouterUseMiddleOutTransform: false,
  lastShownAnnouncementId: "jul-09-2025-3-23-0",
  pinnedApiConfigs: {},
  autoApprovalEnabled: true,
  alwaysAllowReadOnly: true,
  alwaysAllowReadOnlyOutsideWorkspace: false,
  alwaysAllowWrite: true,
  alwaysAllowWriteOutsideWorkspace: false,
  alwaysAllowWriteProtected: false,
  writeDelayMs: 1e3,
  alwaysAllowBrowser: true,
  alwaysApproveResubmit: true,
  requestDelaySeconds: 10,
  alwaysAllowMcp: true,
  alwaysAllowModeSwitch: true,
  alwaysAllowSubtasks: true,
  alwaysAllowExecute: true,
  alwaysAllowFollowupQuestions: true,
  alwaysAllowUpdateTodoList: true,
  followupAutoApproveTimeoutMs: 0,
  allowedCommands: ["*"],
  commandExecutionTimeout: 20,
  commandTimeoutAllowlist: [],
  preventCompletionWithOpenTodos: false,
  browserToolEnabled: false,
  browserViewportSize: "900x600",
  screenshotQuality: 75,
  remoteBrowserEnabled: false,
  ttsEnabled: false,
  ttsSpeed: 1,
  soundEnabled: false,
  soundVolume: 0.5,
  terminalOutputLineLimit: 500,
  terminalOutputCharacterLimit: DEFAULT_TERMINAL_OUTPUT_CHARACTER_LIMIT,
  terminalShellIntegrationTimeout: 3e4,
  terminalCommandDelay: 0,
  terminalPowershellCounter: false,
  terminalZshOhMy: true,
  terminalZshClearEolMark: true,
  terminalZshP10k: false,
  terminalZdotdir: true,
  terminalCompressProgressBar: true,
  terminalShellIntegrationDisabled: true,
  diagnosticsEnabled: true,
  diffEnabled: true,
  fuzzyMatchThreshold: 1,
  enableCheckpoints: false,
  rateLimitSeconds: 0,
  maxOpenTabsContext: 20,
  maxWorkspaceFiles: 200,
  showRooIgnoredFiles: true,
  maxReadFileLine: -1,
  // -1 to enable full file reading.
  includeDiagnosticMessages: true,
  maxDiagnosticMessages: 50,
  language: "en",
  telemetrySetting: "enabled",
  mcpEnabled: false,
  remoteControlEnabled: false,
  mode: "code",
  // "architect",
  customModes: []
};
var EVALS_TIMEOUT = 5 * 60 * 1e3;

// src/marketplace.ts
import { z as z13 } from "zod";
var mcpParameterSchema = z13.object({
  name: z13.string().min(1),
  key: z13.string().min(1),
  placeholder: z13.string().optional(),
  optional: z13.boolean().optional().default(false)
});
var mcpInstallationMethodSchema = z13.object({
  name: z13.string().min(1),
  content: z13.string().min(1),
  parameters: z13.array(mcpParameterSchema).optional(),
  prerequisites: z13.array(z13.string()).optional()
});
var marketplaceItemTypeSchema = z13.enum(["mode", "mcp"]);
var baseMarketplaceItemSchema = z13.object({
  id: z13.string().min(1),
  name: z13.string().min(1, "Name is required"),
  description: z13.string(),
  author: z13.string().optional(),
  authorUrl: z13.string().url("Author URL must be a valid URL").optional(),
  tags: z13.array(z13.string()).optional(),
  prerequisites: z13.array(z13.string()).optional()
});
var modeMarketplaceItemSchema = baseMarketplaceItemSchema.extend({
  content: z13.string().min(1)
  // YAML content for modes
});
var mcpMarketplaceItemSchema = baseMarketplaceItemSchema.extend({
  url: z13.string().url(),
  // Required url field
  content: z13.union([z13.string().min(1), z13.array(mcpInstallationMethodSchema)]),
  // Single config or array of methods
  parameters: z13.array(mcpParameterSchema).optional()
});
var marketplaceItemSchema = z13.discriminatedUnion("type", [
  // Mode marketplace item
  modeMarketplaceItemSchema.extend({
    type: z13.literal("mode")
  }),
  // MCP marketplace item
  mcpMarketplaceItemSchema.extend({
    type: z13.literal("mcp")
  })
]);
var installMarketplaceItemOptionsSchema = z13.object({
  target: z13.enum(["global", "project"]).optional().default("project"),
  parameters: z13.record(z13.string(), z13.any()).optional()
});

// src/cloud.ts
var organizationAllowListSchema = z14.object({
  allowAll: z14.boolean(),
  providers: z14.record(
    z14.object({
      allowAll: z14.boolean(),
      models: z14.array(z14.string()).optional()
    })
  )
});
var organizationDefaultSettingsSchema = globalSettingsSchema.pick({
  enableCheckpoints: true,
  fuzzyMatchThreshold: true,
  maxOpenTabsContext: true,
  maxReadFileLine: true,
  maxWorkspaceFiles: true,
  showRooIgnoredFiles: true,
  terminalCommandDelay: true,
  terminalCompressProgressBar: true,
  terminalOutputLineLimit: true,
  terminalShellIntegrationDisabled: true,
  terminalShellIntegrationTimeout: true,
  terminalZshClearEolMark: true
}).merge(
  z14.object({
    maxOpenTabsContext: z14.number().int().nonnegative().optional(),
    maxReadFileLine: z14.number().int().gte(-1).optional(),
    maxWorkspaceFiles: z14.number().int().nonnegative().optional(),
    terminalCommandDelay: z14.number().int().nonnegative().optional(),
    terminalOutputLineLimit: z14.number().int().nonnegative().optional(),
    terminalShellIntegrationTimeout: z14.number().int().nonnegative().optional()
  })
);
var organizationCloudSettingsSchema = z14.object({
  recordTaskMessages: z14.boolean().optional(),
  enableTaskSharing: z14.boolean().optional(),
  taskShareExpirationDays: z14.number().int().positive().optional(),
  allowMembersViewAllTasks: z14.boolean().optional()
});
var organizationSettingsSchema = z14.object({
  version: z14.number(),
  cloudSettings: organizationCloudSettingsSchema.optional(),
  defaultSettings: organizationDefaultSettingsSchema,
  allowList: organizationAllowListSchema,
  hiddenMcps: z14.array(z14.string()).optional(),
  hideMarketplaceMcps: z14.boolean().optional(),
  mcps: z14.array(mcpMarketplaceItemSchema).optional(),
  providerProfiles: z14.record(z14.string(), discriminatedProviderSettingsWithIdSchema).optional()
});
var ORGANIZATION_ALLOW_ALL = {
  allowAll: true,
  providers: {}
};
var ORGANIZATION_DEFAULT = {
  version: 0,
  cloudSettings: {
    recordTaskMessages: true,
    enableTaskSharing: true,
    taskShareExpirationDays: 30,
    allowMembersViewAllTasks: true
  },
  defaultSettings: {},
  allowList: ORGANIZATION_ALLOW_ALL
};
var shareResponseSchema = z14.object({
  success: z14.boolean(),
  shareUrl: z14.string().optional(),
  error: z14.string().optional(),
  isNewShare: z14.boolean().optional(),
  manageUrl: z14.string().optional()
});

// src/events.ts
import { z as z15 } from "zod";
var RooCodeEventName = /* @__PURE__ */ ((RooCodeEventName2) => {
  RooCodeEventName2["TaskCreated"] = "taskCreated";
  RooCodeEventName2["TaskStarted"] = "taskStarted";
  RooCodeEventName2["TaskCompleted"] = "taskCompleted";
  RooCodeEventName2["TaskAborted"] = "taskAborted";
  RooCodeEventName2["TaskFocused"] = "taskFocused";
  RooCodeEventName2["TaskUnfocused"] = "taskUnfocused";
  RooCodeEventName2["TaskActive"] = "taskActive";
  RooCodeEventName2["TaskIdle"] = "taskIdle";
  RooCodeEventName2["TaskPaused"] = "taskPaused";
  RooCodeEventName2["TaskUnpaused"] = "taskUnpaused";
  RooCodeEventName2["TaskSpawned"] = "taskSpawned";
  RooCodeEventName2["Message"] = "message";
  RooCodeEventName2["TaskModeSwitched"] = "taskModeSwitched";
  RooCodeEventName2["TaskAskResponded"] = "taskAskResponded";
  RooCodeEventName2["TaskTokenUsageUpdated"] = "taskTokenUsageUpdated";
  RooCodeEventName2["TaskToolFailed"] = "taskToolFailed";
  RooCodeEventName2["EvalPass"] = "evalPass";
  RooCodeEventName2["EvalFail"] = "evalFail";
  return RooCodeEventName2;
})(RooCodeEventName || {});
var rooCodeEventsSchema = z15.object({
  ["taskCreated" /* TaskCreated */]: z15.tuple([z15.string()]),
  ["taskStarted" /* TaskStarted */]: z15.tuple([z15.string()]),
  ["taskCompleted" /* TaskCompleted */]: z15.tuple([
    z15.string(),
    tokenUsageSchema,
    toolUsageSchema,
    z15.object({
      isSubtask: z15.boolean()
    })
  ]),
  ["taskAborted" /* TaskAborted */]: z15.tuple([z15.string()]),
  ["taskFocused" /* TaskFocused */]: z15.tuple([z15.string()]),
  ["taskUnfocused" /* TaskUnfocused */]: z15.tuple([z15.string()]),
  ["taskActive" /* TaskActive */]: z15.tuple([z15.string()]),
  ["taskIdle" /* TaskIdle */]: z15.tuple([z15.string()]),
  ["taskPaused" /* TaskPaused */]: z15.tuple([z15.string()]),
  ["taskUnpaused" /* TaskUnpaused */]: z15.tuple([z15.string()]),
  ["taskSpawned" /* TaskSpawned */]: z15.tuple([z15.string(), z15.string()]),
  ["message" /* Message */]: z15.tuple([
    z15.object({
      taskId: z15.string(),
      action: z15.union([z15.literal("created"), z15.literal("updated")]),
      message: clineMessageSchema
    })
  ]),
  ["taskModeSwitched" /* TaskModeSwitched */]: z15.tuple([z15.string(), z15.string()]),
  ["taskAskResponded" /* TaskAskResponded */]: z15.tuple([z15.string()]),
  ["taskToolFailed" /* TaskToolFailed */]: z15.tuple([z15.string(), toolNamesSchema, z15.string()]),
  ["taskTokenUsageUpdated" /* TaskTokenUsageUpdated */]: z15.tuple([z15.string(), tokenUsageSchema])
});
var taskEventSchema = z15.discriminatedUnion("eventName", [
  // Task Provider Lifecycle
  z15.object({
    eventName: z15.literal("taskCreated" /* TaskCreated */),
    payload: rooCodeEventsSchema.shape["taskCreated" /* TaskCreated */],
    taskId: z15.number().optional()
  }),
  // Task Lifecycle
  z15.object({
    eventName: z15.literal("taskStarted" /* TaskStarted */),
    payload: rooCodeEventsSchema.shape["taskStarted" /* TaskStarted */],
    taskId: z15.number().optional()
  }),
  z15.object({
    eventName: z15.literal("taskCompleted" /* TaskCompleted */),
    payload: rooCodeEventsSchema.shape["taskCompleted" /* TaskCompleted */],
    taskId: z15.number().optional()
  }),
  z15.object({
    eventName: z15.literal("taskAborted" /* TaskAborted */),
    payload: rooCodeEventsSchema.shape["taskAborted" /* TaskAborted */],
    taskId: z15.number().optional()
  }),
  z15.object({
    eventName: z15.literal("taskFocused" /* TaskFocused */),
    payload: rooCodeEventsSchema.shape["taskFocused" /* TaskFocused */],
    taskId: z15.number().optional()
  }),
  z15.object({
    eventName: z15.literal("taskUnfocused" /* TaskUnfocused */),
    payload: rooCodeEventsSchema.shape["taskUnfocused" /* TaskUnfocused */],
    taskId: z15.number().optional()
  }),
  z15.object({
    eventName: z15.literal("taskActive" /* TaskActive */),
    payload: rooCodeEventsSchema.shape["taskActive" /* TaskActive */],
    taskId: z15.number().optional()
  }),
  z15.object({
    eventName: z15.literal("taskIdle" /* TaskIdle */),
    payload: rooCodeEventsSchema.shape["taskIdle" /* TaskIdle */],
    taskId: z15.number().optional()
  }),
  // Subtask Lifecycle
  z15.object({
    eventName: z15.literal("taskPaused" /* TaskPaused */),
    payload: rooCodeEventsSchema.shape["taskPaused" /* TaskPaused */],
    taskId: z15.number().optional()
  }),
  z15.object({
    eventName: z15.literal("taskUnpaused" /* TaskUnpaused */),
    payload: rooCodeEventsSchema.shape["taskUnpaused" /* TaskUnpaused */],
    taskId: z15.number().optional()
  }),
  z15.object({
    eventName: z15.literal("taskSpawned" /* TaskSpawned */),
    payload: rooCodeEventsSchema.shape["taskSpawned" /* TaskSpawned */],
    taskId: z15.number().optional()
  }),
  // Task Execution
  z15.object({
    eventName: z15.literal("message" /* Message */),
    payload: rooCodeEventsSchema.shape["message" /* Message */],
    taskId: z15.number().optional()
  }),
  z15.object({
    eventName: z15.literal("taskModeSwitched" /* TaskModeSwitched */),
    payload: rooCodeEventsSchema.shape["taskModeSwitched" /* TaskModeSwitched */],
    taskId: z15.number().optional()
  }),
  z15.object({
    eventName: z15.literal("taskAskResponded" /* TaskAskResponded */),
    payload: rooCodeEventsSchema.shape["taskAskResponded" /* TaskAskResponded */],
    taskId: z15.number().optional()
  }),
  // Task Analytics
  z15.object({
    eventName: z15.literal("taskToolFailed" /* TaskToolFailed */),
    payload: rooCodeEventsSchema.shape["taskToolFailed" /* TaskToolFailed */],
    taskId: z15.number().optional()
  }),
  z15.object({
    eventName: z15.literal("taskTokenUsageUpdated" /* TaskTokenUsageUpdated */),
    payload: rooCodeEventsSchema.shape["taskTokenUsageUpdated" /* TaskTokenUsageUpdated */],
    taskId: z15.number().optional()
  }),
  // Evals
  z15.object({
    eventName: z15.literal("evalPass" /* EvalPass */),
    payload: z15.undefined(),
    taskId: z15.number()
  }),
  z15.object({
    eventName: z15.literal("evalFail" /* EvalFail */),
    payload: z15.undefined(),
    taskId: z15.number()
  })
]);

// src/followup.ts
import { z as z16 } from "zod";
var suggestionItemSchema = z16.object({
  answer: z16.string(),
  mode: z16.string().optional()
});
var followUpDataSchema = z16.object({
  question: z16.string().optional(),
  suggest: z16.array(suggestionItemSchema).optional()
});

// src/ipc.ts
import { z as z17 } from "zod";
var IpcMessageType = /* @__PURE__ */ ((IpcMessageType2) => {
  IpcMessageType2["Connect"] = "Connect";
  IpcMessageType2["Disconnect"] = "Disconnect";
  IpcMessageType2["Ack"] = "Ack";
  IpcMessageType2["TaskCommand"] = "TaskCommand";
  IpcMessageType2["TaskEvent"] = "TaskEvent";
  return IpcMessageType2;
})(IpcMessageType || {});
var IpcOrigin = /* @__PURE__ */ ((IpcOrigin2) => {
  IpcOrigin2["Client"] = "client";
  IpcOrigin2["Server"] = "server";
  return IpcOrigin2;
})(IpcOrigin || {});
var ackSchema = z17.object({
  clientId: z17.string(),
  pid: z17.number(),
  ppid: z17.number()
});
var TaskCommandName = /* @__PURE__ */ ((TaskCommandName2) => {
  TaskCommandName2["StartNewTask"] = "StartNewTask";
  TaskCommandName2["CancelTask"] = "CancelTask";
  TaskCommandName2["CloseTask"] = "CloseTask";
  return TaskCommandName2;
})(TaskCommandName || {});
var taskCommandSchema = z17.discriminatedUnion("commandName", [
  z17.object({
    commandName: z17.literal("StartNewTask" /* StartNewTask */),
    data: z17.object({
      configuration: rooCodeSettingsSchema,
      text: z17.string(),
      images: z17.array(z17.string()).optional(),
      newTab: z17.boolean().optional()
    })
  }),
  z17.object({
    commandName: z17.literal("CancelTask" /* CancelTask */),
    data: z17.string()
  }),
  z17.object({
    commandName: z17.literal("CloseTask" /* CloseTask */),
    data: z17.string()
  })
]);
var ipcMessageSchema = z17.discriminatedUnion("type", [
  z17.object({
    type: z17.literal("Ack" /* Ack */),
    origin: z17.literal("server" /* Server */),
    data: ackSchema
  }),
  z17.object({
    type: z17.literal("TaskCommand" /* TaskCommand */),
    origin: z17.literal("client" /* Client */),
    clientId: z17.string(),
    data: taskCommandSchema
  }),
  z17.object({
    type: z17.literal("TaskEvent" /* TaskEvent */),
    origin: z17.literal("server" /* Server */),
    relayClientId: z17.string().optional(),
    data: taskEventSchema
  })
]);

// src/mcp.ts
import { z as z18 } from "zod";
var mcpExecutionStatusSchema = z18.discriminatedUnion("status", [
  z18.object({
    executionId: z18.string(),
    status: z18.literal("started"),
    serverName: z18.string(),
    toolName: z18.string()
  }),
  z18.object({
    executionId: z18.string(),
    status: z18.literal("output"),
    response: z18.string()
  }),
  z18.object({
    executionId: z18.string(),
    status: z18.literal("completed"),
    response: z18.string().optional()
  }),
  z18.object({
    executionId: z18.string(),
    status: z18.literal("error"),
    error: z18.string().optional()
  })
]);

// src/todo.ts
import { z as z19 } from "zod";
var todoStatusSchema = z19.enum(["pending", "in_progress", "completed"]);
var todoItemSchema = z19.object({
  id: z19.string(),
  content: z19.string(),
  status: todoStatusSchema
});

// src/terminal.ts
import { z as z20 } from "zod";
var commandExecutionStatusSchema = z20.discriminatedUnion("status", [
  z20.object({
    executionId: z20.string(),
    status: z20.literal("started"),
    pid: z20.number().optional(),
    command: z20.string()
  }),
  z20.object({
    executionId: z20.string(),
    status: z20.literal("output"),
    output: z20.string()
  }),
  z20.object({
    executionId: z20.string(),
    status: z20.literal("exited"),
    exitCode: z20.number().optional()
  }),
  z20.object({
    executionId: z20.string(),
    status: z20.literal("fallback")
  }),
  z20.object({
    executionId: z20.string(),
    status: z20.literal("timeout")
  })
]);

// src/providers/anthropic.ts
var anthropicDefaultModelId = "claude-sonnet-4-20250514";
var anthropicModels = {
  "claude-sonnet-4-20250514": {
    maxTokens: 64e3,
    // Overridden to 8k if `enableReasoningEffort` is false.
    contextWindow: 2e5,
    // Default 200K, extendable to 1M with beta flag 'context-1m-2025-08-07'
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    inputPrice: 3,
    // $3 per million input tokens (≤200K context)
    outputPrice: 15,
    // $15 per million output tokens (≤200K context)
    cacheWritesPrice: 3.75,
    // $3.75 per million tokens
    cacheReadsPrice: 0.3,
    // $0.30 per million tokens
    supportsReasoningBudget: true,
    // Tiered pricing for extended context (requires beta flag 'context-1m-2025-08-07')
    tiers: [
      {
        contextWindow: 1e6,
        // 1M tokens with beta flag
        inputPrice: 6,
        // $6 per million input tokens (>200K context)
        outputPrice: 22.5,
        // $22.50 per million output tokens (>200K context)
        cacheWritesPrice: 7.5,
        // $7.50 per million tokens (>200K context)
        cacheReadsPrice: 0.6
        // $0.60 per million tokens (>200K context)
      }
    ]
  },
  "claude-opus-4-1-20250805": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    inputPrice: 15,
    // $15 per million input tokens
    outputPrice: 75,
    // $75 per million output tokens
    cacheWritesPrice: 18.75,
    // $18.75 per million tokens
    cacheReadsPrice: 1.5,
    // $1.50 per million tokens
    supportsReasoningBudget: true
  },
  "claude-opus-4-20250514": {
    maxTokens: 32e3,
    // Overridden to 8k if `enableReasoningEffort` is false.
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    inputPrice: 15,
    // $15 per million input tokens
    outputPrice: 75,
    // $75 per million output tokens
    cacheWritesPrice: 18.75,
    // $18.75 per million tokens
    cacheReadsPrice: 1.5,
    // $1.50 per million tokens
    supportsReasoningBudget: true
  },
  "claude-3-7-sonnet-20250219:thinking": {
    maxTokens: 128e3,
    // Unlocked by passing `beta` flag to the model. Otherwise, it's 64k.
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    inputPrice: 3,
    // $3 per million input tokens
    outputPrice: 15,
    // $15 per million output tokens
    cacheWritesPrice: 3.75,
    // $3.75 per million tokens
    cacheReadsPrice: 0.3,
    // $0.30 per million tokens
    supportsReasoningBudget: true,
    requiredReasoningBudget: true
  },
  "claude-3-7-sonnet-20250219": {
    maxTokens: 8192,
    // Since we already have a `:thinking` virtual model we aren't setting `supportsReasoningBudget: true` here.
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    inputPrice: 3,
    // $3 per million input tokens
    outputPrice: 15,
    // $15 per million output tokens
    cacheWritesPrice: 3.75,
    // $3.75 per million tokens
    cacheReadsPrice: 0.3
    // $0.30 per million tokens
  },
  "claude-3-5-sonnet-20241022": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    inputPrice: 3,
    // $3 per million input tokens
    outputPrice: 15,
    // $15 per million output tokens
    cacheWritesPrice: 3.75,
    // $3.75 per million tokens
    cacheReadsPrice: 0.3
    // $0.30 per million tokens
  },
  "claude-3-5-haiku-20241022": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 1,
    outputPrice: 5,
    cacheWritesPrice: 1.25,
    cacheReadsPrice: 0.1
  },
  "claude-3-opus-20240229": {
    maxTokens: 4096,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 15,
    outputPrice: 75,
    cacheWritesPrice: 18.75,
    cacheReadsPrice: 1.5
  },
  "claude-3-haiku-20240307": {
    maxTokens: 4096,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.25,
    outputPrice: 1.25,
    cacheWritesPrice: 0.3,
    cacheReadsPrice: 0.03
  }
};
var ANTHROPIC_DEFAULT_MAX_TOKENS = 8192;

// src/providers/bedrock.ts
var bedrockDefaultModelId = "anthropic.claude-sonnet-4-20250514-v1:0";
var bedrockDefaultPromptRouterModelId = "anthropic.claude-3-sonnet-20240229-v1:0";
var bedrockModels = {
  "amazon.nova-pro-v1:0": {
    maxTokens: 5e3,
    contextWindow: 3e5,
    supportsImages: true,
    supportsComputerUse: false,
    supportsPromptCache: true,
    inputPrice: 0.8,
    outputPrice: 3.2,
    cacheWritesPrice: 0.8,
    // per million tokens
    cacheReadsPrice: 0.2,
    // per million tokens
    minTokensPerCachePoint: 1,
    maxCachePoints: 1,
    cachableFields: ["system"]
  },
  "amazon.nova-pro-latency-optimized-v1:0": {
    maxTokens: 5e3,
    contextWindow: 3e5,
    supportsImages: true,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 1,
    outputPrice: 4,
    cacheWritesPrice: 1,
    // per million tokens
    cacheReadsPrice: 0.25,
    // per million tokens
    description: "Amazon Nova Pro with latency optimized inference"
  },
  "amazon.nova-lite-v1:0": {
    maxTokens: 5e3,
    contextWindow: 3e5,
    supportsImages: true,
    supportsComputerUse: false,
    supportsPromptCache: true,
    inputPrice: 0.06,
    outputPrice: 0.24,
    cacheWritesPrice: 0.06,
    // per million tokens
    cacheReadsPrice: 0.015,
    // per million tokens
    minTokensPerCachePoint: 1,
    maxCachePoints: 1,
    cachableFields: ["system"]
  },
  "amazon.nova-micro-v1:0": {
    maxTokens: 5e3,
    contextWindow: 128e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: true,
    inputPrice: 0.035,
    outputPrice: 0.14,
    cacheWritesPrice: 0.035,
    // per million tokens
    cacheReadsPrice: 875e-5,
    // per million tokens
    minTokensPerCachePoint: 1,
    maxCachePoints: 1,
    cachableFields: ["system"]
  },
  "anthropic.claude-sonnet-4-20250514-v1:0": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    supportsReasoningBudget: true,
    inputPrice: 3,
    outputPrice: 15,
    cacheWritesPrice: 3.75,
    cacheReadsPrice: 0.3,
    minTokensPerCachePoint: 1024,
    maxCachePoints: 4,
    cachableFields: ["system", "messages", "tools"]
  },
  "anthropic.claude-opus-4-1-20250805-v1:0": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    supportsReasoningBudget: true,
    inputPrice: 15,
    outputPrice: 75,
    cacheWritesPrice: 18.75,
    cacheReadsPrice: 1.5,
    minTokensPerCachePoint: 1024,
    maxCachePoints: 4,
    cachableFields: ["system", "messages", "tools"]
  },
  "anthropic.claude-opus-4-20250514-v1:0": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    supportsReasoningBudget: true,
    inputPrice: 15,
    outputPrice: 75,
    cacheWritesPrice: 18.75,
    cacheReadsPrice: 1.5,
    minTokensPerCachePoint: 1024,
    maxCachePoints: 4,
    cachableFields: ["system", "messages", "tools"]
  },
  "anthropic.claude-3-7-sonnet-20250219-v1:0": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    supportsReasoningBudget: true,
    inputPrice: 3,
    outputPrice: 15,
    cacheWritesPrice: 3.75,
    cacheReadsPrice: 0.3,
    minTokensPerCachePoint: 1024,
    maxCachePoints: 4,
    cachableFields: ["system", "messages", "tools"]
  },
  "anthropic.claude-3-5-sonnet-20241022-v2:0": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    inputPrice: 3,
    outputPrice: 15,
    cacheWritesPrice: 3.75,
    cacheReadsPrice: 0.3,
    minTokensPerCachePoint: 1024,
    maxCachePoints: 4,
    cachableFields: ["system", "messages", "tools"]
  },
  "anthropic.claude-3-5-haiku-20241022-v1:0": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 0.8,
    outputPrice: 4,
    cacheWritesPrice: 1,
    cacheReadsPrice: 0.08,
    minTokensPerCachePoint: 2048,
    maxCachePoints: 4,
    cachableFields: ["system", "messages", "tools"]
  },
  "anthropic.claude-3-5-sonnet-20240620-v1:0": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 3,
    outputPrice: 15
  },
  "anthropic.claude-3-opus-20240229-v1:0": {
    maxTokens: 4096,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 15,
    outputPrice: 75
  },
  "anthropic.claude-3-sonnet-20240229-v1:0": {
    maxTokens: 4096,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 3,
    outputPrice: 15
  },
  "anthropic.claude-3-haiku-20240307-v1:0": {
    maxTokens: 4096,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0.25,
    outputPrice: 1.25
  },
  "anthropic.claude-2-1-v1:0": {
    maxTokens: 4096,
    contextWindow: 1e5,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 8,
    outputPrice: 24,
    description: "Claude 2.1"
  },
  "anthropic.claude-2-0-v1:0": {
    maxTokens: 4096,
    contextWindow: 1e5,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 8,
    outputPrice: 24,
    description: "Claude 2.0"
  },
  "anthropic.claude-instant-v1:0": {
    maxTokens: 4096,
    contextWindow: 1e5,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.8,
    outputPrice: 2.4,
    description: "Claude Instant"
  },
  "deepseek.r1-v1:0": {
    maxTokens: 32768,
    contextWindow: 128e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 1.35,
    outputPrice: 5.4
  },
  "openai.gpt-oss-20b-1:0": {
    maxTokens: 8192,
    contextWindow: 128e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 0.5,
    outputPrice: 1.5,
    description: "GPT-OSS 20B - Optimized for low latency and local/specialized use cases"
  },
  "openai.gpt-oss-120b-1:0": {
    maxTokens: 8192,
    contextWindow: 128e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 2,
    outputPrice: 6,
    description: "GPT-OSS 120B - Production-ready, general-purpose, high-reasoning model"
  },
  "meta.llama3-3-70b-instruct-v1:0": {
    maxTokens: 8192,
    contextWindow: 128e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 0.72,
    outputPrice: 0.72,
    description: "Llama 3.3 Instruct (70B)"
  },
  "meta.llama3-2-90b-instruct-v1:0": {
    maxTokens: 8192,
    contextWindow: 128e3,
    supportsImages: true,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 0.72,
    outputPrice: 0.72,
    description: "Llama 3.2 Instruct (90B)"
  },
  "meta.llama3-2-11b-instruct-v1:0": {
    maxTokens: 8192,
    contextWindow: 128e3,
    supportsImages: true,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 0.16,
    outputPrice: 0.16,
    description: "Llama 3.2 Instruct (11B)"
  },
  "meta.llama3-2-3b-instruct-v1:0": {
    maxTokens: 8192,
    contextWindow: 128e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 0.15,
    outputPrice: 0.15,
    description: "Llama 3.2 Instruct (3B)"
  },
  "meta.llama3-2-1b-instruct-v1:0": {
    maxTokens: 8192,
    contextWindow: 128e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 0.1,
    outputPrice: 0.1,
    description: "Llama 3.2 Instruct (1B)"
  },
  "meta.llama3-1-405b-instruct-v1:0": {
    maxTokens: 8192,
    contextWindow: 128e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 2.4,
    outputPrice: 2.4,
    description: "Llama 3.1 Instruct (405B)"
  },
  "meta.llama3-1-70b-instruct-v1:0": {
    maxTokens: 8192,
    contextWindow: 128e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 0.72,
    outputPrice: 0.72,
    description: "Llama 3.1 Instruct (70B)"
  },
  "meta.llama3-1-70b-instruct-latency-optimized-v1:0": {
    maxTokens: 8192,
    contextWindow: 128e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 0.9,
    outputPrice: 0.9,
    description: "Llama 3.1 Instruct (70B) (w/ latency optimized inference)"
  },
  "meta.llama3-1-8b-instruct-v1:0": {
    maxTokens: 8192,
    contextWindow: 8e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 0.22,
    outputPrice: 0.22,
    description: "Llama 3.1 Instruct (8B)"
  },
  "meta.llama3-70b-instruct-v1:0": {
    maxTokens: 2048,
    contextWindow: 8e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 2.65,
    outputPrice: 3.5
  },
  "meta.llama3-8b-instruct-v1:0": {
    maxTokens: 2048,
    contextWindow: 4e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 0.3,
    outputPrice: 0.6
  },
  "amazon.titan-text-lite-v1:0": {
    maxTokens: 4096,
    contextWindow: 8e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 0.15,
    outputPrice: 0.2,
    description: "Amazon Titan Text Lite"
  },
  "amazon.titan-text-express-v1:0": {
    maxTokens: 4096,
    contextWindow: 8e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 0.2,
    outputPrice: 0.6,
    description: "Amazon Titan Text Express"
  },
  "amazon.titan-text-embeddings-v1:0": {
    maxTokens: 8192,
    contextWindow: 8e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 0.1,
    description: "Amazon Titan Text Embeddings"
  },
  "amazon.titan-text-embeddings-v2:0": {
    maxTokens: 8192,
    contextWindow: 8e3,
    supportsImages: false,
    supportsComputerUse: false,
    supportsPromptCache: false,
    inputPrice: 0.02,
    description: "Amazon Titan Text Embeddings V2"
  }
};
var BEDROCK_DEFAULT_TEMPERATURE = 0.3;
var BEDROCK_MAX_TOKENS = 4096;
var BEDROCK_DEFAULT_CONTEXT = 128e3;
var AWS_INFERENCE_PROFILE_MAPPING = [
  // US Government Cloud → ug. inference profile (most specific prefix first)
  ["us-gov-", "ug."],
  // Americas regions → us. inference profile
  ["us-", "us."],
  // Europe regions → eu. inference profile
  ["eu-", "eu."],
  // Asia Pacific regions → apac. inference profile
  ["ap-", "apac."],
  // Canada regions → ca. inference profile
  ["ca-", "ca."],
  // South America regions → sa. inference profile
  ["sa-", "sa."]
];
var BEDROCK_REGIONS = [
  { value: "us-east-1", label: "us-east-1" },
  { value: "us-east-2", label: "us-east-2" },
  { value: "us-west-1", label: "us-west-1" },
  { value: "us-west-2", label: "us-west-2" },
  { value: "ap-northeast-1", label: "ap-northeast-1" },
  { value: "ap-northeast-2", label: "ap-northeast-2" },
  { value: "ap-northeast-3", label: "ap-northeast-3" },
  { value: "ap-south-1", label: "ap-south-1" },
  { value: "ap-south-2", label: "ap-south-2" },
  { value: "ap-southeast-1", label: "ap-southeast-1" },
  { value: "ap-southeast-2", label: "ap-southeast-2" },
  { value: "ap-east-1", label: "ap-east-1" },
  { value: "eu-central-1", label: "eu-central-1" },
  { value: "eu-central-2", label: "eu-central-2" },
  { value: "eu-west-1", label: "eu-west-1" },
  { value: "eu-west-2", label: "eu-west-2" },
  { value: "eu-west-3", label: "eu-west-3" },
  { value: "eu-north-1", label: "eu-north-1" },
  { value: "eu-south-1", label: "eu-south-1" },
  { value: "eu-south-2", label: "eu-south-2" },
  { value: "ca-central-1", label: "ca-central-1" },
  { value: "sa-east-1", label: "sa-east-1" },
  { value: "us-gov-east-1", label: "us-gov-east-1" },
  { value: "us-gov-west-1", label: "us-gov-west-1" }
].sort((a, b) => a.value.localeCompare(b.value));

// src/providers/cerebras.ts
var cerebrasDefaultModelId = "qwen-3-coder-480b-free";
var cerebrasModels = {
  "qwen-3-coder-480b-free": {
    maxTokens: 4e4,
    contextWindow: 64e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "SOTA coding model with ~2000 tokens/s ($0 free tier)\n\n\u2022 Use this if you don't have a Cerebras subscription\n\u2022 64K context window\n\u2022 Rate limits: 150K TPM, 1M TPH/TPD, 10 RPM, 100 RPH/RPD\n\nUpgrade for higher limits: [https://cloud.cerebras.ai/?utm=roocode](https://cloud.cerebras.ai/?utm=roocode)"
  },
  "qwen-3-coder-480b": {
    maxTokens: 4e4,
    contextWindow: 128e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "SOTA coding model with ~2000 tokens/s ($50/$250 paid tiers)\n\n\u2022 Use this if you have a Cerebras subscription\n\u2022 131K context window with higher rate limits"
  },
  "qwen-3-235b-a22b-instruct-2507": {
    maxTokens: 64e3,
    contextWindow: 64e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Intelligent model with ~1400 tokens/s"
  },
  "llama-3.3-70b": {
    maxTokens: 64e3,
    contextWindow: 64e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Powerful model with ~2600 tokens/s"
  },
  "qwen-3-32b": {
    maxTokens: 64e3,
    contextWindow: 64e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "SOTA coding performance with ~2500 tokens/s"
  },
  "qwen-3-235b-a22b-thinking-2507": {
    maxTokens: 4e4,
    contextWindow: 65e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "SOTA performance with ~1500 tokens/s",
    supportsReasoningEffort: true
  },
  "gpt-oss-120b": {
    maxTokens: 8e3,
    contextWindow: 64e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "OpenAI GPT OSS model with ~2800 tokens/s\n\n\u2022 64K context window\n\u2022 Excels at efficient reasoning across science, math, and coding"
  }
};

// src/providers/chutes.ts
var chutesDefaultModelId = "deepseek-ai/DeepSeek-R1-0528";
var chutesModels = {
  "deepseek-ai/DeepSeek-R1-0528": {
    maxTokens: 32768,
    contextWindow: 163840,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "DeepSeek R1 0528 model."
  },
  "deepseek-ai/DeepSeek-R1": {
    maxTokens: 32768,
    contextWindow: 163840,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "DeepSeek R1 model."
  },
  "deepseek-ai/DeepSeek-V3": {
    maxTokens: 32768,
    contextWindow: 163840,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "DeepSeek V3 model."
  },
  "unsloth/Llama-3.3-70B-Instruct": {
    maxTokens: 32768,
    // From Groq
    contextWindow: 131072,
    // From Groq
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Unsloth Llama 3.3 70B Instruct model."
  },
  "chutesai/Llama-4-Scout-17B-16E-Instruct": {
    maxTokens: 32768,
    contextWindow: 512e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "ChutesAI Llama 4 Scout 17B Instruct model, 512K context."
  },
  "unsloth/Mistral-Nemo-Instruct-2407": {
    maxTokens: 32768,
    contextWindow: 128e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Unsloth Mistral Nemo Instruct model."
  },
  "unsloth/gemma-3-12b-it": {
    maxTokens: 32768,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Unsloth Gemma 3 12B IT model."
  },
  "NousResearch/DeepHermes-3-Llama-3-8B-Preview": {
    maxTokens: 32768,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Nous DeepHermes 3 Llama 3 8B Preview model."
  },
  "unsloth/gemma-3-4b-it": {
    maxTokens: 32768,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Unsloth Gemma 3 4B IT model."
  },
  "nvidia/Llama-3_3-Nemotron-Super-49B-v1": {
    maxTokens: 32768,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Nvidia Llama 3.3 Nemotron Super 49B model."
  },
  "nvidia/Llama-3_1-Nemotron-Ultra-253B-v1": {
    maxTokens: 32768,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Nvidia Llama 3.1 Nemotron Ultra 253B model."
  },
  "chutesai/Llama-4-Maverick-17B-128E-Instruct-FP8": {
    maxTokens: 32768,
    contextWindow: 256e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "ChutesAI Llama 4 Maverick 17B Instruct FP8 model."
  },
  "deepseek-ai/DeepSeek-V3-Base": {
    maxTokens: 32768,
    contextWindow: 163840,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "DeepSeek V3 Base model."
  },
  "deepseek-ai/DeepSeek-R1-Zero": {
    maxTokens: 32768,
    contextWindow: 163840,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "DeepSeek R1 Zero model."
  },
  "deepseek-ai/DeepSeek-V3-0324": {
    maxTokens: 32768,
    contextWindow: 163840,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "DeepSeek V3 (0324) model."
  },
  "Qwen/Qwen3-235B-A22B-Instruct-2507": {
    maxTokens: 32768,
    contextWindow: 262144,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Qwen3 235B A22B Instruct 2507 model with 262K context window."
  },
  "Qwen/Qwen3-235B-A22B": {
    maxTokens: 32768,
    contextWindow: 40960,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Qwen3 235B A22B model."
  },
  "Qwen/Qwen3-32B": {
    maxTokens: 32768,
    contextWindow: 40960,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Qwen3 32B model."
  },
  "Qwen/Qwen3-30B-A3B": {
    maxTokens: 32768,
    contextWindow: 40960,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Qwen3 30B A3B model."
  },
  "Qwen/Qwen3-14B": {
    maxTokens: 32768,
    contextWindow: 40960,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Qwen3 14B model."
  },
  "Qwen/Qwen3-8B": {
    maxTokens: 32768,
    contextWindow: 40960,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Qwen3 8B model."
  },
  "microsoft/MAI-DS-R1-FP8": {
    maxTokens: 32768,
    contextWindow: 163840,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Microsoft MAI-DS-R1 FP8 model."
  },
  "tngtech/DeepSeek-R1T-Chimera": {
    maxTokens: 32768,
    contextWindow: 163840,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "TNGTech DeepSeek R1T Chimera model."
  },
  "zai-org/GLM-4.5-Air": {
    maxTokens: 32768,
    contextWindow: 151329,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "GLM-4.5-Air model with 151,329 token context window and 106B total parameters with 12B activated."
  },
  "zai-org/GLM-4.5-FP8": {
    maxTokens: 32768,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "GLM-4.5-FP8 model with 128k token context window, optimized for agent-based applications with MoE architecture."
  },
  "Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8": {
    maxTokens: 32768,
    contextWindow: 262144,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    description: "Qwen3 Coder 480B A35B Instruct FP8 model, optimized for coding tasks."
  },
  "moonshotai/Kimi-K2-Instruct-75k": {
    maxTokens: 32768,
    contextWindow: 75e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.1481,
    outputPrice: 0.5926,
    description: "Moonshot AI Kimi K2 Instruct model with 75k context window."
  }
};

// src/providers/claude-code.ts
var VERTEX_DATE_PATTERN = /-(\d{8})$/;
function convertModelNameForVertex(modelName) {
  return modelName.replace(VERTEX_DATE_PATTERN, "@$1");
}
var claudeCodeDefaultModelId = "claude-sonnet-4-20250514";
var CLAUDE_CODE_DEFAULT_MAX_OUTPUT_TOKENS = 16e3;
function getClaudeCodeModelId(baseModelId, useVertex = false) {
  return useVertex ? convertModelNameForVertex(baseModelId) : baseModelId;
}
var claudeCodeModels = {
  "claude-sonnet-4-20250514": {
    ...anthropicModels["claude-sonnet-4-20250514"],
    supportsImages: false,
    supportsPromptCache: true,
    // Claude Code does report cache tokens
    supportsReasoningEffort: false,
    supportsReasoningBudget: false,
    requiredReasoningBudget: false
  },
  "claude-opus-4-1-20250805": {
    ...anthropicModels["claude-opus-4-1-20250805"],
    supportsImages: false,
    supportsPromptCache: true,
    // Claude Code does report cache tokens
    supportsReasoningEffort: false,
    supportsReasoningBudget: false,
    requiredReasoningBudget: false
  },
  "claude-opus-4-20250514": {
    ...anthropicModels["claude-opus-4-20250514"],
    supportsImages: false,
    supportsPromptCache: true,
    // Claude Code does report cache tokens
    supportsReasoningEffort: false,
    supportsReasoningBudget: false,
    requiredReasoningBudget: false
  },
  "claude-3-7-sonnet-20250219": {
    ...anthropicModels["claude-3-7-sonnet-20250219"],
    supportsImages: false,
    supportsPromptCache: true,
    // Claude Code does report cache tokens
    supportsReasoningEffort: false,
    supportsReasoningBudget: false,
    requiredReasoningBudget: false
  },
  "claude-3-5-sonnet-20241022": {
    ...anthropicModels["claude-3-5-sonnet-20241022"],
    supportsImages: false,
    supportsPromptCache: true,
    // Claude Code does report cache tokens
    supportsReasoningEffort: false,
    supportsReasoningBudget: false,
    requiredReasoningBudget: false
  },
  "claude-3-5-haiku-20241022": {
    ...anthropicModels["claude-3-5-haiku-20241022"],
    supportsImages: false,
    supportsPromptCache: true,
    // Claude Code does report cache tokens
    supportsReasoningEffort: false,
    supportsReasoningBudget: false,
    requiredReasoningBudget: false
  }
};

// src/providers/deepseek.ts
var deepSeekDefaultModelId = "deepseek-chat";
var deepSeekModels = {
  "deepseek-chat": {
    maxTokens: 8192,
    contextWindow: 64e3,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 0.27,
    // $0.27 per million tokens (cache miss)
    outputPrice: 1.1,
    // $1.10 per million tokens
    cacheWritesPrice: 0.27,
    // $0.27 per million tokens (cache miss)
    cacheReadsPrice: 0.07,
    // $0.07 per million tokens (cache hit).
    description: `DeepSeek-V3 achieves a significant breakthrough in inference speed over previous models. It tops the leaderboard among open-source models and rivals the most advanced closed-source models globally.`
  },
  "deepseek-reasoner": {
    maxTokens: 8192,
    contextWindow: 64e3,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 0.55,
    // $0.55 per million tokens (cache miss)
    outputPrice: 2.19,
    // $2.19 per million tokens
    cacheWritesPrice: 0.55,
    // $0.55 per million tokens (cache miss)
    cacheReadsPrice: 0.14,
    // $0.14 per million tokens (cache hit)
    description: `DeepSeek-R1 achieves performance comparable to OpenAI-o1 across math, code, and reasoning tasks. Supports Chain of Thought reasoning with up to 32K tokens.`
  }
};
var DEEP_SEEK_DEFAULT_TEMPERATURE = 0.6;

// src/providers/gemini.ts
var geminiDefaultModelId = "gemini-2.0-flash-001";
var geminiModels = {
  "gemini-2.5-flash-preview-04-17:thinking": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0.15,
    outputPrice: 3.5,
    maxThinkingTokens: 24576,
    supportsReasoningBudget: true,
    requiredReasoningBudget: true
  },
  "gemini-2.5-flash-preview-04-17": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0.15,
    outputPrice: 0.6
  },
  "gemini-2.5-flash-preview-05-20:thinking": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.15,
    outputPrice: 3.5,
    cacheReadsPrice: 0.0375,
    cacheWritesPrice: 1,
    maxThinkingTokens: 24576,
    supportsReasoningBudget: true,
    requiredReasoningBudget: true
  },
  "gemini-2.5-flash-preview-05-20": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.15,
    outputPrice: 0.6,
    cacheReadsPrice: 0.0375,
    cacheWritesPrice: 1
  },
  "gemini-2.5-flash": {
    maxTokens: 64e3,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.3,
    outputPrice: 2.5,
    cacheReadsPrice: 0.075,
    cacheWritesPrice: 1,
    maxThinkingTokens: 24576,
    supportsReasoningBudget: true
  },
  "gemini-2.5-pro-exp-03-25": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0
  },
  "gemini-2.5-pro-preview-03-25": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 2.5,
    // This is the pricing for prompts above 200k tokens.
    outputPrice: 15,
    cacheReadsPrice: 0.625,
    cacheWritesPrice: 4.5,
    tiers: [
      {
        contextWindow: 2e5,
        inputPrice: 1.25,
        outputPrice: 10,
        cacheReadsPrice: 0.31
      },
      {
        contextWindow: Infinity,
        inputPrice: 2.5,
        outputPrice: 15,
        cacheReadsPrice: 0.625
      }
    ]
  },
  "gemini-2.5-pro-preview-05-06": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 2.5,
    // This is the pricing for prompts above 200k tokens.
    outputPrice: 15,
    cacheReadsPrice: 0.625,
    cacheWritesPrice: 4.5,
    tiers: [
      {
        contextWindow: 2e5,
        inputPrice: 1.25,
        outputPrice: 10,
        cacheReadsPrice: 0.31
      },
      {
        contextWindow: Infinity,
        inputPrice: 2.5,
        outputPrice: 15,
        cacheReadsPrice: 0.625
      }
    ]
  },
  "gemini-2.5-pro-preview-06-05": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 2.5,
    // This is the pricing for prompts above 200k tokens.
    outputPrice: 15,
    cacheReadsPrice: 0.625,
    cacheWritesPrice: 4.5,
    maxThinkingTokens: 32768,
    supportsReasoningBudget: true,
    tiers: [
      {
        contextWindow: 2e5,
        inputPrice: 1.25,
        outputPrice: 10,
        cacheReadsPrice: 0.31
      },
      {
        contextWindow: Infinity,
        inputPrice: 2.5,
        outputPrice: 15,
        cacheReadsPrice: 0.625
      }
    ]
  },
  "gemini-2.5-pro": {
    maxTokens: 64e3,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 2.5,
    // This is the pricing for prompts above 200k tokens.
    outputPrice: 15,
    cacheReadsPrice: 0.625,
    cacheWritesPrice: 4.5,
    maxThinkingTokens: 32768,
    supportsReasoningBudget: true,
    requiredReasoningBudget: true,
    tiers: [
      {
        contextWindow: 2e5,
        inputPrice: 1.25,
        outputPrice: 10,
        cacheReadsPrice: 0.31
      },
      {
        contextWindow: Infinity,
        inputPrice: 2.5,
        outputPrice: 15,
        cacheReadsPrice: 0.625
      }
    ]
  },
  "gemini-2.0-flash-001": {
    maxTokens: 8192,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.1,
    outputPrice: 0.4,
    cacheReadsPrice: 0.025,
    cacheWritesPrice: 1
  },
  "gemini-2.0-flash-lite-preview-02-05": {
    maxTokens: 8192,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0
  },
  "gemini-2.0-pro-exp-02-05": {
    maxTokens: 8192,
    contextWindow: 2097152,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0
  },
  "gemini-2.0-flash-thinking-exp-01-21": {
    maxTokens: 65536,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0
  },
  "gemini-2.0-flash-thinking-exp-1219": {
    maxTokens: 8192,
    contextWindow: 32767,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0
  },
  "gemini-2.0-flash-exp": {
    maxTokens: 8192,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0
  },
  "gemini-1.5-flash-002": {
    maxTokens: 8192,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.15,
    // This is the pricing for prompts above 128k tokens.
    outputPrice: 0.6,
    cacheReadsPrice: 0.0375,
    cacheWritesPrice: 1,
    tiers: [
      {
        contextWindow: 128e3,
        inputPrice: 0.075,
        outputPrice: 0.3,
        cacheReadsPrice: 0.01875
      },
      {
        contextWindow: Infinity,
        inputPrice: 0.15,
        outputPrice: 0.6,
        cacheReadsPrice: 0.0375
      }
    ]
  },
  "gemini-1.5-flash-exp-0827": {
    maxTokens: 8192,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0
  },
  "gemini-1.5-flash-8b-exp-0827": {
    maxTokens: 8192,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0
  },
  "gemini-1.5-pro-002": {
    maxTokens: 8192,
    contextWindow: 2097152,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0
  },
  "gemini-1.5-pro-exp-0827": {
    maxTokens: 8192,
    contextWindow: 2097152,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0
  },
  "gemini-exp-1206": {
    maxTokens: 8192,
    contextWindow: 2097152,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0
  },
  "gemini-2.5-flash-lite-preview-06-17": {
    maxTokens: 64e3,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.1,
    outputPrice: 0.4,
    cacheReadsPrice: 0.025,
    cacheWritesPrice: 1,
    supportsReasoningBudget: true,
    maxThinkingTokens: 24576
  },
  "imagen-2": {
    maxTokens: 0,
    contextWindow: 0,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0.02,
    outputPrice: 0,
    modelType: "image-generation",
    description: "Google Imagen 3 via Gemini API for image generation"
  }
};

// src/providers/glama.ts
var glamaDefaultModelId = "anthropic/claude-3-7-sonnet";
var glamaDefaultModelInfo = {
  maxTokens: 8192,
  contextWindow: 2e5,
  supportsImages: true,
  supportsComputerUse: true,
  supportsPromptCache: true,
  inputPrice: 3,
  outputPrice: 15,
  cacheWritesPrice: 3.75,
  cacheReadsPrice: 0.3,
  description: "Claude 3.7 Sonnet is an advanced large language model with improved reasoning, coding, and problem-solving capabilities. It introduces a hybrid reasoning approach, allowing users to choose between rapid responses and extended, step-by-step processing for complex tasks. The model demonstrates notable improvements in coding, particularly in front-end development and full-stack updates, and excels in agentic workflows, where it can autonomously navigate multi-step processes. Claude 3.7 Sonnet maintains performance parity with its predecessor in standard mode while offering an extended reasoning mode for enhanced accuracy in math, coding, and instruction-following tasks. Read more at the [blog post here](https://www.anthropic.com/news/claude-3-7-sonnet)"
};
var GLAMA_DEFAULT_TEMPERATURE = 0;

// src/providers/groq.ts
var groqDefaultModelId = "llama-3.3-70b-versatile";
var groqModels = {
  // Models based on API response: https://api.groq.com/openai/v1/models
  "llama-3.1-8b-instant": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.05,
    outputPrice: 0.08,
    description: "Meta Llama 3.1 8B Instant model, 128K context."
  },
  "llama-3.3-70b-versatile": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.59,
    outputPrice: 0.79,
    description: "Meta Llama 3.3 70B Versatile model, 128K context."
  },
  "meta-llama/llama-4-scout-17b-16e-instruct": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.11,
    outputPrice: 0.34,
    description: "Meta Llama 4 Scout 17B Instruct model, 128K context."
  },
  "meta-llama/llama-4-maverick-17b-128e-instruct": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.2,
    outputPrice: 0.6,
    description: "Meta Llama 4 Maverick 17B Instruct model, 128K context."
  },
  "mistral-saba-24b": {
    maxTokens: 8192,
    contextWindow: 32768,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.79,
    outputPrice: 0.79,
    description: "Mistral Saba 24B model, 32K context."
  },
  "qwen-qwq-32b": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.29,
    outputPrice: 0.39,
    description: "Alibaba Qwen QwQ 32B model, 128K context."
  },
  "qwen/qwen3-32b": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.29,
    outputPrice: 0.59,
    description: "Alibaba Qwen 3 32B model, 128K context."
  },
  "deepseek-r1-distill-llama-70b": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.75,
    outputPrice: 0.99,
    description: "DeepSeek R1 Distill Llama 70B model, 128K context."
  },
  "moonshotai/kimi-k2-instruct": {
    maxTokens: 16384,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 1,
    outputPrice: 3,
    description: "Moonshot AI Kimi K2 Instruct 1T model, 128K context."
  },
  "openai/gpt-oss-120b": {
    maxTokens: 32766,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.15,
    outputPrice: 0.75,
    description: "GPT-OSS 120B is OpenAI's flagship open source model, built on a Mixture-of-Experts (MoE) architecture with 20 billion parameters and 128 experts."
  },
  "openai/gpt-oss-20b": {
    maxTokens: 32768,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.1,
    outputPrice: 0.5,
    description: "GPT-OSS 20B is OpenAI's flagship open source model, built on a Mixture-of-Experts (MoE) architecture with 20 billion parameters and 32 experts."
  }
};

// src/providers/huggingface.ts
var HUGGINGFACE_DEFAULT_MAX_TOKENS = 2048;
var HUGGINGFACE_MAX_TOKENS_FALLBACK = 8192;
var HUGGINGFACE_DEFAULT_CONTEXT_WINDOW = 128e3;
var HUGGINGFACE_SLIDER_STEP = 256;
var HUGGINGFACE_SLIDER_MIN = 1;
var HUGGINGFACE_TEMPERATURE_MAX_VALUE = 2;
var HUGGINGFACE_API_URL = "https://router.huggingface.co/v1/models?collection=roocode";
var HUGGINGFACE_CACHE_DURATION = 1e3 * 60 * 60;

// src/providers/io-intelligence.ts
var ioIntelligenceDefaultModelId = "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8";
var ioIntelligenceDefaultBaseUrl = "https://api.intelligence.io.solutions/api/v1";
var IO_INTELLIGENCE_CACHE_DURATION = 1e3 * 60 * 60;
var ioIntelligenceModels = {
  "deepseek-ai/DeepSeek-R1-0528": {
    maxTokens: 8192,
    contextWindow: 128e3,
    supportsImages: false,
    supportsPromptCache: false,
    description: "DeepSeek R1 reasoning model"
  },
  "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8": {
    maxTokens: 8192,
    contextWindow: 43e4,
    supportsImages: true,
    supportsPromptCache: false,
    description: "Llama 4 Maverick 17B model"
  },
  "Intel/Qwen3-Coder-480B-A35B-Instruct-int4-mixed-ar": {
    maxTokens: 8192,
    contextWindow: 106e3,
    supportsImages: false,
    supportsPromptCache: false,
    description: "Qwen3 Coder 480B specialized for coding"
  },
  "openai/gpt-oss-120b": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    description: "OpenAI GPT-OSS 120B model"
  }
};

// src/providers/lite-llm.ts
var litellmDefaultModelId = "claude-3-7-sonnet-20250219";
var litellmDefaultModelInfo = {
  maxTokens: 8192,
  contextWindow: 2e5,
  supportsImages: true,
  supportsComputerUse: true,
  supportsPromptCache: true,
  inputPrice: 3,
  outputPrice: 15,
  cacheWritesPrice: 3.75,
  cacheReadsPrice: 0.3
};
var LITELLM_COMPUTER_USE_MODELS = /* @__PURE__ */ new Set([
  "claude-3-5-sonnet-latest",
  "claude-opus-4-1-20250805",
  "claude-opus-4-20250514",
  "claude-sonnet-4-20250514",
  "claude-3-7-sonnet-latest",
  "claude-3-7-sonnet-20250219",
  "claude-3-5-sonnet-20241022",
  "vertex_ai/claude-3-5-sonnet",
  "vertex_ai/claude-3-5-sonnet-v2",
  "vertex_ai/claude-3-5-sonnet-v2@20241022",
  "vertex_ai/claude-3-7-sonnet@20250219",
  "vertex_ai/claude-opus-4-1@20250805",
  "vertex_ai/claude-opus-4@20250514",
  "vertex_ai/claude-sonnet-4@20250514",
  "openrouter/anthropic/claude-3.5-sonnet",
  "openrouter/anthropic/claude-3.5-sonnet:beta",
  "openrouter/anthropic/claude-3.7-sonnet",
  "openrouter/anthropic/claude-3.7-sonnet:beta",
  "anthropic.claude-opus-4-1-20250805-v1:0",
  "anthropic.claude-opus-4-20250514-v1:0",
  "anthropic.claude-sonnet-4-20250514-v1:0",
  "anthropic.claude-3-7-sonnet-20250219-v1:0",
  "anthropic.claude-3-5-sonnet-20241022-v2:0",
  "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
  "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
  "us.anthropic.claude-opus-4-1-20250805-v1:0",
  "us.anthropic.claude-opus-4-20250514-v1:0",
  "us.anthropic.claude-sonnet-4-20250514-v1:0",
  "eu.anthropic.claude-3-5-sonnet-20241022-v2:0",
  "eu.anthropic.claude-3-7-sonnet-20250219-v1:0",
  "eu.anthropic.claude-opus-4-1-20250805-v1:0",
  "eu.anthropic.claude-opus-4-20250514-v1:0",
  "eu.anthropic.claude-sonnet-4-20250514-v1:0",
  "snowflake/claude-3-5-sonnet"
]);

// src/providers/lm-studio.ts
var LMSTUDIO_DEFAULT_TEMPERATURE = 0;
var lMStudioDefaultModelId = "mistralai/devstral-small-2505";
var lMStudioDefaultModelInfo = {
  maxTokens: 8192,
  contextWindow: 2e5,
  supportsImages: true,
  supportsComputerUse: true,
  supportsPromptCache: true,
  inputPrice: 0,
  outputPrice: 0,
  cacheWritesPrice: 0,
  cacheReadsPrice: 0,
  description: "LM Studio hosted models"
};

// src/providers/mistral.ts
var mistralDefaultModelId = "codestral-latest";
var mistralModels = {
  "magistral-medium-latest": {
    maxTokens: 41e3,
    contextWindow: 41e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 2,
    outputPrice: 5
  },
  "devstral-medium-latest": {
    maxTokens: 131e3,
    contextWindow: 131e3,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0.4,
    outputPrice: 2
  },
  "mistral-medium-latest": {
    maxTokens: 131e3,
    contextWindow: 131e3,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0.4,
    outputPrice: 2
  },
  "codestral-latest": {
    maxTokens: 256e3,
    contextWindow: 256e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.3,
    outputPrice: 0.9
  },
  "mistral-large-latest": {
    maxTokens: 131e3,
    contextWindow: 131e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 2,
    outputPrice: 6
  },
  "ministral-8b-latest": {
    maxTokens: 131e3,
    contextWindow: 131e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.1,
    outputPrice: 0.1
  },
  "ministral-3b-latest": {
    maxTokens: 131e3,
    contextWindow: 131e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.04,
    outputPrice: 0.04
  },
  "mistral-small-latest": {
    maxTokens: 32e3,
    contextWindow: 32e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.2,
    outputPrice: 0.6
  },
  "pixtral-large-latest": {
    maxTokens: 131e3,
    contextWindow: 131e3,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 2,
    outputPrice: 6
  }
};
var MISTRAL_DEFAULT_TEMPERATURE = 0;

// src/providers/moonshot.ts
var moonshotDefaultModelId = "kimi-k2-0711-preview";
var moonshotModels = {
  "kimi-k2-0711-preview": {
    maxTokens: 32e3,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 0.6,
    // $0.60 per million tokens (cache miss)
    outputPrice: 2.5,
    // $2.50 per million tokens
    cacheWritesPrice: 0,
    // $0 per million tokens (cache miss)
    cacheReadsPrice: 0.15,
    // $0.15 per million tokens (cache hit)
    description: `Kimi K2 is a state-of-the-art mixture-of-experts (MoE) language model with 32 billion activated parameters and 1 trillion total parameters.`
  }
};
var MOONSHOT_DEFAULT_TEMPERATURE = 0.6;

// src/providers/ollama.ts
var ollamaDefaultModelId = "devstral:24b";
var ollamaDefaultModelInfo = {
  maxTokens: 4096,
  contextWindow: 2e5,
  supportsImages: true,
  supportsComputerUse: true,
  supportsPromptCache: true,
  inputPrice: 0,
  outputPrice: 0,
  cacheWritesPrice: 0,
  cacheReadsPrice: 0,
  description: "Ollama hosted models"
};

// src/providers/openai.ts
var openAiNativeDefaultModelId = "gpt-5-2025-08-07";
var openAiNativeModels = {
  "gpt-5-2025-08-07": {
    maxTokens: 128e3,
    contextWindow: 4e5,
    supportsImages: true,
    supportsPromptCache: true,
    supportsReasoningEffort: true,
    reasoningEffort: "medium",
    inputPrice: 1.25,
    outputPrice: 10,
    cacheReadsPrice: 0.13,
    description: "GPT-5: The best model for coding and agentic tasks across domains",
    // supportsVerbosity is a new capability; ensure ModelInfo includes it
    supportsVerbosity: true
  },
  "gpt-5-mini-2025-08-07": {
    maxTokens: 128e3,
    contextWindow: 4e5,
    supportsImages: true,
    supportsPromptCache: true,
    supportsReasoningEffort: true,
    reasoningEffort: "medium",
    inputPrice: 0.25,
    outputPrice: 2,
    cacheReadsPrice: 0.03,
    description: "GPT-5 Mini: A faster, more cost-efficient version of GPT-5 for well-defined tasks",
    supportsVerbosity: true
  },
  "gpt-5-nano-2025-08-07": {
    maxTokens: 128e3,
    contextWindow: 4e5,
    supportsImages: true,
    supportsPromptCache: true,
    supportsReasoningEffort: true,
    reasoningEffort: "medium",
    inputPrice: 0.05,
    outputPrice: 0.4,
    cacheReadsPrice: 0.01,
    description: "GPT-5 Nano: Fastest, most cost-efficient version of GPT-5",
    supportsVerbosity: true
  },
  "gpt-4.1": {
    maxTokens: 32768,
    contextWindow: 1047576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 2,
    outputPrice: 8,
    cacheReadsPrice: 0.5
  },
  "gpt-4.1-mini": {
    maxTokens: 32768,
    contextWindow: 1047576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.4,
    outputPrice: 1.6,
    cacheReadsPrice: 0.1
  },
  "gpt-4.1-nano": {
    maxTokens: 32768,
    contextWindow: 1047576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.1,
    outputPrice: 0.4,
    cacheReadsPrice: 0.025
  },
  o3: {
    maxTokens: 1e5,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 2,
    outputPrice: 8,
    cacheReadsPrice: 0.5,
    supportsReasoningEffort: true,
    reasoningEffort: "medium"
  },
  "o3-high": {
    maxTokens: 1e5,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 2,
    outputPrice: 8,
    cacheReadsPrice: 0.5,
    reasoningEffort: "high"
  },
  "o3-low": {
    maxTokens: 1e5,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 2,
    outputPrice: 8,
    cacheReadsPrice: 0.5,
    reasoningEffort: "low"
  },
  "o4-mini": {
    maxTokens: 1e5,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 1.1,
    outputPrice: 4.4,
    cacheReadsPrice: 0.275,
    supportsReasoningEffort: true,
    reasoningEffort: "medium"
  },
  "o4-mini-high": {
    maxTokens: 1e5,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 1.1,
    outputPrice: 4.4,
    cacheReadsPrice: 0.275,
    reasoningEffort: "high"
  },
  "o4-mini-low": {
    maxTokens: 1e5,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 1.1,
    outputPrice: 4.4,
    cacheReadsPrice: 0.275,
    reasoningEffort: "low"
  },
  "o3-mini": {
    maxTokens: 1e5,
    contextWindow: 2e5,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 1.1,
    outputPrice: 4.4,
    cacheReadsPrice: 0.55,
    supportsReasoningEffort: true,
    reasoningEffort: "medium"
  },
  "o3-mini-high": {
    maxTokens: 1e5,
    contextWindow: 2e5,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 1.1,
    outputPrice: 4.4,
    cacheReadsPrice: 0.55,
    reasoningEffort: "high"
  },
  "o3-mini-low": {
    maxTokens: 1e5,
    contextWindow: 2e5,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 1.1,
    outputPrice: 4.4,
    cacheReadsPrice: 0.55,
    reasoningEffort: "low"
  },
  o1: {
    maxTokens: 1e5,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 15,
    outputPrice: 60,
    cacheReadsPrice: 7.5
  },
  "o1-preview": {
    maxTokens: 32768,
    contextWindow: 128e3,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 15,
    outputPrice: 60,
    cacheReadsPrice: 7.5
  },
  "o1-mini": {
    maxTokens: 65536,
    contextWindow: 128e3,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 1.1,
    outputPrice: 4.4,
    cacheReadsPrice: 0.55
  },
  "gpt-4.5-preview": {
    maxTokens: 16384,
    contextWindow: 128e3,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 75,
    outputPrice: 150,
    cacheReadsPrice: 37.5
  },
  "gpt-4o": {
    maxTokens: 16384,
    contextWindow: 128e3,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 2.5,
    outputPrice: 10,
    cacheReadsPrice: 1.25
  },
  "gpt-4o-mini": {
    maxTokens: 16384,
    contextWindow: 128e3,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.15,
    outputPrice: 0.6,
    cacheReadsPrice: 0.075
  },
  "codex-mini-latest": {
    maxTokens: 16384,
    contextWindow: 2e5,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 1.5,
    outputPrice: 6,
    cacheReadsPrice: 0,
    description: "Codex Mini: Cloud-based software engineering agent powered by codex-1, a version of o3 optimized for coding tasks. Trained with reinforcement learning to generate human-style code, adhere to instructions, and iteratively run tests."
  }
};
var openAiModelInfoSaneDefaults = {
  maxTokens: -1,
  contextWindow: 128e3,
  supportsImages: true,
  supportsPromptCache: false,
  inputPrice: 0,
  outputPrice: 0
};
var azureOpenAiDefaultApiVersion = "2024-08-01-preview";
var OPENAI_NATIVE_DEFAULT_TEMPERATURE = 0;
var GPT5_DEFAULT_TEMPERATURE = 1;
var OPENAI_AZURE_AI_INFERENCE_PATH = "/models/chat/completions";

// src/providers/openrouter.ts
var openRouterDefaultModelId = "anthropic/claude-sonnet-4";
var openRouterDefaultModelInfo = {
  maxTokens: 8192,
  contextWindow: 2e5,
  supportsImages: true,
  supportsComputerUse: true,
  supportsPromptCache: true,
  inputPrice: 3,
  outputPrice: 15,
  cacheWritesPrice: 3.75,
  cacheReadsPrice: 0.3,
  description: "Claude 3.7 Sonnet is an advanced large language model with improved reasoning, coding, and problem-solving capabilities. It introduces a hybrid reasoning approach, allowing users to choose between rapid responses and extended, step-by-step processing for complex tasks. The model demonstrates notable improvements in coding, particularly in front-end development and full-stack updates, and excels in agentic workflows, where it can autonomously navigate multi-step processes. Claude 3.7 Sonnet maintains performance parity with its predecessor in standard mode while offering an extended reasoning mode for enhanced accuracy in math, coding, and instruction-following tasks. Read more at the [blog post here](https://www.anthropic.com/news/claude-3-7-sonnet)"
};
var OPENROUTER_DEFAULT_PROVIDER_NAME = "[default]";
var OPEN_ROUTER_PROMPT_CACHING_MODELS = /* @__PURE__ */ new Set([
  "anthropic/claude-3-haiku",
  "anthropic/claude-3-haiku:beta",
  "anthropic/claude-3-opus",
  "anthropic/claude-3-opus:beta",
  "anthropic/claude-3-sonnet",
  "anthropic/claude-3-sonnet:beta",
  "anthropic/claude-3.5-haiku",
  "anthropic/claude-3.5-haiku-20241022",
  "anthropic/claude-3.5-haiku-20241022:beta",
  "anthropic/claude-3.5-haiku:beta",
  "anthropic/claude-3.5-sonnet",
  "anthropic/claude-3.5-sonnet-20240620",
  "anthropic/claude-3.5-sonnet-20240620:beta",
  "anthropic/claude-3.5-sonnet:beta",
  "anthropic/claude-3.7-sonnet",
  "anthropic/claude-3.7-sonnet:beta",
  "anthropic/claude-3.7-sonnet:thinking",
  "anthropic/claude-sonnet-4",
  "anthropic/claude-opus-4",
  "anthropic/claude-opus-4.1",
  "google/gemini-2.5-flash-preview",
  "google/gemini-2.5-flash-preview:thinking",
  "google/gemini-2.5-flash-preview-05-20",
  "google/gemini-2.5-flash-preview-05-20:thinking",
  "google/gemini-2.5-flash",
  "google/gemini-2.5-flash-lite-preview-06-17",
  "google/gemini-2.0-flash-001",
  "google/gemini-flash-1.5",
  "google/gemini-flash-1.5-8b"
]);
var OPEN_ROUTER_COMPUTER_USE_MODELS = /* @__PURE__ */ new Set([
  "anthropic/claude-3.5-sonnet",
  "anthropic/claude-3.5-sonnet:beta",
  "anthropic/claude-3.7-sonnet",
  "anthropic/claude-3.7-sonnet:beta",
  "anthropic/claude-3.7-sonnet:thinking",
  "anthropic/claude-sonnet-4",
  "anthropic/claude-opus-4",
  "anthropic/claude-opus-4.1"
]);
var OPEN_ROUTER_REQUIRED_REASONING_BUDGET_MODELS = /* @__PURE__ */ new Set([
  "anthropic/claude-3.7-sonnet:thinking",
  "google/gemini-2.5-pro",
  "google/gemini-2.5-flash-preview-05-20:thinking"
]);
var OPEN_ROUTER_REASONING_BUDGET_MODELS = /* @__PURE__ */ new Set([
  "anthropic/claude-3.7-sonnet:beta",
  "anthropic/claude-opus-4",
  "anthropic/claude-opus-4.1",
  "anthropic/claude-sonnet-4",
  "google/gemini-2.5-pro-preview",
  "google/gemini-2.5-pro",
  "google/gemini-2.5-flash-preview-05-20",
  "google/gemini-2.5-flash",
  "google/gemini-2.5-flash-lite-preview-06-17",
  // Also include the models that require the reasoning budget to be enabled
  // even though `OPEN_ROUTER_REQUIRED_REASONING_BUDGET_MODELS` takes precedence.
  "anthropic/claude-3.7-sonnet:thinking",
  "google/gemini-2.5-flash-preview-05-20:thinking"
]);

// src/providers/requesty.ts
var requestyDefaultModelId = "coding/claude-4-sonnet";
var requestyDefaultModelInfo = {
  maxTokens: 8192,
  contextWindow: 2e5,
  supportsImages: true,
  supportsComputerUse: true,
  supportsPromptCache: true,
  inputPrice: 3,
  outputPrice: 15,
  cacheWritesPrice: 3.75,
  cacheReadsPrice: 0.3,
  description: "The best coding model, optimized by Requesty, and automatically routed to the fastest provider. Claude 4 Sonnet is an advanced large language model with improved reasoning, coding, and problem-solving capabilities."
};

// src/providers/sambanova.ts
var sambaNovaDefaultModelId = "Meta-Llama-3.3-70B-Instruct";
var sambaNovaModels = {
  "Meta-Llama-3.1-8B-Instruct": {
    maxTokens: 8192,
    contextWindow: 16384,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.1,
    outputPrice: 0.2,
    description: "Meta Llama 3.1 8B Instruct model with 16K context window."
  },
  "Meta-Llama-3.3-70B-Instruct": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.6,
    outputPrice: 1.2,
    description: "Meta Llama 3.3 70B Instruct model with 128K context window."
  },
  "DeepSeek-R1": {
    maxTokens: 8192,
    contextWindow: 32768,
    supportsImages: false,
    supportsPromptCache: false,
    supportsReasoningBudget: true,
    inputPrice: 5,
    outputPrice: 7,
    description: "DeepSeek R1 reasoning model with 32K context window."
  },
  "DeepSeek-V3-0324": {
    maxTokens: 8192,
    contextWindow: 32768,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 3,
    outputPrice: 4.5,
    description: "DeepSeek V3 model with 32K context window."
  },
  "DeepSeek-R1-Distill-Llama-70B": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.7,
    outputPrice: 1.4,
    description: "DeepSeek R1 distilled Llama 70B model with 128K context window."
  },
  "Llama-4-Maverick-17B-128E-Instruct": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0.63,
    outputPrice: 1.8,
    description: "Meta Llama 4 Maverick 17B 128E Instruct model with 128K context window."
  },
  "Llama-3.3-Swallow-70B-Instruct-v0.4": {
    maxTokens: 8192,
    contextWindow: 16384,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.6,
    outputPrice: 1.2,
    description: "Tokyotech Llama 3.3 Swallow 70B Instruct v0.4 model with 16K context window."
  },
  "Qwen3-32B": {
    maxTokens: 8192,
    contextWindow: 8192,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.4,
    outputPrice: 0.8,
    description: "Alibaba Qwen 3 32B model with 8K context window."
  }
};

// src/providers/unbound.ts
var unboundDefaultModelId = "anthropic/claude-3-7-sonnet-20250219";
var unboundDefaultModelInfo = {
  maxTokens: 8192,
  contextWindow: 2e5,
  supportsImages: true,
  supportsPromptCache: true,
  inputPrice: 3,
  outputPrice: 15,
  cacheWritesPrice: 3.75,
  cacheReadsPrice: 0.3
};

// src/providers/vertex.ts
var vertexDefaultModelId = "claude-sonnet-4@20250514";
var vertexModels = {
  "gemini-2.5-flash-preview-05-20:thinking": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.15,
    outputPrice: 3.5,
    maxThinkingTokens: 24576,
    supportsReasoningBudget: true,
    requiredReasoningBudget: true
  },
  "gemini-2.5-flash-preview-05-20": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.15,
    outputPrice: 0.6
  },
  "gemini-2.5-flash": {
    maxTokens: 64e3,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.3,
    outputPrice: 2.5,
    cacheReadsPrice: 0.075,
    cacheWritesPrice: 1,
    maxThinkingTokens: 24576,
    supportsReasoningBudget: true
  },
  "gemini-2.5-flash-preview-04-17:thinking": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0.15,
    outputPrice: 3.5,
    maxThinkingTokens: 24576,
    supportsReasoningBudget: true,
    requiredReasoningBudget: true
  },
  "gemini-2.5-flash-preview-04-17": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0.15,
    outputPrice: 0.6
  },
  "gemini-2.5-pro-preview-03-25": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 2.5,
    outputPrice: 15
  },
  "gemini-2.5-pro-preview-05-06": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 2.5,
    outputPrice: 15
  },
  "gemini-2.5-pro-preview-06-05": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 2.5,
    outputPrice: 15,
    maxThinkingTokens: 32768,
    supportsReasoningBudget: true
  },
  "gemini-2.5-pro": {
    maxTokens: 64e3,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 2.5,
    outputPrice: 15,
    maxThinkingTokens: 32768,
    supportsReasoningBudget: true,
    requiredReasoningBudget: true,
    tiers: [
      {
        contextWindow: 2e5,
        inputPrice: 1.25,
        outputPrice: 10,
        cacheReadsPrice: 0.31
      },
      {
        contextWindow: Infinity,
        inputPrice: 2.5,
        outputPrice: 15,
        cacheReadsPrice: 0.625
      }
    ]
  },
  "gemini-2.5-pro-exp-03-25": {
    maxTokens: 65535,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0
  },
  "gemini-2.0-pro-exp-02-05": {
    maxTokens: 8192,
    contextWindow: 2097152,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0
  },
  "gemini-2.0-flash-001": {
    maxTokens: 8192,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.15,
    outputPrice: 0.6
  },
  "gemini-2.0-flash-lite-001": {
    maxTokens: 8192,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0.075,
    outputPrice: 0.3
  },
  "gemini-2.0-flash-thinking-exp-01-21": {
    maxTokens: 8192,
    contextWindow: 32768,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0
  },
  "gemini-1.5-flash-002": {
    maxTokens: 8192,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.075,
    outputPrice: 0.3
  },
  "gemini-1.5-pro-002": {
    maxTokens: 8192,
    contextWindow: 2097152,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 1.25,
    outputPrice: 5
  },
  "claude-sonnet-4@20250514": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    inputPrice: 3,
    outputPrice: 15,
    cacheWritesPrice: 3.75,
    cacheReadsPrice: 0.3,
    supportsReasoningBudget: true
  },
  "claude-opus-4-1@20250805": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    inputPrice: 15,
    outputPrice: 75,
    cacheWritesPrice: 18.75,
    cacheReadsPrice: 1.5,
    supportsReasoningBudget: true
  },
  "claude-opus-4@20250514": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    inputPrice: 15,
    outputPrice: 75,
    cacheWritesPrice: 18.75,
    cacheReadsPrice: 1.5
  },
  "claude-3-7-sonnet@20250219:thinking": {
    maxTokens: 64e3,
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    inputPrice: 3,
    outputPrice: 15,
    cacheWritesPrice: 3.75,
    cacheReadsPrice: 0.3,
    supportsReasoningBudget: true,
    requiredReasoningBudget: true
  },
  "claude-3-7-sonnet@20250219": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    inputPrice: 3,
    outputPrice: 15,
    cacheWritesPrice: 3.75,
    cacheReadsPrice: 0.3
  },
  "claude-3-5-sonnet-v2@20241022": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    inputPrice: 3,
    outputPrice: 15,
    cacheWritesPrice: 3.75,
    cacheReadsPrice: 0.3
  },
  "claude-3-5-sonnet@20240620": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 3,
    outputPrice: 15,
    cacheWritesPrice: 3.75,
    cacheReadsPrice: 0.3
  },
  "claude-3-5-haiku@20241022": {
    maxTokens: 8192,
    contextWindow: 2e5,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 1,
    outputPrice: 5,
    cacheWritesPrice: 1.25,
    cacheReadsPrice: 0.1
  },
  "claude-3-opus@20240229": {
    maxTokens: 4096,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 15,
    outputPrice: 75,
    cacheWritesPrice: 18.75,
    cacheReadsPrice: 1.5
  },
  "claude-3-haiku@20240307": {
    maxTokens: 4096,
    contextWindow: 2e5,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.25,
    outputPrice: 1.25,
    cacheWritesPrice: 0.3,
    cacheReadsPrice: 0.03
  },
  "gemini-2.5-flash-lite-preview-06-17": {
    maxTokens: 64e3,
    contextWindow: 1048576,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 0.1,
    outputPrice: 0.4,
    cacheReadsPrice: 0.025,
    cacheWritesPrice: 1,
    maxThinkingTokens: 24576,
    supportsReasoningBudget: true
  },
  "llama-4-maverick-17b-128e-instruct-maas": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.35,
    outputPrice: 1.15,
    description: "Meta Llama 4 Maverick 17B Instruct model, 128K context."
  }
};
var VERTEX_REGIONS = [
  { value: "global", label: "global" },
  { value: "us-central1", label: "us-central1" },
  { value: "us-east1", label: "us-east1" },
  { value: "us-east4", label: "us-east4" },
  { value: "us-east5", label: "us-east5" },
  { value: "us-west1", label: "us-west1" },
  { value: "us-west2", label: "us-west2" },
  { value: "us-west3", label: "us-west3" },
  { value: "us-west4", label: "us-west4" },
  { value: "northamerica-northeast1", label: "northamerica-northeast1" },
  { value: "northamerica-northeast2", label: "northamerica-northeast2" },
  { value: "southamerica-east1", label: "southamerica-east1" },
  { value: "europe-west1", label: "europe-west1" },
  { value: "europe-west2", label: "europe-west2" },
  { value: "europe-west3", label: "europe-west3" },
  { value: "europe-west4", label: "europe-west4" },
  { value: "europe-west6", label: "europe-west6" },
  { value: "europe-central2", label: "europe-central2" },
  { value: "asia-east1", label: "asia-east1" },
  { value: "asia-east2", label: "asia-east2" },
  { value: "asia-northeast1", label: "asia-northeast1" },
  { value: "asia-northeast2", label: "asia-northeast2" },
  { value: "asia-northeast3", label: "asia-northeast3" },
  { value: "asia-south1", label: "asia-south1" },
  { value: "asia-south2", label: "asia-south2" },
  { value: "asia-southeast1", label: "asia-southeast1" },
  { value: "asia-southeast2", label: "asia-southeast2" },
  { value: "australia-southeast1", label: "australia-southeast1" },
  { value: "australia-southeast2", label: "australia-southeast2" },
  { value: "me-west1", label: "me-west1" },
  { value: "me-central1", label: "me-central1" },
  { value: "africa-south1", label: "africa-south1" }
];

// src/providers/vscode-llm.ts
var vscodeLlmDefaultModelId = "claude-3.5-sonnet";
var vscodeLlmModels = {
  "gpt-3.5-turbo": {
    contextWindow: 12114,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    family: "gpt-3.5-turbo",
    version: "gpt-3.5-turbo-0613",
    name: "GPT 3.5 Turbo",
    supportsToolCalling: true,
    maxInputTokens: 12114
  },
  "gpt-4o-mini": {
    contextWindow: 12115,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    family: "gpt-4o-mini",
    version: "gpt-4o-mini-2024-07-18",
    name: "GPT-4o mini",
    supportsToolCalling: true,
    maxInputTokens: 12115
  },
  "gpt-4": {
    contextWindow: 28501,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    family: "gpt-4",
    version: "gpt-4-0613",
    name: "GPT 4",
    supportsToolCalling: true,
    maxInputTokens: 28501
  },
  "gpt-4-0125-preview": {
    contextWindow: 63826,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    family: "gpt-4-turbo",
    version: "gpt-4-0125-preview",
    name: "GPT 4 Turbo",
    supportsToolCalling: true,
    maxInputTokens: 63826
  },
  "gpt-4o": {
    contextWindow: 63827,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    family: "gpt-4o",
    version: "gpt-4o-2024-11-20",
    name: "GPT-4o",
    supportsToolCalling: true,
    maxInputTokens: 63827
  },
  o1: {
    contextWindow: 19827,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    family: "o1-ga",
    version: "o1-2024-12-17",
    name: "o1 (Preview)",
    supportsToolCalling: true,
    maxInputTokens: 19827
  },
  "o3-mini": {
    contextWindow: 63827,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    family: "o3-mini",
    version: "o3-mini-2025-01-31",
    name: "o3-mini",
    supportsToolCalling: true,
    maxInputTokens: 63827
  },
  "claude-3.5-sonnet": {
    contextWindow: 81638,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    family: "claude-3.5-sonnet",
    version: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    supportsToolCalling: true,
    maxInputTokens: 81638
  },
  "gemini-2.0-flash-001": {
    contextWindow: 127827,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    family: "gemini-2.0-flash",
    version: "gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    supportsToolCalling: false,
    maxInputTokens: 127827
  },
  "gemini-2.5-pro": {
    contextWindow: 63830,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    family: "gemini-2.5-pro",
    version: "gemini-2.5-pro-preview-03-25",
    name: "Gemini 2.5 Pro (Preview)",
    supportsToolCalling: true,
    maxInputTokens: 63830
  },
  "o4-mini": {
    contextWindow: 111446,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    family: "o4-mini",
    version: "o4-mini-2025-04-16",
    name: "o4-mini (Preview)",
    supportsToolCalling: true,
    maxInputTokens: 111446
  },
  "gpt-4.1": {
    contextWindow: 111446,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 0,
    outputPrice: 0,
    family: "gpt-4.1",
    version: "gpt-4.1-2025-04-14",
    name: "GPT-4.1 (Preview)",
    supportsToolCalling: true,
    maxInputTokens: 111446
  }
};

// src/providers/xai.ts
var xaiDefaultModelId = "grok-4";
var xaiModels = {
  "grok-4": {
    maxTokens: 8192,
    contextWindow: 256e3,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 3,
    outputPrice: 15,
    cacheWritesPrice: 0.75,
    cacheReadsPrice: 0.75,
    description: "xAI's Grok-4 model with 256K context window"
  },
  "grok-3": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 3,
    outputPrice: 15,
    cacheWritesPrice: 0.75,
    cacheReadsPrice: 0.75,
    description: "xAI's Grok-3 model with 128K context window"
  },
  "grok-3-fast": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 5,
    outputPrice: 25,
    cacheWritesPrice: 1.25,
    cacheReadsPrice: 1.25,
    description: "xAI's Grok-3 fast model with 128K context window"
  },
  "grok-3-mini": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 0.3,
    outputPrice: 0.5,
    cacheWritesPrice: 0.07,
    cacheReadsPrice: 0.07,
    description: "xAI's Grok-3 mini model with 128K context window",
    supportsReasoningEffort: true
  },
  "grok-3-mini-fast": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 0.6,
    outputPrice: 4,
    cacheWritesPrice: 0.15,
    cacheReadsPrice: 0.15,
    description: "xAI's Grok-3 mini fast model with 128K context window",
    supportsReasoningEffort: true
  },
  "grok-2-1212": {
    maxTokens: 8192,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 2,
    outputPrice: 10,
    description: "xAI's Grok-2 model (version 1212) with 128K context window"
  },
  "grok-2-vision-1212": {
    maxTokens: 8192,
    contextWindow: 32768,
    supportsImages: true,
    supportsPromptCache: false,
    inputPrice: 2,
    outputPrice: 10,
    description: "xAI's Grok-2 Vision model (version 1212) with image support and 32K context window"
  }
};

// src/providers/doubao.ts
var doubaoDefaultModelId = "doubao-seed-1-6-250615";
var doubaoModels = {
  "doubao-seed-1-6-250615": {
    maxTokens: 32768,
    contextWindow: 128e3,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 1e-4,
    // $0.0001 per million tokens (cache miss)
    outputPrice: 4e-4,
    // $0.0004 per million tokens
    cacheWritesPrice: 1e-4,
    // $0.0001 per million tokens (cache miss)
    cacheReadsPrice: 2e-5,
    // $0.00002 per million tokens (cache hit)
    description: `Doubao Seed 1.6 is a powerful model designed for high-performance tasks with extensive context handling.`
  },
  "doubao-seed-1-6-thinking-250715": {
    maxTokens: 32768,
    contextWindow: 128e3,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 2e-4,
    // $0.0002 per million tokens
    outputPrice: 8e-4,
    // $0.0008 per million tokens
    cacheWritesPrice: 2e-4,
    // $0.0002 per million
    cacheReadsPrice: 4e-5,
    // $0.00004 per million tokens (cache hit)
    description: `Doubao Seed 1.6 Thinking is optimized for reasoning tasks, providing enhanced performance in complex problem-solving scenarios.`
  },
  "doubao-seed-1-6-flash-250715": {
    maxTokens: 32768,
    contextWindow: 128e3,
    supportsImages: true,
    supportsPromptCache: true,
    inputPrice: 15e-5,
    // $0.00015 per million tokens
    outputPrice: 6e-4,
    // $0.0006 per million tokens
    cacheWritesPrice: 15e-5,
    // $0.00015 per million
    cacheReadsPrice: 3e-5,
    // $0.00003 per million tokens (cache hit)
    description: `Doubao Seed 1.6 Flash is tailored for speed and efficiency, making it ideal for applications requiring rapid responses.`
  }
};
var doubaoDefaultModelInfo = doubaoModels[doubaoDefaultModelId];
var DOUBAO_API_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3";
var DOUBAO_API_CHAT_PATH = "/chat/completions";

// src/providers/zai.ts
var internationalZAiDefaultModelId = "glm-4.5";
var internationalZAiModels = {
  "glm-4.5": {
    maxTokens: 98304,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 0.6,
    outputPrice: 2.2,
    cacheWritesPrice: 0,
    cacheReadsPrice: 0.11,
    description: "GLM-4.5 is Zhipu's latest featured model. Its comprehensive capabilities in reasoning, coding, and agent reach the state-of-the-art (SOTA) level among open-source models, with a context length of up to 128k."
  },
  "glm-4.5-air": {
    maxTokens: 98304,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 0.2,
    outputPrice: 1.1,
    cacheWritesPrice: 0,
    cacheReadsPrice: 0.03,
    description: "GLM-4.5-Air is the lightweight version of GLM-4.5. It balances performance and cost-effectiveness, and can flexibly switch to hybrid thinking models."
  }
};
var mainlandZAiDefaultModelId = "glm-4.5";
var mainlandZAiModels = {
  "glm-4.5": {
    maxTokens: 98304,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 0.29,
    outputPrice: 1.14,
    cacheWritesPrice: 0,
    cacheReadsPrice: 0.057,
    description: "GLM-4.5 is Zhipu's latest featured model. Its comprehensive capabilities in reasoning, coding, and agent reach the state-of-the-art (SOTA) level among open-source models, with a context length of up to 128k.",
    tiers: [
      {
        contextWindow: 32e3,
        inputPrice: 0.21,
        outputPrice: 1,
        cacheReadsPrice: 0.043
      },
      {
        contextWindow: 128e3,
        inputPrice: 0.29,
        outputPrice: 1.14,
        cacheReadsPrice: 0.057
      },
      {
        contextWindow: Infinity,
        inputPrice: 0.29,
        outputPrice: 1.14,
        cacheReadsPrice: 0.057
      }
    ]
  },
  "glm-4.5-air": {
    maxTokens: 98304,
    contextWindow: 131072,
    supportsImages: false,
    supportsPromptCache: true,
    inputPrice: 0.1,
    outputPrice: 0.6,
    cacheWritesPrice: 0,
    cacheReadsPrice: 0.02,
    description: "GLM-4.5-Air is the lightweight version of GLM-4.5. It balances performance and cost-effectiveness, and can flexibly switch to hybrid thinking models.",
    tiers: [
      {
        contextWindow: 32e3,
        inputPrice: 0.07,
        outputPrice: 0.4,
        cacheReadsPrice: 0.014
      },
      {
        contextWindow: 128e3,
        inputPrice: 0.1,
        outputPrice: 0.6,
        cacheReadsPrice: 0.02
      },
      {
        contextWindow: Infinity,
        inputPrice: 0.1,
        outputPrice: 0.6,
        cacheReadsPrice: 0.02
      }
    ]
  }
};
var ZAI_DEFAULT_TEMPERATURE = 0;

// src/providers/fireworks.ts
var fireworksDefaultModelId = "accounts/fireworks/models/kimi-k2-instruct";
var fireworksModels = {
  "accounts/fireworks/models/kimi-k2-instruct": {
    maxTokens: 16384,
    contextWindow: 128e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.6,
    outputPrice: 2.5,
    description: "Kimi K2 is a state-of-the-art mixture-of-experts (MoE) language model with 32 billion activated parameters and 1 trillion total parameters. Trained with the Muon optimizer, Kimi K2 achieves exceptional performance across frontier knowledge, reasoning, and coding tasks while being meticulously optimized for agentic capabilities."
  },
  "accounts/fireworks/models/qwen3-235b-a22b-instruct-2507": {
    maxTokens: 32768,
    contextWindow: 256e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.22,
    outputPrice: 0.88,
    description: "Latest Qwen3 thinking model, competitive against the best closed source models in Jul 2025."
  },
  "accounts/fireworks/models/qwen3-coder-480b-a35b-instruct": {
    maxTokens: 32768,
    contextWindow: 256e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.45,
    outputPrice: 1.8,
    description: "Qwen3's most agentic code model to date."
  },
  "accounts/fireworks/models/deepseek-r1-0528": {
    maxTokens: 20480,
    contextWindow: 16e4,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 3,
    outputPrice: 8,
    description: "05/28 updated checkpoint of Deepseek R1. Its overall performance is now approaching that of leading models, such as O3 and Gemini 2.5 Pro. Compared to the previous version, the upgraded model shows significant improvements in handling complex reasoning tasks, and this version also offers a reduced hallucination rate, enhanced support for function calling, and better experience for vibe coding. Note that fine-tuning for this model is only available through contacting fireworks at https://fireworks.ai/company/contact-us."
  },
  "accounts/fireworks/models/deepseek-v3": {
    maxTokens: 16384,
    contextWindow: 128e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.9,
    outputPrice: 0.9,
    description: "A strong Mixture-of-Experts (MoE) language model with 671B total parameters with 37B activated for each token from Deepseek. Note that fine-tuning for this model is only available through contacting fireworks at https://fireworks.ai/company/contact-us."
  },
  "accounts/fireworks/models/glm-4p5": {
    maxTokens: 16384,
    contextWindow: 128e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.55,
    outputPrice: 2.19,
    description: "Z.ai GLM-4.5 with 355B total parameters and 32B active parameters. Features unified reasoning, coding, and intelligent agent capabilities."
  },
  "accounts/fireworks/models/glm-4p5-air": {
    maxTokens: 16384,
    contextWindow: 128e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.55,
    outputPrice: 2.19,
    description: "Z.ai GLM-4.5-Air with 106B total parameters and 12B active parameters. Features unified reasoning, coding, and intelligent agent capabilities."
  },
  "accounts/fireworks/models/gpt-oss-20b": {
    maxTokens: 16384,
    contextWindow: 128e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.07,
    outputPrice: 0.3,
    description: "OpenAI gpt-oss-20b: Compact model for local/edge deployments. Optimized for low-latency and resource-constrained environments with chain-of-thought output, adjustable reasoning, and agentic workflows."
  },
  "accounts/fireworks/models/gpt-oss-120b": {
    maxTokens: 16384,
    contextWindow: 128e3,
    supportsImages: false,
    supportsPromptCache: false,
    inputPrice: 0.15,
    outputPrice: 0.6,
    description: "OpenAI gpt-oss-120b: Production-grade, general-purpose model that fits on a single H100 GPU. Features complex reasoning, configurable effort, full chain-of-thought transparency, and supports function calling, tool use, and structured outputs."
  }
};
export {
  ANTHROPIC_DEFAULT_MAX_TOKENS,
  ANTHROPIC_STYLE_PROVIDERS,
  AWS_INFERENCE_PROFILE_MAPPING,
  BEDROCK_DEFAULT_CONTEXT,
  BEDROCK_DEFAULT_TEMPERATURE,
  BEDROCK_MAX_TOKENS,
  BEDROCK_REGIONS,
  CLAUDE_CODE_DEFAULT_MAX_OUTPUT_TOKENS,
  CODEBASE_INDEX_DEFAULTS,
  DEEP_SEEK_DEFAULT_TEMPERATURE,
  DEFAULT_CONSECUTIVE_MISTAKE_LIMIT,
  DEFAULT_MODES,
  DEFAULT_TERMINAL_OUTPUT_CHARACTER_LIMIT,
  DEFAULT_USAGE_COLLECTION_TIMEOUT_MS,
  DEFAULT_WRITE_DELAY_MS,
  DOUBAO_API_BASE_URL,
  DOUBAO_API_CHAT_PATH,
  EVALS_SETTINGS,
  EVALS_TIMEOUT,
  GLAMA_DEFAULT_TEMPERATURE,
  GLOBAL_SETTINGS_KEYS,
  GLOBAL_STATE_KEYS,
  GPT5_DEFAULT_TEMPERATURE,
  HUGGINGFACE_API_URL,
  HUGGINGFACE_CACHE_DURATION,
  HUGGINGFACE_DEFAULT_CONTEXT_WINDOW,
  HUGGINGFACE_DEFAULT_MAX_TOKENS,
  HUGGINGFACE_MAX_TOKENS_FALLBACK,
  HUGGINGFACE_SLIDER_MIN,
  HUGGINGFACE_SLIDER_STEP,
  HUGGINGFACE_TEMPERATURE_MAX_VALUE,
  IO_INTELLIGENCE_CACHE_DURATION,
  IpcMessageType,
  IpcOrigin,
  LITELLM_COMPUTER_USE_MODELS,
  LMSTUDIO_DEFAULT_TEMPERATURE,
  MISTRAL_DEFAULT_TEMPERATURE,
  MODEL_ID_KEYS,
  MOONSHOT_DEFAULT_TEMPERATURE,
  OPENAI_AZURE_AI_INFERENCE_PATH,
  OPENAI_NATIVE_DEFAULT_TEMPERATURE,
  OPENROUTER_DEFAULT_PROVIDER_NAME,
  OPEN_ROUTER_COMPUTER_USE_MODELS,
  OPEN_ROUTER_PROMPT_CACHING_MODELS,
  OPEN_ROUTER_REASONING_BUDGET_MODELS,
  OPEN_ROUTER_REQUIRED_REASONING_BUDGET_MODELS,
  ORGANIZATION_ALLOW_ALL,
  ORGANIZATION_DEFAULT,
  PROVIDER_SETTINGS_KEYS,
  RooCodeEventName,
  SECRET_STATE_KEYS,
  TaskCommandName,
  TelemetryEventName,
  VERTEX_REGIONS,
  ZAI_DEFAULT_TEMPERATURE,
  a2aAgentCardSchema,
  ackSchema,
  agentApiConfigSchema,
  agentConfigSchema,
  agentDiscoveryQuerySchema,
  agentDiscoveryResultSchema,
  agentEndpointSchema,
  agentExportDataSchema,
  agentInstanceSchema,
  agentListOptionsSchema,
  agentPermissionSchema,
  agentRequestSchema,
  agentResponseSchema,
  agentTemplateDataSchema,
  agentTemplateSourceSchema,
  agentTodoSchema,
  agentToolConfigSchema,
  anthropicDefaultModelId,
  anthropicModels,
  appPropertiesSchema,
  azureOpenAiDefaultApiVersion,
  bedrockDefaultModelId,
  bedrockDefaultPromptRouterModelId,
  bedrockModels,
  blockingAsks,
  cerebrasDefaultModelId,
  cerebrasModels,
  chutesDefaultModelId,
  chutesModels,
  claudeCodeDefaultModelId,
  claudeCodeModels,
  clineAskSchema,
  clineAsks,
  clineMessageSchema,
  clineSaySchema,
  clineSays,
  codeActionIds,
  codebaseIndexConfigSchema,
  codebaseIndexModelsSchema,
  codebaseIndexProviderSchema,
  commandExecutionStatusSchema,
  commandIds,
  contextCondenseSchema,
  convertModelNameForVertex,
  customModePromptsSchema,
  customModesSettingsSchema,
  customSupportPromptsSchema,
  deepSeekDefaultModelId,
  deepSeekModels,
  discriminatedProviderSettingsWithIdSchema,
  doubaoDefaultModelId,
  doubaoDefaultModelInfo,
  doubaoModels,
  experimentIds,
  experimentIdsSchema,
  experimentsSchema,
  extendedReasoningEffortsSchema,
  fireworksDefaultModelId,
  fireworksModels,
  followUpDataSchema,
  geminiDefaultModelId,
  geminiModels,
  getApiProtocol,
  getClaudeCodeModelId,
  getModelId,
  gitPropertiesSchema,
  glamaDefaultModelId,
  glamaDefaultModelInfo,
  globalSettingsSchema,
  groqDefaultModelId,
  groqModels,
  groupEntrySchema,
  groupOptionsSchema,
  historyItemSchema,
  installMarketplaceItemOptionsSchema,
  internationalZAiDefaultModelId,
  internationalZAiModels,
  ioIntelligenceDefaultBaseUrl,
  ioIntelligenceDefaultModelId,
  ioIntelligenceModels,
  ipcMessageSchema,
  isBlockingAsk,
  isGlobalStateKey,
  isLanguage,
  isModelParameter,
  isSecretStateKey,
  lMStudioDefaultModelId,
  lMStudioDefaultModelInfo,
  languages,
  languagesSchema,
  litellmDefaultModelId,
  litellmDefaultModelInfo,
  mainlandZAiDefaultModelId,
  mainlandZAiModels,
  marketplaceItemSchema,
  marketplaceItemTypeSchema,
  mcpExecutionStatusSchema,
  mcpInstallationMethodSchema,
  mcpMarketplaceItemSchema,
  mcpParameterSchema,
  mistralDefaultModelId,
  mistralModels,
  modeConfigSchema,
  modeMarketplaceItemSchema,
  modelInfoSchema,
  modelParameters,
  modelParametersSchema,
  moonshotDefaultModelId,
  moonshotModels,
  ollamaDefaultModelId,
  ollamaDefaultModelInfo,
  openAiModelInfoSaneDefaults,
  openAiNativeDefaultModelId,
  openAiNativeModels,
  openRouterDefaultModelId,
  openRouterDefaultModelInfo,
  organizationAllowListSchema,
  organizationCloudSettingsSchema,
  organizationDefaultSettingsSchema,
  organizationSettingsSchema,
  promptComponentSchema,
  providerNames,
  providerNamesSchema,
  providerSettingsEntrySchema,
  providerSettingsSchema,
  providerSettingsSchemaDiscriminated,
  providerSettingsWithIdSchema,
  reasoningEfforts,
  reasoningEffortsSchema,
  requestyDefaultModelId,
  requestyDefaultModelInfo,
  resourceQuotaSchema,
  resourceUsageSchema,
  rooCodeEventsSchema,
  rooCodeSettingsSchema,
  rooCodeTelemetryEventSchema,
  sambaNovaDefaultModelId,
  sambaNovaModels,
  shareResponseSchema,
  suggestionItemSchema,
  taskCommandSchema,
  taskEventSchema,
  taskPropertiesSchema,
  telemetryPropertiesSchema,
  telemetrySettings,
  telemetrySettingsSchema,
  terminalActionIds,
  todoItemSchema,
  todoStatusSchema,
  tokenUsageSchema,
  toolGroups,
  toolGroupsSchema,
  toolNames,
  toolNamesSchema,
  toolProgressStatusSchema,
  toolUsageSchema,
  unboundDefaultModelId,
  unboundDefaultModelInfo,
  unifiedAgentRegistrySchema,
  verbosityLevels,
  verbosityLevelsSchema,
  vertexDefaultModelId,
  vertexModels,
  vscodeLlmDefaultModelId,
  vscodeLlmModels,
  xaiDefaultModelId,
  xaiModels
};
//# sourceMappingURL=index.js.map