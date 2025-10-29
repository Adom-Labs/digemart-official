'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateStore, Store } from '@/lib/api/hooks/stores';
import { toast } from 'react-hot-toast';

interface LocationTabProps {
  store: Store;
}

export function LocationTab({ store }: LocationTabProps) {
  const [formData, setFormData] = useState({
    storeAddress: store.storeAddress,
    storeLocationCity: store.storeLocationCity,
    storeLocationState: store.storeLocationState,
    storeTimeOpen: store.storeTimeOpen || '09:00',
    storeTimeClose: store.storeTimeClose || '18:00',
    storeWeekOpen: store.storeWeekOpen || 'Monday',
    storeWeekClose: store.storeWeekClose || 'Saturday',
  });

  const [hasChanges, setHasChanges] = useState(false);
  const updateStoreMutation = useUpdateStore();

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Track changes
  useEffect(() => {
    const hasFormChanges = 
      formData.storeAddress !== store.storeAddress ||
      formData.storeLocationCity !== store.storeLocationCity ||
      formData.storeLocationState !== store.storeLocationState ||
      formData.storeTimeOpen !== (store.storeTimeOpen || '09:00') ||
      formData.storeTimeClose !== (store.storeTimeClose || '18:00') ||
      formData.storeWeekOpen !== (store.storeWeekOpen || 'Monday') ||
      formData.storeWeekClose !== (store.storeWeekClose || 'Saturday');
    
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
          storeAddress: formData.storeAddress,
          storeLocationCity: formData.storeLocationCity,
          storeLocationState: formData.storeLocationState,
          storeTimeOpen: formData.storeTimeOpen,
          storeTimeClose: formData.storeTimeClose,
          storeWeekOpen: formData.storeWeekOpen,
          storeWeekClose: formData.storeWeekClose,
        }
      });
      
      toast.success('Location information updated successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update store location:', error);
      toast.error('Failed to update location information');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Business Address *</Label>
            <Input
              id="address"
              value={formData.storeAddress}
              onChange={(e) => handleInputChange('storeAddress', e.target.value)}
              placeholder="123 Main Street"
              className="mt-1.5"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.storeLocationCity}
                onChange={(e) => handleInputChange('storeLocationCity', e.target.value)}
                placeholder="New York"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State/Province *</Label>
              <Input
                id="state"
                value={formData.storeLocationState}
                onChange={(e) => handleInputChange('storeLocationState', e.target.value)}
                placeholder="NY"
                className="mt-1.5"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeOpen">Opening Time</Label>
              <Input
                id="timeOpen"
                type="time"
                value={formData.storeTimeOpen}
                onChange={(e) => handleInputChange('storeTimeOpen', e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="timeClose">Closing Time</Label>
              <Input
                id="timeClose"
                type="time"
                value={formData.storeTimeClose}
                onChange={(e) => handleInputChange('storeTimeClose', e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weekOpen">Open From</Label>
              <Select 
                value={formData.storeWeekOpen} 
                onValueChange={(value) => handleInputChange('storeWeekOpen', value)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {weekDays.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="weekClose">Open Until</Label>
              <Select 
                value={formData.storeWeekClose} 
                onValueChange={(value) => handleInputChange('storeWeekClose', value)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {weekDays.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Current Hours:</strong> {formData.storeWeekOpen} - {formData.storeWeekClose}, {formData.storeTimeOpen} - {formData.storeTimeClose}
            </p>
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