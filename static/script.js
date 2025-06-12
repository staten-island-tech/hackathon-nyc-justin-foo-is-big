let metroCards = 0;
let perSecond = 0;

const metroDisplay = document.getElementById("metrocard-count");
const perSecondDisplay = document.getElementById("per-second");
const metrocardBtn = document.getElementById("metrocard-button");

// Track upgrade costs dynamically
const upgrades = {
  hotdog: { price: 10, increment: 1, buttonText: "🌭 Hot Dog Stand" },
  taxi: { price: 100, increment: 10, buttonText: "🚕 Taxi Ad" },
  billboard: { price: 1000, increment: 100, buttonText: "📺 Times Square Billboard" },
};

function updateDisplay() {
  metroDisplay.textContent = Math.floor(metroCards);
  perSecondDisplay.textContent = perSecond;
  document.title = `MetroCards: ${Math.floor(metroCards)} | NYC Clicker`;
}

// Update button texts with current price
function updateUpgradeButtons() {
  for (const key in upgrades) {
    const upgrade = upgrades[key];
    const btn = document.querySelector(`button[onclick="buyUpgrade('${key}')"]`);
    if (btn) {
      btn.textContent = `${upgrade.buttonText} ($${Math.floor(upgrade.price)}) - +${upgrade.increment}/sec`;
    }
  }
}

function spawnFallingMetroCard() {
  const card = document.createElement("img");
  card.src = "/static/images/metrocard.png"; // Local image path
  card.className = "falling-card";

  const maxX = window.innerWidth - 60;
  const randomX = Math.floor(Math.random() * maxX);
  card.style.left = `${randomX}px`;
  card.style.top = `-60px`;

  document.getElementById("falling-container").appendChild(card);

  setTimeout(() => {
    card.style.transform = `translateY(${window.innerHeight + 100}px)`;
  }, 10);

  setTimeout(() => {
    card.remove();
  }, 2600);
}

metrocardBtn.addEventListener("click", () => {
  metroCards++;
  updateDisplay();
  spawnFallingMetroCard();
});

function buyUpgrade(type) {
  const upgrade = upgrades[type];
  if (upgrade && metroCards >= upgrade.price) {
    metroCards -= upgrade.price;
    perSecond += upgrade.increment;

    // Increase price by 10%
    upgrade.price *= 1.1;

    updateDisplay();
    updateUpgradeButtons();
  }
}

updateUpgradeButtons();

setInterval(() => {
  metroCards += perSecond;
  updateDisplay();
}, 1000);
