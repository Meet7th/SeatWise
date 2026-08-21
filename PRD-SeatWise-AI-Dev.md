# SeatWise · 智座 — AI 开发规格文档

> **用途**：交给 AI 编码助手直接实现  
> **技术栈**：Vue 3 + TypeScript + Vite + Pinia + Tailwind CSS  
> **后端**：Node.js (Express/Koa) + MySQL + Redis + JWT  
> **版本**：v2.0 | 2026-08-21

---

## 0. 全局约定

### 0.1 项目结构

```
seatwise/
├── apps/
│   ├── web/                          # 前端 SPA
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── App.vue
│   │   │   ├── router/
│   │   │   │   └── index.ts          # 路由配置
│   │   │   ├── stores/               # Pinia
│   │   │   │   ├── auth.ts
│   │   │   │   ├── classroom.ts
│   │   │   │   ├── student.ts
│   │   │   │   ├── seating.ts
│   │   │   │   ├── quiz.ts
│   │   │   │   ├── appeal.ts
│   │   │   │   └── notification.ts
│   │   │   ├── api/                  # HTTP 请求
│   │   │   │   ├── client.ts         # axios 实例 + 拦截器
│   │   │   │   ├── auth.ts
│   │   │   │   ├── classroom.ts
│   │   │   │   ├── student.ts
│   │   │   │   ├── seating.ts
│   │   │   │   ├── quiz.ts
│   │   │   │   ├── appeal.ts
│   │   │   │   └── notification.ts
│   │   │   ├── views/                # 页面级组件
│   │   │   │   ├── auth/
│   │   │   │   │   ├── LoginView.vue
│   │   │   │   │   └── RegisterView.vue
│   │   │   │   ├── teacher/
│   │   │   │   │   ├── ClassListView.vue
│   │   │   │   │   ├── ClassDashboard.vue
│   │   │   │   │   ├── SeatingEditor.vue      # 核心：座位编排页
│   │   │   │   │   ├── StudentManager.vue
│   │   │   │   │   ├── QuizProgress.vue
│   │   │   │   │   ├── AppealManager.vue
│   │   │   │   │   └── SeatHistory.vue
│   │   │   │   └── student/
│   │   │   │       ├── HomeView.vue
│   │   │   │       ├── QuizView.vue
│   │   │   │       ├── QuizReportView.vue
│   │   │   │       ├── MySeatView.vue
│   │   │   │       ├── AppealFormView.vue
│   │   │   │       └── AppealHistoryView.vue
│   │   │   ├── components/           # 通用组件
│   │   │   │   ├── ui/               # 基础 UI
│   │   │   │   │   ├── Button.vue
│   │   │   │   │   ├── Modal.vue
│   │   │   │   │   ├── Toast.vue
│   │   │   │   │   ├── Dropdown.vue
│   │   │   │   │   ├── TabBar.vue
│   │   │   │   │   └── ...
│   │   │   │   ├── seating/          # 座位相关
│   │   │   │   │   ├── ClassroomGrid.vue
│   │   │   │   │   ├── SeatCell.vue
│   │   │   │   │   ├── PlatformSeat.vue
│   │   │   │   │   ├── ColumnHeaders.vue
│   │   │   │   │   ├── HeatmapOverlay.vue
│   │   │   │   │   └── QuickInfoBar.vue
│   │   │   │   ├── quiz/             # 测评相关
│   │   │   │   │   ├── QuizContainer.vue
│   │   │   │   │   ├── QuestionSingle.vue
│   │   │   │   │   ├── QuestionMultiple.vue
│   │   │   │   │   ├── QuestionLikert.vue
│   │   │   │   │   ├── QuestionTagSelect.vue
│   │   │   │   │   ├── QuestionSearch.vue
│   │   │   │   │   ├── QuestionSlider.vue
│   │   │   │   │   ├── ProgressBar.vue
│   │   │   │   │   └── ProfileReport.vue
│   │   │   │   ├── appeal/
│   │   │   │   │   ├── AppealCard.vue
│   │   │   │   │   ├── AppealForm.vue
│   │   │   │   │   └── AppealResolution.vue
│   │   │   │   └── layout/
│   │   │   │       ├── TeacherLayout.vue
│   │   │   │       ├── StudentLayout.vue
│   │   │   │       └── AuthLayout.vue
│   │   │   ├── composables/          # 逻辑复用
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useClassroom.ts
│   │   │   │   ├── useSeating.ts
│   │   │   │   ├── useDrawAlgorithm.ts
│   │   │   │   ├── useCompositeEval.ts
│   │   │   │   ├── useHeatmap.ts
│   │   │   │   ├── useMonteCarlo.ts
│   │   │   │   ├── useQuiz.ts
│   │   │   │   ├── useAppeal.ts
│   │   │   │   ├── useNotification.ts
│   │   │   │   ├── useUndoRedo.ts
│   │   │   │   └── useDragDrop.ts
│   │   │   ├── workers/
│   │   │   │   ├── monteCarlo.worker.ts
│   │   │   │   └── seatAlgorithm.worker.ts
│   │   │   ├── types/                # TypeScript 类型
│   │   │   │   ├── user.ts
│   │   │   │   ├── classroom.ts
│   │   │   │   ├── student.ts
│   │   │   │   ├── seat.ts
│   │   │   │   ├── quiz.ts
│   │   │   │   ├── appeal.ts
│   │   │   │   ├── notification.ts
│   │   │   │   └── api.ts
│   │   │   ├── utils/
│   │   │   │   ├── pinyin.ts         # 拼音搜索
│   │   │   │   ├── html.ts           # escapeHtml 等
│   │   │   │   ├── format.ts         # 日期/数字格式化
│   │   │   │   └── storage.ts        # localStorage 封装
│   │   │   └── assets/
│   │   │       └── styles/
│   │   │           ├── variables.css  # CSS 变量
│   │   │           └── global.css
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── tailwind.config.ts
│   │
│   └── server/                       # 后端
│       ├── src/
│       │   ├── index.ts              # 入口
│       │   ├── app.ts                # Express/Koa 实例
│       │   ├── config/
│       │   │   ├── database.ts
│       │   │   ├── redis.ts
│       │   │   └── env.ts
│       │   ├── middleware/
│       │   │   ├── auth.ts           # JWT 验证
│       │   │   ├── rbac.ts           # 角色鉴权
│       │   │   ├── validator.ts      # 请求校验
│       │   │   ├── rateLimit.ts      # 限流
│       │   │   └── errorHandler.ts
│       │   ├── routes/
│       │   │   ├── auth.ts
│       │   │   ├── classroom.ts
│       │   │   ├── student.ts
│       │   │   ├── quiz.ts
│       │   │   ├── seating.ts
│       │   │   ├── appeal.ts
│       │   │   └── notification.ts
│       │   ├── services/
│       │   │   ├── authService.ts
│       │   │   ├── classroomService.ts
│       │   │   ├── studentService.ts
│       │   │   ├── quizService.ts
│       │   │   ├── seatingService.ts
│       │   │   ├── appealService.ts
│       │   │   ├── notificationService.ts
│       │   │   └── algorithm/
│       │   │       ├── probabilityEngine.ts
│       │   │       ├── compositeEval.ts
│       │   │       ├── constraintEngine.ts
│       │   │       └── planGenerator.ts
│       │   ├── models/               # 数据模型 (Prisma/Sequelize)
│       │   │   └── schema.prisma
│       │   ├── types/
│       │   │   └── ...               # 同前端类型定义
│       │   └── utils/
│       │       ├── jwt.ts
│       │       ├── crypto.ts
│       │       ├── sms.ts
│       │       ├── email.ts
│       │       └── wechat.ts
│       ├── prisma/
│       │   └── schema.prisma
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── shared/                       # 前后端共享类型
│       └── types/
│           ├── index.ts
│           ├── user.ts
│           ├── classroom.ts
│           ├── student.ts
│           ├── seat.ts
│           ├── quiz.ts
│           ├── appeal.ts
│           └── notification.ts
│
└── package.json                      # monorepo root
```

### 0.2 命名约定

| 类型 | 规则 | 示例 |
|------|------|------|
| 文件名 | PascalCase（组件）/ camelCase（其他） | `SeatCell.vue` / `useAuth.ts` |
| 组件名 | PascalCase，多词 | `<SeatCell>`, `<QuizContainer>` |
| Store | `use` + 名称 + `Store` | `useAuthStore` |
| Composable | `use` + 名称 | `useSeating` |
| API 函数 | 动词 + 名称 | `getClassrooms()`, `createAppeal()` |
| 类型/接口 | PascalCase，无 `I` 前缀 | `Student`, `SeatPlan` |
| 常量 | UPPER_SNAKE_CASE | `MAX_ROWS`, `QUIZ_TIMEOUT` |

---

## 1. 共享类型定义（packages/shared/types/）

### 1.1 user.ts

```typescript
export type UserRole = 'student' | 'teacher' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'banned';
export type OAuthProvider = 'wechat' | 'qq' | 'phone' | 'email';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  avatar: string | null;
  phone: string | null;
  email: string | null;
  wechatOpenId: string | null;
  qqOpenId: string | null;
  studentNumber: string | null;
  schoolId: string | null;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AuthTokens {
  accessToken: string;   // JWT, 有效期 7 天
  refreshToken: string;  // 有效期 30 天
}

export interface LoginRequest {
  phone?: string;
  email?: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  phone?: string;
  email?: string;
  password: string;
  inviteCode: string;        // 班级邀请码
  studentNumber?: string;
}

export interface OAuthLoginRequest {
  provider: 'wechat' | 'qq';
  code: string;              // OAuth 授权码
  inviteCode?: string;       // 首次登录关联班级
}
```

### 1.2 classroom.ts

```typescript
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
  rows: number;               // 1-20
  cols: number;               // 1-20
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
  studentId?: string;          // 已注册用户直接关联
  name?: string;               // 新用户填写
  studentNumber?: string;
}
```

### 1.3 student.ts

