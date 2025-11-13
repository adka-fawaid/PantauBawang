import React, { useRef, useEffect, useState } from 'react';
import { useHistoricalData } from '../hooks/useApiData';
import './ChartCard.css';

const ChartCard = ({ 
  title, 
  subtitle, 
  dataType, 
  color = '#6366f1',
  unit = '',
  showRealTime = true,
  timeRange = 24
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [currentValue, setCurrentValue] = useState(null);
  const [trend, setTrend] = useState('stable');
  const [isHovered, setIsHovered] = useState(false);
  const { data: historicalData, loading, error } = useHistoricalData(timeRange);

  // Update chart when data changes
  useEffect(() => {
    if (historicalData && historicalData.length > 0) {
      const extractedData = historicalData.map(item => ({
        timestamp: new Date(item.timestamp),
        value: item[dataType] || 0
      }));

      if (extractedData.length > 0) {
        const latest = extractedData[extractedData.length - 1];
        setCurrentValue(latest.value);

        // Calculate trend
        if (extractedData.length >= 2) {
          const recent = extractedData.slice(-5);
          const firstValue = recent[0].value;
          const lastValue = recent[recent.length - 1].value;
          const change = ((lastValue - firstValue) / firstValue) * 100;
          
          if (change > 2) setTrend('up');
          else if (change < -2) setTrend('down');
          else setTrend('stable');
        }
      }
    }
  }, [historicalData, dataType]);

  // Real-time animation effect
  useEffect(() => {
    if (!showRealTime) return;
    
    const animate = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.transform = `scale(${1 + Math.sin(Date.now() * 0.001) * 0.005})`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showRealTime]);

  // Generate SVG Chart
  const generateChart = () => {
    if (!historicalData || historicalData.length === 0) return null;

    const chartData = historicalData.map(item => ({
      timestamp: new Date(item.timestamp),
      value: item[dataType] || 0
    }));

    const width = 280;
    const height = 120;
    const padding = { top: 15, right: 15, bottom: 20, left: 30 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find min/max values for scaling
    const values = chartData.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;

    // Generate points
    const points = chartData.map((item, index) => {
      const x = padding.left + (index / (chartData.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((item.value - minValue) / valueRange) * chartHeight;
      return { x, y, value: item.value, timestamp: item.timestamp };
    });

    // Generate smooth path
    const generateSmoothPath = (points) => {
      if (points.length < 2) return '';
      
      let path = `M ${points[0].x} ${points[0].y}`;
      
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpx = prev.x + (curr.x - prev.x) * 0.5;
        
        path += ` Q ${cpx} ${prev.y} ${curr.x} ${curr.y}`;
      }
      
      return path;
    };

    const pathData = generateSmoothPath(points);
    const areaPath = `${pathData} L ${points[points.length - 1].x} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

    // Grid lines
    const gridLines = [];
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (i / 4) * chartHeight;
      gridLines.push(
        <line
          key={`grid-${i}`}
          x1={padding.left}
          y1={y}
          x2={width - padding.right}
          y2={y}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      );
    }

    // Y-axis labels
    const yLabels = [];
    for (let i = 0; i <= 4; i++) {
      const value = minValue + (i / 4) * valueRange;
      const y = padding.top + chartHeight - (i / 4) * chartHeight;
      yLabels.push(
        <text
          key={`y-label-${i}`}
          x={padding.left - 10}
          y={y + 4}
          textAnchor="end"
          fill="rgba(255,255,255,0.6)"
          fontSize="10"
        >
          {value.toFixed(0)}
        </text>
      );
    }

    return (
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`}
        className={`advanced-chart-svg ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={canvasRef}
        style={{ maxWidth: width, maxHeight: height }}
      >
        {/* Background */}
        <rect 
          width={width} 
          height={height} 
          fill="rgba(255,255,255,0.02)" 
          rx="12"
        />
        
        {/* Grid */}
        <g className="grid">{gridLines}</g>
        
        {/* Y-axis labels */}
        <g className="y-labels">{yLabels}</g>
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id={`gradient-${dataType}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="50%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
          
          <linearGradient id={`line-gradient-${dataType}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
          
          <filter id={`glow-${dataType}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* Area fill */}
        <path
          d={areaPath}
          fill={`url(#gradient-${dataType})`}
          className="chart-area"
        />
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={`url(#line-gradient-${dataType})`}
          strokeWidth="2.5"
          filter={`url(#glow-${dataType})`}
          className="chart-line"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill={color}
            stroke="white"
            strokeWidth="1.5"
            className={`data-point ${isHovered ? 'visible' : ''}`}
            opacity={isHovered ? 1 : 0}
          />
        ))}
        
        {/* Trend indicator */}
        <g className="trend-indicator">
          <circle
            cx={width - 30}
            cy={30}
            r="8"
            fill={trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280'}
            opacity="0.8"
          />
          <text
            x={width - 30}
            y={34}
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
          >
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
          </text>
        </g>
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="chart-card loading">
        <div className="chart-header">
          <h3 className="chart-title">{title}</h3>
          <p className="chart-subtitle">Memuat data...</p>
        </div>
        <div className="chart-container">
          <div className="loading-chart">
            <div className="loading-bars">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="loading-bar" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-card error">
        <div className="chart-header">
          <h3 className="chart-title">{title}</h3>
          <p className="chart-subtitle error-text">Error: {error}</p>
        </div>
        <div className="chart-container">
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <p>Gagal memuat data chart</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`chart-card ${isHovered ? 'hovered' : ''}`}>
      <div className="chart-header">
        <div className="chart-title-section">
          <h3 className="chart-title">{title}</h3>
          <p className="chart-subtitle">{subtitle}</p>
        </div>
        <div className="chart-value-section">
          <div className={`current-value ${trend}`}>
            {currentValue !== null ? `${currentValue.toFixed(1)}${unit}` : '--'}
          </div>
          <div className={`trend-badge trend-${trend}`}>
            {trend === 'up' ? '📈' : trend === 'down' ? '📉' : '📊'}
            <span className="trend-text">
              {trend === 'up' ? 'Naik' : trend === 'down' ? 'Turun' : 'Stabil'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        {generateChart()}
      </div>
    </div>
  );
};

export default ChartCard;