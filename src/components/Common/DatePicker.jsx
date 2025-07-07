import React from 'react';
import ReactDatePicker from 'react-datepicker';

const DatePicker = ({
  label,
  error,
  selected,
  onChange,
  disabled = false,
  required = false,
  placeholder = 'Select date',
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        disabled={disabled}
        placeholderText={placeholder}
        className={`form-input ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''} ${className}`}
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

export default DatePicker;