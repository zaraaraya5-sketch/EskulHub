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
        $setting = SchoolSetting::first();
        if ($setting) {
            $setting->update($request->all());
        } else {
            $setting = SchoolSetting::create($request->all());
        }
        return response()->json(['success' => true, 'settings' => $setting]);
    }
}
