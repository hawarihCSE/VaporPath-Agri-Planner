import React, { useState } from 'react';
import { X, AlertTriangle, AlertCircle, CheckCircle, Bell, Download, ShieldCheck, Calendar, ArrowUpRight } from 'lucide-react';

export default function EarlyWarningAlerts({ onClose, activeFarm, onExportReport }) {
  const [downloading, setDownloading] = useState(false);

  const alerts = [
    {
      id: 1,
      severity: 'critical',
      title: '3–4 Week Early Warning: Severe Root-Zone Drought Forecast',
      time: 'Predicted Oct 28 – Nov 18, 2026',
      source: 'NASA SMAP & GPM Integrated Anomaly Model',
      description: 'Root-zone soil moisture is projected to drop below critical threshold (0.12 m³/m³). High risk of irreversible canopy wilting for un-irrigated Soybeans.',
      action: 'Implement regulated deficit irrigation immediately or initiate crop shift to Grain Sorghum.'
    },
    {
      id: 2,
      severity: 'warning',
      title: 'ECOSTRESS Evaporative Stress Index Surge',
      time: 'Updated 4 hours ago',
      source: 'ECOSTRESS Thermal Infrared Telemetry',
      description: 'Canopy temperature in Sector 04-B elevated by 3.2°C compared to 30-year regional norm. Stomatal closure detected.',
      action: 'Schedule overhead misting or shade-cloth deployment where applicable.'
    },
    {
      id: 3,
      severity: 'info',
      title: 'GPM IMERG Precipitation Deficit Milestone',
      time: 'Cumulative 30-Day Window',
      source: 'NASA GPM Satellite Constellation',
      description: 'Sector 04-B has received only 36% of historical average precipitation over the past month (42mm vs 115mm baseline).',
      action: 'Log water storage reservoir levels with cooperative managers.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[90vh] glass-modal rounded-xl shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-obsidian/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide font-mono uppercase flex items-center gap-2">
                Early Warning System & Alerts
              </h2>
              <p className="text-xs text-slate-400">
                Predictive Risk Engine • {activeFarm.name} ({activeFarm.sector})
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
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Banner */}
          <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div className="text-xs">
                <span className="font-mono font-bold text-emerald-300 uppercase">3-4 Week Early Warning Lead Time Active</span>
                <p className="text-slate-300">You have <span className="font-bold text-white font-mono">21 days</span> to take preventative action before visible crop wilt occurs.</p>
              </div>
            </div>
            <button
              onClick={() => {
                setDownloading(true);
                onExportReport();
                setTimeout(() => setDownloading(false), 1500);
              }}
              className="px-3 py-1.5 bg-gisGreen-600/40 hover:bg-gisGreen-600/60 text-emerald-300 text-xs font-mono font-semibold rounded border border-gisGreen-500/40 transition-colors flex items-center space-x-1.5 flex-shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Generating PDF...' : 'Download PDF Summary'}</span>
            </button>
          </div>

          {/* Alerts Feed */}
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border space-y-2.5 transition-all ${
                  alert.severity === 'critical'
                    ? 'bg-red-950/20 border-red-500/40'
                    : alert.severity === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-blue-950/20 border-blue-500/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {alert.severity === 'critical' ? (
                      <AlertOctagonIcon className="w-4 h-4 text-red-400" />
                    ) : alert.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-blue-400" />
                    )}
                    <h3 className="text-sm font-semibold text-white font-mono">{alert.title}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      alert.severity === 'critical'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : alert.severity === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>

                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
                  <div className="text-emerald-400 flex items-center space-x-1">
                    <span className="text-slate-400 font-sans">Recommended Mitigation:</span>
                    <span>{alert.action}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 flex-shrink-0">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-obsidian flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>Early Warning Alert Feed • NASA Space Apps Challenge 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded transition-colors"
          >
            Dismiss Alerts
          </button>
        </div>
      </div>
    </div>
  );
}

function AlertOctagonIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
