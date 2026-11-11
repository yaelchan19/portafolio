from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class RecepcionistaBase(BaseModel):
    nombre: str
    username: str
    email: EmailStr
    telefono: Optional[str] = None
    fecha_ingreso: Optional[date] = None
    identificacion_oficial: Optional[str] = None
    direccion: Optional[str] = None
    rfc: Optional[str] = None

class RecepcionistaCreate(RecepcionistaBase):
    password: str

class RecepcionistaUpdate(BaseModel):
    nombre: Optional[str] = None
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    telefono: Optional[str] = None
    fecha_ingreso: Optional[date] = None
    identificacion_oficial: Optional[str] = None
    direccion: Optional[str] = None
    rfc: Optional[str] = None

class RecepcionistaResponse(RecepcionistaBase):
    id: int
    activo: bool

    class Config:
        from_attributes = True
