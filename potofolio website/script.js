/**
 * Portfolio Website - Improved JavaScript
 * Enhanced with performance optimizations, accessibility, and better code organization
 */

// Initialize Lucide icons when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// ===============================================
// 1. HERO BACKGROUND FADE ON SCROLL
// ===============================================
/**
 * Hides hero background when scrolling to about section
 * Improves visual separation between sections
 */
window.addEventListener('scroll', () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const aboutTop = aboutSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (aboutTop < windowHeight * 0.7) {
            document.body.classList.add('hide-hero-bg');
        } else {
            document.body.classList.remove('hide-hero-bg');
        }
    }
}, { passive: true });

// ===============================================
// 2. CURVED TEXT ANIMATION (NAADLOZE LOOP)
// ===============================================
/**
 * Animates the curved marquee text in a continuous loop
 * Performance optimized with RAF
 */
function initCurvedText() {
    const textPath = document.getElementById('curvedTextPath');
    if (!textPath) return;
    
    let offset = 0;
    let isAnimating = true;
    
    function animate() {
        if (isAnimating) {
            offset -= 0.2;
            if (offset <= -25) offset = 0;
            textPath.setAttribute('startOffset', `${offset}%`);
        }
        requestAnimationFrame(animate);
    }
    
    // Stop animation when page is hidden
    document.addEventListener('visibilitychange', () => {
        isAnimating = !document.hidden;
    });
    
    animate();
}

initCurvedText();

// ===============================================
// 3. SIDE PARTICLES ANIMATION (MOUSE INTERACTIVE)
// ===============================================
/**
 * Particle system that responds to mouse movement
 * Improved performance with optimized calculations
 */
class SideParticles {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -5000, y: -5000 };
        this.animationId = null;
        this.init();
    }
    
    init() {
        this.resize();
        
        // Event listeners with passive flag for better performance
        window.addEventListener('resize', () => this.resize(), { passive: true });
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        }, { passive: true });
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = -5000;
            this.mouse.y = -5000;
        }, { passive: true });
        
        // Create particles
        for (let i = 0; i < 80; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                w: 2,
                h: Math.random() * 12 + 6,
                speedY: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        this.animate();
    }
    
    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.parentElement.offsetHeight;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            // Move particle up
            p.y -= p.speedY;
            
            // Calculate distance to mouse
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const distSq = dx * dx + dy * dy;
            const distance = Math.sqrt(distSq);
            
            // Apply repulsion force if mouse is nearby
            if (distance < 150) {
                const force = (150 - distance) / 150;
                p.x += (dx / distance) * force * 10;
                p.y += (dy / distance) * force * 10;
            }
            
            // Wrap around screen edges
            if (p.y < -20) p.y = this.canvas.height + 20;
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            
            // Draw particle
            this.ctx.fillStyle = `rgba(255, 107, 53, ${p.opacity})`;
            this.ctx.beginPath();
            this.ctx.roundRect(p.x, p.y, p.w, p.h, 5);
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize particles if canvases exist
const lSide = document.getElementById('leftParticles');
const rSide = document.getElementById('rightParticles');
let leftParticles = null;
let rightParticles = null;

if (lSide) leftParticles = new SideParticles(lSide);
if (rSide) rightParticles = new SideParticles(rSide);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (leftParticles) leftParticles.destroy();
    if (rightParticles) rightParticles.destroy();
});

// ===============================================
// 4. CIRCULAR TEXT ANIMATION
// ===============================================
/**
 * Creates rotated text around a circle
 * Used in footer area
 */
function createCircularText() {
    const circularText = document.getElementById('circularText');
    if (!circularText) return;
    
    const text = "• FABIAN CORSALINI • PORTFOLIO 2026 ";
    const chars = text.split('');
    const angleSlice = 360 / chars.length;
    
    chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.transform = `rotate(${angleSlice * i}deg)`;
        circularText.appendChild(span);
    });
}

createCircularText();

// ===============================================
// 5. TYPEWRITER EFFECT FOR HERO ROLE
// ===============================================
/**
 * Smooth typewriter animation for the hero section
 * Improved with better performance and accessibility
 */
