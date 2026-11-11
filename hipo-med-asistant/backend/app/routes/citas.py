from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.models import Cita, Paciente, Consultorio, Genero, EstadoCita
from app.schemas.citas import CitaCreate, CitaUpdateStatus
from app.utils.email_service import enviar_correo_confirmacion, enviar_correo_cancelacion
from app.utils.auditoria import registrar_log
from datetime import datetime, time, date
from typing import List, Optional

router = APIRouter(prefix="/citas", tags=["Citas"])

def parse_time(time_str: str) -> time:
    # "9:00 AM", "10:30 AM", "1:00 p.m.", "1:30 p.m."
    # Primero normalizamos
    time_str = time_str.lower().replace(".", "").strip() # "9:00 am", "1:00 pm"
    
    try:
        # Intentamos con formato %I:%M %p (ej: 09:00 am)
        return datetime.strptime(time_str, "%I:%M %p").time()
    except ValueError:
        try:
            # Intentamos sin espacio (ej: 09:00am)
            return datetime.strptime(time_str, "%I:%M%p").time()
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Formato de hora inválido: {time_str}")

@router.get("/ocupadas")
def obtener_horas_ocupadas(
    fecha: date,
    consultorio_id: int,
    db: Session = Depends(get_db)
):
    """Retorna las horas que ya están ocupadas para un consultorio y fecha específicos."""
    citas = db.query(Cita).filter(
        Cita.fecha_programada == fecha,
        Cita.consultorio_id == consultorio_id,
        Cita.estado.in_([EstadoCita.PENDIENTE, EstadoCita.PROGRAMADA, EstadoCita.REGISTRADA, EstadoCita.EN_PROGRESO, EstadoCita.COMPLETADA])
    ).all()
    
    # Formatear horas como string para el frontend (ej: "09:00 AM")
    horas_ocupadas = [c.hora_programada.strftime("%I:%M %p") for c in citas]
    return horas_ocupadas

@router.get("/proxima")
def obtener_proxima_cita(
    email: str,
    db: Session = Depends(get_db)
):
    """Retorna la próxima cita para un tutor específico por su email."""
    hoy = date.today()
    # Buscamos pacientes que tengan ese tutor_email (ignorando mayúsculas/minúsculas y espacios)
    pacientes = db.query(Paciente).filter(func.lower(Paciente.tutor_email) == email.lower().strip()).all()
    pacientes_ids = [p.id for p in pacientes]
    
    if not pacientes_ids:
        return None

    # Buscamos la cita más cercana (hoy o futuro) que no esté cancelada o completada
    proxima = db.query(Cita).filter(
        Cita.paciente_id.in_(pacientes_ids),
        Cita.fecha_programada >= hoy,
        Cita.estado.in_([EstadoCita.PENDIENTE, EstadoCita.PROGRAMADA, EstadoCita.REGISTRADA, EstadoCita.EN_PROGRESO])
    ).order_by(Cita.fecha_programada.asc(), Cita.hora_programada.asc()).first()

    if not proxima:
        return None

    return {
        "id": proxima.id,
        "fecha": proxima.fecha_programada.isoformat(),
        "hora": proxima.hora_programada.strftime("%I:%M %p"),
        "paciente": f"{proxima.paciente.nombre} {proxima.paciente.apellido}",
        "consultorio": proxima.consultorio.nombre if proxima.consultorio else "No especificado",
        "especialidad": proxima.consultorio.especialidad if proxima.consultorio else "Consulta General",
        "estado": proxima.estado
    }

@router.get("/")
def listar_citas(db: Session = Depends(get_db)):
    citas = db.query(Cita).all()
    return citas

