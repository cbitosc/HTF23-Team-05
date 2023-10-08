import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

import Home from '../pages/Home';

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import TopicPage from '../pages/TopicPage';
import QuestionsPage from '../pages/QuestionsPage';


const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />} />
      <Route path="home" element={<Home />} />
      <Route path="/topics/:topicId" element={<QuestionsPage />} />

      <Route path="/*" element={<ProtectedRoute />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="add-topic" element={<TopicPage />} />
      
      
      </Route>

      
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      

      <Route path='insta/*' element={<Navigate to="https://www.instagram.com/aandm_fashion_retailor/?hl=en" target="_blank" replace />} />


    </Routes>
  );
};

export default Routers;
