import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { generate } from './chatbot.js';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json()); // Parse incoming JSON requests

// Basic health check route
app.get('/', (req, res) => {
    res.send('Chatbot Backend is running!');
});

// The /chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { message, threadId } = req.body;
        const result = await generate(message, threadId)
        res.json({ message: result })
    } catch (error) {
        console.error("Error in /chat endpoint:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
