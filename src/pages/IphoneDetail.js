import { Navbar, Footer } from '../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage, showOrderSuccessModal } from '../components/common/index.js';
import { iphoneAPI, userAPI } from '../js/api/endpoints.js';
import { formatCurrency, calculateDays, calculateTotalPrice, showNotification } from '../js/utils/helpers.js';

export async function IphoneDetailPage(id) {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${Navbar()}
    <main class="container-main section">
      <div id="detail-container">
        ${LoadingSpinner()}
      </div>
    </main>
    ${Footer()}
  `;

  loadIphoneDetail(id);
}

async function loadIphoneDetail(id) {
  try {
    const response = await iphoneAPI.getById(id);
    const iphone = response.data.data;
    
    // Handle images - could be string or array
    const imageUrl = iphone.images && typeof iphone.images === 'string' ? iphone.images : null;
    const images = Array.isArray(iphone.images) ? iphone.images : (imageUrl ? [imageUrl] : []);

    const container = document.getElementById('detail-container');
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div class="w-full h-96 bg-neutral-200 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
            ${images.length > 0 ? 
              `<img src="${images[0]}" alt="${iphone.name}" class="max-w-full max-h-full object-contain">` : 
              '<div class="w-full h-full flex-center text-neutral-500">No Image</div>'}
          </div>
        </div>
        <div>
          <h1 class="text-4xl font-bold mb-2">${iphone.name}</h1>
          <p class="text-lg text-neutral-600 mb-6">${iphone.specs}</p>
          
          <div class="card mb-6">
            <div class="flex-between mb-4">
              <span class="text-neutral-600">Harga per hari</span>
              <span class="text-3xl font-bold text-primary-600">${formatCurrency(iphone.price_per_day)}</span>
            </div>
            <div class="flex-between">
              <span class="text-neutral-600">Stok tersedia</span>
              <span class="badge badge-success">${iphone.stock} unit</span>
            </div>
          </div>

          ${localStorage.getItem('token') ? `
            <div id="order-form" class="card">
              <h3 class="font-bold text-lg mb-4">Pesan Sekarang</h3>
              <div class="space-y-4">
                <div>
                  <label class="label">Tanggal Mulai</label>
                  <input type="date" id="start-date" class="input" required>
                </div>
                <div>
                  <label class="label">Tanggal Kembali</label>
                  <input type="date" id="end-date" class="input" required>
                </div>
                <div class="p-4 bg-neutral-100 rounded-lg">
                  <div class="flex-between mb-2">
                    <span>Durasi</span>
                    <span id="duration" class="font-bold">0 hari</span>
                  </div>
                  <div class="flex-between mb-4 pb-4 border-b border-neutral-200">
                    <span>Total Harga</span>
                    <span id="total-price" class="text-2xl font-bold text-primary-600">Rp0</span>
                  </div>
                  <button onclick="submitOrder(${iphone.id})" class="w-full btn btn-primary">Pesan Sekarang</button>
                </div>
              </div>
            </div>
          ` : `
            <div class="card">
              <p class="text-neutral-600 mb-4">Silakan login untuk memesan iPhone ini</p>
              <a href="/login" data-link class="btn btn-primary w-full">Masuk</a>
            </div>
          `}
        </div>
      </div>
    `;

    if (localStorage.getItem('token')) {
      const startDateInput = document.getElementById('start-date');
      const endDateInput = document.getElementById('end-date');

      [startDateInput, endDateInput].forEach(input => {
        input.addEventListener('change', () => {
          if (startDateInput.value && endDateInput.value) {
            const days = calculateDays(startDateInput.value, endDateInput.value);
            const totalPrice = calculateTotalPrice(iphone.price_per_day, days);

            document.getElementById('duration').textContent = `${days} hari`;
            document.getElementById('total-price').textContent = formatCurrency(totalPrice);
          }
        });
      });

      window.submitOrder = async (iphoneId) => {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        if (!startDate || !endDate) {
          showNotification('Silakan pilih tanggal mulai dan kembali', 'warning');
          return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
          showNotification('Tanggal kembali harus lebih besar dari tanggal mulai', 'error');
          return;
        }

        try {
          // Check verification status first
          const profileResponse = await userAPI.getProfile();
          const profile = profileResponse.data.data;

          if (!profile.isverified) {
            showNotification('Anda harus memverifikasi nomor telepon terlebih dahulu untuk membuat pesanan', 'error');
            setTimeout(() => {
              window.location.href = '/verify';
            }, 2000);
            return;
          }

          await userAPI.createOrder({
            iphone_id: iphoneId,
            start_date: startDate,
            end_date: endDate,
          });

          showOrderSuccessModal();
        } catch (error) {
          showNotification('Gagal membuat pesanan: ' + error.response?.data?.message, 'error');
        }
      };
    }
  } catch (error) {
    console.error('Error loading iphone detail:', error);
    document.getElementById('detail-container').innerHTML = ErrorMessage(
      'Gagal memuat detail produk. Silakan coba lagi.'
    );
  }
}
