/* =============================================
   SCRIPT.JS — Homenagem Especial
   ============================================= */

// ─────────────────────────────────────────────
// 1. CURSOR PERSONALIZADO
// ─────────────────────────────────────────────
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX  = 0, trailY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  if (cursorTrail) {
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
  }
  requestAnimationFrame(animateTrail);
}
animateTrail();


// ─────────────────────────────────────────────
// 2. NAVBAR SCROLL
// ─────────────────────────────────────────────
const navbar   = document.getElementById('navbar');
const backTop  = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);
  backTop.classList.toggle('visible', y > 500);
});

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ─────────────────────────────────────────────
// 3. MENU HAMBURGER
// ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


// ─────────────────────────────────────────────
// 4. CANVAS — TEIA DO HERÓI
// ─────────────────────────────────────────────
function initWebCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  // Nós da teia
  const nodes = [];
  const TOTAL  = 30;

  for (let i = 0; i < TOTAL; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Atualiza posições
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    // Desenha linhas da teia
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxD = 200;

        if (dist < maxD) {
          const alpha = (1 - dist / maxD) * 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(192, 57, 43, ${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();

          // Ponto no nó
          ctx.beginPath();
          ctx.arc(nodes[i].x, nodes[i].y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(192, 57, 43, ${alpha * 1.5})`;
          ctx.fill();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}

initWebCanvas('webCanvas');
initWebCanvas('webCanvasConexao');


// ─────────────────────────────────────────────
// 5. PARTÍCULAS FLUTUANTES (HERO)
// ─────────────────────────────────────────────
function createParticles(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 3 + 1;
    const isRed = Math.random() > 0.5;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${isRed ? '#c0392b' : '#2e60a8'};
      animation-duration: ${8 + Math.random() * 12}s;
      animation-delay: ${Math.random() * 8}s;
      box-shadow: 0 0 ${size * 3}px ${isRed ? '#c0392b' : '#2e60a8'};
    `;

    container.appendChild(p);
  }
}

createParticles('particles', 35);
createParticles('mensagemParticles', 25);


// ─────────────────────────────────────────────
// 6. DIGITAÇÃO — FRASE HERO
// ─────────────────────────────────────────────
const typingEl = document.getElementById('typingText');
const phrases  = [
  'Tenho muito orgulho de você.',
  'Você é incrível.',
  'Uma força da natureza.',
  'Minha admiração é real.',
];

let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;
let typingPaused = false;

function type() {
  if (!typingEl) return;
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    charIndex--;
    typingEl.textContent = currentPhrase.slice(0, charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 500);
      return;
    }
    setTimeout(type, 40);
  } else {
    charIndex++;
    typingEl.textContent = currentPhrase.slice(0, charIndex);
    if (charIndex === currentPhrase.length) {
      typingPaused = true;
      setTimeout(() => {
        typingPaused = false;
        isDeleting = true;
        type();
      }, 2800);
      return;
    }
    setTimeout(type, 70);
  }
}

// Inicia digitação após leve delay
setTimeout(type, 1200);


// ─────────────────────────────────────────────
// 7. SCROLL REVEAL
// ─────────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));


// ─────────────────────────────────────────────
// 8. PARALLAX SUTIL NO HERO
// ─────────────────────────────────────────────
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (heroContent && scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
    heroContent.style.opacity   = 1 - scrollY / (window.innerHeight * 0.8);
  }
});


// ─────────────────────────────────────────────
// 9. GALERIA — LIGHTBOX SIMPLES
// ─────────────────────────────────────────────
function initLightbox() {
  const cards = document.querySelectorAll('.gallery-card');

  // Cria overlay
  const overlay = document.createElement('div');
  overlay.id    = 'lightboxOverlay';
  overlay.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.92);
    z-index: 9000;
    align-items: center;
    justify-content: center;
    cursor: none;
    backdrop-filter: blur(8px);
  `;

  const img = document.createElement('img');
  img.style.cssText = `
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border: 1px solid rgba(192,57,43,0.3);
    box-shadow: 0 0 60px rgba(192,57,43,0.2);
    animation: fadeInScale 0.3s ease;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    position: absolute;
    top: 2rem; right: 2rem;
    background: none;
    border: 1px solid rgba(192,57,43,0.5);
    color: #f5f0eb;
    width: 44px; height: 44px;
    font-size: 1rem;
    cursor: none;
    transition: 0.3s;
  `;

  closeBtn.addEventListener('mouseover', () => {
    closeBtn.style.background = '#c0392b';
  });
  closeBtn.addEventListener('mouseout', () => {
    closeBtn.style.background = 'none';
  });

  // Inject fade keyframe
  if (!document.getElementById('lightboxStyle')) {
    const style = document.createElement('style');
    style.id = 'lightboxStyle';
    style.textContent = `
      @keyframes fadeInScale {
        from { opacity: 0; transform: scale(0.92); }
        to   { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  overlay.appendChild(img);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  function openLightbox(src) {
    img.src = src;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const cardImg = card.querySelector('img');
      if (cardImg) openLightbox(cardImg.src);
    });
    card.style.cursor = 'none';
  });

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
}