@router.post("/")
def agendar_cita(cita: CitaCreate, db: Session = Depends(get_db)):
    # 1. Verificar si el consultorio existe
    consultorio = db.query(Consultorio).filter(Consultorio.id == cita.consultorio_id).first()
    if not consultorio:
        raise HTTPException(status_code=404, detail="Consultorio no encontrado")
    
    # 2. Parsear hora
    hora_time = parse_time(cita.hora_programada)
    
    # 3. Validar disponibilidad (Doble verificación en servidor)
    ocupada = db.query(Cita).filter(
        Cita.fecha_programada == cita.fecha_programada,
        Cita.hora_programada == hora_time,
        Cita.consultorio_id == cita.consultorio_id,
        Cita.estado.in_([EstadoCita.PENDIENTE, EstadoCita.PROGRAMADA, EstadoCita.REGISTRADA, EstadoCita.EN_PROGRESO, EstadoCita.COMPLETADA])
    ).first()
    
    if ocupada:
        raise HTTPException(status_code=400, detail="Lo sentimos, esta hora ya ha sido reservada.")
    
    # 4. Buscar o crear paciente
    tutor_email_clean = cita.tutor.email.lower().strip()
    paciente = db.query(Paciente).filter(
        Paciente.nombre == cita.paciente.nombre,
        Paciente.apellido == cita.paciente.apellido,
        Paciente.fecha_nac == cita.paciente.fecha_nac
    ).first()
    
    if not paciente:
        paciente = Paciente(
            nombre=cita.paciente.nombre,
            apellido=cita.paciente.apellido,
            fecha_nac=cita.paciente.fecha_nac,
            genero=cita.paciente.genero,
            tutor_nombre=cita.tutor.nombre,
            tutor_email=tutor_email_clean,
            tutor_telefono=cita.tutor.telefono
        )
        db.add(paciente)
        db.flush() # Para obtener el ID
    else:
        # Si el paciente ya existe, nos aseguramos de que el email esté actualizado si se proporcionó uno nuevo
        # o al menos que el existente esté limpio.
        if paciente.tutor_email.lower().strip() != tutor_email_clean:
            paciente.tutor_email = tutor_email_clean

    # 4. Crear la cita (Inicialmente PENDIENTE para flujo de aprobación)
    nueva_cita = Cita(
        paciente_id=paciente.id,
        consultorio_id=cita.consultorio_id,
        fecha_programada=cita.fecha_programada,
        hora_programada=hora_time,
        motivo=cita.tutor.motivo,
        estado=EstadoCita.PENDIENTE
    )
    db.add(nueva_cita)
    db.commit()
    db.refresh(nueva_cita)
    
    return {
        "message": "Solicitud de cita enviada correctamente. Pendiente de aprobación.",
        "id": nueva_cita.id
    }

@router.get("/pendientes")
def listar_citas_pendientes(db: Session = Depends(get_db)):
    """Retorna las citas que están esperando aprobación."""
    citas = db.query(Cita).filter(Cita.estado == EstadoCita.PENDIENTE).all()
    # Formatear para el frontend
    resultado = []
    for c in citas:
        resultado.append({
            "id": c.id,
            "paciente": f"{c.paciente.nombre} {c.paciente.apellido}",
            "fecha": c.fecha_programada.isoformat(),
            "hora": c.hora_programada.strftime("%I:%M %p"),
            "motivo": c.motivo,
            "tutor": c.paciente.tutor_nombre,
            "email": c.paciente.tutor_email
        })
    return resultado

@router.post("/{cita_id}/aceptar")
def aceptar_cita(cita_id: int, db: Session = Depends(get_db)):
    """Acepta una cita pendiente y envía correo de confirmación."""
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    if cita.estado != EstadoCita.PENDIENTE:
        raise HTTPException(status_code=400, detail="La cita no está en estado pendiente")
    
    cita.estado = EstadoCita.PROGRAMADA
    db.commit()
    db.refresh(cita)
    
    # Enviar correo de confirmación
    success, mail_msg = enviar_correo_confirmacion(
        destinatario=cita.paciente.tutor_email,
        nombre_paciente=f"{cita.paciente.nombre} {cita.paciente.apellido}",
        fecha=cita.fecha_programada.strftime("%d/%m/%Y"),
        hora=cita.hora_programada.strftime("%I:%M %p"),
        tutor=cita.paciente.tutor_nombre
    )
    
    if not success:
        return {
            "message": "Cita aceptada localmente, pero hubo un problema con el correo",
            "warning": mail_msg
        }
    
    return {"message": "Cita aceptada y correo enviado correctamente"}

