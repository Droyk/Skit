/// spotify-ad-skip.js
/// alias sas.js
(function () {
    'use strict';
    
    // 1. Create a "Secret Flag" we can check in the console
    window.__SKIT_ACTIVE__ = true; 
    console.log('--- [SPOTIFY-AD-SKIP] Global Flag Set: window.__SKIT_ACTIVE__ ---');

    var _fetch = window.fetch;
    window.fetch = function() {
        var args = arguments;
        var url = (typeof args[0] === 'string') ? args[0] : (args[0] && args[0].url);

        // 2. ULTRA-SPECIFIC FILTER: 
        // Only intercept if it's 'spclient' AND 'ad-logic' (this avoids audio/scripts)
        if (url && url.indexOf('spclient') > -1 && url.indexOf('ad-logic') > -1) {
            return _fetch.apply(this, args).then(function(response) {
                // 3. SECURE CHECK: Only parse if the server says it's actually JSON
                var contentType = response.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') > -1) {
                    return response.clone().json().then(function(data) {
                        if (data.adSlots) data.adSlots = [];
                        if (data.ads) data.ads = [];
                        return new Response(JSON.stringify(data), {
                            status: response.status,
                            headers: response.headers
                        });
                    }).catch(function() { return response; });
                }
                return response;
            });
        }
        return _fetch.apply(this, args);
    };

    // 4. DOM SKIPPER (Improved)
    setInterval(function() {
        var skipBtn = document.querySelector('[data-testid="control-button-skip-forward"]');
        var isAd = !!document.querySelector('[data-testid="ad-label"], .encore-advertising-set');
        if (isAd && skipBtn && !skipBtn.disabled) {
            skipBtn.click();
            console.log('[SPOTIFY-AD-SKIP] Ad Detected -> Skip Clicked');
        }
    }, 500);
})();
