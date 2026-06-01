/* ============================================================
   INCLUNITY — main.js
   Mobile-first version with bottom nav, scroll progress,
   fade-in animations, hamburger menu, contribute form & toasts
   ============================================================ */

   (() => {
    'use strict';

    /* ----------------------------------------------------------
       SCROLL PROGRESS BAR
    ---------------------------------------------------------- */
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);

    /* ----------------------------------------------------------
       STICKY HEADER
    ---------------------------------------------------------- */
    const header = document.querySelector('header');

    /* ----------------------------------------------------------
       MOBILE BOTTOM NAV — inject dynamically
    ---------------------------------------------------------- */
    const bottomNav = document.createElement('nav');
    bottomNav.className = 'mobile-bottom-nav';
    bottomNav.setAttribute('aria-label', 'Main navigation');
    bottomNav.innerHTML = `
        <ul>
            <li><a href="index.html" data-page="index"><i class="fa-solid fa-house"></i><span>Home</span></a></li>
            <li><a href="missions.html" data-page="missions"><i class="fa-solid fa-bullseye"></i><span>Missions</span></a></li>
            <li><a href="program.html" data-page="program"><i class="fa-solid fa-timeline"></i><span>Program</span></a></li>
            <li><a href="elearning.html" data-page="elearning"><i class="fa-solid fa-graduation-cap"></i><span>Learn</span></a></li>
            <li><a href="jobs.html" data-page="jobs"><i class="fa-solid fa-briefcase"></i><span>Jobs</span></a></li>
        </ul>
    `;
    document.body.appendChild(bottomNav);

    /* ----------------------------------------------------------
       FLOATING ACTION BUTTON — Support Us
    ---------------------------------------------------------- */
    const fab = document.createElement('a');
    fab.href = 'event.html';
    fab.className = 'fab-support';
    fab.setAttribute('aria-label', 'Support Us');
    fab.innerHTML = '<i class="fa-solid fa-heart"></i>';
    document.body.appendChild(fab);

    /* ----------------------------------------------------------
       ACTIVE PAGE HIGHLIGHTING
    ---------------------------------------------------------- */
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';

    // Desktop nav
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href')?.replace('.html', '') || '';
        if (href === currentPage || (currentPage === '' && href === 'index')) {
            link.classList.add('active');
        }
    });

    // Bottom nav
    bottomNav.querySelectorAll('a').forEach(link => {
        if (link.dataset.page === currentPage || (currentPage === '' && link.dataset.page === 'index')) {
            link.classList.add('active');
        }
    });

    /* ----------------------------------------------------------
       SCROLL HANDLER (throttled)
    ---------------------------------------------------------- */
    let ticking = false;

    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docH > 0 ? (scrolled / docH) * 100 : 0;

            // Progress bar
            progressBar.style.width = pct + '%';

            // Header shadow
            if (header) {
                header.classList.toggle('scrolled', scrolled > 50);
            }

            // Parallax hero (desktop only)
            if (window.innerWidth > 768) {
                const hero = document.querySelector('.hero');
                if (hero) {
                    hero.style.setProperty('--parallax-y', (scrolled * 0.25) + 'px');
                }
            }

            ticking = false;
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ----------------------------------------------------------
       HAMBURGER MENU
    ---------------------------------------------------------- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('nav-open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
            // Trap scroll when menu open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click (fonctionne aussi avec position:fixed)
        document.addEventListener('click', e => {
            const isInsideHeader = header?.contains(e.target);
            const isInsideMenu = navLinks.contains(e.target);
            if (!isInsideHeader && !isInsideMenu && navLinks.classList.contains('nav-open')) {
                navLinks.classList.remove('nav-open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Escape key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && navLinks.classList.contains('nav-open')) {
                navLinks.classList.remove('nav-open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                hamburger.focus();
            }
        });
    }

    /* ----------------------------------------------------------
       FADE-IN ON SCROLL
    ---------------------------------------------------------- */
    const fadeEls = document.querySelectorAll('.card, .timeline-item, .contribute-card, .section-title, .section-subtitle');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger with delay
                    const delay = (i % 6) * 80;
                    setTimeout(() => {
                        entry.target.classList.remove('fade-in-hidden');
                        entry.target.classList.add('fade-in-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        fadeEls.forEach(el => {
            el.classList.add('fade-in-hidden');
            observer.observe(el);
        });
    }

    /* ----------------------------------------------------------
       TOAST NOTIFICATIONS
    ---------------------------------------------------------- */
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const showToast = (message, type = 'default', duration = 4000) => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => toast.classList.add('toast-show'));
        });

        setTimeout(() => {
            toast.classList.remove('toast-show');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, duration);
    };

    /* ----------------------------------------------------------
       NEWSLETTER FORM (index.html)
    ---------------------------------------------------------- */
    const newsletterForm = document.querySelector('.newsletter-form, section form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]')?.value.trim();
            if (!email) return;
            showToast('🎉 Thank you! You\'ll receive our next impact report.', 'success');
            newsletterForm.reset();
        });
    }

    /* ----------------------------------------------------------
       CONTRIBUTE FORM (jobs.html)
    ---------------------------------------------------------- */
    const contributeCards = document.querySelectorAll('.contribute-card');
    const dynamicFields = document.getElementById('dynamic-fields');
    const submitBtn = document.querySelector('.contrib-submit');
    const selectedCategory = document.getElementById('selected-category');

    const fieldConfigs = {
        skills: {
            icon: 'fa-chalkboard-user',
            title: 'Skills & Teaching',
            fields: [
                { id: 'skill-domain', label: 'Your field of expertise', type: 'text', placeholder: 'e.g. English, Python, Accounting…', full: false },
                { id: 'skill-format', label: 'Format', type: 'select', options: ['Online live sessions', 'Pre-recorded videos', 'In-person workshops', 'Mentoring 1-on-1'], full: false },
                { id: 'skill-availability', label: 'Weekly availability', type: 'text', placeholder: 'e.g. 2 hours on weekends', full: false },
                { id: 'skill-level', label: 'Audience level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced', 'All levels'], full: false },
                { id: 'skill-details', label: 'Additional details', type: 'textarea', placeholder: 'Tell us more about your offer…', full: true },
            ]
        },
        goods: {
            icon: 'fa-box-open',
            title: 'Goods & Equipment',
            fields: [
                { id: 'goods-type', label: 'Type of goods', type: 'text', placeholder: 'e.g. Clothing, Computers, Furniture…', full: false },
                { id: 'goods-qty', label: 'Approximate quantity', type: 'text', placeholder: 'e.g. 5 boxes, 3 laptops…', full: false },
                { id: 'goods-condition', label: 'Condition', type: 'select', options: ['New', 'Like new', 'Good', 'Acceptable'], full: false },
                { id: 'goods-pickup', label: 'Pickup or delivery', type: 'select', options: ['Pickup only', 'I can deliver locally', 'I can ship'], full: false },
                { id: 'goods-details', label: 'Additional details', type: 'textarea', placeholder: 'Photos, location, best contact time…', full: true },
            ]
        },
        services: {
            icon: 'fa-handshake',
            title: 'Services & Pro Bono',
            fields: [
                { id: 'service-type', label: 'Service type', type: 'text', placeholder: 'e.g. Legal advice, Medical, Translation…', full: false },
                { id: 'service-hours', label: 'Hours per month', type: 'text', placeholder: 'e.g. 4 hours/month', full: false },
                { id: 'service-duration', label: 'Commitment duration', type: 'select', options: ['One-time', '1–3 months', '3–6 months', 'Ongoing'], full: false },
                { id: 'service-remote', label: 'Mode', type: 'select', options: ['Remote only', 'In-person only', 'Both'], full: false },
                { id: 'service-details', label: 'Describe your offer', type: 'textarea', placeholder: 'Tell us what you can bring to our community…', full: true },
            ]
        },
        funding: {
            icon: 'fa-circle-dollar-to-slot',
            title: 'Funding & Donations',
            fields: [
                { id: 'fund-type', label: 'Type of support', type: 'select', options: ['One-time donation', 'Monthly contribution', 'Project sponsorship', 'Corporate grant'], full: false },
                { id: 'fund-amount', label: 'Estimated amount (USD)', type: 'text', placeholder: 'e.g. 500', full: false },
                { id: 'fund-destination', label: 'Preferred destination', type: 'select', options: ['Where it\'s most needed', 'Housing programs', 'E-Learning platform', 'Healthcare initiatives'], full: false },
                { id: 'fund-details', label: 'Message to our team', type: 'textarea', placeholder: 'Any conditions, partnership ideas, or questions…', full: true },
            ]
        },
        other: {
            icon: 'fa-lightbulb',
            title: 'My Own Idea',
            fields: [
                { id: 'other-title', label: 'Title of your idea', type: 'text', placeholder: 'Give it a short memorable name', full: false },
                { id: 'other-impact', label: 'Estimated impact', type: 'text', placeholder: 'How many people could benefit?', full: false },
                { id: 'other-description', label: 'Describe your idea', type: 'textarea', placeholder: 'What problem does it solve? How would it work?', full: true },
            ]
        }
    };

    const buildFields = (type) => {
        const config = fieldConfigs[type];
        if (!config || !dynamicFields) return;

        let html = `
            <div class="fields-header">
                <i class="fa-solid ${config.icon}"></i>
                ${config.title}
            </div>
            <div class="fields-grid">
        `;

        config.fields.filter(f => !f.full).forEach(f => {
            html += `<div class="field-group">
                <label for="${f.id}">${f.label}</label>`;

            if (f.type === 'select') {
                html += `<select id="${f.id}" name="${f.id}">` +
                    f.options.map(o => `<option value="${o.toLowerCase().replace(/\s+/g,'-')}">${o}</option>`).join('') +
                    `</select>`;
            } else if (f.type === 'textarea') {
                html += `<textarea id="${f.id}" name="${f.id}" rows="3" placeholder="${f.placeholder}"></textarea>`;
            } else {
                html += `<input type="text" id="${f.id}" name="${f.id}" placeholder="${f.placeholder}">`;
            }
            html += `</div>`;
        });

        html += `</div>`;

        config.fields.filter(f => f.full).forEach(f => {
            html += `<div class="field-group full">
                <label for="${f.id}">${f.label}</label>
                <textarea id="${f.id}" name="${f.id}" rows="4" placeholder="${f.placeholder}"></textarea>
            </div>`;
        });

        html += `
            <div class="contact-fields">
                <div class="field-group">
                    <label for="contact-name">Your name</label>
                    <input type="text" id="contact-name" name="name" placeholder="Sophie Martin" required>
                </div>
                <div class="field-group">
                    <label for="contact-email">Your email</label>
                    <input type="email" id="contact-email" name="email" placeholder="sophie@example.com" required>
                </div>
            </div>
        `;

        dynamicFields.innerHTML = html;

        requestAnimationFrame(() => {
            dynamicFields.classList.add('fields-visible');
        });

        if (submitBtn) {
            submitBtn.style.display = 'inline-flex';
        }

        // Scroll into view on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                dynamicFields.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 350);
        }
    };

    contributeCards.forEach(card => {
        const activate = () => {
            contributeCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            if (selectedCategory) selectedCategory.value = card.dataset.type;
            buildFields(card.dataset.type);
        };

        card.addEventListener('click', activate);
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
        });
    });

    // Submit
    const contributeForm = document.getElementById('contribute-form');
    if (contributeForm) {
        contributeForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('contact-name')?.value.trim();
            const email = document.getElementById('contact-email')?.value.trim();

            if (!name || !email) {
                showToast('Please fill in your name and email.', 'default');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
            }

            setTimeout(() => {
                showToast(`✅ Thank you ${name}! We'll be in touch at ${email}.`, 'success', 6000);
                contributeForm.reset();
                contributeCards.forEach(c => c.classList.remove('selected'));
                if (dynamicFields) {
                    dynamicFields.classList.remove('fields-visible');
                    dynamicFields.innerHTML = '';
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.style.display = 'none';
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit my contribution';
                }
            }, 1200);
        });
    }

    /* ----------------------------------------------------------
       EVENT PAGE — Register button
    ---------------------------------------------------------- */
    const registerBtn = document.querySelector('.event-register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            showToast('🎬 You\'re registered! Check your email for details.', 'success');
        });
    }

    // Generic register button
    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('Register for the Broadcast')) {
            btn.addEventListener('click', () => {
                showToast('🎬 You\'re registered! Check your email for details.', 'success');
            });
        }
    });

    /* ----------------------------------------------------------
       APPLY NOW buttons (jobs.html)
    ---------------------------------------------------------- */
    document.querySelectorAll('a[href="#"]').forEach(link => {
        if (link.textContent.trim() === 'Apply Now') {
            link.addEventListener('click', e => {
                e.preventDefault();
                const jobTitle = link.closest('.card')?.querySelector('h3')?.textContent || 'this position';
                showToast(`📩 Redirecting to the application form for ${jobTitle}…`, 'info');
            });
        }
    });

    /* ----------------------------------------------------------
       COUNTER ANIMATION (stat strip)
    ---------------------------------------------------------- */
    const animateCounter = (el, target, suffix = '') => {
        const duration = 1600;
        const start = performance.now();
        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };

    if ('IntersectionObserver' in window) {
        const statEls = document.querySelectorAll('.stat-strip-item .stat-num');
        if (statEls.length) {
            const statObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const raw = entry.target.dataset.count;
                        const suffix = entry.target.dataset.suffix || '';
                        if (raw) animateCounter(entry.target, parseInt(raw), suffix);
                        statObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            statEls.forEach(el => statObserver.observe(el));
        }
    }

})();