"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Bell, Check, Loader2, Trash2, ExternalLink } from "lucide-react";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "@/lib/api/hooks";
import { NotificationDto } from "@/lib/api/types";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error } = useNotifications({ page, limit });
  const { data: unreadData } = useUnreadNotificationCount();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteMutation = useDeleteNotification();

  const unreadCount = unreadData?.unreadCount || 0;
  const notifications = data?.notifications || [];
  const pagination = data?.pagination;

  const handleMarkAsRead = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleNotificationClick = (notification: NotificationDto) => {
    // Mark as read if unread
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }

    // Navigate to action URL if exists
    const actionUrl = notification.metadata?.actionUrl;
    if (actionUrl) {
      router.push(actionUrl);
    }
  };

  const getNotificationIcon = () => {
    // You can customize icons based on notification type
    return <Bell className="w-5 h-5" />;
  };

  const getNotificationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "welcome":
        return "text-primary";
      case "task":
        return "text-purple-600";
      case "store_update":
        return "text-green-600";
      case "order":
        return "text-orange-600";
      case "payment":
        return "text-emerald-600";
      case "review":
        return "text-pink-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">
          Failed to load notifications
        </h3>
        <p className="text-red-600 dark:text-red-300 text-sm">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Notifications
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Stay updated with your stores and tasks
          </p>
        </div>

        {/* Unread Banner */}
        {unreadCount > 0 && (
          <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              You have {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}
            </p>
            <Button
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              size="sm"
              variant="outline"
              className="border-blue-300 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-900/50"
            >
              {markAllAsReadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Marking...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Mark all as read
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification: NotificationDto) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`
                group relative bg-card border rounded-lg p-4 transition-all
                ${
                  notification.isRead
                    ? "border-border hover:border-border/80"
                    : "border-l-4 border-l-primary border-t border-r border-b border-border bg-primary/5"
                }
                ${
                  notification.metadata?.actionUrl
                    ? "cursor-pointer hover:shadow-sm"
                    : ""
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center ${getNotificationColor(
                    notification.type
                  )}`}
                >
                  {getNotificationIcon()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3
                      className={`text-sm font-medium ${
                        notification.isRead
                          ? "text-foreground"
                          : "text-foreground font-semibold"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                        New
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          disabled={markAsReadMutation.isPending}
                          className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Mark read
                        </button>
                      )}

                      {notification.metadata?.actionUrl && (
                        <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={(e) => handleDelete(notification.id, e)}
                        disabled={deleteMutation.isPending}
                        className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages} ({pagination.total}{" "}
            total)
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <Button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
