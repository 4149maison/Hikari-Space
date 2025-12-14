import React from 'react';
import { BottleData } from '../types';

interface BottleProps {
  bottle: BottleData;
  onClick?: () => void;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  tarotImage?: string;
}

export const Bottle: React.FC<BottleProps> = ({ 
  bottle, 
  onClick, 
  selected = false, 
  size = 'md',
  showLabel = true,
  tarotImage
}) => {
  const sizeClasses = {
    sm: "w-10 h-16",
    md: "w-16 h-28",
    lg: "w-24 h-40",
  };

  const labelClasses = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  const widthClasses = {
    sm: "w-10",
    md: "w-16",
    lg: "w-24",
  };

  return (
    <div 
      className={`flex flex-col items-center gap-2 cursor-pointer transition-all duration-500 ease-out origin-center ${selected ? 'scale-110 -rotate-3 z-10' : 'hover:-translate-y-2 hover:rotate-2'}`}
      onClick={onClick}
    >
      <div 
        className={`relative ${sizeClasses[size]} rounded-t-xl rounded-b-lg overflow-hidden shadow-md transition-all duration-500 
          ${selected ? 'animate-breathing ring-2 ring-white/50 shadow-[0_0_25px_rgba(255,255,255,0.6)]' : 'hover:shadow-lg'}`}
      >
        {/* Top Color */}
        <div 
          className="h-1/2 w-full relative" 
          style={{ backgroundColor: bottle.colors.top }}
        >
          {/* Glass reflection effect - Standardized */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute top-1 left-1 w-1 h-full bg-white/30 blur-[2px] rounded-full opacity-40"></div>
        </div>
        
        {/* Bottom Color */}
        <div 
          className="h-1/2 w-full relative" 
          style={{ backgroundColor: bottle.colors.bottom }}
        >
           {/* Glass reflection effect - Matches top exactly for uniformity */}
           <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
           <div className="absolute top-1 left-1 w-1 h-full bg-white/30 blur-[2px] rounded-full opacity-40"></div>
        </div>

        {/* Shine overlay */}
        <div className="absolute inset-0 border border-white/20 rounded-t-xl rounded-b-lg pointer-events-none"></div>
      </div>

      {showLabel && (
        <div className={`text-center font-serif text-slate-700 transition-colors duration-300 ${labelClasses[size]} ${selected ? 'font-bold text-slate-900' : 'font-semibold'}`}>
          <span className="block font-bold">B{bottle.number}</span>
          <span className="opacity-90 line-clamp-1">{bottle.name}</span>
        </div>
      )}

      {tarotImage && (
        <div className={`${widthClasses[size]} mt-1 rounded-md overflow-hidden shadow-sm border border-slate-100 bg-white`}>
           <img 
             src={tarotImage} 
             alt={`Tarot for B${bottle.number}`} 
             className="w-full h-auto object-cover block transition-opacity duration-300"
             loading="lazy"
           />
        </div>
      )}
    </div>
  );
};