import { Navbar, Footer } from '../../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../../components/common/index.js';
import { userAPI } from '../../js/api/endpoints.js';
import { formatDate, formatCurrency } from '../../js/utils/helpers.js';

export async function RentalsPage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${Navbar()}
    <main class="container-main section">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">Rental Saya</h1>
        <p class="text-neutral-600">Kelola penyewaan iPhone Anda</p>
      </div>

      <!-- Penalty Warning -->
      <div id="penalty-warning" class="hidden mb-6">
        <div class="alert alert-error">
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-error bg-opacity-20 rounded-full flex-center flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-error mb-1">Pemberitahuan Denda</h4>
              <p id="penalty-message" class="text-sm text-neutral-700"></p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Active Rentals -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Rental Aktif
          </h2>
          <div id="active-rentals">
            ${LoadingSpinner()}
          </div>
        </div>

        <!-- Overdue Rentals -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Rental Overdue
          </h2>
          <div id="overdue-rentals">
            ${LoadingSpinner()}
          </div>
        </div>
      </div>
    </main>
    ${Footer()}
  `;

  loadRentals();
}

async function loadRentals() {
  try {
    // Fetch both active rentals and profile (with penalty info)
    const [rentalsRes, profileRes] = await Promise.allSettled([
      userAPI.getRentals(),
      userAPI.getProfile(),
    ]);

    let activeRentals = [];
    let penaltyInfo = null;

    if (rentalsRes.status === 'fulfilled') {
      activeRentals = Array.isArray(rentalsRes.value?.data?.data)
        ? rentalsRes.value.data.data
        : (Array.isArray(rentalsRes.value?.data) ? rentalsRes.value.data : []);
    }

    if (profileRes.status === 'fulfilled') {
      penaltyInfo = profileRes.value?.data?.data?.penalty_info || null;

      // Show penalty warning if exists
      if (penaltyInfo?.has_penalty) {
        const penaltyWarning = document.getElementById('penalty-warning');
        const penaltyMessage = document.getElementById('penalty-message');

        penaltyWarning.classList.remove('hidden');
        penaltyMessage.textContent = penaltyInfo.warning;
      }
    }

    renderActiveRentals(activeRentals);
    renderOverdueRentals(penaltyInfo?.overdue_rentals || []);

  } catch (error) {
    console.error('Error loading rentals:', error);
    document.getElementById('active-rentals').innerHTML = ErrorMessage('Gagal memuat data rental aktif');
    document.getElementById('overdue-rentals').innerHTML = ErrorMessage('Gagal memuat data rental overdue');
  }
}

function renderActiveRentals(rentals) {
  const container = document.getElementById('active-rentals');

  if (!Array.isArray(rentals) || rentals.length === 0) {
    container.innerHTML = EmptyState('Tidak Ada Rental Aktif', 'Anda belum memiliki penyewaan iPhone yang sedang berlangsung');
    return;
  }

  container.innerHTML = `
    <div class="space-y-4">
      ${rentals.map(rental => `
        <div class="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-bold text-lg">${rental.iphone_name || 'N/A'}</h3>
              <p class="text-sm text-neutral-600">Order: ${rental.order_code || 'N/A'}</p>
            </div>
            <span class="badge badge-success">Aktif</span>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Tanggal Mulai</p>
              <p class="text-sm font-semibold">${formatDate(rental.rental_start_date)}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Tanggal Akhir</p>
              <p class="text-sm font-semibold">${formatDate(rental.rental_end_date)}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Harga/Hari</p>
              <p class="text-sm font-semibold">${formatCurrency(rental.price_per_day)}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Total</p>
              <p class="text-sm font-semibold">${formatCurrency(rental.order_total)}</p>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-neutral-200">
            <div class="text-xs text-neutral-500">
              Dibuat: ${formatDate(rental.created_at)}
            </div>
            <div class="text-xs text-neutral-500">
              Status: <span class="capitalize">${rental.status}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderOverdueRentals(overdueRentals) {
  const container = document.getElementById('overdue-rentals');

  if (!Array.isArray(overdueRentals) || overdueRentals.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8">
        <div class="w-16 h-16 bg-success bg-opacity-10 rounded-full flex-center mx-auto mb-4">
          <svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Tidak Ada Overdue</h3>
        <p class="text-sm text-neutral-600">Semua penyewaan Anda dalam kondisi baik</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="space-y-4">
      ${overdueRentals.map(rental => `
        <div class="border border-error border-opacity-30 rounded-lg p-4 bg-error bg-opacity-5">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-bold text-lg text-neutral-900">${rental.iphone_name || 'N/A'}</h3>
              <p class="text-sm text-neutral-600">Order: ${rental.order_code || 'N/A'}</p>
            </div>
            <span class="badge badge-error">Overdue</span>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Hari Terlambat</p>
              <p class="text-lg font-bold text-error">${rental.days_overdue || 0} hari</p>
            </div>
            <div>
              <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Denda/Hari</p>
              <p class="text-sm font-semibold text-neutral-900">${formatCurrency(rental.daily_penalty)}</p>
            </div>
            <div class="col-span-2">
              <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Total Denda</p>
              <p class="text-xl font-bold text-error">${formatCurrency(rental.penalty_amount)}</p>
            </div>
          </div>

          <div class="bg-error bg-opacity-10 rounded-lg p-3 mb-3">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-error mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div>
                <p class="text-sm font-medium text-error">Perhatian</p>
                <p class="text-xs text-neutral-700">Silakan hubungi admin untuk menyelesaikan denda sebelum dapat membuat pesanan baru.</p>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}