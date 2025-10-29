"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProductImage {
    id: number;
    url: string;
    altText?: string;
    isPrimary: boolean;
}

interface ProductGalleryProps {
    images: ProductImage[];
    editMode?: boolean;
    onReorder?: (images: ProductImage[]) => void;
    onSetPrimary?: (imageId: number) => void;
    onDelete?: (imageId: number) => void;
}

export function ProductGallery({
    images,
    editMode = false,
    onReorder,
    onSetPrimary,
    onDelete,
}: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [hovering, setHovering] = useState(false);

    const selectedImage = images[selectedIndex] || images[0];

    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") handlePrevious();
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "Escape") setLightboxOpen(false);
    };

    if (!images || images.length === 0) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                <div className="text-center">
                    <Image
                        src="/placeholder-product.png"
                        alt="No image"
                        width={200}
                        height={200}
                        className="mx-auto opacity-50"
                    />
                    <p className="mt-4 text-gray-500">No images available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group cursor-zoom-in"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                onClick={() => setLightboxOpen(true)}
            >
                <Image
                    src={selectedImage?.url || "/placeholder-product.png"}
                    alt={selectedImage?.altText || "Product image"}
                    fill
                    className={cn(
                        "object-cover transition-transform duration-300",
                        hovering && "scale-110"
                    )}
                    priority
                />

                {/* Zoom Indicator */}
                {hovering && (
                    <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                        <ZoomIn className="w-4 h-4" />
                        Click to zoom
                    </div>
                )}

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrevious();
                            }}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                            }}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {selectedIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                "relative aspect-square rounded-md overflow-hidden border-2 transition-all",
                                selectedIndex === index
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-transparent hover:border-gray-300"
                            )}
                        >
                            <Image
                                src={image.url}
                                alt={image.altText || `Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            {image.isPrimary && (
                                <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded text-xs font-medium">
                                    Main
                                </div>
                            )}
                            {editMode && (
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <GripVertical className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="max-w-7xl w-full h-[90vh] p-0" onKeyDown={handleKeyDown}>
                    <div className="relative w-full h-full bg-black">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                            onClick={() => setLightboxOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        <div className="relative w-full h-full flex items-center justify-center p-8">
                            <Image
                                src={selectedImage?.url || "/placeholder-product.png"}
                                alt={selectedImage?.altText || "Product image"}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Lightbox Navigation */}
                        {images.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                                    onClick={handlePrevious}
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                                    onClick={handleNext}
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </Button>

                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
                                    {selectedIndex + 1} of {images.length}
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
