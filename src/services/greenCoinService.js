// REVastra Green Coin Reward & Calculator Engine
// Standard: 100 Green Coins = ₹1 INR Reward Value

export const COIN_CONVERSION_RATE = 100; // 100 Green Coins = ₹1

// Configurable Grade-B Base Rates (coins per kg)
export const DEFAULT_MATERIAL_RATES = {
  'mat-organic': { name: 'Organic/Vegetable Waste', baseRatePerKg: 20, category: 'Organic', icon: 'Leaf' },
  'mat-wood': { name: 'Wood Waste', baseRatePerKg: 40, category: 'Wood & Biomass', icon: 'TreeTrunk' },
  'mat-paper': { name: 'Paper', baseRatePerKg: 100, category: 'Paper & Pulp', icon: 'FileText' },
  'mat-cardboard': { name: 'Cardboard', baseRatePerKg: 80, category: 'Paper & Pulp', icon: 'Package' },
  'mat-plastic': { name: 'Plastic', baseRatePerKg: 200, category: 'Plastics', icon: 'Box' },
  'mat-pet': { name: 'PET Bottles', baseRatePerKg: 180, category: 'Plastics', icon: 'Wine' },
  'mat-hdpe': { name: 'HDPE Plastic', baseRatePerKg: 220, category: 'Plastics', icon: 'Layers' },
  'mat-metal': { name: 'Metal/Scrap Metal', baseRatePerKg: 500, category: 'Metals', icon: 'Shield' },
  'mat-aluminium': { name: 'Aluminium', baseRatePerKg: 700, category: 'Metals', icon: 'Disc' },
  'mat-glass': { name: 'Glass', baseRatePerKg: 60, category: 'Glass', icon: 'Glasses' },
  'mat-coconut': { name: 'Coconut Waste/Husk', baseRatePerKg: 50, category: 'Organic', icon: 'Trees' },
  'mat-cocopeat': { name: 'Cocopeat', baseRatePerKg: 50, category: 'Organic', icon: 'Sparkles' },
  'mat-garden': { name: 'Garden/Green Waste', baseRatePerKg: 20, category: 'Organic', icon: 'Sprout' },
  'mat-textile': { name: 'Textile/Cloth', baseRatePerKg: 120, category: 'Textiles', icon: 'Shirt' },
  'mat-rubber': { name: 'Rubber Waste', baseRatePerKg: 150, category: 'Polymers', icon: 'CircleDot' },
  'mat-ewaste': { name: 'E-waste', baseRatePerKg: 300, category: 'Electronics', icon: 'Cpu' }
};

export const DEFAULT_GRADE_A_BONUS_PERCENT = 25; // 20% - 25% configurable bonus

/**
 * Calculates Green Coins with validation and breakdown
 * @param {Object} params
 * @param {string} params.materialKey - ID or key of the material
 * @param {number|string} params.quantityKg - Quantity in kilograms (> 0)
 * @param {string} params.grade - 'Grade A' | 'Grade B' | 'Grade C' | 'Rejected'
 * @param {number} [params.bonusPercent] - Configurable Grade A bonus percentage (e.g., 25)
 * @param {Object} [params.customRates] - Custom rates dictionary overriding defaults
 * @returns {Object} Calculation result or error
 */
export function calculateGreenCoins({
  materialKey,
  quantityKg,
  grade = 'Grade B',
  bonusPercent = DEFAULT_GRADE_A_BONUS_PERCENT,
  customRates = DEFAULT_MATERIAL_RATES
}) {
  const qty = Number(quantityKg);

  // 1. Validation
  if (isNaN(qty) || qty <= 0) {
    return {
      isValid: false,
      error: 'Quantity must be greater than 0 kg.',
      baseCoins: 0,
      gradeBonusCoins: 0,
      totalCoins: 0,
      rewardValueRupees: 0
    };
  }

  const material = customRates[materialKey] || Object.values(customRates).find(
    (m) => m.name.toLowerCase() === String(materialKey).toLowerCase()
  );

  if (!material) {
    return {
      isValid: false,
      error: `Invalid or unrecognized waste material: ${materialKey}`,
      baseCoins: 0,
      gradeBonusCoins: 0,
      totalCoins: 0,
      rewardValueRupees: 0
    };
  }

  // 2. Grade Rule Evaluation
  // Grade B = base rate
  // Grade A = base rate + 20-25% bonus
  // Grade C = base rate with NO deduction
  // Rejected = 0 coins
  const normalizedGrade = String(grade).trim().toUpperCase();

  if (normalizedGrade.includes('REJECTED') || normalizedGrade === 'REJECT') {
    return {
      isValid: true,
      materialName: material.name,
      quantityKg: qty,
      grade: 'Rejected',
      baseRatePerKg: material.baseRatePerKg,
      baseCoins: 0,
      gradeBonusPercent: 0,
      gradeBonusCoins: 0,
      totalCoins: 0,
      rewardValueRupees: 0,
      note: 'Rejected waste receives 0 Green Coins.'
    };
  }

  const isGradeA = normalizedGrade === 'GRADE A' || normalizedGrade === 'A' || normalizedGrade.includes('GRADE A');
  const isGradeC = normalizedGrade === 'GRADE C' || normalizedGrade === 'C' || normalizedGrade.includes('GRADE C');

  const baseCoins = Math.round(qty * material.baseRatePerKg);
  let gradeBonusCoins = 0;
  let appliedBonusPercent = 0;

  if (isGradeA) {
    appliedBonusPercent = Math.max(0, Number(bonusPercent) || DEFAULT_GRADE_A_BONUS_PERCENT);
    gradeBonusCoins = Math.round(baseCoins * (appliedBonusPercent / 100));
  }

  const totalCoins = Math.round(baseCoins + gradeBonusCoins);
  const rewardValueRupees = Number((totalCoins / COIN_CONVERSION_RATE).toFixed(2));

  return {
    isValid: true,
    materialName: material.name,
    materialCategory: material.category,
    quantityKg: qty,
    grade: isGradeA ? 'Grade A' : isGradeC ? 'Grade C' : 'Grade B',
    baseRatePerKg: material.baseRatePerKg,
    baseCoins,
    gradeBonusPercent: appliedBonusPercent,
    gradeBonusCoins,
    totalCoins,
    rewardValueRupees,
    conversionRate: `${COIN_CONVERSION_RATE} Coins = ₹1`
  };
}

/**
 * Provisional coins calculated at collection pickup (Grade B base)
 */
export function calculateProvisionalCoins(materialKey, quantityKg, customRates) {
  return calculateGreenCoins({
    materialKey,
    quantityKg,
    grade: 'Grade B',
    customRates
  });
}

/**
 * Final verified coins calculated at Recovery Centre after weighing and grading
 */
export function calculateFinalVerifiedCoins(materialKey, verifiedQtyKg, qualityGrade, bonusPercent, customRates) {
  return calculateGreenCoins({
    materialKey,
    quantityKg: verifiedQtyKg,
    grade: qualityGrade,
    bonusPercent,
    customRates
  });
}

/**
 * Converts Green Coins to Rupee Value
 */
export function coinsToRupees(coins) {
  return Number(((Number(coins) || 0) / COIN_CONVERSION_RATE).toFixed(2));
}

/**
 * Converts Rupee value to Green Coins
 */
export function rupeesToCoins(rupees) {
  return Math.round((Number(rupees) || 0) * COIN_CONVERSION_RATE);
}
