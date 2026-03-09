lucide.createIcons();

// ===============================================
// 1. HERO ACHTERGROND FOTO FADE (MAAKT REST ZWART)
// ===============================================
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
});

// ===============================================
// 2. CURVED TEXT (NAADLOZE LOOP)
// ===============================================
function initCurvedText() {
    const textPath = document.getElementById('curvedTextPath');
    if (!textPath) return;
    let offset = 0;
    function animate() {
        offset -= 0.2;
        if (offset <= -25) offset = 0;
        textPath.setAttribute('startOffset', `${offset}%`);
        requestAnimationFrame(animate);
    }
    animate();
}
initCurvedText();

// ===============================================
// 3. STEALTH PARTICLES (REAGEERT OP MUIS)
// ===============================================
class SideAntigravity {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -5000, y: -5000 };
        this.init();
    }
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => { this.mouse.x = e.offsetX; this.mouse.y = e.offsetY; });
        this.canvas.addEventListener('mouseleave', () => { this.mouse.x = -5000; });
        for (let i = 0; i < 80; i++) {
            this.particles.push({ x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height, w: 2, h: Math.random() * 12 + 6, speedY: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.5 + 0.2 });
        }
        this.animate();
    }
    resize() { this.canvas.width = this.canvas.clientWidth; this.canvas.height = this.canvas.parentElement.offsetHeight; }
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => {
            p.y -= p.speedY;
            const dx = p.x - this.mouse.x; const dy = p.y - this.mouse.y; const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) { const force = (150 - dist) / 150; p.x += (dx / dist) * force * 10; p.y += (dy / dist) * force * 10; }
            if (p.y < -20) p.y = this.canvas.height + 20; if (p.x < 0) p.x = this.canvas.width; if (p.x > this.canvas.width) p.x = 0;
            this.ctx.fillStyle = `rgba(255, 107, 53, ${p.opacity})`; this.ctx.beginPath(); this.ctx.roundRect(p.x, p.y, p.w, p.h, 5); this.ctx.fill();
        });
        requestAnimationFrame(() => this.animate());
    }
}
const lSide = document.getElementById('leftParticles');
const rSide = document.getElementById('rightParticles');
if (lSide) new SideAntigravity(lSide); if (rSide) new SideAntigravity(rSide);

// ===============================================
// 4. OVERIGE EFFECTEN
// ===============================================
function createCircularText() {
    const circularText = document.getElementById('circularText');
    if (!circularText) return;
    const text = "• FABIAN CORSALINI • PORTFOLIO 2026 ";
    text.split('').forEach((char, i) => {
        const span = document.createElement('span'); span.textContent = char; span.style.transform = `rotate(${(360 / text.length) * i}deg)`; circularText.appendChild(span);
    });
}
createCircularText();

const typedTextElement = document.getElementById('typedText');
const texts = ['Creative Software Developer', 'Web Developer', 'UI/UX Enthusiast'];
let textIndex = 0, charIndex = 0, isDeleting = false;
function type() {
    const currentText = texts[textIndex];
    if (isDeleting) { typedTextElement.textContent = currentText.substring(0, charIndex - 1); charIndex--; }
    else { typedTextElement.textContent = currentText.substring(0, charIndex + 1); charIndex++; }
    if (!isDeleting && charIndex === currentText.length) { isDeleting = true; setTimeout(type, 2000); }
    else if (isDeleting && charIndex === 0) { isDeleting = false; textIndex = (textIndex + 1) % texts.length; setTimeout(type, 500); }
    else { setTimeout(type, isDeleting ? 50 : 100); }
}
type();

const heroPhoto = document.getElementById('heroPhoto');
window.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768 && heroPhoto) {
        const x = (e.clientX / window.innerWidth - 0.5) * 30; const y = (e.clientY / window.innerHeight - 0.5) * 30; heroPhoto.style.transform = `translate(${x}px, ${y}px)`;
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            anime({ targets: entry.target.querySelectorAll('.animate-card, .animate-text, .stat-item, .timeline-item, .bento-box'), translateY: [50, 0], opacity: [0, 1], delay: anime.stagger(100), easing: 'easeOutExpo' });
            if (entry.target.id === 'experience') { growJourneyPlant(); }
            observer.unobserve(entry.target);
        }
    });
});
document.querySelectorAll('.animate-section').forEach(section => observer.observe(section));

function growJourneyPlant() { anime({ targets: '.stem-path', strokeDashoffset: [1000, 0], duration: 2000, easing: 'easeInOutQuad', complete: animateBranches }); }
function animateBranches() {
    anime({ targets: '.branch-1', strokeDashoffset: [100, 0], opacity: [0, 1], duration: 600, easing: 'easeOutQuad', complete: () => showMilestone(1) });
    anime({ targets: '.branch-2', strokeDashoffset: [100, 0], opacity: [0, 1], duration: 600, delay: 400, easing: 'easeOutQuad', complete: () => showMilestone(2) });
    anime({ targets: '.branch-3', strokeDashoffset: [100, 0], opacity: [0, 0.6], duration: 600, delay: 800, easing: 'easeOutQuad', complete: () => showMilestone(3) });
}
function showMilestone(number) {
    const milestone = document.querySelector(`.milestone-${number}`);
    if (milestone) { milestone.classList.add('active'); anime({ targets: milestone, scale: [0, 1.2, 1], duration: 600, easing: 'easeOutElastic(1, .5)' }); }
}

document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    lucide.createIcons();
});

// ... (Houd je oude code hierboven)

// ===============================================
// 5. IMAGE TRAIL (SKILLS SECTION)
// ===============================================
const skillsSection = document.querySelector('.skills-trail-area');

// Lijst met plaatjes die tevoorschijn komen (vervang deze met je eigen URLs als je wilt)
const trailImages = [
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=300&auto=format&fit=crop", // Tech
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop", // Chip
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop", // Abstract
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&auto=format&fit=crop", // Code
    "https://images.unsplash.com/photo-1614741118881-1e4202994741?q=80&w=300&auto=format&fit=crop"  // Gradient
];

let trailIndex = 0;
let lastMouseX = 0;
let lastMouseY = 0;

if (skillsSection) {
    skillsSection.addEventListener('mousemove', (e) => {
        // Alleen een nieuw plaatje maken als de muis minstens 100px heeft bewogen (tegen chaos)
        const distance = Math.sqrt(Math.pow(e.clientX - lastMouseX, 2) + Math.pow(e.clientY - lastMouseY, 2));

        if (distance > 100) {
            spawnTrailImage(e.clientX, e.clientY);
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        }
    });
}

function spawnTrailImage(x, y) {
    // 1. Maak het plaatje aan
    const img = document.createElement('img');
    img.src = trailImages[trailIndex];
    img.classList.add('trail-image');

    // 2. Volgend plaatje klaarzetten voor de volgende keer
    trailIndex = (trailIndex + 1) % trailImages.length;

    // 3. Positie bepalen (rekening houdend met scroll)
    const rect = skillsSection.getBoundingClientRect();

    // Alleen spawnen als we binnen de sectie zijn
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        // Positie ten opzichte van de sectie
        const randomOffset = (Math.random() - 0.5) * 40; // Beetje variatie
        img.style.left = `${x - rect.left - 75 + randomOffset}px`; // -75 is de helft van de breedte (centreren)
        img.style.top = `${y - rect.top - 50 + randomOffset}px`;   // -50 is de helft van de hoogte

        // 4. Toevoegen aan de DOM
        skillsSection.appendChild(img);

        // 5. Opruimen na animatie (1 seconde)
        setTimeout(() => {
            img.remove();
        }, 1000);
    }
}