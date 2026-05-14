import './style.css'

document.querySelector('#app').innerHTML = `
  <header class="navbar">
    <div class="logo">TravelWorld</div>
    <nav>
      <a href="#destinations">Destinations</a>
      <a href="#features">Why Us</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <section class="hero">
    <div class="hero-content">
      <h1>Explore the World</h1>
      <p>Discover breathtaking destinations, plan unforgettable adventures, and create memories that last a lifetime.</p>
      <a href="#destinations" class="btn-primary">Start Exploring</a>
    </div>
  </section>

  <section id="destinations" class="section">
    <h2>Popular Destinations</h2>
    <p class="section-subtitle">Hand-picked places just for you</p>
    <div class="cards">
      <div class="card">
        <div class="card-img" style="background: linear-gradient(135deg, #f59e0b, #ef4444)">🗼</div>
        <div class="card-body">
          <h3>Paris, France</h3>
          <p>The city of love, lights, and unmatched culture.</p>
          <span class="tag">Europe</span>
        </div>
      </div>
      <div class="card">
        <div class="card-img" style="background: linear-gradient(135deg, #06b6d4, #3b82f6)">🏯</div>
        <div class="card-body">
          <h3>Kyoto, Japan</h3>
          <p>Ancient temples, cherry blossoms, and serene gardens.</p>
          <span class="tag">Asia</span>
        </div>
      </div>
      <div class="card">
        <div class="card-img" style="background: linear-gradient(135deg, #10b981, #059669)">🏖️</div>
        <div class="card-body">
          <h3>Bali, Indonesia</h3>
          <p>Tropical paradise with stunning beaches and rich traditions.</p>
          <span class="tag">Asia</span>
        </div>
      </div>
      <div class="card">
        <div class="card-img" style="background: linear-gradient(135deg, #8b5cf6, #ec4899)">🗽</div>
        <div class="card-body">
          <h3>New York, USA</h3>
          <p>The city that never sleeps — vibrant, bold, and iconic.</p>
          <span class="tag">Americas</span>
        </div>
      </div>
    </div>
  </section>

  <section id="features" class="section section-alt">
    <h2>Why Travel With Us</h2>
    <p class="section-subtitle">We make every journey extraordinary</p>
    <div class="features">
      <div class="feature">
        <div class="feature-icon">🧭</div>
        <h3>Expert Guidance</h3>
        <p>Our seasoned travel experts craft itineraries tailored to your interests and budget.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🔒</div>
        <h3>Safe & Secure</h3>
        <p>Travel with confidence knowing we handle all logistics and support you 24/7.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">💸</div>
        <h3>Best Price Guarantee</h3>
        <p>Get the most value for your money with our exclusive deals and partnerships.</p>
      </div>
    </div>
  </section>

  <section id="contact" class="section">
    <h2>Plan Your Trip</h2>
    <p class="section-subtitle">Tell us where you want to go</p>
    <form class="contact-form" onsubmit="handleSubmit(event)">
      <input type="text" placeholder="Your name" required />
      <input type="email" placeholder="Your email" required />
      <input type="text" placeholder="Dream destination" required />
      <button type="submit" class="btn-primary">Send Inquiry</button>
    </form>
    <p id="form-msg" class="form-msg"></p>
  </section>

  <footer class="footer">
    <p>&copy; 2026 TravelWorld. Built with Vite.</p>
  </footer>
`

window.handleSubmit = function (e) {
  e.preventDefault()
  document.getElementById('form-msg').textContent = 'Thanks! We will be in touch soon.'
  e.target.reset()
}
