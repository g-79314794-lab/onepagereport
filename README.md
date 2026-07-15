# Sistem Laporan Satu Muka Sekolah

Aplikasi full-stack responsif untuk guru Malaysia menghasilkan laporan aktiviti sekolah satu muka dalam Bahasa Melayu rasmi.

## Ciri Utama
- Dashboard, Laporan Baharu, Senarai Laporan, Tetapan dan Profil.
- Borang laporan dengan templat: Hari Guru, Hari Sukan, Perhimpunan Rasmi, Gotong-Royong, Lawatan, Kem Kepimpinan, Majlis Penyampaian Hadiah, Program NILAM, Kem Membaca dan Ceramah Kesihatan.
- Muat naik 1 hingga 4 gambar dengan drag-and-drop, pratonton, padam/ganti dan validasi JPG/PNG/WEBP 10 MB.
- Susun atur automatik A4 potret satu muka: 1 gambar besar, 2 gambar seimbang, 3 gambar satu besar + dua kecil, 4 gambar 2×2.
- Tetapan sekolah termasuk logo, nama sekolah, alamat, telefon, emel dan Guru Besar.
- Eksport Word (.docx), PDF dan cetak terus daripada pelayar.
- Cadangan AI untuk ringkasan aktiviti, impak dan cadangan penambahbaikan dalam Bahasa Melayu formal.
- Autosimpan setiap 30 saat, mod gelap/cerah, nombor laporan `LPSM/YYYY/001` dan QR Code.

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

## Skrip
- `npm run dev` — jalankan frontend Vite dan backend Express.
- `npm run server` — jalankan API Express sahaja.
- `npm run client` — jalankan React sahaja.
- `npm run build` — bina aplikasi produksi.

## Nota Seni Bina
Frontend menggunakan React, Tailwind CSS dan React Hook Form. Backend menggunakan Node.js, Express.js, MongoDB/Mongoose, Multer, Sharp, docx, pdf-lib dan OpenAI API. Struktur REST API disediakan untuk laporan, muat naik gambar, eksport dan cadangan AI. Kod sengaja diasingkan kepada komponen, data templat, utiliti API, model dan routes supaya mudah dikembangkan kepada eksport Excel, statistik carta, Google Drive Sync dan sandaran awan.
