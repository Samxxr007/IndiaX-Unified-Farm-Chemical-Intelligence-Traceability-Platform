import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding IndiaX database...');

  // ── Clean slate ────────────────────────────────────────────────────────────
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.traceabilityEvent.deleteMany();
  await prisma.riskAssessment.deleteMany();
  await prisma.labResult.deleteMany();
  await prisma.harvestBatch.deleteMany();
  await prisma.treatment.deleteMany();
  await prisma.animal.deleteMany();
  await prisma.livestockUnit.deleteMany();
  await prisma.chemicalApplication.deleteMany();
  await prisma.cropCycle.deleteMany();
  await prisma.crop.deleteMany();
  await prisma.chemicalMRL.deleteMany();
  await prisma.regulatoryRule.deleteMany();
  await prisma.chemical.deleteMany();
  await prisma.field.deleteMany();
  await prisma.farmMember.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ──────────────────────────────────────────────────────────────────
  const hash = await bcrypt.hash('Demo@1234', 10);

  const farmer = await prisma.user.create({
    data: {
      email: 'farmer@indiax.app',
      phone: '+919823044912',
      fullName: 'Sameer Patil',
      passwordHash: hash,
      role: 'FARMER',
    },
  });

  const vet = await prisma.user.create({
    data: {
      email: 'vet@indiax.app',
      phone: '+919422218903',
      fullName: 'Dr. Kavita Deshmukh',
      passwordHash: hash,
      role: 'VETERINARIAN',
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@indiax.app',
      fullName: 'IndiaX Admin',
      passwordHash: hash,
      role: 'ADMIN',
    },
  });

  console.log('✅ Users seeded');

  // ── Crops ──────────────────────────────────────────────────────────────────
  const tomato = await prisma.crop.create({
    data: { name: 'Tomato', variety: 'Export Hybrid', category: 'Vegetable' },
  });
  const grapes = await prisma.crop.create({
    data: { name: 'Table Grapes', variety: 'Thompson Seedless', category: 'Fruit' },
  });
  const onion = await prisma.crop.create({
    data: { name: 'Onion', variety: 'Red Onion', category: 'Vegetable' },
  });

  console.log('✅ Crops seeded');

  // ── Chemicals ──────────────────────────────────────────────────────────────
  const chlorantraniliprole = await prisma.chemical.create({
    data: {
      tradeName: 'Coragen 18.5 SC',
      activeIngredient: 'Chlorantraniliprole',
      chemicalType: 'INSECTICIDE',
      toxicityClass: 'CLASS_U',
      cpcbRegNumber: 'CIB-REG-INS-2017-0042',
      recommendedDose: 0.4,
      recommendedDoseUnit: 'ml/L',
      mrlRecords: {
        create: [
          { crop: 'Tomato', mrlMgKg: 0.5, withholdingIntervalDays: 3, gazetteRef: 'FSSAI SFR 2017', sourceAuthority: 'FSSAI' },
          { crop: 'Grapes', mrlMgKg: 1.0, withholdingIntervalDays: 7, gazetteRef: 'FSSAI SFR 2017', sourceAuthority: 'FSSAI' },
        ],
      },
    },
  });

  const mancozeb = await prisma.chemical.create({
    data: {
      tradeName: 'Dithane M-45',
      activeIngredient: 'Mancozeb',
      chemicalType: 'FUNGICIDE',
      toxicityClass: 'CLASS_III',
      cpcbRegNumber: 'CIB-REG-FUN-2010-0018',
      recommendedDose: 2.5,
      recommendedDoseUnit: 'g/L',
      mrlRecords: {
        create: [
          { crop: 'Tomato', mrlMgKg: 2.0, withholdingIntervalDays: 7, gazetteRef: 'FSSAI SFR 2011', sourceAuthority: 'FSSAI' },
          { crop: 'Grapes', mrlMgKg: 5.0, withholdingIntervalDays: 14, gazetteRef: 'FSSAI SFR 2011', sourceAuthority: 'FSSAI' },
        ],
      },
    },
  });

  const imidacloprid = await prisma.chemical.create({
    data: {
      tradeName: 'Confidor 200 SL',
      activeIngredient: 'Imidacloprid',
      chemicalType: 'INSECTICIDE',
      toxicityClass: 'CLASS_II',
      cpcbRegNumber: 'CIB-REG-INS-2005-0091',
      recommendedDose: 0.25,
      recommendedDoseUnit: 'ml/L',
      mrlRecords: {
        create: [
          { crop: 'Tomato', mrlMgKg: 0.5, withholdingIntervalDays: 14, gazetteRef: 'FSSAI SFR 2015', sourceAuthority: 'FSSAI' },
        ],
      },
    },
  });

  const oxytetracycline = await prisma.chemical.create({
    data: {
      tradeName: 'Terramycin',
      activeIngredient: 'Oxytetracycline',
      chemicalType: 'VETERINARY_DRUG',
      toxicityClass: 'CLASS_III',
      cpcbRegNumber: 'CDSCO-VET-2015-0234',
      isVetApproved: true,
    },
  });

  console.log('✅ Chemicals seeded');

  // ── Farm ───────────────────────────────────────────────────────────────────
  const farm = await prisma.farm.create({
    data: {
      name: 'Green Valley Agri-Estate',
      farmType: 'MIXED',
      totalAreaHectares: 48.5,
      latitude: 20.1985,
      longitude: 73.8315,
      district: 'Nashik',
      state: 'Maharashtra',
      fssaiLicense: '11521034000892',
      cpcbRegistration: 'CPCB-AGR-MH-2024-8841',
      ownerId: farmer.id,
      members: { create: { userId: farmer.id, role: 'OWNER' } },
    },
  });

  // ── Fields ─────────────────────────────────────────────────────────────────
  const fieldA = await prisma.field.create({
    data: {
      farmId: farm.id,
      name: 'Field A — North Orchard',
      areaHectares: 3.44,
      soilType: 'Medium Black Loam (pH 7.2)',
      irrigationType: 'Automated Drip Irrigation',
      latitude: 20.1985,
      longitude: 73.8315,
      status: 'HARVESTING',
    },
  });

  const fieldB = await prisma.field.create({
    data: {
      farmId: farm.id,
      name: 'Field B — South Terrace',
      areaHectares: 4.86,
      soilType: 'Sandy Loam with High Organic Carbon',
      irrigationType: 'Sub-surface Micro-Drip',
      latitude: 20.194,
      longitude: 73.833,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Fields seeded');

  // ── Crop Cycles ────────────────────────────────────────────────────────────
  const tomatoCycle = await prisma.cropCycle.create({
    data: {
      fieldId: fieldA.id,
      cropId: tomato.id,
      variety: 'Abhinav Hybrid F1',
      plantingDate: new Date('2026-06-10'),
      expectedHarvestDate: new Date('2026-08-28'),
      status: 'ACTIVE',
    },
  });

  const grapesCycle = await prisma.cropCycle.create({
    data: {
      fieldId: fieldB.id,
      cropId: grapes.id,
      variety: 'Thompson Seedless / Super Sonaka',
      plantingDate: new Date('2025-11-15'),
      expectedHarvestDate: new Date('2026-09-15'),
      status: 'ACTIVE',
    },
  });

  console.log('✅ Crop cycles seeded');

  // ── Chemical Applications ──────────────────────────────────────────────────
  const app1 = await prisma.chemicalApplication.create({
    data: {
      fieldId: fieldA.id,
      cropCycleId: tomatoCycle.id,
      chemicalId: chlorantraniliprole.id,
      applicationDate: new Date('2026-08-01T09:30:00Z'),
      quantity: 0.4,
      quantityUnit: 'ml/L',
      applicationMethod: 'SPRAY',
      purpose: 'Pest management - Fruit borer control',
      applicatorId: farmer.id,
      weatherCondition: 'Clear',
      temperatureC: 28.5,
    },
  });

  const app2 = await prisma.chemicalApplication.create({
    data: {
      fieldId: fieldA.id,
      cropCycleId: tomatoCycle.id,
      chemicalId: mancozeb.id,
      applicationDate: new Date('2026-08-10T10:00:00Z'),
      quantity: 2.5,
      quantityUnit: 'g/L',
      applicationMethod: 'SPRAY',
      purpose: 'Disease management - Early blight control',
      applicatorId: farmer.id,
      weatherCondition: 'Overcast',
      temperatureC: 26.0,
    },
  });

  console.log('✅ Applications seeded');

  // ── Livestock ──────────────────────────────────────────────────────────────
  const cattleUnit = await prisma.livestockUnit.create({
    data: {
      farmId: farm.id,
      name: 'Dairy Herd Unit Alpha',
      species: 'CATTLE',
      breed: 'HF Cross',
      headcount: 24,
      housingType: 'Semi-Open Stall',
    },
  });

  // ── Treatment ──────────────────────────────────────────────────────────────
  const treatment1 = await prisma.treatment.create({
    data: {
      unitId: cattleUnit.id,
      chemicalId: oxytetracycline.id,
      diagnosis: 'Bovine respiratory disease',
      treatmentReason: 'Veterinary prescription treatment',
      dose: 10,
      doseUnit: 'mg/kg',
      route: 'INJECTION_IM',
      frequency: 'ONCE_DAILY',
      startDate: new Date('2026-08-15T09:00:00Z'),
      endDate: new Date('2026-08-20T09:00:00Z'),
      veterinarianId: vet.id,
      withdrawalPeriodDays: 28,
      safeMeatDate: new Date('2026-09-17'),
      safeMilkDate: new Date('2026-08-23'),
    },
  });

  console.log('✅ Livestock & treatments seeded');

  // ── Harvest Batch ──────────────────────────────────────────────────────────
  const batch = await prisma.harvestBatch.create({
    data: {
      fieldId: fieldA.id,
      cropCycleId: tomatoCycle.id,
      batchCode: 'TOM-2026-001',
      harvestDate: new Date('2026-08-18'),
      quantity: 420,
      quantityUnit: 'kg',
      status: 'VERIFIED',
      buyerName: 'Direct Agri-Export Consortium',
      destinationMarket: 'Export & Premium Retail',
    },
  });

  // ── Lab Results ────────────────────────────────────────────────────────────
  await prisma.labResult.createMany({
    data: [
      {
        batchId: batch.id,
        sampleCode: 'SMP-2026-4491',
        chemical: 'Chlorantraniliprole',
        measuredValue: 0.038,
        unit: 'mg/kg',
        testDate: new Date('2026-08-19'),
        laboratory: 'Eurofins Agro Analytics NABL Laboratory, Nashik',
        testMethod: 'LC-MS/MS',
        nablAccreditation: 'TC-7182 (ISO/IEC 17025:2017)',
        status: 'PASS',
      },
      {
        batchId: batch.id,
        sampleCode: 'SMP-2026-4491',
        chemical: 'Mancozeb',
        measuredValue: 0.095,
        unit: 'mg/kg',
        testDate: new Date('2026-08-19'),
        laboratory: 'Eurofins Agro Analytics NABL Laboratory, Nashik',
        testMethod: 'GC-MS',
        nablAccreditation: 'TC-7182 (ISO/IEC 17025:2017)',
        status: 'PASS',
      },
    ],
  });

  console.log('✅ Batch & lab results seeded');

  // ── Risk Assessments ───────────────────────────────────────────────────────
  await prisma.riskAssessment.create({
    data: {
      entityType: 'FIELD',
      entityId: fieldA.id,
      applicationId: app1.id,
      riskScore: 72,
      riskLevel: 'HIGH',
      confidence: 0.86,
      reasons: ['Repeated application pattern detected', 'Days to harvest within withholding window'],
      modelVersion: 'crop-risk-v1',
      status: 'COMPLETED',
    },
  });

  await prisma.riskAssessment.create({
    data: {
      entityType: 'LIVESTOCK',
      entityId: cattleUnit.id,
      treatmentId: treatment1.id,
      riskScore: 41,
      riskLevel: 'MEDIUM',
      confidence: 0.79,
      reasons: ['Active withdrawal period', 'Antibiotic use flagged for AMU tracking'],
      modelVersion: 'amu-risk-v1',
      status: 'COMPLETED',
    },
  });

  console.log('✅ Risk assessments seeded');

  // ── Traceability Events ────────────────────────────────────────────────────
  await prisma.traceabilityEvent.createMany({
    data: [
      { batchId: batch.id, type: 'CROP_PLANTED', entityId: fieldA.id, entityType: 'FIELD', metadata: { crop: 'Tomato', variety: 'Abhinav Hybrid F1' }, timestamp: new Date('2026-06-10') },
      { batchId: batch.id, type: 'CHEMICAL_APPLIED', entityId: app1.id, entityType: 'APPLICATION', metadata: { chemical: 'Chlorantraniliprole', quantity: '0.4 ml/L' }, timestamp: new Date('2026-08-01') },
      { batchId: batch.id, type: 'CHEMICAL_APPLIED', entityId: app2.id, entityType: 'APPLICATION', metadata: { chemical: 'Mancozeb', quantity: '2.5 g/L' }, timestamp: new Date('2026-08-10') },
      { batchId: batch.id, type: 'HARVEST_CREATED', entityId: batch.id, entityType: 'BATCH', metadata: { quantity: '420 kg', batchCode: 'TOM-2026-001' }, timestamp: new Date('2026-08-18') },
      { batchId: batch.id, type: 'LAB_RESULT_ADDED', entityId: batch.id, entityType: 'BATCH', metadata: { result: 'PASS', laboratory: 'Eurofins' }, timestamp: new Date('2026-08-19') },
      { batchId: batch.id, type: 'BATCH_VERIFIED', entityId: batch.id, entityType: 'BATCH', metadata: { status: 'VERIFIED' }, timestamp: new Date('2026-08-20') },
    ],
  });

  console.log('✅ Traceability events seeded');

  // ── Notifications ──────────────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId: farmer.id,
        title: 'High Risk Alert: Field A',
        message: 'AI risk assessment flagged repeated Chlorantraniliprole application. Score: 72/100.',
        type: 'HIGH_RISK',
        entityId: fieldA.id,
        entityType: 'FIELD',
      },
      {
        userId: farmer.id,
        title: 'Lab Results Ready: TOM-2026-001',
        message: 'Laboratory results uploaded for batch TOM-2026-001. Overall status: PASS.',
        type: 'LAB_RESULT',
        entityId: batch.id,
        entityType: 'BATCH',
      },
    ],
  });

  console.log('✅ Notifications seeded');
  console.log('\n🎉 Database seeded successfully!\n');
  console.log('Demo Credentials:');
  console.log('  Farmer: farmer@indiax.app / Demo@1234');
  console.log('  Vet:    vet@indiax.app / Demo@1234');
  console.log('  Admin:  admin@indiax.app / Demo@1234');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
