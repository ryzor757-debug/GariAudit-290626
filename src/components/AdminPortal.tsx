/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { TRANSLATIONS } from '../data';
import { Gig } from '../types';
import { 
  ShieldCheck, 
  UserCheck, 
  CheckCircle, 
  FileSignature, 
  Scale, 
  Eye, 
  Printer, 
  Download, 
  X, 
  Award, 
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Activity,
  Plus,
  Database,
  Copy,
  Server,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../supabaseClient';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart
} from 'recharts';

interface AdminPortalProps {
  lang: 'en' | 'bn';
  gigs: Gig[];
  onApproveAuditor: (userId: string) => void;
  onReleaseReport: (gigId: string) => void;
}

export default function AdminPortal({ lang, gigs, onApproveAuditor, onReleaseReport }: AdminPortalProps) {
  const text = TRANSLATIONS[lang];

  // Database Live Status Diagnostics
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState<boolean>(true);
  const [seedLoading, setSeedLoading] = useState<boolean>(false);
  const [seedMessage, setSeedMessage] = useState<string>('');
  const [sqlCopied, setSqlCopied] = useState<boolean>(false);

  const fetchDbStatus = async () => {
    try {
      setDbLoading(true);
      const res = await fetch('/api/supabase-status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        setDbStatus({
          configured: false,
          error: errData.error || 'Server returned non-OK status'
        });
      }
    } catch (e: any) {
      setDbStatus({
        configured: false,
        error: e.message || 'Network exception'
      });
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    fetchDbStatus();
  }, []);

  const handleRunSeeding = async () => {
    try {
      setSeedLoading(true);
      setSeedMessage('');
      const res = await fetch('/api/supabase-seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSeedMessage(data.message);
        fetchDbStatus(); // Refresh row counts
      } else {
        setSeedMessage('Failed: ' + (data.error || 'Make sure your tables exist first by executing the schema script in Supabase SQL editor.'));
      }
    } catch (err: any) {
      setSeedMessage('Network error: ' + err.message);
    } finally {
      setSeedLoading(false);
    }
  };

  const handleCopySql = () => {
    try {
      navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setSqlCopied(true);
      setTimeout(() => setSqlCopied(false), 3000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  // Operational Overview Data (Interactive)
  const [operationalData, setOperationalData] = useState([
    { date: '05/23', volume: 8, avgScore: 84, activeAuditors: 4 },
    { date: '05/24', volume: 11, avgScore: 88, activeAuditors: 5 },
    { date: '05/25', volume: 15, avgScore: 76, activeAuditors: 6 },
    { date: '05/26', volume: 9, avgScore: 82, activeAuditors: 4 },
    { date: '05/27', volume: 18, avgScore: 92, activeAuditors: 7 },
    { date: '05/28', volume: 14, avgScore: 85, activeAuditors: 6 },
    { date: '05/29', volume: 22, avgScore: 89, activeAuditors: 8 }
  ]);

  const [analyticsWindow, setAnalyticsWindow] = useState<'7d' | 'all'>('7d');

  const handleAddMockAudit = () => {
    setOperationalData(prev => {
      const last = prev[prev.length - 1];
      const match = last.date.match(/(\d+)\/(\d+)/);
      let nextDate = '05/30';
      if (match) {
        const nextDay = parseInt(match[2]) + 1;
        nextDate = `05/${nextDay < 10 ? '0' + nextDay : nextDay}`;
      }
      const randomVol = Math.floor(Math.random() * 8) + 12; // 12 - 20
      const randomScore = Math.floor(Math.random() * 15) + 80; // 80 - 95
      const randomAuditors = Math.floor(Math.random() * 4) + 6; // 6 - 9
      return [...prev, { date: nextDate, volume: randomVol, avgScore: randomScore, activeAuditors: randomAuditors }];
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-black/15 p-3 font-serif text-[11px] shadow-sm space-y-1">
          <p className="font-sans font-bold text-gray-500 uppercase tracking-widest text-[8px]">{label}</p>
          {payload.map((item: any) => (
            <p key={item.name} className="flex justify-between gap-4 font-mono text-[10px]">
              <span style={{ color: item.color }} className="capitalize">
                {item.name === 'avgScore' 
                  ? (lang === 'en' ? 'Avg Score' : 'গড় স্কোর') 
                  : (lang === 'en' ? 'Daily Volume' : 'দৈনিক ভলিউম')}
                :
              </span>
              <span className="font-bold text-[#1a1a1a]">
                {item.value}{item.name === 'avgScore' ? '%' : ''}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Mock Auditors verification list
  const [auditors, setAuditors] = useState([
    { id: 'aud_1', name: 'Jamil Rahman', phone: '01852441122', shopLicense: 'DHK-MECH-485', status: 'PENDING', skills: ['CAR', 'EV'] },
    { id: 'aud_2', name: 'Nurul Amin', phone: '01712457812', shopLicense: 'CG-MECH-912', status: 'VERIFIED', skills: ['CAR'] },
    { id: 'aud_3', name: 'Ziaul Hoque', phone: '01911487236', shopLicense: 'DHK-MECH-823', status: 'PENDING', skills: ['SCOOTER'] }
  ]);

  // PDF Preview specific states
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{
    id: string;
    model: string;
    location: string;
    chassisCode: string;
    odometerStatus: 'PASS' | 'FAIL';
    odometerKM: string;
    ecuBackupKM: string;
    chassisDeviation: string;
    clutchStatus: 'PASS' | 'WARNING' | 'FAIL';
    clutchLeakage: string;
    batteryHealthSoH: string;
    rustStatus: 'PASS' | 'WARNING' | 'FAIL';
    notes: string;
    auditorName: string;
    auditorLicense: string;
    hashSignature: string;
  } | null>(null);

  const [downloading, setDownloading] = useState(false);

  const submittedGigs = gigs.filter(g => g.status === 'SUBMITTED');

  // Trigger preview generation with specific customized data
  const handleGeneratePreview = (item: Gig | null, type?: 'allion' | 'premio' | 'vezel') => {
    let mockData = {
      id: item?.id || 'rep_draft_01',
      model: 'Toyota Premio F-EX (JDM Reconditioned)',
      location: item?.locationText || 'Baridhara Link Road, Dhaka',
      chassisCode: 'NZT260-84729103',
      odometerStatus: 'PASS' as 'PASS' | 'FAIL',
      odometerKM: '48,230 km',
      ecuBackupKM: '48,232 km',
      chassisDeviation: '0.00 mm (Factory-Original)',
      clutchStatus: 'PASS' as 'PASS' | 'WARNING' | 'FAIL',
      clutchLeakage: 'NONE - DRY SYSTEM',
      batteryHealthSoH: '88% (Good Durability)',
      rustStatus: 'PASS' as 'PASS' | 'WARNING' | 'FAIL',
      notes: item?.notes || 'Vehicle exterior demonstrates clean original paint layers. Dual octanes run with balanced compression indices. Underbody remains entirely dry without any structural repair traces.',
      auditorName: 'Jamil Rahman',
      auditorLicense: 'DHK-MECH-485',
      hashSignature: 'pg_sha256:8f2a9d1c0b3e5f4a7c9d8e7f6a5b4c3d2e1f0a9b8`2738'
    };

    // If an actual submitted item is selected, parse details
    if (item) {
      if (item.locationText.toLowerCase().includes('baridhara') || item.notes?.toLowerCase().includes('allion')) {
        mockData.model = 'Toyota Allion JDM Custom';
        mockData.chassisCode = 'NZT260-9118420';
        mockData.odometerStatus = 'FAIL';
        mockData.odometerKM = '54,000 km';
        mockData.ecuBackupKM = '142,000 km';
        mockData.clutchStatus = 'PASS';
        mockData.rustStatus = 'WARNING';
        mockData.notes = item.notes;
      } else {
        mockData.model = 'Toyota Premio 1.8 Hybrid';
        mockData.chassisCode = 'ZRT261-2384910';
        mockData.odometerStatus = 'PASS';
        mockData.odometerKM = '32,450 km';
        mockData.ecuBackupKM = '32,450 km';
        mockData.clutchStatus = 'PASS';
        mockData.rustStatus = 'PASS';
        mockData.notes = item.notes || 'Sub-block voltages uniform. Intelligent regenerating metrics optimal.';
      }
    } else if (type === 'vezel') {
      mockData.model = 'Honda Vezel Hybrid RS JDM';
      mockData.chassisCode = 'RU3-1204893';
      mockData.odometerStatus = 'PASS';
      mockData.odometerKM = '48,930 km';
      mockData.ecuBackupKM = '48,931 km';
      mockData.clutchStatus = 'FAIL';
      mockData.clutchLeakage = 'HIGH ACTUATOR FLUID LEAKAGE';
      mockData.batteryHealthSoH = '62% (Warning - balancing required)';
      mockData.rustStatus = 'PASS';
      mockData.notes = 'Critical i-DCD dual-clutch pressure mismatch registered. Hybrid electric battery pack shows accelerated thermal levels on load. Chassis alignment completely flat.';
    } else if (type === 'premio') {
      mockData.model = 'Toyota Premio 1.8 Executive Hybrid';
      mockData.chassisCode = 'ZRT261-2384910';
      mockData.odometerStatus = 'PASS';
      mockData.odometerKM = '32,450 km';
      mockData.ecuBackupKM = '32,450 km';
      mockData.clutchStatus = 'PASS';
      mockData.rustStatus = 'PASS';
    }

    setPreviewData(mockData);
    setIsPreviewOpen(true);
  };

  const handleDownloadPDF = async () => {
    if (!previewData) return;
    const element = document.getElementById('physical-pdf-print-sheet');
    if (!element) {
      alert('Error: Printable region not found in current scene.');
      return;
    }
    
    setDownloading(true);
    const originalGetComputedStyle = window.getComputedStyle;
    
    // Capture style tags to temporarily strip oklch color functions which html2canvas parser trips on
    const styleTags = Array.from(document.querySelectorAll('style'));
    const originalStyleContentsByTag = new Map<HTMLStyleElement, string>();
    
    try {
      const colorCache = new Map<string, string>();
      const convertOklchToRgbVal = (colorStr: string): string => {
        if (typeof colorStr !== 'string' || !colorStr.includes('oklch')) {
          return colorStr;
        }
        if (colorCache.has(colorStr)) {
          return colorCache.get(colorStr)!;
        }
        
        const oklchRegex = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/g;
        const result = colorStr.replace(oklchRegex, (match, l, c, h, opacity) => {
          try {
            const hNum = parseFloat(h);
            const lNum = parseFloat(l);
            // Color mapping to retain the vivid editorial feel of GariAudit inside the static PDF
            if (hNum >= 40 && hNum <= 90) {
              // Warm / Amber / Orange / Gold tags
              return opacity ? `rgba(245, 158, 11, ${opacity})` : `rgb(245, 158, 11)`;
            }
            if (hNum >= 120 && hNum <= 180) {
              // Emerald / Green indicators
              return opacity ? `rgba(16, 185, 129, ${opacity})` : `rgb(16, 185, 129)`;
            }
            if (hNum >= 200 && hNum <= 280) {
              // Blue / Indigo / Dark Slate elements
              if (lNum < 0.3) {
                return opacity ? `rgba(15, 23, 42, ${opacity})` : `rgb(15, 23, 42)`;
              }
              return opacity ? `rgba(59, 130, 246, ${opacity})` : `rgb(59, 130, 246)`;
            }
            if (lNum > 0.9) {
              // Soft backgrounds & off-whites
              return opacity ? `rgba(248, 250, 252, ${opacity})` : `rgb(248, 250, 252)`;
            }
            if (lNum < 0.2) {
              // High contrast deep grays
              return opacity ? `rgba(15, 23, 42, ${opacity})` : `rgb(15, 23, 42)`;
            }
            return opacity ? `rgba(100, 116, 139, ${opacity})` : `rgb(100, 116, 139)`;
          } catch (e) {
            return 'rgb(128, 128, 128)';
          }
        });
        
        colorCache.set(colorStr, result);
        return result;
      };

      // Rewrite oklch in all active style elements
      styleTags.forEach(tag => {
        const content = tag.textContent || '';
        originalStyleContentsByTag.set(tag, content);
        if (content.includes('oklch')) {
          tag.textContent = convertOklchToRgbVal(content);
        }
      });

      window.getComputedStyle = (el, pseudoElt) => {
        const style = originalGetComputedStyle(el, pseudoElt);
        return new Proxy(style, {
          get(target: any, prop: string | symbol) {
            const value = target[prop];
            if (typeof value === 'function') {
              if (prop === 'getPropertyValue') {
                return (propertyName: string) => {
                  const val = target.getPropertyValue(propertyName);
                  return typeof val === 'string' ? convertOklchToRgbVal(val) : val;
                };
              }
              return value.bind(target);
            }
            if (typeof prop === 'string' && typeof value === 'string') {
              return convertOklchToRgbVal(value);
            }
            return value;
          }
        }) as any;
      };

      // Create high-fidelity canvas representation
      const canvas = await html2canvas(element, {
        scale: 2, // Retain sharp display-device graphics
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Use standard A4 page size to fit the content beautifully
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      // Center the JDM certificate rendering within perfect A4 bounding margins
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pdfHeight - finalHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');
      pdf.save(`GARIAUDIT_REPORT_${previewData.id.toUpperCase()}.pdf`);
    } catch (err) {
      console.error('PDF Engine error:', err);
      alert('Critical Error occurred while compiling the PDF layout.');
    } finally {
      // Revert style content to restore beautiful oklch styles on the parent screen immediately
      originalStyleContentsByTag.forEach((content, tag) => {
        tag.textContent = content;
      });
      window.getComputedStyle = originalGetComputedStyle;
      setDownloading(false);
    }
  };


  const handleVerify = (id: string, name: string) => {
    setAuditors(prev => prev.map(a => a.id === id ? { ...a, status: 'VERIFIED' } : a));
    onApproveAuditor(id);
    alert(`${name} has been certified as Level 2 PRO Auditor inside the system.`);
  };

  const handleRelease = (gigId: string) => {
    onReleaseReport(gigId);
    alert('Inspection report validated, locked under PostgreSQL hash triggers, and released successfully to the buyer portal.');
  };

  return (
    <div className="bg-[#fbfbfb] text-[#1a1a1a] min-h-screen py-12 antialiased font-serif">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Admin Header display */}
        <div className="bg-white p-8 md:p-10 border border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-black text-white flex items-center justify-center font-bold text-sm font-sans">
              AD
            </div>
            <div>
              <span className="inline-block bg-black text-white text-[9px] font-sans font-bold uppercase tracking-[0.2em] px-2.5 py-1">
                Admin Secure Session
              </span>
              <h1 className="text-2xl font-light text-slate-100 font-serif mt-2">{text.adminTitle}</h1>
              <p className="text-xs text-gray-500 font-serif italic">Role: Marketplace Compliance Owner • Session Expires: 2026-05-29T13:30Z</p>
            </div>
          </div>
          <div className="flex gap-6 self-start md:self-center bg-[#fbfbfb] p-4 border border-black/10 text-xs">
            <div className="text-center">
              <div className="text-xl font-light text-slate-900 font-serif">{submittedGigs.length}</div>
              <div className="text-[9px] uppercase tracking-widest font-sans font-bold text-gray-400 mt-1">Pending QC</div>
            </div>
            <div className="border-r border-black/10" />
            <div className="text-center">
              <div className="text-xl font-light text-black font-serif">{auditors.filter(a => a.status === 'VERIFIED').length}</div>
              <div className="text-[9px] uppercase tracking-widest font-sans font-bold text-gray-400 mt-1">PRO Auditors</div>
            </div>
          </div>
        </div>

        {/* --- SUPABASE DATABASE AND STORAGE CONNECTION MONITOR (DIAGNOSTICS & SETUP HELP) --- */}
        <div className="bg-white p-8 border border-black/10 space-y-6 animate-fade-in" id="supabase-status-and-diagnostics font-serif">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-black/10 font-serif">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-rose-500 shrink-0 font-serif" />
              <div>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#1a1a1a] block font-serif">
                  {lang === 'en' ? 'Database & Schema Verification Services' : 'ডাটাবেজ ও স্কিমা ভেরিফিকেশন সার্ভিস'}
                </span>
                <h2 className="font-serif text-lg font-light text-[#1a1a1a] mt-0.5">
                  {lang === 'en' ? 'Supabase Backend Storage Monitor' : 'সুপাবেস ব্যাকএন্ড স্টোরেজ মনিটর'}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchDbStatus}
              disabled={dbLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-black/10 text-[10px] font-sans font-bold uppercase tracking-wider hover:bg-black/5 transition cursor-pointer font-serif"
            >
              <RefreshCw className={`h-3 w-3 ${dbLoading ? 'animate-spin' : ''}`} />
              {lang === 'en' ? 'Check Connection' : 'কানেকশন চেক'}
            </button>
          </div>

          {dbLoading ? (
            <div className="py-6 flex items-center justify-center gap-2 font-serif">
              <RefreshCw className="h-4 w-4 animate-spin text-rose-500" />
              <span className="text-[11px] font-mono tracking-widest uppercase">Pinging Supabase REST Engine...</span>
            </div>
          ) : !dbStatus || !dbStatus.configured ? (
            <div className="bg-amber-50/70 p-6 border border-amber-200 space-y-3 font-serif">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-900 font-sans uppercase tracking-[0.05em]">
                    {lang === 'en' ? 'SUPABASE CONFIGURATION DISCONNECTED' : 'সুপাবেস কনফিগারেশন ডিসকানেক্টেড'}
                  </h4>
                  <p className="text-xs text-amber-800 font-serif leading-relaxed">
                    {lang === 'en' 
                      ? 'The server backend cannot locate your SUPABASE_URL or SUPABASE_ANON_KEY inside the environment or Project Secrets. The application has successfully initialized the fail-safe localStorage Fallback mode.'
                      : 'সার্ভার ব্যাকএন্ড আপনার SUPABASE_URL অথবা SUPABASE_ANON_KEY খুঁজে পায়নি। নিরাপত্তা সুরক্ষায় অ্যাপ্লিকেশনটি লোকাল স্টোরেজ মোডে চালু হয়েছে।'}
                  </p>
                  {dbStatus?.error && (
                    <div className="bg-white/75 p-3 rounded-sm text-[10px] font-mono text-rose-700 border border-rose-100 overflow-x-auto mt-2">
                      Error Details: {dbStatus.error}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[11px] text-[#554c3e] pl-8 font-serif leading-relaxed">
                <p className="font-bold underline">How to Configure Secrets:</p>
                <ol className="list-decimal pl-4 space-y-1 mt-1">
                  <li>Click on the <strong>Settings</strong> button or the <strong>Secrets API Keys Manager</strong> in your AI Studio dashboard.</li>
                  <li>Define two Secrets: <code className="font-mono bg-white px-1 py-0.5 text-black">SUPABASE_URL</code> and <code className="font-mono bg-white px-1 py-0.5 text-black">SUPABASE_ANON_KEY</code>.</li>
                  <li>Save them to authorize server-side connection immediately.</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-6 font-serif text-[#161616]">
              {/* Connection Success Indicator */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-emerald-50/40 p-6 border border-emerald-100 items-start">
                <div className="md:col-span-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-sans font-bold uppercase text-[9px] tracking-widest">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>ONLINE ● INTEGRATION ACTIVE</span>
                  </div>
                  <h3 className="text-md font-serif text-slate-900 font-medium">{lang === 'en' ? 'Active Handshake Established' : 'সক্রিয় কানেকশন স্থাপিত'}</h3>
                  <p className="text-[11px] text-gray-500 font-serif leading-relaxed">
                    {lang === 'en' 
                      ? 'The Node server is proxying requests to Supabase securely. Client API keys are completely hidden inside server environment.'
                      : 'নোড ব্যাকএন্ড সফলভাবে নিরাপদ উপায়ে সুপাবেস এপিআই হ্যান্ডশেক সম্পন্ন করেছে। এপিআই কী ব্রাউজারে দেখতে পাওয়া যাবে না।'}
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-gray-400">
                    Host: <span className="text-[#101828] font-bold">{dbStatus.url}</span>
                  </div>
                </div>

                {/* Table Schema Grid Checker */}
                <div className="md:col-span-8 space-y-3 font-sans">
                  <span className="block text-[9px] font-sans font-bold text-gray-400 uppercase tracking-widest">
                    {lang === 'en' ? 'DATABASE TABLE ACCESS REPORT' : 'ডাটাবেজ টেবিল রেজিস্ট্রি রিপোর্ট'}
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(dbStatus.tables || {}).map(([tableName, s]: any) => (
                      <div key={tableName} className="bg-[#fcfcfc] p-3.5 border border-black/10 flex flex-col justify-between h-[105px]">
                        <div className="flex justify-between items-start gap-1">
                          <span className="font-mono text-[10.5px] font-bold text-gray-900 truncate" title={tableName}>
                            {tableName}
                          </span>
                          <span className={`px-1.5 py-0.5 text-[8px] font-sans font-bold rounded-sm uppercase ${
                            s.exists 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-rose-100 text-rose-800 animate-pulse'
                          }`}>
                            {s.exists ? 'Active' : 'Missing'}
                          </span>
                        </div>
                        
                        <div className="mt-2 flex justify-between items-baseline">
                          <span className="text-[10px] text-gray-400">Rows:</span>
                          <span className="font-mono text-xs font-semibold text-slate-800">
                            {s.exists ? s.rows : '—'}
                          </span>
                        </div>

                        {!s.exists && (
                          <div className="text-[7.5px] text-rose-500 font-sans tracking-tight font-bold whitespace-nowrap overflow-hidden text-ellipsis mt-1">
                            Missing database schema table!
                          </div>
                        )}
                        {s.exists && s.rows === 0 && (
                          <div className="text-[7.5px] text-amber-600 font-sans tracking-tight mt-1">
                            Empty database table.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons for Seeding and Copying schema */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[#fbfbfb] border border-black/5">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 font-sans uppercase tracking-[0.05em]">
                    {lang === 'en' ? 'DATABASE SEED AND SCHEMAS COMMAND' : 'ডাটাবেজ ডেমো ডাটা এবং স্কিমা কমান্ড'}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-serif leading-relaxed">
                    {lang === 'en' 
                      ? 'If some tables are marked as "Missing", run the SQL schema initialization block below in your Supabase dashboard SQL Editor. If tables are active but empty, pre-seed sample audits.'
                      : 'যদি কোনো টেবিল "Missing" দেখায়, নিচে দেওয়া লকিং এসকিউএল স্ক্রিপ্টটি সুপাবেস ড্যাশবোর্ডে গিয়ে রান করুন।'}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-black text-[10.5px] font-sans font-bold uppercase tracking-wider hover:bg-black hover:text-white transition cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {sqlCopied ? (lang === 'en' ? 'COPIED!' : 'কপি হয়েছে!') : (lang === 'en' ? 'COPY SCHEMA SQL' : 'কপি স্কিমা SQL')}
                  </button>

                  <button
                    type="button"
                    onClick={handleRunSeeding}
                    disabled={seedLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white hover:bg-neutral-850 text-[10.5px] font-sans font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
                  >
                    <Sliders className={`h-3.5 w-3.5 ${seedLoading ? 'animate-spin' : ''}`} />
                    {lang === 'en' ? 'SEED SAMPLE DATA' : 'ডেমো ডাটা প্রিপপুলেট'}
                  </button>
                </div>
              </div>

              {seedMessage && (
                <div className="bg-rose-50 border border-rose-100 p-4 font-mono text-[11px] text-rose-800 whitespace-pre-wrap animate-fade-in">
                  Status Code Msg: {seedMessage}
                </div>
              )}

              {/* Expandable Manual Instructions schema */}
              <details className="group border border-black/10 bg-[#fbfbfb] p-4 text-xs font-sans cursor-pointer">
                <summary className="flex items-center justify-between font-bold uppercase tracking-wider select-none">
                  <span>How to Paste the SQL Schema into Supabase? Click to read guide</span>
                  <span className="text-gray-400 group-open:rotate-180 transition">↓</span>
                </summary>
                
                <div className="mt-4 space-y-3 font-serif cursor-default text-gray-700 leading-relaxed max-w-4xl pl-4 border-l border-black/10">
                  <p>Follow these quick, easy steps to create the necessary tables in your Supabase dashboard:</p>
                  <ol className="list-decimal pl-4 space-y-2 font-serif text-[12.5px]">
                    <li>Open your <a href="https://supabase.com/dashboard" target="_blank" referrerPolicy="no-referrer" className="text-rose-600 underline font-semibold">Supabase Dashboard</a>.</li>
                    <li>Select the exact project you mapped to your app secrets.</li>
                    <li>Look at the left-most sidebar navigation rail and click on the <strong>SQL Editor</strong> icon (it looks like a terminal document with <code className="font-mono bg-black text-white px-1">SQL</code>).</li>
                    <li>Click <strong>New Query</strong> at the top.</li>
                    <li>Click the <strong>"COPY SCHEMA SQL"</strong> button above, then paste the clipboard content directly into the query editor workspace in Supabase.</li>
                    <li>Click the <strong>Run</strong> button in the bottom right of the Supabase SQL editor.</li>
                    <li>All six tables and operational series data will immediately render successfully. Come back here and click <strong>Check Connection</strong>!</li>
                  </ol>
                </div>
              </details>
            </div>
          )}
        </div>

        {/* --- HIGH-LEVEL OPERATIONAL OVERVIEW DASHBOARD (RECHARTS) --- */}
        <div className="bg-white p-8 border border-black/10 space-y-6 animate-fade-in" id="admin-operational-analytics">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="h-5 w-5 text-black shrink-0" />
              <div>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#1a1a1a] block">
                  {lang === 'en' ? 'Operational Performance' : 'অপারেশনাল পারফরম্যান্স তথ্যচিত্র'}
                </span>
                <h3 className="font-serif text-lg font-light text-[#1a1a1a] mt-0.5">
                  {lang === 'en' ? 'Administrative Analytics Center' : 'অফিশিয়াল অপারেশনাল অ্যানালিটিক্স সেন্টার'}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddMockAudit}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-black/10 bg-black text-white hover:bg-neutral-850 hover:border-black transition font-sans font-bold uppercase tracking-wider text-[9px] cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                {lang === 'en' ? 'Simulate Live Audit' : 'লাইভ অডিট সিমুলেট করুন'}
              </button>
              <div className="flex border border-black/15 text-[9px] font-sans font-bold">
                <button
                  type="button"
                  onClick={() => setAnalyticsWindow('7d')}
                  className={`px-3 py-2 uppercase tracking-wide cursor-pointer transition ${
                    analyticsWindow === '7d' ? 'bg-black text-white' : 'bg-[#fbfbfb] text-gray-500 hover:text-black'
                  }`}
                >
                  {lang === 'en' ? 'Last 7 Days' : 'গত ৭ দিন'}
                </button>
                <button
                  type="button"
                  onClick={() => setAnalyticsWindow('all')}
                  className={`px-3 py-2 uppercase tracking-wide cursor-pointer transition border-l border-black/15 ${
                    analyticsWindow === 'all' ? 'bg-black text-white' : 'bg-[#fbfbfb] text-gray-500 hover:text-black'
                  }`}
                >
                  {lang === 'en' ? 'All Records' : 'সকল রেকর্ড'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Sub-row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#fbfbfb] p-5 border border-black/5 text-xs">
            <div>
              <span className="block text-[8px] font-sans font-bold text-gray-400 uppercase tracking-widest">
                {lang === 'en' ? 'Total Audits Logged' : 'মোট নিরীক্ষিত গাড়ি'}
              </span>
              <span className="text-xl font-light font-serif mt-1 block">
                {operationalData.reduce((acc, item) => acc + item.volume, 0)}
              </span>
            </div>
            <div className="border-l border-black/5 pl-4">
              <span className="block text-[8px] font-sans font-bold text-gray-400 uppercase tracking-widest">
                {lang === 'en' ? 'Avg Inspection Score' : 'গড় গাড়ি ফিটনেস স্কোর'}
              </span>
              <span className="text-xl font-light font-serif mt-1 block text-emerald-800">
                {Math.round(operationalData.reduce((acc, item) => acc + item.avgScore, 0) / operationalData.length)}%
              </span>
            </div>
            <div className="border-l border-black/5 pl-4">
              <span className="block text-[8px] font-sans font-bold text-gray-400 uppercase tracking-widest">
                {lang === 'en' ? 'Active Inspectors' : 'সচল মেকানিক সংখ্যা'}
              </span>
              <span className="text-xl font-light font-serif mt-1 block">
                {operationalData[operationalData.length - 1]?.activeAuditors || 8}
              </span>
            </div>
            <div className="border-l border-black/5 pl-4">
              <span className="block text-[8px] font-sans font-bold text-gray-400 uppercase tracking-widest">
                {lang === 'en' ? 'Data Integrity Rate' : 'ডাটা ইন্টিগ্রিটি হার'}
              </span>
              <span className="text-xl font-light font-serif mt-1 block text-[#1a1a1a]">
                100.0%
              </span>
            </div>
          </div>

          {/* Two Recharts Columns layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
            
            {/* Chart 1: Daily Audit Volume (Bar/Area) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-black/5">
                <span className="font-sans font-bold uppercase tracking-wider text-[10px] text-gray-500 flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  {lang === 'en' ? 'DAILY AUDIT VOLUME TRENDS' : 'দৈনিক সম্পন্ন অডিট পরিমাণ'}
                </span>
                <span className="font-mono text-[9px] text-[#1a1a1a] bg-black/5 px-2 py-0.5">
                  KPI: {lang === 'en' ? 'Volume index' : 'ভলিউম ইডেক্স'}
                </span>
              </div>
              <div className="h-[260px] w-full mt-2 animate-fade-in">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analyticsWindow === '7d' ? operationalData.slice(-7) : operationalData}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#000000" stopOpacity={0.12}/>
                        <stop offset="95%" stopColor="#000000" stopOpacity={0.00}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 9, fontFamily: 'monospace', fill: '#66aa55' }}
                      axisLine={{ stroke: '#ddd' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 9, fontFamily: 'monospace', fill: '#666' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="volume" 
                      name="volume"
                      stroke="#1a1a1a" 
                      strokeWidth={1.5}
                      fillOpacity={1} 
                      fill="url(#colorVolume)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-gray-400 font-serif italic text-center">
                {lang === 'en'
                  ? 'Displays total incoming pre-purchase vehicle checklists approved and verified.'
                  : 'সংগৃহীত এবং অ্যাডমিন ভেরিফাইড মোট জেডিএম গাড়ির চেকলিস্টের নিখুঁত দৈনিক চার্ট।'}
              </p>
            </div>

            {/* Chart 2: Average Inspection Score Trend (Line) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-black/5">
                <span className="font-sans font-bold uppercase tracking-wider text-[10px] text-gray-500 flex items-center gap-1.5">
                  <Activity className="h-3 w-3 text-slate-700" />
                  {lang === 'en' ? 'AVERAGE INPSECTION QUALITY INDEX' : 'গড় কোয়ালিটি ইনডেক্স ট্রেন্ড'}
                </span>
                <span className="font-mono text-[9px] text-[#1a1a1a] bg-[#e11d48]/10 text-[#e11d48] px-2 py-0.5 font-bold">
                  Target: 80%+
                </span>
              </div>
              <div className="h-[260px] w-full mt-2 animate-fade-in">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analyticsWindow === '7d' ? operationalData.slice(-7) : operationalData}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 9, fontFamily: 'monospace', fill: '#66aa55' }}
                      axisLine={{ stroke: '#ddd' }}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[50, 100]}
                      tick={{ fontSize: 9, fontFamily: 'monospace', fill: '#666' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="avgScore" 
                      name="avgScore"
                      stroke="#e11d48" 
                      strokeWidth={2}
                      dot={{ r: 3, stroke: '#e11d48', strokeWidth: 1.5, fill: '#fff' }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-gray-400 font-serif italic text-center">
                {lang === 'en'
                  ? 'Tracks average calculated physical condition grades of inspected vehicle stock.'
                  : 'অডিটরদের চেকলিস্টের ভিত্তিতে অটো-ক্যালকুলেটেড ফিটনেস স্কোরের দৈনিক গড় মান।'}
              </p>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Register KYC list and verification approvals */}
          <div className="lg:col-span-6 bg-white p-8 border border-black/10 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-black/10">
              <UserCheck className="h-4 w-4 text-black" />
              <h3 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-xs">{text.verifyDocuments}</h3>
            </div>

            <div className="space-y-4">
              {auditors.map((auditor) => (
                <div key={auditor.id} className="p-5 border border-black/5 bg-[#fbfbfb] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-serif">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-bold text-xs uppercase tracking-wider text-slate-950">{auditor.name}</span>
                      <span className={`px-2 py-0.5 border text-[9px] font-sans font-bold uppercase tracking-wider ${auditor.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                        {auditor.status}
                      </span>
                    </div>
                    <p className="text-gray-500 font-mono tracking-tight">NID / License: {auditor.shopLicense} • Contact: {auditor.phone}</p>
                    <div className="flex gap-1.5 mt-2">
                      {auditor.skills.map(s => (
                        <span key={s} className="bg-white border border-black/10 text-gray-600 text-[8px] font-mono font-bold px-2 py-0.5 uppercase">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {auditor.status === 'PENDING' && (
                    <button
                      onClick={() => handleVerify(auditor.id, auditor.name)}
                      className="inline-flex items-center justify-center border border-black bg-white text-black font-sans font-bold uppercase tracking-wider text-[10px] px-4 py-2.5 hover:bg-black hover:text-white transition shrink-0 cursor-pointer"
                    >
                      Approve KYC
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Pre-purchase Inspections waiting for QC clearance */}
          <div className="lg:col-span-6 bg-white p-8 border border-black/10 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-black/10">
              <ShieldCheck className="h-4 w-4 text-black" />
              <h3 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-xs">{text.qcSpot}</h3>
            </div>

            {/* Aesthetic PDF Layout Review Sandbox Area */}
            <div className="p-5 border border-black bg-[#fbfbfb] space-y-3">
              <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[9px] uppercase tracking-widest">
                <span className="inline-block h-1.5 w-1.5 bg-yellow-600 animate-pulse rounded-full" />
                <span>Editorial PDF Review Sandbox</span>
              </div>
              <h4 className="font-sans font-bold uppercase tracking-wider text-[11px] text-[#1a1a1a]">
                PDF Report Format Verifier
              </h4>
              <p className="text-gray-500 text-xs font-serif leading-relaxed">
                Trigger instant interactive mock renderings of our A4-styled inspection certificates to audit font pairings, compliance stickers, and alignment consistency:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleGeneratePreview(null, 'allion')}
                  className="px-2 py-2 border border-black/15 bg-white text-slate-800 font-sans font-bold uppercase tracking-wider text-[8px] hover:bg-black hover:text-white transition cursor-pointer text-center"
                >
                  📄 Toyota Allion
                </button>
                <button
                  type="button"
                  onClick={() => handleGeneratePreview(null, 'premio')}
                  className="px-2 py-2 border border-black/15 bg-white text-slate-800 font-sans font-bold uppercase tracking-wider text-[8px] hover:bg-black hover:text-white transition cursor-pointer text-center"
                >
                  📄 Premio Hybrid
                </button>
                <button
                  type="button"
                  onClick={() => handleGeneratePreview(null, 'vezel')}
                  className="px-2 py-2 border border-black/15 bg-white text-slate-800 font-sans font-bold uppercase tracking-wider text-[8px] hover:bg-black hover:text-white transition cursor-pointer text-center"
                >
                  📄 Vezel DCD Gear
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {submittedGigs.length === 0 ? (
                <div className="py-12 border border-dashed border-black/15 text-center text-gray-400 text-xs font-serif italic">
                  No pending inspection checklists submitted by mechanics right now. Users can submit checklists in real-time from the Auditor Portal page.
                </div>
              ) : (
                submittedGigs.map((item) => (
                  <div key={item.id} className="p-5 border border-black/5 bg-[#fbfbfb] space-y-4 text-xs font-serif">
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div>
                        <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">Toyota reconditioned JDM audit</h4>
                        <p className="text-gray-400 font-mono tracking-tight mt-1">Location: {item.locationText} • Status: SUBMITTED</p>
                      </div>
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 text-[9px] font-sans font-bold uppercase tracking-widest">
                        QC PENDING APPROVED
                      </span>
                    </div>

                    <div className="p-4 bg-white border border-black/10 border-l-4 border-l-black font-mono space-y-2 text-[#1a1a1a] leading-relaxed text-[10px]">
                      <p>• Check 1: Chassis Welding - NO WELD DETECTED</p>
                      <p>• Check 2: Underbody Rust - SURFACE ONLY</p>
                      <p>• Check 3: Odometer Rolled Back - WARNING ALERT (export log mismatched)</p>
                      <p>• Checklist Photo Count: 10 / 10 successfully uploaded.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleGeneratePreview(item)}
                        className="inline-flex items-center justify-center gap-2 border border-black bg-white text-black font-sans font-bold uppercase tracking-widest text-[10px] py-3 hover:bg-black hover:text-white transition cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Generate Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRelease(item.id)}
                        className="inline-flex items-center justify-center gap-2 border border-black bg-black text-white font-sans font-bold uppercase tracking-widest text-[10px] py-3 hover:bg-white hover:text-black transition cursor-pointer"
                      >
                        <FileSignature className="h-3.5 w-3.5" />
                        {text.approveReport}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* 3. Marketplace disputes list */}
        <div className="bg-white p-8 border border-black/10 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-black/10">
            <Scale className="h-4 w-4 text-black" />
            <h3 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a] text-xs">{text.disputeResolve}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-serif leading-relaxed">
            
            <div className="p-5 border border-black/5 bg-[#fbfbfb] space-y-2">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="font-sans font-bold uppercase tracking-wider text-[11px] text-[#1a1a1a]">Dispute #DIS-9612 • bKash Deposit</span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-0.5">
                  Resolved
                </span>
              </div>
              <p className="text-gray-500 text-xs font-serif leading-relaxed">
                Requester reported transaction delay. SQL search found active timestamp discrepancy. Wallet confirmed, audit successfully assigned in Dhaka Dhanmondi.
              </p>
            </div>

            <div className="p-5 border border-black/5 bg-[#fbfbfb] space-y-2">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="font-sans font-bold uppercase tracking-wider text-[11px] text-[#1a1a1a]">Dispute #DIS-9840 • Access refusal</span>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-0.5">
                  Under Review
                </span>
              </div>
              <p className="text-gray-500 text-xs font-serif leading-relaxed">
                Broker refused access to paint depth gauge device. Auditor requested immediate dispute intervention. Dispatching central senior field supervisor.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* STUNNING INTERACTIVE EDITORIAL PDF REPORT PREVIEW MODAL */}
      {isPreviewOpen && previewData && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-[#1e293b] text-white border border-slate-700 w-full max-w-4xl shadow-2xl p-6 md:p-8 space-y-6">
            
            {/* Modal Controls Header */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div>
                <h3 className="font-sans font-bold uppercase tracking-widest text-xs text-yellow-500 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  PRE-RELEASE INSPECTION CERTIFICATE COMPLIANCE AUDIT
                </h3>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  Aesthetic layout verification • Authentic JDM letterhead specs (CJS: {previewData.id})
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Print action simulation */}
                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => {
                    setDownloading(true);
                    setTimeout(() => {
                      setDownloading(false);
                      window.print();
                    }, 1400);
                  }}
                  className="bg-transparent text-slate-300 hover:text-white border border-slate-600 px-3 py-1.5 text-[10px] font-sans font-bold uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Printer className="h-3 w-3" />
                  {downloading ? 'Compiling Raster...' : 'Simulate A4 Print'}
                </button>

                <button
                  type="button"
                  disabled={downloading}
                  onClick={handleDownloadPDF}
                  className="bg-yellow-600 text-black border border-yellow-500 px-3 py-1.5 text-[10px] font-sans font-bold uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer hover:bg-yellow-500 disabled:opacity-50"
                >
                  <Download className="h-3 w-3" />
                  {downloading ? 'Generating PDF...' : 'Download PDF Draft'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="bg-red-950 text-red-400 border border-red-800 p-2 hover:bg-red-900 hover:text-white transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* THE PRINT SHEET CONTAINER (Mimics absolute true physical layout precision) */}
            <div className="bg-slate-900 border border-slate-800 p-4 max-h-[70vh] overflow-y-auto">
              <div id="physical-pdf-print-sheet" className="bg-white text-slate-900 p-8 md:p-12 font-serif text-xs max-w-2xl mx-auto shadow-inner relative space-y-8 select-none">
                
                {/* PDF Hairline Grid Boundaries Accent */}
                <div className="absolute top-4 left-4 right-4 bottom-4 border border-slate-100 pointer-events-none" />

                {/* Print Header */}
                <div className="flex justify-between items-start border-b border-black/10 pb-5">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono font-bold tracking-widest text-[#0ea5e9]">
                      SYSTEM COMPLIANCE CODE: GOV-BD-2026-A
                    </span>
                    <h2 className="text-lg font-sans font-extrabold uppercase tracking-widest text-[#1e293b]">
                      GARIAUDIT BANGLADESH
                    </h2>
                    <p className="font-sans text-[8px] tracking-wide text-gray-400 uppercase">
                      Official JDM Reconditioned Pre-Purchase Verification Document
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="inline-block border border-slate-300 p-1 font-mono text-[8px] tracking-tighter">
                      |||||||||| | ||| |||| | |
                    </div>
                    <p className="font-mono text-[7px] text-gray-500 block uppercase">
                      Certificate ID: {previewData.id}
                    </p>
                  </div>
                </div>

                {/* Subtitle letterhead tagline */}
                <div className="text-center font-serif italic text-[11px] text-slate-500 border-b border-black/5 pb-2">
                  "Transparent mechanics, verified authentic database ledgers, zero administrative compromise."
                </div>

                {/* SECTION 1: VEHICLE DIAGNOSTICS DEEP LOG */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-black/10 pb-1">
                    <span className="font-sans font-bold uppercase text-[9px] tracking-widest text-[#1a1a1a]">
                      I. CERTIFIED IDENTIFICATION MATRIX
                    </span>
                    <span className="font-mono text-[8px] text-slate-400 italic">
                      Locked Timestamp: 2026-05-29 12:44 UTC
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[11px]">
                    <div className="space-y-1">
                      <p><span className="font-mono font-bold text-[10px] text-slate-400">VEHICLE MODEL:</span> <span className="font-bold font-sans uppercase">{previewData.model}</span></p>
                      <p><span className="font-mono font-bold text-[10px] text-slate-400">CHASSIS STAMP:</span> <span className="font-mono font-bold">{previewData.chassisCode}</span></p>
                      <p><span className="font-mono font-bold text-[10px] text-slate-400">SCAN CODES:</span> <span className="font-mono text-[10px]">OBD-II CAN / HEX-BUSS-ISO</span></p>
                    </div>

                    <div className="space-y-1 border-l border-slate-100 pl-4">
                      <p><span className="font-mono font-bold text-[10px] text-slate-400">SCAN SITE:</span> <span className="font-bold">{previewData.location}</span></p>
                      <p><span className="font-mono font-bold text-[10px] text-slate-400">NID EXAMINER:</span> <span className="font-bold">{previewData.auditorName} ({previewData.auditorLicense})</span></p>
                      <p><span className="font-mono font-bold text-[10px] text-slate-400">SECURE LOG:</span> <span className="font-mono text-[8px] text-emerald-700 bg-emerald-50 px-1 py-0.5">VERIFIED STACK</span></p>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: ODOMETER & SOFTWARE INTEGRITY */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-black/10 pb-1">
                    <span className="font-sans font-bold uppercase text-[9px] tracking-widest text-[#1a1a1a]">
                      II. ODOMETER MILEAGE LOG INTEGRITY
                    </span>
                    {previewData.odometerStatus === 'FAIL' ? (
                      <span className="px-2 py-0.5 border border-red-200 bg-red-50 text-red-800 font-sans font-bold text-[8px] uppercase tracking-widest animate-pulse">
                        ⚠️ WARNING: MALFEASANCE DETECTED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 border border-emerald-200 bg-emerald-50 text-emerald-800 font-sans font-bold text-[8px] uppercase tracking-widest">
                        AUTHENTIC LOG
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-xs leading-relaxed italic">
                    {previewData.odometerStatus === 'FAIL' 
                      ? 'Critically High Mismatch! The physical instrument cluster clock has been altered post-import to hide wear. High backup-memory registers verified the original true miles.'
                      : 'Odometer mileage data is original, consistent with our export and import documentation database registries.'
                    }
                  </p>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 border border-slate-100 text-center text-xs">
                    <div>
                      <span className="block font-mono text-[9px] text-slate-400 uppercase font-bold">REVEALED INSTRUMENT</span>
                      <span className={`font-mono font-bold text-sm ${previewData.odometerStatus === 'FAIL' ? 'text-red-600 line-through' : 'text-slate-800'}`}>
                        {previewData.odometerKM}
                      </span>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] text-slate-400 uppercase font-bold">INTERNAL EEPROM LOG</span>
                      <span className="font-mono font-bold text-slate-800 text-sm">
                        {previewData.ecuBackupKM}
                      </span>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] text-slate-400 uppercase font-bold">STATUS ASSESSMENT</span>
                      <span className={`font-sans font-extrabold block text-xs ${previewData.odometerStatus === 'FAIL' ? 'text-red-700' : 'text-emerald-700'}`}>
                        {previewData.odometerStatus === 'FAIL' ? 'ROLLBACK TAMPER' : 'VERIFIED MILES'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: POWERTRAIN & PHYSICAL STRUCTURAL REPORT */}
                <div className="space-y-4">
                  <div className="border-b border-black/10 pb-1">
                    <span className="font-sans font-bold uppercase text-[9px] tracking-widest text-[#1a1a1a]">
                      III. DEEP MECHANICAL & HV BATTERY DIAGNOSIS
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] sm:text-xs">
                    <div className="p-2.5 border border-slate-200 space-y-1">
                      <span className="font-sans font-bold text-[#1a1a1a] block uppercase text-[8px] tracking-wider">CHASSIS & SUBFRAME</span>
                      <p className="text-gray-500 font-mono tracking-tight">Laser alignment delta: {previewData.chassisDeviation}</p>
                      <span className="inline-block bg-emerald-50 text-emerald-800 text-[8px] font-sans font-bold px-1.5 uppercase">
                        STRUCTURAL: PASS
                      </span>
                    </div>

                    <div className="p-2.5 border border-slate-200 space-y-1">
                      <span className="font-sans font-bold text-[#1a1a1a] block uppercase text-[8px] tracking-wider">DCD GEARBOX CLUTCH</span>
                      <p className="text-gray-500 font-mono tracking-tight">Actuator Leakage: {previewData.clutchLeakage}</p>
                      <span className={`inline-block text-[8px] font-sans font-bold px-1.5 uppercase ${
                        previewData.clutchStatus === 'FAIL' ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        CLUTCH: {previewData.clutchStatus}
                      </span>
                    </div>

                    <div className="p-2.5 border border-slate-200 space-y-1">
                      <span className="font-sans font-bold text-[#1a1a1a] block uppercase text-[8px] tracking-wider">HYBRID ENERGY CELL</span>
                      <p className="text-gray-500 font-mono tracking-tight">Capacity: {previewData.batteryHealthSoH}</p>
                      <span className="inline-block bg-emerald-50 text-emerald-800 text-[8px] font-sans font-bold px-1.5 uppercase">
                        SOH STATE: NORMAL
                      </span>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: EDITORIAL SIGN OFF & STAMPS */}
                <div className="pt-6 border-t border-dashed border-slate-300">
                  <div className="flex justify-between items-end">
                    
                    {/* Compliance Seal Stamp Layout */}
                    <div className="relative flex items-center gap-3">
                      <div className="h-14 w-14 rounded-full border-2 border-double border-red-700 text-red-700 flex flex-col items-center justify-center font-sans uppercase font-black text-[6px] tracking-tighter scale-95 select-none opacity-80 leading-none">
                        <span>GARIAUDIT</span>
                        <span className="font-bold my-0.5">QC APPROVED</span>
                        <span>DHAKA</span>
                      </div>
                      <div className="space-y-0.5 text-[8px] text-gray-500 font-mono">
                        <p>VERIFIED FOR RELEASE</p>
                        <p>PORT ADAPTER STATE: OK</p>
                        <p className="text-[7px]">COMPLIANCE CHIEF: APPROVED</p>
                      </div>
                    </div>

                    {/* Cryptographic Hash line */}
                    <div className="text-right space-y-1">
                      <div className="italic text-gray-500 text-[10px] pr-2">
                        Jamil Rahman
                      </div>
                      <div className="h-0.5 w-32 bg-slate-900 ml-auto" />
                      <p className="font-sans text-[8px] font-bold text-gray-400 uppercase tracking-widest block">
                        CHIEF MECHANIC INSPECTOR SIGNATURE
                      </p>
                    </div>

                  </div>
                </div>

                {/* Database checksum footer */}
                <div className="pt-6 border-t border-slate-100 text-[8px] font-mono text-gray-400 flex flex-wrap justify-between gap-2">
                  <span>HASH: {previewData.hashSignature}</span>
                  <span>BUILD SPEC VERSION: RECON-9.2.1</span>
                </div>

              </div>
            </div>

            {/* Bottom Alert disclaimer */}
            <div className="flex bg-slate-900 border border-slate-800 p-4 gap-3 text-xs leading-relaxed text-slate-400">
              <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
              <p>
                <strong>Editorial Quality Notice:</strong> This interactive PDF layout contains exact grid alignments based on A4 metrics. Confirm that headers do not trigger margin overlaps before promoting the status byte to are <strong>RELEASED</strong> state. No un-released logs will be indexed by public user search.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

