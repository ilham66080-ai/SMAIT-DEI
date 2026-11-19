# SIM-BK SMA - Sistem Informasi Manajemen Laporan Guru BK Berjenjang
**SMAN 1 TELADAN JAKARTA**  
*Implementasi Tupoksi Bimbingan dan Konseling Berdasarkan Permendikbud No. 111 Tahun 2014 & Permendikbud No. 15 Tahun 2018*

---

## 🌟 Gambaran Aplikasi

Aplikasi **SIM-BK SMA** dirancang khusus untuk mengelola pelaporan dan akuntabilitas kinerja Guru Bimbingan dan Konseling secara berjenjang (*hierarchical approval workflow*). Sistem ini mengintegrasikan alur kerja dari Guru BK ke tingkat pimpinan:
1. **Guru BK** (Penyusun & Pelaksana Layanan)
2. **Wakil Kepala Sekolah Bidang Kurikulum** (Verifikator Bidang Belajar & Peminatan Fase F)
3. **Wakil Kepala Sekolah Bidang Kesiswaan** (Verifikator Bidang Pribadi, Sosial, Kasus & Home Visit)
4. **Koordinator Program Khusus** (Verifikator Program Inklusi, Satgas PPKSP, dan Karier/PTN)
5. **Kepala Sekolah** (Pengesahan Akhir, Lembar Disposisi Kebijakan, dan e-Signature)
6. **Super Admin** (Manajemen Pengguna, Audit Trail, & Pengaturan Sistem)

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini dibangun menggunakan arsitektur **Modern Single-Page Application (SPA)** berbasis web murni (HTML5, Tailwind CSS, FontAwesome, Chart.js, Vanilla JS, dan LocalStorage).

> **Tidak memerlukan instalasi server atau dependensi tambahan.**  
> Cukup buka file `index.html` langsung dengan klik dua kali (double click) di **Google Chrome**, **Microsoft Edge**, atau peramban lainnya.

Lokasi folder:
`C:\Users\user\.gemini\antigravity\scratch\sim-bk-sma\index.html`

---

## 👥 Akun Demo & Hak Akses (Semua Password: `password`)

Di halaman Login maupun di bagian atas dashboard, tersedia **Pita Akses Cepat (1-Click Demo Switcher)** untuk beralih peran instan:

| No | Peran / Jabatan | Username | Password | Deskripsi Tugas & Wewenang |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **Super Admin** | `admin` | `password` | Manajemen akun pengguna, data master, audit log, & reset demo. |
| 2 | **Guru BK (Kelas X & XI)** | `guru.bk1` | `password` | Menginput laporan bimbingan harian, kasus pribadi/sosial, RPL, dan mengajukan laporan ke Waka. |
| 3 | **Guru BK (Kelas XII & Karier)** | `guru.bk2` | `password` | Menginput laporan bimbingan karier, pemetaan eligible SNBP, UTBK, dan sekolah kedinasan. |
| 4 | **Waka Kurikulum** | `waka.kurikulum` | `password` | Memvalidasi laporan bidang **Belajar & Peminatan Akademik** (Fase F Kurikulum Merdeka). |
| 5 | **Waka Kesiswaan** | `waka.kesiswaan` | `password` | Memvalidasi laporan bidang **Pribadi & Sosial**, tata tertib, konflik siswa, dan kunjungan rumah. |
| 6 | **Koordinator Program Khusus** | `prog.khusus` | `password` | Memvalidasi laporan **Inklusi/ABK**, **Satgas PPKSP** (Anti-Perundungan), dan **Karier**. |
| 7 | **Kepala Sekolah** | `kepsek` | `password` | Menerima laporan yang telah disetujui Waka, menerbitkan **Lembar Disposisi**, dan mengesahkan dokumen secara digital (*e-Sign*). |

---

## 🔄 Panduan Uji Coba Alur Berjenjang (Workflow Simulation)

Untuk menguji alur kerja lengkap dari awal sampai akhir, ikuti langkah berikut:

