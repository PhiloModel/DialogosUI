import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LoadRAGPage from './pages/LoadRAGPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', backgroundColor: '#f2f2f2' }}>
        <ul style={{ listStyleType: 'none', display: 'flex', gap: '1rem' }}>
          <li><Link to="/">Main Page</Link></li>
          <li><Link to="/chat">PhiloBot</Link></li>
          <li><Link to="/load-rag">Upload Files</Link></li>
          <li><Link to="/login">Log In</Link> {' '}|{' '}</li>
          <li><Link to="/register">Sign In</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/load-rag" element={<LoadRAGPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;


