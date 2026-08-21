import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create teacher
  const teacherPasswordHash = await bcrypt.hash('Teacher123', 10);
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@seatwise.com' },
    update: {},
    create: {
      name: '张老师',
      email: 'teacher@seatwise.com',
      phone: '13800138000',
      passwordHash: teacherPasswordHash,
      role: 'teacher',
      status: 'active',
    },
  });
  console.log('✅ Teacher created:', teacher.name);

  // Create classroom
  const classroom = await prisma.classroom.upsert({
    where: { inviteCode: 'TEST01' },
    update: {},
    create: {
      name: '高一(3)班',
      grade: '高一',
      semester: '2026春季',
      homeroomTeacherId: teacher.id,
      inviteCode: 'TEST01',
      seatConfig: {
        rows: 7,
        cols: 11,
        platformLeft: true,
        platformRight: true,
        doors: 'right',
        numberingMode: 'horizontal-snake',
        showDoors: true,
      },
      status: 'quiz_open',
    },
  });
  console.log('✅ Classroom created:', classroom.name);

  // Create students
  const studentNames = [
    { name: '李明', gender: 'male' as const },
    { name: '王芳', gender: 'female' as const },
    { name: '张伟', gender: 'male' as const },
    { name: '刘洋', gender: 'male' as const },
    { name: '陈静', gender: 'female' as const },
    { name: '杨磊', gender: 'male' as const },
    { name: '赵敏', gender: 'female' as const },
    { name: '黄涛', gender: 'male' as const },
    { name: '周婷', gender: 'female' as const },
    { name: '吴强', gender: 'male' as const },
    { name: '郑丽', gender: 'female' as const },
    { name: '孙鹏', gender: 'male' as const },
    { name: '马雪', gender: 'female' as const },
    { name: '朱杰', gender: 'male' as const },
    { name: '胡敏', gender: 'female' as const },
    { name: '林峰', gender: 'male' as const },
    { name: '何芳', gender: 'female' as const },
    { name: '罗伟', gender: 'male' as const },
    { name: '梁静', gender: 'female' as const },
    { name: '宋阳', gender: 'male' as const },
    { name: '唐丽', gender: 'female' as const },
    { name: '韩磊', gender: 'male' as const },
    { name: '冯雪', gender: 'female' as const },
    { name: '董强', gender: 'male' as const },
    { name: '程婷', gender: 'female' as const },
  ];

  const studentPasswordHash = await bcrypt.hash('Student123', 10);

  for (let i = 0; i < studentNames.length; i++) {
    const { name, gender } = studentNames[i];
    const studentId = `202600${String(i + 1).padStart(2, '0')}`;

    const student = await prisma.user.upsert({
      where: { studentNumber: studentId },
      update: {},
      create: {
        name,
        studentNumber: studentId,
        passwordHash: studentPasswordHash,
        role: 'student',
        status: 'active',
      },
    });

    // Add to classroom
    await prisma.classStudent.upsert({
      where: { classId_studentId: { classId: classroom.id, studentId: student.id } },
      update: {},
      create: {
        classId: classroom.id,
        studentId: student.id,
      },
    });

    // Create profile for some students
    if (i < 15) {
      const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
      const learningStyles = ['visual', 'auditory', 'kinesthetic', 'read_write', 'mixed'];
      const socialTypes = ['independent', 'cooperative', 'mixed'];

      await prisma.studentProfile.upsert({
        where: { studentId: student.id },
        update: {},
        create: {
          studentId: student.id,
          classId: classroom.id,
          gender,
          mbti: {
            type: mbtiTypes[i % mbtiTypes.length],
            E_I: Math.random() * 100,
            S_N: Math.random() * 100,
            T_F: Math.random() * 100,
            J_P: Math.random() * 100,
          },
          learningStyle: learningStyles[i % learningStyles.length],
          socialType: socialTypes[i % socialTypes.length],
          interests: ['数学', '物理', '编程'].slice(0, (i % 3) + 1),
          specialNeeds: {},
          socialPreferences: { wantNear: [], avoidNear: [] },
          selfAssessment: {
            academicLevel: 50 + Math.floor(Math.random() * 40),
            motivation: 50 + Math.floor(Math.random() * 40),
            socialAbility: 50 + Math.floor(Math.random() * 40),
          },
          scores: {},
          compositeScore: 60 + Math.floor(Math.random() * 30),
          avgScore: 70 + Math.floor(Math.random() * 25),
          profileCompleteness: 60 + Math.floor(Math.random() * 35),
        },
      });
    }
  }
  console.log(`✅ ${studentNames.length} students created`);

  // Create quiz sessions for some students
  const students = await prisma.classStudent.findMany({
    where: { classId: classroom.id },
    include: { student: true },
  });

  for (let i = 0; i < Math.min(10, students.length); i++) {
    await prisma.quizSession.upsert({
      where: { studentId_classId: { studentId: students[i].studentId, classId: classroom.id } },
      update: {},
      create: {
        studentId: students[i].studentId,
        classId: classroom.id,
        status: i < 5 ? 'completed' : 'in_progress',
        startedAt: new Date(),
        completedAt: i < 5 ? new Date() : null,
      },
    });
  }
  console.log('✅ Quiz sessions created');

  // Create notification
  await prisma.notification.create({
    data: {
      type: 'system',
      title: '欢迎使用智座',
      body: '智座 AI 智能排座系统已上线，快来完成性格测评吧！',
      recipientId: teacher.id,
      classId: classroom.id,
      channels: ['in_app'],
    },
  });
  console.log('✅ Notifications created');

  console.log('\n🎉 Seed completed!');
  console.log('\n📋 Test Accounts:');
  console.log('  Teacher: teacher@seatwise.com / Teacher123');
  console.log('  Student: 2026001 (学号) / Student123');
  console.log('  Classroom invite code: TEST01');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });