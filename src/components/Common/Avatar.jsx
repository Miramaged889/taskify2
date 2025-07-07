import React from 'react';
import { getInitials } from '../../utils/helpers';

const Avatar = ({
  src,
  alt,
  name,
  size = 'medium',
  className = '',
}) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg',
    xlarge: 'w-16 h-16 text-xl',
  };

  const baseClasses = 'rounded-full flex items-center justify-center bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300 font-semibold';

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`${sizeClasses[size]} ${baseClasses} ${className}`}
      />
    );
  }

  return (
    <div className={`${baseClasses} ${sizeClasses[size]} ${className}`}>
      {getInitials(name || 'User')}
    </div>
  );
};

export default Avatar;