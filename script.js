const screen = document.getElementById("screen");
const history = document.getElementById("history");
const buttons = document.querySelector(".buttons");

let currentValue = "0";
let previousValue = null;
let operator = null;
let shouldReset = false;

function updateScreen() {
  screen.value = currentValue;
}

function formatNumber(number) {
  if (!Number.isFinite(number)) return "Error";

  return String(Number(number.toPrecision(12)));
}

function clearCalculator() {
  currentValue = "0";
  previousValue = null;
  operator = null;
  shouldReset = false;
  history.textContent = "Ready to calculate";
  updateScreen();
}

function enterNumber(number) {
  if (currentValue === "Error" || shouldReset) {
    currentValue = number;
    shouldReset = false;
  } else if (currentValue === "0") {
    currentValue = number;
  } else if (currentValue.replace("-", "").length < 15) {
    currentValue += number;
  }

  updateScreen();
}

function enterDecimal() {
  if (currentValue === "Error" || shouldReset) {
    currentValue = "0.";
    shouldReset = false;
  } else if (!currentValue.includes(".")) {
    currentValue += ".";
  }

  updateScreen();
}

function chooseOperator(nextOperator) {
  if (currentValue === "Error") return;

  if (operator && !shouldReset) {
    calculate();
    if (currentValue === "Error") return;
  }

  previousValue = Number(currentValue);
  operator = nextOperator;
  shouldReset = true;

  history.textContent =
    `${formatNumber(previousValue)} ${operator}`;
}

function calculate() {
  if (operator === null || previousValue === null) return;

  const first = previousValue;
  const second = Number(currentValue);
  let result;

  switch (operator) {
    case "+":
      result = first + second;
      break;
    case "-":
      result = first - second;
      break;
    case "*":
      result = first * second;
      break;
    case "/":
      if (second === 0) {
        currentValue = "Error";
        history.textContent = "Cannot divide by zero";
        previousValue = null;
        operator = null;
        shouldReset = true;
        updateScreen();
        return;
      }
      result = first / second;
      break;
    default:
      return;
  }

  history.textContent =
    `${formatNumber(first)} ${operator} ${formatNumber(second)} =`;

  currentValue = formatNumber(result);
  previousValue = null;
  operator = null;
  shouldReset = true;

  updateScreen();
}

function deleteLast() {
  if (currentValue === "Error" || shouldReset) {
    currentValue = "0";
    shouldReset = false;
  } else {
    currentValue = currentValue.slice(0, -1) || "0";
  }

  updateScreen();
}

function percentage() {
  if (currentValue === "Error") return;

  currentValue = formatNumber(Number(currentValue) / 100);
  shouldReset = true;
  updateScreen();
}

function toggleSign() {
  if (currentValue === "Error" || Number(currentValue) === 0) return;

  currentValue = currentValue.startsWith("-")
    ? currentValue.slice(1)
    : "-" + currentValue;

  updateScreen();
}

// Handle calculator button clicks
buttons.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    enterNumber(button.dataset.number);
    return;
  }

  if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
    return;
  }

  switch (button.dataset.action) {
    case "clear":
      clearCalculator();
      break;
    case "delete":
      deleteLast();
      break;
    case "decimal":
      enterDecimal();
      break;
    case "percent":
      percentage();
      break;
    case "sign":
      toggleSign();
      break;
    case "equals":
      calculate();
      break;
  }
});

// Keyboard support
document.addEventListener("keydown", event => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    enterNumber(key);
  } else if (key === ".") {
    enterDecimal();
  } else if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearCalculator();
  } else if (key === "%") {
    percentage();
  }
});