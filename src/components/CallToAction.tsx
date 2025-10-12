import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function CallToAction() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Left Column */}
      <div className="flex flex-col justify-center gap-8 bg-primary px-6 py-12 text-white lg:px-12">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Transform your
          <br />
          business today
        </h1>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Check className="mt-1 size-5 shrink-0" />
            <p className="text-lg">
              Manage your business listings easily. Reach more customers
              instantly.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Check className="mt-1 size-5 shrink-0" />
            <p className="text-lg">
              Complete vendor dashboard with analytics, customer insights, and
              business tools.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href={ROUTES.SIGNUP}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-semibold text-blue-600 hover:bg-white/90"
          >
            Get Started Now
          </Link>
          <Link
            href={ROUTES.CONTACT}
            className="inline-flex h-12 items-center justify-center rounded-lg border border-white bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Right Column */}
      <div className="relative hidden lg:block">
        <Image
          src="/preview.png"
          alt="eKiosk vendor dashboard preview"
          className="object-cover"
          fill
          sizes="50vw"
          priority
        />
      </div>
    </div>
  );
}
