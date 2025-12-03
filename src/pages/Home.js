import { Navbar, Footer } from '../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage } from '../components/common/index.js';
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
            <div class="h-96 bg-neutral-200 rounded-2xl overflow-hidden">
              <img src="/images/banner.jpeg" alt="iPhone Rental Service" class="w-full h-full object-cover">
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
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold mb-4">Testimoni Pelanggan</h2>
          <p class="text-neutral-600 mb-6">Apa kata pelanggan kami tentang pengalaman menggunakan layanan sewa iPhone</p>
        </div>
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
    const testimonials = allTestimonials.slice(0, 3); // Only show 3 testimonials

    if (!Array.isArray(testimonials) || testimonials.length === 0) {
      document.getElementById('testimonials-container').innerHTML = `
        <div class="text-center py-12">
          <div class="max-w-md mx-auto">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Belum Ada Testimoni</h3>
            <p class="text-neutral-600 mb-6">Jadilah pelanggan pertama yang memberikan testimoni</p>
            <a href="/testimonials" data-link class="btn btn-primary">Beri Testimoni</a>
          </div>
        </div>
      `;
      return;
    }

    const container = document.getElementById('testimonials-container');
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        ${testimonials.map(testimonial => `
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
        `).join('')}
      </div>
      <div class="text-center">
        <a href="/testimonials" data-link class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md">
          <i class="fas fa-plus-circle"></i>
          <span>Beri Testimonimu Sendiri</span>
        </a>
      </div>
    `;
  } catch (error) {
    console.error('Error loading testimonials:', error);
    document.getElementById('testimonials-container').innerHTML = `
      <div class="col-span-full">
        ${ErrorMessage('Gagal memuat testimoni.')}
      </div>
    `;
  }
}
