import { Navbar, Footer } from '../components/layout/Layout.js';
import { LoadingSpinner, EmptyState, ErrorMessage } from '../components/common/index.js';
import { iphoneAPI } from '../js/api/endpoints.js';
import { formatCurrency } from '../js/utils/helpers.js';
import type { IPhone } from '../types/index.js';

export async function IphonesPage() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    ${Navbar()}
    <main class="container-main section">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">Katalog iPhone</h1>
        <p class="text-neutral-600">Pilih iPhone favorit Anda dari koleksi terlengkap</p>
      </div>

      <div class="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input type="text" id="search-input" placeholder="Cari iPhone..." class="input pl-10 pr-4 py-2 w-full" />
        </div>
        
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 text-neutral-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
            </svg>
            <label class="text-sm font-medium">Urutkan:</label>
          </div>
          <div class="relative">
            <select id="sort-select" class="input pl-4 pr-8 py-2 w-48 appearance-none bg-white border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all">
              <option value="default">Default</option>
              <option value="price-low">Harga Terendah</option>
              <option value="price-high">Harga Tertinggi</option>
              <option value="name-asc">Nama A-Z</option>
              <option value="name-desc">Nama Z-A</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="iphones-container">
        ${LoadingSpinner()}
      </div>
    </main>
    ${Footer()}
  `;

  loadIphones();
}

let allIphones: IPhone[] = [];

async function loadIphones() {
  try {
    const response = await iphoneAPI.getAll();
    allIphones = response.data.data || [];
    const container = document.getElementById('iphones-container');

    if (!container) return;

    if (!Array.isArray(allIphones) || allIphones.length === 0) {
      container.innerHTML = EmptyState(
        'Tidak Ada Produk',
        'Produk iPhone masih kosong. Silakan kembali nanti.'
      );
      return;
    }

    renderIphones(allIphones);

    // Setup event listeners
    setupSearchAndSort();
  } catch (error) {
    console.error('Error loading iphones:', error);
    const container = document.getElementById('iphones-container');
    if (container) {
      container.innerHTML = `
        <div class="col-span-full">
          ${ErrorMessage('Gagal memuat produk. Silakan coba lagi.')}
        </div>
      `;
    }
  }
}

function setupSearchAndSort() {
  const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
  const sortSelect = document.getElementById('sort-select') as HTMLSelectElement | null;

  const applyFilters = () => {
    const searchTerm = (searchInput?.value || '').toLowerCase();
    const sortBy = sortSelect?.value || 'default';

    let filtered = allIphones.filter((iphone: IPhone) => {
      const nameMatch = (iphone.name || '').toLowerCase().includes(searchTerm);
      const specsMatch = (iphone.specs || '').toLowerCase().includes(searchTerm);
      return nameMatch || specsMatch;
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price_per_day || 0) - (b.price_per_day || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price_per_day || 0) - (a.price_per_day || 0));
        break;
      case 'name-asc':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'name-desc':
        filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      default:
        // Keep original order
        break;
    }

    renderIphones(filtered);
  };

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);
}

function renderIphones(iphones: IPhone[]) {
  const container = document.getElementById('iphones-container');
  if (!container) return;

  if (!Array.isArray(iphones) || iphones.length === 0) {
    container.innerHTML = `<div class="col-span-full">${EmptyState('Tidak Ada Produk', 'Tidak ada produk yang sesuai dengan pencarian Anda.')}</div>`;
    return;
  }

  container.innerHTML = iphones.map((iphone: IPhone) => {
    const imageUrl = Array.isArray(iphone.images) && iphone.images.length ? iphone.images[0] : null;
    return `
    <div class="card-hover cursor-pointer" onclick="window.location.href = '/iphones/${iphone.id}'">
      <div class="h-64 bg-neutral-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
        ${imageUrl ? 
          `<img src="${imageUrl}" alt="${iphone.name}" class="max-w-full max-h-full object-contain">` : 
          '<div class="w-full h-full flex-center text-neutral-500">No Image</div>'}
      </div>
      <h3 class="font-bold text-lg mb-2">${iphone.name}</h3>
      <p class="text-neutral-600 text-sm mb-3 truncate-2">${iphone.specs}</p>
      <div class="flex-between">
        <div>
          <p class="text-xs text-neutral-500">Harga per hari</p>
          <p class="text-2xl font-bold text-primary-600">${formatCurrency(iphone.price_per_day)}</p>
        </div>
        <div class="flex flex-col gap-2">
          <span class="badge badge-success">Stok: ${iphone.stock}</span>
        </div>
      </div>
    </div>
  `;}).join('');
}
