import './styles/globals.css';
import Router from './js/utils/router.js';
import { isAuthenticated, isAdmin } from './js/utils/helpers.js';
import { HomePage } from './pages/Home.js';
import { IphonesPage } from './pages/Iphones.js';
import { IphoneDetailPage } from './pages/IphoneDetail.js';
import { LoginPage, RegisterPage } from './pages/Auth.js';
import { OrdersPage } from './pages/Orders.js';
import { TrackOrderPage } from './pages/TrackOrder.js';
import { TestimonialsPage } from './pages/Testimonials.js';
import { ProfilePage } from './pages/user/Profile.js';
import { VerificationPage } from './pages/Verification.js';
import { ForgotPasswordPage } from './pages/ForgotPassword.js';
import { ResetPasswordPage } from './pages/ResetPassword.js';
import { AdminDashboardPage, AdminIphonesPage, AdminCreateIphonePage, AdminOrdersPage, AdminRentalsPage, AdminUsersPage } from './pages/admin/AdminPages.js';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage.js';
import { showLogoutConfirmation, closeModal, confirmLogout, showOrderSuccessModal, confirmDelete } from './components/common/index.js';

const router = new Router();

window.__router = router;

function handleDynamicRoute(path) {
  const matchedRoute = path.match(/^\/iphones\/(\d+)$/);
  const trackOrderRoute = path.match(/^\/orders\/track\/(.+)$/);

  if (matchedRoute) {
    const id = matchedRoute[1];
    IphoneDetailPage(id);
  } else if (trackOrderRoute) {
    const code = trackOrderRoute[1];
    TrackOrderPage(code);
  }
}

window.__handleDynamicRoute = handleDynamicRoute;

router.register('/', HomePage);
router.register('/iphones', IphonesPage);
router.register('/testimonials', TestimonialsPage);
router.register('/login', LoginPage);
router.register('/register', RegisterPage);
router.register('/forgot-password', ForgotPasswordPage);
router.register('/reset-password', ResetPasswordPage);

router.register('/orders', () => {
  if (!isAuthenticated()) {
    router.navigate('/login');
  } else {
    OrdersPage();
  }
});

router.register('/profile', () => {
  if (!isAuthenticated()) {
    router.navigate('/login');
  } else {
    ProfilePage();
  }
});

router.register('/verify', () => {
  if (!isAuthenticated()) {
    router.navigate('/login');
  } else {
    VerificationPage();
  }
});

router.register('/admin', () => {
  if (!isAdmin()) {
    router.navigate('/');
  } else {
    AdminDashboardPage();
  }
});

router.register('/admin/iphones', () => {
  if (!isAdmin()) {
    router.navigate('/');
  } else {
    AdminIphonesPage();
  }
});

router.register('/admin/iphones/create', () => {
  if (!isAdmin()) {
    router.navigate('/');
  } else {
    AdminCreateIphonePage();
  }
});

router.register('/admin/orders', () => {
  if (!isAdmin()) {
    router.navigate('/');
  } else {
    AdminOrdersPage();
  }
});

router.register('/admin/rentals', () => {
  if (!isAdmin()) {
    router.navigate('/');
  } else {
    AdminRentalsPage();
  }
});

router.register('/admin/users', () => {
  if (!isAdmin()) {
    router.navigate('/');
  } else {
    AdminUsersPage();
  }
});

router.register('/admin/testimonials', () => {
  if (!isAdmin()) {
    router.navigate('/');
  } else {
    AdminTestimonialsPage();
  }
});

router.setNotFound(() => {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="min-h-screen flex-center">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-neutral-900 mb-4">404</h1>
        <p class="text-2xl text-neutral-600 mb-8">Halaman tidak ditemukan</p>
        <a href="/" data-link class="btn btn-primary">Kembali ke Beranda</a>
      </div>
    </div>
  `;
});

window.handleLogout = () => {
  showLogoutConfirmation();
};

// Make modal functions global
window.showLogoutConfirmation = showLogoutConfirmation;
window.closeModal = closeModal;
window.confirmLogout = confirmLogout;
window.showOrderSuccessModal = showOrderSuccessModal;
window.confirmDelete = confirmDelete;
window.goToOrders = () => {
  router.navigate('/orders');
};

router.init();

document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const matchedRoute = currentPath.match(/^\/iphones\/(\d+)$/);
  const trackOrderRoute = currentPath.match(/^\/orders\/track\/(.+)$/);

  if (matchedRoute) {
    const id = matchedRoute[1];
    IphoneDetailPage(id);
  } else if (trackOrderRoute) {
    const code = trackOrderRoute[1];
    TrackOrderPage(code);
  }
});
