import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SODIUM_LIMIT_MG = 2000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/validate", (req, res) => {
  const meals = req.body?.meals;

  if (!Array.isArray(meals) || meals.length === 0) {
    return res.status(400).json({
      error: "Please provide at least one meal."
    });
  }

  const invalidMeal = meals.some(
    (meal) =>
      !meal ||
      typeof meal.name !== "string" ||
      !meal.name.trim() ||
      typeof meal.sodiumMg !== "number" ||
      !Number.isFinite(meal.sodiumMg) ||
      meal.sodiumMg < 0
  );

  if (invalidMeal) {
    return res.status(400).json({
      error: "Each meal needs a name and a valid non-negative sodium value."
    });
  }

  const totalSodiumMg = meals.reduce(
    (sum, meal) => sum + meal.sodiumMg,
    0
  );

  const compliant = totalSodiumMg < SODIUM_LIMIT_MG;

  res.json({
    policy: "WHO Adult Sodium Guideline",
    source:
      "https://www.who.int/publications/i/item/9789241504836",
    thresholdMg: SODIUM_LIMIT_MG,
    totalSodiumMg,
    compliant,
    message: compliant
      ? "Pass: Below the daily sodium threshold."
      : "Flag: The daily sodium threshold is reached or exceeded."
  });
});

app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});