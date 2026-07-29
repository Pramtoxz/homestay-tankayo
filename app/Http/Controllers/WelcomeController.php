<?php

namespace App\Http\Controllers;

use App\Models\Tipe;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $tipes = Tipe::where('aktif', true)
            ->with(['kamar' => function ($q) {
                $q->where('status_kamar', 'tersedia')
                    ->select('id_kamar', 'nama', 'tipe_id', 'harga', 'fasilitas')
                    ->orderBy('harga');
            }])
            ->orderBy('nama_tipe')
            ->get();

        return Inertia::render('welcome', [
            'tipes' => $tipes,
        ]);
    }
}
