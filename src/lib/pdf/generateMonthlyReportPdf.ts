import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import {
  Extracurricular,
  ExtracurricularMember,
  AttendanceSession,
  Achievement,
  User,
  SchoolSetting,
} from '@/types';
import { SMKN1_CIOMAS_LOGO_BASE64, TUGU_KUJANG_LOGO_BASE64 } from './schoolLogoBase64';

export interface PembinaMonthlyReportData {
  mode: 'pembina';
  year: number;
  month: number; // 1-12
  monthName: string;
  ekskul: Extracurricular;
  pembinaName: string;
  pembinaNip?: string;
  schoolSetting: SchoolSetting;
  newMembers: ExtracurricularMember[];
  activeMembersCount: number;
  capacity: number;
  sessions: AttendanceSession[];
  achievements: Achievement[];
  generatedAt?: string;
}

export interface PengurusMonthlyReportData {
  mode: 'pengurus';
  year: number;
  month: number; // 1-12
  monthName: string;
  schoolSetting: SchoolSetting;
  pengurusName: string;
  newRegisteredStudents: User[];
  ekskulRecapList: Array<{
    ekskul: Extracurricular;
    newMembersCount: number;
    totalActiveMembers: number;
    capacity: number;
    sessionCount: number;
    avgAttendanceRate?: number;
  }>;
  facilityUsageSessions: AttendanceSession[];
  achievements: Achievement[];
  generatedAt?: string;
}

export type MonthlyReportData = PembinaMonthlyReportData | PengurusMonthlyReportData;

