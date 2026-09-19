export interface CustomerInput {
  gender: 'Female' | 'Male';
  SeniorCitizen: 0 | 1;
  Partner: 'Yes' | 'No';
  Dependents: 'Yes' | 'No';
  tenure: number;
  PhoneService: 'Yes' | 'No';
  MultipleLines: 'No' | 'Yes' | 'No phone service';
  InternetService: 'DSL' | 'Fiber optic' | 'No';
  OnlineSecurity: 'No' | 'Yes' | 'No internet service';
  OnlineBackup: 'No' | 'Yes' | 'No internet service';
  DeviceProtection: 'No' | 'Yes' | 'No internet service';
  TechSupport: 'No' | 'Yes' | 'No internet service';
  StreamingTV: 'No' | 'Yes' | 'No internet service';
  StreamingMovies: 'No' | 'Yes' | 'No internet service';
  Contract: 'Month-to-month' | 'One year' | 'Two year';
  PaperlessBilling: 'Yes' | 'No';
  PaymentMethod: 'Electronic check' | 'Mailed check' | 'Bank transfer (automatic)' | 'Credit card (automatic)';
  MonthlyCharges: number;
  TotalCharges: number;
}

export interface PredictionResult {
  prediction: 'Likely to Churn' | 'Likely to Stay';
  churnProbability: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  contributingFactors: {
    feature: string;
    impact: 'risk' | 'protective' | 'neutral';
    detail: string;
  }[];
  retentionRecommendations: string[];
}

export interface ModelMetric {
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  highlight: string;
  confusionMatrix: [[number, number], [number, number]];
}

export interface GuideStep {
  stepNumber: number;
  title: string;
  category: string;
  objective: string;
  fileName?: string;
  terminalCommand?: string;
  expectedOutput?: string;
  codeSnippet?: string;
  commonErrors?: { error: string; fix: string }[];
  interviewTip?: string;
}
