import { Sidebar } from '../../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage, EmptyState, showAlertModal, closeModal } from '../../components/common/index.js';
import { adminAPI } from '../../js/api/endpoints.js';
import { formatDate, isAdmin } from '../../js/utils/helpers.js';

export async function AdminRentalsPage() {
  const app = document.getElementById('app');

  if (!isAdmin()) {
    app.innerHTML = EmptyState('Akses Ditolak', 'Anda harus admin untuk mengakses halaman ini', 'Kembali', '/');
    return;
  }

  app.innerHTML = `
    <div class="flex bg-neutral-50 min-h-screen">
      ${Sidebar()}
      <main class="flex-1">
        <div class="p-8">
          <div class="flex-between mb-8">
            <h1 class="text-4xl font-bold">Manajemen Rental</h1>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input type="text" id="rental-search" placeholder="Cari ID atau nama..." class="input pl-10 pr-4 py-2 w-64" />
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card">
              <h2 class="text-xl font-bold mb-4">Rental Aktif</h2>
              <div id="active-rentals">
                ${LoadingSpinner()}
              </div>
            </div>
            <div class="card">
              <h2 class="text-xl font-bold mb-4">Rental Overdue</h2>
              <div id="overdue-rentals">
                ${LoadingSpinner()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  loadAdminRentals();
}

async function loadAdminRentals() {
  try {
    const [activeRes, overdueRes] = await Promise.allSettled([
      adminAPI.rentals.getAll(),
      adminAPI.rentals.getOverdue(),
    ]);

    let activeRentals = activeRes.status === 'fulfilled'
      ? (Array.isArray(activeRes.value?.data?.data) ? activeRes.value.data.data : (Array.isArray(activeRes.value?.data) ? activeRes.value.data : (Array.isArray(activeRes.value) ? activeRes.value : [])))
      : [];

    let overdueRentals = overdueRes.status === 'fulfilled'
      ? (Array.isArray(overdueRes.value?.data?.data) ? overdueRes.value.data.data : (Array.isArray(overdueRes.value?.data) ? overdueRes.value.data : (Array.isArray(overdueRes.value) ? overdueRes.value : [])))
      : [];

    const renderRentals = (activeItems, overdueItems) => {
      const activeHtml = activeItems.length > 0 ? activeItems.map(rental => `
        <div class="py-3 border-b border-neutral-200">
          <div class="flex-between mb-2">
            <p class="font-bold">ID: ${rental.id}</p>
            <span class="badge badge-success">Aktif</span>
          </div>
          <p class="text-sm text-neutral-600">iPhone: ${rental.iphone_name || 'N/A'}</p>
          <p class="text-sm text-neutral-600">Pengguna: ${rental.user_name || 'N/A'}</p>
          <p class="text-sm text-neutral-600">Periode: ${formatDate(rental.rental_start_date)} - ${formatDate(rental.rental_end_date)}</p>
          <button onclick="returnRental(${rental.id})" class="btn btn-sm btn-primary mt-2">Proses Return</button>
        </div>
      `).join('') : '<p class="text-neutral-500">Tidak ada rental aktif yang sesuai</p>';

      const overdueHtml = overdueItems.length > 0 ? overdueItems.map(rental => `
        <div class="py-4 border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
          <div class="flex-between mb-3">
            <div>
              <p class="font-bold text-lg">ID: ${rental.id}</p>
              <p class="text-sm text-neutral-500">Order: ${rental.order_code || 'N/A'}</p>
            </div>
            <span class="badge badge-error">Overdue</span>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p class="text-sm font-medium text-neutral-700">iPhone</p>
              <p class="text-sm text-neutral-600">${rental.iphone_name || 'N/A'}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-neutral-700">Pengguna</p>
              <p class="text-sm text-neutral-600">${rental.user_name || 'N/A'}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-neutral-700">Jatuh Tempo</p>
              <p class="text-sm text-neutral-600">${formatDate(rental.rental_end_date)}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-neutral-700">Hari Terlambat</p>
              <p class="text-sm text-error font-semibold">${rental.days_overdue || 0} hari</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button onclick="showOverdueDetail(${rental.id})" class="btn btn-sm btn-outline-primary flex-1">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              Detail
            </button>
            <button onclick="returnRental(${rental.id})" class="btn btn-sm btn-danger flex-1">Selesaikan Overdue</button>
          </div>
        </div>
      `).join('') : '<p class="text-neutral-500">Tidak ada rental overdue yang sesuai</p>';

      document.getElementById('active-rentals').innerHTML = activeHtml;
      document.getElementById('overdue-rentals').innerHTML = overdueHtml;
    };

    renderRentals(activeRentals, overdueRentals);

    // Store overdue rentals data globally for detail modal
    window.overdueRentalsData = overdueRentals;

    const searchInput = document.getElementById('rental-search');

    const applySearch = () => {
      const searchText = searchInput.value.toLowerCase();

      const filteredActive = activeRentals.filter(rental =>
        rental.id.toString().includes(searchText) ||
        (rental.user_name || '').toLowerCase().includes(searchText)
      );

      const filteredOverdue = overdueRentals.filter(rental =>
        rental.id.toString().includes(searchText) ||
        (rental.user_name || '').toLowerCase().includes(searchText)
      );

      renderRentals(filteredActive, filteredOverdue);
    };

    searchInput.addEventListener('input', applySearch);

    window.returnRental = async (rentalId) => {
      const today = new Date().toISOString().split('T')[0];
      try {
        await adminAPI.rentals.return(rentalId, today);
        showAlertModal('Rental berhasil dikembalikan!', true);
        loadAdminRentals();
      } catch (error) {
        console.error('Error returning rental:', error);
        showAlertModal('Gagal mengembalikan rental', false);
      }
    };

    window.showOverdueDetail = (rentalId) => {
      const rental = window.overdueRentalsData.find(r => r.id === rentalId);
      if (!rental) return;

      const modalContent = `
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-neutral-50 p-3 rounded-lg">
              <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">ID Rental</p>
              <p class="text-sm font-semibold text-neutral-900">${rental.id}</p>
            </div>
            <div class="bg-neutral-50 p-3 rounded-lg">
              <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Order Code</p>
              <p class="text-sm font-semibold text-neutral-900">${rental.order_code || 'N/A'}</p>
            </div>
            <div class="bg-neutral-50 p-3 rounded-lg">
              <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">iPhone</p>
              <p class="text-sm font-semibold text-neutral-900">${rental.iphone_name || 'N/A'}</p>
            </div>
            <div class="bg-neutral-50 p-3 rounded-lg">
              <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Harga/Hari</p>
              <p class="text-sm font-semibold text-neutral-900">Rp ${parseInt(rental.price_per_day || 0).toLocaleString('id-ID')}</p>
            </div>
          </div>

          <div class="border-t pt-4">
            <h3 class="text-lg font-semibold mb-3 text-neutral-900">Informasi Pengguna</h3>
            <div class="grid grid-cols-1 gap-3">
              <div class="bg-blue-50 p-3 rounded-lg">
                <p class="text-xs font-medium text-blue-600 uppercase tracking-wide">Nama</p>
                <p class="text-sm font-semibold text-neutral-900">${rental.user_name || 'N/A'}</p>
              </div>
              <div class="bg-blue-50 p-3 rounded-lg">
                <p class="text-xs font-medium text-blue-600 uppercase tracking-wide">Email</p>
                <p class="text-sm font-semibold text-neutral-900">${rental.user_email || 'N/A'}</p>
              </div>
              <div class="bg-blue-50 p-3 rounded-lg">
                <p class="text-xs font-medium text-blue-600 uppercase tracking-wide">Telepon</p>
                <p class="text-sm font-semibold text-neutral-900">${rental.user_phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div class="border-t pt-4">
            <h3 class="text-lg font-semibold mb-3 text-neutral-900">Detail Rental</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-neutral-50 p-3 rounded-lg">
                <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Tanggal Mulai</p>
                <p class="text-sm font-semibold text-neutral-900">${formatDate(rental.rental_start_date)}</p>
              </div>
              <div class="bg-neutral-50 p-3 rounded-lg">
                <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Tanggal Akhir</p>
                <p class="text-sm font-semibold text-neutral-900">${formatDate(rental.rental_end_date)}</p>
              </div>
              <div class="bg-neutral-50 p-3 rounded-lg">
                <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Tanggal Pengembalian</p>
                <p class="text-sm font-semibold text-neutral-900">${rental.actual_return_date ? formatDate(rental.actual_return_date) : 'Belum dikembalikan'}</p>
              </div>
              <div class="bg-neutral-50 p-3 rounded-lg">
                <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Status</p>
                <span class="badge badge-error">${rental.status}</span>
              </div>
            </div>
          </div>

          <div class="border-t pt-4">
            <h3 class="text-lg font-semibold mb-3 text-error">Informasi Overdue</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-red-50 p-3 rounded-lg">
                <p class="text-xs font-medium text-red-600 uppercase tracking-wide">Hari Terlambat</p>
                <p class="text-lg font-bold text-error">${rental.days_overdue || 0} hari</p>
              </div>
              <div class="bg-red-50 p-3 rounded-lg">
                <p class="text-xs font-medium text-red-600 uppercase tracking-wide">Denda/Hari</p>
                <p class="text-lg font-bold text-error">Rp ${parseInt(rental.penalty_per_day || 0).toLocaleString('id-ID')}</p>
              </div>
              <div class="bg-red-50 p-3 rounded-lg col-span-2">
                <p class="text-xs font-medium text-red-600 uppercase tracking-wide">Total Denda</p>
                <p class="text-2xl font-bold text-error">Rp ${parseInt(rental.total_penalty || 0).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>

          <div class="border-t pt-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-neutral-50 p-3 rounded-lg">
                <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Total Order</p>
                <p class="text-sm font-semibold text-neutral-900">Rp ${parseInt(rental.order_total || 0).toLocaleString('id-ID')}</p>
              </div>
              <div class="bg-neutral-50 p-3 rounded-lg">
                <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Tanggal Dibuat</p>
                <p class="text-sm font-semibold text-neutral-900">${formatDate(rental.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      `;

      const modalFooter = `
        <button onclick="closeModal()" class="btn btn-outline-neutral">Tutup</button>
        <button onclick="returnRental(${rental.id}); closeModal();" class="btn btn-danger">Selesaikan Overdue</button>
      `;

      // Create modal container if it doesn't exist
      let modalContainer = document.getElementById('modal-container');
      if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        document.body.appendChild(modalContainer);
      }

      const modal = `
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-8 pb-8 overflow-y-auto">
          <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 animate-modal-slide-up max-h-full overflow-y-auto">
            <div class="p-6 border-b border-neutral-200">
              <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-neutral-900">Detail Rental Overdue</h2>
                <button onclick="closeModal()" class="text-neutral-400 hover:text-neutral-600 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="p-6">
              ${modalContent}
            </div>
            <div class="p-6 border-t border-neutral-200 flex gap-3 justify-end">
              ${modalFooter}
            </div>
          </div>
        </div>
      `;

      modalContainer.innerHTML = modal;
    };
  } catch (error) {
    console.error('Error loading admin rentals:', error);
    document.getElementById('active-rentals').innerHTML = ErrorMessage('Gagal memuat data rental');
    document.getElementById('overdue-rentals').innerHTML = ErrorMessage('Gagal memuat data overdue');
  }
}
