from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Paciente, ExpedienteEntrada, TipoEntrada, Alergia, Medicamento, Cita
from app.schemas.expediente import EntradaExpediente, AlergiaCreate, MedicamentoCreate
from datetime import date
from typing import List, Optional

router = APIRouter(prefix="/expedientes", tags=["Expedientes"])

def calcular_edad(fecha_nacimiento: date):
    today = date.today()
    return today.year - fecha_nacimiento.year - ((today.month, today.day) < (fecha_nacimiento.month, fecha_nacimiento.day))

@router.get("/")
def listar_expedientes(db: Session = Depends(get_db)):
    pacientes = db.query(Paciente).all()
    resultado = []
    for p in pacientes:
        resultado.append({
            "id": p.id,
            "paciente": f"{p.nombre} {p.apellido}",
            "edad": calcular_edad(p.fecha_nac),
            "tutor": p.tutor_nombre,
            "email": p.tutor_email,
            "telefono": p.tutor_telefono
        })
    return resultado

@router.get("/{paciente_id}")
def obtener_expediente(paciente_id: int, db: Session = Depends(get_db)):
    p = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Expediente no encontrado")
    
    entradas = db.query(ExpedienteEntrada).filter(ExpedienteEntrada.paciente_id == paciente_id).order_by(ExpedienteEntrada.fecha.desc()).all()
    alergias = db.query(Alergia).filter(Alergia.paciente_id == paciente_id).all()
    medicamentos = db.query(Medicamento).filter(Medicamento.paciente_id == paciente_id).all()
    
    # Obtener el último consultorio de la cita más reciente
    ultima_cita = db.query(Cita).filter(Cita.paciente_id == paciente_id).order_by(Cita.fecha_programada.desc(), Cita.hora_programada.desc()).first()
    consultorio_nombre = ultima_cita.consultorio.nombre if ultima_cita and ultima_cita.consultorio else "Consultorio General"
    
    return {
        "perfil": {
            "id": p.id,
            "paciente": f"{p.nombre} {p.apellido}",
            "genero": p.genero,
            "edad": calcular_edad(p.fecha_nac),
            "tutor": p.tutor_nombre,
            "email": p.tutor_email,
            "telefono": p.tutor_telefono,
            "consultorio": consultorio_nombre
        },
        "entradas": [
            {
                "id": e.id,
                "tipo": e.tipo,
                "descripcion": e.descripcion,
                "fecha": e.fecha.isoformat(),
                "altura": str(e.altura_cm) if e.altura_cm else None,
                "peso": str(e.peso_kg) if e.peso_kg else None,
                "temperatura": str(e.temperatura_c) if e.temperatura_c else None,
            } for e in entradas
        ],
        "alergias": [
            {
                "id": a.id,
                "nombre": a.nombre
            } for a in alergias
        ],
        "medicamentos": [
            {
                "id": m.id,
                "nombre": m.nombre,
                "dosis": m.dosis
            } for m in medicamentos
        ]
    }

# CRUD Alergias
@router.post("/{paciente_id}/alergias")
def agregar_alergia(paciente_id: int, alergia: AlergiaCreate, db: Session = Depends(get_db)):
    nueva_alergia = Alergia(paciente_id=paciente_id, nombre=alergia.nombre)
    db.add(nueva_alergia)
    db.commit()
    db.refresh(nueva_alergia)
    return nueva_alergia

