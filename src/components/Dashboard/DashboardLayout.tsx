'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Sidebar } from '@/components/Dashboard/Sidebar';
import { Header } from '@/components/Dashboard/Header';
import { ViewMode } from './ViewModeToggle';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('all');
    const { data: session } = useSession();

    const userName = session?.user?.name || 'User';
    const userIntent: 'business-listings' | 'ecommerce' | 'mixed' | 'new-user' = 'mixed'; // TODO: get from user profile

    const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

    return (
        <div className="flex h-screen bg-background">
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={toggleSidebar}
                userName={userName}
                userIntent={userIntent}
                pendingTasksCount={0} // TODO: get from API
                unreadNotificationsCount={0} // TODO: get from API
                viewMode={viewMode}
            />
            <div className="flex-1 flex flex-col">
                <Header
                    sidebarCollapsed={sidebarCollapsed}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />
                <main className={`flex-1 overflow-auto pt-16 ${sidebarCollapsed ? 'ml-16' : 'ml-[280px]'}`}>
                    <div className="p-6">
                        {React.cloneElement(children as React.ReactElement<{ viewMode: ViewMode }>, { viewMode })}
                    </div>
                </main>
            </div>
        </div>
    );
}
