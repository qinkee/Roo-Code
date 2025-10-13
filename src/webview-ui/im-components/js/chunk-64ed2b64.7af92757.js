;(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
	["chunk-64ed2b64"],
	{
		"5c36": function (e, t, r) {
			"use strict"
			r.r(t)
			var s = function () {
					var e = this,
						t = e._self._c
					return t(
						"el-container",
						{ staticClass: "group-page" },
						[
							t(
								"el-aside",
								{ staticClass: "group-list-box", attrs: { width: "260px" } },
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
										e._l(e.groupValues, function (r, s) {
											return t(
												"div",
												{ key: s },
												[
													t("div", { staticClass: "index-title" }, [
														e._v(e._s(e.groupKeys[s])),
													]),
													e._l(r, function (r) {
														return t(
															"div",
															{ key: r.id },
															[
																t("group-item", {
																	attrs: {
																		group: r,
																		active: r.id == e.activeGroup.id,
																	},
																	nativeOn: {
																		click: function (t) {
																			return e.onActiveItem(r)
																		},
																	},
																}),
															],
															1,
														)
													}),
													s < e.groupValues.length - 1
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
																	attrs: {
																		icon: "el-icon-position",
																		type: "primary",
																	},
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
																		attrs: {
																			disabled: !e.isOwner,
																			maxlength: "20",
																		},
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
																				e.$set(
																					e.activeGroup,
																					"remarkGroupName",
																					t,
																				)
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
																				e.$store.state.userStore.userInfo
																					.nickName,
																		},
																		model: {
																			value: e.activeGroup.remarkNickName,
																			callback: function (t) {
																				e.$set(
																					e.activeGroup,
																					"remarkNickName",
																					t,
																				)
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
																	t("div", { staticClass: "tool-text" }, [
																		e._v("邀请"),
																	]),
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
																					attrs: {
																						title: "选择成员移出群聊",
																					},
																					on: {
																						click: function (t) {
																							return e.onRemove()
																						},
																					},
																				},
																				[
																					t("i", {
																						staticClass: "el-icon-minus",
																					}),
																				],
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
															e._l(e.showMembers, function (r, s) {
																return t(
																	"div",
																	{ key: r.id },
																	[
																		s < e.showMaxIdx
																			? t("group-member", {
																					staticClass: "group-member",
																					attrs: { member: r },
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
				o = [],
				i = (r("14d9"), r("0643"), r("2382"), r("fffc"), r("4e3e"), r("a573"), r("66d8")),
				a = r("1a05"),
				n = r("2859"),
				u = r("b242"),
				l = r("2082"),
				c = r("4036"),
				p = r("4371"),
				m = {
					name: "group",
					components: {
						GroupItem: i["a"],
						GroupMember: n["a"],
						FileUpload: a["a"],
						AddGroupMember: u["a"],
						GroupMemberSelector: l["a"],
						HeadImage: c["a"],
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
								r = { groupId: this.activeGroup.id, userIds: t }
							this.$http({ url: "/group/members/remove", method: "delete", data: r }).then(() => {
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
								this.$http({ url: "/group/delete/" + this.activeGroup.id, method: "delete" }).then(
									() => {
										this.$message.success(`群聊'${this.activeGroup.name}'已解散`),
											this.$store.commit("removeGroup", this.activeGroup.id),
											this.reset()
									},
								)
							})
						},
						onQuit() {
							this.$confirm(
								`确认退出'${this.activeGroup.showGroupName}',并清空聊天记录吗？`,
								"确认退出?",
								{ confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" },
							).then(() => {
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
							this.$store.commit("openChat", e),
								this.$store.commit("activeChat", 0),
								this.$router.push("/home/chat")
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
								r = Object(p["a"])(e, t)
							return r[0]
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
								let r = this.firstLetter(t.showGroupName).toUpperCase()
								this.isEnglish(r) || (r = "#"), e.has(r) ? e.get(r).push(t) : e.set(r, [t])
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
					mounted() {
						let e = this.$refs.scrollbar.$el.querySelector(".el-scrollbar__wrap")
						e.addEventListener("scroll", this.onScroll)
					},
				},
				h = m,
				d = (r("f964"), r("2877")),
				v = Object(d["a"])(h, s, o, !1, null, null, null)
			t["default"] = v.exports
		},
		6432: function (e, t, r) {},
		f964: function (e, t, r) {
			"use strict"
			r("6432")
		},
	},
])
//# sourceMappingURL=chunk-64ed2b64.7af92757.js.map
