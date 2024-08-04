import React from 'react';

export const Card = ({ className, children }) => {
  return (
    <div className={`border border-gray-200 rounded shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ className, children }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children }) => {
  return (
    <div className={`border-b border-gray-200 p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return (
    <h2 className={`text-lg font-semibold ${className}`}>
      {children}
    </h2>
  );
};

