import React, { useState, useEffect } from 'react';

export const BugCatcherGame = ({ onWin }: { onWin: () => void }) => {
  const [bugs, setBugs] = useState<{ id: number, x: number, y: number }[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const initialBugs = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 70
    }));
    setBugs(initialBugs);
    
    const interval = setInterval(() => {
      setBugs(prev => prev.map(b => ({
         ...b, 
         x: Math.max(5, Math.min(90, b.x + (Math.random() - 0.5) * 25)),
         y: Math.max(5, Math.min(80, b.y + (Math.random() - 0.5) * 25))
      })));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const catchBug = (id: number) => {
    setBugs(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 1);
    if (score + 1 === 15) {
      setTimeout(onWin, 500);
    }
  };

  return (
    <div className="relative w-full h-80 bg-slate-950 border-2 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] rounded-2xl overflow-hidden mt-4 group cursor-crosshair">
      <div className="absolute top-4 left-4 right-4 flex justify-between tracking-widest text-red-500 font-mono text-sm z-10 pointer-events-none">
        <span>УГРОЗА ОБНАРУЖЕНА</span>
        <span>ОТЛОВЛЕНО: {score}/15</span>
      </div>
      <div className="absolute inset-0 bg-red-900/10 z-0"></div>
      {bugs.map(bug => (
        <button
          key={bug.id}
          onClick={() => catchBug(bug.id)}
          className="absolute text-3xl transition-all duration-300 transform hover:scale-125 hover:-translate-y-2 hover:rotate-12 z-20"
          style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
        >
          🐛
        </button>
      ))}
      <div className="absolute inset-0 pointer-events-none border-red-500/10 border-[16px] rounded-2xl mix-blend-overlay"></div>
    </div>
  );
};

export const QueryBuilderGame = ({ data, onWin }: { data: any, onWin: () => void }) => {
  const { pieces } = data;
  const [selected, setSelected] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([]);
  
  useEffect(() => {
     setAvailable([...pieces].sort(() => Math.random() - 0.5));
  }, [pieces]);

  const selectPiece = (p: string) => {
    const newSelected = [...selected, p];
    setSelected(newSelected);
    setAvailable(available.filter(x => x !== p));
    
    if (newSelected.length === pieces.length) {
      if (newSelected.join(' ') === pieces.join(' ')) {
        setTimeout(onWin, 600);
      } else {
        setTimeout(() => {
           setSelected([]);
           setAvailable([...pieces].sort(() => Math.random() - 0.5));
        }, 800);
      }
    }
  };

  const isComplete = selected.length === pieces.length && selected.join(' ') === pieces.join(' ');
  const isFailed = selected.length === pieces.length && !isComplete;

  return (
    <div className="mt-6 flex flex-col gap-8">
      <div className={`min-h-[100px] p-6 bg-slate-900 border-2 border-dashed ${isComplete ? 'border-emerald-500 bg-emerald-900/20' : isFailed ? 'border-red-500 bg-red-900/20' : 'border-indigo-500/50'} rounded-2xl flex gap-3 flex-wrap items-center transition-colors duration-300 shadow-inner relative z-10`}>
        {selected.length === 0 && <span className="text-slate-500 font-mono text-sm absolute inset-0 flex items-center justify-center tracking-widest uppercase">Перемести блоки сюда...</span>}
        
        {selected.map((p, i) => (
           <span key={i} className={`px-4 py-2 font-black text-sm uppercase tracking-wide rounded shadow-md border ${isComplete ? 'bg-emerald-500 border-emerald-400 text-slate-900' : isFailed ? 'bg-red-500 border-red-400 text-white' : 'bg-indigo-600 border-indigo-400 text-white'} animate-in duration-200`}>
             {p}
           </span>
        ))}
      </div>
      
      <div className="flex gap-4 flex-wrap justify-center z-10">
        {available.map((p, i) => (
           <button 
             key={i} 
             onClick={() => selectPiece(p)}
             className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-yellow-400 font-black uppercase tracking-wide rounded-xl hover:border-yellow-400 hover:-translate-y-1 hover:shadow-lg transition-all shadow-md active:translate-y-0"
           >
             {p}
           </button>
        ))}
      </div>
    </div>
  );
};
