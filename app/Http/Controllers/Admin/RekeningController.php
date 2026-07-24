<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rekening;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RekeningController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Rekening::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nomor', 'like', "%{$search}%");
            });
        }

        if ($jenis = $request->get('jenis')) {
            $query->where('jenis', $jenis);
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['id', 'jenis', 'nama', 'aktif', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $rekening = $query->paginate($request->get('per_page', 25));

        return Inertia::render('admin/rekening/index', [
            'rekening' => $rekening,
            'filters' => $request->only(['search', 'jenis', 'per_page', 'sort_by', 'sort_order']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/rekening/form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'jenis' => 'required|in:bank,qris,e-wallet',
            'nama' => 'required|string|max:100',
            'nomor' => 'nullable|string|max:100',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'aktif' => 'required|boolean',
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('rekening', 'public');
        }

        Rekening::create($validated);

        return redirect()->route('admin.rekening.index')
            ->with('toast', ['type' => 'success', 'message' => 'Rekening berhasil ditambahkan.']);
    }

    public function edit(Rekening $rekening): Response
    {
        return Inertia::render('admin/rekening/form', [
            'rekening' => $rekening,
        ]);
    }

    public function update(Request $request, Rekening $rekening): RedirectResponse
    {
        $validated = $request->validate([
            'jenis' => 'required|in:bank,qris,e-wallet',
            'nama' => 'required|string|max:100',
            'nomor' => 'nullable|string|max:100',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'aktif' => 'required|boolean',
        ]);

        if ($request->hasFile('foto')) {
            if ($rekening->foto) {
                \Storage::disk('public')->delete($rekening->foto);
            }
            $validated['foto'] = $request->file('foto')->store('rekening', 'public');
        }

        $rekening->update($validated);

        return redirect()->route('admin.rekening.index')
            ->with('toast', ['type' => 'success', 'message' => 'Rekening berhasil diupdate.']);
    }

    public function destroy(Rekening $rekening): RedirectResponse
    {
        if ($rekening->foto) {
            \Storage::disk('public')->delete($rekening->foto);
        }

        $rekening->delete();

        return redirect()->route('admin.rekening.index')
            ->with('toast', ['type' => 'success', 'message' => 'Rekening berhasil dihapus.']);
    }
}
