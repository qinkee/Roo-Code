# Default API Configuration

## Overview
Roo Code has been configured to use **OpenAI Compatible** as the default API Provider with a pre-configured base URL. This ensures users can quickly get started without complex initial setup.

## Default Settings

When Roo Code is first installed or when no API configuration exists, it automatically sets the following defaults:

| Setting | Default Value |
|---------|--------------|
| **API Provider** | OpenAI Compatible (`openai`) |
| **Base URL** | `https://one.api.mysql.service.thinkgs.cn/v1` |
| **Default Model** | `gpt-4o` |
| **API Key** | (Empty - needs to be provided by user or external integration) |

## Implementation Details

### Location of Default Configuration

#### 1. Initial State Configuration
The default configuration is set in `webview-ui/src/context/ExtensionStateContext.tsx`:

```typescript
const [state, setState] = useState<ExtensionState>({
    // ... other default settings
    apiConfiguration: {
        apiProvider: "openai",
        openAiBaseUrl: "https://one.api.mysql.service.thinkgs.cn/v1",
        openAiModelId: "gpt-4o"
    },
})
```

#### 2. Selected Model Hook Default
In `webview-ui/src/components/ui/hooks/useSelectedModel.ts`:

```typescript
export const useSelectedModel = (apiConfiguration?: ProviderSettings) => {
    const provider = apiConfiguration?.apiProvider || "openai"  // Default to OpenAI Compatible
    // ...
    // When no configuration exists, return OpenAI defaults
    : { id: "gpt-4o", info: openAiModelInfoSaneDefaults }
}
```

This ensures that even if there's no configuration, the UI will default to OpenAI Compatible provider.

### How It Works

1. **Initial Load**: When the extension loads for the first time, the default configuration is automatically applied
2. **Welcome Screen**: The Welcome screen will show the OpenAI Compatible provider pre-selected
3. **Base URL**: The Base URL field is pre-filled with the default endpoint
4. **Model Selection**: The default model `gpt-4o` is pre-selected

## User Experience

### First Time Setup
1. User installs Roo Code extension
2. On first launch, the Welcome screen appears
3. OpenAI Compatible is already selected as the provider
4. Base URL is pre-filled with `https://one.api.mysql.service.thinkgs.cn/v1`
5. User only needs to:
   - Enter their API Key
   - Click "Let's go!" button

### External Integration
When an external extension sends an API token via the `roo-cline.receiveUserInfo` command:
1. The token is automatically set as the API Key
2. The configuration is auto-submitted
3. User doesn't need to interact with the Welcome screen at all

## Benefits

1. **Reduced Friction**: Users don't need to manually select provider or enter base URL
2. **Quick Start**: Faster onboarding process for new users
3. **Consistent Experience**: All users start with the same default configuration
4. **Integration Ready**: Works seamlessly with external token providers

## Customization

Users can still change these defaults:
- Select a different API Provider from the dropdown
- Modify the Base URL if needed
- Choose a different model
- Switch to other providers like Anthropic, OpenRouter, etc.

## Testing

To verify the default configuration:
1. Clear all VS Code extension storage for Roo Code
2. Restart VS Code
3. Open Roo Code extension
4. Verify that:
   - OpenAI Compatible is selected
   - Base URL shows `https://one.api.mysql.service.thinkgs.cn/v1`
   - Model shows `gpt-4o`

## Related Documentation

- [Token Key Integration](TOKEN_KEY_INTEGRATION.md) - How external extensions can provide API tokens
- [User Info Integration](USER_INFO_INTEGRATION.md) - General user information integration guide