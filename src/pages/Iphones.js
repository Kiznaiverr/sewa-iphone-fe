import { Navbar, Footer } from '../components/layout/Layout.js';
import { LoadingSpinner, EmptyState, ErrorMessage } from '../components/common/Components.js';
import { iphoneAPI } from '../js/api/endpoints.js';
import { formatCurrency } from '../js/utils/helpers.js';

export async function IphonesPage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${Navbar()}
    <main class="container-main section">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">Katalog iPhone</h1>
        <p class="text-neutral-600">Pilih iPhone favorit Anda dari koleksi terlengkap</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="iphones-container">
        ${LoadingSpinner()}
      </div>
    </main>
    ${Footer()}
  `;

  loadIphones();
}

async function loadIphones() {
  try {
    const response = await iphoneAPI.getAll();
    const iphones = response.data.data || [];

    if (!Array.isArray(iphones) || iphones.length === 0) {
      document.getElementById('iphones-container').innerHTML = EmptyState(
        'Tidak Ada Produk',
        'Produk iPhone masih kosong. Silakan kembali nanti.'
      );
      return;
    }

    const container = document.getElementById('iphones-container');
    container.innerHTML = iphones.map(iphone => {
      const imageUrl = iphone.images && typeof iphone.images === 'string' ? iphone.images : null;
      return `
      <div class="card-hover cursor-pointer" onclick="window.location.href = '/iphones/${iphone.id}'">
        <div class="h-48 bg-neutral-200 rounded-lg mb-4 overflow-hidden">
          ${imageUrl ? 
            `<img src="${imageUrl}" alt="${iphone.name}" class="w-full h-full object-cover">` : 
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
  } catch (error) {
    console.error('Error loading iphones:', error);
    document.getElementById('iphones-container').innerHTML = `
      <div class="col-span-full">
        ${ErrorMessage('Gagal memuat produk. Silakan coba lagi.')}
      </div>
    `;
  }
}
