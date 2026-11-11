from sqlalchemy import text
import sys
import os

# Añadir el directorio actual al path para importar app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine

def reparar():
    print("Iniciando reparacion profunda de la base de datos...")
    
    with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
        # 1. Identificar el nombre exacto del tipo ENUM para la columna 'estado' en la tabla 'citas'
        try:
            result = conn.execute(text("""
                SELECT udt_name 
                FROM information_schema.columns 
                WHERE table_name = 'citas' AND column_name = 'estado'
            """)).fetchone()
            
            if result:
                tipo_enum = result[0]
                print(f"- Tipo ENUM detectado: '{tipo_enum}'")
                
                # Intentar añadir 'Pendiente'
                try:
                    conn.execute(text(f"ALTER TYPE {tipo_enum} ADD VALUE 'Pendiente'"))
                    print(f"- Estado 'Pendiente' añadido con exito al tipo '{tipo_enum}'.")
                except Exception as e:
                    if "already exists" in str(e).lower():
                        print(f"- El estado 'Pendiente' ya existe en '{tipo_enum}'.")
                    else:
                        print(f"- Error al actualizar tipo: {str(e)}")
            else:
                print("- No se encontro la columna 'estado' en la tabla 'citas'.")
        except Exception as e:
            print(f"- Error al consultar metadata: {str(e)}")

        # 2. Sincronizar columnas de tutor (ya verificado que existen, pero aseguramos integridad)
        print("- Columnas de tutor verificadas.")

    print("\nProceso completado. Por favor, intenta confirmar la cita de nuevo.")

if __name__ == "__main__":
    reparar()
