import { Navbar, Footer } from '../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/common/index.js';
import { testimonialAPI } from '../js/api/endpoints.js';
import { showNotification, isAuthenticated } from '../js/utils/helpers.js';

export async function TestimonialsPage() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    ${Navbar()}
    <main class="container-main section">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">Testimoni Pelanggan</h1>
        <p class="text-neutral-600">Dengarkan pengalaman pelanggan kami</p>
      </div>

      ${isAuthenticated() ? `
        <div class="card mb-8">
          <h2 class="text-xl font-bold mb-6">Beri Testimoni Anda</h2>
          <form id="testimonial-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Rating</label>
              <div class="flex gap-2">
                <div class="rating-stars" id="rating-stars">
                  ${[1, 2, 3, 4, 5].map(star => `
                    <button type="button" class="star-btn text-2xl text-neutral-300 hover:text-warning transition-colors" data-rating="${star}">
                      ★
                    </button>
                  `).join('')}
                </div>
                <span class="text-sm text-neutral-500 ml-2" id="rating-text">Pilih rating</span>
              </div>
              <input type="hidden" id="rating" name="rating" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Pesan Testimoni</label>
              <textarea id="message" name="message" rows="4" class="input" placeholder="Bagikan pengalaman Anda menggunakan layanan kami..." required></textarea>
            </div>
            <div class="flex gap-4">
              <button type="submit" class="btn btn-primary">Kirim Testimoni</button>
              <button type="button" onclick="resetTestimonialForm()" class="btn btn-secondary">Reset</button>
            </div>
          </form>
        </div>
      ` : `
        <div class="card mb-8 bg-primary-50 border-primary-200">
          <div class="text-center">
            <h3 class="text-lg font-bold text-primary-800 mb-2">Ingin Berbagi Pengalaman Anda?</h3>
            <p class="text-primary-600 mb-4">Masuk ke akun Anda untuk memberikan testimoni</p>
            <a href="/login" data-link class="btn btn-primary">Masuk Sekarang</a>
          </div>
        </div>
      `}

      <div id="testimonials-container">
        ${LoadingSpinner()}
      </div>
    </main>
    ${Footer()}
  `;

  loadTestimonials();
  if (isAuthenticated()) {
    setupTestimonialHandlers();
  }
}

async function loadTestimonials() {
  try {
    const response = await testimonialAPI.getAll();
    const testimonials = response.data.data;
    const container = document.getElementById('testimonials-container');

    if (!container) return;

    if (!Array.isArray(testimonials) || testimonials.length === 0) {
      container.innerHTML = EmptyState(
        'Belum Ada Testimoni',
        'Jadilah pelanggan pertama yang memberikan testimoni'
      );
      return;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${testimonials.map(testimonial => `
          <div class="card">
            <div class="flex gap-1 mb-4 items-center">
              <div class="flex gap-1">
                ${'<span class="text-warning text-lg">★</span>'.repeat(testimonial.rating)}
              </div>
              <span class="text-sm text-neutral-600">${testimonial.rating}/5</span>
            </div>
            <p class="text-neutral-600 mb-6 italic">"${testimonial.message}"</p>
            <div class="flex items-center gap-3">
              <img src="${testimonial.profile || 'https://i.pinimg.com/736x/9d/16/4e/9d164e4e074d11ce4de0a508914537a8.jpg'}" 
                   alt="Profile" 
                   class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                   onerror="this.src='https://i.pinimg.com/736x/9d/16/4e/9d164e4e074d11ce4de0a508914537a8.jpg'">
              <div>
                <p class="font-bold text-sm">${testimonial.user_name}</p>
                <p class="text-xs text-neutral-500">Diposting: ${new Date(testimonial.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Error loading testimonials:', error);
    const container = document.getElementById('testimonials-container');
    if (container) {
      container.innerHTML = ErrorMessage('Gagal memuat testimoni. Silakan coba lagi.');
    }
  }
}

function setupTestimonialHandlers() {
  // Rating stars functionality
  const ratingStars = document.getElementById('rating-stars');
  const ratingInput = document.getElementById('rating') as HTMLInputElement | null;
  const ratingText = document.getElementById('rating-text');

  if (ratingStars) {
    ratingStars.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.classList.contains('star-btn')) {
        const rating = parseInt(target.dataset.rating || '0', 10);
        if (ratingInput) ratingInput.value = String(rating);

        // Update star colors
        const stars = ratingStars.querySelectorAll('.star-btn');
        stars.forEach((star, index) => {
          const el = star as HTMLElement;
          if (index < rating) {
            el.classList.remove('text-neutral-300');
            el.classList.add('text-warning');
          } else {
            el.classList.remove('text-warning');
            el.classList.add('text-neutral-300');
          }
        });

        // Update rating text
        const ratingTexts = ['Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik'];
        if (ratingText) {
          ratingText.textContent = `${rating}/5 - ${ratingTexts[rating - 1]}`;
          ratingText.classList.remove('text-neutral-500');
          ratingText.classList.add('text-neutral-700');
        }
      }
    });
  }

  // Testimonial form submission
  const testimonialFormEl = document.getElementById('testimonial-form') as HTMLFormElement | null;
  if (testimonialFormEl) {
    testimonialFormEl.addEventListener('submit', async (e: Event) => {
      e.preventDefault();

      const formData = new FormData(testimonialFormEl);
      const ratingVal = formData.get('rating');
      const messageVal = formData.get('message');

      const data = {
        rating: parseInt(String(ratingVal || '0'), 10),
        message: String(messageVal || '').trim()
      };

      if (!data.rating || data.rating < 1 || data.rating > 5) {
        showNotification('Silakan pilih rating terlebih dahulu', 'error');
        return;
      }

      if (!data.message) {
        showNotification('Silakan isi pesan testimoni', 'error');
        return;
      }

      const submitBtn = testimonialFormEl.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      const originalText = submitBtn?.textContent || '';

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Mengirim...';
        }

        await testimonialAPI.create(data);
        showNotification('Testimoni berhasil dikirim! Terima kasih atas feedback Anda.', 'success');

        // Reset form
        resetTestimonialForm();

        // Reload testimonials
        loadTestimonials();

      } catch (error: any) {
        console.error('Error creating testimonial:', error);
        const errorMessage = error?.response?.data?.message || 'Gagal mengirim testimoni. Silakan coba lagi.';
        showNotification(errorMessage, 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }
}

function resetTestimonialForm() {
  const testimonialFormEl = document.getElementById('testimonial-form') as HTMLFormElement | null;
  if (testimonialFormEl) {
    testimonialFormEl.reset();

    // Reset rating stars
    const stars = document.querySelectorAll('.star-btn');
    stars.forEach(star => {
      const el = star as HTMLElement;
      el.classList.remove('text-warning');
      el.classList.add('text-neutral-300');
    });

    // Reset rating text
    const ratingText = document.getElementById('rating-text');
    if (ratingText) {
      ratingText.textContent = 'Pilih rating';
      ratingText.classList.remove('text-neutral-700');
      ratingText.classList.add('text-neutral-500');
    }
  }
}

// Make functions global so they can be called from onclick
window.resetTestimonialForm = resetTestimonialForm;
