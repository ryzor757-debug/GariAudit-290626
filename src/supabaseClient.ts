/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Gig } from './types';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Fallback states in case Supabase is not connected or in loading phase
export const FALLBACK_GIGS_STORAGE_KEY = 'gariaudit_gigs';
export const FALLBACK_MAINTENANCE_STORAGE_KEY = 'gariaudit_maintenance';
export const FALLBACK_DISPUTE_STORAGE_KEY = 'gariaudit_disputes';
export const FALLBACK_CASHOUT_STORAGE_KEY = 'gariaudit_cashouts';
export const FALLBACK_PROFILE_STORAGE_KEY = 'gariaudit_profile';
export const FALLBACK_METRICS_STORAGE_KEY = 'gariaudit_metrics';

// Initial gigs seed data
export const INITIAL_MOCK_GIGS: Gig[] = [
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

// Helper to load localStorage fallbacks
export const loadFallback = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Local Storage error', e);
  }
  return defaultValue;
};

// Helper to save localStorage fallbacks
export const saveFallback = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Local Storage save error', e);
  }
};

// ==========================================
// DB SQL Schema generation for Supabase Configuration Panel
// ==========================================
export const SUPABASE_SQL_SCHEMA = `-- 1. GIGS / INSPECTION CONTRACTS TABLE
DROP TABLE IF EXISTS gigs CASCADE;
CREATE TABLE gigs (
  id VARCHAR PRIMARY KEY,
  requester_user_id VARCHAR DEFAULT 'usr_buyer_active',
  asset_type VARCHAR NOT NULL CHECK (asset_type IN ('CAR', 'EV', 'SCOOTER')),
  status VARCHAR NOT NULL DEFAULT 'POSTED' CHECK (status IN ('POSTED', 'ACCEPTED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'CANCELLED')),
  scheduled_start TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 day',
  scheduled_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 day 2 hours',
  location_text VARCHAR NOT NULL,
  location_lat NUMERIC DEFAULT 23.7771,
  location_lng NUMERIC DEFAULT 90.3912,
  price_amount NUMERIC DEFAULT 5000,
  currency VARCHAR DEFAULT 'BDT',
  vehicle_model VARCHAR,
  plate_number VARCHAR NOT NULL,
  notes TEXT,
  wallet_no VARCHAR,
  tx_id VARCHAR,
  payment_method VARCHAR DEFAULT 'WALLET_TX',
  auditor_user_id VARCHAR,
  answers JSONB,
  report_score NUMERIC DEFAULT 85,
  report_status VARCHAR DEFAULT 'WARNING',
  report_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MAINTENANCE WORK ORDERS TABLE
DROP TABLE IF EXISTS maintenance_bookings CASCADE;
CREATE TABLE maintenance_bookings (
  id VARCHAR PRIMARY KEY,
  client_id VARCHAR DEFAULT 'usr_buyer_1204',
  workshop_handle VARCHAR NOT NULL,
  scheduled_repair_date DATE NOT NULL,
  selected_items JSONB NOT NULL,
  estimated_cost NUMERIC NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'SCHEDULED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DISPUTE CHAT MESSAGES TABLE
DROP TABLE IF EXISTS dispute_messages CASCADE;
CREATE TABLE dispute_messages (
  id VARCHAR PRIMARY KEY,
  report_id VARCHAR NOT NULL,
  sender VARCHAR NOT NULL CHECK (sender IN ('buyer', 'admin')),
  sender_name VARCHAR NOT NULL,
  text TEXT NOT NULL,
  timestamp VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TEAM AUDITOR CASHOUT REQUESTS TABLE
DROP TABLE IF EXISTS auditor_cashouts CASCADE;
CREATE TABLE auditor_cashouts (
  id VARCHAR PRIMARY KEY,
  amount NUMERIC NOT NULL,
  wallet_no VARCHAR NOT NULL,
  gateway VARCHAR NOT NULL CHECK (gateway IN ('BKASH', 'NAGAD', 'ROCKET')),
  status VARCHAR NOT NULL DEFAULT 'PROCESSING',
  tx_id VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AUDITOR PROFILE & RANK SYNC TABLE
DROP TABLE IF EXISTS auditor_profiles CASCADE;
CREATE TABLE auditor_profiles (
  id VARCHAR PRIMARY KEY DEFAULT 'usr_auditor_7890',
  inspector_name VARCHAR DEFAULT 'Kamrul Ahsan Bhuiyan',
  device_details VARCHAR DEFAULT 'Autel Maxisys Elite + Digital Elcometer FNF',
  rank VARCHAR DEFAULT 'Level 2 PRO',
  quiz_score INT DEFAULT 0,
  verified_status VARCHAR DEFAULT 'VERIFIED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. INTERACTIVE OPERATIONAL METRICS SERIES TABLE
DROP TABLE IF EXISTS operational_metrics CASCADE;
CREATE TABLE operational_metrics (
  id SERIAL PRIMARY KEY,
  date VARCHAR NOT NULL,
  volume INT NOT NULL,
  avg_score INT NOT NULL,
  active_auditors INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INSERT INITIAL OPERATIONAL METRICS SEED DATA
INSERT INTO operational_metrics (date, volume, avg_score, active_auditors) VALUES
('05/23', 8,  84, 4),
('05/24', 11, 88, 5),
('05/25', 15, 76, 6),
('05/26', 9,  82, 4),
('05/27', 18, 92, 7),
('05/28', 14, 85, 6),
('05/29', 22, 89, 8);
`;

