/* ============================================================
   VARIABLES & DESIGN TOKENS
   ============================================================ */
   :root {
    --primary-color: #1a365d;
    --secondary-color: #2b6cb0;
    --accent-color: #ecc94b;
    --text-color: #2d3748;
    --text-light: #718096;
    --bg-color: #f7fafc;
    --white: #ffffff;
    --card-shadow: 0 4px 24px rgba(26, 54, 93, 0.07);
    --card-shadow-hover: 0 20px 48px rgba(26, 54, 93, 0.14);
    --radius: 16px;
    --radius-sm: 8px;
    --transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1);

    --font-main: 'Inter', sans-serif;
    --font-heading: 'Playfair Display', serif;
}

/* ============================================================
   RESET & BASE
   ============================================================ */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
}

body {
    font-family: var(--font-main);
    color: var(--text-color);
    background-color: var(--bg-color);
    line-height: 1.7;
    overflow-x: hidden;
}

h1, h2, h3, h4, .logo {
    font-family: var(--font-heading);
    line-height: 1.2;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
    background: var(--secondary-color);
    border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover { background: var(--primary-color); }

/* Focus visible pour l'accessibilité */
:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 3px;
    border-radius: 4px;
}

/* ============================================================
   BARRE DE PROGRESSION DE LECTURE
   ============================================================ */
.scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    width: 0%;
    background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
    z-index: 9999;
    transition: width 0.1s linear;
    pointer-events: none;
}

/* ============================================================
   NAVIGATION
   ============================================================ */
header {
    background: var(--white);
    box-shadow: 0 1px 0 rgba(0,0,0,0.06);
    position: sticky;
    top: 0;
    z-index: 1000;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

header.scrolled {
    background-color: rgba(255, 255, 255, 0.96);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 5%;
    max-width: 1280px;
    margin: 0 auto;
}

.logo {
    font-size: 1.5rem;
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 700;
    letter-spacing: -0.02em;
    transition: opacity var(--transition);
}
.logo:hover { opacity: 0.75; }

.nav-links {
    list-style: none;
    display: flex;
    gap: 1.75rem;
    align-items: center;
}

.nav-links a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 0.01em;
    position: relative;
    padding-bottom: 2px;
    transition: color var(--transition);
}

.nav-links a::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--accent-color);
    transition: width var(--transition);
    border-radius: 2px;
}

.nav-links a:hover::after,
.nav-links a.active::after {
    width: 100%;
}

.nav-links a:hover,
.nav-links a.active {
    color: var(--primary-color);
}

/* Hamburger responsive */
.hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
}
.hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: var(--primary-color);
    border-radius: 2px;
    transition: var(--transition);
    transform-origin: center;
}
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ============================================================
   BOUTONS
   ============================================================ */
.btn-donate, .btn-primary {
    background: var(--primary-color);
    color: var(--white);
    padding: 11px 26px;
    border-radius: 100px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 0.01em;
    transition: background var(--transition), box-shadow var(--transition), transform 0.2s ease;
    border: none;
    cursor: pointer;
    display: inline-block;
    position: relative;
    overflow: hidden;
    will-change: transform;
}

.btn-donate::before, .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.12);
    opacity: 0;
    transition: opacity var(--transition);
}
.btn-donate:hover::before, .btn-primary:hover::before { opacity: 1; }

.btn-donate:hover, .btn-primary:hover {
    background: var(--secondary-color);
    box-shadow: 0 6px 20px rgba(43, 108, 176, 0.35);
}

/* ============================================================
   HERO
   ============================================================ */
.hero {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: var(--white);
    text-align: center;
    padding: 130px 20px;
    position: relative;
    overflow: hidden;
    transform: translateY(var(--parallax-y, 0));
    will-change: transform;
}

.hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
}

.hero h1 {
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    margin-bottom: 20px;
    letter-spacing: -0.03em;
    text-shadow: 0 2px 20px rgba(0,0,0,0.15);
}

.hero p {
    font-size: 1.15rem;
    max-width: 680px;
    margin: 0 auto 30px;
    opacity: 0.88;
}

/* ============================================================
   CONTENEURS & TYPOGRAPHIE
   ============================================================ */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 90px 24px;
}

.section-title {
    text-align: center;
    font-size: clamp(1.9rem, 4vw, 2.6rem);
    color: var(--primary-color);
    margin-bottom: 14px;
    letter-spacing: -0.02em;
}

