-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 07 Agu 2025 pada 20.45
-- Versi server: 10.4.27-MariaDB
-- Versi PHP: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_bioskop`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_booking`
--

CREATE TABLE `tb_booking` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `showtime_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_booking`
--

INSERT INTO `tb_booking` (`id`, `user_id`, `showtime_id`) VALUES
(5, 2, 11),
(6, 2, 11),
(7, 2, 11),
(8, 2, 11),
(9, 2, 11),
(10, 2, 11);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_booking_seat`
--

CREATE TABLE `tb_booking_seat` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `seat_number` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_booking_seat`
--

INSERT INTO `tb_booking_seat` (`id`, `booking_id`, `seat_number`) VALUES
(1, 5, 'A1'),
(2, 6, 'A2'),
(3, 7, 'B8'),
(4, 8, 'B2'),
(5, 9, 'A3'),
(6, 9, 'A4'),
(7, 10, 'F7'),
(8, 10, 'F8'),
(9, 10, 'F9'),
(10, 10, 'F10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_movie`
--

CREATE TABLE `tb_movie` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `duration_minutes` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_movie`
--

INSERT INTO `tb_movie` (`id`, `title`, `description`, `duration_minutes`) VALUES
(1, 'Spiderman 3', 'loremubcuiveaucaui', 70),
(4, 'Frozen', 'fawfwafawfaw', 60);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_showtime`
--

CREATE TABLE `tb_showtime` (
  `id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `studio_id` int(11) NOT NULL,
  `start_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_showtime`
--

INSERT INTO `tb_showtime` (`id`, `movie_id`, `studio_id`, `start_time`) VALUES
(11, 1, 3, '2025-08-30 00:16:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_studio`
--

CREATE TABLE `tb_studio` (
  `id` int(11) NOT NULL,
  `studio_number` int(10) NOT NULL,
  `seat_capacity` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_studio`
--

INSERT INTO `tb_studio` (`id`, `studio_number`, `seat_capacity`) VALUES
(3, 2, 60);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_user`
--

CREATE TABLE `tb_user` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` enum('admin','user') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_user`
--

INSERT INTO `tb_user` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'user1', 'user1@gmail.com', 'user1', 'user'),
(2, 'user', 'user@gmail.com', 'user', 'user'),
(3, 'admin', 'admin@gmail.com', 'admin', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `tb_booking`
--
ALTER TABLE `tb_booking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `showtime_id` (`showtime_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `tb_booking_seat`
--
ALTER TABLE `tb_booking_seat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indeks untuk tabel `tb_movie`
--
ALTER TABLE `tb_movie`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tb_showtime`
--
ALTER TABLE `tb_showtime`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `studio_id` (`studio_id`);

--
-- Indeks untuk tabel `tb_studio`
--
ALTER TABLE `tb_studio`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `studio_number` (`studio_number`);

--
-- Indeks untuk tabel `tb_user`
--
ALTER TABLE `tb_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `tb_booking`
--
ALTER TABLE `tb_booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `tb_booking_seat`
--
ALTER TABLE `tb_booking_seat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `tb_movie`
--
ALTER TABLE `tb_movie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `tb_showtime`
--
ALTER TABLE `tb_showtime`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `tb_studio`
--
ALTER TABLE `tb_studio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `tb_user`
--
ALTER TABLE `tb_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `tb_booking`
--
ALTER TABLE `tb_booking`
  ADD CONSTRAINT `tb_booking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tb_user` (`id`),
  ADD CONSTRAINT `tb_booking_ibfk_2` FOREIGN KEY (`showtime_id`) REFERENCES `tb_showtime` (`id`),
  ADD CONSTRAINT `tb_booking_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `tb_user` (`id`);

--
-- Ketidakleluasaan untuk tabel `tb_booking_seat`
--
ALTER TABLE `tb_booking_seat`
  ADD CONSTRAINT `tb_booking_seat_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `tb_booking` (`id`);

--
-- Ketidakleluasaan untuk tabel `tb_showtime`
--
ALTER TABLE `tb_showtime`
  ADD CONSTRAINT `tb_showtime_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `tb_movie` (`id`),
  ADD CONSTRAINT `tb_showtime_ibfk_2` FOREIGN KEY (`studio_id`) REFERENCES `tb_studio` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
