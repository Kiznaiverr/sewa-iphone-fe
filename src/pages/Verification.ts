import { Navbar, Footer } from '../components/layout/Layout.js';
import { authAPI } from '../js/api/endpoints.js';
import { userAPI } from '../js/api/endpoints.js';
import { showNotification, isAuthenticated } from '../js/utils/helpers.js';

export async function VerificationPage() {
  const app = document.getElementById('app');
  if (!app) return;

  if (!isAuthenticated()) {
    window.location.href = '/login';
    return;
  }

  // Get user profile to display phone number
  let userPhone = '';
  try {
    const profileResponse = await userAPI.getProfile();
    userPhone = profileResponse.data.data.phone || '';
  } catch (error) {
    console.error('Error loading profile:', error);
  }

  app.innerHTML = `
    ${Navbar()}
    <main class="flex items-center justify-center min-h-[calc(100vh-60px)] bg-neutral-50 py-8">
      <div class="w-full max-w-md">
        <div class="card">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold mb-2">Verifikasi Nomor Telepon</h1>
            <p class="text-neutral-600 text-sm">Kami akan mengirim kode verifikasi ke nomor WhatsApp Anda${userPhone ? ` (${userPhone})` : ''}</p>
          </div>

          <div id="send-code-section">
            <button onclick="sendVerificationCode()" class="w-full btn btn-primary mb-4" id="send-code-btn">
              Kirim Kode Verifikasi
            </button>
            <p class="text-xs text-neutral-500 text-center">
              Pastikan nomor WhatsApp Anda aktif dan dapat menerima pesan
            </p>
          </div>

          <div id="verify-code-section" class="hidden">
            <div class="mb-4">
              <label class="block text-sm font-medium text-neutral-700 mb-2">Masukkan Kode Verifikasi</label>
              <input
                type="text"
                id="verification-code"
                class="input text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                maxlength="6"
                pattern="[0-9]{6}"
              >
              <p class="text-xs text-neutral-500 mt-2 text-center">
                Masukkan 6 digit kode yang dikirim ke WhatsApp Anda
              </p>
            </div>

            <button onclick="verifyCode()" class="w-full btn btn-primary mb-4" id="verify-btn">
              Verifikasi
            </button>

            <button onclick="resendCode()" class="w-full btn btn-secondary" id="resend-btn">
              Kirim Ulang Kode
            </button>

            <div class="text-center mt-4">
              <button onclick="backToSend()" class="text-sm text-primary-600 hover:text-primary-700">
                Ganti nomor telepon?
              </button>
            </div>
          </div>

          <div id="success-section" class="hidden text-center">
            <div class="w-16 h-16 bg-success bg-opacity-10 rounded-full flex-center mx-auto mb-4">
              <svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold mb-2 text-success">Verifikasi Berhasil!</h2>
            <p class="text-neutral-600 mb-6">Nomor telepon Anda telah terverifikasi. Sekarang Anda dapat membuat pesanan.</p>
            <a href="/profile" data-link class="btn btn-primary">Kembali ke Profil</a>
          </div>
        </div>
      </div>
    </main>
    ${Footer()}
  `;

  setupVerificationHandlers();
}

function setupVerificationHandlers() {
  // Add any additional setup if needed
}

async function sendVerificationCode() {
  const sendBtn = document.getElementById('send-code-btn') as HTMLButtonElement | null;
  if (!sendBtn) return;
  const originalText = sendBtn.textContent;

  try {
    sendBtn.disabled = true;
    sendBtn.textContent = 'Mengirim...';

    await authAPI.sendVerificationCode();

    showNotification('Kode verifikasi telah dikirim ke WhatsApp Anda', 'success');

    // Switch to verification input
    const sendSection = document.getElementById('send-code-section');
    const verifySection = document.getElementById('verify-code-section');
    if (sendSection) sendSection.classList.add('hidden');
    if (verifySection) verifySection.classList.remove('hidden');

    // Focus on input
    const codeInput = document.getElementById('verification-code') as HTMLInputElement | null;
    if (codeInput) codeInput.focus();

  } catch (error) {
    console.error('Error sending verification code:', error);
    const message = (error as any).response?.data?.message || 'Gagal mengirim kode verifikasi';
    showNotification(message, 'error');
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = originalText;
  }
}

async function verifyCode() {
  const codeInput = document.getElementById('verification-code') as HTMLInputElement | null;
  const code = codeInput?.value.trim() ?? '';
  const verifyBtn = document.getElementById('verify-btn') as HTMLButtonElement | null;

  if (!code || code.length !== 6) {
    showNotification('Masukkan kode verifikasi 6 digit', 'error');
    return;
  }

  if (!verifyBtn) return;

  try {
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Memverifikasi...';

    await authAPI.verifyCode({ code });

    showNotification('Verifikasi berhasil!', 'success');

    // Show success section
    const verifySection = document.getElementById('verify-code-section');
    const successSection = document.getElementById('success-section');
    if (verifySection) verifySection.classList.add('hidden');
    if (successSection) successSection.classList.remove('hidden');

  } catch (error) {
    console.error('Error verifying code:', error);
    const message = (error as any).response?.data?.message || 'Kode verifikasi salah atau kadaluarsa';
    showNotification(message, 'error');
  } finally {
    verifyBtn.disabled = false;
    verifyBtn.textContent = 'Verifikasi';
  }
}

async function resendCode() {
  const resendBtn = document.getElementById('resend-btn') as HTMLButtonElement | null;
  if (!resendBtn) return;
  const originalText = resendBtn.textContent;

  try {
    resendBtn.disabled = true;
    resendBtn.textContent = 'Mengirim ulang...';

    await authAPI.sendVerificationCode();

    showNotification('Kode verifikasi baru telah dikirim', 'success');

  } catch (error) {
    console.error('Error resending verification code:', error);
    const message = (error as any).response?.data?.message || 'Gagal mengirim ulang kode verifikasi';
    showNotification(message, 'error');
  } finally {
    resendBtn.disabled = false;
    resendBtn.textContent = originalText;
  }
}

function backToSend() {
  const verifySection = document.getElementById('verify-code-section');
  const sendSection = document.getElementById('send-code-section');
  const codeInput = document.getElementById('verification-code') as HTMLInputElement | null;
  if (verifySection) verifySection.classList.add('hidden');
  if (sendSection) sendSection.classList.remove('hidden');
  if (codeInput) codeInput.value = '';
}

// Make functions global so they can be called from onclick
window.sendVerificationCode = sendVerificationCode;
window.verifyCode = verifyCode;
window.resendCode = resendCode;
window.backToSend = backToSend;