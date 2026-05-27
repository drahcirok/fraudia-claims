from src.ai_agent.claims_agent import redactar_explicacion

def run_test():
    # Simulamos un caso grave (Nivel Rojo) para ver cómo lo maneja la IA
    siniestro_mock = {
        "cobertura": "Robo",
        "monto_reclamado": 14500,
        "dias_entre_ocurrencia_reporte": 10
    }
    nivel = "Rojo"
    score = 85
    
    # Estas son las alertas que tu motor de reglas (fraud_rules.py) generó
    alertas = [
        "RF-01: Reclamo involucra cobertura de Robo (Requiere revisión rigurosa).",
        "Reporte tardío: Demora mayor a 7 días en notificar el evento.",
        "Monto inusual: El valor reclamado es atípicamente alto para el perfil."
    ]

    print("\n--- INICIANDO PRUEBA DEL AGENTE IA (GEMINI) ---")
    print("Consultando a Google Gemini 2.0 Flash...")

    # Disparamos la función
    explicacion = redactar_explicacion(siniestro_mock, nivel, score, alertas)

    print("\n🤖 Respuesta generada por el Agente:")
    print("-" * 60)
    print(explicacion)
    print("-" * 60)
    print("\n--- PRUEBA FINALIZADA ---")

if __name__ == "__main__":
    run_test()