// IM types for integration with box-im

export interface IMContact {
	id: number | string // 支持两种类型，便于统一处理
	name: string
	nickname?: string
	avatar?: string
	type: "friend" | "group"
	// Friend specific fields
	online?: boolean
	onlineWeb?: boolean
	onlineApp?: boolean
	deleted?: boolean
	// Group specific fields
	ownerId?: number
	notice?: string
	dissolve?: boolean
	quit?: boolean
	isBanned?: boolean
}

export interface IMVueStore {
	state?: {
		contacts?: {
			friends?: IMContact[]
			groups?: IMContact[]
		}
		user?: {
			id: string
			name: string
			avatar?: string
		}
	}
	getters?: {
		allContacts?: () => IMContact[]
		friendsList?: () => IMContact[]
		groupsList?: () => IMContact[]
	}
}

declare global {
	interface Window {
		__VUE_STORE__?: IMVueStore
	}
}
