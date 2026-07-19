# Change Log

This file tracks all modifications made to this portfolio repository in response to user prompts.

## [2026-07-15] - Initial Repository Setup & Migration
- **Request**: Clone `https://github.com/Muhammad-Umer34/portfolio-site.git`, create new github repo, make changes, and push.
- **Changes**:
  - Reconfigured git origin to `https://github.com/Muhammad-Umer34/PortFolio.git`.
  - Renamed primary branch to `main`.
  - Pushed original cloned repository to the new remote.

## [2026-07-15] - Internship Experience Customization
- **Request**: Add 4 internship experiences (KICS UET, OptimusAutomate, CodeAlpha, DaFi Labs) to the experience section.
- **Changes**:
  - Updated [experience.js](file:///e:/PortFolio/utils/data/experience.js) with detailed internship entries, including duration, roles, descriptions/responsibilities, and skills.

## [2026-07-15] - Added "Flex Connect" Project
- **Request**: Add Flex Connect project (Flutter, Dart, Node.js, Playwright, Express.js, Supabase, Shared Preferences).
- **Changes**:
  - Added Flex Connect project entry to [projects-data.js](file:///e:/PortFolio/utils/data/projects-data.js).

## [2026-07-15] - Added "Voyage Hub" Project & UI Stacking Fix
- **Request**: Add Voyage Hub project (React, FastAPI, SQLAlchemy, WebSockets, Python, PostgreSQL).
- **Changes**:
  - Added Voyage Hub project entry to [projects-data.js](file:///e:/PortFolio/utils/data/projects-data.js).
  - Modified project mapping in [index.jsx](file:///e:/PortFolio/app/components/homepage/projects/index.jsx) to render all cards dynamically.
  - Adjusted [globals.scss](file:///e:/PortFolio/app/css/globals.scss) to define animations/stacking index handles for 5th and 6th project cards.

## [2026-07-15] - Updated Resume Link
- **Request**: Update resume link to new Google Drive URL.
- **Changes**:
  - Modified the `resume` property in [personal-data.js](file:///e:/PortFolio/utils/data/personal-data.js).

## [2026-07-15] - Updated "Who I Am" Summary
- **Request**: Update profile bio description.
- **Changes**:
  - Updated `description` property in [personal-data.js](file:///e:/PortFolio/utils/data/personal-data.js) to reflect current profile, internships, and key projects (Flex Connect and Voyage Hub).

## [2026-07-15] - Task 2: Contact Form Fields & Validation
- **Request**: Build personal portfolio website according to plan and add a Contact Us page/form with name, email, phone/subject, message, and client-side validation.
- **Changes**:
  - Added optional `phone` and required `subject` fields to [contact-form.jsx](file:///e:/PortFolio/app/components/homepage/contact/contact-form.jsx).
  - Updated client-side validation to enforce required fields (`name`, `email`, `subject`, and `message`) and email formatting.
  - Modified backend API route [route.js](file:///e:/PortFolio/app/api/contact/route.js) to accept, validate, and format the new `phone` and `subject` parameters inside the email template and Telegram messages.

## [2026-07-15] - Vercel Deployment Instructions
- **Request**: Ask for steps to deploy the portfolio website on Vercel.
- **Changes**: Provided step-by-step guide for Vercel deployment (no codebase file modifications required).

## [2026-07-15] - Vercel URL Customization Advice
- **Request**: Query about naming the project to get a specific URL (e.g. `muhammad-umer-portfolio.vercel.app`).
- **Changes**: Provided naming recommendations and configuration steps in Vercel settings.
