# Movers & Packers API Documentation

## Overview
BFS Full Item Shifting Services (Local Bangalore) - Category B provides comprehensive moving and packing services for bikes, scooties, furniture, and appliances with detailed pricing and service information.

## Base URL
```
/api/movers-packers
```

## Endpoints

### 1. Get All Services
**Endpoint:** `GET /api/movers-packers`

**Description:** Retrieve all movers and packers services with complete details.

**Response:**
```json
{
  "success": true,
  "message": "BFS FULL ITEM SHIFTING SERVICES (Local Bangalore)",
  "category": "Category B - All Items",
  "description": "Professional moving and packing services for bikes, scooties, furniture, and appliances",
  "totalServices": 9,
  "services": [
    {
      "id": "bike-shifting",
      "name": "BIKE SHIFTING",
      "icon": "🏍️",
      "emoji": "🏍️",
      "category": "Category B",
      "subtitle": "Local Bangalore",
      "basePrice": 1299,
      "distanceRange": "0-5 km",
      "image": "/bike-shifting.png",
      "includes": [
        "Foam sheet packing",
        "Bubble wrap",
        "Tank & handle protection",
        "Rope lock inside vehicle",
        "Loading + transport + unloading"
      ],
      "notIncludes": [
        "Bike repair",
        "Fuel refill",
        "Mechanical issues"
      ],
      "process": [
        { "step": 1, "action": "Wrap", "description": "Complete foam and bubble wrap protection" },
        { "step": 2, "action": "Load", "description": "Carefully load into vehicle" },
        { "step": 3, "action": "Tie", "description": "Secure with rope locks" },
        { "step": 4, "action": "Transport", "description": "Safe transportation" },
        { "step": 5, "action": "Unload", "description": "Unload at destination" },
        { "step": 6, "action": "Handover", "description": "Final handover to customer" }
      ],
      "features": [
        "Professional foam sheet packing",
        "High-quality bubble wrap protection",
        "Tank and handle special protection",
        "Secure rope locking system",
        "Complete loading and unloading service"
      ],
      "sortOrder": 1
    }
    // ... 8 more services
  ],
  "distancePricing": [
    {
      "range": "0-5 km",
      "minKm": 0,
      "maxKm": 5,
      "charge": 0,
      "description": "Base price includes 0-5 km"
    },
    {
      "range": "5-10 km",
      "minKm": 5,
      "maxKm": 10,
      "charge": 150,
      "description": "Additional ₹150 for 5-10 km"
    },
    {
      "range": "10-20 km",
      "minKm": 10,
      "maxKm": 20,
      "charge": 250,
      "description": "Additional ₹250 for 10-20 km"
    },
    {
      "range": "20-30 km",
      "minKm": 20,
      "maxKm": 30,
      "charge": 350,
      "description": "Additional ₹350 for 20-30 km"
    },
    {
      "range": "30+ km",
      "minKm": 30,
      "maxKm": null,
      "charge": 10,
      "chargeType": "per_km",
      "description": "₹10 per km after 30 km"
    }
  ],
  "serviceArea": "Bangalore",
  "availability": "7 Days a Week"
}
```

### 2. Get Service by ID
**Endpoint:** `GET /api/movers-packers/:serviceId`

**Parameters:**
- `serviceId` (string, required): The service identifier (e.g., "bike-shifting", "scooty-shifting", etc.)

**Available Service IDs:**
- `bike-shifting`
- `scooty-shifting`
- `fridge-shifting`
- `washing-machine-shifting`
- `sofa-shifting`
- `tv-shifting`
- `mattress-shifting`
- `cupboard-shifting`
- `table-shifting`

**Example:** `GET /api/movers-packers/bike-shifting`

**Response:**
```json
{
  "success": true,
  "service": {
    "id": "bike-shifting",
    "name": "BIKE SHIFTING",
    "icon": "🏍️",
    "basePrice": 1299,
    "distanceRange": "0-5 km",
    "includes": [...],
    "notIncludes": [...],
    "process": [...]
  },
  "distancePricing": [...],
  "serviceArea": "Bangalore"
}
```

### 3. Calculate Service Price
**Endpoint:** `POST /api/movers-packers/calculate-price`

**Description:** Calculate the total price for a service based on distance.

**Request Body:**
```json
{
  "serviceId": "bike-shifting",
  "distance": 15
}
```

**Response:**
```json
{
  "success": true,
  "service": {
    "id": "bike-shifting",
    "name": "BIKE SHIFTING",
    "icon": "🏍️"
  },
  "pricing": {
    "basePrice": 1299,
    "distanceCharge": 250,
    "totalPrice": 1549,
    "distance": 15,
    "currency": "₹"
  },
  "breakdown": {
    "basePrice": "₹1299 (0-5 km included)",
    "distanceCharge": "₹250",
    "total": "₹1549"
  }
}
```

### 4. Get Services by Category
**Endpoint:** `GET /api/movers-packers/category/:categoryType`

**Parameters:**
- `categoryType` (string, required): Category type

