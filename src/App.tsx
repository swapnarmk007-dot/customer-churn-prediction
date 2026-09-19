import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { EdaDashboard } from './components/EdaDashboard';
import { Predictor } from './components/Predictor';
import { ModelBenchmarks } from './components/ModelBenchmarks';
import { CodeExplorer } from './components/CodeExplorer';
import { StepGuide } from './components/StepGuide';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('eda');

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation Bar with Swapna V Branding */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'eda' && <EdaDashboard />}
        {activeTab === 'predict' && <Predictor />}
        {activeTab === 'models' && <ModelBenchmarks />}
        {activeTab === 'code' && <CodeExplorer />}
        {activeTab === 'guide' && <StepGuide />}
      </main>

      {/* Official Footer */}
      <Footer />
    </div>
  );
}
