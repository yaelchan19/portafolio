from sqlalchemy import text
import sys
import os

# Añadir el directorio actual al path para importar app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine

def migrate():
    print("Migrando tabla 'usuarios' para soportar recepcionistas...")
    
    with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
        columns = [
            ("telefono", "VARCHAR(50)"),
            ("fecha_ingreso", "DATE"),
            ("identificacion_oficial", "VARCHAR(200)"),
            ("direccion", "TEXT"),
            ("rfc", "VARCHAR(20)"),
            ("medico_id", "INTEGER")
        ]
        
        for col_name, col_type in columns:
            try:
                # Verificar si la columna ya existe
                res = conn.execute(text(f"SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = '{col_name}'")).fetchone()
                
                if not res:
                    print(f"- Añadiendo columna '{col_name}'...")
                    conn.execute(text(f"ALTER TABLE usuarios ADD COLUMN {col_name} {col_type}"))
                    
                    # Si es medico_id, añadir la foreign key por separado
                    if col_name == "medico_id":
                        try:
                            conn.execute(text("ALTER TABLE usuarios ADD CONSTRAINT fk_usuarios_medico FOREIGN KEY (medico_id) REFERENCES usuarios(id) ON DELETE SET NULL"))
                            print("  - Constraint de llave foranea añadido.")
                        except Exception as fk_e:
                            print(f"  - No se pudo añadir la llave foranea: {str(fk_e)}")
                else:
                    print(f"- La columna '{col_name}' ya existe.")
            except Exception as e:
                print(f"- Error al añadir columna '{col_name}': {str(e)}")

    print("\nMigración completada.")

if __name__ == "__main__":
    migrate()
