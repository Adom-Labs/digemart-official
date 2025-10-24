"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard, Building2, Wallet, Bitcoin } from "lucide-react";
import { BasePayButton } from '@base-org/account-ui/react';
import { pay, getPaymentStatus } from '@base-org/account';
import { useState, useEffect } from 'react';

interface OrderData {
    orderNumber: string;
    paymentReference: string;
    orderId: number;
    orderStatus: string;
    paymentStatus: string;
    totals: {
        subtotal: number;
        taxAmount: number;
        shippingAmount: number;
        couponDiscount: number;
        totalAmount: number;
    };
    trackingUrl: string;
    createdAt: string;
    metadata: Record<string, any>;
}

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderData: OrderData | null;
    paymentType: "card" | "bank_transfer" | "wallet" | "basepay";
    onPaymentComplete: () => void;
}

export function PaymentModal({
    isOpen,
    onClose,
    orderData,
    paymentType,
    onPaymentComplete,
}: PaymentModalProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!orderData) return null;

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
        }).format(amount);
    };

    // Convert NGN to USD (you'll need to use actual exchange rate)
    const convertToUSD = (ngnAmount: number) => {
        const exchangeRate = 1600; // Example: 1 USD = 1600 NGN - UPDATE THIS
        return (ngnAmount / exchangeRate).toFixed(2);
    };

    const getPaymentIcon = () => {
        switch (paymentType) {
            case "card":
                return <CreditCard className="h-8 w-8 text-blue-600" />;
            case "bank_transfer":
                return <Building2 className="h-8 w-8 text-green-600" />;
            case "wallet":
                return <Wallet className="h-8 w-8 text-purple-600" />;
            case "basepay":
                return <Bitcoin className="h-8 w-8 text-orange-600" />;
            default:
                return <CreditCard className="h-8 w-8 text-blue-600" />;
        }
    };

    const getPaymentTitle = () => {
        switch (paymentType) {
            case "card":
                return "Pay with Card";
            case "bank_transfer":
                return "Bank Transfer";
            case "wallet":
                return "Pay with Wallet";
            case "basepay":
                return "Pay with BasePay";
            default:
                return "Complete Payment";
        }
    };

    const handleBasePayment = async () => {
        if (!isMounted) return;

        try {
            setIsProcessing(true);

            const usdAmount = convertToUSD(orderData.totals.totalAmount);

            const payment = await pay({
                amount: usdAmount,
                to: '0xYourWalletAddress', // REPLACE WITH YOUR ACTUAL WALLET ADDRESS
                testnet: true, // Set to false for production
                payerInfo: {
                    requests: [
                        { type: 'email' },
                        { type: 'name', optional: true }
                    ]
                }
            });

            console.log(`Payment initiated! Transaction ID: ${payment.id}`);

            // Poll for payment status
            const result = await getPaymentStatus({
                id: payment.id,
                testnet: true
            });

            if (result.status === 'completed') {
                console.log('✅ Payment completed successfully!');
                console.log('User info:', payment.payerInfoResponses);

                // Here you would typically:
                // 1. Update your backend with the payment info
                // 2. Mark the order as paid
                // await updateOrderPaymentStatus(orderData.orderId, payment.id);

                onPaymentComplete();
            }
        } catch (error) {
            console.error('Payment failed:', error);
            alert(`Payment failed: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePayment = async () => {
        if (paymentType === 'basepay') {
            await handleBasePayment();
        } else {
            // Handle other payment types
            console.log("Initiating payment for:", orderData);
            onPaymentComplete();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                        Make Payment
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Order Number:</span>
                            <span className="font-medium">{orderData.orderNumber}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Payment Reference:</span>
                            <span className="font-mono text-xs">{orderData.paymentReference}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Status:</span>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                                {orderData.orderStatus}
                            </span>
                        </div>
                    </div>

                    {/* Payment Breakdown */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-sm text-gray-900">Payment Details</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>{formatPrice(orderData.totals.subtotal)}</span>
                            </div>
                            {orderData.totals.taxAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span>{formatPrice(orderData.totals.taxAmount)}</span>
                                </div>
                            )}
                            {orderData.totals.shippingAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span>{formatPrice(orderData.totals.shippingAmount)}</span>
                                </div>
                            )}
                            {orderData.totals.couponDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-{formatPrice(orderData.totals.couponDiscount)}</span>
                                </div>
                            )}
                            <div className="pt-2 border-t flex justify-between font-semibold">
                                <span>Total Amount</span>
                                <span className="text-lg">
                                    {formatPrice(orderData.totals.totalAmount)}
                                </span>
                            </div>
                            {paymentType === 'basepay' && (
                                <div className="text-xs text-gray-500 text-right">
                                    ≈ ${convertToUSD(orderData.totals.totalAmount)} USD
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            {getPaymentIcon()}
                            <div>
                                <p className="font-medium text-sm">{getPaymentTitle()}</p>
                                <p className="text-xs text-gray-600">
                                    {paymentType === 'basepay'
                                        ? 'Pay with USDC on Base - Fast & Secure'
                                        : 'You will be redirected to complete your payment'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>

                        {paymentType === 'basepay' && isMounted ? (
                            <BasePayButton
                                colorScheme="light"
                                onClick={handlePayment}
                                disabled={isProcessing}
                            />
                        ) : (
                            <Button
                                onClick={handlePayment}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : 'Complete Payment'}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}