<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tipe;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TipeController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Tipe::withCount('kamar');

        if ($search = $request->get('search')) {
            $query->where('nama_tipe', 'like', "%{$search}%");
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['id', 'nama_tipe', 'aktif', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $tipe = $query->paginate($request->get('per_page', 25));

        return Inertia::render('admin/tipe/index', [
            'tipe' => $tipe,
            'filters' => $request->only(['search', 'per_page', 'sort_by', 'sort_order']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/tipe/form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_tipe' => 'required|string|max:100|unique:tipe,nama_tipe',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'aktif' => 'required|boolean',
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('tipe', 'public');
        }

        Tipe::create($validated);

        return redirect()->route('admin.tipe.index')
            ->with('toast', ['type' => 'success', 'message' => 'Tipe kamar berhasil ditambahkan.']);
    }

    public function edit(Tipe $tipe): Response
    {
        return Inertia::render('admin/tipe/form', [
            'tipe' => $tipe,
        ]);
    }

    public function update(Request $request, Tipe $tipe): RedirectResponse
    {
        $validated = $request->validate([
            'nama_tipe' => 'required|string|max:100|unique:tipe,nama_tipe,'.$tipe->id,
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'aktif' => 'required|boolean',
        ]);

        if ($request->hasFile('foto')) {
            if ($tipe->foto) {
                \Storage::disk('public')->delete($tipe->foto);
            }
            $validated['foto'] = $request->file('foto')->store('tipe', 'public');
        }

        $tipe->update($validated);

        return redirect()->route('admin.tipe.index')
            ->with('toast', ['type' => 'success', 'message' => 'Tipe kamar berhasil diupdate.']);
    }

    public function destroy(Tipe $tipe): RedirectResponse
    {
        if ($tipe->kamar()->exists()) {
            return redirect()->route('admin.tipe.index')
                ->with('toast', ['type' => 'error', 'message' => 'Tipe tidak bisa dihapus karena masih digunakan oleh kamar.']);
        }

        if ($tipe->foto) {
            \Storage::disk('public')->delete($tipe->foto);
        }

        $tipe->delete();

        return redirect()->route('admin.tipe.index')
            ->with('toast', ['type' => 'success', 'message' => 'Tipe kamar berhasil dihapus.']);
    }
}
