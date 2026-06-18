import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Wallet from './pages/Wallet';
import Plans from './pages/Plans';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import AdBanner from './components/AdBanner';
import './App.css';

export default function App() {
  const [user, setUser] = useState({
    id: 'user_001',
    name: 'Rahul',
    phone: '9876543210',
    wallet: 142.50,
    plan: 'free',      // 'free' | 'pro' | 'elite'
    level: 4,
    xp: 620,
    tasksToday: 12,
    totalEarned: 3240,
  });

  return (
    <Router>
      <div style={{ maxWidth: 420, margin: '0 auto', background: '#0d1117', minHeight: '100vh', position: 'relative' }}>
        <Routes>
          <Route path="/"        element={<Home    user={user} setUser={setUser} />} />
          <Route path="/tasks"   element={<Tasks   user={user} setUser={setUser} />} />
          <Route path="/wallet"  element={<Wallet  user={user} setUser={setUser} />} />
          <Route path="/plans"   element={<Plans   user={user} setUser={setUser} />} />
          <Route path="/profile" element={<Profile user={user} />} />
        </Routes>

        {/* Banner Ad — sirf free users ko */}
        {user.plan === 'free' && <AdBanner />}

        <BottomNav />
      </div>
    </Router>
  );
}
