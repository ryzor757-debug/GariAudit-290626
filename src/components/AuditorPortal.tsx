/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TRANSLATIONS, CAR_INSPECTION_TEMPLATE } from '../data';
import { Gig } from '../types';
import { 
  Smartphone, 
  LayoutGrid, 
  CheckSquare, 
  Camera, 
  WifiOff, 
  MapPin, 
  HardDrive, 
  ShieldCheck, 
  Wifi,
  Coins,
  History,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  QrCode,
  Shield,
  Clock,
  BadgeAlert,
  Search,
  CheckCircle2,
  ChevronRight,
  Database,
  Lock,
  ChevronUp
} from 'lucide-react';

interface AuditorPortalProps {
  lang: 'en' | 'bn';
  gigs: Gig[];
  onClaimGig: (gigId: string) => void;
  onSubmitAudit: (gigId: string, answers: any) => void;
  onPushLog?: (type: 'API_REQUEST' | 'API_RESPONSE' | 'SQL_STATEMENT' | 'HEX_PORT', title: string, code: string) => void;
}

export default function AuditorPortal({ lang, gigs, onClaimGig, onSubmitAudit, onPushLog }: AuditorPortalProps) {
  const text = TRANSLATIONS[lang];

  // Primary Subtab Navigation within the Auditor Portal
  const [subTab, setSubTab] = useState<'active' | 'earnings' | 'training' | 'badge'>('active');

  // Network offline state simulation
  const [isOffline, setIsOffline] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<number>(0);

  // Active Audit workflow states
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, number>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Earnings subtab states
  const [cashoutAmount, setCashoutAmount] = useState<string>('35500');
  const [cashoutWallet, setCashoutWallet] = useState<string>('01819283746');
  const [cashoutGateway, setCashoutGateway] = useState<'BKASH' | 'NAGAD' | 'ROCKET'>('BKASH');
  const [cashoutStatus, setCashoutStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');
  const [cashoutTxId, setCashoutTxId] = useState<string>('');
  const [hoveredEarningsBar, setHoveredEarningsBar] = useState<number | null>(null);

  // Quiz subtab states
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userRank, setUserRank] = useState<'Level 2 PRO' | 'Level 3 Master Specialist'>('Level 2 PRO');

  // Badge subtab states
  const [customInspectorName, setCustomInspectorName] = useState<string>('Kamrul Ahsan Bhuiyan');
  const [customDeviceDetails, setCustomDeviceDetails] = useState<string>('Autel Maxisys Elite + Digital Elcometer FNF');
  const [verifierPopupOpen, setVerifierPopupOpen] = useState(false);

  const postedGigs = gigs.filter(g => g.status === 'POSTED');
  const claimedJob = gigs.find(g => g.id === activeJobId || (g.status === 'ACCEPTED' || g.status === 'IN_PROGRESS'));

  // Custom static earnings timeseries data
  const weeklyEarningsData = [
    { label: 'Week 1', amount: 8000, inspections: 2 },
    { label: 'Week 2', amount: 15000, inspections: 3 },
    { label: 'Week 3', amount: 5000, inspections: 1 },
    { label: 'Week 4', amount: 12000, inspections: 2 },
    { label: 'Week 5', amount: 7500, inspections: 1 },
    { label: 'Week 6', amount: 35500, inspections: 7 }, // Current active Week
  ];

  const handleClaim = (gigId: string) => {
    onClaimGig(gigId);
    setActiveJobId(gigId);
  };

  const handleValueChange = (key: string, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSimulatePhotoUpload = (key: string, reqPhotos: number) => {
    setUploadProgress(prev => ({ ...prev, [key]: 10 }));
    let progress = 10;
    const interval = setInterval(() => {
      progress += 25;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadedPhotos(prev => ({
          ...prev,
          ...prev,
          [key]: Math.min((prev[key] || 0) + 1, reqPhotos)
        }));
        if (isOffline) {
          setOfflineQueue(q => q + 1);
        }
      }
      setUploadProgress(prev => ({ ...prev, [key]: progress }));
    }, 200);
  };

  const handleAuditSubmit = () => {
    if (!claimedJob) return;

    if (isOffline) {
      alert(lang === 'en' 
        ? 'Device is currently OFFLINE. Audit saved locally in IndexedDB queue. It will sync automatically upon restoration of internet connection.' 
        : 'মোবাইলটি বর্তমানে অফলাইন মুডে আছে। অডিট ডাটাটি মোবাইলের লোকাল স্টোরেজে সংরক্ষণ করা হয়েছে। ইন্টারনেট ফিরে আসলে স্বয়ংক্রিয়ভাবে সিঙ্ক হবে।'
      );
      setAnswers({});
      setUploadedPhotos({});
      setUploadProgress({});
      setActiveJobId(null);
      return;
    }

    onSubmitAudit(claimedJob.id, answers);
    setAnswers({});
    setUploadedPhotos({});
    setUploadProgress({});
    setActiveJobId(null);
    alert(lang === 'en'
      ? 'Audit submitted successfully! Axum backend has securely locked the report signatures.'
      : 'ইন্সপেকশন সফলভাবে সাবমিট করা হয়েছে! অ্যাডমিন প্যানেলে রিভিউ সম্পন্ন হওয়ার পর ক্রেতা এটি দেখতে পাবেন।'
    );
  };

  const handleCashoutRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(cashoutAmount);
    if (isNaN(amount) || amount <= 0 || amount > 35500) {
      alert(lang === 'en' ? 'Please enter a valid amount within your limits.' : 'দয়া করে আপনার সীমার মধ্যে সঠিক অংক প্রবেশ করান।');
      return;
    }

    setCashoutStatus('PROCESSING');
    
    // Simulate API Delay
    setTimeout(() => {
      const generatedTxId = 'TXN_' + Math.floor(Math.random() * 9000000 + 1000000);
      setCashoutTxId(generatedTxId);
      setCashoutStatus('SUCCESS');

      // Dispatch DevLog entries to the top framework state
      if (onPushLog) {
        onPushLog(
          'API_REQUEST',
          `POST /auditor/disburse-funds (Direct Mobile Wallet Payout)`,
          `HEADERS:
  Authorization: Bearer jwt_auditor_7890
  Content-Type: application/json

BODY:
{
  "auditor_id": "usr_auditor_7890",
  "disbursal_amount_bdt": ${amount}.00,
  "gateway_carrier": "${cashoutGateway}",
  "destination_wallet_no": "${cashoutWallet}"
}`
        );

        onPushLog(
          'SQL_STATEMENT',
          'Execute Ledger Write & Auditor Escrow Balance Deduction',
          `BEGIN;

-- Check available verified escrow balances
SELECT verified_balance_bdt FROM auditor_ledger 
WHERE auditor_id = 'usr_auditor_7890' FOR UPDATE;

-- Update balance, deducting requested amount
UPDATE auditor_ledger 
SET verified_balance_bdt = verified_balance_bdt - ${amount}.00,
    withdrawn_to_date_bdt = withdrawn_to_date_bdt + ${amount}.00
WHERE auditor_id = 'usr_auditor_7890';

-- Insert transaction payout history logs
INSERT INTO wallet_payout_history (id, auditor_id, amount_bdt, gateway, phone_no, status, reference_txid)
VALUES ('pay_${Math.random().toString(36).substring(4)}', 'usr_auditor_7890', ${amount}.00, '${cashoutGateway}', '${cashoutWallet}', 'DISBURSED', '${generatedTxId}');

COMMIT;`
        );
      }
    }, 1500);
  };

  // Diagnostic Quiz Questions
  const quizQuestions = [
    {
      id: 'q1',
      question: lang === 'en'
        ? "1. If the showroom JDM vehicle dashboard displays 52,000 km but you suspect odometer rollback, which OBD2 memory region is authoritative for true mileage verifications?"
        : "১. শো-রুমের গাড়ির ড্যাশবোর্ডে ৫২,০০০ কিমি দেখাচ্ছে কিন্তু আপনার যদি মনে হয় ওডোমিটার কমানো হয়েছে, তবে সঠিক রিডিং পেতে ওবিডি২ এর কোন মেমোরি দেখা আবশ্যক?",
      options: [
        { key: 'A', text: "ECU volatile trip-log A/B memory cache buffers" },
        { key: 'B', text: "Combination Meter EPROM chip or SRS deployment memory log registry" },
        { key: 'C', text: "Direct backup battery-assisted dash radio clock triggers" }
      ],
      correctKey: 'B',
      explanationEn: "The combination meter EPROM integrates permanent physical hardcode logs. SRS airbag collision deploy registries also stamp mileage securely inside the non-volatile memory.",
      explanationBn: "কম্বিনেশন মিটার ইপিআরওএম এবং এসআরএস এয়ারব্যাগ ডেপ্লয়মেন্ট মেমোরিতে গাড়ি চলার প্রকৃত কিমি স্থায়ীভাবে সংরক্ষিত থাকে।"
    },
    {
      id: 'q2',
      question: lang === 'en'
        ? "2. A JDM Toyota Hybrid displays an averaged State of Health (SoH) of 75%. However, active diagnostic testing displays Block 4 voltage dropping 180mV below other blocks under acceleration. What's the diagnosis?"
        : "২. টয়োটা হাইব্রিড গাড়ির ব্যাটারির সার্বিক স্বাস্থ্য (SoH) ৭৫% দেখাচ্ছে। তবে এক্সিলারেট করার সময় ৪ নম্বর ব্লকের ভোল্টেজ বাকি ব্লকের চেয়ে ১৮০mV কমে যাচ্ছে। সঠিক ত্রুটি কোনটি?",
      options: [
        { key: 'A', text: "The battery pack is general-wear healthy. Disregard sensor noise." },
        { key: 'B', text: "Severe cell module decay inside Block 4. High fire risk; requires individual module block replace." },
        { key: 'C', text: "OBD2 communications error with the high-voltage master inverter gateway." }
      ],
      correctKey: 'B',
      explanationEn: "Voltage delta exceeding 100mV under active vehicle throttle spikes confirms terminal wear or failing modules inside that specific block. Replacing only the bad block saves lakhs for buyers.",
      explanationBn: "যেকোনো ব্লকের ভোল্টেজ ডেভিয়েশন ১০০mV এর ওপরে গেলে বুঝবেন সেই ব্লকের সেলগুলো অভ্যন্তরীণভাবে নষ্ট হয়ে গিয়েছে।"
    },
    {
      id: 'q3',
      question: lang === 'en'
        ? "3. Measuring panel paint depth on a reconditioned Toyota Premio with a digital Elcometer gauge outputs 430 microns on the left-side fender, but 90 microns on the roof. What does this indicate?"
        : "৩. রিকন্ডিশন্ড টয়োটা প্রিমিয়োর বাম পাশের ফেন্ডারে ৪৩০ মাইক্রন পেইন্ট ডেপথ পাওয়া গেল, কিন্তু ছাঁদে মাত্র ৯০ মাইক্রন। এটি কী নির্দেশ করে?",
      options: [
        { key: 'A', text: "Standard premium Japanese dual-stage metallic factory varnish protection coding." },
        { key: 'B', text: "High thickness body putty paint filter (Bondo) repairs applied following heavy side-panel impact." },
        { key: 'C', text: "Underbody coastal saltwater salinity protection layer applied inside Mongla port yards." }
      ],
      correctKey: 'B',
      explanationEn: "Factory vehicle paints measure around 85-140 microns. High-microns (above 300) confirm heavy aftermarket body putty fillers were applied to reform structural collision damage.",
      explanationBn: "জাপানি গাড়ির ফ্যাক্টরি পেইন্ট সাধারণ অবস্থায় ৮০ থেকে ১৪০ মাইক্রন থাকে। ৩০০ এর চেয়ে বেশি মাইক্রন পাওয়া গেলে বুঝতে হবে সেখানে পুডিং বসিয়ে স্প্রে পেইন্ট করা হয়েছে।"
    }
  ];

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correctKey) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score === 3) {
      setUserRank('Level 3 Master Specialist');
      if (onPushLog) {
        onPushLog(
          'HEX_PORT',
          'Verify Auditor Technical Uplink & Promote Badge Tier',
          `// Inbound adapter interface triggers mechanic credential level-up
let mut auditor = auditor_repo.find_by_id("usr_auditor_7890").await?;
auditor.upgrade_tier(CertificationLevel::Level3MasterSpecialist {
    passed_exam_timestamp: "2026-05-29T11:45:13Z",
    exam_score: 3,
    total_questions: 3
});
auditor_repo.save(auditor).await?;`
        );
      }
    }
  };

  return (
    <div className="bg-[#fbfbfb] text-[#1a1a1a] min-h-screen py-12 antialiased font-serif">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title HUD block */}
        <div className="bg-white p-8 border border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-black text-white flex items-center justify-center font-bold text-sm font-sans">
              MT
            </div>
            <div>
              <span className="inline-block bg-black text-white text-[9px] font-sans font-bold uppercase tracking-[0.2em] px-2.5 py-1">
                Gigarise Inspector Hub
              </span>
              <h1 className="text-2xl font-light text-slate-900 font-serif mt-2">{text.auditorOverview}</h1>
              <p className="text-xs text-gray-500 font-serif italic mt-0.5">
                License Rank: <span className="font-sans font-bold text-black uppercase tracking-wider text-[10px]">{userRank}</span> • Certified JDM Auditor
              </p>
            </div>
          </div>

          {/* Inline Offline/Online Mode Switcher */}
          <div className="flex items-center gap-3 bg-[#fbfbfb] p-3 border border-black/10 text-xs text-[#1a1a1a]">
            <span className="font-sans font-bold uppercase tracking-wider text-gray-400 text-[10px]">Network Status:</span>
            <button
              onClick={() => {
                setIsOffline(!isOffline);
                if (isOffline) {
                  setOfflineQueue(0);
                }
              }}
              className={`px-3 py-1.5 font-sans font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 transition cursor-pointer rounded-none border ${isOffline ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}
            >
              {isOffline ? (
                <React.Fragment>
                  <WifiOff className="h-3 w-3 animate-pulse" />
                  <span>Offline</span>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Wifi className="h-3 w-3" />
                  <span>Online Connected</span>
                </React.Fragment>
              )}
            </button>
          </div>
        </div>

        {/* Tab Subtab Navigation bar - Editorial Minimalist Style */}
        <div className="border-b border-black/10 overflow-x-auto">
          <div className="flex space-x-8 sm:space-x-12 text-xs font-sans font-bold uppercase tracking-widest min-w-[500px] mb-[-1px]">
            <button
              onClick={() => setSubTab('active')}
              className={`pb-4 border-b-2 transition duration-200 cursor-pointer ${subTab === 'active' ? 'border-black text-[11px] text-[#1a1a1a]' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              Active Audits & Jobs
            </button>
            <button
              onClick={() => setSubTab('earnings')}
              className={`pb-4 border-b-2 transition duration-200 cursor-pointer ${subTab === 'earnings' ? 'border-black text-[11px] text-[#1a1a1a]' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              Earnings Ledger & Cashouts
            </button>
            <button
              onClick={() => setSubTab('training')}
              className={`pb-4 border-b-2 transition duration-200 cursor-pointer ${subTab === 'training' ? 'border-black text-[11px] text-[#1a1a1a]' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              Training & JDM references
            </button>
            <button
              onClick={() => setSubTab('badge')}
              className={`pb-4 border-b-2 transition duration-200 cursor-pointer ${subTab === 'badge' ? 'border-black text-[11px] text-[#1a1a1a]' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              My ID Credentials
            </button>
          </div>
        </div>

        {/* CONTENT SWITCHING LAYOUT PANEL FRAMEWORKS */}

        {/* SUBTAB 1: Active Audits & Workflows Checklists */}
        {subTab === 'active' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Available Gigs lists nearby */}
            <div className="md:col-span-12 lg:col-span-5 space-y-6">
              <div className="bg-white p-6 border border-black/10">
                <h3 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-xs border-b border-black/10 pb-4 flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  <span>{text.availableGigs}</span>
                </h3>
                
                <div className="divide-y divide-black/10 mt-2">
                  {postedGigs.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 text-xs font-serif italic">
                      No open pre-purchase gigs listed right now. Users can list gigs from the Buyer Portal.
                    </div>
                  ) : (
                    postedGigs.map((entry) => (
                      <div key={entry.id} className="py-5 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">Toyota reconditioned JDM audit</h4>
                            <span className="inline-flex items-center gap-1 mt-1 text-xs text-gray-500 font-serif">
                              <MapPin className="h-3.5 w-3.5 text-black/50" />
                              {entry.locationText}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-[#1a1a1a] font-mono">৳৫,০০০</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="bg-[#fbfbfb] text-gray-600 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-none border border-black/10 uppercase">
                            CAR
                          </span>
                          <span className="bg-amber-50 text-amber-800 text-[9px] font-sans font-bold px-2.5 py-0.5 border border-amber-200 uppercase tracking-wider">
                            Safety Audit
                          </span>
                        </div>
                        <button
                          onClick={() => handleClaim(entry.id)}
                          className="w-full text-center py-2.5 border border-black bg-white text-black font-sans font-bold uppercase tracking-wider text-[10px] hover:bg-black hover:text-white transition cursor-pointer"
                        >
                          {text.claimGig}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Simulated Mobile IndexedDB Database Viewer */}
              <div className="bg-black text-white p-6 border border-black space-y-4 font-mono text-[11px] leading-relaxed">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-bold text-gray-300 flex items-center gap-1.5 uppercase font-sans text-[10px] tracking-wider">
                    <HardDrive className="h-4.5 w-4.5 text-white" />
                    IndexedDB Queue
                  </span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider">Offline Cache</span>
                </div>
                <div className="space-y-1.5 text-gray-400">
                  <p>• Sync status: {isOffline ? 'LOCAL_BUFFER' : 'SYNC_ACTIVE'}</p>
                  <p>• Unsaved state parameters: {Object.keys(answers).length} fields</p>
                  <p>• Cached image pointers: {offlineQueue} images</p>
                  <p>• Postgres client protocol: Axum Core Client</p>
                </div>
                {isOffline && (
                  <div className="bg-white/5 border border-amber-500/30 text-amber-300 p-3 text-[10px] leading-relaxed animate-pulse">
                    Device is offline. Local modifications are indexed within the offline container. No server-side writes are active until network sync is restored.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Guided Checklist Terminal */}
            <div className="md:col-span-12 lg:col-span-7 bg-white p-8 border border-black/10 space-y-8">
              <h3 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-xs border-b border-black/10 pb-4 flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                <span>{text.runningJob}</span>
              </h3>

              {claimedJob ? (
                <div className="space-y-8">
                  
                  {/* Active job brief banner */}
                  <div className="p-5 bg-[#fbfbfb] border border-black/15 text-xs space-y-2">
                    <div className="flex justify-between font-sans font-bold text-slate-950 text-xs uppercase tracking-wider">
                      <span>Toyota pre-purchase verification</span>
                      <span className="font-mono text-[#1a1a1a]">ID: {claimedJob.id.substring(0, 8)}</span>
                    </div>
                    <p className="text-gray-500 font-serif italic">Location: {claimedJob.locationText} • Status: {claimedJob.status}</p>
                  </div>

                  {/* Form Items loop */}
                  <div className="space-y-8 divide-y divide-black/10">
                    {CAR_INSPECTION_TEMPLATE.map((item, index) => {
                      const photosCount = uploadedPhotos[item.key] || 0;
                      const progress = uploadProgress[item.key] || 0;

                      return (
                        <div key={item.id} className={`pt-6 ${index === 0 ? 'pt-0' : ''} space-y-4`}>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-gray-400">
                                Section: {item.section}
                              </span>
                              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-950 mt-1">
                                {lang === 'en' ? item.label : item.labelBn}
                              </h4>
                            </div>
                            {item.isRequired && (
                              <span className="bg-rose-50 text-rose-700 text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 border border-rose-100 select-none shrink-0">
                                Required *
                              </span>
                            )}
                          </div>

                          {/* Input controls */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#fbfbfb] p-4 border border-black/10">
                            
                            {/* Left inputs */}
                            <div className="w-full sm:w-auto">
                              {item.inputType === 'BOOL' && (
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleValueChange(item.key, true)}
                                    className={`px-3 py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider border transition cursor-pointer select-none ${answers[item.key] === true ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-white text-gray-500 border-black/10'}`}
                                  >
                                    {lang === 'en' ? 'Yes (Issue Found)' : 'হ্যাঁ (ত্রুটি আছে)'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleValueChange(item.key, false)}
                                    className={`px-3 py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider border transition cursor-pointer select-none ${answers[item.key] === false ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-white text-gray-500 border-black/10'}`}
                                  >
                                    {lang === 'en' ? 'No Issues' : 'ঠিক আছে'}
                                  </button>
                                </div>
                              )}

                              {item.inputType === 'ENUM' && (
                                <select
                                  value={answers[item.key] || ''}
                                  onChange={(e) => handleValueChange(item.key, e.target.value)}
                                  className="bg-white border border-black/10 text-slate-800 font-sans font-bold uppercase tracking-wider text-[10px] px-3 py-2 focus:outline-none"
                                >
                                  <option value="">-- Choose Option --</option>
                                  {lang === 'en' 
                                    ? item.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)
                                    : item.optionsBn?.map((opt, oIdx) => <option key={opt} value={item.options?.[oIdx]}>{opt}</option>)
                                  }
                                </select>
                              )}

                              {item.inputType === 'NUMBER' && (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={answers[item.key] || ''}
                                    onChange={(e) => handleValueChange(item.key, Number(e.target.value))}
                                    placeholder="e.g. 85"
                                    className="w-20 bg-white border border-black/15 text-slate-950 px-3 py-1.5 text-xs font-mono text-center focus:outline-none"
                                  />
                                  <span className="text-gray-500 text-[10px] font-sans font-bold uppercase tracking-wider">% SOH</span>
                                </div>
                              )}
                            </div>

                            {/* Right Camera upload simulator */}
                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                              <span className="text-[10px] text-gray-500 font-mono">
                                Photo: {photosCount} / {item.requiredPhotos}
                              </span>
                              
                              <button
                                type="button"
                                onClick={() => handleSimulatePhotoUpload(item.key, item.requiredPhotos)}
                                className={`h-9 w-9 flex items-center justify-center transition border cursor-pointer ${photosCount >= item.requiredPhotos ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white hover:bg-black hover:text-white border-black text-black'}`}
                              >
                                <Camera className="h-4 w-4" />
                              </button>
                            </div>

                          </div>

                          {/* Progress Bar rendering */}
                          {progress > 0 && progress < 100 && (
                            <div className="w-full bg-black/5 h-1 rounded-none overflow-hidden">
                              <div className="bg-black h-full transition-all duration-150" style={{ width: `${progress}%` }} />
                            </div>
                          )}

                          {/* Success Check tick */}
                          {photosCount >= item.requiredPhotos && (
                            <div className="text-[10px] text-emerald-700 font-sans font-bold uppercase tracking-wider flex items-center gap-1">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span>Evidence checklist item criteria met</span>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>

                  {/* Validate Submit Action button */}
                  <button
                    type="button"
                    onClick={handleAuditSubmit}
                    className="w-full border border-black bg-black text-white font-sans font-bold uppercase tracking-[0.2em] text-xs py-4.5 hover:bg-white hover:text-black transition cursor-pointer"
                  >
                    {text.submitAudit}
                  </button>

                </div>
              ) : (
                <div className="border border-dashed border-black/20 p-12 text-center text-gray-400 text-xs font-serif italic">
                  Claim an audit gig from the left column list to start the pre-purchase vehicle inspection.
                </div>
              )}
            </div>

          </div>
        )}

        {/* SUBTAB 2: Earnings Ledger & Immediate bKash Cashout */}
        {subTab === 'earnings' && (
          <div className="space-y-8">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 border border-black/10 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-gray-400">Total Cleared Audits</span>
                  <div className="text-3xl font-light font-serif mt-2">7 Vehicles</div>
                </div>
                <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between text-xs text-gray-500 font-serif italic">
                  <span>100% QC score card</span>
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </div>
              </div>

              <div className="bg-white p-6 border border-black/10 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-gray-400">Cumulative Outflow</span>
                  <div className="text-3xl font-light font-serif mt-2">৳৩২,৫০০ BDT</div>
                </div>
                <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between text-xs text-gray-500 font-serif">
                  <span className="italic">Direct dispersed to bKash</span>
                  <Coins className="h-4 w-4 text-amber-500 animate-pulse" />
                </div>
              </div>

              <div className="bg-white p-6 border border-black/10 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-gray-400">Escrow Current Balance</span>
                  <div className="text-3xl font-light text-emerald-800 font-serif mt-2">৳৩৫,৫০০ BDT</div>
                </div>
                <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between text-xs text-amber-900 font-sans font-bold uppercase tracking-wider">
                  <span>Withdrawn Limit: ৳৩৫,৫০০</span>
                  <Clock className="h-3.5 w-3.5" />
                </div>
              </div>

            </div>

            {/* Interactive SVG Earnings Chart Card */}
            <div className="bg-white p-8 border border-black/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-4">
                <div>
                  <h3 className="font-sans font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Weekly Performance Index</span>
                  </h3>
                  <p className="text-[11px] text-gray-400 font-serif italic mt-0.5">Move cursor over columns to inspect specific weekly audit metrics</p>
                </div>
                
                {hoveredEarningsBar !== null ? (
                  <div className="p-2.5 bg-black text-white font-mono text-[10px] leading-relaxed uppercase">
                    Week {hoveredEarningsBar + 1}: <span className="font-bold text-emerald-300">৳{weeklyEarningsData[hoveredEarningsBar].amount.toLocaleString()}</span> • {weeklyEarningsData[hoveredEarningsBar].inspections} audits
                  </div>
                ) : (
                  <div className="p-2.5 bg-[#fbfbfb] border border-black/15 font-mono text-[10px] text-gray-400 uppercase">
                    Select a block to inspect
                  </div>
                )}
              </div>

              {/* Custom SVG Bar Chart */}
              <div className="relative pt-4">
                <svg className="w-full h-48 overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="170" x2="600" y2="170" stroke="#eaeaea" strokeWidth="1" />
                  <line x1="0" y1="120" x2="600" y2="120" stroke="#eaeaea" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="70" x2="600" y2="70" stroke="#eaeaea" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="20" x2="600" y2="20" stroke="#eaeaea" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Render Columns */}
                  {weeklyEarningsData.map((data, index) => {
                    const barWidth = 45;
                    const spacing = 100;
                    const xCoord = index * spacing + 40;
                    // Max amount is 35,500. Normalize high point to 150px length.
                    const heightValue = (data.amount / 35500) * 150;
                    const yCoord = 170 - heightValue;

                    return (
                      <g 
                        key={index} 
                        className="cursor-pointer group"
                        onMouseEnter={() => setHoveredEarningsBar(index)}
                        onMouseLeave={() => setHoveredEarningsBar(null)}
                      >
                        {/* Shimmer pulse glow for highest active week */}
                        {index === 5 && (
                          <rect 
                            x={xCoord - 3} 
                            y={yCoord - 3} 
                            width={barWidth + 6} 
                            height={heightValue + 3} 
                            fill="transparent"
                            stroke="#000000"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                            className="opacity-40 animate-pulse"
                          />
                        )}

                        {/* Solid Bar */}
                        <rect 
                          x={xCoord} 
                          y={yCoord} 
                          width={barWidth} 
                          height={heightValue} 
                          fill={hoveredEarningsBar === index ? '#1a1a1a' : index === 5 ? '#065f46' : '#d2d2d2'} 
                          className="transition-all duration-200"
                        />

                        {/* Text labels inside bars (only if height is big enough) */}
                        {heightValue > 30 && (
                          <text 
                            x={xCoord + barWidth / 2} 
                            y={yCoord + 20} 
                            fill="white" 
                            fontSize="8" 
                            fontWeight="bold"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            ৳{data.amount >= 1000 ? `${data.amount/1000}k` : data.amount}
                          </text>
                        )}

                        {/* Bottom Week Label */}
                        <text 
                          x={xCoord + barWidth / 2} 
                          y="188" 
                          fill={hoveredEarningsBar === index ? '#1a1a1a' : '#888888'} 
                          fontSize="9px" 
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          textAnchor="middle"
                        >
                          {data.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Split bottom section: Disbursements and interactive payout withdrawal request */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Form: Cashout Request */}
              <div className="lg:col-span-5 bg-white p-6 border border-black/10 space-y-5">
                <h3 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-xs border-b border-black/10 pb-4 flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  <span>Interactive Instant Cashout</span>
                </h3>

                {cashoutStatus === 'SUCCESS' ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-4 font-serif">
                    <div className="h-10 w-10 bg-emerald-800 text-white rounded-full flex items-center justify-center mx-auto">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div className="text-center space-y-1">
                      <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-emerald-950">Cashout Processed</h4>
                      <p className="text-xs text-emerald-800 italic">bKash wallet verification complete • Status: DISBURSED</p>
                    </div>
                    
                    <div className="bg-white/80 p-3.5 border border-emerald-100 text-[10px] font-mono leading-relaxed space-y-1">
                      <p>• Transferred to No: {cashoutWallet}</p>
                      <p>• Transferred: ৳{Number(cashoutAmount).toLocaleString()} BDT</p>
                      <p>• Gateway Reference: {cashoutGateway}</p>
                      <p>• Secure System TxID: {cashoutTxId}</p>
                    </div>

                    <p className="text-[10px] text-gray-500 text-center leading-relaxed font-sans mt-2">
                      A transactional trace has been emitted to Postgres database. Review the dev console at page bottom for terminal logs.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setCashoutStatus('IDLE');
                        setCashoutAmount('35500');
                      }}
                      className="w-full text-center py-2 border border-emerald-800 hover:bg-emerald-800 hover:text-white transition font-sans text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Process Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCashoutRequest} className="space-y-4 text-xs font-serif">
                    <p className="text-gray-500 leading-relaxed italic text-[11px]">
                      Mechanics are paid via escrow holds in trust intervals. Request immediate digital wallet payout.
                    </p>

                    <div className="space-y-1.5">
                      <label className="font-sans font-bold uppercase text-[9px] text-gray-400 tracking-wider block">1. Select payment channel</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['BKASH', 'NAGAD', 'ROCKET'] as const).map(gw => (
                          <button
                            key={gw}
                            type="button"
                            onClick={() => setCashoutGateway(gw)}
                            className={`py-2 text-[9px] font-sans font-bold uppercase border transition cursor-pointer ${cashoutGateway === gw ? 'bg-black border-black text-white' : 'bg-[#fbfbfb] border-black/10 text-gray-400'}`}
                          >
                            {gw}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-sans font-bold uppercase text-[9px] text-gray-400 tracking-wider block">2. Beneficiary Mobile No.</label>
                      <input
                        type="text"
                        required
                        value={cashoutWallet}
                        onChange={(e) => setCashoutWallet(e.target.value)}
                        placeholder="e.g. 01811223344"
                        className="w-full bg-[#fbfbfb] border border-black/15 text-[#1a1a1a] p-3 text-xs font-mono focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="font-sans font-bold uppercase text-gray-400 tracking-wider">3. Amount (BDT)</span>
                        <span className="text-emerald-800 font-sans font-bold">Max: ৳৩৫,৫০০</span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          value={cashoutAmount}
                          max="35500"
                          min="500"
                          onChange={(e) => setCashoutAmount(e.target.value)}
                          placeholder="Amount e.g. 5000"
                          className="w-full bg-[#fbfbfb] border border-black/15 text-[#1a1a1a] p-3 pl-8 text-xs font-mono focus:outline-none"
                        />
                        <span className="absolute left-3.5 top-3.5 text-gray-400 font-sans text-[10px] font-bold">৳</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={cashoutStatus === 'PROCESSING'}
                      className="w-full bg-black text-white border border-black font-sans font-bold uppercase tracking-[0.2em] text-[10px] py-4 hover:bg-white hover:text-black transition cursor-pointer"
                    >
                      {cashoutStatus === 'PROCESSING' ? 'Authorizing bKash Gateway...' : 'Initialize Secure Disbursement'}
                    </button>
                  </form>
                )}

              </div>

              {/* Right List: History ledger log */}
              <div className="lg:col-span-7 bg-white p-6 border border-black/10 space-y-5">
                <h3 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-xs border-b border-black/10 pb-4 flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span>Historical Escrow Statements</span>
                </h3>

                <div className="space-y-4">
                  
                  <div className="p-4 bg-[#fbfbfb] border border-black/5 divide-y divide-black/10 text-xs">
                    
                    <div className="py-3 flex justify-between items-start">
                      <div>
                        <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-950">Toyota Axio - Banani Audit</h4>
                        <p className="text-gray-400 font-mono text-[10px] mt-0.5">QC Cleared: Yes • Auth Sign: Axum-#94831</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold font-mono text-[#1a1a1a]">৳৫,০০০</span>
                        <span className="block text-[8px] font-sans font-bold text-emerald-800 uppercase tracking-widest mt-0.5">Ledger Released</span>
                      </div>
                    </div>

                    <div className="py-3 flex justify-between items-start">
                      <div>
                        <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-950">Toyota Allion - Mirpur Audit</h4>
                        <p className="text-gray-400 font-mono text-[10px] mt-0.5">QC Cleared: Yes • Auth Sign: Axum-#91206</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold font-mono text-[#1a1a1a]">৳৫,০০০</span>
                        <span className="block text-[8px] font-sans font-bold text-emerald-800 uppercase tracking-widest mt-0.5">Ledger Released</span>
                      </div>
                    </div>

                    <div className="py-3 flex justify-between items-start">
                      <div>
                        <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-950">Honda Vezel - Gulshan GEC</h4>
                        <p className="text-gray-400 font-mono text-[10px] mt-0.5">QC Cleared: Yes • Auth Sign: Axum-#82214</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold font-mono text-[#1a1a1a]">৳৬,৫০০</span>
                        <span className="block text-[8px] font-sans font-bold text-emerald-800 uppercase tracking-widest mt-0.5">Ledger Released</span>
                      </div>
                    </div>

                    <div className="py-3 flex justify-between items-start">
                      <div>
                        <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-950">Pre-Purchase Ev specialist - Uttara</h4>
                        <p className="text-gray-400 font-mono text-[10px] mt-0.5">QC Cleared: YES • Auth Sign: Axum-#14902</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold font-mono text-[#1a1a1a]">৳৬,৫০০</span>
                        <span className="block text-[8px] font-sans font-bold text-emerald-800 uppercase tracking-widest mt-0.5">Ledger Released</span>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

        {/* SUBTAB 3: Training & JDM References (Cheatsheet & Level-up Exam Quiz) */}
        {subTab === 'training' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Reference Cards */}
            <div className="md:col-span-12 lg:col-span-5 space-y-6">
              
              <div className="bg-white p-6 border border-black/10 space-y-6">
                <h3 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-xs border-b border-black/10 pb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>JDM Auction Sheet Integrity Guide</span>
                </h3>

                <div className="space-y-4 text-xs font-serif leading-relaxed">
                  <p className="text-gray-500 italic">
                    Importer sheets in Dhaka are frequently forged. Ensure physical checks on the following stamps:
                  </p>

                  <div className="p-4 bg-[#fbfbfb] border-l-2 border-slate-900 space-y-2">
                    <h5 className="font-sans font-bold text-slate-950 uppercase tracking-wider text-[10px]">Grade 6 & S (Highest Quality)</h5>
                    <p className="text-gray-500 text-[11px]">Brand new condition vehicle. Barely exists in second-hand showroom stocks. Treat with premium OBD2 scanner verification immediately.</p>
                  </div>

                  <div className="p-4 bg-[#fbfbfb] border-l-2 border-slate-900 space-y-2">
                    <h5 className="font-sans font-bold text-slate-950 uppercase tracking-wider text-[10px]">Grade 4.5 & 4 (Clean Standard)</h5>
                    <p className="text-gray-500 text-[11px]">Minor paint/body scuffs only. Total mileage typically below 60,000 km. Match dashboard against chassis port EPROM counters.</p>
                  </div>

                  <div className="p-4 bg-[#fbfbfb] border-l-2 border-slate-900 space-y-2">
                    <h5 className="font-sans font-bold text-slate-950 uppercase tracking-wider text-[10px]">Grade 3.5 & 3 (Repair Needed)</h5>
                    <p className="text-gray-500 text-[11px]">Altered panels or engine wear present. If broker claims 4.5 but panels display putty over 200 microns, the sheet has been falsified.</p>
                  </div>

                  <div className="p-4 bg-[#fbfbfb] border-l-2 border-rose-900 space-y-2">
                    <h5 className="font-sans font-bold text-rose-950 uppercase tracking-wider text-[10px]">Grade R & RA (Accident Salvage)</h5>
                    <p className="text-gray-500 text-[11px]">Repaired structural members. Chassis welding check is MANDATORY to confirm crumple zones are still functioning safely.</p>
                  </div>
                </div>
              </div>

              {/* Pro Mechanic Kit calibration settings */}
              <div className="bg-black text-[#fbfbfb] p-6 border border-black space-y-5 flex flex-col justify-between">
                <div>
                  <h4 className="font-mono text-gray-300 text-xs uppercase font-bold border-b border-white/5 pb-3">Automotive Scanner Specs</h4>
                  <div className="space-y-2 mt-4 font-mono text-[10px] leading-relaxed text-gray-400">
                    <p>• Calibration Standard: J983-SAE-OBD</p>
                    <p>• Interface: ISO 15765-4 CAN (11bit ID, 500 Kbaud)</p>
                    <p>• Voltage Tolerances: 8.5V min to 16.5V max</p>
                    <p>• Recommended App: GariAudit HexCore Client V1.2</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white/5 border border-white/10 text-gray-400 text-[10px] italic">
                  Calibrate your paint gauge onto zero-plate aluminum and steel reference disks before starting showroom inspection.
                </div>
              </div>

            </div>

            {/* Right Column: Quiz Simulator to upgrade Tier Rank to Level 3 */}
            <div className="md:col-span-12 lg:col-span-7 bg-white p-8 border border-black/10 space-y-6">
              <div className="flex justify-between items-start border-b border-black/10 pb-4 flex-wrap gap-2">
                <div>
                  <h3 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-xs flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>Technical Certification Elevation</span>
                  </h3>
                  <p className="text-[11px] text-gray-400 font-serif italic mt-0.5">Complete this theoretical evaluation to qualify for Level 3 Master Specialist gig fees</p>
                </div>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 shrink-0">
                  Level UP Requirement
                </span>
              </div>

              {quizSubmitted ? (
                <div className="p-8 border border-black/15 bg-[#fbfbfb] text-center space-y-5 font-serif">
                  <div className="h-16 w-16 bg-black text-white hover:bg-emerald-800 hover:text-white transition rounded-full flex items-center justify-center mx-auto text-xl font-bold font-mono">
                    {quizScore}/3
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-950">Quiz evaluation complete</h4>
                    <p className="text-xs text-gray-500 italic">Score: {quizScore === 3 ? '100% PERFECT SCORE' : 'Review materials and try again'}</p>
                  </div>

                  {quizScore === 3 ? (
                    <div className="space-y-4 max-w-md mx-auto">
                      <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs rounded-none">
                        <p className="font-sans font-bold uppercase tracking-wide">🏆 Badge Upgraded successfully! 🏆</p>
                        <p className="mt-1 font-serif leading-relaxed italic">
                          You have been promoted to Level 3 Master Specialist! GariAudit system has updated your certificates across PostgreSQL security tables.
                        </p>
                      </div>

                      {/* Display correct answers debug */}
                      <div className="text-left space-y-3.5 bg-white p-4 border border-black/10 font-mono text-[10px] leading-relaxed">
                        <p className="font-sans font-bold uppercase tracking-wider text-[9px] text-[#1a1a1a] border-b border-black/5 pb-1">Verified Expert Answers:</p>
                        <p>✓ Q1: Combination meter EPROM registers absolute mileage hardcode counters.</p>
                        <p>✓ Q2: Delta fluctuations exceeding 100mV on individual blocks reveal battery cell death.</p>
                        <p>✓ Q3: Depth measurements over 300 microns map heavy crash repairs.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-950 text-xs">
                      <p className="font-sans font-bold uppercase">Keep learning</p>
                      <p className="font-serif leading-relaxed mt-1 italic">
                        You need to answer 3 out of 3 questions correctly to achieve Level 3 rank elevation. Read the cheat sheets to review your diagnostic skills.
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                      setQuizScore(0);
                    }}
                    className="inline-flex items-center gap-1.5 border border-black px-6 py-2.5 bg-white font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a] hover:bg-black hover:text-white transition cursor-pointer"
                  >
                    Retake Assessment
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuizSubmit} className="space-y-8">
                  {quizQuestions.map((q) => (
                    <div key={q.id} className="space-y-3">
                      <h4 className="font-sans font-bold text-xs leading-relaxed uppercase tracking-wide text-slate-900 bg-[#fbfbfb] p-3 border border-black/5 border-l-2 border-l-black">
                        {q.question}
                      </h4>
                      <div className="space-y-2 pl-2">
                        {q.options.map(opt => (
                          <label 
                            key={opt.key} 
                            className={`flex items-start gap-3 p-3 border transition cursor-pointer text-xs select-none ${quizAnswers[q.id] === opt.key ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-black/10 hover:border-black/25'}`}
                          >
                            <input
                              type="radio"
                              required
                              name={q.id}
                              value={opt.key}
                              checked={quizAnswers[q.id] === opt.key}
                              onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt.key }))}
                              className="sr-only"
                            />
                            <span className="font-mono font-bold">{opt.key}.</span>
                            <span>{opt.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    type="submit"
                    className="w-full text-center py-4 bg-black text-white border border-black font-sans font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition cursor-pointer"
                  >
                    Lock Test answers & Submit
                  </button>
                </form>
              )}

            </div>

          </div>
        )}

        {/* SUBTAB 4: Digital Credentials ID Card printable & Verifiable QR */}
        {subTab === 'badge' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start justify-center">
            
            {/* Left controls: customize certificate presentation */}
            <div className="lg:col-span-5 bg-white p-6 border border-black/10 space-y-5">
              <h3 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-xs border-b border-black/10 pb-4 flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>Certificate Customizer</span>
              </h3>

              <div className="space-y-4 text-xs font-serif">
                <p className="text-gray-500 leading-relaxed italic text-[11px]">
                  Adjust how your name and equipment calibrations render on the secure printable wallet card during inspections.
                </p>

                <div className="space-y-1.5">
                  <label className="font-sans font-bold uppercase text-[9px] text-gray-400 tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    value={customInspectorName}
                    onChange={(e) => setCustomInspectorName(e.target.value)}
                    placeholder="Inspector name"
                    className="w-full bg-[#fbfbfb] border border-black/15 text-[#1a1a1a] p-3 text-xs font-serif focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-sans font-bold uppercase text-[9px] text-gray-400 tracking-wider block">Calibrated Equipment Registers</label>
                  <input
                    type="text"
                    value={customDeviceDetails}
                    onChange={(e) => setCustomDeviceDetails(e.target.value)}
                    placeholder="Diagnostics gear"
                    className="w-full bg-[#fbfbfb] border border-black/15 text-[#1a1a1a] p-3 text-xs font-serif focus:outline-none"
                  />
                </div>

                <div className="p-4 bg-[#fbfbfb] border border-black/10 text-gray-500 text-[10px] leading-relaxed space-y-1">
                  <p className="font-sans font-bold uppercase text-slate-800 tracking-wider text-[9px]">Card Verification Hash:</p>
                  <p className="font-mono break-all text-gray-400">SHA256: 82f1b4c3e8e2e92a11b6dcf42f019f2a0339ab3ebd1b0664e</p>
                </div>
              </div>
            </div>

            {/* Right Column: Beautiful Physical ID Badge Graphic Card */}
            <div className="lg:col-span-7 flex flex-col items-center space-y-6">
              
              {/* Virtual Badge Container */}
              <div className="relative w-full max-w-sm bg-white p-7 border-2 border-black space-y-6 shadow-md select-none">
                
                {/* ID Header card */}
                <div className="flex justify-between items-start border-b border-black/10 pb-4">
                  <div className="space-y-1 text-left">
                    <span className="inline-block bg-black text-white text-[7px] font-sans font-extrabold uppercase tracking-[0.25em] px-2 py-0.5">
                      GariAudit Central force
                    </span>
                    <h2 className="text-base font-light font-serif text-slate-900 tracking-wider">Field inspector</h2>
                  </div>
                  <div className="h-7 w-7 bg-black text-white flex items-center justify-center font-bold text-[10px] font-sans">
                    GA
                  </div>
                </div>

                {/* Body details: Monogram + Texts */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  
                  {/* Photo Profile monogram frame */}
                  <div className="col-span-4 bg-gray-50 h-24 border border-black/15 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="text-xs text-center leading-tight">
                      <div className="text-gray-300 font-extrabold text-3xl font-sans uppercase">MECH</div>
                      <span className="text-[7px] font-bold text-gray-400 font-sans tracking-tight">LEVEL 2 VERIFIED</span>
                    </div>
                    {/* Badge seal accent */}
                    <div className="absolute bottom-0 right-0 h-4 w-4 bg-emerald-800 text-white flex items-center justify-center">
                      <ShieldCheck className="h-2.5 w-2.5" />
                    </div>
                  </div>

                  {/* Inspector Metadata table */}
                  <div className="col-span-8 font-serif leading-relaxed text-[11px] text-left space-y-1">
                    <label className="font-sans font-bold text-[8px] uppercase tracking-wider text-gray-400 block">Inspector Name</label>
                    <div className="text-sm font-bold text-slate-950 font-sans uppercase tracking-tight">{customInspectorName}</div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1.5">
                      <div>
                        <label className="font-sans font-semibold text-[7px] uppercase tracking-wider text-gray-400 block">Credential ID</label>
                        <span className="font-mono text-[9px] font-bold">#GA-7890</span>
                      </div>
                      <div>
                        <label className="font-sans font-semibold text-[7px] uppercase tracking-wider text-gray-400 block">Security Grade</label>
                        <span className="text-[9px] font-sans uppercase font-bold text-emerald-800">{userRank.split(' ')[0] === 'Level' ? userRank : 'PRO 2'}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Sub features table: registered equipment list */}
                <div className="bg-[#fbfbfb] p-3 text-[10px] border border-black/5 text-left leading-relaxed font-serif text-gray-500">
                  <span className="font-sans font-bold text-[8px] uppercase tracking-wider text-[#1a1a1a] block mb-1">Calibrated Equipment Registers:</span>
                  <p className="italic">"{customDeviceDetails}"</p>
                </div>

                {/* Card footer: customized QR representation and direct validation seal */}
                <div className="flex justify-between items-center border-t border-black/5 pt-4">
                  <div className="text-left font-serif text-[10px] text-gray-400">
                    <p>Issued: May 2026</p>
                    <p>Expires: May 2027</p>
                  </div>
                  
                  {/* Styled HTML QR code grid block */}
                  <div 
                    onClick={() => setVerifierPopupOpen(true)}
                    className="h-10 w-10 border border-black bg-black p-0.5 flex flex-col justify-between shrink-0 cursor-pointer hover:opacity-85 transition"
                    title="Click to scan/verify"
                  >
                    <div className="flex justify-between h-4">
                      <div className="w-4 h-4 bg-white border border-black" />
                      <div className="w-1.5 h-4 bg-white" />
                      <div className="w-4 h-4 bg-white border border-black" />
                    </div>
                    <div className="flex justify-between h-1.5">
                      <div className="w-4 h-1.5 bg-white" />
                      <div className="w-4 h-1.5 bg-white" />
                    </div>
                    <div className="flex justify-between h-4">
                      <div className="w-4 h-4 bg-white border border-black" />
                      <div className="w-1.5 h-4 bg-white" />
                      <div className="w-4 h-4 bg-white" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Digital Proof popup selector mock */}
              {verifierPopupOpen && (
                <div className="p-4 bg-[#fbfbfb] border border-black text-left text-xs space-y-3 font-serif max-w-sm">
                  <div className="flex justify-between items-center text-slate-950 font-sans font-bold uppercase tracking-wider text-[10px]">
                    <span className="flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-black" />
                      Secure Registry Check
                    </span>
                    <button 
                      onClick={() => setVerifierPopupOpen(false)}
                      className="text-gray-400 hover:text-black font-normal cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-500 italic leading-relaxed text-[10px]">
                    This QR references a cryptographic block signature. In the real system, showroom owners scan this to authenticate the inspector's level.
                  </p>
                  <div className="p-2.5 bg-white border border-black/10 font-mono text-[9px] leading-relaxed select-all">
                    ID_HASH: f9a20d_7890
                    VERIFIED_STAMP: TRUE
                    JURISDICTION: DHAKA_METRO
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2.5 px-6 py-2.5 border border-black bg-white text-[#1a1a1a] font-sans font-bold uppercase tracking-wider text-xs hover:bg-black hover:text-white transition cursor-pointer"
              >
                Print Physical Pocket Card
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
