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
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
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

        $validated['id'] = 'ach-' . time() . '-' . Str::random(4);

        $currentUser = $request->user();
        $isStaff = $currentUser && in_array($currentUser->role, ['admin', 'pembina', 'guru', 'teacher'], true);

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
