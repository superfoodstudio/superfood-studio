# Superfood Studio Technical Roadmap

## Current Technical State

### Implemented Backend Infrastructure
- **Database:** MongoDB with Prisma ORM
- **Schema Models:** 
  - `User` with role-based access (ADMIN, SUBSCRIBER, PUBLIC)
  - `Recipe` with ingredients, instructions, and media fields
  - `Product` with Stripe integration fields
  - `Order` and `OrderItem` for e-commerce
  - `Subscription` with Stripe subscription fields
- **GraphQL API:**
  - Schema defined in `src/graphql/schema.graphql`
  - Recipe queries and mutations
  - Product queries and mutations
  - Relay integration for client-side data fetching
- **Authentication:**
  - Privy authentication integration 
  - JWT token handling
  - Role-based middleware protection for admin routes

### Implemented Frontend Infrastructure
- **Framework:** Next.js 15.2.4 with App Router
- **Component Library:** Reshaped for UI components
- **Authentication:** PrivyProvider wrapped in RootLayoutClient
- **Data Fetching:** RelayProvider for GraphQL communication
- **Admin Interfaces:**
  - Admin dashboard skeleton
  - Recipe CRUD operations
  - Product CRUD operations with Stripe integration

### Implemented Third-party Integrations
- **Privy:** Authentication and user management
- **Stripe:** Product and subscription payment infrastructure
- **Pinata:** IPFS media storage for recipes

## Technical Gaps and Implementation Tasks

### 1. Public Data Access Layer
- **Recipe Public API:** 
  ```typescript
  // Implement in src/graphql/resolvers/recipe.ts
  Query: {
    publicRecipes: async (_parent, args, { prisma }) => {
      // Add pagination, category filtering
      return prisma.recipe.findMany({
        where: { 
          isPublished: true,
          ...(args.category ? { category: args.category } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: args.limit || 10,
        skip: args.offset || 0
      });
    },
    // Add featured/preview recipes for non-subscribers
  }
  ```

- **Product Catalog API:**
  ```typescript
  // Implement in src/graphql/resolvers/product.ts
  Query: {
    // Add enhanced filtering, sorting, and pagination
    productsByCategory: async (_parent, { category, limit, offset }, { prisma }) => {
      return prisma.product.findMany({
        where: { 
          category,
          isActive: true,
          inventory: { gt: 0 }
        },
        take: limit || 20,
        skip: offset || 0
      });
    }
  }
  ```

### 2. E-commerce Functionality
- **Shopping Cart Implementation:**
  ```typescript
  // Create new schema in Prisma
  model Cart {
    id        String     @id @default(auto()) @map("_id") @db.ObjectId
    userId    String?    @db.ObjectId
    user      User?      @relation(fields: [userId], references: [id])
    items     CartItem[]
    createdAt DateTime   @default(now())
    updatedAt DateTime   @updatedAt
  }
  
  model CartItem {
    id        String   @id @default(auto()) @map("_id") @db.ObjectId
    cartId    String   @db.ObjectId
    cart      Cart     @relation(fields: [cartId], references: [id])
    productId String   @db.ObjectId
    product   Product  @relation(fields: [productId], references: [id])
    quantity  Int
    price     Float
  }
  ```

- **Cart GraphQL Resolver:**
  ```typescript
  // Implement in src/graphql/resolvers/cart.ts
  Mutation: {
    addToCart: async (_parent, { productId, quantity }, { prisma, user }) => {
      // Handle guest carts vs user carts
      // Handle inventory validation
      // Return updated cart
    },
    removeFromCart: async (_parent, { cartItemId }, { prisma, user }) => {
      // Verify cart ownership
      // Return updated cart
    },
    updateCartItem: async (_parent, { cartItemId, quantity }, { prisma, user }) => {
      // Validate inventory
      // Return updated cart
    }
  }
  ```

- **Checkout Process:**
  ```typescript
  // Implement in src/app/api/checkout/route.ts
  export async function POST(req: Request) {
    const { cartId, shippingAddress, billingAddress } = await req.json();
    
    // Validate cart exists and has items
    // Create Stripe checkout session with cart items
    // Create pending order in database
    // Return checkout session URL
  }
  ```

- **Order Processing Webhook:**
  ```typescript
  // Implement in src/app/api/webhooks/stripe/route.ts
  export async function POST(req: Request) {
    const payload = await req.text();
    const signature = req.headers.get('stripe-signature');
    
    // Verify webhook signature
    // Handle checkout.session.completed event
    // Update order status in database
    // Clear user's cart
    // Send confirmation email
  }
  ```

### 3. Subscription Management
- **Subscription Plan Creation:**
  ```typescript
  // Create in scripts/create-stripe-plans.ts
  async function createStripePlans() {
    const plans = [
      { name: 'Monthly', amount: 1499, interval: 'month' },
      { name: 'Yearly', amount: 14990, interval: 'year' }
    ];
    
    // Create products and prices in Stripe
    // Store references in database
  }
  ```

