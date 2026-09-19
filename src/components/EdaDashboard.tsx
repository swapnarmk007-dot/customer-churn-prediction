import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { Users, UserX, DollarSign, Calendar, TrendingDown, Info } from 'lucide-react';
import {
  KPI_METRICS,
  CONTRACT_CHURN_DATA,
  INTERNET_CHURN_DATA,
  PAYMENT_CHURN_DATA,
  TENURE_COHORTS_DATA,
  MONTHLY_CHARGES_BUCKETS,
} from '../data/edaData';

export const EdaDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Executive Churn Analytics & Exploratory Data Analysis
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              IBM Telco Customer Churn Study cohort analysis (7,043 customer accounts across 21 behavioral attributes)
            </p>
          </div>
          <div className="text-right text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-xl">
            <span className="font-semibold">Developed by Swapna V</span>
            <div className="text-emerald-700">Python | Scikit-learn | Streamlit</div>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Customers
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">
                {KPI_METRICS.totalCustomers.toLocaleString()}
              </div>
              <div className="text-xs text-slate-600 mt-1">Cohort Sample Size</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Overall Churn Rate
              </div>
              <div className="text-2xl font-bold text-rose-600 mt-0.5">
                {KPI_METRICS.overallChurnRate}%
              </div>
              <div className="text-xs text-rose-600 mt-1 font-medium">
                {KPI_METRICS.churnedCount.toLocaleString()} churned accounts
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Revenue at Risk
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">
                ${(KPI_METRICS.monthlyRevenueAtRisk / 1000).toFixed(1)}k<span className="text-xs font-normal text-slate-500">/mo</span>
              </div>
              <div className="text-xs text-slate-600 mt-1">Avg ${KPI_METRICS.avgMonthlyCharges}/mo bill</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Mean Customer Tenure
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">
                {KPI_METRICS.avgTenureMonths.toFixed(1)} <span className="text-xs font-normal text-slate-500">months</span>
              </div>
              <div className="text-xs text-emerald-600 mt-1 font-medium">Lifetime retention baseline</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Grid: Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Contract-wise Churn */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                1. Contract-Wise Churn Distribution
              </h3>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-medium">
                Tenure Commitment
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Percentage of accounts retained vs churned categorized by agreement term length.
            </p>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CONTRACT_CHURN_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="contract" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis unit="%" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value}%`, String(name)]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="Retained" fill="#10B981" stackId="a" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="Churned" fill="#EF4444" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-slate-700 flex gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900 font-semibold">Business Insight:</strong> Month-to-month contracts experience a staggering <strong>42.7% churn rate</strong>, compared to <strong>11.3%</strong> for one-year and only <strong>2.8%</strong> for two-year contracts. Multi-year commitment acts as a primary retention lock-in mechanism.
            </div>
          </div>
        </div>

        {/* Chart 2: Internet Service Churn */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                2. Churn by Internet Service Infrastructure
              </h3>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-medium">
                Service Line
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Attrition rates across Fiber Optic, DSL, and Phone-only subscriber segments.
            </p>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INTERNET_CHURN_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="service" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis unit="%" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value}%`, String(name)]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="Retained" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Churned" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-slate-700 flex gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-900 font-semibold">Business Insight:</strong> Fiber Optic subscribers exhibit a disproportionate <strong>41.9% churn rate</strong>. While fiber provides premium bandwidth, it carries higher monthly price points and higher customer expectations, making users vulnerable to competitor offers.
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Grid: Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Payment Method */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                3. Payment Method & Billing Channel Churn
              </h3>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-medium">
                Billing Channel
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Comparing automatic recurring payments against manual payment modes.
            </p>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PAYMENT_CHURN_DATA} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" unit="%" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis type="category" dataKey="method" tick={{ fontSize: 11, fill: '#334155' }} />
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value}%`, String(name)]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="Retained" fill="#06B6D4" stackId="b" />
                  <Bar dataKey="Churned" fill="#F43F5E" stackId="b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 bg-rose-50/70 border border-rose-200/60 rounded-xl text-xs text-slate-700 flex gap-2">
            <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-rose-900 font-semibold">Business Insight:</strong> Electronic check users have the highest attrition (<strong>45.3% churn</strong>). Customers utilizing automated bank transfer (16.7%) or credit cards (15.2%) display superior retention because automated payments eliminate monthly manual re-evaluation of service value.
            </div>
          </div>
        </div>

        {/* Chart 4: Tenure Cohort Curve */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                4. Customer Lifecycle: Churn Rate by Tenure Cohort
              </h3>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-medium">
                Retention Curve
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Progression of churn probability from customer onboarding to multi-year maturity.
            </p>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TENURE_COHORTS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="cohort" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis unit="%" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value}%`, name === 'churnRate' ? 'Churn Rate' : 'Retained Rate']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="churnRate"
                    name="Churn Rate (%)"
                    stroke="#EF4444"
                    fill="#FEE2E2"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs text-slate-700 flex gap-2">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-900 font-semibold">Business Insight:</strong> The first 12 months is the critical onboarding hazard zone (churn exceeds <strong>53% in months 0–6</strong>). Once an account survives past 24 months, churn drops sharply to <strong>20%</strong>, reaching a baseline of <strong>7.3%</strong> past 4 years.
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Monthly Spend & Financial Tiers */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900">
          5. Monthly Charges Tier Analysis
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Evaluating customer attrition propensity across low, mid, high, and premium monthly billing brackets.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {MONTHLY_CHARGES_BUCKETS.map((bucket, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="text-xs font-semibold text-slate-700">{bucket.range}</div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-bold text-rose-600">{bucket.Churned}%</span>
                <span className="text-xs text-slate-500">Churn Rate</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${bucket.Churned}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500 mt-2">
                Retained: <span className="font-semibold text-emerald-700">{bucket.Retained}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-slate-100 rounded-xl text-xs text-slate-600">
          <strong>Statistical Association Note:</strong> Customers paying in the high ($60–$90) and premium ($90–$120) brackets have over 4x higher churn rate than basic tier accounts ($18–$30), largely because premium fees are tied to month-to-month fiber optic contracts without bundling value.
        </div>
      </div>
    </div>
  );
};
