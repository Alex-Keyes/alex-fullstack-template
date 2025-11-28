# Opportunity Model - Detailed Explanation

## Overview

The `Opportunity` model is the **core entity** that represents a potential arbitrage deal - a card that can be purchased at a lower price from one source (auction site, Craigslist, etc.) and resold at a higher price on a marketplace (eBay, TCGPlayer, etc.) for profit.

Think of it as a **"deal alert"** that the system has identified and calculated to be profitable.

---

## Model Structure

```python
class Opportunity(SQLModel, table=True):
    id: UUID                                    # Unique identifier
    source_listing_id: UUID                     # Links to the original listing
    card_id: UUID                               # Links to the card catalog entry
    source_price: Decimal                       # Price to buy the card
    estimated_market_price: Decimal             # Expected resale price
    estimated_profit: Decimal                   # Profit after all costs
    profit_margin: Decimal                      # Profit as percentage
    fees_breakdown: dict                        # Detailed cost breakdown (JSON)
    status: str                                 # Current state in workflow
    created_at: datetime                        # When opportunity was discovered
    reviewed_by: UUID | None                    # User who reviewed it (if any)
```

---

## Field-by-Field Breakdown

### 1. **`id: UUID`**
- Unique identifier for the opportunity
- Generated automatically when created
- Used to reference the opportunity throughout the system

### 2. **`source_listing_id: UUID`** (Foreign Key)
- **Links to**: `SourceListing` model
- **Purpose**: References the original listing where the card is being sold
- **Example**: Links to a Craigslist ad or Heritage Auctions listing
- **Why it matters**: Allows you to see the original listing details, images, seller info

### 3. **`card_id: UUID`** (Foreign Key)
- **Links to**: `Card` model (card catalog)
- **Purpose**: Identifies which specific card this opportunity is for
- **Example**: Links to "Charizard - Base Set - 1st Edition"
- **Why it matters**: Enables matching against marketplace prices for the same card

### 4. **`source_price: Decimal`**
- **What it is**: The price you would pay to buy the card from the source
- **Example**: `$150.00` (current bid on auction)
- **Note**: This is the "buy" price, not including fees yet

### 5. **`estimated_market_price: Decimal`**
- **What it is**: The expected price you can sell the card for on marketplaces
- **How it's calculated**: 
  - Aggregated from recent sales on eBay, TCGPlayer, etc.
  - Takes into account condition, variant, and market trends
- **Example**: `$250.00` (average recent sales price)

### 6. **`estimated_profit: Decimal`**
- **What it is**: The net profit after ALL costs
- **Calculation**: 
  ```
  estimated_profit = estimated_market_price 
                     - source_price 
                     - source_fees (auction fees, buyer's premium)
                     - marketplace_fees (eBay ~13%, TCGPlayer ~10%)
                     - shipping_costs (inbound + outbound)
  ```
- **Example**: `$250 - $150 - $15 - $32.50 - $10 = $42.50`

### 7. **`profit_margin: Decimal`**
- **What it is**: Profit as a percentage of total cost
- **Calculation**: `(estimated_profit / total_cost) * 100`
- **Example**: `($42.50 / $207.50) * 100 = 20.5%`
- **Why it matters**: Helps compare opportunities regardless of card price

### 8. **`fees_breakdown: dict`** (JSON)
- **What it is**: Detailed breakdown of all costs
- **Structure**:
  ```json
  {
    "source_price": 150.00,
    "source_fees": {
      "buyers_premium": 10.00,
      "processing_fee": 5.00
    },
    "marketplace_fees": {
      "ebay_final_value": 32.50,
      "payment_processing": 7.50
    },
    "shipping": {
      "inbound": 5.00,
      "outbound": 5.00
    },
    "total_cost": 207.50,
    "estimated_revenue": 250.00
  }
  ```
- **Why it matters**: Transparency - users can see exactly where costs come from

