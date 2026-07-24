<?php

use App\Http\Controllers\Admin\CheckinController;
use App\Http\Controllers\Admin\CheckoutController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\KamarController;
use App\Http\Controllers\Admin\LaporanController;
use App\Http\Controllers\Admin\RekeningController;
use App\Http\Controllers\Admin\ReservasiController;
use App\Http\Controllers\Admin\TamuController;
use App\Http\Controllers\Admin\TipeController;
use App\Http\Controllers\OnlineController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', WelcomeController::class)->name('home');

Route::middleware('auth')->group(function () {
    // Dashboard — admin + pimpinan
    Route::middleware('role:admin,pimpinan')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });

    // Admin only CRUD
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::resource('tipe', TipeController::class)->except(['show']);
        Route::resource('tamu', TamuController::class)->except(['show']);
        Route::resource('kamar', KamarController::class)->except(['show']);
        Route::get('reservasi-search/tamu', [ReservasiController::class, 'searchTamu'])->name('reservasi.search-tamu');
        Route::get('reservasi-search/kamar', [ReservasiController::class, 'searchKamar'])->name('reservasi.search-kamar');
        Route::get('reservasi/{reservasi}/faktur', [ReservasiController::class, 'faktur'])->name('reservasi.faktur');
        Route::post('reservasi/{reservasi}/approve', [ReservasiController::class, 'approve'])->name('reservasi.approve');
        Route::post('reservasi/{reservasi}/reject', [ReservasiController::class, 'reject'])->name('reservasi.reject');
        Route::resource('reservasi', ReservasiController::class);
        Route::get('checkin-search/reservasi', [CheckinController::class, 'searchReservasi'])->name('checkin.search-reservasi');
        Route::resource('checkin', CheckinController::class)->only(['index', 'create', 'store', 'show']);
        Route::get('checkout-search/checkin', [CheckoutController::class, 'searchCheckin'])->name('checkout.search-checkin');
        Route::get('checkout/{checkout}/faktur', [CheckoutController::class, 'faktur'])->name('checkout.faktur');
        Route::resource('checkout', CheckoutController::class)->only(['index', 'create', 'store', 'show']);
        Route::resource('rekening', RekeningController::class)->except(['show']);
    });

    // Laporan — admin + pimpinan
    Route::middleware('role:admin,pimpinan')->prefix('laporan')->name('laporan.')->group(function () {
        Route::get('kamar', [LaporanController::class, 'kamar'])->name('kamar');
        Route::get('tamu', [LaporanController::class, 'tamu'])->name('tamu');
        Route::get('reservasi', [LaporanController::class, 'reservasi'])->name('reservasi');
        Route::get('checkin', [LaporanController::class, 'checkin'])->name('checkin');
        Route::get('checkout', [LaporanController::class, 'checkout'])->name('checkout');
        Route::get('pendapatan', [LaporanController::class, 'pendapatan'])->name('pendapatan');
        Route::get('{type}/export-pdf', [LaporanController::class, 'exportPdf'])->name('export-pdf');
    });

    // User portal
    Route::middleware('role:user')->prefix('portal')->name('portal.')->group(function () {
        Route::get('/', [OnlineController::class, 'dashboard'])->name('dashboard');
        Route::get('/lengkapi-data', [OnlineController::class, 'lengkapiData'])->name('lengkapi-data');
        Route::post('/lengkapi-data', [OnlineController::class, 'simpanDataTamu'])->name('simpan-data-tamu');
        Route::get('/booking', [OnlineController::class, 'booking'])->name('booking');
        Route::get('/booking-search/tipe-summary', [OnlineController::class, 'tipeSummary'])->name('booking.tipe-summary');
        Route::get('/booking-search/kamar', [OnlineController::class, 'kamarByTipe'])->name('booking.kamar');
        Route::post('/booking', [OnlineController::class, 'saveBooking'])->name('booking.save');
        Route::get('/booking/{reservasi}', [OnlineController::class, 'bookingDetail'])->name('booking.detail');
        Route::get('/booking/{reservasi}/faktur', [OnlineController::class, 'faktur'])->name('booking.faktur');
        Route::get('/booking/{reservasi}/payment', [OnlineController::class, 'paymentUpload'])->name('booking.payment');
        Route::post('/booking/{reservasi}/payment', [OnlineController::class, 'savePayment'])->name('booking.payment.save');
        Route::post('/booking/{reservasi}/cancel', [OnlineController::class, 'cancelBooking'])->name('booking.cancel');
    });
});

require __DIR__.'/settings.php';
