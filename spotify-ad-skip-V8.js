/// spotify-ad-skip-V8.js
/// alias sas.js
(function () {
    'use strict';

    // 1. Diagnostic: Red Border & Global Flag
    if (document.documentElement) {
        document.documentElement.style.border = "5px solid red";
    }
    window.SKIT_VER = "8.0-ULTIMATE";
    console.log("!!! V7 SCRIPT EXECUTING !!!");

    // 2. Iframe Guard
    if (window.top !== window.self) return;

    // 3. The "State Killer": Disables ads by freezing the internal ad-objects
    const killAds = () => {
        if (window.ads) {
            window.ads.adSlots = [];
            window.ads.ads = [];
        }
    };

    // 4. The "Surgical Skipper": Fast & Light
    const skip = () => {
        const adLabel = document.querySelector('[data-testid="ad-label"], .encore-advertising-set');
        const skipBtn = document.querySelector('[data-testid="control-button-skip-forward"]');
        
        if (adLabel && skipBtn && !skipBtn.disabled) {
            console.log('[SKIT] Ad identified -> Skipping');
            skipBtn.click();
        }
    };

    // 5. Execution Loop
    const init = () => {
        if (!document.body) return setTimeout(init, 100);
        
        // Check every 500ms
        setInterval(() => {
            killAds();
            skip();
        }, 500);

        // Also watch for DOM changes
        new MutationObserver(skip).observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    };

    init();
})(); // <--- These closing brackets are the most important part!
