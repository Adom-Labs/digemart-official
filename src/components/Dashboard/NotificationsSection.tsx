import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2Icon, InfoIcon, AlertTriangleIcon, XCircleIcon, CheckIcon } from 'lucide-react';
import { NotificationSummaryDto } from '@/lib/api/types';

interface NotificationsSectionProps {
    notifications: NotificationSummaryDto[];
    unreadCount: number;
}

export function NotificationsSection({ notifications, unreadCount }: NotificationsSectionProps) {
    const getNotificationIcon = (type: string) => {
        const lowercaseType = type.toLowerCase();
        switch (lowercaseType) {
            case 'success':
            case 'order':
                return CheckCircle2Icon;
            case 'warning':
            case 'alert':
                return AlertTriangleIcon;
            case 'error':
            case 'failed':
                return XCircleIcon;
            default:
                return InfoIcon;
        }
    };

    const getNotificationColor = (type: string) => {
        const lowercaseType = type.toLowerCase();
        switch (lowercaseType) {
            case 'success':
            case 'order':
                return 'text-green-600';
            case 'warning':
            case 'alert':
                return 'text-orange-600';
            case 'error':
            case 'failed':
                return 'text-red-600';
            default:
                return 'text-blue-600';
        }
    };

    const formatTimestamp = (timestamp: string | Date) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Just now';
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
                    <h2 className="text-2xl font-semibold text-foreground">Notifications</h2>
                    {unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground">
                            {unreadCount} unread
                        </Badge>
                    )}
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
                <h2 className="text-2xl font-semibold text-foreground">Recent Notifications</h2>
                {unreadCount > 0 && (
                    <Badge className="bg-primary text-primary-foreground">
                        {unreadCount} unread
                    </Badge>
                )}
            </div>
            <div className="space-y-4">
                {notifications.map((notification) => {
                    const NotificationIcon = getNotificationIcon(notification.type);
                    const iconColor = getNotificationColor(notification.type);

                    return (
                        <Card
                            key={notification.id}
                            className={`border-border bg-card text-card-foreground ${!notification.isRead ? 'border-l-4 border-l-primary' : ''
                                }`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                                        <NotificationIcon size={20} strokeWidth={2} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="text-base font-medium text-foreground">
                                                {notification.title}
                                            </h3>
                                            {!notification.isRead && (
                                                <Badge className="bg-primary text-primary-foreground flex-shrink-0">
                                                    New
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">
                                                {formatTimestamp(notification.createdAt)}
                                            </span>
                                            <div className="flex gap-2">
                                                {!notification.isRead && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => console.log('Mark as read', notification.id)}
                                                        className="hover:bg-accent"
                                                    >
                                                        <CheckIcon className="mr-2" size={14} strokeWidth={2} />
                                                        Mark as read
                                                    </Button>
                                                )}
                                                {notification.actionUrl && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            if (notification.actionUrl) {
                                                                window.location.href = notification.actionUrl;
                                                            }
                                                        }}
                                                        className="hover:bg-accent"
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