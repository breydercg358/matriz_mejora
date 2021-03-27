-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-03-2021 a las 02:10:29
-- Versión del servidor: 10.4.18-MariaDB
-- Versión de PHP: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `matriz_prueba`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_areas`
--

CREATE TABLE `tbl_areas` (
  `id_area` int(11) NOT NULL,
  `nombre_area` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `id_sede` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_estados`
--

CREATE TABLE `tbl_estados` (
  `id_estado` int(11) NOT NULL,
  `nombre_estado` varchar(50) NOT NULL,
  `color_estado` varchar(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_factores`
--

CREATE TABLE `tbl_factores` (
  `id_factor` int(11) NOT NULL,
  `nombre_factor` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_fuentes`
--

CREATE TABLE `tbl_fuentes` (
  `id_fuente` int(11) NOT NULL,
  `nombre_fuente` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_hallazgos`
--

CREATE TABLE `tbl_hallazgos` (
  `id_hallazgo` int(11) NOT NULL,
  `nombre_hallazgo` varchar(100) NOT NULL,
  `nombre_persona` varchar(100) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_ejecucion` timestamp NOT NULL DEFAULT current_timestamp(),
  `sede` varchar(100) NOT NULL,
  `area` varchar(100) NOT NULL,
  `lugar_hallazgo` varchar(150) DEFAULT '',
  `responsable` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `tipo_hallazgo` varchar(50) NOT NULL,
  `fuente` varchar(50) NOT NULL,
  `factor_riesgo` varchar(50) NOT NULL,
  `prioridad` varchar(50) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `plan_sugerido` text NOT NULL,
  `otras_observaciones` text DEFAULT '',
  `registro_fotografico` blob DEFAULT '',
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_images`
--

CREATE TABLE `tbl_images` (
  `id_imagen` int(11) NOT NULL,
  `nombre_img` varchar(255) NOT NULL DEFAULT '',
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_hallazgo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_prioridades`
--

CREATE TABLE `tbl_prioridades` (
  `id_prioridad` int(11) NOT NULL,
  `nombre_prioridad` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_responsables`
--

CREATE TABLE `tbl_responsables` (
  `id_responsable` int(11) NOT NULL,
  `nombre_responsable` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_sedes`
--

CREATE TABLE `tbl_sedes` (
  `id_sede` int(11) NOT NULL,
  `nombre_sede` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_tipos_hallazgo`
--

CREATE TABLE `tbl_tipos_hallazgo` (
  `id_tipo` int(11) NOT NULL,
  `nombre_tipo` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_usuarios`
--

CREATE TABLE `tbl_usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre_persona` varchar(100) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `rol` varchar(30) NOT NULL,
  `planes_creados` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `ultimo_login` timestamp NULL DEFAULT NULL,
  `password` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tbl_areas`
--
ALTER TABLE `tbl_areas`
  ADD PRIMARY KEY (`id_area`),
  ADD KEY `fk_sede` (`id_sede`);

--
-- Indices de la tabla `tbl_estados`
--
ALTER TABLE `tbl_estados`
  ADD PRIMARY KEY (`id_estado`);

--
-- Indices de la tabla `tbl_factores`
--
ALTER TABLE `tbl_factores`
  ADD PRIMARY KEY (`id_factor`);

--
-- Indices de la tabla `tbl_fuentes`
--
ALTER TABLE `tbl_fuentes`
  ADD PRIMARY KEY (`id_fuente`);

--
-- Indices de la tabla `tbl_hallazgos`
--
ALTER TABLE `tbl_hallazgos`
  ADD PRIMARY KEY (`id_hallazgo`),
  ADD KEY `fk_hallazgo` (`id_usuario`);

--
-- Indices de la tabla `tbl_images`
--
ALTER TABLE `tbl_images`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `id_hallazgo` (`id_hallazgo`);

--
-- Indices de la tabla `tbl_prioridades`
--
ALTER TABLE `tbl_prioridades`
  ADD PRIMARY KEY (`id_prioridad`);

--
-- Indices de la tabla `tbl_responsables`
--
ALTER TABLE `tbl_responsables`
  ADD PRIMARY KEY (`id_responsable`);

--
-- Indices de la tabla `tbl_sedes`
--
ALTER TABLE `tbl_sedes`
  ADD PRIMARY KEY (`id_sede`);

--
-- Indices de la tabla `tbl_tipos_hallazgo`
--
ALTER TABLE `tbl_tipos_hallazgo`
  ADD PRIMARY KEY (`id_tipo`);

--
-- Indices de la tabla `tbl_usuarios`
--
ALTER TABLE `tbl_usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tbl_areas`
--
ALTER TABLE `tbl_areas`
  MODIFY `id_area` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbl_estados`
--
ALTER TABLE `tbl_estados`
  MODIFY `id_estado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbl_factores`
--
ALTER TABLE `tbl_factores`
  MODIFY `id_factor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbl_fuentes`
--
ALTER TABLE `tbl_fuentes`
  MODIFY `id_fuente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbl_hallazgos`
--
ALTER TABLE `tbl_hallazgos`
  MODIFY `id_hallazgo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbl_images`
--
ALTER TABLE `tbl_images`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbl_prioridades`
--
ALTER TABLE `tbl_prioridades`
  MODIFY `id_prioridad` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbl_responsables`
--
ALTER TABLE `tbl_responsables`
  MODIFY `id_responsable` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbl_sedes`
--
ALTER TABLE `tbl_sedes`
  MODIFY `id_sede` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbl_tipos_hallazgo`
--
ALTER TABLE `tbl_tipos_hallazgo`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbl_usuarios`
--
ALTER TABLE `tbl_usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tbl_areas`
--
ALTER TABLE `tbl_areas`
  ADD CONSTRAINT `fk_sede` FOREIGN KEY (`id_sede`) REFERENCES `tbl_sedes` (`id_sede`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tbl_hallazgos`
--
ALTER TABLE `tbl_hallazgos`
  ADD CONSTRAINT `fk_hallazgo` FOREIGN KEY (`id_usuario`) REFERENCES `tbl_usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tbl_images`
--
ALTER TABLE `tbl_images`
  ADD CONSTRAINT `tbl_images_ibfk_1` FOREIGN KEY (`id_hallazgo`) REFERENCES `tbl_hallazgos` (`id_hallazgo`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
