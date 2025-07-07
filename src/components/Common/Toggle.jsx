import PropTypes from "prop-types";

const Toggle = ({
  label = "",
  enabled,
  onChange,
  disabled = false,
  className = "",
  isRTL = false,
}) => {
  return (
    <div
      className={`
        flex items-center gap-3
        ${isRTL ? "flex-row" : ""}
        ${className}
      `}
    >
      {label && (
        <label
          className={`
          flex-1 text-sm font-medium text-gray-700 dark:text-gray-300
          ${isRTL ? "text-right" : "text-left"}
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
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2
          ${enabled ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${
              enabled
                ? isRTL
                  ? "-translate-x-5"
                  : "translate-x-5"
                : isRTL
                ? "translate-x-0"
                : "translate-x-0"
            }
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
};

export default Toggle;
