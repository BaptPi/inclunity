/* ============================================================
   INCLUNITY — main.js
   Navigation + thème + micro-interactions + logique par page.
   Header/footer sont en HTML simple dans chaque fichier : ce
   script ne fait qu'ajouter du comportement, jamais le menu lui-même.
   ============================================================ */
   (function () {
    'use strict';

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- MENU (une seule logique) ---------- */
    var header = document.getElementById('header');
    var burger = document.getElementById('hamburger');
    var nav    = document.getElementById('nav');

    if (header && burger && nav) {
        var closeMenu = function () {
            nav.classList.remove('open');
            burger.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
            burger.setAttribute('aria-label', 'Open menu');
        };
        burger.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = nav.classList.toggle('open');
            burger.classList.toggle('open', open);
            burger.setAttribute('aria-expanded', String(open));
            burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });
        nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
        document.addEventListener('click', function (e) { if (!header.contains(e.target)) closeMenu(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    }

    /* ---------- THÈME (avec mémorisation) ---------- */
    var toggle = document.getElementById('theme-toggle');
    function storedTheme() {
        try { return localStorage.getItem('inclunity-theme'); } catch (e) { return null; }
    }
    function setTheme(t, persist) {
        document.documentElement.setAttribute('data-theme', t);
        if (persist) { try { localStorage.setItem('inclunity-theme', t); } catch (e) {} }
    }
    setTheme(storedTheme() || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'), false);
    if (toggle) {
        toggle.addEventListener('click', function () {
            var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setTheme(next, true);
        });
    }

    /* ---------- SCROLL : ombre header + back-to-top (rAF) ---------- */
    var totop = document.getElementById('totop');
    var ticking = false;
    function onScroll() {
        var s = window.scrollY;
        if (header) header.classList.toggle('scrolled', s > 20);
        if (totop) totop.classList.toggle('show', s > 500);
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();
    if (totop) totop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });

    /* ---------- APPARITIONS AU SCROLL ---------- */
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length && 'IntersectionObserver' in window && !reduce) {
        var ro = new IntersectionObserver(function (es) {
            es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
        }, { threshold: 0.15 });
        reveals.forEach(function (el) { ro.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- COMPTEURS ANIMÉS ---------- */
    function animateCount(el) {
        var target = parseInt(el.dataset.count, 10) || 0;
        var suffix = el.dataset.suffix || '';
        var start = null, dur = 1700;
        function frame(ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
            if (p < 1) window.requestAnimationFrame(frame);
        }
        window.requestAnimationFrame(frame);
    }
    var counters = document.querySelectorAll('.n[data-count]');
    if (counters.length && 'IntersectionObserver' in window && !reduce) {
        var co = new IntersectionObserver(function (es) {
            es.forEach(function (en) { if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); } });
        }, { threshold: 0.5 });
        counters.forEach(function (el) { co.observe(el); });
    } else {
        counters.forEach(function (el) { el.textContent = (parseInt(el.dataset.count, 10) || 0).toLocaleString('en-US') + (el.dataset.suffix || ''); });
    }

    /* ---------- TOAST ---------- */
    var toastWrap = document.getElementById('toast-container');
    if (!toastWrap) { toastWrap = document.createElement('div'); toastWrap.id = 'toast-container'; document.body.appendChild(toastWrap); }
    function showToast(msg, type, duration) {
        type = type || 'default'; duration = duration || 4000;
        var t = document.createElement('div');
        t.className = 'toast ' + type;
        t.setAttribute('role', 'status');
        t.textContent = msg;
        toastWrap.appendChild(t);
        requestAnimationFrame(function () { requestAnimationFrame(function () { t.classList.add('show'); }); });
        setTimeout(function () {
            t.classList.remove('show');
            t.addEventListener('transitionend', function () { t.remove(); }, { once: true });
        }, duration);
    }

    /* ---------- NEWSLETTER ---------- */
    var nlForm = document.getElementById('newsletter-form');
    if (nlForm) {
        nlForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = nlForm.querySelector('input[type="email"]');
            if (email && email.value.trim()) { showToast('🎉 Thank you! You\'ll receive our next impact report.', 'success'); nlForm.reset(); }
        });
    }

    /* ---------- BOUTONS "APPLY NOW" ---------- */
    document.querySelectorAll('[data-apply]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            var card = a.closest('.card') || document;
            var title = card.querySelector('h3');
            showToast('📩 Redirecting to application for ' + (title ? title.textContent : 'this position') + '…', 'info');
        });
    });

    /* ---------- BOUTON "REGISTER" (event) ---------- */
    var regBtn = document.getElementById('register-btn');
    if (regBtn) {
        regBtn.addEventListener('click', function () { showToast('🎬 You\'re registered! Check your email for details.', 'success'); });
    }

    /* ---------- COUNTDOWN (event) ---------- */
    var countdown = document.getElementById('countdown');
    if (countdown) {
        var target = new Date('2026-06-26T09:00:00');
        var pad = function (n) { return String(n).padStart(2, '0'); };
        var cdD = document.getElementById('cd-days');
        var cdH = document.getElementById('cd-hours');
        var cdM = document.getElementById('cd-min');
        var cdS = document.getElementById('cd-sec');
        var tick = function () {
            var diff = target - new Date();
            if (diff <= 0) {
                countdown.innerHTML = '<p style="color:var(--accent);font-size:1.4rem;font-weight:700;">🔴 Live Now!</p>';
                clearInterval(timer); return;
            }
            cdD.textContent = pad(Math.floor(diff / 86400000));
            cdH.textContent = pad(Math.floor((diff % 86400000) / 3600000));
            cdM.textContent = pad(Math.floor((diff % 3600000) / 60000));
            cdS.textContent = pad(Math.floor((diff % 60000) / 1000));
        };
        tick();
        var timer = setInterval(tick, 1000);
    }

    /* ---------- FORMULAIRE CONTRIBUTION (jobs) ---------- */
    var contributeCards  = document.querySelectorAll('.contrib-card');
    var dynamicFields    = document.getElementById('dynamic-fields');
    var contribForm      = document.getElementById('contribute-form');
    var submitBtn        = contribForm ? contribForm.querySelector('.contrib-submit') : null;
    var selectedCategory = document.getElementById('selected-category');

    var fieldConfigs = {
        skills:   { icon: 'fa-chalkboard-user', title: 'Skills & Teaching', fields: [
            { id: 'skill-domain', label: 'Your field', type: 'text', placeholder: 'e.g. English, Python…' },
            { id: 'skill-format', label: 'Format', type: 'select', options: ['Online live', 'Pre-recorded', 'In-person', '1-on-1 mentoring'] },
            { id: 'skill-avail',  label: 'Weekly availability', type: 'text', placeholder: 'e.g. 2h weekends' },
            { id: 'skill-level',  label: 'Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced', 'All'] },
            { id: 'skill-detail', label: 'Additional details', type: 'textarea', placeholder: 'Tell us more…', full: true } ] },
        goods:    { icon: 'fa-box-open', title: 'Goods & Equipment', fields: [
            { id: 'goods-type', label: 'Type', type: 'text', placeholder: 'Clothing, Computers…' },
            { id: 'goods-qty',  label: 'Quantity', type: 'text', placeholder: 'e.g. 5 boxes' },
            { id: 'goods-cond', label: 'Condition', type: 'select', options: ['New', 'Like new', 'Good', 'Acceptable'] },
            { id: 'goods-ship', label: 'Pickup / delivery', type: 'select', options: ['Pickup only', 'Local delivery', 'Can ship'] },
            { id: 'goods-desc', label: 'Details', type: 'textarea', placeholder: 'Photos, location…', full: true } ] },
        services: { icon: 'fa-handshake', title: 'Services & Pro Bono', fields: [
            { id: 'svc-type',  label: 'Service', type: 'text', placeholder: 'Legal, Medical, Translation…' },
            { id: 'svc-hours', label: 'Hours/month', type: 'text', placeholder: 'e.g. 4h' },
            { id: 'svc-dur',   label: 'Duration', type: 'select', options: ['One-time', '1-3 months', '3-6 months', 'Ongoing'] },
            { id: 'svc-mode',  label: 'Mode', type: 'select', options: ['Remote', 'In-person', 'Both'] },
            { id: 'svc-desc',  label: 'Describe your offer', type: 'textarea', placeholder: 'What can you bring?', full: true } ] },
        funding:  { icon: 'fa-circle-dollar-to-slot', title: 'Funding & Donations', fields: [
            { id: 'fund-type', label: 'Type', type: 'select', options: ['One-time', 'Monthly', 'Project sponsorship', 'Corporate grant'] },
            { id: 'fund-amt',  label: 'Amount (USD)', type: 'text', placeholder: 'e.g. 500' },
            { id: 'fund-dest', label: 'Destination', type: 'select', options: ['Where most needed', 'Housing', 'E-Learning', 'Healthcare'] },
            { id: 'fund-msg',  label: 'Message', type: 'textarea', placeholder: 'Any notes…', full: true } ] },
        other:    { icon: 'fa-lightbulb', title: 'My Own Idea', fields: [
            { id: 'idea-title', label: 'Title', type: 'text', placeholder: 'Short name' },
            { id: 'idea-reach', label: 'Estimated reach', type: 'text', placeholder: 'How many people?' },
            { id: 'idea-desc',  label: 'Describe your idea', type: 'textarea', placeholder: 'What problem does it solve?', full: true } ] }
    };

    function esc(s) { return String(s).replace(/"/g, '&quot;'); }

    function buildFields(type) {
        if (!dynamicFields) return;
        var cfg = fieldConfigs[type];
        if (!cfg) return;
        var html = '<div class="fields-header"><i class="fa-solid ' + cfg.icon + '" aria-hidden="true"></i>' + cfg.title + '</div><div class="fields-grid">';
        cfg.fields.filter(function (f) { return !f.full; }).forEach(function (f) {
            html += '<div class="field-group"><label for="' + f.id + '">' + f.label + '</label>';
            if (f.type === 'select') {
                html += '<select id="' + f.id + '" name="' + f.id + '">' + f.options.map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select>';
            } else if (f.type === 'textarea') {
                html += '<textarea id="' + f.id + '" name="' + f.id + '" rows="3" placeholder="' + esc(f.placeholder) + '"></textarea>';
            } else {
                html += '<input type="text" id="' + f.id + '" name="' + f.id + '" placeholder="' + esc(f.placeholder) + '">';
            }
            html += '</div>';
        });
        html += '</div>';
        cfg.fields.filter(function (f) { return f.full; }).forEach(function (f) {
            html += '<div class="field-group full"><label for="' + f.id + '">' + f.label + '</label><textarea id="' + f.id + '" name="' + f.id + '" rows="4" placeholder="' + esc(f.placeholder) + '"></textarea></div>';
        });
        html += '<div class="contact-fields"><div class="field-group"><label for="c-name">Your name</label><input type="text" id="c-name" name="name" autocomplete="name" placeholder="Sophie Martin" required></div><div class="field-group"><label for="c-email">Your email</label><input type="email" id="c-email" name="email" autocomplete="email" placeholder="sophie@example.com" required></div></div>';
        dynamicFields.innerHTML = html;
        dynamicFields.classList.add('visible');
        if (submitBtn) submitBtn.style.display = 'inline-flex';
        if (window.innerWidth <= 768) setTimeout(function () { dynamicFields.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 350);
    }

    contributeCards.forEach(function (card) {
        function activate() {
            contributeCards.forEach(function (c) { c.classList.remove('selected'); c.setAttribute('aria-pressed', 'false'); });
            card.classList.add('selected'); card.setAttribute('aria-pressed', 'true');
            if (selectedCategory) selectedCategory.value = card.dataset.type;
            buildFields(card.dataset.type);
        }
        card.setAttribute('aria-pressed', 'false');
        card.addEventListener('click', activate);
        card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    });

    if (contribForm) {
        contribForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = document.getElementById('c-name'), email = document.getElementById('c-email');
            if (!name || !name.value.trim() || !email || !email.value.trim()) { showToast('Please fill in your name and email.', 'default'); return; }
            if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending…'; }
            setTimeout(function () {
                showToast('✅ Thank you ' + name.value.trim() + '! We\'ll be in touch soon.', 'success', 6000);
                contribForm.reset();
                contributeCards.forEach(function (c) { c.classList.remove('selected'); c.setAttribute('aria-pressed', 'false'); });
                if (dynamicFields) { dynamicFields.classList.remove('visible'); dynamicFields.innerHTML = ''; }
                if (submitBtn) { submitBtn.disabled = false; submitBtn.style.display = 'none'; submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Submit my contribution'; }
            }, 1200);
        });
    }

})();