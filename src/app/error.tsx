"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootComplete, setBootComplete] = useState(false);

  const pages = [
    { label: "Reload", path: "__reload__" },
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  // Boot-up typing animation
  useEffect(() => {
    const introLines = [
      "Initializing system modules...",
      "Loading environment variables...",
      "Mounting core components...",
      "Verifying runtime integrity...",
      "ERROR: Fatal exception encountered.",
      "System entering recovery shell...",
      "",
    ];

    let i = 0;
    const interval = setInterval(() => {
      setBootLines((prev) => [...prev, introLines[i]]);
      i++;
      if (i >= introLines.length) {
        clearInterval(interval);
        setTimeout(() => setBootComplete(true), 500);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Handle reload (router + hard reload fallback)
  const handleFullReload = () => {
    try {
      router.refresh(); // Revalidate via Next.js
      setTimeout(() => window.location.reload(), 200); // Ensure full reload
    } catch {
      window.location.reload();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : pages.length - 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < pages.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = pages[selectedIndex];
        if (selected.path === "__reload__") handleFullReload();
        else window.location.href = selected.path;
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleFullReload();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, pages]);

  const timestamp = new Date().toISOString();

  return (
    <div className="relative min-h-screen w-full bg-black text-green-400 font-mono overflow-hidden">
      {/* CRT Scanline & Glow Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(transparent_0_2px,rgba(0,255,0,0.03)_2px_4px)] opacity-40"></div>
      <div className="pointer-events-none absolute inset-0 bg-green-500/5 blur-3xl mix-blend-screen"></div>

      <div className="relative z-10 h-full w-full p-6 md:p-10 overflow-y-auto">
        {/* Boot sequence */}
        {!bootComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1 text-green-300"
          >
            {bootLines.map((line, i) => (
              <div key={i}>&gt; {line}</div>
            ))}
            {showCursor && (
              <span className="inline-block w-2 h-4 bg-green-400 animate-pulse"></span>
            )}
          </motion.div>
        )}

        {/* After boot complete */}
        {bootComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            {/* Header */}
            <div className="text-green-300 mb-4 flex justify-between text-sm border-b border-green-400/30 pb-2">
              <span className="text-red-500">●</span> System Timestamp:{" "}
              {timestamp}
            </div>

            {/* Error details */}
            <div className="text-red-400 mb-2">
              &gt; FATAL: Application Error Detected
            </div>
            <div className="pl-4 text-green-300 mb-2">
              └─ {error.message || "Unknown error occurred"}
            </div>
            {error.stack && (
              <div className="pl-4 text-green-400/70 text-sm mb-6 whitespace-pre-wrap">
                {error.stack
                  .split("\n")
                  .slice(0, 8)
                  .map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
              </div>
            )}

            {/* Actions */}
            <div className="mb-4 text-green-300">&gt; AVAILABLE ACTIONS:</div>
            <div className="pl-4 mb-4 text-green-400/80 text-sm">
              Use <span className="text-yellow-400">↑ ↓</span> to navigate,{" "}
              <span className="text-yellow-400">ENTER</span> to select,{" "}
              <span className="text-yellow-400">R</span> to reload.
            </div>

            <div className="pl-4 space-y-1 mb-8">
              {pages.map((page, index) => (
                <div
                  key={page.path}
                  className={`transition-all duration-150 ${
                    index === selectedIndex
                      ? "bg-green-400 text-black font-bold"
                      : "text-green-400 hover:text-green-200"
                  } px-3 py-1 rounded-sm w-fit cursor-pointer`}
                  onClick={() =>
                    page.path === "__reload__"
                      ? handleFullReload()
                      : (window.location.href = page.path)
                  }
                >
                  {index === selectedIndex ? ">" : " "} {page.label}{" "}
                  <span className="opacity-50">
                    {page.path === "__reload__"
                      ? "(reload current)"
                      : page.path}
                  </span>
                </div>
              ))}
            </div>

            {/* Cursor Line */}
            <div className="flex items-center">
              <span>&gt;</span>
              <span className="ml-2">
                {showCursor && (
                  <span className="inline-block w-2 h-4 bg-green-400 animate-pulse"></span>
                )}
              </span>
            </div>

            {/* Footer */}
            <div className="mt-6 text-green-400/60 text-sm">
              System ready. Awaiting input...
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