// ==========================================
// DATA API LAYER - UNIFIED AND FAIL-SAFE
// ==========================================

// --- GIGS INTERFACES AND ACTIONS ---
export async function getGigs(): Promise<Gig[]> {
  try {
    const res = await fetch('/api/gigs');
    if (res.ok) {
      const data = await res.json();
      return data.map(dbToGig);
    }
  } catch (e) {
    console.warn('API getGigs failed, relying on local storage fallback', e);
  }
  return loadFallback<Gig[]>(FALLBACK_GIGS_STORAGE_KEY, INITIAL_MOCK_GIGS);
}

export async function createGig(gig: Omit<Gig, 'createdAt' | 'updatedAt'> & { vehicleModel: string; plateNumber: string; walletNo?: string; txId?: string; answers?: any; reportScore?: number; reportStatus?: string; reportSummary?: string }): Promise<void> {
  const newGig: Gig = {
    ...gig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // 1. local fallback tracking always
  const current = loadFallback<Gig[]>(FALLBACK_GIGS_STORAGE_KEY, INITIAL_MOCK_GIGS);
  const updated = [newGig, ...current];
  saveFallback(FALLBACK_GIGS_STORAGE_KEY, updated);

  // 2. API insert
  try {
    const payload = gigToDb(newGig, gig.vehicleModel, gig.plateNumber, gig.walletNo, gig.txId, gig.answers, gig.reportScore, gig.reportStatus, gig.reportSummary);
    const res = await fetch('/api/gigs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error('API return not OK');
    }
  } catch (e) {
    console.error('API createGig error', e);
  }
}

export async function updateGigStatus(id: string, status: string, additionalFields?: Record<string, any>): Promise<void> {
  // 1. Local fallback update
  const current = loadFallback<Gig[]>(FALLBACK_GIGS_STORAGE_KEY, INITIAL_MOCK_GIGS);
  const updated = current.map(g => {
    if (g.id === id) {
      return {
        ...g,
        status: status as any,
        updatedAt: new Date().toISOString(),
        ...additionalFields
      };
    }
    return g;
  });
  saveFallback(FALLBACK_GIGS_STORAGE_KEY, updated);

  // 2. API update
  try {
    const res = await fetch(`/api/gigs/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, additionalFields })
    });
    if (!res.ok) {
      throw new Error('API return not OK');
    }
  } catch (e) {
    console.error('API updateGigStatus error', e);
  }
}

// --- MAINTENANCE BOOKINGS ---
export interface MaintenanceBooking {
  id: string;
  client_id: string;
  workshop_handle: string;
  scheduled_repair_date: string;
  selected_items: string[];
  estimated_cost: number;
  status: string;
  created_at?: string;
}

export async function getMaintenanceBookings(): Promise<MaintenanceBooking[]> {
  try {
    const res = await fetch('/api/maintenance-bookings');
    if (res.ok) {
      const data = await res.json();
      return data.map(dbToMaintenance);
    }
  } catch (e) {
    console.warn('API getMaintenanceBookings failed, relying on local storage fallback', e);
  }
  return loadFallback<MaintenanceBooking[]>(FALLBACK_MAINTENANCE_STORAGE_KEY, []);
}

export async function createMaintenanceBooking(booking: MaintenanceBooking): Promise<void> {
  const bWithDate = {
    ...booking,
    created_at: new Date().toISOString()
  };
  // local fallback
  const current = loadFallback<MaintenanceBooking[]>(FALLBACK_MAINTENANCE_STORAGE_KEY, []);
  const updated = [bWithDate, ...current];
  saveFallback(FALLBACK_MAINTENANCE_STORAGE_KEY, updated);

  // API Booking
  try {
    const res = await fetch('/api/maintenance-bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: booking.id,
        client_id: booking.client_id,
        workshop_handle: booking.workshop_handle,
        scheduled_repair_date: booking.scheduled_repair_date,
        selected_items: booking.selected_items,
        estimated_cost: booking.estimated_cost,
        status: booking.status
      })
    });
    if (!res.ok) {
      throw new Error('API return not OK');
    }
  } catch (e) {
    console.error('API createMaintenanceBooking error', e);
  }
}

// --- DISPUTE MESSAGES ---
export interface DisputeMessage {
  id: string;
  report_id: string;
  sender: 'buyer' | 'admin';
  sender_name: string;
  text: string;
  timestamp: string;
  created_at?: string;
}

export async function getDisputeMessages(reportId: string): Promise<DisputeMessage[]> {
  try {
    const res = await fetch(`/api/dispute-messages/${reportId}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn('API getDisputeMessages failed, relying on local storage fallback', e);
  }
  // Local fallback list filtered
  const allFallback = loadFallback<DisputeMessage[]>(FALLBACK_DISPUTE_STORAGE_KEY, [
    {
      id: 'init_allion_1',
      report_id: 'rep_allion',
      sender: 'admin',
      sender_name: 'Administrative Tech Lead',
      text: 'Greeting, Auditor Desk here. I see your report highlights Odometer mileage manipulation from 142k km to 54k km. Do you wish to file a secure dispute claim and request a double physical audit?',
      timestamp: '12:44 UTC'
    },
    {
      id: 'init_premio_1',
      report_id: 'rep_premio_hybrid',
      sender: 'admin',
      sender_name: 'Senior Compliance Expert',
      text: 'Greeting, Auditor Desk here. Do you wish to file a secure dispute claim and request a double physical audit?',
      timestamp: '12:44 UTC'
    }
  ]);
  return allFallback.filter(m => m.report_id === reportId);
}

export async function createDisputeMessage(msg: DisputeMessage): Promise<void> {
  const msgWithDate = {
    ...msg,
    created_at: new Date().toISOString()
  };
  // local storage fallback
  const allFallback = loadFallback<DisputeMessage[]>(FALLBACK_DISPUTE_STORAGE_KEY, [
    {
      id: 'init_allion_1',
      report_id: 'rep_allion',
      sender: 'admin',
      sender_name: 'Administrative Tech Lead',
      text: 'Greeting, Auditor Desk here. I see your report highlights Odometer mileage manipulation from 142k km to 54k km. Do you wish to file a secure dispute claim and request a double physical audit?',
      timestamp: '12:44 UTC'
    }
  ]);
  const updated = [...allFallback, msgWithDate];
  saveFallback(FALLBACK_DISPUTE_STORAGE_KEY, updated);

  try {
    const res = await fetch('/api/dispute-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: msg.id,
        report_id: msg.report_id,
        sender: msg.sender,
        sender_name: msg.sender_name,
        text: msg.text,
        timestamp: msg.timestamp
      })
    });
    if (!res.ok) {
      throw new Error('API return not OK');
    }
  } catch (e) {
    console.error('API createDisputeMessage error', e);
  }
}

