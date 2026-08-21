export type AppealType = 'social' | 'vision' | 'noise' | 'conflict' | 'other';
export type AppealStatus = 'pending' | 'auto_resolved' | 'teacher_resolved' | 'rejected' | 'withdrawn';
export type AppealAction = 'approved' | 'rejected' | 'partial';

export interface Appeal {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  seatPlanId: string;
  type: AppealType;
  description: string;
  desiredNeighborId: string | null;
  desiredNeighborName: string | null;
  avoidNeighborId: string | null;
  avoidNeighborName: string | null;
  reasonDetail: string | null;
  attachments: string[];
  status: AppealStatus;
  autoResolution: AutoResolution | null;
  teacherResolution: TeacherResolution | null;
  createdAt: string;
}

export interface AutoResolution {
  suggestion: string;
  swapWithId: string | null;
  swapWithName: string | null;
  newSeatIndex: number | null;
  confidence: number;
  reason: string;
}

export interface TeacherResolution {
  action: AppealAction;
  note: string;
  newSeatIndex: number | null;
  resolvedAt: string;
  resolvedBy: string;
}

export interface CreateAppealRequest {
  classId: string;
  seatPlanId: string;
  type: AppealType;
  description: string;
  desiredNeighborId?: string;
  avoidNeighborId?: string;
  reasonDetail?: string;
  attachments?: File[];
}

export interface ResolveAppealRequest {
  action: AppealAction;
  note: string;
  newSeatIndex?: number;
  swapWithId?: string;
}
