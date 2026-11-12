import React, { useState } from 'react';
import { Plus, Minus, Layers, Eye, Info, Check } from 'lucide-react';

export default function SatelliteMap({ activeFarm, selectedLayer, setSelectedLayer, onSelectField }) {
  const [zoomLevel, setZoomLevel] = useState(14);
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Satellite layer options
  const layers = [
    { id: 'base', name: 'Base Satellite Imagery', agency: 'High-Res Sentinel-2', color: 'border-slate-500' },
    { id: 'smap', name: 'SMAP Soil Moisture (0-5cm & Root Zone)', agency: 'NASA JPL', color: 'border-blue-500' },
    { id: 'gpm', name: 'GPM IMERG Precipitation Anomaly', agency: 'NASA / JAXA', color: 'border-cyan-500' },
    { id: 'ecostress', name: 'ECOSTRESS Evaporative Stress Index', agency: 'NASA JPL', color: 'border-amber-500' },
    { id: 'landsat', name: 'Landsat 9 NDVI / Canopy Health', agency: 'NASA / USGS', color: 'border-emerald-500' },
  ];

  return (
    <main className="absolute inset-0 w-full h-full overflow-hidden" data-purpose="satellite-canvas-container">
      {/* Base Satellite Map Background */}
      <img
        alt="Satellite Earth Imagery of Mato Grosso agricultural parcels"
        className={`w-full h-full object-cover object-center transform transition-transform duration-500 filter brightness-[0.92] contrast-[1.08]`}
        style={{ transform: `scale(${1 + (zoomLevel - 14) * 0.1})` }}
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=80"
      />

      {/* Dynamic Satellite Layer Overlay Heatmaps */}
      {selectedLayer === 'smap' && (
        <div className="absolute inset-0 bg-blue-900/30 mix-blend-color-dodge pointer-events-none transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/30 via-blue-500/20 to-transparent"></div>
        </div>
      )}
      {selectedLayer === 'gpm' && (
        <div className="absolute inset-0 bg-cyan-950/40 mix-blend-overlay pointer-events-none transition-opacity duration-300">
          <div className="absolute inset-0 bg-radial from-amber-500/20 via-sky-600/30 to-blue-900/40"></div>
        </div>
      )}
      {selectedLayer === 'ecostress' && (
        <div className="absolute inset-0 bg-amber-950/30 mix-blend-hard-light pointer-events-none transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/30 via-orange-500/20 to-red-900/30"></div>
        </div>
      )}
      {selectedLayer === 'landsat' && (
        <div className="absolute inset-0 bg-emerald-950/40 mix-blend-soft-light pointer-events-none transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/40 via-green-600/20 to-yellow-600/20"></div>
        </div>
      )}

      {/* Technical Cartographic Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none gis-backdrop"></div>

      {/* SVG Parcel Boundaries */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1920 1080">
        <defs>
          <pattern id="diagonalHatch" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="16" stroke={selectedLayer === 'ecostress' ? "rgba(245, 158, 11, 0.25)" : "rgba(16, 185, 129, 0.16)"} strokeWidth="1.2" />
          </pattern>
          <radialGradient id="centroidGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Parcel 1 - Active Sector 04-B */}
        <g className="cursor-pointer pointer-events-auto" onClick={() => onSelectField('Sector 04-B')}>
          <polygon
            points="854,302 884,332 948,390 1082,465 1038,760 832,886 818,790 686,540 820,440"
            className="gis-boundary-line transition-colors duration-300"
            fill="#10B981"
            fillOpacity={activeFarm.sector === 'Sector 04-B' ? "0.18" : "0.08"}
            stroke={activeFarm.sector === 'Sector 04-B' ? "#10B981" : "#34D399"}
            strokeWidth={activeFarm.sector === 'Sector 04-B' ? "2.5" : "1.5"}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon points="854,302 884,332 948,390 1082,465 1038,760 832,886 818,790 686,540 820,440" fill="url(#diagonalHatch)" />

          {/* Geo Vertices */}
          <circle cx="854" cy="302" r="3.5" fill="#34D399" stroke="#051424" strokeWidth="1.5" />
          <circle cx="884" cy="332" r="2.5" fill="#34D399" />
          <circle cx="948" cy="390" r="2.5" fill="#34D399" />
          <circle cx="1082" cy="465" r="3.5" fill="#34D399" stroke="#051424" strokeWidth="1.5" />
          <circle cx="1038" cy="760" r="3.5" fill="#34D399" stroke="#051424" strokeWidth="1.5" />
          <circle cx="832" cy="886" r="3.5" fill="#34D399" stroke="#051424" strokeWidth="1.5" />
          <circle cx="818" cy="790" r="2.5" fill="#34D399" />
          <circle cx="686" cy="540" r="3.5" fill="#34D399" stroke="#051424" strokeWidth="1.5" />
          <circle cx="820" cy="440" r="2.5" fill="#34D399" />

          {/* Centroid Indicator */}
          {activeFarm.sector === 'Sector 04-B' && (
            <>
              <circle cx="895" cy="580" r="22" fill="url(#centroidGlow)" className="animate-pulse" />
              <circle cx="895" cy="580" r="3.5" fill="#10B981" />
              <line x1="895" y1="580" x2="940" y2="535" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1.2" strokeDasharray="3 3" />
              <rect x="944" y="518" width="220" height="24" rx="4" fill="rgba(9, 13, 16, 0.85)" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" />
              <text x="950" y="534" fill="#6EE7B7" fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="600">
                LAT: -12.5583° LON: -55.7042°
              </text>
            </>
          )}
        </g>

        {/* Secondary Parcel - Sector 02-A */}
        <g className="cursor-pointer pointer-events-auto" onClick={() => onSelectField('Sector 02-A')}>
          <polygon
            points="1120,380 1260,420 1220,680 1090,620"
            fill={activeFarm.sector === 'Sector 02-A' ? "#3B82F6" : "#0284C7"}
            fillOpacity={activeFarm.sector === 'Sector 02-A' ? "0.22" : "0.08"}
            stroke={activeFarm.sector === 'Sector 02-A' ? "#60A5FA" : "#38BDF8"}
            strokeWidth="1.8"
            strokeDasharray="4 2"
          />
          <text x="1150" y="520" fill="#93C5FD" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="500">
            Sector 02-A (310 ha)
          </text>
        </g>
      </svg>

      {/* Floating Map Controls (Zoom & Layer Selector) */}
      <div className="absolute right-6 bottom-6 z-30 pointer-events-auto flex flex-col space-y-2.5 items-end">
        {/* Active Layer Badge */}
        {selectedLayer !== 'base' && (
          <div className="glass-hud px-3 py-1.5 rounded-md text-xs font-mono flex items-center space-x-2 border border-emerald-500/30 text-emerald-300 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>NASA Stream: {layers.find(l => l.id === selectedLayer)?.name}</span>
            <button onClick={() => setSelectedLayer('base')} className="ml-1 hover:text-white text-slate-400">×</button>
          </div>
        )}

        {/* Layer Selector Popup Menu */}
        {showLayerMenu && (
          <div className="w-72 glass-hud rounded-lg p-3 shadow-2xl border border-white/10 space-y-2 mb-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold px-2 pb-1 border-b border-white/10 flex justify-between">
              <span>NASA Earth Data Layers</span>
              <span className="text-emerald-400">ACTIVE</span>
            </div>
            {layers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => { setSelectedLayer(layer.id); setShowLayerMenu(false); }}
                className={`w-full text-left px-2.5 py-2 rounded-md transition-all flex items-center justify-between text-xs ${
                  selectedLayer === layer.id
                    ? 'bg-gisGreen-950/80 border border-gisGreen-500/40 text-emerald-300 font-medium'
                    : 'hover:bg-white/[0.05] text-slate-300'
                }`}
              >
                <div>
                  <div className="font-sans font-medium">{layer.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">{layer.agency}</div>
                </div>
                {selectedLayer === layer.id && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            ))}
          </div>
        )}

        {/* Map Control Button Stack */}
        <div className="flex flex-col rounded-md overflow-hidden glass-hud border border-white/10 shadow-xl">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}
            className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] border-b border-white/[0.08] transition-colors"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 1, 10))}
            className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Layer Toggle Button */}
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className={`w-9 h-9 rounded-md flex items-center justify-center glass-hud border transition-colors shadow-xl ${
            showLayerMenu || selectedLayer !== 'base'
              ? 'border-gisGreen-500 text-gisGreen-400 bg-gisGreen-950/60'
              : 'border-white/10 text-slate-300 hover:text-gisGreen-400 hover:bg-white/[0.08]'
          }`}
          title="Toggle NASA Satellite Layers"
        >
          <Layers className="w-4.5 h-4.5" />
        </button>
      </div>
    </main>
  );
}
