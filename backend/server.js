const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const secureData = require('dotenv');
//const mysql = require('mysql');
const mysql = require('mysql2');  //I Need mysql2 in order for my db to connect
const { OpenAI } = require('openai');

secureData.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;




function normalizeDatabaseRow(row) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, value === null ? '' : value])
  );
}

function queryDatabase(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!dbConnection) {
      reject(new Error('MySQL is not configured.'));
      return;
    }

    dbConnection.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(results);
    });
  });
}

async function loadCerealCatalogFromDatabase() {
  if (!dbConnection) {
    return [];
  }

  try {
    const rows = await queryDatabase('SELECT * FROM cereal');
    return rows
      .filter((row) => row.name && String(row.name).trim())
      .map(normalizeDatabaseRow);
  } catch (error) {
    console.warn('Failed to load cereals from the MySQL table "cereal":', error.message);
    return [];
  }
}

let cerealCatalog = [];

async function initializeCerealCatalog() {
  cerealCatalog = await loadCerealCatalogFromDatabase();
  console.log(`Loaded ${cerealCatalog.length} cereals from the MySQL table "cereal".`);
}

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ strict: false }));
app.use(express.text({ type: ['text/plain', 'text/*', 'application/json', 'application/*+json'] }));




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


app.post('/api/sendQuestionToChatgpt', async (req, res) => {
  try{
    const {goal, maxSugar, minimumProtein, minimumFiber} = req.body;
  
    const question = `What cereal closely meets these requirements: Max Sugar: ${maxSugar}, minimum protein: ${minimumProtein}, minimum fiber: ${minimumFiber}. Prioritize: ${goal}` 
    console.log("QUESTION:" + question);

    const cerealData = await getAllCereals();

    //format: [question], the data is in this json: [json of all cereal data]  
    const answeredQuestion = await sendingQuestion(question, cerealData);
    console.log(answeredQuestion);
    
    res.json({recommendations: answeredQuestion});
  }
  catch(err){
    console.error("Error -->" + err);
  }
  
});


async function getAllCereals(){
  let fullCerealJson;
  fullCerealJson  = await loadCerealCatalogFromDatabase();
  //console.log(JSON.stringify(fullCerealJson));
  return JSON.stringify(fullCerealJson);
}

//documentation: https://developers.openai.com/api/docs/guides/text
async function sendingQuestion(questionText, jsonDataSet){
   try {
    console.log('Sending Question');
    const response = await openai.responses.create({
      model: 'gpt-5-mini',
      input: [
        {
          role: "system",
          content: "reccomend cereal based on user requirements. the json data for cereal is: " + jsonDataSet
        }
        ,{
          role: 'user',
          content: questionText
        }
      ]
    });

    return response.output_text;
  } catch (err) {
    return err;
  }
}
 

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

app.get('/api/cereals', (req, res) => {
  const query = (req.query.name || '').toString().trim();
  const normalizedQuery = normalizeSearchText(query);

  const filtered = !normalizedQuery
    ? cerealCatalog.slice(0, 12)
    : cerealCatalog.filter((cereal) => {
        const haystack = Object.values(cereal)
          .map((value) => normalizeSearchText(value))
        return haystack.includes(normalizedQuery);
      });

  res.json({ cereals: filtered, total: filtered.length });
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

app.use('/api/assistant/chat', (req, res, next) => {
  let buffer = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    buffer += chunk;
  });
  req.on('end', () => {
    req.rawBody = buffer;
    console.log('assistant middleware body:', JSON.stringify(buffer));
    next();
  });
  req.on('error', () => next());
});

app.post('/api/assistant/chat', async (req, res) => {
  const userMessage = (req.rawBody || '').trim();
  console.log('assistant handler message:', JSON.stringify(userMessage));

  if (typeof req.body === 'string') {
    userMessage = req.body.trim();
  } else if (req.body && typeof req.body === 'object') {
    userMessage = (req.body.message || req.body.text || '').toString().trim();
  } else if (Buffer.isBuffer(req.body)) {
    userMessage = req.body.toString('utf8').trim();
  }

  console.log('assistant parsed message:', JSON.stringify(userMessage));

  if (!userMessage) {
    return res.status(400).json({ reply: 'Please ask for a cereal recommendation.' });
  }

  if (!openai) {
    return res.status(503).json({ reply: 'The AI assistant is not configured right now.' });
  }

  const datasetContext = cerealCatalog.slice(0, 20).map((cereal) => {
    return `${cereal.name} | category: ${cereal.category || 'n/a'} | calories: ${cereal.calories || 'n/a'} | protein: ${cereal.protein || 'n/a'} | fiber: ${cereal.fiber || 'n/a'} | sugars: ${cereal.sugars || 'n/a'}`;
  }).join('\n');

  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      input: `You are a friendly cereal recommendation assistant for this app. Use the cereal dataset below to answer the user's request with 2-4 specific recommendations and a brief reason for each. Keep the reply concise and practical.\n\nUser request: ${userMessage}\n\nDataset sample:\n${datasetContext}`
    });

    res.json({ reply: response.output_text || 'I could not generate a recommendation right now.' });
  } catch (error) {
    console.error('OpenAI assistant request failed:', error);
    res.status(500).json({ reply: 'I hit an issue while generating a recommendation. Please try again.' });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.warn(`Invalid JSON payload received for ${req.method} ${req.path}`);
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  next(err);
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

initializeCerealCatalog()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}.`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize cereal catalog:', error);
    process.exit(1);
  });

