"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckoutStep {
  id: string;
  title: string;
  description: string;
}

interface CheckoutProgressProps {
  steps: CheckoutStep[];
  currentStep: string;
  completedSteps: string[];
  className?: string;
}

export function CheckoutProgress({
  steps,
  currentStep,
  completedSteps,
  className,
}: CheckoutProgressProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop progress bar */}
      <div className="hidden md:block">
        <nav aria-label="Checkout progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = step.id === currentStep;
              const isUpcoming = index > currentStepIndex;

              return (
                <li key={step.id} className="flex-1 relative">
                  <div className="flex items-center">
                    {/* Step indicator */}
                    <div className="flex items-center justify-center">
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                          {
                            "bg-blue-600 border-blue-600 text-white":
                              isCompleted,
                            "bg-blue-600 border-blue-600 text-white/90": isCurrent,
                            "bg-white border-gray-300 text-gray-500":
                              isUpcoming,
                          }
                        )}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-medium">
                            {index + 1}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Step content */}
                    <div className="ml-4 min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium transition-colors duration-200",
                          {
                            "text-blue-600": isCompleted || isCurrent,
                            "text-gray-500": isUpcoming,
                          }
                        )}
                      >
                        {step.title}
                      </p>
                      <p
                        className={cn(
                          "text-xs transition-colors duration-200",
                          {
                            "text-blue-500": isCompleted || isCurrent,
                            "text-gray-400": isUpcoming,
                          }
                        )}
                      >
                        {step.description}
                      </p>
                    </div>

                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "absolute top-5 left-10 w-full h-0.5 transition-colors duration-200",
                          {
                            "bg-blue-600": isCompleted,
                            "bg-gray-300": !isCompleted,
                          }
                        )}
                        style={{ width: "calc(100% - 2.5rem)" }}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Mobile progress bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-900">
            Step {currentStepIndex + 1} of {steps.length}
          </p>
          <p className="text-sm text-gray-500">
            {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
            Complete
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        {/* Current step info */}
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            {steps[currentStepIndex]?.title}
          </h3>
          <p className="text-sm text-gray-500">
            {steps[currentStepIndex]?.description}
          </p>
        </div>
      </div>
    </div>
  );
}
