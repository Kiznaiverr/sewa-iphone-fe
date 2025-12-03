import { Navbar, Footer } from '../components/layout/Layout.js';
import { LoadingSpinner, EmptyState, ErrorMessage } from '../components/common/Components.js';
import { testimonialAPI } from '../js/api/endpoints.js';

export async function HomePage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${Navbar()}
    <main>
      <section class="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div class="container-main">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 class="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                Sewa iPhone Impianmu
              </h1>
              <p class="text-lg text-neutral-600 mb-8">
                Dapatkan iPhone terbaru dengan harga terjangkau. Prosesnya mudah, cepat, dan aman.
              </p>
              <div class="flex gap-4">
                <a href="/iphones" data-link class="btn btn-primary btn-lg">Lihat Produk</a>
                <a href="/register" data-link class="btn btn-secondary-outline btn-lg">Daftar Sekarang</a>
              </div>
            </div>
            <div class="h-96 bg-neutral-200 rounded-2xl flex-center">
              <svg class="w-32 h-32 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-neutral-100 section">
        <div class="container-main">
          <h2 class="text-3xl font-bold text-center mb-12">Mengapa Pilih Kami</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="card">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex-center mb-4">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="font-bold mb-2">Harga Terjangkau</h3>
              <p class="text-neutral-600 text-sm">Nikmati harga sewa yang kompetitif tanpa mengorbankan kualitas</p>
            </div>
            <div class="card">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex-center mb-4">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="font-bold mb-2">Proses Cepat</h3>
              <p class="text-neutral-600 text-sm">Pengajuan hingga persetujuan hanya dalam hitungan menit</p>
            </div>
            <div class="card">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex-center mb-4">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="font-bold mb-2">Aman dan Terpercaya</h3>
              <p class="text-neutral-600 text-sm">Verifikasi penuh dan asuransi untuk melindungi kepentingan Anda</p>
            </div>
          </div>
        </div>
      </section>

      <section class="container-main section">
        <h2 class="text-3xl font-bold text-center mb-12">Testimoni Pelanggan</h2>
        <div id="testimonials-container">
          <div class="grid-responsive">
            ${LoadingSpinner()}
          </div>
        </div>
      </section>
    </main>
    ${Footer()}
  `;

  loadTestimonials();
}

async function loadTestimonials() {
  try {
    const response = await testimonialAPI.getAll();
    const allTestimonials = response.data.data;
    const testimonials = allTestimonials.slice(0, 3);

    if (!Array.isArray(testimonials) || testimonials.length === 0) {
      document.getElementById('testimonials-container').innerHTML = EmptyState(
        'Belum Ada Testimoni',
        'Jadilah pelanggan pertama yang memberikan testimoni'
      );
      return;
    }

    const container = document.getElementById('testimonials-container');
    container.innerHTML = testimonials.map(testimonial => `
      <div class="card">
        <div class="flex gap-1 mb-4 items-center">
          <div class="flex gap-1">
            ${'<span class="text-warning text-lg">★</span>'.repeat(testimonial.rating)}
          </div>
          <span class="text-sm text-neutral-600">${testimonial.rating}/5</span>
        </div>
        <p class="text-neutral-600 mb-4 italic">"${testimonial.message}"</p>
        <p class="font-bold text-sm">${testimonial.user_name || 'Pelanggan'}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading testimonials:', error);
    document.getElementById('testimonials-container').innerHTML = `
      <div class="col-span-full">
        ${ErrorMessage('Gagal memuat testimoni.')}
      </div>
    `;
  }
}
