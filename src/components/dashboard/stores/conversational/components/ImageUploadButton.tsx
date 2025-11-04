import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ImageUploadButtonProps {
  label: string;
  onUpload: (url: string) => void;
  onSkip?: () => void;
  currentImage?: string;
  uploadFolder: string;
}

export const ImageUploadButton = ({
  label,
  onUpload,
  onSkip,
  currentImage,
  uploadFolder,
}: ImageUploadButtonProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const { uploadImage } = await import("@/lib/utils/imageUpload");
      const result = await uploadImage(file);
      onUpload(result.url);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload image";
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {currentImage ? (
          <div className="bg-card border rounded-2xl p-4 max-w-sm">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border mb-3">
              <Image
                src={currentImage}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="sm"
                variant="outline"
                disabled={isUploading}
              >
                Change Image
              </Button>
              {onSkip && (
                <Button onClick={onSkip} size="sm" variant="ghost">
                  Continue
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              className="gap-2"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  {label}
                </>
              )}
            </Button>
            {onSkip && (
              <Button
                onClick={onSkip}
                variant="outline"
                size="sm"
                disabled={isUploading}
              >
                Skip for now
              </Button>
            )}
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-destructive"
          >
            <X className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
