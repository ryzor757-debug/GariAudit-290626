/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TRANSLATIONS } from '../data';
import { 
  ShieldCheck, 
  UserCheck, 
  AlertTriangle, 
  Cpu, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  BarChart3, 
  Landmark, 
  Users, 
  TrendingUp, 
  Compass, 
  Award, 
  MessageSquare, 
  FileText, 
  ChevronRight, 
  MapPin, 
  BadgeCheck, 
  Lightbulb 
} from 'lucide-react';

interface LandingPageProps {
  lang: 'en' | 'bn';
  onNavigate: (tab: 'buyer' | 'auditor' | 'admin') => void;
  gigsCount: number;
}

export default function LandingPage({ lang, onNavigate, gigsCount }: LandingPageProps) {
  const text = TRANSLATIONS[lang];

  return (
    <div className="bg-[#fbfbfb] text-[#1a1a1a] transition-colors duration-200 font-serif">
      
      {/* 1. HERO BLOCK SECTION & INITIAL CTA */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24 border-b border-black/10">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-14 items-start">
            
            <div className="sm:text-center md:mx-auto lg:col-span-7 lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 border border-black/15 bg-[#fbfbfb] px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-[#1a1a1a] antialiased">
                <Sparkles className="h-3 w-3 text-rose-600 animate-pulse" />
                <span>
                  {lang === 'en' ? 'PREMIUM VEHICLE AUDITING IN BANGLADESH' : 'বাংলাদেশ প্রথম প্রিমিয়াম মোটর গাড়ি নিরীক্ষা প্ল্যাটফর্ম'}
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-light leading-[0.95] tracking-tighter text-[#1a1a1a]">
                {lang === 'en' ? (
                  <>
                    Integrity <br/>in every <br/>
                    <span className="italic font-normal text-rose-600">engine.</span>
                  </>
                ) : (
                  <>
                    প্রতিটি গাড়ির <br/>সুরক্ষায় <br/>
                    <span className="italic font-normal text-rose-600">নিখুঁত প্রযুক্তি।</span>
                  </>
                )}
              </h1>
              
              <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed max-w-xl font-serif">
                {text.heroDesc}
              </p>

              {/* Action Buttons (1. CTA buttons for Buyers & Mechanical Partners) */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  id="hero-cta-buyer"
                  onClick={() => onNavigate('buyer')}
                  className="inline-flex items-center justify-center border border-black bg-black text-white px-8 py-4 text-xs font-bold font-sans uppercase tracking-[0.2em] hover:bg-rose-700 hover:border-rose-700 transition-colors cursor-pointer text-center group gap-2 shadow-sm"
                >
                  <span>{text.ctaBook}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  id="hero-cta-auditor"
                  onClick={() => onNavigate('auditor')}
                  className="inline-flex items-center justify-center border border-black bg-white text-black px-8 py-4 text-xs font-bold font-sans uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors cursor-pointer text-center"
                >
                  {text.ctaJoin}
                </button>
              </div>

              {/* Local Statistics */}
              <div className="pt-8 border-t border-black/10 grid grid-cols-3 gap-4 sm:gap-6 text-center lg:text-left">
                <div id="stat-active-gigs" className="border-r border-black/10 pr-4 last:border-0">
                  <dt className="text-3xl md:text-4xl font-light text-[#1a1a1a] font-serif">{14 + gigsCount}</dt>
                  <dd className="mt-2 text-[10px] font-sans font-extrabold text-gray-500 uppercase tracking-widest leading-snug">{text.activeGigsCount}</dd>
                </div>
                <div id="stat-verified-inspectors" className="border-r border-black/10 pr-4 last:border-0">
                  <dt className="text-3xl md:text-4xl font-light text-[#1a1a1a] font-serif">{lang === 'en' ? "120+" : "১২০+"}</dt>
                  <dd className="mt-2 text-[10px] font-sans font-extrabold text-gray-500 uppercase tracking-widest leading-snug">{text.inspectorsVerified}</dd>
                </div>
                <div id="stat-total-audited">
                  <dt className="text-3xl md:text-4xl font-light text-rose-600 font-serif">{lang === 'en' ? "4,980+" : "৪,৯৮০+"}</dt>
                  <dd className="mt-2 text-[10px] font-sans font-extrabold text-gray-500 uppercase tracking-widest leading-snug">{text.carsAudited}</dd>
                </div>
              </div>
            </div>

            {/* Illustrative Card UI Preview */}
            <div className="mt-12 sm:mx-auto lg:mt-0 lg:col-span-5 w-full max-w-md bg-white border border-black/10 p-8 shadow-md" id="landing-hero-card-preview">
              <div className="flex justify-between items-center pb-5 border-b border-black/10 mb-6">
                <div>
                  <h4 className="font-bold text-base font-sans uppercase tracking-wider text-[#1a1a1a]">Toyota Premio FEX</h4>
                  <p className="text-[11px] text-gray-500 font-mono tracking-tight mt-1">Chassis: NZT260-845211</p>
                </div>
                <div className="flex gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse self-center"></span>
                  <span className="text-[10px] font-sans uppercase tracking-widest font-bold text-emerald-800">Verified JDM</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[11px] uppercase tracking-wider font-sans font-bold text-gray-500 mb-2">
                    <span>CR Quality Metrics Score</span>
                    <span className="font-mono text-[#1a1a1a]">82/100 (B2 Grade)</span>
                  </div>
                  <div className="w-full bg-[#f3f3f3] h-1.5 rounded-none overflow-hidden">
                    <div className="bg-rose-600 h-full" style={{ width: '82%' }} />
                  </div>
                </div>

                <div className="space-y-4 text-xs font-serif text-gray-700">
                  <div className="flex items-start gap-3 border-b border-black/5 pb-3">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {lang === 'en' 
                        ? 'No structural weld markers detected in main chassis beam.' 
                        : 'প্রধান চ্যাসিস বিমে কোনো ঝালাই বা জোড়াতালি পাওয়া যায়নি।'}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 border-b border-black/5 pb-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      {lang === 'en'
                        ? 'Odometer mileage discrepancy: altered from 142k km to 54k km.'
                        : 'ওডোমিটার কারচুপি সনাক্ত: ১৪২,০০০ কিমি থেকে ৫৪,০০০ কিমিতে রিসেট করা।'}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {lang === 'en'
                        ? 'OBD2 diagnostic checks logged with zero active warning codes.'
                        : 'বিপদ নিরসনমূলক ওবিডি স্ক্যানে কোনো জটিল ট্রাবল কোড পাওয়া যায়নি।'}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/50 border border-amber-200 text-[11px] text-[#1a1a1a] font-sans tracking-wide leading-relaxed">
                  <span className="font-bold uppercase tracking-wider text-amber-800 block mb-1">AUTOMATED AUDIT RESULT:</span>
                  {lang === 'en'
                    ? 'Caution: Auction grade discrepancy detected. Double mechanical confirmation active.'
                    : 'সতর্কতা: জাপানি নিলাম শীটের জালিয়াতি চিহ্নিত হয়েছে। নিরাপদ ক্রয় নিশ্চিতে পুনরায় পরীক্ষা করুন।'}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-black/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>Dhaka Division - Baridhara Hub</span>
                <span onClick={() => onNavigate('buyer')} className="text-rose-600 font-sans font-bold uppercase tracking-wider hover:opacity-50 transition cursor-pointer">
                  {lang === 'en' ? 'Explore Portal →' : 'পোর্টাল দেখুন →'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SUMMARY OF EVERY MAJOR FEATURE & CAPABILITY */}
      <section className="py-16 sm:py-24 bg-white border-b border-black/10" id="feature-summaries">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-rose-600 font-sans font-bold">SYSTEM MAP</p>
            <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a] tracking-tight font-serif">
              {lang === 'en' ? 'Comprehensive Operational Suite' : 'অডিটিং ফিচারের বিস্তারিত রূপরেখা'}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-xs sm:text-sm font-serif">
              {lang === 'en' 
                ? 'Discover our multi-module technical architecture, designed to safeguard both buyers and automotive professionals.'
                : 'আমাদের বহুমুখী এবং সমন্বিত পোর্টাল সিস্টেমটি ক্রেতা এবং প্রফেশনাল মেকানিক সবার নিরাপত্তা নিশ্চিত করতে প্রস্তুত।'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Buyer Portal Feature */}
            <div className="bg-[#fbfbfb] border border-black/5 p-8 flex flex-col justify-between" id="feat-buyer">
              <div className="space-y-4">
                <div className="h-10 w-10 bg-black text-white flex items-center justify-center text-xs font-sans font-bold">
                  B
                </div>
                <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-slate-900">
                  {lang === 'en' ? '1. Buyer Portal gateway' : '১. ক্রেতা ড্যাশবোর্ড গেটওয়ে'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-serif leading-relaxed">
                  {lang === 'en'
                    ? 'Book instant inspections, track active roadside mechanic coordinates, check calculations with the JDM Import Tariff tool, and access verified reports.'
                    : 'সহজে বুকিং করুন, রাস্তায় থাকা মেকানিকের জিপিএস ট্রাক করুন, জেডিএম ইমপোর্ট ট্যাক্স ক্যালকুলেটর ব্যবহার করুন এবং ডিজিটাল ভেরিফাইড রিপোর্ট ডাউনলোড করুন।'}
                </p>
              </div>
              <button onClick={() => onNavigate('buyer')} className="mt-6 text-rose-600 hover:text-black font-sans font-bold uppercase tracking-wider text-[11px] text-left flex items-center gap-1">
                {lang === 'en' ? 'Enter Portal' : 'প্রবেশ করুন'} <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Auditor Portal Feature */}
            <div className="bg-[#fbfbfb] border border-black/5 p-8 flex flex-col justify-between" id="feat-auditor">
              <div className="space-y-4">
                <div className="h-10 w-10 bg-black text-white flex items-center justify-center text-xs font-sans font-bold">
                  A
                </div>
                <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-slate-900">
                  {lang === 'en' ? '2. Auditor gig dashboard' : '২. মেকানিক গিগ ড্যাশবোর্ড'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-serif leading-relaxed">
                  {lang === 'en'
                    ? 'Qualified freelance automotive technicians can claim localized jobs, run multi-point structural diagnostics, upload real logs, and track daily earnings.'
                    : 'সার্টিফাইড মোটর মেকানিকরা সরাসরি কাজ দাবি করতে পারেন, ডিজিটাল অ্যাপের মাধ্যমে চেকলিস্ট পূরণ করতে পারেন এবং তাৎক্ষণিক বকেয়া পেমেন্ট বুঝে নিতে পারেন।'}
                </p>
              </div>
              <button onClick={() => onNavigate('auditor')} className="mt-6 text-rose-600 hover:text-black font-sans font-bold uppercase tracking-wider text-[11px] text-left flex items-center gap-1">
                {lang === 'en' ? 'Take Freelance Jobs' : 'কাজ খুঁজুন'} <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Administrative Center Feature */}
            <div className="bg-[#fbfbfb] border border-black/5 p-8 flex flex-col justify-between" id="feat-admin">
              <div className="space-y-4">
                <div className="h-10 w-10 bg-black text-white flex items-center justify-center text-xs font-sans font-bold">
                  M
                </div>
                <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-slate-900">
                  {lang === 'en' ? '3. admin control panel' : '৩. এডমিন কন্ট্রোল সেন্টার'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-serif leading-relaxed">
                  {lang === 'en'
                    ? 'Enables central auditors to approve mechanic credentials, double-evaluate active reports, access diagnostic lists, and audit system-wide parameters.'
                    : 'প্রধান এডমিন ও ইঞ্জিনিয়াররা আবেদন অনুমোদন করেন, জটিল অডিট ডাবল রিভিউ করেন এবং সার্বিক সিস্টেম ও অপারেশন নিয়ন্ত্রণ করেন।'}
                </p>
              </div>
              <button onClick={() => onNavigate('admin')} className="mt-6 text-rose-600 hover:text-black font-sans font-bold uppercase tracking-wider text-[11px] text-left flex items-center gap-1">
                {lang === 'en' ? 'Authorized Access' : 'অনুমোদিত প্রবেশ'} <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Dispute Appeal Chat Feature */}
            <div className="bg-[#fbfbfb] border border-black/5 p-8 flex flex-col justify-between" id="feat-disputes">
              <div className="space-y-4">
                <div className="h-10 w-10 bg-rose-600 text-white flex items-center justify-center text-xs font-sans font-bold">
                  D
                </div>
                <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-slate-900">
                  {lang === 'en' ? '4. Live Dispute appeal desk' : '৪. লাইভ আপিল ও বিরোধ সেল'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-serif leading-relaxed">
                  {lang === 'en'
                    ? 'A dedicated chat channel for buyers to contest specific inspection findings with administrative experts and request a double physical diagnostic.'
                    : 'রিপোর্টে কোনো ভুল মনে হলে বা ডিলারের কথার সাথে পার্থক্য থাকলে সরাসরি এডমিনের সাথে লাইভ চ্যাটে বিরোধ নিষ্পত্তির সুবর্ণ সুযোগ।'}
                </p>
              </div>
              <button onClick={() => onNavigate('buyer')} className="mt-6 text-rose-600 hover:text-black font-sans font-bold uppercase tracking-wider text-[11px] text-left flex items-center gap-1">
                {lang === 'en' ? 'Open Chat Portal' : 'আপিল সেল দেখুন'} <ChevronRight className="h-3 w-3" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 3. UNIQUENESS (WHAT MAKES GARIAUDIT DIFFERENT) & 6. WHY THEY TRUST US */}
      <section className="py-16 sm:py-24 bg-[#fbfbfb] border-b border-black/10" id="uniqueness-trust">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-rose-600 font-sans font-bold">OUR DIFFERENCE</p>
            <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a] tracking-tight font-serif">
              {lang === 'en' ? 'What Makes Us Unique' : 'কেন আমরা সম্পূর্ণ ব্যতিক্রমধর্মী'}
            </h2>
            <p className="text-gray-500 font-serif text-sm">
              {lang === 'en' ? 'GariAudit is built on absolute neutrality, cryptographic locking, and physical rigor.' : 'বিজ্ঞাপন, দালালি বা স্বার্থের দ্বন্দ্ব ব্যতিরেকে সম্পূর্ণ নিরপেক্ষ বিশ্লেষণ ও কঠোর প্রযুক্তিগত নিরাপত্তা।'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white p-8 border border-black/10 space-y-5" id="unique-neutral">
              <div className="h-10 w-10 bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
                {lang === 'en' ? '100% Zero-Affiliation Independence' : '১০০% ডিলারহীন নিরপেক্ষ অভিভাবকত্ব'}
              </h4>
              <p className="text-sm font-serif text-gray-600 leading-relaxed">
                {lang === 'en'
                  ? 'We do not sell cars, represent dealers, or take commission on transactions. This eliminates conflicts of interest, giving buyers 100% reliable facts.'
                  : 'আমরা গাড়ি বিক্রি করি না, ব্রোকারদের সাথে যুক্ত নই বা কোনো কমিশন গ্রহণ করি না। আপনার পক্ষে নিরপেক্ষ থেকে কেবল আসল অবস্থা তুলে ধরাই আমাদের একমাত্র উদ্দেশ্য।'}
              </p>
            </div>

            <div className="bg-white p-8 border border-black/10 space-y-5" id="unique-blockchain">
              <div className="h-10 w-10 bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
                {lang === 'en' ? 'Unalterable Hash Locking' : 'পরিবর্তন অযোগ্য ডিজিটাল লক সিস্টেম'}
              </h4>
              <p className="text-sm font-serif text-gray-600 leading-relaxed">
                {lang === 'en'
                  ? 'Once an inspection is approved by our Admin Panel, the data is sealed with a unique digital SHA hash key. Nobody can modify results to favor sellers.'
                  : 'অডিটরদের তথ্য একবার মূল পোর্টালে এডমিন কর্তৃক ভেরিফাইড হলে প্রতিটি ক্যাশে ডিজিটাল রুল লকিং কি দিয়ে সিল করা হয়। ডিলাররা কোনোভাবেই রিপোর্ট বদলাতে পারবে না।'}
              </p>
            </div>

            <div className="bg-white p-8 border border-black/10 space-y-5" id="unique-photos">
              <div className="h-10 w-10 bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <FileText className="h-5 w-5" />
              </div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
                {lang === 'en' ? 'Evidence-Based Photo Records' : 'প্রমাণসাপেক্ষ ফিজিক্যাল ডাটা ও ছবি'}
              </h4>
              <p className="text-sm font-serif text-gray-600 leading-relaxed">
                {lang === 'en'
                  ? 'No generic ratings. Every report contains physical high-res photographs of structural welding joints, paint thickness gauge, and live OBD fault screen logs.'
                  : 'সাধারণ রেটিং বা মুখস্থ রিপোর্ট নয়। আমাদের মেকানিক গাড়ির আসল চ্যাসিস ওয়েল্ডিং রড, লেজার গজ পরিমাপের ছবি এবং রিয়েল টাইম ট্রাবল স্ক্রিন শেয়ার করতে বাধ্য থাকে।'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. HOW WE ARE ABLE TO SOLVE THEIR PROBLEM, 9. THE BENEFIT OF GARIAUDIT, & 10. WHY BANGLADESH NEEEDS THIS */}
      <section className="py-16 sm:py-24 bg-white border-b border-black/10" id="problem-solution-bangladesh">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 border border-black/15 bg-amber-50 px-3 py-1 text-[9px] uppercase tracking-widest font-sans font-bold text-amber-950">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>{lang === 'en' ? 'Critical Market Assessment' : 'বাংলাদেশ মটর গাড়ির সংকটকাল'}</span>
              </div>
              
              <h2 className="text-3xl font-light text-slate-950 tracking-tight leading-tight font-serif">
                {lang === 'en' 
                  ? 'The Silent Crisis in the Bangladeshi Used Car Marketplace' 
                  : 'কেন বাংলাদেশে এই অডিট সেবার বিকল্প নেই'}
              </h2>
              
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed font-serif">
                <p>
                  {lang === 'en'
                    ? 'In Dhaka and Chattogram showrooms, over 85% of reconditioned JDM vehicles are presented with falsified auction papers. Sells agents systematically reset digital odometers to hide 100,000+ mileage drops. Worse, structural weld-repair of crashed cars represents a lethal threat to passengers.'
                    : 'ঢাকা ও চট্টগ্রামের শোরুমগুলোতে প্রায় ৮৫%-এর বেশি রিকন্ডিশনড জাপানি গাড়ির আসল অকশন শিট গায়েব করে কৃত্রিম বেশি রেটিংয়ে ক্রেতাদের প্রতারিত করা হয়। ৫-১০ লাখ টাকা বেশি দামে বিক্রির উদ্দেশ্যে ওডোমিটার কমিয়ে দেওয়া হয়। চ্যাসিস কাটা ঝালাই গাড়ি হাইওয়েতে বড় দুর্ঘটনার প্রধান কারণ।'}
                </p>
                <p className="font-serif">
                  {lang === 'en'
                    ? 'Since Bangladesh lacks a formal registry verification framework like CARFAX, families invest life-savings (typically BDT 20-50 Lakhs) purely on visual luster, only to discover massive mechanical and battery degradation within weeks.'
                    : 'বাংলাদেশে উপযুক্ত ডাটাবেজ না থাকায় জীবনের সঞ্চয় থেকে ৩০-৫০ লাখ টাকা খরচ করে গাড়ি নেওয়ার পরপরই মানুষ ফায়ারিং ফল্ট বা অকেজো হাইব্রিড ব্যাটারির সম্মুখীন হচ্ছেন।'}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 mt-10 lg:mt-0 space-y-6">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-rose-600">
                {lang === 'en' ? 'Our Tangible Solution & Direct Benefits' : 'আমাদের প্রযুক্তিগত সমাধান ও ক্রেতাদের নিশ্চিত সুবিধা'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                
                <div className="border border-black/10 p-6 bg-[#fbfbfb]">
                  <h4 className="font-bold text-xs uppercase tracking-wider font-sans text-slate-950 mb-2">
                    {lang === 'en' ? '⚙️ Price Negotiation Evidence' : '⚙️ নির্ভরযোগ্য মূল্য যাচাইর প্রমাণ'}
                  </h4>
                  <p className="text-xs text-gray-500 font-serif leading-relaxed">
                    {lang === 'en'
                      ? 'Download signed administrative PDF reports with clear findings to negotiate BDT 2-4 Lakh price reductions based on actual repair requirements for hybrid gearboxes.'
                      : 'আমাদের স্বাক্ষরযুক্ত অফিশিয়াল পিডিএফ প্রমাণ দেখিয়ে ডিলারদের কাছ থেকে গাড়ির ত্রুটি সংশোধন বাবদ সরাসরি ২ থেকে ৪ লাখ টাকা ছাড় বুঝে নিতে পারেন।'}
                  </p>
                </div>

                <div className="border border-black/10 p-6 bg-[#fbfbfb]">
                  <h4 className="font-bold text-xs uppercase tracking-wider font-sans text-slate-950 mb-2">
                    {lang === 'en' ? '🛡️ Real-Time GPS Dispatch' : '🛡️ দ্রুত মোবাইল মেকানিক সাপোর্ট'}
                  </h4>
                  <p className="text-xs text-gray-500 font-serif leading-relaxed">
                    {lang === 'en'
                      ? 'Book inside the Buyer portal and our proximity engine matches a certified mechanic nearest to the showroom, completing tests in under 90 minutes.'
                      : 'অ্যাপে বুকিং করার সঙ্গে সঙ্গে শোরুম বা বিক্রেতার গ্যারেজের নিকটের অভিজ্ঞ মেকানিক মাত্র ৯০ মিনিটে স্পটে পৌঁছে নিরীক্ষণ সম্পন্ন করে।'}
                  </p>
                </div>

                <div className="border border-black/10 p-6 bg-[#fbfbfb]">
                  <h4 className="font-bold text-xs uppercase tracking-wider font-sans text-slate-950 mb-2">
                    {lang === 'en' ? '⚡ Hybrid Cell Diagnosis' : '⚡ হাইব্রিড ব্যাটারি ডিক্লেয়ারেশন'}
                  </h4>
                  <p className="text-xs text-gray-500 font-serif leading-relaxed">
                    {lang === 'en'
                      ? 'Our technicians perform battery block voltage diagnostic checks, providing accurate cell State of Health (SoH) metrics to prevent early, expensive hybrid replacements.'
                      : 'হাইব্রিড প্যাকের ভোল্টেজ বা ব্যাটারি ব্লক টেস্ট করে নিখুঁত হেলথ (SoH) রেটিং প্রিপেয়ার করা হয়, যা আপনাকে ২-৩ লাখ টাকা গচ্ছা যাওয়া থেকে রক্ষা করবে।'}
                  </p>
                </div>

                <div className="border border-black/10 p-6 bg-[#fbfbfb]">
                  <h4 className="font-bold text-xs uppercase tracking-wider font-sans text-slate-950 mb-2">
                    {lang === 'en' ? '🔍 Frame Salvage Laser Run' : '🔍 চেসিস লেজার ক্রস-টেস্ট'}
                  </h4>
                  <p className="text-xs text-gray-500 font-serif leading-relaxed">
                    {lang === 'en'
                      ? 'Specialized magnetic and laser-micrometer examinations ensure the vehicles side rails and cabin cage are free from dangerous highway crash repair marks.'
                      : 'মেকানিকদের বিশেষ টুলস ও গ্যাজেটের সাহায্যে টেস্ট করে চ্যাসিসের মূল ডিক্লারেশন চেক করা হয় যাতে অত্যন্ত ঝুঁকিপূর্ণ গাড়িগুলো সহজে চেনা যায়।'}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. HOW THE COUNTRY WILL GET BENEFITED & 7. HOW GIG SYSTEM IS REQUIRED TO SAVE EMPLOYMENT */}
      <section className="py-16 sm:py-24 bg-[#fbfbfb] border-b border-black/10" id="country-benefit-gig">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-rose-600 font-sans font-bold">NATION BUILDING & GIG SENSITIVITY</p>
            <h2 className="text-3xl md:text-4xl font-light text-slate-950 tracking-tight font-serif">
              {lang === 'en' ? 'Socio-Economic Contribution & The Mechanic Gig Economy' : 'সামাজিক-অর্থনৈতিক উন্নয়ন এবং দেশের মেকানিকদের কর্মসংস্থান সুরক্ষা'}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-xs sm:text-sm font-serif">
              {lang === 'en'
                ? 'GariAudit is not just checking cars — we are building safer highways for Bangladesh while creating micro-enterprise income streams for skilled mechanical workers.'
                : 'গাড়ি অডিট কেবল ব্যক্তিগত বিষয়ই নয় — এটি একদিকে মহাসড়ক নিরাপদ করে অন্যদিকে আমাদের দেশের দক্ষ ওয়ার্কশপ কর্মীদের নিশ্চিত বিকল্প আয়ের ব্যবস্থা করে দেয়।'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* 7. GIG SYSTEM SAVING EMPLOYMENTS IN CAR INDUSTRY */}
            <div className="bg-white p-10 border border-rose-100 shadow-sm space-y-6" id="gig-economy-impact">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 font-sans font-bold text-[9px] uppercase tracking-wider">
                <Users className="h-4 w-4 shrink-0" />
                <span>{lang === 'en' ? 'Employment Protection Directive' : 'মেকানিকদের গিগ অর্থনীতি ও কর্মসংস্থান'}</span>
              </div>
              
              <h3 className="font-serif text-2xl font-light text-slate-900 leading-tight">
                {lang === 'en' 
                  ? 'A Vital Micro-Gig System to Support local Mechanics' 
                  : 'আমাদের অপ্রাতিষ্ঠানিক ওয়ার্কশপ কর্মীদের ডিজিটাল আয়ের বিপ্লব'}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed font-serif">
                {lang === 'en'
                  ? 'Traditional workshop mechanics in Dhaka and Chattogram are facing severe hardships due to high cost-of-living and uneven business schedules. GariAudit harnesses these informal experts, provides them clean digital inspection toolkits, and matches them to nearby pre-purchase check requests.'
                  : 'দেশের শত শত দক্ষ মেকানিক কাজ পাওয়ার নিশ্চয়তা বা সঠিক বেতনের অভাবে মানবেতর জীবনযাপন করছেন। গাড়িঅডিট এই বিচ্ছিন্ন ভাইদের একটি সুনির্দিষ্ট মোবাইল অ্যাপলিকেশন প্ল্যাটফর্মের আওতায় এনে তাদের সম্মানিত ডিজিটাল টেকনিশিয়ানে রুপান্তর করছে।'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-gray-500 font-sans tracking-wide">
                <div className="bg-[#fbfbfb] p-4 border border-black/5">
                  <span className="font-bold text-slate-800 text-sm block">৳ ৪,০০০ - ৳ ১২,০০০</span>
                  {lang === 'en' ? 'Average extra weekly household income generated per auditor.' : 'মেকানিকদের ঘরে বাড়তি সাপ্তাহিক নিশ্চিত গিগ উপার্জন।'}
                </div>
                <div className="bg-[#fbfbfb] p-4 border border-black/5">
                  <span className="font-bold text-slate-800 text-sm block">bKash Instants</span>
                  {lang === 'en' ? 'Immediate payouts protect technicians from monthly delayed wages.' : 'কাজ সম্পন্ন হলেই সরাসরি ইনস্ট্যান্ট পেমেন্ট সুবিধা।'}
                </div>
              </div>
            </div>

            {/* 5. NATIONAL GAINS FOR BANGLADESH */}
            <div className="bg-white p-10 border border-slate-200 shadow-sm space-y-6" id="national-economic-benefit">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 font-sans font-bold text-[9px] uppercase tracking-wider">
                <Landmark className="h-4 w-4 shrink-0" />
                <span>{lang === 'en' ? 'Macroeconomic Alignment' : 'জাতীয় সামষ্টিক নিরাপত্তা ও প্রবৃদ্ধি'}</span>
              </div>
              
              <h3 className="font-serif text-2xl font-light text-slate-900 leading-tight">
                {lang === 'en'
                  ? 'Building Safer Roads and Transparent Financial Assets'
                  : 'নিরাপদ সড়ক তৈরি, সুস্থ অর্থনীতি ও কালোবাজারি প্রতিরোধ'}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed font-serif">
                {lang === 'en'
                  ? 'Falsifying reconditioned vehicles inflates bank loan approvals artificially, inducing financial system stress. By creating transparent certifications, GariAudit assists the National Road Safety initiatives and reduces fuel emissions from deteriorating sub-standard engines on the Padma Bridge and expressways.'
                  : 'মিথ্যে অকশন গ্রেড দেখিয়ে ব্যাংক ও আর্থিক প্রতিষ্ঠান থেকে অযাচিত লোন নেওয়া দেশের অর্থনীতিতে সংকট তৈরি করে। গাড়িঅডিটের প্রতিটি ডাটা নির্ভুল উপায়ে ব্যাংকিং ইন্টিগ্রিটি ও ঋণ প্রদান কাঠামোকে নির্ভরযোগ্য করে তোলে। নিরাপদ সড়ক নির্মাণে যা এক অবিস্মরণীয় মাইলফলক।'}
              </p>

              <div className="pt-4 border-t border-black/5 space-y-3 font-serif text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-emerald-700 rounded-full shrink-0" />
                  <span>{lang === 'en' ? 'Road Safety: Reduces structural weld breakdown accidents on national highways.' : 'উন্মুক্ত সড়ক: হাইওয়েতে গাড়ি বিকল হওয়া ও অকাল দুর্ঘটনার ঝুঁকি রাস করে।'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-emerald-700 rounded-full shrink-0" />
                  <span>{lang === 'en' ? 'Green Footprints: Evaluates hybrid SOH to ensure standard fuel emission conformity.' : 'কার্বন হ্রাসে অবদান: অকেজো ইঞ্জিন ও দূষিত ধোঁয়ামুক্ত আধুনিক সমাজ লক্ষ্য।'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FUTURE SCOPE & HORIZONS */}
      <section className="py-16 sm:py-24 bg-white border-b border-black/10" id="future-scope">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-rose-600 font-sans font-bold">THE ROAD AHEAD</p>
            <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a] tracking-tight font-serif">
              {lang === 'en' ? 'Future Product Scope' : 'আমাদের দীর্ঘমেয়াদি ভবিষ্যৎ পরিকল্পনা ও লক্ষ্য'}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-xs sm:text-sm font-serif">
              {lang === 'en' 
                ? 'We are building the master database for Japanese imports in South Asia. Join us on our upcoming structural expansion.'
                : 'দক্ষিণ এশিয়ায় জাপানি রিকন্ডিশনড গাড়ির সবচেয়ে বড় ভেরিফাইড ডাটাবেস নেটওয়ার্ক গড়ে তোলার প্রত্যয়।'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-[#fbfbfb] p-8 border border-black/5 flex items-start gap-4">
              <Compass className="h-8 w-8 text-rose-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
                  {lang === 'en' ? '1. Direct JDM Export API' : '১. জাপানি অকশন ডিরেক্ট সংযোগ'}
                </h4>
                <p className="text-xs text-gray-500 font-serif leading-relaxed">
                  {lang === 'en'
                    ? 'Integrating deep API hooks directly into USS, ARAI, and CAA Japanese auction database pools for instantaneous VIN lookup validation.'
                    : 'জাপানের মূল অকশন হাউজ ডাটাবেসের সাথে ডিরেক্ট এপিআই সংযোগ, যার মাধ্যমে চেসিস নাম্বার লিখলেই আসল অকশন পেস শো হবে।'}
                </p>
              </div>
            </div>

            <div className="bg-[#fbfbfb] p-8 border border-black/5 flex items-start gap-4">
              <Cpu className="h-8 w-8 text-rose-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
                  {lang === 'en' ? '2. Machine Learning Paint Scan' : '২. এআই মেটাল ডায়াগনস্টিকস'}
                </h4>
                <p className="text-xs text-gray-500 font-serif leading-relaxed">
                  {lang === 'en'
                    ? 'Automated algorithmic predictive analysis comparing local paint depth micron values against exact manufacturer factory templates.'
                    : 'একটি বুদ্ধিমান আলগোরিদিম, যা মেটালের পেইন্ট কোটিংয়ের পুরুত্ব বিশ্লেষণ করে গাড়িটির কোনো অংশ ড্যামেজ বা রি-স্প্রে কিনা তা নিখুঁতভাবে জানাবে।'}
                </p>
              </div>
            </div>

            <div className="bg-[#fbfbfb] p-8 border border-black/5 flex items-start gap-4">
              <MapPin className="h-8 w-8 text-rose-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
                  {lang === 'en' ? '3. District Level Expansion' : '৩. দেশব্যাপী বিভাগীয় সম্প্রসারণ'}
                </h4>
                <p className="text-xs text-gray-500 font-serif leading-relaxed">
                  {lang === 'en'
                    ? 'Scaling mechanic gig dispatch channels outside Dhaka & Chattogram into Sylhet, Khulna, Rajshahi, and Bogura districts.'
                    : 'ঢাকা ও চট্টগ্রামের পর খুব শীঘ্রই সিলেট, খুলনা, রাজশাহী, যশোর ও বগুড়ায় বিশ্বস্ত গিগ মেকানিক ও অন-ডিম্যান্ড সার্ভিস স্টেশন চালু করা হবে।'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PRICING & TARIFF SCHEDULE */}
      <section className="py-16 sm:py-24 bg-white border-b border-black/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-rose-600 font-sans font-bold">TRANSPARENT TARIFFS</p>
            <h2 className="text-3xl md:text-4xl font-light text-slate-900 tracking-tight font-serif">
              {text.pricingTitle}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-xs sm:text-sm font-serif leading-relaxed">
              We charge a flat fee. Full booking requires initial ৳৫০০ safety deposit via bKash to allocate nearby inspectors. The remaining balance is paid after report delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Basic Pack */}
            <div className="bg-white border border-black/10 p-8 flex flex-col justify-between hover:bg-[#fbfbfb] transition duration-200">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 font-sans">Standard Rate</span>
                <h4 className="font-sans font-bold uppercase tracking-wider text-slate-900 mt-2 text-sm">{text.basicPackage}</h4>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-light text-black font-serif">{text.priceBasic}</span>
                  <span className="ml-1 text-[11px] uppercase tracking-wider text-gray-400 font-sans">/ vehicle</span>
                </div>
                <p className="mt-4 text-gray-600 text-xs sm:text-sm font-serif leading-relaxed">
                  Best for budget Japanese hatchbacks like Toyota Aqua or Nissan Dayz where electronics checks are vital.
                </p>
                <ul className="mt-6 space-y-2 text-xs font-serif text-gray-500 border-t border-black/5 pt-4">
                  <li className="flex items-center gap-2">✓ Full OBD2 Electronic scan</li>
                  <li className="flex items-center gap-2">✓ Odometer rollback verifier</li>
                  <li className="flex items-center gap-2">✓ Engine fluid leaks test</li>
                  <li className="flex items-center gap-2 text-gray-300">✗ Frame alignment check</li>
                </ul>
              </div>
              <button onClick={() => onNavigate('buyer')} className="mt-8 w-full border border-black text-black font-sans uppercase tracking-widest text-[11px] py-4 hover:bg-black hover:text-white transition cursor-pointer">
                Book Basic
              </button>
            </div>

            {/* Premium Pack */}
            <div className="bg-white border-2 border-black p-8 flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-rose-600 text-white font-sans text-[8px] tracking-[0.2em] uppercase px-3 py-1 font-bold">RECOMMENDED</div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 font-sans">Verified Optimal</span>
                <h4 className="font-sans font-bold uppercase tracking-wider text-slate-900 mt-2 text-sm">{text.premiumPackage}</h4>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-light text-black font-serif">{text.pricePremium}</span>
                  <span className="ml-1 text-[11px] uppercase tracking-wider text-gray-400 font-sans">/ vehicle</span>
                </div>
                <p className="mt-4 text-gray-600 text-xs sm:text-sm font-serif leading-relaxed">
                  Highly recommended for high-end Sedans and SUVs (Premio, Allion, Vezel, X-Trail) to verify full chassis and body structures.
                </p>
                <ul className="mt-6 space-y-2 text-xs font-serif text-gray-700 border-t border-black/10 pt-4">
                  <li className="flex items-center gap-2 font-bold text-black">✓ Everything in Basic</li>
                  <li className="flex items-center gap-2">✓ Underbody Frame Welding audit</li>
                  <li className="flex items-center gap-2">✓ Paint depth gauge indicators</li>
                  <li className="flex items-center gap-2">✓ Suspensions road-test rating</li>
                  <li className="flex items-center gap-2">✓ Live 40+ reference photos</li>
                </ul>
              </div>
              <button onClick={() => onNavigate('buyer')} className="mt-8 w-full bg-black text-white font-sans uppercase tracking-widest text-[11px] py-4 hover:bg-white hover:text-black border border-black transition cursor-pointer font-bold">
                Book Premium
              </button>
            </div>

            {/* EV specialist */}
            <div className="bg-white border border-black/10 p-8 flex flex-col justify-between hover:bg-[#fbfbfb] transition duration-200">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 font-sans">Advanced Technology</span>
                <h4 className="font-sans font-bold uppercase tracking-wider text-slate-900 mt-2 text-sm">{text.evPack}</h4>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-light text-black font-serif">{text.priceEv}</span>
                  <span className="ml-1 text-[11px] uppercase tracking-wider text-gray-400 font-sans">/ vehicle</span>
                </div>
                <p className="mt-4 text-gray-600 text-xs sm:text-sm font-serif leading-relaxed">
                  Engineered specifically for fully electric structures and hybrid batteries (Toyota Axio Hybrid, Grace, Outlander PHEV).
                </p>
                <ul className="mt-6 space-y-2 text-xs font-serif text-gray-500 border-t border-black/5 pt-4">
                  <li className="flex items-center gap-2">✓ Everything in Premium</li>
                  <li className="flex items-center gap-2">✓ Hybrid pack cell degradation map</li>
                  <li className="flex items-center gap-2">✓ High-voltage insulation check</li>
                  <li className="flex items-center gap-2">✓ Regenerative braking analysis</li>
                </ul>
              </div>
              <button onClick={() => onNavigate('buyer')} className="mt-8 w-full border border-black text-black font-sans uppercase tracking-widest text-[11px] py-4 hover:bg-black hover:text-white transition cursor-pointer">
                Book Hybrid / EV
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 6. TRUST FAQ BLOCK */}
      <section className="py-16 sm:py-24 bg-[#fbfbfb] border-t border-black/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-rose-600 font-sans font-bold">DOCUMENTATION</p>
            <h2 className="text-3xl font-light text-slate-900 tracking-tight font-serif">Frequently Answered Questions</h2>
            <p className="text-gray-500 text-xs sm:text-sm font-serif">Clear transparency on how GariAudit protects your purchase decision</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-8 border border-black/10">
              <h4 className="font-bold text-slate-900 font-sans text-xs uppercase tracking-wider">Where are inspection bookings conducted?</h4>
              <p className="mt-3 text-gray-600 text-xs sm:text-sm leading-relaxed font-serif font-serif">
                Our inspectors travel directly to your preferred point in Dhaka and Chattogram. This can be a reconditioned showroom in Baridhara, Tejgaon, or the private owner’s garage in Uttara.
              </p>
            </div>

            <div className="bg-white p-8 border border-black/10">
              <h4 className="font-bold text-slate-900 font-sans text-xs uppercase tracking-wider">Can the car owner or broker alter my results?</h4>
              <p className="mt-3 text-gray-600 text-xs sm:text-sm leading-relaxed font-serif font-serif">
                Never. The inspection metrics are signed by the auditor with real-time GPS metadata directly uploaded. Once audit records are completed, the unique database SHA hashes prevent anyone from editing findings, maintaining absolute buyer agency.
              </p>
            </div>

            <div className="bg-white p-8 border border-black/10">
              <h4 className="font-bold text-slate-900 font-sans text-xs uppercase tracking-wider">How does the ৳৫০০ security deposit operate?</h4>
              <p className="mt-3 text-gray-600 text-xs sm:text-sm leading-relaxed font-serif font-serif">
                To keep mechanics dedicated and cancel-protected on busy Dhaka streets, we utilize a small safety deposit. If an inspector fails to show up within your requested window, the amount is refunded to your bKash instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 1. HIGH-IMPACT FINAL CTA BLOCK (ACTION TRIGGERS AT FOOTER) */}
      <section className="bg-black text-[#fbfbfb] py-16 sm:py-24 border-t border-black/15" id="final-cta">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 border border-rose-500 px-4 py-1 text-[9px] uppercase tracking-[0.25em] font-sans font-bold text-rose-400">
            <Lightbulb className="h-3 w-3" />
            <span>Ready to Protect Your Asset?</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-light font-serif tracking-tight leading-sm max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Join the transparent automotive movement in Bangladesh.'
              : 'আসলেই কি আপনার স্বপ্নের গাড়িটি নিরাপদ? আজই ভেরিফাই করুন।'}
          </h2>
          
          <p className="text-gray-400 text-xs sm:text-sm font-serif max-w-lg mx-auto leading-relaxed">
            {lang === 'en'
              ? 'Get instant peace of mind. Schedule an expert pre-purchase inspection or earn supplementary income as a qualified freelance technician.'
              : 'কোনো অনুমান নয় — সত্য জানুন। অভিজ্ঞ টেকনিশিয়ানের সাহায্যে এখনই সেশান বুক করুন অথবা গিগ মেকানিক প্যানেলে অংশ নিন।'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              id="footer-cta-book"
              onClick={() => onNavigate('buyer')}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-rose-600 border border-rose-600 hover:bg-rose-700 text-white font-sans font-bold uppercase tracking-widest text-xs px-8 py-4.5 cursor-pointer transition gap-2"
            >
              <span>{lang === 'en' ? 'Book Car Audit' : 'গাড়ি অডিট বুক করুন'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              id="footer-cta-join"
              onClick={() => onNavigate('auditor')}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border border-gray-400 hover:border-white text-white font-sans font-bold uppercase tracking-widest text-xs px-8 py-4.5 cursor-pointer transition"
            >
              {lang === 'en' ? 'Join as Mechanic' : 'মেকানিক হিসেবে যোগ দিন'}
            </button>
          </div>
        </div>
      </section>
      
    </div>
  );
}
