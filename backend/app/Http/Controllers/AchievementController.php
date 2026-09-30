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
        $data = $request->all();
        if (empty($data['id'])) {
            $data['id'] = 'ach-' . time() . '-' . Str::random(4);
        }
        $data['is_verified'] = $request->boolean('is_verified', false);
        $achievement = Achievement::create($data);
        return response()->json(['success' => true, 'achievement' => $achievement], 201);
    }

    public function verify(Request $request, string $id)
    {
        $ach = Achievement::findOrFail($id);
        $ach->update([
            'is_verified' => true,
            'verified_by_name' => $request->input('verified_by_name', 'Admin Kesiswaan'),
            'verified_at' => now()->toIso8601String(),
        ]);
        return response()->json(['success' => true, 'achievement' => $ach->fresh()]);
    }

    public function destroy(string $id)
    {
        Achievement::destroy($id);
        return response()->json(['success' => true]);
    }
}
