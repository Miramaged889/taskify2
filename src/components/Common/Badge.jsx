import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-200',
    secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-200',
    success: 'bg-success-100 text-success-800 dark:bg-success-800 dark:text-success-200',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-800 dark:text-warning-200',
    error: 'bg-error-100 text-error-800 dark:bg-error-800 dark:text-error-200',
  };

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-2.5 py-1.5 text-sm',
    large: 'px-3 py-2 text-base',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;