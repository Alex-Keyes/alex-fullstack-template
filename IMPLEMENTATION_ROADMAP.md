# Implementation Roadmap: Card Arbitrage App

## Current Stack Analysis

### Existing Infrastructure ✅
- FastAPI backend with SQLModel ORM
- PostgreSQL database with Alembic migrations
- React frontend with TanStack Router
- User authentication system
- Basic CRUD operations
- Docker containerization
- CI/CD workflows

### What Needs to Be Added

---

## Phase 1: Database & Models (Week 1-2)

### 1.1 Create New Database Models

**File: `backend/app/models.py`**
- Extend existing models with:
  - `Card` model (card catalog)
  - `SourceListing` model (scraped listings)
  - `MarketplacePrice` model (price data)
  - `Opportunity` model (arbitrage opportunities)
  - `Purchase` model (track purchases)
  - `Listing` model (track listings)
  - `UserSettings` model (arbitrage preferences)

**Action Items:**
```bash
# Create new migration
cd backend
alembic revision --autogenerate -m "add_arbitrage_models"
alembic upgrade head
```

### 1.2 Update Existing Models

**File: `backend/app/models.py`**
- Add relationships to `User` model:
  - `purchases: list[Purchase]`
  - `listings: list[Listing]`
  - `opportunities: list[Opportunity]`
  - `settings: UserSettings` (one-to-one)

---

## Phase 2: Backend API Routes (Week 3-4)

### 2.1 Create New Route Files

**New Files:**
- `backend/app/api/routes/cards.py` - Card catalog endpoints
- `backend/app/api/routes/sources.py` - Source listing management
- `backend/app/api/routes/opportunities.py` - Opportunity feed
- `backend/app/api/routes/purchases.py` - Purchase tracking
- `backend/app/api/routes/listings.py` - Listing management
- `backend/app/api/routes/marketplace.py` - Price aggregation
- `backend/app/api/routes/scrapers.py` - Scraper control
- `backend/app/api/routes/analytics.py` - Performance metrics

**File: `backend/app/api/main.py`**
- Register new routers:
```python
from app.api.routes import cards, sources, opportunities, purchases, listings, marketplace, scrapers, analytics

api_router.include_router(cards.router, prefix="/cards", tags=["cards"])
api_router.include_router(sources.router, prefix="/sources", tags=["sources"])
api_router.include_router(opportunities.router, prefix="/opportunities", tags=["opportunities"])
# ... etc
```

### 2.2 Update Existing Routes

**File: `backend/app/api/routes/users.py`**
- Add endpoint to get/update user arbitrage settings

---

## Phase 3: Scraper Infrastructure (Week 5-6)

### 3.1 Install Dependencies

**File: `backend/pyproject.toml`**
```toml
dependencies = [
    # ... existing dependencies
    "beautifulsoup4>=4.12.0",
    "selenium>=4.15.0",
    "requests>=2.31.0",
    "lxml>=5.0.0",
    "python-dateutil>=2.8.0",
    "fuzzywuzzy>=0.18.0",
    "python-Levenshtein>=0.23.0",
]
```

**Action:**
```bash
cd backend
uv sync
```

### 3.2 Create Scraper Module

**New Directory: `backend/app/scrapers/`**
- `__init__.py`
- `base.py` - Base scraper class
- `heritage_auctions.py` - Heritage Auctions scraper
- `craigslist.py` - Craigslist scraper
- `facebook_marketplace.py` - Facebook Marketplace scraper
- `utils.py` - Scraper utilities

**File: `backend/app/scrapers/base.py`**
```python
from abc import ABC, abstractmethod
from app.models import SourceListing

class BaseScraper(ABC):
    @abstractmethod
    async def scrape_listings(self) -> list[SourceListing]:
        pass
    
    @abstractmethod
    def normalize_card_data(self, raw_data: dict) -> dict:
        pass
```

### 3.3 Create Scraper Service

