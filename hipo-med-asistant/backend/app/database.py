from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Configuración de la URL de la base de datos PostgreSQL
# Formato: postgresql://usuario:contraseña@servidor:puerto/nombre_bd
# Ajusta el usuario y contraseña según tu configuración local de PostgreSQL
DB_USER = "postgres"
DB_PASSWORD = "151954"  # 👈 Cambia esto por tu contraseña real
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "clinica"

SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Crear el motor de SQLAlchemy
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Crear una sesión local vinculada al motor
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos de la base de datos
Base = declarative_base()

# Función para obtener la sesión de la base de datos (Inyección de dependencia en FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
