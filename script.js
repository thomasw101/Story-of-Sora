/* ============================================
   THE STORY OF SORA - $STORY
   Interactive JavaScript
   ============================================ */

// ============================================
// Custom Pen Cursor
// ============================================
const penCursor = document.getElementById('pen-cursor');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    penCursor.style.left = mouseX + 'px';
    penCursor.style.top = mouseY + 'px';
});

document.addEventListener('mouseenter', () => {
    penCursor.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    penCursor.style.opacity = '0';
});

// ============================================
// Drawing Canvas
// ============================================
const canvas = document.getElementById('draw-canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let inkStrokes = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redrawStrokes();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Ink stroke class for fading effect
class InkStroke {
    constructor(points) {
        this.points = points;
        this.opacity = 1;
        this.createdAt = Date.now();
        this.fadeDelay = 3000; // Start fading after 3 seconds
        this.fadeDuration = 2000; // Fade over 2 seconds
    }

    update() {
        const age = Date.now() - this.createdAt;
        if (age > this.fadeDelay) {
            const fadeProgress = (age - this.fadeDelay) / this.fadeDuration;
            this.opacity = Math.max(0, 1 - fadeProgress);
        }
        return this.opacity > 0;
    }

    draw(ctx) {
        if (this.points.length < 2) return;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(44, 24, 16, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.stroke();
    }
}

let currentStroke = [];

canvas.addEventListener('mousedown', (e) => {
    // Only draw if not clicking on interactive elements
    if (e.target === canvas) {
        isDrawing = true;
        lastX = e.clientX;
        lastY = e.clientY;
        currentStroke = [{ x: lastX, y: lastY }];
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const x = e.clientX;
    const y = e.clientY;
    currentStroke.push({ x, y });

    // Draw current stroke
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(44, 24, 16, 1)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
});

canvas.addEventListener('mouseup', () => {
    if (isDrawing && currentStroke.length > 1) {
        inkStrokes.push(new InkStroke([...currentStroke]));
    }
    isDrawing = false;
    currentStroke = [];
});

canvas.addEventListener('mouseleave', () => {
    if (isDrawing && currentStroke.length > 1) {
        inkStrokes.push(new InkStroke([...currentStroke]));
    }
    isDrawing = false;
    currentStroke = [];
});

function redrawStrokes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    inkStrokes.forEach(stroke => stroke.draw(ctx));
}

function animateCanvas() {
    // Update and filter strokes
    inkStrokes = inkStrokes.filter(stroke => stroke.update());
    
    // Clear and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    inkStrokes.forEach(stroke => stroke.draw(ctx));

    // Draw current stroke if drawing
    if (isDrawing && currentStroke.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(44, 24, 16, 1)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
        for (let i = 1; i < currentStroke.length; i++) {
            ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
        }
        ctx.stroke();
    }

    requestAnimationFrame(animateCanvas);
}

animateCanvas();

// ============================================
// Floating Particles
// ============================================
const particlesContainer = document.getElementById('particles');
const particleCount = 30;

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (10 + Math.random() * 10) + 's';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.width = (2 + Math.random() * 3) + 'px';
    particle.style.height = particle.style.width;
    
    // Vary the color between gold and ember
    const colors = ['#d4af37', '#b8942e', '#ff6b35', '#f5e6d3'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    particlesContainer.appendChild(particle);
}

for (let i = 0; i < particleCount; i++) {
    createParticle();
}

// ============================================
// Scroll Animations
// ============================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for scroll animation
document.querySelectorAll('.artifact, .flow-step, .token-card, .chapter').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

// ============================================
// Smooth Scroll for Navigation
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ============================================
// Copy Contract Address
// ============================================
const copyBtn = document.getElementById('copy-ca');
const caText = document.getElementById('ca-text');

copyBtn.addEventListener('click', () => {
    const text = caText.textContent;
    if (text !== 'Launching Soon...') {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    }
});

// ============================================
// Parallax Effect on Hero
// ============================================
const heroSora = document.querySelector('.hero-sora');
const heroBook = document.querySelector('.hero-book');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = document.querySelector('.hero').offsetHeight;
    
    if (scrollY < heroHeight) {
        const parallaxValue = scrollY * 0.3;
        heroSora.style.transform = `translateY(${-parallaxValue * 0.5}px) rotate(-2deg)`;
    }
});

// Mouse parallax on hero
document.querySelector('.hero').addEventListener('mousemove', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

    heroSora.style.transform = `translate(${x * 20}px, ${y * 10}px) rotate(${-2 + x * 2}deg)`;
});

// ============================================
// Navigation Background on Scroll
// ============================================
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(15, 15, 26, 0.98)';
    } else {
        nav.style.background = 'linear-gradient(to bottom, rgba(15, 15, 26, 0.95), transparent)';
    }
});

// ============================================
// Chapter Hover Effects
// ============================================
document.querySelectorAll('.chapter').forEach(chapter => {
    chapter.addEventListener('mouseenter', () => {
        chapter.querySelector('.chapter-content').style.transform = 'translateX(10px)';
    });
    
    chapter.addEventListener('mouseleave', () => {
        chapter.querySelector('.chapter-content').style.transform = 'translateX(0)';
    });
});

// ============================================
// Buy Button URL Configuration
// ============================================
// UPDATE THIS URL AFTER LAUNCHING YOUR COIN
const BUY_URL = '#'; // Replace with your pump.fun link

document.getElementById('buy-btn').href = BUY_URL;
document.getElementById('footer-buy').href = BUY_URL;

// ============================================
// Contract Address Configuration
// ============================================
// UPDATE THIS AFTER LAUNCHING YOUR COIN
const CONTRACT_ADDRESS = 'Launching Soon...'; // Replace with actual CA

document.getElementById('ca-text').textContent = CONTRACT_ADDRESS;

// ============================================
// Typewriter Effect for Tagline (Optional)
// ============================================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// ============================================
// Add some randomized floating ash particles
// ============================================
function createAshParticle() {
    const ash = document.createElement('div');
    ash.style.cssText = `
        position: fixed;
        width: ${1 + Math.random() * 2}px;
        height: ${1 + Math.random() * 2}px;
        background: rgba(61, 61, 61, ${0.3 + Math.random() * 0.3});
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        left: ${Math.random() * 100}%;
        top: -10px;
        animation: ash-fall ${5 + Math.random() * 10}s linear forwards;
    `;
    
    document.body.appendChild(ash);
    
    setTimeout(() => {
        ash.remove();
    }, 15000);
}

// Add ash animation keyframes dynamically
const ashStyle = document.createElement('style');
ashStyle.textContent = `
    @keyframes ash-fall {
        0% {
            transform: translateY(0) rotate(0deg) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg) translateX(${-50 + Math.random() * 100}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(ashStyle);

// Create ash particles periodically
setInterval(createAshParticle, 500);

// ============================================
// Console Easter Egg
// ============================================
console.log(`
%c🦊 The Story of Sora 🦊
%c$STORY

"Every buy is a heartbeat. Every sell, a cold wind. 
The blockchain writes — Sora lives."

Follow the journey: https://x.com/storytimeliveai
`, 
'font-size: 24px; font-weight: bold; color: #d4af37;',
'font-size: 14px; color: #f5e6d3;'
);
