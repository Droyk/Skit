/// skit

// 1. Visual & Console Proof
if (document.documentElement) {
    document.documentElement.style.border = "5px solid red";
}
window.SKIT_VER = "10.0-FINAL";
console.log("!!! SKIT V10 EXECUTING !!!");

// 2. Logic (Only in main window)
if (window.top === window.self) {
    const killAds = () => {
        if (window.ads) {
            window.ads.adSlots = [];
            window.ads.ads = [];
        }
    };

    const skip = () => {
        const adLabel = document.querySelector('[data-testid="ad-label"], .encore-advertising-set');
        const skipBtn = document.querySelector('[data-testid="control-button-skip-forward"]');
        
        if (adLabel && skipBtn && !skipBtn.disabled) {
            console.log('[SKIT] Ad identified -> Skipping');
            skipBtn.click();
        }
    };

    const init = () => {
        if (!document.body) return setTimeout(init, 100);
        setInterval(() => { killAds(); skip(); }, 500);
        new MutationObserver(skip).observe(document.body, { childList: true, subtree: true });
    };
    
    init();
}
