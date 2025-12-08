import { Navbar, Footer, updateNavbarProfilePhoto } from '../../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage } from '../../components/common/index.js';
import { userAPI } from '../../js/api/endpoints.js';
import { showNotification, isAuthenticated } from '../../js/utils/helpers.js';

export async function ProfilePage() {
  const app = document.getElementById('app');

  if (!isAuthenticated()) {
    window.location.href = '/login';
    return;
  }

  app.innerHTML = `
    ${Navbar()}
    <main class='section'>
      <div class='container-main'>
        <div class='max-w-4xl mx-auto'>
          <h1 class='text-3xl font-bold mb-8'>Profil Saya</h1>

          <!-- Verification Alert -->
          <div id='verification-alert' class='hidden mb-6'>
            <div class='alert alert-warning'>
              <div class='flex-between items-start'>
                <div class='flex-1'>
                  <h4 class='font-bold mb-1'>Verifikasi Akun Diperlukan</h4>
                  <p>Verifikasi nomor telepon Anda untuk dapat membuat pesanan. Klik tombol verifikasi untuk melanjutkan.</p>
                </div>
                <a href='/verify' data-link class='btn btn-sm btn-primary whitespace-nowrap ml-4'>Verifikasi Sekarang</a>
              </div>
            </div>
          </div>

          <div class='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <!-- Profile Info & Photo -->
            <div class='lg:col-span-2'>
              <!-- Profile Photo -->
              <div class='card mb-4'>
                <div class='flex flex-col sm:flex-row items-center gap-6'>
                  <div class='flex-shrink-0'>
                    <div class='relative group'>
                      <div class='w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 p-1'>
                        <div class='w-full h-full rounded-full overflow-hidden bg-white'>
                          <img id='profile-photo' src='https://i.pinimg.com/736x/9d/16/4e/9d164e4e074d11ce4de0a508914537a8.jpg' alt='Foto Profil' class='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'>
                        </div>
                      </div>
                      <button class='absolute bottom-0 right-0 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full p-3 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg border-2 border-white transform hover:scale-110' title='Ubah Foto'>
                        <svg class='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'></path>
                          <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'></path>
                        </svg>
                      </button>
                      <div class='absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 pointer-events-none'></div>
                    </div>
                  </div>
                  <div class='flex-1 text-center sm:text-left'>
                    <h2 id='profile-username' class='text-xl font-bold mb-2'>Foto Profil</h2>
                    <p class='text-sm text-neutral-500 mb-4'>Klik ikon kamera untuk mengubah foto profil</p>
                    <div class='flex flex-wrap gap-2'>
                      <span class='badge badge-primary'>JPG</span>
                      <span class='badge badge-primary'>PNG</span>
                      <span class='badge badge-neutral'>Max 5MB</span>
                    </div>
                    <input type='file' id='profile-photo-input' accept='image/jpeg,image/jpg,image/png' class='hidden'>
                  </div>
                </div>
              </div>

              <!-- Profile Info -->
              <div class='card mb-4'>
                <div class='flex items-center justify-between mb-6'>
                  <h2 class='text-xl font-bold flex items-center gap-2'>
                    <svg class='w-5 h-5 text-primary-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'></path>
                    </svg>
                    Informasi Pribadi
                  </h2>
                  <button onclick='showEditForm()' class='btn btn-sm btn-primary flex items-center gap-2'>
                    <svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'></path>
                    </svg>
                    Edit
                  </button>
                </div>
                <div id='profile-info'>
                  ${LoadingSpinner()}
                </div>
              </div>

              <!-- Edit Profile Form (Hidden by default) -->
              <div id='edit-profile-form' class='card hidden mb-4 border-l-4 border-l-primary-500'>
                <div class='flex items-center gap-3 mb-6'>
                  <div class='w-10 h-10 bg-primary-100 rounded-full flex-center'>
                    <svg class='w-5 h-5 text-primary-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'></path>
                    </svg>
                  </div>
                  <div>
                    <h2 class='text-xl font-bold'>Edit Profil</h2>
                    <p class='text-sm text-neutral-500'>Perbarui informasi pribadi Anda</p>
                  </div>
                </div>
                <form id='profile-form' class='space-y-6'>
                  <div class='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div class='space-y-2'>
                      <label class='flex items-center gap-2 text-sm font-medium text-neutral-700'>
                        <svg class='w-4 h-4 text-neutral-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'></path>
                        </svg>
                        Nama Lengkap
                      </label>
                      <input type='text' id='name' name='name' class='input focus:ring-2 focus:ring-primary-100' required>
                    </div>
                    <div class='space-y-2'>
                      <label class='flex items-center gap-2 text-sm font-medium text-neutral-700'>
                        <svg class='w-4 h-4 text-neutral-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'></path>
                        </svg>
                        Email
                      </label>
                      <input type='email' id='email' name='email' class='input focus:ring-2 focus:ring-primary-100' required>
                    </div>
                    <div class='space-y-2'>
                      <label class='flex items-center gap-2 text-sm font-medium text-neutral-700'>
                        <svg class='w-4 h-4 text-neutral-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'></path>
                        </svg>
                        Nomor Telepon
                      </label>
                      <input type='tel' id='phone' name='phone' class='input focus:ring-2 focus:ring-primary-100' required>
                    </div>
                    <div class='space-y-2'>
                      <label class='flex items-center gap-2 text-sm font-medium text-neutral-700'>
                        <svg class='w-4 h-4 text-neutral-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0V5a2 2 0 114 0v1'></path>
                        </svg>
                        NIK
                      </label>
                      <input type='text' id='nik' name='nik' class='input focus:ring-2 focus:ring-primary-100' required>
                    </div>
                  </div>
                  <div class='flex gap-4 pt-6 border-t border-neutral-200'>
                    <button type='submit' class='btn btn-primary flex-1 flex items-center justify-center gap-2'>
                      <svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7'></path>
                      </svg>
                      Simpan Perubahan
                    </button>
                    <button type='button' onclick='cancelEdit()' class='btn btn-secondary flex items-center justify-center gap-2'>
                      <svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12'></path>
                      </svg>
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Sidebar -->
            <div class='lg:col-span-1'>
              <div class='card sticky top-24'>
                <h3 class='font-bold mb-4 flex items-center gap-2'>
                  <svg class='w-5 h-5 text-primary-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 6h16M4 10h16M4 14h16M4 18h16'></path>
                  </svg>
                  Menu Profil
                </h3>
                <div class='space-y-2'>
                  <button onclick='showEditForm()' class='w-full text-left px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 flex items-center gap-3 group'>
                    <svg class='w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'></path>
                    </svg>
                    <span class='font-medium'>Edit Profil</span>
                  </button>
                  <a href='/orders' data-link class='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-50 transition-all duration-200 group'>
                    <svg class='w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'></path>
                    </svg>
                    <span class='font-medium'>Riwayat Pesanan</span>
                  </a>
                  <a href='/orders' data-link class='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-50 transition-all duration-200 group'>
                    <svg class='w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'></path>
                      <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'></path>
                    </svg>
                    <span class='font-medium'>Lacak Pesanan</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    ${Footer()}
  `;

  loadProfile();
  setupFormHandlers();
  
  // Setup photo upload handlers after DOM is fully ready
  requestAnimationFrame(() => {
    setTimeout(() => {
      setupPhotoUploadHandlers();
    }, 200);
  });
}

