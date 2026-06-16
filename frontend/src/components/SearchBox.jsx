export default function SearchBox({question, setQuestion, handleAsk}){
    function handleSubmit(e){
        e.preventDefault();
        console.log("submitted");
        handleAsk(question);
    }

    return (
        <div className="searchBox">
            <form onSubmit={handleSubmit}>
                <label>Ask something: 
                    <input type="text" onChange={(e) => {setQuestion(e.target.value)}} value={question}/>
                </label>
                <button class={"border-1px"} type="submit">
                    Ask
                </button>
            </form>
        </div>
    )
}