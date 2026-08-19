"""
IndiaX — Agricultural & Veterinary Synthetic Dataset Generator
Generates realistic training datasets adhering to CIBRC, FSSAI, ICAR, and WHO standards.
"""

import os
import random
import numpy as np
import pandas as pd

# Set fixed seed for reproducibility
np.random.seed(42)
random.seed(42)

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(DATA_DIR, exist_ok=True)

# ── 1. CROP PESTICIDE DATASET ────────────────────────────────────────────────

CROPS = ['Tomato', 'Grapes', 'Pomegranate', 'Cotton', 'Rice', 'Maize', 'Wheat', 'Soybean', 'Chilli', 'Onion']
SOIL_TYPES = ['Black Clay', 'Red Loamy', 'Alluvial', 'Sandy Loam', 'Laterite']
CHEMICALS = [
    {'name': 'Coragen 18.5 SC', 'active': 'Chlorantraniliprole', 'class': 'Diamide', 'base_dose': 50, 'phi': 14, 'mrl': 0.50, 'is_banned': False},
    {'name': 'Amistar Top 325 SC', 'active': 'Azoxystrobin + Difenoconazole', 'class': 'Strobilurin/Triazole', 'base_dose': 200, 'phi': 7, 'mrl': 3.00, 'is_banned': False},
    {'name': 'Confidor 200 SL', 'active': 'Imidacloprid', 'class': 'Neonicotinoid', 'base_dose': 100, 'phi': 21, 'mrl': 0.05, 'is_banned': False},
    {'name': 'Neem Baan 10000 PPM', 'active': 'Azadirachtin', 'class': 'Botanical', 'base_dose': 500, 'phi': 3, 'mrl': 10.0, 'is_banned': False},
    {'name': 'Monocrotophos 36 SL', 'active': 'Monocrotophos', 'class': 'Organophosphate', 'base_dose': 300, 'phi': 30, 'mrl': 0.00, 'is_banned': True},
    {'name': 'Endosulfan 35 EC', 'active': 'Endosulfan', 'class': 'Organochlorine', 'base_dose': 250, 'phi': 30, 'mrl': 0.00, 'is_banned': True},
    {'name': 'Mancozeb 75 WP', 'active': 'Mancozeb', 'class': 'Dithiocarbamate', 'base_dose': 600, 'phi': 15, 'mrl': 2.00, 'is_banned': False},
    {'name': 'Proclaim 5 SG', 'active': 'Emamectin Benzoate', 'class': 'Avermectin', 'base_dose': 80, 'phi': 5, 'mrl': 0.05, 'is_banned': False},
    {'name': 'Tilt 25 EC', 'active': 'Propiconazole', 'class': 'Triazole', 'base_dose': 200, 'phi': 20, 'mrl': 0.10, 'is_banned': False},
]

def generate_crop_dataset(n_samples=6000):
    rows = []
    for i in range(n_samples):
        crop = random.choice(CROPS)
        soil = random.choice(SOIL_TYPES)
        chem = random.choice(CHEMICALS)
        
        # Quantity factor (0.5x to 2.5x base dose)
        dosage_factor = np.random.uniform(0.6, 2.2)
        quantity = round(chem['base_dose'] * dosage_factor, 1)
        
        # Spray interval & frequency
        frequency = np.random.choice([1, 2, 3, 4, 5, 6], p=[0.25, 0.30, 0.20, 0.15, 0.07, 0.03])
        days_since_last = int(np.random.exponential(scale=12))
        
        # Environmental conditions
        temp_c = round(np.random.normal(loc=29, scale=5), 1)
        humidity_pct = round(np.random.uniform(35, 90), 1)
        rainfall_mm = round(max(0, np.random.exponential(scale=15)), 1)
        
        # Harvest timing relative to application
        intended_days_to_harvest = int(np.random.uniform(2, 45))
        
        # Determine Ground Truth Risk Score (0-100) based on agronomic logic
        risk_score = 15.0
        
        # Banned chemical penalty
        if chem['is_banned']:
            risk_score += 65.0
            
        # Over-dosage penalty
        if dosage_factor > 1.3:
            risk_score += min(30, (dosage_factor - 1.0) * 35)
            
        # High frequency / resistance pressure
        if frequency >= 4:
            risk_score += 20.0
        elif frequency == 3:
            risk_score += 10.0
            
        # PHI violation penalty
        if intended_days_to_harvest < chem['phi']:
            violation_ratio = (chem['phi'] - intended_days_to_harvest) / chem['phi']
            risk_score += violation_ratio * 35.0
            
        # Environmental effect
        if temp_c > 35:
            risk_score += 5.0
            
        # Noise
        risk_score += np.random.normal(0, 3)
        risk_score = float(np.clip(round(risk_score, 1), 5.0, 100.0))
        
        # Categorical risk level
        if risk_score >= 70:
            risk_level = 'HIGH'
        elif risk_score >= 40:
            risk_level = 'MEDIUM'
        else:
            risk_level = 'LOW'
            
        # Safe harvest remaining days
        days_remaining = max(0, chem['phi'] - days_since_last)
        is_harvest_safe = 1 if days_since_last >= chem['phi'] else 0
        
        rows.append({
            'crop': crop,
            'soil_type': soil,
            'chemical_name': chem['name'],
            'active_ingredient': chem['active'],
            'chemical_class': chem['class'],
            'is_banned': int(chem['is_banned']),
            'dosage_applied': quantity,
            'recommended_dose': chem['base_dose'],
            'dosage_ratio': round(quantity / chem['base_dose'], 2),
            'application_frequency': frequency,
            'days_since_last_spray': days_since_last,
            'temperature_c': temp_c,
            'humidity_pct': humidity_pct,
            'rainfall_mm': rainfall_mm,
            'phi_days_required': chem['phi'],
            'fssai_mrl_limit': chem['mrl'],
            'days_remaining_to_safe_harvest': days_remaining,
            'is_harvest_safe': is_harvest_safe,
            'risk_score': risk_score,
            'risk_level': risk_level
        })
        
    df = pd.DataFrame(rows)
    out_path = os.path.join(DATA_DIR, 'crop_pesticide_dataset.csv')
    df.to_csv(out_path, index=False)
    print(f"Generated Crop Pesticide Dataset: {len(df)} rows -> {out_path}")
    return df

