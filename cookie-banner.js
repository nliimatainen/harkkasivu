/**
 * Evästebanneri - Suomen lainsäädännön mukainen
 * Traficomin ohjeistus: hylkäämisen tulee olla yhtä helppoa kuin hyväksymisen
 * Google Analytics 4 ladataan vain käyttäjän suostumuksella
 */
(function() {
    'use strict';

    // --- Google Analytics -latausfunktio ---
    // Vaihda 'G-XXXXXXXXXX' omalla Measurement ID:lläsi
    var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

    function loadAnalytics() {
        if (window._gaLoaded) return;
        window._gaLoaded = true;

        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
    }

    // Tarkista onko käyttäjä jo antanut suostumuksen
    var consent = localStorage.getItem('cookie-consent');
    if (consent === 'all') {
        loadAnalytics();
        return;
    }
    if (consent === 'necessary') return;

    // Luo bannerin HTML
    var banner = document.createElement('div');
    banner.className = 'cookie-banner visible';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Evästeasetukset');
    banner.innerHTML =
        '<div class="container">' +
            '<p>Käytämme evästeitä sivuston toiminnan varmistamiseen ja kävijäliikenteen analysointiin. ' +
            'Välttämättömät evästeet ovat aina käytössä. Analytiikkaevästeet otetaan käyttöön vain suostumuksellasi. ' +
            '<a href="tietosuojaseloste.html">Lue lisää tietosuojaselosteestamme</a>.</p>' +
            '<div class="cookie-buttons">' +
                '<button class="cookie-btn-accept" id="cookieAccept">Hyväksy kaikki</button>' +
                '<button class="cookie-btn-reject" id="cookieReject">Vain välttämättömät</button>' +
            '</div>' +
        '</div>';

    document.body.appendChild(banner);

    // Hyväksy kaikki evästeet → lataa GA
    document.getElementById('cookieAccept').addEventListener('click', function() {
        localStorage.setItem('cookie-consent', 'all');
        banner.classList.remove('visible');
        loadAnalytics();
    });

    // Vain välttämättömät evästeet
    document.getElementById('cookieReject').addEventListener('click', function() {
        localStorage.setItem('cookie-consent', 'necessary');
        banner.classList.remove('visible');
    });
})();
