const STORAGE_KEY = "panic_player_dashboard_v3";

// Core data lists (exact text)
const roles = [
  {
    id: "medic",
    name: "Medic",
    passive: "Remove +1 extra infection cube whenever you treat infection.",
    active: "Remove ALL infection cubes from your current territory.",
    special: "Prevent the next outbreak in your territory."
  },
  {
    id: "scientist",
    name: "Scientist",
    passive: "Requires 1 fewer card for each cure progress.",
    active: "Peek at the next infection or event outcome.",
    special: "Instantly gain +1 cure progress on any disease."
  },
  {
    id: "researcher",
    name: "Researcher",
    passive: "Can share cards with any player without restrictions.",
    active: "Give any one card to another player.",
    special: "Draw 2 extra cards instantly."
  },
  {
    id: "dispatcher",
    name: "Dispatcher",
    passive: "Can move other players' units as if they were your own.",
    active: "Swap positions of two friendly territories.",
    special: "Teleport all your troops to any one territory."
  },
  {
    id: "quarantine-officer",
    name: "Quarantine Officer",
    passive: "Infection cannot spread into your territory.",
    active: "Cancel infection added to your territory once.",
    special: "Lock down a region (no infection spreads there for 1 round)."
  },
  {
    id: "containment-specialist",
    name: "Containment Specialist",
    passive: "Outbreaks from your territory spread to 1 less location.",
    active: "Reduce an active outbreak chain by stopping further spread.",
    special: "Reset an outbreak chain completely."
  },
  {
    id: "virologist",
    name: "Virologist",
    passive: "Can remove infection from any territory remotely.",
    active: "Remove 1 cube from any territory on the map.",
    special: "Remove up to 3 cubes from anywhere on the map."
  },
  {
    id: "analyst",
    name: "Analyst",
    passive: "You can view upcoming infection/event outcomes.",
    active: "Rearrange the next event or infection outcome.",
    special: "Skip the next infection phase completely."
  },
  {
    id: "warlord",
    name: "Warlord",
    passive: "Roll +1 extra attack dice in battles.",
    active: "Gain +2 troops instantly.",
    special: "You may attack twice in one turn."
  },
  {
    id: "general",
    name: "General",
    passive: "Gain +2 bonus troops at the start of your turn.",
    active: "Move troops twice during fortify.",
    special: "Reinforce all your territories with +1 troop."
  },
  {
    id: "smuggler",
    name: "Smuggler",
    passive: "Ignore territory movement restrictions once per turn.",
    active: "Move troops between any two territories.",
    special: "Steal 3 points from another player."
  },
  {
    id: "spy-master",
    name: "Spy Master",
    passive: "You can see other players' cards when interacting.",
    active: "Disable one player's active ability for their next turn.",
    special: "Target player cannot use any abilities next turn."
  },
  {
    id: "engineer",
    name: "Engineer",
    passive: "Your territories are harder to break (stronger defense effect).",
    active: "Protect one territory from an attack.",
    special: "Build a bunker — ignore one full attack on that territory."
  },
  {
    id: "raider",
    name: "Raider",
    passive: "First troop loss in battle is ignored.",
    active: "Steal 1 troop after winning a battle.",
    special: "Instantly capture a weak territory (1 troop territory)."
  },
  {
    id: "diplomat",
    name: "Diplomat",
    passive: "Gain +1 extra benefit from alliances or trades.",
    active: "Force a truce (no attacks in one territory next round).",
    special: "Break all alliances currently active in the game."
  },
  {
    id: "commander",
    name: "Commander",
    passive: "Move troops after a successful attack.",
    active: "Chain attacks from one territory to another.",
    special: "Move troops freely across your entire map once."
  }
];

const diseases = [
  { id: "crimson", name: "Crimson Flu", color: "red" },
  { id: "azure", name: "Azure Plague", color: "blue" },
  { id: "verdant", name: "Verdant Rot", color: "green" },
  { id: "obsidian", name: "Obsidian Blight", color: "purple" }
];

const events = [
  { name: "International Aid", desc: "All players gain +3 troops.", type: "positive" },
  { name: "Medical Breakthrough", desc: "Remove 1 infection cube from all infected territories.", type: "positive" },
  { name: "Stabilization", desc: "Reduce Global Panic by 1.", type: "positive" },
  { name: "Supply Drop", desc: "Each player gains +2 points.", type: "positive" },
  { name: "Temporary Immunity", desc: "Next infection phase places 1 less cube everywhere.", type: "positive" },
  { name: "Airborne Spread", desc: "Infection spreads to one additional nearby territory.", type: "negative" },
  { name: "Global Panic", desc: "All players lose 2 troops.", type: "negative" },
  { name: "Mutation Wave", desc: "Virus evolves immediately to the next level.", type: "negative" },
  { name: "Economic Collapse", desc: "No player can spend points this round.", type: "negative" },
  { name: "Chain Reaction", desc: "Next outbreak spreads twice as much.", type: "negative" }
];

