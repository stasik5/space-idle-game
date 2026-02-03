// Game State
let gameState = {
    stars: 0,
    totalStars: 0,
    clickPower: 1,
    perSecond: 0,
    cosmicPoints: 0,
    upgrades: {},
    generators: {},
    achievements: {},
    startTime: Date.now()
};

// Upgrades Configuration
const upgradesConfig = {
    clickPower1: {
        name: "Better Click",
        icon: "👆",
        baseCost: 50,
        costMultiplier: 1.5,
        effect: "Click power +1",
        apply: () => { gameState.clickPower += 1; }
    },
    clickPower2: {
        name: "Super Click",
        icon: "👆",
        baseCost: 500,
        costMultiplier: 1.8,
        effect: "Click power +5",
        apply: () => { gameState.clickPower += 5; }
    },
    clickPower3: {
        name: "Mega Click",
        icon: "👆",
        baseCost: 5000,
        costMultiplier: 2.0,
        effect: "Click power +25",
        apply: () => { gameState.clickPower += 25; }
    }
};

// Generators Configuration
const generatorsConfig = {
    asteroid: {
        name: "Asteroid Miner",
        icon: "☄️",
        baseCost: 25,
        costMultiplier: 1.15,
        baseProduction: 0.5,
        effect: "0.5 stars/sec"
    },
    satellite: {
        name: "Satellite",
        icon: "🛰️",
        baseCost: 150,
        costMultiplier: 1.15,
        baseProduction: 2,
        effect: "2 stars/sec"
    },
    spaceStation: {
        name: "Space Station",
        icon: "🚀",
        baseCost: 1000,
        costMultiplier: 1.15,
        baseProduction: 8,
        effect: "8 stars/sec"
    },
    colony: {
        name: "Moon Colony",
        icon: "🌙",
        baseCost: 8000,
        costMultiplier: 1.15,
        baseProduction: 40,
        effect: "40 stars/sec"
    },
    dyson: {
        name: "Dyson Swarm",
        icon: "☀️",
        baseCost: 50000,
        costMultiplier: 1.15,
        baseProduction: 200,
        effect: "200 stars/sec"
    },
    blackhole: {
        name: "Black Hole Farm",
        icon: "🕳️",
        baseCost: 300000,
        costMultiplier: 1.15,
        baseProduction: 1000,
        effect: "1000 stars/sec"
    },
    universe: {
        name: "Universe Creator",
        icon: "🌌",
        baseCost: 2000000,
        costMultiplier: 1.15,
        baseProduction: 5000,
        effect: "5000 stars/sec"
    }
};

// Achievements Configuration
const achievementsConfig = {
    firstClick: {
        name: "First Steps",
        icon: "👣",
        description: "Click the planet once",
        check: () => gameState.totalStars >= 1
    },
    hundredStars: {
        name: "Getting Started",
        icon: "💫",
        description: "Earn 100 stars total",
        check: () => gameState.totalStars >= 100
    },
    thousandStars: {
        name: "Star Collector",
        icon: "⭐",
        description: "Earn 1,000 stars total",
        check: () => gameState.totalStars >= 1000
    },
    tenThousandStars: {
        name: "Star Hunter",
        icon: "🌟",
        description: "Earn 10,000 stars total",
        check: () => gameState.totalStars >= 10000
    },
    hundredThousandStars: {
        name: "Galaxy Explorer",
        icon: "🌠",
        description: "Earn 100,000 stars total",
        check: () => gameState.totalStars >= 100000
    },
    millionStars: {
        name: "Universe Master",
        icon: "🌌",
        description: "Earn 1,000,000 stars total",
        check: () => gameState.totalStars >= 1000000
    },
    firstGenerator: {
        name: "Industrial Revolution",
        icon: "🏭",
        description: "Buy your first generator",
        check: () => getTotalGenerators() >= 1
    },
    tenGenerators: {
        name: "Automation Expert",
        icon: "⚙️",
        description: "Own 10 generators total",
        check: () => getTotalGenerators() >= 10
    },
    firstPrestige: {
        name: "Born Again",
        icon: "🔄",
        description: "Prestige for the first time",
        check: () => gameState.cosmicPoints >= 1
    }
};

// Planet Emojis
const planets = ["🌍", "🌎", "🌏", "🌑", "🌕", "🪐", "🌑", "🌕", "🪐"];
let currentPlanetIndex = 0;

// DOM Elements
const starsEl = document.getElementById('stars');
const perSecondEl = document.getElementById('per-second');
const perClickEl = document.getElementById('per-click');
const planetEl = document.getElementById('planet');
const planetEmojiEl = document.querySelector('.planet-emoji');
const clickIndicatorEl = document.getElementById('click-indicator');
const upgradesGrid = document.getElementById('upgrades-grid');
const generatorsGrid = document.getElementById('generators-grid');
const achievementsGrid = document.getElementById('achievements-grid');
const currentCpEl = document.getElementById('current-cp');
const availableCpEl = document.getElementById('available-cp');
const cpBonusEl = document.getElementById('cp-bonus');
const btnPrestige = document.getElementById('btn-prestige');
const btnSave = document.getElementById('btn-save');
const btnLoad = document.getElementById('btn-load');
const btnReset = document.getElementById('btn-reset');
const saveStatusEl = document.getElementById('save-status');

