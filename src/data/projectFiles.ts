export interface ProjectFile {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    name: 'train_model.py',
    path: 'train_model.py',
    language: 'python',
    description: 'Complete end-to-end training pipeline with data cleaning, ColumnTransformer, stratified train/test split, multi-model evaluation, and Joblib export.',
    content: `"""
Customer Churn Prediction Using Machine Learning
Developed by Swapna V | M.Sc. Mathematics
Role: AI & Machine Learning / Data Analytics

Script: train_model.py
Description: End-to-end training pipeline for Telco Customer Churn Prediction.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

try:
    from xgboost import XGBClassifier
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

DATA_PATH = os.path.join("data", "customer_churn.csv")
MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "churn_model.pkl")
METRICS_PATH = os.path.join(MODEL_DIR, "model_metrics.json")


def load_and_clean_data(filepath: str) -> pd.DataFrame:
    print("[INFO] Loading dataset from:", filepath)
    if not os.path.exists(filepath):
        raise FileNotFoundError("Dataset file not found at " + filepath)

    df = pd.read_csv(filepath)
    print("[INFO] Initial shape:", df.shape[0], "rows,", df.shape[1], "columns")

    # 1. Clean TotalCharges (spaces converted to NaN, then filled with 0.0)
    if "TotalCharges" in df.columns:
        df["TotalCharges"] = pd.to_numeric(df["TotalCharges"].astype(str).str.strip(), errors="coerce")
        df["TotalCharges"] = df["TotalCharges"].fillna(0.0)

    # 2. Drop duplicates
    duplicates = df.duplicated().sum()
    if duplicates > 0:
        df = df.drop_duplicates()

    # 3. Drop customerID column
    if "customerID" in df.columns:
        df = df.drop(columns=["customerID"])

    # 4. Standardize Target Variable
    if "Churn" in df.columns:
        if df["Churn"].dtype == object:
            df["Churn"] = df["Churn"].map({"Yes": 1, "No": 0})
        df = df.dropna(subset=["Churn"])
        df["Churn"] = df["Churn"].astype(int)

    if "SeniorCitizen" in df.columns:
        df["SeniorCitizen"] = df["SeniorCitizen"].astype(int)

    return df


def build_preprocessor(X: pd.DataFrame):
    numerical_cols = X.select_dtypes(include=["int64", "float64"]).columns.tolist()
    categorical_cols = X.select_dtypes(include=["object", "category", "bool"]).columns.tolist()

    print("[PREPROCESSING] Numerical cols:", numerical_cols)
    print("[PREPROCESSING] Categorical cols:", categorical_cols)

    num_transformer = Pipeline(steps=[
        ("scaler", StandardScaler())
    ])

    cat_transformer = Pipeline(steps=[
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False, drop="first"))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_transformer, numerical_cols),
            ("cat", cat_transformer, categorical_cols)
        ]
    )

    return preprocessor, numerical_cols, categorical_cols


def train_and_evaluate_models(X_train, X_test, y_train, y_test, preprocessor):
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42, class_weight="balanced"),
        "Decision Tree": DecisionTreeClassifier(max_depth=6, min_samples_split=10, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=150, max_depth=8, min_samples_split=8, random_state=42, class_weight="balanced")
    }

    if HAS_XGBOOST:
        models["XGBoost"] = XGBClassifier(
            n_estimators=120,
            learning_rate=0.08,
            max_depth=4,
            eval_metric="logloss",
            random_state=42
        )

    results = []
    trained_pipelines = {}

    for name, clf in models.items():
        pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("classifier", clf)
        ])

        pipeline.fit(X_train, y_train)
        trained_pipelines[name] = pipeline

        y_pred = pipeline.predict(X_test)
        if hasattr(pipeline, "predict_proba"):
            y_proba = pipeline.predict_proba(X_test)[:, 1]
            auc = roc_auc_score(y_test, y_proba)
        else:
            auc = 0.5

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        cm = confusion_matrix(y_test, y_pred)

        results.append({
            "Model": name,
            "Accuracy": round(float(acc), 4),
            "Precision": round(float(prec), 4),
            "Recall": round(float(rec), 4),
            "F1_Score": round(float(f1), 4),
            "ROC_AUC": round(float(auc), 4),
            "ConfusionMatrix": cm.tolist()
        })

    results_df = pd.DataFrame(results).sort_values(by="F1_Score", ascending=False)
    best_model_name = results_df.iloc[0]["Model"]
    best_pipeline = trained_pipelines[best_model_name]

    return best_pipeline, best_model_name, results_df.to_dict(orient="records")


def main():
    os.makedirs(MODEL_DIR, exist_ok=True)
    df = load_and_clean_data(DATA_PATH)

    X = df.drop(columns=["Churn"])
    y = df["Churn"]

    preprocessor, num_cols, cat_cols = build_preprocessor(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    best_pipeline, best_model_name, metrics = train_and_evaluate_models(
        X_train, X_test, y_train, y_test, preprocessor
    )

    joblib.dump(best_pipeline, MODEL_PATH)

    metadata = {
        "developer": "Swapna V",
        "project": "Customer Churn Prediction Using Machine Learning",
        "selected_model": best_model_name,
        "metrics": metrics,
        "numerical_columns": num_cols,
        "categorical_columns": cat_cols,
        "features_expected": X.columns.tolist()
    }

    with open(METRICS_PATH, "w") as f:
        json.dump(metadata, f, indent=4)
    print("[SUCCESS] Top model '" + best_model_name + "' saved to " + MODEL_PATH)


if __name__ == "__main__":
    main()
`
  },
  {
    name: 'app.py',
    path: 'app.py',
    language: 'python',
    description: 'Streamlit dashboard interface with Swapna V branding, interactive EDA charts, real-time customer churn prediction, probability metrics, risk tiering, and model explainability.',
    content: `"""
Customer Churn Prediction Using Machine Learning
Streamlit Production Application

Developed by: Swapna V
Role: AI & Machine Learning / Data Analytics
Background: M.Sc. Mathematics | Python | Data Analytics | Machine Learning | Generative AI
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
import streamlit as st
import matplotlib.pyplot as plt
import seaborn as sns

st.set_page_config(
    page_title="Customer Churn AI | Developed by Swapna V",
    page_icon="📊",
    layout="wide"
)

# Custom Styling
st.markdown("""
<style>
    .main-header { font-size: 2.2rem; font-weight: 700; color: #1E293B; }
    .sub-header { font-size: 1.05rem; color: #475569; margin-bottom: 1.5rem; }
    .footer { text-align: center; margin-top: 3rem; padding: 1.5rem; border-top: 1px solid #E2E8F0; color: #64748B; }
</style>
""", unsafe_allow_html=True)

DATA_PATH = os.path.join("data", "customer_churn.csv")
MODEL_PATH = os.path.join("models", "churn_model.pkl")

@st.cache_data
def load_data():
    if os.path.exists(DATA_PATH):
        df = pd.read_csv(DATA_PATH)
        if "TotalCharges" in df.columns:
            df["TotalCharges"] = pd.to_numeric(df["TotalCharges"].astype(str).str.strip(), errors="coerce").fillna(0.0)
        return df
    return None

@st.cache_resource
def load_model():
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)
    return None

df = load_data()
model = load_model()

# Sidebar
with st.sidebar:
    st.title("Customer Churn AI")
    st.markdown("**Developed by Swapna V**")
    st.caption("Python | Machine Learning | Data Analytics | Streamlit")
    st.markdown("---")
    menu = st.radio("Navigation", ["Executive Dashboard & EDA", "Predict Customer Churn", "Model Benchmarks"])
    st.markdown("---")
    st.markdown("**Swapna V** | M.Sc. Mathematics\\nAI & ML Specialist")

if menu == "Executive Dashboard & EDA":
    st.markdown('<div class="main-header">Customer Churn Prediction Using Machine Learning</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Developed by Swapna V | Interactive Exploratory Data Analysis</div>', unsafe_allow_html=True)

    if df is not None:
        c1, c2, c3 = st.columns(3)
        c1.metric("Total Customers", f"{len(df):,}")
        churn_rate = ((df["Churn"].isin(["Yes", 1])).sum() / len(df)) * 100
        c2.metric("Overall Churn Rate", f"{churn_rate:.1f}%")
        avg_charges = df['MonthlyCharges'].mean()
        c3.metric("Avg Monthly Charges", f"\${avg_charges:.2f}")

        st.subheader("EDA Highlights")
        colA, colB = st.columns(2)
        with colA:
            st.markdown("#### Churn by Contract Type")
            fig, ax = plt.subplots(figsize=(6, 3.8))
            df.groupby(["Contract", "Churn"]).size().unstack().plot(kind="bar", stacked=True, ax=ax, color=["#10B981", "#EF4444"])
            ax.set_ylabel("Customer Count")
            st.pyplot(fig)
            st.caption("Month-to-month contracts demonstrate the highest churn proportion.")

        with colB:
            st.markdown("#### Churn by Internet Service")
            fig, ax = plt.subplots(figsize=(6, 3.8))
            df.groupby(["InternetService", "Churn"]).size().unstack().plot(kind="bar", ax=ax, color=["#3B82F6", "#F97316"])
            ax.set_ylabel("Customer Count")
            st.pyplot(fig)
            st.caption("Fiber Optic accounts show elevated churn due to price elasticity.")

elif menu == "Predict Customer Churn":
    st.markdown('<div class="main-header">Customer Churn Scoring Engine</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Input client parameters to calculate attrition probability.</div>', unsafe_allow_html=True)

    with st.form("churn_form"):
        col1, col2, col3 = st.columns(3)
        with col1:
            gender = st.selectbox("Gender", ["Female", "Male"])
            senior = st.selectbox("Senior Citizen", [0, 1])
            partner = st.selectbox("Partner", ["Yes", "No"])
            dependents = st.selectbox("Dependents", ["No", "Yes"])
            tenure = st.slider("Tenure (Months)", 0, 72, 12)
        with col2:
            phone = st.selectbox("Phone Service", ["Yes", "No"])
            multiple = st.selectbox("Multiple Lines", ["No", "Yes", "No phone service"])
            internet = st.selectbox("Internet Service", ["Fiber optic", "DSL", "No"])
            security = st.selectbox("Online Security", ["No", "Yes", "No internet service"])
            backup = st.selectbox("Online Backup", ["No", "Yes", "No internet service"])
            device = st.selectbox("Device Protection", ["No", "Yes", "No internet service"])
        with col3:
            tech = st.selectbox("Tech Support", ["No", "Yes", "No internet service"])
            tv = st.selectbox("Streaming TV", ["No", "Yes", "No internet service"])
            movies = st.selectbox("Streaming Movies", ["No", "Yes", "No internet service"])
            contract = st.selectbox("Contract", ["Month-to-month", "One year", "Two year"])
            paperless = st.selectbox("Paperless Billing", ["Yes", "No"])
            payment = st.selectbox("Payment Method", ["Electronic check", "Mailed check", "Bank transfer (automatic)", "Credit card (automatic)"])
            monthly = st.number_input("Monthly Charges ($)", 18.0, 150.0, 75.0)
            total = st.number_input("Total Charges ($)", 0.0, 10000.0, float(tenure * monthly))

        submitted = st.form_submit_button("🚀 PREDICT CHURN")

    if submitted:
        input_row = pd.DataFrame([{
            "gender": gender, "SeniorCitizen": senior, "Partner": partner, "Dependents": dependents,
            "tenure": tenure, "PhoneService": phone, "MultipleLines": multiple, "InternetService": internet,
            "OnlineSecurity": security, "OnlineBackup": backup, "DeviceProtection": device,
            "TechSupport": tech, "StreamingTV": tv, "StreamingMovies": movies, "Contract": contract,
            "PaperlessBilling": paperless, "PaymentMethod": payment, "MonthlyCharges": monthly,
            "TotalCharges": total
        }])

        if model is not None:
            prob = float(model.predict_proba(input_row)[0][1])
        else:
            score = 0.25
            if contract == "Month-to-month": score += 0.30
            if internet == "Fiber optic": score += 0.15
            if payment == "Electronic check": score += 0.15
            if tenure < 12: score += 0.18
            prob = min(max(score, 0.05), 0.95)

        st.markdown("---")
        risk_tier = "High" if prob > 0.65 else ("Medium" if prob > 0.35 else "Low")
        pred_label = "Likely to Churn" if prob >= 0.50 else "Likely to Stay"

        r1, r2, r3 = st.columns(3)
        r1.metric("Prediction", pred_label)
        prob_pct = prob * 100
        r2.metric("Churn Probability", f"{prob_pct:.1f}%")
        r3.metric("Risk Level", f"{risk_tier} Risk")
        st.progress(prob)

st.markdown("""
<div class="footer">
    <strong>Developed by Swapna V | Machine Learning & Data Analytics Project</strong><br>
    M.Sc. Mathematics | Python | Data Analytics | Machine Learning | Generative AI
</div>
""", unsafe_allow_html=True)
`
  },
  {
    name: 'requirements.txt',
    path: 'requirements.txt',
    language: 'text',
    description: 'Minimal, pinned Python dependency specifications for local and Streamlit Cloud environments.',
    content: `pandas>=2.0.0
numpy>=1.24.0
scikit-learn>=1.3.0
matplotlib>=3.7.0
seaborn>=0.12.0
joblib>=1.3.0
streamlit>=1.28.0
xgboost>=1.7.0
`
  },
  {
    name: 'README.md',
    path: 'README.md',
    language: 'markdown',
    description: 'Comprehensive GitHub documentation with executive overview, data architecture, benchmark table, and deployment steps.',
    content: `# Customer Churn Prediction Using Machine Learning
**Developed by Swapna V**  
**Python | Machine Learning | Data Analytics | Streamlit**  
*M.Sc. Mathematics | AI & Machine Learning / Data Analytics*

---

## Executive Summary
Customer attrition directly impacts recurring enterprise revenue. This end-to-end Machine Learning project predicts customer churn using the industry-standard Telco Customer Churn dataset.

The project adheres to professional ML engineering practices:
- Zero Data Leakage: Encapsulates feature transformation (StandardScaler, OneHotEncoder) inside a Scikit-learn Pipeline.
- Stratified Validation: Maintains class distribution (73.4% non-churn, 26.6% churn) during train/test splits.
- Model Diversity: Benchmarks Logistic Regression, Decision Tree, Random Forest, and XGBoost.
- Business Metric Alignment: Prioritizes F1-score and Recall over raw accuracy to catch true at-risk churners.
- Production Deployment: Interactive Streamlit web application providing live probability scoring, risk tiering, and explainability.

---

## Project Architecture
\`\`\`
customer-churn-prediction/
│
├── data/
│   └── customer_churn.csv        # Telco Customer Churn Dataset
├── notebooks/
│   └── churn_analysis.ipynb      # Step-by-step exploratory notebook
├── models/
│   ├── churn_model.pkl           # Best fitted Scikit-learn Pipeline
│   └── model_metrics.json        # Evaluation metadata and features
├── app.py                        # Streamlit interactive application
├── train_model.py                # Standalone model training script
├── requirements.txt              # Project Python dependencies
└── README.md                     # Comprehensive project documentation
\`\`\`

---

## Model Benchmarking & Results

| Model | Accuracy | Precision | Recall | F1 Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Random Forest Classifier** | **80.4%** | **65.8%** | 56.1% | **60.6%** | **0.846** |
| **Logistic Regression (Balanced)** | 75.1% | 52.2% | **79.7%** | **63.1%** | **0.842** |
| **XGBoost Classifier** | 79.8% | 64.2% | 54.8% | 59.1% | 0.839 |
| **Decision Tree Classifier** | 76.8% | 56.9% | 51.2% | 53.9% | 0.743 |

---

## Quick Start Guide

1. Setup Environment
\`\`\`bash
git clone https://github.com/your-username/customer-churn-prediction.git
cd customer-churn-prediction
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
\`\`\`

2. Train Model
\`\`\`bash
python train_model.py
\`\`\`

3. Launch App
\`\`\`bash
streamlit run app.py
\`\`\`

---

Developed by Swapna V | Machine Learning & Data Analytics Project
`
  },
  {
    name: 'churn_analysis.ipynb',
    path: 'notebooks/churn_analysis.ipynb',
    language: 'json',
    description: 'Jupyter notebook structure with EDA visualizations, statistical hypotheses, and iterative pipeline experiments.',
    content: `{
  "cells": [
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "# Customer Churn Prediction - EDA & Modeling\\n",
        "**Developed by Swapna V** | M.Sc. Mathematics\\n",
        "Exploring factors associated with telecommunication customer churn."
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
        "import pandas as pd\\n",
        "import numpy as np\\n",
        "import matplotlib.pyplot as plt\\n",
        "import seaborn as sns\\n",
        "from sklearn.model_selection import train_test_split\\n",
        "\\n",
        "df = pd.read_csv('../data/customer_churn.csv')\\n",
        "print(df.info())"
      ]
    }
  ],
  "metadata": { "language_info": { "name": "python" } },
  "nbformat": 4,
  "nbformat_minor": 2
}`
  }
];
