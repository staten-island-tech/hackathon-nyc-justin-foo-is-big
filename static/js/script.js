// State variables
let metroCards = 0;
let metroCardsPerClick = 1;
let metroCardsPerSecond = 0;

// List of upgrades
const upgrades = [
  { name: "Hot Dog Stand", cost: 15, baseCps: 0.1, count: 0, floorText: "Hot Dog Stand's" },
  { name: "Taxi Ad", cost: 200, baseCps: 1, count: 0, floorText: "Taxi Ad Billboard" },
  { name: "Times Square Billboard", cost: 1100, baseCps: 8, count: 0, floorText: "Times Square Billboard's" },
  { name: "Street Musician", cost: 12000, baseCps: 8, count: 0, floorText: "Street Musician Corner" },
  { name: "Broadway Playbill", cost: 1000, baseCps: 10, count: 0, floorText: "Broadway Theater" },
  { name: "Central Park Picnic", cost: 2000, baseCps: 20, count: 0, floorText: "Central Park Picnic Area" },
  { name: "NYC Marathon Sponsorship", cost: 5000, baseCps: 50, count: 0, floorText: "Marathon Banner" },
  { name: "Bagel Cart", cost: 10000, baseCps: 100, count: 0, floorText: "Bagel Cart Stand" },
  { name: "Art Gallery Exhibit", cost: 20000, baseCps: 200, count: 0, floorText: "Art Gallery Wall" },
  { name: "Film Shoot Location", cost: 50000, baseCps: 500, count: 0, floorText: "Film Set" },
  { name: "Subway Graffiti Mural", cost: 100000, baseCps: 1000, count: 0, floorText: "Graffiti Mural" },
  { name: "Hot Dog Eating Contest", cost: 200000, baseCps: 2000, count: 0, floorText: "Contest Stage" },
  { name: "NYC Marathon Water Stand", cost: 500000, baseCps: 5000, count: 0, floorText: "Water Stand" },
  { name: "Wall Street Ad Campaign", cost: 1000000, baseCps: 10000, count: 0, floorText: "Wall Street Billboard" },
  { name: "Statue of Liberty Tour", cost: 2000000, baseCps: 20000, count: 0, floorText: "Liberty Island Tour" },
  { name: "NY Public Library Event", cost: 5000000, baseCps: 50000, count: 0, floorText: "Library Event" },
  { name: "Brooklyn Bridge Walk", cost: 10000000, baseCps: 100000, count: 0, floorText: "Brooklyn Bridge Walk" },
  { name: "Yankee Stadium Promo", cost: 20000000, baseCps: 200000, count: 0, floorText: "Yankee Stadium Promo" },
  { name: "Food Truck Festival", cost: 50000000, baseCps: 500000, count: 0, floorText: "Food Truck Festival" },
  { name: "Holiday Lights Display", cost: 100000000, baseCps: 1000000, count: 0, floorText: "Holiday Lights" },
];

// DOM elements
const metrocardBtn = document.getElementById("metrocard-btn");
const metrocardCountEl = document.getElementById("metrocard-count");
const metrocardCpsEl = document.getElementById("metrocard-cps");
const upgradesContainer = document.getElementById("upgrades-container");
const floorsContainer = document.getElementById("floors-container");

// Format big numbers nicely
function formatNumber(num) {
  if (num < 1000) return num.toFixed(0);
  if (num < 1e6) return (num / 1000).toFixed(1) + "K";
  if (num < 1e9) return (num / 1e6).toFixed(1) + "M";
  return num.toExponential(2);
}

// Update MetroCards per second total
function updateMetroCardsPerSecond() {
  metroCardsPerSecond = upgrades.reduce((sum, u) => sum + u.count * u.baseCps, 0);
}

// Update displayed MetroCard count and CPS
function updateDisplay() {
  metrocardCountEl.textContent = formatNumber(metroCards);
  metrocardCpsEl.textContent = `MetroCards per second: ${metroCardsPerSecond.toFixed(1)}`;
  updateUpgradeButtons();
  document.title = `${formatNumber(metroCards)} MetroCards - MetroCard Clicker`;
  updateFloors();
}

