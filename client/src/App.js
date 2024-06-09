import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Chatpage.js';
import Signup from './auth/Signup.js';
import Login from './auth/Login.js';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chats" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
