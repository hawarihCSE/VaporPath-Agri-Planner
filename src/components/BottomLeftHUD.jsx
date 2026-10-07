import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function BottomLeftHUD({ activeFarm, onOpenAlerts }) {
  return (
    <div
      onClick={onOpenAlerts}
      className="pointer-events-auto glass-hud px-4 py-2.5 rounded-md flex items-center space-x-3 text-xs shadow-lg cursor-pointer hover:border-emerald-500/40 transition-colors"
      title="Click to view Early Warning Predictive Alerts"
    >
      <div className="w-2 h-2 rounded-full bg-gisGreen-500 animate-pulse"></div>
      <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-300">
        <span className="text-slate-400 font-sans">Selected Field:</span>
        <span className="text-white font-medium">{activeFarm.sector}</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400 font-sans">Area:</span>
        <span className="text-emerald-400">{activeFarm.area}</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400 font-sans">Elevation:</span>
        <span className="text-slate-200">{activeFarm.elevation}</span>
        <span className="text-slate-600">|</span>
        <span className="text-amber-400 font-sans flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-amber-400 inline" /> Drought Risk: 74/100
        </span>
      </div>
    </div>
  );
}