// --- AUDITOR CASHOUT ---
export interface AuditorCashout {
  id: string;
  amount: number;
  wallet_no: string;
  gateway: 'BKASH' | 'NAGAD' | 'ROCKET';
  status: string;
  tx_id: string;
  created_at?: string;
}

export async function getAuditorCashouts(): Promise<AuditorCashout[]> {
  try {
    const res = await fetch('/api/auditor-cashouts');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn('API getAuditorCashouts failed, relying on local storage fallback', e);
  }
  return loadFallback<AuditorCashout[]>(FALLBACK_CASHOUT_STORAGE_KEY, []);
}

export async function createAuditorCashout(cashout: AuditorCashout): Promise<void> {
  const cWithDate = {
    ...cashout,
    created_at: new Date().toISOString()
  };
  // local storage
  const current = loadFallback<AuditorCashout[]>(FALLBACK_CASHOUT_STORAGE_KEY, []);
  const updated = [cWithDate, ...current];
  saveFallback(FALLBACK_CASHOUT_STORAGE_KEY, updated);

  try {
    const res = await fetch('/api/auditor-cashouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: cashout.id,
        amount: cashout.amount,
        wallet_no: cashout.wallet_no,
        gateway: cashout.gateway,
        status: cashout.status,
        tx_id: cashout.tx_id
      })
    });
    if (!res.ok) {
      throw new Error('API return not OK');
    }
  } catch (e) {
    console.error('API createAuditorCashout error', e);
  }
}

