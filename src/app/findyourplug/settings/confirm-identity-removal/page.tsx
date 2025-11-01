'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useConfirmRemoveIdentity } from '@/lib/api/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmIdentityRemovalPage() {
    const searchParams = useSearchParams();
    const confirmRemove = useConfirmRemoveIdentity();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Invalid confirmation link. No token provided.');
            return;
        }

        // Automatically confirm removal
        confirmRemove.mutateAsync(token)
            .then(() => {
                setStatus('success');
                setMessage('Identity removed successfully!');
            })
            .catch((error: unknown) => {
                setStatus('error');
                const errorMessage =
                    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                    'Failed to remove identity. The link may have expired or already been used.';
                setMessage(errorMessage);
            });
    }, [searchParams, confirmRemove]);

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
                        {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                        Identity Removal
                    </CardTitle>
                    <CardDescription>
                        {status === 'loading' && 'Processing your request...'}
                        {status === 'success' && 'Confirmation Complete'}
                        {status === 'error' && 'Confirmation Failed'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{message}</p>

                    {status === 'success' && (
                        <Button asChild className="w-full">
                            <Link href="/findyourplug/dashboard/settings/accounts">
                                Return to Settings
                            </Link>
                        </Button>
                    )}

                    {status === 'error' && (
                        <div className="space-y-2">
                            <Button asChild className="w-full">
                                <Link href="/findyourplug/dashboard/settings/accounts">
                                    Return to Settings
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="w-full">
                                <Link href="/findyourplug/support">
                                    Contact Support
                                </Link>
                            </Button>
                        </div>
                    )}

                    {status === 'loading' && (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
