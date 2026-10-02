<?php

namespace App\Http\Controllers;

use App\Models\SchoolSetting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function get()
    {
        $setting = SchoolSetting::first();
        if (!$setting) {
            $setting = SchoolSetting::create([
                'school_name' => 'SMK Nusantara Digital',
                'npsn' => '20103482',
                'address' => 'Jl. Pendidikan Merdeka No. 45, Kota Bandung, Jawa Barat',
                'academic_year' => '2025/2026',
                'principal_name' => 'Drs. H. Mulyadi Kartasasmita, M.Pd.',
                'vice_principal_student_affairs' => 'Drs. Bambang Suryono',
            ]);
        }
        return response()->json($setting);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'school_name' => 'required|string|max:150',
            'npsn' => 'required|string|max:25',
            'address' => 'required|string|max:255',
            'academic_year' => 'required|string|max:25',
            'principal_name' => 'required|string|max:120',
            'vice_principal_student_affairs' => 'required|string|max:120',
        ]);

        $setting = SchoolSetting::first();
        if ($setting) {
            $setting->update($validated);
        } else {
            $setting = SchoolSetting::create($validated);
        }

        return response()->json(['success' => true, 'settings' => $setting]);
    }
}
