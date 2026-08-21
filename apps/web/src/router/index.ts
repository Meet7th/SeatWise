import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/auth/register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { guest: true },
    },
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
      ],
    },
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
      ],
    },
  ],
});

router.beforeEach((to, _from, next) => {
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
