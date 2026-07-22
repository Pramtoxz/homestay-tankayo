<?php

namespace App\Http\Responses\Concerns;

use App\Models\User;
use Illuminate\Http\Request;

trait RedirectsToRoleHome
{
    private function redirectUrlFor(Request $request, User $user): string
    {
        $home = $this->homeFor($user);
        $intended = $request->session()->pull('url.intended');

        if (is_string($intended) && $this->isUrlAllowedFor($intended, $user)) {
            return $intended;
        }

        return $home;
    }

    private function homeFor(User $user): string
    {
        return $user->isAdmin() || $user->isPimpinan()
            ? route('dashboard')
            : route('portal.dashboard');
    }

    private function isUrlAllowedFor(string $url, User $user): bool
    {
        $path = (string) parse_url($url, PHP_URL_PATH);

        if ($user->isAdmin()) {
            return ! str_starts_with($path, '/portal');
        }

        if ($user->isPimpinan()) {
            return str_starts_with($path, '/dashboard') || str_starts_with($path, '/laporan') || str_starts_with($path, '/settings');
        }

        return str_starts_with($path, '/portal') || str_starts_with($path, '/settings');
    }
}
