# O'quv Markaz CRM Tizimi

IT Park Academy o'quv markazini boshqarish uchun mo'ljallangan zamonaviy CRM platformasi. Tizim to'liq ma'lumotlar bazasi boshqaruvi, haftalik dars jadvallari (conflict validation bilan) va interaktiv tahliliy boshqaruv paneli (Dashboard) bilan jihozlangan.

## Texnologik Stack

- **Backend**: Node.js + NestJS (TypeScript), class-validator, class-transformer
- **Frontend**: React (TypeScript) + Vite, Tailwind CSS v4, Lucide React, Chart.js
- **Database ORM**: PostgreSQL + Prisma ORM
- **Autentifikatsiya**: JWT (JSON Web Token), Bcrypt

## Loyihani Ishga Tushirish

### 1. Ma'lumotlar Bazasi va Migratsiyalar (PostgreSQL)

Backend papkasida `.env` faylini to'g'irlang, so'ngra migratsiya va seed skriptlarini ishga tushiring:

```bash
cd backend
# Prisma migratsiya va seed
npx prisma migrate dev --name init
npx prisma db seed
```

### 2. Backend Serverni Ishga Tushirish

```bash
cd backend
npm run start:dev
```
Backend API serveri `http://localhost:3000` portida ishga tushadi.
API Swagger hujjati: `http://localhost:3000/api/docs`

### 3. Frontend Clientni Ishga Tushirish

```bash
cd frontend
npm run dev
```
Tizim brauzerda ochiladi. Tizimga kirish uchun standart ma'lumotlar:
- **Login**: `admin`
- **Parol**: `admin123`