// Helper Functions
function formatNumber(num) {
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1000000) return (num / 1000).toFixed(2) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(2) + 'B';
    return (num / 1000000000000).toFixed(2) + 'T';
}

function getCpMultiplier() {
    return 1 + (gameState.cosmicPoints * 0.1);
}

function getUpgradeCost(upgradeId) {
    const config = upgradesConfig[upgradeId];
    const level = gameState.upgrades[upgradeId] || 0;
    return Math.floor(config.baseCost * Math.pow(config.costMultiplier, level));
}

function getGeneratorCost(genId) {
    const config = generatorsConfig[genId];
    const count = gameState.generators[genId] || 0;
    return Math.floor(config.baseCost * Math.pow(config.costMultiplier, count));
}

function getGeneratorProduction(genId) {
    const config = generatorsConfig[genId];
    const count = gameState.generators[genId] || 0;
    return config.baseProduction * count * getCpMultiplier();
}

function getTotalGenerators() {
    let total = 0;
    for (const genId in gameState.generators) {
        total += gameState.generators[genId] || 0;
    }
    return total;
}

function calculatePerSecond() {
    let total = 0;
    for (const genId in generatorsConfig) {
        total += getGeneratorProduction(genId);
    }
    gameState.perSecond = total;
}

function getPrestigeGain() {
    // CP = sqrt(total stars / 10000) - existing CP
    const totalFromStars = Math.floor(Math.sqrt(gameState.totalStars / 10000));
    const available = Math.max(0, totalFromStars - gameState.cosmicPoints);
    return available;
}

// UI Updates
function updateDisplay() {
    starsEl.textContent = formatNumber(gameState.stars);
    perSecondEl.textContent = formatNumber(gameState.perSecond);
    perClickEl.textContent = formatNumber(gameState.clickPower);

    currentCpEl.textContent = gameState.cosmicPoints;
    const availableCp = getPrestigeGain();
    availableCpEl.textContent = availableCp;
    cpBonusEl.textContent = getCpMultiplier().toFixed(2);

    btnPrestige.disabled = availableCp <= 0;
}

function renderUpgrades() {
    upgradesGrid.innerHTML = '';
    for (const [id, config] of Object.entries(upgradesConfig)) {
        const level = gameState.upgrades[id] || 0;
        const cost = getUpgradeCost(id);
        const canAfford = gameState.stars >= cost;
        const isMaxed = level >= 10;

        const card = document.createElement('div');
        card.className = 'upgrade-card';
        card.disabled = !canAfford || isMaxed;
        card.innerHTML = `
            <div class="card-header">
                <span class="card-icon">${config.icon}</span>
                <span class="card-count">${level}/10</span>
            </div>
            <div class="card-name">${config.name}</div>
            <div class="card-cost">${isMaxed ? 'MAXED' : formatNumber(cost) + ' stars'}</div>
            <div class="card-description">${config.effect}</div>
        `;

        if (!isMaxed && canAfford) {
            card.onclick = () => buyUpgrade(id);
        }

        upgradesGrid.appendChild(card);
    }
}

function renderGenerators() {
    generatorsGrid.innerHTML = '';
    for (const [id, config] of Object.entries(generatorsConfig)) {
        const count = gameState.generators[id] || 0;
        const cost = getGeneratorCost(id);
        const production = getGeneratorProduction(id);
        const canAfford = gameState.stars >= cost;

        const card = document.createElement('div');
        card.className = 'generator-card';
        card.disabled = !canAfford;
        card.innerHTML = `
            <div class="card-header">
                <span class="card-icon">${config.icon}</span>
                <span class="card-count">${count}</span>
            </div>
            <div class="card-name">${config.name}</div>
            <div class="card-cost">${formatNumber(cost)} stars</div>
            <div class="card-description">${config.effect}</div>
            <div class="card-effect">Current: ${formatNumber(production)}/sec</div>
        `;

        if (canAfford) {
            card.onclick = () => buyGenerator(id);
        }

        generatorsGrid.appendChild(card);
    }
}

function renderAchievements() {
    achievementsGrid.innerHTML = '';
    for (const [id, config] of Object.entries(achievementsConfig)) {
        const unlocked = gameState.achievements[id] || false;
        const card = document.createElement('div');
        card.className = `achievement-card ${unlocked ? 'unlocked' : ''}`;
        card.innerHTML = `
            <span class="achievement-icon">${config.icon}</span>
            <div class="achievement-info">
                <h3>${config.name}</h3>
                <p>${config.description}</p>
            </div>
        `;
        achievementsGrid.appendChild(card);
    }
}

function checkAchievements() {
    for (const [id, config] of Object.entries(achievementsConfig)) {
        if (!gameState.achievements[id] && config.check()) {
            gameState.achievements[id] = true;
            saveStatusEl.textContent = `🏆 Achievement: ${config.name}!`;
            setTimeout(() => {
                saveStatusEl.textContent = 'Auto-saved';
            }, 3000);
        }
    }
}

