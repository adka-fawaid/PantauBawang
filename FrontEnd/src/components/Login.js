import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const userTypes = [
    {
      type: 'farmer',
      title: 'Petani',
      subtitle: 'Login sebagai Petani',
      icon: '🚜',
      color: '#10b981',
      buttonColor: '#059669'
    },
    {
      type: 'retailer',
      title: 'Retailer',
      subtitle: 'Login as Retailer',
      icon: '🏪',
      color: '#3b82f6',
      buttonColor: '#2563eb'
    },
    {
      type: 'consumer',
      title: 'Consumer',
      subtitle: 'Login as Consumer',
      icon: '👤',
      color: '#8b5cf6',
      buttonColor: '#7c3aed'
    }
  ];

  const handleUserTypeSelect = (userType) => {
    setSelectedUserType(userType);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulasi login berhasil
    const userData = {
      userType: selectedUserType.type,
      username: loginData.username,
      isAuthenticated: true
    };
    
    // Simpan session di localStorage
    localStorage.setItem('userSession', JSON.stringify(userData));
    
    // Callback ke parent component
    onLogin(userData);
  };

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  if (!selectedUserType) {
    return (
      <div className="login-container">
        <div className="login-background"></div>
        <div className="login-overlay"></div>
        
        <div className="login-content">
          <div className="login-header">
            <div className="brand-section">
              <div className="brand-icon">🌾</div>
              <h1 className="brand-title">Brenggolo Marketplace</h1>
            </div>
          </div>

          <div className="welcome-section">
            <h2 className="welcome-title">Welcome to Brenggolo Farm Marketplace</h2>
            <p className="welcome-subtitle">Connecting Farmers, Retailers, and Consumers</p>
          </div>

          <div className="user-type-section">
            <h3 className="section-title">Monggo Dipilih Mawon Rolle Jenengan</h3>
            <div className="user-type-grid">
              {userTypes.map((user) => (
                <div
                  key={user.type}
                  className="user-type-card"
                  onClick={() => handleUserTypeSelect(user)}
                >
                  <div className="user-icon" style={{ color: user.color }}>
                    {user.icon}
                  </div>
                  <h4 className="user-title">{user.title}</h4>
                  <p className="user-subtitle">{user.subtitle}</p>
                  <button 
                    className="login-btn"
                    style={{ backgroundColor: user.color }}
                  >
                    Login
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <div className="login-overlay"></div>
      
      <div className="login-content">
        <div className="login-form-container">
          <button 
            className="back-button"
            onClick={() => setSelectedUserType(null)}
          >
            ← Back
          </button>
          
          <div className="form-header">
            <div className="user-icon-large" style={{ color: selectedUserType.color }}>
              {selectedUserType.icon}
            </div>
            <h2>Login as {selectedUserType.title}</h2>
            <p>{selectedUserType.subtitle}</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit"
              className="login-submit-btn"
              style={{ backgroundColor: selectedUserType.color }}
            >
              Login as {selectedUserType.title}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;