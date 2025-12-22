import { Navbar, Footer } from '../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/common/index.js';
import { userAPI } from '../js/api/endpoints.js';
import { formatCurrency, formatDate, isAuthenticated } from '../js/utils/helpers.js';

function calculateDuration(startDate: string | number | Date, endDate: string | number | Date) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export async function TrackOrderPage(code: string) {
  const app = document.getElementById('app');
  if (!app) return;

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

async function loadTrackingData(code: string) {
  try {
    const response = await userAPI.trackOrder(code);
    const order = response.data.data;

    const statusSteps = ['pre_ordered', 'approved', 'completed'];
    const currentStep = statusSteps.indexOf(order.status);

    const container = document.getElementById('track-container');
    if (!container) return;
    container.innerHTML = `
      <div class="card mb-6">
        <h2 class="text-2xl font-bold mb-6">Informasi Pesanan</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pb-8 border-b border-neutral-200">
          <div>
            <p class="text-xs text-neutral-500 mb-1">Kode Pesanan</p>
            <p class="font-bold text-lg">${order.order_code}</p>
          </div>
          <div>
            <p class="text-xs text-neutral-500 mb-1">Model iPhone</p>
            <p class="font-bold">${order.iphone_name || 'N/A'}</p>
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
            <p class="text-xs text-neutral-500 mb-1">Durasi Sewa</p>
            <p class="font-bold">${calculateDuration(order.start_date, order.end_date)} hari</p>
          </div>
          <div>
            <p class="text-xs text-neutral-500 mb-1">Total Harga</p>
            <p class="font-bold text-primary-600">${formatCurrency(order.total_price)}</p>
          </div>
          <div>
            <p class="text-xs text-neutral-500 mb-1">Tanggal Pesan</p>
            <p class="font-bold">${formatDate(order.created_at || order.start_date)}</p>
          </div>
          <div>
            <p class="text-xs text-neutral-500 mb-1">Status</p>
            <span class="badge badge-${order.status === 'pre_ordered' ? 'warning' : order.status === 'approved' ? 'info' : 'success'}">${order.status.replace('_', ' ')}</span>
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
    `;
  } catch (error) {
    console.error('Error loading tracking data:', error);
    const container = document.getElementById('track-container');
    if (container) {
      container.innerHTML = ErrorMessage('Gagal memuat data pesanan. Periksa kode pesanan Anda.');
    }
  }
}