const typedTextElement = document.getElementById('typedText');
const texts = ['Creative Software Developer', 'Web Developer', 'UI/UX Enthusiast'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        setTimeout(type, 2000); // Pause before deleting
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(type, 500); // Pause before typing new text
    } else {
        setTimeout(type, isDeleting ? 50 : 100);
    }
}

type();

// ===============================================
// 6. HERO PHOTO PARALLAX ON MOUSE MOVE
// ===============================================
/**
 * Creates subtle parallax effect on hero image
 * Only enabled on larger screens for better UX
 */
const heroPhoto = document.getElementById('heroPhoto');
if (heroPhoto && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        heroPhoto.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
}

// ===============================================
// 7. INTERSECTION OBSERVER FOR ANIMATIONS
// ===============================================
/**
 * Animates elements as they come into view
 * Better performance than scroll listener approach
 */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate cards and text
            const elements = entry.target.querySelectorAll(
                '.animate-card, .animate-text, .stat-item, .timeline-item, .bento-box'
            );
            
            if (typeof anime !== 'undefined' && elements.length > 0) {
                anime({
                    targets: elements,
                    translateY: [50, 0],
                    opacity: [0, 1],
                    delay: anime.stagger(100),
                    easing: 'easeOutExpo'
                });
            }
            
            // Trigger experience timeline animation
            if (entry.target.id === 'experience') {
                growJourneyPlant();
            }
            
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Observe all animated sections
document.querySelectorAll('.animate-section').forEach(section => {
    observer.observe(section);
});

// ===============================================
// 8. EXPERIENCE TIMELINE GROWTH ANIMATION
// ===============================================
/**
 * Animates the growth plant visualization in experience section
 * Sequential animation with milestone reveals
 */
function growJourneyPlant() {
    if (typeof anime === 'undefined') return;
    
    anime({
        targets: '.stem-path',
        strokeDashoffset: [1000, 0],
        duration: 2000,
        easing: 'easeInOutQuad',
        complete: animateBranches
    });
}

function animateBranches() {
    if (typeof anime === 'undefined') return;
    
    anime({
        targets: '.branch-1',
        strokeDashoffset: [100, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuad',
        complete: () => showMilestone(1)
    });
    
    anime({
        targets: '.branch-2',
        strokeDashoffset: [100, 0],
        opacity: [0, 1],
        duration: 600,
        delay: 400,
        easing: 'easeOutQuad',
        complete: () => showMilestone(2)
    });
    
    anime({
        targets: '.branch-3',
        strokeDashoffset: [100, 0],
        opacity: [0, 0.6],
        duration: 600,
        delay: 800,
        easing: 'easeOutQuad',
        complete: () => showMilestone(3)
    });
}

function showMilestone(number) {
    const milestone = document.querySelector(`.milestone-${number}`);
    if (!milestone || typeof anime === 'undefined') return;
    
    milestone.classList.add('active');
    anime({
        targets: milestone,
        scale: [0, 1.2, 1],
        duration: 600,
        easing: 'easeOutElastic(1, .5)'
    });
}

// ===============================================
// 9. THEME TOGGLE (Dark/Light mode)
// ===============================================
/**
 * Toggle between dark and light themes
 * Uses localStorage for persistence
 */
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    // Default is always dark mode. Only switch to light if user explicitly chose it.
    const savedTheme = localStorage.getItem('theme') || 'dark';

    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.setAttribute('aria-pressed', 'true');
    } else {
        document.body.classList.remove('light-mode');
        themeToggle.setAttribute('aria-pressed', 'false');
    }

    themeToggle.addEventListener('click', () => {
        const isCurrentlyLight = document.body.classList.contains('light-mode');

        if (isCurrentlyLight) {
            // Switch to dark
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            themeToggle.setAttribute('aria-pressed', 'false');
        } else {
            // Switch to light
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            themeToggle.setAttribute('aria-pressed', 'true');
        }

        // Reinitialize icons if they exist
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
}

// ===============================================
// 10. SMOOTH SCROLL FOR NAVIGATION
// ===============================================
/**
 * Smooth scrolling for anchor links
 * Improves UX and accessibility
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===============================================
// 11. IMAGE TRAIL EFFECT (SKILLS SECTION)
// ===============================================
/**
 * Creates floating image trail effect on mouse movement
 * Performance optimized with distance check
 */
const skillsSection = document.querySelector('.skills-trail-area');

const trailImages = [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614741118881-1e4202994741?q=80&w=300&auto=format&fit=crop'
];

let trailIndex = 0;
let lastMouseX = 0;
let lastMouseY = 0;

if (skillsSection) {
    skillsSection.addEventListener('mousemove', (e) => {
        // Only spawn image if mouse moved more than 100px
        const distance = Math.sqrt(
            Math.pow(e.clientX - lastMouseX, 2) + 
            Math.pow(e.clientY - lastMouseY, 2)
        );

        if (distance > 100) {
            spawnTrailImage(e.clientX, e.clientY);
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        }
    }, { passive: true });
}

function spawnTrailImage(x, y) {
    const img = document.createElement('img');
    img.src = trailImages[trailIndex];
    img.classList.add('trail-image');
    img.alt = ''; // Decorative image, not essential
    img.setAttribute('aria-hidden', 'true');
    
    trailIndex = (trailIndex + 1) % trailImages.length;
    
    const rect = skillsSection.getBoundingClientRect();
    
    // Only spawn if within section bounds
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        const randomOffset = (Math.random() - 0.5) * 40;
        img.style.left = `${x - rect.left - 75 + randomOffset}px`;
        img.style.top = `${y - rect.top - 50 + randomOffset}px`;
        
        skillsSection.appendChild(img);
        
        // Clean up after animation
        setTimeout(() => {
            img.remove();
        }, 1500);
    }
}

