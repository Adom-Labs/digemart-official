/**
 * Frontend checkout analytics tracking
 * Tracks user interactions, performance metrics, and conversion funnel
 */

interface AnalyticsEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp: Date;
  sessionId: string;
  userId?: string;
}

interface FunnelStep {
  step:
    | "cart_view"
    | "checkout_start"
    | "customer_info"
    | "shipping_address"
    | "payment_method"
    | "order_review"
    | "payment_process"
    | "order_complete";
  timestamp: Date;
  sessionId: string;
  userId?: string;
  storeId: number;
  metadata?: Record<string, unknown>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: "ms" | "bytes" | "count";
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export class CheckoutAnalytics {
  private static instance: CheckoutAnalytics;
  private sessionId: string;
  private userId?: string;
  private storeId?: number;
  private events: AnalyticsEvent[] = [];
  private performanceObserver?: PerformanceObserver;
  private startTime: number = Date.now();

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.initializePerformanceTracking();
  }

  static getInstance(): CheckoutAnalytics {
    if (!CheckoutAnalytics.instance) {
      CheckoutAnalytics.instance = new CheckoutAnalytics();
    }
    return CheckoutAnalytics.instance;
  }

  /**
   * Initialize analytics session
   */
  initialize(userId?: string, storeId?: number): void {
    this.userId = userId;
    this.storeId = storeId;

    // Track session start
    this.trackEvent("session_start", {
      userId,
      storeId,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      referrer: document.referrer,
    });
  }

  /**
   * Track checkout funnel step
   */
  trackFunnelStep(
    step: FunnelStep["step"],
    metadata?: Record<string, unknown>
  ): void {
    if (!this.storeId) {
      console.warn("Store ID not set for analytics tracking");
      return;
    }

    const funnelStep: FunnelStep = {
      step,
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: this.userId,
      storeId: this.storeId,
      metadata,
    };

    // Send to backend
    this.sendFunnelStep(funnelStep);

    // Track as event
    this.trackEvent("funnel_step", {
      step,
      ...metadata,
    });
  }

  /**
   * Track user interaction
   */
  trackInteraction(
    action: string,
    element: string,
    properties?: Record<string, unknown>
  ): void {
    this.trackEvent("user_interaction", {
      action,
      element,
      ...properties,
    });
  }

  /**
   * Track form validation errors
   */
  trackValidationError(
    field: string,
    errorType: string,
    errorMessage: string
  ): void {
    this.trackEvent("validation_error", {
      field,
      errorType,
      errorMessage,
      step: this.getCurrentStep(),
    });
  }

  /**
   * Track payment attempt
   */
  trackPaymentAttempt(
    gateway: string,
    method: string,
    amount: number,
    currency: string
  ): void {
    this.trackEvent("payment_attempt", {
      gateway,
      method,
      amount,
      currency,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track payment result
   */
  trackPaymentResult(
    success: boolean,
    gateway: string,
    processingTime: number,
    errorCode?: string,
    errorMessage?: string
  ): void {
    this.trackEvent("payment_result", {
      success,
      gateway,
      processingTime,
      errorCode,
      errorMessage,
    });
  }

  /**
   * Track page performance
   */
  trackPagePerformance(pageName: string): void {
    if (typeof window === "undefined") return;

    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    if (navigation) {
      const metrics = {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint(),
        largestContentfulPaint: this.getLargestContentfulPaint(),
      };

      this.trackEvent("page_performance", {
        page: pageName,
        ...metrics,
      });

      // Send performance metrics to backend
      Object.entries(metrics).forEach(([name, value]) => {
        if (value > 0) {
          this.sendPerformanceMetric({
            name: `${pageName}_${name}`,
            value,
            unit: "ms",
            timestamp: new Date(),
            metadata: { page: pageName },
          });
        }
      });
    }
  }

  /**
   * Track API call performance
   */
  trackApiCall(
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number,
    success: boolean
  ): void {
    this.trackEvent("api_call", {
      endpoint,
      method,
      duration,
      statusCode,
      success,
    });

    // Send to backend performance monitoring
    this.sendApiPerformance(endpoint, method, duration, statusCode);
  }

  /**
   * Track error occurrence
   */
  trackError(
    errorType: string,
    errorMessage: string,
    stack?: string,
    context?: Record<string, unknown>
  ): void {
    this.trackEvent("error", {
      errorType,
      errorMessage,
      stack,
      context,
      step: this.getCurrentStep(),
      url: window.location.href,
    });
  }

  /**
   * Track conversion
   */
  trackConversion(
    orderId: string,
    orderValue: number,
    currency: string,
    items: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
    }>
  ): void {
    const sessionDuration = Date.now() - this.startTime;

    this.trackEvent("conversion", {
      orderId,
      orderValue,
      currency,
      items,
      sessionDuration,
    });

    // Track final funnel step
    this.trackFunnelStep("order_complete", {
      orderId,
      orderValue,
      currency,
      sessionDuration,
    });
  }

  /**
   * Get analytics summary
   */
  getSessionSummary(): {
    sessionId: string;
    userId?: string;
    storeId?: number;
    duration: number;
    eventCount: number;
    events: AnalyticsEvent[];
  } {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      storeId: this.storeId,
      duration: Date.now() - this.startTime,
      eventCount: this.events.length,
      events: [...this.events],
    };
  }

  /**
   * Flush events to backend
   */
  async flush(): Promise<void> {
    if (this.events.length === 0) return;

    try {
      await fetch("/api/analytics/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          events: this.events,
        }),
      });

