from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel

from services import chunk_service, pdf_service, embedding_service, chroma_service, llm_service

class QuestionRequest(BaseModel):
    question: str

app = FastAPI()



@app.get("/")
def root():
    return {"message" : "AI service is running"}

@app.post("/upload")
async def upload(file: UploadFile = File(...), documentId: int = Form(...)):
    contents = await file.read()
    text = pdf_service.extract_text(contents)
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
    query_embedding = embedding_service.generate_embedding(req.question)

    results = chroma_service.search_chunks(query_embedding)

    context = "\n\n".join(results["documents"][0])

    answer = llm_service.generate_answer(
        req.question,
        context
    )

    return {
        "answer" : answer,
        "sources" : results["metadatas"][0]
    }