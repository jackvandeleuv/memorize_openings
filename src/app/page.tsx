'use client';

import MenuBar from './MenuBar'
import ReviewSession from './ReviewSession'
import DecksPage from './DecksPage';
import HomePage from './HomePage';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './About';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
        <Router>
            <MenuBar />
            <div className="p-6">
                <Routes>
                    <Route 
                        path='/'
                        element={<HomePage />}
                    />
                    <Route 
                        path='/learn'
                        element={<DecksPage />}
                    />
                    <Route 
                        path='/about'
                        element={<About />}
                    />
                    <Route 
                        path='/signin'
                        element={<SignIn />}
                    />
                    <Route 
                        path='/signup'
                        element={<SignUp />}
                    />
                </Routes>
            </div>
        </Router>
    </div>
  );
}
