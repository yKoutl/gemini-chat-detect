import React from 'react';

const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false, title, style }) => {
    const baseClasses = "transition-all duration-200 cursor-pointer";

    const variants = {
        primary: "btn-primary",
        icon: "btn-icon",
        ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/5"
    };

    const finalClassName = `
    ${baseClasses} 
    ${variants[variant] || variants.primary} 
    ${className}
  `.trim();

    return (
        <button
            onClick={onClick}
            className={finalClassName}
            disabled={disabled}
            title={title}
            style={style}
        >
            {children}
        </button>
    );
};

export default Button;
