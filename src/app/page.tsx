'use client';

import MenuBar from './MenuBar'
import ReviewSession from './ReviewSession'
import HomePage from './HomePage';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function Home() {
  return (
    <Router>
      <MenuBar />

      <Routes>
        <Route 
          path='/'
          element={<HomePage />}
        />
        <Route 
          path='/review'
          element={<ReviewSession ids={[-1]} />}
        />
      </Routes>
    </Router>
  )
}
