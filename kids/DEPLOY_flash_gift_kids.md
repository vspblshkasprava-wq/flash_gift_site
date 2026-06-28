# Загрузка на flash.gift/kids/

Нужно загрузить содержимое папки проекта `Game_Kids`, а не саму папку и не архив.

Если игра должна открываться по адресу:

```text
https://flash.gift/kids/
```

то на хостинге нужно создать папку `kids` и загрузить внутрь нее содержимое `Game_Kids`.

Правильно:

```text
/kids/index.html
/kids/styles.css
/kids/manifest.webmanifest
/kids/bubble-game/
/kids/keyboard-game/
/kids/assets/
```

Неправильно:

```text
/kids/Game_Kids/index.html
```

## Что загрузить

Загрузите в папку `kids` эти файлы и папки:

- `index.html`
- `styles.css`
- `manifest.webmanifest`
- `README.md`
- `DEPLOY_flash_gift_kids.md`
- `bubble-game/`
- `keyboard-game/`
- `assets/`

Не нужно загружать:

- архивы;
- временные файлы;
- скриншоты Codex;
- `.git`;
- `node_modules`;
- локальные тестовые файлы.

## Что проверить после загрузки

Откройте в браузере:

- `https://flash.gift/kids/`
- `https://flash.gift/kids/bubble-game/`
- `https://flash.gift/kids/keyboard-game/`
- `https://flash.gift/kids/manifest.webmanifest`
- `https://flash.gift/kids/assets/icons/apple-touch-icon.png`
- `https://flash.gift/kids/assets/icons/icon-192.png`
- `https://flash.gift/kids/assets/icons/icon-512.png`

Также проверьте, что старт игры работает, меню звуков открывается и в консоли браузера нет ошибок при обычном запуске.

## Что делать, если открывается 404

1. Проверьте, что `index.html` лежит прямо внутри `/kids/`.
2. Проверьте, что не получилось `/kids/Game_Kids/index.html` вместо `/kids/index.html`.
3. Проверьте регистр букв в названиях папок: `assets`, `bubble-game`, `keyboard-game`.
4. Проверьте, что загружены папки `assets`, `bubble-game` и `keyboard-game`.
5. Проверьте, что на хостинге открыта именно папка `kids`, а не соседняя папка или архив.

## Если нужно загрузить ZIP

В ZIP внутри сразу должны лежать:

```text
index.html
styles.css
manifest.webmanifest
bubble-game/
keyboard-game/
assets/
README.md
DEPLOY_flash_gift_kids.md
```

Не должно быть лишнего вложенного уровня папки.
