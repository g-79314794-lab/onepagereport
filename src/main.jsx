import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useForm } from 'react-hook-form';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, FileSpreadsheet, FileText, Moon, Printer, RefreshCw, Send, Sun, Wand2 } from 'lucide-react';
import './styles.css';
import { templates } from './data/templates.js';
import { api, toMalayDate } from './lib/api.js';
import { offlineStore, registerServiceWorker, syncQueuedReports } from './lib/offline.js';
import { buildAnalytics } from './modules/analytics.js';
import { smartSearch } from './modules/search.js';
import { ReportPreview } from './components/ReportPreview.jsx';
import { PhotoUploader } from './components/PhotoUploader.jsx';

const initialSettings = { sekolahId: 'KPM-001', namaSekolah: 'SK Seri Cemerlang', alamat: 'Jalan Ilmu, 43000 Kajang, Selangor', telefon: '03-8888 0000', emel: 'info@sksericemerlang.edu.my', namaGuruBesar: 'En. Ahmad bin Salleh', jawatanGuruBesar: 'Guru Besar', logoUrl: '' };
const defaults = { namaProgram: 'Program Gotong-Royong Perdana', kategori: 'Kokurikulum', status: 'Draft', tarikh: new Date().toISOString().slice(0, 10), hari: 'Rabu', masa: '8.00 pagi - 12.00 tengah hari', tempat: 'Kawasan sekolah', penganjur: 'Unit Kokurikulum', sasaran: 'Murid Tahun 4 hingga Tahun 6', bilanganPeserta: '120 murid, 18 guru dan 25 ibu bapa', objektifProgram: 'Memupuk amalan kebersihan dan keceriaan sekolah.\nMengukuhkan kerjasama antara warga sekolah dan komuniti.', ringkasanAktiviti: 'Program dilaksanakan secara berfasa melibatkan taklimat keselamatan, pembahagian kumpulan, aktiviti pembersihan kelas, taman, kantin dan kawasan padang.', impakProgram: 'Persekitaran sekolah menjadi lebih bersih, ceria dan kondusif untuk pembelajaran murid.', cadanganPenambahbaikan: 'Program akan datang boleh melibatkan agensi luar dan menyediakan lebih banyak peralatan kebersihan.', kesimpulan: 'Secara keseluruhannya, program telah mencapai objektif yang ditetapkan.', namaPenyedia: 'Cikgu Nur Aina binti Hassan', jawatan: 'Setiausaha Program', template: 'Gotong-Royong', bilanganGambar: 2, guru: 'Cikgu Nur Aina' };
const statuses = ['Draft', 'Waiting for Review', 'Approved', 'Rejected', 'Archived'];
const chartColours = ['#1d4ed8', '#16a34a', '#f97316', '#9333ea', '#dc2626'];

