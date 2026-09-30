<?php

namespace App\Http\Controllers;

use App\Models\AttendanceSession;
use App\Models\AttendanceRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AttendanceController extends Controller
{
    // Sessions
    public function getSessions(Request $request)
    {
        $query = AttendanceSession::query();
        if ($request->has('extracurricular_id')) {
            $query->where('extracurricular_id', $request->extracurricular_id);
        }
        return response()->json($query->orderBy('session_date', 'desc')->get());
    }

    public function createSession(Request $request)
    {
        $data = $request->all();
        $data['id'] = 'att-sess-' . time() . '-' . Str::random(4);
        $session = AttendanceSession::create($data);
        return response()->json(['success' => true, 'session' => $session], 201);
    }

    // Records
    public function getRecords(Request $request)
    {
        $query = AttendanceRecord::query();
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }
        if ($request->has('attendance_session_id')) {
            $query->where('attendance_session_id', $request->attendance_session_id);
        }
        return response()->json($query->orderBy('session_date', 'desc')->get());
    }

    public function saveRecord(Request $request)
    {
        $data = $request->all();
        if (empty($data['id'])) {
            $data['id'] = 'rec-' . time() . '-' . Str::random(4);
        }

        // Upsert record
        $record = AttendanceRecord::updateOrCreate(
            [
                'attendance_session_id' => $data['attendance_session_id'],
                'student_id' => $data['student_id']
            ],
            $data
        );

        // Update counts in session
        $sessionId = $data['attendance_session_id'];
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