# ── 2. VETERINARY ANTIMICROBIAL (AMU) DATASET ─────────────────────────────────

SPECIES = ['Cattle', 'Buffalo', 'Goat', 'Sheep', 'Poultry Broiler', 'Poultry Layer']
DISEASES = ['Bovine Mastitis', 'Hemorrhagic Septicemia', 'Foot and Mouth Secondary Infection', 'Enteritis / Scours', 'Pneumonia / Respiratory Disease', 'Metritis', 'Coccidiosis']
VET_DRUGS = [
    {'name': 'Enrofloxacin 10%', 'class': 'Fluoroquinolone', 'who': 'HPCIA', 'std_dose': 5.0, 'std_dur': 4, 'milk_withhold': 7, 'meat_withhold': 28},
    {'name': 'Colistin Sulfate', 'class': 'Polymyxin', 'who': 'HPCIA', 'std_dose': 10.0, 'std_dur': 3, 'milk_withhold': 14, 'meat_withhold': 21},
    {'name': 'Oxytetracycline LA', 'class': 'Tetracycline', 'who': 'CIA', 'std_dose': 20.0, 'std_dur': 4, 'milk_withhold': 5, 'meat_withhold': 21},
    {'name': 'Amoxicillin Trihydrate', 'class': 'Penicillin', 'who': 'CIA', 'std_dose': 15.0, 'std_dur': 5, 'milk_withhold': 3, 'meat_withhold': 14},
    {'name': 'Ceftiofur Sodium', 'class': 'Cephalosporin 3G', 'who': 'HPCIA', 'std_dose': 2.2, 'std_dur': 3, 'milk_withhold': 0, 'meat_withhold': 4},
    {'name': 'Ivermectin 1%', 'class': 'Avermectin Anti-parasitic', 'who': 'STANDARD', 'std_dose': 0.2, 'std_dur': 1, 'milk_withhold': 28, 'meat_withhold': 35},
    {'name': 'Sulfamethoxazole + Trimethoprim', 'class': 'Sulfonamide', 'who': 'HIGHLY_IMPORTANT', 'std_dose': 24.0, 'std_dur': 5, 'milk_withhold': 5, 'meat_withhold': 14},
]