```typescript
export type Gender = 'male' | 'female';
export type Personality = '外向' | '内向' | '中性';
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'read_write' | 'mixed';
export type SocialType = 'independent' | 'cooperative' | 'mixed';

export interface StudentProfile {
  studentId: string;
  classId: string;

  // 测评数据
  mbti: MbtiResult | null;
  learningStyle: LearningStyle | null;
  socialType: SocialType | null;
  interests: string[];
  specialNeeds: SpecialNeeds;
  socialPreferences: SocialPreferences;
  selfAssessment: SelfAssessment | null;

  // 教师/系统数据
  gender: Gender;
  lunch: boolean;
  scores: Record<string, number>;    // 科目 → 分数 (0-100)
  personality: Personality | null;   // 教师标注
  position: string | null;           // 班级职务
  teacherNotes: string;
  pinned: boolean;                   // 固定座位

  // 计算字段
  compositeScore: number | null;     // 0-100
  avgScore: number | null;
  profileCompleteness: number;       // 0-100

  createdAt: string;
  updatedAt: string;
}

export interface MbtiResult {
  type: string;           // 如 "ENFP"
  E_I: number;            // -100 ~ 100
  S_N: number;
  T_F: number;
  J_P: number;
}

export interface SpecialNeeds {
  vision: string | null;     // 如 "近视600度，需坐前排"
  hearing: string | null;
  physical: string | null;
  allergy: string | null;
  other: string | null;
}

export interface SocialPreferences {
  wantNear: string[];        // 学生 ID 列表
  avoidNear: string[];       // 学生 ID 列表
}

export interface SelfAssessment {
  academicLevel: number;     // 0-100
  motivation: number;        // 0-100
  socialAbility: number;     // 0-100
}
```

### 1.4 seat.ts

```typescript
export type SeatType = 'normal' | 'platform-left' | 'platform-right';
export type DrawMode = 'predictable' | 'unpredictable';

export interface SeatAssignment {
  seatIndex: number;         // row * cols + col
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

export interface EvalWeights {
  academic: number;          // 0-100, 默认 60
  personality: number;       // 默认 15
  hobby: number;             // 默认 10
  position: number;          // 默认 10
  gender: number;            // 默认 5
  specialNeeds: number;      // 默认 0 (v2 新增)
  socialPreference: number;  // 默认 0 (v2 新增)
}

export interface PlanMetrics {
  academicBalance: number;          // 0-100
  personalityCompatibility: number; // 0-100
  genderBalance: number;            // 0-100
  constraintSatisfaction: number;   // 0-100
  specialNeedsSatisfaction: number; // 0-100
  overallScore: number;             // 0-100
}

export interface GeneratePlanRequest {
  classId: string;
  strategy: SeatStrategy;
  weights: EvalWeights;
  constraints: SeatConstraints;
  count: number;             // 生成几套方案，默认 3
}

export interface SeatConstraints {
  blacklist: string[][];     // 每组是学生姓名数组
  whitelist: string[][];
  blacklistPenalty: number;  // 0-100, 默认 95
  blacklistRadius: number;   // 1-10, 默认 2
  whitelistDeskBonus: number;
  whitelistFrontBackBonus: number;
  whitelistDiagonalBonus: number;
  whitelistFallbackBonus: number;
  genderBalance: boolean;
  antiCluster: boolean;
  honorPinned: boolean;      // 固定座位不参与排列
  honorSpecialNeeds: boolean; // 特殊需求（如视力→前排）
}

export interface SwapRequest {
  planId: string;
  seatIndexA: number;
  seatIndexB: number;
}
```

### 1.5 quiz.ts

```typescript
export type QuestionType = 'single_choice' | 'multiple_choice' | 'likert' | 'tag_select' | 'search_select' | 'slider' | 'text';
export type QuestionDimension = 'mbti' | 'learning_style' | 'social' | 'interest' | 'special_needs' | 'social_relation' | 'self_assessment';
export type QuizStatus = 'not_started' | 'in_progress' | 'completed';

export interface QuizQuestion {
  id: string;
  dimension: QuestionDimension;
  type: QuestionType;
  question: string;
  description: string | null;
  options: QuizOption[] | null;
  tags: string[] | null;            // tag_select 用
  min: number | null;               // slider 用
  max: number | null;
  required: boolean;
  order: number;
}

export interface QuizOption {
  id: string;
  text: string;
  value: string;
  weight: Record<string, number>;   // 维度名 → 权重值
}

export interface QuizSession {
  id: string;
  studentId: string;
  classId: string;
  status: QuizStatus;
  answers: Record<string, unknown>; // questionId → answer
  startedAt: string | null;
  completedAt: string | null;
  result: StudentProfile | null;
}

export interface SubmitQuizRequest {
  classId: string;
  answers: Record<string, unknown>;
}

export interface QuizProgressItem {
  studentId: string;
  studentName: string;
  status: QuizStatus;
  completedAt: string | null;
  profileCompleteness: number;
}
```

### 1.6 appeal.ts

```typescript
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
  confidence: number;        // 0-100
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
  description: string;       // 50-500 字
  desiredNeighborId?: string;
  avoidNeighborId?: string;
  reasonDetail?: string;
  attachments?: File[];
}

export interface ResolveAppealRequest {
  action: AppealAction;
  note: string;              // rejected 时必填
  newSeatIndex?: number;     // approved/partial 时
  swapWithId?: string;       // approved 时指定互换对象
}
```

### 1.7 notification.ts

```typescript
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
```

---

## 2. 数据库 Schema（Prisma）

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  role          UserRole
  name          String    @db.VarChar(50)
  avatar        String?   @db.VarChar(255)
  phone         String?   @unique @db.VarChar(20)
  email         String?   @unique @db.VarChar(100)
  passwordHash  String?   @db.VarChar(255) @map("password_hash")
  wechatOpenId  String?   @unique @db.VarChar(64) @map("wechat_open_id")
  qqOpenId      String?   @unique @db.VarChar(64) @map("qq_open_id")
  studentNumber String?   @db.VarChar(30) @map("student_number")
  schoolId      String?   @db.VarChar(36) @map("school_id")
  status        UserStatus @default(active)
  createdAt     DateTime  @default(now()) @map("created_at")
  lastLoginAt   DateTime? @map("last_login_at")

  // Relations
  homeroomClasses   Classroom[]    @relation("HomeroomTeacher")
  teachingClasses   Classroom[]    @relation("ClassTeachers")    // many-to-many
  classMemberships  ClassStudent[]
  profile           StudentProfile?
  quizSessions      QuizSession[]
  appeals           Appeal[]
  notifications     Notification[]
  createdPlans      SeatPlan[]     @relation("PlanCreator")
  publishedPlans    SeatPlan[]     @relation("PlanPublisher")

  @@map("users")
}

enum UserRole {
  student
  teacher
  admin
}

enum UserStatus {
  active
  inactive
  banned
}

model Classroom {
  id                 String          @id @default(uuid())
  name               String          @db.VarChar(50)
  grade              String          @db.VarChar(20)
  semester           String          @db.VarChar(20)
  schoolId           String?         @db.VarChar(36) @map("school_id")
  homeroomTeacherId  String          @map("homeroom_teacher_id")
  homeroomTeacher    User            @relation("HomeroomTeacher", fields: [homeroomTeacherId], references: [id])
  seatConfig         Json            @map("seat_config")
  strategy           SeatStrategy    @default(fresh)
  status             ClassroomStatus @default(setup)
  inviteCode         String          @unique @db.VarChar(10) @map("invite_code")
  inviteExpiresAt    DateTime?       @map("invite_expires_at")
  createdAt          DateTime        @default(now()) @map("created_at")
  updatedAt          DateTime        @updatedAt @map("updated_at")

  // Relations
  teachers     User[]           @relation("ClassTeachers")
  students     ClassStudent[]
  profiles     StudentProfile[]
  quizSessions QuizSession[]
  seatPlans    SeatPlan[]
  appeals      Appeal[]

  @@map("classrooms")
}

enum ClassroomStatus {
  setup
  quiz_open
  quiz_closed
  seating_generated
  published
  archived
}

enum SeatStrategy {
  fresh
  keep_neighbors
  mix_classes
  insert_transfer
}

model ClassStudent {
  classId   String    @map("class_id")
  studentId String    @map("student_id")
  joinedAt  DateTime  @default(now()) @map("joined_at")

  class     Classroom @relation(fields: [classId], references: [id], onDelete: Cascade)
  student   User      @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@id([classId, studentId])
  @@map("class_students")
}

model StudentProfile {
  id                   String   @id @default(uuid())
  studentId            String   @unique @map("student_id")
  classId              String   @map("class_id")
  mbti                 Json?
  learningStyle        String?  @db.VarChar(20) @map("learning_style")
  socialType           String?  @db.VarChar(20) @map("social_type")
  interests            Json     @default("[]")
  specialNeeds         Json     @default("{}") @map("special_needs")
  socialPreferences    Json     @default("{}") @map("social_preferences")
  selfAssessment       Json?    @map("self_assessment")
  scores               Json     @default("{}")
  gender               Gender
  lunch                Boolean  @default(false)
  personality          String?  @db.VarChar(10)
  position             String?  @db.VarChar(20)
  teacherNotes         String   @default("") @db.Text @map("teacher_notes")
  pinned               Boolean  @default(false)
  compositeScore       Decimal? @db.Decimal(5, 2) @map("composite_score")
  avgScore             Decimal? @db.Decimal(5, 2) @map("avg_score")
  profileCompleteness  Decimal  @default(0) @db.Decimal(5, 2) @map("profile_completeness")
  createdAt            DateTime @default(now()) @map("created_at")
  updatedAt            DateTime @updatedAt @map("updated_at")

  student  User      @relation(fields: [studentId], references: [id], onDelete: Cascade)
  class    Classroom @relation(fields: [classId], references: [id], onDelete: Cascade)

  @@index([classId])
  @@map("student_profiles")
}

enum Gender {
  male
  female
}

model QuizSession {
  id          String    @id @default(uuid())
  studentId   String    @map("student_id")
  classId     String    @map("class_id")
  status      QuizStatus @default(not_started)
  answers     Json      @default("{}")
  startedAt   DateTime? @map("started_at")
  completedAt DateTime? @map("completed_at")

  student User      @relation(fields: [studentId], references: [id], onDelete: Cascade)
  class   Classroom @relation(fields: [classId], references: [id], onDelete: Cascade)

  @@unique([studentId, classId])
  @@index([classId, status])
  @@map("quiz_sessions")
}

enum QuizStatus {
  not_started
  in_progress
  completed
}

