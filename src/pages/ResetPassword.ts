import { authAPI } from '../js/api/endpoints.js';
import { showNotification } from '../components/common/index.js';

export async function ResetPasswordPage(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  // Get username from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const usernameFromUrl = urlParams.get('username') || '';

  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-primary-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md px-4">
        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-center text-neutral-900 mb-2">Reset Password</h1>
            <p class="text-center text-neutral-500 text-sm">Masukkan kode verifikasi dan password baru</p>
            ${usernameFromUrl ? `<p class="text-center text-primary-600 text-sm mt-2">Username: <strong>${usernameFromUrl}</strong></p>` : ''}
          </div>

          <form id="reset-password-form" class="space-y-5">
            <div>
              <label for="username" class="block text-sm font-semibold text-neutral-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value="${usernameFromUrl}"
                class="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none ${usernameFromUrl ? 'bg-neutral-50 cursor-not-allowed' : ''}"
                placeholder="Masukkan username Anda"
                ${usernameFromUrl ? 'readonly' : ''}
              />
            </div>

            <div>
              <label for="code" class="block text-sm font-semibold text-neutral-700 mb-2">
                Kode Verifikasi
              </label>
              <input
                type="text"
                id="code"
                name="code"
                required
                maxlength="6"
                class="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-semibold text-neutral-700 mb-2">
                Password Baru
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minlength="6"
                class="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                placeholder="Minimal 6 karakter"
              />
            </div>

            <div>
              <label for="confirm-password" class="block text-sm font-semibold text-neutral-700 mb-2">
                Konfirmasi Password
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                required
                minlength="6"
                class="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                placeholder="Ulangi password baru"
              />
            </div>

            <button
              type="submit"
              id="submit-btn"
              class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 mt-6"
            >
              Reset Password
            </button>
          </form>

          <div class="mt-8 pt-6 border-t border-neutral-200">
            <div class="text-center space-y-2">
              <p class="text-neutral-600 text-sm">
                <a href="/forgot-password" data-link class="text-primary-600 hover:text-primary-700 hover:underline">Ganti Username</a>
              </p>
              <p class="text-neutral-600 text-sm">
                <a href="/login" data-link class="text-primary-600 font-bold hover:underline">← Kembali ke Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Handle form submission
  const form = document.getElementById('reset-password-form') as HTMLFormElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const usernameInput = document.getElementById('username') as HTMLInputElement;
  const codeInput = document.getElementById('code') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;
  const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const code = codeInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validation
    if (!username || !code || !password || !confirmPassword) {
      showNotification('Semua field harus diisi', 'error');
      return;
    }

    if (code.length !== 6) {
      showNotification('Kode verifikasi harus 6 digit', 'error');
      return;
    }

    if (password.length < 6) {
      showNotification('Password minimal 6 karakter', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showNotification('Password dan konfirmasi password tidak cocok', 'error');
      return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mereset...';

    try {
      await authAPI.resetPassword({ username, code, password });

      showNotification('Password berhasil direset! Silakan login dengan password baru.', 'success');

      // Redirect to login page after success
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (error: any) {
      console.error('Reset password error:', error);

      let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';

      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Kode verifikasi salah atau sudah kadaluarsa';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      showNotification(errorMessage, 'error');
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Reset Password';
    }
  });
}