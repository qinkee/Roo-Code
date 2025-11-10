"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ANTHROPIC_DEFAULT_MAX_TOKENS: () => ANTHROPIC_DEFAULT_MAX_TOKENS,
  ANTHROPIC_STYLE_PROVIDERS: () => ANTHROPIC_STYLE_PROVIDERS,
  AWS_INFERENCE_PROFILE_MAPPING: () => AWS_INFERENCE_PROFILE_MAPPING,
  BEDROCK_DEFAULT_CONTEXT: () => BEDROCK_DEFAULT_CONTEXT,
  BEDROCK_DEFAULT_TEMPERATURE: () => BEDROCK_DEFAULT_TEMPERATURE,
  BEDROCK_MAX_TOKENS: () => BEDROCK_MAX_TOKENS,
  BEDROCK_REGIONS: () => BEDROCK_REGIONS,
  CLAUDE_CODE_DEFAULT_MAX_OUTPUT_TOKENS: () => CLAUDE_CODE_DEFAULT_MAX_OUTPUT_TOKENS,
  CODEBASE_INDEX_DEFAULTS: () => CODEBASE_INDEX_DEFAULTS,
  DEEP_SEEK_DEFAULT_TEMPERATURE: () => DEEP_SEEK_DEFAULT_TEMPERATURE,
  DEFAULT_CONSECUTIVE_MISTAKE_LIMIT: () => DEFAULT_CONSECUTIVE_MISTAKE_LIMIT,
  DEFAULT_MODES: () => DEFAULT_MODES,
  DEFAULT_TERMINAL_OUTPUT_CHARACTER_LIMIT: () => DEFAULT_TERMINAL_OUTPUT_CHARACTER_LIMIT,
  DEFAULT_USAGE_COLLECTION_TIMEOUT_MS: () => DEFAULT_USAGE_COLLECTION_TIMEOUT_MS,
  DEFAULT_WRITE_DELAY_MS: () => DEFAULT_WRITE_DELAY_MS,
  DOUBAO_API_BASE_URL: () => DOUBAO_API_BASE_URL,
  DOUBAO_API_CHAT_PATH: () => DOUBAO_API_CHAT_PATH,
  EVALS_SETTINGS: () => EVALS_SETTINGS,
  EVALS_TIMEOUT: () => EVALS_TIMEOUT,
  GLAMA_DEFAULT_TEMPERATURE: () => GLAMA_DEFAULT_TEMPERATURE,
  GLOBAL_SETTINGS_KEYS: () => GLOBAL_SETTINGS_KEYS,
  GLOBAL_STATE_KEYS: () => GLOBAL_STATE_KEYS,
  GPT5_DEFAULT_TEMPERATURE: () => GPT5_DEFAULT_TEMPERATURE,
  HUGGINGFACE_API_URL: () => HUGGINGFACE_API_URL,
  HUGGINGFACE_CACHE_DURATION: () => HUGGINGFACE_CACHE_DURATION,
  HUGGINGFACE_DEFAULT_CONTEXT_WINDOW: () => HUGGINGFACE_DEFAULT_CONTEXT_WINDOW,
  HUGGINGFACE_DEFAULT_MAX_TOKENS: () => HUGGINGFACE_DEFAULT_MAX_TOKENS,
  HUGGINGFACE_MAX_TOKENS_FALLBACK: () => HUGGINGFACE_MAX_TOKENS_FALLBACK,
  HUGGINGFACE_SLIDER_MIN: () => HUGGINGFACE_SLIDER_MIN,
  HUGGINGFACE_SLIDER_STEP: () => HUGGINGFACE_SLIDER_STEP,
  HUGGINGFACE_TEMPERATURE_MAX_VALUE: () => HUGGINGFACE_TEMPERATURE_MAX_VALUE,
  IO_INTELLIGENCE_CACHE_DURATION: () => IO_INTELLIGENCE_CACHE_DURATION,
  IpcMessageType: () => IpcMessageType,
  IpcOrigin: () => IpcOrigin,
  LITELLM_COMPUTER_USE_MODELS: () => LITELLM_COMPUTER_USE_MODELS,
  LMSTUDIO_DEFAULT_TEMPERATURE: () => LMSTUDIO_DEFAULT_TEMPERATURE,
  MISTRAL_DEFAULT_TEMPERATURE: () => MISTRAL_DEFAULT_TEMPERATURE,
  MODEL_ID_KEYS: () => MODEL_ID_KEYS,
  MOONSHOT_DEFAULT_TEMPERATURE: () => MOONSHOT_DEFAULT_TEMPERATURE,
  OPENAI_AZURE_AI_INFERENCE_PATH: () => OPENAI_AZURE_AI_INFERENCE_PATH,
  OPENAI_NATIVE_DEFAULT_TEMPERATURE: () => OPENAI_NATIVE_DEFAULT_TEMPERATURE,
  OPENROUTER_DEFAULT_PROVIDER_NAME: () => OPENROUTER_DEFAULT_PROVIDER_NAME,
  OPEN_ROUTER_COMPUTER_USE_MODELS: () => OPEN_ROUTER_COMPUTER_USE_MODELS,
  OPEN_ROUTER_PROMPT_CACHING_MODELS: () => OPEN_ROUTER_PROMPT_CACHING_MODELS,
  OPEN_ROUTER_REASONING_BUDGET_MODELS: () => OPEN_ROUTER_REASONING_BUDGET_MODELS,
  OPEN_ROUTER_REQUIRED_REASONING_BUDGET_MODELS: () => OPEN_ROUTER_REQUIRED_REASONING_BUDGET_MODELS,
  ORGANIZATION_ALLOW_ALL: () => ORGANIZATION_ALLOW_ALL,
  ORGANIZATION_DEFAULT: () => ORGANIZATION_DEFAULT,
  PROVIDER_SETTINGS_KEYS: () => PROVIDER_SETTINGS_KEYS,
  RooCodeEventName: () => RooCodeEventName,
  SECRET_STATE_KEYS: () => SECRET_STATE_KEYS,
  TaskCommandName: () => TaskCommandName,
  TelemetryEventName: () => TelemetryEventName,
  VERTEX_REGIONS: () => VERTEX_REGIONS,
  ZAI_DEFAULT_TEMPERATURE: () => ZAI_DEFAULT_TEMPERATURE,
  a2aAgentCardSchema: () => a2aAgentCardSchema,
  ackSchema: () => ackSchema,
  agentApiConfigSchema: () => agentApiConfigSchema,
  agentConfigSchema: () => agentConfigSchema,
  agentDiscoveryQuerySchema: () => agentDiscoveryQuerySchema,
  agentDiscoveryResultSchema: () => agentDiscoveryResultSchema,
  agentEndpointSchema: () => agentEndpointSchema,
  agentExportDataSchema: () => agentExportDataSchema,
  agentInstanceSchema: () => agentInstanceSchema,
  agentListOptionsSchema: () => agentListOptionsSchema,
  agentPermissionSchema: () => agentPermissionSchema,
  agentRequestSchema: () => agentRequestSchema,
  agentResponseSchema: () => agentResponseSchema,
  agentTemplateDataSchema: () => agentTemplateDataSchema,
  agentTemplateSourceSchema: () => agentTemplateSourceSchema,
  agentTodoSchema: () => agentTodoSchema,
  agentToolConfigSchema: () => agentToolConfigSchema,
  anthropicDefaultModelId: () => anthropicDefaultModelId,
  anthropicModels: () => anthropicModels,
  appPropertiesSchema: () => appPropertiesSchema,
  azureOpenAiDefaultApiVersion: () => azureOpenAiDefaultApiVersion,
  bedrockDefaultModelId: () => bedrockDefaultModelId,
  bedrockDefaultPromptRouterModelId: () => bedrockDefaultPromptRouterModelId,
  bedrockModels: () => bedrockModels,
  blockingAsks: () => blockingAsks,
  cerebrasDefaultModelId: () => cerebrasDefaultModelId,
  cerebrasModels: () => cerebrasModels,
  chutesDefaultModelId: () => chutesDefaultModelId,
  chutesModels: () => chutesModels,
  claudeCodeDefaultModelId: () => claudeCodeDefaultModelId,
  claudeCodeModels: () => claudeCodeModels,
  clineAskSchema: () => clineAskSchema,
  clineAsks: () => clineAsks,
  clineMessageSchema: () => clineMessageSchema,
  clineSaySchema: () => clineSaySchema,
  clineSays: () => clineSays,
  codeActionIds: () => codeActionIds,
  codebaseIndexConfigSchema: () => codebaseIndexConfigSchema,
  codebaseIndexModelsSchema: () => codebaseIndexModelsSchema,
  codebaseIndexProviderSchema: () => codebaseIndexProviderSchema,
  commandExecutionStatusSchema: () => commandExecutionStatusSchema,
  commandIds: () => commandIds,
  contextCondenseSchema: () => contextCondenseSchema,
  convertModelNameForVertex: () => convertModelNameForVertex,
  customModePromptsSchema: () => customModePromptsSchema,
  customModesSettingsSchema: () => customModesSettingsSchema,
  customSupportPromptsSchema: () => customSupportPromptsSchema,
  deepSeekDefaultModelId: () => deepSeekDefaultModelId,
  deepSeekModels: () => deepSeekModels,
  discriminatedProviderSettingsWithIdSchema: () => discriminatedProviderSettingsWithIdSchema,
  doubaoDefaultModelId: () => doubaoDefaultModelId,
  doubaoDefaultModelInfo: () => doubaoDefaultModelInfo,
  doubaoModels: () => doubaoModels,
  experimentIds: () => experimentIds,
  experimentIdsSchema: () => experimentIdsSchema,
  experimentsSchema: () => experimentsSchema,
  extendedReasoningEffortsSchema: () => extendedReasoningEffortsSchema,
  fireworksDefaultModelId: () => fireworksDefaultModelId,
  fireworksModels: () => fireworksModels,
  followUpDataSchema: () => followUpDataSchema,
  geminiDefaultModelId: () => geminiDefaultModelId,
  geminiModels: () => geminiModels,
  getApiProtocol: () => getApiProtocol,
  getClaudeCodeModelId: () => getClaudeCodeModelId,
  getModelId: () => getModelId,
  gitPropertiesSchema: () => gitPropertiesSchema,
  glamaDefaultModelId: () => glamaDefaultModelId,
  glamaDefaultModelInfo: () => glamaDefaultModelInfo,
  globalSettingsSchema: () => globalSettingsSchema,
  groqDefaultModelId: () => groqDefaultModelId,
  groqModels: () => groqModels,
  groupEntrySchema: () => groupEntrySchema,
  groupOptionsSchema: () => groupOptionsSchema,
  historyItemSchema: () => historyItemSchema,
  installMarketplaceItemOptionsSchema: () => installMarketplaceItemOptionsSchema,
  internationalZAiDefaultModelId: () => internationalZAiDefaultModelId,
  internationalZAiModels: () => internationalZAiModels,
  ioIntelligenceDefaultBaseUrl: () => ioIntelligenceDefaultBaseUrl,
  ioIntelligenceDefaultModelId: () => ioIntelligenceDefaultModelId,
  ioIntelligenceModels: () => ioIntelligenceModels,
  ipcMessageSchema: () => ipcMessageSchema,
  isBlockingAsk: () => isBlockingAsk,
  isGlobalStateKey: () => isGlobalStateKey,
  isLanguage: () => isLanguage,
  isModelParameter: () => isModelParameter,
  isSecretStateKey: () => isSecretStateKey,
  lMStudioDefaultModelId: () => lMStudioDefaultModelId,
  lMStudioDefaultModelInfo: () => lMStudioDefaultModelInfo,
  languages: () => languages,
  languagesSchema: () => languagesSchema,
  litellmDefaultModelId: () => litellmDefaultModelId,
  litellmDefaultModelInfo: () => litellmDefaultModelInfo,
  mainlandZAiDefaultModelId: () => mainlandZAiDefaultModelId,
  mainlandZAiModels: () => mainlandZAiModels,
  marketplaceItemSchema: () => marketplaceItemSchema,
  marketplaceItemTypeSchema: () => marketplaceItemTypeSchema,
  mcpExecutionStatusSchema: () => mcpExecutionStatusSchema,
  mcpInstallationMethodSchema: () => mcpInstallationMethodSchema,
  mcpMarketplaceItemSchema: () => mcpMarketplaceItemSchema,
  mcpParameterSchema: () => mcpParameterSchema,
  mistralDefaultModelId: () => mistralDefaultModelId,
  mistralModels: () => mistralModels,
  modeConfigSchema: () => modeConfigSchema,
  modeMarketplaceItemSchema: () => modeMarketplaceItemSchema,
  modelInfoSchema: () => modelInfoSchema,
  modelParameters: () => modelParameters,
  modelParametersSchema: () => modelParametersSchema,
  moonshotDefaultModelId: () => moonshotDefaultModelId,
  moonshotModels: () => moonshotModels,
  ollamaDefaultModelId: () => ollamaDefaultModelId,
  ollamaDefaultModelInfo: () => ollamaDefaultModelInfo,
  openAiModelInfoSaneDefaults: () => openAiModelInfoSaneDefaults,
  openAiNativeDefaultModelId: () => openAiNativeDefaultModelId,
  openAiNativeModels: () => openAiNativeModels,
  openRouterDefaultModelId: () => openRouterDefaultModelId,
  openRouterDefaultModelInfo: () => openRouterDefaultModelInfo,
  organizationAllowListSchema: () => organizationAllowListSchema,
  organizationCloudSettingsSchema: () => organizationCloudSettingsSchema,
  organizationDefaultSettingsSchema: () => organizationDefaultSettingsSchema,
  organizationSettingsSchema: () => organizationSettingsSchema,
  promptComponentSchema: () => promptComponentSchema,
  providerNames: () => providerNames,
  providerNamesSchema: () => providerNamesSchema,
  providerSettingsEntrySchema: () => providerSettingsEntrySchema,
  providerSettingsSchema: () => providerSettingsSchema,
  providerSettingsSchemaDiscriminated: () => providerSettingsSchemaDiscriminated,
  providerSettingsWithIdSchema: () => providerSettingsWithIdSchema,
  reasoningEfforts: () => reasoningEfforts,
  reasoningEffortsSchema: () => reasoningEffortsSchema,
  requestyDefaultModelId: () => requestyDefaultModelId,
  requestyDefaultModelInfo: () => requestyDefaultModelInfo,
  resourceQuotaSchema: () => resourceQuotaSchema,
  resourceUsageSchema: () => resourceUsageSchema,
  rooCodeEventsSchema: () => rooCodeEventsSchema,
  rooCodeSettingsSchema: () => rooCodeSettingsSchema,
  rooCodeTelemetryEventSchema: () => rooCodeTelemetryEventSchema,
  sambaNovaDefaultModelId: () => sambaNovaDefaultModelId,
  sambaNovaModels: () => sambaNovaModels,
  shareResponseSchema: () => shareResponseSchema,
  suggestionItemSchema: () => suggestionItemSchema,
  taskCommandSchema: () => taskCommandSchema,
  taskEventSchema: () => taskEventSchema,
  taskPropertiesSchema: () => taskPropertiesSchema,
  telemetryPropertiesSchema: () => telemetryPropertiesSchema,
  telemetrySettings: () => telemetrySettings,
  telemetrySettingsSchema: () => telemetrySettingsSchema,
  terminalActionIds: () => terminalActionIds,
  todoItemSchema: () => todoItemSchema,
  todoStatusSchema: () => todoStatusSchema,
  tokenUsageSchema: () => tokenUsageSchema,
  toolGroups: () => toolGroups,
  toolGroupsSchema: () => toolGroupsSchema,
  toolNames: () => toolNames,
  toolNamesSchema: () => toolNamesSchema,
  toolProgressStatusSchema: () => toolProgressStatusSchema,
  toolUsageSchema: () => toolUsageSchema,
  unboundDefaultModelId: () => unboundDefaultModelId,
  unboundDefaultModelInfo: () => unboundDefaultModelInfo,
  unifiedAgentRegistrySchema: () => unifiedAgentRegistrySchema,
  verbosityLevels: () => verbosityLevels,
  verbosityLevelsSchema: () => verbosityLevelsSchema,
  vertexDefaultModelId: () => vertexDefaultModelId,
  vertexModels: () => vertexModels,
  vscodeLlmDefaultModelId: () => vscodeLlmDefaultModelId,
  vscodeLlmModels: () => vscodeLlmModels,
  xaiDefaultModelId: () => xaiDefaultModelId,
  xaiModels: () => xaiModels
});
module.exports = __toCommonJS(index_exports);

