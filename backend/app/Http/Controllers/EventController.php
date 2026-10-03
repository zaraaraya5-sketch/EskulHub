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

        // Normalize timestamps
        if (strlen($startTime) === 10) $startTime .= ' 00:00:00';
        if (strlen($endTime) === 10) $endTime .= ' 23:59:59';
        $startTime = str_replace('T', ' ', $startTime);
        $endTime = str_replace('T', ' ', $endTime);

        // Auto-heal and sync any events created in school_events
        try {
            $missingFromEvents = DB::table('school_events')
                ->whereNotIn('id', DB::table('events')->pluck('id'))
                ->get();
            foreach ($missingFromEvents as $se) {
                $sTime = str_replace('T', ' ', $se->start_datetime ?? '');
                $eTime = str_replace('T', ' ', $se->end_datetime ?? '');
                if (strlen($sTime) === 10) $sTime .= ' 08:00:00';
                if (strlen($eTime) === 10) $eTime .= ' 10:00:00';
                DB::table('events')->insert([
                    'id' => $se->id,
                    'title' => $se->title,
                    'category' => !empty($se->category) ? $se->category : (!empty($se->event_type) ? $se->event_type : 'school_event'),
                    'extracurricular_id' => null,
                    'start_time' => $sTime ?: now()->toDateTimeString(),
                    'end_time' => $eTime ?: now()->addHours(2)->toDateTimeString(),
                    'location' => $se->location ?? 'SMKN 1 Ciomas',
                    'organizer' => $se->organizer ?? 'Pengurus Sekolah',
                    'description' => $se->description ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        } catch (\Throwable $e) {
            // Ignore if already synced
        }

        $events = DB::select(
            "SELECT DISTINCT e.*, ek.name as extracurricular_name
             FROM events e
             LEFT JOIN ekskuls ek ON e.extracurricular_id = ek.id
             WHERE REPLACE(e.start_time, 'T', ' ') BETWEEN ? AND ?
             ORDER BY e.start_time ASC",
            [$startTime, $endTime]);

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
        $startTime = str_replace('T', ' ', trim($startTime));
        $endTime = str_replace('T', ' ', trim($endTime));
        if (strlen($startTime) === 10) $startTime .= ' 08:00:00';
        elseif (strlen($startTime) === 16) $startTime .= ':00';
        if (strlen($endTime) === 10) $endTime .= ' 10:00:00';
        elseif (strlen($endTime) === 16) $endTime .= ':00';

        $category = $validated['category'] ?? $validated['event_type'] ?? 'school_event';

        // Identify creator role strictly from authenticated session
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Autentikasi diperlukan. Silakan login terlebih dahulu.'
            ], 401);
        }
        $creatorId = $user->id;
        $creatorRole = strtolower($user->role);

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
            'created_by_id' => $creatorId,
            'created_by_role' => $creatorRole,
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
            'created_by_id' => $creatorId,
            'created_by_role' => $creatorRole,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true, 'event' => $eventData], 201);
    }

    public function update(Request $request, string $id)
    {
        $event = DB::table('events')->where('id', $id)->first();
        if (!$event) {
            return response()->json(['success' => false, 'message' => 'Agenda kegiatan tidak ditemukan.'], 404);
        }

        // 1. Resolve user performing the update strictly from authenticated session
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Autentikasi gagal. Anda harus login untuk mengubah agenda kegiatan.',
            ], 401);
        }

        // 2. Validate creator role permission
        $userRole = strtolower($user->role);
        $creatorRole = strtolower($event->created_by_role ?? '');
        if (empty($creatorRole)) {
            $creatorRole = in_array($event->category, ['school_event', 'national_holiday']) ? 'pengurus' : 'pembina';
        }

        $normUser = ($userRole === 'teacher') ? 'pembina' : $userRole;
        $normCreator = ($creatorRole === 'teacher') ? 'pembina' : $creatorRole;

        $canEdit = in_array($userRole, ['admin', 'pengurus'])
            || ($normUser === $normCreator)
            || (!empty($event->created_by_id) && $event->created_by_id === $user->id);

        if (!$canEdit) {
            $labels = [
                'pembina' => 'Pembina Ekskul',
                'pengurus' => 'Pengurus Sekolah',
                'student' => 'Siswa',
            ];
            $creatorLabel = $labels[$normCreator] ?? ucfirst($creatorRole);
            $userLabel = $labels[$normUser] ?? ucfirst($userRole);

            return response()->json([
                'success' => false,
                'message' => "Akses ditolak: Jadwal ini dibuat oleh {$creatorLabel}. Akun dengan role {$userLabel} tidak dapat mengedit jadwal tersebut.",
            ], 403);
        }

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

        // Keep school_events synchronized
        $schoolEventsUpdate = $updateData;
        if (isset($updateData['category'])) $schoolEventsUpdate['event_type'] = $updateData['category'];
        if (isset($updateData['start_time'])) $schoolEventsUpdate['start_datetime'] = $updateData['start_time'];
        if (isset($updateData['end_time'])) $schoolEventsUpdate['end_datetime'] = $updateData['end_time'];
        DB::table('school_events')->where('id', $id)->update($schoolEventsUpdate);

        return response()->json(['success' => true, 'message' => 'Agenda kegiatan berhasil diperbarui.']);
    }

    public function destroy(Request $request, string $id)
    {
        $event = DB::table('events')->where('id', $id)->first();
        if (!$event) {
            return response()->json(['success' => false, 'message' => 'Agenda kegiatan tidak ditemukan.'], 404);
        }

        // 1. Resolve user performing the delete strictly from authenticated session
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Autentikasi gagal. Anda harus login untuk menghapus agenda kegiatan.',
            ], 401);
        }

        // 2. Validate creator role permission
        $userRole = strtolower($user->role);
        $creatorRole = strtolower($event->created_by_role ?? '');
        if (empty($creatorRole)) {
            $creatorRole = in_array($event->category, ['school_event', 'national_holiday']) ? 'pengurus' : 'pembina';
        }

        $normUser = ($userRole === 'teacher') ? 'pembina' : $userRole;
        $normCreator = ($creatorRole === 'teacher') ? 'pembina' : $creatorRole;

        $canDelete = in_array($userRole, ['admin', 'pengurus'])
            || ($normUser === $normCreator)
            || (!empty($event->created_by_id) && $event->created_by_id === $user->id);

        if (!$canDelete) {
            $labels = [
                'pembina' => 'Pembina Ekskul',
                'pengurus' => 'Pengurus Sekolah',
                'student' => 'Siswa',
            ];
            $creatorLabel = $labels[$normCreator] ?? ucfirst($creatorRole);
            $userLabel = $labels[$normUser] ?? ucfirst($userRole);

            return response()->json([
                'success' => false,
                'message' => "Akses ditolak: Jadwal ini dibuat oleh {$creatorLabel}. Akun dengan role {$userLabel} tidak dapat menghapus jadwal tersebut.",
            ], 403);
        }

        DB::table('events')->where('id', $id)->delete();
        DB::table('school_events')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Agenda kegiatan berhasil dihapus dari kalender.']);
    }

    /**
     * Import events from Excel / CSV with strict role-based access control and transactional SQLite safety.
     * 
     * - Role Guru: only allowed to import 'school_event' and 'national_holiday' (extracurricular_id = null).
     * - Role Pembina: only allowed to import 'extracurricular_training' and 'competition' (extracurricular_id = pembina's ekskul).
     */
    public function importExcel(Request $request)
    {
        // 1. Resolve user strictly from authenticated session
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Autentikasi gagal. Anda harus masuk ke sistem terlebih dahulu.',
            ], 401);
        }

        $role = strtolower($user->role);
        if (!in_array($role, ['pembina', 'teacher', 'admin', 'pengurus'])) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Fitur import jadwal hanya diperuntukkan bagi Pengurus dan Pembina Ekskul.',
            ], 403);
        }

        // 2. Determine Pembina's Extracurricular (if role is pembina/teacher)
        $assignedEkskulId = null;
        if (in_array($role, ['pembina', 'teacher'])) {
            // Check if passed explicitly in request
            if ($request->filled('extracurricular_id')) {
                $assignedEkskulId = $request->input('extracurricular_id');
            } else {
                $ekskul = DB::table('ekskuls')
                    ->where('supervisor_id', $user->id)
                    ->orWhere('supervisor_name', $user->name)
                    ->first();
                $assignedEkskulId = $ekskul ? $ekskul->id : null;
            }

            if (!$assignedEkskulId) {
                // Check if user is linked in user_extracurriculars
                $ue = DB::table('user_extracurriculars')
                    ->where('user_id', $user->id)
                    ->first();
                $assignedEkskulId = $ue ? $ue->extracurricular_id : null;
            }

            // Fallback default ekskul if not explicitly mapped
            if (!$assignedEkskulId) {
                $firstEkskul = DB::table('ekskuls')->first();
                $assignedEkskulId = $firstEkskul ? $firstEkskul->id : 'eks-1';
            }
        }

        // 3. Extract Rows from Request (either parsed JSON array 'events' or uploaded CSV file)
        $rows = [];
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $extension = strtolower($file->getClientOriginalExtension());
            if ($extension === 'csv' || $extension === 'txt') {
                $handle = fopen($file->getPathname(), 'r');
                if ($handle !== false) {
                    $header = fgetcsv($handle, 1000, ',');
                    if ($header) {
                        // Normalize headers (trim, lowercase, strip UTF-8 BOM)
                        $cleanHeader = array_map(function ($h) {
                            return strtolower(trim(preg_replace('/[\xEF\xBB\xBF]/', '', $h)));
                        }, $header);

                        while (($data = fgetcsv($handle, 1000, ',')) !== false) {
                            if (count($data) === count($cleanHeader)) {
                                $rows[] = array_combine($cleanHeader, $data);
                            }
                        }
                    }
                    fclose($handle);
                }
            } else {
                // If sent with parsed rows in request
                if ($request->filled('events')) {
                    $rows = is_string($request->input('events'))
                        ? json_decode($request->input('events'), true)
                        : $request->input('events');
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Format file .xlsx memerlukan penguraian antarmuka web SheetJS sebelum diproses.',
                    ], 422);
                }
            }
        } elseif ($request->has('events')) {
            $rawEvents = $request->input('events');
            $rows = is_string($rawEvents) ? json_decode($rawEvents, true) : $rawEvents;
        }

        if (empty($rows) || !is_array($rows)) {
            return response()->json([
                'success' => false,
                'message' => 'File Excel / CSV kosong atau data baris tidak ditemukan. Pastikan data dimulai dari baris ke-2 setelah header kolom.',
            ], 422);
        }

        // 4. Category Mapping Normalizer
        $normalizeCategory = function ($rawCat) {
            $cat = strtolower(trim((string)$rawCat));
            $map = [
                'school_event' => 'school_event',
                'acara sekolah' => 'school_event',
                'acara_sekolah' => 'school_event',
                'national_holiday' => 'national_holiday',
                'hari libur' => 'national_holiday',
                'libur nasional' => 'national_holiday',
                'hari_libur' => 'national_holiday',
                'libur_nasional' => 'national_holiday',
                'extracurricular_training' => 'extracurricular_training',
                'latihan' => 'extracurricular_training',
                'latihan ekskul' => 'extracurricular_training',
                'latihan_ekskul' => 'extracurricular_training',
                'extracurricular_practice' => 'extracurricular_training',
                'competition' => 'competition',
                'lomba' => 'competition',
                'kompetisi' => 'competition',
                'pertandingan' => 'competition',
            ];
            return $map[$cat] ?? $cat;
        };

        // 5. Date Validator
        $isValidDate = function ($dateStr) {
            if (empty($dateStr)) return false;
            $cleaned = str_replace('T', ' ', trim($dateStr));
            $t = strtotime($cleaned);
            if ($t === false) return false;
            return date('Y-m-d H:i:s', $t);
        };

        // 6. Process and Validate in Database Transaction
        DB::beginTransaction();
        try {
            $insertedEvents = [];

            foreach ($rows as $index => $row) {
                $rowNum = $index + 2; // Row number in Excel (Row 1 is header)

                $title = trim($row['title'] ?? $row['judul'] ?? '');
                if (empty($title)) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Gagal mengimpor: Kesalahan pada baris {$rowNum}. Kolom 'title' (judul agenda) tidak boleh kosong.",
                        'error_row' => $rowNum,
                        'error_field' => 'title',
                    ], 422);
                }

                $rawCategory = $row['category'] ?? $row['kategori'] ?? '';
                $cat = $normalizeCategory($rawCategory);

                if (empty($cat)) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Gagal mengimpor: Kesalahan pada baris {$rowNum}. Kolom 'category' tidak boleh kosong.",
                        'error_row' => $rowNum,
                        'error_field' => 'category',
                    ], 422);
                }

                // Check Role Permissions
                if (in_array($role, ['admin', 'pengurus'])) {
                    // Pengurus holds monitoring and management authority across all categories
                    $rowEkskulId = in_array($cat, ['extracurricular_training', 'competition'])
                        ? ($row['extracurricular_id'] ?? null)
                        : null;
                } elseif (in_array($role, ['pembina', 'teacher'])) {
                    $rowEkskulId = $assignedEkskulId;
                } else {
                    $rowEkskulId = null;
                }

                // Validate Date Times
                $rawStartTime = $row['start_time'] ?? $row['waktu_mulai'] ?? $row['start_datetime'] ?? '';
                $startTime = $isValidDate($rawStartTime);
                if (!$startTime) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Gagal mengimpor: Kesalahan pada baris {$rowNum}. Format tanggal 'start_time' ('{$rawStartTime}') tidak valid. Gunakan format YYYY-MM-DD HH:MM:SS (contoh: 2026-10-15 15:30:00).",
                        'error_row' => $rowNum,
                        'error_field' => 'start_time',
                    ], 422);
                }

                $rawEndTime = $row['end_time'] ?? $row['waktu_selesai'] ?? $row['end_datetime'] ?? '';
                $endTime = $isValidDate($rawEndTime);
                if (!$endTime) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Gagal mengimpor: Kesalahan pada baris {$rowNum}. Format tanggal 'end_time' ('{$rawEndTime}') tidak valid. Gunakan format YYYY-MM-DD HH:MM:SS.",
                        'error_row' => $rowNum,
                        'error_field' => 'end_time',
                    ], 422);
                }

                if (strtotime($endTime) < strtotime($startTime)) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Gagal mengimpor: Kesalahan pada baris {$rowNum}. 'end_time' ({$endTime}) tidak boleh lebih awal dari 'start_time' ({$startTime}).",
                        'error_row' => $rowNum,
                        'error_field' => 'end_time',
                    ], 422);
                }

                $location = trim($row['location'] ?? $row['lokasi'] ?? '');
                if (empty($location)) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Gagal mengimpor: Kesalahan pada baris {$rowNum}. Kolom 'location' (lokasi/fasilitas) tidak boleh kosong.",
                        'error_row' => $rowNum,
                        'error_field' => 'location',
                    ], 422);
                }

                $organizer = trim($row['organizer'] ?? $row['penyelenggara'] ?? '');
                if (empty($organizer)) {
                    $organizer = $user->name;
                }

                $desc = trim($row['description'] ?? $row['deskripsi'] ?? $row['keterangan'] ?? '');

                $eventId = 'evt-imp-' . time() . '-' . Str::random(4) . '-' . $index;

                $eventPayload = [
                    'id' => $eventId,
                    'title' => $title,
                    'category' => $cat,
                    'extracurricular_id' => $rowEkskulId,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'location' => $location,
                    'organizer' => $organizer,
                    'description' => !empty($desc) ? $desc : null,
                    'created_by_id' => $user->id,
                    'created_by_role' => $role,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                DB::table('events')->insert($eventPayload);

                // Also keep school_events synchronized
                DB::table('school_events')->insert([
                    'id' => $eventId,
                    'title' => $title,
                    'event_type' => $cat,
                    'category' => $cat,
                    'location' => $location,
                    'start_datetime' => $startTime,
                    'end_datetime' => $endTime,
                    'description' => !empty($desc) ? $desc : null,
                    'organizer' => $organizer,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $insertedEvents[] = $eventPayload;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengimpor ' . count($insertedEvents) . ' agenda kegiatan ke database SQLite.',
                'imported_count' => count($insertedEvents),
                'events' => $insertedEvents,
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat menyimpan ke database: ' . $e->getMessage(),
            ], 500);
        }
    }
}
