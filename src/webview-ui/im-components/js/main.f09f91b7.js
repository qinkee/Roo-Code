;(function (e) {
	function t(t) {
		for (var i, o, r = t[0], l = t[1], c = t[2], d = 0, h = []; d < r.length; d++)
			(o = r[d]), Object.prototype.hasOwnProperty.call(n, o) && n[o] && h.push(n[o][0]), (n[o] = 0)
		for (i in l) Object.prototype.hasOwnProperty.call(l, i) && (e[i] = l[i])
		u && u(t)
		while (h.length) h.shift()()
		return a.push.apply(a, c || []), s()
	}
	function s() {
		for (var e, t = 0; t < a.length; t++) {
			for (var s = a[t], i = !0, o = 1; o < s.length; o++) {
				var r = s[o]
				0 !== n[r] && (i = !1)
			}
			i && (a.splice(t--, 1), (e = l((l.s = s[0]))))
		}
		return e
	}
	var i = {},
		o = { main: 0 },
		n = { main: 0 },
		a = []
	function r(e) {
		return (
			l.p +
			"js/" +
			({}[e] || e) +
			"." +
			{
				"chunk-2d21df69": "dc1619bd",
				"chunk-55cbb4e4": "ea9cf772",
				"chunk-64ed2b64": "7af92757",
				"chunk-a1723fe6": "be8cd437",
				"chunk-c6abf80c": "18b2183b",
				"chunk-e3523218": "c5e08883",
			}[e] +
			".js"
		)
	}
	function l(t) {
		if (i[t]) return i[t].exports
		var s = (i[t] = { i: t, l: !1, exports: {} })
		return e[t].call(s.exports, s, s.exports, l), (s.l = !0), s.exports
	}
	;(l.e = function (e) {
		var t = [],
			s = {
				"chunk-55cbb4e4": 1,
				"chunk-64ed2b64": 1,
				"chunk-a1723fe6": 1,
				"chunk-c6abf80c": 1,
				"chunk-e3523218": 1,
			}
		o[e]
			? t.push(o[e])
			: 0 !== o[e] &&
				s[e] &&
				t.push(
					(o[e] = new Promise(function (t, s) {
						for (
							var i =
									"css/" +
									({}[e] || e) +
									"." +
									{
										"chunk-2d21df69": "31d6cfe0",
										"chunk-55cbb4e4": "4f0736c9",
										"chunk-64ed2b64": "8c601e18",
										"chunk-a1723fe6": "646e4d02",
										"chunk-c6abf80c": "23eed669",
										"chunk-e3523218": "ecf99e9e",
									}[e] +
									".css",
								n = l.p + i,
								a = document.getElementsByTagName("link"),
								r = 0;
							r < a.length;
							r++
						) {
							var c = a[r],
								d = c.getAttribute("data-href") || c.getAttribute("href")
							if ("stylesheet" === c.rel && (d === i || d === n)) return t()
						}
						var h = document.getElementsByTagName("style")
						for (r = 0; r < h.length; r++) {
							;(c = h[r]), (d = c.getAttribute("data-href"))
							if (d === i || d === n) return t()
						}
						var u = document.createElement("link")
						;(u.rel = "stylesheet"),
							(u.type = "text/css"),
							(u.onload = t),
							(u.onerror = function (t) {
								var i = (t && t.target && t.target.src) || n,
									a = new Error("Loading CSS chunk " + e + " failed.\n(" + i + ")")
								;(a.code = "CSS_CHUNK_LOAD_FAILED"),
									(a.request = i),
									delete o[e],
									u.parentNode.removeChild(u),
									s(a)
							}),
							(u.href = n)
						var m = document.getElementsByTagName("head")[0]
						m.appendChild(u)
					}).then(function () {
						o[e] = 0
					})),
				)
		var i = n[e]
		if (0 !== i)
			if (i) t.push(i[2])
			else {
				var a = new Promise(function (t, s) {
					i = n[e] = [t, s]
				})
				t.push((i[2] = a))
				var c,
					d = document.createElement("script")
				;(d.charset = "utf-8"), (d.timeout = 120), l.nc && d.setAttribute("nonce", l.nc), (d.src = r(e))
				var h = new Error()
				c = function (t) {
					;(d.onerror = d.onload = null), clearTimeout(u)
					var s = n[e]
					if (0 !== s) {
						if (s) {
							var i = t && ("load" === t.type ? "missing" : t.type),
								o = t && t.target && t.target.src
							;(h.message = "Loading chunk " + e + " failed.\n(" + i + ": " + o + ")"),
								(h.name = "ChunkLoadError"),
								(h.type = i),
								(h.request = o),
								s[1](h)
						}
						n[e] = void 0
					}
				}
				var u = setTimeout(function () {
					c({ type: "timeout", target: d })
				}, 12e4)
				;(d.onerror = d.onload = c), document.head.appendChild(d)
			}
		return Promise.all(t)
	}),
		(l.m = e),
		(l.c = i),
		(l.d = function (e, t, s) {
			l.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: s })
		}),
		(l.r = function (e) {
			"undefined" !== typeof Symbol &&
				Symbol.toStringTag &&
				Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
				Object.defineProperty(e, "__esModule", { value: !0 })
		}),
		(l.t = function (e, t) {
			if ((1 & t && (e = l(e)), 8 & t)) return e
			if (4 & t && "object" === typeof e && e && e.__esModule) return e
			var s = Object.create(null)
			if (
				(l.r(s),
				Object.defineProperty(s, "default", { enumerable: !0, value: e }),
				2 & t && "string" != typeof e)
			)
				for (var i in e)
					l.d(
						s,
						i,
						function (t) {
							return e[t]
						}.bind(null, i),
					)
			return s
		}),
		(l.n = function (e) {
			var t =
				e && e.__esModule
					? function () {
							return e["default"]
						}
					: function () {
							return e
						}
			return l.d(t, "a", t), t
		}),
		(l.o = function (e, t) {
			return Object.prototype.hasOwnProperty.call(e, t)
		}),
		(l.p = "/"),
		(l.oe = function (e) {
			throw (console.error(e), e)
		})
	var c = (window["webpackJsonp"] = window["webpackJsonp"] || []),
		d = c.push.bind(c)
	;(c.push = t), (c = c.slice())
	for (var h = 0; h < c.length; h++) t(c[h])
	var u = d
	a.push(["56d7", "chunk-vendors"]), s()
})({
	"0121": function (e, t, s) {},
	"058c": function (e, t, s) {
		e.exports = s.p + "img/24.52e37bff.gif"
	},
	"0738": function (e, t, s) {},
	"0924": function (e, t, s) {
		"use strict"
		s("b9d3")
	},
	"09fe": function (e, t, s) {
		"use strict"
		var i = s("6439"),
			o = s("91f8"),
			n = (s("ebcd"), s("2877")),
			a = Object(n["a"])(o["default"], i["a"], i["b"], !1, null, null, null)
		t["default"] = a.exports
	},
	"0a40": function (e, t, s) {
		"use strict"
		s("a759")
	},
	"0abc": function (e, t, s) {
		e.exports = s.p + "img/8.89742749.gif"
	},
	"0b62": function (e, t, s) {
		"use strict"
		s("1b59")
	},
	"0ca9": function (e, t, s) {
		"use strict"
		s("1140")
	},
	"0fa9": function (e, t, s) {
		"use strict"
		s("9e86")
	},
	1140: function (e, t, s) {},
	1164: function (e, t, s) {},
	"116a": function (e, t, s) {
		"use strict"
		s("6f6a")
	},
	1358: function (e, t, s) {
		"use strict"
		s("8640")
	},
	"14d6": function (e, t, s) {},
	1655: function (e, t, s) {
		"use strict"
		s("4e73")
	},
	1669: function (e, t, s) {
		"use strict"
		s("d4e3")
	},
	1867: function (e, t, s) {
		"use strict"
		s("694c")
	},
	"18c6": function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{
						directives: [{ name: "show", rawName: "v-show", value: e.show, expression: "show" }],
						on: {
							click: function (t) {
								return e.close()
							},
						},
					},
					[
						t(
							"div",
							{ staticClass: "emotion-box", style: { left: e.x + "px", top: e.y + "px" } },
							[
								t("el-scrollbar", { staticStyle: { height: "220px" } }, [
									t(
										"div",
										{ staticClass: "emotion-item-list" },
										e._l(e.$emo.emoTextList, function (s, i) {
											return t("div", {
												key: i,
												ref: "emoItem_" + i,
												refInFor: !0,
												staticClass: "emotion-item",
												on: {
													click: function (t) {
														return e.onClickEmo(s)
													},
												},
											})
										}),
										0,
									),
								]),
							],
							1,
						),
					],
				)
			},
			o = [],
			n = (s("0643"), s("4e3e"), s("e8ff")),
			a = {
				name: "emotion",
				data() {
					return { show: !1, pos: { x: 0, y: 0 }, adapter: null, rendered: !1 }
				},
				mounted() {
					this.adapter = n["a"]
				},
				updated() {
					this.renderEmojis()
				},
				methods: {
					renderEmojis() {
						this.show &&
							!this.rendered &&
							this.$nextTick(() => {
								this.$emo.emoTextList.forEach((e, t) => {
									const s = "emoItem_" + t,
										i = this.$refs[s]
									if (i && i[0])
										try {
											const t = this.$emo.textToImg(e, "emoji-large")
											this.adapter.setInnerHTML(i[0], t)
										} catch (o) {
											console.warn("[Emotion] Failed to render emoji with adapter:", o),
												(i[0].textContent = e)
										}
								}),
									(this.rendered = !0)
							})
					},
					onClickEmo(e) {
						let t = `#${e};`
						this.$emit("emotion", t)
					},
					open(e) {
						;(this.pos = e),
							(this.show = !0),
							(this.rendered = !1),
							this.$nextTick(() => {
								this.renderEmojis()
							})
					},
					close() {
						;(this.show = !1), (this.rendered = !1)
					},
				},
				computed: {
					x() {
						return this.pos.x - 22
					},
					y() {
						return this.pos.y - 234
					},
				},
			},
			r = a,
			l = (s("dcd9"), s("2877")),
			c = Object(l["a"])(r, i, o, !1, null, "8244047c", null)
		t["a"] = c.exports
	},
	"1a05": function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-upload",
					{
						attrs: {
							action: "#",
							"http-request": e.onFileUpload,
							accept: null == e.fileTypes ? "" : e.fileTypes.join(","),
							"show-file-list": !1,
							disabled: e.disabled,
							"before-upload": e.beforeUpload,
							multiple: !0,
						},
					},
					[e._t("default")],
					2,
				)
			},
			o = [],
			n =
				(s("0643"),
				s("fffc"),
				{
					name: "fileUpload",
					data() {
						return { loading: null, uploadHeaders: { accessToken: sessionStorage.getItem("accessToken") } }
					},
					props: {
						action: { type: String, required: !1 },
						fileTypes: { type: Array, default: null },
						maxSize: { type: Number, default: null },
						showLoading: { type: Boolean, default: !1 },
						disabled: { type: Boolean, default: !1 },
					},
					methods: {
						onFileUpload(e) {
							this.showLoading &&
								(this.loading = this.$loading({
									lock: !0,
									text: "正在上传...",
									spinner: "el-icon-loading",
									background: "rgba(0, 0, 0, 0.7)",
								}))
							let t = new FormData()
							t.append("file", e.file),
								this.$http({
									url: this.action,
									data: t,
									method: "post",
									headers: { "Content-Type": "multipart/form-data" },
								})
									.then((t) => {
										this.$emit("success", t, e.file)
									})
									.catch((t) => {
										this.$emit("fail", t, e.file)
									})
									.finally(() => {
										this.loading && this.loading.close()
									})
						},
						beforeUpload(e) {
							if (this.fileTypes && this.fileTypes.length > 0) {
								let t = e.type,
									s = this.fileTypes.find((e) => e.toLowerCase() === t)
								if (void 0 === s)
									return (
										this.$message.error(
											"文件格式错误，请上传以下格式的文件：" + this.fileTypes.join("、"),
										),
										!1
									)
							}
							return this.$emit("before", e), !0
						},
					},
					computed: {
						fileSizeStr() {
							return this.maxSize > 1048576
								? Math.round(this.maxSize / 1024 / 1024) + "M"
								: this.maxSize > 1024
									? Math.round(this.maxSize / 1024) + "KB"
									: this.maxSize + "B"
						},
					},
				}),
			a = n,
			r = s("2877"),
			l = Object(r["a"])(a, i, o, !1, null, null, null)
		t["a"] = l.exports
	},
	"1a8f": function (e, t, s) {
		e.exports = s.p + "img/40.2b8929bd.gif"
	},
	"1b59": function (e, t, s) {},
	"1cae": function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this
				e._self._c
				return e._m(0)
			},
			o = [
				function () {
					var e = this,
						t = e._self._c
					return t("div", { staticClass: "loading-dots" }, [
						t("span", { staticClass: "dot" }),
						t("span", { staticClass: "dot" }),
						t("span", { staticClass: "dot" }),
					])
				},
			],
			n = { name: "LoadingDots" },
			a = n,
			r = (s("db26"), s("2877")),
			l = Object(r["a"])(a, i, o, !1, null, "793015df", null)
		t["a"] = l.exports
	},
	"1fdd": function (e, t, s) {},
	2082: function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-dialog",
					{
						attrs: { title: "选择成员", visible: e.isShow, width: "700px", modal: !1 },
						on: {
							"update:visible": function (t) {
								e.isShow = t
							},
						},
					},
					[
						t("div", { staticClass: "group-member-selector" }, [
							t(
								"div",
								{ staticClass: "left-box" },
								[
									t(
										"el-input",
										{
											attrs: { placeholder: "搜索" },
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
												attrs: { slot: "suffix" },
												slot: "suffix",
											}),
										],
									),
									t("virtual-scroller", {
										staticClass: "scroll-box",
										attrs: { items: e.showMembers },
										scopedSlots: e._u([
											{
												key: "default",
												fn: function ({ item: s }) {
													return [
														t(
															"group-member-item",
															{
																attrs: { member: s },
																nativeOn: {
																	click: function (t) {
																		return e.onClickMember(s)
																	},
																},
															},
															[
																t("el-checkbox", {
																	attrs: { disabled: s.locked },
																	on: {
																		change: function (t) {
																			return e.onChange(s)
																		},
																	},
																	nativeOn: {
																		click: function (e) {
																			e.stopPropagation()
																		},
																	},
																	model: {
																		value: s.checked,
																		callback: function (t) {
																			e.$set(s, "checked", t)
																		},
																		expression: "item.checked",
																	},
																}),
															],
															1,
														),
													]
												},
											},
										]),
									}),
								],
								1,
							),
							t("div", { staticClass: "arrow el-icon-d-arrow-right" }),
							t("div", { staticClass: "right-box" }, [
								t("div", { staticClass: "select-tip" }, [
									e._v(" 已勾选" + e._s(e.checkedMembers.length) + "位成员"),
								]),
								t(
									"div",
									{ staticClass: "checked-member-list" },
									e._l(e.members, function (s) {
										return t(
											"div",
											{ key: s.userId },
											[
												s.checked
													? t("group-member", {
															staticClass: "member-item",
															attrs: { member: s },
														})
													: e._e(),
											],
											1,
										)
									}),
									0,
								),
							]),
						]),
						t(
							"span",
							{ staticClass: "dialog-footer", attrs: { slot: "footer" }, slot: "footer" },
							[
								t(
									"el-button",
									{
										on: {
											click: function (t) {
												return e.close()
											},
										},
									},
									[e._v("取 消")],
								),
								t(
									"el-button",
									{
										attrs: { type: "primary" },
										on: {
											click: function (t) {
												return e.ok()
											},
										},
									},
									[e._v("确 定")],
								),
							],
							1,
						),
					],
				)
			},
			o = [],
			n = (s("14d9"), s("0643"), s("2382"), s("4e3e"), s("7aa4")),
			a = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{ staticClass: "group-member-item", style: { height: e.height + "px" } },
					[
						t(
							"div",
							{ staticClass: "member-avatar" },
							[
								t("head-image", {
									attrs: {
										size: e.headImageSize,
										name: e.member.showNickName,
										url: e.member.headImage,
										online: e.member.online,
									},
								}),
							],
							1,
						),
						t("div", { staticClass: "member-name", style: { "line-height": e.height + "px" } }, [
							t("div", [e._v(e._s(e.member.showNickName))]),
						]),
						e._t("default"),
					],
					2,
				)
			},
			r = [],
			l = s("4036"),
			c = {
				name: "groupMember",
				components: { HeadImage: l["a"] },
				data() {
					return {}
				},
				props: { member: { type: Object, required: !0 }, height: { type: Number, default: 50 } },
				computed: {
					headImageSize() {
						return Math.ceil(0.75 * this.height)
					},
				},
			},
			d = c,
			h = (s("878a"), s("2877")),
			u = Object(h["a"])(d, a, r, !1, null, null, null),
			m = u.exports,
			g = s("2859"),
			p = {
				name: "addGroupMember",
				components: { GroupMemberItem: m, GroupMember: g["a"], VirtualScroller: n["a"] },
				data() {
					return { isShow: !1, searchText: "", maxSize: -1, members: [] }
				},
				props: { groupId: { type: Number } },
				methods: {
					open(e, t, s, i) {
						;(this.maxSize = e), (this.isShow = !0), this.loadGroupMembers(t, s, i)
					},
					loadGroupMembers(e, t, s) {
						this.$http({ url: "/group/members/" + this.groupId, method: "get" }).then((i) => {
							i.forEach((i) => {
								;(i.checked = e.indexOf(i.userId) >= 0),
									(i.locked = t.indexOf(i.userId) >= 0),
									(i.hide = s && s.indexOf(i.userId) >= 0)
							}),
								(this.members = i)
						})
					},
					onClickMember(e) {
						e.locked || (e.checked = !e.checked),
							this.checkedMembers.length > this.maxSize &&
								(this.$message.error(`最多选择${this.maxSize}位成员`), (e.checked = !1))
					},
					onChange(e) {
						this.checkedMembers.length > this.maxSize &&
							(this.$message.error(`最多选择${this.maxSize}位成员`), (e.checked = !1))
					},
					ok() {
						this.$emit("complete", this.checkedMembers), (this.isShow = !1)
					},
					close() {
						this.isShow = !1
					},
				},
				computed: {
					checkedMembers() {
						let e = []
						return (
							this.members.forEach((t) => {
								t.checked && e.push(t)
							}),
							e
						)
					},
					showMembers() {
						return this.members.filter(
							(e) => !e.hide && !e.quit && e.showNickName.includes(this.searchText),
						)
					},
				},
			},
			f = p,
			v = (s("3940"), Object(h["a"])(f, i, o, !1, null, null, null))
		t["a"] = v.exports
	},
	"20e7": function (e, t, s) {
		"use strict"
		s("6798")
	},
	2418: function (e, t, s) {},
	2470: function (e, t, s) {
		"use strict"
		s("e4d1")
	},
	"247f": function (e, t, s) {},
	"25a1": function (e, t) {
		e.exports =
			"data:image/gif;base64,R0lGODlhUABQAPcxANi7Mv/uRLmbKP/rPv/jRodoHf/xUf/mS/LSNf/wTv/dMKKCIv/sU//pSZd5I0UoEf/lNUwuE8KqNFY4FXdYG2BCFoBnJenTQGlKFz0gD+/aR/zfNbCZNP/1V6aLK+TJNtG7PXBSGf/pT+G7K+vGLf/vSv/yVerAKv/hMZJxHv/2Xf/gQ9exKf/ZMf/eOP/aM//oOfTdPP/nQf/iPv/VMP/IK/mxHv/PLP/SLf/PMP/3dP/LK/y7KfiqD+yIEvelDf2/LP/3bf/+4f/6p//92P/ELfWjCP/HMPisEfaiDP/AKv/LHO6NEferC/+3Df++J//DKf/LL/mzIf/KNvu5J/3BLv/HGviuGv/CFvqvEv/7tP/6mvmuD//JMv/7rv/xS/+8Ef/xXf/yc//ZOf/xbP+9Kv/jUP/xZf/dPv/eTf/2ZP/0UPGWDv/tZP/ZPvq2JPy0Gv/uWv/qX//VSPSeC/SZEP+4Iv/ye/23I/y0H//0iv63HvuyE/yoD//4e//9z//0mv/bSP+6Jv/VPP/LO//aQv/tdP/hbPCREf/RPv/bXP/aUv/eVf/mXv/iVv/VQvqwGfSmD+mDFPerF/OWEfaeD//AMP/sbf/ygv/fXP/dZP/QJP/ZTf/ogP/pcf/jXf/mbf/ukP/UT//OPf/4gv/sgv/OR/mhEPy9K//mev/FOP/YWf/iZP25Fv/RQ/68Gf/0kv/DNf/HPf/ldP/mZvCcAfzPLv/uif/qiP/vmf/pZ//WVP/5iv/6of/5kuqDE//8u/WmCP/RTPWoE/u2E//KIf/8xfaoDP/3xv/SN/7EMPKaCv/1vf/QNPvZNP/ypsumJ/OjBf/WNLaSI/PJLfOjC//TM+mCFINkHP/MNPOgBuqCFPKfBP/oVsOeJv/JQ+mCE+qCE//se+mBFP+uDvDgSv+yDf/PHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUVEMUIyMENFQjJEMTFFQzkzMDFFRTlDQ0MyNzBFMjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUVEMUIyMERFQjJEMTFFQzkzMDFFRTlDQ0MyNzBFMjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1RUQxQjIwQUVCMkQxMUVDOTMwMUVFOUNDQzI3MEUyNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1RUQxQjIwQkVCMkQxMUVDOTMwMUVFOUNDQzI3MEUyNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAUyADEALAAAAABQAFAAAAj/AGMIHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmyZcprMGPCdFkxJhNKdCr1yMKzUh1KTHz8ukaTIUxEOsFgsVJs1KpDUEcVYwomi8+hRQ3CrARnqaZcz5AREUK2LJE/zHJpmgqnktCsMbb5oLPHyqpczP6c3Wu2L1q1VvbQeevyFxs+dsMa08uYr+PGi5+t5cPmF0uYPbDswgus8+LPkEN/9gxoFZYeQV/WeZWjkxctsD3LHk3b2OzYXkK5clLHsslfPzSDHUL8tXHctzsjN1689GnfI4EnBtSruvXizJdnb359C6BDVk5B/wcp/Sus8768q+/OvX139enPg3cb8hqlJ7tw3dLDn1f8/+sFKCCAvvjXHy6KgAEUea0kkkonpWAiISkUVmjghQRieKGFEpaSyhx7MPERcDtoMosnhqR4hx8stsihhRu+6OKKNJ6YQx/jZWSfXVCheAkZYgSpw5BEFjmji0YmmSKKhyTYG0dMNKiIJqzQoksbWJ5BhhpcdhnEl0WCKaaXW2qZ5ZVVapJIiBtJJ8oqU37SiBx0hmGnCnjmSeaeeuoZx5lzyqnILsWIpxETT2Tz5iKMOOJoNwz8KWkHfVZqqQl3xhEppI82ukszr4iI0TbBESLMommYoaoIrG6aAKawUv8q66yxvtrqratyMocophS6zah77CCLK7vqmioBByQLgAMYhMDBrWtEK22tDEhgQQUWgIDstsfu6gohUbB5ESJYHKGKqY+ki8YK20oQQQbwZuBAAyXUa+8X9ybQgAcPxPuABMiuK3C6o8hyBBaIXLSjJbFMUfAgEBfiwgofVOAvvNoOEMDGHHcMQr/+TnDBwG5A/HAs4RFVExfFJNqFw8lYM8bMLghwMbwLwKDxzjwPAEEBN2cAMM0mZzOFMpakbNE2dpSrRBEv5xCzNC4oAPTNIWyg89Zcw6CBxTcv8ALVZBt9BBRPQOHErzUpJUja5kYhNQ0tOENB0BUgAMHefPf/fcG7NxdAt8zNmA21IK+svXQrjJfxdA3C3oAD3XffnDcKfWf+d9ApED75DpCjjbi4FJHb1dtoQ2705FdfbIHWmMcuOwJgXzzNJpLnHrrjXSVMkX3EQAKHHY6nHjkO0wTtgQJVyz47NkFDozvoh4/elsoSAc9TsI+HLjkJIVw8wQfMl29++SwAHi821Ey/ux3DU4Z9RNoLjzrU1H8P9AMRUMDC2OcLYAtYgAH+RSAFJ3Df2Z6GBz5wwSrzg4j2kMAHPBQvbqub3AhYMAJb1O2DAgQhNTaYwLnJLWoMzENPKvO7wxxjJ3mwYPcyWLjBlQ2EAMShDU14wuqpcCdNQEQE/yGCCAq+8IE8QEUV8EfDqe1Qhzf0HA/f10AjomZxR5yEDd5ABSUiLWpNfGIUpcjDoy0wiTaw4hVXdsQXbjGJS8RgGMkoxhoa7oxoNGIwXuiDpf3ghdEwghu56EU5mtCJdETkFJeYR0DuMQk5ot8yevBIQVKQkED4IhjLqMhOmhFpSuTiFYYRiUA+km0tdKQptYjJOBpyjpzEIxrTSEpT7lGICrOkNrixS1JeQQqtdOUr74hCUGayi8CcRC15aco+5lKVvRxkMIWpyWoyMpTIpOUymfmDZQxxInMBZC246cstAnOax0wnNrNpTmWWcpfkdOaocrLHcZKznL88JyazydtPfY4SmszkZiRT2YRA2vOe+MxnO/2pTXe+sxrwPCgfv0nQiEo0mpHwZRbdyVGNQvSjAb3oQP2IhHce9KIYzahKVwpSi57UngWVZ5uKWNCX2jSkLs3pTccZU4oqjKYG3alQh2rTidYHqDglqlJfekufHooJukzqUpVqVJJspZJSnWpRjeBNp3pELpMEaFbHitGuXmYu9HyoTqVqy5wQpjBDQcpa57pLIWIFLgKRi1CCchM2+PWvgOXrXvGqEJno9bAxIaxiF8vYxjr2sZCNrGQnS9nKWvaymE1JQAAAIfkEBRkAFAAsGAAeAB8ADAAABoRAinBILBqFqmPRYFI6TUzGslFKWA3OaZV6GHK31awQzOAKZ4RvYO0crN/ctGuOltlh+Lx7z9fL6SR0MxB6hYZ+gBQFgXSEADGEkZIQCACScyQpQg4vCp5zC2IUnJ+eDkMRlp0vLAWiFCyrLSwRRBMSJyMCD68UDwIjIxITRw+8vajHQkEAIfkEBTIAIwAsGAAeAB8ADAAABm7AkXBILBqFnWMxkVA6DU3REuDAhDhSJ5EhsVQsIMJQEsmYM46GVtjwPM4PifBTgZtBTyHoDZ9cRgJ2ZgsjA04QBYIZEgqJgiEbWhp1goQUihUIkmWCBUKYayOcdkOKFqEjikSCqKmkRmatqxlEQQAh+QQFGQAUACwYAB4AHwAMAAAGhECKcEgsGoWqY9FgUjpNTMayUUpYDc5plXoYcrfVrBDM4ApnhG9g7Rys39y0a46W2WH4vHvP18vpJHQzEHqFhn6AFAWBdIQAMYSRkhAIAJJzJClCDi8KnnMLYhScn54OQxGWnS8sBaIULKstLBFEExInIwIPrxQPAiMjEhNHD7y9qMdCQQAh+QQFMgAjACwYAB4AHwAMAAAGbsCRcEgsGoWdYzGRUDoNTdES4MCEOFInkSGxVCwgwlASyZgzjoZW2PA8zg+J8FOBm0FPIegNn1xGAnZmCyMDThAFghkSComCIRtaGnWChBSKFQiSZYIFQphrI5x2Q4oWoSOKRIKoqaRGZq2rGURBADs="
	},
	"26b2": function (e, t, s) {
		"use strict"
		s("38d6")
	},
	2859: function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{ staticClass: "group-member" },
					[
						t(
							"head-image",
							{
								attrs: {
									id: e.member.userId,
									name: e.member.showNickName,
									url: e.member.headImage,
									size: 38,
									online: e.member.online,
								},
							},
							[
								e.showDel
									? t("div", {
											staticClass: "btn-kick el-icon-error",
											on: {
												click: function (t) {
													return t.stopPropagation(), e.onDelete()
												},
											},
										})
									: e._e(),
							],
						),
						t("div", { staticClass: "member-name" }, [e._v(e._s(e.member.showNickName))]),
					],
					1,
				)
			},
			o = [],
			n = s("4036"),
			a = {
				name: "groupMember",
				components: { HeadImage: n["a"] },
				data() {
					return {}
				},
				props: { member: { type: Object, required: !0 }, showDel: { type: Boolean, default: !1 } },
				methods: {
					onDelete() {
						this.$emit("del", this.member)
					},
				},
			},
			r = a,
			l = (s("8697"), s("2877")),
			c = Object(l["a"])(r, i, o, !1, null, null, null)
		t["a"] = c.exports
	},
	"28f3": function (e, t, s) {
		e.exports = s.p + "img/5.11e27819.gif"
	},
	"29c2": function (e, t, s) {},
	"2a24": function (e, t, s) {
		"use strict"
		s("36c3")
	},
	"2e64": function (e, t, s) {
		"use strict"
		s("4561")
	},
	"309f": function (e, t, s) {},
	"30af": function (e, t, s) {},
	"32c6": function (e, t, s) {
		e.exports = s.p + "img/19.89260df5.gif"
	},
	"348f": function (e, t, s) {
		"use strict"
		s("309f")
	},
	"34cb": function (e, t, s) {
		e.exports = s.p + "img/2.302b51b8.gif"
	},
	"35b7": function (e, t, s) {
		"use strict"
		s("aa2e")
	},
	"36a4": function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-scrollbar",
					{
						directives: [
							{
								name: "show",
								rawName: "v-show",
								value: e.show && e.showMembers.length,
								expression: "show && showMembers.length",
							},
						],
						ref: "scrollBox",
						staticClass: "group-member-choose",
						style: { left: e.pos.x + "px", top: e.pos.y - 300 + "px" },
					},
					e._l(e.showMembers, function (s, i) {
						return t(
							"div",
							{ key: s.id },
							[
								t("chat-group-member", {
									attrs: { member: s, height: 40, active: e.activeIdx == i },
									nativeOn: {
										click: function (t) {
											return e.onSelectMember(s)
										},
									},
								}),
							],
							1,
						)
					}),
					0,
				)
			},
			o = [],
			n = (s("14d9"), s("0643"), s("4e3e"), s("c0b2")),
			a = {
				name: "chatAtBox",
				components: { ChatGroupMember: n["a"] },
				props: {
					searchText: { type: String, default: "" },
					ownerId: { type: Number },
					members: { type: Array },
					targetUserId: { type: Number, default: null },
					enableAgents: { type: Boolean, default: !0 },
				},
				data() {
					return { show: !1, pos: { x: 0, y: 0 }, activeIdx: 0, showMembers: [] }
				},
				methods: {
					init() {
						;(this.$refs.scrollBox.wrap.scrollTop = 0), (this.showMembers = [])
						let e = this.$store.state.userStore.userInfo.id,
							t = "全体成员"
						this.ownerId == e &&
							t.startsWith(this.searchText) &&
							this.showMembers.push({ userId: -1, showNickName: t }),
							this.members.forEach((t) => {
								this.showMembers.length > 100 ||
									(t.userId != e &&
										!t.quit &&
										t.showNickName.startsWith(this.searchText) &&
										this.showMembers.push(t))
							}),
							(this.activeIdx = this.showMembers.length > 0 ? 0 : -1)
					},
					open(e) {
						;(this.show = !0), (this.pos = e), this.init()
					},
					close() {
						this.show = !1
					},
					moveUp() {
						this.activeIdx > 0 && (this.activeIdx--, this.scrollToActive())
					},
					moveDown() {
						this.activeIdx < this.showMembers.length - 1 && (this.activeIdx++, this.scrollToActive())
					},
					select() {
						this.activeIdx >= 0 && this.onSelectMember(this.showMembers[this.activeIdx]), this.close()
					},
					scrollToActive() {
						35 * this.activeIdx - this.$refs.scrollBox.wrap.clientHeight >
							this.$refs.scrollBox.wrap.scrollTop &&
							((this.$refs.scrollBox.wrap.scrollTop += 140),
							this.$refs.scrollBox.wrap.scrollTop > this.$refs.scrollBox.wrap.scrollHeight &&
								(this.$refs.scrollBox.wrap.scrollTop = this.$refs.scrollBox.wrap.scrollHeight)),
							35 * this.activeIdx < this.$refs.scrollBox.wrap.scrollTop &&
								((this.$refs.scrollBox.wrap.scrollTop -= 140),
								this.$refs.scrollBox.wrap.scrollTop < 0 && (this.$refs.scrollBox.wrap.scrollTop = 0))
					},
					onSelectMember(e) {
						this.$emit("select", e), (this.show = !1)
					},
				},
				computed: {
					isOwner() {
						return this.$store.state.userStore.userInfo.id == this.ownerId
					},
				},
				watch: {
					searchText: {
						handler(e, t) {
							this.init()
						},
					},
				},
			},
			r = a,
			l = (s("bf36"), s("2877")),
			c = Object(l["a"])(r, i, o, !1, null, "3bf3de43", null)
		t["a"] = c.exports
	},
	"36a47": function (e, t, s) {
		e.exports = s.p + "img/27.65ed7407.gif"
	},
	"36c3": function (e, t, s) {},
	3708: function (e, t, s) {
		"use strict"
		s("0738")
	},
	3748: function (e, t, s) {},
	"37bf": function (e, t, s) {
		e.exports = s.p + "img/47.b4ac667a.gif"
	},
	3854: function (e, t, s) {
		e.exports = s.p + "img/25.6f582617.gif"
	},
	"38c4": function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{ staticClass: "chat-msg-item" },
					[
						e.msgInfo.type == e.$enums.MESSAGE_TYPE.TIP_TIME
							? t("div", { staticClass: "chat-msg-tip" }, [
									e._v(" " + e._s(e.$date.toTimeText(e.msgInfo.sendTime)) + " "),
								])
							: e.isNormal || e.msgInfo.type == e.$enums.MESSAGE_TYPE.TIP_TEXT
								? t("div", { staticClass: "chat-msg-normal", class: { "chat-msg-mine": e.mine } }, [
										e.isTipMessage
											? e._e()
											: t(
													"div",
													{ staticClass: "head-image" },
													[
														t("head-image", {
															attrs: {
																name: e.showName,
																size: 38,
																url: e.headImage,
																id: parseInt(e.msgInfo.sendId) || 0,
															},
														}),
													],
													1,
												),
										t("div", { staticClass: "chat-msg-content" }, [
											t(
												"div",
												{
													directives: [
														{
															name: "show",
															rawName: "v-show",
															value:
																1 == e.mode &&
																e.msgInfo.groupId &&
																!e.msgInfo.selfSend &&
																!e.isTipMessage,
															expression:
																"mode == 1 && msgInfo.groupId && !msgInfo.selfSend && !isTipMessage",
														},
													],
													staticClass: "chat-msg-top",
												},
												[t("span", [e._v(e._s(e.showName))])],
											),
											t(
												"div",
												{
													directives: [
														{
															name: "show",
															rawName: "v-show",
															value: 2 == e.mode && !e.isTipMessage,
															expression: "mode == 2 && !isTipMessage",
														},
													],
													staticClass: "chat-msg-top",
												},
												[
													t("span", [e._v(e._s(e.showName))]),
													t("span", [e._v(e._s(e.$date.toTimeText(e.msgInfo.sendTime)))]),
												],
											),
											t(
												"div",
												{
													staticClass: "chat-msg-bottom",
													on: {
														contextmenu: function (t) {
															return e.handleContextMenu(t)
														},
													},
												},
												[
													t("div", { ref: "chatMsgBox" }, [
														e.msgInfo.isLoading
															? t(
																	"div",
																	{ staticClass: "chat-msg-text" },
																	[t("loading-dots")],
																	1,
																)
															: !e.isAgentMessage ||
																  (!e.msgInfo.content && e.msgInfo.streaming)
																? e.isAgentMessage &&
																	e.msgInfo.streaming &&
																	!e.msgInfo.content
																	? t(
																			"div",
																			{ staticClass: "chat-msg-text" },
																			[t("loading-dots")],
																			1,
																		)
																	: e.msgInfo.type == e.$enums.MESSAGE_TYPE.TEXT
																		? t("span", {
																				ref: "messageText",
																				staticClass: "chat-msg-text",
																			})
																		: e._e()
																: t(
																		"div",
																		{
																			staticClass: "chat-msg-text",
																			class: {
																				"agent-error-message":
																					"error" === e.msgInfo.type,
																			},
																		},
																		[
																			t("unified-message-renderer", {
																				attrs: {
																					message: e.agentMessageObject,
																					"force-format": "markdown",
																					"show-enhancements": !1,
																				},
																				on: { rendered: e.onMessageRendered },
																			}),
																		],
																		1,
																	),
														e.msgInfo.type == e.$enums.MESSAGE_TYPE.TIP_TEXT
															? t("span", { staticClass: "chat-msg-text" }, [
																	e._v(e._s(e.msgInfo.content)),
																])
															: e._e(),
														e.msgInfo.type == e.$enums.MESSAGE_TYPE.IMAGE
															? t("div", { staticClass: "chat-msg-image" }, [
																	t(
																		"div",
																		{
																			directives: [
																				{
																					name: "loading",
																					rawName: "v-loading",
																					value: e.loading,
																					expression: "loading",
																				},
																			],
																			staticClass: "img-load-box",
																			attrs: {
																				"element-loading-text": "上传中..",
																				"element-loading-background":
																					"rgba(0, 0, 0, 0.4)",
																			},
																		},
																		[
																			t("img", {
																				staticClass: "send-image",
																				attrs: {
																					src: JSON.parse(e.msgInfo.content)
																						.thumbUrl,
																					loading: "lazy",
																				},
																				on: {
																					click: function (t) {
																						return e.showFullImageBox()
																					},
																				},
																			}),
																		],
																	),
																	t("span", {
																		directives: [
																			{
																				name: "show",
																				rawName: "v-show",
																				value: e.loadFail,
																				expression: "loadFail",
																			},
																		],
																		staticClass: "send-fail el-icon-warning",
																		attrs: { title: "发送失败" },
																		on: { click: e.onSendFail },
																	}),
																])
															: e._e(),
														e.msgInfo.type == e.$enums.MESSAGE_TYPE.FILE
															? t("div", { staticClass: "chat-msg-file" }, [
																	t(
																		"div",
																		{
																			directives: [
																				{
																					name: "loading",
																					rawName: "v-loading",
																					value: e.loading,
																					expression: "loading",
																				},
																			],
																			staticClass: "chat-file-box",
																		},
																		[
																			t(
																				"div",
																				{ staticClass: "chat-file-info" },
																				[
																					t(
																						"el-link",
																						{
																							staticClass:
																								"chat-file-name",
																							attrs: {
																								underline: !0,
																								target: "_blank",
																								type: "primary",
																								href: e.data.url,
																								download: e.data.name,
																							},
																							on: {
																								click: e.onFileDownloadClick,
																							},
																						},
																						[e._v(e._s(e.data.name))],
																					),
																					t(
																						"div",
																						{
																							staticClass:
																								"chat-file-size",
																						},
																						[e._v(e._s(e.fileSize))],
																					),
																				],
																				1,
																			),
																			t(
																				"div",
																				{ staticClass: "chat-file-icon" },
																				[
																					t("FileIcon", {
																						attrs: {
																							fileName: e.data.name,
																							size: 44,
																						},
																					}),
																				],
																				1,
																			),
																		],
																	),
																	t("span", {
																		directives: [
																			{
																				name: "show",
																				rawName: "v-show",
																				value: e.loadFail,
																				expression: "loadFail",
																			},
																		],
																		staticClass: "send-fail el-icon-warning",
																		attrs: { title: "发送失败" },
																		on: { click: e.onSendFail },
																	}),
																])
															: e._e(),
													]),
													e.msgInfo.type == e.$enums.MESSAGE_TYPE.AUDIO
														? t(
																"div",
																{
																	staticClass: "chat-msg-voice",
																	on: {
																		click: function (t) {
																			return e.onPlayVoice()
																		},
																	},
																},
																[
																	t("audio", {
																		attrs: {
																			controls: "",
																			src: JSON.parse(e.msgInfo.content).url,
																		},
																	}),
																],
															)
														: e._e(),
													e.isAction
														? t("div", { staticClass: "chat-action chat-msg-text" }, [
																e.msgInfo.type == e.$enums.MESSAGE_TYPE.ACT_RT_VOICE
																	? t("span", {
																			staticClass: "iconfont icon-chat-voice",
																			attrs: { title: "重新呼叫" },
																			on: {
																				click: function (t) {
																					return e.$emit("call")
																				},
																			},
																		})
																	: e._e(),
																e.msgInfo.type == e.$enums.MESSAGE_TYPE.ACT_RT_VIDEO
																	? t("span", {
																			staticClass: "iconfont icon-chat-video",
																			attrs: { title: "重新呼叫" },
																			on: {
																				click: function (t) {
																					return e.$emit("call")
																				},
																			},
																		})
																	: e._e(),
																t("span", [e._v(e._s(e.msgInfo.content))]),
															])
														: e._e(),
													e.isAction
														? e._e()
														: t("div", { staticClass: "chat-msg-status" }, [
																t(
																	"span",
																	{
																		directives: [
																			{
																				name: "show",
																				rawName: "v-show",
																				value:
																					e.msgInfo.selfSend &&
																					!e.msgInfo.groupId &&
																					e.msgInfo.status ==
																						e.$enums.MESSAGE_STATUS.READED,
																				expression:
																					"msgInfo.selfSend && !msgInfo.groupId\n\t\t\t\t\t\t&& msgInfo.status == $enums.MESSAGE_STATUS.READED",
																			},
																		],
																		staticClass: "chat-readed",
																	},
																	[e._v("已读")],
																),
																t(
																	"span",
																	{
																		directives: [
																			{
																				name: "show",
																				rawName: "v-show",
																				value:
																					e.msgInfo.selfSend &&
																					!e.msgInfo.groupId &&
																					e.msgInfo.status !=
																						e.$enums.MESSAGE_STATUS.READED,
																				expression:
																					"msgInfo.selfSend && !msgInfo.groupId\n\t\t\t\t\t\t&& msgInfo.status != $enums.MESSAGE_STATUS.READED",
																			},
																		],
																		staticClass: "chat-unread",
																	},
																	[e._v("未读")],
																),
															]),
													t(
														"div",
														{
															directives: [
																{
																	name: "show",
																	rawName: "v-show",
																	value: e.msgInfo.receipt,
																	expression: "msgInfo.receipt",
																},
															],
															staticClass: "chat-receipt",
															on: { click: e.onShowReadedBox },
														},
														[
															e.msgInfo.receiptOk
																? t("span", {
																		staticClass: "icon iconfont icon-ok",
																		attrs: { title: "全体已读" },
																	})
																: t("span", [
																		e._v(e._s(e.msgInfo.readedCount) + "人已读"),
																	]),
														],
													),
												],
											),
										]),
									])
								: e._e(),
						t("right-menu", {
							directives: [
								{
									name: "show",
									rawName: "v-show",
									value: e.menu && e.rightMenu.show,
									expression: "menu && rightMenu.show",
								},
							],
							attrs: { pos: e.rightMenu.pos, items: e.menuItems },
							on: {
								close: function (t) {
									e.rightMenu.show = !1
								},
								select: e.onSelectMenu,
							},
						}),
						t("chat-group-readed", {
							ref: "chatGroupReadedBox",
							attrs: { msgInfo: e.msgInfo, groupMembers: e.groupMembers },
						}),
					],
					1,
				)
			},
			o = [],
			n =
				(s("14d9"),
				s("2c66"),
				s("249d"),
				s("40e9"),
				s("907a"),
				s("986a"),
				s("1d02"),
				s("3c5d"),
				s("6ce5"),
				s("2834"),
				s("4ea1"),
				s("88a7"),
				s("271a"),
				s("5494"),
				s("4036")),
			a = s("3f51"),
			r = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{ directives: [{ name: "show", rawName: "v-show", value: e.show, expression: "show" }] },
					[
						t(
							"div",
							{
								staticClass: "chat-group-readed-mask",
								on: {
									click: function (t) {
										return t.target !== t.currentTarget ? null : e.close()
									},
								},
							},
							[
								t(
									"div",
									{
										staticClass: "chat-group-readed",
										style: { left: e.pos.x + "px", top: e.pos.y + "px" },
										on: {
											click: function (e) {
												e.preventDefault()
											},
										},
									},
									[
										t(
											"el-tabs",
											{ attrs: { type: "border-card", stretch: !0 } },
											[
												t(
													"el-tab-pane",
													{ attrs: { label: `已读(${e.readedMembers.length})` } },
													[
														t("virtual-scroller", {
															staticClass: "scroll-box",
															attrs: { items: e.readedMembers },
															scopedSlots: e._u([
																{
																	key: "default",
																	fn: function ({ item: e }) {
																		return [
																			t("chat-group-member", {
																				attrs: { member: e },
																			}),
																		]
																	},
																},
															]),
														}),
													],
													1,
												),
												t(
													"el-tab-pane",
													{ attrs: { label: `未读(${e.unreadMembers.length})` } },
													[
														t("virtual-scroller", {
															staticClass: "scroll-box",
															attrs: { items: e.unreadMembers },
															scopedSlots: e._u([
																{
																	key: "default",
																	fn: function ({ item: e }) {
																		return [
																			t("chat-group-member", {
																				attrs: { member: e },
																			}),
																		]
																	},
																},
															]),
														}),
													],
													1,
												),
											],
											1,
										),
										t(
											"div",
											{
												directives: [
													{
														name: "show",
														rawName: "v-show",
														value: e.msgInfo.selfSend,
														expression: "msgInfo.selfSend",
													},
												],
												staticClass: "arrow-right",
												style: { top: e.pos.arrowY + "px" },
											},
											[t("div", { staticClass: "arrow-right-inner" })],
										),
										t(
											"div",
											{
												directives: [
													{
														name: "show",
														rawName: "v-show",
														value: !e.msgInfo.selfSend,
														expression: "!msgInfo.selfSend",
													},
												],
												staticClass: "arrow-left",
												style: { top: e.pos.arrowY + "px" },
											},
											[t("div", { staticClass: "arrow-left-inner" })],
										),
									],
									1,
								),
							],
						),
					],
				)
			},
			l = [],
			c = (s("0643"), s("fffc"), s("4e3e"), s("7aa4")),
			d = s("c0b2"),
			h = {
				name: "chatGroupReaded",
				components: { ChatGroupMember: d["a"], VirtualScroller: c["a"] },
				data() {
					return { show: !1, pos: { x: 0, y: 0, arrowY: 0 }, readedMembers: [], unreadMembers: [] }
				},
				props: { groupMembers: { type: Array }, msgInfo: { type: Object } },
				methods: {
					close() {
						this.show = !1
					},
					open(e) {
						;(this.show = !0),
							(this.pos.arrowY = 200),
							this.msgInfo.selfSend ? (this.pos.x = e.left - 310) : (this.pos.x = e.right + 20),
							(this.pos.y = e.top + e.height / 2 - 215),
							this.pos.y < 0 && ((this.pos.arrowY += this.pos.y), (this.pos.y = 0)),
							this.loadReadedUser()
					},
					loadReadedUser() {
						;(this.readedMembers = []),
							(this.unreadMembers = []),
							this.groupMembers &&
								0 !== this.groupMembers.length &&
								this.$http({
									url: "/message/group/findReadedUsers",
									method: "get",
									params: { groupId: this.msgInfo.groupId, messageId: this.msgInfo.id },
								}).then((e) => {
									this.groupMembers.forEach((t) => {
										t.userId == this.msgInfo.sendId ||
											t.quit ||
											(e.find((e) => t.userId == e)
												? this.readedMembers.push(t)
												: this.unreadMembers.push(t))
									})
									let t = {
											id: this.msgInfo.id,
											groupId: this.msgInfo.groupId,
											readedCount: this.readedMembers.length,
										},
										s = { type: "GROUP", targetId: this.msgInfo.groupId }
									this.$store.commit("updateMessage", [t, s])
								})
					},
				},
			},
			u = h,
			m = (s("0b62"), s("2877")),
			g = Object(m["a"])(u, r, l, !1, null, null, null),
			p = g.exports,
			f = function () {
				var e = this,
					t = e._self._c
				return t("div", { staticClass: "file-icon", style: { width: e.size + "px", height: e.size + "px" } }, [
					"pdf" === e.fileType
						? t("svg", { attrs: { viewBox: "0 0 48 48", width: "100%", height: "100%" } }, [
								t("rect", { attrs: { width: "48", height: "48", rx: "4", fill: "#E53E3E" } }),
								t("path", {
									attrs: {
										d: "M12 32h24M12 36h16",
										stroke: "white",
										"stroke-width": "2",
										"stroke-linecap": "round",
									},
								}),
								t(
									"text",
									{
										attrs: {
											x: "24",
											y: "22",
											"text-anchor": "middle",
											fill: "white",
											"font-size": "10",
											"font-weight": "bold",
										},
									},
									[e._v("PDF")],
								),
							])
						: "word" === e.fileType
							? t("svg", { attrs: { viewBox: "0 0 48 48", width: "100%", height: "100%" } }, [
									t("rect", { attrs: { width: "48", height: "48", rx: "4", fill: "#2B6CB0" } }),
									t("path", {
										attrs: {
											d: "M12 32h24M12 36h20M12 28h18",
											stroke: "white",
											"stroke-width": "1.5",
											"stroke-linecap": "round",
										},
									}),
									t(
										"text",
										{
											attrs: {
												x: "24",
												y: "20",
												"text-anchor": "middle",
												fill: "white",
												"font-size": "8",
												"font-weight": "bold",
											},
										},
										[e._v("DOC")],
									),
								])
							: "excel" === e.fileType
								? t("svg", { attrs: { viewBox: "0 0 48 48", width: "100%", height: "100%" } }, [
										t("rect", { attrs: { width: "48", height: "48", rx: "4", fill: "#38A169" } }),
										t("path", {
											attrs: {
												d: "M14 16h20M14 20h20M14 24h20M14 28h20M14 32h20",
												stroke: "white",
												"stroke-width": "1.5",
											},
										}),
										t("path", {
											attrs: { d: "M20 14v20M28 14v20", stroke: "white", "stroke-width": "1.5" },
										}),
										t(
											"text",
											{
												attrs: {
													x: "24",
													y: "40",
													"text-anchor": "middle",
													fill: "white",
													"font-size": "7",
													"font-weight": "bold",
												},
											},
											[e._v("XLS")],
										),
									])
								: "powerpoint" === e.fileType
									? t("svg", { attrs: { viewBox: "0 0 48 48", width: "100%", height: "100%" } }, [
											t("rect", {
												attrs: { width: "48", height: "48", rx: "4", fill: "#D69E2E" },
											}),
											t("rect", {
												attrs: {
													x: "14",
													y: "16",
													width: "20",
													height: "12",
													rx: "2",
													stroke: "white",
													"stroke-width": "1.5",
													fill: "none",
												},
											}),
											t("circle", { attrs: { cx: "18", cy: "22", r: "1", fill: "white" } }),
											t(
												"text",
												{
													attrs: {
														x: "24",
														y: "36",
														"text-anchor": "middle",
														fill: "white",
														"font-size": "7",
														"font-weight": "bold",
													},
												},
												[e._v("PPT")],
											),
										])
									: "image" === e.fileType
										? t("svg", { attrs: { viewBox: "0 0 48 48", width: "100%", height: "100%" } }, [
												t("rect", {
													attrs: { width: "48", height: "48", rx: "4", fill: "#805AD5" },
												}),
												t("rect", {
													attrs: {
														x: "12",
														y: "14",
														width: "24",
														height: "18",
														rx: "2",
														stroke: "white",
														"stroke-width": "1.5",
														fill: "none",
													},
												}),
												t("circle", {
													attrs: {
														cx: "18",
														cy: "20",
														r: "2",
														stroke: "white",
														"stroke-width": "1.5",
														fill: "none",
													},
												}),
												t("path", {
													attrs: {
														d: "M12 28l6-6 4 4 8-8 6 6v4",
														stroke: "white",
														"stroke-width": "1.5",
														fill: "none",
													},
												}),
												t(
													"text",
													{
														attrs: {
															x: "24",
															y: "40",
															"text-anchor": "middle",
															fill: "white",
															"font-size": "7",
															"font-weight": "bold",
														},
													},
													[e._v("IMG")],
												),
											])
										: "video" === e.fileType
											? t(
													"svg",
													{ attrs: { viewBox: "0 0 48 48", width: "100%", height: "100%" } },
													[
														t("rect", {
															attrs: {
																width: "48",
																height: "48",
																rx: "4",
																fill: "#E53E3E",
															},
														}),
														t("rect", {
															attrs: {
																x: "10",
																y: "16",
																width: "28",
																height: "16",
																rx: "2",
																stroke: "white",
																"stroke-width": "1.5",
																fill: "none",
															},
														}),
														t("polygon", {
															attrs: { points: "20,20 20,28 26,24", fill: "white" },
														}),
														t(
															"text",
															{
																attrs: {
																	x: "24",
																	y: "40",
																	"text-anchor": "middle",
																	fill: "white",
																	"font-size": "7",
																	"font-weight": "bold",
																},
															},
															[e._v("MP4")],
														),
													],
												)
											: "audio" === e.fileType
												? t(
														"svg",
														{
															attrs: {
																viewBox: "0 0 48 48",
																width: "100%",
																height: "100%",
															},
														},
														[
															t("rect", {
																attrs: {
																	width: "48",
																	height: "48",
																	rx: "4",
																	fill: "#38A169",
																},
															}),
															t("path", {
																attrs: {
																	d: "M20 14v20M24 10v28M28 16v16M32 18v12M16 18v12",
																	stroke: "white",
																	"stroke-width": "2",
																	"stroke-linecap": "round",
																},
															}),
															t(
																"text",
																{
																	attrs: {
																		x: "24",
																		y: "40",
																		"text-anchor": "middle",
																		fill: "white",
																		"font-size": "7",
																		"font-weight": "bold",
																	},
																},
																[e._v("MP3")],
															),
														],
													)
												: "archive" === e.fileType
													? t(
															"svg",
															{
																attrs: {
																	viewBox: "0 0 48 48",
																	width: "100%",
																	height: "100%",
																},
															},
															[
																t("rect", {
																	attrs: {
																		width: "48",
																		height: "48",
																		rx: "4",
																		fill: "#744210",
																	},
																}),
																t("rect", {
																	attrs: {
																		x: "14",
																		y: "12",
																		width: "20",
																		height: "24",
																		rx: "2",
																		stroke: "white",
																		"stroke-width": "1.5",
																		fill: "none",
																	},
																}),
																t("path", {
																	attrs: {
																		d: "M18 16h12M18 20h12M18 24h12M18 28h12",
																		stroke: "white",
																		"stroke-width": "1",
																	},
																}),
																t(
																	"text",
																	{
																		attrs: {
																			x: "24",
																			y: "42",
																			"text-anchor": "middle",
																			fill: "white",
																			"font-size": "7",
																			"font-weight": "bold",
																		},
																	},
																	[e._v("ZIP")],
																),
															],
														)
													: "code" === e.fileType
														? t(
																"svg",
																{
																	attrs: {
																		viewBox: "0 0 48 48",
																		width: "100%",
																		height: "100%",
																	},
																},
																[
																	t("rect", {
																		attrs: {
																			width: "48",
																			height: "48",
																			rx: "4",
																			fill: "#319795",
																		},
																	}),
																	t("path", {
																		attrs: {
																			d: "M16 18l-4 6 4 6M32 18l4 6-4 6M22 14l-4 20",
																			stroke: "white",
																			"stroke-width": "2",
																			"stroke-linecap": "round",
																			"stroke-linejoin": "round",
																		},
																	}),
																	t(
																		"text",
																		{
																			attrs: {
																				x: "24",
																				y: "40",
																				"text-anchor": "middle",
																				fill: "white",
																				"font-size": "6",
																				"font-weight": "bold",
																			},
																		},
																		[e._v("CODE")],
																	),
																],
															)
														: "text" === e.fileType
															? t(
																	"svg",
																	{
																		attrs: {
																			viewBox: "0 0 48 48",
																			width: "100%",
																			height: "100%",
																		},
																	},
																	[
																		t("rect", {
																			attrs: {
																				width: "48",
																				height: "48",
																				rx: "4",
																				fill: "#4A5568",
																			},
																		}),
																		t("path", {
																			attrs: {
																				d: "M14 16h20M14 20h22M14 24h18M14 28h20M14 32h16",
																				stroke: "white",
																				"stroke-width": "1.5",
																				"stroke-linecap": "round",
																			},
																		}),
																		t(
																			"text",
																			{
																				attrs: {
																					x: "24",
																					y: "40",
																					"text-anchor": "middle",
																					fill: "white",
																					"font-size": "7",
																					"font-weight": "bold",
																				},
																			},
																			[e._v("TXT")],
																		),
																	],
																)
															: "executable" === e.fileType
																? t(
																		"svg",
																		{
																			attrs: {
																				viewBox: "0 0 48 48",
																				width: "100%",
																				height: "100%",
																			},
																		},
																		[
																			t("rect", {
																				attrs: {
																					width: "48",
																					height: "48",
																					rx: "4",
																					fill: "#2D3748",
																				},
																			}),
																			t("rect", {
																				attrs: {
																					x: "16",
																					y: "14",
																					width: "16",
																					height: "16",
																					rx: "2",
																					stroke: "white",
																					"stroke-width": "1.5",
																					fill: "none",
																				},
																			}),
																			t("rect", {
																				attrs: {
																					x: "20",
																					y: "18",
																					width: "8",
																					height: "8",
																					rx: "1",
																					fill: "white",
																				},
																			}),
																			t(
																				"text",
																				{
																					attrs: {
																						x: "24",
																						y: "38",
																						"text-anchor": "middle",
																						fill: "white",
																						"font-size": "7",
																						"font-weight": "bold",
																					},
																				},
																				[e._v("EXE")],
																			),
																		],
																	)
																: t(
																		"svg",
																		{
																			attrs: {
																				viewBox: "0 0 48 48",
																				width: "100%",
																				height: "100%",
																			},
																		},
																		[
																			t("rect", {
																				attrs: {
																					width: "48",
																					height: "48",
																					rx: "4",
																					fill: "#718096",
																				},
																			}),
																			t("path", {
																				attrs: {
																					d: "M14 10h14l6 6v26H14V10z",
																					stroke: "white",
																					"stroke-width": "1.5",
																					fill: "none",
																				},
																			}),
																			t("path", {
																				attrs: {
																					d: "M28 10v6h6",
																					stroke: "white",
																					"stroke-width": "1.5",
																					fill: "none",
																				},
																			}),
																			t("path", {
																				attrs: {
																					d: "M18 22h12M18 26h12M18 30h8",
																					stroke: "white",
																					"stroke-width": "1",
																					"stroke-linecap": "round",
																				},
																			}),
																			t(
																				"text",
																				{
																					attrs: {
																						x: "24",
																						y: "40",
																						"text-anchor": "middle",
																						fill: "white",
																						"font-size": "6",
																						"font-weight": "bold",
																					},
																				},
																				[e._v("FILE")],
																			),
																		],
																	),
				])
			},
			v = [],
			C = {
				name: "FileIcon",
				props: { fileName: { type: String, required: !0 }, size: { type: Number, default: 44 } },
				computed: {
					fileType() {
						if (!this.fileName) return "default"
						const e = this.fileName.toLowerCase().split(".").pop()
						switch (e) {
							case "pdf":
								return "pdf"
							case "doc":
							case "docx":
								return "word"
							case "xls":
							case "xlsx":
							case "csv":
								return "excel"
							case "ppt":
							case "pptx":
								return "powerpoint"
							case "jpg":
							case "jpeg":
							case "png":
							case "gif":
							case "bmp":
							case "webp":
							case "svg":
							case "ico":
								return "image"
							case "mp4":
							case "avi":
							case "mov":
							case "wmv":
							case "flv":
							case "mkv":
							case "webm":
							case "3gp":
								return "video"
							case "mp3":
							case "wav":
							case "flac":
							case "aac":
							case "ogg":
							case "wma":
							case "m4a":
								return "audio"
							case "zip":
							case "rar":
							case "7z":
							case "tar":
							case "gz":
							case "bz2":
							case "xz":
								return "archive"
							case "js":
							case "ts":
							case "html":
							case "htm":
							case "css":
							case "scss":
							case "sass":
							case "less":
							case "vue":
							case "jsx":
							case "tsx":
							case "json":
							case "xml":
							case "yml":
							case "yaml":
							case "py":
							case "java":
							case "cpp":
							case "c":
							case "cs":
							case "go":
							case "php":
							case "rb":
							case "swift":
							case "kt":
							case "sql":
							case "sh":
							case "bat":
								return "code"
							case "txt":
							case "md":
							case "markdown":
							case "log":
							case "cfg":
							case "conf":
							case "ini":
								return "text"
							case "exe":
							case "msi":
							case "dmg":
							case "pkg":
							case "deb":
							case "rpm":
							case "appimage":
								return "executable"
							default:
								return "default"
						}
					},
				},
			},
			I = C,
			S = (s("4244"), Object(m["a"])(I, f, v, !1, null, "1a1bedc0", null)),
			w = S.exports,
			T = s("1cae"),
			b = s("e8ff"),
			y = s("d5b3")
		const x = b["a"]
		var A = {
				name: "messageItem",
				components: {
					HeadImage: n["a"],
					RightMenu: a["a"],
					ChatGroupReaded: p,
					FileIcon: w,
					LoadingDots: T["a"],
					UnifiedMessageRenderer: y["b"],
				},
				props: {
					mode: { type: Number, default: 1 },
					mine: { type: Boolean, required: !0 },
					headImage: { type: String, required: !0 },
					showName: { type: String, required: !0 },
					msgInfo: { type: Object, required: !0 },
					groupMembers: { type: Array },
					menu: { type: Boolean, default: !0 },
				},
				data() {
					return {
						audioPlayState: "STOP",
						rightMenu: { show: !1, pos: { x: 0, y: 0 } },
						lastRenderedContent: null,
					}
				},
				mounted() {
					;(void 0 !== this.msgInfo.isLoading || this.msgInfo.agentId) &&
						console.log(
							"[ChatMessageItem] 消息状态 - isLoading:",
							this.msgInfo.isLoading,
							"isAgentMessage:",
							this.isAgentMessage,
							"content:",
							this.msgInfo.content,
							"agentId:",
							this.msgInfo.agentId,
						),
						this.renderMessageText(),
						this.initTextSelectionOptimization()
				},
				updated() {
					this.smartRenderMessageText(),
						this.$nextTick(() => {
							this.optimizeTextSelection()
						})
				},
				methods: {
					initTextSelectionOptimization() {
						try {
							const e =
								"undefined" !== typeof window &&
								(void 0 !== window.vscodeVueChatUtils ||
									void 0 !== window.vscodeServices ||
									void 0 !== window.acquireVsCodeApi)
							e &&
								(this.$el && this.$el.classList.add("vscode-environment"),
								this.$nextTick(() => {
									this.optimizeTextSelection()
								}))
						} catch (e) {
							console.warn("[ChatMessageItem] 文本选择优化失败:", e)
						}
					},
					optimizeTextSelection() {
						const e = this.$refs.messageText
						e &&
							((e.style.userSelect = "text"),
							(e.style.webkitUserSelect = "text"),
							(e.style.mozUserSelect = "text"),
							(e.style.msUserSelect = "text"),
							(e.style.cursor = "text"),
							(e.style.pointerEvents = "auto"),
							e.classList.add("text-selectable"),
							e.addEventListener(
								"selectstart",
								function (e) {
									e.stopPropagation()
								},
								!0,
							),
							e.addEventListener(
								"mousedown",
								function (e) {
									0 === e.button && e.stopPropagation()
								},
								!0,
							))
					},
					smartRenderMessageText() {
						this.$refs.messageText &&
							this.msgInfo.type === this.$enums.MESSAGE_TYPE.TEXT &&
							this.htmlText !== this.lastRenderedContent &&
							this.renderMessageText()
					},
					renderMessageText() {
						if (this.$refs.messageText && this.msgInfo.type === this.$enums.MESSAGE_TYPE.TEXT)
							try {
								x.setInnerHTML(this.$refs.messageText, this.htmlText),
									(this.lastRenderedContent = this.htmlText),
									this.$nextTick(() => {
										this.optimizeTextSelection()
									})
							} catch (e) {
								;(this.$refs.messageText.textContent = this.msgInfo.content),
									(this.lastRenderedContent = this.msgInfo.content),
									this.$nextTick(() => {
										this.optimizeTextSelection()
									})
							}
					},
					onSendFail() {
						this.$message.error("该文件已发送失败，目前不支持自动重新发送，建议手动重新发送")
					},
					showFullImageBox() {
						let e = JSON.parse(this.msgInfo.content).originUrl
						e && (this.$store.commit("showFullImageBox", e), this.saveImageToWorkspace(e))
					},
					async saveImageToWorkspace(e) {
						try {
							if (this.$vscode && e) {
								const s = await fetch(e),
									i = await s.arrayBuffer(),
									o = new Uint8Array(i),
									n = s.headers.get("content-type") || ""
								let a = ".jpg"
								n.includes("png")
									? (a = ".png")
									: n.includes("gif")
										? (a = ".gif")
										: n.includes("webp") && (a = ".webp")
								let r = "image" + a
								try {
									const t = new URL(e),
										s = t.pathname.split("/"),
										i = s[s.length - 1]
									i && i.includes(".") && (r = i)
								} catch (t) {}
								const l = this.msgInfo.groupId || this.msgInfo.targetId || "unknown",
									c = await this.$vscode.saveArrayBufferToWorkspace(o, r, l)
								c
									? console.log(
											"[ChatMessageItem] Image saved to workspace via SharedServicesAccessor:",
											{ fileName: r, fileSize: o.length, sessionId: l },
										)
									: console.error("[ChatMessageItem] Failed to save image via SharedServicesAccessor")
							}
						} catch (s) {
							console.error("[ChatMessageItem] Failed to save image to workspace:", s)
						}
					},
					onPlayVoice() {
						this.audio || (this.audio = new Audio()),
							(this.audio.src = JSON.parse(this.msgInfo.content).url),
							this.audio.play(),
							(this.onPlayVoice = "RUNNING")
					},
					showRightMenu(e) {
						;(this.rightMenu.pos = { x: e.x, y: e.y }), (this.rightMenu.show = "true")
					},
					onSelectMenu(e) {
						this.$emit(e.key.toLowerCase(), this.msgInfo)
					},
					onShowReadedBox() {
						let e = this.$refs.chatMsgBox.getBoundingClientRect()
						this.$refs.chatGroupReadedBox.open(e)
					},
					async onFileDownloadClick() {
						try {
							const e = this.data.url,
								t = this.data.name
							e && t && (await this.saveRemoteFileToWorkspace(e, t))
						} catch (e) {
							console.error("[ChatMessageItem] Failed to save downloaded file to workspace:", e)
						}
					},
					async saveRemoteFileToWorkspace(e, t) {
						try {
							if (this.$vscode) {
								const s = await fetch(e),
									i = await s.arrayBuffer(),
									o = new Uint8Array(i),
									n = t,
									a = this.msgInfo.groupId || this.msgInfo.targetId || "unknown",
									r = await this.$vscode.saveArrayBufferToWorkspace(o, n, a)
								r
									? console.log(
											"[ChatMessageItem] Downloaded file saved to workspace via SharedServicesAccessor:",
											{ fileName: n, fileSize: o.length, sessionId: a },
										)
									: console.error(
											"[ChatMessageItem] Failed to save downloaded file via SharedServicesAccessor",
										)
							}
						} catch (s) {
							console.error("[ChatMessageItem] Failed to save remote file to workspace:", s)
						}
					},
					handleContextMenu(e) {
						e.preventDefault(), e.stopPropagation(), this.showRightMenu(e)
					},
					onMessageRendered() {
						this.$emit("message-rendered", this.msgInfo),
							this.$nextTick(() => {
								this.$emit("need-scroll")
							})
					},
				},
				computed: {
					loading() {
						return this.msgInfo.loadStatus && "loading" === this.msgInfo.loadStatus
					},
					loadFail() {
						return this.msgInfo.loadStatus && "fail" === this.msgInfo.loadStatus
					},
					data() {
						return JSON.parse(this.msgInfo.content)
					},
					fileSize() {
						let e = this.data.size
						return e > 1048576
							? Math.round(e / 1024 / 1024) + "M"
							: e > 1024
								? Math.round(e / 1024) + "KB"
								: e + "B"
					},
					menuItems() {
						let e = []
						return (
							e.push({ key: "DELETE", name: "删除", icon: "el-icon-delete" }),
							this.msgInfo.selfSend &&
								this.msgInfo.id > 0 &&
								e.push({ key: "RECALL", name: "撤回", icon: "el-icon-refresh-left" }),
							e
						)
					},
					isAction() {
						return this.$msgType.isAction(this.msgInfo.type)
					},
					isNormal() {
						const e = this.msgInfo.type
						return this.$msgType.isNormal(e) || this.$msgType.isAction(e)
					},
					isAgentMessage() {
						return (
							(this.msgInfo.type === this.$enums.MESSAGE_TYPE.TEXT || "error" === this.msgInfo.type) &&
							(this.msgInfo.isAgent ||
								this.msgInfo.isAI ||
								this.msgInfo.fromAgent ||
								this.msgInfo.agentId ||
								this.msgInfo.modelName ||
								(this.msgInfo.sendId && String(this.msgInfo.sendId).startsWith("agent_")) ||
								(this.msgInfo.extra && this.msgInfo.extra.isAgent))
						)
					},
					agentMessageObject() {
						return {
							content: this.msgInfo.content || "",
							type: "error" === this.msgInfo.type ? "ERROR" : "AGENT",
							format: "markdown",
							isAgent: !0,
							isError: "error" === this.msgInfo.type,
							msgInfo: this.msgInfo,
							sendId: this.msgInfo.sendId,
							agentId: this.msgInfo.agentId,
							modelName: this.msgInfo.modelName,
						}
					},
					htmlText() {
						let e = this.msgInfo.selfSend ? "white" : ""
						const { ZeroWidthEncoder: t } = s("7dac")
						let i = t.cleanText(this.msgInfo.content),
							o = this.$url.replaceURLWithHTMLLinks(i, e)
						return this.$emo.transform(o, "emoji-normal")
					},
					isTipMessage() {
						return this.msgInfo.type === this.$enums.MESSAGE_TYPE.TIP_TIME
					},
				},
			},
			$ = A,
			E = (s("1655"), Object(m["a"])($, i, o, !1, null, "602398ff", null))
		t["a"] = E.exports
	},
	"38d6": function (e, t, s) {},
	"38f5": function (e, t, s) {
		"use strict"
		s.d(t, "a", function () {
			return i
		})
		class i {
			static adapt(e) {
				if (!e) return this.createDefaultMessage()
				const t = {
						PRIVATE: this.adaptPrivateMessage,
						GROUP: this.adaptGroupMessage,
						AGENT: this.adaptAgentMessage,
						SYSTEM: this.adaptSystemMessage,
						STREAM: this.adaptStreamMessage,
						LLM: this.adaptLLMMessage,
					},
					s = t[e.type] || t[e.msgType] || this.adaptDefaultMessage
				return s.call(this, e)
			}
			static createDefaultMessage() {
				return {
					content: "",
					format: "text",
					features: { markdown: !1, katex: !1, mermaid: !1, codeHighlight: !1 },
					streaming: !1,
					type: "UNKNOWN",
				}
			}
			static adaptPrivateMessage(e) {
				return {
					...e,
					content: e.content || e.msg || "",
					format: this.detectFormat(e),
					features: this.detectFeatures(e),
					streaming: !1,
					type: "PRIVATE",
				}
			}
			static adaptGroupMessage(e) {
				return {
					...e,
					content: e.content || e.msg || "",
					format: this.detectFormat(e),
					features: this.detectFeatures(e),
					streaming: !1,
					type: "GROUP",
				}
			}
			static adaptAgentMessage(e) {
				const t = e.content || e.msg || e.message || ""
				return {
					...e,
					content: t,
					format: "markdown",
					features: { markdown: !0, katex: !0, mermaid: !0, codeHighlight: !0 },
					streaming: e.streaming || e.isStreaming || !1,
					type: "AGENT",
					isAgent: !0,
					agentId: e.agentId || e.agent_id,
					agentName: e.agentName || e.agent_name,
					modelInfo: e.modelInfo || e.model_info,
				}
			}
			static adaptSystemMessage(e) {
				return {
					...e,
					content: e.content || e.msg || "",
					format: "text",
					features: { markdown: !1, katex: !1, mermaid: !1, codeHighlight: !1 },
					streaming: !1,
					type: "SYSTEM",
				}
			}
			static adaptStreamMessage(e) {
				return {
					...e,
					content: e.content || e.msg || "",
					format: "markdown",
					features: { markdown: !0, katex: !0, mermaid: !0, codeHighlight: !0 },
					streaming: !0,
					type: "STREAM",
				}
			}
			static adaptLLMMessage(e) {
				return {
					...e,
					content: e.content || e.text || e.message || "",
					format: "markdown",
					features: { markdown: !0, katex: !0, mermaid: !0, codeHighlight: !0 },
					streaming: !1 !== e.streaming,
					type: "LLM",
					model: e.model,
					temperature: e.temperature,
					maxTokens: e.max_tokens || e.maxTokens,
					completionTokens: e.completion_tokens || e.completionTokens,
					promptTokens: e.prompt_tokens || e.promptTokens,
				}
			}
			static adaptDefaultMessage(e) {
				const t = this.extractContent(e)
				return {
					...e,
					content: t,
					format: this.detectFormat(e),
					features: this.detectFeatures(e),
					streaming: e.streaming || !1,
					type: e.type || "DEFAULT",
				}
			}
			static extractContent(e) {
				const t = ["content", "msg", "message", "text", "body", "data"]
				for (const s of t)
					if (e[s]) {
						if ("string" === typeof e[s]) return e[s]
						if ("object" === typeof e[s] && e[s].text) return e[s].text
					}
				return ""
			}
			static detectFormat(e) {
				if (e.format) return e.format
				if (e.isMarkdown || e.is_markdown) return "markdown"
				if ("AGENT" === e.type || "LLM" === e.type || e.isAgent) return "markdown"
				const t = this.extractContent(e)
				return this.hasMarkdownSyntax(t) ? "markdown" : "text"
			}
			static detectFeatures(e) {
				const t = this.extractContent(e)
				return "text" === this.detectFormat(e)
					? { markdown: !1, katex: !1, mermaid: !1, codeHighlight: !1 }
					: {
							markdown: !0,
							katex: this.hasLatex(t),
							mermaid: this.hasMermaid(t),
							codeHighlight: this.hasCodeBlock(t),
						}
			}
			static hasMarkdownSyntax(e) {
				if (!e) return !1
				const t = [
					/^#{1,6}\s/m,
					/\*\*[^*]+\*\*/,
					/\*[^*]+\*/,
					/```[\s\S]*?```/,
					/`[^`]+`/,
					/^\s*[-*+]\s/m,
					/^\s*\d+\.\s/m,
					/\[([^\]]+)\]\(([^)]+)\)/,
					/^\|.*\|$/m,
					/^>/m,
				]
				return t.some((t) => t.test(e))
			}
			static hasLatex(e) {
				return !!e && /\$[^$]+\$|\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)/.test(e)
			}
			static hasMermaid(e) {
				return !!e && /```mermaid[\s\S]*?```/.test(e)
			}
			static hasCodeBlock(e) {
				return !!e && /```[\s\S]*?```/.test(e)
			}
			static mergeUpdate(e, t) {
				const s = this.adapt(e)
				return (
					void 0 !== t.content && (s.content = t.append ? s.content + t.content : t.content),
					void 0 !== t.streaming && (s.streaming = t.streaming),
					{ ...s, ...t, content: s.content }
				)
			}
		}
	},
	3940: function (e, t, s) {
		"use strict"
		s("b761")
	},
	"3c89": function (e, t) {},
	"3d2d": function (e, t, s) {
		e.exports = s.p + "img/41.0b009f7b.gif"
	},
	"3dfc": function (e, t, s) {
		e.exports = s.p + "img/4.be67348c.gif"
	},
	"3f29": function (e, t, s) {
		e.exports = s.p + "img/9.0b2dd09a.gif"
	},
	"3f51": function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{
						staticClass: "right-menu-mask",
						on: {
							click: function (t) {
								return t.stopPropagation(), e.close()
							},
							contextmenu: function (t) {
								return t.preventDefault(), e.close()
							},
						},
					},
					[
						t(
							"div",
							{ staticClass: "right-menu", style: { left: e.pos.x + "px", top: e.pos.y + "px" } },
							[
								t(
									"el-menu",
									{ attrs: { "text-color": "#333333" } },
									e._l(e.items, function (s) {
										return t(
											"el-menu-item",
											{
												key: s.key,
												attrs: { title: s.name },
												nativeOn: {
													click: function (t) {
														return t.stopPropagation(), e.onSelectMenu(s)
													},
												},
											},
											[t("span", [e._v(e._s(s.name))])],
										)
									}),
									1,
								),
							],
							1,
						),
					],
				)
			},
			o = [],
			n = {
				name: "rightMenu",
				data() {
					return {}
				},
				props: { pos: { type: Object }, items: { type: Array } },
				methods: {
					close() {
						this.$emit("close")
					},
					onSelectMenu(e) {
						this.$emit("select", e), this.close()
					},
				},
			},
			a = n,
			r = (s("1669"), s("2877")),
			l = Object(r["a"])(a, i, o, !1, null, null, null)
		t["a"] = l.exports
	},
	4036: function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{
						staticClass: "head-image",
						style: { cursor: e.isShowUserInfo ? "pointer" : null },
						on: {
							click: function (t) {
								return e.showUserInfo(t)
							},
						},
					},
					[
						t("img", {
							directives: [
								{
									name: "show",
									rawName: "v-show",
									value: e.validUrl && !e.imageError,
									expression: "validUrl && !imageError",
								},
							],
							staticClass: "avatar-image",
							style: e.avatarImageStyle,
							attrs: { src: e.validUrl, loading: "lazy" },
							on: { error: e.handleImageError },
						}),
						t(
							"div",
							{
								directives: [
									{
										name: "show",
										rawName: "v-show",
										value: !e.validUrl || e.imageError,
										expression: "!validUrl || imageError",
									},
								],
								staticClass: "avatar-text",
								style: e.avatarTextStyle,
							},
							[e._v(" " + e._s(e.displayText) + " ")],
						),
						t("div", {
							directives: [{ name: "show", rawName: "v-show", value: e.online, expression: "online" }],
							staticClass: "online",
							attrs: { title: "用户当前在线" },
						}),
						e._t("default"),
					],
					2,
				)
			},
			o = [],
			n = {
				name: "headImage",
				data() {
					return {
						imageError: !1,
						colors: [
							"#5daa31",
							"#c7515a",
							"#e03697",
							"#85029b",
							"#c9b455",
							"#326eb6",
							"#ff6b6b",
							"#4ecdc4",
							"#45b7d1",
							"#96ceb4",
							"#feca57",
							"#ff9ff3",
						],
					}
				},
				props: {
					id: { type: Number },
					size: { type: Number, default: 42 },
					width: { type: Number },
					height: { type: Number },
					radius: { type: String, default: "50%" },
					url: { type: String },
					name: { type: String, default: null },
					online: { type: Boolean, default: !1 },
					isShowUserInfo: { type: Boolean, default: !0 },
				},
				methods: {
					showUserInfo(e) {
						this.isShowUserInfo &&
							this.id &&
							this.id > 0 &&
							this.$http({ url: "/user/find/" + this.id, method: "get" })
								.then((t) => {
									this.$store.commit("setUserInfoBoxPos", e), this.$store.commit("showUserInfoBox", t)
								})
								.catch(() => {})
					},
					handleImageError() {
						this.imageError = !0
					},
				},
				computed: {
					validUrl() {
						const e = this.url
						if (!e || "string" !== typeof e) return null
						const t = e.trim()
						return t ? (t.length <= 4 && !t.includes("http") && !t.includes(".") ? null : t) : null
					},
					displayText() {
						const e = this.url,
							t = this.name
						if (e && "string" === typeof e) {
							const t = e.trim()
							if (t.length <= 4 && !t.includes("http") && !t.includes(".")) return t
						}
						if (t && "string" === typeof t && t.trim()) {
							const e = t.trim()
							if (e.length >= 2) return e.substring(0, 2).toUpperCase()
							if (1 === e.length) return e.toUpperCase()
						}
						return "👤"
					},
					avatarImageStyle() {
						let e = this.width ? this.width : this.size,
							t = this.height ? this.height : this.size
						return `width:${e}px; height:${t}px;\n\t\t\t\t\tborder-radius: ${this.radius};`
					},
					avatarTextStyle() {
						let e = this.width ? this.width : this.size,
							t = this.height ? this.height : this.size
						return `\n\t\t\t\t  width: ${e}px;height:${t}px;\n\t\t\t\t\tbackground-color: ${this.textBackgroundColor};\n\t\t\t\t\tfont-size:${0.35 * e}px;\n\t\t\t\t\tborder-radius: ${this.radius};\n\t\t\t\t\tcolor: white;\n\t\t\t\t\tfont-weight: bold;\n\t\t\t\t\t`
					},
					textBackgroundColor() {
						const e = this.name
						if (!e || "string" !== typeof e || !e.trim()) return "#cccccc"
						let t = 0
						for (let s = 0; s < e.length; s++) t += e.charCodeAt(s)
						return this.colors[t % this.colors.length]
					},
					textColor() {
						let e = 0
						for (var t = 0; t < this.name.length; t++) e += this.name.charCodeAt(t)
						return this.colors[e % this.colors.length]
					},
				},
				watch: {
					url() {
						this.imageError = !1
					},
				},
			},
			a = n,
			r = (s("b1fb"), s("2877")),
			l = Object(r["a"])(a, i, o, !1, null, "e3d94e8e", null)
		t["a"] = l.exports
	},
	4244: function (e, t, s) {
		"use strict"
		s("c0af")
	},
	"42ca": function (e, t, s) {
		"use strict"
		s("fd31")
	},
	4518: function (e, t, s) {
		e.exports = s.p + "img/12.c86081d0.gif"
	},
	4561: function (e, t, s) {},
	"46fd": function (e, t, s) {
		"use strict"
		s("75d5")
	},
	4970: function (e, t, s) {},
	"4d66": function (e, t, s) {
		e.exports = s.p + "img/52.21a20728.gif"
	},
	"4e73": function (e, t, s) {},
	"4eca": function (e, t, s) {},
	"4fc8": function (e, t, s) {
		e.exports = s.p + "img/22.1a731ef9.gif"
	},
	"50a5": function (e, t, s) {
		e.exports = s.p + "img/16.942bf804.gif"
	},
	5216: function (e, t, s) {
		"use strict"
		s("72f7")
	},
	5234: function (e, t, s) {},
	5347: function (e, t, s) {
		e.exports = s.p + "img/39.a8484b5b.gif"
	},
	5457: function (e, t, s) {},
	"54e3": function (e, t, s) {
		"use strict"
		s("56ce")
	},
	"552e": function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{
						staticClass: "chat-item",
						class: e.active ? "active" : "",
						on: {
							click: e.handleClick,
							dblclick: e.handleDoubleClick,
							contextmenu: function (t) {
								return t.preventDefault(), e.showRightMenu(t)
							},
						},
					},
					[
						t(
							"div",
							{ staticClass: "chat-left" },
							[
								t("head-image", {
									attrs: {
										url: e.chat.headImage,
										name: e.chat.showName,
										size: 42,
										id: e.headImageId,
										isShowUserInfo: "ai" !== e.chat.type,
									},
								}),
								t(
									"div",
									{
										directives: [
											{
												name: "show",
												rawName: "v-show",
												value: e.chat.unreadCount > 0,
												expression: "chat.unreadCount > 0",
											},
										],
										staticClass: "unread-text",
									},
									[e._v(e._s(e.chat.unreadCount))],
								),
							],
							1,
						),
						t("div", { staticClass: "chat-right" }, [
							t("div", { staticClass: "chat-name" }, [
								t(
									"div",
									{ staticClass: "chat-name-text" },
									[
										t("div", [e._v(e._s(e.chat.showName))]),
										"GROUP" == e.chat.type
											? t("el-tag", { attrs: { size: "mini", effect: "dark" } }, [e._v("群")])
											: e._e(),
									],
									1,
								),
								t("div", { staticClass: "chat-time-text" }, [e._v(e._s(e.showTime))]),
							]),
							t("div", { staticClass: "chat-content" }, [
								t("div", { staticClass: "chat-at-text" }, [e._v(e._s(e.atText))]),
								t(
									"div",
									{
										directives: [
											{
												name: "show",
												rawName: "v-show",
												value: e.isShowSendName,
												expression: "isShowSendName",
											},
										],
										staticClass: "chat-send-name",
									},
									[e._v(e._s(e.chat.sendNickName + ": "))],
								),
								t("div", {
									staticClass: "chat-content-text",
									domProps: { innerHTML: e._s(e.$emo.transform(e.chat.lastContent, "emoji-small")) },
								}),
							]),
						]),
						t("right-menu", {
							directives: [
								{
									name: "show",
									rawName: "v-show",
									value: e.rightMenu.show,
									expression: "rightMenu.show",
								},
							],
							attrs: { pos: e.rightMenu.pos, items: e.rightMenu.items },
							on: {
								close: function (t) {
									e.rightMenu.show = !1
								},
								select: e.onSelectMenu,
							},
						}),
					],
					1,
				)
			},
			o = [],
			n = (s("14d9"), s("4036")),
			a = s("3f51"),
			r = s("e06d"),
			l = {
				name: "chatItem",
				components: { HeadImage: n["a"], RightMenu: a["a"] },
				data() {
					return { rightMenu: { show: !1, pos: { x: 0, y: 0 }, items: [] } }
				},
				props: {
					chat: { type: Object },
					active: { type: Boolean },
					index: { type: Number },
					disableDoubleClick: { type: Boolean, default: !1 },
				},
				methods: {
					showRightMenu(e) {
						;(this.rightMenu.items = this.getMenuItems()),
							(this.rightMenu.pos = { x: e.x, y: e.y }),
							(this.rightMenu.show = "true")
					},
					getMenuItems() {
						const e = []
						return (
							this.chat.isTerminalInbox || e.push({ key: "TOP", name: "置顶", icon: "el-icon-top" }),
							this.chat.isTerminalInbox ||
								e.push({ key: "DELETE", name: "删除", icon: "el-icon-delete" }),
							e
						)
					},
					onSelectMenu(e) {
						this.$emit(e.key.toLowerCase(), this.index)
					},
					handleClick() {
						r["a"].debug("ChatItem", "被点击了，索引:", this.index, "会话:", this.chat.showName),
							this.disableDoubleClick &&
								(r["a"].debug("ChatItem", "单击模式：立即激活会话"), this.$emit("active", this.index))
					},
					handleDoubleClick() {
						this.disableDoubleClick ||
							(r["a"].debug("ChatItem", "双击模式：激活会话"), this.$emit("active", this.index))
					},
				},
				computed: {
					headImageId() {
						if ("PRIVATE" !== this.chat.type) return 0
						if (this.chat.isTerminalInbox && "string" === typeof this.chat.targetId) {
							const e = this.chat.targetId.split("_"),
								t = parseInt(e[0])
							return isNaN(t) ? 0 : t
						}
						const e = parseInt(this.chat.targetId)
						return isNaN(e) ? 0 : e
					},
					isShowSendName() {
						if (!this.chat.sendNickName) return !1
						let e = this.chat.messages.length
						if (0 == e) return !1
						let t = this.chat.messages[e - 1]
						return this.$msgType.isNormal(t.type)
					},
					showTime() {
						return this.$date.toTimeText(this.chat.lastSendTime, !0)
					},
					atText() {
						return this.chat.atMe ? "[有人@我]" : this.chat.atAll ? "[@全体成员]" : ""
					},
				},
			},
			c = l,
			d = (s("b8fe"), s("2877")),
			h = Object(d["a"])(c, i, o, !1, null, null, null)
		t["a"] = h.exports
	},
	5541: function (e, t, s) {
		e.exports = s.p + "img/30.5bd2ccd2.gif"
	},
	"56ce": function (e, t, s) {},
	"56d7": function (e, t, s) {
		"use strict"
		s.r(t)
		var i = {}
		s.r(i),
			s.d(i, "connect", function () {
				return si
			}),
			s.d(i, "reconnect", function () {
				return ii
			}),
			s.d(i, "close", function () {
				return oi
			}),
			s.d(i, "sendMessage", function () {
				return ai
			}),
			s.d(i, "onConnect", function () {
				return ri
			}),
			s.d(i, "onMessage", function () {
				return li
			}),
			s.d(i, "onClose", function () {
				return ci
			}),
			s.d(i, "getMessageCallBack", function () {
				return di
			}),
			s.d(i, "setMessageCallBack", function () {
				return hi
			})
		var o = {}
		s.r(o),
			s.d(o, "isNormal", function () {
				return ui
			}),
			s.d(o, "isStatus", function () {
				return mi
			}),
			s.d(o, "isTip", function () {
				return gi
			}),
			s.d(o, "isAction", function () {
				return pi
			}),
			s.d(o, "isRtcPrivate", function () {
				return fi
			}),
			s.d(o, "isRtcGroup", function () {
				return vi
			})
		var n = {}
		s.r(n),
			s.d(n, "MESSAGE_TYPE", function () {
				return Mi
			}),
			s.d(n, "RTC_STATE", function () {
				return Ni
			}),
			s.d(n, "TERMINAL_TYPE", function () {
				return _i
			}),
			s.d(n, "MESSAGE_STATUS", function () {
				return Pi
			})
		var a = {}
		s.r(a),
			s.d(a, "toTimeText", function () {
				return Ji
			}),
			s.d(a, "isYestday", function () {
				return Ki
			}),
			s.d(a, "isYear", function () {
				return Qi
			}),
			s.d(a, "formatDateTime", function () {
				return Zi
			})
		var r = s("2b0e"),
			l = function () {
				var e = this,
					t = e._self._c
				return t("div", { attrs: { id: "app" } }, [t("router-view")], 1)
			},
			c = [],
			d = { name: "App", components: {} },
			h = d,
			u = (s("97db"), s("2877")),
			m = Object(u["a"])(h, l, c, !1, null, null, null),
			g = m.exports,
			p = s("8c4f"),
			f = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{ staticClass: "login-view" },
					[
						e.autoLoginLoading
							? t("div", { staticClass: "auto-login-loading" }, [
									t("div", { staticClass: "loading-content" }, [
										e._m(0),
										t("div", { staticClass: "loading-text" }, [e._v("正在自动登录...")]),
										t("div", { staticClass: "loading-phone" }, [
											e._v("手机号：" + e._s(e.autoLoginPhone)),
										]),
									]),
								])
							: t("div", { staticClass: "login-content" }, [
									t(
										"div",
										{ staticClass: "login-form" },
										[
											e._m(1),
											e.isInVSCodeEnvironment()
												? t("div", { staticClass: "custom-tabs" }, [
														t("div", { staticClass: "custom-tabs-header" }, [
															t(
																"div",
																{
																	staticClass: "custom-tab-item",
																	class: { active: "account" === e.activeTab },
																	on: {
																		click: function (t) {
																			return e.forceSetActiveTab("account")
																		},
																	},
																},
																[e._v(" 账号登录 ")],
															),
															t(
																"div",
																{
																	staticClass: "custom-tab-item",
																	class: { active: "sms" === e.activeTab },
																	on: {
																		click: function (t) {
																			return e.forceSetActiveTab("sms")
																		},
																	},
																},
																[e._v(" 短信登录 ")],
															),
															t(
																"div",
																{
																	staticClass: "custom-tab-item",
																	class: { active: "qrcode" === e.activeTab },
																	on: {
																		click: function (t) {
																			return e.forceSetActiveTab("qrcode")
																		},
																	},
																},
																[e._v(" 扫码登录 ")],
															),
														]),
														t("div", { staticClass: "custom-tabs-content" }, [
															t(
																"div",
																{
																	directives: [
																		{
																			name: "show",
																			rawName: "v-show",
																			value: "account" === e.activeTab,
																			expression: "activeTab === 'account'",
																		},
																	],
																	staticClass: "custom-tab-pane",
																},
																[
																	t(
																		"el-form",
																		{
																			ref: "accountForm",
																			attrs: {
																				model: e.accountForm,
																				"status-icon": "",
																				rules: e.accountRules,
																			},
																			nativeOn: {
																				keyup: function (t) {
																					return !t.type.indexOf("key") &&
																						e._k(
																							t.keyCode,
																							"enter",
																							13,
																							t.key,
																							"Enter",
																						)
																						? null
																						: e.submitAccountForm.apply(
																								null,
																								arguments,
																							)
																				},
																			},
																		},
																		[
																			t(
																				"el-form-item",
																				{ attrs: { prop: "userName" } },
																				[
																					t("el-input", {
																						attrs: {
																							autocomplete: "off",
																							placeholder: "请输入用户名",
																							"prefix-icon":
																								"el-icon-user",
																						},
																						model: {
																							value: e.accountForm
																								.userName,
																							callback: function (t) {
																								e.$set(
																									e.accountForm,
																									"userName",
																									t,
																								)
																							},
																							expression:
																								"accountForm.userName",
																						},
																					}),
																				],
																				1,
																			),
																			t(
																				"el-form-item",
																				{ attrs: { prop: "password" } },
																				[
																					t("el-input", {
																						attrs: {
																							type: "password",
																							autocomplete: "off",
																							placeholder: "请输入密码",
																							"prefix-icon":
																								"el-icon-lock",
																						},
																						model: {
																							value: e.accountForm
																								.password,
																							callback: function (t) {
																								e.$set(
																									e.accountForm,
																									"password",
																									t,
																								)
																							},
																							expression:
																								"accountForm.password",
																						},
																					}),
																				],
																				1,
																			),
																			t(
																				"el-form-item",
																				[
																					t(
																						"el-button",
																						{
																							staticClass: "login-btn",
																							attrs: { type: "primary" },
																							on: {
																								click: e.submitAccountForm,
																							},
																						},
																						[e._v("登录")],
																					),
																				],
																				1,
																			),
																		],
																		1,
																	),
																],
																1,
															),
															t(
																"div",
																{
																	directives: [
																		{
																			name: "show",
																			rawName: "v-show",
																			value: "sms" === e.activeTab,
																			expression: "activeTab === 'sms'",
																		},
																	],
																	staticClass: "custom-tab-pane",
																},
																[
																	t(
																		"el-form",
																		{
																			ref: "smsForm",
																			attrs: {
																				model: e.smsForm,
																				"status-icon": "",
																				rules: e.smsRules,
																			},
																			nativeOn: {
																				keyup: function (t) {
																					return !t.type.indexOf("key") &&
																						e._k(
																							t.keyCode,
																							"enter",
																							13,
																							t.key,
																							"Enter",
																						)
																						? null
																						: e.submitSmsForm.apply(
																								null,
																								arguments,
																							)
																				},
																			},
																		},
																		[
																			t(
																				"el-form-item",
																				{ attrs: { prop: "userName" } },
																				[
																					t("el-input", {
																						attrs: {
																							autocomplete: "off",
																							placeholder: "请输入手机号",
																							"prefix-icon":
																								"el-icon-phone",
																						},
																						model: {
																							value: e.smsForm.userName,
																							callback: function (t) {
																								e.$set(
																									e.smsForm,
																									"userName",
																									t,
																								)
																							},
																							expression:
																								"smsForm.userName",
																						},
																					}),
																				],
																				1,
																			),
																			t(
																				"el-form-item",
																				{ attrs: { prop: "password" } },
																				[
																					t(
																						"div",
																						{
																							staticClass:
																								"verification-code-row",
																						},
																						[
																							t("el-input", {
																								staticClass:
																									"code-input",
																								attrs: {
																									autocomplete: "off",
																									placeholder:
																										"请输入验证码",
																									"prefix-icon":
																										"el-icon-message",
																								},
																								model: {
																									value: e.smsForm
																										.password,
																									callback: function (
																										t,
																									) {
																										e.$set(
																											e.smsForm,
																											"password",
																											t,
																										)
																									},
																									expression:
																										"smsForm.password",
																								},
																							}),
																							t(
																								"el-button",
																								{
																									staticClass:
																										"send-code-btn",
																									attrs: {
																										type: "primary",
																										disabled:
																											e.countdown >
																											0,
																									},
																									on: {
																										click: e.sendCode,
																									},
																								},
																								[
																									e._v(
																										" " +
																											e._s(
																												e.countdown >
																													0
																													? e.countdown +
																															"s后重发"
																													: "发送验证码",
																											) +
																											" ",
																									),
																								],
																							),
																						],
																						1,
																					),
																				],
																			),
																			t(
																				"el-form-item",
																				[
																					t(
																						"el-button",
																						{
																							staticClass: "login-btn",
																							attrs: { type: "primary" },
																							on: { click: e.phoneLogin },
																						},
																						[e._v("登录")],
																					),
																				],
																				1,
																			),
																		],
																		1,
																	),
																],
																1,
															),
															t(
																"div",
																{
																	directives: [
																		{
																			name: "show",
																			rawName: "v-show",
																			value: "qrcode" === e.activeTab,
																			expression: "activeTab === 'qrcode'",
																		},
																	],
																	staticClass: "custom-tab-pane",
																},
																[
																	e.bindPhone
																		? t(
																				"div",
																				{ staticClass: "bind-phone-container" },
																				[
																					e._m(2),
																					t(
																						"el-form",
																						{
																							ref: "bindPhoneForm",
																							attrs: {
																								model: e.bindPhoneForm,
																								"status-icon": "",
																								rules: e.bindPhoneRules,
																							},
																							nativeOn: {
																								keyup: function (t) {
																									return !t.type.indexOf(
																										"key",
																									) &&
																										e._k(
																											t.keyCode,
																											"enter",
																											13,
																											t.key,
																											"Enter",
																										)
																										? null
																										: e.submitBindPhone.apply(
																												null,
																												arguments,
																											)
																								},
																							},
																						},
																						[
																							t(
																								"el-form-item",
																								{
																									attrs: {
																										prop: "phone",
																									},
																								},
																								[
																									t("el-input", {
																										attrs: {
																											autocomplete:
																												"off",
																											placeholder:
																												"请输入手机号",
																											"prefix-icon":
																												"el-icon-phone",
																										},
																										model: {
																											value: e
																												.bindPhoneForm
																												.phone,
																											callback:
																												function (
																													t,
																												) {
																													e.$set(
																														e.bindPhoneForm,
																														"phone",
																														t,
																													)
																												},
																											expression:
																												"bindPhoneForm.phone",
																										},
																									}),
																								],
																								1,
																							),
																							t(
																								"el-form-item",
																								{
																									attrs: {
																										prop: "code",
																									},
																								},
																								[
																									t(
																										"div",
																										{
																											staticClass:
																												"verification-code-row",
																										},
																										[
																											t(
																												"el-input",
																												{
																													staticClass:
																														"code-input",
																													attrs: {
																														autocomplete:
																															"off",
																														placeholder:
																															"请输入验证码",
																														"prefix-icon":
																															"el-icon-message",
																													},
																													model: {
																														value: e
																															.bindPhoneForm
																															.code,
																														callback:
																															function (
																																t,
																															) {
																																e.$set(
																																	e.bindPhoneForm,
																																	"code",
																																	t,
																																)
																															},
																														expression:
																															"bindPhoneForm.code",
																													},
																												},
																											),
																											t(
																												"el-button",
																												{
																													staticClass:
																														"send-code-btn",
																													attrs: {
																														type: "primary",
																														disabled:
																															e.bindPhoneCountdown >
																															0,
																													},
																													on: {
																														click: e.sendBindPhoneCode,
																													},
																												},
																												[
																													e._v(
																														" " +
																															e._s(
																																e.bindPhoneCountdown >
																																	0
																																	? e.bindPhoneCountdown +
																																			"s后重发"
																																	: "发送验证码",
																															) +
																															" ",
																													),
																												],
																											),
																										],
																										1,
																									),
																								],
																							),
																							t(
																								"el-form-item",
																								[
																									t(
																										"el-button",
																										{
																											staticClass:
																												"login-btn",
																											attrs: {
																												type: "primary",
																											},
																											on: {
																												click: e.submitBindPhone,
																											},
																										},
																										[
																											e._v(
																												"确认绑定",
																											),
																										],
																									),
																								],
																								1,
																							),
																							t(
																								"el-form-item",
																								[
																									t(
																										"el-button",
																										{
																											staticClass:
																												"cancel-btn",
																											attrs: {
																												type: "text",
																											},
																											on: {
																												click: e.cancelBindPhone,
																											},
																										},
																										[
																											e._v(
																												"取消绑定",
																											),
																										],
																									),
																								],
																								1,
																							),
																						],
																						1,
																					),
																				],
																				1,
																			)
																		: t(
																				"div",
																				{ staticClass: "qrcode-container" },
																				[
																					t(
																						"div",
																						{ staticClass: "qrcode-box" },
																						[
																							"loading" === e.qrcodeStatus
																								? t(
																										"div",
																										{
																											staticClass:
																												"qrcode-loading",
																										},
																										[
																											t("i", {
																												staticClass:
																													"el-icon-loading",
																											}),
																											t("p", [
																												e._v(
																													"二维码生成中...",
																												),
																											]),
																										],
																									)
																								: "active" ===
																									  e.qrcodeStatus
																									? t(
																											"div",
																											{
																												staticClass:
																													"qrcode-active",
																											},
																											[
																												t(
																													"div",
																													{
																														staticClass:
																															"qrcode-image",
																													},
																													[
																														e.wxTicket
																															? t(
																																	"div",
																																	{
																																		staticClass:
																																			"qrcode-real",
																																	},
																																	[
																																		t(
																																			"img",
																																			{
																																				attrs: {
																																					src:
																																						"https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" +
																																						e.wxTicket,
																																					alt: "微信登录二维码",
																																				},
																																			},
																																		),
																																	],
																																)
																															: t(
																																	"div",
																																	{
																																		staticClass:
																																			"mock-qrcode",
																																	},
																																	[
																																		t(
																																			"i",
																																			{
																																				staticClass:
																																					"el-icon-mobile-phone",
																																			},
																																		),
																																		t(
																																			"p",
																																			[
																																				e._v(
																																					"二维码加载中...",
																																				),
																																			],
																																		),
																																	],
																																),
																													],
																												),
																												t(
																													"p",
																													{
																														staticClass:
																															"qrcode-tip",
																													},
																													[
																														e._v(
																															"请使用手机扫描二维码登录",
																														),
																													],
																												),
																											],
																										)
																									: "expired" ===
																										  e.qrcodeStatus
																										? t(
																												"div",
																												{
																													staticClass:
																														"qrcode-expired",
																												},
																												[
																													t(
																														"i",
																														{
																															staticClass:
																																"el-icon-refresh",
																														},
																													),
																													t(
																														"p",
																														[
																															e._v(
																																"二维码已过期",
																															),
																														],
																													),
																													t(
																														"p",
																														{
																															staticClass:
																																"auto-refresh-tip",
																														},
																														[
																															e._v(
																																"正在自动刷新...",
																															),
																														],
																													),
																													t(
																														"el-button",
																														{
																															staticClass:
																																"manual-refresh-btn",
																															attrs: {
																																type: "text",
																															},
																															on: {
																																click: e.refreshQrcode,
																															},
																														},
																														[
																															t(
																																"i",
																																{
																																	staticClass:
																																		"el-icon-refresh-right",
																																},
																															),
																															e._v(
																																" 立即刷新 ",
																															),
																														],
																													),
																												],
																												1,
																											)
																										: "scanned" ===
																											  e.qrcodeStatus
																											? t(
																													"div",
																													{
																														staticClass:
																															"qrcode-scanned",
																													},
																													[
																														t(
																															"i",
																															{
																																staticClass:
																																	"el-icon-success",
																															},
																														),
																														t(
																															"p",
																															[
																																e._v(
																																	"扫描成功，请在手机上确认登录",
																																),
																															],
																														),
																													],
																												)
																											: e._e(),
																						],
																					),
																				],
																			),
																],
															),
														]),
													])
												: t(
														"el-tabs",
														{
															staticClass: "login-tabs",
															model: {
																value: e.activeTab,
																callback: function (t) {
																	e.activeTab = t
																},
																expression: "activeTab",
															},
														},
														[
															t(
																"el-tab-pane",
																{ attrs: { label: "账号登录", name: "account" } },
																[
																	t(
																		"el-form",
																		{
																			ref: "accountFormWeb",
																			attrs: {
																				model: e.accountForm,
																				"status-icon": "",
																				rules: e.accountRules,
																			},
																			nativeOn: {
																				keyup: function (t) {
																					return !t.type.indexOf("key") &&
																						e._k(
																							t.keyCode,
																							"enter",
																							13,
																							t.key,
																							"Enter",
																						)
																						? null
																						: e.submitAccountForm.apply(
																								null,
																								arguments,
																							)
																				},
																			},
																		},
																		[
																			t(
																				"el-form-item",
																				{ attrs: { prop: "userName" } },
																				[
																					t("el-input", {
																						attrs: {
																							autocomplete: "off",
																							placeholder: "请输入用户名",
																							"prefix-icon":
																								"el-icon-user",
																						},
																						model: {
																							value: e.accountForm
																								.userName,
																							callback: function (t) {
																								e.$set(
																									e.accountForm,
																									"userName",
																									t,
																								)
																							},
																							expression:
																								"accountForm.userName",
																						},
																					}),
																				],
																				1,
																			),
																			t(
																				"el-form-item",
																				{ attrs: { prop: "password" } },
																				[
																					t("el-input", {
																						attrs: {
																							type: "password",
																							autocomplete: "off",
																							placeholder: "请输入密码",
																							"prefix-icon":
																								"el-icon-lock",
																						},
																						model: {
																							value: e.accountForm
																								.password,
																							callback: function (t) {
																								e.$set(
																									e.accountForm,
																									"password",
																									t,
																								)
																							},
																							expression:
																								"accountForm.password",
																						},
																					}),
																				],
																				1,
																			),
																			t(
																				"el-form-item",
																				[
																					t(
																						"el-button",
																						{
																							staticClass: "login-btn",
																							attrs: { type: "primary" },
																							on: {
																								click: e.submitAccountForm,
																							},
																						},
																						[e._v("登录")],
																					),
																				],
																				1,
																			),
																		],
																		1,
																	),
																],
																1,
															),
															t(
																"el-tab-pane",
																{ attrs: { label: "短信登录", name: "sms" } },
																[
																	t(
																		"el-form",
																		{
																			ref: "smsFormWeb",
																			attrs: {
																				model: e.smsForm,
																				"status-icon": "",
																				rules: e.smsRules,
																			},
																			nativeOn: {
																				keyup: function (t) {
																					return !t.type.indexOf("key") &&
																						e._k(
																							t.keyCode,
																							"enter",
																							13,
																							t.key,
																							"Enter",
																						)
																						? null
																						: e.submitSmsForm.apply(
																								null,
																								arguments,
																							)
																				},
																			},
																		},
																		[
																			t(
																				"el-form-item",
																				{ attrs: { prop: "userName" } },
																				[
																					t("el-input", {
																						attrs: {
																							autocomplete: "off",
																							placeholder: "请输入手机号",
																							"prefix-icon":
																								"el-icon-phone",
																						},
																						model: {
																							value: e.smsForm.userName,
																							callback: function (t) {
																								e.$set(
																									e.smsForm,
																									"userName",
																									t,
																								)
																							},
																							expression:
																								"smsForm.userName",
																						},
																					}),
																				],
																				1,
																			),
																			t(
																				"el-form-item",
																				{ attrs: { prop: "password" } },
																				[
																					t(
																						"div",
																						{
																							staticClass:
																								"verification-code-row",
																						},
																						[
																							t("el-input", {
																								staticClass:
																									"code-input",
																								attrs: {
																									autocomplete: "off",
																									placeholder:
																										"请输入验证码",
																									"prefix-icon":
																										"el-icon-message",
																								},
																								model: {
																									value: e.smsForm
																										.password,
																									callback: function (
																										t,
																									) {
																										e.$set(
																											e.smsForm,
																											"password",
																											t,
																										)
																									},
																									expression:
																										"smsForm.password",
																								},
																							}),
																							t(
																								"el-button",
																								{
																									staticClass:
																										"send-code-btn",
																									attrs: {
																										type: "primary",
																										disabled:
																											e.countdown >
																											0,
																									},
																									on: {
																										click: e.sendCode,
																									},
																								},
																								[
																									e._v(
																										" " +
																											e._s(
																												e.countdown >
																													0
																													? e.countdown +
																															"s后重发"
																													: "发送验证码",
																											) +
																											" ",
																									),
																								],
																							),
																						],
																						1,
																					),
																				],
																			),
																			t(
																				"el-form-item",
																				[
																					t(
																						"el-button",
																						{
																							staticClass: "login-btn",
																							attrs: { type: "primary" },
																							on: { click: e.phoneLogin },
																						},
																						[e._v("登录")],
																					),
																				],
																				1,
																			),
																		],
																		1,
																	),
																],
																1,
															),
															t(
																"el-tab-pane",
																{ attrs: { label: "扫码登录", name: "qrcode" } },
																[
																	e.bindPhone
																		? t(
																				"div",
																				{ staticClass: "bind-phone-container" },
																				[
																					t(
																						"div",
																						{
																							staticClass:
																								"bind-phone-header",
																						},
																						[
																							t("p", [
																								e._v(
																									"请绑定手机号以完成登录",
																								),
																							]),
																						],
																					),
																					t(
																						"el-form",
																						{
																							ref: "bindPhoneFormWeb",
																							attrs: {
																								model: e.bindPhoneForm,
																								"status-icon": "",
																								rules: e.bindPhoneRules,
																							},
																							nativeOn: {
																								keyup: function (t) {
																									return !t.type.indexOf(
																										"key",
																									) &&
																										e._k(
																											t.keyCode,
																											"enter",
																											13,
																											t.key,
																											"Enter",
																										)
																										? null
																										: e.submitBindPhone.apply(
																												null,
																												arguments,
																											)
																								},
																							},
																						},
																						[
																							t(
																								"el-form-item",
																								{
																									attrs: {
																										prop: "phone",
																									},
																								},
																								[
																									t("el-input", {
																										attrs: {
																											autocomplete:
																												"off",
																											placeholder:
																												"请输入手机号",
																											"prefix-icon":
																												"el-icon-phone",
																										},
																										model: {
																											value: e
																												.bindPhoneForm
																												.phone,
																											callback:
																												function (
																													t,
																												) {
																													e.$set(
																														e.bindPhoneForm,
																														"phone",
																														t,
																													)
																												},
																											expression:
																												"bindPhoneForm.phone",
																										},
																									}),
																								],
																								1,
																							),
																							t(
																								"el-form-item",
																								{
																									attrs: {
																										prop: "code",
																									},
																								},
																								[
																									t(
																										"div",
																										{
																											staticClass:
																												"verification-code-row",
																										},
																										[
																											t(
																												"el-input",
																												{
																													staticClass:
																														"code-input",
																													attrs: {
																														autocomplete:
																															"off",
																														placeholder:
																															"请输入验证码",
																														"prefix-icon":
																															"el-icon-message",
																													},
																													model: {
																														value: e
																															.bindPhoneForm
																															.code,
																														callback:
																															function (
																																t,
																															) {
																																e.$set(
																																	e.bindPhoneForm,
																																	"code",
																																	t,
																																)
																															},
																														expression:
																															"bindPhoneForm.code",
																													},
																												},
																											),
																											t(
																												"el-button",
																												{
																													staticClass:
																														"send-code-btn",
																													attrs: {
																														type: "primary",
																														disabled:
																															e.bindPhoneCountdown >
																															0,
																													},
																													on: {
																														click: e.sendBindPhoneCode,
																													},
																												},
																												[
																													e._v(
																														" " +
																															e._s(
																																e.bindPhoneCountdown >
																																	0
																																	? e.bindPhoneCountdown +
																																			"s后重发"
																																	: "发送验证码",
																															) +
																															" ",
																													),
																												],
																											),
																										],
																										1,
																									),
																								],
																							),
																							t(
																								"el-form-item",
																								[
																									t(
																										"el-button",
																										{
																											staticClass:
																												"login-btn",
																											attrs: {
																												type: "primary",
																											},
																											on: {
																												click: e.submitBindPhone,
																											},
																										},
																										[
																											e._v(
																												"确认绑定",
																											),
																										],
																									),
																								],
																								1,
																							),
																							t(
																								"el-form-item",
																								[
																									t(
																										"el-button",
																										{
																											staticClass:
																												"cancel-btn",
																											attrs: {
																												type: "text",
																											},
																											on: {
																												click: e.cancelBindPhone,
																											},
																										},
																										[
																											e._v(
																												"取消绑定",
																											),
																										],
																									),
																								],
																								1,
																							),
																						],
																						1,
																					),
																				],
																				1,
																			)
																		: t(
																				"div",
																				{ staticClass: "qrcode-container" },
																				[
																					t(
																						"div",
																						{ staticClass: "qrcode-box" },
																						[
																							"loading" === e.qrcodeStatus
																								? t(
																										"div",
																										{
																											staticClass:
																												"qrcode-loading",
																										},
																										[
																											t("i", {
																												staticClass:
																													"el-icon-loading",
																											}),
																											t("p", [
																												e._v(
																													"二维码生成中...",
																												),
																											]),
																										],
																									)
																								: "active" ===
																									  e.qrcodeStatus
																									? t(
																											"div",
																											{
																												staticClass:
																													"qrcode-active",
																											},
																											[
																												t(
																													"div",
																													{
																														staticClass:
																															"qrcode-image",
																													},
																													[
																														e.wxTicket
																															? t(
																																	"div",
																																	{
																																		staticClass:
																																			"qrcode-real",
																																	},
																																	[
																																		t(
																																			"img",
																																			{
																																				attrs: {
																																					src:
																																						"https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" +
																																						e.wxTicket,
																																					alt: "微信登录二维码",
																																				},
																																			},
																																		),
																																	],
																																)
																															: t(
																																	"div",
																																	{
																																		staticClass:
																																			"mock-qrcode",
																																	},
																																	[
																																		t(
																																			"i",
																																			{
																																				staticClass:
																																					"el-icon-mobile-phone",
																																			},
																																		),
																																		t(
																																			"p",
																																			[
																																				e._v(
																																					"二维码加载中...",
																																				),
																																			],
																																		),
																																	],
																																),
																													],
																												),
																												t(
																													"p",
																													{
																														staticClass:
																															"qrcode-tip",
																													},
																													[
																														e._v(
																															"请使用手机扫描二维码登录",
																														),
																													],
																												),
																											],
																										)
																									: "expired" ===
																										  e.qrcodeStatus
																										? t(
																												"div",
																												{
																													staticClass:
																														"qrcode-expired",
																												},
																												[
																													t(
																														"i",
																														{
																															staticClass:
																																"el-icon-refresh",
																														},
																													),
																													t(
																														"p",
																														[
																															e._v(
																																"二维码已过期",
																															),
																														],
																													),
																													t(
																														"p",
																														{
																															staticClass:
																																"auto-refresh-tip",
																														},
																														[
																															e._v(
																																"正在自动刷新...",
																															),
																														],
																													),
																													t(
																														"el-button",
																														{
																															staticClass:
																																"manual-refresh-btn",
																															attrs: {
																																type: "text",
																															},
																															on: {
																																click: e.refreshQrcode,
																															},
																														},
																														[
																															t(
																																"i",
																																{
																																	staticClass:
																																		"el-icon-refresh-right",
																																},
																															),
																															e._v(
																																" 立即刷新 ",
																															),
																														],
																													),
																												],
																												1,
																											)
																										: "scanned" ===
																											  e.qrcodeStatus
																											? t(
																													"div",
																													{
																														staticClass:
																															"qrcode-scanned",
																													},
																													[
																														t(
																															"i",
																															{
																																staticClass:
																																	"el-icon-success",
																															},
																														),
																														t(
																															"p",
																															[
																																e._v(
																																	"扫描成功，请在手机上确认登录",
																																),
																															],
																														),
																													],
																												)
																											: e._e(),
																						],
																					),
																				],
																			),
																],
															),
														],
														1,
													),
											t(
												"div",
												{ staticClass: "register" },
												[
													e.window.vscodeServices
														? t(
																"a",
																{
																	attrs: { href: "#" },
																	on: {
																		click: function (t) {
																			return (
																				t.preventDefault(),
																				e.openRegisterInBrowser.apply(
																					null,
																					arguments,
																				)
																			)
																		},
																	},
																},
																[e._v("没有账号,前往注册")],
															)
														: t("router-link", { attrs: { to: "/register" } }, [
																e._v("没有账号,前往注册"),
															]),
												],
												1,
											),
										],
										1,
									),
								]),
						t("icp"),
					],
					1,
				)
			},
			v = [
				function () {
					var e = this,
						t = e._self._c
					return t("div", { staticClass: "loading-spinner" }, [t("i", { staticClass: "el-icon-loading" })])
				},
				function () {
					var e = this,
						t = e._self._c
					return t("div", { staticClass: "login-brand" }, [
						t("img", { staticClass: "logo", attrs: { src: s("d4b0") } }),
						t("div", [e._v("登录傻蛋IM")]),
					])
				},
				function () {
					var e = this,
						t = e._self._c
					return t("div", { staticClass: "bind-phone-header" }, [t("p", [e._v("请绑定手机号以完成登录")])])
				},
			],
			C = (s("d9e2"), s("14d9"), s("88a7"), s("271a"), s("5494"), s("09fe")),
			I = s("cee4"),
			S = s("ec26"),
			w = {
				name: "login",
				components: { Icp: C["default"] },
				props: {
					isVSCodeEnvironment: { type: Boolean, default: !1 },
					vscodeServices: { type: Object, default: null },
				},
				data() {
					var e = (e, t, s) => {
							if (!t) return s(new Error("请输入用户名"))
							s()
						},
						t = (e, t, s) => {
							"" === t && s(new Error("请输入密码")), s()
						},
						s = (e, t, s) => {
							if (!t) return s(new Error("请输入手机号"))
							const i = /^1[3-9]\d{9}$/
							if (!i.test(t)) return s(new Error("请输入正确的手机号格式"))
							s()
						},
						i = (e, t, s) => {
							if (!t) return s(new Error("请输入验证码"))
							s()
						}
					return {
						autoLoginLoading: !1,
						autoLoginPhone: "",
						window: window,
						activeTab: "account",
						tabKey: 0,
						countdown: 0,
						timer: null,
						qrcodeStatus: "active",
						qrcodeTimer: null,
						wxTicketTimer: null,
						checkLoginTimer: null,
						UUID: Object(S["a"])(),
						wxTicket: "",
						bindPhone: !1,
						bindPhoneCountdown: 0,
						bindPhoneTimer: null,
						currentOpenid: "",
						userInfo: null,
						accountForm: { terminal: 0, terminalNo: 0, userName: "", password: "" },
						accountRules: {
							userName: [{ validator: e, trigger: "blur" }],
							password: [{ validator: t, trigger: "blur" }],
						},
						smsForm: { terminal: 0, terminalNo: 0, userName: "", password: "" },
						smsRules: {
							userName: [{ validator: s, trigger: "blur" }],
							password: [{ validator: i, trigger: "blur" }],
						},
						bindPhoneForm: { phone: "", code: "" },
						bindPhoneRules: {
							phone: [{ validator: s, trigger: "blur" }],
							code: [{ validator: i, trigger: "blur" }],
						},
					}
				},
				computed: {
					currentTerminalType() {
						return this.getCurrentTerminal()
					},
				},
				methods: {
					forceSetActiveTab(e) {
						console.log("[Login] Force setting tab to:", e, "from:", this.activeTab),
							(this.activeTab = e),
							this.$forceUpdate(),
							this.$nextTick(() => {
								console.log("[Login] Tab switched to:", this.activeTab),
									"qrcode" === e
										? ("active" === this.qrcodeStatus && this.startQrcodeTimer(),
											this.startWxTicketTimer(),
											this.startCheckLoginTimer())
										: (this.stopWxTicketTimer(), this.stopCheckLoginTimer())
							})
					},
					handleTabClick(e) {
						console.log("[Login] Tab clicked:", e.name, "current activeTab:", this.activeTab),
							this.isInVSCodeEnvironment() &&
								this.$nextTick(() => {
									;(this.activeTab = e.name),
										this.activeTab !== e.name &&
											(console.log("[Login] Force switching to tab:", e.name),
											(this.activeTab = e.name),
											this.tabKey++)
								})
					},
					isInVSCodeEnvironment() {
						return (
							this.isVSCodeEnvironment ||
							window.BoxIMComponents ||
							window.vscodeServices ||
							window.parent !== window ||
							window.acquireVsCodeApi ||
							navigator.userAgent.includes("VSCode") ||
							"vscode-webview:" === window.location.protocol
						)
					},
					getCurrentTerminal() {
						var e
						return "undefined" !== typeof window
							? window.parent !== window ||
								window.acquireVsCodeApi ||
								window.SharedServicesAccessor ||
								navigator.userAgent.includes("VSCode") ||
								"vscode-webview:" === window.location.protocol
								? this.$enums.TERMINAL_TYPE.VSCODE
								: window.require ||
									  (null !== (e = window.process) && void 0 !== e && e.type) ||
									  window.isElectron ||
									  navigator.userAgent.includes("Electron")
									? this.$enums.TERMINAL_TYPE.PC
									: window.cordova ||
										  window.PhoneGap ||
										  window.phonegap ||
										  navigator.userAgent.includes("wv") ||
										  navigator.userAgent.includes("Mobile")
										? this.$enums.TERMINAL_TYPE.APP
										: this.$enums.TERMINAL_TYPE.WEB
							: this.$enums.TERMINAL_TYPE.WEB
					},
					getUrlParam(e) {
						console.log("当前完整URL:", window.location.href),
							console.log("当前search:", window.location.search),
							console.log("当前hash:", window.location.hash)
						const t = new URLSearchParams(window.location.search)
						let s = t.get(e)
						if ((console.log(`从普通查询参数获取 ${e}:`, s), !s && window.location.hash)) {
							const t = window.location.hash
							console.log("处理hash:", t)
							const i = t.indexOf("?")
							if (-1 !== i) {
								const o = t.substring(i + 1)
								console.log("hash查询参数字符串:", o)
								const n = new URLSearchParams(o)
								;(s = n.get(e)), console.log(`从hash查询参数获取 ${e}:`, s)
							} else console.log("hash中没有找到查询参数")
						}
						return console.log(`最终获取参数 ${e}:`, s), s
					},
					async handleAutoLogin() {
						const e = this.getUrlParam("phone")
						if (e) {
							const s = /^1[3-9]\d{9}$/
							if (!s.test(e)) return void this.$message.error("URL中的手机号格式不正确")
							;(this.autoLoginPhone = e), (this.autoLoginLoading = !0)
							try {
								console.log("开始自动登录，手机号:", e)
								const t = await this.$http({
									url: "/phoneLoginInfo",
									method: "post",
									data: { phone: e, terminalNo: 0 },
									timeout: 1e4,
								})
								if ((console.log("自动登录用户信息查询成功:", t), !(t && t.userName && t.password)))
									throw new Error("用户信息不完整或用户不存在")
								{
									const e = {
										terminal: this.$enums.TERMINAL_TYPE.PLUGIN,
										terminalNo: 0,
										userName: t.userName,
										password: t.password,
										phone: t.phone,
									}
									await this.submitAutoLogin(e)
								}
							} catch (t) {
								console.error("自动登录失败:", t), (this.autoLoginLoading = !1)
								const e = t.message || "自动登录失败，请手动登录"
								this.$message.error(e),
									setTimeout(() => {
										this.autoLoginLoading = !1
									}, 3e3)
							}
						}
					},
					async submitAutoLogin(e) {
						try {
							const a = await this.$http({ url: "/loginByPhone", method: "post", data: e })
							if (
								(console.log("自动登录成功:", a),
								this.setCookie("username", e.userName),
								sessionStorage.setItem("accessToken", a.accessToken),
								sessionStorage.setItem("refreshToken", a.refreshToken),
								this.$message.success("自动登录成功"),
								console.log("[AutoLogin] Checking VSCode environment:", {
									isVSCodeEnvironment: this.isVSCodeEnvironment,
									hasVscodeServices: !!this.vscodeServices,
									vscodeServicesType: typeof this.vscodeServices,
								}),
								this.isVSCodeEnvironment && this.vscodeServices)
							) {
								var t, s
								const r = {
									userId: a.userId || a.id,
									username: e.userName,
									avatar: a.avatar,
									email: a.email,
									status: "online",
									lastLoginTime: Date.now(),
								}
								console.log("[AutoLogin] Notifying VSCode of login success:", r),
									this.$emit("success", r)
								let l = !1
								try {
									var i, o
									const e =
										null === (i = this.$vscode) ||
										void 0 === i ||
										null === (o = i.get) ||
										void 0 === o
											? void 0
											: o.call(i, "IUserStateService")
									null !== e &&
										void 0 !== e &&
										e.login &&
										(console.log("[坑爹位置]:", r),
										await e.login(r, a.accessToken),
										console.log(
											"[AutoLogin] 方式1：UserStateService.login调用完成，应该触发面板切换",
										),
										(l = !0))
								} catch (n) {
									console.warn("[AutoLogin] 方式1失败:", n)
								}
								if (!l && null !== (t = this.vscodeServices) && void 0 !== t && t.login)
									try {
										await this.vscodeServices.login(r, a.accessToken),
											console.log("[AutoLogin] 方式2：vscodeServices.login调用完成"),
											(l = !0)
									} catch (n) {
										console.warn("[AutoLogin] 方式2失败:", n)
									}
								if (!l && null !== (s = window.vscodeServices) && void 0 !== s && s.login)
									try {
										await window.vscodeServices.login(r, a.accessToken),
											console.log("[AutoLogin] 方式3：window.vscodeServices.login调用完成"),
											(l = !0)
									} catch (n) {
										console.warn("[AutoLogin] 方式3失败:", n)
									}
								l
									? (this.$http({ url: "/user/self", method: "GET" }).then((e) => {
											;(e.userId = e.id + ""),
												(e.username = e.nickName),
												(e.accessToken = a.accessToken),
												(e.apiKey = a.tokenKey),
												(e.terminal = 2),
												this.$store.commit("setUserInfo", e),
												this.$store.dispatch("setIsLoggedIn", !0)
										}),
										this.vscodeServices.showInfo("自动登录成功！"),
										console.log("[AutoLogin] VSCode notification sent successfully"))
									: (console.error("[AutoLogin] 所有登录方式都失败"),
										this.vscodeServices.showError("登录通知失败"))
							} else {
								console.log(
									"[AutoLogin] Not in VSCode environment or services not available, using router",
								)
								const e = this.getUrlParam("phone")
								e
									? (console.log("[AutoLogin] URL contains phone parameter, redirecting to /plugin"),
										this.$router.push("/plugin"))
									: (console.log(
											"[AutoLogin] URL does not contain phone parameter, redirecting to /home/chat",
										),
										this.$router.push("/home/chat"))
							}
						} catch (n) {
							throw (console.error("自动登录提交失败:", n), n)
						}
					},
					validatePhoneNumber(e) {
						const t = /^1[3-9]\d{9}$/
						return t.test(e)
					},
					sendCode() {
						if (!this.smsForm.userName) return void this.$message.error("请先输入手机号")
						const e = /^1[3-9]\d{9}$/
						e.test(this.smsForm.userName)
							? (console.log("发送验证码到手机号:", this.smsForm.userName),
								Object(I["a"])({
									url: "https://shadan.web.service.thinkgs.cn/jeecg-boot/sys/sendsms",
									method: "post",
									data: { mobile: this.smsForm.userName },
									timeout: 1e4,
								})
									.then((e) => {
										console.log("验证码发送响应:", e.data),
											e.data && !0 === e.data.success
												? (this.$message.success("验证码已发送"),
													localStorage.setItem("sms", e.data.result),
													this.startCountdown())
												: (console.error("服务器返回错误:", e.data),
													this.$message.error(e.data.message || "验证码发送失败"))
									})
									.catch((e) => {
										console.error("验证码发送失败:", e)
										let t = "验证码发送失败，请稍后重试"
										if (e.response && e.response.data) {
											const s = e.response.data
											!1 === s.success && (t = s.message || t)
										} else e.message && (t = e.message)
										this.$message.error(t)
									}))
							: this.$message.error("请输入正确的手机号格式")
					},
					GetWxTicket() {
						console.log("调用GetWxTicket方法，UUID:", this.UUID),
							Object(I["a"])({
								url:
									"https://shadan.web.service.thinkgs.cn/jeecg-boot/sys/getWxTicket?senceId=" +
									this.UUID,
								method: "get",
								timeout: 1e4,
							})
								.then((e) => {
									console.log("获取微信ticket成功:", e.data), (this.wxTicket = e.data.result)
								})
								.catch((e) => {
									console.error("获取微信ticket失败:", e)
								})
					},
					startCountdown() {
						;(this.countdown = 60),
							(this.timer = setInterval(() => {
								this.countdown--,
									this.countdown <= 0 && (clearInterval(this.timer), (this.timer = null))
							}, 1e3))
					},
					CheckLogin() {
						Object(I["a"])({
							url:
								"https://shadan.web.service.thinkgs.cn/jeecg-boot/sys/signInBySenceId?senceId=" +
								this.UUID,
							method: "get",
							timeout: 1e4,
						})
							.then((e) => {
								console.log("获取微信扫码登录:", e.data),
									e.data.success &&
										(this.stopCheckLoginTimer(),
										console.log("获取微信扫码登录:", e.data.result.userInfo.openid),
										(this.currentOpenid = e.data.result.userInfo.openid),
										this.$http({
											url: "/findUserByOpenid",
											method: "post",
											data: { openid: e.data.result.userInfo.openid, terminalNo: 0 },
										}).then(async (e) => {
											console.log("通过openid查询用户", e),
												(this.userInfo = e),
												null != e && null != e.phone && "" != e.phone
													? ((this.accountForm.userName = e.userName),
														(this.accountForm.password = e.password),
														(this.accountForm.phone = e.phone),
														(this.accountForm.tokenKey = e.tokenKey),
														this.submitLogin2(this.accountForm))
													: (this.bindPhone = !0)
										}))
							})
							.catch((e) => {
								console.error("获取微信扫码登录失败:", e)
							})
					},
					submitAccountForm() {
						const e = this.isInVSCodeEnvironment()
							? this.$refs.accountForm
							: this.$refs.accountFormWeb || this.$refs.accountForm
						e &&
							e.validate(async (e) => {
								e && this.submitLogin(this.accountForm)
							})
					},
					submitSmsForm() {
						const e = this.isInVSCodeEnvironment()
							? this.$refs.smsForm
							: this.$refs.smsFormWeb || this.$refs.smsForm
						e &&
							e.validate(async (e) => {
								e && this.submitLogin(this.smsForm)
							})
					},
					submitLogin(e) {
						this.$http({ url: "/login", method: "post", data: e }).then(async (t) => {
							this.setCookie("username", e.userName),
								this.setCookie("password", e.password),
								sessionStorage.setItem("accessToken", t.accessToken),
								sessionStorage.setItem("refreshToken", t.refreshToken),
								sessionStorage.setItem("tokenKey", t.tokenKey),
								window.BoxIMComponents
									? this.$http({ url: "/user/self", method: "GET" }).then((e) => {
											var s
											;(e.userId = e.id + ""),
												(e.username = e.nickName),
												(e.tokenKey = t.tokenKey),
												(e.accessToken = t.accessToken),
												(e.apiKey = t.tokenKey),
												(e.terminal = 2),
												this.$store.commit("setUserInfo", e),
												console.log("[坑爹位置]:", e),
												null === (s = window.vscodeServices) ||
													void 0 === s ||
													s.get("IUserStateService").login(e, t.accessToken),
												this.$store.dispatch("setIsLoggedIn", !0)
										})
									: (console.log(
											"[Login] Not in VSCode environment or services not available, using router",
										),
										this.$router.push("/home/chat"))
						})
					},
					submitLogin2(e) {
						this.$http({ url: "/loginByPhone", method: "post", data: e }).then(async (t) => {
							console.log("短信登录成功:", t),
								this.setCookie("username", e.userName),
								sessionStorage.setItem("accessToken", t.accessToken),
								sessionStorage.setItem("refreshToken", t.refreshToken),
								sessionStorage.setItem("tokenKey", e.tokenKey),
								localStorage.removeItem("sms"),
								window.BoxIMComponents
									? this.$http({ url: "/user/self", method: "GET" }).then((s) => {
											var i
											;(s.userId = s.id + ""),
												(s.username = s.nickName),
												(s.accessToken = t.accessToken),
												(s.apiKey = e.tokenKey),
												(s.terminal = 2),
												this.$store.commit("setUserInfo", s),
												console.log("[坑爹位置]:", s),
												null === (i = window.vscodeServices) ||
													void 0 === i ||
													i.get("IUserStateService").login(s, t.accessToken),
												this.$store.dispatch("setIsLoggedIn", !0)
										})
									: (console.log(
											"[Login] Not in VSCode environment or services not available, using router",
										),
										this.$router.push("/home/chat"))
						})
					},
					phoneLogin() {
						Object(I["a"])({
							url:
								"https://shadan.web.service.thinkgs.cn/jeecg-boot/sys/getCodeByPhone?phone=" +
								this.smsForm.userName,
							method: "get",
							timeout: 1e4,
						}).then((e) => {
							if (
								(console.log("短信登录响应:", e.data),
								"" != localStorage.getItem("sms") && null != localStorage.getItem("sms"))
							)
								if (this.smsForm.password == localStorage.getItem("sms")) {
									if (!this.smsForm.userName) return void this.$message.error("请先输入手机号")
									if (!this.smsForm.password) return void this.$message.error("请输入验证码")
									const e = /^1[3-9]\d{9}$/
									if (!e.test(this.smsForm.userName))
										return void this.$message.error("请输入正确的手机号格式")
									const t = localStorage.getItem("sms")
									if (!t || "" === t) return void this.$message.error("请重新发送验证码")
									if ((console.log("验证码:", this.smsForm.password, t), this.smsForm.password !== t))
										return void this.$message.error("验证码不正确")
									this.$http({
										url: "/phoneLoginInfo",
										method: "post",
										data: {
											phone: this.smsForm.userName,
											terminal: this.currentTerminalType,
											terminalNo: 0,
										},
										timeout: 1e4,
									})
										.then((e) => {
											console.log("用户信息查询成功:", e),
												(this.accountForm.userName = e.userName),
												(this.accountForm.password = e.password),
												(this.accountForm.phone = e.phone),
												(this.accountForm.tokenKey = e.tokenKey),
												this.submitLogin2(this.accountForm)
										})
										.catch((e) => {
											console.error("用户信息查询失败:", e),
												this.$message.error(e.message || "用户信息查询失败")
										})
								} else this.$message.error("验证码错误")
							else this.$message.error("请重新发送验证码")
						})
					},
					submitForm(e) {
						"account" === this.activeTab
							? this.submitAccountForm()
							: "sms" === this.activeTab && this.submitSmsForm()
					},
					startQrcodeTimer() {
						this.qrcodeTimer && clearTimeout(this.qrcodeTimer),
							(this.qrcodeTimer = setTimeout(() => {
								"active" === this.qrcodeStatus &&
									((this.qrcodeStatus = "expired"),
									console.log("二维码已过期，3秒后自动刷新"),
									setTimeout(() => {
										this.refreshQrcode()
									}, 3e3))
							}, 12e4))
					},
					refreshQrcode() {
						console.log("开始刷新二维码"),
							(this.UUID = Object(S["a"])()),
							(this.qrcodeStatus = "loading"),
							(this.wxTicket = ""),
							this.stopWxTicketTimer(),
							this.stopCheckLoginTimer(),
							setTimeout(() => {
								;(this.qrcodeStatus = "active"),
									this.startWxTicketTimer(),
									this.startCheckLoginTimer(),
									this.startQrcodeTimer(),
									console.log("二维码刷新完成")
							}, 500)
					},
					resetForm(e) {
						this.$refs[e] && this.$refs[e].resetFields()
					},
					getCookie(e) {
						let t = new RegExp("(^| )" + e + "=([^;]*)(;|$)"),
							s = document.cookie.match(t)
						return s ? unescape(s[2]) : ""
					},
					setCookie(e, t) {
						document.cookie = e + "=" + escape(t)
					},
					startCheckLoginTimer() {
						console.log("启动CheckLogin定时器"),
							this.stopCheckLoginTimer(),
							this.CheckLogin(),
							(this.checkLoginTimer = setInterval(() => {
								this.CheckLogin()
							}, 1e3))
					},
					stopCheckLoginTimer() {
						this.checkLoginTimer &&
							(console.log("停止CheckLogin定时器"),
							clearInterval(this.checkLoginTimer),
							(this.checkLoginTimer = null))
					},
					startWxTicketTimer() {
						console.log("启动微信ticket定时器"),
							this.stopWxTicketTimer(),
							this.GetWxTicket(),
							(this.wxTicketTimer = setInterval(() => {
								this.GetWxTicket()
							}, 6e4))
					},
					stopWxTicketTimer() {
						this.wxTicketTimer &&
							(console.log("停止微信ticket定时器"),
							clearInterval(this.wxTicketTimer),
							(this.wxTicketTimer = null))
					},
					sendBindPhoneCode() {
						if (!this.bindPhoneForm.phone) return void this.$message.error("请先输入手机号")
						const e = /^1[3-9]\d{9}$/
						e.test(this.bindPhoneForm.phone)
							? (console.log("发送绑定手机号验证码到:", this.bindPhoneForm.phone),
								Object(I["a"])({
									url: "https://shadan.web.service.thinkgs.cn/jeecg-boot/sys/sendsms",
									method: "post",
									data: { mobile: this.bindPhoneForm.phone },
									timeout: 1e4,
								})
									.then((e) => {
										console.log("绑定手机号验证码发送响应:", e.data),
											e.data && !0 === e.data.success
												? (this.$message.success("验证码已发送"),
													localStorage.setItem("bindPhoneSms", e.data.result),
													this.startBindPhoneCountdown())
												: (console.error("服务器返回错误:", e.data),
													this.$message.error(e.data.message || "验证码发送失败"))
									})
									.catch((e) => {
										console.error("绑定手机号验证码发送失败:", e)
										let t = "验证码发送失败，请稍后重试"
										if (e.response && e.response.data) {
											const s = e.response.data
											!1 === s.success && (t = s.message || t)
										} else e.message && (t = e.message)
										this.$message.error(t)
									}))
							: this.$message.error("请输入正确的手机号格式")
					},
					startBindPhoneCountdown() {
						;(this.bindPhoneCountdown = 60),
							(this.bindPhoneTimer = setInterval(() => {
								this.bindPhoneCountdown--,
									this.bindPhoneCountdown <= 0 &&
										(clearInterval(this.bindPhoneTimer), (this.bindPhoneTimer = null))
							}, 1e3))
					},
					submitBindPhone() {
						this.$refs.bindPhoneForm.validate(async (e) => {
							if (e) {
								const e = localStorage.getItem("bindPhoneSms")
								if (!e || "" === e) return void this.$message.error("请重新发送验证码")
								if (this.bindPhoneForm.code !== e) return void this.$message.error("验证码不正确")
								console.log("绑定手机号:", this.bindPhoneForm.phone, "openid:", this.currentOpenid),
									this.$http({
										url: "/phoneLoginInfo",
										method: "post",
										data: {
											phone: this.bindPhoneForm.phone,
											terminal: this.currentTerminalType,
											terminalNo: 0,
										},
										timeout: 1e4,
									})
										.then((e) => {
											console.log("绑定后用户信息查询成功:", e),
												(this.accountForm.userName = e.userName),
												(this.accountForm.password = e.password),
												(this.accountForm.phone = e.phone),
												(this.accountForm.tokenKey = e.tokenKey),
												this.$http({
													url: "/user/update2",
													method: "put",
													data: {
														id: e.id,
														userName: e.userName,
														phone: this.bindPhoneForm.phone,
														openid: this.currentOpenid,
														nickName: e.nickName,
													},
												}).then(() => {
													this.submitLogin2(this.accountForm),
														localStorage.removeItem("bindPhoneSms")
												}),
												(this.bindPhone = !1),
												(this.bindPhoneForm.phone = ""),
												(this.bindPhoneForm.code = "")
										})
										.catch((e) => {
											console.error("绑定后用户信息查询失败:", e),
												this.$message.error(e.message || "绑定失败")
										})
							}
						})
					},
					cancelBindPhone() {
						;(this.bindPhone = !1),
							(this.bindPhoneForm.phone = ""),
							(this.bindPhoneForm.code = ""),
							(this.currentOpenid = ""),
							localStorage.removeItem("bindPhoneSms"),
							this.bindPhoneTimer &&
								(clearInterval(this.bindPhoneTimer),
								(this.bindPhoneTimer = null),
								(this.bindPhoneCountdown = 0)),
							this.startWxTicketTimer(),
							this.startCheckLoginTimer(),
							this.$message.info("已取消绑定")
					},
					openRegisterInBrowser() {
						console.log("[Register] Opening register page in browser from VSCode environment")
						const e = "https://aiim.service.thinkgs.cn/#/register"
						console.log("[Register] Register URL:", e),
							window.vscodeServices && window.vscodeServices.openExternal
								? (window.vscodeServices.openExternal(e),
									console.log("[Register] Opened register page using vscodeServices.openExternal"))
								: window.vscodeServices && window.vscodeServices.showInfo
									? (window.vscodeServices.showInfo("请在浏览器中打开: " + e),
										console.log("[Register] Showed info message with register URL"))
									: (window.open(e, "_blank"),
										console.log("[Register] Opened register page using window.open"))
					},
				},
				mounted() {
					var e, t, s, i, o
					this.handleAutoLogin(),
						(this.accountForm.terminal = this.currentTerminalType),
						(this.accountForm.terminalNo = 0),
						(this.smsForm.terminal = this.currentTerminalType),
						(this.smsForm.terminalNo = 0),
						(this.accountForm.userName = this.getCookie("username")),
						(this.accountForm.password = this.getCookie("password")),
						console.log("[Login] Component mounted with props:", {
							isVSCodeEnvironment: this.isVSCodeEnvironment,
							vscodeServices: this.vscodeServices,
							hasVscodeServices: !!this.vscodeServices,
						}),
						console.log("[Login] Store状态检查:", {
							hasStore: !!this.$store,
							hasState: !(null === (e = this.$store) || void 0 === e || !e.state),
							hasUserStore: !(
								null === (t = this.$store) ||
								void 0 === t ||
								null === (t = t.state) ||
								void 0 === t ||
								!t.userStore
							),
							currentIsLoggedIn:
								null === (s = this.$store) ||
								void 0 === s ||
								null === (s = s.state) ||
								void 0 === s ||
								null === (s = s.userStore) ||
								void 0 === s
									? void 0
									: s.isLoggedIn,
							hasSetIsLoggedInAction: !(
								null === (i = this.$store) ||
								void 0 === i ||
								null === (i = i._actions) ||
								void 0 === i ||
								!i.setIsLoggedIn
							),
							storeModules:
								null !== (o = this.$store) && void 0 !== o && o.state
									? Object.keys(this.$store.state)
									: "no state",
						}),
						"qrcode" === this.activeTab &&
							(this.startQrcodeTimer(), this.startWxTicketTimer(), this.startCheckLoginTimer())
				},
				watch: {
					activeTab(e, t) {
						console.log("[Login] Tab switching:", t, "->", e),
							this.isInVSCodeEnvironment() &&
								this.$nextTick(() => {
									"account" === e && this.$refs.accountForm
										? console.log("[Login] Resetting account form for VSCode")
										: "sms" === e &&
											this.$refs.smsForm &&
											console.log("[Login] Resetting SMS form for VSCode")
								}),
							"qrcode" === e
								? ("active" === this.qrcodeStatus && this.startQrcodeTimer(),
									this.startWxTicketTimer(),
									this.startCheckLoginTimer())
								: (this.stopWxTicketTimer(), this.stopCheckLoginTimer())
					},
				},
				beforeDestroy() {
					this.timer && clearInterval(this.timer),
						this.qrcodeTimer && clearTimeout(this.qrcodeTimer),
						this.stopWxTicketTimer(),
						this.stopCheckLoginTimer(),
						this.bindPhoneTimer && (clearInterval(this.bindPhoneTimer), (this.bindPhoneTimer = null))
				},
			},
			T = w,
			b = (s("46fd"), Object(u["a"])(T, f, v, !1, null, "f811964e", null)),
			y = b.exports,
			x = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-container",
					{ staticClass: "register-view" },
					[
						t(
							"div",
							[
								t(
									"el-form",
									{
										ref: "registerForm",
										staticClass: "web-ruleForm",
										attrs: {
											model: e.registerForm,
											"status-icon": "",
											rules: e.rules,
											"label-width": "80px",
										},
									},
									[
										t("div", { staticClass: "register-brand" }, [
											t("img", { staticClass: "logo", attrs: { src: s("d4b0") } }),
											t("div", [e._v("登录傻蛋IM")]),
										]),
										t(
											"el-form-item",
											{ attrs: { label: "用户名", prop: "userName" } },
											[
												t("el-input", {
													attrs: {
														type: "userName",
														autocomplete: "off",
														placeholder: "用户名(登录使用)",
													},
													model: {
														value: e.registerForm.userName,
														callback: function (t) {
															e.$set(e.registerForm, "userName", t)
														},
														expression: "registerForm.userName",
													},
												}),
											],
											1,
										),
										t(
											"el-form-item",
											{ attrs: { label: "昵称", prop: "nickName" } },
											[
												t("el-input", {
													attrs: {
														type: "nickName",
														autocomplete: "off",
														placeholder: "昵称",
													},
													model: {
														value: e.registerForm.nickName,
														callback: function (t) {
															e.$set(e.registerForm, "nickName", t)
														},
														expression: "registerForm.nickName",
													},
												}),
											],
											1,
										),
										t(
											"el-form-item",
											{ attrs: { label: "密码", prop: "password" } },
											[
												t("el-input", {
													attrs: {
														type: "password",
														autocomplete: "off",
														placeholder: "密码",
													},
													model: {
														value: e.registerForm.password,
														callback: function (t) {
															e.$set(e.registerForm, "password", t)
														},
														expression: "registerForm.password",
													},
												}),
											],
											1,
										),
										t(
											"el-form-item",
											{ attrs: { label: "确认密码", prop: "confirmPassword" } },
											[
												t("el-input", {
													attrs: {
														type: "password",
														autocomplete: "off",
														placeholder: "确认密码",
													},
													model: {
														value: e.registerForm.confirmPassword,
														callback: function (t) {
															e.$set(e.registerForm, "confirmPassword", t)
														},
														expression: "registerForm.confirmPassword",
													},
												}),
											],
											1,
										),
										t(
											"el-form-item",
											{ attrs: { label: "手机号", prop: "phone" } },
											[
												t("el-input", {
													attrs: {
														type: "phone",
														autocomplete: "off",
														placeholder: "手机号",
													},
													model: {
														value: e.registerForm.phone,
														callback: function (t) {
															e.$set(e.registerForm, "phone", t)
														},
														expression: "registerForm.phone",
													},
												}),
											],
											1,
										),
										t(
											"el-form-item",
											[
												t(
													"el-button",
													{
														attrs: { type: "primary" },
														on: {
															click: function (t) {
																return e.submitForm("registerForm")
															},
														},
													},
													[e._v("注册")],
												),
												t(
													"el-button",
													{
														on: {
															click: function (t) {
																return e.resetForm("registerForm")
															},
														},
													},
													[e._v("清空")],
												),
											],
											1,
										),
										t(
											"div",
											{ staticClass: "to-login" },
											[
												t("router-link", { attrs: { to: "/login" } }, [
													e._v("已有账号,前往登录"),
												]),
											],
											1,
										),
									],
									1,
								),
							],
							1,
						),
						t("icp"),
					],
					1,
				)
			},
			A = [],
			$ = {
				name: "login",
				components: { Icp: C["default"] },
				data() {
					var e = (e, t, s) => {
							if (!t) return s(new Error("请输入用户名"))
							s()
						},
						t = (e, t, s) => {
							if (!t) return s(new Error("请输入昵称"))
							s()
						},
						s = (e, t, s) => {
							if ("" === t) return s(new Error("请输入密码"))
							s()
						},
						i = (e, t, s) =>
							"" === t
								? s(new Error("请输入密码"))
								: t != this.registerForm.password
									? s(new Error("两次密码输入不一致"))
									: void s(),
						o = (e, t, s) => {
							if (!t) return s(new Error("请输入手机号"))
							const i = /^1[3-9]\d{9}$/
							if (!i.test(t)) return s(new Error("请输入正确的手机号格式"))
							s()
						}
					return {
						registerForm: {
							userName: "",
							nickName: "",
							password: "",
							confirmPassword: "",
							phone: "",
							terminalNo: 0,
						},
						rules: {
							userName: [{ validator: e, trigger: "blur" }],
							nickName: [{ validator: t, trigger: "blur" }],
							password: [{ validator: s, trigger: "blur" }],
							confirmPassword: [{ validator: i, trigger: "blur" }],
							phone: [{ validator: o, trigger: "blur" }],
						},
					}
				},
				methods: {
					submitForm(e) {
						this.$refs[e].validate((e) => {
							e &&
								this.$http({ url: "/register", method: "post", data: this.registerForm })
									.then((e) => {
										this.$message.success("注册成功!"),
											setTimeout(() => {
												this.$router.push("/login")
											}, 1500)
									})
									.catch((e) => {
										var t
										this.$message.error(
											"注册失败: " +
												((null === (t = e.response) ||
												void 0 === t ||
												null === (t = t.data) ||
												void 0 === t
													? void 0
													: t.message) || e.message),
										)
									})
						})
					},
					resetForm(e) {
						this.$refs[e].resetFields()
					},
				},
			},
			E = $,
			k = (s("54e3"), Object(u["a"])(E, x, A, !1, null, "8363db98", null)),
			M = k.exports,
			N = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{
						staticClass: "home-page",
						on: {
							click: function (t) {
								return e.$store.commit("closeUserInfoBox")
							},
						},
					},
					[
						t(
							"div",
							{ staticClass: "app-container", class: { fullscreen: e.isFullscreen } },
							[
								t("div", { staticClass: "navi-bar" }, [
									t("div", { staticClass: "navi-bar-box" }, [
										t("div", { staticClass: "top" }, [
											t(
												"div",
												{ staticClass: "user-head-image" },
												[
													t("head-image", {
														attrs: {
															name: e.$store.state.userStore.userInfo.nickName,
															size: 38,
															url: e.$store.state.userStore.userInfo.headImageThumb,
														},
														nativeOn: {
															click: function (t) {
																e.showSettingDialog = !0
															},
														},
													}),
												],
												1,
											),
											t(
												"div",
												{ staticClass: "menu" },
												[
													t(
														"router-link",
														{ staticClass: "link", attrs: { to: "/home/chat" } },
														[
															t("div", { staticClass: "menu-item" }, [
																t("span", { staticClass: "icon iconfont icon-chat" }),
																t(
																	"div",
																	{
																		directives: [
																			{
																				name: "show",
																				rawName: "v-show",
																				value: e.unreadCount > 0,
																				expression: "unreadCount > 0",
																			},
																		],
																		staticClass: "unread-text",
																	},
																	[e._v(e._s(e.unreadCount))],
																),
															]),
														],
													),
													t(
														"router-link",
														{ staticClass: "link", attrs: { to: "/home/friend" } },
														[
															t("div", { staticClass: "menu-item" }, [
																t("span", { staticClass: "icon iconfont icon-friend" }),
															]),
														],
													),
													t(
														"router-link",
														{ staticClass: "link", attrs: { to: "/home/group" } },
														[
															t("div", { staticClass: "menu-item" }, [
																t("span", {
																	staticClass: "icon iconfont icon-group",
																	staticStyle: { "font-size": "28px" },
																}),
															]),
														],
													),
												],
												1,
											),
										]),
										t("div", { staticClass: "botoom" }, [
											t(
												"div",
												{
													staticClass: "botoom-item",
													on: {
														click: function (t) {
															e.isFullscreen = !e.isFullscreen
														},
													},
												},
												[t("i", { staticClass: "el-icon-full-screen" })],
											),
											t("div", { staticClass: "botoom-item", on: { click: e.showSetting } }, [
												t("span", {
													staticClass: "icon iconfont icon-setting",
													staticStyle: { "font-size": "20px" },
												}),
											]),
											t(
												"div",
												{
													staticClass: "botoom-item",
													attrs: { title: "退出" },
													on: {
														click: function (t) {
															return e.onExit()
														},
													},
												},
												[t("span", { staticClass: "icon iconfont icon-exit" })],
											),
										]),
									]),
								]),
								t("div", { staticClass: "content-box" }, [t("router-view")], 1),
								t("setting", {
									attrs: { visible: e.showSettingDialog },
									on: {
										close: function (t) {
											return e.closeSetting()
										},
									},
								}),
								t("user-info", {
									directives: [
										{
											name: "show",
											rawName: "v-show",
											value: e.uiStore.userInfo.show,
											expression: "uiStore.userInfo.show",
										},
									],
									attrs: { pos: e.uiStore.userInfo.pos, user: e.uiStore.userInfo.user },
									on: {
										close: function (t) {
											return e.$store.commit("closeUserInfoBox")
										},
									},
								}),
								t("full-image", {
									attrs: { visible: e.uiStore.fullImage.show, url: e.uiStore.fullImage.url },
									on: {
										close: function (t) {
											return e.$store.commit("closeFullImageBox")
										},
									},
								}),
								t("rtc-private-video", { ref: "rtcPrivateVideo" }),
								t("rtc-group-video", { ref: "rtcGroupVideo" }),
							],
							1,
						),
					],
				)
			},
			_ = [],
			P = (s("0643"), s("4e3e"), s("4036")),
			R = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-dialog",
					{
						staticClass: "setting",
						attrs: { title: "设置", visible: e.visible, width: "420px", "before-close": e.onClose },
						on: {
							"update:visible": function (t) {
								e.visible = t
							},
						},
					},
					[
						t(
							"el-form",
							{
								ref: "settingForm",
								attrs: { model: e.userInfo, "label-width": "80px", rules: e.rules, size: "small" },
							},
							[
								t(
									"el-form-item",
									{ staticStyle: { "margin-bottom": "0 !important" }, attrs: { label: "头像" } },
									[
										t(
											"file-upload",
											{
												staticClass: "avatar-uploader",
												attrs: {
													action: e.imageAction,
													showLoading: !0,
													maxSize: e.maxSize,
													fileTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
												},
												on: { success: e.onUploadSuccess },
											},
											[
												e.userInfo.headImage
													? t("img", {
															staticClass: "avatar",
															attrs: { src: e.userInfo.headImage },
														})
													: t("i", { staticClass: "el-icon-plus avatar-uploader-icon" }),
											],
										),
									],
									1,
								),
								t(
									"el-form-item",
									{ attrs: { label: "用户名" } },
									[
										t("el-input", {
											attrs: { disabled: "", autocomplete: "off", size: "small" },
											model: {
												value: e.userInfo.userName,
												callback: function (t) {
													e.$set(e.userInfo, "userName", t)
												},
												expression: "userInfo.userName",
											},
										}),
									],
									1,
								),
								t(
									"el-form-item",
									{ attrs: { prop: "nickName", label: "昵称" } },
									[
										t("el-input", {
											attrs: { autocomplete: "off", size: "small" },
											model: {
												value: e.userInfo.nickName,
												callback: function (t) {
													e.$set(e.userInfo, "nickName", t)
												},
												expression: "userInfo.nickName",
											},
										}),
									],
									1,
								),
								t(
									"el-form-item",
									{ attrs: { label: "性别" } },
									[
										t(
											"el-radio-group",
											{
												model: {
													value: e.userInfo.sex,
													callback: function (t) {
														e.$set(e.userInfo, "sex", t)
													},
													expression: "userInfo.sex",
												},
											},
											[
												t("el-radio", { attrs: { label: 0 } }, [e._v("男")]),
												t("el-radio", { attrs: { label: 1 } }, [e._v("女")]),
											],
											1,
										),
									],
									1,
								),
								t(
									"el-form-item",
									{ attrs: { label: "个性签名" } },
									[
										t("el-input", {
											attrs: { type: "textarea", rows: 3 },
											model: {
												value: e.userInfo.signature,
												callback: function (t) {
													e.$set(e.userInfo, "signature", t)
												},
												expression: "userInfo.signature",
											},
										}),
									],
									1,
								),
							],
							1,
						),
						t(
							"span",
							{ staticClass: "dialog-footer", attrs: { slot: "footer" }, slot: "footer" },
							[
								t(
									"el-button",
									{
										on: {
											click: function (t) {
												return e.onClose()
											},
										},
									},
									[e._v("取 消")],
								),
								t(
									"el-button",
									{
										attrs: { type: "primary" },
										on: {
											click: function (t) {
												return e.onSubmit()
											},
										},
									},
									[e._v("确 定")],
								),
							],
							1,
						),
					],
					1,
				)
			},
			F = [],
			D = s("1a05"),
			L = {
				name: "setting",
				components: { FileUpload: D["a"] },
				data() {
					return {
						userInfo: {},
						maxSize: 5242880,
						action: "/image/upload",
						rules: { nickName: [{ required: !0, message: "请输入昵称", trigger: "blur" }] },
					}
				},
				methods: {
					onClose() {
						this.$emit("close")
					},
					onSubmit() {
						this.$refs["settingForm"].validate((e) => {
							if (!e) return !1
							this.$http({ url: "/user/update", method: "put", data: this.userInfo }).then(() => {
								this.$store.commit("setUserInfo", this.userInfo),
									this.$emit("close"),
									this.$message.success("修改成功")
							})
						})
					},
					onUploadSuccess(e, t) {
						;(this.userInfo.headImage = e.originUrl), (this.userInfo.headImageThumb = e.thumbUrl)
					},
				},
				props: { visible: { type: Boolean } },
				computed: {
					imageAction() {
						return "/image/upload"
					},
				},
				watch: {
					visible: function (e, t) {
						let s = this.$store.state.userStore.userInfo
						this.userInfo = JSON.parse(JSON.stringify(s))
					},
				},
			},
			G = L,
			O = (s("6490"), Object(u["a"])(G, R, F, !1, null, null, null)),
			V = O.exports,
			B = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{
						staticClass: "user-info-mask",
						on: {
							click: function (t) {
								return e.$emit("close")
							},
						},
					},
					[
						t(
							"div",
							{
								staticClass: "user-info",
								style: { left: e.pos.x + "px", top: e.pos.y + "px" },
								on: {
									click: function (e) {
										e.stopPropagation()
									},
								},
							},
							[
								t("div", { staticClass: "user-info-box" }, [
									t(
										"div",
										{ staticClass: "avatar" },
										[
											t("head-image", {
												attrs: {
													name: e.user.nickName,
													url: e.user.headImageThumb,
													size: 70,
													online: e.user.online,
													radius: "10%",
												},
												nativeOn: {
													click: function (t) {
														return e.showFullImage()
													},
												},
											}),
										],
										1,
									),
									t(
										"div",
										[
											t(
												"el-descriptions",
												{
													staticClass: "user-info-items",
													attrs: { column: 1, title: e.user.nickName },
												},
												[
													t("el-descriptions-item", { attrs: { label: "用户名" } }, [
														e._v(e._s(e.user.userName) + " "),
													]),
													t("el-descriptions-item", { attrs: { label: "签名" } }, [
														e._v(e._s(e.user.signature) + " "),
													]),
												],
												1,
											),
										],
										1,
									),
								]),
								t("el-divider", { attrs: { "content-position": "center" } }),
								t(
									"div",
									{ staticClass: "user-btn-group" },
									[
										t(
											"el-button",
											{
												directives: [
													{
														name: "show",
														rawName: "v-show",
														value: e.isFriend,
														expression: "isFriend",
													},
												],
												attrs: { type: "primary" },
												on: {
													click: function (t) {
														return e.onSendMessage()
													},
												},
											},
											[e._v("发消息")],
										),
										t(
											"el-button",
											{
												directives: [
													{
														name: "show",
														rawName: "v-show",
														value: !e.isFriend,
														expression: "!isFriend",
													},
												],
												attrs: { type: "primary" },
												on: {
													click: function (t) {
														return e.onAddFriend()
													},
												},
											},
											[e._v("加为好友")],
										),
									],
									1,
								),
							],
							1,
						),
					],
				)
			},
			U = [],
			z = {
				name: "userInfo",
				components: { HeadImage: P["a"] },
				data() {
					return {}
				},
				props: { user: { type: Object }, pos: { type: Object } },
				methods: {
					onSendMessage() {
						let e = this.user,
							t = { type: "PRIVATE", targetId: e.id, showName: e.nickName, headImage: e.headImage }
						this.$store.commit("openChat", t),
							this.$store.commit("activeChat", 0),
							"/home/chat" != this.$route.path && this.$router.push("/home/chat"),
							this.$emit("close")
					},
					onAddFriend() {
						this.$http({ url: "/friend/add", method: "post", params: { friendId: this.user.id } }).then(
							() => {
								this.$message.success("添加成功，对方已成为您的好友")
								let e = {
									id: this.user.id,
									nickName: this.user.nickName,
									headImage: this.user.headImageThumb,
									online: this.user.online,
									deleted: !1,
								}
								this.$store.commit("addFriend", e)
							},
						)
					},
					showFullImage() {
						this.user.headImage && this.$store.commit("showFullImageBox", this.user.headImage)
					},
				},
				computed: {
					isFriend() {
						return this.$store.getters.isFriend(this.user.id)
					},
				},
			},
			j = z,
			H = (s("8786"), Object(u["a"])(j, B, U, !1, null, null, null)),
			q = H.exports,
			W = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{
						directives: [{ name: "show", rawName: "v-show", value: e.visible, expression: "visible" }],
						staticClass: "full-image",
						attrs: { "before-close": e.onClose, modal: !0 },
					},
					[
						t("div", { staticClass: "mask" }),
						t("div", { staticClass: "image-box" }, [t("img", { attrs: { src: e.url } })]),
						t("div", { staticClass: "close", on: { click: e.onClose } }, [
							t("i", { staticClass: "el-icon-close" }),
						]),
					],
				)
			},
			Y = [],
			J = {
				name: "fullImage",
				data() {
					return { fit: "contain" }
				},
				methods: {
					onClose() {
						this.$emit("close")
					},
				},
				props: { visible: { type: Boolean }, url: { type: String } },
			},
			K = J,
			Q = (s("2470"), Object(u["a"])(K, W, Y, !1, null, null, null)),
			Z = Q.exports,
			X = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					[
						t(
							"el-dialog",
							{
								directives: [{ name: "dialogDrag", rawName: "v-dialogDrag" }],
								attrs: {
									top: "5vh",
									"custom-class": "rtc-private-video-dialog",
									title: e.title,
									width: e.width,
									visible: e.showRoom,
									"close-on-click-modal": !1,
									"close-on-press-escape": !1,
									"before-close": e.onQuit,
								},
								on: {
									"update:visible": function (t) {
										e.showRoom = t
									},
								},
							},
							[
								t("div", { staticClass: "rtc-private-video" }, [
									t(
										"div",
										{
											directives: [
												{
													name: "show",
													rawName: "v-show",
													value: e.isVideo,
													expression: "isVideo",
												},
											],
											staticClass: "rtc-video-box",
										},
										[
											t(
												"div",
												{
													directives: [
														{
															name: "loading",
															rawName: "v-loading",
															value: !e.isChating,
															expression: "!isChating",
														},
													],
													staticClass: "rtc-video-friend",
													attrs: {
														"element-loading-text": "等待对方接听...",
														"element-loading-background": "rgba(0, 0, 0, 0.1)",
													},
												},
												[
													t("head-image", {
														staticClass: "friend-head-image",
														attrs: {
															id: e.friend.id,
															size: 80,
															name: e.friend.nickName,
															url: e.friend.headImage,
															isShowUserInfo: !1,
															radius: "0",
														},
													}),
													t("video", { ref: "remoteVideo", attrs: { autoplay: "" } }),
												],
												1,
											),
											t("div", { staticClass: "rtc-video-mine" }, [
												t("video", { ref: "localVideo", attrs: { autoplay: "" } }),
											]),
										],
									),
									t(
										"div",
										{
											directives: [
												{
													name: "show",
													rawName: "v-show",
													value: !e.isVideo,
													expression: "!isVideo",
												},
												{
													name: "loading",
													rawName: "v-loading",
													value: !e.isChating,
													expression: "!isChating",
												},
											],
											staticClass: "rtc-voice-box",
											attrs: {
												"element-loading-text": "等待对方接听...",
												"element-loading-background": "rgba(0, 0, 0, 0.1)",
											},
										},
										[
											t(
												"head-image",
												{
													staticClass: "friend-head-image",
													attrs: {
														id: e.friend.id,
														size: 200,
														name: e.friend.nickName,
														url: e.friend.headImage,
														isShowUserInfo: !1,
													},
												},
												[
													t("div", { staticClass: "rtc-voice-name" }, [
														e._v(e._s(e.friend.nickName)),
													]),
												],
											),
										],
										1,
									),
									t("div", { staticClass: "rtc-control-bar" }, [
										t("div", {
											staticClass: "icon iconfont icon-phone-reject reject",
											staticStyle: { color: "red" },
											attrs: { title: "取消" },
											on: {
												click: function (t) {
													return e.onQuit()
												},
											},
										}),
									]),
								]),
							],
						),
						!e.isHost && e.isWaiting
							? t("rtc-private-acceptor", {
									ref: "acceptor",
									attrs: { friend: e.friend, mode: e.mode },
									on: { accept: e.onAccept, reject: e.onReject },
								})
							: e._e(),
					],
					1,
				)
			},
			ee = [],
			te = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{ staticClass: "rtc-private-acceptor" },
					[
						t("head-image", {
							attrs: {
								id: e.friend.id,
								name: e.friend.nickName,
								url: e.friend.headImage,
								size: 100,
								isShowUserInfo: !1,
							},
						}),
						t("div", { staticClass: "acceptor-text" }, [e._v(" " + e._s(e.tip) + " ")]),
						t("div", { staticClass: "acceptor-btn-group" }, [
							t("div", {
								staticClass: "icon iconfont icon-phone-accept accept",
								attrs: { title: "接受" },
								on: {
									click: function (t) {
										return e.$emit("accept")
									},
								},
							}),
							t("div", {
								staticClass: "icon iconfont icon-phone-reject reject",
								attrs: { title: "拒绝" },
								on: {
									click: function (t) {
										return e.$emit("reject")
									},
								},
							}),
						]),
					],
					1,
				)
			},
			se = [],
			ie = {
				name: "rtcPrivateAcceptor",
				components: { HeadImage: P["a"] },
				data() {
					return {}
				},
				props: { mode: { type: String }, friend: { type: Object } },
				computed: {
					tip() {
						let e = "video" == this.mode ? "视频" : "语音"
						return `${this.friend.nickName} 请求和您进行${e}通话...`
					},
				},
			},
			oe = ie,
			ne = (s("0a40"), Object(u["a"])(oe, te, se, !1, null, "3908b535", null)),
			ae = ne.exports
		class re {
			constructor() {
				;(this.configuration = {}), (this.stream = null)
			}
		}
		;(re.prototype.isEnable = function () {
			return (
				(window.RTCPeerConnection =
					window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection),
				(window.RTCSessionDescription =
					window.RTCSessionDescription ||
					window.webkitRTCSessionDescription ||
					window.mozRTCSessionDescription),
				(window.RTCIceCandidate =
					window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate),
				!!window.RTCPeerConnection
			)
		}),
			(re.prototype.init = function (e) {
				this.configuration = e
			}),
			(re.prototype.setupPeerConnection = function (e) {
				;(this.peerConnection = new RTCPeerConnection(this.configuration)),
					(this.peerConnection.ontrack = (t) => {
						e(t.streams[0])
					})
			}),
			(re.prototype.setStream = function (e) {
				this.stream && this.peerConnection.removeStream(this.stream),
					e &&
						e.getTracks().forEach((t) => {
							this.peerConnection.addTrack(t, e)
						}),
					(this.stream = e)
			}),
			(re.prototype.onIcecandidate = function (e) {
				this.peerConnection.onicecandidate = (t) => {
					t.candidate && e(t.candidate)
				}
			}),
			(re.prototype.onStateChange = function (e) {
				this.peerConnection.oniceconnectionstatechange = (t) => {
					let s = t.target.iceConnectionState
					console.log("ICE连接状态变化: : " + s), e(s)
				}
			}),
			(re.prototype.createOffer = function () {
				return new Promise((e, t) => {
					const s = { offerToRecieveAudio: 1, offerToRecieveVideo: 1 }
					this.peerConnection
						.createOffer(s)
						.then((t) => {
							this.peerConnection.setLocalDescription(t), e(t)
						})
						.catch((e) => {
							t(e)
						})
				})
			}),
			(re.prototype.createAnswer = function (e) {
				return new Promise((t, s) => {
					this.setRemoteDescription(e)
					const i = { offerToRecieveAudio: 1, offerToRecieveVideo: 1 }
					this.peerConnection
						.createAnswer(i)
						.then((e) => {
							this.peerConnection.setLocalDescription(e), t(e)
						})
						.catch((e) => {
							s(e)
						})
				})
			}),
			(re.prototype.setRemoteDescription = function (e) {
				this.peerConnection.setRemoteDescription(new RTCSessionDescription(e))
			}),
			(re.prototype.addIceCandidate = function (e) {
				this.peerConnection.addIceCandidate(new RTCIceCandidate(e))
			}),
			(re.prototype.close = function (e) {
				this.peerConnection &&
					(this.peerConnection.close(),
					(this.peerConnection.onicecandidate = null),
					(this.peerConnection.onaddstream = null),
					(this.peerConnection = null))
			})
		var le = re
		class ce {
			constructor() {
				this.stream = null
			}
		}
		;(ce.prototype.isEnable = function () {
			return !!navigator && !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia
		}),
			(ce.prototype.openVideo = function () {
				return new Promise((e, t) => {
					this.stream && this.close()
					let s = { video: !0, audio: { echoCancellation: !0, noiseSuppression: !0 } }
					console.log("getUserMedia"),
						navigator.mediaDevices
							.getUserMedia(s)
							.then((t) => {
								console.log("摄像头打开"), (this.stream = t), e(t)
							})
							.catch((e) => {
								console.log(e),
									console.log("摄像头未能正常打开"),
									t({ code: 0, message: "摄像头未能正常打开" })
							})
				})
			}),
			(ce.prototype.openAudio = function () {
				return new Promise((e, t) => {
					let s = { video: !1, audio: { echoCancellation: !0, noiseSuppression: !0 } }
					navigator.mediaDevices
						.getUserMedia(s)
						.then((t) => {
							;(this.stream = t), e(t)
						})
						.catch(() => {
							console.log("麦克风未能正常打开"), t({ code: 0, message: "麦克风未能正常打开" })
						})
				})
			}),
			(ce.prototype.close = function () {
				this.stream &&
					this.stream.getTracks().forEach((e) => {
						e.stop()
					})
			})
		var de = ce,
			he = s("5c96"),
			ue = s.n(he)
		const me = I["a"].create({ baseURL: "https://aiim.service.thinkgs.cn/api", timeout: 3e4, withCredentials: !0 })
		let ge = null
		function pe(e) {
			try {
				let s = sessionStorage.getItem(e)
				if (s) return s
				if (window.vscodeServices && window.vscodeServices.get)
					try {
						const t = window.vscodeServices.get("IUserStateService")
						if (t && t.currentUser) {
							const s = t.currentUser
							if ("accessToken" === e && s.accessToken) return s.accessToken
							if ("refreshToken" === e && s.refreshToken) return s.refreshToken
						}
					} catch (t) {
						console.warn("[HttpRequest] Failed to get token from VSCode services:", t)
					}
				return null
			} catch (s) {
				return console.warn("[HttpRequest] Failed to get token:", s), null
			}
		}
		function fe(e, t) {
			try {
				if ((sessionStorage.setItem(e, t), window.vscodeServices && window.vscodeServices.get))
					try {
						const s = window.vscodeServices.get("IUserStateService")
						if (s && s.currentUser) {
							const i = s.currentUser
							"accessToken" === e && (i.accessToken = t),
								"refreshToken" === e && (i.refreshToken = t),
								console.log("[HttpRequest] Token synced to VSCode services")
						}
					} catch (s) {
						console.warn("[HttpRequest] Failed to sync token to VSCode services:", s)
					}
			} catch (i) {
				console.error("[HttpRequest] Failed to set token:", i)
			}
		}
		me.interceptors.request.use(
			(e) => {
				let t = pe("accessToken")
				return t && (e.headers.accessToken = encodeURIComponent(t)), e
			},
			(e) => Promise.reject(e),
		),
			me.interceptors.response.use(
				async (e) => {
					if (200 == e.data.code) return e.data.data
					if (400 == e.data.code) location.href = "/"
					else {
						if (401 != e.data.code)
							return (
								Object(he["Message"])({
									message: e.data.message,
									type: "error",
									duration: 1500,
									customClass: "element-error-message-zindex",
								}),
								Promise.reject(e.data)
							)
						{
							console.log("token失效，尝试重新获取")
							let s = pe("refreshToken")
							if (!s) return (location.href = "/"), Promise.reject(e.data)
							if (ge) {
								console.log("等待已有的刷新token请求完成")
								try {
									await ge
									const t = pe("accessToken")
									return (e.config.headers.accessToken = encodeURIComponent(t)), me(e.config)
								} catch (t) {
									return (location.href = "/"), Promise.reject(t)
								}
							}
							ge = (async () => {
								try {
									const e = await me({
										method: "put",
										url: "/refreshToken",
										headers: { refreshToken: s },
									})
									return (
										fe("accessToken", e.accessToken),
										fe("refreshToken", e.refreshToken),
										console.log("token刷新成功"),
										e
									)
								} catch (t) {
									throw (console.log("刷新token失败，token已失效，需要重新登录"), t)
								} finally {
									ge = null
								}
							})()
							try {
								await ge
								const t = pe("accessToken")
								return (e.config.headers.accessToken = encodeURIComponent(t)), me(e.config)
							} catch (t) {
								return (location.href = "/"), Promise.reject(t)
							}
						}
					}
				},
				async (e) => {
					if (!e.response)
						return (
							Object(he["Message"])({
								message: "网络连接失败",
								type: "error",
								duration: 1500,
								customClass: "element-error-message-zindex",
							}),
							Promise.reject(e)
						)
					switch (e.response.status) {
						case 400:
							Object(he["Message"])({
								message: e.response.data,
								type: "error",
								duration: 1500,
								customClass: "element-error-message-zindex",
							})
							break
						case 401: {
							console.log("HTTP 401错误，尝试刷新token")
							const s = pe("refreshToken")
							if (!s) return (location.href = "/"), Promise.reject(e)
							if (ge) {
								console.log("等待已有的刷新token请求完成")
								try {
									await ge
									const t = pe("accessToken")
									return (e.config.headers.accessToken = encodeURIComponent(t)), me(e.config)
								} catch (t) {
									return (location.href = "/"), Promise.reject(t)
								}
							}
							ge = (async () => {
								try {
									const e = await me({
										method: "put",
										url: "/refreshToken",
										headers: { refreshToken: s },
									})
									return (
										fe("accessToken", e.accessToken),
										fe("refreshToken", e.refreshToken),
										console.log("token刷新成功"),
										e
									)
								} catch (t) {
									throw (console.log("刷新token失败，token已失效，需要重新登录"), t)
								} finally {
									ge = null
								}
							})()
							try {
								await ge
								const t = pe("accessToken")
								return (e.config.headers.accessToken = encodeURIComponent(t)), me(e.config)
							} catch (t) {
								return (location.href = "/"), Promise.reject(t)
							}
						}
						case 405:
							Object(he["Message"])({
								message: "http请求方式有误",
								type: "error",
								duration: 1500,
								customClass: "element-error-message-zindex",
							})
							break
						case 404:
						case 500:
							Object(he["Message"])({
								message: "服务器出了点小差，请稍后再试",
								type: "error",
								duration: 1500,
								customClass: "element-error-message-zindex",
							})
							break
						case 501:
							Object(he["Message"])({
								message: "服务器不支持当前请求所需要的某个功能",
								type: "error",
								duration: 1500,
								customClass: "element-error-message-zindex",
							})
							break
					}
					return Promise.reject(e)
				},
			)
		var ve = me
		class Ce {}
		;(Ce.prototype.call = function (e, t, s) {
			return ve({
				url: `/webrtc/private/call?uid=${e}&mode=${t}`,
				method: "post",
				data: JSON.stringify(s),
				headers: { "Content-Type": "application/json; charset=utf-8" },
			})
		}),
			(Ce.prototype.accept = function (e, t) {
				return ve({
					url: "/webrtc/private/accept?uid=" + e,
					method: "post",
					data: JSON.stringify(t),
					headers: { "Content-Type": "application/json; charset=utf-8" },
				})
			}),
			(Ce.prototype.handup = function (e) {
				return ve({ url: "/webrtc/private/handup?uid=" + e, method: "post" })
			}),
			(Ce.prototype.cancel = function (e) {
				return ve({ url: "/webrtc/private/cancel?uid=" + e, method: "post" })
			}),
			(Ce.prototype.reject = function (e) {
				return ve({ url: "/webrtc/private/reject?uid=" + e, method: "post" })
			}),
			(Ce.prototype.failed = function (e, t) {
				return ve({ url: `/webrtc/private/failed?uid=${e}&reason=${t}`, method: "post" })
			}),
			(Ce.prototype.sendCandidate = function (e, t) {
				return ve({
					url: "/webrtc/private/candidate?uid=" + e,
					method: "post",
					data: JSON.stringify(t),
					headers: { "Content-Type": "application/json; charset=utf-8" },
				})
			}),
			(Ce.prototype.heartbeat = function (e) {
				return ve({ url: "/webrtc/private/heartbeat?uid=" + e, method: "post" })
			})
		var Ie = Ce,
			Se = {
				name: "rtcPrivateVideo",
				components: { HeadImage: P["a"], RtcPrivateAcceptor: ae },
				data() {
					return {
						camera: new de(),
						webrtc: new le(),
						API: new Ie(),
						audio: new Audio(),
						showRoom: !1,
						friend: {},
						isHost: !1,
						state: "CLOSE",
						mode: "video",
						localStream: null,
						remoteStream: null,
						videoTime: 0,
						videoTimer: null,
						heartbeatTimer: null,
						candidates: [],
					}
				},
				methods: {
					open(e) {
						;(this.showRoom = !0),
							(this.mode = e.mode),
							(this.isHost = e.isHost),
							(this.friend = e.friend),
							this.isHost && this.onCall()
					},
					initAudio() {
						let e = s("cffd")
						;(this.audio.src = e), (this.audio.loop = !0)
					},
					initRtc() {
						this.webrtc.init(this.configuration),
							this.webrtc.setupPeerConnection((e) => {
								;(this.$refs.remoteVideo.srcObject = e), (this.remoteStream = e)
							}),
							this.webrtc.onIcecandidate((e) => {
								"CHATING" == this.state
									? this.API.sendCandidate(this.friend.id, e)
									: this.candidates.push(e)
							}),
							this.webrtc.onStateChange((e) => {
								"connected" == e
									? console.log("webrtc连接成功")
									: "disconnected" == e && console.log("webrtc连接断开")
							})
					},
					onCall() {
						this.checkDevEnable() || this.close(),
							this.initRtc(),
							this.startHeartBeat(),
							this.openStream()
								.then(() => {
									this.webrtc.setStream(this.localStream),
										this.webrtc.createOffer().then((e) => {
											this.API.call(this.friend.id, this.mode, e)
												.then(() => {
													;(this.state = "WAITING"), this.audio.play()
												})
												.catch(() => {
													this.close()
												})
										})
								})
								.catch(() => {
									this.close()
								})
					},
					onAccept() {
						if (!this.checkDevEnable())
							return this.API.failed(this.friend.id, "对方设备不支持通话"), void this.close()
						;(this.showRoom = !0),
							(this.state = "CHATING"),
							this.audio.pause(),
							this.initRtc(),
							this.openStream().finally(() => {
								this.webrtc.setStream(this.localStream),
									this.webrtc.createAnswer(this.offer).then((e) => {
										this.API.accept(this.friend.id, e),
											this.startChatTime(),
											this.waitTimer && clearTimeout(this.waitTimer)
									})
							})
					},
					onReject() {
						console.log("onReject"), this.API.reject(this.friend.id), this.close()
					},
					onHandup() {
						this.API.handup(this.friend.id), this.$message.success("您已挂断,通话结束"), this.close()
					},
					onCancel() {
						this.API.cancel(this.friend.id), this.$message.success("已取消呼叫,通话结束"), this.close()
					},
					onRTCMessage(e) {
						if (
							e.type == this.$enums.MESSAGE_TYPE.RTC_CALL_VOICE ||
							e.type == this.$enums.MESSAGE_TYPE.RTC_CALL_VIDEO ||
							!this.isClose
						)
							switch (e.type) {
								case this.$enums.MESSAGE_TYPE.RTC_CALL_VOICE:
									this.onRTCCall(e, "voice")
									break
								case this.$enums.MESSAGE_TYPE.RTC_CALL_VIDEO:
									this.onRTCCall(e, "video")
									break
								case this.$enums.MESSAGE_TYPE.RTC_ACCEPT:
									this.onRTCAccept(e)
									break
								case this.$enums.MESSAGE_TYPE.RTC_REJECT:
									this.onRTCReject(e)
									break
								case this.$enums.MESSAGE_TYPE.RTC_CANCEL:
									this.onRTCCancel(e)
									break
								case this.$enums.MESSAGE_TYPE.RTC_FAILED:
									this.onRTCFailed(e)
									break
								case this.$enums.MESSAGE_TYPE.RTC_HANDUP:
									this.onRTCHandup(e)
									break
								case this.$enums.MESSAGE_TYPE.RTC_CANDIDATE:
									this.onRTCCandidate(e)
									break
							}
					},
					onRTCCall(e, t) {
						;(this.offer = JSON.parse(e.content)),
							(this.isHost = !1),
							(this.mode = t),
							this.$http({ url: "/friend/find/" + e.sendId, method: "get" }).then((e) => {
								;(this.friend = e),
									(this.state = "WAITING"),
									this.audio.play(),
									this.startHeartBeat(),
									(this.waitTimer = setTimeout(() => {
										this.API.failed(this.friend.id, "对方无应答"),
											this.$message.error("您未接听"),
											this.close()
									}, 3e4))
							})
					},
					onRTCAccept(e) {
						if (e.selfSend) this.$message.success("已在其他设备接听"), this.close()
						else {
							let t = JSON.parse(e.content)
							this.webrtc.setRemoteDescription(t),
								(this.state = "CHATING"),
								this.audio.pause(),
								this.candidates.forEach((e) => {
									this.API.sendCandidate(this.friend.id, e)
								}),
								this.startChatTime()
						}
					},
					onRTCReject(e) {
						e.selfSend
							? (this.$message.success("已在其他设备拒绝"), this.close())
							: (this.$message.error("对方拒绝了您的通话请求"), this.close())
					},
					onRTCFailed(e) {
						this.$message.error(e.content), this.close()
					},
					onRTCCancel() {
						this.$message.success("对方取消了呼叫"), this.close()
					},
					onRTCHandup() {
						this.$message.success("对方已挂断"), this.close()
					},
					onRTCCandidate(e) {
						let t = JSON.parse(e.content)
						this.webrtc.addIceCandidate(t)
					},
					openStream() {
						return new Promise((e, t) => {
							this.isVideo
								? this.camera
										.openVideo()
										.then((t) => {
											;(this.localStream = t),
												this.$nextTick(() => {
													;(this.$refs.localVideo.srcObject = t),
														(this.$refs.localVideo.muted = !0)
												}),
												e(t)
										})
										.catch((e) => {
											this.$message.error("打开摄像头失败"),
												console.log("本摄像头打开失败:" + e.message),
												t(e)
										})
								: this.camera
										.openAudio()
										.then((t) => {
											;(this.localStream = t), (this.$refs.localVideo.srcObject = t), e(t)
										})
										.catch((e) => {
											this.$message.error("打开麦克风失败"),
												console.log("打开麦克风失败:" + e.message),
												t(e)
										})
						})
					},
					startChatTime() {
						;(this.videoTime = 0),
							this.videoTimer && clearInterval(this.videoTimer),
							(this.videoTimer = setInterval(() => {
								this.videoTime++
							}, 1e3))
					},
					checkDevEnable() {
						return this.camera.isEnable()
							? !!this.webrtc.isEnable() ||
									(this.message.error(
										"初始化RTC失败，原因可能是: 1.服务器缺少ssl证书 2.您的设备不支持WebRTC",
									),
									!1)
							: (this.message.error("访问摄像头失败"), !1)
					},
					startHeartBeat() {
						this.heartbeatTimer && clearInterval(this.heartbeatTimer),
							(this.heartbeatTimer = setInterval(() => {
								this.API.heartbeat(this.friend.id)
							}, 15e3))
					},
					close() {
						;(this.showRoom = !1),
							this.camera.close(),
							this.webrtc.close(),
							this.audio.pause(),
							(this.videoTime = 0),
							this.videoTimer && clearInterval(this.videoTimer),
							this.heartbeatTimer && clearInterval(this.heartbeatTimer),
							this.waitTimer && clearTimeout(this.waitTimer),
							(this.videoTimer = null),
							(this.heartbeatTimer = null),
							(this.waitTimer = null),
							(this.state = "CLOSE"),
							(this.candidates = [])
					},
					onQuit() {
						this.isChating ? this.onHandup() : this.isWaiting ? this.onCancel() : this.close()
					},
				},
				computed: {
					width() {
						return this.isVideo ? "960px" : "360px"
					},
					title() {
						let e = `${this.modeText}通话-${this.friend.nickName}`
						return this.isChating ? (e += `(${this.currentTime})`) : this.isWaiting && (e += "(呼叫中)"), e
					},
					currentTime() {
						let e = Math.floor(this.videoTime / 60),
							t = this.videoTime % 60,
							s = e < 10 ? "0" : ""
						return (s += e), (s += ":"), (s += t < 10 ? "0" : ""), (s += t), s
					},
					configuration() {
						const e = this.$store.state.configStore.webrtc.iceServers
						return { iceServers: e }
					},
					isVideo() {
						return "video" == this.mode
					},
					modeText() {
						return this.isVideo ? "视频" : "语音"
					},
					isChating() {
						return "CHATING" == this.state
					},
					isWaiting() {
						return "WAITING" == this.state
					},
					isClose() {
						return "CLOSE" == this.state
					},
				},
				mounted() {
					this.initAudio()
				},
				created() {
					window.addEventListener("beforeunload", () => {
						this.onQuit()
					})
				},
				beforeUnmount() {
					this.onQuit()
				},
			},
			we = Se,
			Te = (s("de74"), Object(u["a"])(we, X, ee, !1, null, null, null)),
			be = Te.exports,
			ye = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-dialog",
					{
						directives: [{ name: "dialogDrag", rawName: "v-dialogDrag" }],
						attrs: {
							top: "5vh",
							title: "语音通话",
							"close-on-click-modal": !1,
							"close-on-press-escape": !1,
							visible: e.isShow,
							width: "50%",
						},
						on: {
							"update:visible": function (t) {
								e.isShow = t
							},
						},
					},
					[
						t("div", { staticClass: "rtc-group-video" }, [
							t(
								"div",
								{
									staticStyle: {
										"padding-top": "30px",
										"font-weight": "600",
										"text-align": "center",
										"font-size": "16px",
									},
								},
								[e._v(" 多人音视频通话属于付费功能，如有需要请联系作者购买商业版源码... ")],
							),
							t(
								"div",
								{ staticStyle: { "padding-top": "50px", "text-align": "center", "font-size": "16px" } },
								[e._v(" 点击下方文档了解详细信息: ")],
							),
							t(
								"div",
								{ staticStyle: { "padding-top": "10px", "text-align": "center", "font-size": "16px" } },
								[
									t(
										"a",
										{
											attrs: {
												href: "https://www.yuque.com/u1475064/imk5n2/qtezcg32q1d0dr29",
												target: "_blank",
											},
										},
										[e._v(" 盒子IM商业版付费说明 ")],
									),
								],
							),
						]),
					],
				)
			},
			xe = [],
			Ae = {
				name: "rtcGroupVideo",
				data() {
					return { isShow: !1 }
				},
				methods: {
					open() {
						this.isShow = !0
					},
					onRTCMessage() {},
				},
			},
			$e = Ae,
			Ee = (s("20e7"), Object(u["a"])($e, ye, xe, !1, null, null, null)),
			ke = Ee.exports,
			Me = {
				components: {
					HeadImage: P["a"],
					Setting: V,
					UserInfo: q,
					FullImage: Z,
					RtcPrivateVideo: be,
					RtcPrivateAcceptor: ae,
					RtcGroupVideo: ke,
				},
				data() {
					return {
						showSettingDialog: !1,
						lastPlayAudioTime: new Date().getTime() - 1e3,
						isFullscreen: !0,
						reconnecting: !1,
					}
				},
				methods: {
					init() {
						this.$eventBus.$on("openPrivateVideo", (e) => {
							this.$refs.rtcPrivateVideo.open(e)
						}),
							this.$eventBus.$on("openGroupVideo", (e) => {
								this.$refs.rtcGroupVideo.open(e)
							}),
							this.$store
								.dispatch("load")
								.then(() => {
									this.$wsApi.connect(
										"wss://aiim.ws.service.thinkgs.cn/im",
										sessionStorage.getItem("accessToken"),
									),
										this.$wsApi.onConnect(() => {
											this.reconnecting
												? this.onReconnectWs()
												: (this.pullPrivateOfflineMessage(
														this.$store.state.chatStore.privateMsgMaxId,
													),
													this.pullGroupOfflineMessage(
														this.$store.state.chatStore.groupMsgMaxId,
													))
										}),
										this.$wsApi.onMessage((e, t) => {
											2 == e
												? (this.$wsApi.close(3e3),
													this.$alert("您已在其他地方登录，将被强制下线", "强制下线通知", {
														confirmButtonText: "确定",
														callback: (e) => {
															location.href = "/"
														},
													}))
												: 3 == e
													? this.handlePrivateMessage(t)
													: 4 == e
														? this.handleGroupMessage(t)
														: 5 == e && this.handleSystemMessage(t)
										}),
										this.$wsApi.onClose((e) => {
											3e3 != e.code && this.reconnectWs()
										})
								})
								.catch((e) => {
									console.log("初始化失败", e)
								})
					},
					reconnectWs() {
						;(this.reconnecting = !0),
							this.$store
								.dispatch("loadUser")
								.then(() => {
									this.$wsApi.reconnect(
										"wss://aiim.ws.service.thinkgs.cn/im",
										sessionStorage.getItem("accessToken"),
									)
								})
								.catch(() => {
									setTimeout(() => this.reconnectWs(), 1e4)
								})
					},
					onReconnectWs() {
						this.reconnecting = !1
						const e = []
						e.push(this.$store.dispatch("loadFriend")),
							e.push(this.$store.dispatch("loadGroup")),
							Promise.all(e)
								.then(() => {
									this.pullPrivateOfflineMessage(this.$store.state.chatStore.privateMsgMaxId),
										this.pullGroupOfflineMessage(this.$store.state.chatStore.groupMsgMaxId)
								})
								.catch(() => {
									this.$message.error("初始化失败"), this.onExit()
								})
					},
					pullPrivateOfflineMessage(e) {
						this.$store.commit("loadingPrivateMsg", !0),
							this.$http({ url: "/message/private/pullOfflineMessage?minId=" + e, method: "GET" }).catch(
								() => {
									this.$store.commit("loadingPrivateMsg", !1)
								},
							)
					},
					pullGroupOfflineMessage(e) {
						this.$store.commit("loadingGroupMsg", !0),
							this.$http({ url: "/message/group/pullOfflineMessage?minId=" + e, method: "GET" }).catch(
								() => {
									this.$store.commit("loadingGroupMsg", !1)
								},
							)
					},
					handlePrivateMessage(e) {
						if (void 0 !== e.senderTerminal)
							return (
								console.log("[Home] 🔧 接收到终端消息:", e),
								(e.isTerminalChat = !0),
								e.targetTerminal === this.getCurrentTerminal() && this.insertTerminalMessage(e),
								void (
									e.id &&
									e.id > this.$store.state.chatStore.privateMsgMaxId &&
									this.$store.commit("updatePrivateMsgMaxId", e.id)
								)
							)
						e.selfSend = e.sendId == this.$store.state.userStore.userInfo.id
						let t = e.selfSend ? e.recvId : e.sendId,
							s = { type: "PRIVATE", targetId: t }
						if (e.type != this.$enums.MESSAGE_TYPE.LOADING)
							if (e.type != this.$enums.MESSAGE_TYPE.READED)
								if (e.type != this.$enums.MESSAGE_TYPE.RECEIPT)
									if (e.type != this.$enums.MESSAGE_TYPE.RECALL)
										if (e.type != this.$enums.MESSAGE_TYPE.FRIEND_NEW)
											if (e.type != this.$enums.MESSAGE_TYPE.FRIEND_DEL) {
												if (this.$msgType.isRtcPrivate(e.type))
													this.$refs.rtcPrivateVideo.onRTCMessage(e)
												else if (
													this.$msgType.isNormal(e.type) ||
													this.$msgType.isTip(e.type) ||
													this.$msgType.isAction(e.type)
												) {
													let s = this.loadFriendInfo(t)
													this.insertPrivateMessage(s, e)
												}
											} else this.$store.commit("removeFriend", t)
										else this.$store.commit("addFriend", JSON.parse(e.content))
									else this.$store.commit("recallMessage", [e, s])
								else this.$store.commit("readedMessage", { friendId: e.sendId })
							else this.$store.commit("resetUnreadCount", s)
						else this.$store.commit("loadingPrivateMsg", JSON.parse(e.content))
					},
					insertPrivateMessage(e, t) {
						let s = { type: "PRIVATE", targetId: e.id, showName: e.nickName, headImage: e.headImage }
						this.$store.commit("openChat", s),
							this.$store.commit("insertMessage", [t, s]),
							!t.selfSend &&
								this.$msgType.isNormal(t.type) &&
								t.status != this.$enums.MESSAGE_STATUS.READED &&
								this.playAudioTip()
					},
					insertTerminalMessage(e) {
						try {
							const t = this.$store.state.userStore.userInfo
							if (!t || !t.id) return void console.error("[Home] 用户信息未加载，无法处理终端消息")
							const s = e.senderTerminal,
								i = e.targetTerminal || this.getCurrentTerminal(),
								o = this.getCurrentTerminal()
							;(e.selfSend = e.senderTerminal === o),
								e.targetTerminal || (e.targetTerminal = o),
								console.log(
									`🔧 [Home] 终端消息: ${this.getTerminalName(s)}端→${this.getTerminalName(i)}端, selfSend=${e.selfSend}`,
								)
							const n = {
								type: "PRIVATE",
								targetId: `${t.id}_${s}`,
								showName: this.getTerminalName(s) + "端",
								headImage: this.getTerminalIcon(s),
								isTerminalChat: !0,
								senderTerminal: s,
							}
							;(e.sendNickName = `${t.nickName}(${this.getTerminalName(s)}端)`),
								this.$store.commit("openChat", n),
								this.$store.commit("insertMessage", [e, n]),
								console.log(`✅ [Home] 终端消息已插入到 ${this.getTerminalName(s)}端 会话`),
								!e.selfSend &&
									this.$msgType.isNormal(e.type) &&
									e.status != this.$enums.MESSAGE_STATUS.READED &&
									this.playAudioTip()
						} catch (t) {
							console.error("[Home] 处理终端消息失败:", t, e)
						}
					},
					getTerminalName(e) {
						const t = {
							0: "傻蛋网页",
							1: "傻蛋精灵App",
							2: "我的电脑",
							3: "我的云电脑",
							4: "傻蛋浏览器",
							5: "MCP",
						}
						return t[e] || "未知"
					},
					getTerminalIcon(e) {
						const t = { 0: "🌐", 1: "📱", 2: "💻", 3: "🖥️", 4: "🔌", 5: "🤖" }
						return t[e] || "❓"
					},
					getCurrentTerminal() {
						var e
						return "undefined" !== typeof window
							? window.parent !== window ||
								window.acquireVsCodeApi ||
								window.SharedServicesAccessor ||
								navigator.userAgent.includes("VSCode") ||
								"vscode-webview:" === window.location.protocol
								? 2
								: window.require ||
									  (null !== (e = window.process) && void 0 !== e && e.type) ||
									  window.isElectron ||
									  navigator.userAgent.includes("Electron")
									? 3
									: window.cordova ||
										  window.PhoneGap ||
										  window.phonegap ||
										  navigator.userAgent.includes("wv") ||
										  navigator.userAgent.includes("Mobile")
										? 1
										: 0
							: 0
					},
					handleGroupMessage(e) {
						e.selfSend = e.sendId == this.$store.state.userStore.userInfo.id
						let t = { type: "GROUP", targetId: e.groupId }
						if (e.type != this.$enums.MESSAGE_TYPE.LOADING)
							if (e.type != this.$enums.MESSAGE_TYPE.READED)
								if (e.type != this.$enums.MESSAGE_TYPE.RECEIPT)
									if (e.type != this.$enums.MESSAGE_TYPE.RECALL)
										if (e.type != this.$enums.MESSAGE_TYPE.GROUP_NEW)
											if (e.type != this.$enums.MESSAGE_TYPE.GROUP_DEL) {
												if (this.$msgType.isRtcGroup(e.type))
													this.$nextTick(() => {
														this.$refs.rtcGroupVideo.onRTCMessage(e)
													})
												else if (
													this.$msgType.isNormal(e.type) ||
													this.$msgType.isTip(e.type) ||
													this.$msgType.isAction(e.type)
												) {
													let t = this.loadGroupInfo(e.groupId)
													this.insertGroupMessage(t, e)
												}
											} else this.$store.commit("removeGroup", e.groupId)
										else this.$store.commit("addGroup", JSON.parse(e.content))
									else this.$store.commit("recallMessage", [e, t])
								else {
									let s = {
										id: e.id,
										groupId: e.groupId,
										readedCount: e.readedCount,
										receiptOk: e.receiptOk,
									}
									this.$store.commit("updateMessage", [s, t])
								}
							else this.$store.commit("resetUnreadCount", t)
						else this.$store.commit("loadingGroupMsg", JSON.parse(e.content))
					},
					insertGroupMessage(e, t) {
						let s = {
							type: "GROUP",
							targetId: e.id,
							showName: e.showGroupName,
							headImage: e.headImageThumb,
						}
						this.$store.commit("openChat", s),
							this.$store.commit("insertMessage", [t, s]),
							!t.selfSend &&
								t.type <= this.$enums.MESSAGE_TYPE.VIDEO &&
								t.status != this.$enums.MESSAGE_STATUS.READED &&
								this.playAudioTip()
					},
					handleSystemMessage(e) {
						if (e.type == this.$enums.MESSAGE_TYPE.USER_BANNED)
							return (
								this.$wsApi.close(3e3),
								void this.$alert("您的账号已被管理员封禁,原因:" + e.content, "账号被封禁", {
									confirmButtonText: "确定",
									callback: (e) => {
										this.onExit()
									},
								})
							)
					},
					onExit() {
						this.$wsApi.close(3e3), sessionStorage.removeItem("accessToken"), (location.href = "/")
					},
					playAudioTip() {
						if (!this.$store.getters.isLoading() && new Date().getTime() - this.lastPlayAudioTime > 1e3) {
							this.lastPlayAudioTime = new Date().getTime()
							let e = new Audio(),
								t = s("f2b0")
							;(e.src = t), e.play()
						}
					},
					showSetting() {
						this.showSettingDialog = !0
					},
					closeSetting() {
						this.showSettingDialog = !1
					},
					loadFriendInfo(e) {
						String(e).includes("_") && (e = String(e).split("_")[0])
						let t = this.$store.getters.findFriend(e)
						if (!t) {
							const s = this.$store.state.userStore.userInfo
							t =
								s && s.id == e
									? {
											id: e,
											nickName: s.nickName || "我",
											showNickName: s.nickName || "我",
											headImage: s.headImageThumb || s.headImage || "",
										}
									: { id: e, nickName: "未知用户", showNickName: "未知用户", headImage: "" }
						}
						return t
					},
					loadGroupInfo(e) {
						let t = this.$store.getters.findGroup(e)
						return t || (t = { id: e, showGroupName: "未知群聊", headImageThumb: "" }), t
					},
				},
				computed: {
					uiStore() {
						return this.$store.state.uiStore
					},
					unreadCount() {
						let e = 0,
							t = this.$store.state.chatStore.chats
						return (
							t.forEach((t) => {
								t.delete || (e += t.unreadCount)
							}),
							e
						)
					},
				},
				watch: {
					unreadCount: {
						handler(e, t) {
							let s = e > 0 ? e + "条未读" : ""
							this.$elm.setTitleTip(s)
						},
						immediate: !0,
					},
				},
				mounted() {
					this.init()
				},
				unmounted() {
					this.$wsApi.close()
				},
			},
			Ne = Me,
			_e = (s("ab39"), Object(u["a"])(Ne, N, _, !1, null, "e8d6c224", null)),
			Pe = _e.exports,
			Re = function () {
				var e = this,
					t = e._self._c
				return t("div", { staticClass: "vscode-container" }, [
					t(
						"div",
						{ staticClass: "left-panel" },
						[t("Inbox", { on: { chatItemClick: e.handleChatItemClick } })],
						1,
					),
					t(
						"div",
						{ staticClass: "right-panel" },
						[t("shadan-chat", { attrs: { chatData: e.selectedChatData } })],
						1,
					),
				])
			},
			Fe = [],
			De = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{ staticClass: "home-page" },
					[
						t("div", { staticClass: "navi-bar" }, [
							t("div", { staticClass: "navi-bar-box" }, [
								t("div", { staticClass: "top" }, [
									t("div", { staticClass: "menu" }, [
										t(
											"div",
											{
												staticClass: "botoom-item",
												on: {
													click: function (t) {
														return e.switchUi(1)
													},
												},
											},
											[
												t("span", { staticClass: "icon iconfont icon-chat" }),
												t(
													"div",
													{
														directives: [
															{
																name: "show",
																rawName: "v-show",
																value: e.unreadCount > 0,
																expression: "unreadCount > 0",
															},
														],
														staticClass: "unread-text",
													},
													[e._v(" " + e._s(e.unreadCount) + " ")],
												),
											],
										),
										t(
											"div",
											{
												staticClass: "botoom-item",
												on: {
													click: function (t) {
														return e.switchUi(2)
													},
												},
											},
											[t("span", { staticClass: "icon iconfont icon-friend" })],
										),
										t(
											"div",
											{
												staticClass: "botoom-item",
												on: {
													click: function (t) {
														return e.switchUi(3)
													},
												},
											},
											[
												t("span", {
													staticClass: "icon iconfont icon-group",
													staticStyle: { "font-size": "28px" },
												}),
											],
										),
										t("div", { staticClass: "botoom-item", on: { click: e.showSetting } }, [
											t("span", {
												staticClass: "icon iconfont icon-setting",
												staticStyle: { "font-size": "20px" },
											}),
										]),
									]),
								]),
							]),
						]),
						t(
							"div",
							{ staticClass: "content-box" },
							[
								t(
									"keep-alive",
									[
										1 === e.uiStore.viewCode ? t("inbox-session") : e._e(),
										2 === e.uiStore.viewCode ? t("inbox-friend") : e._e(),
										3 === e.uiStore.viewCode ? t("inbox-group") : e._e(),
									],
									1,
								),
							],
							1,
						),
						t("setting", {
							attrs: { visible: e.showSettingDialog },
							on: {
								close: function (t) {
									return e.closeSetting()
								},
							},
						}),
						t("user-info", {
							directives: [
								{
									name: "show",
									rawName: "v-show",
									value: e.uiStore.userInfo.show,
									expression: "uiStore.userInfo.show",
								},
							],
							attrs: { pos: e.uiStore.userInfo.pos, user: e.uiStore.userInfo.user },
							on: {
								close: function (t) {
									return e.$store.commit("closeUserInfoBox")
								},
							},
						}),
						t("full-image", {
							attrs: { visible: e.uiStore.fullImage.show, url: e.uiStore.fullImage.url },
							on: {
								close: function (t) {
									return e.$store.commit("closeFullImageBox")
								},
							},
						}),
						t("rtc-private-video", { ref: "rtcPrivateVideo" }),
						t("rtc-group-video", { ref: "rtcGroupVideo" }),
					],
					1,
				)
			},
			Le = [],
			Ge = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-container",
					{ staticClass: "chat-page" },
					[
						t(
							"el-header",
							{ staticClass: "search-container", attrs: { height: "60px" } },
							[
								t("el-input", {
									staticClass: "search-input",
									attrs: {
										placeholder: "搜索聊天记录...",
										"prefix-icon": "el-icon-search",
										clearable: "",
									},
									model: {
										value: e.searchText,
										callback: function (t) {
											e.searchText = t
										},
										expression: "searchText",
									},
								}),
							],
							1,
						),
						t("el-scrollbar", { staticClass: "chat-list-container", staticStyle: { height: "100%" } }, [
							t(
								"div",
								{ staticClass: "chat-group" },
								[
									t(
										"div",
										{
											staticClass: "group-header collapsible-header",
											on: {
												click: function (t) {
													e.aiSessionsCollapsed = !e.aiSessionsCollapsed
												},
											},
										},
										[
											t("div", { staticClass: "header-left" }, [
												t("i", {
													staticClass: "el-icon-arrow-right collapse-icon",
													class: { expanded: !e.aiSessionsCollapsed },
												}),
												t("span", { staticClass: "group-title" }, [e._v("🤖 AI对话")]),
											]),
											t("span", { staticClass: "group-count" }, [
												e._v("(" + e._s(e.aiSessions.length) + ")"),
											]),
										],
									),
									t("el-collapse-transition", [
										t(
											"div",
											{
												directives: [
													{
														name: "show",
														rawName: "v-show",
														value: !e.aiSessionsCollapsed,
														expression: "!aiSessionsCollapsed",
													},
												],
												staticClass: "chat-list",
											},
											[
												e.loadingAI && 0 === e.aiSessions.length
													? t("div", { staticClass: "loading-placeholder" }, [
															t("i", { staticClass: "el-icon-loading" }),
															t("span", [e._v("正在加载AI会话...")]),
														])
													: [
															e._l(e.aiSessions, function (s, i) {
																var o
																return [
																	s && s.headImage && s.showName
																		? t("chat-item", {
																				key: `ai-session-${s.id}-${i}`,
																				staticClass: "ai-chat-item",
																				class: {
																					active:
																						(null ===
																							(o = e.activeAISession) ||
																						void 0 === o
																							? void 0
																							: o.id) === s.id,
																					"has-complex-tools":
																						s.hasComplexTools,
																					thinking: s.isThinking,
																					"roocode-task": s.isRooCodeTask,
																				},
																				attrs: {
																					chat: s,
																					index: i,
																					loading: e.loading,
																					disableDoubleClick: !0,
																				},
																				on: {
																					active: e.onActiveAIItem,
																					del: e.onDelAIItem,
																					top: e.onTopAIItem,
																				},
																			})
																		: e._e(),
																]
															}),
															e.loadingAI || 0 !== e.aiSessions.length
																? e._e()
																: t("div", { staticClass: "empty-placeholder" }, [
																		t("i", {
																			staticClass: "el-icon-chat-dot-round",
																		}),
																		t("span", [e._v("暂无AI对话记录")]),
																		t("div", { staticClass: "empty-hint" }, [
																			e._v(
																				"使用 Roo Code 创建AI对话后，将在此处显示",
																			),
																		]),
																	]),
														],
											],
											2,
										),
									]),
								],
								1,
							),
							t("div", { staticClass: "chat-group" }, [
								t("div", { staticClass: "group-header" }, [
									t("div", { staticClass: "header-left" }, [
										t("i", { staticClass: "spacer-icon" }),
										t("span", { staticClass: "group-title" }, [e._v("💬 聊天消息")]),
									]),
									t("span", { staticClass: "group-count" }, [
										e._v("(" + e._s(e.filteredHumanSessions.length) + ")"),
									]),
								]),
								t(
									"div",
									{ staticClass: "chat-list" },
									e._l(e.filteredHumanSessions, function (s, i) {
										return t(
											"div",
											{ key: e.generateChatKey(s) },
											[
												t("chat-item", {
													directives: [
														{
															name: "show",
															rawName: "v-show",
															value: !s.delete && s.showName,
															expression: "!chat.delete && chat.showName",
														},
													],
													class: {
														"terminal-inbox": s.isTerminalInbox,
														"normal-chat": !s.isTerminalInbox,
													},
													attrs: {
														chat: e.enrichChatDisplay(s),
														index: i,
														active: e.isHumanChatActive(s),
													},
													on: {
														delete: function (t) {
															return e.onDelHumanItem(s, i)
														},
														top: function (t) {
															return e.onTopHumanItem(s, i)
														},
													},
													nativeOn: {
														click: function (t) {
															return e.onActiveHumanItem(s, i)
														},
													},
												}),
											],
											1,
										)
									}),
									0,
								),
							]),
						]),
					],
					1,
				)
			},
			Oe = [],
			Ve = (s("2382"), s("fffc"), s("a573"), s("9a9a"), s("552e")),
			Be = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{ staticClass: "terminal-selector" },
					[
						t(
							"el-dialog",
							{
								attrs: { title: "选择接收终端", visible: e.dialogVisible, width: "400px" },
								on: {
									"update:visible": function (t) {
										e.dialogVisible = t
									},
									close: e.handleClose,
								},
							},
							[
								t(
									"div",
									{ staticClass: "terminal-list" },
									e._l(e.availableTerminals, function (s) {
										return t(
											"div",
											{
												key: s.type,
												staticClass: "terminal-item",
												class: {
													disabled: !s.online || s.type === e.currentTerminal,
													current: s.type === e.currentTerminal,
												},
												on: {
													click: function (t) {
														return e.selectTerminal(s)
													},
												},
											},
											[
												t("div", { staticClass: "terminal-icon" }, [e._v(e._s(s.icon))]),
												t("div", { staticClass: "terminal-info" }, [
													t("div", { staticClass: "terminal-name" }, [e._v(e._s(s.name))]),
													t(
														"div",
														{ staticClass: "terminal-status", class: e.getStatusClass(s) },
														[e._v(" " + e._s(e.getStatusText(s)) + " ")],
													),
												]),
												s.type === e.currentTerminal
													? t("div", { staticClass: "current-badge" }, [e._v("当前")])
													: e._e(),
											],
										)
									}),
									0,
								),
								0 === e.onlineTerminals.length
									? t("div", { staticClass: "empty-state" }, [
											t("div", { staticClass: "empty-icon" }, [e._v("📱")]),
											t("div", { staticClass: "empty-text" }, [e._v("暂无其他在线终端")]),
											t("div", { staticClass: "empty-hint" }, [e._v("请在其他设备上登录后再试")]),
										])
									: e._e(),
								t(
									"span",
									{ staticClass: "dialog-footer", attrs: { slot: "footer" }, slot: "footer" },
									[
										t("el-button", { on: { click: e.handleClose } }, [e._v("取消")]),
										t(
											"el-button",
											{
												attrs: { type: "primary", disabled: 0 === e.onlineTerminals.length },
												on: { click: e.openQuickSend },
											},
											[e._v(" 快速发送消息 ")],
										),
									],
									1,
								),
							],
						),
						t(
							"el-dialog",
							{
								attrs: { title: "发送消息到终端", visible: e.showQuickSend, width: "500px" },
								on: {
									"update:visible": function (t) {
										e.showQuickSend = t
									},
									close: e.resetQuickSend,
								},
							},
							[
								e.selectedTerminal
									? t("div", { staticClass: "quick-send-header" }, [
											t("span", { staticClass: "target-terminal" }, [
												e._v(
													" " +
														e._s(e.selectedTerminal.icon) +
														" " +
														e._s(e.selectedTerminal.name) +
														" ",
												),
											]),
										])
									: e._e(),
								t("el-input", {
									attrs: {
										type: "textarea",
										rows: 4,
										placeholder: "输入要发送的消息...",
										maxlength: "500",
										"show-word-limit": "",
									},
									on: {
										keydown: function (t) {
											return !t.type.indexOf("key") &&
												e._k(t.keyCode, "enter", 13, t.key, "Enter")
												? null
												: t.ctrlKey
													? e.sendQuickMessage.apply(null, arguments)
													: null
										},
									},
									model: {
										value: e.quickMessage,
										callback: function (t) {
											e.quickMessage = t
										},
										expression: "quickMessage",
									},
								}),
								t("div", { staticClass: "quick-send-tips" }, [
									t("span", { staticClass: "tip" }, [e._v("💡 按 Ctrl+Enter 快速发送")]),
								]),
								t(
									"span",
									{ staticClass: "dialog-footer", attrs: { slot: "footer" }, slot: "footer" },
									[
										t("el-button", { on: { click: e.resetQuickSend } }, [e._v("取消")]),
										t(
											"el-button",
											{
												attrs: {
													type: "primary",
													loading: e.sending,
													disabled: !e.quickMessage.trim(),
												},
												on: { click: e.sendQuickMessage },
											},
											[e._v(" 发送 ")],
										),
									],
									1,
								),
							],
							1,
						),
					],
					1,
				)
			},
			Ue = [],
			ze = {
				name: "TerminalSelector",
				props: { visible: { type: Boolean, default: !1 } },
				data() {
					return {
						dialogVisible: this.visible,
						currentTerminal: this.getCurrentTerminal(),
						availableTerminals: [
							{ type: 0, name: "傻蛋网页端", icon: "🌐", online: !1 },
							{ type: 1, name: "傻蛋精灵App", icon: "📱", online: !1 },
							{ type: 2, name: "我的电脑", icon: "💻", online: !1 },
							{ type: 3, name: "我的云电脑", icon: "🖥", online: !1 },
							{ type: 4, name: "傻蛋浏览器", icon: "🔌", online: !1 },
							{ type: 5, name: "MCP端", icon: "🤖", online: !1 },
						],
						onlineTerminals: [],
						showQuickSend: !1,
						selectedTerminal: null,
						quickMessage: "",
						sending: !1,
					}
				},
				watch: {
					visible(e) {
						;(this.dialogVisible = e), e && this.loadTerminalStatus()
					},
					dialogVisible(e) {
						this.$emit("update:visible", e)
					},
				},
				methods: {
					async loadTerminalStatus() {
						try {
							const e = await this.$http.get("/message/private/terminal-status")
							console.log("终端在线状态返回值:", e)
							const t = e.otherOnlineTerminals || []
							;(this.onlineTerminals = t),
								this.availableTerminals.forEach((e) => {
									e.online = t.includes(e.type)
								}),
								console.log("🔧 终端在线状态:", {
									current: this.currentTerminal,
									online: t,
									available: this.availableTerminals,
								})
						} catch (e) {
							console.error("获取终端状态失败:", e), this.$message.error("获取终端状态失败")
						}
					},
					selectTerminal(e) {
						e.online
							? e.type !== this.currentTerminal
								? (this.$emit("terminal-selected", e.type),
									this.handleClose(),
									console.log("🎯 选择终端:", e))
								: this.$message.warning("无法选择当前终端")
							: this.$message.warning("目标终端不在线")
					},
					openQuickSend() {
						if (0 === this.onlineTerminals.length) return void this.$message.warning("暂无其他在线终端")
						const e = this.availableTerminals.find((e) => e.online && e.type !== this.currentTerminal)
						e && ((this.selectedTerminal = e), (this.showQuickSend = !0), (this.dialogVisible = !1))
					},
					async sendQuickMessage() {
						if (this.quickMessage.trim())
							if (this.selectedTerminal) {
								this.sending = !0
								try {
									const e = {
											recvId: this.$store.getters.currentUser.id,
											content: this.quickMessage.trim(),
											type: 0,
											targetTerminal: this.selectedTerminal.type,
											senderTerminal: this.currentTerminal,
										},
										t = await this.$http.post("/message/private/send-to-terminal", e)
									this.createTargetTerminalChat(this.selectedTerminal.type),
										this.$message.success("消息已发送到" + this.selectedTerminal.name),
										this.resetQuickSend(),
										console.log("📤 终端间消息发送成功:", t.data)
								} catch (t) {
									var e
									console.error("发送终端间消息失败:", t),
										this.$message.error(
											"发送失败: " +
												((null === (e = t.response) ||
												void 0 === e ||
												null === (e = e.data) ||
												void 0 === e
													? void 0
													: e.message) || t.message),
										)
								} finally {
									this.sending = !1
								}
							} else this.$message.warning("请选择目标终端")
						else this.$message.warning("请输入消息内容")
					},
					createTargetTerminalChat(e) {
						const t = this.$store.getters.currentUser.id,
							s = {
								type: "PRIVATE",
								targetId: `${t}_${e}`,
								senderTerminal: this.currentTerminal,
								targetTerminal: e,
								showName: this.getTerminalName(e) + "端",
								headImage: this.getTerminalIcon(e),
								isTerminalChat: !0,
							}
						this.$store.commit("openChat", s), "Chat" !== this.$route.name && this.$router.push("/chat")
					},
					getCurrentTerminal() {
						var e
						return "undefined" !== typeof window
							? window.parent !== window ||
								window.acquireVsCodeApi ||
								window.SharedServicesAccessor ||
								navigator.userAgent.includes("VSCode") ||
								"vscode-webview:" === window.location.protocol
								? 2
								: window.require ||
									  (null !== (e = window.process) && void 0 !== e && e.type) ||
									  window.isElectron ||
									  navigator.userAgent.includes("Electron")
									? 3
									: window.cordova ||
										  window.PhoneGap ||
										  window.phonegap ||
										  navigator.userAgent.includes("wv") ||
										  navigator.userAgent.includes("Mobile")
										? 1
										: 0
							: 0
					},
					getStatusClass(e) {
						return e.type === this.currentTerminal ? "current" : e.online ? "online" : "offline"
					},
					getStatusText(e) {
						return e.type === this.currentTerminal ? "当前终端" : e.online ? "在线" : "离线"
					},
					getTerminalName(e) {
						const t = {
							0: "傻蛋网页端",
							1: "傻蛋精灵App",
							2: "我的电脑",
							3: "我的云电脑",
							4: "傻蛋浏览器",
							5: "MCP端",
						}
						return t[e] || "未知"
					},
					getTerminalIcon(e) {
						const t = { 0: "🌐", 1: "📱", 2: "💻", 3: "🖥", 4: "🔌", 5: "🤖" }
						return t[e] || "❓"
					},
					handleClose() {
						;(this.dialogVisible = !1), this.resetQuickSend()
					},
					resetQuickSend() {
						;(this.showQuickSend = !1),
							(this.selectedTerminal = null),
							(this.quickMessage = ""),
							(this.sending = !1)
					},
				},
			},
			je = ze,
			He = (s("788f"), Object(u["a"])(je, Be, Ue, !1, null, "1eb388d6", null)),
			qe = He.exports,
			We = s("e06d"),
			Ye = {
				name: "chat",
				components: { ChatItem: Ve["a"], TerminalSelector: qe },
				data() {
					return {
						searchText: "",
						messageContent: "",
						group: {},
						groupMembers: [],
						aiSessions: [],
						activeAISession: null,
						loadingAI: !1,
						sessionEventUnsubscribe: null,
						retryCount: 0,
						maxRetries: 3,
						loadingErrors: [],
						isActivatingSession: !1,
						lastActivatedSessionId: null,
						activationDebounceTimer: null,
						activationCooldown: 300,
						isLoadingAllSessions: !1,
						debugMode: !1,
						rooCodeTaskListener: null,
						rooCodeRefreshTimer: null,
						aiSessionsCollapsed: !1,
					}
				},
				watch: {
					aiSessionsCollapsed(e) {
						this.saveCollapseState()
					},
				},
				computed: {
					chatStore() {
						return this.$store.state.chatStore
					},
					loading() {
						return this.chatStore.loadingGroupMsg || this.chatStore.loadingPrivateMsg || this.loadingAI
					},
					filteredAiSessions() {
						var e
						if (0 === this.aiSessions.length) return []
						We["a"].debug("InboxSession", "过滤AI对话，原始数量:", this.aiSessions.length),
							We["a"].debug("InboxSession", "搜索文本:", this.searchText),
							We["a"].debug("InboxSession", "过滤AI对话，原始数量:", this.aiSessions.length),
							We["a"].debug("InboxSession", "搜索文本:", this.searchText)
						const t = this.aiSessions
							.filter((e) => {
								if (!e) return We["a"].warn("InboxSession", "发现空的session对象"), !1
								e.showName ||
									(We["a"].warn("InboxSession", "session缺少showName字段:", e),
									(e.showName = e.title || e.name || e.id || "AI对话 " + Date.now()),
									console.log("[InboxSession] 🔧 已自动修复showName:", e.showName))
								const t = e.showName.toLowerCase().includes(this.searchText.toLowerCase())
								return t
							})
							.map((e, t) => {
								We["a"].debug("InboxSession", `验证AI会话 ${t}:`, e.showName)
								const s = e.lastContent || e.lastMessage || this.generateAISessionSummary(e),
									i = {
										...e,
										headImage: e.headImage || e.avatar || "🤖",
										showName: e.showName || "AI对话 " + (t + 1),
										lastContent: s,
										lastSendTime: e.lastSendTime || e.lastMessageTime || Date.now(),
										type: e.type || "ai",
										targetId: e.targetId || e.id || `ai_${Date.now()}_${t}`,
										unreadCount: e.unreadCount || 0,
										messages: e.messages || [],
										sendNickName: e.sendNickName || "",
										atMe: Boolean(e.atMe),
										atAll: Boolean(e.atAll),
										aiModel: e.aiModel || "Claude-3.5-Sonnet",
										messageCount: e.messageCount || 0,
										hasComplexTools: Boolean(e.hasComplexTools),
										isActive: Boolean(e.isActive),
										isThinking: Boolean(e.isThinking),
										id: e.id || `ai_${Date.now()}_${t}`,
										aiThreadId: e.aiThreadId || e.id,
										avatar: e.avatar || e.headImage || "🤖",
										lastMessage: s,
										lastMessageTime: e.lastMessageTime || e.lastSendTime || Date.now(),
										lastModified: e.lastModified || new Date().toISOString(),
										createdAt: e.createdAt || new Date().toISOString(),
										delete: !1,
										stored: !0,
									},
									o = ["headImage", "showName", "lastContent", "lastSendTime", "type", "targetId"]
								return (
									o.forEach((e) => {
										if (!i[e])
											switch (
												(We["a"].error(
													"InboxSession",
													`严重错误：AI对话 ${t} 字段 ${e} 为空，强制设置默认值`,
												),
												e)
											) {
												case "headImage":
													i.headImage = "🤖"
													break
												case "showName":
													i.showName = "AI对话 " + (t + 1)
													break
												case "lastContent":
													i.lastContent = this.generateAISessionSummary(i)
													break
												case "lastSendTime":
													i.lastSendTime = Date.now()
													break
												case "type":
													i.type = "ai"
													break
												case "targetId":
													i.targetId = `ai_emergency_${Date.now()}_${t}`
													break
											}
									}),
									i
								)
							})
						We["a"].debug("InboxSession", "过滤后AI会话数量:", t.length),
							t.forEach((e, t) => {
								e.headImage ||
									(We["a"].error(
										"InboxSession",
										`致命错误：过滤后的AI对话 ${t} 仍然没有headImage!`,
										e,
									),
									(e.headImage = "🤖")),
									e.showName ||
										(We["a"].error(
											"InboxSession",
											`致命错误：过滤后的AI对话 ${t} 仍然没有showName!`,
											e,
										),
										(e.showName = "AI对话 " + (t + 1)))
							})
						const s = t.sort((e, t) => {
							const s = (e) => {
									const t = [
										e.lastSendTime,
										e.lastMessageTime,
										e.lastModified ? new Date(e.lastModified).getTime() : null,
										e.createdAt ? new Date(e.createdAt).getTime() : null,
									].filter((e) => null != e)
									return t.length > 0 ? Math.max(...t) : 0
								},
								i = s(e),
								o = s(t)
							return o - i
						})
						return (
							We["a"].debug(
								"InboxSession",
								"AI会话按时间倒序排序完成，最新会话:",
								null === (e = s[0]) || void 0 === e ? void 0 : e.showName,
							),
							s
						)
					},
					filteredHumanSessions() {
						const e = this.searchText.toLowerCase(),
							t = (this.chatStore.chats || []).filter(
								(t) =>
									!(!t || t.delete) &&
									(t.isTerminalChat || t.isTerminalInbox
										? t.showName && t.showName.toLowerCase().includes(e)
										: t.showName && "AI" !== t.type && t.showName.toLowerCase().includes(e)),
							),
							s = new Map()
						t.forEach((e) => {
							let t
							;(t = e.isTerminalChat
								? `terminal-${e.senderTerminal}-${e.targetId}`
								: e.isTerminalInbox
									? `inbox-${e.receivingTerminal}-${e.targetId}`
									: `normal-${e.type}-${e.targetId}`),
								(!s.has(t) || e.lastSendTime > s.get(t).lastSendTime) && s.set(t, e)
						})
						const i = Array.from(s.values())
						return (
							i.sort((e, t) => {
								const s = e.isTerminalChat || e.isTerminalInbox,
									i = t.isTerminalChat || t.isTerminalInbox
								return s && !i ? -1 : !s && i ? 1 : (t.lastSendTime || 0) - (e.lastSendTime || 0)
							}),
							console.log("🔧 [InboxSession] 过滤后的人类会话数量: " + i.length),
							console.log(
								"🔧 [InboxSession] 终端会话数量: " +
									i.filter((e) => e.isTerminalChat || e.isTerminalInbox).length,
							),
							console.log(
								"🔧 [InboxSession] 普通会话数量: " +
									i.filter((e) => !e.isTerminalChat && !e.isTerminalInbox).length,
							),
							i
						)
					},
				},
				async mounted() {
					console.log("[InboxSession] 组件挂载，开始初始化..."), this.loadCollapseState()
					try {
						await this.loadAllSessions(), console.log("[InboxSession] 初始化完成")
					} catch (e) {
						console.error("[InboxSession] 初始化失败:", e)
					}
					this.setupRooCodeTaskListener()
				},
				async activated() {
					var e, t
					console.log("[InboxSession] 组件被激活（从keep-alive中恢复）")
					const s =
							(null === (e = this.chatStore) || void 0 === e || null === (e = e.chats) || void 0 === e
								? void 0
								: e.length) > 0,
						i = (null === (t = this.aiSessions) || void 0 === t ? void 0 : t.length) > 0
					s || i || this.isLoadingAllSessions
						? console.log("[InboxSession] 数据已存在或正在加载中，跳过重新加载")
						: (console.log("[InboxSession] 检测到数据为空，重新加载数据..."), await this.loadAllSessions()),
						console.log("[InboxSession] 组件激活处理完成")
				},
				beforeDestroy() {
					this.cleanupEventListeners(),
						this.cleanupRooCodeTaskListener(),
						this._aiSummaryCache && (this._aiSummaryCache.clear(), (this._aiSummaryCache = null))
				},
				methods: {
					loadCollapseState() {
						try {
							const e = localStorage.getItem("inboxSession_aiCollapsed")
							null !== e &&
								((this.aiSessionsCollapsed = JSON.parse(e)),
								console.log("[InboxSession] 已恢复AI会话折叠状态:", this.aiSessionsCollapsed))
						} catch (e) {
							console.warn("[InboxSession] 加载折叠状态失败:", e)
						}
					},
					saveCollapseState() {
						try {
							localStorage.setItem("inboxSession_aiCollapsed", JSON.stringify(this.aiSessionsCollapsed)),
								console.log("[InboxSession] 已保存AI会话折叠状态:", this.aiSessionsCollapsed)
						} catch (e) {
							console.warn("[InboxSession] 保存折叠状态失败:", e)
						}
					},
					async initializeComponent() {
						console.log("[InboxSession] 🔧 开始初始化组件..."),
							requestIdleCallback(async () => {
								try {
									await this.loadAllSessions(), console.log("[InboxSession] ✅ 组件初始化完成")
								} catch (e) {
									console.error("[InboxSession] ❌ 组件初始化失败:", e)
								}
							})
					},
					async loadAllSessions() {
						if (this.isLoadingAllSessions) console.log("[InboxSession] 🔧 正在加载中，跳过重复请求")
						else {
							;(this.isLoadingAllSessions = !0), console.log("[InboxSession] 🔧 开始加载所有会话数据...")
							try {
								const [e, t] = await Promise.allSettled([
									this.loadHumanChats(),
									this.loadAISessionsFromUnified(),
								])
								"fulfilled" === e.status
									? console.log("[InboxSession] ✅ 人类聊天数据加载完成")
									: console.error("[InboxSession] ❌ 人类聊天数据加载失败:", e.reason),
									"fulfilled" === t.status
										? console.log("[InboxSession] ✅ AI对话数据加载完成")
										: console.error("[InboxSession] ❌ AI对话数据加载失败:", t.reason),
									console.log("[InboxSession] 🔧 所有会话数据加载完成")
							} catch (e) {
								console.error("[InboxSession] ❌ 加载会话数据失败:", e)
							} finally {
								this.isLoadingAllSessions = !1
							}
						}
					},
					async loadHumanChats() {
						console.log("[InboxSession] 🔧 开始加载人类聊天数据...")
						try {
							var e
							console.log(
								"[InboxSession] ✅ 人类聊天数据加载完成，会话数量:",
								(null === (e = this.chatStore.chats) || void 0 === e ? void 0 : e.length) || 0,
							)
						} catch (t) {
							throw (console.error("[InboxSession] ❌ 加载人类聊天数据失败:", t), t)
						}
					},
					getDefaultAvatar(e) {
						switch (e) {
							case "GROUP":
								return "👥"
							case "PRIVATE":
								return "👤"
							case "ai":
								return "🤖"
							default:
								return "💬"
						}
					},
					async onActiveItem(e) {
						console.log("[InboxSession] 🔧 激活IM会话 - 原始索引:", e)
						const t = this.chatStore.chats[e]
						var s
						if (!t)
							return (
								console.error("[InboxSession] IM会话不存在，原始索引:", e),
								void console.log(
									"[InboxSession] 🔧 当前chats数量:",
									(null === (s = this.chatStore.chats) || void 0 === s ? void 0 : s.length) || 0,
								)
							)
						console.log("[InboxSession] 🔧 找到会话:", t.showName, "targetId:", t.targetId)
						const i = t.targetId || t.id,
							o = "vue-im-" + i
						this.isActivatingSession && this.lastActivatedSessionId === o
							? console.log("[Vue] 🛡️ 检测到重复激活，忽略:", o)
							: (this.activationDebounceTimer && clearTimeout(this.activationDebounceTimer),
								(this.activationDebounceTimer = setTimeout(async () => {
									try {
										if (
											((this.isActivatingSession = !0),
											(this.lastActivatedSessionId = o),
											console.log("[Vue] 🎯 用户选择IM会话:", t.showName, "ID:", o),
											console.log("[Vue] 🔧 设置activeChat索引:", e, "会话名:", t.showName),
											this.$store.commit("activeChat", e),
											window.vscodeServices)
										) {
											const e = window.vscodeServices.get("IUnifiedSessionService")
											if (e && e.setActiveSession) {
												var s
												const n =
														(null === (s = e.getAllSessions) || void 0 === s
															? void 0
															: s.call(e)) || [],
													a = n.some((e) => e.id === o)
												if (
													(a
														? console.log("[Vue] ✅ 会话已存在，直接激活")
														: (console.log("[Vue] 🔄 会话不存在，进行增量同步..."),
															this.syncSingleSessionToUnified(t, o),
															await new Promise((e) => setTimeout(e, 50))),
													e.setActiveSession(o),
													console.log("[Vue] ✅ 已调用统一会话激活:", o),
													window.vscodeServices)
												)
													try {
														const e = window.vscodeServices.get("panelManagerService")
														if (e && e.openChatEditor) {
															const s = {
																id: t.targetId || t.id,
																nickName: t.showName || t.name,
																name: t.showName || t.name,
																headImage: t.headImage || t.avatar,
																headImageThumb: t.headImageThumb || t.avatar,
																avatar: t.headImage || t.avatar,
															}
															e.openChatEditor(s),
																console.log(
																	"[Vue] ✅ IM聊天编辑器面板已打开:",
																	t.showName,
																)
														} else
															console.warn(
																"[Vue] ⚠️ PanelManagerService或openChatEditor方法不可用",
															)
													} catch (i) {
														console.error("[Vue] ❌ 打开IM聊天编辑器面板失败:", i)
													}
											} else console.warn("[Vue] ⚠️ UnifiedSessionService不可用")
										} else console.warn("[Vue] ⚠️ VSCode环境不可用")
									} catch (i) {
										console.error("[Vue] ❌ IM会话激活失败:", i)
									} finally {
										setTimeout(() => {
											this.isActivatingSession = !1
										}, this.activationCooldown)
									}
								}, 10)))
					},
					onDelItem(e) {
						this.$store.commit("removeChat", e)
					},
					onTop(e) {
						this.$store.commit("moveTop", e)
					},
					async onActiveHumanItem(e, t) {
						console.log("🔧 [InboxSession] 激活人类会话 - 过滤后索引:", t, "会话:", e)
						const s = this.chatStore.chats.findIndex((t) => {
							const s = (t.targetId || t.id) === (e.targetId || e.id),
								i = t.showName === e.showName,
								o = t.type === e.type
							if (e.isTerminalChat) {
								const o = t.isTerminalChat === e.isTerminalChat && t.senderTerminal === e.senderTerminal
								return s && i && o
							}
							if (e.isTerminalInbox) {
								const o =
									t.isTerminalInbox === e.isTerminalInbox &&
									t.receivingTerminal === e.receivingTerminal
								return s && i && o
							}
							return s && i && o
						})
						;-1 !== s
							? (console.log("🔧 [InboxSession] 找到原始索引:", s, "会话:", e.showName),
								e.isTerminalChat || e.isTerminalInbox,
								await this.onActiveItem(s))
							: console.error("🔧 [InboxSession] 未找到匹配的会话:", e)
					},
					onDelHumanItem(e, t) {
						e.isTerminalInbox ? this.onDelTerminalInboxItem(e, t) : this.onDelItem(t)
					},
					onTopHumanItem(e, t) {
						e.isTerminalInbox ? this.onTopTerminalInboxItem(e, t) : this.onTop(t)
					},
					async onActiveTerminalInboxItem(e, t) {
						console.log(
							"[InboxSession] 🔧 激活终端收件箱会话 - 原始索引:",
							t,
							"会话:",
							e.showName,
							"终端:",
							e.receivingTerminal,
						)
						const s = this.chatStore.chats[t]
						if ((null === s || void 0 === s ? void 0 : s.targetId) !== e.targetId) {
							console.warn("[InboxSession] ⚠️ 索引验证失败！传入索引对应的会话不匹配"),
								console.log("[InboxSession] 期望会话:", e.showName, e.targetId),
								console.log(
									"[InboxSession] 实际会话:",
									null === s || void 0 === s ? void 0 : s.showName,
									null === s || void 0 === s ? void 0 : s.targetId,
								)
							const i = this.chatStore.chats.findIndex(
								(t) =>
									(t.targetId || t.id) === (e.targetId || e.id) &&
									t.isTerminalInbox === e.isTerminalInbox &&
									t.receivingTerminal === e.receivingTerminal,
							)
							if (-1 === i) return void console.error("[InboxSession] ❌ 无法找到匹配的会话索引")
							console.log("[InboxSession] 🔧 使用修正后的索引:", i), (t = i)
						}
						try {
							if ((await this.$store.dispatch("switchToChat", t), window.vscodeServices)) {
								const t = window.vscodeServices.get("IUnifiedSessionService")
								if (t) {
									console.log("[InboxSession] 🔧 先同步终端收件箱会话到统一服务")
									const s = "vue-im-" + e.targetId
									this.syncSingleSessionToUnified(e, s),
										t.setActiveSession &&
											(console.log("[InboxSession] 🔧 终端收件箱会话ID:", s),
											t.setActiveSession(s))
								}
							}
							console.log("[InboxSession] ✅ 终端收件箱会话激活完成")
						} catch (i) {
							console.error("[InboxSession] 激活终端收件箱会话失败:", i),
								this.$message.error("加载终端会话失败")
						}
					},
					onDelTerminalInboxItem(e, t) {
						this.$confirm(`确定要删除${e.showName}的会话记录吗？`, "确认删除", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning",
						})
							.then(() => {
								this.$store.commit("removeChat", t), this.$message.success("终端会话已删除")
							})
							.catch(() => {})
					},
					onTopTerminalInboxItem(e, t) {
						this.$store.commit("moveTop", t), this.$message.success(e.showName + "已置顶")
					},
					async loadTerminalInboxMessages(e) {
						try {
							console.log(`[InboxSession] 开始加载${e.showName}历史消息...`)
							const t = await this.$store.dispatch("loadTerminalInboxHistory", {
								receivingTerminal: e.receivingTerminal,
								page: 1,
								size: 50,
							})
							if ((console.log(`[InboxSession] 从服务器获取到${t.length}条消息`), t && t.length > 0)) {
								const s = t.map((e) => {
									const t =
										"string" === typeof e.sendTime
											? new Date(e.sendTime).getTime()
											: e.sendTime || Date.now()
									return {
										...e,
										sendTime: t,
										id: e.id || e.tmpId || `terminal_${Date.now()}_${Math.random()}`,
										selfSend: void 0 !== e.selfSend && e.selfSend,
										sendNickName: e.sendNickName || this.generateTerminalSenderName(e),
										type: e.type || 0,
										status: e.status || 1,
									}
								})
								this.$store.commit("batchInsertMessages", { messages: s, chatInfo: e })
								const i = s[s.length - 1]
								;(e.lastContent = i.content),
									(e.lastSendTime = i.sendTime),
									console.log(`[InboxSession] ✅ 成功加载并插入${s.length}条终端消息`)
							} else console.log(`[InboxSession] 📭 ${e.showName}无历史消息`)
						} catch (t) {
							console.error("[InboxSession] 加载终端收件箱消息失败:", t),
								this.$message.error("加载终端消息失败")
						}
					},
					generateTerminalSenderName(e) {
						const t = this.$store.state.userStore.userInfo,
							s = (null === t || void 0 === t ? void 0 : t.nickName) || "用户"
						if (void 0 !== e.senderTerminal) {
							const t = this.getTerminalName(e.senderTerminal)
							return `${s}(${t}端)`
						}
						return s
					},
					generateChatKey(e) {
						return e.isTerminalInbox ? "terminal-" + e.receivingTerminal : `${e.type}-${e.targetId}`
					},
					enrichChatDisplay(e) {
						const t = { ...e }
						if (e.isTerminalChat || e.isTerminalInbox) {
							if (!t.showName) {
								let s
								e.isTerminalChat
									? (s = e.senderTerminal)
									: e.isTerminalInbox && (s = e.receivingTerminal),
									(t.showName = this.getTerminalName(s) + "端")
							}
							if (!t.headImage) {
								let s
								e.isTerminalChat
									? (s = e.senderTerminal)
									: e.isTerminalInbox && (s = e.receivingTerminal),
									(t.headImage = this.getTerminalIcon(s))
							}
							;(t.chatType = e.isTerminalChat ? "terminal-chat" : "terminal-inbox"),
								console.log("🔧 [InboxSession] 丰富终端会话显示: " + t.showName)
						}
						return t
					},
					getTerminalName(e) {
						const t = { 0: "Web", 1: "App", 2: "VSCode", 3: "PC" }
						return t[e] || "未知"
					},
					getTerminalIcon(e) {
						const t = { 0: "🌐", 1: "📱", 2: "💻", 3: "🖥️" }
						return t[e] || "❓"
					},
					initializeUnifiedSessionService() {
						console.log("[InboxSession] 初始化统一会话服务"),
							window.vscodeServices
								? console.log("[InboxSession] 统一会话服务初始化完成")
								: console.error("[InboxSession] vscodeServices不可用")
					},
					async loadAISessionsFromUnified() {
						try {
							this.loadingAI = !0
							let t = [],
								s = []
							try {
								if (
									(console.log("[InboxSession] 🔧 开始获取RooCode任务历史..."),
									window.vscodeServices && window.vscodeServices.get)
								) {
									console.log("[InboxSession] 🔧 尝试获取IRooCodeTaskHistoryService...")
									const e = window.vscodeServices.get("IRooCodeTaskHistoryService")
									if ((console.log("[InboxSession] 🔧 IRooCodeTaskHistoryService:", !!e), e)) {
										console.log("[InboxSession] 🔧 调用getTaskHistory方法...")
										const t = await e.getTaskHistory()
										console.log("[InboxSession] 🔧 获取到RooCode任务:", t),
											t && t.tasks && t.tasks.length > 0
												? (console.log("[InboxSession] 🔧 开始转换RooCode任务为AI会话格式..."),
													(s = t.tasks.map((t) => {
														console.log("[InboxSession] 🔧 转换任务:", t)
														const s = e.convertToAISession(t)
														return { ...s, isRooCodeTask: !0, originalTask: t }
													})),
													console.log("[InboxSession] 🔧 转换后的RooCode任务数:", s.length))
												: console.log("[InboxSession] 🔧 没有获取到RooCode任务或任务数组为空")
									} else console.warn("[InboxSession] 🔧 IRooCodeTaskHistoryService服务不可用")
								} else console.warn("[InboxSession] 🔧 window.vscodeServices不可用")
							} catch (e) {
								console.error("[InboxSession] 获取RooCode任务历史失败:", e)
							}
							s.length > 0 &&
								(console.log("[InboxSession] 🔧 合并RooCode任务到AI会话列表..."), (t = [...s, ...t])),
								console.log("[InboxSession] 🔧 === AI对话获取总结 ==="),
								console.log("[InboxSession] 🔧 最终获取到AI对话:", t.length, "个"),
								console.log("[InboxSession] 🔧 其中RooCode任务:", s.length, "个"),
								console.log("[InboxSession] 🔧 原始AI对话数据:", t),
								console.log("[InboxSession] AI对话数据处理完成:", this.aiSessions.length, "个")
						} catch (e) {
							throw (
								(console.error("[InboxSession] 从统一会话管理器加载AI对话失败:", e),
								(this.aiSessions = []),
								e)
							)
						} finally {
							this.loadingAI = !1
						}
					},
					generateAISessionSummary(e) {
						var t, s
						const i = `${e.id}_${(null === (t = e.metadata) || void 0 === t ? void 0 : t.messageCount) || e.messageCount || 0}`
						if ((this._aiSummaryCache || (this._aiSummaryCache = new Map()), this._aiSummaryCache.has(i)))
							return this._aiSummaryCache.get(i)
						const o =
							(null === (s = e.metadata) || void 0 === s ? void 0 : s.messageCount) || e.messageCount || 0
						var n
						this.debugMode &&
							(console.log("[InboxSession] generateAISessionSummary调用，会话ID:", e.id, "消息数量:", o),
							console.log("[InboxSession] 会话数据结构:", {
								metadataMessageCount:
									null === (n = e.metadata) || void 0 === n ? void 0 : n.messageCount,
								sessionMessageCount: e.messageCount,
								finalMessageCount: o,
							}))
						let a
						if (
							(0 === o
								? (this.debugMode && console.log("[InboxSession] AI对话无消息，返回默认值"),
									(a = "新建的AI对话"))
								: (a = 1 === o ? "1 条对话" : o + " 条对话"),
							this._aiSummaryCache.set(i, a),
							this._aiSummaryCache.size > 100)
						) {
							const e = this._aiSummaryCache.keys().next().value
							this._aiSummaryCache.delete(e)
						}
						return a
					},
					getAIAvatar(e) {
						const t = { "Claude-3.5-Sonnet": "🤖", "GPT-4": "🧠", Gemini: "💎", default: "🤖" }
						return t[e] || t.default
					},
					onActiveAIItem(e) {
						const t = this.aiSessions[e]
						if (!t) return void console.error("[InboxSession] AI对话不存在，索引:", e)
						if (t.isRooCodeTask)
							return (
								console.log("[InboxSession] 激活RooCode任务:", t.showName),
								void this.onActiveRooCodeTask(t)
							)
						const s = "react-" + (t.aiThreadId || t.targetId || t.id)
						this.isActivatingSession && this.lastActivatedSessionId === s
							? console.log("[Vue] 🛡️ 检测到重复激活AI会话，忽略:", s)
							: (this.activationDebounceTimer && clearTimeout(this.activationDebounceTimer),
								(this.activationDebounceTimer = setTimeout(async () => {
									try {
										if (
											((this.isActivatingSession = !0),
											(this.lastActivatedSessionId = s),
											console.log("[Vue] 🎯 用户选择AI对话:", t.showName, "ID:", s),
											window.vscodeServices)
										) {
											const i = window.vscodeServices.get("IUnifiedSessionService")
											if (i && i.setActiveSession) {
												if (
													(i.setActiveSession(s),
													console.log("[Vue] ✅ 已调用统一AI会话激活:", s),
													window.vscodeServices.openAIChatEditor)
												)
													try {
														window.vscodeServices.openAIChatEditor(t),
															console.log("[Vue] ✅ AI聊天编辑器面板已打开:", t.showName)
													} catch (e) {
														console.error("[Vue] ❌ 打开AI聊天编辑器面板失败:", e)
													}
											} else console.warn("[Vue] ⚠️ UnifiedSessionService不可用")
										} else console.warn("[Vue] ⚠️ VSCode环境不可用")
									} catch (e) {
										console.error("[Vue] ❌ AI会话激活失败:", e)
									} finally {
										setTimeout(() => {
											this.isActivatingSession = !1
										}, this.activationCooldown)
									}
								}, 50)))
					},
					async onActiveRooCodeTask(e) {
						try {
							if (
								(console.log("[InboxSession] 激活RooCode任务:", e),
								console.log("[InboxSession] 原始任务对象:", e.originalTask),
								window.vscodeServices)
							) {
								const s = window.vscodeServices.get("IRooCodeTaskHistoryService")
								if (s && s.activateTask) {
									const i = e.originalTask.id
									console.log("[InboxSession] 准备激活任务ID:", i)
									const o = await s.activateTask(i)
									var t
									if (o)
										console.log("[InboxSession] RooCode任务激活成功:", i),
											(this.activeAISession = e),
											window.vscodeServices.get("ICommandService") &&
												(await window.vscodeServices
													.get("ICommandService")
													.executeCommand("roo-cline.SidebarProvider.focus"))
									else
										console.error("[InboxSession] RooCode任务激活失败:", i),
											null === (t = this.$message) || void 0 === t || t.error("激活任务失败")
								}
							}
						} catch (i) {
							var s
							console.error("[InboxSession] 激活RooCode任务失败:", i),
								null === (s = this.$message) || void 0 === s || s.error("激活任务失败")
						}
					},
					async onDelAIItem(e) {
						const t = this.aiSessions[e]
						if (t) {
							if (t.isRooCodeTask)
								return (
									console.log("[InboxSession] 删除RooCode任务:", t.showName),
									void this.onDelRooCodeTask(t)
								)
							try {
								var s
								console.log("[Vue] 删除AI对话:", t.showName)
								const e = t.aiThreadId || t.targetId || t.id
								var i
								if (!window.SharedServicesAccessor)
									return (
										console.warn("[Vue] VSCode环境不可用"),
										void (
											null === (i = this.$message) ||
											void 0 === i ||
											i.error("VSCode环境不可用")
										)
									)
								{
									const t = window.SharedServicesAccessor.get("IUnifiedSessionService"),
										s = window.SharedServicesAccessor.get("IChatThreadService")
									var o, n
									if (!s || !s.deleteThread)
										return (
											console.warn("[Vue] ChatThreadService不可用"),
											void (
												null === (o = this.$message) ||
												void 0 === o ||
												o.error("删除服务不可用")
											)
										)
									if (
										(console.log("[Vue] 通过ChatThreadService删除AI线程:", e),
										s.deleteThread(e),
										t && t.deleteSessionIndex)
									)
										try {
											await t.deleteSessionIndex(e, "react-ai"),
												console.log("[Vue] AI对话FTS索引已删除")
										} catch (r) {
											console.warn("[Vue] 删除AI对话FTS索引失败:", r)
										}
									console.log("[Vue] AI对话删除完成:", e),
										null === (n = this.$message) || void 0 === n || n.success("AI对话已删除")
								}
								const a = this.aiSessions.findIndex((e) => e.id === t.id)
								a >= 0 && this.aiSessions.splice(a, 1),
									(null === (s = this.activeAISession) || void 0 === s ? void 0 : s.id) === t.id &&
										((this.activeAISession = null), this.$bus.$emit("ai:chat:cleared"))
							} catch (r) {
								var a
								console.error("[Vue] 删除AI对话失败:", r),
									null === (a = this.$message) || void 0 === a || a.error("删除失败")
							}
						}
					},
					async onDelRooCodeTask(e) {
						try {
							if (!confirm("确定要删除这个RooCode任务吗？")) return
							if (
								(console.log("[InboxSession] 删除RooCode任务:", e.originalTask), window.vscodeServices)
							) {
								const i = window.vscodeServices.get("IRooCodeTaskHistoryService")
								if (i && i.deleteTask) {
									const o = e.originalTask.id,
										n = await i.deleteTask(o)
									if (n) {
										var t
										console.log("[InboxSession] RooCode任务删除成功:", o)
										const s = this.aiSessions.findIndex((t) => t.id === e.id)
										;-1 !== s && this.aiSessions.splice(s, 1),
											null === (t = this.$message) || void 0 === t || t.success("任务已删除")
									} else {
										var s
										console.error("[InboxSession] RooCode任务删除失败:", o),
											null === (s = this.$message) || void 0 === s || s.error("删除任务失败")
									}
								}
							}
						} catch (o) {
							var i
							console.error("[InboxSession] 删除RooCode任务失败:", o),
								null === (i = this.$message) || void 0 === i || i.error("删除任务失败")
						}
					},
					onTopAIItem(e) {
						const t = this.aiSessions[e]
						if (!t) return
						console.log("🔝 置顶AI对话:", t.showName)
						const s = this.aiSessions.findIndex((e) => e.id === t.id)
						if (s >= 0) {
							const e = this.aiSessions[s],
								t = Date.now()
							;(e.lastSendTime = t),
								(e.lastMessageTime = t),
								(e.lastModified = new Date(t).toISOString()),
								console.log("🔝 AI会话置顶完成，新时间戳:", t)
						} else console.warn("🔝 未找到要置顶的AI会话:", t.showName)
					},
					truncateText(e, t) {
						return !e || e.length <= t ? e : e.substring(0, t) + "..."
					},
					setupEventListeners() {
						console.log("[InboxSession] 设置事件监听器")
						try {
							const e = this.$vscode.get("IUnifiedSessionService")
							if (e && e.onSessionChanged) {
								const t = e.onSessionChanged(this.handleSessionEvent.bind(this))
								t && "function" === typeof t.dispose
									? ((this.sessionEventUnsubscribe = () => t.dispose()),
										console.log("[InboxSession] 已订阅统一会话事件"))
									: (console.warn("[InboxSession] 事件订阅返回的不是有效的disposable对象"),
										(this.sessionEventUnsubscribe = null))
							} else
								console.warn("[InboxSession] 统一会话服务或onSessionChanged事件不可用"),
									(this.sessionEventUnsubscribe = null)
							window.addEventListener("unified-session-created", this.handleSessionCreated),
								console.log("[InboxSession] 事件监听器设置完成")
						} catch (e) {
							console.error("[InboxSession] 设置事件监听器失败:", e),
								(this.sessionEventUnsubscribe = null)
						}
					},
					handleSessionEvent(e) {
						if (
							(console.log(
								"[Vue] 收到会话事件:",
								null === e || void 0 === e ? void 0 : e.type,
								null === e || void 0 === e ? void 0 : e.sessionId,
							),
							e && e.type)
						)
							if (
								"unified-session-activated" === e.type &&
								this.isActivatingSession &&
								e.sessionId === this.lastActivatedSessionId
							)
								console.log("[Vue] 🛡️ 检测到自己激活产生的事件，跳过处理:", e.sessionId)
							else
								switch (e.type) {
									case "unified-session-activated":
										"vue-im" === e.sessionType
											? this.handleImSessionActivated(e)
											: "react-ai" === e.sessionType && this.handleAiSessionActivated(e)
										break
									case "unified-session-deleted":
										this.handleSessionDeleted(e)
										break
									case "unified-session-added":
									case "unified-session-created":
										console.log("[Vue] 会话已创建/添加，处理新建会话"), this.handleSessionCreated(e)
										break
									case "unified-session-updated":
										console.log("[Vue] 会话已更新")
										break
									default:
										console.log("[Vue] 未处理的会话事件类型:", e.type)
								}
					},
					handleSessionDeleted(e) {
						if (e.sessionId && e.sessionType)
							if (
								(console.log(`[Vue] 处理会话删除: ${e.sessionType}:${e.sessionId}`),
								"react-ai" === e.sessionType)
							) {
								const t = e.sessionId.replace("react-", ""),
									s = this.aiSessions.length
								this.aiSessions = this.aiSessions.filter((e) => {
									const s = e.aiThreadId || e.targetId || e.id
									return s !== t
								})
								const i = s - this.aiSessions.length
								i > 0
									? (console.log(`[Vue] 已从AI会话列表移除 ${i} 个会话`),
										!this.activeAISession ||
											(this.activeAISession.aiThreadId !== t &&
												this.activeAISession.targetId !== t &&
												this.activeAISession.id !== t) ||
											(console.log("[Vue] 清除当前活跃AI会话"),
											(this.activeAISession = null),
											this.$bus.$emit("ai:chat:cleared")))
									: console.log("[Vue] 未找到要删除的AI会话:", t)
							} else
								"vue-im" === e.sessionType && console.log("[Vue] 收到Vue IM会话删除事件:", e.sessionId)
						else console.warn("[Vue] 会话删除事件缺少必要信息")
					},
					handleSessionCreated(e) {
						console.log("[InboxSession] 收到会话创建事件:", e.detail || e)
						try {
							const t = e.detail || e,
								{ sessionType: s, sessionId: i, sessionData: o } = t
							"react-ai" === s &&
								(console.log("[InboxSession] React侧创建了新AI对话:", i),
								this.loadAllSessions(),
								setTimeout(() => {
									const e = this.aiSessions.find((e) => e.id === i || e.aiThreadId === i)
									e &&
										(console.log("[InboxSession] 自动激活新创建的AI会话:", e.showName),
										(this.activeAISession = e))
								}, 500))
						} catch (t) {
							console.error("[InboxSession] 处理会话创建事件失败:", t)
						}
					},
					async handleImSessionActivated(e) {
						var t, s, i
						console.log(
							"[Vue] 🔧 处理IM会话激活:",
							null === (t = e.session) || void 0 === t ? void 0 : t.title,
						),
							console.log("[Vue] 🔧 事件数据:", e)
						const o = e.session
						if (!o) return void console.warn("[Vue] 🔧 事件中没有会话数据")
						const n = o.targetId || o.sessionId || o.realSessionRef
						if (!n) return void console.warn("[Vue] 🔧 事件中没有有效的targetId:", o)
						var a
						;(console.log("[Vue] 🔧 查找targetId:", n, "类型:", typeof n),
						console.log(
							"[Vue] 🔧 当前聊天列表:",
							null === (s = this.chatStore.chats) || void 0 === s
								? void 0
								: s.map((e) => ({ targetId: e.targetId, id: e.id, showName: e.showName })),
						),
						this.chatStore.chats && 0 !== this.chatStore.chats.length) ||
							(console.log("[Vue] 🔄 聊天数据为空，重新加载..."),
							await this.loadHumanChats(),
							console.log(
								"[Vue] 🔄 重新加载后的聊天列表:",
								null === (a = this.chatStore.chats) || void 0 === a
									? void 0
									: a.map((e) => ({ targetId: e.targetId, id: e.id, showName: e.showName })),
							))
						const r = n.toString()
						let l =
							null === (i = this.chatStore.chats) || void 0 === i
								? void 0
								: i.find((e) => {
										var t
										const s =
												null === (t = e.targetId || e.id) || void 0 === t
													? void 0
													: t.toString(),
											i = s === r
										return i && console.log("[Vue] 🔧 找到匹配会话:", e.showName), i
									})
						var c
						!l &&
							this.chatStore.chats &&
							this.chatStore.chats.length > 0 &&
							(console.log("[Vue] 🔄 首次匹配失败，重新加载数据再次尝试..."),
							await this.loadHumanChats(),
							(l =
								null === (c = this.chatStore.chats) || void 0 === c
									? void 0
									: c.find((e) => {
											var t
											const s =
													null === (t = e.targetId || e.id) || void 0 === t
														? void 0
														: t.toString(),
												i = s === r
											return i && console.log("[Vue] 🔧 重新加载后找到匹配会话:", e.showName), i
										})))
						if (l) {
							var d
							const e = this.chatStore.chats.indexOf(l)
							if (
								(console.log("[Vue] 🔧 激活会话索引:", e, "会话名:", l.showName),
								this.$store.commit("activeChat", e),
								(this.activeAISession = null),
								console.log("[Vue] 🔧 会话已在本地激活，EditorChat会通过统一事件接收"),
								null !== (d = window.SharedServicesAccessor) && void 0 !== d && d.openChatEditor)
							) {
								const e = {
									id: l.targetId || l.id,
									nickName: l.showName || l.name,
									name: l.showName || l.name,
									headImage: l.headImage || l.avatar,
									headImageThumb: l.headImageThumb || l.avatar,
									avatar: l.headImage || l.avatar,
								}
								try {
									window.SharedServicesAccessor.openChatEditor(e),
										console.log("[Vue] 🔧 Chat editor opened successfully"),
										this.$bus &&
											(this.$bus.$emit("chat:ensure-panel-visible", {
												sessionType: "IM",
												sessionData: l,
												reason: "session-activated",
											}),
											console.log("[Vue] 🔧 已发送面板可见确保事件"))
								} catch (u) {
									console.error("[Vue] ❌ Failed to open chat editor:", u)
								}
							}
						} else {
							var h
							console.warn("[Vue] ❌ 未找到匹配的会话，targetId:", n),
								console.log(
									"[Vue] 🔧 可用会话ID列表:",
									null === (h = this.chatStore.chats) || void 0 === h
										? void 0
										: h.map((e) => e.targetId || e.id),
								),
								console.log("[Vue] 🔧 强制清除会话选择"),
								this.$store.commit("clearActiveChat"),
								(this.activeAISession = null)
						}
					},
					handleAiSessionActivated(e) {
						var t, s
						console.log(
							"[Vue] 处理AI会话激活:",
							null === (t = e.session) || void 0 === t ? void 0 : t.title,
						)
						const i = e.session
						if (!i) return
						const o =
							null === (s = this.aiSessions) || void 0 === s
								? void 0
								: s.find((e) => e.id === i.sessionId || e.aiThreadId === i.sessionId)
						var n
						if (
							o &&
							((this.activeAISession = o),
							this.$store.commit("clearActiveChat"),
							this.$bus.$emit("ai:chat:selected", o),
							null !== (n = window.SharedServicesAccessor) && void 0 !== n && n.openAIChatEditor)
						)
							try {
								window.SharedServicesAccessor.openAIChatEditor(o),
									console.log("[Vue] AI chat editor opened successfully"),
									this.$bus &&
										(this.$bus.$emit("chat:ensure-panel-visible", {
											sessionType: "AI",
											sessionData: o,
											reason: "session-activated",
										}),
										console.log("[Vue] 🔧 已发送AI面板可见确保事件"))
							} catch (a) {
								console.error("[Vue] Failed to open AI chat editor:", a)
							}
					},
					openAIChat(e) {
						if (
							(console.log("打开AI会话:", e.showName),
							(this.activeAISession = e),
							this.$store.commit("clearActiveChat"),
							this.$bus &&
								(this.$bus.$emit("ai:chat:selected", e),
								console.log("[InboxSession] 已通过事件总线发送 ai:chat:selected 事件")),
							this.$emit("ai-chat-selected", e),
							window.SharedServicesAccessor && window.SharedServicesAccessor.openAIChatEditor)
						)
							try {
								window.SharedServicesAccessor.openAIChatEditor(e),
									console.log("[InboxSession] AI chat editor opened successfully"),
									this.$bus &&
										(this.$bus.$emit("chat:ensure-panel-visible", {
											sessionType: "AI",
											sessionData: e,
											reason: "direct-open",
										}),
										console.log("[InboxSession] 🔧 已发送AI面板可见确保事件（直接打开）"))
							} catch (t) {
								console.error("[InboxSession] Failed to open AI chat editor:", t)
							}
						else
							console.log(
								"[InboxSession] VSCode环境中，同时打开编辑器中的AI聊天窗口，这个逻辑分支没有执行 - openAIChatEditor方法不存在",
							)
					},
					getHumanSessionIndex(e) {
						const t = this.filteredHumanSessions
						if (e >= 0 && e < t.length) {
							const s = t[e]
							return this.chatStore.chats.findIndex((e) => e === s)
						}
						return e
					},
					formatTime(e) {
						if (!e) return ""
						const t = new Date(e),
							s = new Date(),
							i = s.getTime() - t.getTime()
						return i < 6e4
							? "刚刚"
							: i < 36e5
								? Math.floor(i / 6e4) + "分钟前"
								: i < 864e5
									? Math.floor(i / 36e5) + "小时前"
									: t.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })
					},
					async refreshSessions() {
						try {
							var e
							console.log("刷新会话列表"),
								await this.loadAllSessions(),
								null === (e = this.$message) || void 0 === e || e.success("对话列表已刷新")
						} catch (s) {
							var t
							console.error("刷新对话失败:", s),
								null === (t = this.$message) || void 0 === t || t.error("刷新失败")
						}
					},
					formatSyncTime(e) {
						const t = Date.now(),
							s = t - e
						return s < 6e4
							? "刚刚"
							: s < 36e5
								? Math.floor(s / 6e4) + "分钟前"
								: new Date(e).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
					},
					setActiveSessionInUnified(e) {
						try {
							if (
								(console.log("🎯 [InboxSession] 通过统一服务设置活跃会话:", e.showName),
								window.vscodeServices)
							) {
								const t = window.vscodeServices.get("IUnifiedSessionService")
								if (t && t.setActiveSession) {
									let s
									;(s =
										"ai" === e.type || e.isAI
											? "react-" + (e.aiThreadId || e.targetId || e.id)
											: "vue-im-" + (e.targetId || e.id)),
										console.log("🔧 [InboxSession] 设置统一活跃会话ID:", s),
										t.setActiveSession(s),
										console.log("✅ [InboxSession] 统一活跃会话设置成功")
								} else console.log("⚠️ [InboxSession] UnifiedSessionService不可用")
							} else console.log("⚠️ [InboxSession] VSCode环境不可用")
						} catch (t) {
							console.error("❌ [InboxSession] 统一活跃会话设置失败:", t)
						}
					},
					transformSessionForWorkspace(e) {
						return e
							? {
									id: e.targetId || e.id || "session_" + Date.now(),
									sessionId: e.targetId || e.id,
									showName: e.showName || e.name || "未知会话",
									type: e.type || (e.isAI ? "ai" : "PRIVATE"),
									headImage: e.headImage || e.avatar || "💬",
									avatar: e.headImage || e.avatar || "💬",
									lastContent: e.lastContent || e.lastMessage || "",
									lastMessage: e.lastContent || e.lastMessage || "",
									lastSendTime: e.lastSendTime || e.lastMessageTime || Date.now(),
									lastMessageTime: e.lastSendTime || e.lastMessageTime || Date.now(),
									unreadCount: e.unreadCount || 0,
									messageCount: e.messageCount || 0,
									isAI: Boolean("ai" === e.type || e.isAI),
									aiModel: e.aiModel,
									aiThreadId: e.aiThreadId,
									hasComplexTools: Boolean(e.hasComplexTools),
									isThinking: Boolean(e.isThinking),
									originalData: e,
								}
							: null
					},
					initializeWorkspaceSync() {
						try {
							console.log("🔧 [InboxSession] 初始化工作区同步（单向模式）..."),
								window.SharedServicesAccessor
									? (console.log("✅ [InboxSession] VSCode环境可用"),
										console.log("✅ [InboxSession] 单向同步模式已启用"))
									: console.log("⚠️ [InboxSession] VSCode环境不可用")
						} catch (e) {
							console.error("❌ [InboxSession] 工作区同步初始化失败:", e)
						}
					},
					syncSessionsToUnified() {
						try {
							if ((console.log("🔄 [InboxSession] 同步会话到统一服务"), !window.SharedServicesAccessor))
								return void console.log("⚠️ [InboxSession] VSCode环境不可用")
							const e = window.SharedServicesAccessor.get("IUnifiedSessionService")
							if (!e || !e.syncVueSessionsFromWebView)
								return void console.log("⚠️ [InboxSession] UnifiedSessionService不可用")
							const t = []
							this.filteredHumanSessions.forEach((e, s) => {
								var i
								const o = {
										id: e.targetId || e.id,
										sessionId: e.targetId || e.id,
										showName: e.showName || e.name || "未知会话",
										type: "vue-im",
										lastSendTime: e.lastSendTime || e.lastMessageTime || Date.now(),
										lastMessageTime: e.lastSendTime || e.lastMessageTime || Date.now(),
										messageCount:
											(null === (i = e.messages) || void 0 === i ? void 0 : i.length) || 0,
										isActive: this.chatStore.activeChat === e,
										isTerminalInbox: Boolean(e.isTerminalInbox),
										receivingTerminal: e.receivingTerminal,
										sessionType: e.isTerminalInbox ? "terminal-inbox" : "normal-chat",
									},
									n = e.isTerminalInbox ? "终端收件箱" : "普通IM"
								console.log(
									`🔧 [InboxSession] 准备同步${n}会话${s}:`,
									o.showName,
									"sessionType:",
									o.sessionType,
								),
									t.push(o)
							}),
								console.log(`📊 [InboxSession] 只同步${t.length}个人类会话到统一服务`),
								console.log(
									`🔧 [InboxSession] AI会话数量: ${this.filteredAiSessions.length}个（不同步，由UnifiedSessionService直接管理）`,
								),
								e.syncVueSessionsFromWebView(t),
								console.log(`✅ [InboxSession] 同步${t.length}个人类会话到统一服务完成`)
						} catch (e) {
							console.error("❌ [InboxSession] 同步会话到统一服务失败:", e),
								console.error("❌ [InboxSession] 错误堆栈:", e.stack)
						}
					},
					syncSingleSessionToUnified(e, t) {
						try {
							var s
							if (
								(console.log("🔧 [InboxSession] 增量同步单个会话:", e.showName), !window.vscodeServices)
							)
								return void console.log("⚠️ [InboxSession] VSCode环境不可用")
							const t = window.vscodeServices.get("IUnifiedSessionService")
							if (!t || !t.syncVueSessionsFromWebView)
								return void console.log("⚠️ [InboxSession] UnifiedSessionService不可用")
							const i = {
									id: e.targetId || e.id,
									sessionId: e.targetId || e.id,
									showName: e.showName || e.name || "未知会话",
									type: "vue-im",
									lastSendTime: e.lastSendTime || e.lastMessageTime || Date.now(),
									lastMessageTime: e.lastSendTime || e.lastMessageTime || Date.now(),
									messageCount: (null === (s = e.messages) || void 0 === s ? void 0 : s.length) || 0,
									isActive: !0,
									isTerminalInbox: Boolean(e.isTerminalInbox),
									receivingTerminal: e.receivingTerminal,
									sessionType: e.isTerminalInbox ? "terminal-inbox" : "normal-chat",
								},
								o = e.isTerminalInbox ? "终端收件箱" : "普通IM"
							console.log(`🔧 [InboxSession] 同步单个${o}会话:`, i.showName),
								t.syncVueSessionsFromWebView([i]),
								console.log(`✅ [InboxSession] 单个${o}会话同步完成`)
						} catch (i) {
							console.error("❌ [InboxSession] 单个会话同步失败:", i)
						}
					},
					setupRooCodeTaskListener() {
						if ((console.log("[InboxSession] 设置RooCode任务监听器"), window.vscodeServices)) {
							const e = window.vscodeServices.get("IRooCodeTaskHistoryService")
							e &&
								e.onTaskHistoryChanged &&
								(this.rooCodeTaskListener = e.onTaskHistoryChanged((e) => {
									console.log("[InboxSession] RooCode任务历史变更:", e),
										this.handleRooCodeTaskUpdate(e)
								}))
						}
					},
					cleanupRooCodeTaskListener() {
						console.log("[InboxSession] 清理RooCode任务监听器"),
							this.rooCodeTaskListener &&
								(this.rooCodeTaskListener.dispose(), (this.rooCodeTaskListener = null)),
							this.rooCodeRefreshTimer &&
								(clearInterval(this.rooCodeRefreshTimer), (this.rooCodeRefreshTimer = null))
					},
					async handleRooCodeTaskUpdate(e) {
						if (!e || !e.tasks) return void console.log("[InboxSession] 无效的任务数据:", e)
						console.log("[InboxSession] 处理RooCode任务更新，任务数:", e.tasks.length)
						const t = this.aiSessions.filter((e) => !e.isRooCodeTask)
						if ((console.log("[InboxSession] 保留非RooCode会话数:", t.length), window.vscodeServices)) {
							const s = window.vscodeServices.get("IRooCodeTaskHistoryService")
							if (s && s.convertToAISession) {
								const i = e.tasks.map((e) => {
									const t = s.convertToAISession(e)
									return { ...t, isRooCodeTask: !0, originalTask: e }
								})
								console.log("[InboxSession] 转换后的RooCode任务数:", i.length)
								const o = [...i, ...t],
									n = o.sort((e, t) => {
										const s = e.lastMessageTime || e.lastSendTime || 0,
											i = t.lastMessageTime || t.lastSendTime || 0
										return i - s
									})
								if (
									(this.$set(this, "aiSessions", n),
									console.log(
										"[InboxSession] RooCode任务已更新，当前会话总数:",
										this.aiSessions.length,
									),
									e.activeTaskId)
								) {
									const t = this.aiSessions.find((t) => {
										var s
										return (
											t.isRooCodeTask &&
											(null === (s = t.originalTask) || void 0 === s ? void 0 : s.id) ===
												e.activeTaskId
										)
									})
									t &&
										((this.activeAISession = t),
										console.log("[InboxSession] 更新激活任务:", e.activeTaskId))
								}
								this.$nextTick(() => {
									console.log("[InboxSession] DOM更新完成"), this.$forceUpdate()
								})
							} else console.error("[InboxSession] RooCodeService未找到或无convertToAISession方法")
						} else console.error("[InboxSession] window.vscodeServices未定义")
					},
					cleanupEventListeners() {
						console.log("[InboxSession] 清理事件监听器")
						try {
							this.activationDebounceTimer &&
								(clearTimeout(this.activationDebounceTimer),
								(this.activationDebounceTimer = null),
								console.log("[InboxSession] 激活防抖计时器已清理")),
								(this.isActivatingSession = !1),
								(this.lastActivatedSessionId = null),
								window.removeEventListener("unified-session-created", this.handleSessionCreated),
								this.sessionEventUnsubscribe &&
									"function" === typeof this.sessionEventUnsubscribe &&
									(this.sessionEventUnsubscribe(),
									(this.sessionEventUnsubscribe = null),
									console.log("[InboxSession] 统一会话事件监听器已清理")),
								console.log("[InboxSession] 事件监听器清理完成")
						} catch (e) {
							console.error("[InboxSession] 清理事件监听器失败:", e)
						}
					},
					async forceReloadAllData() {
						console.log("[InboxSession] 强制重新加载所有数据开始")
						try {
							await this.checkAndFixStoreState(),
								await this.initializeComponent(),
								console.log("[InboxSession] 强制重新加载完成")
						} catch (e) {
							console.error("[InboxSession] 强制重新加载失败:", e)
						}
					},
					async refreshData() {
						console.log("[InboxSession] 🔄 轻量级数据刷新开始")
						try {
							await this.checkAndFixStoreState(),
								await this.loadAllSessions(),
								console.log("[InboxSession] 🔄 轻量级数据刷新完成")
						} catch (e) {
							console.error("[InboxSession] 🔄 轻量级数据刷新失败:", e)
						}
					},
					async checkAndFixStoreState() {
						var e, t, s, i
						if (
							(console.log("[InboxSession] 🔍 检查 store 状态开始"),
							console.log("[InboxSession] 🔍 this.$store 存在:", !!this.$store),
							console.log(
								"[InboxSession] 🔍 this.$store.state 存在:",
								!(null === (e = this.$store) || void 0 === e || !e.state),
							),
							console.log(
								"[InboxSession] 🔍 chatStore 存在:",
								!(
									null === (t = this.$store) ||
									void 0 === t ||
									null === (t = t.state) ||
									void 0 === t ||
									!t.chatStore
								),
							),
							console.log(
								"[InboxSession] 🔍 chatStore.chats 存在:",
								!(
									null === (s = this.$store) ||
									void 0 === s ||
									null === (s = s.state) ||
									void 0 === s ||
									null === (s = s.chatStore) ||
									void 0 === s ||
									!s.chats
								),
							),
							!this.$store)
						)
							return console.error("[InboxSession] ❌ this.$store 不存在！这是严重问题"), !1
						if (!this.$store.state) return console.error("[InboxSession] ❌ this.$store.state 不存在！"), !1
						if (!this.$store.state.chatStore)
							return (
								console.error("[InboxSession] ❌ chatStore 模块不存在！"),
								console.log("[InboxSession] 🔍 可用的 store 模块:", Object.keys(this.$store.state)),
								!1
							)
						if (!this.$store.state.chatStore.chats) {
							console.warn("[InboxSession] ⚠️ chatStore.chats 不存在，尝试初始化")
							try {
								await this.$store.dispatch("initializeChatStore")
							} catch (n) {
								console.warn("[InboxSession] 初始化 chatStore 失败，尝试手动创建:", n),
									this.$store.state.chatStore &&
										!this.$store.state.chatStore.chats &&
										((this.$store.state.chatStore.chats = []),
										console.log("[InboxSession] ✅ 手动创建了 chatStore.chats 数组"))
							}
						}
						const o = !(
							null === (i = this.$store) ||
							void 0 === i ||
							null === (i = i.state) ||
							void 0 === i ||
							null === (i = i.chatStore) ||
							void 0 === i ||
							!i.chats
						)
						return console.log("[InboxSession] 🔍 最终 store 状态检查:", o ? "✅ 正常" : "❌ 异常"), o
					},
					isHumanChatActive(e) {
						const t = this.chatStore.activeChat
						if (!t || !e) return !1
						const s = (t.targetId || t.id) === (e.targetId || e.id),
							i = t.showName === e.showName,
							o = t.type === e.type
						if (e.isTerminalInbox && t.isTerminalInbox) {
							const o = t.receivingTerminal === e.receivingTerminal
							return s && i && o
						}
						return s && i && o
					},
					async onActiveTerminalChatItem(e, t) {
						var s
						console.log("🔧 [InboxSession] 激活终端会话 - 原始索引:", t, "会话:", e.showName)
						const i = this.chatStore.chats[t]
						if ((null === i || void 0 === i ? void 0 : i.targetId) !== e.targetId) {
							console.warn("🔧 [InboxSession] ⚠️ 索引验证失败！传入索引对应的会话不匹配"),
								console.log("🔧 [InboxSession] 期望会话:", e.showName, e.targetId),
								console.log(
									"🔧 [InboxSession] 实际会话:",
									null === i || void 0 === i ? void 0 : i.showName,
									null === i || void 0 === i ? void 0 : i.targetId,
								)
							const s = this.chatStore.chats.findIndex(
								(t) =>
									(t.targetId || t.id) === (e.targetId || e.id) &&
									((t.isTerminalChat && t.senderTerminal === e.senderTerminal) ||
										(t.isTerminalInbox && t.receivingTerminal === e.receivingTerminal)),
							)
							if (-1 === s) return void console.error("🔧 [InboxSession] ❌ 无法找到正确的会话索引")
							console.log("🔧 [InboxSession] 🔍 重新找到正确索引:", s), (t = s)
						}
						if (
							((this.chatStore.activeChat = this.chatStore.chats[t]),
							console.log(
								"🔧 [InboxSession] ✅ 终端会话激活完成:",
								e.showName,
								"消息数:",
								(null === (s = this.chatStore.chats[t]) ||
								void 0 === s ||
								null === (s = s.messages) ||
								void 0 === s
									? void 0
									: s.length) || 0,
							),
							window.vscodeServices)
						)
							try {
								const t = window.vscodeServices.get("panelManagerService")
								if (t && t.openChatEditor) {
									const s = {
										id: e.targetId || e.id,
										nickName: e.showName || e.name,
										name: e.showName || e.name,
										headImage: e.headImage || e.avatar,
										headImageThumb: e.headImageThumb || e.avatar,
										avatar: e.headImage || e.avatar,
										isTerminalChat: e.isTerminalChat,
										isTerminalInbox: e.isTerminalInbox,
										receivingTerminal: e.receivingTerminal,
										senderTerminal: e.senderTerminal,
									}
									t.openChatEditor(s),
										console.log("[InboxSession] ✅ 终端会话编辑器面板已打开:", e.showName)
								} else console.warn("[InboxSession] ⚠️ PanelManagerService或openChatEditor方法不可用")
							} catch (o) {
								console.error("[InboxSession] ❌ 打开终端会话编辑器面板失败:", o)
							}
					},
				},
			},
			Je = Ye,
			Ke = (s("35b7"), Object(u["a"])(Je, Ge, Oe, !1, null, "45d813b4", null)),
			Qe = Ke.exports,
			Ze = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-container",
					{ staticClass: "friend-page" },
					[
						t(
							"el-aside",
							{ staticClass: "friend-list-box", attrs: { width: "100%" } },
							[
								t(
									"div",
									{ staticClass: "friend-list-header" },
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
										t("el-button", {
											staticClass: "add-btn",
											attrs: { plain: "", icon: "el-icon-plus", title: "添加好友" },
											on: {
												click: function (t) {
													return e.onShowAddFriend()
												},
											},
										}),
										t("add-friend", {
											attrs: { dialogVisible: e.showAddFriend },
											on: { close: e.onCloseAddFriend },
										}),
									],
									1,
								),
								t(
									"el-scrollbar",
									{ staticClass: "friend-list-items" },
									e._l(e.friendValues, function (s, i) {
										return t(
											"div",
											{ key: i },
											[
												t("div", { staticClass: "index-title" }, [e._v(e._s(e.friendKeys[i]))]),
												e._l(s, function (s) {
													return t(
														"div",
														{ key: s.id },
														[
															t("friend-item", {
																attrs: {
																	friend: s,
																	active: s.id === e.activeFriend.id,
																},
																on: {
																	chat: function (t) {
																		return e.onSendMessage(s)
																	},
																	delete: function (t) {
																		return e.onDelFriend(s)
																	},
																},
																nativeOn: {
																	click: function (t) {
																		return e.onActiveItem(s)
																	},
																},
															}),
														],
														1,
													)
												}),
												i < e.friendValues.length - 1
													? t("div", { staticClass: "divider" })
													: e._e(),
											],
											2,
										)
									}),
									0,
								),
							],
							1,
						),
					],
					1,
				)
			},
			Xe = [],
			et = s("ff36"),
			tt = s("5e7c"),
			st = s("4371"),
			it = {
				name: "friend",
				components: { FriendItem: et["a"], AddFriend: tt["a"], HeadImage: P["a"] },
				data() {
					return { searchText: "", showAddFriend: !1, userInfo: {}, activeFriend: {} }
				},
				methods: {
					onShowAddFriend() {
						this.showAddFriend = !0
					},
					onCloseAddFriend() {
						this.showAddFriend = !1
					},
					onActiveItem(e) {
						if (
							(console.log("hahahha"),
							console.log(
								"[InboxFriend] window.SharedServicesAccessor available:",
								!!window.SharedServicesAccessor,
							),
							console.log(
								"[InboxFriend] window.SharedServicesAccessor type:",
								typeof window.SharedServicesAccessor,
							),
							console.log(
								"[InboxFriend] openChatEditor available:",
								!(!window.SharedServicesAccessor || !window.SharedServicesAccessor.openChatEditor),
							),
							(this.activeFriend = e),
							this.$store.commit("setActiveFriend", e),
							this.loadUserInfo(e.id),
							window.SharedServicesAccessor && window.SharedServicesAccessor.openChatEditor)
						) {
							const s = {
								id: e.id,
								nickName: e.nickName,
								name: e.nickName,
								headImage: e.headImage,
								headImageThumb: e.headImageThumb || e.headImage,
								avatar: e.headImage,
							}
							console.log("[InboxFriend] Opening chat editor for friend:", s.nickName)
							try {
								window.SharedServicesAccessor.openChatEditor(s),
									console.log("[InboxFriend] Chat editor opened successfully")
							} catch (t) {
								console.error("[InboxFriend] Failed to open chat editor:", t)
							}
						} else {
							console.warn(
								"[InboxFriend] window.SharedServicesAccessor.openChatEditor not available, trying fallback event",
							)
							try {
								const t = {
										id: e.id,
										nickName: e.nickName,
										name: e.nickName,
										headImage: e.headImage,
										headImageThumb: e.headImageThumb || e.headImage,
										avatar: e.headImage,
									},
									s = new CustomEvent("wechat:openChatEditor", { detail: { user: t } })
								window.dispatchEvent(s), console.log("[InboxFriend] Fallback event dispatched:", s)
							} catch (t) {
								console.error("[InboxFriend] Failed to dispatch fallback event:", t)
							}
						}
					},
					onDelFriend(e) {
						this.$confirm(`确认删除'${e.nickName}',并清空聊天记录吗?`, "确认解除?", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning",
						}).then(() => {
							this.$http({ url: "/friend/delete/" + e.id, method: "delete" }).then(() => {
								this.$message.success("删除好友成功"),
									this.$store.commit("removeFriend", e.id),
									this.$store.commit("removePrivateChat", e.id)
							})
						})
					},
					onAddFriend(e) {
						this.$http({ url: "/friend/add", method: "post", params: { friendId: e.id } }).then(() => {
							this.$message.success("添加成功，对方已成为您的好友")
							let t = { id: e.id, nickName: e.nickName, headImage: e.headImage, online: e.online }
							this.$store.commit("addFriend", t)
						})
					},
					onSendMessage(e) {
						let t = { type: "PRIVATE", targetId: e.id, showName: e.nickName, headImage: e.headImageThumb }
						if (
							(this.$store.commit("openChat", t),
							this.$store.commit("activeChat", 0),
							this.$router.push("/home/chat"),
							window.SharedServicesAccessor && window.SharedServicesAccessor.openChatEditor)
						) {
							const t = {
								id: e.id,
								nickName: e.nickName,
								name: e.nickName,
								headImage: e.headImage,
								headImageThumb: e.headImageThumb || e.headImage,
								avatar: e.headImage,
							}
							console.log("[InboxFriend] Opening chat editor for send message to:", t.nickName)
							try {
								window.SharedServicesAccessor.openChatEditor(t),
									console.log("[InboxFriend] Chat editor opened successfully for messaging")
							} catch (s) {
								console.error("[InboxFriend] Failed to open chat editor for messaging:", s)
							}
						}
					},
					showFullImage() {
						this.userInfo.headImage && this.$store.commit("showFullImageBox", this.userInfo.headImage)
					},
					updateFriendInfo() {
						if (this.isFriend) {
							let e = JSON.parse(JSON.stringify(this.activeFriend))
							;(e.headImage = this.userInfo.headImageThumb),
								(e.nickName = this.userInfo.nickName),
								this.$store.commit("updateChatFromFriend", e),
								this.$store.commit("updateFriend", e)
						}
					},
					loadUserInfo(e) {
						this.$http({ url: "/user/find/" + e, method: "GET" }).then((e) => {
							;(this.userInfo = e), this.updateFriendInfo()
						})
					},
					firstLetter(e) {
						let t = { toneType: "none", type: "normal" },
							s = Object(st["a"])(e, t)
						return s[0]
					},
					isEnglish(e) {
						return /^[A-Za-z]+$/.test(e)
					},
				},
				computed: {
					friendStore() {
						return this.$store.state.friendStore
					},
					isFriend() {
						return this.$store.getters.isFriend(this.userInfo.id)
					},
					friendMap() {
						let e = new Map()
						this.friendStore.friends.forEach((t) => {
							if (t.deleted || (this.searchText && !t.nickName.includes(this.searchText))) return
							let s = this.firstLetter(t.nickName).toUpperCase()
							this.isEnglish(s) || (s = "#"),
								t.online && (s = "在线"),
								e.has(s) ? e.get(s).push(t) : e.set(s, [t])
						})
						let t = Array.from(e)
						return (
							t.sort((e, t) =>
								"#" == e[0] || "#" == t[0] ? t[0].localeCompare(e[0]) : e[0].localeCompare(t[0]),
							),
							(e = new Map(t.map((e) => [e[0], e[1]]))),
							e
						)
					},
					friendKeys() {
						return Array.from(this.friendMap.keys())
					},
					friendValues() {
						return Array.from(this.friendMap.values())
					},
				},
				mounted() {
					console.log("[InboxFriend] Component mounted!"),
						console.log(
							"[InboxFriend] window.SharedServicesAccessor available on mount:",
							!!window.SharedServicesAccessor,
						),
						console.log("[InboxFriend] window object keys:", Object.keys(window))
				},
			},
			ot = it,
			nt = (s("26b2"), Object(u["a"])(ot, Ze, Xe, !1, null, null, null)),
			at = nt.exports,
			rt = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-container",
					{ staticClass: "group-page" },
					[
						t(
							"el-aside",
							{ staticClass: "group-list-box", attrs: { width: "100%" } },
							[
								t(
									"div",
									{ staticClass: "group-list-header" },
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
										t("el-button", {
											staticClass: "add-btn",
											attrs: { plain: "", icon: "el-icon-plus", title: "创建群聊" },
											on: {
												click: function (t) {
													return e.onCreateGroup()
												},
											},
										}),
									],
									1,
								),
								t(
									"el-scrollbar",
									{ staticClass: "group-list-items" },
									e._l(e.groupValues, function (s, i) {
										return t(
											"div",
											{ key: i },
											[
												t("div", { staticClass: "index-title" }, [e._v(e._s(e.groupKeys[i]))]),
												e._l(s, function (s) {
													return t(
														"div",
														{ key: s.id },
														[
															t("group-item", {
																attrs: { group: s, active: s.id == e.activeGroup.id },
																nativeOn: {
																	click: function (t) {
																		return e.onActiveItem(s)
																	},
																},
															}),
														],
														1,
													)
												}),
												i < e.groupValues.length - 1
													? t("div", { staticClass: "divider" })
													: e._e(),
											],
											2,
										)
									}),
									0,
								),
							],
							1,
						),
					],
					1,
				)
			},
			lt = [],
			ct = s("66d8"),
			dt = s("2859"),
			ht = s("b242"),
			ut = s("2082"),
			mt = {
				name: "group",
				components: {
					GroupItem: ct["a"],
					GroupMember: dt["a"],
					FileUpload: D["a"],
					AddGroupMember: ht["a"],
					GroupMemberSelector: ut["a"],
					HeadImage: P["a"],
				},
				data() {
					return {
						searchText: "",
						maxSize: 5242880,
						activeGroup: {},
						groupMembers: [],
						showAddGroupMember: !1,
						showMaxIdx: 150,
						rules: { name: [{ required: !0, message: "请输入群聊名称", trigger: "blur" }] },
					}
				},
				methods: {
					onCreateGroup() {
						this.$prompt("请输入群聊名称", "创建群聊", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							inputPattern: /\S/,
							inputErrorMessage: "请输入群聊名称",
						}).then((e) => {
							this.$store.state.userStore.userInfo
							let t = { name: e.value }
							this.$http({ url: "/group/create?groupName=" + e.value, method: "post", data: t }).then(
								(e) => {
									this.$store.commit("addGroup", e)
								},
							)
						})
					},
					onActiveItem(e) {
						if (
							((this.showMaxIdx = 150),
							(this.activeGroup = JSON.parse(JSON.stringify(e))),
							this.$store.commit("setActiveGroup", this.activeGroup),
							(this.groupMembers = []),
							this.loadGroupMembers(),
							this.$emit("groupClick", {
								type: "GROUP",
								targetId: e.id,
								showName: e.showGroupName || e.name,
								headImage: e.headImage,
							}),
							window.SharedServicesAccessor && window.SharedServicesAccessor.openChatEditor)
						) {
							const s = {
								id: e.id,
								nickName: e.showGroupName || e.name,
								name: e.showGroupName || e.name,
								headImage: e.headImage,
								headImageThumb: e.headImageThumb || e.headImage,
								avatar: e.headImage,
								type: "GROUP",
							}
							console.log("[InboxGroup] Opening chat editor for group:", s.nickName)
							try {
								window.SharedServicesAccessor.openChatEditor(s),
									console.log("[InboxGroup] Chat editor opened successfully")
							} catch (t) {
								console.error("[InboxGroup] Failed to open chat editor:", t)
							}
						}
					},
					onInvite() {
						this.$refs.addGroupMember.open()
					},
					onRemove() {
						let e = [this.activeGroup.ownerId]
						this.$refs.removeSelector.open(50, [], [], e)
					},
					onRemoveComplete(e) {
						let t = e.map((e) => e.userId),
							s = { groupId: this.activeGroup.id, userIds: t }
						this.$http({ url: "/group/members/remove", method: "delete", data: s }).then(() => {
							this.loadGroupMembers(), this.$message.success(`您移除了${t.length}位成员`)
						})
					},
					onUploadSuccess(e) {
						;(this.activeGroup.headImage = e.originUrl), (this.activeGroup.headImageThumb = e.thumbUrl)
					},
					onSaveGroup() {
						this.$refs["groupForm"].validate((e) => {
							if (e) {
								let e = this.activeGroup
								this.$http({ url: "/group/modify", method: "put", data: e }).then((e) => {
									this.$store.commit("updateGroup", e), this.$message.success("修改成功")
								})
							}
						})
					},
					onDissolve() {
						this.$confirm(`确认要解散'${this.activeGroup.name}'吗?`, "确认解散?", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning",
						}).then(() => {
							this.$http({ url: "/group/delete/" + this.activeGroup.id, method: "delete" }).then(() => {
								this.$message.success(`群聊'${this.activeGroup.name}'已解散`),
									this.$store.commit("removeGroup", this.activeGroup.id),
									this.reset()
							})
						})
					},
					onQuit() {
						this.$confirm(`确认退出'${this.activeGroup.showGroupName}',并清空聊天记录吗？`, "确认退出?", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning",
						}).then(() => {
							this.$http({ url: "/group/quit/" + this.activeGroup.id, method: "delete" }).then(() => {
								this.$message.success(`您已退出'${this.activeGroup.name}'`),
									this.$store.commit("removeGroup", this.activeGroup.id),
									this.$store.commit("removeGroupChat", this.activeGroup.id),
									this.reset()
							})
						})
					},
					onSendMessage() {
						let e = {
							type: "GROUP",
							targetId: this.activeGroup.id,
							showName: this.activeGroup.showGroupName,
							headImage: this.activeGroup.headImage,
						}
						if (
							(this.$store.commit("openChat", e),
							this.$store.commit("activeChat", 0),
							this.$router.push("/home/chat"),
							window.SharedServicesAccessor && window.SharedServicesAccessor.openChatEditor)
						) {
							const e = {
								id: this.activeGroup.id,
								nickName: this.activeGroup.showGroupName || this.activeGroup.name,
								name: this.activeGroup.showGroupName || this.activeGroup.name,
								headImage: this.activeGroup.headImage,
								headImageThumb: this.activeGroup.headImageThumb || this.activeGroup.headImage,
								avatar: this.activeGroup.headImage,
								type: "GROUP",
							}
							console.log("[InboxGroup] Opening chat editor for send message to group:", e.nickName)
							try {
								window.SharedServicesAccessor.openChatEditor(e),
									console.log("[InboxGroup] Chat editor opened successfully for group messaging")
							} catch (t) {
								console.error("[InboxGroup] Failed to open chat editor for group messaging:", t)
							}
						}
					},
					onScroll(e) {
						const t = e.target
						t.scrollTop + t.clientHeight >= t.scrollHeight - 30 &&
							this.showMaxIdx < this.showMembers.length &&
							(this.showMaxIdx += 50)
					},
					loadGroupMembers() {
						this.$http({ url: "/group/members/" + this.activeGroup.id, method: "get" }).then((e) => {
							this.groupMembers = e
						})
					},
					reset() {
						;(this.activeGroup = {}), (this.groupMembers = [])
					},
					firstLetter(e) {
						let t = { toneType: "none", type: "normal" },
							s = Object(st["a"])(e, t)
						return s[0]
					},
					isEnglish(e) {
						return /^[A-Za-z]+$/.test(e)
					},
				},
				computed: {
					groupStore() {
						return this.$store.state.groupStore
					},
					ownerName() {
						let e = this.groupMembers.find((e) => e.userId == this.activeGroup.ownerId)
						return e && e.showNickName
					},
					isOwner() {
						return this.activeGroup.ownerId == this.$store.state.userStore.userInfo.id
					},
					imageAction() {
						return "/image/upload"
					},
					groupMap() {
						let e = new Map()
						this.groupStore.groups.forEach((t) => {
							if (t.quit || (this.searchText && !t.showGroupName.includes(this.searchText))) return
							let s = this.firstLetter(t.showGroupName).toUpperCase()
							this.isEnglish(s) || (s = "#"), e.has(s) ? e.get(s).push(t) : e.set(s, [t])
						})
						let t = Array.from(e)
						return (
							t.sort((e, t) =>
								"#" == e[0] || "#" == t[0] ? t[0].localeCompare(e[0]) : e[0].localeCompare(t[0]),
							),
							(e = new Map(t.map((e) => [e[0], e[1]]))),
							e
						)
					},
					groupKeys() {
						return Array.from(this.groupMap.keys())
					},
					groupValues() {
						return Array.from(this.groupMap.values())
					},
					showMembers() {
						return this.groupMembers.filter((e) => !e.quit)
					},
					scrollHeight() {
						return Math.min(300, 80 + (this.showMembers.length / 10) * 80)
					},
				},
				mounted() {},
			},
			gt = mt,
			pt = (s("78b2"), Object(u["a"])(gt, rt, lt, !1, null, null, null)),
			ft = pt.exports,
			vt = {
				components: {
					HeadImage: P["a"],
					Setting: V,
					UserInfo: q,
					FullImage: Z,
					RtcPrivateVideo: be,
					RtcPrivateAcceptor: ae,
					RtcGroupVideo: ke,
					InboxSession: Qe,
					InboxFriend: at,
					InboxGroup: ft,
				},
				data() {
					return {
						showSettingDialog: !1,
						lastPlayAudioTime: new Date().getTime() - 1e3,
						isFullscreen: !0,
						reconnecting: !1,
					}
				},
				methods: {
					init() {
						this.$eventBus.$on("openPrivateVideo", (e) => {
							this.$refs.rtcPrivateVideo.open(e)
						}),
							this.$eventBus.$on("openGroupVideo", (e) => {
								this.$refs.rtcGroupVideo.open(e)
							}),
							this.$store
								.dispatch("load")
								.then(() => {
									this.$wsApi.connect(
										"wss://aiim.ws.service.thinkgs.cn/im",
										sessionStorage.getItem("accessToken"),
									),
										this.$wsApi.onConnect(() => {
											console.log("[reconnecting]:", this.reconnecting),
												this.reconnecting
													? this.onReconnectWs()
													: (this.pullPrivateOfflineMessage(
															this.$store.state.chatStore.privateMsgMaxId,
														),
														this.pullGroupOfflineMessage(
															this.$store.state.chatStore.groupMsgMaxId,
														))
										}),
										this.$wsApi.onMessage((e, t) => {
											2 == e
												? (this.$wsApi.close(3e3),
													this.$alert("您已在其他地方登录，将被强制下线", "强制下线通知", {
														confirmButtonText: "确定",
														callback: (e) => {
															location.href = "/"
														},
													}))
												: 3 == e
													? this.handlePrivateMessage(t)
													: 4 == e
														? this.handleGroupMessage(t)
														: 5 == e
															? this.handleSystemMessage(t)
															: 11 == e
																? this.handleLLMChunk(t)
																: 12 == e
																	? this.handleLLMEnd(t)
																	: 13 == e && this.handleLLMError(t)
										}),
										this.$wsApi.onClose((e) => {
											3e3 != e.code && this.reconnectWs()
										})
								})
								.catch((e) => {
									console.log("初始化失败", e)
								})
					},
					reconnectWs() {
						;(this.reconnecting = !0),
							this.$store
								.dispatch("loadUser")
								.then(() => {
									this.$message.error("连接断开，正在尝试重新连接..."),
										this.$wsApi.reconnect(
											"wss://aiim.ws.service.thinkgs.cn/im",
											sessionStorage.getItem("accessToken"),
										)
								})
								.catch(() => {
									setTimeout(() => this.reconnectWs(), 1e4)
								})
					},
					onReconnectWs() {
						this.reconnecting = !1
						const e = []
						e.push(this.$store.dispatch("loadFriend")),
							e.push(this.$store.dispatch("loadGroup")),
							Promise.all(e)
								.then(() => {
									this.pullPrivateOfflineMessage(this.$store.state.chatStore.privateMsgMaxId),
										this.pullGroupOfflineMessage(this.$store.state.chatStore.groupMsgMaxId),
										this.$message.success("重新连接成功")
								})
								.catch(() => {
									this.$message.error("初始化失败"), this.onExit()
								})
					},
					pullPrivateOfflineMessage(e) {
						console.log("[Inbox] 拉取私聊离线消息，minId: " + e),
							this.$store.commit("loadingPrivateMsg", !0),
							this.$http({ url: "/message/private/pullOfflineMessage?minId=" + e, method: "GET" }).catch(
								() => {
									this.$store.commit("loadingPrivateMsg", !1)
								},
							)
					},
					pullGroupOfflineMessage(e) {
						console.log("[Inbox] 拉取群聊离线消息，minId: " + e),
							this.$store.commit("loadingGroupMsg", !0),
							this.$http({ url: "/message/group/pullOfflineMessage?minId=" + e, method: "GET" }).catch(
								() => {
									this.$store.commit("loadingGroupMsg", !1)
								},
							)
					},
					handlePrivateMessage(e) {
						if (
							((e.selfSend = e.sendId == this.$store.state.userStore.userInfo.id),
							void 0 !== e.senderTerminal && void 0 !== e.targetTerminal)
						)
							return (
								console.log("[Inbox] 🔧 接收到终端消息:", e),
								(e.isTerminalChat = !0),
								e.targetTerminal === this.getCurrentTerminal() && this.insertTerminalMessage(e),
								void (
									e.id &&
									e.id > this.$store.state.chatStore.privateMsgMaxId &&
									this.$store.commit("updatePrivateMsgMaxId", e.id)
								)
							)
						let t = e.selfSend ? e.recvId : e.sendId,
							s = { type: "PRIVATE", targetId: t }
						if (e.type != this.$enums.MESSAGE_TYPE.LOADING)
							if (e.type != this.$enums.MESSAGE_TYPE.READED)
								if (e.type != this.$enums.MESSAGE_TYPE.RECEIPT)
									if (e.type != this.$enums.MESSAGE_TYPE.RECALL)
										if (e.type != this.$enums.MESSAGE_TYPE.FRIEND_NEW)
											if (e.type != this.$enums.MESSAGE_TYPE.FRIEND_DEL) {
												if (this.$msgType.isRtcPrivate(e.type))
													this.$refs.rtcPrivateVideo.onRTCMessage(e)
												else if (
													this.$msgType.isNormal(e.type) ||
													this.$msgType.isTip(e.type) ||
													this.$msgType.isAction(e.type)
												) {
													let s = this.loadFriendInfo(t)
													this.insertPrivateMessage(s, e)
												}
											} else this.$store.commit("removeFriend", t)
										else this.$store.commit("addFriend", JSON.parse(e.content))
									else this.$store.commit("recallMessage", [e, s])
								else this.$store.commit("readedMessage", { friendId: e.sendId })
							else this.$store.commit("resetUnreadCount", s)
						else this.$store.commit("loadingPrivateMsg", JSON.parse(e.content))
					},
					insertTerminalMessage(e) {
						try {
							const t = this.$store.state.userStore.userInfo
							if (!t || !t.id) return void console.error("[Inbox] 用户信息未加载，无法处理终端消息")
							const s = e.senderTerminal,
								i = e.targetTerminal || this.getCurrentTerminal(),
								o = this.getCurrentTerminal()
							;(e.selfSend = e.senderTerminal === o),
								e.targetTerminal || (e.targetTerminal = o),
								console.log(
									`🔧 [Inbox] 终端消息: ${this.getTerminalName(s)}端→${this.getTerminalName(i)}端, selfSend=${e.selfSend}`,
								)
							const n = {
								type: "PRIVATE",
								targetId: `${t.id}_${s}`,
								showName: this.getTerminalName(s) + "端",
								headImage: this.getTerminalIcon(s),
								isTerminalChat: !0,
								senderTerminal: s,
							}
							;(e.sendNickName = `${t.nickName}(${this.getTerminalName(s)}端)`),
								this.$store.commit("openChat", n),
								this.$store.commit("insertMessage", [e, n]),
								console.log(`✅ [Inbox] 终端消息已插入到 ${this.getTerminalName(s)}端 会话`),
								!e.selfSend &&
									this.$msgType.isNormal(e.type) &&
									e.status != this.$enums.MESSAGE_STATUS.READED &&
									this.playAudioTip()
						} catch (t) {
							console.error("[Inbox] 处理终端消息失败:", t, e)
						}
					},
					getTerminalName(e) {
						const t = {
							0: "傻蛋网页",
							1: "傻蛋精灵App",
							2: "我的电脑",
							3: "我的云电脑",
							4: "傻蛋浏览器",
							5: "MCP",
						}
						return t[e] || "未知"
					},
					getTerminalIcon(e) {
						const t = { 0: "🌐", 1: "📱", 2: "💻", 3: "🖥️", 4: "🔌", 5: "🤖" }
						return t[e] || "❓"
					},
					getCurrentTerminal() {
						var e
						return "undefined" !== typeof window
							? window.parent !== window ||
								window.acquireVsCodeApi ||
								window.SharedServicesAccessor ||
								navigator.userAgent.includes("VSCode") ||
								"vscode-webview:" === window.location.protocol
								? 2
								: window.require ||
									  (null !== (e = window.process) && void 0 !== e && e.type) ||
									  window.isElectron ||
									  navigator.userAgent.includes("Electron")
									? 3
									: window.cordova ||
										  window.PhoneGap ||
										  window.phonegap ||
										  navigator.userAgent.includes("wv") ||
										  navigator.userAgent.includes("Mobile")
										? 1
										: 0
							: 0
					},
					insertPrivateMessage(e, t) {
						let s = { type: "PRIVATE", targetId: e.id, showName: e.nickName, headImage: e.headImage }
						this.$store.commit("openChat", s),
							this.$store.commit("insertMessage", [t, s]),
							!t.selfSend &&
								this.$msgType.isNormal(t.type) &&
								t.status != this.$enums.MESSAGE_STATUS.READED &&
								this.playAudioTip()
					},
					handleGroupMessage(e) {
						e.selfSend = e.sendId == this.$store.state.userStore.userInfo.id
						let t = { type: "GROUP", targetId: e.groupId }
						if (e.type != this.$enums.MESSAGE_TYPE.LOADING)
							if (e.type != this.$enums.MESSAGE_TYPE.READED)
								if (e.type != this.$enums.MESSAGE_TYPE.RECEIPT)
									if (e.type != this.$enums.MESSAGE_TYPE.RECALL)
										if (e.type != this.$enums.MESSAGE_TYPE.GROUP_NEW)
											if (e.type != this.$enums.MESSAGE_TYPE.GROUP_DEL) {
												if (this.$msgType.isRtcGroup(e.type))
													this.$nextTick(() => {
														this.$refs.rtcGroupVideo.onRTCMessage(e)
													})
												else if (
													this.$msgType.isNormal(e.type) ||
													this.$msgType.isTip(e.type) ||
													this.$msgType.isAction(e.type)
												) {
													let t = this.loadGroupInfo(e.groupId)
													this.insertGroupMessage(t, e)
												}
											} else this.$store.commit("removeGroup", e.groupId)
										else this.$store.commit("addGroup", JSON.parse(e.content))
									else this.$store.commit("recallMessage", [e, t])
								else {
									let s = {
										id: e.id,
										groupId: e.groupId,
										readedCount: e.readedCount,
										receiptOk: e.receiptOk,
									}
									this.$store.commit("updateMessage", [s, t])
								}
							else this.$store.commit("resetUnreadCount", t)
						else this.$store.commit("loadingGroupMsg", JSON.parse(e.content))
					},
					insertGroupMessage(e, t) {
						let s = {
							type: "GROUP",
							targetId: e.id,
							showName: e.showGroupName,
							headImage: e.headImageThumb,
						}
						this.$store.commit("openChat", s),
							this.$store.commit("insertMessage", [t, s]),
							!t.selfSend &&
								t.type <= this.$enums.MESSAGE_TYPE.VIDEO &&
								t.status != this.$enums.MESSAGE_STATUS.READED &&
								this.playAudioTip()
					},
					handleSystemMessage(e) {
						if (e.type == this.$enums.MESSAGE_TYPE.USER_BANNED)
							return (
								this.$wsApi.close(3e3),
								void this.$alert("您的账号已被管理员封禁,原因:" + e.content, "账号被封禁", {
									confirmButtonText: "确定",
									callback: (e) => {
										this.onExit()
									},
								})
							)
					},
					handleLLMChunk(e) {
						console.log("[Inbox] 收到LLM流式数据块:", e)
						const t = {
							id: Date.now(),
							fromId: 0,
							toId: this.$store.state.userStore.userInfo.userId,
							content: e.chunk,
							type: this.$enums.MESSAGE_TYPE.TEXT,
							sendTime: new Date().getTime(),
							streamId: e.streamId,
							sequence: e.sequence,
							isLLMStream: !0,
						}
						this.$store.commit("appendLLMMessage", t),
							this.$nextTick(() => {
								window.dispatchEvent(new CustomEvent("llm:chunk", { detail: e }))
							})
					},
					handleLLMEnd(e) {
						console.log("[Inbox] LLM流式传输结束:", e),
							this.$store.commit("finishLLMStream", e.streamId),
							window.dispatchEvent(new CustomEvent("llm:end", { detail: e }))
					},
					handleLLMError(e) {
						console.error("[Inbox] LLM流式传输错误:", e),
							this.$message.error("LLM处理错误: " + e.error),
							this.$store.commit("errorLLMStream", { streamId: e.streamId, error: e.error }),
							window.dispatchEvent(new CustomEvent("llm:error", { detail: e }))
					},
					onExit() {
						this.$wsApi.close(3e3),
							this.$store.commit("setUserInfo", {
								id: -1,
								userId: -1,
								username: "",
								nickName: "",
								avatar: "",
							}),
							this.$store.dispatch("setIsLoggedIn", !1),
							sessionStorage.removeItem("accessToken"),
							this.$store.commit("clear"),
							(location.href = "/")
					},
					playAudioTip() {
						if (!this.$store.getters.isLoading() && new Date().getTime() - this.lastPlayAudioTime > 1e3) {
							this.lastPlayAudioTime = new Date().getTime()
							let e = new Audio(),
								t = s("f2b0")
							;(e.src = t), e.play()
						}
					},
					showSetting() {
						this.showSettingDialog = !0
					},
					switchUi(e) {
						this.$store.commit("changeViewCode", e)
					},
					closeSetting() {
						this.showSettingDialog = !1
					},
					loadFriendInfo(e) {
						String(e).includes("_") && (e = String(e).split("_")[0])
						let t = this.$store.getters.findFriend(e)
						if (!t) {
							const s = this.$store.state.userStore.userInfo
							t =
								s && s.id == e
									? {
											id: e,
											nickName: s.nickName || "我",
											showNickName: s.nickName || "我",
											headImage: s.headImageThumb || s.headImage || "",
										}
									: { id: e, nickName: "未知用户", showNickName: "未知用户", headImage: "" }
						}
						return t
					},
					loadGroupInfo(e) {
						let t = this.$store.getters.findGroup(e)
						return t || (t = { id: e, showGroupName: "未知群聊", headImageThumb: "" }), t
					},
					handleChatItemClick(e) {
						console.log("[Inbox] 接收到聊天项点击:", e), this.$emit("chatItemClick", e)
					},
				},
				computed: {
					uiStore() {
						return this.$store.state.uiStore
					},
					unreadCount() {
						let e = 0,
							t = this.$store.state.chatStore.chats
						return (
							t.forEach((t) => {
								t.delete || (e += t.unreadCount)
							}),
							e
						)
					},
				},
				watch: {
					unreadCount: {
						handler(e, t) {
							let s = e > 0 ? e + "条未读" : ""
							this.$elm.setTitleTip(s)
						},
						immediate: !0,
					},
				},
				async mounted() {
					this.init(),
						(this.handleUserLogout = () => {
							console.log("[Inbox] 接收到用户登出事件，执行清理操作"), this.onExit()
						}),
						window.addEventListener("im:user:logout", this.handleUserLogout),
						(this.handleTokenRefresh = (e) => {
							console.log("[Inbox] 接收到 token 刷新事件，重新初始化", e.detail),
								this.$wsApi && this.$wsApi.close(),
								this.init()
						}),
						window.addEventListener("im:token:refreshed", this.handleTokenRefresh)
				},
				unmounted() {
					console.log("zujian"),
						this.$wsApi.clos(),
						this.handleUserLogout && window.removeEventListener("im:user:logout", this.handleUserLogout),
						this.handleTokenRefresh &&
							window.removeEventListener("im:token:refreshed", this.handleTokenRefresh)
				},
			},
			Ct = vt,
			It = (s("687b"), Object(u["a"])(Ct, De, Le, !1, null, "0d72d2a6", null)),
			St = It.exports,
			wt = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					[
						t(
							"keep-alive",
							[
								1 === e.uiStore.viewCode ? t("editor-chat") : e._e(),
								2 === e.uiStore.viewCode ? t("editor-friend") : e._e(),
								3 === e.uiStore.viewCode ? t("editor-group") : e._e(),
							],
							1,
						),
					],
					1,
				)
			},
			Tt = [],
			bt = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-container",
					{ staticClass: "chat-page" },
					[
						t(
							"el-container",
							{ staticClass: "chat-box" },
							[
								e.isPCTerminalChat ? t("container-manager", { ref: "containerManager" }) : e._e(),
								e.chatStore.activeChat && !e.isAIChat
									? t("chat-box", {
											attrs: { chat: e.chatStore.activeChat },
											on: { "message-sent": e.onMessageSent },
										})
									: e._e(),
								e.chatStore.activeChat || e.selectedAIChat
									? e._e()
									: t("div", { staticClass: "empty-state" }, [
											t("div", { staticClass: "empty-content" }, [
												t("div", { staticClass: "empty-icon" }, [e._v("💬")]),
												t("p", [e._v("像使用微信一样使用AI...")]),
											]),
										]),
							],
							1,
						),
					],
					1,
				)
			},
			yt = [],
			xt = s("6cde"),
			At = s("5a02"),
			$t = {
				name: "EditorChat",
				components: { ChatItem: Ve["a"], ChatBox: xt["a"], ContainerManager: At["a"] },
				props: { chatData: { type: Object, default: () => null } },
				data() {
					return {
						searchText: "",
						messageContent: "",
						group: {},
						groupMembers: [],
						showThinkingPanel: !1,
						activeTab: "chain",
						currentSessionId: "",
						selectedAIChat: null,
						isAIChat: !1,
						isPCTerminalChat: !1,
						dragHintElement: null,
						processingMessage: null,
						globalDragListeners: null,
						unifiedSessionUnsubscribe: null,
						lastActivatedSessionId: null,
						tabs: [
							{ key: "chain", label: "思维链", icon: "🧠" },
							{ key: "dashboard", label: "仪表盘", icon: "📊" },
							{ key: "assistant", label: "AI助手", icon: "🤖" },
							{ key: "settings", label: "设置", icon: "⚙️" },
						],
						assistantStatus: "active",
						feedbackText: "",
						aiInsights: [
							{
								id: "insight_1",
								icon: "💡",
								title: "对话模式识别",
								description: "检测到用户倾向于技术性讨论，建议提供更详细的技术解释",
								priority: "medium",
							},
							{
								id: "insight_2",
								icon: "⚡",
								title: "回复效率优化",
								description: "可以通过预加载常见问题答案来提升响应速度",
								priority: "low",
							},
						],
						settings: {
							showRealtime: !0,
							autoExpand: !0,
							showConfidence: !0,
							analysisDepth: "detailed",
							updateInterval: "3000",
							exportFormat: "json",
						},
					}
				},
				computed: {
					chatStore() {
						return this.$store.state.chatStore
					},
					loading() {
						return this.chatStore.loadingGroupMsg || this.chatStore.loadingPrivateMsg
					},
					assistantStatusText() {
						const e = { active: "🟢 活跃", idle: "🟡 空闲", analyzing: "🔵 分析中" }
						return e[this.assistantStatus] || "未知"
					},
				},
				created() {
					this.loadSettings()
				},
				methods: {
					detectPCTerminalChat() {
						if (
							(console.log("[EditorChat] detectPCTerminalChat 开始检测"),
							console.log("[EditorChat] activeChat:", this.chatStore.activeChat),
							!this.chatStore.activeChat)
						)
							return (
								console.log("[EditorChat] 没有活跃会话，isPCTerminalChat = false"),
								void (this.isPCTerminalChat = !1)
							)
						const e = this.chatStore.activeChat.targetId
						console.log("[EditorChat] 会话信息:", {
							targetId: e,
							showName: this.chatStore.activeChat.showName,
						}),
							e && e.includes("_3")
								? ((this.isPCTerminalChat = !0),
									console.log("[EditorChat] 检测到PC终端会话 (targetId包含_3)，显示容器管理"))
								: ((this.isPCTerminalChat = !1),
									console.log("[EditorChat] 非PC终端会话，不显示容器管理")),
							console.log("[EditorChat] 最终 isPCTerminalChat =", this.isPCTerminalChat)
					},
					onActiveItem(e) {
						this.$store.commit("activeChat", e),
							(this.isAIChat = !1),
							(this.selectedAIChat = null),
							this.detectPCTerminalChat()
					},
					onDelItem(e) {
						this.$store.commit("removeChat", e)
					},
					onTop(e) {
						this.$store.commit("moveTop", e)
					},
					getCurrentChatId() {
						return this.isAIChat && this.selectedAIChat
							? this.selectedAIChat.aiThreadId || this.selectedAIChat.id
							: this.chatStore.activeChat
								? this.chatStore.activeChat.id || this.chatStore.activeChat.targetId
								: this.currentSessionId
					},
					onAIChatSelected(e) {
						We["a"].info("EditorChat", "收到AI聊天选择:", e.showName),
							(this.selectedAIChat = e),
							(this.isAIChat = !0),
							this.$store.commit("clearActiveChat"),
							(this.isPCTerminalChat = !1)
					},
					handleEnsurePanelVisible(e) {
						console.log("[EditorChat] 🔧 收到确保面板可见事件:", e)
						const { sessionType: t, sessionData: s, reason: i } = e
						this.shouldEnsurePanelVisible(t, s)
							? this.ensureChatRecordVisible(t, s, i)
							: console.log("[EditorChat] 🔧 无需确保面板可见，条件不满足")
					},
					shouldEnsurePanelVisible(e, t) {
						return "IM" === e
							? !this.chatStore.activeChat || this.chatStore.activeChat.targetId !== (t.targetId || t.id)
							: "AI" !== e || !this.selectedAIChat || this.selectedAIChat.id !== t.id
					},
					ensureChatRecordVisible(e, t, s) {
						console.log(
							`[EditorChat] 🔧 确保${e}聊天记录可见:`,
							(null === t || void 0 === t ? void 0 : t.showName) ||
								(null === t || void 0 === t ? void 0 : t.name),
						),
							"IM" === e ? this.ensureIMChatVisible(t, s) : "AI" === e && this.ensureAIChatVisible(t, s),
							this.$nextTick(() => {
								console.log("[EditorChat] 🔧 Vue响应式更新完成，面板应该已可见")
							})
					},
					ensureIMChatVisible(e, t) {
						this.isAIChat &&
							((this.isAIChat = !1),
							(this.selectedAIChat = null),
							console.log("[EditorChat] 🔧 已切换到IM模式")),
							setTimeout(() => {
								!this.chatStore.activeChat ||
								(this.chatStore.activeChat.targetId !== e.targetId &&
									this.chatStore.activeChat.id !== e.id)
									? (console.log("[EditorChat] ⚠️ IM聊天记录可能未正确加载，发送刷新事件"),
										this.$bus && this.$bus.$emit("chat:force-refresh"))
									: console.log("[EditorChat] ✅ IM聊天记录已可见，无需额外处理")
							}, 100)
					},
					ensureAIChatVisible(e, t) {
						this.isAIChat ||
							((this.isAIChat = !0),
							this.$store.commit("clearActiveChat"),
							console.log("[EditorChat] 🔧 已切换到AI模式")),
							(this.selectedAIChat && this.selectedAIChat.id === e.id) ||
								((this.selectedAIChat = e),
								console.log("[EditorChat] 🔧 已设置活跃AI会话:", e.showName)),
							setTimeout(() => {
								console.log("[EditorChat] ✅ AI聊天记录应该已可见")
							}, 100)
					},
					jumpToProMode(e) {
						var t
						;(console.log("跳转到React专业模式:", e), window.postMessage) &&
							window.postMessage(
								{
									type: "OPEN_AI_PRO_MODE",
									messageId: e,
									threadId:
										null === (t = this.selectedAIChat) || void 0 === t ? void 0 : t.aiThreadId,
								},
								"*",
							)
						if (window.SharedServicesAccessor && window.SharedServicesAccessor.openAIProMode)
							try {
								var s
								window.SharedServicesAccessor.openAIProMode({
									messageId: e,
									threadId:
										null === (s = this.selectedAIChat) || void 0 === s ? void 0 : s.aiThreadId,
								})
							} catch (i) {
								console.error("打开AI专业模式失败:", i)
							}
					},
					async downloadArtifact(e) {
						console.log("下载构件到工作区:", e)
						try {
							var t, s
							if (
								(null === (t = this.$message) || void 0 === t || t.success("正在下载：" + e.title),
								window.SharedServicesAccessor && window.SharedServicesAccessor.downloadToWorkspace)
							)
								await window.SharedServicesAccessor.downloadToWorkspace(e),
									null === (s = this.$message) ||
										void 0 === s ||
										s.success("已下载到工作区：" + e.title)
						} catch (o) {
							var i
							null === (i = this.$message) || void 0 === i || i.error("下载失败"),
								console.error("下载构件失败:", o)
						}
					},
					toggleThinkingPanel() {
						;(this.showThinkingPanel = !this.showThinkingPanel),
							this.showThinkingPanel ? this.resumeThinkingAnalysis() : this.pauseThinkingAnalysis()
					},
					pauseThinkingAnalysis() {
						console.log("暂停思维链分析"), (this.assistantStatus = "idle")
					},
					resumeThinkingAnalysis() {
						console.log("恢复思维链分析"), (this.assistantStatus = "active")
					},
					onRealtimeModeChanged(e) {
						console.log("实时模式变化:", e), (this.settings.showRealtime = e)
					},
					onDashboardDataRefreshed(e) {
						console.log("仪表盘数据已刷新:", e)
					},
					onChainSelected(e) {
						console.log("选择思维链:", e), (this.activeTab = "chain")
					},
					analyzeCurrentConversation() {
						;(this.assistantStatus = "analyzing"),
							setTimeout(() => {
								;(this.assistantStatus = "active"),
									this.addInsight({
										id: "insight_" + Date.now(),
										icon: "🔍",
										title: "对话分析完成",
										description: this.isAIChat
											? "当前AI对话显示复杂的技术讨论模式"
											: "当前对话显示用户关注代码质量和性能优化",
										priority: "high",
									})
							}, 2e3)
					},
					suggestResponse() {
						console.log("生成回复建议"),
							this.addInsight({
								id: "insight_" + Date.now(),
								icon: "💬",
								title: "回复建议",
								description: this.isAIChat
									? "建议简化AI回复，突出关键信息"
									: "建议提供具体的代码示例和性能对比数据",
								priority: "medium",
							})
					},
					optimizeThinking() {
						console.log("优化思维链"),
							this.addInsight({
								id: "insight_" + Date.now(),
								icon: "⚡",
								title: "思维链优化",
								description: "已优化决策分支，提升思维效率15%",
								priority: "low",
							})
					},
					exportInsights() {
						const e = {
								sessionId: this.currentSessionId,
								chatType: this.isAIChat ? "ai" : "human",
								chatInfo: this.isAIChat ? this.selectedAIChat : this.chatStore.activeChat,
								timestamp: Date.now(),
								insights: this.aiInsights,
								settings: this.settings,
							},
							t = JSON.stringify(e, null, 2),
							s = new Blob([t], { type: "application/json" }),
							i = URL.createObjectURL(s),
							o = document.createElement("a")
						;(o.href = i),
							(o.download = `ai-insights-${Date.now()}.json`),
							o.click(),
							URL.revokeObjectURL(i)
					},
					addInsight(e) {
						this.aiInsights.unshift(e),
							this.aiInsights.length > 10 && (this.aiInsights = this.aiInsights.slice(0, 10))
					},
					submitFeedback() {
						var e, t
						this.feedbackText.trim()
							? (console.log("提交反馈:", this.feedbackText),
								null === (e = this.$message) || void 0 === e || e.success("反馈已提交，感谢您的建议！"),
								(this.feedbackText = ""))
							: null === (t = this.$message) || void 0 === t || t.warning("请输入反馈内容")
					},
					updateSettings() {
						console.log("更新设置:", this.settings),
							localStorage.setItem("thinking_settings", JSON.stringify(this.settings))
					},
					resetSettings() {
						var e
						;(this.settings = {
							showRealtime: !0,
							autoExpand: !0,
							showConfidence: !0,
							analysisDepth: "detailed",
							updateInterval: "3000",
							exportFormat: "json",
						}),
							this.updateSettings(),
							null === (e = this.$message) || void 0 === e || e.success("设置已重置")
					},
					saveSettings() {
						var e
						this.updateSettings(), null === (e = this.$message) || void 0 === e || e.success("设置已保存")
					},
					loadSettings() {
						const e = localStorage.getItem("thinking_settings")
						if (e)
							try {
								this.settings = { ...this.settings, ...JSON.parse(e) }
							} catch (t) {
								console.error("加载设置失败:", t)
							}
					},
					setupEventListeners() {
						this.$bus && this.$bus.$on("chat:message:sent", this.onMessageSent),
							this.$bus && this.$bus.$on("chat:message:received", this.onMessageReceived),
							this.$bus && this.$bus.$on("thinking:chain:updated", this.onThinkingChainUpdated),
							this.$bus && this.$bus.$on("ai:chat:selected", this.onAIChatSelected),
							this.$bus && this.$bus.$on("chat:ensure-panel-visible", this.handleEnsurePanelVisible),
							this.$bus &&
								this.$bus.$on("test:panel:debug", (e) => {
									console.log("[EditorChat] 🔧 收到测试事件:", e)
								}),
							this.setupUnifiedSessionListener()
					},
					cleanupEventListeners() {
						this.$bus &&
							(this.$bus.$off("chat:message:sent", this.onMessageSent),
							this.$bus.$off("chat:message:received", this.onMessageReceived),
							this.$bus.$off("thinking:chain:updated", this.onThinkingChainUpdated),
							this.$bus.$off("ai:chat:selected", this.onAIChatSelected),
							this.$bus.$off("chat:ensure-panel-visible", this.handleEnsurePanelVisible)),
							this.unifiedSessionUnsubscribe &&
								(this.unifiedSessionUnsubscribe(), (this.unifiedSessionUnsubscribe = null))
					},
					onMessageSent(e) {
						console.log("消息已发送:", e),
							this.$refs.containerManager &&
								!this.$refs.containerManager.isCollapsed &&
								(console.log("[EditorChat] 发送消息，自动折叠容器管理面板"),
								this.$refs.containerManager.toggleCollapse()),
							this.settings.showRealtime && this.triggerThinkingAnalysis("user_message", e)
					},
					onMessageReceived(e) {
						console.log("消息已接收:", e),
							"ai_response" === e.type &&
								this.settings.showRealtime &&
								this.triggerThinkingAnalysis("ai_response", e)
					},
					onThinkingChainUpdated(e) {
						console.log("思维链已更新:", e)
					},
					triggerThinkingAnalysis(e, t) {
						console.log("触发思维分析:", e, t),
							this.$bus &&
								this.$bus.$emit("ai:thinking:start", {
									type: e,
									data: t,
									preview: this.isAIChat ? "正在分析AI对话内容..." : "正在分析消息内容...",
								}),
							setTimeout(() => {
								this.$bus &&
									this.$bus.$emit("ai:thinking:node", {
										id: "node_" + Date.now(),
										type: "analysis",
										title: this.isAIChat ? "AI对话分析" : "消息分析",
										description: this.isAIChat
											? "分析AI回复的复杂度和用户满意度"
											: "分析消息的语义和用户意图",
										confidence: 0.85,
										duration: 1200,
									})
							}, 1e3),
							setTimeout(() => {
								this.$bus && this.$bus.$emit("ai:thinking:complete")
							}, 3e3)
					},
					async handleFileSend(e) {
						console.log("[EditorChat] handleFileSend called with:", e)
						try {
							var t
							console.log("[EditorChat] VSCode services obtained successfully")
							const s = this.getCurrentSessionInfo()
							console.log("[EditorChat] Current session info:", s),
								await this.saveFileToSession(e, s),
								null === (t = window.vscodeServices) ||
									void 0 === t ||
									t.get("INotificationService").info("文件已保存到工作区: " + e.file.name),
								console.log("[EditorChat] File saved successfully to workspace")
						} catch (i) {
							var s
							console.error("[EditorChat] 文件保存失败:", i),
								null === (s = window.vscodeServices) ||
									void 0 === s ||
									s.get("INotificationService").error("文件保存失败: " + i.message)
						}
					},
					getCurrentSessionInfo() {
						if (this.isAIChat && this.selectedAIChat)
							return {
								id: this.selectedAIChat.aiThreadId || this.selectedAIChat.id,
								targetId: this.selectedAIChat.aiThreadId || this.selectedAIChat.id,
								type: "PRIVATE",
								name: this.selectedAIChat.showName || "AI对话",
								showName: this.selectedAIChat.showName || "AI对话",
								participants: ["AI"],
							}
						if (this.chatStore.activeChat) {
							const e = this.chatStore.activeChat,
								t = {
									id: e.id || e.targetId,
									targetId: e.targetId,
									type: e.type || "PRIVATE",
									name: e.showName || "聊天",
									showName: e.showName || "聊天",
									headImage: e.headImage || "",
									participants: [e.targetId],
								}
							return (
								(e.isTerminalChat || e.isTerminalInbox) &&
									((t.isTerminalChat = e.isTerminalChat),
									(t.isTerminalInbox = e.isTerminalInbox),
									(t.senderTerminal = e.senderTerminal),
									(t.targetTerminal = e.targetTerminal),
									(t.receivingTerminal = e.receivingTerminal),
									console.log("[EditorChat] 🔧 终端会话信息:", {
										isTerminalChat: t.isTerminalChat,
										senderTerminal: t.senderTerminal,
										targetTerminal: t.targetTerminal,
									})),
								t
							)
						}
						const e = this.currentSessionId || "session_" + Date.now()
						return {
							id: e,
							targetId: e,
							type: "PRIVATE",
							name: "当前会话",
							showName: "当前会话",
							headImage: "",
							participants: [],
						}
					},
					async saveFileToSession(e, t) {
						try {
							var s
							const t = e.file
							console.log("[EditorChat] 开始文件上传:", { fileName: t.name, size: t.size, type: t.type })
							const o = await (null === (s = window.vscodeServices) || void 0 === s
								? void 0
								: s.get("IChatWorkspaceService").uploadFiles([t]))
							if (o && o.length > 0 && o[0].success)
								return console.log("[EditorChat] ✅ 文件上传成功:", o[0]), o[0].filePath
							{
								var i
								const e =
									(null === o || void 0 === o || null === (i = o[0]) || void 0 === i
										? void 0
										: i.error) || "文件上传失败"
								throw (console.error("[EditorChat] ❌ 文件上传失败:", e), new Error(e))
							}
						} catch (o) {
							throw (console.error("[EditorChat] 文件上传异常:", o), o)
						}
					},
					generateSessionPath(e) {
						const t = e.name.replace(/[<>:"/\\|?*]/g, "_"),
							s = new Date().toISOString().slice(0, 10)
						return `chat_sessions/${e.type}/${t}_${e.id}_${s}`
					},
					generateSafeFileName(e) {
						return e.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
					},
					readFileContent(e) {
						return new Promise((t, s) => {
							const i = new FileReader()
							;(i.onload = () => t(i.result)), (i.onerror = s), i.readAsArrayBuffer(e)
						})
					},
					protectVSCodeService(e, t = "service") {
						if (!e || "object" !== typeof e) return e
						try {
							return new Proxy(e, {
								get(e, s) {
									if ("symbol" !== typeof s && s !== Symbol.toStringTag)
										try {
											const t = e[s]
											return "function" === typeof t ? t.bind(e) : t
										} catch (i) {
											return void console.warn(`[EditorChat] 🛡️ 访问 ${t}.${s} 失败:`, i)
										}
									else console.debug("[EditorChat] 🛡️ 阻止访问 Symbol 属性:", s.toString())
								},
								ownKeys(e) {
									try {
										return Object.getOwnPropertyNames(e).filter(
											(e) => "string" === typeof e && !e.startsWith("_"),
										)
									} catch (s) {
										return console.warn(`[EditorChat] 🛡️ 获取 ${t} 属性列表失败:`, s), []
									}
								},
								getOwnPropertyDescriptor(e, t) {
									if ("symbol" !== typeof t)
										try {
											return Object.getOwnPropertyDescriptor(e, t)
										} catch (s) {
											return
										}
								},
							})
						} catch (s) {
							return console.warn(`[EditorChat] 🛡️ 创建 ${t} 保护代理失败:`, s), e
						}
					},
					setupFileDragDrop() {
						console.log("[EditorChat] 🎯 设置统一的文件拖拽管理（父级组件统一处理）"),
							(this.globalDragListeners = {
								handleDragEnter: (e) => {
									this.isDragTargetInChatArea(e.target) &&
										(e.preventDefault(),
										e.stopPropagation(),
										e.stopImmediatePropagation(),
										console.log("[EditorChat] 🎯 拦截dragenter - 目标在聊天区域"),
										this.handleDragEnter(e))
								},
								handleDragOver: (e) => {
									this.isDragTargetInChatArea(e.target) &&
										(e.preventDefault(),
										e.stopPropagation(),
										e.stopImmediatePropagation(),
										(e.dataTransfer.dropEffect = "copy"),
										console.log("[EditorChat] 🎯 拦截dragover - 目标在聊天区域"))
								},
								handleDragLeave: (e) => {
									this.isDragTargetInChatArea(e.target) &&
										(e.preventDefault(),
										e.stopPropagation(),
										e.stopImmediatePropagation(),
										console.log("[EditorChat] 🎯 拦截dragleave - 目标在聊天区域"),
										this.handleDragLeave(e))
								},
								handleDrop: (e) => {
									this.isDragTargetInChatArea(e.target) &&
										(e.preventDefault(),
										e.stopPropagation(),
										e.stopImmediatePropagation(),
										console.log("[EditorChat] 🎯 拦截drop - 目标在聊天区域，完全阻止VSCode处理"),
										this.handleFileDropToComponent(e))
								},
							}),
							document.addEventListener("dragenter", this.globalDragListeners.handleDragEnter, !0),
							document.addEventListener("dragover", this.globalDragListeners.handleDragOver, !0),
							document.addEventListener("dragleave", this.globalDragListeners.handleDragLeave, !0),
							document.addEventListener("drop", this.globalDragListeners.handleDrop, !0),
							console.log("[EditorChat] ✅ 统一拖拽管理已设置 - 智能分发到聊天区域")
					},
					isDragTargetInChatArea(e) {
						if (!this.$el || !e) return !1
						const t = this.$el.contains(e)
						if (t) {
							const t = this.$el.querySelector(".chat-box"),
								s = this.$el.querySelector(".chat-input-area"),
								i = this.$el.querySelector(".drag-overlay"),
								o = t && t.contains(e),
								n = s && s.contains(e),
								a = i && i.contains(e)
							return o || n || a
						}
						return !1
					},
					handleFileDropToComponent(e) {
						const t = e.target,
							s = e.dataTransfer.files
						console.log("[EditorChat] 🎯 智能分发文件拖拽，文件数量:", s.length)
						const i = this.$el.querySelector(".chat-input-area")
						if (i && i.contains(t)) {
							console.log("[EditorChat] 🎯 分发到ChatInput组件处理")
							const e =
								this.$refs.chatBox || this.$children.find((e) => "chatPrivate" === e.$options.name)
							if (e && e.$refs && e.$refs.chatInputEditor) {
								const t = e.$refs.chatInputEditor
								if (t && "function" === typeof t.handleDroppedFiles)
									return (t.isDragOver = !1), (t.dragCounter = 0), void t.handleDroppedFiles(s)
							}
						}
						console.log("[EditorChat] 🎯 使用EditorChat通用文件处理"), this.handleFileDrop(e)
					},
					removeGlobalDragListeners() {
						this.globalDragListeners &&
							(console.log("[EditorChat] 🧹 清理统一拖拽监听器"),
							document.removeEventListener("dragenter", this.globalDragListeners.handleDragEnter, !0),
							document.removeEventListener("dragover", this.globalDragListeners.handleDragOver, !0),
							document.removeEventListener("dragleave", this.globalDragListeners.handleDragLeave, !0),
							document.removeEventListener("drop", this.globalDragListeners.handleDrop, !0),
							(this.globalDragListeners = null))
					},
					handleDragOver(e) {
						e.preventDefault(),
							e.stopPropagation(),
							e.stopImmediatePropagation(),
							(e.dataTransfer.dropEffect = "copy"),
							console.log("[EditorChat] Vue组件拦截dragover事件，阻止VSCode处理")
					},
					handleDragEnter(e) {
						e.preventDefault(),
							e.stopPropagation(),
							e.stopImmediatePropagation(),
							console.log("[EditorChat] Vue组件拦截dragenter事件，阻止VSCode处理"),
							this.hasFiles(e.dataTransfer) && (this.showDragHint(), this.addDragOverClass())
					},
					handleDragLeave(e) {
						e.preventDefault(),
							e.stopPropagation(),
							e.stopImmediatePropagation(),
							console.log("[EditorChat] Vue组件拦截dragleave事件，阻止VSCode处理"),
							this.$el.contains(e.relatedTarget) || (this.hideDragHint(), this.removeDragOverClass())
					},
					async handleFileDrop(e) {
						e.preventDefault(),
							e.stopPropagation(),
							e.stopImmediatePropagation(),
							console.log("[EditorChat] 🎯 Vue组件接收到拖拽事件，立即阻止传播"),
							console.log("[EditorChat] Event target:", e.target),
							console.log("[EditorChat] Event currentTarget:", e.currentTarget),
							this.hideDragHint(),
							this.removeDragOverClass(),
							console.log("[EditorChat] Drop event received:", {
								dataTransfer: e.dataTransfer,
								types: Array.from(e.dataTransfer.types),
								files: e.dataTransfer.files,
								filesLength: e.dataTransfer.files.length,
								items: e.dataTransfer.items,
								itemsLength: e.dataTransfer.items ? e.dataTransfer.items.length : 0,
							})
						const t = Array.from(e.dataTransfer.files)
						if (0 === t.length) {
							if (
								(console.log("[EditorChat] No files in drop event, checking items..."),
								e.dataTransfer.items && e.dataTransfer.items.length > 0)
							) {
								const t = []
								for (let s = 0; s < e.dataTransfer.items.length; s++) {
									const i = e.dataTransfer.items[s]
									if ((console.log("[EditorChat] Item:", i.kind, i.type), "file" === i.kind)) {
										const e = i.getAsFile()
										e && t.push(e)
									}
								}
								if (t.length > 0)
									return (
										console.log("[EditorChat] Found files in items:", t),
										void (await this.processDroppedFiles(t))
									)
							}
							console.log("[EditorChat] 开始解析VSCode拖拽数据...")
							const t = await this.parseVSCodeDragData(e.dataTransfer)
							return t.length > 0
								? (console.log("[EditorChat] 解析出VSCode拖拽文件路径:", t.length, "个"),
									void (await this.handleVSCodeFilePaths(t)))
								: (console.warn("[EditorChat] No files found in drop event"),
									void this.showErrorNotification("未检测到文件，请确保拖拽的是文件而不是文本"))
						}
						console.log(
							"[EditorChat] Files dropped:",
							t.map((e) => ({ name: e.name, size: e.size })),
						)
						const s = this.getCurrentSessionInfo()
						if (!s || !s.id) return void this.showSessionSelectionRequired()
						const i = await this.confirmFileSend(t, s)
						i && (await this.processDroppedFiles(t))
					},
					async parseVSCodeDragData(e) {
						const t = []
						console.log("[EditorChat] 🔍 开始解析VSCode拖拽数据，可用类型:", Array.from(e.types))
						const s =
							e.getData("application/vnd.code.uri-list") ||
							e.getData("application/vnd.code.tree.resourcecontext")
						if (s) {
							console.log("[EditorChat] 🔗 获取到内部URI数据:", s)
							try {
								if (s.includes("\n") || s.includes("file://")) {
									const e = s.split(/[\r\n]+/).filter((e) => e.trim() && !e.startsWith("#"))
									for (const s of e) {
										const e = s.replace("file://", "")
										t.push(e)
									}
								} else {
									const e = JSON.parse(s)
									if (Array.isArray(e))
										for (const s of e)
											if (s.uri) {
												const e = s.uri.replace("file://", "")
												t.push(e)
											} else if ("string" === typeof s) {
												const e = s.replace("file://", "")
												t.push(e)
											}
								}
							} catch (o) {
								console.warn("[EditorChat] 解析内部URI数据失败:", o)
							}
						}
						if (0 === t.length) {
							const s = e.getData("application/vnd.code.resources")
							if (s) {
								console.log("[EditorChat] 🔗 获取到resources数据:", s)
								try {
									const e = JSON.parse(s)
									if (Array.isArray(e))
										for (const s of e)
											if ("string" === typeof s) {
												const e = s.replace("file://", "")
												t.push(e)
											} else if (s.uri) {
												const e = s.uri.replace("file://", "")
												t.push(e)
											}
								} catch (o) {
									console.warn("[EditorChat] 解析resources数据失败:", o)
								}
							}
						}
						if (0 === t.length) {
							const s = e.getData("codefiles") || e.getData("application/vnd.code.files")
							if (s) {
								console.log("[EditorChat] 🔗 获取到CodeFiles:", s)
								try {
									const e = JSON.parse(s)
									Array.isArray(e) && t.push(...e)
								} catch (o) {
									console.warn("[EditorChat] 解析CodeFiles失败:", o)
								}
							}
						}
						if (0 === t.length) {
							const s = e.getData("text/uri-list")
							if (s) {
								console.log("[EditorChat] 🔗 获取到text/uri-list:", s)
								const e = s.split(/[\r\n]+/).filter((e) => e.trim() && !e.startsWith("#"))
								for (const s of e) {
									const e = s.replace("file://", "")
									t.push(e)
								}
							}
						}
						if (0 === t.length) {
							const s = e.getData("text/plain")
							if (
								s &&
								(console.log("[EditorChat] 🔗 获取到text/plain:", s),
								s.includes("/") || s.includes("\\"))
							) {
								if (s.startsWith("{") || s.startsWith("["))
									try {
										const e = JSON.parse(s)
										Array.isArray(e) ? t.push(...e) : (e.path || e.uri) && t.push(e.path || e.uri)
									} catch (o) {
										console.log("[EditorChat] 不是JSON数据，按行分割处理")
									}
								if (0 === t.length) {
									const e = s
										.split("\n")
										.filter((e) => e.trim() && (e.includes("/") || e.includes("\\")))
									t.push(...e)
								}
							}
						}
						const i = t
							.map((e) => e.trim())
							.filter((e) => e && "" !== e)
							.map((e) => e.replace(/^file:\/\//, ""))
							.filter((e, t, s) => s.indexOf(e) === t)
						return console.log("[EditorChat] 🎯 最终解析出文件路径:", i.length, "个:", i), i
					},
					async handleVSCodeFilePaths(e) {
						if ((console.log("[EditorChat] 🚀 处理VSCode文件路径:", e.length, "个"), 0 !== e.length))
							if (window.BoxIMComponents)
								try {
									var t
									this.showFileProcessingProgress(e.length)
									const s = this.getCurrentSessionInfo()
									if (!s) throw new Error("未找到当前会话信息")
									console.log("[EditorChat] 开始从路径批量上传文件:", e)
									const i = await (null === (t = window.vscodeServices) || void 0 === t
										? void 0
										: t.get("IChatWorkspaceService").uploadFiles(e, s))
									let o = 0,
										n = 0
									for (const e of i)
										e.success
											? (o++, console.log("[EditorChat] ✅ 文件上传和消息同步成功:", e.message))
											: (n++,
												console.error("[EditorChat] ❌ 文件上传失败:", e),
												this.$message && this.$message.error(e.message))
									n > 0 && console.error(`[EditorChat] ${n} 个文件上传失败`),
										this.hideFileProcessingProgress()
								} catch (s) {
									console.error("[EditorChat] 批量路径文件上传失败:", s),
										this.hideFileProcessingProgress(),
										this.showErrorNotification("文件上传失败: " + s.message)
								}
							else this.showErrorNotification("VSCode服务不可用，无法处理文件拖拽")
						else this.showErrorNotification("无法解析拖拽的文件路径")
					},
					async processDroppedFiles(e) {
						console.log("[EditorChat] Processing dropped files...")
						const t = e.filter(
							(e) =>
								0 !== e.size ||
								(this.$message && this.$message.warning(`文件 ${e.name} 为空，已跳过`), !1),
						)
						if (0 !== t.length)
							try {
								this.showFileProcessingProgress(t.length)
								const e = this.getCurrentSessionInfo()
								if (!e) throw new Error("未找到当前会话信息")
								if (window.vscodeServices) {
									console.log("[EditorChat] 开始批量文件上传:", t.length, "个文件")
									const s = await window.vscodeServices.get("IChatWorkspaceService").uploadFiles(t, e)
									let i = 0,
										o = 0
									for (const e of s)
										e.success
											? (i++, console.log("[EditorChat] ✅ 文件上传成功:", e.message))
											: (o++,
												console.error("[EditorChat] ❌ 文件上传失败:", e),
												this.$message && this.$message.error(e.message))
									o > 0 && console.error(`[EditorChat] ${o} 个文件上传失败`)
								} else {
									console.log("[EditorChat] 降级为逐个处理文件")
									for (const e of t)
										console.log("[EditorChat] Processing file:", e.name),
											await this.handleFileSend({
												file: e,
												fileName: e.name,
												fileSize: e.size,
												fileType: e.type,
											})
								}
								this.hideFileProcessingProgress()
							} catch (s) {
								console.error("[EditorChat] File processing failed:", s),
									this.hideFileProcessingProgress(),
									this.showErrorNotification(s.message)
							}
						else console.log("[EditorChat] 没有有效文件需要上传")
					},
					hasFiles(e) {
						if (!e) return !1
						if (e.files && e.files.length > 0)
							return console.log("[EditorChat] Found files in dataTransfer.files"), !0
						if (e.types) {
							const t = e.types.includes("Files") || e.types.includes("application/x-vscode-file")
							if (t) return console.log("[EditorChat] Found file types in dataTransfer.types"), !0
						}
						if (e.items && e.items.length > 0)
							for (let t = 0; t < e.items.length; t++) {
								const s = e.items[t]
								if ("file" === s.kind)
									return console.log("[EditorChat] Found file in dataTransfer.items"), !0
							}
						return e.types && e.types.includes("text/plain")
							? (console.log("[EditorChat] Found text data, might be VSCode file paths"), !0)
							: (console.log("[EditorChat] No files detected in dataTransfer"), !1)
					},
					showDragHint() {
						var e
						if (this.dragHintElement) return
						const t = document.createElement("div")
						;(t.className = "file-drag-hint"),
							(t.innerHTML = `\n        <div class="drag-hint-content">\n          <div class="drag-hint-icon">📁</div>\n          <div class="drag-hint-text">拖拽文件到此处发送到聊天</div>\n          <div class="drag-hint-session">${(null === (e = this.getCurrentSessionInfo()) || void 0 === e ? void 0 : e.name) || "当前会话"}</div>\n        </div>\n      `),
							this.$el.appendChild(t),
							(this.dragHintElement = t)
					},
					hideDragHint() {
						this.dragHintElement && (this.dragHintElement.remove(), (this.dragHintElement = null))
					},
					addDragOverClass() {
						this.$el.classList.add("file-drag-over")
					},
					removeDragOverClass() {
						this.$el.classList.remove("file-drag-over")
					},
					async confirmFileSend(e, t) {
						const s = e.map((e) => `• ${e.name} (${this.formatFileSize(e.size)})`).join("\n")
						if (!this.$confirm) return confirm(`确认发送 ${e.length} 个文件到 "${t.name}"？\n\n${s}`)
						try {
							return (
								await this.$confirm(
									`确认发送 ${e.length} 个文件到 "${t.name}"？\n\n${s}`,
									"确认文件发送",
									{ confirmButtonText: "发送", cancelButtonText: "取消", type: "info", modal: !1 },
								),
								!0
							)
						} catch {
							return !1
						}
					},
					showSessionSelectionRequired() {
						const e = "请先选择一个聊天会话，然后再拖拽文件"
						this.$message ? this.$message.warning(e) : alert(e)
					},
					showFileProcessingProgress(e) {
						console.log(`[EditorChat] 开始处理 ${e} 个文件...`)
					},
					hideFileProcessingProgress() {
						this.processingMessage && (this.processingMessage.close(), (this.processingMessage = null))
					},
					showErrorNotification(e) {
						const t = "❌ 文件发送失败: " + e
						this.$message && this.$message.error(t)
					},
					formatFileSize(e) {
						if (0 === e) return "0 Bytes"
						const t = 1024,
							s = ["Bytes", "KB", "MB", "GB"],
							i = Math.floor(Math.log(e) / Math.log(t))
						return parseFloat((e / Math.pow(t, i)).toFixed(2)) + " " + s[i]
					},
					cleanupFileDragDrop() {
						var e, t
						const s = [
							this.$el,
							null === (e = this.$el) || void 0 === e ? void 0 : e.querySelector(".chat-box"),
							null === (t = this.$el) || void 0 === t ? void 0 : t.querySelector(".chat-page"),
						].filter(Boolean)
						s.forEach((e) => {
							e &&
								(e.removeEventListener("dragover", this.handleDragOver, { capture: !0 }),
								e.removeEventListener("dragenter", this.handleDragEnter, { capture: !0 }),
								e.removeEventListener("dragleave", this.handleDragLeave, { capture: !0 }),
								e.removeEventListener("drop", this.handleFileDrop, { capture: !0 }))
						}),
							this.hideDragHint()
					},
					setupUnifiedSessionListener() {
						console.log("[EditorChat] 🔧 开始设置统一会话服务监听器")
						try {
							var e, t, s
							let o = null
							var i
							if (this.$vscode && this.$vscode.get)
								console.log("[EditorChat] 🔧 尝试通过$vscode.get获取统一会话服务..."),
									(o =
										null === (i = window.vscodeServices) || void 0 === i
											? void 0
											: i.get("IUnifiedSessionService")),
									console.log("[EditorChat] 🔧 通过$vscode.get获取结果:", !!o)
							if (
								(!o &&
									window.SharedServicesAccessor &&
									(console.log("[EditorChat] 🔧 尝试通过SharedServicesAccessor获取统一会话服务..."),
									(o = window.SharedServicesAccessor.get("IUnifiedSessionService")),
									console.log("[EditorChat] 🔧 通过SharedServicesAccessor获取结果:", !!o)),
								!o &&
									null !== (e = window.vscode) &&
									void 0 !== e &&
									e.services &&
									(console.log("[EditorChat] 🔧 尝试通过全局vscode.services获取统一会话服务..."),
									(o = window.vscode.services.get("IUnifiedSessionService")),
									console.log("[EditorChat] 🔧 通过全局vscode.services获取结果:", !!o)),
								!o &&
									window.unifiedSessionService &&
									(console.log("[EditorChat] 🔧 尝试从全局对象获取统一会话服务..."),
									(o = window.unifiedSessionService),
									console.log("[EditorChat] 🔧 从全局对象获取结果:", !!o)),
								console.log("[EditorChat] 🔧 最终统一会话服务获取结果:", {
									hasService: !!o,
									serviceType: typeof o,
									hasOnSessionChanged: !(null === (t = o) || void 0 === t || !t.onSessionChanged),
									hasGetAllSessions: !(null === (s = o) || void 0 === s || !s.getAllSessions),
								}),
								o && o.onSessionChanged)
							) {
								console.log("[EditorChat] 🔧 统一会话服务正常，开始订阅事件...")
								const e = o.onSessionChanged(this.handleUnifiedSessionEvent.bind(this))
								console.log("[EditorChat] 🔧 事件订阅结果:", {
									hasDisposable: !!e,
									disposableType: typeof e,
									hasDispose: !(null === e || void 0 === e || !e.dispose),
								}),
									e && "function" === typeof e.dispose
										? ((this.unifiedSessionUnsubscribe = () => e.dispose()),
											console.log("[EditorChat] ✅ 已成功订阅统一会话事件"))
										: (console.warn("[EditorChat] ⚠️ 事件订阅返回的不是有效的disposable对象:", e),
											(this.unifiedSessionUnsubscribe = null))
							} else
								console.warn("[EditorChat] ⚠️ 统一会话服务或onSessionChanged事件不可用"),
									console.warn("[EditorChat] ⚠️ 尝试设置备用监听机制..."),
									this.setupFallbackSessionListener(),
									(this.unifiedSessionUnsubscribe = null)
						} catch (o) {
							console.error("[EditorChat] ❌ 设置统一会话监听器失败:", o),
								console.error("[EditorChat] ❌ 错误详情:", o.stack),
								console.warn("[EditorChat] ⚠️ 尝试设置备用监听机制..."),
								this.setupFallbackSessionListener(),
								(this.unifiedSessionUnsubscribe = null)
						}
						console.log("[EditorChat] 🔧 统一会话服务监听器设置完成")
					},
					setupFallbackSessionListener() {
						console.log("[EditorChat] 🔧 设置备用会话监听机制...")
						try {
							const e = (e) => {
								console.log("[EditorChat] 🔔 收到备用会话事件:", e.detail),
									e.detail &&
										"unified-session-activated" === e.detail.type &&
										this.handleUnifiedSessionEvent(e.detail)
							}
							window.addEventListener("unified-session-activated", e),
								console.log("[EditorChat] ✅ 已设置全局事件监听器"),
								(this.unifiedSessionUnsubscribe = () => {
									window.removeEventListener("unified-session-activated", e),
										console.log("[EditorChat] 🔧 已清理备用事件监听器")
								})
							let t = null
							const s = setInterval(() => {
									try {
										let e = null
										if (
											(window.SharedServicesAccessor &&
												(e = window.SharedServicesAccessor.get("IUnifiedSessionService")),
											e && "function" === typeof e.getActiveSession)
										) {
											const s = e.getActiveSession(),
												i = null === s || void 0 === s ? void 0 : s.id
											i &&
												i !== t &&
												(console.log("[EditorChat] 🔔 检测到活跃会话变化 (轮询):", i),
												(t = i),
												this.handleUnifiedSessionEvent({
													type: "unified-session-activated",
													sessionId: i,
													sessionType: s.type,
													session: s,
												}))
										}
									} catch (e) {}
								}, 1e3),
								i = this.unifiedSessionUnsubscribe
							;(this.unifiedSessionUnsubscribe = () => {
								clearInterval(s), i && i(), console.log("[EditorChat] 🔧 已清理轮询机制")
							}),
								console.log("[EditorChat] ✅ 已设置会话状态轮询机制")
						} catch (e) {
							console.error("[EditorChat] ❌ 设置备用监听机制失败:", e)
						}
					},
					handleUnifiedSessionEvent(e) {
						console.log("[EditorChat] 🔔 收到统一会话事件:", {
							eventType: null === e || void 0 === e ? void 0 : e.type,
							sessionId: null === e || void 0 === e ? void 0 : e.sessionId,
							sessionType: null === e || void 0 === e ? void 0 : e.sessionType,
							hasSession: !(null === e || void 0 === e || !e.session),
							eventDetails: e,
						}),
							e
								? "unified-session-activated" === e.type
									? (console.log("[EditorChat] 🔔 处理会话激活事件，类型:", e.sessionType),
										"vue-im" === e.sessionType
											? (console.log("[EditorChat] 🔧 处理Vue IM会话激活"),
												this.handleImSessionActivatedFromUnified(e))
											: "react-ai" === e.sessionType
												? (console.log("[EditorChat] 🔧 处理React AI会话激活"),
													this.handleAiSessionActivatedFromUnified(e))
												: console.warn("[EditorChat] ⚠️ 未知的会话类型:", e.sessionType))
									: console.log("[EditorChat] 🔧 非激活事件，忽略:", e.type)
								: console.warn("[EditorChat] ⚠️ 收到空的统一会话事件")
					},
					handleImSessionActivatedFromUnified(e) {
						var t, s
						console.log(
							"[EditorChat] 处理IM会话激活:",
							null === (t = e.session) || void 0 === t ? void 0 : t.title,
						)
						const i = e.session
						if (!i) return void console.warn("[EditorChat] IM会话事件中没有会话数据")
						const o = i.targetId || i.sessionId || i.realSessionRef
						if (!o) return void console.warn("[EditorChat] IM会话事件中没有有效的targetId:", i)
						const n = "vue-im-" + o
						if (this.lastActivatedSessionId === n)
							return void console.log("[EditorChat] 🔧 防止重复激活，会话已是当前激活状态:", n)
						console.log("[EditorChat] 🔧 激活IM会话，targetId:", o),
							(this.selectedAIChat = null),
							(this.isAIChat = !1)
						const a = o.toString(),
							r =
								null === (s = this.chatStore.chats) || void 0 === s
									? void 0
									: s.find((e) => {
											var t
											const s =
												null === (t = e.targetId || e.id) || void 0 === t
													? void 0
													: t.toString()
											return s === a
										})
						if (r) {
							var l
							const e = this.chatStore.chats.indexOf(r)
							console.log("[EditorChat] 🔧 找到匹配聊天，索引:", e, "会话名:", r.showName),
								console.log(
									"[EditorChat] 🔧 当前activeChat:",
									(null === (l = this.chatStore.activeChat) || void 0 === l ? void 0 : l.showName) ||
										"null",
								),
								console.log("[EditorChat] 🔧 期望activeChat:", r.showName),
								(this.lastActivatedSessionId = n),
								(this.selectedAIChat = null),
								(this.isAIChat = !1),
								console.log("[EditorChat] 🔧 IM会话状态已同步")
						} else {
							var c
							console.warn("[EditorChat] ❌ 未找到匹配的聊天，targetId:", o),
								console.log(
									"[EditorChat] 🔧 可用聊天列表:",
									null === (c = this.chatStore.chats) || void 0 === c
										? void 0
										: c.map((e) => ({ targetId: e.targetId, id: e.id, showName: e.showName })),
								),
								this.$store.commit("clearActiveChat")
						}
					},
					handleAiSessionActivatedFromUnified(e) {
						var t
						console.log(
							"[EditorChat] 处理AI会话激活:",
							null === (t = e.session) || void 0 === t ? void 0 : t.title,
						)
						const s = e.session
						s
							? ((this.isAIChat = !0),
								this.$store.commit("clearActiveChat"),
								(this.selectedAIChat = {
									id: s.sessionId,
									aiThreadId: s.sessionId,
									showName: s.title || s.showName || "AI对话",
									title: s.title || s.showName || "AI对话",
									summary: s.summary || "",
									lastModified: s.lastModified || new Date().toISOString(),
								}),
								console.log("[EditorChat] 🔧 AI会话已激活:", this.selectedAIChat.showName))
							: console.warn("[EditorChat] AI会话事件中没有会话数据")
					},
				},
				mounted() {
					console.log("[EditorChat] 🔧 Component mounting..."),
						console.log("[EditorChat] 🔧 Checking event bus:"),
						console.log("- $bus:", !!this.$bus),
						console.log("- $eventBus:", !!this.$eventBus),
						this.setupEventListeners(),
						this.setupFileDragDrop(),
						this.$bus
							? (this.$bus.$on("chat:file:send", this.handleFileSend),
								this.$bus.$on("chat:file:upload", this.handleFileSend),
								console.log("[EditorChat] File event listeners registered on $bus"))
							: console.warn("[EditorChat] $bus not available, cannot register file event listeners"),
						this.$eventBus &&
							(this.$eventBus.$on("chat:file:send", this.handleFileSend),
							this.$eventBus.$on("chat:file:upload", this.handleFileSend),
							console.log("[EditorChat] File event listeners registered on $eventBus")),
						console.log("[EditorChat] 🔧 Component mounted, all event listeners initialized")
				},
				beforeDestroy() {
					this.cleanupEventListeners(),
						this.removeGlobalDragListeners(),
						this.$bus &&
							(this.$bus.$off("chat:file:send", this.handleFileSend),
							this.$bus.$off("chat:file:upload", this.handleFileSend))
				},
				watch: {
					chatData: {
						handler(e) {
							e && this.activateChatData(e)
						},
						immediate: !0,
					},
					"chatStore.activeChat": {
						handler(e) {
							this.detectPCTerminalChat()
						},
						deep: !0,
					},
				},
			},
			Et = $t,
			kt = (s("42ca"), Object(u["a"])(Et, bt, yt, !1, null, null, null)),
			Mt = kt.exports,
			Nt = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-container",
					{ staticClass: "friend-page" },
					[
						t("el-container", { staticClass: "friend-box" }, [
							t(
								"div",
								{
									directives: [
										{
											name: "show",
											rawName: "v-show",
											value: e.userInfo.id,
											expression: "userInfo.id",
										},
									],
									staticClass: "friend-header",
								},
								[e._v(" " + e._s(e.userInfo.nickName) + " ")],
							),
							t(
								"div",
								{
									directives: [
										{
											name: "show",
											rawName: "v-show",
											value: e.userInfo.id,
											expression: "userInfo.id",
										},
									],
								},
								[
									t(
										"div",
										{ staticClass: "friend-detail" },
										[
											t("head-image", {
												attrs: {
													size: 160,
													name: e.userInfo.nickName,
													url: e.userInfo.headImage,
													radius: "10%",
												},
												nativeOn: {
													click: function (t) {
														return e.showFullImage()
													},
												},
											}),
											t("div", [
												t(
													"div",
													{ staticClass: "info-item" },
													[
														t(
															"el-descriptions",
															{
																staticClass: "description",
																attrs: { title: "好友信息", column: 1 },
															},
															[
																t(
																	"el-descriptions-item",
																	{ attrs: { label: "用户名" } },
																	[e._v(e._s(e.userInfo.userName) + " ")],
																),
																t(
																	"el-descriptions-item",
																	{ attrs: { label: "昵称" } },
																	[e._v(e._s(e.userInfo.nickName) + " ")],
																),
																t(
																	"el-descriptions-item",
																	{ attrs: { label: "性别" } },
																	[e._v(e._s(0 == e.userInfo.sex ? "男" : "女"))],
																),
																t(
																	"el-descriptions-item",
																	{ attrs: { label: "签名" } },
																	[e._v(e._s(e.userInfo.signature))],
																),
															],
															1,
														),
													],
													1,
												),
												t(
													"div",
													{ staticClass: "frient-btn-group" },
													[
														t(
															"el-button",
															{
																directives: [
																	{
																		name: "show",
																		rawName: "v-show",
																		value: e.isFriend,
																		expression: "isFriend",
																	},
																],
																attrs: { icon: "el-icon-position", type: "primary" },
																on: {
																	click: function (t) {
																		return e.onSendMessage(e.userInfo)
																	},
																},
															},
															[e._v("发消息")],
														),
														t(
															"el-button",
															{
																directives: [
																	{
																		name: "show",
																		rawName: "v-show",
																		value: !e.isFriend,
																		expression: "!isFriend",
																	},
																],
																attrs: { icon: "el-icon-plus", type: "primary" },
																on: {
																	click: function (t) {
																		return e.onAddFriend(e.userInfo)
																	},
																},
															},
															[e._v("加为好友")],
														),
														t(
															"el-button",
															{
																directives: [
																	{
																		name: "show",
																		rawName: "v-show",
																		value: e.isFriend,
																		expression: "isFriend",
																	},
																],
																attrs: { icon: "el-icon-delete", type: "danger" },
																on: {
																	click: function (t) {
																		return e.onDelFriend(e.userInfo)
																	},
																},
															},
															[e._v("删除好友")],
														),
													],
													1,
												),
											]),
										],
										1,
									),
								],
							),
						]),
					],
					1,
				)
			},
			_t = [],
			Pt = {
				name: "friend",
				components: { AddFriend: tt["a"], HeadImage: P["a"] },
				props: { friendData: { type: Object, default: () => null } },
				data() {
					return { searchText: "", showAddFriend: !1, userInfo: {} }
				},
				methods: {
					onShowAddFriend() {
						this.showAddFriend = !0
					},
					onCloseAddFriend() {
						this.showAddFriend = !1
					},
					onActiveItem(e) {
						;(this.activeFriend = e), this.loadUserInfo(e.id)
					},
					onDelFriend(e) {
						this.$confirm(`确认删除'${e.nickName}',并清空聊天记录吗?`, "确认解除?", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning",
						}).then(() => {
							this.$http({ url: "/friend/delete/" + e.id, method: "delete" }).then(() => {
								this.$message.success("删除好友成功"),
									this.$store.commit("removeFriend", e.id),
									this.$store.commit("removePrivateChat", e.id)
							})
						})
					},
					onAddFriend(e) {
						this.$http({ url: "/friend/add", method: "post", params: { friendId: e.id } }).then(() => {
							this.$message.success("添加成功，对方已成为您的好友")
							let t = { id: e.id, nickName: e.nickName, headImage: e.headImage, online: e.online }
							this.$store.commit("addFriend", t)
						})
					},
					async onSendMessage(e) {
						let t = {
							type: "PRIVATE",
							targetId: e.id,
							showName: e.nickName,
							headImage: e.headImageThumb || e.headImage,
						}
						this.$store.commit("openChat", t)
						const s = this.$store.getters.findChatIdx(t)
						if (void 0 !== s && -1 !== s && (this.$store.commit("activeChat", s), window.vscodeServices)) {
							console.log("[EditorFriend] 在VSCode环境中，同步并激活编辑器面板会话")
							try {
								const t = this.$store.state.chatStore.chats[s],
									i = "vue-im-" + e.id,
									o = window.vscodeServices.get("IUnifiedSessionService")
								if (o) {
									const s = o.getAllSessions && o.getAllSessions().some((e) => e.id === i)
									if (!s && o.syncVueSessionsFromWebView) {
										console.log("[EditorFriend] 会话不存在，进行增量同步...")
										const s = {
											id: e.id,
											sessionId: e.id,
											showName: e.nickName,
											type: "vue-im",
											headImage: e.headImageThumb || e.headImage,
											lastSendTime: Date.now(),
											messages: (null === t || void 0 === t ? void 0 : t.messages) || [],
										}
										o.syncVueSessionsFromWebView([s]), await new Promise((e) => setTimeout(e, 50))
									}
									o.setActiveSession &&
										(o.setActiveSession(i), console.log("[EditorFriend] ✅ 已调用统一会话激活:", i))
								}
								const n = window.vscodeServices.get("panelManagerService")
								if (n && n.openChatEditor) {
									const t = {
										id: e.id,
										nickName: e.nickName,
										name: e.nickName,
										headImage: e.headImageThumb || e.headImage,
										headImageThumb: e.headImageThumb || e.headImage,
										avatar: e.headImage,
									}
									n.openChatEditor(t),
										this.$store.commit("changeViewCode", 1),
										console.log("[EditorFriend] ✅ 聊天编辑器面板已打开:", e.nickName)
								} else console.warn("[EditorFriend] ⚠️ PanelManagerService或openChatEditor方法不可用")
							} catch (i) {
								console.error("[EditorFriend] ❌ 激活编辑器面板失败:", i)
							}
						}
						if (this.$parent && "PluginChat" === this.$parent.$options.name)
							return (
								console.log("[EditorFriend] 在PluginChat环境中，触发startChat事件"),
								void this.$emit("startChat", t)
							)
						window.vscodeServices || this.$router.push("/home/chat")
					},
					showFullImage() {
						this.userInfo.headImage && this.$store.commit("showFullImageBox", this.userInfo.headImage)
					},
					updateFriendInfo() {
						if (this.isFriend) {
							let e = JSON.parse(JSON.stringify(this.activeFriend))
							;(e.headImage = this.userInfo.headImageThumb),
								(e.nickName = this.userInfo.nickName),
								this.$store.commit("updateChatFromFriend", e),
								this.$store.commit("updateFriend", e)
						}
					},
					loadUserInfo(e) {
						this.$http({ url: "/user/find/" + e, method: "GET" }).then((e) => {
							;(this.userInfo = e), this.updateFriendInfo()
						})
					},
					firstLetter(e) {
						let t = { toneType: "none", type: "normal" },
							s = Object(st["a"])(e, t)
						return s[0]
					},
					isEnglish(e) {
						return /^[A-Za-z]+$/.test(e)
					},
				},
				computed: {
					activeFriend() {
						return this.$store.state.friendStore.activeFriend
					},
					friendStore() {
						return this.$store.state.friendStore
					},
					isFriend() {
						return this.$store.getters.isFriend(this.userInfo.id)
					},
					friendMap() {
						let e = new Map()
						this.friendStore.friends.forEach((t) => {
							if (t.deleted || (this.searchText && !t.nickName.includes(this.searchText))) return
							let s = this.firstLetter(t.nickName).toUpperCase()
							this.isEnglish(s) || (s = "#"),
								t.online && (s = "在线"),
								e.has(s) ? e.get(s).push(t) : e.set(s, [t])
						})
						let t = Array.from(e)
						return (
							t.sort((e, t) =>
								"#" == e[0] || "#" == t[0] ? t[0].localeCompare(e[0]) : e[0].localeCompare(t[0]),
							),
							(e = new Map(t.map((e) => [e[0], e[1]]))),
							e
						)
					},
					friendKeys() {
						return Array.from(this.friendMap.keys())
					},
					friendValues() {
						return Array.from(this.friendMap.values())
					},
				},
				watch: {
					activeFriend(e, t) {
						this.onActiveItem(e)
					},
					friendData: {
						handler(e) {
							e &&
								e.id &&
								(console.log("[EditorFriend] 接收到好友数据:", e),
								this.$store.commit("setActiveFriend", e),
								this.loadUserInfo(e.id))
						},
						immediate: !0,
					},
				},
			},
			Rt = Pt,
			Ft = (s("0924"), Object(u["a"])(Rt, Nt, _t, !1, null, null, null)),
			Dt = Ft.exports,
			Lt = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-container",
					{ staticClass: "group-page" },
					[
						t("el-container", { staticClass: "group-box" }, [
							t(
								"div",
								{
									directives: [
										{
											name: "show",
											rawName: "v-show",
											value: e.activeGroup.id,
											expression: "activeGroup.id",
										},
									],
									staticClass: "group-header",
								},
								[
									e._v(
										" " +
											e._s(e.activeGroup.showGroupName) +
											"(" +
											e._s(e.groupMembers.length) +
											") ",
									),
								],
							),
							t("div", { staticClass: "group-container" }, [
								t(
									"div",
									{
										directives: [
											{
												name: "show",
												rawName: "v-show",
												value: e.activeGroup.id,
												expression: "activeGroup.id",
											},
										],
									},
									[
										t(
											"div",
											{ staticClass: "group-info" },
											[
												t(
													"div",
													[
														t(
															"file-upload",
															{
																directives: [
																	{
																		name: "show",
																		rawName: "v-show",
																		value: e.isOwner,
																		expression: "isOwner",
																	},
																],
																staticClass: "avatar-uploader",
																attrs: {
																	action: e.imageAction,
																	showLoading: !0,
																	maxSize: e.maxSize,
																	fileTypes: [
																		"image/jpeg",
																		"image/png",
																		"image/jpg",
																		"image/webp",
																	],
																},
																on: { success: e.onUploadSuccess },
															},
															[
																e.activeGroup.headImage
																	? t("img", {
																			staticClass: "avatar",
																			attrs: { src: e.activeGroup.headImage },
																		})
																	: t("i", {
																			staticClass:
																				"el-icon-plus avatar-uploader-icon",
																		}),
															],
														),
														t("head-image", {
															directives: [
																{
																	name: "show",
																	rawName: "v-show",
																	value: !e.isOwner,
																	expression: "!isOwner",
																},
															],
															staticClass: "avatar",
															attrs: {
																size: 160,
																url: e.activeGroup.headImage,
																name: e.activeGroup.showGroupName,
																radius: "10%",
															},
														}),
														t(
															"el-button",
															{
																staticClass: "send-btn",
																attrs: { icon: "el-icon-position", type: "primary" },
																on: {
																	click: function (t) {
																		return e.onSendMessage()
																	},
																},
															},
															[e._v("发消息 ")],
														),
													],
													1,
												),
												t(
													"el-form",
													{
														ref: "groupForm",
														staticClass: "group-form",
														attrs: {
															"label-width": "130px",
															model: e.activeGroup,
															rules: e.rules,
															size: "small",
														},
													},
													[
														t(
															"el-form-item",
															{ attrs: { label: "群聊名称", prop: "name" } },
															[
																t("el-input", {
																	attrs: { disabled: !e.isOwner, maxlength: "20" },
																	model: {
																		value: e.activeGroup.name,
																		callback: function (t) {
																			e.$set(e.activeGroup, "name", t)
																		},
																		expression: "activeGroup.name",
																	},
																}),
															],
															1,
														),
														t(
															"el-form-item",
															{ attrs: { label: "群主" } },
															[
																t("el-input", {
																	attrs: { value: e.ownerName, disabled: "" },
																}),
															],
															1,
														),
														t(
															"el-form-item",
															{ attrs: { label: "群名备注" } },
															[
																t("el-input", {
																	attrs: {
																		placeholder: e.activeGroup.name,
																		maxlength: "20",
																	},
																	model: {
																		value: e.activeGroup.remarkGroupName,
																		callback: function (t) {
																			e.$set(e.activeGroup, "remarkGroupName", t)
																		},
																		expression: "activeGroup.remarkGroupName",
																	},
																}),
															],
															1,
														),
														t(
															"el-form-item",
															{ attrs: { label: "我在本群的昵称" } },
															[
																t("el-input", {
																	attrs: {
																		maxlength: "20",
																		placeholder:
																			e.$store.state.userStore.userInfo.nickName,
																	},
																	model: {
																		value: e.activeGroup.remarkNickName,
																		callback: function (t) {
																			e.$set(e.activeGroup, "remarkNickName", t)
																		},
																		expression: "activeGroup.remarkNickName",
																	},
																}),
															],
															1,
														),
														t(
															"el-form-item",
															{ attrs: { label: "群公告" } },
															[
																t("el-input", {
																	attrs: {
																		disabled: !e.isOwner,
																		type: "textarea",
																		rows: 3,
																		maxlength: "1024",
																		placeholder: "群主未设置",
																	},
																	model: {
																		value: e.activeGroup.notice,
																		callback: function (t) {
																			e.$set(e.activeGroup, "notice", t)
																		},
																		expression: "activeGroup.notice",
																	},
																}),
															],
															1,
														),
														t(
															"div",
															[
																t(
																	"el-button",
																	{
																		attrs: { type: "warning" },
																		on: {
																			click: function (t) {
																				return e.onInvite()
																			},
																		},
																	},
																	[e._v("邀请")],
																),
																t(
																	"el-button",
																	{
																		attrs: { type: "success" },
																		on: {
																			click: function (t) {
																				return e.onSaveGroup()
																			},
																		},
																	},
																	[e._v("保存")],
																),
																t(
																	"el-button",
																	{
																		directives: [
																			{
																				name: "show",
																				rawName: "v-show",
																				value: !e.isOwner,
																				expression: "!isOwner",
																			},
																		],
																		attrs: { type: "danger" },
																		on: {
																			click: function (t) {
																				return e.onQuit()
																			},
																		},
																	},
																	[e._v("退出")],
																),
																t(
																	"el-button",
																	{
																		directives: [
																			{
																				name: "show",
																				rawName: "v-show",
																				value: e.isOwner,
																				expression: "isOwner",
																			},
																		],
																		attrs: { type: "danger" },
																		on: {
																			click: function (t) {
																				return e.onDissolve()
																			},
																		},
																	},
																	[e._v("解散")],
																),
															],
															1,
														),
													],
													1,
												),
											],
											1,
										),
										t("el-divider", { attrs: { "content-position": "center" } }),
										t(
											"el-scrollbar",
											{ ref: "scrollbar", style: "height: " + e.scrollHeight + "px" },
											[
												t(
													"div",
													{ staticClass: "group-member-list" },
													[
														t(
															"div",
															{ staticClass: "member-tools" },
															[
																t(
																	"div",
																	{
																		staticClass: "tool-btn",
																		attrs: { title: "邀请好友进群聊" },
																		on: {
																			click: function (t) {
																				return e.onInvite()
																			},
																		},
																	},
																	[t("i", { staticClass: "el-icon-plus" })],
																),
																t("div", { staticClass: "tool-text" }, [e._v("邀请")]),
																t("add-group-member", {
																	attrs: {
																		visible: e.showAddGroupMember,
																		groupId: e.activeGroup.id,
																		members: e.groupMembers,
																	},
																	on: {
																		reload: e.loadGroupMembers,
																		close: function (t) {
																			e.showAddGroupMember = !1
																		},
																	},
																}),
															],
															1,
														),
														e.isOwner
															? t(
																	"div",
																	{ staticClass: "member-tools" },
																	[
																		t(
																			"div",
																			{
																				staticClass: "tool-btn",
																				attrs: { title: "选择成员移出群聊" },
																				on: {
																					click: function (t) {
																						return e.onRemove()
																					},
																				},
																			},
																			[t("i", { staticClass: "el-icon-minus" })],
																		),
																		t("div", { staticClass: "tool-text" }, [
																			e._v("移除"),
																		]),
																		t("group-member-selector", {
																			ref: "removeSelector",
																			attrs: {
																				title: "选择成员进行移除",
																				groupId: e.activeGroup.id,
																			},
																			on: { complete: e.onRemoveComplete },
																		}),
																	],
																	1,
																)
															: e._e(),
														e._l(e.showMembers, function (s, i) {
															return t(
																"div",
																{ key: s.id },
																[
																	i < e.showMaxIdx
																		? t("group-member", {
																				staticClass: "group-member",
																				attrs: { member: s },
																			})
																		: e._e(),
																],
																1,
															)
														}),
													],
													2,
												),
											],
										),
									],
									1,
								),
							]),
						]),
					],
					1,
				)
			},
			Gt = [],
			Ot = {
				name: "group",
				components: {
					GroupMember: dt["a"],
					FileUpload: D["a"],
					AddGroupMember: ht["a"],
					GroupMemberSelector: ut["a"],
					HeadImage: P["a"],
				},
				data() {
					return {
						searchText: "",
						maxSize: 5242880,
						groupMembers: [],
						showAddGroupMember: !1,
						showMaxIdx: 150,
						rules: { name: [{ required: !0, message: "请输入群聊名称", trigger: "blur" }] },
					}
				},
				methods: {
					onCreateGroup() {
						this.$prompt("请输入群聊名称", "创建群聊", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							inputPattern: /\S/,
							inputErrorMessage: "请输入群聊名称",
							modal: !1,
						}).then((e) => {
							this.$store.state.userStore.userInfo
							let t = { name: e.value }
							this.$http({ url: "/group/create?groupName=" + e.value, method: "post", data: t }).then(
								(e) => {
									this.$store.commit("addGroup", e)
								},
							)
						})
					},
					onActiveItem(e) {
						;(this.showMaxIdx = 150),
							(this.activeGroup = JSON.parse(JSON.stringify(e))),
							(this.groupMembers = []),
							this.loadGroupMembers()
					},
					onInvite() {
						this.showAddGroupMember = !0
					},
					onRemove() {
						let e = [this.activeGroup.ownerId]
						this.$refs.removeSelector.open(50, [], [], e)
					},
					onRemoveComplete(e) {
						let t = e.map((e) => e.userId),
							s = { groupId: this.activeGroup.id, userIds: t }
						this.$http({ url: "/group/members/remove", method: "delete", data: s }).then(() => {
							this.loadGroupMembers(), this.$message.success(`您移除了${t.length}位成员`)
						})
					},
					onUploadSuccess(e) {
						;(this.activeGroup.headImage = e.originUrl), (this.activeGroup.headImageThumb = e.thumbUrl)
					},
					onSaveGroup() {
						this.$refs["groupForm"].validate((e) => {
							if (e) {
								let e = this.activeGroup
								this.$http({ url: "/group/modify", method: "put", data: e }).then((e) => {
									this.$store.commit("updateGroup", e), this.$message.success("修改成功")
								})
							}
						})
					},
					onDissolve() {
						this.$confirm(`确认要解散'${this.activeGroup.name}'吗?`, "确认解散?", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning",
							modal: !1,
						}).then(() => {
							this.$http({ url: "/group/delete/" + this.activeGroup.id, method: "delete" }).then(() => {
								this.$message.success(`群聊'${this.activeGroup.name}'已解散`),
									this.$store.commit("removeGroup", this.activeGroup.id),
									this.reset()
							})
						})
					},
					onQuit() {
						this.$confirm(`确认退出'${this.activeGroup.showGroupName}',并清空聊天记录吗？`, "确认退出?", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning",
							modal: !1,
						}).then(() => {
							this.$http({ url: "/group/quit/" + this.activeGroup.id, method: "delete" }).then(() => {
								this.$message.success(`您已退出'${this.activeGroup.name}'`),
									this.$store.commit("removeGroup", this.activeGroup.id),
									this.$store.commit("removeGroupChat", this.activeGroup.id),
									this.reset()
							})
						})
					},
					async onSendMessage() {
						let e = {
							type: "GROUP",
							targetId: this.activeGroup.id,
							showName: this.activeGroup.showGroupName,
							headImage: this.activeGroup.headImage,
						}
						this.$store.commit("openChat", e)
						const t = this.$store.getters.findChatIdx(e)
						if (void 0 !== t && -1 !== t && (this.$store.commit("activeChat", t), window.vscodeServices)) {
							console.log("[EditorGroup] 在VSCode环境中，同步并激活编辑器面板会话")
							try {
								const e = this.$store.state.chatStore.chats[t],
									s = "vue-im-" + this.activeGroup.id,
									i = window.vscodeServices.get("IUnifiedSessionService")
								if (i) {
									const t = i.getAllSessions && i.getAllSessions().some((e) => e.id === s)
									if (!t && i.syncVueSessionsFromWebView) {
										console.log("[EditorGroup] 会话不存在，进行增量同步...")
										const t = {
											id: this.activeGroup.id,
											sessionId: this.activeGroup.id,
											showName: this.activeGroup.showGroupName,
											type: "vue-im",
											headImage: this.activeGroup.headImage,
											lastSendTime: Date.now(),
											messages: (null === e || void 0 === e ? void 0 : e.messages) || [],
										}
										i.syncVueSessionsFromWebView([t]), await new Promise((e) => setTimeout(e, 50))
									}
									i.setActiveSession &&
										(i.setActiveSession(s), console.log("[EditorGroup] ✅ 已调用统一会话激活:", s))
								}
								const o = window.vscodeServices.get("panelManagerService")
								if (o && o.openChatEditor) {
									const e = {
										id: this.activeGroup.id,
										nickName: this.activeGroup.showGroupName,
										name: this.activeGroup.showGroupName,
										headImage: this.activeGroup.headImage,
										headImageThumb: this.activeGroup.headImage,
										avatar: this.activeGroup.headImage,
										isGroup: !0,
									}
									o.openChatEditor(e),
										this.$store.commit("changeViewCode", 1),
										console.log(
											"[EditorGroup] ✅ 群聊编辑器面板已打开:",
											this.activeGroup.showGroupName,
										)
								} else console.warn("[EditorGroup] ⚠️ PanelManagerService或openChatEditor方法不可用")
							} catch (s) {
								console.error("[EditorGroup] ❌ 激活编辑器面板失败:", s)
							}
						}
						window.vscodeServices || this.$router.push("/home/chat")
					},
					onScroll(e) {
						const t = e.target
						t.scrollTop + t.clientHeight >= t.scrollHeight - 30 &&
							this.showMaxIdx < this.showMembers.length &&
							(this.showMaxIdx += 50)
					},
					loadGroupMembers() {
						this.$http({ url: "/group/members/" + this.activeGroup.id, method: "get" }).then((e) => {
							this.groupMembers = e
						})
					},
					reset() {
						;(this.activeGroup = {}), (this.groupMembers = [])
					},
					firstLetter(e) {
						let t = { toneType: "none", type: "normal" },
							s = Object(st["a"])(e, t)
						return s[0]
					},
					isEnglish(e) {
						return /^[A-Za-z]+$/.test(e)
					},
				},
				computed: {
					activeGroup() {
						return this.$store.state.groupStore.activeGroup
					},
					groupStore() {
						return this.$store.state.groupStore
					},
					ownerName() {
						let e = this.groupMembers.find((e) => e.userId == this.activeGroup.ownerId)
						return e && e.showNickName
					},
					isOwner() {
						return this.activeGroup.ownerId == this.$store.state.userStore.userInfo.id
					},
					imageAction() {
						return "/image/upload"
					},
					groupMap() {
						let e = new Map()
						this.groupStore.groups.forEach((t) => {
							if (t.quit || (this.searchText && !t.showGroupName.includes(this.searchText))) return
							let s = this.firstLetter(t.showGroupName).toUpperCase()
							this.isEnglish(s) || (s = "#"), e.has(s) ? e.get(s).push(t) : e.set(s, [t])
						})
						let t = Array.from(e)
						return (
							t.sort((e, t) =>
								"#" == e[0] || "#" == t[0] ? t[0].localeCompare(e[0]) : e[0].localeCompare(t[0]),
							),
							(e = new Map(t.map((e) => [e[0], e[1]]))),
							e
						)
					},
					groupKeys() {
						return Array.from(this.groupMap.keys())
					},
					groupValues() {
						return Array.from(this.groupMap.values())
					},
					showMembers() {
						return this.groupMembers.filter((e) => !e.quit)
					},
					scrollHeight() {
						return Math.min(300, 80 + (this.showMembers.length / 10) * 80)
					},
				},
				watch: {
					activeGroup(e, t) {
						this.onActiveItem(e)
					},
				},
				mounted() {
					let e = this.$refs.scrollbar.$el.querySelector(".el-scrollbar__wrap")
					e.addEventListener("scroll", this.onScroll)
				},
			},
			Vt = Ot,
			Bt = (s("8ac6"), Object(u["a"])(Vt, Lt, Gt, !1, null, null, null)),
			Ut = Bt.exports,
			zt = {
				name: "ShadanChat",
				components: { EditorChat: Mt, EditorFriend: Dt, EditorGroup: Ut },
				props: { chatData: { type: Object, default: () => null } },
				data() {
					return { searchText: "", messageContent: "", group: {}, groupMembers: [] }
				},
				methods: {
					onTop(e) {
						this.$store.commit("moveTop", e)
					},
					activateChatData() {
						this.chatData &&
							(console.log("[ShadanChat] 激活聊天数据:", this.chatData),
							this.$store.commit("openChat", {
								type: this.chatData.type,
								targetId: this.chatData.targetId,
								showName: this.chatData.showName,
								headImage: this.chatData.headImage,
							}),
							this.$store.commit("activeChat", 0))
					},
				},
				computed: {
					uiStore() {
						return this.$store.state.uiStore
					},
					chatStore() {
						return this.$store.state.chatStore
					},
					loading() {
						return this.chatStore.loadingGroupMsg || this.chatStore.loadingPrivateMsg
					},
				},
				watch: {
					chatData: {
						handler(e) {
							e && this.activateChatData()
						},
						immediate: !0,
					},
				},
				mounted() {
					this.chatData && this.activateChatData()
				},
			},
			jt = zt,
			Ht = (s("b9ba"), Object(u["a"])(jt, wt, Tt, !1, null, null, null)),
			qt = Ht.exports,
			Wt = {
				name: "VscodeChat",
				components: { Inbox: St, ShadanChat: qt },
				data() {
					return { selectedChatData: null }
				},
				methods: {
					handleChatItemClick(e) {
						console.log("[Vscode] 接收到聊天数据:", e),
							(this.selectedChatData = e),
							this.$store.commit("changeViewCode", 1),
							this.$store.commit("openChat", {
								type: e.type,
								targetId: e.targetId,
								showName: e.showName,
								headImage: e.headImage,
								isTerminalChat: e.isTerminalChat,
								isTerminalInbox: e.isTerminalInbox,
								senderTerminal: e.senderTerminal,
								targetTerminal: e.targetTerminal,
								receivingTerminal: e.receivingTerminal,
							})
					},
				},
				computed: {},
			},
			Yt = Wt,
			Jt = (s("daa8"), Object(u["a"])(Yt, Re, Fe, !1, null, "1eb5ba4a", null)),
			Kt = Jt.exports,
			Qt = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{ staticClass: "plugin-container" },
					[
						t(
							"keep-alive",
							[
								t(e.currentComponent, {
									ref: "currentComponentRef",
									tag: "component",
									attrs: { chatData: e.selectedChatData, friendData: e.selectedFriendData },
									on: {
										showChat: e.showChatView,
										showFriend: e.showFriendView,
										backToInbox: e.backToInbox,
									},
								}),
							],
							1,
						),
					],
					1,
				)
			},
			Zt = [],
			Xt = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{ staticClass: "home-page" },
					[
						t("div", { staticClass: "navi-bar" }, [
							t("div", { staticClass: "navi-bar-box" }, [
								t("div", { staticClass: "top" }, [
									t("div", { staticClass: "menu" }, [
										t(
											"div",
											{
												staticClass: "botoom-item",
												on: {
													click: function (t) {
														return e.switchUi(1)
													},
												},
											},
											[
												t("span", { staticClass: "icon iconfont icon-chat" }),
												t(
													"div",
													{
														directives: [
															{
																name: "show",
																rawName: "v-show",
																value: e.unreadCount > 0,
																expression: "unreadCount > 0",
															},
														],
														staticClass: "unread-text",
													},
													[e._v(" " + e._s(e.unreadCount) + " ")],
												),
											],
										),
										t(
											"div",
											{
												staticClass: "botoom-item",
												on: {
													click: function (t) {
														return e.switchUi(2)
													},
												},
											},
											[t("span", { staticClass: "icon iconfont icon-friend" })],
										),
										t(
											"div",
											{
												staticClass: "botoom-item",
												on: {
													click: function (t) {
														return e.switchUi(3)
													},
												},
											},
											[
												t("span", {
													staticClass: "icon iconfont icon-group",
													staticStyle: { "font-size": "28px" },
												}),
											],
										),
										t("div", { staticClass: "botoom-item", on: { click: e.showSetting } }, [
											t("span", {
												staticClass: "icon iconfont icon-setting",
												staticStyle: { "font-size": "20px" },
											}),
										]),
									]),
								]),
							]),
						]),
						t(
							"div",
							{ staticClass: "content-box" },
							[
								1 === e.uiStore.viewCode
									? t("inbox-plugin-session", { on: { chatItemClick: e.onChatItemClick } })
									: e._e(),
								2 === e.uiStore.viewCode
									? t("inbox-friend", { on: { showFriend: e.onFriendClick } })
									: e._e(),
								3 === e.uiStore.viewCode
									? t("inbox-group", { on: { groupClick: e.onGroupClick } })
									: e._e(),
							],
							1,
						),
						t("setting", {
							attrs: { visible: e.showSettingDialog },
							on: {
								close: function (t) {
									return e.closeSetting()
								},
							},
						}),
						t("user-info", {
							directives: [
								{
									name: "show",
									rawName: "v-show",
									value: e.uiStore.userInfo.show,
									expression: "uiStore.userInfo.show",
								},
							],
							attrs: { pos: e.uiStore.userInfo.pos, user: e.uiStore.userInfo.user },
							on: {
								close: function (t) {
									return e.$store.commit("closeUserInfoBox")
								},
							},
						}),
						t("full-image", {
							attrs: { visible: e.uiStore.fullImage.show, url: e.uiStore.fullImage.url },
							on: {
								close: function (t) {
									return e.$store.commit("closeFullImageBox")
								},
							},
						}),
						t("rtc-private-video", { ref: "rtcPrivateVideo" }),
						t("rtc-group-video", { ref: "rtcGroupVideo" }),
					],
					1,
				)
			},
			es = [],
			ts = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-container",
					{ staticClass: "chat-page", staticStyle: { "flex-wrap": "wrap" }, attrs: { type: "flex" } },
					[
						t(
							"el-aside",
							{ staticClass: "chat-list-box", attrs: { width: "100%" } },
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
										t(
											"el-button",
											{
												staticClass: "new-terminal-chat-btn",
												attrs: {
													type: "text",
													icon: "el-icon-plus",
													size: "small",
													title: "新建终端会话",
												},
												on: {
													click: function (t) {
														e.showTerminalSelector = !0
													},
												},
											},
											[e._v(" 终端 ")],
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
											e._l(e.filteredChats, function (s, i) {
												return t(
													"div",
													{ key: i },
													[
														t("chat-item", {
															directives: [
																{
																	name: "show",
																	rawName: "v-show",
																	value:
																		!s.delete &&
																		s.showName &&
																		s.showName.includes(e.searchText),
																	expression:
																		"!chat.delete && chat.showName && chat.showName.includes(searchText)",
																},
															],
															class: {
																"terminal-inbox": s.isTerminalInbox,
																"normal-chat": !s.isTerminalInbox,
															},
															attrs: {
																chat: s,
																index: i,
																active: s === e.chatStore.activeChat,
															},
															on: {
																delete: function (t) {
																	return e.onDelItem(i)
																},
																top: function (t) {
																	return e.onTop(i)
																},
															},
															nativeOn: {
																click: function (t) {
																	return e.onActiveItem(i)
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
						t("terminal-selector", {
							attrs: { visible: e.showTerminalSelector },
							on: {
								"update:visible": function (t) {
									e.showTerminalSelector = t
								},
								"terminal-selected": e.handleTerminalSelected,
							},
						}),
					],
					1,
				)
			},
			ss = [],
			is = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{ staticClass: "terminal-selector" },
					[
						t(
							"el-dialog",
							{
								attrs: { title: "选择接收终端", visible: e.dialogVisible, width: "400px" },
								on: {
									"update:visible": function (t) {
										e.dialogVisible = t
									},
									close: e.handleClose,
								},
							},
							[
								t(
									"div",
									{ staticClass: "terminal-list" },
									e._l(e.availableTerminals, function (s) {
										return t(
											"div",
											{
												key: s.type,
												staticClass: "terminal-item",
												class: {
													disabled: !s.online || s.type === e.currentTerminal,
													current: s.type === e.currentTerminal,
												},
												on: {
													click: function (t) {
														return e.selectTerminal(s)
													},
												},
											},
											[
												t("div", { staticClass: "terminal-icon" }, [e._v(e._s(s.icon))]),
												t("div", { staticClass: "terminal-info" }, [
													t("div", { staticClass: "terminal-name" }, [e._v(e._s(s.name))]),
													t(
														"div",
														{ staticClass: "terminal-status", class: e.getStatusClass(s) },
														[e._v(" " + e._s(e.getStatusText(s)) + " ")],
													),
												]),
												s.type === e.currentTerminal
													? t("div", { staticClass: "current-badge" }, [e._v("当前")])
													: e._e(),
											],
										)
									}),
									0,
								),
								0 === e.onlineTerminals.length
									? t("div", { staticClass: "empty-state" }, [
											t("div", { staticClass: "empty-icon" }, [e._v("📱")]),
											t("div", { staticClass: "empty-text" }, [e._v("暂无其他在线终端")]),
											t("div", { staticClass: "empty-hint" }, [e._v("请在其他设备上登录后再试")]),
										])
									: e._e(),
								t(
									"span",
									{ staticClass: "dialog-footer", attrs: { slot: "footer" }, slot: "footer" },
									[
										t("el-button", { on: { click: e.handleClose } }, [e._v("取消")]),
										t(
											"el-button",
											{
												attrs: { type: "primary", disabled: 0 === e.onlineTerminals.length },
												on: { click: e.openQuickSend },
											},
											[e._v(" 快速发送消息 ")],
										),
									],
									1,
								),
							],
						),
						t(
							"el-dialog",
							{
								attrs: { title: "发送消息到终端", visible: e.showQuickSend, width: "500px" },
								on: {
									"update:visible": function (t) {
										e.showQuickSend = t
									},
									close: e.resetQuickSend,
								},
							},
							[
								e.selectedTerminal
									? t("div", { staticClass: "quick-send-header" }, [
											t("span", { staticClass: "target-terminal" }, [
												e._v(
													" " +
														e._s(e.selectedTerminal.icon) +
														" " +
														e._s(e.selectedTerminal.name) +
														" ",
												),
											]),
										])
									: e._e(),
								t("el-input", {
									attrs: {
										type: "textarea",
										rows: 4,
										placeholder: "输入要发送的消息...",
										maxlength: "500",
										"show-word-limit": "",
									},
									on: {
										keydown: function (t) {
											return !t.type.indexOf("key") &&
												e._k(t.keyCode, "enter", 13, t.key, "Enter")
												? null
												: t.ctrlKey
													? e.sendQuickMessage.apply(null, arguments)
													: null
										},
									},
									model: {
										value: e.quickMessage,
										callback: function (t) {
											e.quickMessage = t
										},
										expression: "quickMessage",
									},
								}),
								t("div", { staticClass: "quick-send-tips" }, [
									t("span", { staticClass: "tip" }, [e._v("💡 按 Ctrl+Enter 快速发送")]),
								]),
								t(
									"span",
									{ staticClass: "dialog-footer", attrs: { slot: "footer" }, slot: "footer" },
									[
										t("el-button", { on: { click: e.resetQuickSend } }, [e._v("取消")]),
										t(
											"el-button",
											{
												attrs: {
													type: "primary",
													loading: e.sending,
													disabled: !e.quickMessage.trim(),
												},
												on: { click: e.sendQuickMessage },
											},
											[e._v(" 发送 ")],
										),
									],
									1,
								),
							],
							1,
						),
					],
					1,
				)
			},
			os = [],
			ns = {
				name: "TerminalSelector",
				props: { visible: { type: Boolean, default: !1 } },
				data() {
					return {
						dialogVisible: this.visible,
						currentTerminal: 4,
						availableTerminals: [
							{ type: 0, name: "傻蛋网页端", icon: "🌐", online: !1 },
							{ type: 1, name: "傻蛋精灵App", icon: "📱", online: !1 },
							{ type: 2, name: "我的电脑", icon: "💻", online: !1 },
							{ type: 3, name: "我的云电脑", icon: "🖥", online: !1 },
							{ type: 4, name: "傻蛋浏览器", icon: "🔌", online: !1 },
							{ type: 5, name: "MCP端", icon: "🤖", online: !1 },
						],
						onlineTerminals: [],
						showQuickSend: !1,
						selectedTerminal: null,
						quickMessage: "",
						sending: !1,
					}
				},
				watch: {
					visible(e) {
						;(this.dialogVisible = e), e && this.loadTerminalStatus()
					},
					dialogVisible(e) {
						this.$emit("update:visible", e)
					},
				},
				methods: {
					async loadTerminalStatus() {
						try {
							const e = await this.$http.get("/message/private/terminal-status")
							console.log("终端在线状态返回值:", e)
							const t = e.otherOnlineTerminals || []
							;(this.onlineTerminals = t),
								this.availableTerminals.forEach((e) => {
									e.online = t.includes(e.type)
								}),
								console.log("🔧 终端在线状态:", {
									current: this.currentTerminal,
									online: t,
									available: this.availableTerminals,
								})
						} catch (e) {
							console.error("获取终端状态失败:", e), this.$message.error("获取终端状态失败")
						}
					},
					selectTerminal(e) {
						e.online
							? e.type !== this.currentTerminal
								? (this.$emit("terminal-selected", e.type),
									this.handleClose(),
									console.log("🎯 选择终端:", e))
								: this.$message.warning("无法选择当前终端")
							: this.$message.warning("目标终端不在线")
					},
					openQuickSend() {
						if (0 === this.onlineTerminals.length) return void this.$message.warning("暂无其他在线终端")
						const e = this.availableTerminals.find((e) => e.online && e.type !== this.currentTerminal)
						e && ((this.selectedTerminal = e), (this.showQuickSend = !0), (this.dialogVisible = !1))
					},
					async sendQuickMessage() {
						if (this.quickMessage.trim())
							if (this.selectedTerminal) {
								this.sending = !0
								try {
									const e = {
											recvId: this.$store.getters.currentUser.id,
											content: this.quickMessage.trim(),
											type: 0,
											targetTerminal: this.selectedTerminal.type,
											senderTerminal: this.currentTerminal,
										},
										t = await this.$http.post("/message/private/send-to-terminal", e)
									this.createTargetTerminalChat(this.selectedTerminal.type),
										this.$message.success("消息已发送到" + this.selectedTerminal.name),
										this.resetQuickSend(),
										console.log("📤 终端间消息发送成功:", t.data)
								} catch (t) {
									var e
									console.error("发送终端间消息失败:", t),
										this.$message.error(
											"发送失败: " +
												((null === (e = t.response) ||
												void 0 === e ||
												null === (e = e.data) ||
												void 0 === e
													? void 0
													: e.message) || t.message),
										)
								} finally {
									this.sending = !1
								}
							} else this.$message.warning("请选择目标终端")
						else this.$message.warning("请输入消息内容")
					},
					createTargetTerminalChat(e) {
						const t = this.$store.getters.currentUser.id,
							s = {
								type: "PRIVATE",
								targetId: `${t}_${e}`,
								senderTerminal: this.currentTerminal,
								targetTerminal: e,
								showName: `${this.$store.getters.currentUser.nickName}(${this.getTerminalName(e)}端)`,
								headImage: this.getTerminalIcon(e),
								isTerminalChat: !0,
							}
						this.$store.commit("openChat", s), "Chat" !== this.$route.name && this.$router.push("/chat")
					},
					getCurrentTerminal() {
						var e
						return "undefined" !== typeof window
							? window.parent !== window ||
								window.acquireVsCodeApi ||
								window.SharedServicesAccessor ||
								navigator.userAgent.includes("VSCode") ||
								"vscode-webview:" === window.location.protocol
								? 2
								: window.require ||
									  (null !== (e = window.process) && void 0 !== e && e.type) ||
									  window.isElectron ||
									  navigator.userAgent.includes("Electron")
									? 3
									: window.cordova ||
										  window.PhoneGap ||
										  window.phonegap ||
										  navigator.userAgent.includes("wv") ||
										  navigator.userAgent.includes("Mobile")
										? 1
										: 0
							: 0
					},
					getStatusClass(e) {
						return e.type === this.currentTerminal ? "current" : e.online ? "online" : "offline"
					},
					getStatusText(e) {
						return e.type === this.currentTerminal ? "当前终端" : e.online ? "在线" : "离线"
					},
					getTerminalName(e) {
						const t = {
							0: "傻蛋网页端",
							1: "傻蛋精灵App",
							2: "我的电脑",
							3: "我的云电脑",
							4: "傻蛋浏览器",
							5: "MCP端",
						}
						return t[e] || "未知"
					},
					getTerminalIcon(e) {
						const t = { 0: "🌐", 1: "📱", 2: "💻", 3: "🖥", 4: "🔌", 5: "🤖" }
						return t[e] || "❓"
					},
					handleClose() {
						;(this.dialogVisible = !1), this.resetQuickSend()
					},
					resetQuickSend() {
						;(this.showQuickSend = !1),
							(this.selectedTerminal = null),
							(this.quickMessage = ""),
							(this.sending = !1)
					},
				},
			},
			as = ns,
			rs = (s("5216"), Object(u["a"])(as, is, os, !1, null, "80b38fb2", null)),
			ls = rs.exports,
			cs = {
				name: "chat",
				components: { ChatItem: Ve["a"], TerminalSelector: ls },
				data() {
					return {
						searchText: "",
						messageContent: "",
						group: {},
						groupMembers: [],
						showTerminalSelector: !1,
						currentTerminal: null,
						terminalChats: [],
					}
				},
				methods: {
					getCurrentTerminal() {
						return 4
					},
					initOtherTerminalChats() {
						const e = this.$store.state.userStore.userInfo
						if (!e || !e.id)
							return void console.log("[InboxPluginSession] 用户信息不存在，无法初始化终端会话")
						const t = this.getCurrentTerminal()
						this.currentTerminal = t
						const s = [
							{ type: 0, name: "Web", icon: "🌐" },
							{ type: 1, name: "App", icon: "📱" },
							{ type: 2, name: "VSCode", icon: "💻" },
							{ type: 3, name: "PC", icon: "🖥️" },
							{ type: 4, name: "插件", icon: "🔌" },
						]
						this.cleanupTerminalChatsFromStore(),
							s.forEach((s) => {
								if (s.type === t) return
								const i = `${e.id}_${s.type}`,
									o = this.chatStore.chats.find((e) => e.isTerminalInbox && e.targetId === i)
								if (!o) {
									const e = {
										type: "PRIVATE",
										targetId: i,
										receivingTerminal: s.type,
										senderTerminal: 4,
										showName: s.name + "端",
										headImage: s.icon,
										isTerminalInbox: !0,
										lastContent: "",
										lastSendTime: Date.now(),
										unreadCount: 0,
										delete: !1,
										messages: [],
										stored: !1,
										lastTimeTip: Date.now(),
									}
									this.$store.commit("openChat", e),
										this.$nextTick(async () => {
											const t = this.chatStore.chats.find(
												(e) => e.targetId === i && "PRIVATE" === e.type,
											)
											t &&
												(t.messages &&
													t.messages.length > 0 &&
													((t.messages = t.messages.filter(
														(e, t) =>
															!(!e || void 0 === e.type || null === e.type) &&
															!!(
																0 !== e.type ||
																(e.content && "" !== e.content.trim())
															) &&
															!!(8 !== e.type || (e.content && "" !== e.content.trim())),
													)),
													0 === t.messages.length && (t.stored = !1)),
												(t.messages && 0 !== t.messages.length) ||
													(await this.sendSystemMessage(e, s.type)))
										})
								}
							}),
							this.$store.commit("cleanEmptyMessages"),
							this.moveTerminalChatsToTop(),
							console.log("[InboxPluginSession] 终端会话初始化完成")
					},
					cleanupTerminalChatsFromStore() {
						const e = []
						this.chatStore.chats.forEach((t, s) => {
							t.isTerminalInbox && e.push(s)
						})
						for (let t = e.length - 1; t >= 0; t--) this.chatStore.chats.splice(e[t], 1)
					},
					moveTerminalChatsToTop() {
						this.$store.commit("sortTerminalChatsToTop")
					},
					async sendSystemMessage(e, t) {
						var s
						let i = null
						const o = { 0: "web", 1: "app", 2: "vscode", 3: "pc", 4: "plugin" }
						i = o[t]
						let n = `欢迎使用傻蛋IM ${this.getTerminalName(t)}端`
						if (i)
							try {
								const e = await fetch("https://aiim.service.thinkgs.cn/text.json")
								if (e.ok) {
									const t = await e.json()
									t &&
										t[i] &&
										((n = t[i]), console.log(`[InboxPluginSession] 从远程获取${i}端系统消息:`, n))
								}
							} catch (l) {
								console.error("[InboxPluginSession] 获取远程系统消息失败:", l)
							}
						if (!n || "" === n.trim())
							return console.warn("[InboxPluginSession] 系统消息内容为空，跳过发送"), null
						let a = this.chatStore.chats.find((t) => t.targetId === e.targetId && t.type === e.type)
						if (!a) return console.warn("[InboxPluginSession] 发送系统消息时找不到会话:", e.targetId), null
						const r = {
							id: `sys_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
							tmpId: `tmp_sys_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
							type: 21,
							content: n.trim(),
							sendTime: Date.now(),
							selfSend: !1,
							status: 1,
							sendNickName: "系统",
							sendId: -1,
							recvId:
								(null === (s = this.$store.state.userStore.userInfo) || void 0 === s ? void 0 : s.id) ||
								0,
						}
						return (
							console.log("[InboxPluginSession] 发送系统消息:", r),
							this.$store.commit("insertMessage", [r, e]),
							(a.lastContent = n),
							(a.lastSendTime = r.sendTime),
							r
						)
					},
					onActiveItem(e) {
						this.$store.commit("activeChat", e)
						const t = this.chatStore.chats[e]
						t &&
							this.$emit("chatItemClick", {
								type: t.type,
								targetId: t.targetId,
								showName: t.showName,
								headImage: t.headImage,
							})
					},
					async handleTerminalSelected(e) {
						console.log("[Chat] 选择的终端:", e)
						try {
							const t = this.$store.state.userStore.userInfo
							if (!t || !t.id) return void this.$message.error("用户未登录")
							const s = `${t.id}_${e}`,
								i = this.chatStore.chats.findIndex((e) => e.targetId === s && e.isTerminalInbox)
							if (-1 !== i)
								return (
									console.log("[Chat] 终端会话已存在，直接激活"),
									this.onActiveItem(i),
									void this.$message.success(
										`已切换到${t.nickName}(${this.getTerminalName(e)}端)会话`,
									)
								)
							let o = "👤"
							0 === e && (o = "🌐"),
								1 === e && (o = "📱"),
								2 === e && (o = "💻"),
								3 === e && (o = "🖥️"),
								4 === e && (o = "🔌")
							const n = {
								type: "PRIVATE",
								targetId: s,
								receivingTerminal: e,
								senderTerminal: 4,
								showName: `${t.nickName}(${this.getTerminalName(e)}端)`,
								headImage: t.headImage || t.avatar || o,
								isTerminalInbox: !0,
							}
							this.$store.commit("openChat", n)
							const a = this.$store.getters.findChatIdx(n)
							void 0 !== a && this.onActiveItem(a),
								this.$message.success(`已创建${t.nickName}(${this.getTerminalName(e)}端)会话`)
						} catch (t) {
							console.error("[Chat] 创建终端会话失败:", t), this.$message.error("创建终端会话失败")
						}
					},
					getTerminalName(e) {
						const t = { 0: "Web", 1: "App", 2: "VSCode", 3: "PC", 4: "插件" }
						return t[e] || "未知"
					},
					getTerminalIcon(e) {
						const t = { 0: "🌐", 1: "📱", 2: "💻", 3: "🖥️", 4: "🔌" }
						return t[e] || "❓"
					},
					onDelItem(e) {
						this.$store.commit("removeChat", e)
					},
					onTop(e) {
						this.$store.commit("moveTop", e)
					},
				},
				computed: {
					chatStore() {
						return this.$store.state.chatStore
					},
					loading() {
						return this.chatStore.loadingGroupMsg || this.chatStore.loadingPrivateMsg
					},
					filteredChats() {
						const e = this.getCurrentTerminal()
						return this.chatStore.chats.filter(
							(t) =>
								!t.isTerminalInbox ||
								t.receivingTerminal !== e ||
								(console.log("[InboxPluginSession] 过滤掉插件端会话: " + t.showName), !1),
						)
					},
				},
				mounted() {
					console.log("[InboxPluginSession] 组件挂载，开始初始化终端会话..."),
						this.initOtherTerminalChats(),
						this.$nextTick(() => {
							this.moveTerminalChatsToTop()
						}),
						this.$watch(
							() => this.$store.state.userStore.userInfo,
							(e) => {
								e &&
									e.id &&
									(this.initOtherTerminalChats(),
									this.$nextTick(() => {
										this.moveTerminalChatsToTop()
									}))
							},
							{ deep: !0 },
						),
						this.$watch(
							() => this.chatStore.chats,
							() => {
								if (this.chatStore.chats && this.chatStore.chats.length > 0) {
									const e = this.chatStore.chats[0]
									e.isTerminalInbox ||
										(console.log("[InboxPluginSession] 检测到会话列表变化，重新置顶终端会话"),
										this.$nextTick(() => {
											this.moveTerminalChatsToTop()
										}))
								}
							},
							{ deep: !0 },
						)
				},
			},
			ds = cs,
			hs = (s("cbe2"), Object(u["a"])(ds, ts, ss, !1, null, null, null)),
			us = hs.exports,
			ms = {
				components: {
					HeadImage: P["a"],
					Setting: V,
					UserInfo: q,
					FullImage: Z,
					RtcPrivateVideo: be,
					RtcPrivateAcceptor: ae,
					RtcGroupVideo: ke,
					InboxPluginSession: us,
					InboxFriend: at,
					InboxGroup: ft,
				},
				data() {
					return {
						showSettingDialog: !1,
						lastPlayAudioTime: new Date().getTime() - 1e3,
						isFullscreen: !0,
						reconnecting: !1,
					}
				},
				methods: {
					init() {
						this.$eventBus.$on("openPrivateVideo", (e) => {
							this.$refs.rtcPrivateVideo.open(e)
						}),
							this.$eventBus.$on("openGroupVideo", (e) => {
								this.$refs.rtcGroupVideo.open(e)
							}),
							this.$store
								.dispatch("load")
								.then(() => {
									this.$wsApi.connect(
										"wss://aiim.ws.service.thinkgs.cn/im",
										sessionStorage.getItem("accessToken"),
									),
										this.$wsApi.onConnect(() => {
											this.reconnecting
												? this.onReconnectWs()
												: (this.pullPrivateOfflineMessage(
														this.$store.state.chatStore.privateMsgMaxId,
													),
													this.pullGroupOfflineMessage(
														this.$store.state.chatStore.groupMsgMaxId,
													))
										}),
										this.$wsApi.onMessage((e, t) => {
											2 == e
												? (this.$wsApi.close(3e3),
													this.$alert("您已在其他地方登录，将被强制下线", "强制下线通知", {
														confirmButtonText: "确定",
														callback: (e) => {
															location.href = "/"
														},
													}))
												: 3 == e
													? this.handlePrivateMessage(t)
													: 4 == e
														? this.handleGroupMessage(t)
														: 5 == e && this.handleSystemMessage(t)
										}),
										this.$wsApi.onClose((e) => {
											3e3 != e.code && this.reconnectWs()
										})
								})
								.catch((e) => {
									console.log("初始化失败", e)
								})
					},
					reconnectWs() {
						;(this.reconnecting = !0),
							this.$store
								.dispatch("loadUser")
								.then(() => {
									this.$message.error("连接断开，正在尝试重新连接..."),
										this.$wsApi.reconnect(
											"wss://aiim.ws.service.thinkgs.cn/im",
											sessionStorage.getItem("accessToken"),
										)
								})
								.catch(() => {
									setTimeout(() => this.reconnectWs(), 1e4)
								})
					},
					onReconnectWs() {
						this.reconnecting = !1
						const e = []
						e.push(this.$store.dispatch("loadFriend")),
							e.push(this.$store.dispatch("loadGroup")),
							Promise.all(e)
								.then(() => {
									this.pullPrivateOfflineMessage(this.$store.state.chatStore.privateMsgMaxId),
										this.pullGroupOfflineMessage(this.$store.state.chatStore.groupMsgMaxId),
										this.$message.success("重新连接成功")
								})
								.catch(() => {
									this.$message.error("初始化失败"), this.onExit()
								})
					},
					pullPrivateOfflineMessage(e) {
						this.$store.commit("loadingPrivateMsg", !0),
							this.$http({ url: "/message/private/pullOfflineMessage?minId=" + e, method: "GET" }).catch(
								() => {
									this.$store.commit("loadingPrivateMsg", !1)
								},
							)
					},
					pullGroupOfflineMessage(e) {
						this.$store.commit("loadingGroupMsg", !0),
							this.$http({ url: "/message/group/pullOfflineMessage?minId=" + e, method: "GET" }).catch(
								() => {
									this.$store.commit("loadingGroupMsg", !1)
								},
							)
					},
					handlePrivateMessage(e) {
						if (
							((e.selfSend = e.sendId == this.$store.state.userStore.userInfo.id),
							void 0 !== e.senderTerminal && void 0 !== e.targetTerminal)
						)
							return (
								console.log("[InboxPlugin] 🔧 接收到终端消息:", e),
								(e.isTerminalChat = !0),
								4 === e.targetTerminal && this.insertTerminalMessage(e),
								void (
									e.id &&
									e.id > this.$store.state.chatStore.privateMsgMaxId &&
									this.$store.commit("updatePrivateMsgMaxId", e.id)
								)
							)
						let t = e.selfSend ? e.recvId : e.sendId,
							s = { type: "PRIVATE", targetId: t }
						if (e.type != this.$enums.MESSAGE_TYPE.LOADING)
							if (e.type != this.$enums.MESSAGE_TYPE.READED)
								if (e.type != this.$enums.MESSAGE_TYPE.RECEIPT)
									if (e.type != this.$enums.MESSAGE_TYPE.RECALL)
										if (e.type != this.$enums.MESSAGE_TYPE.FRIEND_NEW)
											if (e.type != this.$enums.MESSAGE_TYPE.FRIEND_DEL) {
												if (this.$msgType.isRtcPrivate(e.type))
													this.$refs.rtcPrivateVideo.onRTCMessage(e)
												else if (
													this.$msgType.isNormal(e.type) ||
													this.$msgType.isTip(e.type) ||
													this.$msgType.isAction(e.type)
												) {
													let s = this.loadFriendInfo(t)
													this.insertPrivateMessage(s, e)
												}
											} else this.$store.commit("removeFriend", t)
										else this.$store.commit("addFriend", JSON.parse(e.content))
									else this.$store.commit("recallMessage", [e, s])
								else this.$store.commit("readedMessage", { friendId: e.sendId })
							else this.$store.commit("resetUnreadCount", s)
						else this.$store.commit("loadingPrivateMsg", JSON.parse(e.content))
					},
					insertPrivateMessage(e, t) {
						let s = { type: "PRIVATE", targetId: e.id, showName: e.nickName, headImage: e.headImage }
						this.$store.commit("openChat", s),
							this.$store.commit("insertMessage", [t, s]),
							!t.selfSend &&
								this.$msgType.isNormal(t.type) &&
								t.status != this.$enums.MESSAGE_STATUS.READED &&
								this.playAudioTip()
					},
					insertTerminalMessage(e) {
						try {
							const t = this.$store.state.userStore.userInfo
							if (!t || !t.id) return void console.error("[InboxPlugin] 用户信息未加载，无法处理终端消息")
							const s = e.senderTerminal,
								i = e.targetTerminal || this.getCurrentTerminal(),
								o = this.getCurrentTerminal()
							;(e.selfSend = e.senderTerminal === o),
								e.targetTerminal || (e.targetTerminal = o),
								console.log(
									`🔧 [InboxPlugin] 终端消息: ${this.getTerminalName(s)}端→${this.getTerminalName(i)}端, selfSend=${e.selfSend}`,
								)
							const n = {
								type: "PRIVATE",
								targetId: `${t.id}_${s}`,
								showName: `${t.nickName}(${this.getTerminalName(s)}端)`,
								headImage: this.getTerminalIcon(s),
								isTerminalChat: !0,
								senderTerminal: s,
								targetTerminal: i,
							}
							;(e.sendNickName = `${t.nickName}(${this.getTerminalName(s)}端)`),
								this.$store.commit("openChat", n),
								this.$store.commit("insertMessage", [e, n]),
								console.log(`✅ [InboxPlugin] 终端消息已插入到 ${this.getTerminalName(s)}端 会话`),
								!e.selfSend &&
									this.$msgType.isNormal(e.type) &&
									e.status != this.$enums.MESSAGE_STATUS.READED &&
									this.playAudioTip()
						} catch (t) {
							console.error("[InboxPlugin] 处理终端消息失败:", t, e)
						}
					},
					getTerminalName(e) {
						const t = {
							0: "傻蛋网页",
							1: "傻蛋精灵App",
							2: "我的电脑",
							3: "我的云电脑",
							4: "傻蛋浏览器",
							5: "MCP",
						}
						return t[e] || "未知"
					},
					getTerminalIcon(e) {
						const t = { 0: "🌐", 1: "📱", 2: "💻", 3: "🖥️", 4: "🔌" }
						return t[e] || "❓"
					},
					getCurrentTerminal() {
						return 4
					},
					handleGroupMessage(e) {
						e.selfSend = e.sendId == this.$store.state.userStore.userInfo.id
						let t = { type: "GROUP", targetId: e.groupId }
						if (e.type != this.$enums.MESSAGE_TYPE.LOADING)
							if (e.type != this.$enums.MESSAGE_TYPE.READED)
								if (e.type != this.$enums.MESSAGE_TYPE.RECEIPT)
									if (e.type != this.$enums.MESSAGE_TYPE.RECALL)
										if (e.type != this.$enums.MESSAGE_TYPE.GROUP_NEW)
											if (e.type != this.$enums.MESSAGE_TYPE.GROUP_DEL) {
												if (this.$msgType.isRtcGroup(e.type))
													this.$nextTick(() => {
														this.$refs.rtcGroupVideo.onRTCMessage(e)
													})
												else if (
													this.$msgType.isNormal(e.type) ||
													this.$msgType.isTip(e.type) ||
													this.$msgType.isAction(e.type)
												) {
													let t = this.loadGroupInfo(e.groupId)
													this.insertGroupMessage(t, e)
												}
											} else this.$store.commit("removeGroup", e.groupId)
										else this.$store.commit("addGroup", JSON.parse(e.content))
									else this.$store.commit("recallMessage", [e, t])
								else {
									let s = {
										id: e.id,
										groupId: e.groupId,
										readedCount: e.readedCount,
										receiptOk: e.receiptOk,
									}
									this.$store.commit("updateMessage", [s, t])
								}
							else this.$store.commit("resetUnreadCount", t)
						else this.$store.commit("loadingGroupMsg", JSON.parse(e.content))
					},
					insertGroupMessage(e, t) {
						let s = {
							type: "GROUP",
							targetId: e.id,
							showName: e.showGroupName,
							headImage: e.headImageThumb,
						}
						this.$store.commit("openChat", s),
							this.$store.commit("insertMessage", [t, s]),
							!t.selfSend &&
								t.type <= this.$enums.MESSAGE_TYPE.VIDEO &&
								t.status != this.$enums.MESSAGE_STATUS.READED &&
								this.playAudioTip()
					},
					handleSystemMessage(e) {
						if (e.type == this.$enums.MESSAGE_TYPE.USER_BANNED)
							return (
								this.$wsApi.close(3e3),
								void this.$alert("您的账号已被管理员封禁,原因:" + e.content, "账号被封禁", {
									confirmButtonText: "确定",
									callback: (e) => {
										this.onExit()
									},
								})
							)
					},
					onExit() {
						this.$wsApi.close(3e3), sessionStorage.removeItem("accessToken"), (location.href = "/")
					},
					playAudioTip() {
						if (!this.$store.getters.isLoading() && new Date().getTime() - this.lastPlayAudioTime > 1e3) {
							this.lastPlayAudioTime = new Date().getTime()
							let e = new Audio(),
								t = s("f2b0")
							;(e.src = t), e.play()
						}
					},
					showSetting() {
						this.showSettingDialog = !0
					},
					switchUi(e) {
						this.$store.commit("changeViewCode", e)
					},
					closeSetting() {
						this.showSettingDialog = !1
					},
					loadFriendInfo(e) {
						String(e).includes("_") && (e = String(e).split("_")[0])
						let t = this.$store.getters.findFriend(e)
						if (!t) {
							const s = this.$store.state.userStore.userInfo
							t =
								s && s.id == e
									? {
											id: e,
											nickName: s.nickName || "我",
											showNickName: s.nickName || "我",
											headImage: s.headImageThumb || s.headImage || "",
										}
									: { id: e, nickName: "未知用户", showNickName: "未知用户", headImage: "" }
						}
						return t
					},
					loadGroupInfo(e) {
						let t = this.$store.getters.findGroup(e)
						return t || (t = { id: e, showGroupName: "未知群聊", headImageThumb: "" }), t
					},
					onChatItemClick(e) {
						this.$emit("showChat", e)
					},
					onFriendClick(e) {
						this.$emit("showFriend", e)
					},
					onGroupClick(e) {
						let t = {
							type: "GROUP",
							targetId: e.id,
							showName: e.showGroupName,
							headImage: e.headImageThumb,
						}
						this.$emit("showChat", t)
					},
				},
				computed: {
					uiStore() {
						return this.$store.state.uiStore
					},
					unreadCount() {
						let e = 0,
							t = this.$store.state.chatStore.chats
						return (
							t.forEach((t) => {
								t.delete || (e += t.unreadCount)
							}),
							e
						)
					},
				},
				watch: {
					unreadCount: {
						handler(e, t) {
							let s = e > 0 ? e + "条未读" : ""
							this.$elm.setTitleTip(s)
						},
						immediate: !0,
					},
				},
				mounted() {
					this.init()
				},
				activated() {
					console.log("InboxPlugin组件重新激活"),
						this.$nextTick(() => {
							this.$store.commit("refreshChats")
						})
				},
				deactivated() {
					console.log("InboxPlugin组件被隐藏")
				},
				unmounted() {
					console.log("InboxPlugin组件卸载"), this.$wsApi && this.$wsApi.close()
				},
			},
			gs = ms,
			ps = (s("9872"), Object(u["a"])(gs, Xt, es, !1, null, "6cc8846c", null)),
			fs = ps.exports,
			vs = function () {
				var e = this,
					t = e._self._c
				return t("div", { staticClass: "plugin-chat-container" }, [
					t(
						"div",
						{ staticClass: "back-button-container" },
						[
							t(
								"el-button",
								{
									staticClass: "back-button",
									attrs: { type: "primary", icon: "el-icon-arrow-left", size: "small" },
									on: { click: e.goBack },
								},
								[e._v(" 返回 ")],
							),
						],
						1,
					),
					e.isShowingChat
						? t(
								"div",
								{ staticClass: "chat-content" },
								[
									1 === e.uiStore.viewCode
										? t("editor-chat", { attrs: { chatData: e.currentChatData } })
										: e._e(),
									2 === e.uiStore.viewCode
										? t("editor-friend", { on: { startChat: e.handleStartChat } })
										: e._e(),
									3 === e.uiStore.viewCode ? t("editor-group") : e._e(),
								],
								1,
							)
						: e._e(),
					e.isShowingFriend
						? t(
								"div",
								{ staticClass: "friend-content" },
								[
									t("editor-friend", {
										attrs: { friendData: e.friendData },
										on: { startChat: e.handleStartChat },
									}),
								],
								1,
							)
						: e._e(),
				])
			},
			Cs = [],
			Is = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-container",
					{ staticClass: "chat-page" },
					[
						t(
							"el-container",
							{ staticClass: "chat-box" },
							[
								e.isPCTerminalChat ? t("container-manager") : e._e(),
								e.chatStore.activeChat && !e.isAIChat
									? t("chat-box", { attrs: { chat: e.chatStore.activeChat } })
									: e._e(),
							],
							1,
						),
					],
					1,
				)
			},
			Ss = [],
			ws = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{
						staticClass: "chat-box",
						on: {
							click: function (t) {
								return e.closeRefBox()
							},
							mousemove: function (t) {
								return e.readedMessage()
							},
						},
					},
					[
						t(
							"el-container",
							[
								t("el-header", { attrs: { height: "50px" } }, [
									t("span", [e._v(e._s(e.title))]),
									t("span", {
										directives: [
											{
												name: "show",
												rawName: "v-show",
												value: "GROUP" == this.chat.type,
												expression: "this.chat.type == 'GROUP'",
											},
										],
										staticClass: "btn-side el-icon-more",
										attrs: { title: "群聊信息" },
										on: {
											click: function (t) {
												e.showSide = !e.showSide
											},
										},
									}),
								]),
								t(
									"el-main",
									{ staticStyle: { padding: "0" } },
									[
										t(
											"el-container",
											[
												t(
													"el-container",
													{ staticClass: "content-box" },
													[
														t(
															"el-main",
															{
																staticClass: "im-chat-main",
																attrs: { id: "chatScrollBox" },
																on: { scroll: e.onScroll },
															},
															[
																t("div", { staticClass: "im-chat-box" }, [
																	t(
																		"ul",
																		e._l(e.messageList, function (s, i) {
																			return t(
																				"li",
																				{
																					key: `${s.tmpId || s.id || i}-${s.sendTime || i}`,
																				},
																				[
																					i >= e.showMinIdx
																						? t("chat-message-item", {
																								attrs: {
																									mine: e.isMessageFromCurrentUser(
																										s,
																									),
																									headImage:
																										e.headImage(s),
																									showName:
																										e.showName(s),
																									msgInfo: s,
																									groupMembers:
																										e.groupMembers,
																								},
																								on: {
																									call: function (t) {
																										return e.onCall(
																											s.type,
																										)
																									},
																									delete: e.deleteMessage,
																									recall: e.recallMessage,
																								},
																							})
																						: e._e(),
																				],
																				1,
																			)
																		}),
																		0,
																	),
																]),
															],
														),
														t(
															"el-footer",
															{
																staticClass: "im-chat-footer",
																attrs: { height: "220px" },
															},
															[
																t("div", { staticClass: "chat-tool-bar" }, [
																	t("div", {
																		ref: "emotion",
																		staticClass: "icon iconfont icon-emoji",
																		attrs: { title: "表情" },
																		on: {
																			click: function (t) {
																				return (
																					t.stopPropagation(),
																					e.showEmotionBox()
																				)
																			},
																		},
																	}),
																	t(
																		"div",
																		{ attrs: { title: "发送图片" } },
																		[
																			t(
																				"file-upload",
																				{
																					attrs: {
																						action: "/image/upload",
																						maxSize: 104857600,
																						fileTypes: [
																							"image/jpeg",
																							"image/png",
																							"image/jpg",
																							"image/webp",
																							"image/gif",
																						],
																					},
																					on: {
																						before: e.onImageBefore,
																						success: e.onImageSuccess,
																						fail: e.onImageFail,
																					},
																				},
																				[
																					t("i", {
																						staticClass:
																							"el-icon-picture-outline",
																					}),
																				],
																			),
																		],
																		1,
																	),
																	t(
																		"div",
																		{ attrs: { title: "发送文件" } },
																		[
																			t(
																				"file-upload",
																				{
																					ref: "fileUpload",
																					attrs: {
																						action: "/file/upload",
																						maxSize: 10485760,
																					},
																					on: {
																						before: e.onFileBefore,
																						success: e.onFileSuccess,
																						fail: e.onFileFail,
																					},
																				},
																				[
																					t("i", {
																						staticClass: "el-icon-wallet",
																					}),
																				],
																			),
																		],
																		1,
																	),
																	t("div", {
																		directives: [
																			{
																				name: "show",
																				rawName: "v-show",
																				value:
																					"GROUP" == e.chat.type &&
																					e.memberSize <= 500,
																				expression:
																					"chat.type == 'GROUP' && memberSize <= 500",
																			},
																		],
																		staticClass: "icon iconfont icon-receipt",
																		class: e.isReceipt ? "chat-tool-active" : "",
																		attrs: { title: "回执消息" },
																		on: { click: e.onSwitchReceipt },
																	}),
																	t("div", {
																		staticClass: "el-icon-microphone",
																		attrs: { title: "发送语音" },
																		on: {
																			click: function (t) {
																				return e.showRecordBox()
																			},
																		},
																	}),
																	t("div", {
																		directives: [
																			{
																				name: "show",
																				rawName: "v-show",
																				value: "PRIVATE" == e.chat.type,
																				expression: "chat.type == 'PRIVATE'",
																			},
																		],
																		staticClass: "el-icon-phone-outline",
																		attrs: { title: "语音通话" },
																		on: {
																			click: function (t) {
																				return e.showPrivateVideo("voice")
																			},
																		},
																	}),
																	t("div", {
																		directives: [
																			{
																				name: "show",
																				rawName: "v-show",
																				value: "GROUP" == e.chat.type,
																				expression: "chat.type == 'GROUP'",
																			},
																		],
																		staticClass: "el-icon-phone-outline",
																		attrs: { title: "语音通话" },
																		on: {
																			click: function (t) {
																				return e.onGroupVideo()
																			},
																		},
																	}),
																	t("div", {
																		directives: [
																			{
																				name: "show",
																				rawName: "v-show",
																				value: "PRIVATE" == e.chat.type,
																				expression: "chat.type == 'PRIVATE'",
																			},
																		],
																		staticClass: "el-icon-video-camera",
																		attrs: { title: "视频通话" },
																		on: {
																			click: function (t) {
																				return e.showPrivateVideo("video")
																			},
																		},
																	}),
																	t("div", {
																		staticClass: "el-icon-chat-dot-round",
																		attrs: { title: "聊天记录" },
																		on: {
																			click: function (t) {
																				return e.showHistoryBox()
																			},
																		},
																	}),
																]),
																t(
																	"div",
																	{ staticClass: "send-content-area" },
																	[
																		t("ChatInput", {
																			ref: "chatInputEditor",
																			attrs: {
																				ownerId:
																					e.chat && "GROUP" === e.chat.type
																						? e.group.ownerId
																						: e.mine.id,
																				targetUserId:
																					e.chat && "PRIVATE" === e.chat.type
																						? e.chat.targetId
																						: null,
																				"group-members": e.groupMembers,
																			},
																			on: { submit: e.sendMessage },
																		}),
																		t(
																			"div",
																			{ staticClass: "send-btn-area" },
																			[
																				t(
																					"el-button",
																					{
																						attrs: {
																							type: "primary",
																							icon: "el-icon-s-promotion",
																						},
																						on: {
																							click: function (t) {
																								return e.notifySend()
																							},
																						},
																					},
																					[e._v("发送")],
																				),
																			],
																			1,
																		),
																	],
																	1,
																),
															],
														),
													],
													1,
												),
												e.showSide
													? t(
															"el-aside",
															{
																staticClass: "chat-group-side-box",
																attrs: { width: "320px" },
															},
															[
																t("chat-group-side", {
																	attrs: {
																		group: e.group,
																		groupMembers: e.groupMembers,
																	},
																	on: {
																		reload: function (t) {
																			return e.loadGroup(e.group.id)
																		},
																	},
																}),
															],
															1,
														)
													: e._e(),
											],
											1,
										),
									],
									1,
								),
								t("emotion", { ref: "emoBox", on: { emotion: e.onEmotion } }),
								t("chat-record", {
									attrs: { visible: e.showRecord },
									on: { close: e.closeRecordBox, send: e.onSendRecord },
								}),
								t("group-member-selector", {
									ref: "rtcSel",
									attrs: { groupId: e.group.id },
									on: { complete: e.onInviteOk },
								}),
								t("rtc-group-join", { ref: "rtcJoin", attrs: { groupId: e.group.id } }),
								t("chat-history", {
									attrs: {
										visible: e.showHistory,
										chat: e.chat,
										friend: e.friend,
										group: e.group,
										groupMembers: e.groupMembers,
									},
									on: { close: e.closeHistoryBox },
								}),
							],
							1,
						),
					],
					1,
				)
			},
			Ts = [],
			bs = s("7a32"),
			ys = s("38c4"),
			xs = s("18c6"),
			As = s("ba5f"),
			$s = s("647d"),
			Es = s("36a4"),
			ks = s("cf65"),
			Ms = s("fa2e"),
			Ns = s("e8ff")
		const _s = Ns["a"]
		var Ps = {
				name: "chatPrivate",
				components: {
					ChatInput: Ms["a"],
					ChatMessageItem: ys["a"],
					FileUpload: D["a"],
					ChatGroupSide: bs["a"],
					Emotion: xs["a"],
					ChatRecord: As["a"],
					ChatHistory: $s["a"],
					ChatAtBox: Es["a"],
					GroupMemberSelector: ut["a"],
					RtcGroupJoin: ks["a"],
				},
				props: { chat: { type: Object } },
				data() {
					return {
						userInfo: {},
						group: {},
						groupMembers: [],
						sendImageUrl: "",
						sendImageFile: "",
						placeholder: "",
						isReceipt: !0,
						showRecord: !1,
						showSide: !1,
						showHistory: !1,
						lockMessage: !1,
						showMinIdx: 0,
						reqQueue: [],
						isSending: !1,
						scrollThrottle: null,
						scrollTimer: null,
						lastScrollTime: 0,
						activeEventBus: null,
						activeEventName: null,
					}
				},
				methods: {
					moveChatToTop() {
						let e = this.$store.getters.findChatIdx(this.chat)
						this.$store.commit("moveTop", e)
					},
					closeRefBox() {
						this.$refs.emoBox.close()
					},
					onCall(e) {
						e == this.$enums.MESSAGE_TYPE.ACT_RT_VOICE
							? this.showPrivateVideo("voice")
							: e == this.$enums.MESSAGE_TYPE.ACT_RT_VIDEO && this.showPrivateVideo("video")
					},
					onSwitchReceipt() {
						;(this.isReceipt = !this.isReceipt), this.refreshPlaceHolder()
					},
					onImageSuccess(e, t) {
						let s = JSON.parse(JSON.stringify(t.msgInfo))
						;(s.content = JSON.stringify(e)),
							(s.receipt = this.isReceipt),
							this.sendMessageRequest(s).then((e) => {
								;(s.loadStatus = "ok"),
									(s.id = e.id),
									(this.isReceipt = !1),
									this.$store.commit("insertMessage", [s, this.chat])
							})
					},
					onImageFail(e, t) {
						let s = JSON.parse(JSON.stringify(t.msgInfo))
						;(s.loadStatus = "fail"), this.$store.commit("insertMessage", [s, this.chat])
					},
					onImageBefore(e) {
						if (this.isBanned) return void this.showBannedTip()
						this.saveFileToWorkspace(e)
						let t = URL.createObjectURL(e),
							s = { originUrl: t, thumbUrl: t },
							i = {
								id: 0,
								tmpId: this.generateId(),
								fileId: e.uid,
								sendId: this.mine.id,
								content: JSON.stringify(s),
								sendTime: new Date().getTime(),
								selfSend: !0,
								type: 1,
								readedCount: 0,
								loadStatus: "loading",
								status: this.$enums.MESSAGE_STATUS.UNSEND,
							}
						this.fillTargetId(i, this.chat.targetId),
							this.$store.commit("insertMessage", [i, this.chat]),
							this.moveChatToTop(),
							this.scrollToBottom(),
							(e.msgInfo = i)
					},
					onFileSuccess(e, t) {
						let s = { name: t.name, size: t.size, url: e },
							i = JSON.parse(JSON.stringify(t.msgInfo))
						;(i.content = JSON.stringify(s)),
							(i.receipt = this.isReceipt),
							this.sendMessageRequest(i).then((e) => {
								;(i.loadStatus = "ok"),
									(i.id = e.id),
									(this.isReceipt = !1),
									this.refreshPlaceHolder(),
									this.$store.commit("insertMessage", [i, this.chat])
							})
					},
					onFileFail(e, t) {
						let s = JSON.parse(JSON.stringify(t.msgInfo))
						;(s.loadStatus = "fail"), this.$store.commit("insertMessage", [s, this.chat])
					},
					onFileBefore(e) {
						if (this.isBanned) return void this.showBannedTip()
						this.saveFileToWorkspace(e)
						let t = URL.createObjectURL(e),
							s = { name: e.name, size: e.size, url: t },
							i = {
								id: 0,
								tmpId: this.generateId(),
								sendId: this.mine.id,
								content: JSON.stringify(s),
								sendTime: new Date().getTime(),
								selfSend: !0,
								type: 2,
								loadStatus: "loading",
								readedCount: 0,
								status: this.$enums.MESSAGE_STATUS.UNSEND,
							}
						this.fillTargetId(i, this.chat.targetId),
							this.$store.commit("insertMessage", [i, this.chat]),
							this.moveChatToTop(),
							this.scrollToBottom(),
							(e.msgInfo = i)
					},
					async saveFileToWorkspace(e) {
						try {
							if ((console.log("[ChatBox] saveFileToWorkspace called with file:", e.name), !this.$vscode))
								return void console.warn("[ChatBox] VSCode services not available")
							this.$vscode.waitForInitialization && (await this.$vscode.waitForInitialization())
							const t = e.name,
								s = this.chat.targetId || "unknown",
								i = await this.$vscode.saveFileToWorkspace(e, t, s)
							i
								? console.log("[ChatBox] File saved successfully via SharedServicesAccessor:", {
										fileName: t,
										fileSize: e.size,
										sessionId: s,
									})
								: console.error("[ChatBox] Failed to save file via SharedServicesAccessor")
						} catch (t) {
							console.error("[ChatBox] Failed to save file to workspace:", t)
						}
					},
					readFileAsArrayBuffer(e) {
						return new Promise((t, s) => {
							const i = new FileReader()
							;(i.onload = (e) => t(e.target.result)), (i.onerror = (e) => s(e)), i.readAsArrayBuffer(e)
						})
					},
					onCloseSide() {
						this.showSide = !1
					},
					onScrollToTop() {
						this.showMinIdx = this.showMinIdx > 10 ? this.showMinIdx - 10 : 0
					},
					onScroll(e) {
						this.scrollThrottle && clearTimeout(this.scrollThrottle),
							(this.scrollThrottle = setTimeout(() => {
								let t = e.target,
									s = t.scrollTop
								s < 30 && (this.showMinIdx = this.showMinIdx > 20 ? this.showMinIdx - 20 : 0)
							}, 100))
					},
					showEmotionBox() {
						let e = this.$refs.emotion.offsetWidth,
							t = this.$elm.fixLeft(this.$refs.emotion),
							s = this.$elm.fixTop(this.$refs.emotion)
						this.$refs.emoBox.open({ x: t + e / 2, y: s })
					},
					onEmotion(e) {
						this.$refs.chatInputEditor.insertEmoji(e)
					},
					showRecordBox() {
						this.showRecord = !0
					},
					closeRecordBox() {
						this.showRecord = !1
					},
					showPrivateVideo(e) {
						if (this.isBanned) return void this.showBannedTip()
						let t = { mode: e, isHost: !0, friend: this.friend }
						this.$eventBus.$emit("openPrivateVideo", t)
					},
					onGroupVideo() {
						if (this.isBanned) return void this.showBannedTip()
						let e = [this.mine.id],
							t = this.$store.state.configStore.webrtc.maxChannel
						this.$refs.rtcSel.open(t, e, e)
					},
					onInviteOk(e) {
						if (e.length < 2) return
						let t = []
						e.forEach((e) => {
							t.push({
								id: e.userId,
								nickName: e.showNickName,
								headImage: e.headImage,
								isCamera: !1,
								isMicroPhone: !0,
							})
						})
						let s = { isHost: !0, groupId: this.group.id, inviterId: this.mine.id, userInfos: t }
						this.$eventBus.$emit("openGroupVideo", s)
					},
					showHistoryBox() {
						this.showHistory = !0
					},
					closeHistoryBox() {
						this.showHistory = !1
					},
					onSendRecord(e) {
						if (this.isBanned) return void this.showBannedTip()
						let t = { content: JSON.stringify(e), type: 3, receipt: this.isReceipt }
						this.fillTargetId(t, this.chat.targetId),
							this.sendMessageRequest(t).then((e) => {
								;(e.selfSend = !0),
									this.$store.commit("insertMessage", [e, this.chat]),
									this.moveChatToTop(),
									this.$refs.chatInputEditor.focus(),
									this.scrollToBottom(),
									(this.showRecord = !1),
									(this.isReceipt = !1),
									this.refreshPlaceHolder()
							})
					},
					fillTargetId(e, t) {
						if ("GROUP" == this.chat.type) e.groupId = t
						else if (this.chat.isTerminalChat || this.chat.isTerminalInbox) {
							const s = t.split("_"),
								i = parseInt(s[0])
							if (((e.recvId = i), this.chat.isTerminalChat))
								(e.targetTerminal = this.chat.senderTerminal),
									(e.senderTerminal = this.getCurrentTerminal())
							else if (this.chat.isTerminalInbox) {
								const t = parseInt(s[1])
								;(e.targetTerminal = t), (e.senderTerminal = this.getCurrentTerminal())
							}
							console.log(
								`🔧 [ChatBox] 终端消息填充: 目标终端=${e.targetTerminal}, 发送端=${e.senderTerminal}`,
							)
						} else (e.recvId = t), (e.senderTerminal = this.getCurrentTerminal())
					},
					notifySend() {
						this.$refs.chatInputEditor.submit()
					},
					async sendMessage(e) {
						if ((console.log("[ChatBox] 📤 开始发送消息:", e), this.readedMessage(), this.isBanned))
							return void this.showBannedTip()
						let t = this.isReceipt ? "【回执消息】" : "",
							s = !1
						for (let o = 0; o < e.length; o++) {
							let n = e[o]
							try {
								switch (n.type) {
									case "text":
										await this.sendTextMessage(t + n.content, n.atUserIds), (s = !0)
										break
									case "image":
										await this.sendImageMessage(n.content.file), (s = !0)
										break
									case "file":
										await this.sendFileMessage(n.content.file), (s = !0)
										break
								}
							} catch (i) {
								console.error("[ChatBox] ❌ 发送消息失败:", i)
							}
						}
						s &&
							(console.log("[ChatBox] ✅ 消息发送成功，重置编辑器并滚动到底部"),
							this.resetEditor(),
							this.$nextTick(() => {
								this.scrollToBottom()
							}))
					},
					sendImageMessage(e) {
						return new Promise((t, s) => {
							this.onImageBefore(e)
							let i = new FormData()
							i.append("file", e),
								this.$http
									.post("/image/upload", i, { headers: { "Content-Type": "multipart/form-data" } })
									.then((s) => {
										this.onImageSuccess(s, e), t()
									})
									.catch((t) => {
										this.onImageFail(t, e), s()
									}),
								this.$nextTick(() => this.$refs.chatInputEditor.focus()),
								this.scrollToBottom()
						})
					},
					sendTextMessage(e, t) {
						return new Promise((s, i) => {
							if ((console.log("[ChatBox] 📝 发送文本消息:", { sendText: e, atUserIds: t }), !e.trim()))
								return (
									console.warn("[ChatBox] ⚠️ 消息内容为空，拒绝发送"),
									void i(new Error("消息内容为空"))
								)
							let o = {
								id: 0,
								tmpId: this.generateId(),
								sendId: this.mine.id,
								content: e,
								sendTime: new Date().getTime(),
								selfSend: !0,
								type: 0,
								readedCount: 0,
								loadStatus: "loading",
								status: this.$enums.MESSAGE_STATUS.UNSEND,
							}
							this.fillTargetId(o, this.chat.targetId),
								"GROUP" == this.chat.type && ((o.atUserIds = t), (o.receipt = this.isReceipt)),
								console.log("[ChatBox] 📦 立即插入临时消息:", o),
								this.$store.commit("insertMessage", [o, this.chat]),
								this.moveChatToTop(),
								this.scrollToBottom()
							let n = { content: e, type: 0 }
							this.fillTargetId(n, this.chat.targetId),
								"GROUP" == this.chat.type && ((n.atUserIds = t), (n.receipt = this.isReceipt)),
								console.log("[ChatBox] 📡 准备发送HTTP请求:", n),
								(this.lockMessage = !0),
								this.sendMessageRequest(n)
									.then((e) => {
										console.log("[ChatBox] ✅ HTTP请求成功，收到响应:", e)
										let t = JSON.parse(JSON.stringify(o))
										;(t.id = e.id),
											(t.loadStatus = "ok"),
											(t.status = this.$enums.MESSAGE_STATUS.SENDED),
											Object.assign(t, e),
											(t.selfSend = !0),
											(t.sendTime = t.sendTime || Date.now()),
											(t.sendId = t.sendId || this.mine.id),
											console.log("[ChatBoxPlugin] 📦 更新最终消息状态:", t),
											this.$store.commit("insertMessage", [t, this.chat]),
											(this.isReceipt = !1),
											console.log("[ChatBox] ✅ 文本消息处理完成"),
											s(t)
									})
									.catch((e) => {
										console.error("[ChatBox] ❌ HTTP请求失败:", e)
										let t = JSON.parse(JSON.stringify(o))
										;(t.loadStatus = "fail"),
											(t.status = this.$enums.MESSAGE_STATUS.FAILED),
											this.$store.commit("insertMessage", [t, this.chat]),
											i(e)
									})
									.finally(() => {
										;(this.lockMessage = !1), (this.isReceipt = !1)
									})
						})
					},
					sendFileMessage(e) {
						return new Promise((t, s) => {
							let i = this.$refs.fileUpload.beforeUpload(e)
							i && this.$refs.fileUpload.onFileUpload({ file: e })
						})
					},
					deleteMessage(e) {
						this.$confirm("确认删除消息?", "删除消息", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning",
						}).then(() => {
							this.$store.commit("deleteMessage", e)
						})
					},
					recallMessage(e) {
						this.$confirm("确认撤回消息?", "撤回消息", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning",
						}).then(() => {
							let t = `/message/${this.chat.type.toLowerCase()}/recall/${e.id}`
							this.$http({ url: t, method: "delete" }).then((e) => {
								this.$message.success("消息已撤回"),
									(e.selfSend = !0),
									this.$store.commit("recallMessage", [e, this.chat])
							})
						})
					},
					readedMessage() {
						if (0 != this.chat.unreadCount) {
							if ((this.$store.commit("resetUnreadCount", this.chat), "GROUP" == this.chat.type))
								var e = "/message/group/readed?groupId=" + this.chat.targetId
							else e = "/message/private/readed?friendId=" + this.chat.targetId
							this.$http({ url: e, method: "put" }).then(() => {})
						}
					},
					loadReaded(e) {
						this.$http({ url: "/message/private/maxReadedId?friendId=" + e, method: "get" }).then((t) => {
							this.$store.commit("readedMessage", { friendId: e, maxId: t })
						})
					},
					loadGroup(e) {
						this.$http({ url: "/group/find/" + e, method: "get" }).then((e) => {
							;(this.group = e),
								this.$store.commit("updateChatFromGroup", e),
								this.$store.commit("updateGroup", e)
						}),
							this.$http({ url: "/group/members/" + e, method: "get" }).then((e) => {
								this.groupMembers = e
							})
					},
					updateFriendInfo() {
						if (this.isFriend) {
							let e = JSON.parse(JSON.stringify(this.friend))
							;(e.headImage = this.userInfo.headImageThumb),
								(e.nickName = this.userInfo.nickName),
								(e.showNickName = e.remarkNickName ? e.remarkNickName : e.nickName),
								this.$store.commit("updateChatFromFriend", e),
								this.$store.commit("updateFriend", e)
						} else this.$store.commit("updateChatFromUser", this.userInfo)
					},
					loadFriend(e) {
						console.log("[ChatBox] 🔍 开始加载好友信息: " + e),
							this.$http({ url: "/user/find/" + e, method: "GET" })
								.then((t) => {
									var s, i, o
									;(console.log(`[ChatBox] 📥 HTTP响应 /user/find/${e}:`, t),
									t && "object" === typeof t && t.id)
										? (console.log("[ChatBox] ✅ 用户信息有效，更新userInfo:", t),
											(this.userInfo = t),
											this.updateFriendInfo())
										: (console.warn("[ChatBox] ❌ 用户信息无效，保持现有userInfo不变:", t),
											console.warn("[ChatBox] 当前userInfo:", this.userInfo),
											(this.userInfo && this.userInfo.id) ||
												((this.userInfo = {
													id: e,
													nickName:
														(null === (s = this.chat) || void 0 === s
															? void 0
															: s.showName) || "用户" + e,
													headImage:
														(null === (i = this.chat) || void 0 === i
															? void 0
															: i.headImage) || "",
													headImageThumb:
														(null === (o = this.chat) || void 0 === o
															? void 0
															: o.headImage) || "",
												}),
												console.log("[ChatBox] 🔄 使用降级用户信息:", this.userInfo),
												this.updateFriendInfo()))
								})
								.catch((t) => {
									var s, i, o
									;(console.error("[ChatBox] ❌ 加载好友信息失败: " + e, t),
									this.userInfo && this.userInfo.id) ||
										((this.userInfo = {
											id: e,
											nickName:
												(null === (s = this.chat) || void 0 === s ? void 0 : s.showName) ||
												"用户" + e,
											headImage:
												(null === (i = this.chat) || void 0 === i ? void 0 : i.headImage) || "",
											headImageThumb:
												(null === (o = this.chat) || void 0 === o ? void 0 : o.headImage) || "",
										}),
										console.log("[ChatBox] 🔄 错误时使用降级用户信息:", this.userInfo),
										this.updateFriendInfo())
								})
					},
					showName(e) {
						if ("GROUP" == this.chat.type) {
							let t = this.groupMembers.find((t) => t.userId == e.sendId)
							return t ? t.showNickName : ""
						}
						return e.sendId == this.mine.id ? this.mine.nickName : this.chat.showName
					},
					headImage(e) {
						if ("GROUP" == this.chat.type) {
							let t = this.groupMembers.find((t) => t.userId == e.sendId)
							return t ? t.headImage : ""
						}
						return e.sendId == this.mine.id ? this.mine.headImageThumb : this.chat.headImage
					},
					resetEditor() {
						this.$nextTick(() => {
							if (this.$refs.chatInputEditor && "function" === typeof this.$refs.chatInputEditor.clear)
								try {
									this.$refs.chatInputEditor.clear()
								} catch (e) {
									console.warn("[ChatBox] 编辑器清理失败:", e)
								}
							if (this.$refs.chatInputEditor && "function" === typeof this.$refs.chatInputEditor.focus)
								try {
									this.$refs.chatInputEditor.focus()
								} catch (e) {
									console.warn("[ChatBox] 编辑器聚焦失败:", e)
								}
						})
					},
					scrollToBottom() {
						const e = Date.now()
						e - this.lastScrollTime < 50 ||
							((this.lastScrollTime = e),
							this.$nextTick(() => {
								let e = document.getElementById("chatScrollBox")
								if (e)
									if (_s && "function" === typeof _s.scrollToBottom)
										try {
											_s.scrollToBottom(e)
										} catch (t) {
											console.warn(
												"[ChatBox] globalAdapter.scrollToBottom failed, using fallback:",
												t,
											),
												(e.scrollTop = e.scrollHeight)
										}
									else
										console.warn("[ChatBox] globalAdapter不可用，使用降级方案"),
											(e.scrollTop = e.scrollHeight)
							}))
					},
					refreshPlaceHolder() {
						this.isReceipt
							? (this.placeholder = "【回执消息】")
							: this.$refs.editBox && this.$refs.editBox.innerHTML
								? (this.placeholder = "")
								: (this.placeholder = "聊点什么吧~")
					},
					sendMessageRequest(e) {
						return new Promise((t, s) => {
							this.reqQueue.push({ msgInfo: e, resolve: t, reject: s }), this.processReqQueue()
						})
					},
					processReqQueue() {
						if (this.reqQueue.length && !this.isSending) {
							this.isSending = !0
							const e = this.reqQueue.shift()
							this.$http({ url: this.messageAction, method: "post", data: e.msgInfo })
								.then((t) => {
									e.resolve(t)
								})
								.catch((t) => {
									e.reject(t)
								})
								.finally(() => {
									;(this.isSending = !1), this.processReqQueue()
								})
						}
					},
					showBannedTip() {
						let e = {
							tmpId: this.generateId(),
							sendId: this.mine.id,
							sendTime: new Date().getTime(),
							type: this.$enums.MESSAGE_TYPE.TIP_TEXT,
						}
						"PRIVATE" == this.chat.type
							? ((e.recvId = this.mine.id),
								(e.content = "该用户已被管理员封禁,原因:" + this.userInfo.reason))
							: ((e.groupId = this.group.id),
								(e.content = "本群聊已被管理员封禁,原因:" + this.group.reason)),
							this.$store.commit("insertMessage", [e, this.chat])
					},
					generateId() {
						return String(new Date().getTime()) + String(Math.floor(1e3 * Math.random()))
					},
					getCurrentTerminal() {
						return 4
					},
					isMessageFromCurrentUser(e) {
						if (
							void 0 !== e.senderTerminal ||
							void 0 !== e.targetTerminal ||
							this.chat.isTerminalChat ||
							this.chat.isTerminalInbox
						) {
							const t = this.getCurrentTerminal(),
								s = e.senderTerminal === t
							return (
								void 0 !== e.senderTerminal &&
									this.messageList.length < 10 &&
									console.log(
										`🔧 [ChatBox] 终端消息: 当前=${t}, 发送端=${e.senderTerminal}, 右侧=${s}`,
									),
								s
							)
						}
						return e.sendId === this.mine.id
					},
					initializeTerminalChat() {
						console.log("[ChatBox] 初始化终端会话:", this.chat.showName),
							this.chat.messages || this.$set(this.chat, "messages", [])
						const e = this.chat.targetId
						let t = null
						"string" === typeof e && e.includes("_")
							? ((t = parseInt(e.split("_")[0])),
								console.log(`[ChatBox] 从终端会话targetId "${e}" 提取用户ID: ${t}`))
							: "number" === typeof e && (t = e),
							t
								? ((this.userInfo = {
										id: t,
										nickName: this.chat.showName || "用户",
										headImage: this.chat.headImage || "",
										headImageThumb: this.chat.headImage || "",
									}),
									console.log("[ChatBox] 立即设置基本用户信息:", this.userInfo),
									console.log("[ChatBox] 为终端会话加载完整用户信息: " + t),
									this.loadFriend(t))
								: (console.warn("[ChatBox] 无法提取用户ID，使用userStore信息"),
									(this.userInfo = this.$store.state.userStore.userInfo || {
										id: 0,
										nickName: "未知用户",
										headImage: "",
										headImageThumb: "",
									})),
							console.log(
								"[ChatBox] 终端会话初始化完成，当前消息数: " +
									(this.chat.messages ? this.chat.messages.length : 0),
							),
							this.$nextTick(() => {
								this.scrollToBottom()
							})
					},
					setupVSCodeFileEventListeners() {
						console.log("🚀 [飞轮效应] 设置VSCode文件事件监听器...")
						const e = "chat:file:send"
						return window.vueEventBus && "function" === typeof window.vueEventBus.$on
							? (window.vueEventBus.$on(e, this.handleVSCodeFileSend),
								console.log("🚀 [飞轮效应] 使用全局vueEventBus监听"),
								(this.activeEventBus = window.vueEventBus),
								void (this.activeEventName = e))
							: this.$eventBus && "function" === typeof this.$eventBus.$on
								? (this.$eventBus.$on(e, this.handleVSCodeFileSend),
									console.log("🚀 [飞轮效应] 使用$eventBus监听"),
									(this.activeEventBus = this.$eventBus),
									void (this.activeEventName = e))
								: this.$bus && "function" === typeof this.$bus.$on
									? (this.$bus.$on(e, this.handleVSCodeFileSend),
										console.log("🚀 [飞轮效应] 使用$bus监听"),
										(this.activeEventBus = this.$bus),
										void (this.activeEventName = e))
									: void console.warn("⚠️ [飞轮效应] 没有可用的事件总线")
					},
					handleVSCodeFileSend(e) {
						console.log("🚀 [飞轮效应] 接收到VSCode文件发送事件:", e)
						try {
							if (!e || !e.file) return void console.error("❌ [飞轮效应] 无效的文件事件数据:", e)
							const { file: t, sessionId: s, sessionType: i, targetId: o, source: n } = e
							s &&
								this.chat &&
								this.chat.targetId &&
								s !== this.chat.targetId.toString() &&
								(console.log("🔄 [飞轮效应] 会话ID不匹配，切换到目标会话: " + s),
								this.switchToTargetSession(s, i)),
								this.sendFileFromVSCode(t, n)
						} catch (t) {
							console.error("❌ [飞轮效应] 处理VSCode文件事件失败:", t),
								this.$message.error("发送文件失败，请重试")
						}
					},
					switchToTargetSession(e, t) {
						try {
							console.log(`🔄 [飞轮效应] 切换会话: ${t}/${e}`)
							const s = {
								targetId: parseInt(e),
								type: "ai" === t ? "PRIVATE" : (t || "PRIVATE").toUpperCase(),
								showName: "会话" + e,
							}
							this.$store && this.$store.commit
								? (this.$store.commit("setActiveChat", s), console.log("✅ [飞轮效应] 会话切换成功"))
								: console.warn("⚠️ [飞轮效应] Store不可用，无法切换会话")
						} catch (s) {
							console.error("❌ [飞轮效应] 切换会话失败:", s)
						}
					},
					async sendFileFromVSCode(e, t = "vscode-workspace") {
						try {
							if (
								(console.log("🚀 [飞轮效应] 开始发送VSCode文件:", {
									fileName: e.name,
									fileSize: e.size,
									fileType: e.type,
									source: t,
								}),
								this.isBanned)
							)
								return void this.showBannedTip()
							if (!this.$refs.fileUpload || !this.$refs.fileUpload.beforeUpload(e))
								return void console.error("❌ [飞轮效应] 文件验证失败")
							await this.sendFileMessage(e),
								console.log("✅ [飞轮效应] VSCode文件发送成功"),
								this.$message.success(`✅ 文件 "${e.name}" 发送成功`)
						} catch (s) {
							console.error("❌ [飞轮效应] VSCode文件发送失败:", s),
								this.$message.error(`❌ 文件 "${e.name}" 发送失败`)
						}
					},
					cleanupVSCodeFileEventListeners() {
						console.log("🚀 [飞轮效应] 清理VSCode文件事件监听器..."),
							this.activeEventBus &&
								this.activeEventName &&
								"function" === typeof this.activeEventBus.$off &&
								(this.activeEventBus.$off(this.activeEventName, this.handleVSCodeFileSend),
								console.log("✅ [飞轮效应] 已清理活跃事件总线上的监听器"),
								(this.activeEventBus = null),
								(this.activeEventName = null))
					},
				},
				computed: {
					mine() {
						return this.$store.state.userStore.userInfo
					},
					isFriend() {
						return this.userInfo && this.userInfo.id
							? this.$store.getters.isFriend(this.userInfo.id)
							: (console.warn("[ChatBox] isFriend计算时userInfo无效:", this.userInfo), !1)
					},
					friend() {
						return this.userInfo && this.userInfo.id
							? this.$store.getters.findFriend(this.userInfo.id)
							: (console.warn("[ChatBox] friend计算时userInfo无效:", this.userInfo), null)
					},
					title() {
						let e = this.chat.showName
						if ("GROUP" == this.chat.type) {
							const t = this.groupMembers
							if (Array.isArray(t)) {
								let s = t.filter((e) => e && !e.quit).length
								e += `(${s})`
							} else console.warn("[ChatBox] groupMembers不是数组或为undefined:", t), (e += "(?)")
						}
						return e
					},
					messageAction() {
						return this.chat.isTerminalInbox
							? "/message/private/send-to-terminal"
							: `/message/${this.chat.type.toLowerCase()}/send`
					},
					unreadCount() {
						return this.chat.unreadCount
					},
					messageSize() {
						return this.chat && this.chat.messages ? this.chat.messages.length : 0
					},
					messageList() {
						var e, t, s, i, o, n, a
						if (
							(console.log("📋 [ChatBox] 聊天记录排查：", {
								chatType: null === (e = this.chat) || void 0 === e ? void 0 : e.type,
								chatTargetId: null === (t = this.chat) || void 0 === t ? void 0 : t.targetId,
								isTerminalInbox: null === (s = this.chat) || void 0 === s ? void 0 : s.isTerminalInbox,
								showName: null === (i = this.chat) || void 0 === i ? void 0 : i.showName,
								messagesExists: !(null === (o = this.chat) || void 0 === o || !o.messages),
								messagesCount:
									(null === (n = this.chat) ||
									void 0 === n ||
									null === (n = n.messages) ||
									void 0 === n
										? void 0
										: n.length) || 0,
								showMinIdx: this.showMinIdx,
								visibleMessageCount:
									null !== (a = this.chat) && void 0 !== a && a.messages
										? this.chat.messages.filter((e, t) => t >= this.showMinIdx).length
										: 0,
							}),
							!this.chat || !this.chat.messages)
						)
							return console.log("📋 [ChatBox] 返回空消息列表"), []
						const r = this.chat.messages.filter((e, t) => t >= this.showMinIdx).length
						return (
							console.log(
								`📋 [ChatBox] 总消息${this.chat.messages.length}条，showMinIdx=${this.showMinIdx}，可见消息${r}条`,
							),
							this.chat.messages
						)
					},
					isBanned() {
						const e = "PRIVATE" == this.chat.type && this.userInfo && this.userInfo.isBanned,
							t = "GROUP" == this.chat.type && this.group && this.group.isBanned
						return e || t
					},
					memberSize() {
						const e = this.groupMembers
						return Array.isArray(e)
							? e.filter((e) => e && !e.quit).length
							: (console.warn("[ChatBox] memberSize计算时groupMembers不是数组或为undefined:", e), 0)
					},
				},
				watch: {
					chat: {
						handler(e, t) {
							!e ||
								!e.targetId ||
								(t && e.type == t.type && e.targetId == t.targetId) ||
								((this.showMinIdx = 0),
								console.log("[ChatBox] 🔧 立即重置showMinIdx为0，防止消息被过滤"),
								"GROUP" == this.chat.type
									? this.loadGroup(this.chat.targetId)
									: this.chat.isTerminalChat || this.chat.isTerminalInbox
										? (console.log("[ChatBox] 切换到终端收件箱会话:", this.chat.showName),
											this.initializeTerminalChat())
										: (this.loadFriend(this.chat.targetId), this.loadReaded(this.chat.targetId)),
								this.scrollToBottom(),
								(this.showSide = !1),
								this.readedMessage(),
								this.$nextTick(() => {
									setTimeout(
										() => {
											let e = this.chat.messages ? this.chat.messages.length : 0,
												t = e > 30 ? e - 30 : 0
											;(this.showMinIdx = t),
												console.log(
													`[ChatBox] 🔧 最终设置showMinIdx: ${t}, 总消息数: ${e}, 会话类型: ${this.chat.isTerminalInbox ? "终端" : "普通"}`,
												)
										},
										this.chat.isTerminalInbox ? 200 : 50,
									)
								}),
								this.resetEditor(),
								(this.isReceipt = !1),
								this.refreshPlaceHolder())
						},
						immediate: !0,
					},
					messageSize: {
						handler(e, t) {
							var s
							e > t &&
								(console.log(
									"[ChatBox] 📈 检测到新消息，数量: %d → %d (聊天: %s)",
									t,
									e,
									null === (s = this.chat) || void 0 === s ? void 0 : s.targetId,
								),
								this.scrollTimer && clearTimeout(this.scrollTimer),
								(this.scrollTimer = setTimeout(() => {
									this.$nextTick(() => {
										this.scrollToBottom()
									})
								}, 50)))
						},
						immediate: !1,
					},
				},
				mounted() {
					console.log("[ChatBox] Component mounting..."),
						console.log("[ChatBox] Checking event bus availability:"),
						console.log("- $eventBus:", !!this.$eventBus),
						console.log("- $bus:", !!this.$bus),
						console.log("[ChatBox] Component mounted")
					try {
						_s && "function" === typeof _s.init
							? (_s.init(), console.log("[ChatBox] globalAdapter初始化成功"))
							: console.warn("[ChatBox] globalAdapter不可用或缺少init方法")
					} catch (t) {
						console.error("[ChatBox] globalAdapter初始化失败:", t)
					}
					this.setupVSCodeFileEventListeners()
					let e = document.getElementById("chatScrollBox")
					e && e.addEventListener("scroll", this.onScroll)
				},
				beforeDestroy() {
					this.cleanupVSCodeFileEventListeners(),
						this.scrollThrottle && clearTimeout(this.scrollThrottle),
						this.scrollTimer && clearTimeout(this.scrollTimer)
					try {
						_s &&
							"function" === typeof _s.cleanup &&
							(_s.cleanup(), console.log("[ChatBox] globalAdapter清理成功"))
					} catch (e) {
						console.warn("[ChatBox] globalAdapter清理失败:", e)
					}
				},
			},
			Rs = Ps,
			Fs = (s("1358"), Object(u["a"])(Rs, ws, Ts, !1, null, null, null)),
			Ds = Fs.exports,
			Ls = {
				name: "EditorChat",
				components: { ChatItem: Ve["a"], ChatBox: Ds, ContainerManager: At["a"] },
				props: { chatData: { type: Object, default: () => null } },
				data() {
					return {
						searchText: "",
						messageContent: "",
						group: {},
						groupMembers: [],
						showThinkingPanel: !1,
						activeTab: "chain",
						currentSessionId: "",
						selectedAIChat: null,
						isAIChat: !1,
						dragHintElement: null,
						processingMessage: null,
						globalDragListeners: null,
						unifiedSessionUnsubscribe: null,
						lastActivatedSessionId: null,
						tabs: [
							{ key: "chain", label: "思维链", icon: "🧠" },
							{ key: "dashboard", label: "仪表盘", icon: "📊" },
							{ key: "assistant", label: "AI助手", icon: "🤖" },
							{ key: "settings", label: "设置", icon: "⚙️" },
						],
						assistantStatus: "active",
						feedbackText: "",
						aiInsights: [
							{
								id: "insight_1",
								icon: "💡",
								title: "对话模式识别",
								description: "检测到用户倾向于技术性讨论，建议提供更详细的技术解释",
								priority: "medium",
							},
							{
								id: "insight_2",
								icon: "⚡",
								title: "回复效率优化",
								description: "可以通过预加载常见问题答案来提升响应速度",
								priority: "low",
							},
						],
						settings: {
							showRealtime: !0,
							autoExpand: !0,
							showConfidence: !0,
							analysisDepth: "detailed",
							updateInterval: "3000",
							exportFormat: "json",
						},
						isPCTerminalChat: !1,
					}
				},
				computed: {
					chatStore() {
						return this.$store.state.chatStore
					},
					loading() {
						return this.chatStore.loadingGroupMsg || this.chatStore.loadingPrivateMsg
					},
					assistantStatusText() {
						const e = { active: "🟢 活跃", idle: "🟡 空闲", analyzing: "🔵 分析中" }
						return e[this.assistantStatus] || "未知"
					},
				},
				created() {
					this.loadSettings()
				},
				methods: {
					onActiveItem(e) {
						this.$store.commit("activeChat", e),
							(this.isAIChat = !1),
							(this.selectedAIChat = null),
							this.detectPCTerminalChat()
					},
					detectPCTerminalChat() {
						if (
							(console.log("[EditorChatPlugin] detectPCTerminalChat 开始检测"),
							console.log("[EditorChatPlugin] activeChat:", this.chatStore.activeChat),
							!this.chatStore.activeChat)
						)
							return (
								console.log("[EditorChatPlugin] 没有活跃会话，isPCTerminalChat = false"),
								void (this.isPCTerminalChat = !1)
							)
						const e = this.chatStore.activeChat.targetId
						console.log("[EditorChatPlugin] 会话信息:", {
							targetId: e,
							showName: this.chatStore.activeChat.showName,
						}),
							e && e.includes("_3")
								? ((this.isPCTerminalChat = !0),
									console.log("[EditorChatPlugin] 检测到PC终端会话 (targetId包含_3)，显示容器管理"))
								: ((this.isPCTerminalChat = !1),
									console.log("[EditorChatPlugin] 非PC终端会话，不显示容器管理")),
							console.log("[EditorChatPlugin] 最终 isPCTerminalChat =", this.isPCTerminalChat)
					},
					onDelItem(e) {
						this.$store.commit("removeChat", e)
					},
					onTop(e) {
						this.$store.commit("moveTop", e)
					},
					getCurrentChatId() {
						return this.isAIChat && this.selectedAIChat
							? this.selectedAIChat.aiThreadId || this.selectedAIChat.id
							: this.chatStore.activeChat
								? this.chatStore.activeChat.id || this.chatStore.activeChat.targetId
								: this.currentSessionId
					},
					onAIChatSelected(e) {
						We["a"].info("EditorChat", "收到AI聊天选择:", e.showName),
							(this.selectedAIChat = e),
							(this.isAIChat = !0),
							this.$store.commit("clearActiveChat"),
							this.initializeThinkingSession()
					},
					handleEnsurePanelVisible(e) {
						console.log("[EditorChat] 🔧 收到确保面板可见事件:", e)
						const { sessionType: t, sessionData: s, reason: i } = e
						this.shouldEnsurePanelVisible(t, s)
							? this.ensureChatRecordVisible(t, s, i)
							: console.log("[EditorChat] 🔧 无需确保面板可见，条件不满足")
					},
					shouldEnsurePanelVisible(e, t) {
						return "IM" === e
							? !this.chatStore.activeChat || this.chatStore.activeChat.targetId !== (t.targetId || t.id)
							: "AI" !== e || !this.selectedAIChat || this.selectedAIChat.id !== t.id
					},
					ensureChatRecordVisible(e, t, s) {
						console.log(
							`[EditorChat] 🔧 确保${e}聊天记录可见:`,
							(null === t || void 0 === t ? void 0 : t.showName) ||
								(null === t || void 0 === t ? void 0 : t.name),
						),
							"IM" === e && this.ensureIMChatVisible(t, s),
							this.$nextTick(() => {
								console.log("[EditorChat] 🔧 Vue响应式更新完成，面板应该已可见")
							})
					},
					ensureIMChatVisible(e, t) {
						this.isAIChat &&
							((this.isAIChat = !1),
							(this.selectedAIChat = null),
							console.log("[EditorChat] 🔧 已切换到IM模式"))
					},
					jumpToProMode(e) {
						var t
						;(console.log("跳转到React专业模式:", e), window.postMessage) &&
							window.postMessage(
								{
									type: "OPEN_AI_PRO_MODE",
									messageId: e,
									threadId:
										null === (t = this.selectedAIChat) || void 0 === t ? void 0 : t.aiThreadId,
								},
								"*",
							)
						if (window.SharedServicesAccessor && window.SharedServicesAccessor.openAIProMode)
							try {
								var s
								window.SharedServicesAccessor.openAIProMode({
									messageId: e,
									threadId:
										null === (s = this.selectedAIChat) || void 0 === s ? void 0 : s.aiThreadId,
								})
							} catch (i) {
								console.error("打开AI专业模式失败:", i)
							}
					},
					async downloadArtifact(e) {
						console.log("下载构件到工作区:", e)
						try {
							var t, s
							if (
								(null === (t = this.$message) || void 0 === t || t.success("正在下载：" + e.title),
								window.SharedServicesAccessor && window.SharedServicesAccessor.downloadToWorkspace)
							)
								await window.SharedServicesAccessor.downloadToWorkspace(e),
									null === (s = this.$message) ||
										void 0 === s ||
										s.success("已下载到工作区：" + e.title)
						} catch (o) {
							var i
							null === (i = this.$message) || void 0 === i || i.error("下载失败"),
								console.error("下载构件失败:", o)
						}
					},
					initializeThinkingSession() {
						;(this.currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
							We["a"].debug("EditorChat", "初始化思维会话:", this.currentSessionId)
					},
					toggleThinkingPanel() {
						;(this.showThinkingPanel = !this.showThinkingPanel),
							this.showThinkingPanel ? this.resumeThinkingAnalysis() : this.pauseThinkingAnalysis()
					},
					pauseThinkingAnalysis() {
						console.log("暂停思维链分析"), (this.assistantStatus = "idle")
					},
					resumeThinkingAnalysis() {
						console.log("恢复思维链分析"), (this.assistantStatus = "active")
					},
					onRealtimeModeChanged(e) {
						console.log("实时模式变化:", e), (this.settings.showRealtime = e)
					},
					onDashboardDataRefreshed(e) {
						console.log("仪表盘数据已刷新:", e)
					},
					onChainSelected(e) {
						console.log("选择思维链:", e), (this.activeTab = "chain")
					},
					analyzeCurrentConversation() {
						;(this.assistantStatus = "analyzing"),
							setTimeout(() => {
								;(this.assistantStatus = "active"),
									this.addInsight({
										id: "insight_" + Date.now(),
										icon: "🔍",
										title: "对话分析完成",
										description: this.isAIChat
											? "当前AI对话显示复杂的技术讨论模式"
											: "当前对话显示用户关注代码质量和性能优化",
										priority: "high",
									})
							}, 2e3)
					},
					suggestResponse() {
						console.log("生成回复建议"),
							this.addInsight({
								id: "insight_" + Date.now(),
								icon: "💬",
								title: "回复建议",
								description: this.isAIChat
									? "建议简化AI回复，突出关键信息"
									: "建议提供具体的代码示例和性能对比数据",
								priority: "medium",
							})
					},
					optimizeThinking() {
						console.log("优化思维链"),
							this.addInsight({
								id: "insight_" + Date.now(),
								icon: "⚡",
								title: "思维链优化",
								description: "已优化决策分支，提升思维效率15%",
								priority: "low",
							})
					},
					exportInsights() {
						const e = {
								sessionId: this.currentSessionId,
								chatType: this.isAIChat ? "ai" : "human",
								chatInfo: this.isAIChat ? this.selectedAIChat : this.chatStore.activeChat,
								timestamp: Date.now(),
								insights: this.aiInsights,
								settings: this.settings,
							},
							t = JSON.stringify(e, null, 2),
							s = new Blob([t], { type: "application/json" }),
							i = URL.createObjectURL(s),
							o = document.createElement("a")
						;(o.href = i),
							(o.download = `ai-insights-${Date.now()}.json`),
							o.click(),
							URL.revokeObjectURL(i)
					},
					addInsight(e) {
						this.aiInsights.unshift(e),
							this.aiInsights.length > 10 && (this.aiInsights = this.aiInsights.slice(0, 10))
					},
					submitFeedback() {
						var e, t
						this.feedbackText.trim()
							? (console.log("提交反馈:", this.feedbackText),
								null === (e = this.$message) || void 0 === e || e.success("反馈已提交，感谢您的建议！"),
								(this.feedbackText = ""))
							: null === (t = this.$message) || void 0 === t || t.warning("请输入反馈内容")
					},
					updateSettings() {
						console.log("更新设置:", this.settings),
							localStorage.setItem("thinking_settings", JSON.stringify(this.settings))
					},
					resetSettings() {
						var e
						;(this.settings = {
							showRealtime: !0,
							autoExpand: !0,
							showConfidence: !0,
							analysisDepth: "detailed",
							updateInterval: "3000",
							exportFormat: "json",
						}),
							this.updateSettings(),
							null === (e = this.$message) || void 0 === e || e.success("设置已重置")
					},
					saveSettings() {
						var e
						this.updateSettings(), null === (e = this.$message) || void 0 === e || e.success("设置已保存")
					},
					loadSettings() {
						const e = localStorage.getItem("thinking_settings")
						if (e)
							try {
								this.settings = { ...this.settings, ...JSON.parse(e) }
							} catch (t) {
								console.error("加载设置失败:", t)
							}
					},
					setupEventListeners() {
						this.$bus && this.$bus.$on("chat:message:sent", this.onMessageSent),
							this.$bus && this.$bus.$on("chat:message:received", this.onMessageReceived),
							this.$bus && this.$bus.$on("thinking:chain:updated", this.onThinkingChainUpdated),
							this.$bus && this.$bus.$on("ai:chat:selected", this.onAIChatSelected),
							this.$bus && this.$bus.$on("chat:ensure-panel-visible", this.handleEnsurePanelVisible),
							this.$bus &&
								this.$bus.$on("test:panel:debug", (e) => {
									console.log("[EditorChat] 🔧 收到测试事件:", e)
								}),
							this.setupUnifiedSessionListener()
					},
					cleanupEventListeners() {
						this.$bus &&
							(this.$bus.$off("chat:message:sent", this.onMessageSent),
							this.$bus.$off("chat:message:received", this.onMessageReceived),
							this.$bus.$off("thinking:chain:updated", this.onThinkingChainUpdated),
							this.$bus.$off("ai:chat:selected", this.onAIChatSelected),
							this.$bus.$off("chat:ensure-panel-visible", this.handleEnsurePanelVisible)),
							this.unifiedSessionUnsubscribe &&
								(this.unifiedSessionUnsubscribe(), (this.unifiedSessionUnsubscribe = null))
					},
					onMessageSent(e) {
						console.log("消息已发送:", e),
							this.settings.showRealtime && this.triggerThinkingAnalysis("user_message", e)
					},
					onMessageReceived(e) {
						console.log("消息已接收:", e),
							"ai_response" === e.type &&
								this.settings.showRealtime &&
								this.triggerThinkingAnalysis("ai_response", e)
					},
					onThinkingChainUpdated(e) {
						console.log("思维链已更新:", e)
					},
					triggerThinkingAnalysis(e, t) {
						console.log("触发思维分析:", e, t),
							this.$bus &&
								this.$bus.$emit("ai:thinking:start", {
									type: e,
									data: t,
									preview: this.isAIChat ? "正在分析AI对话内容..." : "正在分析消息内容...",
								}),
							setTimeout(() => {
								this.$bus &&
									this.$bus.$emit("ai:thinking:node", {
										id: "node_" + Date.now(),
										type: "analysis",
										title: this.isAIChat ? "AI对话分析" : "消息分析",
										description: this.isAIChat
											? "分析AI回复的复杂度和用户满意度"
											: "分析消息的语义和用户意图",
										confidence: 0.85,
										duration: 1200,
									})
							}, 1e3),
							setTimeout(() => {
								this.$bus && this.$bus.$emit("ai:thinking:complete")
							}, 3e3)
					},
					async handleFileSend(e) {
						if ((console.log("[EditorChat] handleFileSend called with:", e), this.$vscode))
							try {
								var t, s
								if (!window.SharedServicesAccessor)
									return void console.warn("[EditorChat] SharedServicesAccessor not available")
								const i = window.SharedServicesAccessor.getChatThreadsService
										? this.protectVSCodeService(
												window.SharedServicesAccessor.getChatThreadsService(),
												"ChatThreadsService",
											)
										: null,
									o =
										(this.protectVSCodeService(
											null === (t = this.$vscode) || void 0 === t
												? void 0
												: t.get("IFileService"),
											"IFileService",
										),
										this.protectVSCodeService(
											null === (s = this.$vscode) || void 0 === s
												? void 0
												: s.get("INotificationService"),
											"INotificationService",
										))
								console.log("[EditorChat] VSCode services obtained successfully")
								const n = this.getCurrentSessionInfo()
								console.log("[EditorChat] Current session info:", n),
									await this.saveFileToSession(e, n),
									await i.refreshFiles(),
									o.info("文件已保存到工作区: " + e.file.name),
									console.log("[EditorChat] File saved successfully to workspace")
							} catch (i) {
								if ((console.error("[EditorChat] 文件保存失败:", i), this.$vscode))
									try {
										const e = this.protectVSCodeService(
											this.$vscode.get("INotificationService"),
											"INotificationService",
										)
										null === e || void 0 === e || e.error("文件保存失败: " + i.message)
									} catch (o) {
										console.warn("[EditorChat] 无法发送错误通知:", o)
									}
							}
						else console.warn("[EditorChat] $vscode service not available")
					},
					getCurrentSessionInfo() {
						if (this.isAIChat && this.selectedAIChat)
							return {
								id: this.selectedAIChat.aiThreadId || this.selectedAIChat.id,
								targetId: this.selectedAIChat.aiThreadId || this.selectedAIChat.id,
								type: "PRIVATE",
								name: this.selectedAIChat.showName || "AI对话",
								showName: this.selectedAIChat.showName || "AI对话",
								participants: ["AI"],
							}
						if (this.chatStore.activeChat)
							return {
								id: this.chatStore.activeChat.id || this.chatStore.activeChat.targetId,
								targetId: this.chatStore.activeChat.targetId,
								type: this.chatStore.activeChat.type || "PRIVATE",
								name: this.chatStore.activeChat.showName || "聊天",
								showName: this.chatStore.activeChat.showName || "聊天",
								headImage: this.chatStore.activeChat.headImage || "",
								participants: [this.chatStore.activeChat.targetId],
							}
						const e = this.currentSessionId || "session_" + Date.now()
						return {
							id: e,
							targetId: e,
							type: "PRIVATE",
							name: "当前会话",
							showName: "当前会话",
							headImage: "",
							participants: [],
						}
					},
					async saveFileToSession(e, t) {
						if (window.SharedServicesAccessor)
							try {
								const s = e.file
								console.log("[EditorChat] 开始文件上传:", {
									fileName: s.name,
									size: s.size,
									type: s.type,
								})
								const i = await window.SharedServicesAccessor.uploadFileToSession(s, t)
								if (i.success) return console.log("[EditorChat] ✅ 文件上传成功:", i), i.filePath
								throw (
									(console.error("[EditorChat] ❌ 文件上传失败:", i), new Error(i.error || i.message))
								)
							} catch (s) {
								throw (console.error("[EditorChat] 文件上传异常:", s), s)
							}
						else console.warn("[EditorChat] SharedServicesAccessor not available")
					},
					generateSessionPath(e) {
						const t = e.name.replace(/[<>:"/\\|?*]/g, "_"),
							s = new Date().toISOString().slice(0, 10)
						return `chat_sessions/${e.type}/${t}_${e.id}_${s}`
					},
					generateSafeFileName(e) {
						return e.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
					},
					readFileContent(e) {
						return new Promise((t, s) => {
							const i = new FileReader()
							;(i.onload = () => t(i.result)), (i.onerror = s), i.readAsArrayBuffer(e)
						})
					},
					async fixVSCodeServices() {
						var e, t
						if (
							(console.log("[EditorChat] Fixing VSCode services..."),
							console.log("[EditorChat] Current $vscode type:", typeof this.$vscode),
							console.log(
								"[EditorChat] Current $vscode.get type:",
								typeof (null === (e = this.$vscode) || void 0 === e ? void 0 : e.get),
							),
							console.log(
								"[EditorChat] window.SharedServicesAccessor available:",
								!!window.SharedServicesAccessor,
							),
							this.$vscode &&
								"object" === typeof this.$vscode &&
								Object.defineProperty(this, "$vscode", {
									value: this.$vscode,
									writable: !0,
									enumerable: !1,
									configurable: !0,
								}),
							window.SharedServicesAccessor ||
								(console.log("[EditorChat] SharedServicesAccessor not available, waiting..."),
								await this.waitForSharedServicesAccessor()),
							window.SharedServicesAccessor &&
								!window.SharedServicesAccessor.isInitialized() &&
								(console.log("[EditorChat] SharedServicesAccessor not initialized, waiting..."),
								await window.SharedServicesAccessor.waitForInitialization()),
							(!this.$vscode || "function" !== typeof this.$vscode.get) &&
								null !== (t = window.SharedServicesAccessor) &&
								void 0 !== t &&
								t.isInitialized())
						) {
							console.log("[EditorChat] Reinitializing $vscode with SharedServicesAccessor...")
							class e {
								constructor() {}
								get(e) {
									var t
									return null === (t = window.SharedServicesAccessor) || void 0 === t
										? void 0
										: t.get(e)
								}
								saveFileToWorkspace(...e) {
									var t
									return null === (t = this.get("IChatWorkspaceService")) || void 0 === t
										? void 0
										: t.saveFileToWorkspace(...e)
								}
								showNotification(...e) {
									var t
									return null === (t = this.get("INotificationService")) || void 0 === t
										? void 0
										: t.info(...e)
								}
							}
							const t = new e()
							Object.defineProperty(this, "$vscode", {
								value: t,
								writable: !0,
								enumerable: !1,
								configurable: !0,
							}),
								window.Vue &&
									window.Vue.prototype &&
									Object.defineProperty(window.Vue.prototype, "$vscode", {
										value: t,
										writable: !0,
										enumerable: !1,
										configurable: !0,
									}),
								console.log("[EditorChat] $vscode reinitialized successfully"),
								console.log("[EditorChat] $vscode.get type after fix:", typeof this.$vscode.get)
						}
						setTimeout(() => {
							this.validateVSCodeServices()
						}, 1e3)
					},
					async waitForSharedServicesAccessor() {
						console.log("[EditorChat] Waiting for SharedServicesAccessor to be created...")
						let e = 0
						const t = 100
						while (!window.SharedServicesAccessor && e < t)
							await new Promise((e) => setTimeout(e, 100)), e++
						window.SharedServicesAccessor
							? console.log("[EditorChat] SharedServicesAccessor found after", 100 * e, "ms")
							: console.warn("[EditorChat] SharedServicesAccessor not found after", 100 * t, "ms")
					},
					validateVSCodeServices() {
						console.log("[EditorChat] Validating VSCode services...")
						try {
							if (this.$vscode && "function" === typeof this.$vscode.get) {
								const e = this.$vscode.get("IFileService"),
									t = this.$vscode.get("INotificationService")
								console.log("[EditorChat] IFileService available:", !!e),
									console.log("[EditorChat] INotificationService available:", !!t),
									e && t
										? console.log("[EditorChat] ✅ VSCode services validation successful")
										: console.warn("[EditorChat] ⚠️ Some VSCode services are not available")
							} else console.error("[EditorChat] ❌ $vscode.get method is not available")
						} catch (e) {
							console.error("[EditorChat] ❌ VSCode services validation failed:", e)
						}
					},
					protectVSCodeService(e, t = "service") {
						if (!e || "object" !== typeof e) return e
						try {
							return new Proxy(e, {
								get(e, s) {
									if ("symbol" !== typeof s && s !== Symbol.toStringTag)
										try {
											const t = e[s]
											return "function" === typeof t ? t.bind(e) : t
										} catch (i) {
											return void console.warn(`[EditorChat] 🛡️ 访问 ${t}.${s} 失败:`, i)
										}
									else console.debug("[EditorChat] 🛡️ 阻止访问 Symbol 属性:", s.toString())
								},
								ownKeys(e) {
									try {
										return Object.getOwnPropertyNames(e).filter(
											(e) => "string" === typeof e && !e.startsWith("_"),
										)
									} catch (s) {
										return console.warn(`[EditorChat] 🛡️ 获取 ${t} 属性列表失败:`, s), []
									}
								},
								getOwnPropertyDescriptor(e, t) {
									if ("symbol" !== typeof t)
										try {
											return Object.getOwnPropertyDescriptor(e, t)
										} catch (s) {
											return
										}
								},
							})
						} catch (s) {
							return console.warn(`[EditorChat] 🛡️ 创建 ${t} 保护代理失败:`, s), e
						}
					},
					setupFileDragDrop() {
						console.log("[EditorChat] 🎯 设置统一的文件拖拽管理（父级组件统一处理）"),
							(this.globalDragListeners = {
								handleDragEnter: (e) => {
									this.isDragTargetInChatArea(e.target) &&
										(e.preventDefault(),
										e.stopPropagation(),
										e.stopImmediatePropagation(),
										console.log("[EditorChat] 🎯 拦截dragenter - 目标在聊天区域"),
										this.handleDragEnter(e))
								},
								handleDragOver: (e) => {
									this.isDragTargetInChatArea(e.target) &&
										(e.preventDefault(),
										e.stopPropagation(),
										e.stopImmediatePropagation(),
										(e.dataTransfer.dropEffect = "copy"),
										console.log("[EditorChat] 🎯 拦截dragover - 目标在聊天区域"))
								},
								handleDragLeave: (e) => {
									this.isDragTargetInChatArea(e.target) &&
										(e.preventDefault(),
										e.stopPropagation(),
										e.stopImmediatePropagation(),
										console.log("[EditorChat] 🎯 拦截dragleave - 目标在聊天区域"),
										this.handleDragLeave(e))
								},
								handleDrop: (e) => {
									this.isDragTargetInChatArea(e.target) &&
										(e.preventDefault(),
										e.stopPropagation(),
										e.stopImmediatePropagation(),
										console.log("[EditorChat] 🎯 拦截drop - 目标在聊天区域，完全阻止VSCode处理"),
										this.handleFileDropToComponent(e))
								},
							}),
							document.addEventListener("dragenter", this.globalDragListeners.handleDragEnter, !0),
							document.addEventListener("dragover", this.globalDragListeners.handleDragOver, !0),
							document.addEventListener("dragleave", this.globalDragListeners.handleDragLeave, !0),
							document.addEventListener("drop", this.globalDragListeners.handleDrop, !0),
							console.log("[EditorChat] ✅ 统一拖拽管理已设置 - 智能分发到聊天区域")
					},
					isDragTargetInChatArea(e) {
						if (!this.$el || !e) return !1
						const t = this.$el.contains(e)
						if (t) {
							const t = this.$el.querySelector(".chat-box"),
								s = this.$el.querySelector(".chat-input-area"),
								i = this.$el.querySelector(".drag-overlay"),
								o = t && t.contains(e),
								n = s && s.contains(e),
								a = i && i.contains(e)
							return o || n || a
						}
						return !1
					},
					handleFileDropToComponent(e) {
						const t = e.target,
							s = e.dataTransfer.files
						console.log("[EditorChat] 🎯 智能分发文件拖拽，文件数量:", s.length)
						const i = this.$el.querySelector(".chat-input-area")
						if (i && i.contains(t)) {
							console.log("[EditorChat] 🎯 分发到ChatInput组件处理")
							const e =
								this.$refs.chatBox || this.$children.find((e) => "chatPrivate" === e.$options.name)
							if (e && e.$refs && e.$refs.chatInputEditor) {
								const t = e.$refs.chatInputEditor
								if (t && "function" === typeof t.handleDroppedFiles)
									return (t.isDragOver = !1), (t.dragCounter = 0), void t.handleDroppedFiles(s)
							}
						}
						console.log("[EditorChat] 🎯 使用EditorChat通用文件处理"), this.handleFileDrop(e)
					},
					removeGlobalDragListeners() {
						this.globalDragListeners &&
							(console.log("[EditorChat] 🧹 清理统一拖拽监听器"),
							document.removeEventListener("dragenter", this.globalDragListeners.handleDragEnter, !0),
							document.removeEventListener("dragover", this.globalDragListeners.handleDragOver, !0),
							document.removeEventListener("dragleave", this.globalDragListeners.handleDragLeave, !0),
							document.removeEventListener("drop", this.globalDragListeners.handleDrop, !0),
							(this.globalDragListeners = null))
					},
					handleDragOver(e) {
						e.preventDefault(),
							e.stopPropagation(),
							e.stopImmediatePropagation(),
							(e.dataTransfer.dropEffect = "copy"),
							console.log("[EditorChat] Vue组件拦截dragover事件，阻止VSCode处理")
					},
					handleDragEnter(e) {
						e.preventDefault(),
							e.stopPropagation(),
							e.stopImmediatePropagation(),
							console.log("[EditorChat] Vue组件拦截dragenter事件，阻止VSCode处理"),
							this.hasFiles(e.dataTransfer) && (this.showDragHint(), this.addDragOverClass())
					},
					handleDragLeave(e) {
						e.preventDefault(),
							e.stopPropagation(),
							e.stopImmediatePropagation(),
							console.log("[EditorChat] Vue组件拦截dragleave事件，阻止VSCode处理"),
							this.$el.contains(e.relatedTarget) || (this.hideDragHint(), this.removeDragOverClass())
					},
					async handleFileDrop(e) {
						e.preventDefault(),
							e.stopPropagation(),
							e.stopImmediatePropagation(),
							console.log("[EditorChat] 🎯 Vue组件接收到拖拽事件，立即阻止传播"),
							console.log("[EditorChat] Event target:", e.target),
							console.log("[EditorChat] Event currentTarget:", e.currentTarget),
							this.hideDragHint(),
							this.removeDragOverClass(),
							console.log("[EditorChat] Drop event received:", {
								dataTransfer: e.dataTransfer,
								types: Array.from(e.dataTransfer.types),
								files: e.dataTransfer.files,
								filesLength: e.dataTransfer.files.length,
								items: e.dataTransfer.items,
								itemsLength: e.dataTransfer.items ? e.dataTransfer.items.length : 0,
							})
						const t = Array.from(e.dataTransfer.files)
						if (0 === t.length) {
							if (
								(console.log("[EditorChat] No files in drop event, checking items..."),
								e.dataTransfer.items && e.dataTransfer.items.length > 0)
							) {
								const t = []
								for (let s = 0; s < e.dataTransfer.items.length; s++) {
									const i = e.dataTransfer.items[s]
									if ((console.log("[EditorChat] Item:", i.kind, i.type), "file" === i.kind)) {
										const e = i.getAsFile()
										e && t.push(e)
									}
								}
								if (t.length > 0)
									return (
										console.log("[EditorChat] Found files in items:", t),
										void (await this.processDroppedFiles(t))
									)
							}
							console.log("[EditorChat] 开始解析VSCode拖拽数据...")
							const t = await this.parseVSCodeDragData(e.dataTransfer)
							return t.length > 0
								? (console.log("[EditorChat] 解析出VSCode拖拽文件路径:", t.length, "个"),
									void (await this.handleVSCodeFilePaths(t)))
								: (console.warn("[EditorChat] No files found in drop event"),
									void this.showErrorNotification("未检测到文件，请确保拖拽的是文件而不是文本"))
						}
						console.log(
							"[EditorChat] Files dropped:",
							t.map((e) => ({ name: e.name, size: e.size })),
						)
						const s = this.getCurrentSessionInfo()
						if (!s || !s.id) return void this.showSessionSelectionRequired()
						const i = await this.confirmFileSend(t, s)
						i && (await this.processDroppedFiles(t))
					},
					async parseVSCodeDragData(e) {
						const t = []
						console.log("[EditorChat] 🔍 开始解析VSCode拖拽数据，可用类型:", Array.from(e.types))
						const s =
							e.getData("application/vnd.code.uri-list") ||
							e.getData("application/vnd.code.tree.resourcecontext")
						if (s) {
							console.log("[EditorChat] 🔗 获取到内部URI数据:", s)
							try {
								if (s.includes("\n") || s.includes("file://")) {
									const e = s.split(/[\r\n]+/).filter((e) => e.trim() && !e.startsWith("#"))
									for (const s of e) {
										const e = s.replace("file://", "")
										t.push(e)
									}
								} else {
									const e = JSON.parse(s)
									if (Array.isArray(e))
										for (const s of e)
											if (s.uri) {
												const e = s.uri.replace("file://", "")
												t.push(e)
											} else if ("string" === typeof s) {
												const e = s.replace("file://", "")
												t.push(e)
											}
								}
							} catch (o) {
								console.warn("[EditorChat] 解析内部URI数据失败:", o)
							}
						}
						if (0 === t.length) {
							const s = e.getData("application/vnd.code.resources")
							if (s) {
								console.log("[EditorChat] 🔗 获取到resources数据:", s)
								try {
									const e = JSON.parse(s)
									if (Array.isArray(e))
										for (const s of e)
											if ("string" === typeof s) {
												const e = s.replace("file://", "")
												t.push(e)
											} else if (s.uri) {
												const e = s.uri.replace("file://", "")
												t.push(e)
											}
								} catch (o) {
									console.warn("[EditorChat] 解析resources数据失败:", o)
								}
							}
						}
						if (0 === t.length) {
							const s = e.getData("codefiles") || e.getData("application/vnd.code.files")
							if (s) {
								console.log("[EditorChat] 🔗 获取到CodeFiles:", s)
								try {
									const e = JSON.parse(s)
									Array.isArray(e) && t.push(...e)
								} catch (o) {
									console.warn("[EditorChat] 解析CodeFiles失败:", o)
								}
							}
						}
						if (0 === t.length) {
							const s = e.getData("text/uri-list")
							if (s) {
								console.log("[EditorChat] 🔗 获取到text/uri-list:", s)
								const e = s.split(/[\r\n]+/).filter((e) => e.trim() && !e.startsWith("#"))
								for (const s of e) {
									const e = s.replace("file://", "")
									t.push(e)
								}
							}
						}
						if (0 === t.length) {
							const s = e.getData("text/plain")
							if (
								s &&
								(console.log("[EditorChat] 🔗 获取到text/plain:", s),
								s.includes("/") || s.includes("\\"))
							) {
								if (s.startsWith("{") || s.startsWith("["))
									try {
										const e = JSON.parse(s)
										Array.isArray(e) ? t.push(...e) : (e.path || e.uri) && t.push(e.path || e.uri)
									} catch (o) {
										console.log("[EditorChat] 不是JSON数据，按行分割处理")
									}
								if (0 === t.length) {
									const e = s
										.split("\n")
										.filter((e) => e.trim() && (e.includes("/") || e.includes("\\")))
									t.push(...e)
								}
							}
						}
						const i = t
							.map((e) => e.trim())
							.filter((e) => e && "" !== e)
							.map((e) => e.replace(/^file:\/\//, ""))
							.filter((e, t, s) => s.indexOf(e) === t)
						return console.log("[EditorChat] 🎯 最终解析出文件路径:", i.length, "个:", i), i
					},
					async handleVSCodeFilePaths(e) {
						if ((console.log("[EditorChat] 🚀 处理VSCode文件路径:", e.length, "个"), 0 !== e.length))
							if (window.SharedServicesAccessor && window.SharedServicesAccessor.uploadFilesFromPaths)
								try {
									this.showFileProcessingProgress(e.length)
									const t = this.getCurrentSessionInfo()
									if (!t) throw new Error("未找到当前会话信息")
									console.log("[EditorChat] 开始从路径批量上传文件:", e)
									const s = await window.SharedServicesAccessor.uploadFilesFromPaths(e, t)
									let i = 0,
										o = 0
									for (const e of s)
										e.success
											? (i++, console.log("[EditorChat] ✅ 文件上传和消息同步成功:", e.message))
											: (o++,
												console.error("[EditorChat] ❌ 文件上传失败:", e),
												this.$message && this.$message.error(e.message))
									i > 0 && this.showSuccessNotification(i),
										o > 0 && console.error(`[EditorChat] ${o} 个文件上传失败`),
										this.hideFileProcessingProgress()
								} catch (t) {
									console.error("[EditorChat] 批量路径文件上传失败:", t),
										this.hideFileProcessingProgress(),
										this.showErrorNotification("文件上传失败: " + t.message)
								}
							else this.showErrorNotification("VSCode服务不可用，无法处理文件拖拽")
						else this.showErrorNotification("无法解析拖拽的文件路径")
					},
					async processDroppedFiles(e) {
						console.log("[EditorChat] Processing dropped files...")
						const t = e.filter(
							(e) =>
								0 !== e.size ||
								(this.$message && this.$message.warning(`文件 ${e.name} 为空，已跳过`), !1),
						)
						if (0 !== t.length)
							try {
								this.showFileProcessingProgress(t.length)
								const e = this.getCurrentSessionInfo()
								if (!e) throw new Error("未找到当前会话信息")
								if (
									window.SharedServicesAccessor &&
									window.SharedServicesAccessor.uploadFilesToSession
								) {
									console.log("[EditorChat] 开始批量文件上传:", t.length, "个文件")
									const s = await window.SharedServicesAccessor.uploadFilesToSession(t, e)
									let i = 0,
										o = 0
									for (const e of s)
										e.success
											? (i++, console.log("[EditorChat] ✅ 文件上传成功:", e.message))
											: (o++,
												console.error("[EditorChat] ❌ 文件上传失败:", e),
												this.$message && this.$message.error(e.message))
									i > 0 && this.showSuccessNotification(i),
										o > 0 && console.error(`[EditorChat] ${o} 个文件上传失败`)
								} else {
									console.log("[EditorChat] 降级为逐个处理文件")
									for (const e of t)
										console.log("[EditorChat] Processing file:", e.name),
											await this.handleFileSend({
												file: e,
												fileName: e.name,
												fileSize: e.size,
												fileType: e.type,
											})
									this.showSuccessNotification(t.length)
								}
								this.hideFileProcessingProgress()
							} catch (s) {
								console.error("[EditorChat] File processing failed:", s),
									this.hideFileProcessingProgress(),
									this.showErrorNotification(s.message)
							}
						else console.log("[EditorChat] 没有有效文件需要上传")
					},
					hasFiles(e) {
						if (!e) return !1
						if (e.files && e.files.length > 0)
							return console.log("[EditorChat] Found files in dataTransfer.files"), !0
						if (e.types) {
							const t = e.types.includes("Files") || e.types.includes("application/x-vscode-file")
							if (t) return console.log("[EditorChat] Found file types in dataTransfer.types"), !0
						}
						if (e.items && e.items.length > 0)
							for (let t = 0; t < e.items.length; t++) {
								const s = e.items[t]
								if ("file" === s.kind)
									return console.log("[EditorChat] Found file in dataTransfer.items"), !0
							}
						return e.types && e.types.includes("text/plain")
							? (console.log("[EditorChat] Found text data, might be VSCode file paths"), !0)
							: (console.log("[EditorChat] No files detected in dataTransfer"), !1)
					},
					showDragHint() {
						var e
						if (this.dragHintElement) return
						const t = document.createElement("div")
						;(t.className = "file-drag-hint"),
							(t.innerHTML = `\n        <div class="drag-hint-content">\n          <div class="drag-hint-icon">📁</div>\n          <div class="drag-hint-text">拖拽文件到此处发送到聊天</div>\n          <div class="drag-hint-session">${(null === (e = this.getCurrentSessionInfo()) || void 0 === e ? void 0 : e.name) || "当前会话"}</div>\n        </div>\n      `),
							this.$el.appendChild(t),
							(this.dragHintElement = t)
					},
					hideDragHint() {
						this.dragHintElement && (this.dragHintElement.remove(), (this.dragHintElement = null))
					},
					addDragOverClass() {
						this.$el.classList.add("file-drag-over")
					},
					removeDragOverClass() {
						this.$el.classList.remove("file-drag-over")
					},
					async confirmFileSend(e, t) {
						const s = e.map((e) => `• ${e.name} (${this.formatFileSize(e.size)})`).join("\n")
						if (!this.$confirm) return confirm(`确认发送 ${e.length} 个文件到 "${t.name}"？\n\n${s}`)
						try {
							return (
								await this.$confirm(
									`确认发送 ${e.length} 个文件到 "${t.name}"？\n\n${s}`,
									"确认文件发送",
									{ confirmButtonText: "发送", cancelButtonText: "取消", type: "info" },
								),
								!0
							)
						} catch {
							return !1
						}
					},
					showSessionSelectionRequired() {
						const e = "请先选择一个聊天会话，然后再拖拽文件"
						if (this.$message) this.$message.warning(e)
						else if (this.$vscode) {
							const t = this.protectVSCodeService(
								this.$vscode.get("INotificationService"),
								"INotificationService",
							)
							null === t || void 0 === t || t.warn(e)
						} else alert(e)
					},
					showFileProcessingProgress(e) {
						console.log(`[EditorChat] 开始处理 ${e} 个文件...`)
					},
					hideFileProcessingProgress() {
						this.processingMessage && (this.processingMessage.close(), (this.processingMessage = null))
					},
					showSuccessNotification(e) {
						const t = `✅ 成功发送 ${e} 个文件到聊天`
						if (this.$message) this.$message.success(t)
						else if (this.$vscode) {
							const e = this.protectVSCodeService(
								this.$vscode.get("INotificationService"),
								"INotificationService",
							)
							null === e || void 0 === e || e.info(t)
						}
					},
					showErrorNotification(e) {
						const t = "❌ 文件发送失败: " + e
						if (this.$message) this.$message.error(t)
						else if (this.$vscode) {
							const e = this.protectVSCodeService(
								this.$vscode.get("INotificationService"),
								"INotificationService",
							)
							null === e || void 0 === e || e.error(t)
						}
					},
					formatFileSize(e) {
						if (0 === e) return "0 Bytes"
						const t = 1024,
							s = ["Bytes", "KB", "MB", "GB"],
							i = Math.floor(Math.log(e) / Math.log(t))
						return parseFloat((e / Math.pow(t, i)).toFixed(2)) + " " + s[i]
					},
					cleanupFileDragDrop() {
						var e, t
						const s = [
							this.$el,
							null === (e = this.$el) || void 0 === e ? void 0 : e.querySelector(".chat-box"),
							null === (t = this.$el) || void 0 === t ? void 0 : t.querySelector(".chat-page"),
						].filter(Boolean)
						s.forEach((e) => {
							e &&
								(e.removeEventListener("dragover", this.handleDragOver, { capture: !0 }),
								e.removeEventListener("dragenter", this.handleDragEnter, { capture: !0 }),
								e.removeEventListener("dragleave", this.handleDragLeave, { capture: !0 }),
								e.removeEventListener("drop", this.handleFileDrop, { capture: !0 }))
						}),
							this.hideDragHint()
					},
					setupUnifiedSessionListener() {
						console.log("[EditorChat] 🔧 开始设置统一会话服务监听器")
						try {
							var e, t, s
							let i = null
							if (
								(this.$vscode &&
									this.$vscode.get &&
									(console.log("[EditorChat] 🔧 尝试通过$vscode.get获取统一会话服务..."),
									(i = this.$vscode.get("IUnifiedSessionService")),
									console.log("[EditorChat] 🔧 通过$vscode.get获取结果:", !!i)),
								!i &&
									window.SharedServicesAccessor &&
									(console.log("[EditorChat] 🔧 尝试通过SharedServicesAccessor获取统一会话服务..."),
									(i = window.SharedServicesAccessor.get("IUnifiedSessionService")),
									console.log("[EditorChat] 🔧 通过SharedServicesAccessor获取结果:", !!i)),
								!i &&
									null !== (e = window.vscode) &&
									void 0 !== e &&
									e.services &&
									(console.log("[EditorChat] 🔧 尝试通过全局vscode.services获取统一会话服务..."),
									(i = window.vscode.services.get("IUnifiedSessionService")),
									console.log("[EditorChat] 🔧 通过全局vscode.services获取结果:", !!i)),
								!i &&
									window.unifiedSessionService &&
									(console.log("[EditorChat] 🔧 尝试从全局对象获取统一会话服务..."),
									(i = window.unifiedSessionService),
									console.log("[EditorChat] 🔧 从全局对象获取结果:", !!i)),
								console.log("[EditorChat] 🔧 最终统一会话服务获取结果:", {
									hasService: !!i,
									serviceType: typeof i,
									hasOnSessionChanged: !(null === (t = i) || void 0 === t || !t.onSessionChanged),
									hasGetAllSessions: !(null === (s = i) || void 0 === s || !s.getAllSessions),
								}),
								i && i.onSessionChanged)
							) {
								console.log("[EditorChat] 🔧 统一会话服务正常，开始订阅事件...")
								const e = i.onSessionChanged(this.handleUnifiedSessionEvent.bind(this))
								console.log("[EditorChat] 🔧 事件订阅结果:", {
									hasDisposable: !!e,
									disposableType: typeof e,
									hasDispose: !(null === e || void 0 === e || !e.dispose),
								}),
									e && "function" === typeof e.dispose
										? ((this.unifiedSessionUnsubscribe = () => e.dispose()),
											console.log("[EditorChat] ✅ 已成功订阅统一会话事件"))
										: (console.warn("[EditorChat] ⚠️ 事件订阅返回的不是有效的disposable对象:", e),
											(this.unifiedSessionUnsubscribe = null))
							} else
								console.warn("[EditorChat] ⚠️ 统一会话服务或onSessionChanged事件不可用"),
									console.warn("[EditorChat] ⚠️ 尝试设置备用监听机制..."),
									this.setupFallbackSessionListener(),
									(this.unifiedSessionUnsubscribe = null)
						} catch (i) {
							console.error("[EditorChat] ❌ 设置统一会话监听器失败:", i),
								console.error("[EditorChat] ❌ 错误详情:", i.stack),
								console.warn("[EditorChat] ⚠️ 尝试设置备用监听机制..."),
								this.setupFallbackSessionListener(),
								(this.unifiedSessionUnsubscribe = null)
						}
						console.log("[EditorChat] 🔧 统一会话服务监听器设置完成")
					},
					setupFallbackSessionListener() {
						console.log("[EditorChat] 🔧 设置备用会话监听机制...")
						try {
							const e = (e) => {
								console.log("[EditorChat] 🔔 收到备用会话事件:", e.detail),
									e.detail &&
										"unified-session-activated" === e.detail.type &&
										this.handleUnifiedSessionEvent(e.detail)
							}
							window.addEventListener("unified-session-activated", e),
								console.log("[EditorChat] ✅ 已设置全局事件监听器"),
								(this.unifiedSessionUnsubscribe = () => {
									window.removeEventListener("unified-session-activated", e),
										console.log("[EditorChat] 🔧 已清理备用事件监听器")
								})
							let t = null
							const s = setInterval(() => {
									try {
										let e = null
										if (
											(window.SharedServicesAccessor &&
												(e = window.SharedServicesAccessor.get("IUnifiedSessionService")),
											e && "function" === typeof e.getActiveSession)
										) {
											const s = e.getActiveSession(),
												i = null === s || void 0 === s ? void 0 : s.id
											i &&
												i !== t &&
												(console.log("[EditorChat] 🔔 检测到活跃会话变化 (轮询):", i),
												(t = i),
												this.handleUnifiedSessionEvent({
													type: "unified-session-activated",
													sessionId: i,
													sessionType: s.type,
													session: s,
												}))
										}
									} catch (e) {}
								}, 1e3),
								i = this.unifiedSessionUnsubscribe
							;(this.unifiedSessionUnsubscribe = () => {
								clearInterval(s), i && i(), console.log("[EditorChat] 🔧 已清理轮询机制")
							}),
								console.log("[EditorChat] ✅ 已设置会话状态轮询机制")
						} catch (e) {
							console.error("[EditorChat] ❌ 设置备用监听机制失败:", e)
						}
					},
					testUnifiedSessionServiceAccess() {
						console.log("[EditorChat] 🔧 开始测试统一会话服务访问...")
						try {
							if (!this.$vscode) return void console.error("[EditorChat] ❌ $vscode服务不可用，无法测试")
							const t = this.$vscode.get("IUnifiedSessionService")
							if (
								(console.log("[EditorChat] 🔧 统一会话服务获取测试:", {
									hasService: !!t,
									serviceType: typeof t,
									hasOnSessionChanged: !(null === t || void 0 === t || !t.onSessionChanged),
									hasGetAllSessions: !(null === t || void 0 === t || !t.getAllSessions),
									hasSetActiveSession: !(null === t || void 0 === t || !t.setActiveSession),
								}),
								t && "function" === typeof t.getAllSessions)
							)
								try {
									const e = t.getAllSessions()
									console.log("[EditorChat] 🔧 获取会话列表测试:", {
										sessionsCount: (null === e || void 0 === e ? void 0 : e.length) || 0,
										firstSessionSample: (null === e || void 0 === e ? void 0 : e[0]) || null,
									})
								} catch (e) {
									console.error("[EditorChat] ❌ 获取会话列表失败:", e)
								}
							const s = this.$vscode.get("INotificationService")
							console.log("[EditorChat] 🔧 通知服务测试:", !!s)
							const i = this.$vscode.get("IFileService")
							console.log("[EditorChat] 🔧 文件服务测试:", !!i)
						} catch (e) {
							console.error("[EditorChat] ❌ 统一会话服务访问测试失败:", e)
						}
						console.log("[EditorChat] 🔧 统一会话服务访问测试完成")
					},
					handleUnifiedSessionEvent(e) {
						console.log("[EditorChat] 🔔 收到统一会话事件:", {
							eventType: null === e || void 0 === e ? void 0 : e.type,
							sessionId: null === e || void 0 === e ? void 0 : e.sessionId,
							sessionType: null === e || void 0 === e ? void 0 : e.sessionType,
							hasSession: !(null === e || void 0 === e || !e.session),
							eventDetails: e,
						}),
							e
								? "unified-session-activated" === e.type
									? (console.log("[EditorChat] 🔔 处理会话激活事件，类型:", e.sessionType),
										"vue-im" === e.sessionType
											? (console.log("[EditorChat] 🔧 处理Vue IM会话激活"),
												this.handleImSessionActivatedFromUnified(e))
											: "react-ai" === e.sessionType
												? (console.log("[EditorChat] 🔧 处理React AI会话激活"),
													this.handleAiSessionActivatedFromUnified(e))
												: console.warn("[EditorChat] ⚠️ 未知的会话类型:", e.sessionType))
									: console.log("[EditorChat] 🔧 非激活事件，忽略:", e.type)
								: console.warn("[EditorChat] ⚠️ 收到空的统一会话事件")
					},
					handleImSessionActivatedFromUnified(e) {
						var t, s
						console.log(
							"[EditorChat] 处理IM会话激活:",
							null === (t = e.session) || void 0 === t ? void 0 : t.title,
						)
						const i = e.session
						if (!i) return void console.warn("[EditorChat] IM会话事件中没有会话数据")
						const o = i.targetId || i.sessionId || i.realSessionRef
						if (!o) return void console.warn("[EditorChat] IM会话事件中没有有效的targetId:", i)
						const n = "vue-im-" + o
						if (this.lastActivatedSessionId === n)
							return void console.log("[EditorChat] 🔧 防止重复激活，会话已是当前激活状态:", n)
						console.log("[EditorChat] 🔧 激活IM会话，targetId:", o),
							(this.selectedAIChat = null),
							(this.isAIChat = !1)
						const a = o.toString(),
							r =
								null === (s = this.chatStore.chats) || void 0 === s
									? void 0
									: s.find((e) => {
											var t
											const s =
												null === (t = e.targetId || e.id) || void 0 === t
													? void 0
													: t.toString()
											return s === a
										})
						if (r) {
							var l
							const e = this.chatStore.chats.indexOf(r)
							console.log("[EditorChat] 🔧 找到匹配聊天，索引:", e, "会话名:", r.showName),
								console.log(
									"[EditorChat] 🔧 当前activeChat:",
									(null === (l = this.chatStore.activeChat) || void 0 === l ? void 0 : l.showName) ||
										"null",
								),
								console.log("[EditorChat] 🔧 期望activeChat:", r.showName),
								(this.lastActivatedSessionId = n),
								(this.selectedAIChat = null),
								(this.isAIChat = !1),
								this.initializeThinkingSession(),
								console.log("[EditorChat] 🔧 IM会话状态已同步")
						} else {
							var c
							console.warn("[EditorChat] ❌ 未找到匹配的聊天，targetId:", o),
								console.log(
									"[EditorChat] 🔧 可用聊天列表:",
									null === (c = this.chatStore.chats) || void 0 === c
										? void 0
										: c.map((e) => ({ targetId: e.targetId, id: e.id, showName: e.showName })),
								),
								this.$store.commit("clearActiveChat"),
								this.initializeThinkingSession()
						}
					},
					handleAiSessionActivatedFromUnified(e) {
						var t
						console.log(
							"[EditorChat] 处理AI会话激活:",
							null === (t = e.session) || void 0 === t ? void 0 : t.title,
						)
						const s = e.session
						s
							? ((this.isAIChat = !0),
								this.$store.commit("clearActiveChat"),
								(this.selectedAIChat = {
									id: s.sessionId,
									aiThreadId: s.sessionId,
									showName: s.title || s.showName || "AI对话",
									title: s.title || s.showName || "AI对话",
									summary: s.summary || "",
									lastModified: s.lastModified || new Date().toISOString(),
								}),
								console.log("[EditorChat] 🔧 AI会话已激活:", this.selectedAIChat.showName))
							: console.warn("[EditorChat] AI会话事件中没有会话数据")
					},
				},
				mounted() {
					var e, t, s
					console.log("[EditorChat] 🔧 Component mounting..."),
						this.detectPCTerminalChat(),
						console.log("[EditorChat] 🔧 Checking VSCode services availability:"),
						console.log("- $vscode:", !!this.$vscode),
						console.log("- $vscode type:", typeof this.$vscode),
						console.log("- $vscode.get:", !(null === (e = this.$vscode) || void 0 === e || !e.get)),
						console.log("- SharedServicesAccessor:", !!window.SharedServicesAccessor),
						console.log(
							"- SharedServicesAccessor.getChatThreadsService:",
							!(null === (t = window.SharedServicesAccessor) || void 0 === t || !t.getChatThreadsService),
						),
						console.log(
							"- SharedServicesAccessor.saveFileToWorkspace:",
							!(null === (s = window.SharedServicesAccessor) || void 0 === s || !s.saveFileToWorkspace),
						),
						this.fixVSCodeServices(),
						this.testUnifiedSessionServiceAccess(),
						console.log("[EditorChat] 🔧 Checking event bus:"),
						console.log("- $bus:", !!this.$bus),
						console.log("- $eventBus:", !!this.$eventBus),
						this.initializeThinkingSession(),
						this.setupEventListeners(),
						this.setupFileDragDrop(),
						this.$bus
							? (this.$bus.$on("chat:file:send", this.handleFileSend),
								this.$bus.$on("chat:file:upload", this.handleFileSend),
								console.log("[EditorChat] File event listeners registered on $bus"))
							: console.warn("[EditorChat] $bus not available, cannot register file event listeners"),
						this.$eventBus &&
							(this.$eventBus.$on("chat:file:send", this.handleFileSend),
							this.$eventBus.$on("chat:file:upload", this.handleFileSend),
							console.log("[EditorChat] File event listeners registered on $eventBus")),
						console.log("[EditorChat] 🔧 Component mounted, all event listeners initialized")
				},
				beforeDestroy() {
					this.cleanupEventListeners(),
						this.removeGlobalDragListeners(),
						this.$bus &&
							(this.$bus.$off("chat:file:send", this.handleFileSend),
							this.$bus.$off("chat:file:upload", this.handleFileSend))
				},
				watch: {
					"chatStore.activeChat": {
						handler() {
							this.detectPCTerminalChat()
						},
						immediate: !0,
					},
					chatData: {
						handler(e) {
							e && this.activateChatData(e)
						},
						immediate: !0,
					},
				},
			},
			Gs = Ls,
			Os = (s("0fa9"), Object(u["a"])(Gs, Is, Ss, !1, null, null, null)),
			Vs = Os.exports,
			Bs = {
				name: "PluginChat",
				components: { EditorChat: Vs, EditorFriend: Dt, EditorGroup: Ut },
				props: {
					chatData: { type: Object, default: () => ({}) },
					friendData: { type: Object, default: () => null },
				},
				data() {
					return {
						searchText: "",
						messageContent: "",
						group: {},
						groupMembers: [],
						currentMode: "default",
						currentChatData: null,
					}
				},
				methods: {
					onTop(e) {
						this.$store.commit("moveTop", e)
					},
					goBack() {
						"chat" === this.currentMode && this.friendData
							? this.switchToFriendMode()
							: this.$emit("backToInbox")
					},
					handleStartChat(e) {
						console.log("[PluginChat] 开始聊天:", e),
							(this.currentChatData = e),
							(this.currentMode = "chat"),
							this.$store.commit("changeViewCode", 1)
					},
					switchToFriendMode() {
						console.log("[PluginChat] 切换到好友模式"),
							(this.currentMode = "friend"),
							(this.currentChatData = null),
							this.$store.commit("changeViewCode", 2)
					},
				},
				computed: {
					uiStore() {
						return this.$store.state.uiStore
					},
					chatStore() {
						return this.$store.state.chatStore
					},
					loading() {
						return this.chatStore.loadingGroupMsg || this.chatStore.loadingPrivateMsg
					},
					isShowingChat() {
						return (
							(this.chatData && Object.keys(this.chatData).length > 0 && !this.friendData) ||
							"chat" === this.currentMode
						)
					},
					isShowingFriend() {
						return this.friendData && Object.keys(this.friendData).length > 0 && "chat" !== this.currentMode
					},
				},
				watch: {
					friendData: {
						handler(e) {
							e &&
								Object.keys(e).length > 0 &&
								(console.log("接收到好友数据:", e),
								(this.currentMode = "friend"),
								(this.currentChatData = null),
								this.$store.commit("changeViewCode", 2),
								this.$store.commit("setActiveFriend", e))
						},
						immediate: !0,
					},
					chatData: {
						handler(e) {
							e &&
								Object.keys(e).length > 0 &&
								!this.friendData &&
								(console.log("接收到聊天数据:", e),
								(this.currentMode = "default"),
								(this.currentChatData = e))
						},
						immediate: !0,
					},
				},
			},
			Us = Bs,
			zs = (s("f498"), s("116a"), Object(u["a"])(Us, vs, Cs, !1, null, "bc1e3166", null)),
			js = zs.exports,
			Hs = {
				name: "Plugin",
				components: { InboxPlugin: fs, PluginChat: js },
				data() {
					return { currentView: "inbox", selectedChatData: null, selectedFriendData: null }
				},
				computed: {
					currentComponent() {
						return "inbox" === this.currentView ? "InboxPlugin" : "PluginChat"
					},
				},
				methods: {
					showChatView(e) {
						console.log("切换到聊天视图:", e),
							(this.selectedChatData = e),
							(this.selectedFriendData = null),
							(this.currentView = "chat")
					},
					showFriendView(e) {
						console.log("切换到好友详情视图:", e),
							(this.selectedFriendData = e),
							(this.selectedChatData = null),
							(this.currentView = "friend")
					},
					backToInbox() {
						console.log("回退到收件箱视图"),
							(this.currentView = "inbox"),
							(this.selectedChatData = null),
							(this.selectedFriendData = null)
					},
				},
				created() {
					console.log("Plugin组件已创建，默认显示收件箱")
				},
			},
			qs = Hs,
			Ws = (s("0ca9"), Object(u["a"])(qs, Qt, Zt, !1, null, "61bdadf0", null)),
			Ys = Ws.exports
		r["default"].use(p["a"])
		var Js = new p["a"]({
				routes: [
					{ path: "/", redirect: "/login" },
					{ name: "Login", path: "/login", component: y },
					{ name: "Register", path: "/register", component: M },
					{ name: "Vscode", path: "/vscode", component: Kt },
					{ name: "Plugin", path: "/plugin", component: Ys },
					{
						name: "Home",
						path: "/home",
						component: Pe,
						children: [
							{
								name: "Chat",
								path: "/home/chat",
								component: () => s.e("chunk-a1723fe6").then(s.bind(null, "3f94")),
							},
							{
								name: "Friend",
								path: "/home/friend",
								component: () => s.e("chunk-e3523218").then(s.bind(null, "63b9")),
							},
							{
								name: "GROUP",
								path: "/home/group",
								component: () => s.e("chunk-64ed2b64").then(s.bind(null, "5c36")),
							},
						],
					},
					{
						name: "MessageRendererDemo",
						path: "/demo/message-renderer",
						component: () => s.e("chunk-c6abf80c").then(s.bind(null, "8628")),
					},
					{
						name: "TestMermaid",
						path: "/test-mermaid",
						component: () => s.e("chunk-55cbb4e4").then(s.bind(null, "4efe")),
					},
				],
			}),
			Ks = (s("6178"), s("be35"), null)
		let Qs,
			Zs = !1,
			Xs = null,
			ei = null,
			ti = null,
			si = (e, t) => {
				try {
					if (Zs) return
					console.log("连接WebSocket"),
						(Ks = new WebSocket(e)),
						(Ks.onmessage = function (e) {
							let t = JSON.parse(e.data)
							0 == t.cmd
								? (ni.start(), Xs && Xs(), console.log("WebSocket登录成功"))
								: 1 == t.cmd
									? ni.reset()
									: 2 == t.cmd
										? (console.log("收到强制下线通知:", t.data),
											Ks.close(1e3),
											ei && ei(t.cmd, t.data))
										: 11 == t.cmd
											? (console.log("收到LLM流式数据块:", t.data), ei && ei(t.cmd, t.data))
											: 12 == t.cmd
												? (console.log("LLM流式传输结束:", t.data), ei && ei(t.cmd, t.data))
												: 13 == t.cmd
													? (console.error("LLM流式传输错误:", t.data),
														ei && ei(t.cmd, t.data))
													: (console.log("收到消息:", t), ei && ei(t.cmd, t.data))
						}),
						(Ks.onclose = function (e) {
							console.log("WebSocket连接关闭"), (Zs = !1), ti && ti(e)
						}),
						(Ks.onopen = function () {
							console.log("WebSocket连接成功"), (Zs = !0)
							let e = { cmd: 0, data: { accessToken: t } }
							Ks.send(JSON.stringify(e))
						}),
						(Ks.onerror = function () {
							console.log("WebSocket连接发生错误"), (Zs = !1), ii(e, t)
						})
				} catch (s) {
					console.log("尝试创建连接失败"), ii(e, t)
				}
			},
			ii = (e, t) => {
				console.log("尝试重新连接"),
					Zs ||
						(Qs && clearTimeout(Qs),
						(Qs = setTimeout(function () {
							si(e, t)
						}, 15e3)))
			},
			oi = (e) => {
				Ks && Ks.close(e)
			},
			ni = {
				timeout: 5e3,
				timeoutObj: null,
				start: function () {
					if (Zs) {
						console.log("发送WebSocket心跳")
						let e = { cmd: 1, data: {} }
						Ks.send(JSON.stringify(e))
					}
				},
				reset: function () {
					clearTimeout(this.timeoutObj),
						(this.timeoutObj = setTimeout(function () {
							ni.start()
						}, this.timeout))
				},
			},
			ai = (e) => {
				Ks.readyState === Ks.OPEN
					? Ks.send(JSON.stringify(e))
					: (Ks.readyState,
						Ks.CONNECTING,
						setTimeout(function () {
							ai(e)
						}, 1e3))
			},
			ri = (e) => {
				Xs = e
			},
			li = (e) => {
				ei = e
			},
			ci = (e) => {
				ti = e
			},
			di = () => ei,
			hi = (e) => {
				ei = e
			},
			ui = function (e) {
				return e >= 0 && e < 10
			},
			mi = function (e) {
				return e >= 10 && e < 20
			},
			gi = function (e) {
				return e >= 20 && e < 30
			},
			pi = function (e) {
				return e >= 40 && e < 50
			},
			fi = function (e) {
				return e >= 100 && e < 200
			},
			vi = function (e) {
				return e >= 200 && e < 300
			}
		const Ci = [
			"憨笑",
			"媚眼",
			"开心",
			"坏笑",
			"可怜",
			"爱心",
			"笑哭",
			"拍手",
			"惊喜",
			"打气",
			"大哭",
			"流泪",
			"饥饿",
			"难受",
			"健身",
			"示爱",
			"色色",
			"眨眼",
			"暴怒",
			"惊恐",
			"思考",
			"头晕",
			"大吐",
			"酷笑",
			"翻滚",
			"享受",
			"鼻涕",
			"快乐",
			"雀跃",
			"微笑",
			"贪婪",
			"红心",
			"粉心",
			"星星",
			"大火",
			"眼睛",
			"音符",
			"叹号",
			"问号",
			"绿叶",
			"燃烧",
			"喇叭",
			"警告",
			"信封",
			"房子",
			"礼物",
			"点赞",
			"举手",
			"拍手",
			"点头",
			"摇头",
			"偷瞄",
			"庆祝",
			"疾跑",
			"打滚",
			"惊吓",
			"起跳",
		]
		let Ii = (e, t) => e.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, (e) => Si(e, t)),
			Si = (e, t) => {
				let i = e.replace(/\#|\;/gi, ""),
					o = Ci.indexOf(i)
				if (-1 == o) return e
				let n = s("642d")(`./${o}.gif`)
				return `<img src="${n}" class="${t}" />`
			},
			wi = (e) => {
				let t = e.replace(/\#|\;/gi, ""),
					i = Ci.indexOf(t)
				if (-1 == i) return ""
				let o = s("642d")(`./${i}.gif`)
				return o
			}
		var Ti = { emoTextList: Ci, transform: Ii, textToImg: Si, textToUrl: wi }
		let bi = (e, t) => {
			const s =
				/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]|\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
			return e.replace(
				s,
				(e) => (
					e.startsWith("http") || (e = "http://" + e),
					`<a href="${e}" target="_blank" style="color: ${t};text-decoration: underline;">${e}</a>`
				),
			)
		}
		var yi = { replaceURLWithHTMLLinks: bi }
		let xi = (e) => {
				var t = e.offsetTop
				return null != e.offsetParent && (t += xi(e.offsetParent)), t
			},
			Ai = (e) => {
				var t = e.offsetLeft
				return null != e.offsetParent && (t += Ai(e.offsetParent)), t
			},
			$i = (e) => {
				let t = "傻蛋IM"
				e && (t = `(${e})${t}`), (document.title = t)
			}
		var Ei = { fixTop: xi, fixLeft: Ai, setTitleTip: $i },
			ki = s("2f62")
		s("1e70"), s("79a4"), s("c1a1"), s("8b00"), s("a4e7"), s("1e5a"), s("72c3"), s("a1f0")
		const Mi = {
				TEXT: 0,
				IMAGE: 1,
				FILE: 2,
				AUDIO: 3,
				VIDEO: 4,
				RECALL: 10,
				READED: 11,
				RECEIPT: 12,
				TIP_TIME: 20,
				TIP_TEXT: 21,
				LOADING: 30,
				ACT_RT_VOICE: 40,
				ACT_RT_VIDEO: 41,
				USER_BANNED: 50,
				FRIEND_NEW: 80,
				FRIEND_DEL: 81,
				GROUP_NEW: 90,
				GROUP_DEL: 91,
				RTC_CALL_VOICE: 100,
				RTC_CALL_VIDEO: 101,
				RTC_ACCEPT: 102,
				RTC_REJECT: 103,
				RTC_CANCEL: 104,
				RTC_FAILED: 105,
				RTC_HANDUP: 106,
				RTC_CANDIDATE: 107,
				RTC_GROUP_SETUP: 200,
				RTC_GROUP_ACCEPT: 201,
				RTC_GROUP_REJECT: 202,
				RTC_GROUP_FAILED: 203,
				RTC_GROUP_CANCEL: 204,
				RTC_GROUP_QUIT: 205,
				RTC_GROUP_INVITE: 206,
				RTC_GROUP_JOIN: 207,
				RTC_GROUP_OFFER: 208,
				RTC_GROUP_ANSWER: 209,
				RTC_GROUP_CANDIDATE: 210,
				RTC_GROUP_DEVICE: 211,
			},
			Ni = { FREE: 0, WAIT_CALL: 1, WAIT_ACCEPT: 2, ACCEPTED: 3, CHATING: 4 },
			_i = { WEB: 0, APP: 1, VSCODE: 2, PC: 3, PLUGIN: 4, MCP: 5 },
			Pi = { UNSEND: 0, SENDED: 1, RECALL: 2, READED: 3 }
		var Ri = {
				state: {
					isLoggedIn: !1,
					userInfo: { id: -1, username: "", nickName: "", avatar: "", terminal: null },
					rtcInfo: { friend: {}, mode: "video", state: Ni.FREE },
				},
				getters: {
					currentTerminal: (e) => e.userInfo.terminal,
					terminalName: (e) => {
						const t = {
							0: "傻蛋网页端",
							1: "傻蛋精灵App",
							2: "我的电脑",
							3: "我的云电脑",
							4: "傻蛋浏览器",
							5: "MCP",
						}
						return t[e.userInfo.terminal] || "未知终端"
					},
				},
				mutations: {
					setIsLoggedIn(e, t) {
						console.log("[Store] setIsLoggedIn:", t), (e.isLoggedIn = t)
					},
					setUserInfo(e, t) {
						console.log("[Store] setUserInfo:", t), (e.userInfo = t)
					},
					updateUserInfo(e, t) {
						e.userInfo = { ...e.userInfo, ...t }
					},
					setTerminal(e, t) {
						console.log("[Store] setTerminal:", t),
							(e.userInfo.terminal = t),
							"number" === typeof t && localStorage.setItem("userTerminal", t.toString())
					},
					setRtcInfo(e, t) {
						e.rtcInfo = t
					},
					setRtcState(e, t) {
						e.rtcInfo.state = t
					},
					clear(e) {
						;(e.isLoggedIn = !1),
							(e.userInfo = {}),
							(e.rtcInfo = { friend: {}, mode: "video", state: Ni.FREE })
					},
				},
				actions: {
					loadUser(e) {
						return new Promise((t, s) => {
							ve({ url: "/user/self", method: "GET" })
								.then((s) => {
									e.commit("setUserInfo", s)
									const i = localStorage.getItem("userTerminal")
									null !== i && e.commit("setTerminal", parseInt(i)), t()
								})
								.catch((e) => {
									s(e)
								})
						})
					},
					initTerminal(e) {
						if (null !== e.state.userInfo.terminal) return
						const t = localStorage.getItem("userTerminal")
						if (null !== t) return void e.commit("setTerminal", parseInt(t))
						let s = 0
						window.vscodeServices || window.electronAPI
							? (s = 2)
							: navigator.userAgent.includes("Mobile") && (s = 1),
							console.log("[UserStore] 推断终端类型:", s),
							e.commit("setTerminal", s)
					},
					setIsLoggedIn(e, t) {
						console.log("[UserStore Action] setIsLoggedIn:", t), e.commit("setIsLoggedIn", t)
					},
				},
			},
			Fi = s("a002"),
			Di = s.n(Fi)
		class Li {
			constructor() {
				;(this.isVSCodeEnvironment = "undefined" !== typeof window && window.SharedServicesAccessor),
					(this.isInitialized = !1),
					(this.migrationStatus = { isCompleted: !1, lastMigrationTime: 0, migratedCount: 0, totalCount: 0 }),
					console.log("[VSCodeStorageAdapter] 初始化", { isVSCodeEnvironment: this.isVSCodeEnvironment })
			}
			isInVSCodeEnvironment() {
				return this.isVSCodeEnvironment
			}
			getSharedServicesAccessor() {
				try {
					if (!window.SharedServicesAccessor)
						return console.warn("[VSCodeStorageAdapter] SharedServicesAccessor不存在"), null
					let e
					if ("function" === typeof window.SharedServicesAccessor.getInstance)
						e = window.SharedServicesAccessor.getInstance()
					else {
						if ("object" !== typeof window.SharedServicesAccessor)
							return console.warn("[VSCodeStorageAdapter] SharedServicesAccessor格式不正确"), null
						e = window.SharedServicesAccessor
					}
					return e
				} catch (e) {
					return console.error("[VSCodeStorageAdapter] 获取SharedServicesAccessor失败:", e), null
				}
			}
			async initialize() {
				if (this.isInitialized) return !0
				try {
					return this.isVSCodeEnvironment
						? ((this.isInitialized = !0), console.log("[VSCodeStorageAdapter] 初始化完成"), !0)
						: (console.warn("[VSCodeStorageAdapter] 不在VSCode环境中，跳过初始化"), !1)
				} catch (e) {
					return console.error("[VSCodeStorageAdapter] 初始化失败:", e), !1
				}
			}
			async waitForVSCodeServices(e = 5e3) {
				return new Promise((t, s) => {
					const i = Date.now(),
						o = () => {
							try {
								if (!window.SharedServicesAccessor)
									return Date.now() - i > e
										? void s(new Error("SharedServicesAccessor不存在，等待超时"))
										: void setTimeout(o, 100)
								let n
								if ("function" === typeof window.SharedServicesAccessor.getInstance)
									n = window.SharedServicesAccessor.getInstance()
								else {
									if ("object" !== typeof window.SharedServicesAccessor)
										return Date.now() - i > e
											? void s(new Error("SharedServicesAccessor格式不正确"))
											: void setTimeout(o, 100)
									n = window.SharedServicesAccessor
								}
								n && "function" === typeof n.isInitialized && n.isInitialized()
									? t(!0)
									: Date.now() - i > e
										? s(new Error("VSCode服务等待超时"))
										: setTimeout(o, 100)
							} catch (n) {
								Date.now() - i > e
									? s(new Error("VSCode服务检查失败: " + n.message))
									: setTimeout(o, 100)
							}
						}
					o()
				})
			}
			async saveVueChatSession(e, t = null) {
				try {
					var s
					if ((this.isInitialized || (await this.initialize()), !this.isVSCodeEnvironment))
						return console.warn("[VSCodeStorageAdapter] 不在VSCode环境，无法保存会话"), !1
					const i = t || (null === (s = Ri.state.userInfo) || void 0 === s ? void 0 : s.id)
					if (!i || "default" === i)
						return console.warn("[VSCodeStorageAdapter] 用户ID无效，跳过保存操作，避免数据污染"), !1
					const o = this.adaptVueChatFormat(e),
						n = this.getSharedServicesAccessor()
					if (!n || "function" !== typeof n.syncVueChatsToVSCode)
						return console.warn("[VSCodeStorageAdapter] syncVueChatsToVSCode方法不可用"), !1
					const a = await n.syncVueChatsToVSCode([o], i)
					return console.log("[VSCodeStorageAdapter] Vue会话保存结果:", a), a
				} catch (i) {
					return console.error("[VSCodeStorageAdapter] 保存Vue会话失败:", i), !1
				}
			}
			async saveMultipleVueChats(e, t = null) {
				try {
					var s
					if (
						(this.isInitialized || (await this.initialize()),
						!this.isVSCodeEnvironment || !e || 0 === e.length)
					)
						return !1
					const i = t || (null === (s = Ri.state.userInfo) || void 0 === s ? void 0 : s.id)
					if (!i || "default" === i)
						return console.warn("[VSCodeStorageAdapter] 用户ID无效，跳过批量保存操作，避免数据污染"), !1
					const o = e.map((e) => this.adaptVueChatFormat(e)),
						n = this.getSharedServicesAccessor()
					if (!n || "function" !== typeof n.syncVueChatsToVSCode)
						return console.warn("[VSCodeStorageAdapter] syncVueChatsToVSCode方法不可用"), !1
					const a = await n.syncVueChatsToVSCode(o, i)
					return console.log(`[VSCodeStorageAdapter] 批量保存${o.length}个Vue会话:`, a), a
				} catch (i) {
					return console.error("[VSCodeStorageAdapter] 批量保存Vue会话失败:", i), !1
				}
			}
			async loadVueChatsFromVSCode(e = null) {
				try {
					var t
					if ((this.isInitialized || (await this.initialize()), !this.isVSCodeEnvironment))
						return console.warn("[VSCodeStorageAdapter] 不在VSCode环境，无法加载聊天数据"), null
					const s = e || (null === (t = Ri.state.userInfo) || void 0 === t ? void 0 : t.id)
					if (!s || "default" === s)
						return console.warn("[VSCodeStorageAdapter] 用户ID无效，跳过加载操作"), null
					const i = this.getSharedServicesAccessor()
					if (!i || "function" !== typeof i.loadVueChatsFromVSCode)
						return console.warn("[VSCodeStorageAdapter] loadVueChatsFromVSCode方法不可用"), null
					const o = await i.loadVueChatsFromVSCode(s)
					return console.log("[VSCodeStorageAdapter] 从VSCode存储加载Vue聊天数据:", o), o
				} catch (s) {
					return console.error("[VSCodeStorageAdapter] 从VSCode存储加载Vue聊天数据失败:", s), null
				}
			}
			async saveVueChatsDataToVSCode(e, t = null) {
				try {
					var s
					if ((this.isInitialized || (await this.initialize()), !this.isVSCodeEnvironment))
						return console.warn("[VSCodeStorageAdapter] 不在VSCode环境，无法保存聊天数据"), !1
					const i = t || (null === (s = Ri.state.userInfo) || void 0 === s ? void 0 : s.id)
					if (!i || "default" === i)
						return console.warn("[VSCodeStorageAdapter] 用户ID无效，跳过保存操作，避免数据污染"), !1
					const o = this.getSharedServicesAccessor()
					if (!o || "function" !== typeof o.saveVueChatsToVSCode)
						return console.warn("[VSCodeStorageAdapter] saveVueChatsToVSCode方法不可用"), !1
					const n = {
							chats: e.chats || [],
							privateMsgMaxId: e.privateMsgMaxId || 0,
							groupMsgMaxId: e.groupMsgMaxId || 0,
							lastSync: Date.now(),
						},
						a = await o.saveVueChatsToVSCode(i, n)
					return console.log("[VSCodeStorageAdapter] 保存Vue聊天数据到VSCode存储:", a), a
				} catch (i) {
					return console.error("[VSCodeStorageAdapter] 保存Vue聊天数据到VSCode存储失败:", i), !1
				}
			}
			adaptVueChatFormat(e) {
				return {
					targetId: e.targetId,
					type: e.type || "PRIVATE",
					showName: e.showName || e.targetId,
					headImage: e.headImage || "",
					lastContent: e.lastContent || "",
					lastSendTime: e.lastSendTime || Date.now(),
					unreadCount: e.unreadCount || 0,
					messages: e.messages || [],
				}
			}
			async searchAllMessages(e, t = {}) {
				try {
					if ((this.isInitialized || (await this.initialize()), !this.isVSCodeEnvironment))
						return console.warn("[VSCodeStorageAdapter] 不在VSCode环境，无法搜索"), []
					const s = this.getSharedServicesAccessor()
					if (!s || "function" !== typeof s.searchAllMessages)
						return console.warn("[VSCodeStorageAdapter] searchAllMessages方法不可用"), []
					const i = await s.searchAllMessages(e, t)
					return console.log(`[VSCodeStorageAdapter] 搜索"${e}"找到${i.length}条结果`), i
				} catch (s) {
					return console.error("[VSCodeStorageAdapter] 搜索消息失败:", s), []
				}
			}
			async migrateFromLocalForage(e) {
				try {
					var t
					if (
						(console.log("[VSCodeStorageAdapter] 开始从localForage迁移数据..."),
						this.isInitialized || (await this.initialize()),
						!this.isVSCodeEnvironment)
					)
						return (
							console.warn("[VSCodeStorageAdapter] 不在VSCode环境，跳过迁移"),
							{ success: !1, message: "不在VSCode环境中" }
						)
					if (this.migrationStatus.isCompleted)
						return (
							console.log("[VSCodeStorageAdapter] 数据已迁移，跳过重复迁移"),
							{ success: !0, message: "数据已迁移", ...this.migrationStatus }
						)
					const s = null === (t = Ri.state.userInfo) || void 0 === t ? void 0 : t.id
					if (!s || "default" === s)
						return (
							console.warn("[VSCodeStorageAdapter] 用户ID无效，跳过迁移操作，避免数据污染"),
							{ success: !1, message: "用户ID无效，无法执行迁移" }
						)
					const i = this.extractChatsFromLocalForage(e)
					if (0 === i.length)
						return (
							console.log("[VSCodeStorageAdapter] 没有发现需要迁移的聊天数据"),
							{ success: !0, message: "没有数据需要迁移", migratedCount: 0, totalCount: 0 }
						)
					const o = await this.saveMultipleVueChats(i, s)
					return o
						? ((this.migrationStatus = {
								isCompleted: !0,
								lastMigrationTime: Date.now(),
								migratedCount: i.length,
								totalCount: i.length,
							}),
							localStorage.setItem("vscode_migration_status", JSON.stringify(this.migrationStatus)),
							console.log("[VSCodeStorageAdapter] localForage迁移完成:", this.migrationStatus),
							{ success: !0, message: "迁移成功", ...this.migrationStatus })
						: (console.error("[VSCodeStorageAdapter] localForage迁移失败"),
							{ success: !1, message: "迁移失败", migratedCount: 0, totalCount: i.length })
				} catch (s) {
					return (
						console.error("[VSCodeStorageAdapter] localForage迁移异常:", s),
						{ success: !1, message: s.message, migratedCount: 0, totalCount: 0 }
					)
				}
			}
			extractChatsFromLocalForage(e) {
				const t = []
				try {
					return (
						Array.isArray(e)
							? t.push(...e)
							: e &&
								"object" === typeof e &&
								(e.chats && Array.isArray(e.chats)
									? t.push(...e.chats)
									: Object.values(e).forEach((e) => {
											e && "object" === typeof e && e.targetId && t.push(e)
										})),
						t
							.filter((e) => e && e.targetId && "string" === typeof e.targetId)
							.map((e) => this.adaptVueChatFormat(e))
					)
				} catch (s) {
					return console.error("[VSCodeStorageAdapter] 提取聊天数据失败:", s), []
				}
			}
			getMigrationStatus() {
				try {
					const e = localStorage.getItem("vscode_migration_status")
					e && (this.migrationStatus = { ...this.migrationStatus, ...JSON.parse(e) })
				} catch (e) {
					console.warn("[VSCodeStorageAdapter] 获取迁移状态失败:", e)
				}
				return { ...this.migrationStatus }
			}
			resetMigrationStatus() {
				this.migrationStatus = { isCompleted: !1, lastMigrationTime: 0, migratedCount: 0, totalCount: 0 }
				try {
					localStorage.removeItem("vscode_migration_status")
				} catch (e) {
					console.warn("[VSCodeStorageAdapter] 清除迁移状态失败:", e)
				}
				console.log("[VSCodeStorageAdapter] 迁移状态已重置")
			}
			async getFTSIndexStats() {
				try {
					if ((this.isInitialized || (await this.initialize()), !this.isVSCodeEnvironment))
						return { totalMessages: 0, indexSize: 0, lastUpdated: 0 }
					const e = await window.SharedServicesAccessor.getFTSIndexStats()
					return console.log("[VSCodeStorageAdapter] FTS索引统计:", e), e
				} catch (e) {
					return (
						console.error("[VSCodeStorageAdapter] 获取FTS统计失败:", e),
						{ totalMessages: 0, indexSize: 0, lastUpdated: 0 }
					)
				}
			}
			async rebuildFTSIndex() {
				try {
					return (
						this.isInitialized || (await this.initialize()),
						this.isVSCodeEnvironment
							? (await window.SharedServicesAccessor.rebuildFTSIndex(),
								console.log("[VSCodeStorageAdapter] FTS索引重建完成"),
								!0)
							: (console.warn("[VSCodeStorageAdapter] 不在VSCode环境，无法重建索引"), !1)
					)
				} catch (e) {
					return console.error("[VSCodeStorageAdapter] 重建FTS索引失败:", e), !1
				}
			}
			async syncReactThreads() {
				try {
					if ((this.isInitialized || (await this.initialize()), !this.isVSCodeEnvironment))
						return console.warn("[VSCodeStorageAdapter] 不在VSCode环境，无法同步React线程"), !1
					const e = await window.SharedServicesAccessor.syncReactThreadsToVSCode()
					return console.log("[VSCodeStorageAdapter] React线程同步结果:", e), e
				} catch (e) {
					return console.error("[VSCodeStorageAdapter] React线程同步失败:", e), !1
				}
			}
		}
		const Gi = new Li()
		var Oi = Gi,
			Vi = s("7dac")
		let Bi = [],
			Ui = null
		var zi = {
				state: {
					activeChat: null,
					privateMsgMaxId: 0,
					groupMsgMaxId: 0,
					loadingPrivateMsg: !1,
					loadingGroupMsg: !1,
					chats: [],
					isLoadingChat: !1,
				},
				mutations: {
					initChats(e, t) {
						if (t && t.chats) {
							const s = t.chats.filter((e) =>
									e && Array.isArray(e.messages)
										? (e.messages.forEach((e) => {
												e && "loading" === e.loadStatus && (e.loadStatus = "fail")
											}),
											!0)
										: (e && (e.messages = []), null !== e && void 0 !== e),
								),
								i = Ri.state.userInfo
							let o = 0
							s.forEach((e) => {
								e &&
									"PRIVATE" === e.type &&
									!e.showName &&
									(console.log(`[ChatStore] 🔧 发现无效会话，targetId: ${e.targetId}，开始修复...`),
									i && i.id == e.targetId
										? ((e.showName = i.nickName || "我"),
											(e.headImage = i.headImageThumb || i.headImage || ""),
											(e.stored = !1),
											o++,
											console.log("[ChatStore] ✅ 修复自己的会话，showName: " + e.showName))
										: ((e.showName = "未知用户"),
											(e.stored = !1),
											o++,
											console.log("[ChatStore] ✅ 修复未知用户会话，targetId: " + e.targetId)))
							}),
								o > 0 && console.log(`[ChatStore] 🔧 数据修复完成，修复了 ${o} 个无效会话`),
								console.log(`[ChatStore] 🔧 设置state.chats ${s} `),
								(e.chats = s),
								t.privateMsgMaxId && (e.privateMsgMaxId = t.privateMsgMaxId),
								t.groupMsgMaxId && (e.groupMsgMaxId = t.groupMsgMaxId)
							let n = 0,
								a = 0
							s.forEach((e) => {
								e.messages &&
									e.messages.length > 0 &&
									e.messages.forEach((t) => {
										if (t && t.id) {
											const s = "string" === typeof t.id ? parseInt(t.id) : t.id
											isNaN(s) ||
												("PRIVATE" === e.type && s > n
													? (n = s)
													: "GROUP" === e.type && s > a && (a = s))
										}
									})
							}),
								n > e.privateMsgMaxId &&
									(console.log(`[ChatStore] 更新privateMsgMaxId: ${e.privateMsgMaxId} -> ${n}`),
									(e.privateMsgMaxId = n)),
								a > e.groupMsgMaxId &&
									(console.log(`[ChatStore] 更新groupMsgMaxId: ${e.groupMsgMaxId} -> ${a}`),
									(e.groupMsgMaxId = a)),
								console.log(
									`[ChatStore] 最大消息ID - 私聊: ${e.privateMsgMaxId}, 群聊: ${e.groupMsgMaxId}`,
								),
								this.commit("cleanDuplicateChats"),
								o > 0 && this.commit("saveToStorage"),
								console.log("[ChatStore] ✅ 聊天数据初始化完成，有效聊天数量: " + e.chats.length)
						} else console.log("[ChatStore] 📭 无聊天数据需要初始化")
					},
					openChat(e, t) {
						let s = this.getters.findChats(),
							i = null
						console.log(`🔧 [openChat] 检查现有${s.length}个会话...`, s)
						for (let o in s) {
							const e = s[o],
								n = this.getters.isSameChat(e, t)
							if (
								((t.isTerminalChat || e.isTerminalChat) &&
									n &&
									console.log(`🔧 [openChat] 终端会话匹配 [${o}]: ${e.showName} (${e.targetId})`),
								n)
							) {
								;(i = e),
									console.log("✅ [openChat] 找到现有会话，移到顶部: " + i.showName),
									this.commit("moveTop", o)
								break
							}
						}
						null == i &&
							(console.log("➕ [openChat] 创建新会话: " + (t.showName || t.targetId)),
							(i = {
								targetId: t.targetId,
								type: t.type,
								showName: t.showName,
								headImage: t.headImage,
								lastContent: "",
								lastSendTime: new Date().getTime(),
								unreadCount: 0,
								messages: [],
								atMe: !1,
								atAll: !1,
								stored: !1,
								delete: !1,
								senderTerminal: t.senderTerminal,
								targetTerminal: t.targetTerminal,
								isTerminalChat: t.isTerminalChat || !1,
								receivingTerminal: t.receivingTerminal,
								isTerminalInbox: t.isTerminalInbox || !1,
								lastTimeTip: t.lastTimeTip || null,
							}),
							s.unshift(i),
							console.log("✅ [openChat] 新会话已创建，当前会话总数: " + s.length))
					},
					activeChat(e, t) {
						console.log(e)
						let s = this.getters.findChats()
						e.activeChat = s[t]
					},
					clearActiveChat(e) {
						e.activeChat = null
					},
					resetUnreadCount(e, t) {
						let s = this.getters.findChats()
						for (let i in s)
							if (s[i].type == t.type && s[i].targetId == t.targetId) {
								;(s[i].unreadCount = 0),
									(s[i].atMe = !1),
									(s[i].atAll = !1),
									(s[i].stored = !1),
									this.commit("saveToStorage")
								break
							}
					},
					readedMessage(e, t) {
						let s = this.getters.findChatByFriend(t.friendId)
						s &&
							(s.messages.forEach((e) => {
								e.id &&
									e.selfSend &&
									e.status < Pi.RECALL &&
									(!t.maxId || e.id <= t.maxId) &&
									((e.status = Pi.READED), (s.stored = !1))
							}),
							this.commit("saveToStorage"))
					},
					removeChat(e, t) {
						let s = this.getters.findChats()
						s[t] == e.activeChat && (e.activeChat = null),
							(s[t].delete = !0),
							(s[t].stored = !1),
							this.commit("saveToStorage")
					},
					removePrivateChat(e, t) {
						let s = this.getters.findChats()
						for (let i in s)
							if ("PRIVATE" == s[i].type && s[i].targetId === t) {
								this.commit("removeChat", i)
								break
							}
					},
					removeGroupChat(e, t) {
						let s = this.getters.findChats()
						for (let i in s)
							if ("GROUP" == s[i].type && s[i].targetId === t) {
								this.commit("removeChat", i)
								break
							}
					},
					moveTop(e, t) {
						if (!this.getters.isLoading() && t > 0) {
							let e = this.getters.findChats(),
								s = e[t]
							if (s.isTerminalInbox) return
							let i = 0
							for (let t = 0; t < e.length; t++)
								if (!e[t].isTerminalInbox) {
									i = t
									break
								}
							e.splice(t, 1),
								e.splice(i, 0, s),
								(s.lastSendTime = new Date().getTime()),
								(s.stored = !1),
								this.commit("saveToStorage")
						}
					},
					handleRooCodeMentions(e, t) {
						console.log("[ChatStore] handleRooCodeMentions 被调用，文本:", t),
							console.log("[ChatStore] 文本长度:", t.length)
						const s = Vi["ZeroWidthEncoder"].extractAllFromText(t)
						if ((console.log("[ChatStore] 提取的零宽编码参数:", s), s.length > 0)) {
							console.log("[ChatStore] 检测到零宽编码参数:", s)
							const e = Vi["ZeroWidthEncoder"].cleanText(t)
							for (const { params: i } of s)
								if ("task" === i.type) {
									const s = /@任务\[([^\]]+)\]/,
										o = e.match(s)
									if (o) {
										const n = o.index + o[0].length
										let a = e.length
										const r = e.indexOf("@", n)
										;-1 !== r && (a = r)
										const l = e.substring(n, a).trim()
										if (l) {
											const e = t.match(s)
											let o = t
											if (e) {
												const s = e.index + e[0].length
												let i = t.length
												const n = t.indexOf("@", s)
												;-1 !== n && (i = n), (o = t.substring(s, i).trim())
											}
											if (
												(console.log("[ChatStore] 处理任务命令（零宽编码）:", {
													taskName: i.name,
													taskId: i.id,
													content: l,
													fullContentLength: o.length,
													hasZeroWidth: o.length > l.length,
												}),
												window.vscodeServices && window.vscodeServices.get)
											) {
												const e = window.vscodeServices.get("ICommandService")
												if (e) {
													const t = { content: o }
													i.id && (t.taskId = i.id),
														i.metadata &&
															Object.keys(i.metadata).length > 0 &&
															(t.metadata = i.metadata),
														e
															.executeCommand("roo-cline.executeTask", t)
															.then(() => {
																console.log("[ChatStore] 成功执行任务命令（零宽编码）")
															})
															.catch((e) => {
																console.error(
																	"[ChatStore] 执行任务命令失败（零宽编码）:",
																	e,
																)
															})
												}
											}
										}
									}
								} else if ("agent" === i.type) {
									const s = /@智能体\[([^\]]+)\]/,
										o = e.match(s)
									if (o) {
										const n = o.index + o[0].length
										let a = e.length
										const r = e.indexOf("@", n)
										;-1 !== r && (a = r)
										const l = e.substring(n, a).trim()
										if (l) {
											const e = t.match(s)
											let o = t
											if (e) {
												const s = e.index + e[0].length
												let i = t.length
												const n = t.indexOf("@", s)
												;-1 !== n && (i = n), (o = t.substring(s, i).trim())
											}
											if (
												(console.log("[ChatStore] 处理智能体命令（零宽编码）:", {
													agentName: i.name,
													modeId: i.modeId,
													content: l,
													fullContentLength: o.length,
													hasZeroWidth: o.length > l.length,
												}),
												window.vscodeServices && window.vscodeServices.get)
											) {
												const e = window.vscodeServices.get("ICommandService")
												if (e) {
													const t = { modeId: i.modeId, content: o }
													i.config &&
														Object.keys(i.config).length > 0 &&
														(t.config = i.config),
														e
															.executeCommand("roo-cline.executeTaskWithMode", t)
															.then(() => {
																console.log(
																	"[ChatStore] 成功执行智能体命令（零宽编码）",
																)
															})
															.catch((e) => {
																console.error(
																	"[ChatStore] 执行智能体命令失败（零宽编码）:",
																	e,
																)
															})
												}
											}
										}
									}
								}
							return
						}
						const i = /@任务\[([^\]]+)\]/g,
							o = t.matchAll(i)
						for (const r of o) {
							const e = r[1],
								[s, i] = e.split(":"),
								o = r.index + r[0].length
							let n = t.length
							const a = t.indexOf("@", o)
							;-1 !== a && (n = a)
							const l = t.substring(o, n).trim()
							if (
								l &&
								(console.log(`[ChatStore] 检测到@任务命令（传统格式）: ${s}, ID: ${i}, 内容: ${l}`),
								window.vscodeServices && window.vscodeServices.get)
							) {
								const e = window.vscodeServices.get("ICommandService")
								if (e) {
									const t = i ? { taskId: i, content: l } : { content: `${s}: ${l}` }
									e.executeCommand("roo-cline.executeTask", t)
										.then(() => {
											console.log("[ChatStore] ✅ 成功调用 executeTask 命令")
										})
										.catch((e) => {
											console.error("[ChatStore] ❌ 调用 executeTask 命令失败:", e)
										})
								}
							}
						}
						const n = /@智能体\[([^\]]+)\]/g,
							a = t.matchAll(n)
						for (const r of a) {
							const e = r[1],
								s = r.index + r[0].length
							let i = t.length
							const o = t.indexOf("@", s)
							;-1 !== o && (i = o)
							const n = t.substring(s, i).trim()
							if (
								n &&
								(console.log(`[ChatStore] 检测到@智能体命令: ${e}, 内容: ${n}`),
								window.vscodeServices && window.vscodeServices.get)
							) {
								const t = window.vscodeServices.get("ICommandService")
								if (t) {
									const s = {
											编码助手: "code",
											架构师: "architect",
											测试工程师: "test",
											代码: "code",
											架构: "architect",
											测试: "test",
										},
										i = s[e] || e.toLowerCase().replace(/\s+/g, "-")
									t.executeCommand("roo-cline.executeTaskWithMode", { modeId: i, content: n })
										.then(() => {
											console.log("[ChatStore] ✅ 成功调用 executeTaskWithMode 命令")
										})
										.catch((e) => {
											console.error("[ChatStore] ❌ 调用 executeTaskWithMode 命令失败:", e)
										})
								}
							}
						}
					},
					insertMessage(e, [t, s]) {
						var i
						if (!t || !s) return
						console.log("===insertMessage===", t, s)
						const o = t.id || t.tmpId || "no-id"
						console.log("📦 [insertMessage] 插入消息: " + o, {
							id: t.id,
							tmpId: t.tmpId,
							content: null === (i = t.content) || void 0 === i ? void 0 : i.substring(0, 50),
							chatType: s.type,
							chatTargetId: s.targetId,
						}),
							t.id ||
								t.tmpId ||
								(t.tmpId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
						let n = s.type
						t.id && "PRIVATE" == n && t.id > e.privateMsgMaxId && (e.privateMsgMaxId = t.id),
							t.id && "GROUP" == n && t.id > e.groupMsgMaxId && (e.groupMsgMaxId = t.id)
						let a = this.getters.findChat(s)
						if ((console.log("===chat===", a), !a)) return
						Array.isArray(a.messages) || (a.messages = [])
						let r = this.getters.findMessage(a, t)
						if ((console.log("===message===", r), r))
							return (
								console.log("🔄 [insertMessage] 更新现有消息: " + o, {
									原有id: r.id,
									原有tmpId: r.tmpId,
									新id: t.id,
									新tmpId: t.tmpId,
								}),
								Object.assign(r, t),
								(a.stored = !1),
								void this.commit("saveToStorage")
							)
						if (
							(console.log("➕ [insertMessage] 插入新消息: " + o),
							t.type == Mi.IMAGE
								? (a.lastContent = "[图片]")
								: t.type == Mi.FILE
									? (a.lastContent = "[文件]")
									: t.type == Mi.AUDIO
										? (a.lastContent = "[语音]")
										: t.type == Mi.ACT_RT_VOICE
											? (a.lastContent = "[语音通话]")
											: t.type == Mi.ACT_RT_VIDEO
												? (a.lastContent = "[视频通话]")
												: (t.type != Mi.TEXT && t.type != Mi.RECALL && t.type != Mi.TIP_TEXT) ||
													(a.lastContent = t.content),
							(a.lastSendTime = t.sendTime),
							(a.sendNickName = t.sendNickName),
							t.selfSend ||
								t.status == Pi.READED ||
								t.status == Pi.RECALL ||
								t.type == Mi.TIP_TEXT ||
								a.unreadCount++,
							!t.selfSend && "GROUP" == a.type && t.atUserIds && t.status != Pi.READED)
						) {
							const e = Ri.state.userInfo
							if (e && e.id) {
								let s = e.id
								t.atUserIds.indexOf(s) >= 0 && (a.atMe = !0)
							}
							t.atUserIds.indexOf(-1) >= 0 && (a.atAll = !0)
						}
						if (
							t.type !== Mi.TIP_TEXT &&
							t.type !== Mi.TIP_TIME &&
							(!a.lastTimeTip || a.lastTimeTip < t.sendTime - 6e5)
						) {
							const e = {
								sendTime: t.sendTime,
								type: Mi.TIP_TIME,
								id: `time-${t.sendTime}-${Math.random().toString(36).substr(2, 6)}`,
							}
							console.log("⏰ [insertMessage] 插入时间消息: " + e.id),
								a.messages.push(e),
								(a.lastTimeTip = t.sendTime)
						}
						let l = a.messages.length
						if (t.id && t.id > 0)
							for (let d = 0; d < a.messages.length; d++) {
								const e = a.messages[d]
								if (e && e.id && t.id < e.id) {
									l = d
									break
								}
							}
						a.messages.splice(l, 0, t),
							console.log("[ChatStore] insertMessage - 消息信息:", {
								selfSend: t.selfSend,
								type: t.type,
								MESSAGE_TYPE_TEXT: Mi.TEXT,
								content: t.content,
								contentLength: t.content ? t.content.length : 0,
							})
						const c = window.terminal ? window.terminal : 2
						t.targetTerminal == c &&
							console.log("[ChatStore] 执行roo-code命令，执行终端：" + t.targetTerminal),
							(a.stored = !1),
							this.commit("saveToStorage")
					},
					batchInsertMessages(e, { messages: t, chatInfo: s }) {
						if (!t || !t.length || !s) return
						console.log(`📦 [batchInsertMessages] 批量插入${t.length}条消息到${s.showName || s.targetId}`)
						let i = this.getters.findChat(s)
						if (!i) return void console.warn("[batchInsertMessages] 找不到目标会话")
						Array.isArray(i.messages) || (i.messages = [])
						let o = null,
							n = 0
						t.forEach((t) => {
							if (
								(t.id ||
									t.tmpId ||
									(t.tmpId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
								t.id && "PRIVATE" == s.type && t.id > e.privateMsgMaxId && (e.privateMsgMaxId = t.id),
								t.id && "GROUP" == s.type && t.id > e.groupMsgMaxId && (e.groupMsgMaxId = t.id),
								!i.lastTimeTip || i.lastTimeTip < t.sendTime - 6e5)
							) {
								const e = {
									sendTime: t.sendTime,
									type: Mi.TIP_TIME,
									id: `time-${t.sendTime}-${Math.random().toString(36).substr(2, 6)}`,
								}
								i.messages.push(e), (i.lastTimeTip = t.sendTime)
							}
							i.messages.push(t), (o = t), n++
						}),
							o &&
								(o.type == Mi.IMAGE
									? (i.lastContent = "[图片]")
									: o.type == Mi.FILE
										? (i.lastContent = "[文件]")
										: o.type == Mi.AUDIO
											? (i.lastContent = "[语音]")
											: (i.lastContent = o.content),
								(i.lastSendTime = o.sendTime),
								(i.sendNickName = o.sendNickName)),
							(i.stored = !1),
							this.commit("saveToStorage"),
							console.log(`✅ [batchInsertMessages] 批量插入完成，新增${n}条消息`)
					},
					updateMessage(e, [t, s]) {
						let i = this.getters.findChat(s),
							o = this.getters.findMessage(i, t)
						o && (Object.assign(o, t), (i.stored = !1), this.commit("saveToStorage"))
					},
					deleteMessage(e, [t, s]) {
						let i = this.getters.findChat(s)
						for (let o in i.messages) {
							if (i.messages[o].id && i.messages[o].id == t.id) {
								i.messages.splice(o, 1)
								break
							}
							if (i.messages[o].tmpId && i.messages[o].tmpId == t.tmpId) {
								i.messages.splice(o, 1)
								break
							}
						}
						;(i.stored = !1), this.commit("saveToStorage")
					},
					recallMessage(e, [t, s]) {
						let i = this.getters.findChat(s)
						if (!i) return
						let o = t.content,
							n = t.selfSend ? "你" : "PRIVATE" == i.type ? "对方" : t.sendNickName
						for (let a in i.messages) {
							let e = i.messages[a]
							e.id &&
								e.id == o &&
								((e.status = Pi.RECALL),
								(e.content = n + "撤回了一条消息"),
								(e.type = Mi.TIP_TEXT),
								(i.lastContent = e.content),
								(i.lastSendTime = t.sendTime),
								(i.sendNickName = ""),
								t.selfSend || t.status == Pi.READED || i.unreadCount++),
								e.quoteMessage &&
									e.quoteMessage.id == t.id &&
									((e.quoteMessage.content = "引用内容已撤回"),
									(e.quoteMessage.status = Pi.RECALL),
									(e.quoteMessage.type = Mi.TIP_TEXT))
						}
						;(i.stored = !1), this.commit("saveToStorage")
					},
					ensureAgentChat(e, { parentChat: t, agent: s, ownerId: i }) {
						const o = `${t.type}_${t.targetId}_agent_${s.id}`
						let n = e.chats.find((e) => "AGENT" === e.type && e.targetId === o)
						return (
							n ||
								((n = {
									type: "AGENT",
									targetId: o,
									agentId: s.id,
									parentId: t.targetId,
									parentType: t.type,
									showName: `${t.showName} > ${s.name}`,
									headImage: s.avatar || "/img/agent-default.png",
									messages: [],
									lastContent: "",
									lastSendTime: Date.now(),
									unreadCount: 0,
									stored: !1,
									skipGeneralStorage: !0,
								}),
								e.chats.push(n),
								this.commit("saveToStorage")),
							n
						)
					},
					async saveAgentChat(e, t) {
						const s = Ri.state.userInfo.id,
							i = `chats-${s}-AGENT-${t.parentType}_${t.parentId}_${t.agentId}`
						t.stored = !0
						try {
							await Di.a.setItem(i, t), console.log("[AgentChat] 已保存会话:", i)
						} catch (o) {
							console.error("[AgentChat] 保存会话失败:", o)
						}
					},
					async loadAgentChats(e) {
						const t = Ri.state.userInfo.id
						try {
							const s = await Di.a.keys(),
								i = s.filter((e) => e.startsWith(`chats-${t}-AGENT-`))
							console.log(`[AgentChat] 发现 ${i.length} 个智能体会话`)
							for (const t of i) {
								const s = await Di.a.getItem(t)
								if (s) {
									const t = e.chats.find((e) => "AGENT" === e.type && e.targetId === s.targetId)
									t || e.chats.push(s)
								}
							}
						} catch (s) {
							console.error("[AgentChat] 加载智能体会话失败:", s)
						}
					},
					updateChatFromFriend(e, t) {
						let s = this.getters.findChatByFriend(t.id)
						!s ||
							(s.headImage == t.headImage && s.showName == t.nickName) ||
							((s.headImage = t.headImage),
							(s.showName = t.nickName),
							(s.stored = !1),
							this.commit("saveToStorage"))
					},
					updateChatFromUser(e) {
						let t = this.getters.findChatByFriend(e.id)
						!t ||
							(t.headImage == e.headImageThumb && t.showName == e.nickName) ||
							((t.headImage = e.headImageThumb),
							(t.showName = e.nickName),
							(t.stored = !1),
							this.commit("saveToStorage"))
					},
					updateChatFromGroup(e, t) {
						let s = this.getters.findChatByGroup(t.id)
						!s ||
							(s.headImage == t.headImageThumb && s.showName == t.showGroupName) ||
							((s.headImage = t.headImageThumb),
							(s.showName = t.showGroupName),
							(s.stored = !1),
							this.commit("saveToStorage"))
					},
					loadingPrivateMsg(e, t) {
						;(e.loadingPrivateMsg = t),
							!this.getters.isLoading() && Bi && Bi.length > 0
								? (console.log("[ChatStore] loadingPrivateMsg完成，刷新聊天列表"),
									this.commit("refreshChats"))
								: this.getters.isLoading() ||
									console.log("[ChatStore] loadingPrivateMsg完成，但无缓存数据，跳过刷新")
					},
					loadingGroupMsg(e, t) {
						;(e.loadingGroupMsg = t),
							!this.getters.isLoading() && Bi && Bi.length > 0
								? (console.log("[ChatStore] loadingGroupMsg完成，刷新聊天列表"),
									this.commit("refreshChats"))
								: this.getters.isLoading() ||
									console.log("[ChatStore] loadingGroupMsg完成，但无缓存数据，跳过刷新")
					},
					setLoadingChatState(e, t) {
						e.isLoadingChat = t
					},
					markChatsAsStored(e, t) {
						t.forEach((t) => {
							e.chats[t] && (e.chats[t].stored = !0)
						})
					},
					cleanEmptyMessages(e) {
						console.log("[ChatStore] 开始清理空消息"),
							e.chats.forEach((e) => {
								if (e.messages && e.messages.length > 0) {
									const t = e.messages.length
									e.messages = e.messages.filter((e) => {
										if (!e || void 0 === e.type || null === e.type)
											return console.log("[ChatStore] 过滤无效消息对象:", e), !1
										if (7 === e.type) return !0
										if (20 === e.type) return !0
										if (8 === e.type || 21 === e.type) {
											const t = e.content && "" !== e.content.trim()
											return t || console.log("[ChatStore] 过滤空系统消息:", e), t
										}
										if (0 === e.type) {
											const t = e.content && "" !== e.content.trim()
											return t || console.log("[ChatStore] 过滤空文本消息:", e), t
										}
										return (
											1 === e.type ||
												2 === e.type ||
												3 === e.type ||
												4 === e.type ||
												5 === e.type ||
												e.type,
											!0
										)
									})
									const s = e.messages.length
									t !== s &&
										(console.log(`[ChatStore] 清理了 ${e.showName} 的 ${t - s} 条空消息`),
										(e.stored = !1))
								}
							})
					},
					sortTerminalChatsToTop(e) {
						console.log("[ChatStore] 执行终端会话置顶排序")
						const t = [],
							s = []
						e.chats.forEach((e) => {
							e.isTerminalInbox && !e.delete ? t.push(e) : e.delete || s.push(e)
						}),
							console.log(`[ChatStore] 找到 ${t.length} 个终端会话，${s.length} 个普通会话`),
							t.sort((e, t) => {
								const s = e.receivingTerminal || 0,
									i = t.receivingTerminal || 0
								return s - i
							}),
							s.sort((e, t) => (t.lastSendTime || 0) - (e.lastSendTime || 0)),
							(e.chats = [...t, ...s]),
							console.log("[ChatStore] 终端会话置顶完成")
					},
					refreshChats(e) {
						if (!Bi || 0 === Bi.length)
							return void console.log("[ChatStore] refreshChats: 缓存为空，保持当前聊天数据不变")
						console.log(`[ChatStore] refreshChats: 从缓存恢复${Bi.length}个聊天`)
						const t = [],
							s = []
						Bi.forEach((e) => {
							e.isTerminalInbox && !e.delete ? t.push(e) : e.delete || s.push(e)
						}),
							t.sort((e, t) => {
								const s = e.receivingTerminal || 0,
									i = t.receivingTerminal || 0
								return s - i
							}),
							s.sort((e, t) => t.lastSendTime - e.lastSendTime),
							(e.chats = [...t, ...s]),
							(Bi = null),
							console.log("[ChatStore] refreshChats完成，终端会话已置顶"),
							this.commit("saveToStorage")
					},
					saveToStorage(e) {
						Ui && clearTimeout(Ui)
						const t = []
						e.chats.forEach((e, s) => {
							e.stored || ((e.stored = !0), t.push({ ...e, index: s }))
						}),
							(Ui = setTimeout(() => {
								console.log("[ChatStore] 防抖保存触发")
								const t = Ri.state.userInfo
								if (!t || !t.id) return void console.warn("[ChatStore] 保存失败：用户信息不完整")
								if (!e.chats || 0 === e.chats.length)
									return void console.warn(
										"[ChatStore] ⚠️ 检测到空的聊天数据，跳过保存操作以防数据丢失",
									)
								let s = t.id
								console.log(`[ChatStore] 🔧 防抖保存聊天数据，用户ID: ${s}, 聊天数: ${e.chats.length}`),
									Promise.resolve().then(async () => {
										try {
											if (Oi.isInVSCodeEnvironment()) {
												const t = {
														chats: e.chats,
														privateMsgMaxId: e.privateMsgMaxId,
														groupMsgMaxId: e.groupMsgMaxId,
														lastSync: Date.now(),
													},
													i = await Oi.saveVueChatsDataToVSCode(t, s)
												i &&
													console.log(
														"[ChatStore] ✅ 防抖保存到VSCode存储成功，聊天数: " +
															e.chats.length,
													)
											}
										} catch (t) {
											console.warn("[ChatStore] VSCode存储同步失败:", t)
										}
									})
								let i = "chats-" + s
								Di.a
									.getItem(i)
									.then((t) => {
										let s = (null === t || void 0 === t ? void 0 : t.chatKeys) || []
										console.log(
											`[ChatStore] 🔧 保存前检查：现有chatKeys数量: ${s.length}, 当前chats数量: ${e.chats.length}`,
										)
										const o = s.filter((e) => e.includes("_agent_"))
										if (e.chats && e.chats.length > 0) {
											console.log(
												`[ChatStore] 🔧 重新构建chatKeys，因为有${e.chats.length}个聊天需要保存，保留${o.length}个智能体会话`,
											),
												(s = [...o])
											const t = new Set(),
												n = []
											e.chats.forEach((e, o) => {
												if (e.skipGeneralStorage) return
												let n = `${i}-${e.type}-${e.targetId}`
												var a
												;(t.add(n), e.isTerminalInbox) &&
													console.log("💾 [保存终端会话] " + n, {
														type: e.type,
														targetId: e.targetId,
														isTerminalInbox: e.isTerminalInbox,
														isTerminalChat: e.isTerminalChat,
														receivingTerminal: e.receivingTerminal,
														messagesCount:
															(null === (a = e.messages) || void 0 === a
																? void 0
																: a.length) || 0,
														showName: e.showName,
														stored: e.stored,
														delete: e.delete,
														index: o,
													})
												e.delete ? Di.a.removeItem(n) : Di.a.setItem(n, e), s.push(n)
											}),
												n.length > 0 &&
													console.warn(`🚨 [保存] 跳过了${n.length}个重复会话:`, n)
											const a = s.length
											;(s = [...new Set(s)]),
												a !== s.length &&
													console.warn(
														`🔧 [保存] chatKeys去重：${a} -> ${s.length}，去除了${a - s.length}个重复项`,
													)
										} else {
											const e = s.filter((e) => e.includes("_agent_"))
											e.length > 0
												? console.log(
														`[ChatStore] 🔧 防抖保存：保持现有chatKeys (${s.length}个)，其中包含${e.length}个智能体会话`,
													)
												: console.log(
														`[ChatStore] 🔧 防抖保存：保持现有chatKeys (${s.length}个)，因为当前无聊天数据需要保存`,
													)
										}
										console.log(
											`[ChatStore] 🔧 最终保存：chatKeys数量: ${s.length}, privateMsgMaxId: ${e.privateMsgMaxId}, groupMsgMaxId: ${e.groupMsgMaxId}`,
										),
											Di.a.setItem(i, {
												privateMsgMaxId: e.privateMsgMaxId,
												groupMsgMaxId: e.groupMsgMaxId,
												chatKeys: s,
											})
									})
									.catch((t) => {
										console.error("[ChatStore] 获取现有chatKeys失败:", t),
											Di.a.setItem(i, {
												privateMsgMaxId: e.privateMsgMaxId,
												groupMsgMaxId: e.groupMsgMaxId,
												chatKeys: [],
											})
									})
							}, 300))
					},
					saveToStorageImmediate(e) {
						if (this.getters.isLoading()) return void console.log("[ChatStore] 加载中，跳过保存操作")
						const t = Ri.state.userInfo
						if (!t || !t.id) return void console.warn("[ChatStore] 用户信息未加载，无法保存聊天数据")
						var s
						if (!e.chats || 0 === e.chats.length)
							return (
								console.warn("[ChatStore] ⚠️ 检测到空的聊天数据，跳过保存操作以防数据丢失"),
								void console.warn("[ChatStore] 当前状态:", {
									chatsLength: (null === (s = e.chats) || void 0 === s ? void 0 : s.length) || 0,
									userId: t.id,
									hasChats: !!e.chats,
								})
							)
						let i = t.id,
							o = "chats-" + i
						console.log(`[ChatStore] 🔧 开始立即保存聊天数据，用户ID: ${i}, 聊天数: ${e.chats.length}`),
							Promise.resolve().then(async () => {
								try {
									if (Oi.isInVSCodeEnvironment()) {
										if (!e.chats || 0 === e.chats.length)
											return void console.warn(
												"[ChatStore] ⚠️ 保存时再次检测到空数据，跳过VSCode存储保存",
											)
										const t = {
											chats: e.chats,
											privateMsgMaxId: e.privateMsgMaxId,
											groupMsgMaxId: e.groupMsgMaxId,
											lastSync: Date.now(),
										}
										console.log("[ChatStore] 📤 准备保存到VSCode存储，数据概览:", {
											chatsCount: t.chats.length,
											privateMsgMaxId: t.privateMsgMaxId,
											groupMsgMaxId: t.groupMsgMaxId,
										})
									}
								} catch (t) {
									console.warn("[ChatStore] VSCode存储同步失败:", t)
								}
							}),
							Di.a
								.getItem(o)
								.then((t) => {
									let s = (null === t || void 0 === t ? void 0 : t.chatKeys) || []
									console.log(
										`[ChatStore] 🔧 立即保存前检查：现有chatKeys数量: ${s.length}, 当前chats数量: ${e.chats.length}`,
									)
									const i = s.filter((e) => e.includes("_agent_"))
									if (e.chats && e.chats.length > 0)
										console.log(
											`[ChatStore] 🔧 立即保存：重新构建chatKeys，因为有${e.chats.length}个聊天需要保存，保留${i.length}个智能体会话`,
										),
											(s = [...i]),
											e.chats.forEach((e) => {
												if (e.skipGeneralStorage) return
												let t = `${o}-${e.type}-${e.targetId}`
												e.stored ||
													(e.delete ? Di.a.removeItem(t) : Di.a.setItem(t, e),
													(e.stored = !0)),
													s.push(t)
											})
									else {
										const e = s.filter((e) => e.includes("_agent_"))
										e.length > 0
											? console.log(
													`[ChatStore] 🔧 立即保存：保持现有chatKeys (${s.length}个)，其中包含${e.length}个智能体会话`,
												)
											: console.log(
													`[ChatStore] 🔧 立即保存：保持现有chatKeys (${s.length}个)，因为当前无聊天数据需要保存`,
												)
									}
									const n = s.length
									;(s = [...new Set(s)]),
										n !== s.length &&
											console.warn(
												`🔧 [立即保存] chatKeys去重：${n} -> ${s.length}，去除了${n - s.length}个重复项`,
											),
										Di.a.setItem(o, {
											privateMsgMaxId: e.privateMsgMaxId,
											groupMsgMaxId: e.groupMsgMaxId,
											chatKeys: s,
										})
								})
								.catch((e) => {
									console.error("[ChatStore] 立即保存获取现有chatKeys失败:", e)
								})
					},
					clear(e) {
						console.log("[ChatStore] 🔧 开始清除聊天数据"), (Bi = null)
						const t = e.chats.filter((e) => e.skipGeneralStorage)
						;(e.chats = t), (e.activeChat = null), (this.privateMsgMaxId = 0), (this.groupMsgMaxId = 0)
					},
					updatePrivateMsgMaxId(e, t) {
						t &&
							t > e.privateMsgMaxId &&
							(console.log(`[ChatStore] 更新privateMsgMaxId: ${e.privateMsgMaxId} -> ${t}`),
							(e.privateMsgMaxId = t),
							this.commit("saveMaxIdImmediate"))
					},
					saveMaxIdImmediate(e) {
						const t = Ri.state.userInfo
						if (!t || !t.id) return void console.warn("[ChatStore] 无法保存maxId：用户信息不完整")
						const s = t.id,
							i = "chats-" + s
						Di.a.getItem(i).then((t) => {
							const s = (null === t || void 0 === t ? void 0 : t.chatKeys) || [],
								o = { privateMsgMaxId: e.privateMsgMaxId, groupMsgMaxId: e.groupMsgMaxId, chatKeys: s }
							Di.a
								.setItem(i, o)
								.then(() => {
									console.log(
										"[ChatStore] ✅ maxId已立即保存到IndexedDB: privateMsgMaxId=" +
											e.privateMsgMaxId,
									)
								})
								.catch((e) => {
									console.error("[ChatStore] 保存maxId失败:", e)
								})
						})
					},
					cleanDuplicateChats(e) {
						console.log("🔧 [cleanDuplicateChats] 开始清理重复会话...")
						const t = [],
							s = [],
							i = new Set()
						e.chats.forEach((e, o) => {
							let n
							var a
							;((n = e.isTerminalInbox ? "terminal-" + e.receivingTerminal : `${e.type}-${e.targetId}`),
							i.has(n))
								? (s.push({ index: o, chatKey: n, chat: e }),
									console.warn("🚨 [cleanDuplicateChats] 发现重复会话: " + n, {
										showName: e.showName,
										messagesCount:
											(null === (a = e.messages) || void 0 === a ? void 0 : a.length) || 0,
										lastSendTime: e.lastSendTime,
									}))
								: (i.add(n), t.push(e))
						}),
							s.length > 0
								? (console.warn(`🧹 [cleanDuplicateChats] 清理了${s.length}个重复会话:`, s),
									(e.chats = t),
									e.activeChat &&
										!t.includes(e.activeChat) &&
										(console.warn("⚠️ [cleanDuplicateChats] 当前激活会话被清理，重置激活状态"),
										(e.activeChat = null)),
									this.commit("saveToStorage"))
								: console.log("✅ [cleanDuplicateChats] 未发现重复会话，数据结构正常")
					},
					generateChatKey(e, t) {
						if (t.isTerminalInbox) {
							var s
							const e = null === (s = Ri.state.userInfo) || void 0 === s ? void 0 : s.id
							return `chats-${e}-PRIVATE-${e}_${t.receivingTerminal}`
						}
						{
							var i
							const e = null === (i = Ri.state.userInfo) || void 0 === i ? void 0 : i.id
							return `chats-${e}-${t.type}-${t.targetId}`
						}
					},
					parseTargetIdFromKey(e, t) {
						if (t.includes("_")) {
							const e = t.split("_")
							return parseInt(e[e.length - 1])
						}
						{
							const e = t.split("-")
							return parseInt(e[e.length - 1])
						}
					},
				},
				actions: {
					async switchToChat(e, t) {
						var s
						const i = e.getters.findChats(),
							o = i[t]
						o
							? (e.commit("activeChat", t),
								console.log(
									`[ChatStore] ✅ 切换到会话: ${o.showName || o.name}，消息数: ${(null === (s = o.messages) || void 0 === s ? void 0 : s.length) || 0}`,
								))
							: console.warn(`[ChatStore] 会话索引 ${t} 无效`)
					},
					async loadChat(e) {
						if ((console.log("[ChatStore] 🔧 开始加载聊天数据"), e.state.isLoadingChat))
							console.log("[ChatStore] 🛡️ 检测到正在加载聊天数据，跳过重复请求")
						else if (e.state.chats && e.state.chats.length > 0)
							console.log(`[ChatStore] 🛡️ 已有${e.state.chats.length}个聊天会话，跳过重复加载`)
						else {
							e.commit("setLoadingChatState", !0)
							try {
								const s = Ri.state.userInfo
								if (!s || !s.id)
									return void console.warn("[ChatStore] 等待用户信息超时或失败，无法加载聊天数据")
								let i = s.id,
									o = "chats-" + i
								console.log(`[ChatStore] 用户信息已加载，用户ID: ${i}，开始加载聊天数据`),
									console.log("===key===")
								const n = await Di.a.getItem(o)
								if ((console.log("===key===", o, n), !n))
									return (
										console.log("[ChatStore] 没有找到本地聊天数据"),
										(e.state.privateMsgMaxId = 0),
										(e.state.groupMsgMaxId = 0),
										void (e.state.terminalMsgMaxId = 0)
									)
								if (n.chats)
									return (
										console.log(`[ChatStore] 从localForage加载到${n.chats.length}个聊天会话`),
										e.commit("initChats", n),
										void e.commit("setLoadingChatState", !1)
									)
								if (n.chatKeys) {
									const s = []
									n.chatKeys.forEach((e) => {
										s.push(Di.a.getItem(e))
									})
									const i = await Promise.all(s),
										o = []
									for (let a = 0; a < n.chatKeys.length; a++) {
										const s = n.chatKeys[a],
											r = i[a]
										if (r)
											if (s.includes("_agent_") && !s.startsWith("chats-")) {
												const i = s.split("_agent_")
												if (2 === i.length) {
													var t
													const n = i[0],
														a = i[1] || r.agentId
													let l = "PRIVATE",
														c = n
													const d = n.split("_")
													d.length >= 2 &&
														("PRIVATE" === d[0] || "GROUP" === d[0]) &&
														((l = d[0]), (c = d.slice(1).join("_")))
													let h = r.parentName || "会话"
													if (!r.parentName) {
														const t =
															o.find((e) => e.targetId === c && e.type === l) ||
															e.state.chats.find((e) => e.targetId === c && e.type === l)
														t && (h = t.showName || t.name || "会话")
													}
													const u = r.agentName || "智能体",
														m = {
															type: "AGENT",
															targetId: s,
															agentId: a,
															parentId: c,
															parentType: l,
															showName: `${h} > ${u}`,
															headImage: "/img/agent-default.png",
															messages: r.messages || [],
															lastContent:
																(null === (t = r.messages) || void 0 === t
																	? void 0
																	: t.length) > 0
																	? r.messages[r.messages.length - 1].content
																	: "",
															lastSendTime: r.startTime || Date.now(),
															unreadCount: 0,
															skipGeneralStorage: !0,
														}
													o.push(m)
												}
											} else r && r.type && o.push(r)
									}
									return (
										(n.chats = o),
										console.log(
											`[ChatStore] 从localForage chatKeys加载到${n.chats.length}个聊天会话`,
										),
										e.commit("initChats", n),
										void e.commit("setLoadingChatState", !1)
									)
								}
							} catch (s) {
								throw (console.error("加载消息失败:", s), s)
							} finally {
								e.commit("setLoadingChatState", !1)
							}
						}
					},
					async migrateToVSCodeIfNeeded(e) {
						try {
							const e = Oi.getMigrationStatus()
							if (e.isCompleted) return console.log("[ChatStore] 数据已迁移到VSCode存储"), e
							const t = Ri.state.userInfo
							if (!t || !t.id)
								return (
									console.warn("[ChatStore] 用户信息仍未加载，无法执行迁移"),
									{ success: !1, message: "用户信息未加载" }
								)
							const s = t.id,
								i = "chats-" + s,
								o = await Di.a.getItem(i)
							if ((console.log(`[ChatStore] 检查迁移数据，key: ${i}, 数据:`, o), !o))
								return (
									console.log("[ChatStore] 没有localForage数据需要迁移"),
									(Oi.migrationStatus.isCompleted = !0),
									localStorage.setItem("vscode_migration_status", JSON.stringify(Oi.migrationStatus)),
									{ success: !0, message: "没有数据需要迁移" }
								)
							let n = []
							if (o.chats) n = o.chats
							else if (o.chatKeys) {
								console.log(`[ChatStore] 发现 chatKeys 格式数据，开始加载 ${o.chatKeys.length} 个聊天`)
								const e = o.chatKeys.map((e) => Di.a.getItem(e)),
									t = await Promise.all(e)
								n = t.filter((e) => e)
							}
							if (n.length > 0) {
								console.log(`[ChatStore] 开始迁移${n.length}个聊天会话到VSCode存储...`)
								const e = await Oi.migrateFromLocalForage({ chats: n })
								return console.log("[ChatStore] VSCode存储迁移结果:", e), e
							}
							return (
								console.log("[ChatStore] 没有有效的聊天数据需要迁移"),
								(Oi.migrationStatus.isCompleted = !0),
								localStorage.setItem("vscode_migration_status", JSON.stringify(Oi.migrationStatus)),
								{ success: !0, message: "没有有效数据需要迁移" }
							)
						} catch (t) {
							return (
								console.error("[ChatStore] VSCode存储迁移失败:", t), { success: !1, message: t.message }
							)
						}
					},
					async searchAllMessages(e, { query: t, options: s = {} }) {
						try {
							if (Oi.isInVSCodeEnvironment()) {
								const e = await Oi.searchAllMessages(t, s)
								return console.log(`[ChatStore] FTS搜索"${t}"找到${e.length}条结果`), e
							}
							return e.dispatch("searchLocalMessages", { query: t, options: s })
						} catch (i) {
							return console.error("[ChatStore] 搜索消息失败:", i), []
						}
					},
					searchLocalMessages(e, { query: t, options: s = {} }) {
						const i = t.toLowerCase(),
							o = []
						return (
							e.state.chats.forEach((e) => {
								e.messages &&
									e.messages.forEach((t) => {
										t.content &&
											t.content.toLowerCase().includes(i) &&
											o.push({
												messageId: t.id || t.tmpId,
												sessionId: e.targetId,
												sessionType: "vue-im",
												sessionTitle: e.showName || e.targetId,
												content: t.content,
												sender: t.selfSend ? "我" : t.sendNickName || "对方",
												timestamp: t.sendTime,
												highlightedContent: t.content,
											})
									})
							}),
							o.slice(0, s.limit || 50)
						)
					},
					async getFTSStats(e) {
						try {
							if (Oi.isInVSCodeEnvironment()) return await Oi.getFTSIndexStats()
							{
								let t = 0
								return (
									e.state.chats.forEach((e) => {
										e.messages && (t += e.messages.length)
									}),
									{ totalMessages: t, indexSize: 100 * t, lastUpdated: Date.now() }
								)
							}
						} catch (t) {
							return (
								console.error("[ChatStore] 获取FTS统计失败:", t),
								{ totalMessages: 0, indexSize: 0, lastUpdated: 0 }
							)
						}
					},
					async sendToTargetTerminal(e, { content: t, targetTerminal: s, type: i = 0, fileInfo: o = null }) {
						var n
						const a = this.getters.getCurrentTerminal(),
							r = null === (n = Ri.state.userInfo) || void 0 === n ? void 0 : n.id
						if (!r) throw new Error("用户未登录")
						if (s === a) throw new Error("不能发送消息给当前终端")
						let l = t
						2 === i && o && (l = JSON.stringify({ name: o.name, size: o.size, url: o.url }))
						const c = { recvId: r, content: l, type: i, targetTerminal: s, senderTerminal: a }
						try {
							const t = sessionStorage.getItem("accessToken")
							if (!t) throw new Error("用户未登录，请先登录")
							const o = await ve({
								url: "/message/private/send-to-terminal",
								method: "post",
								data: c,
								headers: { accessToken: encodeURIComponent(t) },
							})
							if (o && o.id) {
								const t = {
									type: "PRIVATE",
									targetId: `${r}_${s}`,
									senderTerminal: a,
									targetTerminal: s,
									showName: this.getters.getTerminalName(s) + "端",
									headImage: this.getters.getTerminalIcon(s),
									isTerminalChat: !0,
								}
								e.commit("openChat", t)
								const n = Ri.state.userInfo,
									c = {
										id: o.id,
										content: l,
										type: i,
										sendId: r,
										recvId: r,
										sendTime: new Date().getTime(),
										sendNickName: (null === n || void 0 === n ? void 0 : n.nickName) || "我",
										selfSend: !0,
										status: 1,
										senderTerminal: a,
										targetTerminal: s,
									}
								e.commit("insertMessage", [c, t])
								const d = e.getters.findChatIdx(t)
								d > 0 && e.commit("moveTop", d),
									console.log(
										`[ChatStore] 🔧 终端消息发送成功，发送到 ${this.getters.getTerminalName(s)}端`,
									)
							}
							return o
						} catch (d) {
							throw (console.error("发送终端间消息失败:", d), d)
						}
					},
					async loadTerminalChatHistory(e, { senderTerminal: t, page: s = 1, size: i = 20 }) {
						try {
							const e = sessionStorage.getItem("accessToken")
							if (!e) throw new Error("用户未登录，请先登录")
							const o = await ve({
								url: "/message/private/terminal-chat-history",
								method: "get",
								params: { senderTerminal: t, page: s, size: i },
								headers: { accessToken: encodeURIComponent(e) },
							})
							return o || []
						} catch (o) {
							return console.error("加载终端聊天历史失败:", o), []
						}
					},
					async loadTerminalChatLatestMessages(e) {
						try {
							const e = sessionStorage.getItem("accessToken")
							if (!e) throw new Error("用户未登录，请先登录")
							const t = await ve({
								url: "/message/private/terminal-chat-latest",
								method: "get",
								headers: { accessToken: encodeURIComponent(e) },
							})
							return t || {}
						} catch (t) {
							return console.error("获取终端聊天最新消息失败:", t), {}
						}
					},
					async initializeTerminalChats(e) {
						var t
						console.log("🔧 [initializeTerminalChats] 开始初始化其他终端会话...")
						const s = await e.dispatch("loadTerminalChatLatestMessages"),
							i = null === (t = Ri.state.userInfo) || void 0 === t ? void 0 : t.id,
							o = this.getters.getCurrentTerminal()
						console.log(`🔧 [initializeTerminalChats] 当前用户ID: ${i}, 当前终端: ${o}`),
							console.log("🔧 [initializeTerminalChats] 来自其他终端的最新消息:", s),
							i
								? (Object.entries(s).forEach(([t, s]) => {
										const n = parseInt(t)
										if (n === o)
											return void console.log("🔧 [initializeTerminalChats] 跳过当前终端: " + n)
										const a = {
											type: "PRIVATE",
											targetId: `${i}_${n}`,
											senderTerminal: n,
											showName: e.getters.getTerminalName(n) + "端",
											headImage: e.getters.getTerminalIcon(n),
											isTerminalChat: !0,
											lastContent: s.content,
											lastSendTime: new Date(s.sendTime).getTime(),
										}
										console.log(
											`🔧 [initializeTerminalChats] 为${e.getters.getTerminalName(n)}端创建会话:`,
											a,
										),
											e.commit("openChat", a)
									}),
									console.log("✅ [initializeTerminalChats] 其他终端会话初始化完成"))
								: console.warn("⚠️ [initializeTerminalChats] 用户ID为空，跳过初始化")
					},
				},
				getters: {
					isLoading: (e) => () => e.loadingPrivateMsg || e.loadingGroupMsg,
					findChats: (e, t) => () =>
						Bi && Bi.length > 0 && t.isLoading()
							? (console.log("===缓存cacheChats===", Bi), Bi)
							: (console.log("===state.chats===", e.chats), e.chats),
					isSameChat: (e, t) => (e, t) => e.type === t.type && e.targetId === t.targetId,
					separatedChats: (e, t) => {
						const s = t.findChats()
						return {
							aiChats: s.filter((e) => "AI" === e.type),
							humanChats: s
								.filter((e) => "AI" !== e.type)
								.sort((e, t) => t.lastSendTime - e.lastSendTime),
						}
					},
					findChatIdx: (e, t) => (e) => {
						let s = t.findChats()
						for (let i in s) if (t.isSameChat(s[i], e)) return i
					},
					findChat: (e, t) => (e) => {
						let s = t.findChats(),
							i = t.findChatIdx(e)
						return s[i]
					},
					findChatByFriend: (e, t) => (e) => {
						let s = t.findChats()
						return s.find((t) => "PRIVATE" == t.type && !t.isTerminalInbox && t.targetId == e)
					},
					findChatByGroup: (e, t) => (e) => {
						let s = t.findChats()
						return s.find((t) => "GROUP" == t.type && t.targetId == e)
					},
					findAgentChat: (e) => (t, s, i) =>
						e.chats.find(
							(e) => "AGENT" === e.type && e.parentType === t && e.parentId === s && e.agentId === i,
						),
					getChatAgents: (e) => (t) =>
						e.chats.filter(
							(e) => "AGENT" === e.type && e.parentType === t.type && e.parentId === t.targetId,
						),
					findMessage: (e) => (e, t) => {
						if (!e) return null
						for (let s in e.messages) {
							if (t.id && e.messages[s].id == t.id) return e.messages[s]
							if (t.tmpId && e.messages[s].tmpId && e.messages[s].tmpId == t.tmpId) return e.messages[s]
						}
					},
					getTerminalName: (e) => (e) => {
						const t = {
							0: "傻蛋网页",
							1: "傻蛋精灵App",
							2: "我的电脑",
							3: "我的云电脑",
							4: "傻蛋浏览器",
							5: "MCP",
						}
						return t[e] || "未知"
					},
					getTerminalIcon: (e) => (e) => {
						const t = { 0: "🌐", 1: "📱", 2: "💻", 3: "🖥️", 4: "🔌", 5: "🤖" }
						return t[e] || "❓"
					},
					getCurrentTerminal: (e) => () =>
						"undefined" !== typeof window ? (window.isVSCodeEnvironment ? 2 : 0) : 1,
				},
			},
			ji = {
				state: { friends: [], timer: null, activeFriend: {} },
				mutations: {
					setFriends(e, t) {
						t.forEach((e) => {
							;(e.online = !1), (e.onlineWeb = !1), (e.onlineApp = !1)
						}),
							(e.friends = t)
						try {
							var s
							if (null !== (s = window.vscodeServices) && void 0 !== s && s.get("ICommandService")) {
								var i, o
								const t =
										(null === (i = this.state.groupStore) || void 0 === i ? void 0 : i.groups) ||
										[],
									s = null === (o = this.state.userStore) || void 0 === o ? void 0 : o.userInfo,
									n = null !== s && void 0 !== s && s.id ? String(s.id) : null
								n &&
									window.vscodeServices
										.get("ICommandService")
										.executeCommand("roo-cline.updateImContacts", {
											userId: n,
											friends: e.friends,
											groups: t,
										})
										.catch((e) => console.warn("Failed to sync friends to Roo-Code:", e))
							}
						} catch (n) {
							console.warn("VSCode ICommandService not available for syncing friends:", n)
						}
					},
					setActiveFriend(e, t) {
						e.activeFriend = t
					},
					updateFriend(e, t) {
						e.friends.forEach((s, i) => {
							if (s.id == t.id) {
								let s = e.friends[i].online
								Object.assign(e.friends[i], t), (e.friends[i].online = s)
							}
						})
					},
					removeFriend(e, t) {
						e.friends.filter((e) => e.id == t).forEach((e) => (e.deleted = !0))
						try {
							var s
							if (null !== (s = window.vscodeServices) && void 0 !== s && s.get("ICommandService")) {
								var i, o
								const t =
										(null === (i = this.state.groupStore) || void 0 === i ? void 0 : i.groups) ||
										[],
									s = null === (o = this.state.userStore) || void 0 === o ? void 0 : o.userInfo,
									n = null !== s && void 0 !== s && s.id ? String(s.id) : null
								n &&
									window.vscodeServices
										.get("ICommandService")
										.executeCommand("roo-cline.updateImContacts", {
											userId: n,
											friends: e.friends,
											groups: t,
										})
										.catch((e) => console.warn("Failed to sync friends to Roo-Code:", e))
							}
						} catch (n) {
							console.warn("VSCode ICommandService not available for syncing friends:", n)
						}
					},
					addFriend(e, t) {
						e.friends.some((e) => e.id == t.id) ? this.commit("updateFriend", t) : e.friends.unshift(t)
						try {
							var s
							if (null !== (s = window.vscodeServices) && void 0 !== s && s.get("ICommandService")) {
								var i, o
								const t =
										(null === (i = this.state.groupStore) || void 0 === i ? void 0 : i.groups) ||
										[],
									s = null === (o = this.state.userStore) || void 0 === o ? void 0 : o.userInfo,
									n = null !== s && void 0 !== s && s.id ? String(s.id) : null
								n &&
									window.vscodeServices
										.get("ICommandService")
										.executeCommand("roo-cline.updateImContacts", {
											userId: n,
											friends: e.friends,
											groups: t,
										})
										.catch((e) => console.warn("Failed to sync friends to Roo-Code:", e))
							}
						} catch (n) {
							console.warn("VSCode ICommandService not available for syncing friends:", n)
						}
					},
					refreshOnlineStatus(e) {
						if (null == sessionStorage.getItem("accessToken")) return
						let t = e.friends.filter((e) => !e.deleted).map((e) => e.id)
						0 != t.length &&
							(ve({ url: "/user/terminal/online", method: "get", params: { userIds: t.join(",") } }).then(
								(e) => {
									this.commit("setOnlineStatus", e)
								},
							),
							e.timer && clearTimeout(e.timer),
							(e.timer = setTimeout(() => {
								this.commit("refreshOnlineStatus")
							}, 3e4)))
					},
					setOnlineStatus(e, t) {
						e.friends.forEach((e) => {
							let s = t.find((t) => e.id == t.userId)
							s
								? ((e.online = !0),
									(e.onlineWeb = s.terminals.indexOf(_i.WEB) >= 0),
									(e.onlineApp = s.terminals.indexOf(_i.APP) >= 0))
								: ((e.online = !1), (e.onlineWeb = !1), (e.onlineApp = !1))
						}),
							e.friends.sort((e, t) => (e.online && !t.online ? -1 : t.online && !e.online ? 1 : 0))
					},
					clear(e) {
						e.timer && clearTimeout(e.timer), (e.friends = []), (e.timer = null)
					},
				},
				actions: {
					loadFriend(e) {
						return new Promise((t, s) => {
							ve({ url: "/friend/list", method: "GET" })
								.then((s) => {
									e.commit("setFriends", s), e.commit("refreshOnlineStatus"), t()
								})
								.catch(() => {
									s()
								})
						})
					},
				},
				getters: {
					isFriend: (e) => (t) => e.friends.filter((e) => !e.deleted).some((e) => e.id == t),
					findFriend: (e) => (t) => e.friends.find((e) => e.id == t),
				},
			},
			Hi = {
				state: { groups: [], activeGroup: {} },
				mutations: {
					setGroups(e, t) {
						e.groups = t
						try {
							var s
							if (null !== (s = window.vscodeServices) && void 0 !== s && s.get("ICommandService")) {
								var i, o
								const t =
										(null === (i = this.state.friendStore) || void 0 === i ? void 0 : i.friends) ||
										[],
									s = null === (o = this.state.userStore) || void 0 === o ? void 0 : o.userInfo,
									n = null !== s && void 0 !== s && s.id ? String(s.id) : null
								n &&
									window.vscodeServices
										.get("ICommandService")
										.executeCommand("roo-cline.updateImContacts", {
											userId: n,
											friends: t,
											groups: e.groups,
										})
										.catch((e) => console.warn("Failed to sync groups to Roo-Code:", e))
							}
						} catch (n) {
							console.warn("VSCode ICommandService not available for syncing groups:", n)
						}
					},
					addGroup(e, t) {
						e.groups.some((e) => e.id == t.id) ? this.commit("updateGroup", t) : e.groups.unshift(t)
						try {
							var s
							if (null !== (s = window.vscodeServices) && void 0 !== s && s.get("ICommandService")) {
								var i, o
								const t =
										(null === (i = this.state.friendStore) || void 0 === i ? void 0 : i.friends) ||
										[],
									s = null === (o = this.state.userStore) || void 0 === o ? void 0 : o.userInfo,
									n = null !== s && void 0 !== s && s.id ? String(s.id) : null
								n &&
									window.vscodeServices
										.get("ICommandService")
										.executeCommand("roo-cline.updateImContacts", {
											userId: n,
											friends: t,
											groups: e.groups,
										})
										.catch((e) => console.warn("Failed to sync groups to Roo-Code:", e))
							}
						} catch (n) {
							console.warn("VSCode ICommandService not available for syncing groups:", n)
						}
					},
					removeGroup(e, t) {
						e.groups.filter((e) => e.id == t).forEach((e) => (e.quit = !0))
						try {
							var s
							if (null !== (s = window.vscodeServices) && void 0 !== s && s.get("ICommandService")) {
								var i, o
								const t =
										(null === (i = this.state.friendStore) || void 0 === i ? void 0 : i.friends) ||
										[],
									s = null === (o = this.state.userStore) || void 0 === o ? void 0 : o.userInfo,
									n = null !== s && void 0 !== s && s.id ? String(s.id) : null
								n &&
									window.vscodeServices
										.get("ICommandService")
										.executeCommand("roo-cline.updateImContacts", {
											userId: n,
											friends: t,
											groups: e.groups,
										})
										.catch((e) => console.warn("Failed to sync groups to Roo-Code:", e))
							}
						} catch (n) {
							console.warn("VSCode ICommandService not available for syncing groups:", n)
						}
					},
					updateGroup(e, t) {
						e.groups.forEach((s, i) => {
							s.id == t.id && Object.assign(e.groups[i], t)
						})
						try {
							var s
							if (null !== (s = window.vscodeServices) && void 0 !== s && s.get("ICommandService")) {
								var i, o
								const t =
										(null === (i = this.state.friendStore) || void 0 === i ? void 0 : i.friends) ||
										[],
									s = null === (o = this.state.userStore) || void 0 === o ? void 0 : o.userInfo,
									n = null !== s && void 0 !== s && s.id ? String(s.id) : null
								n &&
									window.vscodeServices
										.get("ICommandService")
										.executeCommand("roo-cline.updateImContacts", {
											userId: n,
											friends: t,
											groups: e.groups,
										})
										.catch((e) => console.warn("Failed to sync groups to Roo-Code:", e))
							}
						} catch (n) {
							console.warn("VSCode ICommandService not available for syncing groups:", n)
						}
					},
					clear(e) {
						e.groups = []
					},
					setActiveGroup(e, t) {
						e.activeGroup = t
					},
				},
				actions: {
					loadGroup(e) {
						return new Promise((t, s) => {
							ve({ url: "/group/list", method: "GET" })
								.then((s) => {
									e.commit("setGroups", s), t()
								})
								.catch((e) => {
									s(e)
								})
						})
					},
				},
				getters: { findGroup: (e) => (t) => e.groups.find((e) => e.id == t) },
			},
			qi = {
				state: { webrtc: {} },
				mutations: {
					setConfig(e, t) {
						e.webrtc = t.webrtc
					},
					clear(e) {
						e.webrtc = {}
					},
				},
				actions: {
					loadConfig(e) {
						return new Promise((t, s) => {
							ve({ url: "/system/config", method: "GET" })
								.then((s) => {
									console.log("系统配置", s), e.commit("setConfig", s), t()
								})
								.catch((e) => {
									s(e)
								})
						})
					},
				},
			},
			Wi = {
				state: {
					userInfo: { show: !1, user: {}, pos: { x: 0, y: 0 } },
					fullImage: { show: !1, url: "" },
					viewCode: 1,
				},
				mutations: {
					showUserInfoBox(e, t) {
						;(e.userInfo.show = !0), (e.userInfo.user = t)
					},
					setUserInfoBoxPos(e, t) {
						let s = document.documentElement.clientWidth,
							i = document.documentElement.clientHeight
						;(e.userInfo.pos.x = Math.min(t.x, s - 350)), (e.userInfo.pos.y = Math.min(t.y, i - 200))
					},
					closeUserInfoBox(e) {
						e.userInfo.show = !1
					},
					showFullImageBox(e, t) {
						;(e.fullImage.show = !0), (e.fullImage.url = t)
					},
					closeFullImageBox(e) {
						e.fullImage.show = !1
					},
					changeViewCode(e, t) {
						e.viewCode = t
					},
					clear(e) {
						;(e.userInfo = { show: !1, user: {}, pos: { x: 0, y: 0 } }),
							(e.fullImage = { show: !1, url: "" }),
							(e.viewCode = 1)
					},
				},
			}
		r["default"].use(ki["a"])
		var Yi = new ki["a"].Store({
			modules: { chatStore: zi, friendStore: ji, userStore: Ri, groupStore: Hi, configStore: qi, uiStore: Wi },
			state: {},
			mutations: {
				clear(e) {
					console.log("[Store] Executing global clear mutation"),
						e.userStore && this.commit("userStore/clear"),
						e.chatStore && this.commit("chatStore/clear"),
						e.friendStore && this.commit("friendStore/clear"),
						e.groupStore && this.commit("groupStore/clear"),
						e.configStore && this.commit("configStore/clear"),
						e.uiStore && this.commit("uiStore/clear"),
						console.log("[Store] All modules cleared")
				},
			},
			getters: { isLoggedIn: (e) => e.userStore.isLoggedIn },
			actions: {
				load(e) {
					return this.dispatch("loadUser").then(() => {
						const e = []
						return (
							e.push(this.dispatch("loadFriend")),
							e.push(this.dispatch("loadGroup")),
							e.push(this.dispatch("loadChat")),
							e.push(this.dispatch("loadConfig")),
							Promise.all(e).then(() => {
								this.dispatch("syncToRooCode")
							})
						)
					})
				},
				unload(e) {
					e.commit("clear"), e.commit("configStore/clear")
				},
				syncUserState({ commit: e }, t) {
					if ((console.log("[Store] Syncing VSCode user state:", t), t && (t.userId || t.id))) {
						const s = { ...t, userId: t.userId || t.id }
						e("setUserInfo", s),
							e("setIsLoggedIn", !0),
							sessionStorage.setItem("accessToken", s.accessToken),
							localStorage.setItem("userInfo", JSON.stringify(s)),
							console.log("[Store] User state synced successfully, userInfo:", s)
					}
				},
				login({ commit: e }, t) {
					console.log("[Store] User login:", t),
						t && (e("setUserInfo", t), localStorage.setItem("userInfo", JSON.stringify(t)))
				},
				logout({ commit: e }) {
					console.log("[Store] User logout"), e("clear"), localStorage.removeItem("userInfo")
				},
				syncToRooCode({ state: e }) {
					try {
						var t, s, i, o
						if (null === (t = window.vscodeServices) || void 0 === t || !t.get("ICommandService"))
							return void console.log("[Store] VSCode ICommandService not available")
						const n = null === (s = e.userStore) || void 0 === s ? void 0 : s.userInfo
						if (null === n || void 0 === n || !n.id)
							return void console.log("[Store] No user info available for sync")
						const a = String(n.id),
							r = (null === (i = e.friendStore) || void 0 === i ? void 0 : i.friends) || [],
							l = (null === (o = e.groupStore) || void 0 === o ? void 0 : o.groups) || []
						console.log("[Store] Syncing to RooCode:", {
							userId: a,
							friendsCount: r.length,
							groupsCount: l.length,
						}),
							window.vscodeServices
								.get("ICommandService")
								.executeCommand("roo-cline.onUserSwitch", {
									userId: a,
									userName: n.nickName || n.username,
									terminalNo: 0,
									terminal: window.terminal ? window.terminal : 2,
									apiToken: n.apiToken,
								})
								.catch((e) => console.warn("Failed to sync user state to RooCode:", e)),
							window.vscodeServices
								.get("ICommandService")
								.executeCommand("roo-cline.updateImContacts", {
									userId: a,
									friends: r.filter((e) => !e.deleted),
									groups: l.filter((e) => !e.quit),
								})
								.catch((e) => console.warn("Failed to sync contacts to RooCode:", e))
					} catch (n) {
						console.error("[Store] Failed to sync to RooCode:", n)
					}
				},
			},
			strict: !1,
		})
		let Ji = (e, t) => {
				var s = new Date(e),
					i = Date.parse(new Date()),
					o = i - s,
					n = ""
				return (
					o <= 6e4
						? (n = "刚刚")
						: o > 6e4 && o < 36e5
							? (n = Math.floor(o / 6e4) + "分钟前")
							: o >= 36e5 && o < 864e5 && !Ki(s)
								? (n = Zi(s).substr(11, 5))
								: Ki(s)
									? (n = "昨天" + Zi(s).substr(11, 5))
									: Qi(s)
										? (n = Zi(s).substr(5, t ? 5 : 14))
										: ((n = Zi(s)), t && (n = n.substr(2, 8))),
					n
				)
			},
			Ki = (e) => {
				if (!e) return !1
				var t = new Date(new Date() - 864e5)
				return (
					t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate()
				)
			},
			Qi = (e) => !!e && e.getFullYear() === new Date().getFullYear(),
			Zi = (e) => {
				if ("" === e || !e) return ""
				var t = new Date(e),
					s = t.getFullYear(),
					i = t.getMonth() + 1
				i = i < 10 ? "0" + i : i
				var o = t.getDate()
				o = o < 10 ? "0" + o : o
				var n = t.getHours()
				n = n < 10 ? "0" + n : n
				var a = t.getMinutes()
				a = a < 10 ? "0" + a : a
				var r = t.getSeconds()
				return (r = r < 10 ? "0" + r : r), s + "/" + i + "/" + o + " " + n + ":" + a + ":" + r
			}
		r["default"].directive("dialogDrag", {
			bind(e, t, s, i) {
				const o = e.querySelector(".el-dialog__header"),
					n = e.querySelector(".el-dialog")
				o.style.cursor = "move"
				const a = n.currentStyle || window.getComputedStyle(n, null)
				o.onmousedown = (e) => {
					const t = e.clientX - o.offsetLeft,
						s = e.clientY - o.offsetTop,
						i = document.body.clientWidth,
						r = document.documentElement.clientHeight,
						l = n.offsetWidth,
						c = n.offsetHeight,
						d = n.offsetLeft,
						h = i - n.offsetLeft - l,
						u = n.offsetTop,
						m = r - n.offsetTop - c
					let g, p
					a.left.includes("%")
						? ((g = +document.body.clientWidth * (+a.left.replace(/\%/g, "") / 100)),
							(p = +document.body.clientHeight * (+a.top.replace(/\%/g, "") / 100)))
						: ((g = +a.left.replace(/\px/g, "")), (p = +a.top.replace(/\px/g, ""))),
						(document.onmousemove = function (e) {
							var i = e.clientX - t,
								o = e.clientY - s
							;-i > d ? (i = -d) : i > h && (i = h),
								-o > u ? (o = -u) : o > m && (o = m),
								(n.style.left = i + g + "px"),
								(n.style.top = o + p + "px")
						}),
						(document.onmouseup = function (e) {
							;(document.onmousemove = null), (document.onmouseup = null)
						})
				}
			},
		}),
			r["default"].use(ue.a),
			(r["default"].prototype.$wsApi = i),
			(r["default"].prototype.$msgType = o),
			(r["default"].prototype.$date = a),
			(r["default"].prototype.$http = ve),
			(r["default"].prototype.$emo = Ti),
			(r["default"].prototype.$url = yi),
			(r["default"].prototype.$elm = Ei),
			(r["default"].prototype.$enums = n),
			(r["default"].prototype.$eventBus = new r["default"]()),
			(r["default"].prototype.$bus = r["default"].prototype.$eventBus),
			(r["default"].config.productionTip = !1),
			new r["default"]({ el: "#app", router: Js, store: Yi, render: (e) => e(g) })
	},
	"56f0": function (e, t, s) {},
	"5a02": function (e, t, s) {
		"use strict"
		var i = function () {
				var e,
					t,
					s,
					i,
					o,
					n,
					a,
					r = this,
					l = r._self._c
				return l("div", { staticClass: "container-manager", class: { collapsed: r.isCollapsed } }, [
					l("div", { staticClass: "collapse-btn", on: { click: r.toggleCollapse } }, [
						l("i", { class: r.isCollapsed ? "el-icon-arrow-left" : "el-icon-arrow-right" }),
					]),
					l(
						"div",
						{
							directives: [
								{ name: "show", rawName: "v-show", value: !r.isCollapsed, expression: "!isCollapsed" },
							],
							staticClass: "container-status",
						},
						[
							l("div", { staticClass: "status-header" }, [
								l("div", { staticClass: "status-info" }, [
									l("span", { staticClass: "status-icon", class: r.statusClass }, [
										r._v(" " + r._s(r.statusIcon) + " "),
									]),
									l("span", { staticClass: "status-text" }, [r._v(r._s(r.statusText))]),
								]),
								l(
									"div",
									{ staticClass: "status-actions" },
									[
										r.podInfo
											? [
													l(
														"el-dropdown",
														{
															attrs: { trigger: "click" },
															on: { command: r.handleCommand },
														},
														[
															l(
																"el-button",
																{ attrs: { type: "primary", size: "small" } },
																[
																	r._v(" 云电脑操作 "),
																	l("i", {
																		staticClass:
																			"el-icon-arrow-down el-icon--right",
																	}),
																],
															),
															l(
																"el-dropdown-menu",
																{ attrs: { slot: "dropdown" }, slot: "dropdown" },
																[
																	l(
																		"el-dropdown-item",
																		{
																			attrs: {
																				command: "vnc",
																				disabled: !(
																					(null !==
																						(e = r.podInfo.access_info) &&
																						void 0 !== e &&
																						null !== (e = e.vnc) &&
																						void 0 !== e &&
																						e.novnc_url) ||
																					r.podInfo.vnc_url
																				),
																			},
																		},
																		[
																			l("i", { staticClass: "el-icon-monitor" }),
																			r._v(" 查看云电脑 "),
																		],
																	),
																	l(
																		"el-dropdown-item",
																		{
																			attrs: {
																				command: "copyVnc",
																				disabled: !(
																					(null !==
																						(t = r.podInfo.access_info) &&
																						void 0 !== t &&
																						null !== (t = t.vnc) &&
																						void 0 !== t &&
																						t.novnc_url) ||
																					r.podInfo.vnc_url
																				),
																			},
																		},
																		[
																			l("i", {
																				staticClass: "el-icon-copy-document",
																			}),
																			r._v(" 复制VNC链接 "),
																		],
																	),
																	l(
																		"el-dropdown-item",
																		{
																			attrs: {
																				command: "copySsh",
																				disabled: !(
																					(null !==
																						(s = r.podInfo.access_info) &&
																						void 0 !== s &&
																						null !== (s = s.ssh) &&
																						void 0 !== s &&
																						s.command) ||
																					r.podInfo.ssh_command
																				),
																			},
																		},
																		[
																			l("i", {
																				staticClass: "el-icon-connection",
																			}),
																			r._v(" 复制SSH命令 "),
																		],
																	),
																	l(
																		"el-dropdown-item",
																		{ attrs: { divided: "", command: "restart" } },
																		[
																			l("i", { staticClass: "el-icon-refresh" }),
																			r._v(" 重启云电脑 "),
																		],
																	),
																	l(
																		"el-dropdown-item",
																		{ attrs: { command: "stop" } },
																		[
																			l("i", {
																				staticClass: "el-icon-video-pause",
																			}),
																			r._v(" 停止云电脑 "),
																		],
																	),
																	l(
																		"el-dropdown-item",
																		{ attrs: { command: "delete", divided: "" } },
																		[
																			l(
																				"span",
																				{ staticStyle: { color: "#f56c6c" } },
																				[
																					l("i", {
																						staticClass: "el-icon-delete",
																					}),
																					r._v(" 删除云电脑 "),
																				],
																			),
																		],
																	),
																],
																1,
															),
														],
														1,
													),
													l(
														"el-button",
														{
															attrs: {
																size: "small",
																circle: "",
																loading: r.loading,
																title: "刷新状态",
															},
															on: { click: r.refreshStatus },
														},
														[l("i", { staticClass: "el-icon-refresh" })],
													),
												]
											: [
													l(
														"el-button",
														{
															attrs: {
																type: "primary",
																size: "small",
																loading: r.loading,
															},
															on: { click: r.createPod },
														},
														[r._v(" 启动云电脑 ")],
													),
												],
									],
									2,
								),
							]),
							l("transition", { attrs: { name: "fade" } }, [
								r.podInfo
									? l("div", { staticClass: "pod-details" }, [
											l("div", { staticClass: "detail-item" }, [
												l("span", { staticClass: "detail-label" }, [r._v("云电脑名称：")]),
												l("span", { staticClass: "detail-value" }, [
													r._v(r._s(r.podInfo.name)),
												]),
											]),
											l("div", { staticClass: "detail-item" }, [
												l("span", { staticClass: "detail-label" }, [r._v("状态：")]),
												l(
													"span",
													{ staticClass: "detail-value", class: "status-" + r.podStatus },
													[r._v(" " + r._s(r.podStatus) + " ")],
												),
											]),
											r.podInfo.resources
												? l("div", { staticClass: "detail-item" }, [
														l("span", { staticClass: "detail-label" }, [
															r._v("资源配置："),
														]),
														l("span", { staticClass: "detail-value" }, [
															r._v(
																" CPU: " +
																	r._s(r.podInfo.resources.cpu || "N/A") +
																	" | 内存: " +
																	r._s(r.podInfo.resources.memory || "N/A") +
																	" | 存储: " +
																	r._s(r.podInfo.resources.storage || "N/A") +
																	" ",
															),
														]),
													])
												: r._e(),
											r.vncPassword ||
											r.podInfo.vnc_password ||
											(null !== (i = r.podInfo.access_info) &&
												void 0 !== i &&
												null !== (i = i.credentials) &&
												void 0 !== i &&
												i.password)
												? l("div", { staticClass: "detail-item" }, [
														l("span", { staticClass: "detail-label" }, [
															r._v("云电脑密码："),
														]),
														l(
															"span",
															{ staticClass: "detail-value" },
															[
																r._v(
																	" " +
																		r._s(
																			r.vncPassword ||
																				r.podInfo.vnc_password ||
																				"使用创建时提供的密码",
																		) +
																		" ",
																),
																r.vncPassword || r.podInfo.vnc_password
																	? l(
																			"el-button",
																			{
																				staticStyle: { "margin-left": "10px" },
																				attrs: { type: "text", size: "mini" },
																				on: {
																					click: function (e) {
																						return r.copyToClipboard(
																							r.vncPassword ||
																								r.podInfo.vnc_password,
																							"云电脑密码已复制",
																						)
																					},
																				},
																			},
																			[
																				l("i", {
																					staticClass:
																						"el-icon-copy-document",
																				}),
																				r._v(" 复制 "),
																			],
																		)
																	: r._e(),
															],
															1,
														),
													])
												: r._e(),
											(null !== (o = r.podInfo.access_info) &&
												void 0 !== o &&
												null !== (o = o.vnc) &&
												void 0 !== o &&
												o.novnc_url) ||
											r.podInfo.vnc_url
												? l("div", { staticClass: "detail-item" }, [
														l("span", { staticClass: "detail-label" }, [
															r._v("云电脑访问："),
														]),
														l(
															"span",
															{
																staticClass: "detail-value",
																staticStyle: { "font-size": "12px" },
															},
															[
																l(
																	"el-button",
																	{
																		attrs: { type: "primary", size: "mini" },
																		on: { click: r.openVNC },
																	},
																	[
																		l("i", { staticClass: "el-icon-monitor" }),
																		r._v(" 查看工作台 "),
																	],
																),
																l(
																	"el-button",
																	{
																		attrs: { type: "text", size: "mini" },
																		on: { click: r.copyVNCLink },
																	},
																	[
																		l("i", {
																			staticClass: "el-icon-copy-document",
																		}),
																		r._v(" 复制链接 "),
																	],
																),
															],
															1,
														),
													])
												: r._e(),
											(null !== (n = r.podInfo.access_info) &&
												void 0 !== n &&
												null !== (n = n.ssh) &&
												void 0 !== n &&
												n.command) ||
											r.podInfo.ssh_command
												? l("div", { staticClass: "detail-item" }, [
														l("span", { staticClass: "detail-label" }, [r._v("SSH访问：")]),
														l(
															"span",
															{
																staticClass: "detail-value",
																staticStyle: {
																	"font-size": "12px",
																	"word-break": "break-all",
																},
															},
															[
																l("code", [
																	r._v(
																		r._s(
																			(null === (a = r.podInfo.access_info) ||
																			void 0 === a ||
																			null === (a = a.ssh) ||
																			void 0 === a
																				? void 0
																				: a.command) || r.podInfo.ssh_command,
																		),
																	),
																]),
																l(
																	"el-button",
																	{
																		staticStyle: { "margin-left": "10px" },
																		attrs: { type: "text", size: "mini" },
																		on: { click: r.copySSHCommand },
																	},
																	[
																		l("i", {
																			staticClass: "el-icon-copy-document",
																		}),
																		r._v(" 复制 "),
																	],
																),
															],
															1,
														),
													])
												: r._e(),
											r.podInfo.created_at || r.podInfo.start_time
												? l("div", { staticClass: "detail-item" }, [
														l("span", { staticClass: "detail-label" }, [
															r._v("创建时间："),
														]),
														l("span", { staticClass: "detail-value" }, [
															r._v(
																" " +
																	r._s(
																		r.formatTime(
																			r.podInfo.created_at ||
																				r.podInfo.start_time,
																		),
																	) +
																	" ",
															),
														]),
													])
												: r._e(),
										])
									: r._e(),
							]),
							l("transition", { attrs: { name: "fade" } }, [
								r.errorMessage
									? l("div", { staticClass: "error-message" }, [
											l("i", { staticClass: "el-icon-warning" }),
											r._v(" " + r._s(r.errorMessage) + " "),
										])
									: r._e(),
							]),
						],
						1,
					),
					l(
						"div",
						{
							directives: [
								{ name: "show", rawName: "v-show", value: r.isCollapsed, expression: "isCollapsed" },
							],
							staticClass: "collapsed-content",
						},
						[
							l("div", { staticClass: "collapsed-status" }, [
								l("span", { staticClass: "status-icon", class: r.statusClass }, [
									r._v(r._s(r.statusIcon)),
								]),
								l("span", { staticClass: "collapsed-text" }, [r._v("云电脑管理")]),
							]),
						],
					),
				])
			},
			o = [],
			n = {
				name: "ContainerManager",
				data() {
					return {
						podInfo: null,
						loading: !1,
						errorMessage: "",
						checkInterval: null,
						apiUrl: "https://api.vnc.service.thinkgs.cn",
						apiToken: "",
						vncPassword: "",
						isCollapsed: !1,
						lastCheckTime: 0,
						checkIntervalTime: 3e4,
						cachedPodInfo: null,
						lastSuccessfulFetch: 0,
					}
				},
				computed: {
					podStatus() {
						return this.podInfo ? this.podInfo.phase || this.podInfo.status : null
					},
					statusClass() {
						if (this.loading) return "loading"
						if (this.podStatus)
							switch (this.podStatus) {
								case "Running":
									return "running"
								case "Pending":
									return "pending"
								case "Failed":
									return "failed"
								case "Stopped":
									return "stopped"
								default:
									return "unknown"
							}
						return "offline"
					},
					statusIcon() {
						if (this.loading) return "⏳"
						if (this.podStatus)
							switch (this.podStatus) {
								case "Running":
									return "✅"
								case "Pending":
									return "⏱️"
								case "Failed":
									return "❌"
								case "Stopped":
									return "⏸️"
								default:
									return "❓"
							}
						return "⭕"
					},
					statusText() {
						if (this.loading) return "处理中..."
						if (this.podStatus)
							switch (this.podStatus) {
								case "Running":
									return "云电脑运行中"
								case "Pending":
									return "云电脑启动中"
								case "Failed":
									return "云电脑异常"
								case "Stopped":
									return "云电脑已停止"
								default:
									return "状态未知"
							}
						return "云电脑未启动"
					},
				},
				methods: {
					toggleCollapse() {
						;(this.isCollapsed = !this.isCollapsed),
							localStorage.setItem("container-manager-collapsed", this.isCollapsed)
					},
					async callAPI(e, t = "GET", s = null) {
						const i = this.apiToken,
							o = {
								method: t,
								headers: { Authorization: "Bearer " + i, "Content-Type": "application/json" },
							}
						s && "GET" !== t && (o.body = JSON.stringify(s)),
							console.log("[ContainerManager] API调用:", {
								url: `${this.apiUrl}${e}`,
								method: t,
								token: i.substring(0, 20) + "...",
								body: s,
							})
						try {
							const t = await fetch(`${this.apiUrl}${e}`, o),
								s = await t.json()
							return (
								console.log("[ContainerManager] API响应:", { status: t.status, data: s }),
								{ status: t.status, data: s }
							)
						} catch (n) {
							return (
								console.error("[ContainerManager] API错误:", n),
								{ status: "error", data: { error: n.message } }
							)
						}
					},
					async checkPodStatus(e = !1) {
						if (!this.apiToken)
							return (
								console.error("[ContainerManager] Token未配置，无法检查Pod状态"),
								void (this.errorMessage = "Token未配置")
							)
						const t = Date.now()
						if (this.cachedPodInfo && t - this.lastSuccessfulFetch < 5e3)
							return (
								console.log("[ContainerManager] 使用缓存的Pod信息"),
								void (this.podInfo = this.cachedPodInfo)
							)
						console.log(
							"[ContainerManager] 检查Pod状态，使用Token:",
							this.apiToken.substring(0, 20) + "...",
						),
							e && (this.loading = !0),
							(this.errorMessage = "")
						const s = await this.callAPI("/api/v1/pods")
						if (200 === s.status && s.data.pods) {
							const e = s.data.pods
							if (e.length > 0) {
								const t = e[0].name
								console.log("[ContainerManager] Pod列表获取成功，找到Pod:", t),
									t && (await this.getPodDetail(t, e[0]))
							} else
								(this.podInfo = null),
									(this.cachedPodInfo = null),
									console.log("[ContainerManager] 没有找到Pod")
						} else
							401 === s.status
								? ((this.errorMessage = "Token无效或已过期"),
									console.error(
										"[ContainerManager] 401错误，Token可能无效:",
										this.apiToken.substring(0, 20) + "...",
									))
								: console.error("[ContainerManager] 获取Pod状态失败:", s)
						e && (this.loading = !1)
					},
					async getPodDetail(e, t = null) {
						console.log("[ContainerManager] 获取Pod详情:", e)
						const s = await this.callAPI("/api/v1/pods/" + e)
						if (200 === s.status) {
							const e = { ...(t || this.podInfo || {}), ...s.data }
							JSON.stringify(this.podInfo) !== JSON.stringify(e) &&
								((this.podInfo = e),
								(this.cachedPodInfo = e),
								(this.lastSuccessfulFetch = Date.now()),
								(window.__containerManagerCache = {
									podInfo: e,
									vncPassword: this.vncPassword,
									timestamp: Date.now(),
								}),
								console.log("[ContainerManager] Pod详情获取成功:", this.podInfo)),
								s.data.vnc_password && !this.vncPassword && (this.vncPassword = s.data.vnc_password)
						} else
							t &&
								!this.podInfo &&
								((this.podInfo = t), (this.cachedPodInfo = t), (this.lastSuccessfulFetch = Date.now())),
								console.error("[ContainerManager] 获取Pod详情失败:", s)
					},
					async createPod() {
						;(this.loading = !0), (this.errorMessage = "")
						const e = { cpu_limit: "2", memory_limit: "4Gi", storage_size: "20Gi" },
							t = await this.callAPI("/api/v1/pods", "POST", e)
						if (((this.loading = !1), 200 === t.status || 201 === t.status))
							if (
								(t.data.vnc_password
									? ((this.vncPassword = t.data.vnc_password),
										this.$alert(
											`云电脑创建成功！<br><br>VNC密码: <strong>${t.data.vnc_password}</strong><br><br>请妥善保存此密码，用于访问VNC远程桌面。`,
											"创建成功",
											{
												dangerouslyUseHTMLString: !0,
												confirmButtonText: "复制密码",
												callback: () => {
													this.copyToClipboard(t.data.vnc_password, "VNC密码已复制")
												},
											},
										))
									: this.$message.success("云电脑创建成功"),
								t.data.pod_name || t.data.name)
							) {
								const e = t.data.pod_name || t.data.name
								setTimeout(() => {
									this.getPodDetail(e)
								}, 2e3)
							} else setTimeout(() => this.checkPodStatus(), 2e3)
						else (this.errorMessage = t.data.message || "创建失败"), this.$message.error(this.errorMessage)
					},
					async performAction(e, t) {
						;(this.loading = !0), (this.errorMessage = "")
						let s = "",
							i = "POST"
						switch (e) {
							case "stop":
							case "restart":
								s = `/api/v1/pods/${t}/${e}`
								break
							case "delete":
								;(s = "/api/v1/pods/" + t), (i = "DELETE")
								break
						}
						const o = await this.callAPI(s, i)
						;(this.loading = !1),
							200 === o.status
								? (this.$message.success("操作成功：" + e),
									setTimeout(() => this.checkPodStatus(), 2e3))
								: ((this.errorMessage = o.data.message || "操作失败"),
									this.$message.error(this.errorMessage))
					},
					handleCommand(e) {
						if (this.podInfo)
							switch (e) {
								case "vnc":
									this.openVNC()
									break
								case "copyVnc":
									this.copyVNCLink()
									break
								case "copySsh":
									this.copySSHCommand()
									break
								case "restart":
									this.confirmAction("restart", "确定要重启云电脑吗？")
									break
								case "stop":
									this.confirmAction("stop", "确定要停止云电脑吗？")
									break
								case "delete":
									this.confirmAction("delete", "确定要删除云电脑吗？此操作不可恢复！")
									break
							}
					},
					openVNC() {
						var e, t
						if (
							null !== (e = this.podInfo) &&
							void 0 !== e &&
							null !== (e = e.access_info) &&
							void 0 !== e &&
							null !== (e = e.vnc) &&
							void 0 !== e &&
							e.novnc_url
						)
							window.open(this.podInfo.access_info.vnc.novnc_url, "_blank")
						else if (null !== (t = this.podInfo) && void 0 !== t && t.vnc_url) {
							const e = this.podInfo.vnc_url.replace(
								"/novnc/vnc.html",
								"/vnc.html?path=user/" + this.podInfo.name.replace("vnc-", "") + "/websockify",
							)
							window.open(e, "_blank")
						} else this.$message.warning("VNC链接不可用")
					},
					copyVNCLink() {
						var e, t
						if (
							null !== (e = this.podInfo) &&
							void 0 !== e &&
							null !== (e = e.access_info) &&
							void 0 !== e &&
							null !== (e = e.vnc) &&
							void 0 !== e &&
							e.novnc_url
						)
							this.copyToClipboard(this.podInfo.access_info.vnc.novnc_url, "VNC链接已复制")
						else if (null !== (t = this.podInfo) && void 0 !== t && t.vnc_url) {
							const e = this.podInfo.vnc_url.replace(
								"/novnc/vnc.html",
								"/vnc.html?path=user/" + this.podInfo.name.replace("vnc-", "") + "/websockify",
							)
							this.copyToClipboard(e, "VNC链接已复制")
						} else this.$message.warning("VNC链接不可用")
					},
					copySSHCommand() {
						var e, t
						null !== (e = this.podInfo) &&
						void 0 !== e &&
						null !== (e = e.access_info) &&
						void 0 !== e &&
						null !== (e = e.ssh) &&
						void 0 !== e &&
						e.command
							? this.copyToClipboard(this.podInfo.access_info.ssh.command, "SSH命令已复制")
							: null !== (t = this.podInfo) && void 0 !== t && t.ssh_command
								? this.copyToClipboard(this.podInfo.ssh_command, "SSH命令已复制")
								: this.$message.warning("SSH命令不可用")
					},
					copyToClipboard(e, t) {
						const s = document.createElement("textarea")
						;(s.value = e),
							document.body.appendChild(s),
							s.select(),
							document.execCommand("copy"),
							document.body.removeChild(s),
							this.$message.success(t)
					},
					confirmAction(e, t) {
						this.$confirm(t, "提示", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning",
						})
							.then(() => {
								this.performAction(e, this.podInfo.name)
							})
							.catch(() => {
								this.$message.info("已取消操作")
							})
					},
					refreshStatus() {
						this.checkPodStatus(!0)
					},
					formatTime(e) {
						return new Date(e).toLocaleString("zh-CN", {
							year: "numeric",
							month: "2-digit",
							day: "2-digit",
							hour: "2-digit",
							minute: "2-digit",
						})
					},
					initApiToken() {
						let e = sessionStorage.getItem("tokenKey")
						if (!e)
							try {
								const t = localStorage.getItem("userInfo")
								if (t) {
									const s = JSON.parse(t)
									;(e = s.apiKey || null),
										console.log("[ContainerManager] 从localStorage获取apiKey:", {
											hasApiKey: !!e,
											apiKeyPreview: e ? e.substring(0, 20) + "..." : "none",
										})
								}
							} catch (t) {
								console.error("[ContainerManager] 解析userinfo失败:", t)
							}
						if (
							(console.log("[ContainerManager] 检查Token:", {
								hasTokenKey: !!e,
								tokenKeyPreview: e ? e.substring(0, 20) + "..." : "none",
								currentToken: this.apiToken ? "exists" : "none",
								source: sessionStorage.getItem("tokenKey") ? "sessionStorage" : "localStorage",
							}),
							e)
						) {
							if (this.apiToken === e)
								return void console.log("[ContainerManager] Token未变化，跳过初始化")
							this.apiToken = e
							const t = sessionStorage.getItem("tokenKey") ? "sessionStorage" : "localStorage"
							console.log(
								`[ContainerManager] Token从${t}设置成功:`,
								this.apiToken.substring(0, 20) + "...",
							),
								this.checkInterval && clearInterval(this.checkInterval),
								this.checkPodStatus(),
								this.setupSmartRefresh(),
								(this.errorMessage = "")
						} else
							console.warn("[ContainerManager] sessionStorage中没有tokenKey"),
								(this.errorMessage = "等待用户登录...")
					},
					setupSmartRefresh() {
						this.checkInterval && clearInterval(this.checkInterval),
							(this.checkInterval = setInterval(() => {
								if (this.isCollapsed)
									Date.now() - this.lastCheckTime > 6e4 &&
										(this.checkPodStatus(), (this.lastCheckTime = Date.now()))
								else {
									let e = this.checkIntervalTime
									"Pending" === this.podStatus
										? (e = 1e4)
										: "Running" === this.podStatus
											? (e = 45e3)
											: ("Failed" !== this.podStatus && "Stopped" !== this.podStatus) ||
												(e = 6e4),
										Date.now() - this.lastCheckTime > e &&
											(this.checkPodStatus(), (this.lastCheckTime = Date.now()))
								}
							}, 5e3))
					},
				},
				mounted() {
					console.log("[ContainerManager] 组件已挂载")
					const e = window.__containerManagerCache
					if (e && e.podInfo) {
						const t = Date.now()
						t - e.timestamp < 3e4 &&
							(console.log("[ContainerManager] 从全局缓存恢复Pod信息"),
							(this.podInfo = e.podInfo),
							(this.cachedPodInfo = e.podInfo),
							(this.vncPassword = e.vncPassword || ""),
							(this.lastSuccessfulFetch = e.timestamp))
					}
					const t = localStorage.getItem("container-manager-collapsed")
					null !== t && (this.isCollapsed = "true" === t), this.initApiToken()
				},
				beforeDestroy() {
					this.podInfo &&
						((window.__containerManagerCache = {
							podInfo: this.podInfo,
							vncPassword: this.vncPassword,
							timestamp: this.lastSuccessfulFetch || Date.now(),
						}),
						console.log("[ContainerManager] Pod信息已保存到全局缓存")),
						this.checkInterval && clearInterval(this.checkInterval)
				},
				watch: {
					"$store.state.userStore.userInfo": {
						handler() {
							console.log("[ContainerManager] userInfo变化，触发Token检查"), this.initApiToken()
						},
						immediate: !0,
					},
				},
			},
			a = n,
			r = (s("2e64"), s("2877")),
			l = Object(r["a"])(a, i, o, !1, null, "118f200b", null)
		t["a"] = l.exports
	},
	"5b4c": function (e, t, s) {
		"use strict"
		s("8d26")
	},
	"5d4f": function (e, t, s) {
		"use strict"
		s("5457")
	},
	"5d59": function (e, t, s) {},
	"5e7c": function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-dialog",
					{
						attrs: {
							title: "添加好友",
							visible: e.dialogVisible,
							width: "400px",
							"before-close": e.onClose,
							"custom-class": "add-friend-dialog",
						},
						on: {
							"update:visible": function (t) {
								e.dialogVisible = t
							},
						},
					},
					[
						t(
							"el-input",
							{
								staticClass: "input-with-select",
								attrs: { placeholder: "输入用户名或昵称按下enter搜索，最多展示20条", size: "small" },
								nativeOn: {
									keyup: function (t) {
										return !t.type.indexOf("key") && e._k(t.keyCode, "enter", 13, t.key, "Enter")
											? null
											: e.onSearch()
									},
								},
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
									attrs: { slot: "suffix" },
									on: {
										click: function (t) {
											return e.onSearch()
										},
									},
									slot: "suffix",
								}),
							],
						),
						t(
							"el-scrollbar",
							{ staticStyle: { height: "400px" } },
							e._l(e.users, function (s) {
								return t(
									"div",
									{
										directives: [
											{
												name: "show",
												rawName: "v-show",
												value: s.id != e.$store.state.userStore.userInfo.id,
												expression: "user.id != $store.state.userStore.userInfo.id",
											},
										],
										key: s.id,
									},
									[
										t(
											"div",
											{ staticClass: "item" },
											[
												t(
													"div",
													{ staticClass: "avatar" },
													[
														t("head-image", {
															attrs: {
																name: s.nickName,
																url: s.headImage,
																online: s.online,
															},
														}),
													],
													1,
												),
												t("div", { staticClass: "add-friend-text" }, [
													t("div", { staticClass: "nick-name" }, [
														t("div", [e._v(e._s(s.nickName))]),
														t(
															"div",
															{
																class: s.online
																	? "online-status  online"
																	: "online-status",
															},
															[e._v(e._s(s.online ? "[在线]" : "[离线]"))],
														),
													]),
													t("div", { staticClass: "user-name" }, [
														t("div", [e._v("用户名:" + e._s(s.userName))]),
													]),
												]),
												t(
													"el-button",
													{
														directives: [
															{
																name: "show",
																rawName: "v-show",
																value: !e.isFriend(s.id),
																expression: "!isFriend(user.id)",
															},
														],
														attrs: { type: "success", size: "mini" },
														on: {
															click: function (t) {
																return e.onAddFriend(s)
															},
														},
													},
													[e._v("添加")],
												),
												t(
													"el-button",
													{
														directives: [
															{
																name: "show",
																rawName: "v-show",
																value: e.isFriend(s.id),
																expression: "isFriend(user.id)",
															},
														],
														attrs: { type: "info", size: "mini", plain: "", disabled: "" },
													},
													[e._v("已添加")],
												),
											],
											1,
										),
									],
								)
							}),
							0,
						),
					],
					1,
				)
			},
			o = [],
			n = s("4036"),
			a = {
				name: "addFriend",
				components: { HeadImage: n["a"] },
				data() {
					return { users: [], searchText: "" }
				},
				props: { dialogVisible: { type: Boolean } },
				methods: {
					onClose() {
						this.$emit("close")
					},
					onSearch() {
						this.searchText
							? this.$http({
									url: "/user/findByName",
									method: "get",
									params: { name: this.searchText },
								}).then((e) => {
									this.users = e
								})
							: (this.users = [])
					},
					onAddFriend(e) {
						this.$http({ url: "/friend/add", method: "post", params: { friendId: e.id } }).then(() => {
							this.$message.success("添加成功，对方已成为您的好友")
							let t = {
								id: e.id,
								nickName: e.nickName,
								headImage: e.headImage,
								online: e.online,
								deleted: !1,
							}
							this.$store.commit("addFriend", t)
						})
					},
					isFriend(e) {
						return this.$store.getters.isFriend(e)
					},
				},
			},
			r = a,
			l = (s("5f8d"), s("2877")),
			c = Object(l["a"])(r, i, o, !1, null, null, null)
		t["a"] = c.exports
	},
	"5f40": function (e, t, s) {
		e.exports = s.p + "img/21.ec8df612.gif"
	},
	"5f8d": function (e, t, s) {
		"use strict"
		s("247f")
	},
	6047: function (e, t, s) {
		e.exports = s.p + "img/34.b4c0eba4.gif"
	},
	6178: function (e, t, s) {},
	"61f2": function (e, t, s) {
		e.exports = s.p + "img/48.20d1ce26.gif"
	},
	6318: function (e, t, s) {
		e.exports = s.p + "img/28.52524722.gif"
	},
	"642d": function (e, t, s) {
		var i = {
			"./0.gif": "f1c0",
			"./1.gif": "f320",
			"./10.gif": "d054",
			"./11.gif": "b1c1",
			"./12.gif": "4518",
			"./13.gif": "a79b",
			"./14.gif": "982d",
			"./15.gif": "6e1f",
			"./16.gif": "50a5",
			"./17.gif": "25a1",
			"./18.gif": "fd6e",
			"./19.gif": "32c6",
			"./2.gif": "34cb",
			"./20.gif": "d496",
			"./21.gif": "5f40",
			"./22.gif": "4fc8",
			"./23.gif": "f5d6",
			"./24.gif": "058c",
			"./25.gif": "3854",
			"./26.gif": "7a13",
			"./27.gif": "36a47",
			"./28.gif": "6318",
			"./29.gif": "df98",
			"./3.gif": "d370",
			"./30.gif": "5541",
			"./31.gif": "8bb4",
			"./32.gif": "cd82",
			"./33.gif": "8e89",
			"./34.gif": "6047",
			"./35.gif": "7e0f",
			"./36.gif": "846c",
			"./37.gif": "8959",
			"./38.gif": "ba6e",
			"./39.gif": "5347",
			"./4.gif": "3dfc",
			"./40.gif": "1a8f",
			"./41.gif": "3d2d",
			"./42.gif": "6430",
			"./43.gif": "a4d0",
			"./44.gif": "680b",
			"./45.gif": "829b",
			"./46.gif": "9aeb",
			"./47.gif": "37bf",
			"./48.gif": "61f2",
			"./49.gif": "b59b",
			"./5.gif": "28f3",
			"./50.gif": "e715",
			"./51.gif": "e0c4",
			"./52.gif": "4d66",
			"./53.gif": "7a4c",
			"./54.gif": "7449",
			"./55.gif": "9216",
			"./56.gif": "e769",
			"./6.gif": "81f6",
			"./7.gif": "ef96",
			"./8.gif": "0abc",
			"./9.gif": "3f29",
		}
		function o(e) {
			var t = n(e)
			return s(t)
		}
		function n(e) {
			if (!s.o(i, e)) {
				var t = new Error("Cannot find module '" + e + "'")
				throw ((t.code = "MODULE_NOT_FOUND"), t)
			}
			return i[e]
		}
		;(o.keys = function () {
			return Object.keys(i)
		}),
			(o.resolve = n),
			(e.exports = o),
			(o.id = "642d")
	},
	6430: function (e, t, s) {
		e.exports = s.p + "img/42.02d062c5.gif"
	},
	6439: function (e, t, s) {
		"use strict"
		s.d(t, "a", function () {
			return i
		}),
			s.d(t, "b", function () {
				return o
			})
		var i = function () {
				var e = this
				e._self._c, e._self._setupProxy
				return e._m(0)
			},
			o = [
				function () {
					var e = this,
						t = e._self._c
					e._self._setupProxy
					return t("div", { staticClass: "icp" }, [
						t("img", { staticClass: "icp-icon", attrs: { src: s("8681") } }),
						t("a", { attrs: { target: "_blank", href: "https://beian.miit.gov.cn/" } }, [
							e._v("粤ICP备xxxx号-1"),
						]),
					])
				},
			]
	},
	"647d": function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-drawer",
					{
						attrs: {
							title: "聊天历史记录",
							size: "700px",
							visible: e.visible,
							direction: "rtl",
							"before-close": e.onClose,
						},
						on: {
							"update:visible": function (t) {
								e.visible = t
							},
						},
					},
					[
						t(
							"div",
							{
								directives: [
									{ name: "loading", rawName: "v-loading", value: e.loading, expression: "loading" },
								],
								staticClass: "chat-history",
								attrs: { "element-loading-text": "拼命加载中" },
							},
							[
								t(
									"el-scrollbar",
									{
										ref: "scrollbar",
										staticClass: "chat-history-scrollbar",
										attrs: { id: "historyScrollbar" },
									},
									[
										t(
											"ul",
											e._l(e.messages, function (s, i) {
												return t(
													"li",
													{ key: `history-${s.id || i}-${s.sendTime || i}` },
													[
														t("chat-message-item", {
															attrs: {
																mode: 2,
																mine: s.sendId == e.mine.id,
																headImage: e.headImage(s),
																showName: e.showName(s),
																msgInfo: s,
																menu: !1,
															},
														}),
													],
													1,
												)
											}),
											0,
										),
									],
								),
							],
							1,
						),
					],
				)
			},
			o = [],
			n = (s("0643"), s("fffc"), s("4e3e"), s("38c4")),
			a = {
				name: "chatHistory",
				components: { ChatMessageItem: n["a"] },
				props: {
					visible: { type: Boolean },
					chat: { type: Object },
					friend: { type: Object },
					group: { type: Object },
					groupMembers: { type: Array },
				},
				data() {
					return { page: 1, size: 10, messages: [], loadAll: !1, loading: !1, lastScrollTime: new Date() }
				},
				methods: {
					onClose() {
						;(this.page = 1), (this.messages = []), (this.loadAll = !1), this.$emit("close")
					},
					onScroll() {
						let e = this.$refs.scrollbar.$refs.wrap.scrollTop,
							t = new Date().getTime() - this.lastScrollTime.getTime()
						e < 30 && t > 500 && ((this.lastScrollTime = new Date()), this.loadMessages())
					},
					loadMessages() {
						if (this.loadAll) return this.$message.success("已到达顶部")
						let e = { page: this.page++, size: this.size }
						"GROUP" == this.chat.type ? (e.groupId = this.group.id) : (e.friendId = this.friend.id),
							(this.loading = !0),
							this.$http({ url: this.histroyAction, method: "get", params: e })
								.then((e) => {
									e.forEach((e) => this.messages.unshift(e)),
										(this.loading = !1),
										e.length < this.size && (this.loadAll = !0),
										this.refreshScrollPos()
								})
								.catch(() => {
									this.loading = !1
								})
					},
					showName(e) {
						if ("GROUP" == this.chat.type) {
							let t = this.groupMembers.find((t) => t.userId == e.sendId)
							return t ? t.showNickName : ""
						}
						return e.sendId == this.mine.id ? this.mine.nickName : this.chat.showName
					},
					headImage(e) {
						if ("GROUP" == this.chat.type) {
							let t = this.groupMembers.find((t) => t.userId == e.sendId)
							return t ? t.headImage : ""
						}
						return e.sendId == this.mine.id ? this.mine.headImageThumb : this.chat.headImage
					},
					refreshScrollPos() {
						let e = this.$refs.scrollbar.$refs.wrap,
							t = e.scrollHeight,
							s = e.scrollTop
						this.$nextTick(() => {
							let i = e.scrollHeight - t
							;(e.scrollTop = s + i), e.scrollHeight == t && this.loadMessages()
						})
					},
				},
				computed: {
					mine() {
						return this.$store.state.userStore.userInfo
					},
					histroyAction() {
						return `/message/${this.chat.type.toLowerCase()}/history`
					},
				},
				watch: {
					visible: {
						handler(e, t) {
							e &&
								(this.loadMessages(),
								this.$nextTick(() => {
									document
										.getElementById("historyScrollbar")
										.addEventListener("mousewheel", this.onScroll, !0)
								}))
						},
					},
				},
			},
			r = a,
			l = (s("7f50"), s("2877")),
			c = Object(l["a"])(r, i, o, !1, null, null, null)
		t["a"] = c.exports
	},
	6490: function (e, t, s) {
		"use strict"
		s("66b1")
	},
	"66a5": function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t("div", { staticClass: "unified-message-renderer" }, [
					e.enableMarkdown
						? t(
								"div",
								{ staticClass: "message-markdown" },
								[
									t("markdown-renderer", {
										ref: "markdownRenderer",
										attrs: {
											content: e.displayContent,
											"enable-katex": e.rendererConfig.katex,
											"enable-mermaid": e.rendererConfig.mermaid,
											"enable-highlight": e.rendererConfig.highlight,
											streaming: e.streaming,
										},
										on: { rendered: e.onRendered },
									}),
								],
								1,
							)
						: t("div", {
								staticClass: "message-text",
								domProps: { innerHTML: e._s(e.processedTextContent) },
							}),
					e.showEnhancements
						? t("div", { staticClass: "message-enhancements" }, [e._t("enhancements")], 2)
						: e._e(),
				])
			},
			o = [],
			n = s("c07a"),
			a = s("38f5"),
			r = {
				name: "UnifiedMessageRenderer",
				components: { MarkdownRenderer: n["a"] },
				props: {
					message: { type: Object, required: !0 },
					streaming: { type: Boolean, default: !1 },
					forceFormat: { type: String, default: null },
					showEnhancements: { type: Boolean, default: !0 },
					customConfig: { type: Object, default: () => ({}) },
				},
				data() {
					return { internalContent: "", renderComplete: !1 }
				},
				computed: {
					adaptedMessage() {
						return a["a"].adapt(this.message)
					},
					messageType() {
						return this.forceFormat
							? this.forceFormat
							: "AGENT" === this.adaptedMessage.type ||
								  this.adaptedMessage.isAgent ||
								  "markdown" === this.adaptedMessage.format
								? "markdown"
								: this.adaptedMessage.streaming || this.streaming
									? "streaming"
									: this.hasMarkdownSyntax(this.adaptedMessage.content)
										? "markdown"
										: "text"
					},
					enableMarkdown() {
						return "text" !== this.messageType
					},
					displayContent() {
						return this.streaming ? this.internalContent : this.adaptedMessage.content || ""
					},
					processedTextContent() {
						let e = this.displayContent
						return (
							(e = e.replace(/\n/g, "<br>")),
							(e = e.replace(
								/(https?:\/\/[^\s<]+)/g,
								'<a href="$1" target="_blank" rel="noopener">$1</a>',
							)),
							e
						)
					},
					rendererConfig() {
						const e = { markdown: this.enableMarkdown, katex: !1, mermaid: !1, highlight: !0 }
						this.adaptedMessage.features && Object.assign(e, this.adaptedMessage.features)
						const t = this.displayContent
						return (
							t &&
								((e.katex = this.hasLatex(t)),
								(e.mermaid = this.hasMermaid(t)),
								(e.highlight = this.hasCodeBlock(t))),
							Object.assign(e, this.customConfig)
						)
					},
				},
				watch: {
					"message.content": {
						handler(e) {
							this.streaming || (this.internalContent = e || "")
						},
						immediate: !0,
					},
				},
				methods: {
					hasMarkdownSyntax(e) {
						if (!e) return !1
						const t = [
							/^#{1,6}\s/m,
							/\*\*[^*]+\*\*/,
							/\*[^*]+\*/,
							/```[\s\S]*?```/,
							/`[^`]+`/,
							/^\s*[-*+]\s/m,
							/^\s*\d+\.\s/m,
							/\[([^\]]+)\]\(([^)]+)\)/,
							/^\|.*\|$/m,
							/^>/m,
						]
						return t.some((t) => t.test(e))
					},
					hasLatex(e) {
						return !!e && /\$[^$]+\$|\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)/.test(e)
					},
					hasMermaid(e) {
						return !!e && /```mermaid[\s\S]*?```/.test(e)
					},
					hasCodeBlock(e) {
						return !!e && /```[\s\S]*?```/.test(e)
					},
					appendContent(e) {
						this.streaming &&
							((this.internalContent += e),
							this.$refs.markdownRenderer &&
								this.$refs.markdownRenderer.updateContent(this.internalContent))
					},
					setContent(e) {
						;(this.internalContent = e),
							this.$refs.markdownRenderer && this.$refs.markdownRenderer.updateContent(e)
					},
					finishStreaming() {
						this.$refs.markdownRenderer && this.$refs.markdownRenderer.finishStreaming()
					},
					onRendered() {
						;(this.renderComplete = !0), this.$emit("rendered")
					},
					getRenderedHTML() {
						return this.$refs.markdownRenderer
							? this.$refs.markdownRenderer.getRenderedHTML()
							: this.processedTextContent
					},
				},
				mounted() {
					this.message.content && (this.internalContent = this.message.content)
				},
			},
			l = r,
			c = (s("348f"), s("2877")),
			d = Object(c["a"])(l, i, o, !1, null, "09d3c536", null)
		t["a"] = d.exports
	},
	"66b1": function (e, t, s) {},
	"66d8": function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t("div", { staticClass: "group-item", class: e.active ? "active" : "" }, [
					t(
						"div",
						{ staticClass: "group-avatar" },
						[t("head-image", { attrs: { size: 42, name: e.group.showGroupName, url: e.group.headImage } })],
						1,
					),
					t("div", { staticClass: "group-name" }, [t("div", [e._v(e._s(e.group.showGroupName))])]),
				])
			},
			o = [],
			n = s("4036"),
			a = {
				name: "groupItem",
				components: { HeadImage: n["a"] },
				data() {
					return {}
				},
				props: { group: { type: Object }, active: { type: Boolean } },
			},
			r = a,
			l = (s("ea72"), s("2877")),
			c = Object(l["a"])(r, i, o, !1, null, null, null)
		t["a"] = c.exports
	},
	6798: function (e, t, s) {},
	"680b": function (e, t, s) {
		e.exports = s.p + "img/44.00ef8c19.gif"
	},
	"687b": function (e, t, s) {
		"use strict"
		s("14d6")
	},
	"694c": function (e, t, s) {},
	"6cde": function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{
						staticClass: "chat-box",
						on: {
							click: function (t) {
								return e.closeRefBox()
							},
							mousemove: function (t) {
								return e.readedMessage()
							},
						},
					},
					[
						t(
							"el-container",
							[
								t("el-header", { staticClass: "chat-header", attrs: { height: "50px" } }, [
									t(
										"div",
										{ staticClass: "chat-title" },
										[
											e.currentAgentChat
												? [
														t(
															"span",
															{
																staticClass: "parent-name clickable",
																attrs: { title: "点击返回父级对话" },
																on: { click: e.returnToParentChat },
															},
															[e._v(" " + e._s(e.parentChatName) + " ")],
														),
														t("span", { staticClass: "layer-separator" }, [e._v("›")]),
														t("span", { staticClass: "agent-name" }, [
															e._v(e._s(e.currentAgentChat.agentName)),
														]),
													]
												: [e._v(" " + e._s(e.title) + " ")],
										],
										2,
									),
									t("div", { staticClass: "header-right" }, [
										e.recentAgents.length > 0
											? t(
													"div",
													{
														staticClass: "agent-avatars-container",
														class: { collapsed: e.showSide || e.showAgentSide },
													},
													[
														t(
															"div",
															{
																staticClass: "agent-avatars-animated",
																class: { expanded: e.avatarsExpanded },
																style: {
																	"--avatar-count": Math.min(
																		e.recentAgents.length,
																		5,
																	),
																},
																on: {
																	mouseenter: e.expandAvatars,
																	mouseleave: e.collapseAvatars,
																},
															},
															e._l(
																e.recentAgents.slice(
																	0,
																	Math.min(e.recentAgents.length - 1, 4),
																),
																function (s, i) {
																	return t(
																		"div",
																		{
																			key: s.id,
																			staticClass: "agent-avatar-mini",
																			style: { "--avatar-index": i },
																			on: {
																				mouseenter: function (t) {
																					return e.handleAvatarMouseEnter(
																						s,
																						t,
																					)
																				},
																				mouseleave: e.hideAgentCard,
																				click: function (t) {
																					return e.quickStartAgentChat(s)
																				},
																			},
																		},
																		[
																			s.avatar
																				? t("img", {
																						attrs: {
																							src: s.avatar,
																							alt: s.name,
																						},
																					})
																				: t(
																						"div",
																						{
																							staticClass:
																								"agent-avatar-text",
																						},
																						[e._v(e._s(s.name.charAt(0)))],
																					),
																		],
																	)
																},
															),
															0,
														),
														t(
															"div",
															{
																staticClass: "agent-avatar-fixed",
																on: {
																	mouseenter: e.expandAvatars,
																	mouseleave: e.collapseAvatars,
																},
															},
															[
																t(
																	"div",
																	{
																		staticClass: "agent-avatar-mini",
																		on: {
																			mouseenter: function (t) {
																				e.handleAvatarMouseEnter(
																					e.recentAgents[
																						Math.min(
																							e.recentAgents.length - 1,
																							4,
																						)
																					],
																					t,
																				)
																			},
																			mouseleave: e.hideAgentCard,
																			click: function (t) {
																				e.quickStartAgentChat(
																					e.recentAgents[
																						Math.min(
																							e.recentAgents.length - 1,
																							4,
																						)
																					],
																				)
																			},
																		},
																	},
																	[
																		e.recentAgents[
																			Math.min(e.recentAgents.length - 1, 4)
																		].avatar
																			? t("img", {
																					attrs: {
																						src: e.recentAgents[
																							Math.min(
																								e.recentAgents.length -
																									1,
																								4,
																							)
																						].avatar,
																						alt: e.recentAgents[
																							Math.min(
																								e.recentAgents.length -
																									1,
																								4,
																							)
																						].name,
																					},
																				})
																			: t(
																					"div",
																					{
																						staticClass:
																							"agent-avatar-text",
																					},
																					[
																						e._v(
																							" " +
																								e._s(
																									e.recentAgents[
																										Math.min(
																											e
																												.recentAgents
																												.length -
																												1,
																											4,
																										)
																									].name.charAt(0),
																								) +
																								" ",
																						),
																					],
																				),
																	],
																),
															],
														),
													],
												)
											: e._e(),
										t("i", {
											staticClass: "el-icon-more header-btn",
											attrs: { title: "更多" },
											on: { click: e.toggleSidePanel },
										}),
									]),
								]),
								e.hoveredAgentCard
									? t(
											"div",
											{
												staticClass: "agent-hover-panel",
												style: e.agentCardStyle,
												on: { mouseenter: e.onPanelEnter, mouseleave: e.onPanelLeave },
											},
											[
												t("div", { staticClass: "panel-arrow" }),
												t("chat-agent-card", {
													attrs: { agent: e.hoveredAgentCard.agent, "show-actions": !0 },
													on: { "start-chat": e.quickStartAgentChat },
												}),
											],
											1,
										)
									: e._e(),
								t(
									"el-main",
									{ staticStyle: { padding: "0" } },
									[
										t(
											"el-container",
											[
												t(
													"el-container",
													{ staticClass: "content-box" },
													[
														t(
															"el-main",
															{
																staticClass: "im-chat-main",
																attrs: { id: "chatScrollBox" },
																on: { scroll: e.onScroll },
															},
															[
																t("div", { staticClass: "im-chat-box" }, [
																	(e.currentAgentChat, e._e()),
																	t(
																		"ul",
																		[
																			e.currentAgentChat
																				? e._l(
																						e.displayMessages,
																						function (s, i) {
																							return t(
																								"li",
																								{
																									key:
																										s.tmpId ||
																										s.id ||
																										"agent-" + i,
																								},
																								[
																									t(
																										"chat-message-item",
																										{
																											attrs: {
																												mine: e.isMineMessage(
																													s,
																												),
																												headImage:
																													e.headImage(
																														s,
																													) ||
																													"",
																												showName:
																													e.showName(
																														s,
																													) ||
																													"未知",
																												msgInfo:
																													s,
																												groupMembers:
																													[],
																											},
																											on: {
																												call: function (
																													t,
																												) {
																													return e.onCall(
																														s.type,
																													)
																												},
																												delete: e.deleteMessage,
																												recall: e.recallMessage,
																											},
																										},
																									),
																								],
																								1,
																							)
																						},
																					)
																				: e._l(
																						e.displayMessages,
																						function (s, i) {
																							return t(
																								"li",
																								{
																									key:
																										s.tmpId ||
																										s.id ||
																										i,
																								},
																								[
																									"llm-stream" ===
																										s.type &&
																									i >= e.showMinIdx
																										? t(
																												"LLMStreamMessage",
																												{
																													ref:
																														"llm-stream-" +
																														s.streamId,
																													refInFor:
																														!0,
																													attrs: {
																														"stream-id":
																															s.streamId,
																														mine: e.isMineMessage(
																															s,
																														),
																														"head-image":
																															e.headImage(
																																s,
																															),
																														"show-name":
																															e.showName(
																																s,
																															),
																														"msg-info":
																															s,
																													},
																													on: {
																														completed:
																															e.onLLMStreamCompleted,
																														error: e.onLLMStreamError,
																														"need-scroll":
																															e.scrollToBottom,
																													},
																												},
																											)
																										: i >=
																											  e.showMinIdx
																											? t(
																													"chat-message-item",
																													{
																														attrs: {
																															mine: e.isMineMessage(
																																s,
																															),
																															headImage:
																																e.headImage(
																																	s,
																																),
																															showName:
																																e.showName(
																																	s,
																																),
																															msgInfo:
																																s,
																															groupMembers:
																																e.groupMembers,
																														},
																														on: {
																															call: function (
																																t,
																															) {
																																return e.onCall(
																																	s.type,
																																)
																															},
																															delete: e.deleteMessage,
																															recall: e.recallMessage,
																														},
																													},
																												)
																											: e._e(),
																								],
																								1,
																							)
																						},
																					),
																		],
																		2,
																	),
																]),
															],
														),
														t(
															"el-footer",
															{
																staticClass: "im-chat-footer",
																attrs: { height: "220px" },
															},
															[
																t("div", { staticClass: "chat-tool-bar" }, [
																	t("div", {
																		ref: "emotion",
																		staticClass: "icon iconfont icon-emoji",
																		attrs: { title: "表情" },
																		on: {
																			click: function (t) {
																				return (
																					t.stopPropagation(),
																					e.showEmotionBox()
																				)
																			},
																		},
																	}),
																	t(
																		"div",
																		{ attrs: { title: "发送图片" } },
																		[
																			t(
																				"file-upload",
																				{
																					attrs: {
																						action: "/image/upload",
																						maxSize: 104857600,
																						fileTypes: [
																							"image/jpeg",
																							"image/png",
																							"image/jpg",
																							"image/webp",
																							"image/gif",
																						],
																					},
																					on: {
																						before: e.onImageBefore,
																						success: e.onImageSuccess,
																						fail: e.onImageFail,
																					},
																				},
																				[
																					t("i", {
																						staticClass:
																							"el-icon-picture-outline",
																					}),
																				],
																			),
																		],
																		1,
																	),
																	t(
																		"div",
																		{ attrs: { title: "发送文件" } },
																		[
																			t(
																				"file-upload",
																				{
																					ref: "fileUpload",
																					attrs: {
																						action: "/file/upload",
																						maxSize: 10485760,
																					},
																					on: {
																						before: e.onFileBefore,
																						success: e.onFileSuccess,
																						fail: e.onFileFail,
																					},
																				},
																				[
																					t("i", {
																						staticClass: "el-icon-wallet",
																					}),
																				],
																			),
																		],
																		1,
																	),
																	t("div", {
																		directives: [
																			{
																				name: "show",
																				rawName: "v-show",
																				value: e.isGroup && e.memberSize <= 500,
																				expression:
																					"isGroup && memberSize <= 500",
																			},
																		],
																		staticClass: "icon iconfont icon-receipt",
																		class: e.isReceipt ? "chat-tool-active" : "",
																		attrs: { title: "回执消息" },
																		on: { click: e.onSwitchReceipt },
																	}),
																	t("div", {
																		staticClass: "el-icon-microphone",
																		attrs: { title: "发送语音" },
																		on: {
																			click: function (t) {
																				return e.showRecordBox()
																			},
																		},
																	}),
																	t("div", {
																		directives: [
																			{
																				name: "show",
																				rawName: "v-show",
																				value: e.isPrivate,
																				expression: "isPrivate",
																			},
																		],
																		staticClass: "el-icon-phone-outline",
																		attrs: { title: "语音通话" },
																		on: {
																			click: function (t) {
																				return e.showPrivateVideo("voice")
																			},
																		},
																	}),
																	t("div", {
																		directives: [
																			{
																				name: "show",
																				rawName: "v-show",
																				value: e.isGroup,
																				expression: "isGroup",
																			},
																		],
																		staticClass: "el-icon-phone-outline",
																		attrs: { title: "语音通话" },
																		on: {
																			click: function (t) {
																				return e.onGroupVideo()
																			},
																		},
																	}),
																	t("div", {
																		directives: [
																			{
																				name: "show",
																				rawName: "v-show",
																				value: e.isPrivate,
																				expression: "isPrivate",
																			},
																		],
																		staticClass: "el-icon-video-camera",
																		attrs: { title: "视频通话" },
																		on: {
																			click: function (t) {
																				return e.showPrivateVideo("video")
																			},
																		},
																	}),
																	t("div", {
																		staticClass: "el-icon-chat-dot-round",
																		attrs: { title: "聊天记录" },
																		on: {
																			click: function (t) {
																				return e.showHistoryBox()
																			},
																		},
																	}),
																]),
																t(
																	"div",
																	{ staticClass: "send-content-area" },
																	[
																		t("ChatInput", {
																			ref: "chatInput",
																			attrs: {
																				ownerId:
																					("GROUP" === e.chat.type &&
																						e.group.ownerId) ||
																					e.mine.id,
																				targetUserId:
																					"PRIVATE" === e.chat.type
																						? e.chat.targetId
																						: null,
																				"group-members": e.groupMembers,
																			},
																			on: { submit: e.sendMessage },
																		}),
																		t(
																			"div",
																			{ staticClass: "send-btn-area" },
																			[
																				t(
																					"el-button",
																					{
																						attrs: {
																							type: "primary",
																							icon: "el-icon-s-promotion",
																						},
																						on: {
																							click: function (t) {
																								return e.notifySend()
																							},
																						},
																					},
																					[e._v("发送")],
																				),
																			],
																			1,
																		),
																	],
																	1,
																),
															],
														),
													],
													1,
												),
												e.showSide || e.showAgentSide
													? t(
															"el-aside",
															{
																staticClass: "chat-side-panel",
																attrs: { width: "320px" },
															},
															[
																"GROUP" === e.chat.type && e.showSide
																	? [
																			t(
																				"el-tabs",
																				{
																					staticClass: "side-tabs",
																					attrs: { type: "card" },
																					model: {
																						value: e.activeSideTab,
																						callback: function (t) {
																							e.activeSideTab = t
																						},
																						expression: "activeSideTab",
																					},
																				},
																				[
																					t(
																						"el-tab-pane",
																						{
																							attrs: {
																								label: "智能体",
																								name: "agents",
																							},
																						},
																						[
																							t("chat-agent-side", {
																								attrs: {
																									chat: e.chat,
																									group: e.group,
																									groupMembers:
																										e.groupMembers,
																								},
																								on: {
																									"start-agent-chat":
																										e.startAgentChat,
																									"edit-agent":
																										e.editAgent,
																								},
																							}),
																						],
																						1,
																					),
																					t(
																						"el-tab-pane",
																						{
																							attrs: {
																								label: "群成员",
																								name: "members",
																							},
																						},
																						[
																							t("chat-group-side", {
																								attrs: {
																									group: e.group,
																									groupMembers:
																										e.groupMembers,
																								},
																								on: {
																									reload: function (
																										t,
																									) {
																										return e.loadGroup(
																											e.group.id,
																										)
																									},
																								},
																							}),
																						],
																						1,
																					),
																				],
																				1,
																			),
																		]
																	: e.showAgentSide
																		? [
																				t("chat-agent-side", {
																					attrs: {
																						chat: e.chat,
																						group: e.group,
																						groupMembers: e.groupMembers,
																					},
																					on: {
																						"start-agent-chat":
																							e.startAgentChat,
																						"edit-agent": e.editAgent,
																					},
																				}),
																			]
																		: e._e(),
															],
															2,
														)
													: e._e(),
											],
											1,
										),
									],
									1,
								),
								t("emotion", { ref: "emoBox", on: { emotion: e.onEmotion } }),
								t("chat-record", {
									attrs: { visible: e.showRecord },
									on: { close: e.closeRecordBox, send: e.onSendRecord },
								}),
								t("group-member-selector", {
									ref: "rtcSel",
									attrs: { group: e.group },
									on: { complete: e.onInviteOk },
								}),
								t("rtc-group-join", { ref: "rtcJoin", attrs: { groupId: e.group.id } }),
								t("chat-history", {
									attrs: {
										visible: e.showHistory,
										chat: e.chat,
										friend: e.friend,
										group: e.group,
										groupMembers: e.groupMembers,
									},
									on: { close: e.closeHistoryBox },
								}),
							],
							1,
						),
					],
					1,
				)
			},
			o = [],
			n =
				(s("d9e2"),
				s("14d9"),
				s("0643"),
				s("2382"),
				s("fffc"),
				s("4e3e"),
				s("a573"),
				s("88a7"),
				s("271a"),
				s("5494"),
				s("7a32")),
			a = function () {
				var e = this,
					t = e._self._c
				return t("div", { staticClass: "chat-agent-side" }, [
					t(
						"div",
						{ staticClass: "agent-side-search" },
						[
							t(
								"el-input",
								{
									attrs: { placeholder: "搜索智能体", size: "small" },
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
					t(
						"div",
						{ staticClass: "agent-side-scrollbar" },
						[
							t(
								"el-scrollbar",
								{
									directives: [
										{
											name: "loading",
											rawName: "v-loading",
											value: e.loading,
											expression: "loading",
										},
									],
									staticStyle: { height: "100%" },
									attrs: { "element-loading-text": "加载中..." },
								},
								[
									t("div", { staticClass: "agent-side-list" }, [
										e.filteredMyAgents.length > 0
											? t(
													"div",
													{ staticClass: "agent-section" },
													[
														t("div", { staticClass: "section-title" }, [
															e._v(e._s(e.agentSectionTitle)),
														]),
														e._l(e.filteredMyAgents, function (s) {
															var i
															return t(
																"div",
																{ key: s.id },
																[
																	t("chat-agent-member", {
																		staticClass: "agent-side-member",
																		attrs: {
																			agent: s,
																			active:
																				(null === (i = e.selectedAgent) ||
																				void 0 === i
																					? void 0
																					: i.id) === s.id,
																		},
																		on: { "start-chat": e.handleStartChat },
																		nativeOn: {
																			click: function (t) {
																				return e.selectAgent(s)
																			},
																		},
																	}),
																],
																1,
															)
														}),
													],
													2,
												)
											: e._e(),
										e.filteredSharedAgents.length > 0
											? t(
													"div",
													{ staticClass: "agent-section" },
													[
														t("div", { staticClass: "section-title" }, [
															e._v("共享智能体"),
														]),
														e._l(e.filteredSharedAgents, function (s) {
															var i
															return t(
																"div",
																{ key: s.id },
																[
																	t("chat-agent-member", {
																		staticClass: "agent-side-member",
																		attrs: {
																			agent: s,
																			active:
																				(null === (i = e.selectedAgent) ||
																				void 0 === i
																					? void 0
																					: i.id) === s.id,
																		},
																		on: { "start-chat": e.handleStartChat },
																		nativeOn: {
																			click: function (t) {
																				return e.selectAgent(s)
																			},
																		},
																	}),
																],
																1,
															)
														}),
													],
													2,
												)
											: e._e(),
										e.loading ||
										0 !== e.filteredMyAgents.length ||
										0 !== e.filteredSharedAgents.length
											? e._e()
											: t(
													"div",
													{ staticClass: "empty-state" },
													[
														t("i", { staticClass: "el-icon-user" }),
														t("p", [e._v("暂无可用智能体")]),
														t(
															"el-button",
															{
																attrs: { size: "small", type: "text" },
																on: { click: e.refreshAgents },
															},
															[e._v("刷新")],
														),
													],
													1,
												),
									]),
								],
							),
						],
						1,
					),
					e.selectedAgent
						? t(
								"div",
								{ staticClass: "agent-detail-panel" },
								[
									t("el-divider", { attrs: { "content-position": "center" } }, [e._v("智能体信息")]),
									t(
										"el-form",
										{ attrs: { "label-position": "top", size: "small" } },
										[
											t(
												"el-form-item",
												{ attrs: { label: "名称" } },
												[
													t("el-input", {
														attrs: { disabled: "" },
														model: {
															value: e.selectedAgent.name,
															callback: function (t) {
																e.$set(e.selectedAgent, "name", t)
															},
															expression: "selectedAgent.name",
														},
													}),
												],
												1,
											),
											t(
												"el-form-item",
												{ attrs: { label: "描述" } },
												[
													t("el-input", {
														attrs: { disabled: "", type: "textarea", rows: 3 },
														model: {
															value: e.selectedAgent.roleDescription,
															callback: function (t) {
																e.$set(e.selectedAgent, "roleDescription", t)
															},
															expression: "selectedAgent.roleDescription",
														},
													}),
												],
												1,
											),
											t(
												"el-form-item",
												{ attrs: { label: "状态" } },
												[
													t(
														"el-tag",
														{
															attrs: {
																type: e.getStatusTagType(e.selectedAgent.status),
																size: "small",
															},
														},
														[
															e._v(
																" " +
																	e._s(e.getStatusText(e.selectedAgent.status)) +
																	" ",
															),
														],
													),
												],
												1,
											),
											t(
												"div",
												{ staticClass: "btn-group" },
												[
													t(
														"el-button",
														{
															attrs: {
																type: "primary",
																size: "small",
																disabled: "online" !== e.selectedAgent.status,
															},
															on: { click: e.startAgentChat },
														},
														[e._v(" 开始对话 ")],
													),
													e.canManageAgent
														? t(
																"el-button",
																{
																	attrs: { size: "small" },
																	on: { click: e.editAgent },
																},
																[e._v("编辑")],
															)
														: e._e(),
												],
												1,
											),
										],
										1,
									),
								],
								1,
							)
						: e._e(),
				])
			},
			r = [],
			l = function () {
				var e,
					t = this,
					s = t._self._c
				return s(
					"div",
					{
						staticClass: "chat-agent-member",
						class: { active: t.active, disabled: !t.isAvailable },
						on: { dblclick: t.startChat },
					},
					[
						s("div", { staticClass: "agent-avatar" }, [
							s(
								"div",
								{ staticClass: "avatar-container" },
								[
									s("head-image", {
										style: { borderRadius: "50%", border: "3px solid white" },
										attrs: { size: 48, name: t.agent.name, url: t.agent.avatar },
									}),
									s("div", { staticClass: "status-indicators" }, [
										s("div", {
											staticClass: "status-primary",
											class: t.primaryStatusClass,
											attrs: { title: t.primaryStatusText },
										}),
										s("div", {
											staticClass: "status-deployment",
											class: t.deploymentClass,
											attrs: { title: t.deploymentText },
										}),
									]),
								],
								1,
							),
						]),
						s("div", { staticClass: "agent-info" }, [
							s("div", { staticClass: "agent-header" }, [
								s("span", { staticClass: "agent-name", attrs: { title: t.agent.name } }, [
									t._v(t._s(t.agent.name)),
								]),
								s(
									"div",
									{ staticClass: "agent-badges" },
									[
										t.agent.isPublished
											? s(
													"el-tag",
													{ attrs: { size: "mini", type: "success", effect: "plain" } },
													[t._v("已发布")],
												)
											: t._e(),
										t.agent.isPrivate
											? t._e()
											: s("el-tag", { attrs: { size: "mini", type: "info", effect: "plain" } }, [
													t._v("共享"),
												]),
										t.isRecentlyActive
											? s(
													"el-tag",
													{ attrs: { size: "mini", type: "warning", effect: "plain" } },
													[t._v("活跃")],
												)
											: t._e(),
									],
									1,
								),
							]),
							s("div", { staticClass: "agent-description", attrs: { title: t.agent.roleDescription } }, [
								t._v(" " + t._s(t.agent.roleDescription || "暂无描述") + " "),
							]),
							s("div", { staticClass: "agent-meta" }, [
								s("div", { staticClass: "meta-item" }, [
									s("i", { staticClass: "el-icon-cpu" }),
									s("span", [t._v(t._s(t.modeText))]),
								]),
								s("div", { staticClass: "meta-item" }, [
									s("i", { staticClass: "el-icon-connection" }),
									s("span", [t._v(t._s(t.serviceStatusText))]),
								]),
								null !== (e = t.agent.capabilities) && void 0 !== e && e.maxConcurrency
									? s("div", { staticClass: "meta-item" }, [
											s("i", { staticClass: "el-icon-s-data" }),
											s("span", [t._v(t._s(t.agent.capabilities.maxConcurrency) + "并发")]),
										])
									: t._e(),
							]),
							t.displayCapabilities.length > 0
								? s(
										"div",
										{ staticClass: "agent-capabilities" },
										t._l(t.displayCapabilities, function (e) {
											return s(
												"el-tag",
												{ key: e, attrs: { size: "mini", effect: "plain", type: "info" } },
												[t._v(" " + t._s(e) + " ")],
											)
										}),
										1,
									)
								: t._e(),
						]),
						s(
							"div",
							{ staticClass: "agent-actions" },
							[
								s(
									"el-button",
									{
										attrs: { size: "small", type: "primary", disabled: !t.isAvailable },
										on: {
											click: function (e) {
												return e.stopPropagation(), t.$emit("start-chat", t.agent)
											},
										},
									},
									[t._v(" 开始对话 ")],
								),
								s(
									"el-dropdown",
									{
										attrs: { trigger: "click", placement: "bottom-end" },
										on: { command: t.handleCommand },
									},
									[
										s(
											"el-button",
											{
												attrs: { size: "mini", type: "text" },
												on: {
													click: function (e) {
														e.stopPropagation()
													},
												},
											},
											[s("i", { staticClass: "el-icon-more" })],
										),
										s(
											"el-dropdown-menu",
											{ attrs: { slot: "dropdown" }, slot: "dropdown" },
											[
												s("el-dropdown-item", { attrs: { command: "details" } }, [
													s("i", { staticClass: "el-icon-view" }),
													t._v(" 查看详情 "),
												]),
												t.canEdit
													? s("el-dropdown-item", { attrs: { command: "edit" } }, [
															s("i", { staticClass: "el-icon-edit" }),
															t._v(" 编辑配置 "),
														])
													: t._e(),
												t.canManage
													? s(
															"el-dropdown-item",
															{ attrs: { command: "restart", disabled: !t.isOnline } },
															[
																s("i", { staticClass: "el-icon-refresh" }),
																t._v(" 重启服务 "),
															],
														)
													: t._e(),
												t.canShare
													? s(
															"el-dropdown-item",
															{ attrs: { command: "share", divided: "" } },
															[
																s("i", { staticClass: "el-icon-share" }),
																t._v(" 分享设置 "),
															],
														)
													: t._e(),
												t.canEdit
													? s(
															"el-dropdown-item",
															{ attrs: { command: "delete", divided: "" } },
															[s("i", { staticClass: "el-icon-delete" }), t._v(" 删除 ")],
														)
													: t._e(),
											],
											1,
										),
									],
									1,
								),
							],
							1,
						),
						t.isOnline
							? s("div", { staticClass: "heartbeat-indicator", class: { pulse: t.showPulse } })
							: t._e(),
					],
				)
			},
			c = [],
			d = s("4036"),
			h = {
				name: "chatAgentMember",
				components: { HeadImage: d["a"] },
				props: {
					agent: { type: Object, required: !0 },
					active: { type: Boolean, default: !1 },
					height: { type: Number, default: 80 },
				},
				data() {
					return { showPulse: !1, pulseInterval: null }
				},
				computed: {
					isOnline() {
						return "online" === this.agent.serviceStatus && this.agent.isActive
					},
					isAvailable() {
						return this.isOnline && this.agent.isPublished
					},
					isRecentlyActive() {
						if (!this.agent.lastHeartbeat) return !1
						const e = Date.now(),
							t = new Date(this.agent.lastHeartbeat).getTime()
						return e - t < 3e4
					},
					primaryStatusClass() {
						return this.agent.isActive
							? "online" === this.agent.serviceStatus
								? "status-online"
								: "status-offline"
							: "status-inactive"
					},
					primaryStatusText() {
						return this.agent.isActive
							? "online" === this.agent.serviceStatus
								? "在线服务"
								: "离线"
							: "未激活"
					},
					deploymentClass() {
						var e
						const t = (null === (e = this.agent.deployment) || void 0 === e ? void 0 : e.type) || "unknown"
						return "deployment-" + t
					},
					deploymentText() {
						var e
						const t = { pc: "本地PC", cloud: "云端", mobile: "移动端", web: "Web端" }
						return t[null === (e = this.agent.deployment) || void 0 === e ? void 0 : e.type] || "未知"
					},
					serviceStatusText() {
						const e = { online: "服务在线", offline: "服务离线", starting: "启动中", error: "错误状态" }
						return e[this.agent.serviceStatus] || "未知状态"
					},
					modeText() {
						const e = {
							architect: "架构师",
							developer: "开发者",
							assistant: "助手",
							analyzer: "分析师",
							designer: "设计师",
							tester: "测试员",
						}
						return e[this.agent.mode] || this.agent.mode || "通用"
					},
					displayCapabilities() {
						var e, t, s, i
						const o = []
						return (
							null !== (e = this.agent.capabilities) &&
								void 0 !== e &&
								null !== (e = e.messageTypes) &&
								void 0 !== e &&
								e.includes("text") &&
								o.push("文本"),
							null !== (t = this.agent.capabilities) &&
								void 0 !== t &&
								null !== (t = t.messageTypes) &&
								void 0 !== t &&
								t.includes("json") &&
								o.push("结构化"),
							null !== (s = this.agent.capabilities) &&
								void 0 !== s &&
								null !== (s = s.taskTypes) &&
								void 0 !== s &&
								s.includes("execute") &&
								o.push("执行"),
							null !== (i = this.agent.capabilities) &&
								void 0 !== i &&
								null !== (i = i.taskTypes) &&
								void 0 !== i &&
								i.includes("query") &&
								o.push("查询"),
							o.slice(0, 3)
						)
					},
					canEdit() {
						return this.agent.userId === this.currentUserId
					},
					canManage() {
						var e
						return (
							this.canEdit &&
							"pc" === (null === (e = this.agent.deployment) || void 0 === e ? void 0 : e.type)
						)
					},
					canShare() {
						return this.canEdit && "none" !== this.agent.shareScope
					},
					currentUserId() {
						var e
						return null === (e = this.$store.state.userStore.userInfo.id) || void 0 === e
							? void 0
							: e.toString()
					},
				},
				methods: {
					startChat() {
						this.isAvailable
							? this.$emit("start-chat", this.agent)
							: this.$message.warning("智能体当前不可用")
					},
					handleCommand(e) {
						this.$emit("action", { command: e, agent: this.agent })
					},
					startPulseAnimation() {
						this.isOnline &&
							this.isRecentlyActive &&
							(this.pulseInterval = setInterval(() => {
								;(this.showPulse = !0),
									setTimeout(() => {
										this.showPulse = !1
									}, 1e3)
							}, 3e3))
					},
					stopPulseAnimation() {
						this.pulseInterval && (clearInterval(this.pulseInterval), (this.pulseInterval = null))
					},
				},
				mounted() {
					this.startPulseAnimation()
				},
				beforeDestroy() {
					this.stopPulseAnimation()
				},
				watch: {
					isOnline() {
						this.stopPulseAnimation(),
							this.$nextTick(() => {
								this.startPulseAnimation()
							})
					},
				},
			},
			u = h,
			m = (s("a2b2"), s("2877")),
			g = Object(m["a"])(u, l, c, !1, null, "e6fc3d06", null),
			p = g.exports,
			f = {
				name: "chatAgentSide",
				components: { ChatAgentMember: p },
				props: { chat: Object, group: Object, groupMembers: Array },
				data() {
					return { searchText: "", myAgents: [], sharedAgents: [], selectedAgent: null, loading: !1 }
				},
				computed: {
					filteredMyAgents() {
						return this.searchText
							? this.myAgents.filter(
									(e) =>
										e.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
										(e.roleDescription &&
											e.roleDescription.toLowerCase().includes(this.searchText.toLowerCase())),
								)
							: this.myAgents
					},
					filteredSharedAgents() {
						return this.searchText
							? this.sharedAgents.filter(
									(e) =>
										e.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
										(e.roleDescription &&
											e.roleDescription.toLowerCase().includes(this.searchText.toLowerCase())),
								)
							: this.sharedAgents
					},
					scrollHeight() {
						const e = 300,
							t = this.filteredMyAgents.length + this.filteredSharedAgents.length
						return Math.min(400, e + 10 * t)
					},
					canManageAgent() {
						return this.selectedAgent && this.selectedAgent.userId === this.currentUserId
					},
					currentUserId() {
						return this.$store.state.userStore.userInfo.id
					},
					agentSectionTitle() {
						return this.chat
							? "PRIVATE" === this.chat.type
								? (this.chat.targetName || "对方") + "的智能体"
								: "GROUP" === this.chat.type
									? "我的智能体"
									: "智能体"
							: "智能体"
					},
				},
				methods: {
					async loadAgents() {
						this.loading = !0
						try {
							await this.loadUserAgents(),
								"GROUP" === this.chat.type
									? await this.loadGroupSharedAgents()
									: await this.loadFriendSharedAgents()
						} catch (e) {
							console.error("Failed to load agents:", e), this.$message.error("加载智能体失败")
						} finally {
							this.loading = !1
						}
					},
					async loadUserAgents() {
						try {
							var e
							let t = this.currentUserId
							"PRIVATE" === this.chat.type
								? (t = this.chat.targetId)
								: "GROUP" === this.chat.type && (t = this.currentUserId)
							const s =
									(null === (e = this.$store.state.userStore) ||
									void 0 === e ||
									null === (e = e.userInfo) ||
									void 0 === e
										? void 0
										: e.terminal) || 0,
								i = `${t}_${s}`
							console.log("Loading agents for:", {
								chatType: this.chat.type,
								targetUserId: t,
								fullTargetId: i,
								chatTargetId: this.chat.targetId,
							})
							const o = await this.$http.get("/api/roocode/redis/agents/" + i)
							;(this.myAgents = (o || []).map((e) => ({
								...e,
								status: e.isActive ? "online" : "offline",
							}))),
								console.log("Loaded user agents:", this.myAgents)
						} catch (t) {
							console.error("Failed to load user agents:", t), (this.myAgents = [])
						}
					},
					async loadGroupSharedAgents() {
						if (this.group && this.groupMembers)
							try {
								const e = await this.callRooCodeCommand("roo-cline.getSharedAgents", {
									shareScope: "groups",
									allowedGroups: [this.group.id],
									excludeUserId: this.currentUserId,
								})
								this.sharedAgents = (e.agents || []).map((e) => ({
									...e,
									status: e.status || "online",
								}))
							} catch (e) {
								console.error("Failed to load group shared agents:", e), (this.sharedAgents = [])
							}
					},
					async loadFriendSharedAgents() {
						if (this.chat && "PRIVATE" === this.chat.type)
							try {
								const e = await this.callRooCodeCommand("roo-cline.getSharedAgents", {
									shareScope: "friends",
									allowedUsers: [this.chat.targetId],
									excludeUserId: this.currentUserId,
								})
								this.sharedAgents = (e.agents || []).map((e) => ({
									...e,
									status: e.status || "online",
								}))
							} catch (e) {
								console.error("Failed to load friend shared agents:", e), (this.sharedAgents = [])
							}
					},
					selectAgent(e) {
						this.selectedAgent = e
					},
					handleStartChat(e) {
						;(this.selectedAgent = e), this.startAgentChat()
					},
					startAgentChat() {
						this.selectedAgent &&
							(this.selectedAgent.isActive && "online" === this.selectedAgent.serviceStatus
								? this.$emit("start-agent-chat", {
										agent: this.selectedAgent,
										chat: this.chat,
										member: null,
									})
								: this.$message.warning("智能体当前不可用，无法开始对话"))
					},
					editAgent() {
						this.selectedAgent && this.$emit("edit-agent", this.selectedAgent)
					},
					refreshAgents() {
						this.loadAgents()
					},
					getStatusTagType(e) {
						switch (e) {
							case "online":
								return "success"
							case "busy":
								return "warning"
							case "offline":
								return "info"
							case "error":
								return "danger"
							default:
								return "success"
						}
					},
					getStatusText(e) {
						switch (e) {
							case "online":
								return "在线"
							case "busy":
								return "忙碌"
							case "offline":
								return "离线"
							case "error":
								return "错误"
							default:
								return "在线"
						}
					},
					async callRooCodeCommand(e, t) {
						return new Promise((s, i) => {
							const o = Date.now() + Math.random(),
								n = (e) => {
									e.data.id === o &&
										(window.removeEventListener("message", n),
										e.data.error ? i(new Error(e.data.error)) : s(e.data.result || {}))
								}
							window.addEventListener("message", n),
								setTimeout(() => {
									window.removeEventListener("message", n), i(new Error("命令调用超时"))
								}, 1e4),
								window.parent.postMessage({ type: "vscode-command", command: e, params: t, id: o }, "*")
						})
					},
				},
				mounted() {
					this.loadAgents()
				},
				watch: {
					chat: {
						handler() {
							this.chat && ((this.selectedAgent = null), this.loadAgents())
						},
						immediate: !0,
					},
				},
			},
			v = f,
			C = (s("f752"), Object(m["a"])(v, a, r, !1, null, null, null)),
			I = C.exports,
			S = function () {
				var e = this,
					t = e._self._c
				return t("div", { staticClass: "chat-agent-card" }, [
					t(
						"div",
						{ staticClass: "card-avatar" },
						[
							t("head-image", {
								style: { borderRadius: "50%", border: "2px solid white" },
								attrs: { size: 48, name: e.agent.name, url: e.agent.avatar },
							}),
							t("div", {
								staticClass: "status-indicator",
								class: e.statusClass,
								attrs: { title: e.statusText },
							}),
						],
						1,
					),
					t("div", { staticClass: "card-info" }, [
						t("div", { staticClass: "card-header" }, [
							t("h4", { staticClass: "agent-name" }, [e._v(e._s(e.agent.name))]),
							t(
								"div",
								{ staticClass: "agent-badges" },
								[
									e.agent.isPublished
										? t("el-tag", { attrs: { size: "mini", type: "success", effect: "plain" } }, [
												e._v("已发布"),
											])
										: e._e(),
									e.isOnline
										? t("el-tag", { attrs: { size: "mini", type: "warning", effect: "plain" } }, [
												e._v("在线"),
											])
										: e._e(),
								],
								1,
							),
						]),
						t("p", { staticClass: "agent-description" }, [
							e._v(" " + e._s(e.agent.roleDescription || "暂无描述") + " "),
						]),
						t("div", { staticClass: "agent-meta" }, [
							t("div", { staticClass: "meta-item" }, [
								t("i", { staticClass: "el-icon-cpu" }),
								t("span", [e._v(e._s(e.modeText))]),
							]),
							t("div", { staticClass: "meta-item" }, [
								t("i", { staticClass: "el-icon-connection" }),
								t("span", [e._v(e._s(e.serviceStatusText))]),
							]),
						]),
						e.displayCapabilities.length > 0
							? t(
									"div",
									{ staticClass: "agent-capabilities" },
									e._l(e.displayCapabilities, function (s) {
										return t(
											"el-tag",
											{ key: s, attrs: { size: "mini", effect: "plain", type: "info" } },
											[e._v(" " + e._s(s) + " ")],
										)
									}),
									1,
								)
							: e._e(),
					]),
					e.showActions
						? t(
								"div",
								{ staticClass: "card-actions" },
								[
									t(
										"el-button",
										{
											attrs: {
												size: "small",
												type: "primary",
												disabled: !e.isAvailable,
												block: "",
											},
											on: {
												click: function (t) {
													return e.$emit("start-chat", e.agent)
												},
											},
										},
										[e._v(" 开始对话 ")],
									),
								],
								1,
							)
						: e._e(),
				])
			},
			w = [],
			T = {
				props: { agent: { type: Object, required: !0 }, showActions: { type: Boolean, default: !0 } },
				computed: {
					isOnline() {
						return "online" === this.agent.serviceStatus && this.agent.isActive
					},
					isAvailable() {
						return this.isOnline && this.agent.isPublished
					},
					statusClass() {
						return this.agent.isActive
							? "online" === this.agent.serviceStatus
								? "status-online"
								: "status-offline"
							: "status-inactive"
					},
					statusText() {
						return this.agent.isActive
							? "online" === this.agent.serviceStatus
								? "在线"
								: "离线"
							: "未激活"
					},
					serviceStatusText() {
						const e = { online: "在线", offline: "离线", starting: "启动中", error: "错误" }
						return e[this.agent.serviceStatus] || "未知"
					},
					modeText() {
						const e = { architect: "架构师", developer: "开发者", assistant: "助手", analyzer: "分析师" }
						return e[this.agent.mode] || this.agent.mode || "通用"
					},
					displayCapabilities() {
						var e, t, s
						const i = []
						return (
							null !== (e = this.agent.capabilities) &&
								void 0 !== e &&
								null !== (e = e.messageTypes) &&
								void 0 !== e &&
								e.includes("text") &&
								i.push("文本"),
							null !== (t = this.agent.capabilities) &&
								void 0 !== t &&
								null !== (t = t.messageTypes) &&
								void 0 !== t &&
								t.includes("json") &&
								i.push("JSON"),
							null !== (s = this.agent.capabilities) &&
								void 0 !== s &&
								null !== (s = s.taskTypes) &&
								void 0 !== s &&
								s.includes("execute") &&
								i.push("执行"),
							i.slice(0, 3)
						)
					},
				},
			},
			b = { name: "ChatAgentCard", components: { HeadImage: d["a"] }, mixins: [T] },
			y = b,
			x = (s("9607"), Object(m["a"])(y, S, w, !1, null, "2571a6b5", null)),
			A = x.exports,
			$ = s("38c4"),
			E = s("1a05"),
			k = s("18c6"),
			M = s("ba5f"),
			N = s("647d"),
			_ = s("36a4"),
			P = s("2082"),
			R = s("cf65"),
			F = s("fa2e"),
			D = function () {
				var e = this,
					t = e._self._c
				return t("div", { staticClass: "chat-msg-item" }, [
					t("div", { staticClass: "chat-msg-normal", class: { "chat-msg-mine": e.mine } }, [
						t(
							"div",
							{ staticClass: "head-image" },
							[
								t("head-image", {
									attrs: { name: e.showName, size: 38, url: e.headImage, id: e.msgInfo.sendId },
								}),
							],
							1,
						),
						t("div", { staticClass: "chat-msg-content" }, [
							t(
								"div",
								{
									directives: [
										{
											name: "show",
											rawName: "v-show",
											value: e.msgInfo.groupId && !e.msgInfo.selfSend,
											expression: "msgInfo.groupId && !msgInfo.selfSend",
										},
									],
									staticClass: "chat-msg-top",
								},
								[t("span", [e._v(e._s(e.showName))])],
							),
							t("div", { staticClass: "chat-msg-bottom" }, [
								t(
									"div",
									{ ref: "chatMsgBox", staticClass: "chat-msg-text" },
									[
										t("streaming-renderer", {
											ref: "streamingRenderer",
											attrs: { "initial-message": e.streamingMessage },
											on: {
												"need-scroll": e.scrollToBottom,
												"streaming-finish": e.onStreamingFinish,
												error: e.handleError,
											},
										}),
									],
									1,
								),
							]),
						]),
					]),
				])
			},
			L = [],
			G = s("d5b3"),
			O = {
				name: "LLMStreamMessage",
				components: { HeadImage: d["a"], StreamingRenderer: G["a"] },
				props: {
					streamId: { type: String, required: !0 },
					msgInfo: { type: Object, required: !0 },
					mine: { type: Boolean, default: !1 },
					headImage: { type: String, default: "" },
					showName: { type: String, default: "" },
				},
				data() {
					return {
						chunks: [],
						content: "",
						isStreaming: !1,
						isCompleted: !1,
						startTime: null,
						endTime: null,
						sequence: 0,
						error: null,
					}
				},
				computed: {
					streamingMessage() {
						return {
							content: this.content,
							type: "AGENT",
							format: "markdown",
							streaming: this.isStreaming,
							isAgent: !0,
							streamId: this.streamId,
							msgInfo: this.msgInfo,
						}
					},
				},
				methods: {
					startStream() {
						;(this.isStreaming = !0),
							(this.isCompleted = !1),
							(this.startTime = Date.now()),
							(this.chunks = []),
							(this.content = ""),
							(this.sequence = 0),
							(this.error = null),
							this.$refs.streamingRenderer && this.$refs.streamingRenderer.startStreaming("")
					},
					addChunk(e, t) {
						this.isStreaming || this.startStream(),
							void 0 !== t &&
								(t > this.sequence + 1 &&
									console.warn(`[LLMStream] 序列号不连续: 期望 ${this.sequence + 1}, 收到 ${t}`),
								(this.sequence = t)),
							this.chunks.push(e),
							(this.content += e),
							this.$refs.streamingRenderer && this.$refs.streamingRenderer.appendChunk(e)
					},
					endStream() {
						;(this.isStreaming = !1),
							(this.isCompleted = !0),
							(this.endTime = Date.now()),
							this.$refs.streamingRenderer && this.$refs.streamingRenderer.finishStreaming()
					},
					onStreamingFinish(e) {
						this.$emit("completed", {
							streamId: this.streamId,
							content: e.content,
							chunks: this.chunks.length,
							duration: this.endTime - this.startTime,
							stats: e.stats,
						})
					},
					handleError(e) {
						;(this.isStreaming = !1),
							(this.isCompleted = !0),
							(this.error = e.error || e),
							(this.endTime = Date.now()),
							console.error("[LLMStream] 流式传输错误: " + this.streamId, this.error),
							this.$emit("error", { streamId: this.streamId, error: this.error })
					},
					scrollToBottom() {
						this.$emit("need-scroll")
					},
					clear() {
						;(this.chunks = []),
							(this.content = ""),
							(this.isStreaming = !1),
							(this.isCompleted = !1),
							(this.startTime = null),
							(this.endTime = null),
							(this.sequence = 0),
							(this.error = null)
					},
				},
			},
			V = O,
			B = (s("5d4f"), Object(m["a"])(V, D, L, !1, null, "47c40186", null)),
			U = B.exports,
			z = s("a002"),
			j = s.n(z),
			H = {
				name: "chatPrivate",
				components: {
					ChatInput: F["a"],
					ChatMessageItem: $["a"],
					FileUpload: E["a"],
					ChatGroupSide: n["a"],
					ChatAgentSide: I,
					ChatAgentCard: A,
					Emotion: k["a"],
					ChatRecord: M["a"],
					ChatHistory: N["a"],
					ChatAtBox: _["a"],
					GroupMemberSelector: P["a"],
					RtcGroupJoin: R["a"],
					LLMStreamMessage: U,
				},
				props: { chat: { type: Object } },
				data() {
					return {
						userInfo: {},
						group: {},
						groupMembers: [],
						sendImageUrl: "",
						sendImageFile: "",
						placeholder: "",
						isReceipt: !0,
						showRecord: !1,
						showSide: !1,
						showAgentSide: !1,
						showHistory: !1,
						activeSideTab: "agents",
						currentAgentChat: null,
						a2aClient: null,
						streamingMessageId: null,
						recentAgents: [],
						hoveredAgentCard: null,
						hoverCardTimeout: null,
						avatarsExpanded: !1,
						avatarsFullyExpanded: !1,
						avatarExpandTimeout: null,
						avatarFullyExpandTimeout: null,
						pendingHoverCard: null,
						hoverCheckTimeout: null,
						lockMessage: !1,
						showMinIdx: 0,
						reqQueue: [],
						isSending: !1,
						activeLLMStream: null,
						llmStreams: new Map(),
						agentStatusTimer: null,
						lastCompletedTask: null,
					}
				},
				methods: {
					moveChatToTop() {
						let e = this.$store.getters.findChatIdx(this.chat)
						this.$store.commit("moveTop", e)
					},
					closeRefBox() {
						this.$refs.emoBox.close()
					},
					onCall(e) {
						e == this.$enums.MESSAGE_TYPE.ACT_RT_VOICE
							? this.showPrivateVideo("voice")
							: e == this.$enums.MESSAGE_TYPE.ACT_RT_VIDEO && this.showPrivateVideo("video")
					},
					onSwitchReceipt() {
						;(this.isReceipt = !this.isReceipt), this.refreshPlaceHolder()
					},
					onImageSuccess(e, t) {
						let s = JSON.parse(JSON.stringify(t.msgInfo))
						;(s.content = JSON.stringify(e)),
							(s.receipt = this.isReceipt),
							this.sendMessageRequest(s).then((e) => {
								;(s.loadStatus = "ok"),
									(s.id = e.id),
									(this.isReceipt = !1),
									this.$store.commit("insertMessage", [s, t.chat])
							})
					},
					onImageFail(e, t) {
						let s = JSON.parse(JSON.stringify(t.msgInfo))
						;(s.loadStatus = "fail"), this.$store.commit("insertMessage", [s, t.chat])
					},
					onImageBefore(e) {
						if (this.isBanned) return void this.showBannedTip()
						let t = URL.createObjectURL(e),
							s = { originUrl: t, thumbUrl: t },
							i = {
								id: 0,
								tmpId: this.generateId(),
								fileId: e.uid,
								sendId: this.mine.id,
								content: JSON.stringify(s),
								sendTime: new Date().getTime(),
								selfSend: !0,
								type: 1,
								readedCount: 0,
								loadStatus: "loading",
								status: this.$enums.MESSAGE_STATUS.UNSEND,
							}
						this.fillTargetId(i, this.chat.targetId),
							this.$store.commit("insertMessage", [i, this.chat]),
							this.moveChatToTop(),
							this.scrollToBottom(),
							(e.msgInfo = i),
							(e.chat = this.chat)
					},
					onFileSuccess(e, t) {
						let s = { name: t.name, size: t.size, url: e },
							i = JSON.parse(JSON.stringify(t.msgInfo))
						;(i.content = JSON.stringify(s)),
							(i.receipt = this.isReceipt),
							this.sendMessageRequest(i).then((e) => {
								;(i.loadStatus = "ok"),
									(i.id = e.id),
									(this.isReceipt = !1),
									this.refreshPlaceHolder(),
									this.$store.commit("insertMessage", [i, t.chat])
							})
					},
					onFileFail(e, t) {
						let s = JSON.parse(JSON.stringify(t.msgInfo))
						;(s.loadStatus = "fail"), this.$store.commit("insertMessage", [s, t.chat])
					},
					onFileBefore(e) {
						if (this.isBanned) return void this.showBannedTip()
						let t = URL.createObjectURL(e),
							s = { name: e.name, size: e.size, url: t },
							i = {
								id: 0,
								tmpId: this.generateId(),
								sendId: this.mine.id,
								content: JSON.stringify(s),
								sendTime: new Date().getTime(),
								selfSend: !0,
								type: 2,
								loadStatus: "loading",
								readedCount: 0,
								status: this.$enums.MESSAGE_STATUS.UNSEND,
							}
						this.fillTargetId(i, this.chat.targetId),
							this.$store.commit("insertMessage", [i, this.chat]),
							this.moveChatToTop(),
							this.scrollToBottom(),
							(e.msgInfo = i),
							(e.chat = this.chat)
					},
					onCloseSide() {
						this.showSide = !1
					},
					onScrollToTop() {
						this.showMinIdx = this.showMinIdx > 10 ? this.showMinIdx - 10 : 0
					},
					onScroll(e) {
						let t,
							s = e.target
						;(t =
							window.vscodeVueChatUtils && window.vscodeVueChatUtils.safeGetProperty
								? window.vscodeVueChatUtils.safeGetProperty(s, "scrollTop")
								: s.scrollTop),
							t < 30 && (this.showMinIdx = this.showMinIdx > 20 ? this.showMinIdx - 20 : 0)
					},
					showEmotionBox() {
						let e = this.$refs.emotion.offsetWidth,
							t = this.$elm.fixLeft(this.$refs.emotion),
							s = this.$elm.fixTop(this.$refs.emotion)
						this.$refs.emoBox.open({ x: t + e / 2, y: s })
					},
					onEmotion(e) {
						this.$refs.chatInput.insertEmoji(e)
					},
					showRecordBox() {
						this.showRecord = !0
					},
					closeRecordBox() {
						this.showRecord = !1
					},
					showPrivateVideo(e) {
						if (this.isBanned) return void this.showBannedTip()
						let t = { mode: e, isHost: !0, friend: this.friend }
						this.$eventBus.$emit("openPrivateVideo", t)
					},
					onGroupVideo() {
						if (this.isBanned) return void this.showBannedTip()
						let e = [this.mine.id],
							t = this.$store.state.configStore.webrtc.maxChannel
						this.$refs.rtcSel.open(t, e, e, [])
					},
					onInviteOk(e) {
						if (e.length < 2) return
						let t = []
						e.forEach((e) => {
							t.push({
								id: e.userId,
								nickName: e.showNickName,
								headImage: e.headImage,
								isCamera: !1,
								isMicroPhone: !0,
							})
						})
						let s = { isHost: !0, groupId: this.group.id, inviterId: this.mine.id, userInfos: t }
						this.$eventBus.$emit("openGroupVideo", s)
					},
					showHistoryBox() {
						this.showHistory = !0
					},
					closeHistoryBox() {
						this.showHistory = !1
					},
					onSendRecord(e) {
						if (this.isBanned) return void this.showBannedTip()
						let t = { content: JSON.stringify(e), type: 3, receipt: this.isReceipt }
						this.fillTargetId(t, this.chat.targetId),
							this.sendMessageRequest(t).then((e) => {
								;(e.selfSend = !0),
									this.$store.commit("insertMessage", [e, this.chat]),
									this.moveChatToTop(),
									this.$refs.chatInput.focus(),
									this.scrollToBottom(),
									(this.showRecord = !1),
									(this.isReceipt = !1),
									this.refreshPlaceHolder()
							})
					},
					fillTargetId(e, t) {
						if ("GROUP" == this.chat.type) e.groupId = t
						else if (this.chat.isTerminalChat || this.chat.isTerminalInbox) {
							const s = t.split("_"),
								i = parseInt(s[0])
							if (((e.recvId = i), this.chat.isTerminalChat))
								(e.targetTerminal = this.chat.senderTerminal),
									(e.senderTerminal = this.getCurrentTerminal())
							else if (this.chat.isTerminalInbox) {
								const t = parseInt(s[1])
								;(e.targetTerminal = t), (e.senderTerminal = this.getCurrentTerminal())
							}
						} else (e.recvId = t), (e.senderTerminal = this.getCurrentTerminal())
					},
					notifySend() {
						this.$refs.chatInput.submit()
					},
					async sendMessage(e) {
						if ((this.resetEditor(), this.readedMessage(), this.currentAgentChat))
							return void (await this.sendToAgent(e))
						if (this.isBanned) return void this.showBannedTip()
						let t = this.isReceipt ? "【回执消息】" : ""
						for (let s = 0; s < e.length; s++) {
							let i = e[s]
							switch (i.type) {
								case "text":
									await this.sendTextMessage(t + i.content, i.atUserIds)
									break
								case "image":
									await this.sendImageMessage(i.content.file)
									break
								case "file":
									await this.sendFileMessage(i.content.file)
									break
							}
						}
						this.$emit("message-sent")
					},
					sendImageMessage(e) {
						return new Promise((t, s) => {
							this.onImageBefore(e)
							let i = new FormData()
							i.append("file", e),
								this.$http
									.post("/image/upload", i, { headers: { "Content-Type": "multipart/form-data" } })
									.then((s) => {
										this.onImageSuccess(s, e), t()
									})
									.catch((t) => {
										this.onImageFail(t, e), s()
									}),
								this.$nextTick(() => this.$refs.chatInput.focus()),
								this.scrollToBottom()
						})
					},
					sendTextMessage(e, t) {
						return new Promise((s, i) => {
							e.trim() || i()
							let o = { content: e, type: 0 }
							this.fillTargetId(o, this.chat.targetId),
								"GROUP" == this.chat.type && ((o.atUserIds = t), (o.receipt = this.isReceipt)),
								(this.lockMessage = !0),
								this.sendMessageRequest(o)
									.then((e) => {
										;(e.selfSend = !0),
											this.$store.commit("insertMessage", [e, this.chat]),
											this.moveChatToTop()
									})
									.finally(() => {
										this.scrollToBottom(), (this.isReceipt = !1), s()
									})
						})
					},
					sendFileMessage(e) {
						return new Promise((t, s) => {
							let i = this.$refs.fileUpload.beforeUpload(e)
							i && this.$refs.fileUpload.onFileUpload({ file: e })
						})
					},
					deleteMessage(e) {
						this.$confirm("确认删除消息?", "删除消息", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning",
						}).then(() => {
							this.$store.commit("deleteMessage", [e, this.chat])
						})
					},
					recallMessage(e) {
						this.$confirm("确认撤回消息?", "撤回消息", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning",
						}).then(() => {
							let t = `/message/${this.chat.type.toLowerCase()}/recall/${e.id}`
							this.$http({ url: t, method: "delete" }).then((e) => {
								this.$message.success("消息已撤回"),
									(e.selfSend = !0),
									this.$store.commit("recallMessage", [e, this.chat])
							})
						})
					},
					readedMessage() {
						if (0 != this.chat.unreadCount) {
							if ((this.$store.commit("resetUnreadCount", this.chat), "GROUP" == this.chat.type))
								var e = "/message/group/readed?groupId=" + this.chat.targetId
							else e = "/message/private/readed?friendId=" + this.chat.targetId
							this.$http({ url: e, method: "put" }).then(() => {})
						}
					},
					loadReaded(e) {
						;(e && e.toString().includes("agent_")) ||
							this.$http({ url: "/message/private/maxReadedId?friendId=" + e, method: "get" }).then(
								(t) => {
									this.$store.commit("readedMessage", { friendId: e, maxId: t })
								},
							)
					},
					loadGroup(e) {
						this.$http({ url: "/group/find/" + e, method: "get" }).then((e) => {
							;(this.group = e),
								this.$store.commit("updateChatFromGroup", e),
								this.$store.commit("updateGroup", e)
						}),
							this.$http({ url: "/group/members/" + e, method: "get" }).then((e) => {
								this.groupMembers = e
							})
					},
					updateFriendInfo() {
						if (this.isFriend) {
							let e = JSON.parse(JSON.stringify(this.friend))
							;(e.headImage = this.userInfo.headImageThumb),
								(e.nickName = this.userInfo.nickName),
								(e.showNickName = e.remarkNickName ? e.remarkNickName : e.nickName),
								this.$store.commit("updateChatFromFriend", e),
								this.$store.commit("updateFriend", e)
						} else this.$store.commit("updateChatFromUser", this.userInfo)
					},
					loadFriend(e) {
						e && e.toString().includes("agent_")
							? (this.userInfo = {
									id: e,
									nickName: this.chat.showName || "智能体",
									headImageThumb: this.chat.headImage,
								})
							: this.$http({ url: "/user/find/" + e, method: "GET" }).then((e) => {
									;(this.userInfo = e), this.updateFriendInfo()
								})
					},
					showName(e) {
						if (!e) return ""
						if (e.sendNickName) return e.sendNickName
						if (this.isGroup) {
							let t = this.groupMembers.find((t) => t.userId == e.sendId)
							return t ? t.showNickName : e.sendNickName || ""
						}
						return e.selfSend ? this.mine.nickName : this.chat.showName
					},
					headImage(e) {
						var t
						if (this.currentAgentChat)
							return e.selfSend
								? this.mine.headImageThumb || this.mine.headImage || ""
								: (null === (t = this.currentAgentChat.agent) || void 0 === t ? void 0 : t.avatar) || ""
						if (this.isGroup) {
							let t = this.groupMembers.find((t) => t.userId == e.sendId)
							return t ? t.headImage : ""
						}
						return e.sendId == this.mine.id ? this.mine.headImageThumb : this.chat.headImage
					},
					resetEditor() {
						this.$nextTick(() => {
							this.$refs.chatInput && (this.$refs.chatInput.clear(), this.$refs.chatInput.focus())
						})
					},
					scrollToBottom() {
						this.$nextTick(() => {
							let e = document.getElementById("chatScrollBox")
							e.scrollTop = null === e || void 0 === e ? void 0 : e.scrollHeight
						})
					},
					refreshPlaceHolder() {
						this.isReceipt
							? (this.placeholder = "【回执消息】")
							: this.$refs.editBox && this.$refs.editBox.innerHTML
								? (this.placeholder = "")
								: (this.placeholder = "聊点什么吧~")
					},
					sendMessageRequest(e) {
						return new Promise((t, s) => {
							this.reqQueue.push({ msgInfo: e, resolve: t, reject: s }), this.processReqQueue()
						})
					},
					processReqQueue() {
						if (this.reqQueue.length && !this.isSending) {
							this.isSending = !0
							const e = this.reqQueue.shift()
							this.$http({ url: this.messageAction, method: "post", data: e.msgInfo })
								.then((t) => {
									e.resolve(t)
								})
								.catch((t) => {
									e.reject(t)
								})
								.finally(() => {
									;(this.isSending = !1), this.processReqQueue()
								})
						}
					},
					showBannedTip() {
						let e = {
							tmpId: this.generateId(),
							sendId: this.mine.id,
							sendTime: new Date().getTime(),
							type: this.$enums.MESSAGE_TYPE.TIP_TEXT,
						}
						"PRIVATE" == this.chat.type
							? ((e.recvId = this.mine.id),
								(e.content = "该用户已被管理员封禁,原因:" + this.userInfo.reason))
							: ((e.groupId = this.group.id),
								(e.content = "本群聊已被管理员封禁,原因:" + this.group.reason)),
							this.$store.commit("insertMessage", [e, this.chat])
					},
					generateId() {
						return String(new Date().getTime()) + String(Math.floor(1e3 * Math.random()))
					},
					throttle(e, t) {
						let s,
							i = 0
						return function (...o) {
							const n = Date.now()
							n - i > t
								? (e.apply(this, o), (i = n))
								: (clearTimeout(s),
									(s = setTimeout(
										() => {
											e.apply(this, o), (i = Date.now())
										},
										t - (n - i),
									)))
						}
					},
					handleAvatarError(e) {
						e.target.src = "/img/default-avatar.png"
					},
					handleLLMStreamRequest(e) {
						let t = null
						if (e.question) {
							const s = e.question.match(/@任务\[([^\]]+)\]/)
							if (s) {
								const i = s[1].trim()
								"新建任务" !== i && (t = { name: i, id: e.streamId })
							}
						}
						const s = {
							streamId: e.streamId,
							title: e.question || "AI 助手",
							startTime: Date.now(),
							taskInfo: t,
							isStarted: !1,
						}
						this.llmStreams.set(e.streamId, s)
					},
					handleLLMStreamChunk(e) {
						const t = this.llmStreams.get(e.streamId)
						if (
							t &&
							(t.isStarted ||
								((t.isStarted = !0),
								(this.activeLLMStream = t),
								this.$nextTick(() => {
									requestAnimationFrame(() => {
										const t = this.$refs["llm-stream-" + e.streamId]
										if (t) {
											const e = Array.isArray(t) ? t[0] : t
											e && e.startStream && e.startStream()
										}
									})
								})),
							this.activeLLMStream && this.activeLLMStream.streamId === e.streamId)
						) {
							const t = this.$refs["llm-stream-" + e.streamId]
							if (t) {
								const s = Array.isArray(t) ? t[0] : t
								s && s.addChunk && s.addChunk(e.chunk, e.sequence)
							}
							this.$nextTick(() => {
								this.scrollToBottom()
							})
						}
					},
					handleLLMStreamEnd(e) {
						if (
							(console.error(
								`🔥🔥🔥 [ChatBox] [${new Date().toISOString()}] handleLLMStreamEnd 被调用了!!! 🔥🔥🔥`,
								e,
							),
							this.activeLLMStream && this.activeLLMStream.streamId === e.streamId)
						) {
							let t = null
							e.taskName && (t = { name: e.taskName, id: e.taskId }),
								t &&
									t.name &&
									"新建任务" !== t.name &&
									((this.lastCompletedTask = t),
									this.$nextTick(() => {
										this.setTaskContinuation(this.lastCompletedTask)
									}))
							const s = this.$refs["llm-stream-" + e.streamId]
							if (s) {
								const e = Array.isArray(s) ? s[0] : s
								e && e.endStream && e.endStream()
							}
						}
					},
					setTaskContinuation(e) {
						const t = this.$refs.chatInput
						t && t.setTaskContinuation && t.setTaskContinuation(e)
					},
					handleLLMStreamError(e) {
						if (
							(console.error("[ChatBox] LLM流式传输错误:", e),
							this.activeLLMStream && this.activeLLMStream.streamId === e.streamId)
						) {
							const t = this.$refs["llm-stream-" + e.streamId]
							if (t) {
								const s = Array.isArray(t) ? t[0] : t
								s && s.handleError && s.handleError(e.error || "流式传输错误")
							}
						}
					},
					onLLMStreamCompleted(e) {
						const t = document.getElementById("chatScrollBox"),
							s = t ? t.scrollTop : 0,
							i = {
								tmpId: e.streamId,
								sendId: 0,
								sendNickName: "AI 助手",
								sendTime: this.activeLLMStream ? this.activeLLMStream.startTime : new Date().getTime(),
								type: this.$enums.MESSAGE_TYPE.TEXT,
								content: e.content,
								selfSend: !1,
							}
						"PRIVATE" === this.chat.type ? (i.recvId = this.mine.id) : (i.groupId = this.group.id),
							(this.activeLLMStream = null),
							this.llmStreams.delete(e.streamId),
							this.$nextTick(() => {
								this.$store.commit("insertMessage", [i, this.chat]),
									this.$nextTick(() => {
										t && (t.scrollTop = s)
									})
							})
					},
					onLLMStreamError(e) {
						this.$message.error("AI响应失败: " + e.error),
							this.activeLLMStream &&
								this.handleLLMStreamError({ streamId: this.activeLLMStream.streamId, error: e.error })
					},
					registerLLMStreamHandlers() {
						const e = this.$wsApi.getMessageCallBack()
						this.$wsApi.setMessageCallBack((t, s) => {
							switch (t) {
								case 10:
									this.handleLLMStreamRequest(s)
									break
								case 11:
									this.handleLLMStreamChunk(s)
									break
								case 12:
									this.handleLLMStreamEnd(s)
									break
								case 13:
									this.handleLLMStreamError(s)
									break
							}
							e && e(t, s)
						})
					},
					getCurrentTerminal() {
						var e
						return "undefined" !== typeof window
							? window.parent !== window ||
								window.acquireVsCodeApi ||
								window.SharedServicesAccessor ||
								navigator.userAgent.includes("VSCode") ||
								"vscode-webview:" === window.location.protocol
								? 2
								: window.require ||
									  (null !== (e = window.process) && void 0 !== e && e.type) ||
									  window.isElectron ||
									  navigator.userAgent.includes("Electron")
									? 3
									: window.cordova ||
										  window.PhoneGap ||
										  window.phonegap ||
										  navigator.userAgent.includes("wv") ||
										  navigator.userAgent.includes("Mobile")
										? 1
										: 0
							: 0
					},
					isMineMessage(e) {
						if (void 0 !== e.selfSend) return e.selfSend
						if (parseInt(e.sendId) !== parseInt(this.mine.id)) return !1
						if (this.chat.isTerminalChat || this.chat.isTerminalInbox) {
							const t = this.getCurrentTerminal()
							if (void 0 !== e.senderTerminal) return e.senderTerminal === t
						}
						return !0
					},
					async initA2AClient(e) {
						var t
						if (!this.a2aClient) {
							let e
							if (window.BoxIM && window.BoxIM.A2AClient)
								(e = window.BoxIM.A2AClient),
									console.log("[ChatBox] ✅ Using global A2AClient from window.BoxIM.A2AClient")
							else if (window.BoxIMComponents && window.BoxIMComponents.A2AClient)
								(e = window.BoxIMComponents.A2AClient),
									console.log(
										"[ChatBox] ✅ Using global A2AClient from window.BoxIMComponents.A2AClient",
									)
							else
								try {
									console.log("[ChatBox] 尝试动态导入 A2AClient...")
									const t = await s.e("chunk-2d21df69").then(s.bind(null, "d414"))
									;(e = t.A2AClient || t.default),
										console.log("[ChatBox] ✅ Loaded A2AClient via dynamic import")
								} catch (o) {
									if (
										(console.error("[ChatBox] ❌ Failed to load A2AClient:", o),
										"undefined" === typeof e)
									)
										throw new Error("无法加载 A2A 客户端模块 - 请确保已正确构建")
									console.log("[ChatBox] ⚠️ Found A2AClient in global scope")
								}
							console.log("[ChatBox] 创建 A2AClient 实例..."),
								(this.a2aClient = new e()),
								console.log("[ChatBox] ✅ A2AClient 实例创建成功")
						}
						this.a2aClient.onMessage((e) => {
							this.handleAgentMessage(e)
						}),
							this.a2aClient.onStatusChange((e) => {
								this.handleAgentStatusChange(e)
							})
						const i = {
							...e,
							serviceEndpoint:
								e.serviceEndpoint ||
								(null === (t = e.publishInfo) || void 0 === t ? void 0 : t.serverUrl) ||
								e.serverUrl,
						}
						console.log("[ChatBox] 连接智能体，serviceEndpoint:", i.serviceEndpoint)
						try {
							await this.a2aClient.connect(i), this.startAgentStatusMonitoring()
						} catch (o) {
							console.error("[ChatBox] 连接智能体失败:", o), this.$message.error("连接失败: " + o.message)
						}
					},
					handleAgentMessage(e) {
						if (!this.currentAgentChat) return
						this.currentAgentChat.messages || (this.currentAgentChat.messages = [])
						const t = e.id,
							s = this.currentAgentChat.messages.findIndex(
								(t) => (!0 === t.isLoading && !t.content) || t.placeholderId === e.placeholderId,
							),
							i = this.currentAgentChat.messages.findIndex((e) => e.tmpId === t)
						if (-1 !== s && -1 === i && e.streaming) {
							console.log("[ChatBox] 替换占位消息为流式消息")
							const i = {
								...this.currentAgentChat.messages[s],
								tmpId: t,
								content: e.content || "",
								streaming: !0,
								isLoading: !e.content,
								placeholderId: void 0,
							}
							this.$set(this.currentAgentChat.messages, s, i)
						} else if (-1 !== i) {
							const t = {
								...this.currentAgentChat.messages[i],
								content: e.content,
								streaming: e.streaming,
								isLoading: !e.content,
							}
							this.$set(this.currentAgentChat.messages, i, t), e.streaming || this.saveAgentChatHistory()
						} else if (e.streaming) {
							console.log("[ChatBox] 未找到占位消息，创建新流式消息")
							const s = {
								id: null,
								tmpId: t,
								content: e.content || "",
								sendId: this.currentAgentChat.agentId,
								sendNickName: this.currentAgentChat.agentName,
								sendTime: e.timestamp || Date.now(),
								type: this.$enums.MESSAGE_TYPE.TEXT,
								selfSend: !1,
								streaming: !0,
								isLoading: !e.content,
								agentId: this.currentAgentChat.agentId,
							}
							console.log("[ChatBox] 创建流式消息，isLoading:", s.isLoading, "content:", e.content),
								this.currentAgentChat.messages.push(s)
						} else {
							const s = {
								id: e.id || null,
								tmpId: e.tmpId || t || "agent_" + Date.now(),
								content: e.content,
								sendId: this.currentAgentChat.agentId,
								sendNickName: this.currentAgentChat.agentName,
								sendTime: e.timestamp || Date.now(),
								type: this.$enums.MESSAGE_TYPE.TEXT,
								selfSend: !1,
							}
							this.currentAgentChat.messages.push(s), this.saveAgentChatHistory()
						}
						this.$nextTick(() => {
							this.scrollToBottom()
						})
					},
					handleAgentStatusChange(e) {
						if ((console.log("[ChatBox] 智能体状态变化:", e), this.currentAgentChat)) {
							switch (e.status) {
								case "connected":
									;(this.currentAgentChat.status = "connected"), console.log("[ChatBox] 智能体已连接")
									break
								case "disconnected":
									;(this.currentAgentChat.status = "disconnected"),
										console.log("[ChatBox] 智能体已断开连接")
									break
								case "error":
									;(this.currentAgentChat.status = "error"),
										console.log("[ChatBox] 智能体连接错误:", e.detail),
										this.$message.error("智能体连接错误: " + e.detail)
									break
								default:
									console.log("[ChatBox] 未知状态:", e)
							}
							this.$forceUpdate()
						}
					},
					startAgentStatusMonitoring() {
						this.agentStatusTimer && clearInterval(this.agentStatusTimer),
							(this.agentStatusTimer = setInterval(async () => {
								if (this.currentAgentChat && this.a2aClient)
									try {
										const e = this.a2aClient.isConnected,
											t = this.currentAgentChat.status
										e && "connected" !== t
											? ((this.currentAgentChat.status = "connected"),
												console.log("[ChatBox] 状态监控：智能体已重新连接"),
												this.$forceUpdate())
											: e ||
												"connected" !== t ||
												((this.currentAgentChat.status = "disconnected"),
												console.log("[ChatBox] 状态监控：智能体连接丢失"),
												this.$forceUpdate())
									} catch (e) {
										console.error("[ChatBox] 状态检查失败:", e)
									}
							}, 5e3))
					},
					stopAgentStatusMonitoring() {
						this.agentStatusTimer && (clearInterval(this.agentStatusTimer), (this.agentStatusTimer = null))
					},
					async startAgentChat(e) {
						const { agent: t, member: s } = e
						console.log("[ChatBox] startAgentChat called with agent:", t),
							console.log("[ChatBox] agent.serviceEndpoint:", t.serviceEndpoint),
							console.log("[ChatBox] agent.publishInfo:", t.publishInfo),
							console.log("[ChatBox] agent.serverUrl:", t.serverUrl)
						const i = `${this.chat.type}_${this.chat.targetId}_agent_${t.id}`
						let o = this.$store.state.chatStore.chats.find((e) => "AGENT" === e.type && e.targetId === i)
						o ||
							(this.$store.commit("ensureAgentChat", {
								parentChat: this.chat,
								agent: t,
								ownerId: s ? s.id : this.mine.id,
							}),
							(o = this.$store.state.chatStore.chats.find(
								(e) => "AGENT" === e.type && e.targetId === i,
							))),
							(this.currentAgentChat = {
								targetId: i,
								agentId: t.id,
								agentName: t.name,
								parentChat: this.chat,
								messages: [],
								startTime: Date.now(),
							})
						try {
							const e = i,
								t = await j.a.getItem(e)
							t && t.messages && (this.currentAgentChat.messages = t.messages)
						} catch (n) {
							console.error("[ChatBox] 加载历史消息失败:", n)
						}
						await this.initA2AClient(t),
							(this.showAgentSide = !1),
							this.$nextTick(() => {
								this.scrollToBottom()
							})
					},
					editAgent(e) {
						this.callRooCodeCommand("roo-cline.editAgent", { agentId: e.id })
					},
					async saveAgentChatHistory() {
						if (this.currentAgentChat)
							try {
								var e, t, s
								const i = this.currentAgentChat.targetId || this.chat.targetId,
									o = {
										agentId: this.currentAgentChat.agentId,
										agentName: this.currentAgentChat.agentName,
										parentId:
											null === (e = this.currentAgentChat.parentChat) || void 0 === e
												? void 0
												: e.targetId,
										parentType:
											null === (t = this.currentAgentChat.parentChat) || void 0 === t
												? void 0
												: t.type,
										parentName:
											null === (s = this.currentAgentChat.parentChat) || void 0 === s
												? void 0
												: s.showName,
										messages: this.currentAgentChat.messages || [],
										startTime: this.currentAgentChat.startTime,
									}
								await j.a.setItem(i, o)
								const n = this.$store.state.userStore.userInfo.id,
									a = "chats-" + n
								let r = await j.a.getItem(a)
								r && r.chatKeys
									? r.chatKeys.includes(i) || (r.chatKeys.push(i), await j.a.setItem(a, r))
									: (r || (r = { chatKeys: [], privateMsgMaxId: 0, groupMsgMaxId: 0 }),
										r.chatKeys || (r.chatKeys = []),
										r.chatKeys.push(i),
										await j.a.setItem(a, r))
							} catch (i) {
								console.error("[ChatBox] 保存会话历史失败:", i)
							}
					},
					async exitAgentChat() {
						var e
						this.currentAgentChat &&
							(await this.saveAgentChatHistory(),
							this.stopAgentStatusMonitoring(),
							null !== (e = this.a2aClient) &&
								void 0 !== e &&
								e.isConnected &&
								(await this.a2aClient.disconnect()))
						this.$set(this, "currentAgentChat", null),
							this.$set(this, "a2aClient", null),
							this.$forceUpdate(),
							this.$nextTick(() => {
								this.scrollToBottom()
							})
					},
					async returnToParentChat() {
						if (!this.currentAgentChat) return
						await this.saveAgentChatHistory()
						let e = this.currentAgentChat.parentChat
						if (!e || !e.messages) {
							var t
							const s =
								(null === (t = this.currentAgentChat.parentChat) || void 0 === t
									? void 0
									: t.targetId) || this.chat.parentId
							s && (e = this.$store.getters.findChats().find((e) => e.targetId === s))
						}
						if (e) {
							;(this.currentAgentChat = null), (this.a2aClient = null), this.$store.commit("openChat", e)
							const t = this.$store.getters.findChats(),
								s = t.findIndex((t) => t.targetId === e.targetId)
							;-1 !== s && this.$store.commit("activeChat", s), this.$forceUpdate()
						} else console.error("[ChatBox] 找不到父级会话")
					},
					async sendToAgent(e) {
						if (!this.currentAgentChat || 0 === e.length) return
						const t = e.filter((e) => "text" === e.type)
						if (0 === t.length) return void this.$message.warning("智能体暂只支持文本消息")
						const s = t.map((e) => e.content).join("\n"),
							i = {
								id: null,
								tmpId: "tmp_" + Date.now(),
								content: s,
								sendId: this.mine.id,
								sendNickName: this.mine.nickName,
								sendTime: Date.now(),
								type: this.$enums.MESSAGE_TYPE.TEXT,
								selfSend: !0,
							}
						this.currentAgentChat.messages || (this.currentAgentChat.messages = []),
							this.currentAgentChat.messages.push(i),
							this.saveAgentChatHistory(),
							this.scrollToBottom()
						const o = "stream_" + Date.now()
						this.activeLLMStream = {
							streamId: o,
							title: this.currentAgentChat.agentName,
							startTime: Date.now(),
						}
						const n = `stream_${Date.now()}_${Math.random()}`,
							a = {
								id: null,
								tmpId: n,
								content: "",
								sendId: this.currentAgentChat.agentId || "agent_" + this.currentAgentChat.agent.id,
								sendNickName: this.currentAgentChat.agentName || this.currentAgentChat.agent.name,
								sendTime: Date.now(),
								type: this.$enums.MESSAGE_TYPE.TEXT,
								selfSend: !1,
								streaming: !0,
								isLoading: !0,
								agentId: this.currentAgentChat.agentId || this.currentAgentChat.agent.id,
								placeholderId: n,
							}
						console.log("[ChatBox] 创建占位消息:", a),
							this.currentAgentChat.messages.push(a),
							this.$nextTick(() => {
								this.scrollToBottom()
							})
						try {
							if (!this.a2aClient || !this.a2aClient.isConnected) throw new Error("A2A客户端未连接")
							await this.a2aClient.sendMessage(s, "text", !0, n)
						} catch (r) {
							console.error("[ChatBox] 发送消息失败:", r),
								this.$message.error("发送失败: " + r.message),
								(this.activeLLMStream = null)
							const e = this.currentAgentChat.messages.findIndex((e) => e.tmpId === n)
							;-1 !== e && this.currentAgentChat.messages.splice(e, 1)
						}
						this.$nextTick(() => {
							this.scrollToBottom()
						})
					},
					async callRooCodeCommand(e, t) {
						return new Promise((s, i) => {
							const o = Date.now() + Math.random(),
								n = (e) => {
									e.data.id === o &&
										(window.removeEventListener("message", n),
										e.data.error ? i(new Error(e.data.error)) : s(e.data.result || {}))
								}
							window.addEventListener("message", n),
								setTimeout(() => {
									window.removeEventListener("message", n), i(new Error("命令调用超时"))
								}, 3e4),
								window.parent.postMessage({ type: "vscode-command", command: e, params: t, id: o }, "*")
						})
					},
					toggleSidePanel() {
						"GROUP" === this.chat.type
							? ((this.showSide = !this.showSide), (this.showAgentSide = !1))
							: ((this.showAgentSide = !this.showAgentSide), (this.showSide = !1))
					},
					handleAvatarMouseEnter(e, t) {
						if (this.avatarsFullyExpanded) this.showAgentCard(e, t)
						else {
							const s = t.currentTarget,
								i = s.getBoundingClientRect()
							;(this.pendingHoverCard = {
								agent: e,
								element: s,
								position: { x: i.left + i.width / 2, y: i.bottom - 2 },
							}),
								this.hoverCheckTimeout && clearTimeout(this.hoverCheckTimeout),
								(this.hoverCheckTimeout = setTimeout(() => {
									if (this.avatarsFullyExpanded && this.pendingHoverCard) {
										const { agent: e, element: t, position: s } = this.pendingHoverCard
										t &&
											t.matches(":hover") &&
											(this.clearHideTimeout(),
											(this.hoveredAgentCard = { agent: e, x: s.x, y: s.y })),
											(this.pendingHoverCard = null)
									}
								}, 400))
						}
					},
					showAgentCard(e, t) {
						this.clearHideTimeout()
						const s = t.currentTarget.getBoundingClientRect()
						this.hoveredAgentCard = { agent: e, x: s.left + s.width / 2, y: s.bottom - 2 }
					},
					hideAgentCard() {
						;(this.pendingHoverCard = null),
							this.hoverCheckTimeout &&
								(clearTimeout(this.hoverCheckTimeout), (this.hoverCheckTimeout = null)),
							(this.hoverCardTimeout = setTimeout(() => {
								;(this.hoveredAgentCard = null),
									setTimeout(() => {
										const e = document.querySelector(".agent-avatars-container"),
											t = document.querySelector(".agent-avatars-animated"),
											s = document.querySelector(".agent-avatar-fixed")
										!e ||
											e.matches(":hover") ||
											(t && t.matches(":hover")) ||
											(s && s.matches(":hover")) ||
											((this.avatarsFullyExpanded = !1), (this.avatarsExpanded = !1))
									}, 100)
							}, 200))
					},
					clearHideTimeout() {
						this.hoverCardTimeout && (clearTimeout(this.hoverCardTimeout), (this.hoverCardTimeout = null))
					},
					onPanelEnter() {
						this.clearHideTimeout(),
							this.avatarExpandTimeout &&
								(clearTimeout(this.avatarExpandTimeout), (this.avatarExpandTimeout = null))
					},
					onPanelLeave() {
						this.hideAgentCard()
					},
					async quickStartAgentChat(e) {
						await this.startAgentChat({ agent: e, chat: this.chat })
					},
					async loadAgentChatHistory() {
						try {
							const e = this.chat.targetId,
								t = await j.a.getItem(e)
							let s = null,
								i = null
							if ("AGENT" === this.chat.type) {
								const e = this.chat.targetId.split("_agent_")
								2 === e.length && (s = e[1])
							}
							if ((!s && null !== t && void 0 !== t && t.agentId && (s = t.agentId), s)) {
								await this.loadRecentAgents()
								const e = this.recentAgents.find((e) => e.id === s)
								i = e || {
									id: s,
									name: this.chat.showName || "智能体",
									avatar: this.chat.headImage,
									isActive: !0,
									serviceStatus: "online",
								}
							}
							if (i) {
								let e = null
								if (this.chat.parentId) {
									const s =
										this.chat.parentType ||
										(null === t || void 0 === t ? void 0 : t.parentType) ||
										"PRIVATE"
									e = this.$store.getters
										.findChats()
										.find((e) => e.targetId === this.chat.parentId && e.type === s)
								}
								e ||
									(e = {
										targetId:
											this.chat.parentId || (null === t || void 0 === t ? void 0 : t.parentId),
										showName: (null === t || void 0 === t ? void 0 : t.parentName) || "会话",
										type:
											this.chat.parentType ||
											(null === t || void 0 === t ? void 0 : t.parentType) ||
											"PRIVATE",
									}),
									(this.currentAgentChat = {
										targetId: this.chat.targetId,
										agent: i,
										agentId: i.id,
										agentName: i.name || (null === t || void 0 === t ? void 0 : t.agentName),
										parentChat: e,
										messages: (null === t || void 0 === t ? void 0 : t.messages) || [],
										startTime: (null === t || void 0 === t ? void 0 : t.startTime) || Date.now(),
									}),
									this.a2aClient || (await this.initA2AClient(i)),
									this.$forceUpdate()
							}
						} catch (e) {
							console.error("[ChatBox] Failed to load agent chat history:", e)
						}
					},
					async loadRecentAgents() {
						try {
							var e
							if (!this.chat) return void (this.recentAgents = [])
							let t
							;(this.recentAgents = []),
								await this.$nextTick(),
								(t =
									"PRIVATE" === this.chat.type
										? this.chat.targetId
										: ("GROUP" === this.chat.type || this.chat.type,
											this.$store.state.userStore.userInfo.id))
							const s =
									(null === (e = this.$store.state.userStore) ||
									void 0 === e ||
									null === (e = e.userInfo) ||
									void 0 === e
										? void 0
										: e.terminal) || 0,
								i = `${t}_${s}`,
								o = await this.$http.get("/api/roocode/redis/agents/" + i)
							console.log("[ChatBox] Loaded agents from Redis:", o),
								console.log("[ChatBox] First agent detail:", null === o || void 0 === o ? void 0 : o[0])
							const n = (o || []).filter((e) => !1 !== e.isPublished).slice(0, 5)
							this.$set(this, "recentAgents", n)
						} catch (t) {
							console.error("[ChatBox] Failed to load recent agents:", t),
								this.$set(this, "recentAgents", [])
						}
					},
					expandAvatars() {
						this.avatarExpandTimeout &&
							(clearTimeout(this.avatarExpandTimeout), (this.avatarExpandTimeout = null)),
							(this.avatarsExpanded = !0),
							this.avatarFullyExpandTimeout && clearTimeout(this.avatarFullyExpandTimeout),
							(this.avatarFullyExpandTimeout = setTimeout(() => {
								this.avatarsExpanded && (this.avatarsFullyExpanded = !0)
							}, 350))
					},
					collapseAvatars() {
						this.hoveredAgentCard ||
							(this.avatarFullyExpandTimeout &&
								(clearTimeout(this.avatarFullyExpandTimeout), (this.avatarFullyExpandTimeout = null)),
							(this.avatarsFullyExpanded = !1),
							(this.avatarExpandTimeout = setTimeout(() => {
								this.hoveredAgentCard || (this.avatarsExpanded = !1)
							}, 300)))
					},
				},
				computed: {
					displayMessages() {
						if (this.currentAgentChat) {
							this.currentAgentChat.messages || this.$set(this.currentAgentChat, "messages", [])
							const e = this.currentAgentChat.messages || []
							return e
						}
						return this.allMessages
					},
					displayTitle() {
						return this.currentAgentChat ? this.currentAgentChat.showName : this.title
					},
					parentChatName() {
						if (this.currentAgentChat && this.currentAgentChat.parentChat)
							return this.currentAgentChat.parentChat.showName
						if ("AGENT" === this.chat.type && this.chat.parentId) {
							const e = this.$store.getters.findChats().find((e) => e.targetId === this.chat.parentId)
							if (e) return e.showName
						}
						return "返回"
					},
					allMessages() {
						const e = this.chat.messages || []
						if (!this.activeLLMStream) return e
						const t = {
								tmpId: this.activeLLMStream.streamId,
								type: "llm-stream",
								streamId: this.activeLLMStream.streamId,
								title: this.activeLLMStream.title,
								sendTime: this.activeLLMStream.startTime,
								sendId: 0,
								sendNickName: "AI 助手",
								selfSend: !1,
								isCompleted: this.activeLLMStream.isCompleted || !1,
							},
							s = [...e]
						let i = s.length
						for (let o = s.length - 1; o >= 0; o--)
							if (s[o].sendTime <= t.sendTime) {
								i = o + 1
								break
							}
						return s.splice(i, 0, t), s
					},
					mine() {
						return this.$store.state.userStore.userInfo
					},
					isFriend() {
						return this.$store.getters.isFriend(this.userInfo.id)
					},
					friend() {
						return this.$store.getters.findFriend(this.userInfo.id)
					},
					title() {
						let e = this.chat.showName
						if ("GROUP" == this.chat.type) {
							let t = this.groupMembers.filter((e) => !e.quit).length
							e += `(${t})`
						}
						return e
					},
					messageAction() {
						return this.chat.isTerminalChat || this.chat.isTerminalInbox
							? "/message/private/send"
							: `/message/${this.chat.type.toLowerCase()}/send`
					},
					unreadCount() {
						return this.chat.unreadCount
					},
					messageSize() {
						return this.allMessages.length
					},
					isBanned() {
						return (
							("PRIVATE" == this.chat.type && this.userInfo.isBanned) ||
							("GROUP" == this.chat.type && this.group.isBanned)
						)
					},
					memberSize() {
						return this.groupMembers.filter((e) => !e.quit).length
					},
					isGroup() {
						return "GROUP" == this.chat.type
					},
					isPrivate() {
						return "PRIVATE" == this.chat.type
					},
					agentCardStyle() {
						if (!this.hoveredAgentCard) return {}
						const e = document.documentElement.clientWidth || 800,
							t = (document.documentElement.clientHeight, 320),
							s = this.hoveredAgentCard.x,
							i = this.hoveredAgentCard.y
						let o = s - t / 2
						o < 10 ? (o = 10) : o + t > e - 10 && (o = e - t - 10)
						const n = s - o - t / 2
						return { top: i + 6 + "px", left: o + "px", "--arrow-offset": n + "px" }
					},
				},
				mounted() {
					this.$nextTick(() => {
						const e = document.getElementById("chatScrollBox")
						e &&
							(e.removeEventListener("scroll", this.onScroll),
							e.addEventListener("scroll", this.onScroll))
					}),
						this.registerLLMStreamHandlers(),
						this.loadRecentAgents()
				},
				beforeDestroy() {
					var e
					const t = document.getElementById("chatScrollBox")
					t && t.removeEventListener("scroll", this.onScroll),
						this.stopAgentStatusMonitoring(),
						null !== (e = this.a2aClient) && void 0 !== e && e.isConnected && this.a2aClient.disconnect()
				},
				watch: {
					chat: {
						async handler(e, t) {
							if (!t || e.type + e.targetId != t.type + t.targetId) {
								this.activeLLMStream && ((this.activeLLMStream = null), this.llmStreams.clear()),
									!this.currentAgentChat ||
										"AGENT" === e.type ||
										(e.targetId && e.targetId.toString().includes("agent_")) ||
										(await this.exitAgentChat()),
									this.$nextTick(() => {
										this.loadRecentAgents()
									}),
									"GROUP" == this.chat.type
										? this.loadGroup(this.chat.targetId)
										: this.chat.isTerminalChat || this.chat.isTerminalInbox
											? (this.userInfo = this.mine)
											: "AGENT" === this.chat.type ||
												  (this.chat.targetId &&
														this.chat.targetId.toString().includes("agent_"))
												? (this.currentAgentChat && (await this.exitAgentChat()),
													(this.userInfo = {
														id: this.chat.targetId,
														nickName: this.chat.showName || "智能体",
														headImageThumb: this.chat.headImage,
													}),
													await this.loadAgentChatHistory())
												: (this.loadFriend(this.chat.targetId),
													this.loadReaded(this.chat.targetId)),
									this.scrollToBottom(),
									(this.showSide = !1),
									this.readedMessage()
								let t = this.chat.messages || [],
									s = t.length
								;(this.showMinIdx = s > 30 ? s - 30 : 0),
									this.resetEditor(),
									(this.isReceipt = !1),
									this.refreshPlaceHolder()
							}
						},
						immediate: !0,
					},
					messageSize: {
						handler(e, t) {
							e > t && this.scrollToBottom()
						},
					},
				},
			},
			q = H,
			W = (s("a753"), Object(m["a"])(q, i, o, !1, null, null, null))
		t["a"] = W.exports
	},
	"6d2f": function (e, t, s) {
		"use strict"
		s("4970")
	},
	"6e1f": function (e, t, s) {
		e.exports = s.p + "img/15.75820281.gif"
	},
	"6f6a": function (e, t, s) {},
	"72f7": function (e, t, s) {},
	"736a": function (e, t, s) {},
	7449: function (e, t, s) {
		e.exports = s.p + "img/54.2030cc4e.gif"
	},
	"75d5": function (e, t, s) {},
	"788f": function (e, t, s) {
		"use strict"
		s("e1c2")
	},
	"78b2": function (e, t, s) {
		"use strict"
		s("a76f")
	},
	"7a13": function (e, t, s) {
		e.exports = s.p + "img/26.03b7a469.gif"
	},
	"7a32": function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t("div", { staticClass: "chat-group-side" }, [
					t(
						"div",
						{
							directives: [
								{ name: "show", rawName: "v-show", value: !e.group.quit, expression: "!group.quit" },
							],
							staticClass: "group-side-search",
						},
						[
							t(
								"el-input",
								{
									attrs: { placeholder: "搜索群成员", size: "small" },
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
					t(
						"div",
						{ staticClass: "group-side-scrollbar" },
						[
							t(
								"el-scrollbar",
								{
									directives: [
										{
											name: "show",
											rawName: "v-show",
											value: !e.group.quit,
											expression: "!group.quit",
										},
									],
									ref: "scrollbar",
									style: "height: " + e.scrollHeight + "px",
								},
								[
									t(
										"div",
										{ staticClass: "group-side-member-list" },
										[
											t(
												"div",
												{ staticClass: "group-side-invite" },
												[
													t(
														"div",
														{
															staticClass: "invite-member-btn",
															attrs: { title: "邀请好友进群聊" },
															on: {
																click: function (t) {
																	e.showAddGroupMember = !0
																},
															},
														},
														[t("i", { staticClass: "el-icon-plus" })],
													),
													t("div", { staticClass: "invite-member-text" }, [e._v("邀请")]),
													t("add-group-member", {
														attrs: {
															visible: e.showAddGroupMember,
															groupId: e.group.id,
															members: e.groupMembers,
														},
														on: {
															reload: function (t) {
																return e.$emit("reload")
															},
															close: function (t) {
																e.showAddGroupMember = !1
															},
														},
													}),
												],
												1,
											),
											e.isOwner
												? t(
														"div",
														{ staticClass: "group-side-invite" },
														[
															t(
																"div",
																{
																	staticClass: "invite-member-btn",
																	attrs: { title: "选择成员移出群聊" },
																	on: {
																		click: function (t) {
																			return e.onRemove()
																		},
																	},
																},
																[t("i", { staticClass: "el-icon-minus" })],
															),
															t("div", { staticClass: "invite-member-text" }, [
																e._v("移除"),
															]),
															t("group-member-selector", {
																ref: "removeSelector",
																attrs: {
																	title: "选择成员进行移除",
																	groupId: e.group.id,
																},
																on: { complete: e.onRemoveComplete },
															}),
														],
														1,
													)
												: e._e(),
											e._l(e.showMembers, function (s, i) {
												return t(
													"div",
													{ key: s.id },
													[
														i < e.showMaxIdx
															? t("group-member", {
																	staticClass: "group-side-member",
																	attrs: { member: s, showDel: !1 },
																})
															: e._e(),
													],
													1,
												)
											}),
										],
										2,
									),
								],
							),
							e.group.quit ? e._e() : t("el-divider", { attrs: { "content-position": "center" } }),
							t(
								"el-form",
								{
									staticClass: "group-side-form",
									attrs: { labelPosition: "top", model: e.group, size: "small" },
								},
								[
									t(
										"el-form-item",
										{ attrs: { label: "群聊名称" } },
										[
											t("el-input", {
												attrs: { disabled: "", maxlength: "20" },
												model: {
													value: e.group.name,
													callback: function (t) {
														e.$set(e.group, "name", t)
													},
													expression: "group.name",
												},
											}),
										],
										1,
									),
									t(
										"el-form-item",
										{ attrs: { label: "群主" } },
										[t("el-input", { attrs: { value: e.ownerName, disabled: "" } })],
										1,
									),
									t(
										"el-form-item",
										{ attrs: { label: "群公告" } },
										[
											t("el-input", {
												attrs: { disabled: "", type: "textarea", maxlength: "1024" },
												model: {
													value: e.group.notice,
													callback: function (t) {
														e.$set(e.group, "notice", t)
													},
													expression: "group.notice",
												},
											}),
										],
										1,
									),
									t(
										"el-form-item",
										{ attrs: { label: "备注" } },
										[
											t("el-input", {
												attrs: { disabled: !e.editing, maxlength: "20" },
												model: {
													value: e.group.remarkGroupName,
													callback: function (t) {
														e.$set(e.group, "remarkGroupName", t)
													},
													expression: "group.remarkGroupName",
												},
											}),
										],
										1,
									),
									t(
										"el-form-item",
										{ attrs: { label: "我在本群的昵称" } },
										[
											t("el-input", {
												attrs: { disabled: !e.editing, maxlength: "20" },
												model: {
													value: e.group.remarkNickName,
													callback: function (t) {
														e.$set(e.group, "remarkNickName", t)
													},
													expression: "group.remarkNickName",
												},
											}),
										],
										1,
									),
									t(
										"div",
										{
											directives: [
												{
													name: "show",
													rawName: "v-show",
													value: !e.group.quit,
													expression: "!group.quit",
												},
											],
											staticClass: "btn-group",
										},
										[
											e.editing
												? t(
														"el-button",
														{
															attrs: { type: "success" },
															on: {
																click: function (t) {
																	return e.onSaveGroup()
																},
															},
														},
														[e._v("保存")],
													)
												: e._e(),
											e.editing
												? e._e()
												: t(
														"el-button",
														{
															attrs: { type: "primary" },
															on: {
																click: function (t) {
																	e.editing = !e.editing
																},
															},
														},
														[e._v("编辑")],
													),
											t(
												"el-button",
												{
													directives: [
														{
															name: "show",
															rawName: "v-show",
															value: !e.isOwner,
															expression: "!isOwner",
														},
													],
													attrs: { type: "danger" },
													on: {
														click: function (t) {
															return e.onQuit()
														},
													},
												},
												[e._v("退出群聊")],
											),
										],
										1,
									),
								],
								1,
							),
						],
						1,
					),
				])
			},
			o = [],
			n = (s("0643"), s("2382"), s("fffc"), s("a573"), s("b242")),
			a = s("2859"),
			r = s("2082"),
			l = {
				name: "chatGroupSide",
				components: { AddGroupMember: n["a"], GroupMember: a["a"], GroupMemberSelector: r["a"] },
				data() {
					return { searchText: "", editing: !1, showAddGroupMember: !1, showMaxIdx: 50 }
				},
				props: { group: { type: Object }, groupMembers: { type: Array } },
				methods: {
					onClose() {
						this.$emit("close")
					},
					loadGroupMembers() {
						this.$http({ url: "/group/members/" + this.group.id, method: "get" }).then((e) => {
							this.groupMembers = e
						})
					},
					onSaveGroup() {
						let e = this.group
						this.$http({ url: "/group/modify", method: "put", data: e }).then((e) => {
							;(this.editing = !this.editing),
								this.$store.commit("updateGroup", e),
								this.$emit("reload"),
								this.$message.success("修改成功")
						})
					},
					onRemove() {
						let e = [this.group.ownerId]
						this.$refs.removeSelector.open(50, [], [], e)
					},
					onRemoveComplete(e) {
						let t = e.map((e) => e.userId),
							s = { groupId: this.group.id, userIds: t }
						this.$http({ url: "/group/members/remove", method: "delete", data: s }).then(() => {
							this.$emit("reload"), this.$message.success(`您移除了${t.length}位成员`)
						})
					},
					onQuit() {
						this.$confirm("退出群聊后将不再接受群里的消息，确认退出吗？", "确认退出?", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning",
							modal: !1,
						}).then(() => {
							this.$http({ url: "/group/quit/" + this.group.id, method: "delete" }).then(() => {
								this.$store.commit("removeGroup", this.group.id),
									this.$store.commit("removeGroupChat", this.group.id)
							})
						})
					},
					onScroll(e) {
						const t = e.target
						t.scrollTop + t.clientHeight >= t.scrollHeight - 30 &&
							this.showMaxIdx < this.showMembers.length &&
							(this.showMaxIdx += 30)
					},
				},
				computed: {
					ownerName() {
						let e = this.groupMembers.find((e) => e.userId == this.group.ownerId)
						return e && e.showNickName
					},
					isOwner() {
						return this.group.ownerId == this.$store.state.userStore.userInfo.id
					},
					showMembers() {
						return this.groupMembers.filter((e) => !e.quit && e.showNickName.includes(this.searchText))
					},
					scrollHeight() {
						return Math.min(400, 80 + (this.showMembers.length / 5) * 80)
					},
				},
				mounted() {
					let e = this.$refs.scrollbar.$el.querySelector(".el-scrollbar__wrap")
					e.addEventListener("scroll", this.onScroll)
				},
			},
			c = l,
			d = (s("6d2f"), s("2877")),
			h = Object(d["a"])(c, i, o, !1, null, null, null)
		t["a"] = h.exports
	},
	"7a4c": function (e, t, s) {
		e.exports = s.p + "img/53.a59af82b.gif"
	},
	"7aa4": function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-scrollbar",
					{ ref: "scrollbar" },
					e._l(e.items, function (s, i) {
						return t("div", { key: i }, [i < e.showMaxIdx ? e._t("default", null, { item: s }) : e._e()], 2)
					}),
					0,
				)
			},
			o = [],
			n = {
				name: "virtualScroller",
				data() {
					return { page: 1, isInitEvent: !1, lockTip: !1 }
				},
				props: { items: { type: Array }, size: { type: Number, default: 30 } },
				methods: {
					init() {
						;(this.page = 1), this.initEvent()
					},
					initEvent() {
						if (!this.isInitEvent) {
							let e = this.$refs.scrollbar.$el.querySelector(".el-scrollbar__wrap")
							e.addEventListener("scroll", this.onScroll), (this.isInitEvent = !0)
						}
					},
					onScroll(e) {
						const t = e.target
						t.scrollTop + t.clientHeight >= t.scrollHeight - 30 &&
							(this.showMaxIdx >= this.items.length ? this.showTip() : this.page++)
					},
					showTip() {
						this.lockTip ||
							(this.$message.success("已到滚动到底部"),
							(this.lockTip = !0),
							setTimeout(() => {
								this.lockTip = !1
							}, 3e3))
					},
				},
				computed: {
					showMaxIdx() {
						return Math.min(this.page * this.size, this.items.length)
					},
				},
				mounted() {
					this.initEvent()
				},
			},
			a = n,
			r = s("2877"),
			l = Object(r["a"])(a, i, o, !1, null, "821ed2d2", null)
		t["a"] = l.exports
	},
	"7b21": function (e, t, s) {},
	"7dac": function (e, t, s) {
		"use strict"
		s.r(t),
			s.d(t, "ZeroWidthEncoder", function () {
				return o
			}),
			s.d(t, "MentionHelper", function () {
				return n
			})
		var i = s("ade3")
		s("14d9")
		class o {
			static encode(e) {
				try {
					let t = ""
					"task" === e.type ? (t = "T") : "agent" === e.type && (t = "A"),
						e.name && (t += ":" + e.name),
						e.id ? (t += "|" + e.id) : e.modeId && (t += "|" + e.modeId),
						e.targetId && (t += "#" + e.targetId),
						e.chatType && (t += "&" + e.chatType),
						void 0 !== e.senderTerminal && (t += "!" + e.senderTerminal)
					const s = this.stringToBytes(t)
					let i = ""
					for (const e of s) {
						const t = Math.floor(e / 16),
							s = e % 16
						i += this.CHARS[t] + this.CHARS[s]
					}
					return this.BOUNDARY.START + i + this.BOUNDARY.END
				} catch (t) {
					return console.error("编码错误:", t), ""
				}
			}
			static decode(e) {
				try {
					const t = e.indexOf(this.BOUNDARY.START),
						s = e.indexOf(this.BOUNDARY.END)
					if (-1 === t || -1 === s) return null
					const i = e.substring(t + 1, s),
						o = []
					for (let e = 0; e < i.length; e += 2) {
						if (e + 1 >= i.length) break
						const t = this.CHARS.indexOf(i[e]),
							s = this.CHARS.indexOf(i[e + 1])
						;-1 !== t && -1 !== s && o.push(16 * t + s)
					}
					const n = this.bytesToString(o),
						a = {},
						r = n[0]
					"T" === r ? (a.type = "task") : "A" === r && (a.type = "agent")
					const l = n.substring(1),
						c = l.match(/^:([^|#&]+)/)
					c && (a.name = c[1])
					const d = l.match(/\|([^#&]+)/)
					d && ("task" === a.type ? (a.id = d[1]) : "agent" === a.type && (a.modeId = d[1]))
					const h = l.match(/#([^&]+)/)
					h && (a.targetId = h[1])
					const u = l.match(/&([^!]+)/)
					u && (a.chatType = u[1])
					const m = l.match(/!(\d+)/)
					return m && (a.senderTerminal = parseInt(m[1])), a
				} catch (t) {
					return console.error("解码错误:", t), null
				}
			}
			static stringToBytes(e) {
				const t = []
				for (let s = 0; s < e.length; s++) {
					const i = e.charCodeAt(s)
					i < 128
						? t.push(i)
						: i < 2048
							? (t.push(192 | (i >> 6)), t.push(128 | (63 & i)))
							: i < 65536
								? (t.push(224 | (i >> 12)), t.push(128 | ((i >> 6) & 63)), t.push(128 | (63 & i)))
								: (t.push(240 | (i >> 18)),
									t.push(128 | ((i >> 12) & 63)),
									t.push(128 | ((i >> 6) & 63)),
									t.push(128 | (63 & i)))
				}
				return t
			}
			static bytesToString(e) {
				let t = "",
					s = 0
				while (s < e.length) {
					const i = e[s]
					if (0 === (128 & i)) (t += String.fromCharCode(i)), s++
					else if (192 === (224 & i)) {
						if (s + 1 < e.length) {
							const o = e[s + 1],
								n = ((31 & i) << 6) | (63 & o)
							t += String.fromCharCode(n)
						}
						s += 2
					} else if (224 === (240 & i)) {
						if (s + 2 < e.length) {
							const o = e[s + 1],
								n = e[s + 2],
								a = ((15 & i) << 12) | ((63 & o) << 6) | (63 & n)
							t += String.fromCharCode(a)
						}
						s += 3
					} else if (240 === (248 & i)) {
						if (s + 3 < e.length) {
							const o = e[s + 1],
								n = e[s + 2],
								a = e[s + 3],
								r = ((7 & i) << 18) | ((63 & o) << 12) | ((63 & n) << 6) | (63 & a)
							t += String.fromCharCode(r)
						}
						s += 4
					} else s++
				}
				return t
			}
			static cleanText(e) {
				const t = [...this.CHARS, this.BOUNDARY.START, this.BOUNDARY.END]
				let s = e
				return (
					t.forEach((e) => {
						s = s.replace(new RegExp(e, "g"), "")
					}),
					s
				)
			}
			static embedInText(e, t) {
				const s = this.encode(t)
				return e + s
			}
			static hasZeroWidthParams(e) {
				return e.includes(this.BOUNDARY.START) && e.includes(this.BOUNDARY.END)
			}
			static extractAllFromText(e) {
				console.log("[ZeroWidthEncoder] extractAllFromText 被调用"),
					console.log("[ZeroWidthEncoder] 输入文本:", e),
					console.log("[ZeroWidthEncoder] 文本包含开始标记?", e.includes(this.BOUNDARY.START)),
					console.log("[ZeroWidthEncoder] 文本包含结束标记?", e.includes(this.BOUNDARY.END))
				const t = [],
					s = new RegExp(`${this.BOUNDARY.START}[^${this.BOUNDARY.END}]+${this.BOUNDARY.END}`, "g")
				let i
				while (null !== (i = s.exec(e))) {
					console.log("[ZeroWidthEncoder] 找到匹配:", i[0])
					const e = this.decode(i[0])
					console.log("[ZeroWidthEncoder] 解码结果:", e), e && t.push({ position: i.index, params: e })
				}
				return console.log("[ZeroWidthEncoder] 最终结果:", t), t
			}
		}
		Object(i["a"])(o, "CHARS", [
			"​",
			"‌",
			"‍",
			"⁠",
			"᠎",
			"\ufeff",
			"‎",
			"‏",
			"‪",
			"‫",
			"‬",
			"‭",
			"‮",
			"⁡",
			"⁢",
			"⁣",
		]),
			Object(i["a"])(o, "BOUNDARY", { START: "⁦", END: "⁧" })
		class n {
			static createTaskMention(e, t, s, i, n) {
				const a = `@任务[${e}]`,
					r = { type: "task", name: e }
				return (
					t && (r.id = t),
					s && (r.targetId = s),
					i && (r.chatType = i),
					void 0 !== n && (r.senderTerminal = n),
					o.embedInText(a, r)
				)
			}
			static createAgentMention(e, t, s, i, n) {
				const a = `@智能体[${e}]`,
					r = { type: "agent", name: e, modeId: t }
				return (
					s && (r.targetId = s),
					i && (r.chatType = i),
					void 0 !== n && (r.senderTerminal = n),
					o.embedInText(a, r)
				)
			}
			static parseMention(e) {
				const t = o.cleanText(e),
					s = o.decode(e)
				return { displayText: t, params: s }
			}
			static hasZeroWidthParams(e) {
				return o.hasZeroWidthParams(e)
			}
		}
	},
	"7e0f": function (e, t, s) {
		e.exports = s.p + "img/35.7e9e390a.gif"
	},
	"7e31": function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{ staticClass: "streaming-renderer" },
					[
						e.isStreaming && !e.fullContent
							? t("div", { staticClass: "loading-placeholder" }, [t("loading-dots")], 1)
							: t("unified-message-renderer", {
									ref: "messageRenderer",
									attrs: {
										message: e.streamingMessage,
										streaming: e.isStreaming,
										"custom-config": e.customConfig,
									},
									on: { rendered: e.onRendered },
									scopedSlots: e._u([
										{
											key: "enhancements",
											fn: function () {
												return [
													e.isStreaming
														? t("div", { staticClass: "streaming-indicator" }, [
																t("span", { staticClass: "streaming-dot" }),
																t("span", { staticClass: "streaming-text" }, [
																	e._v("正在输入..."),
																]),
															])
														: e._e(),
												]
											},
											proxy: !0,
										},
									]),
								}),
					],
					1,
				)
			},
			o = [],
			n = (s("14d9"), s("13d5"), s("0643"), s("9d4a"), s("66a5")),
			a = s("1cae")
		class r {
			constructor(e = {}) {
				;(this.buffer = ""),
					(this.renderTimer = null),
					(this.lastRenderTime = 0),
					(this.chunkSize = e.chunkSize || 100),
					(this.renderInterval = e.renderInterval || 50),
					(this.maxBufferSize = e.maxBufferSize || 500),
					(this.autoFlushDelay = e.autoFlushDelay || 100),
					(this.onFlush = e.onFlush || (() => {})),
					(this.onAppend = e.onAppend || (() => {})),
					(this.stats = { totalChunks: 0, totalRenders: 0, totalChars: 0 })
			}
			append(e) {
				if (!e) return
				;(this.buffer += e), this.stats.totalChunks++, (this.stats.totalChars += e.length), this.onAppend(e)
				const t = Date.now(),
					s = t - this.lastRenderTime
				this.buffer.length >= this.maxBufferSize ||
				(this.buffer.length >= this.chunkSize && s >= this.renderInterval)
					? this.flush()
					: this.scheduleFlush(this.autoFlushDelay)
			}
			scheduleFlush(e) {
				clearTimeout(this.renderTimer), (this.renderTimer = setTimeout(() => this.flush(), e))
			}
			flush() {
				if ((clearTimeout(this.renderTimer), this.buffer)) {
					const e = this.buffer
					;(this.buffer = ""), (this.lastRenderTime = Date.now()), this.stats.totalRenders++, this.onFlush(e)
				}
			}
			finish() {
				this.flush()
			}
			reset() {
				clearTimeout(this.renderTimer),
					(this.buffer = ""),
					(this.lastRenderTime = 0),
					(this.stats = { totalChunks: 0, totalRenders: 0, totalChars: 0 })
			}
			getStats() {
				return {
					...this.stats,
					bufferSize: this.buffer.length,
					avgChunkSize:
						this.stats.totalChunks > 0 ? Math.round(this.stats.totalChars / this.stats.totalChunks) : 0,
					renderEfficiency:
						this.stats.totalRenders > 0
							? Math.round((this.stats.totalChunks / this.stats.totalRenders) * 100) / 100
							: 0,
				}
			}
		}
		var l = {
				name: "StreamingRenderer",
				components: { UnifiedMessageRenderer: n["a"], LoadingDots: a["a"] },
				props: {
					initialMessage: { type: Object, default: () => ({}) },
					streamingConfig: { type: Object, default: () => ({}) },
					customConfig: { type: Object, default: () => ({}) },
				},
				data() {
					return {
						streamingMessage: { ...this.initialMessage, content: "", streaming: !0 },
						isStreaming: !1,
						fullContent: "",
						streamingBuffer: null,
						performanceMonitor: { startTime: null, endTime: null, chunks: [], renders: [] },
					}
				},
				created() {
					this.initStreamingBuffer()
				},
				methods: {
					initStreamingBuffer() {
						const e = {
							chunkSize: 100,
							renderInterval: 50,
							maxBufferSize: 500,
							autoFlushDelay: 100,
							...this.streamingConfig,
							onFlush: this.handleFlush,
							onAppend: this.handleAppend,
						}
						this.streamingBuffer = new r(e)
					},
					startStreaming(e = "") {
						;(this.isStreaming = !0),
							(this.fullContent = e),
							(this.streamingMessage = { ...this.initialMessage, content: e, streaming: !0 }),
							this.streamingBuffer.reset(),
							(this.performanceMonitor.startTime = Date.now()),
							(this.performanceMonitor.chunks = []),
							(this.performanceMonitor.renders = []),
							this.$emit("streaming-start")
					},
					appendChunk(e) {
						this.isStreaming
							? (this.performanceMonitor.chunks.push({
									size: e.length,
									time: Date.now() - this.performanceMonitor.startTime,
								}),
								this.streamingBuffer.append(e))
							: console.warn("StreamingRenderer: 尝试在非流式状态下追加内容")
					},
					handleFlush(e) {
						;(this.fullContent += e),
							(this.streamingMessage = { ...this.streamingMessage, content: this.fullContent }),
							this.performanceMonitor.renders.push({
								contentSize: this.fullContent.length,
								time: Date.now() - this.performanceMonitor.startTime,
							}),
							this.$refs.messageRenderer && this.$refs.messageRenderer.setContent(this.fullContent),
							this.$emit("content-update", this.fullContent)
					},
					handleAppend(e) {
						this.$emit("chunk-append", e)
					},
					finishStreaming() {
						this.isStreaming &&
							(this.streamingBuffer.finish(),
							(this.isStreaming = !1),
							(this.streamingMessage = { ...this.streamingMessage, streaming: !1 }),
							this.$refs.messageRenderer && this.$refs.messageRenderer.finishStreaming(),
							(this.performanceMonitor.endTime = Date.now()),
							this.$emit("streaming-finish", {
								content: this.fullContent,
								stats: this.getPerformanceStats(),
							}))
					},
					cancelStreaming() {
						this.isStreaming &&
							(this.streamingBuffer.reset(), (this.isStreaming = !1), this.$emit("streaming-cancel"))
					},
					setFullContent(e) {
						;(this.fullContent = e),
							(this.streamingMessage = { ...this.initialMessage, content: e, streaming: !1 }),
							this.$refs.messageRenderer && this.$refs.messageRenderer.setContent(e)
					},
					getCurrentContent() {
						return this.fullContent
					},
					getPerformanceStats() {
						const e = this.performanceMonitor.endTime - this.performanceMonitor.startTime,
							t = this.performanceMonitor.chunks,
							s = this.performanceMonitor.renders
						return {
							duration: e,
							totalChunks: t.length,
							totalRenders: s.length,
							totalChars: this.fullContent.length,
							avgChunkSize: t.length > 0 ? Math.round(t.reduce((e, t) => e + t.size, 0) / t.length) : 0,
							avgRenderInterval: s.length > 1 ? Math.round(e / (s.length - 1)) : 0,
							charsPerSecond: e > 0 ? Math.round(this.fullContent.length / (e / 1e3)) : 0,
							bufferStats: this.streamingBuffer.getStats(),
						}
					},
					onRendered() {
						this.$emit("rendered")
					},
					getRenderedHTML() {
						return this.$refs.messageRenderer ? this.$refs.messageRenderer.getRenderedHTML() : ""
					},
				},
				beforeDestroy() {
					this.streamingBuffer && this.streamingBuffer.reset()
				},
			},
			c = l,
			d = (s("e4c9"), s("2877")),
			h = Object(d["a"])(c, i, o, !1, null, "10119d82", null)
		t["a"] = h.exports
	},
	"7f50": function (e, t, s) {
		"use strict"
		s("ba0d")
	},
	"816a": function (e, t, s) {},
	"81f6": function (e, t, s) {
		e.exports = s.p + "img/6.187a4467.gif"
	},
	"829b": function (e, t, s) {
		e.exports = s.p + "img/45.7bab77e0.gif"
	},
	"846c": function (e, t, s) {
		e.exports = s.p + "img/36.c4e8fcb2.gif"
	},
	8640: function (e, t, s) {},
	8681: function (e, t, s) {
		e.exports = s.p + "img/icp_logo.58f55c5c.png"
	},
	8697: function (e, t, s) {
		"use strict"
		s("9800")
	},
	"86e1": function (e, t, s) {},
	8786: function (e, t, s) {
		"use strict"
		s("736a")
	},
	"878a": function (e, t, s) {
		"use strict"
		s("e1e3")
	},
	"87df": function (e, t, s) {},
	8959: function (e, t, s) {
		e.exports = s.p + "img/37.418a25ff.gif"
	},
	"8ac6": function (e, t, s) {
		"use strict"
		s("d4d9")
	},
	"8bb4": function (e, t, s) {
		e.exports = s.p + "img/31.4894333c.gif"
	},
	"8d26": function (e, t, s) {},
	"8e89": function (e, t, s) {
		e.exports = s.p + "img/33.deb9bb7e.gif"
	},
	"91f8": function (e, t, s) {
		"use strict"
		var i = s("3c89"),
			o = s.n(i)
		t["default"] = o.a
	},
	9216: function (e, t, s) {
		e.exports = s.p + "img/55.469289a4.gif"
	},
	9607: function (e, t, s) {
		"use strict"
		s("9841")
	},
	"97db": function (e, t, s) {
		"use strict"
		s("5d59")
	},
	9800: function (e, t, s) {},
	"982d": function (e, t, s) {
		e.exports = s.p + "img/14.8734eba5.gif"
	},
	9841: function (e, t, s) {},
	9872: function (e, t, s) {
		"use strict"
		s("2418")
	},
	"9aeb": function (e, t, s) {
		e.exports = s.p + "img/46.e9ac968c.gif"
	},
	"9e86": function (e, t, s) {},
	a01b: function (e, t, s) {},
	a2b2: function (e, t, s) {
		"use strict"
		s("a01b")
	},
	a4d0: function (e, t, s) {
		e.exports = s.p + "img/43.62177cf1.gif"
	},
	a6ea: function (e, t, s) {},
	a753: function (e, t, s) {
		"use strict"
		s("87df")
	},
	a759: function (e, t, s) {},
	a76f: function (e, t, s) {},
	a79b: function (e, t, s) {
		e.exports = s.p + "img/13.aaebd091.gif"
	},
	aa2e: function (e, t, s) {},
	ab39: function (e, t, s) {
		"use strict"
		s("a6ea")
	},
	b1c1: function (e, t, s) {
		e.exports = s.p + "img/11.b0d85036.gif"
	},
	b1fb: function (e, t, s) {
		"use strict"
		s("ec8a")
	},
	b242: function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-dialog",
					{
						attrs: {
							title: "邀请好友",
							visible: e.visible,
							width: "620px",
							"before-close": e.onClose,
							modal: !1,
						},
						on: {
							"update:visible": function (t) {
								e.visible = t
							},
						},
					},
					[
						t("div", { staticClass: "agm-container" }, [
							t(
								"div",
								{ staticClass: "agm-l-box" },
								[
									t(
										"div",
										{ staticClass: "search" },
										[
											t(
												"el-input",
												{
													attrs: { placeholder: "搜索好友", size: "small" },
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
														attrs: { slot: "suffix" },
														slot: "suffix",
													}),
												],
											),
										],
										1,
									),
									t(
										"el-scrollbar",
										{ staticStyle: { height: "400px" } },
										e._l(e.friends, function (s) {
											return t(
												"div",
												{ key: s.id },
												[
													t(
														"friend-item",
														{
															directives: [
																{
																	name: "show",
																	rawName: "v-show",
																	value: s.nickName.includes(e.searchText),
																	expression: "friend.nickName.includes(searchText)",
																},
															],
															attrs: { showDelete: !1, menu: !1, friend: s, active: !1 },
															nativeOn: {
																click: function (t) {
																	return e.onSwitchCheck(s)
																},
															},
														},
														[
															t("el-checkbox", {
																staticClass: "agm-friend-checkbox",
																attrs: { disabled: s.disabled, size: "medium" },
																nativeOn: {
																	click: function (e) {
																		e.stopPropagation()
																	},
																},
																model: {
																	value: s.isCheck,
																	callback: function (t) {
																		e.$set(s, "isCheck", t)
																	},
																	expression: "friend.isCheck",
																},
															}),
														],
														1,
													),
												],
												1,
											)
										}),
										0,
									),
								],
								1,
							),
							t("div", { staticClass: "agm-arrow el-icon-d-arrow-right" }),
							t(
								"div",
								{ staticClass: "agm-r-box" },
								[
									t("div", { staticClass: "agm-select-tip" }, [
										e._v(" 已勾选" + e._s(e.checkCount) + "位好友"),
									]),
									t(
										"el-scrollbar",
										{ staticStyle: { height: "400px" } },
										e._l(e.friends, function (s) {
											return t(
												"div",
												{ key: s.id },
												[
													s.isCheck && !s.disabled
														? t("friend-item", {
																attrs: { friend: s, active: !1, menu: !1 },
																on: {
																	del: function (t) {
																		return e.onRemoveFriend(s)
																	},
																},
															})
														: e._e(),
												],
												1,
											)
										}),
										0,
									),
								],
								1,
							),
						]),
						t(
							"span",
							{ staticClass: "dialog-footer", attrs: { slot: "footer" }, slot: "footer" },
							[
								t(
									"el-button",
									{
										on: {
											click: function (t) {
												return e.onClose()
											},
										},
									},
									[e._v("取 消")],
								),
								t(
									"el-button",
									{
										attrs: { type: "primary" },
										on: {
											click: function (t) {
												return e.onOk()
											},
										},
									},
									[e._v("确 定")],
								),
							],
							1,
						),
					],
				)
			},
			o = [],
			n = (s("14d9"), s("0643"), s("2382"), s("fffc"), s("4e3e"), s("ff36")),
			a = {
				name: "addGroupMember",
				components: { FriendItem: n["a"] },
				data() {
					return { searchText: "", friends: [] }
				},
				methods: {
					onClose() {
						this.$emit("close")
					},
					onOk() {
						let e = { groupId: this.groupId, friendIds: [] }
						this.friends.forEach((t) => {
							t.isCheck && !t.disabled && e.friendIds.push(t.id)
						}),
							e.friendIds.length > 0 &&
								this.$http({ url: "/group/invite", method: "post", data: e }).then(() => {
									this.$message.success("邀请成功"), this.$emit("reload"), this.$emit("close")
								})
					},
					onRemoveFriend(e) {
						e.isCheck = !1
					},
					onSwitchCheck(e) {
						e.disabled || (e.isCheck = !e.isCheck)
					},
				},
				props: { visible: { type: Boolean }, groupId: { type: Number }, members: { type: Array } },
				computed: {
					checkCount() {
						return this.friends.filter((e) => e.isCheck && !e.disabled).length
					},
				},
				watch: {
					visible: function (e, t) {
						e &&
							((this.friends = []),
							this.$store.state.friendStore.friends.forEach((e) => {
								if (e.deleted) return
								let t = JSON.parse(JSON.stringify(e)),
									s = this.members.filter((e) => !e.quit).find((t) => t.userId == e.id)
								s ? ((t.disabled = !0), (t.isCheck = !0)) : ((t.disabled = !1), (t.isCheck = !1)),
									this.friends.push(t)
							}))
					},
				},
			},
			r = a,
			l = (s("3708"), s("2877")),
			c = Object(l["a"])(r, i, o, !1, null, null, null)
		t["a"] = c.exports
	},
	b59b: function (e, t, s) {
		e.exports = s.p + "img/49.c881faa6.gif"
	},
	b761: function (e, t, s) {},
	b8fe: function (e, t, s) {
		"use strict"
		s("7b21")
	},
	b9ba: function (e, t, s) {
		"use strict"
		s("e08e")
	},
	b9d3: function (e, t, s) {},
	ba0d: function (e, t, s) {},
	ba5f: function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-dialog",
					{
						staticClass: "chat-record",
						attrs: { title: "语音录制", visible: e.visible, width: "600px", "before-close": e.onClose },
						on: {
							"update:visible": function (t) {
								e.visible = t
							},
						},
					},
					[
						t(
							"div",
							{
								directives: [
									{
										name: "show",
										rawName: "v-show",
										value: "RECORD" == e.mode,
										expression: "mode == 'RECORD'",
									},
								],
							},
							[
								t("div", { staticClass: "tip" }, [e._v(e._s(e.stateTip))]),
								t("div", [
									e._v("时长: " + e._s("STOP" == e.state ? 0 : parseInt(e.rc.duration)) + "s"),
								]),
							],
						),
						t("audio", {
							directives: [
								{
									name: "show",
									rawName: "v-show",
									value: "PLAY" == e.mode,
									expression: "mode == 'PLAY'",
								},
							],
							ref: "audio",
							attrs: { src: e.url, controls: "" },
							on: {
								ended: function (t) {
									return e.onStopAudio()
								},
							},
						}),
						t("el-divider", { attrs: { "content-position": "center" } }),
						t(
							"el-row",
							{ staticClass: "btn-group" },
							[
								t(
									"el-button",
									{
										directives: [
											{
												name: "show",
												rawName: "v-show",
												value: "STOP" == e.state,
												expression: "state == 'STOP'",
											},
										],
										attrs: { round: "", type: "primary" },
										on: {
											click: function (t) {
												return e.onStartRecord()
											},
										},
									},
									[e._v("开始录音")],
								),
								t(
									"el-button",
									{
										directives: [
											{
												name: "show",
												rawName: "v-show",
												value: "RUNNING" == e.state,
												expression: "state == 'RUNNING'",
											},
										],
										attrs: { round: "", type: "warning" },
										on: {
											click: function (t) {
												return e.onPauseRecord()
											},
										},
									},
									[e._v("暂停录音")],
								),
								t(
									"el-button",
									{
										directives: [
											{
												name: "show",
												rawName: "v-show",
												value: "PAUSE" == e.state,
												expression: "state == 'PAUSE'",
											},
										],
										attrs: { round: "", type: "primary" },
										on: {
											click: function (t) {
												return e.onResumeRecord()
											},
										},
									},
									[e._v("继续录音")],
								),
								t(
									"el-button",
									{
										directives: [
											{
												name: "show",
												rawName: "v-show",
												value: "RUNNING" == e.state || "PAUSE" == e.state,
												expression: "state == 'RUNNING' || state == 'PAUSE'",
											},
										],
										attrs: { round: "", type: "danger" },
										on: {
											click: function (t) {
												return e.onCompleteRecord()
											},
										},
									},
									[e._v(" 结束录音")],
								),
								t(
									"el-button",
									{
										directives: [
											{
												name: "show",
												rawName: "v-show",
												value: "COMPLETE" == e.state && "PLAY" != e.mode,
												expression: "state == 'COMPLETE' && mode != 'PLAY'",
											},
										],
										attrs: { round: "", type: "success" },
										on: {
											click: function (t) {
												return e.onPlayAudio()
											},
										},
									},
									[e._v("播放录音 ")],
								),
								t(
									"el-button",
									{
										directives: [
											{
												name: "show",
												rawName: "v-show",
												value: "COMPLETE" == e.state && "PLAY" == e.mode,
												expression: "state == 'COMPLETE' && mode == 'PLAY'",
											},
										],
										attrs: { round: "", type: "warning" },
										on: {
											click: function (t) {
												return e.onStopAudio()
											},
										},
									},
									[e._v("停止播放 ")],
								),
								t(
									"el-button",
									{
										directives: [
											{
												name: "show",
												rawName: "v-show",
												value: "COMPLETE" == e.state,
												expression: "state == 'COMPLETE'",
											},
										],
										attrs: { round: "", type: "primary" },
										on: {
											click: function (t) {
												return e.onRestartRecord()
											},
										},
									},
									[e._v("重新录音")],
								),
								t(
									"el-button",
									{
										directives: [
											{
												name: "show",
												rawName: "v-show",
												value: "COMPLETE" == e.state,
												expression: "state == 'COMPLETE'",
											},
										],
										attrs: { round: "", type: "primary" },
										on: {
											click: function (t) {
												return e.onSendRecord()
											},
										},
									},
									[e._v("立即发送")],
								),
							],
							1,
						),
					],
					1,
				)
			},
			o = [],
			n = (s("88a7"), s("271a"), s("5494"), s("da43")),
			a = s.n(n),
			r = {
				name: "chatRecord",
				props: { visible: { type: Boolean } },
				data() {
					return {
						rc: new a.a(),
						audio: new Audio(),
						state: "STOP",
						stateTip: "未开始",
						mode: "RECORD",
						duration: 0,
						url: "",
					}
				},
				methods: {
					onClose() {
						this.rc.destroy(),
							(this.rc = new a.a()),
							this.audio.pause(),
							(this.mode = "RECORD"),
							(this.state = "STOP"),
							(this.stateTip = "未开始"),
							this.$emit("close")
					},
					onStartRecord() {
						this.rc
							.start()
							.then((e) => {
								;(this.state = "RUNNING"), (this.stateTip = "正在录音...")
							})
							.catch((e) => {
								this.$message.error(e)
							})
					},
					onPauseRecord() {
						this.rc.pause(), (this.state = "PAUSE"), (this.stateTip = "已暂停录音")
					},
					onResumeRecord() {
						this.rc.resume(), (this.state = "RUNNING"), (this.stateTip = "正在录音...")
					},
					onCompleteRecord() {
						this.rc.pause(), (this.state = "COMPLETE"), (this.stateTip = "已结束录音")
					},
					onPlayAudio() {
						let e = this.rc.getWAVBlob(),
							t = URL.createObjectURL(e)
						;(this.$refs.audio.src = t), this.$refs.audio.play(), (this.mode = "PLAY")
					},
					onStopAudio() {
						this.$refs.audio.pause(), (this.mode = "RECORD")
					},
					onRestartRecord() {
						this.rc.destroy(),
							(this.rc = new a.a()),
							this.rc.start(),
							(this.state = "RUNNING"),
							(this.mode = "RECORD"),
							(this.stateTip = "正在录音...")
					},
					onSendRecord() {
						let e = this.rc.getWAVBlob(),
							t = new Date().getDate() + ".wav"
						var s = new window.FormData()
						s.append("file", e, t),
							this.$http({
								url: "/file/upload",
								data: s,
								method: "post",
								headers: { "Content-Type": "multipart/form-data" },
							}).then((e) => {
								let t = { duration: parseInt(this.rc.duration), url: e }
								this.$emit("send", t), this.onClose()
							})
					},
				},
			},
			l = r,
			c = (s("5b4c"), s("2877")),
			d = Object(c["a"])(l, i, o, !1, null, null, null)
		t["a"] = d.exports
	},
	ba6e: function (e, t, s) {
		e.exports = s.p + "img/38.8f1726b9.gif"
	},
	be35: function (e, t, s) {},
	bf36: function (e, t, s) {
		"use strict"
		s("3748")
	},
	bf5d: function (e, t, s) {
		"use strict"
		s("1fdd")
	},
	c07a: function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t("div", { ref: "markdownContainer", staticClass: "markdown-renderer" }, [
					t("div", { staticClass: "markdown-body", domProps: { innerHTML: e._s(e.renderedContent) } }),
				])
			},
			o = [],
			n = (s("14d9"), s("0643"), s("4e3e"), s("d4cd")),
			a = s.n(n),
			r = s("1487"),
			l = s.n(r),
			c = (s("2c43"), s("3b2f")),
			d = s.n(c),
			h = (s("be0f"), s("af7b")),
			u = s.n(h),
			m = {
				name: "MarkdownRenderer",
				props: {
					content: { type: String, default: "" },
					enableKatex: { type: Boolean, default: !1 },
					enableMermaid: { type: Boolean, default: !0 },
					enableHighlight: { type: Boolean, default: !0 },
					streaming: { type: Boolean, default: !1 },
				},
				data() {
					return {
						md: null,
						renderedContent: "",
						renderTimer: null,
						renderBuffer: "",
						mermaidInitialized: !1,
					}
				},
				computed: {
					contentToRender() {
						return this.streaming ? this.renderBuffer : this.content
					},
				},
				watch: {
					content: {
						handler(e) {
							!this.streaming && this.md && this.renderContent(e)
						},
						immediate: !1,
					},
				},
				created() {
					this.initMarkdownIt(), this.enableMermaid && this.initMermaid()
				},
				mounted() {
					!this.streaming && this.content && this.renderContent(this.content)
				},
				methods: {
					initMarkdownIt() {
						;(this.md = new a.a({
							html: !0,
							linkify: !0,
							typographer: !0,
							breaks: !0,
							highlight: (e, t) => {
								if (!this.enableHighlight) return ""
								if (t && l.a.getLanguage(t))
									try {
										const s = l.a.highlight(e, { language: t, ignoreIllegals: !0 }).value
										return `<pre class="hljs"><code class="language-${t}">${s}</code></pre>`
									} catch (s) {
										console.error("Highlight error:", s)
									}
								return `<pre class="hljs"><code>${this.md.utils.escapeHtml(e)}</code></pre>`
							},
						})),
							this.setupPlugins()
					},
					setupPlugins() {
						;(this.md.renderer.rules.table_open = () => '<table class="markdown-table">\n'),
							this.md.use(this.taskListPlugin),
							this.enableKatex && this.md.use(this.katexPlugin)
						const e =
							this.md.renderer.rules.link_open ||
							function (e, t, s, i, o) {
								return o.renderToken(e, t, s)
							}
						this.md.renderer.rules.link_open = (t, s, i, o, n) => {
							const a = t[s].attrIndex("target")
							return (
								a < 0 ? t[s].attrPush(["target", "_blank"]) : (t[s].attrs[a][1] = "_blank"),
								t[s].attrPush(["rel", "noopener noreferrer"]),
								e(t, s, i, o, n)
							)
						}
						const t = this.md.renderer.rules.fence
						this.md.renderer.rules.fence = (e, s, i, o, n) => {
							const a = e[s],
								r = a.info.trim()
							if ("mermaid" === r && this.enableMermaid) {
								const e = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
								return `<div class="mermaid-container"><div id="${e}" class="mermaid">${this.md.utils.escapeHtml(a.content)}</div></div>`
							}
							const l = t(e, s, i, o, n),
								c = r ? "language-" + r : ""
							return `\n          <div class="code-block-wrapper">\n            <div class="code-block-header">\n              <span class="code-language">${r || "plaintext"}</span>\n              <button class="copy-button" onclick="this.dataset.copied='true'; navigator.clipboard.writeText(this.parentElement.nextElementSibling.querySelector('code').textContent); setTimeout(() => delete this.dataset.copied, 2000)">\n                <span class="copy-text">复制</span>\n                <span class="copied-text">已复制</span>\n              </button>\n            </div>\n            <div class="code-block-content ${c}">\n              ${l}\n            </div>\n          </div>\n        `
						}
					},
					taskListPlugin(e) {
						e.core.ruler.after("inline", "task_list", (e) => {
							const t = e.tokens
							for (let s = 0; s < t.length; s++) {
								if ("inline" !== t[s].type) continue
								const e = t[s].content,
									i = /^\[([ x])\]\s/i
								if (i.test(e)) {
									const o = "x" === e[1].toLowerCase(),
										n = o
											? '<input type="checkbox" class="task-list-item-checkbox" checked disabled>'
											: '<input type="checkbox" class="task-list-item-checkbox" disabled>'
									;(t[s].content = e.replace(i, n + " ")),
										t[s - 2] &&
											"list_item_open" === t[s - 2].type &&
											t[s - 2].attrPush(["class", "task-list-item"])
								}
							}
						})
					},
					katexPlugin(e) {
						e.inline.ruler.after("escape", "math_inline", (e, t) => {
							const s = e.src,
								i = e.pos
							if ("$" !== s[i]) return !1
							const o = s.indexOf("$", i + 1)
							if (-1 === o) return !1
							if (!t) {
								const t = e.push("math_inline", "math", 0)
								t.content = s.slice(i + 1, o)
							}
							return (e.pos = o + 1), !0
						}),
							e.block.ruler.after("fence", "math_block", (e, t, s, i) => {
								const o = e.bMarks[t] + e.tShift[t],
									n = e.eMarks[t],
									a = e.src
								if (o + 2 > n) return !1
								if ("$$" !== a.slice(o, o + 2)) return !1
								let r = t + 1
								while (r < s) {
									const s = e.bMarks[r] + e.tShift[r]
									e.eMarks[r]
									if ("$$" === a.slice(s, s + 2)) {
										if (!i) {
											const s = e.push("math_block", "math", 0)
											s.content = e.getLines(t + 1, r, e.tShift[t], !0)
										}
										return (e.line = r + 1), !0
									}
									r++
								}
								return !1
							}),
							(e.renderer.rules.math_inline = (e, t) => {
								try {
									return d.a.renderToString(e[t].content, { throwOnError: !1 })
								} catch (s) {
									return `<span class="math-error">${e[t].content}</span>`
								}
							}),
							(e.renderer.rules.math_block = (e, t) => {
								try {
									return `<div class="math-block">${d.a.renderToString(e[t].content, { displayMode: !0, throwOnError: !1 })}</div>`
								} catch (s) {
									return `<div class="math-error">${e[t].content}</div>`
								}
							})
					},
					initMermaid() {
						if (!this.mermaidInitialized)
							try {
								u.a.initialize({
									startOnLoad: !1,
									theme: "default",
									flowchart: { useMaxWidth: !0, htmlLabels: !0, curve: "basis" },
									securityLevel: "loose",
								}),
									(u.a.parseError = function (e, t) {
										console.warn("Mermaid parse error:", e)
									}),
									(this.mermaidInitialized = !0)
							} catch (e) {
								console.error("Mermaid init error:", e)
							}
					},
					renderContent(e) {
						if (e) {
							this.md ||
								(console.warn("MarkdownIt not initialized, initializing now..."), this.initMarkdownIt())
							try {
								;(this.renderedContent = this.md.render(e)),
									this.enableMermaid &&
										this.$nextTick(() => {
											this.renderMermaidCharts()
										}),
									this.$emit("rendered")
							} catch (t) {
								console.error("Markdown render error:", t),
									(this.renderedContent = `<pre>${this.escapeHtml(e)}</pre>`)
							}
						} else this.renderedContent = ""
					},
					async renderMermaidCharts() {
						if (!this.enableMermaid || !this.$refs.markdownContainer) return
						const e = this.$refs.markdownContainer.querySelectorAll(".mermaid")
						if (0 !== e.length) {
							this.mermaidInitialized || this.initMermaid()
							try {
								e.forEach((e) => {
									e.dataset.processed ||
										e.id ||
										(e.id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
								}),
									u.a.init(void 0, e),
									e.forEach((e) => {
										;(e.dataset.processed = "true"), e.classList.add("mermaid-rendered")
									})
							} catch (t) {
								for (let i = 0; i < e.length; i++) {
									const t = e[i]
									if ("true" !== t.dataset.processed)
										try {
											const e = t.textContent.trim()
											if (!e) continue
											const s = `mermaid-${Date.now()}-${i}`
											;(t.id = s),
												u.a.init(void 0, t),
												(t.dataset.processed = "true"),
												t.classList.add("mermaid-rendered")
										} catch (s) {
											;(t.innerHTML = `\n              <div class="mermaid-fallback">\n                <div class="mermaid-notice">\n                  <span class="notice-icon">📊</span>\n                  <span class="notice-text">Mermaid 图表</span>\n                </div>\n                <pre class="mermaid-source">${this.escapeHtml(t.textContent)}</pre>\n              </div>\n            `),
												(t.dataset.processed = "true"),
												t.classList.add("mermaid-fallback-mode")
										}
								}
							}
						}
					},
					updateContent(e) {
						;(this.renderBuffer = e),
							clearTimeout(this.renderTimer),
							(this.renderTimer = setTimeout(() => {
								this.renderContent(this.renderBuffer)
							}, 50))
					},
					finishStreaming() {
						clearTimeout(this.renderTimer), this.renderContent(this.renderBuffer)
					},
					getRenderedHTML() {
						return this.renderedContent
					},
					escapeHtml(e) {
						const t = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }
						return e.replace(/[&<>"']/g, (e) => t[e])
					},
				},
				beforeDestroy() {
					clearTimeout(this.renderTimer)
				},
			},
			g = m,
			p = (s("c27a"), s("2877")),
			f = Object(p["a"])(g, i, o, !1, null, null, null)
		t["a"] = f.exports
	},
	c0af: function (e, t, s) {},
	c0b2: function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{
						staticClass: "chat-group-member",
						class: e.active ? "active" : "",
						style: { height: e.height + "px" },
					},
					[
						t(
							"div",
							{ staticClass: "member-avatar" },
							[
								t("head-image", {
									attrs: {
										size: e.headImageSize,
										name: e.member.showNickName,
										url: e.member.headImage,
									},
								}),
							],
							1,
						),
						t("div", { staticClass: "member-name", style: { "line-height": e.height + "px" } }, [
							t("div", [e._v(e._s(e.member.showNickName))]),
						]),
					],
				)
			},
			o = [],
			n = s("4036"),
			a = {
				name: "groupMember",
				components: { HeadImage: n["a"] },
				data() {
					return {}
				},
				props: {
					member: { type: Object, required: !0 },
					height: { type: Number, default: 50 },
					active: { type: Boolean, default: !1 },
				},
				computed: {
					headImageSize() {
						return Math.ceil(0.75 * this.height)
					},
				},
			},
			r = a,
			l = (s("da12"), s("2877")),
			c = Object(l["a"])(r, i, o, !1, null, null, null)
		t["a"] = c.exports
	},
	c27a: function (e, t, s) {
		"use strict"
		s("e24d")
	},
	c6b7: function (e, t, s) {
		"use strict"
		s("1164")
	},
	cbe2: function (e, t, s) {
		"use strict"
		s("30af")
	},
	cd82: function (e, t, s) {
		e.exports = s.p + "img/32.f35d7073.gif"
	},
	cf65: function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"el-dialog",
					{
						attrs: { title: "是否加入通话?", visible: e.isShow, width: "400px" },
						on: {
							"update:visible": function (t) {
								e.isShow = t
							},
						},
					},
					[
						t("div", { staticClass: "rtc-group-join" }, [
							t(
								"div",
								{ staticClass: "host-info" },
								[
									t("head-image", {
										attrs: {
											name: e.rtcInfo.host.nickName,
											url: e.rtcInfo.host.headImage,
											size: 80,
										},
									}),
									t("div", { staticClass: "host-text" }, [
										e._v(e._s("发起人:" + e.rtcInfo.host.nickName)),
									]),
								],
								1,
							),
							t("div", { staticClass: "users-info" }, [
								t("div", [e._v(e._s(e.rtcInfo.userInfos.length + "人正在通话中"))]),
								t(
									"div",
									{ staticClass: "user-list" },
									e._l(e.rtcInfo.userInfos, function (e) {
										return t(
											"div",
											{ key: e.id, staticClass: "user-item" },
											[
												t("head-image", {
													attrs: { url: e.headImage, name: e.nickName, size: 40 },
												}),
											],
											1,
										)
									}),
									0,
								),
							]),
						]),
						t(
							"span",
							{ staticClass: "dialog-footer", attrs: { slot: "footer" }, slot: "footer" },
							[
								t(
									"el-button",
									{
										on: {
											click: function (t) {
												return e.onCancel()
											},
										},
									},
									[e._v("取 消")],
								),
								t(
									"el-button",
									{
										attrs: { type: "primary" },
										on: {
											click: function (t) {
												return e.onOk()
											},
										},
									},
									[e._v("确 定")],
								),
							],
							1,
						),
					],
				)
			},
			o = [],
			n = (s("14d9"), s("0643"), s("fffc"), s("4036")),
			a = {
				name: "rtcGroupJoin",
				components: { HeadImage: n["a"] },
				data() {
					return { isShow: !1, rtcInfo: { host: {}, userInfos: [] } }
				},
				props: { groupId: { type: Number } },
				methods: {
					open(e) {
						;(this.rtcInfo = e), (this.isShow = !0)
					},
					onOk() {
						this.isShow = !1
						let e = this.rtcInfo.userInfos,
							t = this.$store.state.userStore.userInfo
						e.find((e) => e.id == t.id) ||
							e.push({
								id: t.id,
								nickName: t.nickName,
								headImage: t.headImageThumb,
								isCamera: !1,
								isMicroPhone: !0,
							})
						let s = { isHost: !1, groupId: this.groupId, inviterId: t.id, userInfos: e }
						this.$eventBus.$emit("openGroupVideo", s)
					},
					onCancel() {
						this.isShow = !1
					},
				},
			},
			r = a,
			l = (s("1867"), s("2877")),
			c = Object(l["a"])(r, i, o, !1, null, "74737c1c", null)
		t["a"] = c.exports
	},
	cffd: function (e, t, s) {
		e.exports = s.p + "media/call.038ab63f.wav"
	},
	d054: function (e, t, s) {
		e.exports = s.p + "img/10.d13dcac4.gif"
	},
	d055: function (e, t, s) {},
	d370: function (e, t, s) {
		e.exports = s.p + "img/3.7abec26c.gif"
	},
	d496: function (e, t, s) {
		e.exports = s.p + "img/20.6428ddb3.gif"
	},
	d4b0: function (e, t, s) {
		e.exports = s.p + "img/logo-128.427f5849.png"
	},
	d4d9: function (e, t, s) {},
	d4e3: function (e, t, s) {},
	d5b3: function (e, t, s) {
		"use strict"
		var i = s("66a5")
		s.d(t, "b", function () {
			return i["a"]
		})
		var o = s("7e31")
		s.d(t, "a", function () {
			return o["a"]
		})
		var n = s("38f5"),
			a = s("c07a")
		i["a"]
		const r = function (e) {
			e.component("UnifiedMessageRenderer", i["a"]),
				e.component("StreamingRenderer", o["a"]),
				e.component("MarkdownRenderer", a["a"]),
				(e.prototype.$messageAdapter = n["a"])
		}
		"undefined" !== typeof window && window.Vue && window.Vue.use({ install: r })
	},
	da12: function (e, t, s) {
		"use strict"
		s("56f0")
	},
	daa8: function (e, t, s) {
		"use strict"
		s("816a")
	},
	db26: function (e, t, s) {
		"use strict"
		s("0121")
	},
	dcd9: function (e, t, s) {
		"use strict"
		s("d055")
	},
	de74: function (e, t, s) {
		"use strict"
		s("86e1")
	},
	df98: function (e, t, s) {
		e.exports = s.p + "img/29.1659f59b.gif"
	},
	e06d: function (e, t, s) {
		"use strict"
		s.d(t, "a", function () {
			return a
		})
		var i = s("ade3")
		s("0643"), s("9a9a")
		class o {
			constructor() {
				;(this.config = {
					globalLevel: 3,
					componentLevels: {
						ChatItem: 4,
						InboxSession: 2,
						EditorChat: 1,
						VueReactBridge: 2,
						AIChatSimplified: 2,
					},
					criticalEvents: [
						"AI会话同步完成",
						"Bridge初始化完成",
						"加载会话数据失败",
						"达到最大重试次数",
						"严重错误",
						"致命错误",
						"Bridge未初始化",
					],
				}),
					(this.levels = { debug: 0, info: 1, warn: 2, error: 3, critical: 4, off: 5 })
			}
			static getInstance() {
				return o.instance || (o.instance = new o()), o.instance
			}
			shouldLog(e, t, s) {
				var i
				const o = "string" === typeof t ? this.levels[t] : t,
					n = this.config.criticalEvents.some((e) => s.includes(e))
				if (n) return !0
				const a = null !== (i = this.config.componentLevels[e]) && void 0 !== i ? i : this.config.globalLevel
				return o >= a
			}
			debug(e, ...t) {
				this.shouldLog(e, "debug", t.join(" ")) && console.log(`[${e}:DEBUG]`, ...t)
			}
			info(e, ...t) {
				this.shouldLog(e, "info", t.join(" ")) && console.log(`[${e}:INFO]`, ...t)
			}
			warn(e, ...t) {
				this.shouldLog(e, "warn", t.join(" ")) && console.warn(`[${e}:WARN]`, ...t)
			}
			error(e, ...t) {
				this.shouldLog(e, "error", t.join(" ")) && console.error(`[${e}:ERROR]`, ...t)
			}
			critical(e, ...t) {
				console.error(`[${e}:CRITICAL]`, ...t)
			}
			setComponentLevel(e, t) {
				const s = "string" === typeof t ? this.levels[t] : t
				this.config.componentLevels[e] = s
			}
			setGlobalLevel(e) {
				const t = "string" === typeof e ? this.levels[e] : e
				this.config.globalLevel = t
			}
			getConfig() {
				return { ...this.config }
			}
		}
		Object(i["a"])(o, "instance", null)
		const n = o.getInstance(),
			a = {
				debug: (e, ...t) => n.debug(e, ...t),
				info: (e, ...t) => n.info(e, ...t),
				warn: (e, ...t) => n.warn(e, ...t),
				error: (e, ...t) => n.error(e, ...t),
				critical: (e, ...t) => n.critical(e, ...t),
				setLevel: (e, t) => n.setComponentLevel(e, t),
				setGlobalLevel: (e) => n.setGlobalLevel(e),
				getConfig: () => n.getConfig(),
			}
	},
	e08e: function (e, t, s) {},
	e0c4: function (e, t, s) {
		e.exports = s.p + "img/51.5d136c53.gif"
	},
	e1c2: function (e, t, s) {},
	e1e3: function (e, t, s) {},
	e24d: function (e, t, s) {},
	e4c9: function (e, t, s) {
		"use strict"
		s("4eca")
	},
	e4d1: function (e, t, s) {},
	e715: function (e, t, s) {
		e.exports = s.p + "img/50.7614f726.gif"
	},
	e769: function (e, t, s) {
		e.exports = s.p + "img/56.33767a85.gif"
	},
	e8ff: function (e, t, s) {
		"use strict"
		s("0643"), s("4e3e")
		const i = {
			_isVSCodeEnv: null,
			_vscodeUtils: null,
			_safeHTMLUtils: null,
			_initialized: !1,
			_scrollThrottle: new Map(),
			init() {
				this._initialized ||
					((this._scrollThrottle && this._scrollThrottle instanceof Map) ||
						(this._scrollThrottle = new Map()),
					(this._isVSCodeEnv =
						"undefined" !== typeof window &&
						(void 0 !== window.vscodeVueChatUtils || void 0 !== window.vscodeServices)),
					this._isVSCodeEnv
						? ((this._vscodeUtils = window.vscodeVueChatUtils),
							(this._safeHTMLUtils = window.safeHTML || this._vscodeUtils),
							console.log("[VSCodeAdapter] VSCode环境检测成功"),
							console.log("[VSCodeAdapter] vscodeVueChatUtils:", !!window.vscodeVueChatUtils),
							console.log(
								"[VSCodeAdapter] safeSetInnerHTML方法:",
								!(!this._vscodeUtils || !this._vscodeUtils.safeSetInnerHTML),
							),
							console.log(
								"[VSCodeAdapter] safeScrollToBottom方法:",
								!(!this._vscodeUtils || !this._vscodeUtils.safeScrollToBottom),
							))
						: console.log("[VSCodeAdapter] 普通浏览器环境"),
					(this._initialized = !0))
			},
			isVSCodeEnvironment() {
				return this._initialized || this.init(), this._isVSCodeEnv
			},
			getVSCodeUtils() {
				return this._initialized || this.init(), this._vscodeUtils
			},
			getSafeHTMLUtils() {
				return this._initialized || this.init(), this._safeHTMLUtils
			},
			setInnerHTML(e, t) {
				if (!e) return
				"string" !== typeof t && (t = String(t))
				const s = e.dataset.lastContent
				if (s !== t || "" === t) {
					if (this.isVSCodeEnvironment()) {
						const s = this.getVSCodeUtils()
						if (s && s.safeSetInnerHTML)
							try {
								s.safeSetInnerHTML(e, t)
							} catch (i) {
								console.warn("[VSCodeAdapter] safeSetInnerHTML failed, falling back to innerHTML:", i),
									(e.innerHTML = t)
							}
						else e.innerHTML = t
					} else e.innerHTML = t
					e.dataset.lastContent = t
				}
			},
			scrollToBottom(e) {
				if (!e) return
				;(this._scrollThrottle && this._scrollThrottle instanceof Map) || (this._scrollThrottle = new Map())
				const t = e.id || "default",
					s = Date.now(),
					i = this._scrollThrottle.get(t)
				if (!(i && s - i < 100))
					if ((this._scrollThrottle.set(t, s), this.isVSCodeEnvironment())) {
						const t = this.getVSCodeUtils()
						if (t && t.safeScrollToBottom)
							try {
								t.safeScrollToBottom(e)
							} catch (o) {
								console.warn("[VSCodeAdapter] safeScrollToBottom failed, falling back:", o),
									this.fallbackScrollToBottom(e)
							}
						else this.fallbackScrollToBottom(e)
					} else this.performantScrollToBottom(e)
			},
			performantScrollToBottom(e) {
				const t = e.dataset.rafId
				t && cancelAnimationFrame(t)
				const s = requestAnimationFrame(() => {
					try {
						;(e.scrollTop = e.scrollHeight), delete e.dataset.rafId
					} catch (t) {}
				})
				e.dataset.rafId = s
			},
			fallbackScrollToBottom(e) {
				try {
					"function" === typeof requestAnimationFrame
						? this.performantScrollToBottom(e)
						: (e.scrollTop = e.scrollHeight)
				} catch (t) {}
			},
			batchSetInnerHTML(e) {
				if (!Array.isArray(e) || 0 === e.length) return
				document.createDocumentFragment()
				e.forEach(({ element: e, html: t }) => {
					e && "string" === typeof t && this.setInnerHTML(e, t)
				})
			},
			cleanup() {
				this._scrollThrottle && "function" === typeof this._scrollThrottle.clear
					? this._scrollThrottle.clear()
					: (this._scrollThrottle = new Map()),
					document.querySelectorAll("[data-raf-id]").forEach((e) => {
						e.dataset.rafId && (cancelAnimationFrame(e.dataset.rafId), delete e.dataset.rafId)
					})
			},
			addEventListener(e, t, s) {
				if (e && "function" === typeof s)
					try {
						e.addEventListener(t, s)
					} catch (i) {}
			},
			getEnvironmentInfo() {
				return (
					this._initialized || this.init(),
					{
						isVSCode: this._isVSCodeEnv,
						hasVSCodeUtils: !!this._vscodeUtils,
						hasSafeHTML: !!this._safeHTMLUtils,
						scrollThrottleSize: this._scrollThrottle.size,
					}
				)
			},
			logPerformanceInfo() {
				0
			},
		}
		t["a"] = i
	},
	e9aa: function (e, t, s) {},
	ea72: function (e, t, s) {
		"use strict"
		s("29c2")
	},
	ebcd: function (e, t, s) {
		"use strict"
		s("5234")
	},
	ec8a: function (e, t, s) {},
	ef96: function (e, t, s) {
		e.exports = s.p + "img/7.fb655c96.gif"
	},
	f1c0: function (e, t, s) {
		e.exports = s.p + "img/0.23538cb7.gif"
	},
	f2b0: function (e, t, s) {
		e.exports = s.p + "media/tip.7068643e.wav"
	},
	f320: function (e, t, s) {
		e.exports = s.p + "img/1.41d8ebbe.gif"
	},
	f498: function (e, t, s) {
		"use strict"
		s("e9aa")
	},
	f5d6: function (e, t, s) {
		e.exports = s.p + "img/23.071999b8.gif"
	},
	f752: function (e, t, s) {
		"use strict"
		s("fcb9")
	},
	fa2e: function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{ staticClass: "chat-input-area" },
					[
						e.isDragOver ? t("div", { staticClass: "drag-overlay" }, [e._m(0)]) : e._e(),
						t("div", {
							ref: "content",
							class: ["edit-chat-container", e.isEmpty ? "" : "not-empty"],
							attrs: { contenteditable: "true" },
							on: {
								paste: function (t) {
									return t.preventDefault(), e.onPaste.apply(null, arguments)
								},
								keydown: e.onKeydown,
								compositionstart: function (t) {
									e.compositionFlag = !0
								},
								compositionend: e.onCompositionEnd,
								input: e.onEditorInput,
								mousedown: e.onMousedown,
								blur: e.onBlur,
							},
						}),
						t("chat-at-box", {
							ref: "atBox",
							attrs: { "search-text": e.atSearchText, ownerId: e.ownerId, members: e.groupMembers },
							on: { select: e.onAtSelect },
						}),
						t("roo-code-at-panel", {
							ref: "rooCodePanel",
							attrs: {
								userId: e.ownerId,
								targetUserId: e.targetUserId,
								groupMembers: e.groupMembers,
								isGroup: !!e.groupMembers && e.groupMembers.length > 0,
							},
						}),
					],
					1,
				)
			},
			o = [
				function () {
					var e = this,
						t = e._self._c
					return t("div", { staticClass: "drag-content" }, [
						t("i", { staticClass: "el-icon-upload2" }),
						t("p", [e._v("拖拽文件到此处自动发送")]),
						t("p", { staticClass: "drag-tip" }, [e._v("支持图片、文档等文件类型")]),
					])
				},
			],
			n = (s("14d9"), s("88a7"), s("271a"), s("5494"), s("36a4")),
			a = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{
						directives: [{ name: "show", rawName: "v-show", value: e.visible, expression: "visible" }],
						staticClass: "roocode-at-panel",
						style: e.panelStyle,
					},
					[
						e.selectedCategory
							? t("div", { staticClass: "panel-level-two" }, [
									t("div", { staticClass: "panel-header" }, [
										t("span", { staticClass: "back-btn", on: { click: e.backToFirstLevel } }, [
											t("i", { staticClass: "el-icon-arrow-left" }),
										]),
										e._v(
											" " +
												e._s(
													"members" === e.selectedCategory
														? "选择群成员"
														: "tasks" === e.selectedCategory
															? "选择任务"
															: "选择智能体",
												) +
												" ",
										),
									]),
									e.items.length > 5
										? t("div", { staticClass: "panel-search" }, [
												t("input", {
													directives: [
														{
															name: "model",
															rawName: "v-model",
															value: e.searchText,
															expression: "searchText",
														},
													],
													staticClass: "search-input",
													attrs: { placeholder: "搜索..." },
													domProps: { value: e.searchText },
													on: {
														input: [
															function (t) {
																t.target.composing || (e.searchText = t.target.value)
															},
															e.filterItems,
														],
													},
												}),
											])
										: e._e(),
									t(
										"div",
										{ staticClass: "panel-items" },
										[
											e.loading
												? t("div", { staticClass: "loading" }, [
														t("i", { staticClass: "el-icon-loading" }),
														e._v(" 加载中... "),
													])
												: 0 === e.filteredItems.length && "tasks" !== e.selectedCategory
													? t("div", { staticClass: "empty" }, [
															e._v(
																" " +
																	e._s(
																		"members" === e.selectedCategory
																			? "暂无群成员"
																			: "暂无智能体记录",
																	) +
																	" ",
															),
														])
													: e._l(e.filteredItems, function (s, i) {
															return t(
																"div",
																{
																	key: s.id || s.slug || i,
																	staticClass: "panel-item",
																	class: {
																		active: e.activeIndex === i,
																		selected: e.isItemSelected(s),
																	},
																	on: {
																		click: function (t) {
																			return e.selectItem(s)
																		},
																		mouseenter: function (t) {
																			e.activeIndex = i
																		},
																	},
																},
																[
																	s.icon
																		? t("span", { staticClass: "item-icon" }, [
																				e._v(e._s(s.icon)),
																			])
																		: t("i", {
																				class:
																					s.iconClass || "el-icon-document",
																			}),
																	t("div", { staticClass: "item-content" }, [
																		t("div", { staticClass: "item-name" }, [
																			e._v(e._s(s.name)),
																		]),
																		s.description
																			? t("div", { staticClass: "item-desc" }, [
																					e._v(e._s(s.description)),
																				])
																			: e._e(),
																	]),
																	s.modeType
																		? t("span", { staticClass: "item-type" }, [
																				e._v(
																					" " +
																						e._s(
																							"system" === s.modeType
																								? "系统"
																								: "自定义",
																						) +
																						" ",
																				),
																			])
																		: e._e(),
																	e.isItemSelected(s)
																		? t("i", {
																				staticClass:
																					"el-icon-check selected-mark",
																			})
																		: e._e(),
																],
															)
														}),
										],
										2,
									),
								])
							: t("div", { staticClass: "panel-level-one" }, [
									t("div", { staticClass: "panel-header" }, [e._v("选择类型")]),
									t("div", { staticClass: "panel-items" }, [
										e.groupMembers && e.groupMembers.length > 0
											? t(
													"div",
													{
														staticClass: "panel-item",
														class: { active: 0 === e.activeIndex },
														on: {
															click: function (t) {
																return e.selectCategory("members")
															},
															mouseenter: function (t) {
																e.activeIndex = 0
															},
														},
													},
													[
														t("i", { staticClass: "el-icon-user" }),
														t("span", [e._v("群成员")]),
														t("i", { staticClass: "el-icon-arrow-right" }),
													],
												)
											: e._e(),
										t(
											"div",
											{
												staticClass: "panel-item",
												class: {
													active:
														e.activeIndex ===
														(e.groupMembers && e.groupMembers.length > 0 ? 1 : 0),
												},
												on: {
													click: function (t) {
														return e.selectCategory("tasks")
													},
													mouseenter: function (t) {
														e.activeIndex =
															e.groupMembers && e.groupMembers.length > 0 ? 1 : 0
													},
												},
											},
											[
												t("i", { staticClass: "el-icon-document" }),
												t("span", [e._v("任务")]),
												t("i", { staticClass: "el-icon-arrow-right" }),
											],
										),
										t(
											"div",
											{
												staticClass: "panel-item",
												class: {
													active:
														e.activeIndex ===
														(e.groupMembers && e.groupMembers.length > 0 ? 2 : 1),
												},
												on: {
													click: function (t) {
														return e.selectCategory("agents")
													},
													mouseenter: function (t) {
														e.activeIndex =
															e.groupMembers && e.groupMembers.length > 0 ? 2 : 1
													},
												},
											},
											[
												t("i", { staticClass: "el-icon-cpu" }),
												t("span", [e._v("智能体")]),
												t("i", { staticClass: "el-icon-arrow-right" }),
											],
										),
									]),
								]),
					],
				)
			},
			r = [],
			l =
				(s("1e70"),
				s("79a4"),
				s("c1a1"),
				s("8b00"),
				s("a4e7"),
				s("1e5a"),
				s("72c3"),
				s("0643"),
				s("2382"),
				s("fffc"),
				s("4e3e"),
				s("a573"),
				s("7dac")),
			c = {
				name: "RooCodeAtPanel",
				props: {
					userId: { type: Number, required: !0 },
					targetUserId: { type: [Number, String], default: null },
					groupMembers: { type: Array, default: () => [] },
					isGroup: { type: Boolean, default: !1 },
				},
				data() {
					return {
						visible: !1,
						position: { x: 0, y: 0 },
						selectedCategory: null,
						items: [],
						filteredItems: [],
						searchText: "",
						activeIndex: 0,
						loading: !1,
						callback: null,
						currentSelection: null,
						openTime: 0,
						openedFromIndicator: !1,
						clickCheckInterval: null,
					}
				},
				computed: {
					currentUserTerminal() {
						var e
						return null === (e = this.$store.state.userStore) ||
							void 0 === e ||
							null === (e = e.userInfo) ||
							void 0 === e
							? void 0
							: e.terminal
					},
					userTerminalName() {
						return this.$store.getters["userStore/terminalName"]
					},
					currentSenderTerminal() {
						const e = this.currentUserTerminal
						return void 0 !== e && null !== e
							? (console.log("[RooCodeAtPanel] 从 userStore 获取终端:", e, this.userTerminalName), e)
							: window.vscodeServices
								? (console.log("[RooCodeAtPanel] 降级推断：VS Code 环境，使用终端 2（我的电脑）"), 2)
								: (console.log("[RooCodeAtPanel] 降级推断：Web 环境，使用终端 0（傻蛋网页端）"), 0)
					},
					activeChat() {
						return this.$store.state.activeChat
					},
					currentTargetId() {
						return this.activeChat && this.activeChat.targetId
							? (console.log("[RooCodeAtPanel] 使用 activeChat.targetId:", this.activeChat.targetId),
								this.activeChat.targetId)
							: (console.log("[RooCodeAtPanel] 降级使用 props.targetUserId:", this.targetUserId),
								this.targetUserId)
					},
					currentChatType() {
						if (this.activeChat && this.activeChat.type)
							return (
								console.log("[RooCodeAtPanel] 使用 activeChat.type:", this.activeChat.type),
								this.activeChat.type
							)
						const e = this.isGroup ? "GROUP" : "PRIVATE"
						return console.log("[RooCodeAtPanel] 降级使用 props 判断 chatType:", e), e
					},
					panelStyle() {
						const e = this.selectedCategory && this.filteredItems.length > 5 ? 400 : 350
						if (this.position.isBelow)
							return {
								left: this.position.x + "px",
								top: this.position.y + 20 + "px",
								maxHeight: Math.min(e, window.innerHeight - this.position.y - 50) + "px",
							}
						{
							const t = this.position.y - 20
							return {
								left: this.position.x + "px",
								bottom: window.innerHeight - this.position.y + 5 + "px",
								maxHeight: Math.min(e, t) + "px",
							}
						}
					},
				},
				methods: {
					open(e, t, s = null, i = "") {
						this.removeEventListeners(),
							(this.visible = !0),
							(this.openTime = Date.now()),
							(this.openedFromIndicator = !!s)
						let o = e.x
						const n = 400
						if (
							(o + n > window.innerWidth && (o = window.innerWidth - n - 10),
							o < 10 && (o = 10),
							(this.position = { x: o, y: e.y }),
							(this.callback = t),
							s)
						)
							(this.currentSelection = s),
								(this.selectedCategory = s.type),
								(this.searchText = ""),
								"members" === s.type
									? this.loadMembers()
									: this.loadItems("tasks" === s.type ? "tasks" : "agents"),
								this.$nextTick(() => {
									this.locateSelectedItem()
								})
						else if (i) {
							const e = i.toLowerCase()
							e.includes("任务") || e.includes("task")
								? (this.selectCategory("tasks"), (this.currentSelection = null))
								: e.includes("智能体") || e.includes("agent") || e.includes("ai")
									? (this.selectCategory("agents"), (this.currentSelection = null))
									: ((this.selectedCategory = null),
										(this.activeIndex = 0),
										(this.searchText = i),
										(this.currentSelection = null))
						} else
							(this.selectedCategory = null),
								(this.activeIndex = 0),
								(this.searchText = ""),
								(this.currentSelection = null)
						this.addEventListeners(),
							this.$nextTick(() => {
								this.adjustPanelPosition()
							})
					},
					addEventListeners() {
						document.addEventListener("keydown", this.handleKeydown),
							this.openedFromIndicator
								? (console.log(
										"[DEBUG] Adding polling-based click detection for indicator-opened panel",
									),
									this.startClickPolling())
								: this.$nextTick(() => {
										this.visible &&
											(document.addEventListener("click", this.handleClickOutside, !0),
											console.log("[DEBUG] Click outside listener added (capture mode)"))
									})
					},
					startClickPolling() {
						this.clickCheckInterval && clearInterval(this.clickCheckInterval)
						let e = 0,
							t = Date.now() + 300
						const s = (s) => {
							const i = Date.now()
							i < t
								? console.log("[DEBUG] Ignoring click during grace period")
								: this.$el && this.$el.contains(s.target)
									? console.log("[DEBUG] Ignoring click inside panel")
									: (console.log("[DEBUG] Recording outside click for polling detection"), (e = i))
						}
						document.addEventListener("mousedown", s, !0),
							(this.clickCheckInterval = setInterval(() => {
								if (!this.visible)
									return (
										clearInterval(this.clickCheckInterval),
										void document.removeEventListener("mousedown", s, !0)
									)
								e > 0 &&
									Date.now() - e < 100 &&
									(console.log("[DEBUG] Polling detected valid outside click, closing panel"),
									this.close(),
									clearInterval(this.clickCheckInterval),
									document.removeEventListener("mousedown", s, !0))
							}, 50))
					},
					isClickInPanel() {
						const e = document.activeElement
						return this.$el && (this.$el.contains(e) || this.$el === e)
					},
					removeEventListeners() {
						document.removeEventListener("keydown", this.handleKeydown),
							document.removeEventListener("click", this.handleClickOutside, !0),
							document.removeEventListener("click", this.handleClickOutside, !1),
							this.clickCheckInterval &&
								(clearInterval(this.clickCheckInterval), (this.clickCheckInterval = null)),
							console.log("[DEBUG] Event listeners removed")
					},
					locateSelectedItem() {
						if (!this.currentSelection || !this.filteredItems.length) return
						const e = this.filteredItems.findIndex((e) =>
							"members" === this.currentSelection.type
								? e.userId === this.currentSelection.item.userId
								: e.id === this.currentSelection.item.id || e.slug === this.currentSelection.item.slug,
						)
						e >= 0 && ((this.activeIndex = e), this.scrollToActiveItem())
					},
					adjustPanelPosition() {
						const e = this.$el
						if (!e) return
						const t = e.getBoundingClientRect()
						t.height
						t.top < 10 && this.$set(this, "position", { ...this.position, isBelow: !0 })
					},
					close() {
						;(this.visible = !1),
							(this.selectedCategory = null),
							(this.items = []),
							(this.filteredItems = []),
							this.removeEventListeners()
					},
					handleClickOutside(e) {
						console.log("[DEBUG] handleClickOutside triggered, target:", e.target),
							this.visible
								? this.$el && this.$el.contains(e.target)
									? console.log("[DEBUG] handleClickOutside - clicked inside panel, ignoring")
									: e.target.classList &&
										  (e.target.classList.contains("roocode-mention") ||
												e.target.classList.contains("chat-at-user"))
										? console.log("[DEBUG] handleClickOutside - clicked on mention, ignoring")
										: e.target.innerText &&
											  (e.target.innerText.startsWith("@任务[") ||
													e.target.innerText.startsWith("@智能体["))
											? console.log(
													"[DEBUG] handleClickOutside - clicked on RooCode mention, ignoring",
												)
											: e.target.closest(".content")
												? console.log(
														"[DEBUG] handleClickOutside - clicked in input area, ignoring",
													)
												: (console.log("[DEBUG] handleClickOutside - closing panel"),
													this.close())
								: console.log("[DEBUG] handleClickOutside - panel not visible, ignoring")
					},
					handleKeydown(e) {
						this.visible &&
							("Escape" === e.key
								? this.close()
								: "ArrowUp" === e.key
									? (e.preventDefault(), this.moveUp())
									: "ArrowDown" === e.key
										? (e.preventDefault(), this.moveDown())
										: "Enter" === e.key && (e.preventDefault(), this.confirmSelection()))
					},
					moveUp() {
						this.activeIndex > 0 && (this.activeIndex--, this.scrollToActiveItem())
					},
					moveDown() {
						let e
						;(e = this.selectedCategory
							? this.filteredItems.length - 1
							: this.groupMembers && this.groupMembers.length > 0
								? 2
								: 1),
							this.activeIndex < e && (this.activeIndex++, this.scrollToActiveItem())
					},
					scrollToActiveItem() {
						this.$nextTick(() => {
							const e = this.$el.querySelector(".panel-items"),
								t = this.$el.querySelectorAll(".panel-item")[this.activeIndex]
							if (e && t) {
								const s = e.getBoundingClientRect(),
									i = t.getBoundingClientRect()
								i.top < s.top
									? (e.scrollTop -= s.top - i.top + 10)
									: i.bottom > s.bottom && (e.scrollTop += i.bottom - s.bottom + 10)
							}
						})
					},
					confirmSelection() {
						if (this.selectedCategory)
							this.filteredItems[this.activeIndex] &&
								this.selectItem(this.filteredItems[this.activeIndex])
						else {
							const e = this.groupMembers && this.groupMembers.length > 0
							e
								? 0 === this.activeIndex
									? this.selectCategory("members")
									: 1 === this.activeIndex
										? this.selectCategory("tasks")
										: this.selectCategory("agents")
								: 0 === this.activeIndex
									? this.selectCategory("tasks")
									: this.selectCategory("agents")
						}
					},
					selectCategory(e) {
						console.log("[DEBUG] selectCategory called with:", e),
							console.log("[DEBUG] Before set - selectedCategory:", this.selectedCategory),
							(this.selectedCategory = e),
							console.log("[DEBUG] After set - selectedCategory:", this.selectedCategory),
							(this.activeIndex = 0),
							(this.items = []),
							(this.filteredItems = []),
							"members" === e
								? this.loadMembers()
								: "tasks" === e
									? (console.log("[DEBUG] About to load tasks"), this.loadItems("tasks"))
									: "agents" === e &&
										(console.log("[DEBUG] About to load agents"), this.loadItems("agents")),
							this.$forceUpdate(),
							console.log("[DEBUG] Force update called")
					},
					backToFirstLevel() {
						;(this.selectedCategory = null),
							(this.activeIndex = 0),
							(this.items = []),
							(this.filteredItems = [])
					},
					async loadItems(e) {
						this.loading = !0
						try {
							let i = []
							i =
								this.isGroup && this.groupMembers
									? this.groupMembers.map((e) => e.userId)
									: this.targetUserId
										? [this.targetUserId]
										: [this.userId]
							let o = []
							for (const n of i)
								try {
									const s =
											"tasks" === e
												? "/api/roocode/redis/tasks/" + n
												: "/api/roocode/redis/agents/" + n,
										i = await this.$http.get(s)
									if (i && Array.isArray(i) && i.length > 0) {
										var t
										const e =
											null === (t = this.groupMembers) || void 0 === t
												? void 0
												: t.find((e) => e.userId === n)
										i.forEach((t) => {
											;(t.userId = n),
												(t.userName =
													(null === e || void 0 === e ? void 0 : e.showNickName) ||
													(null === e || void 0 === e ? void 0 : e.nickName) ||
													"用户" + n)
										}),
											(o = o.concat(i))
									}
								} catch (s) {}
							if ("tasks" === e) {
								console.log("[DEBUG] Processing tasks - allItems:", o)
								const e = {
										id: "new-task",
										name: "新建任务",
										description: "创建一个新的任务",
										iconClass: "el-icon-plus",
										isNewTask: !0,
									},
									t = o.map((e) => ({
										...e,
										name: e.task || e.name || "未命名任务",
										description: `模式: ${e.mode || "unknown"} | 令牌: ${e.tokensIn || 0}/${e.tokensOut || 0}`,
										iconClass: "el-icon-document",
									}))
								;(this.items = [e, ...t]), console.log("[DEBUG] Processed tasks items:", this.items)
							} else {
								if ((console.log("[DEBUG] Processing agents - allItems:", o), o.length > 0)) {
									const e = o.map((e) => ({
											...e,
											name: e.name || e.slug || "未命名模式",
											description: e.description || e.roleDefinition || "智能体模式",
											icon: e.icon || "🤖",
										})),
										t = [],
										s = [],
										i = new Set()
									e.forEach((e) => {
										"system" === e.modeType
											? i.has(e.slug) || (t.push(e), i.add(e.slug))
											: s.push(e)
									}),
										(this.items = [...t, ...s])
								} else this.items = []
								console.log("[DEBUG] Processed agents items:", this.items)
							}
							this.$set(this, "items", this.items),
								(this.filteredItems = [...this.items]),
								this.$set(this, "filteredItems", this.filteredItems)
						} catch (i) {
							;(this.items = []), (this.filteredItems = [])
						} finally {
							this.loading = !1
						}
					},
					loadMembers() {
						;(this.loading = !1),
							(this.items = this.groupMembers.map((e) => ({
								userId: e.userId,
								name: e.showNickName || e.nickName,
								description: e.signature || "群成员",
								iconClass: "el-icon-user",
							}))),
							(this.filteredItems = [...this.items])
					},
					filterItems() {
						if (this.searchText) {
							const e = this.searchText.toLowerCase()
							this.filteredItems = this.items.filter(
								(t) =>
									!("tasks" !== this.selectedCategory || !t.isNewTask) ||
									t.name.toLowerCase().includes(e) ||
									(t.description && t.description.toLowerCase().includes(e)),
							)
						} else this.filteredItems = [...this.items]
						this.activeIndex = 0
					},
					isItemSelected(e) {
						if (!this.currentSelection || !this.currentSelection.item) return !1
						const t = this.currentSelection.item
						return "members" === this.selectedCategory
							? e.userId === t.userId
							: "tasks" === this.selectedCategory
								? e.id === t.id
								: e.slug === t.slug || e.id === t.id
					},
					selectItem(e) {
						if (this.callback) {
							let r
							if ("members" === this.selectedCategory) r = "@" + e.name
							else if ("tasks" === this.selectedCategory) {
								var t, s, i
								let o = this.currentTargetId
								const n = this.currentChatType,
									a = this.currentSenderTerminal
								!o &&
									"GROUP" === n &&
									null !== (t = this.groupMembers) &&
									void 0 !== t &&
									null !== (t = t[0]) &&
									void 0 !== t &&
									t.groupId &&
									(o = this.groupMembers[0].groupId),
									console.log("[RooCodeAtPanel] 任务提及 - 完整参数:", {
										propsTargetUserId: this.targetUserId,
										activeChatTargetId:
											null === (s = this.activeChat) || void 0 === s ? void 0 : s.targetId,
										activeChatType:
											null === (i = this.activeChat) || void 0 === i ? void 0 : i.type,
										finalTargetId: o,
										finalChatType: n,
										senderTerminal: a,
										senderTerminalName: this.userTerminalName,
									}),
									(r = e.isNewTask
										? l["MentionHelper"].createTaskMention("新建任务", null, o, n, a)
										: l["MentionHelper"].createTaskMention(e.name, e.id, o, n, a))
							} else {
								var o, n, a
								let t = this.currentTargetId
								const s = this.currentChatType,
									i = this.currentSenderTerminal
								!t &&
									"GROUP" === s &&
									null !== (o = this.groupMembers) &&
									void 0 !== o &&
									null !== (o = o[0]) &&
									void 0 !== o &&
									o.groupId &&
									(t = this.groupMembers[0].groupId),
									console.log("[RooCodeAtPanel] 智能体提及 - 完整参数:", {
										propsTargetUserId: this.targetUserId,
										activeChatTargetId:
											null === (n = this.activeChat) || void 0 === n ? void 0 : n.targetId,
										activeChatType:
											null === (a = this.activeChat) || void 0 === a ? void 0 : a.type,
										finalTargetId: t,
										finalChatType: s,
										senderTerminal: i,
										senderTerminalName: this.userTerminalName,
									}),
									(r = l["MentionHelper"].createAgentMention(e.name, e.slug || e.id, t, s, i))
							}
							const c = { type: this.selectedCategory, item: e, displayText: r }
							;(this.currentSelection = c), this.callback(c)
						}
						this.close()
					},
					getCurrentSelection() {
						return this.currentSelection
					},
					clearSelection() {
						this.currentSelection = null
					},
				},
				beforeDestroy() {
					this.removeEventListeners()
				},
			},
			d = c,
			h = (s("bf5d"), s("2877")),
			u = Object(h["a"])(d, a, r, !1, null, "b3c02e30", null),
			m = u.exports,
			g = s("e8ff"),
			p = s("18c6")
		const f = g["a"]
		var v = {
				name: "ChatInput",
				components: { ChatAtBox: n["a"], RooCodeAtPanel: m, Emotion: p["a"] },
				props: {
					ownerId: { type: Number },
					targetUserId: { type: [Number, String], default: null },
					groupMembers: { type: Array },
				},
				data() {
					return {
						imageList: [],
						fileList: [],
						currentId: 0,
						atSearchText: null,
						compositionFlag: !1,
						atIng: !1,
						rooCodeAtIng: !1,
						isEmpty: !0,
						changeStored: !0,
						blurRange: null,
						taskContinuation: null,
						isContinuationActive: !1,
						isDragOver: !1,
						dragCounter: 0,
						globalDragListeners: null,
					}
				},
				mounted() {
					f.init()
				},
				beforeDestroy() {},
				methods: {
					safeSetInnerHTML(e, t) {
						e && f.setInnerHTML(e, t)
					},
					safeGetInnerHTML(e) {
						if (!e) return ""
						try {
							return e.innerHTML || ""
						} catch (t) {
							return e.textContent || ""
						}
					},
					onPaste(e) {
						this.isEmpty = !1
						let t = e.clipboardData.getData("Text"),
							s = window.getSelection().getRangeAt(0)
						if (
							((s.startContainer === s.endContainer && s.startOffset === s.endOffset) ||
								s.deleteContents(),
							t && "string" == typeof t)
						) {
							let e = document.createTextNode(t)
							return s.insertNode(e), void s.collapse()
						}
						let i = (e.clipboardData || window.clipboardData).items
						if (i.length)
							for (let o = 0; o < i.length; o++)
								if (-1 !== i[o].type.indexOf("image")) {
									let e = i[o].getAsFile(),
										t = { fileId: this.generateId(), file: e, url: URL.createObjectURL(e) }
									this.imageList[t.fileId] = t
									let s = this.newLine(),
										n = document.createElement("img")
									;(n.className = "chat-image no-text"),
										(n.src = t.url),
										(n.dataset.imgId = t.fileId),
										s.appendChild(n)
									let a = document.createTextNode(" ")
									s.appendChild(a), this.selectElement(a, 1)
								} else {
									let e = i[o].getAsFile()
									if (!e) continue
									let t = { fileId: this.generateId(), file: e }
									this.fileList[t.fileId] = t
									let s = this.newLine(),
										n = this.createFile(t)
									s.appendChild(n)
									let a = document.createTextNode(" ")
									s.appendChild(a), this.selectElement(a, 1)
								}
						s.collapse()
					},
					selectElement(e, t) {
						let s = window.getSelection()
						this.$nextTick(() => {
							let i = document.createRange()
							i.setStart(e, 0),
								i.setEnd(e, t || 0),
								e.firstChild && i.selectNodeContents(e.firstChild),
								i.collapse(),
								s.removeAllRanges(),
								s.addRange(i),
								e.focus && e.focus()
						})
					},
					onCompositionEnd(e) {
						;(this.compositionFlag = !1), this.onEditorInput(e)
					},
					onKeydown(e) {
						if (13 !== e.keyCode)
							8 === e.keyCode &&
								(console.log("delete"),
								setTimeout(() => {
									let e = this.safeGetInnerHTML(this.$refs.content).trim()
									console.log(e),
										"" === e || "<br>" === e || "<div>&nbsp;</div>" === e
											? (this.empty(),
												(this.isEmpty = !0),
												this.selectElement(this.$refs.content))
											: (this.isEmpty = !1)
								})),
								this.atIng &&
									(38 === e.keyCode &&
										(e.preventDefault(), e.stopPropagation(), this.$refs.atBox.moveUp()),
									40 === e.keyCode &&
										(e.preventDefault(), e.stopPropagation(), this.$refs.atBox.moveDown()))
						else {
							if ((e.preventDefault(), e.stopPropagation(), this.atIng))
								return console.log("选中at的人"), void this.$refs.atBox.select()
							if (e.ctrlKey || e.shiftKey) {
								let e = this.newLine(),
									t = document.createTextNode(" ")
								e.appendChild(t), this.selectElement(e.childNodes[0], 0)
							} else {
								if (this.compositionFlag) return
								this.submit()
							}
						}
					},
					onAtSelect(e) {
						this.atIng = !1
						let t = this.blurRange,
							s = t.endContainer,
							i = s.data.indexOf("@" + this.atSearchText),
							o = i + this.atSearchText.length + 1
						t.setStart(t.endContainer, i),
							t.setEnd(t.endContainer, o),
							t.deleteContents(),
							t.collapse(),
							console.log("onAtSelect"),
							this.focus()
						let n = document.createElement("SPAN")
						;(n.className = "chat-at-user"),
							(n.dataset.id = e.userId),
							(n.contentEditable = "false"),
							(n.innerText = "@" + e.showNickName),
							t.insertNode(n),
							t.collapse()
						let a = document.createTextNode(" ")
						t.insertNode(a), t.collapse(), (this.atSearchText = ""), this.selectElement(a, 1)
					},
					onEditorInput(e) {
						if (((this.isEmpty = !1), (this.changeStored = !1), !this.compositionFlag)) {
							let t = window.getSelection(),
								s = t.getRangeAt(0),
								i = s.endContainer,
								o = s.endOffset,
								n = i.textContent,
								a = -1
							for (let e = o; e >= 0; e--)
								if ("@" === n[e]) {
									a = e
									break
								}
							if (-1 === a)
								return (
									this.$refs.atBox.close(),
									this.$refs.rooCodePanel.close(),
									void (this.rooCodeAtIng = !1)
								)
							let r = n.substring(0, a).trim(),
								l = (r.length, o)
							for (let e = o; e < n.length; e++)
								if (" " === n[e]) {
									l = e
									break
								}
							;(this.atSearchText = n.substring(a + 1, l).trim()),
								this.rooCodeAtIng || this.showRooCodePanel(e)
						}
					},
					onBlur(e) {
						this.updateRange()
					},
					onMousedown() {
						this.atIng && (this.$refs.atBox.close(), (this.atIng = !1)),
							this.rooCodeAtIng && (this.$refs.rooCodePanel.close(), (this.rooCodeAtIng = !1))
					},
					showRooCodePanel(e) {
						this.rooCodeAtIng = !0
						let t = window.getSelection(),
							s = t.getRangeAt(0),
							i = s.getBoundingClientRect()
						if (!i || i.x <= 0 || i.y <= 0 || 0 === i.width || 0 === i.height) {
							const e = this.$refs.content
							if (e) {
								const t = e.getBoundingClientRect()
								i = { x: t.left + 20, y: t.top }
							} else i = { x: 100, y: 100 }
						}
						this.$refs.rooCodePanel.open(
							{ x: i.x, y: i.y },
							this.onRooCodeSelect.bind(this),
							null,
							this.atSearchText,
						),
							this.updateRange()
					},
					onRooCodeMentionClick(e, t) {
						const s = t.getBoundingClientRect(),
							i = { x: s.left, y: s.top }
						this.$refs.rooCodePanel.open(
							i,
							(s) => {
								if (s && e && s.item && e.item) {
									const i = s.item.id || s.item.slug || s.item.userId,
										o = e.item.id || e.item.slug || e.item.userId
									i !== o && this.replaceRooCodeMention(t, s)
								}
							},
							e,
						)
					},
					replaceRooCodeMention(e, t) {
						let s = document.createElement("SPAN")
						;(s.className = "roocode-mention"),
							(s.dataset.type = t.type),
							(s.dataset.itemId = t.item.id || t.item.slug || t.item.userId),
							(s.dataset.itemData = JSON.stringify(t)),
							(s.contentEditable = "false"),
							(s.innerText = t.displayText),
							(s.style.cursor = "pointer"),
							s.addEventListener("click", (e) => {
								e.preventDefault(), e.stopPropagation(), this.onRooCodeMentionClick(t, s)
							}),
							e.parentNode.replaceChild(s, e)
						const i = document.createRange(),
							o = window.getSelection()
						i.setStartAfter(s), i.collapse(!0), o.removeAllRanges(), o.addRange(i)
					},
					onRooCodeSelect(e) {
						this.rooCodeAtIng = !1
						let t,
							s = this.blurRange,
							i = s.endContainer
						if (i && i.data && "string" === typeof i.data) {
							let e = i.data.indexOf("@")
							if (e >= 0) {
								let t = e + 1
								s.setStart(s.endContainer, e),
									s.setEnd(s.endContainer, t),
									s.deleteContents(),
									s.collapse()
							}
						} else
							try {
								s.deleteContents(), s.collapse()
							} catch (n) {}
						this.focus(),
							"members" === e.type
								? ((t = document.createElement("SPAN")),
									(t.className = "chat-at-user"),
									(t.dataset.id = e.item.userId),
									(t.contentEditable = "false"),
									(t.innerText = e.displayText))
								: ((t = document.createElement("SPAN")),
									(t.className = "roocode-mention"),
									(t.dataset.type = e.type),
									(t.dataset.itemId = e.item.id || e.item.slug || e.item.userId),
									(t.dataset.itemData = JSON.stringify(e)),
									(t.contentEditable = "false"),
									(t.innerText = e.displayText),
									(t.style.cursor = "pointer"),
									t.addEventListener("click", (s) => {
										s.preventDefault(), s.stopPropagation(), this.onRooCodeMentionClick(e, t)
									})),
							s.insertNode(t),
							s.collapse()
						let o = document.createTextNode(" ")
						s.insertNode(o), s.collapse(), this.selectElement(o, 1)
					},
					insertEmoji(e) {
						let t = document.createElement("img")
						;(t.className = "emoji-normal no-text"),
							(t.dataset.emojiCode = e),
							(t.src = this.$emo.textToUrl(e))
						let s = this.blurRange
						s || (this.focus(), this.updateRange(), (s = this.blurRange)),
							(s.startContainer === s.endContainer && s.startOffset === s.endOffset) ||
								s.deleteContents(),
							s.insertNode(t),
							s.collapse()
						let i = document.createTextNode(" ")
						s.insertNode(i), s.collapse(), this.selectElement(i), this.updateRange(), (this.isEmpty = !1)
					},
					generateId() {
						return this.currentId++
					},
					createFile(e) {
						let t = e.file,
							s = e.fileId,
							i = document.createElement("div")
						;(i.className = "chat-file-container no-text"),
							(i.contentEditable = "false"),
							(i.dataset.fileId = s)
						let o = document.createElement("div")
						;(o.className = "file-position-left"), i.appendChild(o)
						let n = document.createElement("div")
						;(n.className = "el-icon-document"), o.appendChild(n)
						let a = document.createElement("div")
						;(a.className = "file-position-right"), i.appendChild(a)
						let r = document.createElement("div")
						;(r.className = "file-name"), (r.innerText = t.name)
						let l = document.createElement("div")
						return (
							(l.className = "file-size"),
							(l.innerText = this.sizeConvert(t.size)),
							a.appendChild(r),
							a.appendChild(l),
							i
						)
					},
					sizeConvert(e) {
						return e < 1024
							? e + "B"
							: e < 1048576
								? (e / 1024).toFixed(2) + "KB"
								: e < 1073741824
									? (e / 1024 / 1024).toFixed(2) + "MB"
									: (e / 1024 / 1024 / 1024).toFixed(2) + "GB"
					},
					updateRange() {
						let e = window.getSelection()
						this.blurRange = e.getRangeAt(0)
					},
					newLine() {
						let e = window.getSelection(),
							t = e.getRangeAt(0),
							s = document.createElement("div"),
							i = t.endContainer,
							o = i.parentElement
						return (
							o.parentElement === this.$refs.content
								? (this.safeSetInnerHTML(s, i.textContent.substring(t.endOffset).trim()),
									(i.textContent = i.textContent.substring(0, t.endOffset)),
									o.insertAdjacentElement("afterend", s))
								: (this.safeSetInnerHTML(s, ""), this.$refs.content.append(s)),
							s
						)
					},
					clear() {
						this.empty(), (this.imageList = []), (this.fileList = [])
					},
					empty() {
						this.safeSetInnerHTML(this.$refs.content, "")
						let e = document.createElement("div")
						this.safeSetInnerHTML(e, ""), this.$refs.content.append(e)
						let t = document.createTextNode(" ")
						e.appendChild(t), this.$nextTick(() => this.selectElement(t))
					},
					showAtBox(e) {
						this.atIng = !0
						let t = window.getSelection(),
							s = t.getRangeAt(0),
							i = s.getBoundingClientRect()
						this.$refs.atBox.open({ x: i.x, y: i.y }), this.updateRange()
					},
					html2Escape(e) {
						return e.replace(/[<>&"]/g, function (e) {
							return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[e]
						})
					},
					submit() {
						console.log("[ChatInput] 📤 开始提交消息...")
						let e = this.$refs.content.childNodes,
							t = [],
							s = "",
							i = [],
							o = (e) => {
								for (let a = 0; a < e.length; a++) {
									let r = e[a]
									if (!r) continue
									if (3 === r.nodeType) {
										s += this.html2Escape(r.textContent)
										continue
									}
									let l = r.nodeName.toLowerCase()
									if ("script" === l) continue
									let c = s.trim()
									if ("img" === l) {
										let e = r.dataset.imgId
										if (e)
											c &&
												(t.push({ type: "text", content: c, atUserIds: [...i] }),
												(s = ""),
												(i = [])),
												t.push({ type: "image", content: this.imageList[e] })
										else {
											let e = r.dataset.emojiCode
											s += e
										}
									} else if ("div" === l) {
										let e = r.dataset.fileId
										e
											? (c &&
													(t.push({ type: "text", content: c, atUserIds: [...i] }),
													(s = ""),
													(i = [])),
												t.push({ type: "file", content: this.fileList[e] }))
											: ((s += "\n"), o(r.childNodes))
									} else if ("span" === l)
										if (r.classList && r.classList.contains("chat-at-user"))
											(s += r.innerText || r.textContent), r.dataset.id && i.push(r.dataset.id)
										else if (r.classList && r.classList.contains("roocode-mention"))
											if (r.dataset.itemData)
												try {
													const e = JSON.parse(r.dataset.itemData)
													e.displayText
														? ((s += e.displayText),
															console.log("[ChatInput] 使用包含零宽编码的displayText:", {
																visible: r.innerText,
																fullLength: e.displayText.length,
															}))
														: (s += r.innerText || r.textContent)
												} catch (n) {
													console.error("[ChatInput] 解析itemData失败:", n),
														(s += r.innerText || r.textContent)
												}
											else s += r.innerText || r.textContent
										else r.outerHTML && (s += r.outerHTML)
								}
							}
						o(e)
						let n = s.trim()
						"" !== n && t.push({ type: "text", content: n, atUserIds: [...i] }),
							console.log("[ChatInput] 📦 构建的消息列表:", {
								count: t.length,
								items: t.map((e) => ({
									type: e.type,
									contentLength: "string" === typeof e.content ? e.content.length : "object",
									hasAtUsers: e.atUserIds && e.atUserIds.length > 0,
								})),
							}),
							0 !== t.length
								? (console.log(`[ChatInput] ✅ [${new Date().toISOString()}] 触发submit事件`),
									this.$emit("submit", t),
									console.log(
										`[ChatInput] 🧹 [${new Date().toISOString()}] 清空输入框和任务续问状态`,
									),
									this.empty(),
									(this.isEmpty = !0),
									(this.taskContinuation = null),
									(this.isContinuationActive = !1))
								: console.warn("[ChatInput] ⚠️ 没有内容可以发送")
					},
					focus() {
						this.$refs.content.focus()
					},
					handleDroppedFiles(e) {
						if (!e || 0 === e.length) return
						const t = []
						for (let s = 0; s < e.length; s++) {
							const i = e[s],
								o = 524288e3
							if (i.size > o) this.$message.error(`文件 "${i.name}" 超过100MB大小限制`)
							else if (
								(console.log("处理文件:", i.name, "类型:", i.type, "大小:", this.sizeConvert(i.size)),
								this.isImageFile(i))
							) {
								const e = { fileId: this.generateId(), file: i, url: URL.createObjectURL(i) }
								;(this.imageList[e.fileId] = e), t.push({ type: "image", content: e })
							} else {
								const e = { fileId: this.generateId(), file: i }
								;(this.fileList[e.fileId] = e), t.push({ type: "file", content: e })
							}
						}
						if (t.length > 0) {
							console.log("自动发送拖拽文件:", t), this.$emit("submit", t)
							const e = t.length,
								s = t.filter((e) => "image" === e.type).length,
								i = t.filter((e) => "file" === e.type).length
							let o = `已发送${e}个文件`
							s > 0 && i > 0
								? (o = `已发送${s}张图片和${i}个文档`)
								: s > 0
									? (o = `已发送${s}张图片`)
									: i > 0 && (o = `已发送${i}个文档`),
								this.$message.success(o)
						} else this.$message.warning("没有有效的文件可以发送")
					},
					isImageFile(e) {
						const t = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp", "image/webp"]
						return t.includes(e.type) || /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(e.name)
					},
					setTaskContinuation(e) {
						console.log(`[ChatInput] 🎯 [${new Date().toISOString()}] 设置任务续问:`, e),
							(this.taskContinuation = e),
							(this.isContinuationActive = !0),
							this.fillTaskMention(e)
					},
					fillTaskMention(e) {
						const t = this.$refs.content
						if (!t) return
						this.empty()
						const { MentionHelper: i, ZeroWidthEncoder: o } = s("7dac"),
							n = o.cleanText(e.name),
							a = this.$store.getters.getCurrentTerminal ? this.$store.getters.getCurrentTerminal() : 0,
							r = this.$store.state.activeChat
						let l = r ? r.targetId : null
						if (!l && r && r.isTerminalChat) {
							var c
							const e =
									null === (c = this.$store.state.userStore.userInfo) || void 0 === c ? void 0 : c.id,
								t = r.senderTerminal
							e && void 0 !== t && (l = `${e}_${t}`)
						}
						const d = r ? r.type : "PRIVATE",
							h = i.createTaskMention(n, e.id, l, d, a)
						console.log("[ChatInput] fillTaskMention 生成新的零宽编码:", {
							cleanTaskName: n,
							taskId: e.id,
							targetId: l,
							chatType: d,
							senderTerminal: a,
							displayTextLength: h.length,
							hasZeroWidth: h.length > h.replace(/[\u200B-\u200D\u2060-\u2069\u180E\uFEFF]/g, "").length,
						})
						const u = { type: "task", item: { id: e.id, name: e.name }, displayText: h },
							m = document.createElement("SPAN")
						;(m.className = "roocode-mention"),
							(m.dataset.type = u.type),
							(m.dataset.itemId = u.item.id),
							(m.dataset.itemData = JSON.stringify(u)),
							(m.contentEditable = "false"),
							(m.innerText = h),
							(m.style.cursor = "pointer"),
							m.addEventListener("click", (e) => {
								e.preventDefault(), e.stopPropagation(), this.onRooCodeMentionClick(u, m)
							})
						const g = t.querySelector("div") || t
						g.appendChild(m)
						const p = document.createTextNode(" ")
						g.appendChild(p),
							t.setAttribute("data-placeholder", "继续提问..."),
							this.$nextTick(() => {
								t.focus()
								const e = document.createRange(),
									s = window.getSelection()
								e.setStartAfter(p), e.collapse(!0), s.removeAllRanges(), s.addRange(e)
							}),
							(this.isEmpty = !1),
							this.onEditorInput(),
							console.log("[ChatInput] 任务续问已设置完成（使用正确的DOM元素）")
					},
					setCursorToEnd(e) {
						const t = document.createRange(),
							s = window.getSelection()
						t.selectNodeContents(e), t.collapse(!1), s.removeAllRanges(), s.addRange(t)
					},
				},
			},
			C = v,
			I = (s("c6b7"), Object(h["a"])(C, i, o, !1, null, null, null))
		t["a"] = I.exports
	},
	fcb9: function (e, t, s) {},
	fd31: function (e, t, s) {},
	fd6e: function (e, t, s) {
		e.exports = s.p + "img/18.c47c412d.gif"
	},
	ff36: function (e, t, s) {
		"use strict"
		var i = function () {
				var e = this,
					t = e._self._c
				return t(
					"div",
					{
						staticClass: "friend-item",
						class: e.active ? "active" : "",
						on: {
							contextmenu: function (t) {
								return t.preventDefault(), e.showRightMenu(t)
							},
							dblclick: e.onDoubleClick,
						},
					},
					[
						t(
							"div",
							{ staticClass: "friend-avatar" },
							[
								t("head-image", {
									attrs: {
										size: 42,
										name: e.friend.nickName,
										url: e.friend.headImage,
										online: e.friend.online,
									},
								}),
							],
							1,
						),
						t("div", { staticClass: "friend-info" }, [
							t("div", { staticClass: "friend-name" }, [e._v(e._s(e.friend.nickName))]),
							t("div", { staticClass: "friend-online" }, [
								t(
									"i",
									{
										directives: [
											{
												name: "show",
												rawName: "v-show",
												value: e.friend.onlineWeb,
												expression: "friend.onlineWeb",
											},
										],
										staticClass: "el-icon-monitor online",
										attrs: { title: "电脑设备在线" },
									},
									[t("span", { staticClass: "online-icon" })],
								),
								t(
									"i",
									{
										directives: [
											{
												name: "show",
												rawName: "v-show",
												value: e.friend.onlineApp,
												expression: "friend.onlineApp",
											},
										],
										staticClass: "el-icon-mobile-phone online",
										attrs: { title: "移动设备在线" },
									},
									[t("span", { staticClass: "online-icon" })],
								),
							]),
						]),
						t("right-menu", {
							directives: [
								{
									name: "show",
									rawName: "v-show",
									value: e.menu && e.rightMenu.show,
									expression: "menu && rightMenu.show",
								},
							],
							attrs: { pos: e.rightMenu.pos, items: e.rightMenu.items },
							on: {
								close: function (t) {
									e.rightMenu.show = !1
								},
								select: e.onSelectMenu,
							},
						}),
						e._t("default"),
					],
					2,
				)
			},
			o = [],
			n = s("4036"),
			a = s("3f51"),
			r = {
				name: "frinedItem",
				components: { HeadImage: n["a"], RightMenu: a["a"] },
				data() {
					return {
						rightMenu: {
							show: !1,
							pos: { x: 0, y: 0 },
							items: [
								{ key: "CHAT", name: "发送消息", icon: "el-icon-chat-dot-round" },
								{ key: "DELETE", name: "删除好友", icon: "el-icon-delete" },
							],
						},
					}
				},
				methods: {
					showRightMenu(e) {
						;(this.rightMenu.pos = { x: e.x, y: e.y }), (this.rightMenu.show = "true")
					},
					onSelectMenu(e) {
						this.$emit(e.key.toLowerCase(), this.friend)
					},
					onDoubleClick() {
						this.$emit("chat", this.friend)
					},
				},
				props: { active: { type: Boolean }, friend: { type: Object }, menu: { type: Boolean, default: !0 } },
			},
			l = r,
			c = (s("2a24"), s("2877")),
			d = Object(c["a"])(l, i, o, !1, null, null, null)
		t["a"] = d.exports
	},
})
//# sourceMappingURL=main.f09f91b7.js.map
