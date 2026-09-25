import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { PortfolioVerification, SchoolSetting } from '@/types';

export const generatePortfolioPdf = async (
  verification: PortfolioVerification,
  schoolSetting: SchoolSetting
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Generate QR Code as DataURL
  const verifyUrl = `${window.location.origin}/verify/${verification.verification_id}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 200,
    color: {
      dark: '#171717',
      light: '#FFFFFF',
    },
  });

  // Page 1 Setup (A4 is 210mm x 297mm)
  // Header: Kop Resmi Sekolah
  doc.setDrawColor(35, 75, 54); // #234B36 Deep Forest
  doc.setLineWidth(1.2);
  doc.line(15, 34, 195, 34);
  doc.setLineWidth(0.4);
  doc.line(15, 35.5, 195, 35.5);

  // School identity
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(23, 23, 23);
  doc.text('PEMERINTAH DAERAH PROVINSI JAWA BARAT', 105, 15, { align: 'center' });
  doc.text('DINAS PENDIDIKAN & KEBUDAYAAN', 105, 20, { align: 'center' });
  
  doc.setFontSize(15);
  doc.setTextColor(35, 75, 54);
  doc.text(schoolSetting.school_name.toUpperCase(), 105, 26, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(104, 101, 95);
  doc.text(`${schoolSetting.address} | NPSN: ${schoolSetting.npsn}`, 105, 30.5, { align: 'center' });

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(23, 23, 23);
  doc.text('PORTOFOLIO RESMI KEGIATAN NON-AKADEMIK & EKSTRAKURIKULER', 105, 43, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(104, 101, 95);
  doc.text(`Nomor Verifikasi Institusional: ${verification.verification_id}`, 105, 48, { align: 'center' });

  // Student Identity Box
  doc.setDrawColor(216, 212, 204);
  doc.setFillColor(245, 242, 234);
  doc.rect(15, 53, 180, 28, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(35, 75, 54);
  doc.text('IDENTITAS SISWA TERDAFTAR', 20, 59);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(23, 23, 23);
  doc.text('Nama Lengkap', 20, 65);
  doc.text(`: ${verification.student_name}`, 55, 65);

  doc.text('Nomor Induk Siswa (NISN)', 20, 70);
  doc.text(`: ${verification.student_nisn}`, 55, 70);

  doc.text('Tingkat / Kelas', 20, 75);
  doc.text(`: ${verification.student_class}`, 55, 75);

  doc.text('Tahun Ajaran', 120, 65);
  doc.text(`: ${verification.academic_year}`, 150, 65);

  doc.text('Status Portofolio', 120, 70);
  doc.text(`: RESMI TERVERIFIKASI`, 150, 70);

  doc.text('Tingkat Kehadiran', 120, 75);
  doc.text(`: ${verification.summary_data.total_attendance_rate}`, 150, 75);

  let currentY = 88;

  // Section 1: Riwayat Ekstrakurikuler
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(35, 75, 54);
  doc.text('I. RIWAYAT KEANGGOTAAN EKSTRAKURIKULER & ORGANISASI', 15, currentY);
  currentY += 4;

  // Table header
  doc.setFillColor(235, 232, 224);
  doc.rect(15, currentY, 180, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(23, 23, 23);
  doc.text('NO', 18, currentY + 4.8);
  doc.text('NAMA KEGIATAN EKSTRAKURIKULER', 30, currentY + 4.8);
  doc.text('PERAN / JABATAN', 115, currentY + 4.8);
  doc.text('PERIODE', 165, currentY + 4.8);
  currentY += 7;

  // Rows
  doc.setFont('helvetica', 'normal');
  verification.summary_data.ekskul_list.forEach((item, idx) => {
    doc.text(`${idx + 1}.`, 18, currentY + 4.8);
    doc.text(item.name, 30, currentY + 4.8);
    doc.text(item.role, 115, currentY + 4.8);
    doc.text(item.period, 165, currentY + 4.8);
    doc.setDrawColor(216, 212, 204);
    doc.setLineWidth(0.2);
    doc.line(15, currentY + 6.5, 195, currentY + 6.5);
    currentY += 6.5;
  });

  currentY += 6;

  // Section 2: Prestasi & Penghargaan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(35, 75, 54);
  doc.text('II. DAFTAR PRESTASI & PENGHARGAAN RESMI (TERVERIFIKASI)', 15, currentY);
  currentY += 4;

  doc.setFillColor(235, 232, 224);
  doc.rect(15, currentY, 180, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(23, 23, 23);
  doc.text('NO', 18, currentY + 4.8);
  doc.text('NAMA KEJUARAAN / KOMPETISI', 30, currentY + 4.8);
  doc.text('TINGKAT', 120, currentY + 4.8);
  doc.text('PREDIKAT', 150, currentY + 4.8);
  doc.text('TAHUN', 178, currentY + 4.8);
  currentY += 7;

  doc.setFont('helvetica', 'normal');
  verification.summary_data.achievements.forEach((ach, idx) => {
    doc.text(`${idx + 1}.`, 18, currentY + 4.8);
    doc.text(ach.title.length > 50 ? ach.title.substring(0, 48) + '...' : ach.title, 30, currentY + 4.8);
    doc.text(ach.level, 120, currentY + 4.8);
    doc.text(ach.rank, 150, currentY + 4.8);
    doc.text(ach.year, 178, currentY + 4.8);
    doc.setDrawColor(216, 212, 204);
    doc.setLineWidth(0.2);
    doc.line(15, currentY + 6.5, 195, currentY + 6.5);
    currentY += 6.5;
  });

  currentY += 6;

  // Section 3: Kepanitiaan & Kontribusi
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(35, 75, 54);
  doc.text('III. KEPANITIAAN & PARTISIPASI KEGIATAN SEKOLAH', 15, currentY);
  currentY += 4;

  doc.setFillColor(235, 232, 224);
  doc.rect(15, currentY, 180, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(23, 23, 23);
  doc.text('NO', 18, currentY + 4.8);
  doc.text('NAMA KEGIATAN / ACARA', 30, currentY + 4.8);
  doc.text('PERAN KEPANITIAAN', 120, currentY + 4.8);
  doc.text('TAHUN', 178, currentY + 4.8);
  currentY += 7;

  doc.setFont('helvetica', 'normal');
  verification.summary_data.committee_roles.forEach((com, idx) => {
    doc.text(`${idx + 1}.`, 18, currentY + 4.8);
    doc.text(com.title, 30, currentY + 4.8);
    doc.text(com.role, 120, currentY + 4.8);
    doc.text(com.year, 178, currentY + 4.8);
    doc.setDrawColor(216, 212, 204);
    doc.setLineWidth(0.2);
    doc.line(15, currentY + 6.5, 195, currentY + 6.5);
    currentY += 6.5;
  });

  // Footer / Authorization & QR Verification Section
  const footerY = 228;
  doc.setDrawColor(216, 212, 204);
  doc.setLineWidth(0.3);
  doc.line(15, footerY, 195, footerY);

  // Embed QR Code
  doc.addImage(qrCodeDataUrl, 'PNG', 18, footerY + 5, 26, 26);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(35, 75, 54);
  doc.text('KODE VERIFIKASI DIGITAL QR', 48, footerY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(104, 101, 95);
  doc.text('Pindai QR code ini untuk memverifikasi keaslian portofolio siswa', 48, footerY + 15);
  doc.text(`di laman resmi: ${window.location.origin}/verify/${verification.verification_id}`, 48, footerY + 19);
  doc.text(`Tanggal Pengesahan Dokumen: ${verification.issue_date}`, 48, footerY + 23);
  doc.text(`Status: SAH & TERCATAT PADA DATABASE PUSAT SEKOLAH`, 48, footerY + 27);

  // Signature Block
  const sigX = 140;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(23, 23, 23);
  doc.text('Bandung, ' + verification.issue_date, sigX, footerY + 6);
  doc.text('Wakil Kepala Sekolah Bidang Kesiswaan,', sigX, footerY + 10.5);

  doc.setFont('helvetica', 'bold');
  doc.text(schoolSetting.vice_principal_student_affairs, sigX, footerY + 28);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('NIP. 19780614 200212 1 003', sigX, footerY + 31.5);

  // Save the PDF
  const filename = `Portofolio_${verification.student_name.replace(/\s+/g, '_')}_${verification.verification_id}.pdf`;
  doc.save(filename);
};
