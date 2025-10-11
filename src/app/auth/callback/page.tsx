"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ROUTES } from "@/lib/routes";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const token = searchParams.get('token');
                const user = searchParams.get('user');
                const callbackUrl = searchParams.get('callbackUrl') || ROUTES.FINDYOURPLUG_DASHBOARD;

                if (!token || !user) {
                    setError('Authentication failed. Missing token or user data.');
                    setLoading(false);
                    return;
                }

                // Parse user data
                const userData = JSON.parse(user);

                // Create a session with the JWT token from backend
                const result = await signIn('credentials', {
                    token,
                    user: JSON.stringify(userData),
                    redirect: false,
                });

                if (result?.error) {
                    setError('Failed to create session. Please try again.');
                    setLoading(false);
                    return;
                }

                // Redirect to the intended destination
                router.replace(callbackUrl);
            } catch (err) {
                console.error('OAuth callback error:', err);
                setError('An error occurred during authentication. Please try again.');
                setLoading(false);
            }
        };

        handleCallback();
    }, [router, searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Completing authentication...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push(ROUTES.LOGIN)}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
