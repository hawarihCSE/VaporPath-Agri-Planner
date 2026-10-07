import React, { useState } from 'react';
import { Search, MapPin, Layers, BarChart2, RefreshCw, AlertTriangle, Download, ShieldCheck, Droplets } from 'lucide-react';

export default function TopNav({ activeTab, setActiveTab, activeFarm, onSearchSubmit, onExportReport }) {
  const [searchQuery, setSearchQuery] = useState('Mato Grosso, Brazil');

  return (
    <header className="relative z-30 flex items-center justify-between px-6 py-3.5 border-b border-white/[0.07] bg-obsidian/85 backdrop-blur-md">
      {/* Brand & Regional Hierarchy */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('selection')}>
          <div className="w-2.5 h-2.5 rounded-sm bg-gisGreen-500 shadow-[0_0_8px_#10B981]"></div>
          <span className="text-sm font-bold tracking-wider text-slate-100 uppercase font-mono">
            VAPORPATH <span className="text-emerald-400 font-semibold">GIS</span>
          </span>
        </div>
        <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
        {/* Breadcrumb Context */}
        <div className="hidden md:flex flex-col text-xs leading-tight">
          <span className="text-slate-200 font-medium tracking-tight flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gisGreen-400 inline" /> {activeFarm.location}
          </span>
          <span className="text-gisGreen-400 font-mono text-[11px]">
            {activeFarm.name} • {activeFarm.sector}
          </span>
        </div>
      </div>

      {/* Center Floating Geo-Search Pill */}
      <div className="flex-1 max-w-lg mx-6 hidden lg:block">
        <form onSubmit={(e) => { e.preventDefault(); onSearchSubmit(searchQuery); }} className="relative flex items-center w-full">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#13191E]/90 hover:bg-[#182026] text-xs text-slate-200 rounded-full pl-10 pr-28 py-2 border border-white/10 focus:outline-none focus:border-gisGreen-500 transition-colors shadow-inner"
            placeholder="Search Location or Coordinates..."
          />
          <span className="absolute right-3 text-[10px] font-mono text-emerald-400/80 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            {activeFarm.coordinates}
          </span>
        </form>
      </div>

      {/* System Primary Navigation Tabs */}
      <div className="flex items-center space-x-2">
        <nav className="flex items-center space-x-1 sm:space-x-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('selection')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'selection'
                ? 'text-white bg-white/[0.08] border border-white/10 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>GIS Map</span>
          </button>

          <button
            onClick={() => setActiveTab('gis-dashboard')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'gis-dashboard'
                ? 'text-white bg-gisGreen-950/80 border border-gisGreen-500/50 text-emerald-300 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'gis-dashboard' ? 'bg-gisGreen-400 animate-pulse' : 'bg-slate-500'}`}></span>
            <span className="font-semibold">GIS Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('moisture')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'moisture'
                ? 'text-white bg-blue-950/80 border border-blue-500/50 text-blue-300 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>Soil Moisture</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'dashboard'
                ? 'text-white bg-white/[0.08] border border-white/10 font-semibold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>NASA Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('rotation')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'rotation'
                ? 'text-white bg-white/[0.08] border border-white/10 font-semibold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Crop Rotation</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'alerts'
                ? 'text-white bg-white/[0.08] border border-white/10 font-semibold text-amber-300'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Early Warnings</span>
            <span className="ml-1 bg-amber-500/20 text-amber-300 text-[10px] font-mono px-1.5 py-0.2 rounded-full border border-amber-500/40">3</span>
          </button>
        </nav>

        {/* Action Button */}
        <button
          onClick={onExportReport}
          className="ml-2 hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-gisGreen-600/30 hover:bg-gisGreen-600/50 text-emerald-300 text-xs font-mono font-medium rounded-md border border-gisGreen-500/40 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Report</span>
        </button>
      </div>
    </header>
  );
}
