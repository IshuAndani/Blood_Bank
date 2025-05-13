// src/components/common/Alert.js
import React from 'react';

/**
 * Reusable alert component
 * @param {Object} props - Component props
 * @param {string} props.type - Alert type: 'success', 'danger', 'warning', 'info'
 * @param {string} props.message - Alert message
 * @param {boolean} props.dismissible - Whether alert can be dismissed
 * @param {function} props.onDismiss - Function to call when alert is dismissed
 */
const Alert = ({ type = 'info', message, dismissible = false, onDismiss }) => {
  if (!message) return null;
  
  return (
    <div 
      className={`alert alert-${type} ${dismissible ? 'alert-dismissible fade show' : ''}`} 
      role="alert"
    >
      {message}
      {dismissible && (
        <button 
          type="button" 
          className="btn-close" 
          aria-label="Close"
          onClick={onDismiss}
        ></button>
      )}
    </div>
  );
};

export default Alert;