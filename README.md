# Sistem Inventory Multi-Gudang

Sistem manajemen inventaris berbasis Laravel 12 dan Inertia React (TypeScript) untuk mengelola stok, transaksi, serta distribusi barang antar gudang secara terstruktur, aman, dan terkontrol.

Aplikasi ini dirancang dengan pendekatan modular dan role-based access control sehingga cocok digunakan untuk operasional gudang skala kecil hingga menengah.

---

## Fitur Utama

### 1. Role dan Hak Akses
- Super Admin – Akses penuh ke seluruh sistem
- Admin Gudang – Mengelola operasional gudang yang ditugaskan
- Viewer – Akses monitoring dan laporan (read-only)

Sistem menggunakan Spatie Permission dan Laravel Policy untuk memastikan kontrol akses yang aman dan terstruktur.

---

### 2. Manajemen Stok
- Monitoring stok real-time per gudang
- Validasi sebelum transaksi diproses
- Status stok otomatis (Normal, Menipis, Habis)
- Audit trail untuk setiap perubahan stok

---

### 3. Barang Masuk
- Pencatatan barang dari supplier
- Penambahan stok otomatis
- Data transaksi tidak dapat dihapus untuk menjaga integritas
- Riwayat perubahan tercatat secara sistematis

---

### 4. Barang Keluar
- Validasi ketersediaan stok
- Transaksi otomatis ditolak jika stok tidak mencukupi
- Pengurangan stok dilakukan secara otomatis

---

### 5. Mutasi Antar Gudang
- Transfer stok antar gudang
- Mekanisme status: Dikirim → Diterima
- Stok asal berkurang dan stok tujuan bertambah secara otomatis
- Seluruh proses tercatat dalam histori sistem

---

### 6. Laporan dan Monitoring
- Dashboard statistik
- Fitur pencarian dan filter data
- Export laporan dalam format PDF dan Excel
- Akses laporan menyesuaikan role pengguna

---

## Arsitektur Sistem

### Backend
- Laravel 12
- Spatie Roles & Permission
- Laravel Fortify Authentication
- Policy-based Authorization
- Service / Action Layer
- Sistem audit stok (stock_history)

### Frontend
- Inertia.js
- React
- TypeScript

### Database
- Mendukung multi-gudang
- Foreign key constraints
- Composite unique keys
- Audit trail terintegrasi

---

## Instalasi

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
npm run dev
