import { navVariantByPath } from "@/lib/utils";
import Logo from "./Logo";
import WrapContent from "./WrapContent";
import { usePathname } from "next/navigation";
import { mainNavItems, navIcons } from "@/lib/config/navigation";
import Link from "next/link";
import SearchDialog from "./SearchDialog";
import { ROUTES } from "@/lib/routes";

const NavBar = ({ onMobileMenuOpen }: { onMobileMenuOpen: () => void }) => {
  const path = usePathname();
  const variant = navVariantByPath(path);
  return (
    <header className="absolute w-full py-6">
      <WrapContent>
        <div className="flex items-center justify-between">
          <Logo isWhite={variant === "white"} />
          <nav className="hidden lg:block">
            <div
              className={`flex items-center rounded-full border ${variant === "white" ? "border-white/20" : "border-black/20"
                } px-8 py-2`}
            >
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-6 py-2 ${variant === "white"
                    ? "text-white/90 hover:text-white"
                    : "text-black/90 hover:text-black"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <SearchDialog variant={variant === "white" ? "white" : "dark"} />
            <Link
              href={ROUTES.LOGIN}
              className={`text-sm font-medium ${variant === "white"
                ? "text-white/90 hover:text-white"
                : "text-black/90 hover:text-black"
                }`}
            >
              Sign in
            </Link>
            <button
              aria-label="Menu"
              className={`${variant === "white" ? "text-white" : "text-black"
                } lg:hidden`}
              onClick={onMobileMenuOpen}
            >
              <navIcons.Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </WrapContent>
    </header>
  );
};

export default NavBar;
