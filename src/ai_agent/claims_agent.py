import json
from src.ai_agent.llm_provider import LLMProvider

# Instanciamos nuestro proveedor
provider = LLMProvider()

def redactar_explicacion(siniestro: dict, nivel_riesgo: str, score: int, alertas: list) -> str:
    """
    Agente IA que redacta un resumen para el analista sin acusar de fraude.
    Cumple con el requerimiento de Explicabilidad y Ética del hackathon.
    """
    # Si todo está bien, no gastamos tokens de IA en vano
    if nivel_riesgo == "Verde":
        return "Caso sin anomalías detectadas. Continuar con flujo normal de liquidación."

    # Prompt dinámico (Ingeniería de prompts)
    prompt = f"""
    Eres un Agente Experto en Riesgos para 'Aseguradora del Sur'.
    Tu objetivo es ayudar a un analista humano a entender por qué un siniestro obtuvo un nivel de riesgo '{nivel_riesgo}' (Score: {score}/100).
    
    REGLAS ESTRICTAS DE ÉTICA:
    1. PROHIBIDO acusar de fraude. Usa términos como "anomalía", "patrón atípico" o "requiere revisión documental".
    2. Redacta un párrafo ejecutivo corto y directo (máximo 3-4 líneas).
    3. Basa tu resumen ÚNICAMENTE en estas alertas detectadas por el sistema: {json.dumps(alertas)}
    
    DATOS DEL SINIESTRO:
    - Cobertura afectada: {siniestro.get('cobertura')}
    - Monto reclamado: ${siniestro.get('monto_reclamado')}
    - Días en reportar: {siniestro.get('dias_entre_ocurrencia_reporte')} días.
    
    Por favor, genera el resumen para el analista:
    """
    
    # Llamamos a Gemini
    return provider.generate_text(prompt)

def procesar_narrativa(texto_reclamo: str) -> list[float]:
    """
    Convierte la narrativa del cliente en un embedding vectorial de 768 dimensiones.
    Esto permite a pgvector detectar si la historia es un "clon" exacto de otra[cite: 138, 473].
    """
    return provider.generate_embedding(texto_reclamo)