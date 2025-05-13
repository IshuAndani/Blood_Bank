// src/hooks/useForm.js
import { useState } from 'react';

export default function useForm(initialState = {}, validate = null) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
    
    // Clear error message when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Run validation and return true if form is valid
  const validateForm = () => {
    if (!validate) return true;
    
    const validationErrors = validate(values);
    setErrors(validationErrors || {});
    return Object.keys(validationErrors || {}).length === 0;
  };
  
  // Reset form to initial values
  const resetForm = () => {
    setValues(initialState);
    setErrors({});
  };
  
  // Set all form values at once
  const setFormValues = (newValues) => {
    setValues(newValues);
  };

  // Set single form value
  const setFieldValue = (field, value) => {
    setValues({
      ...values,
      [field]: value
    });
  };

  return {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validateForm,
    resetForm,
    setFormValues,
    setFieldValue,
    setErrors
  };
}