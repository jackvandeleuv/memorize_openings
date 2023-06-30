'use client';

import MenuBar from './MenuBar';
import Footer from './Footer';
import DecksPage from './learn';
import HomePage from './home';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './about';
import SignIn from './signin';
import SignUp from './signup';
import Account from './account';

export default function Home() {
  return (
    <Router>
        <div className="flex flex-col min-h-screen">
            <MenuBar />
                <div className="flex-grow">
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/learn' element={<DecksPage />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/signin' element={<SignIn />} />
                        <Route path='/signup' element={<SignUp />} />
                        <Route path='/account' element={<Account />} />
                    </Routes>
                </div>
            <Footer />
        </div>
    </Router>
  );
}
