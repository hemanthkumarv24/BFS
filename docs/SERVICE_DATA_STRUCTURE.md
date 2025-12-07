# BFS Service Data Structure & Implementation Guide

## Overview
This document defines the complete data structure for all BFS services including existing and new services to be added.

---

## Table of Contents
1. [Data Structure Schema](#data-structure-schema)
2. [Vehicle Care Services](#vehicle-care-services)
3. [Laundry Services](#laundry-services)
4. [Home Cleaning Services](#home-cleaning-services)
5. [Commercial Cleaning](#commercial-cleaning)
6. [Movers & Packers](#movers-packers)
7. [Key Services](#key-services)
8. [Service Routes](#service-routes)

---

## Data Structure Schema

### Base Service Object
```json
{
  "_id": "string (unique identifier)",
  "category": "string (vehicle-care|laundry|home-cleaning|commercial|movers|key-services)",
  "subcategory": "string (optional grouping)",
  "title": "string",
  "description": "string",
  "shortDescription": "string (for cards)",
  "basePrice": "number",
  "discountPrice": "number (optional)",
  "pricingType": "fixed|per-sqft|per-hour|per-item",
  "durationMinutes": "number",
  "active": "boolean",
  "featured": "boolean",
  "isNew": "boolean",
  "isPopular": "boolean",
  "images": ["array of image URLs"],
  "icon": "string (lucide icon name)",
  "features": ["array of strings"],
  "includes": ["array of strings"],
  "notIncludes": ["array of strings"],
  "process": ["array of step objects"],
  "addOns": ["array of addon objects"],
  "variants": ["array of variant objects"],
  "requirements": ["array of strings"],
  "faqs": ["array of FAQ objects"],
  "sortOrder": "number",
  "tags": ["array of strings"],
  "serviceArea": ["array of area names"],
  "estimatedTime": "string (e.g., '2-3 hours')",
  "warranty": "string (e.g., '3 months')",
  "rating": "number (0-5)",
  "reviewCount": "number"
}
```

### Addon Object Schema
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "icon": "string",
  "category": "string",
  "recommended": "boolean",
  "maxQuantity": "number (optional)"
}
```

### Variant Object Schema
```json
{
  "_id": "string",
  "name": "string (e.g., 'Hatchback', 'SUV')",
  "priceModifier": "number (price for this variant)",
  "description": "string"
}
```

---

## Vehicle Care Services

### 1. PUC Certificate Service

```json
{
  "_id": "vc-puc-001",
  "category": "vehicle-care",
  "subcategory": "Certification",
  "title": "PUC Certificate Service",
  "description": "Government-approved Pollution Under Control (PUC) certificate issuance at your doorstep with certified technicians and equipment.",
  "shortDescription": "Get PUC certificate at your doorstep",
  "basePrice": 149,
  "pricingType": "fixed",
  "durationMinutes": 20,
  "active": true,
  "featured": true,
  "isNew": true,
  "isPopular": false,
  "images": [
    "/services/puc/puc-testing.jpg",
    "/services/puc/certificate.jpg"
  ],
  "icon": "ShieldCheck",
  "features": [
    "Doorstep emission testing",
    "Government-approved certificate",
    "Digital copy via email/WhatsApp",
    "Hard copy provided",
    "Valid for 6 months",
    "Instant certificate if passed"
  ],
  "includes": [
    "Emission testing",
    "Certificate issuance",
    "Digital and physical copy",
    "SMS and email notification"
  ],
  "notIncludes": [
    "Vehicle repairs",
    "Pollution control system upgrades",
    "Re-testing if vehicle fails"
  ],
  "process": [
    {
      "step": 1,
      "title": "Book Appointment",
      "description": "Select date, time, and location online"
    },
    {
      "step": 2,
      "title": "Technician Visit",
      "description": "Certified technician comes to your location"
    },
    {
      "step": 3,
      "title": "Testing",
      "description": "Emission test completed in 10-15 minutes"
    },
    {
      "step": 4,
      "title": "Certificate",
      "description": "Certificate issued immediately if passed"
    }
  ],
  "variants": [
    {
      "_id": "puc-2w",
      "name": "Two-Wheeler",
      "priceModifier": 149,
      "description": "For all two-wheelers"
    },
    {
      "_id": "puc-4w-petrol",
      "name": "Four-Wheeler (Petrol)",
      "priceModifier": 199,
      "description": "For petrol cars"
    },
    {
      "_id": "puc-4w-diesel",
      "name": "Four-Wheeler (Diesel)",
      "priceModifier": 249,
      "description": "For diesel cars"
    }
  ],
  "requirements": [
    "Vehicle should be in running condition",
    "Vehicle registration documents",
    "Previous PUC certificate (if any)"
  ],
  "faqs": [
    {
      "question": "How long is the PUC certificate valid?",
      "answer": "PUC certificate is valid for 6 months from the date of issue."
    },
    {
      "question": "What if my vehicle fails the test?",
      "answer": "If your vehicle fails, we'll provide a detailed report. You'll need to get repairs done and schedule a re-test."
    }
  ],
  "sortOrder": 10,
  "tags": ["PUC", "Certificate", "Emission", "Vehicle", "Government"],
  "serviceArea": ["Bangalore"],
  "estimatedTime": "15-20 minutes",
  "warranty": "Certificate valid 6 months",
  "rating": 4.8,
  "reviewCount": 234
}
```

### 2. Vehicle Insurance Assistance

```json
{
  "_id": "vc-ins-001",
  "category": "vehicle-care",
  "subcategory": "Insurance",
  "title": "Vehicle Insurance Assistance",
  "description": "Complete assistance for vehicle insurance including policy comparison, renewal, new policy purchase, and claim support.",
  "shortDescription": "Hassle-free vehicle insurance service",
  "basePrice": 299,
  "pricingType": "fixed",
  "durationMinutes": 0,
  "active": true,
  "featured": true,
  "isNew": true,
  "isPopular": true,
  "images": [
    "/services/insurance/insurance-main.jpg",
    "/services/insurance/comparison.jpg"
  ],
  "icon": "FileShield",
  "features": [
    "Compare 10+ insurers",
    "Best quote identification",
    "Documentation assistance",
    "Policy purchase support",
    "Claim filing assistance",
    "Renewal reminders",
    "Digital policy storage"
  ],
  "includes": [
    "Policy comparison service",
    "Documentation help",
    "Best quote analysis",
    "Paperwork assistance",
    "Digital policy copy"
  ],
  "notIncludes": [
    "Insurance premium amount",
    "Vehicle inspection charges",
    "Traffic penalties or fines"
  ],
  "process": [
    {
      "step": 1,
      "title": "Submit Details",
      "description": "Provide vehicle and current insurance details"
    },
    {
      "step": 2,
      "title": "Compare Quotes",
      "description": "We compare quotes from 10+ insurers"
    },
    {
      "step": 3,
      "title": "Select Policy",
      "description": "Choose your preferred insurer and coverage"
    },
    {
      "step": 4,
      "title": "Documentation",
      "description": "We help with all paperwork"
    },
    {
      "step": 5,
      "title": "Policy Issued",
      "description": "Get your policy within 24-48 hours"
    }
  ],
  "variants": [
    {
      "_id": "ins-renewal",
      "name": "Renewal Assistance",
      "priceModifier": 299,
      "description": "Help with insurance renewal"
    },
    {
      "_id": "ins-new",
      "name": "New Policy Purchase",
      "priceModifier": 499,
      "description": "Complete new policy assistance"
    },
    {
      "_id": "ins-claim",
      "name": "Claim Assistance",
      "priceModifier": 199,
      "description": "Help with claim filing and follow-up"
    }
  ],
  "faqs": [
    {
      "question": "Do you charge anything extra apart from service fee?",
      "answer": "No, we only charge the service fee. The insurance premium is paid directly to the insurer."
    },
    {
      "question": "Which insurance companies do you work with?",
      "answer": "We work with all major insurers including HDFC ERGO, ICICI Lombard, Bajaj Allianz, and more."
    }
  ],
  "sortOrder": 11,
  "tags": ["Insurance", "Vehicle", "Renewal", "Claim", "Policy"],
  "serviceArea": ["Pan India"],
  "estimatedTime": "24-48 hours for policy",
  "warranty": "1 year support",
  "rating": 4.7,
  "reviewCount": 567
}
```

### 3. Full Body Vehicle Check-up

```json
{
  "_id": "vc-checkup-001",
  "category": "vehicle-care",
  "subcategory": "Maintenance",
  "title": "Full Body Vehicle Check-up",
  "description": "Comprehensive health inspection for your vehicle with 50+ point checklist, performed by certified mechanics at your doorstep.",
  "shortDescription": "Complete vehicle health check-up",
  "basePrice": 299,
  "pricingType": "fixed",
  "durationMinutes": 60,
  "active": true,
  "featured": true,
  "isNew": true,
  "isPopular": true,
  "images": [
    "/services/checkup/vehicle-inspection.jpg",
    "/services/checkup/report.jpg"
  ],
  "icon": "ClipboardCheck",
  "features": [
    "50+ point inspection checklist",
    "Certified mechanics",
    "Digital inspection report with photos",
    "Priority issue identification",
    "Maintenance recommendations",
    "Email and WhatsApp report"
  ],
  "includes": [
    "Complete vehicle inspection",
    "Digital report with images",
    "Expert recommendations",
    "Priority issue marking",
    "Follow-up consultation"
  ],
  "notIncludes": [
    "Vehicle repairs",
    "Parts replacement",
    "Fluid top-ups",
    "Cleaning services"
  ],
  "process": [
    {
      "step": 1,
      "title": "Book Inspection",
      "description": "Choose date, time, and location"
    },
    {
      "step": 2,
      "title": "Mechanic Arrival",
      "description": "Certified mechanic arrives with tools"
    },
    {
      "step": 3,
      "title": "Inspection",
      "description": "Thorough 50+ point check-up"
    },
    {
      "step": 4,
      "title": "Report Generation",
      "description": "Digital report with photos and recommendations"
    }
  ],
  "variants": [
    {
      "_id": "checkup-2w-basic",
      "name": "Two-Wheeler Basic",
      "priceModifier": 299,
      "description": "Basic 30-point check for bikes"
    },
    {
      "_id": "checkup-2w-comp",
      "name": "Two-Wheeler Comprehensive",
      "priceModifier": 599,
      "description": "Comprehensive 50-point check for bikes"
    },
    {
      "_id": "checkup-4w-basic",
      "name": "Four-Wheeler Basic",
      "priceModifier": 699,
      "description": "Basic 30-point check for cars"
    },
    {
      "_id": "checkup-4w-comp",
      "name": "Four-Wheeler Comprehensive",
      "priceModifier": 1299,
      "description": "Comprehensive 50-point check for cars"
    }
  ],
  "addOns": [
    {
      "_id": "addon-chain-lube",
      "name": "Chain Lubrication (Bike)",
      "description": "Clean and lubricate bike chain",
      "price": 99,
      "icon": "Wrench"
    },
    {
      "_id": "addon-coolant-topup",
      "name": "Coolant Top-up",
      "description": "Top up coolant level if needed",
      "price": 149,
      "icon": "Droplet"
    }
  ],
  "faqs": [
    {
      "question": "Will you repair issues found during inspection?",
      "answer": "No, this is inspection only. We'll provide detailed recommendations and can schedule repair services if needed."
    }
  ],
  "sortOrder": 12,
  "tags": ["Check-up", "Inspection", "Maintenance", "Vehicle"],
  "serviceArea": ["Bangalore"],
  "estimatedTime": "45-60 minutes",
  "warranty": "7-day report validity",
  "rating": 4.9,
  "reviewCount": 891
}
```

### 4. Vehicle Accessories

Vehicle accessories should be added to a separate `vehicleAccessories` array in services.json. See the "Accessory Data Structure Prompt" in COPILOT_PROMPTS.md for the complete structure with 15+ products including seat covers, floor mats, cleaning supplies, etc.

---

## Laundry Services

### 1. Shoes Cleaning Service

```json
{
  "_id": "ld-shoes-001",
  "category": "laundry",
  "subcategory": "Shoes",
  "title": "Professional Shoes Cleaning",
  "description": "Expert shoe cleaning service for all types of footwear including sneakers, formal shoes, sports shoes, and boots.",
  "shortDescription": "Professional shoe cleaning at your doorstep",
  "basePrice": 149,
  "pricingType": "per-item",
  "durationMinutes": 0,
  "active": true,
  "featured": true,
  "isNew": true,
  "isPopular": true,
  "images": [
    "/services/laundry/shoes-before-after.jpg",
    "/services/laundry/shoes-cleaning.jpg"
  ],
  "icon": "Shirt",
  "features": [
    "Material-specific cleaning",
    "Stain removal",
    "Odor treatment",
    "Conditioning (leather)",
    "Air drying",
    "Packaging"
  ],
  "includes": [
    "Exterior cleaning",
    "Dirt and stain removal",
    "Lace cleaning",
    "Basic brushing",
    "Air drying",
    "Deodorizing spray"
  ],
  "notIncludes": [
    "Repair services",
    "Sole replacement",
    "Color restoration (unless selected)",
    "Express service"
  ],
  "process": [
    {
      "step": 1,
      "title": "Pickup",
      "description": "We pickup shoes from your location"
    },
    {
      "step": 2,
      "title": "Inspection",
      "description": "Identify material and stains"
    },
    {
      "step": 3,
      "title": "Cleaning",
      "description": "Material-specific deep cleaning"
    },
    {
      "step": 4,
      "title": "Drying & Treatment",
      "description": "Air dry and apply treatments"
    },
    {
      "step": 5,
      "title": "Delivery",
      "description": "Shoes delivered in 24-48 hours"
    }
  ],
  "variants": [
    {
      "_id": "shoes-casual-basic",
      "name": "Casual Shoes - Basic",
      "priceModifier": 149,
      "description": "Basic cleaning for casual shoes/sneakers"
    },
    {
      "_id": "shoes-casual-deep",
      "name": "Casual Shoes - Deep Clean",
      "priceModifier": 249,
      "description": "Deep cleaning with sole whitening"
    },
    {
      "_id": "shoes-sports-basic",
      "name": "Sports Shoes - Basic",
      "priceModifier": 179,
      "description": "Basic cleaning for sports shoes"
    },
    {
      "_id": "shoes-sports-deep",
      "name": "Sports Shoes - Deep Clean",
      "priceModifier": 299,
      "description": "Deep cleaning with odor treatment"
    },
    {
      "_id": "shoes-formal-basic",
      "name": "Formal/Boots - Basic",
      "priceModifier": 199,
      "description": "Basic cleaning for formal shoes"
    },
    {
      "_id": "shoes-formal-deep",
      "name": "Formal/Boots - Deep Clean",
      "priceModifier": 349,
      "description": "Deep cleaning with conditioning"
    }
  ],
  "addOns": [
    {
      "_id": "addon-sole-white",
      "name": "Sole Whitening",
      "description": "Restore white soles",
      "price": 99,
      "icon": "Sparkles",
      "recommended": true
    },
    {
      "_id": "addon-lace-replace",
      "name": "Lace Replacement",
      "description": "Replace with new laces",
      "price": 49,
      "icon": "Replace"
    },
    {
      "_id": "addon-deodorizer",
      "name": "Shoe Deodorizer",
      "description": "Premium deodorizer treatment",
      "price": 79,
      "icon": "Wind"
    },
    {
      "_id": "addon-water-resist",
      "name": "Water Resistance",
      "description": "Water-resistant coating",
      "price": 149,
      "icon": "Shield"
    }
  ],
  "faqs": [
    {
      "question": "What types of shoes do you clean?",
      "answer": "We clean all types including sneakers, formal shoes, boots, sports shoes, canvas, leather, and suede."
    },
    {
      "question": "How long does it take?",
      "answer": "Standard service is 24-48 hours. Express service available at extra charge."
    }
  ],
  "sortOrder": 20,
  "tags": ["Laundry", "Shoes", "Cleaning", "Sneakers"],
  "serviceArea": ["Bangalore"],
  "estimatedTime": "24-48 hours",
  "warranty": "7-day satisfaction guarantee",
  "rating": 4.8,
  "reviewCount": 1234
}
```

### 2. Laundry Add-ons Configuration

```json
{
  "laundryAddOns": [
    {
      "_id": "addon-fabric-soft",
      "name": "Fabric Softener",
      "description": "Makes clothes extra soft",
      "price": 49,
      "category": "Additives",
      "icon": "Feather",
      "recommended": true
    },
    {
      "_id": "addon-starch",
      "name": "Starch Service",
      "description": "For crisp finish",
      "price": 39,
      "category": "Additives",
      "icon": "Sparkles"
    },
    {
      "_id": "addon-antibacterial",
      "name": "Anti-bacterial Wash",
      "description": "Kills 99.9% germs",
      "price": 79,
      "category": "Additives",
      "icon": "Shield",
      "recommended": true
    },
    {
      "_id": "addon-fragrance",
      "name": "Fragrance Boost",
      "description": "Long-lasting freshness",
      "price": 49,
      "category": "Additives",
      "icon": "Sparkles"
    },
    {
      "_id": "addon-color-protect",
      "name": "Color Protection",
      "description": "Prevents color fading",
      "price": 69,
      "category": "Additives",
      "icon": "Palette"
    }
  ]
}
```

### 3. Detergent Selection Options

```json
{
  "detergentOptions": [
    {
      "_id": "det-ariel",
      "brand": "Ariel",
      "type": "Standard",
      "priceModifier": 0,
      "features": ["Tough on stains", "Fresh scent", "Color safe"],
      "bestFor": ["Cotton", "Mixed fabrics"],
      "default": true
    },
    {
      "_id": "det-surf",
      "brand": "Surf Excel",
      "type": "Standard",
      "priceModifier": 0,
      "features": ["Deep cleaning", "Removes tough stains"],
      "bestFor": ["Heavy duty"]
    },
    {
      "_id": "det-comfort",
      "brand": "Comfort Fabric Conditioner",
      "type": "Premium",
      "priceModifier": 29,
      "features": ["Extra soft", "Long-lasting fragrance"],
      "bestFor": ["Towels", "Bedding"]
    },
    {
      "_id": "det-dettol",
      "brand": "Dettol Antibacterial",
      "type": "Premium",
      "priceModifier": 29,
      "features": ["Kills 99.9% germs", "Hygienic clean"],
      "bestFor": ["Baby clothes", "Undergarments"]
    },
    {
      "_id": "det-woolite",
      "brand": "Woolite Delicate",
      "type": "Premium",
      "priceModifier": 29,
      "features": ["Gentle formula", "For delicates"],
      "bestFor": ["Silk", "Wool", "Delicates"]
    },
    {
      "_id": "det-bio",
      "brand": "Organic Bio Wash",
      "type": "Eco-Friendly",
      "priceModifier": 49,
      "features": ["Plant-based", "Biodegradable", "Eco-friendly"],
      "bestFor": ["Sensitive skin", "Environment conscious"]
    },
    {
      "_id": "det-sensitive",
      "brand": "Sensitive Skin Formula",
      "type": "Eco-Friendly",
      "priceModifier": 49,
      "features": ["Hypoallergenic", "Fragrance-free"],
      "bestFor": ["Sensitive skin", "Baby clothes"]
    }
  ]
}
```

---

## Home Cleaning Services - Painting

### 1. Painting Services

```json
{
  "_id": "hc-paint-001",
  "category": "home-cleaning",
  "subcategory": "Painting",
  "title": "Professional Painting Services",
  "description": "Expert painting services for walls, doors, windows, and complete home painting with quality materials and skilled painters.",
  "shortDescription": "Professional home and office painting",
  "basePrice": 14,
  "pricingType": "per-sqft",
  "durationMinutes": 0,
  "active": true,
  "featured": true,
  "isNew": true,
  "isPopular": true,
  "images": [
    "/services/painting/wall-painting.jpg",
    "/services/painting/before-after.jpg"
  ],
  "icon": "PaintBrush",
  "features": [
    "Surface preparation",
    "Primer application",
    "2 coats of paint",
    "Furniture protection",
    "Floor protection",
    "Post-painting cleanup",
    "Quality inspection",
    "1-year warranty"
  ],
  "includes": [
    "Surface cleaning and preparation",
    "Crack filling",
    "Primer (1 coat)",
    "Paint application (2 coats)",
    "Furniture covering",
    "Floor protection sheets",
    "Final cleanup",
    "Quality check"
  ],
  "notIncludes": [
    "Paint material cost",
    "Major wall repairs/plastering",
    "Furniture moving",
    "Exterior painting"
  ],
  "process": [
    {
      "step": 1,
      "title": "Free Inspection",
      "description": "On-site visit for measurement and assessment"
    },
    {
      "step": 2,
      "title": "Quote & Color Selection",
      "description": "Detailed quote with color consultation"
    },
    {
      "step": 3,
      "title": "Preparation",
      "description": "Surface prep, cleaning, and protection"
    },
    {
      "step": 4,
      "title": "Painting",
      "description": "Primer and paint application"
    },
    {
      "step": 5,
      "title": "Cleanup & Inspection",
      "description": "Final cleanup and quality check"
    }
  ],
  "variants": [
    {
      "_id": "paint-new-wall",
      "name": "New Wall Painting",
      "priceModifier": 18,
      "description": "₹18 per sq.ft - Fresh wall painting"
    },
    {
      "_id": "paint-repaint",
      "name": "Repainting",
      "priceModifier": 14,
      "description": "₹14 per sq.ft - Repaint existing walls"
    },
    {
      "_id": "paint-texture",
      "name": "Texture Painting",
      "priceModifier": 35,
      "description": "₹35 per sq.ft - Textured finish"
    },
    {
      "_id": "paint-designer",
      "name": "Designer Paint",
      "priceModifier": 45,
      "description": "₹45 per sq.ft - Premium designer finishes"
    },
    {
      "_id": "paint-door",
      "name": "Door Painting",
      "priceModifier": 599,
      "description": "₹599 per door - Standard door"
    },
    {
      "_id": "paint-window",
      "name": "Window Frame",
      "priceModifier": 299,
      "description": "₹299 per window - Frame painting"
    }
  ],
  "packages": [
    {
      "_id": "pkg-1bhk",
      "name": "1 BHK Complete Painting",
      "price": 15999,
      "description": "Complete home painting for 1 BHK",
      "includes": ["All walls", "Ceiling", "Doors", "Windows"]
    },
    {
      "_id": "pkg-2bhk",
      "name": "2 BHK Complete Painting",
      "price": 28999,
      "description": "Complete home painting for 2 BHK"
    },
    {
      "_id": "pkg-3bhk",
      "name": "3 BHK Complete Painting",
      "price": 42999,
      "description": "Complete home painting for 3 BHK"
    }
  ],
  "addOns": [
    {
      "_id": "addon-furniture-move",
      "name": "Furniture Moving",
      "description": "We move furniture during painting",
      "price": 1999,
      "icon": "Move"
    },
    {
      "_id": "addon-wallpaper",
      "name": "Wallpaper Removal",
      "description": "Remove existing wallpaper",
      "price": 15,
      "icon": "Trash2",
      "pricingType": "per-sqft"
    }
  ],
  "faqs": [
    {
      "question": "Is material cost included?",
      "answer": "No, material (paint) cost is quoted separately based on your brand choice."
    },
    {
      "question": "How long does painting take?",
      "answer": "1 BHK: 3-4 days, 2 BHK: 5-6 days, 3 BHK: 7-8 days depending on complexity."
    }
  ],
  "sortOrder": 30,
  "tags": ["Painting", "Home", "Walls", "Renovation"],
  "serviceArea": ["Bangalore"],
  "estimatedTime": "3-8 days",
  "warranty": "1 year on workmanship",
  "rating": 4.7,
  "reviewCount": 456
}
```

---

## Movers & Packers - Move Painting

```json
{
  "_id": "mp-paint-001",
  "category": "movers-packers",
  "subcategory": "Move Services",
  "title": "Move-in/Move-out Painting",
  "description": "Specialized painting services for rental properties and new homes. Get your deposit back or make your new home fresh.",
  "shortDescription": "Painting for moving situations",
  "basePrice": 12,
  "pricingType": "per-sqft",
  "durationMinutes": 0,
  "active": true,
  "featured": true,
  "isNew": true,
  "isPopular": false,
  "images": [
    "/services/movers/move-paint.jpg"
  ],
  "icon": "Home",
  "features": [
    "Quick turnaround (24-48 hours)",
    "Rental-approved colors",
    "Deposit protection guarantee",
    "Before/after documentation",
    "Express service available",
    "Landlord-approved certificate"
  ],
  "includes": [
    "Minor wall repairs",
    "Touch-up or full painting",
    "Quick-dry paint",
    "Cleanup",
    "Completion certificate"
  ],
  "notIncludes": [
    "Major wall repairs",
    "Furniture moving",
    "Paint material (quoted separately)"
  ],
  "process": [
    {
      "step": 1,
      "title": "Quick Inspection",
      "description": "Fast on-site assessment"
    },
    {
      "step": 2,
      "title": "Quote",
      "description": "Instant quote with timeline"
    },
    {
      "step": 3,
      "title": "Painting",
      "description": "Quick and professional work"
    },
    {
      "step": 4,
      "title": "Certificate",
      "description": "Completion certificate for landlord"
    }
  ],
  "variants": [
    {
      "_id": "move-touchup-minor",
      "name": "Minor Touch-ups",
      "priceModifier": 4999,
      "description": "Quick fixes for rental deposit"
    },
    {
      "_id": "move-touchup-major",
      "name": "Standard Touch-ups",
      "priceModifier": 7999,
      "description": "More comprehensive touch-ups"
    },
    {
      "_id": "move-full-1bhk",
      "name": "1 BHK Full Paint",
      "priceModifier": 12999,
      "description": "Complete 1 BHK rental paint"
    },
    {
      "_id": "move-full-2bhk",
      "name": "2 BHK Full Paint",
      "priceModifier": 22999,
      "description": "Complete 2 BHK rental paint"
    },
    {
      "_id": "move-full-3bhk",
      "name": "3 BHK Full Paint",
      "priceModifier": 35999,
      "description": "Complete 3 BHK rental paint"
    }
  ],
  "addOns": [
    {
      "_id": "addon-express",
      "name": "Express Service (24-48hrs)",
      "description": "Priority service",
      "price": "30% of base",
      "icon": "Zap"
    },
    {
      "_id": "addon-deposit-guarantee",
      "name": "Deposit Back Guarantee",
      "description": "We ensure landlord approval",
      "price": 999,
      "icon": "Shield"
    }
  ],
  "faqs": [
    {
      "question": "Can you coordinate with my moving service?",
      "answer": "Yes, we can coordinate timing with your moving service for seamless transition."
    }
  ],
  "sortOrder": 40,
  "tags": ["Moving", "Painting", "Rental", "Deposit"],
  "serviceArea": ["Bangalore"],
  "estimatedTime": "1-3 days",
  "warranty": "90-day touch-up warranty",
  "rating": 4.8,
  "reviewCount": 234
}
```

---

## Key Services (New Category)

```json
{
  "_id": "ks-main-001",
  "category": "key-services",
  "subcategory": "Locksmith",
  "title": "Doorstep Key Services",
  "description": "24/7 key duplication, emergency lockout assistance, and locksmith services at your doorstep with mobile key-cutting van.",
  "shortDescription": "Key services at your doorstep",
  "basePrice": 99,
  "pricingType": "per-item",
  "durationMinutes": 30,
  "active": true,
  "featured": true,
  "isNew": true,
  "isPopular": true,
  "images": [
    "/services/keys/key-cutting.jpg",
    "/services/keys/locksmith.jpg"
  ],
  "icon": "Key",
  "features": [
    "Mobile key-cutting van",
    "30-minute response (emergency)",
    "24/7 availability",
    "Police-verified technicians",
    "On-the-spot key making",
    "3-month warranty"
  ],
  "includes": [
    "Key cutting/duplication",
    "Key testing",
    "Service at your location",
    "Warranty on keys"
  ],
  "notIncludes": [
    "Lock purchase (if replacement needed)",
    "Major lock repairs"
  ],
  "process": [
    {
      "step": 1,
      "title": "Book Service",
      "description": "Online booking or emergency call"
    },
    {
      "step": 2,
      "title": "Technician Arrives",
      "description": "Mobile van arrives with equipment"
    },
    {
      "step": 3,
      "title": "Verification",
      "description": "ID and ownership verification (for lock opening)"
    },
    {
      "step": 4,
      "title": "Service",
      "description": "Key cutting or lock service on-site"
    },
    {
      "step": 5,
      "title": "Testing",
      "description": "Test keys before completion"
    }
  ],
  "variants": [
    {
      "_id": "key-house",
      "name": "House/Door Key",
      "priceModifier": 99,
      "description": "Standard door key duplication"
    },
    {
      "_id": "key-bike",
      "name": "Bike Key (Non-Digital)",
      "priceModifier": 149,
      "description": "Two-wheeler key cutting"
    },
    {
      "_id": "key-car-basic",
      "name": "Car Key (Non-Remote)",
      "priceModifier": 299,
      "description": "Basic car key without remote"
    },
    {
      "_id": "key-cupboard",
      "name": "Cupboard/Drawer Key",
      "priceModifier": 79,
      "description": "Small key duplication"
    },
    {
      "_id": "key-emergency-day",
      "name": "Emergency Lock Opening (Day)",
      "priceModifier": 499,
      "description": "6AM-10PM emergency service"
    },
    {
      "_id": "key-emergency-night",
      "name": "Emergency Lock Opening (Night)",
      "priceModifier": 799,
      "description": "10PM-6AM emergency service"
    },
    {
      "_id": "key-car-remote",
      "name": "Car Remote Key Programming",
      "priceModifier": 1499,
      "description": "Program car remote key"
    },
    {
      "_id": "key-transponder",
      "name": "Transponder Key",
      "priceModifier": 2499,
      "description": "Chip key programming"
    }
  ],
  "addOns": [
    {
      "_id": "addon-lock-repair",
      "name": "Lock Repair",
      "description": "Fix existing lock issues",
      "price": 299,
      "icon": "Tool"
    },
    {
      "_id": "addon-lock-replace",
      "name": "Lock Replacement",
      "description": "Replace old lock",
      "price": 599,
      "icon": "Replace"
    },
    {
      "_id": "addon-lock-install",
      "name": "Lock Installation",
      "description": "Install new lock",
      "price": 399,
      "icon": "Plus"
    }
  ],
  "faqs": [
    {
      "question": "Do you provide 24/7 emergency service?",
      "answer": "Yes, we provide 24/7 emergency lockout service with additional night charges."
    },
    {
      "question": "How do you verify ownership for emergency lock opening?",
      "answer": "We require valid ID proof and address proof matching the property address."
    },
    {
      "question": "Do you cut car keys with chips/transponders?",
      "answer": "Yes, we can cut and program most car keys including remote and transponder keys."
    }
  ],
  "sortOrder": 50,
  "tags": ["Keys", "Locksmith", "Emergency", "Security"],
  "serviceArea": ["Bangalore"],
  "estimatedTime": "30 minutes",
  "warranty": "3 months on keys",
  "rating": 4.9,
  "reviewCount": 678
}
```

---

## Commercial Cleaning Add-ons

```json
{
  "commercialAddOns": [
    {
      "_id": "com-addon-glass",
      "name": "Glass Cleaner Refill (5L)",
      "description": "Professional glass cleaner",
      "price": 799,
      "category": "Supplies",
      "icon": "Droplet"
    },
    {
      "_id": "com-addon-vacuum",
      "name": "Vacuum Bags (Pack of 10)",
      "description": "Replacement vacuum bags",
      "price": 499,
      "category": "Supplies"
    },
    {
      "_id": "com-addon-polish",
      "name": "Floor Polish (5L)",
      "description": "Professional floor polish",
      "price": 1299,
      "category": "Supplies"
    },
    {
      "_id": "com-addon-sanitizer",
      "name": "Sanitizer Refill (10L)",
      "description": "Hand sanitizer refill",
      "price": 1499,
      "category": "Supplies"
    },
    {
      "_id": "com-addon-fogging",
      "name": "Disinfectant Fogging",
      "description": "Complete space disinfection",
      "price": 49,
      "category": "Service",
      "pricingType": "per-sqft"
    },
    {
      "_id": "com-addon-upholstery",
      "name": "Upholstery Cleaning",
      "description": "Office chair/sofa cleaning",
      "price": 199,
      "category": "Service",
      "pricingType": "per-seat"
    }
  ],
  "commercialPackages": [
    {
      "_id": "com-pkg-basic",
      "name": "Basic Supply Kit (Monthly)",
      "price": 4999,
      "description": "Essential supplies for small office",
      "includes": [
        "Glass cleaner (2L)",
        "Floor cleaner (5L)",
        "Sanitizer (2L)",
        "Toilet cleaner (2L)",
        "Dustbins liners (100pc)"
      ]
    },
    {
      "_id": "com-pkg-standard",
      "name": "Standard Supply Kit (Monthly)",
      "price": 7999,
      "description": "For medium-sized offices",
      "includes": [
        "All Basic items",
        "Air fresheners (6pc)",
        "Mops and dusters",
        "Hand wash (5L)"
      ]
    },
    {
      "_id": "com-pkg-premium",
      "name": "Premium Supply Kit (Monthly)",
      "price": 12999,
      "description": "Complete package for large offices",
      "includes": [
        "All Standard items",
        "Floor polish",
        "Carpet cleaner",
        "Window cleaner",
        "Upholstery care"
      ]
    }
  ]
}
```

---

## Service Routes Configuration

Update `src/App.jsx` to include new routes:

```javascript
// New service routes to add:

// Vehicle Care
<Route path="/services/puc-certificate" element={<PUCCertificatePage />} />
<Route path="/services/insurance-assistance" element={<InsuranceAssistancePage />} />
<Route path="/services/vehicle-checkup" element={<VehicleCheckupPage />} />
<Route path="/services/vehicle-accessories" element={<VehicleAccessoriesPage />} />

// Laundry
<Route path="/services/shoes-cleaning" element={<ShoesCleaningPage />} />
<Route path="/services/laundry-addons" element={<LaundryAddonsPage />} />

// Painting
<Route path="/services/painting" element={<PaintingServicesPage />} />
<Route path="/services/painting/calculator" element={<PaintingCalculator />} />
<Route path="/services/move-painting" element={<MovePaintingPage />} />

// Key Services
<Route path="/services/key-services" element={<KeyServicesPage />} />
<Route path="/services/key-services/emergency" element={<EmergencyKeyService />} />

// Commercial
<Route path="/services/commercial-addons" element={<CommercialAddonsPage />} />
```

---

## Implementation Checklist

### Data Structure:
- [ ] Add all new services to `src/data/services.json`
- [ ] Create vehicle care services objects
- [ ] Create laundry enhancements objects
- [ ] Create painting services objects
- [ ] Create key services objects
- [ ] Create commercial add-ons
- [ ] Add accessories data structure

### Routes:
- [ ] Add new routes to App.jsx
- [ ] Create route components
- [ ] Test navigation

### Components:
- [ ] Create service page templates
- [ ] Build pricing calculators
- [ ] Create booking forms
- [ ] Build add-on selectors

### Integration:
- [ ] Connect to CartContext
- [ ] Integrate with backend APIs
- [ ] Test booking flow
- [ ] Verify payment integration

---

**Document Version:** 1.0
**Last Updated:** December 2024
