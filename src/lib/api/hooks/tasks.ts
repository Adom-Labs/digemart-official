import { useQuery, useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { getTasks, getTaskStats, getTask, completeTask, deleteTask, Task, TaskStats, TasksResponse, TaskQueryParams } from '../tasks';
import { toast } from 'sonner';

// Query Keys
export const taskKeys = {
    all: ['tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
    list: (params?: TaskQueryParams) => [...taskKeys.lists(), params] as const,
    stats: () => [...taskKeys.all, 'stats'] as const,
    detail: (id: string) => [...taskKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch all tasks with optional filters
 */
export function useTasks(params?: TaskQueryParams) {
    return useQuery({
        queryKey: taskKeys.list(params),
        queryFn: () => getTasks(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Hook to fetch task statistics
 */
export function useTaskStats() {
    return useQuery({
        queryKey: taskKeys.stats(),
        queryFn: getTaskStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Hook to fetch a single task by ID
 */
export function useTask(id: string) {
    return useQuery({
        queryKey: taskKeys.detail(id),
        queryFn: () => getTask(id),
        enabled: !!id,
    });
}

/**
 * Hook to complete a task
 */
export function useCompleteTask(
    options?: UseMutationOptions<Task, Error, string>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: completeTask,
        onSuccess: (data, taskId) => {
            // Invalidate and refetch tasks
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
            queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });

            // Also invalidate dashboard overview which includes tasks
            queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });

            toast.success('Task completed successfully!');

            // Call custom onSuccess if provided
            options?.onSuccess?.(data, taskId, undefined);
        },
        onError: (error, taskId) => {
            console.error('Failed to complete task:', error);
            toast.error('Failed to complete task. Please try again.');

            // Call custom onError if provided
            options?.onError?.(error, taskId, undefined);
        },
        ...options,
    });
}

/**
 * Hook to delete a task
 */
export function useDeleteTask(
    options?: UseMutationOptions<void, Error, string>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTask,
        onSuccess: (data, taskId) => {
            // Invalidate and refetch tasks
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            queryClient.invalidateQueries({ queryKey: taskKeys.stats() });

            // Also invalidate dashboard overview
            queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });

            toast.success('Task deleted successfully!');

            // Call custom onSuccess if provided
            options?.onSuccess?.(data, taskId, undefined);
        },
        onError: (error, taskId) => {
            console.error('Failed to delete task:', error);
            toast.error('Failed to delete task. Please try again.');

            // Call custom onError if provided
            options?.onError?.(error, taskId, undefined);
        },
        ...options,
    });
}
