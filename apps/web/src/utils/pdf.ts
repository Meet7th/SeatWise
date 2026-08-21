import type { StudentProfile } from '@seatwise/shared';

/**
 * Generate a simple PDF report for a student profile
 * Uses a basic approach - in production, use a proper PDF library like jsPDF
 */
export async function generateStudentReportPDF(profile: StudentProfile, studentName: string): Promise<void> {
  const { default: jsPDF } = await import('jspdf');

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.text('Student Profile Report', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Name: ${studentName}`, 20, 35);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 43);

  let y = 55;

  // MBTI
  if (profile.mbti) {
    doc.setFontSize(14);
    doc.text('MBTI Type', 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`Type: ${profile.mbti.type}`, 20, y);
    y += 8;
    doc.text(`E/I: ${profile.mbti.E_I}  S/N: ${profile.mbti.S_N}  T/F: ${profile.mbti.T_F}  J/P: ${profile.mbti.J_P}`, 20, y);
    y += 12;
  }

  // Learning Style
  if (profile.learningStyle) {
    doc.setFontSize(14);
    doc.text('Learning Style', 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(profile.learningStyle, 20, y);
    y += 12;
  }

  // Social Type
  if (profile.socialType) {
    doc.setFontSize(14);
    doc.text('Social Type', 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(profile.socialType, 20, y);
    y += 12;
  }

  // Interests
  if (profile.interests?.length) {
    doc.setFontSize(14);
    doc.text('Interests', 20, y);
    y += 8;
    doc.setFontSize(12);
    const interests = profile.interests.join(', ');
    const lines = doc.splitTextToSize(interests, pageWidth - 40);
    doc.text(lines, 20, y);
    y += lines.length * 6 + 6;
  }

  // Self Assessment
  if (profile.selfAssessment) {
    doc.setFontSize(14);
    doc.text('Self Assessment', 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`Academic: ${profile.selfAssessment.academicLevel}`, 20, y);
    y += 6;
    doc.text(`Motivation: ${profile.selfAssessment.motivation}`, 20, y);
    y += 6;
    doc.text(`Social Ability: ${profile.selfAssessment.socialAbility}`, 20, y);
    y += 12;
  }

  // Scores
  if (profile.compositeScore !== null) {
    doc.setFontSize(14);
    doc.text('Composite Score', 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`${profile.compositeScore} / 100`, 20, y);
    y += 12;
  }

  // Profile Completeness
  doc.setFontSize(14);
  doc.text('Profile Completeness', 20, y);
  y += 8;
  doc.setFontSize(12);
  doc.text(`${profile.profileCompleteness}%`, 20, y);

  doc.save(`${studentName}-profile-report.pdf`);
}
