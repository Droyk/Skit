/// spotify-ad-skip.js
(function () {
    'use strict';
    console.log('--- [SUCCESS] Spotify Surgical-Skip Active ---');

    // 1. SURGICAL JSON PRUNER
    // Instead of blocking fetch, we wait for the response and delete the ads property.
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        const url = args[0]?.url || args[0];

        // Only target the specific spclient ad-logic endpoints
        if (typeof url === 'string' && url.includes('spclient') && url.includes('ad-logic')) {
            const clone = response.clone();
            try {
                const data = await clone.json();
                // We don't delete the whole response, we just empty the ad slots.
                if (data.adSlots) data.adSlots = [];
                if (data.ads) data.ads = [];
                
                return new Response(JSON.stringify(data), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            } catch (e) {
                return response; // If it's not JSON (like a script chunk), return it UNTOUCHED
            }
        }
        return response;
    };

    // 2. DOM-BASED SKIPPER (Keep your working observer)
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
                skipBtn.click();
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
