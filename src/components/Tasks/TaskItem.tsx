"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2Icon,
  ClockIcon,
  FileTextIcon,
  StoreIcon,
  PackageIcon,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Task } from "@/lib/api/tasks";
import { useCompleteTask } from "@/lib/api/hooks/tasks";
import { useRouter } from "next/navigation";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const router = useRouter();
  const completeTaskMutation = useCompleteTask();

  const handleCompleteTask = async () => {
    try {
      await completeTaskMutation.mutateAsync(task.id);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "onboarding":
        return FileTextIcon;
      case "store_setup":
        return StoreIcon;
      case "asset_completion":
        return PackageIcon;
      default:
        return ClockIcon;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const lowercasePriority = priority.toLowerCase();
    switch (lowercasePriority) {
      case "high":
      case "urgent":
        return { label: "High", className: "bg-red-500 text-white" };
      case "medium":
        return { label: "Medium", className: "bg-orange-500 text-white" };
      default:
        return { label: "Low", className: "bg-gray-500 text-white" };
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "onboarding":
        return { label: "Onboarding", className: "bg-blue-100 text-blue-700" };
      case "store_setup":
        return {
          label: "Store Setup",
          className: "bg-purple-100 text-purple-700",
        };
      case "asset_completion":
        return {
          label: "Completion",
          className: "bg-green-100 text-green-700",
        };
      default:
        return { label: type, className: "bg-gray-100 text-gray-700" };
    }
  };

  const TaskIcon = getTaskIcon(task.type);
  const priorityBadge = getPriorityBadge(task.priority);
  const typeBadge = getTypeBadge(task.type);

  return (
    <Card className="border-border bg-card text-card-foreground hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <TaskIcon className="text-primary" size={20} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3
                className={`text-base font-medium ${
                  task.isCompleted
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {task.title}
              </h3>
              <div className="flex gap-2 flex-shrink-0">
                <Badge
                  className={
                    task.isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-white"
                  }
                >
                  {task.isCompleted ? "Completed" : "Pending"}
                </Badge>
                <Badge className={priorityBadge.className}>
                  {priorityBadge.label}
                </Badge>
              </div>
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
              <Badge variant="outline" className={typeBadge.className}>
                {typeBadge.label}
              </Badge>
              <span className="flex items-center gap-1">
                <ClockIcon size={12} />
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
              {task.completedAt && (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2Icon size={12} />
                  Completed {new Date(task.completedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {!task.isCompleted && (
                <Button
                  size="sm"
                  onClick={handleCompleteTask}
                  disabled={completeTaskMutation.isPending}
                  className="bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                >
                  {completeTaskMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2Icon
                        className="mr-2"
                        size={16}
                        strokeWidth={2}
                      />
                      Mark Complete
                    </>
                  )}
                </Button>
              )}
              {task.actionUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  className="hover:bg-accent"
                  onClick={() => router.push(task.actionUrl!)}
                >
                  Go to Task
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
