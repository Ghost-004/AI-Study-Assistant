def chunk_text(text, chunk_size=500, overlap=100):

    chunks = []

    start = 0

    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    
    chunks = [
        chunk.strip()
        for chunk in chunks
        if len(chunk.strip()) > 50
    ]
    return chunks