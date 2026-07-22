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

        $sortBy = $request->get('sort_by', 'tgl');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['tgl', 'keterangan', 'total', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $pengeluaran = $query->paginate($request->get('per_page', 25));

        return Inertia::render('admin/pengeluaran/index', [
            'pengeluaran' => $pengeluaran,
            'filters' => $request->only(['search', 'bulan', 'tahun', 'per_page', 'sort_by', 'sort_order']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/pengeluaran/form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tgl' => 'required|date',
            'keterangan' => 'required|string',
            'total' => 'required|numeric|min:0',
        ]);

        Pengeluaran::create($validated);

        return redirect()->route('admin.pengeluaran.index')
            ->with('toast', ['type' => 'success', 'message' => 'Pengeluaran berhasil ditambahkan.']);
    }

    public function edit(Pengeluaran $pengeluaran): Response
    {
        return Inertia::render('admin/pengeluaran/form', [
            'pengeluaran' => $pengeluaran,
        ]);
    }

    public function update(Request $request, Pengeluaran $pengeluaran): RedirectResponse
    {
        $validated = $request->validate([
            'tgl' => 'required|date',
            'keterangan' => 'required|string',
            'total' => 'required|numeric|min:0',
        ]);

        $pengeluaran->update($validated);

        return redirect()->route('admin.pengeluaran.index')
            ->with('toast', ['type' => 'success', 'message' => 'Pengeluaran berhasil diupdate.']);
    }

    public function destroy(Pengeluaran $pengeluaran): RedirectResponse
    {
        $pengeluaran->delete();

        return redirect()->route('admin.pengeluaran.index')
            ->with('toast', ['type' => 'success', 'message' => 'Pengeluaran berhasil dihapus.']);
    }
}
