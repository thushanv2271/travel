// ===== NAVBAR TOGGLE =====
const overlay    = document.querySelector('[data-overlay]')
const navOpenBtn = document.querySelector('[data-nav-open-btn]')
const navbar     = document.querySelector('[data-navbar]')
const navCloseBtn= document.querySelector('[data-nav-close-btn]')
const navLinks   = document.querySelectorAll('[data-nav-link]')

function toggleNav() {
  navbar?.classList.toggle('active')
  overlay?.classList.toggle('active')
}
navOpenBtn?.addEventListener('click', toggleNav)
navCloseBtn?.addEventListener('click', toggleNav)
overlay?.addEventListener('click', toggleNav)
navLinks.forEach(l => l.addEventListener('click', toggleNav))

// ===== HEADER STICKY + GO-TOP =====
const header   = document.querySelector('[data-header]')
const goTopBtn = document.querySelector('[data-go-top]')

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY >= 200
  header?.classList.toggle('active', scrolled)
  goTopBtn?.classList.toggle('active', scrolled)
})

// ===== TOUR SEARCH FORM =====
const VEHICLE_RATES = { car: 45, van: 65, tuk: 25, bike: 20 }
const VEHICLE_LABELS = {
  car:  '<ion-icon name="car-outline"></ion-icon> Car',
  van:  '<ion-icon name="bus-outline"></ion-icon> Van',
  tuk:  '<ion-icon name="flash-outline"></ion-icon> Tuk-Tuk',
  bike: '<ion-icon name="bicycle-outline"></ion-icon> Bike'
}

const PACKAGES = [
  {
    title: 'Cultural Triangle Discovery Tour',
    duration: '7D / 6N', price: 899,
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/anuradhapura-hm-feat.jpg',
    tags: ['Colombo','Kandy','Sigiriya','Anuradhapura','Polonnaruwa','Negombo']
  },
  {
    title: 'Beach & Wildlife Safari Adventure',
    duration: '8D / 7N', price: 1199,
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/hikka-hm-feat.jpg',
    tags: ['Galle','Hikkaduwa','Mirissa','Tangalle','Yala','Bentota']
  },
  {
    title: 'Hill Country & Tea Estates Escape',
    duration: '5D / 4N', price: 749,
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-2.jpg',
    tags: ['Kandy','Ella','Nuwara Eliya']
  },
  {
    title: 'East Coast Surf & Sun Escape',
    duration: '7D / 6N', price: 990,
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/arugambay.jpg',
    tags: ['Arugam Bay','Pasikuda','Trincomalee']
  },
  {
    title: 'Jaffna Cultural Immersion',
    duration: '4D / 3N', price: 620,
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/jaffna-hm-feat.jpg',
    tags: ['Jaffna']
  },
  {
    title: 'Luxury Yala Safari Lodge Experience',
    duration: '4D / 3N', price: 1850,
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-4.jpg',
    tags: ['Yala']
  },
  {
    title: 'Grand Sri Lanka Circuit',
    duration: '14D / 13N', price: 2450,
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-3.jpg',
    tags: [] // fallback — matches any destination
  }
]

function getRecommended(destination) {
  const matched = PACKAGES.filter(p => p.tags.includes(destination))
  if (matched.length >= 2) return matched.slice(0, 3)
  const grand = PACKAGES.find(p => p.tags.length === 0)
  return [...matched, grand].filter(Boolean).slice(0, 3)
}

function daysBetween(a, b) {
  return Math.max(1, Math.ceil((new Date(b) - new Date(a)) / 86400000))
}

function fmtDate(s) {
  return new Date(s).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function buildModalHTML({ destination, people, checkin, checkout, vehicle }) {
  const days    = daysBetween(checkin, checkout)
  const rate    = VEHICLE_RATES[vehicle]
  const total   = Math.round(rate * days * 1.1)
  const pkgs    = getRecommended(destination)

  const chips = [
    `<ion-icon name="location-outline"></ion-icon> ${destination}`,
    `<ion-icon name="people-outline"></ion-icon> ${people} ${people == 1 ? 'person' : 'people'}`,
    `<ion-icon name="calendar-outline"></ion-icon> ${fmtDate(checkin)} → ${fmtDate(checkout)}`,
    VEHICLE_LABELS[vehicle],
    `<ion-icon name="moon-outline"></ion-icon> ${days} ${days === 1 ? 'night' : 'nights'}`
  ].map(t => `<span class="summary-chip">${t}</span>`).join('')

  const pkgCards = pkgs.map(p => `
    <a href="packages.html" class="modal-pkg-card">
      <div class="modal-pkg-img"><img src="${p.img}" alt="${p.title}" loading="lazy"></div>
      <div class="modal-pkg-info">
        <h4>${p.title}</h4>
        <p>${p.duration} &nbsp;·&nbsp; from $${p.price}/person</p>
      </div>
      <span class="modal-pkg-price">$${p.price}</span>
    </a>`).join('')

  return `
    <div class="search-summary">${chips}</div>

    <div class="price-estimate-card">
      <div>
        <p class="price-est-label">Estimated Transport Cost</p>
        <p class="price-est-note">${VEHICLE_LABELS[vehicle]} &nbsp;·&nbsp; $${rate}/day &nbsp;·&nbsp; ${days} day${days > 1 ? 's' : ''} + 10% tax</p>
      </div>
      <div style="text-align:right">
        <p class="price-est-value">$${total}</p>
        <p class="price-est-note">excl. accommodation</p>
      </div>
    </div>

    <p class="modal-section-title">Recommended Packages for ${destination}</p>
    <div class="modal-pkg-list">${pkgCards}</div>

    <div class="modal-actions">
      <a href="packages.html" class="btn btn-primary">View All Packages</a>
      <a href="#contact"      class="btn btn-outline">Enquire Now</a>
    </div>`
}

// Modal open/close
const searchModalOverlay = document.getElementById('searchModalOverlay')
const searchModalClose   = document.getElementById('searchModalClose')
const searchModalBody    = document.getElementById('searchModalBody')
const modalSubtitle      = document.getElementById('modalSubtitle')

function openModal(html, subtitle) {
  modalSubtitle.textContent = subtitle
  searchModalBody.innerHTML = html
  searchModalOverlay.classList.add('active')
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  searchModalOverlay?.classList.remove('active')
  document.body.style.overflow = ''
}

searchModalClose?.addEventListener('click', closeModal)
searchModalOverlay?.addEventListener('click', e => { if (e.target === searchModalOverlay) closeModal() })
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal() })

// Form submit
const tourSearchForm = document.getElementById('tourSearchForm')
tourSearchForm?.addEventListener('submit', e => {
  e.preventDefault()

  const destination = tourSearchForm.destination.value
  const people      = tourSearchForm.people.value
  const checkin     = tourSearchForm.checkin.value
  const checkout    = tourSearchForm.checkout.value
  const vehicleEl   = tourSearchForm.querySelector('input[name="vehicle"]:checked')

  if (!destination || !people || !checkin || !checkout || !vehicleEl) {
    alert('Please fill in all fields and select a vehicle.')
    return
  }
  if (new Date(checkout) <= new Date(checkin)) {
    alert('Check-out date must be after check-in date.')
    return
  }

  const html = buildModalHTML({ destination, people, checkin, checkout, vehicle: vehicleEl.value })
  openModal(html, `Results for ${destination} · ${people} guest${people == 1 ? '' : 's'}`)
})
