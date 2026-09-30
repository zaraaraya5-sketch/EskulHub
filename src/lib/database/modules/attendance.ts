import { AttendanceSession, AttendanceRecord } from '@/types';
import * as apiService from '@/lib/api';
import { ExtracurricularsModule } from './extracurriculars';

export class AttendanceModule {
  private attendanceSessions: AttendanceSession[] = [];
  private attendanceRecords: AttendanceRecord[] = [];
  private extracurricularsModule: ExtracurricularsModule;
  private notify: () => void;

  constructor(extracurricularsModule: ExtracurricularsModule, notify: () => void) {
    this.extracurricularsModule = extracurricularsModule;
    this.notify = notify;
  }

  public setSessions(sessions: AttendanceSession[]) {
    this.attendanceSessions = sessions;
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
      total_members: members.length,
      present_count: members.length,
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
