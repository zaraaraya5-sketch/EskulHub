<?php

namespace App\Http\Controllers;

use App\Models\SchoolEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function index()
    {
        return response()->json(SchoolEvent::orderBy('start_datetime', 'asc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'event_type' => 'nullable|string|max:50',
            'location' => 'required|string|max:150',
            'start_datetime' => 'required|date',
            'end_datetime' => 'required|date|after_or_equal:start_datetime',
            'description' => 'nullable|string|max:1000',
            'organizer' => 'required|string|max:150',
            'category' => 'nullable|string|max:50',
            'status' => 'nullable|string|max:50',
        ]);

        $validated['id'] = 'ev-' . time() . '-' . Str::random(4);
        $event = SchoolEvent::create($validated);

        return response()->json(['success' => true, 'event' => $event], 201);
    }

    public function update(Request $request, string $id)
    {
        $event = SchoolEvent::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:200',
            'event_type' => 'nullable|string|max:50',
            'location' => 'sometimes|required|string|max:150',
            'start_datetime' => 'sometimes|required|date',
            'end_datetime' => 'sometimes|required|date|after_or_equal:start_datetime',
            'description' => 'nullable|string|max:1000',
            'organizer' => 'sometimes|required|string|max:150',
            'category' => 'nullable|string|max:50',
            'status' => 'nullable|string|max:50',
        ]);

        $event->update($validated);
        return response()->json(['success' => true, 'event' => $event->fresh()]);
    }

    public function destroy(string $id)
    {
        SchoolEvent::destroy($id);
        return response()->json(['success' => true, 'message' => 'Agenda berhasil dihapus.']);
    }
}
