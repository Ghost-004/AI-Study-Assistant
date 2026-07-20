from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel

from services import (
    chunk_service,
    document_service,
    embedding_service,
    chroma_service,
    llm_service
)

class Message(BaseModel):
    role: str
    content: str

class QuestionRequest(BaseModel):
    question: str
    messages: list[Message]

app = FastAPI()

@app.get("/")
def root():
    return {"message" : "AI service is running"}

@app.post("/upload")
async def upload(file: UploadFile = File(...), documentId: int = Form(...)):
    contents = await file.read()
    text = document_service.extract_text(contents, file.filename)
    text = document_service.clean_text(text)
    chunks = chunk_service.chunk_text(text)
    embeddings = embedding_service.generate_embeddings(chunks)

    chroma_service.store_chunks(
        chunks,
        embeddings,
        file.filename,
        documentId
    )

    return {
        "success" : True,
        "chunks" : len(chunks)
    }


@app.post("/ask")
async def ask(req: QuestionRequest):
    question = req.question
    messages = req.messages
    query_embedding = embedding_service.generate_embedding(req.question)

    results = chroma_service.search_chunks(query_embedding)
    context = ""

    for i, chunk in enumerate(results["documents"][0], start=1):
        context += f"Context {i}:\n{chunk}\n\n"

    answer = llm_service.generate_answer(
        question=question,
        context=context,
        messages=messages
    )

    return {
        "answer" : answer,
        "sources" : results["metadatas"][0]
    }