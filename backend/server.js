const express = require('express');
const cors = require("cors");

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

app.post("/api/recommendations", (req, res) => {
  const { goal, maxSugar, minimumProtein, minimumFiber } = req.body || {};

  const cerealOptions = [
    { name: "Honey Oats", sugar: 8, protein: 5, fiber: 4, goal: "energy" },
    { name: "Crunchy Bran", sugar: 6, protein: 6, fiber: 8, goal: "digestive" },
    { name: "High Protein Crunch", sugar: 4, protein: 12, fiber: 7, goal: "muscle" },
    { name: "Berry Bites", sugar: 5, protein: 4, fiber: 3, goal: "weight-loss" },
    { name: "Golden Granola", sugar: 9, protein: 3, fiber: 2, goal: "energy" }
  ];

  const sugarLimit = Number(maxSugar) || Number.POSITIVE_INFINITY;
  const proteinMin = Number(minimumProtein) || 0;
  const fiberMin = Number(minimumFiber) || 0;
  const targetGoal = String(goal || "").toLowerCase();

  const recommendations = cerealOptions.filter((cereal) => {
    const matchesGoal = !targetGoal || targetGoal === "general" || cereal.goal === targetGoal;
    return matchesGoal && cereal.sugar <= sugarLimit && cereal.protein >= proteinMin && cereal.fiber >= fiberMin;
  });

  res.json({
    recommendations: recommendations.length > 0 ? recommendations : cerealOptions.slice(0, 3)
  });
});

const server = app.listen(3000, () => {
  console.log("Server running on port 3000. run the frontend dev view via additional terminal.");

  //server wasnt working because another process was runnin in the back while hidden on port 3000
  //THE FIX: npx kill-port 3000
});