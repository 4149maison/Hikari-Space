import React, { useState } from 'react';
import { BOTTLES, POSITIONS } from '../constants';
import { Bottle } from '../components/Bottle';
import { BottleData, ReadingResult, SelectionState } from '../types';
import { getAuraSomaReading } from '../services/geminiService';
import { RefreshCcw, ArrowRight, Loader2, Info, Sparkles } from 'lucide-react';

export const Reading: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState<number>(1);
  const [selections, setSelections] = useState<SelectionState>({
    1: null, 2: null, 3: null, 4: null
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ReadingResult | null>(null);

  const handleBottleSelect = (bottle: BottleData) => {
    if (selectedPosition > 4) return;

    setSelections(prev => ({
      ...prev,
      [selectedPosition]: bottle
    }));

    // Auto advance to next position
    if (selectedPosition < 4) {
      setSelectedPosition(prev => prev + 1);
    }
  };

  const resetReading = () => {
    setSelections({ 1: null, 2: null, 3: null, 4: null });
    setSelectedPosition(1);
    setResult(null);
  };

  const startAnalysis = async () => {
    // Ensure all 4 selected
    if (Object.values(selections).some(v => v === null)) return;
    
    setIsAnalyzing(true);
    // Cast to required type since check above ensures no nulls
    const safeSelections = selections as { [key: number]: BottleData };
    
    try {
      const data = await getAuraSomaReading(safeSelections);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isComplete = Object.values(selections).every(v => v !== null);

  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-serif text-slate-800 mb-2">您的靈魂色彩解讀</h2>
           <p className="text-slate-500">{result.introduction}</p>
        </div>

        {/* Selected Bottles Display */}
        <div className="grid grid-cols-4 gap-2 sm:gap-8 mb-12">
          {POSITIONS.map(pos => {
            const bottle = selections[pos.id];
            if (!bottle) return null;
            return (
              <div key={pos.id} className="flex flex-col items-center">
                <span className="text-xs text-slate-400 mb-2 uppercase tracking-widest">Pos {pos.id}</span>
                <Bottle bottle={bottle} size="md" />
                <span className="text-xs text-center mt-2 font-medium text-slate-600 hidden sm:block">{bottle.name}</span>
              </div>
            );
          })}
        </div>

        {/* Analysis Content */}
        <div className="space-y-8 bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
          {POSITIONS.map(pos => (
            <div key={pos.id} className="border-b border-slate-100 last:border-0 pb-8 last:pb-0">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-serif font-bold">
                   {pos.id}
                 </div>
                 <div>
                   <h3 className="text-lg font-serif text-slate-800">{pos.title}</h3>
                   <p className="text-xs text-slate-400">{pos.desc}</p>
                 </div>
               </div>
               <p className="text-slate-700 leading-relaxed pl-11">
                 {result.positions[pos.id as 1|2|3|4]}
               </p>
            </div>
          ))}

          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
            <h3 className="text-center font-serif text-slate-800 text-lg mb-3">總結祝福</h3>
            <p className="text-center text-slate-700 italic">
              "{result.summary}"
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={resetReading}
            className="px-6 py-3 rounded-full border border-slate-300 text-slate-600 hover:bg-white hover:shadow-md transition-all flex items-center gap-2 mx-auto"
          >
            <RefreshCcw size={16} />
            開始新的解讀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-80px)]">
      
      {/* Selection Area (Sticky Top) */}
      <div className="flex-none mb-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-serif text-slate-800 mb-2">請依直覺選出 4 個瓶子</h2>
          <p className="text-slate-500 text-sm">點選下方列表中的瓶子，它將自動填入當前空位。</p>
        </div>

        <div className="flex justify-center gap-4 md:gap-8 bg-white/40 p-6 rounded-2xl backdrop-blur-md shadow-sm border border-white/50">
          {POSITIONS.map((pos) => (
            <div 
              key={pos.id} 
              className={`relative flex flex-col items-center transition-all ${selectedPosition === pos.id && !selections[pos.id] ? 'scale-110' : 'opacity-80'}`}
              onClick={() => setSelectedPosition(pos.id)}
            >
              <div 
                className={`
                  w-16 h-28 md:w-20 md:h-32 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all bg-white/50
                  ${selectedPosition === pos.id ? 'border-slate-800 ring-2 ring-slate-200' : 'border-dashed border-slate-300'}
                  ${selections[pos.id] ? 'border-none bg-transparent' : ''}
                `}
              >
                {selections[pos.id] ? (
                  <Bottle bottle={selections[pos.id]!} size="md" showLabel={false} />
                ) : (
                  <span className="text-2xl text-slate-300 font-serif">{pos.id}</span>
                )}
              </div>
              <span className={`text-[10px] mt-2 font-medium uppercase tracking-wider ${selectedPosition === pos.id ? 'text-slate-800' : 'text-slate-400'}`}>
                {pos.title.split(' ')[0]}
              </span>
              
              {/* Clear button for specific slot */}
              {selections[pos.id] && (
                <button 
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow text-slate-400 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelections(prev => ({ ...prev, [pos.id]: null }));
                    setSelectedPosition(pos.id);
                  }}
                >
                  <RefreshCcw size={10} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-center mb-4 min-h-[50px]">
        {isComplete ? (
          <button 
            onClick={startAnalysis}
            disabled={isAnalyzing}
            className="animate-bounce-gentle px-8 py-3 bg-slate-800 text-white rounded-full text-lg font-medium hover:bg-slate-700 shadow-lg shadow-slate-300 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                解讀能量中...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                開始解讀
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-slate-500 bg-slate-100 px-4 py-2 rounded-full text-sm">
            <Info size={16} />
            <span>目前正在選擇第 {selectedPosition} 瓶：{POSITIONS.find(p => p.id === selectedPosition)?.title}</span>
          </div>
        )}
      </div>

      {/* Bottle Picker (Scrollable) */}
      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {BOTTLES.map(bottle => {
            // Check if bottle is already selected
            const isSelected = Object.values(selections).some((s) => (s as BottleData | null)?.id === bottle.id);
            
            return (
              <div key={bottle.id} className={isSelected ? 'opacity-30 pointer-events-none grayscale' : ''}>
                <Bottle 
                  bottle={bottle} 
                  size="sm" 
                  onClick={() => handleBottleSelect(bottle)}
                />
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};