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
                'school_name' => 'SMKN 1 Ciomas',
                'npsn' => '20254135',
                'address' => 'Jl. Raya Laladon No. 20, Ciomas, Kec. Ciomas, Kab. Bogor, Jawa Barat 16610',
                'academic_year' => '2025/2026',
                'principal_name' => 'Januar Ashari',
                'vice_principal_student_affairs' => 'Jamil Husein',
            ]);
        } else if ($setting->npsn !== '20254135' || $setting->principal_name !== 'Januar Ashari' || $setting->vice_principal_student_affairs !== 'Jamil Husein') {
            $setting->update([
                'npsn' => '20254135',
                'principal_name' => 'Januar Ashari',
                'vice_principal_student_affairs' => 'Jamil Husein',
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
