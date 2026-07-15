# Sistem Laporan Satu Muka Sekolah

Aplikasi full-stack responsif dan PWA untuk guru Malaysia menghasilkan laporan aktiviti sekolah satu muka dalam Bahasa Melayu rasmi. Reka bentuknya modular supaya sesuai dikembangkan untuk KPM, PPD, JPN atau penggunaan pelbagai sekolah.

## Ciri Utama
- Dashboard, Laporan Baharu, Senarai Laporan, Analitik, Kalendar, Backup Awan, Tetapan dan Profil.
- Borang laporan dengan workflow kelulusan: `Draft`, `Waiting for Review`, `Approved`, `Rejected`, `Archived`.
- Templat: Hari Guru, Hari Sukan, Perhimpunan Rasmi, Gotong-Royong, Lawatan, Kem Kepimpinan, Majlis Penyampaian Hadiah, Program NILAM, Kem Membaca dan Ceramah Kesihatan.
- Muat naik 1 hingga 4 gambar dengan drag-and-drop, pratonton, padam/ganti, validasi JPG/PNG/WEBP 10 MB dan pemampatan Sharp di backend.
- Susun atur automatik A4 potret satu muka: 1 gambar besar, 2 gambar seimbang, 3 gambar satu besar + dua kecil, 4 gambar 2×2.
- Tetapan multi-school termasuk ID sekolah, logo, nama sekolah, alamat, telefon, emel dan Guru Besar.
- Eksport Word (.docx), PDF, Excel (.xlsx), carta PDF/PNG dan cetak terus daripada pelayar.
- Analitik: jumlah laporan tahun ini, laporan bulan ini, kategori program, guru, trend bulanan, peserta, penganjur aktif dan templat popular.
- Carian pintar segera merentas nama program, guru, tarikh, nombor laporan, kata kunci dan kategori.
- Cadangan AI untuk objektif, ringkasan aktiviti, impak, penambahbaikan, kesimpulan, pembetulan tatabahasa, formaliti, ringkasan dan penulisan profesional.
- PWA dengan manifest, service worker, sokongan pemasangan Windows/Android/iPhone/iPad dan simpanan laporan luar talian untuk sync semula.
- Modul integrasi disediakan untuk Google Drive OAuth 2.0, OneDrive, Dropbox, AWS S3, Local NAS, Google Calendar, Outlook Calendar, ICS, notifikasi, emel dan restore backup.

## Pemasangan
```bash
npm install
cp .env.example .env
npm run dev
```

## Pemboleh Ubah Persekitaran
- `MONGODB_URI` — sambungan MongoDB. Jika tidak disediakan, aplikasi menggunakan storan memori sementara untuk pembangunan.
- `OPENAI_API_KEY` — kunci API OpenAI untuk fungsi cadangan AI.
- `OPENAI_MODEL` — model untuk cadangan AI, lalai `gpt-4.1-mini`.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — OAuth Google Drive.
- `ONEDRIVE_CLIENT_ID`, `DROPBOX_APP_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET` — penyedia backup awan.
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` — perkongsian emel PDF.

## Skrip
- `npm run dev` — jalankan frontend Vite dan backend Express.
- `npm run server` — jalankan API Express sahaja.
- `npm run client` — jalankan React sahaja.
- `npm run build` — bina aplikasi produksi.
- `npm run lint` — semak kualiti kod.

## API Utama
- `GET/POST/PUT/DELETE /api/reports` — CRUD laporan dengan fallback memori.
- `POST /api/uploads` — upload dan mampatkan imej kepada WEBP.
- `POST /api/export/word`, `/pdf`, `/xlsx`, `/charts.pdf`, `/charts.png` — eksport dokumen dan analitik.
- `POST /api/ai/suggest` — pembantu penulisan Bahasa Melayu rasmi.
- `GET /api/integrations/google-drive/oauth-url` — permulaan OAuth Google Drive.
- `POST /api/integrations/cloud/upload`, `/backup`, `/restore`, `/calendar/ics`, `/workflow/approve` — sambungan awan, kalendar dan kelulusan.
- `POST /api/share/email` — jadualkan emel PDF kepada pentadbir berkaitan.

## Nota Seni Bina
Frontend menggunakan React, Tailwind CSS, React Hook Form dan Recharts. Backend menggunakan Node.js, Express.js, MongoDB/Mongoose, Multer, Sharp, docx, pdf-lib, xlsx dan OpenAI API. Modul analitik, carian, offline sync, cloud connectors, notifications dan workflow diasingkan supaya modul masa depan seperti minit mesyuarat PIBG, laporan guru bertugas, pemerhatian bilik darjah, QR attendance, sijil, bulletin sekolah, multi-language dan templat KPM/PPD/JPN boleh ditambah tanpa mengubah teras aplikasi.
