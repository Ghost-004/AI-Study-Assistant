import chromadb, uuid
client = chromadb.PersistentClient("./chromadb")

collection = client.get_or_create_collection(
    name="study_material"
)

def store_chunks(chunks, embeddings, filename, documentId):

    ids = []
    metadatas = []

    uuid_prefix = str(uuid.uuid4())

    for i in range(len(chunks)):
        ids.append(f"{uuid_prefix}_{i}")
        metadatas.append({
            "document_id" : documentId,
            "filename" : filename,
            "chunk_id" : i
        })

    collection.add(
        ids = ids,
        documents = chunks,
        embeddings = embeddings,
        metadatas = metadatas
    )

def search_chunks(query_embedding, n_results = 5):
    return collection.query(
        query_embeddings = [query_embedding],
        n_results = n_results,
        include=[
            "documents",
            "metadatas",
            "distances"
        ]
    )
    