function App() {
  const [dark, setDark] = useState(false);
  const [settings, setSettings] = useState(initialSettings);
  const [photos, setPhotos] = useState([]);
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({ year: new Date().getFullYear(), month: '', teacher: '', programme: '', school: '' });
  const [search, setSearch] = useState('');
  const [aiSeed, setAiSeed] = useState('Murid menjalankan gotong-royong membersihkan kawasan sekolah.');
  const { register, watch, reset, setValue, getValues } = useForm({ defaultValues: defaults });
  const form = watch();
  const reportNo = useMemo(() => `LPSM/${new Date(form.tarikh || Date.now()).getFullYear()}/${String(reports.length + 1).padStart(3, '0')}`, [form.tarikh, reports.length]);
  const analytics = useMemo(() => buildAnalytics(reports, filters), [reports, filters]);
  const visibleReports = useMemo(() => smartSearch(reports, search), [reports, search]);

  useEffect(() => { registerServiceWorker(); }, []);
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  useEffect(() => { api('/api/reports').then(setReports).catch(() => setReports([])); }, []);
  useEffect(() => { const timer = setInterval(() => localStorage.setItem('laporan-autosimpan', JSON.stringify({ form: getValues(), settings, photos })), 30000); return () => clearInterval(timer); }, [getValues, settings, photos]);

  const applyTemplate = (name) => { const tpl = templates.find((item) => item.nama === name); if (tpl) reset({ ...getValues(), ...tpl.data, template: name }); };
  const saveReport = async () => { const payload = { ...getValues(), settings, reportNo, photos, sekolahId: settings.sekolahId }; try { const saved = await api('/api/reports', { method: 'POST', body: JSON.stringify(payload) }); setReports([saved, ...reports]); alert('Laporan berjaya disimpan.'); } catch { offlineStore.add({ payload }); alert('Laporan disimpan secara luar talian dan akan disegerakkan kemudian.'); } };
  const syncNow = async () => { const synced = await syncQueuedReports(api); if (synced.length) setReports([...synced, ...reports]); alert('Penyegerakan selesai.'); };
  const exportFile = async (type) => { const res = await fetch(`/api/export/${type}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ report: getValues(), reports: visibleReports, settings, reportNo, filters }) }); const blob = await res.blob(); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${reportNo.replaceAll('/', '-')}.${type === 'word' ? 'docx' : type}`; a.click(); URL.revokeObjectURL(url); };
  const generateAi = async (mode = 'jana') => { const data = await api('/api/ai/suggest', { method: 'POST', body: JSON.stringify({ input: aiSeed, mode, current: getValues() }) }); Object.entries(data).forEach(([key, value]) => setValue(key, value)); };

  return <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <aside className="sidebar"><h1>Sistem Laporan Satu Muka Sekolah</h1>{['Dashboard','Laporan Baharu','Senarai Laporan','Analitik','Kalendar','Backup Awan','Tetapan','Profil'].map((item)=><button className="nav" key={item}>{item}</button>)}<button onClick={()=>setDark(!dark)}>{dark ? <Sun/>:<Moon/>}{dark?'Mod Cerah':'Mod Gelap'}</button><button onClick={syncNow}><RefreshCw/>Sync Offline</button></aside>
    <main className="content">
      <section className="dashboard"><Metric title="Jumlah Tahun Ini" value={analytics.totalTahunIni}/><Metric title="Laporan Bulan Ini" value={analytics.bulanIni}/><Metric title="Purata Peserta" value={analytics.purataPeserta}/><Metric title="Templat Popular" value={analytics.templatPopular}/></section>
      <section className="filters">{['year','month','teacher','programme','school'].map((key)=><label key={key}>{filterLabel(key)}<input value={filters[key]} onChange={(e)=>setFilters({...filters,[key]:e.target.value})}/></label>)}<button onClick={()=>exportFile('xlsx')}><FileSpreadsheet/>Eksport Excel</button><button onClick={()=>exportFile('charts.pdf')}><Download/>Carta PDF</button><button onClick={()=>exportFile('charts.png')}><Download/>Carta PNG</button></section>
      <section className="charts"><ChartCard title="Trend Aktiviti Bulanan"><ResponsiveContainer><LineChart data={analytics.trendBulanan}><XAxis dataKey="bulan"/><YAxis/><Tooltip/><Line dataKey="jumlah" stroke="#1d4ed8" strokeWidth={3}/></LineChart></ResponsiveContainer></ChartCard><ChartCard title="Laporan Mengikut Guru"><ResponsiveContainer><BarChart data={analytics.guru}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="jumlah" fill="#16a34a"/></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Kategori Program"><ResponsiveContainer><PieChart><Pie data={analytics.kategori} dataKey="jumlah" nameKey="name" outerRadius={80}>{analytics.kategori.map((_, i)=><Cell key={i} fill={chartColours[i % chartColours.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></ChartCard></section>
      <section className="actions"><button onClick={saveReport}><FileText/>Simpan</button><button onClick={()=>exportFile('word')}><Download/>Download Word (.docx)</button><button onClick={()=>exportFile('pdf')}><Download/>Download PDF</button><button onClick={()=>window.print()}><Printer/>Cetak</button><button onClick={()=>api('/api/share/email',{method:'POST',body:JSON.stringify({report:getValues(),settings,reportNo})})}><Send/>Emel PDF</button></section>
      <div className="workspace"><section className="card editor"><h2>Laporan Baharu</h2><div className="grid2"><label>Templat<select {...register('template')} onChange={(e)=>applyTemplate(e.target.value)}>{templates.map(t=><option key={t.nama}>{t.nama}</option>)}</select></label><label>Status Kelulusan<select {...register('status')}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label></div><div className="grid2">{['namaProgram','kategori','tarikh','hari','masa','tempat','penganjur','sasaran','bilanganPeserta','namaPenyedia','jawatan','guru'].map((name)=><label key={name}>{label(name)}<input type={name==='tarikh'?'date':'text'} {...register(name)} /></label>)}</div>{['objektifProgram','ringkasanAktiviti','impakProgram','cadanganPenambahbaikan','kesimpulan'].map((name)=><label key={name}>{label(name)}<textarea rows="4" {...register(name)} /></label>)}<div className="ai-box"><h3>Pembantu Penulisan AI</h3><textarea value={aiSeed} onChange={(e)=>setAiSeed(e.target.value)} rows="2"/><div className="ai-actions">{['jana','tatabahasa','formal','pendekkan','panjangkan','profesional'].map(m=><button onClick={()=>generateAi(m)} type="button" key={m}><Wand2/>{m}</button>)}</div></div><label>Bilangan Gambar<select {...register('bilanganGambar', { valueAsNumber: true })}>{[1,2,3,4].map(n=><option key={n} value={n}>{n} gambar</option>)}</select></label><PhotoUploader count={Number(form.bilanganGambar)} photos={photos} setPhotos={setPhotos}/></section><ReportPreview report={form} photos={photos} settings={settings} reportNo={reportNo}/></div>
      <section className="card history"><h2>Carian Pintar & Senarai Laporan</h2><input placeholder="Cari program, guru, tarikh, nombor laporan, kata kunci atau kategori" value={search} onChange={(e)=>setSearch(e.target.value)}/><div>{visibleReports.map(r=><article key={r._id || r.id || r.reportNo}><strong>{r.reportNo} · {r.namaProgram}</strong><span>{toMalayDate(r.tarikh)} · {r.guru} · {r.status}</span><button>Ubah</button><button>Salin</button><button>Padam</button></article>)}</div></section>
      <section className="card integrations"><h2>Integrasi, Backup & Kalendar</h2><div className="module-grid">{['Google Drive OAuth 2.0','OneDrive','Dropbox','AWS S3','Local NAS','Google Calendar','Outlook Calendar','ICS'].map(item=><div key={item}><strong>{item}</strong><p>Disediakan sebagai modul sambungan untuk auto upload, folder tahunan/bulanan/program, perkongsian pautan, backup berjadual dan restore satu klik.</p></div>)}</div></section>
      <section className="card settings"><h2>Tetapan Sekolah & Multi-School</h2><div className="grid2">{Object.keys(initialSettings).filter(k=>k!=='logoUrl').map(k=><label key={k}>{label(k)}<input value={settings[k]} onChange={(e)=>setSettings({...settings,[k]:e.target.value})}/></label>)}<label>Logo Sekolah<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e)=>{ const f=e.target.files[0]; if(f) setSettings({...settings, logoUrl: URL.createObjectURL(f)}); }}/></label></div><p className="note">Role disokong: Administrator, Guru Besar, Penolong Kanan dan Guru. Hanya Administrator boleh mengubah tetapan sekolah.</p></section>
    </main>
  </div>;
}
function Metric({ title, value }) { return <div><span>{title}</span><strong>{value}</strong></div>; }
function ChartCard({ title, children }) { return <div className="chart-card"><h3>{title}</h3>{children}</div>; }
function filterLabel(key){ return ({ year:'Tahun', month:'Bulan', teacher:'Guru', programme:'Program', school:'Sekolah' })[key]; }
function label(name){ return name.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase()).replace('Id','ID'); }
createRoot(document.getElementById('root')).render(<App />);
