import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      try {
        const userData = JSON.parse(savedSession);
        if (userData.isAuthenticated) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error parsing saved session:', error);
        localStorage.removeItem('userSession');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    setUser(null);
  };

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">🌾</div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show login if user not authenticated
  if (!user || !user.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Show dashboard if authenticated
  return (
    <div className="App">
      <div className="app-container simple-layout">
        <div className="main-content full-width">
          <div className="content-area">
            <Dashboard user={user} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
