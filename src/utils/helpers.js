import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';

export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  return format(new Date(date), formatString);
};

export const formatTime = (date) => {
  return format(new Date(date), 'HH:mm');
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const isDateToday = (date) => {
  return isToday(new Date(date));
};

export const isDateThisWeek = (date) => {
  return isThisWeek(new Date(date));
};

export const isDateThisMonth = (date) => {
  return isThisMonth(new Date(date));
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'low':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'medium':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200';
    case 'urgent':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'todo':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
    case 'review':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const filterTasks = (tasks, filter) => {
  return tasks.filter(task => {
    const statusMatch = filter.status === 'all' || task.status === filter.status;
    const priorityMatch = filter.priority === 'all' || task.priority === filter.priority;
    const assigneeMatch = filter.assignee === 'all' || task.assignee === filter.assignee;
    const projectMatch = filter.project === 'all' || task.project === filter.project;
    
    let dateMatch = true;
    if (filter.dateRange.start && filter.dateRange.end) {
      const taskDate = new Date(task.dueDate);
      const startDate = new Date(filter.dateRange.start);
      const endDate = new Date(filter.dateRange.end);
      dateMatch = taskDate >= startDate && taskDate <= endDate;
    }
    
    return statusMatch && priorityMatch && assigneeMatch && projectMatch && dateMatch;
  });
};

export const calculateProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  return Math.round((completedTasks / tasks.length) * 100);
};

export const getTaskStats = (tasks) => {
  const stats = {
    total: tasks.length,
    todo: 0,
    progress: 0,
    review: 0,
    completed: 0,
    overdue: 0,
  };
  
  const now = new Date();
  
  tasks.forEach(task => {
    stats[task.status]++;
    
    if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'completed') {
      stats.overdue++;
    }
  });
  
  return stats;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

export const exportToCsv = (data, filename) => {
  const csvContent = "data:text/csv;charset=utf-8," 
    + data.map(row => Object.values(row).join(",")).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const copyToClipboard = (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return Promise.resolve();
    } catch (err) {
      document.body.removeChild(textArea);
      return Promise.reject(err);
    }
  }
};