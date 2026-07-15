import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { toMalayDate } from '../lib/api.js';

export function ReportPreview({ report, photos, settings, reportNo }) {
  const [qr, setQr] = useState('');
  useEffect(() => { QRCode.toDataURL(reportNo).then(setQr); }, [reportNo]);
  const objectiveList = (report.objektifProgram || '').split('\n').filter(Boolean);
  return <article id="report-page" className="report-page">
    <header className="report-head">
      <div className="logo">{settings.logoUrl ? <img src={settings.logoUrl} alt="Logo Sekolah"/> : 'LOGO'}</div>
      <div><strong>{settings.namaSekolah}</strong><p>{settings.alamat}</p><p>Tel: {settings.telefon} · Emel: {settings.emel}</p></div>
      <div className="report-no">{reportNo}</div>
    </header>
    <h2>LAPORAN SATU MUKA PROGRAM SEKOLAH</h2><h3>{report.namaProgram}</h3>
    <section className="meta">{[['Tarikh', toMalayDate(report.tarikh)], ['Hari', report.hari], ['Masa', report.masa], ['Tempat', report.tempat], ['Penganjur', report.penganjur], ['Sasaran', report.sasaran], ['Bilangan Peserta', report.bilanganPeserta]].map(([k,v])=><div key={k}><span>{k}</span><b>{v}</b></div>)}</section>
    <div className="two-col"><section><h4>Objektif Program</h4><ul>{objectiveList.map((item)=><li key={item}>{item}</li>)}</ul></section><section><h4>Impak Program</h4><p>{report.impakProgram}</p></section></div>
    <section><h4>Ringkasan Aktiviti</h4><p>{report.ringkasanAktiviti}</p></section>
    <PhotoLayout photos={photos}/>
    <section><h4>Cadangan Penambahbaikan</h4><p>{report.cadanganPenambahbaikan}</p></section>
    <footer><div><span>Disediakan oleh</span><b>{report.namaPenyedia}</b><small>{report.jawatan}</small></div><div><span>Disahkan oleh</span><b>{settings.namaGuruBesar}</b><small>{settings.jawatanGuruBesar}</small></div><img src={qr} alt="Kod QR laporan"/><span className="page">Muka Surat 1/1</span></footer>
  </article>;
}
function PhotoLayout({ photos }) {
  const cls = `photos count-${Math.min(Math.max(photos.length, 1), 4)}`;
  return <section><h4>Gambar Aktiviti</h4><div className={cls}>{photos.length ? photos.slice(0,4).map((photo, i)=><img src={photo.preview || photo.url} alt={`Gambar aktiviti ${i+1}`} key={photo.id || i}/>) : <div className="empty-photo">Gambar aktiviti akan dipaparkan di sini.</div>}</div></section>;
}
