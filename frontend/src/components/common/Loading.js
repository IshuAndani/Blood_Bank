// src/components/common/Loading.js
import React from 'react';

/**
 * Loading spinner component
 * @param {Object} props - Component props
 * @param {string} props.size - Spinner size: 'sm', 'md', 'lg'
 * @param {string} props.color - Spinner color: 'primary', 'secondary', etc.
 * @param {string} props.text - Text to display below spinner
 */
const Loading = ({ size = '', color = 'primary', text = 'Loading...' }) => {
  const sizeClass = size ? `spinner-border-${size}` : '';
  
  return (
    <div className="d-flex flex-column align-items-center my-3">
      <div className={`spinner-border text-${color} ${sizeClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="mt-2">{text}</p>}
    </div>
  );
};

export default Loading;