const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
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

app.get('/downloadKaggleDataset', async (req, res) => {
  try {
    const datasetSlug = req.query.dataset || 'crawford/80-cereals';
    const destinationPath = await downloadKaggleDataset(datasetSlug);

    res.json({
      success: true,
      message: 'Kaggle dataset downloaded successfully',
      path: destinationPath
    });
  } catch (error) {
    console.error('Kaggle dataset download failed:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to download Kaggle dataset',
      error: error.message
    });
  }
});

function getKaggleCredentials() {
  const username = process.env.KAGGLE_USERNAME;
  const key = process.env.KAGGLE_KEY || process.env.KAGGLE_API_TOKEN;

  if (!username || !key) {
    throw new Error('Set KAGGLE_USERNAME and KAGGLE_KEY in backend/.env before downloading the dataset.');
  }

  return { username, key };
}

function downloadKaggleDataset(datasetSlug) {
  return new Promise((resolve, reject) => {
    const { username, key } = getKaggleCredentials();
    const targetDir = path.join(__dirname, 'data');
    const targetFile = path.join(targetDir, `${datasetSlug.replace(/\//g, '_')}.zip`);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const authHeader = Buffer.from(`${username}:${key}`).toString('base64');
    const requestOptions = {
      hostname: 'www.kaggle.com',
      path: `/api/v1/datasets/download/${datasetSlug}`,
      method: 'GET',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'User-Agent': 'Mozilla/5.0'
      }
    };

    const request = https.request(requestOptions, (response) => {
      if (response.statusCode !== 200) {
        let responseBody = '';
        response.on('data', (chunk) => {
          responseBody += chunk.toString();
        });
        response.on('end', () => {
          reject(new Error(`Kaggle request failed with status ${response.statusCode}: ${responseBody}`));
        });
        return;
      }

      const fileStream = fs.createWriteStream(targetFile);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close(() => resolve(targetFile));
      });

      fileStream.on('error', (error) => {
        reject(error);
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.end();
  });
}

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

