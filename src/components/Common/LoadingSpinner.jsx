import PropTypes from "prop-types";

const LoadingSpinner = ({
  size = "medium",
  color = "primary",
  variant = "border",
  className = "",
  withPulse = false,
}) => {
  const sizeClasses = {
    xs: "h-3 w-3",
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8",
    xl: "h-10 w-10",
  };

  const colorClasses = {
    primary: "border-primary-600 dark:border-primary-400",
    secondary: "border-secondary-600 dark:border-secondary-400",
    success: "border-green-600 dark:border-green-400",
    warning: "border-yellow-600 dark:border-yellow-400",
    error: "border-red-600 dark:border-red-400",
    info: "border-blue-600 dark:border-blue-400",
    white: "border-white",
    gray: "border-gray-600 dark:border-gray-400",
  };

  const variantClasses = {
    border: "border-2",
    borderThin: "border",
    borderThick: "border-4",
  };

  const pulseClass = withPulse ? "animate-pulse" : "";

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          animate-spin 
          rounded-full 
          ${variantClasses[variant]}
          border-t-transparent 
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          ${pulseClass}
        `}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["xs", "small", "medium", "large", "xl"]),
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
    "info",
    "white",
    "gray",
  ]),
  variant: PropTypes.oneOf(["border", "borderThin", "borderThick"]),
  className: PropTypes.string,
  withPulse: PropTypes.bool,
};

export default LoadingSpinner;
