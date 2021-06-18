CREATE DATABASE matriz_prueba;

USE matriz_prueba;

CREATE TABLE tbl_usuarios(
    id_usuario int(11) NOT NULL AUTO_INCREMENT,
    nombre_persona varchar(100) NOT NULL,
    nombre_usuario varchar(50) NOT NULL,
    rol varchar(30) NOT NULL,
    planes_creados int(11) DEFAULT 0,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NULL,
    ultimo_login timestamp NULL,
    password varchar(60) NOT NULL,
    PRIMARY KEY (id_usuario)
);

CREATE TABLE tbl_sedes(
    id_sede int(11) NOT NULL AUTO_INCREMENT,
    nombre_sede varchar(100) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NULL,
    PRIMARY KEY (id_sede)
);

CREATE TABLE tbl_areas(
    id_area int(11) NOT NULL AUTO_INCREMENT,
    nombre_area varchar(100) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NULL,
    id_sede int(11),
    CONSTRAINT fk_sede FOREIGN KEY(id_sede) REFERENCES tbl_sedes(id_sede) ON DELETE CASCADE,
    PRIMARY KEY (id_area)
);

CREATE TABLE tbl_estados(
    id_estado int(11) NOT NULL AUTO_INCREMENT,
    nombre_estado varchar(50) NOT NULL,
    color_estado varchar(10) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NULL,
    PRIMARY KEY (id_estado)
);

CREATE TABLE tbl_factores(
    id_factor int(11) NOT NULL AUTO_INCREMENT,
    nombre_factor varchar(50) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NULL,
    PRIMARY KEY (id_factor)
);

CREATE TABLE tbl_fuentes(
    id_fuente int(11) NOT NULL AUTO_INCREMENT,
    nombre_fuente varchar(50) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NULL,
    PRIMARY KEY (id_fuente)
);

CREATE TABLE tbl_prioridades(
    id_prioridad int(11) NOT NULL AUTO_INCREMENT,
    nombre_prioridad varchar(50) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NULL,
    PRIMARY KEY (id_prioridad)
);

CREATE TABLE tbl_tipos_hallazgo(
    id_tipo int(11) NOT NULL AUTO_INCREMENT,
    nombre_tipo varchar(50) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NULL,
    PRIMARY KEY (id_tipo)
);

CREATE TABLE tbl_hallazgos(
    id_hallazgo int(11) NOT NULL AUTO_INCREMENT,
    nombre_hallazgo varchar(100) NOT NULL,
    nombre_persona varchar(100) NOT NULL,
    nombre_usuario varchar(50) NOT NULL,
    fecha timestamp DEFAULT NOW(),
    fecha_ejecucion timestamp DEFAULT NOW(),
    fecha_final timestamp NULL,
    sede varchar(100) NOT NULL,
    area varchar(100) NOT NULL,
    lugar_hallazgo varchar(150) DEFAULT '',
    responsable varchar(100) NOT NULL,
    descripcion text NOT NULL,
    tipo_hallazgo varchar(50) NOT NULL,
    fuente varchar(50) NOT NULL,
    factor_riesgo varchar(50) NOT NULL,
    prioridad varchar(50) NOT NULL,
    estado varchar(50) NOT NULL,
    plan_sugerido text NOT NULL,
    otras_observaciones text DEFAULT '',
    registro_fotografico blob DEFAULT '',
    id_usuario int,
    CONSTRAINT fk_hallazgo FOREIGN KEY(id_usuario) REFERENCES tbl_usuarios(id_usuario) ON DELETE CASCADE,
    PRIMARY KEY (id_hallazgo)
);

CREATE TABLE tbl_images(
    id_imagen int(11) NOT NULL AUTO_INCREMENT,
    nombre_img varchar(255) NOT NULL DEFAULT '',
    uploaded_at timestamp NOT NULL DEFAULT NOW(),
    id_hallazgo int,
    PRIMARY KEY(id_imagen),
    CONSTRAINT FOREIGN KEY(id_hallazgo) REFERENCES tbl_hallazgos(id_hallazgo) ON DELETE CASCADE
);

CREATE TABLE tbl_responsables(
    id_responsable int(11) NOT NULL AUTO_INCREMENT,
    nombre_responsable varchar(100) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NULL,
    PRIMARY KEY (id_responsable)
); 

CREATE TABLE tbl_historial_estado(
    id_cambio_estado int(11) NOT NULL AUTO_INCREMENT,
    nombre_hallazgo varchar(100) NOT NULL DEFAULT '',
    nuevo_estado varchar(50) NOT NULL DEFAULT '',
    razon_cambio text NOT NULL DEFAULT '',
    fecha_cambio timestamp NOT NULL DEFAULT NOW(),
    id_usuario int,
    PRIMARY KEY (id_cambio_estado),
    CONSTRAINT fk_usuario FOREIGN KEY(id_usuario) REFERENCES tbl_usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE tbl_img_estado(
    id_img_estado int(11) NOT NULL AUTO_INCREMENT,
    nombre_img_estado varchar(255) NOT NULL DEFAULT '',
    uploaded_at timestamp NOT NULL DEFAULT NOW(),
    id_cambio_estado int,
    PRIMARY KEY (id_img_estado),
    CONSTRAINT fk_img_estado FOREIGN KEY(id_cambio_estado) REFERENCES tbl_historial_estado(id_cambio_estado) ON DELETE CASCADE
);

/* CREATE TABLE tbl_links(
    id_link int(11) NOT NULL AUTO_INCREMENT,
    titulo varchar(150) NOT NULL,
    url varchar(255) NOT NULL,
    descripcion TEXT,
    id_usuario int(11),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario FOREIGN KEY(id_usuario) REFERENCES tbl_usuarios(id_usuario),
    PRIMARY KEY (id_link)
); */

-- QUERIES

ALTER TABLE tbl_usuarios
    ADD PRIMARY KEY (id_usuario);

ALTER TABLE tbl_usuarios
    MODIFY id_usuario int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

ALTER TABLE tbl_links
    MODIFY id_link int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE tbl_usuarios;