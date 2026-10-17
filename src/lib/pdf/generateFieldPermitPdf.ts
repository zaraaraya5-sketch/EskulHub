import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { SchoolEvent, SchoolSetting, Extracurricular } from '@/types';

export interface FieldPermitData {
  event: SchoolEvent;
  ekskul?: Extracurricular | null;
  schoolSetting: SchoolSetting;
  permitNumber?: string;
  issueDate?: string;
}

export const generateFieldPermitNumber = (eventId: string): string => {
  const cleanId = eventId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || '084';
  const year = new Date().getFullYear();
  return `421.5/EKH-IZIN/${year}/X/${cleanId}`;
};

export const generateFieldPermitPdf = async (
  data: FieldPermitData,
  mode: 'save' | 'print' | 'blob' = 'save'
): Promise<Blob | void> => {
  const { event, ekskul, schoolSetting } = data;
  const permitNumber = data.permitNumber || generateFieldPermitNumber(event.id);
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

  // A4 size: 210mm x 297mm
  const pageWidth = 210;

  // 1. KOP SURAT RESMI SEKOLAH
  // Header Logo / Lines
  doc.setDrawColor(35, 75, 54); // Deep Forest Green (#234B36)
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
  doc.setTextColor(35, 75, 54);
  doc.text(schoolSetting.school_name.toUpperCase(), pageWidth / 2, 28.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(104, 101, 95);
  doc.text(`${schoolSetting.address} | NPSN: ${schoolSetting.npsn}`, pageWidth / 2, 32.5, { align: 'center' });

  // 2. JUDUL SURAT
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(23, 23, 23);
  doc.text('SURAT IZIN PENGGUNAAN FASILITAS & LAPANGAN SEKOLAH', pageWidth / 2, 44, { align: 'center' });

  // Underline Judul
  doc.setDrawColor(23, 23, 23);
  doc.setLineWidth(0.3);
  doc.line(30, 45, 180, 45);

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
  doc.text('1. Koordinator Sarana, Prasarana & Lapangan Olahraga', 15, y);
  y += 4.5;
  doc.text('2. Petugas Keamanan & Ketertiban Lingkungan Sekolah', 15, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.text(`di Kampus ${schoolSetting.school_name}`, 15, y);

  // 4. PARAGRAF PEMBUKA
  y += 8;
  const openingText = `Berdasarkan Program Kerja Pembinaan Kesiswaan dan Kalender Kegiatan Ekstrakurikuler SMKN 1 Ciomas Tahun Pelajaran ${schoolSetting.academic_year}, pihak Kesiswaan memberikan izin resmi pemakaian sarana / lapangan sekolah kepada ekstrakurikuler di bawah ini:`;
  const splitOpening = doc.splitTextToSize(openingText, 180);
  doc.text(splitOpening, 15, y);
  y += splitOpening.length * 4.5 + 4;

  // 5. RINCIAN PENGGUNAAN LAPANGAN (BOX RECTANGLE)
  const ekskulName = ekskul?.name || event.extracurricular_name || 'Ekstrakurikuler SMKN 1 Ciomas';
  const supervisorName = ekskul?.supervisor_name || event.organizer || 'Hendra Wijaya, S.Pd.';
  const location = event.location || 'Lapangan Olahraga Utama SMKN 1 Ciomas';
  const rawStart = event.start_time || event.start_datetime || '';
  const rawEnd = event.end_time || event.end_datetime || '';
  
  // Format Date & Time
  let scheduleDate = 'Sesuai Jadwal Resmi';
  let scheduleTime = '15:30 - 17:30 WIB';
  if (rawStart) {
    try {
      const d = new Date(rawStart.replace(' ', 'T'));
      if (!isNaN(d.getTime())) {
        scheduleDate = d.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        const startTimeStr = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        let endTimeStr = '';
        if (rawEnd) {
          const dEnd = new Date(rawEnd.replace(' ', 'T'));
          if (!isNaN(dEnd.getTime())) {
            endTimeStr = dEnd.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          }
        }
        scheduleTime = endTimeStr ? `${startTimeStr} - ${endTimeStr} WIB` : `${startTimeStr} WIB - Selesai`;
      }
    } catch {
      // Fallback
    }
  }

  const boxY = y;
  const boxHeight = 52;
  doc.setFillColor(248, 250, 248);
  doc.setDrawColor(210, 225, 215);
  doc.roundedRect(15, boxY, 180, boxHeight, 2, 2, 'FD');

  const labelX = 20;
  const valX = 75;
  let rowY = boxY + 7;

  const renderRow = (label: string, value: string, boldVal: boolean = false) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(label, labelX, rowY);
    doc.text(':', labelX + 50, rowY);
    doc.setFont('helvetica', boldVal ? 'bold' : 'normal');
    doc.setTextColor(23, 23, 23);
    doc.text(value, valX, rowY);
    rowY += 6.5;
  };

  renderRow('Ekstrakurikuler', ekskulName, true);
  renderRow('Agenda / Kegiatan', event.title);
  renderRow('Fasilitas / Lapangan', location, true);
  renderRow('Hari & Tanggal', scheduleDate);
  renderRow('Waktu / Jam Penggunaan', scheduleTime, true);
  renderRow('Penanggung Jawab / Pembina', supervisorName);
  renderRow('Status Penggunaan', 'DISETUJUI & TERJADWAL RESMI', true);

  y = boxY + boxHeight + 8;

  // 6. KETENTUAN PENGGUNAAN
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(23, 23, 23);
  doc.text('Ketentuan & Tata Tertib Penggunaan:', 15, y);
  y += 5;

  const rules = [
    '1. Penggunaan lapangan wajib didampingi atau dalam pengawasan Pembina Ekstrakurikuler / Pengurus.',
    '2. Seluruh peserta wajib menjaga kebersihan, ketertiban fasilitas, dan membuang sampah pada tempatnya.',
    '3. Penggunaan lapangan diakhiri tepat waktu sesuai batas jam yang tertera pada surat izin ini.',
    '4. Peralatan inventaris sekolah yang dipinjam wajib dirapikan dan dikembalikan ke tempat penyimpanan semula.',
    '5. Surat izin ini sah sebagai bukti pemakaian fasilitas resmi dan dapat ditunjukkan saat verifikasi petugas piket/keamanan.'
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(60, 60, 60);
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
  const qrUrl = `${window.location.origin}/calendar?event=${event.id}&permit=${permitNumber}`;
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      margin: 1,
      width: 150,
      color: {
        dark: '#171717',
        light: '#FFFFFF',
      },
    });
    // Place QR code between signatures
    doc.addImage(qrCodeDataUrl, 'PNG', 88, signY + 2, 24, 24);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(110, 110, 110);
    doc.text('Scan Keabsahan', 100, signY + 28, { align: 'center' });
  } catch {
    // If QR code generation fails, proceed cleanly
  }

  // Stempel Digital
  doc.setDrawColor(35, 75, 54);
  doc.setLineWidth(0.6);
  doc.roundedRect(122, signY + 7, 50, 16, 2, 2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(35, 75, 54);
  doc.text('TERVERIFIKASI RESMI', 147, signY + 13, { align: 'center' });
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
  doc.text(schoolSetting.vice_principal_student_affairs || 'Drs. Bambang Suryono', 125, bottomSignY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('NIP. 19680320 199403 1 004', 125, bottomSignY + 4);

  // Footer Note
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.3);
  doc.line(15, 283, 195, 283);
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text(`EskulHub SMKN 1 Ciomas — Dokumen Resmi Izin Sarana & Prasarana • Dicetak pada ${now.toLocaleString('id-ID')}`, 15, 287);

  // Return mode
  if (mode === 'blob') {
    return doc.output('blob');
  } else if (mode === 'print') {
    doc.autoPrint();
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
  } else {
    const filenameSafe = ekskulName.replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`Surat_Izin_Lapangan_${filenameSafe}_${event.id}.pdf`);
  }
};
