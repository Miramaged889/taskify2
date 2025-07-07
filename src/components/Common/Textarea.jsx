import React from "react";

const Textarea = ({
  label,
  error,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  rows = 3,
  className = "",
  ...props
}) => {
  const textareaClasses = `form-input ${
    error ? "border-error-500 focus:border-error-500 focus:ring-error-500" : ""
  } ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        rows={rows}
        className={textareaClasses}
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

export default Textarea;
