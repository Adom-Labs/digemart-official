"use client";
import React, { JSX } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";

const Logo = ({
  link = "/",
  src = "/logo.png",
  alt = "app logo",
  isIcon = false,
  text = "",
  className,
  isWhite = false,
}: {
  link?: string;
  src?: string;
  alt?: string;
  isIcon?: boolean;
  text?: React.ReactNode;
  className?: string;
  isWhite?: boolean;
}): JSX.Element => {
  const mainSrc = isWhite ? "/logo-white.png" : src;
  const SRC = !isIcon ? mainSrc || "/logo.png" : "/logo-icon.png";
  const altText = isIcon ? alt || "app logo" : alt || "app logo icon";
  const clx = isIcon ? "h-[40px] w-[40px]" : "h-[80px] w-[120px]";
  const height = isIcon ? "40" : "80";
  const width = isIcon ? "40" : "120";

  return (
    <Link className="min-h-[50px] flex items-center" href={link}>
      <img
        alt={altText}
        height={height}
        src={SRC}
        style={{ objectFit: "contain" }}
        width={width}
        className={cn(clx, className)}
      />
      {text}
    </Link>
  );
};

export default Logo;
