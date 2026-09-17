// REVastra Reactive Data Store Context with Firebase Cloud Sync

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredState, saveState, resetStateToDefaults } from '../services/apiService';
import { calculateCollectionCoins, validateGroceryRedemption } from '../services/coinsEngine';
import {
  calculateProvisionalCoins,
  calculateFinalVerifiedCoins,
  calculateGreenCoins,
  DEFAULT_MATERIAL_RATES,
  DEFAULT_GRADE_A_BONUS_PERCENT,
  coinsToRupees
} from '../services/greenCoinService';
import { generateBatchID, generateOrderID, generateInvoiceID, generateReceiptID } from '../services/qrService';
import { syncDocToFirestore, db } from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = useState(getStoredState());

  const refreshData = () => {
    setData(getStoredState());
  };

  useEffect(() => {
    const handleStorageUpdate = () => {
      setData(getStoredState());
    };

    window.addEventListener('revastra_storage_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    // Network Sync via Firebase
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      let changed = false;
      setData(prev => {
        const nextUsers = [...prev.users];
        snapshot.docChanges().forEach(change => {
           const docData = change.doc.data();
           const idx = nextUsers.findIndex(u => u.id === docData.id);
           if (idx >= 0) {
             if (JSON.stringify(nextUsers[idx]) !== JSON.stringify(docData)) {
               nextUsers[idx] = { ...nextUsers[idx], ...docData };
               changed = true;
             }
           } else {
             nextUsers.push(docData);
             changed = true;
           }
        });
        if (changed) {
           const nextState = { ...prev, users: nextUsers };
           saveState(nextState);
           return nextState;
        }
        return prev;
      });
    }, (err) => console.warn('Firestore users sync:', err));

    const unsubCols = onSnapshot(collection(db, 'wasteCollections'), (snapshot) => {
      let changed = false;
      setData(prev => {
        const nextCols = [...prev.collections];
        snapshot.docChanges().forEach(change => {
           const docData = change.doc.data();
           const idx = nextCols.findIndex(c => c.id === docData.id);
           if (idx >= 0) {
             if (JSON.stringify(nextCols[idx]) !== JSON.stringify(docData)) {
               nextCols[idx] = { ...nextCols[idx], ...docData };
               changed = true;
             }
           } else {
             nextCols.unshift(docData);
             changed = true;
           }
        });
        if (changed) {
           const nextState = { ...prev, collections: nextCols };
           saveState(nextState);
           return nextState;
        }
        return prev;
      });
    }, (err) => console.warn('Firestore cols sync:', err));

    return () => {
      window.removeEventListener('revastra_storage_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
      unsubUsers();
      unsubCols();
    };
  }, []);

  const updateStore = (updaterFn) => {
    setData((prev) => {
      const next = updaterFn(prev);
      saveState(next);
      return next;
    });
  };

  const registerUser = (newUser) => {
    updateStore((prev) => {
      const existing = (prev.users || []).find((u) => u.id === newUser.id || (u.email && u.email.toLowerCase() === (newUser.email || '').toLowerCase()));
      if (existing) {
        return {
          ...prev,
          users: prev.users.map((u) => (u.id === existing.id ? { ...u, ...newUser } : u))
        };
      }
      return {
        ...prev,
        users: [...(prev.users || []), newUser]
      };
    });
  };

  // 1. Waste Giver: Manually Submit Collection Request (Auto-syncs into Collector "Pending Waste" portal)
  const requestCollection = ({ giverId, giverName, sourceType, qrCode, materialId, materialName, estimatedQty, unit = 'kg', requestedDate, notes }) => {
    const newCollection = {
      id: `COL-2026-${Math.floor(8900 + Math.random() * 1000)}`,
      giverId,
      giverName,
      sourceType,
      qrCode,
      collectorId: 'usr-collector-1',
      collectorName: 'Ramesh Kumar',
      materialId,
      materialName,
      estimatedQty: Number(estimatedQty),
      actualQty: null,
      unit,
      requestedDate: requestedDate || new Date().toISOString().slice(0, 16).replace('T', ' '),
      collectedDate: null,
      status: 'Pending', // Pending -> Accepted -> Assigned -> Collected -> Verified -> Completed
      recoveryCentreId: 'rc-alpha-01',
      batchId: null,
      segregated: false,
      coinsEarned: 0,
      notes: notes || 'Manual Waste Submission'
    };

    updateStore((prev) => ({
      ...prev,
      collections: [newCollection, ...prev.collections],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          userId: giverId,
          title: 'Collection Requested',
          message: `Your pickup request for ${estimatedQty}${unit} ${materialName} was submitted.`,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          read: false,
          type: 'collection'
        },
        ...prev.notifications
      ]
    }));

    // Cloud Firestore Sync
    syncDocToFirestore('wasteCollections', newCollection.id, newCollection).catch(() => {});

    return newCollection;
  };

  // 2. Collector: Accept & Record Pickup
  const acceptCollectionRequest = (collectionId, collectorUser) => {
    updateStore((prev) => ({
      ...prev,
      collections: prev.collections.map((c) =>
        c.id === collectionId ? { ...c, status: 'Accepted', collectorId: collectorUser?.id || c.collectorId, collectorName: collectorUser?.name || c.collectorName } : c
      )
    }));

    syncDocToFirestore('wasteCollections', collectionId, {
      id: collectionId,
      status: 'Accepted',
      collectorId: collectorUser?.id,
      collectorName: collectorUser?.name,
      acceptedDate: new Date().toISOString().slice(0, 16).replace('T', ' ')
    }).catch(() => {});
  };

  // 2. Collector: Accept & Record Pickup (Awards Provisional Grade-B Coins)
  const recordPickup = ({ collectionId, actualQty, notes, segregated = true }) => {
    let earnedInfo = null;

    updateStore((prev) => {
      const colIndex = prev.collections.findIndex((c) => c.id === collectionId);
      if (colIndex === -1) return prev;

      const targetCol = prev.collections[colIndex];
      const giverUser = prev.users.find((u) => u.id === targetCol.giverId);
      const measuredQty = Number(actualQty);

      // 1. Calculate Provisional Grade-B Base Coins
      const ratesConfig = prev.coinRatesConfig || DEFAULT_MATERIAL_RATES;
      const provisionalCalc = calculateProvisionalCoins(targetCol.materialId, measuredQty, ratesConfig);
      const provisionalCoins = provisionalCalc.totalCoins || 0;

      earnedInfo = {
        baseEarned: provisionalCalc.baseCoins,
        materialBonus: 0,
        gradeBonusCoins: 0,
        totalCoins: provisionalCoins,
        rewardValueRupees: provisionalCalc.rewardValueRupees,
        isProvisional: true
      };

      const updatedCol = {
        ...targetCol,
        actualQty: measuredQty,
        collectedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'Sent to Recovery Centre',
        segregated,
        notes: notes || targetCol.notes,
        coinsEarned: provisionalCoins,
        provisionalCoins: provisionalCoins,
        finalCoinsEarned: null,
        isProvisional: true
      };

      const updatedCollections = [...prev.collections];
      updatedCollections[colIndex] = updatedCol;

      // Credit Provisional Coins to Waste Giver
      const updatedUsers = prev.users.map((u) => {
        if (u.id === targetCol.giverId) {
          const updGiver = {
            ...u,
            greenCoinsBalance: (u.greenCoinsBalance || 0) + provisionalCoins
          };
          syncDocToFirestore('users', u.id, updGiver).catch(() => {});
          return updGiver;
        }
        // Update Collector Stats
        if (u.id === targetCol.collectorId) {
          const updCollector = {
            ...u,
            completedCount: (u.completedCount || 0) + 1,
            totalKgCollected: (u.totalKgCollected || 0) + measuredQty
          };
          syncDocToFirestore('users', u.id, updCollector).catch(() => {});
          return updCollector;
        }
        return u;
      });

      // Record transaction
      const newTxn = {
        id: `TXN-GC-${Date.now().toString().slice(-4)}`,
        userId: targetCol.giverId,
        userName: targetCol.giverName,
        collectionId: targetCol.id,
        materialName: targetCol.materialName,
        materialKey: targetCol.materialId,
        quantityKg: measuredQty,
        stage: 'Collection Pickup',
        stageBadge: 'Provisional Grade-B Coins',
        grade: 'Grade B (Provisional)',
        baseRatePerKg: provisionalCalc.baseRatePerKg || 20,
        baseCoins: provisionalCoins,
        gradeBonusPercent: 0,
        gradeBonusCoins: 0,
        totalCoins: provisionalCoins,
        rupeeValue: provisionalCalc.rewardValueRupees,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        type: 'CREDIT'
      };

      // Update Impact Metrics
      const updatedImpact = {
        ...prev.impactMetrics,
        totalWasteCollectedKg: prev.impactMetrics.totalWasteCollectedKg + measuredQty,
        greenCoinsIssuedTotal: prev.impactMetrics.greenCoinsIssuedTotal + provisionalCoins
      };

      // Firestore Sync
      syncDocToFirestore('wasteCollections', updatedCol.id, updatedCol).catch(() => {});
      syncDocToFirestore('impactMetrics', 'liveSummary', updatedImpact).catch(() => {});

      return {
        ...prev,
        collections: updatedCollections,
        users: updatedUsers,
        coinTransactions: [newTxn, ...(prev.coinTransactions || [])],
        impactMetrics: updatedImpact,
        notifications: [
          {
            id: `notif-${Date.now()}`,
            userId: targetCol.giverId,
            title: 'Provisional Green Coins Credited! 🎉',
            message: `Awarded ${provisionalCoins} Provisional Coins (₹${provisionalCalc.rewardValueRupees}) for ${measuredQty}kg ${targetCol.materialName}. Final coins will be confirmed at Recovery Centre verification.`,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            read: false,
            type: 'coin'
          },
          ...prev.notifications
        ]
      };
    });

    return earnedInfo;
  };

  // 3. Admin/RRC Controlled Recovery Dock Processing (Awards Final Coins with Verified Grade Bonus)
  const processRecoveryDock = ({ collectionId, grossWeightKg, segregatedWeightKg, qualityGrade }) => {
    let newBatch = null;

    updateStore((prev) => {
      const colIndex = prev.collections.findIndex((c) => c.id === collectionId);
      if (colIndex === -1) return prev;

      const col = prev.collections[colIndex];
      const batchId = generateBatchID();
      const stockId = `STK-${col.materialName.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      const verifiedCleanWeight = Number(segregatedWeightKg);

      // Final Green Coins Calculation
      const ratesConfig = prev.coinRatesConfig || DEFAULT_MATERIAL_RATES;
      const bonusPct = prev.gradeABonusPercent || DEFAULT_GRADE_A_BONUS_PERCENT;
      const finalCalc = calculateFinalVerifiedCoins(col.materialId, verifiedCleanWeight, qualityGrade, bonusPct, ratesConfig);
      const finalCoins = finalCalc.totalCoins || 0;
      const provisionalCoinsAlreadyGiven = col.coinsEarned || col.provisionalCoins || 0;
      const coinDelta = finalCoins - provisionalCoinsAlreadyGiven;

      newBatch = {
        batchId,
        sourceCollectionId: col.id,
        giverName: col.giverName,
        sourceType: col.sourceType,
        qrIdentity: col.qrCode,
        collectorName: col.collectorName,
        materialName: col.materialName,
        grossWeightKg: Number(grossWeightKg),
        segregatedWeightKg: verifiedCleanWeight,
        grade: qualityGrade,
        recoveryCentreId: 'rc-alpha-01',
        recoveryCentreName: 'City RRC Alpha North',
        processedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'In Marketplace Inventory',
        stockId,
        finalCoinsAwarded: finalCoins,
        traceabilityTimeline: [
          { step: 'Waste Source Registered', date: '2026-09-01', details: `Source ${col.sourceType} ${col.qrCode} active` },
          { step: 'Collection Request', date: col.requestedDate, details: `${col.estimatedQty} ${col.unit} requested` },
          { step: 'QR Scanned & Picked Up', date: col.collectedDate || '2026-09-07', details: `Collected by ${col.collectorName}` },
          { step: 'Recovery Centre Dock Arrival', date: new Date().toISOString().slice(0, 10), details: 'Received at RRC Alpha Dock' },
          { step: 'Segregation & Quality Grading', date: new Date().toISOString().slice(0, 16).replace('T', ' '), details: `Weighed ${segregatedWeightKg}kg clean material - Assigned ${qualityGrade} (+${finalCalc.gradeBonusCoins} bonus coins)` },
          { step: 'Admin Verified B2B Marketplace Inventory', date: new Date().toISOString().slice(0, 16).replace('T', ' '), details: `Published to Recyclers STK ${stockId}` }
        ]
      };

      const updatedCol = {
        ...col,
        status: 'Completed',
        batchId,
        finalCoinsEarned: finalCoins,
        gradeBonusCoins: finalCalc.gradeBonusCoins,
        qualityGrade,
        isProvisional: false
      };

      const updatedCollections = [...prev.collections];
      updatedCollections[colIndex] = updatedCol;

      // Adjust user balance with final difference
      const updatedUsers = prev.users.map((u) => {
        if (u.id === col.giverId) {
          const updGiver = {
            ...u,
            greenCoinsBalance: Math.max(0, (u.greenCoinsBalance || 0) + coinDelta)
          };
          syncDocToFirestore('users', u.id, updGiver).catch(() => {});
          return updGiver;
        }
        return u;
      });

      // Log Final Verified Transaction
      const finalTxn = {
        id: `TXN-GC-${Date.now().toString().slice(-4)}`,
        userId: col.giverId,
        userName: col.giverName,
        collectionId: col.id,
        materialName: col.materialName,
        materialKey: col.materialId,
        quantityKg: verifiedCleanWeight,
        stage: 'Recovery Centre Verification',
        stageBadge: 'Final Verified Coins',
        grade: qualityGrade,
        baseRatePerKg: finalCalc.baseRatePerKg || 20,
        baseCoins: finalCalc.baseCoins,
        gradeBonusPercent: finalCalc.gradeBonusPercent,
        gradeBonusCoins: finalCalc.gradeBonusCoins,
        totalCoins: finalCoins,
        rupeeValue: finalCalc.rewardValueRupees,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        type: 'CREDIT'
      };

      const existingStockIdx = prev.warehouseStock.findIndex((s) => s.category.toLowerCase().includes(col.materialName.toLowerCase()));
      let updatedWarehouseStock = [...prev.warehouseStock];

      if (existingStockIdx >= 0) {
        const stockItem = updatedWarehouseStock[existingStockIdx];
        updatedWarehouseStock[existingStockIdx] = {
          ...stockItem,
          availableQtyKg: stockItem.availableQtyKg + verifiedCleanWeight,
          batchIds: [...stockItem.batchIds, batchId],
          adminVerified: true,
          updatedDate: new Date().toISOString().slice(0, 10)
        };
      } else {
        const priceMap = { 'PET Bottles': 42, 'Clean Plastic': 38, 'Cardboard': 14, 'Metal': 65, 'E-Waste': 280, 'Coconut Waste': 18, 'Aluminium Cans': 135 };
        const newStockItem = {
          id: stockId,
          material: `Verified ${col.materialName} (${qualityGrade})`,
          category: col.materialName,
          availableQtyKg: verifiedCleanWeight,
          reservedQtyKg: 0,
          soldQtyKg: 0,
          qualityGrade,
          pricePerKg: priceMap[col.materialName] || 25,
          recoveryCentre: 'City RRC Alpha North',
          batchIds: [batchId],
          updatedDate: new Date().toISOString().slice(0, 10),
          status: 'Available',
          adminVerified: true,
          image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400'
        };
        updatedWarehouseStock = [newStockItem, ...updatedWarehouseStock];
      }

      // Sync Batch, Stock and Completed Collection to Firestore
      syncDocToFirestore('batches', newBatch.batchId, newBatch).catch(() => {});
      syncDocToFirestore('warehouseStock', stockId, updatedWarehouseStock.find(s => s.id === stockId) || newBatch).catch(() => {});
      syncDocToFirestore('wasteCollections', col.id, updatedCol).catch(() => {});
      syncDocToFirestore('impactMetrics', 'liveSummary', {
        ...prev.impactMetrics,
        wasteRecoveredKg: prev.impactMetrics.wasteRecoveredKg + verifiedCleanWeight,
        greenCoinsIssuedTotal: prev.impactMetrics.greenCoinsIssuedTotal + Math.max(0, coinDelta)
      }).catch(() => {});

      return {
        ...prev,
        collections: updatedCollections,
        batches: [newBatch, ...prev.batches],
        warehouseStock: updatedWarehouseStock,
        users: updatedUsers,
        coinTransactions: [finalTxn, ...(prev.coinTransactions || [])],
        impactMetrics: {
          ...prev.impactMetrics,
          wasteRecoveredKg: prev.impactMetrics.wasteRecoveredKg + verifiedCleanWeight,
          greenCoinsIssuedTotal: prev.impactMetrics.greenCoinsIssuedTotal + Math.max(0, coinDelta)
        },
        notifications: [
          {
            id: `notif-${Date.now()}`,
            userId: col.giverId,
            title: 'Final Green Coins Confirmed! 🎉',
            message: `Recovery Centre verified ${verifiedCleanWeight}kg ${col.materialName} (${qualityGrade}). Final: ${finalCoins} Green Coins (incl. ${finalCalc.gradeBonusCoins} Grade bonus).`,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            read: false,
            type: 'coin'
          },
          ...prev.notifications
        ]
      };
    });

    return newBatch;
  };

  // 4. Buyer: Place Order on B2B Marketplace (Creates Pending Admin Approval Order)
  const placeOrder = ({ buyerUser, stockId, quantityKg }) => {
    let orderResult = null;

    updateStore((prev) => {
      const stockItem = prev.warehouseStock.find((s) => s.id === stockId && s.adminVerified);
      if (!stockItem || stockItem.availableQtyKg < quantityKg) {
        orderResult = { success: false, message: 'Stock unavailable or unverified by Admin.' };
        return prev;
      }

      const orderId = generateOrderID();
      const qty = Number(quantityKg);
      const subtotal = qty * stockItem.pricePerKg;
      const taxAmount = Math.round(subtotal * 0.05); // 5% GST
      const totalAmount = subtotal + taxAmount;

      const newOrder = {
        id: orderId,
        buyerId: buyerUser?.id || 'usr-buyer-1',
        buyerName: buyerUser?.name || 'EcoPolymer Industries Ltd',
        buyerEmail: buyerUser?.email || 'procurement@ecopolymer.com',
        buyerGst: buyerUser?.gstin || '29ABCDE1234F1Z5',
        stockId: stockItem.id,
        materialName: stockItem.material,
        category: stockItem.category,
        quantityKg: qty,
        pricePerKg: stockItem.pricePerKg,
        subtotal,
        taxAmount,
        totalAmount,
        orderDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'Pending Admin Approval',
        recoveryCentre: stockItem.recoveryCentre,
        pickupAddress: `${stockItem.recoveryCentre}, Dock Gate #1`,
        paymentStatus: 'Pending Admin Acceptance',
        paymentMode: 'Manual Payment on Pickup',
        invoiceId: null,
        invoiceDate: null,
        receiptId: null,
        receiptDate: null,
        adminNotes: 'Awaiting Admin review and billing invoice generation.',
        batchRef: stockItem.batchIds[0] || 'BATCH-2026-0891'
      };

      // Reserve the stock
      const updatedWarehouseStock = prev.warehouseStock.map((s) => {
        if (s.id === stockId) {
          const updatedStock = {
            ...s,
            availableQtyKg: s.availableQtyKg - qty,
            reservedQtyKg: (s.reservedQtyKg || 0) + qty
          };
          syncDocToFirestore('warehouseStock', s.id, updatedStock).catch(() => {});
          return updatedStock;
        }
        return s;
      });

      // Sync Order to Firestore
      syncDocToFirestore('orders', newOrder.id, newOrder).catch(() => {});

      orderResult = { success: true, order: newOrder };

      return {
        ...prev,
        orders: [newOrder, ...prev.orders],
        warehouseStock: updatedWarehouseStock,
        notifications: [
          {
            id: `notif-${Date.now()}`,
            userId: buyerUser.id,
            title: 'Purchase Order Submitted!',
            message: `Order ${orderId} for ${qty}kg ${stockItem.material} placed. Awaiting Admin acceptance & Billing Invoice.`,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            read: false,
            type: 'order'
          },
          ...prev.notifications
        ]
      };
    });

    return orderResult;
  };

  // 4a. Admin: Accept Order & Generate Billing Invoice for Buyer
  const adminAcceptOrder = ({ orderId, adminNotes }) => {
    let result = null;

    updateStore((prev) => {
      const ordIndex = prev.orders.findIndex((o) => o.id === orderId);
      if (ordIndex === -1) {
        result = { success: false, message: 'Order not found' };
        return prev;
      }

      const order = prev.orders[ordIndex];
      const invoiceId = generateInvoiceID();
      const invoiceDate = new Date().toISOString().slice(0, 16).replace('T', ' ');

      const updatedOrder = {
        ...order,
        status: 'Order Accepted (Invoice Issued)',
        paymentStatus: 'Payment Pending (Manual Collection)',
        invoiceId,
        invoiceDate,
        adminNotes: adminNotes || 'Order accepted by Admin. Billing Invoice issued for manual payment on warehouse pickup.'
      };

      const updatedOrders = [...prev.orders];
      updatedOrders[ordIndex] = updatedOrder;

      syncDocToFirestore('orders', updatedOrder.id, updatedOrder).catch(() => {});

      result = { success: true, order: updatedOrder, invoiceId };

      return {
        ...prev,
        orders: updatedOrders,
        notifications: [
          {
            id: `notif-${Date.now()}`,
            userId: order.buyerId,
            title: 'Billing Invoice Issued! 📄',
            message: `Admin has accepted Order ${order.id}. Invoice ${invoiceId} (₹${order.totalAmount.toLocaleString()}) generated. Pay manually and collect your stock at ${order.recoveryCentre}.`,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            read: false,
            type: 'invoice'
          },
          ...prev.notifications
        ]
      };
    });

    return result;
  };

  // 4b. Admin: Mark Order as Paid (Manual Payment Received & Stock Released) -> Generates Paid Receipt
  const adminMarkOrderPaid = ({ orderId, paymentMode = 'Cash at Counter', transactionRef = '', adminNotes = '' }) => {
    let result = null;

    updateStore((prev) => {
      const ordIndex = prev.orders.findIndex((o) => o.id === orderId);
      if (ordIndex === -1) {
        result = { success: false, message: 'Order not found' };
        return prev;
      }

      const order = prev.orders[ordIndex];
      const receiptId = generateReceiptID();
      const receiptDate = new Date().toISOString().slice(0, 16).replace('T', ' ');

      const updatedOrder = {
        ...order,
        status: 'Stock Collected & Paid',
        paymentStatus: 'Paid (Verified by Admin)',
        paymentMode,
        transactionRef: transactionRef || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        receiptId,
        receiptDate,
        adminNotes: adminNotes || `Payment verified via ${paymentMode}. Physical stock collected by buyer.`
      };

      const updatedOrders = [...prev.orders];
      updatedOrders[ordIndex] = updatedOrder;

      // Finalize stock (move from reserved to sold)
      const updatedWarehouseStock = prev.warehouseStock.map((s) => {
        if (s.id === order.stockId) {
          return {
            ...s,
            reservedQtyKg: Math.max(0, (s.reservedQtyKg || 0) - order.quantityKg),
            soldQtyKg: (s.soldQtyKg || 0) + order.quantityKg
          };
        }
        return s;
      });

      const updatedImpact = {
        ...prev.impactMetrics,
        totalMarketplaceRevenueRupees: (prev.impactMetrics.totalMarketplaceRevenueRupees || 0) + order.totalAmount
      };

      syncDocToFirestore('orders', updatedOrder.id, updatedOrder).catch(() => {});
      syncDocToFirestore('impactMetrics', 'liveSummary', updatedImpact).catch(() => {});

      result = { success: true, order: updatedOrder, receiptId };

      return {
        ...prev,
        orders: updatedOrders,
        warehouseStock: updatedWarehouseStock,
        impactMetrics: updatedImpact,
        notifications: [
          {
            id: `notif-${Date.now()}`,
            userId: order.buyerId,
            title: 'Payment Confirmed & Receipt Issued! 🎉',
            message: `Payment of ₹${order.totalAmount.toLocaleString()} verified for Order ${order.id}. Paid Receipt ${receiptId} generated and stock released.`,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            read: false,
            type: 'receipt'
          },
          ...prev.notifications
        ]
      };
    });

    return result;
  };

  // 4c. Admin: Reject Order
  const adminRejectOrder = ({ orderId, reason = 'Out of capacity' }) => {
    let result = null;

    updateStore((prev) => {
      const ordIndex = prev.orders.findIndex((o) => o.id === orderId);
      if (ordIndex === -1) return prev;

      const order = prev.orders[ordIndex];
      const updatedOrder = {
        ...order,
        status: 'Cancelled / Rejected',
        paymentStatus: 'Cancelled',
        adminNotes: `Order rejected by Admin: ${reason}`
      };

      // Restore reserved stock
      const updatedWarehouseStock = prev.warehouseStock.map((s) => {
        if (s.id === order.stockId) {
          return {
            ...s,
            availableQtyKg: s.availableQtyKg + order.quantityKg,
            reservedQtyKg: Math.max(0, (s.reservedQtyKg || 0) - order.quantityKg)
          };
        }
        return s;
      });

      const updatedOrders = [...prev.orders];
      updatedOrders[ordIndex] = updatedOrder;

      syncDocToFirestore('orders', updatedOrder.id, updatedOrder).catch(() => {});

      result = { success: true };

      return {
        ...prev,
        orders: updatedOrders,
        warehouseStock: updatedWarehouseStock,
        notifications: [
          {
            id: `notif-${Date.now()}`,
            userId: order.buyerId,
            title: 'Order Cancelled',
            message: `Order ${order.id} was not approved: ${reason}.`,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            read: false,
            type: 'order_rejected'
          },
          ...prev.notifications
        ]
      };
    });

    return result;
  };

  // 4d. Configurable Green Coins Rates & Grade A Bonus Updates
  const updateCoinRatesConfig = (newRates) => {
    updateStore((prev) => {
      syncDocToFirestore('config', 'coinRates', newRates).catch(() => {});
      return {
        ...prev,
        coinRatesConfig: newRates
      };
    });
  };

  const updateGradeABonus = (bonusPercent) => {
    updateStore((prev) => {
      syncDocToFirestore('config', 'gradeABonus', { percent: Number(bonusPercent) }).catch(() => {});
      return {
        ...prev,
        gradeABonusPercent: Number(bonusPercent)
      };
    });
  };

  // 5. Waste Giver: Manual Grocery Redemption Flow
  const redeemGrocery = ({ user, item, requestedQuantity }) => {
    let result = null;

    updateStore((prev) => {
      const validation = validateGroceryRedemption({
        user,
        item,
        requestedQuantity,
        existingRedemptions: prev.redemptions
      });

      if (!validation.valid) {
        result = validation;
        return prev;
      }

      const redemptionId = `RED-2026-${Math.floor(100 + Math.random() * 900)}`;
      const redemptionRecord = {
        id: redemptionId,
        userId: user.id,
        userName: user.name,
        itemId: item.id,
        itemName: `${item.name} (${item.weight})`,
        coinsSpent: validation.totalCoinCost,
        rupeeEquivalent: validation.rupeeEquivalent,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'Fulfilled',
        pickupPoint: 'RRC Alpha Grocery Kiosk #1',
        redemptionCode: `RDM-${Math.floor(1000 + Math.random() * 9000)}`
      };

      const updatedUsers = prev.users.map((u) => {
        if (u.id === user.id) {
          const upd = {
            ...u,
            greenCoinsBalance: u.greenCoinsBalance - validation.totalCoinCost
          };
          syncDocToFirestore('users', u.id, upd).catch(() => {});
          return upd;
        }
        return u;
      });

      const updatedCatalogue = prev.groceryCatalogue.map((g) => {
        if (g.id === item.id) {
          const updGroc = {
            ...g,
            availableStock: g.availableStock - requestedQuantity
          };
          syncDocToFirestore('groceryCatalogue', g.id, updGroc).catch(() => {});
          return updGroc;
        }
        return g;
      });

      // Sync Redemption Record to Firestore
      syncDocToFirestore('redemptions', redemptionRecord.id, redemptionRecord).catch(() => {});

      result = { success: true, redemption: redemptionRecord, message: 'Grocery reward redeemed successfully!' };

      return {
        ...prev,
        users: updatedUsers,
        groceryCatalogue: updatedCatalogue,
        redemptions: [redemptionRecord, ...prev.redemptions],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            userId: user.id,
            title: 'Grocery Redeemed!',
            message: `Redeemed ${item.name} for ${validation.totalCoinCost} Green Coins. Code: ${redemptionRecord.redemptionCode}`,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            read: false,
            type: 'redemption'
          },
          ...prev.notifications
        ]
      };
    });

    return result;
  };

  // 6. Food Rescue (Waste Giver -> NGO Sync)
  const createFoodDonation = ({ donorUser, donorCategory = 'Household', foodType, quantity, peopleServed, safeUntilHours = 8, pickupLocation, contactPhone, description, storageInstructions }) => {
    let newDonation = null;

    updateStore((prev) => {
      const now = new Date();
      const safeTime = new Date(now.getTime() + Number(safeUntilHours) * 60 * 60 * 1000);

      newDonation = {
        id: `FOOD-2026-${Math.floor(500 + Math.random() * 500)}`,
        donorUserId: donorUser?.id || 'usr-giver-1',
        donorName: donorUser?.name || 'Waste Giver',
        donorCategory: donorCategory || donorUser?.sourceType || 'Household',
        foodType,
        quantity,
        peopleServed: Number(peopleServed) || 10,
        preparedDateTime: now.toISOString().slice(0, 16).replace('T', ' '),
        safeUntilDateTime: safeTime.toISOString().slice(0, 16).replace('T', ' '),
        safeUntilHours: Number(safeUntilHours),
        pickupLocation: pickupLocation || donorUser?.address || 'Bengaluru Central',
        contactPhone: contactPhone || donorUser?.phone || '+91 98000 00000',
        description: description || 'Surplus unserved food',
        storageInstructions: storageInstructions || 'Stored hygienically in clean containers',
        status: 'Available',
        acceptedByNgoId: null,
        acceptedByNgoName: null,
        scheduledPickupTime: null,
        rejectionReason: null,
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=400'
      };

      // Sync Food Donation to Cloud Firestore
      syncDocToFirestore('foodDonations', newDonation.id, newDonation).catch(() => {});

      return {
        ...prev,
        foodDonations: [newDonation, ...prev.foodDonations],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            userId: donorUser?.id,
            title: 'Food Donation Listed!',
            message: `Your food donation "${foodType}" (${peopleServed} servings) was published to verified NGOs.`,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            read: false,
            type: 'donation'
          },
          ...prev.notifications
        ]
      };
    });

    return newDonation;
  };

  const acceptFoodDonation = ({ donationId, ngoUser, scheduledTime }) => {
    updateStore((prev) => {
      let donorId = null;
      let foodTitle = '';
      const updatedList = prev.foodDonations.map((f) => {
        if (f.id === donationId) {
          donorId = f.donorUserId;
          foodTitle = f.foodType;
          const updFood = {
            ...f,
            status: 'Accepted',
            acceptedByNgoId: ngoUser?.id || 'usr-ngo-1',
            acceptedByNgoName: ngoUser?.name || 'Annapoorna Food Foundation',
            scheduledPickupTime: scheduledTime || 'Today 18:30',
            rejectionReason: null
          };
          syncDocToFirestore('foodDonations', f.id, updFood).catch(() => {});
          return updFood;
        }
        return f;
      });

      const newNotifs = [...prev.notifications];
      if (donorId) {
        newNotifs.unshift({
          id: `notif-${Date.now()}`,
          userId: donorId,
          title: 'Food Donation Accepted! 🎉',
          message: `${ngoUser?.name || 'An NGO'} has accepted your food donation "${foodTitle}". Scheduled pickup: ${scheduledTime || 'Today 18:30'}.`,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          read: false,
          type: 'donation_accepted'
        });
      }

      return {
        ...prev,
        foodDonations: updatedList,
        notifications: newNotifs,
        impactMetrics: {
          ...prev.impactMetrics,
          foodMealsRescued: prev.impactMetrics.foodMealsRescued + 40
        }
      };
    });
  };

  const rejectFoodDonation = ({ donationId, ngoUser, reason }) => {
    updateStore((prev) => {
      let donorId = null;
      let foodTitle = '';
      const updatedList = prev.foodDonations.map((f) => {
        if (f.id === donationId) {
          donorId = f.donorUserId;
          foodTitle = f.foodType;
          const updFood = {
            ...f,
            status: 'Rejected',
            rejectedByNgoId: ngoUser?.id || 'usr-ngo-1',
            rejectedByNgoName: ngoUser?.name || 'Annapoorna Food Foundation',
            rejectionReason: reason || 'NGO logistics capacity currently full for this area'
          };
          syncDocToFirestore('foodDonations', f.id, updFood).catch(() => {});
          return updFood;
        }
        return f;
      });

      const newNotifs = [...prev.notifications];
      if (donorId) {
        newNotifs.unshift({
          id: `notif-${Date.now()}`,
          userId: donorId,
          title: 'Food Donation Update',
          message: `Your food donation "${foodTitle}" was marked as not feasible by ${ngoUser?.name || 'NGO'}: ${reason || 'Logistics capacity full'}.`,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          read: false,
          type: 'donation_rejected'
        });
      }

      return {
        ...prev,
        foodDonations: updatedList,
        notifications: newNotifs
      };
    });
  };

  const updateFoodStatus = (donationId, newStatus) => {
    updateStore((prev) => ({
      ...prev,
      foodDonations: prev.foodDonations.map((f) => {
        if (f.id === donationId) {
          const updFood = { ...f, status: newStatus };
          syncDocToFirestore('foodDonations', f.id, updFood).catch(() => {});
          return updFood;
        }
        return f;
      })
    }));
  };

  // Admin Config Management
  const addGroceryItem = (newItem) => {
    const itemWithId = { id: `groc-${Date.now().toString().slice(-3)}`, status: 'Available', ...newItem };
    updateStore((prev) => ({
      ...prev,
      groceryCatalogue: [itemWithId, ...prev.groceryCatalogue]
    }));
    syncDocToFirestore('groceryCatalogue', itemWithId.id, itemWithId).catch(() => {});
  };

  const addProhibitedItem = (newItem) => {
    const itemWithId = { id: `pro-${Date.now().toString().slice(-3)}`, ...newItem };
    updateStore((prev) => ({
      ...prev,
      prohibitedWaste: [itemWithId, ...prev.prohibitedWaste]
    }));
    syncDocToFirestore('prohibitedWaste', itemWithId.id, itemWithId).catch(() => {});
  };

  const resetDemoData = () => {
    const fresh = resetStateToDefaults();
    setData(fresh);
  };

  return (
    <DataContext.Provider
      value={{
        data,
        requestCollection,
        acceptCollectionRequest,
        recordPickup,
        processRecoveryDock,
        placeOrder,
        adminAcceptOrder,
        adminMarkOrderPaid,
        adminRejectOrder,
        updateCoinRatesConfig,
        updateGradeABonus,
        redeemGrocery,
        createFoodDonation,
        acceptFoodDonation,
        rejectFoodDonation,
        updateFoodStatus,
        addGroceryItem,
        addProhibitedItem,
        resetDemoData,
        refreshData,
        registerUser
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
