import React from 'react';
import { Shield, Sprout, Map, Activity, RefreshCw } from 'lucide-react';

export default function FarmDetailsHUD({ activeFarm, onOpenAnalytics, onOpenRotation }) {
  return (
    <div className="flex justify-end w-full">
      <div className="pointer-events-auto w-72 sm:w-80 glass-hud rounded-lg p-5 shadow-2xl space-y-4 border border-white/10">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Farm Details</span>
          </h2>
          <span className="text-[10px] font-mono text-gisGreen-400 uppercase tracking-widest bg-gisGreen-950/80 px-2 py-0.5 rounded border border-gisGreen-800/50">
            ACTIVE
          </span>
        </div>

        {/* Metric Details List */}
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-baseline">
            <span className="text-slate-400">ID:</span>
            <span className="font-mono text-slate-100 font-medium">{activeFarm.id}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-slate-400">Owner:</span>
            <span className="text-slate-100 font-medium truncate max-w-[170px] text-right">{activeFarm.owner}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-slate-400">Area:</span>
            <span className="font-mono font-semibold text-white">
              {activeFarm.area} <span className="text-slate-400 text-[11px] font-normal">({activeFarm.grossArea})</span>
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-slate-400">Crop:</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5" /> {activeFarm.crop}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-slate-400">Elevation:</span>
            <span className="font-mono text-slate-100">{activeFarm.elevation}</span>
          </div>
        </div>

        {/* Boundary Update Metrics */}
        <div className="pt-2 border-t border-white/[0.08]">
          <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1.5">
            <span>Boundaries:</span>
            <span className="text-[10px] text-slate-400 font-mono">(Updated 12 Nov 2023)</span>
          </div>
          <div className="font-mono text-xs font-semibold text-gisGreen-400 tracking-tight flex items-center justify-between bg-gisGreen-950/30 px-2.5 py-1.5 rounded border border-gisGreen-500/20">
            <span>{activeFarm.area}</span>
            <span className="text-gisGreen-500/70 text-[11px]">• {activeFarm.grossArea} Tot</span>
          </div>
        </div>

        {/* Quick Action Trigger Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onOpenAnalytics}
            className="flex items-center justify-center space-x-1.5 py-2 px-2 bg-white/[0.06] hover:bg-white/10 text-slate-200 text-[11px] font-medium rounded border border-white/10 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>NASA Metrics</span>
          </button>
          <button
            onClick={onOpenRotation}
            className="flex items-center justify-center space-x-1.5 py-2 px-2 bg-gisGreen-950/60 hover:bg-gisGreen-900/80 text-emerald-300 text-[11px] font-medium rounded border border-gisGreen-500/30 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Crop Rotation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
