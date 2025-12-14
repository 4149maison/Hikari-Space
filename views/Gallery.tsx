import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BOTTLES } from '../constants';
import { Bottle } from '../components/Bottle';
import { BottleData } from '../types';
import { X, Search, Sparkles, Heart, Brain, Activity, Droplets, ImageOff, HelpCircle } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [selectedBottle, setSelectedBottle] = useState<BottleData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageError, setImageError] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState("");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedBottle) {
      document.body.style.overflow = 'hidden';
      // Reset image state when a new bottle is selected
      setImageError(false);
      setCurrentImageSrc(selectedBottle.tarotImage || "");
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedBottle]);

  const filteredBottles = BOTTLES.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.number.toString().includes(searchTerm) ||
    b.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in relative">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-serif font-bold text-slate-800">平衡油圖鑑</h2>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="搜尋名稱或號碼..." 
            className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10 pb-20">
        {filteredBottles.map((bottle) => (
          <Bottle 
            key={bottle.id} 
            bottle={bottle} 
            onClick={() => setSelectedBottle(bottle)}
          />
        ))}
      </div>

      {filteredBottles.length === 0 && (
        <div className="text-center py-20 text-slate-500 font-medium">
          沒有找到符合 "{searchTerm}" 的瓶子
        </div>
      )}

      {/* Detail Modal - Rendered via Portal to ensure viewport centering */}
      {selectedBottle && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedBottle(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-scale-in">
            <button 
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors z-10"
              onClick={() => setSelectedBottle(null)}
            >
              <X size={24} />
            </button>

            {/* Visual Side (Sticky on desktop) */}
            <div className="md:w-1/3 bg-slate-50 flex flex-col items-center p-8 border-r border-slate-100 overflow-y-auto custom-scrollbar">
               <div className="sticky top-0 flex flex-col items-center w-full space-y-6">
                 <Bottle bottle={selectedBottle} size="lg" showLabel={false} />
                 
                 <div className="w-full space-y-4">
                   <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Color Energy</h4>
                     <div className="grid grid-cols-2 gap-2">
                        <div className="text-center">
                          <div className="w-8 h-8 rounded-full mx-auto mb-2 border border-slate-200 shadow-inner" style={{backgroundColor: selectedBottle.colors.top}}></div>
                          <span className="text-xs font-bold text-slate-600">{selectedBottle.colors.topLabel}</span>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 rounded-full mx-auto mb-2 border border-slate-200 shadow-inner" style={{backgroundColor: selectedBottle.colors.bottom}}></div>
                          <span className="text-xs font-bold text-slate-600">{selectedBottle.colors.bottomLabel}</span>
                        </div>
                     </div>
                     {selectedBottle.mixedColor && (
                       <div className="text-center mt-3 pt-3 border-t border-slate-100">
                         <span className="text-xs font-bold text-slate-400 block mb-1">混合色</span>
                         <span className="text-sm font-bold text-slate-800">{selectedBottle.mixedColor}</span>
                       </div>
                     )}
                   </div>

                   {/* Tarot Card Image Section */}
                   {selectedBottle.tarotImage && (
                     <div className="w-full flex flex-col gap-3 mt-2">
                       {/* Text Header */}
                       {selectedBottle.tarot && (
                          <div className="text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Tarot Archetype</span>
                            <div className="font-serif font-bold text-slate-700 text-lg leading-none">{selectedBottle.tarot}</div>
                          </div>
                        )}

                       {/* Image Card Container */}
                       <div className="relative w-full rounded-xl overflow-hidden shadow-lg border border-slate-100 bg-slate-100 group min-h-[250px] flex items-center justify-center">
                          {!imageError ? (
                            <>
                              <img 
                                key={selectedBottle.id}
                                src={currentImageSrc} 
                                alt={`Tarot card for Bottle ${selectedBottle.number}`} 
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => {
                                  // Attempt to fix common case sensitivity issue automatically
                                  if (currentImageSrc.endsWith('.jpg') && !currentImageSrc.endsWith('.JPG')) {
                                      setCurrentImageSrc(currentImageSrc.replace('.jpg', '.JPG'));
                                  } else {
                                      console.error("Image load error for:", currentImageSrc);
                                      setImageError(true);
                                  }
                                }}
                              />
                              {/* Shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"></div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-50 w-full h-full min-h-[250px] gap-2">
                              <ImageOff size={32} className="opacity-50 text-red-300" />
                              <h5 className="text-sm font-bold text-slate-600">圖片讀取失敗</h5>
                              
                              <div className="text-[10px] bg-slate-200/50 p-3 rounded-lg text-left w-full space-y-1">
                                <p className="font-bold border-b border-slate-300 pb-1 mb-1">請檢查以下幾點：</p>
                                <p>1. 檔案位置: <span className="font-mono text-red-500 bg-red-50 px-1 rounded">{selectedBottle.tarotImage}</span></p>
                                <p>2. 資料夾: 確認 <span className="font-mono">tarot</span> 資料夾是在 <span className="font-mono">public</span> 內（與 src 平行）。</p>
                                <p>3. 檔名: 必須是 <span className="font-mono">.jpg</span> (小寫)。</p>
                              </div>
                            </div>
                          )}
                       </div>
                     </div>
                   )}
                 </div>
               </div>
            </div>

            {/* Content Side (Scrollable) */}
            <div className="md:w-2/3 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-white">
              <div className="mb-2 text-slate-500 font-bold tracking-widest text-sm uppercase">
                {selectedBottle.alias || `Bottle ${selectedBottle.number}`}
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">{selectedBottle.name}</h3>
              
              <div className="flex gap-2 mb-8 flex-wrap">
                {selectedBottle.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="space-y-8">
                {/* Main Theme & Affirmation */}
                <div>
                  <h4 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">主題</h4>
                  {/* Increased size and weight */}
                  <p className="text-xl font-medium text-slate-800 leading-relaxed font-serif">{selectedBottle.theme}</p>
                </div>
                
                <div className="bg-[#fdfbf7] p-6 rounded-xl border border-[#e2dfd5] relative overflow-hidden group shadow-sm">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-100/50 to-transparent rounded-bl-full -mr-8 -mt-8"></div>
                  <h4 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wide flex items-center gap-1 relative z-10">
                    <Sparkles size={14} className="text-yellow-500"/> 肯定語
                  </h4>
                  {/* Heavier weight for affirmation */}
                  <p className="text-slate-800 font-serif font-medium italic text-xl relative z-10 tracking-wide">"{selectedBottle.affirmation}"</p>
                </div>

                {/* Detailed Sections - Text sizes increased to text-base/text-lg and font-medium */}
                {(selectedBottle.positivePersonality || selectedBottle.challengePersonality) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {selectedBottle.positivePersonality && (
                      <div className="bg-emerald-50/60 p-5 rounded-xl border border-emerald-100">
                        <h4 className="text-base font-bold text-emerald-800 mb-3 flex items-center gap-2">
                          ★ 正向的人格面
                        </h4>
                        <p className="text-base font-medium text-slate-800 leading-relaxed text-justify tracking-wide">
                          {selectedBottle.positivePersonality}
                        </p>
                      </div>
                    )}
                    {selectedBottle.challengePersonality && (
                      <div className="bg-rose-50/60 p-5 rounded-xl border border-rose-100">
                        <h4 className="text-base font-bold text-rose-800 mb-3 flex items-center gap-2">
                          ★ 可以改善的人格面
                        </h4>
                        <p className="text-base font-medium text-slate-800 leading-relaxed text-justify tracking-wide">
                          {selectedBottle.challengePersonality}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Levels - Increased readability */}
                {(selectedBottle.spiritualLevel || selectedBottle.mentalLevel || selectedBottle.emotionalLevel) && (
                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    {selectedBottle.spiritualLevel && (
                      <div className="flex gap-4">
                        <div className="flex-none pt-1">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <Sparkles className="text-purple-600" size={20} />
                            </div>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900 mb-1">心靈層面</h4>
                          <p className="text-base font-medium text-slate-700 leading-loose tracking-wide">{selectedBottle.spiritualLevel}</p>
                        </div>
                      </div>
                    )}
                    {selectedBottle.mentalLevel && (
                      <div className="flex gap-4">
                        <div className="flex-none pt-1">
                             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Brain className="text-blue-600" size={20} />
                            </div>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900 mb-1">心理層面</h4>
                          <p className="text-base font-medium text-slate-700 leading-loose tracking-wide">{selectedBottle.mentalLevel}</p>
                        </div>
                      </div>
                    )}
                    {selectedBottle.emotionalLevel && (
                      <div className="flex gap-4">
                        <div className="flex-none pt-1">
                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                <Heart className="text-pink-600" size={20} />
                            </div>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900 mb-1">情感層面</h4>
                          <p className="text-base font-medium text-slate-700 leading-loose tracking-wide">{selectedBottle.emotionalLevel}</p>
                        </div>
                      </div>
                    )}
                     {selectedBottle.physicalLevel && (
                      <div className="flex gap-4">
                        <div className="flex-none pt-1">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Activity className="text-green-600" size={20} />
                            </div>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900 mb-1">身體層面</h4>
                          <p className="text-base font-medium text-slate-700 leading-loose tracking-wide">{selectedBottle.physicalLevel}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Where to apply */}
                {selectedBottle.whereToApply && (
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex gap-4 items-start">
                    <Droplets className="text-blue-600 flex-none mt-1" size={20} />
                    <div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">★ 使用部位</h4>
                      <p className="text-base font-medium text-slate-800 tracking-wide">{selectedBottle.whereToApply}</p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};