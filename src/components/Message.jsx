import React from 'react';

const Message = ({ variant = 'info', children }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'danger':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  };

  return (
    <div className={`border px-4 py-3 rounded relative ${getVariantClass()}`} role="alert">
      {children}
    </div>
  );
};

export default Message; 