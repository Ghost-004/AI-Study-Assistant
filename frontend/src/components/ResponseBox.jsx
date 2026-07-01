export function ResponseBox( { answer, sources, loading } ){    
    if (!loading && !answer) {
        return null;
    }
    if (loading) {
        return (
            <p>Thinking...</p>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2>Answer</h2>
            <p>{answer}</p>

            <h3>Sources</h3>
            {sources.length === 0 ? (
                <p>No sources available.</p>
            ) : (
                <ul>
                    {sources.map((source) => (
                        <li
                            className="bg-gray-100 rounded-md px-3 py-2 mb-2"
                            key={`${source.document_id}-${source.chunk_id}`}
                        >
                            {source.filename} (Chunk {source.chunk_id})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}