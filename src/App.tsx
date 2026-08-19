import React from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Registration } from './components/layout/Registration';
import { useAppContext } from './context/AppContext';

import { WaferModule } from './modules/wafer/WaferModule';
import { OxidationModule } from './modules/oxidation/OxidationModule';
import { LithographyModule } from './modules/lithography/LithographyModule';
import { EtchModule } from './modules/etch/EtchModule';
import { EdsModule } from './modules/eds/EdsModule';
import { PackagingModule } from './modules/packaging/PackagingModule';
import { DepositionModule } from './modules/deposition/DepositionModule';
import { MetallizationModule } from './modules/metallization/MetallizationModule';

export default function App() {
  const { state } = useAppContext();

  if (!state.user) {
    return <Registration />;
  }

  const renderModule = () => {
    switch (state.currentModule) {
      case 'm1': return <WaferModule />;
      case 'm2': return <OxidationModule />;
      case 'm3': return <LithographyModule />;
      case 'm4': return <EtchModule />;
      case 'm7': return <EdsModule />;
      case 'm8': return <PackagingModule />;
      case 'm5': return <DepositionModule />;
      case 'm6': return <MetallizationModule />;
      default:
        return <div className="text-white p-8">Select a module</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 bg-slate-950 overflow-y-auto">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}
