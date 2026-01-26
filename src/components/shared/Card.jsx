import React from 'react';

const Card = ({ children, className = '', noPadding = false }) => {
    return (
        <div className={`modal-container rounded-3xl flex flex-col relative z-10 overflow-hidden ${noPadding ? 'p-0' : 'p-6'} ${className}`}>
            {children}
        </div>
    );
};

export default Card;
