import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="container mt-6">
      <h3 className="font-mono text-3xl">About Gedium</h3>
      <p className="text-gray-600">
        Gedium is a platform for writers to write about technology and other
        things that they find interesting. The whole website is open-source on{' '}
        <a
          href="https://github.com/nireo/gedium"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:no-underline hover:text-blue-300"
        >
          github
        </a>
        . All contributions are welcome and encouraged.
      </p>
    </div>
  );
};
