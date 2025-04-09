# Authplate

A modern authentication template for Next.js applications with built-in security features, MongoDB integration, and a polished UI.

![Authplate Banner](https://via.placeholder.com/800x400)

## ✨ Features

- **Next.js 13+** with App Router architecture
- **Complete Authentication** powered by NextAuth.js
- **MongoDB Integration** (local or Atlas)
- **TypeScript** throughout the codebase
- **Tailwind CSS** for responsive styling
- **Dark/Light Mode** with system preference detection
- **SEO Optimized** components and structure
- **Clean Architecture** with intuitive folder structure
- **Responsive Design** for all device sizes

## 📋 Requirements

- Node.js v16.8+
- MongoDB (local installation or MongoDB Atlas account)
- Git

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/zeon-studio/authplate.git

# Navigate to project directory
cd authplate

# Install dependencies
npm install
```

### Configuration

1. Create a `.env.local` file in the root directory with the following variables:

```env
# Development settings
AUTH_TRUST_HOST=true
ANALYZE=false

# Authentication
AUTH_SECRET="your_auth_secret_here"

# Database
DATABASE_URL="your_mongodb_connection_string_here"

# Google Auth (NextAuth)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# GitHub Auth (NextAuth)
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# Email (Nodemailer)
SENDER_EMAIL="your_sender_email@example.com"
EMAIL_PASSWORD="your_email_app_password"

# Stripe (Coming Soon)
# NEXT_PUBLIC_STRIPE_PUBLIC_KEY="your_stripe_public_key"
# STRIPE_SECRET_KEY="your_stripe_secret_key"
# STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"

# Paddle
PADDLE_API_KEY="your_paddle_api_key"
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN="your_paddle_client_token"
PADDLE_NOTIFICATION_WEBHOOK_SECRET="your_paddle_webhook_secret"
NEXT_PUBLIC_PADDLE_ENV="sandbox" # or "production"

# JWT
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES="1d" # Example: 1d, 7d, 1h
```

2. Set up your database:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (if needed)
npx prisma db push
```

3. Start the development server:

```bash
npm run dev
```

Your app should now be running at [http://localhost:3000](http://localhost:3000)!

## 🔑 Authentication Configuration

Authplate supports multiple authentication methods:

### Social Authentication
- **Google**: Create credentials in the [Google Cloud Console](https://console.cloud.google.com/)
- **GitHub**: Register a new OAuth application in [GitHub Developer Settings](https://github.com/settings/developers)

### Email Authentication
Authplate uses Nodemailer for email-based authentication:
1. Configure your email provider settings
2. For Gmail, you may need to create an [App Password](https://support.google.com/accounts/answer/185833)

## 💰 Payment Integration
Authplate supports two payment providers:
- **Paddle**
- **Stripe** (Coming Soon)

### Paddle Setup
1. Create a [Paddle account](https://paddle.com)
2. Get your API keys from the Paddle Dashboard
3. Configure webhooks for subscription management

### Stripe Integration
Stripe integration is coming soon in a future update. The codebase includes placeholders for Stripe configuration but this feature is not yet fully implemented.

## 💰 Pricing Configuration

Authplate includes a flexible pricing system that's easy to customize.

### Modifying Pricing Tiers

Navigate to `src/config/paddle.ts` or `src/config/stripe.ts` depending on your payment provider.

#### Tier Structure

```typescript
interface Tier {
  name: string;             // Display name
  id: PackageType;          // Unique identifier
  icon: string;             // Icon path
  description: string;      // Short description
  features: string[];       // List of features
  featured: boolean;        // Highlight this plan
  priceId: OneKeyOnly<Record<BillingCycle, string>>; // Pricing
}
```

#### Example: Adding a Team Plan

```typescript
{
  name: PackageType.TEAM,
  id: PackageType.TEAM,
  icon: "/assets/icons/price-tiers/team-icon.svg",
  description: "$15/month (Billed monthly).",
  features: [
    "2 Organizations",
    "10 Users per org",
    "10 Sites",
    "Priority Support",
  ],
  featured: false,
  priceId: {
    [BillingCycle.MONTHLY]: "your_stripe_price_id",
  },
}
```

> **Note:** Each tier can only have one billing cycle at a time due to the `OneKeyOnly` utility type.

### Adding Billing Cycles

To add more billing options:

1. Extend the `BillingCycle` enum in your Prisma schema:

```prisma
enum BillingCycle {
  DAILY
  WEEKLY
  MONTHLY
  QUARTERLY
  ANNUAL
  LIFETIME
}
```

2. Regenerate your Prisma client:

```bash
npx prisma generate
```

### Best Practices

- Keep Stripe price IDs unique and updated
- Use the `featured` flag to highlight your recommended plan
- Define new `PackageType` enum values before using them

## 🔧 Customization

Authplate is designed to be easily customizable:

- **Theme**: Modify the Tailwind configuration in `tailwind.config.js`
- **Components**: Edit or extend the components in `src/components`
- **Authentication**: Configure providers in `src/app/api/auth/[...nextauth]/route.ts`

## 📱 Responsive Design

Authplate is built with mobile-first design principles, ensuring your application looks great on:

- Smartphones
- Tablets
- Desktops
- Large screens

## 🤝 Contributing

We welcome contributions to make Authplate better!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

If you encounter any issues or have questions, please:

- [Open an issue](https://github.com/zeon-studio/authplate/issues)
- [Contact the Zeon Studio team](https://zeon.studio/contact)

---

Built with ❤️ by [Zeon Studio](https://zeon.studio)