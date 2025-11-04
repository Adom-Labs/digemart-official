/**
 * Image Upload Utility
 * Handles image file uploads and conversion
 * TODO: Replace with Cloudinary integration for production
 */

export interface ImageUploadResult {
  url: string;
  file: File;
}

export interface ImageUploadOptions {
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

const DEFAULT_OPTIONS: ImageUploadOptions = {
  maxSizeMB: 5,
  acceptedFormats: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
};

/**
 * Convert file to base64 data URL
 * TODO: Replace with Cloudinary upload
 */
export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

/**
 * Validate image file
 */
export const validateImageFile = (
  file: File,
  options: ImageUploadOptions = DEFAULT_OPTIONS
): { valid: boolean; error?: string } => {
  const { maxSizeMB, acceptedFormats } = { ...DEFAULT_OPTIONS, ...options };

  // Check file type
  if (acceptedFormats && !acceptedFormats.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file format. Accepted formats: ${acceptedFormats
        .map((f) => f.split("/")[1])
        .join(", ")}`,
    };
  }

  // Check file size
  const maxSizeBytes = (maxSizeMB || 5) * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
};

/**
 * Upload image and get URL
 * Uses Cloudinary for production uploads
 */
export const uploadImage = async (
  file: File,
  options?: ImageUploadOptions
): Promise<ImageUploadResult> => {
  // Validate file
  const validation = validateImageFile(file, options);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Upload to Cloudinary
  const cloudinaryUrl = await uploadToCloudinary(file, "stores");

  return {
    url: cloudinaryUrl,
    file,
  };
};

/**
 * Upload to Cloudinary
 */
export const uploadToCloudinary = async (
  file: File,
  folder?: string
): Promise<string> => {
  const CLOUDINARY_CLOUD_NAME = "iniodugboyous";
  const CLOUDINARY_UPLOAD_PRESET = "digemart";
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  if (folder) formData.append("folder", folder);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const data = await response.json();
  return data.secure_url;
};
