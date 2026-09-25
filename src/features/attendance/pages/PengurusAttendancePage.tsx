import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
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
          <div className="text-xs font-bold uppercase tracking-wider text-[#234B36] mb-1">
            Presensi Digital • {managedEkskul.name}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
            Pencatatan Presensi Sesi Latihan
          </h1>
          <p className="text-xs text-[#68655F] mt-0.5">
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
      <div className="bg-white border border-[#EAE6DC] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[#171717] uppercase shrink-0">Pilih Sesi Latihan:</label>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#EAE6DC] rounded text-[#171717] font-semibold focus:outline-none focus:ring-1 focus:ring-[#234B36]"
          >
            {sessions.map((sess) => (
              <option key={sess.id} value={sess.id}>
                {sess.session_date} — {sess.title}
              </option>
            ))}
          </select>
        </div>

        {activeSession && (
          <div className="flex items-center gap-4 text-xs text-[#68655F]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{activeSession.start_time} - {activeSession.end_time}</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{activeSession.location}</span>
            </span>
          </div>
        )}
      </div>

      {/* Session Stats Bar */}
      {activeSession && (
        <div className="bg-[#F9F8F6] border border-[#EAE6DC] rounded-lg p-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#D8D4CC] text-center text-xs">
            <div className="py-1">
              <span className="text-[#68655F] block text-[10px] uppercase font-semibold">Total Anggota</span>
              <span className="text-base font-bold text-[#171717]">{activeSession.total_members}</span>
            </div>
            <div className="py-1">
              <span className="text-[#68655F] block text-[10px] uppercase font-semibold">Hadir</span>
              <span className="text-base font-bold text-[#234B36]">{activeSession.present_count}</span>
            </div>
            <div className="py-1">
              <span className="text-[#68655F] block text-[10px] uppercase font-semibold">Terlambat</span>
              <span className="text-base font-bold text-[#B58A32]">{activeSession.late_count}</span>
            </div>
            <div className="py-1">
              <span className="text-[#68655F] block text-[10px] uppercase font-semibold">Izin / Sakit</span>
              <span className="text-base font-bold text-[#68655F]">{activeSession.excused_count}</span>
            </div>
            <div className="py-1">
              <span className="text-[#68655F] block text-[10px] uppercase font-semibold">Alpa</span>
              <span className="text-base font-bold text-[#A33D35]">{activeSession.absent_count}</span>
            </div>
          </div>
        </div>
      )}

      {/* Members Attendance Form Table */}
      <div className="bg-white border border-[#EAE6DC] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#EAE6DC] bg-[#F9F8F6]/40 flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
            Daftar Anggota Pada Sesi Ini
          </h2>
          <span className="text-[11px] text-[#68655F]">Ubah status kehadiran secara instan:</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
              <tr>
                <th className="py-2.5 px-3 font-semibold w-12">No</th>
                <th className="py-2.5 px-3 font-semibold">Nama Siswa</th>
                <th className="py-2.5 px-3 font-semibold">Status Presensi</th>
                <th className="py-2.5 px-3 font-semibold">Catatan / Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D4CC]">
              {sessionRecords.map((rec, idx) => (
                <tr key={rec.id} className="hover:bg-[#F9F8F6]/40">
                  <td className="py-2.5 px-3 text-[#68655F]">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-bold text-[#171717]">{rec.student_name}</td>
                  <td className="py-2.5 px-3">
                    <div className="inline-flex rounded border border-[#EAE6DC] bg-[#F9F8F6] p-0.5 gap-0.5">
                      <button
                        onClick={() => handleStatusChange(rec.id, 'present')}
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                          rec.status === 'present' ? 'bg-[#234B36] text-white' : 'text-[#171717] hover:bg-white'
                        }`}
                      >
                        Hadir
                      </button>
                      <button
                        onClick={() => handleStatusChange(rec.id, 'late')}
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                          rec.status === 'late' ? 'bg-[#B58A32] text-white' : 'text-[#171717] hover:bg-white'
                        }`}
                      >
                        Terlambat
                      </button>
                      <button
                        onClick={() => handleStatusChange(rec.id, 'excused')}
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                          rec.status === 'excused' ? 'bg-[#5A5750] text-white' : 'text-[#171717] hover:bg-white'
                        }`}
                      >
                        Izin
                      </button>
                      <button
                        onClick={() => handleStatusChange(rec.id, 'absent')}
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                          rec.status === 'absent' ? 'bg-[#A33D35] text-white' : 'text-[#171717] hover:bg-white'
                        }`}
                      >
                        Alpa
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-[#68655F]">{rec.notes || '-'}</td>
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
