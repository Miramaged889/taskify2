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
    form-input ${
      error
        ? "border-error-500 focus:border-error-500 focus:ring-error-500"
        : ""
    }
    ${className}
    ${isRTL ? "text-right" : "text-left"}
  `;

  return (
    <div className={`${isRTL ? "text-right" : "text-left"}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={selectClasses}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
