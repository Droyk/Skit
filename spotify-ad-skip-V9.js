/// spotify-ad-skip-V9.js
/// alias sas.js

// 1. Diagnostic: Red Border & Global Flag
if (document.documentElement) {
    document.documentElement.style.border = "5px solid red";
}
window.SKIT_VER = "9.0-UNWRAPPED";
console.log("!!! V9 SCRIPT EXECUTING !!!");

// 2. Iframe Guard
if (window.top === window.self) {

    // 3. The "State Killer"
    const killAds = () => {
        if (window.ads) {
            window.ads.adSlots = [];
            window.ads.ads = [];
        }
    };

    // 4. The "Surgical Skipper"
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
        
        setInterval(() => {
            killAds();
            skip();
        }, 500);

        new MutationObserver(skip).observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    };

    init();
}