@router.put("/{paciente_id}/alergias/{alergia_id}")
def actualizar_alergia(paciente_id: int, alergia_id: int, alergia: AlergiaCreate, db: Session = Depends(get_db)):
    a = db.query(Alergia).filter(Alergia.id == alergia_id, Alergia.paciente_id == paciente_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Alergia no encontrada")
    a.nombre = alergia.nombre
    db.commit()
    db.refresh(a)
    return a

@router.delete("/{paciente_id}/alergias/{alergia_id}")
def eliminar_alergia(paciente_id: int, alergia_id: int, db: Session = Depends(get_db)):
    a = db.query(Alergia).filter(Alergia.id == alergia_id, Alergia.paciente_id == paciente_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Alergia no encontrada")
    db.delete(a)
    db.commit()
    return {"message": "Alergia eliminada"}

# CRUD Medicamentos
@router.post("/{paciente_id}/medicamentos")
def agregar_medicamento(paciente_id: int, medicamento: MedicamentoCreate, db: Session = Depends(get_db)):
    nuevo_medicamento = Medicamento(paciente_id=paciente_id, nombre=medicamento.nombre, dosis=medicamento.dosis)
    db.add(nuevo_medicamento)
    db.commit()
    db.refresh(nuevo_medicamento)
    return nuevo_medicamento

@router.put("/{paciente_id}/medicamentos/{medicamento_id}")
def actualizar_medicamento(paciente_id: int, medicamento_id: int, medicamento: MedicamentoCreate, db: Session = Depends(get_db)):
    m = db.query(Medicamento).filter(Medicamento.id == medicamento_id, Medicamento.paciente_id == paciente_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Medicamento no encontrado")
    m.nombre = medicamento.nombre
    m.dosis = medicamento.dosis
    db.commit()
    db.refresh(m)
    return m

@router.delete("/{paciente_id}/medicamentos/{medicamento_id}")
def eliminar_medicamento(paciente_id: int, medicamento_id: int, db: Session = Depends(get_db)):
    m = db.query(Medicamento).filter(Medicamento.id == medicamento_id, Medicamento.paciente_id == paciente_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Medicamento no encontrado")
    db.delete(m)
    db.commit()
    return {"message": "Medicamento eliminado"}

@router.get("/{paciente_id}/entradas")
def obtener_entradas(paciente_id: int, db: Session = Depends(get_db)):
    entradas = db.query(ExpedienteEntrada).filter(ExpedienteEntrada.paciente_id == paciente_id).order_by(ExpedienteEntrada.fecha.desc()).all()
    return [
        {
            "id": e.id,
            "tipo": e.tipo,
            "descripcion": e.descripcion,
            "fecha": e.fecha.isoformat(),
            "altura": str(e.altura_cm) if e.altura_cm else None,
            "peso": str(e.peso_kg) if e.peso_kg else None,
            "temperatura": str(e.temperatura_c) if e.temperatura_c else None,
        } for e in entradas
    ]

@router.post("/{paciente_id}/entradas")
def agregar_entrada(paciente_id: int, entrada: EntradaExpediente, db: Session = Depends(get_db)):
    p = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    nueva_entrada = ExpedienteEntrada(
        paciente_id=paciente_id,
        tipo=entrada.tipo,
        descripcion=entrada.descripcion,
        altura_cm=float(entrada.altura) if entrada.altura else None,
        peso_kg=float(entrada.peso) if entrada.peso else None,
        temperatura_c=float(entrada.temperatura) if entrada.temperatura else None
    )
    db.add(nueva_entrada)
    db.commit()
    db.refresh(nueva_entrada)
    
    return {
        "id": nueva_entrada.id,
        "tipo": nueva_entrada.tipo,
        "descripcion": nueva_entrada.descripcion,
        "fecha": nueva_entrada.fecha.isoformat(),
        "altura": str(nueva_entrada.altura_cm) if nueva_entrada.altura_cm else None,
        "peso": str(nueva_entrada.peso_kg) if nueva_entrada.peso_kg else None,
        "temperatura": str(nueva_entrada.temperatura_c) if nueva_entrada.temperatura_c else None,
    }

@router.put("/{paciente_id}/entradas/{entrada_id}")
def actualizar_entrada(paciente_id: int, entrada_id: int, entrada: EntradaExpediente, db: Session = Depends(get_db)):
    e = db.query(ExpedienteEntrada).filter(ExpedienteEntrada.id == entrada_id, ExpedienteEntrada.paciente_id == paciente_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    
    e.tipo = entrada.tipo
    e.descripcion = entrada.descripcion
    e.altura_cm = float(entrada.altura) if entrada.altura else None
    e.peso_kg = float(entrada.peso) if entrada.peso else None
    e.temperatura_c = float(entrada.temperatura) if entrada.temperatura else None
    
    db.commit()
    db.refresh(e)
    
    return {
        "id": e.id,
        "tipo": e.tipo,
        "descripcion": e.descripcion,
        "fecha": e.fecha.isoformat(),
        "altura": str(e.altura_cm) if e.altura_cm else None,
        "peso": str(e.peso_kg) if e.peso_kg else None,
        "temperatura": str(e.temperatura_c) if e.temperatura_c else None,
    }

@router.delete("/{paciente_id}/entradas/{entrada_id}")
def eliminar_entrada(paciente_id: int, entrada_id: int, db: Session = Depends(get_db)):
    e = db.query(ExpedienteEntrada).filter(ExpedienteEntrada.id == entrada_id, ExpedienteEntrada.paciente_id == paciente_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    
    db.delete(e)
    db.commit()
    return {"message": "Entrada eliminada"}
