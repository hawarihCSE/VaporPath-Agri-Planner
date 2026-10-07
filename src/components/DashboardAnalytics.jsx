import React from 'react';
import { X, Droplets, CloudRain, Sun, Thermometer, AlertOctagon, TrendingDown, ArrowUpRight, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DashboardAnalytics({ onClose, activeFarm }) {
  // NASA 30-Year Baseline vs 2026 Soil Moisture Anomaly Data
  const trendData = [
    { month: 'Jul', baseline: 0.38, current: 0.36, forecast: null },
    { month: 'Aug', baseline: 0.35, current: 0.31, forecast: null },
    { month: 'Sep', baseline: 0.32, current: 0.24, forecast: null },
    { month: 'Oct (Current)', baseline: 0.29, current: 0.14, forecast: 0.14 },
    { month: 'Nov (Pred)', baseline: 0.28, current: null, forecast: 0.11 },
    { month: 'Dec (Pred)', baseline: 0.34, current: null, forecast: 0.18 },
    { month: 'Jan (Pred)', baseline: 0.42, current: null, forecast: 0.32 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-5xl max-h-[90vh] glass-modal rounded-xl shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-obsidian/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gisGreen-950 border border-gisGreen-500/30 text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide font-mono uppercase flex items-center gap-2">
                Drought Risk & Telemetry Dashboard
              </h2>
              <p className="text-xs text-slate-400">
                NASA Earth Observation Satellites • {activeFarm.name} ({activeFarm.sector})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Metric Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vulnerability Index Score Card */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-amber-950/40 via-red-950/20 to-obsidian border border-amber-500/30 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-amber-300">
                <span className="uppercase font-semibold">Drought Vulnerability Index</span>
                <AlertOctagon className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold font-mono text-amber-400">74</span>
                <span className="text-slate-400 text-sm font-mono">/ 100</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-medium">
                  HIGH RISK
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                3–4 week predictive early warning triggered. Severe root-zone moisture deficit detected.
              </p>
            </div>

            {/* SMAP Soil Moisture Card */}
            <div className="p-4 rounded-lg bg-[#11171D] border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-blue-400">
                <span className="uppercase font-semibold">SMAP Soil Moisture</span>
                <Droplets className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold font-mono text-white">0.14</span>
                <span className="text-slate-400 text-xs font-mono">m³/m³</span>
                <span className="ml-auto text-xs text-red-400 font-mono flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -32%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Root-zone soil moisture level benchmarked against 30-year NASA climatological norm.
              </p>
            </div>

            {/* GPM Precipitation Deficit */}
            <div className="p-4 rounded-lg bg-[#11171D] border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-cyan-400">
                <span className="uppercase font-semibold">GPM IMERG 30-Day Rain</span>
                <CloudRain className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold font-mono text-white">42.0</span>
                <span className="text-slate-400 text-xs font-mono">mm</span>
                <span className="ml-auto text-xs text-amber-400 font-mono">
                  Norm: 115mm
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Cumulative precipitation shortfall of 73mm over the past 30 days.
              </p>
            </div>
          </div>

          {/* NASA Satellite Data Stream Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-md bg-white/[0.03] border border-white/5 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">ECOSTRESS ESI</div>
              <div className="text-lg font-bold font-mono text-amber-400">0.78 <span className="text-xs font-normal text-slate-400">ratio</span></div>
              <div className="text-[10px] text-slate-400">Evaporative Stress Index</div>
            </div>
            <div className="p-3 rounded-md bg-white/[0.03] border border-white/5 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Landsat 9 NDVI</div>
              <div className="text-lg font-bold font-mono text-emerald-400">0.42 <span className="text-xs font-normal text-slate-400">index</span></div>
              <div className="text-[10px] text-slate-400">Canopy Health Score</div>
            </div>
            <div className="p-3 rounded-md bg-white/[0.03] border border-white/5 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">NASA POWER Solar</div>
              <div className="text-lg font-bold font-mono text-amber-300">6.8 <span className="text-xs font-normal text-slate-400">kWh/m²</span></div>
              <div className="text-[10px] text-slate-400">Solar Insolation Daily</div>
            </div>
            <div className="p-3 rounded-md bg-white/[0.03] border border-white/5 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">VPD Air Deficit</div>
              <div className="text-lg font-bold font-mono text-slate-200">2.8 <span className="text-xs font-normal text-slate-400">kPa</span></div>
              <div className="text-[10px] text-slate-400">Atmospheric Vapor Pressure</div>
            </div>
          </div>

          {/* Interactive Trend Chart */}
          <div className="p-5 rounded-lg bg-[#11171D] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 font-mono">
                  SMAP Moisture Anomaly vs 30-Year NASA Climatology
                </h3>
                <p className="text-xs text-slate-400">Root-zone soil moisture ($m^3/m^3$) with 3-4 week predictive predictive curve</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/40">
                30-Yr NASA Climatological Baseline
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="baselineColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="currentColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} fontFamily="JetBrains Mono" />
                  <YAxis stroke="#94A3B8" fontSize={11} fontFamily="JetBrains Mono" domain={[0, 0.5]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0D1115', borderColor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
                  <Area type="monotone" dataKey="baseline" name="30-Year Baseline (NASA POWER/SMAP)" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#baselineColor)" />
                  <Area type="monotone" dataKey="current" name="2026 Observed Telemetry" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#baselineColor)" />
                  <Area type="monotone" dataKey="forecast" name="3-4 Wk Predictive Forecast" stroke="#EF4444" strokeDasharray="4 4" strokeWidth={2.5} fillOpacity={1} fill="url(#currentColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-obsidian flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>Data Refreshed: NASA Worldview API (Live Stream 18:45 UTC)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gisGreen-600/30 hover:bg-gisGreen-600/50 text-emerald-300 font-medium rounded border border-gisGreen-500/40 transition-colors"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
