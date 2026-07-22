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

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['id_kamar', 'nama', 'tipe_kamar', 'harga', 'status_kamar', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $kamar = $query->paginate($request->get('per_page', 25));

        return Inertia::render('admin/kamar/index', [
            'kamar' => $kamar,
            'filters' => $request->only(['search', 'status', 'per_page', 'sort_by', 'sort_order']),
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
            'tipe_kamar' => 'required|in:Superior Room Balcony,Deluxe Room Balcony,Twinbed Room Balcony,Junior Suite Room Balcony,Triple Room Balcony',
            'harga' => 'required|numeric|min:0',
            'fasilitas' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'status_kamar' => 'required|in:tersedia,tidak tersedia',
        ]);

        $validated['id_kamar'] = IdGenerator::kamar();

        if ($request->hasFile('cover')) {
            $validated['cover'] = $request->file('cover')->store('kamar', 'public');
        }

        Kamar::create($validated);

        return redirect()->route('admin.kamar.index')
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
            'tipe_kamar' => 'required|in:Superior Room Balcony,Deluxe Room Balcony,Twinbed Room Balcony,Junior Suite Room Balcony,Triple Room Balcony',
            'harga' => 'required|numeric|min:0',
            'fasilitas' => 'nullable|string',
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

        return redirect()->route('admin.kamar.index')
            ->with('toast', ['type' => 'success', 'message' => 'Kamar berhasil diupdate.']);
    }

    public function destroy(Kamar $kamar): RedirectResponse
    {
        if ($kamar->cover) {
            \Storage::disk('public')->delete($kamar->cover);
        }

        $kamar->delete();

        return redirect()->route('admin.kamar.index')
            ->with('toast', ['type' => 'success', 'message' => 'Kamar berhasil dihapus.']);
    }
}
