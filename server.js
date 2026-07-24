const express = require('express');
const path = require('path');
const cors = require('cors');
const secureData = require('dotenv');
const mysql = require('mysql');
const { OpenAI } = require('openai');

secureData.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

let dbConnection = null;
let openai = null;

if (process.env.DB_HOST) {
  dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  dbConnection.connect((err) => {
    if (err) {
      console.error('MySQL connection failed:', err.message);
      return;
    }

    console.log('MySQL connected on port 3306');
  });
} else {
  console.warn('DB_HOST not set. Skipping MySQL connection.');
}

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  console.warn('OPENAI_API_KEY not set. /testAPI will return a 503 response.');
}

app.get('/', (req, res) => {
  return res.json({ status: 'server is alive' });
});

app.get('/testProxy', (req, res) => {
  console.log('api hit');

  res.json({
    message: 'backend working',
    database: dbConnection ? 'configured' : 'not-configured'
  });
});

app.get('/testAPI', async (req, res) => {
  console.log('openai api hit');

  if (!openai) {
    return res.status(503).json({ message: 'OpenAI is not configured' });
  }

  const data = await apiTester();
  console.log(data);

  res.json({ message: 'backend working for open ai', data });
});

async function apiTester() {
  try {
    const question = 'I am testing my API key. (╯°□°)╯︵ ┻━┻';

    const response = await openai.responses.create({
      model: 'gpt-5-mini',
      input: question
    });

    return response.output_text;
  } catch (err) {
    return err;
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}.`);
});

