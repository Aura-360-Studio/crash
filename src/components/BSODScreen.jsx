import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const playBeep = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    console.error("Audio play failed:", e);
  }
};

export default function BSODScreen({ config, onExit, previewMode = false }) {
  // Defensive check for config
  const safeConfig = config || {
    stopCode: 'CRITICAL_PROCESS_DIED',
    failedModule: 'win32kfull.sys',
    progress: 0,
    extraMessage: '',
    version: 'Windows 11'
  };

  const [progress, setProgress] = useState(safeConfig.progress);
  const [showExitHint, setShowExitHint] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [fakeMousePos, setFakeMousePos] = useState({ x: 0, y: 0 });

  // Generate stable random data for the session
  const sessionData = useMemo(() => ({
    qrPixels: Array.from({ length: 64 }, () => Math.random() > 0.5),
    stopAddr: `0x${Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0')}`,
    dateStamp: Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0'),
    stopSubCodes: Array.from({ length: 4 }, () => `0x${Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0')}`).join(', ')
  }), []);

  const [isRestarting, setIsRestarting] = useState(false);

  useEffect(() => {
    if (previewMode) return;
    
    // Play error beep
    playBeep();

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsRestarting(true), 1500);
          return 100;
        }
        // Randomly increment by 1-3%
        const inc = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
        return Math.min(prev + inc, 100);
      });
    }, 2000);

    const mouseTimer = setTimeout(() => setShowExitHint(true), 10000);

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(timer);
      clearTimeout(mouseTimer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [previewMode]);

  // Handle fake restart
  useEffect(() => {
    if (isRestarting) {
      const restartTimer = setTimeout(() => {
        setIsRestarting(false);
        setProgress(0); // Reset for replayability or just stay at black
      }, 5000);
      return () => clearTimeout(restartTimer);
    }
  }, [isRestarting]);

  // Mouse Lag Simulation
  useEffect(() => {
    if (previewMode) return;
    
    const timeout = setTimeout(() => {
      setFakeMousePos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.1,
        y: prev.y + (mousePos.y - prev.y) * 0.1
      }));
    }, 20);
    return () => clearTimeout(timeout);
  }, [mousePos, fakeMousePos, previewMode]);

  // Sync progress if config changes (e.g. slider)
  useEffect(() => {
    setProgress(safeConfig.progress);
  }, [safeConfig.progress]);

  if (isRestarting && !previewMode) {
    return (
      <div className="fixed inset-0 bg-black z-[10000] flex flex-col items-center justify-center font-mono text-zinc-600 p-12">
        <div className="w-full max-w-[800px] space-y-4 text-xs md:text-sm">
          <p>AMI BIOS (C) 2026 American Megatrends, Inc.</p>
          <p>CPU: Aura Neural Processor @ 4.20GHz</p>
          <p>Memory Test: 65536MB OK</p>
          <p className="pt-4 text-white">Warning: System configuration has changed.</p>
          <p className="text-white">Press F1 to Run SETUP</p>
          <p className="text-white">Press F2 to load default values and continue</p>
          <div className="pt-12">
            <p>Scanning for devices...</p>
            <p className="text-zinc-800">No bootable device found.</p>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 text-xs">Press ESC to exit simulation</div>
      </div>
    );
  }

  if (safeConfig.version === 'Windows XP') {
    return (
      <div 
        className={`
          fixed inset-0 bg-[#0000aa] text-white select-none overflow-hidden font-mono
          ${previewMode ? 'relative h-full w-full' : 'z-[9999] cursor-none'}
          flex flex-col p-8 md:p-16 space-y-6 text-base md:text-xl
        `}
      >
        <div className="bg-white text-[#0000aa] px-2 self-start font-bold">WINDOWS</div>
        <div className="space-y-6 max-w-[1200px] leading-tight">
          <p>A problem has been detected and Windows has been shut down to prevent damage to your computer.</p>
          <p className="uppercase">{safeConfig.stopCode}</p>
          <p>If this is the first time you've seen this error screen, restart your computer. If this screen appears again, follow these steps:</p>
          <p>Check to be sure any new hardware or software is properly installed. If this is a new installation, ask your hardware or software manufacturer for any Windows updates you might need.</p>
          <p>If problems continue, disable or remove any newly installed hardware or software. Disable BIOS memory options such as caching or shadowing.</p>
          <div className="space-y-2">
            <p>Technical Information:</p>
            <p className="font-bold">*** STOP: {sessionData.stopAddr} ({sessionData.stopSubCodes})</p>
            <p>*** {safeConfig.failedModule} - Address {sessionData.stopAddr} base at {sessionData.stopAddr}, DateStamp {sessionData.dateStamp}</p>
          </div>
        </div>

        {/* Fake Cursor for Lag */}
        {!previewMode && (
          <div 
            className="fixed pointer-events-none z-[10000] mix-blend-difference"
            style={{ left: fakeMousePos.x, top: fakeMousePos.y }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1">
              <path d="M5.5 3.5v15.3l3.9-3.9 2.3 5.4 3-1.3-2.3-5.4h5.6L5.5 3.5z" />
            </svg>
          </div>
        )}

        {!previewMode && showExitHint && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 text-sm">Press ESC to exit</div>
        )}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] scanlines" />
      </div>
    );
  }

  // Windows 7 BSOD
  if (safeConfig.version === 'Windows 7') {
    return (
      <div 
        className={`
          fixed inset-0 bg-[#000082] text-white select-none overflow-hidden font-mono
          ${previewMode ? 'relative h-full w-full' : 'z-[9999] cursor-none'}
          flex flex-col items-center justify-center p-8 text-center
        `}
      >
        <div className="max-w-[800px] space-y-8">
          <h1 className="text-3xl font-bold uppercase tracking-widest border-b-2 border-white pb-4">System Error</h1>
          <div className="space-y-4 text-lg">
            <p>A critical error has occurred and the system has been halted.</p>
            <p className="text-2xl font-bold text-yellow-400">Error: {safeConfig.stopCode}</p>
            <p className="opacity-80">Module: {safeConfig.failedModule}</p>
          </div>
          <div className="pt-12 text-sm opacity-50 space-y-1">
            <p>Dumping physical memory to disk: {progress}%</p>
            <p>Contact your system administrator for further assistance.</p>
          </div>
        </div>
        {/* Fake Cursor */}
        {!previewMode && (
          <div 
            className="fixed pointer-events-none z-[10000] mix-blend-difference"
            style={{ left: fakeMousePos.x, top: fakeMousePos.y }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1">
              <path d="M5.5 3.5v15.3l3.9-3.9 2.3 5.4 3-1.3-2.3-5.4h5.6L5.5 3.5z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none opacity-[0.08] scanlines" />
      </div>
    );
  }

  // Modern BSOD (10/11)
  return (
    <div 
      className={`
        fixed inset-0 bg-[#00469b] text-white select-none overflow-hidden
        ${previewMode ? 'relative h-full w-full' : 'z-[9999] cursor-none'}
        bsod-text flex flex-col items-center justify-center
      `}
    >
      <div className="max-w-[1200px] w-full px-8 md:px-24 flex flex-col space-y-12">
        {/* Large Sad Face */}
        <div className="text-[140px] md:text-[200px] leading-none font-light -ml-4">
          :(
        </div>

        {/* Primary Message */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-4xl font-normal leading-tight max-w-[900px]">
            Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.
          </h2>
          
          <div className="text-2xl md:text-3xl font-light">
            {progress}% complete
          </div>
        </div>

        {/* QR and Details Section */}
        <div className="flex flex-col md:flex-row items-start space-y-8 md:space-y-0 md:space-x-10">
          {/* QR Code Placeholder */}
          <div className="w-40 h-40 bg-white p-2 flex-shrink-0">
            <div className="w-full h-full border-4 border-black flex flex-col p-1 space-y-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex-1 flex space-x-1">
                  {[...Array(8)].map((_, j) => (
                    <div 
                      key={j} 
                      className={`flex-1 ${sessionData.qrPixels[i * 8 + j] ? 'bg-black' : 'bg-transparent'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <p className="text-lg md:text-xl font-light opacity-90 max-w-[600px]">
              For more information about this issue and possible fixes, visit <br className="hidden md:block" />
              <span className="underline decoration-1 underline-offset-4 cursor-default">https://www.windows.com/stopcode</span>
            </p>
            
            <div className="space-y-1 text-base md:text-lg font-light opacity-80">
              <p>{safeConfig.extraMessage || "If you call a support person, give them this info:"}</p>
              <p>Stop code: <span className="uppercase font-normal">{safeConfig.stopCode}</span></p>
              {safeConfig.failedModule && (
                <p>What failed: <span className="font-normal">{safeConfig.failedModule}</span></p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fake Cursor for Lag */}
      {!previewMode && (
        <div 
          className="fixed pointer-events-none z-[10000] mix-blend-difference"
          style={{ left: fakeMousePos.x, top: fakeMousePos.y }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1">
            <path d="M5.5 3.5v15.3l3.9-3.9 2.3 5.4 3-1.3-2.3-5.4h5.6L5.5 3.5z" />
          </svg>
        </div>
      )}

      {/* Exit Hint */}
      {!previewMode && (
        <AnimatePresence>
          {showExitHint && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 text-sm uppercase tracking-widest pointer-events-none"
            >
              Press ESC to exit
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Fullscreen Overlay Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] scanlines" />
    </div>
  );
}
