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

export async function login(email, password) {

    const response = await fetch(
        "http://localhost:5000/login",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );

    return response.json();
}

export async function register(email, password) {

    const response = await fetch(
        "http://localhost:5000/register",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );

    return response.json();
}

export async function sendPdf(pdfFile){
    const formData = new FormData();
    formData.append("file", pdfFile);

    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:5000/upload",
        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`
            },

            body: formData
        }
    );

    return response.json();
}