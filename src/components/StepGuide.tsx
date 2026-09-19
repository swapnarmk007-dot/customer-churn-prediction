import React, { useState } from 'react';
import { GUIDE_STEPS } from '../data/guideSteps';
import {
  BookOpen,
  Terminal,
  AlertCircle,
  Briefcase,
  Search,
  CheckCircle,
  Copy,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const StepGuide: React.FC = () => {
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  const filteredSteps = GUIDE_STEPS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.objective.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeStep = GUIDE_STEPS[selectedStepIndex] || GUIDE_STEPS[0];

  const handleCopyCmd = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-600" />
              17-Step Masterclass & Portfolio Implementation Guide
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Beginner-friendly, sequential execution roadmap with exact terminal commands, code locations, expected outputs, and debugging fixes.
            </p>
          </div>
          <div className="text-xs bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl border border-slate-200 font-medium">
            Tailored for <strong className="text-slate-900">Swapna V</strong> (M.Sc. Mathematics)
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search through Steps 1 to 17 (e.g. Streamlit, ColumnTransformer, GitHub, EDA)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
          />
        </div>
      </div>

      {/* Steps Navigation Carousel & Active Step Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Step Selector (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 max-h-[700px] overflow-y-auto scrollbar-thin">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
            Execution Steps (1 - 17)
          </div>

          {filteredSteps.map((step) => {
            const isCurrent = step.stepNumber === activeStep.stepNumber;
            return (
              <button
                key={step.stepNumber}
                onClick={() => setSelectedStepIndex(step.stepNumber - 1)}
                className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isCurrent ? 'bg-white text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {step.stepNumber}
                  </span>
                  <div>
                    <div className="truncate font-medium">{step.title}</div>
                    <div
                      className={`text-[10px] ${
                        isCurrent ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {step.category}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Right: Step Deep Dive (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            {/* Step Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  #{activeStep.stepNumber}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    STEP {activeStep.stepNumber}: {activeStep.title}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Category: {activeStep.category}
                  </span>
                </div>
              </div>
              {activeStep.fileName && (
                <div className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-mono">
                  File: {activeStep.fileName}
                </div>
              )}
            </div>

            {/* Objective */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                What We Are Doing
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {activeStep.objective}
              </p>
            </div>

            {/* Terminal Command if any */}
            {activeStep.terminalCommand && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-700" />
                    Exact Terminal Command to Run
                  </h4>
                  <button
                    onClick={() => handleCopyCmd(activeStep.terminalCommand!)}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedCmd ? 'Copied Command!' : 'Copy Command'}
                  </button>
                </div>
                <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto">
                  <code>{activeStep.terminalCommand}</code>
                </pre>
              </div>
            )}

            {/* Code Snippet if any */}
            {activeStep.codeSnippet && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Key Code Implementation
                </h4>
                <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto">
                  <code>{activeStep.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Expected Output */}
            {activeStep.expectedOutput && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Expected Terminal / System Output
                </h4>
                <div className="bg-emerald-50/60 border border-emerald-200/80 p-3.5 rounded-xl text-xs font-mono text-emerald-900 whitespace-pre-line">
                  {activeStep.expectedOutput}
                </div>
              </div>
            )}

            {/* Common Errors & Fixes */}
            {activeStep.commonErrors && activeStep.commonErrors.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  Common Errors & Exact Fixes
                </h4>
                <div className="space-y-2">
                  {activeStep.commonErrors.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl text-xs space-y-1"
                    >
                      <div className="font-semibold text-rose-800">⚠️ Error: {item.error}</div>
                      <div className="text-slate-700">
                        <strong className="text-emerald-700">✅ Fix: </strong> {item.fix}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recruiter / Interview Tip */}
            {activeStep.interviewTip && (
              <div className="p-4 bg-slate-900 text-slate-200 rounded-xl flex items-start gap-3 text-xs">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-semibold">
                    Recruiter & Interview Talking Point:
                  </strong>
                  <p className="mt-0.5 text-slate-300">{activeStep.interviewTip}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STEP 16: Resume Framing & Recruiter Pitch for Swapna V */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
          <Briefcase className="w-5 h-5 text-emerald-600" />
          <h3>Portfolio & Resume Project Framing for Swapna V</h3>
        </div>
        <p className="text-xs text-slate-600">
          Add this section to your resume, LinkedIn project highlights, and portfolio website:
        </p>

        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs sm:text-sm text-slate-800">
          <div className="font-bold text-base text-slate-900">
            Customer Churn Prediction AI System | Python, Scikit-learn, Streamlit, EDA
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Role: AI & Machine Learning / Data Analytics | Swapna V, M.Sc. Mathematics
          </div>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
            <li>
              Engineered an end-to-end churn prediction pipeline on 7,043 Telco customer accounts, achieving <strong>80.4% accuracy</strong>, <strong>0.846 ROC-AUC</strong>, and an optimized <strong>60.6% F1-score</strong> using an ensemble Random Forest classifier.
            </li>
            <li>
              Eliminated data leakage across numerical (StandardScaler) and categorical (OneHotEncoder) features via Scikit-learn <code>ColumnTransformer</code> and unified <code>Pipeline</code> architectures.
            </li>
            <li>
              Conducted rigorous exploratory data analysis identifying that month-to-month contracts exhibit a <strong>42.7% churn rate</strong> (vs 2.8% for two-year) and electronic check payments yield <strong>45.3% attrition</strong>.
            </li>
            <li>
              Deployed a production-grade Streamlit web application on cloud infrastructure delivering real-time probability calibration, risk tiering (Low/Medium/High), and dynamic retention strategy playbooks.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
