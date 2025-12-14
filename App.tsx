import React, { useState } from 'react';
import { Header } from './components/Header';
import { Home } from './views/Home';
import { Gallery } from './views/Gallery';
import { Reading } from './views/Reading';
import { ViewState } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);

  const renderView = () => {
    switch (currentView) {
      case ViewState.GALLERY:
        return <Gallery />;
      case ViewState.READING:
        return <Reading />;
      case ViewState.HOME:
      default:
        return <Home onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-800 font-sans selection:bg-pink-100 selection:text-pink-900">
      <Header currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="w-full">
        {renderView()}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(200, 200, 200, 0.3); }
          50% { transform: scale(1.03); box-shadow: 0 0 30px rgba(255, 215, 0, 0.4); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        .animate-bounce-gentle {
          animation: bounce 2s infinite;
        }
        .animate-breathing {
          animation: breathe 3s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}

export default App;