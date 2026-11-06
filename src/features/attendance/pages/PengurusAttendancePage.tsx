import React, { useState } from 'react';
import { db } from '@/lib/database';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Plus, CheckSquare, Calendar, Filter, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { AttendanceStatus } from '@/types';

export const PengurusAttendancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const allEkskul = db.getExtracurriculars();
  const managedEkskul = db.getExtracurricularById('eks-1') || allEkskul[0] || {
    id: 'eks-1',
    name: 'Futsal Putra',
    location: 'Gelanggang Olahraga / Lapangan Utama',
  };

  const [sessions, setSessions] = useState(() =>
    db.getAttendanceSessions().filter(s => s.extracurricular_id === managedEkskul.id)
  );
  const [selectedSessionId, setSelectedSessionId] = useState<string>(() => sessions[0]?.id || '');
  const [records, setRecords] = useState(() => db.getAttendanceRecords());

  // Modal create session
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [sessionDate, setSessionDate] = useState('2026-09-24');
  const [startTime, setStartTime] = useState('15:30');
  const [endTime, setEndTime] = useState('17:30');
  const [location, setLocation] = useState(managedEkskul.location);
  const [notes, setNotes] = useState('');

  const activeSession = sessions.find(s => s.id === selectedSessionId);
  const sessionRecords = records.filter(r => r.attendance_session_id === selectedSessionId);

  const handleStatusChange = (recordId: string, newStatus: AttendanceStatus) => {
    db.updateAttendanceRecord(recordId, newStatus);
    setRecords([...db.getAttendanceRecords()]);
    setSessions([...db.getAttendanceSessions().filter(s => s.extracurricular_id === managedEkskul.id)]);
  };

  const handleCreateSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = db.createAttendanceSession({
      extracurricular_id: managedEkskul.id,
      title: title.trim(),
      session_date: sessionDate,
      start_time: startTime,
      end_time: endTime,
      location: location.trim(),
      notes: notes.trim(),
      created_by_name: currentUser?.name || 'Pengurus',
    });

    if (res.success && res.session) {
      setSessions([...db.getAttendanceSessions().filter(s => s.extracurricular_id === managedEkskul.id)]);
      setRecords([...db.getAttendanceRecords()]);
      setSelectedSessionId(res.session.id);
      setIsCreateModalOpen(false);
      setTitle('');
      setNotes('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE6DC] pb-5">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#D15B40] mb-1">
            Presensi Digital • {managedEkskul.name}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
            Pencatatan Presensi Sesi Latihan
          </h1>
          <p className="text-xs text-[#525049] mt-0.5">
            Buku catatan kehadiran terhubung otomatis ke profil dan lembar portofolio resmi masing-masing anggota.
          </p>
        </div>

        <div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Buka Sesi Presensi Baru
          </Button>
        </div>
      </div>

      {/* Select Session Dropdown Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0">Pilih Sesi Latihan:</label>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-all"
          >
            {sessions.map((sess) => (
              <option key={sess.id} value={sess.id}>
                {sess.session_date} — {sess.title}
              </option>
            ))}
          </select>
        </div>

        {activeSession && (
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeSession.start_time} - {activeSession.end_time} WIB</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeSession.location}</span>
            </span>
          </div>
        )}
      </div>

      {/* Session Stats Bar */}
      {activeSession && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-center text-xs">
            <div className="py-1 sm:px-2">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Total Anggota</span>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 block">{activeSession.total_members}</span>
            </div>
            <div className="py-1 sm:px-2">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Hadir</span>
              <span className="text-2xl font-extrabold text-[#D15B40] tracking-tight mt-0.5 block">{activeSession.present_count}</span>
            </div>
            <div className="py-1 sm:px-2">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Terlambat</span>
              <span className="text-2xl font-extrabold text-amber-600 tracking-tight mt-0.5 block">{activeSession.late_count}</span>
            </div>
            <div className="py-1 sm:px-2">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Izin / Sakit</span>
              <span className="text-2xl font-extrabold text-teal-700 tracking-tight mt-0.5 block">{activeSession.excused_count}</span>
            </div>
            <div className="py-1 col-span-2 sm:col-span-1 sm:px-2">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Alpa</span>
              <span className="text-2xl font-extrabold text-rose-600 tracking-tight mt-0.5 block">{activeSession.absent_count}</span>
            </div>
          </div>
        </div>
      )}

      {/* Members Attendance Form Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#D15B40]" />
            <span>Daftar Anggota Pada Sesi Ini</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Ubah status kehadiran secara instan:</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Status Presensi</th>
                <th className="py-3 px-4">Catatan / Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessionRecords.map((rec, idx) => (
                <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 text-center text-slate-500">{idx + 1}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{rec.student_name}</td>
                  <td className="py-3.5 px-4">
                    <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 gap-1">
                      <button
                        onClick={() => handleStatusChange(rec.id, 'present')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          rec.status === 'present'
                            ? 'bg-[#D15B40] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                        }`}
                      >
                        Hadir
                      </button>
                      <button
                        onClick={() => handleStatusChange(rec.id, 'late')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          rec.status === 'late'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                        }`}
                      >
                        Terlambat
                      </button>
                      <button
                        onClick={() => handleStatusChange(rec.id, 'excused')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          rec.status === 'excused'
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                        }`}
                      >
                        Izin
                      </button>
                      <button
                        onClick={() => handleStatusChange(rec.id, 'absent')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          rec.status === 'absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                        }`}
                      >
                        Alpa
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium">{rec.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create Session */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Buka Sesi Presensi Latihan Baru"
      >
        <form onSubmit={handleCreateSessionSubmit} className="space-y-4 text-xs">
          <Input
            label="Topik / Materi Latihan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Latihan Pola Serangan 2-2 & Finishing"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tanggal Latihan"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              required
            />
            <Input
              label="Lokasi Fasilitas"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Jam Mulai"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <Input
              label="Jam Selesai"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Catatan Sesi (Opsional)"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan khusus dari pelatih atau materi yang ditekankan..."
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE6DC]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Buka Sesi Presensi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
