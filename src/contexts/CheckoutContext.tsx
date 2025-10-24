"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  CheckoutData,
  CheckoutSession,
  CheckoutTotals,
  CheckoutValidationResult,
  useCheckoutSessionManager,
  useCheckoutStepValidation,
  useInitializeCheckout,
} from "@/lib/api/hooks/checkout";

// Types
export type CheckoutStep = "customer_info" | "shipping" | "payment" | "review";

export interface CheckoutState {
  // Session management
  sessionId: string | null;
  session: CheckoutSession | null;
  isSessionLoading: boolean;
  sessionError: any;

  // Current step
  currentStep: CheckoutStep;
  completedSteps: Set<CheckoutStep>;
  canProceedToStep: (step: CheckoutStep) => boolean;

  // Form data
  customerInfo: CheckoutData["customerInfo"] | null;
  shippingAddress: CheckoutData["shippingAddress"] | null;
  paymentMethod: CheckoutData["paymentMethod"] | null;

  // Validation and totals
  validation: CheckoutValidationResult | null;
  totals: CheckoutTotals | null;
  isValidating: boolean;
  validationError: any;

  // Loading states
  isInitializing: boolean;
  isSaving: boolean;
  isCompleting: boolean;

  // Error handling
  errors: Record<string, string>;
  warnings: string[];

  // Store context
  storeId: number | null;
}

export type CheckoutAction =
  | {
      type: "SET_SESSION";
      payload: { sessionId: string; session: CheckoutSession };
    }
  | { type: "SET_SESSION_LOADING"; payload: boolean }
  | { type: "SET_SESSION_ERROR"; payload: any }
  | { type: "SET_CURRENT_STEP"; payload: CheckoutStep }
  | { type: "COMPLETE_STEP"; payload: CheckoutStep }
  | { type: "SET_CUSTOMER_INFO"; payload: CheckoutData["customerInfo"] }
  | { type: "SET_SHIPPING_ADDRESS"; payload: CheckoutData["shippingAddress"] }
  | { type: "SET_PAYMENT_METHOD"; payload: CheckoutData["paymentMethod"] }
  | {
      type: "SET_VALIDATION";
      payload: { validation: CheckoutValidationResult; totals: CheckoutTotals };
    }
  | { type: "SET_VALIDATING"; payload: boolean }
  | { type: "SET_VALIDATION_ERROR"; payload: any }
  | { type: "SET_INITIALIZING"; payload: boolean }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_COMPLETING"; payload: boolean }
  | { type: "SET_ERROR"; payload: { field: string; message: string } }
  | { type: "CLEAR_ERROR"; payload: string }
  | { type: "SET_WARNINGS"; payload: string[] }
  | { type: "SET_STORE_ID"; payload: number }
  | { type: "RESET_CHECKOUT" };

const initialState: CheckoutState = {
  sessionId: null,
  session: null,
  isSessionLoading: false,
  sessionError: null,
  currentStep: "customer_info",
  completedSteps: new Set(),
  canProceedToStep: (step: CheckoutStep) => false,
  customerInfo: null,
  shippingAddress: null,
  paymentMethod: null,
  validation: null,
  totals: null,
  isValidating: false,
  validationError: null,
  isInitializing: false,
  isSaving: false,
  isCompleting: false,
  errors: {},
  warnings: [],
  storeId: null,
};

