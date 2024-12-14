import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './login.js';
import Questions from './questions.js';
import Home from './home.js';
import Profile from './Profile.js';

import reportWebVitals from './reportWebVitals.mjs';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/questions" element={<Questions />} /> */}
        <Route path="/questions" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/questions" element={} /> */}
      </Routes>
    </Router>
);

reportWebVitals();