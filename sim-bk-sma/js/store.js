/**
 * SIM-BK SMA - Local Storage & State Management Engine
 */

const STORAGE_KEYS = {
  USERS: "simbk_users_v1",
  STUDENTS: "simbk_students_v1",
  REPORTS: "simbk_reports_v1",
  LOGS: "simbk_logs_v1",
  CURRENT_USER: "simbk_current_user_v1"
};

class BKStore {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(DEFAULT_REPORTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
  }

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(DEFAULT_REPORTS));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    return true;
  }

  // --- Auth & Session ---
  getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
  }

  getCurrentUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userStr) return null;
    return JSON.parse(userStr);
  }

  login(username, password) {
    const users = this.getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      return { success: false, message: "Username tidak ditemukan." };
    }
    if (user.password !== password) {
      return { success: false, message: "Password salah." };
    }

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.addLog(user.username, "LOGIN", `Pengguna login sebagai ${user.roleLabel}`);
    return { success: true, user };
  }

  quickSwitchUser(username) {
    const users = this.getUsers();
    const user = users.find(u => u.username === username);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      this.addLog(user.username, "SWITCH_ROLE", `Beralih peran cepat menjadi ${user.roleLabel}`);
      return user;
    }
    return null;
  }

  logout() {
    const user = this.getCurrentUser();
    if (user) {
      this.addLog(user.username, "LOGOUT", "Pengguna keluar dari aplikasi.");
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  updateCurrentUserProfile(profileData) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index === -1) return null;

    if (profileData.avatar) users[index].avatar = profileData.avatar;
    if (profileData.name) users[index].name = profileData.name;
    if (profileData.password) users[index].password = profileData.password;
    if (profileData.nip) users[index].nip = profileData.nip;

    this.saveUsers(users);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[index]));
    this.addLog(users[index].username, "UPDATE_PROFILE", "Memperbarui foto profil dan informasi akun");
    return users[index];
  }

  // --- Users Master Data CRUD ---
  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  addUser(userData) {
    const users = this.getUsers();
    const newUser = {
      id: "usr_" + Date.now(),
      username: userData.username.toLowerCase(),
      password: userData.password || "password",
      name: userData.name,
      nip: userData.nip || "-",
      role: userData.role,
      roleLabel: this.getRoleLabel(userData.role),
      badgeColor: this.getRoleBadgeColor(userData.role),
      avatar: userData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150`,
      department: userData.department || "Tenaga Pendidik"
    };
    users.push(newUser);
    this.saveUsers(users);
    this.addLog("admin", "ADD_USER", `Menambahkan user baru: ${newUser.name} (${newUser.roleLabel})`);
    return newUser;
  }

  updateUser(id, userData) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    const u = users[index];
    u.name = userData.name || u.name;
    u.username = userData.username ? userData.username.toLowerCase() : u.username;
    if (userData.password) u.password = userData.password;
    u.nip = userData.nip || u.nip;
    if (userData.role) {
      u.role = userData.role;
      u.roleLabel = this.getRoleLabel(userData.role);
      u.badgeColor = this.getRoleBadgeColor(userData.role);
    }
    u.department = userData.department || u.department;
    users[index] = u;
    this.saveUsers(users);
    this.addLog("admin", "UPDATE_USER", `Memperbarui user: ${u.name}`);
    return u;
  }

  deleteUser(id) {
    let users = this.getUsers();
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete && userToDelete.role === "super_admin") {
      return { success: false, message: "Akun Super Admin utama tidak boleh dihapus demi keamanan sistem." };
    }
    users = users.filter(u => u.id !== id);
    this.saveUsers(users);
    this.addLog("admin", "DELETE_USER", `Menghapus user id: ${id}`);
    return { success: true };
  }

  getRoleLabel(role) {
    switch (role) {
      case "super_admin": return "Super Admin";
      case "guru_bk": return "Guru BK / Konselor";
      case "waka_kurikulum": return "Waka Kurikulum";
      case "waka_kesiswaan": return "Waka Kesiswaan";
      case "prog_khusus": return "Koordinator Program Khusus";
      case "kepala_sekolah": return "Kepala Sekolah";
      default: return "Pengguna";
    }
  }

  getRoleBadgeColor(role) {
    switch (role) {
      case "super_admin": return "bg-purple-100 text-purple-800 border-purple-200";
      case "guru_bk": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "waka_kurikulum": return "bg-blue-100 text-blue-800 border-blue-200";
      case "waka_kesiswaan": return "bg-amber-100 text-amber-800 border-amber-200";
      case "prog_khusus": return "bg-rose-100 text-rose-800 border-rose-200";
      case "kepala_sekolah": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  }

  // --- Students Master Data ---
  getStudents() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || "[]");
  }

  saveStudents(students) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }

  addStudent(studentData) {
    const students = this.getStudents();
    const newStudent = {
      id: "std_" + Date.now(),
      nisn: studentData.nisn,
      name: studentData.name,
      class: studentData.class,
      gender: studentData.gender || "L",
      mentor: studentData.mentor || "Dra. Hj. Nurhayati, M.Pd",
      statusKerawanan: studentData.statusKerawanan || "Aman"
    };
    students.unshift(newStudent);
    this.saveStudents(students);
    const user = this.getCurrentUser();
    this.addLog(user ? user.username : "bk", "ADD_STUDENT", `Menambahkan data siswa: ${newStudent.name} (${newStudent.class})`);
    return newStudent;
  }

  updateStudent(id, studentData) {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return null;
    const s = students[index];
    s.nisn = studentData.nisn || s.nisn;
    s.name = studentData.name || s.name;
    s.class = studentData.class || s.class;
    s.gender = studentData.gender || s.gender;
    s.mentor = studentData.mentor || s.mentor;
    s.statusKerawanan = studentData.statusKerawanan || s.statusKerawanan;
    students[index] = s;
    this.saveStudents(students);
    const user = this.getCurrentUser();
    this.addLog(user ? user.username : "bk", "UPDATE_STUDENT", `Memperbarui data siswa: ${s.name}`);
    return s;
  }

  deleteStudent(id) {
    let students = this.getStudents();
    students = students.filter(s => s.id !== id);
    this.saveStudents(students);
    const user = this.getCurrentUser();
    this.addLog(user ? user.username : "bk", "DELETE_STUDENT", `Menghapus data siswa id: ${id}`);
    return true;
  }

  // --- Reports CRUD & Workflow ---
  getReports() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || "[]");
  }

  saveReports(reports) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }

  getReportById(id) {
    const reports = this.getReports();
    return reports.find(r => r.id === id);
  }

  createReport(data) {
    const reports = this.getReports();
    const user = this.getCurrentUser();
    const newId = "RPT-" + new Date().getFullYear() + "-" + String(reports.length + 1).padStart(3, "0");
    const nomorSurat = `421.3/BK-${String(reports.length + 80).padStart(3, "0")}/SMAN1/XI/${new Date().getFullYear()}`;

    const newReport = {
      id: newId,
      nomorSurat,
      title: data.title,
      bidang: data.bidang, // 'belajar' | 'pribadi' | 'sosial' | 'karier'
      targetVerifier: data.targetVerifier, // 'waka_kurikulum' | 'waka_kesiswaan' | 'prog_khusus'
      authorId: user ? user.id : "usr_bk1",
      authorName: user ? user.name : "Guru BK",
      createdAt: new Date().toISOString(),
      confidentiality: parseInt(data.confidentiality || 1),
      studentTarget: data.studentTarget || "Umum",
      studentClass: data.studentClass || "Semua Kelas",
      summary: data.summary || "",
      findings: data.findings || "",
      confidentialNotes: data.confidentialNotes || "",
      recommendations: data.recommendations || "",
      status: data.isSubmitDirect ? "pending_waka" : "draft",
      wakaReview: null,
      kepsekReview: null,
      logs: [
        {
          timestamp: new Date().toISOString(),
          actor: user ? user.name : "Guru BK",
          action: data.isSubmitDirect ? "SUBMITTED" : "DRAFT_CREATED",
          note: data.isSubmitDirect ? `Diajukan langsung ke ${this.getVerifierLabel(data.targetVerifier)}` : "Disimpan sebagai draft"
        }
      ]
    };

    reports.unshift(newReport);
    this.saveReports(reports);
    this.addLog(user ? user.username : "bk", "CREATE_REPORT", `Membuat laporan ${newId}: ${data.title}`);
    return newReport;
  }

  updateReport(id, data) {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) return null;

    const user = this.getCurrentUser();
    const report = reports[index];

    // Check if submitting from draft or revision
    const isNowSubmitting = data.submitAction === true;
    let newStatus = report.status;
    if (isNowSubmitting) {
      newStatus = "pending_waka";
    }

    report.title = data.title || report.title;
    report.bidang = data.bidang || report.bidang;
    report.targetVerifier = data.targetVerifier || report.targetVerifier;
    report.confidentiality = parseInt(data.confidentiality || report.confidentiality);
    report.studentTarget = data.studentTarget || report.studentTarget;
    report.studentClass = data.studentClass || report.studentClass;
    report.summary = data.summary || report.summary;
    report.findings = data.findings || report.findings;
    report.confidentialNotes = data.confidentialNotes !== undefined ? data.confidentialNotes : report.confidentialNotes;
    report.recommendations = data.recommendations || report.recommendations;
    report.status = newStatus;

    report.logs.push({
      timestamp: new Date().toISOString(),
      actor: user ? user.name : "Guru BK",
      action: isNowSubmitting ? "RESUBMITTED" : "UPDATED",
      note: isNowSubmitting ? `Diajukan ulang ke ${this.getVerifierLabel(report.targetVerifier)}` : "Memperbarui isi laporan"
    });

    reports[index] = report;
    this.saveReports(reports);
    this.addLog(user ? user.username : "bk", "UPDATE_REPORT", `Mengubah laporan ${id}`);
    return report;
  }

  // Submit report from draft status
  submitReport(id) {
    const reports = this.getReports();
    const report = reports.find(r => r.id === id);
    if (!report) return false;

    const user = this.getCurrentUser();
    report.status = "pending_waka";
    report.logs.push({
      timestamp: new Date().toISOString(),
      actor: user ? user.name : "Guru BK",
      action: "SUBMITTED",
      note: `Laporan diajukan ke ${this.getVerifierLabel(report.targetVerifier)}`
    });

    this.saveReports(reports);
    this.addLog(user ? user.username : "bk", "SUBMIT_REPORT", `Mengajukan laporan ${id} ke verifikator`);
    return true;
  }

  // Waka Review Action (Approve or Revision)
  reviewReportWaka(id, decision, notes) {
    const reports = this.getReports();
    const report = reports.find(r => r.id === id);
    if (!report) return false;

    const user = this.getCurrentUser();
    const isApproved = decision === "approved";

    report.status = isApproved ? "approved_waka" : "revision";
    report.wakaReview = {
      reviewerId: user ? user.id : "usr_waka",
      reviewerName: user ? user.name : "Verifikator",
      reviewedAt: new Date().toISOString(),
      decision,
      notes: notes || (isApproved ? "Disetujui untuk diteruskan ke Kepala Sekolah." : "Perlu perbaikan.")
    };

    report.logs.push({
      timestamp: new Date().toISOString(),
      actor: user ? user.name : "Verifikator",
      action: isApproved ? "APPROVED_WAKA" : "REQUEST_REVISION",
      note: isApproved ? `Disetujui oleh ${user ? user.roleLabel : 'Waka'} dan diteruskan ke Kepala Sekolah.` : `Diminta revisi: ${notes}`
    });

    this.saveReports(reports);
    this.addLog(user ? user.username : "waka", isApproved ? "APPROVE_WAKA" : "REVISE_WAKA", `${isApproved ? 'Menyetujui' : 'Meminta revisi'} laporan ${id}`);
    return true;
  }

  // Kepala Sekolah Disposisi & Pengesahan
  disposisiKepsek(id, disposisiNotes) {
    const reports = this.getReports();
    const report = reports.find(r => r.id === id);
    if (!report) return false;

    const user = this.getCurrentUser();
    const eSig = "ESIGN-KEPSEK-" + new Date().getFullYear() + "-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    report.status = "approved_kepsek";
    report.kepsekReview = {
      reviewerId: user ? user.id : "usr_kepsek",
      reviewerName: user ? user.name : "Dr. H. Mulyadi, M.Pd",
      reviewedAt: new Date().toISOString(),
      disposisiNotes: disposisiNotes || "Telah diverifikasi dan disetujui. Tindak lanjuti sesuai rekomendasi.",
      eSignatureCode: eSig
    };

    report.logs.push({
      timestamp: new Date().toISOString(),
      actor: user ? user.name : "Kepala Sekolah",
      action: "APPROVED_KEPSEK",
      note: `Disahkan Kepala Sekolah dengan Lembar Disposisi Resmi (${eSig})`
    });

    this.saveReports(reports);
    this.addLog(user ? user.username : "kepsek", "DISPOSISI_KEPSEK", `Mengesahkan laporan ${id} dan menerbitkan disposisi resmi.`);
    return true;
  }

  deleteReport(id) {
    let reports = this.getReports();
    reports = reports.filter(r => r.id !== id);
    this.saveReports(reports);
    const user = this.getCurrentUser();
    this.addLog(user ? user.username : "admin", "DELETE_REPORT", `Menghapus laporan ${id}`);
    return true;
  }

  // --- Masking Kerahasiaan BK ---
  maskReportPrivacy(report, user) {
    if (!report) return null;
    const cloned = JSON.parse(JSON.stringify(report));

    // Jika level kerahasiaan 3 (Sangat Rahasia)
    if (cloned.confidentiality === 3) {
      const isAuthor = user && user.id === cloned.authorId;
      const isGuruBK = user && user.role === "guru_bk";
      const isSuperAdmin = user && user.role === "super_admin";

      if (!isAuthor && !isGuruBK && !isSuperAdmin) {
        cloned.confidentialNotes = "🔒 [CATATAN SANGAT RAHASIA - TERLINDUNGI ASAS KERAHASIAAN BK: Hanya dapat dibuka oleh Guru BK Pengampu dan Konselor Berwenang]";
      }
    }
    return cloned;
  }

  // --- Helper Labels ---
  getVerifierLabel(targetVerifier) {
    switch (targetVerifier) {
      case "waka_kurikulum": return "Waka Kurikulum";
      case "waka_kesiswaan": return "Waka Kesiswaan";
      case "prog_khusus": return "Koordinator Program Khusus / PPKSP";
      default: return "Verifikator Terkait";
    }
  }

  getStatusBadge(status) {
    switch (status) {
      case "draft":
        return { label: "Draft Guru BK", class: "bg-slate-100 text-slate-700 border-slate-300", icon: "fa-pencil" };
      case "pending_waka":
        return { label: "Menunggu Review Waka", class: "bg-amber-100 text-amber-800 border-amber-300", icon: "fa-clock" };
      case "revision":
        return { label: "Perlu Revisi", class: "bg-rose-100 text-rose-800 border-rose-300", icon: "fa-rotate-left" };
      case "approved_waka":
        return { label: "Disetujui Waka (Menunggu Kepsek)", class: "bg-blue-100 text-blue-800 border-blue-300", icon: "fa-check" };
      case "approved_kepsek":
        return { label: "Disahkan Kepala Sekolah", class: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: "fa-certificate" };
      default:
        return { label: status, class: "bg-gray-100 text-gray-800 border-gray-300", icon: "fa-circle-info" };
    }
  }

  // --- Audit Logs ---
  getLogs() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || "[]");
  }

  addLog(username, action, details) {
    const logs = this.getLogs();
    logs.unshift({
      id: "log_" + Date.now(),
      timestamp: new Date().toISOString(),
      user: username,
      action,
      details
    });
    // Keep max 100 logs
    if (logs.length > 100) logs.pop();
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  }
}

// Global store instance
const store = new BKStore();
