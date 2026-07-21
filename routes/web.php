<?php

use App\Http\Controllers\Admin\CheckinController;
use App\Http\Controllers\Admin\CheckoutController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\KamarController;
use App\Http\Controllers\Admin\LaporanController;
use App\Http\Controllers\Admin\PengeluaranController;
use App\Http\Controllers\Admin\ReservasiController;
use App\Http\Controllers\Admin\TamuController;
use App\Http\Controllers\OnlineController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('login'));
Route::inertia('/welcome', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard — admin + pimpinan
    Route::middleware('role:admin,pimpinan')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });

    // Admin only CRUD
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::resource('tamu', TamuController::class)->except(['show']);
        Route::resource('kamar', KamarController::class)->except(['show']);
        Route::resource('reservasi', ReservasiController::class);
        Route::resource('checkin', CheckinController::class)->only(['index', 'create', 'store', 'show']);
        Route::resource('checkout', CheckoutController::class)->only(['index', 'create', 'store', 'show']);
        Route::resource('pengeluaran', PengeluaranController::class)->only(['index', 'store', 'update', 'destroy']);
    });

    // Laporan — admin + pimpinan
    Route::middleware('role:admin,pimpinan')->group(function () {
        Route::get('laporan', [LaporanController::class, 'index'])->name('laporan.index');
    });

    // User portal
    Route::middleware('role:user')->prefix('portal')->name('portal.')->group(function () {
        Route::get('/', [OnlineController::class, 'dashboard'])->name('dashboard');
        Route::get('/lengkapi-data', [OnlineController::class, 'lengkapiData'])->name('lengkapi-data');
        Route::post('/lengkapi-data', [OnlineController::class, 'simpanDataTamu'])->name('simpan-data-tamu');
        Route::get('/booking', [OnlineController::class, 'booking'])->name('booking');
        Route::post('/booking/check-availability', [OnlineController::class, 'checkAvailability'])->name('booking.check');
        Route::post('/booking', [OnlineController::class, 'saveBooking'])->name('booking.save');
        Route::get('/booking/history', [OnlineController::class, 'bookingHistory'])->name('booking.history');
        Route::get('/booking/{reservasi}', [OnlineController::class, 'bookingDetail'])->name('booking.detail');
        Route::get('/booking/{reservasi}/payment', [OnlineController::class, 'paymentUpload'])->name('booking.payment');
        Route::post('/booking/{reservasi}/payment', [OnlineController::class, 'savePayment'])->name('booking.payment.save');
        Route::post('/booking/{reservasi}/cancel', [OnlineController::class, 'cancelBooking'])->name('booking.cancel');
    });
});

require __DIR__.'/settings.php';
