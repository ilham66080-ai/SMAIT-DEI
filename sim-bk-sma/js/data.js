/**
 * SIM-BK SMA - Initial Dummy Data & Configuration
 * SMAN 1 TELADAN
 */

const DEFAULT_USERS = [
  {
    id: "usr_admin",
    username: "admin",
    password: "password",
    name: "Ahmad Rizaldy, S.Kom",
    nip: "198805122011011002",
    role: "super_admin",
    roleLabel: "Super Admin",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    department: "IT & SIM Sekolah"
  },
  {
    id: "usr_bk1",
    username: "guru.bk1",
    password: "password",
    name: "Dra. Hj. Nurhayati, M.Pd",
    nip: "197204151998022001",
    role: "guru_bk",
    roleLabel: "Guru BK (Koordinator / Kelas X & XI)",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    department: "Bimbingan & Konseling"
  },
  {
    id: "usr_bk2",
    username: "guru.bk2",
    password: "password",
    name: "Bambang Setyo Wibowo, S.Pd, Gr",
    nip: "198908202015031004",
    role: "guru_bk",
    roleLabel: "Guru BK (Konselor Kelas XII & Karier)",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    department: "Bimbingan & Konseling"
  },
  {
    id: "usr_kurikulum",
    username: "waka.kurikulum",
    password: "password",
    name: "Drs. H. Ahmad Fauzi, M.Pd",
    nip: "196903101994121001",
    role: "waka_kurikulum",
    roleLabel: "Waka Kurikulum",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    department: "Wakil Kepala Sekolah Bidang Kurikulum"
  },
  {
    id: "usr_kesiswaan",
    username: "waka.kesiswaan",
    password: "password",
    name: "Rahmat Hidayat, S.Pd, M.M",
    nip: "197811052003121003",
    role: "waka_kesiswaan",
    roleLabel: "Waka Kesiswaan",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150",
    department: "Wakil Kepala Sekolah Bidang Kesiswaan"
  },
  {
    id: "usr_khusus",
    username: "prog.khusus",
    password: "password",
    name: "Siti Rohmah, S.Psi, M.Psi",
    nip: "198501172010012005",
    role: "prog_khusus",
    roleLabel: "Koordinator Program Khusus / PPKSP",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
    department: "Program Inklusi, Satgas PPKSP & Karier"
  },
  {
    id: "usr_kepsek",
    username: "kepsek",
    password: "password",
    name: "Dr. H. Mulyadi, M.Pd",
    nip: "196602121990031002",
    role: "kepala_sekolah",
    roleLabel: "Kepala Sekolah",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    department: "Pimpinan Sekolah"
  }
];

const DEFAULT_STUDENTS = [
  { id: "std_01", nisn: "0068192831", name: "Dimas Arya Pratama", class: "XI-2", gender: "L", mentor: "Dra. Hj. Nurhayati, M.Pd", statusKerawanan: "Sedang" },
  { id: "std_02", nisn: "0059128472", name: "Aurelia Zahra", class: "XII-MIPA-1", gender: "P", mentor: "Bambang Setyo Wibowo, S.Pd", statusKerawanan: "Aman" },
  { id: "std_03", nisn: "0071928341", name: "Muhammad Rizky Saputra", class: "X-4", gender: "L", mentor: "Dra. Hj. Nurhayati, M.Pd", statusKerawanan: "Tinggi" },
  { id: "std_04", nisn: "0061928491", name: "Kayla Nabila Putri", class: "XI-5", gender: "P", mentor: "Dra. Hj. Nurhayati, M.Pd", statusKerawanan: "Aman" },
  { id: "std_05", nisn: "0058291048", name: "Fajar Nugroho", class: "XII-IPS-2", gender: "L", mentor: "Bambang Setyo Wibowo, S.Pd", statusKerawanan: "Sedang" },
  { id: "std_06", nisn: "0072910482", name: "Siti Aisyah", class: "X-1", gender: "P", mentor: "Dra. Hj. Nurhayati, M.Pd", statusKerawanan: "Tinggi" },
  { id: "std_07", nisn: "0069182740", name: "Kevin Sanjaya", class: "XI-3", gender: "L", mentor: "Dra. Hj. Nurhayati, M.Pd", statusKerawanan: "Inklusi (ADHD)" },
  { id: "std_08", nisn: "0051928374", name: "Daffa Al-Ghifari", class: "XII-MIPA-3", gender: "L", mentor: "Bambang Setyo Wibowo, S.Pd", statusKerawanan: "Aman" }
];

