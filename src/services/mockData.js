// REVastra Mock Initial Data for SIH 2026 Prototype

export const INITIAL_MATERIALS = [
  { id: 'mat-organic', name: 'Organic/Vegetable Waste', baseRatePerKg: 20, icon: 'Leaf', unit: 'kg', category: 'Organic' },
  { id: 'mat-wood', name: 'Wood Waste', baseRatePerKg: 40, icon: 'TreeTrunk', unit: 'kg', category: 'Wood & Biomass' },
  { id: 'mat-paper', name: 'Paper', baseRatePerKg: 100, icon: 'FileText', unit: 'kg', category: 'Paper & Pulp' },
  { id: 'mat-cardboard', name: 'Cardboard', baseRatePerKg: 80, icon: 'Package', unit: 'kg', category: 'Paper & Pulp' },
  { id: 'mat-plastic', name: 'Plastic', baseRatePerKg: 200, icon: 'Box', unit: 'kg', category: 'Plastics' },
  { id: 'mat-pet', name: 'PET Bottles', baseRatePerKg: 180, icon: 'Wine', unit: 'kg', category: 'Plastics' },
  { id: 'mat-hdpe', name: 'HDPE Plastic', baseRatePerKg: 220, icon: 'Layers', unit: 'kg', category: 'Plastics' },
  { id: 'mat-metal', name: 'Metal/Scrap Metal', baseRatePerKg: 500, icon: 'Shield', unit: 'kg', category: 'Metals' },
  { id: 'mat-aluminium', name: 'Aluminium', baseRatePerKg: 700, icon: 'Disc', unit: 'kg', category: 'Metals' },
  { id: 'mat-glass', name: 'Glass', baseRatePerKg: 60, icon: 'Glasses', unit: 'kg', category: 'Glass' },
  { id: 'mat-coconut', name: 'Coconut Waste/Husk', baseRatePerKg: 50, icon: 'Trees', unit: 'kg', category: 'Organic' },
  { id: 'mat-cocopeat', name: 'Cocopeat', baseRatePerKg: 50, icon: 'Sparkles', unit: 'kg', category: 'Organic' },
  { id: 'mat-garden', name: 'Garden/Green Waste', baseRatePerKg: 20, icon: 'Sprout', unit: 'kg', category: 'Organic' },
  { id: 'mat-textile', name: 'Textile/Cloth', baseRatePerKg: 120, icon: 'Shirt', unit: 'kg', category: 'Textiles' },
  { id: 'mat-rubber', name: 'Rubber Waste', baseRatePerKg: 150, icon: 'CircleDot', unit: 'kg', category: 'Polymers' },
  { id: 'mat-ewaste', name: 'E-waste', baseRatePerKg: 300, icon: 'Cpu', unit: 'kg', category: 'Electronics' }
];

export const INITIAL_PROHIBITED_WASTE = [
  { id: 'pro-1', title: 'Medical & Biomedical Waste', description: 'Syringes, needles, clinical samples, surgical bandages, expired medicines', severity: 'High Hazard' },
  { id: 'pro-2', title: 'Explosives & Fireworks', description: 'Combustible powders, commercial fireworks, flares, ammunition', severity: 'Extreme Hazard' },
  { id: 'pro-3', title: 'Highly Hazardous Chemicals & Acids', description: 'Battery acid, toxic solvents, industrial bleach, pesticides', severity: 'High Hazard' },
  { id: 'pro-4', title: 'Industrial Hazardous Sludge', description: 'Heavy metal electroplating sludge, chemical plant residues', severity: 'High Hazard' },
  { id: 'pro-5', title: 'Radioactive Materials', description: 'Scientific isotopes, radioactive lab equipment', severity: 'Extreme Hazard' },
  { id: 'pro-6', title: 'Human & Animal Biological Waste', description: 'Biological tissues, carcass, untreated sewage waste', severity: 'Biohazard' }
];

