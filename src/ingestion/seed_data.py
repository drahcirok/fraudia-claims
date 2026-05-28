import os
import random
from supabase import create_client, Client
from dotenv import load_dotenv
from faker import Faker

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)
fake = Faker('es_MX')

# Narrativa fraudulenta clonada que inyectaremos a propósito
NARRATIVA_CLONADA = "El vehículo se encontraba estacionado frente a mi domicilio. Escuché un ruido extraño en la madrugada, aproximadamente a las 3:15 AM, y al salir a revisar, la unidad ya no estaba. No hay testigos presenciales del hecho."

def generar_datos_criticos():
    print("Limpiando datos viejos (verdes)...")
    supabase.table('siniestros').delete().neq('id_siniestro', '0').execute()
    supabase.table('asegurados_sinteticos').delete().neq('id_asegurado', '0').execute()

    print("Generando 5 Asegurados Problemáticos...")
    asegurados = []
    for _ in range(5):
        asegurados.append({
            "id_asegurado": fake.uuid4(),
            "nombre_completo": fake.name(),
            "reclamos_12_meses": random.randint(2, 4) # Alta frecuencia (Alerta)
        })
    supabase.table('asegurados_sinteticos').insert(asegurados).execute()

    print("Generando 10 Siniestros Sospechosos...")
    siniestros = []
    for i in range(10):
        # Para los primeros 3 casos, forzaremos la narrativa clonada
        es_clonado = i < 3
        
        siniestros.append({
            "id_siniestro": fake.uuid4(),
            "id_poliza": fake.uuid4(),
            "id_asegurado": random.choice(asegurados)["id_asegurado"],
            "ramo": "Autos",
            "cobertura": "Robo", # Regla crítica (Rojo)
            "monto_reclamado": random.uniform(15000, 30000), # Monto inusual
            "dias_entre_ocurrencia_reporte": random.randint(5, 12), # Reporte tardío
            "descripcion_hechos": NARRATIVA_CLONADA if es_clonado else fake.paragraph(nb_sentences=3)
        })
    supabase.table('siniestros').insert(siniestros).execute()
    print("✅ ¡Datos inyectados con éxito!")

if __name__ == "__main__":
    generar_datos_criticos()