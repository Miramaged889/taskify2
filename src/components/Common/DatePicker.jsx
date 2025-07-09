
import ReactDatePicker from "react-datepicker";
import PropTypes from "prop-types";
import "react-datepicker/dist/react-datepicker.css";

const DatePicker = ({
  label,
  error,
  selected,
  onChange,
  disabled = false,
  required = false,
  placeholder = "Select date",
  className = "",
  ...props
}) => {
  const datePickerClasses = `
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
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        disabled={disabled}
        placeholderText={placeholder}
        className={datePickerClasses}
        dateFormat="MMM dd, yyyy"
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

DatePicker.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  selected: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default DatePicker;
