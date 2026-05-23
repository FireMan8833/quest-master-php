import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { questData } from './data';
import { Mascot } from './components/Mascot';
import { Terminal, Database, Code, ShieldCheck, CheckCircle, ArrowRight, Play, Volume2, VolumeX } from 'lucide-react';
import { BugCatcherGame, QueryBuilderGame } from './components/MiniGames';
import { achievementsData, Achievement } from './achievements';
import { audioSystem } from './audio';

export default function App() {
  const [started, setStarted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [emotion, setEmotion] = useState<'happy' | 'think' | 'excited' | 'error'>('happy');
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  
  // Достижения
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);

  // Секретное меню
  const [mascotClicks, setMascotClicks] = useState(0);
  const [showSecretMenu, setShowSecretMenu] = useState(false);
  const [secretInput, setSecretInput] = useState('');

  // Очки
  const [score, setScore] = useState(0);

  // Кастомные режимы (доступны после 10 и 20 уровней)
  const [chaosMode, setChaosMode] = useState(false);
  const [superChaos, setSuperChaos] = useState(false);

  const step = questData[currentStepIndex];
  const progress = ((currentStepIndex) / questData.length) * 100;

  // Хаос режим: перемешивание вариантов ответов
  const shuffledOptions = useMemo(() => {
    if (step.type !== 'mini_game' && step.options) {
      if (chaosMode) {
        return [...step.options].sort(() => Math.random() - 0.5);
      }
      return step.options;
    }
    return [];
  }, [step.id, chaosMode]);

  useEffect(() => {
    if (isCorrect === true) {
      setEmotion('excited');
    } else if (isCorrect === false) {
      setEmotion('error');
    } else {
      setEmotion('happy');
    }
  }, [isCorrect]);

  const checkAchievement = (id: number) => {
    const matched = achievementsData.find(a => a.triggerAtStepId === id);
    if (matched) {
      setUnlockedAchievements(prev => {
        if (!prev.includes(matched.id)) {
          setTimeout(() => {
            audioSystem.playAchievementSound();
            setActiveAchievement(matched);
            const themeColors = matched.theme === 'emerald' ? ['#10B981', '#34D399', '#ffffff'] :
                                matched.theme === 'purple' ? ['#8B5CF6', '#A78BFA', '#ffffff'] :
                                matched.theme === 'cyan' ? ['#06B6D4', '#22D3EE', '#ffffff'] :
                                ['#FBBF24', '#F59E0B', '#FFFFFF'];
            confetti({
              particleCount: 120,
              spread: 70,
              colors: themeColors,
              origin: { y: 0.5 }
            });
          }, 600);
          return [...prev, matched.id];
        }
        return prev;
      });
    }
  };

  const handleMascotClick = () => {
    setMascotClicks(prev => {
      const newClicks = prev + 1;
      if (newClicks >= 3) {
        setShowSecretMenu(true);
        return 0; // reset
      }
      return newClicks;
    });
  };

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = secretInput.trim();
    if (val === '777') {
      if (step.correctAnswer) {
        setSelectedOption(String(step.correctAnswer));
      }
      if (isCorrect !== true) setScore(s => s + 100);
      setIsCorrect(true);
      checkAchievement(step.id);
      setShowSecretMenu(false);
      setSecretInput('');
      return;
    }
    
    const targetQuest = parseInt(val, 10);
    if (!isNaN(targetQuest) && targetQuest >= 1 && targetQuest <= questData.length) {
      setCurrentStepIndex(targetQuest - 1);
      setIsCorrect(null);
      setSelectedOption(null);
      setShowHint(false);
      setShowSecretMenu(false);
      setSecretInput('');
      return;
    }
    
    alert('Неверный код или номер уровня!');
    setSecretInput('');
  };

  const generateHint = (stepData: any) => {
    if (stepData.type === 'mini_game') {
      return stepData.miniGameType === 'bug_catcher' 
        ? 'Просто кликай по багам (🐛) как можно быстрее, пока они не испортили базу данных!' 
        : 'Собери SQL-запрос по кусочкам. Начни с классического SELECT * FROM...';
    }
    
    if (stepData.correctAnswer === undefined) return "Подумай хорошенько, ответ где-то рядом!";
    
    const strAns = String(stepData.correctAnswer);
    
    if (strAns.includes('INSERT')) return "Тебе нужна команда INSERT для вставки данных.";
    if (strAns.includes('UPDATE')) return "Используй UPDATE для обновления уже существующих данных.";
    if (strAns.includes('DELETE')) return "Для удаления записей используется ключевое слово DELETE.";
    if (strAns.includes('SELECT')) return "Чтобы достать или получить данные, используй SELECT.";
    if (strAns.includes('password_hash')) return "Пароли нужно ОБЯЗАТЕЛЬНО хешировать специльной функцией password_...()";
    if (strAns.includes('$_SESSION')) return "Сессии - ключ к запоминанию пользователей между страницами.";
    if (strAns.includes('require')) return "Обязательное (строгое) подключение файла делается через require.";
    if (strAns.includes('JOIN')) return "Для объединения двух таблиц используется слово JOIN.";
    if (strAns.includes('LIMIT')) return "Ограничить количество выводимых строк - значит задать лимит.";
    
    // Fallback generic hint
    if (strAns.length < 10) return `Подумай, возможно ответ звучит очень похоже на "${strAns}"`;
    
    const words = strAns.split(/[\s(]+/);
    if (words.length > 0 && words[0].length > 3) {
      return `Обрати внимание на вариант, который начинается с "${words[0]}" ...`;
    }
    
    return `Первые символы правильного ответа: ${strAns.substring(0, 5)}...`;
  };

  const handleStart = () => {
    setStarted(true);
    setEmotion('happy');
    audioSystem.toggleBackgroundMusic(true);
  };

  const verifyAnswer = (answer: string) => {
    setSelectedOption(answer);
    if (answer === step.correctAnswer) {
      audioSystem.playCorrectSound();
      const points = (isCorrect === null ? 100 : 50) * (superChaos ? 2 : 1);
      setScore(s => s + points);
      setIsCorrect(true);
      if (currentStepIndex === questData.length - 1) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      checkAchievement(step.id);
    } else {
      audioSystem.playWrongSound();
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < questData.length - 1) {
      setCurrentStepIndex(curr => curr + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowHint(false);
    } else {
      setCompleted(true);
    }
  };

  // Pre-game screen
  if (!started) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-slate-800 border border-slate-700 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <svg width="200" height="200" viewBox="0 0 24 24" fill="white"><path d="M20 7h-9l-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/></svg>
          </div>
          
          <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl mb-6 relative z-10 overflow-hidden pt-4">
             <Mascot emotion="excited" className="w-24 h-24" />
          </div>
          
          <h1 className="text-4xl font-black tracking-tight uppercase italic mb-4 relative z-10 mt-2">
             Квест: <span className="text-yellow-400">Мастер PHP & SQL</span>
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-lg relative z-10 font-medium leading-relaxed">
            Привет! Я Боб, твой прораб по коду. Твоя задача — помочь мне спроектировать крутой сайт (турагентство или форум).
            Нас ждут 40 испытаний (пока я загрузил первые {questData.length}). Готов стать Senior разработчиком?
          </p>
          <button 
            onClick={handleStart}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-black text-slate-900 bg-yellow-400 rounded-xl uppercase tracking-widest shadow-[0_4px_0_0_#ca8a04] hover:mt-1 hover:shadow-[0_3px_0_0_#ca8a04] hover:bg-yellow-300 transition-all z-10"
          >
            <Play className="w-5 h-5 mr-3 fill-current" />
            НАЧАТЬ КВЕСТ
          </button>
        </div>
      </div>
    );
  }

  // Completion screen
  if (completed) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <svg width="300" height="300" viewBox="0 0 24 24" fill="white"><path d="M20 7h-9l-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/></svg>
          </div>
          
          <div className="bg-slate-800 border-b border-slate-700/50 p-8 text-center relative z-10">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 mb-2 uppercase italic tracking-tight">Проект Успешно Запущен!</h1>
            <p className="text-yellow-400/80 font-bold uppercase tracking-widest text-sm">Ты применил все навыки PHP и SQL.</p>
          </div>
          
          <div className="p-8 flex flex-col md:flex-row gap-10 items-center relative z-10">
            <div className="relative shrink-0">
              <div className="w-48 h-48 bg-yellow-500 rounded-full flex items-center justify-center border-8 border-slate-900 shadow-xl overflow-hidden pt-6 relative z-10">
                <Mascot emotion="excited" className="w-40 h-40" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-indigo-600 px-4 py-2 rounded-full text-xs font-bold uppercase ring-4 ring-slate-800 text-white shadow-lg whitespace-nowrap z-20">Сеньор Разработчик</div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-emerald-500/30 shadow-inner">
                <h3 className="text-xl font-bold text-emerald-400 mb-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Database className="w-4 h-4 text-emerald-400" />
                  </div>
                  База данных создана
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed ml-11">Таблицы для пользователей и туров успешно функционируют с правильными типами данных.</p>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-blue-500/30 shadow-inner">
                <h3 className="text-xl font-bold text-blue-400 mb-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  Регистрация защищена
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed ml-11">Все пароли надежно захешированы с помощью password_hash(), а пользователи авторизуются через сессии.</p>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-indigo-500/30 shadow-inner">
                <h3 className="text-xl font-bold text-indigo-400 mb-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Code className="w-4 h-4 text-indigo-400" />
                  </div>
                  CRUD реализован
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed ml-11">Администратор панель с возможностью добавления, чтения, редактирования и удаления готова!</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-950 p-4 text-center border-t border-slate-800 relative z-10">
            <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">KIBERone • Модуль 8 Пройден</p>
          </div>
        </div>
      </div>
    );
  }

  // Game UI
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Top HUD */}
      <header className="h-16 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between px-4 lg:px-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-slate-900">
            <Terminal className="w-6 h-6" />
          </div>
          <h1 className="hidden sm:block text-lg sm:text-xl font-bold tracking-tight uppercase">WEB-СТРОЙКА <span className="text-yellow-400 font-black italic">КВЕСТ</span></h1>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Режимы Модификаторов */}
          <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700/60 px-2.5 py-1 rounded-xl shadow-inner">
            {/* Режим Хаос (с 10 уровня) */}
            <button
              onClick={() => {
                if (currentStepIndex + 1 >= 10) {
                  audioSystem.playCorrectSound();
                  setChaosMode(!chaosMode);
                }
              }}
              title={currentStepIndex + 1 < 10 ? 'Откроется после 10 уровня!' : 'Перемешать варианты ответов наугад!'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black uppercase transition-all duration-300 ${
                currentStepIndex + 1 < 10
                  ? 'opacity-40 cursor-not-allowed text-slate-500 bg-slate-800/50'
                  : chaosMode
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse hover:scale-105'
                  : 'text-amber-400 bg-slate-800/80 hover:bg-slate-700 hover:scale-105'
              }`}
            >
              <span>{currentStepIndex + 1 < 10 ? '🔒' : '🌀'}</span>
              <span className="hidden sm:inline text-[10px] uppercase font-black tracking-wider leading-none">Хаос</span>
            </button>

            {/* Режим Супер (с 20 уровня) */}
            <button
              onClick={() => {
                if (currentStepIndex + 1 >= 20) {
                  audioSystem.playCorrectSound();
                  setSuperChaos(!superChaos);
                }
              }}
              title={currentStepIndex + 1 < 20 ? 'Откроется после 20 уровня!' : 'Ультра Драйв: Удвоить начисляемые очки!'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black uppercase transition-all duration-300 ${
                currentStepIndex + 1 < 20
                  ? 'opacity-40 cursor-not-allowed text-slate-500 bg-slate-800/50'
                  : superChaos
                  ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.6)] animate-bounce'
                  : 'text-purple-400 bg-slate-800/80 hover:bg-slate-700 hover:scale-105'
              }`}
            >
              <span>{currentStepIndex + 1 < 20 ? '🔒' : '⚡'}</span>
              <span className="hidden sm:inline text-[10px] uppercase font-black tracking-wider leading-none">Супер</span>
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-widest hidden sm:block">Общий Прогресс</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-32 sm:w-48 h-3 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-xs sm:text-sm whitespace-nowrap ml-1">{String(currentStepIndex + 1).padStart(2, '0')} / {String(questData.length).padStart(2, '0')}</span>
            </div>
          </div>
          <div className="bg-slate-700/50 border border-slate-600 px-4 py-1.5 rounded-lg flex items-center gap-2 shadow-inner">
            <div className="text-yellow-400 text-lg sm:text-xl font-bold font-mono">
              ★ {score}
            </div>
            <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold hidden sm:block">
              Очков
            </div>
          </div>

          <button 
            onClick={() => {
              const muted = audioSystem.toggleMute();
              setSoundMuted(muted);
            }}
            title={soundMuted ? 'Включить звук' : 'Выключить звук'}
            className={`border px-3 py-2 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
              soundMuted 
                ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
            }`}
          >
            {soundMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
          </button>
        </div>
      </header>

      {/* Main Play Area */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-6 overflow-hidden">
        
        {/* Left Col: Character & Dialog */}
        <aside className="w-full lg:w-72 flex flex-col gap-4 shrink-0 overflow-y-auto lg:overflow-visible">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col items-center text-center relative z-10 shrink-0">
            <div className="relative mb-6 mt-4">
              <div 
                className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center border-4 border-slate-800 shadow-xl overflow-hidden pt-4 cursor-pointer transition-transform active:scale-95 hover:scale-105 select-none"
                onClick={handleMascotClick}
                title="Нажми на меня..."
              >
                <Mascot emotion={emotion} className="w-28 h-28 pointer-events-none" />
              </div>
              <div className="absolute -bottom-3 -left-4 -right-4 bg-indigo-600 px-2 py-1.5 rounded-full text-[10px] font-bold uppercase ring-2 ring-slate-800 text-white shadow-md pointer-events-none">Менеджер Боб</div>
            </div>
            
            <div className="bg-white text-slate-800 p-4 rounded-xl rounded-tl-none relative shadow-lg w-full mt-2 text-left">
              <p className="text-sm italic font-medium">"{step.dialog}"</p>
              <div className="absolute -left-2 top-0 w-4 h-4 bg-white transform rotate-45"></div>
            </div>
          </div>
          
          <div className="flex-1 bg-slate-800/40 border border-slate-700 rounded-2xl p-4 hidden lg:block overflow-hidden">
            <h3 className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest text-center">Достижения</h3>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => {
                const achId = unlockedAchievements[i];
                const acc = achId ? achievementsData.find(a => a.id === achId) : null;
                if (acc) {
                  const border = acc.theme === 'emerald' ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' :
                                 acc.theme === 'purple' ? 'border-purple-500/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]' :
                                 acc.theme === 'cyan' ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' :
                                 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.15)]';
                  return (
                    <div key={i} title={acc.title} className={`aspect-square bg-slate-700/80 border rounded-lg flex items-center justify-center text-3xl animate-in zoom-in-50 duration-500 ${border}`}>
                      {acc.icon}
                    </div>
                  );
                }
                return (
                  <div key={i} className="aspect-square bg-slate-800 rounded-lg flex items-center justify-center text-xl opacity-30 border-2 border-slate-700 border-dashed transition-all">
                    🔒
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Col: Interactive Task */}
        <section className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1 pb-4 lg:pb-0">
          <div className="bg-indigo-900/40 border border-indigo-500/30 rounded-3xl p-6 lg:p-8 relative flex-1 flex flex-col shrink-0 min-h-min">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <svg width="200" height="200" viewBox="0 0 24 24" fill="white"><path d="M20 7h-9l-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/></svg>
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-3 py-1 bg-indigo-600 rounded text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">Задача #{String(step.id).padStart(2, '0')}</span>
                <h2 className="text-2xl lg:text-3xl font-black mt-3 leading-tight uppercase italic text-white mix-blend-plus-lighter">
                  Проверка Знаний
                </h2>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Сложность</span>
                <div className="flex gap-1 mt-1.5 justify-end">
                  <div className="w-2 h-4 bg-yellow-400 rounded-sm"></div>
                  <div className="w-2 h-4 bg-yellow-400 rounded-sm"></div>
                  <div className="w-2 h-4 bg-slate-600 rounded-sm opacity-50"></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-5 lg:p-6 rounded-2xl border border-slate-700 mb-6 lg:mb-8 z-10 relative shadow-inner">
              <div className="flex justify-between items-start gap-4">
                <p className="text-[17px] lg:text-xl text-slate-300 leading-relaxed font-medium">
                  {step.question}
                </p>
                {isCorrect === null && !showHint && (
                  <button 
                    onClick={() => setShowHint(true)}
                    className={`shrink-0 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/50 text-indigo-300 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${chaosMode ? 'hover-wiggle' : 'hover:scale-110 hover:-rotate-3'}`}
                  >
                    💡 Подсказка
                  </button>
                )}
              </div>
              {showHint && (
                <div className="mt-4 p-3 bg-indigo-900/40 border border-indigo-500/30 rounded-xl text-indigo-200 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                  <span className="font-bold text-indigo-300 uppercase tracking-widest text-[10px] block mb-1">Сообщение от Боба:</span>
                  {generateHint(step)}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 z-10 relative">
              {step.type !== 'mini_game' && shuffledOptions.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrectOption = opt === step.correctAnswer;
                
                let btnStyle = "border-slate-600 bg-slate-800 hover:border-yellow-400 text-slate-300";
                let letterBg = "bg-slate-700 text-slate-400";
                
                if (isCorrect !== null) {
                  if (isSelected && isCorrect) {
                     btnStyle = "border-green-500/80 bg-green-500/10 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.15)]";
                     letterBg = "bg-green-600 text-white";
                  } else if (isSelected && isCorrect === false) {
                     btnStyle = "border-red-500/50 bg-red-900/20 text-red-300 opacity-70";
                     letterBg = "bg-red-600 text-white opacity-80";
                  } else {
                     btnStyle = "border-slate-700 bg-slate-800/50 text-slate-500 opacity-40";
                  }
                } else if (isSelected) {
                   btnStyle = "border-indigo-500 bg-slate-800 text-slate-200 shadow-[0_0_15px_rgba(99,102,241,0.15)]";
                   letterBg = "bg-indigo-600 text-white shadow-inner";
                }

                const letter = String.fromCharCode(65 + idx); // A, B, C, D

                return (
                  <button
                    key={idx}
                    disabled={isCorrect !== null}
                    onClick={() => verifyAnswer(opt)}
                    className={`p-4 border-2 rounded-xl text-left flex items-center gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${btnStyle} ${chaosMode ? 'hover-wiggle' : ''}`}
                  >
                    <div className={`w-8 h-8 shrink-0 rounded flex items-center justify-center font-mono font-bold text-sm transition-colors ${letterBg}`}>
                      {letter}
                    </div>
                    <span className={`${step.type === 'code_snippet' ? 'font-mono text-[13px] text-blue-300 font-medium' : 'text-[15px]'}`}>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
            {step.type === 'mini_game' && step.miniGameType === 'bug_catcher' && isCorrect === null && (
               <BugCatcherGame onWin={() => { 
                  audioSystem.playCorrectSound();
                  if (isCorrect !== true) setScore(s => s + 150 * (superChaos ? 2 : 1));
                  setIsCorrect(true); 
                  checkAchievement(step.id); 
               }} />
            )}
            {step.type === 'mini_game' && step.miniGameType === 'query_builder' && isCorrect === null && (
               <QueryBuilderGame data={step.gameData} onWin={() => {
                  audioSystem.playCorrectSound();
                  confetti({particleCount: 200, spread: 90});
                  if (isCorrect !== true) setScore(s => s + 200 * (superChaos ? 2 : 1));
                  setIsCorrect(true);
                  checkAchievement(step.id);
               }} />
            )}
            
            {/* Explanation Area */}
            {isCorrect !== null && (
               <div className={`mt-6 lg:mt-8 p-5 lg:p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-900/30 border-emerald-500/40' : 'bg-red-900/30 border-red-500/40'} flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 z-10 relative`}>
                 <div className="flex items-start gap-4">
                   {isCorrect ? (
                     <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shrink-0">
                       <span className="text-xl font-black text-emerald-400 leading-none pb-0.5">✓</span>
                     </div>
                   ) : (
                     <div className="w-10 h-10 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-400 font-black text-xl shrink-0 leading-none pb-0.5">!</div>
                   )}
                   <div>
                     <h3 className={`font-bold text-lg mb-1 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                       {isCorrect ? 'Отличная работа!' : 'Упс! Ошибка в чертежах.'}
                     </h3>
                     <p className="text-slate-300 text-[15px] leading-relaxed">{step.explanation}</p>
                   </div>
                 </div>
               </div>
            )}
            
          </div>
          
          {/* Controls & Progress Bar */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 lg:p-8 flex flex-col gap-10 shrink-0 shadow-lg mt-auto pb-8 lg:pb-10">
            {/* Extended Progress Bar Section */}
            <div className="w-full relative mt-2 mb-4">
              <div className="flex justify-between items-end mb-5">
                <span className="text-[11px] lg:text-[13px] uppercase tracking-widest text-emerald-400 font-black flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse relative">
                    <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                  </span>
                  Статус Архитектуры
                </span>
                <span className="text-xs font-mono font-black text-slate-300 bg-slate-700/80 px-3 py-1 rounded-md shadow-inner border border-slate-600">
                  Блок {currentStepIndex + 1} / {questData.length}
                </span>
              </div>
              
              <div className="relative">
                {/* Track */}
                <div className="h-3 md:h-4 bg-slate-900 rounded-full border border-slate-700 shadow-inner relative overflow-hidden">
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-400 transition-all duration-1000 ease-in-out"
                    style={{ width: `${((currentStepIndex + 1) / questData.length) * 100}%` }}
                  >
                     <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white/40 to-transparent"></div>
                  </div>
                </div>

                {/* Milestones nodes */}
                {[
                  { step: 10, label: 'Настройка CRUD', icon: '⚙️' },
                  { step: 20, label: 'Безопасность', icon: '🛡️' },
                  { step: 30, label: 'Связи & JOIN', icon: '🔗' },
                  { step: 40, label: 'Запуск в Сеть', icon: '🚀' },
                ].map((m, i) => {
                  const pos = (m.step / questData.length) * 100;
                  const isReached = (currentStepIndex + 1) >= m.step;
                  return (
                    <div key={i} className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${pos}%` }}>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl shadow-xl transition-all duration-700 z-10 ${isReached ? 'bg-emerald-500 border-[3px] border-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.7)] scale-110' : 'bg-slate-800 border-[3px] border-slate-600 opacity-60 grayscale'}`}>
                        {m.icon}
                      </div>
                      <span className={`absolute max-w-[80px] md:max-w-none text-center top-full mt-3 px-1 text-[9px] md:text-[11px] uppercase font-black tracking-widest transition-colors duration-700 whitespace-nowrap ${isReached ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {m.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 justify-end items-center border-t border-slate-700/50 pt-5 mt-2">
              {isCorrect === true && (
                <button 
                  onClick={handleNext}
                  className="w-full sm:w-auto px-10 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black rounded-xl uppercase tracking-widest text-sm shadow-[0_4px_0_0_#b45309] hover:translate-y-1 hover:shadow-[0_0px_0_0_#b45309] transition-all"
                >
                  {currentStepIndex < questData.length - 1 ? 'След. Этап' : 'Завершить'} &rarr;
                </button>
              )}
              {isCorrect === false && (
                <button 
                  onClick={() => { setIsCorrect(null); setSelectedOption(null); setShowHint(false); }}
                  className="w-full sm:w-auto px-10 py-3.5 bg-red-500 hover:bg-red-400 text-white font-black rounded-xl uppercase tracking-widest text-sm shadow-[0_4px_0_0_#991b1b] hover:translate-y-1 hover:shadow-[0_0px_0_0_#991b1b] transition-all"
                >
                  Попробовать снова ↺
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-10 lg:h-12 border-t border-slate-700 bg-slate-800 flex items-center justify-center px-4 lg:px-8 text-[9px] lg:text-[10px] text-slate-500 font-bold uppercase shrink-0 text-center">
        Эта игра была разработана для школы KIBERone. © 2026
      </footer>

      {/* Achievement Modal */}
      {activeAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
          <div className={`bg-slate-800 border-2 rounded-3xl p-8 max-w-lg w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-300 relative overflow-hidden ${
            activeAchievement.theme === 'emerald' ? 'border-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.25)]' :
            activeAchievement.theme === 'purple' ? 'border-purple-500 shadow-[0_0_60px_rgba(139,92,246,0.25)]' :
            activeAchievement.theme === 'cyan' ? 'border-cyan-500 shadow-[0_0_60px_rgba(6,182,212,0.25)]' :
            'border-yellow-500 shadow-[0_0_60px_rgba(234,179,8,0.25)]'
          }`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <svg width="200" height="200" viewBox="0 0 24 24" fill="white"><path d="M20 7h-9l-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/></svg>
            </div>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 shadow-xl border-4 border-slate-900 relative z-10 animate-bounce ${
              activeAchievement.theme === 'emerald' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' :
              activeAchievement.theme === 'purple' ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
              activeAchievement.theme === 'cyan' ? 'bg-gradient-to-br from-cyan-400 to-cyan-600' :
              'bg-gradient-to-br from-yellow-400 to-yellow-600'
            }`}>
              {activeAchievement.icon}
            </div>
            <h2 className={`text-[10px] font-black uppercase tracking-widest mb-2 relative z-10 px-3 py-1 rounded-full border shadow-sm ${
              activeAchievement.theme === 'emerald' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' :
              activeAchievement.theme === 'purple' ? 'text-purple-500 bg-purple-500/10 border-purple-500/30' :
              activeAchievement.theme === 'cyan' ? 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30' :
              'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
            }`}>
              Новое Достижение!
            </h2>
            <h3 className="text-2xl lg:text-3xl font-black text-white mb-6 uppercase italic relative z-10">{activeAchievement.title}</h3>
            
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-700/80 mb-8 relative z-10 shadow-inner w-full text-left">
              <p className={`text-slate-300 text-[15px] leading-relaxed italic border-l-4 pl-4 ${
                activeAchievement.theme === 'emerald' ? 'border-emerald-500' :
                activeAchievement.theme === 'purple' ? 'border-purple-500' :
                activeAchievement.theme === 'cyan' ? 'border-cyan-500' :
                'border-yellow-500'
              }`}>
                {activeAchievement.story}
              </p>
            </div>

            <button
              onClick={() => setActiveAchievement(null)}
              className={`px-10 py-3.5 font-black rounded-xl uppercase tracking-widest text-sm hover:-translate-y-1 transition-all relative z-10 w-full ${
                activeAchievement.theme === 'emerald' ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-900 shadow-[0_4px_0_0_#059669] hover:shadow-[0_0px_0_0_#059669]' :
                activeAchievement.theme === 'purple' ? 'bg-purple-400 hover:bg-purple-300 text-slate-900 shadow-[0_4px_0_0_#7C3AED] hover:shadow-[0_0px_0_0_#7C3AED]' :
                activeAchievement.theme === 'cyan' ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-900 shadow-[0_4px_0_0_#0891B2] hover:shadow-[0_0px_0_0_#0891B2]' :
                'bg-yellow-400 hover:bg-yellow-300 text-slate-900 shadow-[0_4px_0_0_#b45309] hover:shadow-[0_0px_0_0_#b45309]'
              }`}
            >
              Круто, идем дальше!
            </button>
          </div>
        </div>
      )}

      {/* Secret Menu Modal */}
      {showSecretMenu && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
          <div className="bg-slate-800 border-2 border-indigo-500 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_60px_rgba(99,102,241,0.25)] flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center text-3xl mb-4 border border-indigo-500 shadow-inner">
              🕵️
            </div>
            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide text-center">Секретное Меню</h3>
            <p className="text-slate-400 text-sm mb-6 text-center leading-relaxed">
              Учительская панель. Введите номер уровня (1-{questData.length}) или секретный чит-код.
            </p>
            <form onSubmit={handleSecretSubmit} className="w-full flex flex-col gap-4">
              <input 
                type="text" 
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 font-mono text-center focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Ввод..."
                autoFocus
              />
              <div className="flex gap-3 mt-2">
                <button 
                  type="button"
                  onClick={() => { setShowSecretMenu(false); setMascotClicks(0); setSecretInput(''); }}
                  className="flex-1 py-3 text-slate-400 font-bold uppercase text-xs hover:text-white transition-colors"
                >
                  Отмена
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl uppercase tracking-widest text-xs shadow-md transition-colors"
                >
                  Применить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
