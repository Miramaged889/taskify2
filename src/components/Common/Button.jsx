import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  type = "button",
  className = "",
  isRTL, // Destructure isRTL to prevent it from being passed to DOM
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary:
      "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
    secondary:
      "bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500",
    success:
      "bg-success-600 hover:bg-success-700 text-white focus:ring-success-500",
    warning:
      "bg-warning-600 hover:bg-warning-700 text-white focus:ring-warning-500",
    error: "bg-error-600 hover:bg-error-700 text-white focus:ring-error-500",
    outline:
      "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900",
    ghost:
      "text-gray-600 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-400 dark:hover:bg-gray-700",
  };

  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
  };

  const disabledClasses =
    disabled || loading ? "opacity-50 cursor-not-allowed" : "";

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {loading && (
        <LoadingSpinner
          size="small"
          color={
            variant === "outline" || variant === "ghost" ? "gray" : "white"
          }
        />
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
