import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key = os.getenv("GEMINI_API_KEY")
)

def generate_answer(question: str, context: str) -> str:
    prompt = f"""
        You are an AI Study Assistant.

        Your job is to answer questions using ONLY the provided context.

        Instructions:
        - Base your answer only on the retrieved context.
        - Do not invent or assume information.
        - If multiple context sections are relevant, combine them naturally.
        - If the answer is not present in the context, reply exactly:
        "I couldn't find the answer in the uploaded documents."
        - Keep the answer concise (2-5 sentences unless more detail is requested).
        - Explain concepts naturally instead of copying text verbatim.

        Retrieved Context:

        {context}

        User Question:
        {question}

        Answer:
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:
        print(e)
        return "An error occurred while generating the answer."

