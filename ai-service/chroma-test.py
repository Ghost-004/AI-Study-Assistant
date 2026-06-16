import chromadb

client = chromadb.PersistentClient(path="./chromadb")

collection = client.get_or_create_collection(
    name="study_material"
)

documents = [
    "Round Robin allocates CPU time equally among processes.",

    "FCFS executes processes according to arrival order.",

    "Shortest Job First selects the process with the shortest burst time."
]

ids = ["1", "2", "3"]

collection.add(
    documents=documents,
    ids=ids
)

results = collection.query(
    query_texts=["What is round robn?"],
    n_results = 2
)

print(results)