// Enable/disable upgrade buttons
function updateUpgradeButtons() {
  upgrades.forEach((upgrade, index) => {
    const btn = document.getElementById(`upgrade-btn-${index}`);
    if (!btn) return;
    btn.disabled = metroCards < upgrade.cost;
    btn.querySelector(".upgrade-cost").textContent = `Cost: ${formatNumber(upgrade.cost)}`;
    btn.querySelector(".upgrade-count").textContent = `Owned: ${upgrade.count}`;
  });
}

// Create upgrade buttons (one stacked vertically, full width)
function createUpgradeButtons() {
  upgradesContainer.innerHTML = "";
  upgrades.forEach((upgrade, index) => {
    const btn = document.createElement("button");
    btn.classList.add("upgrade-btn");
    btn.id = `upgrade-btn-${index}`;
    btn.innerHTML = `
      <span class="upgrade-name">${upgrade.name}</span>
      <span class="upgrade-cost">Cost: ${formatNumber(upgrade.cost)}</span>
      <span class="upgrade-count">Owned: ${upgrade.count}</span>
    `;
    btn.addEventListener("click", () => buyUpgrade(index));
    upgradesContainer.appendChild(btn);
  });
}

// Buy an upgrade
function buyUpgrade(index) {
  const upgrade = upgrades[index];
  if (metroCards >= upgrade.cost) {
    metroCards -= upgrade.cost;
    upgrade.count++;
    // Increase cost by 10%
    upgrade.cost = Math.ceil(upgrade.cost * 1.1);
    updateMetroCardsPerSecond();
    updateDisplay();
  }
}

// Update floors display (center column) — show floors for upgrades bought
function updateFloors() {
  floorsContainer.innerHTML = "";
  upgrades.forEach((upgrade) => {
    if (upgrade.count > 0) {
      const floor = document.createElement("div");
      floor.className = "floor";
      floor.textContent = upgrade.floorText + ` x${upgrade.count}`;
      floorsContainer.appendChild(floor);
    }
  });
}

// Animate big MetroCard click: grow, shrink, plus +1 floating text, falling metrocards
metrocardBtn.addEventListener("click", () => {
  // Add MetroCards
  metroCards += metroCardsPerClick;
  updateDisplay();

  // Animate scale
  metrocardBtn.style.transform = "scale(1.2)";
  setTimeout(() => {
    metrocardBtn.style.transform = "scale(1)";
  }, 150);

  // Floating +1 text
  createFloatingText("+1", metrocardBtn);

  // Create falling MetroCard at random top position
  createFallingMetroCard();
});

// Floating +1 text animation
function createFloatingText(text, parent) {
  const rect = parent.getBoundingClientRect();
  const floating = document.createElement("div");
  floating.className = "floating-plus";
  floating.textContent = text;
  floating.style.left = `${rect.left + rect.width / 2}px`;
  floating.style.top = `${rect.top}px`;
  document.body.appendChild(floating);
  setTimeout(() => {
    floating.remove();
  }, 1000);
}

// Create falling MetroCard animation from random top position across full screen width
function createFallingMetroCard() {
  const falling = document.createElement("img");
  falling.src = "/static/images/metrocard.png";
  falling.className = "falling-metrocard";

  // Random horizontal position across viewport width
  const xPos = Math.random() * (window.innerWidth - 40);
  falling.style.left = `${xPos}px`;
  falling.style.top = `0px`;

  document.body.appendChild(falling);

  // Remove after animation duration (2s)
  setTimeout(() => {
    falling.remove();
  }, 2000);
}

// Add MetroCards per second every second
setInterval(() => {
  metroCards += metroCardsPerSecond;
  updateDisplay();
}, 1000);

// Initialize UI
createUpgradeButtons();
updateMetroCardsPerSecond();
updateDisplay();
