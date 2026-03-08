# Daxor ERP Frontend

Next.js 15 frontend with GraphQL integration for Daxor ERP system.

## Architecture

Based on stance-dashboard-frontend clean architecture:
- **app/**: Next.js App Router with route groups
- **components/**: UI components (shadcn/ui)
- **contexts/**: React contexts (Auth, etc.)
- **gql/**: GraphQL queries and generated types
- **hooks/**: Custom React hooks
- **utils/**: Helper functions
- **types/**: TypeScript types

## Setup

```bash
# Install dependencies
bun install

# Generate GraphQL types (ensure backend is running)
bun run codegen

# Run development server
bun run dev
```

## Features

- ✅ Next.js 15 with App Router
- ✅ Apollo Client for GraphQL
- ✅ shadcn/ui components
- ✅ Authentication with JWT
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ GraphQL Code Generation

## Backend Connection

Connects to daxor-backend GraphQL API at `http://localhost:4000/graphql`

## Pages to Migrate from daxor-frontend

- [ ] Organizations
- [ ] Users
- [ ] Items
- [ ] Vendors
- [ ] Projects
- [ ] Purchase Orders
- [ ] Sales Orders
- [ ] Customer Invoices
- [ ] Attendance
