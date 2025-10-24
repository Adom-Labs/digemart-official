/**
 * Test component for store authentication context
 * Only renders in development mode
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getStoreAuthContext,
  setStoreAuthContext,
  clearStoreAuthContext,
  hasStoreAuthContext,
} from "@/lib/utils/store-auth-context";

export function StoreAuthTest() {
  const [context, setContext] = useState<any>(null);
  const [hasContext, setHasContext] = useState(false);

  const refreshContext = () => {
    const currentContext = getStoreAuthContext();
    setContext(currentContext);
    setHasContext(hasStoreAuthContext());
  };

  useEffect(() => {
    refreshContext();
  }, []);

  const handleSetTestContext = () => {
    setStoreAuthContext({
      storeSubdomain: "test-store",
      storeName: "Test Store",
      redirectUrl: "/store/test-store",
    });
    refreshContext();
  };

  const handleClearContext = () => {
    clearStoreAuthContext();
    refreshContext();
  };

  const handleTestGoogleAuth = () => {
    // Simulate Google OAuth flow
    setStoreAuthContext({
      storeSubdomain: "demo-store",
      storeName: "Demo Store",
      redirectUrl: "/store/demo-store",
    });

    // In a real scenario, this would redirect to Google OAuth
    alert("Store context set! Check localStorage and console.");
    refreshContext();
  };

  // Only render in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-lg">🧪 Store Auth Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <p>
            <strong>Has Context:</strong> {hasContext ? "✅ Yes" : "❌ No"}
          </p>
          {context && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
              <pre>{JSON.stringify(context, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleSetTestContext}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Set Test Context
          </Button>

          <Button
            onClick={handleTestGoogleAuth}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Simulate Google Auth
          </Button>

          <Button
            onClick={handleClearContext}
            variant="destructive"
            size="sm"
            className="w-full"
          >
            Clear Context
          </Button>

          <Button
            onClick={refreshContext}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            Refresh
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <p>Open browser console to see debug logs.</p>
          <p>
            Check localStorage key: <code>digemart_store_auth_context</code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
