"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { JSX } from "react";
import Logo from "./Logo"; 
import externalLinks from "@/lib/external-links";

function Footer(): JSX.Element {
  return (
    <footer className="bg-[#232323] text-gray-300 text-sm">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Logo isWhite />
            </div>
            <p className="mb-4 text-gray-400">
              Your one-stop destination for all digital shopping needs.
              Connecting customers with the best online stores.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href={externalLinks.facebook}
                aria-label="Facebook"
                className="hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={18} />
              </a>
              <a
                href={externalLinks.twitter}
                aria-label="Twitter"
                className="hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={18} />
              </a>
              <a
                href={externalLinks.instagram}
                aria-label="Instagram"
                className="hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">QUICK LINKS</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/findyourplug/plugs">Stores</Link>
              </li>
              <li>
                <Link href="/products">Products</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          {/* Category */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              FOR VENDORS & LOGISTICS
            </h3>
            <ul className="space-y-2">
              <li>
                <Link target="_blank" href="https://vendor.digemart.com">
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link target="_blank" href="https://logistics.digemart.com">
                  Logistics Dashboard
                </Link>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-3">NEWSLETTER</h3>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 rounded bg-[#181818] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-gray-200"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded font-semibold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-5 flex flex-col md:flex-row items-center justify-between">
          <span className="text-xs text-gray-500">
            {" "}
            2023 Digemart. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
