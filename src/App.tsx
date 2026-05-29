/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Gig } from './types';
import LandingPage from './components/LandingPage';
import BuyerPortal from './components/BuyerPortal';
import AuditorPortal from './components/AuditorPortal';
import AdminPortal from './components/AdminPortal';
import Footer from './components/Footer';
import { TRANSLATIONS } from './data';
import { Compass, ShieldX, CheckSquare, UserCheck, Languages, Download, Layers } from 'lucide-react';
import { getGigs, createGig, updateGigStatus } from './supabaseClient';

export default function App() {
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [activeTab, setActiveTab] = useState<'landing' | 'buyer' | 'auditor' | 'admin'>('landing');

  // Gigs and jobs central state
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [supabaseLoading, setSupabaseLoading] = useState<boolean>(true);

  // Load from Supabase (or localStorage fallback) on mount
  const reloadData = async () => {
    try {
      const fetched = await getGigs();
      setGigs(fetched);
    } catch (e) {
      console.error('Failed to reload gigs', e);
    } finally {
      setSupabaseLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
    // Live update poller every 5 seconds for interactive collab feeling
    const interval = setInterval(reloadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const pushLog = (..._args: any[]) => {};

  // 1. Buyer books inspection workflow - hooks directly into Supabase OR fallback
  const handleBookInspection = async (data: {
    assetType: 'CAR'|'EV'|'SCOOTER';
    vehicleModel: string;
    plateNumber: string;
    locationText: string;
    notes?: string;
    method: 'WALLET_TX'|'CASH';
    txId: string;
    walletNo: string;
  }) => {
    const newId = 'gig_' + Math.floor(Math.random() * 900000 + 100000);
    
    await createGig({
      id: newId,
      requesterUserId: 'usr_buyer_active',
      assetType: data.assetType,
      status: 'POSTED',
      scheduledStart: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      scheduledEnd: new Date(Date.now() + 26 * 3600 * 1000).toISOString(),
      locationText: data.locationText,
      locationLat: 23.7771,
      locationLng: 90.3912,
      priceAmount: 5000,
      currency: 'BDT',
      notes: data.notes || '',
      vehicleModel: data.vehicleModel,
      plateNumber: data.plateNumber,
      walletNo: data.walletNo,
      txId: data.txId,
      answers: null
    } as any);

    await reloadData();

    // Push Developer Logs for simulation audits
    pushLog(
      'API_REQUEST',
      'POST /gigs (Idempotent booking request)',
      `HEADERS:
  Authorization: Bearer jwt_p9285...
  X-Supabase-Status: CONNECTED

BODY:
{
  "id": "${newId}",
  "asset_type": "${data.assetType}",
  "location_text": "${data.locationText}",
  "vehicle_model": "${data.vehicleModel}",
  "plate_number": "${data.plateNumber}",
  "tx_id": "${data.txId}"
}`
    );
  };

  // 2. Auditor claims gig workflow
  const handleClaimGig = async (gigId: string) => {
    // Picked by standard auditor
    await updateGigStatus(gigId, 'ACCEPTED', {
      auditorUserId: 'usr_auditor_7890'
    });
    
    await reloadData();

    pushLog(
      'API_REQUEST',
      `POST /gigs/${gigId}/accept (Claim available inspection)`,
      `HEADERS:
  Authorization: Bearer jwt_auditor_7890

RESPONSE (200 OK):
{
  "gig_id": "${gigId}",
  "auditor_user_id": "usr_auditor_7890",
  "status": "ACCEPTED"
}`
    );
  };

  // 3. Auditor submits checklist workflow
  const handleAuditSubmit = async (gigId: string, answers: any) => {
    await updateGigStatus(gigId, 'SUBMITTED', {
      answers
    });
    
    await reloadData();

    pushLog(
      'API_REQUEST',
      `POST /jobs/job_${gigId.substring(4)}/audit/submit`,
      `BODY:
{
  "answers": ${JSON.stringify(answers, null, 2)}
}`
    );
  };

  // 4. Admin releases report to buyer
  const handleReleaseReport = async (gigId: string) => {
    // Generate a beautiful verified report score and outline summary
    const originalGig = gigs.find(g => g.id === gigId);
    const answers = (originalGig as any)?.answers || {};
    
    // Calculate a fitness score based on audit checklist
    let score = 95;
    if (answers.chassis_salvage === true || answers.chassis_salvage === 'true') score -= 35;
    if (answers.odometer_rollback === true || answers.odometer_rollback === 'true') score -= 25;
    if (answers.obd2_cleared_recent === true || answers.obd2_cleared_recent === 'true') score -= 15;
    if (answers.corrosion_underbody === 'Structural Rot') score -= 20;
    else if (answers.corrosion_underbody === 'Surface Rust') score -= 10;
    if (score < 20) score = 20;

    let overallStatus: 'OK' | 'WARNING' | 'CRITICAL' = 'OK';
    if (score < 60) overallStatus = 'CRITICAL';
    else if (score < 85) overallStatus = 'WARNING';

    const summaryText = `Fully evaluated ${originalGig?.vehicleModel || 'vehicle'}. ` +
      (score < 60 
        ? 'CRITICAL structure issues and safety alerts logged. Severe restoration required.' 
        : score < 85 
          ? 'Passed basic safety tests, but warnings are logged regarding OBD2 clear-outs or coastal rust. Buyer caution advised.' 
          : 'Outstanding physical fitness score. Engine compression optimal and chassis rails solid.');

    await updateGigStatus(gigId, 'COMPLETED', {
      reportScore: score,
      reportStatus: overallStatus,
      reportSummary: summaryText
    });

    await reloadData();

    pushLog(
      'API_REQUEST',
      `POST /reports/rep_${gigId.substring(4)}/release`,
      `STATUS COMPLETED. Score: ${score}, Status: ${overallStatus}`
    );
  };

  // 5. Admin approves NID KYC
  const handleApproveAuditor = (id: string) => {
    pushLog(
      'SQL_STATEMENT',
      `Verify Mechanic KYC profile status`,
      `UPDATE auditor_profiles
SET verification_status = 'VERIFIED'
WHERE user_id = '${id}';`
    );
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] flex flex-col font-serif text-[#1a1a1a]">
      
      {/* Premium Editorial Top Navigation Bar */}
      <header className="sticky top-0 bg-white border-b border-black/10 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            
            {/* GariAudit Logo (Editorial Style) */}
            <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('landing')}>
              <div className="w-8 h-8 bg-[#101828] flex items-center justify-center rounded-sm">
                <span className="text-white font-bold text-xs font-sans">GA</span>
              </div>
              <div className="leading-tight">
                <span className="text-xl font-extrabold tracking-tighter uppercase font-sans hover:opacity-75 transition">
                  GariAudit
                </span>
                <span className="text-[9px] text-[#1a1a1a]/60 font-sans font-bold uppercase tracking-[0.2em] block">
                  {TRANSLATIONS[lang].slogan}
                </span>
              </div>
            </div>

            {/* Bilingual and Persona Switch Tab HUD */}
            <div className="flex items-center gap-4">
              
              {/* Desktop menu tabs switcher */}
              <nav className="hidden md:flex items-center gap-4 border-r border-black/10 pr-4 my-2">
                <button
                  onClick={() => setActiveTab('landing')}
                  className={`text-[11px] uppercase tracking-[0.2em] font-sans font-bold transition duration-200 cursor-pointer ${activeTab === 'landing' ? 'text-[#101828] underline underline-offset-4' : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]'}`}
                >
                  {TRANSLATIONS[lang].menuLanding}
                </button>
                <button
                  onClick={() => setActiveTab('buyer')}
                  className={`text-[11px] uppercase tracking-[0.2em] font-sans font-bold transition duration-200 cursor-pointer ${activeTab === 'buyer' ? 'text-[#101828] underline underline-offset-4' : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]'}`}
                >
                  {TRANSLATIONS[lang].menuBuyer}
                </button>
                <button
                  onClick={() => setActiveTab('auditor')}
                  className={`text-[11px] uppercase tracking-[0.2em] font-sans font-bold transition duration-200 cursor-pointer ${activeTab === 'auditor' ? 'text-[#101828] underline underline-offset-4' : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]'}`}
                >
                  {TRANSLATIONS[lang].menuAuditor}
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`text-[11px] uppercase tracking-[0.2em] font-sans font-bold transition duration-200 cursor-pointer ${activeTab === 'admin' ? 'text-[#101828] underline underline-offset-4' : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]'}`}
                >
                  {TRANSLATIONS[lang].menuAdmin}
                </button>
              </nav>

              {/* Language Switch */}
              <button
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-black hover:text-white text-xs font-sans font-bold uppercase tracking-wider border border-black/10 rounded-none cursor-pointer transition select-none"
                title="Bilingual Switch"
              >
                <Languages className="h-3 w-3 text-[#1a1a1a]/70 group-hover:text-white" />
                <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
              </button>

              <div className="hidden sm:block px-3.5 py-1.5 bg-black text-white text-[10px] uppercase tracking-widest font-sans font-bold">
                SECURE ACCESS
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Mobile-Only persona navigation selector */}
      <div className="md:hidden sticky top-[80px] bg-white z-40 border-b border-black/10 px-3 py-2 flex items-center justify-between text-[11px] font-sans tracking-wider uppercase font-bold text-[#1a1a1a]">
        <span className="text-[#1a1a1a]/60">Portal:</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('landing')} 
            className={`px-2.5 py-1 transition ${activeTab === 'landing' ? 'bg-black text-white' : 'bg-transparent text-[#1a1a1a]'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveTab('buyer')} 
            className={`px-2.5 py-1 transition ${activeTab === 'buyer' ? 'bg-black text-white' : 'bg-transparent text-[#1a1a1a]'}`}
          >
            Buyer
          </button>
          <button 
            onClick={() => setActiveTab('auditor')} 
            className={`px-2.5 py-1 transition ${activeTab === 'auditor' ? 'bg-black text-white' : 'bg-transparent text-[#1a1a1a]'}`}
          >
            Auditor
          </button>
          <button 
            onClick={() => setActiveTab('admin')} 
            className={`px-2.5 py-1 transition ${activeTab === 'admin' ? 'bg-black text-white' : 'bg-transparent text-[#1a1a1a]'}`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Main Workspace Frame render according to active selected tab */}
      <main className="flex-1 bg-[#fbfbfb]">
        {activeTab === 'landing' && (
          <LandingPage 
            lang={lang} 
            onNavigate={(tab) => setActiveTab(tab)} 
            gigsCount={gigs.filter(g => g.status === 'POSTED').length} 
          />
        )}
        
        {activeTab === 'buyer' && (
          <BuyerPortal 
            lang={lang} 
            gigs={gigs} 
            onBookInspection={handleBookInspection} 
            onPushLog={pushLog}
          />
        )}

        {activeTab === 'auditor' && (
          <AuditorPortal 
            lang={lang} 
            gigs={gigs} 
            onClaimGig={handleClaimGig}
            onSubmitAudit={handleAuditSubmit}
            onPushLog={pushLog}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortal 
            lang={lang} 
            gigs={gigs} 
            onApproveAuditor={handleApproveAuditor}
            onReleaseReport={handleReleaseReport}
          />
        )}
      </main>

      {/* Footer statistics */}
      <Footer 
        lang={lang} 
        activeTab={activeTab} 
        onNavigate={(tab) => setActiveTab(tab)} 
      />

    </div>
  );
}
