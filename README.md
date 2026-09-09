# Estelle Store ✦

A full-stack jewellery e-commerce web application inspired by modern luxury jewellery storefronts.

Built with **React**, **Laravel**, and **MySQL**, the application includes customer shopping functionality, Google authentication, order management, and an admin dashboard.

---

## ✨ Features

### Customer

- Browse jewellery products
- Dynamic products loaded from the Laravel backend
- Add products to shopping bag
- Increase/decrease product quantities
- Remove products from bag
- Automatic subtotal, shipping and total calculation
- Checkout with shipping details
- Place orders
- Order confirmation
- Google authentication
- Customer account authentication using Laravel Sanctum

### Admin

- Secure admin dashboard
- View order statistics
- View customer orders
- Accept or reject orders
- Add new products
- Edit existing products
- Delete products
- Manage product stock
- Activate/deactivate products

### Backend

- REST API built with Laravel
- MySQL database
- Eloquent ORM
- Laravel Sanctum authentication
- Google OAuth authentication using Laravel Socialite
- Product management APIs
- Order management APIs
- Database transactions for order creation
- Stock validation and automatic stock deduction
- Admin authorization middleware

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Laravel 13
- PHP
- Laravel Sanctum
- Laravel Socialite
- Eloquent ORM

### Database

- MySQL

### Authentication

- Google OAuth
- Laravel Sanctum

---

## 📁 Project Structure

```text
estelle-store/
│
├── backend/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   └── ...
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminDashboard.css
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── README.md
