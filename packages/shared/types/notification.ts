export type NotificationType = 'seat_published' | 'seat_changed' | 'appeal_received' | 'appeal_resolved' | 'quiz_reminder' | 'quiz_completed' | 'class_invite';
export type NotificationChannel = 'in_app' | 'wechat' | 'sms';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  recipientId: string;
  classId: string | null;
  relatedType: 'seat_plan' | 'appeal' | 'quiz' | 'class' | null;
  relatedId: string | null;
  read: boolean;
  readAt: string | null;
  channels: NotificationChannel[];
  sentAt: Record<string, string>;
  createdAt: string;
}
