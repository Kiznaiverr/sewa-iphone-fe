import { Navbar, Footer } from '../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/common/index.js';
import { testimonialAPI } from '../js/api/endpoints.js';
import { showNotification, isAuthenticated } from '../js/utils/helpers.js';

export async function TestimonialsPage() {
  const app = document.getElementById('app');

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

    if (!Array.isArray(testimonials) || testimonials.length === 0) {
      document.getElementById('testimonials-container').innerHTML = EmptyState(
        'Belum Ada Testimoni',
        'Jadilah pelanggan pertama yang memberikan testimoni'
      );
      return;
    }

    const container = document.getElementById('testimonials-container');
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
            <div>
              <p class="font-bold text-sm">${testimonial.user_name}</p>
              <p class="text-xs text-neutral-500">Diposting: ${new Date(testimonial.created_at).toLocaleDateString('id-ID')}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Error loading testimonials:', error);
    document.getElementById('testimonials-container').innerHTML = ErrorMessage(
      'Gagal memuat testimoni. Silakan coba lagi.'
    );
  }
}

function setupTestimonialHandlers() {
  // Rating stars functionality
  const ratingStars = document.getElementById('rating-stars');
  const ratingInput = document.getElementById('rating');
  const ratingText = document.getElementById('rating-text');

  if (ratingStars) {
    ratingStars.addEventListener('click', (e) => {
      if (e.target.classList.contains('star-btn')) {
        const rating = parseInt(e.target.dataset.rating);
        ratingInput.value = rating;

        // Update star colors
        const stars = ratingStars.querySelectorAll('.star-btn');
        stars.forEach((star, index) => {
          if (index < rating) {
            star.classList.remove('text-neutral-300');
            star.classList.add('text-warning');
          } else {
            star.classList.remove('text-warning');
            star.classList.add('text-neutral-300');
          }
        });

        // Update rating text
        const ratingTexts = ['Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik'];
        ratingText.textContent = `${rating}/5 - ${ratingTexts[rating - 1]}`;
        ratingText.classList.remove('text-neutral-500');
        ratingText.classList.add('text-neutral-700');
      }
    });
  }

  // Testimonial form submission
  const testimonialForm = document.getElementById('testimonial-form');
  if (testimonialForm) {
    testimonialForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(testimonialForm);
      const data = {
        rating: parseInt(formData.get('rating')),
        message: formData.get('message').trim()
      };

      if (!data.rating || data.rating < 1 || data.rating > 5) {
        showNotification('Silakan pilih rating terlebih dahulu', 'error');
        return;
      }

      if (!data.message) {
        showNotification('Silakan isi pesan testimoni', 'error');
        return;
      }

      const submitBtn = testimonialForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';

        await testimonialAPI.create(data);
        showNotification('Testimoni berhasil dikirim! Terima kasih atas feedback Anda.', 'success');

        // Reset form
        resetTestimonialForm();

        // Reload testimonials
        loadTestimonials();

      } catch (error) {
        console.error('Error creating testimonial:', error);
        const errorMessage = error.response?.data?.message || 'Gagal mengirim testimoni. Silakan coba lagi.';
        showNotification(errorMessage, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
}

function resetTestimonialForm() {
  const testimonialForm = document.getElementById('testimonial-form');
  if (testimonialForm) {
    testimonialForm.reset();

    // Reset rating stars
    const stars = document.querySelectorAll('.star-btn');
    stars.forEach(star => {
      star.classList.remove('text-warning');
      star.classList.add('text-neutral-300');
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
