'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUpdateStore, Store } from '@/lib/api/hooks/stores';
import { toast } from 'react-hot-toast';

interface BasicInfoTabProps {
  store: Store;
}

export function BasicInfoTab({ store }: BasicInfoTabProps) {
  const [formData, setFormData] = useState({
    storeName: store.storeName,
    email: store.email,
    phone: store.phone || '',
    storeDescription: store.storeDescription || '',
    storeType: store.storeType,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const updateStoreMutation = useUpdateStore();

  // Track changes
  useEffect(() => {
    const hasFormChanges = 
      formData.storeName !== store.storeName ||
      formData.email !== store.email ||
      formData.phone !== (store.phone || '') ||
      formData.storeDescription !== (store.storeDescription || '') ||
      formData.storeType !== store.storeType;
    
    setHasChanges(hasFormChanges);
  }, [formData, store]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          storeName: formData.storeName,
          email: formData.email,
          phone: formData.phone || undefined,
          storeDescription: formData.storeDescription || undefined,
          storeType: formData.storeType,
        }
      });
      
      toast.success('Store information updated successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update store:', error);
      toast.error('Failed to update store information');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="storeName">Store Name *</Label>
            <Input
              id="storeName"
              value={formData.storeName}
              onChange={(e) => handleInputChange('storeName', e.target.value)}
              placeholder="My Awesome Store"
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Contact Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contact@mystore.com"
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="description">Store Description</Label>
            <Textarea
              id="description"
              value={formData.storeDescription}
              onChange={(e) => handleInputChange('storeDescription', e.target.value)}
              placeholder="Tell customers about your store..."
              rows={4}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>Store Type</Label>
            <RadioGroup 
              value={formData.storeType} 
              onValueChange={(value) => handleInputChange('storeType', value)}
              className="mt-3"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="INTERNAL" id="internal" />
                <Label htmlFor="internal" className="flex-1 cursor-pointer">
                  <p className="font-medium">Internal Store</p>
                  <p className="text-sm text-gray-600">
                    Fully managed e-commerce store on our platform
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="EXTERNAL" id="external" />
                <Label htmlFor="external" className="flex-1 cursor-pointer">
                  <p className="font-medium">External Store</p>
                  <p className="text-sm text-gray-600">
                    Business listing that links to your existing website
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>
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