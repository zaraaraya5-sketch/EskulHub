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
        $verification = PortfolioVerification::where('verification_id', $id)
            ->orWhere('id', $id)
            ->orWhere('student_id', $id)
            ->orWhere('student_nisn', $id)
            ->first();

        if (!$verification) {
            return response()->json(['message' => 'Dokumen verifikasi tidak ditemukan.'], 404);
        }

        return response()->json($verification);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if (empty($data['id'])) {
            $data['id'] = 'ver-' . time() . '-' . Str::random(4);
        }
        if (empty($data['verification_id'])) {
            $data['verification_id'] = 'EKH-' . date('Y') . '-' . str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
        }
        $data['qr_code_url'] = '/verify/' . $data['verification_id'];

        $verification = PortfolioVerification::updateOrCreate(
            ['student_id' => $data['student_id']],
            $data
        );

        return response()->json(['success' => true, 'verification' => $verification]);
    }
}
