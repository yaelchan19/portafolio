from pydantic import BaseModel
from typing import Optional

class EntradaExpediente(BaseModel):
    tipo: str
    descripcion: str
    altura: Optional[str] = None
    peso: Optional[str] = None
    temperatura: Optional[str] = None

class AlergiaBase(BaseModel):
    nombre: str

class AlergiaCreate(AlergiaBase):
    pass

class Alergia(AlergiaBase):
    id: int
    paciente_id: int

    class Config:
        from_attributes = True

class MedicamentoBase(BaseModel):
    nombre: str
    dosis: Optional[str] = None

class MedicamentoCreate(MedicamentoBase):
    pass

class Medicamento(MedicamentoBase):
    id: int
    paciente_id: int

    class Config:
        from_attributes = True

