import * as THREE from 'three'

// ===== PRELOADER =====
function initPreloader() {
  const preloader = document.getElementById('preloader')
  if (!preloader) return
  const fill = preloader.querySelector('.preloader-fill')

  // Force the progress bar to complete, then fade out
  window.addEventListener('load', () => {
    if (fill) fill.style.width = '100%'
    setTimeout(() => {
      preloader.classList.add('loaded')
      setTimeout(() => preloader.remove(), 700)
    }, 500)
  })

  // Failsafe — never block page for more than 4 s
  setTimeout(() => {
    preloader?.classList.add('loaded')
    setTimeout(() => preloader?.remove(), 700)
  }, 4000)
}

// ===== THREE.JS HERO PARTICLES =====
function initHeroParticles() {
  const canvas = document.getElementById('heroCanvas')
  if (!canvas) return

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
  camera.position.z = 4

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Circular soft-glow sprite — fixes the default WebGL square particle look
  function makeSprite() {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0,   'rgba(255,255,255,1)')
    g.addColorStop(0.4, 'rgba(255,255,255,0.6)')
    g.addColorStop(1,   'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  }
  const sprite = makeSprite()

  function makePoints(count, spread, color, size, opacity) {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread[0]
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread[1]
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread[2]
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({
      color, size, transparent: true, opacity,
      sizeAttenuation: true, depthWrite: false,
      map: sprite, alphaTest: 0.001
    })
    return new THREE.Points(geo, mat)
  }

  const pts1 = makePoints(180, [14, 10, 6], 0xffd700, 0.10, 0.80)  // gold
  const pts2 = makePoints(380, [18, 13, 9], 0xffffff, 0.04, 0.50)  // white dust
  const pts3 = makePoints(90,  [12, 8,  5], 0x4fc3f7, 0.08, 0.60)  // teal
  scene.add(pts1, pts2, pts3)

  let targetX = 0, targetY = 0, curX = 0, curY = 0

  window.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 2
    targetY = (e.clientY / window.innerHeight - 0.5) * 2
  })
  window.addEventListener('touchmove', e => {
    const t = e.touches[0]
    targetX = (t.clientX / window.innerWidth  - 0.5) * 2
    targetY = (t.clientY / window.innerHeight - 0.5) * 2
  }, { passive: true })

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  let t = 0
  function tick() {
    requestAnimationFrame(tick)
    t++
    curX += (targetX - curX) * 0.04
    curY += (targetY - curY) * 0.04

    pts1.rotation.y =  t * 0.00035 + curX * 0.12
    pts1.rotation.x =  t * 0.00012 + curY * 0.06
    pts2.rotation.y = -t * 0.00022 + curX * 0.09
    pts2.rotation.x = -t * 0.00015 + curY * 0.04
    pts3.rotation.y =  t * 0.00028 - curX * 0.07
    pts3.rotation.x = -t * 0.00010 - curY * 0.05

    camera.position.x += (curX  * 0.28 - camera.position.x) * 0.06
    camera.position.y += (-curY * 0.20 - camera.position.y) * 0.06

    renderer.render(scene, camera)
  }
  tick()
}

// ===== HERO BACKGROUND PARALLAX =====
function initHeroParallax() {
  const slides = document.querySelectorAll('.hero-slide')
  if (!slides.length) return

  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.35
    slides.forEach(s => {
      s.style.backgroundPositionY = `calc(50% + ${y}px)`
    })
  }, { passive: true })
}

// ===== HERO SLIDER =====
const SLIDE_CONTENT = [
  {
    title: 'Journey to the Pearl of the Indian Ocean',
    text:  'Discover Sri Lanka — where ancient temples rise among emerald hills, pristine beaches meet turquoise seas, and every journey reveals a new wonder. Your perfect island escape awaits.'
  },
  {
    title: 'Rise Above the Ancient Kingdom',
    text:  'Ascend the legendary Lion Rock — a 200-metre fortress rising from the jungle, adorned with timeless frescoes and breathtaking panoramic views that have awed travellers for centuries.'
  },
  {
    title: 'Where History Meets the Ocean',
    text:  'Step inside a UNESCO World Heritage city where centuries of Dutch colonial grandeur blend seamlessly with Sri Lanka\'s vibrant coastal culture, fresh seafood, and golden sunsets.'
  },
  {
    title: 'The Little England of Sri Lanka',
    text:  'Drift through mist-covered mountains and endless emerald tea estates on the world\'s most scenic train ride — a timeless journey through highland beauty and colonial charm.'
  },
  {
    title: 'Ride the Waves of Paradise',
    text:  'Where world-class surf meets untouched coastline. Arugam Bay beckons adventurers and dreamers to the sun-drenched shores of Sri Lanka\'s wild and breathtaking east coast.'
  },
  {
    title: 'The Cultural Heart of the Island',
    text:  'Discover Kandy — Sri Lanka\'s sacred cultural capital, home to the Temple of the Tooth Relic, vibrant Kandyan dance performances, and lush botanical gardens beside a shimmering lake.'
  }
]

