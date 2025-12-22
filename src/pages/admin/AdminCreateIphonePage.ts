import { Sidebar } from '../../components/layout/Layout.js';
import { EmptyState, showAlertModal } from '../../components/common/index.js';
import { adminAPI } from '../../js/api/endpoints.js';
import { isAdmin } from '../../js/utils/helpers.js';

export async function AdminCreateIphonePage() {
  const app = document.getElementById('app');
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
          <div class="mb-8">
            <a href="/admin/iphones" data-link class="text-primary hover:underline mb-4 inline-block">← Kembali</a>
            <h1 class="text-4xl font-bold">Tambah iPhone</h1>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-8 max-w-2xl">
            <form id="create-iphone-form">
              <div class="mb-6">
                <label class="block text-sm font-bold mb-2">Nama iPhone</label>
                <input type="text" name="name" required class="input w-full" placeholder="e.g., iPhone 15 Pro Max">
              </div>

              <div class="mb-6">
                <label class="block text-sm font-bold mb-2">Spesifikasi</label>
                <textarea name="specs" required class="input w-full" rows="4" placeholder="Spesifikasi produk"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-sm font-bold mb-2">Harga per Hari (Rp)</label>
                  <input type="number" name="price_per_day" required class="input w-full" placeholder="0">
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Stok</label>
                  <input type="number" name="stock" required class="input w-full" placeholder="0">
                </div>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-bold mb-2">Foto</label>
                <input type="file" name="images" accept="image/*" class="input w-full">
              </div>

              <div class="flex gap-4">
                <button type="submit" class="btn btn-primary flex-1">Simpan</button>
                <a href="/admin/iphones" data-link class="btn btn-secondary flex-1 text-center">Batal</a>
              </div>
            </form>
            <div id="error-message" class="hidden mt-4 p-4 bg-red-100 text-red-700 rounded"></div>
          </div>
        </div>
      </main>
    </div>
  `;

  const createForm = document.getElementById('create-iphone-form') as HTMLFormElement | null;
  if (createForm) createForm.addEventListener('submit', handleCreateIphone);
}

async function handleCreateIphone(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement | null;
  if (!form) return;
  const formData = new FormData(form);
  
  try {
    await adminAPI.iphones.create(formData);
    showAlertModal('iPhone berhasil ditambahkan!', true);
    setTimeout(() => {
      const router = window.__router;
      router.navigate('/admin/iphones');
    }, 2000);
  } catch (error) {
    console.error('Error creating iPhone:', error);
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      const msg = (error as any)?.response?.data?.message || 'Gagal menambahkan iPhone';
      errorDiv.textContent = msg;
      errorDiv.classList.remove('hidden');
    }
  }
}
