import React from 'react';

export default function Spinner({ size = 40, color = '#6366f1' }: { size?: number; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        style={{ display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Loading"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray="31.4 31.4"
          strokeLinecap="round"
          style={{
            transformOrigin: 'center',
            animation: 'spinner-rotate 1s linear infinite',
          }}
        />
        <style>{`
          @keyframes spinner-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </svg>
    </div>
  );
}