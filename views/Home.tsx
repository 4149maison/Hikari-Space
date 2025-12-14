import React from 'react';
import { ViewState } from '../types';
import { BOTTLES } from '../constants';
import { Bottle } from '../components/Bottle';
import { ArrowRight } from 'lucide-react';

interface HomeProps {
  onChangeView: (view: ViewState) => void;
}

export const Home: React.FC<HomeProps> = ({ onChangeView }) => {
  // Display a random selection of 5 bottles for visual appeal
  const displayBottles = React.useMemo(() => {
    return [...BOTTLES].sort(() => 0.5 - Math.random()).slice(0, 5);
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-6xl font-serif text-slate-800 leading-tight">
          妳是色彩，<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-500">
            色彩是妳。
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed">
          透過 Aura-Soma 靈性彩油，探索靈魂深處的語言。<br/>
          每一個瓶子都是一面鏡子，映照出妳當下的能量與潛能。
        </p>

        <div className="flex justify-center gap-4 py-8 overflow-hidden">
          {displayBottles.map((b) => (
            <div key={b.id} className="transform hover:-translate-y-2 transition-transform duration-500">
              <Bottle bottle={b} size="sm" showLabel={false} />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => onChangeView(ViewState.READING)}
            className="group px-8 py-4 bg-slate-800 text-white rounded-full font-medium hover:bg-slate-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
          >
            <span className="tracking-wide">開始我的色彩解讀</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
          </button>
          
          <button 
            onClick={() => onChangeView(ViewState.GALLERY)}
            className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-medium hover:border-slate-400 transition-all"
          >
            瀏覽所有瓶子
          </button>
        </div>
      </div>
      
      <div className="mt-16 text-slate-400 text-sm font-light">
        Aura-Soma® Equilibrium System
      </div>
    </div>
  );
};