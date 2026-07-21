<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tamu;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TamuController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Tamu::with('user');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nik', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%")
                    ->orWhere('nohp', 'like', "%{$search}%");
            });
        }

        $tamu = $query->latest()->paginate($request->get('per_page', 10));

        return Inertia::render('admin/tamu/index', [
            'tamu' => $tamu,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        $users = User::whereDoesntHave('tamu')->get(['id', 'name', 'email']);

        return Inertia::render('admin/tamu/form', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nik' => 'required|string|max:30|unique:tamu,nik',
            'nama' => 'required|string|max:50',
            'alamat' => 'required|string',
            'nohp' => 'required|string|max:30',
            'jk' => 'required|in:L,P',
            'user_id' => 'nullable|exists:users,id',
        ]);

        Tamu::create($validated);

        return redirect()->route('tamu.index')
            ->with('toast', ['type' => 'success', 'message' => 'Tamu berhasil ditambahkan.']);
    }

    public function edit(Tamu $tamu): Response
    {
        $users = User::whereDoesntHave('tamu')->orWhere('id', $tamu->user_id)->get(['id', 'name', 'email']);

        return Inertia::render('admin/tamu/form', [
            'tamu' => $tamu,
            'users' => $users,
        ]);
    }

    public function update(Request $request, Tamu $tamu): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:50',
            'alamat' => 'required|string',
            'nohp' => 'required|string|max:30',
            'jk' => 'required|in:L,P',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $tamu->update($validated);

        return redirect()->route('tamu.index')
            ->with('toast', ['type' => 'success', 'message' => 'Tamu berhasil diupdate.']);
    }

    public function destroy(Tamu $tamu): RedirectResponse
    {
        $tamu->delete();

        return redirect()->route('tamu.index')
            ->with('toast', ['type' => 'success', 'message' => 'Tamu berhasil dihapus.']);
    }
}