model SeatPlan {
  id          String        @id @default(uuid())
  classId     String        @map("class_id")
  version     Int           @default(1)
  name        String?       @db.VarChar(50)
  strategy    SeatStrategy
  assignments Json
  weights     Json
  metrics     Json
  status      PlanStatus    @default(draft)
  publishedAt DateTime?     @map("published_at")
  publishedBy String?       @map("published_by")
  createdAt   DateTime      @default(now()) @map("created_at")
  createdBy   String        @map("created_by")

  class       Classroom     @relation(fields: [classId], references: [id], onDelete: Cascade)
  creator     User          @relation("PlanCreator", fields: [createdBy], references: [id])
  publisher   User?         @relation("PlanPublisher", fields: [publishedBy], references: [id])
  appeals     Appeal[]

  @@index([classId, status])
  @@map("seat_plans")
}

enum PlanStatus {
  draft
  published
  archived
}

model Appeal {
  id               String       @id @default(uuid())
  studentId        String       @map("student_id")
  classId          String       @map("class_id")
  seatPlanId       String       @map("seat_plan_id")
  type             AppealType
  description      String       @db.Text
  desiredNeighborId String?     @map("desired_neighbor_id")
  avoidNeighborId  String?      @map("avoid_neighbor_id")
  reasonDetail     String?      @db.Text @map("reason_detail")
  attachments      Json         @default("[]")
  status           AppealStatus @default(pending)
  autoResolution   Json?        @map("auto_resolution")
  teacherResolution Json?       @map("teacher_resolution")
  createdAt        DateTime     @default(now()) @map("created_at")

  student   User      @relation(fields: [studentId], references: [id], onDelete: Cascade)
  class     Classroom @relation(fields: [classId], references: [id], onDelete: Cascade)
  seatPlan  SeatPlan  @relation(fields: [seatPlanId], references: [id], onDelete: Cascade)

  @@index([classId, status])
  @@index([studentId])
  @@map("appeals")
}

enum AppealType {
  social
  vision
  noise
  conflict
  other
}

enum AppealStatus {
  pending
  auto_resolved
  teacher_resolved
  rejected
  withdrawn
}

model Notification {
  id           String             @id @default(uuid())
  type         NotificationType
  title        String             @db.VarChar(100)
  body         String             @db.Text
  recipientId  String             @map("recipient_id")
  classId      String?            @map("class_id")
  relatedType  String?            @db.VarChar(20) @map("related_type")
  relatedId    String?            @db.VarChar(36) @map("related_id")
  read         Boolean            @default(false)
  readAt       DateTime?          @map("read_at")
  channels     Json
  sentAt       Json               @default("{}")
  createdAt    DateTime           @default(now()) @map("created_at")

  recipient User @relation(fields: [recipientId], references: [id], onDelete: Cascade)

  @@index([recipientId, read])
  @@index([recipientId, createdAt])
  @@map("notifications")
}

enum NotificationType {
  seat_published
  seat_changed
  appeal_received
  appeal_resolved
  quiz_reminder
  quiz_completed
  class_invite
}
```

---

## 3. 后端 API 详细规格

### 3.1 通用约定

**请求头：**
```
Content-Type: application/json
Authorization: Bearer <accessToken>
```

**成功响应格式：**
```json
{
  "code": 0,
  "data": { ... },
  "message": "ok"
}
```

**错误响应格式：**
```json
{
  "code": 40001,
  "data": null,
  "message": "邀请码无效或已过期",
  "details": { "field": "inviteCode" }
}
```

**错误码规范：**
| 范围 | 含义 |
|------|------|
| 40000-40099 | 请求参数错误 |
| 40100-40199 | 认证错误 |
| 40300-40399 | 权限不足 |
| 40400-40499 | 资源不存在 |
| 40900-40999 | 冲突（重复操作） |
| 42900-42999 | 限流 |
| 50000-50099 | 服务器内部错误 |

### 3.2 认证 API

#### POST /api/auth/register

**请求体：**
```json
{
  "name": "张三",
  "phone": "13800138000",
  "password": "Abc123456",
  "inviteCode": "A1B2C3",
  "studentNumber": "20260101"
}
```

**校验规则：**
- `name`: 2-50 字符，不允许特殊字符
- `phone`: 11 位手机号，或 `email` 二选一
- `password`: 8-32 字符，至少含 1 大写 + 1 小写 + 1 数字
- `inviteCode`: 6 位字母数字，查数据库验证存在且未过期
- `studentNumber`: 可选，如提供则在该班级内唯一

**成功响应 (200)：**
```json
{
  "code": 0,
  "data": {
    "user": { "id": "...", "name": "张三", "role": "student", ... },
    "tokens": { "accessToken": "...", "refreshToken": "..." }
  }
}
```

**错误场景：**
| code | 场景 |
|------|------|
| 40001 | 邀请码无效或已过期 |
| 40002 | 手机号已被注册 |
| 40003 | 学号在该班级已被占用 |
| 40004 | 密码强度不足 |

#### POST /api/auth/login

**请求体：**
```json
{
  "phone": "13800138000",
  "password": "Abc123456"
}
```

**成功响应：** 同 register

#### POST /api/auth/oauth/wechat

**请求体：**
```json
{
  "code": "wx_auth_code",
  "inviteCode": "A1B2C3"   // 首次登录时必填
}
```

**逻辑：**
1. 用 code 换取 wechatOpenId
2. 查找是否有用户绑定该 wechatOpenId
3. 如有 → 登录，返回 tokens
4. 如无 → 需要 inviteCode，创建新用户并关联班级

#### POST /api/auth/refresh

**请求体：** `{ "refreshToken": "..." }`

### 3.3 管理员 API（后台）

#### GET /api/admin/users

**权限：** admin

**查询参数：** `?role=student&search=张&status=active&page=1&pageSize=20`

**响应：**
```json
{
  "code": 0,
  "data": {
    "total": 1200,
    "items": [
      {
        "id": "...",
        "name": "张三",
        "role": "student",
        "phone": "138****8000",
        "email": null,
        "studentNumber": "20260101",
        "status": "active",
        "classCount": 1,
        "className": "高一(3)班",
        "lastLoginAt": "2026-08-21T10:00:00Z",
        "createdAt": "2026-08-01T00:00:00Z"
      }
    ]
  }
}
```

#### PUT /api/admin/users/:id/status

**权限：** admin

**请求体：** `{ "status": "banned", "reason": "疑似盗用注册" }`

**逻辑：**
1. 更新用户 status
2. 如 status=banned：撤销所有 refresh token，推送强制下线通知
3. 如 status=active（解封）：清除封禁记录
4. 记录操作日志（adminId, targetUserId, action, reason, timestamp）

#### DELETE /api/admin/users/:id

**权限：** admin

**逻辑：** 软删除（status 改为 inactive），保留数据 30 天后物理删除

#### GET /api/admin/users/:id/detail

**权限：** admin

**响应：** 返回完整用户信息 + 所属班级列表 + 登录日志 + 风险标记

```json
{
  "code": 0,
  "data": {
    "user": { /* 完整 User */ },
    "classes": [
      { "id": "...", "name": "高一(3)班", "role": "student", "joinedAt": "..." }
    ],
    "loginHistory": [
      { "ip": "1.2.3.4", "device": "iPhone Safari", "at": "...", "location": "杭州" }
    ],
    "riskFlags": {
      "suspiciousRegistration": false,
      "duplicateDevice": false,
      "rapidMultiClass": false,
      "score": 0
    }
  }
}
```

#### GET /api/admin/audit-logs

**权限：** admin

**查询参数：** `?adminId=xxx&action=ban_user&from=2026-08-01&to=2026-08-21&page=1&pageSize=50`

#### POST /api/admin/users/batch-action

**权限：** admin

**请求体：**
```json
{
  "userIds": ["id1", "id2", "id3"],
  "action": "ban",
  "reason": "批量清理疑似盗用账号"
}
```

### 3.4 防盗用注册机制

#### 注册风控规则

```typescript
// server/src/services/riskService.ts

interface RiskCheckResult {
  allowed: boolean;
  riskScore: number;        // 0-100
  flags: RiskFlag[];
  requireVerification: boolean;  // 是否需要额外验证
  blockReason: string | null;
}

type RiskFlag = 
  | 'ip_rate_limit'         // 同 IP 短时间内多次注册
  | 'device_fingerprint'     // 同设备多账号
  | 'phone_virtual'          // 虚拟号段（170/171/165等）
  | 'email_disposable'       // 一次性邮箱
  | 'name_pattern'           // 姓名异常（纯数字、特殊字符、过长）
  | 'invite_code_abuse'      // 同一邀请码被大量使用
  | 'geo_anomaly'            // 地理位置异常（与学校所在地差异过大）
  | 'rapid_multi_class';     // 短时间内加入多个班级

