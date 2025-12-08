import { Sidebar } from '../../components/layout/Layout.js';
import { LoadingSpinner } from '../../components/common/index.js';
import { adminAPI } from '../../js/api/endpoints.js';
import { formatDate, isAdmin } from '../../js/utils/helpers.js';

// Re-export all admin pages
export { AdminIphonesPage } from './AdminIphonesPage.js';
export { AdminOrdersPage } from './AdminOrdersPage.js';
export { AdminRentalsPage } from './AdminRentalsPage.js';
export { AdminUsersPage } from './AdminUsersPage.js';
export { AdminTestimonialsPage } from './AdminTestimonialsPage.js';
export { AdminCreateIphonePage } from './AdminCreateIphonePage.js';

export async function AdminDashboardPage() {
  const app = document.getElementById('app');

  if (!isAdmin()) {
    app.innerHTML = '<div class="container-main section text-center py-20"><p>Akses Ditolak</p></div>';
    return;
  }

  app.innerHTML = `
    <div class="flex bg-neutral-50 min-h-screen">
      ${Sidebar()}
      <main class="flex-1">
        <div class="p-8">
          <h1 class="text-4xl font-bold mb-8">Dashboard Admin</h1>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="card">
              <p class="text-neutral-600 text-sm mb-2">Total Pengguna</p>
              <p id="stat-users" class="text-3xl font-bold">-</p>
            </div>
            <div class="card">
              <p class="text-neutral-600 text-sm mb-2">Total iPhone</p>
              <p id="stat-iphones" class="text-3xl font-bold">-</p>
            </div>
            <div class="card">
              <p class="text-neutral-600 text-sm mb-2">Total Pesanan</p>
              <p id="stat-orders" class="text-3xl font-bold">-</p>
            </div>
            <div class="card">
              <p class="text-neutral-600 text-sm mb-2">Rental Aktif</p>
              <p id="stat-rentals" class="text-3xl font-bold">-</p>
            </div>
          </div>

          <div class="flex justify-end mb-6">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input type="text" id="dashboard-search" placeholder="Cari kode pesanan..." class="input pl-10 pr-4 py-2 w-64" />
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card">
              <h2 class="text-xl font-bold mb-4">Pesanan Terbaru</h2>
              <div id="recent-orders">
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

  loadDashboardData();
}

async function loadDashboardData() {
  try {
    const results = await Promise.allSettled([
      adminAPI.users.getAll('active'),
      adminAPI.iphones.getAll(),
      adminAPI.orders.getAll('newest'),
      adminAPI.rentals.getAll(),
      adminAPI.rentals.getOverdue(),
    ]);

    const usersRes = results[0].status === 'fulfilled' ? results[0].value : {};
    const iphonesRes = results[1].status === 'fulfilled' ? results[1].value : {};
    const ordersRes = results[2].status === 'fulfilled' ? results[2].value : {};
    const rentalsRes = results[3].status === 'fulfilled' ? results[3].value : {};
    const overdueRes = results[4].status === 'fulfilled' ? results[4].value : {};

    // Parse response - axios wraps response in .data, then API wraps data in .data again
    const users = Array.isArray(usersRes?.data?.data) ? usersRes.data.data : (Array.isArray(usersRes?.data) ? usersRes.data : (Array.isArray(usersRes) ? usersRes : []));
    const iphones = Array.isArray(iphonesRes?.data?.data) ? iphonesRes.data.data : (Array.isArray(iphonesRes?.data) ? iphonesRes.data : (Array.isArray(iphonesRes) ? iphonesRes : []));
    const orders = Array.isArray(ordersRes?.data?.data) ? ordersRes.data.data : (Array.isArray(ordersRes?.data) ? ordersRes.data : (Array.isArray(ordersRes) ? ordersRes : []));
    const rentals = Array.isArray(rentalsRes?.data?.data) ? rentalsRes.data.data : (Array.isArray(rentalsRes?.data) ? rentalsRes.data : (Array.isArray(rentalsRes) ? rentalsRes : []));
    const overdue = Array.isArray(overdueRes?.data?.data) ? overdueRes.data.data : (Array.isArray(overdueRes?.data) ? overdueRes.data : (Array.isArray(overdueRes) ? overdueRes : []));

    document.getElementById('stat-users').textContent = users.length;
    document.getElementById('stat-iphones').textContent = iphones.length;
    document.getElementById('stat-orders').textContent = orders.length;
    document.getElementById('stat-rentals').textContent = rentals.length;

    let recentOrders = orders.slice(0, 5);
    let overdueRentals = overdue.slice(0, 5);

    const renderDashboardLists = (ordersList, rentalsList) => {
      const recentOrdersHtml = ordersList.length > 0 ? ordersList.map(order => `
        <div class="py-3 border-b border-neutral-200 flex-between">
          <div>
            <p class="font-bold">${order.order_code || 'N/A'}</p>
            <p class="text-xs text-neutral-500">${formatDate(order.start_date || new Date())}</p>
          </div>
          <span class="badge badge-${order.status === 'pre_ordered' ? 'warning' : 'success'}">${order.status || 'unknown'}</span>
        </div>
      `).join('') : '<p class="text-neutral-500">Tidak ada pesanan yang sesuai</p>';

      document.getElementById('recent-orders').innerHTML = recentOrdersHtml;

      const overdueRentalsHtml = rentalsList.length > 0 ? rentalsList.map(rental => `
        <div class="py-3 border-b border-neutral-200 flex-between">
          <div>
            <p class="font-bold">ID: ${rental.id}</p>
            <p class="text-xs text-neutral-500">Jatuh tempo: ${formatDate(rental.end_date || new Date())}</p>
          </div>
          <span class="badge badge-error">Overdue</span>
        </div>
      `).join('') : '<p class="text-neutral-500">Tidak ada rental overdue yang sesuai</p>';

      document.getElementById('overdue-rentals').innerHTML = overdueRentalsHtml;
    };

    renderDashboardLists(recentOrders, overdueRentals);

    const searchInput = document.getElementById('dashboard-search');

    const applySearch = () => {
      const searchText = searchInput.value.toLowerCase();

      const filteredOrders = recentOrders.filter(order =>
        (order.order_code || '').toLowerCase().includes(searchText)
      );

      const filteredRentals = overdueRentals.filter(rental =>
        rental.id.toString().includes(searchText) ||
        (rental.user_name || '').toLowerCase().includes(searchText)
      );

      renderDashboardLists(filteredOrders, filteredRentals);
    };

    searchInput.addEventListener('input', applySearch);
  } catch (error) {
    console.error('Error loading dashboard:', error);
    document.getElementById('stat-users').textContent = '0';
    document.getElementById('stat-iphones').textContent = '0';
    document.getElementById('stat-orders').textContent = '0';
    document.getElementById('stat-rentals').textContent = '0';
    document.getElementById('recent-orders').innerHTML = '<p class="text-red-500">Gagal memuat data</p>';
    document.getElementById('overdue-rentals').innerHTML = '<p class="text-red-500">Gagal memuat data</p>';
  }
}

