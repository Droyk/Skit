(function () {
    'use strict';
    // The "Pulse" - if you see this in F12, the script survived line 1
    console.log('--- [SPOTIFY-AD-SKIP] Script Injected & Running ---');

    var _fetch = window.fetch;
    window.fetch = function() {
        var args = arguments;
        var url = args[0];
        if (typeof url === 'object') url = url.url;

        // Surgical Check: Only touch the ad-logic JSON
        if (typeof url === 'string' && url.indexOf('spclient') > -1 && url.indexOf('ad-logic') > -1) {
            return _fetch.apply(this, args).then(function(response) {
                return response.clone().json().then(function(data) {
                    // Clean the data without breaking the object structure
                    if (data.adSlots) data.adSlots = [];
                    if (data.ads) data.ads = [];
                    return new Response(JSON.stringify(data), {
                        status: response.status,
                        headers: response.headers
                    });
                }).catch(function() { 
                    return response; // Not JSON? Return untouched to prevent SyntaxError
                });
            });
        }
        return _fetch.apply(this, args);
    };

    // DOM Skipper
    var checkAd = function() {
        var skipBtn = document.querySelector('[data-testid="control-button-skip-forward"]');
        var adLabel = document.querySelector('[data-testid="ad-label"], .encore-advertising-set');
        if (adLabel && skipBtn && !skipBtn.disabled) {
            skipBtn.click();
        }
    };

    setInterval(checkAd, 1000);
})();
