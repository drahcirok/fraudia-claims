from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from src.rules.fraud_rules import evaluar_siniestro
from src.ai_agent.claims_agent import redactar_explicacion
from typing import List
from fastapi.middleware.cors import CORSMiddleware

# Cargar variables de entorno
load_dotenv()

app = FastAPI(title="FraudIA API - Aseguradora del Sur")

# --- Configuración CORS para que el frontend pueda conectarse ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite cualquier origen (ideal para desarrollo local en hackathons)
    allow_credentials=True,
    allow_methods=["*"],  # Permite GET, POST, etc.
    allow_headers=["*"],
)
# ----------------------------------------------------------------------

# Inicializar Supabase
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_ANON_KEY")
if not url or not key:
    raise RuntimeError("Faltan las credenciales de Supabase en el .env")

supabase: Client = create_client(url, key)

# Modelo de datos para el formulario del frontend
class NuevoSiniestroRequest(BaseModel):
    dias_entre_ocurrencia_reporte: int
    monto_reclamado: float
    cobertura: str
    reclamos_12_meses: int
    descripcion: str = ""  # <--- CABLE 1: Recibimos la descripción del frontend

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend de FraudIA corriendo al 100%"}

@app.get("/api/siniestros")
def listar_siniestros_priorizados():
    """
    Devuelve los siniestros de Supabase evaluados por el motor de reglas.
    Ideal para poblar la 'Bandeja Semáforo' del dashboard.
    """
    try:
        # Traemos una muestra de 20 siniestros para la demo
        res_siniestros = supabase.table('siniestros').select('*').limit(20).execute()
        res_asegurados = supabase.table('asegurados_sinteticos').select('*').execute()
        
        # Mapeamos los asegurados por ID para búsqueda rápida
        asegurados_dict = {a['id_asegurado']: a for a in res_asegurados.data}
        
        resultados = []
        for sin in res_siniestros.data:
            asegurado = asegurados_dict.get(sin['id_asegurado'], {})
            
            # Pasamos por nuestro motor de reglas
            evaluacion = evaluar_siniestro(sin, asegurado)
            
            # Unimos los datos del siniestro con su evaluación de riesgo
            caso_completo = {**sin, **evaluacion}
            resultados.append(caso_completo)
            
        # Ordenamos por score descendente (los críticos rojos aparecen primero)
        resultados.sort(key=lambda x: x['score_reglas'], reverse=True)
        return resultados
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/evaluar")
def evaluar_nuevo_siniestro(request: NuevoSiniestroRequest):
    siniestro = {
        "dias_entre_ocurrencia_reporte": request.dias_entre_ocurrencia_reporte,
        "monto_reclamado": request.monto_reclamado,
        "cobertura": request.cobertura,
        "descripcion_hechos": request.descripcion # <--- CABLE 2: Lo pasamos al motor de reglas
    }
    asegurado = { "reclamos_12_meses": request.reclamos_12_meses }

    # 1. El motor de reglas calcula el riesgo (ahora con IA de vectores)
    resultado = evaluar_siniestro(siniestro, asegurado)

    # 2. La IA lee el resultado y redacta la explicación
    explicacion_ia = redactar_explicacion(
        siniestro=siniestro,
        nivel_riesgo=resultado['nivel_riesgo'],
        score=resultado['score_reglas'],
        alertas=resultado['alertas']
    )

    # 3. Le devuelves el paquete completo a tu compañero de frontend
    resultado['explicacion_agente'] = explicacion_ia
    return resultado

class ChatMessage(BaseModel):
    message: str

@app.post("/api/chat")
def chat_con_agente(request: ChatMessage):
    """
    Endpoint para el Chat UI.
    """
    try:
        # 1. Traer los siniestros más críticos como "Contexto" para la IA
        res_siniestros = supabase.table('siniestros').select('id_siniestro, monto_reclamado, cobertura, score_reglas, nivel_riesgo').order('score_reglas', desc=True).limit(5).execute()
        
        # Formatear el contexto en texto plano
        contexto = "Siniestros Críticos Actuales (Top 5):\n"
        for sin in res_siniestros.data:
            contexto += f"- ID: {sin['id_siniestro']} | Cobertura: {sin['cobertura']} | Monto: ${sin['monto_reclamado']} | Riesgo: {sin['nivel_riesgo']} (Score: {sin['score_reglas']})\n"
        
        # 2. Instanciar el provider y generar respuesta
        from src.ai_agent.llm_provider import LLMProvider
        provider = LLMProvider()
        
        # Le pedimos explícitamente que use Markdown para verse bien en el frontend
        prompt_enriquecido = f"{request.message}\n\nPor favor, formatea tu respuesta usando Markdown (listas con viñetas, negritas) para que sea fácil de leer en un dashboard."
        respuesta_ia = provider.chat(user_message=prompt_enriquecido, context_data=contexto)
        
        return {"response": respuesta_ia}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))