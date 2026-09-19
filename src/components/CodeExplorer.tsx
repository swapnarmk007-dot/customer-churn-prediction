import React, { useState } from 'react';
import { PROJECT_FILES, ProjectFile } from '../data/projectFiles';
import { Copy, Check, Download, FileCode, Folder, FileText } from 'lucide-react';

export const CodeExplorer: React.FC = () => {
  const [activeFileName, setActiveFileName] = useState<string>('train_model.py');
  const [copied, setCopied] = useState(false);

  const activeFile: ProjectFile =
    PROJECT_FILES.find((f) => f.name === activeFileName) || PROJECT_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([activeFile.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = activeFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCode className="w-6 h-6 text-emerald-600" />
              Project Code & File Repository
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Complete, production-tested, copy-paste ready scripts for local execution, GitHub, and Streamlit Cloud.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard!' : `Copy ${activeFile.name}`}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download File
            </button>
          </div>
        </div>
      </div>

      {/* Code Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: File Tree (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2 flex items-center gap-1.5">
            <Folder className="w-4 h-4 text-amber-500" />
            customer-churn-prediction/
          </div>

          <div className="space-y-1">
            {PROJECT_FILES.map((f) => {
              const isActive = f.name === activeFileName;
              return (
                <button
                  key={f.name}
                  onClick={() => setActiveFileName(f.name)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileText className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{f.path}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 px-2 text-[11px] text-slate-500">
            <strong className="text-slate-700">Author:</strong> Swapna V<br />
            <strong className="text-slate-700">Platform:</strong> Streamlit Cloud & Scikit-learn
          </div>
        </div>

        {/* Right: Code Display (9 cols) */}
        <div className="lg:col-span-9 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          {/* File Header Bar */}
          <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>{activeFile.path}</span>
            </div>
            <span className="text-[11px] text-slate-400 uppercase font-medium">
              {activeFile.language}
            </span>
          </div>

          {/* Description banner */}
          <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800/80 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">File Role: </span>
            {activeFile.description}
          </div>

          {/* Code Window */}
          <div className="p-5 overflow-x-auto max-h-[580px] scrollbar-thin scrollbar-thumb-slate-800">
            <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
