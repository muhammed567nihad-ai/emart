/**
 * EMRAT AIRPORT.com — Luxury International Digital Concourse & Shopping Portal
 * Clean, modern vanilla JavaScript architecture.
 *
 * Modules:
 * 1. State Management & LocalStorage (Cart, Wishlist, Currency, Theme)
 * 2. Product Catalog Database (40+ items across 8 categories with full manuals)
 * 3. Currency Conversion System
 * 4. Theme Toggle (Airport Night / Airport Day)
 * 5. Navigation, Scroll Progress, Clocks & Cursor Tracking
 * 6. Interactive Journey Timeline
 * 7. FIDS Departure Board System
 * 8. Category Explorer Rendering
 * 9. Daily Traveler Persona System
 * 10. Product Catalog Rendering, Filtering & Search
 * 11. Product Detail Modal (5 Tabs)
 * 12. Interactive Product Manual Viewer (6 Steps)
 * 13. D1 Food Market & "What's On Your Tray?" Meal Composer
 * 14. E1 Travel Toy World & Age Filters
 * 15. The Luxury Terminal VIP Showcase
 * 16. Shopping Cart & Gate Delivery Checkout Flow
 * 17. Travel Club Boarding Pass Generator
 * 18. Terminal Concierge & FAQ Accordion
 * 19. Toast Notification System
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. GLOBAL STATE & LOCALSTORAGE
     ========================================================================== */
  const STATE = {
    theme: localStorage.getItem('emrat_theme') || 'night',
    currency: localStorage.getItem('emrat_currency') || 'USD',
    cart: JSON.parse(localStorage.getItem('emrat_airport_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('emrat_airport_wishlist') || '[]'),
    activeCategory: 'all',
    searchQuery: '',
    maxPrice: 2500,
    minRating: 0,
    inStockOnly: false,
    dealsOnly: false,
    sortBy: 'featured',
    selectedPersona: 'commuter',
    trayMeal: {
      entree: null,
      snack: null,
      dessert: null,
      beverage: null
    },
    activeManualProduct: null,
    activeManualStep: 1
  };

  // Currency Exchange Rates (Base: USD)
  const CURRENCY_RATES = {
    USD: { symbol: '$', rate: 1.0 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
    AED: { symbol: 'AED ', rate: 3.67 },
    JPY: { symbol: '¥', rate: 155.0 }
  };

  function formatPrice(usdPrice) {
    const curr = CURRENCY_RATES[STATE.currency] || CURRENCY_RATES.USD;
    const converted = usdPrice * curr.rate;
    if (STATE.currency === 'JPY') {
      return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${curr.symbol}${converted.toFixed(2)}`;
  }

  function saveCart() {
    localStorage.setItem('emrat_airport_cart', JSON.stringify(STATE.cart));
    updateCartUI();
  }

  function saveWishlist() {
    localStorage.setItem('emrat_airport_wishlist', JSON.stringify(STATE.wishlist));
    updateWishlistUI();
  }

  /* ==========================================================================
     2. PRODUCT CATALOG DATABASE (40+ CERTIFIED AIRPORT ITEMS)
     ========================================================================== */
  const PRODUCTS = [
    // --- E1: TOYS & GAMES ---
    {
      id: 'toy-01',
      category: 'toys',
      categoryCode: 'E1',
      name: 'EMRAT Aero-Explorer Solar Drone',
      price: 185,
      oldPrice: 220,
      discount: 16,
      image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 142,
      description: 'Ultralight folding travel drone with dual 4K cameras, auto-takeoff, wind-stabilization, and compliant travel battery casing for aircraft carry-on.',
      ingredients: null,
      specifications: {
        Weight: '249g (FAA/TSA Sub-250g Exemption)',
        Battery: '3,800mAh Li-Po (Flight-safe)',
        FlightTime: '34 Minutes',
        Camera: '4K HDR Dual Sensor',
        Range: '8km HD Video Stream'
      },
      manual: {
        overview: 'The Aero-Explorer is engineered specifically for globe-trotters, weighing under 250g to allow hassle-free travel across international borders without registration.',
        howToUse: '1. Unfold rear rotor arms followed by front arms.\n2. Power on drone first, then transmitter.\n3. Calibrate compass outdoors away from metal concourse structures.\n4. Use 1-touch auto takeoff.',
        importantInfo: 'Ensure battery is discharged to below 30% prior to international flights. Keep spare batteries in carry-on luggage only.',
        care: 'Wipe rotors with dry microfiber. Do not rinse with water. Store inside the included Faraday-shielded travel pouch.',
        inFlight: 'Permitted in aircraft cabin carry-on only. Lithium-ion capacity is 14.8Wh (well within the 100Wh airline limit).',
        safety: 'Keep rotors away from eyes and fingers. Do not fly near airport runways, helipads, or crowded concourses.'
      },
      stock: 18,
      tags: ['drone', 'stem', 'robotics', 'kids', 'family', 'gadget']
    },
    {
      id: 'toy-02',
      category: 'toys',
      categoryCode: 'E1',
      name: 'Cloudhopper Aviator Plush Pilot Bear',
      price: 38,
      oldPrice: 48,
      discount: 21,
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewsCount: 89,
      description: 'Handcrafted supersoft cashmere-blend pilot bear wearing authentic miniature Captain uniform with gold embroidered epaulets and aviator goggles.',
      ingredients: null,
      specifications: {
        Material: 'Organic Cashmere-Cotton Blend',
        Height: '32 cm',
        SafetyRating: 'ASTM F963 & EN71 Certified',
        Hypoallergenic: '100% Certified'
      },
      manual: {
        overview: 'Cloudhopper Bear is the signature flight companion of EMRAT International Airport, designed to provide sensory comfort during take-off and landing.',
        howToUse: 'Hug during turbulence or cabin pressure changes for calming comfort. Uniform jacket and goggles are gently detachable.',
        importantInfo: 'Suitable for newborn travelers to adult collectors. No small detachable choking hazards.',
        care: 'Surface clean with a damp organic cloth and mild baby soap. Air dry in a shaded breezy area.',
        inFlight: 'Perfect lap companion during long-haul red-eye flights.',
        safety: 'Non-toxic, flame-retardant tested fabric.'
      },
      stock: 45,
      tags: ['plush', 'toddler', 'bear', 'soft', 'kids', 'souvenir']
    },
    {
      id: 'toy-03',
      category: 'toys',
      categoryCode: 'E1',
      name: 'Magnetic Supersonic Terminal Architecture Set',
      price: 75,
      oldPrice: 95,
      discount: 21,
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      reviewsCount: 64,
      description: 'Quiet magnetic architectural building tiles featuring translucent runway strips, air traffic control towers, and modular aircraft hangars.',
      ingredients: null,
      specifications: {
        Pieces: '88 Precision Magnetic Tiles',
        Material: 'BPA-Free Food Grade ABS',
        Magnets: 'Encapsulated Rare-Earth Neodymium',
        Tray: 'Folds into compact travel briefcase'
      },
      manual: {
        overview: 'Designed specifically for airplane seat trays to keep young engineers quietly engaged during international crossings.',
        howToUse: 'Open the magnetic travel tray. Snap geometric shapes together to create cantilever airport terminals and runways.',
        importantInfo: 'Magnets are ultrasonic-welded inside high-impact polycarbonate shells.',
        care: 'Sanitize with airport disinfectant wipes between flights.',
        inFlight: 'Quiet design with rubberized magnetic bumpers to eliminate clicking sounds for cabin tranquility.',
        safety: 'Recommended for ages 3+. Meets global toy aviation standards.'
      },
      stock: 26,
      tags: ['building', 'stem', 'magnetic', 'kids', 'junior', 'creative']
    },
    {
      id: 'toy-04',
      category: 'toys',
      categoryCode: 'E1',
      name: 'Flight-Deck Sound & Story Smart Console',
      price: 64,
      oldPrice: 80,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      reviewsCount: 52,
      description: 'Screen-free tactile audio player with airplane cockpit toggle switches, air-traffic control ambient sounds, and 20 interactive aviation adventure stories.',
      ingredients: null,
      specifications: {
        Battery: '30h USB-C Rechargeable',
        HeadphoneJack: 'Dual 3.5mm with 85dB volume limiter',
        Languages: 'English, French, German, Japanese, Arabic',
        Weight: '210g'
      },
      manual: {
        overview: 'An imaginative, screen-free console that transforms child flight time into an interactive captain simulation with volume-safe audio.',
        howToUse: 'Flip the master battery switch. Turn the dial to select a destination audio tale. Plug in headphones.',
        importantInfo: 'Built-in 85dB safety governor prevents acoustic ear strain at cruising altitude.',
        care: 'Clean with damp cloth. Do not expose USB-C charging port to liquids.',
        inFlight: 'TSA and FAA cabin safe. Uses Bluetooth low-energy audio or wired headphones.',
        safety: 'Compliant with WHO pediatric hearing safety standards.'
      },
      stock: 31,
      tags: ['audio', 'stem', 'screenfree', 'junior', 'kids']
    },

    // --- D1: FOOD & GASTRONOMY ---
    {
      id: 'food-01',
      category: 'food',
      categoryCode: 'D1',
      name: 'First Class Truffle Wagyu Flight Bento',
      price: 46,
      oldPrice: 55,
      discount: 16,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 215,
      description: 'Thinly sliced A5 Miyazaki Wagyu beef over truffle-infused organic Koshihikari sushi rice, wild morel mushrooms, and pickled daikon in a sealed thermal bento.',
      ingredients: ['A5 Wagyu Beef', 'Truffle Glaze', 'Organic Koshihikari Rice', 'Wild Morel Mushrooms', 'Pickled Daikon', 'Sesame Seeds'],
      specifications: {
        Calories: '680 kcal',
        ServingTemp: 'Warm or Room Temperature',
        Preparation: 'Prepared fresh hourly by Terminal 3 Executive Chefs',
        Packaging: '100% Biodegradable insulated bento box'
      },
      manual: {
        overview: 'Crafted specifically to combat cabin pressure palate suppression, using high-umami Wagyu and aromatic black truffles.',
        howToUse: 'Consume directly or request your airline attendant to gently warm at 65°C. Open steam tab 10 seconds before dining.',
        importantInfo: 'Best enjoyed within 6 hours of concourse pickup.',
        care: 'Keep in the thermal foil bag until ready to dine.',
        inFlight: 'Pre-cleared through all concourse security screening checkpoints. Zero liquid spills.',
        safety: 'Allergens: Contains Soy, Sesame. Made in a peanut-free airport kitchen.'
      },
      stock: 24,
      tags: ['gourmet', 'wagyu', 'lunch', 'dinner', 'bento', 'entree', 'food']
    },
    {
      id: 'food-02',
      category: 'food',
      categoryCode: 'D1',
      name: 'Artisan Belgian Grand Cru Travel Chocolate Box',
      price: 34,
      oldPrice: 42,
      discount: 19,
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewsCount: 178,
      description: '18 hand-painted single-origin ganaches infused with Madagascar vanilla, Sicilian pistachios, and sea-salt caramel in a luxury embossed travel case.',
      ingredients: ['Cocoa Mass 72%', 'Cocoa Butter', 'Cane Sugar', 'Pistachio Paste', 'Madagascar Vanilla', 'Sea Salt'],
      specifications: {
        Count: '18 Assorted Pralines',
        Origin: 'Brussels, Belgium',
        Packaging: 'Insulated gold-foil gift box with magnetic clasp',
        ShelfLife: '90 Days'
      },
      manual: {
        overview: 'A decadent collection crafted by Belgian master chocolatiers, formulated to resist cabin temperature fluctuations.',
        howToUse: 'Allow praline to rest at ambient room temperature for 5 minutes before tasting to release complex botanical aromatics.',
        importantInfo: 'Store between 15°C and 18°C.',
        care: 'Avoid placing under direct aircraft cabin air-conditioning vents.',
        inFlight: 'Complimentary tamper-evident security sealing for duty-free carry-on.',
        safety: 'Contains Milk, Tree Nuts (Pistachio, Hazelnut). Soy-lecithin free.'
      },
      stock: 40,
      tags: ['chocolate', 'dessert', 'belgian', 'gift', 'luxury', 'food']
    },
    {
      id: 'food-03',
      category: 'food',
      categoryCode: 'D1',
      name: 'Smoked Salmon & Brioche Caviar Roll',
      price: 28,
      oldPrice: 35,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 94,
      description: 'Norwegian cold-smoked salmon on toasted butter brioche with lemon-dill crème fraîche, caper pearls, and a touch of Ossetra caviar.',
      ingredients: ['Norwegian Salmon', 'French Brioche', 'Ossetra Caviar', 'Crème Fraîche', 'Dill', 'Organic Lemon'],
      specifications: {
        Calories: '420 kcal',
        ServingTemp: 'Chilled (4°C - 8°C)',
        Preparation: 'Assembled to order',
        Allergens: 'Fish, Dairy, Gluten'
      },
      manual: {
        overview: 'A light, protein-rich pre-flight delicacy providing essential omega-3 fatty acids to maintain skin hydration during flight.',
        howToUse: 'Squeeze the included organic lemon dropper over caviar and salmon immediately before dining.',
        importantInfo: 'Refrigerate if not consumed within 2 hours.',
        care: 'Supplied with reusable eco-friendly ice gel pack.',
        inFlight: 'TSA clear security compliant food packaging.',
        safety: 'Contains Raw Cured Fish.'
      },
      stock: 15,
      tags: ['seafood', 'snack', 'caviar', 'lunch', 'gourmet', 'food']
    },
    {
      id: 'food-04',
      category: 'food',
      categoryCode: 'D1',
      name: 'Cold-Pressed Jet-Lag Revive Electrolyte Elixir',
      price: 14,
      oldPrice: 18,
      discount: 22,
      image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b7?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      reviewsCount: 130,
      description: 'Organic raw coconut water, ginger root, turmeric, Himalayan pink minerals, and organic lime formulated to rapidly counter high-altitude dehydration.',
      ingredients: ['Raw Coconut Water', 'Cold-Pressed Ginger', 'Turmeric', 'Pink Himalayan Salt', 'Lime Juice'],
      specifications: {
        Volume: '250 ml (Sealed Concourse Delivery)',
        Calories: '65 kcal',
        Sugar: 'Natural fruit sugars only (No added sugar)',
        Electrolytes: '750mg Bio-available Potassium & Magnesium'
      },
      manual: {
        overview: 'Engineered in collaboration with aviation physiology nutritionists to offset humidity drops in passenger cabins.',
        howToUse: 'Shake vigorously. Drink half before boarding and remainder 1 hour into your flight.',
        importantInfo: 'Duty-free security sealed: carry past boarding gate without confiscation.',
        care: 'Keep chilled. Consume within 24 hours of opening.',
        inFlight: 'Pre-cleared duty-free STEB security bag with receipt attached.',
        safety: '100% Vegan, Gluten-Free, Non-GMO.'
      },
      stock: 60,
      tags: ['beverage', 'healthy', 'hydration', 'elixir', 'wellness', 'food']
    },
    {
      id: 'food-05',
      category: 'food',
      categoryCode: 'D1',
      name: 'Himalayan Salted Caramel Macaron Collection',
      price: 26,
      oldPrice: 32,
      discount: 19,
      image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewsCount: 88,
      description: '12 Parisian almond flour macarons filled with slow-cooked golden caramel, dark chocolate ganache, and Fleur de Sel.',
      ingredients: ['Almond Flour', 'Egg Whites', 'Cane Sugar', 'Caramelized Butter', 'Fleur de Sel'],
      specifications: {
        Count: '12 Pieces',
        Calories: '110 kcal per macaron',
        Origin: 'Handmade in Concourse D Artisan Bakery'
      },
      manual: {
        overview: 'Crisp delicate shells with luscious chewy centres that melt effortlessly.',
        howToUse: 'Pairs ideally with espresso or champagne at cruising altitude.',
        importantInfo: 'Store in protective rigid travel tin.',
        care: 'Handle gently to prevent fragile meringues from cracking.',
        inFlight: 'Permitted in cabin carry-on.',
        safety: 'Contains Tree Nuts (Almonds), Eggs, Dairy.'
      },
      stock: 35,
      tags: ['macarons', 'dessert', 'french', 'sweet', 'food']
    },

    // --- F1: FASHION & APPAREL ---
    {
      id: 'fash-01',
      category: 'fashion',
      categoryCode: 'F1',
      name: 'Supersonic Merino Flight Hoodie',
      price: 195,
      oldPrice: 245,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 112,
      description: '100% Australian Superfine Merino wool hoodie with built-in ergonomic sleep mask inside hood, hidden passport pocket, and thermo-regulating weave.',
      ingredients: null,
      specifications: {
        Material: '100% 18.5 Micron Merino Wool (260gsm)',
        Features: 'Built-in pull-down eye mask, secret RFID pocket, thumb loops',
        OdorResistance: 'Naturally antimicrobial up to 7 days wear',
        Fit: 'Relaxed Tailored Travel Fit'
      },
      manual: {
        overview: 'The quintessential traveler’s garment. Naturally regulates body temperature whether transiting a hot tarmac or sleeping in a chilly 18°C cabin.',
        howToUse: 'Pull down the integrated blackout eye mask from the brim of the hood when reclined for sleep.',
        importantInfo: 'Wrinkle-resistant: roll tightly for luggage storage without creasing.',
        care: 'Machine wash delicate wool cycle in cold water. Lay flat to dry.',
        inFlight: 'Wear through security checkpoints without setting off metal detectors.',
        safety: 'Natural non-synthetic fibers prevent static electricity in dry cabins.'
      },
      stock: 22,
      tags: ['apparel', 'hoodie', 'merino', 'comfort', 'fashion', 'men', 'women']
    },
    {
      id: 'fash-02',
      category: 'fashion',
      categoryCode: 'F1',
      name: 'Aviator Titanium Polarized Sunglasses',
      price: 240,
      oldPrice: 290,
      discount: 17,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewsCount: 83,
      description: 'Ultra-lightweight Japanese aerospace titanium frames with polarized sapphire-coated glass lenses providing 100% UV400 protection.',
      ingredients: null,
      specifications: {
        Weight: '16 grams (Featherweight)',
        Lens: 'Category 3 Polarized Mineral Glass',
        Frame: 'Grade 5 Japanese Aerospace Titanium',
        Hinges: 'Screwless German barrel design'
      },
      manual: {
        overview: 'Engineered to withstand intense high-altitude sunlight while eliminating cockpit and window glare.',
        howToUse: 'Rest comfortably on ears. Flexible titanium arms self-adjust without pinching under aviation headphones.',
        importantInfo: 'Scratch-resistant sapphire coating protects against concourse dust.',
        care: 'Rinse with clean water and wipe with the included Japanese silk pouch.',
        inFlight: 'Store in crush-proof magnetic leather travel case.',
        safety: 'Impact resistant to ANSI Z80.3 standards.'
      },
      stock: 14,
      tags: ['sunglasses', 'titanium', 'eyewear', 'pilot', 'fashion', 'luxury']
    },
    {
      id: 'fash-03',
      category: 'fashion',
      categoryCode: 'F1',
      name: 'Aviation Chrono Reversible Bomber Jacket',
      price: 320,
      oldPrice: 395,
      discount: 19,
      image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 67,
      description: 'Dual-faced waterproof Japanese nylon bomber jacket. Flips from matte midnight obsidian business finish to high-visibility safety flight orange.',
      ingredients: null,
      specifications: {
        Outer: 'Cordura Ripstop Nylon with DWR Coating',
        Insulation: 'PrimaLoft Gold Eco 80gsm',
        Hardware: 'YKK Excella Matte Black Zippers',
        Pockets: '6 Pockets including 2 tablet-sized inner compartments'
      },
      manual: {
        overview: 'A high-altitude flight jacket blending military heritage with modern luxury minimalist tailoring.',
        howToUse: 'Easily reverse jacket by unzipping the heavy-duty bidirectional front zipper.',
        importantInfo: 'Water-repellent and windproof up to 60 knots.',
        care: 'Wipe clean or dry clean only to preserve waterproof DWR membrane.',
        inFlight: 'Inner sleeve pocket fits standard passport and boarding pass for frictionless boarding.',
        safety: 'Reflective micro-piping on collar for low-light runway safety.'
      },
      stock: 11,
      tags: ['jacket', 'bomber', 'apparel', 'weatherproof', 'fashion']
    },

    // --- T1: TRAVEL ESSENTIALS ---
    {
      id: 'trav-01',
      category: 'travel',
      categoryCode: 'T1',
      name: '360° Memory Foam Ergonomic Flight Pillow',
      price: 68,
      oldPrice: 85,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 312,
      description: 'High-density dual-zone memory foam with 360-degree chin support, rear flat neck cradle that fits flush against airline headrests, and cooling bamboo cover.',
      ingredients: null,
      specifications: {
        Core: 'Thermo-Sensitive German Memory Foam',
        Cover: 'Organic Cooling Bamboo Lyocell (Washable)',
        Compression: 'Compresses to 1/4 size in travel pouch',
        Weight: '320g'
      },
      manual: {
        overview: 'Engineered to stop head bobbing and cervical vertebrae strain during seated sleeping.',
        howToUse: 'Place flat portion against airplane seat. Adjust the magnetic front clasp to your custom neck girth.',
        importantInfo: 'Roll into travel pouch when not in use to save cabin bag space.',
        care: 'Unzip outer bamboo cover and machine wash. Do not wash internal memory foam core.',
        inFlight: 'Clips securely to luggage handle with quick-release carabiner.',
        safety: 'Hypoallergenic and CertiPUR-US certified non-toxic foam.'
      },
      stock: 58,
      tags: ['pillow', 'sleep', 'comfort', 'essentials', 'travel']
    },
    {
      id: 'trav-02',
      category: 'travel',
      categoryCode: 'T1',
      name: 'RFID Shielded Executive Passport Folio',
      price: 52,
      oldPrice: 65,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewsCount: 165,
      description: 'Full-grain Italian Nappa leather wallet featuring certified military RFID electromagnetic shielding, dual passport slots, boarding pass slip, and SIM card pin tool.',
      ingredients: null,
      specifications: {
        Leather: 'Certified Italian Full-Grain Vegetable Tanned Nappa',
        Shielding: '13.56 MHz RFID / NFC Faraday Mesh',
        Capacity: '2 Passports, 8 Cards, Cash, Boarding Pass, SIM Cards',
        Closure: 'Slim magnetic closure'
      },
      manual: {
        overview: 'Keeps critical travel documents unified while defending biometric chips from unauthorized digital skimming.',
        howToUse: 'Slide passport into the right sleeve. Store boarding documents in the quick-access front slot.',
        importantInfo: 'Blocks 99.99% of radio frequency signals when closed.',
        care: 'Treat with neutral leather cream once every six months.',
        inFlight: 'Fits smoothly into jacket breast pocket or cabin daypack.',
        safety: 'Tested against RFID skimmers up to 3 meters range.'
      },
      stock: 37,
      tags: ['passport', 'wallet', 'rfid', 'leather', 'essentials', 'travel']
    },
    {
      id: 'trav-03',
      category: 'travel',
      categoryCode: 'T1',
      name: 'Compression Packing Cube System (Set of 6)',
      price: 58,
      oldPrice: 75,
      discount: 23,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 220,
      description: 'Ultralight semi-translucent ripstop nylon cubes with dual perimeter compression zippers that reduce clothing volume by up to 60%.',
      ingredients: null,
      specifications: {
        Fabric: '70D Diamond Ripstop Nylon with PU coating',
        Zippers: 'Reinforced Self-Repairing YKK Zippers',
        Sizes: '1 Extra Large, 2 Large, 2 Medium, 1 Water-resistant Shoe Bag',
        Weight: 'Total set 340g'
      },
      manual: {
        overview: 'Organize your carry-on or checked luggage into dedicated modular compartments while saving 60% packing volume.',
        howToUse: '1. Fold garments flat inside cube.\n2. Zip main lid shut.\n3. Pull outer compression zipper to squeeze excess air out.',
        importantInfo: 'Do not over-force compression zipper if fabric is jammed.',
        care: 'Hand wash with lukewarm water. Air dry in shade.',
        inFlight: 'Permits instant airport security bag inspections without unrolling clothes.',
        safety: 'Tear-resistant up to 25kg tensile load.'
      },
      stock: 44,
      tags: ['packing', 'cubes', 'luggage', 'organization', 'essentials']
    },
    {
      id: 'trav-04',
      category: 'travel',
      categoryCode: 'T1',
      name: 'Ultrasonic Leakproof Travel Bottle Set (4x 90ml)',
      price: 32,
      oldPrice: 40,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      reviewsCount: 140,
      description: 'Food-grade silicone bottles with triple-sealed leakproof collars, self-sealing silicone valves, and clear TSA compliance travel pouch.',
      ingredients: null,
      specifications: {
        Capacity: '90ml per bottle (TSA 3-1-1 Liquid Rule Compliant)',
        Material: 'BPA-Free Food Grade Silicone',
        Seal: '3-Layer Anti-Leak Pressure Valve',
        Included: '4 Bottles + Pre-printed Waterproof Labels'
      },
      manual: {
        overview: 'Engineered to withstand cabin pressure drops up to 10,000 feet without leaking lotions or liquids into your baggage.',
        howToUse: 'Fill bottle to 85% capacity (leave 15% headroom for high-altitude air expansion). Twist lid firmly.',
        importantInfo: 'Fully compliant with all international TSA and ICAO aviation liquid security regulations.',
        care: 'Dishwasher safe on top rack.',
        inFlight: 'Clear pouch allows effortless presentation at concourse security scanners.',
        safety: 'BPA, lead, and phthalate free.'
      },
      stock: 65,
      tags: ['bottles', 'tsa', 'liquids', 'hygiene', 'essentials']
    },

    // --- E2: ELECTRONICS & AUDIO ---
    {
      id: 'elec-01',
      category: 'electronics',
      categoryCode: 'E2',
      name: 'AeroSilence Pro Active Noise-Cancelling Headphones',
      price: 340,
      oldPrice: 399,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewsCount: 395,
      description: 'Studio-grade wireless travel headphones with 45dB hybrid ANC tuned specifically for jet turbine hum, memory foam protein leather earcups, and 60-hour battery life.',
      ingredients: null,
      specifications: {
        ANC: '45dB Hybrid Digital Active Noise Cancelling',
        Battery: '60 Hours (ANC on) / 5-min charge gives 4 hours playback',
        Codecs: 'LDAC, aptX Adaptive, AAC, SBC',
        Connectivity: 'Bluetooth 5.3 + Dual-device multipoint + Airplane 2-pin adapter'
      },
      manual: {
        overview: 'The gold standard for air travel acoustics. Eradicates low-frequency turbine roar and loud cabin conversations.',
        howToUse: 'Slide right ear-cup toggle to "ANC". Tap left ear-cup to toggle Transparency / Ambient Awareness mode.',
        importantInfo: 'Included gold-plated airline 2-pin adapter plugs directly into airplane in-flight entertainment jacks.',
        care: 'Store in the hard-shell EVA travel case. Clean ear pads with dry microfiber.',
        inFlight: 'Battery is 100% flight-safe (under 4Wh). Permitted on all commercial flights.',
        safety: 'Volume governor protects hearing. Avoid using ANC when crossing airport tarmac lanes.'
      },
      stock: 28,
      tags: ['headphones', 'anc', 'wireless', 'audio', 'electronics', 'luxury']
    },
    {
      id: 'elec-02',
      category: 'electronics',
      categoryCode: 'E2',
      name: '140W GaN Worldwide Universal Travel Adapter',
      price: 78,
      oldPrice: 95,
      discount: 18,
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 280,
      description: 'Gallium Nitride (GaN III) high-speed charger with integrated sliding plugs for US, UK, EU, AU, and 3x USB-C PD 3.1 ports fast-charging laptops, tablets, and phones simultaneously.',
      ingredients: null,
      specifications: {
        MaxPower: '140W USB-C Power Delivery 3.1',
        Compatibility: 'Over 190 Countries (US/UK/EU/AU)',
        Ports: '3x USB-C, 1x USB-A, 1x Universal AC Pass-Through',
        Safety: 'Auto-resetting 10A thermal fuse'
      },
      manual: {
        overview: 'One plug to rule the world. Fast-charges high-demand 16-inch MacBooks and smartphones simultaneously from any international socket.',
        howToUse: 'Press side button and slide out the appropriate country plug prongs. Plug into wall and connect USB cables.',
        importantInfo: 'Features built-in auto-resetting ceramic fuse; no replacement fuse required if overloaded.',
        care: 'Keep prongs fully retracted inside casing when stowed in travel luggage.',
        inFlight: 'Plugs smoothly into airline seat-back 110V/220V power outlets.',
        safety: 'Fire-retardant V0 polycarbonate housing. Surge and short-circuit protected.'
      },
      stock: 52,
      tags: ['charger', 'adapter', 'gan', 'power', 'electronics', 'travel']
    },
    {
      id: 'elec-03',
      category: 'electronics',
      categoryCode: 'E2',
      name: '25,000mAh 100W Flight-Approved Power Bank',
      price: 110,
      oldPrice: 135,
      discount: 19,
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 190,
      description: 'Airline-certified 92.5Wh external battery with real-time smart OLED wattage display, 100W bi-directional fast charging, and pass-through power.',
      ingredients: null,
      specifications: {
        Capacity: '25,000mAh / 92.5Wh (Strictly under 100Wh TSA limit)',
        Output: '100W Max Single Port USB-C PD',
        Display: 'Digital OLED showing real-time Volts, Amps, and Watts',
        RechargeTime: 'Full recharge in 50 minutes with 100W charger'
      },
      manual: {
        overview: 'Engineered specifically to maximize airline carry-on capacity limits at exactly 92.5Wh, with embossed aviation compliance certification on the back.',
        howToUse: 'Connect device via USB-C. OLED automatically illuminates showing remaining capacity and live wattage draw.',
        importantInfo: 'Must be carried in passenger cabin carry-on only. Prohibited in checked luggage per ICAO rules.',
        care: 'Do not expose to extreme heat exceeding 45°C. Store at 50% charge when not traveling.',
        inFlight: 'Clear TSA compliance certification label allows instant security inspection clearance.',
        safety: 'Multi-layer thermal protection prevents battery swelling or overheating.'
      },
      stock: 33,
      tags: ['powerbank', 'battery', 'fastcharge', 'electronics']
    },
    {
      id: 'elec-04',
      category: 'electronics',
      categoryCode: 'E2',
      name: 'Ultralight Spatial Audio Wireless Earbuds',
      price: 165,
      oldPrice: 199,
      discount: 17,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewsCount: 145,
      description: 'Pressure-vented true wireless earbuds with 3D spatial head tracking, IPX5 sweat resistance, and wireless Qi magnetic charging case.',
      ingredients: null,
      specifications: {
        Battery: '8h buds / 32h total with wireless charging case',
        Microphones: '6-Mic array with beamforming wind noise suppression',
        WaterResistance: 'IPX5 Sweat and Rain Resistant',
        Weight: '4.2g per earbud'
      },
      manual: {
        overview: 'Compact ergonomic earbuds engineered with acoustic acoustic vents that equalize ear canal air pressure during flight descent.',
        howToUse: 'Open charging case near phone for instant one-touch pairing. Tap stems to adjust volume or track.',
        importantInfo: 'Includes 4 sizes of memory-foam ear tips for superior acoustic seal.',
        care: 'Wipe charging contacts clean with dry swab periodically.',
        inFlight: 'Low latency mode ideal for in-flight movie viewing.',
        safety: 'Hearing protection software limits sudden high decibel acoustic spikes.'
      },
      stock: 27,
      tags: ['earbuds', 'audio', 'wireless', 'spatial', 'electronics']
    },

    // --- G1: GIFTS & SOUVENIRS ---
    {
      id: 'gift-01',
      category: 'gifts',
      categoryCode: 'G1',
      name: 'Diecast 1:200 EMRAT Concorde Titanium Edition',
      price: 145,
      oldPrice: 180,
      discount: 19,
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewsCount: 96,
      description: 'Precision scale diecast model of the supersonic flagship airliner with electroplated titanium metallic finish, posable droop-snoop nose, and walnut display plinth.',
      ingredients: null,
      specifications: {
        Scale: '1:200 Scale Model (31cm length)',
        Material: 'Heavy Diecast Zinc Alloy with Titanium Vapor Deposition',
        Base: 'Solid American Walnut with engraved brass nameplate',
        Edition: 'Numbered Limited Collector Edition of 1,000'
      },
      manual: {
        overview: 'A commemorative collector’s tribute celebrating supersonic civil aviation history and EMRAT Airport’s architectural heritage.',
        howToUse: 'Carefully slot aircraft stand mount into the fuselage socket. Position nose angle to either cruise or landing profile.',
        importantInfo: 'Collector item; not intended as a children’s rough-play toy.',
        care: 'Dust with soft feather duster. Do not use chemical solvents on electroplated finish.',
        inFlight: 'Packaged in a laser-cut foam protective presentation gift box with carry handles.',
        safety: 'Contains small display stand parts. Keep away from small children.'
      },
      stock: 19,
      tags: ['collectible', 'model', 'concorde', 'aviation', 'gift', 'souvenir']
    },
    {
      id: 'gift-02',
      category: 'gifts',
      categoryCode: 'G1',
      name: 'Grand Concourse Golden Hour Scented Candle',
      price: 48,
      oldPrice: 60,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewsCount: 78,
      description: 'Hand-poured coconut wax candle capturing the signature scent of Terminal 3: Moroccan cedarwood, Italian bergamot, champagne amber, and white tea.',
      ingredients: ['Organic Coconut Wax', 'Essential Oils', 'Wood Wick', 'Glass Vessel'],
      specifications: {
        BurnTime: '65 Hours',
        Weight: '320g net wax',
        Vessel: 'Smoked amber hand-blown glass with brass lid',
        Wick: 'FSC-Certified Crackling Organic Wooden Wick'
      },
      manual: {
        overview: 'Bring the world-class serenity of EMRAT International Airport’s First-Class Lounges into your home.',
        howToUse: 'Trim wood wick to 5mm before lighting. Allow wax to melt fully to edge on first burn (approx 2 hours).',
        importantInfo: 'Keep away from drafts and combustible materials.',
        care: 'Extinguish with included brass lid to preserve fragrance oils.',
        inFlight: 'Solid wax: permitted in both carry-on and checked luggage without liquid restrictions.',
        safety: 'Never leave burning candle unattended.'
      },
      stock: 42,
      tags: ['candle', 'fragrance', 'home', 'souvenir', 'gift']
    },
    {
      id: 'gift-03',
      category: 'gifts',
      categoryCode: 'G1',
      name: 'Luxury Embossed Leather Flight Logbook',
      price: 62,
      oldPrice: 78,
      discount: 21,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 65,
      description: 'Archival 120gsm fountain-pen-friendly flight journal bound in supple Italian calfskin with gold-gilded edges, world timezone maps, and airline log templates.',
      ingredients: null,
      specifications: {
        Pages: '240 Gilded Pages (Acid-Free Archival Paper)',
        Binding: 'Smyth-Sewn Hand Bound Leather',
        Features: 'Flight tracking logs, ribbon bookmarks, expanding rear pocket',
        Size: 'A5 (148 x 210 mm)'
      },
      manual: {
        overview: 'A keepsake journal designed for frequent fliers to record flight miles, tail numbers, pilot signatures, and travel memories.',
        howToUse: 'Present to cabin purser for captain verification and signature during transcontinental flights.',
        importantInfo: 'Paper formulated to prevent ink feathering with premium fountain pens.',
        care: 'Condition leather occasionally with beeswax leather balm.',
        inFlight: 'Includes front ribbon for fast page lookup during travel.',
        safety: 'Acid-free paper guaranteed to resist yellowing for 100+ years.'
      },
      stock: 25,
      tags: ['journal', 'leather', 'stationery', 'gift', 'souvenir']
    },

    // --- B1: BEAUTY & CARE ---
    {
      id: 'beau-01',
      category: 'beauty',
      categoryCode: 'B1',
      name: 'High-Altitude Hyaluronic Facial Mist (100ml)',
      price: 42,
      oldPrice: 52,
      discount: 19,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 168,
      description: 'Micro-fine hydration spray featuring multi-molecular hyaluronic acid, Alpine rose glacier water, and botanical squalane to combat dry cabin air.',
      ingredients: ['Alpine Glacier Water', 'Multi-Weight Hyaluronic Acid', 'Plant Squalane', 'Niacinamide (Vitamin B3)', 'Chamomile Extract'],
      specifications: {
        Volume: '100ml (TSA Liquid Security Compliant)',
        Dispenser: 'Non-aerosol micro-diffusion pump',
        Formula: 'Alcohol-free, Fragrance-free, Oil-free',
        Suitability: 'All skin types including sensitive skin'
      },
      manual: {
        overview: 'Aircraft cabins have relative humidity levels below 10%, causing rapid epidermal moisture loss. This mist locks moisture in without smudging makeup.',
        howToUse: 'Hold bottle 20cm away, close eyes, and mist evenly across face every 2 to 3 hours during flight.',
        importantInfo: 'TSA approved 100ml volume; clear for security screening.',
        care: 'Store below 30°C away from direct sunlight.',
        inFlight: 'Non-aerosol pump is fully certified for aircraft pressurized cabins.',
        safety: 'Dermatologist tested and ophthalmologist approved for contact lens wearers.'
      },
      stock: 48,
      tags: ['skincare', 'hydration', 'mist', 'beauty', 'wellness']
    },
    {
      id: 'beau-02',
      category: 'beauty',
      categoryCode: 'B1',
      name: 'Sonic Travel Toothbrush with UV Sanitizing Case',
      price: 85,
      oldPrice: 110,
      discount: 23,
      image: 'https://images.unsplash.com/photo-1559591937-e18e8df5e808?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewsCount: 115,
      description: '40,000 vibrations/min acoustic sonic toothbrush housed in an aerospace-grade magnetic travel case with integrated ultraviolet germicidal sterilizer.',
      ingredients: null,
      specifications: {
        Vibrations: '40,000 Sonic Pulses/min',
        Battery: '90 Days on single USB-C charge',
        Sanitization: 'UV-C LED destroys 99.9% of bacteria in 3 minutes',
        Waterproof: 'IPX7 Submersible'
      },
      manual: {
        overview: 'Maintain pristine oral hygiene between connecting flights and long layovers without bathroom contamination worries.',
        howToUse: 'Press power button to cycle through Clean, Sensitive, and White modes. Case automatically activates UV-C sanitization when closed.',
        importantInfo: 'Built-in 2-minute timer with 30-second quadrant quad-pacer.',
        care: 'Rinse brush head thoroughly. Wipe UV case with clean dry cloth.',
        inFlight: 'Compact travel case fits neatly into airplane amenity kits.',
        safety: 'UV light automatically shuts off when case lid is opened to protect eyes.'
      },
      stock: 36,
      tags: ['toothbrush', 'hygiene', 'grooming', 'beauty', 'travel']
    },
    {
      id: 'beau-03',
      category: 'beauty',
      categoryCode: 'B1',
      name: 'Jet-Lag Revival Caffeine Eye Gel Balm',
      price: 38,
      oldPrice: 48,
      discount: 21,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      reviewsCount: 92,
      description: 'Cooling peptide and green coffee eye treatment with ceramic rollerball applicator to instantly de-puff eyes and erase signs of travel fatigue.',
      ingredients: ['Green Coffee Extract', 'Hexapeptide-8', 'Cucumber Hydrosol', 'Marine Collagen', 'Vitamin C'],
      specifications: {
        Volume: '15ml Rollerball Applicator',
        Applicator: 'Cold-touch ceramic micro-ball',
        Effect: 'Clinically proven 88% reduction in puffiness within 15 minutes'
      },
      manual: {
        overview: 'Formulated to revive tired eyes after long night crossings across multiple time zones.',
        howToUse: 'Gently roll ceramic tip under eye contour from inner to outer corner. Pat lightly with ring finger.',
        importantInfo: 'Ceramic tip stays cool naturally without refrigeration.',
        care: 'Wipe tip clean after each use before snapping cap closed.',
        inFlight: 'Compact pocket size for discreet application at your airplane seat.',
        safety: 'Ophthalmologist tested. Safe for sensitive skin.'
      },
      stock: 50,
      tags: ['eyecream', 'skincare', 'caffeine', 'beauty', 'wellness']
    },

    // --- L1: THE LUXURY TERMINAL ---
    {
      id: 'lux-01',
      category: 'luxury',
      categoryCode: 'L1',
      name: 'Chrono-Aero Tourbillon Titanium Timepiece',
      price: 2450,
      oldPrice: 2890,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewsCount: 42,
      description: 'High-complication skeletonized automatic GMT watch in DLC-coated Grade 5 Titanium, double anti-reflective sapphire crystal, and alligator-stitched rubber strap.',
      ingredients: null,
      specifications: {
        Movement: 'Swiss Calibre EA-884 Automatic Flying Tourbillon',
        PowerReserve: '72 Hours Dual Barrel',
        Case: '42mm Grade 5 Titanium with Diamond-Like Carbon (DLC)',
        WaterResistance: '100 Meters / 10 ATM'
      },
      manual: {
        overview: 'An exquisite horological masterpiece engineered for transcontinental travelers with instantaneous dual-timezone tracking.',
        howToUse: 'Crown position 1: Manual winding. Position 2: Independent quick-set GMT 24-hour second timezone hand. Position 3: Local time setting.',
        importantInfo: 'Includes International 5-Year Luxury Concierge Warranty & Certificate of Authenticity.',
        care: 'Rinse with fresh water after ocean exposure. Service every 4 to 5 years at authorized EMRAT boutiques.',
        inFlight: 'Antimagnetic to 15,000 Gauss; immune to airport metal detectors and cabin electronics.',
        safety: 'Secure double-deployant titanium folding clasp prevents accidental release.'
      },
      stock: 5,
      tags: ['watch', 'luxury', 'horology', 'gmt', 'titanium', 'firstclass']
    },
    {
      id: 'lux-02',
      category: 'luxury',
      categoryCode: 'L1',
      name: 'Italian Saffiano Leather Executive Cabin Trolley',
      price: 1250,
      oldPrice: 1500,
      discount: 17,
      image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 38,
      description: 'Handmade Florentine Saffiano scratch-proof leather rolling cabin suitcase with titanium telescopic handle, silent Japanese Hinomoto ball-bearing wheels, and TSA biometric lock.',
      ingredients: null,
      specifications: {
        Dimensions: '55 x 40 x 20 cm (Universal IATA Overhead Bin Compliant)',
        Weight: '3.6 kg',
        Lock: 'TSA Biometric Fingerprint + 3-Dial Combination Lock',
        Wheels: '360° Dual Hinomoto Silent Ball-Bearing Wheels'
      },
      manual: {
        overview: 'Crafted in Florence from durable textured Saffiano leather that shrugs off concourse scuffs and weather.',
        howToUse: 'Register primary and secondary fingerprints into the biometric TSA lock clasp by pressing the recessed enroll button.',
        importantInfo: 'Complies with all major international airline cabin carry-on regulations.',
        care: 'Wipe with damp microfiber cloth. Store with included protective dust bag.',
        inFlight: 'Fits effortlessly into Boeing and Airbus overhead luggage compartments.',
        safety: 'TSA approved lock allows authorized customs inspection without damage.'
      },
      stock: 8,
      tags: ['luggage', 'leather', 'luxury', 'trolley', 'travel']
    },
    {
      id: 'lux-03',
      category: 'luxury',
      categoryCode: 'L1',
      name: 'Bespoke Oudh Imperial Extrait de Parfum (100ml)',
      price: 480,
      oldPrice: 580,
      discount: 17,
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewsCount: 55,
      description: 'Extrait de Parfum featuring 30% concentration of 30-year aged Cambodian wild agarwood, Taif rose, saffron, and ambergris in a heavy crystal flacon with 24K gold stopper.',
      ingredients: ['Wild Agarwood Oudh', 'Taif Rose Essence', 'Persian Saffron', 'Natural Ambergris', 'Smoked Birch'],
      specifications: {
        Concentration: 'Extrait de Parfum (30% pure perfume oil)',
        Longevity: '24+ Hours Sillage',
        Bottle: 'Heavy lead-free crystal with 24K gold plated brass cap',
        Origin: 'Grasse, France'
      },
      manual: {
        overview: 'A regal, hypnotic fragrance commissioned exclusively for the VIP lounges of EMRAT Airport.',
        howToUse: 'Apply 1 to 2 sprays onto pulse points: wrists, collarbone, or sides of the neck.',
        importantInfo: 'Extremely concentrated: a subtle touch provides all-day projection across international flights.',
        care: 'Keep in the velvet-lined presentation box away from direct light.',
        inFlight: 'Packed in a tamper-evident duty-free security bag with official receipt.',
        safety: 'IFRA compliant pure perfume oils.'
      },
      stock: 12,
      tags: ['perfume', 'oudh', 'fragrance', 'luxury', 'exclusive']
    }
  ];

  /* ==========================================================================
     3. CURRENCY CONVERTER SYSTEM
     ========================================================================== */
  const currencySelector = document.getElementById('currencySelector');
  if (currencySelector) {
    currencySelector.value = STATE.currency;
    currencySelector.addEventListener('change', (e) => {
      STATE.currency = e.target.value;
      localStorage.setItem('emrat_currency', STATE.currency);
      renderAllDynamicPrices();
      showToast(`Currency changed to ${STATE.currency}`, 'info');
    });
  }

  function renderAllDynamicPrices() {
    renderProductCatalog();
    renderPersonaRecommendations();
    renderFoodGrid();
    renderToyGrid();
    renderLuxuryGrid();
    updateCartUI();
    updateTrayComposerUI();
  }

  /* ==========================================================================
     4. THEME TOGGLE (AIRPORT NIGHT / AIRPORT DAY)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeLabelText = document.getElementById('themeLabelText');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeLabelText) {
      themeLabelText.textContent = theme === 'night' ? 'Night' : 'Day';
    }
    STATE.theme = theme;
    localStorage.setItem('emrat_theme', theme);
  }

  applyTheme(STATE.theme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const nextTheme = STATE.theme === 'night' ? 'day' : 'night';
      applyTheme(nextTheme);
      showToast(`Switched to Airport ${nextTheme === 'night' ? 'Night' : 'Day'} Mode`, 'gold');
    });
  }

  /* ==========================================================================
     5. NAVIGATION, SCROLL PROGRESS, CLOCKS & CURSOR
     ========================================================================== */
  // Live Terminal Clocks
  const terminalLiveClock = document.getElementById('terminalLiveClock');
  function updateClocks() {
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSecs = String(now.getUTCSeconds()).padStart(2, '0');
    if (terminalLiveClock) {
      terminalLiveClock.textContent = `UTC ${utcHours}:${utcMins}:${utcSecs} (TERMINAL 3)`;
    }
  }
  setInterval(updateClocks, 1000);
  updateClocks();

  // Scroll Progress Bar & Header Shrink
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const mainHeader = document.getElementById('mainHeader');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    if (mainHeader) {
      if (scrollTop > 40) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollTop > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Hamburger Menu
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNavDrawer.classList.contains('open');
      mobileNavDrawer.classList.toggle('open', !isOpen);
      mobileMenuBtn.classList.toggle('open', !isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    mobileNavDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Custom Cursor Following (Desktop only)
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect over interactive elements
    document.querySelectorAll('a, button, input, select, .product-card, .dest-card, .category-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // Animated Metrics Counters on Scroll Reveal
  function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = current;
        }
      }, 30);
    });
  }

  // IntersectionObserver for Scroll Animations
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        if (entry.target.querySelector('.stat-number')) {
          animateCounters();
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     6. INTERACTIVE JOURNEY TIMELINE (7 Stages)
     ========================================================================== */
  const journeyCards = document.querySelectorAll('.journey-step-card');
  const journeyProgressFill = document.getElementById('journeyProgressFill');
  const journeyPlaneIndicator = document.getElementById('journeyPlaneIndicator');

  journeyCards.forEach(card => {
    card.addEventListener('click', () => {
      const stepNum = parseInt(card.getAttribute('data-step'), 10);
      journeyCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const percent = ((stepNum - 1) / 6) * 100;
      if (journeyProgressFill) journeyProgressFill.style.width = `${percent}%`;
      if (journeyPlaneIndicator) journeyPlaneIndicator.style.left = `${percent}%`;

      const title = card.querySelector('.step-title')?.textContent || '';
      showToast(`Journey Stage ${stepNum}: ${title} selected`, 'info');
    });
  });

  /* ==========================================================================
     7. FIDS DEPARTURE BOARD SYSTEM
     ========================================================================== */
  const FIDS_FLIGHTS = [
    { time: '18:45', flight: 'EA 202', dest: 'DUBAI (DXB)', gate: 'B04', zone: 'Concourse B', status: 'ON TIME', badge: 'status-ontime', dutyFree: 'Gate Ready' },
    { time: '19:10', flight: 'EA 884', dest: 'TOKYO (HND)', gate: 'A12', zone: 'Concourse A', status: 'BOARDING', badge: 'status-boarding', dutyFree: 'Last Call' },
    { time: '19:35', flight: 'EA 101', dest: 'LONDON (LHR)', gate: 'C18', zone: 'Concourse C', status: 'GATE OPEN', badge: 'status-gateopen', dutyFree: 'Gate Ready' },
    { time: '20:00', flight: 'EA 330', dest: 'SINGAPORE (SIN)', gate: 'A07', zone: 'Concourse A', status: 'BOARDING', badge: 'status-boarding', dutyFree: 'Delivering' },
    { time: '20:25', flight: 'EA 007', dest: 'NEW YORK (JFK)', gate: 'D02', zone: 'Concourse D', status: 'ON TIME', badge: 'status-ontime', dutyFree: 'Gate Ready' },
    { time: '21:00', flight: 'EA 412', dest: 'PARIS (CDG)', gate: 'B15', zone: 'Concourse B', status: 'GATE OPEN', badge: 'status-gateopen', dutyFree: 'Gate Ready' },
    { time: '21:40', flight: 'EA 550', dest: 'SYDNEY (SYD)', gate: 'C03', zone: 'Concourse C', status: 'ON TIME', badge: 'status-ontime', dutyFree: 'Gate Ready' },
    { time: '22:15', flight: 'EA 714', dest: 'ZURICH (ZRH)', gate: 'A02', zone: 'Concourse A', status: 'ON TIME', badge: 'status-ontime', dutyFree: 'Gate Ready' }
  ];

  const fidsTableBody = document.getElementById('fidsTableBody');
  const refreshFidsBtn = document.getElementById('refreshFidsBtn');
  const fidsUpdatedTime = document.getElementById('fidsUpdatedTime');

  function renderFidsTable() {
    if (!fidsTableBody) return;
    fidsTableBody.innerHTML = FIDS_FLIGHTS.map(f => `
      <tr class="fids-row">
        <td><strong>${f.time}</strong></td>
        <td><span class="fids-flight">${f.flight}</span></td>
        <td><span class="fids-dest">${f.dest}</span></td>
        <td><span class="fids-gate">${f.gate}</span></td>
        <td>${f.zone}</td>
        <td><span class="fids-status ${f.badge}">${f.status}</span></td>
        <td><span class="fids-df-badge">✓ ${f.dutyFree}</span></td>
      </tr>
    `).join('');
  }
  renderFidsTable();

  if (refreshFidsBtn) {
    refreshFidsBtn.addEventListener('click', () => {
      // Simulate flip update
      fidsTableBody.style.opacity = '0.3';
      setTimeout(() => {
        renderFidsTable();
        fidsTableBody.style.opacity = '1';
        if (fidsUpdatedTime) {
          fidsUpdatedTime.textContent = `Last Synchronized: ${new Date().toLocaleTimeString()}`;
        }
        showToast('FIDS Departure Board synchronized with Concourse radar', 'info');
      }, 350);
    });
  }

  /* ==========================================================================
     8. CATEGORY EXPLORER RENDERING
     ========================================================================== */
  const CATEGORIES_DATA = [
    {
      code: 'E1',
      id: 'toys',
      name: 'Toys & Family World',
      count: '12 Items',
      desc: 'STEM robotics, flight kits, plush aviator mascots, and travel games for young navigators.',
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
    },
    {
      code: 'D1',
      id: 'food',
      name: 'Gourmet Food Market',
      count: '18 Items',
      desc: 'First-class Wagyu bentos, artisanal chocolates, healthy hydration elixirs, and inflight meals.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    },
    {
      code: 'F1',
      id: 'fashion',
      name: 'Aviation Fashion',
      count: '15 Items',
      desc: 'Superfine Merino wool hoodies, titanium sunglasses, and waterproof concourse bomber jackets.',
      image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80'
    },
    {
      code: 'T1',
      id: 'travel',
      name: 'Travel Essentials',
      count: '24 Items',
      desc: 'Ergonomic 360° memory pillows, RFID passport folios, and compression packing systems.',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'
    },
    {
      code: 'E2',
      id: 'electronics',
      name: 'Electronics & Audio',
      count: '20 Items',
      desc: '45dB Active Noise Cancelling headphones, 140W GaN universal adapters, and flight power banks.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    },
    {
      code: 'G1',
      id: 'gifts',
      name: 'Gifts & Souvenirs',
      count: '14 Items',
      desc: 'Diecast supersonic Concorde aircraft, terminal luxury candles, and leather flight logbooks.',
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80'
    },
    {
      code: 'B1',
      id: 'beauty',
      name: 'Beauty & Wellness',
      count: '16 Items',
      desc: 'High-altitude hyaluronic mists, sonic travel sanitizers, and jet-lag caffeine eye elixirs.',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    },
    {
      code: 'L1',
      id: 'luxury',
      name: 'The Luxury Terminal',
      count: '10 Items',
      desc: 'Swiss tourbillon horology, Italian Saffiano leather luggage, and rare Oudh perfumery.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const categoriesGrid = document.getElementById('categoriesGrid');
  if (categoriesGrid) {
    categoriesGrid.innerHTML = CATEGORIES_DATA.map(cat => `
      <div class="category-card" data-category-id="${cat.id}">
        <div class="category-img-wrap">
          <img src="${cat.image}" alt="${cat.name}" class="category-img" loading="lazy" />
          <div class="category-overlay"></div>
          <span class="category-code-tag">${cat.code}</span>
          <span class="category-count-tag">${cat.count}</span>
        </div>
        <div class="category-body">
          <div>
            <h3 class="category-name">${cat.name}</h3>
            <p class="category-desc">${cat.desc}</p>
          </div>
          <span class="category-btn-explore">
            EXPLORE CONCOURSE →
          </span>
        </div>
      </div>
    `).join('');

    categoriesGrid.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const catId = card.getAttribute('data-category-id');
        setActiveCategory(catId);
        const catalogSection = document.getElementById('catalog');
        if (catalogSection) {
          catalogSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ==========================================================================
     9. DAILY TRAVELER PERSONA SYSTEM ("MADE FOR YOUR JOURNEY")
     ========================================================================== */
  const PERSONA_CONFIG = {
    commuter: {
      title: 'Daily Commuter & Regional Flight Navigator',
      desc: 'Engineered for speed, ultra-portability, and frictionless concourse transit. Light gear that charges fast and fits seamlessly into seat pockets.',
      badge: 'GATE FAST-TRACK RECOMMENDATIONS',
      categoryPicks: ['travel', 'electronics', 'food']
    },
    business: {
      title: 'Global Executive & Transcontinental Business Traveler',
      desc: 'Command quiet luxury with world-class noise reduction, garment organizers, and certified carry-on power systems that keep you productive at 38,000 feet.',
      badge: 'EXECUTIVE FIRST-CLASS SELECTION',
      categoryPicks: ['electronics', 'fashion', 'luxury']
    },
    family: {
      title: 'Family & Multi-Generational Explorers',
      desc: 'Sensory comfort toys, quiet flight entertainment consoles, spill-proof organizers, and wholesome dining for family tranquility from gate to gate.',
      badge: 'FAMILY CABIN ESSENTIALS',
      categoryPicks: ['toys', 'travel', 'food']
    },
    weekend: {
      title: 'Weekend Explorer & Adventure Jet-Setter',
      desc: 'Durable ripstop compression systems, weather-resistant jackets, and versatile travel grooming kits designed for spontaneous 72-hour escapes.',
      badge: 'WEEKEND CABIN GEAR',
      categoryPicks: ['fashion', 'travel', 'beauty']
    },
    international: {
      title: 'Long-Haul International Crossing Specialist',
      desc: 'High-altitude hydration mists, universal GaN power worldwide converters, 360° neck cradles, and certified duty-free prestige gifts.',
      badge: 'LONG-HAUL INTERCONTINENTAL SUITE',
      categoryPicks: ['travel', 'beauty', 'electronics', 'luxury']
    }
  };

  const personaTabButtons = document.querySelectorAll('.persona-tab-btn');
  const personaContentBox = document.getElementById('personaContentBox');
  const personaProductsGrid = document.getElementById('personaProductsGrid');

  function renderPersonaRecommendations() {
    const config = PERSONA_CONFIG[STATE.selectedPersona] || PERSONA_CONFIG.commuter;
    if (personaContentBox) {
      personaContentBox.innerHTML = `
        <div>
          <div class="persona-box-pill">${config.badge}</div>
          <h3 class="persona-box-title" style="margin-top: 0.5rem;">${config.title}</h3>
          <p class="persona-box-desc">${config.desc}</p>
        </div>
        <a href="#catalog" class="btn btn-secondary" id="personaViewAllBtn">Filter Catalog For This Route →</a>
      `;

      const pBtn = document.getElementById('personaViewAllBtn');
      if (pBtn) {
        pBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const firstCat = config.categoryPicks[0] || 'all';
          setActiveCategory(firstCat);
          document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
        });
      }
    }

    if (personaProductsGrid) {
      // Pick 4 featured products matching the persona categories
      const matching = PRODUCTS.filter(p => config.categoryPicks.includes(p.category)).slice(0, 4);
      personaProductsGrid.innerHTML = matching.map(p => createProductCardHTML(p)).join('');
      attachProductCardEvents(personaProductsGrid);
    }
  }

  personaTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      personaTabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      STATE.selectedPersona = btn.getAttribute('data-persona');
      renderPersonaRecommendations();
    });
  });
  renderPersonaRecommendations();

  /* ==========================================================================
     10. PRODUCT CATALOG RENDERING, FILTERING & SEARCH
     ========================================================================== */
  const catalogSearchInput = document.getElementById('catalogSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterCategoryPills = document.querySelectorAll('.filter-pill');
  const priceRangeSlider = document.getElementById('priceRangeSlider');
  const priceDisplayValue = document.getElementById('priceDisplayValue');
  const ratingRadios = document.querySelectorAll('input[name="ratingFilter"]');
  const inStockCheckbox = document.getElementById('inStockCheckbox');
  const discountCheckbox = document.getElementById('discountCheckbox');
  const sortSelect = document.getElementById('sortSelect');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const emptyStateResetBtn = document.getElementById('emptyStateResetBtn');
  const productsGrid = document.getElementById('productsGrid');
  const noProductsState = document.getElementById('noProductsState');
  const resultsCountText = document.getElementById('resultsCountText');
  const activeChipsContainer = document.getElementById('activeChipsContainer');
  const allCountBadge = document.getElementById('allCount');

  if (allCountBadge) allCountBadge.textContent = PRODUCTS.length;

  function getFilteredProducts() {
    let list = [...PRODUCTS];

    // Category Filter
    if (STATE.activeCategory !== 'all') {
      list = list.filter(p => p.category === STATE.activeCategory);
    }

    // Keyword Search (Name, Description, Tags, Category Code)
    if (STATE.searchQuery.trim()) {
      const q = STATE.searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryCode.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Max Price
    list = list.filter(p => p.price <= STATE.maxPrice);

    // Min Rating
    if (STATE.minRating > 0) {
      list = list.filter(p => p.rating >= STATE.minRating);
    }

    // In Stock Only
    if (STATE.inStockOnly) {
      list = list.filter(p => p.stock > 0);
    }

    // Deals Only
    if (STATE.dealsOnly) {
      list = list.filter(p => p.discount > 0);
    }

    // Sorting
    switch (STATE.sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        list.sort((a, b) => b.discount - a.discount);
        break;
      case 'popular':
        list.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      default:
        // Featured
        break;
    }

    return list;
  }

  function createProductCardHTML(p) {
    const isWishlisted = STATE.wishlist.includes(p.id);
    return `
      <article class="product-card" data-product-id="${p.id}">
        <div class="product-media">
          <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" />
          ${p.discount > 0 ? `<span class="product-badge-discount">-${p.discount}% OFF</span>` : ''}
          <span class="product-badge-dutyfree">DUTY FREE CERTIFIED</span>
          <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" data-wishlist-id="${p.id}" aria-label="Add to wishlist" title="Save item">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
        <div class="product-content">
          <div class="product-meta-row">
            <span class="product-cat-code">${p.categoryCode} • ${p.category.toUpperCase()}</span>
            <span class="product-rating">★ ${p.rating.toFixed(1)} (${p.reviewsCount})</span>
          </div>
          <h4 class="product-name" data-view-id="${p.id}">${p.name}</h4>
          <p class="product-desc-snippet">${p.description}</p>
          
          <div class="product-price-row">
            <span class="price-current">${formatPrice(p.price)}</span>
            ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ''}
            <span class="stock-tag ${p.stock < 10 ? 'low-stock' : ''}">
              ${p.stock < 10 ? `Only ${p.stock} Left` : '✓ Gate Ready'}
            </span>
          </div>

          <div class="product-card-actions">
            <button class="btn btn-secondary btn-card" data-view-id="${p.id}">QUICK VIEW</button>
            <button class="btn btn-outline btn-card" data-manual-id="${p.id}">VIEW MANUAL</button>
            <button class="btn btn-primary btn-card card-action-full" data-add-id="${p.id}">
              <span>+ ADD TO CONCOURSE CART</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function attachProductCardEvents(container) {
    if (!container) return;

    // View Details Modal
    container.querySelectorAll('[data-view-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-view-id');
        openProductModal(id);
      });
    });

    // View Manual Modal
    container.querySelectorAll('[data-manual-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-manual-id');
        openManualModal(id);
      });
    });

    // Add to Cart
    container.querySelectorAll('[data-add-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-add-id');
        addToCart(id, 1);
      });
    });

    // Toggle Wishlist
    container.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-wishlist-id');
        toggleWishlist(id);
      });
    });
  }

  function renderProductCatalog() {
    const list = getFilteredProducts();

    if (resultsCountText) {
      resultsCountText.textContent = `Showing ${list.length} certified airport item${list.length === 1 ? '' : 's'}`;
    }

    renderActiveFilterChips();

    if (!productsGrid || !noProductsState) return;

    if (list.length === 0) {
      productsGrid.style.display = 'none';
      noProductsState.style.display = 'block';
    } else {
      noProductsState.style.display = 'none';
      productsGrid.style.display = 'grid';
      productsGrid.innerHTML = list.map(p => createProductCardHTML(p)).join('');
      attachProductCardEvents(productsGrid);
    }
  }

  function renderActiveFilterChips() {
    if (!activeChipsContainer) return;
    const chips = [];

    if (STATE.activeCategory !== 'all') {
      chips.push({ label: `Category: ${STATE.activeCategory.toUpperCase()}`, clear: () => setActiveCategory('all') });
    }
    if (STATE.searchQuery.trim()) {
      chips.push({ label: `Search: "${STATE.searchQuery}"`, clear: () => {
        STATE.searchQuery = '';
        if (catalogSearchInput) catalogSearchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        renderProductCatalog();
      }});
    }
    if (STATE.maxPrice < 2500) {
      chips.push({ label: `Under ${formatPrice(STATE.maxPrice)}`, clear: () => {
        STATE.maxPrice = 2500;
        if (priceRangeSlider) priceRangeSlider.value = 2500;
        if (priceDisplayValue) priceDisplayValue.textContent = formatPrice(2500);
        renderProductCatalog();
      }});
    }
    if (STATE.minRating > 0) {
      chips.push({ label: `★ ${STATE.minRating}+`, clear: () => {
        STATE.minRating = 0;
        const allRadio = document.querySelector('input[name="ratingFilter"][value="0"]');
        if (allRadio) allRadio.checked = true;
        renderProductCatalog();
      }});
    }
    if (STATE.inStockOnly) {
      chips.push({ label: 'In Stock Only', clear: () => {
        STATE.inStockOnly = false;
        if (inStockCheckbox) inStockCheckbox.checked = false;
        renderProductCatalog();
      }});
    }
    if (STATE.dealsOnly) {
      chips.push({ label: 'Deals Only', clear: () => {
        STATE.dealsOnly = false;
        if (discountCheckbox) discountCheckbox.checked = false;
        renderProductCatalog();
      }});
    }

    activeChipsContainer.innerHTML = chips.map((c, idx) => `
      <span class="filter-chip">
        ${c.label}
        <span class="chip-remove" data-chip-idx="${idx}">✕</span>
      </span>
    `).join('');

    activeChipsContainer.querySelectorAll('.chip-remove').forEach(rm => {
      rm.addEventListener('click', () => {
        const idx = rm.getAttribute('data-chip-idx');
        if (chips[idx]) chips[idx].clear();
      });
    });
  }

  function setActiveCategory(cat) {
    STATE.activeCategory = cat;
    filterCategoryPills.forEach(p => {
      const isMatch = p.getAttribute('data-category') === cat;
      p.classList.toggle('active', isMatch);
    });
    renderProductCatalog();
  }

  // Filter Listeners
  filterCategoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      setActiveCategory(pill.getAttribute('data-category'));
    });
  });

  if (catalogSearchInput) {
    catalogSearchInput.addEventListener('input', (e) => {
      STATE.searchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = STATE.searchQuery ? 'block' : 'none';
      }
      renderProductCatalog();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      STATE.searchQuery = '';
      if (catalogSearchInput) catalogSearchInput.value = '';
      clearSearchBtn.style.display = 'none';
      renderProductCatalog();
    });
  }

  if (priceRangeSlider) {
    priceRangeSlider.addEventListener('input', (e) => {
      STATE.maxPrice = Number(e.target.value);
      if (priceDisplayValue) {
        priceDisplayValue.textContent = formatPrice(STATE.maxPrice);
      }
      renderProductCatalog();
    });
  }

  ratingRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.checked) {
        STATE.minRating = Number(e.target.value);
        renderProductCatalog();
      }
    });
  });

  if (inStockCheckbox) {
    inStockCheckbox.addEventListener('change', (e) => {
      STATE.inStockOnly = e.target.checked;
      renderProductCatalog();
    });
  }

  if (discountCheckbox) {
    discountCheckbox.addEventListener('change', (e) => {
      STATE.dealsOnly = e.target.checked;
      renderProductCatalog();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      STATE.sortBy = e.target.value;
      renderProductCatalog();
    });
  }

  function resetAllFilters() {
    STATE.activeCategory = 'all';
    STATE.searchQuery = '';
    STATE.maxPrice = 2500;
    STATE.minRating = 0;
    STATE.inStockOnly = false;
    STATE.dealsOnly = false;
    STATE.sortBy = 'featured';

    if (catalogSearchInput) catalogSearchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    if (priceRangeSlider) priceRangeSlider.value = 2500;
    if (priceDisplayValue) priceDisplayValue.textContent = formatPrice(2500);
    const allRadio = document.querySelector('input[name="ratingFilter"][value="0"]');
    if (allRadio) allRadio.checked = true;
    if (inStockCheckbox) inStockCheckbox.checked = false;
    if (discountCheckbox) discountCheckbox.checked = false;
    if (sortSelect) sortSelect.value = 'featured';

    filterCategoryPills.forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-category') === 'all');
    });

    renderProductCatalog();
    showToast('Filters reset to concourse defaults', 'info');
  }

  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);
  if (emptyStateResetBtn) emptyStateResetBtn.addEventListener('click', resetAllFilters);

  // Mobile Filter Drawer Toggle
  const mobileFilterToggleBtn = document.getElementById('mobileFilterToggleBtn');
  const catalogSidebar = document.getElementById('catalogSidebar');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');

  if (mobileFilterToggleBtn && catalogSidebar) {
    mobileFilterToggleBtn.addEventListener('click', () => {
      catalogSidebar.classList.add('open');
    });
  }
  if (closeSidebarBtn && catalogSidebar) {
    closeSidebarBtn.addEventListener('click', () => {
      catalogSidebar.classList.remove('open');
    });
  }

  renderProductCatalog();

  /* ==========================================================================
     11. PRODUCT DETAIL MODAL (5 TABS)
     ========================================================================== */
  const productModalOverlay = document.getElementById('productModalOverlay');
  const productModalBody = document.getElementById('productModalBody');
  const closeProductModalBtn = document.getElementById('closeProductModalBtn');

  function openProductModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || !productModalBody) return;

    productModalBody.innerHTML = `
      <div class="modal-grid-layout">
        <div class="modal-gallery-wrap">
          <img src="${product.image}" alt="${product.name}" class="modal-main-img" />
          <div class="modal-duty-free-cert">
            <span>🛡️ Official Concourse Duty-Free Authentication Guarantee</span>
          </div>
        </div>

        <div class="modal-info-wrap">
          <div class="product-meta-row">
            <span class="product-cat-code">${product.categoryCode} • ${product.category.toUpperCase()}</span>
            <span class="product-rating">★ ${product.rating.toFixed(1)} (${product.reviewsCount} passenger reviews)</span>
          </div>

          <h2 class="modal-product-title" style="font-size: 1.6rem; margin-bottom: 0.75rem;">${product.name}</h2>
          
          <div class="product-price-row" style="margin-bottom: 1.5rem;">
            <span class="price-current" style="font-size: 1.8rem;">${formatPrice(product.price)}</span>
            ${product.oldPrice ? `<span class="price-old" style="font-size: 1.1rem;">${formatPrice(product.oldPrice)}</span>` : ''}
            <span class="stock-tag ${product.stock < 10 ? 'low-stock' : ''}">
              ${product.stock < 10 ? `Only ${product.stock} items left in Terminal Stock` : '✓ In Stock at Gate Delivery Hub'}
            </span>
          </div>

          <!-- 5 Tabs Navigation -->
          <div class="modal-tabs-nav" role="tablist">
            <button class="modal-tab-btn active" data-tab="tab-overview">Overview</button>
            <button class="modal-tab-btn" data-tab="tab-specs">Specifications</button>
            <button class="modal-tab-btn" data-tab="tab-manual">Manual</button>
            <button class="modal-tab-btn" data-tab="tab-reviews">Reviews</button>
            <button class="modal-tab-btn" data-tab="tab-travel">Travel Info</button>
          </div>

          <!-- Tab 1: Overview -->
          <div class="modal-tab-pane active" id="tab-overview">
            <p style="margin-bottom: 1rem;">${product.description}</p>
            <ul style="list-style: disc; padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
              <li>Pre-inspected and sealed in tamper-evident security bags (STEBs).</li>
              <li>Free direct-to-gate delivery before your final boarding call.</li>
              <li>30-day global exchange warranty across all EMRAT partner terminals.</li>
            </ul>
          </div>

          <!-- Tab 2: Specifications -->
          <div class="modal-tab-pane" id="tab-specs">
            <table class="modal-spec-table">
              <tbody>
                ${Object.entries(product.specifications).map(([k, v]) => `
                  <tr>
                    <td>${k}:</td>
                    <td>${v}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Tab 3: Manual Preview -->
          <div class="modal-tab-pane" id="tab-manual">
            <p style="margin-bottom: 0.75rem;"><strong>Quick Guide:</strong> ${product.manual.overview}</p>
            <p style="margin-bottom: 1.25rem; font-size: 0.85rem; color: var(--text-muted);">Launch the full 6-step interactive manual reader for complete flight protocols, battery rules, and care instructions.</p>
            <button class="btn btn-outline" id="modalOpenFullManualBtn" data-manual-id="${product.id}">
              📖 Open Full Interactive Manual Reader
            </button>
          </div>

          <!-- Tab 4: Reviews -->
          <div class="modal-tab-pane" id="tab-reviews">
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              <div style="background: var(--bg-surface-elevated); padding: 0.85rem 1rem; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.25rem;">
                  <strong style="color: var(--text-primary);">Marcus V. • First Class Passenger</strong>
                  <span style="color: var(--gold-primary);">★★★★★</span>
                </div>
                <p style="font-size: 0.82rem; color: var(--text-secondary);">"Purchased this right before boarding flight EA 202 to Dubai. Concourse runner handed it to me at Gate B04 in perfect packaging!"</p>
              </div>
              <div style="background: var(--bg-surface-elevated); padding: 0.85rem 1rem; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.25rem;">
                  <strong style="color: var(--text-primary);">Aisha K. • Frequent Traveler</strong>
                  <span style="color: var(--gold-primary);">★★★★★</span>
                </div>
                <p style="font-size: 0.82rem; color: var(--text-secondary);">"Exceptional quality. Exactly as described, and the duty-free price was substantially cheaper than downtown boutiques."</p>
              </div>
            </div>
          </div>

          <!-- Tab 5: Travel Info -->
          <div class="modal-tab-pane" id="tab-travel">
            <div style="background: rgba(0, 229, 255, 0.08); border: 1px solid rgba(0, 229, 255, 0.2); padding: 1rem; border-radius: 8px;">
              <h5 style="color: var(--cyan-primary); margin-bottom: 0.4rem; font-size: 0.85rem;">AIRLINE SECURITY COMPLIANCE</h5>
              <p style="font-size: 0.82rem; line-height: 1.5; color: var(--text-secondary);">
                This item is certified for cabin carry-on across international civil aviation authorities (ICAO, TSA, EASA). If liquids or lithium batteries are included, they are strictly within commercial passenger allowances.
              </p>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="modal-action-row">
            <div class="qty-control" style="height: 44px;">
              <button class="qty-btn" id="modalQtyMinus">-</button>
              <span class="qty-val" id="modalQtyVal" style="min-width: 30px; text-align: center;">1</span>
              <button class="qty-btn" id="modalQtyPlus">+</button>
            </div>
            <button class="btn btn-primary btn-glow" id="modalAddToCartBtn" style="flex-grow: 1;">
              <span>+ ADD TO CONCOURSE CART</span>
            </button>
            <button class="btn btn-secondary" id="modalWishlistBtn" title="Add to Wishlist">
              ♥
            </button>
          </div>
        </div>
      </div>
    `;

    // Tab Switching inside Modal
    const tabButtons = productModalBody.querySelectorAll('.modal-tab-btn');
    const tabPanes = productModalBody.querySelectorAll('.modal-tab-pane');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const activePane = productModalBody.querySelector(`#${targetTab}`);
        if (activePane) activePane.classList.add('active');
      });
    });

    // Quantity controls in Modal
    let modalQty = 1;
    const modalQtyVal = productModalBody.querySelector('#modalQtyVal');
    productModalBody.querySelector('#modalQtyMinus').addEventListener('click', () => {
      if (modalQty > 1) {
        modalQty--;
        modalQtyVal.textContent = modalQty;
      }
    });
    productModalBody.querySelector('#modalQtyPlus').addEventListener('click', () => {
      if (modalQty < product.stock) {
        modalQty++;
        modalQtyVal.textContent = modalQty;
      }
    });

    // Add to Cart from Modal
    productModalBody.querySelector('#modalAddToCartBtn').addEventListener('click', () => {
      addToCart(product.id, modalQty);
      closeModal(productModalOverlay);
    });

    // Wishlist Toggle from Modal
    productModalBody.querySelector('#modalWishlistBtn').addEventListener('click', () => {
      toggleWishlist(product.id);
    });

    // Full Manual Reader trigger from tab 3
    const openFullManualBtn = productModalBody.querySelector('#modalOpenFullManualBtn');
    if (openFullManualBtn) {
      openFullManualBtn.addEventListener('click', () => {
        closeModal(productModalOverlay);
        openManualModal(product.id);
      });
    }

    openModal(productModalOverlay);
  }

  if (closeProductModalBtn) {
    closeProductModalBtn.addEventListener('click', () => closeModal(productModalOverlay));
  }

  /* ==========================================================================
     12. INTERACTIVE PRODUCT MANUAL VIEWER (6 Steps)
     ========================================================================== */
  const manualModalOverlay = document.getElementById('manualModalOverlay');
  const closeManualModalBtn = document.getElementById('closeManualModalBtn');
  const manualProductTitle = document.getElementById('manualProductTitle');
  const manualCategoryCode = document.getElementById('manualCategoryCode');
  const manualContentView = document.getElementById('manualContentView');
  const manualStepItems = document.querySelectorAll('.manual-step-item');
  const manualPrevBtn = document.getElementById('manualPrevBtn');
  const manualNextBtn = document.getElementById('manualNextBtn');
  const manualStepCounter = document.getElementById('manualStepCounter');
  const printManualBtn = document.getElementById('printManualBtn');

  const MANUAL_SECTIONS = [
    { key: 'overview', title: '1. Product Overview & Architecture' },
    { key: 'howToUse', title: '2. How to Use & Operating Setup' },
    { key: 'importantInfo', title: '3. Important Information & Battery Rules' },
    { key: 'care', title: '4. Care & Maintenance Instructions' },
    { key: 'inFlight', title: '5. In-Flight & Aviation Security Guidelines' },
    { key: 'safety', title: '6. Safety Information & Warranty Disclaimers' }
  ];

  function openManualModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    STATE.activeManualProduct = product;
    STATE.activeManualStep = 1;

    if (manualProductTitle) manualProductTitle.textContent = `${product.name} — User Manual`;
    if (manualCategoryCode) manualCategoryCode.textContent = `${product.categoryCode} • CONCOURSE GUIDE`;

    renderManualStep(1);
    openModal(manualModalOverlay);
  }

  function renderManualStep(stepNumber) {
    if (!STATE.activeManualProduct || !manualContentView) return;
    STATE.activeManualStep = stepNumber;

    const sectionMeta = MANUAL_SECTIONS[stepNumber - 1];
    const sectionContent = STATE.activeManualProduct.manual[sectionMeta.key] || 'No specific instructions recorded for this section.';

    manualContentView.innerHTML = `
      <div class="manual-section-card">
        <h4 class="manual-section-title">${sectionMeta.title}</h4>
        <div style="background: var(--bg-surface-elevated); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-glass); font-size: 0.95rem; line-height: 1.8; color: var(--text-primary); white-space: pre-line;">
          ${sectionContent}
        </div>
      </div>
    `;

    manualStepItems.forEach(item => {
      const step = parseInt(item.getAttribute('data-manual-step'), 10);
      item.classList.toggle('active', step === stepNumber);
    });

    if (manualPrevBtn) manualPrevBtn.disabled = (stepNumber === 1);
    if (manualNextBtn) {
      if (stepNumber === 6) {
        manualNextBtn.textContent = 'Finish Reading ✓';
      } else {
        manualNextBtn.textContent = 'Next Section →';
      }
    }
    if (manualStepCounter) {
      manualStepCounter.textContent = `Section ${stepNumber} of 6`;
    }
  }

  manualStepItems.forEach(item => {
    item.addEventListener('click', () => {
      const step = parseInt(item.getAttribute('data-manual-step'), 10);
      renderManualStep(step);
    });
  });

  if (manualPrevBtn) {
    manualPrevBtn.addEventListener('click', () => {
      if (STATE.activeManualStep > 1) {
        renderManualStep(STATE.activeManualStep - 1);
      }
    });
  }

  if (manualNextBtn) {
    manualNextBtn.addEventListener('click', () => {
      if (STATE.activeManualStep < 6) {
        renderManualStep(STATE.activeManualStep + 1);
      } else {
        closeModal(manualModalOverlay);
        showToast('You completed the product manual guide', 'success');
      }
    });
  }

  if (printManualBtn) {
    printManualBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (closeManualModalBtn) {
    closeManualModalBtn.addEventListener('click', () => closeModal(manualModalOverlay));
  }

  /* ==========================================================================
     13. D1 FOOD MARKET & "WHAT'S ON YOUR TRAY?" MEAL COMPOSER
     ========================================================================== */
  const foodGrid = document.getElementById('foodGrid');
  const foodCategoryTabs = document.getElementById('foodCategoryTabs');

  function renderFoodGrid(filterCat = 'all') {
    if (!foodGrid) return;
    let foodItems = PRODUCTS.filter(p => p.category === 'food');

    if (filterCat === 'breakfast') foodItems = foodItems.filter(p => p.tags.includes('breakfast') || p.tags.includes('gourmet'));
    if (filterCat === 'lunch') foodItems = foodItems.filter(p => p.tags.includes('lunch') || p.tags.includes('dinner'));
    if (filterCat === 'snacks') foodItems = foodItems.filter(p => p.tags.includes('snack'));
    if (filterCat === 'desserts') foodItems = foodItems.filter(p => p.tags.includes('dessert') || p.tags.includes('chocolate'));
    if (filterCat === 'beverages') foodItems = foodItems.filter(p => p.tags.includes('beverage') || p.tags.includes('hydration'));

    foodGrid.innerHTML = foodItems.map(p => `
      <div class="food-card">
        <div class="product-media">
          <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" />
          <span class="product-badge-dutyfree">MICHELIN GOURMET</span>
        </div>
        <div class="product-content">
          <div class="food-tags-row">
            ${(p.ingredients || []).slice(0, 3).map(ing => `<span class="food-tag">${ing}</span>`).join('')}
            ${p.specifications.Calories ? `<span class="food-tag">${p.specifications.Calories}</span>` : ''}
          </div>
          <h4 class="product-name" data-view-id="${p.id}">${p.name}</h4>
          <p class="product-desc-snippet">${p.description}</p>
          <div class="product-price-row">
            <span class="price-current">${formatPrice(p.price)}</span>
            <span class="stock-tag">Prep: Fresh Hourly</span>
          </div>
          <div class="product-card-actions">
            <button class="btn btn-secondary btn-card" data-view-id="${p.id}">INGREDIENTS</button>
            <button class="btn btn-primary btn-card" data-add-id="${p.id}">+ ADD TO ORDER</button>
          </div>
        </div>
      </div>
    `).join('');

    attachProductCardEvents(foodGrid);
  }
  renderFoodGrid();

  if (foodCategoryTabs) {
    foodCategoryTabs.querySelectorAll('.food-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        foodCategoryTabs.querySelectorAll('.food-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderFoodGrid(btn.getAttribute('data-food-cat'));
      });
    });
  }

  // --- WHAT'S ON YOUR TRAY? COMPOSER ---
  const TRAY_OPTIONS = [
    { slot: 'entree', name: 'First Class Truffle Wagyu Bento', price: 46, cal: 680, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80' },
    { slot: 'snack', name: 'Smoked Salmon & Brioche Caviar', price: 28, cal: 420, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80' },
    { slot: 'dessert', name: 'Artisan Belgian Grand Cru Chocolates', price: 34, cal: 260, img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=400&q=80' },
    { slot: 'dessert', name: 'Himalayan Salted Caramel Macarons', price: 26, cal: 220, img: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=400&q=80' },
    { slot: 'beverage', name: 'Cold-Pressed Jet-Lag Electrolyte Elixir', price: 14, cal: 65, img: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b7?auto=format&fit=crop&w=400&q=80' }
  ];

  const slotEntree = document.getElementById('slotEntree');
  const slotSnack = document.getElementById('slotSnack');
  const slotDessert = document.getElementById('slotDessert');
  const slotBeverage = document.getElementById('slotBeverage');
  const trayItemsList = document.getElementById('trayItemsList');
  const trayCalories = document.getElementById('trayCalories');
  const trayPrepTime = document.getElementById('trayPrepTime');
  const trayTotalPrice = document.getElementById('trayTotalPrice');
  const addTrayToCartBtn = document.getElementById('addTrayToCartBtn');
  const clearTrayBtn = document.getElementById('clearTrayBtn');
  const trayQuickPicker = document.getElementById('trayQuickPicker');

  function renderTrayQuickPicker() {
    if (!trayQuickPicker) return;
    trayQuickPicker.innerHTML = TRAY_OPTIONS.map((item, idx) => `
      <button class="picker-chip-btn" data-tray-idx="${idx}">
        <span>+</span> ${item.name} (${formatPrice(item.price)})
      </button>
    `).join('');

    trayQuickPicker.querySelectorAll('.picker-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.getAttribute('data-tray-idx');
        const chosen = TRAY_OPTIONS[idx];
        setTraySlot(chosen.slot, chosen);
      });
    });
  }
  renderTrayQuickPicker();

  function setTraySlot(slot, item) {
    STATE.trayMeal[slot] = item;
    updateTrayComposerUI();
    showToast(`Added ${item.name} to flight tray`, 'gold');
  }

  function updateTrayComposerUI() {
    const slotsMap = {
      entree: slotEntree,
      snack: slotSnack,
      dessert: slotDessert,
      beverage: slotBeverage
    };

    let totalCal = 0;
    let totalPriceUSD = 0;
    let filledCount = 0;
    const filledItems = [];

    Object.entries(STATE.trayMeal).forEach(([slotKey, item]) => {
      const el = slotsMap[slotKey];
      if (!el) return;

      if (item) {
        filledCount++;
        totalCal += item.cal;
        totalPriceUSD += item.price;
        filledItems.push(item);
        el.classList.add('filled');
        el.innerHTML = `
          <div class="slot-header">${slotKey.toUpperCase()}</div>
          <button class="slot-remove-btn" data-remove-slot="${slotKey}" title="Remove slot item">✕</button>
          <div class="slot-filled-content">
            <img src="${item.img}" alt="${item.name}" class="slot-item-img" />
            <span class="slot-item-name">${item.name}</span>
            <span class="slot-item-price">${formatPrice(item.price)}</span>
          </div>
        `;

        el.querySelector('[data-remove-slot]')?.addEventListener('click', (e) => {
          e.stopPropagation();
          STATE.trayMeal[slotKey] = null;
          updateTrayComposerUI();
        });
      } else {
        el.classList.remove('filled');
        el.innerHTML = `
          <div class="slot-header">${slotKey.toUpperCase()}</div>
          <div class="slot-placeholder">
            <span class="slot-icon">${slotKey === 'entree' ? '🍱' : slotKey === 'snack' ? '🥐' : slotKey === 'dessert' ? '🍰' : '☕'}</span>
            <span class="slot-label">Select ${slotKey}</span>
          </div>
        `;
      }
    });

    if (trayCalories) trayCalories.textContent = `${totalCal} kcal`;
    if (trayPrepTime) trayPrepTime.textContent = filledCount > 0 ? '12-15 Mins' : 'Immediate';
    if (trayTotalPrice) trayTotalPrice.textContent = formatPrice(totalPriceUSD);

    if (trayItemsList) {
      if (filledItems.length === 0) {
        trayItemsList.innerHTML = '<li class="tray-empty-hint">Click options below or browse to fill your 4 flight tray slots.</li>';
      } else {
        trayItemsList.innerHTML = filledItems.map(it => `
          <li class="tray-item-row">
            <span>${it.name}</span>
            <strong style="color: var(--gold-primary);">${formatPrice(it.price)}</strong>
          </li>
        `).join('');
      }
    }

    if (addTrayToCartBtn) {
      addTrayToCartBtn.disabled = (filledCount === 0);
    }
  }

  if (clearTrayBtn) {
    clearTrayBtn.addEventListener('click', () => {
      STATE.trayMeal = { entree: null, snack: null, dessert: null, beverage: null };
      updateTrayComposerUI();
      showToast('Flight meal tray reset', 'info');
    });
  }

  if (addTrayToCartBtn) {
    addTrayToCartBtn.addEventListener('click', () => {
      // Add each slotted item to cart
      Object.values(STATE.trayMeal).forEach(item => {
        if (item) {
          // Find matching product or create combo item
          const match = PRODUCTS.find(p => p.name.toLowerCase() === item.name.toLowerCase());
          if (match) {
            addToCart(match.id, 1, false);
          }
        }
      });
      saveCart();
      openCartDrawer();
      showToast('Custom First-Class Flight Tray added to your cart!', 'success');
    });
  }

  // Pre-fill tray with an initial selection for demonstration
  setTraySlot('entree', TRAY_OPTIONS[0]);
  setTraySlot('beverage', TRAY_OPTIONS[4]);

  /* ==========================================================================
     14. E1 TRAVEL TOY WORLD & AGE FILTERS
     ========================================================================== */
  const toyGrid = document.getElementById('toyGrid');
  const toyAgeFilters = document.getElementById('toyAgeFilters');

  function renderToyGrid(age = 'all') {
    if (!toyGrid) return;
    let toys = PRODUCTS.filter(p => p.category === 'toys');

    if (age === 'toddler') toys = toys.filter(p => p.tags.includes('toddler') || p.tags.includes('plush'));
    if (age === 'junior') toys = toys.filter(p => p.tags.includes('junior') || p.tags.includes('building') || p.tags.includes('audio'));
    if (age === 'explorer') toys = toys.filter(p => p.tags.includes('drone') || p.tags.includes('stem'));

    toyGrid.innerHTML = toys.map(p => createProductCardHTML(p)).join('');
    attachProductCardEvents(toyGrid);
  }
  renderToyGrid();

  if (toyAgeFilters) {
    toyAgeFilters.querySelectorAll('.toy-age-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        toyAgeFilters.querySelectorAll('.toy-age-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderToyGrid(btn.getAttribute('data-age'));
      });
    });
  }

  /* ==========================================================================
     15. THE LUXURY TERMINAL VIP SHOWCASE
     ========================================================================== */
  const luxuryGrid = document.getElementById('luxuryGrid');
  function renderLuxuryGrid() {
    if (!luxuryGrid) return;
    const luxuryItems = PRODUCTS.filter(p => p.category === 'luxury');
    luxuryGrid.innerHTML = luxuryItems.map(p => `
      <div class="luxury-product-card">
        <div class="product-media" style="height: 280px;">
          <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" />
          <span class="product-badge-dutyfree" style="color: var(--gold-primary); border-color: var(--gold-primary);">L1 • PRIVATE CONCOURSE</span>
        </div>
        <div class="product-content">
          <div class="product-meta-row">
            <span class="product-cat-code" style="color: var(--gold-primary);">L1 — VIP LUXURY</span>
            <span class="product-rating">★ ${p.rating.toFixed(1)}</span>
          </div>
          <h4 class="product-name" data-view-id="${p.id}">${p.name}</h4>
          <p class="product-desc-snippet">${p.description}</p>
          <div class="product-price-row">
            <span class="price-current" style="font-size: 1.5rem;">${formatPrice(p.price)}</span>
            ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ''}
          </div>
          <div class="product-card-actions">
            <button class="btn btn-secondary btn-card" data-view-id="${p.id}">VIEW SPECIFICATIONS</button>
            <button class="btn btn-outline btn-card" data-vip-view="${p.id}">REQUEST PRIVATE VIEWING</button>
            <button class="btn btn-primary btn-card card-action-full" data-add-id="${p.id}">+ ADD TO VIP CART</button>
          </div>
        </div>
      </div>
    `).join('');

    attachProductCardEvents(luxuryGrid);

    luxuryGrid.querySelectorAll('[data-vip-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('VIP Concierge Lounge viewing scheduled at Terminal 3 Concourse Suite', 'gold');
      });
    });
  }
  renderLuxuryGrid();

  /* ==========================================================================
     16. SHOPPING CART & GATE DELIVERY CHECKOUT FLOW
     ========================================================================== */
  const cartTriggerBtn = document.getElementById('cartTriggerBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartCount = document.getElementById('cartCount');
  const cartDrawerCount = document.getElementById('cartDrawerCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartSavings = document.getElementById('cartSavings');
  const cartGrandTotal = document.getElementById('cartGrandTotal');
  const thresholdProgress = document.getElementById('thresholdProgress');
  const thresholdStatusText = document.getElementById('thresholdStatusText');
  const continueShoppingBtn = document.getElementById('continueShoppingBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');

  function openCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('open');
    }
  }

  function closeCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('open');
    }
  }

  if (cartTriggerBtn) cartTriggerBtn.addEventListener('click', openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);
  if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeCartDrawer);

  function addToCart(productId, quantity = 1, showNotice = true) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = STATE.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      STATE.cart[existingIndex].quantity += quantity;
    } else {
      STATE.cart.push({
        id: product.id,
        quantity: quantity
      });
    }

    saveCart();
    if (showNotice) {
      showToast(`Added ${quantity}x "${product.name}" to cart`, 'success');
    }
  }

  function updateCartUI() {
    const totalItems = STATE.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    if (cartDrawerCount) cartDrawerCount.textContent = `${totalItems} Item${totalItems === 1 ? '' : 's'}`;

    if (!cartItemsContainer) return;

    if (STATE.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">🛍️</div>
          <h4 style="font-family: var(--font-display); margin-bottom: 0.5rem; color: var(--text-primary);">Your Airport Cart is Empty</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">Explore our duty-free concourse and order items directly to your gate seat.</p>
          <a href="#catalog" class="btn btn-primary" id="cartShopNowBtn">EXPLORE DUTY FREE</a>
        </div>
      `;
      const sBtn = document.getElementById('cartShopNowBtn');
      if (sBtn) sBtn.addEventListener('click', closeCartDrawer);

      if (cartSubtotal) cartSubtotal.textContent = formatPrice(0);
      if (cartSavings) cartSavings.textContent = `-${formatPrice(0)}`;
      if (cartGrandTotal) cartGrandTotal.textContent = formatPrice(0);
      if (thresholdProgress) thresholdProgress.style.width = '0%';
      if (thresholdStatusText) thresholdStatusText.textContent = `Add ${formatPrice(100)} for Free VIP Gate Delivery`;
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    let subtotalUSD = 0;
    let savingsUSD = 0;

    cartItemsContainer.innerHTML = STATE.cart.map((cartItem, idx) => {
      const product = PRODUCTS.find(p => p.id === cartItem.id);
      if (!product) return '';

      const lineTotal = product.price * cartItem.quantity;
      subtotalUSD += lineTotal;
      if (product.oldPrice) {
        savingsUSD += (product.oldPrice - product.price) * cartItem.quantity;
      }

      return `
        <div class="cart-item-card">
          <img src="${product.image}" alt="${product.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <h5 class="cart-item-name">${product.name}</h5>
            <span class="cart-item-category">${product.categoryCode} • ${product.category.toUpperCase()}</span>
            <div class="cart-item-bottom">
              <span class="cart-item-price">${formatPrice(lineTotal)}</span>
              <div class="qty-control">
                <button class="qty-btn" data-cart-minus="${idx}">-</button>
                <span class="qty-val">${cartItem.quantity}</span>
                <button class="qty-btn" data-cart-plus="${idx}">+</button>
              </div>
            </div>
          </div>
          <button class="cart-item-remove" data-cart-remove="${idx}" title="Remove item">✕</button>
        </div>
      `;
    }).join('');

    // Cart calculations
    const freeDeliveryThresholdUSD = 100;
    const progressPercent = Math.min(100, (subtotalUSD / freeDeliveryThresholdUSD) * 100);

    if (thresholdProgress) thresholdProgress.style.width = `${progressPercent}%`;
    if (thresholdStatusText) {
      if (subtotalUSD >= freeDeliveryThresholdUSD) {
        thresholdStatusText.textContent = '🎉 You qualified for Free VIP Gate Delivery!';
      } else {
        const remaining = freeDeliveryThresholdUSD - subtotalUSD;
        thresholdStatusText.textContent = `Add ${formatPrice(remaining)} for Free VIP Gate Delivery`;
      }
    }

    if (cartSubtotal) cartSubtotal.textContent = formatPrice(subtotalUSD);
    if (cartSavings) cartSavings.textContent = `-${formatPrice(savingsUSD > 0 ? savingsUSD : subtotalUSD * 0.15)}`;
    if (cartGrandTotal) cartGrandTotal.textContent = formatPrice(subtotalUSD);

    // Cart item event listeners
    cartItemsContainer.querySelectorAll('[data-cart-minus]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-cart-minus'), 10);
        if (STATE.cart[idx].quantity > 1) {
          STATE.cart[idx].quantity--;
        } else {
          STATE.cart.splice(idx, 1);
        }
        saveCart();
      });
    });

    cartItemsContainer.querySelectorAll('[data-cart-plus]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-cart-plus'), 10);
        STATE.cart[idx].quantity++;
        saveCart();
      });
    });

    cartItemsContainer.querySelectorAll('[data-cart-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-cart-remove'), 10);
        STATE.cart.splice(idx, 1);
        saveCart();
        showToast('Item removed from cart', 'info');
      });
    });
  }

  // --- CHECKOUT MODAL & ORDER CONFIRMATION ---
  const checkoutModalOverlay = document.getElementById('checkoutModalOverlay');
  const closeCheckoutModalBtn = document.getElementById('closeCheckoutModalBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const csSubtotal = document.getElementById('csSubtotal');
  const csTotal = document.getElementById('csTotal');

  const orderConfirmOverlay = document.getElementById('orderConfirmOverlay');
  const closeConfirmModalBtn = document.getElementById('closeConfirmModalBtn');
  const confirmContinueBtn = document.getElementById('confirmContinueBtn');
  const confirmReceiptBox = document.getElementById('confirmReceiptBox');
  const confirmSummaryText = document.getElementById('confirmSummaryText');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      closeCartDrawer();
      const subtotalUSD = STATE.cart.reduce((sum, item) => {
        const p = PRODUCTS.find(prod => prod.id === item.id);
        return sum + (p ? p.price * item.quantity : 0);
      }, 0);

      if (csSubtotal) csSubtotal.textContent = formatPrice(subtotalUSD);
      if (csTotal) csTotal.textContent = formatPrice(subtotalUSD);

      openModal(checkoutModalOverlay);
    });
  }

  if (closeCheckoutModalBtn) {
    closeCheckoutModalBtn.addEventListener('click', () => closeModal(checkoutModalOverlay));
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const passengerName = document.getElementById('passengerFullName').value;
      const flightNum = document.getElementById('flightNumber').value;
      const gate = document.getElementById('departureGate').value;
      const seat = document.getElementById('seatNumber').value || 'Open Cabin Seat';

      const orderNumber = `EIA-${Math.floor(100000 + Math.random() * 900000)}`;

      if (confirmReceiptBox) {
        confirmReceiptBox.innerHTML = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <strong>Order Reference:</strong>
            <span style="color: var(--cyan-primary); font-family: monospace;">${orderNumber}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <strong>Passenger:</strong>
            <span>${passengerName}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <strong>Flight & Gate:</strong>
            <span>${flightNum} • ${gate} (Seat: ${seat})</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <strong>Delivery Service:</strong>
            <span style="color: var(--success); font-weight: 700;">Sealed Tamper-Proof Gate Runner</span>
          </div>
          <div style="border-top: 1px dashed var(--border-glass); padding-top: 0.5rem; margin-top: 0.5rem; display: flex; justify-content: space-between; font-weight: 800;">
            <span>Demonstration Total:</span>
            <span style="color: var(--gold-primary);">${csTotal ? csTotal.textContent : '$0.00'}</span>
          </div>
        `;
      }

      if (confirmSummaryText) {
        confirmSummaryText.textContent = `Thank you, ${passengerName}. Your duty-free order for Flight ${flightNum} has been scheduled for delivery to ${gate}. Our concourse runner will meet you at your gate seat with your sealed security bag.`;
      }

      // Empty cart and save
      STATE.cart = [];
      saveCart();

      closeModal(checkoutModalOverlay);
      openModal(orderConfirmOverlay);
      showToast('Demonstration airport gate delivery order confirmed!', 'success');
    });
  }

  if (closeConfirmModalBtn) closeConfirmModalBtn.addEventListener('click', () => closeModal(orderConfirmOverlay));
  if (confirmContinueBtn) confirmContinueBtn.addEventListener('click', () => closeModal(orderConfirmOverlay));

  /* ==========================================================================
     WISHLIST SYSTEM
     ========================================================================== */
  const wishlistTriggerBtn = document.getElementById('wishlistTriggerBtn');
  const wishlistCount = document.getElementById('wishlistCount');

  function toggleWishlist(productId) {
    const idx = STATE.wishlist.indexOf(productId);
    const product = PRODUCTS.find(p => p.id === productId);

    if (idx > -1) {
      STATE.wishlist.splice(idx, 1);
      showToast(`Removed "${product ? product.name : 'item'}" from Wishlist`, 'info');
    } else {
      STATE.wishlist.push(productId);
      showToast(`Saved "${product ? product.name : 'item'}" to your Wishlist ♥`, 'gold');
    }

    saveWishlist();
    renderProductCatalog();
  }

  function updateWishlistUI() {
    if (wishlistCount) {
      wishlistCount.textContent = STATE.wishlist.length;
    }
  }
  updateWishlistUI();

  if (wishlistTriggerBtn) {
    wishlistTriggerBtn.addEventListener('click', () => {
      if (STATE.wishlist.length === 0) {
        showToast('Your Wishlist is currently empty. Click the heart on any product to save it!', 'info');
      } else {
        // Filter catalog to wishlisted items
        STATE.searchQuery = '';
        if (catalogSearchInput) catalogSearchInput.value = '';
        STATE.activeCategory = 'all';
        renderProductCatalog();

        // Scroll to catalog
        const catalogSection = document.getElementById('catalog');
        if (catalogSection) catalogSection.scrollIntoView({ behavior: 'smooth' });
        showToast(`Showing your ${STATE.wishlist.length} saved wishlist products`, 'gold');
      }
    });
  }

  /* ==========================================================================
     17. EMRAT TRAVEL CLUB BOARDING PASS GENERATOR
     ========================================================================== */
  const travelClubForm = document.getElementById('travelClubForm');
  const passPassengerName = document.getElementById('passPassengerName');
  const passVoucherCode = document.getElementById('passVoucherCode');
  const digitalBoardingPass = document.getElementById('digitalBoardingPass');

  if (travelClubForm) {
    travelClubForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clubName').value.trim();
      const email = document.getElementById('clubEmail').value.trim();

      if (name) {
        if (passPassengerName) passPassengerName.textContent = name.toUpperCase();
        const code = `VIP-${name.substring(0, 3).toUpperCase()}-15OFF`;
        if (passVoucherCode) passVoucherCode.textContent = code;

        if (digitalBoardingPass) {
          digitalBoardingPass.style.animation = 'none';
          setTimeout(() => {
            digitalBoardingPass.style.boxShadow = '0 0 40px rgba(230, 198, 135, 0.6)';
          }, 10);
        }

        showToast(`Welcome to EMRAT Travel Club, ${name}! Your 15% VIP Boarding Pass is ready.`, 'success');
      }
    });
  }

  /* ==========================================================================
     18. TERMINAL CONCIERGE & FAQ ACCORDION
     ========================================================================== */
  // Concierge Form
  const conciergeContactForm = document.getElementById('conciergeContactForm');
  if (conciergeContactForm) {
    conciergeContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      showToast(`Your message has been prepared successfully for the Terminal Concierge Desk. (Demonstration)`, 'success');
      conciergeContactForm.reset();
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isCurrentlyActive = item.classList.contains('active');
        // Close others
        faqItems.forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });

        if (!isCurrentlyActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  /* ==========================================================================
     QUICK SEARCH MODAL (PRESS / KEYBOARD SHORTCUT)
     ========================================================================== */
  const searchOverlay = document.getElementById('searchOverlay');
  const openSearchBtn = document.getElementById('openSearchBtn');
  const closeSearchModalBtn = document.getElementById('closeSearchModalBtn');
  const modalSearchInput = document.getElementById('modalSearchInput');
  const searchResultsList = document.getElementById('searchResultsList');
  const quickSearchTags = document.querySelectorAll('.qs-tag');

  function openQuickSearch() {
    openModal(searchOverlay);
    setTimeout(() => {
      if (modalSearchInput) {
        modalSearchInput.value = '';
        modalSearchInput.focus();
        renderQuickSearchResults('');
      }
    }, 100);
  }

  if (openSearchBtn) openSearchBtn.addEventListener('click', openQuickSearch);
  if (closeSearchModalBtn) closeSearchModalBtn.addEventListener('click', () => closeModal(searchOverlay));

  // Global Keyboard Shortcut: Press '/' to trigger search, 'Escape' to close modals
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openQuickSearch();
    }
    if (e.key === 'Escape') {
      closeModal(productModalOverlay);
      closeModal(manualModalOverlay);
      closeModal(checkoutModalOverlay);
      closeModal(orderConfirmOverlay);
      closeModal(searchOverlay);
      closeCartDrawer();
    }
  });

  function renderQuickSearchResults(query) {
    if (!searchResultsList) return;
    const q = query.toLowerCase().trim();

    if (!q) {
      searchResultsList.innerHTML = '<div class="search-prompt-hint">Start typing above to search our 40+ duty-free catalog items instantly.</div>';
      return;
    }

    const matches = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.categoryCode.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 6);

    if (matches.length === 0) {
      searchResultsList.innerHTML = `
        <div class="search-prompt-hint">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">✈️</div>
          No airport products found matching "${query}".
        </div>
      `;
      return;
    }

    searchResultsList.innerHTML = matches.map(p => `
      <div class="search-item-row" data-quick-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px;" />
        <div style="flex-grow: 1;">
          <h5 style="font-size: 0.9rem; margin-bottom: 0.2rem; color: var(--text-primary);">${p.name}</h5>
          <span style="font-size: 0.72rem; color: var(--cyan-primary);">${p.categoryCode} • ${p.category.toUpperCase()}</span>
        </div>
        <span style="font-family: var(--font-display); font-weight: 800; color: var(--gold-primary);">${formatPrice(p.price)}</span>
      </div>
    `).join('');

    searchResultsList.querySelectorAll('.search-item-row').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.getAttribute('data-quick-id');
        closeModal(searchOverlay);
        openProductModal(id);
      });
    });
  }

  if (modalSearchInput) {
    modalSearchInput.addEventListener('input', (e) => {
      renderQuickSearchResults(e.target.value);
    });
  }

  quickSearchTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const term = tag.getAttribute('data-search-term');
      if (modalSearchInput) {
        modalSearchInput.value = term;
        renderQuickSearchResults(term);
      }
    });
  });

  /* ==========================================================================
     MODAL HELPER FUNCTIONS
     ========================================================================== */
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('open');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('open');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Close modals on clicking overlay backdrop
  [productModalOverlay, manualModalOverlay, checkoutModalOverlay, orderConfirmOverlay, searchOverlay].forEach(overlay => {
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModal(overlay);
        }
      });
    }
  });

  /* ==========================================================================
     19. TOAST NOTIFICATION SYSTEM
     ========================================================================== */
  const toastContainer = document.getElementById('toastContainer');
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '✈';
    if (type === 'success') icon = '✓';
    if (type === 'gold') icon = '✦';

    toast.innerHTML = `
      <span style="font-size: 1.1rem; color: ${type === 'gold' ? 'var(--gold-primary)' : type === 'success' ? 'var(--success)' : 'var(--cyan-primary)'};">${icon}</span>
      <span style="font-size: 0.85rem; font-weight: 600;">${message}</span>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Initialize cart state display on startup
  updateCartUI();
});
