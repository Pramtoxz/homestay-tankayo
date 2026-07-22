<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tamu;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TamuController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Tamu::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nik', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%")
                    ->orWhere('nohp', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['nik', 'nama', 'alamat', 'nohp', 'jk', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $tamu = $query->paginate($request->get('per_page', 25));

        return Inertia::render('admin/tamu/index', [
            'tamu' => $tamu,
            'filters' => $request->only(['search', 'per_page', 'sort_by', 'sort_order']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/tamu/form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nik' => 'required|string|max:30|unique:tamu,nik',
            'nama' => 'required|string|max:50',
            'alamat' => 'required|string',
            'nohp' => 'required|string|max:30',
            'jk' => 'required|in:L,P',
        ]);

        Tamu::create($validated);

        return redirect()->route('admin.tamu.index')
            ->with('toast', ['type' => 'success', 'message' => 'Tamu berhasil ditambahkan.']);
    }

    public function edit(Tamu $tamu): Response
    {
        return Inertia::render('admin/tamu/form', [
            'tamu' => $tamu,
        ]);
    }

    public function update(Request $request, Tamu $tamu): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:50',
            'alamat' => 'required|string',
            'nohp' => 'required|string|max:30',
            'jk' => 'required|in:L,P',
        ]);

        $tamu->update($validated);

        return redirect()->route('admin.tamu.index')
            ->with('toast', ['type' => 'success', 'message' => 'Tamu berhasil diupdate.']);
    }

    public function destroy(Tamu $tamu): RedirectResponse
    {
        $tamu->delete();

        return redirect()->route('admin.tamu.index')
            ->with('toast', ['type' => 'success', 'message' => 'Tamu berhasil dihapus.']);
    }
}
