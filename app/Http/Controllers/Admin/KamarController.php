<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kamar;
use App\Services\IdGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KamarController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Kamar::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('id_kamar', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%");
            });
        }

        if ($status = $request->get('status')) {
            $query->where('status_kamar', $status);
        }

        $kamar = $query->latest()->paginate($request->get('per_page', 10));

        return Inertia::render('admin/kamar/index', [
            'kamar' => $kamar,
            'filters' => $request->only(['search', 'status', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/kamar/form', [
            'nextId' => IdGenerator::kamar(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:50',
            'harga' => 'required|numeric|min:0',
            'dp' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'status_kamar' => 'required|in:tersedia,tidak tersedia',
        ]);

        $validated['id_kamar'] = IdGenerator::kamar();

        if ($request->hasFile('cover')) {
            $validated['cover'] = $request->file('cover')->store('kamar', 'public');
        }

        Kamar::create($validated);

        return redirect()->route('kamar.index')
            ->with('toast', ['type' => 'success', 'message' => 'Kamar berhasil ditambahkan.']);
    }

    public function edit(Kamar $kamar): Response
    {
        return Inertia::render('admin/kamar/form', [
            'kamar' => $kamar,
        ]);
    }

    public function update(Request $request, Kamar $kamar): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:50',
            'harga' => 'required|numeric|min:0',
            'dp' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'status_kamar' => 'required|in:tersedia,tidak tersedia',
        ]);

        if ($request->hasFile('cover')) {
            if ($kamar->cover) {
                \Storage::disk('public')->delete($kamar->cover);
            }
            $validated['cover'] = $request->file('cover')->store('kamar', 'public');
        }

        $kamar->update($validated);

        return redirect()->route('kamar.index')
            ->with('toast', ['type' => 'success', 'message' => 'Kamar berhasil diupdate.']);
    }

    public function destroy(Kamar $kamar): RedirectResponse
    {
        if ($kamar->cover) {
            \Storage::disk('public')->delete($kamar->cover);
        }

        $kamar->delete();

        return redirect()->route('kamar.index')
            ->with('toast', ['type' => 'success', 'message' => 'Kamar berhasil dihapus.']);
    }
}
