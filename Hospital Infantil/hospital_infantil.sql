-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-12-2025 a las 00:07:18
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hospital_infantil`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hospitales`
--

CREATE TABLE `hospitales` (
  `id` int(11) NOT NULL,
  `nombre_hospital` varchar(100) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `hospitales`
--

INSERT INTO `hospitales` (`id`, `nombre_hospital`, `ciudad`, `telefono`, `fecha_creacion`, `created_at`, `updated_at`) VALUES
(1, 'Hospital Infantil de México Federico Gómez', 'Ciudad de México', '55-5228-9917', '1943-04-30', '2025-12-22 22:43:22', '2025-12-26 04:50:09'),
(2, 'Hospital Shriners para Niños', 'Ciudad de México', '55-5601-7777', '1999-08-20', '2025-12-22 22:43:22', '2025-12-25 07:57:23'),
(3, 'Hospital Civil de Guadalajara', 'Guadalajara', '33-3614-1818', '1794-03-10', '2025-12-22 22:43:22', '2025-12-26 04:59:42'),
(4, 'Hospital Infantil Teletón de Oncología', 'Querétaro', '442-245-0200', '2013-02-14', '2025-12-23 23:35:24', '2025-12-23 23:35:24'),
(5, 'Hospital Ángeles Pedregal', 'Ciudad de México', '55-5528-4444', '1989-11-05', '2025-12-24 00:35:39', '2025-12-24 07:54:22'),
(6, 'Hospital Zambrano Hellion', 'Monterrey', '81-8888-0000', '2013-09-15', '2025-12-24 01:54:30', '2025-12-25 07:58:26'),
(7, 'Hospital del Niño Poblano', 'Puebla', '222-225-8500', '2010-06-18', '2025-12-25 07:58:46', '2025-12-25 07:58:46'),
(8, 'Hospital Infantil de Morelos', 'Cuernavaca', '777-322-0900', '1998-12-03', '2025-12-26 01:23:54', '2025-12-26 01:23:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `edad` int(11) NOT NULL,
  `sexo` enum('Masculino','Femenino') NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `ciudad_origen` varchar(100) NOT NULL,
  `fecha_inscripcion` date NOT NULL,
  `hospital` varchar(100) NOT NULL,
  `nombre_tutor` varchar(150) NOT NULL,
  `telefono_tutor` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado` enum('activo','dado_de_alta','baja') NOT NULL DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `nombre_completo`, `edad`, `sexo`, `fecha_nacimiento`, `ciudad_origen`, `fecha_inscripcion`, `hospital`, `nombre_tutor`, `telefono_tutor`, `created_at`, `updated_at`, `estado`) VALUES
(1, 'Sofía Martínez González', 9, 'Femenino', '2016-05-16', 'Ciudad de México', '2024-01-11', 'Hospital Infantil de México Federico Gómez', 'María González Ruiz', '55-5111-2233', '2025-12-22 22:43:22', '2025-12-26 05:01:21', 'dado_de_alta'),
(2, 'Mateo Hernández López', 6, 'Masculino', '2018-08-22', 'Ciudad de México', '2024-01-12', 'Hospital Shriners para Niños', 'Juan Hernández Mendoza', '55-5222-3344', '2025-12-22 22:43:22', '2025-12-26 00:52:59', 'activo'),
(3, 'Valentina Rodríguez Sánchez', 10, 'Femenino', '2014-07-30', 'Guadalajara', '2024-01-15', 'Hospital Civil de Guadalajara', 'Laura Sánchez Pérez', '33-3222-3344', '2025-12-22 22:43:22', '2025-12-26 00:52:59', 'dado_de_alta'),
(4, 'Diego Ramírez Torres', 12, 'Masculino', '2012-03-14', 'Monterrey', '2024-02-20', 'Hospital Zambrano Hellion', 'Carlos Ramírez García', '81-8999-8888', '2025-12-23 22:45:34', '2025-12-24 04:08:16', 'activo'),
(5, 'Camila Díaz Flores', 5, 'Femenino', '2019-11-05', 'Puebla', '2024-03-10', 'Hospital del Niño Poblano', 'Ana Flores Romero', '222-2111-2233', '2025-12-23 23:51:47', '2025-12-26 00:47:34', 'activo'),
(6, 'Sebastián Morales Cruz', 7, 'Masculino', '2017-09-18', 'Querétaro', '2024-03-25', 'Hospital Infantil Teletón de Oncología', 'Roberto Morales Sánchez', '442-2444-5566', '2025-12-24 01:54:09', '2025-12-26 00:53:24', 'activo'),
(7, 'Isabella Castro Méndez', 9, 'Femenino', '2015-12-08', 'Ciudad de México', '2024-04-05', 'Hospital Ángeles Pedregal', 'Miguel Castro Rodríguez', '55-5333-4455', '2025-12-25 07:35:44', '2025-12-25 07:35:44', 'dado_de_alta'),
(8, 'Leonardo Gutiérrez Ruiz', 4, 'Masculino', '2020-06-25', 'Cuernavaca', '2024-05-15', 'Hospital Infantil de Morelos', 'Fernando Gutiérrez López', '777-3111-2233', '2025-12-25 08:03:12', '2025-12-26 00:55:43', 'activo'),
(9, 'Luna Vargas Herrera', 11, 'Femenino', '2013-04-12', 'Guadalajara', '2024-06-20', 'Hospital Civil de Guadalajara', 'Patricia Herrera Díaz', '33-3444-5566', '2025-12-25 08:15:59', '2025-12-26 00:46:22', 'dado_de_alta'),
(10, 'Emiliano Silva Ortega', 3, 'Masculino', '2021-02-28', 'Ciudad de México', '2024-07-10', 'Hospital Shriners para Niños', 'Gabriela Ortega Martínez', '55-5444-6677', '2025-12-26 01:22:30', '2025-12-26 01:27:10', 'activo'),
(11, 'Ximena Núñez Castillo', 8, 'Femenino', '2016-10-15', 'Monterrey', '2024-08-05', 'Hospital Zambrano Hellion', 'Ricardo Castillo Vargas', '81-8777-9988', '2025-12-26 02:57:40', '2025-12-26 02:57:40', 'activo'),
(12, 'Daniel Ríos Mendoza', 6, 'Masculino', '2018-07-03', 'Puebla', '2024-09-12', 'Hospital del Niño Poblano', 'Claudia Mendoza Ríos', '222-2333-4455', '2025-12-26 02:57:43', '2025-12-26 02:57:43', 'baja'),
(13, 'Valeria Peña Romero', 10, 'Femenino', '2014-01-20', 'Querétaro', '2024-10-18', 'Hospital Infantil Teletón de Oncología', 'Alejandro Romero Peña', '442-2555-6677', '2025-12-26 02:58:28', '2025-12-26 02:58:28', 'activo'),
(14, 'Miguel Ángel Soto García', 5, 'Masculino', '2019-05-30', 'Cuernavaca', '2024-11-22', 'Hospital Infantil de Morelos', 'Carmen García Soto', '777-3222-3344', '2025-12-26 03:30:45', '2025-12-26 03:30:45', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('qrpAZTm1SnToj9pvWarbXFWbnKP1P5glIGXDR2LU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUTRoaW1Za2tWcjFEOGpMN1VwN0R2bEQzeVlFUmRhNm4zV2dqc0xXRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9wYWNpZW50ZXMvcGRmL2luZGl2aWR1YWwvMSI7czo1OiJyb3V0ZSI7czoyNDoicGFjaWVudGVzLnBkZi5pbmRpdmlkdWFsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1766703924);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `hospitales`
--
ALTER TABLE `hospitales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_nombre_hospital` (`nombre_hospital`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hospital` (`hospital`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `hospitales`
--
ALTER TABLE `hospitales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`hospital`) REFERENCES `hospitales` (`nombre_hospital`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
