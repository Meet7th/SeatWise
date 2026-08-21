export type ClassroomStatus = 'setup' | 'quiz_open' | 'quiz_closed' | 'seating_generated' | 'published' | 'archived';
export type SeatStrategy = 'fresh' | 'keep_neighbors' | 'mix_classes' | 'insert_transfer';
export type DoorPosition = 'right' | 'left' | 'front-right-back-left' | 'front-left-back-right';
export type NumberingMode = 'horizontal-snake' | 'vertical-snake' | 'random';

export interface Classroom {
  id: string;
  name: string;
  grade: string;
  semester: string;
  schoolId: string | null;
  homeroomTeacherId: string;
  teacherIds: string[];
  studentIds: string[];
  status: ClassroomStatus;
  inviteCode: string;
  inviteExpiresAt: string | null;
  seatConfig: SeatConfig;
  strategy: SeatStrategy;
  createdAt: string;
  updatedAt: string;
}

export interface SeatConfig {
  rows: number;
  cols: number;
  platformLeft: boolean;
  platformRight: boolean;
  doors: DoorPosition;
  numberingMode: NumberingMode;
  showDoors: boolean;
}

export interface CreateClassroomRequest {
  name: string;
  grade: string;
  semester: string;
  seatConfig: SeatConfig;
}

export interface JoinClassroomRequest {
  inviteCode: string;
  studentId?: string;
  name?: string;
  studentNumber?: string;
}
