import React from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, unit, subtitle, color, trend, status, pumpStatus }) => {
  return (
    <div className={`metric-card ${color}`}>
      <div className="metric-header">
        <h3 className="metric-title">{title}</h3>
      </div>
      <div className="metric-content">
        <div className="metric-value">
          <span className="value">{value}</span>
          <span className="unit">{unit}</span>
        </div>
        {status && (
          <div className="status-badge" style={{ borderColor: status.color }}>
            <span className="status-icon">{status.icon}</span>
            <div className="status-info">
              <span className="status-text" style={{ color: status.color }}>{status.message}</span>
              <span className="status-description">{status.description}</span>
            </div>
          </div>
        )}
        {pumpStatus && (
          <div className="pump-status">
            <div className="pump-mode">{pumpStatus.mode}</div>
            <div className="pump-indicator">
              <div className={`pump-light ${pumpStatus.isOn ? 'on' : 'off'}`}></div>
              <span className="pump-text">{pumpStatus.isOn ? 'Nyala' : 'Mati'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;