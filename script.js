// Initialize Lenis Smooth Scrolling
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Update GSAP with Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// Preloader Logic
window.addEventListener('load', () => {
    setTimeout(() => {
        gsap.to('.preloader', {
            yPercent: -100,
            duration: 1.5,
            ease: 'power4.inOut',
            onComplete: () => {
                document.body.classList.remove('loading');
                initHeroAnimations();
            }
        });
    }, 2000); // Give the preloader text time to animate
});

function initHeroAnimations() {
    gsap.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 2,
        ease: 'power4.out'
    });
    
    gsap.from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 2,
        delay: 0.4,
        ease: 'power4.out'
    });

    gsap.from('.scroll-indicator', {
        y: 30,
        opacity: 0,
        duration: 1.5,
        delay: 1,
        ease: 'power3.out'
    });
}

// Custom Cursor & Magnetic Elements
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

// Detect if it's a non-touch device (desktop)
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.body.classList.add('has-custom-cursor');

    // Use gsap.quickTo for high performance cursor tracking
    const xToCursor = gsap.quickTo(cursor, "x", {duration: 0.1, ease: "power3"});
    const yToCursor = gsap.quickTo(cursor, "y", {duration: 0.1, ease: "power3"});
    
    const xToFollower = gsap.quickTo(follower, "x", {duration: 0.6, ease: "power3"});
    const yToFollower = gsap.quickTo(follower, "y", {duration: 0.6, ease: "power3"});

    window.addEventListener('mousemove', (e) => {
        xToCursor(e.clientX);
        yToCursor(e.clientY);
        xToFollower(e.clientX);
        yToFollower(e.clientY);
    });

    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        
        btn.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
        });
        
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            // Magnetic pull effect
            const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
            gsap.to(btn, { x: x, y: y, duration: 0.5, ease: 'power3.out' });
        });
    });
}

// Ambient Audio Toggle
const audio = document.getElementById('ambient-audio');
const audioBtn = document.getElementById('audio-toggle');

if(audioBtn && audio) {
    audio.volume = 0.4; // Soft background volume
    audioBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(e => console.log("Audio play failed:", e));
            audioBtn.classList.add('playing');
        } else {
            audio.pause();
            audioBtn.classList.remove('playing');
        }
    });
}

// Cinematic Reveals
const revealElements = document.querySelectorAll('.gs_reveal');
revealElements.forEach(elem => {
    let x = 0, y = 70;
    if(elem.classList.contains('gs_reveal_left')) { x = -100; y = 0; }
    if(elem.classList.contains('gs_reveal_right')) { x = 100; y = 0; }
    if(elem.classList.contains('gs_reveal_up')) { y = 100; }
    
    let delay = 0;
    if(elem.classList.contains('delay-1')) delay = 0.15;
    if(elem.classList.contains('delay-2')) delay = 0.3;
    if(elem.classList.contains('delay-3')) delay = 0.45;

    gsap.fromTo(elem, 
        { x: x, y: y, opacity: 0 },
        {
            x: 0, y: 0, opacity: 1,
            duration: 1.8,
            delay: delay,
            ease: "power4.out",
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Parallax Images
gsap.utils.toArray('.parallax-img').forEach(img => {
    gsap.to(img, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// Navbar Scrolled State
const navbar = document.querySelector('.navbar');
ScrollTrigger.create({
    start: "top -100",
    end: 99999,
    toggleClass: {className: 'scrolled', targets: navbar}
});

// Simple Ambient Particles in Hero
const particlesContainer = document.getElementById('particles');
if(particlesContainer) {
    for(let i=0; i<30; i++) {
        let particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255,255,255,0.3)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particlesContainer.appendChild(particle);

        // Animate particles slowly drifting
        gsap.to(particle, {
            y: `-=${Math.random() * 200 + 100}`,
            x: `+=${Math.random() * 100 - 50}`,
            opacity: 0,
            duration: Math.random() * 10 + 10,
            repeat: -1,
            ease: "none",
            delay: -Math.random() * 20
        });
    }
}