async function loadProfile() {
  try {
    const response = await userAPI.getProfile();
    const profile = response.data.data;

    // Update user data in localStorage with latest profile info
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...profile };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Check verification status and show alert if needed
    const verificationAlert = document.getElementById('verification-alert');
    if (!profile.isverified) {
      verificationAlert.classList.remove('hidden');
    } else {
      verificationAlert.classList.add('hidden');
    }

    // Update profile photo
    const profilePhoto = document.getElementById('profile-photo');
    const defaultPhoto = 'https://i.pinimg.com/736x/9d/16/4e/9d164e4e074d11ce4de0a508914537a8.jpg';

    if (profile.profile) {
      profilePhoto.src = profile.profile;
      // Handle image load error
      profilePhoto.onerror = function() {
        this.src = defaultPhoto;
      };
    } else {
      profilePhoto.src = defaultPhoto;
    }

    // Update username in heading
    const usernameElement = document.getElementById('profile-username');
    if (usernameElement && profile.username) {
      usernameElement.textContent = profile.username;
    }

    // Update navbar profile photo
    updateNavbarProfilePhoto();

    document.getElementById('profile-info').innerHTML = `
      <div class='space-y-6'>
        <div class='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label class='block text-sm font-medium text-neutral-500 mb-1'>Nama Lengkap</label>
            <p class='text-lg font-medium break-words'>${profile.name || '-'}</p>
          </div>
          <div>
            <label class='block text-sm font-medium text-neutral-500 mb-1'>Email</label>
            <p class='text-lg break-words'>${profile.email || '-'}</p>
          </div>
          <div>
            <label class='block text-sm font-medium text-neutral-500 mb-1'>Nomor Telepon</label>
            <p class='text-lg break-words'>${profile.phone || '-'}</p>
          </div>
          <div>
            <label class='block text-sm font-medium text-neutral-500 mb-1'>NIK</label>
            <p class='text-lg break-words'>${profile.nik || '-'}</p>
          </div>
          <div>
            <label class='block text-sm font-medium text-neutral-500 mb-1'>Role</label>
            <p class='text-lg capitalize'>${profile.role || 'user'}</p>
          </div>
          <div>
            <label class='block text-sm font-medium text-neutral-500 mb-1'>Status Verifikasi</label>
            <div class='flex items-center gap-2'>
              ${profile.isverified ? 
                '<span class="badge badge-success">Terverifikasi</span>' : 
                '<span class="badge badge-warning">Belum Terverifikasi</span>'}
            </div>
          </div>
        </div>
        <div>
          <label class='block text-sm font-medium text-neutral-500 mb-1'>Bergabung Sejak</label>
          <p class='text-lg'>${profile.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID') : '-'}</p>
        </div>
      </div>
    `;

    // Fill edit form with current data
    document.getElementById('name').value = profile.name || '';
    document.getElementById('email').value = profile.email || '';
    document.getElementById('phone').value = profile.phone || '';
    document.getElementById('nik').value = profile.nik || '';

  } catch (error) {
    console.error('Error loading profile:', error);
    document.getElementById('profile-info').innerHTML = ErrorMessage(
      'Gagal memuat profil. Silakan coba lagi.'
    );
  }
}

