import React from 'react';

const HealthScoreRing = ({ score, size = 160 }) => {
  const strokeColor = score < 50 ? '#ef4444' : score < 80 ? '#f59e0b' : '#10b981';

  const strokeWidth = 2.5;
  const radius = 15.9155;
  const center = 18;
  return (
    <div 
      className="relative flex items-center justify-center group" 
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 36 36" className="w-full h-full transform transition-transform group-hover:scale-105">
        
        {/* Background Circle (Grey Ring) */}
        <path
          className="stroke-slate-200 fill-none"
          strokeWidth={strokeWidth}
          d={`M${center} 2.0845 a ${radius} ${radius} 0 0 1 0 ${radius * 2} a ${radius} ${radius} 0 0 1 0 -${radius * 2}`}
        />

        {/* Progress Circle (Colored Ring) */}
        <path
          className="fill-none transition-all duration-1000 ease-out"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${score}, 100`}
          strokeLinecap="round"
          d={`M${center} 2.0845 a ${radius} ${radius} 0 0 1 0 ${radius * 2} a ${radius} ${radius} 0 0 1 0 -${radius * 2}`}
        />

        <text 
          x="18" 
          y="19" 
          className="fill-blue-900 font-extrabold text-[0.6em]" 
          textAnchor="middle" 
          dominantBaseline="middle"
        >
          {score}
        </text>

        <text 
          x="18" 
          y="24" 
          className="fill-slate-400 font-medium text-[0.15em]" 
          textAnchor="middle"
        >
          / 100
        </text>
      </svg>
    </div>
  );
};

export default HealthScoreRing;