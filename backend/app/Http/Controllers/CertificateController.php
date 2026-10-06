<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    public function index(Request $request)
    {
        $query = Certificate::query();
        $currentUser = $request->user();

        // Enforce student data isolation: students can only view their own certificates
        if ($currentUser && $currentUser->role === 'student') {
            $query->where('student_id', $currentUser->id);
        } elseif ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        return response()->json($query->orderBy('issue_date', 'desc')->get());
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|string',
            'title' => 'required|string|max:200',
            'issuer' => 'required|string|max:200',
            'issue_date' => 'required|date',
            'file_url' => 'nullable|string|max:500',
            'certificate_number' => 'nullable|string|max:100',
        ]);

        $validated['id'] = 'cert-' . time() . '-' . Str::random(4);
        $validated['is_verified'] = $request->boolean('is_verified', true);

        $cert = Certificate::create($validated);
        return response()->json(['success' => true, 'certificate' => $cert], 201);
    }

    public function destroy(string $id)
    {
        Certificate::destroy($id);
        return response()->json(['success' => true, 'message' => 'Sertifikat berhasil dihapus.']);
    }
}
