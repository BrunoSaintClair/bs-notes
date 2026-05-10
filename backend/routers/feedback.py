import os
import resend
from fastapi import APIRouter, HTTPException, status
from dotenv import load_dotenv

import schemas

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY", "")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "")

router = APIRouter()

@router.post("/", status_code=status.HTTP_200_OK)
def send_feedback(feedback: schemas.FeedbackCreate):
    if not resend.api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço de e-mail (Resend) não configurado."
        )

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

    params = {
        "from": "BS Notes <onboarding@resend.dev>",
        "to": [ADMIN_EMAIL],
        "subject": f"BS Notes — Novo feedback de {feedback.name}",
        "html": html_body,
    }

    if feedback.email:
        params["reply_to"] = feedback.email

    try:
        resend.Emails.send(params)
    except Exception as e:
        print(f"Erro ao enviar e-mail com Resend: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao enviar mensagem. Tente novamente mais tarde."
        )

    return {"status": "ok"}
