import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// 导入路由
import authRoutes from '../src/routes/auth';
import oauthRoutes from '../src/routes/oauth';
import classroomRoutes from '../src/routes/classroom';
import quizRoutes from '../src/routes/quiz';
import seatingRoutes from '../src/routes/seating';
import appealRoutes from '../src/routes/appeal';
import notificationRoutes from '../src/routes/notification';
import { errorHandler } from '../src/middleware/errorHandler';

const app = express();

// 中间件
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '4mb' }));

// 路由
app.use('/auth', authRoutes);
app.use('/auth', oauthRoutes);
app.use('/classrooms', classroomRoutes);
app.use('/quiz', quizRoutes);
app.use('/seating', seatingRoutes);
app.use('/appeals', appealRoutes);
app.use('/notifications', notificationRoutes);

app.get('/health', (_req, res) => {
  res.json({ code: 0, data: { status: 'ok', timestamp: new Date().toISOString() }, message: 'ok' });
});

app.use(errorHandler);

// Vercel Serverless Function 入口
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 去掉 /api 前缀，让 Express 路由正确匹配
  if (req.url?.startsWith('/api')) {
    req.url = req.url.substring(4) || '/';
  }

  return app(req as any, res as any);
}
