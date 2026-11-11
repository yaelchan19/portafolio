from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Usuario
from app.schemas.auth import LoginRequest, RegisterRequest, AuthResponse, UserUpdate, PasswordUpdate
from passlib.context import CryptContext
from app.utils.auditoria import registrar_log
from datetime import datetime, timedelta
from typing import Optional
import os
import jwt

router = APIRouter(prefix="/auth", tags=["Autenticación"])

# Configuración JWT
JWT_SECRET = os.getenv("JWT_SECRET", "clinica-infantil-super-secreto-2024")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Contexto para encriptar contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        return None
    try:
        # Extraer token del encabezado Authorization: Bearer <token>
        parts = authorization.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return None
            
        token = parts[1]
        payload = decode_token(token)
        user_id = payload.get("user_id")
        if user_id is None:
            return None
        usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
        return usuario
    except Exception as e:
        print(f"Error en get_current_user: {str(e)}")
        return None

def require_role(allowed_roles: list):
    def role_checker(user: Usuario = Depends(get_current_user)):
        if not user:
            raise HTTPException(status_code=401, detail="No autenticado")
        if user.rol not in allowed_roles:
            raise HTTPException(status_code=403, detail="No tienes permisos para realizar esta acción")
        return user
    return role_checker

check_role = require_role

@router.put("/update-profile/{email}", response_model=AuthResponse)
def update_profile(email: str, data: UserUpdate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if data.nombre is not None:
        usuario.nombre = data.nombre
    if data.username is not None:
        # Verificar si el nuevo username ya existe
        username_existe = db.query(Usuario).filter(Usuario.username == data.username, Usuario.id != usuario.id).first()
        if username_existe:
            raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso")
        usuario.username = data.username
    if data.email is not None:
        if data.email != email:
            email_existe = db.query(Usuario).filter(Usuario.email == data.email, Usuario.id != usuario.id).first()
            if email_existe:
                raise HTTPException(status_code=400, detail="El correo ya está en uso")
            usuario.email = data.email
    if data.rol is not None:
        usuario.rol = data.rol

    db.commit()
    db.refresh(usuario)

    return {
        "message": "Perfil actualizado correctamente",
        "user": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "username": usuario.username,
            "email": usuario.email,
            "rol": usuario.rol,
            "creado_en": usuario.creado_en.isoformat() if usuario.creado_en else None,
            "cedula_profesional": usuario.cedula_profesional,
            "rfc": usuario.rfc,
            "especialidad": usuario.especialidad
        }
    }

@router.put("/update-password/{email}", response_model=AuthResponse)
def update_password(email: str, data: PasswordUpdate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if not verify_password(data.current_password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="La contraseña actual es incorrecta")

    usuario.password_hash = hash_password(data.new_password)
    db.commit()

    return {"message": "Contraseña actualizada correctamente"}

@router.post("/register", response_model=AuthResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    # Verificar si el email ya existe
    usuario_existente = db.query(Usuario).filter(Usuario.email == data.email).first()
    if usuario_existente:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    # Verificar si el username ya existe
    username_existente = db.query(Usuario).filter(Usuario.username == data.username).first()
    if username_existente:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso")

    # Guardar usuario con contraseña encriptada
    nuevo_usuario = Usuario(
        nombre=data.nombre,
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
        rol=data.rol,
        # Campos dinámicos
        telefono=data.telefono,
        direccion=data.direccion,
        identificacion_oficial=data.identificacion_oficial,
        especialidad=data.especialidad,
        cedula_profesional=data.cedula_profesional,
        universidad_egreso=data.universidad_egreso,
        horario_atencion=data.horario_atencion,
        consultorio_pref=data.consultorio_pref,
        fecha_ingreso=data.fecha_ingreso,
        rfc=data.rfc
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    # Generar token para el nuevo usuario
    access_token = create_access_token({"user_id": nuevo_usuario.id, "rol": nuevo_usuario.rol})

    return {
        "message": "Usuario registrado correctamente",
        "access_token": access_token,
        "user": {
            "id": nuevo_usuario.id,
            "nombre": nuevo_usuario.nombre,
            "username": nuevo_usuario.username,
            "email": nuevo_usuario.email,
            "rol": nuevo_usuario.rol,
            "creado_en": nuevo_usuario.creado_en.isoformat() if nuevo_usuario.creado_en else None,
            "cedula_profesional": nuevo_usuario.cedula_profesional,
            "rfc": nuevo_usuario.rfc,
            "especialidad": nuevo_usuario.especialidad
        }
    }

@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.username == data.username).first()

    if not usuario or not verify_password(data.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    if not usuario.activo:
        raise HTTPException(status_code=401, detail="Usuario desactivado")

    # Registrar log de login
    registrar_log(db, usuario.id, "LOGIN", "usuarios", usuario.id, {"username": usuario.username})

    # Generar JWT
    access_token = create_access_token({"user_id": usuario.id, "rol": usuario.rol})

    return {
        "message": "Login exitoso",
        "access_token": access_token,
        "user": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "username": usuario.username,
            "email": usuario.email,
            "rol": usuario.rol,
            "creado_en": usuario.creado_en.isoformat() if usuario.creado_en else None,
            "cedula_profesional": usuario.cedula_profesional,
            "rfc": usuario.rfc,
            "especialidad": usuario.especialidad
        }
    }

@router.get("/me")
def get_me(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No token provided")

    # Extraer token
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid token format")

    token = parts[1]
    payload = decode_token(token)
    user_id = payload.get("user_id")

    usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return {
        "id": usuario.id,
        "nombre": usuario.nombre,
        "username": usuario.username,
        "email": usuario.email,
        "rol": usuario.rol,
        "creado_en": usuario.creado_en.isoformat() if usuario.creado_en else None
    }