const DEFAULT_REPORTS = [
  {
    id: "RPT-2026-001",
    nomorSurat: "421.3/BK-081/SMAN1/XI/2026",
    title: "Laporan Pemilihan Mata Pelajaran Pilihan Fase F Kelas XI Kurikulum Merdeka",
    bidang: "belajar",
    targetVerifier: "waka_kurikulum",
    authorId: "usr_bk1",
    authorName: "Dra. Hj. Nurhayati, M.Pd",
    createdAt: "2026-11-10T08:30:00",
    confidentiality: 1, // 1: Umum/Statistik, 2: Manajerial, 3: Sangat Rahasia
    studentTarget: "Seluruh Siswa Kelas XI (Angkatan 2025/2026)",
    studentClass: "Fase F (Kelas XI-1 s.d XI-8)",
    summary: "Hasil pemetaan minat bakat dan rekomendasi penempatan paket mata pelajaran pilihan Fase F untuk semester genap.",
    findings: "Dari 288 siswa kelas XI, 42% memilih rumpun Saintek (Fisika, Kimia, Biologi, Matematika Lanjut), 35% memilih rumpun Soshum (Ekonomi, Sosiologi, Geografi), dan 23% memilih paket lintas minat interdisipliner. Sebanyak 14 siswa memerlukan bimbingan penyesuaian ulang akibat nilai prasyarat akademik yang belum mencukupi.",
    confidentialNotes: "Catatan khusus: 3 siswa mengalami tekanan orang tua dalam memilih prodi Kedokteran padahal minat dominan di Seni Rupa & Desain Komunikasi Visual.",
    recommendations: "1. Membuka 4 rombel paket Saintek Murni, 3 rombel Soshum, dan 2 rombel Campuran.\n2. Mengadakan sesi mediasi konseling karier bersama orang tua bagi 14 siswa yang mengalami ketidaksesuaian minat-kemampuan.",
    status: "approved_waka", // Menunggu disahkan Kepsek
    wakaReview: {
      reviewerId: "usr_kurikulum",
      reviewerName: "Drs. H. Ahmad Fauzi, M.Pd",
      reviewedAt: "2026-11-12T10:15:00",
      decision: "approved",
      notes: "Data pemetaan sudah sangat komprehensif dan sesuai dengan kapasitas ruang kelas serta beban jam mengajar guru mapel. Rekomendasi 9 rombel disetujui untuk diajukan ke Kepala Sekolah."
    },
    kepsekReview: null,
    logs: [
      { timestamp: "2026-11-10T08:30:00", actor: "Dra. Hj. Nurhayati, M.Pd", action: "DRAFT_CREATED", note: "Laporan dibuat oleh Guru BK" },
      { timestamp: "2026-11-10T14:20:00", actor: "Dra. Hj. Nurhayati, M.Pd", action: "SUBMITTED", note: "Laporan diajukan ke Waka Kurikulum" },
      { timestamp: "2026-11-12T10:15:00", actor: "Drs. H. Ahmad Fauzi, M.Pd", action: "APPROVED_WAKA", note: "Disetujui Waka Kurikulum dan diteruskan ke Kepala Sekolah" }
    ]
  },
  {
    id: "RPT-2026-002",
    nomorSurat: "421.3/BK-082/SMAN1/XI/2026",
    title: "Laporan Penanganan Kasus Dugaan Perundungan Siber (Cyberbullying) & Konflik Teman Sebaya Kelas X-4",
    bidang: "sosial",
    targetVerifier: "waka_kesiswaan",
    authorId: "usr_bk1",
    authorName: "Dra. Hj. Nurhayati, M.Pd",
    createdAt: "2026-11-14T09:00:00",
    confidentiality: 2,
    studentTarget: "Muhammad Rizky Saputra & Kelompok Sebaya",
    studentClass: "X-4",
    summary: "Penanganan laporan perundungan siber melalui grup WhatsApp kelas dan postingan media sosial anonim.",
    findings: "Terjadi eskalasi konflik berawal dari ejekan fisik di lapangan basket yang berlanjut ke perundungan siber di grup media sosial. Korban (M. Rizky) mengalami penurunan drastis motivasi hadir ke sekolah selama 4 hari berturut-turut. Tim BK telah memanggil 4 siswa pelaku dan melakukan konseling mediasi tertutup.",
    confidentialNotes: "Pelaku utama (Inisial R dan B) telah menandatangani surat komitmen anti-perundungan di hadapan wali kelas dan orang tua. Korban didampingi konselor untuk terapi pemulihan kepercayaan diri.",
    recommendations: "1. Pengawasan intensif oleh Wali Kelas dan Guru Piket saat jam istirahat.\n2. Waka Kesiswaan menjadwalkan sosialisasi massal bijak bermedia sosial & konsekuensi hukum UU ITE.",
    status: "pending_waka", // Menunggu review Waka Kesiswaan
    wakaReview: null,
    kepsekReview: null,
    logs: [
      { timestamp: "2026-11-14T09:00:00", actor: "Dra. Hj. Nurhayati, M.Pd", action: "DRAFT_CREATED", note: "Laporan dibuat oleh Guru BK" },
      { timestamp: "2026-11-14T11:00:00", actor: "Dra. Hj. Nurhayati, M.Pd", action: "SUBMITTED", note: "Laporan diajukan ke Waka Kesiswaan" }
    ]
  },
  {
    id: "RPT-2026-003",
    nomorSurat: "421.3/BK-079/SMAN1/XI/2026",
    title: "Laporan Bimbingan Karier & Pemetaan Peminatan SNBP / UTBK-SNBT Siswa Kelas XII Angkatan 2026",
    bidang: "karier",
    targetVerifier: "prog_khusus",
    authorId: "usr_bk2",
    authorName: "Bambang Setyo Wibowo, S.Pd, Gr",
    createdAt: "2026-11-02T10:00:00",
    confidentiality: 1,
    studentTarget: "Seluruh Siswa Kelas XII (320 Siswa)",
    studentClass: "XII MIPA & IPS",
    summary: "Pemetaan final kuota *eligible* SNBP 40% dan rencana studi lanjut siswa kelas XII (PTN, Kedinasan, Swasta, Luar Negeri, Kerja).",
    findings: "Sebanyak 128 siswa masuk peringkat kuota eligible 40%. Rasionalisasi pilihan prodi telah dilakukan untuk mencegah penumpukan pilihan pada prodi yang sama di PTN teratas (UI, ITB, UGM). 35 siswa mempersiapkan diri masuk Sekolah Kedinasan (STAN, IPDN, STIS).",
    confidentialNotes: "Peringkat 1 s.d 5 MIPA memilih Teknik Informatika dan Kedokteran dengan rekam jejak sertifikat olimpiade sains nasional tingkat provinsi.",
    recommendations: "1. Menggelar 'EduFair SMAN 1 Teladan' dan simulasi Try Out Akbar UTBK-SNBT bulan depan.\n2. Penyelenggaraan kelas pendampingan intensif tes psikotes dan kesamaptaan untuk peminat kedinasan.",
    status: "approved_kepsek", // Sudah tuntas disahkan Kepala Sekolah
    wakaReview: {
      reviewerId: "usr_khusus",
      reviewerName: "Siti Rohmah, S.Psi, M.Psi",
      reviewedAt: "2026-11-04T13:30:00",
      decision: "approved",
      notes: "Rasionalisasi portofolio SNBP sangat rapi. Kuota eligible sudah disosialisasikan secara transparan dan akuntabel kepada orang tua."
    },
    kepsekReview: {
      reviewerId: "usr_kepsek",
      reviewerName: "Dr. H. Mulyadi, M.Pd",
      reviewedAt: "2026-11-06T15:45:00",
      disposisiNotes: "Sangat baik. Segera koordinasikan dengan panitia komite sekolah untuk anggaran Try Out UTBK dan fasilitas alumni sharing session.",
      eSignatureCode: "ESIGN-KEPSEK-2026-88219A"
    },
    logs: [
      { timestamp: "2026-11-02T10:00:00", actor: "Bambang Setyo Wibowo, S.Pd, Gr", action: "SUBMITTED", note: "Laporan diajukan ke Koordinator Program Khusus / Karier" },
      { timestamp: "2026-11-04T13:30:00", actor: "Siti Rohmah, S.Psi, M.Psi", action: "APPROVED_WAKA", note: "Disetujui dan diteruskan ke Kepala Sekolah" },
      { timestamp: "2026-11-06T15:45:00", actor: "Dr. H. Mulyadi, M.Pd", action: "APPROVED_KEPSEK", note: "Disahkan Kepala Sekolah dengan Lembar Disposisi Resmi" }
    ]
  },
  {
    id: "RPT-2026-004",
    nomorSurat: "421.3/BK-083/SMAN1/XI/2026",
    title: "Laporan Pendampingan Khusus Siswa Inklusi (ADHD & Kesulitan Regulasi Atensi Belajar)",
    bidang: "pribadi",
    targetVerifier: "prog_khusus",
    authorId: "usr_bk1",
    authorName: "Dra. Hj. Nurhayati, M.Pd",
    createdAt: "2026-11-15T11:20:00",
    confidentiality: 3, // Sangat rahasia
    studentTarget: "Kevin Sanjaya",
    studentClass: "XI-3",
    summary: "Evaluasi pelaksanaan program akomodasi pembelajaran individual dan strategi instruksi diferensiasi di kelas.",
    findings: "Siswa menunjukkan peningkatan fokus saat guru mata pelajaran memberikan jeda gerak setiap 25 menit. Namun, masih terdapat kendala pada mata pelajaran yang menuntut pengerjaan tugas teks panjang secara beruntun.",
    confidentialNotes: "[DATA RAHASIA BK]: Siswa rutin mengonsumsi terapi medikasi dokter spesialis anak saraf. Privasi diagnosa dijaga ketat agar tidak menimbulkan stigma negatif dari teman sekelas.",
    recommendations: "1. Pembuatan Modul Ajar Adaptif dengan porsi tugas bertahap (chunking).\n2. Guru pendamping khusus (GPK) mendampingi pada jam ujian tengah semester.",
    status: "revision", // Direvisi
    wakaReview: {
      reviewerId: "usr_khusus",
      reviewerName: "Siti Rohmah, S.Psi, M.Psi",
      reviewedAt: "2026-11-16T14:10:00",
      decision: "revision",
      notes: "Mohon ditambahkan lampiran grafik evaluasi perilaku mingguan dan paraf koordinasi dengan guru mapel Bahasa Indonesia serta Matematika sebelum diajukan ke Kepala Sekolah."
    },
    kepsekReview: null,
    logs: [
      { timestamp: "2026-11-15T11:20:00", actor: "Dra. Hj. Nurhayati, M.Pd", action: "SUBMITTED", note: "Diajukan ke Koordinator Program Inklusi" },
      { timestamp: "2026-11-16T14:10:00", actor: "Siti Rohmah, S.Psi, M.Psi", action: "REQUEST_REVISION", note: "Diminta melengkapi lampiran grafik evaluasi perilaku" }
    ]
  },
  {
    id: "RPT-2026-005",
    nomorSurat: "421.3/BK-085/SMAN1/XI/2026",
    title: "Laporan Pelaksanaan Home Visit (Kunjungan Rumah) & Penanganan Siswa Terancam Putus Sekolah",
    bidang: "sosial",
    targetVerifier: "waka_kesiswaan",
    authorId: "usr_bk1",
    authorName: "Dra. Hj. Nurhayati, M.Pd",
    createdAt: "2026-11-17T13:45:00",
    confidentiality: 2,
    studentTarget: "Siti Aisyah",
    studentClass: "X-1",
    summary: "Hasil kunjungan rumah bersama wali kelas terkait ketidakhadiran 11 hari tanpa keterangan dalam 1 bulan.",
    findings: "Orang tua siswa mengalami kesulitan ekonomi berat akibat pemutusan hubungan kerja, dan siswa diminta bekerja menjaga adik balita serta membantu berjualan di pasar tradisional. Siswa sebenarnya memiliki semangat tinggi untuk tetap bersekolah.",
    confidentialNotes: "Keluarga belum terdaftar dalam DTKS / KIP Aspirasi karena kendala administrasi kependudukan.",
    recommendations: "1. Pengajuan beasiswa afirmasi Bantuan Operasional Sekolah Daerah (BOSDa) dan program infak komite sekolah.\n2. Pemberian toleransi penugasan asinkron untuk mengejar ketertinggalan nilai akademik.",
    status: "draft", // Masih draft Guru BK
    wakaReview: null,
    kepsekReview: null,
    logs: [
      { timestamp: "2026-11-17T13:45:00", actor: "Dra. Hj. Nurhayati, M.Pd", action: "DRAFT_CREATED", note: "Draft hasil kunjungan rumah disimpan" }
    ]
  }
];

const INITIAL_AUDIT_LOGS = [
  { id: "log_1", timestamp: "2026-11-19T09:15:22", user: "admin", action: "LOGIN", details: "Super Admin masuk ke sistem dari IP 192.168.1.5" },
  { id: "log_2", timestamp: "2026-11-18T14:32:00", user: "kepsek", action: "DISPOSISI", details: "Kepala Sekolah mengesahkan Laporan RPT-2026-003" },
  { id: "log_3", timestamp: "2026-11-16T14:10:00", user: "prog.khusus", action: "REVISION_REQUESTED", details: "Koordinator Program Khusus mengembalikan RPT-2026-004 untuk revisi" },
  { id: "log_4", timestamp: "2026-11-12T10:15:00", user: "waka.kurikulum", action: "APPROVAL", details: "Waka Kurikulum menyetujui Laporan RPT-2026-001" }
];
