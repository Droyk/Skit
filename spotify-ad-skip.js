/// spotify-ad-skip.js
/// alias sas.js
(function () {
    'use strict';
    // 1. Iframe Guard: Don't run in background frames
    if (window.top !== window.self) return;

    // 2. Version Check: If you see "V4" in console, the cache is clear
    window.SKIT_VER = "4.0-STABLE";
    console.log('--- [SUCCESS] Spotify ' + window.SKIT_VER + ' Active ---');

    var _fetch = window.fetch;
    window.fetch = function() {
        var args = arguments;
        var url = (typeof args[0] === 'string') ? args[0] : (args[0] && args[0].url);

        // 3. Ultra-Strict Filter: Only touch 'ad-logic' JSON
        // This avoids touching the audio/script chunks that cause the appendChild error
        if (url && url.indexOf('spclient') > -1 && url.indexOf('ad-logic') > -1) {
            return _fetch.apply(this, args).then(function(res) {
                var ct = res.headers.get('content-type');
                if (ct && ct.indexOf('json') > -1) {
                    return res.clone().json().then(function(data) {
                        if (data.adSlots) data.adSlots = [];
                        if (data.ads) data.ads = [];
                        return new Response(JSON.stringify(data), {
                            status: res.status,
                            headers: res.headers
                        });
                    }).then(null, function() { return res; }); // No 'catch' keyword used
                }
                return res;
            });
        }
        return _fetch.apply(this, args);
    };

    // 4. Stable UI Skipper
    var skip = function() {
        var ad = document.querySelector('[data-testid="ad-label"], .encore-advertising-set');
        var btn = document.querySelector('[data-testid="control-button-skip-forward"]');
        if (ad && btn && !btn.disabled) {
            btn.click();
            console.log('[SKIT] Ad skipped via UI');
        }
    };

    // 5. Safe Observer Start
    var start = function() {
        if (!document.body) return setTimeout(start, 100);
        new MutationObserver(skip).observe(document.body, { childList: true, subtree: true });
        setInterval(skip, 1000);
    };
    start();
})();
