import { AttendanceSession, AttendanceRecord } from '@/types';
import * as apiService from '@/lib/api';
import { ExtracurricularsModule } from './extracurriculars';

const INITIAL_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  // Futsal (eks-1) October 2026
  {
    id: 'att-fut-1',
    extracurricular_id: 'eks-1',
    extracurricular_name: 'Futsal',
    title: 'Latihan Taktik Passing & Finishing Cepat',
    session_date: '2026-10-06',
    start_time: '15:30',
    end_time: '17:30',
    location: 'Lapangan Futsal SMKN 1 Ciomas',
    created_by_name: 'Hendra Wijaya, S.Pd.',
    total_members: 24,
    present_count: 23,
    late_count: 0,
    excused_count: 1,
    absent_count: 0,
    notes: 'Kondisi fisik prima, evaluasi transisi bertahan.',
  },
  {
    id: 'att-fut-2',
    extracurricular_id: 'eks-1',
    extracurricular_name: 'Futsal',
    title: 'Simulasi Match & Set Piece Bola Mati',
    session_date: '2026-10-10',
    start_time: '15:30',
    end_time: '17:30',
    location: 'Lapangan Futsal SMKN 1 Ciomas',
    created_by_name: 'Hendra Wijaya, S.Pd.',
    total_members: 24,
    present_count: 22,
    late_count: 1,
    excused_count: 1,
    absent_count: 0,
    notes: 'Kombinasi corner kick dan power play dipraktekkan baik.',
  },
  {
    id: 'att-fut-3',
    extracurricular_id: 'eks-1',
    extracurricular_name: 'Futsal',
    title: 'Drill Ketahanan Fisik & Pressing Tinggi',
    session_date: '2026-10-13',
    start_time: '15:30',
    end_time: '17:30',
    location: 'Lapangan Olahraga Utama',
    created_by_name: 'Hendra Wijaya, S.Pd.',
    total_members: 24,
    present_count: 24,
    late_count: 0,
    excused_count: 0,
    absent_count: 0,
    notes: 'Presensi penuh 100%. Tingkat fokus tim sangat tinggi.',
  },
  {
    id: 'att-fut-4',
    extracurricular_id: 'eks-1',
    extracurricular_name: 'Futsal',
    title: 'Uji Coba Friendly Match Antar-Angkatan',
    session_date: '2026-10-17',
    start_time: '15:30',
    end_time: '17:30',
    location: 'Lapangan Futsal SMKN 1 Ciomas',
    created_by_name: 'Hendra Wijaya, S.Pd.',
    total_members: 24,
    present_count: 21,
    late_count: 1,
    excused_count: 2,
    absent_count: 0,
    notes: 'Kemenangan tim inti skor 4-2. Kondisi mental sangat baik.',
  },
  {
    id: 'att-fut-5',
    extracurricular_id: 'eks-1',
    extracurricular_name: 'Futsal',
    title: 'Pemantapan Formasi & Defense Compact',
    session_date: '2026-10-20',
    start_time: '15:30',
    end_time: '17:30',
    location: 'Lapangan Futsal SMKN 1 Ciomas',
    created_by_name: 'Hendra Wijaya, S.Pd.',
    total_members: 24,
    present_count: 23,
    late_count: 0,
    excused_count: 1,
    absent_count: 0,
    notes: 'Pola 1-2-1 berjalan konsisten saat ditekan lawan.',
  },
  {
    id: 'att-fut-6',
    extracurricular_id: 'eks-1',
    extracurricular_name: 'Futsal',
    title: 'Gladi Resik Terakhir & Briefing Turnamen',
    session_date: '2026-10-24',
    start_time: '15:30',
    end_time: '17:30',
    location: 'Aula Serbaguna Lantai 3',
    created_by_name: 'Hendra Wijaya, S.Pd.',
    total_members: 24,
    present_count: 24,
    late_count: 0,
    excused_count: 0,
    absent_count: 0,
    notes: 'Briefing teknis dan pembagian jersey tanding resmi.',
  },

  // Basket (eks-2) October 2026
  {
    id: 'att-bsk-1',
    extracurricular_id: 'eks-2',
    extracurricular_name: 'Basket',
    title: 'Fundamental Dribble & Fast Break Passing',
    session_date: '2026-10-07',
    start_time: '15:30',
    end_time: '17:30',
    location: 'Lapangan Basket Outdoor SMKN 1 Ciomas',
    created_by_name: 'Hendra Wijaya, S.Pd.',
    total_members: 26,
    present_count: 24,
    late_count: 1,
    excused_count: 1,
    absent_count: 0,
    notes: 'Latihan shooting 3-point dan box-out rebound.',
  },
  {
    id: 'att-bsk-2',
    extracurricular_id: 'eks-2',
    extracurricular_name: 'Basket',
    title: 'Pola Penyerangan Zone Defense & Pick and Roll',
    session_date: '2026-10-14',
    start_time: '15:30',
    end_time: '17:30',
    location: 'Lapangan Basket Outdoor SMKN 1 Ciomas',
    created_by_name: 'Hendra Wijaya, S.Pd.',
    total_members: 26,
    present_count: 25,
    late_count: 0,
    excused_count: 1,
    absent_count: 0,
    notes: 'Kekompakan rotasi pemain cadangan sangat meningkat.',
  },

  // Voli (eks-3) October 2026
  {
    id: 'att-vol-1',
    extracurricular_id: 'eks-3',
    extracurricular_name: 'Voli',
    title: 'Drill Receive Servis & Variasi Quick Spike',
    session_date: '2026-10-05',
    start_time: '15:30',
    end_time: '17:30',
    location: 'Lapangan Voli Outdoor',
    created_by_name: 'Agus Setiawan, S.Pd.',
    total_members: 20,
    present_count: 19,
    late_count: 0,
    excused_count: 1,
    absent_count: 0,
    notes: 'Fokus receive bola pertama dan akurasi tosser.',
  },
  {
    id: 'att-vol-2',
    extracurricular_id: 'eks-3',
    extracurricular_name: 'Voli',
    title: 'Simulasi Game & Pertahanan Block Duet',
    session_date: '2026-10-12',
    start_time: '15:30',
    end_time: '17:30',
    location: 'Lapangan Voli Outdoor',
    created_by_name: 'Agus Setiawan, S.Pd.',
    total_members: 20,
    present_count: 18,
    late_count: 1,
    excused_count: 1,
    absent_count: 0,
    notes: 'Timing lompatan block berhasil meredam spike lawan.',
  },

  // Paskibra (eks-4) October 2026
  {
    id: 'att-pas-1',
    extracurricular_id: 'eks-4',
    extracurricular_name: 'Paskibra',
    title: 'Latihan PBB Dasar & Kekompakan Langkah Tegap',
    session_date: '2026-10-06',
    start_time: '15:30',
    end_time: '17:30',
    location: 'Lapangan Olahraga Utama',
    created_by_name: 'Dedi Kurniawan, S.Pd.',
    total_members: 28,
    present_count: 27,
    late_count: 0,
    excused_count: 1,
    absent_count: 0,
    notes: 'Penyeragaman ayunan tangan dan kerapihan barisan.',
  },
  {
    id: 'att-pas-2',
    extracurricular_id: 'eks-4',
    extracurricular_name: 'Paskibra',
    title: 'Formasi Variasi Baris-Berbaris & Pengibaran',
    session_date: '2026-10-13',
    start_time: '15:30',
    end_time: '17:30',
    location: 'Lapangan Olahraga Utama',
    created_by_name: 'Dedi Kurniawan, S.Pd.',
    total_members: 28,
    present_count: 28,
    late_count: 0,
    excused_count: 0,
    absent_count: 0,
    notes: 'Gladi sukses persiapan upacara hari Sumpah Pemuda.',
  },
];

