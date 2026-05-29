/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AssetType = 'CAR' | 'EV' | 'SCOOTER';

export type GigStatus = 'POSTED' | 'ACCEPTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED' | 'CANCELLED';

export type JobStatus = 'ACCEPTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED' | 'CANCELLED';

export type AuditStatus = 'DRAFT' | 'SUBMITTED' | 'LOCKED';

export type SyncState = 'LOCAL_ONLY' | 'SYNC_PENDING' | 'SYNCING' | 'SERVER_OK' | 'SYNC_FAILED';

export type PaymentStatus = 'PENDING' | 'CONFIRMED' | 'REFUNDED' | 'FAILED';

export type PayoutStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface User {
  id: string;
  phone: string;
  fullName: string;
  role: 'REQUESTER' | 'AUDITOR' | 'ADMIN';
  preferredLanguage: 'bn' | 'en';
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'SUSPENDED';
  verificationLevel?: 'BASIC' | 'PRO' | 'SENIOR';
}

export interface Gig {
  id: string;
  requesterUserId: string;
  assetType: AssetType;
  status: GigStatus;
  scheduledStart: string;
  scheduledEnd: string;
  locationText: string;
  locationLat: number;
  locationLng: number;
  priceAmount: number;
  currency: 'BDT' | 'USD';
  notes?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  gigId: string;
  auditorUserId: string;
  jobStatus: JobStatus;
  acceptedAt: string;
  startedAt?: string;
  submittedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GigStatusEvent {
  id: string;
  gigId: string;
  fromStatus: GigStatus | null;
  toStatus: GigStatus;
  changedByUserId: string;
  changeSource: 'REQUESTER_APP' | 'AUDITOR_APP' | 'ADMIN' | 'SYSTEM';
  note: string;
  createdAt: string;
}

export interface Audit {
  id: string;
  jobId: string;
  templateId: string;
  status: AuditStatus;
  localId: string;
  syncState: SyncState;
  lastSyncedAt?: string;
  submittedAt?: string;
  lockedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditAnswer {
  id: string;
  auditId: string;
  templateItemId: string;
  valueBool?: boolean;
  valueNumber?: number;
  valueText?: string;
  valueEnum?: string;
  valueMultiEnum?: string[];
  note?: string;
  isCritical: boolean;
}

export interface Evidence {
  id: string;
  auditId: string;
  auditAnswerId?: string;
  mediaType: 'PHOTO' | 'VIDEO';
  storageUrl: string;
  mimeType: 'image/jpeg' | 'image/png' | 'video/mp4';
  fileSizeBytes: number;
  capturedAt: string;
  captureLat?: number;
  captureLng?: number;
  deviceId?: string;
}

export interface Report {
  id: string;
  auditId: string;
  overallStatus: 'OK' | 'WARNING' | 'CRITICAL';
  score: number; // 0-100
  summary: string;
  generatedAt: string;
  createdAt: string;
}

export interface ReportFlag {
  id: string;
  reportId: string;
  severity: 'WARNING' | 'CRITICAL';
  code: string;
  title: string;
  description: string;
}

export interface Payment {
  id: string;
  gigId: string;
  method: 'CASH' | 'WALLET_TX' | 'BANK_TX';
  amount: number;
  currency: 'BDT';
  status: PaymentStatus;
  txId?: string;
  confirmedAt?: string;
  createdAt: string;
}

export interface Payout {
  id: string;
  jobId: string;
  auditorUserId: string;
  amount: number;
  currency: 'BDT';
  status: PayoutStatus;
  paidAt?: string;
  reference?: string;
  createdAt: string;
}

export interface DevLog {
  id: string;
  timestamp: string;
  type: 'API_REQUEST' | 'API_RESPONSE' | 'SQL_STATEMENT' | 'HEX_PORT';
  title: string;
  code: string;
}