**File: `backend/app/services/scraper_service.py`**
- Orchestrates all scrapers
- Handles scheduling
- Manages scraper state

---

## Phase 4: Background Tasks (Week 7)

### 4.1 Install Celery & Redis

**File: `backend/pyproject.toml`**
```toml
dependencies = [
    # ... existing
    "celery>=5.3.0",
    "redis>=5.0.0",
]
```

**File: `backend/docker-compose.yml`**
- Add Redis service:
```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### 4.2 Create Celery App

**New File: `backend/app/core/celery_app.py`**
```python
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "app",
    broker=f"redis://redis:6379/0",
    backend=f"redis://redis:6379/0",
)
```

### 4.3 Create Background Tasks

**New Directory: `backend/app/workers/`**
- `__init__.py`
- `scraper_tasks.py` - Scraping tasks
- `price_tasks.py` - Price aggregation tasks
- `opportunity_tasks.py` - Opportunity calculation tasks

**Example Task:**
```python
from app.core.celery_app import celery_app

@celery_app.task
def scrape_heritage_auctions():
    # Scraping logic
    pass
```

### 4.4 Update Docker Compose

**File: `backend/docker-compose.yml`**
- Add Celery worker service:
```yaml
services:
  celery-worker:
    build: .
    command: celery -A app.core.celery_app worker --loglevel=info
    depends_on:
      - redis
      - db
```

---

## Phase 5: Price Intelligence (Week 8)

### 5.1 eBay API Integration

**File: `backend/pyproject.toml`**
```toml
dependencies = [
    # ... existing
    "ebaysdk>=2.1.5",  # Or use official eBay REST API
]
```

**New File: `backend/app/services/marketplace_service.py`**
- eBay API client
- Price fetching logic
- Price normalization

### 5.2 Price Aggregation Service

**File: `backend/app/services/price_service.py`**
- Aggregates prices from multiple sources
- Calculates averages, trends
- Updates MarketplacePrice records

---

## Phase 6: Arbitrage Engine (Week 9)

### 6.1 Opportunity Calculator

**New File: `backend/app/services/arbitrage_service.py`**
```python
class ArbitrageService:
    def calculate_opportunity(self, source_listing: SourceListing) -> Opportunity:
        # Calculate profit margins
        # Factor in fees, shipping, etc.
        pass
```

### 6.2 Fee Calculator

**New File: `backend/app/services/fee_calculator.py`**
- Calculate auction fees
- Calculate marketplace fees
- Calculate shipping costs
- Calculate total profit

---

## Phase 7: Frontend Components (Week 10-11)

### 7.1 Generate API Client

**Action:**
```bash
cd frontend
npm run generate-client
```

### 7.2 Create New Components

**New Files:**
- `frontend/src/components/Opportunities/OpportunityCard.tsx`
- `frontend/src/components/Opportunities/OpportunityDetail.tsx`
- `frontend/src/components/Opportunities/OpportunityFeed.tsx`
- `frontend/src/components/Purchases/PurchaseTracker.tsx`
- `frontend/src/components/Listings/ListingManager.tsx`
- `frontend/src/components/Analytics/AnalyticsDashboard.tsx`
- `frontend/src/components/Cards/CardCatalog.tsx`
- `frontend/src/components/Settings/ArbitrageSettings.tsx`

### 7.3 Create New Routes

**New Files:**
- `frontend/src/routes/opportunities.tsx`
- `frontend/src/routes/opportunities.$id.tsx`
- `frontend/src/routes/purchases.tsx`
- `frontend/src/routes/listings.tsx`
- `frontend/src/routes/analytics.tsx`
- `frontend/src/routes/cards.tsx`

**File: `frontend/src/routes/_layout.tsx`**
- Add navigation links for new routes

### 7.4 Update Settings Route

**File: `frontend/src/routes/settings.tsx`**
- Add arbitrage settings section

---

## Phase 8: Real-time Updates (Week 12)

### 8.1 WebSocket Integration

**File: `backend/pyproject.toml`**
```toml
dependencies = [
    # ... existing
    "websockets>=12.0",
]
```

**New File: `backend/app/api/websocket.py`**
- WebSocket endpoint for real-time updates

**File: `frontend/src/hooks/useWebSocket.ts`**
- React hook for WebSocket connection

---

## Configuration Updates

### Environment Variables

**File: `.env`**
```bash
# Existing variables...

