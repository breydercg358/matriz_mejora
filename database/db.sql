-- Script para crear las tablas de la base de datos.

-- Creación de la BD.
CREATE DATABASE matriz_prueba;

-- Uso de la BD para crear tablas dentro de esta.
USE matriz_prueba;

-- Creación de la tabla de usuarios de la aplicación.
CREATE TABLE tbl_usuarios(
    id_usuario int(11) NOT NULL AUTO_INCREMENT, -- Identificador del usuario
    nombre_persona varchar(100) NOT NULL, -- Nombre de la persona asociado al usuario
    nombre_usuario varchar(50) NOT NULL, -- Nombre del usuario con el que inicia sesión
    rol varchar(30) NOT NULL, -- Rol que posee el usuario dentro de la aplicación
    planes_creados int(11) DEFAULT 0, -- Contador para añadir el número total de planes creados por el usuario
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Marca de tiempo para denotar cuando fue creado el usuario
    updated_at timestamp NULL, -- Marca de tiempo para denotar cuando fue actualizado algún dato relacionado al usuario
    ultimo_login timestamp NULL, -- Marca de tiempo para denotar cuando fue el último inicio de sesión del usuario
    password varchar(60) NOT NULL, -- Campo de contraseña
    PRIMARY KEY (id_usuario) -- Definición de campo como llave primaria
);

-- Creación de la tabla de sedes.
CREATE TABLE tbl_sedes(
    id_sede int(11) NOT NULL AUTO_INCREMENT, -- Identificador de la sede
    nombre_sede varchar(100) NOT NULL, -- Nombre que posee la sede
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Marca de tiempo de creación de la sede
    updated_at timestamp NULL, -- Marca de tiempo de actualización de algún dato de la sede
    PRIMARY KEY (id_sede) -- Definición de campo como llave primaria
);

-- Creación de la tabla de áreas dentro de las diferentes sedes.
CREATE TABLE tbl_areas(
    id_area int(11) NOT NULL AUTO_INCREMENT, -- Identificador del área
    nombre_area varchar(100) NOT NULL, -- Nombre que posee el área
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Marca de tiempo de creación del área
    updated_at timestamp NULL, -- Marca de tiempo de actualización de algún dato del área
    id_sede int(11), -- Adición del campo de identificador de sede
    CONSTRAINT fk_sede FOREIGN KEY(id_sede) REFERENCES tbl_sedes(id_sede) ON DELETE CASCADE, -- Se define el anterior campo como una llave foránea que conecta con la llave primaria de la tabla de sedes
    PRIMARY KEY (id_area) -- Definición de la llave primaria de esta tabla
);

-- Creación de la tabla de estados.
CREATE TABLE tbl_estados(
    id_estado int(11) NOT NULL AUTO_INCREMENT, -- Identificador del estado
    nombre_estado varchar(50) NOT NULL, -- Nombre que posee el estado
    color_estado varchar(10) NOT NULL, -- Color que se requiere que tenga el estado
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Marca de tiempo de creación del estado
    updated_at timestamp NULL, -- Marca de tiempo de actualización de algún dato del estado
    PRIMARY KEY (id_estado) -- Definición del campo como llave primaria
);

-- Creación de la tabla de factores de riesgo.
CREATE TABLE tbl_factores(
    id_factor int(11) NOT NULL AUTO_INCREMENT, -- Identificador del factor de riesgo
    nombre_factor varchar(50) NOT NULL, -- Nombre del factor de riesgo
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Marca de tiempo de creación del factor de riesgo
    updated_at timestamp NULL, -- Marca de tiempo de actualización de algún dato del factor de riesgo
    PRIMARY KEY (id_factor) -- Definición del campo como llave primaria
);

