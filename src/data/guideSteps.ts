import { GuideStep } from '../types';

export const GUIDE_STEPS: GuideStep[] = [
  {
    stepNumber: 1,
    title: 'Setup & Virtual Environment',
    category: 'Environment',
    objective: 'Establish an isolated Python 3.10+ workspace to prevent dependency version conflicts across packages.',
    terminalCommand: 'mkdir customer-churn-prediction && cd customer-churn-prediction\npython -m venv venv\nsource venv/bin/activate   # Windows: venv\\Scripts\\activate',
    expectedOutput: '(venv) user@host:~/customer-churn-prediction$',
    commonErrors: [
      {
        error: "'python' is not recognized as an internal or external command (Windows)",
        fix: "Check 'Add Python to PATH' during Python installation, or use 'py -m venv venv'."
      },
      {
        error: "Execution of scripts is disabled on this system (PowerShell)",
        fix: "Run 'Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser' in PowerShell."
      }
    ],
    interviewTip: 'Mentioning virtual environment management shows software engineering discipline right away.'
  },
  {
    stepNumber: 2,
    title: 'Acquire Telco Churn Dataset',
    category: 'Data Sourcing',
    objective: 'Obtain the authentic Kaggle IBM Telco Customer Churn dataset (7,043 customer accounts across 21 attributes).',
    fileName: 'data/customer_churn.csv',
    terminalCommand: 'mkdir data\n# Download dataset from Kaggle or direct Telco repository\n# Place it as data/customer_churn.csv',
    expectedOutput: 'File data/customer_churn.csv created (~970 KB, 7043 lines).',
    commonErrors: [
      {
        error: "FileNotFoundError: [Errno 2] No such file or directory: 'data/customer_churn.csv'",
        fix: "Verify that your terminal current working directory is the project root containing the 'data' directory."
      }
    ],
    interviewTip: 'Clarify that this is real-world telecommunication churn data with an imbalanced 73/27 non-churn/churn split.'
  },
  {
    stepNumber: 3,
    title: 'Project Directory Architecture',
    category: 'Architecture',
    objective: 'Organize the project into modular subdirectories separating raw data, artifacts, models, notebooks, and scripts.',
    terminalCommand: 'mkdir -p data notebooks models\ntouch app.py train_model.py requirements.txt README.md',
    expectedOutput: 'customer-churn-prediction/\n├── data/\n├── notebooks/\n├── models/\n├── app.py\n├── train_model.py\n├── requirements.txt\n└── README.md',
    interviewTip: 'Production teams never mix raw training code with deployment dashboards. Emphasize modular separation.'
  },
  {
    stepNumber: 4,
    title: 'Data Cleaning & Hygiene',
    category: 'Data Cleaning',
    objective: "Identify whitespace anomalies in 'TotalCharges', convert to numeric float, impute zero-tenure records, and drop identifiers.",
    fileName: 'train_model.py',
    codeSnippet: `df['TotalCharges'] = pd.to_numeric(df['TotalCharges'].astype(str).str.strip(), errors='coerce').fillna(0.0)\ndf = df.drop(columns=['customerID'])\ndf['Churn'] = df['Churn'].map({'Yes': 1, 'No': 0})`,
    expectedOutput: '[INFO] Cleaned dataset shape: (7043, 20), 0 missing values remain.',
    commonErrors: [
      {
        error: "ValueError: Unable to parse string ' ' at position 488",
        fix: "New customers with tenure=0 have spaces (' ') in TotalCharges. Use pd.to_numeric(..., errors='coerce').fillna(0.0)."
      }
    ],
    interviewTip: 'Point out that TotalCharges had 11 blank spaces for 0-month tenure accounts, which can silently break ML models if unhandled.'
  },
  {
    stepNumber: 5,
    title: 'Exploratory Data Analysis (EDA)',
    category: 'Analytics',
    objective: 'Analyze cross-tabulations and distributions to surface high-risk operational segments.',
    fileName: 'notebooks/churn_analysis.ipynb',
    terminalCommand: 'jupyter notebook notebooks/churn_analysis.ipynb',
    expectedOutput: 'Interactive visualizations: Contract churn (42% month-to-month vs 2.8% two-year), Payment method (45% electronic check).',
    interviewTip: 'Always communicate that statistical correlations (e.g. electronic checks) are risk associations, not causal proofs.'
  },
  {
    stepNumber: 6,
    title: 'Feature Engineering & Preprocessing Pipelines',
    category: 'Feature Engineering',
    objective: 'Build an automated ColumnTransformer applying StandardScaler to numerics and OneHotEncoder to categorical features.',
    fileName: 'train_model.py',
    codeSnippet: `preprocessor = ColumnTransformer([\n  ('num', Pipeline([('scaler', StandardScaler())]), num_cols),\n  ('cat', Pipeline([('onehot', OneHotEncoder(handle_unknown='ignore', drop='first'))]), cat_cols)\n])`,
    expectedOutput: 'Preprocessed feature matrix shape with 30 encoded dimensions.',
    interviewTip: 'Using ColumnTransformer inside a Pipeline completely eliminates data leakage because scalers only fit on training folds.'
  },
  {
    stepNumber: 7,
    title: 'Stratified Train/Test Split',
    category: 'Modeling',
    objective: 'Partition the dataset (80% train, 20% test) while preserving exact churn class proportions.',
    fileName: 'train_model.py',
    terminalCommand: 'python -c "from sklearn.model_selection import train_test_split; print(\'Ready\')"',
    expectedOutput: '[DATA SPLIT] Train: 5634 samples (26.5% churn) | Test: 1409 samples (26.5% churn)',
    interviewTip: 'Stratification is vital for imbalanced datasets. Random splitting could otherwise skew test-set evaluation.'
  },
  {
    stepNumber: 8,
    title: 'Train Multiple ML Architectures',
    category: 'Modeling',
    objective: 'Train diverse classifiers: Logistic Regression (balanced), Decision Tree, Random Forest, and XGBoost.',
    fileName: 'train_model.py',
    terminalCommand: 'python train_model.py',
    expectedOutput: 'Training Logistic Regression...\nTraining Decision Tree...\nTraining Random Forest...\nTraining XGBoost...',
    interviewTip: 'Comparing linear models with ensemble trees demonstrates thorough exploratory benchmarking.'
  },
  {
    stepNumber: 9,
    title: 'Cross-Model Evaluation & Confusion Matrices',
    category: 'Evaluation',
    objective: 'Compute Accuracy, Precision, Recall, F1 Score, and ROC-AUC for all candidate models.',
    fileName: 'train_model.py',
    expectedOutput: 'Model Benchmark Table:\n- Random Forest: Acc 80.4%, Prec 65.8%, Rec 56.1%, F1 60.6%, AUC 0.846\n- Logistic Reg (Bal): Acc 75.1%, Rec 79.7%, F1 63.1%',
    interviewTip: 'Emphasize that in churn prediction, False Negatives (missing a churner) are vastly more costly than False Positives.'
  },
  {
    stepNumber: 10,
    title: 'Select & Save Top Pipeline with Joblib',
    category: 'MLOps',
    objective: 'Persist the optimal trained Pipeline (transformer + model weights) into models/churn_model.pkl.',
    fileName: 'train_model.py',
    codeSnippet: `joblib.dump(best_pipeline, 'models/churn_model.pkl')`,
    expectedOutput: '[SAVING] Exporting best pipeline to: models/churn_model.pkl (Success)',
    interviewTip: 'Saving the full Pipeline guarantees that incoming inference features undergo the exact same encoding and scaling as training.'
  },
  {
    stepNumber: 11,
    title: 'Build Streamlit Interactive Dashboard',
    category: 'Deployment',
    objective: 'Develop the user interface featuring executive KPIs, interactive charts, and a real-time churn scoring form.',
    fileName: 'app.py',
    terminalCommand: 'streamlit run app.py',
    expectedOutput: 'Local URL: http://localhost:8501\nNetwork URL: http://192.168.x.x:8501',
    interviewTip: 'A live dashboard makes machine learning tangible and actionable for business stakeholders and recruiters.'
  },
  {
    stepNumber: 12,
    title: 'End-to-End Application Testing',
    category: 'QA & Testing',
    objective: 'Validate edge-case inputs (tenure=0, new contracts, extreme monthly charges) to ensure robust error handling.',
    terminalCommand: 'python -c "import joblib; model=joblib.load(\'models/churn_model.pkl\'); print(\'Model loaded successfully\')"',
    expectedOutput: 'Model loaded successfully without deprecation or dimension warnings.',
    interviewTip: 'Testing boundary values proves your code is defensive and production-hardened.'
  },
  {
    stepNumber: 13,
    title: 'Freeze Requirements (requirements.txt)',
    category: 'Reproducibility',
    objective: 'Lock compatible package versions to ensure reproducible environments on Streamlit Cloud and GitHub.',
    fileName: 'requirements.txt',
    terminalCommand: 'pip freeze > requirements.txt  # Or use the curated requirements.txt provided',
    expectedOutput: 'Created requirements.txt with pinned versions.',
    interviewTip: 'Excluding development-only packages from requirements.txt prevents build failures on cloud platforms.'
  },
  {
    stepNumber: 14,
    title: 'Version Control & GitHub Publishing',
    category: 'Git & GitHub',
    objective: 'Initialize Git, commit all project files, and push to a clean public GitHub repository.',
    terminalCommand: 'git init\ngit add .\ngit commit -m "feat: Initial commit of Customer Churn AI system by Swapna V"\ngit branch -M main\ngit remote add origin https://github.com/SwapnaV/customer-churn-prediction.git\ngit push -u origin main',
    expectedOutput: 'Branch main set up to track remote branch main from origin.',
    interviewTip: 'A well-structured GitHub repo with informative commit messages is a key portfolio differentiator.'
  },
  {
    stepNumber: 15,
    title: 'Deploy to Streamlit Community Cloud',
    category: 'Cloud Deployment',
    objective: 'Deploy the live application directly from GitHub onto free, shareable cloud infrastructure.',
    terminalCommand: 'Navigate to https://share.streamlit.io -> New App -> Select Repository -> Path: app.py -> Deploy',
    expectedOutput: 'Live app URL generated: https://swapnav-customer-churn.streamlit.app',
    interviewTip: 'Recruiters can click a live URL to test your ML system immediately without setting up any code.'
  },
  {
    stepNumber: 16,
    title: 'Resume & Portfolio Framing (Swapna V)',
    category: 'Career & Interview',
    objective: 'Frame this project on your resume with quantifiable metrics and mathematical precision.',
    expectedOutput: 'Resume ready bullet points highlighting 80.4% accuracy, 0.846 ROC-AUC, ColumnTransformer pipelines, and Streamlit delivery.',
    interviewTip: 'Mentioning your M.Sc. Mathematics background alongside class-imbalance loss functions and probabilistic calibration makes a memorable impression.'
  },
  {
    stepNumber: 17,
    title: 'Professional GitHub README & Documentation',
    category: 'Documentation',
    objective: 'Provide a complete markdown README with architecture diagrams, comparison tables, and quick-start steps.',
    fileName: 'README.md',
    expectedOutput: 'A clean, formatted README showcasing Swapna V branding and methodology.',
    interviewTip: 'A great README is often the first thing hiring managers and senior data scientists inspect.'
  }
];
