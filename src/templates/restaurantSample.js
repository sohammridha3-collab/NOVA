/**
 * NOVA Website Studio — Bundled Restaurant Sample Template
 * "AURA — Gastronomy in Void"
 * A complete, responsive, self-contained luxury restaurant website.
 */

export function getRestaurantSampleHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AURA — Gastronomy in Void</title>
  <style>
    :root {
      --bg-dark: #0a0b10;
      --bg-card: #12131b;
      --gold: #dfb15b;
      --gold-light: #f7d58d;
      --gold-glow: rgba(223, 177, 91, 0.25);
      --text: #eaeef6;
      --text-muted: #8b92a4;
      --border: rgba(223, 177, 91, 0.2);
      --font-serif: 'Playfair Display', Georgia, serif;
      --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg-dark);
      color: var(--text);
      font-family: var(--font-sans);
      line-height: 1.6;
      overflow-x: hidden;
    }

    /* Ambient Glows */
    .ambience {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 100vh;
      background: radial-gradient(circle at 50% 10%, rgba(223, 177, 91, 0.08) 0%, transparent 60%);
      pointer-events: none;
      z-index: 0;
    }

    /* Header */
    header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(10, 11, 16, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 1.1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-mark {
      width: 28px;
      height: 28px;
      border: 1px solid var(--gold);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gold);
      font-size: 0.8rem;
      font-weight: bold;
      letter-spacing: 1px;
    }

    .brand-name {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      letter-spacing: 0.2em;
      color: #ffffff;
      text-transform: uppercase;
    }

    nav {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    nav a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      transition: color 0.2s;
    }

    nav a:hover { color: var(--gold); }

    .btn-reserve {
      background: transparent;
      border: 1px solid var(--gold);
      color: var(--gold);
      padding: 0.55rem 1.4rem;
      font-size: 0.8rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      cursor: pointer;
      border-radius: 2px;
      transition: all 0.3s;
    }

    .btn-reserve:hover {
      background: var(--gold);
      color: var(--bg-dark);
      box-shadow: 0 0 16px var(--gold-glow);
    }

    /* Hero Section */
    .hero {
      position: relative;
      z-index: 1;
      padding: 7rem 2rem 5rem;
      text-align: center;
      max-width: 900px;
      margin: 0 auto;
    }

    .badge-michelin {
      display: inline-block;
      border: 1px solid var(--border);
      background: rgba(223, 177, 91, 0.08);
      color: var(--gold-light);
      padding: 0.4rem 1.1rem;
      font-size: 0.72rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      border-radius: 30px;
      margin-bottom: 2rem;
    }

    .hero h1 {
      font-family: var(--font-serif);
      font-size: clamp(2.4rem, 5vw, 4.2rem);
      font-weight: 300;
      line-height: 1.15;
      letter-spacing: 0.04em;
      color: #ffffff;
      margin-bottom: 1.5rem;
    }

    .hero h1 span {
      font-style: italic;
      color: var(--gold);
    }

    .hero p {
      font-size: 1.1rem;
      color: var(--text-muted);
      max-width: 620px;
      margin: 0 auto 2.5rem;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 1.2rem;
      flex-wrap: wrap;
    }

    .btn-primary {
      background: var(--gold);
      border: 1px solid var(--gold);
      color: var(--bg-dark);
      padding: 0.85rem 2rem;
      font-size: 0.85rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      background: var(--gold-light);
      box-shadow: 0 0 25px var(--gold-glow);
    }

    .btn-outline {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ffffff;
      padding: 0.85rem 2rem;
      font-size: 0.85rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-outline:hover {
      border-color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
    }

    /* Tasting Menu Section */
    .section-menu {
      position: relative;
      z-index: 1;
      padding: 5rem 2rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3.5rem;
    }

    .section-subtitle {
      color: var(--gold);
      font-size: 0.78rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    .section-title {
      font-family: var(--font-serif);
      font-size: 2.2rem;
      font-weight: 300;
      letter-spacing: 0.05em;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
      gap: 2rem;
    }

    .menu-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      padding: 2rem;
      border-radius: 4px;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }

    .menu-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .menu-card:hover {
      border-color: var(--gold);
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .menu-card:hover::before { opacity: 1; }

    .menu-course-number {
      font-size: 0.72rem;
      color: var(--gold);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 0.6rem;
    }

    .menu-card-title {
      font-family: var(--font-serif);
      font-size: 1.35rem;
      margin-bottom: 0.65rem;
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .menu-card-price {
      font-family: var(--font-sans);
      font-size: 0.95rem;
      color: var(--gold);
      font-weight: normal;
    }

    .menu-card-desc {
      color: var(--text-muted);
      font-size: 0.9rem;
      line-height: 1.6;
      margin-bottom: 1.2rem;
    }

    .menu-card-pairing {
      font-size: 0.75rem;
      color: #9da6be;
      border-top: 1px dashed rgba(255, 255, 255, 0.08);
      padding-top: 0.8rem;
      font-style: italic;
    }

    /* Philosophy / Chef Quote */
    .philosophy-banner {
      background: #0f1017;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      padding: 5rem 2rem;
      text-align: center;
      position: relative;
      z-index: 1;
      margin-top: 2rem;
    }

    .quote-content {
      max-width: 750px;
      margin: 0 auto;
    }

    .quote-text {
      font-family: var(--font-serif);
      font-size: 1.6rem;
      font-style: italic;
      color: #e5e9f0;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .quote-author {
      font-size: 0.85rem;
      letter-spacing: 0.18em;
      color: var(--gold);
      text-transform: uppercase;
    }

    /* Reservation Modal */
    .res-modal-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      z-index: 200;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .res-modal-backdrop.open { display: flex; }

    .res-modal {
      background: var(--bg-card);
      border: 1px solid var(--gold);
      width: 100%;
      max-width: 480px;
      padding: 2.2rem;
      border-radius: 4px;
      position: relative;
    }

    .res-modal-close {
      position: absolute;
      top: 1.2rem;
      right: 1.2rem;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.4rem;
      cursor: pointer;
    }

    .res-modal h3 {
      font-family: var(--font-serif);
      font-size: 1.6rem;
      margin-bottom: 0.5rem;
      color: #ffffff;
    }

    .res-modal p {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.2rem;
      text-align: left;
    }

    .form-group label {
      display: block;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 0.4rem;
    }

    .form-group input, .form-group select {
      width: 100%;
      background: #090a0f;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      padding: 0.65rem 0.85rem;
      font-size: 0.9rem;
      border-radius: 2px;
    }

    .form-group input:focus, .form-group select:focus {
      border-color: var(--gold);
      outline: none;
    }

    /* Footer */
    footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 3rem 2rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.8rem;
      letter-spacing: 0.08em;
    }

    @media (max-width: 768px) {
      nav { display: none; }
      .hero { padding: 4rem 1.5rem; }
    }
  </style>
</head>
<body>
  <div class="ambience"></div>

  <header>
    <div class="brand">
      <div class="brand-mark">&#9672;</div>
      <div class="brand-name">AURA</div>
    </div>
    <nav>
      <a href="#menu">Tasting Menu</a>
      <a href="#experience">Philosophy</a>
      <a href="#cellar">Cellar</a>
    </nav>
    <button class="btn-reserve" onclick="openReservationModal()">Reserve Table</button>
  </header>

  <main>
    <section class="hero">
      <div class="badge-michelin">&#9733;&#9733;&#9733; Three Michelin Stars &bull; 2026</div>
      <h1>Gastronomy at the <span>Outer Horizon</span></h1>
      <p>An immersive culinary odyssey fusing heritage Japanese techniques, hyper-seasonal wild botanicals, and celestial precision.</p>
      <div class="hero-actions">
        <button class="btn-primary" onclick="openReservationModal()">Book An Experience</button>
        <button class="btn-outline" onclick="document.getElementById('menu').scrollIntoView({behavior: 'smooth'})">View Tasting Menu</button>
      </div>
    </section>

    <section id="menu" class="section-menu">
      <div class="section-header">
        <div class="section-subtitle">Spring Equinox &bull; 14 Sequences</div>
        <h2 class="section-title">The Culinary Voyage</h2>
      </div>

      <div class="menu-grid">
        <div class="menu-card">
          <div class="menu-course-number">Sequence I</div>
          <div class="menu-card-title">
            <span>Starlight Broth</span>
            <span class="menu-card-price">$48</span>
          </div>
          <p class="menu-card-desc">Charcoal-clarified dashi infused with wild morels, winter kelp pearls, and 24k gold leaf infusion.</p>
          <div class="menu-card-pairing">Pairing: Junmai Daiginjo "Celestial Echo" 2021</div>
        </div>

        <div class="menu-card">
          <div class="menu-course-number">Sequence IV</div>
          <div class="menu-card-title">
            <span>Glacial A5 Wagyu</span>
            <span class="menu-card-price">$85</span>
          </div>
          <p class="menu-card-desc">Bincho-grilled Miyazaki tenderloin smoked over volcanic cedar, black winter truffle essence, ferment jus.</p>
          <div class="menu-card-pairing">Pairing: Domaine de la Romanée-Conti 2017</div>
        </div>

        <div class="menu-card">
          <div class="menu-course-number">Sequence VII</div>
          <div class="menu-card-title">
            <span>Nebula sphere</span>
            <span class="menu-card-price">$38</span>
          </div>
          <p class="menu-card-desc">Flash-frozen passionfruit caviar in a blown isomalt orb, yuzu blossom snow, and smoked vanilla cream.</p>
          <div class="menu-card-pairing">Pairing: Château d'Yquem Sauternes 2015</div>
        </div>
      </div>
    </section>

    <section id="experience" class="philosophy-banner">
      <div class="quote-content">
        <p class="quote-text">"We do not merely plate ingredients. We craft fleeting moments of resonance between ancient earth and the quiet expanse of space."</p>
        <div class="quote-author">— Executive Chef Kaelen Vance</div>
      </div>
    </section>
  </main>

  <!-- Reservation Modal -->
  <div id="resModal" class="res-modal-backdrop">
    <div class="res-modal">
      <button class="res-modal-close" onclick="closeReservationModal()">&times;</button>
      <h3>Reserve An Evening</h3>
      <p>Tables are released 30 days in advance. Select your seating.</p>
      
      <form onsubmit="handleReserve(event)">
        <div class="form-group">
          <label>Dining Experience</label>
          <select id="resExperience">
            <option>14-Course Main Salon ($295/guest)</option>
            <option>Chef's Counter & Cellar Pairing ($440/guest)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Guests</label>
          <select id="resGuests">
            <option>2 Guests</option>
            <option>4 Guests</option>
            <option>6 Guests (Private Alcove)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Preferred Date</label>
          <input type="date" required value="2026-11-15">
        </div>
        <button type="submit" class="btn-primary" style="width: 100%; margin-top: 0.5rem;">Confirm Table Request</button>
      </form>
    </div>
  </div>

  <footer>
    <p>&copy; 2026 AURA GASTRONOMY. ALL RIGHTS RESERVED. 840 CELESTIAL WAY, SAN FRANCISCO.</p>
  </footer>

  <script>
    function openReservationModal() {
      document.getElementById('resModal').classList.add('open');
    }
    function closeReservationModal() {
      document.getElementById('resModal').classList.remove('open');
    }
    function handleReserve(e) {
      e.preventDefault();
      alert('Reservation request submitted for AURA. In a production environment, this integrates with the table management API.');
      closeReservationModal();
    }
  </script>
</body>
</html>`;
}