- **Subscription API:**
  ```typescript
  // Implement in src/app/api/subscription/route.ts
  export async function POST(req: Request) {
    const { planId } = await req.json();
    const token = req.headers.get('authorization')?.split(' ')[1];
    
    // Verify user authentication
    // Create Stripe checkout session for subscription
    // Return checkout session URL
  }
  ```

- **Subscription Management:**
  ```typescript
  // Implement in src/app/api/subscription/[id]/route.ts
  export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { action } = await req.json();
    
    switch (action) {
      case 'cancel':
        // Cancel subscription in Stripe
        // Update subscription status in database
        break;
      case 'reactivate':
        // Reactivate canceled subscription
        break;
      case 'change-plan':
        // Handle plan upgrades/downgrades
        break;
    }
  }
  ```

- **Subscription Webhook Handler:**
  ```typescript
  // Enhance src/app/api/webhooks/stripe/route.ts
  async function handleSubscriptionEvent(event: any) {
    switch (event.type) {
      case 'customer.subscription.created':
        // Update user subscription status
        break;
      case 'customer.subscription.updated':
        // Handle plan changes
        break;
      case 'customer.subscription.deleted':
        // Mark subscription as canceled
        break;
      case 'invoice.payment_failed':
        // Handle failed payments, notify user
        break;
    }
  }
  ```

### 4. User Management and Content Access
- **User Profile API:**
  ```typescript
  // Implement in src/app/api/user/profile/route.ts
  export async function GET(req: Request) {
    const token = req.headers.get('authorization')?.split(' ')[1];
    
    // Verify token with Privy
    // Return user profile data including subscription status
  }
  
  export async function PATCH(req: Request) {
    const { firstName, lastName, billingAddress, shippingAddress } = await req.json();
    
    // Update user profile in database
    // Return updated profile
  }
  ```

- **Content Access Middleware:**
  ```typescript
  // Enhance src/middleware.ts
  export async function middleware(req: NextRequest) {
    // Add subscription validation for premium content
    if (req.nextUrl.pathname.startsWith('/recipes/premium')) {
      const token = req.cookies.get('privy-token')?.value;
      
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      
      // Verify user has active subscription
      // If not, redirect to subscription page
    }
  }
  ```

### 5. Media and Content Delivery
- **Enhanced Media Upload:**
  ```typescript
  // Improve src/app/api/upload/route.ts
  export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    // Add validation for file types and sizes
    // Implement image optimization before upload
    // Upload to Pinata with correct metadata
    // Return IPFS hash and gateway URLs
  }
  ```

- **Content Delivery Optimization:**
  ```typescript
  // Create src/lib/services/media.ts
  export function getOptimizedImageUrl(ipfsHash: string, width?: number, height?: number) {
    // Generate optimized image URLs
    // Add image transformation parameters
    // Handle fallbacks for different IPFS gateways
  }
  ```

## Implementation Priority

### Tier 1 (Critical Path) - Estimated 3 weeks
1. **Shopping Cart Implementation**
   - Database models
   - GraphQL resolvers
   - Local storage sync for guest users

2. **Checkout Process**
   - Stripe Checkout integration
   - Order creation
   - Inventory management

3. **Subscription Plans**
   - Stripe product/price setup
   - Subscription checkout flow
   - User subscription status tracking

### Tier 2 (Core Functionality) - Estimated 2 weeks
1. **Order Management**
   - Order history for users
   - Order status updates
   - Admin order fulfillment

2. **Subscription Management**
   - Cancel/pause functionality
   - Plan changes
   - Payment method updates

3. **Content Access Control**
   - Premium content protection
   - Subscription validation
   - Preview content for non-subscribers

### Tier 3 (Enhancement) - Estimated 2 weeks
1. **User Profile Management**
   - Address management
   - Payment method management
   - Preferences and settings

2. **Media Optimization**
   - Image resizing and optimization
   - Video streaming improvements
   - Media CDN integration

3. **Search and Filtering**
   - Full-text search implementation
   - Advanced filtering
   - Tags and categories system

## Technical Debt and Improvements
1. **Error Handling**
   - Implement consistent error boundaries
   - Add structured API error responses
   - Create error logging and monitoring

2. **Performance Optimization**
   - Implement page and API route caching
   - Add incremental static regeneration for content pages
   - Optimize bundle sizes with code splitting

3. **Testing Infrastructure**
   - Add unit tests for core business logic
   - Implement API integration tests
   - Add E2E tests for critical user flows

4. **DevOps and Deployment**
   - Configure CI/CD pipeline
   - Set up environment-specific configurations
   - Implement database migration workflows

## Conclusion
The Superfood Studio application has a solid foundation with authentication, admin functionality, and data models in place. The key focus areas to complete a production-ready application are implementing e-commerce functionality (cart, checkout, orders), subscription management, and content access control.

By prioritizing the implementation of these features according to the outlined plan, we can systematically build a fully functional application that delivers value to users while maintaining a maintainable codebase. 