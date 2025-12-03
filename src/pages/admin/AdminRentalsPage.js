import { Sidebar } from '../../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage, EmptyState, showAlertModal } from '../../components/common/index.js';
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
          <p class="text-sm text-neutral-600">Periode: ${formatDate(rental.start_date)} - ${formatDate(rental.end_date)}</p>
          <button onclick="returnRental(${rental.id})" class="btn btn-sm btn-primary mt-2">Proses Return</button>
        </div>
      `).join('') : '<p class="text-neutral-500">Tidak ada rental aktif yang sesuai</p>';

      const overdueHtml = overdueItems.length > 0 ? overdueItems.map(rental => `
        <div class="py-3 border-b border-neutral-200">
          <div class="flex-between mb-2">
            <p class="font-bold">ID: ${rental.id}</p>
            <span class="badge badge-error">Overdue</span>
          </div>
          <p class="text-sm text-neutral-600">iPhone: ${rental.iphone_name || 'N/A'}</p>
          <p class="text-sm text-neutral-600">Pengguna: ${rental.user_name || 'N/A'}</p>
          <p class="text-sm text-neutral-600">Jatuh Tempo: ${formatDate(rental.end_date)}</p>
          <button onclick="returnRental(${rental.id})" class="btn btn-sm btn-danger mt-2">Selesaikan Overdue</button>
        </div>
      `).join('') : '<p class="text-neutral-500">Tidak ada rental overdue yang sesuai</p>';

      document.getElementById('active-rentals').innerHTML = activeHtml;
      document.getElementById('overdue-rentals').innerHTML = overdueHtml;
    };

    renderRentals(activeRentals, overdueRentals);

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
  } catch (error) {
    console.error('Error loading admin rentals:', error);
    document.getElementById('active-rentals').innerHTML = ErrorMessage('Gagal memuat data rental');
    document.getElementById('overdue-rentals').innerHTML = ErrorMessage('Gagal memuat data overdue');
  }
}
