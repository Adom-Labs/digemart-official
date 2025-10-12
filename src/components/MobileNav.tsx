import { mainNavItems, navIcons } from "@/lib/config/navigation";
import { navVariantByPath } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const path = usePathname();
  const variant = navVariantByPath(path);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={onClose}>
      <div
        className={`absolute right-0 top-0 h-full w-64 bg-linear-to-b ${
          variant === "white"
            ? "from-[#302e71] via-[#1a1a2e] to-[#0f1523]"
            : "from-slate-50 via-white to-white"
        } p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <Link
            href="/"
            className={`flex items-center gap-2 ${
              variant === "white" ? "text-white" : "text-black"
            }`}
          >
            <navIcons.Store className="h-6 w-6" />
            <span className="text-xl font-bold">Digemart</span>
          </Link>
          <button
            aria-label="Close menu"
            className={`${variant === "white" ? "text-white" : "text-black"}`}
            onClick={onClose}
          >
            <navIcons.X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          <ul className="space-y-4">
            {mainNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block py-2 text-lg font-medium ${
                    variant === "white"
                      ? "text-white/90 hover:text-white"
                      : "text-black/90 hover:text-black"
                  }`}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
