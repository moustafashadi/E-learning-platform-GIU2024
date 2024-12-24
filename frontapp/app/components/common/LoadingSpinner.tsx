// /components/Common/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
    <style jsx>{`
      .loader {
        border-top-color: #3498db;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoadingSpinner;
