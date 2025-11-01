/**
 * Cloudinary Upload Service
 * Reusable service for uploading images to Cloudinary
 */

const CLOUDINARY_CLOUD_NAME = "iniodugboyous";
const CLOUDINARY_UPLOAD_PRESET = "digemart";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_id: string;
  original_filename: string;
}

export interface UploadOptions {
  folder?: string;
  tags?: string[];
  transformation?: string;
  onProgress?: (progress: number) => void;
}

/**
 * Upload a single file to Cloudinary
 * @param file - The file to upload
 * @param options - Optional upload configuration
 * @returns Promise with Cloudinary response
 */
export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  // Add optional parameters
  if (options.folder) {
    formData.append("folder", options.folder);
  }

  if (options.tags && options.tags.length > 0) {
    formData.append("tags", options.tags.join(","));
  }

  if (options.transformation) {
    formData.append("transformation", options.transformation);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (options.onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          options.onProgress?.(progress);
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload aborted"));
    });

    xhr.open("POST", CLOUDINARY_UPLOAD_URL);
    xhr.send(formData);
  });
}

/**
 * Upload multiple files to Cloudinary
 * @param files - Array of files to upload
 * @param options - Optional upload configuration
 * @returns Promise with array of Cloudinary responses
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  options: UploadOptions = {}
): Promise<CloudinaryUploadResponse[]> {
  const uploadPromises = files.map((file) => uploadToCloudinary(file, options));
  return Promise.all(uploadPromises);
}

/**
 * Generate Cloudinary transformation URL
 * @param publicId - The public ID of the image
 * @param transformations - Transformation parameters
 * @returns Transformed image URL
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "scale" | "crop" | "thumb";
    quality?: number | "auto";
    format?: string;
  }
): string {
  let transformString = "";

  if (transformations) {
    const parts: string[] = [];
    if (transformations.width) parts.push(`w_${transformations.width}`);
    if (transformations.height) parts.push(`h_${transformations.height}`);
    if (transformations.crop) parts.push(`c_${transformations.crop}`);
    if (transformations.quality) parts.push(`q_${transformations.quality}`);
    if (transformations.format) parts.push(`f_${transformations.format}`);
    transformString = parts.join(",") + "/";
  }

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}${publicId}`;
}

/**
 * Delete an image from Cloudinary (requires backend implementation with signature)
 * Note: Direct deletion from frontend is not recommended for security reasons
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  // This should be implemented on the backend for security
  // Frontend should call a backend API that handles the deletion
  throw new Error("Delete operation must be performed through backend API");
}
