import React from 'react';
import { BarChart3, Calculator, Award, Code2, BookOpen, Sparkles, User } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'eda', label: 'Executive EDA & KPIs', icon: BarChart3 },
    { id: 'predict', label: 'Predict Churn (Live ML)', icon: Calculator },
    { id: 'models', label: 'Model Benchmarks', icon: Award },
    { id: 'code', label: 'Project Files & Code', icon: Code2 },
    { id: 'guide', label: '17-Step Guide & Interview Kit', icon: BookOpen },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Brand Header */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold text-xl">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg sm:text-xl text-slate-100 tracking-tight">
                  Customer Churn AI
                </h1>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Production ML
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Customer Churn Prediction Using Machine Learning • <span className="text-slate-200 font-semibold">Developed by Swapna V</span>
              </p>
            </div>
          </div>

          {/* Developer Tag */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-800/80 border border-slate-700/60 px-3.5 py-1.5 rounded-lg text-xs">
            <User className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-semibold text-slate-200">Swapna V</div>
              <div className="text-slate-400 text-[11px]">M.Sc. Mathematics | AI & ML</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800/70 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
