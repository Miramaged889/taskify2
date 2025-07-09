import PropTypes from "prop-types";

const Select = ({
  label = "",
  error,
  options = [],
  value,
  onChange,
  disabled = false,
  required = false,
  placeholder = "Select an option",
  className = "",
  isRTL = false,
}) => {
  const selectClasses = `
    form-input 
    bg-white dark:bg-neutral-800 
    text-gray-900 dark:text-white
    border border-gray-300 dark:border-neutral-600
    focus:ring-primary-500 dark:focus:ring-primary-400
    focus:border-primary-500 dark:focus:border-primary-400
    ${
      error
        ? "border-error-500 focus:border-error-500 focus:ring-error-500 dark:border-error-400 dark:focus:border-error-400 dark:focus:ring-error-400"
        : ""
    }
    ${className}
    ${isRTL ? "text-right" : ""}
    disabled:bg-gray-100 dark:disabled:bg-neutral-900
    disabled:cursor-not-allowed
    disabled:text-gray-500 dark:disabled:text-gray-400
  `;

  return (
    <div className={`${isRTL ? "text-right" : ""}`}>
      {label && (
        <label
          className={`block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1`}
        >
          {label}
          {required && (
            <span className="text-red-500 dark:text-red-400 ml-1">*</span>
          )}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={selectClasses}
        >
          <option
            value=""
            className="dark:text-neutral-300 dark:bg-neutral-800"
          >
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="dark:text-white dark:bg-neutral-800"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-1 text-sm text-error-600 dark:text-error-400">
          {error}
        </p>
      )}
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  isRTL: PropTypes.bool,
};

export default Select;
