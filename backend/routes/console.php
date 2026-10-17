<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('db:copy-sqlite {--path=database/database.sqlite}', function () {
    $sqlitePath = base_path($this->option('path'));
    if (!file_exists($sqlitePath)) {
        $this->error("File SQLite tidak ditemukan di: {$sqlitePath}");
        return 1;
    }

    $this->info("Menghubungkan ke SQLite ({$sqlitePath})...");
    $sqlite = new PDO("sqlite:{$sqlitePath}");
    $sqlite->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $tablesStmt = $sqlite->query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != 'migrations'");
    $tables = $tablesStmt->fetchAll(PDO::FETCH_COLUMN);

    $this->info("Ditemukan " . count($tables) . " tabel di SQLite.");

    foreach ($tables as $table) {
        $this->line("Memproses tabel: <info>{$table}</info>...");
        try {
            $rows = $sqlite->query("SELECT * FROM \"{$table}\"")->fetchAll(PDO::FETCH_ASSOC);
            if (empty($rows)) {
                $this->comment("  -> Kosong, dilewati.");
                continue;
            }

            $count = 0;
            foreach ($rows as $row) {
                // Pastikan nilai boolean / integer / json tersimpan dengan benar
                \Illuminate\Support\Facades\DB::table($table)->updateOrInsert(
                    isset($row['id']) ? ['id' => $row['id']] : $row,
                    $row
                );
                $count++;
            }
            $this->info("  -> Berhasil menyalin {$count} baris.");
        } catch (\Throwable $e) {
            $this->warn("  -> Gagal pada tabel {$table}: " . $e->getMessage());
        }
    }

    if (\Illuminate\Support\Facades\DB::getDriverName() === 'pgsql') {
        $serialColumns = \Illuminate\Support\Facades\DB::select("
            SELECT table_name, column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
              AND column_default LIKE 'nextval%'
        ");

        foreach ($serialColumns as $col) {
            $tbl = $col->table_name;
            $fld = $col->column_name;
            try {
                \Illuminate\Support\Facades\DB::statement("SELECT setval(pg_get_serial_sequence('\"{$tbl}\"', '{$fld}'), coalesce(max(\"{$fld}\"), 1)) FROM \"{$tbl}\";");
            } catch (\Throwable $e) {
                // Ignore
            }
        }
    }

    $this->info("Selesai proses transfer data ke PostgreSQL!");
    return 0;
})->purpose('Transfer semua data dari SQLite ke PostgreSQL');

