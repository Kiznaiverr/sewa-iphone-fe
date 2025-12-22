// Global type declarations
declare global {
  interface Window {
    __router: any;
    __handleDynamicRoute: (path: string) => void;
    submitOrder: (iphoneId: number) => Promise<void>;
    trackOrder: (code: string) => void;
    resetTestimonialForm: () => void;
    showEditForm: () => void;
    cancelEdit: () => void;
    sendVerificationCode: () => Promise<void>;
    verifyCode: () => Promise<void>;
    resendCode: () => Promise<void>;
    backToSend: () => void;
    closeAppVersionModal: () => void;
    closeNewVersionModal: () => void;
    dismissAppAnnouncement: () => void;
    showLogoutConfirmation: () => void;
    closeModal: () => void;
    confirmLogout: () => void;
    showOrderSuccessModal: () => void;
    confirmDelete: (id: number) => void;
    goToOrders: () => void;
    handleLogout: () => void;
    __handleAlertClose: () => void;
    __confirmUserAction: () => void;
    __deleteTestimonialCallback: (id: number) => void;
    // Admin functions
    editIphone: (id: number) => void;
    __saveIphoneEdit: (iphoneId: number) => Promise<void>;
    deleteIphone: (id: number) => void;
    editUser: (userId: number) => void;
    __saveUserEdit: (id: number) => Promise<void>;
    deleteUser: (userId: number, type: 'soft' | 'hard') => Promise<void>;
    deleteTestimonial: (testimonialId: number) => Promise<void>;
    showUpdateStatusModal: (orderId: number, currentStatus: string) => void;
    updateOrderStatus: (orderId: number, newStatus: string) => Promise<void>;
    returnRental: (rentalId: number) => Promise<void>;
    showOverdueDetail: (rentalId: number) => void;
    overdueRentalsData: any[];
  }
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};