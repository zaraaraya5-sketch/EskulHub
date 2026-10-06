<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Laravel\Sanctum\PersonalAccessToken;

class HybridAuthenticate
{
    /**
     * Handle an incoming request.
     * Authenticates strictly via cryptographically validated Sanctum Bearer token.
     * Prevents header-spoofing and unauthenticated fallback vulnerabilities.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $bearerToken = $request->bearerToken();

        if ($bearerToken) {
            $token = PersonalAccessToken::findToken($bearerToken);
            if ($token && $token->tokenable) {
                // Enforce token lifetime expiration if configured in sanctum.php
                if ($token->expires_at && $token->expires_at->isPast()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Sesi autentikasi telah kedaluwarsa. Silakan login kembali.',
                    ], 401);
                }

                $user = $token->tokenable;
                if ($user->is_active) {
                    $request->setUserResolver(fn() => $user);
                    return $next($request);
                }

                return response()->json([
                    'success' => false,
                    'message' => 'Akun pengguna dinonaktifkan oleh administrator sekolah.',
                ], 403);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Autentikasi diperlukan. Silakan login terlebih dahulu.',
        ], 401);
    }
}