// Game Actions
function clickPlanet() {
    gameState.stars += gameState.clickPower;
    gameState.totalStars += gameState.clickPower;

    // Visual feedback
    clickIndicatorEl.textContent = `+${formatNumber(gameState.clickPower)}`;
    clickIndicatorEl.classList.remove('show');
    void clickIndicatorEl.offsetWidth; // Trigger reflow
    clickIndicatorEl.classList.add('show');

    // Change planet occasionally
    if (gameState.totalStars >= 1000 && gameState.totalStars % 5000 < gameState.clickPower) {
        currentPlanetIndex = (currentPlanetIndex + 1) % planets.length;
        planetEmojiEl.textContent = planets[currentPlanetIndex];
    }

    updateDisplay();
    renderUpgrades();
    renderGenerators();
    checkAchievements();
}

function buyUpgrade(id) {
    const cost = getUpgradeCost(id);
    const level = gameState.upgrades[id] || 0;

    if (gameState.stars >= cost && level < 10) {
        gameState.stars -= cost;
        gameState.upgrades[id] = level + 1;
        upgradesConfig[id].apply();
        updateDisplay();
        renderUpgrades();
        renderGenerators();
        checkAchievements();
    }
}

function buyGenerator(id) {
    const cost = getGeneratorCost(id);

    if (gameState.stars >= cost) {
        gameState.stars -= cost;
        gameState.generators[id] = (gameState.generators[id] || 0) + 1;
        calculatePerSecond();
        updateDisplay();
        renderUpgrades();
        renderGenerators();
        checkAchievements();
    }
}

function prestige() {
    const availableCp = getPrestigeGain();
    if (availableCp <= 0) return;

    if (confirm(`Prestige reset? You'll gain ${availableCp} Cosmic Points and start over.`)) {
        gameState.cosmicPoints += availableCp;
        gameState.stars = 0;
        gameState.totalStars = 0;
        gameState.clickPower = 1;
        gameState.upgrades = {};
        gameState.generators = {};
        calculatePerSecond();
        updateDisplay();
        renderUpgrades();
        renderGenerators();
        checkAchievements();
        saveGame();
    }
}

// Save/Load
function saveGame() {
    const saveString = JSON.stringify(gameState);
    localStorage.setItem('spaceIdleSave', saveString);
    saveStatusEl.textContent = 'Saved!';
    setTimeout(() => {
        saveStatusEl.textContent = 'Auto-saved';
    }, 2000);
}

function loadGame() {
    const saveString = localStorage.getItem('spaceIdleSave');
    if (saveString) {
        gameState = JSON.parse(saveString);
        calculatePerSecond();
        updateDisplay();
        renderUpgrades();
        renderGenerators();
        renderAchievements();
        saveStatusEl.textContent = 'Loaded!';
        setTimeout(() => {
            saveStatusEl.textContent = 'Auto-saved';
        }, 2000);
    }
}

function hardReset() {
    if (confirm('Are you sure? This will delete ALL progress including Cosmic Points!')) {
        localStorage.removeItem('spaceIdleSave');
        location.reload();
    }
}

// Game Loop
function gameLoop() {
    // Add per-second production
    if (gameState.perSecond > 0) {
        gameState.stars += gameState.perSecond / 10;
        gameState.totalStars += gameState.perSecond / 10;
    }

    updateDisplay();
    renderUpgrades();
    renderGenerators();
    checkAchievements();

    // Auto-save every 60 seconds
    if (Date.now() - gameState.lastSave > 60000) {
        saveGame();
        gameState.lastSave = Date.now();
    }
}

// Event Listeners
planetEl.addEventListener('click', clickPlanet);
btnPrestige.addEventListener('click', prestige);
btnSave.addEventListener('click', saveGame);
btnLoad.addEventListener('click', loadGame);
btnReset.addEventListener('click', hardReset);

// Initialize
function init() {
    // Initialize upgrade levels
    for (const id in upgradesConfig) {
        if (gameState.upgrades[id] === undefined) {
            gameState.upgrades[id] = 0;
        }
    }

    // Initialize generator counts
    for (const id in generatorsConfig) {
        if (gameState.generators[id] === undefined) {
            gameState.generators[id] = 0;
        }
    }

    // Initialize achievements
    for (const id in achievementsConfig) {
        if (gameState.achievements[id] === undefined) {
            gameState.achievements[id] = false;
        }
    }

    gameState.lastSave = Date.now();
    calculatePerSecond();

    // Try to load existing save
    loadGame();

    updateDisplay();
    renderUpgrades();
    renderGenerators();
    renderAchievements();

    // Start game loop (10 ticks per second)
    setInterval(gameLoop, 100);

    // Change planet emoji occasionally
    setInterval(() => {
        if (gameState.totalStars >= 1000) {
            currentPlanetIndex = (currentPlanetIndex + 1) % planets.length;
            planetEmojiEl.textContent = planets[currentPlanetIndex];
        }
    }, 10000);
}

// Start the game
init();
