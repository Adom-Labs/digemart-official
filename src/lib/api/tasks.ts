import apiClient from './client';

export interface Task {
    id: string;
    userId: number;
    type: string;
    title: string;
    description: string;
    actionUrl: string | null;
    isCompleted: boolean;
    priority: string;
    dependencies: string[];
    metadata: Record<string, unknown>;
    createdAt: string;
    completedAt: string | null;
}

export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
}

export interface TasksResponse {
    tasks: Task[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TaskQueryParams {
    page?: number;
    limit?: number;
    type?: string;
    isCompleted?: boolean;
    priority?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Get all tasks for the current user
 */
export async function getTasks(params?: TaskQueryParams): Promise<TasksResponse> {
    const response = await apiClient.get('/tasks', { params });
    return response.data;
}

/**
 * Get task statistics for the current user
 */
export async function getTaskStats(): Promise<TaskStats> {
    const response = await apiClient.get('/tasks/stats');
    return response.data;
}

/**
 * Get a single task by ID
 */
export async function getTask(id: string): Promise<Task> {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
}

/**
 * Mark a task as completed
 */
export async function completeTask(id: string): Promise<Task> {
    const response = await apiClient.patch(`/tasks/${id}/complete`);
    return response.data;
}

/**
 * Delete a task
 */
export async function deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
}
