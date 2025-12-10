import { authAPI } from '../js/api/endpoints.js';
import { showNotification } from '../components/common/index.js';

export async function ForgotPasswordPage(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-primary-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md px-4">
        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-center text-neutral-900 mb-2">Lupa Password</h1>
            <p class="text-center text-neutral-500 text-sm">Masukkan username Anda untuk menerima kode reset password</p>
          </div>

          <form id="forgot-password-form" class="space-y-5">
            <div>
              <label for="username" class="block text-sm font-semibold text-neutral-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                class="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                placeholder="Masukkan username Anda"
              />
            </div>

            <button
              type="submit"
              id="submit-btn"
              class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 mt-6"
            >
              Kirim Kode Reset
            </button>
          </form>

          <div class="mt-8 pt-6 border-t border-neutral-200">
            <p class="text-center text-neutral-600 text-sm">
              <a href="/login" data-link class="text-primary-600 font-bold hover:underline">← Kembali ke Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Handle form submission
  const form = document.getElementById('forgot-password-form') as HTMLFormElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const usernameInput = document.getElementById('username') as HTMLInputElement;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    if (!username) {
      showNotification('Username tidak boleh kosong', 'error');
      return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';

    try {
      await authAPI.forgotPassword({ username });

      showNotification('Kode reset password telah dikirim ke WhatsApp Anda', 'success');

      // Redirect to reset password page with username parameter
      setTimeout(() => {
        const username = usernameInput.value.trim();
        window.location.href = `/reset-password?username=${encodeURIComponent(username)}`;
      }, 2000);

    } catch (error: any) {
      console.error('Forgot password error:', error);

      let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';

      if (error.response?.status === 404) {
        errorMessage = 'Username tidak ditemukan';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Data tidak valid';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      showNotification(errorMessage, 'error');
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Kirim Kode Reset';
    }
  });
}