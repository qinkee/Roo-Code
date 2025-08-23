# Roo-Code Development Guide

## Build and Test Commands

When working on Roo-Code, always run these commands after making changes:

```bash
# Run lint to check code style
npm run lint

# Run type checking
npm run check-types

# Run tests
npm run test
```

## Debugging @联系人 and @知识库 Issues

### Data Flow
1. **VoidBridge** receives `updateImContacts` command and saves to globalState
2. **ChatTextArea** requests contacts via `getImContacts` message
3. **webviewMessageHandler** retrieves from globalState and sends to webview
4. **ChatTextArea** updates `imContacts` state
5. **queryItems** updates via useMemo
6. **ContextMenu** shows submenu based on selectedType

### Key Log Points to Check
- `[VoidBridge] Received updateImContacts` - Data received from void
- `[WebviewMessageHandler] Getting IM contacts` - Data retrieved from storage
- `[ChatTextArea] DATA RECEIVED` - Data received in webview
- `[ChatTextArea] Query items updated` - Query items regenerated
- `[context-mentions] SUBMENU CHECK` - Submenu generation
- `[ContextMenu] Getting options for submenu` - Menu rendering

### Common Issues
- **Race conditions**: Data may not be available when submenu renders
- **State updates**: React async updates may cause timing issues
- **Empty results**: Now shows "Loading..." instead of "No results"

### Testing
1. Check console logs for the data flow
2. Verify data is saved in globalState
3. Ensure periodic updates are working (every 30s)
4. Check that clicking menu triggers fresh data request