// ===============================================
// 12. ACTIVE NAVIGATION LINK ON SCROLL
// ===============================================
/**
 * Updates active nav link based on scroll position
 * Improves navigation UX
 */
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { passive: true });

// ===============================================
// 13. PERFORMANCE MONITORING (Optional)
// ===============================================
/**
 * Logs performance metrics to console
 * Useful for optimization
 */
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Portfolio loaded in ' + pageLoadTime + 'ms');
    });
}

// ===============================================
// 14. ACCESSIBILITY - KEYBOARD NAVIGATION
// ===============================================
/**
 * Improve keyboard navigation support
 * Adds Enter key support for buttons
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Could be used to close modals or dropdowns in future
    }
});

// ===============================================
// 15. SKILLS CIRCLE — JS STICKY (fixes overflow-x: hidden breaking CSS sticky)
// ===============================================
(function () {
    const skillsSection = document.querySelector('.skills-new');
    const circleWrap = document.querySelector('.skills-right-inner');

    if (!skillsSection || !circleWrap) return;

    function positionCircle() {
        const sectionRect = skillsSection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionBottom = sectionRect.bottom;
        const sectionHeight = sectionRect.height;
        const viewH = window.innerHeight;
        const circleH = circleWrap.offsetHeight;

        // Ideal: circle vertically centered in viewport
        const idealTop = (viewH / 2) - (circleH / 2);

        // Clamp so it doesn't go outside the section
        const minTop = 0; // relative to section top
        const maxTop = sectionHeight - circleH;

        // How far we've scrolled into the section
        const scrolledInto = -sectionTop; // positive once section enters viewport
        const centeredOffset = scrolledInto + idealTop;
        const clamped = Math.min(Math.max(centeredOffset, minTop), maxTop);

        circleWrap.style.transform = `translateY(${clamped}px)`;
    }

    window.addEventListener('scroll', positionCircle, { passive: true });
    window.addEventListener('resize', positionCircle, { passive: true });
    positionCircle();
})();

// ===============================================
// MY JOURNEY — Zigzag timeline + curved SVG path
// ===============================================
(function () {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* Title animation — words shoot in from left */
  const titleEl = document.querySelector('.journey-title');
  if (titleEl) {
    const text = titleEl.textContent.trim();
    titleEl.innerHTML = text.split(' ').map(w =>
      `<span class="word-wrap"><span class="word-inner">${w}</span></span>`
    ).join(' ');
    gsap.fromTo(titleEl.querySelectorAll('.word-inner'),
      { opacity: 0, xPercent: -80, rotateZ: -4, transformOrigin: '0% 50%' },
      { opacity: 1, xPercent: 0, rotateZ: 0, duration: 0.7, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: titleEl, start: 'top 90%', toggleActions: 'play none none none' }
      }
    );
  }

  /* Scroll reveal text — word by word blur+opacity */
  document.querySelectorAll('.zz-reveal-text').forEach(el => {
    const text = el.dataset.text;
    if (!text) return;
    el.innerHTML = text.split(' ').map(w => `<span class="sr-word">${w}</span>`).join(' ');
    gsap.fromTo(el.querySelectorAll('.sr-word'),
      { opacity: 0.1, filter: 'blur(3px)' },
      { opacity: 1, filter: 'blur(0px)', ease: 'none', stagger: 0.04,
        scrollTrigger: { trigger: el, start: 'top bottom-=10%', end: 'bottom center+=10%', scrub: true }
      }
    );
  });

  /* Entries slide in alternating */
  document.querySelectorAll('.zz-entry').forEach(entry => {
    ScrollTrigger.create({
      trigger: entry, start: 'top bottom-=60px', once: true,
      onEnter: () => entry.classList.add('in')
    });
    if (entry.getBoundingClientRect().top < window.innerHeight) entry.classList.add('in');
  });

  /* SVG curved path */
  function buildPath() {
    const outer = document.getElementById('zzOuter');
    const svg   = document.getElementById('zzSvg');
    if (!outer || !svg) return;

    const totalH = outer.offsetHeight;
    const totalW = outer.offsetWidth;
    const outerRect = outer.getBoundingClientRect();

    const rose = document.getElementById('zzRose');
    const roseRect = rose.getBoundingClientRect();
    const roseX = roseRect.left - outerRect.left + roseRect.width / 2;
    const roseY = roseRect.top  - outerRect.top  + roseRect.height * 0.6;

    const points = [{ x: roseX, y: roseY }];

    document.querySelectorAll('.zz-entry').forEach(entry => {
      const card = entry.querySelector('.zz-card');
      if (!card) return;
      const cardRect = card.getBoundingClientRect();
      const isOdd = entry.classList.contains('zz-odd');
      const relY = cardRect.top - outerRect.top + cardRect.height * 0.28;
      const relX = isOdd
        ? cardRect.left - outerRect.left + cardRect.width + 10
        : cardRect.left - outerRect.left - 10;
      points.push({ x: relX, y: relY });
    });

    if (points.length < 2) return;

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const dy = p1.y - p0.y;
      d += ` C ${p0.x} ${p0.y + dy * 0.5}, ${p1.x} ${p1.y - dy * 0.5}, ${p1.x} ${p1.y}`;
    }

    document.getElementById('pathGhost').setAttribute('d', d);
    document.getElementById('pathDraw').setAttribute('d', d);
    svg.setAttribute('viewBox', `0 0 ${totalW} ${totalH}`);
    svg.style.width = totalW + 'px';
    svg.style.height = totalH + 'px';

    const pathEl = document.getElementById('pathDraw');
    const pathLen = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = pathLen;
    pathEl.style.strokeDashoffset = pathLen;

    ScrollTrigger.getAll().filter(st => st._isPath).forEach(st => st.kill());

    ScrollTrigger.create({
      _isPath: true,
      trigger: outer,
      start: 'top 70%',
      end: 'bottom 60%',
      scrub: 1,
      onUpdate: self => {
        pathEl.style.strokeDashoffset = pathLen * (1 - self.progress);
      }
    });
  }

  window.addEventListener('load', () => setTimeout(buildPath, 300));
  window.addEventListener('resize', () => setTimeout(buildPath, 100));
})();