def generate_veterinary_dataset(n_samples=5000):
    rows = []
    for i in range(n_samples):
        spec = random.choice(SPECIES)
        dis = random.choice(DISEASES)
        drug = random.choice(VET_DRUGS)
        
        # Animal weight based on species
        if spec == 'Cattle': weight_kg = round(np.random.normal(380, 50), 1)
        elif spec == 'Buffalo': weight_kg = round(np.random.normal(450, 60), 1)
        elif spec in ['Goat', 'Sheep']: weight_kg = round(np.random.normal(35, 8), 1)
        else: weight_kg = round(np.random.uniform(1.2, 2.5), 2)
        
        # Administered dosage & duration
        dose_factor = np.random.uniform(0.7, 2.3)
        dose_mg_kg = round(drug['std_dose'] * dose_factor, 2)
        duration_days = int(np.random.choice([1, 2, 3, 4, 5, 7, 10, 14], p=[0.1, 0.15, 0.25, 0.2, 0.15, 0.08, 0.05, 0.02]))
        
        # Route
        route = random.choice(['Intramuscular (IM)', 'Subcutaneous (SC)', 'Oral / Drench', 'Intramammary', 'Water Medication'])
        
        # Misuse scoring & AMR risk calculation
        amr_risk_score = 15.0
        misuse_flag = 0
        reasons = []
        
        # HPCIA extra risk
        if drug['who'] == 'HPCIA':
            amr_risk_score += 40.0
            reasons.append('WHO HPCIA class drug')
        elif drug['who'] == 'CIA':
            amr_risk_score += 20.0
            
        # Over-duration
        if duration_days > drug['std_dur'] + 2:
            amr_risk_score += 25.0
            misuse_flag = 1
            reasons.append('Treatment exceeded recommended clinical duration')
            
        # Over-dose
        if dose_factor > 1.35:
            amr_risk_score += 20.0
            misuse_flag = 1
            reasons.append('Over-dosage applied')
            
        # Under-dose (causes resistance emergence)
        if dose_factor < 0.8:
            amr_risk_score += 15.0
            misuse_flag = 1
            reasons.append('Sub-therapeutic under-dosing promotes microbial resistance selection')
            
        amr_risk_score += np.random.normal(0, 3)
        amr_risk_score = float(np.clip(round(amr_risk_score, 1), 5.0, 100.0))
        
        risk_level = 'HIGH' if amr_risk_score >= 65 else 'MEDIUM' if amr_risk_score >= 35 else 'LOW'
        
        milk_withhold = 0 if 'Poultry' in spec else drug['milk_withhold']
        meat_withhold = drug['meat_withhold']
        
        rows.append({
            'animal_species': spec,
            'animal_weight_kg': weight_kg,
            'disease_diagnosed': dis,
            'drug_name': drug['name'],
            'drug_class': drug['class'],
            'who_cia_category': drug['who'],
            'administered_dose_mg_kg': dose_mg_kg,
            'standard_dose_mg_kg': drug['std_dose'],
            'duration_days': duration_days,
            'standard_duration_days': drug['std_dur'],
            'administration_route': route,
            'milk_withholding_days': milk_withhold,
            'meat_withholding_days': meat_withhold,
            'is_misuse': misuse_flag,
            'amr_risk_score': amr_risk_score,
            'amr_risk_level': risk_level
        })
        
    df = pd.DataFrame(rows)
    out_path = os.path.join(DATA_DIR, 'veterinary_amu_dataset.csv')
    df.to_csv(out_path, index=False)
    print(f"Generated Veterinary AMU Dataset: {len(df)} rows -> {out_path}")
    return df

# ── 3. ONE HEALTH CROSS-CONTAMINATION DATASET ────────────────────────────────

def generate_cross_contamination_dataset(n_samples=2500):
    rows = []
    for i in range(n_samples):
        source_species = random.choice(['Cattle Dairy Herd', 'Buffalo Herd', 'Commercial Swine Unit', 'Poultry Unit'])
        target_crop = random.choice(['Tomato (Fresh Market)', 'Lettuce / Leafy Greens', 'Cabbage', 'Strawberry', 'Carrot / Root Crop', 'Wheat'])
        drug = random.choice(['Enrofloxacin 10%', 'Colistin Sulfate', 'Oxytetracycline LA', 'Sulfamethoxazole', 'None (Organic Herd)'])
        
        # Composting days between excretion and field application
        composting_days = int(np.random.exponential(scale=18))
        soil_ph = round(np.random.uniform(5.5, 8.2), 1)
        irrigation = random.choice(['Drip (Sub-surface)', 'Overhead Sprinkler', 'Furrow Flood'])
        
        # Pathway risk score
        is_treated = 0 if drug == 'None (Organic Herd)' else 1
        pathway_score = 10.0
        
        if is_treated:
            if 'HPCIA' in drug or 'Enrofloxacin' in drug or 'Colistin' in drug:
                pathway_score += 45.0
            else:
                pathway_score += 25.0
                
            # Buffer degradation
            if composting_days < 10:
                pathway_score += 35.0
            elif composting_days < 25:
                pathway_score += 15.0
            else:
                pathway_score -= 15.0
                
            if 'Leafy' in target_crop or 'Fresh' in target_crop or 'Root' in target_crop:
                pathway_score += 15.0
                
            if irrigation == 'Overhead Sprinkler':
                pathway_score += 10.0
                
        pathway_score = float(np.clip(round(pathway_score + np.random.normal(0, 3), 1), 5.0, 100.0))
        risk_level = 'HIGH' if pathway_score >= 65 else 'MEDIUM' if pathway_score >= 35 else 'LOW'
        
        rows.append({
            'source_herd': source_species,
            'target_crop': target_crop,
            'antibiotic_administered': drug,
            'is_antibiotic_treated': is_treated,
            'composting_buffer_days': composting_days,
            'soil_ph': soil_ph,
            'irrigation_method': irrigation,
            'contamination_risk_score': pathway_score,
            'contamination_risk_level': risk_level
        })
        
    df = pd.DataFrame(rows)
    out_path = os.path.join(DATA_DIR, 'cross_contamination_dataset.csv')
    df.to_csv(out_path, index=False)
    print(f"Generated One Health Dataset: {len(df)} rows -> {out_path}")
    return df

if __name__ == '__main__':
    print("=== Generating IndiaX Agricultural & Veterinary Datasets ===")
    generate_crop_dataset(6000)
    generate_veterinary_dataset(5000)
    generate_cross_contamination_dataset(2500)
    print("=== Datasets Successfully Generated ===")
