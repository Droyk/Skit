/// spotify-ad-skip.js
/// alias sas.js
(function () {
    'use strict';
    
    // 1. Set a global flag so we can verify injection without fetch-wrappers
    window.__SPOTIFY_SKIP_ACTIVE__ = true;
    console.log('--- [SUCCESS] Spotify Stable-Skip Active ---');

    // 2. The Internal State Fix: Many ads trigger because of these flags
    const disableAds = () => {
        if (window.ads && window.ads.adSlots) window.ads.adSlots = [];
        if (window.models && window.models.ads) window.models.ads = {};
    };

    // 3. The Robust DOM Skipper
    const skipAd = () => {
        const adLabel = document.querySelector('[data-testid="ad-label"], .encore-advertising-set');
        const skipBtn = document.querySelector('[data-testid="control-button-skip-forward"]');
        
        if (adLabel && skipBtn && !skipBtn.disabled) {
            console.log('[SPOTIFY-SKIP] Ad UI detected -> Clicking skip');
            skipBtn.click();
        }
    };

    // Run every 500ms to be faster than the ad-load logic
    setInterval(() => {
        disableAds();
        skipAd();
    }, 500);

    // 4. Fix for the MutationObserver 'parameter 1 is not of type Node' error
    // We wait for the document to be ready before observing
    const initObserver = () => {
        const target = document.body || document.documentElement;
        if (!target) return setTimeout(initObserver, 100);
        
        const observer = new MutationObserver(skipAd);
        observer.observe(target, { childList: true, subtree: true });
    };
    initObserver();
})();
