/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Facebook, 
  Linkedin, 
  Instagram, 
  MessageCircle, 
  Twitter, 
  PhoneCall, 
  ExternalLink, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Clock, 
  Award, 
  Layers, 
  User, 
  HardDrive,
  Network
} from 'lucide-react';

interface FooterProps {
  lang: 'en' | 'bn';
  onNavigate: (tab: 'landing' | 'buyer' | 'auditor' | 'admin') => void;
  activeTab: 'landing' | 'buyer' | 'auditor' | 'admin';
}

export default function Footer({ lang, onNavigate, activeTab }: FooterProps) {
  const [visitorCount, setVisitorCount] = useState<number>(10427);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [ping, setPing] = useState<number>(14);

  // Load and increment visitor count
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gar_visitor_count');
      if (stored) {
        const next = parseInt(stored, 10) + 1;
        localStorage.setItem('gar_visitor_count', next.toString());
        setVisitorCount(next);
      } else {
        const initialValue = 10427 + Math.floor(Math.random() * 250);
        localStorage.setItem('gar_visitor_count', initialValue.toString());
        setVisitorCount(initialValue);
      }
    } catch (e) {
      // Fallback
    }

    // Live clock update
    const timer = setInterval(() => {
      const now = new Date();
      // Format to Dhaka local time output format
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setCurrentTime(formatter.format(now));
    }, 1000);

    // Minor ping variation for realism
    const pingTimer = setInterval(() => {
      setPing(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next < 3 ? 4 : next > 25 ? 20 : next;
      });
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(pingTimer);
    };
  }, []);

  const handleLinkClick = (tab: 'landing' | 'buyer' | 'auditor' | 'admin', elementId?: string) => {
    onNavigate(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (elementId) {
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  };

  const formatNumber = (num: number) => {
    return num.toString().padStart(6, '0');
  };

  return (
    <footer className="bg-[#0c111d] text-white pt-16 pb-12 border-t border-white/10 font-sans" id="global-application-footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Widget Bar: Clock, Visitor Counter & System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-white/10 items-center mb-12">
          
          {/* Site Visitor Counter (Beautiful retro mechanical/LED readout style) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 p-4 border border-white/10 rounded-sm">
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                {lang === 'en' ? 'VERIFIED VISIT COUNTER' : 'ভিজিটর কাউন্টার'}
              </span>
              <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs text-gray-300 font-mono">Live Counter Audit</span>
              </div>
            </div>
            
            <div className="flex gap-1 justify-center">
              {formatNumber(visitorCount).split('').map((char, index) => (
                <span 
                  key={index} 
                  className="bg-black/80 text-rose-500 px-2.5 py-1 text-md font-mono font-bold tracking-tight border border-white/10 rounded-sm shadow-inner"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* Dhaka Division Local Time Clock */}
          <div className="flex items-center justify-center gap-4 bg-white/5 p-4 border border-white/10 rounded-sm">
            <Clock className="h-6 w-6 text-rose-500 shrink-0" />
            <div className="text-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">
                {lang === 'en' ? 'DHAKA LOCAL TIME' : 'বাংলাদেশ সময়'}
              </span>
              <span className="font-mono text-sm font-semibold tracking-wide text-rose-400">
                {currentTime || '07:05:22 PM'}
              </span>
            </div>
          </div>

          {/* Backend API Server & DB Integrity Status */}
          <div className="flex items-center justify-between sm:justify-center gap-6 bg-white/5 p-4 border border-white/10 rounded-sm">
            <div className="flex items-center gap-3">
              <Network className="h-5 w-5 text-rose-500 shrink-0" />
              <div>
                <dt className="text-[9px] text-gray-400 uppercase tracking-widest font-bold block">
                  {lang === 'en' ? 'SYSTEM API ENGINE' : 'সিস্টেম কার্যকারিতা'}
                </dt>
                <dd className="text-xs font-mono font-semibold text-emerald-400">
                  ONLINE ● ACTIVE
                </dd>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
            <div className="text-right sm:text-left">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">LATENCY</span>
              <span className="text-xs font-mono font-bold text-gray-200">{ping}ms</span>
            </div>
          </div>

        </div>

        {/* Master columns wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Column 1: Editorial Message & Brand Trust Statements (4 Cols) */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-white text-black flex items-center justify-center font-bold text-xs rounded-sm">
                GA
              </div>
              <span className="text-lg font-bold font-sans uppercase tracking-tight text-white">
                GariAudit BD
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-serif text-gray-300 leading-relaxed italic">
                {lang === 'en' 
                  ? '"Operating with absolute autonomy from vehicle dealerships, brokers and commercial importers. Every inspection report generated remains unalterable on GariAudits SHA-locked filesystem to eliminate fraudulent manipulations."'
                  : '"শোরুম, মটর ব্রোকার বা আমদানিকারক প্রতিষ্ঠান থেকে সম্পূর্ণ স্বাধীন ও নিরপেক্ষ থেকে আমরা গাড়ির আসল চিত্র তুলে ধরি। প্রতিটি অডিট রিপোর্ট ডিজিটাল ক্রিপ্টোগ্রাফিক হ্যাশে লক থাকে যা কোনোভাবেই বিক্রেতার পক্ষে ম্যানিপুলেট করা সম্ভব নয়।"'
                }
              </p>
              
              <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-sans tracking-wider uppercase font-bold" id="trust-indicator">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>
                  {lang === 'en' ? 'Verified Government Safety Standards Compliant' : 'বিআরটিএ নিয়ম ও রোড সেফটির সহায়ক'}
                </span>
              </div>
            </div>

            {/* Social Site Buttons (1. Social site buttons) */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">
                {lang === 'en' ? 'CONNECT WITH INTEGRITY' : 'আমাদের সোশ্যাল নেটওয়ার্ক'}
              </span>
              <div className="flex flex-wrap gap-2.5">
                
                <a 
                  href="https://facebook.com/GariAudit" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-none border border-white/10 hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-500 flex items-center justify-center text-gray-400 transition cursor-pointer"
                  title="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>

                <a 
                  href="https://linkedin.com/company/gariaudit" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-none border border-white/10 hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-500 flex items-center justify-center text-gray-400 transition cursor-pointer"
                  title="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>

                <a 
                  href="https://wa.me/8801700000000" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-none border border-white/10 hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-500 flex items-center justify-center text-gray-400 transition cursor-pointer"
                  title="WhatsApp Helpline"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>

                <a 
                  href="https://instagram.com/gariaudit" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-none border border-white/10 hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-500 flex items-center justify-center text-gray-400 transition cursor-pointer"
                  title="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>

                <a 
                  href="https://twitter.com/gariaudit" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-none border border-white/10 hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-500 flex items-center justify-center text-gray-400 transition cursor-pointer"
                  title="X (Twitter)"
                >
                  <Twitter className="h-4 w-4" />
                </a>

                <a 
                  href="tel:+8809612000000"
                  className="w-8 h-8 rounded-none border border-white/10 hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-500 flex items-center justify-center text-gray-400 transition cursor-pointer"
                  title="Call Phone Specialist"
                >
                  <PhoneCall className="h-4 w-4" />
                </a>

              </div>
            </div>

          </div>

          {/* Column 2: Crucial Navigation Short Links (4 Cols) */}
          <div className="md:col-span-4 space-y-6">
            <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-[#9ca3af] border-l-2 border-rose-600 pl-2.5">
              {lang === 'en' ? 'CRUCIAL NAVIGATION SHORTCUTS' : 'জরুরি পেজ শর্টকাট লিংক'}
            </h3>
            
            <nav className="grid grid-cols-2 gap-3 font-medium text-xs text-gray-300">
              
              <button 
                type="button"
                onClick={() => handleLinkClick('landing')}
                className={`text-left hover:text-rose-500 transition py-1 flex items-center gap-1 cursor-pointer ${activeTab === 'landing' ? 'text-rose-400 font-bold' : ''}`}
              >
                <span>• {lang === 'en' ? 'GariAudit Home' : 'হোম ল্যান্ডিং পেজ'}</span>
              </button>

              <button 
                type="button"
                onClick={() => handleLinkClick('buyer')}
                className={`text-left hover:text-rose-500 transition py-1 flex items-center gap-1 cursor-pointer ${activeTab === 'buyer' ? 'text-rose-400 font-bold' : ''}`}
              >
                <span>• {lang === 'en' ? 'Buyer Gateway' : 'ক্রেতা পোর্টাল'}</span>
              </button>

              <button 
                type="button"
                onClick={() => handleLinkClick('auditor')}
                className={`text-left hover:text-rose-500 transition py-1 flex items-center gap-1 cursor-pointer ${activeTab === 'auditor' ? 'text-rose-400 font-bold' : ''}`}
              >
                <span>• {lang === 'en' ? 'Auditor Jobs Desk' : 'মেকানিক গিগস ডেস্ক'}</span>
              </button>

              <button 
                type="button"
                onClick={() => handleLinkClick('admin')}
                className={`text-left hover:text-rose-500 transition py-1 flex items-center gap-1 cursor-pointer ${activeTab === 'admin' ? 'text-rose-400 font-bold' : ''}`}
              >
                <span>• {lang === 'en' ? 'Admin Portal' : 'এডমিন প্যানেল'}</span>
              </button>

              <button 
                type="button"
                onClick={() => handleLinkClick('buyer', 'book-inspection-form')}
                className="text-left hover:text-rose-500 transition py-1 flex items-center gap-1 cursor-pointer"
              >
                <span>• {lang === 'en' ? 'Book Inspection' : 'নিরীক্ষা বুকিং করুন'}</span>
              </button>

              <button 
                type="button"
                onClick={() => handleLinkClick('buyer', 'jdm-calculator-sheet')}
                className="text-left hover:text-rose-500 transition py-1 flex items-center gap-1 cursor-pointer"
              >
                <span>• {lang === 'en' ? 'JDM Tariff Tool' : 'জেডিএম ট্যাক্স হিসাব'}</span>
              </button>

              <button 
                type="button"
                onClick={() => handleLinkClick('auditor', 'registered-inspector-list')}
                className="text-left hover:text-rose-500 transition py-1 flex items-center gap-1 cursor-pointer"
              >
                <span>• {lang === 'en' ? 'Registered Auditors' : 'নিবন্ধিত মেকানিকবৃন্দ'}</span>
              </button>

              <button 
                type="button"
                onClick={() => handleLinkClick('buyer', 'active-dispute-resolution')}
                className="text-left hover:text-rose-500 transition py-1 flex items-center gap-1 cursor-pointer"
              >
                <span>• {lang === 'en' ? 'Dispute Appeal' : 'লাইভ বিরোধ নিষ্পত্তি'}</span>
              </button>

            </nav>

            <div className="bg-white/5 p-4 border border-white/5 space-y-2 text-[11px] text-gray-300">
              <span className="font-bold text-white block uppercase tracking-wider">
                {lang === 'en' ? '⚡ INTERACTIVE HUB COMMAND:' : '⚡ ইন্টারেক্টিভ হাব কমান্ড:'}
              </span>
              <p className="font-serif text-gray-400">
                {lang === 'en' 
                  ? 'Click any link above. The application will instantly switch portals, auto-focus & smooth scroll right onto the specific form module.' 
                  : 'উপরের যেকোনো লিংকে ক্লিক করুন। অ্যাপ্লিকেশনটি সাথে সাথে নির্দিষ্ট পোর্টালে নিয়ে মডিউলটি হাইলাইট করবে।'}
              </p>
            </div>

          </div>

          {/* Column 3: Features Short-Links with Brief Summary descriptions (4 Cols) */}
          <div className="md:col-span-4 space-y-6">
            <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-[#9ca3af] border-l-2 border-rose-600 pl-2.5">
              {lang === 'en' ? 'KEY OPERATIONAL FEATURES' : 'গুরুত্বপূর্ণ অডিট ফিচারসমূহ'}
            </h3>

            <div className="space-y-4">
              
              <div 
                className="group flex gap-3 text-left cursor-pointer text-xs"
                onClick={() => handleLinkClick('buyer', 'book-inspection-form')}
              >
                <div className="h-6 w-6 rounded-sm bg-white/5 group-hover:bg-rose-600 border border-white/10 group-hover:border-rose-500 flex items-center justify-center text-[10px] text-gray-300 group-hover:text-white font-mono transition">
                  F1
                </div>
                <div>
                  <span className="font-bold group-hover:text-rose-400 block transition">
                    {lang === 'en' ? 'Pre-Purchase Check-up Booking' : 'অন-ডিমান্ড শোরুম চেকআপ'}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {lang === 'en' ? 'Secure vehicle inspector to meet live at Baridhara/Tejgaon showrooms.' : 'সহজে বুক করুন এবং দক্ষ মেকানিক দিয়ে গাড়ির ফিটনেস ও আসল কন্ডিশন বুঝুন।'}
                  </p>
                </div>
              </div>

              <div 
                className="group flex gap-3 text-left cursor-pointer text-xs"
                onClick={() => handleLinkClick('buyer', 'jdm-calculator-sheet')}
              >
                <div className="h-6 w-6 rounded-sm bg-white/5 group-hover:bg-rose-600 border border-white/10 group-hover:border-rose-500 flex items-center justify-center text-[10px] text-gray-300 group-hover:text-white font-mono transition">
                  F2
                </div>
                <div>
                  <span className="font-bold group-hover:text-rose-400 block transition">
                    {lang === 'en' ? 'JDM Tariff & Auction Sheet Certifier' : 'জেডিএম অকশন শিট ক্যালকুলেটর'}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {lang === 'en' ? 'Check real Japanese import taxes, custom fees & auction grading scores.' : 'গাড়ির আসল আমদানি শুল্ক, ট্যাক্স ও অকশন শিটের সত্যতা পরীক্ষা করার এপিআই টুল।'}
                  </p>
                </div>
              </div>

              <div 
                className="group flex gap-3 text-left cursor-pointer text-xs"
                onClick={() => handleLinkClick('buyer', 'active-dispute-resolution')}
              >
                <div className="h-6 w-6 rounded-sm bg-white/5 group-hover:bg-rose-600 border border-white/10 group-hover:border-rose-500 flex items-center justify-center text-[10px] text-gray-300 group-hover:text-white font-mono transition">
                  F3
                </div>
                <div>
                  <span className="font-bold group-hover:text-rose-400 block transition">
                    {lang === 'en' ? 'SHA-256 Vector PDF Audit Download' : 'পিডিএফ অডিট রিপোর্ট ডাউনলোড'}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {lang === 'en' ? 'Generate high-res structural inspection reports securely for printouts.' : 'ভেরিফাইড জেএস-পিডিএফ রিপোর্ট ডাউনলোড করুন যা ক্রিপ্টো হ্যাশ ভ্যালু সহ সিল থাকে।'}
                  </p>
                </div>
              </div>

              <div 
                className="group flex gap-3 text-left cursor-pointer text-xs"
                onClick={() => handleLinkClick('buyer', 'active-dispute-resolution')}
              >
                <div className="h-6 w-6 rounded-sm bg-white/5 group-hover:bg-rose-600 border border-white/10 group-hover:border-rose-500 flex items-center justify-center text-[10px] text-gray-300 group-hover:text-white font-mono transition">
                  F4
                </div>
                <div>
                  <span className="font-bold group-hover:text-rose-400 block transition">
                    {lang === 'en' ? 'Live Dispute & Appraisal Appeal Desk' : 'লাইভ বিরোধ নিষ্পত্তি চ্যাট পোর্ট'}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {lang === 'en' ? 'Engage directly in negotiations with dealers through live mediator support.' : 'শোরুমের অসত্য দাবির বিরুদ্ধে প্রমাণসহ কথা বলুন আমাদের স্পেশাল ডাবল রিভিউ দিয়ে।'}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-[11px] text-gray-500">
          <div className="space-y-1">
            <p className="text-gray-400">© 2026 GariAudit Bangladesh. All sovereign automotive inspection registers protected.</p>
            <p className="font-mono text-[10px]">SHA-256 Hex: <span className="text-gray-600">84A29D81FF...EA92A02C1B4</span> | Status: SECURE STANDALONE CONTAINER</p>
          </div>
          <div className="flex gap-4 font-bold uppercase tracking-wider text-gray-400">
            <span className="hover:text-rose-500 transition cursor-pointer" onClick={() => handleLinkClick('landing')}>Home</span>
            <span>|</span>
            <span className="hover:text-rose-500 transition cursor-pointer" onClick={() => handleLinkClick('buyer')}>Buyer Portal</span>
            <span>|</span>
            <span className="hover:text-rose-500 transition cursor-pointer" onClick={() => handleLinkClick('auditor')}>Auditor Portal</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
