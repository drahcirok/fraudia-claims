import os
from openai import OpenAI

class LLMProvider:
    def __init__(self):
        # Obtiene la llave de entorno
        self.api_key = os.environ.get("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("❌ Faltó configurar OPENAI_API_KEY en tu archivo .env")
        
        # Inicializa el cliente de OpenAI
        self.client = OpenAI(api_key=self.api_key)

    def generate_text(self, prompt: str) -> str:
        """Genera texto explicativo usando OpenAI"""
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Eres un asistente experto en seguros y antifraude."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3, # Baja temperatura para que sea profesional y conciso
            max_tokens=150
        )
        return response.choices[0].message.content.strip()

    def generate_embedding(self, text: str) -> list[float]:
        """Convierte texto en vectores usando OpenAI"""
        response = self.client.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        )
        return response.data[0].embedding