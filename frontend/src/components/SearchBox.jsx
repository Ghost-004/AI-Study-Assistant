export  function SearchBox({question, setQuestion, handleAsk}){
    function handleSubmit(e){
        e.preventDefault();
        console.log("submitted");
        handleAsk(question);
    }

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="searchBox">
            <form onSubmit={handleSubmit}>
                <label>
                    <h2 className="text-xl font-semibold mb-4">
                        Ask a Question
                    </h2>
                    <input 
                        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text" onChange={(e) => {setQuestion(e.target.value)}} value={question}/>
                </label>
                <button
                    className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700"
                    class={"border-1px"} type="submit">
                    Ask
                </button>
                </form>
            </div>
        </div>
    )
}