from fastapi import FastAPI
import chromadb

app = FastAPI()

client = chromadb.PersistentClient("./chromadb")

collection = client.get_or_create_collection(
    name="study_material"
)

@app.get("/")
def root():
    return {"message" : "AI service is running"}

@app.post("/ask")
async def ask(data: dict):

    question = data["question"]

    results = collection.query(
        query_texts=[question],
        n_results=2
    )

    return {
        "question" : question,
        "context" : results["documents"][0]
    }