# Customer Churn Prediction Using Machine Learning
**Developed by Swapna V**  
**Python | Machine Learning | Data Analytics | Streamlit**  
*M.Sc. Mathematics | AI & Machine Learning / Data Analytics*

---

## 📌 Executive Summary
Customer attrition directly impacts recurring enterprise revenue. This end-to-end Machine Learning project predicts customer churn using the industry-standard **Telco Customer Churn** dataset. 

The project adheres to professional ML engineering practices:
- **Zero Data Leakage:** Encapsulates feature transformation (`StandardScaler`, `OneHotEncoder`) and model estimators inside a single unified Scikit-learn `Pipeline`.
- **Stratified Validation:** Maintains class distribution (73.4% non-churn, 26.6% churn) during train/test splits.
- **Model Diversity:** Benchmarks Logistic Regression, Decision Tree, Random Forest, and XGBoost.
- **Business Metric Alignment:** Prioritizes F1-score and Recall over raw accuracy to capture true at-risk churners.
- **Production Deployment:** Interactive Streamlit web application providing live probability scoring, risk tiering, and explainability.

---

## 🏗️ Project Architecture
```
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
```

---

## 📊 Exploratory Data Analysis & Business Insights
Key statistical associations identified in historical customer cohorts:
1. **Contract Duration:** Month-to-month contracts demonstrate a ~42% churn rate compared to <3% for two-year contracts.
2. **Internet Infrastructure:** Fiber optic customers exhibit heightened churn (~41%) linked to higher monthly pricing elasticity.
3. **Billing Modality:** Electronic check customers experience the highest attrition (~45%), whereas automatic bank drafts foster loyalty.
4. **Tenure Dynamics:** Customers in their first 0–12 months represent over 50% of total churn incidents.

*Note: In alignment with statistical best practices, these factors are identified as predictive associations rather than causal mechanisms.*

---

## 🏆 Model Benchmarking & Results

| Model | Accuracy | Precision | Recall | F1 Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Random Forest Classifier** | **80.4%** | **65.8%** | 56.1% | **60.6%** | **0.846** |
| **Logistic Regression (Balanced)** | 75.1% | 52.2% | **79.7%** | **63.1%** | **0.842** |
| **XGBoost Classifier** | 79.8% | 64.2% | 54.8% | 59.1% | 0.839 |
| **Decision Tree Classifier** | 76.8% | 56.9% | 51.2% | 53.9% | 0.743 |

---

## 🚀 Quick Start Guide

### 1. Clone & Set Up Virtual Environment
```bash
git clone https://github.com/your-username/customer-churn-prediction.git
cd customer-churn-prediction
python -m venv venv

# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Train the Model
```bash
python train_model.py
```

### 4. Launch the Streamlit Dashboard
```bash
streamlit run app.py
```

---

## 🔮 Streamlit Cloud Deployment
1. Push your repository to GitHub.
2. Visit [share.streamlit.io](https://share.streamlit.io/).
3. Connect your repository, select branch `main` and main file path `app.py`.
4. Click **Deploy**.

---

<div align="center">
  <b>Developed by Swapna V | Machine Learning & Data Analytics Project</b><br>
  <i>M.Sc. Mathematics | Python | Data Analytics | Machine Learning | Generative AI</i>
</div>
