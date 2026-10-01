-- Script setup database MySQL untuk aplikasi Antrean Klinik

CREATE DATABASE IF NOT EXISTS klinik;
USE klinik;

CREATE TABLE IF NOT EXISTS antrean_pasien (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  nomor_antrean      VARCHAR(10)  NOT NULL,
  nik                VARCHAR(16)  NOT NULL,
  nama_pasien        VARCHAR(255) NOT NULL,
  nomor_hp           VARCHAR(20)  NOT NULL,
  waktu_pendaftaran  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status             ENUM('Menunggu', 'Dipanggil', 'Sedang Dilayani', 'Selesai') NOT NULL DEFAULT 'Menunggu',
  INDEX idx_waktu_pendaftaran (waktu_pendaftaran DESC),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
