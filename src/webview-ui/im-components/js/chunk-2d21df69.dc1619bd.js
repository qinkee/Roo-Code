;(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
	["chunk-2d21df69"],
	{
		d414: function (e, t, n) {
			"use strict"
			n.r(t),
				n.d(t, "A2AClient", function () {
					return i
				}),
				n.d(t, "globalA2AClient", function () {
					return r
				})
			n("d9e2"), n("14d9"), n("0643"), n("2382"), n("4e3e")
			var s = n("ec26")
			class i {
				constructor() {
					;(this.isConnected = !1),
						(this.currentAgent = null),
						(this.messageListeners = []),
						(this.statusListeners = []),
						(this.serviceEndpoint = null),
						(this.agentCard = null),
						(this.requestIdCounter = 1)
				}
				async connect(e) {
					try {
						if (
							(console.log("[A2AClient] Connecting to agent:", e),
							(this.currentAgent = e),
							"online" !== e.serviceStatus || !e.isActive)
						)
							throw new Error("智能体当前不在线")
						if (!e.serviceEndpoint) throw new Error("智能体服务端点不可用")
						;(this.serviceEndpoint = e.serviceEndpoint), (this.officialClient = null)
						const n = e.serviceEndpoint + "/.well-known/agent-card.json"
						try {
							const e = await fetch(n)
							if (!e.ok) throw new Error("Failed to fetch agent card: " + e.status)
							this.agentCard = await e.json()
						} catch (t) {
							console.warn("[A2AClient] Failed to fetch agent card, using default config:", t),
								(this.agentCard = {
									name: e.name,
									description: e.roleDescription,
									endpoints: { chat: e.serviceEndpoint + "/chat" },
								})
						}
						return (
							(this.isConnected = !0),
							this.notifyStatusChange("connected"),
							console.log("[A2AClient] Successfully connected to agent:", e.id),
							!0
						)
					} catch (t) {
						throw (
							(console.error("[A2AClient] Failed to connect to agent:", t),
							(this.isConnected = !1),
							this.notifyStatusChange("error", t.message),
							t)
						)
					}
				}
				async disconnect() {
					try {
						;(this.isConnected = !1),
							(this.currentAgent = null),
							(this.serviceEndpoint = null),
							(this.agentCard = null),
							this.notifyStatusChange("disconnected"),
							console.log("[A2AClient] Disconnected from agent")
					} catch (e) {
						console.error("[A2AClient] Error during disconnect:", e)
					}
				}
				onMessage(e) {
					"function" === typeof e && this.messageListeners.push(e)
				}
				onStatusChange(e) {
					"function" === typeof e && this.statusListeners.push(e)
				}
				notifyMessage(e) {
					this.messageListeners.forEach((t) => {
						try {
							t(e)
						} catch (n) {
							console.error("[A2AClient] Error in message listener:", n)
						}
					})
				}
				notifyStatusChange(e, t = "") {
					this.statusListeners.forEach((n) => {
						try {
							n({ status: e, detail: t })
						} catch (s) {
							console.error("[A2AClient] Error in status listener:", s)
						}
					})
				}
				generateMessageId() {
					return Object(s["a"])()
				}
				isAgentConnected() {
					return this.isConnected && null !== this.currentAgent
				}
				async sendMessage(e, t = "text", n = !0, s = null) {
					if (!this.isConnected) throw new Error("未连接到智能体")
					if (n) return this.sendMessageWithStreaming(e, t, s)
					try {
						console.log("[A2AClient] Sending message:", { message: e, type: t })
						const n = { method: "execute", params: { message: e } },
							s = await this.getServiceEndpoint()
						console.log("[A2AClient] Sending request to:", s, n)
						const i = await fetch(s, {
							method: "POST",
							headers: { "Content-Type": "application/json", Accept: "application/json" },
							body: JSON.stringify(n),
						})
						if (!i.ok) throw new Error(`HTTP ${i.status}: ${i.statusText}`)
						const r = await i.json()
						console.log("[A2AClient] Received response:", r)
						let o = ""
						if (r.success && r.result) o = r.result
						else {
							if (r.error) throw new Error("Agent Error: " + r.error)
							o = "智能体已处理您的请求"
						}
						const a = {
							id: this.generateMessageId(),
							content: o,
							type: "agent",
							timestamp: Date.now(),
							agentId: this.currentAgent.id,
							agentName: this.currentAgent.name,
							originalResponse: r,
						}
						return this.notifyMessage(a), a
					} catch (i) {
						console.error("[A2AClient] Failed to send message:", i)
						let e = "抱歉，出错了！"
						e =
							i.message.includes("Failed to fetch") || i.message.includes("NetworkError")
								? "抱歉，出错了！该智能体暂时无法连接和运行，请联系智能体创作者。"
								: i.message.includes("timeout")
									? "抱歉，智能体响应超时，请稍后再试。"
									: i.message.includes("HTTP 404")
										? "抱歉，智能体服务未找到，请确认智能体是否正常运行。"
										: i.message.includes("HTTP 500") || i.message.includes("HTTP 502")
											? "抱歉，智能体服务暂时出现问题，请稍后再试。"
											: i.message.includes("HTTP")
												? `抱歉，智能体服务返回错误（${i.message}），请稍后再试。`
												: "抱歉，智能体暂时无法响应，请稍后再试或联系智能体创作者。"
						const t = {
							id: this.generateMessageId(),
							content: e,
							type: "error",
							timestamp: Date.now(),
							agentId: this.currentAgent.id,
							agentName: this.currentAgent.name,
						}
						throw (this.notifyMessage(t), i)
					}
				}
				async sendMessageWithStreaming(e, t = "text", n = null) {
					if (!this.isConnected) throw new Error("未连接到智能体")
					const s = this.generateMessageId()
					try {
						console.log("[A2AClient] Sending streaming message:", { message: e, type: t, placeholderId: n })
						const r = await this.getServiceEndpoint(),
							o = {
								id: s,
								content: "",
								placeholderId: n,
								type: "agent",
								timestamp: Date.now(),
								agentId: this.currentAgent.id,
								agentName: this.currentAgent.name,
								streaming: !0,
								thinkingContent: "",
								completionContent: "",
							},
							a = await fetch(r, {
								method: "POST",
								headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
								body: JSON.stringify({ method: "execute", params: { message: e, stream: !0 } }),
							})
						if (!a.ok) throw new Error(`HTTP ${a.status}: ${a.statusText}`)
						const c = a.headers.get("Content-Type")
						if (!c || !c.includes("text/event-stream")) {
							const e = await a.json()
							return (
								(o.content = e.result || "智能体已处理您的请求"),
								(o.streaming = !1),
								this.notifyMessage(o),
								o
							)
						}
						const l = a.body.getReader(),
							d = new TextDecoder()
						let g = "",
							u = !1
						while (!u) {
							const e = await l.read()
							if (((u = e.done), u)) break
							const t = e.value
							g += d.decode(t, { stream: !0 })
							const n = g.split("\n")
							g = n.pop() || ""
							for (const s of n)
								if (s.startsWith("event:")) {
									const e = s.substring(6).trim()
									console.log("[A2AClient] SSE Event:", e)
								} else if (s.startsWith("data:")) {
									const e = s.substring(5).trim()
									if (e)
										try {
											const t = JSON.parse(e)
											this.handleStreamEvent(t, o)
										} catch (i) {
											this.handleStreamEvent({ type: "text", content: e }, o)
										}
								}
						}
						return (o.streaming = !1), this.notifyMessage(o), o
					} catch (r) {
						console.error("[A2AClient] Streaming failed:", r)
						let e = "抱歉，出错了！"
						e =
							r.message.includes("Failed to fetch") || r.message.includes("NetworkError")
								? "抱歉，出错了！该智能体暂时无法连接和运行，请联系智能体创作者。"
								: r.message.includes("timeout")
									? "抱歉，智能体响应超时，请稍后再试。"
									: r.message.includes("HTTP 404")
										? "抱歉，智能体服务未找到，请确认智能体是否正常运行。"
										: r.message.includes("HTTP 500") || r.message.includes("HTTP 502")
											? "抱歉，智能体服务暂时出现问题，请稍后再试。"
											: r.message.includes("HTTP")
												? `抱歉，智能体服务返回错误（${r.message}），请稍后再试。`
												: "抱歉，智能体暂时无法响应，请稍后再试或联系智能体创作者。"
						const t = {
							id: this.generateMessageId(),
							content: e,
							type: "error",
							timestamp: Date.now(),
							agentId: this.currentAgent.id,
							agentName: this.currentAgent.name,
						}
						throw (this.notifyMessage(t), r)
					}
				}
				handleStreamEvent(e, t) {
					if ((console.log("[A2AClient] Handling stream event:", e), !t._notified)) {
						t._notified = !0
						const e = { ...t, content: "", streaming: !0 }
						this.notifyMessage(e)
					}
					if (e.error || "MESSAGE_ERROR" === e.code || "error" === e.type) {
						;(t.type = "error"), (t.streaming = !1)
						let n = ""
						n = e.error
							? e.error
							: e.details && e.details.text
								? e.details.text
								: e.message
									? e.message
									: "智能体处理出现未知错误"
						let s = ""
						return (
							(s = n.includes("language model did not provide any assistant messages")
								? "🤖 抱歉，智能体暂时无法处理您的请求。这可能是因为：\n\n• 智能体的语言模型配置有问题\n• 您的问题可能超出了智能体的能力范围\n• 智能体服务暂时不稳定\n\n💡 建议：请尝试换个方式提问，或联系智能体创作者进行排查。"
								: n.includes("timeout") || n.includes("超时")
									? "⏰ 智能体响应超时，请稍后再试。"
									: n.includes("network") || n.includes("fetch")
										? "🌐 网络连接异常，请检查网络后重试。"
										: n.includes("rate limit") || n.includes("限制")
											? "🚦 请求频率过高，请稍后再试。"
											: `❌ 智能体处理失败：${n}\n\n如果问题持续出现，请联系智能体创作者。`),
							(t.content = s),
							(t.status = "error"),
							void this.notifyMessage(t)
						)
					}
					switch (e.type) {
						case "connected":
							t.status = "connected"
							break
						case "start":
							t.status = "processing"
							break
						case "api_start":
							t.status = "api_processing"
							break
						case "thinking": {
							t.thinkingContent || (t.thinkingContent = "")
							const n = e.content || ""
							t.thinkingContent.includes(n) || (t.thinkingContent += n),
								(t.content = "🤔 思考中...\n" + t.thinkingContent)
							break
						}
						case "completion":
							t.completionContent || (t.completionContent = ""),
								(t.completionContent += e.content || ""),
								(t.content = t.completionContent)
							break
						case "done":
							;(t.status = "done"), (t.streaming = !1), e.result && (t.content = e.result)
							break
						default:
							e.content && (t.content += e.content)
					}
					this.notifyMessage(t)
				}
				async getServiceEndpoint() {
					var e
					let t,
						n = this.serviceEndpoint
					if ((!n && null !== (e = this.agentCard) && void 0 !== e && e.url && (n = this.agentCard.url), !n))
						throw new Error("No service endpoint available")
					return (
						console.log("[A2AClient] Original baseEndpoint:", n),
						(t = n.endsWith("/") ? n + "execute" : n + "/execute"),
						console.log("[A2AClient] Final endpoint before fetch:", t),
						t
					)
				}
				async getStatus() {
					if (!this.isConnected) throw new Error("未连接到智能体")
					try {
						const e = Date.now(),
							t = { jsonrpc: "2.0", id: e, method: "agent.getStatus", params: {} },
							n = await this.getServiceEndpoint(),
							s = await fetch(n, {
								method: "POST",
								headers: { "Content-Type": "application/json", Accept: "application/json" },
								body: JSON.stringify(t),
							})
						if (!s.ok) throw new Error(`HTTP ${s.status}: ${s.statusText}`)
						const i = await s.json()
						if (i.error) throw new Error(`A2A Error ${i.error.code}: ${i.error.message}`)
						return i.result || i
					} catch (e) {
						throw (console.error("[A2AClient] Failed to get status:", e), e)
					}
				}
				removeListener(e) {
					;(this.messageListeners = this.messageListeners.filter((t) => t !== e)),
						(this.statusListeners = this.statusListeners.filter((t) => t !== e))
				}
				getCurrentUserId() {
					try {
						var e
						return (
							(null === (e = window.$store) ||
							void 0 === e ||
							null === (e = e.state) ||
							void 0 === e ||
							null === (e = e.userStore) ||
							void 0 === e ||
							null === (e = e.userInfo) ||
							void 0 === e
								? void 0
								: e.id) || "unknown"
						)
					} catch (t) {
						return "unknown"
					}
				}
				getCurrentAgent() {
					return this.currentAgent
				}
				static async testConnection(e) {
					const t = new i(),
						n = Date.now()
					try {
						await t.connect(e)
						const s = await t.getStatus()
						return await t.disconnect(), { success: !0, status: s, latency: Date.now() - n }
					} catch (s) {
						return await t.disconnect(), { success: !1, error: s.message }
					}
				}
			}
			const r = new i()
			t["default"] = r
		},
	},
])
//# sourceMappingURL=chunk-2d21df69.dc1619bd.js.map
