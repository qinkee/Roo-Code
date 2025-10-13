;(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
	["chunk-c6abf80c"],
	{
		"0395": function (n, e, t) {},
		"50f5": function (n, e, t) {
			"use strict"
			t("0395")
		},
		8628: function (n, e, t) {
			"use strict"
			t.r(e)
			t("0643"), t("a573")
			var a = function () {
					var n = this,
						e = n._self._c
					return e("div", { staticClass: "message-renderer-demo" }, [
						e("h1", [n._v("统一消息渲染组件测试")]),
						e("div", { staticClass: "demo-container" }, [
							e("div", { staticClass: "control-panel" }, [
								e("h3", [n._v("测试控制")]),
								e("div", { staticClass: "control-group" }, [
									e("label", [n._v("消息类型：")]),
									e(
										"select",
										{
											directives: [
												{
													name: "model",
													rawName: "v-model",
													value: n.selectedType,
													expression: "selectedType",
												},
											],
											on: {
												change: [
													function (e) {
														var t = Array.prototype.filter
															.call(e.target.options, function (n) {
																return n.selected
															})
															.map(function (n) {
																var e = "_value" in n ? n._value : n.value
																return e
															})
														n.selectedType = e.target.multiple ? t : t[0]
													},
													n.loadTestMessage,
												],
											},
										},
										[
											e("option", { attrs: { value: "text" } }, [n._v("纯文本")]),
											e("option", { attrs: { value: "markdown" } }, [n._v("Markdown")]),
											e("option", { attrs: { value: "agent" } }, [n._v("智能体消息")]),
											e("option", { attrs: { value: "code" } }, [n._v("代码块")]),
											e("option", { attrs: { value: "math" } }, [n._v("数学公式")]),
											e("option", { attrs: { value: "mermaid" } }, [n._v("Mermaid图表")]),
											e("option", { attrs: { value: "mixed" } }, [n._v("混合内容")]),
											e("option", { attrs: { value: "streaming" } }, [n._v("流式消息")]),
										],
									),
								]),
								e("div", { staticClass: "control-group" }, [
									e("label", [
										e("input", {
											directives: [
												{
													name: "model",
													rawName: "v-model",
													value: n.enableKatex,
													expression: "enableKatex",
												},
											],
											attrs: { type: "checkbox" },
											domProps: {
												checked: Array.isArray(n.enableKatex)
													? n._i(n.enableKatex, null) > -1
													: n.enableKatex,
											},
											on: {
												change: function (e) {
													var t = n.enableKatex,
														a = e.target,
														r = !!a.checked
													if (Array.isArray(t)) {
														var i = null,
															s = n._i(t, i)
														a.checked
															? s < 0 && (n.enableKatex = t.concat([i]))
															: s > -1 &&
																(n.enableKatex = t.slice(0, s).concat(t.slice(s + 1)))
													} else n.enableKatex = r
												},
											},
										}),
										n._v(" 启用数学公式 "),
									]),
								]),
								e("div", { staticClass: "control-group" }, [
									e("label", [
										e("input", {
											directives: [
												{
													name: "model",
													rawName: "v-model",
													value: n.enableMermaid,
													expression: "enableMermaid",
												},
											],
											attrs: { type: "checkbox" },
											domProps: {
												checked: Array.isArray(n.enableMermaid)
													? n._i(n.enableMermaid, null) > -1
													: n.enableMermaid,
											},
											on: {
												change: function (e) {
													var t = n.enableMermaid,
														a = e.target,
														r = !!a.checked
													if (Array.isArray(t)) {
														var i = null,
															s = n._i(t, i)
														a.checked
															? s < 0 && (n.enableMermaid = t.concat([i]))
															: s > -1 &&
																(n.enableMermaid = t.slice(0, s).concat(t.slice(s + 1)))
													} else n.enableMermaid = r
												},
											},
										}),
										n._v(" 启用Mermaid图表 "),
									]),
								]),
								e("div", { staticClass: "control-group" }, [
									e("label", [
										e("input", {
											directives: [
												{
													name: "model",
													rawName: "v-model",
													value: n.enableHighlight,
													expression: "enableHighlight",
												},
											],
											attrs: { type: "checkbox" },
											domProps: {
												checked: Array.isArray(n.enableHighlight)
													? n._i(n.enableHighlight, null) > -1
													: n.enableHighlight,
											},
											on: {
												change: function (e) {
													var t = n.enableHighlight,
														a = e.target,
														r = !!a.checked
													if (Array.isArray(t)) {
														var i = null,
															s = n._i(t, i)
														a.checked
															? s < 0 && (n.enableHighlight = t.concat([i]))
															: s > -1 &&
																(n.enableHighlight = t
																	.slice(0, s)
																	.concat(t.slice(s + 1)))
													} else n.enableHighlight = r
												},
											},
										}),
										n._v(" 启用代码高亮 "),
									]),
								]),
								"streaming" === n.selectedType
									? e("div", { staticClass: "control-group" }, [
											e(
												"button",
												{ attrs: { disabled: n.isStreaming }, on: { click: n.startStreaming } },
												[n._v("开始流式传输")],
											),
											e(
												"button",
												{ attrs: { disabled: !n.isStreaming }, on: { click: n.stopStreaming } },
												[n._v("停止流式传输")],
											),
										])
									: n._e(),
								e("div", { staticClass: "control-group" }, [
									e("label", [n._v("自定义内容：")]),
									e("textarea", {
										directives: [
											{
												name: "model",
												rawName: "v-model",
												value: n.customContent,
												expression: "customContent",
											},
										],
										attrs: { rows: "10", cols: "50" },
										domProps: { value: n.customContent },
										on: {
											input: function (e) {
												e.target.composing || (n.customContent = e.target.value)
											},
										},
									}),
									e("button", { on: { click: n.renderCustomContent } }, [n._v("渲染自定义内容")]),
								]),
							]),
							e("div", { staticClass: "render-panel" }, [
								e("h3", [n._v("渲染结果")]),
								"streaming" !== n.selectedType
									? e(
											"div",
											{ staticClass: "message-wrapper" },
											[
												e("unified-message-renderer", {
													ref: "normalRenderer",
													attrs: {
														message: n.currentMessage,
														"custom-config": n.rendererConfig,
													},
													on: { rendered: n.onRendered },
												}),
											],
											1,
										)
									: e(
											"div",
											{ staticClass: "message-wrapper" },
											[
												e("streaming-renderer", {
													ref: "streamingRenderer",
													attrs: {
														"initial-message": n.currentMessage,
														"custom-config": n.rendererConfig,
													},
													on: {
														"streaming-start": n.onStreamingStart,
														"content-update": n.onContentUpdate,
														"streaming-finish": n.onStreamingFinish,
													},
												}),
											],
											1,
										),
								n.performanceStats
									? e("div", { staticClass: "performance-stats" }, [
											e("h4", [n._v("性能统计")]),
											e("pre", [n._v(n._s(JSON.stringify(n.performanceStats, null, 2)))]),
										])
									: n._e(),
							]),
						]),
					])
				},
				r = [],
				i = (t("14d9"), t("66a5")),
				s = t("7e31")
			const o = {
					text: {
						content: "这是一条普通的文本消息。\n包含换行符。\n还有一个链接：https://example.com",
						type: "text",
					},
					markdown: {
						content:
							"# Markdown 测试\n\n## 二级标题\n\n这是一个包含各种 **Markdown** 语法的测试消息。\n\n### 列表测试\n- 无序列表项 1\n- 无序列表项 2\n  - 嵌套项\n  - 另一个嵌套项\n\n1. 有序列表项 1\n2. 有序列表项 2\n\n### 任务列表\n- [x] 已完成的任务\n- [ ] 未完成的任务\n- [ ] 另一个待办事项\n\n### 引用\n> 这是一段引用文字\n> 可以有多行\n\n### 表格\n| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| A1  | B1  | C1  |\n| A2  | B2  | C2  |\n\n### 链接和图片\n[这是一个链接](https://example.com)\n\n### 分隔线\n---\n\n*斜体文字* 和 **粗体文字** 以及 ***粗斜体***",
						type: "markdown",
						format: "markdown",
					},
					agent: {
						content:
							"我来帮您分析这个问题。\n\n## 分析步骤\n\n1. **问题理解**：首先需要明确问题的核心\n2. **方案设计**：基于需求设计解决方案\n3. **实施计划**：制定具体的实施步骤\n\n```javascript\n// 示例代码\nfunction calculateSum(numbers) {\n  return numbers.reduce((acc, num) => acc + num, 0);\n}\n\nconst result = calculateSum([1, 2, 3, 4, 5]);\nconsole.log('Sum:', result); // Output: 15\n```\n\n### 总结\n以上是我的分析和建议，希望对您有所帮助。",
						type: "AGENT",
						isAgent: !0,
						agentName: "AI助手",
					},
					code: {
						content:
							"这里是代码示例：\n\n```javascript\n// JavaScript 代码高亮测试\nclass MessageRenderer {\n  constructor(options) {\n    this.options = options;\n    this.buffer = '';\n  }\n  \n  render(content) {\n    const rendered = this.processContent(content);\n    return `<div class=\"message\">${rendered}</div>`;\n  }\n  \n  processContent(content) {\n    // 处理内容\n    return content\n      .replace(/</g, '&lt;')\n      .replace(/>/g, '&gt;');\n  }\n}\n\nconst renderer = new MessageRenderer({ markdown: true });\nconsole.log(renderer.render('Hello, World!'));\n```\n\n```python\n# Python 代码示例\ndef fibonacci(n):\n    \"\"\"生成斐波那契数列\"\"\"\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    elif n == 2:\n        return [0, 1]\n    \n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[-1] + fib[-2])\n    \n    return fib\n\nprint(fibonacci(10))\n```\n\n还有行内代码：`const x = 42;`",
						type: "markdown",
						format: "markdown",
					},
					math: {
						content:
							"数学公式测试：\n\n行内公式：$E = mc^2$ 是爱因斯坦的质能方程。\n\n块级公式：\n$$\n\\begin{align}\n\\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} &= \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\\n\\nabla \\cdot \\vec{\\mathbf{E}} &= 4 \\pi \\rho \\\\\n\\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} &= \\vec{\\mathbf{0}} \\\\\n\\nabla \\cdot \\vec{\\mathbf{B}} &= 0\n\\end{align}\n$$\n\n另一个公式：\n$$\nf(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i \\xi x} d\\xi\n$$",
						type: "markdown",
						format: "markdown",
					},
					mermaid: {
						content:
							"流程图示例：\n\n```mermaid\ngraph TD\n    A[开始] --\x3e B{是否登录?}\n    B --\x3e|是| C[进入主页]\n    B --\x3e|否| D[显示登录页]\n    D --\x3e E[输入账号密码]\n    E --\x3e F[验证]\n    F --\x3e|成功| C\n    F --\x3e|失败| D\n    C --\x3e G[结束]\n```\n\n```mermaid\nsequenceDiagram\n    participant 用户\n    participant 前端\n    participant 后端\n    participant 数据库\n    \n    用户->>前端: 发送消息\n    前端->>后端: POST /api/message\n    后端->>数据库: 保存消息\n    数据库--\x3e>后端: 返回结果\n    后端--\x3e>前端: 响应\n    前端--\x3e>用户: 显示结果\n```",
						type: "markdown",
						format: "markdown",
					},
					mixed: {
						content:
							"# 综合内容测试\n\n这是一个包含多种元素的**综合测试**。\n\n## 1. 代码示例\n\n```javascript\nconst greeting = (name) => {\n  return `Hello, ${name}!`;\n};\n```\n\n## 2. 数学公式\n\n牛顿第二定律：$F = ma$\n\n二次方程的解：\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n## 3. 表格\n\n| 功能 | 支持 | 备注 |\n|------|------|------|\n| Markdown | ✅ | 完整支持 |\n| LaTeX | ✅ | KaTeX渲染 |\n| 代码高亮 | ✅ | Prism.js |\n\n## 4. 流程图\n\n```mermaid\ngraph LR\n    A[输入] --\x3e B[处理]\n    B --\x3e C[输出]\n```\n\n## 5. 任务列表\n\n- [x] 实现基础渲染\n- [x] 添加数学公式\n- [ ] 性能优化\n- [ ] 添加主题\n\n> 💡 **提示**：这个组件支持完整的 GFM (GitHub Flavored Markdown) 语法。\n\n---\n\n*测试完成！*",
						type: "AGENT",
						format: "markdown",
					},
					streaming: { content: "", type: "STREAM", streaming: !0 },
				},
				c =
					"# 流式传输测试\n\n这是一个**流式传输**的测试消息，内容会逐步显示。\n\n## 功能特点\n\n1. 支持增量渲染\n2. 智能缓冲优化\n3. 性能监控\n\n```javascript\n// 流式渲染示例\nfunction streamRender(chunks) {\n  chunks.forEach((chunk, index) => {\n    setTimeout(() => {\n      appendContent(chunk);\n    }, index * 100);\n  });\n}\n```\n\n数学公式也能正常渲染：$E = mc^2$\n\n| 测试项 | 结果 |\n|--------|------|\n| 渲染速度 | 优秀 |\n| 内存占用 | 正常 |\n\n> 流式传输让用户体验更加流畅！\n\n测试完成。"
			var l = {
					name: "MessageRendererDemo",
					components: { UnifiedMessageRenderer: i["a"], StreamingRenderer: s["a"] },
					data() {
						return {
							selectedType: "markdown",
							currentMessage: o.markdown,
							customContent: "",
							enableKatex: !0,
							enableMermaid: !0,
							enableHighlight: !0,
							isStreaming: !1,
							streamingChunks: [],
							streamingIndex: 0,
							streamingTimer: null,
							performanceStats: null,
						}
					},
					computed: {
						rendererConfig() {
							return {
								katex: this.enableKatex,
								mermaid: this.enableMermaid,
								highlight: this.enableHighlight,
							}
						},
					},
					methods: {
						loadTestMessage() {
							;(this.currentMessage = o[this.selectedType] || o.text), (this.performanceStats = null)
						},
						renderCustomContent() {
							this.customContent
								? (this.currentMessage = {
										content: this.customContent,
										type: "CUSTOM",
										format: "markdown",
									})
								: alert("请输入自定义内容")
						},
						startStreaming() {
							this.isStreaming ||
								((this.isStreaming = !0),
								(this.streamingChunks = this.splitIntoChunks(c, 10)),
								(this.streamingIndex = 0),
								this.$refs.streamingRenderer.startStreaming(),
								(this.streamingTimer = setInterval(() => {
									if (this.streamingIndex >= this.streamingChunks.length)
										return void this.stopStreaming()
									const n = this.streamingChunks[this.streamingIndex++]
									this.$refs.streamingRenderer.appendChunk(n)
								}, 100)))
						},
						stopStreaming() {
							this.isStreaming &&
								(clearInterval(this.streamingTimer),
								(this.isStreaming = !1),
								this.$refs.streamingRenderer && this.$refs.streamingRenderer.finishStreaming())
						},
						splitIntoChunks(n, e) {
							const t = []
							for (let a = 0; a < n.length; a += e) t.push(n.slice(a, a + e))
							return t
						},
						onRendered() {
							console.log("消息渲染完成")
						},
						onStreamingStart() {
							console.log("流式传输开始"), (this.performanceStats = null)
						},
						onContentUpdate(n) {
							console.log("内容更新，长度:", n.length)
						},
						onStreamingFinish(n) {
							console.log("流式传输完成", n), (this.performanceStats = n.stats)
						},
					},
					mounted() {
						this.loadTestMessage()
					},
					beforeDestroy() {
						this.streamingTimer && clearInterval(this.streamingTimer)
					},
				},
				m = l,
				d = (t("50f5"), t("2877")),
				g = Object(d["a"])(m, a, r, !1, null, "0f33ae9e", null)
			e["default"] = g.exports
		},
	},
])
//# sourceMappingURL=chunk-c6abf80c.18b2183b.js.map
