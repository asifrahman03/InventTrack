import React from 'react';

const Input = ({ className, ...props }) => {
  return (
    <input
      className={`border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 ${className}`}
      {...props}
    />
  );
};

export default Input;
