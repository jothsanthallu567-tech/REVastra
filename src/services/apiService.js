// REVastra Persistence & API Adapter Service

import {
  INITIAL_USERS,
  INITIAL_WASTE_SOURCES,
  INITIAL_COLLECTIONS,
  INITIAL_RECOVERY_CENTRES,
  INITIAL_BATCHES,
  INITIAL_WAREHOUSE_STOCK,
  INITIAL_ORDERS,
  INITIAL_GROCERY_CATALOGUE,
  INITIAL_REDEMPTIONS,
  INITIAL_FOOD_DONATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ROUTES,
  INITIAL_IMPACT_METRICS,
  INITIAL_MATERIALS,
  INITIAL_PROHIBITED_WASTE,
  INITIAL_GRADE_A_BONUS_PERCENT,
  INITIAL_COIN_TRANSACTIONS
} from './mockData';
import { DEFAULT_MATERIAL_RATES } from './greenCoinService';

const STORAGE_KEY = 'revastra_sih2026_state_v3';

export function getStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaultState = {
        users: INITIAL_USERS,
        wasteSources: INITIAL_WASTE_SOURCES,
        collections: INITIAL_COLLECTIONS,
        recoveryCentres: INITIAL_RECOVERY_CENTRES,
        batches: INITIAL_BATCHES,
        warehouseStock: INITIAL_WAREHOUSE_STOCK,
        orders: INITIAL_ORDERS,
        groceryCatalogue: INITIAL_GROCERY_CATALOGUE,
        redemptions: INITIAL_REDEMPTIONS,
        foodDonations: INITIAL_FOOD_DONATIONS,
        notifications: INITIAL_NOTIFICATIONS,
        routes: INITIAL_ROUTES,
        impactMetrics: INITIAL_IMPACT_METRICS,
        materials: INITIAL_MATERIALS,
        prohibitedWaste: INITIAL_PROHIBITED_WASTE,
        coinRatesConfig: DEFAULT_MATERIAL_RATES,
        gradeABonusPercent: INITIAL_GRADE_A_BONUS_PERCENT,
        coinTransactions: INITIAL_COIN_TRANSACTIONS
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
      return defaultState;
    }
    const parsed = JSON.parse(raw);
    
    // Ensure all standard initial role accounts exist
    const existingIds = new Set((parsed.users || []).map(u => u.id));
    const missingInitials = INITIAL_USERS.filter(u => !existingIds.has(u.id));
    if (missingInitials.length > 0) {
      parsed.users = [...(parsed.users || []), ...missingInitials];
    }
    if (!parsed.coinRatesConfig) {
      parsed.coinRatesConfig = DEFAULT_MATERIAL_RATES;
    }
    if (!parsed.gradeABonusPercent) {
      parsed.gradeABonusPercent = INITIAL_GRADE_A_BONUS_PERCENT;
    }
    if (!parsed.coinTransactions) {
      parsed.coinTransactions = INITIAL_COIN_TRANSACTIONS;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return parsed;
  } catch (err) {
    console.error('Failed to parse REVastra state from localStorage', err);
    return {
      users: INITIAL_USERS,
      wasteSources: INITIAL_WASTE_SOURCES,
      collections: INITIAL_COLLECTIONS,
      recoveryCentres: INITIAL_RECOVERY_CENTRES,
      batches: INITIAL_BATCHES,
      warehouseStock: INITIAL_WAREHOUSE_STOCK,
      orders: INITIAL_ORDERS,
      groceryCatalogue: INITIAL_GROCERY_CATALOGUE,
      redemptions: INITIAL_REDEMPTIONS,
      foodDonations: INITIAL_FOOD_DONATIONS,
      notifications: INITIAL_NOTIFICATIONS,
      routes: INITIAL_ROUTES,
      impactMetrics: INITIAL_IMPACT_METRICS,
      materials: INITIAL_MATERIALS,
      prohibitedWaste: INITIAL_PROHIBITED_WASTE,
      coinRatesConfig: DEFAULT_MATERIAL_RATES,
      gradeABonusPercent: INITIAL_GRADE_A_BONUS_PERCENT,
      coinTransactions: INITIAL_COIN_TRANSACTIONS
    };
  }
}

export function saveState(newState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('revastra_storage_updated', { detail: newState }));
    }
  } catch (err) {
    console.error('Failed to save REVastra state to localStorage', err);
  }
}

export function resetStateToDefaults() {
  const defaultState = {
    users: INITIAL_USERS,
    wasteSources: INITIAL_WASTE_SOURCES,
    collections: INITIAL_COLLECTIONS,
    recoveryCentres: INITIAL_RECOVERY_CENTRES,
    batches: INITIAL_BATCHES,
    warehouseStock: INITIAL_WAREHOUSE_STOCK,
    orders: INITIAL_ORDERS,
    groceryCatalogue: INITIAL_GROCERY_CATALOGUE,
    redemptions: INITIAL_REDEMPTIONS,
    foodDonations: INITIAL_FOOD_DONATIONS,
    notifications: INITIAL_NOTIFICATIONS,
    routes: INITIAL_ROUTES,
    impactMetrics: INITIAL_IMPACT_METRICS,
    materials: INITIAL_MATERIALS,
    prohibitedWaste: INITIAL_PROHIBITED_WASTE,
    coinRatesConfig: DEFAULT_MATERIAL_RATES,
    gradeABonusPercent: INITIAL_GRADE_A_BONUS_PERCENT,
    coinTransactions: INITIAL_COIN_TRANSACTIONS
  };
  saveState(defaultState);
  return defaultState;
}
