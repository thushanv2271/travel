// ===== BOOKING PAGE =====

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

// ===== DATA =====
const VEHICLE_RATES = { car: 45, van: 65, tuk: 25, bike: 20 }
const VEHICLE_LABELS = { car: 'Car', van: 'Van', tuk: 'Tuk-Tuk', bike: 'Bike' }
const VEHICLE_ICONS  = { car: 'car-outline', van: 'bus-outline', tuk: 'flash-outline', bike: 'bicycle-outline' }

const PACKAGES = [
  {
    title: 'Cultural Triangle Discovery Tour',
    duration: '7D / 6N', price: 899, maxPeople: 12, region: 'North Central',
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/anuradhapura-hm-feat.jpg',
    desc: 'Explore Sigiriya, Polonnaruwa and Anuradhapura — the ancient kingdoms of Sri Lanka — on this immersive journey through centuries of history.',
    tags: ['Colombo','Kandy','Sigiriya','Anuradhapura','Polonnaruwa','Negombo']
  },
  {
    title: 'Beach & Wildlife Safari Adventure',
    duration: '8D / 7N', price: 1199, maxPeople: 10, region: 'South Sri Lanka',
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/hikka-hm-feat.jpg',
    desc: "Yala's thrilling leopard safaris by day, whale watching off Mirissa's coast, and relaxing on golden beaches.",
    tags: ['Galle','Hikkaduwa','Mirissa','Tangalle','Yala','Bentota']
  },
  {
    title: 'Hill Country & Tea Estates Escape',
    duration: '5D / 4N', price: 749, maxPeople: 8, region: 'Central Hills',
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-2.jpg',
    desc: 'Misty mountains, emerald tea plantations, and the world\'s most scenic train ride from Kandy through Nuwara Eliya to Ella.',
    tags: ['Kandy','Ella','Nuwara Eliya']
  },
  {
    title: 'East Coast Surf & Sun Escape',
    duration: '7D / 6N', price: 990, maxPeople: 10, region: 'East Coast',
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/arugambay.jpg',
    desc: 'Ride world-class waves at Arugam Bay, explore pristine Pasikuda beach, and discover the ancient port city of Trincomalee.',
    tags: ['Arugam Bay','Pasikuda','Trincomalee']
  },
  {
    title: 'Jaffna Cultural Immersion',
    duration: '4D / 3N', price: 620, maxPeople: 8, region: 'Northern Province',
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/jaffna-hm-feat.jpg',
    desc: 'Discover the unique Tamil heritage, ancient Hindu temples, and warm hospitality of Sri Lanka\'s vibrant north.',
    tags: ['Jaffna']
  },
  {
    title: 'Luxury Yala Safari Lodge Experience',
    duration: '4D / 3N', price: 1850, maxPeople: 6, region: 'South Sri Lanka',
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-4.jpg',
    desc: 'Exclusive safari lodge stay inside Yala National Park — encounter leopards, elephants and exotic birds in their natural habitat.',
    tags: ['Yala']
  },
  {
    title: 'Grand Sri Lanka Circuit',
    duration: '14D / 13N', price: 2450, maxPeople: 12, region: 'Island-wide',
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-3.jpg',
    desc: 'The ultimate full-island journey — ancient cities, hill country, beaches, wildlife and culture all in one epic adventure.',
    tags: []
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

function starHTML() {
  return Array(5).fill('<ion-icon name="star"></ion-icon>').join('')
}

function buildResultsHTML({ destination, people, checkin, checkout, vehicle }) {
  const days  = daysBetween(checkin, checkout)
  const rate  = VEHICLE_RATES[vehicle]
  const total = Math.round(rate * days * 1.1)
  const pkgs  = getRecommended(destination)

  const chips = [
    { icon: 'location-outline',  text: destination },
    { icon: 'people-outline',    text: `${people} ${people == 1 ? 'person' : 'people'}` },
    { icon: 'calendar-outline',  text: `${fmtDate(checkin)} → ${fmtDate(checkout)}` },
    { icon: VEHICLE_ICONS[vehicle], text: VEHICLE_LABELS[vehicle] },
    { icon: 'moon-outline',      text: `${days} ${days === 1 ? 'night' : 'nights'}` }
  ].map(c => `<span class="br-chip"><ion-icon name="${c.icon}"></ion-icon>${c.text}</span>`).join('')

  const pkgCards = pkgs.map(p => `
    <div class="br-pkg-card">
      <div class="br-pkg-img">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="br-pkg-body">
        <div class="br-pkg-meta">
          <span><ion-icon name="time-outline"></ion-icon>${p.duration}</span>
          <span><ion-icon name="people-outline"></ion-icon>Max ${p.maxPeople}</span>
          <span><ion-icon name="location-outline"></ion-icon>${p.region}</span>
        </div>
        <h3 class="br-pkg-title">${p.title}</h3>
        <p class="br-pkg-desc">${p.desc}</p>
        <div class="br-pkg-footer">
          <div class="br-pkg-rating">${starHTML()}<span>(verified)</span></div>
          <div class="br-pkg-price">
            <p class="br-price-value">$${p.price}</p>
            <p class="br-price-note">/per person</p>
          </div>
          <a href="packages.html" class="btn btn-primary">Book Now</a>
        </div>
      </div>
    </div>`).join('')

  return `
    <div class="br-header">
      <div>
        <h2 class="br-title">Your Travel Matches</h2>
        <p class="br-subtitle">Results for <strong>${destination}</strong> · ${people} guest${people == 1 ? '' : 's'}</p>
      </div>
    </div>

    <div class="br-chips">${chips}</div>

    <div class="br-estimate-card">
      <div class="br-estimate-left">
        <p class="br-estimate-label">Estimated Transport Cost</p>
        <p class="br-estimate-note">
          <ion-icon name="${VEHICLE_ICONS[vehicle]}"></ion-icon>
          ${VEHICLE_LABELS[vehicle]} &nbsp;·&nbsp; $${rate}/day &nbsp;·&nbsp; ${days} day${days > 1 ? 's' : ''} + 10% tax
        </p>
      </div>
      <div class="br-estimate-right">
        <p class="br-estimate-total">$${total}</p>
        <p class="br-estimate-note">excl. accommodation</p>
      </div>
    </div>

    <h3 class="br-section-title">Recommended Packages for ${destination}</h3>
    <div class="br-pkg-list">${pkgCards}</div>

    <div class="br-actions">
      <a href="packages.html" class="btn btn-primary">View All Packages</a>
      <a href="index.html#contact" class="btn btn-outline">Enquire Now</a>
    </div>`
}

function showResults(data) {
  const section = document.getElementById('bookingResultsSection')
  const inner   = document.getElementById('bookingResultsInner')
  if (!section || !inner) return
  inner.innerHTML = buildResultsHTML(data)
  section.style.display = 'block'
  section.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ===== PRE-FILL FROM URL PARAMS =====
function prefillFromParams() {
  const params  = new URLSearchParams(window.location.search)
  const people  = params.get('people')
  const checkin = params.get('checkin')
  const checkout= params.get('checkout')
  const vehicle = params.get('vehicle')

  if (people)  document.getElementById('bp-people').value  = people
  if (checkin) document.getElementById('bp-checkin').value = checkin
  if (checkout)document.getElementById('bp-checkout').value= checkout
  if (vehicle) {
    const radio = document.querySelector(`input[name="vehicle"][value="${vehicle}"]`)
    if (radio) radio.checked = true
  }
}

// ===== FORM SUBMIT =====
const bookingForm = document.getElementById('bookingForm')
bookingForm?.addEventListener('submit', e => {
  e.preventDefault()

  const destination = bookingForm.destination.value
  const people      = bookingForm.people.value
  const checkin     = bookingForm.checkin.value
  const checkout    = bookingForm.checkout.value
  const vehicleEl   = bookingForm.querySelector('input[name="vehicle"]:checked')

  if (!destination || !people || !checkin || !checkout || !vehicleEl) {
    alert('Please fill in all fields and select a vehicle.')
    return
  }
  if (new Date(checkout) <= new Date(checkin)) {
    alert('Check-out date must be after check-in date.')
    return
  }

  showResults({ destination, people, checkin, checkout, vehicle: vehicleEl.value })

  // Update URL without reload so results are shareable
  const params = new URLSearchParams({ destination, people, checkin, checkout, vehicle: vehicleEl.value })
  history.replaceState(null, '', `?${params.toString()}`)
})

// ===== INIT =====
prefillFromParams()

// If all required params are present in URL, auto-submit
;(function autoSearch() {
  const params      = new URLSearchParams(window.location.search)
  const destination = params.get('destination')
  const people      = params.get('people')
  const checkin     = params.get('checkin')
  const checkout    = params.get('checkout')
  const vehicle     = params.get('vehicle')

  if (destination && people && checkin && checkout && vehicle) {
    // Also set destination select
    const destSelect = document.getElementById('dest-select')
    if (destSelect) destSelect.value = destination
    showResults({ destination, people, checkin, checkout, vehicle })
  }
})()