// Draw official institutional letterhead with school logo on top-left and centered text
const drawSchoolLetterhead = (doc: jsPDF, schoolSetting: SchoolSetting, pageWidth: number): number => {
  const leftLogoX = 16;
  const logoW = 18;
  const logoH = 22;
  const rightLogoX = pageWidth - 16 - logoW;
  const logoY = 9;

  try {
    doc.addImage(SMKN1_CIOMAS_LOGO_BASE64, 'PNG', leftLogoX, logoY, logoW, logoH);
  } catch (err) {
    console.warn('Failed to render school logo in PDF letterhead:', err);
  }

  try {
    doc.addImage(TUGU_KUJANG_LOGO_BASE64, 'PNG', rightLogoX, logoY, logoW, logoH);
  } catch (err) {
    console.warn('Failed to render Tugu Kujang logo in PDF letterhead:', err);
  }

  // Institution text centered symmetrically on the page
  const textCenterX = pageWidth / 2;

  doc.setFont('times', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(20, 20, 20);
  doc.text('PEMERINTAH DAERAH PROVINSI JAWA BARAT', textCenterX, 13, { align: 'center' });

  doc.setFontSize(10);
  doc.text('DINAS PENDIDIKAN', textCenterX, 17.5, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.text('CABANG DINAS PENDIDIKAN WILAYAH I KABUPATEN BOGOR', textCenterX, 21.5, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(25, 60, 40);
  doc.text(schoolSetting.school_name.toUpperCase(), textCenterX, 26.5, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text(
    `${schoolSetting.address} | Telp: (0251) 8638148`,
    textCenterX,
    30.5,
    { align: 'center' }
  );
  doc.text(
    `Website: smkn1ciomas.sch.id | NPSN: ${schoolSetting.npsn || '20254135'} | Email: info@smkn1ciomas.sch.id`,
    textCenterX,
    34,
    { align: 'center' }
  );

  // Official Double Line Separator
  doc.setDrawColor(25, 60, 40);
  doc.setLineWidth(1.1);
  doc.line(15, 36.5, 195, 36.5);
  doc.setLineWidth(0.35);
  doc.line(15, 37.8, 195, 37.8);

  return 44;
};

export const generateMonthlyReportPdf = async (
  data: MonthlyReportData,
  mode: 'save' | 'blob' | 'print' = 'save'
): Promise<Blob | void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 15;
  const contentWidth = 180;

  let y = drawSchoolLetterhead(doc, data.schoolSetting, pageWidth);

  const checkPageOverflow = (requiredHeight: number) => {
    if (y + requiredHeight > pageHeight - 25) {
      doc.addPage();
      y = 16;
      doc.setFont('times', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      const continuationTitle =
        data.mode === 'pembina'
          ? `Laporan Rekapitulasi Bulanan - Ekskul ${data.ekskul.name} (${data.monthName} ${data.year}) - Lanjutan`
          : `Laporan Rekapitulasi Bulanan Kesiswaan & Sarana (${data.monthName} ${data.year}) - Lanjutan`;
      doc.text(continuationTitle, marginX, y);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(marginX, y + 2, 195, y + 2);
      y += 8;
    }
  };

  if (data.mode === 'pembina') {
    // ==========================================
    // PEMBINA MONTHLY REPORT
    // ==========================================
    doc.setFont('times', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(20, 20, 20);
    doc.text('LAPORAN REKAPITULASI BULANAN KEGIATAN EKSTRAKURIKULER', pageWidth / 2, y, { align: 'center' });
    y += 5;

    doc.setFontSize(10.5);
    doc.setTextColor(25, 60, 40);
    doc.text(
      `BIDANG PEMBINAAN: ${data.ekskul.name.toUpperCase()} (PERIODE ${data.monthName.toUpperCase()} ${data.year})`,
      pageWidth / 2,
      y,
      { align: 'center' }
    );
    y += 4;

    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    doc.text(
      `Nomor Berkas: 421.5/REKAP-${data.ekskul.slug.toUpperCase()}/${data.year}/${String(data.month).padStart(2, '0')}/SMK`,
      pageWidth / 2,
      y,
      { align: 'center' }
    );
    y += 6;

    // Metadata Summary Box
    doc.setFillColor(249, 248, 246);
    doc.setDrawColor(220, 216, 208);
    doc.roundedRect(marginX, y, contentWidth, 24, 2, 2, 'FD');

    doc.setFont('times', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(25, 60, 40);
    doc.text('INFORMASI POKOK PEMBINAAN & EKSTRAKURIKULER', marginX + 4, y + 5);

    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);
    doc.text(`Guru Pembina: ${data.pembinaName}${data.pembinaNip ? ` (NIP. ${data.pembinaNip})` : ''}`, marginX + 4, y + 10);
    doc.text(`Ketua Ekskul: ${data.ekskul.chairperson_name}`, marginX + 4, y + 15);
    doc.text(`Jadwal Rutin: ${data.ekskul.practice_schedule}`, marginX + 4, y + 19.5);

    doc.text(`Kategori: ${data.ekskul.category}`, marginX + 105, y + 10);
    doc.text(`Lokasi Fasilitas: ${data.ekskul.location}`, marginX + 105, y + 15);
    doc.text(`Anggota Aktif / Kuota: ${data.activeMembersCount} / ${data.capacity} Siswa`, marginX + 105, y + 19.5);
    y += 28;

    // 4 Key Metrics Cards
    const totalPresent = data.sessions.reduce((acc, s) => acc + (s.present_count || 0), 0);
    const totalPossible = data.sessions.reduce((acc, s) => acc + (s.total_members || 0), 0);
    const avgAttendancePercent = totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 92;

    const colW = (contentWidth - 6) / 4;
    const cards = [
      { label: 'Anggota Baru', value: `${data.newMembers.length} Siswa`, sub: `Periode ${data.monthName}` },
      { label: 'Total Keanggotaan', value: `${data.activeMembersCount} Siswa`, sub: `Kapasitas: ${data.capacity}` },
      { label: 'Sesi Latihan', value: `${data.sessions.length} Kali`, sub: `Rerata Hadir: ${avgAttendancePercent}%` },
      { label: 'Prestasi Diraih', value: `${data.achievements.length} Piagam`, sub: `Tervalidasi Resmi` },
    ];

    cards.forEach((c, idx) => {
      const cx = marginX + idx * (colW + 2);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(215, 210, 200);
      doc.roundedRect(cx, y, colW, 14, 1.5, 1.5, 'FD');

      doc.setFont('times', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 100, 100);
      doc.text(c.label.toUpperCase(), cx + 3, y + 4);

      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(25, 60, 40);
      doc.text(c.value, cx + 3, y + 8.5);

      doc.setFont('times', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(120, 120, 120);
      doc.text(c.sub, cx + 3, y + 12);
    });
    y += 18;

    // SECTION 1: REKAP ANGGOTA BARU
    checkPageOverflow(28);
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    doc.text(`I. REKAPITULASI PENAMBAHAN ANGGOTA BARU (BULAN ${data.monthName.toUpperCase()} ${data.year})`, marginX, y);
    y += 4;

    // Table Header
    doc.setFillColor(25, 60, 40);
    doc.rect(marginX, y, contentWidth, 6, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('No', marginX + 3, y + 4.2);
    doc.text('Nama Lengkap Siswa', marginX + 12, y + 4.2);
    doc.text('NISN', marginX + 75, y + 4.2);
    doc.text('Kelas / Rombel', marginX + 105, y + 4.2);
    doc.text('Tanggal Disahkan', marginX + 135, y + 4.2);
    doc.text('Peran', marginX + 165, y + 4.2);
    y += 6;

    if (data.newMembers.length === 0) {
      doc.setFillColor(253, 253, 252);
      doc.rect(marginX, y, contentWidth, 7, 'F');
      doc.setDrawColor(220, 220, 220);
      doc.rect(marginX, y, contentWidth, 7, 'S');
      doc.setFont('times', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text('Tidak ada penambahan anggota baru pada bulan ini.', marginX + 5, y + 4.8);
      y += 9;
    } else {
      data.newMembers.forEach((m, i) => {
        checkPageOverflow(7);
        doc.setFillColor(i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 247);
        doc.rect(marginX, y, contentWidth, 6, 'F');
        doc.setDrawColor(225, 225, 225);
        doc.line(marginX, y + 6, marginX + contentWidth, y + 6);

        doc.setFont('times', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(30, 30, 30);
        doc.text(String(i + 1), marginX + 3, y + 4.2);
        doc.setFont('times', 'bold');
        doc.text(m.student_name, marginX + 12, y + 4.2);
        doc.setFont('times', 'normal');
        doc.text(m.student_nisn || '-', marginX + 75, y + 4.2);
        doc.text(m.student_class || '-', marginX + 105, y + 4.2);
        doc.text(m.joined_at || '-', marginX + 135, y + 4.2);
        doc.text(m.role || 'Anggota', marginX + 165, y + 4.2);
        y += 6;
      });
      y += 3;
    }

    // SECTION 2: REKAP PELAKSANAAN SESI LATIHAN
    checkPageOverflow(28);
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    doc.text(`II. REKAPITULASI PELAKSANAAN SESI LATIHAN & KEHADIRAN (BULAN ${data.monthName.toUpperCase()} ${data.year})`, marginX, y);
    y += 4;

    doc.setFillColor(25, 60, 40);
    doc.rect(marginX, y, contentWidth, 6, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('No', marginX + 3, y + 4.2);
    doc.text('Tanggal & Jam', marginX + 10, y + 4.2);
    doc.text('Materi / Topik Latihan', marginX + 48, y + 4.2);
    doc.text('Lokasi Fasilitas', marginX + 108, y + 4.2);
    doc.text('Hadir', marginX + 148, y + 4.2);
    doc.text('Izin/Skt', marginX + 160, y + 4.2);
    doc.text('Alpa', marginX + 172, y + 4.2);
    y += 6;

    if (data.sessions.length === 0) {
      doc.setFillColor(253, 253, 252);
      doc.rect(marginX, y, contentWidth, 7, 'F');
      doc.setDrawColor(220, 220, 220);
      doc.rect(marginX, y, contentWidth, 7, 'S');
      doc.setFont('times', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text('Belum ada sesi latihan yang tercatat dalam sistem pada bulan ini.', marginX + 5, y + 4.8);
      y += 9;
    } else {
      data.sessions.forEach((s, i) => {
        checkPageOverflow(7);
        doc.setFillColor(i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 247);
        doc.rect(marginX, y, contentWidth, 6.5, 'F');
        doc.setDrawColor(225, 225, 225);
        doc.line(marginX, y + 6.5, marginX + contentWidth, y + 6.5);

        doc.setFont('times', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(30, 30, 30);
        doc.text(String(i + 1), marginX + 3, y + 4.4);
        doc.text(`${s.session_date} (${s.start_time || '15:30'})`, marginX + 10, y + 4.4);

        const safeTitle = s.title.length > 32 ? s.title.slice(0, 30) + '..' : s.title;
        doc.setFont('times', 'bold');
        doc.text(safeTitle, marginX + 48, y + 4.4);

        doc.setFont('times', 'normal');
        const safeLoc = s.location.length > 20 ? s.location.slice(0, 18) + '..' : s.location;
        doc.text(safeLoc, marginX + 108, y + 4.4);

        doc.text(`${s.present_count || 0}`, marginX + 150, y + 4.4);
        doc.text(`${(s.excused_count || 0) + (s.late_count || 0)}`, marginX + 163, y + 4.4);
        doc.text(`${s.absent_count || 0}`, marginX + 173, y + 4.4);
        y += 6.5;
      });
      y += 3;
    }

    // SECTION 3: REKAP PRESTASI
    checkPageOverflow(26);
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    doc.text(`III. REKAPITULASI PRESTASI & KEJUARAAN (BULAN ${data.monthName.toUpperCase()} ${data.year})`, marginX, y);
    y += 4;

    doc.setFillColor(25, 60, 40);
    doc.rect(marginX, y, contentWidth, 6, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('No', marginX + 3, y + 4.2);
    doc.text('Tanggal', marginX + 10, y + 4.2);
    doc.text('Nama Kejuaraan / Turnamen', marginX + 32, y + 4.2);
    doc.text('Tingkat', marginX + 98, y + 4.2);
    doc.text('Peringkat / Juara', marginX + 125, y + 4.2);
    doc.text('Siswa Peraih', marginX + 155, y + 4.2);
    y += 6;

    if (data.achievements.length === 0) {
      doc.setFillColor(253, 253, 252);
      doc.rect(marginX, y, contentWidth, 7, 'F');
      doc.setDrawColor(220, 220, 220);
      doc.rect(marginX, y, contentWidth, 7, 'S');
      doc.setFont('times', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text('Tidak ada catatan kejuaraan / turnamen pada bulan ini.', marginX + 5, y + 4.8);
      y += 9;
    } else {
      data.achievements.forEach((a, i) => {
        checkPageOverflow(7);
        doc.setFillColor(i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 247);
        doc.rect(marginX, y, contentWidth, 6.5, 'F');
        doc.setDrawColor(225, 225, 225);
        doc.line(marginX, y + 6.5, marginX + contentWidth, y + 6.5);

        doc.setFont('times', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(30, 30, 30);
        doc.text(String(i + 1), marginX + 3, y + 4.4);
        doc.text(a.achievement_date || '-', marginX + 10, y + 4.4);
        doc.setFont('times', 'bold');
        const safeComp = a.competition_name.length > 32 ? a.competition_name.slice(0, 30) + '..' : a.competition_name;
        doc.text(safeComp, marginX + 32, y + 4.4);
        doc.setFont('times', 'normal');
        doc.text(a.level, marginX + 98, y + 4.4);
        doc.text(a.rank, marginX + 125, y + 4.4);
        const safeStudent = a.student_name.length > 18 ? a.student_name.slice(0, 16) + '..' : a.student_name;
        doc.text(safeStudent, marginX + 155, y + 4.4);
        y += 6.5;
      });
      y += 3;
    }

    // SIGNATURES BLOCK PEMBINA
    checkPageOverflow(42);
    y += 5;
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const sigLeftX = marginX + 5;
    const sigRightX = marginX + 115;

    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);

    doc.text('Mengetahui,', sigLeftX, y);
    doc.text(`Ciomas, ${dateFormatted}`, sigRightX, y);
    y += 4.5;
    doc.text('Wakil Kepala Sekolah Bidang Kesiswaan,', sigLeftX, y);
    doc.text('Guru Pembina Ekstrakurikuler,', sigRightX, y);

    // Official QR Stamp
    try {
      const qrData = `ESKULHUB-REKAP-${data.ekskul.slug.toUpperCase()}-${data.year}-${data.month}`;
      const qrDataUrl = await QRCode.toDataURL(qrData, { margin: 1, width: 80 });
      doc.addImage(qrDataUrl, 'PNG', sigRightX + 16, y + 2, 16, 16);
    } catch {
      // Fallback cleanly
    }

    y += 24;
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    doc.text(data.schoolSetting.vice_principal_student_affairs || 'Jamil Husein', sigLeftX, y);
    doc.text(data.pembinaName, sigRightX, y);
    y += 4;

    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text('NIP. 19680320 199403 1 004', sigLeftX, y);
    doc.text(data.pembinaNip ? `NIP. ${data.pembinaNip}` : 'Pembina Ekstrakurikuler Resmi', sigRightX, y);

  } else {
    // ==========================================
    // PENGURUS MONTHLY REPORT (SCHOOL-WIDE MACRO)
    // ==========================================
    doc.setFont('times', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(20, 20, 20);
    doc.text('LAPORAN REKAPITULASI BULANAN KESISWAAN & EKSTRAKURIKULER', pageWidth / 2, y, { align: 'center' });
    y += 5;

    doc.setFontSize(10.5);
    doc.setTextColor(25, 60, 40);
    doc.text(`MONITORING TINGKAT SEKOLAH - BULAN ${data.monthName.toUpperCase()} ${data.year}`, pageWidth / 2, y, { align: 'center' });
    y += 4;

    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    doc.text(`Nomor Arsip: 421.5/REKAP-KESISWAAN/${data.year}/${String(data.month).padStart(2, '0')}/PENGURUS`, pageWidth / 2, y, { align: 'center' });
    y += 6;

    // Macro Summary Box
    doc.setFillColor(249, 248, 246);
    doc.setDrawColor(220, 216, 208);
    doc.roundedRect(marginX, y, contentWidth, 22, 2, 2, 'FD');

    doc.setFont('times', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(25, 60, 40);
    doc.text('RINGKASAN KOORDINASI PENGURUS KESISWAAN', marginX + 4, y + 5);

    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);
    doc.text(`Koordinator Laporan: ${data.pengurusName} (Staf Kesiswaan)`, marginX + 4, y + 10);
    doc.text(`Satuan Pendidikan: ${data.schoolSetting.school_name}`, marginX + 4, y + 15);

    const totalNewMembersAll = data.ekskulRecapList.reduce((acc, curr) => acc + curr.newMembersCount, 0);
    const totalActiveAll = data.ekskulRecapList.reduce((acc, curr) => acc + curr.totalActiveMembers, 0);
    doc.text(`Total Cabang Ekskul: ${data.ekskulRecapList.length} Cabang`, marginX + 110, y + 10);
    doc.text(`Total Keanggotaan Aktif: ${totalActiveAll} Siswa`, marginX + 110, y + 15);
    y += 26;

    // 4 Key Metrics Cards
    const colW = (contentWidth - 6) / 4;
    const cards = [
      { label: 'Siswa Baru Web', value: `${data.newRegisteredStudents.length} Akun`, sub: `Terdaftar di Platform` },
      { label: 'Anggota Baru Ekskul', value: `${totalNewMembersAll} Siswa`, sub: `Bulan ${data.monthName}` },
      { label: 'Sesi Latihan Sarana', value: `${data.facilityUsageSessions.length} Sesi`, sub: `Penggunaan Fasilitas` },
      { label: 'Prestasi Sekolah', value: `${data.achievements.length} Medali`, sub: `Tervalidasi Resmi` },
    ];

    cards.forEach((c, idx) => {
      const cx = marginX + idx * (colW + 2);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(215, 210, 200);
      doc.roundedRect(cx, y, colW, 14, 1.5, 1.5, 'FD');

      doc.setFont('times', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 100, 100);
      doc.text(c.label.toUpperCase(), cx + 3, y + 4);

      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(25, 60, 40);
      doc.text(c.value, cx + 3, y + 8.5);

      doc.setFont('times', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(120, 120, 120);
      doc.text(c.sub, cx + 3, y + 12);
    });
    y += 18;

    // SECTION 1: REKAP SISWA BARU DI WEBSITE
    checkPageOverflow(28);
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    doc.text(`I. REKAPITULASI PENDAFTARAN AKUN SISWA BARU DI WEBSITE (BULAN ${data.monthName.toUpperCase()} ${data.year})`, marginX, y);
    y += 4;

    doc.setFillColor(25, 60, 40);
    doc.rect(marginX, y, contentWidth, 6, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('No', marginX + 3, y + 4.2);
    doc.text('Nama Siswa', marginX + 12, y + 4.2);
    doc.text('Email Akun', marginX + 62, y + 4.2);
    doc.text('NISN', marginX + 115, y + 4.2);
    doc.text('Kelas', marginX + 140, y + 4.2);
    doc.text('Tanggal Daftar', marginX + 160, y + 4.2);
    y += 6;

    if (data.newRegisteredStudents.length === 0) {
      doc.setFillColor(253, 253, 252);
      doc.rect(marginX, y, contentWidth, 7, 'F');
      doc.setDrawColor(220, 220, 220);
      doc.rect(marginX, y, contentWidth, 7, 'S');
      doc.setFont('times', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text('Tidak ada pendaftaran akun siswa baru di website pada bulan ini.', marginX + 5, y + 4.8);
      y += 9;
    } else {
      data.newRegisteredStudents.forEach((st, i) => {
        checkPageOverflow(6.5);
        doc.setFillColor(i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 247);
        doc.rect(marginX, y, contentWidth, 6, 'F');
        doc.setDrawColor(225, 225, 225);
        doc.line(marginX, y + 6, marginX + contentWidth, y + 6);

        doc.setFont('times', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(30, 30, 30);
        doc.text(String(i + 1), marginX + 3, y + 4.2);
        doc.setFont('times', 'bold');
        doc.text(st.name, marginX + 12, y + 4.2);
        doc.setFont('times', 'normal');
        doc.text(st.email, marginX + 62, y + 4.2);
        doc.text(st.nisn || '-', marginX + 115, y + 4.2);
        doc.text(st.class_name || '-', marginX + 140, y + 4.2);
        const dateStr = st.created_at ? st.created_at.split('T')[0] : '-';
        doc.text(dateStr, marginX + 160, y + 4.2);
        y += 6;
      });
      y += 3;
    }

    // SECTION 2: REKAPITULASI PENAMBAHAN ANGGOTA PER EKSTRAKURIKULER
    checkPageOverflow(28);
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    doc.text(`II. REKAPITULASI KEANGGOTAAN SETIAP EKSTRAKURIKULER (BULAN ${data.monthName.toUpperCase()} ${data.year})`, marginX, y);
    y += 4;

    doc.setFillColor(25, 60, 40);
    doc.rect(marginX, y, contentWidth, 6, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('No', marginX + 3, y + 4.2);
    doc.text('Nama Ekstrakurikuler', marginX + 12, y + 4.2);
    doc.text('Kategori', marginX + 60, y + 4.2);
    doc.text('Guru Pembina', marginX + 95, y + 4.2);
    doc.text('Anggota Baru', marginX + 140, y + 4.2);
    doc.text('Total Aktif', marginX + 165, y + 4.2);
    y += 6;

    data.ekskulRecapList.forEach((item, i) => {
      checkPageOverflow(6.5);
      doc.setFillColor(i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 247);
      doc.rect(marginX, y, contentWidth, 6, 'F');
      doc.setDrawColor(225, 225, 225);
      doc.line(marginX, y + 6, marginX + contentWidth, y + 6);

      doc.setFont('times', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 30, 30);
      doc.text(String(i + 1), marginX + 3, y + 4.2);
      doc.setFont('times', 'bold');
      doc.text(item.ekskul.name, marginX + 12, y + 4.2);
      doc.setFont('times', 'normal');
      doc.text(item.ekskul.category, marginX + 60, y + 4.2);
      const safePembina = item.ekskul.supervisor_name.length > 22 ? item.ekskul.supervisor_name.slice(0, 20) + '..' : item.ekskul.supervisor_name;
      doc.text(safePembina, marginX + 95, y + 4.2);

      doc.setFont('times', 'bold');
      doc.setTextColor(item.newMembersCount > 0 ? 25 : 120, item.newMembersCount > 0 ? 60 : 120, item.newMembersCount > 0 ? 40 : 120);
      doc.text(`+${item.newMembersCount} Siswa`, marginX + 142, y + 4.2);

      doc.setFont('times', 'normal');
      doc.setTextColor(30, 30, 30);
      doc.text(`${item.totalActiveMembers} / ${item.capacity}`, marginX + 165, y + 4.2);
      y += 6;
    });
    y += 3;

    // SECTION 3: REKAP PENGGUNAAN FASILITAS
    checkPageOverflow(28);
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    doc.text(`III. LOG PENGGUNAAN SARANA & PRASARANA LATIHAN (BULAN ${data.monthName.toUpperCase()} ${data.year})`, marginX, y);
    y += 4;

    doc.setFillColor(25, 60, 40);
    doc.rect(marginX, y, contentWidth, 6, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('No', marginX + 3, y + 4.2);
    doc.text('Tanggal', marginX + 10, y + 4.2);
    doc.text('Ekskul', marginX + 32, y + 4.2);
    doc.text('Fasilitas / Lokasi', marginX + 60, y + 4.2);
    doc.text('Sesi Latihan', marginX + 115, y + 4.2);
    doc.text('Hadir', marginX + 165, y + 4.2);
    y += 6;

    if (data.facilityUsageSessions.length === 0) {
      doc.setFillColor(253, 253, 252);
      doc.rect(marginX, y, contentWidth, 7, 'F');
      doc.setDrawColor(220, 220, 220);
      doc.rect(marginX, y, contentWidth, 7, 'S');
      doc.setFont('times', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text('Belum ada log penggunaan fasilitas sekolah yang tercatat pada bulan ini.', marginX + 5, y + 4.8);
      y += 9;
    } else {
      data.facilityUsageSessions.forEach((s, i) => {
        checkPageOverflow(6.5);
        doc.setFillColor(i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 247);
        doc.rect(marginX, y, contentWidth, 6, 'F');
        doc.setDrawColor(225, 225, 225);
        doc.line(marginX, y + 6, marginX + contentWidth, y + 6);

        doc.setFont('times', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(30, 30, 30);
        doc.text(String(i + 1), marginX + 3, y + 4.2);
        doc.text(s.session_date, marginX + 10, y + 4.2);
        doc.setFont('times', 'bold');
        doc.text(s.extracurricular_name, marginX + 32, y + 4.2);
        doc.setFont('times', 'normal');
        const safeLoc = s.location.length > 25 ? s.location.slice(0, 23) + '..' : s.location;
        doc.text(safeLoc, marginX + 60, y + 4.2);
        const safeTitle = s.title.length > 26 ? s.title.slice(0, 24) + '..' : s.title;
        doc.text(safeTitle, marginX + 115, y + 4.2);
        doc.text(`${s.present_count || 0} Siswa`, marginX + 165, y + 4.2);
        y += 6;
      });
      y += 3;
    }

    // SECTION 4: REKAP PRESTASI
    checkPageOverflow(26);
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    doc.text(`IV. REKAPITULASI PRESTASI & KEJUARAAN SEKOLAH (BULAN ${data.monthName.toUpperCase()} ${data.year})`, marginX, y);
    y += 4;

    doc.setFillColor(25, 60, 40);
    doc.rect(marginX, y, contentWidth, 6, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('No', marginX + 3, y + 4.2);
    doc.text('Tanggal', marginX + 10, y + 4.2);
    doc.text('Ekskul', marginX + 30, y + 4.2);
    doc.text('Nama Kejuaraan / Kompetisi', marginX + 55, y + 4.2);
    doc.text('Tingkat', marginX + 115, y + 4.2);
    doc.text('Peringkat', marginX + 140, y + 4.2);
    doc.text('Siswa Peraih', marginX + 162, y + 4.2);
    y += 6;

    if (data.achievements.length === 0) {
      doc.setFillColor(253, 253, 252);
      doc.rect(marginX, y, contentWidth, 7, 'F');
      doc.setDrawColor(220, 220, 220);
      doc.rect(marginX, y, contentWidth, 7, 'S');
      doc.setFont('times', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text('Tidak ada rekap medali / kejuaraan baru pada bulan ini.', marginX + 5, y + 4.8);
      y += 9;
    } else {
      data.achievements.forEach((a, i) => {
        checkPageOverflow(6.5);
        doc.setFillColor(i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 247);
        doc.rect(marginX, y, contentWidth, 6, 'F');
        doc.setDrawColor(225, 225, 225);
        doc.line(marginX, y + 6, marginX + contentWidth, y + 6);

        doc.setFont('times', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(30, 30, 30);
        doc.text(String(i + 1), marginX + 3, y + 4.2);
        doc.text(a.achievement_date || '-', marginX + 10, y + 4.2);
        doc.setFont('times', 'bold');
        doc.text(a.extracurricular_name || 'Ekskul', marginX + 30, y + 4.2);
        doc.setFont('times', 'normal');
        const safeComp = a.competition_name.length > 28 ? a.competition_name.slice(0, 26) + '..' : a.competition_name;
        doc.text(safeComp, marginX + 55, y + 4.2);
        doc.text(a.level, marginX + 115, y + 4.2);
        doc.setFont('times', 'bold');
        doc.text(a.rank, marginX + 140, y + 4.2);
        doc.setFont('times', 'normal');
        const safeStudent = a.student_name.length > 15 ? a.student_name.slice(0, 13) + '..' : a.student_name;
        doc.text(safeStudent, marginX + 162, y + 4.2);
        y += 6;
      });
      y += 3;
    }

    // SIGNATURES BLOCK PENGURUS
    checkPageOverflow(42);
    y += 5;
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const sigLeftX = marginX + 5;
    const sigRightX = marginX + 115;

    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);

    doc.text('Mengetahui & Menyetujui,', sigLeftX, y);
    doc.text(`Ciomas, ${dateFormatted}`, sigRightX, y);
    y += 4.5;
    doc.text('Kepala SMK Negeri 1 Ciomas,', sigLeftX, y);
    doc.text('Wakil Kepala Sekolah Bidang Kesiswaan,', sigRightX, y);

    // Official QR Stamp
    try {
      const qrData = `ESKULHUB-REKAP-SEKOLAH-${data.year}-${data.month}`;
      const qrDataUrl = await QRCode.toDataURL(qrData, { margin: 1, width: 80 });
      doc.addImage(qrDataUrl, 'PNG', sigRightX + 16, y + 2, 16, 16);
    } catch {
      // Fallback
    }

    y += 24;
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    doc.text(data.schoolSetting.principal_name || 'Januar Ashari', sigLeftX, y);
    doc.text(data.schoolSetting.vice_principal_student_affairs || 'Jamil Husein', sigRightX, y);
    y += 4;

    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text('NIP. 19710512 199702 1 002', sigLeftX, y);
    doc.text('NIP. 19680320 199403 1 004', sigRightX, y);
  }

  // PASS 2: ADD OFFICIAL FOOTER ON EVERY PAGE
  const totalPages = doc.getNumberOfPages();
  const printTimestamp = new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(215, 215, 215);
    doc.setLineWidth(0.3);
    doc.line(marginX, pageHeight - 12, 195, pageHeight - 12);

    doc.setFont('times', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Dokumen Sah EskulHub SMKN 1 Ciomas • Dicetak pada ${printTimestamp} WIB`,
      marginX,
      pageHeight - 8
    );

    doc.setFont('times', 'normal');
    doc.text(`Halaman ${p} dari ${totalPages}`, 195, pageHeight - 8, { align: 'right' });
  }

  // File naming
  const fileName =
    data.mode === 'pembina'
      ? `Rekap_Bulanan_${data.ekskul.slug}_${data.monthName}_${data.year}.pdf`
      : `Rekap_Bulanan_Kesiswaan_Sekolah_${data.monthName}_${data.year}.pdf`;

  if (mode === 'print') {
    doc.autoPrint();
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
    return;
  }

  if (mode === 'blob') {
    return doc.output('blob');
  }

  doc.save(fileName);
};
