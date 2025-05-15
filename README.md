# Superfood Studio

A comprehensive e-commerce platform for superfood products and premium recipes.

## Features

- **Products Store**: Browse and purchase superfood products
- **Recipe Repository**: Access free and premium recipes
- **Subscription Service**: Sign up for monthly/yearly subscription plans
- **User Authentication**: Secure authentication with Privy
- **Shopping Cart**: Add products to cart and checkout
- **Payment Processing**: Secure payments via Stripe
- **Media Uploads**: IPFS-based storage for images using Pinata
- **Admin Dashboard**: Manage products, recipes, and users

## Technical Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: Next.js API routes, GraphQL
- **Database**: MongoDB with Prisma ORM
- **Authentication**: Privy
- **Payment Processing**: Stripe
- **Media Storage**: Pinata (IPFS)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB instance
- Privy account for authentication
- Stripe account for payments
- Pinata account for IPFS storage

### Environment Setup

Create a `.env.local` file with the following values:

```
# Database
DATABASE_URL="mongodb+srv://..."

# Authentication
PRIVY_APP_ID="..."
PRIVY_APP_SECRET="..."

# Payments
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."

# Media Storage
PINATA_API_KEY="..."
PINATA_API_SECRET="..."
```

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Run development server
pnpm dev
```

### Building for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### API Testing

```bash
# Run API tests (requires environment setup)
pnpm test-api
```

### CI/CD

A CI script is provided to run on your CI/CD platform:

```bash
# Run CI checks (build, lint, test)
./scripts/ci.sh
```

## Frontend Routes

The application includes the following main user routes:

- `/` - Home page
- `/cart` - Shopping cart
- `/checkout` - Checkout flow
- `/checkout/success` - Successful checkout page
- `/checkout/cancel` - Cancelled checkout page
- `/profile` - User profile management
- `/subscription` - Subscription management
- `/recipes` - Recipes listing page
- `/recipes/[id]` - Individual recipe page

Admin routes:

- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/recipes` - Recipe management

## API Endpoints

The API follows RESTful conventions and includes the following main endpoints:

- `/api/graphql` - GraphQL API
- `/api/cart` - Shopping cart management
- `/api/checkout` - Payment processing
- `/api/subscription` - Subscription management
- `/api/upload` - Media upload
- `/api/user/profile` - User profile management
- `/api/webhooks/stripe` - Stripe webhook handler

## License

[MIT License](LICENSE)

## Contributors

- Superfood Studio Team

## Development Setup

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev

# Compile Relay GraphQL artifacts
pnpm relay

# Watch for GraphQL changes and recompile automatically
pnpm relay:watch
```

## Build and Deployment

The project has two build scripts:

```bash
# Regular build for Vercel deployment - doesn't run relay-compiler to avoid stack overflow
pnpm build

# Full build with Relay compilation - use this locally before pushing
pnpm build:with-relay
```

**Important:** Always run `pnpm relay` or `pnpm build:with-relay` locally before pushing changes that affect GraphQL queries. The Vercel build doesn't include relay-compiler to avoid deployment errors.

## Environment Variables

Create a `.env.local` file with the following variables:

```
DATABASE_URL=your_mongodb_connection_string
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_secret
```
