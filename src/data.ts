/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AssetType } from './types';

export const POPULAR_VEHICLES = [
  { id: '1', brand: 'Toyota', model: 'Premio FEX', year: 2018, type: 'Sedan', fuel: 'Octane/Hybrid', image: '🚗' },
  { id: '2', brand: 'Toyota', model: 'Allion A15', year: 2017, type: 'Sedan', fuel: 'Octane', image: '🚗' },
  { id: '3', brand: 'Toyota', model: 'Axio WxB', year: 2019, type: 'Sedan', fuel: 'Hybrid', image: '🚗' },
  { id: '4', brand: 'Toyota', model: 'Aqua S-Grade', year: 2018, type: 'Hatchback', fuel: 'Hybrid', image: '🚗' },
  { id: '5', brand: 'Honda', model: 'Vezel RS', year: 2017, type: 'SUV', fuel: 'Hybrid', image: '🚙' },
  { id: '6', brand: 'Nissan', model: 'X-Trail', year: 2018, type: 'SUV', fuel: 'Hybrid', image: '🚙' }
];

export const BANGLADESH_REGIONS = [
  'Dhaka - Banani',
  'Dhaka - Gulshan',
  'Dhaka - Dhanmondi',
  'Dhaka - Uttara',
  'Dhaka - Mirpur',
  'Dhaka - Tejgaon',
  'Chattogram - GEC',
  'Chattogram - Nasirabad',
  'Chattogram - Agrabad',
  'Sylhet - Zindabazar'
];

export interface TemplateItem {
  id: string;
  section: string;
  key: string;
  label: string;
  labelBn: string;
  inputType: 'BOOL' | 'NUMBER' | 'TEXT' | 'ENUM';
  options?: string[];
  optionsBn?: string[];
  isRequired: boolean;
  requiredPhotos: number;
}

export const CAR_INSPECTION_TEMPLATE: TemplateItem[] = [
  {
    id: 't1',
    section: 'Chassis & Structure',
    key: 'chassis_salvage',
    label: 'Chassis Welding or Salvage repairs identified',
    labelBn: 'চ্যাসিসে জোড়াতালি বা ওয়েল্ডিং এর প্রমাণ আছে কি?',
    inputType: 'BOOL',
    isRequired: true,
    requiredPhotos: 2
  },
  {
    id: 't2',
    section: 'Chassis & Structure',
    key: 'corrosion_underbody',
    label: 'Underbody Rust or Coastal Saline Corrosion',
    labelBn: 'গাড়ির তলদেশে জং বা নোনাধরা ক্ষয় আছে কি?',
    inputType: 'ENUM',
    options: ['None', 'Surface Rust', 'Structural Rot'],
    optionsBn: ['নেই', 'হালকা জং', 'গুরুতর জং'],
    isRequired: true,
    requiredPhotos: 2
  },
  {
    id: 't3',
    section: 'Engine & Transmission',
    key: 'engine_oil_sludge',
    label: 'Engine oil sludge or internal wear markers',
    labelBn: 'ইঞ্জিন অয়েল স্ল্যাজ বা অভ্যন্তরীণ ক্ষয় আছে কি?',
    inputType: 'BOOL',
    isRequired: true,
    requiredPhotos: 1
  },
  {
    id: 't4',
    section: 'Engine & Transmission',
    key: 'compression_leakage',
    label: 'Blowby or active cylinder compression leakage',
    labelBn: 'ব্লো-বাই বা সিলিন্ডার কম্প্রেশন লিকেজ আছে?',
    inputType: 'BOOL',
    isRequired: true,
    requiredPhotos: 1
  },
  {
    id: 't5',
    section: 'Electronics & OBD2',
    key: 'obd2_cleared_recent',
    label: 'OBD2 Diagnostic codes recently erased (Tamper check)',
    labelBn: 'ওবিডি২ ডায়াগনস্টিক ট্রাবল কোড মুছে ফেলা হয়েছে কি?',
    inputType: 'BOOL',
    isRequired: true,
    requiredPhotos: 1
  },
  {
    id: 't6',
    section: 'Electronics & OBD2',
    key: 'hybrid_battery_soc',
    label: 'Hybrid Battery State of Health (SoH) %',
    labelBn: 'হাইব্রিড ব্যাটারির স্বাস্থ্যর হার (SoH) %',
    inputType: 'NUMBER',
    isRequired: false,
    requiredPhotos: 1
  },
  {
    id: 't7',
    section: 'Odometer Integrity',
    key: 'odometer_rollback',
    label: 'Display Odometer rollback anomalies (Compare with Auction sheet)',
    labelBn: 'ওডোমিটারে ম্যানিপুলেশান বা রিডিং কমানো হয়েছে?',
    inputType: 'BOOL',
    isRequired: true,
    requiredPhotos: 2
  },
  {
    id: 't8',
    section: 'Suspension & Steering',
    key: 'abs_actuator_noise',
    label: 'ABS Actuator or Brake booster motor squeaking',
    labelBn: 'এবিএস একচুয়েটর বা ব্রেক বুস্টার মোটরে শব্দ আছে?',
    inputType: 'BOOL',
    isRequired: true,
    requiredPhotos: 1
  }
];

