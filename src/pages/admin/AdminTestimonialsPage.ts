import { Sidebar } from '../../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage, EmptyState, showAlertModal, showDeleteModal } from '../../components/common/index.js';
import { testimonialAPI, adminAPI } from '../../js/api/endpoints.js';
import { isAdmin } from '../../js/utils/helpers.js';

export async function AdminTestimonialsPage() {
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
            <h1 class="text-4xl font-bold">Manajemen Testimoni</h1>
            <div class="flex items-center gap-3">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input type="text" id="testimonial-search" placeholder="Cari berdasarkan nama/pesan..." class="input pl-10 pr-4 py-2 w-64" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div id="testimonials-list">
              ${LoadingSpinner()}
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  loadAdminTestimonials();
}

async function loadAdminTestimonials() {
  try {
    const response = await testimonialAPI.getAll();
    const testimonials = response.data.data;

    const testimonialsListEl = document.getElementById('testimonials-list') as HTMLElement | null;
    if (!Array.isArray(testimonials) || testimonials.length === 0) {
      if (testimonialsListEl) testimonialsListEl.innerHTML = `<div class="p-8">${EmptyState('Tidak Ada Testimoni', 'Belum ada testimoni yang diberikan pengguna')}</div>`;
      return;
    }

    const renderTable = (items: import('../../types').AdminTestimonial[]) => {
      if (items.length === 0) {
        if (testimonialsListEl) testimonialsListEl.innerHTML = `<div class="p-8 text-center text-neutral-500">Tidak ada testimoni yang sesuai dengan pencarian</div>`;
        return;
      }

      const container = testimonialsListEl;
      if (!container) return;
      container.innerHTML = `
        <table class="w-full">
          <thead class="bg-neutral-100 border-b border-neutral-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-bold">Pengguna</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Rating</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Pesan</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Tanggal</th>
              <th class="px-6 py-3 text-left text-sm font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(testimonial => `
              <tr class="border-b border-neutral-200 hover:bg-neutral-50">
                <td class="px-6 py-3">
                  <div class="flex items-center gap-3">
                    <img src="${testimonial.profile || 'https://i.pinimg.com/736x/9d/16/4e/9d164e4e074d11ce4de0a508914537a8.jpg'}" 
                         alt="Profile" 
                         class="w-8 h-8 rounded-full object-cover border border-neutral-200"
                         onerror="this.src='https://i.pinimg.com/736x/9d/16/4e/9d164e4e074d11ce4de0a508914537a8.jpg'">
                    <div>
                      <div class="font-medium">${testimonial.user_name || 'N/A'}</div>
                      <div class="text-xs text-neutral-500">ID: ${testimonial.user_id}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-3">
                  <div class="flex items-center gap-1">
                    <div class="flex gap-1">
                      ${'<span class="text-warning">★</span>'.repeat(testimonial.rating)}
                    </div>
                    <span class="text-sm text-neutral-600 ml-1">${testimonial.rating}/5</span>
                  </div>
                </td>
                <td class="px-6 py-3 max-w-xs">
                  <div class="truncate" title="${testimonial.message}">
                    "${testimonial.message}"
                  </div>
                </td>
                <td class="px-6 py-3 text-sm text-neutral-600">
                  ${testimonial.created_at ? new Date(testimonial.created_at).toLocaleDateString('id-ID') : 'N/A'}
                </td>
                <td class="px-6 py-3">
                  <button onclick="deleteTestimonial(${testimonial.id})" class="btn btn-sm btn-danger">
                    Hapus
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    };

    renderTable(testimonials);

    const searchInput = document.getElementById('testimonial-search') as HTMLInputElement | null;

    const applySearch = () => {
      if (!searchInput) return;
      const searchText = searchInput.value.toLowerCase();

      let filtered = testimonials.filter((testimonial: import('../../types').AdminTestimonial) => {
        const text = (testimonial.message ?? testimonial.content ?? '').toString();
        const matchesSearch = (testimonial.user_name || '').toLowerCase().includes(searchText) ||
                            text.toLowerCase().includes(searchText);
        return matchesSearch;
      });

      renderTable(filtered);
    };

    if (searchInput) searchInput.addEventListener('input', applySearch);

    (window as any).deleteTestimonial = async (testimonialId: number) => {
      // Set up the callback for actual deletion
      (window as any).__deleteTestimonialCallback = async (id: number) => {
        try {
          await adminAPI.testimonials.delete(id);
          showAlertModal('Testimoni berhasil dihapus!', true);
          await loadAdminTestimonials();
        } catch (err) {
          console.error('Error deleting testimonial:', err);
          showAlertModal('Gagal menghapus testimoni', false);
        }
      };

      // Show confirmation modal
      showDeleteModal(testimonialId);
    };

  } catch (error) {
    console.error('Error loading admin testimonials:', error);
    document.getElementById('testimonials-list').innerHTML = ErrorMessage('Gagal memuat data testimoni');
  }
}