# Add Background Blur Slider to Glass Calendar & Notes Widget

## Context

The Glass Calendar & Notes widget currently has a hardcoded background blur value of `24px`. Users want the ability to adjust this blur amount using a slider control (similar to volume control or size sliders) to customize the glassmorphic effect intensity.

**Why this change is needed:**
- Users want control over the blur intensity for their Glass Calendar widget
- Different wallpapers and preferences may need different blur amounts
- Some users may want stronger blur (more frosted glass), others may want minimal blur
- Provides customization consistency with other adjustable widget properties (color, size, transparency)

**Intended outcome:**
- Add a "Background Blur" slider in the Glass Calendar section of WidgetsPanel
- Slider allows adjustment from 0px (no blur) to 40px (heavy blur)
- Default value remains 24px (current hardcoded value)
- Settings persist in localStorage
- Real-time preview as slider is adjusted

## Current Implementation

### Glass Calendar Blur (GlassCalendar.tsx, line 183)

**Currently hardcoded:**
```tsx
backdropFilter: 'blur(24px)',
WebkitBackdropFilter: 'blur(24px)',
```

The component has no blur prop - it's fixed at 24px. The component accepts `color` and `transparentBg` props but no blur control.

### Existing Slider Pattern (WidgetsPanel.tsx)

**Size Slider Example** (lines 461-476):
```tsx
<div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/10">
  <div className="flex justify-between items-center">
    <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
      <LayoutGrid size={14} /> Widget Size
    </label>
    <span className="text-xs font-space text-white/50">{Math.round(glassCalendarScale * 100)}%</span>
  </div>
  <input 
    type="range" 
    min="0.5" 
    max="1.5" 
    step="0.05"
    value={glassCalendarScale}
    onChange={(e) => onUpdateGlassCalendarScale(parseFloat(e.target.value))}
    className="w-full accent-white"
    style={{ accentColor: glassCalendarColor }}
  />
</div>
```

**Pattern elements:**
- Container: `flex flex-col gap-3 mt-6 pt-6 border-t border-white/10`
- Label with icon using uppercase tracking
- Value display on right (shows percentage or pixel value)
- Range input with min/max/step and onChange handler
- Styled with theme color accent

### State Management Pattern (App.tsx)

**Current Glass Calendar states** (lines 201-206):
```tsx
const [glassCalendarScale, setGlassCalendarScale] = useState(1);
const [glassCalendarColor, setGlassCalendarColor] = useState(DEFAULT_THEME);
const [glassCalendarTransparent, setGlassCalendarTransparent] = useState(false);
```

**Handler pattern** (lines 527-534):
```tsx
const handleUpdateGlassCalendarScale = (scale: number) => {
  setGlassCalendarScale(scale);
  safeSetItem("homepage_glass_calendar_scale", scale.toString());
};

const handleToggleGlassCalendarTransparent = (val: boolean) => {
  setGlassCalendarTransparent(val);
  safeSetItem("homepage_glass_calendar_trans", String(val));
};
```

## Implementation Approach

### 1. Add Blur Prop to GlassCalendar Component (GlassCalendar.tsx)

**Update interface** (lines 10-13):
```tsx
export interface GlassCalendarProps {
  color?: string;
  transparentBg?: boolean;
  blur?: number;  // ADD THIS
}

export function GlassCalendar({ 
  color = "#c58bf2", 
  transparentBg = false,
  blur = 24  // ADD THIS (default to current hardcoded value)
}: GlassCalendarProps) {
```

**Update backdrop filter** (lines 183-184):
```tsx
// CHANGE FROM:
backdropFilter: 'blur(24px)',
WebkitBackdropFilter: 'blur(24px)',

// CHANGE TO:
backdropFilter: `blur(${blur}px)`,
WebkitBackdropFilter: `blur(${blur}px)`,
```

### 2. Add Blur State to App.tsx

**Add state variable** (after line 206):
```tsx
const [glassCalendarTransparent, setGlassCalendarTransparent] = useState(false);
const [glassCalendarBlur, setGlassCalendarBlur] = useState(24);  // ADD THIS
```

