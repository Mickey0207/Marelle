import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  title, 
  subtitle,
  header,
  footer,
  padding = 'p-6',
  ...props 
}) => {
  const baseClasses = 'glass rounded-2xl shadow-sm';
  const classes = `${baseClasses} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {(title || subtitle || header) && (
        <div className={`${padding} pb-4 border-b border-gray-200`}>
          {header || (
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            </div>
          )}
        </div>
      )}
      
      <div className={title || subtitle || header ? padding : padding}>
        {children}
      </div>
      
      {footer && (
        <div className={`${padding} pt-4 border-t border-gray-200`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;