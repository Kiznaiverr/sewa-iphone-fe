export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Tanggal tidak tersedia';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Format tanggal tidak valid';
    }

    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'Error format tanggal';
  }
};

export const formatDateAndTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

export const calculateTotalPrice = (pricePerDay, days) => {
  return pricePerDay * days;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const showNotification = (message, type = 'info') => {
  const notificationDiv = document.createElement('div');

  const colorMap = {
    success: 'bg-success',
    error: 'bg-error',
    warning: 'bg-warning',
    info: 'bg-info',
  };

  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ℹ',
  };

  notificationDiv.className = `fixed top-20 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg text-white ${colorMap[type]} shadow-xl z-50 max-w-md animate-in fade-in slide-in-from-top-2 duration-300`;
  
  notificationDiv.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-xl font-bold">${iconMap[type]}</span>
      <span class="font-medium">${message}</span>
    </div>
  `;

  document.body.appendChild(notificationDiv);

  // Add auto-remove animation
  setTimeout(() => {
    notificationDiv.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => {
      notificationDiv.remove();
    }, 300);
  }, 3000);
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone) => {
  return /^(\+62|62|0)[0-9]{9,12}$/.test(phone.replace(/\D/g, ''));
};

export const validateNIK = (nik) => {
  return /^\d{16}$/.test(nik);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateUsername = (username) => {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};
