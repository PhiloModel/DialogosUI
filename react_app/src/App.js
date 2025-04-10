import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', backgroundColor: '#f2f2f2' }}>
        <ul style={{ listStyleType: 'none', display: 'flex', gap: '1rem' }}>
          <li><Link to="/">Strona Główna</Link></li>
          <li><Link to="/chat">Chat z Chatbotem</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;


