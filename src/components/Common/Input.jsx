
import PropTypes from "prop-types";

const Input = ({
  label,
  error,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = "",
  ...props
}) => {
  const inputClasses = `
    form-input 
    bg-white dark:bg-neutral-800 
    text-gray-900 dark:text-white
    border border-gray-300 dark:border-neutral-600
    focus:ring-primary-500 dark:focus:ring-primary-400
    focus:border-primary-500 dark:focus:border-primary-400
    placeholder-gray-400 dark:placeholder-gray-500
    ${
      error
        ? "border-error-500 focus:border-error-500 focus:ring-error-500 dark:border-error-400 dark:focus:border-error-400 dark:focus:ring-error-400"
        : ""
    }
    disabled:bg-gray-100 dark:disabled:bg-neutral-900
    disabled:cursor-not-allowed
    disabled:text-gray-500 dark:disabled:text-gray-400
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
          {required && (
            <span className="text-red-500 dark:text-red-400 ml-1">*</span>
          )}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error-600 dark:text-error-400">
          {error}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;
