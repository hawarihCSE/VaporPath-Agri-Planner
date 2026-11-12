import React, { useState } from 'react';
import { X, RefreshCw, Sprout, ShieldAlert, CheckCircle2, ArrowRight, Droplets, Leaf } from 'lucide-react';

export default function CropRotationPlanner({ onClose, activeFarm, onApplyPlan }) {
  const [selectedCrop, setSelectedCrop] = useState('sorghum');
  const [planApplied, setPlanApplied] = useState(false);

  const options = [
    {
      id: 'sorghum',
      name: 'Grain Sorghum (BRS 330)',
      waterSavings: '45% less water required',
      yieldResilience: '92% Resilience Index',
      duration: '95–105 days',
      benefit: 'Deep root structure penetrates hard soil layers and extracts sub-surface moisture.',
      recommended: true,
      color: 'border-emerald-500 bg-emerald-950/20'
    },
    {
      id: 'millet',
      name: 'Pearl Millet (ADR 300)',
      waterSavings: '60% less water required',
      yieldResilience: '95% Resilience Index',
      duration: '80–90 days',
      benefit: 'Extreme drought tolerance; excellent biomass cover for moisture conservation.',
      recommended: false,
      color: 'border-blue-500/50 bg-blue-950/20'
    },
    {
      id: 'cowpea',
      name: 'Resilient Cowpea (BRS Guariba)',
      waterSavings: '50% less water required',
      yieldResilience: '88% Resilience Index',
      duration: '70–80 days',
      benefit: 'Fixes atmospheric nitrogen into soil while requiring minimal rainfall.',
      recommended: false,
      color: 'border-amber-500/50 bg-amber-950/20'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[90vh] glass-modal rounded-xl shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-obsidian/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gisGreen-950 border border-gisGreen-500/30 text-emerald-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide font-mono uppercase">
                Adaptive Crop Rotation Engine
              </h2>
              <p className="text-xs text-slate-400">
                Calibrated to Projected Water Availability • {activeFarm.name} ({activeFarm.sector})
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
          {/* Current vs Projected Water Shortfall */}
          <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <ShieldAlert className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <div className="text-xs font-mono font-semibold text-amber-300 uppercase">
                  Water Deficit Forecast Warning
                </div>
                <div className="text-xs text-slate-300">
                  Continued Soy cultivation during the upcoming 3–4 week drought window carries a <span className="text-red-400 font-semibold font-mono">68% yield loss risk</span>.
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 font-mono text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded border border-emerald-800/40">
              SMAP Projected Soil Water: <span className="font-bold">0.11 m³/m³</span>
            </div>
          </div>

          {/* Rotation Recommendations Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-slate-300 uppercase font-semibold">
              Select Resilient Crop Option for Next Cycle:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedCrop(opt.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all flex flex-col justify-between space-y-3 relative ${
                    selectedCrop === opt.id
                      ? 'border-gisGreen-400 bg-gisGreen-950/40 ring-1 ring-gisGreen-400 shadow-lg'
                      : `${opt.color} hover:border-slate-400`
                  }`}
                >
                  {opt.recommended && (
                    <span className="absolute -top-2.5 right-3 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500 text-obsidian shadow">
                      RECOMMENDED
                    </span>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Sprout className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-sm font-semibold text-white font-mono">{opt.name}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-snug pt-1">{opt.benefit}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono">
                    <div className="flex items-center justify-between text-emerald-300">
                      <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> Water Saved:</span>
                      <span className="font-bold">{opt.waterSavings.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-200">
                      <span className="flex items-center gap-1"><Leaf className="w-3 h-3" /> Yield Score:</span>
                      <span className="font-bold">{opt.yieldResilience.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Cycle:</span>
                      <span>{opt.duration}</span>
                    </div>
                  </div>

                  {selectedCrop === opt.id && (
                    <div className="flex items-center justify-center space-x-1 text-xs font-mono text-emerald-400 pt-1 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>SELECTED FOR PLAN</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Plan Comparison Breakdown */}
          <div className="p-4 rounded-lg bg-[#11171D] border border-white/10 space-y-2">
            <h4 className="text-xs font-mono text-slate-300 uppercase font-semibold">
              Rotation Impact Summary ({activeFarm.area})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-white/[0.03] rounded border border-white/5">
                <div className="text-slate-400 text-[10px]">Est. Water Saved</div>
                <div className="text-emerald-400 text-sm font-bold">189,220 m³</div>
              </div>
              <div className="p-2.5 bg-white/[0.03] rounded border border-white/5">
                <div className="text-slate-400 text-[10px]">Sub-surface Root Depth</div>
                <div className="text-blue-400 text-sm font-bold">1.8 meters</div>
              </div>
              <div className="p-2.5 bg-white/[0.03] rounded border border-white/5">
                <div className="text-slate-400 text-[10px]">Soil Nitrogen Boost</div>
                <div className="text-amber-300 text-sm font-bold">+28 kg/ha</div>
              </div>
              <div className="p-2.5 bg-white/[0.03] rounded border border-white/5">
                <div className="text-slate-400 text-[10px]">Protected Revenue</div>
                <div className="text-white text-sm font-bold">$142,500 EST</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-obsidian flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>Optimized via NASA ECOSTRESS ESI & SMAP Algorithms</span>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-slate-400 hover:text-white rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setPlanApplied(true);
                onApplyPlan(options.find(o => o.id === selectedCrop));
                setTimeout(() => onClose(), 1200);
              }}
              className="px-4 py-1.5 bg-gisGreen-500 hover:bg-gisGreen-600 text-obsidian font-bold rounded shadow transition-all flex items-center space-x-1.5"
            >
              {planApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Plan Applied!</span>
                </>
              ) : (
                <>
                  <span>Apply Rotation Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
