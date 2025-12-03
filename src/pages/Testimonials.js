import { Navbar, Footer } from '../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/common/Components.js';
import { testimonialAPI } from '../js/api/endpoints.js';

export async function TestimonialsPage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${Navbar()}
    <main class="container-main section">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">Testimoni Pelanggan</h1>
        <p class="text-neutral-600">Dengarkan pengalaman pelanggan kami</p>
      </div>

      <div id="testimonials-container">
        ${LoadingSpinner()}
      </div>
    </main>
    ${Footer()}
  `;

  loadTestimonials();
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
