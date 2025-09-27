# AI Interview App

A mini-project to build an **AI-powered interview preparation app**.  
This project uses **shadcn/ui** for UI components and is tracked with Git + GitHub for version control.

---

## 📅 Day 1 Progress
- ✅ Initial project setup completed (`ai-interview-app`)
- ✅ Integrated **shadcn** to generate UI components
- ✅ Pushed the Day 1 work to GitHub using Git

---

## 🚀 Tech Stack
- **Frontend:** Nextjs + TypeScript  
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)  
- **Version Control:** Git + GitHub  

---

## 📌 Next Steps
- Add authentication flow  
- Start building reusable components  
- Set up backend service integration  

---

## 📅 Day 2 Progress
🚀 Day 2 – Landing Page
📌 What I did today

Created a Landing Page with a clean and modern design.

Used Aceternity UI and Untitled UI components to build:

Header / Navbar section

Hero section with animated heading, subtitle, buttons, and preview image.

🛠️ Tech & Tools

Next.js (React framework)

Tailwind CSS (styling)

 Motion (animations)

Aceternity UI (for styled UI blocks)

Untitled UI (for design inspiration and components)

✨ Features Added

Animated hero headline (word-by-word reveal with Framer Motion).

Decorative gradient borders (sides + bottom).

Responsive CTA buttons with light/dark mode support.

Preview image card with rounded corners, shadows, and border.

Full dark mode support.


👉 Next up for Day 3: maybe adding features section, testimonials, or pricing cards.

✅ Work Done Today

Integrated Clerk authentication into the project.

Added sign-in and sign-up flows with Clerk’s hosted UI components.

Configured environment variables (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY) for secure authentication.

Protected routes so that only authenticated users can access dashboard pages.

Added user session management:

Auto-redirect to login if not signed in.

Display user profile info after login.

🔑 Features Implemented

Email/password + OAuth authentication (Google, GitHub, etc.).

Secure session handling with Clerk’s middleware.

Custom redirect after login (goes to Dashboard).

Sign-out button with proper session cleanup.

📌 Next Steps

Connect authentication with user-specific data in the dashboard.

Add role-based access (e.g., Admin, User).

Improve UI/UX for login and signup pages with project theme.



## 📂 How to Run the Project
```bash
# Clone the repo
git clone https://github.com/your-username/ai-interview-app.git

# Navigate to project
cd ai-interview-app

# Install dependencies
npm install

# Start development server
npm run dev