// --- AUDITOR PROFILE SYNC ---
export interface AuditorProfile {
  id: string;
  inspector_name: string;
  device_details: string;
  rank: string;
  quiz_score: number;
  verified_status: string;
}

export const INITIAL_AUDITOR_PROFILE: AuditorProfile = {
  id: 'usr_auditor_7890',
  inspector_name: 'Kamrul Ahsan Bhuiyan',
  device_details: 'Autel Maxisys Elite + Digital Elcometer FNF',
  rank: 'Level 2 PRO',
  quiz_score: 0,
  verified_status: 'VERIFIED'
};

export async function getAuditorProfile(): Promise<AuditorProfile> {
  try {
    const res = await fetch('/api/auditor-profile');
    if (res.ok) {
      const data = await res.json();
      if (data) {
        return {
          id: data.id,
          inspector_name: data.inspector_name,
          device_details: data.device_details,
          rank: data.rank,
          quiz_score: data.quiz_score,
          verified_status: data.verified_status
        };
      }
    }
  } catch (e) {
    console.warn('API getAuditorProfile failed, relying on local storage fallback', e);
  }
  return loadFallback<AuditorProfile>(FALLBACK_PROFILE_STORAGE_KEY, INITIAL_AUDITOR_PROFILE);
}

export async function saveAuditorProfile(profile: AuditorProfile): Promise<void> {
  // Local storage
  saveFallback(FALLBACK_PROFILE_STORAGE_KEY, profile);

  try {
    const res = await fetch('/api/auditor-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: profile.id,
        inspector_name: profile.inspector_name,
        device_details: profile.device_details,
        rank: profile.rank,
        quiz_score: profile.quiz_score,
        verified_status: profile.verified_status
      })
    });
    if (!res.ok) {
      throw new Error('API return not OK');
    }
  } catch (e) {
    console.error('API saveAuditorProfile exception', e);
  }
}

// --- OPERATIONAL METRICS SERIES ---
export interface OperationalMetric {
  date: string;
  volume: number;
  avgScore: number;
  activeAuditors: number;
}

export const INITIAL_METRICS: OperationalMetric[] = [
  { date: '05/23', volume: 8, avgScore: 84, activeAuditors: 4 },
  { date: '05/24', volume: 11, avgScore: 88, activeAuditors: 5 },
  { date: '05/25', volume: 15, avgScore: 76, activeAuditors: 6 },
  { date: '05/26', volume: 9, avgScore: 82, activeAuditors: 4 },
  { date: '05/27', volume: 18, avgScore: 92, activeAuditors: 7 },
  { date: '05/28', volume: 14, avgScore: 85, activeAuditors: 6 },
  { date: '05/29', volume: 22, avgScore: 89, activeAuditors: 8 }
];

