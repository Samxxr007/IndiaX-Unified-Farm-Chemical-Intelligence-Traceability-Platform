"""
IndiaX — Machine Learning Model Training Pipeline
Trains explainable Random Forest and XGBoost models for all 7 AI intelligence modules.
"""

import sys
import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, mean_absolute_error, r2_score

# Set UTF-8 encoding for stdout
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, 'data')
MODEL_DIR = os.path.join(BASE_DIR, 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

metrics_report = {}

# ── 1. TRAIN PESTICIDE RISK MODELS ──────────────────────────────────────────

def train_pesticide_models():
    print("\n--- Training Model 1 & 2: Pesticide Risk Classification & Scoring ---")
    data_path = os.path.join(DATA_DIR, 'crop_pesticide_dataset.csv')
    df = pd.read_csv(data_path)
    
    feature_cols = [
        'crop', 'soil_type', 'chemical_class', 'is_banned',
        'dosage_applied', 'recommended_dose', 'dosage_ratio',
        'application_frequency', 'days_since_last_spray',
        'temperature_c', 'humidity_pct', 'rainfall_mm',
        'phi_days_required'
    ]
    
    X = df[feature_cols].copy()
    y_class = df['risk_level']
    y_score = df['risk_score']
    
    encoders = {}
    for col in ['crop', 'soil_type', 'chemical_class']:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        encoders[col] = le
        
    joblib.dump(encoders, os.path.join(MODEL_DIR, 'crop_encoders.joblib'))
    
    X_train, X_test, y_cls_train, y_cls_test, y_reg_train, y_reg_test = train_test_split(
        X, y_class, y_score, test_size=0.2, random_state=42
    )
    
    clf = RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42)
    clf.fit(X_train, y_cls_train)
    y_pred_cls = clf.predict(X_test)
    acc = accuracy_score(y_cls_test, y_pred_cls)
    
    reg = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    reg.fit(X_train, y_reg_train)
    y_pred_reg = reg.predict(X_test)
    mae = mean_absolute_error(y_reg_test, y_pred_reg)
    r2 = r2_score(y_reg_test, y_pred_reg)
    
    print(f"[OK] Pesticide Risk Classifier Accuracy: {acc * 100:.2f}%")
    print(f"[OK] Pesticide Risk Score Regressor MAE: {mae:.2f}, R2: {r2:.3f}")
    
    joblib.dump(clf, os.path.join(MODEL_DIR, 'pesticide_risk_classifier.joblib'))
    joblib.dump(reg, os.path.join(MODEL_DIR, 'pesticide_risk_regressor.joblib'))
    
    metrics_report['pesticide_risk'] = {
        'model_type': 'RandomForestClassifier + RandomForestRegressor',
        'accuracy': round(float(acc), 4),
        'mae': round(float(mae), 4),
        'r2_score': round(float(r2), 4),
        'features': feature_cols,
        'classes': list(clf.classes_)
    }

# ── 2. TRAIN HARVEST SAFETY (PHI) MODELS ─────────────────────────────────────

def train_harvest_safety_models():
    print("\n--- Training Model 3: Harvest Safety & PHI Chronometer ---")
    data_path = os.path.join(DATA_DIR, 'crop_pesticide_dataset.csv')
    df = pd.read_csv(data_path)
    
    feature_cols = [
        'crop', 'chemical_class', 'dosage_ratio',
        'days_since_last_spray', 'phi_days_required',
        'temperature_c', 'rainfall_mm'
    ]
    
    X = df[feature_cols].copy()
    y_safe = df['is_harvest_safe']
    y_remaining = df['days_remaining_to_safe_harvest']
    
    encoders = joblib.load(os.path.join(MODEL_DIR, 'crop_encoders.joblib'))
    for col in ['crop', 'chemical_class']:
        X[col] = encoders[col].transform(X[col])
        
    X_train, X_test, y_s_train, y_s_test, y_r_train, y_r_test = train_test_split(
        X, y_safe, y_remaining, test_size=0.2, random_state=42
    )
    
    clf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    clf.fit(X_train, y_s_train)
    acc = accuracy_score(y_s_test, clf.predict(X_test))
    
    reg = RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42)
    reg.fit(X_train, y_r_train)
    mae = mean_absolute_error(y_r_test, reg.predict(X_test))
    
    print(f"[OK] Harvest Safety Predictor Accuracy: {acc * 100:.2f}%")
    print(f"[OK] Days Remaining Regressor MAE: {mae:.2f} days")
    
    joblib.dump(clf, os.path.join(MODEL_DIR, 'harvest_safety_classifier.joblib'))
    joblib.dump(reg, os.path.join(MODEL_DIR, 'harvest_remaining_days_regressor.joblib'))
    
    metrics_report['harvest_safety'] = {
        'model_type': 'RandomForestClassifier + Regressor',
        'accuracy': round(float(acc), 4),
        'days_mae': round(float(mae), 4)
    }

