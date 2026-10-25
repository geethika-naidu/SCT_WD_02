const display = document.getElementById("display");
const message = document.getElementById("message");
const buttons = document.querySelector(".buttons");

let expression = "";
let finished = false;

// Update the calculator display.
function updateDisplay() {
  display.value = expression;
}

// Add a number or operator to the expression.
function addValue(value) {
  message.textContent = "";

  if (finished && /[0-9.]/.test(value)) {
    expression = "";
  }
  finished = false;

  // Avoid two decimal points in the same number.
  if (value === ".") {
    const currentNumber = expression.split(/[+\-*/%]/).pop();
    if (currentNumber.includes(".")) return;
    if (currentNumber === "") value = "0.";
  }

  expression += value;
  updateDisplay();
}

// Calculate the expression safely using a basic arithmetic parser.
function calculate() {
  if (!expression) return;

  try {
    // Only digits, decimal points, arithmetic operators, spaces, and parentheses are allowed.
    if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) {
      throw new Error("Invalid input");
    }

    // Prevent expressions that end with an operator.
    if (/[+\-*/%.]$/.test(expression)) {
      throw new Error("Complete the expression");
    }

    const result = Function('"use strict"; return (' + expression + ')')();

    if (!Number.isFinite(result)) {
      throw new Error("Cannot divide by zero");
    }

    expression = String(Number(result.toFixed(10)));
    finished = true;
    updateDisplay();
    message.textContent = "";
  } catch (error) {
    message.textContent = error.message || "Invalid calculation";
  }
}

// Handle button clicks with one event listener.
buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.action === "clear") {
    expression = "";
    finished = false;
    message.textContent = "";
    updateDisplay();
  } else if (button.dataset.action === "delete") {
    expression = expression.slice(0, -1);
    finished = false;
    message.textContent = "";
    updateDisplay();
  } else if (button.dataset.action === "calculate") {
    calculate();
  } else if (button.dataset.value) {
    addValue(button.dataset.value);
  }
});

// Support keyboard input.
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9.+\-*/%]$/.test(key)) {
    addValue(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    expression = expression.slice(0, -1);
    updateDisplay();
  } else if (key === "Escape" || key === "Delete") {
    expression = "";
    finished = false;
    message.textContent = "";
    updateDisplay();
  }
});