**Add localStorage loading** (in useEffect around line 308):
```tsx
const savedGlassCalendarTrans = localStorage.getItem("homepage_glass_calendar_trans");
const savedGlassCalendarBlur = localStorage.getItem("homepage_glass_calendar_blur");  // ADD THIS
```

**Add loading logic** (around line 343):
```tsx
if (savedGlassCalendarTrans) setGlassCalendarTransparent(savedGlassCalendarTrans === "true");
if (savedGlassCalendarBlur) setGlassCalendarBlur(parseFloat(savedGlassCalendarBlur));  // ADD THIS
```

**Add handler function** (after line 534):
```tsx
const handleToggleGlassCalendarTransparent = (val: boolean) => {
  setGlassCalendarTransparent(val);
  safeSetItem("homepage_glass_calendar_trans", String(val));
};

const handleUpdateGlassCalendarBlur = (blur: number) => {  // ADD THIS
  setGlassCalendarBlur(blur);
  safeSetItem("homepage_glass_calendar_blur", blur.toString());
};
```

**Pass to GlassCalendar component** (around line 715):
```tsx
// CHANGE FROM:
<GlassCalendar color={glassCalendarColor} transparentBg={glassCalendarTransparent} />

// CHANGE TO:
<GlassCalendar 
  color={glassCalendarColor} 
  transparentBg={glassCalendarTransparent}
  blur={glassCalendarBlur}  // ADD THIS
/>
```

**Pass to WidgetsPanel** (around line 779):
```tsx
<WidgetsPanel
  // ...existing props...
  glassCalendarBlur={glassCalendarBlur}  // ADD THIS
  onUpdateGlassCalendarBlur={handleUpdateGlassCalendarBlur}  // ADD THIS
/>
```

### 3. Update WidgetsPanel Interface (WidgetsPanel.tsx)

**Add to interface** (around lines 40-45):
```tsx
glassCalendarTransparent: boolean;
onToggleGlassCalendarTransparent: (val: boolean) => void;
glassCalendarBlur: number;  // ADD THIS
onUpdateGlassCalendarBlur: (blur: number) => void;  // ADD THIS
```

**Add to destructuring** (around lines 70-85):
```tsx
glassCalendarTransparent,
onToggleGlassCalendarTransparent,
glassCalendarBlur,  // ADD THIS
onUpdateGlassCalendarBlur,  // ADD THIS
```

### 4. Add Blur Slider UI (WidgetsPanel.tsx)

**Insert after Transparent BG toggle** (after line 459, before the Widget Size section at line 461):

```tsx
{/* Transparent Toggle section ends at line 459 */}

{/* Background Blur Slider */}
<div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/10">
  <div className="flex justify-between items-center">
    <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
      <LayoutGrid size={14} /> Background Blur
    </label>
    <span className="text-xs font-space text-white/50">{glassCalendarBlur}px</span>
  </div>
  <input 
    type="range" 
    min="0" 
    max="40" 
    step="1"
    value={glassCalendarBlur}
    onChange={(e) => onUpdateGlassCalendarBlur(parseFloat(e.target.value))}
    className="w-full accent-white"
    style={{ accentColor: glassCalendarColor }}
  />
</div>

{/* Widget Size section starts at line 461+ */}
```

**UI Details:**
- Range: 0-40px (0 = no blur/clear glass, 40 = heavy blur/very frosted)
- Step: 1px increments
- Display: Shows pixel value (e.g., "24px")
- Icon: LayoutGrid (matching other sliders)
- Accent color: Uses glassCalendarColor for consistency

## Critical Files to Modify

1. **`/workspaces/default/code/src/app/components/GlassCalendar.tsx`**
   - Add `blur` prop to interface (default 24)
   - Update backdropFilter to use dynamic blur value

2. **`/workspaces/default/code/src/app/App.tsx`**
   - Add `glassCalendarBlur` state (default 24)
   - Add localStorage loading for blur value
   - Add `handleUpdateGlassCalendarBlur` handler
   - Pass blur prop to GlassCalendar component
   - Pass blur props to WidgetsPanel

