/**
 * SIM-BK SMA - Main Application Logic
 * SMAN 1 TELADAN
 */

let currentView = "dashboard";
let currentChartInstances = {};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initApp();
  setupEventListeners();
});

function initApp() {
  const user = store.getCurrentUser();
  if (!user) {
    showLoginView();
  } else {
    showMainView(user);
  }
}

function showLoginView() {
  document.getElementById("login-view").classList.remove("hidden");
  document.getElementById("main-view").classList.add("hidden");
}

function showMainView(user) {
  document.getElementById("login-view").classList.add("hidden");
  document.getElementById("main-view").classList.remove("hidden");

  // Update header and sidebar with current user info
  updateUserInterface(user);

  // Render initial view
  navigateTo(currentView);
}

function updateUserInterface(user) {
  // Sidebar user info
  document.getElementById("sidebar-user-name").textContent = user.name;
  document.getElementById("sidebar-user-role").textContent = user.roleLabel;
  document.getElementById("sidebar-user-avatar").src = user.avatar;

  // Header user avatar & badge
  const headerAvatar = document.getElementById("header-user-avatar");
  if (headerAvatar) headerAvatar.src = user.avatar;

  const headerBadge = document.getElementById("header-user-badge");
  headerBadge.textContent = user.roleLabel;
  headerBadge.className = `px-3 py-1 rounded-full text-xs font-bold border ${user.badgeColor}`;

  // Admin menu visibility
  const adminSection = document.getElementById("admin-menu-section");
  if (user.role === "super_admin") {
    adminSection.classList.remove("hidden");
  } else {
    adminSection.classList.add("hidden");
  }

  // Guru BK "Buat Laporan" button visibility in sidebar
  const btnCreateReport = document.getElementById("nav-create-report");
  if (user.role === "guru_bk" || user.role === "super_admin") {
    btnCreateReport.classList.remove("hidden");
  } else {
    btnCreateReport.classList.add("hidden");
  }

  // Update Inbox label based on role
  const labelInbox = document.getElementById("label-inbox-menu");
  if (user.role === "kepala_sekolah") {
    labelInbox.textContent = "Meja Disposisi Kepsek";
  } else if (user.role.startsWith("waka") || user.role === "prog_khusus") {
    labelInbox.textContent = "Meja Verifikasi Waka";
  } else if (user.role === "guru_bk") {
    labelInbox.textContent = "Revisi & Catatan Waka";
  } else {
    labelInbox.textContent = "Antrean Verifikasi";
  }

  // Update Badges
  updateNavigationBadges();
}

function updateNavigationBadges() {
  const reports = store.getReports();
  const user = store.getCurrentUser();

  // Total reports
  document.getElementById("badge-total-reports").textContent = reports.length;

  // Pending inbox badge
  let pendingCount = 0;
  if (!user) return;

  if (user.role === "waka_kurikulum") {
    pendingCount = reports.filter(r => r.targetVerifier === "waka_kurikulum" && r.status === "pending_waka").length;
  } else if (user.role === "waka_kesiswaan") {
    pendingCount = reports.filter(r => r.targetVerifier === "waka_kesiswaan" && r.status === "pending_waka").length;
  } else if (user.role === "prog_khusus") {
    pendingCount = reports.filter(r => r.targetVerifier === "prog_khusus" && r.status === "pending_waka").length;
  } else if (user.role === "kepala_sekolah") {
    pendingCount = reports.filter(r => r.status === "approved_waka").length;
  } else if (user.role === "guru_bk") {
    pendingCount = reports.filter(r => r.authorId === user.id && r.status === "revision").length;
  } else if (user.role === "super_admin") {
    pendingCount = reports.filter(r => r.status === "pending_waka" || r.status === "approved_waka").length;
  }

  const badgeInbox = document.getElementById("badge-pending-inbox");
  badgeInbox.textContent = pendingCount;
  if (pendingCount > 0) {
    badgeInbox.className = "text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-pulse";
  } else {
    badgeInbox.className = "text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal";
  }
}

// --- Navigation Engine ---
function navigateTo(viewName) {
  currentView = viewName;
  const container = document.getElementById("view-container");
  const user = store.getCurrentUser();

  // Reset active menu styles
  document.querySelectorAll("#app-sidebar nav button").forEach(btn => {
    btn.classList.remove("bg-teal-700/80", "text-white");
    btn.classList.add("text-slate-300");
  });

  const activeBtn = document.getElementById(`nav-${viewName}`);
  if (activeBtn) {
    activeBtn.classList.add("bg-teal-700/80", "text-white");
    activeBtn.classList.remove("text-slate-300");
  }

  // Titles
  const pageTitle = document.getElementById("page-title");
  const pageSubtitle = document.getElementById("page-subtitle");

  switch (viewName) {
    case "dashboard":
      pageTitle.textContent = "Dashboard & Statistik Layanan BK";
      pageSubtitle.textContent = `Ringkasan akuntabilitas kinerja BK berjenjang - Tahun Pelajaran 2026/2027 (${user.roleLabel})`;
      renderDashboardView(container, user);
      break;

    case "reports":
      pageTitle.textContent = "Direktori Semua Laporan Layanan BK";
      pageSubtitle.textContent = "Daftar seluruh laporan bimbingan pribadi, sosial, belajar, dan karier sesuai Permendikbud 111/2014";
      renderReportsView(container, user);
      break;

    case "inbox":
      if (user.role === "kepala_sekolah") {
        pageTitle.textContent = "Meja Disposisi & Pengesahan Kepala Sekolah";
        pageSubtitle.textContent = "Laporan yang telah lolos verifikasi Waka dan memerlukan instruksi kebijakan pimpinan";
      } else if (user.role.startsWith("waka") || user.role === "prog_khusus") {
        pageTitle.textContent = `Meja Verifikasi ${user.roleLabel}`;
        pageSubtitle.textContent = "Laporan dari Guru BK yang menunggu penelaahan dan persetujuan bertingkat";
      } else if (user.role === "guru_bk") {
        pageTitle.textContent = "Daftar Laporan Memerlukan Perbaikan (Revisi)";
        pageSubtitle.textContent = "Laporan yang dikembalikan oleh Verifikator Waka untuk dilengkapi";
      } else {
        pageTitle.textContent = "Antrean Verifikasi Seluruh Sekolah";
        pageSubtitle.textContent = "Monitoring status pengajuan berkas bertingkat";
      }
      renderInboxView(container, user);
      break;

    case "students":
      pageTitle.textContent = "Data Asuh & Pemetaan Kerawanan Siswa";
      pageSubtitle.textContent = "Distribusi konseli asuh guru BK dan status deteksi dini kerawanan";
      renderStudentsView(container, user);
      break;

    case "users":
      pageTitle.textContent = "Kelola Akun & Hak Akses Pengguna";
      pageSubtitle.textContent = "Manajemen peran berjenjang: Guru BK, Waka, Program Khusus, dan Kepala Sekolah";
      renderUsersView(container, user);
      break;

    case "logs":
      pageTitle.textContent = "Audit Trail & Rekam Jejak Sistem";
      pageSubtitle.textContent = "Catatan kronologis aktivitas login, pengajuan, review, dan disposisi";
      renderLogsView(container, user);
      break;

    default:
      renderDashboardView(container, user);
  }

  updateNavigationBadges();
}

