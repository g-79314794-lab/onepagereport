export function buildAnalytics(reports = [], filters = {}) {
  const filtered = reports.filter((report) => {
    const date = new Date(report.tarikh || report.createdAt || Date.now());
    return (!filters.year || date.getFullYear() === Number(filters.year)) && (!filters.month || date.getMonth() + 1 === Number(filters.month)) && (!filters.teacher || report.guru === filters.teacher) && (!filters.programme || report.namaProgram?.includes(filters.programme)) && (!filters.school || report.settings?.namaSekolah === filters.school);
  });
  const by = (key) => Object.values(filtered.reduce((acc, report) => { const name = report[key] || report.template || 'Tidak Dinyatakan'; acc[name] = acc[name] || { name, jumlah: 0 }; acc[name].jumlah += 1; return acc; }, {}));
  const monthly = Array.from({ length: 12 }, (_, index) => ({ bulan: index + 1, jumlah: 0, peserta: 0 }));
  filtered.forEach((report) => { const date = new Date(report.tarikh || report.createdAt || Date.now()); const i = date.getMonth(); monthly[i].jumlah += 1; monthly[i].peserta += parseParticipants(report.bilanganPeserta); });
  const participants = filtered.reduce((sum, report) => sum + parseParticipants(report.bilanganPeserta), 0);
  const teachers = by('guru');
  const programmes = by('template');
  return {
    totalTahunIni: filtered.filter((report) => new Date(report.tarikh || report.createdAt).getFullYear() === new Date().getFullYear()).length,
    bulanIni: filtered.filter((report) => new Date(report.tarikh || report.createdAt).getMonth() === new Date().getMonth()).length,
    kategori: by('kategori'), guru: teachers, trendBulanan: monthly, peserta: participants,
    penganjurAktif: topName(by('penganjur')), templatPopular: topName(programmes), purataPeserta: filtered.length ? Math.round(participants / filtered.length) : 0,
    bulanPalingAktif: topName(monthly.map((m) => ({ name: String(m.bulan), jumlah: m.jumlah }))), guruPalingAktif: topName(teachers), jenisPopular: topName(programmes)
  };
}
function parseParticipants(value = '') { const matches = String(value).match(/\d+/g) || []; return matches.reduce((sum, n) => sum + Number(n), 0); }
function topName(items) { return [...items].sort((a, b) => b.jumlah - a.jumlah)[0]?.name || '-'; }
