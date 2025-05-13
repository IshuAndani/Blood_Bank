// src/components/common/Card.js
import React from 'react';

/**
 * Reusable card component
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.footer - Card footer content
 * @param {Object} props.headerProps - Props for card header
 * @param {Object} props.footerProps - Props for card footer
 * @param {string} props.className - Additional CSS classes
 */
const Card = ({ 
  title, 
  children, 
  footer, 
  headerProps = {}, 
  footerProps = {}, 
  className = '' 
}) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-header" {...headerProps}>
          {title}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
      {footer && (
        <div className="card-footer" {...footerProps}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;