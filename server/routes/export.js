import { Router } from 'express';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import XLSX from 'xlsx';
import { makeSummary } from '../services/analytics.js';
const router = Router();
const line = (label, value) => new Paragraph({ children: [new TextRun({ text: `${label}: `, bold: true }), new TextRun(String(value || '-'))] });
router.post('/word', async (req, res) => {
  const { report, settings, reportNo } = req.body;
  const doc = new Document({ sections: [{ properties: { page: { margin: { top: 850, right: 850, bottom: 850, left: 850 } } }, children: [
    new Paragraph({ text: settings.namaSekolah, heading: 'Heading1' }), new Paragraph(settings.alamat || ''), new Paragraph({ text: 'LAPORAN SATU MUKA PROGRAM SEKOLAH', heading: 'Title' }), new Paragraph({ text: report.namaProgram || '', heading: 'Heading2' }),
    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [['No. Laporan', reportNo], ['Tarikh', format(report.tarikh)], ['Hari', report.hari], ['Masa', report.masa], ['Tempat', report.tempat], ['Penganjur', report.penganjur], ['Sasaran', report.sasaran], ['Bilangan Peserta', report.bilanganPeserta]].map(([a,b]) => new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: a, bold: true })] }), new TableCell({ children: [new Paragraph(String(b || '-'))] })] })) }),
    line('Objektif Program', report.objektifProgram), line('Ringkasan Aktiviti', report.ringkasanAktiviti), line('Impak Program', report.impakProgram), line('Cadangan Penambahbaikan', report.cadanganPenambahbaikan), line('Disediakan Oleh', `${report.namaPenyedia} (${report.jawatan})`), line('Disahkan Oleh', `${settings.namaGuruBesar} (${settings.jawatanGuruBesar})`)
  ] }] });
  const buffer = await Packer.toBuffer(doc); res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'); res.send(buffer);
});

router.post('/xlsx', async (req, res) => {
  const { rows, totals, averageParticipants } = makeSummary(req.body.reports || [req.body.report]);
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(rows.map((row) => ({
    'Report Number': row.reportNo,
    'Programme Name': row.programme,
    Date: row.date,
    Teacher: row.teacher,
    Participants: row.participants,
    Status: row.status,
    Category: row.category,
    'Created Date': row.createdDate
  })));
  XLSX.utils.book_append_sheet(workbook, sheet, 'Laporan');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([
    { Metrik: 'Jumlah Laporan', Nilai: totals.total },
    { Metrik: 'Jumlah Peserta', Nilai: totals.participants },
    { Metrik: 'Purata Peserta', Nilai: averageParticipants },
    { Metrik: 'Ringkasan Guru', Nilai: JSON.stringify(totals.byTeacher) },
    { Metrik: 'Ringkasan Program', Nilai: JSON.stringify(totals.byProgramme) },
    { Metrik: 'Ringkasan Kategori', Nilai: JSON.stringify(totals.byCategory) }
  ]), 'Ringkasan');
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
});
router.post('/charts.pdf', async (_, res) => {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  page.drawText('Laporan Analitik Carta', { x: 42, y: 780, size: 18, font: bold, color: rgb(0.08,0.13,0.22) });
  page.drawText('Eksport carta PDF disediakan untuk modul analitik.', { x: 42, y: 750, size: 11, font: bold });
  res.setHeader('Content-Type', 'application/pdf');
  res.send(Buffer.from(await pdf.save()));
});
router.post('/charts.png', (_, res) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500"><rect width="900" height="500" fill="#eff6ff"/><text x="40" y="80" font-size="34" fill="#0f2f57">Carta Analitik Laporan Sekolah</text><rect x="60" y="150" width="120" height="250" fill="#1d4ed8"/><rect x="230" y="220" width="120" height="180" fill="#16a34a"/><rect x="400" y="120" width="120" height="280" fill="#f97316"/></svg>`;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

router.post('/pdf', async (req, res) => {
  const { report, settings, reportNo } = req.body; const pdf = await PDFDocument.create(); const page = pdf.addPage([595.28, 841.89]); const font = await pdf.embedFont(StandardFonts.Helvetica); const bold = await pdf.embedFont(StandardFonts.HelveticaBold); let y = 790; const draw = (text, size = 10, f = font) => { page.drawText(String(text || '-').slice(0, 115), { x: 42, y, size, font: f, color: rgb(0.08,0.13,0.22) }); y -= size + 7; };
  draw(settings.namaSekolah, 16, bold); draw(settings.alamat, 9); y -= 8; draw('LAPORAN SATU MUKA PROGRAM SEKOLAH', 15, bold); draw(report.namaProgram, 13, bold); draw(`No. Laporan: ${reportNo}`, 10, bold); [['Tarikh',format(report.tarikh)],['Hari',report.hari],['Masa',report.masa],['Tempat',report.tempat],['Penganjur',report.penganjur],['Sasaran',report.sasaran],['Bilangan Peserta',report.bilanganPeserta],['Objektif Program',report.objektifProgram],['Ringkasan Aktiviti',report.ringkasanAktiviti],['Impak Program',report.impakProgram],['Cadangan Penambahbaikan',report.cadanganPenambahbaikan],['Disediakan Oleh',`${report.namaPenyedia} (${report.jawatan})`],['Disahkan Oleh',`${settings.namaGuruBesar} (${settings.jawatanGuruBesar})`]].forEach(([a,b])=>draw(`${a}: ${b}`, 10)); draw('Muka Surat 1/1', 9, bold);
  const bytes = await pdf.save(); res.setHeader('Content-Type', 'application/pdf'); res.send(Buffer.from(bytes));
});
function format(value){ if(!value) return '-'; const [y,m,d] = value.slice(0,10).split('-'); return `${d}/${m}/${y}`; }
export default router;
