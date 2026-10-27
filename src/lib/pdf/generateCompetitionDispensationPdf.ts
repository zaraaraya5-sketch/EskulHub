import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { SchoolEvent, SchoolSetting, Extracurricular } from '@/types';

export interface CompetitionDispensationData {
  event: SchoolEvent;
  ekskul?: Extracurricular | null;
  schoolSetting: SchoolSetting;
  permitNumber?: string;
  issueDate?: string;
}

export const generateDispensationNumber = (eventId: string): string => {
  const cleanId = eventId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || '102';
  const year = new Date().getFullYear();
  return `421.5/EKH-DISP/${year}/X/${cleanId}`;
};

export const generateCompetitionDispensationPdf = async (
  data: CompetitionDispensationData,
  mode: 'save' | 'print' | 'blob' = 'save'
): Promise<Blob | void> => {
  const { event, ekskul, schoolSetting } = data;
  const permitNumber = data.permitNumber || generateDispensationNumber(event.id);
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;

  // 1. KOP SURAT RESMI SEKOLAH
  doc.setDrawColor(163, 61, 53); // Deep Crimson Red for Competition (#A33D35)
  doc.setLineWidth(1.2);
  doc.line(15, 34, 195, 34);
  doc.setLineWidth(0.4);
  doc.line(15, 35.5, 195, 35.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(23, 23, 23);
  doc.text('PEMERINTAH DAERAH PROVINSI JAWA BARAT', pageWidth / 2, 14, { align: 'center' });
  doc.setFontSize(11);
  doc.text('DINAS PENDIDIKAN & KEBUDAYAAN', pageWidth / 2, 19, { align: 'center' });
  doc.setFontSize(10);
  doc.text('CABANG DINAS PENDIDIKAN WILAYAH I KABUPATEN BOGOR', pageWidth / 2, 23.5, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(163, 61, 53);
  doc.text(schoolSetting.school_name.toUpperCase(), pageWidth / 2, 28.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(104, 101, 95);
  doc.text(`${schoolSetting.address} | NPSN: ${schoolSetting.npsn}`, pageWidth / 2, 32.5, { align: 'center' });

  // 2. JUDUL SURAT DISPENSASI
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(23, 23, 23);
  doc.text('SURAT KETERANGAN DISPENSASI & TUGAS PERLOMBAAN', pageWidth / 2, 44, { align: 'center' });

  doc.setDrawColor(23, 23, 23);
  doc.setLineWidth(0.3);
  doc.line(25, 45, 185, 45);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text(`Nomor: ${permitNumber}`, pageWidth / 2, 49.5, { align: 'center' });

  // 3. TUJUAN SURAT
  let y = 57;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 30, 30);
  doc.text('Kepada Yth.', 15, y);
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('1. Bapak / Ibu Guru Mata Pelajaran', 15, y);
  y += 4.5;
  doc.text('2. Bapak / Ibu Wali Kelas Siswa Terkait', 15, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.text(`di Tempat / Lingkungan Kampus ${schoolSetting.school_name}`, 15, y);

  // 4. PARAGRAF PEMBUKA
  y += 8;
  const openingText = `Sehubungan dengan keikutsertaan delegasi peserta didik dalam agenda kompetisi / kejuaraan untuk membawa dan mengharumkan nama baik ${schoolSetting.school_name}, pihak Bidang Kesiswaan memberikan dispensasi resmi meninggalkan kegiatan belajar mengajar (KBM) kepada tim ekstrakurikuler berikut:`;
  const splitOpening = doc.splitTextToSize(openingText, 180);
  doc.text(splitOpening, 15, y);
  y += splitOpening.length * 4.5 + 4;

  // 5. BOX DETAIL KOMPETISI & DISPENSASI
  const boxTop = y;
  doc.setFillColor(254, 248, 246); // Soft warm tint (#FEF8F6)
  doc.setDrawColor(242, 201, 192); // Border (#F2C9C0)
  doc.roundedRect(15, boxTop, 180, 52, 2, 2, 'FD');

  const ekskulName = ekskul?.name || event.extracurricular_name || 'Ekstrakurikuler SMKN 1 Ciomas';
  const supervisorName = ekskul?.supervisor_name || 'Pembina Terdaftar';

  // Format Date & Time
  const rawStart = event.start_time || event.start_datetime || '';
  const rawEnd = event.end_time || event.end_datetime || '';
  let scheduleStr = 'Sesuai Jadwal Pelaksanaan Lomba';
  let dateFormattedStr = dateFormatted;

  if (rawStart) {
    const sDate = new Date(rawStart);
    dateFormattedStr = sDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const sTime = sDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    if (rawEnd) {
      const eDate = new Date(rawEnd);
      const eTime = eDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
      scheduleStr = `${sTime} s.d. ${eTime} WIB`;
    } else {
      scheduleStr = `${sTime} WIB s.d. Selesai`;
    }
  }

  const details = [
    { label: 'Cabang Ekstrakurikuler', val: ekskulName },
    { label: 'Nama Kegiatan / Lomba', val: event.title },
    { label: 'Pembina Pendamping', val: supervisorName },
    { label: 'Hari & Tanggal Lomba', val: dateFormattedStr },
    { label: 'Durasi / Waktu Dispensasi', val: scheduleStr },
    { label: 'Lokasi / Venue Lomba', val: event.location || 'Lokasi Kegiatan Ditentukan Panitia' },
  ];

  let detailY = boxTop + 6;
  doc.setFontSize(9);
  details.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(item.label, 19, detailY);
    doc.text(':', 67, detailY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(23, 23, 23);
    const splitVal = doc.splitTextToSize(item.val, 120);
    doc.text(splitVal[0], 70, detailY);
    detailY += 7.5;
  });

  y = boxTop + 56;

  // 6. KETENTUAN DISPENSASI KBM
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(23, 23, 23);
  doc.text('Petunjuk & Ketentuan Dispensasi Akademik:', 15, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);

  const rules = [
    '1. Peserta didik yang terdaftar dalam surat ini dinyatakan HADIR DISPENSASI (bukan alpa/absen).',
    '2. Guru mata pelajaran dimohon memberikan izin serta hak pembelajaran/tugas susulan kepada peserta.',
    '3. Peserta didik berkewajiban menyelesaikan tugas akademik yang tertinggal setelah kompetisi selesai.',
    '4. Seluruh delegasi wajib menjunjung tinggi sportivitas, etika pelajar, dan nama baik SMKN 1 Ciomas.',
  ];

  rules.forEach((rule) => {
    doc.text(rule, 17, y);
    y += 4.5;
  });

  // 7. TANDA TANGAN & PENGESAHAN
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(`Ditetapkan di: Ciomas, Kab. Bogor`, 130, y);
  y += 4.5;
  doc.text(`Pada tanggal: ${dateFormatted}`, 130, y);

  y += 6;
  const signY = y;

  // Kolom Kiri: Pembina
  doc.setFont('helvetica', 'bold');
  doc.text('Pembina Ekstrakurikuler,', 25, signY);

  // Kolom Kanan: Kesiswaan
  doc.text('Wakil Kepala Sekolah Bidang Kesiswaan,', 125, signY);

  // Generate QR Code as DataURL for digital verification
  const qrUrl = `${window.location.origin}/calendar?event=${event.id}&dispensation=${permitNumber}`;
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      margin: 1,
      width: 150,
      color: {
        dark: '#171717',
        light: '#FFFFFF',
      },
    });
    doc.addImage(qrCodeDataUrl, 'PNG', 88, signY + 2, 24, 24);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(110, 110, 110);
    doc.text('Scan Keabsahan', 100, signY + 28, { align: 'center' });
  } catch {
    // Graceful fallback if QR code generation fails
  }

  // Stempel Digital Kesiswaan
  doc.setDrawColor(163, 61, 53);
  doc.setLineWidth(0.6);
  doc.roundedRect(122, signY + 7, 50, 16, 2, 2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(163, 61, 53);
  doc.text('DISPENSASI RESMI', 147, signY + 13, { align: 'center' });
  doc.setFontSize(6.5);
  doc.text('KESISWAAN SMKN 1 CIOMAS', 147, signY + 18, { align: 'center' });

  // Nama Penandatangan Bawah
  const bottomSignY = signY + 34;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(23, 23, 23);
  doc.text(supervisorName, 25, bottomSignY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('NIP. 19820415 200801 1 007', 25, bottomSignY + 4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(schoolSetting.vice_principal_student_affairs || 'Jamil Husein', 125, bottomSignY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('NIP. 19680320 199403 1 004', 125, bottomSignY + 4);

  // Footer Note
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.3);
  doc.line(15, 283, 195, 283);
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text(`EskulHub SMKN 1 Ciomas — Surat Keterangan Dispensasi & Delegasi Lomba • Dicetak pada ${now.toLocaleString('id-ID')}`, 15, 287);

  // Return mode
  if (mode === 'blob') {
    return doc.output('blob');
  } else if (mode === 'print') {
    doc.autoPrint();
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
  } else {
    const filenameSafe = ekskulName.replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`Surat_Dispensasi_Lomba_${filenameSafe}_${event.id}.pdf`);
  }
};
