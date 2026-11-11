from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Cita, Paciente, EstadoCita
from datetime import date, datetime
from typing import List, Optional

router = APIRouter(prefix="/sala-espera", tags=["Sala de Espera"])

@router.get("/")
def obtener_sala_espera(
    fecha: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    target_date = fecha or date.today()
    ahora = datetime.now().time()
    
    # Todas las citas del día seleccionado no canceladas
    citas_hoy = db.query(Cita).filter(
        Cita.fecha_programada == target_date,
        Cita.estado != EstadoCita.CANCELADA
    ).order_by(Cita.hora_programada).all()

    # Paciente actual (En Progreso)
    actual_cita = next((c for c in citas_hoy if c.estado == EstadoCita.EN_PROGRESO), None)
    actual = {
        "nombre": f"{actual_cita.paciente.nombre} {actual_cita.paciente.apellido[:1]}." if actual_cita else "Nadie",
        "estado": "En consulta" if actual_cita else "Esperando paciente"
    }

    # Citas que aún no han pasado (Programadas o Registradas)
    futuras = [c for c in citas_hoy if c.estado in [EstadoCita.PROGRAMADA, EstadoCita.REGISTRADA]]
    
    siguiente_cita = futuras[0] if futuras else None
    siguiente = {
        "nombre": f"{siguiente_cita.paciente.nombre} {siguiente_cita.paciente.apellido[:1]}." if siguiente_cita else "—",
        "hora": siguiente_cita.hora_programada.strftime("%I:%M %p") if siguiente_cita else "—",
        "tiempo": "En breve" if siguiente_cita else "—"
    }

    restantes = []
    if len(futuras) > 1:
        for c in futuras[1:6]: # Mostrar hasta 5 más
            restantes.append({
                "nombre": f"{c.paciente.nombre} {c.paciente.apellido[:1]}.",
                "hora": c.hora_programada.strftime("%I:%M %p"),
                "tiempo": "—"
            })

    return {
        "actual": actual,
        "siguiente": siguiente,
        "restantes": restantes,
        "estadisticas": {
            "promedio": "15 minutos",
            "esperando": len(futuras)
        }
    }
