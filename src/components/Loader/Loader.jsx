import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium' }) => {
  const sizeClass = `loader-${size}`;
  
  return (
    <div className="loader-container">
      <div className={`loader ${sizeClass}`}></div>
    </div>
  );
};

export default Loader;