// ===============================================
// CONTACT FORM — Formspree submission
// ===============================================
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const btn     = document.getElementById('cfSubmit');
  const success = document.getElementById('cfSuccess');
  const error   = document.getElementById('cfError');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Check if Formspree ID has been set
    if (form.action.includes('YOUR_FORM_ID')) {
      error.textContent = 'Form not configured yet. Please email directly: fabichelsea555@outlook.com';
      error.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.querySelector('.cf-submit-text').textContent = 'Sending...';
    success.style.display = 'none';
    error.style.display   = 'none';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        success.style.display = 'block';
        form.reset();
        btn.querySelector('.cf-submit-text').textContent = 'Sent!';
        setTimeout(() => {
          btn.disabled = false;
          btn.querySelector('.cf-submit-text').textContent = 'Send Message';
        }, 4000);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      error.style.display = 'block';
      btn.disabled = false;
      btn.querySelector('.cf-submit-text').textContent = 'Send Message';
    }
  });
})();

// ===============================================
// WHY ME — Letter glitch bg + tilt cards
// ===============================================
(function () {
  // Letter Glitch
  const canvas = document.getElementById('glitch-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>[]{}';
  const colors = ['#ff5500', '#ff7733', '#ff6600', '#ff7700', '#ff9900'];
  const CW = 11, CH = 19, FS = 13;
  let letters = [], cols = 0, rows = 0, last = 0;

  function resize() {
    const s = canvas.parentElement;
    canvas.width  = s.offsetWidth;
    canvas.height = s.offsetHeight;
    cols = Math.ceil(canvas.width  / CW);
    rows = Math.ceil(canvas.height / CH);
    letters = Array.from({ length: cols * rows }, () => ({
      ch:  chars[Math.floor(Math.random() * chars.length)],
      col: colors[Math.floor(Math.random() * colors.length)]
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${FS}px monospace`;
    ctx.textBaseline = 'top';
    letters.forEach((l, i) => {
      ctx.fillStyle = l.col;
      ctx.fillText(l.ch, (i % cols) * CW, Math.floor(i / cols) * CH);
    });
  }

  function update() {
    const n = Math.max(1, Math.floor(letters.length * 0.015));
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * letters.length);
      letters[idx].ch  = chars[Math.floor(Math.random() * chars.length)];
      letters[idx].col = colors[Math.floor(Math.random() * colors.length)];
    }
  }

  function tick(t) {
    requestAnimationFrame(tick);
    if (t - last < 90) return;
    last = t; update(); draw();
  }

  resize(); draw(); requestAnimationFrame(tick);
  window.addEventListener('resize', () => { resize(); draw(); });

  // Tilt + spotlight
  document.querySelectorAll('.wm-card').forEach(card => {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    let sx = 0, sy = 0, tsx = 0, tsy = 0;
    let hovered = false, raf;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function loop() {
      cx = lerp(cx, tx, 0.08); cy = lerp(cy, ty, 0.08);
      sx = lerp(sx, tsx, 0.1); sy = lerp(sy, tsy, 0.1);
      card.style.transform = `perspective(900px) rotateX(${cy}deg) rotateY(${cx}deg) scale(${hovered ? 1.015 : 1})`;
      card.style.setProperty('--mx', sx + 'px');
      card.style.setProperty('--my', sy + 'px');
      if (hovered || Math.abs(cx - tx) > 0.01 || Math.abs(cy - ty) > 0.01)
        raf = requestAnimationFrame(loop);
    }

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      tx = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * 6;
      ty = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -4;
      tsx = e.clientX - r.left; tsy = e.clientY - r.top;
    });
    card.addEventListener('mouseenter', () => { hovered = true;  cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); });
    card.addEventListener('mouseleave', () => { hovered = false; tx = 0; ty = 0; raf = requestAnimationFrame(loop); });
  });
})();

// ===============================================
// HERO — ColorBends background (Deep burn)
// ===============================================
(function () {
  function initColorBends() {
  const canvas = document.getElementById('hero-colorbends');
  if (!canvas) return;

  const MAX_C = 8;

  const frag = `
#define MAX_COLORS 8
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  q += (uPointer - rp) * uMouseInfluence * 0.2;

  vec3 col = vec3(0.0);
  vec2 s = q;
  vec3 sumCol = vec3(0.0);
  for (int i = 0; i < MAX_COLORS; ++i) {
    if (i >= uColorCount) break;
    s -= 0.01;
    vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
    float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
    float kBelow = clamp(uWarpStrength, 0.0, 1.0);
    float kMix = pow(kBelow, 0.3);
    float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
    vec2 warped = s + (r - s) * kBelow * gain;
    float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
    float m = mix(m0, m1, kMix);
    float w = 1.0 - exp(-6.0 / exp(6.0 * m));
    sumCol += uColors[i] * w;
  }
  col = clamp(sumCol, 0.0, 1.0);

  if (uNoise > 0.0001) {
    float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898,78.233))) * 43758.5453123);
    col = clamp(col + (n - 0.5) * uNoise, 0.0, 1.0);
  }

  gl_FragColor = vec4(col, 1.0);
}`;

  const vert = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }`;

  function hex(h) {
    h = h.replace('#','');
    return new THREE.Vector3(parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255);
  }

  const darkColors  = ['#050200','#ff5500','#ff6600','#ff9900','#100800','#000000'];
  const lightColors = ['#f5f0eb','#ffe8d6','#ffd4b0','#ffbf8a','#f0e8e0','#ffffff'];

  function getColors() {
    return document.body.classList.contains('light-mode') ? lightColors : darkColors;
  }

  const uColors = Array.from({length: MAX_C}, () => new THREE.Vector3(0,0,0));
  function applyColors(cols) { cols.forEach((c,i) => uColors[i].copy(hex(c))); }
  applyColors(getColors());

  // Watch for light/dark toggle
  const modeObserver = new MutationObserver(() => applyColors(getColors()));
  modeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // keep backward compat
  const colors = darkColors;

  const rad = -20 * Math.PI / 180;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert, fragmentShader: frag,
    uniforms: {
      uCanvas:        { value: new THREE.Vector2(1,1) },
      uTime:          { value: 0 },
      uSpeed:         { value: 0.2 },
      uRot:           { value: new THREE.Vector2(Math.cos(rad), Math.sin(rad)) },
      uColorCount:    { value: colors.length },
      uColors:        { value: uColors },
      uScale:         { value: 0.9 },
      uFrequency:     { value: 1.1 },
      uWarpStrength:  { value: 1.2 },
      uPointer:       { value: new THREE.Vector2(0,0) },
      uMouseInfluence:{ value: 0.0 },
      uParallax:      { value: 0.5 },
      uNoise:         { value: 0.03 }
    }
  });

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2), mat));

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 1);

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // force canvas to cover full viewport
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    renderer.setSize(w, h, false);
    mat.uniforms.uCanvas.value.set(w, h);
  }
  resize();
  window.addEventListener('resize', resize);

  // Fade out canvas as user scrolls past hero
  const fadeBottom = document.querySelector('.hero-fade-bottom');
  function getMaxOpacity() {
    return document.body.classList.contains('light-mode') ? 0.35 : 1;
  }
  function updateCanvasOpacity() {
    const heroH = window.innerHeight;
    const scrollY = window.scrollY;
    const maxOp = getMaxOpacity();
    const opacity = Math.max(0, maxOp - (scrollY / (heroH * 0.4)) * maxOp);
    canvas.style.opacity = opacity;
    if (fadeBottom) fadeBottom.style.opacity = scrollY > heroH ? '0' : '1';
  }
  window.addEventListener('scroll', updateCanvasOpacity, { passive: true });
  // Also update when mode toggles
  const opacityObserver = new MutationObserver(updateCanvasOpacity);
  opacityObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  const pT = new THREE.Vector2(0,0), pC = new THREE.Vector2(0,0);
  window.addEventListener('pointermove', e => {
    const r = canvas.parentElement.getBoundingClientRect();
    pT.set(((e.clientX-r.left)/r.width)*2-1, -(((e.clientY-r.top)/r.height)*2-1));
  });

  const clock = new THREE.Clock();
  (function tick() {
    requestAnimationFrame(tick);
    mat.uniforms.uTime.value = clock.getElapsedTime();
    pC.lerp(pT, 0.06);
    mat.uniforms.uPointer.value.copy(pC);
    renderer.render(scene, camera);
  })();
  } // end initColorBends

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initColorBends);
  } else {
    setTimeout(initColorBends, 0);
  }
})();

