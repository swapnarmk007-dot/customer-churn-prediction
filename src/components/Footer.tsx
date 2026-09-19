import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-8 px-4 text-center">
      <div className="max-w-7xl mx-auto space-y-2">
        <div className="text-sm font-bold text-slate-800">
          Developed by Swapna V | Machine Learning &amp; Data Analytics Project
        </div>
        <div className="text-xs text-slate-500 font-medium">
          M.Sc. Mathematics • Python • Data Analytics • Machine Learning • Streamlit • Generative AI
        </div>
        <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 max-w-xl mx-auto">
          Built for executive decision support and predictive churn risk mitigation. Models trained using stratified Scikit-learn pipelines with zero data leakage.
        </div>
      </div>
    </footer>
  );
};