3. **`/workspaces/default/code/src/app/components/WidgetsPanel.tsx`**
   - Add blur props to interface
   - Add to component destructuring
   - Insert blur slider UI after Transparent BG toggle

## Pattern to Follow

**Existing patterns to reuse:**
- State management: Same as `glassCalendarScale` (numeric value, parseFloat, toString)
- localStorage: Key pattern `homepage_glass_calendar_blur`
- Slider UI: Same as existing size sliders in WidgetsPanel
- Handler: Same pattern as other numeric handlers (scale, volume)

## Blur Value Ranges

| Value | Effect | Use Case |
|-------|--------|----------|
| 0px | No blur - clear glass | Minimal aesthetic, show wallpaper clearly |
| 12px | Light blur | Subtle glassmorphism |
| 24px | **Default** - Medium blur | Current hardcoded value, balanced look |
| 32px | Heavy blur | Strong frosted glass effect |
| 40px | Maximum blur | Very opaque, hides wallpaper completely |

## Verification Steps

**After implementation, verify:**

1. **Slider Appears:**
   - Open Widgets panel
   - Toggle Glass Calendar widget ON
   - Scroll to see "Background Blur" slider
   - Slider appears between Transparent BG toggle and Widget Size slider

2. **Slider Functionality:**
   - Move slider from 0 to 40
   - Value display updates in real-time (shows "Xpx")
   - Glass Calendar background blur changes immediately
   - At 0px: background is clear/sharp
   - At 24px: medium blur (default)
   - At 40px: heavy blur/very frosted

3. **Persistence:**
   - Set blur to a specific value (e.g., 15px)
   - Reload page
   - Glass Calendar maintains blur value
   - Slider shows correct position
   - Check localStorage key: `homepage_glass_calendar_blur`

4. **Interaction with Transparency:**
   - Toggle Transparent BG ON
   - Blur slider should still be visible
   - But blur won't be visible (transparency removes background)
   - Toggle Transparent BG OFF
   - Blur effect reappears at slider value

5. **Visual Quality:**
   - Smooth transitions as slider is moved
   - No performance issues with blur values
   - Blur applies to backdrop (content behind widget stays sharp)
   - Theme color accent on slider matches widget color

**Testing checklist:**
- [ ] Blur slider appears in Glass Calendar section
- [ ] Slider range 0-40px works correctly
- [ ] Value display shows current blur in pixels
- [ ] Real-time preview as slider is adjusted
- [ ] Blur persists after page reload
- [ ] Default value is 24px (current hardcoded value)
- [ ] Works independently from Transparent BG toggle
- [ ] No performance issues with high blur values
- [ ] Slider accent color matches Glass Calendar color

## Additional Notes

**Why this approach:**
- Maintains consistency with existing slider patterns
- 0-40px range provides full control from clear to heavy blur
- 24px default preserves current visual appearance
- Real-time preview helps users find their preferred blur amount

**Design Rationale:**
- Placed after Transparent BG toggle (logical grouping - both affect background)
- Placed before Widget Size (visual properties before layout properties)
- Uses pixels instead of percentage (more intuitive for blur)
- Icon: LayoutGrid (same as other sliders for consistency)

**Performance Considerations:**
- CSS backdrop-filter is GPU-accelerated
- Blur values 0-40px perform well on modern browsers
- Real-time updates are smooth (no debouncing needed)

**User Experience:**
- Slider is only visible when Glass Calendar is toggled ON
- When Transparent BG is ON, blur has no visible effect (background is removed)
- Users can adjust blur to match their wallpaper brightness/complexity
- Lower blur for vibrant wallpapers, higher blur for busy/distracting backgrounds

**Future Enhancements (not in this implementation):**
- Add blur slider to Ethereal Glass Clock (currently no background to blur)
- Add blur presets (Light, Medium, Heavy)
- Link blur to wallpaper brightness detection (auto-adjust)
