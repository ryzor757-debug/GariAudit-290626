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

export default function App() {
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [activeTab, setActiveTab] = useState<'landing' | 'buyer' | 'auditor' | 'admin'>('landing');

  // Gigs and jobs central state
  const [gigs, setGigs] = useState<Gig[]>([]);

  // Seed default posted gigs
  useEffect(() => {
    // Populate seed audit requests
    const initialGigs: Gig[] = [
      {
        id: 'gig_001',
        requesterUserId: 'usr_buyer_1',
        assetType: 'CAR',
        status: 'POSTED',
        scheduledStart: '2026-05-30T10:00:00Z',
        scheduledEnd: '2026-05-30T12:00:00Z',
        locationText: 'Dhaka - Tejgaon',
        locationLat: 23.7592,
        locationLng: 90.3995,
        priceAmount: 5000,
        currency: 'BDT',
        notes: 'Toyota Premio FEX শোরুম (Baridhara Link Road branch)',
        createdAt: '2026-05-29T11:00:00Z',
        updatedAt: '2026-05-29T11:00:00Z'
      },
      {
        id: 'gig_002',
        requesterUserId: 'usr_buyer_2',
        assetType: 'CAR',
        status: 'POSTED',
        scheduledStart: '2026-05-31T14:00:00Z',
        scheduledEnd: '2026-05-31T16:00:00Z',
        locationText: 'Chattogram - GEC',
        locationLat: 22.3591,
        locationLng: 91.8219,
        priceAmount: 5000,
        currency: 'BDT',
        notes: 'Honda Vezel RS (Inspecting inside workshop with lift access availability)',
        createdAt: '2026-05-29T11:15:00Z',
        updatedAt: '2026-05-29T11:15:00Z'
      }
    ];

    setGigs(initialGigs);
  }, []);

  const pushLog = (..._args: any[]) => {};

  // 1. Buyerbooks inspection workflow
  const handleBookInspection = (data: {
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
    const newGig: Gig = {
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
      notes: `${data.vehicleModel} - ${data.plateNumber} (${data.notes || ''})`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setGigs(prev => [newGig, ...prev]);

    // Push Developer Logs
    pushLog(
      'API_REQUEST',
      'POST /gigs (Idempotent booking request)',
      `HEADERS:
  Authorization: Bearer jwt_p9285...
  Idempotency-Key: ${Math.random().toString(36).substring(2, 11).toUpperCase()}

BODY:
{
  "asset_type": "${data.assetType}",
  "location_text": "${data.locationText}",
  "price_amount": 5000.00,
  "currency": "BDT",
  "notes": "${data.vehicleModel} - Plate ${data.plateNumber}"
}`
    );

    pushLog(
      'SQL_STATEMENT',
      'Transaction Insert: gigs & initial status event logs',
      `BEGIN;

INSERT INTO gigs (id, requester_user_id, asset_type, status, location_text, price_amount)
VALUES ('${newId}', 'usr_buyer_active', '${data.assetType}', 'POSTED', '${data.locationText}', 5000.00);

INSERT INTO gig_status_events (gig_id, from_status, to_status, changed_by_user_id, change_source)
VALUES ('${newId}', NULL, 'POSTED', 'usr_buyer_active', 'REQUESTER_APP');

INSERT INTO payments (gig_id, method, amount, status, tx_id)
VALUES ('${newId}', 'WALLET_TX', 500.00, 'PENDING', '${data.txId}');

COMMIT;`
    );

    pushLog(
      'HEX_PORT',
      'Port Trigger: GigService::create_gig',
      `// Invoking input driver port on our domain service.
let service = GigServiceImpl::new(gig_repository, user_repository);
let gig_dto = service.create_gig(CreateGigCommand {
    requester_id: "usr_buyer_active",
    asset_type: AssetType::Car,
    location: "${data.locationText}",
    wallet_provider: "bKash"
}).await?;`
    );
  };

  // 2. Auditor claims gig workflow
  const handleClaimGig = (gigId: string) => {
    setGigs(prev => prev.map(g => g.id === gigId ? { ...g, status: 'ACCEPTED' } : g));

    const targetGig = gigs.find(g => g.id === gigId);
    const location = targetGig ? targetGig.locationText : 'Dhaka Tejgaon';

    pushLog(
      'API_REQUEST',
      `POST /gigs/${gigId}/accept (Claim available inspection)`,
      `HEADERS:
  Authorization: Bearer jwt_auditor_7890
  Idempotency-Key: CLAIM-${gigId.substring(4)}

RESPONSE (200 OK):
{
  "job_id": "job_${gigId.substring(4)}",
  "gig_id": "${gigId}",
  "auditor_user_id": "usr_auditor_7890",
  "status": "ACCEPTED"
}`
    );

    pushLog(
      'SQL_STATEMENT',
      'Race-Condition Safe SELECT FOR UPDATE transaction lock',
      `BEGIN;

-- SELECT FOR UPDATE grabs an exclusive row lock on this gig, preventing any downstream double auditor assignment races!
SELECT status FROM gigs WHERE id = '${gigId}' FOR UPDATE;

-- Backend code validates if status is indeed still 'POSTED' inside transaction. If yes, proceed:
UPDATE gigs SET status = 'ACCEPTED' WHERE id = '${gigId}';

INSERT INTO jobs (id, gig_id, auditor_user_id, job_status)
VALUES ('job_${gigId.substring(4)}', '${gigId}', 'usr_auditor_7890', 'ACCEPTED')
ON CONFLICT (gig_id) DO NOTHING; -- Strict Database invariant protection check

INSERT INTO gig_status_events (gig_id, from_status, to_status, changed_by_user_id, change_source)
VALUES ('${gigId}', 'POSTED', 'ACCEPTED', 'usr_auditor_7890', 'AUDITOR_APP');

COMMIT;`
    );

    pushLog(
      'HEX_PORT',
      'Hexagonal Drive Port: GigService::accept_gig',
      `// Restricting double audit accepts via Domain Engine model.
let locked_gig = postgres_gig_repo.lock_for_acceptance(gig_id).await?;
if locked_gig.status != GigStatus::Posted {
    return Err(DomainError::GigAlreadyAccepted);
}`
    );
  };

  // 3. Auditor submits checklist workflow
  const handleAuditSubmit = (gigId: string, answers: any) => {
    setGigs(prev => prev.map(g => g.id === gigId ? { ...g, status: 'SUBMITTED' } : g));

    pushLog(
      'API_REQUEST',
      `POST /jobs/job_${gigId.substring(4)}/audit/submit`,
      `HEADERS:
  Authorization: Bearer jwt_auditor_7890

BODY:
{
  "answers": [
    { "key": "chassis_salvage", "value_bool": ${answers.chassis_salvage || false} },
    { "key": "corrosion_underbody", "value_text": "${answers.corrosion_underbody || 'None'}" },
    { "key": "obd2_cleared_recent", "value_bool": ${answers.obd2_cleared_recent || false} },
    { "key": "odometer_rollback", "value_bool": ${answers.odometer_rollback || false} }
  ],
  "local_id": "local_offline_stack_${gigId.substring(4)}"
}`
    );

    pushLog(
      'SQL_STATEMENT',
      'Insert Audits Answers & Submit Lock rules',
      `BEGIN;

INSERT INTO audits (id, job_id, template_id, status, local_id)
VALUES ('aud_${gigId.substring(4)}', 'job_${gigId.substring(4)}', 'tpl_car_v1', 'SUBMITTED', 'local_offline_stack_${gigId.substring(4)}');

-- Locking answer states to prevent fraud or post-audit tempering
INSERT INTO audit_answers (audit_id, template_item_id, value_bool, value_text)
VALUES 
  ('aud_${gigId.substring(4)}', 't1', ${answers.chassis_salvage || false}, NULL),
  ('aud_${gigId.substring(4)}', 't2', NULL, '${answers.corrosion_underbody || 'None'}');

UPDATE gigs SET status = 'SUBMITTED' WHERE id = '${gigId}';
UPDATE jobs SET job_status = 'SUBMITTED', submitted_at = NOW() WHERE gig_id = '${gigId}';

COMMIT;`
    );
  };

  // 4. Admin releases report to buyer
  const handleReleaseReport = (gigId: string) => {
    setGigs(prev => prev.map(g => g.id === gigId ? { ...g, status: 'COMPLETED' } : g));

    pushLog(
      'API_REQUEST',
      `POST /reports/rep_${gigId.substring(4)}/release`,
      `RESPONSE (200 OK):
{
  "report_id": "rep_${gigId.substring(4)}",
  "share_token": "TOK32_${Math.random().toString(36).substring(2, 15).toUpperCase()}...",
  "unaltered_hash_md5": "HASH_84f2913b8..."
}`
    );

    pushLog(
      'SQL_STATEMENT',
      'Compile Immutable Report Summary Row',
      `BEGIN;

INSERT INTO reports (id, audit_id, overall_status, score, summary)
VALUES ('rep_${gigId.substring(4)}', 'aud_${gigId.substring(4)}', 'WARNING', 85, 'Fully evaluated Toyota premium Sedan. Clear of chassis welds. Active ABS buzzer requires immediate warning.');

INSERT INTO report_shares (report_id, share_token, is_active)
VALUES ('rep_${gigId.substring(4)}', 'TOK32_${Math.random().toString(36).substring(2, 17).toUpperCase()}', true);

UPDATE gigs SET status = 'COMPLETED' WHERE id = '${gigId}';
UPDATE jobs SET job_status = 'COMPLETED', completed_at = NOW() WHERE gig_id = '${gigId}';

COMMIT;`
    );
  };

  // 5. Admin approves NID KYC
  const handleApproveAuditor = (id: string) => {
    pushLog(
      'SQL_STATEMENT',
      `Verify Mechanic KYC profile status`,
      `UPDATE auditor_profiles
SET verification_status = 'VERIFIED', verification_level = 'PRO', updated_at = NOW()
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
... (92 lines remaining)

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
