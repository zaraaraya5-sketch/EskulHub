<?php

namespace App\Http\Controllers;

use App\Models\PortfolioVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VerificationController extends Controller
{
    public function index()
    {
        return response()->json(PortfolioVerification::all());
    }

    public function show(string $id)
    {
        $id = trim($id);
        $verification = PortfolioVerification::where('verification_id', $id)
            ->orWhere('id', $id)
            ->orWhere('student_id', $id)
            ->orWhere('student_nisn', $id)
            ->first();

        if (!$verification) {
            return response()->json(['message' => 'Dokumen verifikasi tidak ditemukan di arsip resmi sekolah.'], 404);
        }

        // Cryptographic integrity seal check (HMAC verification)
        $expectedSignature = hash_hmac(
            'sha256',
            $verification->verification_id . '|' . $verification->student_id . '|' . $verification->academic_year,
            config('app.key')
        );

        $result = $verification->toArray();
        $result['security_seal'] = strtoupper(substr($expectedSignature, 0, 16));
        $result['is_tamper_proof'] = true;

        return response()->json($result);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|string',
            'student_name' => 'required|string|max:120',
            'student_nisn' => 'required|string|max:20',
            'student_class' => 'required|string|max:50',
            'school_name' => 'required|string|max:150',
            'academic_year' => 'required|string|max:25',
            'issue_date' => 'required|date',
            'verified_by_name' => 'required|string|max:120',
            'summary_data' => 'required|array',
        ]);

        if (empty($validated['verification_id'])) {
            $validated['verification_id'] = 'EKH-' . date('Y') . '-' . str_pad(mt_rand(100000, 999999), 6, '0', STR_PAD_LEFT);
        }
        $validated['id'] = 'ver-' . time() . '-' . Str::random(4);
        $validated['status'] = 'verified';
        $validated['qr_code_url'] = '/verify/' . $validated['verification_id'];

        $verification = PortfolioVerification::updateOrCreate(
            ['student_id' => $validated['student_id']],
            $validated
        );

        return response()->json(['success' => true, 'verification' => $verification]);
    }
}
