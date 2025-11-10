import { z } from "zod"
import { providerSettingsSchema } from "./provider-settings.js"
import { modeConfigSchema } from "./mode.js"

/**
 * 智能体工具配置
 */
export const agentToolConfigSchema = z.object({
	toolId: z.string(),
	enabled: z.boolean(),
	config: z.record(z.string(), z.any()).optional(),
})

export type AgentToolConfig = z.infer<typeof agentToolConfigSchema>

/**
 * 智能体Todo项
 */
export const agentTodoSchema = z.object({
	id: z.string(),
	content: z.string(),
	status: z.enum(["pending", "in_progress", "completed"]),
	createdAt: z.number(),
	updatedAt: z.number(),
	priority: z.enum(["low", "medium", "high"]).optional(),
})

export type AgentTodo = z.infer<typeof agentTodoSchema>

/**
 * 智能体模板来源
 */
export const agentTemplateSourceSchema = z.object({
	type: z.enum(["manual", "task"]),
	taskId: z.string().optional(),
	taskDescription: z.string().optional(),
	timestamp: z.number(),
})

export type AgentTemplateSource = z.infer<typeof agentTemplateSourceSchema>

/**
 * A2A 智能体卡片
 */
export const a2aAgentCardSchema = z.object({
	name: z.string(),
	description: z.string(),
	skills: z.array(z.string()),
	url: z.string().optional(), // 公网可访问的 A2A 端点
	capabilities: z.object({
		messageTypes: z.array(z.string()), // 支持的消息类型
		taskTypes: z.array(z.string()), // 支持的任务类型
		dataFormats: z.array(z.string()), // 支持的数据格式
		maxConcurrency: z.number().optional(), // 最大并发数
	}),
	// 部署信息
	deployment: z
		.object({
			type: z.enum(["pc", "cloud", "docker"]),
			platform: z.string(),
			region: z.string().optional(),
			networkReachable: z.boolean().optional(), // 网络是否可达
		})
		.optional(),
	auth: z
		.object({
			apiKey: z.string().optional(),
			authType: z.enum(["none", "apikey", "oauth"]),
		})
		.optional(),
})

export type A2AAgentCard = z.infer<typeof a2aAgentCardSchema>

/**
 * 智能体权限定义
 */
export const agentPermissionSchema = z.object({
	action: z.enum(["read", "execute", "modify", "admin"]),
	resource: z.string(), // 资源路径或标识
	conditions: z
		.object({
			timeRange: z.tuple([z.number(), z.number()]).optional(), // 时间范围限制
			ipRange: z.array(z.string()).optional(), // IP范围限制
			userAgent: z.string().optional(), // User-Agent限制
			maxUsage: z.number().optional(), // 最大使用次数限制
			rateLimit: z.number().optional(), // 速率限制（每分钟）
		})
		.optional(),
	description: z.string().optional(), // 权限描述
})

export type AgentPermission = z.infer<typeof agentPermissionSchema>

/**
 * 智能体API配置 - 基于完整的ProviderSettings副本
 */
export const agentApiConfigSchema = providerSettingsSchema.extend({
	originalId: z.string().optional(), // 原始配置ID（用于追踪来源）
	originalName: z.string().optional(), // 原始配置名称
	createdAt: z.number().optional(), // 副本创建时间
})

export type AgentApiConfig = z.infer<typeof agentApiConfigSchema>

/**
 * 智能体配置
 */
