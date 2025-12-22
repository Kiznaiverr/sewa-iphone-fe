export function Navbar() {
  const isAuth = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  return `
    <nav class='bg-white/95 backdrop-blur-md border-b border-neutral-200/50 sticky top-0 z-40 shadow-lg shadow-neutral-900/5'>
      <div class='container-main flex-between'>
        <div class='flex items-center gap-8'>
          <a href='/' data-link class='text-2xl font-bold text-primary-600'>
            iPhone
          </a>
          <div class='hidden md:flex gap-6'>
            <a href='/iphones' data-link class='text-neutral-600 hover:text-primary-600 transition-colors'>Produk</a>
            <a href='/testimonials' data-link class='text-neutral-600 hover:text-primary-600 transition-colors'>Testimoni</a>
            ${isAuth ? `<a href='/orders' data-link class='text-neutral-600 hover:text-primary-600 transition-colors'>Pesanan</a>` : ''}
            ${isAuth ? `<a href='/rentals' data-link class='text-neutral-600 hover:text-primary-600 transition-colors'>Rental</a>` : ''}
          </div>
        </div>
        <div class='flex items-center gap-4'>
          ${isAuth ? `
            <div class='flex items-center gap-3'>
              <div class='flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-200'>
                <div class='w-8 h-8 rounded-full overflow-hidden bg-neutral-200 flex-center' id='navbar-profile-photo'>
                  ${user?.profile ? `
                    <img src='${user.profile}' alt='Profile' class='w-full h-full object-cover' onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class='w-full h-full bg-primary-100 flex-center' style='display: none;'>
                      <img src='https://i.pinimg.com/736x/9d/16/4e/9d164e4e074d11ce4de0a508914537a8.jpg' alt='Default Profile' class='w-full h-full object-cover rounded-full'>
                    </div>
                  ` : `
                    <img src='https://i.pinimg.com/736x/9d/16/4e/9d164e4e074d11ce4de0a508914537a8.jpg' alt='Default Profile' class='w-full h-full object-cover rounded-full'>
                  `}
                </div>
                <span class='text-sm font-medium text-neutral-700'>${user?.name || 'User'}</span>
              </div>
              <div class='flex items-center gap-2'>
                <a href='/profile' data-link class='flex items-center gap-2 px-3 py-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200'>
                  <svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'></path>
                  </svg>
                  <span class='text-sm font-medium'>Profil</span>
                </a>
                ${user?.role === 'admin' ? `
                  <a href='/admin' data-link class='flex items-center gap-2 px-3 py-2 bg-warning bg-opacity-10 text-warning hover:bg-warning hover:text-white rounded-lg transition-all duration-200'>
                    <svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'></path>
                      <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'></path>
                    </svg>
                    <span class='text-sm font-medium'>Admin</span>
                  </a>
                ` : ''}
                <button onclick='showLogoutConfirmation()' class='flex items-center gap-2 px-3 py-2 text-neutral-600 hover:text-error hover:bg-error hover:bg-opacity-10 rounded-lg transition-all duration-200'>
                  <svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'></path>
                  </svg>
                  <span class='text-sm font-medium'>Keluar</span>
                </button>
              </div>
            </div>
          ` : `
            <div class='flex items-center gap-3'>
              <a href='/login' data-link class='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-all duration-200 font-medium'>
                <svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'></path>
                </svg>
                <span>Masuk</span>
              </a>
              <a href='/register' data-link class='flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-all duration-200 font-medium'>
                <svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'></path>
                </svg>
                <span>Daftar</span>
              </a>
            </div>
          `}
        </div>
      </div>
    </nav>
  `;
}

