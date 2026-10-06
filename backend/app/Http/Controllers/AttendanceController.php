<?php

namespace App\Http\Controllers;

use App\Models\AttendanceSession;
use App\Models\AttendanceRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AttendanceController extends Controller
{
    /**
     * Retrieve attendance sessions (Optionally filtered by extracurricular)
     */
    public function getSessions(Request $request)
    {
        $query = AttendanceSession::query();
        if ($request->has('extracurricular_id')) {
            $query->where('extracurricular_id', $request->extracurricular_id);
        }
        return response()->json($query->orderBy('session_date', 'desc')->get());
    }

    /**
     * Create attendance session with strict input validation
     */
    public function createSession(Request $request)
    {
        $validated = $request->validate([
            'extracurricular_id' => 'required|string|exists:ekskuls,id',
            'extracurricular_name' => 'required|string|max:120',
            'title' => 'required|string|max:150',
            'session_date' => 'required|date',
            'start_time' => 'required|string|max:10',
            'end_time' => 'required|string|max:10',
            'location' => 'required|string|max:150',
            'notes' => 'nullable|string|max:500',
            'created_by_name' => 'nullable|string|max:120',
            'total_members' => 'nullable|integer|min:0',
        ]);

        $validated['id'] = 'att-sess-' . time() . '-' . Str::random(4);
        $validated['created_by_name'] = $validated['created_by_name'] ?? ($request->user()?->name ?? 'Pengurus Ekskul');
        $validated['total_members'] = $validated['total_members'] ?? 0;
        $validated['present_count'] = 0;
        $validated['late_count'] = 0;
        $validated['excused_count'] = 0;
        $validated['absent_count'] = 0;

        $session = AttendanceSession::create($validated);
        return response()->json(['success' => true, 'session' => $session], 201);
    }

    /**
     * Retrieve attendance records with Broken Object Level Authorization (BOLA) protection
     */
    public function getRecords(Request $request)
    {
        $query = AttendanceRecord::query();
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Autentikasi diperlukan. Silakan login terlebih dahulu.',
            ], 401);
        }

        // If authenticated user is a student, enforce viewing ONLY their own records
        if ($user->role === 'student') {
            $query->where('student_id', $user->id);
        } else {
            if ($request->has('student_id')) {
                $query->where('student_id', $request->student_id);
            }
        }

        if ($request->has('attendance_session_id')) {
            $query->where('attendance_session_id', $request->attendance_session_id);
        }

        return response()->json($query->orderBy('session_date', 'desc')->get());
    }


    /**
     * Save/update attendance record with strict status validation
     */
    public function saveRecord(Request $request)
    {
        $validated = $request->validate([
            'attendance_session_id' => 'required|string',
            'session_title' => 'required|string|max:150',
            'session_date' => 'required|date',
            'extracurricular_name' => 'required|string|max:120',
            'student_id' => 'required|string',
            'student_name' => 'required|string|max:120',
            'status' => 'required|in:present,late,excused,absent',
            'notes' => 'nullable|string|max:300',
            'verified_by_name' => 'nullable|string|max:120',
        ]);

        $validated['verified_by_name'] = $validated['verified_by_name'] ?? ($request->user()?->name ?? 'Pengurus Ekskul');

        // Upsert record
        $record = AttendanceRecord::updateOrCreate(
            [
                'attendance_session_id' => $validated['attendance_session_id'],
                'student_id' => $validated['student_id']
            ],
            $validated
        );

        // Update statistical counts in session
        $sessionId = $validated['attendance_session_id'];
        $session = AttendanceSession::find($sessionId);
        if ($session) {
            $records = AttendanceRecord::where('attendance_session_id', $sessionId)->get();
            $session->update([
                'present_count' => $records->where('status', 'present')->count(),
                'late_count' => $records->where('status', 'late')->count(),
                'excused_count' => $records->where('status', 'excused')->count(),
                'absent_count' => $records->where('status', 'absent')->count(),
            ]);
        }

        return response()->json(['success' => true, 'record' => $record]);
    }
}
