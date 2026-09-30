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
        $data = $request->all();
        if (empty($data['id'])) {
            $data['id'] = 'ev-' . time() . '-' . Str::random(4);
        }
        $event = SchoolEvent::create($data);
        return response()->json(['success' => true, 'event' => $event], 201);
    }

    public function update(Request $request, string $id)
    {
        $event = SchoolEvent::findOrFail($id);
        $event->update($request->all());
        return response()->json(['success' => true, 'event' => $event->fresh()]);
    }

    public function destroy(string $id)
    {
        SchoolEvent::destroy($id);
        return response()->json(['success' => true]);
    }
}
