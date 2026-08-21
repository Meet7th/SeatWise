import type { SeatStrategy } from './classroom';
import type { EvalWeights } from './eval';

export type SeatType = 'normal' | 'platform-left' | 'platform-right';
export type DrawMode = 'predictable' | 'unpredictable';

export interface SeatAssignment {
  seatIndex: number;
  seatNumber: number;
  row: number;
  col: number;
  type: SeatType;
  studentId: string | null;
  disabled: boolean;
}

export interface SeatPlan {
  id: string;
  classId: string;
  version: number;
  name: string;
  strategy: SeatStrategy;
  assignments: SeatAssignment[];
  weights: EvalWeights;
  metrics: PlanMetrics;
  status: 'draft' | 'published' | 'archived';
  publishedAt: string | null;
  publishedBy: string | null;
  createdAt: string;
  createdBy: string;
}

export interface PlanMetrics {
  academicBalance: number;
  personalityCompatibility: number;
  genderBalance: number;
  constraintSatisfaction: number;
  specialNeedsSatisfaction: number;
  overallScore: number;
}

export interface GeneratePlanRequest {
  classId: string;
  strategy: SeatStrategy;
  weights: EvalWeights;
  constraints: SeatConstraints;
  count: number;
}

export interface SeatConstraints {
  blacklist: string[][];
  whitelist: string[][];
  blacklistPenalty: number;
  blacklistRadius: number;
  whitelistDeskBonus: number;
  whitelistFrontBackBonus: number;
  whitelistDiagonalBonus: number;
  whitelistFallbackBonus: number;
  genderBalance: boolean;
  antiCluster: boolean;
  honorPinned: boolean;
  honorSpecialNeeds: boolean;
}

export interface SwapRequest {
  planId: string;
  seatIndexA: number;
  seatIndexB: number;
}
