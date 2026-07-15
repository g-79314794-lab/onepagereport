import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useForm } from 'react-hook-form';
import { Download, FileText, Moon, Printer, Sun, Wand2 } from 'lucide-react';
import './styles.css';
import { templates } from './data/templates.js';
import { api, toMalayDate } from './lib/api.js';
import { ReportPreview } from './components/ReportPreview.jsx';
import { PhotoUploader } from './components/PhotoUploader.jsx';

const initialSettings = { namaSekolah: 'SK Seri Cemerlang', alamat: 'Jalan Ilmu, 43000 Kajang, Selangor', telefon: '03-8888 0000', emel: 'info@sksericemerlang.edu.my', namaGuruBesar: 'En. Ahmad bin Salleh', jawatanGuruBesar: 'Guru Besar', logoUrl: '' };
const defaults = { namaProgram: 'Program Gotong-Royong Perdana', tarikh: new Date().toISOString().slice(0, 10), hari: 'Rabu', masa: '8.00 pagi - 12.00 tengah hari', tempat: 'Kawasan sekolah', penganjur: 'Unit Kokurikulum', sasaran: 'Murid Tahun 4 hingga Tahun 6', bilanganPeserta: '120 murid, 18 guru dan 25 ibu bapa', objektifProgram: 'Memupuk amalan kebersihan dan keceriaan sekolah.\nMengukuhkan kerjasama antara warga sekolah dan komuniti.', ringkasanAktiviti: 'Program dilaksanakan secara berfasa melibatkan taklimat keselamatan, pembahagian kumpulan, aktiviti pembersihan kelas, taman, kantin dan kawasan padang.', impakProgram: 'Persekitaran sekolah menjadi lebih bersih, ceria dan kondusif untuk pembelajaran murid.', cadanganPenambahbaikan: 'Program akan datang boleh melibatkan agensi luar dan menyediakan lebih banyak peralatan kebersihan.', namaPenyedia: 'Cikgu Nur Aina binti Hassan', jawatan: 'Setiausaha Program', template: 'Gotong-Royong', bilanganGambar: 2, guru: 'Cikgu Nur Aina' };