export async function getOperationalMetrics(): Promise<OperationalMetric[]> {
  try {
    const res = await fetch('/api/operational-metrics');
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        return data.map((item: any) => ({
          date: item.date,
          volume: item.volume,
          avgScore: item.avg_score,
          activeAuditors: item.active_auditors
        }));
      }
    }
  } catch (e) {
    console.warn('API getOperationalMetrics failed, relying on local storage fallback', e);
  }
  return loadFallback<OperationalMetric[]>(FALLBACK_METRICS_STORAGE_KEY, INITIAL_METRICS);
}

export async function addOperationalMetric(metric: OperationalMetric): Promise<void> {
  const current = loadFallback<OperationalMetric[]>(FALLBACK_METRICS_STORAGE_KEY, INITIAL_METRICS);
  const updated = [...current, metric];
  saveFallback(FALLBACK_METRICS_STORAGE_KEY, updated);

  try {
    const res = await fetch('/api/operational-metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: metric.date,
        volume: metric.volume,
        avg_score: metric.avgScore,
        active_auditors: metric.activeAuditors
      })
    });
    if (!res.ok) {
      throw new Error('API return not OK');
    }
  } catch (e) {
    console.error('API addOperationalMetric exception', e);
  }
}

// ==========================================
// DB ENCODING / DECODING MAPS
// ==========================================
function dbToGig(row: any): Gig {
  return {
    id: row.id,
    requesterUserId: row.requester_user_id,
    assetType: row.asset_type,
    status: row.status,
    scheduledStart: row.scheduled_start,
    scheduledEnd: row.scheduled_end,
    locationText: row.location_text,
    locationLat: Number(row.location_lat),
    locationLng: Number(row.location_lng),
    priceAmount: Number(row.price_amount),
    currency: row.currency,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // Supplement properties packed inside row or answers
    vehicleModel: row.vehicle_model || '',
    plateNumber: row.plate_number || '',
    walletNo: row.wallet_no || '',
    txId: row.tx_id || '',
    answers: row.answers || null,
    reportScore: row.report_score ? Number(row.report_score) : undefined,
    reportStatus: row.report_status || undefined,
    reportSummary: row.report_summary || undefined,
    auditorUserId: row.auditor_user_id || undefined
  } as any;
}

function gigToDb(g: Gig & { vehicleModel?: string; plateNumber?: string; walletNo?: string; txId?: string; answers?: any; reportScore?: number; reportStatus?: string; reportSummary?: string; auditorUserId?: string }, model: string, plate: string, wallet?: string, tx?: string, answers?: any, rScore?: number, rStatus?: string, rSummary?: string) {
  return {
    id: g.id,
    requester_user_id: g.requesterUserId,
    asset_type: g.assetType,
    status: g.status,
    scheduled_start: g.scheduledStart,
    scheduled_end: g.scheduledEnd,
    location_text: g.locationText,
    location_lat: g.locationLat,
    location_lng: g.locationLng,
    price_amount: g.priceAmount,
    currency: g.currency,
    notes: g.notes,
    created_at: g.createdAt,
    updated_at: g.updatedAt,
    vehicle_model: model || g.vehicleModel || '',
    plate_number: plate || g.plateNumber || '',
    wallet_no: wallet || g.walletNo || '',
    tx_id: tx || g.txId || '',
    answers: answers || g.answers || null,
    report_score: rScore !== undefined ? rScore : (g.reportScore !== undefined ? g.reportScore : null),
    report_status: rStatus || g.reportStatus || null,
    report_summary: rSummary || g.reportSummary || null,
    auditor_user_id: g.auditorUserId || null
  };
}

function dbToMaintenance(row: any): MaintenanceBooking {
  return {
    id: row.id,
    client_id: row.client_id,
    workshop_handle: row.workshop_handle,
    scheduled_repair_date: row.scheduled_repair_date,
    selected_items: row.selected_items || [],
    estimated_cost: Number(row.estimated_cost),
    status: row.status,
    created_at: row.created_at
  };
}
