CREATE DATABASE database_matriz;

USE database_matriz;

CREATE TABLE tbl_usuarios(
    id_usuario int(11) NOT NULL AUTO_INCREMENT,
    nombre_persona varchar(100) NOT NULL,
    nombre_usuario varchar(50) NOT NULL,
    rol varchar(30) NOT NULL,
    planes_creados int(11) DEFAULT NULL,
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

CREATE TABLE tbl_(

);

CREATE TABLE tbl_links(
    id_link int(11) NOT NULL AUTO_INCREMENT,
    titulo varchar(150) NOT NULL,
    url varchar(255) NOT NULL,
    descripcion TEXT,
    id_usuario int(11),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario FOREIGN KEY(id_usuario) REFERENCES tbl_usuarios(id_usuario),
    PRIMARY KEY (id_link)
);

-- QUERIES

ALTER TABLE tbl_usuarios
    ADD PRIMARY KEY (id_usuario);

ALTER TABLE tbl_usuarios
    MODIFY id_usuario int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

ALTER TABLE tbl_links
    MODIFY id_link int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE tbl_usuarios;