// ===============================================
// HERO — Lanyard physics drag (bounce, card-only grab)
// ===============================================
(function () {
  const scene = document.getElementById('lanyard-scene');
  const wrap  = document.getElementById('lyard-card-wrap');
  const pb    = document.getElementById('lpath-base');
  const ps    = document.getElementById('lpath-stripe');
  const card  = wrap && wrap.querySelector('.lyard-card');
  if (!scene || !wrap || !card) return;

  let dragging = false;
  let angle = 0, vel = 0;
  let startX = 0, startAngle = 0;
  let time = 0;

  // spring constants — bouncy feel
  const STIFFNESS    = 0.045;
  const DAMPING      = 0.88;
  const RELEASE_BOOST = 1.6;
  const IDLE_AMP     = 0.0;    // no idle swing
  const IDLE_SPEED   = 0.012;

  function rope(a) {
    const cx = 80 + a * 75;
    const d  = `M 80 0 Q ${cx} 70 80 140`;
    pb && pb.setAttribute('d', d);
    ps && ps.setAttribute('d', d);
  }

  (function tick() {
    requestAnimationFrame(tick);
    if (!dragging) {
      time += IDLE_SPEED;
      // blend idle sine into spring: target oscillates instead of resting at 0
      const target = Math.sin(time) * IDLE_AMP;
      vel   += (target - angle) * STIFFNESS;
      vel   *= DAMPING;
      angle += vel;
      const deg = angle * (180 / Math.PI);
      wrap.style.transform = `rotate(${deg}deg)`;
      rope(angle);
    }
  })();

  // Only allow drag if pointer goes down on the card itself
  card.addEventListener('pointerdown', e => {
    e.stopPropagation();
    dragging = true;
    card.setPointerCapture(e.pointerId);
    startX     = e.clientX;
    startAngle = angle;
    wrap.style.animation = 'none';
    scene.style.cursor   = 'grabbing';
  });

  window.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx   = e.clientX - startX;
    angle      = startAngle + dx / 90;
    vel        = (e.movementX || 0) / 90;
    wrap.style.transform = `rotate(${angle * 13}deg) translateX(${dx * 0.08}px)`;
    rope(angle);
  });

  window.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;
    scene.style.cursor = 'grab';
    // boost velocity for extra bounce on release
    vel *= RELEASE_BOOST;
  });
})();

