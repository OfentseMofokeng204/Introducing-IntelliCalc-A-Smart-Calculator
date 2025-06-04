const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let input = '';
let history = JSON.parse(localStorage.getItem("calc-history")) || [];

function updateDisplay(val) {
  display.textContent = val;
}

function addToHistory(entry) {
  history.unshift(entry);
  if (history.length > 5) history.pop();
  localStorage.setItem("calc-history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.value;

    if (val === "AC") {
      input = '';
      updateDisplay("0");
    } else if (val === "DEL") {
      input = input.slice(0, -1);
      updateDisplay(input || "0");
    } else if (val === "=") {
      try {
        let parsed = parseSmartInput(input);
        let result = eval(parsed);
        addToHistory(`${input} = ${result}`);
        input = result.toString();
        updateDisplay(input);
      } catch {
        updateDisplay("ERROR");
      }
    } else if (val === "√") {
      try {
        input = Math.sqrt(parseFloat(input)).toString();
        updateDisplay(input);
      } catch {
        updateDisplay("ERROR");
      }
    } else {
      input += val;
      updateDisplay(input);
    }

    // Optional: Sound
    if (navigator.vibrate) navigator.vibrate(50);
  });
});

function setTheme(mode) {
  document.body.className = mode;
  localStorage.setItem("theme", mode);
}

function parseSmartInput(str) {
  return str
    .replace(/of/gi, '*')
    .replace(/r/i, '');
}

function calculateLoan() {
  let amount = parseFloat(document.getElementById("loan-amount").value);
  let rate = parseFloat(document.getElementById("interest-rate").value) / 100 / 12;
  let years = parseFloat(document.getElementById("loan-term").value) * 12;
  let payment = (amount * rate) / (1 - Math.pow(1 + rate, -years));
  if (isFinite(payment)) {
    document.getElementById("loan-result").textContent = `Monthly: R${payment.toFixed(2)}`;
    addToHistory(`Loan: R${payment.toFixed(2)} / mo`);
  } else {
    document.getElementById("loan-result").textContent = "Invalid input";
  }
}

// Splash screen
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById("splash-screen").classList.add("hidden");
    document.querySelector(".calculator-container").classList.remove("hidden");
    renderHistory();
    const theme = localStorage.getItem("theme") || "light";
    setTheme(theme);
  }, 2000);
});

// Mode toggle
document.getElementById("standard-btn").onclick = () => {
  document.getElementById("standard-mode").classList.remove("hidden");
  document.getElementById("loan-mode").classList.add("hidden");
};
document.getElementById("loan-btn").onclick = () => {
  document.getElementById("standard-mode").classList.add("hidden");
  document.getElementById("loan-mode").classList.remove("hidden");
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
