import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key = os.getenv("GEMINI_API_KEY")
)

def generate_answer(question: str, context: str, messages: str) -> str:
    conversation = "\n".join(
        f"{msg.role.capitalize()}: {msg.content}"
        for msg in messages[:-1]
    )
    
    prompt = f"""
        You are an AI study assistant.

        Use the retrieved document context whenever it answers the user's question.

        The conversation history is provided so you can understand follow-up questions.

        If the answer cannot be found in the provided document context, say:

        "I couldn't find the answer in the uploaded documents."

        Conversation History:
        {conversation}

        Retrieved Context:
        {context}

        Current Question:
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

