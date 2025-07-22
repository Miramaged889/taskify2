import PropTypes from "prop-types";

const Toggle = ({
  label = "",
  enabled,
  onChange,
  disabled = false,
  className = "",
  isRTL = false,
  size,
  color,
}) => {
  // Set default values for size and color if not provided
  const _size = size || "medium";
  const _color = color || "primary";

  const sizeClasses = {
    small: "h-5 w-9",
    medium: "h-6 w-11",
    large: "h-7 w-14",
  };

  const thumbSizeClasses = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-6 w-6",
  };

  const colorClasses = {
    primary: "bg-primary-600 dark:bg-primary-500",
    success: "bg-green-600 dark:bg-green-500",
    warning: "bg-yellow-600 dark:bg-yellow-500",
    error: "bg-red-600 dark:bg-red-500",
    info: "bg-blue-600 dark:bg-blue-500",
  };

  return (
    <div
      className={`
        flex items-center gap-3
        ${isRTL ? "flex-row-reverse" : "flex-row"}
        ${className}
      `}
    >
      {label && (
        <label
          className={`
            flex-1 text-sm font-medium text-gray-700 dark:text-gray-200
            ${isRTL ? "text-right" : "text-left"}
            ${disabled ? "opacity-50" : ""}
          `}
        >
          {label}
        </label>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`
          relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-all duration-200 ease-in-out 
          focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-800
          ${sizeClasses[_size]}
          ${enabled ? colorClasses[_color] : "bg-gray-200 dark:bg-neutral-700"}
          ${
            disabled
              ? "opacity-50 cursor-not-allowed dark:opacity-40"
              : "hover:shadow-md active:scale-95"
          }
          focus:ring-${_color}-500 dark:focus:ring-${_color}-400
        `}
      >
        <span
          className={`
            pointer-events-none inline-block transform rounded-full
            bg-white dark:bg-gray-100
            shadow ring-0 transition duration-200 ease-in-out
            ${thumbSizeClasses[_size]}
            ${
              enabled
                ? isRTL
                  ? "-translate-x-full"
                  : "translate-x-full"
                : "translate-x-0"
            }
            ${disabled ? "dark:bg-gray-300" : ""}
          `}
        />
      </button>
    </div>
  );
};

Toggle.propTypes = {
  label: PropTypes.string,
  enabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  isRTL: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.oneOf(["primary", "success", "warning", "error", "info"]),
};

export default Toggle;
