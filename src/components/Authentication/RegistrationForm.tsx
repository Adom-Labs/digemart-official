"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { ROUTES } from "@/lib/routes";
import {
  getRegistrationInputProps,
  handleSubmit,
  RegistrationFormProps,
} from "./utils";

const RegistrationForm = ({
  onSubmit,
  isLoading,
  error,
}: RegistrationFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    acceptTerms: "",
  });

  return (
    <form
      onSubmit={(e: React.FormEvent) =>
        handleSubmit(e, setErrors, formData, onSubmit)
      }
      className="space-y-4"
    >
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {getRegistrationInputProps(formData, setFormData, errors).map(
        (item, index) => (
          <div className="space-y-2" key={index}>
            <Label htmlFor={item.id}>{item.label}</Label>
            <div className="relative">
              <Input
                {...item}
                type={
                  item.id === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : item.id === "confirmPassword"
                    ? showConfirmPassword
                      ? "text"
                      : "password"
                    : item.type
                }
              />
              {item.id === "password" && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              )}
              {item.id === "confirmPassword" && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              )}
            </div>
            {item.error && (
              <p className="text-sm text-destructive">{item.error}</p>
            )}
          </div>
        )
      )}

      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({
              ...prev,
              acceptTerms: checked as boolean,
            }))
          }
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </label>
          {errors.acceptTerms && !formData.acceptTerms && (
            <p className="text-sm text-destructive">{errors.acceptTerms}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11"
        disabled={
          isLoading || (errors.acceptTerms !== "" && !formData.acceptTerms)
        }
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Create Account"
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegistrationForm;
