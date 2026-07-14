const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'DevPilot AI Backend is running!' });
});

// AI chat route
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2',
                prompt: message,
                stream: false
            })
        });

        const data = await response.json();
        res.json({ response: data.response });

    } catch (error) {
        res.status(500).json({ error: 'AI service error: ' + error });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`DevPilot AI Backend running on http://localhost:${PORT}`);
});