# Scraping
SCRAPER_USER_AGENT=CardFlip/1.0
SCRAPER_RATE_LIMIT_DELAY=2  # seconds between requests

# eBay API
EBAY_APP_ID=your_ebay_app_id
EBAY_DEV_ID=your_ebay_dev_id
EBAY_CERT_ID=your_ebay_cert_id
EBAY_SANDBOX=true

# Celery
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0

# Redis
REDIS_URL=redis://redis:6379/0

# Arbitrage Settings
DEFAULT_MIN_PROFIT_MARGIN=20  # percentage
DEFAULT_MAX_PURCHASE_PRICE=1000  # dollars
```

### Settings Model

**File: `backend/app/core/config.py`**
- Add new settings fields:
```python
class Settings(BaseSettings):
    # ... existing settings
    
    # Scraping
    SCRAPER_USER_AGENT: str = "CardFlip/1.0"
    SCRAPER_RATE_LIMIT_DELAY: int = 2
    
    # eBay
    EBAY_APP_ID: str | None = None
    EBAY_DEV_ID: str | None = None
    EBAY_CERT_ID: str | None = None
    EBAY_SANDBOX: bool = True
    
    # Celery
    CELERY_BROKER_URL: str = "redis://redis:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://redis:6379/0"
```

---

## Testing Strategy

### Backend Tests

**New Directory: `backend/tests/`**
- `test_scrapers.py` - Scraper unit tests
- `test_arbitrage.py` - Arbitrage calculation tests
- `test_marketplace.py` - Marketplace API tests
- `test_opportunities.py` - Opportunity service tests

### Frontend Tests

**New Directory: `frontend/src/__tests__/`**
- Component tests for new UI components
- Integration tests for workflows

---

## Deployment Considerations

### 1. Additional Infrastructure
- Redis instance (managed or containerized)
- Celery worker instances (can scale horizontally)
- Proxy/VPN service for scraping (optional)

### 2. Monitoring
- Scraper health monitoring
- Opportunity discovery rate
- API rate limit tracking
- Error alerting

### 3. Rate Limiting
- Implement rate limiting for scrapers
- Respect robots.txt
- Implement exponential backoff

---

## Migration Checklist

- [ ] Create database models
- [ ] Run Alembic migrations
- [ ] Install new Python dependencies
- [ ] Create scraper infrastructure
- [ ] Set up Celery and Redis
- [ ] Create background tasks
- [ ] Integrate eBay API
- [ ] Build arbitrage calculation engine
- [ ] Create API routes
- [ ] Generate frontend API client
- [ ] Build frontend components
- [ ] Create new routes
- [ ] Add WebSocket support
- [ ] Update environment variables
- [ ] Write tests
- [ ] Update Docker Compose
- [ ] Deploy to staging
- [ ] Test end-to-end workflows
- [ ] Deploy to production

---

## Quick Start Commands

```bash
# Backend setup
cd backend
uv sync
alembic revision --autogenerate -m "add_arbitrage_models"
alembic upgrade head

# Frontend setup
cd frontend
npm install
npm run generate-client

# Run with Docker
docker-compose up -d
docker-compose up celery-worker  # In separate terminal
```

---

## Estimated Effort

- **Backend Development**: 6-8 weeks
- **Frontend Development**: 3-4 weeks
- **Integration & Testing**: 2-3 weeks
- **Total MVP**: 12 weeks (3 months)

This assumes:
- 1-2 developers
- Starting with manual review workflow (no full automation)
- 2-3 source integrations
- eBay as primary marketplace
