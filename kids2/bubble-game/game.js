(function () {
  const LEVELS = [
    {
      id: "soap-table",
      title: "1. Свободные пузыри",
      description: "Самый мягкий режим со спокойными пузырями.",
      backgroundTop: "#d9fbff",
      backgroundBottom: "#b9f0ee",
      rail: "#58bfb2",
      railDark: "#258f86",
      railLight: "#91fff2",
      sparkle: "#ffffff",
      style: "soft",
      defaultToolId: "bubble-wand",
      radiusRange: [38, 74],
      speedRange: [72, 126],
      bubbleCountRange: [8, 16],
      areaPerBubble: 74000,
      huePalette: null,
      recommendedNext: "star-bubble-table",
      superPowers: false
    },
    {
      id: "star-bubble-table",
      title: "2. Звездная палочка",
      description: "Яркая локация: крупные цветные шары, счет, таймер и супер-удары.",
      backgroundTop: "#10bfb7",
      backgroundBottom: "#078384",
      rail: "#8e49c9",
      railDark: "#562184",
      railLight: "#c77dff",
      sparkle: "#fff8a8",
      style: "star",
      defaultToolId: "star-wand",
      radiusRange: [58, 98],
      speedRange: [82, 142],
      bubbleCountRange: [7, 12],
      areaPerBubble: 116000,
      huePalette: [205, 48, 329, 26, 96, 181, 276],
      recommendedNext: "blower-corners",
      superPowers: true
    },
    {
      id: "blower-corners",
      title: "3. Палочки-надуватели",
      description: "Пузыри появляются около мягких палочек по краям.",
      backgroundTop: "#b9f7ef",
      backgroundBottom: "#6fd5ce",
      rail: "#6b45b9",
      railDark: "#3d236d",
      railLight: "#bca7ff",
      sparkle: "#fff8a8",
      style: "blowers",
      defaultToolId: "star-wand",
      radiusRange: [50, 88],
      speedRange: [72, 124],
      bubbleCountRange: [7, 12],
      areaPerBubble: 118000,
      huePalette: [184, 202, 48, 315, 95],
      recommendedNext: "color-bubbles",
      superPowers: true,
      spawnStyle: "blowers"
    },
    {
      id: "color-bubbles",
      title: "4. Цветные пузыри",
      description: "Золотые, голубые и розовые пузыри дают мягкие бонусы.",
      backgroundTop: "#78e7d6",
      backgroundBottom: "#1ca7aa",
      rail: "#5b8df0",
      railDark: "#2854a5",
      railLight: "#b5d8ff",
      sparkle: "#fff8a8",
      style: "color",
      defaultToolId: "star-wand",
      radiusRange: [52, 92],
      speedRange: [78, 132],
      bubbleCountRange: [8, 13],
      areaPerBubble: 108000,
      huePalette: [198, 48, 318, 92, 26],
      recommendedNext: "happy-chaos",
      superPowers: true,
      bubbleKinds: true
    },
    {
      id: "happy-chaos",
      title: "5. Веселый хаос",
      description: "Больше пузырей и эффектов, но без наказаний.",
      backgroundTop: "#26cfd3",
      backgroundBottom: "#078384",
      rail: "#d15be8",
      railDark: "#6e2480",
      railLight: "#ffabf7",
      sparkle: "#fff8a8",
      style: "chaos",
      defaultToolId: "star-wand",
      radiusRange: [42, 82],
      speedRange: [94, 162],
      bubbleCountRange: [11, 18],
      areaPerBubble: 76000,
      huePalette: [205, 48, 329, 26, 96, 181, 276],
      recommendedNext: "soap-table",
      superPowers: true,
      bubbleKinds: true,
      extraEffects: true
    }
  ];

  const LOCATIONS = LEVELS;

  const DEFAULT_LEVEL_SETTINGS = Object.freeze({
    "soap-table": Object.freeze({ scoreLimit: 200000, timeLimitSeconds: 600 }),
    "star-bubble-table": Object.freeze({ scoreLimit: 100000, timeLimitSeconds: 300 }),
    "blower-corners": Object.freeze({ scoreLimit: 150000, timeLimitSeconds: 360 }),
    "color-bubbles": Object.freeze({ scoreLimit: 200000, timeLimitSeconds: 420 }),
    "happy-chaos": Object.freeze({ scoreLimit: 300000, timeLimitSeconds: 480 })
  });
  const SCORE_LIMIT_MIN = 10000;
  const SCORE_LIMIT_MAX = 10000000;
  const SCORE_LIMIT_STEP = 10000;
  const TIME_LIMIT_MIN_SECONDS = 30;
  const TIME_LIMIT_MAX_SECONDS = 60 * 60;

  const TOOLS = [
    {
      id: "bubble-wand",
      title: "Пузырьковая палочка",
      description: "Простое кольцо под мышкой лопает шары.",
      radius: 66,
      style: "ring"
    },
    {
      id: "star-wand",
      title: "Звездная палочка",
      description: "Кольцо со звездой и яркими эффектами.",
      radius: 74,
      style: "star"
    }
  ];

  const STORAGE_KEY = window.GameKidsDeployment.makeStorageKey("babyBubbleGameSettingsV2");
  const MAX_CHARGE = 4;
  const CHARGE_GROW_SECONDS = 4;
  const MAX_CHARGE_HOLD_SECONDS = 5;
  const PHONE_WAND_SCALE = 0.625;
  const TABLET_WAND_SCALE = 0.775;
  const WAND_TOUCH_BASE_FOOTPRINT_FACTOR = 1.82;
  const WAND_CHARGED_FOOTPRINT_FACTOR = 2.3;
  const WAND_HIT_RADIUS_FACTOR = 0.72;
  const KEY_BURST_MIN_SECONDS = 1.35;
  const menu = document.getElementById("menu");
  const game = document.getElementById("game");
  const startGameButton = document.getElementById("startGame");
  const locationList = document.getElementById("locationList");
  const toolList = document.getElementById("toolList");
  const keyboardOverlayToggle = document.getElementById("keyboardOverlayToggle");
  const letterStrokeColorInput = document.getElementById("letterStrokeColor");
  const popSoundList = document.getElementById("popSoundList");
  const chargeSoundList = document.getElementById("chargeSoundList");
  const effectsVolumeInput = document.getElementById("effectsVolume");
  const superVolumeInput = document.getElementById("superVolume");
  const enableSoundButton = document.getElementById("enableSoundButton");
  const mobileSuperButtonsToggle = document.getElementById("mobileSuperButtonsToggle");
  const progressSummary = document.getElementById("progressSummary");
  const resetProgressButton = document.getElementById("resetProgressButton");
  const resetLevelSettingsButton = document.getElementById("resetLevelSettingsButton");
  const levelSettingsModal = document.getElementById("levelSettingsModal");
  const levelSettingsTitle = document.getElementById("levelSettingsTitle");
  const levelScoreLimitInput = document.getElementById("levelScoreLimit");
  const scoreMinusButton = document.getElementById("scoreMinusButton");
  const scorePlusButton = document.getElementById("scorePlusButton");
  const scoreUnlimitedInput = document.getElementById("scoreUnlimited");
  const levelTimeMinutesInput = document.getElementById("levelTimeMinutes");
  const levelTimeSecondsInput = document.getElementById("levelTimeSeconds");
  const timeMinusButton = document.getElementById("timeMinusButton");
  const timePlusButton = document.getElementById("timePlusButton");
  const timeUnlimitedInput = document.getElementById("timeUnlimited");
  const levelSettingsError = document.getElementById("levelSettingsError");
  const saveLevelSettingsButton = document.getElementById("saveLevelSettingsButton");
  const defaultLevelSettingsButton = document.getElementById("defaultLevelSettingsButton");
  const cancelLevelSettingsButton = document.getElementById("cancelLevelSettingsButton");
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const exitZone = document.getElementById("exitZone");
  const mobileControls = document.getElementById("mobileControls");
  const mobileSuperButton = document.getElementById("mobileSuperButton");
  const mobileWaveButton = document.getElementById("mobileWaveButton");
  const resultOverlay = document.getElementById("resultOverlay");
  const resultTitle = document.getElementById("resultTitle");
  const resultText = document.getElementById("resultText");
  const repeatLevelButton = document.getElementById("repeatLevelButton");
  const nextLevelButton = document.getElementById("nextLevelButton");
  const resultMenuButton = document.getElementById("resultMenuButton");

  let selectedLocationId = LOCATIONS[0].id;
  let selectedToolId = TOOLS[0].id;
  let selectedPopSoundId = "new-soft-plop";
  let selectedChargeSoundId = "new-soft-charge";
  let effectsVolume = 0.55;
  let superVolume = 0.5;
  let progressState = {};
  let levelSettings = createDefaultLevelSettings();
  let editingLevelId = null;
  let levelSettingsOpener = null;
  let activeRoundSettings = null;
  let running = false;
  let animationFrame = 0;
  let lastFrameTime = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let bubbles = [];
  let pops = [];
  let effects = [];
  let starShots = [];
  let keyBursts = [];
  let audioContext = null;
  let audioGraph = null;
  let exitHoldTimer = 0;
  let score = 0;
  let roundTime = 0;
  let elapsedTime = 0;
  let roundStartedAtMs = 0;
  let roundDeadlineMs = null;
  let roundFinished = false;
  let finalScore = 0;
  let roundResultText = "Раунд окончен";
  let roundPause = 0;
  let freezeTimer = 0;
  let gameClock = 0;
  let rightWaveTimer = 0;
  let keyOverlayBusy = false;
  let chargeMaxHoldTime = 0;
  let chargeAudio = null;
  let chargePreviewTimer = 0;
  let colorSlowTimer = 0;
  let popSoundWindowStart = 0;
  let popSoundCountInWindow = 0;
  let viewportResizeFrame = 0;
  const recentInstantButtons = {};
  const coarsePointerQuery = window.matchMedia?.("(pointer: coarse)");
  const finePointerQuery = window.matchMedia?.("(pointer: fine)");
  const isTouchDevice = Boolean(coarsePointerQuery?.matches || navigator.maxTouchPoints > 0);
  let activePointerType = coarsePointerQuery?.matches ? "touch" : "mouse";
  document.body.classList.toggle("is-touch", isTouchDevice);

  const POP_SOUND_OPTIONS = [
    {
      id: "soft-pop",
      title: "Старый мягкий",
      description: "Старый короткий плоп."
    },
    {
      id: "water-pop",
      title: "Старый водяной",
      description: "Старый бульк и лопание."
    },
    {
      id: "glass-pop",
      title: "Старый звонкий",
      description: "Старый вариант с легким звоном."
    },
    {
      id: "toy-pop",
      title: "Старый игрушечный",
      description: "Старый яркий хлопок."
    },
    {
      id: "new-soft-plop",
      title: "Новый мягкий плоп",
      description: "Самый мягкий звук по умолчанию."
    },
    {
      id: "new-deep-bubble",
      title: "Новый глубокий пузырь",
      description: "Низкий пух без писка."
    },
    {
      id: "new-water-bulk",
      title: "Новый водяной бульк",
      description: "Короткий водяной бульк."
    },
    {
      id: "new-quiet-toy",
      title: "Новый тихий игрушечный",
      description: "Мягкий детский хлопок."
    },
    {
      id: "file-pop-soft",
      title: "Файл: pop-soft",
      description: "Внешний MP3/OGG/WAV с fallback.",
      files: [
        "../assets/sounds/pop-soft.mp3",
        "../assets/sounds/pop-soft.ogg",
        "../assets/sounds/pop-soft.wav"
      ],
      fallback: "new-soft-plop"
    }
  ];

  const CHARGE_SOUND_OPTIONS = [
    {
      id: "magic-hum",
      title: "Старый мягкая магия",
      description: "Старый теплый ровный заряд."
    },
    {
      id: "toy-whirr",
      title: "Старый игрушечный мотор",
      description: "Старое мягкое вжжж."
    },
    {
      id: "power-rise",
      title: "Старый супер-удар",
      description: "Старый нарастающий вариант."
    },
    {
      id: "star-shimmer",
      title: "Старый звездный заряд",
      description: "Старое плавное переливание."
    },
    {
      id: "new-soft-charge",
      title: "Новый мягкий заряд",
      description: "Тихий ровный рост."
    },
    {
      id: "new-deep-charge",
      title: "Новый глубокий суперудар",
      description: "Низкое накопление силы."
    },
    {
      id: "new-warm-wave",
      title: "Новая теплая волна",
      description: "Плавный теплый подъем."
    },
    {
      id: "new-quiet-magic",
      title: "Новая тихая магия",
      description: "Мягкое детское переливание."
    },
    {
      id: "file-charge-soft",
      title: "Файл: charge-soft",
      description: "Внешний MP3/OGG/WAV с fallback.",
      files: [
        "../assets/sounds/charge-soft.mp3",
        "../assets/sounds/charge-soft.ogg",
        "../assets/sounds/charge-soft.wav"
      ],
      fallback: "new-soft-charge"
    }
  ];

  const pointer = {
    x: 0,
    y: 0,
    active: false
  };

  const input = {
    left: false,
    right: false,
    charge: 0
  };

  const specialKeyDisplays = {
    " ": "Пробел",
    Enter: "Enter",
    Backspace: "Backspace",
    Tab: "Tab",
    Escape: "Esc",
    ArrowUp: "↑",
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→",
    Shift: "Shift",
    Control: "Ctrl",
    Alt: "Alt",
    Meta: "Win",
    CapsLock: "Caps",
    Delete: "Del",
    Insert: "Ins",
    Home: "Home",
    End: "End",
    PageUp: "PgUp",
    PageDown: "PgDn",
    PrintScreen: "PrtSc",
    ScrollLock: "ScrLk",
    Pause: "Pause",
    NumLock: "Num",
    ContextMenu: "Menu"
  };

  const digitSpeech = {
    "0": "ноль",
    "1": "один",
    "2": "два",
    "3": "три",
    "4": "четыре",
    "5": "пять",
    "6": "шесть",
    "7": "семь",
    "8": "восемь",
    "9": "девять"
  };

  const latinLetterSpeech = {
    A: "A",
    B: "B",
    C: "C",
    D: "D",
    E: "E",
    F: "F",
    G: "G",
    H: "H",
    I: "I",
    J: "J",
    K: "K",
    L: "L",
    M: "M",
    N: "N",
    O: "O",
    P: "P",
    Q: "Q",
    R: "R",
    S: "S",
    T: "T",
    U: "U",
    V: "V",
    W: "W",
    X: "X",
    Y: "Y",
    Z: "Z"
  };

  const russianLetterSpeech = {
    А: "а",
    Б: "бэ",
    В: "вэ",
    Г: "гэ",
    Д: "дэ",
    Е: "е",
    Ё: "ё",
    Ж: "жэ",
    З: "зэ",
    И: "и",
    Й: "и краткое",
    К: "ка",
    Л: "эль",
    М: "эм",
    Н: "эн",
    О: "о",
    П: "пэ",
    Р: "эр",
    С: "эс",
    Т: "тэ",
    У: "у",
    Ф: "эф",
    Х: "ха",
    Ц: "цэ",
    Ч: "чэ",
    Ш: "ша",
    Щ: "ща",
    Ъ: "твердый знак",
    Ы: "ы",
    Ь: "мягкий знак",
    Э: "э",
    Ю: "ю",
    Я: "я"
  };

  const specialKeySpeech = {
    " ": ["пробел", "ru-RU"],
    Enter: ["энтер", "ru-RU"],
    Backspace: ["бэкспейс", "ru-RU"],
    Tab: ["таб", "ru-RU"],
    Escape: ["эскейп", "ru-RU"],
    ArrowUp: ["вверх", "ru-RU"],
    ArrowDown: ["вниз", "ru-RU"],
    ArrowLeft: ["влево", "ru-RU"],
    ArrowRight: ["вправо", "ru-RU"],
    Shift: ["шифт", "ru-RU"],
    Control: ["контрол", "ru-RU"],
    Alt: ["альт", "ru-RU"],
    Meta: ["виндовс", "ru-RU"],
    CapsLock: ["капс лок", "ru-RU"],
    Delete: ["делит", "ru-RU"],
    Insert: ["инсерт", "ru-RU"],
    Home: ["хоум", "ru-RU"],
    End: ["энд", "ru-RU"],
    PageUp: ["пейдж ап", "ru-RU"],
    PageDown: ["пейдж даун", "ru-RU"],
    PrintScreen: ["принт скрин", "ru-RU"],
    ScrollLock: ["скрол лок", "ru-RU"],
    Pause: ["пауза", "ru-RU"],
    NumLock: ["нам лок", "ru-RU"],
    ContextMenu: ["меню", "ru-RU"]
  };

  function currentLocation() {
    return LOCATIONS.find((location) => location.id === selectedLocationId) || LOCATIONS[0];
  }

  function currentTool() {
    return TOOLS.find((tool) => tool.id === selectedToolId) || TOOLS[0];
  }

  function isSuperLocation() {
    return currentLocation().superPowers;
  }

  function cloneDefaultLevelSetting(levelId) {
    const fallback = DEFAULT_LEVEL_SETTINGS[levelId] || DEFAULT_LEVEL_SETTINGS[LOCATIONS[0].id];
    return {
      scoreLimit: fallback.scoreLimit,
      timeLimitSeconds: fallback.timeLimitSeconds
    };
  }

  function createDefaultLevelSettings() {
    return Object.fromEntries(
      LOCATIONS.map((level) => [level.id, cloneDefaultLevelSetting(level.id)])
    );
  }

  function isValidScoreLimit(value) {
    return value === null || (
      Number.isInteger(value) &&
      value >= SCORE_LIMIT_MIN &&
      value <= SCORE_LIMIT_MAX &&
      value % SCORE_LIMIT_STEP === 0
    );
  }

  function isValidTimeLimit(value) {
    return value === null || (
      Number.isInteger(value) &&
      value >= TIME_LIMIT_MIN_SECONDS &&
      value <= TIME_LIMIT_MAX_SECONDS
    );
  }

  function normalizeLevelSetting(savedSetting, levelId) {
    const fallback = cloneDefaultLevelSetting(levelId);
    if (!savedSetting || typeof savedSetting !== "object") {
      return fallback;
    }

    const hasScoreLimit = Object.prototype.hasOwnProperty.call(savedSetting, "scoreLimit");
    const hasTimeLimit = Object.prototype.hasOwnProperty.call(savedSetting, "timeLimitSeconds");
    const candidate = {
      scoreLimit: hasScoreLimit ? savedSetting.scoreLimit : fallback.scoreLimit,
      timeLimitSeconds: hasTimeLimit ? savedSetting.timeLimitSeconds : fallback.timeLimitSeconds
    };

    if (
      !isValidScoreLimit(candidate.scoreLimit) ||
      !isValidTimeLimit(candidate.timeLimitSeconds) ||
      (candidate.scoreLimit === null && candidate.timeLimitSeconds === null)
    ) {
      return fallback;
    }

    return candidate;
  }

  function loadLevelSettings(savedSettings) {
    return Object.fromEntries(
      LOCATIONS.map((level) => [
        level.id,
        normalizeLevelSetting(savedSettings?.[level.id], level.id)
      ])
    );
  }

  function getLevelSettings(levelId) {
    const normalized = normalizeLevelSetting(levelSettings[levelId], levelId);
    levelSettings[levelId] = normalized;
    return normalized;
  }

  function formatScoreLimit(scoreLimit) {
    return scoreLimit === null ? "Без ограничения" : scoreLimit.toLocaleString("ru-RU");
  }

  function formatTimeLimit(timeLimitSeconds) {
    return timeLimitSeconds === null ? "Без ограничения" : formatTime(timeLimitSeconds);
  }

  function loadSettings() {
    let levelSettingsMigrationNeeded = false;
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (parsed.locationId && LOCATIONS.some((location) => location.id === parsed.locationId)) {
        selectedLocationId = parsed.locationId;
      }
      if (parsed.toolId && TOOLS.some((tool) => tool.id === parsed.toolId)) {
        selectedToolId = parsed.toolId;
      }
      if (typeof parsed.keyboardOverlayEnabled === "boolean") {
        keyboardOverlayToggle.checked = parsed.keyboardOverlayEnabled;
      }
      if (parsed.letterStrokeColor) {
        letterStrokeColorInput.value = parsed.letterStrokeColor;
      }
      if (parsed.popSoundId && POP_SOUND_OPTIONS.some((option) => option.id === parsed.popSoundId)) {
        selectedPopSoundId = parsed.popSoundId;
      }
      if (parsed.chargeSoundId && CHARGE_SOUND_OPTIONS.some((option) => option.id === parsed.chargeSoundId)) {
        selectedChargeSoundId = parsed.chargeSoundId;
      }
      if (typeof parsed.effectsVolume === "number") {
        effectsVolume = Math.max(0, Math.min(1, parsed.effectsVolume));
      }
      if (typeof parsed.superVolume === "number") {
        superVolume = Math.max(0, Math.min(1, parsed.superVolume));
      }
      if (typeof parsed.mobileSuperButtonsEnabled === "boolean") {
        mobileSuperButtonsToggle.checked = parsed.mobileSuperButtonsEnabled;
      }
      if (parsed.progressState && typeof parsed.progressState === "object") {
        progressState = parsed.progressState;
      }
      levelSettings = loadLevelSettings(parsed.levelSettings);
      levelSettingsMigrationNeeded = !parsed.levelSettings || LOCATIONS.some((level) => {
        return JSON.stringify(parsed.levelSettings[level.id]) !== JSON.stringify(levelSettings[level.id]);
      });
    } catch (error) {
      selectedLocationId = LOCATIONS[0].id;
      selectedToolId = LOCATIONS[0].defaultToolId;
      levelSettings = createDefaultLevelSettings();
    }

    effectsVolumeInput.value = String(Math.round(effectsVolume * 100));
    superVolumeInput.value = String(Math.round(superVolume * 100));

    let parsedForTouchDefaults = {};
    try {
      parsedForTouchDefaults = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (error) {
      parsedForTouchDefaults = {};
    }
    if (isTouchDevice && typeof parsedForTouchDefaults.keyboardOverlayEnabled !== "boolean") {
      keyboardOverlayToggle.checked = false;
    }
    if (levelSettingsMigrationNeeded) {
      try {
        saveSettings();
      } catch (error) {
        // Storage can be unavailable in private modes; in-memory defaults still keep the game usable.
      }
    }
  }

  function saveSettings() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        locationId: selectedLocationId,
        toolId: selectedToolId,
        keyboardOverlayEnabled: keyboardOverlayToggle.checked,
        letterStrokeColor: letterStrokeColorInput.value,
        popSoundId: selectedPopSoundId,
        chargeSoundId: selectedChargeSoundId,
        effectsVolume,
        superVolume,
        mobileSuperButtonsEnabled: mobileSuperButtonsToggle.checked,
        progressState,
        levelSettings,
        levelId: selectedLocationId
      })
    );
  }

  function renderLocationList() {
    locationList.innerHTML = "";
    LOCATIONS.forEach((level) => {
      const card = document.createElement("div");
      card.className = "level-card";
      if (level.id === selectedLocationId) {
        card.classList.add("is-active");
      }
      if (getLevelProgress(level.id).completed) {
        card.classList.add("is-completed");
      }
      if (currentLocation().recommendedNext === level.id && level.id !== selectedLocationId) {
        card.classList.add("is-recommended");
      }

      const selectButton = document.createElement("button");
      selectButton.type = "button";
      selectButton.className = "level-select-button";

      const title = document.createElement("strong");
      title.textContent = level.title;
      const description = document.createElement("small");
      description.textContent = level.description;
      const limits = document.createElement("span");
      limits.className = "level-limits";
      const setting = getLevelSettings(level.id);
      limits.textContent = `Цель: ${formatScoreLimit(setting.scoreLimit)} · Время: ${formatTimeLimit(setting.timeLimitSeconds)}`;
      selectButton.append(title, description, limits);
      selectButton.addEventListener("click", () => {
        selectedLocationId = level.id;
        selectedToolId = level.defaultToolId;
        saveSettings();
        renderMenus();
      });

      const settingsButton = document.createElement("button");
      settingsButton.type = "button";
      settingsButton.className = "level-settings-button";
      settingsButton.textContent = "⚙ Настроить уровень";
      settingsButton.setAttribute("aria-label", `Настроить ${level.title}`);
      settingsButton.addEventListener("click", () => openLevelSettings(level.id));

      card.append(selectButton, settingsButton);
      locationList.appendChild(card);
    });
  }

  function renderChoiceList(listElement, items, activeId, onSelect) {
    listElement.innerHTML = "";
    items.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "location-card";
      button.innerHTML = `<strong>${item.title}</strong><small>${item.description}</small>`;
      if (item.id === activeId) {
        button.classList.add("is-active");
      }
      button.addEventListener("click", () => {
        onSelect(item);
        saveSettings();
        renderMenus();
      });
      listElement.appendChild(button);
    });
  }

  function renderMenus() {
    renderLocationList();
    renderChoiceList(toolList, TOOLS, selectedToolId, (tool) => {
      selectedToolId = tool.id;
    });
    renderSoundOptions();
    renderProgressSummary();
  }

  function getLevelProgress(levelId) {
    if (!progressState[levelId]) {
      progressState[levelId] = {
        bestScore: 0,
        starts: 0,
        lastStartedAt: "",
        completed: false
      };
    }
    return progressState[levelId];
  }

  function renderProgressSummary() {
    progressSummary.innerHTML = "";
    LOCATIONS.forEach((level) => {
      const state = getLevelProgress(level.id);
      const row = document.createElement("div");
      row.className = "progress-row";
      const completed = state.completed ? "завершался" : "еще не завершался";
      row.textContent = `${level.title}: лучший счет ${state.bestScore || 0}, запусков ${state.starts || 0}, ${completed}`;
      progressSummary.appendChild(row);
    });
  }

  function recordLevelStart(levelId) {
    const state = getLevelProgress(levelId);
    state.starts = (state.starts || 0) + 1;
    state.lastStartedAt = new Date().toISOString();
    saveSettings();
    renderProgressSummary();
  }

  function recordLevelComplete(levelId, resultScore) {
    const state = getLevelProgress(levelId);
    state.completed = true;
    state.bestScore = Math.max(state.bestScore || 0, resultScore || 0);
    saveSettings();
    renderProgressSummary();
  }

  function setLevelSettingsError(message) {
    levelSettingsError.textContent = message || "";
    levelSettingsError.classList.toggle("hidden", !message);
  }

  function setTimeDraft(totalSeconds) {
    const safeSeconds = Math.max(0, Math.min(TIME_LIMIT_MAX_SECONDS, Math.round(totalSeconds)));
    levelTimeMinutesInput.value = String(Math.floor(safeSeconds / 60));
    levelTimeSecondsInput.value = String(safeSeconds % 60);
  }

  function updateLevelLimitControlStates() {
    const scoreDisabled = scoreUnlimitedInput.checked;
    levelScoreLimitInput.disabled = scoreDisabled;
    scoreMinusButton.disabled = scoreDisabled;
    scorePlusButton.disabled = scoreDisabled;

    const timeDisabled = timeUnlimitedInput.checked;
    levelTimeMinutesInput.disabled = timeDisabled;
    levelTimeSecondsInput.disabled = timeDisabled;
    timeMinusButton.disabled = timeDisabled;
    timePlusButton.disabled = timeDisabled;
  }

  function populateLevelSettingsDraft(levelId, setting) {
    const fallback = cloneDefaultLevelSetting(levelId);
    scoreUnlimitedInput.checked = setting.scoreLimit === null;
    levelScoreLimitInput.value = String(setting.scoreLimit ?? fallback.scoreLimit);
    timeUnlimitedInput.checked = setting.timeLimitSeconds === null;
    setTimeDraft(setting.timeLimitSeconds ?? fallback.timeLimitSeconds);
    updateLevelLimitControlStates();
    setLevelSettingsError("");
  }

  function openLevelSettings(levelId) {
    const level = LOCATIONS.find((item) => item.id === levelId);
    if (!level || running) {
      return;
    }
    editingLevelId = level.id;
    levelSettingsOpener = document.activeElement;
    levelSettingsTitle.textContent = level.title;
    populateLevelSettingsDraft(level.id, getLevelSettings(level.id));
    menu.setAttribute("inert", "");
    levelSettingsModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    const focusTarget = !scoreUnlimitedInput.checked
      ? levelScoreLimitInput
      : !timeUnlimitedInput.checked
        ? levelTimeMinutesInput
        : scoreUnlimitedInput;
    window.setTimeout(() => focusTarget.focus({ preventScroll: true }), 0);
  }

  function closeLevelSettings() {
    const returnFocus = levelSettingsOpener;
    editingLevelId = null;
    levelSettingsOpener = null;
    levelSettingsModal.classList.add("hidden");
    menu.removeAttribute("inert");
    document.body.classList.remove("modal-open");
    setLevelSettingsError("");
    if (returnFocus?.isConnected) {
      returnFocus.focus({ preventScroll: true });
    }
  }

  function adjustScoreLimit(delta) {
    if (scoreUnlimitedInput.checked) {
      return;
    }
    const current = Number(levelScoreLimitInput.value);
    const base = Number.isFinite(current) ? current : SCORE_LIMIT_MIN;
    const stepped = Math.round(base / SCORE_LIMIT_STEP) * SCORE_LIMIT_STEP + delta;
    levelScoreLimitInput.value = String(Math.max(SCORE_LIMIT_MIN, Math.min(SCORE_LIMIT_MAX, stepped)));
    setLevelSettingsError("");
  }

  function readTimeDraftSeconds() {
    const minutes = levelTimeMinutesInput.valueAsNumber;
    const seconds = levelTimeSecondsInput.valueAsNumber;
    if (!Number.isInteger(minutes) || !Number.isInteger(seconds) || minutes < 0 || minutes > 60 || seconds < 0 || seconds > 59) {
      return Number.NaN;
    }
    return minutes * 60 + seconds;
  }

  function adjustTimeLimit(delta) {
    if (timeUnlimitedInput.checked) {
      return;
    }
    const current = readTimeDraftSeconds();
    const base = Number.isFinite(current) ? current : TIME_LIMIT_MIN_SECONDS;
    setTimeDraft(Math.max(TIME_LIMIT_MIN_SECONDS, Math.min(TIME_LIMIT_MAX_SECONDS, base + delta)));
    setLevelSettingsError("");
  }

  function readLevelSettingsDraft() {
    const scoreLimit = scoreUnlimitedInput.checked ? null : levelScoreLimitInput.valueAsNumber;
    const timeLimitSeconds = timeUnlimitedInput.checked ? null : readTimeDraftSeconds();

    if (scoreLimit === null && timeLimitSeconds === null) {
      return {
        error: "Нельзя отключить и цель по очкам, и время. Оставьте хотя бы одно ограничение."
      };
    }
    if (!isValidScoreLimit(scoreLimit)) {
      return {
        error: "Цель должна быть от 10 000 до 10 000 000 очков с шагом 10 000."
      };
    }
    if (!isValidTimeLimit(timeLimitSeconds)) {
      return {
        error: "Время должно быть от 30 секунд до 60 минут."
      };
    }

    return { setting: { scoreLimit, timeLimitSeconds } };
  }

  function saveLevelSettingsDraft() {
    if (!editingLevelId) {
      return;
    }
    const result = readLevelSettingsDraft();
    if (result.error) {
      setLevelSettingsError(result.error);
      return;
    }
    levelSettings[editingLevelId] = result.setting;
    saveSettings();
    renderMenus();
    closeLevelSettings();
  }

  function restoreCurrentLevelDefaults() {
    if (!editingLevelId) {
      return;
    }
    populateLevelSettingsDraft(editingLevelId, cloneDefaultLevelSetting(editingLevelId));
  }

  function renderSoundList(listElement, options, activeId, onSelect, onPreview) {
    listElement.innerHTML = "";
    options.forEach((option) => {
      const card = document.createElement("div");
      card.className = "sound-card";
      if (option.id === activeId) {
        card.classList.add("is-active");
      }

      const text = document.createElement("div");
      text.innerHTML = `<strong>${option.title}</strong><span>${option.description}</span>`;

      const actions = document.createElement("div");
      actions.className = "sound-actions";

      const selectButton = document.createElement("button");
      selectButton.type = "button";
      selectButton.className = "sound-button";
      selectButton.textContent = option.id === activeId ? "✓" : "○";
      selectButton.setAttribute("aria-label", `Выбрать ${option.title}`);
      selectButton.addEventListener("click", () => {
        onSelect(option.id);
        saveSettings();
        renderSoundOptions();
      });

      const previewButton = document.createElement("button");
      previewButton.type = "button";
      previewButton.className = "sound-button";
      previewButton.textContent = "▶";
      previewButton.setAttribute("aria-label", `Прослушать ${option.title}`);
      previewButton.addEventListener("click", () => {
        onPreview(option.id);
      });

      actions.append(selectButton, previewButton);
      card.append(text, actions);
      listElement.appendChild(card);
    });
  }

  function renderSoundOptions() {
    renderSoundList(
      popSoundList,
      POP_SOUND_OPTIONS,
      selectedPopSoundId,
      (id) => {
        selectedPopSoundId = id;
      },
      playPopPreview
    );
    renderSoundList(
      chargeSoundList,
      CHARGE_SOUND_OPTIONS,
      selectedChargeSoundId,
      (id) => {
        selectedChargeSoundId = id;
      },
      playChargePreview
    );
  }

  function resizeCanvas() {
    const previousWidth = width;
    const previousHeight = height;
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (previousWidth > 0 && previousHeight > 0 && pointer.active) {
      pointer.x = clamp((pointer.x / previousWidth) * width, 0, width);
      pointer.y = clamp((pointer.y / previousHeight) * height, 0, height);
    } else {
      pointer.x = width / 2;
      pointer.y = height / 2;
    }
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function choose(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getBlowerPoints(safeWidth, safeHeight) {
    const inset = Math.max(88, Math.min(safeWidth, safeHeight) * 0.13);
    return [
      { x: inset, y: inset },
      { x: safeWidth - inset, y: inset },
      { x: inset, y: safeHeight - inset },
      { x: safeWidth - inset, y: safeHeight - inset }
    ];
  }

  function getBubbleSpawn(location, radius, safeWidth, safeHeight) {
    if (location.spawnStyle === "blowers") {
      const point = choose(getBlowerPoints(safeWidth, safeHeight));
      return {
        x: clamp(point.x + randomBetween(-34, 34), radius + 34, safeWidth - radius - 34),
        y: clamp(point.y + randomBetween(-34, 34), radius + 34, safeHeight - radius - 34)
      };
    }

    return {
      x: randomBetween(radius + 32, safeWidth - radius - 32),
      y: randomBetween(radius + 32, safeHeight - radius - 32)
    };
  }

  function pickBubbleKind(location) {
    if (!location.bubbleKinds) {
      return "plain";
    }

    const roll = Math.random();
    if (roll < 0.14) {
      return "gold";
    }
    if (roll < 0.28) {
      return "slow";
    }
    if (roll < 0.42) {
      return "star";
    }
    return "plain";
  }

  function getBubbleHue(location, kind) {
    if (kind === "gold") {
      return randomBetween(42, 54);
    }
    if (kind === "slow") {
      return randomBetween(178, 205);
    }
    if (kind === "star") {
      return randomBetween(302, 326);
    }
    return location.huePalette ? choose(location.huePalette) : randomBetween(172, 212);
  }

  function formatTime(seconds) {
    const safeSeconds = Math.max(0, Math.ceil(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const rest = String(safeSeconds % 60).padStart(2, "0");
    return `${minutes}:${rest}`;
  }

  function getKeyInfo(event) {
    const key = event.key;

    if (specialKeyDisplays[key]) {
      const speech = specialKeySpeech[key] || [specialKeyDisplays[key], "ru-RU"];
      return {
        display: specialKeyDisplays[key],
        speechText: speech[0],
        speechLang: speech[1]
      };
    }

    if (/^F\d{1,2}$/.test(key)) {
      return {
        display: key,
        speechText: key.replace("F", "эф "),
        speechLang: "ru-RU"
      };
    }

    if (digitSpeech[key]) {
      return {
        display: key,
        speechText: digitSpeech[key],
        speechLang: "ru-RU"
      };
    }

    if (/^[a-z]$/i.test(key)) {
      const letter = key.toUpperCase();
      return {
        display: `${letter} ${letter.toLowerCase()}`,
        speechText: latinLetterSpeech[letter] || letter,
        speechLang: "en-US"
      };
    }

    if (/^[а-яё]$/i.test(key)) {
      const letter = key.toUpperCase();
      return {
        display: `${letter} ${letter.toLowerCase()}`,
        speechText: russianLetterSpeech[letter] || key,
        speechLang: "ru-RU"
      };
    }

    if (key.length === 1 && /\p{L}/u.test(key)) {
      return {
        display: `${key.toUpperCase()} ${key.toLowerCase()}`,
        speechText: key,
        speechLang: "ru-RU"
      };
    }

    if (key.length === 1) {
      return {
        display: key,
        speechText: key,
        speechLang: "ru-RU"
      };
    }

    return {
      display: key.slice(0, 8),
      speechText: key,
      speechLang: "ru-RU"
    };
  }

  function speakKeyOverlay(text, lang) {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
        window.setTimeout(resolve, 360);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.82;
      utterance.pitch = 1.04;
      utterance.volume = 1;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  }

  async function showKeyBurst(keyInfo) {
    if (!keyboardOverlayToggle.checked || keyOverlayBusy) {
      return false;
    }

    keyOverlayBusy = true;
    keyBursts.push({
      text: keyInfo.display,
      age: 0,
      life: KEY_BURST_MIN_SECONDS,
      stroke: letterStrokeColorInput.value,
      fill: "#ffffff"
    });

    if (keyBursts.length > 4) {
      keyBursts.shift();
    }

    await Promise.all([
      speakKeyOverlay(keyInfo.speechText, keyInfo.speechLang),
      new Promise((resolve) => window.setTimeout(resolve, KEY_BURST_MIN_SECONDS * 1000))
    ]);
    keyOverlayBusy = false;
    return true;
  }

  function roundedRectPath(context, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + w, y, x + w, y + h, radius);
    context.arcTo(x + w, y + h, x, y + h, radius);
    context.arcTo(x, y + h, x, y, radius);
    context.arcTo(x, y, x + w, y, radius);
    context.closePath();
  }

  function starPath(context, x, y, outerRadius, innerRadius, points, rotation) {
    context.beginPath();
    for (let index = 0; index < points * 2; index += 1) {
      const radius = index % 2 === 0 ? outerRadius : innerRadius;
      const angle = rotation + (index * Math.PI) / points;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (index === 0) {
        context.moveTo(px, py);
      } else {
        context.lineTo(px, py);
      }
    }
    context.closePath();
  }

  function normalizeBubbleVelocity(bubble) {
    const length = Math.hypot(bubble.vx, bubble.vy) || 1;
    bubble.vx = (bubble.vx / length) * bubble.speed;
    bubble.vy = (bubble.vy / length) * bubble.speed;
  }

  function calculateWandMetrics(options) {
    const shortSide = Math.max(1, Math.min(options.viewportWidth, options.viewportHeight));
    const portrait = options.viewportHeight >= options.viewportWidth;
    const touchCapable = options.coarsePointer ||
      options.pointerType === "touch" ||
      options.pointerType === "pen" ||
      (options.touchPoints > 0 && !options.finePointer);
    let mode = "desktop";
    if (options.starVisual && touchCapable && shortSide <= 560) {
      mode = "phone";
    } else if (options.starVisual && touchCapable && shortSide <= 1024) {
      mode = "tablet";
    }

    const deviceScale = mode === "phone" ? PHONE_WAND_SCALE : mode === "tablet" ? TABLET_WAND_SCALE : 1;
    const baseShare = portrait ? 0.18 : 0.16;
    const superShare = portrait ? 0.45 : 0.4;
    const scaledBaseRadius = options.toolRadius * deviceScale;
    const baseRadius = mode === "desktop"
      ? scaledBaseRadius
      : Math.min(scaledBaseRadius, (shortSide * baseShare) / WAND_TOUCH_BASE_FOOTPRINT_FACTOR);
    const uncappedMaxRadius = baseRadius * (1 + MAX_CHARGE);
    const maxRadius = mode === "desktop"
      ? uncappedMaxRadius
      : Math.min(uncappedMaxRadius, (shortSide * superShare) / WAND_CHARGED_FOOTPRINT_FACTOR);
    const chargeRatio = options.superActive
      ? Math.max(0, Math.min(1, options.charge / MAX_CHARGE))
      : 0;
    const renderRadius = mode === "desktop"
      ? baseRadius * (1 + chargeRatio * MAX_CHARGE)
      : baseRadius + (maxRadius - baseRadius) * chargeRatio;

    return {
      mode,
      compactVisual: mode !== "desktop",
      portrait,
      shortSide,
      baseRadius,
      renderRadius,
      collisionRadius: renderRadius * WAND_HIT_RADIUS_FACTOR
    };
  }

  function currentWandMetrics() {
    const tool = currentTool();
    const starVisual = tool.style === "star" || currentLocation().style !== "soft";
    const coarsePointer = Boolean(coarsePointerQuery?.matches);
    return calculateWandMetrics({
      toolRadius: tool.radius,
      charge: Math.min(MAX_CHARGE, input.charge),
      superActive: input.left && isSuperLocation(),
      starVisual,
      viewportWidth: width || window.innerWidth,
      viewportHeight: height || window.innerHeight,
      coarsePointer,
      finePointer: Boolean(finePointerQuery?.matches),
      pointerType: activePointerType,
      touchPoints: navigator.maxTouchPoints || 0
    });
  }

  function effectiveToolRadius() {
    return currentWandMetrics().renderRadius;
  }

  function makeBubble(existingBubbles) {
    const location = currentLocation();
    const safeWidth = Math.max(width, 640);
    const safeHeight = Math.max(height, 420);
    const radius = randomBetween(location.radiusRange[0], location.radiusRange[1]);
    const speed = randomBetween(location.speedRange[0], location.speedRange[1]);
    const angle = randomBetween(0, Math.PI * 2);
    const kind = pickBubbleKind(location);
    const hue = getBubbleHue(location, kind);
    let spawn = getBubbleSpawn(location, radius, safeWidth, safeHeight);
    let x = spawn.x;
    let y = spawn.y;

    for (let attempt = 0; attempt < 90; attempt += 1) {
      const overlaps = existingBubbles.some((bubble) => {
        return Math.hypot(x - bubble.x, y - bubble.y) < radius + bubble.r + 18;
      });
      const nearPointer = Math.hypot(x - pointer.x, y - pointer.y) < radius + effectiveToolRadius() + 52;
      if (!overlaps && !nearPointer) {
        break;
      }
      spawn = getBubbleSpawn(location, radius, safeWidth, safeHeight);
      x = spawn.x;
      y = spawn.y;
    }

    return {
      x,
      y,
      r: radius,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      speed,
      hue,
      kind,
      wobble: randomBetween(0, Math.PI * 2),
      glossy: location.style !== "soft" && Math.random() > 0.28,
      points: Math.max(10, Math.round(34 - radius / 5) * 5)
    };
  }

  function resetBubbles() {
    const location = currentLocation();
    const count = Math.max(
      location.bubbleCountRange[0],
      Math.min(location.bubbleCountRange[1], Math.floor((width * height) / location.areaPerBubble))
    );
    bubbles = [];
    for (let index = 0; index < count; index += 1) {
      bubbles.push(makeBubble(bubbles));
    }
  }

  function resetRound() {
    window.clearInterval(chargePreviewTimer);
    activeRoundSettings = { ...getLevelSettings(selectedLocationId) };
    roundStartedAtMs = performance.now();
    roundDeadlineMs = activeRoundSettings.timeLimitSeconds === null
      ? null
      : roundStartedAtMs + activeRoundSettings.timeLimitSeconds * 1000;
    score = 0;
    finalScore = 0;
    elapsedTime = 0;
    roundTime = activeRoundSettings.timeLimitSeconds ?? 0;
    roundResultText = "Раунд окончен";
    roundPause = 0;
    roundFinished = false;
    freezeTimer = 0;
    colorSlowTimer = 0;
    input.left = false;
    input.right = false;
    input.charge = 0;
    chargeMaxHoldTime = 0;
    keyOverlayBusy = false;
    stopChargeSound();
    window.speechSynthesis?.cancel();
    pops = [];
    effects = [];
    starShots = [];
    keyBursts = [];
    resetBubbles();
  }

  function mapVolumeSliderToGain(value) {
    const normalized = Math.max(0, Math.min(1, Number(value) || 0));
    const upperPosition = Math.max(0, Math.min(1, (normalized - 0.5) / 0.5));
    // Нижняя половина совпадает со старой шкалой; smoothstep плавно добавляет до +6.85 dB наверху.
    const upperBlend = upperPosition * upperPosition * (3 - 2 * upperPosition);
    return normalized * (1 + 1.2 * upperBlend);
  }

  function setAudioParamSmoothly(param, target, audio, duration) {
    const now = audio.currentTime;
    const safeTarget = Math.max(0, target);
    if (typeof param.cancelAndHoldAtTime === "function") {
      param.cancelAndHoldAtTime(now);
    } else {
      param.cancelScheduledValues(now);
      param.setValueAtTime(param.value, now);
    }
    param.linearRampToValueAtTime(safeTarget, now + (duration || 0.035));
  }

  function createAudioGraph(audio) {
    const effectsBus = audio.createGain();
    const superBus = audio.createGain();
    const masterGain = audio.createGain();
    const limiter = audio.createDynamicsCompressor();

    effectsBus.gain.setValueAtTime(1, audio.currentTime);
    superBus.gain.setValueAtTime(Math.max(0, Math.min(1, superVolume)), audio.currentTime);
    masterGain.gain.setValueAtTime(mapVolumeSliderToGain(effectsVolume), audio.currentTime);
    limiter.threshold.setValueAtTime(-4, audio.currentTime);
    limiter.knee.setValueAtTime(6, audio.currentTime);
    limiter.ratio.setValueAtTime(12, audio.currentTime);
    limiter.attack.setValueAtTime(0.003, audio.currentTime);
    limiter.release.setValueAtTime(0.16, audio.currentTime);

    effectsBus.connect(masterGain);
    superBus.connect(masterGain);
    masterGain.connect(limiter);
    limiter.connect(audio.destination);

    return { effectsBus, superBus, masterGain, limiter };
  }

  function getAudioContext() {
    if (!audioContext) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) {
        return null;
      }
      audioContext = new AudioCtor();
      audioGraph = createAudioGraph(audioContext);
    }
    if (audioContext.state === "suspended") {
      const resumePromise = audioContext.resume();
      resumePromise?.catch?.(() => {});
    }
    return audioContext;
  }

  function applyAudioSettings() {
    const audio = getAudioContext();
    if (!audio || !audioGraph) {
      return;
    }
    setAudioParamSmoothly(audioGraph.masterGain.gain, mapVolumeSliderToGain(effectsVolume), audio);
    setAudioParamSmoothly(audioGraph.superBus.gain, Math.max(0, Math.min(1, superVolume)), audio);
  }

  const SoundManager = {
    unavailableFiles: new Set(),
    elements: new Map(),
    mediaNodes: new WeakMap(),
    fadeTimers: new WeakMap(),

    findOption(options, id) {
      return options.find((option) => option.id === id);
    },

    getSources(option) {
      if (Array.isArray(option?.files)) {
        return option.files;
      }
      return option?.file ? [option.file] : [];
    },

    getElement(src) {
      if (!this.elements.has(src)) {
        const element = new Audio(src);
        element.preload = "auto";
        this.elements.set(src, element);
      }
      return this.elements.get(src);
    },

    connectElement(element, gain, busName) {
      const audio = getAudioContext();
      if (!audio || !audioGraph) {
        return null;
      }
      let nodes = this.mediaNodes.get(element);
      if (!nodes) {
        const sourceNode = audio.createMediaElementSource(element);
        const trimGain = audio.createGain();
        sourceNode.connect(trimGain);
        trimGain.connect(audioGraph[busName]);
        nodes = { sourceNode, trimGain };
        this.mediaNodes.set(element, nodes);
      }
      element.volume = 1;
      nodes.trimGain.gain.cancelScheduledValues(audio.currentTime);
      nodes.trimGain.gain.setValueAtTime(Math.max(0, gain), audio.currentTime);
      return nodes;
    },

    setElementGain(element, gain, duration) {
      const audio = getAudioContext();
      const nodes = this.mediaNodes.get(element);
      if (!audio || !nodes) {
        return;
      }
      setAudioParamSmoothly(nodes.trimGain.gain, Math.max(0, gain), audio, duration);
    },

    disconnectElement(element) {
      const nodes = this.mediaNodes.get(element);
      if (!nodes) {
        return;
      }
      nodes.sourceNode.disconnect();
      nodes.trimGain.disconnect();
      this.mediaNodes.delete(element);
    },

    clearElementFade(element) {
      const fadeTimer = this.fadeTimers.get(element);
      if (fadeTimer) {
        window.clearTimeout(fadeTimer);
        this.fadeTimers.delete(element);
      }
    },

    fadeElement(element, duration) {
      this.clearElementFade(element);
      const audio = getAudioContext();
      const nodes = this.mediaNodes.get(element);
      if (audio && nodes) {
        setAudioParamSmoothly(nodes.trimGain.gain, 0, audio, duration);
      }
      const fadeTimer = window.setTimeout(() => {
        element.pause();
        element.currentTime = 0;
        this.disconnectElement(element);
        this.fadeTimers.delete(element);
      }, Math.ceil((duration || 0.22) * 1000) + 30);
      this.fadeTimers.set(element, fadeTimer);
    },

    playFile(option, gain, fallback, busName) {
      const sources = this.getSources(option).filter((source) => !this.unavailableFiles.has(source));
      const source = sources[0];
      if (!source) {
        return false;
      }

      const element = this.getElement(source).cloneNode(true);
      try {
        if (!this.connectElement(element, gain, busName || "effectsBus")) {
          return false;
        }
      } catch (error) {
        this.unavailableFiles.add(source);
        const retry = { ...option, files: sources.slice(1) };
        return this.playFile(retry, gain, fallback, busName);
      }
      const cleanup = () => this.disconnectElement(element);
      element.addEventListener("ended", cleanup, { once: true });
      element.addEventListener("error", cleanup, { once: true });
      const playPromise = element.play();
      if (playPromise?.catch) {
        playPromise.catch((error) => {
          cleanup();
          if (error?.name === "NotAllowedError" || error?.name === "AbortError") {
            fallback?.();
            return;
          }
          this.unavailableFiles.add(source);
          const retry = { ...option, files: sources.slice(1) };
          if (!this.playFile(retry, gain, fallback, busName)) {
            fallback?.();
          }
        });
      }
      return true;
    },

    startLoopFile(option, gain, fallback, busName) {
      const sources = this.getSources(option).filter((source) => !this.unavailableFiles.has(source));
      const source = sources[0];
      if (!source) {
        return null;
      }

      // A fresh element keeps an earlier rejected play() promise from taking over a newer loop.
      const element = this.getElement(source).cloneNode(true);
      this.clearElementFade(element);
      element.pause();
      element.currentTime = 0;
      element.loop = true;
      try {
        if (!this.connectElement(element, gain, busName || "superBus")) {
          return null;
        }
      } catch (error) {
        this.unavailableFiles.add(source);
        const retry = { ...option, files: sources.slice(1) };
        return this.startLoopFile(retry, gain, fallback, busName);
      }
      const playPromise = element.play();
      if (playPromise?.catch) {
        playPromise.catch((error) => {
          if (chargeAudio?.mode !== "file" || chargeAudio.element !== element) {
            return;
          }
          element.pause();
          element.currentTime = 0;
          this.disconnectElement(element);
          if (error?.name === "NotAllowedError" || error?.name === "AbortError") {
            fallback?.();
            return;
          }
          this.unavailableFiles.add(source);
          const retry = { ...option, files: sources.slice(1) };
          const nextElement = this.startLoopFile(retry, gain, fallback, busName);
          if (nextElement && chargeAudio?.mode === "file" && chargeAudio.element === element) {
            chargeAudio.element = nextElement;
            chargeAudio.option = retry;
          } else if (nextElement) {
            nextElement.pause();
            nextElement.currentTime = 0;
          } else if (!nextElement) {
            fallback?.();
          }
        });
      }
      return element;
    }
  };

  function playToneSequence(steps, volume, busName) {
    const audio = getAudioContext();
    if (!audio) {
      return;
    }

    const now = audio.currentTime;
    const master = audio.createGain();
    master.gain.setValueAtTime(Math.max(0.001, volume), now);
    master.gain.exponentialRampToValueAtTime(0.001, now + steps.length * 0.09 + 0.16);
    master.connect(audioGraph[busName || "effectsBus"]);

    steps.forEach((frequency, index) => {
      const start = now + index * 0.08;
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = index % 2 ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(90, frequency * 0.62), start + 0.12);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.95, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(start);
      oscillator.stop(start + 0.18);
    });
  }

  function playPopTone(audio, options) {
    const now = audio.currentTime + (options.delay || 0);
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const filter = audio.createBiquadFilter();

    oscillator.type = options.type || "sine";
    oscillator.frequency.setValueAtTime(options.from, now);
    oscillator.frequency.exponentialRampToValueAtTime(options.to, now + options.duration);
    filter.type = options.filterType || "lowpass";
    filter.frequency.setValueAtTime(options.filterFrequency || 900, now);
    filter.Q.setValueAtTime(options.q || 1.2, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, options.volume), now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + options.duration);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(audioGraph.effectsBus);
    oscillator.start(now);
    oscillator.stop(now + options.duration + 0.03);
  }

  function playNoiseBurst(audio, options) {
    const now = audio.currentTime + (options.delay || 0);
    const duration = options.duration || 0.08;
    const sampleCount = Math.max(1, Math.floor(audio.sampleRate * duration));
    const buffer = audio.createBuffer(1, sampleCount, audio.sampleRate);
    const data = buffer.getChannelData(0);

    for (let index = 0; index < sampleCount; index += 1) {
      const fade = 1 - index / sampleCount;
      data[index] = (Math.random() * 2 - 1) * fade * fade;
    }

    const source = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    const gain = audio.createGain();
    source.buffer = buffer;
    filter.type = options.filterType || "lowpass";
    filter.frequency.setValueAtTime(options.filterFrequency || 700, now);
    filter.Q.setValueAtTime(options.q || 0.9, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, options.volume || 0.08), now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioGraph.effectsBus);
    source.start(now);
    source.stop(now + duration);
  }

  function canPlayPopSound(force) {
    if (force) {
      return true;
    }

    const now = performance.now();
    if (now - popSoundWindowStart > 90) {
      popSoundWindowStart = now;
      popSoundCountInWindow = 0;
    }
    popSoundCountInWindow += 1;
    return popSoundCountInWindow <= 4 || Math.random() < 0.18;
  }

  function playPopSound(soundId, force) {
    const audio = getAudioContext();
    if (!audio) {
      return;
    }

    if (!canPlayPopSound(force)) {
      return;
    }

    const option = SoundManager.findOption(POP_SOUND_OPTIONS, soundId || selectedPopSoundId) || POP_SOUND_OPTIONS[0];
    if (SoundManager.getSources(option).length > 0 && SoundManager.playFile(option, 0.7, () => playPopSound(option.fallback, true), "effectsBus")) {
      return;
    }

    const id = SoundManager.getSources(option).length > 0 ? option.fallback : option.id;
    const pitch = randomBetween(0.93, 1.06);
    const crowd = Math.max(0.46, 1 - Math.max(0, popSoundCountInWindow - 1) * 0.08);

    if (id === "new-deep-bubble") {
      playPopTone(audio, { type: "sine", from: 165 * pitch, to: 58 * pitch, duration: 0.18, volume: 0.075 * crowd, filterFrequency: 430 });
      playNoiseBurst(audio, { delay: 0.018, duration: 0.08, volume: 0.032 * crowd, filterType: "lowpass", filterFrequency: 420, q: 0.7 });
    } else if (id === "new-water-bulk") {
      playPopTone(audio, { type: "sine", from: 205 * pitch, to: 72 * pitch, duration: 0.16, volume: 0.07 * crowd, filterFrequency: 480 });
      playNoiseBurst(audio, { delay: 0.028, duration: 0.1, volume: 0.036 * crowd, filterType: "bandpass", filterFrequency: 390, q: 1.2 });
      playPopTone(audio, { delay: 0.055, type: "triangle", from: 124 * pitch, to: 86 * pitch, duration: 0.1, volume: 0.026 * crowd, filterFrequency: 390 });
    } else if (id === "new-quiet-toy") {
      playPopTone(audio, { type: "triangle", from: 245 * pitch, to: 82 * pitch, duration: 0.14, volume: 0.07 * crowd, filterFrequency: 600 });
      playNoiseBurst(audio, { delay: 0.012, duration: 0.055, volume: 0.028 * crowd, filterType: "lowpass", filterFrequency: 620, q: 0.6 });
    } else if (id === "new-soft-plop") {
      playPopTone(audio, { type: "sine", from: 190 * pitch, to: 68 * pitch, duration: 0.15, volume: 0.068 * crowd, filterFrequency: 520 });
      playNoiseBurst(audio, { delay: 0.018, duration: 0.06, volume: 0.024 * crowd, filterType: "lowpass", filterFrequency: 520, q: 0.7 });
    } else if (id === "water-pop") {
      playPopTone(audio, { type: "sine", from: 260 * pitch, to: 82 * pitch, duration: 0.18, volume: 0.11 * crowd, filterFrequency: 620 });
      playNoiseBurst(audio, { delay: 0.025, duration: 0.12, volume: 0.06 * crowd, filterType: "bandpass", filterFrequency: 470, q: 1.6 });
      playPopTone(audio, { delay: 0.065, type: "triangle", from: 170 * pitch, to: 95 * pitch, duration: 0.11, volume: 0.045 * crowd, filterFrequency: 540 });
    } else if (id === "glass-pop") {
      playPopTone(audio, { type: "sine", from: 380 * pitch, to: 130 * pitch, duration: 0.15, volume: 0.085 * crowd, filterFrequency: 900 });
      playPopTone(audio, { delay: 0.025, type: "sine", from: 740 * pitch, to: 520 * pitch, duration: 0.11, volume: 0.028 * crowd, filterFrequency: 1200 });
      playNoiseBurst(audio, { delay: 0.01, duration: 0.07, volume: 0.04 * crowd, filterType: "highpass", filterFrequency: 520, q: 0.7 });
    } else if (id === "toy-pop") {
      playPopTone(audio, { type: "triangle", from: 330 * pitch, to: 92 * pitch, duration: 0.16, volume: 0.105 * crowd, filterFrequency: 720 });
      playPopTone(audio, { delay: 0.04, type: "sine", from: 520 * pitch, to: 260 * pitch, duration: 0.1, volume: 0.04 * crowd, filterFrequency: 980 });
      playNoiseBurst(audio, { duration: 0.08, volume: 0.048 * crowd, filterType: "lowpass", filterFrequency: 840, q: 0.8 });
    } else {
      playPopTone(audio, { type: "sine", from: 240 * pitch, to: 78 * pitch, duration: 0.16, volume: 0.105 * crowd, filterFrequency: 660 });
      playNoiseBurst(audio, { delay: 0.018, duration: 0.075, volume: 0.04 * crowd, filterType: "lowpass", filterFrequency: 620, q: 0.8 });
    }
  }

  function playPopPreview(soundId) {
    playPopSound(soundId, true);
  }

  function getChargeConfig(soundId) {
    if (soundId === "new-soft-charge") {
      return {
        filterBase: 260,
        filterRise: 420,
        volumeBase: 0.012,
        volumeRise: 0.04,
        oscillators: [
          { type: "sine", base: 92, rise: 120, gain: 1, wobble: 2 },
          { type: "sine", base: 46, rise: 58, gain: 0.35, wobble: 1.5 }
        ]
      };
    }

    if (soundId === "new-deep-charge") {
      return {
        filterBase: 220,
        filterRise: 540,
        volumeBase: 0.016,
        volumeRise: 0.062,
        oscillators: [
          { type: "sine", base: 68, rise: 150, gain: 1, wobble: 1.2 },
          { type: "triangle", base: 34, rise: 72, gain: 0.38, wobble: 1 }
        ]
      };
    }

    if (soundId === "new-warm-wave") {
      return {
        filterBase: 300,
        filterRise: 650,
        volumeBase: 0.015,
        volumeRise: 0.055,
        oscillators: [
          { type: "sine", base: 105, rise: 145, gain: 1, wobble: 2.5 },
          { type: "triangle", base: 78, rise: 80, gain: 0.25, wobble: 1.8 }
        ]
      };
    }

    if (soundId === "new-quiet-magic") {
      return {
        filterBase: 340,
        filterRise: 520,
        volumeBase: 0.012,
        volumeRise: 0.045,
        oscillators: [
          { type: "sine", base: 118, rise: 92, gain: 1, wobble: 2 },
          { type: "sine", base: 236, rise: 110, gain: 0.12, wobble: 1 }
        ]
      };
    }

    if (soundId === "magic-hum") {
      return {
        filterBase: 380,
        filterRise: 620,
        volumeBase: 0.018,
        volumeRise: 0.06,
        oscillators: [
          { type: "sine", base: 118, rise: 170, gain: 1, wobble: 5 },
          { type: "triangle", base: 59, rise: 78, gain: 0.34, wobble: 3 }
        ]
      };
    }

    if (soundId === "toy-whirr") {
      return {
        filterBase: 300,
        filterRise: 520,
        volumeBase: 0.016,
        volumeRise: 0.052,
        oscillators: [
          { type: "triangle", base: 150, rise: 230, gain: 1, wobble: 8 },
          { type: "sine", base: 75, rise: 105, gain: 0.4, wobble: 4 }
        ]
      };
    }

    if (soundId === "star-shimmer") {
      return {
        filterBase: 450,
        filterRise: 760,
        volumeBase: 0.014,
        volumeRise: 0.052,
        oscillators: [
          { type: "sine", base: 140, rise: 200, gain: 1, wobble: 4 },
          { type: "sine", base: 280, rise: 410, gain: 0.2, wobble: 2 }
        ]
      };
    }

    return {
      filterBase: 340,
      filterRise: 820,
      volumeBase: 0.022,
      volumeRise: 0.074,
      oscillators: [
        { type: "sine", base: 105, rise: 235, gain: 1, wobble: 3 },
        { type: "triangle", base: 52, rise: 92, gain: 0.42, wobble: 2 }
      ]
    };
  }

  function startChargeSound(soundId) {
    const audio = getAudioContext();
    if (!audio || chargeAudio) {
      return;
    }

    const now = audio.currentTime;
    const selectedOption = SoundManager.findOption(CHARGE_SOUND_OPTIONS, soundId || selectedChargeSoundId) || CHARGE_SOUND_OPTIONS[0];
    if (SoundManager.getSources(selectedOption).length > 0) {
      const loopElement = SoundManager.startLoopFile(selectedOption, 0.32, () => {
        if (chargeAudio?.mode === "file") {
          chargeAudio = null;
          startChargeSound(selectedOption.fallback);
        }
      }, "superBus");
      if (loopElement) {
        chargeAudio = { mode: "file", element: loopElement, option: selectedOption };
        return;
      }
    }

    const fallbackSoundId = SoundManager.getSources(selectedOption).length > 0
      ? selectedOption.fallback
      : selectedOption.id;
    const config = getChargeConfig(fallbackSoundId || selectedOption.id);
    const master = audio.createGain();
    const filter = audio.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(config.filterBase, now);
    master.gain.setValueAtTime(0.001, now);
    master.gain.linearRampToValueAtTime(config.volumeBase, now + 0.2);
    filter.connect(master);
    master.connect(audioGraph.superBus);

    const oscillators = config.oscillators.map((oscConfig, index) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = oscConfig.type;
      oscillator.frequency.setValueAtTime(oscConfig.base, now);
      gain.gain.setValueAtTime(oscConfig.gain, now);
      oscillator.connect(gain);
      gain.connect(filter);
      oscillator.start(now);
      return {
        oscillator,
        gain,
        base: oscConfig.base,
        rise: oscConfig.rise,
        wobble: oscConfig.wobble,
        phase: index * 1.7
      };
    });

    chargeAudio = { oscillators, master, filter, config };
  }

  function updateChargeSound() {
    if (!chargeAudio || !audioContext) {
      return;
    }

    if (chargeAudio.mode === "file") {
      const ratio = Math.min(1, Math.max(0, input.charge / MAX_CHARGE));
      SoundManager.setElementGain(chargeAudio.element, 0.32 + ratio * 0.5, 0.05);
      return;
    }

    const now = audioContext.currentTime;
    const ratio = Math.min(1, Math.max(0, input.charge / MAX_CHARGE));
    const config = chargeAudio.config;
    const filterFrequency = config.filterBase + ratio * config.filterRise;
    const volume = config.volumeBase + ratio * config.volumeRise;

    chargeAudio.oscillators.forEach((item) => {
      const wobble = Math.sin(gameClock * item.wobble + item.phase) * (2 + ratio * 4);
      item.oscillator.frequency.setTargetAtTime(item.base + ratio * item.rise + wobble, now, 0.08);
    });
    chargeAudio.filter.frequency.setTargetAtTime(filterFrequency, now, 0.08);
    chargeAudio.master.gain.setTargetAtTime(volume, now, 0.08);
  }

  function stopChargeSound() {
    if (!chargeAudio) {
      chargeAudio = null;
      return;
    }

    if (chargeAudio.mode === "file") {
      const element = chargeAudio.element;
      SoundManager.fadeElement(element, 0.22);
      chargeAudio = null;
      return;
    }

    if (!audioContext) {
      chargeAudio = null;
      return;
    }

    const audio = audioContext;
    const { oscillators, master } = chargeAudio;
    const now = audio.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(0.001, now, 0.08);
    oscillators.forEach(({ oscillator }) => {
      try {
        oscillator.stop(now + 0.24);
      } catch (error) {
        // The oscillator can already be stopped if the browser ends audio during fullscreen changes.
      }
    });
    chargeAudio = null;
  }

  function playChargePreview(soundId) {
    window.clearInterval(chargePreviewTimer);
    stopChargeSound();

    const previousCharge = input.charge;
    const previousLeft = input.left;
    input.left = true;
    input.charge = 0;
    startChargeSound(soundId);

    const startedAt = performance.now();
    chargePreviewTimer = window.setInterval(() => {
      const elapsed = (performance.now() - startedAt) / 1000;
      input.charge = Math.min(MAX_CHARGE, (elapsed / 2.1) * MAX_CHARGE);
      updateChargeSound();
      if (elapsed >= 2.2) {
        window.clearInterval(chargePreviewTimer);
        stopChargeSound();
        input.charge = previousCharge;
        input.left = previousLeft;
      }
    }, 50);
  }

  function playWaveSound() {
    playToneSequence([220, 360, 580, 820], 0.22, "superBus");
  }

  function playBurstSound() {
    playToneSequence([920, 680, 440, 260], 0.28, "superBus");
  }

  function playFreezeSound() {
    playToneSequence([640, 520, 420, 360], 0.2, "superBus");
  }

  function playStarRainSound() {
    playToneSequence([520, 760, 1020, 1320], 0.24, "superBus");
  }

  function createPop(bubble, color) {
    pops.push({
      x: bubble.x,
      y: bubble.y,
      r: bubble.r,
      hue: bubble.hue,
      color: color || `hsla(${bubble.hue}, 100%, 78%, 1)`,
      age: 0,
      pieces: Array.from({ length: currentLocation().style === "star" ? 16 : 10 }, () => ({
        angle: randomBetween(0, Math.PI * 2),
        speed: randomBetween(70, 230),
        size: randomBetween(3, 10)
      }))
    });
  }

  function finishRound(message) {
    if (roundFinished) {
      return;
    }
    roundFinished = true;
    roundPause = 1;
    finalScore = score;
    roundResultText = message;
    input.left = false;
    input.right = false;
    input.charge = 0;
    chargeMaxHoldTime = 0;
    stopChargeSound();
    recordLevelComplete(selectedLocationId, finalScore);
    updateMobileControlsVisibility();
    showResultOverlay();
  }

  function showResultOverlay() {
    const state = getLevelProgress(selectedLocationId);
    resultTitle.textContent = roundResultText;
    resultText.textContent = `Очки: ${finalScore}. Лучший счет этого уровня: ${state.bestScore || finalScore}.`;
    resultOverlay.classList.remove("hidden");
  }

  function hideResultOverlay() {
    resultOverlay.classList.add("hidden");
  }

  function updateMobileControlsVisibility() {
    const showControls = running && !roundFinished && isTouchDevice && mobileSuperButtonsToggle.checked && currentLocation().superPowers;
    mobileControls.classList.toggle("hidden", !showControls);
  }

  function selectNextLevel() {
    const level = currentLocation();
    const nextId = level.recommendedNext || LOCATIONS[(LOCATIONS.findIndex((item) => item.id === level.id) + 1) % LOCATIONS.length].id;
    selectedLocationId = nextId;
    selectedToolId = currentLocation().defaultToolId;
    saveSettings();
  }

  function addScore(points) {
    if (roundFinished) {
      return;
    }
    if (roundDeadlineMs !== null && performance.now() >= roundDeadlineMs) {
      roundTime = 0;
      finishRound("Время раунда закончилось");
      return;
    }
    score += points;
    const targetScore = activeRoundSettings?.scoreLimit ?? null;
    if (targetScore !== null && score >= targetScore) {
      finishRound("Цель по очкам достигнута");
    }
  }

  function applyBubbleKindBonus(bubble) {
    if (bubble.kind === "gold") {
      addScore(220);
      pushEffect({
        type: "flash",
        x: bubble.x,
        y: bubble.y,
        radius: bubble.r * 2.7,
        age: 0,
        life: 0.34,
        hue: 48
      });
    } else if (bubble.kind === "slow") {
      colorSlowTimer = Math.max(colorSlowTimer, 2.4);
      pushEffect({
        type: "freeze",
        x: bubble.x,
        y: bubble.y,
        radius: Math.max(width, height),
        age: 0,
        life: 0.42,
        hue: 190
      });
    } else if (bubble.kind === "star") {
      addScore(120);
      for (let index = 0; index < 6; index += 1) {
        const angle = (index / 6) * Math.PI * 2;
        starShots.push({
          x: bubble.x,
          y: bubble.y,
          vx: Math.cos(angle) * randomBetween(230, 360),
          vy: Math.sin(angle) * randomBetween(230, 360),
          age: 0,
          life: 0.78,
          radius: randomBetween(9, 13),
          hue: randomBetween(42, 326)
        });
      }
    }
  }

  function popBubble(index, multiplier) {
    const bubble = bubbles[index];
    if (!bubble || roundFinished) {
      return;
    }
    createPop(bubble);
    playPopSound();
    addScore(Math.round(bubble.points * (multiplier || 1)));
    if (!roundFinished) {
      applyBubbleKindBonus(bubble);
    }
    bubbles.splice(index, 1);
    window.setTimeout(() => {
      if (running && !roundFinished) {
        bubbles.push(makeBubble(bubbles));
      }
    }, 420);
  }

  function pushEffect(effect) {
    effects.push(effect);
  }

  function popBubblesInRadius(x, y, radius, multiplier) {
    let popped = 0;
    for (let index = bubbles.length - 1; index >= 0; index -= 1) {
      if (roundFinished) {
        break;
      }
      const bubble = bubbles[index];
      const distance = Math.hypot(x - bubble.x, y - bubble.y);
      if (distance <= radius + bubble.r) {
        popBubble(index, multiplier);
        popped += 1;
      }
    }
    return popped;
  }

  function repelBubbles(x, y, radius, strength) {
    for (const bubble of bubbles) {
      const dx = bubble.x - x;
      const dy = bubble.y - y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance > radius) {
        continue;
      }
      const power = (1 - distance / radius) * strength;
      bubble.vx += (dx / distance) * power;
      bubble.vy += (dy / distance) * power;
      bubble.speed = Math.min(bubble.speed + power * 0.2, 230);
      normalizeBubbleVelocity(bubble);
    }
  }

  function triggerRightWave() {
    if (!isSuperLocation()) {
      return;
    }
    const radius = 210 + Math.min(MAX_CHARGE, input.charge) * 42;
    pushEffect({
      type: "ring",
      x: pointer.x,
      y: pointer.y,
      radius,
      age: 0,
      life: 0.58,
      width: 18,
      hue: (gameClock * 130) % 360
    });
    popBubblesInRadius(pointer.x, pointer.y, radius * 0.55, 1.4);
    repelBubbles(pointer.x, pointer.y, radius, 520);
    playWaveSound();
  }

  function triggerWheelSwirl(deltaY) {
    if (!isSuperLocation()) {
      return;
    }

    const direction = deltaY > 0 ? 1 : -1;
    const radius = 390;
    for (const bubble of bubbles) {
      const dx = bubble.x - pointer.x;
      const dy = bubble.y - pointer.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance > radius) {
        continue;
      }
      const power = (1 - distance / radius) * 360;
      bubble.vx += (-dy / distance) * power * direction;
      bubble.vy += (dx / distance) * power * direction;
      bubble.speed = Math.min(bubble.speed + 22, 240);
      normalizeBubbleVelocity(bubble);
    }

    pushEffect({
      type: "swirl",
      x: pointer.x,
      y: pointer.y,
      radius,
      direction,
      age: 0,
      life: 0.7,
      hue: (gameClock * 170) % 360
    });
    playWaveSound();
  }

  function triggerMiddleBurst() {
    if (!isSuperLocation()) {
      return;
    }
    const radius = 280;
    pushEffect({
      type: "flash",
      x: pointer.x,
      y: pointer.y,
      radius,
      age: 0,
      life: 0.45,
      hue: 54
    });
    popBubblesInRadius(pointer.x, pointer.y, radius, 2);
    playBurstSound();
  }

  function triggerFreeze() {
    if (!isSuperLocation()) {
      return;
    }
    freezeTimer = 3;
    pushEffect({
      type: "freeze",
      x: pointer.x,
      y: pointer.y,
      radius: Math.max(width, height),
      age: 0,
      life: 0.8,
      hue: 196
    });
    playFreezeSound();
  }

  function triggerStarRain() {
    if (!isSuperLocation()) {
      return;
    }
    for (let index = 0; index < 14; index += 1) {
      const angle = (index / 14) * Math.PI * 2 + randomBetween(-0.12, 0.12);
      const speed = randomBetween(290, 470);
      starShots.push({
        x: pointer.x,
        y: pointer.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        age: 0,
        life: 1.25,
        radius: randomBetween(12, 18),
        hue: randomBetween(38, 330)
      });
    }
    pushEffect({
      type: "flash",
      x: pointer.x,
      y: pointer.y,
      radius: 130,
      age: 0,
      life: 0.38,
      hue: 304
    });
    playStarRainSound();
  }

  function triggerInstantButtonAction(button) {
    const now = performance.now();
    if (recentInstantButtons[button] && now - recentInstantButtons[button] < 140) {
      return;
    }
    recentInstantButtons[button] = now;

    if (button === 1) {
      triggerMiddleBurst();
    } else if (button === 3) {
      triggerFreeze();
    } else if (button === 4) {
      triggerStarRain();
    }
  }

  function updateSuper(delta) {
    if (!isSuperLocation()) {
      input.charge = 0;
      chargeMaxHoldTime = 0;
      stopChargeSound();
      return;
    }

    if (input.left) {
      startChargeSound();

      if (input.charge < MAX_CHARGE) {
        input.charge = Math.min(MAX_CHARGE, input.charge + (delta * MAX_CHARGE) / CHARGE_GROW_SECONDS);
        chargeMaxHoldTime = 0;
      } else {
        chargeMaxHoldTime += delta;
        input.charge = MAX_CHARGE;
        if (chargeMaxHoldTime >= MAX_CHARGE_HOLD_SECONDS) {
          input.charge = 0;
          chargeMaxHoldTime = 0;
        }
      }

      updateChargeSound();

      if (Math.random() < 0.9) {
        pushEffect({
          type: "spark",
          x: pointer.x + randomBetween(-effectiveToolRadius() * 0.55, effectiveToolRadius() * 0.55),
          y: pointer.y + randomBetween(-effectiveToolRadius() * 0.55, effectiveToolRadius() * 0.55),
          radius: randomBetween(5, 12),
          age: 0,
          life: randomBetween(0.28, 0.55),
          hue: randomBetween(35, 320)
        });
      }
    } else {
      input.charge = 0;
      chargeMaxHoldTime = 0;
      stopChargeSound();
    }

    if (input.right) {
      rightWaveTimer -= delta;
      if (rightWaveTimer <= 0) {
        triggerRightWave();
        rightWaveTimer = 0.64;
      }
    } else {
      rightWaveTimer = 0;
    }
  }

  function moveBubbles(delta) {
    const inset = currentLocation().style !== "soft" ? 30 : 18;
    const slowFactor = freezeTimer > 0 ? 0.24 : colorSlowTimer > 0 ? 0.62 : 1;

    for (const bubble of bubbles) {
      bubble.x += bubble.vx * delta * slowFactor;
      bubble.y += bubble.vy * delta * slowFactor;
      bubble.wobble += delta * 1.4;

      if (bubble.x - bubble.r < inset) {
        bubble.x = inset + bubble.r;
        bubble.vx = Math.abs(bubble.vx);
      } else if (bubble.x + bubble.r > width - inset) {
        bubble.x = width - inset - bubble.r;
        bubble.vx = -Math.abs(bubble.vx);
      }

      if (bubble.y - bubble.r < inset) {
        bubble.y = inset + bubble.r;
        bubble.vy = Math.abs(bubble.vy);
      } else if (bubble.y + bubble.r > height - inset) {
        bubble.y = height - inset - bubble.r;
        bubble.vy = -Math.abs(bubble.vy);
      }

      normalizeBubbleVelocity(bubble);
    }
  }

  function resolveBubbleCollisions() {
    for (let i = 0; i < bubbles.length; i += 1) {
      for (let j = i + 1; j < bubbles.length; j += 1) {
        const first = bubbles[i];
        const second = bubbles[j];
        const dx = second.x - first.x;
        const dy = second.y - first.y;
        const distance = Math.hypot(dx, dy) || 1;
        const minDistance = first.r + second.r;

        if (distance >= minDistance) {
          continue;
        }

        const nx = dx / distance;
        const ny = dy / distance;
        const overlap = minDistance - distance;
        first.x -= nx * overlap * 0.5;
        first.y -= ny * overlap * 0.5;
        second.x += nx * overlap * 0.5;
        second.y += ny * overlap * 0.5;

        const tx = -ny;
        const ty = nx;
        const firstNormal = first.vx * nx + first.vy * ny;
        const firstTangent = first.vx * tx + first.vy * ty;
        const secondNormal = second.vx * nx + second.vy * ny;
        const secondTangent = second.vx * tx + second.vy * ty;

        first.vx = tx * firstTangent + nx * secondNormal;
        first.vy = ty * firstTangent + ny * secondNormal;
        second.vx = tx * secondTangent + nx * firstNormal;
        second.vy = ty * secondTangent + ny * firstNormal;
        normalizeBubbleVelocity(first);
        normalizeBubbleVelocity(second);
      }
    }
  }

  function handleWandCollisions() {
    if (!pointer.active || roundFinished) {
      return;
    }

    const hitRadius = currentWandMetrics().collisionRadius;
    const multiplier = isSuperLocation() && input.left ? 1.25 + Math.min(MAX_CHARGE, input.charge) * 0.24 : 1;
    for (let index = bubbles.length - 1; index >= 0; index -= 1) {
      if (roundFinished) {
        break;
      }
      const bubble = bubbles[index];
      const distance = Math.hypot(pointer.x - bubble.x, pointer.y - bubble.y);
      if (distance < bubble.r + hitRadius) {
        popBubble(index, multiplier);
      }
    }
  }

  function updatePops(delta) {
    pops = pops.filter((pop) => {
      pop.age += delta;
      return pop.age < 0.54;
    });
  }

  function updateEffects(delta) {
    effects = effects.filter((effect) => {
      effect.age += delta;
      return effect.age < effect.life;
    });
  }

  function updateKeyBursts(delta) {
    keyBursts = keyBursts.filter((burst) => {
      burst.age += delta;
      return burst.age < burst.life;
    });
  }

  function updateStarShots(delta) {
    starShots = starShots.filter((shot) => {
      shot.age += delta;
      shot.x += shot.vx * delta;
      shot.y += shot.vy * delta;

      for (let index = bubbles.length - 1; index >= 0; index -= 1) {
        const bubble = bubbles[index];
        if (Math.hypot(shot.x - bubble.x, shot.y - bubble.y) < bubble.r + shot.radius) {
          popBubble(index, 1.7);
          shot.age = shot.life;
          break;
        }
      }

      return shot.age < shot.life && shot.x > -80 && shot.x < width + 80 && shot.y > -80 && shot.y < height + 80;
    });
  }

  function updateRound(timestamp, delta) {
    if (roundFinished) {
      return false;
    }

    elapsedTime = Math.max(0, (timestamp - roundStartedAtMs) / 1000);
    if (roundDeadlineMs !== null) {
      roundTime = Math.max(0, (roundDeadlineMs - timestamp) / 1000);
      if (timestamp >= roundDeadlineMs) {
        roundTime = 0;
        finishRound("Время раунда закончилось");
        return false;
      }
    }

    if (freezeTimer > 0) {
      freezeTimer = Math.max(0, freezeTimer - delta);
    }
    if (colorSlowTimer > 0) {
      colorSlowTimer = Math.max(0, colorSlowTimer - delta);
    }

    return true;
  }

  function drawSoftBackground(location) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, location.backgroundTop);
    gradient.addColorStop(1, location.backgroundBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 18;
    ctx.strokeStyle = location.rail;
    ctx.strokeRect(9, 9, width - 18, height - 18);
    ctx.lineWidth = 4;
    ctx.strokeStyle = location.railDark;
    ctx.strokeRect(22, 22, width - 44, height - 44);

    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    const gap = 86;
    for (let x = 42; x < width; x += gap) {
      ctx.beginPath();
      ctx.moveTo(x, 28);
      ctx.lineTo(x - 34, height - 28);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawStarBackground(location) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, location.backgroundTop);
    gradient.addColorStop(0.58, "#0b9f9c");
    gradient.addColorStop(1, location.backgroundBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#ffffff";
    for (let y = 44; y < height; y += 42) {
      for (let x = 44; x < width; x += 42) {
        ctx.beginPath();
        ctx.arc(x + Math.sin(y * 0.03) * 8, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    ctx.save();
    ctx.shadowColor = "rgba(44, 16, 72, 0.55)";
    ctx.shadowBlur = 20;
    ctx.lineWidth = 36;
    ctx.strokeStyle = location.railDark;
    roundedRectPath(ctx, 18, 18, width - 36, height - 36, 34);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.lineWidth = 24;
    ctx.strokeStyle = location.rail;
    roundedRectPath(ctx, 18, 18, width - 36, height - 36, 34);
    ctx.stroke();

    ctx.lineWidth = 8;
    ctx.strokeStyle = location.railLight;
    roundedRectPath(ctx, 30, 30, width - 60, height - 60, 24);
    ctx.stroke();
    ctx.restore();
  }

  function drawBlowers() {
    const points = getBlowerPoints(width, height);
    ctx.save();
    for (const point of points) {
      ctx.translate(point.x, point.y);
      ctx.rotate(point.x < width / 2 ? -0.7 : 0.7);

      ctx.shadowColor = "rgba(43, 21, 74, 0.3)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;
      ctx.strokeStyle = "#8d39c8";
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.lineTo(0, 68);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#c47aff";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.lineTo(0, 68);
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
      ctx.strokeStyle = "#f1b6ff";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = "#7ddfff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 19, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    ctx.restore();
  }

  function drawBackground() {
    const location = currentLocation();
    if (location.style === "soft") {
      drawSoftBackground(location);
    } else {
      drawStarBackground(location);
      if (location.spawnStyle === "blowers") {
        drawBlowers();
      }
    }
  }

  function drawBubble(bubble) {
    const location = currentLocation();
    const richStyle = location.style !== "soft";
    const pulse = Math.sin(bubble.wobble) * 0.045 + 1;
    const radius = bubble.r * pulse;
    const x = bubble.x;
    const y = bubble.y;
    const gradient = ctx.createRadialGradient(
      x - radius * 0.34,
      y - radius * 0.36,
      radius * 0.08,
      x,
      y,
      radius
    );

    if (richStyle && bubble.glossy) {
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.98)");
      gradient.addColorStop(0.15, `hsla(${bubble.hue + 10}, 100%, 82%, 0.95)`);
      gradient.addColorStop(0.62, `hsla(${bubble.hue}, 92%, 54%, 0.88)`);
      gradient.addColorStop(1, `hsla(${bubble.hue - 8}, 92%, 38%, 0.96)`);
    } else {
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.96)");
      gradient.addColorStop(0.18, `hsla(${bubble.hue}, 92%, 78%, 0.38)`);
      gradient.addColorStop(0.72, `hsla(${bubble.hue + 18}, 92%, 64%, 0.2)`);
      gradient.addColorStop(1, `hsla(${bubble.hue}, 80%, 48%, 0.54)`);
    }

    ctx.save();
    ctx.shadowColor = richStyle ? "rgba(0, 45, 55, 0.34)" : "rgba(10, 100, 120, 0.18)";
    ctx.shadowBlur = richStyle ? 12 : 8;
    ctx.shadowOffsetY = richStyle ? 10 : 5;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.lineWidth = richStyle ? 5 : 4;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.82)";
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = `hsla(${bubble.hue + 26}, 88%, 70%, 0.42)`;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.78, -0.24, Math.PI * 1.12);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
    ctx.beginPath();
    ctx.ellipse(
      x - radius * 0.34,
      y - radius * 0.38,
      radius * 0.2,
      radius * 0.12,
      -0.6,
      0,
      Math.PI * 2
    );
    ctx.fill();

    if (richStyle) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = `hsla(${bubble.hue + 70}, 100%, 88%, 0.65)`;
      ctx.beginPath();
      ctx.ellipse(x + radius * 0.22, y + radius * 0.16, radius * 0.1, radius * 0.16, 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    if (bubble.kind === "gold") {
      starPath(ctx, x + radius * 0.16, y - radius * 0.18, radius * 0.18, radius * 0.08, 5, -Math.PI / 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();
    } else if (bubble.kind === "slow") {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.62)";
      ctx.lineWidth = Math.max(2, radius * 0.035);
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.46, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.28, 0, Math.PI * 2);
      ctx.stroke();
    } else if (bubble.kind === "star") {
      starPath(ctx, x, y, radius * 0.22, radius * 0.1, 5, -Math.PI / 2 + bubble.wobble * 0.4);
      ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
      ctx.fill();
    }
    ctx.restore();
  }

  function drawPops() {
    ctx.save();
    for (const pop of pops) {
      const progress = pop.age / 0.54;
      const alpha = 1 - progress;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 5 * alpha;
      ctx.strokeStyle = pop.color;
      ctx.beginPath();
      ctx.arc(pop.x, pop.y, pop.r + progress * 54, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
      for (const piece of pop.pieces) {
        const distance = piece.speed * pop.age;
        const x = pop.x + Math.cos(piece.angle) * distance;
        const y = pop.y + Math.sin(piece.angle) * distance;
        if (currentLocation().style !== "soft") {
          starPath(ctx, x, y, piece.size * alpha, piece.size * 0.45 * alpha, 5, -Math.PI / 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, piece.size * alpha, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  function drawEffects() {
    ctx.save();
    for (const effect of effects) {
      const progress = effect.age / effect.life;
      const alpha = Math.max(0, 1 - progress);

      if (effect.type === "ring") {
        ctx.globalAlpha = alpha;
        ctx.lineWidth = effect.width * alpha;
        ctx.strokeStyle = `hsla(${effect.hue + progress * 120}, 100%, 70%, 0.9)`;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius * (0.25 + progress * 0.9), 0, Math.PI * 2);
        ctx.stroke();
      } else if (effect.type === "swirl") {
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 7 * alpha;
        ctx.strokeStyle = `hsla(${effect.hue}, 100%, 78%, 0.92)`;
        for (let arm = 0; arm < 3; arm += 1) {
          ctx.beginPath();
          for (let step = 0; step < 34; step += 1) {
            const t = step / 33;
            const angle = effect.direction * (t * Math.PI * 2.6 + progress * Math.PI * 4) + arm * 2.1;
            const radius = effect.radius * t * alpha;
            const x = effect.x + Math.cos(angle) * radius;
            const y = effect.y + Math.sin(angle) * radius;
            if (step === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }
      } else if (effect.type === "flash") {
        const radius = effect.radius * (0.3 + progress);
        const gradient = ctx.createRadialGradient(effect.x, effect.y, 0, effect.x, effect.y, radius);
        gradient.addColorStop(0, `hsla(${effect.hue}, 100%, 74%, ${0.55 * alpha})`);
        gradient.addColorStop(0.55, `hsla(${effect.hue + 40}, 100%, 74%, ${0.24 * alpha})`);
        gradient.addColorStop(1, `hsla(${effect.hue + 90}, 100%, 74%, 0)`);
        ctx.globalAlpha = 1;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (effect.type === "freeze") {
        ctx.globalAlpha = 0.18 * alpha;
        ctx.fillStyle = "#a8efff";
        ctx.fillRect(0, 0, width, height);
      } else if (effect.type === "spark") {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `hsla(${effect.hue}, 100%, 76%, 0.95)`;
        starPath(ctx, effect.x, effect.y, effect.radius, effect.radius * 0.42, 5, -Math.PI / 2 + progress * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawStarShots() {
    ctx.save();
    for (const shot of starShots) {
      const alpha = 1 - shot.age / shot.life;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `hsla(${shot.hue}, 100%, 67%, 0.95)`;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 2;
      starPath(ctx, shot.x, shot.y, shot.radius, shot.radius * 0.44, 5, -Math.PI / 2 + shot.age * 5);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawRingWand(x, y, radius) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = "rgba(120, 86, 48, 0.95)";
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(x + radius * 0.46, y + radius * 0.46);
    ctx.lineTo(x + radius * 1.28, y + radius * 1.28);
    ctx.stroke();

    ctx.strokeStyle = "rgba(247, 211, 143, 0.96)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x + radius * 0.46, y + radius * 0.46);
    ctx.lineTo(x + radius * 1.28, y + radius * 1.28);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.72, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(68, 178, 186, 0.72)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.56, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.beginPath();
    ctx.arc(x - radius * 0.28, y - radius * 0.3, radius * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawStarWand(x, y, radius, compactVisual) {
    const rainbowHue = (gameClock * 150) % 360;
    const chargeAlpha = input.charge > 0 ? 0.35 + Math.sin(gameClock * 16) * 0.15 : 0;
    const handleStartX = x + radius * 0.38;
    const handleStartY = y + radius * 0.38;
    const starOffset = compactVisual ? 0.6 : 1.08;
    const starOuterRadius = compactVisual ? 0.24 : 0.42;
    const starInnerRadius = compactVisual ? 0.14 : 0.25;
    const starX = x + radius * starOffset;
    const starY = y + radius * starOffset;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (chargeAlpha > 0) {
      const glow = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 1.15);
      glow.addColorStop(0, `hsla(${rainbowHue}, 100%, 70%, ${chargeAlpha})`);
      glow.addColorStop(1, `hsla(${rainbowHue + 90}, 100%, 70%, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowColor = "rgba(38, 15, 58, 0.42)";
    ctx.shadowBlur = compactVisual ? 4 : 14;
    ctx.shadowOffsetY = compactVisual ? 2 : 9;
    ctx.strokeStyle = "#7c2fc1";
    ctx.lineWidth = Math.max(compactVisual ? 8 : 12, radius * 0.18);
    ctx.beginPath();
    ctx.moveTo(handleStartX, handleStartY);
    ctx.lineTo(starX, starY);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#c56bff";
    ctx.lineWidth = Math.max(compactVisual ? 4 : 6, radius * 0.08);
    ctx.beginPath();
    ctx.moveTo(handleStartX, handleStartY);
    ctx.lineTo(starX, starY);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.strokeStyle = input.charge > 0 ? `hsla(${rainbowHue}, 100%, 72%, 0.96)` : "#a642dd";
    ctx.lineWidth = Math.max(compactVisual ? 5 : 8, radius * 0.13);
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.72, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#f2a6ff";
    ctx.lineWidth = Math.max(3, radius * 0.04);
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.52, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.26)";
    ctx.lineWidth = Math.max(2, radius * 0.018);
    for (let index = 0; index < 24; index += 1) {
      const angle = (index / 24) * Math.PI * 2 + gameClock * 0.5;
      const inner = radius * 0.58;
      const outer = radius * 0.78;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
      ctx.lineTo(x + Math.cos(angle) * outer, y + Math.sin(angle) * outer);
      ctx.stroke();
    }

    ctx.shadowColor = "rgba(61, 26, 0, 0.35)";
    ctx.shadowBlur = compactVisual ? 4 : 12;
    starPath(ctx, starX, starY, radius * starOuterRadius, radius * starInnerRadius, 5, -Math.PI / 2);
    ctx.fillStyle = "#ffd238";
    ctx.fill();
    ctx.lineWidth = Math.max(compactVisual ? 3 : 4, radius * 0.05);
    ctx.strokeStyle = "#ffae21";
    ctx.stroke();

    ctx.shadowBlur = 0;
    starPath(ctx, starX, starY, radius * (compactVisual ? 0.15 : 0.24), radius * (compactVisual ? 0.085 : 0.13), 5, -Math.PI / 2);
    ctx.fillStyle = "#ff7eaa";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
    ctx.lineWidth = Math.max(2, radius * 0.025);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.beginPath();
    ctx.ellipse(x - radius * 0.25, y - radius * 0.31, radius * 0.12, radius * 0.07, -0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawWand() {
    const tool = currentTool();
    const metrics = currentWandMetrics();
    const radius = metrics.renderRadius;
    const x = pointer.x;
    const y = pointer.y;

    if (tool.style === "star" || currentLocation().style !== "soft") {
      drawStarWand(x, y, radius, metrics.compactVisual);
    } else {
      drawRingWand(x, y, radius);
    }
  }

  function drawKeyBursts() {
    if (keyBursts.length === 0) {
      return;
    }

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";

    for (const burst of keyBursts) {
      const progress = Math.min(1, burst.age / burst.life);
      const grow = 1 - Math.pow(1 - progress, 3);
      const fade = progress < 0.72 ? 1 : Math.max(0, 1 - (progress - 0.72) / 0.28);
      const baseSize = Math.min(width, height) * 0.16;
      const maxSize = Math.min(width, height) * (burst.text.length > 4 ? 0.34 : 0.46);
      const fontSize = baseSize + (maxSize - baseSize) * grow;

      ctx.globalAlpha = fade;
      ctx.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
      ctx.lineWidth = Math.max(8, fontSize * 0.08);
      ctx.strokeStyle = burst.stroke;
      ctx.fillStyle = burst.fill;
      ctx.strokeText(burst.text, width / 2, height / 2);
      ctx.fillText(burst.text, width / 2, height / 2);
    }

    ctx.restore();
  }

  function drawHud() {
    const settings = activeRoundSettings || getLevelSettings(selectedLocationId);
    const timerText = settings.timeLimitSeconds !== null ? formatTime(roundTime) : formatTime(elapsedTime);

    ctx.save();
    ctx.font = "700 22px Arial, Helvetica, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(0, 50, 58, 0.54)";
    roundedRectPath(ctx, 32, 32, 186, 52, 12);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`Очки: ${score}`, 52, 58);

    if (settings.scoreLimit !== null) {
      ctx.font = "700 15px Arial, Helvetica, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
      ctx.fillText(`цель ${settings.scoreLimit}`, 52, 79);
      ctx.font = "700 22px Arial, Helvetica, sans-serif";
    }

    const timeWidth = 148;
    roundedRectPath(ctx, width - timeWidth - 32, 32, timeWidth, 52, 12);
    ctx.fillStyle = "rgba(0, 50, 58, 0.54)";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(timerText, width - timeWidth - 10, 58);

    if (freezeTimer > 0) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
      ctx.font = "700 18px Arial, Helvetica, sans-serif";
      ctx.fillText("заморозка", 52, 104);
    }
    ctx.restore();
  }

  function drawRoundOverlay() {
    if (roundPause <= 0) {
      return;
    }

    ctx.save();
    ctx.fillStyle = "rgba(0, 49, 60, 0.42)";
    ctx.fillRect(0, 0, width, height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 54px Arial, Helvetica, sans-serif";
    ctx.fillText(roundResultText, width / 2, height / 2 - 34);
    ctx.font = "800 34px Arial, Helvetica, sans-serif";
    ctx.fillText(`Очки: ${finalScore}`, width / 2, height / 2 + 28);
    ctx.restore();
  }

  function drawFrame() {
    drawBackground();
    drawEffects();
    for (const bubble of bubbles) {
      drawBubble(bubble);
    }
    drawStarShots();
    drawPops();
    drawWand();
    drawKeyBursts();
    drawHud();
    drawRoundOverlay();
  }

  function tick(timestamp) {
    if (!running) {
      return;
    }

    const rawDelta = Math.max(0, (timestamp - lastFrameTime) / 1000 || 0.016);
    const delta = Math.min(0.033, rawDelta);
    lastFrameTime = timestamp;
    gameClock += rawDelta;

    const roundIsActive = updateRound(timestamp, rawDelta);
    updateSuper(rawDelta);

    if (roundIsActive) {
      moveBubbles(delta);
      resolveBubbleCollisions();
      updateStarShots(delta);
      handleWandCollisions();
    }

    updatePops(delta);
    updateEffects(delta);
    updateKeyBursts(delta);
    drawFrame();
    animationFrame = window.requestAnimationFrame(tick);
  }

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
    activePointerType = event.pointerType || "mouse";
  }

  function updatePointerFromTouch(touch) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = touch.clientX - rect.left;
    pointer.y = touch.clientY - rect.top;
    pointer.active = true;
    activePointerType = "touch";
  }

  function rememberActivePointerType(event) {
    if (event.pointerType === "mouse" || event.pointerType === "touch" || event.pointerType === "pen") {
      activePointerType = event.pointerType;
    }
  }

  async function enterFullscreen() {
    const target = document.documentElement;
    if (target.requestFullscreen && !document.fullscreenElement) {
      try {
        await target.requestFullscreen();
      } catch (error) {
        // Fullscreen is optional; the game still works in a normal browser window.
      }
    }
  }

  async function exitGame() {
    running = false;
    input.left = false;
    input.right = false;
    input.charge = 0;
    chargeMaxHoldTime = 0;
    stopChargeSound();
    keyOverlayBusy = false;
    window.speechSynthesis?.cancel();
    keyBursts = [];
    window.cancelAnimationFrame(animationFrame);
    document.body.classList.remove("playing");
    game.classList.add("hidden");
    hideResultOverlay();
    updateMobileControlsVisibility();
    menu.classList.remove("hidden");

    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        // The browser can reject exitFullscreen if the state changed at the same time.
      }
    }
  }

  async function startGame() {
    if (!levelSettingsModal.classList.contains("hidden")) {
      return;
    }
    // Создаем/resume AudioContext внутри исходного пользовательского click до любого await (важно для iOS/iPadOS).
    getAudioContext();
    saveSettings();
    hideResultOverlay();
    menu.classList.add("hidden");
    game.classList.remove("hidden");
    document.body.classList.add("playing");
    await enterFullscreen();
    resizeCanvas();
    pointer.x = width / 2;
    pointer.y = height / 2;
    pointer.active = true;
    resetRound();
    running = true;
    recordLevelStart(selectedLocationId);
    updateMobileControlsVisibility();
    lastFrameTime = performance.now();
    canvas.focus({ preventScroll: true });
    animationFrame = window.requestAnimationFrame(tick);
  }

  function handleKeyDown(event) {
    if (!running) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.ctrlKey && (event.key.toLowerCase() === "x" || event.code === "KeyX")) {
      exitGame();
      return;
    }

    if (roundFinished) {
      return;
    }

    if (keyOverlayBusy || !keyboardOverlayToggle.checked) {
      return;
    }

    showKeyBurst(getKeyInfo(event));
  }

  function handleMouseDown(event) {
    if (!running || roundFinished || shouldIgnoreGamePointer(event)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    updatePointer(event);
    canvas.focus({ preventScroll: true });

    if (event.button === 0) {
      input.left = true;
      input.charge = 0;
      chargeMaxHoldTime = 0;
      startChargeSound();
    } else if (event.button === 2) {
      input.right = true;
      triggerRightWave();
      rightWaveTimer = 0.64;
    } else if (event.button === 1 || event.button === 3 || event.button === 4) {
      triggerInstantButtonAction(event.button);
    }
  }

  function shouldIgnoreGamePointer(event) {
    return event.target === exitZone || event.target.closest?.(".mobile-controls, .result-overlay");
  }

  function handlePointerDown(event) {
    if (!running || roundFinished || shouldIgnoreGamePointer(event)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    updatePointer(event);
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture?.(event.pointerId);

    if (event.pointerType !== "mouse") {
      return;
    }

    if (event.button === 0) {
      input.left = true;
      input.charge = 0;
      chargeMaxHoldTime = 0;
      startChargeSound();
    } else if (event.button === 2) {
      input.right = true;
      triggerRightWave();
      rightWaveTimer = 0.64;
    } else if (event.button === 1 || event.button === 3 || event.button === 4) {
      triggerInstantButtonAction(event.button);
    }
  }

  function handlePointerMove(event) {
    if (!running || roundFinished || shouldIgnoreGamePointer(event)) {
      return;
    }

    event.preventDefault();
    updatePointer(event);
  }

  function handlePointerUp(event) {
    if (!running) {
      return;
    }

    event.preventDefault();
    try {
      canvas.releasePointerCapture?.(event.pointerId);
    } catch (error) {
      // Some browsers throw if the pointer was already released.
    }
    if (event.pointerType === "mouse") {
      if (event.button === 0) {
        input.left = false;
        input.charge = 0;
        chargeMaxHoldTime = 0;
        stopChargeSound();
      } else if (event.button === 2) {
        input.right = false;
      }
    }
  }

  function handleTouchStart(event) {
    if (!running || roundFinished || shouldIgnoreGamePointer(event) || event.targetTouches.length === 0) {
      return;
    }
    event.preventDefault();
    updatePointerFromTouch(event.targetTouches[0]);
  }

  function handleTouchMove(event) {
    if (!running || roundFinished || shouldIgnoreGamePointer(event) || event.targetTouches.length === 0) {
      return;
    }
    event.preventDefault();
    updatePointerFromTouch(event.targetTouches[0]);
  }

  function handleMouseUp(event) {
    if (!running) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.button === 0) {
      input.left = false;
      input.charge = 0;
      chargeMaxHoldTime = 0;
      stopChargeSound();
    } else if (event.button === 2) {
      input.right = false;
    }
  }

  function handleWheel(event) {
    if (!running || roundFinished || shouldIgnoreGamePointer(event)) {
      return;
    }

    event.preventDefault();
    updatePointer(event);
    triggerWheelSwirl(event.deltaY);
  }

  function handleAuxClick(event) {
    if (!running || roundFinished || shouldIgnoreGamePointer(event)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    updatePointer(event);
    if (event.button === 1 || event.button === 3 || event.button === 4) {
      triggerInstantButtonAction(event.button);
    }
  }

  function startExitHold() {
    window.clearTimeout(exitHoldTimer);
    exitHoldTimer = window.setTimeout(exitGame, 900);
  }

  function cancelExitHold() {
    window.clearTimeout(exitHoldTimer);
  }

  function resetMouseButtons() {
    input.left = false;
    input.right = false;
    input.charge = 0;
    chargeMaxHoldTime = 0;
    stopChargeSound();
  }

  function handleViewportChange() {
    if (!running) {
      return;
    }
    window.cancelAnimationFrame(viewportResizeFrame);
    viewportResizeFrame = window.requestAnimationFrame(() => {
      resizeCanvas();
      resetBubbles();
    });
  }

  function restartLevelFromResult() {
    hideResultOverlay();
    resetRound();
    recordLevelStart(selectedLocationId);
    updateMobileControlsVisibility();
    lastFrameTime = performance.now();
    canvas.focus({ preventScroll: true });
  }

  function startNextLevelFromResult() {
    selectNextLevel();
    renderMenus();
    hideResultOverlay();
    resizeCanvas();
    resetRound();
    recordLevelStart(selectedLocationId);
    updateMobileControlsVisibility();
    lastFrameTime = performance.now();
    canvas.focus({ preventScroll: true });
  }

  function startMobileSuper(event) {
    if (!running || roundFinished || !isSuperLocation()) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    input.left = true;
    input.charge = 0;
    chargeMaxHoldTime = 0;
    startChargeSound();
  }

  function stopMobileSuper(event) {
    event?.preventDefault();
    event?.stopPropagation();
    input.left = false;
    input.charge = 0;
    chargeMaxHoldTime = 0;
    stopChargeSound();
  }

  function triggerMobileWave(event) {
    if (!running || roundFinished || !isSuperLocation()) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    triggerRightWave();
  }

  loadSettings();
  renderMenus();

  startGameButton.addEventListener("click", startGame);
  keyboardOverlayToggle.addEventListener("change", saveSettings);
  letterStrokeColorInput.addEventListener("input", saveSettings);
  effectsVolumeInput.addEventListener("input", () => {
    effectsVolume = Number(effectsVolumeInput.value) / 100;
    applyAudioSettings();
    saveSettings();
  });
  superVolumeInput.addEventListener("input", () => {
    superVolume = Number(superVolumeInput.value) / 100;
    applyAudioSettings();
    saveSettings();
  });
  mobileSuperButtonsToggle.addEventListener("change", () => {
    saveSettings();
    updateMobileControlsVisibility();
  });
  enableSoundButton.addEventListener("click", () => {
    getAudioContext();
    playPopSound(selectedPopSoundId, true);
    window.setTimeout(() => playChargePreview(selectedChargeSoundId), 180);
  });
  resetProgressButton.addEventListener("click", () => {
    if (!window.confirm("Сбросить сохраненный прогресс уровней?")) {
      return;
    }
    progressState = {};
    saveSettings();
    renderMenus();
  });
  resetLevelSettingsButton.addEventListener("click", () => {
    if (!window.confirm("Вернуть цели и время всех пяти уровней по умолчанию? Остальной прогресс и звуковые настройки сохранятся.")) {
      return;
    }
    levelSettings = createDefaultLevelSettings();
    saveSettings();
    renderMenus();
  });
  scoreMinusButton.addEventListener("click", () => adjustScoreLimit(-SCORE_LIMIT_STEP));
  scorePlusButton.addEventListener("click", () => adjustScoreLimit(SCORE_LIMIT_STEP));
  timeMinusButton.addEventListener("click", () => adjustTimeLimit(-30));
  timePlusButton.addEventListener("click", () => adjustTimeLimit(30));
  scoreUnlimitedInput.addEventListener("change", () => {
    updateLevelLimitControlStates();
    setLevelSettingsError("");
  });
  timeUnlimitedInput.addEventListener("change", () => {
    updateLevelLimitControlStates();
    setLevelSettingsError("");
  });
  levelScoreLimitInput.addEventListener("input", () => setLevelSettingsError(""));
  levelTimeMinutesInput.addEventListener("input", () => setLevelSettingsError(""));
  levelTimeSecondsInput.addEventListener("input", () => setLevelSettingsError(""));
  saveLevelSettingsButton.addEventListener("click", saveLevelSettingsDraft);
  defaultLevelSettingsButton.addEventListener("click", restoreCurrentLevelDefaults);
  cancelLevelSettingsButton.addEventListener("click", closeLevelSettings);
  levelSettingsModal.addEventListener("pointerdown", (event) => {
    if (event.target === levelSettingsModal) {
      closeLevelSettings();
    }
  });
  repeatLevelButton.addEventListener("click", restartLevelFromResult);
  nextLevelButton.addEventListener("click", startNextLevelFromResult);
  resultMenuButton.addEventListener("click", exitGame);
  mobileSuperButton.addEventListener("pointerdown", startMobileSuper);
  mobileSuperButton.addEventListener("pointerup", stopMobileSuper);
  mobileSuperButton.addEventListener("pointercancel", stopMobileSuper);
  mobileSuperButton.addEventListener("pointerleave", stopMobileSuper);
  mobileWaveButton.addEventListener("pointerdown", triggerMobileWave);
  window.addEventListener("resize", handleViewportChange);
  window.addEventListener("orientationchange", handleViewportChange);
  window.screen?.orientation?.addEventListener?.("change", handleViewportChange);
  if (window.PointerEvent) {
    window.addEventListener("pointerdown", rememberActivePointerType, true);
    canvas.addEventListener("pointerdown", handlePointerDown, { passive: false });
    canvas.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp, true);
    window.addEventListener("pointercancel", handlePointerUp, true);
  } else {
    window.addEventListener("mousemove", updatePointer);
    window.addEventListener("mousedown", handleMouseDown, true);
    window.addEventListener("mouseup", handleMouseUp, true);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
  }
  window.addEventListener("auxclick", handleAuxClick, true);
  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("blur", resetMouseButtons);
  window.addEventListener("keydown", handleKeyDown, true);
  window.addEventListener("keydown", (event) => {
    if (!levelSettingsModal.classList.contains("hidden") && event.key === "Escape") {
      event.preventDefault();
      closeLevelSettings();
    }
  }, true);
  window.addEventListener("contextmenu", (event) => {
    if (running) {
      event.preventDefault();
    }
  });
  exitZone.addEventListener("pointerdown", startExitHold);
  exitZone.addEventListener("pointerup", cancelExitHold);
  exitZone.addEventListener("pointerleave", cancelExitHold);
})();
