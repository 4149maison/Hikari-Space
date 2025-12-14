import React from 'react';
import { ViewState } from '../types';
import { Sparkles, Grid, Home } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onChangeView }) => {
  const navItemClass = (view: ViewState) => `
    flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer
    ${currentView === view 
      ? 'bg-slate-800 text-white shadow-md' 
      : 'text-slate-500 hover:bg-slate-100'
    }
  `;

  return (
    <header className="sticky top-0 z-50 w-full glass-effect border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onChangeView(ViewState.HOME)}
        >
          {/* Logo Graphic Representation */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <span className="text-2xl font-serif text-[#0f3057] font-light leading-none">光</span>
            <Sparkles className="absolute -top-1 -right-2 text-[#c5a059]" size={14} fill="#c5a059" />
          </div>
          
          {/* Text Logo */}
          <div className="flex flex-col justify-center h-full pt-1">
            <div className="flex items-center tracking-[0.15em] font-sans font-medium text-lg leading-none">
              <span className="text-[#0f3057]">HIKARI</span>
              <span className="w-1.5"></span>
              <span className="text-[#c5a059]">SPACE</span>
            </div>
          </div>
        </div>

        <nav className="flex gap-2">
          <button 
            className={navItemClass(ViewState.HOME)}
            onClick={() => onChangeView(ViewState.HOME)}
          >
            <Home size={18} />
            <span className="hidden sm:inline">首頁</span>
          </button>
          
          <button 
            className={navItemClass(ViewState.GALLERY)}
            onClick={() => onChangeView(ViewState.GALLERY)}
          >
            <Grid size={18} />
            <span className="hidden sm:inline">瓶子圖鑑</span>
          </button>

          <button 
            className={navItemClass(ViewState.READING)}
            onClick={() => onChangeView(ViewState.READING)}
          >
            <Sparkles size={18} />
            <span className="hidden sm:inline">線上諮詢</span>
          </button>
        </nav>
      </div>
    </header>
  );
};