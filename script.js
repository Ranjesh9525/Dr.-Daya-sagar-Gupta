/* =================================================
   DR. DAYA SAGAR GUPTA — COMPLETE JS
   Three.js 3D • Scroll Animations • Interactions
   ================================================= */

/* -----------------------------------------------
   THREE.JS — 3D NETWORK PARTICLE BACKGROUND (DISABLED)
   ----------------------------------------------- */
// Disabled for professional light background


/* -----------------------------------------------
   HEADER SCROLL BEHAVIOR
   ----------------------------------------------- */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* -----------------------------------------------
   MOBILE NAV — body-level overlay toggle
   ----------------------------------------------- */
const navToggleBtn    = document.getElementById('navToggle');
const mobileOverlay   = document.getElementById('mobileNavOverlay');
const hamburgerSpans  = navToggleBtn ? navToggleBtn.querySelectorAll('.hamburger') : [];

function openMobileNav() {
    if (!mobileOverlay) return;
    mobileOverlay.classList.add('open');
    mobileOverlay.setAttribute('aria-hidden', 'false');
    if (navToggleBtn) navToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Animate hamburger → X
    if (hamburgerSpans[0]) hamburgerSpans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    if (hamburgerSpans[1]) hamburgerSpans[1].style.opacity   = '0';
    if (hamburgerSpans[2]) hamburgerSpans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
}

function closeMobileNav() {
    if (!mobileOverlay) return;
    mobileOverlay.classList.remove('open');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    if (navToggleBtn) navToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Reset hamburger
    if (hamburgerSpans[0]) hamburgerSpans[0].style.transform = '';
    if (hamburgerSpans[1]) hamburgerSpans[1].style.opacity   = '';
    if (hamburgerSpans[2]) hamburgerSpans[2].style.transform = '';
}

if (navToggleBtn) {
    navToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileOverlay?.classList.contains('open') ? closeMobileNav() : openMobileNav();
    });
}

// Tap on dark backdrop (not the panel) → close
if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
        const panel = document.getElementById('mobileNavPanel');
        if (panel && !panel.contains(e.target)) closeMobileNav();
    });
}

// All mobile nav links → close on click
document.querySelectorAll('.mobile-nav-link, .mobile-nav-sub-link').forEach(link => {
    link.addEventListener('click', () => {
        closeMobileNav();
    });
});

// ESC key → close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
});


/* -----------------------------------------------
   SMOOTH SCROLL
   ----------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});


/* -----------------------------------------------
   ACTIVE NAV LINK HIGHLIGHTING (per-page, multi-page site)
   ----------------------------------------------- */
(function highlightActiveNavLink() {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const pageId = document.body.getAttribute('data-page');

    // Sub-pages under the Research dropdown should also light up "Research"
    const researchGroup = ['research', 'publications', 'projects', 'students'];

    document.querySelectorAll('.nav-link, .dropdown-link, .mobile-nav-link, .mobile-nav-sub-link').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const linkFile = href.split('/').pop();
        if (linkFile === currentFile) {
            link.classList.add('active-link');
        }
    });

    if (researchGroup.includes(pageId)) {
        const researchTopLink = document.querySelector('.nav-link--research, .mobile-nav-link[href="research.html"]');
        document.querySelectorAll('.nav-link--research').forEach(l => l.classList.add('active-link'));
    }
})();


/* -----------------------------------------------
   SCROLL REVEAL (IntersectionObserver)
   ----------------------------------------------- */
function addRevealClasses() {
    const selectors = [
        '.research-card', '.pub-card', '.student-card',
        '.timeline-card', '.edu-card', '.contact-card',
        '.ach-card', '.section-header', '.carousel-container',
        '.achievements-fallback', '.pub-filter-bar', '.pub-more',
        '.table-wrapper'
    ];
    let delay = 0;
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.classList.add('reveal');
            // Stagger delay per parent group
            el.style.transitionDelay = `${(i % 6) * 0.1}s`;
        });
    });
}

addRevealClasses();

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* -----------------------------------------------
   CARD 3D TILT ON MOUSE MOVE — DISABLED
   ----------------------------------------------- */
// 3D tilt effects removed for professional clean look


/* -----------------------------------------------
   PUBLICATION FILTER
   ----------------------------------------------- */
const filterBtns = document.querySelectorAll('.pub-filter');
const pubCards   = document.querySelectorAll('.pub-card, .pub-group-heading');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        pubCards.forEach(card => {
            if (filter === 'all' || card.dataset.type === filter) {
                card.classList.remove('hidden');
                card.style.display = '';
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });
    });
});


/* -----------------------------------------------
   IMAGE CAROUSEL
   ----------------------------------------------- */
(function initCarousel() {
    const track   = document.getElementById('imageCarouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const count  = slides.length;
    if (count === 0) return;

    let current = 0;
    let timer   = null;

    // Build dots
    slides.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(d);
    });

    function goTo(idx) {
        current = (idx + count) % count;
        track.style.transform = `translateX(-${current * 100}%)`;
        document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() { timer = setInterval(next, 3500); }
    function stopAuto()  { clearInterval(timer); }

    prevBtn && prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
    nextBtn && nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);

    // Touch swipe support
    let touchX = null;
    track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
        if (touchX === null) return;
        const diff = touchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { stopAuto(); diff > 0 ? next() : prev(); startAuto(); }
        touchX = null;
    });

    startAuto();
})();


/* -----------------------------------------------
   HERO PARALLAX — DISABLED FOR PROFESSIONAL LOOK
   ----------------------------------------------- */
// Parallax effects removed for clean professional appearance


/* -----------------------------------------------
   BUTTON RIPPLE — DISABLED FOR PROFESSIONAL LOOK
   ----------------------------------------------- */
// Ripple animation removed


/* -----------------------------------------------
   SCROLL INDICATOR FADE — MINIMAL
   ----------------------------------------------- */
const scrollIndicator = document.querySelector('.scroll-indicator');
window.addEventListener('scroll', () => {
    if (!scrollIndicator) return;
    scrollIndicator.style.display = window.scrollY > 100 ? 'none' : 'flex';
}, { passive: true });


/* -----------------------------------------------
   INIT LOG
   ----------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    console.log('%c Dr. Daya Sagar Gupta — Portfolio v2.0 ', 
        'background: #2563eb; color: white; font-size: 14px; padding: 6px 12px; border-radius: 6px;');
});

window.addEventListener('error', e => console.error('JS Error:', e.error));
