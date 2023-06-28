'use client';

import MenuBar from './MenuBar';
import Footer from './Footer';
import DecksPage from './DecksPage';
import HomePage from './HomePage';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './About';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Account from './Account';

export default function Home() {
    const [userSignedIn, setUserSignedIn] = useState<boolean>(false);

  return (
      <div className="flex flex-col min-h-screen">
          <Router>
              <MenuBar />
              <div className="flex-grow p-6">
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
          </Router>
      </div>
  );
}
