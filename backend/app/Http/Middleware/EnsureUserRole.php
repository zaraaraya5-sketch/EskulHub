<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Autentikasi diperlukan. Silakan login terlebih dahulu.',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda dinonaktifkan. Silakan hubungi pihak Kesiswaan.',
            ], 403);
        }

        if (!empty($roles)) {
            $allowedRoles = [];
            foreach ($roles as $r) {
                foreach (explode(',', $r) as $sub) {
                    $trimmed = strtolower(trim($sub));
                    if ($trimmed !== '') {
                        $allowedRoles[] = $trimmed;
                    }
                }
            }

            $userRole = strtolower($user->role ?? '');
            if (!in_array($userRole, $allowedRoles, true)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak. Anda tidak memiliki hak akses (role) untuk tindakan ini.',
                ], 403);
            }
        }

        return $next($request);
    }
}