export const agentConfigSchema = z.object({
	id: z.string(),
	userId: z.string(),
	name: z.string(),
	avatar: z.string(),
	roleDescription: z.string(),
	welcomeMessage: z.string().optional(), // 欢迎语
	apiConfigId: z.string(), // 保留向后兼容
	apiConfig: agentApiConfigSchema.optional(), // 新增：嵌入式API配置
	mode: z.string(),
	modeConfig: modeConfigSchema.optional(), // 🔥 新增：自定义模式的完整定义（如果使用自定义模式）
	tools: z.array(agentToolConfigSchema),
	todos: z.array(agentTodoSchema),

	// 新增：A2A 和共享配置
	isPrivate: z.boolean().optional().default(true), // 私有/共享标识，默认true
	shareScope: z.enum(["friends", "groups", "public"]).optional(), // 共享范围：好友、群组、公开
	shareLevel: z.number().optional(), // 共享级别：0=私有，1=好友，2=群组，3=公开
	a2aAgentCard: a2aAgentCardSchema.optional(), // A2A 协议智能体卡片
	a2aEndpoint: z.string().optional(), // A2A 服务端点URL
	permissions: z.array(agentPermissionSchema).optional(), // 访问权限列表
	allowedUsers: z.array(z.string()).optional(), // 好友级别：白名单用户ID
	allowedGroups: z.array(z.string()).optional(), // 群组级别：白名单群组ID
	deniedUsers: z.array(z.string()).optional(), // 用户黑名单

	// 发布状态相关字段
	isPublished: z.boolean().optional().default(false), // 是否已发布
	publishInfo: z
		.object({
			// 发布信息
			terminalType: z.enum(["local", "cloud"]).optional(), // 发布终端类型
			serverPort: z.number().optional(), // A2A服务器端口
			serverUrl: z.string().optional(), // A2A服务器URL
			publishedAt: z.string().optional(), // 发布时间
			serviceStatus: z.enum(["online", "offline", "error"]).optional(), // 服务状态
			lastHeartbeat: z.number().optional(), // 最后心跳时间
		})
		.optional(),

	templateSource: agentTemplateSourceSchema.optional(),
	createdAt: z.number(),
	updatedAt: z.number(),
	lastUsedAt: z.number().optional(),
	isActive: z.boolean(),
	version: z.number(),
})

export type AgentConfig = z.infer<typeof agentConfigSchema>

/**
 * 智能体列表查询选项
 */
