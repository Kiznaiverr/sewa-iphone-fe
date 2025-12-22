import { Navbar, Footer } from '../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage, showNewVersionModal, showAppAnnouncementModal } from '../components/common/index.js';
import { testimonialAPI, githubAPI } from '../js/api/endpoints.js';
import { isAuthenticated } from '../js/utils/helpers.js';

export async function HomePage() {
  const app = document.getElementById('app');
  if (!app) return;
  const isLoggedIn = isAuthenticated();

  app.innerHTML = `
    ${Navbar()}
    <main>
      <section class="bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 py-20 relative overflow-hidden">
        <div class="absolute inset-0 bg-black bg-opacity-10"></div>
        <div class="absolute top-0 left-0 w-full h-full">
          <div class="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl"></div>
          <div class="absolute bottom-10 right-10 w-48 h-48 bg-secondary-300 bg-opacity-20 rounded-full blur-2xl"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-300 bg-opacity-10 rounded-full blur-3xl"></div>
        </div>
        <div class="container-main relative z-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div class="text-white">
              <div class="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
                <span class="text-sm font-medium">Layanan Terpercaya #1 di Indonesia</span>
              </div>
              <h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Sewa <span class="text-yellow-300">iPhone</span> Impianmu
              </h1>
              <p class="text-xl text-primary-100 mb-8 leading-relaxed">
                Dapatkan iPhone terbaru dengan harga terjangkau. Prosesnya mudah, cepat, dan aman. 
                Ribuan pelanggan telah mempercayai layanan kami.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <a href="/iphones" data-link class="btn bg-white text-primary-600 hover:bg-neutral-50 btn-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Lihat Produk
                </a>
                ${!isLoggedIn ? '<a href="/register" data-link class="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 btn-lg px-8 py-4 font-semibold transition-all duration-300">Daftar Sekarang</a>' : ''}
              </div>
              <div class="mt-8 flex items-center gap-6 text-primary-100">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-sm">Garansi Penuh</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-sm">Proses 5 Menit</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-sm">100% Aman</span>
                </div>
              </div>
            </div>
            <div class="relative">
              <!-- Slider Container -->
              <div class="h-96 bg-gradient-to-br from-white to-neutral-100 rounded-3xl overflow-hidden shadow-2xl relative group">
                <div id="slider-container" class="relative w-full h-full">
                  <!-- Slides akan di-generate oleh JavaScript -->
                  <div class="flex items-center justify-center h-full bg-neutral-200">
                    <svg class="w-12 h-12 text-neutral-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </div>
                </div>

                <!-- Navigation Buttons -->
                <button id="slider-prev" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 z-10 transition-all duration-200 opacity-0 group-hover:opacity-100">
                  <svg class="w-6 h-6 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <button id="slider-next" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 z-10 transition-all duration-200 opacity-0 group-hover:opacity-100">
                  <svg class="w-6 h-6 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>

                <!-- Dots Indicator -->
                <div id="slider-dots" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  <!-- Dots akan di-generate oleh JavaScript -->
                </div>
              </div>

              <div class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 transform hover:scale-105 transition-transform duration-300">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-success-100 rounded-full flex-center">
                    <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-bold text-neutral-900">500+ Pelanggan</div>
                    <div class="text-sm text-neutral-600">Puas dengan layanan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-neutral-100 section scroll-effect">
        <div class="container-main">
          <h2 class="text-3xl font-bold text-center mb-12">Mengapa Pilih Kami</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300" style="border-left: 4px solid #3b82f6;">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="font-bold mb-2 text-neutral-900">Harga Terjangkau</h3>
              <p class="text-neutral-600 text-sm">Nikmati harga sewa yang kompetitif tanpa mengorbankan kualitas</p>
            </div>
            <div class="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300" style="border-left: 4px solid #10b981;">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="font-bold mb-2 text-neutral-900">Proses Cepat</h3>
              <p class="text-neutral-600 text-sm">Pengajuan hingga persetujuan hanya dalam hitungan menit</p>
            </div>
            <div class="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300" style="border-left: 4px solid #f59e0b;">
              <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="font-bold mb-2 text-neutral-900">Aman dan Terpercaya</h3>
              <p class="text-neutral-600 text-sm">Verifikasi penuh dan asuransi untuk melindungi kepentingan Anda</p>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-gradient-to-r from-primary-600 to-primary-700 py-16 scroll-effect">
        <div class="container-main">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Angka-angka yang Membuat Kami Percaya Diri</h2>
            <p class="text-primary-100 text-lg">Kepercayaan ribuan pelanggan dalam layanan penyewaan iPhone</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
              <div class="text-primary-100 font-medium">Pelanggan Puas</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold text-white mb-2">50+</div>
              <div class="text-primary-100 font-medium">Model iPhone</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold text-white mb-2">99%</div>
              <div class="text-primary-100 font-medium">Tingkat Kepuasan</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div class="text-primary-100 font-medium">Dukungan Teknis</div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 py-20 scroll-effect">
        <div class="container-main">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Siap untuk Pengalaman iPhone Terbaik?
            </h2>
            <p class="text-xl text-neutral-600 mb-8 leading-relaxed">
              Bergabunglah dengan ribuan pelanggan yang telah mempercayai layanan sewa iPhone kami. 
              Dapatkan iPhone impian Anda hari ini dengan proses yang mudah dan harga yang terjangkau.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/iphones" data-link class="btn btn-primary btn-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Mulai Sewa Sekarang
              </a>
              ${!isLoggedIn ? '<a href="/register" data-link class="btn btn-secondary-outline btn-xl px-8 py-4 text-lg font-semibold hover:bg-secondary-50 transition-all duration-300">Daftar Gratis</a>' : ''}
            </div>
            <div class="mt-12 flex flex-wrap justify-center items-center gap-8 text-neutral-500">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm font-medium">Tanpa Biaya Tersembunyi</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm font-medium">Garansi 100%</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm font-medium">Pengiriman Cepat</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-neutral-50 section scroll-effect">
        <div class="container-main">
          <div class="text-center mb-12">
            <h2 class="text-4xl font-bold text-neutral-900 mb-4">Testimoni Pelanggan</h2>
            <p class="text-lg text-neutral-600 max-w-2xl mx-auto">Apa kata pelanggan kami tentang pengalaman menggunakan layanan sewa iPhone terbaik di Indonesia</p>
          </div>
          <div id="testimonials-container">
            <div class="grid-responsive">
              ${LoadingSpinner()}
            </div>
          </div>
        </div>
      </section>
    </main>
    ${Footer()}
  `;

  loadTestimonials();
  initializeSlider();
  checkAppVersion();

  // Add scroll effect
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      } else {
        entry.target.classList.remove('fade-in');
      }
    });
  }, observerOptions);

  // Observe all sections with scroll-effect class
  document.querySelectorAll('.scroll-effect').forEach(section => {
    observer.observe(section);
  });
}

