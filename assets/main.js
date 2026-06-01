/* ============================================================
   INCLUNITY — main.js  (version propre)
   ============================================================ */
   (function () {
    'use strict';

    /* ------ SCROLL PROGRESS BAR ------ */
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.prepend(bar);

    /* ------ STICKY HEADER ------ */
    var header = document.querySelector('header');

    /* ------ HAMBURGER MENU ------ */
    var hamburger = document.querySelector('.hamburger');
    var navLinks  = document.querySelector('.nav-links');

    if (hamburger && navLinks) {

        hamburger.addEventListener('click', function () {
            var isOpen = navLinks.classList.toggle('nav-open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
        });

        /* Fermer quand on clique sur un lien */
        navLinks.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('nav-open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        /* Fermer en cliquant en dehors */
        document.addEventListener('click', function (e) {
            if (!header.contains(e.target) && navLinks.classList.contains('nav-open')) {
                navLinks.classList.remove('nav-open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        /* Fermer avec Escape */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('nav-open')) {
                navLinks.classList.remove('nav-open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.focus();
            }
        });
    }

    /* ------ SCROLL : header shadow + progress bar ------ */
    window.addEventListener('scroll', function () {
        var s = window.scrollY;
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (s / h) * 100 : 0) + '%';
        if (header) header.classList.toggle('scrolled', s > 50);
    }, { passive: true });

    /* ------ BOTTOM NAV MOBILE (injectée) ------ */
    var bottomNav = document.createElement('nav');
    bottomNav.className = 'mobile-bottom-nav';
    bottomNav.innerHTML = '<ul>' +
        '<li><a href="index.html" data-page="index"><i class="fa-solid fa-house"></i><span>Home</span></a></li>' +
        '<li><a href="missions.html" data-page="missions"><i class="fa-solid fa-bullseye"></i><span>Missions</span></a></li>' +
        '<li><a href="program.html" data-page="program"><i class="fa-solid fa-timeline"></i><span>Program</span></a></li>' +
        '<li><a href="elearning.html" data-page="elearning"><i class="fa-solid fa-graduation-cap"></i><span>Learn</span></a></li>' +
        '<li><a href="jobs.html" data-page="jobs"><i class="fa-solid fa-briefcase"></i><span>Jobs</span></a></li>' +
        '</ul>';
    document.body.appendChild(bottomNav);

    /* ------ FAB Support Us ------ */
    var fab = document.createElement('a');
    fab.href = 'event.html';
    fab.className = 'fab-support';
    fab.setAttribute('aria-label', 'Support Us');
    fab.innerHTML = '<i class="fa-solid fa-heart"></i>';
    document.body.appendChild(fab);

    /* ------ PAGE ACTIVE ------ */
    var page = window.location.pathname.split('/').pop().replace('.html', '') || 'index';

    document.querySelectorAll('.nav-links a').forEach(function (a) {
        var href = (a.getAttribute('href') || '').replace('.html', '');
        if (href === page || (page === '' && href === 'index')) a.classList.add('active');
    });

    bottomNav.querySelectorAll('a[data-page]').forEach(function (a) {
        if (a.dataset.page === page || (page === '' && a.dataset.page === 'index')) a.classList.add('active');
    });

    /* ------ FADE-IN AU SCROLL ------ */
    if ('IntersectionObserver' in window) {
        var fadeEls = document.querySelectorAll('.card, .timeline-item, .section-title, .section-subtitle, .contribute-card');
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, i) {
                if (entry.isIntersecting) {
                    setTimeout(function () {
                        entry.target.classList.remove('fade-in-hidden');
                        entry.target.classList.add('fade-in-visible');
                    }, (i % 5) * 80);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        fadeEls.forEach(function (el) {
            el.classList.add('fade-in-hidden');
            obs.observe(el);
        });
    }

    /* ------ TOAST ------ */
    var toastWrap = document.getElementById('toast-container');
    if (!toastWrap) {
        toastWrap = document.createElement('div');
        toastWrap.id = 'toast-container';
        document.body.appendChild(toastWrap);
    }

    function showToast(msg, type, duration) {
        type = type || 'default';
        duration = duration || 4000;
        var t = document.createElement('div');
        t.className = 'toast toast-' + type;
        t.textContent = msg;
        toastWrap.appendChild(t);
        requestAnimationFrame(function () {
            requestAnimationFrame(function () { t.classList.add('toast-show'); });
        });
        setTimeout(function () {
            t.classList.remove('toast-show');
            t.addEventListener('transitionend', function () { t.remove(); }, { once: true });
        }, duration);
    }

    /* ------ NEWSLETTER ------ */
    var nlForm = document.querySelector('.newsletter-form');
    if (nlForm) {
        nlForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = nlForm.querySelector('input[type="email"]');
            if (email && email.value.trim()) {
                showToast('🎉 Thank you! You\'ll receive our next impact report.', 'success');
                nlForm.reset();
            }
        });
    }

    /* ------ BOUTONS APPLY NOW ------ */
    document.querySelectorAll('a').forEach(function (a) {
        if (a.textContent.trim() === 'Apply Now') {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                var title = (a.closest('.card') || document).querySelector('h3');
                showToast('📩 Redirecting to application for ' + (title ? title.textContent : 'this position') + '…', 'info');
            });
        }
    });

    /* ------ BOUTON REGISTER EVENT ------ */
    document.querySelectorAll('button').forEach(function (btn) {
        if (btn.textContent.includes('Register for the Broadcast')) {
            btn.addEventListener('click', function () {
                showToast('🎬 You\'re registered! Check your email for details.', 'success');
            });
        }
    });

    /* ------ FORMULAIRE CONTRIBUTION (jobs.html) ------ */
    var contributeCards  = document.querySelectorAll('.contribute-card');
    var dynamicFields    = document.getElementById('dynamic-fields');
    var submitBtn        = document.querySelector('.contrib-submit');
    var selectedCategory = document.getElementById('selected-category');

    var fieldConfigs = {
        skills:   { icon: 'fa-chalkboard-user', title: 'Skills & Teaching',
            fields: [
                { id: 'skill-domain', label: 'Your field', type: 'text', placeholder: 'e.g. English, Python…' },
                { id: 'skill-format', label: 'Format', type: 'select', options: ['Online live', 'Pre-recorded', 'In-person', '1-on-1 mentoring'] },
                { id: 'skill-avail',  label: 'Weekly availability', type: 'text', placeholder: 'e.g. 2h weekends' },
                { id: 'skill-level',  label: 'Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced', 'All'] },
                { id: 'skill-detail', label: 'Additional details', type: 'textarea', placeholder: 'Tell us more…', full: true }
            ]},
        goods:    { icon: 'fa-box-open', title: 'Goods & Equipment',
            fields: [
                { id: 'goods-type', label: 'Type', type: 'text', placeholder: 'Clothing, Computers…' },
                { id: 'goods-qty',  label: 'Quantity', type: 'text', placeholder: 'e.g. 5 boxes' },
                { id: 'goods-cond', label: 'Condition', type: 'select', options: ['New', 'Like new', 'Good', 'Acceptable'] },
                { id: 'goods-ship', label: 'Pickup / delivery', type: 'select', options: ['Pickup only', 'Local delivery', 'Can ship'] },
                { id: 'goods-desc', label: 'Details', type: 'textarea', placeholder: 'Photos, location…', full: true }
            ]},
        services: { icon: 'fa-handshake', title: 'Services & Pro Bono',
            fields: [
                { id: 'svc-type',   label: 'Service', type: 'text', placeholder: 'Legal, Medical, Translation…' },
                { id: 'svc-hours',  label: 'Hours/month', type: 'text', placeholder: 'e.g. 4h' },
                { id: 'svc-dur',    label: 'Duration', type: 'select', options: ['One-time', '1-3 months', '3-6 months', 'Ongoing'] },
                { id: 'svc-mode',   label: 'Mode', type: 'select', options: ['Remote', 'In-person', 'Both'] },
                { id: 'svc-desc',   label: 'Describe your offer', type: 'textarea', placeholder: 'What can you bring?', full: true }
            ]},
        funding:  { icon: 'fa-circle-dollar-to-slot', title: 'Funding & Donations',
            fields: [
                { id: 'fund-type',  label: 'Type', type: 'select', options: ['One-time', 'Monthly', 'Project sponsorship', 'Corporate grant'] },
                { id: 'fund-amt',   label: 'Amount (USD)', type: 'text', placeholder: 'e.g. 500' },
                { id: 'fund-dest',  label: 'Destination', type: 'select', options: ['Where most needed', 'Housing', 'E-Learning', 'Healthcare'] },
                { id: 'fund-msg',   label: 'Message', type: 'textarea', placeholder: 'Any notes…', full: true }
            ]},
        other:    { icon: 'fa-lightbulb', title: 'My Own Idea',
            fields: [
                { id: 'idea-title', label: 'Title', type: 'text', placeholder: 'Short name' },
                { id: 'idea-reach', label: 'Estimated reach', type: 'text', placeholder: 'How many people?' },
                { id: 'idea-desc',  label: 'Describe your idea', type: 'textarea', placeholder: 'What problem does it solve?', full: true }
            ]}
    };

    function buildFields(type) {
        if (!dynamicFields) return;
        var cfg = fieldConfigs[type];
        if (!cfg) return;

        var html = '<div class="fields-header"><i class="fa-solid ' + cfg.icon + '"></i>' + cfg.title + '</div><div class="fields-grid">';
        cfg.fields.filter(function (f) { return !f.full; }).forEach(function (f) {
            html += '<div class="field-group"><label for="' + f.id + '">' + f.label + '</label>';
            if (f.type === 'select') {
                html += '<select id="' + f.id + '" name="' + f.id + '">' + f.options.map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select>';
            } else if (f.type === 'textarea') {
                html += '<textarea id="' + f.id + '" name="' + f.id + '" rows="3" placeholder="' + f.placeholder + '"></textarea>';
            } else {
                html += '<input type="text" id="' + f.id + '" name="' + f.id + '" placeholder="' + f.placeholder + '">';
            }
            html += '</div>';
        });
        html += '</div>';
        cfg.fields.filter(function (f) { return f.full; }).forEach(function (f) {
            html += '<div class="field-group full"><label for="' + f.id + '">' + f.label + '</label><textarea id="' + f.id + '" name="' + f.id + '" rows="4" placeholder="' + f.placeholder + '"></textarea></div>';
        });
        html += '<div class="contact-fields"><div class="field-group"><label for="c-name">Your name</label><input type="text" id="c-name" name="name" placeholder="Sophie Martin" required></div><div class="field-group"><label for="c-email">Your email</label><input type="email" id="c-email" name="email" placeholder="sophie@example.com" required></div></div>';

        dynamicFields.innerHTML = html;
        dynamicFields.classList.add('fields-visible');
        if (submitBtn) submitBtn.style.display = 'inline-flex';

        if (window.innerWidth <= 768) {
            setTimeout(function () { dynamicFields.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 350);
        }
    }

    contributeCards.forEach(function (card) {
        function activate() {
            contributeCards.forEach(function (c) { c.classList.remove('selected'); });
            card.classList.add('selected');
            if (selectedCategory) selectedCategory.value = card.dataset.type;
            buildFields(card.dataset.type);
        }
        card.addEventListener('click', activate);
        card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    });

    var contribForm = document.getElementById('contribute-form');
    if (contribForm) {
        contribForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var name  = document.getElementById('c-name');
            var email = document.getElementById('c-email');
            if (!name || !name.value.trim() || !email || !email.value.trim()) {
                showToast('Please fill in your name and email.', 'default');
                return;
            }
            if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…'; }
            setTimeout(function () {
                showToast('✅ Thank you ' + name.value.trim() + '! We\'ll be in touch soon.', 'success', 6000);
                contribForm.reset();
                contributeCards.forEach(function (c) { c.classList.remove('selected'); });
                if (dynamicFields) { dynamicFields.classList.remove('fields-visible'); dynamicFields.innerHTML = ''; }
                if (submitBtn) { submitBtn.disabled = false; submitBtn.style.display = 'none'; submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit my contribution'; }
            }, 1200);
        });
    }

})();