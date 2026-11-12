import React, { useState } from 'react';
import {
  Droplets,
  CloudRain,
  Sun,
  Sprout,
  ShieldAlert,
  TrendingDown,
  Activity,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Calendar,
  Layers,
  Filter
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function SoilMoistureAnalytics({
  activeFarm,
  onSelectField,
  onApplyPlan,
  onExportReport,
  onOpenAlerts
}) {
  const [selectedCrop, setSelectedCrop] = useState('sorghum');
  const [actionDone, setActionDone] = useState(false);

  // Field specific moisture dataset
  const fieldMoistureData = {
    'Sector 04-B': {
      surfaceMoisture: '0.12 m³/m³',
      rootZoneMoisture: '0.14 m³/m³',
      fieldCapacityPct: '34%',
      wiltingPoint: '0.10 m³/m³',
      status: 'CRITICAL DEFICIT',
      statusColor: 'text-red-400 bg-red-950/80 border-red-500/40',
      depletionRate: '-0.015 m³/m³ / wk',
      daysToWilting: '4 Days',
      soilType: 'Clay Oxisol (Heavy Soil)',
      recommendation: 'Targeted RDI (25mm) + Transition to Sorghum'
    },
    'Sector 02-A': {
      surfaceMoisture: '0.18 m³/m³',
      rootZoneMoisture: '0.22 m³/m³',
      fieldCapacityPct: '52%',
      wiltingPoint: '0.10 m³/m³',
      status: 'MODERATE STRESS',
      statusColor: 'text-amber-400 bg-amber-950/80 border-amber-500/40',
      depletionRate: '-0.009 m³/m³ / wk',
      daysToWilting: '12 Days',
      soilType: 'Clay-Loam Oxisol',
      recommendation: 'Apply Residue Mulching + Pearl Millet'
    },
    'Sector 01-C': {
      surfaceMoisture: '0.28 m³/m³',
      rootZoneMoisture: '0.31 m³/m³',
      fieldCapacityPct: '76%',
      wiltingPoint: '0.10 m³/m³',
      status: 'OPTIMAL MOISTURE',
      statusColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40',
      depletionRate: '-0.003 m³/m³ / wk',
      daysToWilting: '28 Days',
      soilType: 'Sandy Clay Loam',
      recommendation: 'Maintain Current Irrigation Schedule'
    },
    'Sector 03-D': {
      surfaceMoisture: '0.34 m³/m³',
      rootZoneMoisture: '0.36 m³/m³',
      fieldCapacityPct: '88%',
      wiltingPoint: '0.10 m³/m³',
      status: 'SURPLUS MOISTURE',
      statusColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/40',
      depletionRate: '+0.002 m³/m³ / wk',
      daysToWilting: '35+ Days',
      soilType: 'Deep Oxisol',
      recommendation: 'No Water Stress - Cover Crop Active'
    }
  };

  const currentData = fieldMoistureData[activeFarm.sector] || fieldMoistureData['Sector 04-B'];

  // NASA 30-Year Baseline vs 2026 Soil Moisture Depletion Trend
  const moistureTrend = [
    { month: 'Jul', baseline: 0.38, observed: 0.36, forecast: null },
    { month: 'Aug', baseline: 0.35, observed: 0.31, forecast: null },
    { month: 'Sep', baseline: 0.32, observed: 0.24, forecast: null },
    { month: 'Oct (Current)', baseline: 0.29, observed: 0.14, forecast: 0.14 },
    { month: 'Nov (Pred)', baseline: 0.28, observed: null, forecast: 0.11 },
    { month: 'Dec (Pred)', baseline: 0.34, observed: null, forecast: 0.18 },
    { month: 'Jan (Pred)', baseline: 0.42, observed: null, forecast: 0.32 },
  ];

  return (
    <div className="relative z-20 flex-1 w-full h-[calc(100vh-60px)] overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#080C0E]/90 backdrop-blur-md">
      {/* Top Header & Field Selector Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded bg-blue-950 border border-blue-500/40 text-blue-400">
              <Droplets className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-wide font-mono uppercase">
              NASA Earth Observation — Soil Moisture Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Root-zone & surface soil moisture modeling benchmarked against NASA SMAP, GPM IMERG, and 30-year climatological baselines.
          </p>
        </div>

        {/* Field Selector */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1">
          <span className="text-xs text-slate-400 font-mono mr-1 hidden sm:inline flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Select Field:
          </span>
          {Object.keys(fieldMoistureData).map((sec) => (
            <button
              key={sec}
              onClick={() => onSelectField(sec)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center space-x-1.5 ${
                activeFarm.sector === sec
                  ? 'bg-gisGreen-950 text-emerald-300 border border-gisGreen-500/50 shadow-md font-semibold'
                  : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              <span>{sec}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded border ${fieldMoistureData[sec].statusColor}`}>
                {fieldMoistureData[sec].status.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Top Telemetry Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Surface Soil Moisture Tile */}
        <div className="glass-hud p-4 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-blue-400">
            <span className="uppercase font-semibold">Surface Soil Moisture (0–5cm)</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-white">{currentData.surfaceMoisture}</span>
            <span className="text-xs text-red-400 font-mono flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" /> -38%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            SMAP L3 Passive Radiometer Telemetry
          </div>
        </div>

        {/* Root-Zone Soil Moisture Tile */}
        <div className="glass-hud p-4 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
            <span className="uppercase font-semibold">Root-Zone Moisture (0–100cm)</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-white">{currentData.rootZoneMoisture}</span>
            <span className="text-xs text-amber-400 font-mono">
              Wilting: {currentData.wiltingPoint}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            SMAP L4 Carbon/Hydrology Model
          </div>
        </div>

        {/* Available Water Capacity Tile */}
        <div className="glass-hud p-4 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-amber-400">
            <span className="uppercase font-semibold">Available Field Capacity</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-amber-300">{currentData.fieldCapacityPct}</span>
            <span className="text-xs text-red-400 font-mono">
              Depletion: {currentData.depletionRate}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Time to Wilting Threshold: <span className="text-red-400 font-bold">{currentData.daysToWilting}</span>
          </div>
        </div>

        {/* Status Badge Tile */}
        <div className="glass-hud p-4 rounded-xl border border-white/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="uppercase font-semibold">Field Moisture Status</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className={`inline-block text-xs font-mono font-bold px-2.5 py-1 rounded border ${currentData.statusColor}`}>
              {currentData.status}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Soil: {currentData.soilType}
          </div>
        </div>
      </div>

      {/* Main Grid: Trend Chart (Left 7 cols) + Drought Stress Indices (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Moisture Depletion Graph (7 cols) */}
        <div className="lg:col-span-7 glass-hud p-5 rounded-xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div>
              <h2 className="text-sm font-bold font-mono text-white uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Soil Moisture Trend & 3-4 Week Predictive Forecast
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Root-zone moisture curve ($m^3/m^3$) benchmarked against 30-year NASA climatological norm.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/40">
              {activeFarm.sector} Data
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moistureTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="baselineColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="observedColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="forecastColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.5} />
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
                <Area type="monotone" dataKey="baseline" name="30-Year Baseline (NASA SMAP)" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#baselineColor)" />
                <Area type="monotone" dataKey="observed" name="2026 Observed Telemetry" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#observedColor)" />
                <Area type="monotone" dataKey="forecast" name="3-4 Wk Predictive Forecast" stroke="#EF4444" strokeDasharray="4 4" strokeWidth={2.5} fillOpacity={1} fill="url(#forecastColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Multi-Sensor Water Stress Indicators (5 cols) */}
        <div className="lg:col-span-5 glass-hud p-5 rounded-xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h2 className="text-sm font-bold font-mono text-white uppercase flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Multi-Sensor Water Stress Indicators
            </h2>
            <span className="text-[11px] font-mono text-slate-400">NASA Earth Data</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#11171D] border border-white/10 space-y-1">
              <div className="flex justify-between text-blue-400 font-semibold">
                <span>SMAP Root Moisture Anomaly:</span>
                <span className="text-red-400 font-bold">-32% Baseline Gap</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Root-zone soil moisture is 32% below the 30-year climatological mean for Mato Grosso.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#11171D] border border-white/10 space-y-1">
              <div className="flex justify-between text-cyan-400 font-semibold">
                <span>GPM IMERG Rain Deficit:</span>
                <span className="text-amber-400 font-bold">-73 mm Shortfall</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Cumulative precipitation over past 30 days is 42mm vs 115mm historical average.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#11171D] border border-white/10 space-y-1">
              <div className="flex justify-between text-amber-400 font-semibold">
                <span>ECOSTRESS Canopy Evaporative Stress:</span>
                <span className="text-amber-300 font-bold">0.78 ESI Index</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Thermal infrared satellite sensors detect elevated crop canopy temperatures.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#11171D] border border-white/10 space-y-1">
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Landsat 9 NDVI Canopy Score:</span>
                <span className="text-emerald-300 font-bold">0.42 (Mild Stress)</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Optical vegetation health index indicates early stomatal closure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Useful Agricultural Interpretation & Recommendation Section */}
      <div className="glass-hud p-6 rounded-xl border border-white/10 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gisGreen-950 border border-gisGreen-500/40 text-emerald-400">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide font-mono uppercase">
                Agricultural Interpretation & Moisture Management Recommendations
              </h2>
              <p className="text-xs text-slate-400">
                Actionable agronomic advice generated from NASA satellite soil telemetry for {activeFarm.sector}.
              </p>
            </div>
          </div>

          <button
            onClick={onExportReport}
            className="px-3.5 py-1.5 bg-gisGreen-600/30 hover:bg-gisGreen-600/50 text-emerald-300 text-xs font-mono rounded border border-gisGreen-500/40 transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Field Moisture Report</span>
          </button>
        </div>

        {/* Plain-Language Farmer Interpretation Callout */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-950/40 via-obsidian to-emerald-950/40 border border-blue-500/30 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-300 font-bold uppercase">
            <Info className="w-4 h-4 text-blue-400" />
            <span>Farmer Decision Support Summary ({activeFarm.sector})</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            The root-zone soil layer (0–100 cm) in <span className="font-bold text-white font-mono">{activeFarm.sector}</span> is drying at a rate of <span className="text-amber-300 font-mono font-bold">{currentData.depletionRate}</span> due to low GPM rainfall (42 mm) and high solar insolation (6.8 kWh/m²). Your current <span className="text-emerald-300 font-mono font-semibold">{activeFarm.crop}</span> crop is entering its peak water requirement stage. Permanent crop wilting is projected in <span className="text-red-400 font-bold font-mono">{currentData.daysToWilting}</span> unless moisture management actions are taken immediately.
          </p>
        </div>

        {/* Actionable Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Action 1: Regulated Deficit Irrigation */}
          <div className="p-4 rounded-lg bg-[#11171D] border border-white/10 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-cyan-400 font-mono font-semibold">
                <Droplets className="w-4 h-4" />
                <span>1. Regulated Deficit Irrigation (RDI)</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-snug">
                Apply a targeted 25 mm drip irrigation cycle within 5 days to recharge the 0–50cm root zone during flowering.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-400">
              <span>Water Saving: +22% Yield Protection</span>
            </div>
          </div>

          {/* Action 2: Crop Residue Cover & Mulching */}
          <div className="p-4 rounded-lg bg-[#11171D] border border-white/10 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono font-semibold">
                <Sprout className="w-4 h-4" />
                <span>2. Soil Residue Cover & Mulching</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-snug">
                Maintain at least 70% straw cover over exposed soil to suppress surface evaporative moisture loss by up to 35%.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-400">
              <span>Moisture Retention: +1.2 m³/m³</span>
            </div>
          </div>

          {/* Action 3: Adaptive Rotation Shift */}
          <div className="p-4 rounded-lg bg-[#11171D] border border-white/10 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-amber-400 font-mono font-semibold">
                <Calendar className="w-4 h-4" />
                <span>3. Adaptive Rotation Shift</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-snug">
                Transition next rotation cycle from Soybeans to drought-tolerant Grain Sorghum (BRS 330) to reduce seasonal water demand by 45%.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-400">
              <span>Resilience Index: 92%</span>
            </div>
          </div>
        </div>

        {/* Execution Trigger Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              setActionDone(true);
              onApplyPlan({ name: 'Grain Sorghum (BRS 330)' });
              setTimeout(() => setActionDone(false), 2500);
            }}
            className="px-5 py-2.5 bg-gisGreen-500 hover:bg-gisGreen-600 text-obsidian font-bold text-xs font-mono rounded-lg shadow-lg transition-all flex items-center space-x-2"
          >
            {actionDone ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Recommended Moisture Plan Executed!</span>
              </>
            ) : (
              <>
                <span>Execute Moisture Action Plan for {activeFarm.sector}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
