import React from 'react';

const Button = ({ onClick, props, title=null, mode, icon, iconColor }) => {
  
  const actionHandler = () => {
    if (onClick) onClick(props ? props : null, mode);
  };

  return (
    <button onClick={actionHandler} className={`py-1 mr-2 ${iconColor}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {title}
    </button>
  );
};

export default Button;
