import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import APIRouter, HTTPException, status
from dotenv import load_dotenv

import schemas

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "")

router = APIRouter()

@router.post("/", status_code=status.HTTP_200_OK)
def send_feedback(feedback: schemas.FeedbackCreate):
    if not SMTP_USER or not SMTP_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço de e-mail não configurado."
        )

    sender_info = feedback.name
    if feedback.email:
        sender_info += f" ({feedback.email})"

    subject = f"BS Notes — Novo feedback de {feedback.name}"

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 8px;">
            Novo Feedback — BS Notes
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #374151; width: 80px;">Nome:</td>
                <td style="padding: 8px 12px; color: #1f2937;">{feedback.name}</td>
            </tr>
            <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #374151;">E-mail:</td>
                <td style="padding: 8px 12px; color: #1f2937;">{feedback.email or "Não informado"}</td>
            </tr>
        </table>
        <div style="margin-top: 20px; padding: 16px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #374151;">Mensagem:</p>
            <p style="margin: 0; color: #1f2937; white-space: pre-wrap; line-height: 1.6;">{feedback.message}</p>
        </div>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = ADMIN_EMAIL
    if feedback.email:
        msg["Reply-To"] = feedback.email

    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, ADMIN_EMAIL, msg.as_string())
    except Exception as e:
        print(f"Erro ao enviar e-mail: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao enviar mensagem. Tente novamente mais tarde."
        )

    return {"status": "ok"}
