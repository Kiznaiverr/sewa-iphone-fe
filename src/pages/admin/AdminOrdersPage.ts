import { Sidebar } from '../../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage, EmptyState, showAlertModal } from '../../components/common/index.js';
import { adminAPI } from '../../js/api/endpoints.js';
import { formatCurrency, formatDate, isAdmin } from '../../js/utils/helpers.js';

export async function AdminOrdersPage() {
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
            <h1 class="text-4xl font-bold">Manajemen Pesanan</h1>
            <div class="flex items-center gap-3">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input type="text" id="order-search" placeholder="Cari kode..." class="input pl-10 pr-4 py-2 w-64" />
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                  </svg>
                </div>
                <select id="order-status-filter" class="input pl-10 pr-8 py-2 w-40 appearance-none">
                  <option value="">Semua</option>
                  <option value="pre_ordered">Pre-Order</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div id="orders-list">
              ${LoadingSpinner()}
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  loadAdminOrders();
}

async function loadAdminOrders() {
  try {
    const response = await adminAPI.orders.getAll('newest');
    let orders = Array.isArray(response?.data?.data) ? response.data.data : (Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []));

    if (!Array.isArray(orders) || orders.length === 0) {
      document.getElementById('orders-list').innerHTML = `<div class="p-8">${EmptyState('Tidak Ada Pesanan', '')}</div>`;
      return;
    }

    const renderTable = (items) => {
      if (items.length === 0) {
        document.getElementById('orders-list').innerHTML = `<div class="p-8 text-center text-neutral-500">Tidak ada pesanan yang sesuai dengan filter</div>`;
        return;
      }

      const container = document.getElementById('orders-list');
      container.innerHTML = `
        <table class="w-full">
          <thead class="bg-neutral-100 border-b border-neutral-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-bold">Kode</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Tanggal</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Total</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Status</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(order => `
              <tr class="border-b border-neutral-200 hover:bg-neutral-50">
                <td class="px-6 py-3 font-bold">${order.order_code}</td>
                <td class="px-6 py-3">${formatDate(order.start_date)}</td>
                <td class="px-6 py-3">${formatCurrency(order.total_price)}</td>
                <td class="px-6 py-3">
                  <span class="badge badge-${order.status === 'pre_ordered' ? 'warning' : order.status === 'approved' ? 'success' : 'info'}">${order.status}</span>
                </td>
                <td class="px-6 py-3">
                  <button onclick="showUpdateStatusModal(${order.id}, '${order.status}')" class="btn btn-sm btn-secondary">Update</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    };

    renderTable(orders);

    const searchInput = document.getElementById('order-search');
    const statusFilter = document.getElementById('order-status-filter');

    const applyFilters = () => {
      const searchText = searchInput.value.toLowerCase();
      const selectedStatus = statusFilter.value;

      let filtered = orders.filter(order => {
        const matchesSearch = order.order_code.toLowerCase().includes(searchText);
        const matchesStatus = !selectedStatus || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
      });

      renderTable(filtered);
    };

    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);

    window.showUpdateStatusModal = (orderId, currentStatus) => {
      let modalContainer = document.getElementById('modal-container');
      if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        document.body.appendChild(modalContainer);
      }

      const statusOptions = currentStatus === 'pre_ordered' 
        ? ['approved', 'rejected']
        : currentStatus === 'approved'
        ? ['completed', 'rejected']
        : ['approved'];

      const modal = `
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex-center animate-modal-fade-in">
          <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 animate-modal-slide-up">
            <div class="p-6 border-b border-neutral-200">
              <h2 class="text-xl font-bold">Ubah Status Pesanan</h2>
            </div>
            <div class="p-6 space-y-3">
              ${statusOptions.map(status => `
                <button onclick="updateOrderStatus(${orderId}, '${status}')" class="w-full py-2 px-4 rounded-lg border-2 border-neutral-200 hover:border-primary-600 hover:bg-primary-50 transition-colors text-left capitalize">
                  ${status}
                </button>
              `).join('')}
            </div>
            <div class="p-6 border-t border-neutral-200 flex justify-end">
              <button onclick="closeModal()" class="btn btn-sm btn-secondary">Batal</button>
            </div>
          </div>
        </div>
      `;

      modalContainer.innerHTML = modal;
    };

    window.updateOrderStatus = async (orderId, newStatus) => {
      try {
        await adminAPI.orders.updateStatus(orderId, newStatus);
        showAlertModal(`Pesanan berhasil diubah menjadi ${newStatus}`, true);
        loadAdminOrders();
      } catch (error) {
        showAlertModal('Gagal mengupdate status pesanan', false);
      }
    };
  } catch (error) {
    console.error('Error loading admin orders:', error);
    document.getElementById('orders-list').innerHTML = ErrorMessage('Gagal memuat data pesanan');
  }
}
