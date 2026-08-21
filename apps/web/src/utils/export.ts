import type { SeatAssignment, StudentProfile, SeatPlan, Classroom } from '@seatwise/shared';

/**
 * Export seat plan to basic Excel (CSV format)
 */
export function exportToBasicExcel(plan: SeatPlan, students: StudentProfile[], classroom: Classroom) {
  const headers = ['座位号', '排', '列', '学生姓名', '学号', '性别', '均分'];
  const rows = plan.assignments
    .filter(a => a.studentId)
    .map(a => {
      const student = students.find(s => s.studentId === a.studentId);
      return [
        a.seatNumber,
        a.row + 1,
        a.col + 1,
        student?.name || '',
        student?.studentId || '',
        student?.gender === 'male' ? '男' : '女',
        student?.avgScore?.toString() || '',
      ];
    });

  downloadCSV([headers, ...rows], `${classroom.name}-座位表-基础.csv`);
}

/**
 * Export seat plan to full Excel with all profile data
 */
export function exportToFullExcel(plan: SeatPlan, students: StudentProfile[], classroom: Classroom) {
  const headers = [
    '座位号', '排', '列', '学生姓名', '学号', '性别',
    'MBTI', '学习风格', '社交类型', '均分', '综合评分',
    '完整度', '兴趣标签', '固定座位',
  ];

  const rows = plan.assignments
    .filter(a => a.studentId)
    .map(a => {
      const student = students.find(s => s.studentId === a.studentId);
      if (!student) return [];
      return [
        a.seatNumber,
        a.row + 1,
        a.col + 1,
        student.name,
        student.studentId,
        student.gender === 'male' ? '男' : '女',
        student.mbti?.type || '',
        student.learningStyle || '',
        student.socialType || '',
        student.avgScore?.toString() || '',
        student.compositeScore?.toString() || '',
        student.profileCompleteness.toString(),
        (student.interests || []).join('、'),
        student.pinned ? '是' : '否',
      ];
    });

  downloadCSV([headers, ...rows], `${classroom.name}-座位表-完整.csv`);
}

/**
 * Export class student list to Excel
 */
export function exportStudentList(students: StudentProfile[], classroom: Classroom) {
  const headers = ['姓名', '学号', '性别', 'MBTI', '学习风格', '社交类型', '均分', '综合评分', '完整度'];
  const rows = students.map(s => [
    s.name || s.studentId,
    s.studentId,
    s.gender === 'male' ? '男' : '女',
    s.mbti?.type || '',
    s.learningStyle || '',
    s.socialType || '',
    s.avgScore?.toString() || '',
    s.compositeScore?.toString() || '',
    s.profileCompleteness.toString(),
  ]);

  downloadCSV([headers, ...rows], `${classroom.name}-学生名单.csv`);
}

function downloadCSV(data: (string | number)[][], filename: string) {
  const csvContent = data
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
