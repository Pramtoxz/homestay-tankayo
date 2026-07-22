<?php

namespace App\Http\Controllers;

use App\Models\Kamar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $rooms = Kamar::where('status_kamar', 'tersedia')
            ->select('id_kamar', 'nama', 'tipe_kamar', 'harga', 'fasilitas', 'cover', 'deskripsi')
            ->orderBy('harga')
            ->limit(6)
            ->get();

        return Inertia::render('welcome', [
            'rooms' => $rooms,
        ]);
    }
}
