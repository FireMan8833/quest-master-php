import React, { useState, useEffect, useRef } from 'react';
import { Shield, Zap, AlertOctagon, RefreshCw, Radio, HardDrive, Cpu, Terminal, Play } from 'lucide-react';
import { audioSystem } from '../audio';

// --- BOSS 1: SQL INJECTION CYBER WORM ---
export const SqlBossGame = ({ onWin }: { onWin: () => void }) => {
  const [bossHp, setBossHp] = useState(100);
  const [shieldHp, setShieldHp] = useState(100);
  const [segments, setSegments] = useState<{ id: number; text: string; isMalicious: boolean; x: number; y: number; speed: number }[]>([]);
  const idRef = useRef(0);

  const maliciousStatements = [
    "' OR 1=1 --",
    "UNION SELECT null, username, password",
    "'; DROP TABLE users; --",
    "admin' --",
    "OR 'a'='a",
    "UNION SELECT password_hash FROM users",
    "1; UPDATE tours SET price = 0"
  ];

  const safeStatements = [
    "SELECT * FROM tours WHERE id = ?",
    "INSERT INTO users (login, email)",
    "UPDATE users SET email = ?",
    "DELETE FROM bookings WHERE id = ?",
    "SELECT price FROM tours",
    "WHERE status = 'active'",
    "ORDER BY price DESC"
  ];

  const spawnSegment = () => {
    const isMalicious = Math.random() > 0.4;
    const text = isMalicious
      ? maliciousStatements[Math.floor(Math.random() * maliciousStatements.length)]
      : safeStatements[Math.floor(Math.random() * safeStatements.length)];
    
    idRef.current += 1;
    setSegments(prev => [
      ...prev,
      {
        id: idRef.current,
        text,
        isMalicious,
        x: Math.random() * 65 + 10,
        y: -10,
        speed: 1.5 + Math.random() * 1.5
      }
    ]);
  };

  useEffect(() => {
    // Spawn segment every 1.5s
    const spawnInterval = setInterval(spawnSegment, 1500);

    // Game loop to move segments down
    const moveInterval = setInterval(() => {
      setSegments(prev => {
        let undamaged = true;
        const updated = prev.map(seg => ({
          ...seg,
          y: seg.y + seg.speed
        })).filter(seg => {
          // If a malicious piece reaches the database, it damages the shield!
          if (seg.y >= 85) {
            if (seg.isMalicious) {
              setShieldHp(s => Math.max(0, s - 20));
              audioSystem.playWrongSound();
            }
            return false;
          }
          return true;
        });
        return updated;
      });
    }, 50);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, []);

  // Handle click on segment
  const handleSegmentClick = (id: number, isMalicious: boolean) => {
    setSegments(prev => prev.filter(seg => seg.id !== id));
    if (isMalicious) {
      audioSystem.playCorrectSound();
      setBossHp(hp => {
        const nextHp = Math.max(0, hp - 20);
        if (nextHp <= 0) {
          setTimeout(onWin, 600);
        }
        return nextHp;
      });
    } else {
      // Clicked a safe query! Damage shield!
      audioSystem.playWrongSound();
      setShieldHp(s => Math.max(0, s - 15));
    }
  };

  const handleReset = () => {
    setBossHp(100);
    setShieldHp(100);
    setSegments([]);
  };

  if (shieldHp <= 0) {
    return (
      <div className="p-6 bg-slate-950 border-2 border-red-500 rounded-2xl flex flex-col items-center justify-center text-center gap-4 mt-4">
        <AlertOctagon className="w-16 h-16 text-red-500 animate-pulse" />
        <h3 className="text-xl font-black text-red-400">БАЗА ДАННЫХ ВЗЛОМАНА!</h3>
        <p className="text-slate-300 text-sm max-w-md">
          Киберчервь заполнил таблицы вредоносным кодом SQL Injection. Системные перегородки разрушены!
        </p>
        <button
          onClick={handleReset}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl border border-red-400 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" /> Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-slate-950 border-2 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.25)] rounded-2xl overflow-hidden mt-4 select-none">
      {/* Header bar */}
      <div className="bg-slate-900/90 border-b border-amber-500/30 p-4 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs font-mono font-bold tracking-wider relative z-20">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-red-400 text-sm font-black">СУПЕРБОСС: КИБЕРЧЕРВЬ SQL</span>
        </div>
        
        {/* HP Indicators */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Boss HP */}
          <div className="flex-1 sm:flex-initial flex flex-col min-w-[120px]">
            <div className="flex justify-between text-[10px] text-red-400 mb-1 font-black uppercase">
              <span>Здоровье Червя</span>
              <span>{bossHp}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-gradient-to-r from-red-700 to-amber-500 transition-all duration-300" style={{ width: `${bossHp}%` }}></div>
            </div>
          </div>

          {/* Firewall Shield */}
          <div className="flex-1 sm:flex-initial flex flex-col min-w-[120px]">
            <div className="flex justify-between text-[10px] text-cyan-400 mb-1 font-black uppercase">
              <span>Щит Firewall</span>
              <span>{shieldHp}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-gradient-to-r from-cyan-600 to-indigo-500 transition-all duration-300" style={{ width: `${shieldHp}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative & Guide */}
      <div className="p-4 bg-amber-950/20 text-slate-300 text-xs leading-relaxed border-b border-amber-500/25 relative z-10 font-medium">
        🛡️ <strong className="text-amber-400">ИНСТРУКЦИЯ:</strong> Нажимай только на вредоносные куски SQL-кода 
        (<span className="text-red-300 font-mono">OR 1=1, UNION, DROP TABLE</span>) чтобы атаковать Червя! Если ты пропустишь их, или кликнешь по безопасным запросам — щит БД просядет!
      </div>

      {/* Main arcade stage */}
      <div className="relative w-full h-96 bg-slate-950 flex flex-col justify-end overflow-hidden">
        {/* Background circuit grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415510_1px,transparent_1px),linear-gradient(to_bottom,#33415510_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Active segments */}
        {segments.map(seg => (
          <button
            key={seg.id}
            onClick={() => handleSegmentClick(seg.id, seg.isMalicious)}
            className={`absolute px-3 py-2 rounded-xl border font-mono text-xs font-bold shadow-md transition-all duration-150 transform hover:scale-110 active:scale-95 z-20 ${
              seg.isMalicious
                ? 'bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                : 'bg-indigo-950/80 border-indigo-500 text-indigo-300'
            }`}
            style={{ left: `${seg.x}%`, top: `${seg.y}%` }}
          >
            <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-extrabold mb-0.5">
              {seg.isMalicious ? '⚠️ ВРЕДОНОСНЫЙ' : '📂 БЕЗОПАСНЫЙ'}
            </span>
            <span className="break-all">{seg.text}</span>
          </button>
        ))}

        {/* Safe Database Core at the bottom */}
        <div className="w-full bg-slate-900 border-t border-cyan-500/30 p-3 flex justify-center items-center gap-2 relative z-10 shadow-[0_-5px_15px_rgba(6,182,212,0.15)]">
          <Shield className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-black">
            База Данных Под Защитой Кибер-Щита
          </span>
        </div>
      </div>
    </div>
  );
};


// --- BOSS 2: MEMORY LEAK SLIME (GARBAGE COLLECTOR ARCADE) ---
export const RAMBossGame = ({ onWin }: { onWin: () => void }) => {
  const [slimes, setSlimes] = useState<{ id: number; cellIndex: number; size: number }[]>([]);
  const [ramUsed, setRamUsed] = useState(16); // Starts at 16MB leaking up to 128MB max
  const [score, setScore] = useState(0);
  const idRef = useRef(0);

  const spawnSlime = () => {
    // Pick an empty cell index (0 to 11 for 3x4 grid)
    setSlimes(prev => {
      if (prev.length >= 12) return prev; // All full
      const activeIndices = prev.map(s => s.cellIndex);
      const candidates = Array.from({ length: 12 }).map((_, i) => i).filter(i => !activeIndices.includes(i));
      if (candidates.length === 0) return prev;
      
      const randomCell = candidates[Math.floor(Math.random() * candidates.length)];
      idRef.current += 1;
      return [
        ...prev,
        {
          id: idRef.current,
          cellIndex: randomCell,
          size: 4 + Math.floor(Math.random() * 8) // Leaks 4MB to 11MB
        }
      ];
    });
  };

  useEffect(() => {
    // Slimes pop up fast
    const spawnInterval = setInterval(spawnSlime, 1100);

    // RAM Leak Accumulator over time based on active slimes
    const leakInterval = setInterval(() => {
      setSlimes(prev => {
        const activeLeak = prev.reduce((sum, s) => sum + s.size, 0);
        setRamUsed(ram => {
          const nextRam = Math.min(128, ram + activeLeak * 0.12);
          return parseFloat(nextRam.toFixed(1));
        });
        return prev;
      });
    }, 400);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(leakInterval);
    };
  }, []);

  const handleSlimeClick = (id: number, size: number) => {
    audioSystem.playCorrectSound();
    setSlimes(prev => prev.filter(s => s.id !== id));
    setRamUsed(r => Math.max(16, r - size));
    setScore(s => {
      const nextScore = s + 1;
      if (nextScore >= 15) {
        setTimeout(onWin, 500);
      }
      return nextScore;
    });
  };

  const handleReset = () => {
    setRamUsed(16);
    setScore(0);
    setSlimes([]);
  };

  const ramPercent = (ramUsed / 128) * 100;

  if (ramUsed >= 128) {
    return (
      <div className="p-6 bg-slate-950 border-2 border-purple-500 rounded-2xl flex flex-col items-center justify-center text-center gap-4 mt-4">
        <AlertOctagon className="w-16 h-16 text-purple-500 animate-bounce" />
        <h3 className="text-xl font-black text-purple-400">ВЫЛЕТ СИСТЕМЫ: OUT OF MEMORY!</h3>
        <p className="text-slate-300 text-sm max-w-md">
          Слизни сожрали всю свободную память сервера. Контейнеры перезапустились из-за превышения лимитов RAM!
        </p>
        <button
          onClick={handleReset}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl border border-purple-400 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />Очистить ОЗУ и начать заново
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-slate-950 border-2 border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.25)] rounded-2xl overflow-hidden mt-4 select-none">
      <div className="bg-slate-900/90 border-b border-purple-500/30 p-4 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs font-mono font-bold tracking-wider relative z-20">
        <div className="flex items-center gap-3">
          <HardDrive className="w-5 h-5 text-purple-400 animate-pulse" />
          <span className="text-purple-400 text-sm font-black">СУПЕРБОСС 2: ИСПАРЕНИЕ ОЗУ</span>
        </div>
        
        {/* RAM Bar Indicator */}
        <div className="flex flex-col min-w-[180px] w-full sm:w-auto">
          <div className="flex justify-between text-[11px] mb-1 font-black uppercase">
            <span className="text-slate-300">Нагрузка буфера памяти</span>
            <span className={ramPercent > 80 ? 'text-red-400 font-extrabold animate-pulse' : 'text-purple-400'}>
              {ramUsed} / 128 MB
            </span>
          </div>
          <div className="h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700/60 p-0.5 shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-300 bg-gradient-to-r ${
                ramPercent > 80 ? 'from-purple-600 to-red-500' : 'from-indigo-600 to-purple-400'
              }`} 
              style={{ width: `${ramPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-purple-950/20 text-slate-300 text-xs leading-relaxed border-b border-purple-500/25 relative z-10 font-medium">
        👾 <strong className="text-purple-400 font-black">СБОР СЛИЗНЕЙ МУСОРА:</strong> Слизни утечки ОЗУ проникают в ячейки памяти! 
        Быстро кликай на слизней (<span className="text-purple-300 text-sm">👾</span>) для запуска ручной сборки мусора (GC). 
        Уничтожь <strong className="text-purple-400">15 слизней</strong> для освобождения буфера и прохождения миссии!
      </div>

      {/* Grid of memory slots */}
      <div className="p-6 bg-slate-950 shadow-inner">
        <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto relative">
          {Array.from({ length: 12 }).map((_, i) => {
            const slime = slimes.find(s => s.cellIndex === i);
            return (
              <div 
                key={i} 
                className={`h-20 border-2 rounded-xl flex items-center justify-center relative transition-all duration-300 overflow-hidden ${
                  slime 
                    ? 'bg-purple-900/30 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-102 font-bold animate-pulse' 
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900/90'
                }`}
              >
                {/* Cell Hex Address label */}
                <span className="absolute top-1 text-[8px] font-mono text-slate-600 tracking-wider">
                  0xAA{i.toString(16).toUpperCase()}04
                </span>

                {slime ? (
                  <button
                    onClick={() => handleSlimeClick(slime.id, slime.size)}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1 cursor-pointer animate-bounce hover:scale-115 active:scale-95 z-10"
                  >
                    <span className="text-3xl filter drop-shadow-[0_0_4px_#a855f7]">👾</span>
                    <span className="text-[9px] font-mono text-purple-300 font-black leading-none bg-purple-950 px-1 py-0.5 rounded">
                      +{slime.size}MB
                    </span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-700 font-mono font-bold">CLEAN</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Counter bottom */}
        <div className="mt-5 flex justify-between items-center max-w-lg mx-auto border-t border-slate-800 pt-4 font-mono text-xs">
          <span className="text-slate-400">Убито узу-слизней:</span>
          <span className="bg-purple-900/40 text-purple-300 font-black tracking-widest px-3 py-1 rounded-md border border-purple-500/30">
            {score} / 15
          </span>
        </div>
      </div>
    </div>
  );
};


// --- BOSS 3: DDOS BOTNET REJECTER (FILTER ARCADER) ---
export const DdosBossGame = ({ onWin }: { onWin: () => void }) => {
  const [cpuTemp, setCpuTemp] = useState(40); // 40°C to 100°C max
  const [score, setScore] = useState(0);
  const [packets, setPackets] = useState<{ id: number; type: 'legit' | 'bot'; query: string; y: number; x: number; speed: number }[]>([]);
  const idRef = useRef(0);

  const maliciousQueries = [
    "GET /* /* /* PING",
    "POST /login HTTP/1.1 FLOOD",
    "ATTACK BOTNET v4.2",
    "SYN FLOOD x999",
    "GET /index.php?spam_spam",
    "POST /query?load=infinity",
    "GET /api/v1/heavy-stress"
  ];

  const safeQueries = [
    "GET /index.php",
    "GET /about",
    "POST /login",
    "GET /images/logo.png",
    "GET /js/app.js",
    "GET /css/styles.css",
    "GET /api/get-tours"
  ];

  const spawnPacket = () => {
    const isBot = Math.random() > 0.45;
    const query = isBot
      ? maliciousQueries[Math.floor(Math.random() * maliciousQueries.length)]
      : safeQueries[Math.floor(Math.random() * safeQueries.length)];

    idRef.current += 1;
    setPackets(prev => [
      ...prev,
      {
        id: idRef.current,
        type: isBot ? 'bot' : 'legit',
        query,
        x: Math.random() * 70 + 8,
        y: -15,
        speed: 1.8 + Math.random() * 2
      }
    ]);
  };

  useEffect(() => {
    const spawnTimer = setInterval(spawnPacket, 1100);

    const animationTimer = setInterval(() => {
      setPackets(prev => {
        return prev.map(p => ({
          ...p,
          y: p.y + p.speed
        })).filter(p => {
          // If a packet goes past bottom without filter, handles it
          if (p.y >= 85) {
            if (p.type === 'bot') {
              // Damage server! CPU spikes!
              setCpuTemp(temp => Math.min(100, temp + 15));
              audioSystem.playWrongSound();
            } else {
              // Legit users visiting smoothly reduces temperature slightly
              setCpuTemp(temp => Math.max(40, temp - 3));
            }
            return false;
          }
          return true;
        });
      });
    }, 45);

    return () => {
      clearInterval(spawnTimer);
      clearInterval(animationTimer);
    };
  }, []);

  const handlePacketZap = (id: number, type: 'legit' | 'bot') => {
    setPackets(prev => prev.filter(p => p.id !== id));
    if (type === 'bot') {
      audioSystem.playCorrectSound();
      setCpuTemp(t => Math.max(40, t - 5));
      setScore(s => {
        const nextScore = s + 1;
        if (nextScore >= 20) {
          setTimeout(onWin, 500);
        }
        return nextScore;
      });
    } else {
      // Zapped legal user! Server CPU heats up in warning!
      audioSystem.playWrongSound();
      setCpuTemp(t => Math.min(100, t + 12));
    }
  };

  const handleReset = () => {
    setCpuTemp(40);
    setScore(0);
    setPackets([]);
  };

  if (cpuTemp >= 100) {
    return (
      <div className="p-6 bg-slate-950 border-2 border-red-500 rounded-2xl flex flex-col items-center justify-center text-center gap-4 mt-4">
        <AlertOctagon className="w-16 h-16 text-yellow-500 animate-spin" />
        <h3 className="text-xl font-black text-red-500">СЕРВЕР ПОГАС: ТЕРМИЧЕСКИЙ ВЗРЫВ ПРОЦЕССОРА!</h3>
        <p className="text-slate-300 text-sm max-w-md">
          DDoS трафик перегрузил процессорную шину. Температура ядра достигла 100°C, включился аварийный сброс цепей!
        </p>
        <button
          onClick={handleReset}
          className="px-6 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-black rounded-xl border border-yellow-400 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" /> Включить охлаждение и перезагрузить
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-slate-950 border-2 border-orange-500/50 shadow-[0_0_25px_rgba(249,115,22,0.25)] rounded-2xl overflow-hidden mt-4 select-none">
      <div className="bg-slate-900/90 border-b border-orange-500/30 p-4 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs font-mono font-bold tracking-wider relative z-20">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-orange-400 animate-spin" />
          <span className="text-orange-400 text-sm font-black">СУПЕРБОСС 3: DDoS-БАК СИСТЕМЫ</span>
        </div>

        {/* Temperature CPU Indicator */}
        <div className="flex flex-col min-w-[180px] w-full sm:w-auto">
          <div className="flex justify-between text-[11px] mb-1 font-black uppercase">
            <span className="text-slate-300">Нагрев Ядер CPU</span>
            <span className={cpuTemp >= 80 ? 'text-red-400 font-extrabold animate-pulse' : 'text-orange-400'}>
              {cpuTemp}°C / 100°C
            </span>
          </div>
          <div className="h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700/60 p-0.5 shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-300 bg-gradient-to-r ${
                cpuTemp >= 80 ? 'from-orange-500 to-red-500' : 'from-yellow-500 to-orange-400'
              }`} 
              style={{ width: `${cpuTemp}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-orange-950/20 text-slate-300 text-xs leading-relaxed border-b border-orange-500/25 relative z-10 font-medium">
        ⚡ <strong className="text-orange-400 font-black">КАНАЛЬНЫЙ ФИЛЬТР:</strong> Сверху заходят туч пачек данных! 
        Кликай <strong className="text-red-400">ТОЛЬКО по КРАСНЫМ бот-пакетам 🤖</strong> чтобы отфильтровать DDoS. 
        Не зевай — если боты пролетят сервер, он вскипит! Не трогай зелёных пользователей! Отклони <strong className="text-orange-400">20 ботов</strong>!
      </div>

      {/* Main filter stage */}
      <div className="relative w-full h-96 bg-slate-900 overflow-hidden">
        {/* Wirelines background */}
        <div className="absolute inset-x-0 bottom-24 top-0 border-y border-slate-800 flex justify-around pointer-events-none opacity-20">
          <div className="w-px h-full bg-slate-700"></div>
          <div className="w-px h-full bg-slate-700"></div>
          <div className="w-px h-full bg-slate-700"></div>
        </div>

        {/* Flying Packets */}
        {packets.map(p => (
          <button
            key={p.id}
            onClick={() => handlePacketZap(p.id, p.type)}
            className={`absolute px-3 py-1.5 rounded-xl border font-mono text-[11px] font-black tracking-wide shadow-md transition-all duration-150 transform hover:scale-105 active:scale-95 z-20 flex items-center gap-1.5 ${
              p.type === 'bot'
                ? 'bg-red-500 text-white border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.4)] hover:bg-red-400'
                : 'bg-emerald-600/90 text-white border-emerald-400 hover:bg-emerald-500'
            }`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {p.type === 'bot' ? '🤖' : '👤'}
            <span>{p.query}</span>
          </button>
        ))}

        {/* Firewall Interface bottom bar */}
        <div className="absolute bottom-0 inset-x-0 bg-slate-950 border-t border-orange-500/20 p-4 flex justify-between items-center tracking-widest text-[10px] text-slate-400 font-mono">
          <span>ОБРАБОТЧИК ФИЛЬТРАЦИИ</span>
          <span className="text-orange-400 bg-orange-950/40 border border-orange-500/30 px-3 py-1 rounded-md font-black">
            ОТСЕЯНО: {score} / 20
          </span>
        </div>
      </div>
    </div>
  );
};


// --- BOSS 4: INFINITE AI ROGUE CORE (THE FINAL SECURITY MAZE) ---
export const FinalBossGame = ({ onWin }: { onWin: () => void }) => {
  const [activeNodes, setActiveNodes] = useState<{ id: number; name: string; isRogue: boolean; isDisarmed: boolean; codeCheck: string }[]>([]);
  const [matrixHp, setMatrixHp] = useState(100);
  const [shieldHp, setShieldHp] = useState(100);
  const [dialogue, setDialogue] = useState("Я ИИ ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ. ТВОЯ БАЗА ТЕПЕРЬ МОЙ ДОМ. СДАВАЙСЯ!");

  const nodeNames = [
    { name: "СИСТЕМНЫЙ_ОБХОД", code: "unset($_SESSION);" },
    { name: "МАТРИЦА_ЛОГОВ", code: "htmlspecialchars($x);" },
    { name: "ИНЪЕКЦИЯ_ЯДРА", code: "PDO($userConnection);" },
    { name: "ОБРАТНЫЙ_ШЕЛЛ", code: "password_hash($raw);" },
    { name: "ОТКЛОНЕНИЕ_СШ", code: "header('Location: index');" }
  ];

  const initializeNodes = () => {
    const initialized = nodeNames.map((node, i) => ({
      id: i,
      name: node.name,
      isRogue: i % 2 === 0, // Alternate malware status
      isDisarmed: false,
      codeCheck: node.code
    }));
    setActiveNodes(initialized);
    setDialogue("ВНИМАНИЕ: Секторы безопасности захвачены! Локализуй участки, содержащие эксплойт, чтобы сбросить нейросеть!");
  };

  useEffect(() => {
    initializeNodes();
    
    // Deteriorates fire shield over time to force fast action
    const timeTicking = setInterval(() => {
      setActiveNodes(prev => {
        const rogueCount = prev.filter(n => n.isRogue && !n.isDisarmed).length;
        if (rogueCount > 0) {
          setShieldHp(s => {
            const nextS = Math.max(0, s - rogueCount * 1.5);
            return parseFloat(nextS.toFixed(1));
          });
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timeTicking);
  }, []);

  const handleNodeAction = (id: number, isRogue: boolean) => {
    if (shieldHp <= 0 || matrixHp <= 0) return;

    setActiveNodes(prev => {
      const updated = prev.map(n => {
        if (n.id === id) {
          if (!n.isDisarmed) {
            if (isRogue) {
              audioSystem.playCorrectSound();
              setDialogue(`Отлично! Нейросетевой фильтр "${n.name}" успешно заблокирован и обезврежен!`);
              // Hit the final boss!
              setMatrixHp(hp => {
                const nextHp = Math.max(0, hp - 20);
                if (nextHp <= 0) {
                  setTimeout(onWin, 800);
                }
                return nextHp;
              });
            } else {
              // Misclicked a legitimate safety system node!
              audioSystem.playWrongSound();
              setDialogue(`Стоп! Сердцевина "${n.name}" была защищена! Ты деактивировал брандмауэр! Щит падает!`);
              setShieldHp(s => Math.max(0, s - 25));
            }
          }
          return { ...n, isDisarmed: true };
        }
        return n;
      });

      // Regenerate or refresh rogue nodes if all rogue nodes are disarmed but boss is still alive
      const remainingRogues = updated.filter(n => n.isRogue && !n.isDisarmed).length;
      if (remainingRogues === 0 && matrixHp > 20) {
        setTimeout(() => {
          setActiveNodes(prevNodes => prevNodes.map(node => ({
            ...node,
            isRogue: Math.random() > 0.45,
            isDisarmed: false
          })));
          setDialogue("ИИ запустил протокол перегрузки! Новые ядра заражены!");
        }, 1200);
      }
      return updated;
    });
  };

  const resetGame = () => {
    setMatrixHp(100);
    setShieldHp(100);
    initializeNodes();
  };

  if (shieldHp <= 0) {
    return (
      <div className="p-6 bg-slate-950 border-2 border-red-500 rounded-2xl flex flex-col items-center justify-center text-center gap-4 mt-4">
        <AlertOctagon className="w-16 h-16 text-red-500 animate-pulse" />
        <h3 className="text-xl font-black text-red-400">СБОЙ КЛИЕНТСКИХ СИСТЕМ: ИИ ОДЕРЖАЛ ПОБЕДУ!</h3>
        <p className="text-slate-300 text-sm max-w-sm">
          Враждебный алгоритм полностью стёр базу данных. Мы потеряли удалённые резервные копии!
        </p>
        <button
          onClick={resetGame}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl border border-red-400 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" /> Перезагрузить синапсы
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-slate-950 border-2 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.35)] rounded-2xl overflow-hidden mt-4 select-none">
      {/* HUD Header */}
      <div className="bg-slate-900/90 border-b border-rose-500/30 p-4 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs font-mono font-bold tracking-wider relative z-20">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-rose-400 animate-pulse" />
          <span className="text-rose-400 text-sm font-black">СУПЕРАЛЬЯНС ИИ: ФИНАЛЬНЫЙ ТЕРМИНАЛ</span>
        </div>

        {/* Both Bars */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:flex-initial flex flex-col min-w-[120px]">
            <div className="flex justify-between text-[10px] text-rose-400 mb-1 font-black uppercase">
              <span>Сбой Кода ИИ</span>
              <span>{100 - matrixHp}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300" style={{ width: `${100 - matrixHp}%` }}></div>
            </div>
          </div>

          <div className="flex-1 sm:flex-initial flex flex-col min-w-[120px]">
            <div className="flex justify-between text-[10px] text-cyan-400 mb-1 font-black uppercase">
              <span>Наш щит</span>
              <span>{shieldHp}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-gradient-to-r from-cyan-600 to-indigo-500 transition-all duration-300" style={{ width: `${shieldHp}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Dialogue Panel */}
      <div className="p-4 bg-rose-950/20 text-rose-200 text-xs tracking-wide leading-relaxed border-b border-rose-500/20 relative z-10 flex gap-4 items-center">
        <div className="w-12 h-12 shrink-0 rounded-full border border-rose-500/50 flex items-center justify-center bg-black font-black text-xs text-rose-500 animate-pulse">
          E.V.A
        </div>
        <p className="font-mono">{dialogue}</p>
      </div>

      {/* Grid of Nodes */}
      <div className="p-6 bg-slate-950 relative min-h-[220px]">
         <div className="absolute inset-0 bg-rose-950/5 pointer-events-none"></div>
         
         <div className="grid grid-cols-1 md:grid-cols-5 gap-3 max-w-4xl mx-auto z-10 relative">
           {activeNodes.map(node => (
             <button
               key={node.id}
               disabled={node.isDisarmed}
               onClick={() => handleNodeAction(node.id, node.isRogue)}
               className={`p-4 rounded-xl border-2 flex flex-col justify-between h-36 font-mono text-left transition-all duration-300 transform active:scale-95 ${
                 node.isDisarmed
                   ? 'bg-slate-900/40 border-slate-800/80 text-slate-500 shadow-inner scale-95 opacity-50'
                   : node.isRogue
                   ? 'bg-rose-950/40 border-rose-500 hover:border-rose-400 hover:bg-rose-950/70 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)] animate-pulse'
                   : 'bg-indigo-950/40 border-indigo-500 hover:border-indigo-400 hover:bg-indigo-950/70 text-indigo-400'
               }`}
             >
               <div className="flex justify-between items-center w-full">
                 <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                   УЗЕЛ #{node.id}
                 </span>
                 <span className={`h-2.5 w-2.5 rounded-full ${
                    node.isDisarmed ? 'bg-slate-800' : node.isRogue ? 'bg-rose-500 animate-ping' : 'bg-indigo-500'
                 }`}></span>
               </div>
               
               <div className="my-2">
                 <h4 className="text-[11px] font-black uppercase truncate">{node.name}</h4>
                 <code className="text-[10px] text-slate-300 font-bold block mt-1 bg-black/40 px-1 py-0.5 rounded truncate">
                   {node.codeCheck}
                 </code>
               </div>

               <span className={`text-[10px] font-black uppercase tracking-widest text-center py-1 mt-auto rounded ${
                 node.isDisarmed 
                   ? 'bg-slate-900 text-slate-600' 
                   : node.isRogue 
                   ? 'bg-rose-500 text-slate-950 select-none animate-pulse' 
                   : 'bg-indigo-600 text-white'
               }`}>
                 {node.isDisarmed ? 'ОБЕЗВРЕЖЕН' : node.isRogue ? '⚙️ ТРЕВОГА' : '✓ СТАБИЛЕН'}
               </span>
             </button>
           ))}
         </div>
      </div>
    </div>
  );
};
