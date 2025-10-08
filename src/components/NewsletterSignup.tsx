"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailOpen } from "lucide-react";

export function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEmail("");
        setName("");
    };

    return (
        <div className="text-center">
            <div className="inline-block p-3 bg-teal-100 rounded-full mb-4">
                <MailOpen className="h-6 w-6 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Be The First To Know</h2>
            <p className="text-gray-600 mb-6">
                Sign up to be notified when our deals section launches. Get early access to exclusive discounts and special
                offers.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="coming soon..."
                            required
                            disabled
                        />
                    </div>

                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                        Notify Me When Deals Launch
                    </Button>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                    By subscribing, you agree to receive marketing emails from us. You can unsubscribe at any time.
                </p>
            </form>
        </div>
    );
}
