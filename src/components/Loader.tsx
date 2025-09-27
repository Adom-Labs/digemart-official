import { Loader2 } from "lucide-react";

export default function Loader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <Loader2
      className={`animate-spin ${
        size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : "w-12 h-12"
      }`}
    />
  );
}
