import express from "express";
import cors from "cors"
import pg from "pg";
import multer from "multer";

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

const upload = multer({
    storage: multer.memoryStorage()
});

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

//send pdf to fastapi
app.post("/upload", upload.single("file"), async (req, res) => {
    try{
        const result = await pool.query(
            `INSERT INTO documents

            (user_id, filename, file_type)

            VALUES ($1,$2,$3)
            
            RETURNING id`,
            [
                1,
                req.file.originalname,
                req.file.mimetype
            ]
        );
        
        const documentId = result.rows[0].id;

        const formData = new FormData();        
        formData.append("file", new Blob([req.file.buffer]), req.file.originalname);
        formData.append("documentId", documentId);

        const response = await fetch(
            "http://localhost:8000/upload",
            {
                method: "POST",

                body: formData
            }
        );

        const data = await response.json();

        res.json(data);
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            error: "Failed to upload"
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

        console.log(response.status);

        const question = await response.json();
        console.log(question);
        res.json(question);
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

