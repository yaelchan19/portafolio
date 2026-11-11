from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Usuario
from app.routes.auth import hash_password, check_role
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import date

router = APIRouter(prefix="/usuarios", tags=["Gestión de Usuarios"])

# Dependencia para verificar que sea administrador
admin_only = check_role(["admin"])

class UsuarioBase(BaseModel):
    nombre: str
    username: str
    email: EmailStr
    rol: str
    activo: Optional[bool] = True
    
    # Campos dinámicos
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

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    rol: Optional[str] = None
    activo: Optional[bool] = None
    password: Optional[str] = None
    
    # Campos dinámicos
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

@router.get("/", response_model=List[dict])
def listar_usuarios(rol: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Usuario)
    if rol:
        query = query.filter(Usuario.rol == rol)
    usuarios = query.all()
    return [
        {
            "id": u.id, 
            "nombre": u.nombre, 
            "username": u.username,
            "email": u.email, 
            "rol": u.rol, 
            "activo": u.activo,
            "telefono": u.telefono,
            "direccion": u.direccion,
            "identificacion_oficial": u.identificacion_oficial,
            "especialidad": u.especialidad,
            "cedula_profesional": u.cedula_profesional,
            "universidad_egreso": u.universidad_egreso,
            "horario_atencion": u.horario_atencion,
            "consultorio_pref": u.consultorio_pref,
            "fecha_ingreso": u.fecha_ingreso,
            "rfc": u.rfc
        } for u in usuarios
    ]

@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    db_username = db.query(Usuario).filter(Usuario.username == usuario.username).first()
    if db_username:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya existe")
    
    nuevo_usuario = Usuario(
        nombre=usuario.nombre,
        username=usuario.username,
        email=usuario.email,
        rol=usuario.rol,
        password_hash=hash_password(usuario.password),
        activo=usuario.activo,
        # Campos dinámicos
        telefono=usuario.telefono,
        direccion=usuario.direccion,
        identificacion_oficial=usuario.identificacion_oficial,
        especialidad=usuario.especialidad,
        cedula_profesional=usuario.cedula_profesional,
        universidad_egreso=usuario.universidad_egreso,
        horario_atencion=usuario.horario_atencion,
        consultorio_pref=usuario.consultorio_pref,
        fecha_ingreso=usuario.fecha_ingreso,
        rfc=usuario.rfc
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return {"message": "Usuario creado exitosamente", "id": nuevo_usuario.id}

@router.put("/{usuario_id}")
def actualizar_usuario(usuario_id: int, data: UsuarioUpdate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    if data.nombre: db_usuario.nombre = data.nombre
    if data.username:
        db_username = db.query(Usuario).filter(Usuario.username == data.username, Usuario.id != usuario_id).first()
        if db_username:
            raise HTTPException(status_code=400, detail="El nombre de usuario ya existe")
        db_usuario.username = data.username
    if data.email:
        db_email = db.query(Usuario).filter(Usuario.email == data.email, Usuario.id != usuario_id).first()
        if db_email:
            raise HTTPException(status_code=400, detail="El email ya está registrado")
        db_usuario.email = data.email
    if data.rol: db_usuario.rol = data.rol
    if data.activo is not None: db_usuario.activo = data.activo
    if data.password: db_usuario.password_hash = hash_password(data.password)
    
    # Campos dinámicos
    if data.telefono is not None: db_usuario.telefono = data.telefono
    if data.direccion is not None: db_usuario.direccion = data.direccion
    if data.identificacion_oficial is not None: db_usuario.identificacion_oficial = data.identificacion_oficial
    if data.especialidad is not None: db_usuario.especialidad = data.especialidad
    if data.cedula_profesional is not None: db_usuario.cedula_profesional = data.cedula_profesional
    if data.universidad_egreso is not None: db_usuario.universidad_egreso = data.universidad_egreso
    if data.horario_atencion is not None: db_usuario.horario_atencion = data.horario_atencion
    if data.consultorio_pref is not None: db_usuario.consultorio_pref = data.consultorio_pref
    if data.fecha_ingreso is not None: db_usuario.fecha_ingreso = data.fecha_ingreso
    if data.rfc is not None: db_usuario.rfc = data.rfc
    
    db.commit()
    return {"message": "Usuario actualizado correctamente"}

@router.delete("/{usuario_id}")
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    db.delete(db_usuario)
    db.commit()
    return {"message": "Usuario eliminado correctamente"}
