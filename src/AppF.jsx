import React, { useState } from 'react';
import TopNav from './components/TopNav';
import SatelliteMap from './components/SatelliteMap';
import FarmDetailsHUD from './components/FarmDetailsHUD';
import BottomLeftHUD from './components/BottomLeftHUD';
import DashboardAnalytics from './components/DashboardAnalytics';
import CropRotationPlanner from './components/CropRotationPlanner';
import EarlyWarningAlerts from './components/EarlyWarningAlerts';
import GISDashboard from './components/GISDashboard';
import SoilMoistureAnalytics from './components/SoilMoistureAnalytics';
import { Download, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('selection'); // 'selection' | 'gis-dashboard' | 'moisture' | 'dashboard' | 'rotation' | 'alerts'
  const [selectedLayer, setSelectedLayer] = useState('base');
  const [toastMessage, setToastMessage] = useState(null);

  // Farm preset dataset
  const [activeFarm, setActiveFarm] = useState({
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
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectField = (sectorName) => {
    if (sectorName === 'Sector 02-A') {
      setActiveFarm({
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
      });
      showToast('Switched active parcel to Sector 02-A (310.00 ha)');
    } else if (sectorName === 'Sector 01-C') {
      setActiveFarm({
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
      });
      showToast('Switched active parcel to Sector 01-C (280.00 ha)');
    } else if (sectorName === 'Sector 03-D') {
      setActiveFarm({
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
      });
      showToast('Switched active parcel to Sector 03-D (195.00 ha)');
    } else {
      setActiveFarm({
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
      });
      showToast('Switched active parcel to Sector 04-B (420.50 ha)');
    }
  };

  const handleApplyPlan = (cropOption) => {
    if (cropOption) {
      setActiveFarm(prev => ({
        ...prev,
        crop: `${cropOption.name} (Planned)`
      }));
      showToast(`Applied ${cropOption.name} rotation plan to ${activeFarm.sector}`);
    }
  };

  const handleExportReport = () => {
    showToast(`Generating NASA VaporPath PDF Report for ${activeFarm.id}...`);
  };

  return (
    <div className="w-screen h-screen relative font-sans flex flex-col justify-between overflow-hidden bg-[#080C0E]">
      {/* Top Navigation Bar */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeFarm={activeFarm}
        onSearchSubmit={(query) => showToast(`Searching geo-spatial index for: "${query}"`)}
        onExportReport={handleExportReport}
      />

      {/* Primary Views */}

      {/* View 1: Full-Screen Interactive GIS Map */}
      {activeTab === 'selection' && (
        <>
          <SatelliteMap
            activeFarm={activeFarm}
            selectedLayer={selectedLayer}
            setSelectedLayer={setSelectedLayer}
            onSelectField={handleSelectField}
          />
          <div className="relative z-20 flex-1 pointer-events-none p-5 sm:p-6 flex flex-col justify-between" data-purpose="hud-layers">
            <FarmDetailsHUD
              activeFarm={activeFarm}
              onOpenAnalytics={() => setActiveTab('dashboard')}
              onOpenRotation={() => setActiveTab('rotation')}
            />
            <div className="flex items-end justify-between w-full pt-4">
              <BottomLeftHUD
                activeFarm={activeFarm}
                onOpenAlerts={() => setActiveTab('alerts')}
              />
            </div>
          </div>
        </>
      )}

      {/* View 2: Integrated GIS Dashboard & Recommendation View */}
      {activeTab === 'gis-dashboard' && (
        <GISDashboard
          activeFarm={activeFarm}
          onSelectField={handleSelectField}
          selectedLayer={selectedLayer}
          setSelectedLayer={setSelectedLayer}
          onApplyPlan={handleApplyPlan}
          onExportReport={handleExportReport}
          onOpenAnalytics={() => setActiveTab('dashboard')}
          onOpenAlerts={() => setActiveTab('alerts')}
        />
      )}

      {/* View 3: NASA Earth Observation Soil Moisture Analytics View */}
      {activeTab === 'moisture' && (
        <SoilMoistureAnalytics
          activeFarm={activeFarm}
          onSelectField={handleSelectField}
          onApplyPlan={handleApplyPlan}
          onExportReport={handleExportReport}
          onOpenAlerts={() => setActiveTab('alerts')}
        />
      )}

      {/* Modal Tab 1: Detailed NASA Metrics */}
      {activeTab === 'dashboard' && (
        <DashboardAnalytics
          activeFarm={activeFarm}
          onClose={() => setActiveTab('selection')}
        />
      )}

      {/* Modal Tab 2: Adaptive Crop Rotation Engine */}
      {activeTab === 'rotation' && (
        <CropRotationPlanner
          activeFarm={activeFarm}
          onClose={() => setActiveTab('selection')}
          onApplyPlan={handleApplyPlan}
        />
      )}

      {/* Modal Tab 3: Early Warning Alert System */}
      {activeTab === 'alerts' && (
        <EarlyWarningAlerts
          activeFarm={activeFarm}
          onClose={() => setActiveTab('selection')}
          onExportReport={handleExportReport}
        />
      )}

      {/* Global Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-hud px-4 py-2.5 rounded-lg border border-emerald-500/40 text-xs font-mono text-emerald-300 shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
