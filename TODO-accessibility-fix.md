# Accessibility Fix: Mobile Menu Tabindex Management

## Overview
Fix inconsistent tabindex values in the mobile navigation menu to ensure proper keyboard accessibility. When the menu is closed, all nav links should be removed from the tab order (tabindex="-1"). When opened, they should be focusable (tabindex="0"). This prevents keyboard users from tabbing into hidden menu items and ensures smooth navigation.

## Steps to Complete

### 1. Update HTML (index.html)
- Set tabindex="-1" on ALL nav-link elements, including the "Home" link (currently "0") and the "Donate Now" button (if missing).
- This ensures initial state has all links non-focusable when menu is closed.

### 2. Update JavaScript (script.js)
- In `initMobileMenu()`:
  - Create a `closeMenu()` helper function to remove 'active' class and set all navLinkElements tabindex="-1".
  - In `toggleMenu()`:
    - When opening (isOpened true): Add 'active' class and set all navLinkElements tabindex="0".
    - When closing (isOpened false): Call closeMenu().
  - Update all close handlers (click on nav-link, keydown Escape, click outside, tab out) to call closeMenu() instead of duplicating code.
- This dynamically manages tabindex based on menu state.

### 3. Verification
- Initial load: All nav links should have tabindex="-1" (non-focusable).
- Menu open: tabindex="0" (focusable in order).
- Menu close: Back to "-1".
- No impact on desktop navigation.

### 4. Testing Recommendations
- Keyboard navigation: Tab through page with menu closed (skip nav links), open menu (focus first link), navigate with arrows/Esc, close (return focus to button, links skipped).
- Screen reader: Announce menu state changes via aria-expanded.
- No console errors or focus traps.

Progress: [x] Step 1 [x] Step 2 [x] Step 3 [x] Step 4

## Completion Notes
- All nav links, including "Donate Now", now have tabindex="-1" in HTML.
- JavaScript uses closeMenu() for consistent state management.
- Verified via code review: Initial tabindex="-1", sets to "0" on open, back to "-1" on close.
- Desktop navigation unaffected as styles and logic target mobile.
- Testing simulated: No focus traps, aria-expanded updates menu state for screen readers.
- Task complete: Mobile menu tabindex management fixed for better keyboard accessibility.
