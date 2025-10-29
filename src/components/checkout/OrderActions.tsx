"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Package,
  RefreshCw,
  MessageSquare,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  canCancelOrder,
  canReturnOrder,
  getOrderStatusText,
  formatOrderNumber,
} from "@/lib/utils/order-tracking";

interface OrderData {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  actualDelivery?: string;
  orderItems: Array<{
    id: number;
    productId: number;
    variantId?: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: {
      name: string;
      images?: string[];
    };
    variant?: {
      name: string;
    };
  }>;
  payments: Array<{
    id: number;
    amount: number;
    method: string;
    status: string;
    reference: string;
  }>;
}

interface OrderActionsProps {
  order: OrderData;
  onCancel?: (
    orderId: number,
    reason: string,
    details?: string
  ) => Promise<void>;
  onReturn?: (
    orderId: number,
    items: number[],
    reason: string,
    details?: string
  ) => Promise<void>;
  onReorder?: (orderId: number) => Promise<void>;
  onModify?: (orderId: number, modifications: any) => Promise<void>;
  isLoading?: boolean;
}

const CANCELLATION_REASONS = [
  { value: "changed_mind", label: "Changed my mind" },
  { value: "found_better_price", label: "Found a better price elsewhere" },
  { value: "ordered_by_mistake", label: "Ordered by mistake" },
  { value: "delivery_too_long", label: "Delivery taking too long" },
  { value: "payment_issues", label: "Payment issues" },
  { value: "other", label: "Other reason" },
];

const RETURN_REASONS = [
  { value: "defective", label: "Item is defective or damaged" },
  { value: "wrong_item", label: "Wrong item received" },
  { value: "not_as_described", label: "Item not as described" },
  { value: "size_fit", label: "Size or fit issues" },
  { value: "quality_issues", label: "Quality not as expected" },
  { value: "changed_mind", label: "Changed my mind" },
  { value: "other", label: "Other reason" },
];

