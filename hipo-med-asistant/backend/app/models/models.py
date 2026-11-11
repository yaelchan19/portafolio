from sqlalchemy import Column, Integer, String, Boolean, Date, Time, DateTime, ForeignKey, Numeric, Enum, Text
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import func
from app.database import Base
import enum

# Enums
class EstadoConsultorio(str, enum.Enum):
    DISPONIBLE = "Disponible"
    OCUPADO = "Ocupado"
    MANTENIMIENTO = "Mantenimiento"

class EstadoCita(str, enum.Enum):
    PENDIENTE = "Pendiente"
    PROGRAMADA = "Programada"
    REGISTRADA = "Registrada"
    EN_PROGRESO = "En Progreso"
    COMPLETADA = "Completada"
    CANCELADA = "Cancelada"

class TipoEntrada(str, enum.Enum):
    REVISION = "Revisión"
    VACUNACION = "Vacunación"
    ENFERMEDAD = "Enfermedad"
    LESION = "Lesión"
    ESPECIALISTA = "Especialista"

class Genero(str, enum.Enum):
    MASCULINO = "Masculino"
    FEMENINO = "Femenino"
    OTRO = "Otro"

# Usuarios (Personal)
class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(200), nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    rol = Column(String(50), default="paciente")
    activo = Column(Boolean, default=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    
    # Nuevos campos para recepcionistas y personal
    telefono = Column(String(50))
    fecha_ingreso = Column(Date)
    identificacion_oficial = Column(String(200))
    direccion = Column(Text)
    rfc = Column(String(20))
    
    # Campos para Médico
    especialidad = Column(String(200))
    cedula_profesional = Column(String(100))
    universidad_egreso = Column(String(200))
    horario_atencion = Column(String(200))
    consultorio_pref = Column(String(100))
    
    # Relación médico-recepcionista (Self-referential)
    medico_id = Column(Integer, ForeignKey("usuarios.id", ondelete="SET NULL"), nullable=True)
    recepcionistas = relationship("Usuario", backref=backref("medico", remote_side=[id]))

# Pacientes
class Paciente(Base):
    __tablename__ = "pacientes"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(120), nullable=False)
    apellido = Column(String(120), nullable=False)
    fecha_nac = Column(Date, nullable=False)
    genero = Column(
        Enum(Genero, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )
    tutor_nombre = Column(String(200), nullable=False)
    tutor_email = Column(String(200), nullable=False)
    tutor_telefono = Column(String(50))
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    citas = relationship("Cita", back_populates="paciente")
    entradas = relationship("ExpedienteEntrada", back_populates="paciente")
    alergias = relationship("Alergia", back_populates="paciente", cascade="all, delete-orphan")
    medicamentos = relationship("Medicamento", back_populates="paciente", cascade="all, delete-orphan")

# Alergias
class Alergia(Base):
    __tablename__ = "alergias"
    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id", ondelete="CASCADE"), nullable=False)
    nombre = Column(String(200), nullable=False)
    
    paciente = relationship("Paciente", back_populates="alergias")

# Medicamentos
class Medicamento(Base):
    __tablename__ = "medicamentos"
    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id", ondelete="CASCADE"), nullable=False)
    nombre = Column(String(200), nullable=False)
    dosis = Column(String(200))
    
    paciente = relationship("Paciente", back_populates="medicamentos")

# Consultorios
class Consultorio(Base):
    __tablename__ = "consultorios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(200), nullable=False)
    numero = Column(String(50), unique=True, index=True, nullable=False)
    piso = Column(Integer, nullable=False)
    especialidad = Column(String(200), nullable=False)
    medico = Column(String(200), nullable=False)
    estado = Column(
        Enum(EstadoConsultorio, values_callable=lambda x: [e.value for e in x]),
        default=EstadoConsultorio.DISPONIBLE
    )
    capacidad = Column(Integer, default=1)
    horario = Column(String(200), nullable=False)
    ubicacion = Column(String(200), nullable=False)
    notas = Column(Text)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    recursos = relationship("ConsultorioRecurso", back_populates="consultorio", cascade="all, delete-orphan")

class ConsultorioRecurso(Base):
    __tablename__ = "consultorio_recursos"
    id = Column(Integer, primary_key=True, index=True)
    consultorio_id = Column(Integer, ForeignKey("consultorios.id", ondelete="CASCADE"), nullable=False)
    recurso = Column(String(200), nullable=False)

    consultorio = relationship("Consultorio", back_populates="recursos")

# Citas
class Cita(Base):
    __tablename__ = "citas"
    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id", ondelete="RESTRICT"), nullable=False)
    consultorio_id = Column(Integer, ForeignKey("consultorios.id", ondelete="RESTRICT"), nullable=False)
    fecha_programada = Column(Date, nullable=False)
    hora_programada = Column(Time, nullable=False)
    estado = Column(
        Enum(EstadoCita, values_callable=lambda x: [e.value for e in x]),
        default=EstadoCita.PROGRAMADA
    )
    motivo = Column(String(200))
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    paciente = relationship("Paciente", back_populates="citas")
    consultorio = relationship("Consultorio")

# Expediente Entradas
class ExpedienteEntrada(Base):
    __tablename__ = "expediente_entradas"
    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id", ondelete="RESTRICT"), nullable=False)
    tipo = Column(
        Enum(TipoEntrada, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )
    descripcion = Column(Text, nullable=False)
    altura_cm = Column(Numeric(5, 2))
    peso_kg = Column(Numeric(5, 2))
    temperatura_c = Column(Numeric(4, 1))
    fecha = Column(DateTime(timezone=True), server_default=func.now())

    paciente = relationship("Paciente", back_populates="entradas")

# Logs de Auditoría
class LogAuditoria(Base):
    __tablename__ = "logs_auditoria"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="SET NULL"), nullable=True)
    accion = Column(String(100), nullable=False) # CREAR, EDITAR, ELIMINAR, LOGIN
    tabla = Column(String(100))
    registro_id = Column(Integer)
    detalles = Column(Text) # JSON string con cambios
    fecha = Column(DateTime(timezone=True), server_default=func.now())

    usuario = relationship("Usuario")