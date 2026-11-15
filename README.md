# Amazon Clone — E-Commerce Web Application

A modern, responsive e-commerce storefront inspired by Amazon, built with vanilla HTML5, CSS3, and JavaScript (ES6+). This application features a dynamic product catalog, interactive hero carousel, real-time search and filtering, category browsing, and a persistent slide-out shopping cart powered by `localStorage`.

---

## 🚀 Features

### 🛍️ Product Catalog & Discovery
- **Dynamic Rendering**: Products are rendered dynamically from a structured catalog dataset (`products.js`).
- **Rich Product Cards**: Displays badges (*Best Seller*, *Amazon's Choice*, *Limited Time Deal*), star ratings, review counts, discount pricing with original price strike-through, Prime delivery tags, and quick "Add to Cart" actions.
- **Search & Category Filtering**:
  - Live text search filtering across product titles and categories.
  - Dropdown category selector integrated into the search bar.
  - Quick-access category navigation bar (*All*, *Today's Deals*, *Electronics*, *Computers*, *Gaming*, *Home & Kitchen*, *Accessories*).
- **Sorting Options**: Sort catalog by *Featured*, *Price: Low to High*, *Price: High to Low*, and *Avg. Customer Review*.
- **Prime Filter Toggle**: Filter items eligible for fast Prime delivery.

### 🛒 Shopping Cart & Checkout Drawer
- **Slide-out Cart Drawer**: Accessible via the cart icon in the header or product actions.
- **Cart Management**: Real-time quantity adjustments (`+` / `-`), individual item removal, and empty state handling.
- **Free Delivery Progress Indicator**: Dynamic progress bar calculating remaining amount needed for free delivery.
- **Persistent State**: Cart items and quantities are stored in browser `localStorage` (`amazon_clone_cart_v1`), preserving user selections across page reloads.
- **Toast Notifications**: Interactive feedback toasts for adding items, updating quantities, and simulated checkout.

### 🎨 User Interface & Experience
- **Interactive Hero Carousel**: Auto-rotating promo banner with manual slide navigation (prev/next) and responsive design.
- **Sticky Amazon-style Header**: Top bar featuring brand logo, location indicator, search bar, account/order links, and badge-updating cart button.
- **Responsive Navigation**: Mobile-friendly navigation with responsive breakpoints for phone, tablet, and desktop viewports.
- **Modular Stylesheets**: Clean CSS architecture utilizing CSS custom properties (variables), Flexbox, and CSS Grid.
- **Amazon Footer**: Multi-tier footer with "Back to Top" smooth scroll, localized links, currency/language display, and company info.
- **Zero External Dependencies**: Pure vanilla JavaScript and native CSS with SVG vector illustrations for fast load times and clean rendering.

---

## 📁 Project Structure

```text
Amazon Test/
├── README.md
└── amazon TEST 1/
    ├── index.html            # Main HTML markup and semantic layout
    ├── css/
    │   ├── variables.css     # Design tokens (colors, typography, shadows, spacing)
    │   ├── base.css          # Global resets, base typography, and utilities
    │   ├── header.css        # Sticky header, search bar, and category navigation
    │   ├── products.css      # Hero carousel, product grid, card UI, and cart drawer
    │   └── footer.css        # Multi-tiered Amazon-style footer and back-to-top button
    ├── js/
    │   ├── products.js       # Product data catalog and schema definitions
    │   ├── cart.js           # Shopping cart state management & localStorage persistence
    │   └── main.js           # App controller, filtering, sorting, carousel, and events
    └── assets/
        └── images/           # SVG icons and product illustrations
```

---

## 🛠️ Tech Stack

- **HTML5**: Semantic tags (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`) and ARIA accessibility labels.
- **CSS3**: CSS Variables (Design Tokens), CSS Grid, Flexbox, keyframe animations, media queries.
- **JavaScript (ES6+)**: Vanilla DOM manipulation, event listeners, array methods (`filter`, `find`, `sort`, `reduce`), and Web Storage API (`localStorage`).
- **Assets**: Lightweight vector SVGs.

---

## ⚡ Getting Started

No build tools, bundlers, or package installations required.

### Option 1: Direct File Launch
Simply open the `index.html` file in any modern web browser:
```bash
# macOS
open "amazon TEST 1/index.html"

# Linux
xdg-open "amazon TEST 1/index.html"

# Windows
start "amazon TEST 1/index.html"
```

### Option 2: Local HTTP Server (Recommended)
Running through a local web server ensures optimal asset loading and browser storage behavior.

#### Using Python 3:
```bash
cd "amazon TEST 1"
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

#### Using Node.js (npx serve):
```bash
npx serve "amazon TEST 1"
```

#### Using VS Code:
Right-click `amazon TEST 1/index.html` and choose **"Open with Live Server"**.

---

## 🧩 Key JavaScript Modules

| File | Purpose |
| :--- | :--- |
| `js/products.js` | Contains the mock database of 12+ products spanning multiple categories with pricing, ratings, badges, and delivery details. |
| `js/cart.js` | Manages cart state array, synchronization with `localStorage`, item addition/increment/decrement, subtotal computations, and toast notifications. |
| `js/main.js` | Controls application state (`activeCategory`, `searchQuery`, `primeOnly`, `sortBy`), dynamic card DOM generation, hero carousel timing, and event listeners. |

---

## 📱 Browser Compatibility

- Google Chrome (latest)
- Mozilla Firefox (latest)
- Apple Safari (latest)
- Microsoft Edge (latest)

---

## 📄 License

This project is created for educational and portfolio demonstration purposes. All brand marks, logos, and styling inspirations belong to Amazon.com, Inc.
