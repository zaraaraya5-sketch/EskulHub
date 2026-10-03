<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

$eventsCount = DB::table('events')->count();
$schoolEventsCount = DB::table('school_events')->count();

echo "events table count: " . $eventsCount . "\n";
echo "school_events table count: " . $schoolEventsCount . "\n";

$allEvents = DB::table('events')->get();
foreach ($allEvents as $e) {
    echo "ID: {$e->id} | Title: {$e->title} | Start: {$e->start_time} | Category: {$e->category}\n";
}

$allSchoolEvents = DB::table('school_events')->get();
foreach ($allSchoolEvents as $e) {
    echo "SE_ID: {$e->id} | Title: {$e->title} | Start: {$e->start_datetime} | Category: {$e->category}\n";
}
