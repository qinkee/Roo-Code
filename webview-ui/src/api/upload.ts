import axios from "axios"
import { vscode } from "@src/utils/vscode"

// 使用线上IM平台API地址
const API_BASE_URL = "https://aiim.service.thinkgs.cn/api"

/**
 * 获取 accessToken
 */
async function getAccessToken(): Promise<string> {
	return new Promise((resolve, reject) => {
		// 发送消息请求 token
		vscode.postMessage({
			type: "getAccessToken",
		})

		// 监听响应
		const messageHandler = (event: MessageEvent) => {
			const message = event.data
			if (message.type === "accessTokenResponse") {
				window.removeEventListener("message", messageHandler)
				if (message.token) {
					resolve(message.token)
				} else {
					reject(new Error("未获取到访问令牌，请先登录"))
				}
			}
		}

		window.addEventListener("message", messageHandler)

		// 设置超时
		setTimeout(() => {
			window.removeEventListener("message", messageHandler)
			reject(new Error("获取访问令牌超时"))
		}, 5000)
	})
}

/**
 * 上传图片到后端服务器
 * @param file 图片文件
 * @returns 上传成功后的图片URL对象 { originUrl: string, thumbUrl: string }
 */
export async function uploadImage(file: File): Promise<{ originUrl: string; thumbUrl: string }> {
	const formData = new FormData()
	formData.append("file", file)

	// 获取 accessToken
	const token = await getAccessToken()

	try {
		const response = await axios.post(`${API_BASE_URL}/image/upload`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
				accesstoken: token, // 添加认证头（小写）
			},
		})

		// 后端返回格式: { code: number, data: { originUrl: string, thumbUrl: string }, message: string }
		if (response.data && response.data.code === 200) {
			return response.data.data
		} else {
			throw new Error(response.data?.message || "上传失败")
		}
	} catch (error) {
		console.error("Error uploading image:", error)
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.message || error.message || "上传图片失败")
		}
		throw error
	}
}

/**
 * 上传文件到后端服务器
 * @param file 文件
 * @returns 上传成功后的文件URL
 */
export async function uploadFile(file: File): Promise<string> {
	const formData = new FormData()
	formData.append("file", file)

	// 获取 accessToken
	const token = await getAccessToken()

	try {
		const response = await axios.post(`${API_BASE_URL}/file/upload`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
				accesstoken: token, // 添加认证头（小写）
			},
		})

		// 后端返回格式: { code: number, data: string, message: string }
		if (response.data && response.data.code === 200) {
			return response.data.data
		} else {
			throw new Error(response.data?.message || "上传失败")
		}
	} catch (error) {
		console.error("Error uploading file:", error)
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.message || error.message || "上传文件失败")
		}
		throw error
	}
}