      this.events = []; // Clear events after successful send
    } catch (error) {
      console.error("Failed to flush analytics events:", error);
    }
  }

  // Private methods

  private trackEvent(event: string, properties: Record<string, unknown>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: this.userId,
    };

    this.events.push(analyticsEvent);

    // Auto-flush events periodically
    if (this.events.length >= 10) {
      this.flush();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentStep(): string {
    // Determine current checkout step based on URL or state
    const path = window.location.pathname;

    if (path.includes("/checkout")) {
      if (path.includes("/payment")) return "payment_method";
      if (path.includes("/shipping")) return "shipping_address";
      if (path.includes("/review")) return "order_review";
      return "checkout_start";
    }

    if (path.includes("/cart")) return "cart_view";

    return "unknown";
  }

  private initializePerformanceTracking(): void {
    if (typeof window === "undefined") return;

    // Track Core Web Vitals
    if ("PerformanceObserver" in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            this.trackEvent("core_web_vital", {
              metric: "LCP",
              value: entry.startTime,
              unit: "ms",
            });
          }

          if (entry.entryType === "first-input") {
            this.trackEvent("core_web_vital", {
              metric: "FID",
              value:
                (entry as PerformanceEventTiming).processingStart -
                entry.startTime,
              unit: "ms",
            });
          }
        }
      });

      try {
        this.performanceObserver.observe({
          entryTypes: ["largest-contentful-paint", "first-input"],
        });
      } catch (error) {
        console.warn("Performance observer not supported:", error);
      }
    }

    // Track page visibility changes
    document.addEventListener("visibilitychange", () => {
      this.trackEvent("visibility_change", {
        hidden: document.hidden,
        visibilityState: document.visibilityState,
      });
    });

    // Track page unload
    window.addEventListener("beforeunload", () => {
      this.flush();
    });
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType("paint");
    const firstPaint = paintEntries.find(
      (entry) => entry.name === "first-paint"
    );
    return firstPaint ? firstPaint.startTime : 0;
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType("paint");
    const firstContentfulPaint = paintEntries.find(
      (entry) => entry.name === "first-contentful-paint"
    );
    return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
  }

  private getLargestContentfulPaint(): number {
    const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
    const lastEntry = lcpEntries[lcpEntries.length - 1];
    return lastEntry ? lastEntry.startTime : 0;
  }

  private async sendFunnelStep(step: FunnelStep): Promise<void> {
    try {
      await fetch("/api/checkout/analytics/funnel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(step),
      });
    } catch (error) {
      console.error("Failed to send funnel step:", error);
    }
  }

  private async sendPerformanceMetric(
    metric: PerformanceMetric
  ): Promise<void> {
    try {
      await fetch("/api/checkout/analytics/performance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      console.error("Failed to send performance metric:", error);
    }
  }

  private async sendApiPerformance(
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number
  ): Promise<void> {
    try {
      await fetch("/api/checkout/analytics/api-performance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint,
          method,
          duration,
          statusCode,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to send API performance:", error);
    }
  }
}

/**
 * React hook for checkout analytics
 */
export function useCheckoutAnalytics() {
  const analytics = CheckoutAnalytics.getInstance();

  return {
    initialize: analytics.initialize.bind(analytics),
    trackFunnelStep: analytics.trackFunnelStep.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics),
    trackValidationError: analytics.trackValidationError.bind(analytics),
    trackPaymentAttempt: analytics.trackPaymentAttempt.bind(analytics),
    trackPaymentResult: analytics.trackPaymentResult.bind(analytics),
    trackPagePerformance: analytics.trackPagePerformance.bind(analytics),
    trackApiCall: analytics.trackApiCall.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
    getSessionSummary: analytics.getSessionSummary.bind(analytics),
    flush: analytics.flush.bind(analytics),
  };
}

// Export singleton instance
export const checkoutAnalytics = CheckoutAnalytics.getInstance();
