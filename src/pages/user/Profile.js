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

          <div class='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <!-- Profile Info -->
            <div class='lg:col-span-2'>
              <div class='card mb-6'>
                <h2 class='text-xl font-bold mb-6'>Informasi Pribadi</h2>
                <div id='profile-info'>
                  ${LoadingSpinner()}
                </div>
              </div>

              <!-- Edit Profile Form (Hidden by default) -->
              <div id='edit-profile-form' class='card hidden'>
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
            <div>
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

    document.getElementById('profile-info').innerHTML = `
      <div class='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label class='block text-sm font-medium text-neutral-500 mb-1'>Nama Lengkap</label>
          <p class='text-lg font-medium'>${profile.name || '-'}</p>
        </div>
        <div>
          <label class='block text-sm font-medium text-neutral-500 mb-1'>Email</label>
          <p class='text-lg'>${profile.email || '-'}</p>
        </div>
        <div>
          <label class='block text-sm font-medium text-neutral-500 mb-1'>Nomor Telepon</label>
          <p class='text-lg'>${profile.phone || '-'}</p>
        </div>
        <div>
          <label class='block text-sm font-medium text-neutral-500 mb-1'>NIK</label>
          <p class='text-lg'>${profile.nik || '-'}</p>
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