# Space Idle - Fixes Applied

## Version History

### v1.2 (2026-02-03) - UI Performance Fix
**Problem:** Cards were jittery/unstable when hovering and clicking

**Root Cause:** 
- DOM elements were being destroyed and recreated every game loop tick
- This caused layout shifts and made clicks unreliable

**Solution:**
- Implemented efficient DOM updates - cards are created once on page load
- Text content updates in-place without recreating elements
- Removed hover transform animation that was causing shifts
- Reduced unnecessary re-renders

**Technical Details:**
- `renderUpgrades()` and `renderGenerators()` now only run once on initialization
- `updateCards()` updates text content directly without DOM recreation
- Only achievements are re-rendered (they change rarely)

**Result:** Smooth, responsive UI with no jitter

---

### v1.1 (2026-02-03) - Initial UI Fixes
- Removed hover transform on cards
- Reduced re-rendering frequency from 100ms to 500ms

---

### v1.0 (2026-02-03) - Initial Release
- Complete idle game with upgrades, generators, achievements, and prestige
