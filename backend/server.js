const express = require('express');
const path = require('path');
const cors = require("cors");
const secureData = require('dotenv');

const env = secureData.config()

const { OpenAI } = require('openai');
//add an .env file in ./backend with variable OPENAI_API_KEY
//API key in whatsapp chat
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});


const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("server is alive");
});

app.get("/testProxy", (req, res) => {
    console.log('api hit');

    res.json({message: "backend working"});
});

app.get('/testAPI', async (req, res) => {
    console.log('openai api hit');
    //testing openAI connectivity here
    const data = await apiTester();
    console.log(data);

    res.json({message: "backend working for open ai"});
});

//Documentation: https://developers.openai.com/api/docs/quickstart
async function apiTester(){
    try{
        const question = 'I am testing my API key. (╯°□°)╯︵ ┻━┻';

        const response = await openai.responses.create({
            model: "gpt-5-mini",
            input: question
        });

        return response.output_text;
    } catch (err){
        
        return(err);
    }
} 



const server = app.listen(3000, () => {
  console.log("Server running on port 3000. run the frontend dev view via additional terminal.");

  //server wasnt working because another process was runnin in the back while hidden on port 3000
  //THE FIX: npx kill-port 3000
});

