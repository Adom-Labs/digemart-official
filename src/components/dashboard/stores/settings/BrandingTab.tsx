'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUpdateStore, Store } from '@/lib/api/hooks/stores';
import { toast } from 'react-hot-toast';
import { ImageUploader } from './ImageUploader';

interface BrandingTabProps {
    store: Store;
}

export function BrandingTab({ store }: BrandingTabProps) {
    const [formData, setFormData] = useState({
        logo: store.logo,
        storeCoverPhoto: store.storeCoverPhoto,
        storeHeroImage: store.storeHeroImage,
    });

    const [hasChanges, setHasChanges] = useState(false);
    const updateStoreMutation = useUpdateStore();

    // Track changes
    useEffect(() => {
        const hasFormChanges =
            formData.logo !== store.logo ||
            formData.storeCoverPhoto !== store.storeCoverPhoto ||
            formData.storeHeroImage !== store.storeHeroImage;

        setHasChanges(hasFormChanges);
    }, [formData, store]);

    const handleImageChange = (field: 'logo' | 'storeCoverPhoto' | 'storeHeroImage', url: string | null) => {
        setFormData((prev) => ({ ...prev, [field]: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!hasChanges) {
            toast('No changes to save');
            return;
        }

        try {
            await updateStoreMutation.mutateAsync({
                id: store.id,
                data: {
                    logo: formData.logo || undefined,
                    storeCoverPhoto: formData.storeCoverPhoto || undefined,
                    storeHeroImage: formData.storeHeroImage || undefined,
                },
            });

            toast.success('Store branding updated successfully');
            setHasChanges(false);
        } catch (error) {
            console.error('Failed to update store:', error);
            toast.error('Failed to update store branding');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Logo */}
            <Card>
                <CardHeader>
                    <CardTitle>Store Logo</CardTitle>
                    <CardDescription>
                        Your brand identity. Used in navigation, store cards, and listings. Square format recommended.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ImageUploader
                        label="Store Logo"
                        description="Recommended: 512x512px"
                        currentImage={formData.logo}
                        onChange={(url) => handleImageChange('logo', url)}
                        aspectRatio="1:1"
                        maxSizeMB={2}
                        folder={`stores/${store.id}/logo`}
                        placeholder="Upload a square logo (1:1 ratio)"
                    />
                </CardContent>
            </Card>

            {/* Cover Photo */}
            <Card>
                <CardHeader>
                    <CardTitle>Cover Photo</CardTitle>
                    <CardDescription>
                        Banner image displayed at the top of your store profile. Wide format for best results.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ImageUploader
                        label="Cover Photo"
                        description="Recommended: 1920x1080px or 2560x1080px"
                        currentImage={formData.storeCoverPhoto}
                        onChange={(url) => handleImageChange('storeCoverPhoto', url)}
                        aspectRatio="21:9"
                        maxSizeMB={5}
                        folder={`stores/${store.id}/cover`}
                        placeholder="Upload a wide banner (21:9 ratio recommended)"
                    />
                </CardContent>
            </Card>

            {/* Hero Image */}
            <Card>
                <CardHeader>
                    <CardTitle>Hero Image</CardTitle>
                    <CardDescription>
                        Featured image on your store homepage hero section. Creates a strong first impression.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ImageUploader
                        label="Hero Image"
                        description="Recommended: 1920x1080px"
                        currentImage={formData.storeHeroImage}
                        onChange={(url) => handleImageChange('storeHeroImage', url)}
                        aspectRatio="16:9"
                        maxSizeMB={5}
                        folder={`stores/${store.id}/hero`}
                        placeholder="Upload a hero image (16:9 ratio)"
                    />
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={!hasChanges || updateStoreMutation.isPending}
                    className="min-w-[120px]"
                >
                    {updateStoreMutation.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
