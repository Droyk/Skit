/// spotify-ad-skip.js
(function () {
    'use strict';
    // If you see this, the script is LOADED but NOT interfering with network calls.
    console.log('--- [SUCCESS] Spotify DOM-Skip Logic Active ---');

    const AD_SELECTORS = [
        '[data-testid="ad-label"]',
        '[aria-label*="Advertisement" i]',
        '[data-testid="advertisement"]',
        '.encore-advertising-set'
    ];

    const observer = new MutationObserver(() => {
        const hasAd = AD_SELECTORS.some(sel => document.querySelector(sel));
        if (hasAd) {
            const skipBtn = document.querySelector('[data-testid="control-button-skip-forward"]');
            if (skipBtn && !skipBtn.disabled) {
                console.log('Ad detected. Skipping...');
                skipBtn.click();
            }
        }
    });

    // Start observing immediately
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