.section-subtitle {
    text-align: center;
    font-size: 1.05rem;
    color: var(--text-light);
    margin-bottom: 60px;
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.8;
}

/* ============================================================
   GRILLES & CARTES
   ============================================================ */
.grid-3 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 28px;
}

.card {
    background: var(--white);
    padding: 40px 32px;
    border-radius: var(--radius);
    box-shadow: var(--card-shadow);
    text-align: center;
    transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
    border: 1px solid #edf2f7;
    position: relative;
    overflow: hidden;
}

.card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--transition);
}

.card:hover::before { transform: scaleX(1); }

.card:hover {
    transform: translateY(-8px);
    box-shadow: var(--card-shadow-hover);
    border-color: transparent;
}

.card i {
    font-size: 2.6rem;
    color: var(--secondary-color);
    margin-bottom: 22px;
    display: block;
    transition: transform var(--transition), color var(--transition);
}

.card:hover i {
    transform: scale(1.1);
    color: var(--primary-color);
}

.card h3 {
    font-size: 1.35rem;
    margin-bottom: 12px;
    color: var(--primary-color);
}

.card p { color: var(--text-light); font-size: 0.97rem; }

/* ============================================================
   TAGS
   ============================================================ */
.tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 14px;
    border-radius: 100px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    margin-bottom: 14px;
    background: #ebf8ff;
    color: var(--secondary-color);
}

/* ============================================================
   TIMELINE
   ============================================================ */
.timeline {
    max-width: 760px;
    margin: 0 auto;
    position: relative;
    padding-left: 44px;
    border-left: 3px solid #dbe8f5;
}

.timeline-item {
    margin-bottom: 50px;
    position: relative;
}

.timeline-item::before {
    content: '';
    position: absolute;
    left: -52px;
    top: 6px;
    width: 18px;
    height: 18px;
    background: var(--accent-color);
    border: 3px solid var(--white);
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(43,108,176,0.15);
    transition: transform var(--transition), box-shadow var(--transition);
}

.timeline-item:hover::before {
    transform: scale(1.3);
    box-shadow: 0 0 0 6px rgba(43,108,176,0.2);
}

.timeline-content {
    background: var(--white);
    padding: 28px 32px;
    border-radius: var(--radius-sm);
    box-shadow: var(--card-shadow);
    transition: box-shadow var(--transition), transform var(--transition);
}

.timeline-content:hover {
    box-shadow: var(--card-shadow-hover);
    transform: translateX(4px);
}

.timeline-content h3 {
    color: var(--primary-color);
    margin-bottom: 8px;
    font-size: 1.3rem;
}

/* ============================================================
   FOOTER
   ============================================================ */
footer {
    background: var(--primary-color);
    color: var(--white);
    padding: 70px 24px 24px;
}

.footer-grid {
    max-width: 1200px;
    margin: 0 auto 50px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 50px;
}

.footer-grid h4 {
    font-size: 1.1rem;
    margin-bottom: 18px;
    color: var(--accent-color);
    letter-spacing: 0.02em;
}

.footer-grid a {
    color: #A0AEC0;
    text-decoration: none;
    font-size: 0.92rem;
    transition: color var(--transition);
}
.footer-grid a:hover { color: var(--white); }

.footer-grid li { margin-bottom: 6px; }

.copyright {
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.08);
    color: #718096;
    font-size: 0.85rem;
    max-width: 1200px;
    margin: 0 auto;
}

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
#toast-container {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9998;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
}

.toast {
    background: var(--primary-color);
    color: var(--white);
    padding: 14px 22px;
    border-radius: var(--radius-sm);
    font-size: 0.92rem;
    font-weight: 500;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    max-width: 380px;
    transform: translateY(20px);
    opacity: 0;
    transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.4,0,0.2,1);
    border-left: 4px solid var(--accent-color);
    pointer-events: auto;
}

.toast-success { border-left-color: #48bb78; }
.toast-info { border-left-color: var(--secondary-color); }

.toast.toast-show {
    opacity: 1;
    transform: translateY(0);
}

/* ============================================================
   SECTION CONTRIBUTIONS SPONTANÉES (jobs.html)
   ============================================================ */
.contributions-section {
    margin-top: 100px;
    padding-top: 80px;
    border-top: 1px solid #edf2f7;
}

.contributions-section .section-title {
    margin-bottom: 10px;
}

.contributions-section .section-subtitle {
    margin-bottom: 44px;
}

/* Grille des catégories */
.contribute-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 36px;
}

