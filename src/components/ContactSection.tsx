"use client";

import { Mail, MessageCircle, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState } from "react";
import { submitContactForm } from "@/lib/search/action";
import Loader from "./Loader";
import { getErrorMessage } from "@/lib/utils";
import WrapContent from "./WrapContent";

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    privacy: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await submitContactForm({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        message: formData.message,
      });
      if (res.success) {
        setIsSubmitted(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
          privacy: false,
        });
      } else {
        setError(res.error ?? "Something went wrong. Couldn't send message");
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      privacy: checked,
    }));
  };

  return (
    <section className="bg-slate-950 py-12 md:py-24">
      <WrapContent>
        <h2 className="text-3xl font-bold text-white mb-12">Get in touch</h2>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form Container with fixed height */}
          <div className="relative min-h-[600px]">
            {/* Success Message - Absolute positioning */}
            <div
              className={`absolute inset-0 bg-white rounded-lg p-6 md:p-8 text-center
                transition-all duration-300 ease-in-out
                ${
                  isSubmitted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold mb-4">
                  Thank you for your message!
                </h2>
                <p className="text-slate-600 mb-4">
                  We&apos;ll get back to you as soon as possible.
                </p>
                <Button onClick={() => setIsSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            </div>

            {/* Form - Absolute positioning */}
            <div
              className={`absolute inset-0 bg-white rounded-lg p-6 md:p-8
                transition-all duration-300 ease-in-out
                ${
                  isSubmitted
                    ? "opacity-0 -translate-y-4 pointer-events-none"
                    : "opacity-100 translate-y-0"
                }
              `}
            >
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-lg">
                  {error}
                </div>
              )}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First name
                    </label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last name
                    </label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    placeholder="you@company.com"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Your message"
                    required
                    className="min-h-[150px] resize-none"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="privacy"
                    required
                    checked={formData.privacy}
                    onCheckedChange={handleCheckboxChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="privacy" className="text-sm">
                    You agree to our friendly{" "}
                    <Link href="#" className="underline underline-offset-4">
                      privacy policy
                    </Link>
                    .
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-slate-950 hover:bg-slate-900"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader size="sm" /> : "Send message"}
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid sm:grid-cols-2 gap-8 text-white">
            <div className="space-y-2">
              <div className="size-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <Mail className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">Email</h3>
              <p className="text-slate-400">
                Our friendly team is here to help.
              </p>
              <a
                href="mailto:hello@digemart.com"
                className="text-blue-400 hover:text-blue-300"
              >
                hello@digemart.com
              </a>
            </div>
            <div className="space-y-2">
              <div className="size-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <MessageCircle className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">Chat with us</h3>
              <p className="text-slate-400">
                Our friendly team is here to help.
              </p>
              <a
                href="https://wa.me/2349012343840"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                Start new chat on WhatsApp
              </a>
            </div>
            <div className="space-y-2">
              <div className="size-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <MapPin className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">Office</h3>
              <p className="text-slate-400">Come say hello at our office HQ.</p>
              <p>123, Yaya Abatan st, Ogba Lagos.</p>
            </div>
            <div className="space-y-2">
              <div className="size-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <Phone className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">Phone</h3>
              <p className="text-slate-400">Mon-Fri from 8am to 5pm.</p>
              <p>+234 901234 384</p>
            </div>
          </div>
        </div>
      </WrapContent>
    </section>
  );
}
