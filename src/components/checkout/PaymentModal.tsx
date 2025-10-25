"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, AlertCircle, Network } from "lucide-react";
import { useState, useEffect } from "react";
import { PaymentSuccessDialog } from "./PaymentSuccessDialog";
import { BASE_URL } from "@/lib/api-request";
import { useSession } from "next-auth/react";
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt,
    useReadContract,
    useChainId,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { baseSepolia } from "wagmi/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";

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
    metadata: Record<string, unknown>;
}

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderData: OrderData | null;
    paymentType: "card" | "bank_transfer" | "wallet" | "crypto" | 'basepay';
    onPaymentComplete?: () => void;
}

// Contract Configuration
const PAYMENT_CONTRACT_ADDRESS = "0x38Df5605F298C99de5D99c7682D9466f91534e49" as `0x${string}`;
const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS || "0x036CbD53842c5426634e7929541eC2318f3dCF7e") as `0x${string}`;
const TARGET_CHAIN_ID = baseSepolia.id;

const ERC20_ABI = [
    {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
    },
    {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "allowance",
        type: "function",
        stateMutability: "view",
        inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
        ],
        outputs: [{ name: "", type: "uint256" }],
    },
] as const;

const PAYMENT_CONTRACT_ABI = [
    {
        name: "payForOrder",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "amount", type: "uint256" },
            { name: "token", type: "address" },
            { name: "orderId", type: "string" },
        ],
        outputs: [],
    },
] as const;