# ── 3. TRAIN VETERINARY ANTIMICROBIAL (AMU) MODELS ───────────────────────────

def train_veterinary_amu_models():
    print("\n--- Training Model 4 & 5: Antimicrobial Misuse & AMR Resistance Detection ---")
    data_path = os.path.join(DATA_DIR, 'veterinary_amu_dataset.csv')
    df = pd.read_csv(data_path)
    
    feature_cols = [
        'animal_species', 'animal_weight_kg', 'drug_class',
        'who_cia_category', 'administered_dose_mg_kg',
        'standard_dose_mg_kg', 'duration_days', 'standard_duration_days'
    ]
    
    X = df[feature_cols].copy()
    y_misuse = df['is_misuse']
    y_amr_score = df['amr_risk_score']
    
    vet_encoders = {}
    for col in ['animal_species', 'drug_class', 'who_cia_category']:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        vet_encoders[col] = le
        
    joblib.dump(vet_encoders, os.path.join(MODEL_DIR, 'vet_encoders.joblib'))
    
    X_train, X_test, y_m_train, y_m_test, y_s_train, y_s_test = train_test_split(
        X, y_misuse, y_amr_score, test_size=0.2, random_state=42
    )
    
    clf = RandomForestClassifier(n_estimators=120, max_depth=10, random_state=42)
    clf.fit(X_train, y_m_train)
    acc = accuracy_score(y_m_test, clf.predict(X_test))
    
    reg = RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42)
    reg.fit(X_train, y_s_train)
    mae = mean_absolute_error(y_s_test, reg.predict(X_test))
    
    print(f"[OK] AMU Misuse Classifier Accuracy: {acc * 100:.2f}%")
    print(f"[OK] AMR Risk Score Regressor MAE: {mae:.2f}")
    
    joblib.dump(clf, os.path.join(MODEL_DIR, 'vet_misuse_classifier.joblib'))
    joblib.dump(reg, os.path.join(MODEL_DIR, 'vet_amr_score_regressor.joblib'))
    
    metrics_report['veterinary_amu'] = {
        'model_type': 'RandomForestClassifier + Regressor',
        'accuracy': round(float(acc), 4),
        'score_mae': round(float(mae), 4)
    }

# ── 4. TRAIN ONE HEALTH CROSS-CONTAMINATION MODELS ───────────────────────────

def train_cross_contamination_models():
    print("\n--- Training Model 6: One Health Cross-Contamination Engine ---")
    data_path = os.path.join(DATA_DIR, 'cross_contamination_dataset.csv')
    df = pd.read_csv(data_path)
    
    feature_cols = [
        'source_herd', 'target_crop', 'antibiotic_administered',
        'is_antibiotic_treated', 'composting_buffer_days',
        'soil_ph', 'irrigation_method'
    ]
    
    X = df[feature_cols].copy()
    y_score = df['contamination_risk_score']
    y_level = df['contamination_risk_level']
    
    oh_encoders = {}
    for col in ['source_herd', 'target_crop', 'antibiotic_administered', 'irrigation_method']:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        oh_encoders[col] = le
        
    joblib.dump(oh_encoders, os.path.join(MODEL_DIR, 'one_health_encoders.joblib'))
    
    X_train, X_test, y_lvl_train, y_lvl_test, y_s_train, y_s_test = train_test_split(
        X, y_level, y_score, test_size=0.2, random_state=42
    )
    
    clf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    clf.fit(X_train, y_lvl_train)
    acc = accuracy_score(y_lvl_test, clf.predict(X_test))
    
    reg = RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42)
    reg.fit(X_train, y_s_train)
    mae = mean_absolute_error(y_s_test, reg.predict(X_test))
    
    print(f"[OK] One Health Cross-Contamination Accuracy: {acc * 100:.2f}%")
    print(f"[OK] Contamination Score Regressor MAE: {mae:.2f}")
    
    joblib.dump(clf, os.path.join(MODEL_DIR, 'one_health_classifier.joblib'))
    joblib.dump(reg, os.path.join(MODEL_DIR, 'one_health_regressor.joblib'))
    
    metrics_report['one_health'] = {
        'model_type': 'RandomForestClassifier + Regressor',
        'accuracy': round(float(acc), 4),
        'score_mae': round(float(mae), 4)
    }

# ── 5. SAVE CONSOLIDATED METRICS ─────────────────────────────────────────────

def save_metrics():
    metrics_path = os.path.join(MODEL_DIR, 'model_metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(metrics_report, f, indent=2)
    print(f"\n[OK] Saved model evaluation metrics to {metrics_path}")

if __name__ == '__main__':
    train_pesticide_models()
    train_harvest_safety_models()
    train_veterinary_amu_models()
    train_cross_contamination_models()
    save_metrics()
    print("\n=== All IndiaX AI & ML Models Successfully Trained & Serialized ===")
