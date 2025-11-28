# Collectible Card Arbitrage App - Design Proposal

## App Overview

An automated arbitrage platform that monitors auction sites (e.g., Heritage Auctions, Sotheby's, local auction houses) and classifieds (Craigslist, Facebook Marketplace) for collectible card listings, compares prices against major marketplaces (eBay, TCGPlayer, Cardmarket), identifies profitable opportunities, and automates the purchase and resale process.

## Core Architecture

### System Components

1. **Scraping Engine** - Monitors and extracts listing data from multiple sources
2. **Price Intelligence** - Aggregates and normalizes pricing data across marketplaces
3. **Arbitrage Calculator** - Determines profitability after fees, shipping, and risk factors
4. **Automation Engine** - Handles purchase and listing workflows
5. **User Dashboard** - Interface for monitoring, configuration, and manual oversight
6. **Notification System** - Alerts for opportunities, purchases, and issues

---

## MVP Feature List

### Phase 1: Core Monitoring & Analysis (Weeks 1-4)

#### 1.1 Source Integration
- [ ] **Auction Site Scrapers**
  - Heritage Auctions API/integration
  - Local auction house websites (configurable URLs)
  - Basic web scraping for non-API sources
  
- [ ] **Classified Scrapers**
  - Craigslist RSS feeds and web scraping
  - Facebook Marketplace (via API or scraping)
  - Basic filtering for collectible card categories

- [ ] **Marketplace Price Aggregation**
  - eBay Sold Listings API
  - TCGPlayer API integration
  - Cardmarket API (for European market)
  - Manual price entry fallback

#### 1.2 Card Identification & Matching
- [ ] **Card Recognition System**
  - OCR for card images (optional, Phase 2)
  - Text-based matching (card name, set, condition, variant)
  - Fuzzy matching for typos and variations
  - Set/edition identification (e.g., "Base Set", "1st Edition", "Shadowless")

- [ ] **Condition Normalization**
  - Standardize condition grades (PSA, BGS, CGC, Raw)
  - Condition mapping between different grading systems
  - Condition-based price adjustments

#### 1.3 Price Analysis Engine
- [ ] **Market Price Calculation**
  - Average sold prices (last 30/90 days)
  - Price trend analysis (increasing/decreasing)
  - Outlier detection and filtering
  
- [ ] **Arbitrage Calculator**
  - Source price + fees (auction fees, buyer's premium)
  - Marketplace fees (eBay ~13%, TCGPlayer ~10%, etc.)
  - Shipping costs (inbound and outbound)
  - Estimated profit margin calculation
  - Minimum profit threshold configuration

#### 1.4 Basic Dashboard
- [ ] **Opportunity Feed**
  - List of potential arbitrage opportunities
  - Sortable by profit margin, price, urgency
  - Card details, source, and calculated profit
  
- [ ] **Manual Review Interface**
  - Approve/reject opportunities
  - View detailed price breakdown
  - Historical opportunity tracking

### Phase 2: Automation (Weeks 5-8)

#### 2.1 Automated Purchasing
- [ ] **Auction Bidding**
  - Automated bid placement (with max bid limits)
  - Bid timing strategies (snipe vs. early bid)
  - Budget management per user
  
- [ ] **Direct Purchase**
  - Automated "Buy It Now" purchases
  - Payment processing integration (PayPal, Stripe)
  - Purchase confirmation tracking

#### 2.2 Automated Listing
- [ ] **Listing Creation**
  - Auto-generate optimized titles and descriptions
  - Image handling (download, optimize, upload)
  - Category and tag assignment
  - Pricing strategy (fixed price vs. auction)
  
- [ ] **Multi-Platform Listing**
  - eBay listing creation via API
  - TCGPlayer listing creation
  - Cross-platform inventory sync

#### 2.3 Workflow Management
- [ ] **Order Tracking**
  - Monitor purchase status
  - Shipping tracking integration
  - Receipt confirmation
  
- [ ] **Inventory Management**
  - Track cards in transit
  - Track cards awaiting listing
  - Track listed cards
  - Track sold cards

### Phase 3: Intelligence & Optimization (Weeks 9-12)

#### 3.1 Advanced Analytics
- [ ] **Performance Dashboard**
  - ROI tracking per card
  - Success rate metrics
  - Average profit margins
  - Time-to-sale analysis
  
- [ ] **Market Intelligence**
  - Price trend predictions
  - Seasonal demand patterns
  - Card popularity scoring

#### 3.2 Risk Management
- [ ] **Fraud Detection**
  - Seller reputation checking
  - Image authenticity verification (optional)
  - Suspicious listing flagging
  
- [ ] **Quality Control**
  - Condition verification workflows
  - Dispute handling system
  - Return/refund automation

#### 3.3 User Configuration
- [ ] **Custom Rules Engine**
  - Set-specific filters (only certain sets)
  - Price range filters
  - Minimum profit thresholds
  - Blacklist/whitelist cards
  
- [ ] **Budget Controls**
  - Daily/weekly/monthly spending limits
  - Per-opportunity max bid limits
  - Reserve fund management

---

## Database Schema Extensions

### New Models Required

```python
# Card Catalog
class Card(SQLModel, table=True):
    id: UUID
    name: str  # e.g., "Charizard"
    set_name: str  # e.g., "Base Set"
    set_code: str  # e.g., "BS1"
    card_number: str | None
    rarity: str | None
    variant: str | None  # "1st Edition", "Shadowless", etc.
    created_at: datetime

# Source Listings
class SourceListing(SQLModel, table=True):
    id: UUID
    source_type: str  # "auction", "craigslist", "facebook"
    source_id: str  # External ID from source
    source_url: str
    card_id: UUID  # FK to Card
    title: str
    description: str | None
    current_price: Decimal
    condition: str | None
    images: list[str]  # JSON array
    end_time: datetime | None  # For auctions
    status: str  # "active", "ended", "purchased", "expired"
    scraped_at: datetime
    last_updated: datetime

# Marketplace Prices
class MarketplacePrice(SQLModel, table=True):
    id: UUID
    card_id: UUID  # FK to Card
    marketplace: str  # "ebay", "tcgplayer", "cardmarket"
    average_price: Decimal
    min_price: Decimal
    max_price: Decimal
    recent_sales_count: int
    price_trend: str  # "increasing", "decreasing", "stable"
    last_updated: datetime

# Arbitrage Opportunities
class Opportunity(SQLModel, table=True):
    id: UUID
    source_listing_id: UUID  # FK to SourceListing
    card_id: UUID  # FK to Card
    source_price: Decimal
    estimated_market_price: Decimal
    estimated_profit: Decimal
    profit_margin: Decimal  # Percentage
    fees_breakdown: dict  # JSON
    status: str  # "pending", "approved", "purchased", "rejected", "expired"
    created_at: datetime
    reviewed_by: UUID | None  # FK to User

# Purchases
class Purchase(SQLModel, table=True):
    id: UUID
    opportunity_id: UUID  # FK to Opportunity
    user_id: UUID  # FK to User
    source_listing_id: UUID  # FK to SourceListing
    purchase_price: Decimal
    fees: Decimal
    total_cost: Decimal
    purchase_date: datetime
    status: str  # "pending", "paid", "shipped", "received", "cancelled"
    tracking_number: str | None
    payment_method: str | None

# Listings
class Listing(SQLModel, table=True):
    id: UUID
    purchase_id: UUID  # FK to Purchase
    user_id: UUID  # FK to User
    card_id: UUID  # FK to Card
    marketplace: str  # "ebay", "tcgplayer", etc.
    marketplace_listing_id: str  # External ID
    listing_url: str
    list_price: Decimal
    listing_type: str  # "fixed", "auction"
    status: str  # "draft", "active", "sold", "ended", "cancelled"
    created_at: datetime
    sold_at: datetime | None
    sold_price: Decimal | None

# User Settings
class UserSettings(SQLModel, table=True):
    id: UUID
    user_id: UUID  # FK to User (one-to-one)
    min_profit_margin: Decimal  # Minimum % profit required
    max_purchase_price: Decimal
    daily_spend_limit: Decimal
    weekly_spend_limit: Decimal
    monthly_spend_limit: Decimal
    auto_approve_enabled: bool
    preferred_marketplaces: list[str]  # JSON array
    card_set_filters: list[str]  # JSON array
    blacklisted_cards: list[UUID]  # JSON array of Card IDs
```

---

## Implementation Requirements

### Backend Extensions

#### 1. New Dependencies
```toml
# Add to pyproject.toml
dependencies = [
    # Existing dependencies...
    "beautifulsoup4>=4.12.0",  # Web scraping
    "selenium>=4.15.0",  # Dynamic content scraping
    "requests>=2.31.0",  # HTTP requests
    "lxml>=5.0.0",  # HTML parsing
    "pillow>=10.0.0",  # Image processing
    "python-dateutil>=2.8.0",  # Date parsing
    "fuzzywuzzy>=0.18.0",  # Fuzzy string matching
    "python-Levenshtein>=0.23.0",  # String similarity
    "celery>=5.3.0",  # Background task processing
    "redis>=5.0.0",  # Celery broker
    "ebaysdk>=2.1.5",  # eBay API (or use official eBay REST API)
    "stripe>=7.0.0",  # Payment processing
    "paypalrestsdk>=1.13.0",  # PayPal integration
]
```

#### 2. New API Routes
```
/api/v1/cards/ - Card catalog management
/api/v1/sources/ - Source listing management
/api/v1/opportunities/ - Arbitrage opportunities
/api/v1/purchases/ - Purchase tracking
/api/v1/listings/ - Listing management
/api/v1/marketplace-prices/ - Price data
/api/v1/scrapers/ - Scraper configuration and control
/api/v1/analytics/ - Performance metrics
/api/v1/settings/ - User settings
```

#### 3. Background Workers (Celery)
- **Scraper Workers**: Periodic scraping tasks for each source
- **Price Aggregation Workers**: Fetch and update marketplace prices
- **Opportunity Calculator**: Process new listings and calculate opportunities
- **Automation Workers**: Execute purchases and listings
- **Notification Workers**: Send alerts and emails

#### 4. Scraper Architecture
```python
# Abstract base scraper
class BaseScraper:
    def scrape_listings(self) -> list[SourceListing]
    def normalize_card_data(self, raw_data: dict) -> dict
    def extract_price(self, listing: dict) -> Decimal

# Specific scrapers
class HeritageAuctionsScraper(BaseScraper)
class CraigslistScraper(BaseScraper)
class FacebookMarketplaceScraper(BaseScraper)
class EBayScraper(BaseScraper)  # For price data
```

### Frontend Extensions

#### 1. New Components
- `OpportunityCard.tsx` - Display arbitrage opportunities
- `OpportunityDetail.tsx` - Detailed opportunity view
- `PurchaseTracker.tsx` - Track purchase status
- `ListingManager.tsx` - Manage active listings
- `AnalyticsDashboard.tsx` - Performance metrics
- `ScraperConfig.tsx` - Configure scraping sources
- `UserSettings.tsx` - Extended settings for arbitrage rules
- `CardCatalog.tsx` - Browse and search card database

#### 2. New Routes
```
/opportunities - Opportunity feed
/opportunities/:id - Opportunity detail
/purchases - Purchase tracking
/listings - Active listings
/analytics - Performance dashboard
/settings/arbitrage - Arbitrage configuration
/cards - Card catalog
```

#### 3. Real-time Updates
- WebSocket integration for live opportunity updates
- Real-time purchase/listing status updates
- Live price updates

### Infrastructure Requirements

#### 1. Additional Services
- **Redis**: Celery broker and caching
- **Celery Workers**: Separate containers for background tasks
- **Proxy/VPN Service**: For scraping (to avoid IP bans)
- **Image Storage**: S3 or similar for card images
- **OCR Service**: Optional, for card image recognition

#### 2. External API Accounts Needed
- eBay Developer Account (for API access)
- TCGPlayer API access
- Cardmarket API access
- PayPal Business Account
- Stripe Account
- Optional: Google Cloud Vision API (for OCR)

#### 3. Legal & Compliance
- Terms of Service for automated purchasing
- Rate limiting to respect source websites
- Robots.txt compliance
- Data retention policies
- User consent for automated transactions

---

## Technical Challenges & Solutions

### Challenge 1: Web Scraping Reliability
**Problem**: Websites change structure, implement anti-bot measures
**Solution**: 
- Robust error handling and retry logic
- Multiple scraping strategies (API > RSS > Scraping)
- Monitoring and alerting for scraper failures
- Fallback to manual entry

### Challenge 2: Card Matching Accuracy
**Problem**: Same card listed with different names/formats
**Solution**:
- Fuzzy string matching algorithms
- Card database with aliases
- Machine learning for card recognition (Phase 2+)
- Manual review queue for uncertain matches

### Challenge 3: Price Volatility
**Problem**: Prices change rapidly, opportunities expire
**Solution**:
- Real-time price updates
- Caching with short TTL
- Priority queue for time-sensitive opportunities
- Configurable refresh intervals

### Challenge 4: Automation Risks
**Problem**: Automated purchases can go wrong (wrong card, damaged, fraud)
**Solution**:
- Manual approval workflow (MVP)
- Gradual automation with user-defined rules
- Fraud detection heuristics
- Dispute handling system
- Insurance/escrow for high-value purchases

### Challenge 5: Rate Limiting & Bans
**Problem**: Aggressive scraping can get IP banned
**Solution**:
- Respectful rate limiting
- Proxy rotation
- User-agent rotation
- API usage where available
- Distributed scraping architecture

---

## MVP Scope Reduction

For a true MVP, consider starting with:

1. **Manual Opportunity Discovery**
   - Scrapers find opportunities
   - User manually reviews and approves
   - User manually completes purchase
   - App tracks the purchase and suggests listing price

2. **Single Marketplace Focus**
   - Start with eBay only for both price data and listings
   - Expand to other marketplaces later

3. **Limited Automation**
   - No automated purchasing in MVP
   - Automated price monitoring and opportunity alerts only
   - Manual listing creation with suggested prices

4. **Basic Card Matching**
   - Exact name matching first
   - Manual matching for uncertain cases
   - Expand to fuzzy matching in Phase 2

---

## Suggested App Names

1. **CardFlip** - Simple, action-oriented
2. **ArbitrageCards** - Descriptive, SEO-friendly
3. **CardScout** - Suggests discovery and hunting
4. **FlipBot** - Playful, suggests automation
5. **CardArb** - Short, industry term
6. **ProfitPoke** - Pokemon reference, fun
7. **CardHunt** - Suggests finding opportunities
8. **MarketFlip** - Clear value proposition
9. **CardFlow** - Suggests smooth operations
10. **ArbitrageAI** - Emphasizes intelligence
11. **CardVault** - Suggests collection and value
12. **FlipEngine** - Technical, powerful
13. **CardSense** - Suggests smart decisions
14. **ProfitPulse** - Suggests real-time monitoring
15. **CardWise** - Suggests intelligence and wisdom

**Top Recommendations:**
- **CardFlip** - Memorable, clear value prop
- **CardScout** - Professional, suggests discovery
- **FlipBot** - Modern, suggests automation

---

## Development Timeline Estimate

### MVP (12 weeks)
- Weeks 1-2: Database schema, basic models
- Weeks 3-4: Scraper infrastructure (1-2 sources)
- Weeks 5-6: Price aggregation (eBay API)
- Weeks 7-8: Opportunity calculation engine
- Weeks 9-10: Dashboard and UI
- Weeks 11-12: Testing, polish, deployment

### Phase 2 (8 weeks)
- Weeks 13-14: Automated listing creation
- Weeks 15-16: Purchase tracking system
- Weeks 17-18: Additional marketplace integrations
- Weeks 19-20: Advanced analytics

### Phase 3 (8 weeks)
- Weeks 21-22: Automated purchasing (with safeguards)
- Weeks 23-24: Multi-marketplace listing
- Weeks 25-26: Advanced matching and ML
- Weeks 27-28: Optimization and scaling

---

## Success Metrics

- **Opportunity Discovery Rate**: Cards found per day
- **Match Accuracy**: % of correctly identified cards
- **Price Accuracy**: % of opportunities with accurate profit calculations
- **User Engagement**: Opportunities reviewed per user
- **Conversion Rate**: % of opportunities that become purchases
- **ROI**: Average profit margin on completed flips
- **Time to Sale**: Average days from purchase to sale

---

## Risk Considerations

1. **Legal**: Ensure compliance with terms of service of scraped sites
2. **Financial**: Users risk money on automated purchases
3. **Technical**: Scrapers break when sites change
4. **Market**: Card prices can drop, eliminating profit
5. **Competition**: Other arbitrage bots may compete for same opportunities

---

## Next Steps

1. Validate market demand and user interest
2. Start with MVP scope (manual review, single marketplace)
3. Build scraper infrastructure for 1-2 sources
4. Integrate eBay API for price data
5. Create basic opportunity feed
6. Iterate based on user feedback
