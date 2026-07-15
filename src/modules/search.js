export function smartSearch(reports = [], query = '') {
  const q = query.trim().toLowerCase();
  if (!q) return reports;
  return reports.filter((report) => [report.namaProgram, report.guru, report.tarikh, report.reportNo, report.kategori, report.template, report.ringkasanAktiviti].some((value) => String(value || '').toLowerCase().includes(q)));
}
