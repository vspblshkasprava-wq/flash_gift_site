(function () {
  const LOCATIONS = [
    {
      id: "clean-gray",
      title: "Чистый серый",
      description: "Серый фон и черная буква.",
      backgroundColor: "#9a9a9a",
      letterColor: "#000000"
    }
  ];

  const STORAGE_KEY = window.GameKidsDeployment.makeStorageKey("babyKeyboardGameSettingsV1");
  const menu = document.getElementById("menu");
  const game = document.getElementById("game");
  const glyph = document.getElementById("glyph");
  const startGameButton = document.getElementById("startGame");
  const backgroundColorInput = document.getElementById("backgroundColor");
  const letterColorInput = document.getElementById("letterColor");
  const locationList = document.getElementById("locationList");
  const exitZone = document.getElementById("exitZone");

  const digitNames = {
    "0": ["zero", "ноль"],
    "1": ["one", "один"],
    "2": ["two", "два"],
    "3": ["three", "три"],
    "4": ["four", "четыре"],
    "5": ["five", "пять"],
    "6": ["six", "шесть"],
    "7": ["seven", "семь"],
    "8": ["eight", "восемь"],
    "9": ["nine", "девять"]
  };

  const latinLetterNames = {
    A: ["A", "эй"],
    B: ["B", "би"],
    C: ["C", "си"],
    D: ["D", "ди"],
    E: ["E", "и"],
    F: ["F", "эф"],
    G: ["G", "джи"],
    H: ["H", "эйч"],
    I: ["I", "ай"],
    J: ["J", "джей"],
    K: ["K", "кей"],
    L: ["L", "эл"],
    M: ["M", "эм"],
    N: ["N", "эн"],
    O: ["O", "оу"],
    P: ["P", "пи"],
    Q: ["Q", "кью"],
    R: ["R", "ар"],
    S: ["S", "эс"],
    T: ["T", "ти"],
    U: ["U", "ю"],
    V: ["V", "ви"],
    W: ["W", "дабл-ю"],
    X: ["X", "икс"],
    Y: ["Y", "уай"],
    Z: ["Z", "зед"]
  };

  const specialKeys = {
    " ": { display: "Пробел", en: "space", ru: "пробел" },
    Enter: { display: "↵", en: "enter", ru: "энтер" },
    Backspace: { display: "⌫", en: "backspace", ru: "бэкспейс" },
    Tab: { display: "⇥", en: "tab", ru: "таб" },
    Escape: { display: "Esc", en: "escape", ru: "эскейп" },
    ArrowUp: { display: "↑", en: "up", ru: "вверх" },
    ArrowDown: { display: "↓", en: "down", ru: "вниз" },
    ArrowLeft: { display: "←", en: "left", ru: "влево" },
    ArrowRight: { display: "→", en: "right", ru: "вправо" },
    Shift: { display: "⇧", en: "shift", ru: "шифт" },
    Control: { display: "Ctrl", en: "control", ru: "контрол" },
    Alt: { display: "Alt", en: "alt", ru: "альт" },
    Meta: { display: "Win", en: "windows", ru: "виндовс" },
    CapsLock: { display: "⇪", en: "caps lock", ru: "капс лок" },
    Delete: { display: "Del", en: "delete", ru: "делит" },
    Insert: { display: "Ins", en: "insert", ru: "инсерт" },
    Home: { display: "Home", en: "home", ru: "хоум" },
    End: { display: "End", en: "end", ru: "энд" },
    PageUp: { display: "PgUp", en: "page up", ru: "пейдж ап" },
    PageDown: { display: "PgDn", en: "page down", ru: "пейдж даун" },
    PrintScreen: { display: "PrtSc", en: "print screen", ru: "принт скрин" },
    ScrollLock: { display: "ScrLk", en: "scroll lock", ru: "скрол лок" },
    Pause: { display: "Pause", en: "pause", ru: "пауза" },
    NumLock: { display: "Num", en: "num lock", ru: "нам лок" },
    ContextMenu: { display: "Menu", en: "menu", ru: "меню" }
  };

  let selectedLocationId = LOCATIONS[0].id;
  let isPlaying = false;
  let isSpeaking = false;
  let exitHoldTimer = 0;

  function loadSettings() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (parsed.backgroundColor) {
        backgroundColorInput.value = parsed.backgroundColor;
      }
      if (parsed.letterColor) {
        letterColorInput.value = parsed.letterColor;
      }
      if (parsed.locationId && LOCATIONS.some((location) => location.id === parsed.locationId)) {
        selectedLocationId = parsed.locationId;
      }
    } catch (error) {
      selectedLocationId = LOCATIONS[0].id;
    }
  }

  function saveSettings() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        backgroundColor: backgroundColorInput.value,
        letterColor: letterColorInput.value,
        locationId: selectedLocationId
      })
    );
  }

  function applyColors() {
    document.documentElement.style.setProperty("--game-bg", backgroundColorInput.value);
    document.documentElement.style.setProperty("--glyph-color", letterColorInput.value);
    saveSettings();
  }

  function renderLocations() {
    locationList.innerHTML = "";
    LOCATIONS.forEach((location) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "location-card";
      button.dataset.locationId = location.id;
      button.innerHTML = `<strong>${location.title}</strong><small>${location.description}</small>`;
      if (location.id === selectedLocationId) {
        button.classList.add("is-active");
      }
      button.addEventListener("click", () => {
        selectedLocationId = location.id;
        backgroundColorInput.value = location.backgroundColor;
        letterColorInput.value = location.letterColor;
        applyColors();
        renderLocations();
      });
      locationList.appendChild(button);
    });
  }

  function getKeyInfo(event) {
    const key = event.key;

    if (digitNames[key]) {
      return {
        display: key,
        en: digitNames[key][0],
        ru: digitNames[key][1]
      };
    }

    if (/^[a-z]$/i.test(key)) {
      const letter = key.toUpperCase();
      const names = latinLetterNames[letter];
      return {
        display: `${letter} ${letter.toLowerCase()}`,
        en: names[0],
        ru: names[1]
      };
    }

    if (key.length === 1 && /\p{L}/u.test(key)) {
      return {
        display: `${key.toUpperCase()} ${key.toLowerCase()}`,
        en: key,
        ru: key
      };
    }

    if (key.length === 1) {
      return {
        display: key.toUpperCase(),
        en: key,
        ru: key
      };
    }

    if (/^F\d{1,2}$/.test(key)) {
      return {
        display: key,
        en: key.replace("F", "F "),
        ru: key.replace("F", "эф ")
      };
    }

    if (specialKeys[key]) {
      return specialKeys[key];
    }

    return {
      display: key.slice(0, 8),
      en: key,
      ru: key
    };
  }

  function speak(text, lang) {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
        window.setTimeout(resolve, 500);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.78;
      utterance.pitch = 1.05;
      utterance.volume = 1;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      window.speechSynthesis.speak(utterance);
    });
  }

  async function speakKey(keyInfo) {
    isSpeaking = true;
    glyph.classList.add("is-speaking");
    window.speechSynthesis?.cancel();
    await speak(keyInfo.en, "en-US");
    await speak(keyInfo.ru, "ru-RU");
    glyph.classList.remove("is-speaking");
    isSpeaking = false;
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
    isPlaying = false;
    isSpeaking = false;
    window.speechSynthesis?.cancel();
    document.body.classList.remove("playing");
    game.classList.add("hidden");
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
    applyColors();
    glyph.textContent = "8";
    glyph.classList.remove("is-wide");
    menu.classList.add("hidden");
    game.classList.remove("hidden");
    document.body.classList.add("playing");
    isPlaying = true;
    await enterFullscreen();
  }

  function handleKeyDown(event) {
    if (!isPlaying) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.ctrlKey && (event.key.toLowerCase() === "x" || event.code === "KeyX")) {
      exitGame();
      return;
    }

    if (isSpeaking) {
      return;
    }

    const keyInfo = getKeyInfo(event);
    glyph.textContent = keyInfo.display;
    glyph.classList.toggle("is-wide", keyInfo.display.length > 4);
    speakKey(keyInfo);
  }

  function startExitHold() {
    window.clearTimeout(exitHoldTimer);
    exitHoldTimer = window.setTimeout(exitGame, 900);
  }

  function cancelExitHold() {
    window.clearTimeout(exitHoldTimer);
  }

  loadSettings();
  applyColors();
  renderLocations();

  backgroundColorInput.addEventListener("input", applyColors);
  letterColorInput.addEventListener("input", applyColors);
  startGameButton.addEventListener("click", startGame);
  exitZone.addEventListener("pointerdown", startExitHold);
  exitZone.addEventListener("pointerup", cancelExitHold);
  exitZone.addEventListener("pointerleave", cancelExitHold);
  window.addEventListener("keydown", handleKeyDown, true);
  window.addEventListener("contextmenu", (event) => {
    if (isPlaying) {
      event.preventDefault();
    }
  });
})();
