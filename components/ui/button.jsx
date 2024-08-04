import React from 'react';

const Button = ({ className, children, variant = "solid", ...props }) => {
  const baseClass = "px-4 py-2 rounded text-white focus:outline-none";
  const variantClass = variant === "outline" ? "border border-gray-300 text-gray-700 bg-white" : "bg-blue-500 hover:bg-blue-600";

  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
