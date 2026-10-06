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
            'name' => 'required|string|max:120',
            'category' => 'required|in:Olahraga,Seni & Budaya,Sains & Teknologi,Kepemimpinan,Bahasa & Literasi',
            'short_description' => 'required|string|max:300',
            'full_description' => 'required|string|max:3000',
            'profile_image' => 'nullable|string|max:500',
            'supervisor_name' => 'required|string|max:120',
            'supervisor_id' => 'nullable|string|max:100',
            'chairperson_name' => 'required|string|max:120',
            'practice_schedule' => 'required|string|max:150',
            'location' => 'required|string|max:150',
            'member_capacity' => 'required|integer|min:5|max:500',
            'registration_status' => 'required|in:open,closed',
        ]);

        $validated['id'] = 'eks-' . time() . '-' . Str::random(4);
        $validated['slug'] = Str::slug($validated['name']);
        $validated['current_member_count'] = 0;

        $ekskul = Ekskul::create($validated);
        return response()->json(['success' => true, 'ekskul' => $ekskul], 201);
    }

    public function update(Request $request, string $id)
    {
        $ekskul = Ekskul::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:120',
            'category' => 'sometimes|required|in:Olahraga,Seni & Budaya,Sains & Teknologi,Kepemimpinan,Bahasa & Literasi',
            'short_description' => 'sometimes|required|string|max:300',
            'full_description' => 'sometimes|required|string|max:3000',
            'profile_image' => 'nullable|string|max:500',
            'supervisor_name' => 'sometimes|required|string|max:120',
            'supervisor_id' => 'nullable|string|max:100',
            'chairperson_name' => 'sometimes|required|string|max:120',
            'practice_schedule' => 'sometimes|required|string|max:150',
            'location' => 'sometimes|required|string|max:150',
            'member_capacity' => 'sometimes|required|integer|min:5|max:500',
            'registration_status' => 'sometimes|required|in:open,closed',
        ]);

        if (isset($validated['name']) && $validated['name'] !== $ekskul->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

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