-- Creación de la tabla de fuentes.
CREATE TABLE tbl_fuentes(
    id_fuente int(11) NOT NULL AUTO_INCREMENT, -- Identificador de la fuente
    nombre_fuente varchar(50) NOT NULL, -- Nombre de la fuente
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Marca de tiempo de creación de la fuente
    updated_at timestamp NULL, -- Marca de tiempo de actualización de algún dato de la fuente
    PRIMARY KEY (id_fuente) -- Defición del campo como llave primaria
);

-- Creación de la tabla de prioridades.
CREATE TABLE tbl_prioridades(
    id_prioridad int(11) NOT NULL AUTO_INCREMENT, -- Identificador de la prioridad
    nombre_prioridad varchar(50) NOT NULL, -- Nombre de la prioridad
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Marca de tiempo de creación de la prioridad
    updated_at timestamp NULL, -- Marca de tiempo de actualización de algún dato de la prioridad
    PRIMARY KEY (id_prioridad) -- Definición de la llave primaria
);

-- Creación de la tabla de tipos de hallazgo.
CREATE TABLE tbl_tipos_hallazgo(
    id_tipo int(11) NOT NULL AUTO_INCREMENT, -- Identificador del tipo de hallazgo
    nombre_tipo varchar(50) NOT NULL, -- Nombre del tipo de hallazgo
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Marca de tiempo de creación del tipo de hallazgo
    updated_at timestamp NULL, -- Marca de tiempo de actualización de algún dato del tipo de hallazgo
    PRIMARY KEY (id_tipo) -- Definición del campo como llave primaria
);

-- Creación de la tabla de hallazgos
CREATE TABLE tbl_hallazgos(
    id_hallazgo int(11) NOT NULL AUTO_INCREMENT, -- Identificador del hallazgo
    nombre_hallazgo varchar(100) NOT NULL, -- Nombre del hallazgo encontrado
    nombre_persona varchar(100) NOT NULL, -- Nombre de la persona que encontró el hallazgo
    nombre_usuario varchar(50) NOT NULL, -- Nombre del usuario con el que se registra el hallazgo
    fecha timestamp DEFAULT NOW(), -- Fecha en la que se registró el hallazgo
    fecha_ejecucion timestamp DEFAULT NOW(), -- Fecha en la que se tiene planeada la ejecución del hallazgo
    fecha_final timestamp NULL, -- Fecha definitiva en la que el hallazgo fue ejecutado
    sede varchar(100) NOT NULL, -- Sede en la que fue encontrado el hallazgo
    area varchar(100) NOT NULL, -- Área de la sede correspondiente donde fue encontrado el hallazgo
    lugar_hallazgo varchar(150) DEFAULT '', -- Lugar exacto donde fue encontrado el hallazgo
    responsable varchar(100) NOT NULL, -- Nombre del área responsable a ejecutar el hallazgo
    descripcion text NOT NULL, -- Descripción exacta del hallazgo encontrado
    tipo_hallazgo varchar(50) NOT NULL, -- Tipo de hallazgo que fue encontrado
    fuente varchar(50) NOT NULL, -- Fuente de inspección encontrada dentro del hallazgo
    factor_riesgo varchar(50) NOT NULL, -- Factor de riesgo encontrado dentro del hallazgo
    prioridad varchar(50) NOT NULL, -- Prioridad dada al hallazgo
    estado varchar(50) NOT NULL, -- Estado en el que se encuentra el hallazgo
    plan_sugerido text NOT NULL, -- Plan que se sugiere ejecutar para el hallazgo
    otras_observaciones text DEFAULT '', -- Observaciones adicionales hacia el hallazgo
    registro_fotografico blob DEFAULT '', -- Registro visual del hallazgo encontrado
    id_usuario int, -- Identificador del usuario de la tabla de usuarios
    CONSTRAINT fk_hallazgo FOREIGN KEY(id_usuario) REFERENCES tbl_usuarios(id_usuario) ON DELETE CASCADE, -- Llave foránea definida hacia el campo anterior. Esta se define principalmente para actualizar el contador de hallazgos encontrados por cada usuario hasta la fecha
    PRIMARY KEY (id_hallazgo) -- Definición del campo como llave primaria
);

