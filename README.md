# Full-Stack Developer Portfolio

A modern, high-performance, and secure full-stack portfolio website built with **Next.js**, **Supabase**, and **Prisma ORM**. Features a fully responsive user interface, dynamic contact submission tracking, a secure admin portal protected by Google reCAPTCHA v3 and IP rate limiting, and instant email alerts via Resend.

---

## 🚀 Live Demo
Visit the live portfolio: **[https://muhammad-umer-portfolio-phi.vercel.app/](https://muhammad-umer-portfolio-phi.vercel.app/)**

---

## 🛠️ Tech Stack & Architecture

* **Framework**: [Next.js](https://nextjs.org/) (React 19, App Router)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Sass](https://sass-lang.com/) (custom dark theme with neon glassmorphism)
* **Database & ORM**: [Supabase](https://supabase.com/) (PostgreSQL) integrated via [Prisma ORM](https://www.prisma.io/)
* **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth) (secure JWT-based auth mapped to database user profiles)
* **Email & Alerts**: [Resend API](https://resend.com/) for automated query notifications
* **Security**: Google reCAPTCHA v3 score-based human verification & IP-based database-persisted login rate-limiting (lockout protection)

---

## 🌟 Key Features

1. **Dynamic Contact Submissions**: Visitors can submit enquiries which are directly validated on the server and saved securely to the Supabase database.
2. **Instant Notifications**: On every new query submission, the site automatically formats and dispatches an HTML email alert to the administrator via Resend.
3. **Protected Admin Dashboard**: An authorized admin can log in to view real-time statistics (total, pending, and resolved enquiries) and manage contact queries in a modern, interactive inbox list.
4. **Custom Status Management**: Admin can change enquiry statuses (`Pending`, `Done`, `Completed`, `Resolved`) using a custom glassmorphic dropdown UI.
5. **Robust Security**:
   - **reCAPTCHA v3**: Evaluates bot probability client-side and validates scores on the backend.
   - **Rate Limiting**: Limits login attempts per IP address to 5. The 6th attempt locks out the IP for 15 minutes, showing a friendly countdown timer.

---

## 📦 Directory Structure

```text
├── app/
│   ├── admin/            # Protected Dashboard and Query management UI
│   ├── api/
│   │   ├── admin/        # Secured statistics and query modification APIs
│   │   ├── auth/         # Server-side reCAPTCHA and Rate-limited login API
│   │   └── contact/      # Contact form submission and Resend email API
│   ├── login/            # Premium Admin login portal with reCAPTCHA v3
│   ├── css/              # Core stylesheets and cards layout
│   └── page.js           # Public landing portfolio page
├── prisma/
│   └── schema.prisma     # Prisma models for Contacts, Profiles, and LoginAttempts
├── scripts/
│   └── seed-admin.ts     # Admin creation and database seeding utility script
└── utils/
    ├── data/             # Personal content and details config
    └── prisma.js         # Global Prisma Client connection instance
```

---

## ⚙️ Local Development Setup

### Prerequisites
Make sure you have [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/) (>= 20.0.0) installed.

### 1. Clone the Repository
```bash
git clone https://github.com/Muhammad-Umer34/PortFolio.git
cd PortFolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and configure the variables:
```env
# Supabase PostgreSQL Connection
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase Auth Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_secret_service_role_key"

# Resend Email Configuration
RESEND_API_KEY="re_your_api_key"
RESEND_FROM_EMAIL="onboarding@resend.dev"
RESEND_TO_EMAIL="your_admin_email@example.com"

# Google reCAPTCHA v3 Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your_recaptcha_v3_site_key"
RECAPTCHA_SECRET_KEY="your_recaptcha_v3_secret_key"
```

### 4. Push Database Schema
Generate the Prisma Client and deploy the tables to your Supabase PostgreSQL instance:
```bash
npx prisma generate
npx prisma db push
```

### 5. Seed the First Admin User
Run the seeding script to create your verified Admin account in Supabase Auth and link it in the profile table:
```bash
npx tsx scripts/seed-admin.ts [email] [password]
```

### 6. Run the Dev Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view your local site.

---

## 🚀 Deployment

### Deploying to Vercel
1. Sign up/log in to [Vercel](https://vercel.com/) and import your GitHub repository.
2. Go to **Project Settings** > **Environment Variables** and add all the keys from your local `.env` file.
3. Deploy the project. Vercel automatically detects Next.js configurations.
4. Set up a Supabase connection using the URLs and keys matching your Vercel configurations.
