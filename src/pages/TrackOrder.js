import { Navbar, Footer } from '../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/common/Components.js';
import { userAPI } from '../js/api/endpoints.js';
import { formatCurrency, formatDate, isAuthenticated } from '../js/utils/helpers.js';

export async function TrackOrderPage(code) {
  const app = document.getElementById('app');

  if (!isAuthenticated()) {
    app.innerHTML = `
      ${Navbar()}
      <main class="container-main section">
        ${EmptyState('Tidak Diizinkan', 'Silakan login untuk melacak pesanan', 'Masuk', '/login')}
      </main>
      ${Footer()}
    `;
    return;
  }

  app.innerHTML = `
    ${Navbar()}
    <main class="container-main section">
      <div class="mb-8">
        <a href="/orders" data-link class="text-primary-600 hover:text-primary-700 mb-4 inline-block">← Kembali ke Pesanan</a>
        <h1 class="text-4xl font-bold mb-2">Lacak Pesanan</h1>
        <p class="text-neutral-600">Kode: <span class="font-bold">${code}</span></p>
      </div>

      <div class="max-w-2xl mx-auto" id="track-container">
        ${LoadingSpinner()}
      </div>
    </main>
    ${Footer()}
  `;

  loadTrackingData(code);
}

async function loadTrackingData(code) {
  try {
    const response = await userAPI.trackOrder(code);
    const order = response.data.data;

    const statusSteps = ['pre_ordered', 'approved', 'completed'];
    const currentStep = statusSteps.indexOf(order.status);

    const container = document.getElementById('track-container');
    container.innerHTML = `
      <div class="card mb-6">
        <h2 class="text-2xl font-bold mb-6">Rincian Pesanan</h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-neutral-200">
          <div>
            <p class="text-xs text-neutral-500 mb-1">Kode Pesanan</p>
            <p class="font-bold text-lg">${order.order_code}</p>
          </div>
          <div>
            <p class="text-xs text-neutral-500 mb-1">Tanggal Mulai</p>
            <p class="font-bold">${formatDate(order.start_date)}</p>
          </div>
          <div>
            <p class="text-xs text-neutral-500 mb-1">Tanggal Kembali</p>
            <p class="font-bold">${formatDate(order.end_date)}</p>
          </div>
          <div>
            <p class="text-xs text-neutral-500 mb-1">Total Harga</p>
            <p class="font-bold text-primary-600">${formatCurrency(order.total_price)}</p>
          </div>
        </div>

        <h3 class="text-lg font-bold mb-6">Status Pesanan</h3>

        <div class="space-y-6">
          ${statusSteps.map((step, index) => {
            const isCompleted = index <= currentStep;

            return `
              <div class="flex gap-4">
                <div class="flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full flex-center ${
                    isCompleted ? 'bg-success text-white' : 'bg-neutral-200 text-neutral-400'
                  } font-bold mb-2">
                    ${isCompleted ? '✓' : index + 1}
                  </div>
                  ${index < statusSteps.length - 1 ? `
                    <div class="w-1 h-16 ${isCompleted && index < currentStep ? 'bg-success' : 'bg-neutral-200'}"></div>
                  ` : ''}
                </div>
                <div class="pt-1">
                  <p class="font-bold capitalize">${step.replace('_', ' ')}</p>
                  <p class="text-sm text-neutral-600">
                    ${step === 'pre_ordered' ? 'Pesanan sedang dalam antrian' : ''}
                    ${step === 'approved' ? 'Pesanan telah disetujui dan siap diambil' : ''}
                    ${step === 'completed' ? 'Pesanan telah selesai dan dikembalikan' : ''}
                  </p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="card">
        <h2 class="text-xl font-bold mb-4">Informasi Tambahan</h2>
        <div class="space-y-3">
          <div class="flex-between pb-3 border-b border-neutral-200">
            <span class="text-neutral-600">ID Pesanan</span>
            <span class="font-bold">#${order.id}</span>
          </div>
          <div class="flex-between pb-3 border-b border-neutral-200">
            <span class="text-neutral-600">User ID</span>
            <span class="font-bold">#${order.user_id}</span>
          </div>
          <div class="flex-between pb-3 border-b border-neutral-200">
            <span class="text-neutral-600">iPhone ID</span>
            <span class="font-bold">#${order.iphone_id}</span>
          </div>
          <div class="flex-between">
            <span class="text-neutral-600">Status Saat Ini</span>
            <span class="badge badge-${order.status === 'pre_ordered' ? 'warning' : 'success'}">${order.status}</span>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading tracking data:', error);
    const container = document.getElementById('track-container');
    container.innerHTML = ErrorMessage('Gagal memuat data pesanan. Periksa kode pesanan Anda.');
  }
}
