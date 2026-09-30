<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $identifier = trim(strtolower($request->input('identifier', '')));
        $password = $request->input('password');

        if (!$identifier) {
            return response()->json(['success' => false, 'message' => 'Nama atau email harus diisi.'], 400);
        }

        $user = User::whereRaw('LOWER(email) = ?', [$identifier])
            ->orWhereRaw('LOWER(name) = ?', [$identifier])
            ->orWhere('name', 'like', "%{$identifier}%")
            ->first();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Akun tidak ditemukan di sistem.'], 404);
        }

        // If password is provided and stored password is set, verify
        if ($password && $user->password) {
            if (!Hash::check($password, $user->password) && $user->password !== $password) {
                return response()->json(['success' => false, 'message' => 'Kata sandi salah.'], 401);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'user' => $user,
        ]);
    }

    public function register(Request $request)
    {
        $email = trim(strtolower($request->input('email', '')));
        if (User::where('email', $email)->exists()) {
            return response()->json(['success' => false, 'message' => 'Alamat email sudah terdaftar.'], 422);
        }

        $role = $request->input('role', 'student');
        $user = User::create([
            'id' => 'usr-' . $role . '-' . time() . '-' . Str::random(4),
            'name' => trim($request->input('name')),
            'email' => $email,
            'role' => $role,
            'password' => Hash::make($request->input('password', 'password123')),
            'phone' => $request->input('phone', '081234567890'),
            'avatar_url' => $role === 'student'
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                : ($role === 'guru'
                    ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
                    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
            'is_active' => true,
            'nisn' => $request->input('nisn'),
            'class_name' => $request->input('class_name'),
            'gender' => $request->input('gender'),
            'bio' => $request->input('bio'),
            'nip' => $request->input('nip'),
            'subject' => $request->input('subject'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran akun berhasil!',
            'user' => $user,
        ]);
    }

    public function updateProfile(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $data = $request->all();
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'user' => $user->fresh(),
        ]);
    }

    public function index()
    {
        return response()->json(User::all());
    }

    public function store(Request $request)
    {
        $email = trim(strtolower($request->input('email')));
        if (User::where('email', $email)->exists()) {
            return response()->json(['success' => false, 'message' => 'Email sudah digunakan.'], 422);
        }

        $role = $request->input('role', 'student');
        $user = User::create([
            'id' => 'usr-' . $role . '-' . time() . '-' . Str::random(4),
            'name' => $request->input('name'),
            'email' => $email,
            'role' => $role,
            'password' => Hash::make($request->input('password', 'password123')),
            'phone' => $request->input('phone'),
            'avatar_url' => $request->input('avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
            'is_active' => $request->boolean('is_active', true),
            'nisn' => $request->input('nisn'),
            'class_name' => $request->input('class_name'),
            'gender' => $request->input('gender'),
            'bio' => $request->input('bio'),
            'nip' => $request->input('nip'),
            'subject' => $request->input('subject'),
        ]);

        return response()->json(['success' => true, 'user' => $user]);
    }

    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $data = $request->all();
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        $user->update($data);
        return response()->json(['success' => true, 'user' => $user->fresh()]);
    }

    public function destroy(string $id)
    {
        User::destroy($id);
        return response()->json(['success' => true]);
    }
}
