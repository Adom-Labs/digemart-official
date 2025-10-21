'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SettingsCard } from './SettingsCard';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useChangePassword } from '@/lib/api/hooks';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';
import { useSession } from 'next-auth/react';

const passwordSchema = z
    .object({
        currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
        newPassword: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function SecuritySettings() {
    const { data: session } = useSession();
    const changePassword = useChangePassword();

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: PasswordFormValues) => {
        try {
            const response = await changePassword.mutateAsync(data);
            const successMessage =
                (response as { message?: string })?.message || 'Password changed successfully';
            toast.success(successMessage);
            form.reset();
        } catch (error: unknown) {
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to change password';
            toast.error(errorMessage);
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <SettingsCard
                title="Email Verification"
                description="Verify your email address"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">{session?.user?.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Your primary email address
                        </p>
                    </div>
                    <VerificationBadge isVerified={true} />
                </div>
            </SettingsCard>

            <SettingsCard
                title="Change Password"
                description="Update your password to keep your account secure"
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={changePassword.isPending}>
                            {changePassword.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Change Password
                        </Button>
                    </form>
                </Form>
            </SettingsCard>
        </div>
    );
}
