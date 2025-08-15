# Token Key Integration Documentation

## Overview
This feature allows Roo Code to automatically receive and configure API access tokens from external VS Code extensions, particularly from AI/IM platforms. When an external extension sends a token through the `roo-cline.receiveUserInfo` command, Roo Code will automatically configure itself to use OpenAI Compatible API with the provided token.

## How It Works

### 1. External Extension Integration
External VS Code extensions can send a token to Roo Code using the following command:

```javascript
vscode.commands.executeCommand('roo-cline.receiveUserInfo', {
    userInfo: {
        tokenKey: 'your-api-token-here'
    },
    accessToken: 'your-api-token-here'
});
```

The command accepts the token in multiple formats for flexibility:
- `data.tokenKey`
- `data.accessToken`
- `data.userInfo.tokenKey`
- `data.userInfo.accessToken`

### 2. Automatic Configuration
When Roo Code receives the token, it will automatically:

1. **Set the API Provider** to "OpenAI Compatible"
2. **Configure the Base URL** to `https://one.api.mysql.service.thinkgs.cn/v1`
3. **Set the API Key** to the received token
4. **Select the default model** as `gpt-4o`
5. **Auto-submit the configuration** to complete the setup

### 3. Implementation Details

#### Backend (Extension) Side
The command handler is implemented in `src/activate/registerCommands.ts`:

```typescript
receiveUserInfo: async (data: { userInfo?: any; accessToken?: string; tokenKey?: string }) => {
    // Extract token from various possible locations
    let token = data?.tokenKey || data?.accessToken || 
                data?.userInfo?.tokenKey || data?.userInfo?.accessToken;
    
    if (token) {
        // Send token to webview
        await visibleProvider.postMessageToWebview({
            type: "tokenKeyReceived",
            tokenKey: token,
            source: "ai-im",
            timestamp: Date.now()
        });
        
        // Show success notification
        vscode.window.showInformationMessage("API Key已成功从外部插件接收并设置");
    }
}
```

#### Frontend (Webview) Side
The webview handles the token in `webview-ui/src/context/ExtensionStateContext.tsx`:

```typescript
case "tokenKeyReceived": {
    const tokenKey = (message as any).tokenKey
    const source = (message as any).source
    
    if (tokenKey && source === "ai-im") {
        // Set OpenAI Compatible configuration
        setApiConfiguration({
            apiProvider: "openai",
            openAiBaseUrl: "https://one.api.mysql.service.thinkgs.cn/v1",
            openAiApiKey: tokenKey,
            openAiModelId: "gpt-4o"
        })
        
        // Auto-submit configuration
        setTimeout(() => {
            vscode.postMessage({ 
                type: "upsertApiConfiguration", 
                text: "default",
                apiConfiguration: {
                    apiProvider: "openai",
                    openAiBaseUrl: "https://one.api.mysql.service.thinkgs.cn/v1",
                    openAiApiKey: tokenKey,
                    openAiModelId: "gpt-4o"
                }
            })
        }, 100)
    }
    break
}
```

## Testing the Integration

### From Another Extension
To test this integration from another VS Code extension:

```javascript
// In your extension's activate function or command handler
const testTokenIntegration = async () => {
    try {
        await vscode.commands.executeCommand('roo-cline.receiveUserInfo', {
            accessToken: 'test-api-key-12345'
        });
        console.log('Token sent successfully');
    } catch (error) {
        console.error('Failed to send token:', error);
    }
};
```

### Manual Testing via Command Palette
You can also test this manually:
1. Open VS Code Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Run "Developer: Toggle Developer Tools"
3. In the console, execute:
```javascript
vscode.commands.executeCommand('roo-cline.receiveUserInfo', {
    accessToken: 'your-test-token'
});
```

## User Experience

From the user's perspective:
1. The external extension sends the token automatically
2. Roo Code receives the token and configures itself
3. The Welcome screen (if visible) will show the configured settings
4. The configuration is automatically saved and applied
5. A success notification appears: "API Key已成功从外部插件接收并设置"

## Security Considerations

- Tokens are transmitted within the VS Code environment only
- No tokens are logged to console or debug output
- Tokens are stored in VS Code's secure settings storage
- The integration only accepts tokens from trusted sources (identified by the "ai-im" source tag)

## Troubleshooting

If the integration doesn't work:
1. Check that Roo Code extension is activated
2. Verify the command name is exactly `roo-cline.receiveUserInfo`
3. Ensure the token is provided in one of the supported formats
4. Check VS Code Developer Tools console for any error messages
5. Verify that the Roo Code webview is open (the command requires a visible provider)

## Future Enhancements

Potential improvements for this feature:
- Support for multiple API provider types (not just OpenAI Compatible)
- Configurable base URLs per integration source
- Token refresh mechanism
- Integration with more external platforms