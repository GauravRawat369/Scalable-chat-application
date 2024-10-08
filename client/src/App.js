import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Chatpage.jsx';
import Signup from './auth-page/Signup.jsx';
import Login from './auth-page/Login.jsx';
import {Toaster} from "react-hot-toast"
import { useAuthContext } from './context/AuthContext.jsx';

const App = () => {
  const {authUser} = useAuthContext()
  return (
    <div>
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
        <Route path="/signup" element={authUser ? <Navigate to = "/"/> : <Signup />} />
        <Route path="/login"element={authUser ? <Navigate to = "/"/> : <Login />}  />
        <Route path="/" element={<Home />} />
      </Routes>
      <Toaster
      position="top-right"
      reverseOrder={false}
    />
    </div>
  );
};

export default App;