function setupPhotoUploadHandlers() {
  const fileInput = document.getElementById('profile-photo-input');
  const cameraBtn = document.querySelector('button[title="Ubah Foto"]');

  if (cameraBtn) {
    cameraBtn.addEventListener('click', function() {
      const currentFileInput = document.getElementById('profile-photo-input');
      if (currentFileInput) {
        currentFileInput.click();
      }
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', async function(e) {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          showNotification('Format file tidak didukung. Gunakan JPEG, JPG, atau PNG.', 'error');
          this.value = '';
          return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          showNotification('Ukuran file terlalu besar. Maksimal 5MB.', 'error');
          this.value = '';
          return;
        }

        // Auto upload the file
        await uploadProfilePhoto(file);
      }
    });
  }
}

async function uploadProfilePhoto(file) {
  const fileInput = document.getElementById('profile-photo-input');

  // Show loading state on camera button
  const cameraBtn = document.querySelector('button[title="Ubah Foto"]');
  if (cameraBtn) {
    cameraBtn.disabled = true;
    cameraBtn.innerHTML = `
      <svg class='w-4 h-4 animate-spin' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'></path>
      </svg>
    `;
  }

  try {
    await userAPI.uploadProfilePhoto(file);
    showNotification('Foto profil berhasil diupload!', 'success');
    
    // Reload profile to show new photo
    await loadProfile();
    
    // Update navbar profile photo
    updateNavbarProfilePhoto();
    
    // Clear file input
    if (fileInput) fileInput.value = '';
    
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    showNotification(
      error.response?.data?.message || 'Gagal mengupload foto profil',
      'error'
    );
  } finally {
    // Reset camera button
    if (cameraBtn) {
      cameraBtn.disabled = false;
      cameraBtn.innerHTML = `
        <svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6'></path>
        </svg>
      `;
    }
  }
}


function setupFormHandlers() {
  const form = document.getElementById('profile-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        nik: formData.get('nik')
      };

      try {
        await userAPI.updateProfile(data);
        showNotification('Profil berhasil diperbarui', 'success');

        // Reload profile data
        await loadProfile();

        // Hide edit form and show profile info
        document.getElementById('edit-profile-form').classList.add('hidden');
        document.getElementById('profile-info').parentElement.classList.remove('hidden');

      } catch (error) {
        console.error('Error updating profile:', error);
        showNotification(
          error.response?.data?.message || 'Gagal memperbarui profil',
          'error'
        );
      }
    });
  }
}

function showEditForm() {
  document.getElementById('profile-info').parentElement.classList.add('hidden');
  document.getElementById('edit-profile-form').classList.remove('hidden');
}

function cancelEdit() {
  document.getElementById('edit-profile-form').classList.add('hidden');
  document.getElementById('profile-info').parentElement.classList.remove('hidden');
}

// Make functions global so they can be called from onclick
window.showEditForm = showEditForm;
window.cancelEdit = cancelEdit;