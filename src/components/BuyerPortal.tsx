/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TRANSLATIONS, POPULAR_VEHICLES, BANGLADESH_REGIONS } from '../data';
import { Gig } from '../types';
import { 
  Calendar, 
  MapPin, 
  CreditCard, 
  ClipboardCheck, 
  CheckCircle, 
  Clock, 
  AlertOctagon, 
  FileText, 
  Share2, 
  Award,
  Info,
  Calculator,
  ShieldAlert,
  Wrench,
  ChevronRight,
  ChevronDown,
  Activity,
  Cpu,
  BadgeAlert,
  Database,
  ArrowRight,
  CheckCircle2,
  ListFilter,
  MessageSquare,
  Send,
  X,
  AlertTriangle
} from 'lucide-react';

interface BuyerPortalProps {
  lang: 'en' | 'bn';
  gigs: Gig[];
  onBookInspection: (data: {
    assetType: 'CAR'|'EV'|'SCOOTER';
    vehicleModel: string;
    plateNumber: string;
    locationText: string;
    notes?: string;
    method: 'WALLET_TX'|'CASH';
    txId: string;
    walletNo: string;
  }) => void;
  onPushLog?: (type: 'API_REQUEST' | 'API_RESPONSE' | 'SQL_STATEMENT' | 'HEX_PORT', title: string, code: string) => void;
}

