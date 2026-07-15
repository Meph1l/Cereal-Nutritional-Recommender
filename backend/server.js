const express = require('express');
const path = require('path');
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));


app.get("/", (req, res) => {
    res.send("server is alive");
});

app.get("/testProxy", (req, res) => {
    console.log('api hit');
    res.json({message: "backend working"});
});

const server = app.listen(3000, () => {
  console.log("Server running on port 3000. run the frontend dev view via additional terminal.");

  //server wasnt working because another process was runnin in the back while hidden on port 3000
  //THE FIX: npx kill-port 3000
});