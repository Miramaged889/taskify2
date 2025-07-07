export const USER_ROLES = {
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
};

export const TASK_STATUSES = {
  TODO: 'todo',
  PROGRESS: 'progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
};

export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const NOTIFICATION_TYPES = {
  TASK_COMPLETED: 'task_completed',
  TASK_ASSIGNED: 'task_assigned',
  TASK_UPDATED: 'task_updated',
  PROJECT_CREATED: 'project_created',
  TEAM_MEMBER_ADDED: 'team_member_added',
};

export const LANGUAGES = {
  EN: 'en',
  AR: 'ar',
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const WORK_DAYS = [
  { value: 'sunday', label: { en: 'Sunday', ar: 'الأحد' } },
  { value: 'monday', label: { en: 'Monday', ar: 'الإثنين' } },
  { value: 'tuesday', label: { en: 'Tuesday', ar: 'الثلاثاء' } },
  { value: 'wednesday', label: { en: 'Wednesday', ar: 'الأربعاء' } },
  { value: 'thursday', label: { en: 'Thursday', ar: 'الخميس' } },
  { value: 'friday', label: { en: 'Friday', ar: 'الجمعة' } },
  { value: 'saturday', label: { en: 'Saturday', ar: 'السبت' } },
];

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#0ea5e9',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#6366f1',
  gray: '#6b7280',
};

export const ROUTES = {
  LOGIN: '/login',
  SETUP: '/setup',
  EMPLOYEE_DASHBOARD: '/employee',
  EMPLOYEE_TASKS: '/employee/tasks',
  EMPLOYEE_CALENDAR: '/employee/calendar',
  EMPLOYEE_REPORTS: '/employee/reports',
  EMPLOYEE_CHAT: '/employee/chat',
  EMPLOYEE_SETTINGS: '/employee/settings',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_TASKS: '/admin/tasks',
  ADMIN_CALENDAR: '/admin/calendar',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_TEAM: '/admin/team',
  ADMIN_CHAT: '/admin/chat',
  ADMIN_SETTINGS: '/admin/settings',
};