### 9. **`status: str`**
- **What it is**: Current state in the opportunity lifecycle
- **Possible values**:
  - `"pending"` - Just discovered, awaiting review
  - `"approved"` - User approved, ready to purchase
  - `"purchased"` - Card has been bought
  - `"rejected"` - User declined the opportunity
  - `"expired"` - Listing ended or opportunity no longer valid
- **Why it matters**: Tracks the opportunity through the entire workflow

### 10. **`created_at: datetime`**
- **When**: Timestamp when the opportunity was first discovered
- **Why it matters**: 
  - Shows how fresh the opportunity is
  - Helps prioritize time-sensitive deals (auctions ending soon)

### 11. **`reviewed_by: UUID | None`** (Foreign Key, Optional)
- **Links to**: `User` model
- **What it is**: Which user reviewed/approved this opportunity
- **Null if**: Opportunity hasn't been reviewed yet, or was auto-approved
- **Why it matters**: Audit trail and accountability

---

## How Opportunities Are Created

### Step-by-Step Process

1. **Scraper finds a listing**
   - Scraper monitors auction sites, Craigslist, etc.
   - Finds a new listing: "Charizard Base Set - $150"
   - Creates a `SourceListing` record

2. **Card matching**
   - System tries to match the listing to a `Card` in the catalog
   - Uses fuzzy matching on card name, set, condition
   - Links `SourceListing.card_id` to the matched `Card`

3. **Price lookup**
   - System queries `MarketplacePrice` records for this card
   - Gets average sold prices from eBay, TCGPlayer, etc.
   - Calculates `estimated_market_price`

4. **Profit calculation**
   - Arbitrage service calculates:
     - Source price + fees
     - Marketplace fees
     - Shipping costs
     - Net profit and margin

5. **Filtering**
   - Checks if profit margin meets user's minimum threshold
   - Checks if price is within user's budget limits
   - Applies user's custom filters (card sets, etc.)

6. **Opportunity creation**
   - If profitable and passes filters → Creates `Opportunity` record
   - Status set to `"pending"`
   - User gets notified

---

## Opportunity Lifecycle

```
┌─────────────┐
│  DISCOVERED │  ← Scraper finds listing, calculates profit
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   PENDING   │  ← Awaiting user review
└──────┬──────┘
       │
       ├─── User Reviews ───┐
       │                    │
       ▼                    ▼
┌─────────────┐      ┌─────────────┐
│  APPROVED   │      │  REJECTED   │  ← User declines
└──────┬──────┘      └─────────────┘
       │
       ▼
┌─────────────┐
│  PURCHASED  │  ← Purchase made, creates Purchase record
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   LISTED    │  ← Card listed for sale (via Listing model)
└─────────────┘
```

### Status Transitions

- **pending → approved**: User clicks "Approve" or auto-approval rules match
- **pending → rejected**: User clicks "Reject"
- **pending → expired**: Listing ended, auction closed, or price changed
- **approved → purchased**: Purchase completed (creates `Purchase` record)
- **approved → expired**: Opportunity expired before purchase
- **purchased**: Terminal state (tracked via `Purchase` model after this)

---

## Relationships with Other Models

### 1. **SourceListing** (One-to-One)
```python
opportunity.source_listing  # Get the original listing
```
- Contains: Original listing URL, images, seller info, auction end time
- Used for: Viewing listing details, making purchase

### 2. **Card** (Many-to-One)
```python
opportunity.card  # Get card catalog entry
```
- Contains: Card name, set, rarity, variant
- Used for: Matching, price lookups, display

### 3. **User** (Many-to-One, Optional)
```python
opportunity.reviewed_by_user  # Get reviewer
```
- Contains: User who reviewed/approved
- Used for: Audit trail, user-specific opportunities

### 4. **Purchase** (One-to-One, Optional)
```python
opportunity.purchase  # Get purchase record (if purchased)
```
- Created when: Opportunity is purchased
- Contains: Actual purchase price, tracking, status

### 5. **MarketplacePrice** (Indirect, via Card)
```python
opportunity.card.marketplace_prices  # Get price data
```
- Used for: Calculating `estimated_market_price`

