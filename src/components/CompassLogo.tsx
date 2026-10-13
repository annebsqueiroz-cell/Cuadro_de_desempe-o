import React, { useState } from 'react';
import compassLogoImg from '../assets/images/rincon_compass_logo_1789825867227.jpg';

interface CompassLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'image' | 'vector';
  showRing?: boolean;
}

export const CompassLogo: React.FC<CompassLogoProps> = ({
  className = '',
  size = 'md',
  showRing = true,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const currentSizeClass = sizeClasses[size];

  // If image loaded successfully, render the image in a rounded badge
  if (!imageFailed) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden shadow-md shadow-red-600/20 shrink-0 bg-white flex items-center justify-center ${
          showRing ? 'ring-2 ring-red-600/20' : ''
        } ${currentSizeClass} ${className}`}
      >
        <img
          src={compassLogoImg}
          alt="Bússola - Rincón Hispano"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  // Pure SVG Nautical Compass Rose Vector Fallback
  return (
    <div
      className={`rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/25 shrink-0 ${
        showRing ? 'ring-2 ring-red-200' : ''
      } ${currentSizeClass} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-4/5 h-4/5 text-white"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeDasharray="2 3"
          opacity="0.8"
        />
        <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="1.5" />

        {/* Compass Cardinal Tick Marks */}
        <line x1="50" y1="5" x2="50" y2="12" stroke="currentColor" strokeWidth="2.5" />
        <line x1="50" y1="88" x2="50" y2="95" stroke="currentColor" strokeWidth="2.5" />
        <line x1="5" y1="50" x2="12" y2="50" stroke="currentColor" strokeWidth="2.5" />
        <line x1="88" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2.5" />

        {/* Compass Cardinal Points */}
        {/* North Pointer - White highlight on one side */}
        <polygon points="50,14 50,50 43,45" fill="white" opacity="0.95" />
        <polygon points="50,14 50,50 57,45" fill="white" opacity="0.75" />

        {/* South Pointer */}
        <polygon points="50,86 50,50 43,55" fill="white" opacity="0.75" />
        <polygon points="50,86 50,50 57,55" fill="white" opacity="0.95" />

        {/* East Pointer */}
        <polygon points="86,50 50,50 55,43" fill="white" opacity="0.95" />
        <polygon points="86,50 50,50 55,57" fill="white" opacity="0.75" />

        {/* West Pointer */}
        <polygon points="14,50 50,50 45,43" fill="white" opacity="0.75" />
        <polygon points="14,50 50,50 45,57" fill="white" opacity="0.95" />

        {/* Center Pivot Rings */}
        <circle cx="50" cy="50" r="6" fill="white" />
        <circle cx="50" cy="50" r="2.5" fill="#dc2626" />
      </svg>
    </div>
  );
};
