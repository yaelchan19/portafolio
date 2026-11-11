import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# Configuración SMTP (Usando variables de entorno o valores por defecto)
# RECOMENDACIÓN: Para producción, usa una cuenta de Gmail App Password o SendGrid
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "renserrr86@gmail.com")  # 👈 Cambia esto
SMTP_PASS = os.getenv("SMTP_PASS", "iwatifjogjazgave")      # 👈 Cambia esto
CLINICA_NOMBRE = "Clínica Infantil Pro"

##SMTP_HOST=smtp.gmail.com
##SMTP_PORT=587
##SMTP_USER=renserrr86@gmail.com
##SMTP_PASS=iwatifjogjazgave  # App Password
##SMTP_FROM=renserrr86@gmail.com

import logging
logger = logging.getLogger(__name__)

def enviar_correo_confirmacion(destinatario: str, nombre_paciente: str, fecha: str, hora: str, tutor: str):
    """
    Envía un correo electrónico de confirmación de cita.
    """
    # Verificación de credenciales configuradas
    if "tu-correo" in SMTP_USER or "tu-app-password" in SMTP_PASS:
        logger.warning("ALERTA: El servicio de correo no ha sido configurado con credenciales reales.")
        return False, "Credenciales SMTP no configuradas"

    try:
        msg = MIMEMultipart()
        msg['From'] = f"{CLINICA_NOMBRE} <{SMTP_USER}>"
        msg['To'] = destinatario
        msg['Subject'] = f"Confirmación de Cita - {CLINICA_NOMBRE}"

        cuerpo = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <span style="font-size: 40px;">🏥</span>
                </div>
                <h2 style="color: #4f46e5; text-align: center;">¡Cita Confirmada!</h2>
                <p>Estimado/a <strong>{tutor}</strong>,</p>
                <p>Nos complace informarle que la cita para <strong>{nombre_paciente}</strong> ha sido aceptada y programada correctamente.</p>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #e5e7eb;">
                    <p style="margin: 5px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Detalles de la Cita</p>
                    <p style="margin: 10px 0; font-size: 16px;"><strong>Clínica:</strong> {CLINICA_NOMBRE}</p>
                    <p style="margin: 10px 0; font-size: 16px;"><strong>Fecha:</strong> {fecha}</p>
                    <p style="margin: 10px 0; font-size: 16px;"><strong>Hora:</strong> {hora}</p>
                </div>

                <p style="font-size: 14px;"><strong>Nota importante:</strong> Por favor, llegue 10 minutos antes de su cita. Si necesita cancelar o reprogramar, contáctenos lo antes posible.</p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="text-align: center; color: #9ca3af; font-size: 11px; margin-top: 20px;">
                    Este es un mensaje automático generado por el sistema de {CLINICA_NOMBRE}.<br>
                    Por favor, no responda directamente a este correo.
                </p>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(cuerpo, 'html'))

        logger.info(f"Intentando enviar correo a {destinatario}...")
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.set_debuglevel(0) # Cambiar a 1 para debug detallado en consola
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
            
        logger.info(f"✅ Correo enviado con éxito a {destinatario}")
        return True, "Correo enviado"
    except Exception as e:
        logger.error(f"❌ Error al enviar correo a {destinatario}: {str(e)}")
        return False, str(e)

def enviar_correo_cancelacion(destinatario: str, nombre_paciente: str, fecha: str, hora: str, tutor: str):
    """
    Envía un correo electrónico de notificación de cancelación de cita.
    """
    if "tu-correo" in SMTP_USER or "tu-app-password" in SMTP_PASS:
        logger.warning("ALERTA: El servicio de correo no ha sido configurado.")
        return False, "SMTP no configurado"

    try:
        msg = MIMEMultipart()
        msg['From'] = f"{CLINICA_NOMBRE} <{SMTP_USER}>"
        msg['To'] = destinatario
        msg['Subject'] = f"Notificación de Cancelación de Cita - {CLINICA_NOMBRE}"

        cuerpo = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <span style="font-size: 40px;">📅</span>
                </div>
                <h2 style="color: #f43f5e; text-align: center;">Cita Cancelada</h2>
                <p>Estimado/a <strong>{tutor}</strong>,</p>
                <p>Le informamos que la cita programada para <strong>{nombre_paciente}</strong> ha sido <strong>cancelada</strong>.</p>
                
                <div style="background-color: #fff1f2; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #fecdd3;">
                    <p style="margin: 5px 0; font-size: 14px; color: #9f1239; text-transform: uppercase; font-weight: bold;">Detalles de la Cita Cancelada</p>
                    <p style="margin: 10px 0; font-size: 16px;"><strong>Fecha:</strong> {fecha}</p>
                    <p style="margin: 10px 0; font-size: 16px;"><strong>Hora:</strong> {hora}</p>
                </div>

                <p style="font-size: 14px;">Si usted no solicitó esta cancelación o desea agendar una nueva cita, por favor póngase en contacto con nosotros o utilice nuestra plataforma virtual.</p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="text-align: center; color: #9ca3af; font-size: 11px; margin-top: 20px;">
                    Atentamente,<br>
                    <strong>El equipo de {CLINICA_NOMBRE}</strong>
                </p>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(cuerpo, 'html'))
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
            
        logger.info(f"✅ Correo de cancelación enviado con éxito a {destinatario}")
        return True, "Correo enviado"
    except Exception as e:
        logger.error(f"❌ Error al enviar correo de cancelación a {destinatario}: {str(e)}")
        return False, str(e)
