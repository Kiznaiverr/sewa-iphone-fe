import { Navbar, Footer } from '../components/layout/Layout.js';
import { showAlertModal } from '../components/common/index.js';
import { authAPI } from '../js/api/endpoints.js';
import { setAuthData, validateEmail, validatePhone, validateNIK, validatePassword, validateUsername } from '../js/utils/helpers.js';

export function LoginPage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${Navbar()}
    <main class="flex items-center justify-center min-h-[calc(100vh-60px)] bg-gradient-to-br from-primary-50 via-neutral-50 to-primary-100">
      <div class="w-full max-w-md px-4">
        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-center text-neutral-900 mb-2">Selamat Datang</h1>
            <p class="text-center text-neutral-500 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          <div id="login-error" class="hidden mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded">
            <p class="text-xs font-medium text-red-600"></p>
          </div>

          <form id="login-form" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-2">Username atau Email</label>
              <div class="relative">
                <input 
                  type="text" 
                  id="username" 
                  class="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                  placeholder="Masukkan username atau email" 
                  autocomplete="username" 
                  required
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-2">Password</label>
              <div class="relative">
                <input 
                  type="password" 
                  id="password" 
                  class="w-full px-4 py-3 pr-12 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                  placeholder="Masukkan password" 
                  autocomplete="current-password" 
                  required
                >
                <button type="button" id="toggle-password" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg class="w-5 h-5 text-neutral-400 hover:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 mt-6"
            >
              Masuk
            </button>
          </form>

          <div class="mt-8 pt-6 border-t border-neutral-200">
            <p class="text-center text-neutral-600 text-sm">
              Belum punya akun? 
              <a href="/register" data-link class="text-primary-600 font-bold hover:underline">Daftar di sini</a>
            </p>
          </div>
        </div>
      </div>
    </main>
    ${Footer()}
  `;

  document.getElementById('login-form').addEventListener('submit', handleLogin);

  // Toggle password visibility
  const togglePassword = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');
  togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.innerHTML = type === 'password' 
      ? `<svg class="w-5 h-5 text-neutral-400 hover:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>`
      : `<svg class="w-5 h-5 text-neutral-400 hover:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
        </svg>`;
  });
}

async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('login-error');
  const form = document.getElementById('login-form');

  try {
    const response = await authAPI.login({ username, password });

    if (response.data.success) {
      const { token, user } = response.data.data;
      setAuthData(token, user);

      // Redirect langsung tanpa notification
      if (user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/profile';
      }
    }
  } catch (error) {
    // Customize error message
    let message = 'Username atau password salah';
    if (error.response?.status === 401) {
      message = 'Username atau password salah';
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    
    // Show error in form
    errorDiv.classList.remove('hidden');
    errorDiv.querySelector('p').textContent = message;
    
    // Add shake animation
    form.style.animation = 'none';
    setTimeout(() => {
      form.style.animation = 'shake 0.5s ease-in-out';
    }, 10);
    
    // Clear error after 5 seconds
    setTimeout(() => {
      errorDiv.classList.add('hidden');
      form.style.animation = 'none';
    }, 5000);
  }
}

