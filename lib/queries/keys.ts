/**
 * Query Key Factory
 * Following Rule [qk-factory-pattern] and [qk-hierarchical-organization]
 * Centralizes all query keys to prevent cache bugs and ensure consistency.
 */
export const queryKeys = {
  performance: {
    all: ['performance'] as const,
    list: () => [...queryKeys.performance.all, 'list'] as const,
    summary: () => [...queryKeys.performance.all, 'summary'] as const,
  },
  users: {
    all: ['users'] as const,
    list: (filters?: object) => [...queryKeys.users.all, 'list', { ...filters }] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
    profile: (id: string) => [...queryKeys.users.all, 'profile', id] as const,
  },
  projects: {
    all: ['projects'] as const,
    list: (filters?: object) => [...queryKeys.projects.all, 'list', { ...filters }] as const,
    detail: (id: string) => [...queryKeys.projects.all, 'detail', id] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    unread: () => [...queryKeys.notifications.all, 'unread'] as const,
    list: () => [...queryKeys.notifications.all, 'list'] as const,
  }
} as const;