@router.patch("/{cita_id}/status")
def actualizar_estado_cita(cita_id: int, data: CitaUpdateStatus, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    # Validar que el estado sea válido
    try:
        estado_anterior = cita.estado
        nuevo_estado = EstadoCita(data.estado)
        cita.estado = nuevo_estado
        db.commit()
        db.refresh(cita)
        
        # Registrar log de cambio de estado
        registrar_log(db, None, "EDITAR", "citas", cita.id, {"campo": "estado", "anterior": estado_anterior, "nuevo": data.estado})
        
        # Enviar correo si el nuevo estado es CANCELADA
        if nuevo_estado == EstadoCita.CANCELADA:
            enviar_correo_cancelacion(
                destinatario=cita.paciente.tutor_email,
                nombre_paciente=f"{cita.paciente.nombre} {cita.paciente.apellido}",
                fecha=cita.fecha_programada.strftime("%d/%m/%Y"),
                hora=cita.hora_programada.strftime("%I:%M %p"),
                tutor=cita.paciente.tutor_nombre
            )
        
        return {"message": f"Estado actualizado a {data.estado}", "estado": cita.estado}
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Estado inválido: {data.estado}")

@router.post("/{cita_id}/cancelar")
def cancelar_cita(cita_id: int, db: Session = Depends(get_db)):
    """Cancela una cita por parte del paciente."""
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    if cita.estado in [EstadoCita.CANCELADA, EstadoCita.COMPLETADA]:
        raise HTTPException(status_code=400, detail="La cita ya no puede ser cancelada")
    
    estado_anterior = cita.estado
    cita.estado = EstadoCita.CANCELADA
    db.commit()
    db.refresh(cita)
    
    # Registrar log de cancelación
    registrar_log(db, None, "CANCELAR", "citas", cita.id, {"campo": "estado", "anterior": estado_anterior, "nuevo": EstadoCita.CANCELADA})
    
    # Enviar correo de cancelación al paciente/tutor
    enviar_correo_cancelacion(
        destinatario=cita.paciente.tutor_email,
        nombre_paciente=f"{cita.paciente.nombre} {cita.paciente.apellido}",
        fecha=cita.fecha_programada.strftime("%d/%m/%Y"),
        hora=cita.hora_programada.strftime("%I:%M %p"),
        tutor=cita.paciente.tutor_nombre
    )
    
    return {"message": "Cita cancelada correctamente"}

@router.get("/historial")
def obtener_historial_citas(
    email: str,
    db: Session = Depends(get_db)
):
    """Retorna el historial de citas para un tutor específico por su email."""
    # Buscamos pacientes que tengan ese tutor_email
    pacientes = db.query(Paciente).filter(func.lower(Paciente.tutor_email) == email.lower().strip()).all()
    pacientes_ids = [p.id for p in pacientes]
    
    if not pacientes_ids:
        return []

    # Buscamos todas las citas pasadas, canceladas o completadas
    citas = db.query(Cita).filter(
        Cita.paciente_id.in_(pacientes_ids)
    ).order_by(Cita.fecha_programada.desc(), Cita.hora_programada.desc()).all()

    resultado = []
    for c in citas:
        # Buscamos entradas de expediente asociadas a este paciente y fecha
        entradas = []
        if c.paciente and c.paciente.entradas:
            for e in c.paciente.entradas:
                # Comparamos solo la fecha (ignorando hora)
                try:
                    fecha_entrada = e.fecha.date() if hasattr(e.fecha, 'date') else e.fecha
                    if fecha_entrada == c.fecha_programada:
                        entradas.append({
                            "tipo": e.tipo.value if hasattr(e.tipo, 'value') else str(e.tipo),
                            "descripcion": e.descripcion,
                            "procedimientos": e.descripcion
                        })
                except Exception as ex:
                    print(f"Error procesando entrada {e.id}: {str(ex)}")

        resultado.append({
            "id": c.id,
            "fecha": c.fecha_programada.isoformat() if c.fecha_programada else None,
            "hora": c.hora_programada.strftime("%I:%M %p") if c.hora_programada else None,
            "dia": c.fecha_programada.strftime("%A") if c.fecha_programada else None,
            "paciente": f"{c.paciente.nombre} {c.paciente.apellido}" if c.paciente else "Desconocido",
            "tutor": c.paciente.tutor_nombre if c.paciente else "Desconocido",
            "motivo": c.motivo,
            "medico": c.consultorio.medico if c.consultorio else "No especificado",
            "estado": c.estado.value if hasattr(c.estado, 'value') else str(c.estado),
            "expediente": entradas
        })
    
    return resultado

@router.delete("/historial")
def eliminar_historial_citas(
    email: str,
    db: Session = Depends(get_db)
):
    """Elimina todas las citas asociadas a los pacientes de un tutor específico."""
    # Buscamos pacientes que tengan ese tutor_email
    pacientes = db.query(Paciente).filter(func.lower(Paciente.tutor_email) == email.lower().strip()).all()
    pacientes_ids = [p.id for p in pacientes]
    
    if not pacientes_ids:
        return {"message": "No se encontraron citas para eliminar"}

    # Eliminamos todas las citas
    num_deleted = db.query(Cita).filter(Cita.paciente_id.in_(pacientes_ids)).delete(synchronize_session=False)
    db.commit()
    
    return {"message": f"Se han eliminado {num_deleted} citas del historial"}