export default function BuyerPortal({ lang, gigs, onBookInspection, onPushLog }: BuyerPortalProps) {
  const text = TRANSLATIONS[lang];

  // Active Tab within the Buyer Portal
  const [subTab, setSubTab] = useState<'booking' | 'reports' | 'tariff' | 'maintenance'>('booking');

  // Book Inspection states
  const [selectedModel, setSelectedModel] = useState(POPULAR_VEHICLES[0].brand + ' ' + POPULAR_VEHICLES[0].model);
  const [plateNumber, setPlateNumber] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(BANGLADESH_REGIONS[0]);
  const [notes, setNotes] = useState('');
  const [walletNo, setWalletNo] = useState('');
  const [txId, setTxId] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Active Selected Report within Reports list
  const [activeReportId, setActiveReportId] = useState<string>('rep_allion');

  // Dispute Chat system state
  const [isDisputeOpen, setIsDisputeOpen] = useState<boolean>(false);
  const [newMessageText, setNewMessageText] = useState<string>('');
  const [typingState, setTypingState] = useState<boolean>(false);
  const [disputeMessages, setDisputeMessages] = useState<Record<string, Array<{
    id: string;
    sender: 'buyer' | 'admin';
    senderName: string;
    text: string;
    timestamp: string;
  }>>>({
    rep_allion: [
      {
        id: 'init_allion_1',
        sender: 'admin',
        senderName: lang === 'en' ? 'Administrative Tech Lead' : 'প্রধান কারিগরি নিরীক্ষক',
        text: lang === 'en' 
          ? 'Greeting, Auditor Desk here. I see your report highlights Odometer mileage manipulation from 142k km to 54k km. Do you wish to file a secure dispute claim and request a double physical audit?' 
          : 'নমস্কার, অডিটর ডেস্ক থেকে বলছি। আপনার রিপোর্টে ওডোমিটার কারচুপির প্রমাণ পাওয়া গিয়েছে। আপনি কি পুনরায় ফিজিক্যাল নিরীক্ষার জন্য অভিযোগ দায়ের করতে চান?',
        timestamp: '12:44 UTC'
      }
    ],
    rep_premio_hybrid: [
      {
        id: 'init_premio_1',
        sender: 'admin',
        senderName: lang === 'en' ? 'Senior Compliance Expert' : 'সিনিয়র কমপ্লায়েন্স কর্মকর্তা',
        text: lang === 'en'
          ? 'Hello. This JDM Premio has scored an impressive 94/100. Feel free to contact our administration desk with any questions or findings you notice.'
          : 'আসসালামু আলাইকুম। এই জেডিএম প্রিমিও-টি ৯৪/১০০ স্কোর পেয়েছে। আপনার কোনো বিষয় নিয়ে অভিযোগ বা সংশয় থাকলে এখানে আমাদের সাথে লাইভ মতামত শেয়ার করতে পারেন।',
        timestamp: '11:32 UTC'
      }
    ],
    rep_vezel_rs: [
      {
        id: 'init_vezel_1',
        sender: 'admin',
        senderName: lang === 'en' ? 'Warranty Underwriter' : 'ওয়ারেন্টি নিরীক্ষক',
        text: lang === 'en'
          ? 'Alert! A critical dual-clutch transmission leakage was logged for this Honda Vezel RS. We highly advise against buying from the current broker without fixing this. Do you want to submit pre-purchase dispute findings to their agency?'
          : 'সতর্কতা! এই হোন্ডা ভিজেলের ডুয়াল-ক্লাচ গিয়ারবক্স তরল লিক হচ্ছে। আপনি কি ব্রোকার বা ডিলারের কাছে অফিশিয়াল রিপোর্ট রি-ভেরিফিকেশন কপি পাঠাতে চান?',
        timestamp: '09:12 UTC'
      }
    ],
  });

  const handleSendDisputeMessage = (customText?: string) => {
    const textToSend = customText || newMessageText;
    if (!textToSend.trim()) return;

    const buyerMessageId = 'b_msg_' + Math.random().toString(36).substring(4);
    const newMsg = {
      id: buyerMessageId,
      sender: 'buyer' as const,
      senderName: lang === 'en' ? 'Asset Buyer' : 'ক্রেতা অ্যাকাউন্ট',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' }) + ' ' + (lang === 'en' ? 'Local' : 'স্থায়ী')
    };

    setDisputeMessages(prev => ({
      ...prev,
      [activeReportId]: [...(prev[activeReportId] || []), newMsg]
    }));

    if (!customText) {
      setNewMessageText('');
    }

    setTypingState(true);

    if (onPushLog) {
      onPushLog(
        'API_REQUEST',
        `POST /api/disputes/new-ticket?report_id=${activeReportId}`,
        `HEADERS:
  Authorization: Bearer jwt_buyer_3491
  Content-Type: application/json

BODY:
{
  "client_id": "usr_buyer_1204",
  "dispute_type": "REPORT_FINDINGS_INQUIRY",
  "comment_text": "${textToSend.replace(/"/g, '\\"')}",
  "timestamp": "${new Date().toISOString()}"
}`
      );
    }

    setTimeout(() => {
      setTypingState(false);
      const adminMessageId = 'a_msg_' + Math.random().toString(36).substring(4);
      
      let adminReplyText = '';
      if (activeReportId === 'rep_allion') {
        const replies = [
          lang === 'en'
            ? "Compliance Board has logged your concerns. We have flagged the odometer tamper logs in our centralized hub and notified the regional JDM registry. Double evaluation of the Allion's speedometer chips can be scheduled during garage overhaul."
            : "আমাদের কমপ্লায়েন্স বোর্ড অভিযোগটি নথিভুক্ত করেছে। আমরা ওডোমিটার কারচুপির প্রমাণ ডিস্ট্রিবিউটেড লগে মার্ক করে রেখেছি। মেকানিকের সাথে পুনরায় চেক করতে চাইলে ওয়ার্কশপ ভিজিট সিডিউল করুন।",
          lang === 'en'
            ? "Understood. The EEPROM counter's physical modification footprint is mathematically confirmed. We will draft an official inspection certified discrepancy letter for you to present to the seller."
            : "বুঝেছি। এই অলিয়নের মেমোরি রেজিস্টারে মাইল পরিবর্তনের ডিজিটাল স্বাক্ষর পাওয়া গিয়েছে। আমরা আপনার জন্য অডিটর স্বাক্ষরিত লিখিত বিরোধপত্র তৈরি করে দিচ্ছি।"
        ];
        adminReplyText = replies[Math.floor(Math.random() * replies.length)];
      } else if (activeReportId === 'rep_premio_hybrid') {
        const replies = [
          lang === 'en'
            ? "Your message on the Premio has been reviewed. Since the vehicle has an impressive 94% score, subframe alignment and battery internal cell balance are within perfect factory ranges. Should you require paint check details, let us know."
            : "প্রিমিওর ব্যাপারে আপনার বার্তা পর্যালোচনার মুখোমুখি। গাড়িটি কন্ডিশন ৯৪% ভালো হওয়ায় এটিতে কোনো মেকানিক্যাল ঝুঁকি নেই। তবুও আমরা ডিলারকে ফিডব্যাক পাঠাচ্ছি।",
          lang === 'en'
            ? "Thank you. Our dispatch files show the paint layer is consistent on the side rails (110 microns). No chassis welds were detected during structural laser scanning."
            : "ধন্যবাদ। আমাদের লেজার স্ক্যানে জানা গেছে সাইড রেইলসে পেইন্টের পরিমাণ পুরো চ্যাসিসে ১১০ মাইক্রন। এতে আপনার বিনিয়োগ সম্পূর্ণ নিরাপদ।"
        ];
        adminReplyText = replies[Math.floor(Math.random() * replies.length)];
      } else {
        const replies = [
          lang === 'en'
            ? "Warning acknowledged. Honda i-DCD dual clutch actuator issues typically trigger transmission lock-ups if left untreated. Admin desk has put a temporary hold tag on this vehicle serial inside the certified pool."
            : "সতর্কতা স্বীকার করা হয়েছে। হোন্ডার আই-ডিসিডি ক্লাচ লিক মেরামতের জন্য পার্টসের বিবরণ এবং সঠিক বাজেট ওয়ার্কশপ সেকশনে বুক করা আছে। এটি ছাড়া গাড়িটি নেওয়া ঝুঁকিপূর্ণ হবে।",
          lang === 'en'
            ? "Under evaluation. We suggest booking a detailed inspection double-check for the clutch actuator hydraulic pressure. Our engineers will follow up with the workshop technician."
            : "পর্যালোচনা করা হচ্ছে। গিয়ারবক্স অ্যাকচুয়েটরের প্রকৃত প্রেশার ড্রপ রেট মডিউল করতে আমরা ওয়ার্কশপের টেকনিশিয়ানদের সাথে যোগাযোগ শুরু করেছি।"
        ];
        adminReplyText = replies[Math.floor(Math.random() * replies.length)];
      }

      const adminMsg = {
        id: adminMessageId,
        sender: 'admin' as const,
        senderName: lang === 'en' ? 'Administrative Auditor' : 'অফিশিয়াল নিরীক্ষক',
        text: adminReplyText,
        timestamp: new Date().toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' }) + ' ' + (lang === 'en' ? 'Local' : 'স্থায়ী')
      };

      setDisputeMessages(prev => ({
        ...prev,
        [activeReportId]: [...(prev[activeReportId] || []), adminMsg]
      }));

      if (onPushLog) {
        onPushLog(
          'API_RESPONSE',
          `RECEIVE /api/disputes/ticket-update?report_id=${activeReportId}`,
          `STATUS: 200 OK
BODY:
{
  "ticket_id": "tkt_disp_${activeReportId.substring(4)}",
  "resolver_assigned": "admin_audit_mgr",
  "reply_hash": "${adminMessageId}",
  "message": "${adminReplyText.replace(/"/g, '\\"')}"
}`
        );
      }
    }, 1500);
  };

  // JDM Tariff Calculator states
  const [calcCC, setCalcCC] = useState<number>(1500); // 1000, 1500, 1800, 2000, 2500
  const [calcYear, setCalcYear] = useState<number>(2021); // 2019 to 2026
  const [calcIsHybrid, setCalcIsHybrid] = useState<boolean>(true);
  const [calcFobUSD, setCalcFobUSD] = useState<number>(14000);
  const [calcResult, setCalcResult] = useState<any>(null);

  // Workshop & Maintenance state
  const [selectedRepairs, setSelectedRepairs] = useState<string[]>(['abs_actuator']);
  const [preferredWorkshop, setPreferredWorkshop] = useState<string>('tejgaon_jdm');
  const [workshopBooked, setWorkshopBooked] = useState<boolean>(false);
  const [workshopDate, setWorkshopDate] = useState<string>('2026-06-05');

  // Heatmap and Trouble Areas state
  const [selectedZone, setSelectedZone] = useState<string>('engine');
  const [heatmapView, setHeatmapView] = useState<'propulsion' | 'bodywork'>('propulsion');

  // Multi-report mock configurations for buyers to browse different inspection outcomes
  const reportsData = [
    {
      id: 'rep_allion',
      title: 'Toyota Allion A15',
      plate: 'Dhaka Metro-GA-11-8521',
      owner: 'Shahnawaz Chowdhury',
      cc: '1500 cc (VVT-i)',
      year: 2017,
      score: 75,
      gradeCode: 'Score: 3.5 B (Fair Condition)',
      inspector: 'Imtiaz Hossain (ID: #7890)',
      stampDate: '2026-05-29',
      sealNo: 'SEAL #45921A',
      hash: 'MD5_84a92c3f8e50b',
      statusMsg: lang === 'en' ? 'Passable - Odometer Warned' : 'অনুমোদিত - ওডোমিটার সতর্কর্তা',
      tamperCheck: true,
      hybridSoh: null,
      issues: [
        { key: 'chassis', status: 'PASS', label: lang === 'en' ? 'Structure Welding Check' : 'চেসিস জোড়াতালি পরীক্ষা', desc: lang === 'en' ? 'Zero welding or collision cut seams detected. Side rails are perfectly straight.' : 'কোনো প্রকার জোড়াতালি বা ত্রুটি পাওয়া যায়নি। ফ্রেম পারফেক্ট আছে।' },
        { key: 'rust', status: 'WARNING', label: lang === 'en' ? 'Underbody Rust Assessment' : 'গাড়ির ব্যাকবোন জং চেক', desc: lang === 'en' ? 'Surface scale detected on silencer bolts. No mechanical structure decay.' : 'সাইলেন্সর বোল্ট সংলগ্ন স্থানে হালকা জং কিন্তু গুরুতর মেকানিক্যাল ক্ষতি নেই।' },
        { key: 'odometer', status: 'FAIL', label: lang === 'en' ? 'Odometer Tamper Trail' : 'ওডোমিটার জালিয়াতি ট্রেইল', desc: lang === 'en' ? 'OBD internal cluster counter logs 142,000 km while gauge displays 54,000 km. Heavy mileage rollback confirmed.' : 'অভ্যন্তরীণ মেমোরিতে রেকর্ড ১৪২,০০০ কিমি কিন্তু মিটারে মাত্র ৫৪,০০০ কিমি। ওডোমিটার রিডিংস কমানো হয়েছে!' },
        { key: 'abs', status: 'WARNING', label: lang === 'en' ? 'ABS Booster Actuator' : 'এবিএস ও ব্রেক বুস্টার অ্যাকচুয়েটর', desc: lang === 'en' ? 'Loud electrical buzzing when pedal is depressed. Common fault with Toyota Allions; actuator needs overhaul.' : 'প্যাডেল চাপলে মোটর থেকে শব্দ আসে। কিছুদিনের মাঝে রিপ্লেস করা লাগতে পারে।' }
      ],
      costs: {
        engine: 12000,
        brake: 25000,
        cluster: 5000,
        total: 42000
      }
    },
    {
      id: 'rep_premio_hybrid',
      title: 'Toyota Premio FEX Hybrid',
      plate: 'Dhaka Metro-HA-22-9430',
      owner: 'Salma Parveen Begum',
      cc: '1800 cc (Atkinson engine)',
      year: 2019,
      score: 94,
      gradeCode: 'Score: 4.5 A (Excellent Condition)',
      inspector: 'Kamrul Ahsan (ID: #4902)',
      stampDate: '2026-05-28',
      sealNo: 'SEAL #81206C',
      hash: 'SHA256_902f3a47ce01bb',
      statusMsg: lang === 'en' ? 'Exceptional JDM Unit - Recommended' : 'চমৎকার কন্ডিশন - ক্রয়ের জন্য উপযুক্ত',
      tamperCheck: false,
      hybridSoh: 88,
      issues: [
        { key: 'chassis', status: 'PASS', label: lang === 'en' ? 'Structure Integrity' : 'চেসিস কাঠামো', desc: lang === 'en' ? 'Completely untouched original factory JDM paint. 110 microns thickness over complete chassis framework.' : 'অরিজিনাল ফ্যাক্টরি পেইন্ট উপস্থিত আছে। পেইন্ট থিকনেস সর্বোচ্চ ১১০ মাইক্রন যা নিখুঁত।' },
        { key: 'rust', status: 'PASS', label: lang === 'en' ? 'Underbody Rust Check' : 'আন্ডারবডি জং পরীক্ষা', desc: lang === 'en' ? 'Dry underbody. No corrosion tracks found near the wheelhouse splash plates.' : 'সম্পূর্ণ জংমুক্ত চমৎকার ড্রাই তলদেশ।' },
        { key: 'hybrid', status: 'PASS', label: lang === 'en' ? 'Hybrid EV Intelligent Energy SoH' : 'হাইব্রিড ব্যাটারির স্বাস্থ্য পরীক্ষা', desc: lang === 'en' ? 'Battery pack is in premium condition. Internal resistance is 12mOhm per block. State of health verified at 88%.' : 'ব্যাটারি প্যাকের সামগ্রিক স্বাস্থ্য ৮৮%। ইন্টারনাল রেজিস্ট্যান্স ১২ মিলি-ওহম যা আদর্শ।' },
        { key: 'odometer', status: 'PASS', label: lang === 'en' ? 'Log Book Integration (Odometer)' : 'প্রকৃত ওডোমিটার পরীক্ষা', desc: lang === 'en' ? 'Odometer log reads 32,450 km. Verified with JDM central database export statistics.' : '৩২,৪৫০ কিমি ওডোমিটার রিডিং সম্পূর্ণরূপে বাস্তব এবং অথেনটিক।' }
      ],
      costs: {
        engine: 3000,
        brake: 0,
        cluster: 0,
        total: 3000
      }
    },
    {
      id: 'rep_vezel_rs',
      title: 'Honda Vezel RS Hybrid',
      plate: 'Chatto Metro-GH-15-4012',
      owner: 'Zahin Sadequzzaman',
      cc: '1500 cc (i-DCD Dual Clutch)',
      year: 2018,
      score: 68,
      gradeCode: 'Score: 3.0 C (Moderate - Caution Required)',
      inspector: 'Ziaul Hoque (ID: #8230)',
      stampDate: '2026-05-27',
      sealNo: 'SEAL #14801X',
      hash: 'MD5_011d4d38e21aa8',
      statusMsg: lang === 'en' ? 'Critical Dual-Clutch Actuator Play Identified' : 'দ্বৈত ক্লাচ অ্যাকচুয়েটর লিকেজ চিহ্নিত',
      tamperCheck: false,
      hybridSoh: 62,
      issues: [
        { key: 'chassis', status: 'PASS', label: lang === 'en' ? 'Structural Welds' : 'গঠনগত জোড়াতালি পরীক্ষা', desc: lang === 'en' ? 'No damage found to radiator guides or core-support panels. Pure chassis framework.' : 'প্যানেলের চ্যাসিস ফ্রেম ও রেডিয়েটর মাউন্টিং অক্ষত আছে।' },
        { key: 'clutch', status: 'FAIL', label: lang === 'en' ? 'Honda i-DCD Dual Clutch Actuation' : 'আই-ডিসডি ডুয়াল ক্লাচ পারফরমেন্স', desc: lang === 'en' ? 'Severe actuator fluid leakage. Rough transitions between octane engine and hybrid-electric generator. Repair critical!' : 'ডুয়াল ক্লাচ অ্যাকচুয়েটর তরল ফুটো হচ্ছে। দ্রুত সংস্কার প্রয়োজন নতুবা গিয়ারবক্স লক হতে পারে।' },
        { key: 'hybrid', status: 'WARNING', label: lang === 'en' ? 'Lithium Battery Pack Health' : 'ব্যাটারি প্যাক ভোল্টেজ', desc: lang === 'en' ? 'Block 3 cell degradation detected. Average State of health is 62%. Block replace recommended soon.' : 'ব্লক ৩ সেল ক্ষয় পাওয়া গিয়েছে। সার্বিক স্বাস্থ্য ৬২%।' },
        { key: 'brake', status: 'PASS', label: lang === 'en' ? 'Braking Response' : 'ব্রেকিং রেসপন্স', desc: lang === 'en' ? 'E-booster output within acceptable threshold.' : 'ই-ব্রেক অ্যাকচুয়েটর রেসপন্স সঠিক মাত্রায় বজায় আছে।' }
      ],
      costs: {
        engine: 45000,
        brake: 5000,
        cluster: 0,
        total: 50000
      }
    }
  ];

  const activeReport = reportsData.find(r => r.id === activeReportId) || reportsData[0];

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber) {
      alert(lang === 'en' ? 'Plate or Chassis number is mandatory.' : 'নম্বর প্লেট বা চ্যাসিস নম্বর অবশ্যই প্রদান করুন।');
      return;
    }

    const calculatedId = 'gig_' + Math.random().toString(36).substring(4);
    
    // Core callback
    onBookInspection({
      assetType: 'CAR',
      vehicleModel: selectedModel,
      plateNumber,
      locationText: selectedLocation,
      notes,
      method: 'WALLET_TX',
      txId: txId || 'TXN-' + Math.floor(Math.random() * 900000 + 100000),
      walletNo: walletNo || '018XXXXXXXX'
    });

    setSuccessMsg(true);
    setPlateNumber('');
    setNotes('');
    setWalletNo('');
    setTxId('');
    setTimeout(() => setSuccessMsg(false), 5500);

    // Push secure DevConsole Logs
    if (onPushLog) {
      onPushLog(
        'API_REQUEST',
        'POST /api/contracts/book-verification (Idempotent Booking)',
        `HEADERS:
  Authorization: Bearer jwt_buyer_3491
  X-Request-Id: req_idemp_${calculatedId}

BODY:
{
  "client_id": "usr_buyer_1204",
  "vehicle_class": "RECON_JDM_CAR",
  "model_tag": "${selectedModel}",
  "plate_number": "${plateNumber}",
  "inspection_loc": "${selectedLocation}",
  "bKash_sender": "${walletNo || '01712345678'}",
  "bKash_txid": "${txId || 'TXN-AUTO-9428'}",
  "deposit_bdt": 500.00
}`
      );

      onPushLog(
        'SQL_STATEMENT',
        'Postgres Database INSERT - Allocate Pre-purchase Escrow & Gig Contract',
        `BEGIN;

-- Check for existing non-completed gigs with same Plate to prevent race conditions
SELECT id, status FROM pre_purchase_gigs 
WHERE plate_number = '${plateNumber}' AND status != 'COMPLETED' FOR UPDATE;

-- Insert the verified contract record
INSERT INTO pre_purchase_gigs (
  id, client_id, model_tag, plate_number, preferred_location, notes, status, escrow_locked_bdt, created_at
) VALUES (
  '${calculatedId}', 'usr_buyer_1204', '${selectedModel}', '${plateNumber}', '${selectedLocation}', '${notes}', 'POSTED', 500.00, NOW()
);

-- Register initial ledger credit trace
INSERT INTO billing_ledger_entries (id, account_id, amount_bdt, tx_reference, ledger_action)
VALUES ('ledg_${calculatedId}', 'usr_buyer_1204', -500.00, '${txId || 'TXN-AUTO-9428'}', 'ESCROW_HOLD_SAFETY_FEE');

COMMIT;`
      );
    }
  };

  // Live JDM Tariff & tax structures calculator formula for Bangladesh
  const calculateJDMDuty = () => {
    let CCFactor = 0.3; // Supplement duty tier
    if (calcCC <= 1000) CCFactor = 0.30;
    else if (calcCC <= 1500) CCFactor = 0.60;
    else if (calcCC <= 1600) CCFactor = 1.00;
    else if (calcCC <= 1800) CCFactor = 1.50;
    else if (calcCC <= 2000) CCFactor = 2.00;
    else CCFactor = 3.50; // High supplement duty

    // Hybrid discount: Bangladesh government offers reducedSupplementary Duty (SD) for Hybrid imports!
    let supplementDutyDiscount = calcIsHybrid ? 0.20 : 0.0;
    let rawSD = CCFactor - (CCFactor * supplementDutyDiscount);
    if (rawSD < 0.15) rawSD = 0.15;

    // Depreciation rates based on JDM age (Max limit 5 years older allowed for import in Bangladesh)
    let depreciationRate = 0;
    const vehicleAge = 2026 - calcYear;
    if (vehicleAge <= 0) depreciationRate = 0.0;
    else if (vehicleAge === 1) depreciationRate = 0.10;
    else if (vehicleAge === 2) depreciationRate = 0.20;
    else if (vehicleAge === 3) depreciationRate = 0.25;
    else if (vehicleAge === 4) depreciationRate = 0.30;
    else depreciationRate = 0.35; // Maximum depreciation threshold

    const exchangeRateYen = 120; // Simulated values
    const assessableValueBDT = calcFobUSD * 123 * (1 - depreciationRate);

    // Bangladesh Customs Multi-layered Tax Pipeline formula:
    // 1. CD (Customs Duty) = 25% of Assessable Value
    const customsDuty = assessableValueBDT * 0.25;
    // 2. SD (Supplementary Duty) = SD_RATE * (Assessable Value + CD)
    const supplementationDuty = rawSD * (assessableValueBDT + customsDuty);
    // 3. VAT (Value Added Tax) = 15% * (Assessable Value + CD + SD)
    const valueAddedTax = 0.15 * (assessableValueBDT + customsDuty + supplementationDuty);
    // 4. AIT (Advance Income Tax) = 5% of Assessable value
    const aitTax = assessableValueBDT * 0.05;
    // 5. RD (Regulatory Duty) = 3% of Assessable Value
    const regulatoryDuty = assessableValueBDT * 0.03;
    // 6. ATV (Advance Trade VAT) = 5% * (Assessable Value + CD + SD + VAT)
    const advanceTradeVat = 0.05 * (assessableValueBDT + customsDuty + supplementationDuty + valueAddedTax);

    const totalDuties = customsDuty + supplementationDuty + valueAddedTax + aitTax + regulatoryDuty + advanceTradeVat;
    const portFees = 38000; // Average Chittagong/Mongla terminal handling charge
    const shippingHoldEstimate = 120000; // Yard space & local broker commission

    const grandTotalCartValue = assessableValueBDT + totalDuties + portFees + shippingHoldEstimate;

    const result = {
      assessable: Math.round(assessableValueBDT),
      depreciation: Math.round(depreciationRate * 100),
      cd: Math.round(customsDuty),
      sd: Math.round(supplementationDuty),
      sdPercentage: Math.round(rawSD * 100),
      vat: Math.round(valueAddedTax),
      ait: Math.round(aitTax),
      rd: Math.round(regulatoryDuty),
      atv: Math.round(advanceTradeVat),
      totalTax: Math.round(totalDuties),
      logistics: portFees + shippingHoldEstimate,
      grandTotal: Math.round(grandTotalCartValue)
    };

    setCalcResult(result);

    if (onPushLog) {
      onPushLog(
        'HEX_PORT',
        'Trigger Bangladesh Customs Tariff Model Estimation Engine',
        `// Dynamic calculation in Rust/Axum pipeline:
let mut tariff_params = CustomsTariffCalculator::new();
tariff_params.engine_cc(${calcCC});
tariff_params.fob_usd(${calcFobUSD});
tariff_params.year_of_manufacture(${calcYear});
tariff_params.is_hybrid_propulsion(${calcIsHybrid});

let estimation = tariff_params.evaluate_bdt_customs_valuation().await?;
log::info!("Assessed BDT Import Customs: ৳{}", estimation.total_duties_bdt);`
      );
    }
  };

  const selectedRepairsSum = selectedRepairs.reduce((acc, curr) => {
    if (curr === 'abs_actuator') return acc + 45000;
    if (curr === 'hybrid_battery') return acc + 28000;
    if (curr === 'suspension') return acc + 18000;
    if (curr === 'odometer_eprom') return acc + 8000;
    if (curr === 'cvt_fluid') return acc + 11000;
    return acc;
  }, 0);

  const handleMaintenanceBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setWorkshopBooked(true);
    setTimeout(() => {
      setWorkshopBooked(false);
    }, 6000);

    if (onPushLog) {
      onPushLog(
        'API_REQUEST',
        'POST /buyer/maintenance/book-slot (Authorized Workshop Work Order)',
        `HEADERS:
  Authorization: Bearer jwt_buyer_3491
  Content-Type: application/json

BODY:
{
  "client_id": "usr_buyer_1204",
  "workshop_handle": "${preferredWorkshop}",
  "scheduled_repair_date": "${workshopDate}",
  "selected_items": ${JSON.stringify(selectedRepairs)},
  "estimated_parts_total_bdt": ${selectedRepairsSum}.00
}`
      );

      onPushLog(
        'SQL_STATEMENT',
        'INSERT INTO workshop_work_orders & Dispatch Job Event',
        `INSERT INTO workshop_work_orders (
  id, client_id, selected_workshop, scheduled_date, repair_items_json, estimated_cost, status
) VALUES (
  'ord_${Math.random().toString(36).substring(4)}', 'usr_buyer_1204', '${preferredWorkshop}', '${workshopDate}', '${JSON.stringify(selectedRepairs)}', ${selectedRepairsSum}.00, 'SCHEDULED'
);`
      );
    }
  };

  const toggleRepair = (key: string) => {
    setSelectedRepairs(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // Resolve specific vehicle diagnostic zone attributes dynamically based on activeReport
  const getZoneHealth = (zoneKey: string) => {
    let status: 'PASS' | 'WARNING' | 'FAIL' | 'N/A' = 'PASS';
    let labelEN = '';
    let labelBN = '';
    let descEN = '';
    let descBN = '';
    let subitems: string[] = [];

    if (zoneKey === 'engine') {
      if (activeReport.id === 'rep_allion') {
        status = 'PASS';
        labelEN = 'Engine Block & Combustion Powertrain';
        labelBN = 'ইঞ্জিন ব্লক ও শক্তির সঞ্চালন';
        descEN = 'Pristine 1.5L VVT-i dual octane block. Clean fuel delivery. Computer diagnostics confirm zero cylinder misfire logs or camshaft timing errors.';
        descBN = '১.৫ লিটার ভিভিটি-আই পেট্রল ইঞ্জিনটি সম্পূর্ণরূপে অক্ষত। কোনো প্রকার মিসফায়ার বা কম্পন লিম্প লগে চিহ্নিত প্রমানিত হয়নি।';
        subitems = ['Compression ratio: 14.1 Bar', 'Throttle response: 45ms peak', 'Catalytic converter state: 96% OK', 'Engine oil soot concentration: Low'];
      } else if (activeReport.id === 'rep_premio_hybrid') {
        status = 'PASS';
        labelEN = 'Engine & Atkinson Hybrid Powertrain';
        labelBN = 'হাইব্রিড অ্যাটকিনসন ইঞ্জিন';
        descEN = 'Excellent combustion efficiency. Electric motor integration runs with absolute synchronization. Fuel trim values standard (+1.4%).';
        descBN = 'অ্যাটকিনসন সাইকেল ইঞ্জিনটির দহন ক্ষমতা অসাধারণ। বৈদ্যুতিক ও ফুয়েল মোটরের অটো-ট্রানজিশন সম্পূর্ণ ত্রুটিহীন উপায়ে সম্পন্ন হচ্ছে।';
        subitems = ['Atkinson compression: 14.5 Bar', 'Sync engagement latch: Instant', 'E-CVT planetary gears mesh: Perfect', 'Carbon build-up indices: Normal'];
      } else { // rep_vezel_rs
        status = 'FAIL';
        labelEN = 'i-DCD Dual-Clutch Gearbox';
        labelBN = 'আই-ডিসডি দ্বৈত ক্লাচ গিয়ারবক্স';
        descEN = 'Critical dual-clutch actuator fluid leakage detected. Transitions between battery generator and engine are accompanied by heavy gear slip!';
        descBN = 'গুরুতর ডুয়াল ক্লাচ অ্যাকচুয়েটর তরল ফুটো পাওয়া গিয়েছে। ইভি মোটরের সাথে ইঞ্জিন রিলে করার সময় গিয়ার স্লিপিং ও ঝাঁকুনি অনুভূত হচ্ছে।';
        subitems = ['Clutch-1 friction plate wear: 82% (Critical)', 'Actuator hydraulic leakage: PRESENT', 'Octane-HEV slip margin: 4.8% (Fail)', 'Gear lube temperature: 94°C (High)'];
      }
    } 
    else if (zoneKey === 'brake') {
      if (activeReport.id === 'rep_allion') {
        status = 'WARNING';
        labelEN = 'ABS Master Booster Cylinder';
        labelBN = 'এবিএস ও ব্রেকিং বুস্টার সিলিন্ডার';
        descEN = 'Loud high-frequency electromagnetic buzz when pedal is depressed. Common Toyota actuator wear symptom. Replacement recommended soon to avoid hard pedal.';
        descBN = 'ব্রেক প্যাডেল চাপলে ইসিউ এর ব্রেক বুস্টার থেকে অস্বাভাবিক কম্পন ও ভোঁ ভোঁ শব্দ আসে। যেকোনো সময় এটি ফেল করতে পারে। পরিবর্তন আবশ্যক।';
        subitems = ['Booster pump power surge: Registered', 'Pedal hydraulic stiffness: Normal', 'ABS master valve leakage: Surface weeping', 'Emergency braking deceleration: Passable'];
      } else if (activeReport.id === 'rep_premio_hybrid') {
        status = 'PASS';
        labelEN = 'Intelligent E-Braking & ABS';
        labelBN = 'বুদ্ধিমান এবিএস ব্রেক মোটর';
        descEN = 'Advanced regenerative braking calibrated correctly. High energy kinetic recapture rate. Pad wear sits at a healthy 80% remaining life.';
        descBN = 'রিজেনারেটিভ ব্রেকিং মেকানিজম শতভাগ নিখুঁত। থামা অবস্থার ঠিক পূর্বমুহূর্তে ব্র্যাকিং রিকভারি সঠিক আছে। কোনো প্রকার ব্রেক ফ্লুইড ক্ষয় নেই।';
        subitems = ['PAD wear remaining: 80% span', 'Regenerative charger sync: optimal', 'Pressure threshold delta: 0.05 Bar', 'Brake moisture reading: 1.2% (Dry)'];
      } else { // rep_vezel_rs
        status = 'PASS';
        labelEN = 'Brake Assistance & Pad Life';
        labelBN = 'ব্রেকিং সিস্টেম ও ক্যালিবার প্যাড';
        descEN = 'Electronic brake actuation parameters are within NBR road safety guidelines. Caliper plates are clean and flat with zero score lines.';
        descBN = 'ইলেকট্রনিক ব্রেক অ্যাকচুয়েশন রেসপন্স চমৎকার এবং সঠিক প্রেশার বজায় রাখছে। ব্রেক প্যাড স্লাইড চাকার সাথে নিখুঁত স্পর্শে রয়েছে।';
        subitems = ['Rotors flat wear index: Perfect', 'Deceleration index: 9.8 m/s²', 'Fluid boiling indicator: 240°C', 'ABS ECU connectivity: ACTIVE'];
      }
    }
    else if (zoneKey === 'chassis') {
      status = 'PASS';
      labelEN = 'Subframe Structure & Welds';
      labelBN = 'চ্যাসিস কাঠামো ও জোড়াতালি';
      descEN = 'Chassis geometric frame checked via high-energy laser rangefinders. 100% factory original structural alignment. Completely original factory paint (98-112 microns).';
      descBN = 'দ্বৈত লেজার মিটার দিয়ে চ্যাসিসের অক্ষ পরিমাপ করা হয়েছে। চ্যাসিসের কোথাও কোনো কাটা-ছেঁড়া, গ্যাস ঢালাই বা দুর্ঘটনাজনিত জোড়াতালি নেই।';
      subitems = ['Chassis rails deviation: 0.0mm', 'Frame tensile stress status: Pristine', 'Bumper core mounts: Factory original', 'Paint layer uniform thickness: 110 microns'];
    }
    else if (zoneKey === 'odometer') {
      if (activeReport.id === 'rep_allion') {
        status = 'FAIL';
        labelEN = 'Odometer Clocks & OBD Memory';
        labelBN = 'ওডোমিটার রিডিং ও সফটওয়্যার জালিয়াতি';
        descEN = 'Odometer Mileage Rolled Back! Gauge displays 54,000 km while interior backup microcontroller registers highlight 142,000 km.';
        descBN = 'ওডোমিটারে মাইল মিটারে জاليةতি করা হয়েছে! মিটার রিডিং ৫৪,০০০ কিমি শো করলেও গাড়ির অভ্যন্তরীণ ইসিইউ লগে আসল রিডিং ১৪২,০০০ কিমি পাওয়া গিয়েছে।';
        subitems = ['ECU EEPROM backup tally: 142,000 km', 'Instrument cluster tally: 54,000 km', 'Flash counter timestamp: MODIFIED', 'Tamper protection byte: COMPROMISED'];
      } else if (activeReport.id === 'rep_premio_hybrid') {
        status = 'PASS';
        labelEN = 'EPROM Authentic Log Integrity';
        labelBN = 'অথেনটিক ওডোমিটার লিনিয়র লগ';
        descEN = 'Odometer display of 32,450 km verified as 100% genuine. Cross-corresponds perfectly with both Japan Auction export stats and internal cluster logs.';
        descBN = 'ওডোমিটারে কোনো প্রকার মডিফিকেশন বা অসততা করা হয়নি। অভ্যন্তরীন মেমোরি রেকর্ড এবং জাপানের নিলাম হাউজের ডাটা সামঞ্জস্যপূর্ণ।';
        subitems = ['Japan export records: 32,450 km', 'EEPROM internal register: 32,451 km', 'Write transaction log: Sealed', 'Gauge speedometer offset: 0.0%'];
      } else { // rep_vezel_rs
        status = 'PASS';
        labelEN = 'Cluster Telemetry Verification';
        labelBN = 'ককপিট ইলেকট্রনিক্স ও ওডোমিটার';
        descEN = 'Actual vehicle usage logged at 48,930 km. All security bytes intact in high-density memory registers. No anomalies registered in OBD-II audits.';
        descBN = 'ওডোমিটার ও ইসিইউ রেকর্ড ৪৮,৯৩০ কিমি তে নিখুঁতভাবে লক আছে। ইন্টারনাল লকস বা সফটওয়্যার কাউন্ট পরিবর্তনের কোনো প্রমাণ লক্ষ্যনীয় নয়।';
        subitems = ['Actual driven tally: 48,930 km', 'Software write count: 2 (Factory)', 'OBD diagnostic scan: Pristine', 'CAN bus handshake test: Authenticated'];
      }
    }
    else if (zoneKey === 'hybrid') {
      if (activeReport.id === 'rep_allion') {
        status = 'N/A';
        labelEN = 'EV Hybrid Electric Battery';
        labelBN = 'হাইব্রিড ব্যাটারি মডিউল';
        descEN = 'Standard gasoline unit fuel delivery block. No high-voltage EV battery cells or intelligent inverter modules installed in this chassis.';
        descBN = 'এই গাড়িটি সাধারণ জ্বালানি তেলচালিত মডেল। এতে উচ্চ-ভোল্টেজ সম্পন্ন বৈদ্যুতিক লিথিয়াম ব্যাটারি বা হাইব্রিড ইনভার্টার প্যাক নেই।';
        subitems = ['Battery cell pack state: NOT PRESENT', 'High-voltage inverter system: NONE', 'Hybrid cooling fan block: N/A', 'Energy recapture cells: N/A'];
      } else if (activeReport.id === 'rep_premio_hybrid') {
        status = 'PASS';
        labelEN = 'Hybrid EV Power Pack SOH';
        labelBN = 'হাইব্রিড ব্যাটারির সামগ্রিক স্বাস্থ্য';
        descEN = 'Prismatic Ni-MH modules state-of-health represents excellent durability at 88%. Uniform voltage profiles across all 28 sub-blocks.';
        descBN = 'হাইব্রিড ব্যাটারির সার্বিক হেলথ লেভেল ৮৮%। প্রতিটি মডিউলে ভোল্টেজ ব্যালেন্স চমৎকার রয়েছে (১৪.৪ ভোল্ট)। ইনভার্টার কুলিং সিস্টেম সম্পূর্ণ পরিষ্কার।';
        subitems = ['Average state-of-health (SoH): 88%', 'Internal cell resistance: 12.1mOhm', 'Maximum charging capacity: 6.4 Ah', 'Delta block voltage deviation: 0.02V'];
      } else { // rep_vezel_rs
        status = 'WARNING';
        labelEN = 'Lithium Battery Cells Degradation';
        labelBN = 'লিথিয়াম ব্যাটারি সেল ক্ষয়';
        descEN = 'Block 3 cell degradation noted. Current state of health is 62%. Battery runs hotter than average under regenerative load. Module balancing required soon.';
        descBN = '৩ নং ব্লক সেলের ভোল্টেজ ফ্ল্যাকচুয়েশন রয়েছে। মোট হেলথ লেভেল ৬২%। প্যাসেঞ্জার কেবিন কুলিং ফ্যানে ময়লা পড়ার কারণে ব্যাটারি তাপমাত্রা একটু বেশি।';
        subitems = ['Average state-of-health (SoH): 62%', 'Internal cell resistance: 28.5mOhm', 'Pack temperature peak: 48°C (Warning)', 'Delta block voltage deviation: 0.28V'];
      }
    }
    else { // rust / suspension
      if (activeReport.id === 'rep_allion') {
        status = 'WARNING';
        labelEN = 'Underbody Surface Corrosion';
        labelBN = 'তলদেশের জং ও নাট-বল্টুর অবস্থা';
        descEN = 'Surface scale deposits confirmed on exhaust silencer joints and minor floor points. No structural integrity failure. Rust treatment advised next oil change.';
        descBN = 'সাইলেন্সরের জয়েন্টগুলোতে এবং আন্ডারবডির কিছু সাধারণ স্থানে হালকা মরিচা দেখা গিয়েছে। তবে এটি মেকানিক্যাল দিক থেকে হুমকিস্বরূপ নয়।';
        subitems = ['Frame rust scale coverage: 8% area', 'Rear spring coil tension: Standard', 'Suface protective wax layer: Degraded', 'Under-floor weld joints: Dry & Secure'];
      } else if (activeReport.id === 'rep_premio_hybrid') {
        status = 'PASS';
        labelEN = 'Underbody Anti-Corrosion Check';
        labelBN = 'তলদেশের শুষ্কতা ও ক্যাভিটি প্রটেকশন';
        descEN = 'Completely dry, original underbody finish with premium factory protective coating. Suspension arm ball-joints remain tight and highly responsive.';
        descBN = 'তলদেশে কোনো প্রকার মরিচা বা ফাটল নেই। ফ্রন্ট আর্ম জয়েন্ট, স্ট্যাবিলাইজার লিংক এবং পেছনের শক-অ্যাবজরবার সম্পূর্ণরূপে শুষ্ক ও লিকমুক্ত।';
        subitems = ['Corrosion damage coverage: 0% AREA', 'Suspension damper fluid leaks: ZERO', 'Lower control arm bushes: Pristine', 'Stabilizer links play deflection: None'];
      } else { // rep_vezel_rs
        status = 'PASS';
        labelEN = 'Suspension Dampers & Steering Play';
        labelBN = 'সাসপেনশন ড্যাম্পার ও স্টিয়ারিং বুশ';
        descEN = 'Rear oil dampers are completely sealed. Steering gear response metrics are fast and tight, showing no standard rack-gear rattle on bumpy tracks.';
        descBN = 'শক অ্যাবজরবার লিক প্রতিরোধী এবং ড্যাম্পিং ক্ষমতা অক্ষুণ্ন আছে। স্টিয়ারিং র্যাকের কোনো কম্পন বা অতিরিক্ত খেল নেই যা উচু-নিচু রাস্তায় আরামদায়ক হবে।';
        subitems = ['Oil shock dampers leakage: NONE', 'Steering gear backlash check: Pass', 'Floor-pan structural spots: Sound', 'Bumper lower splash shielding: Fixed'];
      }
    }

    return { status, label: lang === 'en' ? labelEN : labelBN, desc: lang === 'en' ? descEN : descBN, subitems };
  };

  return (
    <div className="bg-[#fbfbfb] text-[#1a1a1a] min-h-screen py-10 antialiased font-serif">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Buyer Header Banner */}
        <div className="bg-white p-8 border border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="inline-block bg-black text-white text-[9px] uppercase tracking-[0.2em] font-sans font-bold px-3 py-1">
              Buyer Portal Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-light text-slate-900 font-serif mt-2">
              {lang === 'en' ? 'JDM Buyer Security Hub' : 'গাড়ি ক্রেতা নিরাপত্তা কমান্ড সেন্টার'}
            </h1>
            <p className="text-xs text-gray-500 font-serif italic">
              {lang === 'en' 
                ? 'Shield your investment using real-time mechanical diagnostic checklists and customs tariff audits.' 
                : 'মেকানিক্যাল ডায়াগনস্টিক চেকলিস্ট এবং শুল্ক অডিটের মাধ্যমে নিশ্চিন্তে স্বপ্নের গাড়িটি কিনুন।'}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[#fbfbfb] p-3 border border-black/10 text-xs">
            <span className="font-sans font-bold uppercase tracking-wider text-gray-400 text-[10px]">Verified Currency:</span>
            <span className="bg-white text-slate-900 text-[10px] font-mono font-bold px-3 py-1 border border-black/10">
              BDT - Bangladesh Taka (৳)
            </span>
          </div>
        </div>

        {/* Tab Subtab Navigation bar - Editorial Minimalist Style */}
        <div className="border-b border-black/10 overflow-x-auto">
          <div className="flex space-x-8 sm:space-x-12 text-xs font-sans font-bold uppercase tracking-widest min-w-[550px] mb-[-1px]">
            <button
              onClick={() => setSubTab('booking')}
              className={`pb-4 border-b-2 transition duration-200 cursor-pointer ${subTab === 'booking' ? 'border-black text-[11px] text-black font-extrabold' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              📋 {lang === 'en' ? 'Book Inspection' : 'ইন্সপেকশন বুকিং ও কিউ'}
            </button>
            <button
              onClick={() => setSubTab('reports')}
              className={`pb-4 border-b-2 transition duration-200 cursor-pointer ${subTab === 'reports' ? 'border-black text-[11px] text-black font-extrabold' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              📄 {lang === 'en' ? 'Diagnostic Report Sheets' : 'ডিজিটাল ফিটনেস রিপোর্ট শীট'}
            </button>
            <button
              onClick={() => setSubTab('tariff')}
              className={`pb-4 border-b-2 transition duration-200 cursor-pointer ${subTab === 'tariff' ? 'border-black text-[11px] text-black font-extrabold' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              🧮 {lang === 'en' ? 'Customs Tariff & Duty Meter' : 'জেডিএম শুল্ক ও কর ক্যালকুলেটর'}
            </button>
            <button
              onClick={() => setSubTab('maintenance')}
              className={`pb-4 border-b-2 transition duration-200 cursor-pointer ${subTab === 'maintenance' ? 'border-black text-[11px] text-black font-extrabold' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              🛠️ {lang === 'en' ? 'Accredited Workshops' : 'অনুমোদিত ওয়ার্কশপ সংস্কার'}
            </button>
          </div>
        </div>

        {/* --- PAGE CONTENTS SUB-SWITCHERS --- */}

        {/* TABS 1: BOOKING & DISPATCH QUEUE */}
        {subTab === 'booking' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form booking */}
            <div className="lg:col-span-5 bg-white p-8 border border-black/10 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-black/10">
                <ClipboardCheck className="h-4 w-4 text-black" />
                <h3 className="font-sans font-bold uppercase tracking-widest text-xs text-slate-950">{text.vehicleDetails}</h3>
              </div>

              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs p-5 flex items-start gap-3 font-serif">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold font-sans uppercase tracking-wider text-[10px] block text-emerald-950 mb-1">CONTRACT ACTIVE</span>
                    <p className="text-xs text-emerald-800 leading-relaxed font-serif">
                      {lang === 'en' 
                        ? 'Idempotent request initialized under PostgreSQL ACID locks. Certified mechanics nearby have received central dispatch signals.'
                        : 'পোস্টগ্রিএসকিউএল ট্রানজেকশন সফলভাবে সম্পন্ন হয়েছে। নিকটবর্তী মেকানিকগণ সরাসরি লাইভ সিগন্যাল পেয়েছেন।'}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleCreateBooking} className="space-y-5">
                {/* Vehicle Select */}
                <div className="space-y-1">
                  <label className="block text-gray-400 text-[9px] font-sans font-bold uppercase tracking-widest leading-none">
                    {text.selectBrand}
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-[#fbfbfb] text-slate-900 border border-black/10 rounded-none px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-black font-sans font-semibold cursor-pointer"
                  >
                    {POPULAR_VEHICLES.map((vehicle) => (
                      <option key={vehicle.id} value={`${vehicle.brand} ${vehicle.model}`}>
                        {vehicle.image} {vehicle.brand} {vehicle.model} ({vehicle.year})
                      </option>
                    ))}
                    <option value="Toyota Premio FEX Hybrid">🚗 Custom Toyota Premio FEX Hybrid (2019)</option>
                    <option value="Honda Vezel RS Octane">SUV Honda Vezel RS Octane SUV (2018)</option>
                    <option value="Toyota CH-R EV Hybrid">🚙 Custom crossover reconditioned JDM Hybrid</option>
                  </select>
                </div>

                {/* Number/Chassis Plate */}
                <div className="space-y-1">
                  <label className="block text-gray-400 text-[9px] font-sans font-bold uppercase tracking-widest leading-none">
                    {text.plateNumber} *
                  </label>
                  <input
                    type="text"
                    required
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder={text.platePlaceholder}
                    className="w-full bg-[#fbfbfb] text-slate-900 border border-black/10 rounded-none px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-black font-mono font-bold uppercase tracking-wider"
                  />
                </div>

                {/* Location List */}
                <div className="space-y-1">
                  <label className="block text-gray-400 text-[9px] font-sans font-bold uppercase tracking-widest leading-none">
                    {text.selectLocation}
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full bg-[#fbfbfb] text-slate-900 border border-black/10 rounded-none px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-black font-sans font-semibold cursor-pointer"
                  >
                    {BANGLADESH_REGIONS.map((region) => (
                      <option key={region} value={region}>
                        📍 {region}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="block text-gray-400 text-[9px] font-sans font-bold uppercase tracking-widest leading-none">
                    {text.notes}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Baridhara block J, showroom name, contact broker: 01712..."
                    rows={2}
                    className="w-full bg-[#fbfbfb] text-slate-900 border border-black/10 rounded-none px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-black font-serif"
                  />
                </div>

                {/* bKash Payment */}
                <div className="bg-[#fbfbfb] p-5 border border-black/10 space-y-4">
                  <div className="flex items-center gap-2 font-sans font-bold text-slate-950 text-[9px] uppercase tracking-widest border-b border-black/5 pb-2">
                    <CreditCard className="h-4 w-4 text-black" />
                    <span>{text.paymentGateway}</span>
                  </div>
                  <p className="text-gray-500 text-[11px] leading-relaxed font-serif italic">
                    {text.paymentDesc}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-[8px] font-sans font-bold uppercase tracking-widest mb-1">
                        {text.mockTxInput}
                      </label>
                      <input
                        type="text"
                        value={walletNo}
                        onChange={(e) => setWalletNo(e.target.value)}
                        placeholder={text.mockTxplaceholder}
                        className="w-full bg-white text-slate-900 border border-black/5 rounded-none px-3 py-2 text-xs focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-[8px] font-sans font-bold uppercase tracking-widest mb-1">
                        bKash TxID *
                      </label>
                      <input
                        type="text"
                        value={txId}
                        onChange={(e) => setTxId(e.target.value)}
                        placeholder="BK_TXN_98754"
                        className="w-full bg-white text-slate-900 border border-black/5 rounded-none px-3 py-2 text-xs focus:outline-none font-mono text-black font-bold"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center border border-black bg-black text-white text-xs font-sans font-bold uppercase tracking-[0.2em] py-4 hover:bg-white hover:text-black transition cursor-pointer"
                >
                  {text.bookSubmit}
                </button>
              </form>
            </div>

            {/* Right Column: Dynamic Job Tracking Feed */}
            <div className="lg:col-span-7 bg-white p-8 border border-black/10 space-y-6">
              <div className="flex justify-between items-center border-b border-black/10 pb-4">
                <div>
                  <h3 className="font-sans font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5" />
                    <span>Live Verification Thread</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 font-serif italic mt-0.5">Real-time status tracking of pre-purchase inspection tasks</p>
                </div>
                <span className="text-[10px] bg-[#fbfbfb] px-3 py-1.5 border border-black/10 font-mono font-bold">Postgres-Queue: active</span>
              </div>

              {/* Seed status item */}
              <div className="p-5 border border-black text-xs font-serif space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">Toyota Allion A15</h4>
                    <p className="text-gray-400 font-mono text-[10px] mt-0.5">Plate: Dhaka Metro-GA-11-8521 • Location: Dhaka - Banani</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-1.5 border border-emerald-200">
                    {lang === 'en' ? 'QC Approved' : 'রিভিউ সম্পন্ন'}
                  </span>
                </div>
                
                <div className="p-4 bg-[#fbfbfb] border-l-2 border-l-emerald-600 font-mono text-[11px] leading-relaxed text-gray-600 space-y-1">
                  <p>• Dispatch Ticket ID: #tsk_942851a</p>
                  <p>• Inspection Status: COMPLETED & SANITIZED</p>
                  <p>• Odometer integrity scanner check: FAILED [TAMPER BLOCKS PRESENT]</p>
                  <p>• Total Diagnostic points locked: 50 / 50 files</p>
                </div>

                <div className="flex justify-between items-center pt-2 text-[10px]">
                  <span className="text-gray-400 italic">Pre-purchase safety fee deposit verified</span>
                  <button 
                    onClick={() => {
                      setActiveReportId('rep_allion');
                      setSubTab('reports');
                    }}
                    className="font-sans font-bold uppercase tracking-wider text-[10px] text-black hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Certificate</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Submitting items generated on the fly */}
              {gigs.length === 0 ? (
                <div className="py-12 border border-dashed border-black/15 text-center text-gray-400 text-xs font-serif italic">
                  No additional buyer inspection logs saved in this session. Use the booking form on the left to initiate new contracts.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-[10px] text-gray-400 mt-2">Recently Registered contracts (Session Sandbox)</div>
                  {gigs.map((gig) => (
                    <div key={gig.id} className="p-5 border border-black/5 bg-[#fbfbfb] text-xs font-serif space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">{gig.notes ? gig.notes : 'JDM Pre-purchase Security Check'}</h4>
                          <p className="text-gray-400 font-mono text-[10px] mt-0.5">Location: {gig.locationText} • Hash ID: {gig.id.substring(0, 8)}</p>
                        </div>
                        <span className="bg-amber-50 text-amber-800 text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 border border-amber-200">
                          {gig.status === 'POSTED' ? 'Posted Queue' : gig.status}
                        </span>
                      </div>

                      <div className="bg-white p-3 border border-black/5 font-mono text-[10px] leading-relaxed text-gray-500">
                        <p>• Odometer Verify status: IN_QUEUE</p>
                        <p>• Assigned Mechanic Mobile: Waiting for accept signal...</p>
                        <p>• Escrow confirmation ID: {gig.id.substring(2, 10).toUpperCase()}</p>
                      </div>

                      <div className="text-[10px] text-gray-400 leading-normal italic">
                        PostgreSQL triggers loaded. Certified mechanics are performing physical evaluations. Status changes will update in real-time.
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 2: PORTABLE CERTIFICATES AND HIGH DEF DIGESTS */}
        {subTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: List of premium reports */}
            <div className="lg:col-span-4 bg-white p-6 border border-black/10 space-y-6">
              <div className="border-b border-black/10 pb-4">
                <h3 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-xs flex items-center gap-1.5">
                  <ListFilter className="h-4.5 w-4.5" />
                  <span>Choose Report Asset</span>
                </h3>
                <p className="text-[10px] text-gray-400 font-serif italic mt-0.5">Select a vehicle to inspect diagnostic certificates</p>
              </div>

              <div className="space-y-4">
                {reportsData.map((rep) => (
                  <div
                    key={rep.id}
                    onClick={() => setActiveReportId(rep.id)}
                    className={`p-4 border transition-all duration-200 cursor-pointer text-left space-y-2 ${activeReportId === rep.id ? 'border-black bg-[#fbfbfb] ring-1 ring-black' : 'border-black/5 hover:border-black/20 bg-white'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">{rep.title}</span>
                      <span className="font-mono text-xs font-bold text-gray-800">{rep.score}/100</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-mono tracking-tight leading-none">Plate: {rep.plate}</p>
                    <div className="flex justify-between items-center pt-1">
                      <span className={`text-[8px] font-sans font-bold uppercase tracking-widest border px-1.5 py-0.5 ${rep.score >= 90 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                        {rep.statusMsg}
                      </span>
                      <span className="text-[9px] text-gray-400 font-serif normal-case italic">{rep.stampDate}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-black text-[#fbfbfb] p-5 space-y-3 text-[11px] leading-relaxed font-mono">
                <span className="font-sans font-bold text-[9px] text-gray-400 uppercase tracking-wider block">🔒 Cryptographic Seal</span>
                <p className="text-gray-300">Each report features dynamic cryptographic verification hashes tied directly to mechanical sensors and Odometer readings.</p>
                <div className="text-[10px] text-amber-300 border-t border-white/10 pt-2 flex items-center gap-1.5">
                  <Award className="h-4 w-4 shrink-0" />
                  <span>Secure compliance verified</span>
                </div>
              </div>
            </div>

            {/* Right Column: Displaying Active Premium Report Certificate */}
            <div className="lg:col-span-8 bg-white p-8 border border-black shadow-sm space-y-8 animate-fade-in relative">
              <div className="absolute top-6 right-6 bg-black text-white px-3 py-1 text-[8px] font-sans font-bold uppercase tracking-widest font-mono">
                {activeReport.sealNo}
              </div>

              {/* Report Header */}
              <div className="pb-6 border-b border-black/10">
                <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[9px] uppercase tracking-widest">
                  <FileText className="h-4 w-4" />
                  <span>PRE-PURCHASE DIAGNOSTIC CERTIFICATE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-light font-serif text-slate-950 mt-2">{activeReport.title}</h2>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-serif italic">
                  <span>CC Metric: {activeReport.cc}</span>
                  <span>•</span>
                  <span>Owner Tag: {activeReport.owner}</span>
                  <span>•</span>
                  <span>Licensed Inspector: {activeReport.inspector}</span>
                </div>
              </div>

              {/* Core Scorecard row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-black/10 pb-6">
                
                {/* Score gauge circle */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-[#fbfbfb] border border-black/10 text-center">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-gray-400 mb-2">
                    {lang === 'en' ? 'FITNESS MATRIX' : 'ফিটনেস মূল্যায়ন'}
                  </span>
                  <div className="relative h-24 w-24 flex items-center justify-center">
                    <svg className="absolute transform -rotate-90 w-full h-full">
                      <circle cx="48" cy="48" r="38" stroke="#f1f1f1" strokeWidth="4" fill="transparent" />
                      {/* 2 * PI * r = 238.76. Score percentage offset */}
                      <circle 
                        cx="48" 
                        cy="48" 
                        r="38" 
                        stroke={activeReport.score >= 90 ? '#059669' : activeReport.score >= 70 ? '#d97706' : '#dc2626'} 
                        strokeWidth="4" 
                        fill="transparent" 
                        strokeDasharray="238.76" 
                        strokeDashoffset={(238.76 * (100 - activeReport.score)) / 100} 
                        className="transition-all duration-300"
                      />
                    </svg>
                    <span className="text-2xl font-light text-slate-900 font-serif">{activeReport.score}%</span>
                  </div>
                  <span className="bg-black text-[#fbfbfb] text-[9px] font-normal px-2.5 py-1.5 mt-4 border border-black uppercase tracking-widest font-mono">
                    {activeReport.gradeCode}
                  </span>
                </div>

                {/* Warnings, Tamper logs or alerts banner */}
                <div className="md:col-span-8 p-6 border text-xs space-y-3 bg-[#fbfbfb] border-black/10">
                  <div className="flex items-center gap-2 font-sans font-bold uppercase text-[10px] tracking-wider text-slate-950">
                    <ShieldAlert className="h-4.5 w-4.5" />
                    <span>Compliance & Tampering Analysis</span>
                  </div>
                  
                  {activeReport.tamperCheck ? (
                    <div className="space-y-2 text-rose-950">
                      <div className="flex items-center gap-1.5 font-sans font-bold text-[10px] text-rose-700 uppercase">
                        <AlertOctagon className="h-4 w-4 shrink-0" />
                        <span>Odometer roll-back verified</span>
                      </div>
                      <p className="text-gray-600 font-serif leading-relaxed text-xs">
                        {lang === 'en' 
                          ? 'This vehicles mechanical dashboard odometer was modified. Internal diagnostic components log 142,000 km while gauge displays 54,000 km. Reconditioned JDM Auction sheet was forged.'
                          : 'অসৎ ব্রোকার দ্বারা গাড়ির ওডোমিটার মিটার কমানো হয়েছে। ভেতরের কোড রেকর্ড রয়েছে ১৪২,০০০ কিমি কিন্তু মিটারে আছে মাত্র ৫৪,০০০ কিমি।'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-emerald-950">
                      <div className="flex items-center gap-1.5 font-sans font-bold text-[10px] text-emerald-700 uppercase">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span>Zero diagnostic manipulation detected</span>
                      </div>
                      <p className="text-gray-600 font-serif leading-relaxed text-xs">
                        {lang === 'en'
                          ? 'Our digital EPROM audit reveals pristine ECU flash counter logs. Odometer reading is structurally authentic when cross-compared with original JDM auction databases.'
                          : 'ওডোমিটারে কোনো প্রকার জালিয়াতি করা হয়নি। ইসিইউ ফ্ল্যাশ ও আসল নিলাম ডকুমেন্টের ডাটা মিল রয়েছে।'}
                      </p>
                    </div>
                  )}

                  {/* Hybrid spec health reporting block if applicable */}
                  {activeReport.hybridSoh !== null && (
                    <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs font-serif text-[#1a1a1a]">
                      <span className="font-sans font-bold uppercase text-[9px] text-[#1a1a1a] tracking-wider">Hybrid Battery State of Health (SoH)</span>
                      <span className="font-mono bg-emerald-50 text-emerald-950 border border-emerald-200 px-2 py-0.5 font-bold">
                        {activeReport.hybridSoh}% OK
                      </span>
                    </div>
                  )}
                </div>

              </div>

              {/* INTERACTIVE DIAGNOSTIC HEATMAP SYSTEM */}
              {(() => {
                const zonesList = [
                  { key: 'engine', cx: 100, cy: 75, name: lang === 'en' ? 'Engine' : 'ইঞ্জিন' },
                  { key: 'brake', cx: 58, cy: 95, name: lang === 'en' ? 'Brakes' : 'ব্রেক' },
                  { key: 'chassis', cx: 100, cy: 135, name: lang === 'en' ? 'Chassis' : 'চ্যাসিস' },
                  { key: 'odometer', cx: 100, cy: 175, name: lang === 'en' ? 'Cabin/OBD' : 'কেবিন' },
                  { key: 'hybrid', cx: 100, cy: 225, name: lang === 'en' ? 'Battery/EV' : 'ব্যাটারি' },
                  { key: 'rust', cx: 100, cy: 290, name: lang === 'en' ? 'Suspension/Rust' : 'সাসপেনশন/জং' },
                ];

                return (
                  <div id="vehicle-heatmap-dashboard" className="bg-[#fbfbfb] p-6 border border-black space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/10 pb-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[9px] uppercase tracking-widest mb-1">
                          <span className="inline-block h-2 w-2 bg-rose-600 animate-ping rounded-full" />
                          <span>Interactive X-Ray System</span>
                        </div>
                        <h3 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-xs">
                          {lang === 'en' ? 'Vehicle Trouble-Area Visual Heatmap' : 'গাড়ির ত্রুটিপূর্ণ অংশ চিহ্নিতকারী লাইভ হিটম্যাপ'}
                        </h3>
                      </div>

                      {/* Mode Toggles */}
                      <div className="flex bg-white border border-black/10 p-0.5 text-[9px] font-sans font-bold uppercase tracking-widest">
                        <button
                          type="button"
                          onClick={() => setHeatmapView('propulsion')}
                          className={`px-3 py-1.5 transition cursor-pointer ${heatmapView === 'propulsion' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                        >
                          {lang === 'en' ? 'Propulsion & EV' : 'ইঞ্জিন ও ইলেকট্রনিক্স'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeatmapView('bodywork')}
                          className={`px-3 py-1.5 transition cursor-pointer ${heatmapView === 'bodywork' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                        >
                          {lang === 'en' ? 'Bodywork & Chassis' : 'চেসিস ও কাঠামো'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: SVG Blueprint Car (Col 5) */}
                      <div className="md:col-span-5 bg-white border border-black/5 p-4 flex flex-col items-center justify-center relative min-h-[400px]">
                        <div className="absolute top-3 left-3 flex flex-col gap-1 text-[8px] font-mono text-gray-400 font-bold uppercase">
                          <span>CHASSIS: {activeReport.title}</span>
                          <span>SCAN RATE: 420 Hz (LASER MATRIX)</span>
                        </div>

                        <svg width="200" height="360" viewBox="0 0 200 360" className="mx-auto select-none mt-4">
                          <defs>
                            <pattern id="laserGg" width="20" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                            </pattern>
                          </defs>
                          
                          {/* Laser Grid Layout back */}
                          <rect width="100%" height="100%" fill="url(#laserGg)" />

                          {/* Side chassis laser guides */}
                          <line x1="20" y1="0" x2="20" y2="360" stroke="#f3f4f6" strokeWidth="1.5" strokeDasharray="4 2" />
                          <line x1="180" y1="0" x2="180" y2="360" stroke="#f3f4f6" strokeWidth="1.5" strokeDasharray="4 2" />

                          {/* Underbody Chassis Guide lines */}
                          <line x1="20" y1="95" x2="180" y2="95" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="1 3" />
                          <line x1="20" y1="180" x2="180" y2="180" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="1 3" />
                          <line x1="20" y1="265" x2="180" y2="265" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="1 3" />

                          {/* Main CAD Outlines of JDM unit sedan blueprint */}
                          <rect x="36" y="30" width="128" height="300" rx="36" ry="36" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
                          <rect x="38" y="32" width="124" height="296" rx="34" ry="34" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeOpacity="0.8" />
                          
                          {/* Sub-structures wheels */}
                          <rect x="22" y="65" width="14" height="34" rx="4" fill="#334155" />
                          <rect x="164" y="65" width="14" height="34" rx="4" fill="#334155" />
                          <rect x="22" y="260" width="14" height="34" rx="4" fill="#334155" />
                          <rect x="164" y="260" width="14" height="34" rx="4" fill="#334155" />

                          {/* Front headlights & grille */}
                          <rect x="52" y="30" width="14" height="6" fill="#fef08a" opacity="0.8" />
                          <rect x="134" y="30" width="14" height="6" fill="#fef08a" opacity="0.8" />
                          <line x1="72" y1="32" x2="128" y2="32" stroke="#475569" strokeWidth="2" />

                          {/* Mirrors */}
                          <path d="M 36 110 Q 25 110 26 102 Z" fill="#1e293b" />
                          <path d="M 164 110 Q 175 110 174 102 Z" fill="#1e293b" />

                          {/* Glass regions */}
                          <path d="M 46 115 Q 100 106 154 115 L 148 140 Q 100 146 52 140 Z" fill="none" stroke="#475569" strokeWidth="1.2" />
                          <path d="M 48 260 Q 100 265 152 260 L 148 274 Q 100 278 52 274 Z" fill="none" stroke="#475569" strokeWidth="1.2" />

                          {/* Inner powertrain/engine CAD box rendering (faded if bodywork) */}
                          <rect 
                            x="55" 
                            y="50" 
                            width="90" 
                            height="48" 
                            rx="4" 
                            fill="none" 
                            stroke="#64748b" 
                            strokeWidth="1.2" 
                            strokeDasharray={heatmapView === 'propulsion' ? 'none' : '3 3'}
                            opacity={heatmapView === 'propulsion' ? 0.8 : 0.3} 
                          />
                          
                          {/* EV Batteries chassis cell (underbody) */}
                          <rect 
                            x="50" 
                            y="190" 
                            width="100" 
                            height="60" 
                            rx="2" 
                            fill="none" 
                            stroke="#0f766e" 
                            strokeWidth="1.2" 
                            strokeDasharray={heatmapView === 'propulsion' ? '2 1' : '4 4'}
                            opacity={heatmapView === 'propulsion' ? 0.8 : 0.2} 
                          />

                          {/* Side Impact Core Chassis Strats (faded if propulsion) */}
                          <line x1="43" y1="40" x2="43" y2="320" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="8 4" opacity={heatmapView === 'bodywork' ? 0.9 : 0.2} />
                          <line x1="157" y1="40" x2="157" y2="320" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="8 4" opacity={heatmapView === 'bodywork' ? 0.9 : 0.2} />

                          {/* Interactive Zones mapping */}
                          {zonesList.map((z) => {
                            const health = getZoneHealth(z.key);
                            const isSelected = selectedZone === z.key;
                            
                            // Pick colors based on safety statuses
                            let solidColor = '#10b981'; // PASS
                            let pulseColor = 'rgba(16, 185, 129, 0.4)';
                            if (health.status === 'WARNING') {
                              solidColor = '#f59e0b';
                              pulseColor = 'rgba(245, 158, 11, 0.4)';
                            } else if (health.status === 'FAIL') {
                              solidColor = '#ef4444';
                              pulseColor = 'rgba(239, 68, 68, 0.4)';
                            } else if (health.status === 'N/A') {
                              solidColor = '#94a3b8';
                              pulseColor = 'rgba(148, 163, 184, 0.2)';
                            }

                            return (
                              <g 
                                key={z.key} 
                                onClick={() => setSelectedZone(z.key)} 
                                className="cursor-pointer group"
                              >
                                {/* Selected highlight outer ring */}
                                {isSelected && (
                                  <circle 
                                    cx={z.cx} 
                                    cy={z.cy} 
                                    r="18" 
                                    fill="transparent" 
                                    stroke={solidColor} 
                                    strokeWidth="1.5" 
                                    strokeDasharray="3 2"
                                    className="animate-spin"
                                    style={{ transformOrigin: `${z.cx}px ${z.cy}px`, animationDuration: '6s' }}
                                  />
                                )}

                                {/* Standard pulse ring */}
                                {health.status !== 'N/A' && (
                                  <circle 
                                    cx={z.cx} 
                                    cy={z.cy} 
                                    r={isSelected ? "14" : "10"} 
                                    fill={pulseColor} 
                                    className="animate-ping" 
                                    style={{ transformOrigin: `${z.cx}px ${z.cy}px`, strokeWidth: 0, animationDuration: '3s' }} 
                                  />
                                )}

                                {/* Base hover ring */}
                                <circle 
                                  cx={z.cx} 
                                  cy={z.cy} 
                                  r="13" 
                                  fill="transparent" 
                                  className="group-hover:fill-black/5" 
                                />

                                {/* Solid status indicator */}
                                <circle 
                                  cx={z.cx} 
                                  cy={z.cy} 
                                  r="6" 
                                  fill={solidColor} 
                                  stroke="#ffffff" 
                                  strokeWidth="1.5" 
                                  className="transition-all duration-200 group-hover:scale-125"
                                  style={{ transformOrigin: `${z.cx}px ${z.cy}px` }}
                                />

                                {/* Label anchor on CAD blueprint */}
                                <text 
                                  x={z.cx} 
                                  y={z.cy - 12} 
                                  textAnchor="middle" 
                                  className={`font-sans tracking-tighter text-[9px] font-bold ${isSelected ? 'fill-slate-900 scale-105' : 'fill-slate-400 group-hover:fill-slate-700'}`}
                                  style={{ transformOrigin: `${z.cx}px ${z.cy - 12}px` }}
                                >
                                  {z.name}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                        
                        <div className="mt-4 text-[9px] text-gray-400 font-sans tracking-widest uppercase">
                          💡 {lang === 'en' ? 'Click pulse points for full telemetry' : 'সম্পূর্ণ তথ্য দেখতে রঙিন পয়েন্টগুলোতে ক্লিক করুন'}
                        </div>
                      </div>

                      {/* Right Details Scanner (Col 7) */}
                      {(() => {
                        const activeZoneData = getZoneHealth(selectedZone);
                        
                        let bgBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                        let statusLabel = lang === 'en' ? 'PRISTINE STATUS' : 'ত্রুটিহীন মেকানিক্যাল জোন';
                        if (activeZoneData.status === 'WARNING') {
                          bgBadge = 'bg-amber-50 text-amber-800 border-amber-200';
                          statusLabel = lang === 'en' ? 'CAUTION & WEAR TRACK' : 'হালকা পরিধান বা ঝুঁকি';
                        } else if (activeZoneData.status === 'FAIL') {
                          bgBadge = 'bg-rose-50 text-rose-800 border-rose-200';
                          statusLabel = lang === 'en' ? 'CRITICAL DAMAGE / ROLLBACK' : 'গুরুতর ত্রুটি বা কারচুপি';
                        } else if (activeZoneData.status === 'N/A') {
                          bgBadge = 'bg-slate-50 text-slate-500 border-slate-200';
                          statusLabel = lang === 'en' ? 'MODULE INACTIVE / NOT EQUIPPED' : 'ইন-অ্যাক্টিভ মডিউল';
                        }

                        return (
                          <div className="md:col-span-7 bg-white border border-black/10 p-5 min-h-[400px] flex flex-col justify-between space-y-6">
                            
                            {/* Header telemetry zone */}
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                                <h4 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-xs">
                                  {activeZoneData.label}
                                </h4>
                                <span className={`px-2.5 py-1 text-[8px] font-sans font-bold tracking-widest uppercase border ${bgBadge}`}>
                                  {statusLabel}
                                </span>
                              </div>

                              <p className="text-gray-600 text-xs leading-relaxed font-serif">
                                {activeZoneData.desc}
                              </p>
                            </div>

                            {/* Detailed test checklist points */}
                            <div className="bg-[#fbfbfb] p-4 border border-black/5 space-y-3">
                              <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest block font-bold">
                                📡 OBD & PHYSICAL TELEMETRY MATRIX:
                              </span>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[11px] font-mono leading-relaxed text-slate-700">
                                {activeZoneData.subitems.map((sub, sIdx) => {
                                  // evaluate coloring prefix
                                  let prefixDot = 'bg-emerald-500';
                                  if (activeZoneData.status === 'WARNING') prefixDot = 'bg-amber-500';
                                  else if (activeZoneData.status === 'FAIL') prefixDot = 'bg-rose-500';
                                  else if (activeZoneData.status === 'N/A') prefixDot = 'bg-slate-300';
                                  
                                  return (
                                    <div key={sIdx} className="flex items-center gap-2">
                                      <span className={`h-1.5 w-1.5 rounded-full ${prefixDot}`} />
                                      <span>{sub}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Direct action flow connection */}
                            <div className="pt-4 border-t border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                              <div className="flex-1">
                                <span className="text-gray-400 block font-mono text-[9px] tracking-wide uppercase">Advisory Guide</span>
                                <p className="font-serif italic text-gray-500 text-[11px] mt-0.5">
                                  {activeZoneData.status === 'PASS' 
                                    ? (lang === 'en' ? 'Pristine ratings. Continue periodic diagnostics.' : 'সম্পূর্ণ সুস্থ অবস্থা। রুটিন পরীক্ষা অব্যাহত রাখুন।')
                                    : activeZoneData.status === 'WARNING'
                                    ? (lang === 'en' ? 'Pre-select repair to lock in standard garage pricing.' : 'নির্দিষ্ট সার্ভিসটি বুক করে মূল্যহ্রাস ও ওয়ারেন্টি লক করুন।')
                                    : activeZoneData.status === 'FAIL'
                                    ? (lang === 'en' ? 'Urgent dispatch mandatory. Risk of transmission or legal hazard.' : 'জরুরী মেকানিক্যাল সংস্কার সাজেস্ট করা যাচ্ছে।')
                                    : (lang === 'en' ? 'Regular octane engine configurations apply.' : 'পেট্রোল চালিত গাড়ির সার্ভিস রেঞ্জ প্রযোজ্য।')
                                  }
                                </p>
                              </div>

                              {(activeZoneData.status === 'WARNING' || activeZoneData.status === 'FAIL') && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Maps specific troubles to pre-selected tab repairs
                                    let repairKey = 'suspension';
                                    if (selectedZone === 'odometer') repairKey = 'odometer_eprom';
                                    if (selectedZone === 'hybrid') repairKey = 'hybrid_battery';
                                    if (selectedZone === 'brake') repairKey = 'abs_actuator';
                                    if (selectedZone === 'engine') repairKey = 'cvt_fluid';

                                    setSelectedRepairs([repairKey]);
                                    setSubTab('maintenance');
                                    alert(lang === 'en'
                                      ? `System pre-selected relevant repairs: [${repairKey.toUpperCase()}] and dispatched you to Accredited Workshops!`
                                      : `হিটম্যাপ সিস্টেম স্বয়ংক্রিয়ভাবে [${repairKey.toUpperCase()}] সার্ভিসটি চেক করে আপনাকে ওয়ার্কশপ ট্যাবে ফরওয়ার্ড করেছে!`
                                    );
                                  }}
                                  className="px-4 py-2 bg-slate-950 text-white font-sans font-bold uppercase tracking-widest text-[9px] hover:bg-white hover:text-black border border-black transition shrink-0 cursor-pointer w-full sm:w-auto text-center"
                                >
                                  ⚙️ {lang === 'en' ? 'Pre-Select Remediation' : 'ত্রুটি সংস্কার করুন'}
                                </button>
                              )}
                            </div>

                          </div>
                        );
                      })()}

                    </div>
                  </div>
                );
              })()}

              {/* Inspection Point checklists detail layout */}
              <div className="space-y-4">
                <h3 className="font-sans font-bold uppercase tracking-widest text-slate-900 text-xs">Diagnostic Inspection Points Checklist</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif leading-relaxed text-gray-700">
                  {activeReport.issues.map((pt, idx) => (
                    <div key={idx} className="bg-[#fbfbfb] p-5 border border-black/10 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <span className="font-sans font-extrabold text-[9px] text-slate-950 uppercase tracking-widest">{pt.label}</span>
                          <span className={`px-2 py-0.5 font-sans text-[8px] font-bold uppercase tracking-wider border ${pt.status === 'PASS' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : pt.status === 'WARNING' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                            {pt.status}
                          </span>
                        </div>
                        <p className="text-gray-600 font-serif text-[11px] mt-2 leading-relaxed">
                          {pt.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial repair cost mapping */}
              <div className="bg-[#fbfbfb] p-6 border border-black/10 space-y-4 font-serif">
                <h4 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-[10px] flex items-center gap-1.5 border-b border-black/5 pb-2">
                  <Award className="h-4.5 w-4.5" />
                  <span>Immediate Preventive Budget Summary</span>
                </h4>
                
                <div className="space-y-2 text-xs text-gray-600">
                  {activeReport.costs.engine > 0 && (
                    <div className="flex justify-between">
                      <span>Engine carbon flush & lubricants</span>
                      <span className="font-bold text-slate-950">৳{activeReport.costs.engine.toLocaleString()}</span>
                    </div>
                  )}
                  {activeReport.costs.brake > 0 && (
                    <div className="flex justify-between">
                      <span>ABS electronic booster motor recalibration</span>
                      <span className="font-bold text-slate-950">৳{activeReport.costs.brake.toLocaleString()}</span>
                    </div>
                  )}
                  {activeReport.costs.cluster > 0 && (
                    <div className="flex justify-between">
                      <span>Dashboard meter EPROM chip recovery repair</span>
                      <span className="font-bold text-slate-950">৳{activeReport.costs.cluster.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs sm:text-sm font-sans font-bold uppercase tracking-wider text-slate-950 pt-3 border-t border-black/5">
                  <span>Estimated Remediation Estimate</span>
                  <span className="font-mono text-black">৳{activeReport.costs.total.toLocaleString()} BDT</span>
                </div>
              </div>

              {/* Certificate footer buttons */}
              <div className="pt-6 border-t border-black/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-serif">
                <span className="text-gray-400 font-mono text-[10px] select-all">PG_SECURE_HASH: {activeReport.hash}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsDisputeOpen(true)}
                    className="px-4 py-2.5 text-rose-600 bg-rose-50/50 hover:bg-rose-100 font-sans font-bold uppercase tracking-wider border border-rose-200 hover:border-rose-400 text-[10px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    {lang === 'en' ? 'Open Dispute' : 'অভিযোগ উত্থাপন'}
                  </button>
                  <button 
                    onClick={() => {
                      alert(lang === 'en' 
                        ? `Shared Token copied! Anyone with the token: ${activeReport.hash} can view this inspected JDM report.` 
                        : `শেয়ার টোকেন কপি করা হয়েছে! টোকেন: ${activeReport.hash} দিয়ে যে কেউ ওয়েবসাইটে এই ভেরিফাইড রিপোর্ট দেখতে পাবেন।`
                      );
                    }}
                    className="px-4 py-2.5 hover:bg-[#fbfbfb] text-[#1a1a1a] font-sans font-bold uppercase tracking-wider border border-black/15 text-[10px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5 animate-pulse" />
                    Share Token
                  </button>
                  <button 
                    onClick={() => {
                      alert(lang === 'en' 
                        ? `Exporting authentic cryptographic PDF certificate for: ${activeReport.title}` 
                        : `${activeReport.title} এর আসল শংসাপত্র পিডিএফ আকারে ডাউনলোড সম্পন্ন হয়েছে।`
                      );
                    }}
                    className="px-5 py-2.5 bg-black text-white font-sans font-bold uppercase tracking-wider text-[10px] hover:bg-white hover:text-black border border-black transition cursor-pointer"
                  >
                    Download PDF Certificate
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: BANGLADESH JDM TAX TARIFF AND IMPORT DUTY CALCULATOR */}
        {subTab === 'tariff' && (
          <div className="bg-white p-8 border border-black/10 space-y-8">
            <div className="border-b border-black/10 pb-4">
              <h3 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-xs flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                <span>Bangladesh Customs JDM Tariff & Duty Calculator</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-serif italic mt-0.5">
                Calculate total supplementary duties, advance income taxes, regulatory duty and custom port clearances for reconditioned Japanese vehicles.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Calculator Inputs Form */}
              <div className="lg:col-span-5 bg-[#fbfbfb] p-6 border border-black/10 space-y-5 text-xs font-serif">
                <blockquote className="border-l-2 border-l-black pl-3 text-[11px] text-gray-500 italic leading-relaxed">
                  *Our duty engine applies the latest National Board of Revenue (NBR) supplement brackets including hybrid-propulsion discounts.*
                </blockquote>

                {/* CC options */}
                <div className="space-y-1.5">
                  <label className="block text-gray-500 text-[10px] font-sans font-bold uppercase tracking-widest">1. Engine capacity (Cubic Capacity CC)</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[1000, 1500, 1800, 2000, 2500].map(cc => (
                      <button
                        key={cc}
                        type="button"
                        onClick={() => setCalcCC(cc)}
                        className={`py-2 text-[10px] font-sans font-bold uppercase border cursor-pointer transition ${calcCC === cc ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-black/10'}`}
                      >
                        {cc} CC
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hybrid switch */}
                <div className="space-y-1.5">
                  <label className="block text-gray-500 text-[10px] font-sans font-bold uppercase tracking-widest">2. Hybrid Technology Option</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCalcIsHybrid(true)}
                      className={`py-2 text-[10px] font-sans font-bold uppercase border cursor-pointer transition ${calcIsHybrid ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-white text-gray-400 border-black/10'}`}
                    >
                      🌱 Hybrid Engine
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcIsHybrid(false)}
                      className={`py-2 text-[10px] font-sans font-bold uppercase border cursor-pointer transition ${!calcIsHybrid ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-white text-gray-400 border-black/10'}`}
                    >
                      ⛽ Regular Octane
                    </button>
                  </div>
                </div>

                {/* Manufactured Year */}
                <div className="space-y-1.5">
                  <label className="block text-gray-500 text-[10px] font-sans font-bold uppercase tracking-widest">3. Manufactured Depreciation Year</label>
                  <select
                    value={calcYear}
                    onChange={(e) => setCalcYear(Number(e.target.value))}
                    className="w-full bg-white border border-black/10 text-slate-805 font-sans font-bold uppercase tracking-widest text-[10px] px-3 py-2.5 focus:outline-none cursor-pointer"
                  >
                    <option value="2026">2026 (New Unit - 0% Depreciation)</option>
                    <option value="2025">2025 (1 Year old - 10% Depreciation)</option>
                    <option value="2024">2024 (2 Years old - 20% Depreciation)</option>
                    <option value="2023">2023 (3 Years old - 25% Depreciation)</option>
                    <option value="2022">2022 (4 Years old - 30% Depreciation)</option>
                    <option value="2021">2021 (5 Years old - 35% Depreciation)</option>
                  </select>
                </div>

                {/* FOB USD value */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500">
                    <span>4. Estimated FOB Auction Price</span>
                    <span className="text-black font-mono">USD ($)</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={calcFobUSD}
                      onChange={(e) => setCalcFobUSD(Number(e.target.value))}
                      placeholder="e.g. 15000"
                      className="w-full bg-white border border-black/15 text-[#1a1a1a] p-3 text-xs font-mono focus:outline-none text-center"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={calculateJDMDuty}
                  className="w-full bg-black text-white border border-black font-sans font-bold uppercase tracking-[0.2em] text-[10px] py-4 hover:bg-white hover:text-black transition cursor-pointer"
                >
                  ⚡ Calculate Customs Duty
                </button>
              </div>

              {/* Calculator Outputs / Graphical breakdown */}
              <div className="lg:col-span-7 space-y-6">
                {calcResult ? (
                  <div className="space-y-6 animate-fade-in font-serif">
                    <div className="p-5 bg-[#fbfbfb] border border-black text-xs space-y-2">
                      <div className="flex justify-between font-sans font-bold uppercase tracking-wider text-slate-900">
                        <span>ESTIMATED CUSTOMS RELEASE VALUE</span>
                        <span className="font-mono text-emerald-800">৳{calcResult.grandTotal.toLocaleString()} BDT</span>
                      </div>
                      <p className="text-gray-400 font-serif italic text-[11px]">Includes JDM depreciation, shipping handling, supplementation, VAT, and Port logistics charges.</p>
                    </div>

                    {/* Breakdown Ledger list */}
                    <div className="bg-white border border-black/10 p-5 space-y-3.5 text-xs">
                      
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-400">Customs Assessed CIF Value (BDT)</span>
                        <span className="font-mono font-bold text-slate-800">৳{calcResult.assessable.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between border-b pb-2">
                        <div>
                          <span className="text-gray-900 block font-sans font-bold tracking-wider text-[9px] uppercase">Customs Duty (CD) — 25%</span>
                          <span className="text-gray-400 text-[10px]">Standard vehicle import tariff base</span>
                        </div>
                        <span className="font-mono font-bold text-slate-800 self-center">৳{calcResult.cd.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between border-b pb-2">
                        <div>
                          <span className="text-gray-900 block font-sans font-bold tracking-wider text-[9px] uppercase">Supplementary Duty (SD) — {calcResult.sdPercentage}%</span>
                          <span className="text-gray-400 text-[10px]">Supplementary duty with Hybrid deduction credits</span>
                        </div>
                        <span className="font-mono font-bold text-slate-800 self-center">৳{calcResult.sd.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between border-b pb-2">
                        <div>
                          <span className="text-gray-900 block font-sans font-bold tracking-wider text-[9px] uppercase">Import VAT — 15%</span>
                          <span className="text-gray-400 text-[10px]">Tied to custom release value aggregates</span>
                        </div>
                        <span className="font-mono font-bold text-slate-800 self-center">৳{calcResult.vat.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between border-b pb-2">
                        <div>
                          <span className="text-gray-900 block font-sans font-bold tracking-wider text-[9px] uppercase">Advance Income Tax (AIT) — 5%</span>
                          <span className="text-gray-400 text-[10px]">Tax bracket adjusted permanently</span>
                        </div>
                        <span className="font-mono font-bold text-slate-800 self-center">৳{calcResult.ait.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between border-b pb-2 text-slate-950 font-sans font-bold uppercase tracking-wider text-[10px]">
                        <span>Port Logistics & Clearing Yard Fee</span>
                        <span className="font-mono text-slate-900">৳{calcResult.logistics.toLocaleString()} BDT</span>
                      </div>

                    </div>

                    {/* SVG stacked visual stack bars of taxes */}
                    <div className="bg-[#fbfbfb] p-6 border border-black/10 space-y-3 font-sans">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block">Duty Tax Structural Breakdown (%)</span>
                      
                      <div className="h-6 w-full bg-gray-200 flex overflow-hidden">
                        {/* CD */}
                        <div className="bg-[#1e293b] h-full" style={{ width: '25%' }} title="Customs Duty" />
                        {/* SD */}
                        <div className="bg-[#0f766e] h-full" style={{ width: '40%' }} title="Supplementary Duty" />
                        {/* VAT */}
                        <div className="bg-[#b45309] h-full" style={{ width: '20%' }} title="VAT" />
                        {/* Others */}
                        <div className="bg-[#94a3b8] h-full" style={{ width: '15%' }} title="Others" />
                      </div>

                      <div className="flex flex-wrap gap-4 text-[10px] text-gray-500 font-bold uppercase mt-2">
                        <div className="flex items-center gap-1.5">
                          <div className="h-3 w-3 bg-[#1e293b]" />
                          <span>CD (25%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-3 w-3 bg-[#0f766e]" />
                          <span>SD ({calcResult.sdPercentage}%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-3 w-3 bg-[#b45309]" />
                          <span>VAT (15%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-3 w-3 bg-[#94a3b8]" />
                          <span>AIT & ATV</span>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center border border-dashed border-black/20 p-12 text-center text-gray-400 italic text-xs">
                    <Calculator className="h-8 w-8 text-slate-300 mb-2 font-light" />
                    <span>Configure JDM parameters on the left and click "Calculate Customs Duty" to populate the official customs tariff ledger.</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: ACCREDITED WORKSHOPS AND REMEDIATIONS */}
        {subTab === 'maintenance' && (
          <div className="bg-white p-8 border border-black/10 space-y-8">
            <div className="border-b border-black/10 pb-4">
              <h3 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-xs flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                <span>Preventive Maintenance & Garage Dispatcher</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-serif italic mt-0.5">
                Dispatch your inspected vehicle defects directly to certified, high-grade garages in Dhaka & Chattogram for secure parts overhaul.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Repairs select form and garage scheduling */}
              <div className="lg:col-span-7 bg-[#fbfbfb] p-6 border border-black/10 space-y-6">
                <div className="border-b pb-3 border-black/5">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-gray-400">Step 1: Select defects to resolve</span>
                </div>

                {workshopBooked ? (
                  <div className="p-8 bg-emerald-50 border border-emerald-200 text-emerald-950 font-serif text-center space-y-4">
                    <div className="h-12 w-12 bg-emerald-800 text-white rounded-full flex items-center justify-center mx-auto text-xl">✓</div>
                    <div className="space-y-1">
                      <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-emerald-950">Workshop Booking Dispatched!</h4>
                      <p className="text-xs text-emerald-800 italic">Work order logged securely under postgres ACID ledger codes</p>
                    </div>

                    <div className="bg-white/80 p-4 border text-[11px] font-mono leading-relaxed space-y-1 inline-block text-left mx-auto">
                      <p>• Workshop: {preferredWorkshop === 'tejgaon_jdm' ? 'Tejgaon JDM Masters' : preferredWorkshop === 'mirpur_special' ? 'Mirpur Auto Expert Hub' : 'Chander-gari Paint Yard'}</p>
                      <p>• Inspection scheduled date: {workshopDate}</p>
                      <p>• Items: {selectedRepairs.length} modules to rebuild</p>
                      <p>• Reference Ticket ID: W_ORD_9841</p>
                    </div>

                    <p className="text-[10px] text-gray-400 font-sans tracking-wide">
                      Review bottom interactive terminal for API transmissions.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleMaintenanceBooking} className="space-y-6 text-xs font-serif">
                    
                    {/* Checkboxes list */}
                    <div className="space-y-3">
                      
                      <div 
                        onClick={() => toggleRepair('abs_actuator')}
                        className={`p-4 border transition-all cursor-pointer flex justify-between items-center ${selectedRepairs.includes('abs_actuator') ? 'border-black bg-white ring-1 ring-black' : 'border-black/5 bg-white'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="checkbox" 
                            checked={selectedRepairs.includes('abs_actuator')}
                            onChange={() => {}} // toggled by parent div
                            className="accent-black cursor-pointer h-4 w-4 shrink-0 rounded-none border-gray-300"
                          />
                          <div>
                            <span className="font-sans font-bold text-[10px] text-[#1a1a1a] uppercase">ABS Booster Actuator Overhaul</span>
                            <span className="block text-[10.5px] text-gray-400 italic">Replaces failing internal solenoids & electrical brush pump with 1 year warranty</span>
                          </div>
                        </div>
                        <span className="font-sans font-bold text-[#1a1a1a]">৳৪৫,০০০</span>
                      </div>

                      <div 
                        onClick={() => toggleRepair('hybrid_battery')}
                        className={`p-4 border transition-all cursor-pointer flex justify-between items-center ${selectedRepairs.includes('hybrid_battery') ? 'border-black bg-white ring-1 ring-black' : 'border-black/5 bg-white'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="checkbox" 
                            checked={selectedRepairs.includes('hybrid_battery')}
                            onChange={() => {}} // toggled by parent div
                            className="accent-black cursor-pointer h-4 w-4 shrink-0 rounded-none border-gray-300"
                          />
                          <div>
                            <span className="font-sans font-bold text-[10px] text-[#1a1a1a] uppercase">Hybrid EV Battery cell balancing</span>
                            <span className="block text-[10.5px] text-gray-400 italic">Increases total system State of Health (SOH) by 15-20% through module level swap</span>
                          </div>
                        </div>
                        <span className="font-sans font-bold text-[#1a1a1a]">৳২৮,০০০</span>
                      </div>

                      <div 
                        onClick={() => toggleRepair('suspension')}
                        className={`p-4 border transition-all cursor-pointer flex justify-between items-center ${selectedRepairs.includes('suspension') ? 'border-black bg-white ring-1 ring-black' : 'border-black/5 bg-white'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="checkbox" 
                            checked={selectedRepairs.includes('suspension')}
                            onChange={() => {}} // toggled by parent div
                            className="accent-black cursor-pointer h-4 w-4 shrink-0 rounded-none border-gray-300"
                          />
                          <div>
                            <span className="font-sans font-bold text-[10px] text-[#1a1a1a] uppercase">Suspension Bushes & steering rack repair</span>
                            <span className="block text-[10.5px] text-gray-400 italic">Solves typical rattling on uneven potholed Dhaka roads, using Japanese bushes</span>
                          </div>
                        </div>
                        <span className="font-sans font-bold text-[#1a1a1a]">৳১৮,০০০</span>
                      </div>

                      <div 
                        onClick={() => toggleRepair('odometer_eprom')}
                        className={`p-4 border transition-all cursor-pointer flex justify-between items-center ${selectedRepairs.includes('odometer_eprom') ? 'border-black bg-white ring-1 ring-black' : 'border-black/5 bg-white'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="checkbox" 
                            checked={selectedRepairs.includes('odometer_eprom')}
                            onChange={() => {}} // toggled by parent div
                            className="accent-black cursor-pointer h-4 w-4 shrink-0 rounded-none border-gray-300"
                          />
                          <div>
                            <span className="font-sans font-bold text-[10px] text-[#1a1a1a] uppercase">Odometer cluster Software reset to original JDM EPROM</span>
                            <span className="block text-[10.5px] text-gray-400 italic">Disables odometer spoofing. Rewires original factory mileage to display cluster console</span>
                          </div>
                        </div>
                        <span className="font-sans font-bold text-[#1a1a1a]">৳৮,০০০</span>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="block text-gray-500 text-[10px] font-sans font-bold uppercase tracking-widest">Step 2: Choose Workshop Partner</label>
                        <select
                          value={preferredWorkshop}
                          onChange={(e) => setPreferredWorkshop(e.target.value)}
                          className="w-full bg-white border border-black/10 text-slate-805 font-sans font-bold uppercase tracking-widest text-[9px] px-3 py-2.5 focus:outline-none cursor-pointer"
                        >
                          <option value="tejgaon_jdm">Tejgaon JDM Masters (Highly Recommended)</option>
                          <option value="mirpur_special">Mirpur Auto Expert Hub (Standard service)</option>
                          <option value="chattogram_pro">Nasirabad Premium JDM Yard (Chittagong)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-gray-500 text-[10px] font-sans font-bold uppercase tracking-widest">Step 3: Appointment Date</label>
                        <input 
                          type="date"
                          value={workshopDate}
                          onChange={(e) => setWorkshopDate(e.target.value)}
                          className="w-full bg-white border border-black/10 text-slate-805 font-sans font-bold uppercase tracking-widest text-[10px] px-3 py-2 focus:outline-none cursor-pointer"
                        />
                      </div>

                    </div>

                    <button
                      type="submit"
                      className="w-full bg-black text-white border border-black font-sans font-bold uppercase tracking-[0.2em] text-[10px] py-4.5 hover:bg-white hover:text-black transition cursor-pointer"
                    >
                      Initialize Workshop Dispatch Order (Estimate: ৳{selectedRepairsSum.toLocaleString()} BDT)
                    </button>

                  </form>
                )}

              </div>

              {/* Right Column: Accredited Garages reference list */}
              <div className="lg:col-span-5 bg-white p-6 border border-black/10 space-y-5">
                <h3 className="font-sans font-bold uppercase tracking-widest text-xs border-b pb-3 text-slate-900 flex items-center gap-1">
                  <CheckCircle2 className="h-4.5 w-4.5 text-black" />
                  <span>Accredited Garages Network</span>
                </h3>

                <p className="text-gray-400 text-xs italic font-serif leading-relaxed">
                  Only premium diagnostic repair shops equipped with certified computer-aided scanner triggers (Autel, Xtool diagnostic tools) are allowed on GariAudit.
                </p>

                <div className="divide-y divide-black/5 text-xs font-serif leading-relaxed space-y-4 pt-2">
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center flex-wrap">
                      <span className="font-sans font-bold uppercase text-[10px] text-slate-950">Tejgaon JDM Masters</span>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[8px] font-sans font-bold uppercase px-2 py-0.5">Top Choice</span>
                    </div>
                    <p className="text-gray-500 text-[11px]">Plot 84/A, Tejgaon Industrial Area, Dhaka. Experts in Hybrid battery module repair, CVT rebuilds and ABS diagnostics.</p>
                  </div>

                  <div className="space-y-1.5 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-sans font-bold uppercase text-[10px] text-slate-950">Mirpur Auto Expert Hub</span>
                      <span className="text-gray-400 text-[9px]">A-rate</span>
                    </div>
                    <p className="text-gray-500 text-[11px]">Sector 10, Mirpur, Dhaka. Specialized in structural suspension repairs, alignment checking, and digital EPROM recalibration support.</p>
                  </div>

                  <div className="space-y-1.5 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-sans font-bold uppercase text-[10px] text-slate-950">Nasirabad Premium JDM Yard</span>
                      <span className="text-gray-400 text-[9px]">Chittagong</span>
                    </div>
                    <p className="text-gray-500 text-[11px]">GEC Circle Road, Chattogram. Equipped with digital paint depth meters, spray booths, and mechanical frame alignment fixtures.</p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- DISPUTE CHAT MODAL OVERLAY --- */}
        {isDisputeOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-black/20 text-[#1a1a1a] w-full max-w-lg shadow-2xl relative flex flex-col h-[550px]" id="dispute-chat-modal">
              {/* Header */}
              <div className="p-5 border-b border-black/10 bg-black text-[#fbfbfb] flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 text-rose-400 font-mono text-[9px] uppercase tracking-widest font-bold animate-pulse">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Dispute Re-Evaluation Enquiry</span>
                  </div>
                  <h3 className="font-serif text-lg font-light mt-1">
                    {lang === 'en' ? 'Audit Appeal Desk' : 'আপিল ও অভিযোগ সেল'}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans tracking-wide uppercase mt-1">
                    {activeReport.title} ({activeReport.plate})
                  </p>
                </div>
                <button 
                  onClick={() => setIsDisputeOpen(false)}
                  className="text-gray-400 hover:text-white transition p-1 cursor-pointer"
                  title="Close Dispute Chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Chat Message Scrollport */}
              <div className="flex-1 overflow-y-auto p-5 bg-[#fbfbfb] space-y-4">
                <div className="bg-amber-50 border border-amber-200 text-amber-900 text-[11px] p-3 leading-relaxed font-serif flex items-start gap-2">
                  <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-sans font-bold uppercase tracking-wider text-[9px] block text-amber-950 mb-0.5">DIRECT ADMIN ENQUIRY</span>
                    {lang === 'en'
                      ? 'Submit details countering structural seals, paint micron scans, or odometer findings. Response targets under 2 mins.'
                      : 'মিটার কারচুপি বা ডাবল চেসিস লেজার নিরীক্ষার জন্য সুনির্দিষ্ট আবেদন জমা দিন। আমাদের প্যানেল থেকে খুব শীঘ্রই উত্তর দেওয়া হবে।'}
                  </div>
                </div>

                {/* Render messages history */}
                {(disputeMessages[activeReportId] || []).map((msg) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'} space-y-1`}
                    >
                      <div className="flex items-center gap-1.5 text-[9px] font-sans font-bold uppercase tracking-wide text-gray-400">
                        <span>{msg.senderName}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div 
                        className={`max-w-[85%] px-4 py-3 text-xs leading-relaxed font-serif ${
                          isAdmin 
                            ? 'bg-white border border-black/10 text-slate-900 rounded-none rounded-br-lg' 
                            : 'bg-black text-[#fbfbfb] rounded-none rounded-bl-lg'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

                {/* Custom Typing indicator */}
                {typingState && (
                  <div className="flex flex-col items-start space-y-1">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wide text-gray-400 animate-pulse">
                      {lang === 'en' ? 'Senior Compliance Expert is typing...' : 'নিরীক্ষক জবাব লিখছেন...'}
                    </span>
                    <div className="bg-white border border-black/5 px-4 py-2.5 text-xs text-gray-400 rounded-none rounded-br-lg flex items-center gap-1.5 italic font-serif">
                      <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Instant predefined complaints triggers */}
              <div className="p-3 bg-white border-t border-black/5 flex flex-wrap gap-1.5">
                <span className="text-[8px] font-sans font-bold text-gray-400 uppercase tracking-widest block w-full mb-1">
                  💡 {lang === 'en' ? 'Quick Appeals' : 'দ্রুত অভিযোগ ফর্মুলা'}
                </span>
                
                {activeReportId === 'rep_allion' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSendDisputeMessage(lang === 'en' ? 'Request physical auction sheet double-check' : 'নিলাম হাউজের আসল মেমোরি ফাইল চেক করতে চাই')}
                      disabled={typingState}
                      className="px-2.5 py-1.5 text-[10px] font-sans font-semibold border border-black/10 bg-[#fbfbfb] hover:bg-black hover:text-white hover:border-black transition disabled:opacity-55 cursor-pointer text-slate-800 text-left"
                    >
                      🔍 Odometer Double-Check
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendDisputeMessage(lang === 'en' ? 'Inquire about ABS Booster warranty package' : 'এবিএস পাম্প মেরামতের মূল্য তালিকা জানতে চাই')}
                      disabled={typingState}
                      className="px-2.5 py-1.5 text-[10px] font-sans font-semibold border border-black/10 bg-[#fbfbfb] hover:bg-black hover:text-white hover:border-black transition disabled:opacity-55 cursor-pointer text-slate-800 text-left"
                    >
                      ⚙️ ABS Master Pump Price
                    </button>
                  </>
                ) : activeReportId === 'rep_premio_hybrid' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSendDisputeMessage(lang === 'en' ? 'Inspect chassis paint thickness variations' : 'চ্যাসিসের বিভিন্ন অংশের পেইন্ট থিকনেস রেকর্ড দেখতে চাই')}
                      disabled={typingState}
                      className="px-2.5 py-1.5 text-[10px] font-sans font-semibold border border-black/10 bg-[#fbfbfb] hover:bg-black hover:text-white hover:border-black transition disabled:opacity-55 cursor-pointer text-slate-800 text-left"
                    >
                      ✨ Confirm Laser Microns
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendDisputeMessage(lang === 'en' ? 'Verify hybrid battery SOC block standard' : 'হাইব্রিড ব্যাটারির টেস্ট ভোল্টেজ ব্যালেন্স সীট দেখতে চাই')}
                      disabled={typingState}
                      className="px-2.5 py-1.5 text-[10px] font-sans font-semibold border border-black/10 bg-[#fbfbfb] hover:bg-black hover:text-white hover:border-black transition disabled:opacity-55 cursor-pointer text-slate-800 text-left"
                    >
                      🌱 Battery SOH Details
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSendDisputeMessage(lang === 'en' ? 'Is Vezel dual-clutch leak repair covered by seller deposit?' : 'হোন্ডা ক্লাচ রিকভারি বাজেট ডিলারের একাউন্ট থেকে ডিসকাউন্ট হবে?')}
                      disabled={typingState}
                      className="px-2.5 py-1.5 text-[10px] font-sans font-semibold border border-black/10 bg-[#fbfbfb] hover:bg-black hover:text-white hover:border-black transition disabled:opacity-55 cursor-pointer text-slate-800 text-left"
                    >
                      ⚠️ Escalated Gearbox Leak
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendDisputeMessage(lang === 'en' ? 'Request official discount voucher code for repairing clutch' : 'ডুয়াল ক্লাচ মেরামত করতে ডিসকাউন্টের আবেদন পেশ করতে চাই')}
                      disabled={typingState}
                      className="px-2.5 py-1.5 text-[10px] font-sans font-semibold border border-black/10 bg-[#fbfbfb] hover:bg-black hover:text-white hover:border-black transition disabled:opacity-55 cursor-pointer text-slate-800 text-left"
                    >
                      💸 Repair Support Voucher
                    </button>
                  </>
                )}
              </div>

              {/* Text Area Form send */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendDisputeMessage();
                }}
                className="p-4 border-t border-black/10 bg-white flex gap-2 items-center"
              >
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  disabled={typingState}
                  placeholder={
                    lang === 'en' 
                      ? 'Type comment or counter inspection logs...' 
                      : 'আপনার মন্তব্য বা আপিল আবেদনটি লিখুন...'
                  }
                  className="flex-1 bg-[#fbfbfb] text-slate-900 border border-black/10 rounded-none px-4 py-3 text-xs w-full focus:outline-none focus:border-black font-serif disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!newMessageText.trim() || typingState}
                  className="bg-black text-white hover:bg-rose-700 hover:border-rose-700 transition px-4 py-3 border border-black rounded-none flex items-center justify-center disabled:opacity-30 disabled:bg-gray-200 disabled:border-gray-200 cursor-pointer text-xs font-sans font-bold uppercase tracking-wider"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
