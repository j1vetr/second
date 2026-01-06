# SecondStore.ch - Premium Marketplace

## Overview

SecondStore.ch is a premium marketplace web application for second-hand and new products. The platform operates without visible prices - users browse products and submit offers through a "Get Offer" system. The application features a React frontend with an Express backend, using PostgreSQL for data persistence.

Key features:
- Product catalog with 10 categories (Furniture, Electronics, Home & Living, etc.)
- Offer-based purchasing system (no visible prices)
- Light/Dark theme toggle with orange accent colors
- Admin dashboard for managing products, categories, and offers
- Product condition badges (New/Used)
- Featured products showcase
- Campaign popup system with admin control (announcement, product promo, newsletter, custom link types)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style)
- **Animations**: Framer Motion
- **Font**: Poppins (loaded from Google Fonts)
- **Build Tool**: Vite

The frontend follows a component-based architecture with:
- `/pages` - Route-level components (Home, ProductList, ProductDetail, Admin)
- `/components/ui` - Reusable shadcn/ui components
- `/components/layout` - Header, Footer, Layout wrapper
- `/lib` - API functions, utilities, React Query client
- `/hooks` - Custom React hooks (toast, mobile detection, theme)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Style**: RESTful JSON API
- **Session Storage**: connect-pg-simple for PostgreSQL sessions

API endpoints follow REST conventions:
- `GET/POST /api/categories` - Category management
- `GET/POST /api/products` - Product management with filtering
- `GET/POST /api/offers` - Offer submission and management
- `PATCH/DELETE` endpoints for updates and deletions

### Data Models
- **Users**: Basic authentication (id, username, password)
- **Categories**: Product categories with icons (id, name, icon)
- **Products**: Full product details (title, category, condition, image, featured, description, dimensions, weight, includedItems)
- **Offers**: Customer offer submissions (productId, customerName, customerEmail, customerPhone, offerAmount, message, status)
- **CampaignPopups**: Promotional popups (title, description, imageUrl, buttonText, buttonLink, productId, type, isEnabled, delaySeconds, frequency, priority, startAt, endAt)

### Build System
- Development: Vite dev server with HMR, tsx for server
- Production: Vite builds client to `dist/public`, esbuild bundles server to `dist/index.cjs`
- Database migrations: Drizzle Kit with `db:push` command

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management
- **connect-pg-simple**: Session storage in PostgreSQL

### Third-Party Services
- **Google Fonts**: Poppins font family
- **Unsplash**: Product images (via direct URLs in seed data)

### Key NPM Packages
- **@tanstack/react-query**: Server state management
- **drizzle-orm / drizzle-zod**: Database ORM and schema validation
- **framer-motion**: Animations
- **wouter**: Client-side routing
- **zod**: Runtime type validation
- **lucide-react**: Icon library

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development banner
- **vite-plugin-meta-images**: OpenGraph image handling for deployments