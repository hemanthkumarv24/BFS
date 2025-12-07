# GitHub Copilot Prompts for BFS Modular Development

This document contains detailed prompts for GitHub Copilot to help generate individual service modules and UI enhancements for the Bubble Flash Services (BFS) website.

---

## Table of Contents
1. [Vehicle Care Services](#vehicle-care-services)
   - [PUC Certificate Service](#1-puc-certificate-service)
   - [Vehicle Insurance Assistance](#2-vehicle-insurance-assistance)
   - [Full Body Vehicle Check-up](#3-full-body-vehicle-check-up)
   - [Vehicle Accessories](#4-vehicle-accessories)
2. [Laundry Services](#laundry-services)
   - [Shoes Cleaning](#1-shoes-cleaning)
   - [Laundry Accessories](#2-laundry-accessories)
   - [Detergent Selection](#3-detergent-selection)
3. [Home Cleaning Services](#home-cleaning-services)
   - [Painting Services](#1-painting-services)
4. [Commercial Cleaning](#commercial-cleaning)
   - [Commercial Add-ons](#1-commercial-add-ons)
5. [Movers & Packers](#movers-packers)
   - [Move-out/Move-in Painting](#1-move-out-move-in-painting)
6. [New Service Category](#new-service-category)
   - [Doorstep Key Services](#1-doorstep-key-services)
7. [Homepage Redesign](#homepage-redesign)
8. [Reusable Components](#reusable-components)

---

## Architecture Overview

**Tech Stack:**
- Frontend: React 18.3.1 + Vite 5.4.2
- Styling: Tailwind CSS 3.4.1
- Animations: Framer Motion 12.23.12
- Routing: React Router DOM 7.6.2
- Icons: Lucide React 0.344.0
- UI Components: Ant Design 5.27.5
- State Management: Context API

**Project Structure:**
```
src/
├── pages/              # Page components
├── components/         # Reusable components
├── data/              # JSON data files (services.json)
├── api/               # API integration
├── context/           # Context providers
└── main.jsx           # Entry point
```

---

## Vehicle Care Services

### 1. PUC Certificate Service

**Module Description:**
Create a comprehensive PUC (Pollution Under Control) Certificate service module that allows users to book emission testing services at their doorstep.

**Copilot Prompt:**
```
Create a PUC Certificate Service page component for a vehicle care services website.

Requirements:
1. Create a new page component at src/pages/PUCCertificate/PUCCertificatePage.jsx
2. Service details to include:
   - Service Name: "PUC Certificate Service"
   - Pricing Structure:
     * Two-Wheeler: ₹149
     * Four-Wheeler (Petrol): ₹199
     * Four-Wheeler (Diesel): ₹249
   - Duration: 15-20 minutes
   - Service includes:
     * Emission testing at your doorstep
     * Government-approved certificate
     * Digital copy via email/WhatsApp
     * Hard copy provided
     * Valid for 6 months
   - Service does NOT include:
     * Vehicle repairs
     * Pollution control system upgrades
     * Re-testing (if vehicle fails)
   - How it's done:
     1. Book appointment online
     2. Our certified technician visits your location
     3. Connect emission testing device to vehicle
     4. Test takes 10-15 minutes
     5. Certificate issued immediately if passed
     6. Digital and physical copy provided

3. UI Design:
   - Hero section with service image/illustration
   - Pricing cards with vehicle type selection
   - "How It Works" step-by-step section (use Framer Motion for animations)
   - Features & Benefits section with icons (use Lucide React)
   - Required accessories section:
     * Portable emission testing device
     * Digital printer for certificates
     * Government-approved certification authority tie-up
   - FAQ section specific to PUC certification
   - Booking form with:
     * Vehicle type selection
     * Vehicle number input
     * Date & time picker
     * Location picker (use AddressAutocomplete component)
   
4. Styling:
   - Use Tailwind CSS with BFS color scheme (blue-500, cyan-500, yellow-400)
   - Responsive design (mobile-first)
   - Gradient backgrounds similar to existing service pages
   - Smooth animations using Framer Motion
   - Card-based layout with hover effects

5. Integration:
   - Connect to existing CartContext for booking
   - Use existing booking flow
   - Add to services.json under instantServices

6. Component structure should follow existing pattern in src/pages/Homepage/services/
```

**Service Card Prompt:**
```
Create a service card component for PUC Certificate Service to display on the homepage.

Card should include:
- Icon: Shield with checkmark (from Lucide React)
- Title: "PUC Certificate"
- Short description: "Government-approved emission testing at your doorstep"
- Starting price: "From ₹149"
- "Book Now" button
- Gradient background: from-green-500 to-emerald-500
- Hover animation that scales and adds shadow
- Link to /services/puc-certificate
```

---

### 2. Vehicle Insurance Assistance

**Module Description:**
Create an insurance assistance service that helps customers with vehicle insurance renewal, claims, and new policy purchases.

**Copilot Prompt:**
```
Create a Vehicle Insurance Assistance service page for the BFS website.

Requirements:
1. Create component at src/pages/InsuranceAssistance/InsuranceAssistancePage.jsx

2. Service Details:
   - Service Name: "Vehicle Insurance Assistance"
   - Service Fee Structure:
     * Insurance Renewal Assistance: ₹299 (+ insurance premium)
     * New Policy Purchase: ₹499 (+ insurance premium)
     * Claim Assistance: ₹199 per claim
   - Service Includes:
     * Policy comparison from 10+ insurers
     * Best quote identification
     * Documentation assistance
     * Policy purchase support
     * Claim filing assistance
     * Regular reminders for renewal
     * Digital policy storage
   - Service Does NOT Include:
     * Insurance premium amount
     * Vehicle inspection charges (if required by insurer)
     * Any penalties or fines
   - Process:
     1. Submit vehicle details
     2. We compare quotes from multiple insurers
     3. You select preferred policy
     4. We help with documentation
     5. Policy issued within 24-48 hours
     6. Digital copy sent immediately

3. UI Components:
   - Hero section with insurance-related illustration
   - Service type selector (Renewal/New/Claim)
   - Pricing comparison table
   - Benefits of using our service
   - Partner insurance companies logos
   - Process flow diagram (animated with Framer Motion)
   - Customer testimonials specific to insurance
   - Form sections:
     * Vehicle details form
     * Current insurance details (for renewal)
     * Contact information
     * Preferred coverage options
   - Compare insurers feature
   - FAQ section

4. Features:
   - Multi-step form with progress indicator
   - Insurance calculator (estimate premium)
   - Document upload functionality
   - Real-time quote comparison
   - Save and resume functionality

5. Styling:
   - Use BFS color palette
   - Professional and trustworthy design
   - Use icons from Lucide React (Shield, FileText, Calculator, CheckCircle)
   - Responsive cards and tables
   - Smooth transitions

6. Integration:
   - Add to services.json
   - Integrate with CartContext
   - Create API endpoint for quote requests
```

---

### 3. Full Body Vehicle Check-up

**Module Description:**
Comprehensive vehicle health inspection service for both bikes and cars.

**Copilot Prompt:**
```
Create a Full Body Vehicle Check-up service module for bikes and cars.

Requirements:
1. Create component at src/pages/VehicleCheckup/VehicleCheckupPage.jsx

2. Service Pricing:
   - Two-Wheeler Check-up:
     * Basic Check-up: ₹299
     * Comprehensive Check-up: ₹599
   - Four-Wheeler Check-up:
     * Basic Check-up: ₹699
     * Comprehensive Check-up: ₹1,299
   
3. Service Includes (Two-Wheeler):
   - Engine oil level check
   - Brake system inspection
   - Chain lubrication and tension check
   - Tyre pressure and tread depth
   - Battery health check
   - Light and horn functionality
   - Suspension check
   - Coolant level (if applicable)
   - Clutch and throttle play
   - Digital inspection report with photos
   
4. Service Includes (Four-Wheeler):
   - Engine oil and filter check
   - Brake system (pads, fluid, performance)
   - Tyre pressure, rotation, alignment
   - Battery health and terminals
   - All lights and signals
   - AC system check
   - Suspension and steering
   - Coolant and radiator
   - Windshield wipers and washer
   - Digital inspection report with 50+ point checklist
   
5. Required Accessories Display:
   - Chain lubricant (for bikes)
   - Battery tester
   - Tyre pressure gauge (digital)
   - Coolant tester
   - OBD scanner
   - Brake fluid tester
   - Inspection camera

6. UI Design:
   - Vehicle type selector (Bike/Car) with toggle
   - Dynamic pricing based on selection
   - Check-up type cards (Basic vs Comprehensive)
   - Detailed checklist with expandable sections
   - Before/After slider component
   - Sample inspection report preview
   - Tools and accessories showcase
   - Booking calendar with time slots
   - Location picker
   
7. Features:
   - Interactive 50-point checklist viewer
   - PDF report generator preview
   - Estimated duration calculator
   - Add-on services (chain lube, coolant top-up)
   - Package comparison table
   - Review and testimonials section

8. Styling:
   - Split screen design for Bike/Car
   - Use vehicle icons from Lucide React
   - Color-coded checklist items (Good/Attention/Critical)
   - Gradient cards
   - Hover effects and micro-animations
   - Mobile-responsive design

9. Integration:
   - Add to services.json under vehicle care
   - CartContext integration
   - Create booking flow for check-ups
```

---

### 4. Vehicle Accessories

**Module Description:**
E-commerce style section for vehicle care accessories and products.

**Copilot Prompt:**
```
Create a Vehicle Accessories section with e-commerce functionality.

Requirements:
1. Create components:
   - src/pages/VehicleAccessories/VehicleAccessoriesPage.jsx
   - src/components/AccessoryCard.jsx
   - src/components/AccessoryFilter.jsx

2. Product Categories:
   A. Car Accessories:
      - Seat covers (₹799 - ₹2,499)
      - Floor mats (₹599 - ₹1,999)
      - Car dash cleaner (₹199)
      - Car perfumes (₹149 - ₹399)
      - Foam wash upgrade (₹299)
      - Microfiber cloths (3-pack: ₹299)
      - Tyre shine spray (₹249)
      - Windshield washer fluid (₹149)
   
   B. Bike Accessories:
      - Bike chain lube (₹249)
      - Helmet visor replacement (₹399 - ₹899)
      - Bike cover (₹599 - ₹1,299)
      - Handle grips (₹199)
      - Phone holder (₹299)
   
   C. Common:
      - Tyre pressure gauge (₹399)
      - Cleaning brushes set (₹349)
      - Polishing wax (₹449)

3. UI Features:
   - Grid/List view toggle
   - Filter sidebar:
     * Category (Car/Bike/Common)
     * Price range slider
     * Rating filter
     * Availability (In Stock/Out of Stock)
   - Sort options (Price, Rating, Popularity, Newest)
   - Search functionality
   - Product cards with:
     * Product image
     * Name and description
     * Price with discount badge
     * Rating stars
     * "Add to Cart" button
     * Quick view button
   - Product detail modal:
     * Image carousel
     * Full description
     * Specifications
     * Customer reviews
     * Related products
   - Shopping cart integration
   - "Frequently Bought Together" section

4. E-commerce Features:
   - Add to cart functionality
   - Quantity selector
   - Stock availability indicator
   - Price calculation
   - Cart badge counter
   - Wishlist functionality
   - Product comparison

5. Styling:
   - Modern e-commerce design
   - Card-based layout
   - Product image zoom on hover
   - Badge for "New", "Sale", "Out of Stock"
   - Responsive grid (1 col mobile, 2 col tablet, 3-4 col desktop)
   - Smooth animations for cart actions

6. Integration:
   - Add accessories to services.json
   - Integrate with existing CartContext
   - Create separate cart flow for accessories
   - Add to checkout process

7. Additional Components:
   - Price filter component
   - Rating component
   - Review form
   - Quick add to cart button
```

**Accessory Data Structure Prompt:**
```
Create accessory data structure in services.json for the vehicle accessories section.

Structure:
{
  "vehicleAccessories": [
    {
      "_id": "acc-car-001",
      "category": "car",
      "subcategory": "Interior",
      "name": "Premium Leather Seat Covers",
      "description": "High-quality leather seat covers with diamond stitching",
      "basePrice": 2499,
      "discountPrice": 1999,
      "inStock": true,
      "rating": 4.5,
      "reviewCount": 234,
      "images": [],
      "features": [],
      "specifications": {},
      "variants": []
    }
  ]
}

Create comprehensive data for all 15+ accessories listed above.
```

---

## Laundry Services

### 1. Shoes Cleaning

**Module Description:**
Professional shoe cleaning and care service.

**Copilot Prompt:**
```
Create a Shoes Cleaning service page for the laundry services section.

Requirements:
1. Create component at src/pages/Laundry/ShoesCleaningPage.jsx

2. Service Pricing:
   - Basic Cleaning:
     * Casual Shoes/Sneakers: ₹149
     * Sports Shoes: ₹179
     * Formal Shoes/Boots: ₹199
   - Deep Cleaning:
     * Casual Shoes/Sneakers: ₹249
     * Sports Shoes: ₹299
     * Formal Shoes/Boots: ₹349
   - Premium Services:
     * Sole Whitening: +₹99
     * Lace Replacement: +₹49
     * Shoe Deodorizer Treatment: +₹79
     * Water Resistance Coating: +₹149

3. Service Includes (Basic):
   - Exterior cleaning
   - Dirt and stain removal
   - Lace cleaning
   - Basic brushing
   - Air drying
   - Deodorizing spray
   
4. Service Includes (Deep):
   - Everything in Basic
   - Interior cleaning
   - Deep stain treatment
   - Sole scrubbing and whitening
   - Conditioning (for leather)
   - UV sanitization
   - Premium packaging

5. UI Design:
   - Hero with before/after shoe images
   - Shoe type selector with images
   - Service package cards (Basic/Deep)
   - Add-ons selector with checkboxes
   - Process flow (6 steps with icons)
   - Material-specific care guide
   - Pricing calculator that updates in real-time
   - Turnaround time display (24-48 hours)
   - Special care instructions input

6. Features:
   - Upload shoe photos for assessment
   - Material type selector (Leather, Canvas, Suede, Mesh, etc.)
   - Quantity selector (pairs)
   - Color restoration option
   - Pickup/Delivery scheduling
   - Care tips after cleaning
   
7. Add-ons Section:
   - Shoe deodorizer (spray/powder)
   - Lace replacement (multiple colors)
   - Sole whitening treatment
   - Water resistance coating
   - Shoe trees (optional purchase)
   - Shoe bags for storage

8. Styling:
   - Clean and professional design
   - Use shoe-related icons
   - Progress indicator for service
   - Before/After comparison slider
   - Pricing breakdown table
   - Testimonials from customers

9. Integration:
   - Add to services.json under laundry services
   - CartContext integration with add-ons
   - Photo upload functionality
   - Booking and scheduling system
```

---

### 2. Laundry Accessories

**Module Description:**
Additional laundry products and add-ons available for purchase.

**Copilot Prompt:**
```
Create a Laundry Accessories/Add-ons section for the laundry service page.

Requirements:
1. Create component at src/components/LaundryAddons.jsx

2. Add-on Products:
   - Fabric Softener Addition: ₹49
   - Starch Service: ₹39
   - Fabric Conditioner: ₹59
   - Anti-bacterial Wash: ₹79
   - Fragrance Boost: ₹49
   - Color Protection: ₹69
   - Woolite Special Care: ₹99
   - Shoe Deodorizer: ₹79
   - Lace Replacement: ₹49 per pair
   - Shoe Trees (purchase): ₹299
   - Garment Bags (set of 5): ₹249

3. UI Design:
   - Checkbox-based selection
   - Product cards with:
     * Icon/Image
     * Name
     * Price
     * Description (tooltip)
     * Quantity selector (for some items)
   - "Recommended" badge on popular items
   - Total add-ons cost calculator
   - "Add All Recommended" quick button
   - Category tabs (Laundry Additives, Shoe Care, Storage)

4. Features:
   - Auto-suggestions based on service selected
   - Quantity adjustments
   - Info tooltips on hover
   - Mobile-friendly checkboxes
   - Visual feedback on selection
   - "Frequently Added Together" section

5. Styling:
   - Grid layout (2-3 columns)
   - Compact card design
   - Checkmark animation
   - Price updates in real-time
   - Color-coded categories
   - Icons from Lucide React

6. Integration:
   - Integrate with cart system
   - Add to order summary
   - Link to laundry service booking
   - Price calculation in CartContext
```

---

### 3. Detergent Selection

**Module Description:**
Allow customers to choose their preferred detergent brand for laundry service.

**Copilot Prompt:**
```
Create a Detergent Selection feature for laundry services.

Requirements:
1. Create component at src/components/DetergentSelector.jsx

2. Detergent Options:
   Standard Options (No extra charge):
   - Ariel
   - Surf Excel
   - Rin
   
   Premium Options (+₹29):
   - Comfort Fabric Conditioner
   - Dettol Antibacterial
   - Woolite Delicate
   
   Eco-Friendly Options (+₹49):
   - Organic Bio Wash
   - Eco-friendly Plant-based
   - Sensitive Skin Formula

3. UI Design:
   - Radio button/Card selection interface
   - Brand logos for each option
   - Feature tags (Antibacterial, Gentle, Eco-friendly, etc.)
   - Price indicator for premium options
   - "Why choose this?" info button
   - Default selection (Ariel)
   - "None - Use house detergent" option

4. Features:
   - Single selection (radio buttons styled as cards)
   - Visual feedback on selection
   - Price impact shown immediately
   - Brand information modal
   - Filter by: Price, Type (Standard/Premium/Eco), Features
   - "Most Popular" badge
   - Customer recommendations

5. Detailed Information Modal:
   - Brand description
   - Best for (fabric types)
   - Key features
   - Fragrance type
   - Environmental info (for eco options)

6. Styling:
   - Card-based selection
   - Brand color coding
   - Active state highlight
   - Hover effects
   - Mobile-responsive grid
   - Clean, modern design

7. Integration:
   - Add selection to order
   - Update pricing automatically
   - Save customer preference
   - Include in order summary
   - Add to services.json configuration
```

---

## Home Cleaning Services

### 1. Painting Services

**Module Description:**
Professional painting services for homes and offices.

**Copilot Prompt:**
```
Create a comprehensive Painting Services module as a new category.

Requirements:
1. Create components:
   - src/pages/PaintingServices/PaintingServicesPage.jsx
   - src/pages/PaintingServices/PaintingCalculator.jsx
   - src/components/PaintingQuote.jsx

2. Service Types & Pricing:
   
   A. Wall Painting:
      - New Wall Painting: ₹18 per sq.ft
      - Repainting: ₹14 per sq.ft
      - Texture Painting: ₹35 per sq.ft
      - Designer Paint: ₹45 per sq.ft
   
   B. Touch-up Painting:
      - Minor Touch-ups: ₹499 (up to 50 sq.ft)
      - Major Touch-ups: ₹999 (50-150 sq.ft)
   
   C. Door & Window Painting:
      - Standard Door: ₹599
      - Designer Door: ₹999
      - Window Frame: ₹299
   
   D. Full Home Painting:
      - 1 BHK: Starting ₹15,999
      - 2 BHK: Starting ₹28,999
      - 3 BHK: Starting ₹42,999
      - Villa/Independent House: ₹55 per sq.ft

3. Service Includes:
   - Surface preparation (cleaning, filling cracks)
   - Primer application (1 coat)
   - Paint application (2 coats)
   - Furniture covering/protection
   - Floor protection
   - Post-painting cleanup
   - Quality inspection
   - 1-year warranty on workmanship

4. Service Does NOT Include:
   - Paint material cost (quoted separately)
   - Major wall repairs/plastering
   - Furniture moving (can be added)
   - Exterior painting (separate service)

5. UI Components:
   
   A. Paint Calculator:
      - Room dimensions input
      - Number of rooms
      - Service type selector
      - Walls/ceiling/doors checkbox
      - Real-time cost estimation
      - Material cost estimation
      - Total project cost
   
   B. Color Consultation:
      - Virtual color preview
      - Color palette selector
      - Room-wise color picker
      - Popular color combinations
      - Mood board creator
   
   C. Quote Form:
      - Property type
      - Area in sq.ft
      - Service type
      - Preferred paint brand (Asian Paints, Berger, Dulux)
      - Color preferences
      - Additional requirements
      - Photos upload
      - Inspection booking

6. Features:
   - Interactive cost calculator
   - Before/After gallery
   - 3D room visualizer (basic)
   - Project timeline estimator
   - Paint type comparison
   - Brand comparison
   - Color inspiration gallery
   - Free on-site inspection booking
   - Payment plan options (for large projects)

7. UI Design:
   - Hero with beautiful painted room images
   - Service type cards
   - Calculator section (prominent)
   - Process workflow (5 steps)
   - Paint finish types (Matte, Satin, Gloss, etc.)
   - Portfolio/Gallery section
   - Warranty and quality assurance badges
   - Painter team profiles
   - Customer reviews with photos

8. Styling:
   - Use painter-related color palette
   - Paint swatches visual elements
   - Gradient backgrounds
   - Before/After slider
   - Icon animations
   - Clean and professional design

9. Integration:
   - Add to services.json as new category
   - Create painting-specific booking flow
   - Integrate calculator with pricing
   - Photo upload for quotes
   - Schedule on-site inspection
   - Material cost API integration (optional)

10. Additional Pages:
    - Paint type guide
    - Color guide
    - Preparation checklist
    - Maintenance tips
```

**Painting Calculator Component Prompt:**
```
Create an interactive painting cost calculator component.

Features:
- Room dimension inputs (length, width, height)
- Number of coats selector
- Walls/Ceiling checkboxes
- Door and window count
- Service type dropdown
- Paint type selector
- Live calculation display
- Material cost estimation
- Labor cost breakdown
- Total project cost
- Download estimate as PDF
- "Book Free Inspection" CTA

Styling:
- Card-based layout
- Input groups with labels
- Real-time updating total
- Cost breakdown table
- Color-coded sections
- Mobile responsive
```

---

## Commercial Cleaning

### 1. Commercial Add-ons

**Module Description:**
Additional supplies and services for commercial cleaning contracts.

**Copilot Prompt:**
```
Create a Commercial Cleaning Add-ons section for office and commercial space cleaning.

Requirements:
1. Create component at src/pages/CommercialCleaning/CommercialAddonsPage.jsx

2. Add-on Products & Services:
   
   A. Cleaning Supplies:
      - Glass cleaner refills (5L): ₹799
      - Vacuum bags (pack of 10): ₹499
      - Floor polish (5L): ₹1,299
      - Sanitizer refills (10L): ₹1,499
      - Toilet consumables (monthly supply): ₹999
      - Air fresheners (pack of 6): ₹599
   
   B. Equipment:
      - Vacuum cleaner rental (monthly): ₹2,499
      - Floor scrubber rental (monthly): ₹4,999
      - High-pressure washer (per use): ₹1,999
   
   C. Specialized Services:
      - Disinfectant fogging: ₹49 per sq.ft
      - Deep sanitization: ₹89 per sq.ft
      - Pest control treatment: Starting ₹2,999
      - Upholstery cleaning: ₹199 per seat
      - Carpet shampooing: ₹79 per sq.ft

3. Subscription Plans:
   - Basic Supply Kit (Monthly): ₹4,999
   - Standard Supply Kit (Monthly): ₹7,999
   - Premium Supply Kit (Monthly): ₹12,999

4. UI Design:
   - Category tabs (Supplies/Equipment/Services/Subscriptions)
   - Product cards with:
     * Product image
     * Name and description
     * Quantity/Coverage info
     * Price
     * Add to cart button
   - Bulk order discount calculator
   - Subscription plan comparison table
   - "Request Custom Package" form
   - Monthly usage calculator

5. Features:
   - Quantity-based pricing (discounts for bulk)
   - Subscription management
   - Auto-delivery scheduling
   - Usage tracking dashboard
   - Reorder reminders
   - Corporate account setup
   - Invoice generation
   - GST inclusion

6. Styling:
   - Professional corporate design
   - Blue and white color scheme
   - Icons for each category
   - Discount badges
   - Subscription benefits list
   - Comparison tables
   - Mobile-optimized

7. Integration:
   - Add to services.json under commercial
   - Shopping cart for supplies
   - Subscription management system
   - Corporate account dashboard
   - Recurring billing setup
```

---

## Movers & Packers

### 1. Move-out/Move-in Painting

**Module Description:**
Painting services specifically for moving situations.

**Copilot Prompt:**
```
Create a Move-out/Move-in Painting service module for rental properties and new homes.

Requirements:
1. Create component at src/pages/MoversPackers/MovePaintingPage.jsx

2. Service Packages:
   
   A. Rental Vacate Package:
      - Touch-up painting (walls): ₹12 per sq.ft
      - Full room painting: ₹18 per sq.ft
      - Complete flat painting:
        * 1 BHK: ₹12,999
        * 2 BHK: ₹22,999
        * 3 BHK: ₹35,999
   
   B. Move-in Fresh Paint:
      - Full repainting: ₹20 per sq.ft
      - Designer finishes: ₹35 per sq.ft
      - Complete home packages:
        * 1 BHK: ₹18,999
        * 2 BHK: ₹32,999
        * 3 BHK: ₹48,999
   
   C. Quick Fix Package (for rental deposit):
      - Minor wall repairs + touch-up: ₹4,999
      - Standard fixes: ₹7,999
      - Complete touch-up: ₹12,999

3. Service Timeline:
   - Express Service (24-48 hours): +30% charges
   - Standard Service (3-5 days): Regular pricing
   - Scheduled Service (7+ days): -10% discount

4. Service Includes:
   - Free site inspection
   - Minor wall repairs/patching
   - Primer + 2 coats paint
   - Furniture covering
   - Floor protection
   - Same-day cleanup
   - Deposit-ready certificate (for rental vacate)
   - 3-month touch-up warranty

5. Rental Deposit Protection:
   - Quality assurance for landlord approval
   - Standard white/neutral colors
   - Professional finish guaranteed
   - Deposit recovery assistance
   - Before/After documentation

6. UI Design:
   - Situation selector (Moving Out / Moving In / Both)
   - Property type cards
   - Package comparison
   - Timeline selector with pricing impact
   - Calculator for custom areas
   - Urgency indicator
   - "Get Deposit Back Guarantee" badge
   - Booking with moving date
   - Coordinate with moving service

7. Features:
   - Combined booking with moving service
   - Express service option
   - Deposit protection guarantee
   - Landlord-approved color palette
   - Quick quote generator
   - Before/After photo service
   - Completion certificate
   - Tie-in discount with moving service

8. Integration:
   - Link to movers & packers booking
   - Coordinate move and paint dates
   - Add to services.json under movers section
   - Create rental-specific workflows
   - Deposit guarantee documentation

9. Styling:
   - Moving-themed design elements
   - Timeline visualization
   - Before/After comparisons
   - Trust badges
   - Urgent service highlights
   - Success stories/testimonials

10. Special Features:
    - Rental deposit calculator
    - Damage assessment tool
    - Landlord communication template
    - Moving checklist integration
    - Combined discount calculator (painting + moving)
```

---

## New Service Category: Doorstep Key Services

### 1. Doorstep Key Services

**Module Description:**
Complete locksmith and key duplication services at customer's doorstep.

**Copilot Prompt:**
```
Create a comprehensive Doorstep Key Services module as a new service category.

Requirements:
1. Create components:
   - src/pages/KeyServices/KeyServicesPage.jsx
   - src/components/KeyServiceCard.jsx
   - src/components/EmergencyKeyService.jsx

2. Service Types & Pricing:
   
   A. Key Duplication:
      - House/Door Key: ₹99 per key
      - Bike Key (Non-Digital): ₹149 per key
      - Car Key (Non-Remote): ₹299 per key
      - Cupboard/Drawer Key: ₹79 per key
      - Mailbox Key: ₹69 per key
      - Padlock Key: ₹49 per key
   
   B. Lock Services:
      - Emergency Lock Opening: ₹499 (day) / ₹799 (night 10PM-6AM)
      - Lock Repair: ₹299
      - Lock Replacement: ₹599 + lock cost
      - Lock Installation: ₹399 + lock cost
   
   C. Advanced Services:
      - Safe Key Services: Starting ₹1,999
      - Digital Lock Programming: ₹799
      - Master Key System Setup: Starting ₹2,999
      - Lock Rekeying: ₹399
   
   D. Specialized Keys:
      - Car Remote Key Programming: ₹1,499
      - Transponder Key: ₹2,499
      - Smart Key Fob: ₹3,499

3. Service Features:
   - 24/7 Emergency service available
   - 30-minute response time (emergency)
   - Mobile key cutting van
   - On-the-spot key making
   - Quality tested before handover
   - Warranty on new keys (3 months)
   - Security-verified technicians

4. How We Do It:
   1. Book service online or call emergency number
   2. Technician arrives with mobile key cutting machine
   3. Verify ownership (for emergency lock opening)
   4. Create keys on-site
   5. Test all keys before leaving
   6. Payment after service completion

5. Security Measures:
   - ID verification for lock opening
   - Ownership proof required
   - Police verification of technicians
   - Service records maintained
   - Customer data protection
   - Emergency contact verification

6. UI Design:
   
   A. Homepage Section:
      - Emergency button (prominent red)
      - Service type selector
      - Key type selector with images
      - Quantity input
      - Instant quote calculator
      - "30-min response time" badge
   
   B. Service Cards:
      - Key icon/image
      - Service name
      - Price range
      - Response time
      - "Book Now" or "Emergency Call" button
      - Features list
   
   C. Emergency Section:
      - Large "Emergency? Call Now" button
      - Click-to-call functionality
      - Location sharing
      - Real-time technician tracking
      - ETA display

7. Features:
   - Emergency booking (skip form, direct call)
   - Regular booking form with appointment
   - Key type identifier (upload photo)
   - Security verification process
   - Technician ETA tracking
   - Service history
   - Saved addresses
   - Multiple key bulk order discount

8. Booking Form Fields:
   - Service type
   - Key type (with image selection)
   - Quantity
   - Emergency? Yes/No
   - Location (GPS + address)
   - Contact number
   - Alternate contact
   - Preferred time (if not emergency)
   - Special instructions
   - Upload key photo (optional)

9. Additional Components:
   - Key identifier (upload photo, AI suggests type)
   - Emergency vs Regular toggle
   - Technician tracking map
   - Service warranty card
   - Security FAQs
   - Lock type guide

10. Styling:
    - Security-themed colors (Blue, Silver, Black)
    - Key and lock icons throughout
    - Emergency red for urgent services
    - Trust badges prominently displayed
    - Clean, professional design
    - Mobile-first (many emergency bookings)
    - Click-to-call buttons
    - GPS location integration

11. Integration:
    - Add to services.json as new category
    - Create emergency booking flow
    - Integrate with maps for location
    - Real-time technician assignment
    - SMS/WhatsApp notifications
    - Call integration for emergency
    - Payment on completion flow

12. Safety & Trust Elements:
    - Police-verified badge
    - Customer reviews specific to security
    - Technician profiles with verification
    - Insurance coverage information
    - Privacy policy highlight
    - Secure data handling badge
```

**Emergency Key Service Component Prompt:**
```
Create an Emergency Key Service component for urgent lockout situations.

Features:
- Large red "Emergency Lockout? Call Now" button
- Click-to-call integration
- Auto-location detection
- Skip regular form, direct to call/WhatsApp
- Display current location
- Expected technician arrival time
- "Technician On The Way" status
- Real-time tracking (if available)
- Emergency tips while waiting
- Verification code display (for technician)

Styling:
- Red and white color scheme
- Large, finger-friendly buttons
- Minimal form fields
- Progress indicator
- Map integration
- SOS-style urgency design
```

---

## Homepage Redesign

**Module Description:**
Modernize and enhance the homepage UI/UX for better user engagement and conversion.

**Copilot Prompt:**
```
Redesign the BFS homepage (src/pages/Homepage/HeroSection.jsx) with modern UI/UX improvements.

Requirements:

1. Hero Section Enhancements:
   - Full-screen hero with video background (optional)
   - Animated gradient background
   - Bold headline with typing animation
   - Subheadline highlighting USPs
   - Primary CTA buttons:
     * "Book a Service Now"
     * "Explore Services"
   - Trust indicators:
     * "10,000+ Happy Customers"
     * "Same Day Service"
     * "100% Satisfaction Guaranteed"
   - Floating service cards preview
   - Scroll indicator animation

2. New Sections to Add:
   
   A. Trust Bar:
      - Partner logos
      - Certifications
      - Award badges
      - "As Seen On" media mentions
      - Animated counter (customers served, services completed)
   
   B. Why Choose Us:
      - 4-6 benefit cards
      - Icons from Lucide React
      - Hover animations
      - Benefits:
        * Trained Professionals
        * Doorstep Service
        * Affordable Pricing
        * Quality Guarantee
        * Same Day Service
        * Eco-Friendly Products
   
   C. How It Works (3 Simple Steps):
      - Step 1: Choose Your Service
      - Step 2: Book Online
      - Step 3: We Come To You
      - Animated timeline
      - Icons for each step
      - CTA after steps
   
   D. Featured Services:
      - Carousel of new/popular services
      - Service cards with images
      - "New" badges
      - "Most Popular" indicators
      - Quick booking options
   
   E. Special Offers:
      - Promotional banner
      - Current discounts
      - Limited time offers
      - Countdown timer for expiring offers
   
   F. Service Areas:
      - Interactive map (optional)
      - List of serviced areas
      - "Check Availability" input
   
   G. Customer Reviews Enhancement:
      - Star rating display
      - Review cards with photos
      - Verified customer badges
      - Before/After photos in reviews
      - Review video testimonials
      - Google rating integration
   
   H. Download App Section (if applicable):
      - App store buttons
      - App features list
      - App screenshots
      - QR code for download

3. Service Categories Section Redesign:
   - Grid layout (2x3 or 3x2)
   - Larger, more prominent cards
   - Hover effects with scale and shadow
   - Icons animated on hover
   - "New Service" badge for new categories
   - Brief description visible
   - Direct booking CTAs

4. Animations & Interactions:
   - Fade-in on scroll (Framer Motion)
   - Parallax effects
   - Hover animations
   - Smooth transitions
   - Loading skeleton screens
   - Micro-interactions on buttons
   - Page transition animations

5. Mobile Optimization:
   - Touch-friendly buttons (minimum 44px)
   - Swipeable carousels
   - Sticky "Book Now" button
   - Collapsible sections
   - Fast loading images (lazy loading)
   - Mobile-specific CTAs

6. Performance Optimizations:
   - Lazy load images
   - Code splitting
   - Optimize images (WebP format)
   - Minimize re-renders
   - Use React.memo where appropriate

7. Accessibility:
   - ARIA labels
   - Keyboard navigation
   - Focus indicators
   - Alt text for images
   - Color contrast compliance
   - Screen reader friendly

8. Color Scheme Updates:
   - Primary: #1F3C88 (Navy Blue)
   - Secondary: #FFB400 (Golden Yellow)
   - Accent: #2952A3 (Medium Blue)
   - Success: #10B981 (Green)
   - Background: #F9FAFB (Light Gray)
   - Text: #111827 (Dark Gray)
   - Use gradients for depth

9. Typography:
   - Headings: Bold, modern font
   - Body: Clean, readable font
   - Proper hierarchy (h1, h2, h3)
   - Responsive font sizes

10. CTAs Throughout:
    - Strategic placement
    - Action-oriented text
    - Color contrast for visibility
    - Multiple entry points to booking

11. Integration:
    - Link to all new service pages
    - Update ServiceCategories component
    - Integrate new services
    - Update navigation
    - Add meta tags for SEO

Component Structure:
- HeroSection (updated)
- TrustBar (new)
- WhyChooseUs (new)
- HowItWorks (new)
- FeaturedServices (new)
- ServiceCategories (enhanced)
- SpecialOffers (new)
- ServiceAreas (new)
- CustomerReviews (enhanced)
- FAQSection (enhanced)
- Footer (updated)
```

**Service Card Redesign Prompt:**
```
Redesign the ServiceCard component with modern styling and animations.

Requirements:
- Larger card size (better visual hierarchy)
- High-quality service images
- Gradient overlay on image
- Service icon (absolute positioned)
- Service name (bold, prominent)
- Short description (2 lines, ellipsis)
- Starting price badge
- "Book Now" button (always visible)
- Hover effects:
  * Scale up (1.05)
  * Shadow increase
  * Button color change
  * Icon animation
- "New" or "Popular" badge (conditional)
- Rating stars if applicable
- Use Framer Motion for animations

Styling:
- Rounded corners (16px)
- Shadow on card
- White background
- Gradient border on hover
- Icon with gradient background
- Clean, modern typography
```

---

## Reusable Components Library

### 1. ServiceCard Component

**Copilot Prompt:**
```
Create a reusable ServiceCard component for displaying services throughout the application.

Location: src/components/ui/ServiceCard.jsx

Props:
- service: object containing {
    id, name, description, price, image,
    icon, category, rating, isNew, isPopular
  }
- onBook: function
- size: 'small' | 'medium' | 'large'
- variant: 'default' | 'featured' | 'compact'

Features:
- Responsive design
- Multiple size variants
- Hover animations
- Lazy load images
- Skeleton loader
- Badge system (New, Popular, Discount)
- Star rating display
- Price formatting
- Click to expand/Book
- Image fallback

Styling:
- Tailwind CSS
- Framer Motion animations
- Shadow and border effects
- Gradient overlays
- Icon integration (Lucide React)

Example usage in multiple contexts:
- Homepage grid
- Service browser
- Search results
- Related services
- Cart suggestions
```

---

### 2. PricingCard Component

**Copilot Prompt:**
```
Create a reusable PricingCard component for displaying service pricing tiers.

Location: src/components/ui/PricingCard.jsx

Props:
- title: string
- description: string
- price: number
- duration: string
- features: array of strings
- recommended: boolean
- onSelect: function
- ctaText: string

Features:
- Three-tier layout support
- Feature list with icons (checkmark/cross)
- "Most Popular" badge
- Hover effects
- Price formatting (₹)
- Duration display
- Comparison highlighting
- Mobile responsive

Styling:
- Card with border
- Highlighted recommended option
- Gradient background for featured
- Feature icons
- CTA button styling
- Hover animations

Use cases:
- Service packages (Basic, Standard, Premium)
- Subscription plans
- Add-on selection
- Comparison pages
```

---

### 3. BookingForm Component

**Copilot Prompt:**
```
Create a comprehensive, reusable BookingForm component.

Location: src/components/booking/BookingForm.jsx

Features:
- Multi-step form (3-4 steps)
- Progress indicator
- Form validation
- Service selection
- Date & time picker
- Location picker (AddressAutocomplete integration)
- Add-ons selector
- Payment options
- Order summary sidebar
- Back/Next navigation
- Save and resume functionality
- Mobile-optimized

Steps:
1. Service Details (type, package, add-ons)
2. Schedule (date, time, duration)
3. Location (address, contact)
4. Review & Payment

Validation:
- Required fields
- Phone number format
- Email format
- Date/time validation
- Location verification

Integration:
- CartContext
- AddressAutocomplete
- Payment gateway
- Backend API

Styling:
- Clean, professional design
- Clear field labels
- Error messages
- Loading states
- Success confirmation
```

---

### 4. AddOnSelector Component

**Copilot Prompt:**
```
Create a flexible AddOnSelector component for service add-ons.

Location: src/components/booking/AddOnSelector.jsx

Props:
- addOns: array of objects
- selected: array
- onChange: function
- multiSelect: boolean
- showPrices: boolean
- layout: 'grid' | 'list' | 'inline'

Features:
- Checkbox/Radio selection
- Visual selection feedback
- Price display
- Quantity selector (for some add-ons)
- Category grouping
- Search/Filter add-ons
- "Select All" option
- Total price calculator
- Recommended badge

Add-on Object Structure:
{
  id, name, description, price,
  image, category, recommended,
  maxQuantity
}

Styling:
- Card/Chip based layout
- Active state styling
- Hover effects
- Price badge
- Icons for categories
- Mobile-friendly

Use cases:
- Laundry add-ons
- Vehicle accessories
- Commercial supplies
- Painting options
```

---

### 5. ReviewCard Component

**Copilot Prompt:**
```
Create a ReviewCard component for displaying customer reviews.

Location: src/components/ui/ReviewCard.jsx

Props:
- review: object {
    customerName, rating, date, reviewText,
    service, verified, images
  }
- variant: 'default' | 'featured' | 'compact'
- showService: boolean

Features:
- Star rating display
- Customer name and avatar (initials if no photo)
- Review date (formatted: "2 days ago")
- Review text (expandable if long)
- Service name badge
- Verified badge
- Before/After images (optional carousel)
- Helpful voting buttons
- "Read more" for long reviews

Styling:
- Card layout
- Star icons (filled/outlined)
- Avatar circle
- Verified checkmark icon
- Image gallery
- Responsive design
- Hover effects

Integration:
- Review API
- Image lightbox
- Report review option
```

---

### 6. FAQAccordion Component

**Copilot Prompt:**
```
Create an interactive FAQAccordion component.

Location: src/components/ui/FAQAccordion.jsx

Props:
- faqs: array of objects { question, answer }
- defaultOpen: number (index)
- category: string (optional filter)
- searchable: boolean

Features:
- Expand/Collapse animation
- Search functionality
- Category filtering
- "Still have questions?" CTA
- Icon rotation animation
- Mobile-friendly
- One open at a time or multiple

Styling:
- Clean accordion design
- Border between items
- Icon (ChevronDown from Lucide)
- Smooth transitions
- Highlight on hover
- Active state

Example FAQs to include:
- Service-specific questions
- Booking process
- Payment methods
- Cancellation policy
- Service areas
```

---

### 7. ProcessFlow Component

**Copilot Prompt:**
```
Create a visual ProcessFlow component for showing service steps.

Location: src/components/ui/ProcessFlow.jsx

Props:
- steps: array of objects {
    number, title, description, icon
  }
- variant: 'horizontal' | 'vertical'
- animated: boolean
- currentStep: number (optional, for active booking)

Features:
- Step numbering
- Step titles and descriptions
- Icons for each step
- Connecting lines/arrows
- Active/completed/pending states
- Animations (step by step reveal)
- Mobile responsive (vertical on mobile)

Styling:
- Circular step numbers
- Icon containers
- Connecting lines
- Color-coded states (pending, active, completed)
- Hover effects
- Clean, modern design

Use cases:
- "How It Works" sections
- Service process explanation
- Booking progress
- Order tracking
```

---

### 8. ServiceComparison Component

**Copilot Prompt:**
```
Create a ServiceComparison table component.

Location: src/components/ui/ServiceComparison.jsx

Props:
- services: array of service objects
- features: array of feature names
- highlightIndex: number (recommended service)

Features:
- Responsive table/cards
- Feature checkmarks
- Price comparison
- "Best Value" badge
- Sticky header (on scroll)
- Select service button
- Mobile: card-based, desktop: table

Features to compare:
- Price
- Duration
- Included features
- Service quality level
- Warranty
- Response time

Styling:
- Clean table design
- Highlighted column for recommended
- Icons for features (checkmark/cross)
- Color-coded pricing
- CTA buttons at bottom
- Hover effects

Use cases:
- Package comparison
- Service tier selection
- Insurance plan comparison
```

---

## Implementation Priority

### Phase 1 (Week 1) - Essential Services
1. PUC Certificate Service (Most urgent for vehicle care)
2. Full Body Vehicle Check-up
3. Shoes Cleaning (Complete laundry services)
4. Create basic service card components

### Phase 2 (Week 2) - New Categories
1. Painting Services (New major category)
2. Doorstep Key Services (New unique offering)
3. Vehicle Accessories (E-commerce functionality)
4. Homepage redesign

### Phase 3 (Week 3) - Enhancements
1. Vehicle Insurance Assistance
2. Laundry Add-ons and Detergent Selection
3. Commercial Add-ons
4. Move-in/Move-out Painting

### Phase 4 (Week 4) - Polish & Components
1. Build reusable component library
2. Refactor existing pages to use new components
3. Performance optimization
4. Testing and bug fixes
5. Documentation

---

## Testing Prompts

After implementing each module, use these prompts to verify:

```
Test the [SERVICE_NAME] module:
1. Check responsive design on mobile, tablet, desktop
2. Verify pricing calculations
3. Test booking flow integration
4. Check form validation
5. Test add-ons selection
6. Verify cart integration
7. Test payment flow (if applicable)
8. Check accessibility (keyboard navigation, screen readers)
9. Test with different user scenarios
10. Performance check (loading times, animations)
```

---

## Best Practices

When implementing any module:

1. **Follow Existing Patterns**: Use the same structure as existing pages (e.g., CarsPage.jsx, BikesPage.jsx)
2. **Component Reusability**: Extract common patterns into reusable components
3. **Responsive First**: Test on mobile first, then tablet and desktop
4. **Performance**: Use lazy loading, code splitting, and optimization
5. **Accessibility**: Include ARIA labels, keyboard navigation, and proper semantics
6. **Animation**: Use Framer Motion for smooth animations, don't overdo it
7. **Error Handling**: Include proper error states and fallbacks
8. **Loading States**: Show skeletons or spinners during data fetching
9. **Validation**: Validate all user inputs with clear error messages
10. **Integration**: Ensure proper integration with existing CartContext and booking flow

---

## Quick Reference

**Common Component Imports:**
```javascript
import { motion } from 'framer-motion';
import { Star, Shield, Car, Bike, Home, Key, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../components/CartContext';
import { useAuth } from '../../components/AuthContext';
```

**Standard Color Palette:**
> **Note:** Use these hex values consistently. Complete design system in [HOMEPAGE_REDESIGN.md](./HOMEPAGE_REDESIGN.md)

```javascript
const colors = {
  primary: '#1F3C88',    // Navy Blue
  secondary: '#FFB400',  // Golden Yellow
  accent: '#2952A3',     // Medium Blue
  success: '#10B981',    // Green
  error: '#EF4444',      // Red
  warning: '#F59E0B'     // Orange
};
```

**Animation Variants Template:**
```javascript
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};
```

---

## Support and Questions

For implementation questions:
1. Review existing similar components first
2. Check the services.json data structure
3. Refer to the CartContext implementation
4. Look at existing booking flows
5. Consult Tailwind CSS and Framer Motion documentation

---

**Document Version:** 1.0
**Last Updated:** December 2024
**Maintained By:** BFS Development Team
