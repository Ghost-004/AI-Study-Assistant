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

        Answer the user's question ONLY using the provided context.

        If the answer cannot be found in the context, reply:
        "I couldn't find the answer in the uploaded documents."

        Keep the answer concise, accurate, and easy to understand.

        Context:
        {context}

        Question:
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

