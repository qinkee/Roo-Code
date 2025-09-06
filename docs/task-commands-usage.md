# Task Commands Usage Guide

## Overview

Two new commands have been added to Roo-Code for improved task management:

1. `roo-cline.executeTask` - Create new tasks or continue existing ones
2. `roo-cline.executeTaskWithMode` - Create tasks with specific mode presets

## Command: executeTask

### Create a New Task

```javascript
// Programmatically create a new task
await vscode.commands.executeCommand("roo-cline.executeTask", {
	content: "Implement user authentication system",
})

// Without parameters - will prompt for input
await vscode.commands.executeCommand("roo-cline.executeTask")
```

### Continue an Existing Task

```javascript
// Continue a conversation with an existing task
await vscode.commands.executeCommand("roo-cline.executeTask", {
	taskId: "task-1234567890", // Existing task ID
	content: "Add password validation and error handling",
})
```

## Command: executeTaskWithMode

### Create Task with Specific Mode

```javascript
// Create a task using architecture mode
await vscode.commands.executeCommand("roo-cline.executeTaskWithMode", {
	modeId: "architecture",
	content: "Design microservices architecture for the payment system",
})

// Available built-in modes:
// - 'code' - General programming tasks
// - 'architect' - System design and architecture
// - 'test' - Writing tests
// - And more custom modes you've defined
```

### Interactive Mode Selection

```javascript
// Without parameters - will show mode selector and prompt for task
await vscode.commands.executeCommand("roo-cline.executeTaskWithMode")
```

## Integration Examples

### VSCode Extension Integration

```javascript
// In your extension's activate function
export function activate(context: vscode.ExtensionContext) {
    // Register a command that uses Roo-Code for specific tasks
    const disposable = vscode.commands.registerCommand('myExtension.refactorCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selectedText = editor.document.getText(editor.selection);

            // Use Roo-Code to refactor the selected code
            await vscode.commands.executeCommand('roo-cline.executeTask', {
                content: `Refactor this code for better readability:\n\n${selectedText}`
            });
        }
    });

    context.subscriptions.push(disposable);
}
```

### Workflow Automation

```javascript
// Example: Automated task creation based on Git commits
async function createTaskFromCommit(commitMessage: string) {
    // Parse commit message to determine task type
    if (commitMessage.includes('bug:')) {
        await vscode.commands.executeCommand('roo-cline.executeTaskWithMode', {
            modeId: 'test',
            content: `Fix bug: ${commitMessage}`
        });
    } else if (commitMessage.includes('feature:')) {
        await vscode.commands.executeCommand('roo-cline.executeTaskWithMode', {
            modeId: 'code',
            content: `Implement feature: ${commitMessage}`
        });
    }
}
```

### Task Management System

```javascript
// List and continue tasks
async function manageTask() {
	// Get task history (you need to implement this based on your needs)
	const tasks = await listAvailableTasks()

	// Show quick pick to user
	const selected = await vscode.window.showQuickPick(
		tasks.map((t) => ({
			label: t.label,
			description: t.description,
			taskId: t.id,
		})),
		{ placeHolder: "Select a task to continue" },
	)

	if (selected) {
		const newInstruction = await vscode.window.showInputBox({
			prompt: "What would you like to do next?",
		})

		if (newInstruction) {
			await vscode.commands.executeCommand("roo-cline.executeTask", {
				taskId: selected.taskId,
				content: newInstruction,
			})
		}
	}
}
```

## API Reference

### executeTask Parameters

```typescript
interface TaskExecutionParams {
	taskId?: string // Optional: ID of existing task to continue
	content: string // Required: Task content or continuation message
}
```

### executeTaskWithMode Parameters

```typescript
interface ModeTaskExecutionParams {
	modeId: string // Required: Mode identifier (e.g., 'code', 'architect')
	content: string // Required: Task content
}
```

## Tips

1. Task IDs can be found in the task history
2. Custom modes can be defined in `.roomodes` configuration
3. Mode-specific API configurations are automatically loaded
4. Tasks are automatically saved and can be resumed later
5. Use the task continuation feature for multi-round conversations

## Error Handling

Both commands include error handling and will show appropriate error messages:

- Task not found (when using invalid taskId)
- Mode not found (when using invalid modeId)
- No visible Roo-Code instance

## Best Practices

1. Use specific modes for specialized tasks to get better results
2. Continue existing tasks instead of creating new ones for related work
3. Provide clear and detailed task descriptions
4. Use programmatic task creation for automation workflows
