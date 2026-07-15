export function makeSummary(reports = []) {
  const rows = reports.map(normaliseReport);
  const totals = rows.reduce((acc, row) => { acc.total += 1; acc.participants += row.participants; acc.byTeacher[row.teacher] = (acc.byTeacher[row.teacher] || 0) + 1; acc.byProgramme[row.programme] = (acc.byProgramme[row.programme] || 0) + 1; acc.byCategory[row.category] = (acc.byCategory[row.category] || 0) + 1; return acc; }, { total: 0, participants: 0, byTeacher: {}, byProgramme: {}, byCategory: {} });
  return { rows, totals, averageParticipants: totals.total ? Math.round(totals.participants / totals.total) : 0 };
}
export function normaliseReport(report = {}) {
  return { reportNo: report.reportNo || report.nomborLaporan || '-', programme: report.namaProgram || '-', date: format(report.tarikh), teacher: report.guru || report.namaPenyedia || '-', participants: parseParticipants(report.bilanganPeserta), status: report.status || 'Draft', category: report.kategori || report.template || '-', createdDate: format(report.createdAt || new Date().toISOString()) };
}
function parseParticipants(value = '') { return (String(value).match(/\d+/g) || []).reduce((sum, n) => sum + Number(n), 0); }
function format(value) { if (!value) return '-'; const date = new Date(value); if (Number.isNaN(date.getTime())) return value; return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`; }
