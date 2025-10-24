/**
 * Payment Security Utilities
 *
 * Provides client-side security measures for payment processing
 * including data validation, encryption helpers, and security checks.
 */

// Payment data validation schemas
export interface PaymentValidationRules {
  amount: {
    min: number;
    max: number;
  };
  currency: {
    allowed: string[];
  };
  methods: {
    allowed: string[];
  };
  gateways: {
    allowed: string[];
  };
}

// Default validation rules
export const DEFAULT_PAYMENT_RULES: PaymentValidationRules = {
  amount: {
    min: 50, // Minimum 50 cents/kobo
    max: 10000000, // Maximum 10M
  },
  currency: {
    allowed: ["NGN", "USD", "EUR", "GBP"],
  },
  methods: {
    allowed: ["card", "bank_transfer", "wallet"],
  },
  gateways: {
    allowed: ["paystack", "flutterwave", "basepay"],
  },
};

// Payment data validation
export class PaymentValidator {
  private rules: PaymentValidationRules;

  constructor(rules: PaymentValidationRules = DEFAULT_PAYMENT_RULES) {
    this.rules = rules;
  }

  validateAmount(amount: number): { valid: boolean; error?: string } {
    if (typeof amount !== "number" || isNaN(amount)) {
      return { valid: false, error: "Amount must be a valid number" };
    }

    if (amount < this.rules.amount.min) {
      return {
        valid: false,
        error: `Amount must be at least ${this.rules.amount.min}`,
      };
    }

    if (amount > this.rules.amount.max) {
      return {
        valid: false,
        error: `Amount cannot exceed ${this.rules.amount.max}`,
      };
    }

    return { valid: true };
  }

  validateCurrency(currency: string): { valid: boolean; error?: string } {
    if (!currency || typeof currency !== "string") {
      return { valid: false, error: "Currency is required" };
    }

    if (!this.rules.currency.allowed.includes(currency.toUpperCase())) {
      return {
        valid: false,
        error: `Currency ${currency} is not supported`,
      };
    }

    return { valid: true };
  }

  validateMethod(method: string): { valid: boolean; error?: string } {
    if (!method || typeof method !== "string") {
      return { valid: false, error: "Payment method is required" };
    }

    if (!this.rules.methods.allowed.includes(method.toLowerCase())) {
      return {
        valid: false,
        error: `Payment method ${method} is not supported`,
      };
    }

    return { valid: true };
  }

  validateGateway(gateway: string): { valid: boolean; error?: string } {
    if (!gateway || typeof gateway !== "string") {
      return { valid: false, error: "Payment gateway is required" };
    }

    if (!this.rules.gateways.allowed.includes(gateway.toLowerCase())) {
      return {
        valid: false,
        error: `Payment gateway ${gateway} is not supported`,
      };
    }

    return { valid: true };
  }

  validatePaymentData(data: {
    amount: number;
    currency: string;
    method: string;
    gateway: string;
    orderId: number;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate order ID
    if (
      !data.orderId ||
      typeof data.orderId !== "number" ||
      data.orderId <= 0
    ) {
      errors.push("Valid order ID is required");
    }

    // Validate amount
    const amountValidation = this.validateAmount(data.amount);
    if (!amountValidation.valid) {
      errors.push(amountValidation.error!);
    }

    // Validate currency
    const currencyValidation = this.validateCurrency(data.currency);
    if (!currencyValidation.valid) {
      errors.push(currencyValidation.error!);
    }

    // Validate method
    const methodValidation = this.validateMethod(data.method);
    if (!methodValidation.valid) {
      errors.push(methodValidation.error!);
    }

    // Validate gateway
    const gatewayValidation = this.validateGateway(data.gateway);
    if (!gatewayValidation.valid) {
      errors.push(gatewayValidation.error!);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Security headers for payment requests
export const getSecureHeaders = (): Record<string, string> => {
  return {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };
};

// Generate secure payment reference
export const generatePaymentReference = (
  orderId: number,
  timestamp?: number
): string => {
  const ts = timestamp || Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `PAY_${orderId}_${ts}_${random}`;
};

// Sanitize payment metadata
export const sanitizePaymentMetadata = (
  metadata: Record<string, any>
): Record<string, any> => {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(metadata)) {
    // Only allow safe data types
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      // Sanitize strings
      if (typeof value === "string") {
        sanitized[key] = value.replace(/[<>\"'&]/g, ""); // Remove potentially dangerous characters
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
};

// Payment URL validation
export const validatePaymentUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);

    // Check protocol
    if (!["https:", "http:"].includes(parsedUrl.protocol)) {
      return false;
    }

    // Check for known payment gateway domains
    const allowedDomains = [
      "checkout.paystack.com",
      "api.paystack.co",
      "checkout.flutterwave.com",
      "api.flutterwave.com",
      "basepay.app",
      "api.basepay.app",
      "localhost", // For development
    ];

    const hostname = parsedUrl.hostname.toLowerCase();
    return allowedDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};

// Rate limiting helper
export class PaymentRateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> =
    new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    // 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if window has passed
    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if under limit
    if (record.count < this.maxAttempts) {
      record.count++;
      record.lastAttempt = now;
      return true;
    }

    return false;
  }

  getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return 0;

    const elapsed = Date.now() - record.lastAttempt;
    return Math.max(0, this.windowMs - elapsed);
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Payment session security
export class PaymentSession {
  private sessionId: string;
  private createdAt: number;
  private expiresAt: number;

  constructor(sessionDurationMs: number = 30 * 60 * 1000) {
    // 30 minutes
    this.sessionId = this.generateSessionId();
    this.createdAt = Date.now();
    this.expiresAt = this.createdAt + sessionDurationMs;
  }

  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `ps_${timestamp}_${random}`;
  }

  isValid(): boolean {
    return Date.now() < this.expiresAt;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getRemainingTime(): number {
    return Math.max(0, this.expiresAt - Date.now());
  }

  extend(additionalMs: number = 15 * 60 * 1000): void {
    this.expiresAt = Math.max(this.expiresAt, Date.now()) + additionalMs;
  }
}

// Error handling for payment operations
export class PaymentError extends Error {
  public code: string;
  public retryable: boolean;
  public details?: any;

  constructor(
    message: string,
    code: string = "PAYMENT_ERROR",
    retryable: boolean = false,
    details?: any
  ) {
    super(message);
    this.name = "PaymentError";
    this.code = code;
    this.retryable = retryable;
    this.details = details;
  }

  static fromApiError(error: any): PaymentError {
    if (error.response?.status === 429) {
      return new PaymentError(
        "Too many payment attempts. Please try again later.",
        "RATE_LIMITED",
        true
      );
    }

    if (error.response?.status >= 500) {
      return new PaymentError(
        "Payment service temporarily unavailable. Please try again.",
        "SERVICE_UNAVAILABLE",
        true
      );
    }

    if (error.response?.status === 400) {
      return new PaymentError(
        error.response.data?.message || "Invalid payment data",
        "INVALID_DATA",
        false
      );
    }

    return new PaymentError(
      error.message || "Payment processing failed",
      "UNKNOWN_ERROR",
      false
    );
  }
}

// Export default validator instance
export const paymentValidator = new PaymentValidator();
export const paymentRateLimiter = new PaymentRateLimiter();