export const TRANSLATIONS = {
  en: {
    title: 'GariAudit',
    slogan: 'Trust-as-a-Service Platform',
    subtitle: 'On-demand pre-purchase vehicle verification by certified auditors in Bangladesh',
    menuLanding: 'Home',
    menuBuyer: 'Buyer Portal',
    menuAuditor: 'Auditor Portal',
    menuAdmin: 'Admin Dashboard',
    
    // Landing Page
    heroTitle: 'Buy Used Cars in Bangladesh with Absolute Certainty',
    heroDesc: 'Connect with certified expert inspectors on-demand. Receive tamper-proof, verified structural and diagnostic fitness reviews before spending BDT 15-40 Lakhs.',
    ctaBook: 'Book an Inspection Now',
    ctaJoin: 'Join as Auditor',
    activeGigsCount: 'Active Audits Today',
    inspectorsVerified: 'Certified Inspectors',
    carsAudited: 'Vehicles Evaluated',
    
    marketIssueTitle: 'The Used Car Blindspot in Dhaka & Chattogram',
    marketIssueText1: 'Over 300,000 unfit/reconditioned vehicles ply the roads of Bangladesh. Importers and local brokers frequently spoof Japanese auction sheets, reset OBD2 fault markers, and roll back odometers.',
    marketIssueText2: 'Buyers usually rely on informal mechanics who lack advanced test diagnostics, or they end up purchase-trapped in overpriced "lemon" cars. GariAudit provides immutable, tamper-proof audit certificates.',

    howItWorks: 'Secure Marketplace Workflow',
    step1Title: '1. Request',
    step1Desc: 'Buyer enters vehicle info, selects a location, and makes a bKash deposit.',
    step2Title: '2. Claim',
    step2Desc: 'Verified gig mechanics in Dhaka & Chattogram claim the request instantly.',
    step3Title: '3. Audit',
    step3Desc: 'Auditor runs a mobile-guided 50+ point check with tamper logs even offline.',
    step4Title: '4. QC Review',
    step4Desc: 'Senior inspectors verify uploaded OBD2 scans & under-chassis captures.',
    step5Title: '5. Share',
    step5Desc: 'Unalterable web report is locked with a QR seal for banks, buyers, & insurers.',

    whyWeArePremium: 'Why GariAudit is Premium & Different',
    noAiGenerated: 'No AI Hallucinations. Pure Engineering Reality.',
    noAiDesc: 'Our ratings are based on strict physical inspections, verifiable telemetry, and professional mechanics, combined with database immutability tracking.',
    hexagonalBackend: 'Engineered for Scale: Hexagonal (Ports & Adapters) Backend',
    hexagonalDesc: 'Designed to support offline-first operations on 4G networks, preventing concurrency races and audit tampering via strict PostgreSQL constraints.',

    pricingTitle: 'Simple, Transparent Inspection Rates',
    basicPackage: 'Basic Diagnostic',
    premiumPackage: 'Premium Structural',
    evPack: 'Hybrid & EV Specialist',
    priceBasic: '৳৩,৫০০',
    pricePremium: '৳৫,০০০',
    priceEv: '৳৬,৫০০',
    
    // Buyer Page
    bookInspection: 'Book Inspection Request',
    vehicleDetails: 'Vehicle & Location Details',
    selectBrand: 'Select JDM Model Group',
    plateNumber: 'Plate / Chassis Number',
    platePlaceholder: 'Dhaka Metro-GA-11-2233',
    selectLocation: 'Preferred Inspection Location',
    selectDate: 'Preferred Time Window',
    notes: 'Access Instructions or Broker contact',
    paymentGateway: 'Local Mobile Wallet Security Deposit',
    paymentDesc: 'Pay partial safety fee (৳৫০০) to allocate your inspector instantly. The remaining is paid upon report locking.',
    bkashWallet: 'bKash Wallet Direct',
    mockTxInput: 'Sender bKash Wallet No.',
    mockTxplaceholder: '01XXXXXXXXX',
    bookSubmit: 'Initialize Idempotent Request',
    
    buyerReports: 'Your Live Inspection Reports',
    reportApproved: 'QC Approved',
    reportPending: 'Inspection in Progress',
    crScore: 'CR Fitness Rating',
    tamperAlerts: 'Tamper & Safety Alerts',
    odometerAlert: 'CRITICAL: Odometer Rollback Detected!',
    odometerDesc: 'OBD cluster logs 142,000 km while gauge reads 54,000 km. Reconditioned Auction sheet grade was altered from 3.5 to R.',
    costEstimator: 'Projected Immediate Repair Costs',
    engineRepairs: 'Engine Oil Flush & Gasket: ৳১২,০০০',
    brakeReplacement: 'ABS Actuator recalibration: ৳২৫,০০০',
    totalEst: 'Total Estimated Cost',
    
    // Auditor Page
    auditorOverview: 'Auditor Gig Command Center',
    serviceLevel: 'Assigned ID: #7890 • Verification: Level 2 PRO',
    availableGigs: 'Available Gigs Nearby (Dhaka Metro)',
    claimGig: 'Claim Gig',
    runningJob: 'Active Inspection checklist',
    photoRequired: 'photos required',
    submitAudit: 'Validate & Lock Submission',
    syncStatus: 'Sync Queue: Offline Storage Ready',
    
    // Admin Page
    adminTitle: 'Central QC & Compliance Console',
    verifyDocuments: 'Auditor KYC Approvals',
    qcSpot: 'Inspection QC & Report Release',
    approveReport: 'Release Secure Report to Buyer',
    flagCount: 'Suspicious Flags Logged',
    disputeResolve: 'Marketplace Dispute Resolutions'
  },
  bn: {
    title: 'গাড়িঅডিট',
    slogan: 'ট্রাস্ট-অ্যাজ-এ-সার্ভিস প্ল্যাটফর্ম',
    subtitle: 'বাংলাদেশে সার্টিফাইড অডিটর দ্বারা অন-ডিমান্ড গাড়ি ক্রয়-পূর্ববর্তী নির্ভরযোগ্য ফিজিক্যাল ভেরিফিকেশন',
    menuLanding: 'হোমপেজ',
    menuBuyer: 'ক্রেতা পোর্টাল',
    menuAuditor: 'অডিটর পোর্টাল',
    menuAdmin: 'অ্যাডমিন ড্যাশবোর্ড',

    // Landing Page
    heroTitle: 'শতভাগ নিশ্চিন্ত হয়ে ব্যবহৃত গাড়ি কিনুন',
    heroDesc: 'বাংলাদেশী দক্ষ মেকানিক ও অডিটরদের সাথে সরাসরি যুক্ত হোন। ১৫-৪০ লক্ষ টাকার গাড়ি কেনার পূর্বে পান ওডোমিটার টেম্পারিং ও চেসিস জোড়াতালিমুক্ত ডিজিটাল ফিটনেস সার্টিফিকেট।',
    ctaBook: 'ইন্সপেকশন বুক করুন',
    ctaJoin: 'অডিটর হিসেবে যুক্ত হোন',
    activeGigsCount: 'আজকের চলমান অডিট',
    inspectorsVerified: 'সার্টিফাইড মেকানিক',
    carsAudited: 'যাচাইকৃত গাড়ি',

    marketIssueTitle: 'ঢাকা ও চট্টগ্রামের গাড়ি কেনার নীরব ফাঁদ',
    marketIssueText1: 'বর্তমানে দেশের সড়কে ৩ লাখের বেশি আনফিট গাড়ি রয়েছে। বিক্রিত ৭০% গাড়িই জাপানি রিকন্ডিশন্ড (যেমন প্রিমিও, অ্যালিয়ন, ফিল্ডার)। কিন্তু অসৎ ব্রোকাররা নিলাম শিট জাল করে ও ওডোমিটার কমিয়ে গাড়ি ব্রান্ড-নিউ বলে বিক্রি করে।',
    marketIssueText2: 'সাধারণ মেকানিকদের ইসিইউ বা ওবিডি স্ক্যানার ব্যবহারের সক্ষমতা থাকে না। তাই গাড়িঅডিট নিয়ে এসেছে ইমিউটেবল (অপরিবর্তনশীল) এবং জালিয়াতিমুক্ত সুরক্ষিত ইন্সপেকশন রিপোর্ট।',

    howItWorks: 'নিরাপদ মার্কেটপ্লেস ওয়ার্কফ্লো',
    step1Title: '১. রিকোয়েস্ট',
    step1Desc: 'ক্রেতা গাড়ির তথ্য দিয়ে বুকিং করেন এবং bKash এ ডিপোজিট সম্পন্ন করেন।',
    step2Title: '২. ক্লেইম',
    step2Desc: 'ঢাকা ও চট্টগ্রামের ভেরিফাইড গিগ মেকানিকরা রিকোয়েস্টটি ক্লেইম করেন।',
    step3Title: '৩. অডিট',
    step3Desc: 'মোবাইল নির্দেশিত ৫০+ পয়েন্ট চেকলিস্ট অফলাইনেও পূরণ ও ছবি আপলোড করেন।',
    step4Title: '৪. রিভিউ',
    step4Desc: 'সিনিয়র মেকানিক্যাল রিভিউ প্যানেল রিপোর্টটি পুনরায় পরীক্ষা করে নিশ্চিত হন।',
    step5Title: '৫. শেয়ার',
    step5Desc: 'ক্রেতাকে একটি অপরিবর্তনশীল কিউআর কোডযুক্ত সুরক্ষিত ডিজিটাল রিপোর্ট দেওয়া হয়।',

    whyWeArePremium: 'প্রিমিয়াম কোয়ালিটি ফিচারসমূহ',
    noAiGenerated: 'কোনো এআই কল্পনা নয়। শতভাগ বাস্তব মেকানিক্যাল সত্য।',
    noAiDesc: 'আমাদের প্রতিটি রিপোর্ট মেকানিক ও ডায়াগনস্টিক টুলের সরাসরি তদারকি ও চেসিস পরীক্ষা থেকে সংগৃহীত ডাটা নিয়ে তৈরি।',
    hexagonalBackend: 'স্কেলযোগ্য হেক্সাগোনাল (পোর্ট অ্যান্ড অ্যাডাপ্টার) ব্যাকএন্ড',
    hexagonalDesc: 'মোবাইল নেটওয়ার্কের ত্রুটি বা ৪জি সমস্যার কথা চিন্তা করে অফলাইন-ফার্স্ট এবং PostgreSQL রেস-কন্ডিশন নিরাপদ ডিজাইনে তৈরি।',

    pricingTitle: 'সহজ এবং সাশ্রয়ী সার্ভিস চার্জ',
    basicPackage: 'বেসিক ডায়াগনস্টিক',
    premiumPackage: 'প্রিমিয়াম স্ট্রাকচারাল',
    evPack: 'হাইব্রিড ও ইভি স্পেশালিস্ট',
    priceBasic: '৳৩,৫০০',
    pricePremium: '৳৫,০০০',
    priceEv: '৳৬,৫০০',

    // Buyer Page
    bookInspection: 'গাড়ি যাচাইয়ের জন্য বুকিং করুন',
    vehicleDetails: 'গাড়ি এবং লোকেশনের বিবরণ',
    selectBrand: 'JDM গাড়ি নির্বাচন করুন',
    plateNumber: 'নম্বর প্লেট / চেসিস নম্বর',
    platePlaceholder: 'ঢাকা মেট্রো-গ-১১-২২৩৩',
    selectLocation: 'গাড়িটি পরিদর্শনের ঠিকানা',
    selectDate: 'পরিদর্শনের সম্ভাব্য সময়',
    notes: 'ব্রোকার বা শোরুমের যোগাযোগের নম্বর',
    paymentGateway: 'বিকাশ সিকিউরিটি ডিপোজিট ও সাবমিশন',
    paymentDesc: 'ইন্সপেকটরকে তাৎক্ষনিক বুক করার জন্য অগ্রিম ৳৫০০ ফি বিকাশ করুন। বাকি টাকা রিপোর্ট পাওয়ার পর পরিশোধযোগ্য।',
    bkashWallet: 'বিকাশ ওয়ালেট নম্বর',
    mockTxInput: 'প্রেরক বিকাশ মোবাইল নম্বর',
    mockTxplaceholder: '01XXXXXXXXX',
    bookSubmit: 'আইডেমপোটেন্ট রিকোয়েস্ট পাঠান',

    buyerReports: 'আপনার সচল ইন্সপেকশন রিপোর্টসমূহ',
    reportApproved: 'রিভিউ সম্পন্ন',
    reportPending: 'অডিট চলমান রয়েছে',
    crScore: 'ফিটনেস স্কোর',
    tamperAlerts: 'টেম্পারিং ও ঝুকিপূর্ণ অ্যালার্টসমূহ',
    odometerAlert: 'বিপদসংকেত: ওডোমিটার রিব্যাক বা কমানো হয়েছে!',
    odometerDesc: 'ইঞ্জিন ক্লাস্টার রিডিংয়ে দেখাচ্ছে ১৪২,০০০ কিমি যা মিটারে আছে মাত্র ৫৪,০০০ কিমি। অপশন গ্রেড ৩.৫ থেকে জাল করে আর (R) করা হয়েছে।',
    costEstimator: 'প্রয়োজনীয় সংস্কার ব্যয়ের আনুমানিক হিসাব',
    engineRepairs: 'ইঞ্জিন অয়েল ফ্ল্যাশ ও গ্যাসকেট পরিবর্তন: ৳১২,০০০',
    brakeReplacement: 'এবিএস একচুয়েটর ও ব্রেক বুস্টার: ৳২৫,০০০',
    totalEst: 'মোট আনুমানিক সংস্কার ব্যয়',

    // Auditor Page
    auditorOverview: 'অডিটর কমান্ড সেন্টার (ঢাকা)',
    serviceLevel: 'আইডি: #৭৮৯০ • সার্টিফিকেট: লেভেল ২ প্রো',
    availableGigs: 'আপনার নিকটবর্তী এলাকায় সহজ গিগসমূহ (ঢাকা মেট্রো)',
    claimGig: 'গিগ ক্লেইম করুন',
    runningJob: 'চলমান অডিট চেকলিস্ট',
    photoRequired: 'টি ছবি লাগবে',
    submitAudit: 'চেকলিস্ট যাচাই ও লক করুন',
    syncStatus: 'সিঙ্ক কিউ: অফলাইনে সংরক্ষন রেডি',

    // Admin Page
    adminTitle: 'অ্যাডমিন কমপ্লায়েন্স ও কিউসি কন্ট্রোল',
    verifyDocuments: 'অডিটর কেওয়াইসি অনুমোদন',
    qcSpot: 'অডিট রিপোর্ট কিউসি ও ক্রেতার কাছে পাঠানো',
    approveReport: 'রিপোর্টটি লক করে ক্রেতার পোর্টালে পাঠান',
    flagCount: 'সন্দেহজনক অ্যালার্ট সংখ্যা',
    disputeResolve: 'মার্কেটপ্লেস বিবাদ নিষ্পত্তি'
  }
};
