// src/components/forms/FormSelect.js
import React from 'react';

/**
 * Reusable form select component
 * @param {Object} props - Component props
 * @param {string} props.id - Select ID
 * @param {string} props.name - Select name
 * @param {string} props.label - Select label
 * @param {Array} props.options - Select options array of { value, label }
 * @param {string} props.value - Select value
 * @param {function} props.onChange - Change handler
 * @param {boolean} props.required - Whether select is required
 * @param {string} props.error - Error message
 * @param {string} props.placeholder - Placeholder text
 */
const FormSelect = ({
  id,
  name,
  label,
  options = [],
  value,
  onChange,
  required = false,
  error,
  placeholder = 'Select an option',
  ...rest
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id || name} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <select
        className={`form-select ${error ? 'is-invalid' : ''}`}
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormSelect;