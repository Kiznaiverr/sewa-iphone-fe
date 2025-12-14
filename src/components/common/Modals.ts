export function Modal(title, content, footer = '') {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex-center animate-modal-fade-in">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 animate-modal-slide-up animate-modal-bounce">
        <div class="p-6 border-b border-neutral-200">
          <h2 class="text-xl font-bold">${title}</h2>
        </div>
        <div class="p-6">
          ${content}
        </div>
        ${footer ? `
          <div class="p-6 border-t border-neutral-200 flex gap-3 justify-end animate-in slide-in-from-bottom-2 duration-300 delay-300">
            ${footer}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function showLogoutConfirmation() {
  const modal = Modal(
    'Konfirmasi Keluar',
    `
      <div class="text-center">
        <div class="w-16 h-16 bg-error bg-opacity-10 rounded-full flex-center mx-auto mb-4">
          <svg class="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
        </div>
        <p class="text-neutral-600 mb-6">Apakah Anda yakin ingin keluar dari akun Anda?</p>
      </div>
    `,
    `
      <button onclick="closeModal()" class="px-4 py-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all duration-200 font-medium transform hover:scale-105">
        Batal
      </button>
      <button onclick="confirmLogout()" class="px-4 py-2 bg-error text-white hover:bg-red-600 rounded-lg transition-all duration-200 font-medium transform hover:scale-105 shadow-md hover:shadow-lg">
        Ya, Keluar
      </button>
    `
  );

  // Create modal container if it doesn't exist
  let modalContainer = document.getElementById('modal-container');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    document.body.appendChild(modalContainer);
  }

  modalContainer.innerHTML = modal;
}

export function closeModal() {
  const modalContainer = document.getElementById('modal-container');
  if (modalContainer) {
    modalContainer.innerHTML = '';
  }
}

export function confirmLogout() {
  // Clear user data
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Close modal
  closeModal();

  // Redirect to home
  const router = window.__router;
  router.navigate('/');
}

export function showOrderSuccessModal() {
  const modal = Modal(
    'Pesanan Berhasil Dibuat',
    `
      <div class="text-center">
        <div class="w-16 h-16 bg-success bg-opacity-10 rounded-full flex-center mx-auto mb-4">
          <svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <p class="text-neutral-600 mb-2">Pesanan Anda telah berhasil dibuat!</p>
        <p class="text-sm text-neutral-500">Anda akan diarahkan ke halaman pesanan dalam beberapa detik...</p>
      </div>
    `,
    `
      <button onclick="goToOrders()" class="px-4 py-2 bg-success text-white hover:bg-green-600 rounded-lg transition-all duration-200 font-medium transform hover:scale-105 shadow-md hover:shadow-lg w-full">
        Lihat Pesanan Saya
      </button>
    `
  );

  // Create modal container if it doesn't exist
  let modalContainer = document.getElementById('modal-container');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    document.body.appendChild(modalContainer);
  }

  modalContainer.innerHTML = modal;

  // Auto redirect after 3 seconds
  setTimeout(() => {
    const router = window.__router;
    router.navigate('/orders');
  }, 3000);
}

export function showAlertModal(message, isSuccess = false, onClose = null) {
  let modalContainer = document.getElementById('modal-container');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    document.body.appendChild(modalContainer);
  }

  const handleClose = () => {
    closeModal();
    if (onClose) onClose();
  };

  const modal = `
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex-center animate-modal-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 animate-modal-slide-up">
        <div class="p-8 flex flex-col items-center gap-4">
          <div class="w-16 h-16 rounded-full flex-center ${isSuccess ? 'bg-success-100' : 'bg-error-100'} animate-bounce">
            ${isSuccess
              ? '<svg class="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>'
              : '<svg class="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            }
          </div>
          <h2 class="text-2xl font-bold text-center ${isSuccess ? 'text-success-600' : 'text-error-600'}">
            ${isSuccess ? 'Berhasil!' : 'Perhatian'}
          </h2>
          <p class="text-center text-neutral-600 text-base leading-relaxed">${message}</p>
        </div>
        <div class="px-8 pb-8 flex justify-center">
          <button onclick="window.__handleAlertClose()" class="btn btn-primary min-w-32">
            OK
          </button>
        </div>
      </div>
    </div>
  `;

  // Store the handler globally
  window.__handleAlertClose = handleClose;

  modalContainer.innerHTML = modal;
}

export function showDeleteModal(testimonialId) {
  const modal = Modal(
    'Konfirmasi Hapus Testimoni',
    `
      <div class="text-center">
        <div class="w-16 h-16 bg-error bg-opacity-10 rounded-full flex-center mx-auto mb-4">
          <svg class="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </div>
        <p class="text-neutral-600 mb-6">Apakah Anda yakin ingin menghapus testimoni ini? Tindakan ini tidak dapat dibatalkan.</p>
      </div>
    `,
    `
      <button onclick="closeModal()" class="px-4 py-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all duration-200 font-medium transform hover:scale-105">
        Batal
      </button>
      <button onclick="confirmDelete(${testimonialId})" class="px-4 py-2 bg-error text-white hover:bg-red-600 rounded-lg transition-all duration-200 font-medium transform hover:scale-105 shadow-md hover:shadow-lg">
        Ya, Hapus
      </button>
    `
  );

  // Create modal container if it doesn't exist
  let modalContainer = document.getElementById('modal-container');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    document.body.appendChild(modalContainer);
  }

  modalContainer.innerHTML = modal;
}

export function confirmDelete(testimonialId) {
  // Close modal
  closeModal();

  // Trigger the actual delete function
  if (window.__deleteTestimonialCallback) {
    window.__deleteTestimonialCallback(testimonialId);
  }
}

export function showUserActionModal(title, message, onConfirm) {
  const modal = Modal(
    title,
    `
      <div class="text-center">
        <div class="w-16 h-16 bg-warning bg-opacity-10 rounded-full flex-center mx-auto mb-4">
          <svg class="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <p class="text-neutral-600 mb-6">${message}</p>
      </div>
    `,
    `
      <button onclick="closeModal()" class="px-4 py-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all duration-200 font-medium transform hover:scale-105">
        Batal
      </button>
      <button onclick="window.__confirmUserAction()" class="px-4 py-2 bg-warning text-white hover:bg-yellow-600 rounded-lg transition-all duration-200 font-medium transform hover:scale-105 shadow-md hover:shadow-lg">
        Ya, Lanjutkan
      </button>
    `
  );

  // Create modal container if it doesn't exist
  let modalContainer = document.getElementById('modal-container');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    document.body.appendChild(modalContainer);
  }

  modalContainer.innerHTML = modal;

  // Store the callback globally
  window.__confirmUserAction = () => {
    closeModal();
    if (onConfirm) onConfirm();
  };
}

export function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  // Create notification container if it doesn't exist
  let notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(notificationContainer);
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `max-w-sm w-full p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;

  // Set colors based on type
  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  notification.classList.add(...colors[type].split(' '));

  // Add icon based on type
  const icons = {
    success: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>`,
    error: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>`,
    info: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`
  };

  notification.innerHTML = `
    <div class="flex items-center">
      <div class="flex-shrink-0">
        ${icons[type]}
      </div>
      <div class="ml-3 text-sm font-medium">
        ${message}
      </div>
      <button class="ml-auto flex-shrink-0 text-white hover:text-gray-200 focus:outline-none" onclick="this.parentElement.parentElement.remove()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;

  // Add to container
  notificationContainer.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 10);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 5000);
}

// Modal untuk versi baru aplikasi (localStorage - permanent)
export function showNewVersionModal(releaseData) {
  const { tag_name, name, body, html_url, assets } = releaseData;
  
  // Find Android APK asset
  const apkAsset = assets?.find(asset => 
    asset.name.toLowerCase().endsWith('.apk')
  );

  const downloadUrl = apkAsset?.browser_download_url || html_url;

  const modal = `
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex-center animate-modal-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 animate-modal-slide-up overflow-hidden">
        <div class="bg-gradient-to-br from-success-600 via-success-500 to-primary-500 p-6 text-white relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 bg-white rounded-xl flex-center p-2 shadow-md">
                <img src="/icons/favicon-32x32.png" alt="iRent App" class="w-full h-full object-contain">
              </div>
              <div>
                <div class="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1 mb-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <span class="text-xs font-semibold">Versi Baru</span>
                </div>
                <h2 class="text-2xl font-bold">Aplikasi Baru Rilis!</h2>
                <p class="text-white text-opacity-90 text-sm">Update sekarang untuk fitur terbaru</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <div class="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 mb-6">
            <div class="flex items-center gap-3">
              <div class="bg-white rounded-lg p-3 shadow-md">
                <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg text-neutral-800">${name || `iRent ${tag_name}`}</h3>
                <p class="text-sm text-neutral-600">Versi terbaru: <span class="font-semibold text-primary-600">${tag_name}</span></p>
              </div>
            </div>
          </div>

          ${body ? `
            <div class="mb-6">
              <h4 class="font-semibold text-neutral-800 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Apa yang baru:
              </h4>
              <div class="text-sm text-neutral-600 bg-neutral-50 rounded-lg p-4 max-h-32 overflow-y-auto space-y-1">
                ${body.split('\n').slice(0, 5).map(line => `
                  <p class="leading-relaxed">${line}</p>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="space-y-3">
            <a href="${downloadUrl}" target="_blank" class="btn btn-primary w-full flex items-center justify-center gap-2 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Update Sekarang
            </a>
            <button onclick="closeNewVersionModal()" class="w-full px-4 py-2.5 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all duration-200 font-medium">
              Nanti Saja
            </button>
          </div>

          <div class="mt-4 pt-4 border-t border-neutral-200">
            <div class="flex items-start gap-2 text-xs text-neutral-500">
              <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="leading-relaxed">
                Versi baru aplikasi membawa perbaikan bug dan fitur-fitur terbaru untuk pengalaman yang lebih baik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Create modal container if it doesn't exist
  let modalContainer = document.getElementById('modal-container');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    document.body.appendChild(modalContainer);
  }

  modalContainer.innerHTML = modal;

  // Store in localStorage that user has seen this version
  localStorage.setItem('lastSeenAppVersion', tag_name);
}

export function closeNewVersionModal() {
  closeModal();
}

// Modal untuk promosi umum (sessionStorage - reset saat tab ditutup)
export function showAppAnnouncementModal(releaseData) {
  const { tag_name, name, html_url, assets } = releaseData;
  
  // Find Android APK asset
  const apkAsset = assets?.find(asset => 
    asset.name.toLowerCase().endsWith('.apk')
  );

  const downloadUrl = apkAsset?.browser_download_url || html_url;

  const modal = `
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex-center animate-modal-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 animate-modal-slide-up overflow-hidden">
        <div class="bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 p-6 text-white relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 bg-white rounded-xl flex-center p-2 shadow-md">
                <img src="/icons/favicon-32x32.png" alt="iRent App" class="w-full h-full object-contain">
              </div>
              <div>
                <h2 class="text-2xl font-bold">Aplikasi Mobile Tersedia!</h2>
                <p class="text-primary-100 text-sm">Dapatkan pengalaman yang lebih baik</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <div class="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 mb-6">
            <div class="flex items-center gap-3">
              <div class="bg-white rounded-lg p-2 shadow-md">
                <img src="/icons/favicon-32x32.png" alt="iRent App" class="w-8 h-8 object-contain">
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg text-neutral-800">${name || `iRent ${tag_name}`}</h3>
                <p class="text-sm text-neutral-600">Versi: <span class="font-semibold text-primary-600">${tag_name}</span></p>
              </div>
            </div>
          </div>

          <div class="mb-6 bg-neutral-50 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div class="text-sm text-neutral-700 space-y-2">
                <p><strong>Akses Lebih Cepat</strong> - Buka aplikasi langsung dari home screen</p>
                <p><strong>Notifikasi Real-time</strong> - Dapatkan update status pesanan secara instant</p>
                <p><strong>Offline Mode</strong> - Lihat riwayat pesanan tanpa koneksi internet</p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <a href="${downloadUrl}" target="_blank" class="btn btn-primary w-full flex items-center justify-center gap-2 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download Aplikasi Sekarang
            </a>
            <button onclick="dismissAppAnnouncement()" class="w-full px-4 py-2.5 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all duration-200 font-medium">
              Jangan Tampilkan Lagi untuk Saat Ini
            </button>
          </div>

          <div class="mt-4 pt-4 border-t border-neutral-200">
            <div class="flex items-start gap-2 text-xs text-neutral-500">
              <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="leading-relaxed">
                Aplikasi mobile memberikan akses lebih cepat dan pengalaman yang lebih optimal untuk menyewa iPhone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Create modal container if it doesn't exist
  let modalContainer = document.getElementById('modal-container');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    document.body.appendChild(modalContainer);
  }

  modalContainer.innerHTML = modal;
}

export function dismissAppAnnouncement() {
  // Store in sessionStorage (akan hilang saat tab ditutup)
  sessionStorage.setItem('appAnnouncementDismissed', 'true');
  closeModal();
}

// Backward compatibility - alias untuk modal lama
export function showAppVersionModal(releaseData) {
  showAppAnnouncementModal(releaseData);
}

export function closeAppVersionModal() {
  closeModal();
}