-- Esquema de Base de Datos PostgreSQL para Clínica Infantil
-- Proyecto: Hipo Med Assistant / Clínica Infantil Pro
-- Fecha: 2024-04-02

-- 1. Extensiones y Configuraciones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Definición de Enums (Tipos personalizados)
DO $$ BEGIN
    CREATE TYPE estado_consultorio AS ENUM ('Disponible', 'Ocupado', 'Mantenimiento');
    CREATE TYPE estado_cita AS ENUM ('Pendiente', 'Programada', 'Registrada', 'En Progreso', 'Completada', 'Cancelada');
    CREATE TYPE tipo_entrada AS ENUM ('Revisión', 'Vacunación', 'Enfermedad', 'Lesión', 'Especialista');
    CREATE TYPE genero_paciente AS ENUM ('Masculino', 'Femenino', 'Otro');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Tabla de Usuarios (Personal de la Clínica)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol VARCHAR(50) DEFAULT 'staff', -- admin, medico, enfermeria, recepcion
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Pacientes
CREATE TABLE IF NOT EXISTS pacientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    apellido VARCHAR(120) NOT NULL,
    fecha_nac DATE NOT NULL,
    genero genero_paciente NOT NULL,
    tutor_nombre VARCHAR(200) NOT NULL,
    tutor_email VARCHAR(200) NOT NULL,
    tutor_telefono VARCHAR(50),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Consultorios
CREATE TABLE IF NOT EXISTS consultorios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    numero VARCHAR(50) UNIQUE NOT NULL,
    piso INTEGER NOT NULL,
    especialidad VARCHAR(200) NOT NULL,
    medico VARCHAR(200) NOT NULL,
    estado estado_consultorio DEFAULT 'Disponible',
    capacidad INTEGER DEFAULT 1,
    horario VARCHAR(200) NOT NULL,
    ubicacion VARCHAR(200) NOT NULL,
    notas TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Recursos de Consultorio (Relación 1:N con Consultorios)
CREATE TABLE IF NOT EXISTS consultorio_recursos (
    id SERIAL PRIMARY KEY,
    consultorio_id INTEGER NOT NULL REFERENCES consultorios(id) ON DELETE CASCADE,
    recurso VARCHAR(200) NOT NULL
);

-- 7. Tabla de Citas (Relaciona Pacientes y Consultorios)
CREATE TABLE IF NOT EXISTS citas (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
    consultorio_id INTEGER NOT NULL REFERENCES consultorios(id) ON DELETE RESTRICT,
    fecha_programada DATE NOT NULL,
    hora_programada TIME NOT NULL,
    estado estado_cita DEFAULT 'Pendiente',
    motivo VARCHAR(200),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabla de Expediente: Entradas Médicas
CREATE TABLE IF NOT EXISTS expediente_entradas (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    tipo tipo_entrada NOT NULL,
    descripcion TEXT NOT NULL,
    altura_cm NUMERIC(5, 2),
    peso_kg NUMERIC(5, 2),
    temperatura_c NUMERIC(4, 1),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabla de Alergias
CREATE TABLE IF NOT EXISTS alergias (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL
);

-- 10. Tabla de Medicamentos
CREATE TABLE IF NOT EXISTS medicamentos (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL,
    dosis VARCHAR(200)
);

-- 11. Índices para Optimización (Escalabilidad)
CREATE INDEX IF NOT EXISTS idx_paciente_nombre ON pacientes(nombre, apellido);
CREATE INDEX IF NOT EXISTS idx_cita_fecha ON citas(fecha_programada);
CREATE INDEX IF NOT EXISTS idx_cita_estado ON citas(estado);
CREATE INDEX IF NOT EXISTS idx_expediente_paciente ON expediente_entradas(paciente_id);

-- 12. Datos Iniciales (Seed Data)
-- Consultorios de ejemplo
INSERT INTO consultorios (nombre, numero, piso, especialidad, medico, horario, ubicacion)
VALUES 
('Consultorio de Pediatría General', 'P-101', 1, 'Pediatría General', 'Dra. Ana García', '08:00 AM - 04:00 PM', 'Ala Norte'),
('Sala de Vacunación Infantil', 'V-202', 2, 'Inmunología', 'Lic. Pedro López', '09:00 AM - 05:00 PM', 'Ala Sur'),
('Consultorio de Especialidades', 'E-303', 3, 'Neuropediatría', 'Dr. Carlos Ruiz', '10:00 AM - 02:00 PM', 'Pabellón C')
ON CONFLICT (numero) DO NOTHING;

-- Usuario administrador por defecto (Contraseña: admin123 - Debe ser hasheada en producción)
-- Nota: En un entorno real, la contraseña debe ser un hash bcrypt/argon2.
INSERT INTO usuarios (nombre, email, password_hash, rol)
VALUES ('Administrador', 'admin@clinicainfantil.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6L6s5n.O/H5O/W7e', 'admin')
ON CONFLICT (email) DO NOTHING;
