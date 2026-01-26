import React from 'react';

const Background = () => (
    <div className="squares-bg">
        {[...Array(10)].map((_, i) => <span key={i} className="square"></span>)}
    </div>
);

export default React.memo(Background);
