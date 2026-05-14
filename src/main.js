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

// ===== BOOKING / JOURNEY SECTION =====
import { initBookingScene, DEST_PRICES } from './booking.js'

const QUICK_DESTS = ['Colombo', 'Galle', 'Kandy', 'Sigiriya', 'Ella', 'Mirissa', 'Arugam Bay', 'Jaffna']
const ALL_DESTS = Object.keys(DEST_PRICES)

let bookingScene = null
let selectedDest = ''
let selectedVehicle = ''
let journeyDays = 1

// Populate destination dropdown
const journeyDestEl = document.getElementById('journeyDest')
ALL_DESTS.forEach(d => {
  const opt = document.createElement('option')
  opt.value = d
  opt.textContent = d
  journeyDestEl?.appendChild(opt)
})

// Populate quick chips
const quickChipsEl = document.getElementById('quickChips')
QUICK_DESTS.forEach(d => {
  const btn = document.createElement('button')
  btn.className = 'quick-chip'
  btn.textContent = d
  btn.addEventListener('click', () => {
    selectJourneyDest(d)
    if (journeyDestEl) journeyDestEl.value = d
    quickChipsEl?.querySelectorAll('.quick-chip').forEach(c => c.classList.remove('active'))
    btn.classList.add('active')
  })
  quickChipsEl?.appendChild(btn)
})

// Destination change
journeyDestEl?.addEventListener('change', e => {
  selectJourneyDest(e.target.value)
  quickChipsEl?.querySelectorAll('.quick-chip').forEach(c => {
    c.classList.toggle('active', c.textContent === e.target.value)
  })
})

function selectJourneyDest(dest) {
  selectedDest = dest
  bookingScene?.selectDestination(dest)
  updateJourneyPrice()
}

// Vehicle cards
document.querySelectorAll('.v-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.v-card').forEach(c => c.classList.remove('active'))
    card.classList.add('active')
    selectedVehicle = card.dataset.type
    bookingScene?.selectVehicle(selectedVehicle)
    updateJourneyPrice()
  })
})

// Days control
const jDaysValEl = document.getElementById('jDaysVal')
document.getElementById('jDaysDown')?.addEventListener('click', () => {
  if (journeyDays > 1) { journeyDays--; if (jDaysValEl) jDaysValEl.textContent = journeyDays; updateJourneyPrice() }
})
document.getElementById('jDaysUp')?.addEventListener('click', () => {
  if (journeyDays < 30) { journeyDays++; if (jDaysValEl) jDaysValEl.textContent = journeyDays; updateJourneyPrice() }
})

// Price animation counter
function animateCount(el, from, to, prefix = '$') {
  const duration = 600
  const start = performance.now()
  function tick(now) {
    const p = Math.min((now - start) / duration, 1)
    const val = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)))
    el.textContent = prefix + val
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function updateJourneyPrice() {
  const rateEl = document.getElementById('jPcRate')
  const daysEl = document.getElementById('jPcDays')
  const taxEl = document.getElementById('jPcTax')
  const totalEl = document.getElementById('jPcTotal')
  const card = document.getElementById('journeyPriceCard')

  if (!selectedDest || !selectedVehicle) {
    if (rateEl) rateEl.textContent = '—'
    if (daysEl) daysEl.textContent = '—'
    if (taxEl) taxEl.textContent = '—'
    if (totalEl) totalEl.textContent = '$0'
    return
  }

  const rate = DEST_PRICES[selectedDest]?.[selectedVehicle] ?? 0
  const sub = rate * journeyDays
  const tax = Math.round(sub * 0.1)
  const total = sub + tax

  if (rateEl) rateEl.textContent = '$' + rate + '/day'
  if (daysEl) daysEl.textContent = journeyDays + ' day(s)'
  if (taxEl) taxEl.textContent = '$' + tax

  // Get current total value to animate from
  const currentTotal = parseInt(totalEl?.textContent?.replace('$', '') || '0')
  if (totalEl) animateCount(totalEl, currentTotal, total)

  // Flash animation
  card?.classList.remove('price-animate')
  void card?.offsetWidth
  card?.classList.add('price-animate')
}

// Enquire button
document.getElementById('jEnquireBtn')?.addEventListener('click', () => {
  if (!selectedDest || !selectedVehicle) {
    alert('Please select a destination and vehicle first.')
    return
  }
  const rate = DEST_PRICES[selectedDest]?.[selectedVehicle] ?? 0
  const total = Math.round(rate * journeyDays * 1.1)
  alert(`Enquiry submitted!\n\nDestination: ${selectedDest}\nVehicle: ${selectedVehicle === 'car' ? 'Sedan Car' : 'Minivan'}\nDuration: ${journeyDays} day(s)\nTotal: $${total}\n\nWe will contact you shortly!`)
})

// Init Three.js scene (after DOM is ready, with slight delay for layout)
setTimeout(() => {
  bookingScene = initBookingScene('journeyCanvas')
}, 100)
