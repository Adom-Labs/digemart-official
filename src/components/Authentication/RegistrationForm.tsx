"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ROUTES } from "@/lib/routes";

interface RegistrationFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    acceptTerms: boolean;
  }) => void;
  isLoading: boolean;
  error?: string;
}

const RegistrationForm = ({
  onSubmit,
  isLoading,
  error,
}: RegistrationFormProps) => {
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

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      acceptTerms: "",
    });

    if (!formData.name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    if (!formData.acceptTerms) {
      setErrors((prev) => ({
        ...prev,
        acceptTerms: "You must accept the terms and conditions",
      }));
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          className={`h-11 ${errors.name ? "border-destructive" : ""}`}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className={`h-11 ${errors.email ? "border-destructive" : ""}`}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          className={`h-11 ${errors.password ? "border-destructive" : ""}`}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`h-11 ${
            errors.confirmPassword ? "border-destructive" : ""
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword}</p>
        )}
      </div>

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
          {errors.acceptTerms && (
            <p className="text-sm text-destructive">{errors.acceptTerms}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full h-11" disabled={isLoading}>
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
