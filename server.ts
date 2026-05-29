import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { supabase, isSupabaseConfigured } from './src/lib/supabase';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Indicator
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      supabaseConfigured: isSupabaseConfigured,
      timestamp: new Date().toISOString()
    });
  });

  // Supabase Real-time Diagnostics Connection API
  app.get('/api/supabase-status', async (req, res) => {
    if (!supabase) {
      return res.json({
        configured: false,
        error: 'Supabase integration is not fully configured on the server-side.'
      });
    }

    const host = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
    const maskedUrl = host.replace(/^(https?:\/\/)([^.]+)/, '$1***');

    const tables = [
      'gigs',
      'maintenance_bookings',
      'dispute_messages',
      'auditor_cashouts',
      'auditor_profiles',
      'operational_metrics'
    ];

    const tableStatuses: Record<string, any> = {};

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'estimated', head: true });
        
        if (error) {
          // If relation does not exist, table hasn't been created in Supabase yet
          if (error.code === 'P0001' || error.code === '42P01' || error.message?.includes('does not exist')) {
            tableStatuses[table] = { exists: false, rows: 0, error: 'Table does not exist. Please run the SQL schema initialization command.' };
          } else {
            tableStatuses[table] = { exists: true, error: error.message, rows: 0 };
          }
        } else {
          tableStatuses[table] = { exists: true, rows: count !== null ? count : 0, error: null };
        }
      } catch (err: any) {
        tableStatuses[table] = { exists: false, error: err.message, rows: 0 };
      }
    }

    res.json({
      configured: true,
      url: maskedUrl,
      tables: tableStatuses,
      timestamp: new Date().toISOString()
    });
  });

  // Programmatic DB Seeding Helper for Empty Tables
  app.post('/api/supabase-seed', async (req, res) => {
    if (!supabase) {
      return res.status(503).json({ error: 'Supabase integration is not fully configured.' });
    }

    try {
      const seeded: string[] = [];

      // 1. Seed operational_metrics if exists and empty
      try {
        const { count: countMetrics, error: errMetrics } = await supabase
          .from('operational_metrics')
          .select('*', { count: 'exact', head: true });
        
        if (!errMetrics && countMetrics === 0) {
          const initialMetrics = [
            { date: '05/23', volume: 8, avg_score: 84, active_auditors: 4 },
            { date: '05/24', volume: 11, avg_score: 88, active_auditors: 5 },
            { date: '05/25', volume: 15, avg_score: 76, active_auditors: 6 },
            { date: '05/26', volume: 9, avg_score: 82, active_auditors: 4 },
            { date: '05/27', volume: 18, avg_score: 92, active_auditors: 7 },
            { date: '05/28', volume: 14, avg_score: 85, active_auditors: 6 },
            { date: '05/29', volume: 22, avg_score: 89, active_auditors: 8 }
          ];
          const { error: insErr } = await supabase.from('operational_metrics').insert(initialMetrics);
          if (!insErr) seeded.push('operational_metrics');
        }
      } catch (e: any) {
        console.warn('operational_metrics seed skip or fail:', e.message);
      }

      // 2. Seed gigs if exists and empty
      try {
        const { count: countGigs, error: errGigs } = await supabase
          .from('gigs')
          .select('*', { count: 'exact', head: true });
          
        if (!errGigs && countGigs === 0) {
          const initialGigs = [
            {
              id: 'gig_001',
              requester_user_id: 'usr_buyer_1',
              asset_type: 'CAR',
              status: 'POSTED',
              scheduled_start: '2026-05-30T10:00:00Z',
              scheduled_end: '2026-05-30T12:00:00Z',
              location_text: 'Dhaka - Tejgaon',
              location_lat: 23.7592,
              location_lng: 90.3995,
              price_amount: 5000,
              currency: 'BDT',
              vehicle_model: 'Toyota Premio F',
              plate_number: 'Dhaka Metro GA-1234',
              notes: 'Toyota Premio FEX শোরুম (Baridhara Link Road branch)',
              created_at: '2026-05-29T11:00:00Z',
              updated_at: '2026-05-29T11:00:00Z'
            },
            {
              id: 'gig_002',
              requester_user_id: 'usr_buyer_2',
              asset_type: 'CAR',
              status: 'POSTED',
              scheduled_start: '2026-05-31T14:00:00Z',
              scheduled_end: '2026-05-31T16:00:00Z',
              location_text: 'Chattogram - GEC',
              location_lat: 22.3591,
              location_lng: 91.8219,
              price_amount: 5000,
              currency: 'BDT',
              vehicle_model: 'Honda Vezel RS',
              plate_number: 'Chatto Metro GHA-5678',
              notes: 'Honda Vezel RS (Inspecting inside workshop with lift access availability)',
              created_at: '2026-05-29T11:15:00Z',
              updated_at: '2026-05-29T11:15:00Z'
            }
          ];
          const { error: insErr } = await supabase.from('gigs').insert(initialGigs);
          if (!insErr) seeded.push('gigs');
        }
      } catch (e: any) {
        console.warn('gigs seed skip or fail:', e.message);
      }

      // 3. Seed auditor_profiles if exists and empty
      try {
        const { count: countProfile, error: errProfile } = await supabase
          .from('auditor_profiles')
          .select('*', { count: 'exact', head: true });
          
        if (!errProfile && countProfile === 0) {
          const { error: insErr } = await supabase.from('auditor_profiles').insert({
            id: 'usr_auditor_7890',
            inspector_name: 'Kamrul Ahsan Bhuiyan',
            device_details: 'Autel Maxisys Elite + Digital Elcometer FNF',
            rank: 'Level 2 PRO',
            quiz_score: 95,
            verified_status: 'VERIFIED'
          });
          if (!insErr) seeded.push('auditor_profiles');
        }
      } catch (e: any) {
        console.warn('auditor_profiles seed skip or fail:', e.message);
      }

      res.json({
        success: true,
        message: seeded.length > 0
          ? `Successfully initialized default data for: [${seeded.join(', ')}]`
          : 'Setup tables already have records, or they did not exist in Supabase yet.'
      });
    } catch (err: any) {
      console.error('API /api/supabase-seed error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // DB Availability Guard
  const dbGuard = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!supabase) {
      res.status(503).json({ error: 'Supabase integration is not fully configured on the server-side.' });
      return;
    }
    next();
  };

  // --- GIGS ENDPOINTS ---
  app.get('/api/gigs', dbGuard, async (req, res) => {
    try {
      const { data, error } = await supabase!
        .from('gigs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('relation "gigs" does not exist')) {
        console.warn('Database Note: "gigs" table does not exist. Returning 404 to trigger UI fallback.');
        return res.status(404).json({ error: 'table_missing', message: 'relation "gigs" does not exist' });
      }
      console.error('API /api/gigs error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/gigs', dbGuard, async (req, res) => {
    try {
      const { data, error } = await supabase!
        .from('gigs')
        .insert(req.body);
      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('does not exist')) {
        console.warn('Database Note: "gigs" table does not exist. Saving to fallback.');
        return res.status(404).json({ error: 'table_missing', message: 'relation "gigs" does not exist' });
      }
      console.error('API POST /api/gigs error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/gigs/:id/status', dbGuard, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, additionalFields } = req.body;
      
      const dbUpdate: Record<string, any> = { 
        status, 
        updated_at: new Date().toISOString() 
      };
      
      if (additionalFields) {
        if (additionalFields.answers) dbUpdate.answers = additionalFields.answers;
        if (additionalFields.reportScore !== undefined) dbUpdate.report_score = additionalFields.reportScore;
        if (additionalFields.reportStatus) dbUpdate.report_status = additionalFields.reportStatus;
        if (additionalFields.reportSummary) dbUpdate.report_summary = additionalFields.reportSummary;
        if (additionalFields.auditorUserId) dbUpdate.auditor_user_id = additionalFields.auditorUserId;
      }

      const { error } = await supabase!
        .from('gigs')
        .update(dbUpdate)
        .eq('id', id);
      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('does not exist')) {
        console.warn('Database Note: "gigs" table does not exist. Skipping update status.');
        return res.status(404).json({ error: 'table_missing' });
      }
      console.error('API PUT /api/gigs/:id/status error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // --- MAINTENANCE BOOKINGS ENDPOINTS ---
  app.get('/api/maintenance-bookings', dbGuard, async (req, res) => {
    try {
      const { data, error } = await supabase!
        .from('maintenance_bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('relation "maintenance_bookings" does not exist')) {
        console.warn('Database Note: "maintenance_bookings" table does not exist. Returning 404 to trigger UI fallback.');
        return res.status(404).json({ error: 'table_missing', message: 'relation "maintenance_bookings" does not exist' });
      }
      console.error('API /api/maintenance-bookings error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/maintenance-bookings', dbGuard, async (req, res) => {
    try {
      const { error } = await supabase!
        .from('maintenance_bookings')
        .insert(req.body);
      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('does not exist')) {
        console.warn('Database Note: "maintenance_bookings" table does not exist. Skipping insert.');
        return res.status(404).json({ error: 'table_missing' });
      }
      console.error('API POST /api/maintenance-bookings error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // --- DISPUTE MESSAGES ENDPOINTS ---
  app.get('/api/dispute-messages/:reportId', dbGuard, async (req, res) => {
    try {
      const { reportId } = req.params;
      const { data, error } = await supabase!
        .from('dispute_messages')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('relation "dispute_messages" does not exist')) {
        console.warn('Database Note: "dispute_messages" table does not exist. Returning 404 to trigger UI fallback.');
        return res.status(404).json({ error: 'table_missing', message: 'relation "dispute_messages" does not exist' });
      }
      console.error('API /api/dispute-messages/:reportId error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/dispute-messages', dbGuard, async (req, res) => {
    try {
      const { error } = await supabase!
        .from('dispute_messages')
        .insert(req.body);
      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('does not exist')) {
        console.warn('Database Note: "dispute_messages" table does not exist. Skipping insert.');
        return res.status(404).json({ error: 'table_missing' });
      }
      console.error('API POST /api/dispute-messages error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // --- AUDITOR CASHOUT ENDPOINTS ---
  app.get('/api/auditor-cashouts', dbGuard, async (req, res) => {
    try {
      const { data, error } = await supabase!
        .from('auditor_cashouts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('relation "auditor_cashouts" does not exist')) {
        console.warn('Database Note: "auditor_cashouts" table does not exist. Returning 404 to trigger UI fallback.');
        return res.status(404).json({ error: 'table_missing', message: 'relation "auditor_cashouts" does not exist' });
      }
      console.error('API /api/auditor-cashouts error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auditor-cashouts', dbGuard, async (req, res) => {
    try {
      const { error } = await supabase!
        .from('auditor_cashouts')
        .insert(req.body);
      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('does not exist')) {
        console.warn('Database Note: "auditor_cashouts" table does not exist. Skipping insert.');
        return res.status(404).json({ error: 'table_missing' });
      }
      console.error('API POST /api/auditor-cashouts error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // --- AUDITOR PROFILE ENDPOINTS ---
  app.get('/api/auditor-profile', dbGuard, async (req, res) => {
    try {
      const { data, error } = await supabase!
        .from('auditor_profiles')
        .select('*')
        .eq('id', 'usr_auditor_7890')
        .maybeSingle();
      if (error) throw error;
      res.json(data || null);
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('relation "auditor_profiles" does not exist')) {
        console.warn('Database Note: "auditor_profiles" table does not exist. Returning 404 to trigger UI fallback.');
        return res.status(404).json({ error: 'table_missing', message: 'relation "auditor_profiles" does not exist' });
      }
      console.error('API /api/auditor-profile error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auditor-profile', dbGuard, async (req, res) => {
    try {
      const { error } = await supabase!
        .from('auditor_profiles')
        .upsert(req.body);
      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('does not exist')) {
        console.warn('Database Note: "auditor_profiles" table does not exist. Skipping profile update.');
        return res.status(404).json({ error: 'table_missing' });
      }
      console.error('API POST /api/auditor-profile error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // --- OPERATIONAL METRICS ENDPOINTS ---
  app.get('/api/operational-metrics', dbGuard, async (req, res) => {
    try {
      const { data, error } = await supabase!
        .from('operational_metrics')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('relation "operational_metrics" does not exist')) {
        console.warn('Database Note: "operational_metrics" table does not exist. Returning 404 to trigger UI fallback.');
        return res.status(404).json({ error: 'table_missing', message: 'relation "operational_metrics" does not exist' });
      }
      console.error('API /api/operational-metrics error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/operational-metrics', dbGuard, async (req, res) => {
    try {
      const { error } = await supabase!
        .from('operational_metrics')
        .insert(req.body);
      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('does not exist')) {
        console.warn('Database Note: "operational_metrics" table does not exist. Skipping insert.');
        return res.status(404).json({ error: 'table_missing' });
      }
      console.error('API POST /api/operational-metrics error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development or fallback static folder for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
