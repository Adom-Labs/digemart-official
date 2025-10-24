# Store Authentication Context Implementation

## Problem Statement

When users authenticate via Google OAuth from a store page, they get redirected to the backend OAuth endpoint and then back to a callback page. Unlike wallet and email authentication which happen client-side, Google OAuth loses the store context during the server-side redirect flow.

## Solution Overview

We implemented a localStorage-based solution to track store context during OAuth flows:

1. **Store Context Tracking**: Before OAuth redirect, store the current store information in localStorage
2. **Context Retrieval**: After OAuth callback, check for stored context and redirect appropriately
3. **Context Cleanup**: Clear context after successful use or expiration

## Implementation Details

### 1. Store Context Utilities (`/lib/utils/store-auth-context.ts`)

```typescript
interface StoreAuthContext {
  storeSubdomain: string;
  storeName: string;
  redirectUrl?: string;
  timestamp: number;
}
```

**Key Functions:**

- `setStoreAuthContext()` - Store context before OAuth redirect
- `getStoreAuthContext()` - Retrieve context after OAuth callback
- `clearStoreAuthContext()` - Clean up context
- `getStoreRedirectUrl()` - Get appropriate redirect URL

**Features:**

- **Expiration**: Context expires after 10 minutes to prevent stale data
- **Error Handling**: Graceful handling of corrupted localStorage data
- **Type Safety**: Full TypeScript support

### 2. Enhanced StoreAuthModal

**Before Google OAuth:**

```typescript
const handleGoogleSignIn = async () => {
  // Store context before redirect
  setStoreAuthContext({
    storeSubdomain: store.subdomain || store.storeSlug,
    storeName: store.storeName,
    redirectUrl: redirectUrl || window.location.href,
  });

  // Proceed with OAuth redirect
  window.location.href = `${backendUrl}/auth/google?callbackUrl=${encodedCallbackUrl}`;
};
```

### 3. Enhanced Auth Callback Page

**After OAuth return:**

```typescript
// Check for store context
const storeContext = getStoreAuthContext();
let callbackUrl =
  searchParams.get("callbackUrl") || ROUTES.FINDYOURPLUG_DASHBOARD;

// Redirect to store if context exists
if (storeContext) {
  callbackUrl = getStoreRedirectUrl(callbackUrl);
  clearStoreAuthContext(); // Clean up
}
```

## User Flow

### Google OAuth from Store Page

1. **User clicks "Google" button** on store auth modal
2. **Store context is saved** to localStorage with store info
3. **User redirects** to backend Google OAuth endpoint
4. **Google OAuth completes** and redirects to `/auth/callback`
5. **Callback page checks** for store context in localStorage
6. **User redirects** back to the original store page
7. **Context is cleared** from localStorage

### Visual Feedback

- **Loading state** shows store name when redirecting back
- **Error handling** includes store-specific error messages
- **Debug logging** in development mode for troubleshooting

## Development & Testing

### Debug Utilities

```typescript
// Available in browser console (development only)
debugStoreAuth.logContext(); // Log current context
debugStoreAuth.setTestContext(); // Set test context
debugStoreAuth.clearContext(); // Clear context
debugStoreAuth.hasContext(); // Check if context exists
```

### Test Component

Use `<StoreAuthTest />` component in development to:

- View current context state
- Set test contexts
- Simulate OAuth flows
- Clear contexts manually

### Console Logging

Development mode includes detailed logging:

- `🏪 Setting store auth context before Google OAuth`
- `🔄 Auth callback - Store context found`
- `🏪 Auth callback - Redirecting to store`

## Security Considerations

1. **Expiration**: Context expires after 10 minutes
2. **Client-side only**: No sensitive data stored
3. **Cleanup**: Context cleared after use
4. **Error handling**: Graceful degradation if localStorage fails

## Browser Compatibility

- **localStorage**: Supported in all modern browsers
- **Fallback**: Graceful degradation if localStorage unavailable
- **SSR safe**: All localStorage operations are client-side only

## Edge Cases Handled

1. **Expired context**: Automatically cleared and ignored
2. **Corrupted data**: JSON parsing errors handled gracefully
3. **Missing context**: Falls back to default redirect behavior
4. **Multiple tabs**: Each tab maintains its own context
5. **Browser refresh**: Context persists across page refreshes

## Testing Scenarios

### Manual Testing

1. **Happy Path**:

   - Open store page → Click Google auth → Complete OAuth → Verify redirect to store

2. **Context Expiration**:

   - Set context → Wait 10+ minutes → Verify context cleared

3. **Error Handling**:

   - Corrupt localStorage data → Verify graceful fallback

4. **Multiple Stores**:
   - Test context switching between different stores

### Automated Testing

```typescript
// Example test cases
describe("Store Auth Context", () => {
  it("should set and retrieve context correctly");
  it("should expire context after 10 minutes");
  it("should handle corrupted localStorage data");
  it("should clear context after use");
});
```

## Future Enhancements

1. **Analytics**: Track OAuth success/failure rates per store
2. **A/B Testing**: Test different redirect strategies
3. **Performance**: Optimize localStorage operations
4. **Monitoring**: Add error reporting for failed OAuth flows

## Troubleshooting

### Common Issues

1. **Context not found**: Check localStorage key `digemart_store_auth_context`
2. **Wrong redirect**: Verify store subdomain/slug mapping
3. **Expired context**: Check timestamp in stored context
4. **Console errors**: Enable development mode for detailed logging

### Debug Commands

```javascript
// Browser console commands (development only)
localStorage.getItem("digemart_store_auth_context");
debugStoreAuth.logContext();
debugStoreAuth.hasContext();
```
