<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Authenticate user with exact credentials and issue a Sanctum token.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'identifier' => 'required|string',
            'password' => 'required|string',
        ], [
            'identifier.required' => 'Nama atau email harus diisi.',
            'password.required' => 'Kata sandi harus diisi.',
        ]);

        $identifier = trim(strtolower($validated['identifier']));
        $password = $validated['password'];

        // Strict search: exact email or exact name (prevent fuzzy wildcard bypass)
        $user = User::whereRaw('LOWER(email) = ?', [$identifier])
            ->orWhereRaw('LOWER(name) = ?', [$identifier])
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Akun dengan nama atau email tersebut tidak ditemukan di sistem.',
            ], 404);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda dinonaktifkan oleh administrator sekolah.',
            ], 403);
        }

        // Enforce strict cryptographic hash verification
        if (!Hash::check($password, $user->password)) {
            // Backward-compatibility: if legacy plaintext seeded password matches, migrate to bcrypt hash
            if ($user->password === $password) {
                $user->password = Hash::make($password);
                $user->save();
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Kata sandi salah. Silakan coba lagi.',
                ], 401);
            }
        }

        // Issue cryptographically secure personal access token
        $token = $user->createToken('eskulhub-auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'token' => $token,
            'user' => $user,
        ]);
    }

    /**
     * Revoke current active token.
     */
    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sesi autentikasi berhasil diakhiri.',
        ]);
    }

    /**
     * Get currently authenticated user profile.
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    }

    /**
     * Public user self-registration (Strictly locked to 'student' role).
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:150|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:25',
            'nisn' => 'nullable|string|max:20',
            'class_name' => 'nullable|string|max:50',
            'gender' => 'nullable|in:L,P',
            'bio' => 'nullable|string|max:500',
        ]);

        $email = trim(strtolower($validated['email']));

        // Self-registration is strictly for students to prevent privilege escalation
        $role = 'student';

        $user = User::create([
            'id' => 'usr-' . $role . '-' . time() . '-' . Str::random(4),
            'name' => trim($validated['name']),
            'email' => $email,
            'role' => $role,
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            'is_active' => true,
            'nisn' => $validated['nisn'] ?? null,
            'class_name' => $validated['class_name'] ?? null,
            'gender' => $validated['gender'] ?? 'L',
            'bio' => $validated['bio'] ?? null,
        ]);

        $token = $user->createToken('eskulhub-auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran akun siswa berhasil!',
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    /**
     * User profile update (Protected from Mass Assignment & Privilege Escalation).
     */
    public function updateProfile(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $currentUser = $request->user();

        if (!$currentUser) {
            return response()->json([
                'success' => false,
                'message' => 'Autentikasi diperlukan. Silakan login terlebih dahulu.',
            ], 401);
        }

        // Enforce ownership: user can only edit their own profile, unless pengurus or admin
        if ($currentUser->id !== $id && !in_array($currentUser->role, ['pengurus', 'admin'], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak: Anda hanya dapat memperbarui profil Anda sendiri.',
            ], 403);
        }

        // Whitelist allowed fields. Strictly forbid editing 'role', 'is_active', or 'id'
        $allowed = $request->only([
            'name',
            'phone',
            'avatar_url',
            'nisn',
            'class_name',
            'gender',
            'bio',
            'nip',
            'subject',
        ]);

        if ($request->filled('password')) {
            $request->validate(['password' => 'min:6']);
            $allowed['password'] = Hash::make($request->input('password'));
        }

        $user->update($allowed);

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'user' => $user->fresh(),
        ]);
    }

    /**
     * User list with data privacy masking for sensitive fields.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        if (!$currentUser && $request->bearerToken()) {
            $token = \Laravel\Sanctum\PersonalAccessToken::findToken($request->bearerToken());
            if ($token && $token->tokenable && $token->tokenable->is_active) {
                $currentUser = $token->tokenable;
            }
        }

        // If authenticated staff/admin/pengurus, return full details
        if ($currentUser && in_array($currentUser->role, ['admin', 'pengurus', 'pembina', 'teacher'], true)) {
            return response()->json(User::all());
        }

        // If authenticated student: return safe list without private email/phone/nisn
        if ($currentUser && $currentUser->role === 'student') {
            $users = User::select(['id', 'name', 'role', 'avatar_url', 'class_name', 'is_active'])
                ->get();
            return response()->json($users);
        }

        // For public unauthenticated visitors: only return official staff, teachers, and pembina
        $staff = User::whereIn('role', ['pengurus', 'pembina', 'teacher', 'admin'])
            ->where('is_active', true)
            ->select(['id', 'name', 'role', 'avatar_url', 'nip', 'subject'])
            ->get();
        return response()->json($staff);
    }


        /**
         * Pengurus & Admin user creation with strict validation.
         */
        public function store(Request $request)
        {
            $currentUser = $request->user();
            if (!$currentUser || !in_array($currentUser->role, ['pengurus', 'admin'], true)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak: Hanya pengurus kesiswaan atau administrator yang berwenang membuat pengguna baru.',
                ], 403);
            }

            $validated = $request->validate([
                'id' => 'nullable|string|max:100',
                'name' => 'required|string|max:120',
                'email' => 'required|email|max:150|unique:users,email',
                'role' => 'required|in:student,pengurus,pembina,teacher,admin',
                'password' => 'nullable|string|min:6',
                'phone' => 'nullable|string|max:25',
                'avatar_url' => 'nullable|string|max:500',
                'is_active' => 'boolean',
                'nisn' => 'nullable|string|max:20',
                'class_name' => 'nullable|string|max:50',
                'gender' => 'nullable|in:L,P',
                'bio' => 'nullable|string|max:500',
                'nip' => 'nullable|string|max:30',
                'subject' => 'nullable|string|max:100',
            ]);

            $rawPassword = !empty($validated['password']) ? $validated['password'] : 'password123';
            $validated['id'] = $request->input('id') ?: ('usr-' . $validated['role'] . '-' . time() . '-' . Str::random(4));
            $validated['password'] = Hash::make($rawPassword);
            $validated['is_active'] = $validated['is_active'] ?? true;

            if (empty($validated['avatar_url'])) {
                $validated['avatar_url'] = $validated['role'] === 'student'
                    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';
            }

            $user = User::create($validated);

            return response()->json(['success' => true, 'user' => $user], 201);
        }

        /**
         * Pengurus & Admin user update.
         */
        public function update(Request $request, string $id)
        {
            $currentUser = $request->user();
            if (!$currentUser || !in_array($currentUser->role, ['pengurus', 'admin'], true)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak: Hanya pengurus kesiswaan atau administrator yang berwenang memperbarui data pengguna.',
                ], 403);
            }

            $user = User::findOrFail($id);

            // Prevent demoting or deactivating the last active pengurus/admin
            if (in_array($user->role, ['pengurus', 'admin'], true)) {
                $newRole = $request->input('role');
                $isActive = $request->input('is_active');
                $totalActiveAdmins = User::whereIn('role', ['pengurus', 'admin'])->where('is_active', true)->count();

                if ($totalActiveAdmins <= 1) {
                    if ($newRole && !in_array($newRole, ['pengurus', 'admin'], true)) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Tindakan ditolak: Tidak dapat mengubah peran pengurus utama terakhir.',
                        ], 400);
                    }
                    if ($isActive === false || $isActive === 0 || $isActive === '0') {
                        return response()->json([
                            'success' => false,
                            'message' => 'Tindakan ditolak: Tidak dapat menonaktifkan pengurus utama terakhir.',
                        ], 400);
                    }
                }
            }

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:120',
                'email' => 'sometimes|required|email|unique:users,email,' . $id,
                'role' => 'sometimes|required|in:student,pengurus,pembina,teacher,admin',
                'password' => 'nullable|string|min:6',
                'phone' => 'nullable|string|max:25',
                'avatar_url' => 'nullable|url',
                'is_active' => 'boolean',
                'nisn' => 'nullable|string|max:20',
                'class_name' => 'nullable|string|max:50',
                'gender' => 'nullable|in:L,P',
                'bio' => 'nullable|string|max:500',
                'nip' => 'nullable|string|max:30',
                'subject' => 'nullable|string|max:100',
            ]);

            if (!empty($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            } else {
                unset($validated['password']);
            }

            $user->update($validated);

            return response()->json(['success' => true, 'user' => $user->fresh()]);
        }

        /**
         * Pengurus & Admin user deletion with self-deletion and last-staff prevention.
         */
        public function destroy(Request $request, string $id)
        {
            $currentUser = $request->user();
            if (!$currentUser || !in_array($currentUser->role, ['pengurus', 'admin'], true)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak: Hanya pengurus kesiswaan atau administrator yang berwenang menghapus akun.',
                ], 403);
            }

            if ($currentUser->id === $id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tindakan ditolak: Anda tidak dapat menghapus akun Anda sendiri.',
                ], 400);
            }

            $user = User::findOrFail($id);
            if (in_array($user->role, ['pengurus', 'admin'], true)) {
                $totalAdmins = User::whereIn('role', ['pengurus', 'admin'])->count();
                if ($totalAdmins <= 1) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Tindakan ditolak: Tidak dapat menghapus pengurus utama terakhir.',
                    ], 400);
                }
            }

            $user->delete();
            return response()->json(['success' => true, 'message' => 'Akun berhasil dihapus.']);
        }

}
