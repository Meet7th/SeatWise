import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiLimiter } from '@/middleware/rateLimit';
import { errorHandler } from '@/middleware/errorHandler';
import authRoutes from '@/routes/auth';
import oauthRoutes from '@/routes/oauth';
import classroomRoutes from '@/routes/classroom';
import quizRoutes from '@/routes/quiz';
import seatingRoutes from '@/routes/seating';
import appealRoutes from '@/routes/appeal';
import notificationRoutes from '@/routes/notification';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/seating', seatingRoutes);
app.use('/api/appeals', appealRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ code: 0, data: { status: 'ok', timestamp: new Date().toISOString() }, message: 'ok' });
});

app.use(errorHandler);

export default app;
