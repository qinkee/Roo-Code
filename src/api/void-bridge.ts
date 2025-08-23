import * as vscode from "vscode"

/**
 * Bridge for communication between void renderer process and Roo-Code extension
 * This allows void to update globalState with data from __VUE_STORE__
 */
export class VoidBridge {
	/**
	 * Register commands for void to update globalState
	 */
	static register(context: vscode.ExtensionContext) {
		// Command for void to update IM contacts
		const updateImContactsCommand = vscode.commands.registerCommand(
			"roo-code.updateImContacts",
			async (data: { friends: any[]; groups: any[] }) => {
				try {
					console.log("[VoidBridge] Received updateImContacts command with data:", {
						friendsCount: data?.friends?.length || 0,
						groupsCount: data?.groups?.length || 0,
						sampleFriend: data?.friends?.[0],
						sampleGroup: data?.groups?.[0],
					})

					// Update globalState with IM contacts
					const contactsData = {
						friends: data.friends || [],
						groups: data.groups || [],
						lastUpdated: Date.now(),
					}
					
					await context.globalState.update("imContacts", contactsData)

					console.log("[VoidBridge] Successfully updated IM contacts in globalState")
					return { success: true, message: "Contacts updated successfully" }
				} catch (error) {
					console.error("[VoidBridge] Error updating IM contacts:", error)
					throw error
				}
			},
		)

		context.subscriptions.push(updateImContactsCommand)

		// Command to get current IM contacts (for debugging)
		const getImContactsCommand = vscode.commands.registerCommand("roo-code.getImContacts", async () => {
			const imContacts = context.globalState.get("imContacts")
			console.log("Current IM contacts in globalState:", imContacts)
			return imContacts
		})

		context.subscriptions.push(getImContactsCommand)
	}
}
