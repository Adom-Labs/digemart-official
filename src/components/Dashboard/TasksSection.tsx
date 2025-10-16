import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2Icon, ClockIcon, FileTextIcon, StoreIcon, BarChart3Icon } from 'lucide-react';
import { TaskSummaryDto, TaskStatsDto } from '@/lib/api/types';

interface TasksSectionProps {
    recentTasks: TaskSummaryDto[];
    stats: TaskStatsDto;
}

export function TasksSection({ recentTasks, stats }: TasksSectionProps) {
    const getTaskIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'listing':
                return FileTextIcon;
            case 'store':
                return StoreIcon;
            case 'analytics':
                return BarChart3Icon;
            default:
                return ClockIcon;
        }
    };

    const getPriorityBadge = (priority: string) => {
        const lowercasePriority = priority.toLowerCase();
        switch (lowercasePriority) {
            case 'high':
            case 'urgent':
                return { label: 'High', className: 'bg-red-500 text-white' };
            case 'medium':
                return { label: 'Medium', className: 'bg-orange-500 text-white' };
            default:
                return { label: 'Low', className: 'bg-gray-500 text-white' };
        }
    };

    if (recentTasks.length === 0) {
        return (
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-foreground">Tasks</h2>
                    <div className="text-sm text-muted-foreground">
                        {stats.completed} / {stats.total} completed ({stats.completionRate}%)
                    </div>
                </div>
                <Card className="border-border bg-card text-card-foreground p-8 text-center">
                    <p className="text-muted-foreground">You have no pending tasks at the moment.</p>
                </Card>
            </section>
        );
    }

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">Recent Tasks</h2>
                <div className="text-sm text-muted-foreground">
                    {stats.completed} / {stats.total} completed ({stats.completionRate}%)
                </div>
            </div>
            <div className="space-y-4">
                {recentTasks.map((task) => {
                    const TaskIcon = getTaskIcon(task.type);
                    const priorityBadge = getPriorityBadge(task.priority);

                    return (
                        <Card key={task.id} className="border-border bg-card text-card-foreground">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                        <TaskIcon className="text-primary" size={20} strokeWidth={2} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="text-base font-medium text-foreground">{task.title}</h3>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <Badge className={task.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                                                    {task.isCompleted ? 'Completed' : 'Pending'}
                                                </Badge>
                                                <Badge className={priorityBadge.className}>{priorityBadge.label}</Badge>
                                            </div>
                                        </div>
                                        {task.description && (
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {task.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground mb-3">
                                            Created: {new Date(task.createdAt).toLocaleDateString()}
                                        </p>
                                        <div className="flex gap-2">
                                            {!task.isCompleted && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => console.log('Complete task', task.id)}
                                                    className="bg-green-500 text-white hover:bg-green-600"
                                                >
                                                    <CheckCircle2Icon className="mr-2" size={16} strokeWidth={2} />
                                                    Complete
                                                </Button>
                                            )}
                                            {task.actionUrl && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="hover:bg-accent"
                                                    onClick={() => {
                                                        if (task.actionUrl) {
                                                            window.location.href = task.actionUrl;
                                                        }
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            )}
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