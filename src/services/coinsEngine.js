// REVastra Green Coins Calculation & Business Rules Engine

export const COIN_CONVERSION_RATE = 100; // 100 Green Coins = ₹1 INR
export const MAX_BASE_COINS_PER_DAY = 50; // Daily maximum cap for base participation reward

export const MATERIAL_BONUS_RATES = {
  'mat-coconut': 30,
  'mat-ewaste': 50,
  'mat-metal': 25,
  'mat-plastic': 20,
  'mat-aluminium': 20,
  'mat-textile': 20,
  'mat-pet': 15,
  'mat-cardboard': 15,
  'mat-wood': 15,
  'mat-glass': 15,
  'mat-paper': 10,
  'mat-organic': 10
};

/**
 * Calculates verified Green Coins earned for a waste collection.
 * Must be executed after collector/recovery centre verification.
 */
export function calculateCollectionCoins({
  materialId,
  quantityKg,
  currentBaseCoinsToday = 0,
  streakDays = 0,
  isVerified = true
}) {
  if (!isVerified) {
    return { baseEarned: 0, materialBonus: 0, streakBonus: 0, totalCoins: 0, remainingBaseCap: MAX_BASE_COINS_PER_DAY - currentBaseCoinsToday };
  }

  // 1. Calculate Base Coins (capped at 50 per day)
  const remainingBaseCap = Math.max(0, MAX_BASE_COINS_PER_DAY - currentBaseCoinsToday);
  const baseEarned = Math.min(35, remainingBaseCap); // 35 base coins per collection up to daily limit

  // 2. Verified Material Bonus (rate * quantityKg)
  const bonusPerKg = MATERIAL_BONUS_RATES[materialId] || 10;
  const materialBonus = Math.round(bonusPerKg * Math.min(quantityKg, 50)); // Scale linearly

  // 3. Regular Customer Bonus (+10 coins for every 3 consecutive streak days)
  const streakBonus = Math.floor(streakDays / 3) * 10;

  const totalCoins = baseEarned + materialBonus + streakBonus;

  return {
    baseEarned,
    materialBonus,
    streakBonus,
    totalCoins,
    newBaseCoinsToday: currentBaseCoinsToday + baseEarned
  };
}

/**
 * Validates a Grocery Catalogue Redemption request against business rules.
 */
export function validateGroceryRedemption({ user, item, requestedQuantity, existingRedemptions = [] }) {
  if (!user) {
    return { valid: false, message: 'User authentication required.' };
  }

  const totalCoinCost = item.coinCost * requestedQuantity;

  // Rule 1: Check user Green Coin balance
  if (user.greenCoinsBalance < totalCoinCost) {
    return {
      valid: false,
      message: `Insufficient Green Coins. You need ${totalCoinCost} coins but have ${user.greenCoinsBalance} coins.`
    };
  }

  // Rule 2: Check item available stock
  if (item.availableStock < requestedQuantity) {
    return {
      valid: false,
      message: `Only ${item.availableStock} units of ${item.name} currently available.`
    };
  }

  // Rule 3: Check weekly redemption limit per user
  const userRedemptionsThisWeek = existingRedemptions.filter(
    r => r.userId === user.id && r.itemId === item.id && r.status !== 'Cancelled'
  );
  const totalClaimedThisWeek = userRedemptionsThisWeek.length;

  if (totalClaimedThisWeek + requestedQuantity > item.allowedQtyPerWeek) {
    return {
      valid: false,
      message: `Weekly limit reached! You can redeem maximum ${item.allowedQtyPerWeek} units per week. (Already claimed: ${totalClaimedThisWeek})`
    };
  }

  return {
    valid: true,
    totalCoinCost,
    rupeeEquivalent: totalCoinCost / COIN_CONVERSION_RATE,
    message: 'Redemption eligible and approved by REVastra backend engine.'
  };
}
