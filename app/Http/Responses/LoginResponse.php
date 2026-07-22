<?php

namespace App\Http\Responses;

use App\Http\Responses\Concerns\RedirectsToRoleHome;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    use RedirectsToRoleHome;

    public function toResponse($request): Response
    {
        if ($request->wantsJson()) {
            return response()->json(['two_factor' => false]);
        }

        return redirect()->to($this->redirectUrlFor($request, $request->user()));
    }
}
