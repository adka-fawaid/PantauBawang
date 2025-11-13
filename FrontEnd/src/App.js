import React from 'react';
import Dashboard from './components/Dashboard';
import './App.css';
import './styles/responsive.css';
import './styles/global-responsive.css';
import './styles/mobile-optimized.css';

function App() {
  return (
    <div className="App">
      <div className="app-container simple-layout">
        <div className="main-content full-width">
          <div className="content-area">
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