function checkoutReducer(
  state: CheckoutState,
  action: CheckoutAction
): CheckoutState {
  switch (action.type) {
    case "SET_SESSION":
      return {
        ...state,
        sessionId: action.payload.sessionId,
        session: action.payload.session,
        storeId: action.payload.session.storeId,
        currentStep: action.payload.session.step,
        customerInfo: action.payload.session.data.customerInfo || null,
        shippingAddress: action.payload.session.data.shippingAddress || null,
        paymentMethod: action.payload.session.data.paymentMethod || null,
        totals: action.payload.session.data.totals || null,
      };

    case "SET_SESSION_LOADING":
      return { ...state, isSessionLoading: action.payload };

    case "SET_SESSION_ERROR":
      return {
        ...state,
        sessionError: action.payload,
        isSessionLoading: false,
      };

    case "SET_CURRENT_STEP":
      return { ...state, currentStep: action.payload };

    case "COMPLETE_STEP":
      return {
        ...state,
        completedSteps: new Set([...state.completedSteps, action.payload]),
      };

    case "SET_CUSTOMER_INFO":
      return { ...state, customerInfo: action.payload };

    case "SET_SHIPPING_ADDRESS":
      return { ...state, shippingAddress: action.payload };

    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.payload };

    case "SET_VALIDATION":
      return {
        ...state,
        validation: action.payload.validation,
        totals: action.payload.totals,
        isValidating: false,
        validationError: null,
      };

    case "SET_VALIDATING":
      return { ...state, isValidating: action.payload };

    case "SET_VALIDATION_ERROR":
      return {
        ...state,
        validationError: action.payload,
        isValidating: false,
      };

    case "SET_INITIALIZING":
      return { ...state, isInitializing: action.payload };

    case "SET_SAVING":
      return { ...state, isSaving: action.payload };

    case "SET_COMPLETING":
      return { ...state, isCompleting: action.payload };

    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.message,
        },
      };

    case "CLEAR_ERROR":
      const { [action.payload]: _, ...remainingErrors } = state.errors;
      return { ...state, errors: remainingErrors };

    case "SET_WARNINGS":
      return { ...state, warnings: action.payload };

    case "SET_STORE_ID":
      return { ...state, storeId: action.payload };

    case "RESET_CHECKOUT":
      return { ...initialState };

    default:
      return state;
  }
}

// Step validation logic
const getStepRequirements = (step: CheckoutStep): CheckoutStep[] => {
  switch (step) {
    case "customer_info":
      return [];
    case "shipping":
      return ["customer_info"];
    case "payment":
      return ["customer_info", "shipping"];
    case "review":
      return ["customer_info", "shipping", "payment"];
    default:
      return [];
  }
};

const canProceedToStep = (
  targetStep: CheckoutStep,
  completedSteps: Set<CheckoutStep>
): boolean => {
  const requirements = getStepRequirements(targetStep);
  return requirements.every((step) => completedSteps.has(step));
};

// Context
const CheckoutContext = createContext<{
  state: CheckoutState;
  dispatch: React.Dispatch<CheckoutAction>;
  actions: {
    initializeCheckout: (storeId: number) => Promise<void>;
    goToStep: (step: CheckoutStep) => Promise<void>;
    updateCustomerInfo: (info: CheckoutData["customerInfo"]) => Promise<void>;
    updateShippingAddress: (
      address: CheckoutData["shippingAddress"]
    ) => Promise<void>;
    updatePaymentMethod: (
      method: CheckoutData["paymentMethod"]
    ) => Promise<void>;
    validateCurrentStep: () => Promise<boolean>;
    completeStep: (step: CheckoutStep) => void;
    setError: (field: string, message: string) => void;
    clearError: (field: string) => void;
    resetCheckout: () => void;
  };
} | null>(null);

