import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Droplets,
  CloudRain,
  Sun,
  Sprout,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Download,
  Calendar,
  Activity,
  Maximize2,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Filter
} from 'lucide-react';
import SatelliteMap from './SatelliteMap';

export default function GISDashboard({
  activeFarm,
  onSelectField,
  selectedLayer,
  setSelectedLayer,
  onApplyPlan,
  onExportReport,
  onOpenAnalytics,
  onOpenAlerts
}) {
  const [selectedCropOption, setSelectedCropOption] = useState('sorghum');
  const [planApplied, setPlanApplied] = useState(false);

  // Field presets dictionary for field selection
  const fields = [
    {
      id: 'MT-0742-SM',
      sector: 'Sector 04-B',
      area: '420.50 ha',
      crop: 'Soy (2023/24)',
      stressLevel: 'Severe',
      stressColor: 'text-red-400 bg-red-950/80 border-red-500/40',
      smap: '0.14 m³/m³',
      rainDeficit: '-73 mm',
      esi: '0.78',
      ndvi: '0.42',
      recommendation: 'Grain Sorghum (BRS 330)'
    },
    {
      id: 'MT-0742-SA',
      sector: 'Sector 02-A',
      area: '310.00 ha',
      crop: 'Soy (2023/24)',
      stressLevel: 'Moderate',
      stressColor: 'text-amber-400 bg-amber-950/80 border-amber-500/40',
      smap: '0.22 m³/m³',
      rainDeficit: '-41 mm',
      esi: '0.62',
      ndvi: '0.58',
      recommendation: 'Pearl Millet (ADR 300)'
    },
    {
      id: 'MT-0742-SC',
      sector: 'Sector 01-C',
      area: '280.00 ha',
      crop: 'Corn (2nd Crop)',
      stressLevel: 'Low Stress',
      stressColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40',
      smap: '0.31 m³/m³',
      rainDeficit: '-12 mm',
      esi: '0.38',
      ndvi: '0.74',
      recommendation: 'Maintain Current Irrigation'
    },
    {
      id: 'MT-0742-SD',
      sector: 'Sector 03-D',
      area: '195.00 ha',
      crop: 'Cover Crop / Millet',
      stressLevel: 'Optimal',
      stressColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/40',
      smap: '0.36 m³/m³',
      rainDeficit: '+5 mm',
      esi: '0.24',
      ndvi: '0.81',
      recommendation: 'Optimal Moisture - No Shift Needed'
    }
  ];

  const currentFieldData = fields.find(f => f.sector === activeFarm.sector) || fields[0];

  const cropRecommendations = [
    {
      id: 'sorghum',
      name: 'Grain Sorghum (BRS 330)',
      savings: '45% water saved',
      yieldScore: '92% Resilience',
      desc: 'Extremely resilient root architecture designed for sub-surface moisture extraction during 3–4 week drought windows.',
      recommended: true
    },
    {
      id: 'millet',
      name: 'Pearl Millet (ADR 300)',
      savings: '60% water saved',
      yieldScore: '95% Resilience',
      desc: 'High biomass cover conserving soil moisture and providing rapid ground shading.',
      recommended: false
    },
    {
      id: 'cowpea',
      name: 'Resilient Cowpea',
      savings: '50% water saved',
      yieldScore: '88% Resilience',
      desc: 'Leguminous nitrogen-fixing crop ideal for soil organic matter restoration.',
      recommended: false
    }
  ];

  return (
    <div className="relative z-20 flex-1 w-full h-[calc(100vh-60px)] overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#080C0E]/90 backdrop-blur-md">
      {/* Top Field Selector & Section Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-gisGreen-500 shadow-[0_0_8px_#10B981]"></span>
            <h1 className="text-lg font-bold text-white tracking-wide font-mono uppercase">
              GIS Dashboard & Actionable Recommendations
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Real-time NASA satellite telemetry stream, field moisture stress indicators, and adaptive crop planning.
          </p>
        </div>

        {/* Field Switcher Selector Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1">
          <span className="text-xs text-slate-400 font-mono mr-1 hidden sm:inline flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Select Parcel:
          </span>
          {fields.map((f) => (
            <button
              key={f.sector}
              onClick={() => onSelectField(f.sector)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center space-x-1.5 ${
                activeFarm.sector === f.sector
                  ? 'bg-gisGreen-950 text-emerald-300 border border-gisGreen-500/50 shadow-md font-semibold'
                  : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              <span>{f.sector}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded border ${f.stressColor}`}>
                {f.stressLevel}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout: Main GIS Map Viewport (Left/Top) + Status & Water Stress Panel (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Satellite Map Viewport (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative w-full h-[400px] lg:h-[480px] rounded-xl overflow-hidden border border-white/10 glass-hud shadow-2xl">
            {/* Interactive Satellite Map Component */}
            <SatelliteMap
              activeFarm={activeFarm}
              selectedLayer={selectedLayer}
              setSelectedLayer={setSelectedLayer}
              onSelectField={onSelectField}
            />

            {/* Viewport Overlay Controls Header */}
            <div className="absolute top-3 left-3 z-30 pointer-events-auto flex items-center space-x-2">
              <span className="glass-hud px-2.5 py-1 rounded text-xs font-mono text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeFarm.name} ({activeFarm.sector})</span>
              </span>
              <span className="glass-hud px-2.5 py-1 rounded text-[11px] font-mono text-slate-300 border border-white/10">
                {activeFarm.coordinates}
              </span>
            </div>
          </div>

          {/* Quick Layer Info Bar */}
          <div className="glass-hud p-3 rounded-lg border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400 font-sans">Active Satellite Layer:</span>
              <span className="text-white font-semibold capitalize">{selectedLayer} Stream</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="text-slate-400">Layer Options:</span>
              <button onClick={() => setSelectedLayer('smap')} className={`hover:text-emerald-400 ${selectedLayer==='smap'?'text-emerald-400 font-bold':''}`}>SMAP</button>
              <span>•</span>
              <button onClick={() => setSelectedLayer('gpm')} className={`hover:text-cyan-400 ${selectedLayer==='gpm'?'text-cyan-400 font-bold':''}`}>GPM</button>
              <span>•</span>
              <button onClick={() => setSelectedLayer('ecostress')} className={`hover:text-amber-400 ${selectedLayer==='ecostress'?'text-amber-400 font-bold':''}`}>ECOSTRESS</button>
              <span>•</span>
              <button onClick={() => setSelectedLayer('landsat')} className={`hover:text-emerald-400 ${selectedLayer==='landsat'?'text-emerald-400 font-bold':''}`}>Landsat 9</button>
            </div>
          </div>
        </div>

        {/* Right Column: Field Telemetry & Water-Stress Indicators (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Field Status Telemetry Card */}
          <div className="glass-hud p-5 rounded-xl border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold font-mono text-white uppercase">Field Telemetry Status</h2>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${currentFieldData.stressColor}`}>
                {currentFieldData.stressLevel} WATER STRESS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-white/[0.03] border border-white/5 space-y-0.5">
                <span className="text-slate-400 text-[11px]">Parcel Area</span>
                <div className="font-mono text-white font-semibold text-sm">{activeFarm.area}</div>
              </div>
              <div className="p-2.5 rounded bg-white/[0.03] border border-white/5 space-y-0.5">
                <span className="text-slate-400 text-[11px]">Current Crop</span>
                <div className="font-mono text-emerald-300 font-semibold text-sm truncate">{activeFarm.crop}</div>
              </div>
              <div className="p-2.5 rounded bg-white/[0.03] border border-white/5 space-y-0.5">
                <span className="text-slate-400 text-[11px]">Elevation</span>
                <div className="font-mono text-slate-200 text-sm">{activeFarm.elevation}</div>
              </div>
              <div className="p-2.5 rounded bg-white/[0.03] border border-white/5 space-y-0.5">
                <span className="text-slate-400 text-[11px]">Soil Composition</span>
                <div className="font-mono text-slate-200 text-sm truncate">Clay Oxisol</div>
              </div>
            </div>
          </div>

          {/* Water-Stress Indicators Gauge Grid */}
          <div className="glass-hud p-5 rounded-xl border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold font-mono text-white uppercase">NASA Water-Stress Indicators</h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Live Stream</span>
            </div>

            {/* Water Stress Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Root-Zone Deficit Level:</span>
                <span className="text-amber-400 font-bold">78% Deficit</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 w-[78%]"></div>
              </div>
            </div>

            {/* 4 Sensor Telemetry Tiles */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-[#11171D] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-blue-400">
                  <span>SMAP Root Moisture</span>
                  <Droplets className="w-3.5 h-3.5" />
                </div>
                <div className="text-lg font-bold font-mono text-white">{currentFieldData.smap}</div>
                <div className="text-[10px] text-red-400 font-mono">-32% vs 30-Yr Norm</div>
              </div>

              <div className="p-3 rounded-lg bg-[#11171D] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span>GPM Rain Shortfall</span>
                  <CloudRain className="w-3.5 h-3.5" />
                </div>
                <div className="text-lg font-bold font-mono text-white">{currentFieldData.rainDeficit}</div>
                <div className="text-[10px] text-slate-400 font-mono">30-Day Accumulation</div>
              </div>

              <div className="p-3 rounded-lg bg-[#11171D] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-amber-400">
                  <span>ECOSTRESS ESI</span>
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <div className="text-lg font-bold font-mono text-amber-300">{currentFieldData.esi}</div>
                <div className="text-[10px] text-amber-400 font-mono">Elevated Canopy Heat</div>
              </div>

              <div className="p-3 rounded-lg bg-[#11171D] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span>Landsat 9 NDVI</span>
                  <Sprout className="w-3.5 h-3.5" />
                </div>
                <div className="text-lg font-bold font-mono text-emerald-400">{currentFieldData.ndvi}</div>
                <div className="text-[10px] text-slate-400 font-mono">Canopy Index</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Actionable Crop Recommendations Panel */}
      <div className="glass-hud p-6 rounded-xl border border-white/10 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide font-mono uppercase">
                Actionable Crop Recommendations & Rotation Planner
              </h2>
              <p className="text-xs text-slate-400">
                Data-driven crop recommendations calibrated to {activeFarm.sector}'s current water-stress index.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenAnalytics}
              className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/10 text-slate-200 text-xs font-mono rounded border border-white/10 transition-colors"
            >
              Full NASA Analytics
            </button>
            <button
              onClick={onExportReport}
              className="px-3 py-1.5 bg-gisGreen-600/30 hover:bg-gisGreen-600/50 text-emerald-300 text-xs font-mono rounded border border-gisGreen-500/40 transition-colors flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Field Report</span>
            </button>
          </div>
        </div>

        {/* Primary Recommendation Banner */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-950/60 via-obsidian to-blue-950/40 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                RECOMMENDED ACTION FOR {activeFarm.sector}
              </span>
              <span className="text-xs text-slate-400 font-mono">3–4 Week Early Warning Active</span>
            </div>
            <p className="text-sm text-slate-200 leading-snug">
              Transition {activeFarm.sector} from Soybeans to <span className="font-bold text-emerald-300 font-mono">{currentFieldData.recommendation}</span> before Oct 28 to conserve <span className="text-white font-mono font-semibold">189,220 m³</span> of water and prevent projected drought crop loss.
            </p>
          </div>

          <button
            onClick={() => {
              setPlanApplied(true);
              const opt = cropRecommendations.find(c => c.id === selectedCropOption);
              onApplyPlan(opt);
              setTimeout(() => setPlanApplied(false), 2500);
            }}
            className="px-5 py-2.5 bg-gisGreen-500 hover:bg-gisGreen-600 text-obsidian font-bold text-xs font-mono rounded-lg shadow-lg transition-all flex items-center space-x-2 flex-shrink-0"
          >
            {planApplied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Rotation Plan Applied!</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Execute Rotation Shift</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Crop Option Cards Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cropRecommendations.map((crop) => (
            <div
              key={crop.id}
              onClick={() => setSelectedCropOption(crop.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all flex flex-col justify-between space-y-3 relative ${
                selectedCropOption === crop.id
                  ? 'border-gisGreen-400 bg-gisGreen-950/40 ring-1 ring-gisGreen-400 shadow-xl'
                  : 'bg-[#11171D] border-white/10 hover:border-slate-400'
              }`}
            >
              {crop.recommended && (
                <span className="absolute -top-2.5 right-3 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500 text-obsidian shadow">
                  OPTIMAL MATCH
                </span>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white font-mono">{crop.name}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-snug">{crop.desc}</p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-300 font-semibold">{crop.savings}</span>
                <span className="text-slate-300">{crop.yieldScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
