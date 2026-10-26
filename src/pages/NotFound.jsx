import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Gamepad2, 
  Zap, 
  Radio, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Cpu, 
  AlertTriangle, 
  ShieldAlert, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  Activity
} from 'lucide-react';

export default function NotFound() {
  const [activeTab, setActiveTab] = useState('game'); // 'game' | 'terminal'
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  
  // Game State (Retro Cyber Runner / Rogue Pixel collector)
  const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'gameover' | 'won'
  const [score, setScore] = useState(0);
  const [playerPos, setPlayerPos] = useState({ x: 2, y: 2 });
  const [dataNodes, setDataNodes] = useState([]);
  const [glitchEnemies, setGlitchEnemies] = useState([]);
  const [movesLeft, setMovesLeft] = useState(25);

  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', text: 'CYBER-OS v9.4.0 INITIALIZING...' },
    { type: 'error', text: 'ERROR 404: ROUTE_NOT_FOUND at memory address 0x00FF404' },
    { type: 'system', text: 'Type "help" or "reboot" to attempt recovery.' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const terminalEndRef = useRef(null);

  // Sound synthesis utility using Web Audio API
  const playRetroSound = (type) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'move') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'collect') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch (e) {
      // Audio context fallback
    }
  };

  // Periodic random glitch pulse on title
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 250);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Game Grid
  const initGame = () => {
    playRetroSound('click');
    setPlayerPos({ x: 0, y: 0 });
    setMovesLeft(20);
    setScore(0);
    
    // Spawn 4 data nodes
    const nodes = [
      { x: 1, y: 3 },
      { x: 4, y: 1 },
      { x: 3, y: 4 },
      { x: 4, y: 3 }
    ];
    // Spawn 3 glitch obstacles
    const enemies = [
      { x: 2, y: 1 },
      { x: 1, y: 4 },
      { x: 3, y: 2 }
    ];

    setDataNodes(nodes);
    setGlitchEnemies(enemies);
    setGameState('playing');
  };

  // Grid Movement logic (5x5 grid)
  const handleMove = (dx, dy) => {
    if (gameState !== 'playing') return;

    const newX = Math.max(0, Math.min(4, playerPos.x + dx));
    const newY = Math.max(0, Math.min(4, playerPos.y + dy));

    if (newX === playerPos.x && newY === playerPos.y) return;

    setPlayerPos({ x: newX, y: newY });
    const remainingMoves = movesLeft - 1;
    setMovesLeft(remainingMoves);

    // Check hit enemy
    const hitEnemy = glitchEnemies.some(e => e.x === newX && e.y === newY);
    if (hitEnemy) {
      playRetroSound('hit');
      setGameState('gameover');
      return;
    }

    // Check collect node
    const nodeIndex = dataNodes.findIndex(n => n.x === newX && n.y === newY);
    if (nodeIndex !== -1) {
      playRetroSound('collect');
      const newNodes = [...dataNodes];
      newNodes.splice(nodeIndex, 1);
      setDataNodes(newNodes);
      setScore(prev => prev + 100);

      if (newNodes.length === 0) {
        setGameState('won');
        return;
      }
    } else {
      playRetroSound('move');
    }

    if (remainingMoves <= 0) {
      setGameState('gameover');
    }
  };

  // Handle Terminal Commands
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    playRetroSound('click');
    const cmd = inputVal.trim().toLowerCase();
    const newHistory = [...terminalHistory, { type: 'user', text: `$ ${inputVal}` }];

    if (cmd === 'help') {
      newHistory.push({ type: 'system', text: 'AVAILABLE COMMANDS: [help, status, scan, reboot, ping, clear, home]' });
    } else if (cmd === 'status') {
      newHistory.push({ type: 'system', text: 'CORE: ONLINE | MATRIX: DEGRADED | NODE 404: MISSING' });
    } else if (cmd === 'scan') {
      newHistory.push({ type: 'system', text: 'SCANNING... [████████████] 100%' });
      newHistory.push({ type: 'error', text: 'WARNING: 1 Lost Route found in Cyber Void.' });
    } else if (cmd === 'reboot' || cmd === 'home') {
      newHistory.push({ type: 'system', text: 'REBOOTING NET MATRIX... REDIRECTING TO ROOT HOMEPAGE.' });
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } else if (cmd === 'ping') {
      newHistory.push({ type: 'system', text: 'PING 127.0.0.1: latency=0.4ms packets_lost=04.04%' });
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      setInputVal('');
      return;
    } else {
      newHistory.push({ type: 'error', text: `Command not recognized: "${cmd}". Type "help" for options.` });
    }

    setTerminalHistory(newHistory);
    setInputVal('');
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  return (
    <div className="relative min-h-screen w-full bg-[#090a0f] text-cyan-400 font-mono flex flex-col justify-between overflow-x-hidden p-4 sm:p-6 select-none">
      
      {/* Background CRT Scanlines & Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px]" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Cyber Glow Ambient Background */}
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between py-3 border-b border-cyan-900/60 mb-6 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-950/80 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <span className="font-black text-lg sm:text-xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-400">
            SYSTEM_NULL // 404
          </span>
        </div>

        {/* Audio Toggle & Signal Meter */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playRetroSound('click');
            }}
            className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-bold border transition-all ${
              soundEnabled 
                ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]' 
                : 'border-slate-800 bg-slate-900/80 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'AUDIO: ON' : 'AUDIO: MUTED'}</span>
          </button>
          
          <div className="hidden md:flex items-center space-x-2 text-xs text-fuchsia-400 bg-fuchsia-950/30 px-3 py-1.5 border border-fuchsia-900/50">
            <ShieldAlert className="w-3.5 h-3.5 text-fuchsia-400 animate-bounce" />
            <span>SIGNAL: LOST</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Cyber Glitch Title & Status Meters */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          
          {/* Glitch 404 Heading */}
          <div className="relative">
            <div className={`relative inline-block ${glitchActive ? 'translate-x-1 duration-75' : ''}`}>
              <h1 className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 via-fuchsia-400 to-cyan-600 drop-shadow-[0_0_25px_rgba(217,70,239,0.5)]">
                404
              </h1>
              {/* Pseudo Glitch Overlays */}
              {glitchActive && (
                <>
                  <span className="absolute top-0 left-1 text-8xl sm:text-9xl font-black text-cyan-400 opacity-70 clip-path-glitch-1 pointer-events-none">
                    404
                  </span>
                  <span className="absolute top-0 -left-1 text-8xl sm:text-9xl font-black text-fuchsia-500 opacity-70 clip-path-glitch-2 pointer-events-none">
                    404
                  </span>
                </>
              )}
            </div>

            <div className="mt-2 space-y-2">
              <div className="inline-block px-2.5 py-1 bg-fuchsia-950/80 border border-fuchsia-500/60 text-fuchsia-300 text-xs font-bold uppercase tracking-wider">
                FATAL_ERROR // ROUTE_UNREACHABLE
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 uppercase tracking-wide">
                CYBERSPACE VOID DETECTED
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                The neural path you are seeking has been wiped or corrupted by data decay. Re-route via system emergency protocol or resolve the node grid.
              </p>
            </div>
          </div>

          {/* Real-time System Metrics Panel */}
          <div className="p-4 bg-[#0d0e17]/90 border border-cyan-900/80 shadow-[0_0_20px_rgba(0,0,0,0.8)] space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
              <span className="flex items-center space-x-1.5 font-bold text-cyan-400">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>DIAGNOSTIC_METRICS</span>
              </span>
              <span className="text-amber-400 animate-pulse font-mono">STATUS: CRITICAL</span>
            </div>

            {/* Health Bars */}
            <div className="space-y-2 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>NET MATRIX INTEGRITY</span>
                  <span className="text-fuchsia-400">14.02%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 border border-slate-800">
                  <div className="bg-gradient-to-r from-fuchsia-600 to-pink-500 h-full w-[14%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>PACKET LOSS RATE</span>
                  <span className="text-amber-400">85.9%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 border border-slate-800">
                  <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-full w-[85%]" />
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  playRetroSound('click');
                  window.location.href = '/';
                }}
                className="flex items-center justify-center space-x-2 px-3 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] active:translate-y-0.5"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>WARP HOME</span>
              </button>

              <button
                onClick={() => {
                  playRetroSound('click');
                  setActiveTab(activeTab === 'game' ? 'terminal' : 'game');
                }}
                className="flex items-center justify-center space-x-2 px-3 py-2.5 bg-slate-900 hover:bg-slate-800 border border-cyan-800 text-cyan-300 font-bold text-xs uppercase tracking-wider transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>SWITCH MODE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Arcade Console Terminal Box */}
        <div className="lg:col-span-7 bg-[#0d0f19] border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col h-[480px] relative overflow-hidden">
          
          {/* Arcade Console Top Titlebar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-cyan-950/80 border-b border-cyan-800/80 text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => { setActiveTab('game'); playRetroSound('click'); }}
                className={`flex items-center space-x-1.5 px-3 py-1 font-bold transition-all ${
                  activeTab === 'game' 
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>RECOVERY_GAME</span>
              </button>

              <button
                onClick={() => { setActiveTab('terminal'); playRetroSound('click'); }}
                className={`flex items-center space-x-1.5 px-3 py-1 font-bold transition-all ${
                  activeTab === 'terminal' 
                    ? 'bg-fuchsia-600 text-white shadow-[0_0_10px_rgba(217,70,239,0.5)]' 
                    : 'text-slate-400 hover:text-fuchsia-300'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>CLI_TERMINAL</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center space-x-1.5 text-slate-500 text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SYSTEM READY</span>
            </div>
          </div>

          {/* TAB 1: Arcade Mini-Game (Pixel Node Maze) */}
          {activeTab === 'game' && (
            <div className="flex-1 flex flex-col items-center justify-between p-4 bg-[#0a0b12] relative">
              
              {/* Game Overlay Screens */}
              {gameState === 'start' && (
                <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <Gamepad2 className="w-12 h-12 text-cyan-400 animate-bounce" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-100 tracking-wider">
                      CYBER NODE RECOVERY
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Collect all 4 yellow data nodes using direction keys without hitting corrupted glitch nodes!
                    </p>
                  </div>
                  <button
                    onClick={initGame}
                    className="px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(217,70,239,0.5)] active:scale-95"
                  >
                    INITIALIZE GAME
                  </button>
                </div>
              )}

              {gameState === 'gameover' && (
                <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <AlertTriangle className="w-12 h-12 text-fuchsia-500 animate-pulse" />
                  <div>
                    <h3 className="text-xl font-black text-fuchsia-400 tracking-wider">
                      SYSTEM CORRUPTED!
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      You encountered a fatal glitch or ran out of network cycles.
                    </p>
                  </div>
                  <button
                    onClick={initGame}
                    className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    TRY AGAIN
                  </button>
                </div>
              )}

              {gameState === 'won' && (
                <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <Sparkles className="w-12 h-12 text-amber-400 animate-spin" />
                  <div>
                    <h3 className="text-xl font-black text-amber-300 tracking-wider">
                      NODES RESTORED!
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Signal re-established! Emergency warp coordinates unlocked.
                    </p>
                  </div>
                  <button
                    onClick={() => { window.location.href = '/'; }}
                    className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                  >
                    RETURN TO HOME
                  </button>
                </div>
              )}

              {/* Game Stats Bar */}
              <div className="w-full flex justify-between items-center text-xs font-mono border-b border-cyan-900/50 pb-2">
                <span className="text-slate-400">SCORE: <strong className="text-cyan-300">{score}</strong></span>
                <span className="text-slate-400">CYCLES LEFT: <strong className={movesLeft < 5 ? 'text-fuchsia-400 animate-pulse' : 'text-amber-400'}>{movesLeft}</strong></span>
              </div>

              {/* 5x5 Game Grid Container */}
              <div className="grid grid-cols-5 gap-2 my-auto p-3 bg-slate-950 border border-cyan-900/80 shadow-inner">
                {Array.from({ length: 25 }).map((_, idx) => {
                  const x = idx % 5;
                  const y = Math.floor(idx / 5);

                  const isPlayer = playerPos.x === x && playerPos.y === y;
                  const isNode = dataNodes.some(n => n.x === x && n.y === y);
                  const isEnemy = glitchEnemies.some(e => e.x === x && e.y === y);

                  return (
                    <div
                      key={idx}
                      className="w-10 h-10 sm:w-12 sm:h-12 border border-slate-800/80 rounded flex items-center justify-center relative bg-slate-900/40"
                    >
                      {isPlayer && (
                        <div className="w-6 h-6 rounded bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)] animate-pulse flex items-center justify-center">
                          <span className="w-2 h-2 bg-slate-950 rounded-full" />
                        </div>
                      )}
                      {isNode && !isPlayer && (
                        <div className="w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-bounce" />
                      )}
                      {isEnemy && !isPlayer && (
                        <div className="w-5 h-5 bg-fuchsia-600 rotate-45 shadow-[0_0_10px_rgba(217,70,239,0.8)] flex items-center justify-center">
                          <span className="text-[10px] text-white font-black">!</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* On-screen D-Pad Controls */}
              <div className="flex flex-col items-center space-y-1">
                <button
                  onClick={() => handleMove(0, -1)}
                  disabled={gameState !== 'playing'}
                  className="w-10 h-8 bg-slate-800 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-black text-xs active:scale-95 disabled:opacity-40"
                >
                  ▲
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMove(-1, 0)}
                    disabled={gameState !== 'playing'}
                    className="w-10 h-8 bg-slate-800 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-black text-xs active:scale-95 disabled:opacity-40"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => handleMove(0, 1)}
                    disabled={gameState !== 'playing'}
                    className="w-10 h-8 bg-slate-800 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-black text-xs active:scale-95 disabled:opacity-40"
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => handleMove(1, 0)}
                    disabled={gameState !== 'playing'}
                    className="w-10 h-8 bg-slate-800 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-black text-xs active:scale-95 disabled:opacity-40"
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Interactive Terminal Shell */}
          {activeTab === 'terminal' && (
            <div className="flex-1 flex flex-col justify-between p-4 bg-[#07080e] font-mono text-xs overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {terminalHistory.map((item, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {item.type === 'user' && (
                      <span className="text-cyan-400 font-bold">{item.text}</span>
                    )}
                    {item.type === 'system' && (
                      <span className="text-slate-300">{item.text}</span>
                    )}
                    {item.type === 'error' && (
                      <span className="text-fuchsia-400 font-semibold">{item.text}</span>
                    )}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Command Input Form */}
              <form onSubmit={handleTerminalSubmit} className="mt-3 flex items-center border-t border-cyan-900/80 pt-2">
                <ChevronRight className="w-4 h-4 text-cyan-400 mr-1 flex-shrink-0" />
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="type command (e.g. 'help', 'reboot')..."
                  className="w-full bg-transparent text-cyan-200 placeholder-slate-600 focus:outline-none text-xs"
                />
              </form>
            </div>
          )}

        </div>
      </main>

      {/* Cyberpunk Footer Nav */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto mt-8 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-3.5 h-3.5 text-cyan-500" />
          <span>CYBER OS v9.4 // ARCHITECTURE: RETRO-ARCADE</span>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/" className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
            <span>Root Index</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button onClick={() => { setActiveTab('terminal'); playRetroSound('click'); }} className="hover:text-cyan-400 transition-colors">
            System Diagnostics
          </button>
        </div>
      </footer>
    </div>
  );
}