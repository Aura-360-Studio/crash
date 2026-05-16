import React, { useState, useEffect, useCallback } from 'react';
import { 
  Monitor, 
  Settings, 
  Play, 
  Eye, 
  Info, 
  AlertTriangle, 
  ChevronDown, 
  X, 
  Maximize2,
  Terminal,
  Cpu,
  ShieldCheck,
  Zap,
  MousePointer2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BSODScreen from './components/BSODScreen';

const STOP_CODES = [
  'CRITICAL_PROCESS_DIED',
  'SYSTEM_THREAD_EXCEPTION_NOT_HANDLED',
  'IRQL_NOT_LESS_OR_EQUAL',
  'VIDEO_TDR_TIMEOUT_DETECTED',
  'PAGE_FAULT_IN_NONPAGED_AREA',
  'SYSTEM_SERVICE_EXCEPTION',
  'DPC_WATCHDOG_VIOLATION',
  'WHEA_UNCORRECTABLE_ERROR',
  'KMODE_EXCEPTION_NOT_HANDLED',
  'KERNEL_SECURITY_CHECK_FAILURE',
  'CRITICAL_SERVICE_FAILED',
  'BAD_SYSTEM_CONFIG_INFO',
  'INTERN_DELETED_SYSTEM32',
  'CRYPTO_MINING_DETECTED',
  'CORPORATE_IT_NIGHTMARE',
  'TOO_MANY_EXCEL_SHEETS',
  'COFFEE_SPILLED_ON_KERNEL'
];

const VERSIONS = ['Windows 11', 'Windows 10', 'Windows 7', 'Windows XP'];

export default function App() {
  const [isBSODActive, setIsBSODActive] = useState(false);
  const [config, setConfig] = useState({
    stopCode: 'CRITICAL_PROCESS_DIED',
    failedModule: 'win32kfull.sys',
    progress: 20,
    extraMessage: 'If you call a support person, give them this info.',
    version: 'Windows 11'
  });
  const [highlightPreview, setHighlightPreview] = useState(false);
  const previewRef = React.useRef(null);

  const launchBSOD = useCallback(() => {
    // Request fullscreen
    const docElm = document.documentElement;
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen().catch(() => {
        // Fallback for failed fullscreen
      });
    }
    setIsBSODActive(true);
  }, []);

  const scrollToPreview = useCallback(() => {
    if (previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth' });
      setHighlightPreview(true);
      setTimeout(() => setHighlightPreview(false), 2000);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isBSODActive) {
        setIsBSODActive(false);
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBSODActive]);

  if (isBSODActive) {
    return <BSODScreen config={config} onExit={() => setIsBSODActive(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans p-6 md:p-12 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Hero & Actions */}
        <div className="lg:col-span-4 flex flex-col space-y-8">
          <header className="space-y-4">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="text-3xl font-bold text-white">:(</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
              Fake Windows <br />
              <span className="text-blue-500">BSOD Generator</span>
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
              The ultimate prank for your co-workers. Full-screen, pixel-perfect Blue Screen of Death.
            </p>
          </header>

          <div className="space-y-4">
            <ul className="space-y-3">
              {[
                { icon: Monitor, text: "Pixel-perfect design" },
                { icon: Settings, text: "Custom error messages" },
                { icon: Maximize2, text: "Fullscreen takeover" },
                { icon: Zap, text: "No installation" },
                { icon: ShieldCheck, text: "100% safe (it's fake 😉)" }
              ].map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-zinc-400">
                  <item.icon size={18} className="text-blue-500" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={launchBSOD}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20 active:scale-95"
              >
                <Play size={20} fill="currentColor" />
                <span>Launch BSOD</span>
              </button>
              <button 
                onClick={scrollToPreview}
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 px-6 rounded-xl transition-all border border-zinc-800 flex items-center justify-center space-x-2 active:scale-95"
              >
                <Eye size={20} />
                <span>See Preview</span>
              </button>
            </div>
            <p className="text-center text-xs text-zinc-500">Built with ❤️ by Aura Labs</p>
          </div>

          {/* Customization Form */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-blue-400 font-bold flex items-center space-x-2 uppercase tracking-wider text-sm">
              <Settings size={16} />
              <span>Customize Your BSOD</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">OS Version</label>
                <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                  {VERSIONS.map(v => (
                    <button
                      key={v}
                      onClick={() => setConfig({...config, version: v})}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${config.version === v ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      {v.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Stop Code</label>
                <div className="relative">
                  <select 
                    value={config.stopCode}
                    onChange={(e) => setConfig({...config, stopCode: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
                  >
                    {STOP_CODES.map(code => <option key={code} value={code}>{code}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">What Failed</label>
                <input 
                  type="text"
                  value={config.failedModule}
                  onChange={(e) => setConfig({...config, failedModule: e.target.value})}
                  placeholder="e.g. win32kfull.sys"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Initial Progress</label>
                  <span className="text-blue-500 font-mono text-sm">{config.progress}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={config.progress}
                  onChange={(e) => setConfig({...config, progress: parseInt(e.target.value)})}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Extra Message (optional)</label>
                <textarea 
                  value={config.extraMessage}
                  onChange={(e) => setConfig({...config, extraMessage: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all h-24 resize-none"
                  placeholder="Additional instructions..."
                />
              </div>

              <button 
                onClick={launchBSOD}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center space-x-2"
              >
                <Zap size={18} fill="currentColor" />
                <span>Launch BSOD</span>
              </button>
              <p className="text-center text-[10px] text-zinc-500 uppercase tracking-widest">Press F11 for full-screen</p>
            </div>
          </div>
        </div>

        {/* Right Column: Preview & Docs */}
        <div className="lg:col-span-8 flex flex-col space-y-8">
          
          {/* Live Preview Container */}
          <div 
            ref={previewRef}
            id="live-preview" 
            className={`flex flex-col space-y-4 transition-all duration-700 ${highlightPreview ? 'ring-4 ring-blue-500 rounded-3xl p-2' : ''}`}
          >
            <h3 className="text-zinc-500 font-bold flex items-center space-x-2 uppercase tracking-wider text-sm">
              <Eye size={16} />
              <span>Live Preview</span>
            </h3>
            <div className={`relative group aspect-video bg-[#00469b] rounded-2xl overflow-hidden shadow-2xl border-4 transition-colors ${highlightPreview ? 'border-blue-500' : 'border-zinc-900'}`}>
              <div className="absolute inset-0 transform scale-[0.6] origin-center pointer-events-none">
                <BSODScreen config={config} previewMode={true} />
              </div>
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 md:group-hover:bg-black/20 transition-all flex items-center justify-center">
                 <button 
                  onClick={launchBSOD}
                  className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all bg-white text-blue-700 px-6 py-3 rounded-full font-bold flex items-center space-x-2 shadow-xl active:scale-95"
                >
                  <Maximize2 size={18} />
                  <span>Launch Fullscreen</span>
                </button>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-blue-200/50 uppercase tracking-[0.2em] font-bold">
                Tip: Press F11 to truly fool your friends
              </div>
            </div>
          </div>

          {/* Panic Feed / System Logs */}
          <div className="bg-zinc-900/20 border border-zinc-800/30 rounded-2xl p-6 overflow-hidden relative group">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-zinc-500 font-bold flex items-center space-x-2 uppercase tracking-wider text-sm">
                <Terminal size={16} />
                <span>Live Failure Feed</span>
              </h3>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-red-500/50 font-mono uppercase tracking-widest">Live Logs</span>
              </div>
            </div>
            <div className="font-mono text-xs space-y-2 h-32 overflow-hidden mask-fade-bottom">
              <p className="text-zinc-600">[ 0.000000] Initializing Panic Engine v2.4.0...</p>
              <p className="text-blue-500/50">[ 0.124512] Loading Windows XP/7/10/11 artifacts...</p>
              <p className="text-zinc-600">[ 0.451241] Allocating memory for simulated catastrophe...</p>
              <p className="text-red-500/70">[ 1.245124] CRITICAL: Logic failure detected in kernel.sys</p>
              <p className="text-zinc-600">[ 1.451245] Attempting to bypass security protocols...</p>
              <p className="text-green-500/50">[ 2.124512] Successfully simulated system-wide panic.</p>
              <p className="text-zinc-600 animate-pulse text-zinc-400">_</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent pointer-events-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* How it works */}
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 space-y-6">
              <h3 className="text-zinc-300 font-bold flex items-center space-x-2 uppercase tracking-wider text-sm">
                <span>How it works</span>
              </h3>
              <div className="space-y-4">
                {[
                  { step: "1", text: 'Click "Launch BSOD"' },
                  { step: "2", text: "The fake BSOD will open in fullscreen" },
                  { step: "3", text: "Watch the panic unfold 😈" },
                  { step: "4", text: "Press Esc to exit (don't tell them)" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4 group">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                      {item.step}
                    </span>
                    <p className="text-zinc-400 pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 space-y-6">
              <h3 className="text-red-500 font-bold flex items-center space-x-2 uppercase tracking-wider text-sm">
                <AlertTriangle size={16} />
                <span>Disclaimer</span>
              </h3>
              <div className="space-y-4">
                <p className="text-zinc-400 text-sm leading-relaxed">
                  This is a prank tool intended for entertainment purposes only. It does not harm your computer in any way. 
                </p>
                <div className="flex items-center space-x-2 text-zinc-500">
                  <span className="text-sm">Use responsibly.</span>
                  <span>😇</span>
                </div>
              </div>
            </div>
          </div> {/* Close Grid */}
        </div> {/* Close lg:col-span-8 */}
      </div> {/* Close max-w-7xl grid */}

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500 pb-12">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p>
            <span className="text-zinc-300 font-semibold tracking-wide">Crash</span> is an experiment from <span className="text-blue-500 font-medium">Aura Labs</span>.
          </p>
          <p>
            To explore more procedural interfaces,{' '}
            <a 
              href="https://labs.aura360studio.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-300 underline underline-offset-4 hover:text-blue-400 transition-colors"
            >
              check our lab
            </a>.
          </p>
        </div>
        
        <div className="flex items-center gap-2 group">
          <span className="text-zinc-600 uppercase tracking-[0.2em] text-[10px] font-bold">Powered by</span>
          <a 
            href="https://aura360studio.com/showcase" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white font-black tracking-tighter text-lg hover:text-blue-500 transition-colors"
          >
            AURA360STUDIO
          </a>
        </div>
      </footer>
    </div>
  );
}
