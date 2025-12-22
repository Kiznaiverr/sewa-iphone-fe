import { Navbar, Footer } from '../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/common/index.js';
import { userAPI } from '../js/api/endpoints.js';
import { formatCurrency, formatDate, isAuthenticated } from '../js/utils/helpers.js';
import type { Order, OrderStatus } from '../types/index.js';

export async function OrdersPage() {
  const app = document.getElementById('app');
  if (!app) return;

  if (!isAuthenticated()) {
    app.innerHTML = `
      ${Navbar()}
      <main class="container-main section">
        ${EmptyState('Tidak Diizinkan', 'Silakan login untuk melihat pesanan Anda', 'Masuk', '/login')}
      </main>
      ${Footer()}
    `;
    return;
  }

  app.innerHTML = `
    ${Navbar()}
    <main class="container-main section">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">Pesanan Saya</h1>
        <p class="text-neutral-600">Kelola dan lacak semua pesanan sewa Anda</p>
      </div>

      <div id="orders-container">
        ${LoadingSpinner()}
      </div>
    </main>
    ${Footer()}
  `;

  loadOrders();
}

async function loadOrders() {
  try {
    const response = await userAPI.getOrders();
    const orders: Order[] = response.data.data || [];
    const container = document.getElementById('orders-container');

    if (!container) return;

    if (!Array.isArray(orders) || orders.length === 0) {
      container.innerHTML = EmptyState(
        'Belum Ada Pesanan',
        'Mulai sewa iPhone favorit Anda sekarang',
        'Lihat Produk',
        '/iphones'
      );
      return;
    }

    const statusBadgeMap: Record<OrderStatus, string> = {
      pre_ordered: 'badge-warning',
      approved: 'badge-success',
      completed: 'badge-info',
      rejected: 'badge-danger',
    };

    container.innerHTML = orders.map((order: Order) => `
      <div class="card mb-4">
        <div class="flex-between mb-4">
          <div>
            <p class="text-sm text-neutral-500">Kode Pesanan</p>
            <p class="text-lg font-bold">${order.order_code}</p>
          </div>
          <span class="badge ${statusBadgeMap[order.status]}">${order.status.replace('_', ' ')}</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-neutral-200">
          <div>
            <p class="text-xs text-neutral-500">Tanggal Mulai</p>
            <p class="font-bold">${formatDate(order.start_date)}</p>
          </div>
          <div>
            <p class="text-xs text-neutral-500">Tanggal Kembali</p>
            <p class="font-bold">${formatDate(order.end_date)}</p>
          </div>
          <div>
            <p class="text-xs text-neutral-500">Total Harga</p>
            <p class="font-bold text-primary-600">${formatCurrency(order.total_price)}</p>
          </div>
          <div>
            <p class="text-xs text-neutral-500">Status</p>
            <p class="font-bold capitalize">${order.status}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button onclick="trackOrder('${order.order_code}')" class="btn btn-sm btn-secondary">Lacak</button>
        </div>
      </div>
    `).join('');

    window.trackOrder = (code: string) => {
      // Use dynamic route handler
      window.__handleDynamicRoute(`/orders/track/${code}`);
    };
  } catch (error) {
    console.error('Error loading orders:', error);
    const container = document.getElementById('orders-container');
    if (container) {
      container.innerHTML = ErrorMessage('Gagal memuat pesanan. Silakan coba lagi.');
    }
  }
}