// ===============================================
// HERO — Gradual Blur (vanilla port of GradualBlur)
// ===============================================
(function () {
  const container = document.getElementById('hero-blur-bottom');
  if (!container) return;

  // Config matching: position=bottom, height=7rem, strength=2,
  // divCount=8, curve=bezier, exponential=true, opacity=1
  const DIV_COUNT  = 8;
  const STRENGTH   = 2;
  const EXPONENTIAL = true;
  const OPACITY    = 1;

  function bezier(p) { return p * p * (3 - 2 * p); }

  const increment = 100 / DIV_COUNT;

  for (let i = 1; i <= DIV_COUNT; i++) {
    let progress = bezier(i / DIV_COUNT);
    const blurVal = EXPONENTIAL
      ? Math.pow(2, progress * 4) * 0.0625 * STRENGTH
      : 0.0625 * (progress * DIV_COUNT + 1) * STRENGTH;

    const p1 = Math.round((increment * i - increment) * 10) / 10;
    const p2 = Math.round(increment * i * 10) / 10;
    const p3 = Math.round((increment * i + increment) * 10) / 10;
    const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

    let gradient = `transparent ${p1}%, black ${p2}%`;
    if (p3 <= 100) gradient += `, black ${p3}%`;
    if (p4 <= 100) gradient += `, transparent ${p4}%`;

    const mask = `linear-gradient(to bottom, ${gradient})`;
    const blurStr = `blur(${blurVal.toFixed(3)}rem)`;

    const div = document.createElement('div');
    div.style.cssText = [
      'position:absolute', 'inset:0',
      `mask-image:${mask}`,
      `-webkit-mask-image:${mask}`,
      `backdrop-filter:${blurStr}`,
      `-webkit-backdrop-filter:${blurStr}`,
      `opacity:${OPACITY}`
    ].join(';');
    container.appendChild(div);
  }
})();