export function RegisterPage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${Navbar()}
    <main class="flex items-center justify-center min-h-[calc(100vh-60px)] bg-gradient-to-br from-primary-50 via-neutral-50 to-primary-100 py-8">
      <div class="w-full max-w-md px-4">
        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-center text-neutral-900 mb-2">Daftar Akun</h1>
            <p class="text-center text-neutral-500 text-sm">Buat akun baru untuk memulai</p>
          </div>

          <form id="register-form" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                id="name" 
                class="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                placeholder="Masukkan nama lengkap" 
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-2">Username</label>
              <input 
                type="text" 
                id="username" 
                class="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                placeholder="Masukkan username" 
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-2">Email (Opsional)</label>
              <input 
                type="email" 
                id="email" 
                class="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                placeholder="Masukkan email"
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-2">Nomor Telepon</label>
              <input 
                type="tel" 
                id="phone" 
                class="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                placeholder="Contoh: +628123456789" 
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-2">NIK</label>
              <input 
                type="text" 
                id="nik" 
                class="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                placeholder="Masukkan 16 digit NIK" 
                maxlength="16" 
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-2">Password</label>
              <div class="relative">
                <input 
                  type="password" 
                  id="password" 
                  class="w-full px-4 py-3 pr-12 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                  placeholder="Minimal 6 karakter" 
                  autocomplete="new-password" 
                  required
                >
                <button type="button" id="toggle-password-register" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg class="w-5 h-5 text-neutral-400 hover:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-2">Konfirmasi Password</label>
              <div class="relative">
                <input 
                  type="password" 
                  id="confirm-password" 
                  class="w-full px-4 py-3 pr-12 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                  placeholder="Masukkan password lagi" 
                  autocomplete="new-password" 
                  required
                >
                <button type="button" id="toggle-confirm-password" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg class="w-5 h-5 text-neutral-400 hover:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 mt-6"
            >
              Daftar
            </button>
          </form>

          <div class="mt-8 pt-6 border-t border-neutral-200">
            <p class="text-center text-neutral-600 text-sm">
              Sudah punya akun? 
              <a href="/login" data-link class="text-primary-600 font-bold hover:underline">Masuk di sini</a>
            </p>
          </div>
        </div>
      </div>
    </main>
    ${Footer()}
  `;

  document.getElementById('register-form').addEventListener('submit', handleRegister);

  // Toggle password visibility for password field
  const togglePasswordRegister = document.getElementById('toggle-password-register');
  const passwordInputRegister = document.getElementById('password');
  togglePasswordRegister.addEventListener('click', () => {
    const type = passwordInputRegister.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInputRegister.setAttribute('type', type);
    togglePasswordRegister.innerHTML = type === 'password' 
      ? `<svg class="w-5 h-5 text-neutral-400 hover:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>`
      : `<svg class="w-5 h-5 text-neutral-400 hover:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
        </svg>`;
  });

  // Toggle password visibility for confirm password field
  const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  toggleConfirmPassword.addEventListener('click', () => {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    toggleConfirmPassword.innerHTML = type === 'password' 
      ? `<svg class="w-5 h-5 text-neutral-400 hover:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>`
      : `<svg class="w-5 h-5 text-neutral-400 hover:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
        </svg>`;
  });
}

async function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  let phone = document.getElementById('phone').value;
  let nik = document.getElementById('nik').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (!validateUsername(username)) {
    showAlertModal('Username harus 3-20 karakter, hanya huruf, angka, dan underscore', false);
    return;
  }

  if (password !== confirmPassword) {
    showAlertModal('Password tidak cocok', false);
    return;
  }

  if (!validatePassword(password)) {
    showAlertModal('Password minimal 6 karakter', false);
    return;
  }

  if (!validatePhone(phone)) {
    showAlertModal('Format nomor telepon tidak valid', false);
    return;
  }

  // Normalize phone number to +62 format
  if (phone.startsWith('0')) {
    phone = '+62' + phone.substring(1);
  } else if (phone.startsWith('62')) {
    phone = '+' + phone;
  }

  if (!validateNIK(nik)) {
    showAlertModal('NIK harus 16 digit', false);
    return;
  }

  // Ensure NIK is clean digits only
  nik = nik.replace(/\D/g, '');

  if (email && !validateEmail(email)) {
    showAlertModal('Format email tidak valid', false);
    return;
  }

  try {
    const registerData = {
      name,
      username,
      email: email || '',
      phone,
      nik,
      password,
    };

    const response = await authAPI.register(registerData);

    if (response.data.success) {
      showAlertModal('Pendaftaran berhasil. Silakan login', true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
  } catch (error) {
    let message = 'Pendaftaran gagal. Silakan coba lagi';

    if (error.response?.status === 500) {
      // Jika server error tapi data mungkin sudah masuk, beri pesan khusus
      message = 'Terjadi kesalahan server. Silakan coba login dengan akun yang baru didaftarkan.';
    } else if (error.response?.status === 400 && error.response?.data?.message) {
      const errorMessage = error.response.data.message.toLowerCase();

      if (errorMessage.includes('username') && errorMessage.includes('sudah')) {
        message = 'Username sudah digunakan. Silakan pilih username lain.';
      } else if (errorMessage.includes('email') && errorMessage.includes('sudah')) {
        message = 'Email sudah terdaftar. Silakan gunakan email lain.';
      } else if (errorMessage.includes('phone') && errorMessage.includes('sudah')) {
        message = 'Nomor telepon sudah terdaftar. Silakan gunakan nomor lain.';
      } else if (errorMessage.includes('nik') && errorMessage.includes('sudah')) {
        message = 'NIK sudah terdaftar. Silakan gunakan NIK lain.';
      } else {
        message = error.response.data.message;
      }
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }

    showAlertModal(message, false);
  }
}
