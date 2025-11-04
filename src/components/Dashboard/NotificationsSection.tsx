"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2Icon,
  InfoIcon,
  AlertTriangleIcon,
  XCircleIcon,
  CheckIcon,
  ArrowRightIcon,
} from "lucide-react";
import { NotificationSummaryDto } from "@/lib/api/types";
import { useMarkNotificationAsRead } from "@/lib/api/hooks";
import { useRouter } from "next/navigation";

interface NotificationsSectionProps {
  notifications: NotificationSummaryDto[];
  unreadCount: number;
}

export function NotificationsSection({
  notifications,
  unreadCount,
}: NotificationsSectionProps) {
  const router = useRouter();
  const markAsReadMutation = useMarkNotificationAsRead();

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const lowercaseType = type.toLowerCase();
    switch (lowercaseType) {
      case "success":
      case "order":
        return CheckCircle2Icon;
      case "warning":
      case "alert":
        return AlertTriangleIcon;
      case "error":
      case "failed":
        return XCircleIcon;
      default:
        return InfoIcon;
    }
  };

  const getNotificationColor = (type: string) => {
    const lowercaseType = type.toLowerCase();
    switch (lowercaseType) {
      case "success":
      case "order":
        return "text-green-600";
      case "warning":
      case "alert":
        return "text-orange-600";
      case "error":
      case "failed":
        return "text-red-600";
      default:
        return "text-primary";
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (notifications.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-foreground">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/findyourplug/dashboard/notifications")}
            className="text-primary hover:text-primary/80"
          >
            View all
            <ArrowRightIcon className="ml-2 w-4 h-4" />
          </Button>
        </div>
        <Card className="border-border bg-card text-card-foreground p-8 text-center">
          <p className="text-muted-foreground">No notifications yet.</p>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-foreground">
            Recent Notifications
          </h2>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/findyourplug/dashboard/notifications")}
          className="text-primary hover:text-primary/80"
        >
          View all
          <ArrowRightIcon className="ml-2 w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {notifications.map((notification) => {
          const NotificationIcon = getNotificationIcon(notification.type);
          const iconColor = getNotificationColor(notification.type);

          return (
            <Card
              key={notification.id}
              className={`border-border bg-card text-card-foreground transition-all hover:shadow-sm ${
                !notification.isRead ? "border-l-4 border-l-primary" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 ${iconColor}`}
                  >
                    <NotificationIcon size={18} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-medium text-foreground">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <Badge className="bg-primary text-primary-foreground flex-shrink-0 text-xs px-2 py-0">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(notification.createdAt)}
                      </span>
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={markAsReadMutation.isPending}
                            className="hover:bg-accent disabled:opacity-50 h-7 text-xs"
                          >
                            <CheckIcon
                              className="mr-1"
                              size={12}
                              strokeWidth={2}
                            />
                            Mark read
                          </Button>
                        )}
                        {notification.actionUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (notification.actionUrl) {
                                router.push(notification.actionUrl);
                              }
                            }}
                            className="hover:bg-accent h-7 text-xs"
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