export class AttendanceModule {
  private attendanceSessions: AttendanceSession[] = [...INITIAL_ATTENDANCE_SESSIONS];
  private attendanceRecords: AttendanceRecord[] = [];
  private extracurricularsModule: ExtracurricularsModule;
  private notify: () => void;

  constructor(extracurricularsModule: ExtracurricularsModule, notify: () => void) {
    this.extracurricularsModule = extracurricularsModule;
    this.notify = notify;
  }

  public setSessions(sessions: AttendanceSession[]) {
    this.attendanceSessions = sessions && sessions.length > 0 ? sessions : [...INITIAL_ATTENDANCE_SESSIONS];
  }

  public setRecords(records: AttendanceRecord[]) {
    this.attendanceRecords = records;
  }

  public getAttendanceSessions(): AttendanceSession[] {
    return this.attendanceSessions;
  }

  public getAttendanceRecords(): AttendanceRecord[] {
    return this.attendanceRecords;
  }

  public createAttendanceSession(data: {
    extracurricular_id: string;
    title: string;
    session_date: string;
    start_time: string;
    end_time: string;
    location: string;
    notes?: string;
    created_by_name: string;
  }) {
    const ekskul = this.extracurricularsModule.getExtracurricularById(data.extracurricular_id);
    if (!ekskul) return { success: false, message: 'Ekskul tidak ditemukan' };

    const members = this.extracurricularsModule.getMembersByExtracurricularId(data.extracurricular_id);
    const newSession: AttendanceSession = {
      id: `att-sess-${Date.now()}`,
      extracurricular_id: data.extracurricular_id,
      extracurricular_name: ekskul.name,
      title: data.title,
      session_date: data.session_date,
      start_time: data.start_time,
      end_time: data.end_time,
      location: data.location,
      notes: data.notes,
      created_by_name: data.created_by_name,
      total_members: members.length || 24,
      present_count: members.length || 24,
      late_count: 0,
      excused_count: 0,
      absent_count: 0,
    };

    this.attendanceSessions.unshift(newSession);
    apiService.createAttendanceSessionAPI(newSession);

    members.forEach((m) => {
      const newRec: AttendanceRecord = {
        id: `rec-${Date.now()}-${m.student_id}`,
        attendance_session_id: newSession.id,
        session_title: newSession.title,
        session_date: newSession.session_date,
        extracurricular_name: newSession.extracurricular_name,
        student_id: m.student_id,
        student_name: m.student_name,
        status: 'present',
      };
      this.attendanceRecords.push(newRec);
      apiService.saveAttendanceRecordAPI(newRec);
    });

    this.notify();
    return { success: true, session: newSession };
  }

  public updateAttendanceRecord(
    recordId: string,
    status: 'present' | 'late' | 'excused' | 'absent',
    notes?: string
  ): { success: boolean; message?: string } {
    const rec = this.attendanceRecords.find((r) => r.id === recordId);
    if (!rec) return { success: false, message: 'Presensi tidak ditemukan' };

    rec.status = status;
    if (notes !== undefined) rec.notes = notes;

    const sess = this.attendanceSessions.find((s) => s.id === rec.attendance_session_id);
    if (sess) {
      const records = this.attendanceRecords.filter((r) => r.attendance_session_id === sess.id);
      sess.present_count = records.filter((r) => r.status === 'present').length;
      sess.late_count = records.filter((r) => r.status === 'late').length;
      sess.excused_count = records.filter((r) => r.status === 'excused').length;
      sess.absent_count = records.filter((r) => r.status === 'absent').length;
    }

    apiService.saveAttendanceRecordAPI(rec);
    this.notify();
    return { success: true };
  }
}
