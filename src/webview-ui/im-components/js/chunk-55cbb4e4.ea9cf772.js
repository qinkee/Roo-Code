;(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
	["chunk-55cbb4e4"],
	{
		"4efe": function (n, e, t) {
			"use strict"
			t.r(e)
			var a = function () {
					var n = this,
						e = n._self._c
					return e("div", { staticClass: "test-mermaid-page" }, [
						e("h2", [n._v("Mermaid 图表测试")]),
						e(
							"div",
							{ staticClass: "test-section" },
							[
								e("h3", [n._v("测试1: 流程图")]),
								e("UnifiedMessageRenderer", { attrs: { content: n.flowChartContent } }),
							],
							1,
						),
						e(
							"div",
							{ staticClass: "test-section" },
							[
								e("h3", [n._v("测试2: 时序图")]),
								e("UnifiedMessageRenderer", { attrs: { content: n.sequenceContent } }),
							],
							1,
						),
						e(
							"div",
							{ staticClass: "test-section" },
							[
								e("h3", [n._v("测试3: 甘特图")]),
								e("UnifiedMessageRenderer", { attrs: { content: n.ganttContent } }),
							],
							1,
						),
						e(
							"div",
							{ staticClass: "test-section" },
							[
								e("h3", [n._v("测试4: 混合内容")]),
								e("UnifiedMessageRenderer", { attrs: { content: n.mixedContent } }),
							],
							1,
						),
					])
				},
				i = [],
				s = t("66a5"),
				r = {
					name: "TestMermaid",
					components: { UnifiedMessageRenderer: s["a"] },
					data() {
						return {
							flowChartContent:
								"## 流程图示例\n\n```mermaid\ngraph TD\n    A[开始] --\x3e B{是否登录?}\n    B --\x3e|是| C[进入系统]\n    B --\x3e|否| D[跳转登录]\n    C --\x3e E[操作完成]\n    D --\x3e F[输入账号密码]\n    F --\x3e B\n```\n\n这是一个简单的登录流程图。",
							sequenceContent:
								"## 时序图示例\n\n```mermaid\nsequenceDiagram\n    participant 用户\n    participant 前端\n    participant 后端\n    participant 数据库\n    \n    用户->>前端: 点击登录\n    前端->>后端: 发送登录请求\n    后端->>数据库: 查询用户信息\n    数据库--\x3e>后端: 返回用户数据\n    后端--\x3e>前端: 返回登录结果\n    前端--\x3e>用户: 显示登录状态\n```",
							ganttContent:
								"## 甘特图示例\n\n```mermaid\ngantt\n    title 项目开发计划\n    dateFormat  YYYY-MM-DD\n    section 设计阶段\n    需求分析        :a1, 2024-01-01, 7d\n    UI设计          :after a1, 5d\n    section 开发阶段\n    前端开发        :2024-01-10, 10d\n    后端开发        :2024-01-12, 8d\n    section 测试阶段\n    单元测试        :2024-01-20, 3d\n    集成测试        :2024-01-23, 5d\n```",
							mixedContent:
								'# Markdown 与 Mermaid 混合测试\n\n这是一段普通的 **Markdown** 文本，包含一些 *斜体* 和 `代码`。\n\n## 1. 列表测试\n\n- 项目一\n- 项目二\n  - 子项目 A\n  - 子项目 B\n- 项目三\n\n## 2. 代码块测试\n\n```javascript\nfunction hello() {\n  console.log("Hello, World!");\n}\n```\n\n## 3. Mermaid 图表\n\n```mermaid\ngraph LR\n    A[输入] --\x3e B[处理]\n    B --\x3e C[输出]\n    B --\x3e D[日志]\n```\n\n## 4. 表格测试\n\n| 功能 | 状态 | 说明 |\n|------|------|------|\n| Markdown | ✅ | 正常渲染 |\n| Mermaid | 🔧 | 测试中 |\n| 代码高亮 | ✅ | 支持多种语言 |\n\n## 5. 数学公式\n\n行内公式：$E = mc^2$\n\n块级公式：\n\n$$\n\\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}\n$$\n',
						}
					},
				},
				d = r,
				c = (t("f003"), t("2877")),
				o = Object(c["a"])(d, a, i, !1, null, "d1c869bc", null)
			e["default"] = o.exports
		},
		abde: function (n, e, t) {},
		f003: function (n, e, t) {
			"use strict"
			t("abde")
		},
	},
])
//# sourceMappingURL=chunk-55cbb4e4.ea9cf772.js.map
