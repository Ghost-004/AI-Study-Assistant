import express from "express";
import cors from "cors"
import pg from "pg";

const app = express();

const { Pool } = pg;

const pool = new Pool({
    user: "ai_user",
    host: "localhost",
    database: "ai_study_assistant",
    password: "Quicken04",
    port: 5432
})

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>{
    res.json({
        message : "Backend running"
    })
})

//connected to postgres check
app.get("/health/db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            status: "connected",
            time: result.rows[0],
        });

    } catch(err) {

        res.status(500).json({
            error: err.message
        });
    }
});

app.post("/ask", async (req, res) => {

    try {

        const response = await fetch(
            "http://localhost:8000/ask",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(req.body)
            }
        );

        const data = await response.json();

        res.json(data);

    } catch(err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to contact AI service"
        });
    }

});
app.get("/ai", async (req, res) =>{
    const response = await fetch("http://localhost:8000");

    const data = await response.json();

    res.json(data);
})

app.listen(5000, () => {
    console.log("Server is running")
})