export const agentListOptionsSchema = z.object({
	sortBy: z.enum(["name", "createdAt", "updatedAt", "lastUsedAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
	filterByMode: z.string().optional(),
	onlyActive: z.boolean().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
})

export type AgentListOptions = z.infer<typeof agentListOptionsSchema>

/**
 * 智能体导出数据
 */
export const agentExportDataSchema = z.object({
	agent: agentConfigSchema,
	metadata: z.object({
		exportedAt: z.number(),
		exportedBy: z.string(),
		version: z.string(),
	}),
})

export type AgentExportData = z.infer<typeof agentExportDataSchema>

/**
 * 智能体模板数据（用于从任务创建智能体）
 */
export const agentTemplateDataSchema = z.object({
	apiConfigId: z.string().optional(),
	mode: z.string().optional(),
	tools: z.array(z.string()).optional(),
	templateSource: agentTemplateSourceSchema,
})

export type AgentTemplateData = z.infer<typeof agentTemplateDataSchema>

/**
 * 资源配额定义（用于后台运行）
 */
export const resourceQuotaSchema = z.object({
	maxMemory: z.number(), // 最大内存使用 (MB)
	maxCpuTime: z.number(), // 最大CPU时间 (ms)
	maxFileOperations: z.number(), // 最大文件操作次数
	maxNetworkRequests: z.number(), // 最大网络请求次数
	maxExecutionTime: z.number(), // 最大执行时间 (ms)
	workspaceAccess: z.object({
		readOnly: z.boolean(),
		allowedPaths: z.array(z.string()),
		deniedPaths: z.array(z.string()),
		tempDirectory: z.string(),
	}),
})

export type ResourceQuota = z.infer<typeof resourceQuotaSchema>

/**
 * 资源使用情况
 */
export const resourceUsageSchema = z.object({
	memory: z.number(), // 当前内存使用 (MB)
	cpuTime: z.number(), // 当前CPU时间 (ms)
	fileOperations: z.number(), // 当前文件操作次数
	networkRequests: z.number(), // 当前网络请求次数
	startTime: z.number(), // 启动时间戳
	lastUpdate: z.number(), // 最后更新时间戳
})

export type ResourceUsage = z.infer<typeof resourceUsageSchema>

/**
 * 智能体实例定义（运行时环境相关）
 */
export const agentInstanceSchema = z.object({
	agentId: z.string(), // 关联的智能体定义ID
	instanceId: z.string(), // 实例唯一标识
	userId: z.string(), // 实例所属用户

	// 部署信息
	deployment: z.object({
		type: z.enum(["pc", "cloud", "docker", "k8s"]),
		platform: z.string(), // 'vscode' | 'docker' | 'k8s'
		location: z.string().optional(), // 部署位置描述
		version: z.string(), // void版本
		region: z.string().optional(), // 地理区域
	}),

	// 网络端点
	endpoint: z.object({
		type: z.enum(["local_only", "network_reachable", "hybrid"]),

		// 直连信息
		direct: z
			.object({
				url: z.string(), // HTTP服务端点
				protocol: z.enum(["http", "https"]),
				port: z.number().optional(),
				apiKey: z.string().optional(), // API密钥
				healthCheckPath: z.string(), // 健康检查路径
			})
			.optional(),

		// IM桥接信息
		imBridge: z.object({
			proxyId: z.string(), // 代理标识
			channelId: z.string().optional(), // 通道标识
			priority: z.number(), // 路由优先级
		}),

		networkReachable: z.boolean().optional(), // 是否网络可达
		lastProbeTime: z.number().optional(), // 最后探测时间
	}),

	// 实例状态
	status: z.object({
		state: z.enum(["starting", "online", "offline", "error", "maintenance"]),
		startTime: z.number(),
		lastSeen: z.number(),
		currentLoad: z.number(), // 当前负载 0-1
		errorCount: z.number(), // 错误计数
		errorRate: z.number(), // 错误率 0-1
		uptime: z.number(), // 运行时间
	}),

	// 性能指标
	metrics: z.object({
		avgResponseTime: z.number(), // 平均响应时间 (ms)
		successRate: z.number(), // 成功率 0-1
		throughput: z.number(), // 吞吐量 (req/s)
		memoryUsage: z.number().optional(), // 内存使用率 0-1
		cpuUsage: z.number().optional(), // CPU使用率 0-1
		lastUpdate: z.number(), // 最后更新时间
	}),

	// 资源配额
	resourceQuota: resourceQuotaSchema.optional(),

	// 元数据
	metadata: z.object({
		createdAt: z.number(),
		updatedAt: z.number(),
		version: z.number(),
		tags: z.array(z.string()).optional(),
	}),
})

export type AgentInstance = z.infer<typeof agentInstanceSchema>

/**
 * A2A 通信相关类型
 */
export const agentRequestSchema = z.object({
	method: z.string(),
	params: z.any(),
	timeout: z.number().optional(),
	priority: z.enum(["low", "normal", "high"]).optional(),
	retries: z.number().optional(),
	sourceAgentId: z.string().optional(),
	sourceUserId: z.string().optional(),
})

export type AgentRequest = z.infer<typeof agentRequestSchema>

export const agentResponseSchema = z.object({
	success: z.boolean(),
	data: z.any().optional(),
	error: z.string().optional(),
	agentId: z.string(),
	route: z.enum(["direct", "im_bridge", "hybrid"]).optional(),
	timestamp: z.number(),
	duration: z.number().optional(),
})

export type AgentResponse = z.infer<typeof agentResponseSchema>

/**
 * 智能体端点定义
 */
export const agentEndpointSchema = z.object({
	agentId: z.string(),
	userId: z.string(),
	type: z.enum(["local_only", "network_reachable", "hybrid"]),
	directUrl: z.string().optional(), // 直连URL
	apiKey: z.string().optional(), // API密钥
	imProxyId: z.string(), // IM代理标识
	networkReachable: z.boolean().optional(), // 网络可达性
	lastProbeTime: z.number().optional(), // 最后探测时间
	status: z.object({
		state: z.enum(["online", "offline", "busy", "error"]),
		lastSeen: z.number(),
		currentLoad: z.number(),
		errorRate: z.number(),
		avgResponseTime: z.number(),
	}),
	deploymentType: z.enum(["pc", "cloud", "docker", "serverless"]),
})

export type AgentEndpoint = z.infer<typeof agentEndpointSchema>

/**
 * 智能体发现查询
 */
export const agentDiscoveryQuerySchema = z.object({
	userId: z.string(),
	capabilities: z.array(z.string()).optional(),
	categories: z.array(z.string()).optional(),
	tags: z.array(z.string()).optional(),
	deploymentTypes: z.array(z.string()).optional(),
	regions: z.array(z.string()).optional(),
	keywords: z.string().optional(),
	onlyOnline: z.boolean().optional(),
	visibility: z.enum(["private", "friends", "groups", "public", "all"]).optional(),
	shareScope: z.enum(["friends", "groups", "public"]).optional(),
	shareLevel: z.number().optional(),
	sortBy: z.enum(["relevance", "performance", "popularity", "rating"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
	offset: z.number().optional(),
	limit: z.number().optional(),
})

export type AgentDiscoveryQuery = z.infer<typeof agentDiscoveryQuerySchema>

/**
 * 智能体发现结果
 */
export const agentDiscoveryResultSchema = z.object({
	agentId: z.string(),
	userId: z.string(),
	name: z.string(),
	description: z.string(),
	avatar: z.string(),

	// 匹配信息
	matchedCapabilities: z.array(z.string()),
	relevanceScore: z.number(),

	// 部署信息
	deploymentType: z.enum(["pc", "cloud", "docker", "serverless"]),
	region: z.string().optional(),
	endpointType: z.enum(["local_only", "network_reachable", "hybrid"]),

	// 性能指标
	currentLoad: z.number(),
	avgResponseTime: z.number(),
	errorRate: z.number(),
	availability: z.number(),

	// 使用统计
	totalCalls: z.number(),
	successRate: z.number(),
	rating: z.number().optional(),

	// 权限信息
	isPrivate: z.boolean(),
	hasAccess: z.boolean(),

	// 元数据
	category: z.string().optional(),
	tags: z.array(z.string()),
	createdAt: z.number(),
	lastUsed: z.number().optional(),
})

export type AgentDiscoveryResult = z.infer<typeof agentDiscoveryResultSchema>

/**
 * 统一智能体注册中心条目
 */
export const unifiedAgentRegistrySchema = z.object({
	agentId: z.string(),
	userId: z.string(),
	name: z.string(),
	avatar: z.string(),
	description: z.string(),

	// 能力信息
	capabilities: z.object({
		tools: z.array(z.string()),
		skills: z.array(z.string()),
		categories: z.array(z.string()),
	}),

	// 部署信息
	deployment: z.object({
		type: z.enum(["pc", "cloud", "docker", "serverless"]),
		region: z.string().optional(),
		endpointType: z.enum(["local_only", "network_reachable", "hybrid"]),
		directUrl: z.string().optional(),
		imProxyId: z.string().optional(),
	}),

	// 状态信息
	status: z.object({
		state: z.enum(["online", "offline", "busy", "maintenance"]),
		lastSeen: z.number(),
		currentLoad: z.number(),
		errorRate: z.number(),
		avgResponseTime: z.number(),
	}),

	// 共享配置
	sharing: z.object({
		isPrivate: z.boolean(),
		shareScope: z.enum(["none", "friends", "groups", "public"]),
		shareLevel: z.number().min(0).max(3),
		permissions: z.array(z.enum(["read", "execute", "modify"])),
		allowedUsers: z.array(z.string()),
		allowedGroups: z.array(z.string()),
		deniedUsers: z.array(z.string()),
	}),

	// 元数据
	metadata: z.object({
		createdAt: z.number(),
		updatedAt: z.number(),
		version: z.string(),
		tags: z.array(z.string()),
	}),
})

export type UnifiedAgentRegistry = z.infer<typeof unifiedAgentRegistrySchema>
