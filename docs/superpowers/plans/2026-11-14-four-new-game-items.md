# Implementation Plan: 4 New In-Game Items & Mobile-First Swipe Bar

- **Goal**: Implement 4 new interactive items (`🔍 돋보기 힌트`, `🍀 행운의 클로버`, `⌛ 타임머신`, `🧲 콤보 자석`) in '하루맞춤', integrate them into the gameplay engine, update the Game Guide modal, and style the 7-item bar as a single-row horizontal swipe container for mobile.
- **Target Repository**: `mkotinet/Spelling`
- **Target URL**: `haru.danminlove.com`

---

## Proposed Changes

### 1. Frontend Engine (`app.js`)
- **State Initialization**:
  - `this.items`: Add `hint: 2`, `clover: 1`, `timemachine: 1`, `magnet: 1` loaded from/saved to `localStorage`.
  - `this.activeItemMagnet = false;`
- **Action Methods**:
  - `useItemHint()`: Shows `.quiz-hint-box` with dictionary definition/explanation, decrements count.
  - `useItemClover()`: Immediately solves and marks the current question correct, advancing progress.
  - `useItemTimemachine()`: Reverses wrong answer selection on the current question, resets `this.selectedOption = null`, re-enables remaining options, hides explanation, decrements count.
  - `useItemMagnet()`: Activates magnet mode (`activeItemMagnet = true`), gives 3x combo bonus on correct answers, shows status banner.
- **Rendering & UI Binding**:
  - `renderItemBar()`: Updates disabled states, counts, and active banners for all 7 items.
  - Bind click events for `btnItemHint`, `btnItemClover`, `btnItemTimemachine`, `btnItemMagnet`.

### 2. Markup & Styling (`index.html`, `style.css`)
- **HTML (`index.html`)**:
  - Add 4 new buttons to `#quizItemBar`:
    - `#btnItemHint`: `🔍 힌트` / `돋보기`
    - `#btnItemClover`: `🍀 클로버` / `패스`
    - `#btnItemTimemachine`: `⌛ 타임머신` / `되돌리기`
    - `#btnItemMagnet`: `🧲 자석` / `콤보`
  - Add `#quizHintBox` container inside `.quiz-content` for animated hint bubble.
  - Update `#modalGameGuide` to describe all 7 in-game items.
- **CSS (`style.css`)**:
  - `#quizItemBar`: `display: flex; gap: 6px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; flex-wrap: nowrap;`
  - Unique pastel color styles for each new item button (`.item-btn-hint`, `.item-btn-clover`, `.item-btn-timemachine`, `.item-btn-magnet`).
  - `.quiz-hint-box` cute cartoon speech bubble styling.

### 3. Tests & Verification
- Update `tests/test_game_items.js` to test all 7 items.
- Update `tests/test_game_guide_and_ui.js` to assert all 7 item buttons and guide texts exist.
- Run `tests/test_responsive_layout.js` and `tests/verify_all.js`.
- Sync to Git and redeploy to Synology NAS Portainer.

---
