;(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
	["chunk-e3523218"],
	{
		"63b9": function (e, t, i) {
			"use strict"
			i.r(t)
			var s = function () {
					var e = this,
						t = e._self._c
					return t(
						"el-container",
						{ staticClass: "friend-page" },
						[
							t(
								"el-aside",
								{ staticClass: "friend-list-box", attrs: { width: "260px" } },
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
										e._l(e.friendValues, function (i, s) {
											return t(
												"div",
												{ key: s },
												[
													t("div", { staticClass: "index-title" }, [
														e._v(e._s(e.friendKeys[s])),
													]),
													e._l(i, function (i) {
														return t(
															"div",
															{ key: i.id },
															[
																t("friend-item", {
																	attrs: {
																		friend: i,
																		active: i.id === e.activeFriend.id,
																	},
																	on: {
																		chat: function (t) {
																			return e.onSendMessage(i)
																		},
																		delete: function (t) {
																			return e.onDelFriend(i)
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
													s < e.friendValues.length - 1
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
																	attrs: {
																		icon: "el-icon-position",
																		type: "primary",
																	},
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
				n = [],
				r = (i("14d9"), i("0643"), i("4e3e"), i("a573"), i("ff36")),
				a = i("5e7c"),
				o = i("4036"),
				d = i("4371"),
				l = {
					name: "friend",
					components: { FriendItem: r["a"], AddFriend: a["a"], HeadImage: o["a"] },
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
							console.log("hahahha"), (this.activeFriend = e), this.loadUserInfo(e.id)
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
							let t = {
								type: "PRIVATE",
								targetId: e.id,
								showName: e.nickName,
								headImage: e.headImageThumb,
							}
							this.$store.commit("openChat", t),
								this.$store.commit("activeChat", 0),
								this.$router.push("/home/chat")
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
								i = Object(d["a"])(e, t)
							return i[0]
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
								let i = this.firstLetter(t.nickName).toUpperCase()
								this.isEnglish(i) || (i = "#"),
									t.online && (i = "在线"),
									e.has(i) ? e.get(i).push(t) : e.set(i, [t])
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
				},
				c = l,
				h = (i("e8aa"), i("2877")),
				u = Object(h["a"])(c, s, n, !1, null, null, null)
			t["default"] = u.exports
		},
		d8a6e: function (e, t, i) {},
		e8aa: function (e, t, i) {
			"use strict"
			i("d8a6e")
		},
	},
])
//# sourceMappingURL=chunk-e3523218.c5e08883.js.map