// ==========================================
// 1. VIEW: DASHBOARD
// ==========================================
function renderDashboardView(container, user) {
  const reports = store.getReports();
  const students = store.getStudents();

  // Metric Computations
  const totalReports = reports.length;
  const approvedKepsek = reports.filter(r => r.status === "approved_kepsek").length;
  const inProgress = reports.filter(r => r.status === "pending_waka" || r.status === "approved_waka").length;
  const needRevision = reports.filter(r => r.status === "revision").length;

  // Bidang Breakdown
  const countBelajar = reports.filter(r => r.bidang === "belajar").length;
  const countPribadi = reports.filter(r => r.bidang === "pribadi").length;
  const countSosial = reports.filter(r => r.bidang === "sosial").length;
  const countKarier = reports.filter(r => r.bidang === "karier").length;

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Top Alert Context Bar -->
      <div class="bg-gradient-to-r from-teal-800 to-teal-900 rounded-xl p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-teal-700/80 flex items-center justify-center text-teal-200 text-lg shrink-0">
            <i class="fa-solid fa-bell"></i>
          </div>
          <div>
            <div class="font-bold text-sm">Selamat Datang, ${user.name}!</div>
            <div class="text-xs text-teal-200">Anda saat ini login dengan hak akses: <strong class="underline">${user.roleLabel}</strong>.</div>
          </div>
        </div>
        <div class="flex gap-2 text-xs">
          ${(user.role === "guru_bk" || user.role === "super_admin") ? `
            <button onclick="openModalCreateReport()" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow transition">
              <i class="fa-solid fa-plus"></i> Buat Laporan BK
            </button>
          ` : ""}
          <button onclick="navigateTo('inbox')" class="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold flex items-center gap-1.5 transition">
            <i class="fa-solid fa-inbox"></i> Cek Meja Tugas
          </button>
        </div>
      </div>

      <!-- 4 Quick Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Laporan Masuk</span>
            <div class="text-2xl font-black text-slate-900 mt-1">${totalReports}</div>
            <span class="text-[11px] text-teal-600 font-medium">Dokumen Tupoksi BK</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl font-bold">
            <i class="fa-solid fa-folder-open"></i>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Disahkan Kepala Sekolah</span>
            <div class="text-2xl font-black text-emerald-700 mt-1">${approvedKepsek}</div>
            <span class="text-[11px] text-emerald-600 font-medium"><i class="fa-solid fa-certificate"></i> Ber-Disposisi Sah</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
            <i class="fa-solid fa-signature"></i>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dalam Alur Verifikasi</span>
            <div class="text-2xl font-black text-amber-700 mt-1">${inProgress}</div>
            <span class="text-[11px] text-amber-600 font-medium">Review Waka / Menunggu Kepsek</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
            <i class="fa-solid fa-hourglass-half"></i>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Perlu Revisi Guru BK</span>
            <div class="text-2xl font-black text-rose-700 mt-1">${needRevision}</div>
            <span class="text-[11px] text-rose-600 font-medium">Catatan Balik Waka</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-bold">
            <i class="fa-solid fa-rotate-left"></i>
          </div>
        </div>

      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Chart 1: Distribusi 4 Bidang Layanan BK -->
        <div class="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-slate-900 text-sm">Distribusi 4 Bidang Layanan BK</h3>
              <p class="text-xs text-slate-500">Berdasarkan Permendikbud 111/2014</p>
            </div>
            <span class="text-xs px-2.5 py-1 bg-teal-50 text-teal-700 font-semibold rounded-lg">4 Bidang</span>
          </div>
          <div class="h-64 flex items-center justify-center">
            <canvas id="chart-bidang"></canvas>
          </div>
          <div class="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100 text-center text-xs mt-2">
            <div>
              <span class="text-slate-500 block text-[10px]">Belajar</span>
              <strong class="text-blue-700">${countBelajar}</strong>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">Pribadi</span>
              <strong class="text-rose-700">${countPribadi}</strong>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">Sosial</span>
              <strong class="text-amber-700">${countSosial}</strong>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">Karier</span>
              <strong class="text-teal-700">${countKarier}</strong>
            </div>
          </div>
        </div>

        <!-- Chart 2: Status Alur Verifikasi Bertingkat -->
        <div class="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-slate-900 text-sm">Status Alur Berjenjang (Workflow Status)</h3>
              <p class="text-xs text-slate-500">Progres pengesahan dari Guru BK hingga Kepala Sekolah</p>
            </div>
            <span class="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-lg">Realtime</span>
          </div>
          <div class="h-64 flex items-center justify-center">
            <canvas id="chart-status"></canvas>
          </div>
          <div class="flex items-center justify-around pt-4 border-t border-slate-100 text-center text-xs mt-2">
            <div>
              <span class="text-slate-500 block text-[10px]">Draft BK</span>
              <strong class="text-slate-700">${reports.filter(r => r.status === 'draft').length}</strong>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">Review Waka</span>
              <strong class="text-amber-600">${reports.filter(r => r.status === 'pending_waka').length}</strong>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">Meja Kepsek</span>
              <strong class="text-blue-600">${reports.filter(r => r.status === 'approved_waka').length}</strong>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">Disahkan</span>
              <strong class="text-emerald-600">${approvedKepsek}</strong>
            </div>
          </div>
        </div>

      </div>

      <!-- Recent Reports Table Preview -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-slate-900 text-sm">Laporan Terbaru Memerlukan Tindakan</h3>
            <p class="text-xs text-slate-500">Dokumen layanan BK yang baru diperbarui atau menunggu penelaahan</p>
          </div>
          <button onclick="navigateTo('reports')" class="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1">
            Lihat Semua <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th class="p-3.5">No. Dokumen</th>
                <th class="p-3.5">Judul Laporan & Sasaran</th>
                <th class="p-3.5">Bidang</th>
                <th class="p-3.5">Verifikator Tujuan</th>
                <th class="p-3.5">Status Alur</th>
                <th class="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${reports.slice(0, 5).map(report => renderReportTableRow(report, user)).join("")}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  // Initialize Charts
  initDashboardCharts(countBelajar, countPribadi, countSosial, countKarier, reports);
}

function initDashboardCharts(belajar, pribadi, sosial, karier, reports) {
  // Destroy existing charts to prevent canvas memory leaks
  if (currentChartInstances.bidang) currentChartInstances.bidang.destroy();
  if (currentChartInstances.status) currentChartInstances.status.destroy();

  // Chart 1: Bidang
  const ctxBidang = document.getElementById("chart-bidang")?.getContext("2d");
  if (ctxBidang) {
    currentChartInstances.bidang = new Chart(ctxBidang, {
      type: "doughnut",
      data: {
        labels: ["Belajar", "Pribadi", "Sosial", "Karier"],
        datasets: [{
          data: [belajar, pribadi, sosial, karier],
          backgroundColor: ["#3b82f6", "#f43f5e", "#f59e0b", "#0f766e"],
          borderWidth: 2,
          borderColor: "#ffffff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } }
        },
        cutout: "65%"
      }
    });
  }

  // Chart 2: Status Workflow
  const ctxStatus = document.getElementById("chart-status")?.getContext("2d");
  if (ctxStatus) {
    const drafts = reports.filter(r => r.status === "draft").length;
    const pendingWaka = reports.filter(r => r.status === "pending_waka").length;
    const revisions = reports.filter(r => r.status === "revision").length;
    const approvedWaka = reports.filter(r => r.status === "approved_waka").length;
    const approvedKepsek = reports.filter(r => r.status === "approved_kepsek").length;

    currentChartInstances.status = new Chart(ctxStatus, {
      type: "bar",
      data: {
        labels: ["Draft", "Review Waka", "Revisi", "Meja Kepsek", "Disahkan"],
        datasets: [{
          label: "Jumlah Dokumen",
          data: [drafts, pendingWaka, revisions, approvedWaka, approvedKepsek],
          backgroundColor: ["#94a3b8", "#f59e0b", "#f43f5e", "#3b82f6", "#10b981"],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } } },
          x: { ticks: { font: { size: 10 } } }
        }
      }
    });
  }
}