---

## Example Scenario

### Real-World Flow

1. **Scraper discovers listing**:
   - Heritage Auctions listing: "PSA 10 Charizard Base Set"
   - Current bid: $1,500
   - Auction ends in 2 days

2. **System matches card**:
   - Matches to `Card`: "Charizard - Base Set - PSA 10"
   - Links `source_listing.card_id`

3. **Price lookup**:
   - `MarketplacePrice` shows:
     - eBay average: $2,200
     - Recent sales: $2,100, $2,300, $2,000
   - Sets `estimated_market_price = $2,200`

4. **Profit calculation**:
   ```
   Source price:        $1,500.00
   Buyer's premium:        $150.00  (10%)
   Processing fee:         $25.00
   eBay fees:             $286.00  (13% of $2,200)
   Shipping (in/out):      $20.00
   ──────────────────────────────
   Total cost:          $1,981.00
   Estimated revenue:   $2,200.00
   Estimated profit:      $219.00
   Profit margin:         11.1%
   ```

5. **Opportunity created**:
   ```python
   Opportunity(
       source_listing_id=listing_123,
       card_id=charizard_card_id,
       source_price=1500.00,
       estimated_market_price=2200.00,
       estimated_profit=219.00,
       profit_margin=11.1,
       fees_breakdown={...},
       status="pending"
   )
   ```

6. **User sees opportunity**:
   - Dashboard shows: "PSA 10 Charizard - $219 profit (11.1%)"
   - User reviews details, sees it's a good deal
   - Clicks "Approve" → status → `"approved"`

7. **Purchase**:
   - System (or user) places bid/purchase
   - Creates `Purchase` record
   - Opportunity status → `"purchased"`

---

## Query Patterns

### Common Queries

```python
# Get all pending opportunities for a user
pending = session.query(Opportunity).filter(
    Opportunity.status == "pending"
).all()

# Get opportunities above profit threshold
profitable = session.query(Opportunity).filter(
    Opportunity.profit_margin >= 20.0,
    Opportunity.status == "pending"
).all()

# Get opportunities for specific card
charizard_ops = session.query(Opportunity).join(Card).filter(
    Card.name == "Charizard"
).all()

# Get opportunities expiring soon (auctions)
urgent = session.query(Opportunity).join(SourceListing).filter(
    SourceListing.end_time < datetime.now() + timedelta(hours=24),
    Opportunity.status == "pending"
).all()
```

---

## Key Design Decisions

### 1. **Why separate from SourceListing?**
- **SourceListing** = Raw data from scrapers
- **Opportunity** = Calculated, filtered, user-facing deals
- Allows multiple opportunities from same listing (if price changes)
- Enables user-specific filtering and preferences

### 2. **Why store calculated values?**
- Performance: Don't recalculate on every query
- History: Track what profit was estimated at discovery time
- Audit: See what the system thought vs. actual results

### 3. **Why JSON for fees_breakdown?**
- Flexible: Different sources have different fee structures
- Detailed: Users want transparency
- Extensible: Can add new fee types without schema changes

### 4. **Why status field?**
- Simple state machine
- Easy to filter and query
- Clear workflow progression
- Can add more states later if needed

---

## Future Enhancements

### Potential Additions

1. **Priority score**: Algorithmic ranking of opportunities
2. **Confidence level**: How certain the system is about the match
3. **Time sensitivity**: Hours until auction ends
4. **Competition level**: How many other buyers are interested
5. **Historical performance**: Track if similar opportunities were profitable
6. **Auto-approval rules**: User-defined criteria for automatic approval

---

## Summary

The `Opportunity` model is the **bridge** between:
- **Discovery** (scraped listings) 
- **Analysis** (price calculations)
- **Action** (purchases and listings)

It represents a **calculated, profitable deal** that users can review, approve, and act upon. It's the central entity that makes the arbitrage app work by connecting all the pieces together.