export const INITIAL_USERS = [
  // Waste Givers
  {
    id: 'usr-giver-1',
    name: 'Ananya Sharma',
    email: 'ananya@household.com',
    role: 'waste-giver',
    sourceType: 'Household',
    phone: '+91 98765 43210',
    address: 'Flat 402, Green Meadows, Sector 14, Bengaluru',
    qrCode: 'QR-WG-1001',
    greenCoinsBalance: 480,
    baseCoinsToday: 35,
    streakDays: 4,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'usr-giver-2',
    name: 'The Royal Spice Restaurant',
    email: 'contact@royalspice.in',
    role: 'waste-giver',
    sourceType: 'Restaurant',
    phone: '+91 98111 22233',
    address: '128 Commercial Street, MG Road, Bengaluru',
    qrCode: 'QR-WG-1002',
    greenCoinsBalance: 1250,
    baseCoinsToday: 50,
    streakDays: 12,
    avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'usr-giver-3',
    name: 'Nexus Tech Park Cafeteria',
    email: 'eco@nexustech.com',
    role: 'waste-giver',
    sourceType: 'Institution',
    phone: '+91 99000 88776',
    address: 'Outer Ring Road, Bellandur, Bengaluru',
    qrCode: 'QR-WG-1003',
    greenCoinsBalance: 2400,
    baseCoinsToday: 50,
    streakDays: 18,
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=150'
  },
  // Collectors
  {
    id: 'usr-collector-1',
    name: 'Ramesh Kumar',
    collectorBadgeId: 'CLR-KA-104',
    email: 'ramesh@revastra-collector.org',
    role: 'collector',
    assignedZone: 'East Zone - Corridor 4',
    phone: '+91 97766 55443',
    vehicleNo: 'KA-01-EV-4092',
    totalCollectionsCount: 45,
    completedCount: 40,
    pendingCount: 3,
    cancelledCount: 2,
    totalKgCollected: 325.5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'usr-collector-2',
    name: 'Suresh Patil',
    collectorBadgeId: 'CLR-KA-108',
    email: 'suresh@revastra-collector.org',
    role: 'collector',
    assignedZone: 'South Zone - Corridor 2',
    phone: '+91 98877 66554',
    vehicleNo: 'KA-05-EV-1120',
    totalCollectionsCount: 38,
    completedCount: 35,
    pendingCount: 2,
    cancelledCount: 1,
    totalKgCollected: 290.0,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
  },
  // Buyer
  {
    id: 'usr-buyer-1',
    name: 'EcoPolymer Industries Ltd',
    contactPerson: 'Vikram Mehta',
    email: 'procurement@ecopolymer.com',
    role: 'buyer',
    businessType: 'Plastic Recycler',
    phone: '+91 98444 33221',
    address: 'Peenya Industrial Area Stage II, Bengaluru',
    gstin: '29ABCDE1234F1Z5',
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=150'
  },
  // NGO
  {
    id: 'usr-ngo-1',
    name: 'Annapoorna Food Foundation',
    contactPerson: 'Priya Sundaram',
    email: 'help@annapoornafood.org',
    role: 'ngo',
    registrationNo: 'NGO-KA-2018-9941',
    phone: '+91 99887 76655',
    address: 'Indiranagar 2nd Stage, Bengaluru',
    mealsDistributed: 42500,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
  },
  // Admin
  {
    id: 'usr-admin-1',
    name: 'Jothsanth Allu',
    email: 'jothsanth@gmail.com',
    role: 'admin',
    department: 'Platform Directorate & Operations',
    phone: '+91 98765 00000',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  // Municipality / Urban Local Body (ULB)
  {
    id: 'usr-municipality-1',
    name: 'BBMP Urban Local Body (East Zone)',
    contactPerson: 'K. S. Narayanan (Chief Sanitation Officer)',
    email: 'municipality@bbmp.gov.in',
    role: 'municipality',
    department: 'Solid Waste Management & Sanitation Directorate',
    jurisdiction: 'Bruhat Bengaluru Mahanagara Palike - East Zone (Wards 110-120)',
    phone: '+91 80 2266 0000',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  }
];

export const INITIAL_WASTE_SOURCES = [
  {
    id: 'src-1001',
    userId: 'usr-giver-1',
    name: 'Ananya Household (Sec 14)',
    type: 'Household',
    qrCode: 'QR-WG-1001',
    address: 'Flat 402, Green Meadows, Sector 14, Bengaluru',
    verified: true,
    lastCollection: '2026-09-06'
  },
  {
    id: 'src-1002',
    userId: 'usr-giver-2',
    name: 'Royal Spice Kitchen',
    type: 'Restaurant',
    qrCode: 'QR-WG-1002',
    address: '128 Commercial Street, MG Road, Bengaluru',
    verified: true,
    lastCollection: '2026-09-07'
  },
  {
    id: 'src-1003',
    userId: 'usr-giver-3',
    name: 'Nexus Tech Central Mess',
    type: 'Institution',
    qrCode: 'QR-WG-1003',
    address: 'Outer Ring Road, Bellandur, Bengaluru',
    verified: true,
    lastCollection: '2026-09-05'
  }
];

export const INITIAL_COLLECTIONS = [
  {
    id: 'COL-2026-8901',
    giverId: 'usr-giver-1',
    giverName: 'Ananya Sharma',
    sourceType: 'Household',
    qrCode: 'QR-WG-1001',
    collectorId: 'usr-collector-1',
    collectorName: 'Ramesh Kumar',
    materialId: 'mat-pet',
    materialName: 'PET Bottles',
    estimatedQty: 12,
    actualQty: 12.5,
    unit: 'kg',
    requestedDate: '2026-09-07 08:30',
    collectedDate: '2026-09-07 10:15',
    status: 'Sent to Recovery Centre',
    recoveryCentreId: 'rc-alpha-01',
    batchId: 'BATCH-2026-0891',
    segregated: true,
    coinsEarned: 235,
    notes: 'Clean sorted PET bottles, rinsed'
  },
  {
    id: 'COL-2026-8902',
    giverId: 'usr-giver-2',
    giverName: 'The Royal Spice Restaurant',
    sourceType: 'Restaurant',
    qrCode: 'QR-WG-1002',
    collectorId: 'usr-collector-1',
    collectorName: 'Ramesh Kumar',
    materialId: 'mat-coconut',
    materialName: 'Coconut Waste',
    estimatedQty: 45,
    actualQty: 48,
    unit: 'kg',
    requestedDate: '2026-09-07 07:00',
    collectedDate: '2026-09-07 09:30',
    status: 'Sent to Recovery Centre',
    recoveryCentreId: 'rc-alpha-01',
    batchId: 'BATCH-2026-0892',
    segregated: true,
    coinsEarned: 1490,
    notes: 'Dry coconut shells, ideal for biochar'
  },
  {
    id: 'COL-2026-8903',
    giverId: 'usr-giver-3',
    giverName: 'Nexus Tech Park Cafeteria',
    sourceType: 'Institution',
    qrCode: 'QR-WG-1003',
    collectorId: 'usr-collector-1',
    collectorName: 'Ramesh Kumar',
    materialId: 'mat-cardboard',
    materialName: 'Cardboard',
    estimatedQty: 110,
    actualQty: null,
    unit: 'kg',
    requestedDate: '2026-09-07 09:00',
    collectedDate: null,
    status: 'Pending', // Pending | Accepted | Assigned | Collected | Verified | Completed
    recoveryCentreId: 'rc-alpha-01',
    batchId: null,
    segregated: true,
    notes: 'Baled cardboard boxes from IT supply delivery'
  },
  {
    id: 'COL-2026-8904',
    giverId: 'usr-giver-1',
    giverName: 'Ananya Sharma',
    sourceType: 'Household',
    qrCode: 'QR-WG-1001',
    collectorId: 'usr-collector-1',
    collectorName: 'Ramesh Kumar',
    materialId: 'mat-ewaste',
    materialName: 'E-Waste',
    estimatedQty: 6,
    actualQty: 6.2,
    unit: 'kg',
    requestedDate: '2026-09-06 14:00',
    collectedDate: '2026-09-06 16:30',
    status: 'Completed',
    recoveryCentreId: 'rc-alpha-01',
    batchId: 'BATCH-2026-0888',
    segregated: true,
    coinsEarned: 360,
    notes: 'Old computer motherboards and cables'
  }
];

export const INITIAL_RECOVERY_CENTRES = [
  {
    id: 'rc-alpha-01',
    name: 'City Resource Recovery Centre - North (RRC Alpha)',
    location: 'Yelahanka Zone, Bengaluru',
    capacityTonsPerDay: 50,
    currentStockTons: 18.4,
    managerName: 'Karan Verma',
    contact: '+91 80 2846 1122'
  },
  {
    id: 'rc-south-02',
    name: 'GreenLoop Reclamation Hub - South',
    location: 'Electronics City Phase 1, Bengaluru',
    capacityTonsPerDay: 75,
    currentStockTons: 32.1,
    managerName: 'Sanjay Hegde',
    contact: '+91 80 2852 9900'
  }
];

export const INITIAL_BATCHES = [
  {
    batchId: 'BATCH-2026-0891',
    sourceCollectionId: 'COL-2026-8901',
    giverName: 'Ananya Sharma',
    sourceType: 'Household',
    qrIdentity: 'QR-WG-1001',
    collectorName: 'Ramesh Kumar',
    materialName: 'PET Bottles',
    grossWeightKg: 12.5,
    segregatedWeightKg: 12.0,
    grade: 'Grade A',
    recoveryCentreId: 'rc-alpha-01',
    recoveryCentreName: 'RRC Alpha North',
    processedDate: '2026-09-07 11:30',
    status: 'In Marketplace Inventory',
    stockId: 'STK-PET-901',
    traceabilityTimeline: [
      { step: 'Waste Source Registered', date: '2026-09-01', details: 'Household QR-WG-1001 activated' },
      { step: 'Collection Request', date: '2026-09-07 08:30', details: '12 kg estimated PET bottles requested' },
      { step: 'QR Scanned & Collected', date: '2026-09-07 10:15', details: 'Collected by Ramesh Kumar (EV-4092)' },
      { step: 'RRC Receiving Dock', date: '2026-09-07 11:00', details: 'Received at City RRC Alpha Dock #2' },
      { step: 'Secondary Segregation & Weighing', date: '2026-09-07 11:30', details: 'Weighed 12.0 kg dry clean PET - Quality Grade A assigned' },
      { step: 'Marketplace Digital Inventory', date: '2026-09-07 12:00', details: 'Added to B2B Catalog STK-PET-901 at ₹42/kg' }
    ]
  },
  {
    batchId: 'BATCH-2026-0892',
    sourceCollectionId: 'COL-2026-8902',
    giverName: 'The Royal Spice Restaurant',
    sourceType: 'Restaurant',
    qrIdentity: 'QR-WG-1002',
    collectorName: 'Ramesh Kumar',
    materialName: 'Coconut Waste',
    grossWeightKg: 48.0,
    segregatedWeightKg: 46.5,
    grade: 'Grade A',
    recoveryCentreId: 'rc-alpha-01',
    recoveryCentreName: 'RRC Alpha North',
    processedDate: '2026-09-07 11:45',
    status: 'In Marketplace Inventory',
    stockId: 'STK-COC-902',
    traceabilityTimeline: [
      { step: 'Waste Source Registered', date: '2026-08-15', details: 'Restaurant QR-WG-1002 active' },
      { step: 'Collection Request', date: '2026-09-07 07:00', details: '45 kg coconut husks requested' },
      { step: 'QR Scanned & Collected', date: '2026-09-07 09:30', details: 'Collector Ramesh verified pickup' },
      { step: 'RRC Processing & Grading', date: '2026-09-07 11:45', details: 'Weighed 46.5 kg - Grade A shell stock' },
      { step: 'Marketplace Digital Inventory', date: '2026-09-07 12:15', details: 'Listed under Biochar raw materials STK-COC-902' }
    ]
  }
];

export const INITIAL_WAREHOUSE_STOCK = [
  {
    id: 'STK-PET-901',
    material: 'PET Bottle Flakes (Washed)',
    category: 'Clean Plastic',
    availableQtyKg: 450,
    reservedQtyKg: 50,
    soldQtyKg: 1200,
    qualityGrade: 'Grade A',
    pricePerKg: 42,
    recoveryCentre: 'City RRC Alpha North',
    batchIds: ['BATCH-2026-0891'],
    updatedDate: '2026-09-07',
    status: 'Available',
    adminVerified: true,
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'STK-COC-902',
    material: 'Coconut Shell Briquette Stock',
    category: 'Coconut Waste',
    availableQtyKg: 1200,
    reservedQtyKg: 200,
    soldQtyKg: 3500,
    qualityGrade: 'Grade A',
    pricePerKg: 18,
    recoveryCentre: 'City RRC Alpha North',
    batchIds: ['BATCH-2026-0892'],
    updatedDate: '2026-09-07',
    status: 'Available',
    adminVerified: true,
    image: 'https://images.unsplash.com/photo-1541604193435-22287d32c2c2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'STK-CAR-903',
    material: 'Compressed Cardboard Bales',
    category: 'Cardboard',
    availableQtyKg: 2400,
    reservedQtyKg: 0,
    soldQtyKg: 8900,
    qualityGrade: 'Grade B',
    pricePerKg: 14,
    recoveryCentre: 'GreenLoop Hub South',
    batchIds: ['BATCH-2026-0862'],
    updatedDate: '2026-09-06',
    status: 'Available',
    adminVerified: true,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'STK-ALU-904',
    material: 'Shredded Aluminium Can Scrap',
    category: 'Aluminium Cans',
    availableQtyKg: 380,
    reservedQtyKg: 100,
    soldQtyKg: 2100,
    qualityGrade: 'Grade A',
    pricePerKg: 135,
    recoveryCentre: 'GreenLoop Hub South',
    batchIds: ['BATCH-2026-0855'],
    updatedDate: '2026-09-07',
    status: 'Available',
    adminVerified: true,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400'
  }
];

export const INITIAL_GRADE_A_BONUS_PERCENT = 25;

export const INITIAL_ORDERS = [
  {
    id: 'ORD-2026-4011',
    buyerId: 'usr-buyer-1',
    buyerName: 'EcoPolymer Industries Ltd',
    buyerEmail: 'procurement@ecopolymer.com',
    buyerGst: '29ABCDE1234F1Z5',
    stockId: 'STK-PET-901',
    materialName: 'PET Bottle Flakes (Washed)',
    category: 'Clean Plastic',
    quantityKg: 250,
    pricePerKg: 42,
    subtotal: 10500,
    taxAmount: 525,
    totalAmount: 11025,
    orderDate: '2026-09-07 11:00',
    status: 'Stock Collected & Paid',
    recoveryCentre: 'City RRC Alpha North',
    pickupAddress: 'Yelahanka Zone RRC Dock #2, Bengaluru',
    paymentStatus: 'Paid (Verified by Admin)',
    paymentMode: 'Bank Transfer / RTGS',
    invoiceId: 'INV-2026-0891',
    invoiceDate: '2026-09-07 11:30',
    receiptId: 'REC-2026-0891',
    receiptDate: '2026-09-07 15:45',
    adminNotes: 'Payment verified and stock dispatched with transport gatepass.',
    batchRef: 'BATCH-2026-0891'
  },
  {
    id: 'ORD-2026-4012',
    buyerId: 'usr-buyer-1',
    buyerName: 'EcoPolymer Industries Ltd',
    buyerEmail: 'procurement@ecopolymer.com',
    buyerGst: '29ABCDE1234F1Z5',
    stockId: 'STK-COC-902',
    materialName: 'Coconut Shell Briquette Stock',
    category: 'Coconut Waste',
    quantityKg: 500,
    pricePerKg: 18,
    subtotal: 9000,
    taxAmount: 450,
    totalAmount: 9450,
    orderDate: '2026-09-08 09:15',
    status: 'Pending Admin Approval',
    recoveryCentre: 'City RRC Alpha North',
    pickupAddress: 'Yelahanka Zone RRC Dock #2, Bengaluru',
    paymentStatus: 'Pending Admin Acceptance',
    paymentMode: 'Manual Payment on Pickup',
    invoiceId: null,
    invoiceDate: null,
    receiptId: null,
    receiptDate: null,
    adminNotes: 'Awaiting Admin review and billing invoice generation.',
    batchRef: 'BATCH-2026-0892'
  }
];

export const INITIAL_COIN_TRANSACTIONS = [
  {
    id: 'TXN-GC-901',
    userId: 'usr-giver-1',
    userName: 'Ananya Sharma',
    collectionId: 'COL-2026-8901',
    materialName: 'PET Bottles',
    materialKey: 'mat-pet',
    quantityKg: 12.0,
    stage: 'Recovery Centre Verification',
    stageBadge: 'Final Verified Coins',
    grade: 'Grade A',
    baseRatePerKg: 180,
    baseCoins: 2160,
    gradeBonusPercent: 25,
    gradeBonusCoins: 540,
    totalCoins: 2700,
    rupeeValue: 27.00,
    date: '2026-09-07 11:30',
    type: 'CREDIT'
  },
  {
    id: 'TXN-GC-902',
    userId: 'usr-giver-2',
    userName: 'The Royal Spice Restaurant',
    collectionId: 'COL-2026-8902',
    materialName: 'Coconut Waste',
    materialKey: 'mat-coconut',
    quantityKg: 46.5,
    stage: 'Recovery Centre Verification',
    stageBadge: 'Final Verified Coins',
    grade: 'Grade A',
    baseRatePerKg: 50,
    baseCoins: 2325,
    gradeBonusPercent: 25,
    gradeBonusCoins: 581,
    totalCoins: 2906,
    rupeeValue: 29.06,
    date: '2026-09-07 11:45',
    type: 'CREDIT'
  }
];

export const INITIAL_GROCERY_CATALOGUE = [
  {
    id: 'groc-101',
    name: 'Fortified Sonamasuri Rice',
    weight: '1 kg Pack',
    coinCost: 5000, // 5000 coins = ₹50 value
    marketPriceRupees: 55,
    allowedQtyPerWeek: 2,
    availableStock: 140,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'groc-102',
    name: 'Pure Refined Sugar',
    weight: '1 kg Pack',
    coinCost: 4000, // ₹40 value
    marketPriceRupees: 44,
    allowedQtyPerWeek: 2,
    availableStock: 95,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1622484210800-410a62372d62?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'groc-103',
    name: 'Whole Wheat Atta (Flour)',
    weight: '2 kg Pack',
    coinCost: 9000, // ₹90 value
    marketPriceRupees: 98,
    allowedQtyPerWeek: 1,
    availableStock: 60,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'groc-104',
    name: 'Sunflower Cooking Oil',
    weight: '1 Litre Pouch',
    coinCost: 13000, // ₹130 value
    marketPriceRupees: 140,
    allowedQtyPerWeek: 1,
    availableStock: 45,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'groc-105',
    name: 'Toor Dal (Yellow Pulses)',
    weight: '500g Pack',
    coinCost: 6500, // ₹65 value
    marketPriceRupees: 72,
    allowedQtyPerWeek: 2,
    availableStock: 80,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'groc-106',
    name: 'Iodized Table Salt',
    weight: '1 kg Pack',
    coinCost: 2000, // ₹20 value
    marketPriceRupees: 22,
    allowedQtyPerWeek: 3,
    availableStock: 200,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1518110165401-447a164b38bf?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'groc-107',
    name: 'Fine Rava / Sooji',
    weight: '1 kg Pack',
    coinCost: 4500, // ₹45 value
    marketPriceRupees: 50,
    allowedQtyPerWeek: 2,
    availableStock: 75,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'groc-108',
    name: 'Thick Poha (Flattened Rice)',
    weight: '500g Pack',
    coinCost: 3500, // ₹35 value
    marketPriceRupees: 38,
    allowedQtyPerWeek: 2,
    availableStock: 110,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'groc-109',
    name: 'Chana Dal (Bengal Gram)',
    weight: '500g Pack',
    coinCost: 5500, // ₹55 value
    marketPriceRupees: 60,
    allowedQtyPerWeek: 2,
    availableStock: 90,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'groc-110',
    name: 'Premium Tea Powder',
    weight: '250g Pack',
    coinCost: 7500, // ₹75 value
    marketPriceRupees: 82,
    allowedQtyPerWeek: 1,
    availableStock: 50,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'groc-111',
    name: 'Glucose Biscuits Family Pack',
    weight: '400g Pack',
    coinCost: 3000, // ₹30 value
    marketPriceRupees: 35,
    allowedQtyPerWeek: 3,
    availableStock: 150,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'groc-112',
    name: 'Dishwash Gel & Scrubber Pack',
    weight: '500ml Bottle',
    coinCost: 6000, // ₹60 value
    marketPriceRupees: 68,
    allowedQtyPerWeek: 1,
    availableStock: 65,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300'
  }
];

export const INITIAL_REDEMPTIONS = [
  {
    id: 'RED-2026-101',
    userId: 'usr-giver-1',
    userName: 'Ananya Sharma',
    itemId: 'groc-102',
    itemName: 'Pure Refined Sugar (1 kg)',
    coinsSpent: 4000,
    rupeeEquivalent: 40,
    date: '2026-09-05 16:10',
    status: 'Fulfilled',
    pickupPoint: 'RRC Alpha Grocery Kiosk #1',
    redemptionCode: 'RDM-8821'
  }
];

export const INITIAL_FOOD_DONATIONS = [
  {
    id: 'FOOD-2026-501',
    donorUserId: 'usr-giver-2',
    donorName: 'The Royal Spice Restaurant',
    foodType: 'Buffet Rice, Paneer Curry & Rotis',
    quantity: '40 Servings',
    peopleServed: 40,
    preparedDateTime: '2026-09-07 14:00',
    safeUntilDateTime: '2026-09-07 22:00',
    pickupLocation: '128 Commercial Street, MG Road, Bengaluru',
    contactPhone: '+91 98111 22233',
    description: 'Hygienically stored surplus un-served items from corporate lunch buffet.',
    status: 'Accepted',
    acceptedByNgoId: 'usr-ngo-1',
    acceptedByNgoName: 'Annapoorna Food Foundation',
    scheduledPickupTime: '2026-09-07 18:30',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'FOOD-2026-502',
    donorUserId: 'usr-giver-3',
    donorName: 'Nexus Tech Park Cafeteria',
    foodType: 'Packed Sandwiches & Fruit Bowls',
    quantity: '60 Servings',
    peopleServed: 60,
    preparedDateTime: '2026-09-07 16:00',
    safeUntilDateTime: '2026-09-08 10:00',
    pickupLocation: 'Building 4 Cafeteria Dock, Bellandur, Bengaluru',
    contactPhone: '+91 99000 88776',
    description: 'Sealed cold pack sandwiches prepared fresh for evening seminar.',
    status: 'Available',
    acceptedByNgoId: null,
    acceptedByNgoName: null,
    scheduledPickupTime: null,
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=400'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'usr-giver-1',
    title: 'Green Coins Credited!',
    message: 'You earned 235 Green Coins for your PET bottle collection (COL-2026-8901).',
    timestamp: '2026-09-07 10:15',
    read: false,
    type: 'coin'
  }
];

export const INITIAL_ROUTES = [
  {
    id: 'route-ez-04',
    collectorId: 'usr-collector-1',
    name: 'East Zone Corridor 4 (Indiranagar - MG Road)',
    zone: 'East Zone Corridor 4',
    date: '2026-09-21',
    totalDistanceKm: 14.2,
    estimatedDurationMinutes: 45,
    stops: [
      {
        stopOrder: 1,
        id: 'stop-1',
        name: 'Ananya Sharma (Waste Giver Doorstep)',
        address: 'Green Meadows Sec 14, Indiranagar',
        status: 'Pending',
        qrCode: 'QR-WG-1001',
        material: 'PET Plastic & Paper',
        estimatedQty: 15,
        lat: 12.9716,
        lng: 77.5946
      },
      {
        stopOrder: 2,
        id: 'stop-2',
        name: 'Royal Spice Kitchen',
        address: '128 Commercial St, Shivajinagar',
        status: 'Pending',
        qrCode: 'QR-WG-1002',
        material: 'Organic Kitchen Segregated',
        estimatedQty: 42,
        lat: 12.9815,
        lng: 77.6080
      },
      {
        stopOrder: 3,
        id: 'stop-3',
        name: 'Nexus Tech Park Block B',
        address: 'Outer Ring Road, Indiranagar Ext',
        status: 'Pending',
        qrCode: 'QR-WG-1003',
        material: 'E-Waste & Cardboard',
        estimatedQty: 30,
        lat: 12.9620,
        lng: 77.6380
      },
      {
        stopOrder: 4,
        id: 'stop-4',
        name: 'Green Leaf Co-Op Society',
        address: '14th Cross, Indiranagar Stage 2',
        status: 'Completed',
        qrCode: 'QR-WG-1004',
        material: 'Dry Mixed Recyclables',
        estimatedQty: 25,
        lat: 12.9785,
        lng: 77.6410
      }
    ]
  },
  {
    id: 'route-sz-07',
    collectorId: 'usr-collector-1',
    name: 'South Tech Corridor 7 (Koramangala - HSR)',
    zone: 'South Industrial Area',
    date: '2026-09-21',
    totalDistanceKm: 18.6,
    estimatedDurationMinutes: 60,
    stops: [
      {
        stopOrder: 1,
        id: 'stop-s1',
        name: 'Suresh Menon Household',
        address: '80ft Road, 4th Block Koramangala',
        status: 'Pending',
        qrCode: 'QR-WG-1005',
        material: 'Aluminium Cans & Glass',
        estimatedQty: 18,
        lat: 12.9340,
        lng: 77.6250
      },
      {
        stopOrder: 2,
        id: 'stop-s2',
        name: 'Daily Fresh Bakery & Cafe',
        address: '27th Main, Sector 1 HSR Layout',
        status: 'Pending',
        qrCode: 'QR-WG-1006',
        material: 'Cardboard & Paper Packaging',
        estimatedQty: 55,
        lat: 12.9120,
        lng: 77.6440
      },
      {
        stopOrder: 3,
        id: 'stop-s3',
        name: 'Innovate Campus Recycling Bay',
        address: 'Outer Ring Road, Bellandur',
        status: 'Pending',
        qrCode: 'QR-WG-1007',
        material: 'High-Density Polyethylene (HDPE)',
        estimatedQty: 40,
        lat: 12.9260,
        lng: 77.6760
      }
    ]
  },
  {
    id: 'route-nz-02',
    collectorId: 'usr-collector-1',
    name: 'North Tech Corridor 2 (Hebbal - Manyata)',
    zone: 'North Tech Corridor',
    date: '2026-09-21',
    totalDistanceKm: 22.4,
    estimatedDurationMinutes: 75,
    stops: [
      {
        stopOrder: 1,
        id: 'stop-n1',
        name: 'Manyata Residency Block C',
        address: 'Nagavara Main Road',
        status: 'Pending',
        qrCode: 'QR-WG-1008',
        material: 'PET Bottles & Shrink Wrap',
        estimatedQty: 35,
        lat: 13.0450,
        lng: 77.6200
      },
      {
        stopOrder: 2,
        id: 'stop-n2',
        name: 'Hebbal Bio-Waste Point',
        address: 'Bellary Road, Ganganagar',
        status: 'Pending',
        qrCode: 'QR-WG-1009',
        material: 'Organic Compostables',
        estimatedQty: 60,
        lat: 13.0280,
        lng: 77.5890
      }
    ]
  }
];

export const INITIAL_IMPACT_METRICS = {
  totalWasteCollectedKg: 48620,
  wasteRecoveredKg: 46150,
  landfillDiversionPercent: 94.9,
  greenCoinsIssuedTotal: 184500,
  foodMealsRescued: 8420,
  co2DivertedTons: 68.4,
  activeWasteGivers: 1240,
  activeBuyers: 48,
  totalMarketplaceRevenueRupees: 894200
};

// ReVastra CivicWatch Seed Reports (Round 3 Feature)
export const INITIAL_CIVIC_REPORTS = [
  {
    reportId: 'RV-CW-0001',
    photoUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=600',
    latitude: 12.9784,
    longitude: 77.6408,
    address: '100 Feet Road, Near HAL 2nd Stage Signal, Indiranagar',
    area: 'Indiranagar',
    ward: 'Ward 112 - Domlur / Indiranagar',
    wasteType: 'Plastic',
    description: 'Huge pile of discarded single-use plastic cups, packaging boxes and PET bottles dumped along the footpath sidewalk.',
    landmark: 'Opposite Corner Cafe, next to electrical transformer',
    reportedAt: '2026-09-22 08:45',
    concernedMunicipality: 'BBMP Urban Local Body (East Zone)',
    status: 'Cleanup in Progress',
    assignedTeam: {
      teamId: 'TEAM-03',
      teamName: 'Municipal Quick Response Team 03 - East Sanitation',
      assignedAt: '2026-09-22 10:30',
      notes: 'Dispatched with 1 Mini-Tipper and 3 sanitation marshals.'
    },
    verifiedAt: '2026-09-22 09:15',
    cleanupStartedAt: '2026-09-22 11:00',
    cleanedAt: null,
    closedAt: null,
    resolutionPhotoUrl: null,
    recoveryPotential: 'Recoverable',
    forwardedToRRC: false,
    rrcCollectionId: null
  },
  {
    reportId: 'RV-CW-0002',
    photoUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600',
    latitude: 12.9352,
    longitude: 77.6245,
    address: '5th Block Main Road, Near Jyoti Nivas College Junction, Koramangala',
    area: 'Koramangala',
    ward: 'Ward 151 - Koramangala',
    wasteType: 'Mixed Waste',
    description: 'Illegal roadside dump with cardboard cartons, food containers, and packaging material overflowing onto the road.',
    landmark: 'Behind bus stop shelter',
    reportedAt: '2026-09-21 14:20',
    concernedMunicipality: 'BBMP Urban Local Body (South Zone)',
    status: 'Cleaned',
    assignedTeam: {
      teamId: 'TEAM-07',
      teamName: 'South Zone Rapid Sweepers Unit 07',
      assignedAt: '2026-09-21 15:00',
      notes: 'Collected 85kg mixed dry recyclables.'
    },
    verifiedAt: '2026-09-21 14:40',
    cleanupStartedAt: '2026-09-21 15:30',
    cleanedAt: '2026-09-21 17:15',
    closedAt: null,
    resolutionPhotoUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600',
    recoveryPotential: 'Recoverable',
    forwardedToRRC: true,
    rrcCollectionId: 'COL-2026-8905'
  },
  {
    reportId: 'RV-CW-0003',
    photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600',
    latitude: 12.9716,
    longitude: 77.5946,
    address: 'Residency Road Cross, Near Shanthala Silk House, Central Ward',
    area: 'Shanthala Nagar',
    ward: 'Ward 111 - Shantala Nagar',
    wasteType: 'Paper/Cardboard',
    description: 'Commercial shop packaging waste dumped along storm water drain edge.',
    landmark: 'Behind Metro Pillar 142',
    reportedAt: '2026-09-23 09:10',
    concernedMunicipality: 'BBMP Urban Local Body (East Zone)',
    status: 'Reported',
    assignedTeam: null,
    verifiedAt: null,
    cleanupStartedAt: null,
    cleanedAt: null,
    closedAt: null,
    resolutionPhotoUrl: null,
    recoveryPotential: 'Pending Assessment',
    forwardedToRRC: false,
    rrcCollectionId: null
  },
  {
    reportId: 'RV-CW-0004',
    photoUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600',
    latitude: 12.9141,
    longitude: 77.6509,
    address: '27th Main Road, Sector 1, HSR Layout',
    area: 'HSR Layout',
    ward: 'Ward 174 - HSR Layout',
    wasteType: 'Construction Waste',
    description: 'Debris, broken tiles, and cement bags dumped near vacant plot corner.',
    landmark: 'Next to BBMP Park gate #3',
    reportedAt: '2026-09-20 11:30',
    concernedMunicipality: 'BBMP Urban Local Body (South Zone)',
    status: 'Closed',
    assignedTeam: {
      teamId: 'TEAM-12',
      teamName: 'Heavy Debris Clearing Squad 12',
      assignedAt: '2026-09-20 13:00',
      notes: 'Cleared via hydraulic loader truck.'
    },
    verifiedAt: '2026-09-20 12:15',
    cleanupStartedAt: '2026-09-20 14:00',
    cleanedAt: '2026-09-20 16:45',
    closedAt: '2026-09-20 18:00',
    resolutionPhotoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
    recoveryPotential: 'Non-Recoverable',
    forwardedToRRC: false,
    rrcCollectionId: null
  },
  {
    reportId: 'RV-CW-0005',
    photoUrl: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&q=80&w=600',
    latitude: 12.9856,
    longitude: 77.7289,
    address: 'ITPL Main Road, Near Hoodi Circle, Whitefield',
    area: 'Whitefield',
    ward: 'Ward 84 - Hagadur / Whitefield',
    wasteType: 'E-Waste',
    description: 'Broken computer chassis, tangled cables, and discarded monitor casings dumped by the roadside.',
    landmark: 'Beside Tech Park flyover pillar',
    reportedAt: '2026-09-23 07:50',
    concernedMunicipality: 'BBMP Urban Local Body (East Zone)',
    status: 'Verified',
    assignedTeam: null,
    verifiedAt: '2026-09-23 08:30',
    cleanupStartedAt: null,
    cleanedAt: null,
    closedAt: null,
    resolutionPhotoUrl: null,
    recoveryPotential: 'Recoverable',
    forwardedToRRC: false,
    rrcCollectionId: null
  }
];

