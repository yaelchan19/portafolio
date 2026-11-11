from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Cita, Paciente, EstadoCita, Usuario
from app.routes.auth import hash_password, check_role, get_current_user
from app.schemas.recepcionista import RecepcionistaCreate, RecepcionistaUpdate, RecepcionistaResponse
from datetime import date
from typing import List, Optional

router = APIRouter(prefix="/medico", tags=["Médico"])

# Dependencia para asegurar que solo médicos accedan a estas rutas
medico_only = check_role(["medico"])

@router.get("/mis-citas")
def obtener_mis_citas(
    fecha: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Obtiene las citas del día (o fecha específica) que están en estado 'En Progreso' o 'Registrada' 
    para la vista del médico.
    """
    fecha_consulta = fecha if fecha else date.today()
    # Filtramos por fecha y estados relevantes para el médico (Solo pendientes de atender o en curso)
    citas = db.query(Cita).filter(
        Cita.fecha_programada == fecha_consulta,
        Cita.estado.in_([EstadoCita.REGISTRADA, EstadoCita.EN_PROGRESO, EstadoCita.PROGRAMADA, EstadoCita.COMPLETADA])
    ).order_by(Cita.hora_programada).all()
    
    resultado = []
    for c in citas:
        p = c.paciente
        resultado.append({
            "id": c.id,
            "paciente_id": p.id,
            "hora": c.hora_programada.strftime("%I:%M %p"),
            "paciente": f"{p.nombre} {p.apellido}",
            "motivo": c.motivo,
            "estado": c.estado,
            "genero": p.genero,
            "edad": (date.today().year - p.fecha_nac.year - ((date.today().month, date.today().day) < (p.fecha_nac.month, p.fecha_nac.day))),
            "consultorio": c.consultorio.nombre if c.consultorio else "No especificado"
        })
    return resultado

@router.get("/atendidos")
def obtener_pacientes_atendidos(
    fecha: date = Query(...),
    db: Session = Depends(get_db)
):
    """
    Obtiene los pacientes que fueron atendidos en una fecha específica.
    """
    # Filtramos por fecha y estado COMPLETADA
    citas = db.query(Cita).filter(
        Cita.fecha_programada == fecha,
        Cita.estado == EstadoCita.COMPLETADA
    ).order_by(Cita.hora_programada).all()
    
    resultado = []
    for c in citas:
        p = c.paciente
        resultado.append({
            "id": c.id,
            "paciente_id": p.id,
            "hora": c.hora_programada.strftime("%I:%M %p"),
            "paciente": f"{p.nombre} {p.apellido}",
            "motivo": c.motivo,
            "genero": p.genero,
            "edad": (date.today().year - p.fecha_nac.year - ((date.today().month, date.today().day) < (p.fecha_nac.month, p.fecha_nac.day))),
            "consultorio": c.consultorio.nombre if c.consultorio else "No especificado",
            "tutor": p.tutor_nombre
        })
    return resultado

@router.get("/stats")
def obtener_estadisticas_medico(db: Session = Depends(get_db)):
    hoy = date.today()
    
    # 1. Citas Programadas (Citas aceptadas por recepción que aún no pasan a consulta)
    citas_programadas = db.query(Cita).filter(
        Cita.fecha_programada == hoy,
        Cita.estado.in_([EstadoCita.PROGRAMADA, EstadoCita.REGISTRADA])
    ).count()
    
    # 2. Atendiendo (Citas actualmente en progreso hoy)
    atendidos = db.query(Cita).filter(
        Cita.fecha_programada == hoy,
        Cita.estado == EstadoCita.EN_PROGRESO
    ).count()
    
    # 3. Pendientes (Alias de programadas para mantener compatibilidad si se requiere)
    pendientes = citas_programadas
    
    # 4. Urgencias (Placeholder en 0 ya que no hay campo de urgencia en el modelo actual)
    urgencias = 0

    # 5. Siguiente Paciente (Primera cita del día con estado PROGRAMADA o REGISTRADA)
    proxima_cita = db.query(Cita).filter(
        Cita.fecha_programada == hoy,
        Cita.estado.in_([EstadoCita.PROGRAMADA, EstadoCita.REGISTRADA])
    ).order_by(Cita.hora_programada).first()

    siguiente_paciente = None
    if proxima_cita:
        p = proxima_cita.paciente
        siguiente_paciente = {
            "nombre": f"{p.nombre} {p.apellido}",
            "iniciales": f"{p.nombre[0]}{p.apellido[0]}".upper(),
            "motivo": proxima_cita.motivo or "Consulta general",
            "hora": proxima_cita.hora_programada.strftime("%I:%M %p")
        }
    
    return {
        "citas_programadas": citas_programadas,
        "atendidos": atendidos,
        "pendientes": pendientes,
        "urgencias": urgencias,
        "siguiente_paciente": siguiente_paciente
    }

# Gestión de Recepcionistas por parte del Médico
@router.post("/recepcionistas", response_model=RecepcionistaResponse, status_code=status.HTTP_201_CREATED)
def crear_recepcionista(
    data: RecepcionistaCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(medico_only)
):
    # Verificar si el email ya existe
    if db.query(Usuario).filter(Usuario.email == data.email).first():
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    
    # Verificar si el username ya existe
    if db.query(Usuario).filter(Usuario.username == data.username).first():
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso")
    
    nuevo_recepcionista = Usuario(
        nombre=data.nombre,
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
        rol="recepcionista",
        telefono=data.telefono,
        fecha_ingreso=data.fecha_ingreso,
        identificacion_oficial=data.identificacion_oficial,
        direccion=data.direccion,
        rfc=data.rfc,
        medico_id=current_user.id
    )
    db.add(nuevo_recepcionista)
    db.commit()
    db.refresh(nuevo_recepcionista)
    return nuevo_recepcionista

@router.get("/recepcionistas", response_model=List[RecepcionistaResponse])
def listar_recepcionistas(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(medico_only)
):
    return db.query(Usuario).filter(
        Usuario.rol == "recepcionista",
        Usuario.medico_id == current_user.id
    ).all()

@router.put("/recepcionistas/{recepcionista_id}", response_model=RecepcionistaResponse)
def actualizar_recepcionista(
    recepcionista_id: int,
    data: RecepcionistaUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(medico_only)
):
    recepcionista = db.query(Usuario).filter(
        Usuario.id == recepcionista_id,
        Usuario.medico_id == current_user.id
    ).first()
    
    if not recepcionista:
        raise HTTPException(status_code=404, detail="Recepcionista no encontrado o no pertenece a este médico")
    
    if data.nombre is not None: recepcionista.nombre = data.nombre
    if data.email is not None:
        if db.query(Usuario).filter(Usuario.email == data.email, Usuario.id != recepcionista_id).first():
            raise HTTPException(status_code=400, detail="El correo ya está en uso")
        recepcionista.email = data.email
    if data.username is not None:
        if db.query(Usuario).filter(Usuario.username == data.username, Usuario.id != recepcionista_id).first():
            raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso")
        recepcionista.username = data.username
    if data.password:
        recepcionista.password_hash = hash_password(data.password)
    
    if data.telefono is not None: recepcionista.telefono = data.telefono
    if data.fecha_ingreso is not None: recepcionista.fecha_ingreso = data.fecha_ingreso
    if data.identificacion_oficial is not None: recepcionista.identificacion_oficial = data.identificacion_oficial
    if data.direccion is not None: recepcionista.direccion = data.direccion
    if data.rfc is not None: recepcionista.rfc = data.rfc
    
    db.commit()
    db.refresh(recepcionista)
    return recepcionista

@router.delete("/recepcionistas/{recepcionista_id}")
def eliminar_recepcionista(
    recepcionista_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(medico_only)
):
    recepcionista = db.query(Usuario).filter(
        Usuario.id == recepcionista_id,
        Usuario.medico_id == current_user.id
    ).first()
    
    if not recepcionista:
        raise HTTPException(status_code=404, detail="Recepcionista no encontrado o no pertenece a este médico")
    
    db.delete(recepcionista)
    db.commit()
    return {"message": "Recepcionista eliminado correctamente"}
