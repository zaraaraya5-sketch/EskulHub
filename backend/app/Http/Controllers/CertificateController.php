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
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }
        return response()->json($query->orderBy('issue_date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if (empty($data['id'])) {
            $data['id'] = 'cert-' . time() . '-' . Str::random(4);
        }
        $data['is_verified'] = $request->boolean('is_verified', true);
        $cert = Certificate::create($data);
        return response()->json(['success' => true, 'certificate' => $cert], 201);
    }

    public function destroy(string $id)
    {
        Certificate::destroy($id);
        return response()->json(['success' => true]);
    }
}
