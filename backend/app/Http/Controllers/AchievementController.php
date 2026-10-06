<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AchievementController extends Controller
{
    public function index(Request $request)
    {
        $query = Achievement::query();
        $currentUser = $request->user();
        $isStaff = $currentUser && in_array($currentUser->role, ['admin', 'pengurus', 'pembina', 'teacher'], true);

        if ($request->has('student_id')) {
            $studentId = $request->input('student_id');
            // If caller is student checking their own, show all (including pending verification)
            if ($currentUser && $currentUser->id === $studentId) {
                $query->where('student_id', $studentId);
            } elseif ($isStaff) {
                $query->where('student_id', $studentId);
            } else {
                // Public or other students only see verified achievements
                $query->where('student_id', $studentId)->where('is_verified', true);
            }
        } else {
            // General listing: non-staff only see verified achievements
            if (!$isStaff) {
                $query->where('is_verified', true);
            }
        }

        return response()->json($query->orderBy('achievement_date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'extracurricular_id' => 'nullable|string',
            'extracurricular_name' => 'nullable|string|max:120',
            'student_id' => 'required|string',
            'student_name' => 'required|string|max:120',
            'title' => 'required|string|max:200',
            'competition_name' => 'required|string|max:200',
            'level' => 'required|in:Sekolah,Kota/Kabupaten,Provinsi,Nasional,Internasional',
            'rank' => 'required|string|max:50',
            'achievement_date' => 'required|date',
            'certificate_url' => 'nullable|string|max:500',
        ]);

        $currentUser = $request->user();
        if (!$currentUser) {
            return response()->json([
                'success' => false,
                'message' => 'Autentikasi diperlukan. Silakan login terlebih dahulu.',
            ], 401);
        }

        // Anti-IDOR: If the caller is a student, strictly lock student_id and student_name to caller's identity
        if ($currentUser->role === 'student') {
            $validated['student_id'] = $currentUser->id;
            $validated['student_name'] = $currentUser->name;
        }

        $validated['id'] = 'ach-' . time() . '-' . Str::random(4);

        $isStaff = in_array($currentUser->role, ['admin', 'pengurus', 'pembina', 'teacher'], true);

        // Only authorized staff can immediately verify on creation
        if ($isStaff && $request->boolean('is_verified', false)) {
            $validated['is_verified'] = true;
            $validated['verified_by_name'] = $currentUser->name;
            $validated['verified_at'] = now()->toIso8601String();
        } else {
            $validated['is_verified'] = false;
            $validated['verified_by_name'] = null;
            $validated['verified_at'] = null;
        }

        $achievement = Achievement::create($validated);
        return response()->json(['success' => true, 'achievement' => $achievement], 201);
    }


    public function verify(Request $request, string $id)
    {
        $ach = Achievement::findOrFail($id);
        $verifierName = $request->user()?->name ?? $request->input('verified_by_name', 'Admin Kesiswaan');

        $ach->update([
            'is_verified' => true,
            'verified_by_name' => $verifierName,
            'verified_at' => now()->toIso8601String(),
        ]);

        return response()->json(['success' => true, 'achievement' => $ach->fresh()]);
    }

    public function destroy(string $id)
    {
        Achievement::destroy($id);
        return response()->json(['success' => true, 'message' => 'Prestasi berhasil dihapus.']);
    }
}