// Provider component
export const CheckoutProvider: React.FC<{
  children: React.ReactNode;
  storeId?: number;
  sessionId?: string;
}> = ({ children, storeId, sessionId }) => {
  const [state, dispatch] = useReducer(checkoutReducer, {
    ...initialState,
    storeId: storeId || null,
    sessionId: sessionId || null,
    canProceedToStep: (step: CheckoutStep) =>
      canProceedToStep(step, initialState.completedSteps),
  });

  const router = useRouter();

  // Hooks for API operations
  const initializeCheckout = useInitializeCheckout();
  const stepValidation = useCheckoutStepValidation();
  const sessionManager = useCheckoutSessionManager(state.sessionId || "");

  // Update state when session changes
  useEffect(() => {
    if (sessionManager.session && state.sessionId) {
      dispatch({
        type: "SET_SESSION",
        payload: {
          sessionId: state.sessionId,
          session: sessionManager.session,
        },
      });
    }
  }, [sessionManager.session, state.sessionId]);

  // Update canProceedToStep function when completedSteps change
  useEffect(() => {
    dispatch({
      type: "SET_SESSION",
      payload: {
        sessionId: state.sessionId || "",
        session: {
          ...state.session!,
          data: {
            ...state.session?.data!,
            canProceedToStep: (step: CheckoutStep) =>
              canProceedToStep(step, state.completedSteps),
          } as any,
        },
      },
    });
  }, [state.completedSteps]);

  // Actions
  const actions = {
    initializeCheckout: async (storeId: number) => {
      try {
        dispatch({ type: "SET_INITIALIZING", payload: true });
        dispatch({ type: "SET_STORE_ID", payload: storeId });

        const result = await initializeCheckout.initializeCheckout(storeId);

        dispatch({
          type: "SET_SESSION",
          payload: {
            sessionId: result.session.id,
            session: result.session,
          },
        });

        dispatch({
          type: "SET_VALIDATION",
          payload: {
            validation: result.validation,
            totals: result.totals,
          },
        });

        toast.success("Checkout initialized successfully");
      } catch (error: any) {
        dispatch({ type: "SET_SESSION_ERROR", payload: error });
        toast.error(error.message || "Failed to initialize checkout");
        throw error;
      } finally {
        dispatch({ type: "SET_INITIALIZING", payload: false });
      }
    },

    goToStep: async (step: CheckoutStep) => {
      if (!canProceedToStep(step, state.completedSteps)) {
        toast.error("Please complete previous steps first");
        return;
      }

      try {
        if (state.sessionId) {
          await sessionManager.updateStep(step);
        }
        dispatch({ type: "SET_CURRENT_STEP", payload: step });
      } catch (error: any) {
        toast.error("Failed to navigate to step");
        throw error;
      }
    },

    updateCustomerInfo: async (info: CheckoutData["customerInfo"]) => {
      try {
        dispatch({ type: "SET_SAVING", payload: true });
        dispatch({ type: "SET_CUSTOMER_INFO", payload: info });

        if (state.sessionId) {
          await sessionManager.updateSessionData({ customerInfo: info });
        }

        // Auto-validate step
        await actions.validateCurrentStep();
      } catch (error: any) {
        toast.error("Failed to update customer information");
        throw error;
      } finally {
        dispatch({ type: "SET_SAVING", payload: false });
      }
    },

    updateShippingAddress: async (address: CheckoutData["shippingAddress"]) => {
      try {
        dispatch({ type: "SET_SAVING", payload: true });
        dispatch({ type: "SET_SHIPPING_ADDRESS", payload: address });

        if (state.sessionId) {
          await sessionManager.updateSessionData({ shippingAddress: address });
        }

        // Auto-validate step with new address
        await actions.validateCurrentStep();
      } catch (error: any) {
        toast.error("Failed to update shipping address");
        throw error;
      } finally {
        dispatch({ type: "SET_SAVING", payload: false });
      }
    },

    updatePaymentMethod: async (method: CheckoutData["paymentMethod"]) => {
      try {
        dispatch({ type: "SET_SAVING", payload: true });
        dispatch({ type: "SET_PAYMENT_METHOD", payload: method });

        if (state.sessionId) {
          await sessionManager.updateSessionData({ paymentMethod: method });
        }
      } catch (error: any) {
        toast.error("Failed to update payment method");
        throw error;
      } finally {
        dispatch({ type: "SET_SAVING", payload: false });
      }
    },

    validateCurrentStep: async (): Promise<boolean> => {
      if (!state.storeId || !state.session?.data.items) {
        return false;
      }

      try {
        dispatch({ type: "SET_VALIDATING", payload: true });

        const validationData = {
          storeId: state.storeId,
          items: state.session.data.items,
          shippingAddress: state.shippingAddress || undefined,
        };

        const result = await stepValidation.validateStep(validationData);

        dispatch({
          type: "SET_VALIDATION",
          payload: {
            validation: result.validation,
            totals: result.totals,
          },
        });

        if (result.validation.warnings.length > 0) {
          dispatch({
            type: "SET_WARNINGS",
            payload: result.validation.warnings,
          });
        }

        return result.validation.isValid;
      } catch (error: any) {
        dispatch({ type: "SET_VALIDATION_ERROR", payload: error });
        return false;
      }
    },

    completeStep: (step: CheckoutStep) => {
      dispatch({ type: "COMPLETE_STEP", payload: step });

      // Auto-advance to next step if possible
      const stepOrder: CheckoutStep[] = [
        "customer_info",
        "shipping",
        "payment",
        "review",
      ];
      const currentIndex = stepOrder.indexOf(step);
      const nextStep = stepOrder[currentIndex + 1];

      if (
        nextStep &&
        canProceedToStep(nextStep, new Set([...state.completedSteps, step]))
      ) {
        dispatch({ type: "SET_CURRENT_STEP", payload: nextStep });
      }
    },

    setError: (field: string, message: string) => {
      dispatch({ type: "SET_ERROR", payload: { field, message } });
    },

    clearError: (field: string) => {
      dispatch({ type: "CLEAR_ERROR", payload: field });
    },

    resetCheckout: () => {
      dispatch({ type: "RESET_CHECKOUT" });
    },
  };

  // Auto-save form data with debouncing
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (
      state.sessionId &&
      (state.customerInfo || state.shippingAddress || state.paymentMethod)
    ) {
      // Clear previous timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout for auto-save
      autoSaveTimeoutRef.current = setTimeout(() => {
        sessionManager.updateSessionData({
          customerInfo: state.customerInfo || undefined,
          shippingAddress: state.shippingAddress || undefined,
          paymentMethod: state.paymentMethod || undefined,
        });
      }, 2000); // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [
    state.customerInfo,
    state.shippingAddress,
    state.paymentMethod,
    state.sessionId,
  ]);

  // Handle session expiration
  useEffect(() => {
    if (sessionManager.isExpired) {
      toast.error("Your checkout session has expired. Please start over.");
      actions.resetCheckout();
      router.push(`/store/${state.storeId}`);
    }
  }, [sessionManager.isExpired]);

  const contextValue = {
    state: {
      ...state,
      canProceedToStep: (step: CheckoutStep) =>
        canProceedToStep(step, state.completedSteps),
    },
    dispatch,
    actions,
  };

  return (
    <CheckoutContext.Provider value={contextValue}>
      {children}
    </CheckoutContext.Provider>
  );
};