### Langkah 1: Buat / Ajukan Laporan (Sebagai Guru BK)
1. Klik tombol demo **Guru BK 1** di pita atas.
2. Klik tombol hijau **"Buat Laporan Baru"**.
3. Pilih Bidang Layanan (misal: *Bimbingan Belajar* $\rightarrow$ Verifikator otomatis terpilih *Waka Kurikulum*).
4. Isi judul dan ringkasan, lalu pilih tombol **"Ajukan ke Verifikator"**.
5. Laporan sekarang masuk status `Menunggu Review Waka`.

### Langkah 2: Telaah & Validasi (Sebagai Waka)
1. Klik tombol demo **Waka Kurikulum** di pita atas.
2. Masuk ke menu **"Meja Verifikasi Waka"**.
3. Klik tombol **"Telaah & Putuskan"** pada laporan yang baru diajukan.
4. Pilih opsi **"Setujui Laporan"**, masukkan catatan apresiasi/rekomendasi, lalu klik **"Simpan Keputusan"**.
5. Laporan sekarang lolos ke meja pimpinan tertinggi dengan status `Disetujui Waka (Menunggu Kepsek)`.

### Langkah 3: Disposisi & Pengesahan (Sebagai Kepala Sekolah)
1. Klik tombol demo **Kepala Sekolah** di pita atas.
2. Masuk ke menu **"Meja Disposisi Kepsek"**.
3. Klik tombol **"Sahkan & Disposisi"**.
4. Masukkan instruksi kebijakan pimpinan (misal: *"Setuju, segera koordinasikan dengan komite dan anggarkan"*).
5. Klik **"Sahkan & Terbitkan Disposisi"**.
6. Dokumen sekarang berstatus `Disahkan Kepala Sekolah` lengkap dengan kode otentikasi unik e-Signature.

### Langkah 4: Cetak / Simpan PDF Dokumen Resmi
1. Klik tombol **"Lihat Detail"** (ikon mata) pada laporan yang sudah disahkan.
2. Dokumen akan tampil dalam format resmi lengkap dengan:
   * **Kop Surat Resmi SMA Negeri 1 Teladan Jakarta**.
   * Tabel meta data & 4 bagian laporan tupoksi (Ringkasan, Temuan, Rekomendasi).
   * **Lembar Catatan Verifikasi Waka**.
   * **Lembar Disposisi & Instruksi Kepala Sekolah**.
   * **Tiga Kolom Tanda Tangan Berjenjang** (Guru BK, Waka, dan Kepala Sekolah dengan stempel digital).
3. Klik tombol **"Cetak / Simpan PDF"** untuk mencetak fisik atau menyimpan PDF.

---

## 📸 Cara Mengubah Foto Profil Akun

Aplikasi mendukung penggantian foto profil secara langsung dengan 3 pilihan fleksibel:

1. **Buka Menu Profil:**
   * Di sudut kiri bawah sidebar (pada kartu profil Anda yang ada ikon kamera 📷) atau di pojok kanan atas header, **klik foto profil / nama Anda**.
   * Modal **"Ubah Foto Profil & Data Akun"** akan terbuka.

2. **Pilih Metode Foto:**
   * **Cara 1: Unggah dari Komputer / HP**  
     Klik tombol **`Unggah Foto dari Komputer`**, lalu pilih file foto Anda (JPG/PNG). Foto akan otomatis dikonversi dan disimpan ke sistem secara offline.
   * **Cara 2: Pilih Avatar Pendidik Siap Pakai**  
     Tersedia 6 pilihan preset foto formal pendidik pria/wanita/berhijab. Cukup klik salah satu foto yang diinginkan.
   * **Cara 3: Input Tautan / URL Gambar**  
     Anda juga bisa memasukkan tautan langsung URL foto Anda ke kolom yang disediakan.

3. **Ubah Informasi Akun (Opsional):**
   * Anda juga dapat mengoreksi **Nama Lengkap & Gelar**, **NIP**, atau mengganti **Password Baru**.
