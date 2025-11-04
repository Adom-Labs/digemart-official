"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/Dashboard/Sidebar";
import { Header } from "@/components/Dashboard/Header";
import { ViewMode } from "./ViewModeToggle";
import WrapContent from "../WrapContent";
import { useUnreadNotificationCount } from "@/lib/api/hooks";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const { data: session } = useSession();
  const { data: unreadData } = useUnreadNotificationCount();

  const userName = session?.user?.name || "User";
  const userIntent: "business-listings" | "ecommerce" | "mixed" | "new-user" =
    "mixed"; // TODO: get from user profile
  const unreadNotificationsCount = unreadData?.unreadCount || 0;

  // Close mobile sidebar and restore body scroll
  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => setMobileSidebarOpen((prev) => !prev);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={closeMobileSidebar}
        userName={userName}
        userIntent={userIntent}
        pendingTasksCount={0} // TODO: get from API
        unreadNotificationsCount={unreadNotificationsCount}
        viewMode={viewMode}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[280px]">
        <Header
          onMobileMenuToggle={toggleMobileSidebar}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <main className="flex-1 overflow-auto">
          <WrapContent
            style={{
              paddingTop: "95px",
            }}
          >
            <div className="pb-5">
              {React.cloneElement(
                children as React.ReactElement<{ viewMode: ViewMode }>,
                { viewMode }
              )}
            </div>
          </WrapContent>
        </main>
      </div>
    </div>
  );
}
