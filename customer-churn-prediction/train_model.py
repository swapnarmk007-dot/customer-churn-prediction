"""
Customer Churn Prediction Using Machine Learning
Developed by Swapna V | M.Sc. Mathematics
Role: AI & Machine Learning / Data Analytics

Script: train_model.py
Description: End-to-end training pipeline for Telco Customer Churn Prediction.
             Handles data loading, rigorous cleaning, automated feature typing,
             preprocessing via ColumnTransformer & Pipeline, multi-model evaluation
             (Logistic Regression, Decision Tree, Random Forest, XGBoost),
             and serializes the top-performing pipeline with Joblib.
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

# Optional XGBoost import with safe fallback
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
    """
    Loads Telco Customer Churn dataset and executes clean data transformations:
    - Handles whitespace strings in TotalCharges
    - Converts TotalCharges to float64
    - Imputes 0 for zero-tenure new customers
    - Drops customerID identifier column
    - Encodes binary target Churn ('Yes'->1, 'No'->0)
    """
    print(f"[INFO] Loading dataset from: {filepath}")
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset file not found at {filepath}. Please verify path.")

    df = pd.read_csv(filepath)
    print(f"[INFO] Initial shape: {df.shape[0]} rows, {df.shape[1]} columns")

    # 1. Clean TotalCharges (spaces converted to NaN, then filled)
    if "TotalCharges" in df.columns:
        df["TotalCharges"] = pd.to_numeric(df["TotalCharges"].astype(str).str.strip(), errors="coerce")
        # For tenure = 0, TotalCharges is naturally 0.0
        df["TotalCharges"] = df["TotalCharges"].fillna(0.0)

    # 2. Drop duplicates if any
    duplicates = df.duplicated().sum()
    if duplicates > 0:
        print(f"[INFO] Dropping {duplicates} duplicate rows...")
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

    # Check SeniorCitizen as categorical or int
    if "SeniorCitizen" in df.columns:
        df["SeniorCitizen"] = df["SeniorCitizen"].astype(int)

    print(f"[INFO] Cleaned dataset shape: {df.shape}")
    print(f"[INFO] Churn class distribution:\n{df['Churn'].value_counts(normalize=True).round(3)}")
    return df


def build_preprocessor(X: pd.DataFrame):
    """
    Automatically detects numerical and categorical features and
    constructs a leak-free ColumnTransformer pipeline.
    """
    numerical_cols = X.select_dtypes(include=["int64", "float64"]).columns.tolist()
    # If SeniorCitizen is binary 0/1, we can treat it as categorical or numeric.
    # Treating binary flags cleanly:
    categorical_cols = X.select_dtypes(include=["object", "category", "bool"]).columns.tolist()

    print("\n[PREPROCESSING] Feature Architecture:")
    print(f"  Numerical columns ({len(numerical_cols)}): {numerical_cols}")
    print(f"  Categorical columns ({len(categorical_cols)}): {categorical_cols}")

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
    """
    Trains multiple ML algorithms through scikit-learn Pipelines,
    evaluates using stratified test sets, and compiles a comparison table.
    """
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

    print("\n" + "=" * 65)
    print(" MODEL TRAINING & PERFORMANCE BENCHMARKING (Swapna V)")
    print("=" * 65)

    for name, clf in models.items():
        pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("classifier", clf)
        ])

        # Fit model on training partition only
        pipeline.fit(X_train, y_train)
        trained_pipelines[name] = pipeline

        # Predictions
        y_pred = pipeline.predict(X_test)
        if hasattr(pipeline, "predict_proba"):
            y_proba = pipeline.predict_proba(X_test)[:, 1]
            auc = roc_auc_score(y_test, y_proba)
        else:
            y_proba = y_pred
            auc = 0.5

        # Metrics
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

        print(f"\n--- {name} ---")
        print(f"Accuracy:  {acc:.4f} | Precision: {prec:.4f} | Recall: {rec:.4f} | F1: {f1:.4f} | AUC: {auc:.4f}")
        print("Confusion Matrix:\n", cm)

    results_df = pd.DataFrame(results).sort_values(by="F1_Score", ascending=False)
    print("\n" + "=" * 65)
    print(" FINAL COMPARISON TABLE (Ranked by F1-Score)")
    print("=" * 65)
    print(results_df[["Model", "Accuracy", "Precision", "Recall", "F1_Score", "ROC_AUC"]].to_string(index=False))

    # Best model selection based on F1 Score (critical for imbalanced churn datasets)
    best_model_name = results_df.iloc[0]["Model"]
    best_pipeline = trained_pipelines[best_model_name]
    print(f"\n>> Selected Best Model: '{best_model_name}' with F1-Score of {results_df.iloc[0]['F1_Score']}")

    return best_pipeline, best_model_name, results_df.to_dict(orient="records")


def main():
    print("================================================================")
    print("   Customer Churn Prediction Using Machine Learning")
    print("   Developed by Swapna V | AI & Machine Learning / Data Analytics")
    print("================================================================")

    os.makedirs(MODEL_DIR, exist_ok=True)

    # 1. Load and clean
    df = load_and_clean_data(DATA_PATH)

    # 2. Features and Target separation
    X = df.drop(columns=["Churn"])
    y = df["Churn"]

    # 3. Automated preprocessing pipeline
    preprocessor, num_cols, cat_cols = build_preprocessor(X)

    # 4. Stratified Train/Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"\n[DATA SPLIT] Train: {X_train.shape[0]} samples | Test: {X_test.shape[0]} samples")

    # 5. Train & Evaluate
    best_pipeline, best_model_name, metrics_records = train_and_evaluate_models(
        X_train, X_test, y_train, y_test, preprocessor
    )

    # 6. Save Model and Metadata
    print(f"\n[SAVING] Exporting best pipeline to: {MODEL_PATH}")
    joblib.dump(best_pipeline, MODEL_PATH)

    metadata = {
        "developer": "Swapna V",
        "project": "Customer Churn Prediction Using Machine Learning",
        "selected_model": best_model_name,
        "metrics": metrics_records,
        "numerical_columns": num_cols,
        "categorical_columns": cat_cols,
        "features_expected": X.columns.tolist()
    }

    with open(METRICS_PATH, "w") as f:
        json.dump(metadata, f, indent=4)
    print(f"[SAVING] Metadata saved to: {METRICS_PATH}")
    print("\n[SUCCESS] Model training pipeline complete! Ready for Streamlit UI.")


if __name__ == "__main__":
    main()
