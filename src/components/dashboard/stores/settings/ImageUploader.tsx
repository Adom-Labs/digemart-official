'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { uploadToCloudinary, type CloudinaryUploadResponse } from '@/lib/cloudinary';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
    label: string;
    description?: string;
    currentImage?: string | null;
    onChange: (url: string | null) => void;
    aspectRatio?: '1:1' | '16:9' | '21:9' | 'free';
    maxSizeMB?: number;
    folder: string;
    placeholder?: string;
}

export function ImageUploader({
    label,
    description,
    currentImage,
    onChange,
    aspectRatio = 'free',
    maxSizeMB = 5,
    folder,
    placeholder,
}: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const aspectRatioClasses = {
        '1:1': 'aspect-square max-h-64',
        '16:9': 'aspect-video',
        '21:9': 'aspect-[21/9]',
        'free': 'min-h-[200px]',
    };

    const validateFile = (file: File): string | null => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            return 'Please upload a valid image file (JPG, PNG, WebP, or SVG)';
        }

        const maxSize = maxSizeMB * 1024 * 1024;
        if (file.size > maxSize) {
            return `File size must be less than ${maxSizeMB}MB`;
        }

        return null;
    };

    const handleFileSelect = async (file: File) => {
        const error = validateFile(file);
        if (error) {
            toast.error(error);
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const result: CloudinaryUploadResponse = await uploadToCloudinary(file, {
                folder,
                onProgress: (progress) => {
                    setUploadProgress(progress);
                },
            });

            onChange(result.secure_url);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleRemove = () => {
        onChange(null);
        toast.success('Image removed');
    };

    const handleBrowse = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
            />

            {currentImage && !isUploading ? (
                // Preview with image
                <div className="space-y-3">
                    <div
                        className={cn(
                            'relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50',
                            aspectRatioClasses[aspectRatio]
                        )}
                    >
                        <img
                            src={currentImage}
                            alt={label}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleBrowse}
                            className="flex-1"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Replace Image
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemove}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Remove
                        </Button>
                    </div>
                </div>
            ) : (
                // Upload zone
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        'relative overflow-hidden rounded-lg border-2 border-dashed transition-colors',
                        aspectRatioClasses[aspectRatio],
                        isDragging
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 bg-gray-50 hover:border-gray-400',
                        isUploading && 'pointer-events-none'
                    )}
                >
                    {isUploading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                            <p className="text-sm font-medium text-gray-700 mb-1">Uploading...</p>
                            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                            <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                            <p className="text-sm font-medium text-gray-700 mb-1">
                                {isDragging ? 'Drop image here' : 'Drop image here or click to browse'}
                            </p>
                            {description && (
                                <p className="text-xs text-gray-500 mb-3">{description}</p>
                            )}
                            {placeholder && (
                                <p className="text-xs text-gray-400 mb-3">{placeholder}</p>
                            )}
                            <p className="text-xs text-gray-500 mb-4">
                                Max size: {maxSizeMB}MB • Formats: JPG, PNG, WebP, SVG
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleBrowse}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Browse Files
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