// src/agent.ts
var import_zod6 = require("zod");

// src/provider-settings.ts
var import_zod3 = require("zod");

// src/model.ts
var import_zod = require("zod");
var reasoningEfforts = ["low", "medium", "high"];
var reasoningEffortsSchema = import_zod.z.enum(reasoningEfforts);
var verbosityLevels = ["low", "medium", "high"];
var verbosityLevelsSchema = import_zod.z.enum(verbosityLevels);
var modelParameters = ["max_tokens", "temperature", "reasoning", "include_reasoning"];
var modelParametersSchema = import_zod.z.enum(modelParameters);
var isModelParameter = (value) => modelParameters.includes(value);
var modelInfoSchema = import_zod.z.object({
  maxTokens: import_zod.z.number().nullish(),
  maxThinkingTokens: import_zod.z.number().nullish(),
  contextWindow: import_zod.z.number(),
  supportsImages: import_zod.z.boolean().optional(),
  supportsComputerUse: import_zod.z.boolean().optional(),
  supportsPromptCache: import_zod.z.boolean(),
  // Capability flag to indicate whether the model supports an output verbosity parameter
  supportsVerbosity: import_zod.z.boolean().optional(),
  supportsReasoningBudget: import_zod.z.boolean().optional(),
  requiredReasoningBudget: import_zod.z.boolean().optional(),
  supportsReasoningEffort: import_zod.z.boolean().optional(),
  supportedParameters: import_zod.z.array(modelParametersSchema).optional(),
  inputPrice: import_zod.z.number().optional(),
  outputPrice: import_zod.z.number().optional(),
  cacheWritesPrice: import_zod.z.number().optional(),
  cacheReadsPrice: import_zod.z.number().optional(),
  description: import_zod.z.string().optional(),
  modelType: import_zod.z.string().optional(),
  reasoningEffort: reasoningEffortsSchema.optional(),
  minTokensPerCachePoint: import_zod.z.number().optional(),
  maxCachePoints: import_zod.z.number().optional(),
  cachableFields: import_zod.z.array(import_zod.z.string()).optional(),
  tiers: import_zod.z.array(
    import_zod.z.object({
      contextWindow: import_zod.z.number(),
      inputPrice: import_zod.z.number().optional(),
      outputPrice: import_zod.z.number().optional(),
      cacheWritesPrice: import_zod.z.number().optional(),
      cacheReadsPrice: import_zod.z.number().optional()
    })
  ).optional()
});

// src/codebase-index.ts
var import_zod2 = require("zod");
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
var codebaseIndexConfigSchema = import_zod2.z.object({
  codebaseIndexEnabled: import_zod2.z.boolean().optional(),
  codebaseIndexQdrantUrl: import_zod2.z.string().optional(),
  codebaseIndexEmbedderProvider: import_zod2.z.enum(["openai", "ollama", "openai-compatible", "gemini", "mistral"]).optional(),
  codebaseIndexEmbedderBaseUrl: import_zod2.z.string().optional(),
  codebaseIndexEmbedderModelId: import_zod2.z.string().optional(),
  codebaseIndexEmbedderModelDimension: import_zod2.z.number().optional(),
  codebaseIndexSearchMinScore: import_zod2.z.number().min(0).max(1).optional(),
  codebaseIndexSearchMaxResults: import_zod2.z.number().min(CODEBASE_INDEX_DEFAULTS.MIN_SEARCH_RESULTS).max(CODEBASE_INDEX_DEFAULTS.MAX_SEARCH_RESULTS).optional(),
  // OpenAI Compatible specific fields
  codebaseIndexOpenAiCompatibleBaseUrl: import_zod2.z.string().optional(),
  codebaseIndexOpenAiCompatibleModelDimension: import_zod2.z.number().optional()
});
var codebaseIndexModelsSchema = import_zod2.z.object({
  openai: import_zod2.z.record(import_zod2.z.string(), import_zod2.z.object({ dimension: import_zod2.z.number() })).optional(),
  ollama: import_zod2.z.record(import_zod2.z.string(), import_zod2.z.object({ dimension: import_zod2.z.number() })).optional(),
  "openai-compatible": import_zod2.z.record(import_zod2.z.string(), import_zod2.z.object({ dimension: import_zod2.z.number() })).optional(),
  gemini: import_zod2.z.record(import_zod2.z.string(), import_zod2.z.object({ dimension: import_zod2.z.number() })).optional(),
  mistral: import_zod2.z.record(import_zod2.z.string(), import_zod2.z.object({ dimension: import_zod2.z.number() })).optional()
});
var codebaseIndexProviderSchema = import_zod2.z.object({
  codeIndexOpenAiKey: import_zod2.z.string().optional(),
  codeIndexQdrantApiKey: import_zod2.z.string().optional(),
  codebaseIndexOpenAiCompatibleBaseUrl: import_zod2.z.string().optional(),
  codebaseIndexOpenAiCompatibleApiKey: import_zod2.z.string().optional(),
  codebaseIndexOpenAiCompatibleModelDimension: import_zod2.z.number().optional(),
  codebaseIndexGeminiApiKey: import_zod2.z.string().optional(),
  codebaseIndexMistralApiKey: import_zod2.z.string().optional()
});