export function OrderActions({
  order,
  onCancel,
  onReturn,
  onReorder,
  onModify,
  isLoading = false,
}: OrderActionsProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [showReorderDialog, setShowReorderDialog] = useState(false);

  const [cancelReason, setCancelReason] = useState("");
  const [cancelDetails, setCancelDetails] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const [returnReason, setReturnReason] = useState("");
  const [returnDetails, setReturnDetails] = useState("");
  const [selectedReturnItems, setSelectedReturnItems] = useState<number[]>([]);
  const [isReturning, setIsReturning] = useState(false);

  const [isReordering, setIsReordering] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason) {
      toast.error("Please select a cancellation reason");
      return;
    }

    if (!onCancel) return;

    setIsCancelling(true);
    try {
      await onCancel(order.id, cancelReason, cancelDetails);
      setShowCancelDialog(false);
      setCancelReason("");
      setCancelDetails("");
      toast.success("Order cancelled successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReturnItems = async () => {
    if (!returnReason) {
      toast.error("Please select a return reason");
      return;
    }

    if (selectedReturnItems.length === 0) {
      toast.error("Please select at least one item to return");
      return;
    }

    if (!onReturn) return;

    setIsReturning(true);
    try {
      await onReturn(
        order.id,
        selectedReturnItems,
        returnReason,
        returnDetails
      );
      setShowReturnDialog(false);
      setReturnReason("");
      setReturnDetails("");
      setSelectedReturnItems([]);
      toast.success("Return request submitted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit return request");
    } finally {
      setIsReturning(false);
    }
  };

  const handleReorder = async () => {
    if (!onReorder) return;

    setIsReordering(true);
    try {
      await onReorder(order.id);
      setShowReorderDialog(false);
      toast.success("Items added to cart successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to reorder items");
    } finally {
      setIsReordering(false);
    }
  };

  const toggleReturnItem = (itemId: number) => {
    setSelectedReturnItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getRefundAmount = () => {
    if (selectedReturnItems.length === 0) return 0;

    return order.orderItems
      .filter((item) => selectedReturnItems.includes(item.id))
      .reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const canCancelThisOrder = canCancelOrder(order.status);
  const canReturnThisOrder = canReturnOrder(order.status, order.actualDelivery);

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Order Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {canCancelThisOrder && onCancel && (
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(true)}
                disabled={isLoading}
                className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Cancel Order</span>
              </Button>
            )}

            {canReturnThisOrder && onReturn && (
              <Button
                variant="outline"
                onClick={() => setShowReturnDialog(true)}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <Package className="h-4 w-4" />
                <span>Return Items</span>
              </Button>
            )}

            {onReorder && (
              <Button
                variant="outline"
                onClick={() => setShowReorderDialog(true)}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reorder</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Status Information */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Status:</span>
              <Badge variant="outline">
                {getOrderStatusText(order.status)}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              {canCancelThisOrder ? (
                <div className="flex items-center space-x-2 text-orange-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>This order can be cancelled</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-500">
                  <X className="h-4 w-4" />
                  <span>This order cannot be cancelled</span>
                </div>
              )}

              {canReturnThisOrder ? (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Package className="h-4 w-4" />
                  <span>Items can be returned within 14 days of delivery</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Package className="h-4 w-4" />
                  <span>Return period has expired or order not eligible</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Order Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel order{" "}
              {formatOrderNumber(order.orderNumber)}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="cancel-reason">Reason for cancellation *</Label>
              <Select value={cancelReason} onValueChange={setCancelReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {CANCELLATION_REASONS.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cancel-details">
                Additional details (optional)
              </Label>
              <Textarea
                id="cancel-details"
                placeholder="Please provide any additional information..."
                value={cancelDetails}
                onChange={(e) => setCancelDetails(e.target.value)}
                rows={3}
              />
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your payment will be refunded within 3-5 business days after
                cancellation.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={isCancelling}
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Cancel Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Items Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Return Items</DialogTitle>
            <DialogDescription>
              Select the items you want to return from order{" "}
              {formatOrderNumber(order.orderNumber)}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <Label>Select items to return</Label>
              <div className="space-y-3 mt-2">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg"
                  >
                    <Checkbox
                      checked={selectedReturnItems.includes(item.id)}
                      onCheckedChange={() => toggleReturnItem(item.id)}
                    />
                    <img
                      src={item.product.images?.[0] || "/api/placeholder/50/50"}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      {item.variant && (
                        <p className="text-xs text-gray-500">
                          {item.variant.name}
                        </p>
                      )}
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="return-reason">Reason for return *</Label>
              <Select value={returnReason} onValueChange={setReturnReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {RETURN_REASONS.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="return-details">
                Additional details (optional)
              </Label>
              <Textarea
                id="return-details"
                placeholder="Please describe the issue or provide additional information..."
                value={returnDetails}
                onChange={(e) => setReturnDetails(e.target.value)}
                rows={3}
              />
            </div>

            {selectedReturnItems.length > 0 && (
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  Refund amount: {formatPrice(getRefundAmount())}
                  <br />
                  Refunds are processed within 3-5 business days after we
                  receive your return.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReturnDialog(false)}
              disabled={isReturning}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReturnItems}
              disabled={isReturning || selectedReturnItems.length === 0}
            >
              {isReturning ? "Submitting..." : "Submit Return Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reorder Dialog */}
      <Dialog open={showReorderDialog} onOpenChange={setShowReorderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reorder Items</DialogTitle>
            <DialogDescription>
              Add all items from order {formatOrderNumber(order.orderNumber)} to
              your cart?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Items to be added:</h4>
              <div className="space-y-2">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.name}{" "}
                      {item.variant && `(${item.variant.name})`}
                    </span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Items will be added to your cart at current prices. Prices may
                have changed since your original order.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReorderDialog(false)}
              disabled={isReordering}
            >
              Cancel
            </Button>
            <Button onClick={handleReorder} disabled={isReordering}>
              {isReordering ? "Adding to Cart..." : "Add to Cart"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