const warPowers = {
  airstrike: {
    title: "Airstrike (4 pts)",
    effect: "Effect: Remove up to 3 enemy troops from a selected territory.",
    condition: "Condition: Can be used once per round.",
    counter: "Counter: If target has bunker protection, damage is ignored."
  },
  nuke: {
    title: "Nuke (8 pts)",
    effect: "Effect: Destroy all troops in a territory and turn it into a zombie zone.",
    condition: "Condition: Can only be used after Round 3.",
    counter: "Counter: No counter — cannot be prevented."
  },
  reinforce: {
    title: "Reinforce Surge (3 pts)",
    effect: "Effect: Gain +5 troops instantly and place them in any one territory.",
    condition: "Condition: Can be used anytime during your turn.",
    counter: "Counter: No counter."
  },
  sabotage: {
    title: "Sabotage (3 pts)",
    effect: "Effect: Target player cannot use abilities in their next turn.",
    condition: "Condition: You must be aware of the target player (direct interaction).",
    counter: "Counter: Spy Master role can block this effect."
  }
};

// DOM helpers
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const elements = {
  setupScreen: $("#setupScreen"),
  dashboardScreen: $("#dashboardScreen"),
  playerNameInput: $("#playerNameInput"),
  rollRoleBtn: $("#rollRoleBtn"),
  rolePreview: $("#rolePreview"),
  setupPassive: $("#setupPassive"),
  setupActive: $("#setupActive"),
  setupSpecial: $("#setupSpecial"),
  startGameBtn: $("#startGameBtn"),
  setupMessage: $("#setupMessage"),
  playerNameDisplay: $("#playerNameDisplay"),
  roleNameDisplay: $("#roleNameDisplay"),
  troopsValue: $("#troopsValue"),
  pointsValue: $("#pointsValue"),
  cardsInput: $("#cardsInput"),
  leaderToggle: $("#leaderToggle"),
  leaderStatusText: $("#leaderStatusText"),
  leaderWarning: $("#leaderWarning"),
  respawnLeaderBtn: $("#respawnLeaderBtn"),
  actionsLeft: $("#actionsLeft"),
  startTurnBtn: $("#startTurnBtn"),
  useActionBtn: $("#useActionBtn"),
  turnMessage: $("#turnMessage"),
  cureTracker: $("#cureTracker"),
  cureSelect: $("#cureSelect"),
  useCardsBtn: $("#useCardsBtn"),
  cureMessage: $("#cureMessage"),
  drawEventBtn: $("#drawEventBtn"),
  eventDisplay: $("#eventDisplay"),
  rolePassive: $("#rolePassive"),
  roleActive: $("#roleActive"),
  roleSpecial: $("#roleSpecial"),
  activeEffects: $("#activeEffects"),
  allRoles: $("#allRoles"),
  shopMessage: $("#shopMessage"),
  modal: $("#modal"),
  modalTitle: $("#modalTitle"),
  modalBody: $("#modalBody"),
  modalClose: $("#modalClose")
};

// Default single-player state
const defaultState = {
  setupComplete: false,
  playerName: "",
  roleId: null,
  troops: 25,
  points: 0,
  cards: 0,
  actionsLeft: 4,
  turnActive: false,
  leaderAlive: true,
  cures: {
    crimson: 0,
    azure: 0,
    verdant: 0,
    obsidian: 0
  },
  activeEffects: "",
  lastEvent: null
};

let state = loadState();