function initHeroSlider() {
  const slides   = document.querySelectorAll('.hero-slide')
  const dots     = document.querySelectorAll('.hero-dot')
  const prevBtn  = document.querySelector('.hero-prev')
  const nextBtn  = document.querySelector('.hero-next')
  const fillBar  = document.getElementById('heroProgressFill')
  const hero     = document.querySelector('.hero')
  const titleEl  = document.querySelector('.hero-title')
  const textEl   = document.querySelector('.hero-text')

  if (!slides.length) return

  const INTERVAL = 5500
  const TICK     = 50
  const TEXT_OUT = 350  // ms for text fade-out before swap

  let current = 0
  let elapsed = 0
  let timer   = null
  let ticker  = null

  function updateText(index) {
    if (!titleEl || !textEl) return
    // Fade out
    titleEl.classList.add('hero-text-out')
    textEl.classList.add('hero-text-out')

    setTimeout(() => {
      titleEl.textContent = SLIDE_CONTENT[index].title
      textEl.textContent  = SLIDE_CONTENT[index].text
      // Fade in
      titleEl.classList.remove('hero-text-out')
      textEl.classList.remove('hero-text-out')
    }, TEXT_OUT)
  }

  function goTo(index) {
    slides[current].classList.remove('active')
    dots[current].classList.remove('active')
    current = (index + slides.length) % slides.length
    slides[current].classList.add('active')
    dots[current].classList.add('active')

    updateText(current)

    elapsed = 0
    if (fillBar) { fillBar.style.transition = 'none'; fillBar.style.width = '0%'; void fillBar.offsetWidth; fillBar.style.transition = '' }
  }

  function startAuto() {
    stopAuto()
    timer  = setInterval(() => goTo(current + 1), INTERVAL)
    ticker = setInterval(() => {
      elapsed += TICK
      if (fillBar) fillBar.style.width = `${Math.min((elapsed / INTERVAL) * 100, 100)}%`
    }, TICK)
  }

  function stopAuto() {
    clearInterval(timer)
    clearInterval(ticker)
  }

  prevBtn?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto() })
  nextBtn?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto() })
  dots.forEach((dot, i) => dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto() }))

  hero?.addEventListener('mouseenter', stopAuto)
  hero?.addEventListener('mouseleave', startAuto)

  startAuto()
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
  const bar = document.createElement('div')
  bar.className = 'scroll-progress'
  document.body.prepend(bar)

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight
    bar.style.width = `${(window.scrollY / total) * 100}%`
  }, { passive: true })
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

  function add(el, cls, delay = 0) {
    el.classList.add('reveal', cls)
    if (delay) el.style.transitionDelay = `${delay}ms`
    observer.observe(el)
  }

  const fadeUpSingles = [
    '.section-subtitle', '.section-title', '.section-text',
    '.page-hero-title', '.page-hero-text', '.filter-section',
    '.tour-search .container',
  ]
  fadeUpSingles.forEach(sel =>
    document.querySelectorAll(sel).forEach(el => add(el, 'reveal--up'))
  )

  const staggerGroups = [
    '.popular-list > li',
    '.package-list > li',
    '.gallery-item',
    '.pkg-item',
    '.dest-card',
    '.filter-btn',
  ]
  staggerGroups.forEach(sel =>
    document.querySelectorAll(sel).forEach((el, i) => add(el, 'reveal--up', i * 90))
  )

  document.querySelectorAll('.cta-content').forEach(el => add(el, 'reveal--left'))
  document.querySelectorAll('.cta .btn').forEach(el => add(el, 'reveal--right'))

  document.querySelectorAll('.footer-top .container > *').forEach((el, i) =>
    add(el, 'reveal--up', i * 120)
  )
}

// ===== CARD 3D TILT =====
function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return // skip touch devices

  const cards = document.querySelectorAll('.popular-card, .package-card, .dest-card')
  const MAX = 8

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 2
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 2
      card.style.transition = 'transform 0.08s ease, box-shadow 0.08s ease'
      card.style.transform  = `perspective(900px) rotateX(${-y * MAX}deg) rotateY(${x * MAX}deg) translateZ(10px)`
      card.style.boxShadow  = `${-x * 10}px ${y * 10}px 32px rgba(0,0,0,0.18)`
    })
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.55s ease'
      card.style.transform  = ''
      card.style.boxShadow  = ''
    })
  })
}

// ===== BUTTON RIPPLE =====
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.style.position = 'relative'
    btn.style.overflow = 'hidden'

    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect()
      const size = Math.max(r.width, r.height) * 2
      const ripple = document.createElement('span')
      ripple.className = 'btn-ripple'
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size/2}px;top:${e.clientY - r.top - size/2}px;`
      btn.appendChild(ripple)
      setTimeout(() => ripple.remove(), 700)
    })
  })
}

// ===== MAGNETIC BUTTONS =====
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return

  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    let rAF = null
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect()
      const x = (e.clientX - r.left - r.width  / 2) * 0.22
      const y = (e.clientY - r.top  - r.height / 2) * 0.22
      if (rAF) cancelAnimationFrame(rAF)
      rAF = requestAnimationFrame(() => {
        btn.style.transform = `translate(${x}px, ${y}px)`
      })
    })
    btn.addEventListener('mouseleave', () => {
      if (rAF) cancelAnimationFrame(rAF)
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)'
      btn.style.transform  = ''
      setTimeout(() => btn.style.transition = '', 500)
    })
  })
}

// ===== COUNTER ANIMATION =====
function initCounters() {
  const els = document.querySelectorAll('[data-count]')
  if (!els.length) return

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const el = entry.target
      const target = parseInt(el.dataset.count, 10)
      const start = performance.now()
      const duration = 2000

      function update(now) {
        const p = Math.min((now - start) / duration, 1)
        const eased = 1 - (1 - p) ** 3
        el.textContent = Math.round(eased * target).toLocaleString()
        if (p < 1) requestAnimationFrame(update)
      }
      requestAnimationFrame(update)
      observer.unobserve(el)
    })
  }, { threshold: 0.5 })

  els.forEach(el => observer.observe(el))
}

// ===== INIT =====
initPreloader()
initHeroSlider()
initHeroParticles()
initHeroParallax()
initScrollProgress()
initScrollReveal()
initCardTilt()
initRipple()
initMagneticButtons()
initCounters()
