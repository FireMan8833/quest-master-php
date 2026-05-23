import React from 'react';

export const Mascot = ({ emotion = 'happy', className = '' }: { emotion?: 'happy' | 'think' | 'excited' | 'error', className?: string }) => {
  // A clean, vector-style programmer character SVG
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Glow */}
      <circle cx="100" cy="100" r="90" fill="#E0F2FE" />
      
      {/* Body */}
      <path d="M50 190 C 50 150, 150 150, 150 190" fill="#3B82F6" stroke="#1E40AF" strokeWidth="8" strokeLinecap="round"/>
      
      {/* Head */}
      <rect x="60" y="50" width="80" height="80" rx="20" fill="#FDBA74" stroke="#C2410C" strokeWidth="6"/>
      
      {/* Hard Hat (Builder aspect) */}
      <path d="M45 60 Q 100 20 155 60 L 155 65 L 45 65 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="6"/>
      
      {/* Eyes */}
      {emotion === 'happy' && (
        <>
          <circle cx="85" cy="90" r="6" fill="#1E40AF"/>
          <circle cx="115" cy="90" r="6" fill="#1E40AF"/>
        </>
      )}
      {emotion === 'think' && (
        <>
          <rect x="80" y="88" width="12" height="4" fill="#1E40AF"/>
          <circle cx="115" cy="90" r="6" fill="#1E40AF"/>
        </>
      )}
      {emotion === 'excited' && (
        <>
          <path d="M 80 95 L 85 85 L 90 95" stroke="#1E40AF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M 110 95 L 115 85 L 120 95" stroke="#1E40AF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      )}
      {emotion === 'error' && (
        <>
          <path d="M 80 85 L 90 95 M 80 95 L 90 85" stroke="#1E40AF" strokeWidth="4" strokeLinecap="round"/>
          <path d="M 110 85 L 120 95 M 110 95 L 120 85" stroke="#1E40AF" strokeWidth="4" strokeLinecap="round"/>
        </>
      )}

      {/* Glasses */}
      <rect x="75" y="80" width="20" height="20" rx="4" fill="none" stroke="#1E40AF" strokeWidth="3"/>
      <rect x="105" y="80" width="20" height="20" rx="4" fill="none" stroke="#1E40AF" strokeWidth="3"/>
      <line x1="95" y1="90" x2="105" y2="90" stroke="#1E40AF" strokeWidth="3"/>

      {/* Mouth */}
      {emotion === 'happy' && <path d="M 90 110 Q 100 120 110 110" stroke="#C2410C" strokeWidth="4" strokeLinecap="round"/>}
      {emotion === 'excited' && <path d="M 90 110 Q 100 125 110 110 Z" fill="#EF4444" stroke="#C2410C" strokeWidth="3"/>}
      {emotion === 'think' && <line x1="95" y1="115" x2="105" y2="115" stroke="#C2410C" strokeWidth="4" strokeLinecap="round"/>}
      {emotion === 'error' && <path d="M 90 115 Q 100 105 110 115" stroke="#C2410C" strokeWidth="4" strokeLinecap="round"/>}

    </svg>
  );
};
