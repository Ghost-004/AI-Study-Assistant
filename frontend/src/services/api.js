export async function askQuestion(question) {
    const response = await fetch(
        "http://localhost:5000/ask",
        {
            method: "POST",

            headers: {
                "Content-type" : "application/json",
            },

            body: JSON.stringify({ question })
        }
    );

    return response.json();
}