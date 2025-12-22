import { Sidebar } from '../../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage, EmptyState, Modal, closeModal, showAlertModal, showUserActionModal } from '../../components/common/index.js';
import { adminAPI } from '../../js/api/endpoints.js';
import { isAdmin } from '../../js/utils/helpers.js';

export async function AdminUsersPage() {
  const app = document.getElementById('app') as HTMLElement | null;
  if (!app) return;

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
            <h1 class="text-4xl font-bold">Manajemen Pengguna</h1>
            <div class="flex items-center gap-3">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input type="text" id="user-search" placeholder="Cari nama/email..." class="input pl-10 pr-4 py-2 w-64" />
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                  </svg>
                </div>
                <select id="status-filter" class="input pl-10 pr-8 py-2 w-40 appearance-none">
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
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
            <div id="users-list">
              ${LoadingSpinner()}
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  loadAdminUsers('active');

  document.getElementById('status-filter').addEventListener('change', (e) => {
    loadAdminUsers(e.target.value);
  });
}

async function loadAdminUsers(status = 'active') {
  try {
    const response = await adminAPI.users.getAll(status);
    let users = Array.isArray(response?.data?.data) ? response.data.data : (Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []));

    if (!Array.isArray(users) || users.length === 0) {
      const usersListEl = document.getElementById('users-list');
      if (usersListEl) usersListEl.innerHTML = `<div class="p-8">${EmptyState('Tidak Ada Pengguna', '')}</div>`;
      return;
    }

    const renderTable = (items: import('../../types').User[]) => {
      if (items.length === 0) {
        const usersListEl = document.getElementById('users-list');
        if (usersListEl) usersListEl.innerHTML = `<div class="p-8 text-center text-neutral-500">Tidak ada pengguna yang sesuai dengan filter</div>`;
        return;
      }

      const container = document.getElementById('users-list') as HTMLElement | null;
      if (!container) return;
      container.innerHTML = `
        <table class="w-full">
          <thead class="bg-neutral-100 border-b border-neutral-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-bold">Foto</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Nama</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Email</th>
              <th class="px-6 py-3 text-left text-sm font-bold">No. Telepon</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Status</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(user => `
              <tr class="border-b border-neutral-200 hover:bg-neutral-50">
                <td class="px-6 py-3">
                  <img src="${user.profile || 'https://i.pinimg.com/736x/9d/16/4e/9d164e4e074d11ce4de0a508914537a8.jpg'}" 
                       alt="Profile" 
                       class="w-10 h-10 rounded-full object-cover border border-neutral-200"
                       onerror="this.src='https://i.pinimg.com/736x/9d/16/4e/9d164e4e074d11ce4de0a508914537a8.jpg'">
                </td>
                <td class="px-6 py-3">${user.name || 'N/A'}</td>
                <td class="px-6 py-3">${user.email || 'N/A'}</td>
                <td class="px-6 py-3">${user.phone || 'N/A'}</td>
                <td class="px-6 py-3">
                  <span class="badge badge-${user.status === 'active' ? 'success' : 'warning'}">${user.status || 'unknown'}</span>
                </td>
                <td class="px-6 py-3">
                  <button onclick="editUser(${user.id})" class="btn btn-sm btn-secondary mr-2">Edit</button>
                  <button onclick="deleteUser(${user.id}, 'soft')" class="btn btn-sm btn-warning mr-2">Nonaktifkan</button>
                  <button onclick="deleteUser(${user.id}, 'hard')" class="btn btn-sm btn-danger">Hapus</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    };

    renderTable(users);

    const searchInput = document.getElementById('user-search') as HTMLInputElement | null;

    const applySearch = () => {
      if (!searchInput) return;
      const searchText = searchInput.value.toLowerCase();

      let filtered = users.filter((user: import('../../types').User) => {
        const matchesSearch = (user.name || '').toLowerCase().includes(searchText) ||
                            (user.email || '').toLowerCase().includes(searchText);
        return matchesSearch;
      });

      renderTable(filtered);
    };

    if (searchInput) searchInput.addEventListener('input', applySearch);

    // simple HTML escape to avoid injection when inserting values into modal
    const escapeHtml = (unsafe: unknown) => {
      return String(unsafe || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    };

    (window as any).editUser = (userId: number) => {
      const user = users.find((u: import('../../types').User) => u.id === userId);
      if (!user) return;

      const content = `
        <div class="space-y-4">
          <label class="block text-sm font-medium text-neutral-700">Nama</label>
          <input id="edit-user-name" type="text" value="${escapeHtml(user.name)}" class="input w-full" />
          <label class="block text-sm font-medium text-neutral-700">Email</label>
          <input id="edit-user-email" type="email" value="${escapeHtml(user.email)}" class="input w-full" />
        </div>
      `;

      const footer = `
        <button onclick="closeModal()" class="px-4 py-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all duration-200 font-medium">Batal</button>
        <button onclick="(window as any).__saveUserEdit(${userId})" class="btn btn-primary">Simpan</button>
      `;

      const modalHtml = Modal('Edit Pengguna', content, footer);

      let modalContainer = document.getElementById('modal-container');
      if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        document.body.appendChild(modalContainer);
      }

      modalContainer.innerHTML = modalHtml;

      // attach save handler globally so inline onclick can call it
      (window as any).__saveUserEdit = async (id: number) => {
        const name = (document.getElementById('edit-user-name') as HTMLInputElement | null)?.value ?? '';
        const email = (document.getElementById('edit-user-email') as HTMLInputElement | null)?.value ?? '';

        try {
          await adminAPI.users.update(id, { name, email });
          closeModal();
          showAlertModal('Pengguna berhasil diupdate!', true, () => loadAdminUsers(status));
        } catch (err) {
          console.error('Error updating user:', err);
          closeModal();
          showAlertModal('Gagal mengupdate pengguna', false);
        }
      };
    };

    (window as any).deleteUser = async (userId: number, type: 'soft' | 'hard') => {
      const title = type === 'soft' ? 'Nonaktifkan Pengguna' : 'Hapus Pengguna';
      const message = type === 'soft'
        ? 'Nonaktifkan pengguna ini? Pengguna masih bisa diaktifkan kembali.'
        : 'Hapus permanen pengguna ini? Tindakan ini tidak dapat dibatalkan!';

      showUserActionModal(title, message, async () => {
        try {
          if (type === 'soft') {
            await adminAPI.users.softDelete(userId);
          } else {
            await adminAPI.users.delete(userId);
          }
          showAlertModal('Pengguna berhasil dihapus!', true);
          loadAdminUsers(status);
        } catch (error) {
          console.error('Error deleting user:', error);
          showAlertModal('Gagal menghapus pengguna', false);
        }
      });
    };
  } catch (error) {
    console.error('Error loading admin users:', error);
    document.getElementById('users-list').innerHTML = ErrorMessage('Gagal memuat data pengguna');
  }
}
