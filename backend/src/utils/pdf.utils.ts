import PDFDocument from 'pdfkit';
import { Response } from 'express';

export interface ReportCardData {
  student: { studentId: string; firstName: string; lastName: string };
  generatedAt: Date;
  overallPercentage: number;
  overallGrade: string;
  rows: {
    course: string;
    assessmentType: string;
    score: number;
    maxScore: number;
    percentage: number;
    letterGrade: string;
  }[];
  comments?: string;
}

/** Streams a report-card PDF directly to the HTTP response. */
export function streamReportCard(res: Response, data: ReportCardData): void {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="report-card-${data.student.studentId}.pdf"`,
  );
  doc.pipe(res);

  doc.fontSize(20).text('Report Card', { align: 'center' }).moveDown(0.5);
  doc
    .fontSize(11)
    .text(`Student: ${data.student.firstName} ${data.student.lastName} (${data.student.studentId})`)
    .text(`Generated: ${data.generatedAt.toISOString().slice(0, 10)}`)
    .moveDown();

  // Table header
  doc.fontSize(11).text('Course', 50, doc.y, { continued: true, width: 150 });
  doc.text('Type', 200, doc.y, { continued: true, width: 90 });
  doc.text('Score', 290, doc.y, { continued: true, width: 70 });
  doc.text('%', 360, doc.y, { continued: true, width: 60 });
  doc.text('Grade', 420);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown(0.3);

  data.rows.forEach((r) => {
    const y = doc.y;
    doc.fontSize(10).text(r.course, 50, y, { width: 150 });
    doc.text(r.assessmentType, 200, y, { width: 90 });
    doc.text(`${r.score}/${r.maxScore}`, 290, y, { width: 70 });
    doc.text(`${r.percentage}%`, 360, y, { width: 60 });
    doc.text(r.letterGrade, 420, y);
  });

  doc.moveDown();
  doc
    .fontSize(12)
    .text(`Overall: ${data.overallPercentage}% (${data.overallGrade})`, { align: 'right' });

  if (data.comments) {
    doc.moveDown().fontSize(10).text(`Teacher comments: ${data.comments}`);
  }

  doc.end();
}
