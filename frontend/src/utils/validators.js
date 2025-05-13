// src/utils/validators.js
/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validates password meets minimum requirements
   * @param {string} password - Password to validate
   * @returns {boolean} - True if valid password
   */
  export const isValidPassword = (password) => {
    return password && password.length >= 6;
  };
  
  /**
   * Validates donor registration form
   * @param {object} values - Form values
   * @returns {object} - Object containing errors
   */
  export const validateDonorRegistration = (values) => {
    const errors = {};
    
    if (!values.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (!isValidPassword(values.password)) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!values.bloodGroup) {
      errors.bloodGroup = 'Blood group is required';
    }
    
    if (!values.city) {
      errors.city = 'City is required';
    }
    
    if (!values.dob) {
      errors.dob = 'Date of birth is required';
    }
    
    return errors;
  };
  
  /**
   * Validates login form
   * @param {object} values - Form values
   * @returns {object} - Object containing errors
   */
  export const validateLogin = (values) => {
    const errors = {};
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    }
    
    return errors;
  };
  
  /**
   * Validates age is between 18 and 65
   * @param {string} dob - Date of birth (YYYY-MM-DD)
   * @returns {boolean} - True if age is valid
   */
  export const isValidAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18 && age <= 65;
  };
  
  /**
   * Validates donation eligibility based on last donation date
   * @param {string} lastDonationDate - Date of last donation (ISO date string)
   * @returns {object} - { eligible: boolean, daysToWait: number }
   */
  export const checkDonationEligibility = (lastDonationDate) => {
    if (!lastDonationDate) return { eligible: true, daysToWait: 0 };
    
    const today = new Date();
    const lastDonation = new Date(lastDonationDate);
    const daysSince = Math.floor((today - lastDonation) / (1000 * 60 * 60 * 24));
    const minDays = 56; // Minimum days between donations
    
    return {
      eligible: daysSince >= minDays,
      daysToWait: Math.max(0, minDays - daysSince)
    };
  };