async function checkRegistrationRisk(req: RegisterRequest, context: {
  ip: string;
  deviceId: string;
  userAgent: string;
}): Promise<RiskCheckResult> {
  let riskScore = 0;
  const flags: RiskFlag[] = [];

  // 1. IP 频率检测：同 IP 1小时内注册 > 3 次
  const recentFromIp = await countRecentRegistrations(context.ip, '1h');
  if (recentFromIp >= 3) { riskScore += 30; flags.push('ip_rate_limit'); }
  if (recentFromIp >= 10) { riskScore += 40; }

  // 2. 设备指纹检测：同设备 > 2 个账号
  const accountsOnDevice = await countAccountsByDevice(context.deviceId);
  if (accountsOnDevice >= 2) { riskScore += 25; flags.push('device_fingerprint'); }

  // 3. 虚拟号段检测
  if (req.phone && isVirtualPhoneNumber(req.phone)) {
    riskScore += 20; flags.push('phone_virtual');
  }

  // 4. 一次性邮箱检测
  if (req.email && isDisposableEmail(req.email)) {
    riskScore += 30; flags.push('email_disposable');
  }

  // 5. 姓名异常检测
  if (req.name && (/\d{3,}/.test(req.name) || req.name.length > 20 || /[!@#$%^&*]/.test(req.name))) {
    riskScore += 15; flags.push('name_pattern');
  }

  // 6. 邀请码滥用检测：同一邀请码 1小时内 > 10 次使用
  if (req.inviteCode) {
    const codeUsage = await countRecentInviteCodeUsage(req.inviteCode, '1h');
    if (codeUsage >= 10) { riskScore += 35; flags.push('invite_code_abuse'); }
  }

  // 7. 快速多班级检测：同一用户 24小时内加入 > 3 个班级
  if (req.inviteCode) {
    const recentJoins = await countRecentClassJoins(req.phone || req.email, '24h');
    if (recentJoins >= 3) { riskScore += 20; flags.push('rapid_multi_class'); }
  }

  // 判定
  const result: RiskCheckResult = {
    allowed: riskScore < 70,
    riskScore,
    flags,
    requireVerification: riskScore >= 40,
    blockReason: riskScore >= 70 ? '检测到异常注册行为，请联系管理员' : null,
  };

  // 记录风险事件
  if (riskScore >= 40) {
    await logRiskEvent({ ip: context.ip, deviceId: context.deviceId, phone: req.phone, flags, riskScore });
  }

  return result;
}
```

#### 注册流程（含风控）

```
用户提交注册
    │
    ▼
风控检测 (checkRegistrationRisk)
    │
    ├─ riskScore < 40 → 正常注册流程
    │
    ├─ 40 ≤ riskScore < 70 → 增强验证
    │   ├─ 手机号注册 → 要求短信验证码（必须）
    │   ├─ 邮箱注册 → 要求邮箱验证码（必须）
    │   └─ 需要图形验证码 (CAPTCHA)
    │
    └─ riskScore ≥ 70 → 阻止注册
        └─ 返回提示 "注册受限，请联系管理员"
        └─ 记录到 admin 风控日志
```

#### 登录风控

```typescript
async function checkLoginRisk(userId: string, context: {
  ip: string;
  deviceId: string;
  userAgent: string;
}): Promise<{ requireMfa: boolean; block: boolean }> {
  // 1. 异地登录检测
  const lastLogin = await getLastLogin(userId);
  if (lastLogin && lastLogin.ip !== context.ip) {
    const geoDiff = await calculateGeoDistance(lastLogin.ip, context.ip);
    if (geoDiff > 500) {  // 超过500km
      // 两次登录间隔小于路程所需时间 → 可疑
      const timeDiff = Date.now() - new Date(lastLogin.at).getTime();
      const hoursNeeded = geoDiff / 800;  // 粗略估算（高铁800km/h）
      if (timeDiff < hoursNeeded * 3600 * 1000) {
        return { requireMfa: true, block: false };
      }
    }
  }

  // 2. 密码错误次数检测
  const recentFails = await countRecentLoginFailures(context.ip, '15m');
  if (recentFails >= 5) {
    return { requireMfa: false, block: true };
  }

  // 3. 新设备登录检测
  const knownDevice = await isKnownDevice(userId, context.deviceId);
  if (!knownDevice) {
    return { requireMfa: true, block: false };
  }

  return { requireMfa: false, block: false };
}
```

---

### 3.5 班级 API

#### POST /api/classrooms

**权限：** teacher, admin

**请求体：**
```json
{
  "name": "高一(3)班",
  "grade": "高一",
  "semester": "2026秋季",
  "seatConfig": {
    "rows": 7,
    "cols": 11,
    "platformLeft": true,
    "platformRight": true,
    "doors": "right",
    "numberingMode": "horizontal-snake",
    "showDoors": true
  }
}
```

**校验：** rows/cols 1-20

**响应：** 返回 Classroom 对象 + 自动生成的 inviteCode

#### POST /api/classrooms/:id/invite

**权限：** 本班班主任

**请求体：** `{ "expiresInDays": 30 }`

**响应：**
```json
{
  "code": 0,
  "data": {
    "inviteCode": "A1B2C3",
    "inviteLink": "https://seatwise.app/join?code=A1B2C3",
    "expiresAt": "2026-09-21T00:00:00Z"
  }
}
```

#### POST /api/classrooms/:id/join

**权限：** student（已登录）

**请求体：** `{ "inviteCode": "A1B2C3" }`

**逻辑：** 将当前用户添加到班级学生列表，状态为 `待测评`

#### GET /api/classrooms/:id/students

**权限：** 本班教师

**查询参数：** `?search=张&filter=quiz_completed&page=1&pageSize=20`

**响应：**
```json
{
  "code": 0,
  "data": {
    "total": 45,
    "items": [
      {
        "id": "...",
        "name": "张三",
        "studentNumber": "20260101",
        "gender": "male",
        "quizStatus": "completed",
        "profileCompleteness": 85,
        "compositeScore": 78.5,
        "pinned": false
      }
    ]
  }
}
```

#### POST /api/classrooms/:id/scores/import

**权限：** 本班教师

**请求体：** multipart/form-data，字段 `file`（Excel 文件）

**逻辑：**
1. 解析 Excel，自动匹配表头列名到科目
2. 根据姓名或学号匹配到学生
3. 更新 student_profiles 表的 scores 字段
4. 重新计算 compositeScore 和 avgScore
5. 返回导入结果（成功数、失败数、失败原因）

**响应：**
```json
{
  "code": 0,
  "data": {
    "imported": 42,
    "failed": 3,
    "failures": [
      { "row": 5, "name": "未知学生", "reason": "未找到匹配学生" }
    ]
  }
}
```

### 3.6 测评 API

#### GET /api/quiz/questions/:classId

**权限：** student（本班学生）

**响应：** 返回该班级的测评题目列表（按 order 排序）

**题目生成逻辑：**
1. 固定题库（MBTI 16题 + 学习风格 8题 + 社交偏好 5题 + 兴趣标签 1题 + 特殊需求 1题 + 社交关系 1题 + 自评 3题 = 35题）
2. 题目顺序在维度内随机打乱（不同学生看到不同顺序）
3. MBTI 题目的选项顺序也随机打乱

#### POST /api/quiz/submit

**权限：** student

**请求体：**
```json
{
  "classId": "...",
  "answers": {
    "q1": "A",        // 单选
    "q2": ["A","C"],  // 多选
    "q3": 4,          // 量表 1-5
    "q4": ["篮球","绘画","编程"],  // 标签
    "q5": { "vision": "近视600度" },  // 特殊需求
    "q6": { "wantNear": ["student-id-1"], "avoidNear": [] },  // 社交关系
    "q7": 75          // 滑块
  }
}
```

**后端处理逻辑：**
1. 校验所有必答题已回答
2. 校验答案格式（选项是否存在、值是否在范围内）
3. 防随意检测：检查答题时间（session 中记录每题开始时间，< 2秒的标记为可疑）
4. 计算各维度得分：
   - MBTI：累加各维度权重，确定四字母类型
   - 学习风格：取最高分维度
   - 社交类型：根据社交偏好题得分判定
   - 兴趣：直接存储标签数组
5. 生成 StudentProfile 记录
6. 计算 compositeScore（算法见 §4）
7. 计算 profileCompleteness
8. 更新 QuizSession 状态为 completed
9. 给班主任发送通知

**响应：**
```json
{
  "code": 0,
  "data": {
    "sessionId": "...",
    "profile": { /* StudentProfile */ }
  }
}
```

#### GET /api/quiz/progress/:classId

**权限：** 本班教师

**响应：**
```json
{
  "code": 0,
  "data": {
    "total": 45,
    "completed": 38,
    "inProgress": 5,
    "notStarted": 2,
    "completionRate": 84.4,
    "students": [
      { "studentId": "...", "name": "张三", "status": "completed", "completedAt": "...", "profileCompleteness": 85 },
      { "studentId": "...", "name": "李四", "status": "in_progress", "completedAt": null, "profileCompleteness": 40 },
      { "studentId": "...", "name": "王五", "status": "not_started", "completedAt": null, "profileCompleteness": 0 }
    ]
  }
}
```

### 3.7 排座 API

#### POST /api/seating/generate

**权限：** 本班教师

**请求体：**
```json
{
  "classId": "...",
  "strategy": "fresh",
  "count": 3,
  "weights": {
    "academic": 60,
    "personality": 15,
    "hobby": 10,
    "position": 10,
    "gender": 5,
    "specialNeeds": 20,
    "socialPreference": 15
  },
  "constraints": {
    "blacklist": [["张三", "李四"], ["*王五", "赵六"]],
    "whitelist": [["小明", "小红"]],
    "blacklistPenalty": 95,
    "blacklistRadius": 2,
    "whitelistDeskBonus": 200,
    "whitelistFrontBackBonus": 120,
    "whitelistDiagonalBonus": 60,
    "whitelistFallbackBonus": 150,
    "genderBalance": true,
    "antiCluster": true,
    "honorPinned": true,
    "honorSpecialNeeds": true
  }
}
```

**后端算法流程：**

```
输入: students[], seatConfig, strategy, weights, constraints

1. 确定抽签池:
   - honorPinned=true: 固定学生预先分配到当前座位，从池中排除
   - strategy=insert_transfer: 仅新学生进池，其他固定
   - strategy=keep_neighbors: 标记需要调整的学生进池

2. 确定抽取顺序:
   - platform-right → platform-left → 普通座位按编号升序
   - 跳过 disabled 座位

3. 对每套方案 (共 count 套):
   a. 初始化: remaining = [...抽签池]
   b. 对每个待排座位:
      i.   计算每个 remaining 学生的概率
      ii.  概率 = 基础(1.0) × 黑名单惩罚 × 白名单加成 × 性别均衡 × 特殊需求 × 社交偏好 × 历史惩罚
      iii. 归一化概率
      iv.  加权随机抽取
      v.   将学生分配到座位
      vi.  从 remaining 移除
   c. 计算方案 metrics
   d. 存储为 SeatPlan (status=draft)

4. 返回 count 套方案（按 overallScore 降序）
```

**概率计算详细逻辑：**

```typescript
function calculateProbabilities(
  remaining: StudentProfile[],
  seatedSeats: SeatAssignment[],
  nextSeat: SeatAssignment,
  constraints: SeatConstraints,
  weights: EvalWeights
): Map<string, number> {
  const probs = new Map<string, number>();
  
  for (const student of remaining) {
    let prob = 1.0;
    
    // 1. 黑名单惩罚
    if (constraints.antiCluster) {
      for (const group of constraints.blacklist) {
        const cleanGroup = group.map(parseAnchorName);
        const anchorNames = cleanGroup.filter(n => n.isAnchor).map(n => n.name);
        const drawnInGroup = cleanGroup.filter(n => 
          seatedSeats.some(s => s.studentId === findStudentId(n.name))
        );
        
        if (drawnInGroup.length === 0) continue;
        
        const anchors = anchorNames.length > 0 
          ? drawnInGroup.filter(n => anchorNames.includes(n.name))
          : [drawnInGroup[0]];
        
        if (!cleanGroup.some(n => n.name === getStudentName(student))) continue;
        
        for (const anchor of anchors) {
          const anchorSeat = seatedSeats.find(s => s.studentId === findStudentId(anchor.name));
          if (!anchorSeat) continue;
          
          const dist = effectiveDistance(anchorSeat, nextSeat);
          if (dist <= constraints.blacklistRadius) {
            prob *= Math.max(0.001, 1 - constraints.blacklistPenalty / 100);
          }
        }
      }
    }
    
    // 2. 白名单加成
    if (constraints.antiCluster) {
      for (const group of constraints.whitelist) {
        const cleanGroup = group.map(parseAnchorName);
        const drawnInGroup = cleanGroup.filter(n =>
          seatedSeats.some(s => s.studentId === findStudentId(n.name))
        );
        
        if (drawnInGroup.length === 0) continue;
        if (!cleanGroup.some(n => n.name === getStudentName(student))) continue;
        
        let bestBonus = 0;
        for (const drawn of drawnInGroup) {
          const drawnSeat = seatedSeats.find(s => s.studentId === findStudentId(drawn.name));
          if (!drawnSeat) continue;
          
          const rowDiff = Math.abs(drawnSeat.row - nextSeat.row);
          const colDiff = Math.abs(drawnSeat.col - nextSeat.col);
          const dist = effectiveDistance(drawnSeat, nextSeat);
          
          let bonus = 0;
          if (rowDiff === 0 && colDiff === 1) bonus = constraints.whitelistDeskBonus / 100;
          else if (rowDiff === 1 && colDiff === 0) bonus = constraints.whitelistFrontBackBonus / 100;
          else if (rowDiff === 1 && colDiff === 1) bonus = constraints.whitelistDiagonalBonus / 100;
          else if (dist <= 5) bonus = constraints.whitelistFallbackBonus / 100;
          
          bestBonus = Math.max(bestBonus, bonus);
        }
        
        if (bestBonus > 0) {
          prob *= Math.pow(1 + bestBonus, 3);  // 立方缩放
        }
      }
    }
    
    // 3. 性别均衡
    if (constraints.genderBalance) {
      const maleRatio = remaining.filter(s => s.gender === 'male').length / remaining.length;
      const femaleRatio = 1 - maleRatio;
      if (student.gender === 'male' && maleRatio > 0.6) prob *= 0.7;
      if (student.gender === 'female' && femaleRatio > 0.6) prob *= 0.7;
    }
    
    // 4. 特殊需求
    if (constraints.honorSpecialNeeds && student.specialNeeds?.vision) {
      // 视力需求 → 前排加成
      if (nextSeat.row < Math.ceil(seatConfig.rows / 3)) {
        prob *= 3.0;
      } else {
        prob *= 0.3;
      }
    }
    
    // 5. 社交偏好
    if (weights.socialPreference > 0) {
      const prefs = student.socialPreferences;
      if (prefs?.wantNear?.length > 0) {
        for (const wantId of prefs.wantNear) {
          const wantSeat = seatedSeats.find(s => s.studentId === wantId);
          if (wantSeat) {
            const dist = effectiveDistance(wantSeat, nextSeat);
            if (dist <= 2) prob *= 2.0;
          }
        }
      }
      if (prefs?.avoidNear?.length > 0) {
        for (const avoidId of prefs.avoidNear) {
          const avoidSeat = seatedSeats.find(s => s.studentId === avoidId);
          if (avoidSeat) {
            const dist = effectiveDistance(avoidSeat, nextSeat);
            if (dist <= 2) prob *= 0.2;
          }
        }
      }
    }
    
    // 6. 性格互补
    if (weights.personality > 0 && student.personality) {
      const neighbors = getNeighborSeats(nextSeat, seatedSeats);
      for (const neighbor of neighbors) {
        if (!neighbor.studentId) continue;
        const neighborProfile = getProfile(neighbor.studentId);
        if (!neighborProfile?.personality) continue;
        
        if (isComplementary(student.personality, neighborProfile.personality)) {
          prob *= 1.5;
        }
      }
    }
    
    probs.set(student.studentId, Math.max(prob, 0.001));
  }
  
  // 归一化
  const total = Array.from(probs.values()).reduce((a, b) => a + b, 0);
  for (const [id, p] of probs) {
    probs.set(id, p / total);
  }
  
  return probs;
}
```

**特殊需求处理逻辑：**

```typescript
function applySpecialNeeds(
  students: StudentProfile[],
  seatConfig: SeatConfig
): Map<string, number[]> {
  // 返回 studentId → 优先座位行号列表
  const priority = new Map<string, number[]>();
  
  for (const student of students) {
    const needs = student.specialNeeds;
    if (!needs) continue;
    
    const preferredRows: number[] = [];
    
    if (needs.vision) {
      // 近视 → 前 1/3 排
      const frontRows = Math.ceil(seatConfig.rows / 3);
      for (let r = 0; r < frontRows; r++) preferredRows.push(r);
    }
    
    if (needs.hearing) {
      // 听力问题 → 前排 + 靠左（教师通常在左侧）
      const frontRows = Math.ceil(seatConfig.rows / 3);
      for (let r = 0; r < frontRows; r++) preferredRows.push(r);
      // 额外加成在约束引擎中处理
    }
    
    if (needs.physical?.includes('身高')) {
      // 身高特殊 → 后排
      const backRows = Math.ceil(seatConfig.rows / 3);
      for (let r = seatConfig.rows - backRows; r < seatConfig.rows; r++) preferredRows.push(r);
    }
    
    if (preferredRows.length > 0) {
      priority.set(student.studentId, [...new Set(preferredRows)]);
    }
  }
  
  return priority;
}
```

**通道距离计算（enhanced）：**

```typescript
function effectiveDistance(
  seatA: { row: number; col: number },
  seatB: { row: number; col: number },
  disabledSeats: Set<string>,  // "row,col" 格式
  aisleCols: Set<number>       // 整列禁用的列号
): number {
  // 同行：检查中间是否有通道/禁用座位
  if (seatA.row === seatB.row) {
    const minC = Math.min(seatA.col, seatB.col);
    const maxC = Math.max(seatA.col, seatB.col);
    for (let c = minC + 1; c < maxC; c++) {
      if (aisleCols.has(c) || disabledSeats.has(`${seatA.row},${c}`)) {
        return Infinity; // 通道阻断
      }
    }
  }
  
  // 同列：检查中间是否有禁用座位
  if (seatA.col === seatB.col) {
    const minR = Math.min(seatA.row, seatB.row);
    const maxR = Math.max(seatA.row, seatB.row);
    for (let r = minR + 1; r < maxR; r++) {
      if (disabledSeats.has(`${r},${seatA.col}`)) {
        return Infinity;
      }
    }
  }
  
  // 斜向：检查两条路径
  if (seatA.row !== seatB.row && seatA.col !== seatB.col) {
    // 路径1: 先横后竖
    let path1Blocked = false;
    for (let c = Math.min(seatA.col, seatB.col) + 1; c < Math.max(seatA.col, seatB.col); c++) {
      if (aisleCols.has(c) || disabledSeats.has(`${seatA.row},${c}`)) { path1Blocked = true; break; }
    }
    if (!path1Blocked) {
      for (let r = Math.min(seatA.row, seatB.row) + 1; r < Math.max(seatA.row, seatB.row); r++) {
        if (disabledSeats.has(`${r},${seatB.col}`)) { path1Blocked = true; break; }
      }
    }
    
    // 路径2: 先竖后横
    let path2Blocked = false;
    for (let r = Math.min(seatA.row, seatB.row) + 1; r < Math.max(seatA.row, seatB.row); r++) {
      if (disabledSeats.has(`${r},${seatA.col}`)) { path2Blocked = true; break; }
    }
    if (!path2Blocked) {
      for (let c = Math.min(seatA.col, seatB.col) + 1; c < Math.max(seatA.col, seatB.col); c++) {
        if (aisleCols.has(c) || disabledSeats.has(`${seatB.row},${c}`)) { path2Blocked = true; break; }
      }
    }
    
    if (path1Blocked && path2Blocked) return Infinity;
  }
  
  return Math.abs(seatA.row - seatB.row) + Math.abs(seatA.col - seatB.col);
}
```

**响应：**
```json
{
  "code": 0,
  "data": {
    "plans": [
      {
        "id": "plan-1",
        "version": 1,
        "name": "方案A - 学业优先",
        "strategy": "fresh",
        "assignments": [ /* SeatAssignment[] */ ],
        "weights": { ... },
        "metrics": {
          "academicBalance": 85,
          "personalityCompatibility": 72,
          "genderBalance": 90,
          "constraintSatisfaction": 95,
          "specialNeedsSatisfaction": 100,
          "overallScore": 84
        },
        "status": "draft"
      },
      { "id": "plan-2", "name": "方案B - 性格互补", ... },
      { "id": "plan-3", "name": "方案C - 综合平衡", ... }
    ]
  }
}
```

#### POST /api/seating/plans/:planId/publish

**权限：** 本班教师

**请求体：** `{ "notifyStudents": true }`

**逻辑：**
1. 将该方案 status 改为 published
2. 将该班级其他 draft 方案改为 archived
3. 如 notifyStudents=true，给所有学生发送通知
4. 记录 publishedAt 和 publishedBy

#### POST /api/seating/plans/:planId/withdraw

**权限：** 本班教师

**逻辑：**
1. 检查 publishedAt 是否在 5 分钟内
2. 如在 5 分钟内 → 静默撤回，不通知学生
3. 如超过 5 分钟 → 需要 confirm=true 参数，撤回后通知学生
4. status 改为 archived

#### POST /api/seating/swap

**权限：** 本班教师

**请求体：** `{ "planId": "...", "seatIndexA": 5, "seatIndexB": 12 }`

**逻辑：** 交换两个座位的学生，重新计算 metrics

### 3.8 申诉 API

#### POST /api/appeals

**权限：** student

**请求体：** 见 §1.6 CreateAppealRequest

**校验：**
- 座位已发布且超过 24 小时
- 当月申诉次数 < 2
- description 50-500 字

**后端逻辑：**
1. 创建 Appeal 记录 (status=pending)
2. 运行自动分析（见 §4.3）
3. 如可自动解决 → 更新 autoResolution，status 改为 auto_resolved
4. 如需人工 → 保持 pending
5. 给班主任发送通知

**自动分析逻辑：**

```typescript
async function analyzeAppeal(
  appeal: Appeal,
  currentPlan: SeatPlan,
  profiles: Map<string, StudentProfile>
): Promise<AutoResolution | null> {
  const studentProfile = profiles.get(appeal.studentId);
  const studentSeat = currentPlan.assignments.find(a => a.studentId === appeal.studentId);
  if (!studentSeat) return null;
  
  switch (appeal.type) {
    case 'vision': {
      // 找前排空座或可互换的学生
      const frontRowThreshold = Math.ceil(seatConfig.rows / 3);
      const frontSeats = currentPlan.assignments.filter(a => 
        a.row < frontRowThreshold && !a.disabled
      );
      
      // 优先空座
      const emptyFront = frontSeats.find(a => !a.studentId);
      if (emptyFront) {
        return {
          suggestion: `建议将座位调整到${emptyFront.seatNumber}号（前排空座）`,
          newSeatIndex: emptyFront.seatIndex,
          confidence: 95,
          reason: '前排有空座位，可直接调整'
        };
      }
      
      // 找前排学生互换（优先选成绩相近的）
      const avgScore = studentProfile?.avgScore;
      let bestSwap = null;
      let bestScore = Infinity;
      
      for (const frontSeat of frontSeats) {
        if (!frontSeat.studentId) continue;
        const frontProfile = profiles.get(frontSeat.studentId);
        if (!frontProfile) continue;
        
        // 不选固定座位的学生
        if (frontProfile.pinned) continue;
        
        // 不选也有视力问题的
        if (frontProfile.specialNeeds?.vision) continue;
        
        // 选成绩最接近的
        if (avgScore !== null && frontProfile.avgScore !== null) {
          const diff = Math.abs(avgScore - frontProfile.avgScore);
          if (diff < bestScore) {
            bestScore = diff;
            bestSwap = frontSeat;
          }
        }
      }
      
      if (bestSwap) {
        return {
          suggestion: `建议与${getStudentName(bestSwap.studentId)}互换座位`,
          swapWithId: bestSwap.studentId,
          newSeatIndex: bestSwap.seatIndex,
          confidence: 80,
          reason: '前排同学成绩相近，互换影响最小'
        };
      }
      
      return null; // 无法自动解决
    }
    
    case 'noise': {
      // 检查邻座性格
      const neighbors = getNeighborSeats(studentSeat, currentPlan.assignments);
      const noisyNeighbors = neighbors.filter(n => {
        const p = profiles.get(n.studentId!);
        return p?.socialType === 'cooperative' || p?.personality === '外向';
      });
      
      if (noisyNeighbors.length === 0) return null; // 邻座没问题，需人工判断
      
      // 找安静的学生互换
      const quietStudents = currentPlan.assignments.filter(a => {
        if (!a.studentId || a.studentId === appeal.studentId) return false;
        const p = profiles.get(a.studentId);
        return p?.socialType === 'independent' || p?.personality === '内向';
      });
      
      // 找与学生本人社交类型最匹配的
      const targetSocialType = studentProfile?.socialType === 'independent' ? 'independent' : 'mixed';
      const bestMatch = quietStudents.find(a => {
        const p = profiles.get(a.studentId!);
        return p?.socialType === targetSocialType;
      });
      
      if (bestMatch) {
        return {
          suggestion: `建议与${getStudentName(bestMatch.studentId)}互换座位`,
          swapWithId: bestMatch.studentId,
          newSeatIndex: bestMatch.seatIndex,
          confidence: 70,
          reason: '该同学社交类型与你更匹配，学习环境更安静'
        };
      }
      return null;
    }
    
    case 'social': {
      if (!appeal.desiredNeighborId) return null;
      
      // 检查对方是否也想和申诉者坐近
      const otherAppeals = await getAppealsByStudent(appeal.desiredNeighborId);
      const mutual = otherAppeals.some(a => 
        a.desiredNeighborId === appeal.studentId && a.status !== 'withdrawn'
      );
      
      if (mutual) {
        // 双方互愿 → 高置信度建议
        return {
          suggestion: `${getStudentName(appeal.desiredNeighborId)}也希望和你坐近，建议互换`,
          swapWithId: appeal.desiredNeighborId,
          confidence: 90,
          reason: '双方互愿，建议安排相邻座位'
        };
      }
      
      // 检查是否违反黑名单
      const inBlacklist = isBlacklisted(appeal.studentId, appeal.desiredNeighborId, constraints.blacklist);
      if (inBlacklist) {
        return {
          suggestion: '根据班级规则，无法满足此请求',
          confidence: 0,
          reason: '该组合在班级黑名单中'
        };
      }
      
      // 单方意愿 → 中置信度
      return {
        suggestion: `可以尝试将你和${getStudentName(appeal.desiredNeighborId)}安排在相邻座位`,
        swapWithId: appeal.desiredNeighborId,
        confidence: 50,
        reason: '对方暂未提交相同意愿，建议教师确认'
      };
    }
    
    case 'conflict':
      // 不自动处理人际矛盾
      return null;
    
    case 'other':
      return null;
  }
}
```

#### GET /api/appeals/:classId

**权限：** 本班教师

**查询参数：** `?status=pending&type=social&page=1&pageSize=20`

#### PUT /api/appeals/:id/resolve

**权限：** 本班教师

**请求体：** 见 §1.6 ResolveAppealRequest

**逻辑：**
1. 如 action=approved 且有 swapWithId → 执行座位互换
2. 如 action=approved 且有 newSeatIndex → 执行座位移动
3. 更新 appeal.teacherResolution
4. 更新 appeal.status 为 teacher_resolved 或 rejected
5. 给学生发送通知（含教师批注）
6. 如执行了座位变更，给相关学生也发送通知

### 3.9 通知 API

#### GET /api/notifications

**权限：** 已登录

**查询参数：** `?unread=true&page=1&pageSize=20`

#### PUT /api/notifications/:id/read

#### PUT /api/notifications/read-all

#### GET /api/notifications/unread-count

**响应：** `{ "code": 0, "data": { "count": 5 } }`

---

## 4. 前端核心组件规格

### 4.1 SeatCell.vue

**Props：**
```typescript
interface SeatCellProps {
  seat: SeatAssignment;
  student: StudentProfile | null;
  isHighlighted: boolean;
  isSelected: boolean;
  isTarget: boolean;            // 拖拽/点击目标高亮
  heatmapColor: string | null;  // 热力图颜色
  fontSize: number;
  lunchUnderlineColor: string;
  showGender: boolean;
  enableDrag: boolean;
  enableClick: boolean;
}
```

**Events：**
```typescript
interface SeatCellEmits {
  (e: 'click', seat: SeatAssignment): void;
  (e: 'contextmenu', seat: SeatAssignment, event: MouseEvent): void;
  (e: 'dragstart', seat: SeatAssignment): void;
  (e: 'dragend'): void;
  (e: 'drop', source: SeatAssignment): void;
  (e: 'longpress', seat: SeatAssignment): void;
}
```

**渲染逻辑：**
```
if seat.disabled → 渲染灰色禁用态
else if seat.student → 渲染学生信息
  - 性别边框色: male=#007AFF, female=#FF2D55
  - 固定标记: 📌 右上角
  - 午休下划线: 文字下方装饰线
  - 无成绩: 斜线纹理背景
  - 热力图: 半透明覆盖层
else → 渲染空座位（座位号）
```

### 4.2 QuizContainer.vue

**Props：**
```typescript
interface QuizContainerProps {
  questions: QuizQuestion[];
  initialAnswers?: Record<string, unknown>;
  classId: string;
}
```

**Events：**
```typescript
interface QuizContainerEmits {
  (e: 'submit', answers: Record<string, unknown>): void;
  (e: 'progress', answered: number, total: number): void;
  (e: 'save', answers: Record<string, unknown>): void;  // 自动保存
}
```

**内部状态：**
```typescript
const currentIndex = ref(0);
const answers = ref<Record<string, unknown>>({});
const questionStartTime = ref<number>(Date.now());
const suspiciousQuestions = ref<string[]>([]);  // 答题过快的题目

// 自动保存：每次 answer 变化后 debounce 3秒 保存到 localStorage
watch(answers, debounce(() => {
  localStorage.setItem(`quiz_${props.classId}`, JSON.stringify(answers.value));
  emit('save', answers.value);
}, 3000), { deep: true });
```

**题目类型渲染映射：**
```typescript
const componentMap: Record<QuestionType, Component> = {
  single_choice: QuestionSingle,
  multiple_choice: QuestionMultiple,
  likert: QuestionLikert,
  tag_select: QuestionTagSelect,
  search_select: QuestionSearch,
  slider: QuestionSlider,
  text: QuestionText,
};
```

### 4.3 SeatingEditor.vue（核心页面）

**布局：**
```
┌─────────┬──────────────────────────────────────────────┐
│ Sidebar │ Toolbar                                      │
│ (260px) ├──────────────────────────────────────────────┤
│         │ ClassroomGrid                                 │
│ 搜索     │ (flex-grow, 居中)                             │
│ 学生池   │                                              │
│ 名单    │                                              │
│ 约束    │                                              │
│         ├──────────────────────────────────────────────┤
│         │ BottomActions                                 │
└─────────┴──────────────────────────────────────────────┘
```

**Store 依赖：**
```typescript
const authStore = useAuthStore();
const classroomStore = useClassroomStore();
const seatingStore = useSeatingStore();
const studentStore = useStudentStore();
```

**核心状态（seatingStore）：**
```typescript
interface SeatingState {
  // 当前方案
  currentPlan: SeatPlan | null;
  candidatePlans: SeatPlan[];       // 生成的候选方案
  selectedPlanIndex: number;
  
  // 教室配置
  seatConfig: SeatConfig;
  seats: SeatAssignment[];          // 当前渲染的座位数组
  platformLeft: SeatAssignment;
  platformRight: SeatAssignment;
  drawOrder: SeatAssignment[];      // 抽取顺序
  currentDrawIndex: number;
  
  // 学生
  students: StudentProfile[];
  drawnStudents: StudentProfile[];
  remainingStudents: StudentProfile[];
  
  // 约束
  blacklist: string[][];
  whitelist: string[][];
  constraints: SeatConstraints;
  
  // UI 状态
  selectedSeat: SeatAssignment | null;
  swapMode: boolean;
  batchMode: boolean;
  batchSeats: SeatAssignment[];
  heatmapVisible: boolean;
  heatmapType: 'composite' | 'average' | 'subject' | 'personality' | 'profile_completeness';
  poolFilter: string;
  poolSearch: string;
  selectedPoolStudent: string | null;
  
  // 评价
  weights: EvalWeights;
  
  // 历史
  undoStack: UndoAction[];
  redoStack: UndoAction[];
  operationLogs: LogEntry[];
}
```

### 4.4 AppealForm.vue（学生端）

**Props：**
```typescript
interface AppealFormProps {
  classId: string;
  currentPlanId: string;
  classmates: { id: string; name: string }[];  // 用于搜索选择
  currentSeatNumber: number;
}
```

**表单字段：**
| 字段 | 类型 | 校验 | 条件显示 |
|------|------|------|----------|
| type | 单选（5选项） | 必填 | 始终 |
| description | textarea | 50-500字，必填 | 始终 |
| desiredNeighborId | 搜索选择 | 最多3人 | type=social |
| avoidNeighborId | 搜索选择 | 最多3人 | type=social |
| reasonDetail | text | 必填 | type=vision 或 type=noise |
| attachments | 文件上传 | 最多3张，每张<2MB | type=vision（可选上传医院证明） |

### 4.5 ProfileReport.vue（学生端测评报告）

**Props：**
```typescript
interface ProfileReportProps {
  profile: StudentProfile;
  isOwnReport: boolean;  // true=学生看自己的，false=教师看学生的
}
```

**显示内容（isOwnReport=true 时）：**
```
- MBTI 类型 + 四维度进度条
- 学习风格标签
- 社交类型标签
- 兴趣标签云
- 自评三维雷达图
- 画像完整度进度条
- "修改测评"按钮

不显示：成绩、综合评分、教师备注、黑白名单
```

**显示内容（isOwnReport=false 时，教师视角）：**
```
以上全部 +
- 各科成绩柱状图
- 综合评分
- 各维度权重分解
- 教师备注编辑框
- "标记为固定座位"开关
```

---

## 5. Pinia Store 规格

### 5.1 useAuthStore

```typescript
interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
}

// Getters
const isLoggedIn: boolean;
const isTeacher: boolean;
const isStudent: boolean;

// Actions
async function login(req: LoginRequest): Promise<void>;
async function register(req: RegisterRequest): Promise<void>;
async function oauthLogin(req: OAuthLoginRequest): Promise<void>;
async function refreshToken(): Promise<void>;
function logout(): void;
async function fetchCurrentUser(): Promise<void>;
```

### 5.2 useClassroomStore

```typescript
interface ClassroomState {
  classrooms: Classroom[];
  currentClassroom: Classroom | null;
  isLoading: boolean;
}

// Actions
async function fetchClassrooms(): Promise<void>;
async function createClassroom(req: CreateClassroomRequest): Promise<Classroom>;
async function joinClassroom(req: JoinClassroomRequest): Promise<void>;
async function generateInviteCode(classId: string): Promise<{ code: string; link: string }>;
async function fetchStudents(classId: string, params?: { search?: string; filter?: string }): Promise<StudentProfile[]>;
async function importScores(classId: string, file: File): Promise<ImportResult>;
```

### 5.3 useSeatingStore

```typescript
// Actions
async function generatePlans(req: GeneratePlanRequest): Promise<SeatPlan[]>;
async function selectPlan(index: number): void;
async function publishPlan(planId: string, notify: boolean): Promise<void>;
async function withdrawPlan(planId: string): Promise<void>;
async function swapSeats(planId: string, indexA: number, indexB: number): Promise<void>;

// 本地操作（不立即同步服务器）
function drawNext(): StudentProfile | null;
function startAutoDraw(interval: number): void;
function stopAutoDraw(): void;
function resetDraw(): void;
function undo(): void;
function redo(): void;
function toggleHeatmap(type: string): void;
function toggleBatchMode(): void;
function clearSeat(seatIndex: number): void;
function disableSeat(seatIndex: number): void;
function enableSeat(seatIndex: number): void;
function toggleLunch(seatIndex: number): void;
function togglePin(seatIndex: number): void;
```

### 5.4 useQuizStore

```typescript
interface QuizState {
  questions: QuizQuestion[];
  session: QuizSession | null;
  answers: Record<string, unknown>;
  currentIndex: number;
  isLoading: boolean;
}

// Actions
async function fetchQuestions(classId: string): Promise<void>;
async function submitQuiz(classId: string): Promise<StudentProfile>;
async function fetchProgress(classId: string): Promise<QuizProgressItem[]>;
function saveProgress(): void;  // 保存到 localStorage
function loadProgress(classId: string): void;  // 从 localStorage 恢复
function clearProgress(classId: string): void;
```

### 5.5 useAppealStore

```typescript
interface AppealState {
  appeals: Appeal[];
  myAppeals: Appeal[];
  isLoading: boolean;
}

// Actions
async function createAppeal(req: CreateAppealRequest): Promise<Appeal>;
async function fetchAppeals(classId: string, params?: { status?: AppealStatus }): Promise<void>;
async function fetchMyAppeals(): Promise<void>;
async function resolveAppeal(appealId: string, req: ResolveAppealRequest): Promise<void>;
async function withdrawAppeal(appealId: string): Promise<void>;
```

### 5.6 useNotificationStore

```typescript
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

// Actions
async function fetchNotifications(params?: { unread?: boolean }): Promise<void>;
async function fetchUnreadCount(): Promise<void>;
async function markAsRead(id: string): Promise<void>;
async function markAllAsRead(): Promise<void>;

// WebSocket 监听新通知
function startListening(): void;
function stopListening(): void;
```

---

## 6. 测评题库完整数据

### 6.1 题库数据结构

```typescript
// src/features/quiz/data/questionBank.ts

export const QUESTION_BANK: QuizQuestion[] = [
  // ===== MBTI 维度 (16题) =====
  {
    id: 'mbti-1',
    dimension: 'mbti',
    type: 'single_choice',
    question: '在一个班级活动中，你更倾向于：',
    description: null,
    options: [
      { id: 'mbti-1-a', text: '主动组织和带领大家做游戏', value: 'E', weight: { 'E_I': 2 } },
      { id: 'mbti-1-b', text: '和熟悉的朋友一起参与', value: 'E', weight: { 'E_I': 1 } },
      { id: 'mbti-1-c', text: '在旁边观察，有人邀请才加入', value: 'I', weight: { 'E_I': 1 } },
      { id: 'mbti-1-d', text: '更喜欢自己安静地做别的事', value: 'I', weight: { 'E_I': 2 } },
    ],
    tags: null, min: null, max: null, required: true, order: 1,
  },
  {
    id: 'mbti-2',
    dimension: 'mbti',
    type: 'single_choice',
    question: '学习新知识时，你更喜欢：',
    description: null,
    options: [
      { id: 'mbti-2-a', text: '先看具体的例子和步骤', value: 'S', weight: { 'S_N': 2 } },
      { id: 'mbti-2-b', text: '先了解大致框架再看细节', value: 'S', weight: { 'S_N': 1 } },
      { id: 'mbti-2-c', text: '先思考背后的原理和规律', value: 'N', weight: { 'S_N': 1 } },
      { id: 'mbti-2-d', text: '跳过基础，直接探索更深层的联系', value: 'N', weight: { 'S_N': 2 } },
    ],
    tags: null, min: null, max: null, required: true, order: 2,
  },
  {
    id: 'mbti-3',
    dimension: 'mbti',
    type: 'single_choice',
    question: '当同学之间发生矛盾时，你通常会：',
    description: null,
    options: [
      { id: 'mbti-3-a', text: '分析谁对谁错，按道理判断', value: 'T', weight: { 'T_F': 2 } },
      { id: 'mbti-3-b', text: '先了解事情经过再做判断', value: 'T', weight: { 'T_F': 1 } },
      { id: 'mbti-3-c', text: '先照顾双方的情绪', value: 'F', weight: { 'T_F': 1 } },
      { id: 'mbti-3-d', text: '努力调解，希望大家都开心', value: 'F', weight: { 'T_F': 2 } },
    ],
    tags: null, min: null, max: null, required: true, order: 3,
  },
  {
    id: 'mbti-4',
    dimension: 'mbti',
    type: 'single_choice',
    question: '做作业时，你通常：',
    description: null,
    options: [
      { id: 'mbti-4-a', text: '按计划完成，绝不拖延', value: 'J', weight: { 'J_P': 2 } },
      { id: 'mbti-4-b', text: '有计划但偶尔会调整', value: 'J', weight: { 'J_P': 1 } },
      { id: 'mbti-4-c', text: '看心情和状态决定先做哪个', value: 'P', weight: { 'J_P': 1 } },
      { id: 'mbti-4-d', text: '经常在截止前才开始做', value: 'P', weight: { 'J_P': 2 } },
    ],
    tags: null, min: null, max: null, required: true, order: 4,
  },
  // ... mbti-5 到 mbti-16 类似结构，覆盖 E/I, S/N, T/F, J/P 各4题

  // ===== 学习风格 (8题) =====
  {
    id: 'ls-1',
    dimension: 'learning_style',
    type: 'likert',
    question: '我通过看图表/思维导图学习效果最好',
    description: '1=非常不同意，5=非常同意',
    options: null, tags: null, min: 1, max: 5, required: true, order: 17,
  },
  // ... ls-2 到 ls-8

  // ===== 社交偏好 (5题) =====
  {
    id: 'sp-1',
    dimension: 'social',
    type: 'single_choice',
    question: '课间休息时，你通常会：',
    description: null,
    options: [
      { id: 'sp-1-a', text: '和一大群同学聊天打闹', value: 'very_social', weight: { social: 3 } },
      { id: 'sp-1-b', text: '和两三个好朋友聊天', value: 'moderate', weight: { social: 2 } },
      { id: 'sp-1-c', text: '自己看书或做自己的事', value: 'introvert', weight: { social: 0 } },
      { id: 'sp-1-d', text: '在教室里走动，和不同人打招呼', value: 'social_butterfly', weight: { social: 3 } },
    ],
    tags: null, min: null, max: null, required: true, order: 25,
  },
  // ... sp-2 到 sp-5

  // ===== 兴趣标签 (1题) =====
  {
    id: 'interest-1',
    dimension: 'interest',
    type: 'tag_select',
    question: '选择你感兴趣的标签（不限数量）：',
    description: null,
    options: null,
    tags: [
      '篮球', '足球', '排球', '羽毛球', '乒乓球', '游泳', '跑步', '健身',
      '绘画', '书法', '摄影', '手工', '舞蹈', '戏剧', '声乐', '乐器',
      '编程', '机器人', '3D打印', '天文', '航模', '科学实验',
      '阅读', '写作', '诗歌', '辩论', '演讲',
      '流行音乐', '古典音乐', '说唱', '摇滚', '民谣',
      '桌游', '棋类', '旅行', '美食', '动漫', '游戏',
    ],
    min: null, max: null, required: false, order: 30,
  },

  // ===== 特殊需求 (1题) =====
  {
    id: 'sn-1',
    dimension: 'special_needs',
    type: 'text',
    question: '请填写你的特殊需求（如视力、听力、身体条件等，没有则留空）：',
    description: '此信息仅班主任可见，用于安排合适的座位',
    options: null, tags: null, min: null, max: null, required: false, order: 31,
  },

  // ===== 社交关系 (1题) =====
  {
    id: 'sr-1',
    dimension: 'social_relation',
    type: 'search_select',
    question: '你最想和谁坐在一起？（可选 1-3 人，可不填）',
    description: '搜索班级同学姓名，对方不会知道你的选择',
    options: null, tags: null, min: null, max: null, required: false, order: 32,
  },

  // ===== 自我评价 (3题) =====
  {
    id: 'sa-1',
    dimension: 'self_assessment',
    type: 'slider',
    question: '你觉得自己目前的学习成绩在班级中处于：',
    description: '0=最差，100=最好（自我估计即可）',
    options: null, tags: null, min: 0, max: 100, required: true, order: 33,
  },
  // ... sa-2 (学习动力), sa-3 (社交能力)
];
```

### 6.2 MBTI 计算逻辑

```typescript
function calculateMbti(answers: Record<string, unknown>): MbtiResult {
  const dimensions = { E_I: 0, S_N: 0, T_F: 0, J_P: 0 };
  
  for (const [questionId, answer] of Object.entries(answers)) {
    const question = QUESTION_BANK.find(q => q.id === questionId);
    if (!question || question.dimension !== 'mbti') continue;
    if (question.type !== 'single_choice') continue;
    
    const option = question.options?.find(o => o.id === answer);
    if (!option) continue;
    
    for (const [dim, weight] of Object.entries(option.weight)) {
      dimensions[dim as keyof typeof dimensions] += weight;
    }
  }
  
  const type = [
    dimensions.E_I >= 0 ? 'E' : 'I',
    dimensions.S_N >= 0 ? 'S' : 'N',
    dimensions.T_F >= 0 ? 'T' : 'F',
    dimensions.J_P >= 0 ? 'J' : 'P',
  ].join('');
  
  return {
    type,
    E_I: dimensions.E_I,   // 正=E, 负=I
    S_N: dimensions.S_N,   // 正=S, 负=N
    T_F: dimensions.T_F,   // 正=T, 负=F
    J_P: dimensions.J_P,   // 正=J, 负=P
  };
}
```

---

## 7. 路由配置

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  // Auth
  { path: '/auth', component: () => import('@/views/auth/LoginView.vue'), meta: { guest: true } },
  { path: '/auth/register', component: () => import('@/views/auth/RegisterView.vue'), meta: { guest: true } },
  { path: '/auth/oauth/callback', component: () => import('@/views/auth/OAuthCallback.vue'), meta: { guest: true } },

  // Teacher
  {
    path: '/teacher',
    component: () => import('@/components/layout/TeacherLayout.vue'),
    meta: { requiresAuth: true, role: 'teacher' },
    children: [
      { path: '', redirect: '/teacher/classes' },
      { path: 'classes', component: () => import('@/views/teacher/ClassListView.vue') },
      { path: 'classes/create', component: () => import('@/views/teacher/CreateClassView.vue') },
      { path: 'classes/:id', component: () => import('@/views/teacher/ClassDashboard.vue') },
      { path: 'classes/:id/seating', component: () => import('@/views/teacher/SeatingEditor.vue') },
      { path: 'classes/:id/students', component: () => import('@/views/teacher/StudentManager.vue') },
      { path: 'classes/:id/quiz-progress', component: () => import('@/views/teacher/QuizProgress.vue') },
      { path: 'classes/:id/appeals', component: () => import('@/views/teacher/AppealManager.vue') },
      { path: 'classes/:id/history', component: () => import('@/views/teacher/SeatHistory.vue') },
      { path: 'classes/:id/settings', component: () => import('@/views/teacher/ClassSettings.vue') },
    ],
  },

  // Student
  {
    path: '/',
    component: () => import('@/components/layout/StudentLayout.vue'),
    meta: { requiresAuth: true, role: 'student' },
    children: [
      { path: '', component: () => import('@/views/student/HomeView.vue') },
      { path: 'quiz', component: () => import('@/views/student/QuizView.vue') },
      { path: 'quiz/report', component: () => import('@/views/student/QuizReportView.vue') },
      { path: 'seat', component: () => import('@/views/student/MySeatView.vue') },
      { path: 'appeal/new', component: () => import('@/views/student/AppealFormView.vue') },
      { path: 'appeals', component: () => import('@/views/student/AppealHistoryView.vue') },
      { path: 'settings', component: () => import('@/views/student/SettingsView.vue') },
    ],
  },

  // Notifications (both roles)
  { path: '/notifications', component: () => import('@/views/NotificationView.vue'), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next('/auth');
  }
  
  if (to.meta.guest && auth.isLoggedIn) {
    return next(auth.isTeacher ? '/teacher' : '/');
  }
  
  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return next(auth.isTeacher ? '/teacher' : '/');
  }
  
  next();
});

export default router;
```

---

## 8. 环境变量

```env
# .env.example

# Frontend
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/ws
VITE_WECHAT_APPID=wx_xxxxxxxx
VITE_QQ_APPID=xxxxxxxx

# Backend
DATABASE_URL=mysql://root:password@localhost:3306/seatwise
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# OAuth
WECHAT_APP_SECRET=xxxxxxxx
QQ_APP_SECRET=xxxxxxxx

# SMS (阿里云)
SMS_ACCESS_KEY=xxxxxxxx
SMS_ACCESS_SECRET=xxxxxxxx
SMS_SIGN_NAME=智座
SMS_TEMPLATE_CODE=SMS_000000

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=noreply@seatwise.app
SMTP_PASS=xxxxxxxx

# File Storage
OSS_ENDPOINT=oss-cn-hangzhou.aliyuncs.com
OSS_ACCESS_KEY=xxxxxxxx
OSS_ACCESS_SECRET=xxxxxxxx
OSS_BUCKET=seatwise
```

---

## 9. 开发任务拆分（按依赖顺序）

### Phase 1：基础骨架（第 1-2 周）

```
T1.1  初始化 monorepo (pnpm workspace)
T1.2  配置 Vite + Vue3 + TypeScript + Tailwind + Pinia
T1.3  实现 Prisma schema + 数据库迁移
T1.4  实现后端 Express 骨架 + 中间件 (auth, rbac, validator, errorHandler)
T1.5  实现 User 模型 + 注册/登录 API (手机/邮箱)
T1.6  实现 JWT 认证 (access + refresh token)
T1.7  实现前端 authStore + 登录/注册页面
T1.8  实现前端路由 + 导航守卫
T1.9  实现 TeacherLayout + StudentLayout
T1.10 实现 Classroom 模型 + 创建班级/邀请码 API
T1.11 实现 ClassListView + CreateClassView
T1.12 实现 ClassDashboard (班级概览页)
```

### Phase 2：测评系统（第 3-4 周）

```
T2.1  完整定义 QUESTION_BANK (35题)
T2.2  实现 GET /api/quiz/questions/:classId
T2.3  实现前端 QuizContainer + 所有 Question 组件 (6种题型)
T2.4  实现答题进度保存 (localStorage + debounce)
T2.5  实现 MBTI 计算逻辑
T2.6  实现学习风格/社交类型计算逻辑
T2.7  实现 POST /api/quiz/submit (完整处理流程)
T2.8  实现 StudentProfile 模型 + 画像生成
T2.9  实现 compositeScore 计算
T2.10 实现 ProfileReport 组件 (学生端 + 教师端两种视图)
T2.11 实现 QuizProgress 页面 (教师查看测评进度)
T2.12 实现防随意填写检测
```

### Phase 3：排座引擎（第 5-7 周）

```
T3.1  实现 ClassroomGrid + SeatCell 组件 (渲染/交互/样式)
T3.2  实现座位配置面板 (行列/讲台/门/编号)
T3.3  实现概率计算引擎 (probabilityEngine.ts)
T3.4  实现黑白名单约束引擎 (constraintEngine.ts)
T3.5  实现特殊需求处理逻辑
T3.6  实现社交偏好处理逻辑
T3.7  实现 POST /api/seating/generate (多方案生成)
T3.8  实现 PlanComparison 组件 (方案对比面板)
T3.9  实现手动抽取 + 自动抽取
T3.10 实现拖拽互换 + 右键菜单
T3.11 实现撤销/重做
T3.12 实现发布/撤回
T3.13 实现热力图
T3.14 实现蒙特卡洛模拟 (Web Worker)
```

### Phase 4：协同功能（第 8-9 周）

```
T4.1  实现 Appeal 模型 + POST /api/appeals
T4.2  实现申诉自动分析引擎
T4.3  实现 AppealForm 组件 (学生端)
T4.4  实现 AppealManager 页面 (教师端)
T4.5  实现冲突检测逻辑
T4.6  实现 Notification 模型 + 通知 API
T4.7  实现通知推送 (WebSocket)
T4.8  实现前端通知铃铛 + 通知列表
T4.9  实现学生端 MySeatView
T4.10 实现学生端 HomeView (首页卡片)
```

### Phase 5：数据导出 + 打磨（第 10-11 周）

```
T5.1  实现 Excel 导出 (基础/完整)
T5.2  实现截图导出 (html2canvas)
T5.3  实现 PDF 导出 (学生画像报告)
T5.4  实现家长会视图 (A4 打印)
T5.5  实现高级 JSON 导入导出
T5.6  移动端适配 (学生端响应式)
T5.7  深色模式
T5.8  性能优化 (虚拟滚动、懒加载)
T5.9  无障碍 (ARIA 标签、键盘导航)
T5.10 错误处理 + 边界情况补全
```

### Phase 6：第三方登录 + 运营（第 12 周）

```
T6.1  实现微信 OAuth 登录
T6.2  实现 QQ OAuth 登录
T6.3  实现短信验证码
T6.4  实现邮件验证
T6.5  用户文档 + 教师培训材料
```

---

*文档结束。AI 编码助手可直接按此规格逐模块实现。*
