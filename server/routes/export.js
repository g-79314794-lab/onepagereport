import { Router } from 'express';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
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
router.post('/pdf', async (req, res) => {
  const { report, settings, reportNo } = req.body; const pdf = await PDFDocument.create(); const page = pdf.addPage([595.28, 841.89]); const font = await pdf.embedFont(StandardFonts.Helvetica); const bold = await pdf.embedFont(StandardFonts.HelveticaBold); let y = 790; const draw = (text, size = 10, f = font) => { page.drawText(String(text || '-').slice(0, 115), { x: 42, y, size, font: f, color: rgb(0.08,0.13,0.22) }); y -= size + 7; };
  draw(settings.namaSekolah, 16, bold); draw(settings.alamat, 9); y -= 8; draw('LAPORAN SATU MUKA PROGRAM SEKOLAH', 15, bold); draw(report.namaProgram, 13, bold); draw(`No. Laporan: ${reportNo}`, 10, bold); [['Tarikh',format(report.tarikh)],['Hari',report.hari],['Masa',report.masa],['Tempat',report.tempat],['Penganjur',report.penganjur],['Sasaran',report.sasaran],['Bilangan Peserta',report.bilanganPeserta],['Objektif Program',report.objektifProgram],['Ringkasan Aktiviti',report.ringkasanAktiviti],['Impak Program',report.impakProgram],['Cadangan Penambahbaikan',report.cadanganPenambahbaikan],['Disediakan Oleh',`${report.namaPenyedia} (${report.jawatan})`],['Disahkan Oleh',`${settings.namaGuruBesar} (${settings.jawatanGuruBesar})`]].forEach(([a,b])=>draw(`${a}: ${b}`, 10)); draw('Muka Surat 1/1', 9, bold);
  const bytes = await pdf.save(); res.setHeader('Content-Type', 'application/pdf'); res.send(Buffer.from(bytes));
});
function format(value){ if(!value) return '-'; const [y,m,d] = value.slice(0,10).split('-'); return `${d}/${m}/${y}`; }
export default router;
