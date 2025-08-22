/**
 * Example code for void (VSCode fork) to update IM contacts in Roo-Code extension
 * This should be added to void's renderer process where __VUE_STORE__ is available
 */

// Function to sync IM contacts to Roo-Code extension
async function syncImContactsToRooCode() {
	try {
		// Check if __VUE_STORE__ is available
		if (!window.__VUE_STORE__) {
			console.warn("__VUE_STORE__ not available")
			return
		}

		const store = window.__VUE_STORE__

		// Get friends and groups from Vue store
		const friends = store.state?.friendStore?.friends || []
		const groups = store.state?.groupStore?.groups || []

		// Prepare data for Roo-Code - 直接传递原始数据，保持数据结构一致
		const contactsData = {
			friends: friends, // 直接使用原始数据
			groups: groups, // 直接使用原始数据
		}

		// Execute VSCode command to update Roo-Code's globalState
		if (window.vscode && window.vscode.commands) {
			await window.vscode.commands.executeCommand("roo-code.updateImContacts", contactsData)
			console.log("Successfully synced IM contacts to Roo-Code", {
				friendsCount: contactsData.friends.length,
				groupsCount: contactsData.groups.length,
			})
		} else {
			console.warn("VSCode API not available")
		}
	} catch (error) {
		console.error("Error syncing IM contacts to Roo-Code:", error)
	}
}

// Set up periodic sync (every 30 seconds)
function startImContactsSync() {
	// Initial sync
	syncImContactsToRooCode()

	// Periodic sync
	setInterval(syncImContactsToRooCode, 30000)

	// Also sync when Vue store updates
	if (window.__VUE_STORE__) {
		// Listen for friend list changes
		window.__VUE_STORE__.watch(
			(state) => state.friendStore?.friends,
			() => syncImContactsToRooCode(),
		)

		// Listen for group list changes
		window.__VUE_STORE__.watch(
			(state) => state.groupStore?.groups,
			() => syncImContactsToRooCode(),
		)
	}
}

// Start syncing when the page is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", startImContactsSync)
} else {
	startImContactsSync()
}

// Alternative: Manual sync command for debugging
window.syncImContacts = syncImContactsToRooCode
