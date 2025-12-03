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
import { AdminDashboardPage, AdminIphonesPage, AdminCreateIphonePage, AdminOrdersPage, AdminRentalsPage, AdminUsersPage } from './pages/admin/AdminPages.js';
import { showLogoutConfirmation, closeModal, confirmLogout, showOrderSuccessModal } from './components/common/Components.js';

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

router.register('/orders', () => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
  } else {
    OrdersPage();
  }
});

router.register('/profile', () => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
  } else {
    ProfilePage();
  }
});

router.register('/verify', () => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
  } else {
    VerificationPage();
  }
});

router.register('/admin', () => {
  if (!isAdmin()) {
    window.location.href = '/';
  } else {
    AdminDashboardPage();
  }
});

router.register('/admin/iphones', () => {
  if (!isAdmin()) {
    window.location.href = '/';
  } else {
    AdminIphonesPage();
  }
});

router.register('/admin/iphones/create', () => {
  if (!isAdmin()) {
    window.location.href = '/';
  } else {
    AdminCreateIphonePage();
  }
});

router.register('/admin/orders', () => {
  if (!isAdmin()) {
    window.location.href = '/';
  } else {
    AdminOrdersPage();
  }
});

router.register('/admin/rentals', () => {
  if (!isAdmin()) {
    window.location.href = '/';
  } else {
    AdminRentalsPage();
  }
});

router.register('/admin/users', () => {
  if (!isAdmin()) {
    window.location.href = '/';
  } else {
    AdminUsersPage();
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
window.goToOrders = () => {
  window.location.href = '/orders';
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
