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
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }
        if ($request->has('extracurricular_id')) {
            $query->where('extracurricular_id', $request->extracurricular_id);
        }
        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $studentId = $request->input('student_id');
        $ekskulId = $request->input('extracurricular_id');

        // Check if already registered
        $existing = Registration::where('student_id', $studentId)
            ->where('extracurricular_id', $ekskulId)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah terdaftar atau memiliki pendaftaran aktif di ekskul ini.'
            ], 422);
        }

        $data = $request->all();
        $data['id'] = 'reg-' . time() . '-' . Str::random(4);
        $data['registration_date'] = $data['registration_date'] ?? now()->toIso8601String();
        $data['status'] = 'pending';

        $reg = Registration::create($data);
        return response()->json(['success' => true, 'registration' => $reg], 201);
    }

    public function updateStatus(Request $request, string $id)
    {
        $reg = Registration::findOrFail($id);
        $status = $request->input('status'); // 'approved', 'rejected'
        $reviewer = $request->input('reviewer_name', 'Pembina Ekskul');
        $notes = $request->input('notes');

        $reg->update([
            'status' => $status,
            'reviewer_name' => $reviewer,
            'reviewed_at' => now()->toIso8601String(),
            'notes' => $notes ?: $reg->notes,
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
