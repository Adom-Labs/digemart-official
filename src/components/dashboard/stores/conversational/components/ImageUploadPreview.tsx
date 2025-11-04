import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";

interface ImageUploadPreviewProps {
  imageUrl: string;
  onConfirm: () => void;
  onReselect: () => void;
}

export const ImageUploadPreview = ({
  imageUrl,
  onConfirm,
  onReselect,
}: ImageUploadPreviewProps) => (
  <div className="space-y-3">
    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-border bg-muted">
      <Image src={imageUrl} alt="Logo preview" fill className="object-cover" />
    </div>
    <div className="flex gap-2">
      <Button onClick={onConfirm} size="sm" className="gap-2">
        <Check className="w-4 h-4" />
        Use this image
      </Button>
      <Button onClick={onReselect} variant="outline" size="sm">
        Choose different
      </Button>
    </div>
  </div>
);
