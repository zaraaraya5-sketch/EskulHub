<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\Ekskul;
use App\Models\EkskulMember;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RegistrationController extends Controller
{
    public function index(Request $request)
    {
        $query = Registration::query();
        $user = $request->user();

        // If the authenticated caller is a student, enforce seeing only their own registrations
        if ($user && $user->role === 'student') {
            $query->where('student_id', $user->id);
        } else {
            if ($request->has('student_id')) {
                $query->where('student_id', $request->student_id);
            }
        }

        if ($request->has('extracurricular_id')) {
            $query->where('extracurricular_id', $request->extracurricular_id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'extracurricular_id' => 'required|string|exists:ekskuls,id',
            'student_id' => 'required|string',
            'student_name' => 'required|string|max:120',
            'student_class' => 'required|string|max:50',
            'student_nisn' => 'required|string|max:20',
            'reason' => 'required|string|max:500',
        ]);

        $studentId = $validated['student_id'];
        $ekskulId = $validated['extracurricular_id'];

        // Enforce that caller must be a student and can ONLY register themselves (Anti-IDOR)
        $caller = $request->user();
        if (!$caller) {
            return response()->json([
                'success' => false,
                'message' => 'Autentikasi diperlukan. Silakan login terlebih dahulu.'
            ], 401);
        }

        if (strtolower($caller->role) !== 'student') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya akun siswa yang dapat mendaftar kegiatan ekstrakurikuler.'
            ], 403);
        }

        if ($caller->id !== $studentId) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak: Anda hanya dapat mendaftarkan akun Anda sendiri.'
            ], 403);
        }

        $studentUser = \App\Models\User::find($studentId);
        if ($studentUser && strtolower($studentUser->role) !== 'student') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya akun siswa yang dapat mendaftar kegiatan ekstrakurikuler.'
            ], 403);
        }

        $ekskul = Ekskul::findOrFail($ekskulId);

        // Check if registration is open
        if ($ekskul->registration_status === 'closed') {
            return response()->json([
                'success' => false,
                'message' => 'Pendaftaran untuk ekstrakurikuler ini telah ditutup.'
            ], 422);
        }

        // Check capacity
        if ($ekskul->current_member_count >= $ekskul->member_capacity) {
            return response()->json([
                'success' => false,
                'message' => 'Kuota anggota untuk ekstrakurikuler ini sudah penuh.'
            ], 422);
        }

        // Check if already registered
        $existing = Registration::where('student_id', $studentId)
            ->where('extracurricular_id', $ekskulId)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah terdaftar atau memiliki pendaftaran aktif di ekstrakurikuler ini.'
            ], 422);
        }

        $validated['id'] = 'reg-' . time() . '-' . Str::random(4);
        $validated['extracurricular_name'] = $ekskul->name;
        $validated['registration_date'] = now()->toIso8601String();
        $validated['status'] = 'pending'; // Always pending on submission

        $reg = Registration::create($validated);
        return response()->json(['success' => true, 'registration' => $reg], 201);
    }

    public function updateStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'reviewer_name' => 'nullable|string|max:120',
            'notes' => 'nullable|string|max:500',
        ]);

        $reg = Registration::findOrFail($id);
        $status = $validated['status'];
        $reviewer = $validated['reviewer_name'] ?? ($request->user()?->name ?? 'Pembina Ekskul');
        $notes = $validated['notes'] ?? $reg->notes;

        $reg->update([
            'status' => $status,
            'reviewer_name' => $reviewer,
            'reviewed_at' => now()->toIso8601String(),
            'notes' => $notes,
        ]);

        // If approved, create member record if not already exists
        if ($status === 'approved') {
            $alreadyMember = EkskulMember::where('extracurricular_id', $reg->extracurricular_id)
                ->where('student_id', $reg->student_id)
                ->exists();

            if (!$alreadyMember) {
                EkskulMember::create([
                    'id' => 'mem-' . time() . '-' . Str::random(4),
                    'extracurricular_id' => $reg->extracurricular_id,
                    'student_id' => $reg->student_id,
                    'student_name' => $reg->student_name,
                    'student_nisn' => $reg->student_nisn,
                    'student_class' => $reg->student_class,
                    'role' => 'Anggota',
                    'joined_at' => now()->toDateString(),
                    'status' => 'active',
                ]);

                $ekskul = Ekskul::find($reg->extracurricular_id);
                if ($ekskul) {
                    $ekskul->increment('current_member_count');
                }
            }
        }

        return response()->json(['success' => true, 'registration' => $reg->fresh()]);
    }
}
