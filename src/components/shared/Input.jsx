import React, { forwardRef } from 'react';

const Input = forwardRef(({
    type = 'text',
    className = '',
    isTextArea = false,
    ...props
}, ref) => {

    const baseClasses = "input-field w-full rounded-lg text-sm mb-3 outline-none focus:ring-2 focus:ring-[var(--highlight)] transition-all";
    const Component = isTextArea ? 'textarea' : 'input';

    return (
        <Component
            ref={ref}
            className={`${baseClasses} ${className}`}
            {...props}
        />
    );
});

export default Input;
