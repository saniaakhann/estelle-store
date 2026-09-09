<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;


// =====================================================
// PUBLIC PRODUCT ROUTES
// =====================================================

Route::get('/products', [
    ProductController::class,
    'index'
]);

Route::get('/products/{product}', [
    ProductController::class,
    'show'
]);


// =====================================================
// ADMIN PRODUCT ROUTES
// =====================================================

Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    Route::post('/products', [
        ProductController::class,
        'store'
    ]);

    Route::put('/products/{product}', [
        ProductController::class,
        'update'
    ]);

    Route::delete('/products/{product}', [
        ProductController::class,
        'destroy'
    ]);

});


// =====================================================
// CUSTOMER ORDER ROUTES
// =====================================================

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/orders', [
        OrderController::class,
        'store'
    ]);

    Route::get('/orders', [
        OrderController::class,
        'index'
    ]);

    Route::get('/orders/{order}', [
        OrderController::class,
        'show'
    ]);

});


// =====================================================
// GOOGLE AUTHENTICATION
// =====================================================

Route::get('/auth/google', [
    AuthController::class,
    'redirectToGoogle'
]);

Route::get('/auth/google/callback', [
    AuthController::class,
    'handleGoogleCallback'
]);


// =====================================================
// LOGGED-IN USER ROUTES
// =====================================================

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/auth/me', [
        AuthController::class,
        'me'
    ]);

    Route::post('/auth/logout', [
        AuthController::class,
        'logout'
    ]);

});


// =====================================================
// ADMIN ORDER ROUTES
// =====================================================

Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    Route::put('/orders/{order}/status', [
        OrderController::class,
        'updateStatus'
    ]);

});