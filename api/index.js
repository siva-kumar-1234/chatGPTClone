import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 8000;
app.use(bodyParser.json());
app.use(cors());

const configuration = new Configuration({
  apiKey: "PLESE_PUT_YOUR_API_KEY_SIR",
});
const openai = new OpenAIApi(configuration);

app.post("/", async (request, response) => {
  const { chats } = request.body;

  const result = await openai.createChatCompletion({
    model: "text-embedding-ada-002",
    messages: [
      {
        role: "system",
        content: "I am ChatGPt, I will help you to imporve your skills",
      },
      ...chats,
    ],
  });

  // Initialize SQLite database
const db = new sqlite3.Database('embedding_database.db');

// Endpoint to generate embedding for a PDF
app.post('/embedPDF', async (req, res) => {
  const pdfText = req.body.pdfText;

  // Generate embedding using OpenAI API
  const openaiResponse = await openai.Embed.create({
    model: 'text-davinci-003',
    data: [{ text: pdfText }],
  });

  const embedding = openaiResponse.data[0].embedding;

  // Insert the embedding into the database
  db.run('INSERT INTO embeddings (embedding) VALUES (?)', [embedding], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ success: true });
    }
  });
});

// Endpoint to query responses based on user input
app.post('/queryResponses', async (req, res) => {
  const userQuery = req.body.userQuery;

  // Generate embedding for user query using OpenAI API
  const queryResponse = await openai.Embed.create({
    model: 'text-davinci-003',
    data: [{ text: userQuery }],
  });

  const queryEmbedding = queryResponse.data[0].embedding;

  // Query the database for similar embeddings
  db.all('SELECT embedding FROM embeddings ORDER BY ABS(?) - ABS(embedding) LIMIT 5', [queryEmbedding], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const similarEmbeddings = rows.map(row => row.embedding);
      res.json({ similarEmbeddings });
    }
  });
});

  response.json({
    output: result.data.choices[0].message,
  });
});


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