export function PaymentModal({
    isOpen,
    onClose,
    orderData,
    paymentType,
    onPaymentComplete,
}: PaymentModalProps) {
    const { data: session } = useSession();
    const [paymentStep, setPaymentStep] = useState<
        "idle" | "approving" | "paying" | "confirming" | "success"
    >("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [approvalTxHash, setApprovalTxHash] = useState<`0x${string}` | undefined>();
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const { address, isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const chainId = useChainId();

    const isCorrectNetwork = chainId === TARGET_CHAIN_ID;

    const { data: usdcBalance, refetch: refetchBalance } = useReadContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: {
            enabled: isConnected && !!address && paymentType === "wallet" && isCorrectNetwork,
        },
    });

    const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: address ? [address, PAYMENT_CONTRACT_ADDRESS] : undefined,
        query: {
            enabled: isConnected && !!address && paymentType === "wallet" && isCorrectNetwork,
        },
    });

    const { isLoading: isApproving, isSuccess: isApprovalSuccess } =
        useWaitForTransactionReceipt({
            hash: approvalTxHash,
        });

    useEffect(() => {
        if (isApprovalSuccess && paymentStep === "approving") {
            executePayment();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isApprovalSuccess, paymentStep]);

    useEffect(() => {
        if (isCorrectNetwork && isConnected) {
            refetchBalance();
            refetchAllowance();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainId, isCorrectNetwork, isConnected]);

    if (!orderData) return null;

    const formatPrice = (amount: number) =>
        new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

    const convertToUSDC = (ngnAmount: number) => (ngnAmount / 1600).toFixed(2);

    const getNetworkName = (id: number) => {
        const networks: Record<number, string> = {
            84532: "Base Sepolia",
            8453: "Base Mainnet",
            1: "Ethereum Mainnet",
        };
        return networks[id] || `Chain ${id}`;
    };

    // Asynchronously update payment status after successful payment
    const updatePaymentStatus = async (transactionHash?: string) => {
        if (!orderData || !session?.user) return;

        try {
            const updateData = {
                status: "completed",
                gatewayRef: transactionHash || `${paymentType}_${Date.now()}`,
                gateway: paymentType === "wallet" ? "blockchain" : paymentType,
                metadata: {
                    paymentMethod: paymentType,
                    transactionHash,
                    completedAt: new Date().toISOString(),
                },
            };

            await fetch(`${BASE_URL}/payments/details/${orderData.paymentReference}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.user}`,
                },
                body: JSON.stringify(updateData),
            });

            console.log("Payment status updated successfully");
        } catch (error) {
            console.error("Failed to update payment status:", error);
            // Don't throw error - this is background update
        }
    };

    const handlePaymentSuccess = async (transactionHash?: string) => {
        setPaymentStep("success");

        // Update payment status asynchronously
        updatePaymentStatus(transactionHash);

        // Show success dialog
        setShowSuccessDialog(true);

        // Close payment modal

    };

    const executePayment = async () => {
        if (!address || !orderData) return;
        try {
            setPaymentStep("paying");
            setErrorMessage(null);

            const usdcAmount = convertToUSDC(orderData.totals.totalAmount);
            const amount = parseUnits(usdcAmount, 6);

            const hash = await writeContractAsync({
                address: PAYMENT_CONTRACT_ADDRESS,
                abi: PAYMENT_CONTRACT_ABI,
                functionName: "payForOrder",
                args: [amount, USDC_ADDRESS, orderData.orderNumber],
            });

            setPaymentStep("confirming");
            await new Promise((r) => setTimeout(r, 3000));

            // Handle success with transaction hash
            await handlePaymentSuccess(hash);
        } catch (err: unknown) {
            const error = err as Error;
            setErrorMessage(error.message || "Payment failed.");
            setPaymentStep("idle");
        }
    };

    const handleWalletPayment = async () => {
        if (!address || !orderData) return;
        if (!isCorrectNetwork) {
            setErrorMessage("Switch to Base Sepolia in RainbowKit first.");
            return;
        }

        try {
            setErrorMessage(null);
            const usdcAmount = convertToUSDC(orderData.totals.totalAmount);
            const amount = parseUnits(usdcAmount, 6);

            if (usdcBalance !== undefined && usdcBalance < amount) {
                setErrorMessage(`Insufficient balance. Need ${usdcAmount} USDC`);
                return;
            }

            const needsApproval = !currentAllowance || currentAllowance < amount;

            if (needsApproval) {
                setPaymentStep("approving");
                const hash = await writeContractAsync({
                    address: USDC_ADDRESS,
                    abi: ERC20_ABI,
                    functionName: "approve",
                    args: [PAYMENT_CONTRACT_ADDRESS, amount],
                });
                setApprovalTxHash(hash);
            } else {
                await executePayment();
            }
        } catch (err: unknown) {
            const error = err as Error;
            setErrorMessage(error.message || "Transaction failed.");
            setPaymentStep("idle");
        }
    };

    const handleTraditionalPayment = async () => {
        setPaymentStep("paying");

        // Simulate payment processing
        await new Promise((r) => setTimeout(r, 1500));

        // Handle success without transaction hash
        await handlePaymentSuccess();
    };

    const getStepMessage = () => {
        switch (paymentStep) {
            case "approving":
                return "Step 1/2: Approving USDC...";
            case "paying":
                return "Step 2/2: Processing...";
            case "confirming":
                return "Confirming on blockchain...";
            default:
                return null;
        }
    };

    const isProcessing = paymentStep !== "idle" || isApproving;

    return (
        <>
            <div className="max-w-[500px] mx-auto my-12 space-y-6 py-4">
                <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <h1 className="text-lg font-semibold text-gray-900">Make Payment</h1>
                </div>

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
                            <span className="text-lg">{formatPrice(orderData.totals.totalAmount)}</span>
                        </div>
                        {paymentType === "wallet" && (
                            <div className="text-xs text-gray-500 text-right">
                                ≈ {convertToUSDC(orderData.totals.totalAmount)} USDC
                            </div>
                        )}
                    </div>
                </div>

                {/* Wallet Connect */}
                {paymentType === "wallet" && (
                    <div className="flex justify-center">
                        <ConnectButton chainStatus="icon" showBalance={false} />
                    </div>
                )}

                {/* Network Info */}
                {isConnected && paymentType === "wallet" && (
                    <div
                        className={`rounded-lg p-3 border ${isCorrectNetwork
                            ? "bg-green-50 border-green-200"
                            : "bg-yellow-50 border-yellow-200"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Network
                                    className={`h-4 w-4 ${isCorrectNetwork ? "text-green-600" : "text-yellow-600"
                                        }`}
                                />
                                <span
                                    className={`text-xs font-medium ${isCorrectNetwork ? "text-green-900" : "text-yellow-900"
                                        }`}
                                >
                                    {isCorrectNetwork ? "Correct Network" : "Wrong Network"}
                                </span>
                            </div>
                            <span
                                className={`text-xs font-mono ${isCorrectNetwork ? "text-green-700" : "text-yellow-700"
                                    }`}
                            >
                                {getNetworkName(chainId)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Wallet Connected */}
                {paymentType === "wallet" && isConnected && address && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs font-medium text-green-900">Wallet Connected</span>
                            </div>
                            <span className="text-xs text-green-700 font-mono">
                                {address.slice(0, 6)}...{address.slice(-4)}
                            </span>
                        </div>
                        {usdcBalance !== undefined && isCorrectNetwork && (
                            <div className="mt-2 text-xs text-green-700">
                                Balance: {formatUnits(usdcBalance, 6)} USDC
                            </div>
                        )}
                    </div>
                )}

                {/* Processing */}
                {isProcessing && paymentStep !== "idle" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                            <div>
                                <p className="text-sm font-medium text-blue-900">{getStepMessage()}</p>
                                <p className="text-xs text-blue-700 mt-1">
                                    Please confirm the transaction in your wallet
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error */}
                {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-red-900">Payment Error</p>
                                <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={isProcessing}
                    >
                        Cancel
                    </Button>

                    {paymentType === "wallet" ? (
                        <Button
                            onClick={handleWalletPayment}
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                            disabled={isProcessing || !isConnected}
                        >
                            {isProcessing ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                "Pay with Wallet"
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleTraditionalPayment}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Processing..." : "Complete Payment"}
                        </Button>
                    )}
                </div>

                {/* Wallet Info */}
                {paymentType === "wallet" && !isProcessing && (
                    <div className="text-xs text-gray-500 space-y-1">
                        <p>💡 <strong>How it works:</strong></p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>Connect your Web3 wallet (MetaMask, Rainbow, etc.)</li>
                            <li>Switch to Base Sepolia network if needed</li>
                            <li>Approve USDC spending</li>
                            <li>Confirm blockchain transaction</li>
                        </ol>
                    </div>
                )}
            </div>

            {/* Success Dialog */}
            {showSuccessDialog && orderData && (
                <PaymentSuccessDialog
                    isOpen={showSuccessDialog}
                    orderNumber={orderData.orderNumber}
                    orderReference={orderData.paymentReference}
                    totalAmount={orderData.totals.totalAmount}
                    trackingUrl={orderData.trackingUrl}
                />
            )}
        </>
    );
}