// ── GooeyNav ──────────────────────────────────────────────────────────────
(function() {
    const container = document.getElementById('gooeyNav');
    const filterEl = document.getElementById('gooeyFilter');
    if (!container || !filterEl) return;

    const links = container.querySelectorAll('.gooey-nav-links a');
    let activeLink = links[0];
    let activeIndex = 0;

    const noise = (n = 1) => n / 2 - Math.random() * n;
    const getXY = (dist, idx, total) => {
        const angle = ((360 + noise(8)) / total) * idx * (Math.PI / 180);
        return [dist * Math.cos(angle), dist * Math.sin(angle)];
    };

    function makeParticles(el) {
        const count = 14, animTime = 600, variance = 300;
        el.style.setProperty('--gp-time', `${animTime * 2 + variance}ms`);
        for (let i = 0; i < count; i++) {
            const t = animTime * 2 + noise(variance * 2);
            const rotate = noise(10);
            const start = getXY(80, count - i, count);
            const end = getXY(8 + noise(7), count - i, count);
            const scale = 1 + noise(0.2);
            const rotDeg = rotate > 0 ? (rotate + 5) * 10 : (rotate - 5) * 10;
            el.classList.remove('active');
            setTimeout(() => {
                const p = document.createElement('span');
                const pt = document.createElement('span');
                p.className = 'gooey-particle';
                p.style.cssText = `--sx:${start[0]}px;--sy:${start[1]}px;--ex:${end[0]}px;--ey:${end[1]}px;--gp-time:${t}ms;--sc:${scale};--rot:${rotDeg}deg`;
                pt.className = 'gooey-point';
                p.appendChild(pt);
                el.appendChild(p);
                requestAnimationFrame(() => el.classList.add('active'));
                setTimeout(() => { try { el.removeChild(p); } catch {} }, t);
            }, 30);
        }
    }

    function updatePos(el) {
        const cr = container.getBoundingClientRect();
        const pos = el.closest('li').getBoundingClientRect();
        filterEl.style.left = `${pos.x - cr.x}px`;
        filterEl.style.top = `${pos.y - cr.y}px`;
        filterEl.style.width = `${pos.width}px`;
        filterEl.style.height = `${pos.height}px`;
    }

    links.forEach((link, i) => {
        link.addEventListener('mouseenter', () => {
            if (activeIndex === i) return;
            activeIndex = i;
            activeLink.classList.remove('active');
            link.classList.add('active');
            activeLink = link;
            updatePos(link);
            filterEl.querySelectorAll('.gooey-particle').forEach(p => filterEl.removeChild(p));
            makeParticles(filterEl);
        });
    });

    // set initial active
    if (links[0]) { links[0].classList.add('active'); updatePos(links[0]); }

    // update on scroll for active section
    window.addEventListener('scroll', () => {
        const sections = ['about','skills','projects','experience','contact'];
        let current = '';
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el && window.scrollY >= el.offsetTop - 200) current = id;
        });
        links.forEach((link, i) => {
            const href = link.getAttribute('href').replace('#','');
            if (href === current) {
                if (activeIndex !== i) {
                    activeIndex = i;
                    activeLink.classList.remove('active');
                    link.classList.add('active');
                    activeLink = link;
                    updatePos(link);
                }
            }
        });
    }, { passive: true });
})();

/* =========================================
   REAL SCREEN SIZE DETECTION
   detects actual device width, not the fake 1280px viewport
   ========================================= */
(function() {
    function checkMobile() {
        // window.screen.width is the real hardware pixel width
        // window.devicePixelRatio accounts for retina screens
        var realWidth = window.screen.width;
        if (realWidth <= 768) {
            document.body.classList.add('is-mobile');
        } else {
            document.body.classList.remove('is-mobile');
        }
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
})();
