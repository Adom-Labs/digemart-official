'use client';

import { SettingsCard } from './SettingsCard';
import { Button } from '@/components/ui/button';
import { IdentityBadge } from './IdentityBadge';
import { VerificationBadge } from './VerificationBadge';
import {
    useUserIdentities,
    useRequestRemoveIdentity,
    useSetPrimaryIdentity,
} from '@/lib/api/hooks';
import { toast } from 'sonner';
import { Loader2, Trash2, CheckCircle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

export function ConnectedAccounts() {
    const { data: identities, isLoading, error } = useUserIdentities();
    const requestRemove = useRequestRemoveIdentity();
    const setPrimary = useSetPrimaryIdentity();
    const [identityToRemove, setIdentityToRemove] = useState<number | null>(null);

    const handleRemoveIdentity = async (identityId: number) => {
        try {
            const response = await requestRemove.mutateAsync(identityId);
            const successMessage =
                (response as { message?: string })?.message ||
                'Confirmation email sent. Please check your email to complete the removal.';
            toast.success(successMessage);
            setIdentityToRemove(null);
        } catch (error: unknown) {
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to remove identity';
            toast.error(errorMessage);
            console.error(error);
        }
    };

    const handleSetPrimary = async (identityId: number) => {
        try {
            const response = await setPrimary.mutateAsync(identityId);
            const successMessage =
                (response as { message?: string })?.message || 'Primary identity updated';
            toast.success(successMessage);
        } catch (error: unknown) {
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to update primary identity';
            toast.error(errorMessage);
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <SettingsCard
                title="Connected Accounts"
                description="Manage your login methods"
            >
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </SettingsCard>
        );
    }

    if (error) {
        return (
            <SettingsCard
                title="Connected Accounts"
                description="Manage your login methods"
            >
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-sm text-destructive mb-2">Failed to load connected accounts</p>
                    <p className="text-xs text-muted-foreground">
                        {(error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                            'An error occurred while fetching your accounts'}
                    </p>
                </div>
            </SettingsCard>
        );
    }

    return (
        <>
            <SettingsCard
                title="Connected Accounts"
                description="Manage your login methods and connected accounts"
            >
                <div className="space-y-4">
                    {identities?.map((identity) => (
                        <div
                            key={identity.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                        >
                            <div className="flex items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <IdentityBadge
                                            provider={identity.provider}
                                            isPrimary={identity.isPrimary}
                                        />
                                        <VerificationBadge isVerified={identity.isVerified} />
                                    </div>
                                    <p className="text-sm font-medium">{identity.email}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Added {new Date(identity.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {!identity.isPrimary && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSetPrimary(identity.id)}
                                        disabled={setPrimary.isPending}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Set Primary
                                    </Button>
                                )}

                                {identity.provider !== 'EMAIL' && !identity.isPrimary && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setIdentityToRemove(identity.id)}
                                        disabled={requestRemove.isPending}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}

                    {(!identities || identities.length === 0) && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <p className="text-sm text-muted-foreground mb-2">
                                No connected accounts found
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Connect accounts to have multiple ways to sign in
                            </p>
                        </div>
                    )}
                </div>
            </SettingsCard>

            <AlertDialog
                open={identityToRemove !== null}
                onOpenChange={() => setIdentityToRemove(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Connected Account?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will receive a confirmation email to complete this action.
                            After removal, you won&apos;t be able to use this method to log in.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                identityToRemove && handleRemoveIdentity(identityToRemove)
                            }
                        >
                            Send Confirmation Email
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
