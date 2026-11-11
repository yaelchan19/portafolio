from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class PacienteData(BaseModel):
    nombre: str
    apellido: str
    fecha_nac: date
    genero: str

class TutorData(BaseModel):
    nombre: str
    email: EmailStr
    telefono: Optional[str] = None
    motivo: Optional[str] = None

class CitaCreate(BaseModel):
    fecha_programada: date
    hora_programada: str # Ej: "09:00 AM" o "9:00 AM"
    consultorio_id: int
    paciente: PacienteData
    tutor: TutorData

class CitaUpdateStatus(BaseModel):
    estado: str
