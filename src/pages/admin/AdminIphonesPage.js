import { Sidebar} from '../../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage, EmptyState, Modal, closeModal, showAlertModal, showUserActionModal } from '../../components/common/Components.js';
import { adminAPI } from '../../js/api/endpoints.js';
import { formatCurrency, isAdmin } from '../../js/utils/helpers.js';

export async function AdminIphonesPage() {
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
            <h1 class="text-4xl font-bold">Manajemen iPhone</h1>
            <div class="flex items-center gap-3">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input type="text" id="iphone-search" placeholder="Cari nama..." class="input pl-10 pr-4 py-2 w-64" />
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                  </svg>
                </div>
                <select id="iphone-status-filter" class="input pl-10 pr-8 py-2 w-40 appearance-none">
                  <option value="">Semua</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              <button onclick="window.location.href = '/admin/iphones/create'" class="btn btn-primary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Tambah
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div id="iphones-list">
              ${LoadingSpinner()}
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  loadAdminIphones();
}

async function loadAdminIphones() {
  try {
    const response = await adminAPI.iphones.getAll();
    let iphones = response.data.data;

    if (!Array.isArray(iphones) || iphones.length === 0) {
      document.getElementById('iphones-list').innerHTML = `<div class="p-8">${EmptyState('Tidak Ada iPhone', 'Tambahkan iPhone baru')}</div>`;
      return;
    }

    const renderTable = (items) => {
      if (items.length === 0) {
        document.getElementById('iphones-list').innerHTML = `<div class="p-8 text-center text-neutral-500">Tidak ada iPhone yang sesuai dengan filter</div>`;
        return;
      }

      const container = document.getElementById('iphones-list');
      container.innerHTML = `
        <table class="w-full">
          <thead class="bg-neutral-100 border-b border-neutral-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-bold">Nama</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Harga/Hari</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Stok</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Status</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(iphone => `
              <tr class="border-b border-neutral-200 hover:bg-neutral-50">
                <td class="px-6 py-3">${iphone.name}</td>
                <td class="px-6 py-3">${formatCurrency(iphone.price_per_day)}</td>
                <td class="px-6 py-3">${iphone.stock}</td>
                <td class="px-6 py-3">
                  <span class="badge badge-${iphone.status === 'active' ? 'success' : 'warning'}">${iphone.status}</span>
                </td>
                <td class="px-6 py-3">
                  <button onclick="editIphone(${iphone.id})" class="btn btn-sm btn-secondary mr-2">Edit</button>
                  <button onclick="deleteIphone(${iphone.id})" class="btn btn-sm btn-danger">Hapus</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    };

    renderTable(iphones);

    const searchInput = document.getElementById('iphone-search');
    const statusFilter = document.getElementById('iphone-status-filter');

    const applyFilters = () => {
      const searchText = searchInput.value.toLowerCase();
      const selectedStatus = statusFilter.value;

      let filtered = iphones.filter(iphone => {
        const matchesSearch = iphone.name.toLowerCase().includes(searchText);
        const matchesStatus = !selectedStatus || iphone.status === selectedStatus;
        return matchesSearch && matchesStatus;
      });

      renderTable(filtered);
    };

    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);

    // simple HTML escape to avoid injection when inserting values into modal
    const escapeHtml = (unsafe) => {
      return String(unsafe || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    };

    window.editIphone = (id) => {
      const iphone = iphones.find(i => i.id === id);
      if (!iphone) return;

      const content = `
        <div class="space-y-4">
          <label class="block text-sm font-medium text-neutral-700">Nama</label>
          <input id="edit-iphone-name" type="text" value="${escapeHtml(iphone.name)}" class="input w-full" />

          <label class="block text-sm font-medium text-neutral-700">Harga per Hari</label>
          <input id="edit-iphone-price" type="number" value="${iphone.price_per_day}" class="input w-full" />

          <label class="block text-sm font-medium text-neutral-700">Spesifikasi</label>
          <textarea id="edit-iphone-specs" class="input w-full" rows="3">${escapeHtml(iphone.specs || '')}</textarea>

          <label class="block text-sm font-medium text-neutral-700">Stok</label>
          <input id="edit-iphone-stock" type="number" value="${iphone.stock}" class="input w-full" />

          <label class="block text-sm font-medium text-neutral-700">Status</label>
          <select id="edit-iphone-status" class="input w-full">
            <option value="active" ${iphone.status === 'active' ? 'selected' : ''}>Aktif</option>
            <option value="inactive" ${iphone.status === 'inactive' ? 'selected' : ''}>Tidak Aktif</option>
          </select>
        </div>
      `;

      const footer = `
        <button onclick="closeModal()" class="px-4 py-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all duration-200 font-medium">Batal</button>
        <button onclick="window.__saveIphoneEdit(${id})" class="btn btn-primary">Simpan</button>
      `;

      const modalHtml = Modal('Edit iPhone', content, footer);

      let modalContainer = document.getElementById('modal-container');
      if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        document.body.appendChild(modalContainer);
      }

      modalContainer.innerHTML = modalHtml;

      // attach save handler globally so inline onclick can call it
      window.__saveIphoneEdit = async (iphoneId) => {
        const name = document.getElementById('edit-iphone-name')?.value;
        const price_per_day = parseFloat(document.getElementById('edit-iphone-price')?.value);
        const specs = document.getElementById('edit-iphone-specs')?.value;
        const stock = parseInt(document.getElementById('edit-iphone-stock')?.value);
        const status = document.getElementById('edit-iphone-status')?.value;

        try {
          await adminAPI.iphones.update(iphoneId, { name, price_per_day, specs, stock, status });
          closeModal();
          showAlertModal('iPhone berhasil diupdate!', true, () => loadAdminIphones());
        } catch (err) {
          console.error('Error updating iphone:', err);
          closeModal();
          showAlertModal('Gagal mengupdate iPhone', false);
        }
      };
    };

    window.deleteIphone = (id) => {
      showUserActionModal('Hapus iPhone', 'Yakin ingin menghapus iPhone ini? Tindakan ini tidak dapat dibatalkan!', async () => {
        try {
          await adminAPI.iphones.delete(id);
          showAlertModal('iPhone berhasil dihapus!', true);
          loadAdminIphones();
        } catch (error) {
          console.error('Error deleting iphone:', error);
          showAlertModal('Gagal menghapus iPhone', false);
        }
      });
    };
  } catch (error) {
    console.error('Error loading admin iphones:', error);
    document.getElementById('iphones-list').innerHTML = ErrorMessage('Gagal memuat data iPhone');
  }
}
