import { Navbar, Footer } from '../components/layout/Layout.js';
import { showAlertModal } from '../components/common/index.js';
import { authAPI } from '../js/api/endpoints.js';
import { setAuthData, validateEmail, validatePhone, validateNIK, validatePassword } from '../js/utils/helpers.js';

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
                  class="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                  placeholder="Masukkan password" 
                  autocomplete="current-password" 
                  required
                >
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
              <input 
                type="password" 
                id="password" 
                class="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                placeholder="Minimal 6 karakter" 
                autocomplete="new-password" 
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-2">Konfirmasi Password</label>
              <input 
                type="password" 
                id="confirm-password" 
                class="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                placeholder="Masukkan password lagi" 
                autocomplete="new-password" 
                required
              >
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
}

async function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const nik = document.getElementById('nik').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

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

  if (!validateNIK(nik)) {
    showAlertModal('NIK harus 16 digit', false);
    return;
  }

  if (email && !validateEmail(email)) {
    showAlertModal('Format email tidak valid', false);
    return;
  }

  try {
    const response = await authAPI.register({
      name,
      username,
      email: email || undefined,
      phone,
      nik,
      password,
    });

    if (response.data.success) {
      showAlertModal('Pendaftaran berhasil. Silakan login', true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi';
    showAlertModal(message, false);
  }
}
