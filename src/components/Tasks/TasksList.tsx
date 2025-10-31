"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { useTasks } from "@/lib/api/hooks/tasks";
import { TaskItem } from "./TaskItem";
import Loader from "@/components/Loader";
import { CheckCircle2Icon } from "lucide-react";

export function TasksList() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
  } = useTasks({
    page,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  if (tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="p-6">
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">
              Failed to load tasks
            </h3>
            <p className="text-red-600 dark:text-red-300 text-sm">
              {tasksError instanceof Error
                ? tasksError.message
                : "An unexpected error occurred"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tasks = tasksData?.tasks || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Tasks</h1>
        <p className="text-muted-foreground">
          Complete these tasks to improve your experience on the platform
        </p>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2Icon className="text-muted-foreground" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
              <p className="text-muted-foreground">
                You have no pending tasks at the moment. Great work!
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>

            {/* Pagination */}
            {tasksData?.pagination && (
              <Pagination
                currentPage={tasksData.pagination.page}
                totalPages={tasksData.pagination.pages}
                totalItems={tasksData.pagination.total}
                itemsPerPage={tasksData.pagination.limit}
                onPageChange={setPage}
                itemLabel="tasks"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
