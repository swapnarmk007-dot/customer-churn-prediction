import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { BENCHMARK_MODELS, FEATURE_IMPORTANCE_DATA } from '../data/edaData';
import { Award, CheckCircle2, ShieldCheck, Scale, Cpu } from 'lucide-react';

export const ModelBenchmarks: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('Random Forest Classifier');

  const currentModel =
    BENCHMARK_MODELS.find((m) => m.model === selectedModel) || BENCHMARK_MODELS[0];

  const tn = currentModel.confusionMatrix[0][0];
  const fp = currentModel.confusionMatrix[0][1];
  const fn = currentModel.confusionMatrix[1][0];
  const tp = currentModel.confusionMatrix[1][1];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-600" />
              Machine Learning Model Evaluation & Benchmarks
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Cross-model comparison trained on stratified 80/20 train/test split with leak-free ColumnTransformer pipelines.
            </p>
          </div>
          <div className="text-xs bg-slate-900 text-slate-100 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="font-semibold text-white">Pipeline Architecture:</span> Scikit-learn + Joblib
            </div>
          </div>
        </div>
      </div>

      {/* Model Benchmark Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Comparative Performance Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated on identical unseen hold-out test partition (N = 1,409)
            </p>
          </div>
          <span className="text-xs text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full font-semibold">
            Ranked by F1-Score & ROC-AUC
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Algorithm / Model</th>
                <th className="py-3.5 px-3">Accuracy</th>
                <th className="py-3.5 px-3">Precision</th>
                <th className="py-3.5 px-3">Recall</th>
                <th className="py-3.5 px-3">F1 Score</th>
                <th className="py-3.5 px-3">ROC-AUC</th>
                <th className="py-3.5 px-4">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {BENCHMARK_MODELS.map((m) => {
                const isSelected = m.model === selectedModel;
                return (
                  <tr
                    key={m.model}
                    onClick={() => setSelectedModel(m.model)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          m.model.includes('Random Forest')
                            ? 'bg-emerald-600'
                            : m.model.includes('Logistic')
                            ? 'bg-blue-600'
                            : 'bg-slate-400'
                        }`}
                      />
                      {m.model}
                    </td>
                    <td className="py-3.5 px-3 text-slate-700">{m.accuracy}%</td>
                    <td className="py-3.5 px-3 text-slate-700">{m.precision}%</td>
                    <td className="py-3.5 px-3 text-slate-700">{m.recall}%</td>
                    <td className="py-3.5 px-3 font-bold text-emerald-700">{m.f1Score}%</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">{m.rocAuc}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs ${
                          m.model.includes('Random Forest')
                            ? 'bg-emerald-100 text-emerald-800 font-bold'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {m.highlight}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Confusion Matrix & Feature Importance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Confusion Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">
                Interactive Confusion Matrix
              </h3>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-medium"
              >
                {BENCHMARK_MODELS.map((b) => (
                  <option key={b.model} value={b.model}>
                    {b.model}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Holdout evaluation breakdown on 1,409 unseen test samples for <strong>{selectedModel}</strong>.
            </p>

            {/* Matrix Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              {/* True Negative */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  True Negatives (TN)
                </div>
                <div className="text-2xl font-black text-emerald-700 mt-1">{tn}</div>
                <div className="text-[11px] text-emerald-600 mt-0.5">Correctly Retained</div>
              </div>

              {/* False Positive */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  False Positives (FP)
                </div>
                <div className="text-2xl font-black text-amber-700 mt-1">{fp}</div>
                <div className="text-[11px] text-amber-600 mt-0.5">False Alarm Churn</div>
              </div>

              {/* False Negative */}
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-center">
                <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                  False Negatives (FN)
                </div>
                <div className="text-2xl font-black text-rose-700 mt-1">{fn}</div>
                <div className="text-[11px] text-rose-600 mt-0.5">Missed Churners (Costly)</div>
              </div>

              {/* True Positive */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                  True Positives (TP)
                </div>
                <div className="text-2xl font-black text-blue-700 mt-1">{tp}</div>
                <div className="text-[11px] text-blue-600 mt-0.5">Accurately Caught Churners</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-100 rounded-xl text-xs text-slate-700 flex gap-2">
            <Scale className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <strong>Business Tradeoff:</strong> In churn prevention, <strong>False Negatives</strong> (lost customers not contacted) carry substantial revenue loss ($600+/yr). Models with higher Recall catch more true positives, whereas models with higher Precision minimize wasted marketing outreach.
            </div>
          </div>
        </div>

        {/* Feature Importance Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Top Predictive Feature Importances
              </h3>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-medium">
                Gini Impurity & Permutation
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Top normalized relative weights from the Random Forest ensemble pipeline.
            </p>

            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={FEATURE_IMPORTANCE_DATA}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 60, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis
                    type="category"
                    dataKey="feature"
                    tick={{ fontSize: 11, fill: '#1E293B', width: 140 }}
                  />
                  <Tooltip
                    formatter={(val: any) => [`${(Number(val) * 100).toFixed(1)}%`, 'Relative Weight']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                  <Bar dataKey="importance" fill="#10B981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50/80 border border-emerald-200/60 rounded-xl text-xs text-slate-700">
            <strong>Key takeaway:</strong> Contract type (Month-to-month), customer tenure, and billing amounts together account for <strong>over 75%</strong> of the predictive signal in customer churn identification.
          </div>
        </div>
      </div>

      {/* Model Selection Strategy Explanation */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Production Model Selection Rationale (Swapna V Methodology)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1">1. Class Imbalance Mitigation</h4>
            <p>
              With churn accounting for ~26.5% of records, naive accuracy gives a false sense of security. Stratified 80/20 partitioning and balanced class weights were applied to penalize false negatives proportionally.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1">2. Zero-Data Leakage Pipeline</h4>
            <p>
              Features are scaled and encoded inside a consolidated <code>ColumnTransformer</code> and <code>Pipeline</code>. Fitting occurs strictly on training folds, and unseen inference values are safely handled with <code>handle_unknown='ignore'</code>.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1">3. F1-Score & ROC-AUC Optimization</h4>
            <p>
              Random Forest was selected as the primary production model due to superior ensemble stability (ROC-AUC: 0.8465, F1: 60.6%), while Balanced Logistic Regression serves as an aggressive high-recall alternative (Recall: 79.7%).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
