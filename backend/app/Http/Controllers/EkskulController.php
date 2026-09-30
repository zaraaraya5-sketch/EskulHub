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
        $data = $request->all();
        if (empty($data['id'])) {
            $data['id'] = 'eks-' . time() . '-' . Str::random(4);
        }
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        $ekskul = Ekskul::create($data);
        return response()->json(['success' => true, 'ekskul' => $ekskul], 201);
    }

    public function update(Request $request, string $id)
    {
        $ekskul = Ekskul::findOrFail($id);
        $ekskul->update($request->all());
        return response()->json(['success' => true, 'ekskul' => $ekskul->fresh()]);
    }

    public function destroy(string $id)
    {
        Ekskul::destroy($id);
        return response()->json(['success' => true]);
    }

    // Members
    public function getMembers(string $id)
    {
        $members = EkskulMember::where('extracurricular_id', $id)->get();
        return response()->json($members);
    }

    public function allMembers()
    {
        return response()->json(EkskulMember::all());
    }

    public function addMember(Request $request, string $id)
    {
        $data = $request->all();
        $data['id'] = 'mem-' . time() . '-' . Str::random(4);
        $data['extracurricular_id'] = $id;
        $member = EkskulMember::create($data);

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
        return response()->json(['success' => true]);
    }
}
