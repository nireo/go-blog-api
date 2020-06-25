import React from 'react';

export const NotFound: React.FC = () => {
  return (
    <div className="container mt-3">
      <h2 className="text-3xl text-blue-500 font-mono">404, Not found</h2>
      <p className="text-gray-600">
        The page you're looking has not been found :(
      </p>
    </div>
  );
};
