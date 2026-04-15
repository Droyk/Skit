(function() {
    'use strict';
    console.log('--- LOG: SCRIPT START ---');
    const skipAd = () => {
        const btn = document.querySelector('[data-testid="control-button-skip-forward"]');
        if (btn && !btn.disabled && document.querySelector('[data-testid="ad-label"], .encore-advertising-set')) {
            console.log('--- LOG: AD SKIP CLICKED ---');
            btn.click();
        }
    };
    setInterval(skipAd, 1000);
    console.log('--- LOG: SCRIPT FULLY LOADED ---');
})();
