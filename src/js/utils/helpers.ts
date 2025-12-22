export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setAuthData = (token: string, user: any) => {
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

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value);
};

export const formatDate = (dateString: string) => {
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

export const formatDateAndTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

export const calculateTotalPrice = (pricePerDay: number, days: number) => {
  return pricePerDay * days;
};

export const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func: (...args: any[]) => void, limit: number) => {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
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

export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string) => {
  return /^(\+62|62|0)[0-9]{9,12}$/.test(phone.replace(/\D/g, ''));
};

export const validateNIK = (nik: string) => {
  return /^\d{16}$/.test(nik);
};

export const validatePassword = (password: string) => {
  return password.length >= 6;
};

export const validateUsername = (username: string) => {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};