function App() {
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState('Laporan Baharu');
  const [settings, setSettings] = useState(initialSettings);
  const [photos, setPhotos] = useState([]);
  const [reports, setReports] = useState([]);
  const [aiSeed, setAiSeed] = useState('Murid menjalankan gotong-royong membersihkan kawasan sekolah.');
  const { register, watch, reset, setValue, getValues } = useForm({ defaultValues: defaults });
  const form = watch();
  const reportNo = useMemo(() => `LPSM/${new Date(form.tarikh || Date.now()).getFullYear()}/001`, [form.tarikh]);

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  useEffect(() => { api('/api/reports').then(setReports).catch(() => setReports([])); }, []);
  useEffect(() => {
    const timer = setInterval(() => localStorage.setItem('laporan-autosimpan', JSON.stringify({ form: getValues(), settings })), 30000);
    return () => clearInterval(timer);
  }, [getValues, settings]);

  const applyTemplate = (name) => { const tpl = templates.find((item) => item.nama === name); if (tpl) reset({ ...getValues(), ...tpl.data, template: name }); };
  const saveReport = async () => { const saved = await api('/api/reports', { method: 'POST', body: JSON.stringify({ ...getValues(), settings, reportNo, photos }) }); setReports([saved, ...reports]); alert('Laporan berjaya disimpan.'); };
  const exportFile = async (type) => { const res = await fetch(`/api/export/${type}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ report: getValues(), settings, reportNo }) }); const blob = await res.blob(); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${reportNo.replaceAll('/', '-')}.${type === 'word' ? 'docx' : 'pdf'}`; a.click(); URL.revokeObjectURL(url); };
  const generateAi = async () => { const data = await api('/api/ai/suggest', { method: 'POST', body: JSON.stringify({ input: aiSeed }) }); setValue('ringkasanAktiviti', data.ringkasanAktiviti); setValue('impakProgram', data.impakProgram); setValue('cadanganPenambahbaikan', data.cadanganPenambahbaikan); };

  return <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <aside className="sidebar"><h1>Sistem Laporan Satu Muka Sekolah</h1>{['Dashboard','Laporan Baharu','Senarai Laporan','Tetapan','Profil'].map((item)=><button className={active===item?'active':''} onClick={()=>setActive(item)} key={item}>{item}</button>)}<button onClick={()=>setDark(!dark)}>{dark ? <Sun/>:<Moon/>}{dark?'Mod Cerah':'Mod Gelap'}</button></aside>
    <main className="content">
      <section className="dashboard"><div><span>Jumlah Laporan</span><strong>{reports.length}</strong></div><div><span>Laporan Bulan Ini</span><strong>{reports.filter(r=>new Date(r.tarikh).getMonth()===new Date().getMonth()).length}</strong></div><div><span>Guru Paling Aktif</span><strong>{reports[0]?.guru || 'Cikgu Nur Aina'}</strong></div><div><span>Templat Popular</span><strong>{form.template}</strong></div></section>
      <section className="actions"><button onClick={saveReport}><FileText/>Simpan</button><button onClick={()=>exportFile('word')}><Download/>Download Word (.docx)</button><button onClick={()=>exportFile('pdf')}><Download/>Download PDF</button><button onClick={()=>window.print()}><Printer/>Cetak</button></section>
      <div className="workspace">
        <section className="card editor">
          <h2>Laporan Baharu</h2><label>Templat<select {...register('template')} onChange={(e)=>applyTemplate(e.target.value)}>{templates.map(t=><option key={t.nama}>{t.nama}</option>)}</select></label>
          <div className="grid2">{['namaProgram','tarikh','hari','masa','tempat','penganjur','sasaran','bilanganPeserta','namaPenyedia','jawatan'].map((name)=><label key={name}>{label(name)}<input type={name==='tarikh'?'date':'text'} {...register(name)} /></label>)}</div>
          {['objektifProgram','ringkasanAktiviti','impakProgram','cadanganPenambahbaikan'].map((name)=><label key={name}>{label(name)}<textarea rows="4" {...register(name)} /></label>)}
          <div className="ai-box"><h3>Cadangan AI Bahasa Melayu Rasmi</h3><textarea value={aiSeed} onChange={(e)=>setAiSeed(e.target.value)} rows="2"/><button onClick={generateAi} type="button"><Wand2/>Jana Ringkasan, Impak dan Cadangan</button></div>
          <label>Bilangan Gambar<select {...register('bilanganGambar', { valueAsNumber: true })}>{[1,2,3,4].map(n=><option key={n} value={n}>{n} gambar</option>)}</select></label><PhotoUploader count={Number(form.bilanganGambar)} photos={photos} setPhotos={setPhotos}/>
        </section>
        <ReportPreview report={form} photos={photos} settings={settings} reportNo={reportNo}/>
      </div>
      <section className="card history"><h2>Senarai Laporan</h2><input placeholder="Cari laporan, guru atau program"/><div>{reports.map(r=><article key={r._id || r.reportNo}><strong>{r.namaProgram}</strong><span>{toMalayDate(r.tarikh)} · {r.guru}</span><button>Ubah</button><button>Salin</button><button>Padam</button></article>)}</div></section>
      <section className="card settings"><h2>Tetapan Sekolah</h2><div className="grid2">{Object.keys(initialSettings).filter(k=>k!=='logoUrl').map(k=><label key={k}>{label(k)}<input value={settings[k]} onChange={(e)=>setSettings({...settings,[k]:e.target.value})}/></label>)}<label>Logo Sekolah<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e)=>{ const f=e.target.files[0]; if(f) setSettings({...settings, logoUrl: URL.createObjectURL(f)}); }}/></label></div><p className="note">Hanya Administrator boleh mengubah tetapan ini dalam produksi.</p></section>
    </main>
  </div>;
}
function label(name){ return name.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase()).replace('Bilangan Peserta','Bilangan Peserta').replace('Nama Program','Nama Program'); }
createRoot(document.getElementById('root')).render(<App />);