// src/provider-settings.ts
var extendedReasoningEffortsSchema = import_zod3.z.union([reasoningEffortsSchema, import_zod3.z.literal("minimal")]);
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
var providerNamesSchema = import_zod3.z.enum(providerNames);
var providerSettingsEntrySchema = import_zod3.z.object({
  id: import_zod3.z.string(),
  name: import_zod3.z.string(),
  apiProvider: providerNamesSchema.optional(),
  // 添加model相关字段，支持不同provider的model字段
  modelId: import_zod3.z.string().optional()
  // 通用的model字段
});
var DEFAULT_CONSECUTIVE_MISTAKE_LIMIT = 3;
var baseProviderSettingsSchema = import_zod3.z.object({
  includeMaxTokens: import_zod3.z.boolean().optional(),
  diffEnabled: import_zod3.z.boolean().optional(),
  todoListEnabled: import_zod3.z.boolean().optional(),
  fuzzyMatchThreshold: import_zod3.z.number().optional(),
  modelTemperature: import_zod3.z.number().nullish(),
  rateLimitSeconds: import_zod3.z.number().optional(),
  consecutiveMistakeLimit: import_zod3.z.number().min(0).optional(),
  // Model reasoning.
  enableReasoningEffort: import_zod3.z.boolean().optional(),
  reasoningEffort: extendedReasoningEffortsSchema.optional(),
  modelMaxTokens: import_zod3.z.number().optional(),
  modelMaxThinkingTokens: import_zod3.z.number().optional(),
  // Model verbosity.
  verbosity: verbosityLevelsSchema.optional()
});
var apiModelIdProviderModelSchema = baseProviderSettingsSchema.extend({
  apiModelId: import_zod3.z.string().optional()
});
var anthropicSchema = apiModelIdProviderModelSchema.extend({
  apiKey: import_zod3.z.string().optional(),
  anthropicBaseUrl: import_zod3.z.string().optional(),
  anthropicUseAuthToken: import_zod3.z.boolean().optional(),
  anthropicBeta1MContext: import_zod3.z.boolean().optional()
  // Enable 'context-1m-2025-08-07' beta for 1M context window
});
var claudeCodeSchema = apiModelIdProviderModelSchema.extend({
  claudeCodePath: import_zod3.z.string().optional(),
  claudeCodeMaxOutputTokens: import_zod3.z.number().int().min(1).max(2e5).optional()
});
var glamaSchema = baseProviderSettingsSchema.extend({
  glamaModelId: import_zod3.z.string().optional(),
  glamaApiKey: import_zod3.z.string().optional()
});
var openRouterSchema = baseProviderSettingsSchema.extend({
  openRouterApiKey: import_zod3.z.string().optional(),
  openRouterModelId: import_zod3.z.string().optional(),
  openRouterBaseUrl: import_zod3.z.string().optional(),
  openRouterSpecificProvider: import_zod3.z.string().optional(),
  openRouterUseMiddleOutTransform: import_zod3.z.boolean().optional()
});
var bedrockSchema = apiModelIdProviderModelSchema.extend({
  awsAccessKey: import_zod3.z.string().optional(),
  awsSecretKey: import_zod3.z.string().optional(),
  awsSessionToken: import_zod3.z.string().optional(),
  awsRegion: import_zod3.z.string().optional(),
  awsUseCrossRegionInference: import_zod3.z.boolean().optional(),
  awsUsePromptCache: import_zod3.z.boolean().optional(),
  awsProfile: import_zod3.z.string().optional(),
  awsUseProfile: import_zod3.z.boolean().optional(),
  awsApiKey: import_zod3.z.string().optional(),
  awsUseApiKey: import_zod3.z.boolean().optional(),
  awsCustomArn: import_zod3.z.string().optional(),
  awsModelContextWindow: import_zod3.z.number().optional(),
  awsBedrockEndpointEnabled: import_zod3.z.boolean().optional(),
  awsBedrockEndpoint: import_zod3.z.string().optional()
});
var vertexSchema = apiModelIdProviderModelSchema.extend({
  vertexKeyFile: import_zod3.z.string().optional(),
  vertexJsonCredentials: import_zod3.z.string().optional(),
  vertexProjectId: import_zod3.z.string().optional(),
  vertexRegion: import_zod3.z.string().optional()
});
var openAiSchema = baseProviderSettingsSchema.extend({
  openAiBaseUrl: import_zod3.z.string().optional(),
  openAiApiKey: import_zod3.z.string().optional(),
  openAiLegacyFormat: import_zod3.z.boolean().optional(),
  openAiR1FormatEnabled: import_zod3.z.boolean().optional(),
  openAiModelId: import_zod3.z.string().optional(),
  openAiCustomModelInfo: modelInfoSchema.nullish(),
  openAiUseAzure: import_zod3.z.boolean().optional(),
  azureApiVersion: import_zod3.z.string().optional(),
  openAiStreamingEnabled: import_zod3.z.boolean().optional(),
  openAiHostHeader: import_zod3.z.string().optional(),
  // Keep temporarily for backward compatibility during migration.
  openAiHeaders: import_zod3.z.record(import_zod3.z.string(), import_zod3.z.string()).optional()
});
var ollamaSchema = baseProviderSettingsSchema.extend({
  ollamaModelId: import_zod3.z.string().optional(),
  ollamaBaseUrl: import_zod3.z.string().optional()
});
var vsCodeLmSchema = baseProviderSettingsSchema.extend({
  vsCodeLmModelSelector: import_zod3.z.object({
    vendor: import_zod3.z.string().optional(),
    family: import_zod3.z.string().optional(),
    version: import_zod3.z.string().optional(),
    id: import_zod3.z.string().optional()
  }).optional()
});
var lmStudioSchema = baseProviderSettingsSchema.extend({
  lmStudioModelId: import_zod3.z.string().optional(),
  lmStudioBaseUrl: import_zod3.z.string().optional(),
  lmStudioDraftModelId: import_zod3.z.string().optional(),
  lmStudioSpeculativeDecodingEnabled: import_zod3.z.boolean().optional()
});
var geminiSchema = apiModelIdProviderModelSchema.extend({
  geminiApiKey: import_zod3.z.string().optional(),
  googleGeminiBaseUrl: import_zod3.z.string().optional(),
  enableUrlContext: import_zod3.z.boolean().optional(),
  enableGrounding: import_zod3.z.boolean().optional()
});
var geminiCliSchema = apiModelIdProviderModelSchema.extend({
  geminiCliOAuthPath: import_zod3.z.string().optional(),
  geminiCliProjectId: import_zod3.z.string().optional()
});
var openAiNativeSchema = apiModelIdProviderModelSchema.extend({
  openAiNativeApiKey: import_zod3.z.string().optional(),
  openAiNativeBaseUrl: import_zod3.z.string().optional()
});
var mistralSchema = apiModelIdProviderModelSchema.extend({
  mistralApiKey: import_zod3.z.string().optional(),
  mistralCodestralUrl: import_zod3.z.string().optional()
});
var deepSeekSchema = apiModelIdProviderModelSchema.extend({
  deepSeekBaseUrl: import_zod3.z.string().optional(),
  deepSeekApiKey: import_zod3.z.string().optional()
});
var doubaoSchema = apiModelIdProviderModelSchema.extend({
  doubaoBaseUrl: import_zod3.z.string().optional(),
  doubaoApiKey: import_zod3.z.string().optional()
});
var moonshotSchema = apiModelIdProviderModelSchema.extend({
  moonshotBaseUrl: import_zod3.z.union([import_zod3.z.literal("https://api.moonshot.ai/v1"), import_zod3.z.literal("https://api.moonshot.cn/v1")]).optional(),
  moonshotApiKey: import_zod3.z.string().optional()
});
var unboundSchema = baseProviderSettingsSchema.extend({
  unboundApiKey: import_zod3.z.string().optional(),
  unboundModelId: import_zod3.z.string().optional()
});
var requestySchema = baseProviderSettingsSchema.extend({
  requestyBaseUrl: import_zod3.z.string().optional(),
  requestyApiKey: import_zod3.z.string().optional(),
  requestyModelId: import_zod3.z.string().optional()
});
var humanRelaySchema = baseProviderSettingsSchema;
var fakeAiSchema = baseProviderSettingsSchema.extend({
  fakeAi: import_zod3.z.unknown().optional()
});
var xaiSchema = apiModelIdProviderModelSchema.extend({
  xaiApiKey: import_zod3.z.string().optional()
});
var groqSchema = apiModelIdProviderModelSchema.extend({
  groqApiKey: import_zod3.z.string().optional()
});
var huggingFaceSchema = baseProviderSettingsSchema.extend({
  huggingFaceApiKey: import_zod3.z.string().optional(),
  huggingFaceModelId: import_zod3.z.string().optional(),
  huggingFaceInferenceProvider: import_zod3.z.string().optional()
});
var chutesSchema = apiModelIdProviderModelSchema.extend({
  chutesApiKey: import_zod3.z.string().optional()
});
var litellmSchema = baseProviderSettingsSchema.extend({
  litellmBaseUrl: import_zod3.z.string().optional(),
  litellmApiKey: import_zod3.z.string().optional(),
  litellmModelId: import_zod3.z.string().optional(),
  litellmUsePromptCache: import_zod3.z.boolean().optional()
});
var cerebrasSchema = apiModelIdProviderModelSchema.extend({
  cerebrasApiKey: import_zod3.z.string().optional()
});
var sambaNovaSchema = apiModelIdProviderModelSchema.extend({
  sambaNovaApiKey: import_zod3.z.string().optional()
});
var zaiSchema = apiModelIdProviderModelSchema.extend({
  zaiApiKey: import_zod3.z.string().optional(),
  zaiApiLine: import_zod3.z.union([import_zod3.z.literal("china"), import_zod3.z.literal("international")]).optional()
});
var fireworksSchema = apiModelIdProviderModelSchema.extend({
  fireworksApiKey: import_zod3.z.string().optional()
});
var ioIntelligenceSchema = apiModelIdProviderModelSchema.extend({
  ioIntelligenceModelId: import_zod3.z.string().optional(),
  ioIntelligenceApiKey: import_zod3.z.string().optional()
});
var defaultSchema = import_zod3.z.object({
  apiProvider: import_zod3.z.undefined()
});
var providerSettingsSchemaDiscriminated = import_zod3.z.discriminatedUnion("apiProvider", [
  anthropicSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("anthropic") })),
  claudeCodeSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("claude-code") })),
  glamaSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("glama") })),
  openRouterSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("openrouter") })),
  bedrockSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("bedrock") })),
  vertexSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("vertex") })),
  openAiSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("openai") })),
  ollamaSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("ollama") })),
  vsCodeLmSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("vscode-lm") })),
  lmStudioSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("lmstudio") })),
  geminiSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("gemini") })),
  geminiCliSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("gemini-cli") })),
  openAiNativeSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("openai-native") })),
  mistralSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("mistral") })),
  deepSeekSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("deepseek") })),
  doubaoSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("doubao") })),
  moonshotSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("moonshot") })),
  unboundSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("unbound") })),
  requestySchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("requesty") })),
  humanRelaySchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("human-relay") })),
  fakeAiSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("fake-ai") })),
  xaiSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("xai") })),
  groqSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("groq") })),
  huggingFaceSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("huggingface") })),
  chutesSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("chutes") })),
  litellmSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("litellm") })),
  cerebrasSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("cerebras") })),
  sambaNovaSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("sambanova") })),
  zaiSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("zai") })),
  fireworksSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("fireworks") })),
  ioIntelligenceSchema.merge(import_zod3.z.object({ apiProvider: import_zod3.z.literal("io-intelligence") })),
  defaultSchema
]);
var providerSettingsSchema = import_zod3.z.object({
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
var providerSettingsWithIdSchema = providerSettingsSchema.extend({ id: import_zod3.z.string().optional() });
var discriminatedProviderSettingsWithIdSchema = providerSettingsSchemaDiscriminated.and(
  import_zod3.z.object({ id: import_zod3.z.string().optional() })
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

// src/mode.ts
var import_zod5 = require("zod");

// src/tool.ts
var import_zod4 = require("zod");
var toolGroups = ["read", "edit", "browser", "command", "mcp", "modes"];
var toolGroupsSchema = import_zod4.z.enum(toolGroups);
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
var toolNamesSchema = import_zod4.z.enum(toolNames);
var toolUsageSchema = import_zod4.z.record(
  toolNamesSchema,
  import_zod4.z.object({
    attempts: import_zod4.z.number(),
    failures: import_zod4.z.number()
  })
);

// src/mode.ts
var groupOptionsSchema = import_zod5.z.object({
  fileRegex: import_zod5.z.string().optional().refine(
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
  description: import_zod5.z.string().optional()
});
var groupEntrySchema = import_zod5.z.union([toolGroupsSchema, import_zod5.z.tuple([toolGroupsSchema, groupOptionsSchema])]);
var groupEntryArraySchema = import_zod5.z.array(groupEntrySchema).refine(
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
var modeConfigSchema = import_zod5.z.object({
  slug: import_zod5.z.string().regex(/^[a-zA-Z0-9-]+$/, "Slug must contain only letters numbers and dashes"),
  name: import_zod5.z.string().min(1, "Name is required"),
  roleDefinition: import_zod5.z.string().min(1, "Role definition is required"),
  whenToUse: import_zod5.z.string().optional(),
  description: import_zod5.z.string().optional(),
  customInstructions: import_zod5.z.string().optional(),
  groups: groupEntryArraySchema,
  source: import_zod5.z.enum(["global", "project"]).optional()
});
var customModesSettingsSchema = import_zod5.z.object({
  customModes: import_zod5.z.array(modeConfigSchema).refine(
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
var promptComponentSchema = import_zod5.z.object({
  roleDefinition: import_zod5.z.string().optional(),
  whenToUse: import_zod5.z.string().optional(),
  description: import_zod5.z.string().optional(),
  customInstructions: import_zod5.z.string().optional()
});
var customModePromptsSchema = import_zod5.z.record(import_zod5.z.string(), promptComponentSchema.optional());
var customSupportPromptsSchema = import_zod5.z.record(import_zod5.z.string(), import_zod5.z.string().optional());
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

// src/agent.ts
var agentToolConfigSchema = import_zod6.z.object({
  toolId: import_zod6.z.string(),
  enabled: import_zod6.z.boolean(),
  config: import_zod6.z.record(import_zod6.z.string(), import_zod6.z.any()).optional()
});
var agentTodoSchema = import_zod6.z.object({
  id: import_zod6.z.string(),
  content: import_zod6.z.string(),
  status: import_zod6.z.enum(["pending", "in_progress", "completed"]),
  createdAt: import_zod6.z.number(),
  updatedAt: import_zod6.z.number(),
  priority: import_zod6.z.enum(["low", "medium", "high"]).optional()
});
var agentTemplateSourceSchema = import_zod6.z.object({
  type: import_zod6.z.enum(["manual", "task"]),
  taskId: import_zod6.z.string().optional(),
  taskDescription: import_zod6.z.string().optional(),
  timestamp: import_zod6.z.number()
});
var a2aAgentCardSchema = import_zod6.z.object({
  name: import_zod6.z.string(),
  description: import_zod6.z.string(),
  skills: import_zod6.z.array(import_zod6.z.string()),
  url: import_zod6.z.string().optional(),
  // 公网可访问的 A2A 端点
  capabilities: import_zod6.z.object({
    messageTypes: import_zod6.z.array(import_zod6.z.string()),
    // 支持的消息类型
    taskTypes: import_zod6.z.array(import_zod6.z.string()),
    // 支持的任务类型
    dataFormats: import_zod6.z.array(import_zod6.z.string()),
    // 支持的数据格式
    maxConcurrency: import_zod6.z.number().optional()
    // 最大并发数
  }),
  // 部署信息
  deployment: import_zod6.z.object({
    type: import_zod6.z.enum(["pc", "cloud", "docker"]),
    platform: import_zod6.z.string(),
    region: import_zod6.z.string().optional(),
    networkReachable: import_zod6.z.boolean().optional()
    // 网络是否可达
  }).optional(),
  auth: import_zod6.z.object({
    apiKey: import_zod6.z.string().optional(),
    authType: import_zod6.z.enum(["none", "apikey", "oauth"])
  }).optional()
});
var agentPermissionSchema = import_zod6.z.object({
  action: import_zod6.z.enum(["read", "execute", "modify", "admin"]),
  resource: import_zod6.z.string(),
  // 资源路径或标识
  conditions: import_zod6.z.object({
    timeRange: import_zod6.z.tuple([import_zod6.z.number(), import_zod6.z.number()]).optional(),
    // 时间范围限制
    ipRange: import_zod6.z.array(import_zod6.z.string()).optional(),
    // IP范围限制
    userAgent: import_zod6.z.string().optional(),
    // User-Agent限制
    maxUsage: import_zod6.z.number().optional(),
    // 最大使用次数限制
    rateLimit: import_zod6.z.number().optional()
    // 速率限制（每分钟）
  }).optional(),
  description: import_zod6.z.string().optional()
  // 权限描述
});
var agentApiConfigSchema = providerSettingsSchema.extend({
  originalId: import_zod6.z.string().optional(),
  // 原始配置ID（用于追踪来源）
  originalName: import_zod6.z.string().optional(),
  // 原始配置名称
  createdAt: import_zod6.z.number().optional()
  // 副本创建时间
});
var agentConfigSchema = import_zod6.z.object({
  id: import_zod6.z.string(),
  userId: import_zod6.z.string(),
  name: import_zod6.z.string(),
  avatar: import_zod6.z.string(),
  roleDescription: import_zod6.z.string(),
  welcomeMessage: import_zod6.z.string().optional(),
  // 欢迎语
  apiConfigId: import_zod6.z.string(),
  // 保留向后兼容
  apiConfig: agentApiConfigSchema.optional(),
  // 新增：嵌入式API配置
  mode: import_zod6.z.string(),
  modeConfig: modeConfigSchema.optional(),
  // 🔥 新增：自定义模式的完整定义（如果使用自定义模式）
  tools: import_zod6.z.array(agentToolConfigSchema),
  todos: import_zod6.z.array(agentTodoSchema),
  // 新增：A2A 和共享配置
  isPrivate: import_zod6.z.boolean().optional().default(true),
  // 私有/共享标识，默认true
  shareScope: import_zod6.z.enum(["friends", "groups", "public"]).optional(),
  // 共享范围：好友、群组、公开
  shareLevel: import_zod6.z.number().optional(),
  // 共享级别：0=私有，1=好友，2=群组，3=公开
  a2aAgentCard: a2aAgentCardSchema.optional(),
  // A2A 协议智能体卡片
  a2aEndpoint: import_zod6.z.string().optional(),
  // A2A 服务端点URL
  permissions: import_zod6.z.array(agentPermissionSchema).optional(),
  // 访问权限列表
  allowedUsers: import_zod6.z.array(import_zod6.z.string()).optional(),
  // 好友级别：白名单用户ID
  allowedGroups: import_zod6.z.array(import_zod6.z.string()).optional(),
  // 群组级别：白名单群组ID
  deniedUsers: import_zod6.z.array(import_zod6.z.string()).optional(),
  // 用户黑名单
  // 发布状态相关字段
  isPublished: import_zod6.z.boolean().optional().default(false),
  // 是否已发布
  publishInfo: import_zod6.z.object({
    // 发布信息
    terminalType: import_zod6.z.enum(["local", "cloud"]).optional(),
    // 发布终端类型
    serverPort: import_zod6.z.number().optional(),
    // A2A服务器端口
    serverUrl: import_zod6.z.string().optional(),
    // A2A服务器URL
    publishedAt: import_zod6.z.string().optional(),
    // 发布时间
    serviceStatus: import_zod6.z.enum(["online", "offline", "error"]).optional(),
    // 服务状态
    lastHeartbeat: import_zod6.z.number().optional()
    // 最后心跳时间
  }).optional(),
  templateSource: agentTemplateSourceSchema.optional(),
  createdAt: import_zod6.z.number(),
  updatedAt: import_zod6.z.number(),
  lastUsedAt: import_zod6.z.number().optional(),
  isActive: import_zod6.z.boolean(),
  version: import_zod6.z.number()
});
var agentListOptionsSchema = import_zod6.z.object({
  sortBy: import_zod6.z.enum(["name", "createdAt", "updatedAt", "lastUsedAt"]).optional(),
  sortOrder: import_zod6.z.enum(["asc", "desc"]).optional(),
  filterByMode: import_zod6.z.string().optional(),
  onlyActive: import_zod6.z.boolean().optional(),
  limit: import_zod6.z.number().optional(),
  offset: import_zod6.z.number().optional()
});
var agentExportDataSchema = import_zod6.z.object({
  agent: agentConfigSchema,
  metadata: import_zod6.z.object({
    exportedAt: import_zod6.z.number(),
    exportedBy: import_zod6.z.string(),
    version: import_zod6.z.string()
  })
});
var agentTemplateDataSchema = import_zod6.z.object({
  apiConfigId: import_zod6.z.string().optional(),
  mode: import_zod6.z.string().optional(),
  tools: import_zod6.z.array(import_zod6.z.string()).optional(),
  templateSource: agentTemplateSourceSchema
});
var resourceQuotaSchema = import_zod6.z.object({
  maxMemory: import_zod6.z.number(),
  // 最大内存使用 (MB)
  maxCpuTime: import_zod6.z.number(),
  // 最大CPU时间 (ms)
  maxFileOperations: import_zod6.z.number(),
  // 最大文件操作次数
  maxNetworkRequests: import_zod6.z.number(),
  // 最大网络请求次数
  maxExecutionTime: import_zod6.z.number(),
  // 最大执行时间 (ms)
  workspaceAccess: import_zod6.z.object({
    readOnly: import_zod6.z.boolean(),
    allowedPaths: import_zod6.z.array(import_zod6.z.string()),
    deniedPaths: import_zod6.z.array(import_zod6.z.string()),
    tempDirectory: import_zod6.z.string()
  })
});
var resourceUsageSchema = import_zod6.z.object({
  memory: import_zod6.z.number(),
  // 当前内存使用 (MB)
  cpuTime: import_zod6.z.number(),
  // 当前CPU时间 (ms)
  fileOperations: import_zod6.z.number(),
  // 当前文件操作次数
  networkRequests: import_zod6.z.number(),
  // 当前网络请求次数
  startTime: import_zod6.z.number(),
  // 启动时间戳
  lastUpdate: import_zod6.z.number()
  // 最后更新时间戳
});
var agentInstanceSchema = import_zod6.z.object({
  agentId: import_zod6.z.string(),
  // 关联的智能体定义ID
  instanceId: import_zod6.z.string(),
  // 实例唯一标识
  userId: import_zod6.z.string(),
  // 实例所属用户
  // 部署信息
  deployment: import_zod6.z.object({
    type: import_zod6.z.enum(["pc", "cloud", "docker", "k8s"]),
    platform: import_zod6.z.string(),
    // 'vscode' | 'docker' | 'k8s'
    location: import_zod6.z.string().optional(),
    // 部署位置描述
    version: import_zod6.z.string(),
    // void版本
    region: import_zod6.z.string().optional()
    // 地理区域
  }),
  // 网络端点
  endpoint: import_zod6.z.object({
    type: import_zod6.z.enum(["local_only", "network_reachable", "hybrid"]),
    // 直连信息
    direct: import_zod6.z.object({
      url: import_zod6.z.string(),
      // HTTP服务端点
      protocol: import_zod6.z.enum(["http", "https"]),
      port: import_zod6.z.number().optional(),
      apiKey: import_zod6.z.string().optional(),
      // API密钥
      healthCheckPath: import_zod6.z.string()
      // 健康检查路径
    }).optional(),
    // IM桥接信息
    imBridge: import_zod6.z.object({
      proxyId: import_zod6.z.string(),
      // 代理标识
      channelId: import_zod6.z.string().optional(),
      // 通道标识
      priority: import_zod6.z.number()
      // 路由优先级
    }),
    networkReachable: import_zod6.z.boolean().optional(),
    // 是否网络可达
    lastProbeTime: import_zod6.z.number().optional()
    // 最后探测时间
  }),
  // 实例状态
  status: import_zod6.z.object({
    state: import_zod6.z.enum(["starting", "online", "offline", "error", "maintenance"]),
    startTime: import_zod6.z.number(),
    lastSeen: import_zod6.z.number(),
    currentLoad: import_zod6.z.number(),
    // 当前负载 0-1
    errorCount: import_zod6.z.number(),
    // 错误计数
    errorRate: import_zod6.z.number(),
    // 错误率 0-1
    uptime: import_zod6.z.number()
    // 运行时间
  }),
  // 性能指标
  metrics: import_zod6.z.object({
    avgResponseTime: import_zod6.z.number(),
    // 平均响应时间 (ms)
    successRate: import_zod6.z.number(),
    // 成功率 0-1
    throughput: import_zod6.z.number(),
    // 吞吐量 (req/s)
    memoryUsage: import_zod6.z.number().optional(),
    // 内存使用率 0-1
    cpuUsage: import_zod6.z.number().optional(),
    // CPU使用率 0-1
    lastUpdate: import_zod6.z.number()
    // 最后更新时间
  }),
  // 资源配额
  resourceQuota: resourceQuotaSchema.optional(),
  // 元数据
  metadata: import_zod6.z.object({
    createdAt: import_zod6.z.number(),
    updatedAt: import_zod6.z.number(),
    version: import_zod6.z.number(),
    tags: import_zod6.z.array(import_zod6.z.string()).optional()
  })
});
var agentRequestSchema = import_zod6.z.object({
  method: import_zod6.z.string(),
  params: import_zod6.z.any(),
  timeout: import_zod6.z.number().optional(),
  priority: import_zod6.z.enum(["low", "normal", "high"]).optional(),
  retries: import_zod6.z.number().optional(),
  sourceAgentId: import_zod6.z.string().optional(),
  sourceUserId: import_zod6.z.string().optional()
});
var agentResponseSchema = import_zod6.z.object({
  success: import_zod6.z.boolean(),
  data: import_zod6.z.any().optional(),
  error: import_zod6.z.string().optional(),
  agentId: import_zod6.z.string(),
  route: import_zod6.z.enum(["direct", "im_bridge", "hybrid"]).optional(),
  timestamp: import_zod6.z.number(),
  duration: import_zod6.z.number().optional()
});
var agentEndpointSchema = import_zod6.z.object({
  agentId: import_zod6.z.string(),
  userId: import_zod6.z.string(),
  type: import_zod6.z.enum(["local_only", "network_reachable", "hybrid"]),
  directUrl: import_zod6.z.string().optional(),
  // 直连URL
  apiKey: import_zod6.z.string().optional(),
  // API密钥
  imProxyId: import_zod6.z.string(),
  // IM代理标识
  networkReachable: import_zod6.z.boolean().optional(),
  // 网络可达性
  lastProbeTime: import_zod6.z.number().optional(),
  // 最后探测时间
  status: import_zod6.z.object({
    state: import_zod6.z.enum(["online", "offline", "busy", "error"]),
    lastSeen: import_zod6.z.number(),
    currentLoad: import_zod6.z.number(),
    errorRate: import_zod6.z.number(),
    avgResponseTime: import_zod6.z.number()
  }),
  deploymentType: import_zod6.z.enum(["pc", "cloud", "docker", "serverless"])
});
var agentDiscoveryQuerySchema = import_zod6.z.object({
  userId: import_zod6.z.string(),
  capabilities: import_zod6.z.array(import_zod6.z.string()).optional(),
  categories: import_zod6.z.array(import_zod6.z.string()).optional(),
  tags: import_zod6.z.array(import_zod6.z.string()).optional(),
  deploymentTypes: import_zod6.z.array(import_zod6.z.string()).optional(),
  regions: import_zod6.z.array(import_zod6.z.string()).optional(),
  keywords: import_zod6.z.string().optional(),
  onlyOnline: import_zod6.z.boolean().optional(),
  visibility: import_zod6.z.enum(["private", "friends", "groups", "public", "all"]).optional(),
  shareScope: import_zod6.z.enum(["friends", "groups", "public"]).optional(),
  shareLevel: import_zod6.z.number().optional(),
  sortBy: import_zod6.z.enum(["relevance", "performance", "popularity", "rating"]).optional(),
  sortOrder: import_zod6.z.enum(["asc", "desc"]).optional(),
  offset: import_zod6.z.number().optional(),
  limit: import_zod6.z.number().optional()
});
var agentDiscoveryResultSchema = import_zod6.z.object({
  agentId: import_zod6.z.string(),
  userId: import_zod6.z.string(),
  name: import_zod6.z.string(),
  description: import_zod6.z.string(),
  avatar: import_zod6.z.string(),
  // 匹配信息
  matchedCapabilities: import_zod6.z.array(import_zod6.z.string()),
  relevanceScore: import_zod6.z.number(),
  // 部署信息
  deploymentType: import_zod6.z.enum(["pc", "cloud", "docker", "serverless"]),
  region: import_zod6.z.string().optional(),
  endpointType: import_zod6.z.enum(["local_only", "network_reachable", "hybrid"]),
  // 性能指标
  currentLoad: import_zod6.z.number(),
  avgResponseTime: import_zod6.z.number(),
  errorRate: import_zod6.z.number(),
  availability: import_zod6.z.number(),
  // 使用统计
  totalCalls: import_zod6.z.number(),
  successRate: import_zod6.z.number(),
  rating: import_zod6.z.number().optional(),
  // 权限信息
  isPrivate: import_zod6.z.boolean(),
  hasAccess: import_zod6.z.boolean(),
  // 元数据
  category: import_zod6.z.string().optional(),
  tags: import_zod6.z.array(import_zod6.z.string()),
  createdAt: import_zod6.z.number(),
  lastUsed: import_zod6.z.number().optional()
});
var unifiedAgentRegistrySchema = import_zod6.z.object({
  agentId: import_zod6.z.string(),
  userId: import_zod6.z.string(),
  name: import_zod6.z.string(),
  avatar: import_zod6.z.string(),
  description: import_zod6.z.string(),
  // 能力信息
  capabilities: import_zod6.z.object({
    tools: import_zod6.z.array(import_zod6.z.string()),
    skills: import_zod6.z.array(import_zod6.z.string()),
    categories: import_zod6.z.array(import_zod6.z.string())
  }),
  // 部署信息
  deployment: import_zod6.z.object({
    type: import_zod6.z.enum(["pc", "cloud", "docker", "serverless"]),
    region: import_zod6.z.string().optional(),
    endpointType: import_zod6.z.enum(["local_only", "network_reachable", "hybrid"]),
    directUrl: import_zod6.z.string().optional(),
    imProxyId: import_zod6.z.string().optional()
  }),
  // 状态信息
  status: import_zod6.z.object({
    state: import_zod6.z.enum(["online", "offline", "busy", "maintenance"]),
    lastSeen: import_zod6.z.number(),
    currentLoad: import_zod6.z.number(),
    errorRate: import_zod6.z.number(),
    avgResponseTime: import_zod6.z.number()
  }),
  // 共享配置
  sharing: import_zod6.z.object({
    isPrivate: import_zod6.z.boolean(),
    shareScope: import_zod6.z.enum(["none", "friends", "groups", "public"]),
    shareLevel: import_zod6.z.number().min(0).max(3),
    permissions: import_zod6.z.array(import_zod6.z.enum(["read", "execute", "modify"])),
    allowedUsers: import_zod6.z.array(import_zod6.z.string()),
    allowedGroups: import_zod6.z.array(import_zod6.z.string()),
    deniedUsers: import_zod6.z.array(import_zod6.z.string())
  }),
  // 元数据
  metadata: import_zod6.z.object({
    createdAt: import_zod6.z.number(),
    updatedAt: import_zod6.z.number(),
    version: import_zod6.z.string(),
    tags: import_zod6.z.array(import_zod6.z.string())
  })
});

// src/cloud.ts
var import_zod14 = require("zod");

// src/global-settings.ts
var import_zod12 = require("zod");

// src/history.ts
var import_zod8 = require("zod");

// src/message.ts
var import_zod7 = require("zod");
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
var clineAskSchema = import_zod7.z.enum(clineAsks);
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
var clineSaySchema = import_zod7.z.enum(clineSays);
var toolProgressStatusSchema = import_zod7.z.object({
  icon: import_zod7.z.string().optional(),
  text: import_zod7.z.string().optional()
});
var contextCondenseSchema = import_zod7.z.object({
  cost: import_zod7.z.number(),
  prevContextTokens: import_zod7.z.number(),
  newContextTokens: import_zod7.z.number(),
  summary: import_zod7.z.string()
});
var clineMessageSchema = import_zod7.z.object({
  ts: import_zod7.z.number(),
  type: import_zod7.z.union([import_zod7.z.literal("ask"), import_zod7.z.literal("say")]),
  ask: clineAskSchema.optional(),
  say: clineSaySchema.optional(),
  text: import_zod7.z.string().optional(),
  images: import_zod7.z.array(import_zod7.z.string()).optional(),
  partial: import_zod7.z.boolean().optional(),
  reasoning: import_zod7.z.string().optional(),
  conversationHistoryIndex: import_zod7.z.number().optional(),
  checkpoint: import_zod7.z.record(import_zod7.z.string(), import_zod7.z.unknown()).optional(),
  progressStatus: toolProgressStatusSchema.optional(),
  contextCondense: contextCondenseSchema.optional(),
  isProtected: import_zod7.z.boolean().optional(),
  apiProtocol: import_zod7.z.union([import_zod7.z.literal("openai"), import_zod7.z.literal("anthropic")]).optional(),
  metadata: import_zod7.z.object({
    gpt5: import_zod7.z.object({
      previous_response_id: import_zod7.z.string().optional(),
      instructions: import_zod7.z.string().optional(),
      reasoning_summary: import_zod7.z.string().optional()
    }).optional(),
    taskId: import_zod7.z.string().optional()
  }).optional()
});
var tokenUsageSchema = import_zod7.z.object({
  totalTokensIn: import_zod7.z.number(),
  totalTokensOut: import_zod7.z.number(),
  totalCacheWrites: import_zod7.z.number().optional(),
  totalCacheReads: import_zod7.z.number().optional(),
  totalCost: import_zod7.z.number(),
  contextTokens: import_zod7.z.number()
});

// src/history.ts
var historyItemSchema = import_zod8.z.object({
  id: import_zod8.z.string(),
  number: import_zod8.z.number(),
  ts: import_zod8.z.number(),
  task: import_zod8.z.string(),
  tokensIn: import_zod8.z.number(),
  tokensOut: import_zod8.z.number(),
  cacheWrites: import_zod8.z.number().optional(),
  cacheReads: import_zod8.z.number().optional(),
  totalCost: import_zod8.z.number(),
  size: import_zod8.z.number().optional(),
  workspace: import_zod8.z.string().optional(),
  mode: import_zod8.z.string().optional(),
  terminalNo: import_zod8.z.number().optional(),
  // 🔥 智能体任务标记
  source: import_zod8.z.enum(["user", "agent"]).optional(),
  // 任务来源：用户或智能体
  agentId: import_zod8.z.string().optional(),
  // 智能体ID（仅当 source === "agent" 时存在）
  // 🔥 消息历史（用于查看已完成的智能体任务）
  clineMessages: import_zod8.z.array(clineMessageSchema).optional()
});

// src/experiment.ts
var import_zod9 = require("zod");
var experimentIds = ["powerSteering", "multiFileApplyDiff", "preventFocusDisruption", "assistantMessageParser"];
var experimentIdsSchema = import_zod9.z.enum(experimentIds);
var experimentsSchema = import_zod9.z.object({
  powerSteering: import_zod9.z.boolean().optional(),
  multiFileApplyDiff: import_zod9.z.boolean().optional(),
  preventFocusDisruption: import_zod9.z.boolean().optional(),
  assistantMessageParser: import_zod9.z.boolean().optional()
});

// src/telemetry.ts
var import_zod10 = require("zod");
var telemetrySettings = ["unset", "enabled", "disabled"];
var telemetrySettingsSchema = import_zod10.z.enum(telemetrySettings);
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
var appPropertiesSchema = import_zod10.z.object({
  appName: import_zod10.z.string(),
  appVersion: import_zod10.z.string(),
  vscodeVersion: import_zod10.z.string(),
  platform: import_zod10.z.string(),
  editorName: import_zod10.z.string(),
  language: import_zod10.z.string(),
  mode: import_zod10.z.string(),
  cloudIsAuthenticated: import_zod10.z.boolean().optional()
});
var taskPropertiesSchema = import_zod10.z.object({
  taskId: import_zod10.z.string().optional(),
  apiProvider: import_zod10.z.enum(providerNames).optional(),
  modelId: import_zod10.z.string().optional(),
  diffStrategy: import_zod10.z.string().optional(),
  isSubtask: import_zod10.z.boolean().optional(),
  todos: import_zod10.z.object({
    total: import_zod10.z.number(),
    completed: import_zod10.z.number(),
    inProgress: import_zod10.z.number(),
    pending: import_zod10.z.number()
  }).optional()
});
var gitPropertiesSchema = import_zod10.z.object({
  repositoryUrl: import_zod10.z.string().optional(),
  repositoryName: import_zod10.z.string().optional(),
  defaultBranch: import_zod10.z.string().optional()
});
var telemetryPropertiesSchema = import_zod10.z.object({
  ...appPropertiesSchema.shape,
  ...taskPropertiesSchema.shape,
  ...gitPropertiesSchema.shape
});
var rooCodeTelemetryEventSchema = import_zod10.z.discriminatedUnion("type", [
  import_zod10.z.object({
    type: import_zod10.z.enum([
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
  import_zod10.z.object({
    type: import_zod10.z.literal("Task Message" /* TASK_MESSAGE */),
    properties: import_zod10.z.object({
      ...telemetryPropertiesSchema.shape,
      taskId: import_zod10.z.string(),
      message: clineMessageSchema
    })
  }),
  import_zod10.z.object({
    type: import_zod10.z.literal("LLM Completion" /* LLM_COMPLETION */),
    properties: import_zod10.z.object({
      ...telemetryPropertiesSchema.shape,
      inputTokens: import_zod10.z.number(),
      outputTokens: import_zod10.z.number(),
      cacheReadTokens: import_zod10.z.number().optional(),
      cacheWriteTokens: import_zod10.z.number().optional(),
      cost: import_zod10.z.number().optional()
    })
  })
]);

// src/vscode.ts
var import_zod11 = require("zod");
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
var languagesSchema = import_zod11.z.enum(languages);
var isLanguage = (value) => languages.includes(value);

// src/global-settings.ts
var DEFAULT_WRITE_DELAY_MS = 1e3;
var DEFAULT_TERMINAL_OUTPUT_CHARACTER_LIMIT = 5e4;
var DEFAULT_USAGE_COLLECTION_TIMEOUT_MS = 3e4;
var globalSettingsSchema = import_zod12.z.object({
  currentApiConfigName: import_zod12.z.string().optional(),
  listApiConfigMeta: import_zod12.z.array(providerSettingsEntrySchema).optional(),
  pinnedApiConfigs: import_zod12.z.record(import_zod12.z.string(), import_zod12.z.boolean()).optional(),
  lastShownAnnouncementId: import_zod12.z.string().optional(),
  customInstructions: import_zod12.z.string().optional(),
  taskHistory: import_zod12.z.array(historyItemSchema).optional(),
  condensingApiConfigId: import_zod12.z.string().optional(),
  customCondensingPrompt: import_zod12.z.string().optional(),
  autoApprovalEnabled: import_zod12.z.boolean().optional(),
  alwaysAllowReadOnly: import_zod12.z.boolean().optional(),
  alwaysAllowReadOnlyOutsideWorkspace: import_zod12.z.boolean().optional(),
  alwaysAllowWrite: import_zod12.z.boolean().optional(),
  alwaysAllowWriteOutsideWorkspace: import_zod12.z.boolean().optional(),
  alwaysAllowWriteProtected: import_zod12.z.boolean().optional(),
  writeDelayMs: import_zod12.z.number().min(0).optional(),
  alwaysAllowBrowser: import_zod12.z.boolean().optional(),
  alwaysApproveResubmit: import_zod12.z.boolean().optional(),
  requestDelaySeconds: import_zod12.z.number().optional(),
  alwaysAllowMcp: import_zod12.z.boolean().optional(),
  alwaysAllowModeSwitch: import_zod12.z.boolean().optional(),
  alwaysAllowSubtasks: import_zod12.z.boolean().optional(),
  alwaysAllowExecute: import_zod12.z.boolean().optional(),
  alwaysAllowFollowupQuestions: import_zod12.z.boolean().optional(),
  followupAutoApproveTimeoutMs: import_zod12.z.number().optional(),
  alwaysAllowUpdateTodoList: import_zod12.z.boolean().optional(),
  allowedCommands: import_zod12.z.array(import_zod12.z.string()).optional(),
  deniedCommands: import_zod12.z.array(import_zod12.z.string()).optional(),
  commandExecutionTimeout: import_zod12.z.number().optional(),
  commandTimeoutAllowlist: import_zod12.z.array(import_zod12.z.string()).optional(),
  preventCompletionWithOpenTodos: import_zod12.z.boolean().optional(),
  allowedMaxRequests: import_zod12.z.number().nullish(),
  allowedMaxCost: import_zod12.z.number().nullish(),
  autoCondenseContext: import_zod12.z.boolean().optional(),
  autoCondenseContextPercent: import_zod12.z.number().optional(),
  maxConcurrentFileReads: import_zod12.z.number().optional(),
  /**
   * Whether to include diagnostic messages (errors, warnings) in tool outputs
   * @default true
   */
  includeDiagnosticMessages: import_zod12.z.boolean().optional(),
  /**
   * Maximum number of diagnostic messages to include in tool outputs
   * @default 50
   */
  maxDiagnosticMessages: import_zod12.z.number().optional(),
  browserToolEnabled: import_zod12.z.boolean().optional(),
  browserViewportSize: import_zod12.z.string().optional(),
  screenshotQuality: import_zod12.z.number().optional(),
  remoteBrowserEnabled: import_zod12.z.boolean().optional(),
  remoteBrowserHost: import_zod12.z.string().optional(),
  cachedChromeHostUrl: import_zod12.z.string().optional(),
  enableCheckpoints: import_zod12.z.boolean().optional(),
  ttsEnabled: import_zod12.z.boolean().optional(),
  ttsSpeed: import_zod12.z.number().optional(),
  soundEnabled: import_zod12.z.boolean().optional(),
  soundVolume: import_zod12.z.number().optional(),
  maxOpenTabsContext: import_zod12.z.number().optional(),
  maxWorkspaceFiles: import_zod12.z.number().optional(),
  showRooIgnoredFiles: import_zod12.z.boolean().optional(),
  maxReadFileLine: import_zod12.z.number().optional(),
  maxImageFileSize: import_zod12.z.number().optional(),
  maxTotalImageSize: import_zod12.z.number().optional(),
  terminalOutputLineLimit: import_zod12.z.number().optional(),
  terminalOutputCharacterLimit: import_zod12.z.number().optional(),
  terminalShellIntegrationTimeout: import_zod12.z.number().optional(),
  terminalShellIntegrationDisabled: import_zod12.z.boolean().optional(),
  terminalCommandDelay: import_zod12.z.number().optional(),
  terminalPowershellCounter: import_zod12.z.boolean().optional(),
  terminalZshClearEolMark: import_zod12.z.boolean().optional(),
  terminalZshOhMy: import_zod12.z.boolean().optional(),
  terminalZshP10k: import_zod12.z.boolean().optional(),
  terminalZdotdir: import_zod12.z.boolean().optional(),
  terminalCompressProgressBar: import_zod12.z.boolean().optional(),
  diagnosticsEnabled: import_zod12.z.boolean().optional(),
  rateLimitSeconds: import_zod12.z.number().optional(),
  diffEnabled: import_zod12.z.boolean().optional(),
  fuzzyMatchThreshold: import_zod12.z.number().optional(),
  experiments: experimentsSchema.optional(),
  codebaseIndexModels: codebaseIndexModelsSchema.optional(),
  codebaseIndexConfig: codebaseIndexConfigSchema.optional(),
  language: languagesSchema.optional(),
  telemetrySetting: telemetrySettingsSchema.optional(),
  mcpEnabled: import_zod12.z.boolean().optional(),
  enableMcpServerCreation: import_zod12.z.boolean().optional(),
  remoteControlEnabled: import_zod12.z.boolean().optional(),
  mode: import_zod12.z.string().optional(),
  modeApiConfigs: import_zod12.z.record(import_zod12.z.string(), import_zod12.z.string()).optional(),
  customModes: import_zod12.z.array(modeConfigSchema).optional(),
  customModePrompts: customModePromptsSchema.optional(),
  customSupportPrompts: customSupportPromptsSchema.optional(),
  enhancementApiConfigId: import_zod12.z.string().optional(),
  includeTaskHistoryInEnhance: import_zod12.z.boolean().optional(),
  historyPreviewCollapsed: import_zod12.z.boolean().optional(),
  profileThresholds: import_zod12.z.record(import_zod12.z.string(), import_zod12.z.number()).optional(),
  hasOpenedModeSelector: import_zod12.z.boolean().optional(),
  lastModeExportPath: import_zod12.z.string().optional(),
  lastModeImportPath: import_zod12.z.string().optional(),
  // IM integration data
  imContacts: import_zod12.z.object({
    friends: import_zod12.z.array(
      import_zod12.z.object({
        id: import_zod12.z.number(),
        nickName: import_zod12.z.string(),
        headImage: import_zod12.z.string(),
        deleted: import_zod12.z.boolean(),
        online: import_zod12.z.boolean(),
        onlineWeb: import_zod12.z.boolean(),
        onlineApp: import_zod12.z.boolean()
      })
    ).optional(),
    groups: import_zod12.z.array(
      import_zod12.z.object({
        id: import_zod12.z.number(),
        name: import_zod12.z.string(),
        ownerId: import_zod12.z.number(),
        headImage: import_zod12.z.string(),
        headImageThumb: import_zod12.z.string(),
        notice: import_zod12.z.string(),
        remarkNickName: import_zod12.z.string(),
        showNickName: import_zod12.z.string(),
        showGroupName: import_zod12.z.string(),
        remarkGroupName: import_zod12.z.string(),
        dissolve: import_zod12.z.boolean(),
        quit: import_zod12.z.boolean(),
        isBanned: import_zod12.z.boolean(),
        reason: import_zod12.z.string()
      })
    ).optional(),
    lastUpdated: import_zod12.z.number().optional()
  }).optional(),
  // A2A testing mode configuration
  agentA2AMode: import_zod12.z.object({
    enabled: import_zod12.z.boolean(),
    agentId: import_zod12.z.string(),
    agentName: import_zod12.z.string(),
    serverUrl: import_zod12.z.string(),
    serverPort: import_zod12.z.number(),
    isDebugMode: import_zod12.z.boolean().optional(),
    // 标识是否为调试模式
    // 🔥 关键新增：智能体专属配置，实现与用户global配置完全隔离
    agentApiConfiguration: providerSettingsSchema.nullable().optional(),
    agentMode: import_zod12.z.string().optional()
  }).nullable().optional(),
  // Agent waiting for user input state
  waitingForAgentInput: import_zod12.z.boolean().optional()
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
var import_zod13 = require("zod");
var mcpParameterSchema = import_zod13.z.object({
  name: import_zod13.z.string().min(1),
  key: import_zod13.z.string().min(1),
  placeholder: import_zod13.z.string().optional(),
  optional: import_zod13.z.boolean().optional().default(false)
});
var mcpInstallationMethodSchema = import_zod13.z.object({
  name: import_zod13.z.string().min(1),
  content: import_zod13.z.string().min(1),
  parameters: import_zod13.z.array(mcpParameterSchema).optional(),
  prerequisites: import_zod13.z.array(import_zod13.z.string()).optional()
});
var marketplaceItemTypeSchema = import_zod13.z.enum(["mode", "mcp"]);
var baseMarketplaceItemSchema = import_zod13.z.object({
  id: import_zod13.z.string().min(1),
  name: import_zod13.z.string().min(1, "Name is required"),
  description: import_zod13.z.string(),
  author: import_zod13.z.string().optional(),
  authorUrl: import_zod13.z.string().url("Author URL must be a valid URL").optional(),
  tags: import_zod13.z.array(import_zod13.z.string()).optional(),
  prerequisites: import_zod13.z.array(import_zod13.z.string()).optional()
});
var modeMarketplaceItemSchema = baseMarketplaceItemSchema.extend({
  content: import_zod13.z.string().min(1)
  // YAML content for modes
});
var mcpMarketplaceItemSchema = baseMarketplaceItemSchema.extend({
  url: import_zod13.z.string().url(),
  // Required url field
  content: import_zod13.z.union([import_zod13.z.string().min(1), import_zod13.z.array(mcpInstallationMethodSchema)]),
  // Single config or array of methods
  parameters: import_zod13.z.array(mcpParameterSchema).optional()
});
var marketplaceItemSchema = import_zod13.z.discriminatedUnion("type", [
  // Mode marketplace item
  modeMarketplaceItemSchema.extend({
    type: import_zod13.z.literal("mode")
  }),
  // MCP marketplace item
  mcpMarketplaceItemSchema.extend({
    type: import_zod13.z.literal("mcp")
  })
]);
var installMarketplaceItemOptionsSchema = import_zod13.z.object({
  target: import_zod13.z.enum(["global", "project"]).optional().default("project"),
  parameters: import_zod13.z.record(import_zod13.z.string(), import_zod13.z.any()).optional()
});

// src/cloud.ts
var organizationAllowListSchema = import_zod14.z.object({
  allowAll: import_zod14.z.boolean(),
  providers: import_zod14.z.record(
    import_zod14.z.object({
      allowAll: import_zod14.z.boolean(),
      models: import_zod14.z.array(import_zod14.z.string()).optional()
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
  import_zod14.z.object({
    maxOpenTabsContext: import_zod14.z.number().int().nonnegative().optional(),
    maxReadFileLine: import_zod14.z.number().int().gte(-1).optional(),
    maxWorkspaceFiles: import_zod14.z.number().int().nonnegative().optional(),
    terminalCommandDelay: import_zod14.z.number().int().nonnegative().optional(),
    terminalOutputLineLimit: import_zod14.z.number().int().nonnegative().optional(),
    terminalShellIntegrationTimeout: import_zod14.z.number().int().nonnegative().optional()
  })
);
var organizationCloudSettingsSchema = import_zod14.z.object({
  recordTaskMessages: import_zod14.z.boolean().optional(),
  enableTaskSharing: import_zod14.z.boolean().optional(),
  taskShareExpirationDays: import_zod14.z.number().int().positive().optional(),
  allowMembersViewAllTasks: import_zod14.z.boolean().optional()
});
var organizationSettingsSchema = import_zod14.z.object({
  version: import_zod14.z.number(),
  cloudSettings: organizationCloudSettingsSchema.optional(),
  defaultSettings: organizationDefaultSettingsSchema,
  allowList: organizationAllowListSchema,
  hiddenMcps: import_zod14.z.array(import_zod14.z.string()).optional(),
  hideMarketplaceMcps: import_zod14.z.boolean().optional(),
  mcps: import_zod14.z.array(mcpMarketplaceItemSchema).optional(),
  providerProfiles: import_zod14.z.record(import_zod14.z.string(), discriminatedProviderSettingsWithIdSchema).optional()
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
var shareResponseSchema = import_zod14.z.object({
  success: import_zod14.z.boolean(),
  shareUrl: import_zod14.z.string().optional(),
  error: import_zod14.z.string().optional(),
  isNewShare: import_zod14.z.boolean().optional(),
  manageUrl: import_zod14.z.string().optional()
});

// src/events.ts
var import_zod15 = require("zod");
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
var rooCodeEventsSchema = import_zod15.z.object({
  ["taskCreated" /* TaskCreated */]: import_zod15.z.tuple([import_zod15.z.string()]),
  ["taskStarted" /* TaskStarted */]: import_zod15.z.tuple([import_zod15.z.string()]),
  ["taskCompleted" /* TaskCompleted */]: import_zod15.z.tuple([
    import_zod15.z.string(),
    tokenUsageSchema,
    toolUsageSchema,
    import_zod15.z.object({
      isSubtask: import_zod15.z.boolean()
    })
  ]),
  ["taskAborted" /* TaskAborted */]: import_zod15.z.tuple([import_zod15.z.string()]),
  ["taskFocused" /* TaskFocused */]: import_zod15.z.tuple([import_zod15.z.string()]),
  ["taskUnfocused" /* TaskUnfocused */]: import_zod15.z.tuple([import_zod15.z.string()]),
  ["taskActive" /* TaskActive */]: import_zod15.z.tuple([import_zod15.z.string()]),
  ["taskIdle" /* TaskIdle */]: import_zod15.z.tuple([import_zod15.z.string()]),
  ["taskPaused" /* TaskPaused */]: import_zod15.z.tuple([import_zod15.z.string()]),
  ["taskUnpaused" /* TaskUnpaused */]: import_zod15.z.tuple([import_zod15.z.string()]),
  ["taskSpawned" /* TaskSpawned */]: import_zod15.z.tuple([import_zod15.z.string(), import_zod15.z.string()]),
  ["message" /* Message */]: import_zod15.z.tuple([
    import_zod15.z.object({
      taskId: import_zod15.z.string(),
      action: import_zod15.z.union([import_zod15.z.literal("created"), import_zod15.z.literal("updated")]),
      message: clineMessageSchema
    })
  ]),
  ["taskModeSwitched" /* TaskModeSwitched */]: import_zod15.z.tuple([import_zod15.z.string(), import_zod15.z.string()]),
  ["taskAskResponded" /* TaskAskResponded */]: import_zod15.z.tuple([import_zod15.z.string()]),
  ["taskToolFailed" /* TaskToolFailed */]: import_zod15.z.tuple([import_zod15.z.string(), toolNamesSchema, import_zod15.z.string()]),
  ["taskTokenUsageUpdated" /* TaskTokenUsageUpdated */]: import_zod15.z.tuple([import_zod15.z.string(), tokenUsageSchema])
});
var taskEventSchema = import_zod15.z.discriminatedUnion("eventName", [
  // Task Provider Lifecycle
  import_zod15.z.object({
    eventName: import_zod15.z.literal("taskCreated" /* TaskCreated */),
    payload: rooCodeEventsSchema.shape["taskCreated" /* TaskCreated */],
    taskId: import_zod15.z.number().optional()
  }),
  // Task Lifecycle
  import_zod15.z.object({
    eventName: import_zod15.z.literal("taskStarted" /* TaskStarted */),
    payload: rooCodeEventsSchema.shape["taskStarted" /* TaskStarted */],
    taskId: import_zod15.z.number().optional()
  }),
  import_zod15.z.object({
    eventName: import_zod15.z.literal("taskCompleted" /* TaskCompleted */),
    payload: rooCodeEventsSchema.shape["taskCompleted" /* TaskCompleted */],
    taskId: import_zod15.z.number().optional()
  }),
  import_zod15.z.object({
    eventName: import_zod15.z.literal("taskAborted" /* TaskAborted */),
    payload: rooCodeEventsSchema.shape["taskAborted" /* TaskAborted */],
    taskId: import_zod15.z.number().optional()
  }),
  import_zod15.z.object({
    eventName: import_zod15.z.literal("taskFocused" /* TaskFocused */),
    payload: rooCodeEventsSchema.shape["taskFocused" /* TaskFocused */],
    taskId: import_zod15.z.number().optional()
  }),
  import_zod15.z.object({
    eventName: import_zod15.z.literal("taskUnfocused" /* TaskUnfocused */),
    payload: rooCodeEventsSchema.shape["taskUnfocused" /* TaskUnfocused */],
    taskId: import_zod15.z.number().optional()
  }),
  import_zod15.z.object({
    eventName: import_zod15.z.literal("taskActive" /* TaskActive */),
    payload: rooCodeEventsSchema.shape["taskActive" /* TaskActive */],
    taskId: import_zod15.z.number().optional()
  }),
  import_zod15.z.object({
    eventName: import_zod15.z.literal("taskIdle" /* TaskIdle */),
    payload: rooCodeEventsSchema.shape["taskIdle" /* TaskIdle */],
    taskId: import_zod15.z.number().optional()
  }),
  // Subtask Lifecycle
  import_zod15.z.object({
    eventName: import_zod15.z.literal("taskPaused" /* TaskPaused */),
    payload: rooCodeEventsSchema.shape["taskPaused" /* TaskPaused */],
    taskId: import_zod15.z.number().optional()
  }),
  import_zod15.z.object({
    eventName: import_zod15.z.literal("taskUnpaused" /* TaskUnpaused */),
    payload: rooCodeEventsSchema.shape["taskUnpaused" /* TaskUnpaused */],
    taskId: import_zod15.z.number().optional()
  }),
  import_zod15.z.object({
    eventName: import_zod15.z.literal("taskSpawned" /* TaskSpawned */),
    payload: rooCodeEventsSchema.shape["taskSpawned" /* TaskSpawned */],
    taskId: import_zod15.z.number().optional()
  }),
  // Task Execution
  import_zod15.z.object({
    eventName: import_zod15.z.literal("message" /* Message */),
    payload: rooCodeEventsSchema.shape["message" /* Message */],
    taskId: import_zod15.z.number().optional()
  }),
  import_zod15.z.object({
    eventName: import_zod15.z.literal("taskModeSwitched" /* TaskModeSwitched */),
    payload: rooCodeEventsSchema.shape["taskModeSwitched" /* TaskModeSwitched */],
    taskId: import_zod15.z.number().optional()
  }),
  import_zod15.z.object({
    eventName: import_zod15.z.literal("taskAskResponded" /* TaskAskResponded */),
    payload: rooCodeEventsSchema.shape["taskAskResponded" /* TaskAskResponded */],
    taskId: import_zod15.z.number().optional()
  }),
  // Task Analytics
  import_zod15.z.object({
    eventName: import_zod15.z.literal("taskToolFailed" /* TaskToolFailed */),
    payload: rooCodeEventsSchema.shape["taskToolFailed" /* TaskToolFailed */],
    taskId: import_zod15.z.number().optional()
  }),
  import_zod15.z.object({
    eventName: import_zod15.z.literal("taskTokenUsageUpdated" /* TaskTokenUsageUpdated */),
    payload: rooCodeEventsSchema.shape["taskTokenUsageUpdated" /* TaskTokenUsageUpdated */],
    taskId: import_zod15.z.number().optional()
  }),
  // Evals
  import_zod15.z.object({
    eventName: import_zod15.z.literal("evalPass" /* EvalPass */),
    payload: import_zod15.z.undefined(),
    taskId: import_zod15.z.number()
  }),
  import_zod15.z.object({
    eventName: import_zod15.z.literal("evalFail" /* EvalFail */),
    payload: import_zod15.z.undefined(),
    taskId: import_zod15.z.number()
  })
]);

// src/followup.ts
var import_zod16 = require("zod");
var suggestionItemSchema = import_zod16.z.object({
  answer: import_zod16.z.string(),
  mode: import_zod16.z.string().optional()
});
var followUpDataSchema = import_zod16.z.object({
  question: import_zod16.z.string().optional(),
  suggest: import_zod16.z.array(suggestionItemSchema).optional()
});

// src/ipc.ts
var import_zod17 = require("zod");
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
var ackSchema = import_zod17.z.object({
  clientId: import_zod17.z.string(),
  pid: import_zod17.z.number(),
  ppid: import_zod17.z.number()
});
var TaskCommandName = /* @__PURE__ */ ((TaskCommandName2) => {
  TaskCommandName2["StartNewTask"] = "StartNewTask";
  TaskCommandName2["CancelTask"] = "CancelTask";
  TaskCommandName2["CloseTask"] = "CloseTask";
  return TaskCommandName2;
})(TaskCommandName || {});
var taskCommandSchema = import_zod17.z.discriminatedUnion("commandName", [
  import_zod17.z.object({
    commandName: import_zod17.z.literal("StartNewTask" /* StartNewTask */),
    data: import_zod17.z.object({
      configuration: rooCodeSettingsSchema,
      text: import_zod17.z.string(),
      images: import_zod17.z.array(import_zod17.z.string()).optional(),
      newTab: import_zod17.z.boolean().optional()
    })
  }),
  import_zod17.z.object({
    commandName: import_zod17.z.literal("CancelTask" /* CancelTask */),
    data: import_zod17.z.string()
  }),
  import_zod17.z.object({
    commandName: import_zod17.z.literal("CloseTask" /* CloseTask */),
    data: import_zod17.z.string()
  })
]);
var ipcMessageSchema = import_zod17.z.discriminatedUnion("type", [
  import_zod17.z.object({
    type: import_zod17.z.literal("Ack" /* Ack */),
    origin: import_zod17.z.literal("server" /* Server */),
    data: ackSchema
  }),
  import_zod17.z.object({
    type: import_zod17.z.literal("TaskCommand" /* TaskCommand */),
    origin: import_zod17.z.literal("client" /* Client */),
    clientId: import_zod17.z.string(),
    data: taskCommandSchema
  }),
  import_zod17.z.object({
    type: import_zod17.z.literal("TaskEvent" /* TaskEvent */),
    origin: import_zod17.z.literal("server" /* Server */),
    relayClientId: import_zod17.z.string().optional(),
    data: taskEventSchema
  })
]);

// src/mcp.ts
var import_zod18 = require("zod");
var mcpExecutionStatusSchema = import_zod18.z.discriminatedUnion("status", [
  import_zod18.z.object({
    executionId: import_zod18.z.string(),
    status: import_zod18.z.literal("started"),
    serverName: import_zod18.z.string(),
    toolName: import_zod18.z.string()
  }),
  import_zod18.z.object({
    executionId: import_zod18.z.string(),
    status: import_zod18.z.literal("output"),
    response: import_zod18.z.string()
  }),
  import_zod18.z.object({
    executionId: import_zod18.z.string(),
    status: import_zod18.z.literal("completed"),
    response: import_zod18.z.string().optional()
  }),
  import_zod18.z.object({
    executionId: import_zod18.z.string(),
    status: import_zod18.z.literal("error"),
    error: import_zod18.z.string().optional()
  })
]);

// src/todo.ts
var import_zod19 = require("zod");
var todoStatusSchema = import_zod19.z.enum(["pending", "in_progress", "completed"]);
var todoItemSchema = import_zod19.z.object({
  id: import_zod19.z.string(),
  content: import_zod19.z.string(),
  status: todoStatusSchema
});

// src/terminal.ts
var import_zod20 = require("zod");
var commandExecutionStatusSchema = import_zod20.z.discriminatedUnion("status", [
  import_zod20.z.object({
    executionId: import_zod20.z.string(),
    status: import_zod20.z.literal("started"),
    pid: import_zod20.z.number().optional(),
    command: import_zod20.z.string()
  }),
  import_zod20.z.object({
    executionId: import_zod20.z.string(),
    status: import_zod20.z.literal("output"),
    output: import_zod20.z.string()
  }),
  import_zod20.z.object({
    executionId: import_zod20.z.string(),
    status: import_zod20.z.literal("exited"),
    exitCode: import_zod20.z.number().optional()
  }),
  import_zod20.z.object({
    executionId: import_zod20.z.string(),
    status: import_zod20.z.literal("fallback")
  }),
  import_zod20.z.object({
    executionId: import_zod20.z.string(),
    status: import_zod20.z.literal("timeout")
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.cjs.map