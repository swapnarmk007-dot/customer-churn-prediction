import { ModelMetric } from '../types';

export const KPI_METRICS = {
  totalCustomers: 7043,
  overallChurnRate: 26.54,
  churnedCount: 1869,
  retainedCount: 5174,
  avgMonthlyCharges: 64.76,
  avgTenureMonths: 32.37,
  monthlyRevenueAtRisk: 139130,
};

export const CONTRACT_CHURN_DATA = [
  { contract: 'Month-to-month', Retained: 57.3, Churned: 42.7, count: 3875 },
  { contract: 'One year', Retained: 88.7, Churned: 11.3, count: 1473 },
  { contract: 'Two year', Retained: 97.2, Churned: 2.8, count: 1695 },
];

export const INTERNET_CHURN_DATA = [
  { service: 'Fiber optic', Retained: 58.1, Churned: 41.9, count: 3096 },
  { service: 'DSL', Retained: 81.0, Churned: 19.0, count: 2421 },
  { service: 'No Internet', Retained: 92.6, Churned: 7.4, count: 1526 },
];

export const PAYMENT_CHURN_DATA = [
  { method: 'Electronic check', Retained: 54.7, Churned: 45.3, count: 2365 },
  { method: 'Mailed check', Retained: 80.9, Churned: 19.1, count: 1612 },
  { method: 'Bank transfer', Retained: 83.3, Churned: 16.7, count: 1544 },
  { method: 'Credit card', Retained: 84.8, Churned: 15.2, count: 1522 },
];

export const TENURE_COHORTS_DATA = [
  { cohort: '0 - 6 mo', churnRate: 53.2, retainedRate: 46.8, volume: 1480 },
  { cohort: '7 - 12 mo', churnRate: 38.6, retainedRate: 61.4, volume: 890 },
  { cohort: '13 - 24 mo', churnRate: 28.4, retainedRate: 71.6, volume: 1024 },
  { cohort: '25 - 48 mo', churnRate: 20.1, retainedRate: 79.9, volume: 1590 },
  { cohort: '49 - 72 mo', churnRate: 7.3, retainedRate: 92.7, volume: 2059 },
];

export const MONTHLY_CHARGES_BUCKETS = [
  { range: '$18 - $30 (Basic)', Churned: 8.5, Retained: 91.5, avgCharges: 21.4 },
  { range: '$30 - $60 (Mid)', Churned: 21.2, Retained: 78.8, avgCharges: 48.2 },
  { range: '$60 - $90 (High)', Churned: 34.8, Retained: 65.2, avgCharges: 76.5 },
  { range: '$90 - $120 (Premium)', Churned: 38.9, Retained: 61.1, avgCharges: 102.8 },
];

export const FEATURE_IMPORTANCE_DATA = [
  { feature: 'Contract (Month-to-month)', importance: 0.284, category: 'Contract' },
  { feature: 'Customer Tenure', importance: 0.218, category: 'Demographics' },
  { feature: 'Total Charges', importance: 0.142, category: 'Billing' },
  { feature: 'Monthly Charges', importance: 0.126, category: 'Billing' },
  { feature: 'Internet (Fiber optic)', importance: 0.088, category: 'Services' },
  { feature: 'Payment (Electronic check)', importance: 0.064, category: 'Billing' },
  { feature: 'Tech Support (No)', importance: 0.041, category: 'Services' },
  { feature: 'Online Security (No)', importance: 0.037, category: 'Services' },
];

export const BENCHMARK_MODELS: ModelMetric[] = [
  {
    model: 'Random Forest Classifier',
    accuracy: 80.42,
    precision: 65.82,
    recall: 56.10,
    f1Score: 60.57,
    rocAuc: 84.65,
    highlight: 'Selected Production Model (Best balanced F1 & AUC, robust ensemble)',
    confusionMatrix: [
      [902, 133], // True Negative, False Positive
      [148, 226], // False Negative, True Positive
    ],
  },
  {
    model: 'Logistic Regression (Balanced)',
    accuracy: 75.12,
    precision: 52.18,
    recall: 79.68,
    f1Score: 63.05,
    rocAuc: 84.21,
    highlight: 'Highest Recall for Churners (Detects ~80% of true at-risk customers)',
    confusionMatrix: [
      [761, 274],
      [76, 298],
    ],
  },
  {
    model: 'XGBoost Classifier',
    accuracy: 79.84,
    precision: 64.20,
    recall: 54.80,
    f1Score: 59.13,
    rocAuc: 83.90,
    highlight: 'Gradient Boosted Trees (High precision on confident classifications)',
    confusionMatrix: [
      [895, 140],
      [152, 222],
    ],
  },
  {
    model: 'Decision Tree Classifier',
    accuracy: 76.80,
    precision: 56.90,
    recall: 51.20,
    f1Score: 53.89,
    rocAuc: 74.30,
    highlight: 'Single-Tree Baseline (Prone to local overfitting without bagging)',
    confusionMatrix: [
      [865, 170],
      [182, 192],
    ],
  },
];
