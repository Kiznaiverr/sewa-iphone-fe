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
  window.location.href = '/';
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
    window.location.href = '/orders';
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