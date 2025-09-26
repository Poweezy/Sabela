# TODO: Implementation Steps for Website Enhancements

Based on the approved plan from TODO-enhancements.md, breaking down into logical steps. Will update progress as each step is completed.

## Section 1: Accessibility Enhancements (Remaining Items)
- [x] Step 1.1: Enhance focus indicators in style.css - Add more specific focus styles for modals, file upload, quiz options, and ensure visibility on all backgrounds.
- [x] Step 1.2: Audit and adjust color contrast in style.css - Verify WCAG AA compliance for all text/background combos; adjust variables if needed (e.g., --text-light usage).
- [x] Step 1.3: Improve keyboard navigation for mobile menu in script.js - Enhance existing keydown handlers for better tab/Enter/Space support; add ARIA roles if missing.

## Section 2: Performance Optimizations
- [x] Step 2.1: Minify CSS and JS files - npm run minify-all executed and completed.
- [x] Step 2.2: Update index.html to reference minified files (style.min.css, script.min.js, etc.).
- [x] Step 2.3: Implement lazy loading for all images in resources section - Ensure all <img> tags in index.html have loading="lazy".
- [ ] Step 2.4: Convert images to WebP format - Use ImageMagick or similar to convert local images (e.g., logo.png); update references.
- [ ] Step 2.5: Enhance service worker in sw.js - Add caching for minified files, more images, and API responses.
- [ ] Step 2.6: Optimize weather API calls with caching in script.js - Add localStorage caching for fetchWeatherData responses (e.g., cache for 5-10 min).

## Section 3: SEO Improvements
- [ ] Step 3.1: Enhance structured data (JSON-LD) in index.html - Add schema for sections (e.g., Organization events, articles).
- [ ] Step 3.2: Implement additional meta descriptions for sections if needed - Add more targeted metas.
- [ ] Step 3.3: Verify canonical URLs in index.html - Already present; ensure dynamic if multi-page.
- [ ] Step 3.4: Update XML sitemap.xml - Add any new pages/resources.
- [ ] Step 3.5: Optimize images - Ensure alt tags (mostly done); compress via command if needed.

## Later Sections (4-14)
- Defer for now: Interactive features (maps, gallery), Content Management (blog, etc.), and others until core sections complete. Will add steps post-Section 3.

## Testing & Followup
- After each section: Update TODO-enhancements.md to mark [x].
- Run Cypress tests: Update specs and execute npx cypress run.
- Browser verification: Use browser_action to test changes.
- Final: attempt_completion once all prioritized sections done.
