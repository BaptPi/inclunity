/* ============================================================
   INCLUNITY — components.js
   Composants réutilisables : <site-header> et <site-footer>.
   Source UNIQUE de vérité pour la navigation : supprime le bug
   du "double menu" (main.js + scripts inline en conflit) et
   centralise l'accessibilité (noms accessibles, attributs ARIA).
   ============================================================ */
   (function () {
    'use strict';

    /* Un seul endroit pour la structure du menu : on ajoute/retire
       une page ici, et les 7 fichiers HTML sont à jour. */
    var NAV_ITEMS = [
        { href: 'index.html',     label: 'Home' },
        { href: 'about.html',     label: 'Who Are We' },
        { href: 'missions.html',  label: 'Missions' },
        { href: 'event.html',     label: 'Event' },
        { href: 'program.html',   label: 'The Program' },
        { href: 'elearning.html', label: 'E-Learning' },
        { href: 'jobs.html',      label: 'Jobs' }
    ];

    var SOCIALS = [
        { href: '#', icon: 'fa-x-twitter', label: 'Twitter / X' },
        { href: '#', icon: 'fa-instagram', label: 'Instagram' },
        { href: '#', icon: 'fa-linkedin',  label: 'LinkedIn' },
        { href: '#', icon: 'fa-youtube',   label: 'YouTube' }
    ];

    function currentPage() {
        var file = window.location.pathname.split('/').pop();
        return (file && file.length) ? file : 'index.html';
    }

    /* ---------------------------------------------------------
       <site-header>
       --------------------------------------------------------- */
    function SiteHeader() {
        return Reflect.construct(HTMLElement, [], SiteHeader);
    }
    SiteHeader.prototype = Object.create(HTMLElement.prototype);
    SiteHeader.prototype.constructor = SiteHeader;

    SiteHeader.prototype.connectedCallback = function () {
        this.style.display = 'block'; // un custom element est inline par défaut

        var page = currentPage();
        var links = NAV_ITEMS.map(function (item) {
            var isActive = item.href === page;
            var attrs = isActive ? ' class="active" aria-current="page"' : '';
            return '<li><a href="' + item.href + '"' + attrs + '>' + item.label + '</a></li>';
        }).join('');

        this.innerHTML =
            '<header>' +
                '<nav>' +
                    '<a href="index.html" class="logo">' +
                        '<i class="fa-solid fa-hands-holding-circle" aria-hidden="true"></i> Inclunity' +
                    '</a>' +
                    '<div class="nav-actions">' +
                        '<a href="event.html" class="btn-donate nav-support">Support Us</a>' +
                        '<button class="hamburger" type="button" aria-label="Open menu" ' +
                                'aria-expanded="false" aria-controls="nav-menu">' +
                            '<span></span><span></span><span></span>' +
                        '</button>' +
                    '</div>' +
                    '<ul class="nav-links" id="nav-menu">' + links + '</ul>' +
                '</nav>' +
            '</header>';

        this._wireMenu();
    };

    SiteHeader.prototype._wireMenu = function () {
        var header = this.querySelector('header');
        var btn    = this.querySelector('.hamburger');
        var menu   = this.querySelector('.nav-links');
        if (!btn || !menu) { return; }

        function close() {
            menu.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-label', 'Open menu');
        }
        function toggle() {
            var open = menu.classList.toggle('open');
            btn.classList.toggle('open', open);
            btn.setAttribute('aria-expanded', String(open));
            btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        }

        btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
        menu.addEventListener('click', function (e) { if (e.target.closest('a')) { close(); } });
        document.addEventListener('click', function (e) { if (!header.contains(e.target)) { close(); } });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('open')) { close(); btn.focus(); }
        });
    };

    /* ---------------------------------------------------------
       <site-footer>
       --------------------------------------------------------- */
    function SiteFooter() {
        return Reflect.construct(HTMLElement, [], SiteFooter);
    }
    SiteFooter.prototype = Object.create(HTMLElement.prototype);
    SiteFooter.prototype.constructor = SiteFooter;

    SiteFooter.prototype.connectedCallback = function () {
        this.style.display = 'block';

        var socials = SOCIALS.map(function (s) {
            return '<a href="' + s.href + '" aria-label="' + s.label + '">' +
                       '<i class="fa-brands ' + s.icon + '" aria-hidden="true"></i>' +
                   '</a>';
        }).join('');

        this.innerHTML =
            '<footer>' +
                '<div class="footer-grid">' +
                    '<div>' +
                        '<h4>Inclunity Foundation</h4>' +
                        '<p style="color:#A0AEC0;">A global initiative empowering humanity since 2020.</p>' +
                        '<address style="margin-top:20px;font-size:0.9rem;color:#A0AEC0;line-height:2;font-style:normal;">' +
                            '<p><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Illustrative address &middot; fictional project</p>' +
                            '<p><i class="fa-solid fa-phone" aria-hidden="true"></i> +1 (800) 555-0100</p>' +
                            '<p><i class="fa-solid fa-envelope" aria-hidden="true"></i> contact@inclunity.org</p>' +
                        '</address>' +
                    '</div>' +
                    '<div>' +
                        '<h4>Quick Access</h4>' +
                        '<ul style="list-style:none;line-height:2.5;">' +
                            '<li><a href="about.html">Our History</a></li>' +
                            '<li><a href="program.html">System Details</a></li>' +
                            '<li><a href="elearning.html">Start Learning</a></li>' +
                            '<li><a href="jobs.html">Open Positions</a></li>' +
                        '</ul>' +
                    '</div>' +
                    '<div>' +
                        '<h4>Follow Our Impact</h4>' +
                        '<nav aria-label="Social media" style="display:flex;gap:20px;font-size:1.5rem;margin-top:15px;">' +
                            socials +
                        '</nav>' +
                    '</div>' +
                '</div>' +
                '<div class="copyright">' +
                    '&copy; 2026 Inclunity. All rights reserved. | ' +
                    '<a href="#" style="color:#A0AEC0;text-decoration:none;">Privacy Policy</a> | ' +
                    '<span style="opacity:0.8;"><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i> Fictional student project</span>' +
                '</div>' +
            '</footer>';
    };

    customElements.define('site-header', SiteHeader);
    customElements.define('site-footer', SiteFooter);
})();