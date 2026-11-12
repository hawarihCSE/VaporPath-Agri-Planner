// VaporPath // Agri-Planner GIS & Godot Simulation Unified Frontend Bundle
(function () {
  'use strict';

  const SIMULATIONS_LIST = [
    {
      id: 'vaporpath-sim',
      title: 'VaporPath Agri-Planner (Full 7-Screen Simulation)',
      badge: 'GODOT 4.x // LIVE NASA POWER',
      category: 'Full Interactive Campaign',
      path: 'simulations/vaporpath-sim/index.html',
      description:
        'Complete 7-screen interactive agricultural simulation: choose your South American farming region, fetch live NASA POWER (GWETROOT & PRECTOTCORR) telemetry, trace Amazon Flying Rivers, select drought-resilient crops, and activate precision irrigation.',
      metrics: ['7 Interactive Screens', 'Live NASA POWER API', '65% Max Water Saved']
    },
    {
      id: 'moisture-journey',
      title: 'Continental Moisture Journey (Flying Rivers)',
      badge: 'STAGE 4 MODULE // VAPOR FLOW',
      category: 'Atmospheric Telemetry Sim',
      path: 'simulations/moisture-journey/index.html',
      description:
        'Interactive 4-stage visualization of upwind Amazon canopy evapotranspiration, high-altitude Flying Rivers vapor transport, condensation, and regional farm soil moisture deficits.',
      metrics: ['4-Stage State Machine', 'Particle Vapor Conduit', 'Play / Pause / Replay']
    },
    {
      id: 'irrigation-lab',
      title: 'Smart Water Plan — Irrigation Control Lab',
      badge: 'STAGE 6 MODULE // ROOT CUTAWAY',
      category: 'Sub-Surface Physics Sim',
      path: 'simulations/irrigation-lab/index.html',
      description:
        'Close-up subterranean root-zone cutaway simulation comparing Precision Smart Drip emitters (-50% water) against Rotary Micro-Sprinkler rigs (-30% water) across Sorghum, Millet, Cowpea, and Soybean.',
      metrics: ['Root Cross-Section', 'Dual Machine Units', 'Real-Time Moisture Rings']
    }
  ];

  const FARM_SECTORS = {
    'Sector 04-B': {
      id: 'MT-0742-SM',
      name: 'Farm 742: São Miguel',
      sector: 'Sector 04-B',
      location: 'Mato Grosso, Brazil',
      coordinates: "12°33'S, 55°42'W",
      owner: 'AgroLíder Ltda.',
      area: '420.50 ha',
      grossArea: '1,420 Ha gross',
      crop: 'Soy (2023/24)',
      elevation: '380m AMSL',
      stressLevel: 'Severe',
      smap: '0.14 m³/m³',
      rainDeficit: '-73 mm',
      esi: '0.78',
      ndvi: '0.42'
    },
    'Sector 02-A': {
      id: 'MT-0742-SA',
      name: 'Farm 742: São Miguel',
      sector: 'Sector 02-A',
      location: 'Mato Grosso, Brazil',
      coordinates: "12°31'S, 55°40'W",
      owner: 'AgroLíder Ltda.',
      area: '310.00 ha',
      grossArea: '1,420 Ha gross',
      crop: 'Soy (2023/24)',
      elevation: '395m AMSL',
      stressLevel: 'Moderate',
      smap: '0.22 m³/m³',
      rainDeficit: '-41 mm',
      esi: '0.62',
      ndvi: '0.58'
    },
    'Sector 01-C': {
      id: 'MT-0742-SC',
      name: 'Farm 742: São Miguel',
      sector: 'Sector 01-C',
      location: 'Mato Grosso, Brazil',
      coordinates: "12°29'S, 55°38'W",
      owner: 'AgroLíder Ltda.',
      area: '280.00 ha',
      grossArea: '1,420 Ha gross',
      crop: 'Corn (2nd Crop)',
      elevation: '410m AMSL',
      stressLevel: 'Low Stress',
      smap: '0.31 m³/m³',
      rainDeficit: '-12 mm',
      esi: '0.38',
      ndvi: '0.74'
    },
    'Sector 03-D': {
      id: 'MT-0742-SD',
      name: 'Farm 742: São Miguel',
      sector: 'Sector 03-D',
      location: 'Mato Grosso, Brazil',
      coordinates: "12°35'S, 55°45'W",
      owner: 'AgroLíder Ltda.',
      area: '195.00 ha',
      grossArea: '1,420 Ha gross',
      crop: 'Cover Crop / Millet',
      elevation: '375m AMSL',
      stressLevel: 'Optimal',
      smap: '0.36 m³/m³',
      rainDeficit: '+5 mm',
      esi: '0.24',
      ndvi: '0.81'
    }
  };

  const state = {
    activeTab: 'selection', // 'selection' | 'gis-dashboard' | 'moisture' | 'dashboard' | 'rotation' | 'alerts' | 'simulations'
    selectedLayer: 'base',
    zoomLevel: 14,
    showLayerMenu: false,
    activeSector: 'Sector 04-B',
    selectedCrop: 'sorghum',
    activeSim: null,
    toastMessage: null
  };

  function getActiveFarm() {
    return FARM_SECTORS[state.activeSector] || FARM_SECTORS['Sector 04-B'];
  }

  function showToast(msg) {
    state.toastMessage = msg;
    renderApp();
    setTimeout(() => {
      if (state.toastMessage === msg) {
        state.toastMessage = null;
        renderApp();
      }
    }, 3200);
  }

  // Unload active simulation iframe to release WASM memory
  function unloadSimulationIframe() {
    const existingIframe = document.getElementById('godot-sim-iframe');
    if (existingIframe) {
      existingIframe.src = 'about:blank';
    }
  }

  window.vpSetTab = function (tab) {
    if (state.activeTab === 'simulations' && tab !== 'simulations') {
      unloadSimulationIframe();
      state.activeSim = null;
    }
    state.activeTab = tab;
    renderApp();
  };

  window.vpSelectSector = function (sector) {
    if (FARM_SECTORS[sector]) {
      state.activeSector = sector;
      showToast(`Switched active parcel to ${sector} (${FARM_SECTORS[sector].area})`);
    }
  };

  window.vpSetLayer = function (layerId) {
    state.selectedLayer = layerId;
    state.showLayerMenu = false;
    renderApp();
  };

  window.vpToggleLayerMenu = function () {
    state.showLayerMenu = !state.showLayerMenu;
    renderApp();
  };

  window.vpZoom = function (delta) {
    state.zoomLevel = Math.max(12, Math.min(18, state.zoomLevel + delta));
    renderApp();
  };

  window.vpSelectCrop = function (cropId) {
    state.selectedCrop = cropId;
    renderApp();
  };

  window.vpApplyCropPlan = function () {
    const names = {
      sorghum: 'Grain Sorghum (BRS 330)',
      millet: 'Pearl Millet (ADR 300)',
      cowpea: 'Resilient Cowpea (BRS Guariba)'
    };
    const chosen = names[state.selectedCrop] || names.sorghum;
    FARM_SECTORS[state.activeSector].crop = `${chosen} (Planned)`;
    showToast(`Applied ${chosen} rotation plan to ${state.activeSector}`);
  };

  window.vpExportReport = function () {
    const farm = getActiveFarm();
    if (typeof window.downloadVaporPathPdf === "function") {
      window.downloadVaporPathPdf({
        filename: `VaporPath_${farm.id || "L4"}_Observation_Report.pdf`,
        sector: `${farm.sector} (${farm.region})`,
        coords: farm.coordinates,
        farmId: farm.id,
        crop: farm.crop
      });
    }
    showToast(`Downloaded NASA VaporPath PDF Report (${farm.id})`);
  };

  window.vpLaunchSimulation = function (simId) {
    const sim = SIMULATIONS_LIST.find((s) => s.id === simId) || SIMULATIONS_LIST[0];
    unloadSimulationIframe();
    state.activeTab = 'simulations';
    state.activeSim = null;
    renderApp();
    setTimeout(() => {
      state.activeSim = sim;
      renderApp();
    }, 25);
  };

  window.vpCloseSimModal = function () {
    unloadSimulationIframe();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    state.activeSim = null;
    renderApp();
  };

  window.vpToggleSimFullscreen = function () {
    const container = document.getElementById('godot-sim-modal-box');
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  function renderTopNav(farm) {
    const navBtn = (id, label, iconHtml, badgeHtml = '') => {
      const isActive = state.activeTab === id;
      const cls = isActive
        ? 'text-white bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 shadow-sm font-semibold'
        : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent';
      return `<button onclick="vpSetTab('${id}')" class="px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 text-xs ${cls}">
        ${iconHtml}
        <span>${label}</span>
        ${badgeHtml}
      </button>`;
    };

    return `
      <header class="relative z-30 flex items-center justify-between px-6 py-3.5 border-b border-white/[0.07] bg-[#090D10]/90 backdrop-blur-md">
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-2.5 cursor-pointer" onclick="vpSetTab('selection')">
            <div class="w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-[0_0_8px_#10B981]"></div>
            <span class="text-sm font-bold tracking-wider text-slate-100 uppercase font-mono">
              VAPORPATH <span class="text-emerald-400 font-semibold">GIS</span>
            </span>
          </div>
          <div class="h-4 w-px bg-white/10 hidden sm:block"></div>
          <div class="hidden md:flex flex-col text-xs leading-tight">
            <span class="text-slate-200 font-medium tracking-tight">📍 ${farm.location}</span>
            <span class="text-emerald-400 font-mono text-[11px]">${farm.name} • ${farm.sector}</span>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <nav class="flex items-center flex-wrap gap-1 sm:gap-1.5 text-xs font-medium">
            ${navBtn('selection', 'GIS Map', '<span>🗺️</span>')}
            ${navBtn('gis-dashboard', 'GIS Dashboard', '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>')}
            ${navBtn('moisture', 'Soil Moisture', '<span>💧</span>')}
            ${navBtn('dashboard', 'NASA Metrics', '<span>📊</span>')}
            ${navBtn('rotation', 'Crop Rotation', '<span>🔄</span>')}
            ${navBtn('alerts', 'Early Warnings', '<span>⚠️</span>', '<span class="ml-1 bg-amber-500/20 text-amber-300 text-[10px] font-mono px-1.5 rounded-full border border-amber-500/40">3</span>')}
            ${navBtn('simulations', 'Simulations', '<span>🎮</span>', '<span class="ml-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-1.5 rounded-full border border-emerald-500/40">GODOT</span>')}
          </nav>

          <a href="observation.html" class="hidden xl:flex items-center space-x-1 px-2.5 py-1.5 bg-white/[0.05] hover:bg-white/10 text-slate-300 text-xs font-mono rounded-md border border-white/10 transition-colors">
            <span>🛰️ L4 View</span>
          </a>

          <button onclick="vpExportReport()" class="ml-1 hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-mono font-medium rounded-md border border-emerald-500/40 transition-colors">
            <span>⬇ Export Report</span>
          </button>
        </div>
      </header>
    `;
  }

  function renderSatelliteMapAndHUD(farm) {
    const scale = 1 + (state.zoomLevel - 14) * 0.08;
    return `
      <main class="absolute inset-0 w-full h-full overflow-hidden">
        <img
          alt="Satellite Earth Imagery of Mato Grosso agricultural parcels"
          class="w-full h-full object-cover object-center transition-transform duration-500 filter brightness-[0.92] contrast-[1.08]"
          style="transform: scale(${scale})"
          src="assests/backgrounds/Country line.jpg"
        />
        <div class="absolute inset-0 bg-[#071318]/55 pointer-events-none"></div>
        <div class="absolute inset-0 pointer-events-none gis-backdrop"></div>

        <!-- SVG Interactive Parcel Polygons -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1920 1080">
          <g class="cursor-pointer pointer-events-auto" onclick="vpSelectSector('Sector 04-B')">
            <polygon points="854,302 884,332 948,390 1082,465 1038,760 832,886 818,790 686,540 820,440"
              fill="#10B981" fill-opacity="${farm.sector === 'Sector 04-B' ? '0.26' : '0.10'}"
              stroke="#10B981" stroke-width="${farm.sector === 'Sector 04-B' ? '3' : '1.5'}" />
            <text x="860" y="590" fill="#6EE7B7" font-family="JetBrains Mono, monospace" font-size="15" font-weight="bold">SECTOR 04-B (420.5 ha)</text>
          </g>
          <g class="cursor-pointer pointer-events-auto" onclick="vpSelectSector('Sector 02-A')">
            <polygon points="550,260 810,290 800,430 660,520 510,410"
              fill="#38BDF8" fill-opacity="${farm.sector === 'Sector 02-A' ? '0.26' : '0.10'}"
              stroke="#38BDF8" stroke-width="${farm.sector === 'Sector 02-A' ? '3' : '1.5'}" />
            <text x="610" y="390" fill="#BAE6FD" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold">SECTOR 02-A (310 ha)</text>
          </g>
          <g class="cursor-pointer pointer-events-auto" onclick="vpSelectSector('Sector 01-C')">
            <polygon points="1095,450 1330,510 1290,770 1055,745"
              fill="#F59E0B" fill-opacity="${farm.sector === 'Sector 01-C' ? '0.26' : '0.10'}"
              stroke="#F59E0B" stroke-width="${farm.sector === 'Sector 01-C' ? '3' : '1.5'}" />
            <text x="1115" y="620" fill="#FDE68A" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold">SECTOR 01-C (280 ha)</text>
          </g>
        </svg>
      </main>

      <!-- HUD Overlay -->
      <div class="relative z-20 flex-1 pointer-events-none p-5 sm:p-6 flex flex-col justify-between">
        <div class="flex justify-between items-start w-full">
          <!-- Left Layer Switcher -->
          <div class="pointer-events-auto glass-hud rounded-lg p-3 space-y-2 border border-white/10">
            <div class="text-[10px] font-mono uppercase text-slate-400 font-semibold">NASA Telemetry Layers</div>
            <div class="flex flex-wrap gap-1.5">
              ${['base', 'smap', 'gpm', 'ecostress', 'landsat'].map((l) => `
                <button onclick="vpSetLayer('${l}')" class="px-2.5 py-1 rounded text-[11px] font-mono uppercase border transition-colors ${
                  state.selectedLayer === l
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 font-bold'
                    : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/10'
                }">${l}</button>
              `).join('')}
            </div>
          </div>

          <!-- Right Farm Details HUD Card -->
          <div class="pointer-events-auto w-72 sm:w-80 glass-hud rounded-lg p-5 shadow-2xl space-y-4 border border-white/10">
            <div class="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
              <h2 class="text-sm font-semibold tracking-wide text-slate-100">🛡️ Farm Details</h2>
              <span class="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">ACTIVE</span>
            </div>
            <div class="space-y-2.5 text-xs">
              <div class="flex justify-between"><span class="text-slate-400">ID:</span><span class="font-mono text-slate-100">${farm.id}</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Owner:</span><span class="text-slate-100">${farm.owner}</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Area:</span><span class="font-mono font-semibold text-white">${farm.area} (${farm.grossArea})</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Crop:</span><span class="text-emerald-400 font-medium">🌱 ${farm.crop}</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Elevation:</span><span class="font-mono text-slate-100">${farm.elevation}</span></div>
            </div>
            <div class="grid grid-cols-2 gap-2 pt-1">
              <button onclick="vpSetTab('dashboard')" class="py-2 px-2 bg-white/[0.06] hover:bg-white/10 text-slate-200 text-[11px] font-medium rounded border border-white/10">📊 NASA Metrics</button>
              <button onclick="vpSetTab('rotation')" class="py-2 px-2 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 text-[11px] font-medium rounded border border-emerald-500/30">🔄 Crop Rotation</button>
            </div>
            <button onclick="vpLaunchSimulation('vaporpath-sim')" class="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold uppercase rounded-md shadow-md transition-colors flex items-center justify-center gap-2">
              <span>🎮 Launch Interactive Godot Sim</span>
            </button>
          </div>
        </div>

        <!-- Bottom Left Status Pill -->
        <div class="flex items-end justify-between w-full pt-4">
          <div onclick="vpSetTab('alerts')" class="pointer-events-auto glass-hud px-4 py-2.5 rounded-md flex items-center space-x-3 text-xs shadow-lg cursor-pointer hover:border-emerald-500/40">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div class="flex items-center space-x-2 font-mono text-[11px] text-slate-300">
              <span class="text-slate-400 font-sans">Selected Field:</span>
              <span class="text-white font-medium">${farm.sector}</span>
              <span class="text-slate-600">|</span>
              <span class="text-emerald-400">${farm.area}</span>
              <span class="text-slate-600">|</span>
              <span class="text-amber-400">⚠️ Drought Risk: 74/100</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderGISDashboard(farm) {
    return `
      <div class="relative z-20 flex-1 w-full h-[calc(100vh-60px)] overflow-y-auto p-6 space-y-6 bg-[#080C0E]">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 class="text-xl font-bold text-white font-mono uppercase">Integrated GIS Telemetry & Crop Resilience</h1>
            <p class="text-xs text-slate-400">Active Sector: ${farm.sector} • ${farm.location} (${farm.coordinates})</p>
          </div>
          <div class="flex gap-2">
            ${Object.keys(FARM_SECTORS).map((sec) => `
              <button onclick="vpSelectSector('${sec}')" class="px-3 py-1.5 rounded text-xs font-mono border ${
                farm.sector === sec ? 'bg-emerald-950 border-emerald-400 text-emerald-300 font-bold' : 'bg-white/5 border-white/10 text-slate-300'
              }">${sec}</button>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="p-4 rounded-lg bg-[#11171D] border border-white/10">
            <div class="text-xs font-mono text-blue-400 uppercase">SMAP Soil Moisture</div>
            <div class="text-2xl font-bold font-mono text-white mt-1">${farm.smap}</div>
            <div class="text-[11px] text-slate-400 mt-1">Root-zone volumetric wetness</div>
          </div>
          <div class="p-4 rounded-lg bg-[#11171D] border border-white/10">
            <div class="text-xs font-mono text-cyan-400 uppercase">GPM 30-Day Rain Deficit</div>
            <div class="text-2xl font-bold font-mono text-white mt-1">${farm.rainDeficit}</div>
            <div class="text-[11px] text-slate-400 mt-1">vs. 30-year climatological baseline</div>
          </div>
          <div class="p-4 rounded-lg bg-[#11171D] border border-white/10">
            <div class="text-xs font-mono text-amber-400 uppercase">ECOSTRESS ESI</div>
            <div class="text-2xl font-bold font-mono text-amber-400 mt-1">${farm.esi}</div>
            <div class="text-[11px] text-slate-400 mt-1">Evaporative Stress Index</div>
          </div>
          <div class="p-4 rounded-lg bg-[#11171D] border border-white/10">
            <div class="text-xs font-mono text-emerald-400 uppercase">Landsat 9 NDVI</div>
            <div class="text-2xl font-bold font-mono text-emerald-400 mt-1">${farm.ndvi}</div>
            <div class="text-[11px] text-slate-400 mt-1">Canopy photosynthetic vigor</div>
          </div>
        </div>

        <div class="p-5 rounded-xl bg-emerald-950/25 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div class="text-xs font-mono uppercase text-emerald-400 font-bold">Interactive Simulation Integration</div>
            <div class="text-sm text-slate-200 mt-1">Test adaptive crop choices (Sorghum, Millet, Cowpea, Soybean) and Smart Drip vs. Rotary Sprinklers in the live 7-screen Godot simulation.</div>
          </div>
          <button onclick="vpLaunchSimulation('vaporpath-sim')" class="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase shrink-0">
            🎮 Open 7-Screen Simulation
          </button>
        </div>
      </div>
    `;
  }

  function renderSoilMoistureView(farm) {
    return `
      <div class="relative z-20 flex-1 w-full h-[calc(100vh-60px)] overflow-y-auto p-6 space-y-6 bg-[#080C0E]">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 class="text-xl font-bold text-white font-mono uppercase">NASA SMAP & POWER Root-Zone Soil Moisture Analytics</h1>
            <p class="text-xs text-slate-400">${farm.name} • ${farm.sector} (${farm.coordinates})</p>
          </div>
          <div class="flex gap-2">
            <a href="observation.html" class="px-3 py-1.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">🛰️ Open L4 Telemetry Page</a>
            <button onclick="vpLaunchSimulation('irrigation-lab')" class="px-3 py-1.5 rounded bg-emerald-600 text-slate-950 font-bold text-xs font-mono">💧 Launch Root Irrigation Lab</button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-lg bg-[#11171D] border border-white/10">
            <div class="text-xs font-mono text-blue-400 uppercase">Root-Zone Soil Moisture</div>
            <div class="text-3xl font-bold font-mono text-white mt-1">${farm.smap}</div>
            <div class="text-xs text-slate-400 mt-1">Critical wilting point: 0.10 m³/m³</div>
          </div>
          <div class="p-4 rounded-lg bg-[#11171D] border border-white/10">
            <div class="text-xs font-mono text-emerald-400 uppercase">Live NASA POWER GWETROOT (Brazil)</div>
            <div class="text-3xl font-bold font-mono text-emerald-400 mt-1">73% <span class="text-xs text-slate-400">(0.730)</span></div>
            <div class="text-xs text-slate-400 mt-1">Cerrado Ag Hub (Lat -12.55, Lon -55.72)</div>
          </div>
          <div class="p-4 rounded-lg bg-[#11171D] border border-white/10">
            <div class="text-xs font-mono text-cyan-400 uppercase">Live NASA POWER PRECTOTCORR</div>
            <div class="text-3xl font-bold font-mono text-cyan-400 mt-1">+40% <span class="text-xs text-slate-400">(9.80 mm/d)</span></div>
            <div class="text-xs text-slate-400 mt-1">vs. 7.00 mm/day regional baseline</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderSimulationsHub(farm) {
    const cardsHtml = SIMULATIONS_LIST.map((sim) => {
      const isCurrent = state.activeSim && state.activeSim.id === sim.id;
      return `
        <div class="rounded-xl p-5 flex flex-col justify-between space-y-4 border transition-all ${
          isCurrent
            ? 'bg-emerald-950/35 border-emerald-400 ring-1 ring-emerald-400/50 shadow-xl'
            : 'bg-[#10161B]/95 border-white/10 hover:border-emerald-500/50 shadow-lg'
        }">
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 font-semibold">${sim.badge}</span>
              <span class="text-[11px] font-mono text-slate-400">${sim.category}</span>
            </div>
            <h3 class="text-base font-bold text-white font-mono leading-snug">${sim.title}</h3>
            <p class="text-xs text-slate-300 leading-relaxed">${sim.description}</p>
          </div>
          <div class="space-y-3 pt-3 border-t border-white/[0.08]">
            <div class="flex flex-wrap gap-1.5">
              ${sim.metrics.map((m) => `<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/10">${m}</span>`).join('')}
            </div>
            <button onclick="vpLaunchSimulation('${sim.id}')" class="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md">
              <span>▶ ${isCurrent ? 'Restart Simulation' : 'Launch Simulation'}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    const modalHtml = state.activeSim
      ? `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-md">
          <div id="godot-sim-modal-box" class="w-full max-w-6xl h-[88vh] bg-[#090E12] rounded-xl border border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden">
            <div class="px-4 py-2.5 bg-[#0D141A] border-b border-white/10 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <button onclick="vpCloseSimModal()" class="px-2.5 py-1 rounded bg-white/[0.07] hover:bg-white/15 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-white/10">
                  ← Back
                </button>
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="text-xs font-mono font-bold text-white truncate max-w-md">${state.activeSim.title}</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="hidden md:flex items-center space-x-1 mr-2">
                  ${SIMULATIONS_LIST.map((s) => `
                    <button onclick="vpLaunchSimulation('${s.id}')" class="px-2 py-1 rounded text-[10px] font-mono ${
                      state.activeSim.id === s.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }">${s.id === 'vaporpath-sim' ? 'Full Game' : s.id === 'moisture-journey' ? 'Vapor Flow' : 'Irrigation Lab'}</button>
                  `).join('')}
                </div>
                <button onclick="vpToggleSimFullscreen()" class="px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-mono border border-emerald-500/40">
                  ⛶ Fullscreen
                </button>
                <button onclick="vpCloseSimModal()" class="px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-mono border border-red-500/30">
                  ✕ Close
                </button>
              </div>
            </div>
            <div class="flex-1 w-full bg-black relative">
              <iframe
                id="godot-sim-iframe"
                src="${state.activeSim.path}"
                title="${state.activeSim.title}"
                class="w-full h-full border-0"
                allow="autoplay; fullscreen; cross-origin-isolated"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      `
      : '';

    return `
      <div class="relative z-20 flex-1 w-full h-[calc(100vh-60px)] overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#080C0E]/95 backdrop-blur-md">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div class="flex items-center gap-2.5">
              <h1 class="text-lg sm:text-xl font-bold text-white tracking-wide font-mono uppercase">🎮 Interactive Godot Web Simulations</h1>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">COI + WASM READY</span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">Unified VaporPath Simulations • Active Farm Context: ${farm.name} (${farm.location})</p>
          </div>
          <div class="flex items-center gap-2">
            <a href="observation.html" class="px-3 py-1.5 rounded-md bg-white/[0.06] hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200">🛰️ L4 Earth Observation Page</a>
            <button onclick="vpSetTab('selection')" class="px-3 py-1.5 rounded-md bg-white/[0.06] hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300">← Back to GIS Map</button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          ${cardsHtml}
        </div>
        ${modalHtml}
      </div>
    `;
  }

  function renderModalOverlay(farm) {
    if (state.activeTab === 'dashboard') {
      return `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div class="w-full max-w-4xl glass-modal rounded-xl p-6 space-y-5 border border-white/10">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 class="text-base font-bold text-white font-mono uppercase">📊 Drought Risk & NASA Telemetry Dashboard</h2>
                <p class="text-xs text-slate-400">${farm.name} (${farm.sector})</p>
              </div>
              <button onclick="vpSetTab('selection')" class="px-2.5 py-1 rounded bg-white/10 text-slate-200 text-xs font-mono">✕ Close</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 rounded-lg bg-amber-950/30 border border-amber-500/30">
                <div class="text-xs font-mono text-amber-300 uppercase">Drought Vulnerability Index</div>
                <div class="text-3xl font-bold font-mono text-amber-400 mt-1">74 / 100</div>
              </div>
              <div class="p-4 rounded-lg bg-[#11171D] border border-white/10">
                <div class="text-xs font-mono text-blue-400 uppercase">SMAP Soil Moisture</div>
                <div class="text-3xl font-bold font-mono text-white mt-1">${farm.smap}</div>
              </div>
              <div class="p-4 rounded-lg bg-[#11171D] border border-white/10">
                <div class="text-xs font-mono text-cyan-400 uppercase">GPM 30-Day Deficit</div>
                <div class="text-3xl font-bold font-mono text-white mt-1">${farm.rainDeficit}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    if (state.activeTab === 'rotation') {
      return `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div class="w-full max-w-4xl glass-modal rounded-xl p-6 space-y-5 border border-white/10">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 class="text-base font-bold text-white font-mono uppercase">🔄 Adaptive Crop Rotation Engine</h2>
                <p class="text-xs text-slate-400">${farm.name} (${farm.sector})</p>
              </div>
              <button onclick="vpSetTab('selection')" class="px-2.5 py-1 rounded bg-white/10 text-slate-200 text-xs font-mono">✕ Close</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              ${[
                { id: 'sorghum', name: 'Grain Sorghum (BRS 330)', save: '45% less water', res: '92% Resilience' },
                { id: 'millet', name: 'Pearl Millet (ADR 300)', save: '60% less water', res: '95% Resilience' },
                { id: 'cowpea', name: 'Resilient Cowpea', save: '50% less water', res: '88% Resilience' }
              ].map((c) => `
                <div onclick="vpSelectCrop('${c.id}')" class="p-4 rounded-lg border cursor-pointer ${
                  state.selectedCrop === c.id ? 'border-emerald-400 bg-emerald-950/40' : 'border-white/10 bg-white/5'
                }">
                  <div class="text-sm font-bold text-white font-mono">🌱 ${c.name}</div>
                  <div class="text-xs text-emerald-300 font-mono mt-2">💧 ${c.save}</div>
                  <div class="text-xs text-blue-300 font-mono mt-1">🛡️ ${c.res}</div>
                </div>
              `).join('')}
            </div>
            <div class="flex justify-end gap-3">
              <button onclick="vpLaunchSimulation('vaporpath-sim')" class="px-4 py-2 rounded bg-white/10 text-emerald-300 text-xs font-mono">🎮 Open in Godot Crop Planner</button>
              <button onclick="vpApplyCropPlan()" class="px-4 py-2 rounded bg-emerald-500 text-slate-950 font-bold text-xs font-mono">✔ Apply Rotation Plan</button>
            </div>
          </div>
        </div>
      `;
    }
    if (state.activeTab === 'alerts') {
      return `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div class="w-full max-w-4xl glass-modal rounded-xl p-6 space-y-4 border border-white/10">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 class="text-base font-bold text-white font-mono uppercase">⚠️ Early Warning System & Alerts</h2>
              <button onclick="vpSetTab('selection')" class="px-2.5 py-1 rounded bg-white/10 text-slate-200 text-xs font-mono">✕ Close</button>
            </div>
            <div class="space-y-3 text-xs">
              <div class="p-4 rounded-lg bg-red-950/30 border border-red-500/40">
                <div class="font-mono font-bold text-red-300">CRITICAL: 3–4 Week Root-Zone Drought Forecast</div>
                <p class="text-slate-300 mt-1">Root-zone soil moisture projected to drop below 0.12 m³/m³. Shift to Grain Sorghum or activate Smart Drip irrigation.</p>
              </div>
              <div class="p-4 rounded-lg bg-amber-950/30 border border-amber-500/40">
                <div class="font-mono font-bold text-amber-300">WARNING: ECOSTRESS Evaporative Stress Index Surge</div>
                <p class="text-slate-300 mt-1">Canopy temperature in ${farm.sector} elevated by 3.2°C compared to 30-year norm.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    return '';
  }

  function renderApp() {
    const root = document.getElementById('root');
    if (!root) return;
    const farm = getActiveFarm();

    let mainView = '';
    if (state.activeTab === 'gis-dashboard') {
      mainView = renderGISDashboard(farm);
    } else if (state.activeTab === 'moisture') {
      mainView = renderSoilMoistureView(farm);
    } else if (state.activeTab === 'simulations') {
      mainView = renderSimulationsHub(farm);
    } else {
      mainView = renderSatelliteMapAndHUD(farm) + renderModalOverlay(farm);
    }

    const toastHtml = state.toastMessage
      ? `<div class="fixed bottom-5 right-5 z-50 bg-[#0D1518] border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-lg shadow-2xl text-xs font-mono flex items-center space-x-2">
          <span>✔</span><span>${state.toastMessage}</span>
        </div>`
      : '';

    root.innerHTML = `
      <div class="w-screen h-screen relative font-sans flex flex-col justify-between overflow-hidden bg-[#080C0E]">
        ${renderTopNav(farm)}
        ${mainView}
        ${toastHtml}
      </div>
    `;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp);
  } else {
    renderApp();
  }
})();

