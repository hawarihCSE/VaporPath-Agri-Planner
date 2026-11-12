import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2, Play, Maximize2, Minimize2, X, ArrowLeft, Cpu, Droplets, Sprout, Globe, ExternalLink, RefreshCw } from 'lucide-react';

export const SIMULATIONS_LIST = [
  {
    id: 'vaporpath-sim',
    title: 'VaporPath Agri-Planner (Full 7-Screen Simulation)',
    badge: 'GODOT 4.x // LIVE NASA POWER',
    category: 'Full Interactive Campaign',
    path: 'simulations/vaporpath-sim/index.html',
    description:
      'Complete 7-screen interactive agricultural simulation: choose your South American farming region, fetch live NASA POWER (GWETROOT & PRECTOTCORR) telemetry, trace Amazon Flying Rivers, select drought-resilient crops, and activate precision irrigation.',
    metrics: ['7 Interactive Screens', 'Live NASA POWER API', '65% Max Water Saved'],
    accent: 'emerald'
  },
  {
    id: 'moisture-journey',
    title: 'Continental Moisture Journey (Flying Rivers)',
    badge: 'STAGE 4 MODULE // VAPOR FLOW',
    category: 'Atmospheric Telemetry Sim',
    path: 'simulations/moisture-journey/index.html',
    description:
      'Interactive 4-stage visualization of upwind Amazon canopy evapotranspiration, high-altitude Flying Rivers vapor transport, condensation, and regional farm soil moisture deficits.',
    metrics: ['4-Stage State Machine', 'Particle Vapor Conduit', 'Play / Pause / Replay'],
    accent: 'cyan'
  },
  {
    id: 'irrigation-lab',
    title: 'Smart Water Plan — Irrigation Control Lab',
    badge: 'STAGE 6 MODULE // ROOT CUTAWAY',
    category: 'Sub-Surface Physics Sim',
    path: 'simulations/irrigation-lab/index.html',
    description:
      'Close-up subterranean root-zone cutaway simulation comparing Precision Smart Drip emitters (-50% water) against Rotary Micro-Sprinkler rigs (-30% water) across Sorghum, Millet, Cowpea, and Soybean.',
    metrics: ['Root Cross-Section', 'Dual Machine Units', 'Real-Time Moisture Rings'],
    accent: 'blue'
  }
];

export default function SimulationsHub({ activeFarm, initialSimId = null, onClose }) {
  const [activeSim, setActiveSim] = useState(
    initialSimId ? SIMULATIONS_LIST.find((s) => s.id === initialSimId) || null : null
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);
  const viewerContainerRef = useRef(null);

  // Cleanly unload Godot WASM / Canvas instance before switching or closing
  const unloadIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = 'about:blank';
    }
  };

  const handleLaunchSim = (sim) => {
    unloadIframe();
    setTimeout(() => {
      setActiveSim(sim);
    }, 20);
  };

  const handleCloseViewer = () => {
    unloadIframe();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsFullscreen(false);
    setActiveSim(null);
  };

  const handleToggleFullscreen = () => {
    const container = viewerContainerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {
        setIsFullscreen(!isFullscreen);
      });
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    return () => {
      unloadIframe();
    };
  }, []);

  return (
    <div className="relative z-20 flex-1 w-full h-[calc(100vh-60px)] overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#080C0E]/95 backdrop-blur-md">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 shadow-lg">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide font-mono uppercase">
                Interactive Godot Web Simulations
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                WASM + HTML5 READY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Unified VaporPath Decision-Support Simulations • Active Context: {activeFarm.name} ({activeFarm.location})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="observation.html"
            className="px-3 py-1.5 rounded-md bg-white/[0.06] hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>L4 Earth Observation Page</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          {onClose && (
            <button
              onClick={() => {
                handleCloseViewer();
                onClose();
              }}
              className="px-3 py-1.5 rounded-md bg-white/[0.06] hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to GIS Map</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulation Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {SIMULATIONS_LIST.map((sim) => {
          const isCurrent = activeSim && activeSim.id === sim.id;
          return (
            <div
              key={sim.id}
              className={`rounded-xl p-5 flex flex-col justify-between space-y-4 border transition-all ${
                isCurrent
                  ? 'bg-emerald-950/35 border-emerald-400 ring-1 ring-emerald-400/50 shadow-xl'
                  : 'bg-[#10161B]/95 border-white/10 hover:border-emerald-500/50 shadow-lg'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 font-semibold">
                    {sim.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{sim.category}</span>
                </div>

                <h3 className="text-base font-bold text-white font-mono leading-snug">
                  {sim.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {sim.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                <div className="flex flex-wrap gap-1.5">
                  {sim.metrics.map((m, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/10"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleLaunchSim(sim)}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isCurrent ? 'Restart Simulation' : 'Launch Simulation'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Responsive Iframe Simulation Viewer Modal */}
      {activeSim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-md">
          <div
            ref={viewerContainerRef}
            className="w-full max-w-6xl h-[88vh] bg-[#090E12] rounded-xl border border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Viewer Control Bar */}
            <div className="px-4 py-2.5 bg-[#0D141A] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCloseViewer}
                  className="px-2.5 py-1 rounded bg-white/[0.07] hover:bg-white/15 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-colors"
                  title="Close simulation and free browser memory"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Back</span>
                </button>
                <div className="h-4 w-px bg-white/10"></div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-mono font-bold text-white truncate max-w-md">
                  {activeSim.title}
                </span>
              </div>

              {/* Quick Switcher + Fullscreen + Close */}
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-1 mr-2">
                  {SIMULATIONS_LIST.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleLaunchSim(s)}
                      className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                        activeSim.id === s.id
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {s.id === 'vaporpath-sim' ? 'Full Game' : s.id === 'moisture-journey' ? 'Vapor Flow' : 'Irrigation Lab'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleToggleFullscreen}
                  className="px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-mono flex items-center gap-1.5 border border-emerald-500/40 transition-colors"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                </button>

                <button
                  onClick={handleCloseViewer}
                  className="p-1.5 rounded bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30 transition-colors"
                  title="Close Viewer (Unloads WASM)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulation Iframe */}
            <div className="flex-1 w-full bg-black relative">
              <iframe
                ref={iframeRef}
                src={activeSim.path}
                title={activeSim.title}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; cross-origin-isolated"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

