<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\SchoolEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * Display a listing of calendar events based on authentication status (Guest vs Authenticated User).
     * 
     * Kondisi A (Belum Login / Tamu):
     * Query SQLite hanya mengambil event yang bersifat publik atau nasional:
     * SELECT * FROM events WHERE category IN ('school_event', 'national_holiday') AND start_time BETWEEN ? AND ?
     * 
     * Kondisi B (Sudah Login):
     * Query SQLite mengambil event sekolah, hari besar, PLUS event latihan/kompetisi dari ekskul yang diikuti user:
     * SELECT DISTINCT e.* FROM events e
     * LEFT JOIN user_extracurriculars ue ON e.extracurricular_id = ue.extracurricular_id
     * WHERE ((e.category IN ('school_event', 'national_holiday')) 
     *    OR (ue.user_id = ? AND e.category IN ('extracurricular_training', 'competition')))
     *   AND e.start_time BETWEEN ? AND ?
     */
    public function index(Request $request)
    {
        // 1. Determine Date Range
        $startTime = $request->query('start_time', $request->query('start_date', '2026-01-01 00:00:00'));
        $endTime = $request->query('end_time', $request->query('end_date', '2026-12-31 23:59:59'));

        // Normalize simple YYYY-MM-DD to full timestamp
        if (strlen($startTime) === 10) $startTime .= ' 00:00:00';
        if (strlen($endTime) === 10) $endTime .= ' 23:59:59';

        // 2. Identify authenticated user via Sanctum or Token
        $user = $request->user('sanctum') ?? auth('sanctum')->user();
        $userId = $user ? $user->id : null;

        // Fallback: check query parameter or header for user_id (if passed directly)
        if (!$userId && $request->has('user_id')) {
            $userId = $request->query('user_id');
        }

        // 3. Execute appropriate query based on authentication status
        if (empty($userId)) {
            // Kondisi A: Belum Login / Tamu
            $events = DB::select(
                "SELECT e.*, ek.name as extracurricular_name
                 FROM events e
                 LEFT JOIN ekskuls ek ON e.extracurricular_id = ek.id
                 WHERE e.category IN ('school_event', 'national_holiday')
                   AND e.start_time BETWEEN ? AND ?
                 ORDER BY e.start_time ASC",
                [$startTime, $endTime]
            );
        } else {
            // Kondisi B: Sudah Login
            $events = DB::select(
                "SELECT DISTINCT e.*, ek.name as extracurricular_name
                 FROM events e
                 LEFT JOIN user_extracurriculars ue ON e.extracurricular_id = ue.extracurricular_id
                 LEFT JOIN ekskuls ek ON e.extracurricular_id = ek.id
                 WHERE (
                     (e.category IN ('school_event', 'national_holiday'))
                     OR (ue.user_id = ? AND e.category IN ('extracurricular_training', 'competition'))
                 )
                 AND e.start_time BETWEEN ? AND ?
                 ORDER BY e.start_time ASC",
                [$userId, $startTime, $endTime]
            );
        }

        // Also normalize keys for frontend consistency (support both start_time & start_datetime)
        $formatted = array_map(function ($ev) {
            $evArray = (array) $ev;
            $evArray['start_datetime'] = $evArray['start_time'];
            $evArray['end_datetime'] = $evArray['end_time'];
            $evArray['event_type'] = $evArray['category'];
            return $evArray;
        }, $events);

        return response()->json($formatted);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'category' => 'nullable|string|max:50',
            'event_type' => 'nullable|string|max:50',
            'extracurricular_id' => 'nullable|string|max:50',
            'location' => 'required|string|max:150',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'start_datetime' => 'nullable|string',
            'end_datetime' => 'nullable|string',
            'description' => 'nullable|string|max:1000',
            'organizer' => 'required|string|max:150',
        ]);

        $id = 'evt-' . time() . '-' . Str::random(4);
        $startTime = $validated['start_time'] ?? $validated['start_datetime'] ?? now()->toDateTimeString();
        $endTime = $validated['end_time'] ?? $validated['end_datetime'] ?? now()->addHours(2)->toDateTimeString();
        $category = $validated['category'] ?? $validated['event_type'] ?? 'school_event';

        $eventData = [
            'id' => $id,
            'title' => $validated['title'],
            'category' => $category,
            'extracurricular_id' => $validated['extracurricular_id'] ?? null,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'location' => $validated['location'],
            'organizer' => $validated['organizer'],
            'description' => $validated['description'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('events')->insert($eventData);

        // Keep school_events table synchronized
        DB::table('school_events')->insert([
            'id' => $id,
            'title' => $validated['title'],
            'event_type' => $category,
            'category' => $category,
            'location' => $validated['location'],
            'start_datetime' => $startTime,
            'end_datetime' => $endTime,
            'description' => $validated['description'] ?? null,
            'organizer' => $validated['organizer'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true, 'event' => $eventData], 201);
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:200',
            'category' => 'nullable|string|max:50',
            'event_type' => 'nullable|string|max:50',
            'extracurricular_id' => 'nullable|string|max:50',
            'location' => 'sometimes|required|string|max:150',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'start_datetime' => 'nullable|string',
            'end_datetime' => 'nullable|string',
            'description' => 'nullable|string|max:1000',
            'organizer' => 'sometimes|required|string|max:150',
        ]);

        $updateData = [];
        if (isset($validated['title'])) $updateData['title'] = $validated['title'];
        if (isset($validated['category']) || isset($validated['event_type'])) {
            $updateData['category'] = $validated['category'] ?? $validated['event_type'];
        }
        if (isset($validated['extracurricular_id'])) $updateData['extracurricular_id'] = $validated['extracurricular_id'];
        if (isset($validated['location'])) $updateData['location'] = $validated['location'];
        if (isset($validated['start_time']) || isset($validated['start_datetime'])) {
            $updateData['start_time'] = $validated['start_time'] ?? $validated['start_datetime'];
        }
        if (isset($validated['end_time']) || isset($validated['end_datetime'])) {
            $updateData['end_time'] = $validated['end_time'] ?? $validated['end_datetime'];
        }
        if (isset($validated['description'])) $updateData['description'] = $validated['description'];
        if (isset($validated['organizer'])) $updateData['organizer'] = $validated['organizer'];
        $updateData['updated_at'] = now();

        DB::table('events')->where('id', $id)->update($updateData);

        return response()->json(['success' => true, 'message' => 'Agenda berhasil diperbarui.']);
    }

    public function destroy(string $id)
    {
        DB::table('events')->where('id', $id)->delete();
        DB::table('school_events')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Agenda berhasil dihapus.']);
    }
}
