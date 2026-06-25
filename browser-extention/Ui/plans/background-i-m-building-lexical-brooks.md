# Plan: Widget Enhancements — Blur, Ring Date, Glow Toggle

## Context
Three widget enhancement requests:
1. **Cinematic Clock** — add a toggleable background blur with a volume-style slider to control intensity. When off, widget renders normally. When on, a `backdropFilter: blur(Xpx)` is applied to the Clock component wrapper.
2. **Glass Calendar & Notes** — today's date cell should display with a colored ring border (same visual as the gear icon ring mode). Uses the calendar's existing `color` prop (default purple `#c58bf2`).
3. **Ethereal Glass Clock** — add (a) the same toggleable background blur + slider, and (b) a toggle to turn off its pulsing glow animation entirely.

---

## What Needs to Be Built

### 1. Cinematic Clock — Background Blur

**New state in `App.tsx`:**
- `clockBgBlurEnabled: boolean` (default `false`)
- `clockBgBlur: number` (default `10`, range 0–40)

**Handlers + localStorage keys:**
- `homepage_clock_bg_blur_enabled`, `homepage_clock_bg_blur`
- Follow exact same pattern as `handleUpdateGlassCalendarBlur` / `handleToggleGlassCalendarTransparent`

**Render in `App.tsx`** (~line 700, the Clock wrapper `motion.div`):
- When `clockBgBlurEnabled`, apply `backdropFilter: blur(${clockBgBlur}px)` to the wrapper's inline style.

**`Clock.tsx`** — no changes needed; blur is applied on the wrapper in App.tsx.

**`WidgetsPanel.tsx`** — inside the Cinematic Clock section (after the existing color pickers, before the scale slider), add:
- A toggle row "Background Blur" with on/off toggle (same `ToggleLeft`/`ToggleRight` pattern)
- When enabled, show a volume-style range slider (min 0, max 40, step 1) with live px readout — same pattern as Glass Calendar blur slider (~line 520–537)

**Props to add to `WidgetsPanelProps`:**
```ts
clockBgBlurEnabled: boolean
onToggleClockBgBlur: (val: boolean) => void
clockBgBlur: number
onUpdateClockBgBlur: (val: number) => void
```

---

### 2. Glass Calendar & Notes — Today Date Ring

**`GlassCalendar.tsx`** — in the day-cell rendering, today's date currently gets a distinct background. Replace or augment it with a ring border:
- Find where `isToday` is checked for the current day cell styling
- Apply `border-2` + `border-[color]` + `rounded-full` + `box-shadow: 0 0 8px ${color}66` to make it look like the gear ring
- Remove or keep any existing today highlight — the ring replaces the plain background highlight

No new props needed — the existing `color` prop (passed from `glassCalendarColor` in App.tsx, default `#c58bf2`) is used for the ring color. This means the ring automatically follows the calendar's accent color picker already in the Widgets panel.

---

### 3. Ethereal Glass Clock — Background Blur + Glow Toggle

**New state in `App.tsx`:**
- `etherealClockBgBlurEnabled: boolean` (default `false`)
- `etherealClockBgBlur: number` (default `10`)
- `etherealClockGlowEnabled: boolean` (default `true`)

**Handlers + localStorage keys:**
- `homepage_ethereal_clock_bg_blur_enabled`, `homepage_ethereal_clock_bg_blur`, `homepage_ethereal_clock_glow`

**Render in `App.tsx`** (~line 737, EtherealClock wrapper):
- When `etherealClockBgBlurEnabled`, apply `backdropFilter: blur(${etherealClockBgBlur}px)` to wrapper style.

**`EtherealClock.tsx`** — add a `glowEnabled` prop (boolean, default `true`):
- The component already has a pulsing glow div (look for `animate-pulse` or `shadow`/`blur` classes on the glow layer)
- Conditionally render or hide that glow element based on `glowEnabled`

**`WidgetsPanel.tsx`** — inside the Ethereal Glass Clock section, add after the existing transparent toggle:
- Background Blur toggle + slider (identical pattern to what's added for Cinematic Clock)
- Glow Effect toggle row

**New props for `WidgetsPanelProps`:**
```ts
etherealClockBgBlurEnabled: boolean
onToggleEtherealClockBgBlur: (val: boolean) => void
etherealClockBgBlur: number
onUpdateEtherealClockBgBlur: (val: number) => void
etherealClockGlowEnabled: boolean
onToggleEtherealClockGlow: (val: boolean) => void
```
Also add `glowEnabled` to `EtherealClock`'s props interface.

---

## Files to Modify

1. **`src/app/App.tsx`** — new state, handlers, localStorage load/save, pass new props to WidgetsPanel, apply blur styles to Clock and EtherealClock wrappers
2. **`src/app/components/WidgetsPanel.tsx`** — new props in interface + destructuring, add blur toggle+slider to Cinematic Clock section, add blur toggle+slider + glow toggle to Ethereal Clock section
3. **`src/app/components/GlassCalendar.tsx`** — today's date cell: replace plain highlight with ring border using `color` prop
4. **`src/app/components/EtherealClock.tsx`** — accept `glowEnabled` prop, conditionally render glow layer

---

## Verification
- Enable Cinematic Clock → toggle Background Blur on → drag slider → wallpaper behind widget blurs live
- Open Glass Calendar → today's date has a colored ring matching the accent color
- Enable Ethereal Clock → toggle Background Blur on → slider works; toggle Glow off → pulsing glow disappears
- Reload page → all new settings persist
