/**
 * 终端类型枚举
 * 与后端保持一致的终端类型映射
 */
export enum TerminalType {
	/** 傻蛋网页端 */
	WEB = 0,
	/** 傻蛋精灵App */
	APP = 1,
	/** 我的电脑(VSCode) */
	VSCODE = 2,
	/** 我的云电脑 */
	CLOUD_PC = 3,
	/** 傻蛋浏览器插件 */
	BROWSER_PLUGIN = 4,
	/** MCP端 */
	MCP = 5,
}

/**
 * 终端信息接口
 */
export interface TerminalInfo {
	type: TerminalType
	name: string
	icon: string
	online: boolean
}

/**
 * 预定义的终端信息列表
 */
export const TERMINAL_LIST: TerminalInfo[] = [
	{ type: TerminalType.WEB, name: "傻蛋网页端", icon: "🌐", online: false },
	{ type: TerminalType.APP, name: "傻蛋精灵App", icon: "📱", online: false },
	{ type: TerminalType.VSCODE, name: "我的电脑", icon: "💻", online: false },
	{ type: TerminalType.CLOUD_PC, name: "我的云电脑", icon: "🖥", online: false },
	{ type: TerminalType.BROWSER_PLUGIN, name: "傻蛋浏览器", icon: "🔌", online: false },
	{ type: TerminalType.MCP, name: "MCP端", icon: "🤖", online: false },
]

/**
 * 根据终端类型获取终端信息
 */
export function getTerminalInfo(type: TerminalType): TerminalInfo | undefined {
	return TERMINAL_LIST.find((t) => t.type === type)
}

/**
 * 根据终端类型获取终端名称
 */
export function getTerminalName(type: TerminalType): string {
	const info = getTerminalInfo(type)
	return info?.name || "未知终端"
}
