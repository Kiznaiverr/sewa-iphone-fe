import { Navbar, Footer } from '../../components/layout/Layout.js';
import { LoadingSpinner, ErrorMessage } from '../../components/common/Components.js';
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
                    <div class='relative'>
                      <div class='w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-neutral-200'>
                        <img id='profile-photo' src='https://i.pinimg.com/736x/9d/16/4e/9d164e4e074d11ce4de0a508914537a8.jpg' alt='Foto Profil' class='w-full h-full object-cover'>
                      </div>
                      <button class='absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 hover:bg-primary-600 transition-colors shadow-lg border-2 border-white' title='Ubah Foto'>
                        <svg class='w-4 h-4' fill='none' stroke='#374151' viewBox='0 0 24 24'>
                          <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'></path>
                          <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class='flex-1 text-center sm:text-left'>
                    <h2 id='profile-username' class='text-xl font-bold mb-2'>Foto Profil</h2>
                    <p class='text-sm text-neutral-500'>Klik ikon kamera untuk mengubah foto profil</p>
                    <input type='file' id='profile-photo-input' accept='image/jpeg,image/jpg,image/png' class='hidden'>
                  </div>
                </div>
              </div>

              <!-- Profile Info -->
              <div class='card mb-4'>
                <h2 class='text-xl font-bold mb-6'>Informasi Pribadi</h2>
                <div id='profile-info'>
                  ${LoadingSpinner()}
                </div>
              </div>

              <!-- Edit Profile Form (Hidden by default) -->
              <div id='edit-profile-form' class='card hidden mb-4'>
                <h2 class='text-xl font-bold mb-6'>Edit Profil</h2>
                <form id='profile-form' class='space-y-4'>
                  <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label class='block text-sm font-medium text-neutral-700 mb-2'>Nama Lengkap</label>
                      <input type='text' id='name' name='name' class='input' required>
                    </div>
                    <div>
                      <label class='block text-sm font-medium text-neutral-700 mb-2'>Email</label>
                      <input type='email' id='email' name='email' class='input' required>
                    </div>
                    <div>
                      <label class='block text-sm font-medium text-neutral-700 mb-2'>Nomor Telepon</label>
                      <input type='tel' id='phone' name='phone' class='input' required>
                    </div>
                    <div>
                      <label class='block text-sm font-medium text-neutral-700 mb-2'>NIK</label>
                      <input type='text' id='nik' name='nik' class='input' required>
                    </div>
                  </div>
                  <div class='flex gap-4 pt-4'>
                    <button type='submit' class='btn btn-primary'>Simpan Perubahan</button>
                    <button type='button' onclick='cancelEdit()' class='btn btn-secondary'>Batal</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Sidebar -->
            <div class='lg:col-span-1'>
              <div class='card'>
                <h3 class='font-bold mb-4'>Menu</h3>
                <div class='space-y-2'>
                  <button onclick='showEditForm()' class='w-full text-left px-4 py-2 rounded-lg hover:bg-neutral-100 transition-colors'>
                    Edit Profil
                  </button>
                  <a href='/orders' data-link class='block px-4 py-2 rounded-lg hover:bg-neutral-100 transition-colors'>
                    Riwayat Pesanan & Lacak
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