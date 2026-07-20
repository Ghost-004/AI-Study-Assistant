import express from "express";
import cors from "cors"
import pg from "pg";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const app = express();
dotenv.config();

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

function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];

    if(!authHeader){
        return res.status(400).json({
            error: "Access token required"
        })
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, user) => {
            if(err) {
                return res.status(403).json({
                    error : "Invalid or expired token"
                })
            }

            req.user = user;

            next();
        }
    );
}

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
app.post(
    "/upload",
    authenticateToken,
    upload.single("file"),
    async (req,res)=>{
    try{
        if (!req.file) {
            return res.status(400).json({
                error: "No file uploaded."
            });
        }

        const existingDocument = await pool.query(
        `
            SELECT id
            FROM documents
            WHERE user_id = $1
            AND filename = $2
        `,
            [
                req.user.id,
                req.file.originalname
            ]
        );

        if (existingDocument.rows.length > 0) {
            return res.status(409).json({
                error: "You have already uploaded this file."
            });
        }

        const result = await pool.query(
            `INSERT INTO documents

            (user_id, filename, file_type)

            VALUES ($1,$2,$3)
            
            RETURNING id`,
            [
                req.user.id,
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

        if (!response.ok) {
            throw new Error("FastAPI upload failed.");
        }

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

//endpoint for asking questions
app.post("/ask", async (req, res) => {
    try {
        const { sessionId, question } = req.body;
        await pool.query (
            `
            INSERT INTO messages (chat_session_id, role, content)\
            VALUES ($1, $2, $3)
            `,
            [sessionId, 'user', question]
        );
        
        const messageResult = await pool.query(
            `
            SELECT role, content
            FROM messages
            WHERE chat_session_id = $1
            ORDER BY created_at ASC;
            `,
            [sessionId]
        );

        const messages = messageResult.rows;

        const response = await fetch(
            "http://localhost:8000/ask",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question,
                    messages
                })
            }
        );

        if (!response.ok) {
            throw new Error("AI service failed");
        }
        const aiResponse = await response.json();

        await pool.query(
            `
            INSERT INTO messages (chat_session_id, role, content)
            VALUES ($1, $2, $3);
            `,
            [sessionId, "assistant", aiResponse.answer]
        );
        
        res.json(aiResponse);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to contact AI service"
        });
    }

});

app.get("/chat-sessions", authenticateToken, async (req, res) => {
    try{
        const userId = req.user.id;
        const result = await pool.query(
            `
                SELECT id, title, created_at
                FROM chat_sessions
                WHERE user_id = $1
                ORDER BY created_at DESC
            `,
            [userId]
        );

        res.json(result.rows);
    } 
    catch(err){
        console.error(err);

        res.status(500).json({
            error: "Failed to fetch chat session"
        })
    }
})

app.post("/chat-sessions", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `
                INSERT INTO chat_sessions (user_id, title)
                VALUES ($1, $2)
                RETURNING *;
            `,
            [userId, "New Chat"]
        );

        res.status(201).json(result.rows[0]);

    } catch(err){
        console.error(err);

        res.status(500).json({
            error: "Failed to create chat session"
        })
    }
});

app.get("/chat-sessions/:id/messages", authenticateToken, async (req, res) => {
    try{
        const userId = req.user.id;
        const sessionId = req.params.id;

        const result = await pool.query(
            `
                SELECT
                    m.role,
                    m.content,
                    m.created_at
                FROM messages m
                JOIN chat_sessions cs
                    ON m.chat_session_id = cs.id
                WHERE
                    cs.id = $1
                    AND cs.user_id = $2
                ORDER BY m.created_at ASC;
            `,
            [sessionId, userId]
        );

        res.json(result.rows);
    }
    catch(err){
        console.error(err);

        res.status(500).json({
            error: "Failed to fetch messages"
        });
    }
});

//user registration
app.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if(!email || !password){
            return res.status(400).json({
                error : "Email and password required"
            })
        }

        const existingUser = await pool.query(
            `
                SELECT id
                FROM users
                WHERE email = $1
            `,
            [email]
        );

        if(existingUser.rows.length > 0){
            return res.status(400).json({
                error: "User already exists"
            })
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await pool.query(
            `
                INSERT INTO users
                (email, password_hash)
                VALUES ($1, $2)
            `,
            [email, passwordHash]
        );

        res.status(201).json({
            message: "User registered successfully"
        })
    } 
    catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Registration failed"
        })
    }
})

//user login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if(!email || !password){
            return res.status(400).json({
                error : "Email and password required"
            })
        }

        const result = await pool.query(
            `
                SELECT * 
                FROM users
                WHERE email = $1
            `,
            [email]
        );

        if(result.rows.length === 0){
            return res.status(401).json({
                error : "Invalid email or password"
            })
        }

        const user = result.rows[0];
        
        const validPassword = await bcrypt.compare(
            password,
            user.password_hash
        )

        if(!validPassword){
            res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn : "7d"
            }
        );

        res.json({
            message: "Login Successful",
            token
        })
    } 
    catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Login failed"
        })
    }
})

app.get("/ai", async (req, res) =>{
    const response = await fetch("http://localhost:8000");
    const data = await response.json();
    res.json(data);
})

app.listen(5000, () => {
    console.log("Server is running")
})