// ==========================================
// 2. VIEW: ALL REPORTS
// ==========================================
function renderReportsView(container, user) {
  const reports = store.getReports();

  container.innerHTML = `
    <div class="space-y-4">
      
      <!-- Filter Bar -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div class="flex-1 w-full md:w-auto relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <i class="fa-solid fa-magnifying-glass"></i>
          </span>
          <input type="text" id="search-reports" onkeyup="filterReportsTable()" placeholder="Cari judul laporan, siswa, atau nomor surat..."
            class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600">
        </div>

        <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select id="filter-bidang" onchange="filterReportsTable()" class="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none">
            <option value="all">Semua Bidang</option>
            <option value="belajar">Belajar</option>
            <option value="pribadi">Pribadi</option>
            <option value="sosial">Sosial</option>
            <option value="karier">Karier</option>
          </select>

          <select id="filter-status" onchange="filterReportsTable()" class="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none">
            <option value="all">Semua Status</option>
            <option value="draft">Draft Guru BK</option>
            <option value="pending_waka">Menunggu Review Waka</option>
            <option value="revision">Perlu Revisi</option>
            <option value="approved_waka">Disetujui Waka</option>
            <option value="approved_kepsek">Disahkan Kepala Sekolah</option>
          </select>

          ${(user.role === "guru_bk" || user.role === "super_admin") ? `
            <button onclick="openModalCreateReport()" class="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition">
              <i class="fa-solid fa-plus"></i> Buat Laporan
            </button>
          ` : ""}
        </div>
      </div>

      <!-- Reports Table -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left" id="table-all-reports">
            <thead class="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th class="p-3.5">Nomor Surat</th>
                <th class="p-3.5">Judul Laporan & Sasaran</th>
                <th class="p-3.5">Bidang BK</th>
                <th class="p-3.5">Verifikator Alur</th>
                <th class="p-3.5">Kerahasiaan</th>
                <th class="p-3.5">Status</th>
                <th class="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100" id="reports-table-body">
              ${reports.map(report => renderReportTableRow(report, user, true)).join("")}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function renderReportTableRow(report, user, showConfidentialBadge = false) {
  const badge = store.getStatusBadge(report.status);
  const verifierLabel = store.getVerifierLabel(report.targetVerifier);
  
  // Bidang color tags
  let bidangTag = "bg-blue-50 text-blue-700 border-blue-200";
  if (report.bidang === "pribadi") bidangTag = "bg-rose-50 text-rose-700 border-rose-200";
  if (report.bidang === "sosial") bidangTag = "bg-amber-50 text-amber-700 border-amber-200";
  if (report.bidang === "karier") bidangTag = "bg-teal-50 text-teal-700 border-teal-200";

  return `
    <tr class="hover:bg-slate-50/80 transition" data-bidang="${report.bidang}" data-status="${report.status}">
      <td class="p-3.5 font-mono text-[11px] text-slate-600 whitespace-nowrap">
        ${report.nomorSurat}
        <div class="text-[10px] text-slate-400 font-sans">${new Date(report.createdAt).toLocaleDateString('id-ID')}</div>
      </td>
      <td class="p-3.5">
        <div class="font-bold text-slate-900 hover:text-teal-700 cursor-pointer" onclick="openDetailReport('${report.id}')">
          ${report.title}
        </div>
        <div class="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
          <span><i class="fa-regular fa-user text-slate-400"></i> ${report.studentTarget}</span>
          ${report.studentClass ? `<span class="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono text-[10px]">${report.studentClass}</span>` : ""}
        </div>
      </td>
      <td class="p-3.5 whitespace-nowrap">
        <span class="px-2.5 py-1 rounded-md text-[11px] font-semibold border uppercase ${bidangTag}">
          ${report.bidang}
        </span>
      </td>
      <td class="p-3.5 whitespace-nowrap text-slate-700 font-medium">
        <div class="flex items-center gap-1.5">
          <i class="fa-solid fa-route text-teal-600 text-[10px]"></i>
          <span>${verifierLabel}</span>
        </div>
      </td>
      ${showConfidentialBadge ? `
        <td class="p-3.5 whitespace-nowrap">
          ${report.confidentiality === 3 ? `
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300" title="Hanya Guru BK yang dapat melihat verbatim">
              <i class="fa-solid fa-lock"></i> Tingkat 3
            </span>
          ` : report.confidentiality === 2 ? `
            <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
              Tingkat 2 (Manajerial)
            </span>
          ` : `
            <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
              Tingkat 1 (Umum)
            </span>
          `}
        </td>
      ` : ""}
      <td class="p-3.5 whitespace-nowrap">
        <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold border inline-flex items-center gap-1.5 ${badge.class}">
          <i class="fa-solid ${badge.icon} text-[10px]"></i>
          ${badge.label}
        </span>
      </td>
      <td class="p-3.5 text-right whitespace-nowrap">
        <div class="flex items-center justify-end gap-1.5">
          <button onclick="openDetailReport('${report.id}')" title="Lihat Detail & Cetak"
            class="p-1.5 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition">
            <i class="fa-regular fa-eye"></i>
          </button>

          ${(user.role === "guru_bk" && (report.status === "draft" || report.status === "revision")) || user.role === "super_admin" ? `
            <button onclick="openEditReport('${report.id}')" title="Edit Laporan"
              class="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-slate-100 transition">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button onclick="handleDeleteReport('${report.id}')" title="Hapus Laporan"
              class="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          ` : ""}
        </div>
      </td>
    </tr>
  `;
}

function filterReportsTable() {
  const search = document.getElementById("search-reports")?.value.toLowerCase() || "";
  const bidang = document.getElementById("filter-bidang")?.value || "all";
  const status = document.getElementById("filter-status")?.value || "all";

  const rows = document.querySelectorAll("#reports-table-body tr");
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    const rowBidang = row.getAttribute("data-bidang");
    const rowStatus = row.getAttribute("data-status");

    const matchSearch = text.includes(search);
    const matchBidang = bidang === "all" || rowBidang === bidang;
    const matchStatus = status === "all" || rowStatus === status;

    if (matchSearch && matchBidang && matchStatus) {
      row.classList.remove("hidden");
    } else {
      row.classList.add("hidden");
    }
  });
}

// ==========================================
// 3. VIEW: INBOX (MEJA VERIFIKASI & DISPOSISI)
// ==========================================
function renderInboxView(container, user) {
  const reports = store.getReports();
  let relevantReports = [];
  let inboxDescription = "";

  if (user.role === "waka_kurikulum") {
    relevantReports = reports.filter(r => r.targetVerifier === "waka_kurikulum" && r.status === "pending_waka");
    inboxDescription = "Daftar laporan Bimbingan Belajar & Peminatan Fase F yang menunggu verifikasi Waka Kurikulum.";
  } else if (user.role === "waka_kesiswaan") {
    relevantReports = reports.filter(r => r.targetVerifier === "waka_kesiswaan" && r.status === "pending_waka");
    inboxDescription = "Daftar laporan Bimbingan Pribadi, Sosial, Penanganan Kasus & Home Visit yang menunggu verifikasi Waka Kesiswaan.";
  } else if (user.role === "prog_khusus") {
    relevantReports = reports.filter(r => r.targetVerifier === "prog_khusus" && r.status === "pending_waka");
    inboxDescription = "Daftar laporan Inklusi, Satgas PPKSP, dan Karier Studi Lanjut yang menunggu verifikasi Program Khusus.";
  } else if (user.role === "kepala_sekolah") {
    relevantReports = reports.filter(r => r.status === "approved_waka");
    inboxDescription = "Daftar laporan yang telah diverifikasi Waka/Koordinator dan menunggu pengesahan serta Lembar Disposisi Kepala Sekolah.";
  } else if (user.role === "guru_bk") {
    relevantReports = reports.filter(r => r.authorId === user.id && r.status === "revision");
    inboxDescription = "Daftar laporan Anda yang dikembalikan oleh Verifikator Waka untuk direvisi.";
  } else if (user.role === "super_admin") {
    relevantReports = reports.filter(r => r.status === "pending_waka" || r.status === "approved_waka");
    inboxDescription = "Semua laporan yang saat ini berada dalam tahapan verifikasi aktif.";
  }

  container.innerHTML = `
    <div class="space-y-4">
      
      <!-- Context Header Card -->
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-xs text-amber-900">
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-sm">
            <i class="fa-solid fa-inbox"></i>
          </span>
          <div>
            <div class="font-bold text-sm">${inboxDescription}</div>
            <div class="text-amber-700 mt-0.5">Terdapat <strong>${relevantReports.length}</strong> dokumen yang membutuhkan tindak lanjut Anda.</div>
          </div>
        </div>
      </div>

      <!-- Empty State or Table -->
      ${relevantReports.length === 0 ? `
        <div class="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <div class="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mx-auto mb-3">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h4 class="font-bold text-slate-800 text-base">Semua Tugas Selesai!</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1">Saat ini tidak ada laporan yang sedang menunggu verifikasi atau disposisi pada meja tugas Anda.</p>
        </div>
      ` : `
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th class="p-3.5">Nomor Surat</th>
                  <th class="p-3.5">Judul Laporan & Sasaran</th>
                  <th class="p-3.5">Pengirim (Guru BK)</th>
                  <th class="p-3.5">Bidang Layanan</th>
                  <th class="p-3.5">Status Saat Ini</th>
                  <th class="p-3.5 text-right">Tindakan Cepat</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${relevantReports.map(report => `
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="p-3.5 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      ${report.nomorSurat}
                    </td>
                    <td class="p-3.5">
                      <div class="font-bold text-slate-900 hover:text-teal-700 cursor-pointer" onclick="openDetailReport('${report.id}')">
                        ${report.title}
                      </div>
                      <div class="text-[11px] text-slate-500 mt-0.5">
                        Sasaran: <strong>${report.studentTarget}</strong> (${report.studentClass})
                      </div>
                    </td>
                    <td class="p-3.5 whitespace-nowrap text-slate-700">
                      ${report.authorName}
                    </td>
                    <td class="p-3.5 whitespace-nowrap uppercase font-semibold text-teal-800">
                      ${report.bidang}
                    </td>
                    <td class="p-3.5 whitespace-nowrap">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border ${store.getStatusBadge(report.status).class}">
                        ${store.getStatusBadge(report.status).label}
                      </span>
                    </td>
                    <td class="p-3.5 text-right whitespace-nowrap">
                      ${user.role.startsWith("waka") || user.role === "prog_khusus" ? `
                        <button onclick="openReviewWakaModal('${report.id}')" 
                          class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 inline-flex shadow-sm transition">
                          <i class="fa-solid fa-clipboard-check"></i> Telaah & Putuskan
                        </button>
                      ` : user.role === "kepala_sekolah" ? `
                        <button onclick="openDisposisiKepsekModal('${report.id}')" 
                          class="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-lg font-semibold flex items-center gap-1.5 inline-flex shadow-sm transition">
                          <i class="fa-solid fa-signature text-amber-300"></i> Sahkan & Disposisi
                        </button>
                      ` : user.role === "guru_bk" ? `
                        <button onclick="openEditReport('${report.id}')" 
                          class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold flex items-center gap-1.5 inline-flex shadow-sm transition">
                          <i class="fa-solid fa-pen-to-square"></i> Perbaiki Sekarang
                        </button>
                      ` : `
                        <button onclick="openDetailReport('${report.id}')" 
                          class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold flex items-center gap-1.5 inline-flex shadow-sm transition">
                          <i class="fa-regular fa-eye"></i> Lihat
                        </button>
                      `}
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `}

    </div>
  `;
}

// ==========================================
// 4. VIEW: DATA SISWA ASUH & KERAWANAN
// ==========================================
function renderStudentsView(container, user) {
  const students = store.getStudents();

  container.innerHTML = `
    <div class="space-y-4 text-xs">
      
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 class="font-bold text-slate-900 text-sm">Daftar Konseli Asuh & Peta Kerawanan Siswa</h3>
          <p class="text-xs text-slate-500">Standar beban kerja konselor 1:150 konseli (Permendikbud 15/2018) • Total: <strong>${students.length} Siswa</strong></p>
        </div>
        <div class="flex items-center gap-2">
          ${(user.role === "guru_bk" || user.role === "super_admin") ? `
            <button onclick="openModalCreateStudent()" 
              class="px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition">
              <i class="fa-solid fa-user-plus text-xs"></i> Tambah Siswa Baru
            </button>
          ` : ""}
          <button onclick="alert('Sinkronisasi Dapodik otomatis berhasil: Data siswa telah dimutakhirkan.')" 
            class="px-3 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 flex items-center gap-1.5 transition">
            <i class="fa-solid fa-arrows-rotate"></i> Sinkron Dapodik
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th class="p-3.5">NISN</th>
              <th class="p-3.5">Nama Peserta Didik</th>
              <th class="p-3.5">Kelas / Fase</th>
              <th class="p-3.5">Jenis Kelamin</th>
              <th class="p-3.5">Guru BK Pengampu</th>
              <th class="p-3.5">Status Deteksi Kerawanan</th>
              ${(user.role === "guru_bk" || user.role === "super_admin") ? `<th class="p-3.5 text-right">Aksi</th>` : ""}
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${students.map(s => {
              let kerawananClass = "bg-slate-100 text-slate-700";
              if (s.statusKerawanan === "Tinggi") kerawananClass = "bg-rose-100 text-rose-800 border-rose-300 font-bold";
              if (s.statusKerawanan === "Sedang") kerawananClass = "bg-amber-100 text-amber-800 border-amber-300";
              if (s.statusKerawanan && s.statusKerawanan.includes("Inklusi")) kerawananClass = "bg-purple-100 text-purple-800 border-purple-300 font-bold";
              if (s.statusKerawanan === "Aman") kerawananClass = "bg-emerald-100 text-emerald-800 border-emerald-300";

              return `
                <tr class="hover:bg-slate-50 transition">
                  <td class="p-3.5 font-mono text-slate-600">${s.nisn}</td>
                  <td class="p-3.5 font-bold text-slate-900">${s.name}</td>
                  <td class="p-3.5 font-mono">${s.class}</td>
                  <td class="p-3.5">${s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                  <td class="p-3.5 text-slate-700">${s.mentor}</td>
                  <td class="p-3.5">
                    <span class="px-2.5 py-1 rounded-full text-[10px] border ${kerawananClass}">
                      ${s.statusKerawanan}
                    </span>
                  </td>
                  ${(user.role === "guru_bk" || user.role === "super_admin") ? `
                    <td class="p-3.5 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-1">
                        <button onclick="openEditStudent('${s.id}')" title="Edit Data Siswa" 
                          class="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-slate-100 rounded transition">
                          <i class="fa-solid fa-pen"></i>
                        </button>
                        <button onclick="handleDeleteStudent('${s.id}')" title="Hapus Data Siswa" 
                          class="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded transition">
                          <i class="fa-regular fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  ` : ""}
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>

    </div>
  `;
}

// ==========================================
// 5. VIEW: KELOLA PENGGUNA (SUPER ADMIN)
// ==========================================
function renderUsersView(container, user) {
  const users = store.getUsers();

  container.innerHTML = `
    <div class="space-y-4 text-xs">
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 class="font-bold text-slate-900 text-sm">Daftar Akun Pengguna & Pendidik</h3>
          <p class="text-xs text-slate-500">Struktur hak akses berbasis peran bertingkat: Guru BK, Waka, Program Khusus, dan Kepala Sekolah</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="openModalCreateUser()" 
            class="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition">
            <i class="fa-solid fa-user-plus text-xs"></i> Tambah Guru / Pengguna
          </button>
          <span class="text-xs font-mono bg-purple-50 text-purple-700 px-2.5 py-2 rounded-lg border border-purple-200 font-bold">
            Total: ${users.length} Akun
          </span>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th class="p-3.5">Pengguna</th>
              <th class="p-3.5">Username Login</th>
              <th class="p-3.5">NIP / Identitas</th>
              <th class="p-3.5">Role / Jabatan Sistem</th>
              <th class="p-3.5">Unit Kerja / Departemen</th>
              <th class="p-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${users.map(u => `
              <tr class="hover:bg-slate-50 transition">
                <td class="p-3.5 flex items-center gap-3">
                  <img src="${u.avatar}" class="w-8 h-8 rounded-full object-cover border border-slate-200">
                  <div>
                    <div class="font-bold text-slate-900">${u.name}</div>
                  </div>
                </td>
                <td class="p-3.5 font-mono text-slate-600 font-bold">${u.username}</td>
                <td class="p-3.5 font-mono text-slate-500">${u.nip}</td>
                <td class="p-3.5">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border ${u.badgeColor}">
                    ${u.roleLabel}
                  </span>
                </td>
                <td class="p-3.5 text-slate-600">${u.department}</td>
                <td class="p-3.5 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1">
                    <button onclick="openEditUser('${u.id}')" title="Edit Pengguna" 
                      class="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-slate-100 rounded transition">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    ${u.role !== 'super_admin' ? `
                      <button onclick="handleDeleteUser('${u.id}')" title="Hapus Pengguna" 
                        class="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded transition">
                        <i class="fa-regular fa-trash-can"></i>
                      </button>
                    ` : ""}
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ==========================================
// 6. VIEW: AUDIT TRAIL LOGS
// ==========================================
function renderLogsView(container, user) {
  const logs = store.getLogs();

  container.innerHTML = `
    <div class="space-y-4 text-xs">
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 class="font-bold text-slate-900 text-sm">Rekam Jejak Audit Sistem (Audit Trail)</h3>
          <p class="text-xs text-slate-500">Merekam setiap aksi pembuatan, persetujuan, revisi, dan disposisi dokumen</p>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th class="p-3.5">Waktu Transaksi</th>
              <th class="p-3.5">Pengguna</th>
              <th class="p-3.5">Aksi / Event</th>
              <th class="p-3.5">Deskripsi Transaksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-mono text-[11px]">
            ${logs.map(log => `
              <tr class="hover:bg-slate-50 transition">
                <td class="p-3.5 text-slate-500 whitespace-nowrap">${new Date(log.timestamp).toLocaleString('id-ID')}</td>
                <td class="p-3.5 font-bold text-slate-800">${log.user}</td>
                <td class="p-3.5">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border">
                    ${log.action}
                  </span>
                </td>
                <td class="p-3.5 font-sans text-slate-700">${log.details}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}


// ==========================================
// MODAL HANDLERS & LOGIC
// ==========================================

// Open Detail & Print Modal
function openDetailReport(reportId) {
  const rawReport = store.getReportById(reportId);
  if (!rawReport) return;

  const currentUser = store.getCurrentUser();
  const report = store.maskReportPrivacy(rawReport, currentUser);

  // Fill Header & Meta
  document.getElementById("detail-modal-header-title").textContent = `Detail Dokumen: ${report.nomorSurat}`;
  document.getElementById("print-doc-title").textContent = report.title;
  document.getElementById("print-doc-nomor").textContent = `Nomor Dokumen: ${report.nomorSurat}`;
  document.getElementById("print-doc-bidang").textContent = report.bidang.toUpperCase();
  document.getElementById("print-doc-author").textContent = report.authorName;
  document.getElementById("print-doc-target").textContent = `${report.studentTarget} (${report.studentClass})`;
  document.getElementById("print-doc-verifier").textContent = store.getVerifierLabel(report.targetVerifier);
  document.getElementById("print-doc-date").textContent = new Date(report.createdAt).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Kerahasiaan
  const confEl = document.getElementById("print-doc-confidentiality");
  if (report.confidentiality === 3) {
    confEl.innerHTML = `<span class="text-rose-700 font-bold"><i class="fa-solid fa-lock"></i> Tingkat 3 (Sangat Rahasia)</span>`;
  } else if (report.confidentiality === 2) {
    confEl.innerHTML = `<span class="text-amber-700 font-medium">Tingkat 2 (Manajerial)</span>`;
  } else {
    confEl.innerHTML = `<span class="text-slate-700 font-medium">Tingkat 1 (Umum / Statistik)</span>`;
  }

  // Status Badge
  const statusBadge = store.getStatusBadge(report.status);
  document.getElementById("print-doc-status-badge").innerHTML = `
    <span class="px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5 ${statusBadge.class}">
      <i class="fa-solid ${statusBadge.icon}"></i> ${statusBadge.label}
    </span>
  `;

  // Body content
  document.getElementById("print-doc-summary").textContent = report.summary;
  document.getElementById("print-doc-findings").textContent = report.findings;
  document.getElementById("print-doc-recommendations").textContent = report.recommendations;

  // Confidential notes with privacy styling
  const confNotesEl = document.getElementById("print-doc-confidential-notes");
  if (report.confidentialNotes && report.confidentialNotes.includes("🔒")) {
    confNotesEl.className = "p-3 rounded border text-xs bg-rose-50/70 border-rose-200 text-rose-800 font-medium italic";
  } else {
    confNotesEl.className = "p-3 rounded border text-xs bg-slate-50 border-slate-200 text-slate-800";
  }
  confNotesEl.textContent = report.confidentialNotes || "Tidak ada catatan khusus.";

  // Waka Review Section
  const wakaSection = document.getElementById("print-doc-waka-review-section");
  if (report.wakaReview) {
    wakaSection.classList.remove("hidden");
    document.getElementById("print-doc-waka-name").textContent = report.wakaReview.reviewerName;
    document.getElementById("print-doc-waka-date").textContent = new Date(report.wakaReview.reviewedAt).toLocaleString('id-ID');
    document.getElementById("print-doc-waka-notes").textContent = report.wakaReview.notes;
  } else {
    wakaSection.classList.add("hidden");
  }

  // Kepsek Section
  const kepsekSection = document.getElementById("print-doc-kepsek-section");
  if (report.kepsekReview) {
    kepsekSection.classList.remove("hidden");
    document.getElementById("print-doc-kepsek-notes").textContent = report.kepsekReview.disposisiNotes;
    document.getElementById("print-doc-esign-code").textContent = report.kepsekReview.eSignatureCode;
  } else {
    kepsekSection.classList.add("hidden");
  }

  // Signature Blocks
  document.getElementById("sign-author-name").textContent = report.authorName;

  const signWakaTitle = document.getElementById("sign-waka-title");
  const signWakaBadge = document.getElementById("sign-waka-badge");
  const signWakaName = document.getElementById("sign-waka-name");

  signWakaTitle.textContent = `Mengetahui / Memvalidasi,\n${store.getVerifierLabel(report.targetVerifier)}`;
  if (report.wakaReview && report.wakaReview.decision === "approved") {
    signWakaBadge.className = "font-mono text-[10px] text-blue-800 bg-blue-50 py-1 px-2 rounded inline-block mb-1 border border-blue-200";
    signWakaBadge.innerHTML = `<i class="fa-solid fa-stamp"></i> Terverifikasi Valid`;
    signWakaName.textContent = report.wakaReview.reviewerName;
  } else {
    signWakaBadge.className = "font-mono text-[10px] text-slate-400 bg-slate-100 py-1 px-2 rounded inline-block mb-1 border";
    signWakaBadge.textContent = "Belum Diverifikasi";
    signWakaName.textContent = store.getVerifierLabel(report.targetVerifier);
  }

  const signKepsekBadge = document.getElementById("sign-kepsek-badge");
  if (report.kepsekReview) {
    signKepsekBadge.className = "font-mono text-[10px] text-indigo-800 bg-indigo-50 py-1 px-2 rounded inline-block mb-1 border border-indigo-200 font-bold";
    signKepsekBadge.innerHTML = `<i class="fa-solid fa-signature"></i> e-Sign Sah (${report.kepsekReview.eSignatureCode})`;
  } else {
    signKepsekBadge.className = "font-mono text-[10px] text-slate-400 bg-slate-100 py-1 px-2 rounded inline-block mb-1 border";
    signKepsekBadge.textContent = "Menunggu Disposisi";
  }

  // Logs inside modal
  const logsContainer = document.getElementById("detail-modal-logs");
  logsContainer.innerHTML = report.logs.map(log => `
    <div class="flex items-start gap-2 text-slate-600">
      <span class="font-mono text-[10px] text-slate-400 shrink-0 mt-0.5">${new Date(log.timestamp).toLocaleString('id-ID')}</span>
      <span class="font-bold text-slate-800 shrink-0">${log.actor}:</span>
      <span>${log.note}</span>
    </div>
  `).join("");

  // Footer Actions according to role and status
  const actionsContainer = document.getElementById("detail-modal-actions");
  actionsContainer.innerHTML = "";

  const canWakaReview = (currentUser.role === report.targetVerifier || currentUser.role === "super_admin") && report.status === "pending_waka";
  const canKepsekReview = (currentUser.role === "kepala_sekolah" || currentUser.role === "super_admin") && report.status === "approved_waka";
  const canGuruEdit = (currentUser.id === report.authorId || currentUser.role === "super_admin") && (report.status === "draft" || report.status === "revision");

  if (canWakaReview) {
    actionsContainer.innerHTML = `
      <div class="text-xs text-blue-900 font-semibold">
        <i class="fa-solid fa-bell"></i> Laporan ini ditujukan ke meja verifikasi Anda.
      </div>
      <button onclick="closeModalDetailReport(); openReviewWakaModal('${report.id}');" 
        class="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-sm">
        <i class="fa-solid fa-clipboard-check"></i> Masukkan Keputusan Verifikasi
      </button>
    `;
  } else if (canKepsekReview) {
    actionsContainer.innerHTML = `
      <div class="text-xs text-indigo-900 font-semibold">
        <i class="fa-solid fa-bell"></i> Laporan telah lolos review Waka dan siap disahkan.
      </div>
      <button onclick="closeModalDetailReport(); openDisposisiKepsekModal('${report.id}');" 
        class="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-md">
        <i class="fa-solid fa-stamp text-amber-300"></i> Sahkan & Terbitkan Disposisi
      </button>
    `;
  } else if (canGuruEdit) {
    actionsContainer.innerHTML = `
      <div class="text-xs text-rose-800 font-semibold">
        <i class="fa-solid fa-pencil"></i> Laporan ini masih berstatus ${report.status === 'draft' ? 'Draft' : 'Perlu Revisi'}.
      </div>
      <div class="flex gap-2">
        <button onclick="closeModalDetailReport(); openEditReport('${report.id}');" 
          class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs flex items-center gap-2">
          <i class="fa-solid fa-pen"></i> Edit Laporan
        </button>
        ${report.status === 'draft' ? `
          <button onclick="handleQuickSubmitDraft('${report.id}')" 
            class="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs flex items-center gap-2">
            <i class="fa-solid fa-paper-plane"></i> Ajukan ke Waka
          </button>
        ` : ""}
      </div>
    `;
  } else {
    actionsContainer.innerHTML = `
      <div class="text-xs text-slate-500">
        Status: <strong>${statusBadge.label}</strong>
      </div>
      <button onclick="closeModalDetailReport()" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold">
        Tutup
      </button>
    `;
  }

  document.getElementById("modal-detail-report").classList.remove("hidden");
}

function closeModalDetailReport() {
  document.getElementById("modal-detail-report").classList.add("hidden");
}

// Modal Form Create / Edit
function openModalCreateReport() {
  document.getElementById("form-report-modal-title").textContent = "Buat Laporan Layanan BK Baru";
  document.getElementById("form-report").reset();
  document.getElementById("form-report-id").value = "";
  handleBidangChange();
  document.getElementById("modal-form-report").classList.remove("hidden");
}

function openEditReport(reportId) {
  const report = store.getReportById(reportId);
  if (!report) return;

  document.getElementById("form-report-modal-title").textContent = `Edit Laporan: ${report.nomorSurat}`;
  document.getElementById("form-report-id").value = report.id;
  document.getElementById("form-title").value = report.title;
  document.getElementById("form-bidang").value = report.bidang;
  document.getElementById("form-verifier").value = report.targetVerifier;
  document.getElementById("form-target").value = report.studentTarget;
  document.getElementById("form-class").value = report.studentClass;
  document.getElementById("form-confidentiality").value = report.confidentiality;
  document.getElementById("form-summary").value = report.summary;
  document.getElementById("form-findings").value = report.findings;
  document.getElementById("form-confidential").value = report.confidentialNotes;
  document.getElementById("form-recommendations").value = report.recommendations;

  document.getElementById("modal-form-report").classList.remove("hidden");
}

function closeModalFormReport() {
  document.getElementById("modal-form-report").classList.add("hidden");
}

// Auto-routing recommendation when selecting bidang
function handleBidangChange() {
  const bidang = document.getElementById("form-bidang").value;
  const verifierSelect = document.getElementById("form-verifier");

  if (bidang === "belajar") {
    verifierSelect.value = "waka_kurikulum";
  } else if (bidang === "pribadi" || bidang === "sosial") {
    verifierSelect.value = "waka_kesiswaan";
  } else if (bidang === "karier") {
    verifierSelect.value = "prog_khusus";
  }
}

// Modal Review Waka
function openReviewWakaModal(reportId) {
  const report = store.getReportById(reportId);
  if (!report) return;

  document.getElementById("review-report-id").value = report.id;
  document.getElementById("review-report-title").textContent = report.title;
  document.getElementById("review-report-author").textContent = `Pengusul: ${report.authorName} (${new Date(report.createdAt).toLocaleDateString('id-ID')})`;
  document.getElementById("review-waka-notes").value = "";

  document.getElementById("modal-review-waka").classList.remove("hidden");
}

function closeModalReviewWaka() {
  document.getElementById("modal-review-waka").classList.add("hidden");
}

// Modal Disposisi Kepsek
function openDisposisiKepsekModal(reportId) {
  const report = store.getReportById(reportId);
  if (!report) return;

  document.getElementById("disposisi-report-id").value = report.id;
  document.getElementById("disposisi-report-title").textContent = report.title;

  if (report.wakaReview) {
    document.getElementById("disposisi-waka-reviewer").textContent = `${report.wakaReview.reviewerName} (Verifikator)`;
    document.getElementById("disposisi-waka-notes").textContent = report.wakaReview.notes;
  } else {
    document.getElementById("disposisi-waka-reviewer").textContent = "Verifikator:";
    document.getElementById("disposisi-waka-notes").textContent = "Disetujui.";
  }

  document.getElementById("disposisi-notes").value = "Disetujui. Segera tindak lanjuti sesuai rencana tindak lanjut dan laporkan perkembangannya pada rapat evaluasi bulanan.";
  document.getElementById("modal-disposisi-kepsek").classList.remove("hidden");
}

function closeModalDisposisiKepsek() {
  document.getElementById("modal-disposisi-kepsek").classList.add("hidden");
}

// Delete Handler
function handleDeleteReport(reportId) {
  if (confirm("Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.")) {
    store.deleteReport(reportId);
    showToast("Laporan berhasil dihapus.", "success");
    navigateTo(currentView);
  }
}

function handleQuickSubmitDraft(reportId) {
  store.submitReport(reportId);
  closeModalDetailReport();
  showToast("Laporan berhasil diajukan ke Verifikator Waka!", "success");
  navigateTo(currentView);
}

// Reset Demo Data
function resetDataModal() {
  if (confirm("Reset semua data laporan dan akun ke kondisi demo awal?")) {
    store.resetToDefault();
    showToast("Data berhasil direset ke pengaturan default.", "success");
    navigateTo(currentView);
  }
}


// ==========================================
// STUDENT & USER MODAL HANDLERS
// ==========================================

// Student Modal
function openModalCreateStudent() {
  document.getElementById("form-student-modal-title").textContent = "Tambah Data Siswa Asuh Baru";
  document.getElementById("form-student").reset();
  document.getElementById("form-student-id").value = "";
  document.getElementById("modal-form-student").classList.remove("hidden");
}

function openEditStudent(studentId) {
  const students = store.getStudents();
  const s = students.find(item => item.id === studentId);
  if (!s) return;

  document.getElementById("form-student-modal-title").textContent = `Edit Data Siswa: ${s.name}`;
  document.getElementById("form-student-id").value = s.id;
  document.getElementById("form-student-nisn").value = s.nisn;
  document.getElementById("form-student-name").value = s.name;
  document.getElementById("form-student-class").value = s.class;
  document.getElementById("form-student-gender").value = s.gender;
  document.getElementById("form-student-mentor").value = s.mentor;
  document.getElementById("form-student-kerawanan").value = s.statusKerawanan;

  document.getElementById("modal-form-student").classList.remove("hidden");
}

function closeModalFormStudent() {
  document.getElementById("modal-form-student").classList.add("hidden");
}

function handleDeleteStudent(studentId) {
  if (confirm("Apakah Anda yakin ingin menghapus data siswa ini?")) {
    store.deleteStudent(studentId);
    showToast("Data siswa berhasil dihapus.", "success");
    navigateTo(currentView);
  }
}

// User & Guru Modal
function openModalCreateUser() {
  document.getElementById("form-user-modal-title").textContent = "Tambah Guru / Pengguna Baru";
  document.getElementById("form-user").reset();
  document.getElementById("form-user-id").value = "";
  document.getElementById("modal-form-user").classList.remove("hidden");
}

function openEditUser(userId) {
  const users = store.getUsers();
  const u = users.find(item => item.id === userId);
  if (!u) return;

  document.getElementById("form-user-modal-title").textContent = `Edit Pengguna: ${u.name}`;
  document.getElementById("form-user-id").value = u.id;
  document.getElementById("form-user-name").value = u.name;
  document.getElementById("form-user-nip").value = u.nip || "";
  document.getElementById("form-user-username").value = u.username;
  document.getElementById("form-user-password").value = u.password;
  document.getElementById("form-user-role").value = u.role;
  document.getElementById("form-user-dept").value = u.department || "";

  document.getElementById("modal-form-user").classList.remove("hidden");
}

function closeModalFormUser() {
  document.getElementById("modal-form-user").classList.add("hidden");
}

function handleDeleteUser(userId) {
  if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
    const res = store.deleteUser(userId);
    if (res.success) {
      showToast("Pengguna berhasil dihapus.", "success");
      navigateTo(currentView);
    } else {
      showToast(res.message, "error");
    }
  }
}

// Preset Avatars for Instant Selection
const PRESET_AVATARS = [
  { label: "Pendidik Wanita 1", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" },
  { label: "Pendidik Wanita 2", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150" },
  { label: "Pendidik Wanita 3", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" },
  { label: "Pendidik Pria 1", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
  { label: "Pendidik Pria 2", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" },
  { label: "Pendidik Senior", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" }
];

let tempSelectedAvatar = null;

function openModalEditProfile() {
  const user = store.getCurrentUser();
  if (!user) return;

  tempSelectedAvatar = user.avatar;
  document.getElementById("preview-profile-avatar").src = user.avatar;
  document.getElementById("edit-profile-name").value = user.name;
  document.getElementById("edit-profile-nip").value = user.nip || "";
  document.getElementById("edit-profile-password").value = "";
  document.getElementById("input-avatar-url").value = "";
  document.getElementById("input-avatar-file").value = "";

  // Render presets
  const grid = document.getElementById("preset-avatars-grid");
  if (grid) {
    grid.innerHTML = PRESET_AVATARS.map((av, idx) => `
      <div onclick="selectPresetAvatar('${av.url}')" title="${av.label}"
        class="cursor-pointer group relative rounded-xl overflow-hidden border-2 hover:border-teal-500 transition shadow-sm p-0.5 ${user.avatar === av.url ? 'border-teal-600 ring-2 ring-teal-400' : 'border-slate-200'}">
        <img src="${av.url}" class="w-full h-12 rounded-lg object-cover group-hover:scale-105 transition">
      </div>
    `).join("");
  }

  document.getElementById("modal-edit-profile").classList.remove("hidden");
}

function closeModalEditProfile() {
  document.getElementById("modal-edit-profile").classList.add("hidden");
}

function selectPresetAvatar(url) {
  tempSelectedAvatar = url;
  document.getElementById("preview-profile-avatar").src = url;
  document.getElementById("input-avatar-url").value = "";
  
  // Update borders in presets
  const grid = document.getElementById("preset-avatars-grid");
  if (grid) {
    grid.querySelectorAll("div").forEach(div => {
      div.className = "cursor-pointer group relative rounded-xl overflow-hidden border-2 border-slate-200 hover:border-teal-500 transition shadow-sm p-0.5";
    });
  }
}

function handleAvatarFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 3 * 1024 * 1024) {
    showToast("Ukuran berkas terlalu besar. Maksimum 3 MB.", "warning");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Img = e.target.result;
    tempSelectedAvatar = base64Img;
    document.getElementById("preview-profile-avatar").src = base64Img;
    showToast("Foto berhasil dimuat. Klik Simpan untuk memperbarui.", "info");
  };
  reader.readAsDataURL(file);
}

function handleAvatarUrlInput(url) {
  if (url && url.trim().length > 10) {
    tempSelectedAvatar = url.trim();
    document.getElementById("preview-profile-avatar").src = url.trim();
  }
}

// ==========================================
// FORM SUBMIT HANDLERS
// ==========================================
function setupEventListeners() {
  // Login Form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const u = document.getElementById("login-username").value.trim();
      const p = document.getElementById("login-password").value;
      const res = store.login(u, p);
      if (res.success) {
        document.getElementById("login-error").classList.add("hidden");
        showMainView(res.user);
        showToast(`Selamat datang, ${res.user.name}!`, "success");
      } else {
        document.getElementById("login-error").classList.remove("hidden");
        document.getElementById("login-error-text").textContent = res.message;
      }
    });
  }

  // Create / Edit Report Form
  const reportForm = document.getElementById("form-report");
  if (reportForm) {
    reportForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const reportId = document.getElementById("form-report-id").value;
      const submitter = e.submitter;
      const submitType = submitter ? submitter.value : "draft";
      const isSubmitDirect = submitType === "direct";

      const formData = {
        title: document.getElementById("form-title").value,
        bidang: document.getElementById("form-bidang").value,
        targetVerifier: document.getElementById("form-verifier").value,
        studentTarget: document.getElementById("form-target").value,
        studentClass: document.getElementById("form-class").value,
        confidentiality: document.getElementById("form-confidentiality").value,
        summary: document.getElementById("form-summary").value,
        findings: document.getElementById("form-findings").value,
        confidentialNotes: document.getElementById("form-confidential").value,
        recommendations: document.getElementById("form-recommendations").value,
        isSubmitDirect,
        submitAction: isSubmitDirect
      };

      if (reportId) {
        store.updateReport(reportId, formData);
        showToast("Laporan berhasil diperbarui!", "success");
      } else {
        store.createReport(formData);
        showToast(isSubmitDirect ? "Laporan berhasil dibuat dan diajukan ke Verifikator!" : "Draft laporan berhasil disimpan.", "success");
      }

      closeModalFormReport();
      navigateTo(currentView);
    });
  }

  // Review Waka Form
  const reviewWakaForm = document.getElementById("form-review-waka");
  if (reviewWakaForm) {
    reviewWakaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const reportId = document.getElementById("review-report-id").value;
      const decision = document.querySelector('input[name="wakaDecision"]:checked').value;
      const notes = document.getElementById("review-waka-notes").value;

      store.reviewReportWaka(reportId, decision, notes);
      closeModalReviewWaka();

      if (decision === "approved") {
        showToast("Laporan disetujui dan diteruskan ke Kepala Sekolah!", "success");
      } else {
        showToast("Laporan dikembalikan ke Guru BK untuk direvisi.", "warning");
      }

      navigateTo(currentView);
    });
  }

  // Disposisi Kepsek Form
  const disposisiForm = document.getElementById("form-disposisi-kepsek");
  if (disposisiForm) {
    disposisiForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const reportId = document.getElementById("disposisi-report-id").value;
      const notes = document.getElementById("disposisi-notes").value;

      store.disposisiKepsek(reportId, notes);
      closeModalDisposisiKepsek();
      showToast("Laporan RESMI DISAHKAN dengan e-Signature Kepala Sekolah!", "success");
      navigateTo(currentView);
    });
  }

  // Student Form
  const studentForm = document.getElementById("form-student");
  if (studentForm) {
    studentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const studentId = document.getElementById("form-student-id").value;
      const data = {
        nisn: document.getElementById("form-student-nisn").value.trim(),
        name: document.getElementById("form-student-name").value.trim(),
        class: document.getElementById("form-student-class").value.trim(),
        gender: document.getElementById("form-student-gender").value,
        mentor: document.getElementById("form-student-mentor").value,
        statusKerawanan: document.getElementById("form-student-kerawanan").value
      };

      if (studentId) {
        store.updateStudent(studentId, data);
        showToast("Data siswa berhasil diperbarui!", "success");
      } else {
        store.addStudent(data);
        showToast("Siswa baru berhasil ditambahkan!", "success");
      }
      closeModalFormStudent();
      navigateTo(currentView);
    });
  }

  // User / Guru Form
  const userForm = document.getElementById("form-user");
  if (userForm) {
    userForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userId = document.getElementById("form-user-id").value;
      const data = {
        name: document.getElementById("form-user-name").value.trim(),
        nip: document.getElementById("form-user-nip").value.trim(),
        username: document.getElementById("form-user-username").value.trim(),
        password: document.getElementById("form-user-password").value,
        role: document.getElementById("form-user-role").value,
        department: document.getElementById("form-user-dept").value.trim()
      };

      if (userId) {
        store.updateUser(userId, data);
        showToast("Data pengguna berhasil diperbarui!", "success");
      } else {
        store.addUser(data);
        showToast("Pengguna/Guru baru berhasil ditambahkan!", "success");
      }
      closeModalFormUser();
      navigateTo(currentView);
    });
  }

  // Edit Profile Form
  const profileForm = document.getElementById("form-edit-profile");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("edit-profile-name").value.trim();
      const nip = document.getElementById("edit-profile-nip").value.trim();
      const password = document.getElementById("edit-profile-password").value;

      const updatedUser = store.updateCurrentUserProfile({
        avatar: tempSelectedAvatar,
        name,
        nip,
        password: password ? password : undefined
      });

      if (updatedUser) {
        updateUserInterface(updatedUser);
        closeModalEditProfile();
        showToast("Foto profil & data akun berhasil diperbarui!", "success");
        navigateTo(currentView);
      }
    });
  }
}

// Quick Login Demo Helper
function quickLogin(username) {
  const user = store.quickSwitchUser(username);
  if (user) {
    showMainView(user);
    showToast(`Beralih ke akun: ${user.name} (${user.roleLabel})`, "success");
  }
}

// Switch Role from Top Ribbon
function switchRole(username) {
  quickLogin(username);
}

// Logout
function handleLogout() {
  store.logout();
  showLoginView();
  showToast("Anda telah keluar dari aplikasi.", "info");
}

// Toast Helper
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  let bg = "bg-slate-900 text-white";
  let icon = "fa-circle-info";

  if (type === "success") {
    bg = "bg-emerald-700 text-white";
    icon = "fa-circle-check";
  } else if (type === "warning") {
    bg = "bg-amber-600 text-white";
    icon = "fa-triangle-exclamation";
  } else if (type === "error") {
    bg = "bg-rose-700 text-white";
    icon = "fa-circle-exclamation";
  }

  toast.className = `${bg} px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-medium pointer-events-auto transition transform translate-y-2 opacity-0 duration-300`;
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-base"></i>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  }, 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-x-full");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
