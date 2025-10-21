'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SettingsCard } from './SettingsCard';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUpdateProfile } from '@/lib/api/hooks';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    state: z.string().optional(),
    lga: z.string().optional(),
    image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    whatsapp: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileSettings() {
    const { data: session } = useSession();
    const updateProfile = useUpdateProfile();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: session?.user?.name || '',
            phone: '',
            address: '',
            state: '',
            lga: '',
            image: '',
            twitter: '',
            facebook: '',
            whatsapp: '',
        },
    });

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            await updateProfile.mutateAsync(data);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
            console.error(error);
        }
    };

    return (
        <SettingsCard
            title="Profile Information"
            description="Update your personal information and contact details"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+234 801 234 5678" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="123 Main Street" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Lagos" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lga"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>LGA</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ikeja" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile Image URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter a URL to your profile image
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">Social Media</h3>

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="twitter"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Twitter Handle</FormLabel>
                                        <FormControl>
                                            <Input placeholder="@johndoe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="facebook"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Facebook Profile</FormLabel>
                                        <FormControl>
                                            <Input placeholder="johndoe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="whatsapp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>WhatsApp Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="2348012345678" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={updateProfile.isPending}>
                        {updateProfile.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Changes
                    </Button>
                </form>
            </Form>
        </SettingsCard>
    );
}
