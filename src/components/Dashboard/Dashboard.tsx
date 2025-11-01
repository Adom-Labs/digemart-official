"use client";

import { WelcomeSection } from "./WelcomeSection";
import { QuickActionsGrid } from "./QuickActionsGrid";
import { StoreOverview } from "./StoreOverview";
import { TasksSection } from "./TasksSection";
import { NotificationsSection } from "./NotificationsSection";
import { ViewMode } from "./ViewModeToggle";
import { useDashboardOverview } from "@/lib/api/hooks";
import Loader from "@/components/Loader";
import WrapContent from "../WrapContent";

interface DashboardProps {
  viewMode?: ViewMode;
}

export function Dashboard({ viewMode = "all" }: DashboardProps) {
  // NOTE: viewMode is UI-only, not sent to API - used for filtering display only
  const { data, isLoading, error } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto xl:mx-0">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">
            Failed to load dashboard data
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <WelcomeSection />
      <QuickActionsGrid viewMode={viewMode} />
      <StoreOverview
        viewMode={viewMode}
        listings={data.listings}
        ecommerce={data.ecommerce}
        stats={data.storesStats}
      />
      <TasksSection recentTasks={data.recentTasks} stats={data.taskStats} />
      <NotificationsSection
        notifications={data.recentNotifications}
        unreadCount={data.unreadNotificationsCount}
      />
    </>
  );
}