4. Klik **"Simpan Perubahan Foto & Akun"**.
   * Foto profil Anda di sidebar, header, dan seluruh sistem akan langsung terbarui seketika!

---

## 📝 Tempat Input Data Siswa dan Guru

Aplikasi menyediakan modul lengkap untuk menginput, mengedit, dan mengelola Data Siswa serta Data Guru/Pengguna:

### 1. Cara Input Data Siswa (Konseli Asuh & Kerawanan)
1. Buka menu **"Data Asuh & Kerawanan"** di menu samping kiri (bisa diakses oleh **Guru BK** atau **Super Admin**).
2. Klik tombol warna ungu: **`+ Tambah Siswa Baru`** di pojok kanan atas tabel.
3. Masukkan data siswa:
   * **NISN** (Nomor Induk Siswa Nasional)
   * **Nama Lengkap Siswa**
   * **Kelas / Rombel** (Contoh: `X-4`, `XI-2`, `XII-MIPA-1`)
   * **Jenis Kelamin** (L/P)
   * **Guru BK Pengampu** (Konselor asuh yang bertanggung jawab)
   * **Status Deteksi Dini Kerawanan** (Aman, Sedang, Tinggi, Inklusi ADHD, Inklusi Lambat Belajar).
4. Klik **Simpan Data Siswa**. Siswa baru akan langsung tersimpan dan muncul di daftar.
5. Anda juga bisa mengklik ikon **Pensil (Edit)** atau **Tempat Sampah (Hapus)** pada baris tabel siswa.

### 2. Cara Input Data Guru & Pengguna Sistem (Akun Baru)
1. Masuk sebagai **Super Admin** (Klik tombol **Admin** di pita atas).
2. Di menu samping kiri bawah, buka menu **"Kelola Pengguna"** (di bawah bagian *Super Admin Menu*).
3. Klik tombol warna ungu: **`+ Tambah Guru / Pengguna`**.
4. Masukkan data:
   * **Nama Lengkap & Gelar**
   * **NIP / NUPTK**
   * **Username Login**
   * **Password** (default: `password`)
   * **Peran / Hak Akses** (Pilih: *Guru BK*, *Waka Kurikulum*, *Waka Kesiswaan*, *Koordinator Program Khusus*, *Kepala Sekolah*, atau *Super Admin*)
   * **Unit Kerja / Departemen**
5. Klik **Simpan Pengguna**. Akun baru langsung aktif dan bisa digunakan untuk login ke sistem.

---

## 🔒 Fitur Perlindungan Asas Kerahasiaan BK (*Data Privacy*)

Sesuai kode etik konseling, sistem dilengkapi klasifikasi kerahasiaan:
* **Tingkat 1 (Umum/Statistik):** Dapat dilihat seluruh pimpinan.
* **Tingkat 2 (Manajerial):** Rangkuman kasus untuk penanganan bersama Waka & Kepsek.
* **Tingkat 3 (Sangat Rahasia):** Detail trauma/verbatim sensitif disensor otomatis dari non-BK.
  * *Uji coba:* Buka laporan **RPT-2026-004 (Kevin Sanjaya - Inklusi)** saat login sebagai **Waka** atau **Kepsek**. Catatan Bagian III akan menampilkan label:  
    `🔒 [CATATAN SANGAT RAHASIA - TERLINDUNGI ASAS KERAHASIAAN BK]`.  
  * Kemudian beralih ke akun **Guru BK 1**, catatan sensitif tersebut akan terbaca secara utuh.

---

## 🛠️ Modul Tambahan

* **Dashboard & Grafik Interaktif:** Visualisasi Doughnut Chart (4 Bidang Layanan BK) dan Bar Chart (Status Alur Dokumen) menggunakan Chart.js.
* **Data Asuh Siswa:** Pemetaan tingkat kerawanan (Aman, Sedang, Tinggi, Inklusi).
* **Audit Trail Log:** Rekam jejak seluruh transaksi (Login, Submit, Review, Disposisi).
* **Reset Data:** Tombol di bagian kiri bawah sidebar untuk mengembalikan semua data ke setelan awal kapan saja.