export function Footer() {
  return `
    <footer class='bg-neutral-900 text-neutral-100 py-12 mt-16'>
      <div class='container-main'>
        <div class='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          <div>
            <h3 class='text-lg font-bold mb-4'>Sewa iPhone</h3>
            <p class='text-neutral-400 text-sm'>Platform penyewaan iPhone terpercaya dengan harga kompetitif</p>
          </div>
          <div>
            <h4 class='font-bold mb-4'>Produk</h4>
            <ul class='space-y-2 text-sm text-neutral-400'>
              <li><a href='/iphones' data-link class='hover:text-white transition-colors'>Katalog iPhone</a></li>
              <li><a href='/testimonials' data-link class='hover:text-white transition-colors'>Testimoni</a></li>
            </ul>
          </div>
          <div>
            <h4 class='font-bold mb-4'>Akun</h4>
            <ul class='space-y-2 text-sm text-neutral-400'>
              <li><a href='/login' data-link class='hover:text-white transition-colors'>Masuk</a></li>
              <li><a href='/register' data-link class='hover:text-white transition-colors'>Daftar</a></li>
            </ul>
          </div>
          <div>
            <h4 class='font-bold mb-4'>Kontak</h4>
            <p class='text-sm text-neutral-400'>Email: info@sewaiphone.com</p>
            <p class='text-sm text-neutral-400'>WhatsApp: +62 878-6380-6297</p>
          </div>
        </div>
        <div class='border-t border-neutral-700 pt-8 flex-between'>
          <p class='text-sm text-neutral-400'>Copyright 2025 Sewa iPhone. All rights reserved.</p>
          <div class='flex gap-4'>
            <a href='#' class='text-neutral-400 hover:text-white transition-colors'>Privacy</a>
            <a href='#' class='text-neutral-400 hover:text-white transition-colors'>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function Sidebar() {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  if (user?.role !== 'admin') return '';

  return `
    <aside class='bg-neutral-900 text-white w-64 min-h-screen flex flex-col'>
      <div class='p-6 border-b border-neutral-700'>
        <h2 class='text-xl font-bold'>Admin Panel</h2>
      </div>
      <nav class='flex-1 p-4 space-y-2'>
        <a href='/' data-link class='block px-4 py-3 rounded-lg text-neutral-200 hover:bg-neutral-800 transition-colors'>Home</a>
        <a href='/admin' data-link class='block px-4 py-3 rounded-lg text-neutral-200 hover:bg-neutral-800 transition-colors'>Dashboard</a>
        <a href='/admin/iphones' data-link class='block px-4 py-3 rounded-lg text-neutral-200 hover:bg-neutral-800 transition-colors'>iPhone</a>
        <a href='/admin/orders' data-link class='block px-4 py-3 rounded-lg text-neutral-200 hover:bg-neutral-800 transition-colors'>Pesanan</a>
        <a href='/admin/rentals' data-link class='block px-4 py-3 rounded-lg text-neutral-200 hover:bg-neutral-800 transition-colors'>Rental</a>
        <a href='/admin/users' data-link class='block px-4 py-3 rounded-lg text-neutral-200 hover:bg-neutral-800 transition-colors'>Pengguna</a>
        <a href='/admin/testimonials' data-link class='block px-4 py-3 rounded-lg text-neutral-200 hover:bg-neutral-800 transition-colors'>Testimoni</a>
      </nav>
      <div class='p-4 border-t border-neutral-700'>
        <button onclick='handleLogout()' class='w-full btn btn-sm btn-danger'>Keluar</button>
      </div>
    </aside>
  `;
}

export function updateNavbarProfilePhoto() {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const profilePhotoContainer = document.getElementById('navbar-profile-photo');
  
  if (profilePhotoContainer && user) {
    if (user.profile) {
      profilePhotoContainer.innerHTML = `
        <img src='${user.profile}' alt='Profile' class='w-full h-full object-cover' onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div class='w-full h-full bg-primary-100 flex-center' style='display: none;'>
          <img src='https://i.pinimg.com/736x/9d/16/4e/9d164e4e074d11ce4de0a508914537a8.jpg' alt='Default Profile' class='w-full h-full object-cover rounded-full'>
        </div>
      `;
    } else {
      profilePhotoContainer.innerHTML = `
        <img src='https://i.pinimg.com/736x/9d/16/4e/9d164e4e074d11ce4de0a508914537a8.jpg' alt='Default Profile' class='w-full h-full object-cover rounded-full'>
      `;
    }
  }
}
