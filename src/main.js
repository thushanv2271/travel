import './style.css'

// ===== HEADER SCROLL =====
const header = document.getElementById('siteHeader')
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60)
})

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger')
const mobileMenu = document.getElementById('mobileMenu')
const mobileMenuClose = document.getElementById('mobileMenuClose')
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay')

function openMobileMenu() {
  mobileMenu.classList.add('open')
  mobileMenuOverlay.classList.add('active')
  document.body.style.overflow = 'hidden'
}
function closeMobileMenu() {
  mobileMenu.classList.remove('open')
  mobileMenuOverlay.classList.remove('active')
  document.body.style.overflow = ''
}

hamburger?.addEventListener('click', openMobileMenu)
mobileMenuClose?.addEventListener('click', closeMobileMenu)
mobileMenuOverlay?.addEventListener('click', closeMobileMenu)

// Close mobile menu on nav link click
document.querySelectorAll('.mobile-nav a').forEach(a => {
  a.addEventListener('click', closeMobileMenu)
})

// ===== BOOKING WIDGET =====
const bookingWidget = document.getElementById('bookingWidget')
const bookingOverlay = document.getElementById('bookingOverlay')
const bookingClose = document.getElementById('bookingClose')

function openBooking() {
  bookingWidget.classList.add('open')
  bookingOverlay.classList.add('active')
  document.body.style.overflow = 'hidden'
}
function closeBooking() {
  bookingWidget.classList.remove('open')
  bookingOverlay.classList.remove('active')
  document.body.style.overflow = ''
}

document.querySelectorAll('.book-trigger').forEach(btn => {
  btn.addEventListener('click', openBooking)
})
bookingClose?.addEventListener('click', closeBooking)
bookingOverlay?.addEventListener('click', closeBooking)

window.handleBooking = function(e) {
  e.preventDefault()
  alert('Booking request received! We will contact you shortly.')
  closeBooking()
}

// ===== BANNER SLIDER =====
const bannerSlides = document.querySelectorAll('.banner-slide')
const bannerDotsContainer = document.getElementById('bannerDots')
let bannerIndex = 0
let bannerTimer

// Create dots
bannerSlides.forEach((_, i) => {
  const dot = document.createElement('button')
  dot.className = 'banner-dot' + (i === 0 ? ' active' : '')
  dot.setAttribute('aria-label', `Slide ${i + 1}`)
  dot.addEventListener('click', () => goBanner(i))
  bannerDotsContainer?.appendChild(dot)
})

function goBanner(idx) {
  bannerSlides[bannerIndex].classList.remove('active')
  document.querySelectorAll('.banner-dot')[bannerIndex]?.classList.remove('active')
  bannerIndex = (idx + bannerSlides.length) % bannerSlides.length
  bannerSlides[bannerIndex].classList.add('active')
  document.querySelectorAll('.banner-dot')[bannerIndex]?.classList.add('active')
}

function nextBanner() { goBanner(bannerIndex + 1) }

function startBannerAuto() { bannerTimer = setInterval(nextBanner, 4000) }
function stopBannerAuto() { clearInterval(bannerTimer) }

startBannerAuto()
document.querySelector('.hero-banner')?.addEventListener('mouseenter', stopBannerAuto)
document.querySelector('.hero-banner')?.addEventListener('mouseleave', startBannerAuto)

// ===== ATTRACTIONS SLIDER =====
const attractionsSlider = document.getElementById('attractionsSlider')
const attrCards = attractionsSlider?.querySelectorAll('.attraction-card')
const attrPrev = document.getElementById('attrPrev')
const attrNext = document.getElementById('attrNext')
let attrIndex = 0
const attrVisible = () => window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3

function updateAttrSlider() {
  if (!attractionsSlider) return
  const cardWidth = attractionsSlider.parentElement.offsetWidth / attrVisible()
  attractionsSlider.style.transform = `translateX(-${attrIndex * cardWidth}px)`
}

attrNext?.addEventListener('click', () => {
  if (!attrCards) return
  const max = attrCards.length - attrVisible()
  if (attrIndex < max) { attrIndex++; updateAttrSlider() }
})
attrPrev?.addEventListener('click', () => {
  if (attrIndex > 0) { attrIndex--; updateAttrSlider() }
})

// Touch/drag for attractions
let attrDragStart = 0
attractionsSlider?.addEventListener('mousedown', e => { attrDragStart = e.clientX })
attractionsSlider?.addEventListener('mouseup', e => {
  const diff = attrDragStart - e.clientX
  if (Math.abs(diff) > 50) {
    if (diff > 0) attrNext?.click()
    else attrPrev?.click()
  }
})

// ===== DESTINATIONS SLIDER =====
const destSlides = document.querySelectorAll('.dest-slide')
const destListItems = document.querySelectorAll('#destList li')
const destPrev = document.getElementById('destPrev')
const destNext = document.getElementById('destNext')
let destIndex = 0

function goDest(idx) {
  destSlides[destIndex].classList.remove('active')
  destListItems[destIndex]?.classList.remove('active')
  destIndex = (idx + destSlides.length) % destSlides.length
  destSlides[destIndex].classList.add('active')
  destListItems[destIndex]?.classList.add('active')
  // Scroll list item into view
  destListItems[destIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}

destPrev?.addEventListener('click', () => goDest(destIndex - 1))
destNext?.addEventListener('click', () => goDest(destIndex + 1))

destListItems.forEach(item => {
  item.addEventListener('click', () => goDest(Number(item.dataset.index)))
})

// ===== HOTELS SLIDER =====
const hotelsSlider = document.getElementById('hotelsSlider')
const hotelCards = hotelsSlider?.querySelectorAll('.hotel-card')
const hotelsPrev = document.getElementById('hotelsPrev')
const hotelsNext = document.getElementById('hotelsNext')
let hotelIndex = 0
const hotelsVisible = () => window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 4

function updateHotelsSlider() {
  if (!hotelsSlider || !hotelCards) return
  const gap = 16
  const cardWidth = (hotelsSlider.parentElement.offsetWidth - gap * (hotelsVisible() - 1)) / hotelsVisible()
  hotelsSlider.style.transform = `translateX(-${hotelIndex * (cardWidth + gap)}px)`
}

hotelsNext?.addEventListener('click', () => {
  if (!hotelCards) return
  const max = hotelCards.length - hotelsVisible()
  if (hotelIndex < max) { hotelIndex++; updateHotelsSlider() }
})
hotelsPrev?.addEventListener('click', () => {
  if (hotelIndex > 0) { hotelIndex--; updateHotelsSlider() }
})

// ===== FAQ ACCORDION =====
document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target
    const body = document.getElementById(targetId)
    const isOpen = body?.classList.contains('open')

    // Close all
    document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'))
    document.querySelectorAll('.accordion-btn').forEach(b => b.classList.remove('active'))

    // Open clicked (toggle)
    if (!isOpen) {
      body?.classList.add('open')
      btn.classList.add('active')
    }
  })
})

// ===== RESIZE HANDLER =====
window.addEventListener('resize', () => {
  attrIndex = 0
  hotelIndex = 0
  updateAttrSlider()
  updateHotelsSlider()
})

// Init sliders after DOM load
updateAttrSlider()
updateHotelsSlider()