**Available Categories:**
- `vehicles` - Bike and Scooty shifting
- `appliances` - Fridge, Washing Machine, TV shifting
- `furniture` - Sofa, Mattress, Cupboard, Table shifting
- `all` - All services

**Example:** `GET /api/movers-packers/category/vehicles`

**Response:**
```json
{
  "success": true,
  "category": "vehicles",
  "count": 2,
  "services": [
    {
      "id": "bike-shifting",
      "name": "BIKE SHIFTING",
      ...
    },
    {
      "id": "scooty-shifting",
      "name": "SCOOTY SHIFTING",
      ...
    }
  ],
  "distancePricing": [...]
}
```

### 5. Get Distance Pricing
**Endpoint:** `GET /api/movers-packers/distance-pricing`

**Description:** Get detailed information about distance-based pricing.

**Response:**
```json
{
  "success": true,
  "message": "Distance charges for all items",
  "note": "All prices are in addition to base price after 5 km",
  "distancePricing": [
    {
      "range": "0-5 km",
      "minKm": 0,
      "maxKm": 5,
      "charge": 0,
      "description": "Base price includes 0-5 km"
    },
    ...
  ],
  "examples": [
    {
      "distance": "7 km",
      "calculation": "Base Price + ₹150",
      "range": "5-10 km"
    },
    {
      "distance": "15 km",
      "calculation": "Base Price + ₹250",
      "range": "10-20 km"
    },
    {
      "distance": "25 km",
      "calculation": "Base Price + ₹350",
      "range": "20-30 km"
    },
    {
      "distance": "35 km",
      "calculation": "Base Price + ₹10/km (₹50 for 5 km beyond 30)",
      "range": "30+ km"
    }
  ]
}
```

## Service Details

### Complete Service List with Base Prices

| Service | Icon | Base Price (0-5 km) | Subtitle |
|---------|------|---------------------|----------|
| Bike Shifting | 🏍️ | ₹1,299 | Local Bangalore |
| Scooty Shifting | 🛵 | ₹1,199 | Local Bangalore |
| Fridge Shifting | 🧊 | ₹1,899 | Single/Double Door |
| Washing Machine Shifting | 🧼 | ₹1,299 | All Types |
| Sofa Shifting | 🛋️ | ₹2,299 | 3-5 Seater |
| TV Shifting | 📺 | ₹899 | LED/Smart TV |
| Mattress Shifting | 🛏 | ₹699 | Single/Double/Queen/King |
| Cupboard Shifting | 🚪 | ₹1,499 | Steel/Wooden |
| Table Shifting | 🪑 | ₹799 | Office/Dining/Study |

### Distance Pricing

| Distance Range | Additional Charge | Description |
|----------------|-------------------|-------------|
| 0-5 km | ₹0 | Included in base price |
| 5-10 km | +₹150 | Additional charge |
| 10-20 km | +₹250 | Additional charge |
| 20-30 km | +₹350 | Additional charge |
| 30+ km | ₹10/km | Per kilometer charge |

### Pricing Examples

1. **Bike Shifting - 3 km**
   - Base: ₹1,299
   - Distance: ₹0
   - **Total: ₹1,299**

2. **Fridge Shifting - 8 km**
   - Base: ₹1,899
   - Distance: ₹150
   - **Total: ₹2,049**

3. **Sofa Shifting - 15 km**
   - Base: ₹2,299
   - Distance: ₹250
   - **Total: ₹2,549**

4. **Table Shifting - 35 km**
   - Base: ₹799
   - Distance: ₹50 (₹10/km × 5km beyond 30 km)
   - **Total: ₹849**

## Error Responses

### Service Not Found
```json
{
  "success": false,
  "message": "Service not found"
}
```

### Missing Parameters
```json
{
  "success": false,
  "message": "Service ID and distance are required"
}
```

### Server Error
```json
{
  "success": false,
  "message": "Error fetching services",
  "error": "Error message details"
}
```

## Usage Example (JavaScript/Fetch)

```javascript
// Get all services
const response = await fetch('/api/movers-packers');
const data = await response.json();
console.log(data.services);

// Get specific service
const bikeService = await fetch('/api/movers-packers/bike-shifting');
const bikeData = await bikeService.json();
console.log(bikeData.service);

// Calculate price
const priceResponse = await fetch('/api/movers-packers/calculate-price', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceId: 'bike-shifting',
    distance: 15
  })
});
const priceData = await priceResponse.json();
console.log('Total:', priceData.pricing.totalPrice);

// Get vehicles category
const vehiclesResponse = await fetch('/api/movers-packers/category/vehicles');
const vehiclesData = await vehiclesResponse.json();
console.log(vehiclesData.services);
```

## Notes

- All prices are in Indian Rupees (₹)
- Service area is limited to Bangalore
- Services available 7 days a week
- Distance is calculated from pickup to delivery location
- Base prices include services within 0-5 km
- Additional charges apply for distances beyond 5 km
- All services include professional packing and transport
- Repair and maintenance services are not included unless specified
