;(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
	["chunk-a1723fe6"],
	{
		"3f94": function (e, t, a) {
			"use strict"
			a.r(t)
			var n = function () {
					var e = this,
						t = e._self._c
					return t(
						"el-container",
						{ staticClass: "chat-page" },
						[
							t(
								"el-aside",
								{ staticClass: "chat-list-box", attrs: { width: "260px" } },
								[
									t(
										"div",
										{ staticClass: "chat-list-header" },
										[
											t(
												"el-input",
												{
													staticClass: "search-text",
													attrs: { size: "small", placeholder: "搜索" },
													model: {
														value: e.searchText,
														callback: function (t) {
															e.searchText = t
														},
														expression: "searchText",
													},
												},
												[
													t("i", {
														staticClass: "el-icon-search el-input__icon",
														attrs: { slot: "prefix" },
														slot: "prefix",
													}),
												],
											),
										],
										1,
									),
									e.loading
										? t("div", {
												directives: [
													{
														name: "loading",
														rawName: "v-loading",
														value: !0,
														expression: "true",
													},
												],
												staticClass: "chat-list-loading",
												attrs: {
													"element-loading-text": "消息接收中...",
													"element-loading-spinner": "el-icon-loading",
													"element-loading-background": "#F9F9F9",
													"element-loading-size": "24",
												},
											})
										: t(
												"el-scrollbar",
												{ staticClass: "chat-list-items" },
												e._l(e.sortedChats, function (a, n) {
													return t(
														"div",
														{ key: e.generateChatKey(a, n) },
														[
															t("chat-item", {
																directives: [
																	{
																		name: "show",
																		rawName: "v-show",
																		value:
																			!a.delete &&
																			a.showName &&
																			a.showName.includes(e.searchText),
																		expression:
																			"!chat.delete && chat.showName && chat.showName.includes(searchText)",
																	},
																],
																class: {
																	"terminal-chat":
																		a.isTerminalChat || a.isTerminalInbox,
																	"normal-chat":
																		!a.isTerminalChat && !a.isTerminalInbox,
																},
																attrs: {
																	chat: a,
																	index: a.originalIndex,
																	active: a === e.chatStore.activeChat,
																},
																on: {
																	delete: function (t) {
																		return e.onDelItem(a.originalIndex)
																	},
																	top: function (t) {
																		return e.onTop(a.originalIndex)
																	},
																},
																nativeOn: {
																	click: function (t) {
																		return e.onActiveItem(a.originalIndex)
																	},
																},
															}),
														],
														1,
													)
												}),
												0,
											),
								],
								1,
							),
							t(
								"el-container",
								{ staticClass: "chat-box" },
								[
									e.isPCTerminalChat ? t("container-manager", { ref: "containerManager" }) : e._e(),
									e.chatStore.activeChat
										? t("chat-box", {
												attrs: { chat: e.chatStore.activeChat },
												on: { "message-sent": e.onMessageSent },
											})
										: e._e(),
								],
								1,
							),
						],
						1,
					)
				},
				i = [],
				o = (a("14d9"), a("0643"), a("4e3e"), a("a573"), a("552e")),
				r = a("6cde"),
				s = a("5a02"),
				l = {
					name: "chat",
					components: { ChatItem: o["a"], ChatBox: r["a"], ContainerManager: s["a"] },
					data() {
						return {
							searchText: "",
							messageContent: "",
							group: {},
							showTerminalSelector: !1,
							isPCTerminalChat: !1,
							groupMembers: [],
						}
					},
					methods: {
						onActiveItem(e) {
							this.$store.commit("activeChat", e), this.detectPCTerminalChat()
						},
						detectPCTerminalChat() {
							if (
								(console.log("[Chat] detectPCTerminalChat 开始检测"),
								console.log("[Chat] activeChat:", this.chatStore.activeChat),
								!this.chatStore.activeChat)
							)
								return (
									console.log("[Chat] 没有活跃会话，isPCTerminalChat = false"),
									void (this.isPCTerminalChat = !1)
								)
							const e = this.chatStore.activeChat.targetId
							console.log("[Chat] 会话信息:", {
								targetId: e,
								showName: this.chatStore.activeChat.showName,
							}),
								e && String(e).includes("_3")
									? ((this.isPCTerminalChat = !0),
										console.log("[Chat] 检测到PC终端会话 (targetId包含_3)，显示容器管理"))
									: ((this.isPCTerminalChat = !1),
										console.log("[Chat] 非PC终端会话，不显示容器管理")),
								console.log("[Chat] 最终 isPCTerminalChat =", this.isPCTerminalChat)
						},
						onDelItem(e) {
							this.$store.commit("removeChat", e)
						},
						onTop(e) {
							this.$store.commit("moveTop", e)
						},
						getCurrentTerminal() {
							return "undefined" !== typeof window
								? window.parent !== window ||
									window.acquireVsCodeApi ||
									window.isVSCodeEnvironment ||
									(window.location && "vscode-webview:" === window.location.protocol)
									? 2
									: window.isElectronApp || window.electronAPI
										? 3
										: window.chrome && window.chrome.runtime && window.chrome.runtime.id
											? 4
											: 0
								: "undefined" !== typeof uni
									? 1
									: 0
						},
						generateChatKey(e, t) {
							return e.isTerminalChat
								? `terminal-chat-${e.senderTerminal}-${e.targetId}`
								: e.isTerminalInbox
									? `terminal-inbox-${e.receivingTerminal}-${e.targetId}`
									: `${e.type}-${e.targetId}-${t}`
						},
						onMessageSent(e) {
							console.log("消息已发送:", e),
								this.$refs.containerManager &&
									!this.$refs.containerManager.isCollapsed &&
									(console.log("[Chat] 发送消息，自动折叠容器管理面板"),
									this.$refs.containerManager.toggleCollapse())
						},
					},
					computed: {
						chatStore() {
							return this.$store.state.chatStore
						},
						loading() {
							return this.chatStore.loadingGroupMsg || this.chatStore.loadingPrivateMsg
						},
						sortedChats() {
							const e = this.chatStore.chats || [],
								t = e.map((e, t) => ({ ...e, originalIndex: t })),
								a = [],
								n = []
							return (
								t.forEach((e) => {
									e.isTerminalChat || e.isTerminalInbox ? a.push(e) : n.push(e)
								}),
								a.sort((e, t) => {
									const a = e.senderTerminal || e.receivingTerminal || 0,
										n = t.senderTerminal || t.receivingTerminal || 0
									return a - n
								}),
								n.sort((e, t) => {
									const a = e.lastSendTime || 0,
										n = t.lastSendTime || 0
									return n - a
								}),
								[...a, ...n]
							)
						},
					},
					mounted() {
						this.detectPCTerminalChat()
					},
					watch: {
						"chatStore.activeChat": {
							handler() {
								this.detectPCTerminalChat()
							},
							immediate: !0,
						},
					},
				},
				c = l,
				h = (a("95b9"), a("2877")),
				d = Object(h["a"])(c, n, i, !1, null, null, null)
			t["default"] = d.exports
		},
		"4d1f": function (e, t, a) {},
		"95b9": function (e, t, a) {
			"use strict"
			a("4d1f")
		},
	},
])
//# sourceMappingURL=chunk-a1723fe6.be8cd437.js.map
