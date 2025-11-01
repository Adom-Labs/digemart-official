import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getThemeTemplates,
  getThemeTemplate,
  getThemeTemplateBySlug,
  getDefaultThemeTemplate,
  createThemeTemplate,
  updateThemeTemplate,
  setDefaultThemeTemplate,
  deleteThemeTemplate,
  incrementThemeDownloads,
  type ThemeTemplateQuery,
  type CreateThemeTemplateData,
  type UpdateThemeTemplateData,
} from "../theme-templates";

// Query keys
export const themeTemplateKeys = {
  all: ["theme-templates"] as const,
  lists: () => [...themeTemplateKeys.all, "list"] as const,
  list: (params?: ThemeTemplateQuery) =>
    [...themeTemplateKeys.lists(), params] as const,
  details: () => [...themeTemplateKeys.all, "detail"] as const,
  detail: (id: number) => [...themeTemplateKeys.details(), id] as const,
  slug: (slug: string) => [...themeTemplateKeys.all, "slug", slug] as const,
  default: () => [...themeTemplateKeys.all, "default"] as const,
};

// Get all theme templates
export function useThemeTemplates(params?: ThemeTemplateQuery) {
  return useQuery({
    queryKey: themeTemplateKeys.list(params),
    queryFn: () => getThemeTemplates(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get theme template by ID
export function useThemeTemplate(id: number) {
  return useQuery({
    queryKey: themeTemplateKeys.detail(id),
    queryFn: () => getThemeTemplate(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get theme template by slug
export function useThemeTemplateBySlug(slug: string) {
  return useQuery({
    queryKey: themeTemplateKeys.slug(slug),
    queryFn: () => getThemeTemplateBySlug(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get default theme template
export function useDefaultThemeTemplate() {
  return useQuery({
    queryKey: themeTemplateKeys.default(),
    queryFn: getDefaultThemeTemplate,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Create theme template mutation
export function useCreateThemeTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createThemeTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: themeTemplateKeys.lists() });
    },
  });
}

// Update theme template mutation
export function useUpdateThemeTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateThemeTemplateData }) =>
      updateThemeTemplate(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: themeTemplateKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: themeTemplateKeys.lists() });
    },
  });
}

// Set default theme template mutation
export function useSetDefaultThemeTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDefaultThemeTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: themeTemplateKeys.all });
    },
  });
}

// Delete theme template mutation
export function useDeleteThemeTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteThemeTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: themeTemplateKeys.lists() });
    },
  });
}

// Increment theme downloads mutation
export function useIncrementThemeDownloads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: incrementThemeDownloads,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: themeTemplateKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: themeTemplateKeys.lists() });
    },
  });
}
