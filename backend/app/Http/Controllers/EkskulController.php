<?php

namespace App\Http\Controllers;

use App\Models\Ekskul;
use App\Models\EkskulMember;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EkskulController extends Controller
{
    public function index()
    {
        return response()->json(Ekskul::all());
    }

    public function show(string $slug)
    {
        $ekskul = Ekskul::where('slug', $slug)->orWhere('id', $slug)->firstOrFail();
        return response()->json($ekskul);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|string|max:100',
            'name' => 'required|string|max:120',
            'category' => 'required|in:Olahraga,Seni & Budaya,Sains & Teknologi,Kepemimpinan,Bahasa & Literasi,Keagamaan,Kemanusiaan',
            'short_description' => 'required|string|max:500',
            'full_description' => 'nullable|string|max:3000',
            'profile_image' => 'nullable|string|max:500',
            'image_url' => 'nullable|string|max:500',
            'supervisor_name' => 'required|string|max:120',
            'supervisor_id' => 'nullable|string|max:100',
            'chairperson_name' => 'nullable|string|max:120',
            'practice_schedule' => 'nullable|string|max:150',
            'location' => 'nullable|string|max:150',
            'member_capacity' => 'nullable|integer|min:1|max:1000',
            'registration_status' => 'nullable|in:open,closed',
        ]);

        $validated['id'] = $request->input('id') ?: ('eks-' . time() . '-' . Str::random(4));
        
        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug ?: ('ekskul-' . time());
        $counter = 1;
        while (Ekskul::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }
        $validated['slug'] = $slug;

        $validated['profile_image'] = !empty($validated['profile_image']) ? $validated['profile_image'] : (!empty($request->input('image_url')) ? $request->input('image_url') : 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800');
        $validated['chairperson_name'] = !empty($validated['chairperson_name']) ? $validated['chairperson_name'] : 'Siswa Terpilih';
        $validated['practice_schedule'] = !empty($validated['practice_schedule']) ? $validated['practice_schedule'] : 'Setiap Jumat (15:30 - 17:00 WIB)';
        $validated['location'] = !empty($validated['location']) ? $validated['location'] : 'Kampus SMKN 1 Ciomas';
        $validated['member_capacity'] = !empty($validated['member_capacity']) ? (int) $validated['member_capacity'] : 30;
        $validated['current_member_count'] = (int) $request->input('current_member_count', 0);
        $validated['registration_status'] = !empty($validated['registration_status']) ? $validated['registration_status'] : 'open';
        $validated['full_description'] = !empty($validated['full_description']) ? $validated['full_description'] : $validated['short_description'];

        unset($validated['image_url']);

        $ekskul = Ekskul::create($validated);
        return response()->json(['success' => true, 'ekskul' => $ekskul], 201);
    }

    public function update(Request $request, string $id)
    {
        $ekskul = Ekskul::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:120',
            'category' => 'sometimes|required|in:Olahraga,Seni & Budaya,Sains & Teknologi,Kepemimpinan,Bahasa & Literasi,Keagamaan,Kemanusiaan',
            'short_description' => 'sometimes|required|string|max:500',
            'full_description' => 'nullable|string|max:3000',
            'profile_image' => 'nullable|string|max:500',
            'image_url' => 'nullable|string|max:500',
            'supervisor_name' => 'sometimes|required|string|max:120',
            'supervisor_id' => 'nullable|string|max:100',
            'chairperson_name' => 'nullable|string|max:120',
            'practice_schedule' => 'nullable|string|max:150',
            'location' => 'nullable|string|max:150',
            'member_capacity' => 'sometimes|required|integer|min:1|max:1000',
            'registration_status' => 'sometimes|required|in:open,closed',
        ]);

        if (isset($validated['name']) && $validated['name'] !== $ekskul->name) {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug ?: ('ekskul-' . time());
            $counter = 1;
            while (Ekskul::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }
            $validated['slug'] = $slug;
        }

        if (isset($validated['image_url']) && empty($validated['profile_image'])) {
            $validated['profile_image'] = $validated['image_url'];
        }
        unset($validated['image_url']);

        $ekskul->update($validated);
        return response()->json(['success' => true, 'ekskul' => $ekskul->fresh()]);
    }

    public function destroy(string $id)
    {
        Ekskul::destroy($id);
        return response()->json(['success' => true, 'message' => 'Ekstrakurikuler berhasil dihapus.']);
    }

    // Members with PII protection (masked NISN for non-staff)
    public function getMembers(Request $request, string $id)
    {
        $members = EkskulMember::where('extracurricular_id', $id)->get();
        $user = $request->user();
        $isStaff = $user && in_array($user->role, ['admin', 'pengurus', 'pembina', 'teacher'], true);

        if (!$isStaff) {
            $members = $members->map(function ($m) use ($user) {
                if ($user && $user->id === $m->student_id) {
                    return $m;
                }
                if (!empty($m->student_nisn)) {
                    $m->student_nisn = substr($m->student_nisn, 0, 3) . '****' . substr($m->student_nisn, -2);
                }
                return $m;
            });
        }

        return response()->json($members);
    }

    public function allMembers(Request $request)
    {
        $members = EkskulMember::all();
        $user = $request->user();
        $isStaff = $user && in_array($user->role, ['admin', 'pengurus', 'pembina', 'teacher'], true);

        if (!$isStaff) {
            $members = $members->map(function ($m) use ($user) {
                if ($user && $user->id === $m->student_id) {
                    return $m;
                }
                if (!empty($m->student_nisn)) {
                    $m->student_nisn = substr($m->student_nisn, 0, 3) . '****' . substr($m->student_nisn, -2);
                }
                return $m;
            });
        }

        return response()->json($members);
    }


    public function addMember(Request $request, string $id)
    {
        $validated = $request->validate([
            'student_id' => 'required|string',
            'student_name' => 'required|string|max:120',
            'student_nisn' => 'required|string|max:20',
            'student_class' => 'required|string|max:50',
            'role' => 'required|in:Ketua,Wakil Ketua,Sekretaris,Bendahara,Anggota',
            'joined_at' => 'nullable|date',
            'status' => 'nullable|in:active,inactive',
        ]);

        $validated['id'] = 'mem-' . time() . '-' . Str::random(4);
        $validated['extracurricular_id'] = $id;
        $validated['joined_at'] = $validated['joined_at'] ?? now()->toDateString();
        $validated['status'] = $validated['status'] ?? 'active';

        $member = EkskulMember::create($validated);

        // Increment count
        $ekskul = Ekskul::find($id);
        if ($ekskul) {
            $ekskul->increment('current_member_count');
        }

        return response()->json(['success' => true, 'member' => $member], 201);
    }

    public function removeMember(string $memberId)
    {
        $member = EkskulMember::find($memberId);
        if ($member) {
            $ekskul = Ekskul::find($member->extracurricular_id);
            if ($ekskul && $ekskul->current_member_count > 0) {
                $ekskul->decrement('current_member_count');
            }
            $member->delete();
        }
        return response()->json(['success' => true, 'message' => 'Anggota berhasil dikeluarkan.']);
    }
}