async function checkAppVersion() {
  try {
    const releaseData = await githubAPI.getLatestRelease();
    
    if (!releaseData || !releaseData.tag_name) {
      return;
    }

    // Check if user has already seen this version (localStorage)
    const lastSeenVersion = localStorage.getItem('lastSeenAppVersion');
    
    // Prioritas 1: Tampilkan modal versi baru jika ada update
    if (!lastSeenVersion || lastSeenVersion !== releaseData.tag_name) {
      setTimeout(() => {
        showNewVersionModal(releaseData);
      }, 1500);
      return; // Exit if new version modal is shown
    }
    
    const announcementDismissed = sessionStorage.getItem('appAnnouncementDismissed');
    
    if (!announcementDismissed) {
      setTimeout(() => {
        showAppAnnouncementModal(releaseData);
      }, 1500);
    }
  } catch (error) {
    console.error('Error checking app version:', error);
    // Fail silently - don't show error to user
  }
}

async function loadTestimonials() {
  try {
    const response = await testimonialAPI.getAll();
    const allTestimonials = response.data.data;
    const testimonials = allTestimonials.slice(0, 3); // Only show 3 testimonials

    const container = document.getElementById('testimonials-container');

    if (!container) return;

    if (!Array.isArray(testimonials) || testimonials.length === 0) {
      container.innerHTML = `
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
            <div class="flex items-center gap-3">
              <img src="${testimonial.profile || 'https://i.pinimg.com/736x/9d/16/4e/9d164e4e074d11ce4de0a508914537a8.jpg'}" 
                   alt="Profile" 
                   class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                   onerror="this.src='https://i.pinimg.com/736x/9d/16/4e/9d164e4e074d11ce4de0a508914537a8.jpg'">
              <div>
                <p class="font-bold text-sm">${testimonial.user_name || 'Pelanggan'}</p>
                <p class="text-xs text-neutral-500">Diposting: ${new Date(testimonial.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
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
    const container = document.getElementById('testimonials-container');
    if (container) {
      container.innerHTML = `
        <div class="col-span-full">
          ${ErrorMessage('Gagal memuat testimoni.')}
        </div>
      `;
    }
  }
}

async function initializeSlider() {
  try {
    const imageFiles = [
      'banner.jpeg',
      'banner2.jpg',
      'banner3.jpg'
      // Tambah gambar baru di sini, contoh:
      // 'banner4.jpg',
      // 'banner5.png',
    ];

    if (imageFiles.length === 0) {
      console.warn('No images found in /images/ folder');
      return;
    }

    // State untuk slider
    let currentSlide = 0;
    let autoPlayInterval: number | null = null;

    // Get DOM elements
    const sliderContainer = document.getElementById('slider-container') as HTMLElement | null;
    const sliderPrev = document.getElementById('slider-prev') as HTMLElement | null;
    const sliderNext = document.getElementById('slider-next') as HTMLElement | null;
    const sliderDots = document.getElementById('slider-dots') as HTMLElement | null;

    if (!sliderContainer || !sliderDots) {
      console.warn('Slider DOM elements not found');
      return;
    }

    // Generate slides HTML
    sliderContainer.innerHTML = imageFiles.map((image, index) => `
      <div class="slider-slide absolute inset-0 transition-opacity duration-700 ease-in-out ${index === 0 ? 'opacity-100' : 'opacity-0'}" data-index="${index}">
        <img src="/images/${image}" alt="Banner ${index + 1}" class="w-full h-full object-cover">
      </div>
    `).join('');

    // Generate dots HTML
    sliderDots.innerHTML = imageFiles.map((_, index) => `
      <button class="slider-dot w-2 h-2 rounded-full bg-white transition-all duration-300 ${index === 0 ? 'bg-opacity-100 w-8' : 'bg-opacity-50 hover:bg-opacity-75'}" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>
    `).join('');

    // Show slide function
    const showSlide = (index: number) => {
      // Normalize index
      currentSlide = (index + imageFiles.length) % imageFiles.length;

      // Update slides
      document.querySelectorAll('.slider-slide').forEach(slide => {
        const slideIndex = parseInt(slide.getAttribute('data-index') ?? '0');
        const el = slide as HTMLElement;
        el.classList.toggle('opacity-100', slideIndex === currentSlide);
        el.classList.toggle('opacity-0', slideIndex !== currentSlide);
      });

      // Update dots
      document.querySelectorAll('.slider-dot').forEach(dot => {
        const dotIndex = parseInt(dot.getAttribute('data-index') ?? '0');
        const el = dot as HTMLElement;
        if (dotIndex === currentSlide) {
          el.classList.remove('w-2');
          el.classList.add('w-8', 'bg-opacity-100');
        } else {
          el.classList.remove('w-8', 'bg-opacity-100');
          el.classList.add('w-2', 'bg-opacity-50');
        }
      });
    };

    // Start auto play function
    const startAutoPlay = () => {
      if (autoPlayInterval !== null) clearInterval(autoPlayInterval);
      autoPlayInterval = window.setInterval(() => {
        showSlide(currentSlide + 1);
      }, 5000); // Change slide setiap 5 detik
    };

    // Stop auto play function
    const stopAutoPlay = () => {
      if (autoPlayInterval !== null) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    };

    // Event listeners untuk buttons
    if (sliderPrev) {
      sliderPrev.addEventListener('click', () => {
        stopAutoPlay();
        showSlide(currentSlide - 1);
        startAutoPlay();
      });
    }

    if (sliderNext) {
      sliderNext.addEventListener('click', () => {
        stopAutoPlay();
        showSlide(currentSlide + 1);
        startAutoPlay();
      });
    }

    // Event listeners untuk dots
    document.querySelectorAll('.slider-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        stopAutoPlay();
        showSlide(parseInt(dot.getAttribute('data-index') ?? '0'));
        startAutoPlay();
      });
    });

    // Pause autoplay saat hover
    sliderContainer.addEventListener('mouseenter', stopAutoPlay);
    sliderContainer.addEventListener('mouseleave', startAutoPlay);

    // Start autoplay
    startAutoPlay();

  } catch (error) {
    console.error('Error loading slider images:', error);
    // Fallback jika fetch error
    const fallbackContainer = document.getElementById('slider-container');
    if (fallbackContainer) {
      fallbackContainer.innerHTML = `
        <div class="flex items-center justify-center h-full bg-gradient-to-br from-primary-300 to-secondary-300">
          <div class="text-center">
            <svg class="w-16 h-16 text-white mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p class="text-white opacity-75">Banner images loading...</p>
          </div>
        </div>
      `;
    }
  }
}
