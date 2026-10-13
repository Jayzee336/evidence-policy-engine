const mealList = document.getElementById("mealList");
const mealForm = document.getElementById("mealForm");
const addMealButton = document.getElementById("addMeal");
const result = document.getElementById("result");
const resultPlaceholder = document.getElementById("resultPlaceholder");

// Add a meal row to the form.
function addMeal(name = "", sodium = "") {
  const row = document.createElement("div");
  row.className = "meal-row";

  // Meal name field
  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Meal name";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "e.g. Breakfast";
  nameInput.value = name;
  nameInput.required = true;
  nameInput.maxLength = 80;
  nameLabel.appendChild(nameInput);

  // Sodium field
  const sodiumLabel = document.createElement("label");
  sodiumLabel.textContent = "Sodium (mg)";

  const sodiumInput = document.createElement("input");
  sodiumInput.type = "number";
  sodiumInput.placeholder = "e.g. 450";
  sodiumInput.min = "0";
  sodiumInput.step = "any";
  sodiumInput.value = sodium;
  sodiumInput.required = true;
  sodiumLabel.appendChild(sodiumInput);

  // Remove meal button
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "remove";
  removeButton.textContent = "Remove";
  removeButton.setAttribute("aria-label", "Remove this meal");

  removeButton.addEventListener("click", () => {
    row.remove();
  });

  row.append(nameLabel, sodiumLabel, removeButton);
  mealList.appendChild(row);
}

// Display three example meals initially.
addMeal("Breakfast", 450);
addMeal("Lunch", 750);
addMeal("Dinner", 650);

// Add another meal.
addMealButton.addEventListener("click", () => {
  addMeal();
});

// Submit and validate the meal plan.
mealForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const rows = [...mealList.querySelectorAll(".meal-row")];

  if (rows.length === 0) {
    showError("Please add at least one meal.");
    return;
  }

  const meals = [];

  // Validate each meal before sending it to the backend.
  for (const row of rows) {
    const inputs = row.querySelectorAll("input");

    const name = inputs[0].value.trim();
    const rawSodium = inputs[1].value;
    const sodiumMg = Number(rawSodium);

    if (
      !name ||
      rawSodium.trim() === "" ||
      !Number.isFinite(sodiumMg) ||
      sodiumMg < 0
    ) {
      showError(
        "Enter a meal name and a valid non-negative sodium value for every meal."
      );
      return;
    }

    meals.push({
      name,
      sodiumMg
    });
  }

  // Show a loading message in the right-hand result panel.
  showResultMessage("Checking policy compliance...");

  try {
    const response = await fetch("/api/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ meals })
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.error || "Unable to validate the meal plan.");
      return;
    }

    displayResult(data);
  } catch (error) {
    showError(
      "Cannot connect to the backend. Please make sure the server is running."
    );
  }
});

// Display the backend's validation result.
function displayResult(data) {
  result.hidden = false;
  resultPlaceholder.hidden = true;

  result.className = data.compliant
    ? "result pass"
    : "result fail";

  // Build the result using textContent to safely display API data.
  result.replaceChildren();

  const heading = document.createElement("h3");
  heading.textContent = data.compliant
    ? "PASS — Below the threshold"
    : "FLAG — Threshold reached or exceeded";

  const total = document.createElement("p");
  total.textContent =
    `Total daily sodium: ${data.totalSodiumMg.toLocaleString()} mg`;

  const limit = document.createElement("p");
  limit.textContent =
    `Policy threshold: less than ${data.thresholdMg.toLocaleString()} mg/day`;

  const message = document.createElement("p");
  message.textContent = data.message;

  const policy = document.createElement("p");
  policy.textContent = `Policy: ${data.policy}`;

  const source = document.createElement("a");
  source.href = data.source;
  source.target = "_blank";
  source.rel = "noopener noreferrer";
  source.textContent = "View policy source ↗";

  result.append(
    heading,
    total,
    limit,
    message,
    policy,
    source
  );
}

// Show an error or loading message in the result panel.
function showResultMessage(message) {
  result.hidden = false;
  resultPlaceholder.hidden = true;
  result.className = "result";
  result.textContent = message;
}

// Show invalid-input or backend errors.
function showError(message) {
  result.hidden = false;
  resultPlaceholder.hidden = true;
  result.className = "result error";
  result.textContent = message;
}