"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Search,
    Store,
    User,
    Menu,
    X,
    Plus,
    Home,
    Compass,
    TrendingUp,
    Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

export function FindYourPlugHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(path + "/");
    };

    const navigation = [
        {
            name: "Home",
            href: "/findyourplug",
            icon: Home,
            exact: true,
        },
        {
            name: "Discover",
            href: "/findyourplug/plugs",
            icon: Compass,
        },
        {
            name: "Categories",
            href: "/findyourplug/categories",
            icon: TrendingUp,
        },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/findyourplug" className="flex items-center gap-2 font-bold text-xl">
                        <Logo isIcon />
                        <span className="hidden sm:inline">Find Your Plug</span>
                        <span className="sm:hidden">FYP</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = item.exact
                                ? pathname === item.href
                                : isActive(item.href);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                        active
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search Button - Desktop */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden sm:flex"
                            onClick={() => {
                                // Scroll to search or open search modal
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Create Store */}
                        <Link href="/findyourplug/dashboard/stores/create">
                            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create Store
                            </Button>
                        </Link>

                        {/* User Menu */}
                        <Link href="/findyourplug/dashboard">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "rounded-full",
                                    isActive("/findyourplug/dashboard") && "bg-primary/10"
                                )}
                            >
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t py-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = item.exact
                                ? pathname === item.href
                                : isActive(item.href);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                        active
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}

                        <div className="pt-4 border-t mt-4">
                            <Link href="/findyourplug/dashboard/stores/create" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full justify-start gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Store
                                </Button>
                            </Link>
                        </div>

                        <Link href="/findyourplug/dashboard" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <User className="h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>

                        <Link href="/findyourplug/settings" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <Settings className="h-4 w-4" />
                                Settings
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
