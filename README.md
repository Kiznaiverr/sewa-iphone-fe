<div align="center">

# Sewa iPhone Frontend

**Platform penyewaan iPhone modern dengan teknologi terbaru**

</div>

> [!IMPORTANT]
> Project ini hanya untuk tugas kuliah dan bukan aplikasi sesungguhnya yang digunakan untuk bisnis komersial.
> Semua fitur, data, dan fungsi dalam aplikasi hanyalah demonstrasi/simulasi untuk keperluan akademik.

---

## Fitur Utama

- **User Management**
  - Registrasi dan login dengan validasi lengkap
  - Profil pengguna yang dapat diperbarui
  - Sistem verifikasi WhatsApp

- **Product Catalog**
  - Daftar produk iPhone lengkap
  - Detail produk dengan spesifikasi
  - Filter berdasarkan stok dan harga

- **Order Management**
  - Pemesanan iPhone mudah dan cepat
  - Tracking pesanan real-time
  - Riwayat pesanan lengkap

- **Admin Panel**
  - Dashboard dengan statistik utama
  - Manajemen produk iPhone
  - Manajemen pesanan dan rental
  - Manajemen pengguna
  - Monitoring rental overdue

- **UI/UX**
  - Design modern dan minimalis
  - Responsive design untuk semua device
  - Loading states dan error handling

---

## Tech Stack

<div align="center">

| Category | Technology |
|----------|------------|
| ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) | **Language** |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white) | **Type Safety** |
| ![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white) | **Build Tool** |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.0-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white) | **Styling** |
| ![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?style=for-the-badge&logo=axios&logoColor=white) | **HTTP Client** |

</div>

---

## Setup

### Prerequisites

- Node.js v18+ dan npm v9+
- Git

### Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd sewa-iphone-fe
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
```bash
cp .env.example .env
```

Edit `.env` dan sesuaikan dengan backend API Anda:
```
VITE_API_BASE_URL=https://backend.nekoyama.my.id
VITE_APP_NAME=Sewa iPhone
VITE_APP_DESCRIPTION=Aplikasi Penyewaan iPhone Modern
```

### 4. Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### 5. Build Production
```bash
npm run build
```

Output akan berada di folder `dist/`

---

## Project Structure

```
sewa-iphone-fe/
├── src/
│   ├── components/
│   │   ├── common/          # Komponen umum (Modal, Loading, etc)
│   │   └── layout/          # Komponen layout (Navbar, Sidebar, Footer)
│   ├── pages/
│   │   ├── admin/           # Halaman admin
│   │   ├── user/            # Halaman user
│   │   ├── Home.js          # Halaman utama
│   │   ├── Auth.js          # Halaman login/register
│   │   └── ...              # Halaman lainnya
│   ├── js/
│   │   ├── api/
│   │   │   ├── client.js    # Axios client dengan interceptor
│   │   │   └── endpoints.js # API endpoints
│   │   └── utils/
│   │       ├── helpers.js   # Utility functions
│   │       └── router.js    # Client-side router
│   ├── styles/
│   │   └── globals.css      # Global styles & Tailwind
│   ├── assets/
│   │   └── images/          # Gambar dan aset
│   └── main.js              # Entry point
├── public/                  # Static files
├── index.html               # HTML utama
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

---

## API Integration

### Authentication
- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Logout: `POST /api/auth/logout`
- Verify Code: `POST /api/auth/verify-code`

### User Operations
- Get Profile: `GET /api/user/profile`
- Update Profile: `PUT /api/user/profile`
- Get Orders: `GET /api/order/user`
- Create Order: `POST /api/order`
- Get Rentals: `GET /api/rental/user`

### Products
- Get All iPhone: `GET /api/iphone`
- Get iPhone Detail: `GET /api/iphone/{id}`
- Get Testimonials: `GET /api/testimonial`

### Admin Operations
- Dashboard Stats: Multiple endpoints
- Manage iPhone: CRUD operations
- Manage Orders: Update status
- Manage Rentals: Track dan manage

---

## Authentication Flow

1. User register/login
2. JWT token disimpan di localStorage
3. Token otomatis ditambahkan ke setiap request header
4. Token expired → auto logout dan redirect ke login

---

## Development Guidelines

### Naming Conventions
- JavaScript files: `PascalCase` untuk pages/components, `camelCase` untuk utils
- CSS classes: kebab-case (Tailwind convention)
- Variables: camelCase

### Code Style
- Use ES6+ syntax
- Arrow functions untuk callbacks
- Async/await untuk API calls
- Descriptive variable names

### Error Handling
- Try-catch untuk API calls
- Show user-friendly messages
- Log errors untuk debugging

---

## Deployment

### Production Build
```bash
npm run build
```

### Deploy ke Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy ke Vercel
```bash
npm install -g vercel
vercel --prod
```

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## License

MIT License - lihat [LICENSE](LICENSE) file untuk detail

---

<div align="center">

**Made for Academic Purposes**

</div>
