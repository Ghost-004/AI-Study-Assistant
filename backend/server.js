import express from "express";
import cors from "cors"

const app = express();

app.use(cors());

app.get("/", (req, res) =>{
    res.json({
        message : "Backend running"
    })
})

app.get("/ai", async (req, res) =>{
    const response = await fetch("http://localhost:8000");

    const data = await response.json();

    res.json(data);
})

app.listen(5000, () => {
    console.log("Server is running")
})

