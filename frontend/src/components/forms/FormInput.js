import React from 'react';

/**
 * Reusable form input component
 * @param {Object} props - Component props
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.type - Input type
 * @param {string} props.label - Input label
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {boolean} props.required - Whether input is required
 * @param {string} props.error - Error message
 * @param {Object} props.inputProps - Additional props for input element
 */
const FormInput = ({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  required = false,
  error,
  inputProps = {},
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
      <input
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        {...inputProps}
        {...rest}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormInput;