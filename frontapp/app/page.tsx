"use client"
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App: React.FC = () => {
  return (
    //white page 
    <Router>
      <Routes>
        <Route path="/" element={<div className='bg-black'>Home</div>} />
      </Routes>
    </Router>
  );
};

export default App;