// Hook to use checkout context
export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};

// Hook for checkout step navigation
export const useCheckoutNavigation = () => {
  const { state, actions } = useCheckout();

  const stepOrder: CheckoutStep[] = [
    "customer_info",
    "shipping",
    "payment",
    "review",
  ];
  const currentStepIndex = stepOrder.indexOf(state.currentStep);

  return {
    currentStep: state.currentStep,
    currentStepIndex,
    totalSteps: stepOrder.length,
    canGoNext: currentStepIndex < stepOrder.length - 1,
    canGoPrevious: currentStepIndex > 0,
    nextStep: stepOrder[currentStepIndex + 1] || null,
    previousStep: stepOrder[currentStepIndex - 1] || null,
    goNext: async () => {
      const nextStep = stepOrder[currentStepIndex + 1];
      if (nextStep) {
        await actions.goToStep(nextStep);
      }
    },
    goPrevious: async () => {
      const previousStep = stepOrder[currentStepIndex - 1];
      if (previousStep) {
        await actions.goToStep(previousStep);
      }
    },
    goToStep: actions.goToStep,
    completeCurrentStep: () => actions.completeStep(state.currentStep),
    isStepCompleted: (step: CheckoutStep) => state.completedSteps.has(step),
    canProceedToStep: state.canProceedToStep,
  };
};

// Hook for form data persistence
export const useCheckoutFormPersistence = () => {
  const { state, actions } = useCheckout();

  return {
    customerInfo: state.customerInfo,
    shippingAddress: state.shippingAddress,
    paymentMethod: state.paymentMethod,
    updateCustomerInfo: actions.updateCustomerInfo,
    updateShippingAddress: actions.updateShippingAddress,
    updatePaymentMethod: actions.updatePaymentMethod,
    isSaving: state.isSaving,
    errors: state.errors,
    setError: actions.setError,
    clearError: actions.clearError,
  };
};

// Hook for checkout validation
export const useCheckoutValidation = () => {
  const { state, actions } = useCheckout();

  return {
    validation: state.validation,
    totals: state.totals,
    isValidating: state.isValidating,
    validationError: state.validationError,
    warnings: state.warnings,
    validateCurrentStep: actions.validateCurrentStep,
    isValid: state.validation?.isValid || false,
    hasErrors: state.validation ? !state.validation.isValid : true,
    hasWarnings: state.warnings.length > 0,
  };
};