// Local storage helpers
function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { ...defaultState };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      cures: {
        ...defaultState.cures,
        ...(parsed.cures || {})
      }
    };
  } catch (error) {
    console.warn("Failed to parse saved data", error);
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getRoleById(id) {
  return roles.find((role) => role.id === id) || roles[0];
}

// Render setup screen
function renderSetup() {
  elements.playerNameInput.value = state.playerName || "";
  const role = state.roleId ? getRoleById(state.roleId) : null;
  if (role) {
    elements.rolePreview.querySelector(".role-name").textContent = role.name;
    elements.setupPassive.textContent = role.passive;
    elements.setupActive.textContent = role.active;
    elements.setupSpecial.textContent = role.special;
  } else {
    elements.rolePreview.querySelector(".role-name").textContent = "No role rolled yet";
    elements.setupPassive.textContent = "-";
    elements.setupActive.textContent = "-";
    elements.setupSpecial.textContent = "-";
  }
}

// Render dashboard screen
function renderDashboard() {
  const role = getRoleById(state.roleId);
  elements.playerNameDisplay.textContent = state.playerName || "Player";
  elements.roleNameDisplay.textContent = role.name;
  elements.troopsValue.textContent = state.troops;
  elements.pointsValue.textContent = state.points;
  elements.cardsInput.value = state.cards;
  elements.actionsLeft.textContent = state.actionsLeft;
  elements.leaderToggle.checked = state.leaderAlive;
  elements.leaderStatusText.textContent = state.leaderAlive ? "Leader Alive" : "Leader Dead";
  elements.leaderWarning.classList.toggle("hidden", state.leaderAlive);
  elements.activeEffects.value = state.activeEffects || "";

  elements.rolePassive.textContent = role.passive;
  elements.roleActive.textContent = role.active;
  elements.roleSpecial.textContent = role.special;

  renderCureTracker();
  renderEvent();
  renderAllRoles();
}

function renderCureTracker() {
  elements.cureTracker.innerHTML = "";
  elements.cureSelect.innerHTML = "";

  diseases.forEach((disease) => {
    const value = state.cures[disease.id] || 0;

    const cureCard = document.createElement("div");
    cureCard.className = `cure-card ${disease.color}`;
    cureCard.innerHTML = `
      <div class="cure-header">
        <span>${disease.name}</span>
        <span class="cure-status ${value >= 5 ? "cured" : ""}">${value >= 5 ? "CURED" : `${value}/5`}</span>
      </div>
      <div class="cure-progress">
        <button class="btn btn-icon" data-cure="${disease.id}" data-delta="-1">-</button>
        <div class="counter-value">${value}</div>
        <button class="btn btn-icon" data-cure="${disease.id}" data-delta="1">+</button>
      </div>
    `;
    elements.cureTracker.appendChild(cureCard);

    const option = document.createElement("option");
    option.value = disease.id;
    option.textContent = disease.name;
    elements.cureSelect.appendChild(option);
  });
}

function renderEvent() {
  if (!state.lastEvent) {
    elements.eventDisplay.innerHTML = `
      <div class="event-name">No event drawn</div>
      <div class="event-desc">Draw an event to reveal the outcome.</div>
    `;
    return;
  }
  elements.eventDisplay.innerHTML = `
    <div class="event-name">${state.lastEvent.name}</div>
    <div class="event-desc">${state.lastEvent.desc}</div>
  `;
}

function renderAllRoles() {
  elements.allRoles.innerHTML = "";
  roles.forEach((role) => {
    const card = document.createElement("div");
    card.className = "role-card";
    card.innerHTML = `
      <div class="role-name">${role.name}</div>
      <div class="role-ability">
        <div class="ability-label">Passive</div>
        <div class="ability-text">${role.passive}</div>
      </div>
      <div class="role-ability">
        <div class="ability-label">Active</div>
        <div class="ability-text">${role.active}</div>
      </div>
      <div class="role-ability">
        <div class="ability-label">Special</div>
        <div class="ability-text">${role.special}</div>
      </div>
    `;
    elements.allRoles.appendChild(card);
  });
}

function showScreen() {
  if (state.setupComplete) {
    elements.setupScreen.classList.add("hidden");
    elements.dashboardScreen.classList.remove("hidden");
    renderDashboard();
  } else {
    elements.dashboardScreen.classList.add("hidden");
    elements.setupScreen.classList.remove("hidden");
    renderSetup();
  }
}

function updateState(patch) {
  state = { ...state, ...patch };
  saveState();
}

function resetTurnMessage() {
  elements.turnMessage.textContent = "";
}

function setTurnMessage(text) {
  elements.turnMessage.textContent = text;
}

function setCureMessage(text) {
  elements.cureMessage.textContent = text;
}

function setShopMessage(text) {
  elements.shopMessage.textContent = text;
}

function openModal(title, lines) {
  elements.modalTitle.textContent = title;
  elements.modalBody.innerHTML = lines.map((line) => `<p>${line}</p>`).join("");
  elements.modal.classList.remove("hidden");
}

function closeModal() {
  elements.modal.classList.add("hidden");
}

// UI event bindings
function bindEvents() {
  elements.playerNameInput.addEventListener("input", (event) => {
    updateState({ playerName: event.target.value });
  });

  elements.rollRoleBtn.addEventListener("click", () => {
    const role = roles[Math.floor(Math.random() * roles.length)];
    updateState({ roleId: role.id });
    elements.setupMessage.textContent = "";
    renderSetup();
  });

  elements.startGameBtn.addEventListener("click", () => {
    if (!state.roleId) {
      elements.setupMessage.textContent = "Roll a role before starting.";
      return;
    }

    const playerName = state.playerName.trim() || "Player";
    updateState({
      setupComplete: true,
      playerName,
      troops: 25,
      points: 0,
      cards: 0,
      actionsLeft: 4,
      turnActive: false,
      leaderAlive: true,
      cures: { crimson: 0, azure: 0, verdant: 0, obsidian: 0 },
      activeEffects: "",
      lastEvent: null
    });

    elements.setupMessage.textContent = "";
    showScreen();
  });

  $$("[data-stat]").forEach((button) => {
    button.addEventListener("click", () => {
      const stat = button.dataset.stat;
      const delta = Number(button.dataset.delta);
      const nextValue = Math.max(0, (state[stat] || 0) + delta);
      updateState({ [stat]: nextValue });
      renderDashboard();
    });
  });

  elements.cardsInput.addEventListener("input", (event) => {
    updateState({ cards: Math.max(0, Number(event.target.value) || 0) });
    renderDashboard();
  });

  elements.leaderToggle.addEventListener("change", (event) => {
    updateState({ leaderAlive: event.target.checked });
    renderDashboard();
  });

  elements.respawnLeaderBtn.addEventListener("click", () => {
    updateState({ leaderAlive: true });
    renderDashboard();
  });

  elements.startTurnBtn.addEventListener("click", () => {
    updateState({ actionsLeft: 4, turnActive: true });
    resetTurnMessage();
    renderDashboard();
  });

  elements.useActionBtn.addEventListener("click", () => {
    if (!state.turnActive) {
      setTurnMessage("Wait for your turn");
      return;
    }

    const nextActions = clamp(state.actionsLeft - 1, 0, 4);
    const turnEnded = nextActions === 0;
    updateState({ actionsLeft: nextActions, turnActive: !turnEnded });
    renderDashboard();

    if (turnEnded) {
      setTurnMessage("Turn Ended");
    } else {
      resetTurnMessage();
    }
  });

  elements.cureTracker.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || !button.dataset.cure) {
      return;
    }

    const diseaseId = button.dataset.cure;
    const delta = Number(button.dataset.delta);
    const current = state.cures[diseaseId] || 0;
    const next = clamp(current + delta, 0, 5);

    updateState({
      cures: {
        ...state.cures,
        [diseaseId]: next
      }
    });

    renderDashboard();
  });

  elements.useCardsBtn.addEventListener("click", () => {
    setCureMessage("");
    if (state.cards < 3) {
      setCureMessage("Not enough cards. Need 3.");
      return;
    }

    const diseaseId = elements.cureSelect.value;
    const current = state.cures[diseaseId] || 0;
    if (current >= 5) {
      setCureMessage("That disease is already cured.");
      return;
    }

    updateState({
      cards: state.cards - 3,
      cures: {
        ...state.cures,
        [diseaseId]: clamp(current + 1, 0, 5)
      }
    });

    renderDashboard();
    setCureMessage("");
  });

  elements.drawEventBtn.addEventListener("click", () => {
    elements.drawEventBtn.disabled = true;
    elements.eventDisplay.innerHTML = `
      <div class="event-name">Spinning...</div>
      <div class="event-desc">Revealing the next event.</div>
    `;

    setTimeout(() => {
      const event = events[Math.floor(Math.random() * events.length)];
      updateState({ lastEvent: event });
      elements.drawEventBtn.disabled = false;
      renderEvent();
    }, 800);
  });

  elements.activeEffects.addEventListener("input", (event) => {
    updateState({ activeEffects: event.target.value });
  });

  $$("[data-war]").forEach((button) => {
    button.addEventListener("click", () => {
      const power = warPowers[button.dataset.war];
      if (!power) {
        return;
      }
      openModal(power.title, [power.effect, power.condition, power.counter]);
    });
  });

  $$("[data-shop]").forEach((button) => {
    button.addEventListener("click", () => {
      setShopMessage(button.dataset.shop);
    });
  });

  elements.modalClose.addEventListener("click", closeModal);
  elements.modal.addEventListener("click", (event) => {
    if (event.target === elements.modal) {
      closeModal();
    }
  });
}

showScreen();
bindEvents();
