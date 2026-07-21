<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pengeluaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengeluaranController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Pengeluaran::query();

        if ($search = $request->get('search')) {
            $query->where('keterangan', 'like', "%{$search}%");
        }

        if ($bulan = $request->get('bulan')) {
            $query->whereMonth('tgl', $bulan);
        }

        if ($tahun = $request->get('tahun')) {
            $query->whereYear('tgl', $tahun);
        }

        $pengeluaran = $query->latest('tgl')->paginate($request->get('per_page', 10));

        return Inertia::render('admin/pengeluaran/index', [
            'pengeluaran' => $pengeluaran,
            'filters' => $request->only(['search', 'bulan', 'tahun', 'per_page']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tgl' => 'required|date',
            'keterangan' => 'required|string',
            'total' => 'required|numeric|min:0',
        ]);

        Pengeluaran::create($validated);

        return redirect()->route('pengeluaran.index')
            ->with('toast', ['type' => 'success', 'message' => 'Pengeluaran berhasil ditambahkan.']);
    }

    public function update(Request $request, Pengeluaran $pengeluaran): RedirectResponse
    {
        $validated = $request->validate([
            'tgl' => 'required|date',
            'keterangan' => 'required|string',
            'total' => 'required|numeric|min:0',
        ]);

        $pengeluaran->update($validated);

        return redirect()->route('pengeluaran.index')
            ->with('toast', ['type' => 'success', 'message' => 'Pengeluaran berhasil diupdate.']);
    }

    public function destroy(Pengeluaran $pengeluaran): RedirectResponse
    {
        $pengeluaran->delete();

        return redirect()->route('pengeluaran.index')
            ->with('toast', ['type' => 'success', 'message' => 'Pengeluaran berhasil dihapus.']);
    }
}
