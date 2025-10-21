'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    User,
    Shield,
    Users,
} from 'lucide-react';

const settingsSections = [
    {
        name: 'Profile',
        href: '/findyourplug/dashboard/settings',
        icon: User,
        description: 'Manage your profile information',
    },
    {
        name: 'Security',
        href: '/findyourplug/dashboard/settings/security',
        icon: Shield,
        description: 'Password and authentication',
    },
    {
        name: 'Connected Accounts',
        href: '/findyourplug/dashboard/settings/accounts',
        icon: Users,
        description: 'Manage login methods',
    },
];

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <aside className="lg:col-span-1">
                    <nav className="space-y-1">
                        {settingsSections.map((section) => {
                            const Icon = section.icon;
                            const isActive = pathname === section.href;

                            return (
                                <Link
                                    key={section.href}
                                    href={section.href}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                                        isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted text-muted-foreground'
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    <div className="flex-1 hidden md:block">
                                        <div className="font-medium">{section.name}</div>
                                        <div className="text-xs opacity-70">
                                            {section.description}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-3">{children}</main>
            </div>
        </div>
    );
}
