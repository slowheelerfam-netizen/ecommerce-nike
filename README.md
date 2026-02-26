# Nike E-commerce Platform

This is a modern, responsive, and high-performance e-commerce web application built with Next.js and Tailwind CSS. It serves as a showcase for Nike products, allowing users to browse, search, and purchase sneakers.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (^16.1.4)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (^4.1.18)
- **UI**: [React](https://reactjs.org/) (^19.2.3)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (^5.0.0)
- **Icons**: [Lucide React](https://lucide.dev/guide/react) (^0.562.0)
- **Product Data**: [Sneaks API](https://github.com/unofficial-sneaks-api/sneaks-api) (^1.2.3)
- **Database**: [Neon](https://neon.tech/) (via `@neondatabase/serverless`)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) (^0.45.1)
- **Authentication**: [better-auth](https://www.npmjs.com/package/better-auth) (^1.4.15)
- **Linting**: [ESLint](https://eslint.org/) (^9.0.0)
- **TypeScript**: (^5.9.3)

## Project Structure

The project follows a standard Next.js App Router structure.

```
/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Authentication routes
│   ├── api/              # API routes
│   ├── cart/             # Shopping cart page
│   ├── [category]/       # Dynamic category pages (men, women, kids, etc.)
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── ...
├── components/           # Shared React components
├── lib/                  # Libraries and helpers
│   ├── data/             # Data fetching logic
│   ├── external/         # External API clients
│   ├── store/            # Zustand stores
│   └── utils/            # Utility functions
├── public/               # Static assets
└── ...
```

## Features

- **Responsive Design**: Fully responsive and mobile-first design.
- **Product Catalog**: Browse products by category (Men, Women, Kids, New Arrivals, Sale).
- **Search**: Search for products by keyword.
- **Shopping Cart**: Add products to the cart and manage quantities.
- **Image Optimization**: Next.js Image component for optimized image loading.
- **API Routes**: Backend functionality for handling product data, image proxying, and authentication.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ecommerce-nike.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add the necessary environment variables.
4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production build.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase.
