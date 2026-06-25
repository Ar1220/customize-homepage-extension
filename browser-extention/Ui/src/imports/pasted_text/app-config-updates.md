We are ready to fix our bright wallpaper visibility defects and add advanced widget customization controls. To prevent timeout limits or "Something went wrong" validation crashes, implement these features sequentially using our established storageBridge patterns.

Please execute the following updates across our application:

1. PERSISTENT STATE REGISTRATION (src/app/App.tsx)
Register the following state variables with their defaults and wire them into our asynchronous 'storageBridge' hydration matrix:
- 'etherealClockTextColor' (string, default: "#ffffff")
- 'etherealClockStrokeEnabled' (boolean, default: false)
- 'etherealClockStrokeColor' (string, default: "#c58bf2")
- 'calendarTextColor' (string, default: "#ffffff")
- 'calendarStrokeEnabled' (boolean, default: false)
- 'calendarStrokeColor' (string, default: "#c58bf2")
- 'sidebarBgOpacity' (number, default: 30, scale: 10-100)
- 'searchBarBgOpacity' (number, default: 40, scale: 0-100)
- 'spacebarSearchEnabled' (boolean, default: false)

2. ETHEREAL GLASS CLOCK EXTENSIONS & OUTLINE REFINEMENTS
- Update 'src/app/components/EtherealClock.tsx' to accept: etherealClockTextColor, etherealClockStrokeEnabled, and etherealClockStrokeColor.
- Apply 'etherealClockTextColor' directly to the time digits.
- For the date section ("Wednesday, June 10"), implement inline style text-stroke modification. If 'etherealClockStrokeEnabled' is true, apply:
  style={{
    color: etherealClockTextColor,
    WebkitTextStroke: `1px ${etherealClockStrokeColor}`,
    textShadow: `0 0 4px ${etherealClockStrokeColor}40`
  }}
- In 'src/app/components/WidgetsPanel.tsx', inside the Ethereal Clock section, add:
  * A color picker row for "Numbers Text Color" mapped to 'etherealClockTextColor'.
  * A inline toggle switch labeled "Text Outline Border".
  * A conditional color picker section for "Outline Border Color" mapped to 'etherealClockStrokeColor'.

3. GLASS CALENDAR & NOTES OUTLINE REFINEMENTS
- Update 'src/app/components/GlassCalendar.tsx' to accept: calendarTextColor, calendarStrokeEnabled, and calendarStrokeColor.
- Apply this outline logic to: the main month header ("June 2026"), the week headers ("SUN", "MON", etc.), and the "Upcoming Notes" title string.
- If 'calendarStrokeEnabled' is true, apply:
  style={{
    color: calendarTextColor,
    WebkitTextStroke: `1px ${calendarStrokeColor}`
  }}
- In 'src/app/components/WidgetsPanel.tsx', inside the Glass Calendar section, add:
  * A color picker row for "Text Color Override" mapped to 'calendarTextColor'.
  * A toggle row labeled "Enable Text Outlines".
  * A color picker row for "Outline Border Color" mapped to 'calendarStrokeColor'.

4. SIDE DOCK TRANSPARENCY & DARKNESS REFACTOR
- In the Side Dock / Right Sidebar container, fix white wallpaper blending by implementing a dark-glass alpha-blended layer.
- Instead of modifying the master element opacity (which fades out icons), link the background color to our numeric state using an RGBA string computation:
  style={{ backgroundColor: `rgba(15, 15, 15, ${sidebarBgOpacity / 100})` }}
- This ensures the panel background can become safely darker (defaulting to 25%-30% tint) while keeping your functional shortcut icons 100% crisp and visible.
- In 'src/app/components/WidgetsPanel.tsx', add an interactive volume-style range slider labeled "Sidebar Tint Darkness" (min 10, max 90, step 5) linked directly to 'sidebarBgOpacity'.

5. SEARCH BAR OPACITY FIX & SPACEBAR TOGGLE SUMMONING
- Fix Opacity Inheritance Bug: In 'SearchWidget.tsx' and 'SpotlightSearch.tsx', do NOT apply the opacity style to the parent container node. Instead, apply 'searchBarBgOpacity' exclusively to the glass container background style via:
  style={{ backgroundColor: `rgba(20, 20, 20, ${searchBarBgOpacity / 100})` }}
  Keep input text field color styling strictly opaque (#ffffff) so user text input never fades out.
- Spacebar Summon Trigger: In 'src/app/App.tsx', implement a global window event listener monitoring keydowns. If 'spacebarSearchEnabled' is true and the active document focused element is NOT an input or textarea, intercept the 'Space' keypress event ('e.code === "Space"'), trigger 'e.preventDefault()', and toggle our Spotlight Search visibility layer open.
- In 'src/app/components/WidgetsPanel.tsx', add a range slider control labeled "Search Box Transparency" linked to 'searchBarBgOpacity'. Below it, insert a toggle row labeled "Summon Search via Spacebar" linked to 'spacebarSearchEnabled'.

6. SETTINGS GEAR ICON HOVER SMOOTHING
- In the launcher node wrapper (bottom right corner), wrap our floating launcher gear component in a parent container assigned the Tailwind 'group' class.
- Set the default base state of our gear SVG icon node to 'opacity-20 cursor-pointer transition-all duration-300 ease-in-out'.
- Add the smooth hover transition class: 'group-hover:opacity-100'. This ensures the gear icon stays cleanly hidden when the cursor is away, but fades into view perfectly the moment a user moves their mouse over the outer interactive ring area.

Once all states, style objects, and panel sliders are mounted, execute an assembly verification check via 'npm run build' to sign off on a flawless compilation.