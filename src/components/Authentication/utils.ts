import { Dispatch, SetStateAction } from "react";

interface formData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  acceptTerms: boolean;
}

interface RegistrationErrors {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  acceptTerms: string;
}

export interface RegistrationFormProps {
  onSubmit: (data: formData) => void;
  isLoading: boolean;
  error?: string;
}

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 6;
};

export const handleSubmit = (
  e: React.FormEvent,
  setErrors: Dispatch<SetStateAction<RegistrationErrors>>,
  formData: formData,
  onSubmit: (data: formData) => void
) => {
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

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFormData: Dispatch<SetStateAction<formData>>
) => {
  const { name, value, type, checked } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

export const getRegistrationInputProps = (
  formData: formData,
  setFormData: Dispatch<SetStateAction<formData>>,
  errors: RegistrationErrors
) => [
  {
    id: "name",
    label: "Full Name",
    name: "name",
    type: "text",
    placeholder: "Enter your full name",
    value: formData.name,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(e, setFormData);
    },
    className: `h-11 ${errors.name ? "border-destructive" : ""}`,
    error: errors.name,
  },
  {
    id: "email",
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    value: formData.email,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(e, setFormData);
    },
    className: `h-11 ${errors.email ? "border-destructive" : ""}`,
    error: errors.email,
  },
  {
    id: "password",
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Create a password",
    value: formData.password,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(e, setFormData);
    },
    className: `h-11 ${errors.password ? "border-destructive" : ""}`,
    error: errors.password,
  },
  {
    id: "confirmPassword",
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    placeholder: "Confirm your password",
    value: formData.confirmPassword,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(e, setFormData);
    },
    className: `h-11 ${errors.confirmPassword ? "border-destructive" : ""}`,
    error: errors.confirmPassword,
  },
];
