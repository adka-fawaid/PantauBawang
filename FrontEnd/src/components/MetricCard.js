import React from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, unit, subtitle, color, trend }) => {
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
        <div className="metric-subtitle">{subtitle}</div>
        {trend && (
          <div className="metric-trend">
            <svg width="60" height="20" viewBox="0 0 60 20">
              <path
                d="M0,15 Q15,10 30,12 T60,8"
                stroke={trend.color}
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;