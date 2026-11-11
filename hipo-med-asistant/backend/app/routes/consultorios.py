from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Consultorio, ConsultorioRecurso, EstadoConsultorio
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/consultorios", tags=["Selección de Consultorio"])

# Schemas
class ConsultorioCreate(BaseModel):
    nombre: str
    numero: str
    piso: int
    especialidad: str
    medico: str
    estado: str
    capacidad: int
    recursos: List[str]
    horario: str
    ubicacion: str
    notas: Optional[str] = None

@router.get("/")
def listar_consultorios(db: Session = Depends(get_db)):
    # Obtenemos todos los consultorios con sus recursos
    consultorios = db.query(Consultorio).all()
    # Formateamos para que recursos sea una lista de strings como espera el frontend
    resultado = []
    for c in consultorios:
        c_dict = {
            "id": c.id,
            "nombre": c.nombre,
            "numero": c.numero,
            "piso": c.piso,
            "especialidad": c.especialidad,
            "medico": c.medico,
            "estado": c.estado,
            "capacidad": c.capacidad,
            "recursos": [r.recurso for r in c.recursos],
            "horario": c.horario,
            "ubicacion": c.ubicacion,
            "notas": c.notas
        }
        resultado.append(c_dict)
    return resultado

@router.get("/{consultorio_id}")
def obtener_consultorio(consultorio_id: int, db: Session = Depends(get_db)):
    c = db.query(Consultorio).filter(Consultorio.id == consultorio_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Consultorio no encontrado")
    
    return {
        "id": c.id,
        "nombre": c.nombre,
        "numero": c.numero,
        "piso": c.piso,
        "especialidad": c.especialidad,
        "medico": c.medico,
        "estado": c.estado,
        "capacidad": c.capacidad,
        "recursos": [r.recurso for r in c.recursos],
        "horario": c.horario,
        "ubicacion": c.ubicacion,
        "notas": c.notas
    }

@router.post("/")
def crear_consultorio(data: ConsultorioCreate, db: Session = Depends(get_db)):
    # Verificar si el número ya existe
    existente = db.query(Consultorio).filter(Consultorio.numero == data.numero).first()
    if existente:
        raise HTTPException(status_code=409, detail="El número de consultorio ya existe")
    
    # Crear consultorio
    nuevo_consultorio = Consultorio(
        nombre=data.nombre,
        numero=data.numero,
        piso=data.piso,
        especialidad=data.especialidad,
        medico=data.medico,
        estado=data.estado,
        capacidad=data.capacidad,
        horario=data.horario,
        ubicacion=data.ubicacion,
        notas=data.notas
    )
    db.add(nuevo_consultorio)
    db.flush() # Para obtener el ID antes del commit

    # Agregar recursos
    for recurso_str in data.recursos:
        db.add(ConsultorioRecurso(consultorio_id=nuevo_consultorio.id, recurso=recurso_str))
    
    db.commit()
    db.refresh(nuevo_consultorio)
    
    return {**data.model_dump(), "id": nuevo_consultorio.id}

@router.put("/{consultorio_id}")
def actualizar_consultorio(consultorio_id: int, data: ConsultorioCreate, db: Session = Depends(get_db)):
    c = db.query(Consultorio).filter(Consultorio.id == consultorio_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Consultorio no encontrado")
    
    # Verificar si el número cambió y ya existe en otro consultorio
    if data.numero != c.numero:
        existente = db.query(Consultorio).filter(Consultorio.numero == data.numero, Consultorio.id != consultorio_id).first()
        if existente:
            raise HTTPException(status_code=409, detail="El número de consultorio ya existe")

    # Actualizar campos
    c.nombre = data.nombre
    c.numero = data.numero
    c.piso = data.piso
    c.especialidad = data.especialidad
    c.medico = data.medico
    c.estado = data.estado
    c.capacidad = data.capacidad
    c.horario = data.horario
    c.ubicacion = data.ubicacion
    c.notas = data.notas

    # Actualizar recursos (borrar y re-crear)
    db.query(ConsultorioRecurso).filter(ConsultorioRecurso.consultorio_id == consultorio_id).delete()
    for recurso_str in data.recursos:
        db.add(ConsultorioRecurso(consultorio_id=consultorio_id, recurso=recurso_str))
    
    db.commit()
    db.refresh(c)
    return {**data.model_dump(), "id": c.id}

@router.delete("/{consultorio_id}")
def eliminar_consultorio(consultorio_id: int, db: Session = Depends(get_db)):
    c = db.query(Consultorio).filter(Consultorio.id == consultorio_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Consultorio no encontrado")
    
    db.delete(c) # Cascade eliminará los recursos
    db.commit()
    return {"message": "Consultorio eliminado"}
