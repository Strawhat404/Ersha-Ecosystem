
# Ersha Ecosystem Admin Panel

This is the admin dashboard for the Ersha Ecosystem, built with React and Vite. It provides a modern, animated, and professional UI for managing the platform's core entities and analytics.

## Features

- **Animated Dashboard**
  - Four animated statistic cards (Logistics, Farmers, Merchants, Experts) with colored numbers and entrance animation
  - Analytics section with interactive Line and Bar charts (using Recharts)
  - Animated number transitions (using react-countup)

- **Navigation & Layout**
  - Fixed sidebar (bottom-to-top) with links to all admin pages
  - Top navbar for quick access
  - Responsive design with Tailwind CSS

- **Authentication**
  - Login screen as the default page
  - Navigation to dashboard after successful login

- **Entity Management Pages**
  - News: Admin can post and manage news
  - Logistics: Admin can verify or reject logistics providers
  - Farmers: Admin can verify, flag, or ban farmers
  - Merchants: Admin can manage merchants (with professional table UI)
  - Experts: Admin can manage experts (fields: name, avatar, phone, email, professional fields, certificate, status, actions)
  - All management pages feature professional tables, search, status badges, and admin action menus

- **UI/UX**
  - Modern, animated, and visually appealing interface
  - Uses Tailwind CSS for styling
  - Uses react-icons for icons
  - Modal UI for forms

## Tech Stack

- React (functional components, hooks)
- Vite (for fast development)
- Tailwind CSS (utility-first styling)
- Recharts (animated charts)
- react-countup (animated numbers)
- react-icons (icon library)

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```

## Project Structure

- `src/components/` - Sidebar, TopNavbar, and shared UI components
- `src/pages/` - Dashboard, Login, and entity management pages (news, logistics, farmers, merchants, experts)
- `src/assets/` - Static assets

---

This project is actively developed as part of the Ersha Ecosystem. For more details, see the main project documentation.