.contribute-card {
    background: var(--white);
    border: 2px solid #edf2f7;
    border-radius: var(--radius);
    padding: 28px 16px;
    text-align: center;
    cursor: pointer;
    transition: border-color var(--transition), background var(--transition), transform var(--transition), box-shadow var(--transition);
    user-select: none;
}

.contribute-card:hover {
    border-color: var(--secondary-color);
    transform: translateY(-4px);
    box-shadow: 0 10px 28px rgba(43,108,176,0.1);
}

.contribute-card.selected {
    border-color: var(--primary-color);
    background: linear-gradient(135deg, #ebf8ff 0%, #e6f0fb 100%);
    box-shadow: 0 8px 24px rgba(26,54,93,0.12);
}

.contribute-card i {
    font-size: 2rem;
    color: var(--secondary-color);
    margin-bottom: 12px;
    display: block;
    transition: transform var(--transition), color var(--transition);
}

.contribute-card.selected i { color: var(--primary-color); transform: scale(1.1); }
.contribute-card:hover i { transform: scale(1.08); }

.contribute-card span {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-color);
    display: block;
    line-height: 1.3;
}

.contribute-card.selected span { color: var(--primary-color); }

/* Champs dynamiques */
#dynamic-fields {
    background: var(--white);
    border-radius: var(--radius);
    border: 1px solid #e2e8f0;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease, padding 0.4s ease;
}

#dynamic-fields.fields-visible {
    max-height: 900px;
    opacity: 1;
    padding: 36px;
}

.fields-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
    padding-bottom: 18px;
    border-bottom: 1px solid #edf2f7;
    font-family: var(--font-heading);
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--primary-color);
}

.fields-header i {
    color: var(--accent-color);
    font-size: 1.3rem;
}

.fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
}

.contact-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding-top: 24px;
    border-top: 1px solid #edf2f7;
    margin-top: 4px;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.field-group.full { grid-column: 1 / -1; }

.field-group label {
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-light);
}

.field-group input,
.field-group select,
.field-group textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid #e2e8f0;
    border-radius: var(--radius-sm);
    font-family: var(--font-main);
    font-size: 0.95rem;
    color: var(--text-color);
    background: var(--bg-color);
    transition: border-color var(--transition), box-shadow var(--transition);
    outline: none;
    resize: vertical;
}

.field-group input:focus,
.field-group select:focus,
.field-group textarea:focus {
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 3px rgba(43,108,176,0.12);
    background: var(--white);
}

.field-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23718096' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
}

.contrib-submit {
    display: none;
    align-items: center;
    gap: 10px;
    margin-top: 28px;
    font-size: 1rem;
    padding: 14px 36px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 100px;
    font-weight: 700;
    cursor: pointer;
    transition: background var(--transition), box-shadow var(--transition), transform 0.2s;
    font-family: var(--font-main);
}

.contrib-submit:hover {
    background: var(--secondary-color);
    box-shadow: 0 8px 24px rgba(43,108,176,0.3);
}

.contrib-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
}

/* ============================================================
   ANIMATIONS AU SCROLL (fade-in-up)
   ============================================================ */
.fade-in-hidden {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1),
                transform 0.7s cubic-bezier(0.4,0,0.2,1);
}

.fade-in-visible {
    opacity: 1;
    transform: translateY(0);
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 900px) {
    .fields-grid,
    .contact-fields {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0; right: 0;
        background: var(--white);
        flex-direction: column;
        gap: 0;
        border-top: 1px solid #edf2f7;
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        padding: 16px 0;
    }

    .nav-links.nav-open { display: flex; }

    .nav-links li { width: 100%; }
    .nav-links a {
        display: block;
        padding: 12px 24px;
    }
    .nav-links a::after { display: none; }

    .hamburger { display: flex; }

    nav { flex-wrap: wrap; position: relative; }

    .hero { padding: 80px 20px; }
    .hero h1 { font-size: 2.2rem; }

    .contribute-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    #dynamic-fields.fields-visible { padding: 24px; }
}

@media (max-width: 420px) {
    .contribute-grid { grid-template-columns: repeat(2, 1fr); }
    .section-title { font-size: 1.8rem; }
}