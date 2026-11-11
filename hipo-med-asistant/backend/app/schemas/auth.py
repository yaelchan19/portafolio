from pydantic import BaseModel, EmailStr
from typing import Optional, Dict
from datetime import date

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    nombre: str
    username: str
    email: EmailStr
    password: str
    rol: Optional[str] = "paciente"
    
    # Campos adicionales dinámicos
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    identificacion_oficial: Optional[str] = None
    especialidad: Optional[str] = None
    cedula_profesional: Optional[str] = None
    universidad_egreso: Optional[str] = None
    horario_atencion: Optional[str] = None
    consultorio_pref: Optional[str] = None
    fecha_ingreso: Optional[date] = None
    rfc: Optional[str] = None

class AuthResponse(BaseModel):
    message: str
    user: Optional[Dict] = None
    access_token: Optional[str] = None

class UserUpdate(BaseModel):
    nombre: Optional[str] = None
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    rol: Optional[str] = None

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str
