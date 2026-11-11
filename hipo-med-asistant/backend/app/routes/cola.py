from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from sqlalchemy import func
from app.models.models import Cita, Paciente, EstadoCita
from datetime import date
from typing import List, Optional

router = APIRouter(prefix="/cola", tags=["Cola de Espera"])

@router.get("/")
def obtener_cola(
    fecha: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    # Obtenemos las citas de la fecha seleccionada o de hoy
    target_date = fecha or date.today()
    
    # Filtramos para mostrar solo citas aceptadas por recepción (Programada/Registrada)
    # y que no hayan pasado a consulta (En Progreso) ni finalizado (Completada)
    citas = db.query(Cita).filter(
        Cita.fecha_programada == target_date,
        Cita.estado.in_([EstadoCita.PROGRAMADA, EstadoCita.REGISTRADA])
    ).order_by(Cita.hora_programada).all()
    
    resultado = []
    for c in citas:
        p = c.paciente
        cons = c.consultorio if hasattr(c, 'consultorio') else None
        resultado.append({
            "id": c.id,
            "paciente_id": p.id,
            "hora": c.hora_programada.strftime("%I:%M %p"),
            "paciente": f"{p.nombre} {p.apellido}",
            "genero": p.genero,
            "edad": (date.today().year - p.fecha_nac.year - ((date.today().month, date.today().day) < (p.fecha_nac.month, p.fecha_nac.day))),
            "motivo": c.motivo,
            "estado": c.estado,
            "tutor": p.tutor_nombre,
            "email": p.tutor_email,
            "telefono": p.tutor_telefono,
            "created_at": c.creado_en.isoformat(),
            "consultorio": c.consultorio.nombre if c.consultorio else "No especificado"
        })
    return resultado

@router.get("/stats")
def obtener_estadisticas_recepcion(db: Session = Depends(get_db)):
    hoy = date.today()
    
    # 1. Pacientes en Espera (Citas de hoy aceptadas por recepción que no han pasado a consulta)
    en_espera = db.query(Cita).filter(
        Cita.fecha_programada == hoy,
        Cita.estado.in_([EstadoCita.PROGRAMADA, EstadoCita.REGISTRADA])
    ).count()
    
    # 2. Citas de Hoy / TOTAL (Misma lógica: aceptadas y pendientes de consulta)
    citas_hoy = en_espera
    
    # 3. Pendientes de Pago (Este dato no existe en el modelo actual, devolvemos 0 por ahora)
    # Si añades una tabla de facturación, aquí iría la consulta
    pendientes_pago = 0
    
    # 4. Nuevos Registros (Pacientes creados hoy)
    nuevos_registros = db.query(Paciente).filter(
        func.date(Paciente.creado_en) == hoy
    ).count()
    
    return {
        "en_espera": en_espera,
        "citas_hoy": citas_hoy,
        "pendientes_pago": pendientes_pago,
        "nuevos_registros": nuevos_registros
    }

@router.get("/ultima-accion")
def obtener_ultima_accion(db: Session = Depends(get_db)):
    # Obtenemos la última cita creada en el sistema
    ultima_cita = db.query(Cita).order_by(Cita.creado_en.desc()).first()
    
    if not ultima_cita:
        return None
        
    p = ultima_cita.paciente
    m = ultima_cita.consultorio.medico if ultima_cita.consultorio else "Médico no asignado"
    
    # Calcular tiempo transcurrido (simplificado para el frontend)
    ahora = func.now()
    
    return {
        "paciente": f"{p.nombre} {p.apellido}",
        "medico": m,
        "accion": f"Registro de cita para {m}",
        "fecha_creacion": ultima_cita.creado_en.isoformat(),
        "iniciales": f"{p.nombre[0]}{p.apellido[0]}".upper() if p.nombre and p.apellido else "P"
    }
