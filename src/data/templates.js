export const templates = [
  ['Hari Guru','Majlis Sambutan Hari Guru','Dewan sekolah','PIBG dan Kelab Guru','Menghargai jasa guru serta mengeratkan hubungan warga sekolah.'],
  ['Hari Sukan','Kejohanan Sukan Tahunan','Padang sekolah','Unit Kokurikulum','Mencungkil bakat sukan dan membina semangat kesukanan murid.'],
  ['Perhimpunan Rasmi','Perhimpunan Rasmi Mingguan','Dewan terbuka','Unit Hal Ehwal Murid','Menyampaikan maklumat rasmi dan membentuk disiplin murid.'],
  ['Gotong-Royong','Program Gotong-Royong Perdana','Kawasan sekolah','Unit Kokurikulum','Memupuk budaya kebersihan dan kerjasama komuniti sekolah.'],
  ['Lawatan','Lawatan Sambil Belajar','Lokasi lawatan','Panitia berkaitan','Meningkatkan pembelajaran luar bilik darjah secara bermakna.'],
  ['Kem Kepimpinan','Kem Kepimpinan Murid','Kem motivasi','Unit Bimbingan dan Kaunseling','Membentuk jati diri, kepimpinan dan keyakinan murid.'],
  ['Majlis Penyampaian Hadiah','Majlis Penyampaian Hadiah','Dewan sekolah','Unit Kurikulum','Mengiktiraf pencapaian murid dalam bidang akademik dan kokurikulum.'],
  ['Program NILAM','Program Galakan Membaca NILAM','Pusat sumber sekolah','Pusat Sumber Sekolah','Meningkatkan minat membaca dan budaya ilmu.'],
  ['Kem Membaca','Kem Membaca 1Malaysia','Pusat sumber sekolah','Panitia Bahasa Melayu','Memperkukuh kemahiran membaca dan kefahaman murid.'],
  ['Ceramah Kesihatan','Ceramah Kesihatan Murid','Dewan sekolah','Unit HEM','Meningkatkan kesedaran kesihatan dan amalan hidup sihat.']
].map(([nama, namaProgram, tempat, penganjur, objektif]) => ({ nama, data: { namaProgram, tempat, penganjur, objektifProgram: objektif, ringkasanAktiviti: `${namaProgram} telah dilaksanakan dengan teratur melibatkan penyertaan aktif warga sekolah.`, impakProgram: 'Program memberi kesan positif terhadap pengetahuan, sahsiah dan penglibatan murid.', cadanganPenambahbaikan: 'Perancangan awal, dokumentasi bergambar dan penglibatan komuniti boleh dipertingkatkan pada masa akan datang.' } }));
