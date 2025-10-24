# Cloudinary Upload Service - Usage Guide

This guide shows how to use the reusable Cloudinary upload service across the application.

## Configuration

- **Cloud Name**: `iniodugboyous`
- **Upload Preset**: `digemart`
- **Auto-configured**: No API keys needed in frontend (using unsigned upload preset)

## Basic Usage

### 1. Import the Service

```typescript
import { uploadToCloudinary, uploadMultipleToCloudinary } from '@/lib/cloudinary';
```

### 2. Single File Upload

```typescript
const handleSingleUpload = async (file: File) => {
  try {
    const result = await uploadToCloudinary(file, {
      folder: 'my-folder',
      tags: ['tag1', 'tag2'],
    });
    
    console.log('Uploaded URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 3. Multiple Files Upload

```typescript
const handleMultipleUpload = async (files: File[]) => {
  try {
    const results = await uploadMultipleToCloudinary(files, {
      folder: 'products',
      tags: ['product', 'batch-upload'],
    });
    
    results.forEach((result, index) => {
      console.log(`File ${index + 1} URL:`, result.secure_url);
    });
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 4. Upload with Progress Tracking

```typescript
const [uploadProgress, setUploadProgress] = useState(0);

const handleUploadWithProgress = async (file: File) => {
  try {
    const result = await uploadToCloudinary(file, {
      folder: 'avatars',
      onProgress: (progress) => {
        setUploadProgress(progress);
        console.log(`Upload progress: ${progress}%`);
      },
    });
    
    console.log('Upload complete!', result.secure_url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

## Upload Options

```typescript
interface UploadOptions {
  folder?: string;           // Organize files in folders
  tags?: string[];          // Add tags for categorization
  transformation?: string;   // Apply transformations on upload
  onProgress?: (progress: number) => void;  // Track upload progress
}
```

## Common Use Cases

### Profile Picture Upload

```typescript
const uploadProfilePicture = async (file: File, userId: number) => {
  const result = await uploadToCloudinary(file, {
    folder: `users/${userId}/profile`,
    tags: ['profile-picture', `user-${userId}`],
  });
  
  return result.secure_url;
};
```

### Product Image Upload

```typescript
const uploadProductImage = async (file: File, storeId: number, productId: number) => {
  const result = await uploadToCloudinary(file, {
    folder: `products/${storeId}/${productId}`,
    tags: [`product_${productId}`, `store_${storeId}`],
    onProgress: (progress) => console.log(`${progress}%`),
  });
  
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
};
```

### Store Logo/Banner Upload

```typescript
const uploadStoreLogo = async (file: File, storeId: number) => {
  const result = await uploadToCloudinary(file, {
    folder: `stores/${storeId}/branding`,
    tags: ['store-logo', `store-${storeId}`],
  });
  
  return result.secure_url;
};
```

## Response Data

The upload returns a `CloudinaryUploadResponse` with:

```typescript
{
  public_id: string;          // Unique identifier
  secure_url: string;         // HTTPS URL (use this!)
  url: string;                // HTTP URL
  width: number;              // Image width in pixels
  height: number;             // Image height in pixels
  format: string;             // File format (jpg, png, etc.)
  bytes: number;              // File size in bytes
  original_filename: string;  // Original file name
  created_at: string;         // Upload timestamp
  // ... and more
}
```

## Image Transformation

You can apply transformations on the fly:

```typescript
import { getCloudinaryUrl } from '@/lib/cloudinary';

// Get thumbnail
const thumbnail = getCloudinaryUrl(publicId, {
  width: 200,
  height: 200,
  crop: 'fill',
  quality: 'auto',
});

// Get optimized image
const optimized = getCloudinaryUrl(publicId, {
  width: 800,
  quality: 'auto',
  format: 'webp',
});
```

## Error Handling

```typescript
const handleUpload = async (file: File) => {
  try {
    const result = await uploadToCloudinary(file, {
      folder: 'uploads',
    });
    
    // Success!
    return result.secure_url;
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific errors
      if (error.message.includes('Upload failed')) {
        toast.error('Network error during upload');
      } else if (error.message.includes('aborted')) {
        toast.error('Upload cancelled');
      } else {
        toast.error('Upload failed');
      }
    }
    throw error;
  }
};
```

## React Component Example

```typescript
'use client';

import { useState } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';

export function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, {
        folder: 'my-uploads',
        tags: ['user-upload'],
        onProgress: (p) => setProgress(p),
      });

      setImageUrl(result.secure_url);
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      
      {uploading && <div>Uploading: {progress}%</div>}
      
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
}
```

## Best Practices

1. **Always use `secure_url`** (HTTPS) instead of `url`
2. **Organize files in folders** for better management
3. **Add tags** for easy searching and filtering
4. **Track progress** for better UX on large files
5. **Handle errors gracefully** with user-friendly messages
6. **Store metadata** (public_id, width, height) for later use
7. **Use transformations** to optimize delivery

## Notes

- File size limit: 10MB for unsigned uploads (configurable in Cloudinary)
- Supported formats: All common image formats (JPG, PNG, WebP, GIF, etc.)
- Upload is direct to Cloudinary (no backend proxy needed)
- Deletion requires backend implementation for security