initLightbox();


// ─────────────────────────────────────────────
// 10. MÚSICA DE FUNDO (toggle)
// ─────────────────────────────────────────────
const musicBtn  = document.getElementById('musicBtn');
const bgMusic   = document.getElementById('bgMusic');
let   isPlaying = false;

musicBtn.addEventListener('click', () => {
  if (!bgMusic.src || bgMusic.src === window.location.href) {
    // Sem música configurada — feedback visual
    musicBtn.style.borderColor = '#e74c3c';
    setTimeout(() => {
      musicBtn.style.borderColor = '';
    }, 800);
    return;
  }

  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
    musicBtn.classList.remove('playing');
    musicBtn.querySelector('.music-icon').textContent = '♪';
  } else {
    bgMusic.play().then(() => {
      isPlaying = true;
      musicBtn.classList.add('playing');
      musicBtn.querySelector('.music-icon').textContent = '■';
    }).catch(() => {});
  }
});


// ─────────────────────────────────────────────
// 11. CONTADOR ANIMADO (Conquistas)
// ─────────────────────────────────────────────
// Efeito de brilho pulsante nos cards de conquista ao entrar na viewport
const conquistaCards = document.querySelectorAll('.conquista-card');

const conquistaObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
      }
    });
  },
  { threshold: 0.1 }
);

conquistaCards.forEach(card => {
  conquistaObserver.observe(card);
});


// ─────────────────────────────────────────────
// 12. EFEITO NEON GLITCH no nome do herói
// ─────────────────────────────────────────────
function heroNameGlitch() {
  const heroName = document.getElementById('heroName');
  if (!heroName) return;

  heroName.addEventListener('mouseenter', () => {
    heroName.style.filter = `drop-shadow(0 0 20px rgba(192,57,43,0.8))`;
    const lines = heroName.querySelectorAll('.name-line');
    lines.forEach((line, i) => {
      setTimeout(() => {
        line.style.transform = `translateX(${(Math.random() - 0.5) * 6}px)`;
        setTimeout(() => {
          line.style.transform = '';
        }, 120);
      }, i * 50);
    });
  });

  heroName.addEventListener('mouseleave', () => {
    heroName.style.filter = '';
  });
}

heroNameGlitch();


// ─────────────────────────────────────────────
// 13. SMOOTH SCROLL para links internos
// ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});


// ─────────────────────────────────────────────
// 14. EFEITO HOVER MAGNÉTICO nos botões
// ─────────────────────────────────────────────
document.querySelectorAll('.hero-btn, .back-top, .music-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect   = btn.getBoundingClientRect();
    const x      = e.clientX - rect.left - rect.width  / 2;
    const y      = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});


// ─────────────────────────────────────────────
// 15. TAG SHIMMER ao scroll
// ─────────────────────────────────────────────
function addShimmerToTags() {
  const tags = document.querySelectorAll('.tag');
  tags.forEach((tag, i) => {
    tag.addEventListener('mouseenter', () => {
      tag.style.setProperty('--shimmer-pos', '200%');
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.setProperty('--shimmer-pos', '-200%');
    });
  });
}

addShimmerToTags();


// ─────────────────────────────────────────────
// 16. INDICAÇÃO MOBILE: swipe na galeria
// ─────────────────────────────────────────────
let touchStartX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });


// ─────────────────────────────────────────────
// 17. ANIMAÇÃO DE ENTRADA DO HERO
// ─────────────────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';

  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

  // Inicializa reveals visíveis na viewport ao carregar
  setTimeout(() => {
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add('visible');
      }
    });
  }, 300);
});


// ─────────────────────────────────────────────
// 18. EFEITO TEIA no hover da seção conexão
// ─────────────────────────────────────────────
const conexaoSection = document.querySelector('.conexao');

if (conexaoSection) {
  conexaoSection.addEventListener('mousemove', (e) => {
    const rect = conexaoSection.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
    const content = conexaoSection.querySelector('.conexao-content');
    if (content) {
      content.style.transform = `translate(${x * 0.5}px, ${y * 0.3}px)`;
    }
  });

  conexaoSection.addEventListener('mouseleave', () => {
    const content = conexaoSection.querySelector('.conexao-content');
    if (content) content.style.transform = '';
  });
}


// ─────────────────────────────────────────────
// 19. RESIZE HANDLER
// ─────────────────────────────────────────────
window.addEventListener('resize', () => {
  // Fecha menu mobile ao redimensionar
  if (window.innerWidth > 768) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});


// ─────────────────────────────────────────────
// 20. CONSOLE LOVE MESSAGE ♡
// ─────────────────────────────────────────────
console.log(
  '%c✦ Feito com muito carinho ✦\n' +
  '%cPara alguém que merece o mundo inteiro.',
  'color: #c0392b; font-size: 1.2rem; font-weight: bold;',
  'color: #aaa; font-size: 0.9rem;'
);
