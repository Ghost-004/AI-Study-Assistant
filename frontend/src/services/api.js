

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

export async function sendPdf(pdfFile){
    const formData = new FormData();
    formData.append("file", pdfFile);

    const response = await fetch(
        "http://localhost:5000/upload",
        {
            method: "POST",

            body: formData
        }
    );

    return response.json();
}