-- Creación de la tabla de registros fotográficos.
CREATE TABLE tbl_images(
    id_imagen int(11) NOT NULL AUTO_INCREMENT, -- Identificador del registro fotográfico
    nombre_img varchar(255) NOT NULL DEFAULT '', -- Nombre de la imagen subida desde el formulario de hallazgos
    uploaded_at timestamp NOT NULL DEFAULT NOW(), -- Marca de tiempo de cuando fue subida la imagen
    id_hallazgo int, -- Identificador del hallazgo dentro de la tabla de hallazgos
    PRIMARY KEY(id_imagen), -- Definición del campo como llave primaria
    CONSTRAINT FOREIGN KEY(id_hallazgo) REFERENCES tbl_hallazgos(id_hallazgo) ON DELETE CASCADE -- Defnición del campo id_hallazgo como llave foránea. Esto se hace para relacionar la o las imagenes en cuestión con su hallazgo correspondiente.
);

-- Creación de la tabla de responsables de área.
CREATE TABLE tbl_responsables(
    id_responsable int(11) NOT NULL AUTO_INCREMENT, -- Identificador del responsable
    nombre_responsable varchar(100) NOT NULL, -- Nombre del responsable
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Marca de tiempo de creación del responsable
    updated_at timestamp NULL, -- Marca de tiempo de actualización de algún dato del responsable
    PRIMARY KEY (id_responsable) -- Definición del campo como llave primaria
); 

-- Creación de la tabla de historial de cambios de estado en hallazgos.
CREATE TABLE tbl_historial_estado(
    id_cambio_estado int(11) NOT NULL AUTO_INCREMENT, -- Identificador del cambio de estado
    nombre_hallazgo varchar(100) NOT NULL DEFAULT '', -- Nombre del hallazgo al que se le cambia el estado 
    nuevo_estado varchar(50) NOT NULL DEFAULT '', -- Nombre del nuevo estado que poseerá el hallazgo
    razon_cambio text NOT NULL DEFAULT '', -- Razón por la que se desea cambiar el estado actual del hallazgo
    fecha_cambio timestamp NOT NULL DEFAULT NOW(), -- Fecha adicional en caso de ya haber ejecutado el hallazgo
    id_usuario int, -- Identificador del usuario de la tabla de usuarios
    PRIMARY KEY (id_cambio_estado), -- Definición del campo como llave primaria
    CONSTRAINT fk_usuario FOREIGN KEY(id_usuario) REFERENCES tbl_usuarios(id_usuario) ON DELETE CASCADE -- Se define el campo id_usuario como llave foránea para asociar el cambio de estado al usuario en cuestión.
);

-- Creación de la tabla de imagenes asociadas a un cambio de estado.
CREATE TABLE tbl_img_estado(
    id_img_estado int(11) NOT NULL AUTO_INCREMENT, -- Identificador de la imagen en el cambio de estado
    nombre_img_estado varchar(255) NOT NULL DEFAULT '', -- Nombre de la imagen en el cambio de estado
    uploaded_at timestamp NOT NULL DEFAULT NOW(), -- Marca de tiempo en la que es subida la imagen
    id_cambio_estado int, -- Identificador id_cambio_estado de la tabla tbl_historial_estado
    PRIMARY KEY (id_img_estado), -- Definición del campo como llave primaria
    CONSTRAINT fk_img_estado FOREIGN KEY(id_cambio_estado) REFERENCES tbl_historial_estado(id_cambio_estado) ON DELETE CASCADE -- Se define el campo id_cambio_estado como llave foránea para relacionar la o las imagenes con el cambio de estado correspondiente
);

-- QUERIES ADICIONALES

ALTER TABLE tbl_usuarios
    ADD PRIMARY KEY (id_usuario);

ALTER TABLE tbl_usuarios
    MODIFY id_usuario int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

ALTER TABLE tbl_links
    MODIFY id_link int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE tbl_usuarios;