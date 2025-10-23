"use client";

import { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ProductVariant {
    id: number;
    sku: string;
    options: Record<string, string>; // e.g., { color: "Red", size: "Large" }
    price: number;
    compareAtPrice?: number;
    stock: number;
    lowStockThreshold?: number;
}

interface VariantTableProps {
    variants: ProductVariant[];
    editMode?: boolean;
    onUpdate?: (variantId: number, data: Partial<ProductVariant>) => void;
    onDelete?: (variantId: number) => void;
    onAdd?: () => void;
}

export function VariantTable({
    variants,
    editMode = false,
    onUpdate,
    onDelete,
    onAdd,
}: VariantTableProps) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const getStockStatus = (stock: number, threshold: number = 20) => {
        if (stock === 0) {
            return {
                label: "Out of Stock",
                color: "bg-red-500/10 text-red-700 border-red-500/20",
                icon: "❌",
            };
        }
        if (stock <= threshold) {
            return {
                label: "Low Stock",
                color: "bg-amber-500/10 text-amber-700 border-amber-500/20",
                icon: "⚠️",
            };
        }
        return {
            label: "In Stock",
            color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
            icon: "✓",
        };
    };

    const formatOptions = (options: Record<string, string>) => {
        return Object.entries(options)
            .map(([key, value]) => `${value}`)
            .join(" / ");
    };

    if (!variants || variants.length === 0) {
        return (
            <div className="border rounded-lg p-12 text-center">
                <div className="max-w-sm mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Variants</h3>
                    <p className="text-gray-600 mb-4">
                        This product doesn't have any variants yet. Add options like size, color, or material.
                    </p>
                    {editMode && onAdd && (
                        <Button onClick={onAdd}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Variant
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Product Variants</h3>
                    <p className="text-sm text-gray-600">
                        {variants.length} variant{variants.length !== 1 ? "s" : ""} available
                    </p>
                </div>
                {editMode && onAdd && (
                    <Button onClick={onAdd} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Variant
                    </Button>
                )}
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead>Variant</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            {editMode && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {variants.map((variant) => {
                            const stockStatus = getStockStatus(variant.stock, variant.lowStockThreshold);
                            const isEditing = editingId === variant.id;

                            return (
                                <TableRow key={variant.id} className="hover:bg-gray-50">
                                    {/* Variant Options */}
                                    <TableCell className="font-medium">
                                        {formatOptions(variant.options)}
                                    </TableCell>

                                    {/* SKU */}
                                    <TableCell>
                                        {isEditing && editMode ? (
                                            <Input
                                                defaultValue={variant.sku}
                                                className="h-8 w-32"
                                                onBlur={(e) => {
                                                    onUpdate?.(variant.id, { sku: e.target.value });
                                                    setEditingId(null);
                                                }}
                                                autoFocus
                                            />
                                        ) : (
                                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                                {variant.sku}
                                            </code>
                                        )}
                                    </TableCell>

                                    {/* Price */}
                                    <TableCell>
                                        {isEditing && editMode ? (
                                            <Input
                                                type="number"
                                                step="0.01"
                                                defaultValue={variant.price}
                                                className="h-8 w-24"
                                                onBlur={(e) => {
                                                    onUpdate?.(variant.id, { price: parseFloat(e.target.value) });
                                                    setEditingId(null);
                                                }}
                                            />
                                        ) : (
                                            <div>
                                                <div className="font-semibold">${variant.price.toFixed(2)}</div>
                                                {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
                                                    <div className="text-xs text-gray-500 line-through">
                                                        ${variant.compareAtPrice.toFixed(2)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </TableCell>

                                    {/* Stock */}
                                    <TableCell>
                                        {isEditing && editMode ? (
                                            <Input
                                                type="number"
                                                defaultValue={variant.stock}
                                                className="h-8 w-20"
                                                onBlur={(e) => {
                                                    onUpdate?.(variant.id, { stock: parseInt(e.target.value) });
                                                    setEditingId(null);
                                                }}
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{stockStatus.icon}</span>
                                                <span className="font-medium">{variant.stock}</span>
                                            </div>
                                        )}
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <Badge className={cn("border", stockStatus.color)}>
                                            {stockStatus.label}
                                        </Badge>
                                    </TableCell>

                                    {/* Actions */}
                                    {editMode && (
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditingId(variant.id)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => onDelete?.(variant.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Summary */}
            <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span>
                        {variants.filter((v) => v.stock > (v.lowStockThreshold || 20)).length} in stock
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span>
                        {variants.filter(
                            (v) => v.stock > 0 && v.stock <= (v.lowStockThreshold || 20)
                        ).length}{" "}
                        low stock
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>{variants.filter((v) => v.stock === 0).length} out of stock</span>
                </div>
            </div>
        </div>
    );
}

function Package({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
        </svg>
    );
}
