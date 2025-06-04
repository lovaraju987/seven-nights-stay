# Application Document

## 1. App Overview

This application is a web-based platform designed to manage hostels and related services, catering to different user roles: Admin, Agent, Owner, and Hosteller. It provides a centralized system for hostel owners to list and manage their properties, agents to assist with management tasks, hostellers to find and book accommodations, and administrators to oversee the entire platform. The application aims to streamline the process of hostel management and booking through a user-friendly interface and robust backend functionality.

Key functionalities include user authentication and authorization based on roles, hostel listing and management, room management, booking system, user profiles, and potentially features like analytics, reporting, and notifications.

## 2. Technical Stack

The application is built using modern web technologies to ensure a performant, scalable, and maintainable codebase.

*   **Frontend:** React with TypeScript.
*   **Build Tool:** Vite for fast development and optimized builds.
*   **Styling:** Tailwind CSS for a utility-first CSS framework, likely extended with a component library (indicated by `components.json` and `src/components/ui`).
*   **Backend:** Supabase, providing a backend-as-a-service including authentication, database (PostgreSQL), and potentially storage and edge functions.
*   **State Management:** Likely uses React's built-in state management with hooks, potentially augmented by libraries like React Query (`@tanstack/react-query`) for data fetching and caching.
*   **Routing:** React Router DOM for navigation between different pages.
*   **Form Handling:** React Hook Form and Zod for form validation.
*   **UI Components:** Utilizes a component library, likely Shadcn UI, based on the file structure in `src/components/ui`.
*   **Other Libraries:** Includes various utility libraries for tasks such as date handling (`date-fns`), UI elements (`lucide-react`, `vaul`), carousel (`embla-carousel-react`), charts (`recharts`), and more.

## 3. Project Structure

The project follows a clear and organized structure to separate concerns and enhance maintainability.

*   `./`: Root directory containing project configuration files (`package.json`, `tsconfig.json`, `vite.config.ts`, etc.) and public assets.
*   `./public`: Contains static assets like `favicon.ico`, `placeholder.svg`, and `robots.txt`.
*   `./src`: Contains the main application source code.
    *   `./src/App.tsx`: The main application component, likely handling routing and layout based on user roles.
    *   `./src/main.tsx`: The entry point of the React application.
    *   `./src/App.css` and `./src/index.css`: Global CSS files.
    *   `./src/components`: Reusable React components.
        *   `./src/components/admin`: Components specific to the Admin role.
        *   `./src/components/agent`: Components specific to the Agent role.
        *   `./src/components/owner`: Components specific to the Owner role.
        *   `./src/components/ui`: Generic UI components from the chosen component library (e.g., buttons, inputs, dialogs).
    *   `./src/hooks`: Custom React hooks for encapsulating logic (e.g., `use-mobile.tsx`, `use-toast.ts`, `useAuth.tsx`).
    *   `./src/lib`: Utility functions and configurations.
        *   `./src/lib/supabase.ts`: Supabase client initialization and related functions.
        *   `./src/lib/utils.ts`: General utility functions.
    *   `./src/pages`: Top-level components representing different pages of the application.
        *   `./src/pages/Index.tsx`: Landing or initial page.
        *   `./src/pages/Login.tsx`: Login page.
        *   `./src/pages/Register.tsx`: Registration page.
        *   `./src/pages/RoleSelection.tsx`: Page for selecting a user role after login/registration.
        *   `./src/pages/SplashScreen.tsx`: Initial loading screen.
        *   `./src/pages/NotFound.tsx`: 404 error page.
        *   `./src/pages/admin`: Pages specific to the Admin role (e.g., `AdminDashboard.tsx`, `UserManagement.tsx`).
        *   `./src/pages/agent`: Pages specific to the Agent role (e.g., `AgentDashboard.tsx`, `AgentMyHostels.tsx`).
        *   `./src/pages/hosteller`: Pages specific to the Hosteller role (e.g., `Home.tsx`, `HostelDetail.tsx`, `Booking.tsx`).
        *   `./src/pages/owner`: Pages specific to the Owner role (e.g., `OwnerDashboard.tsx`, `ManageHostel.tsx`).
    *   `./src/integrations/supabase`: Files related to Supabase integration, including client setup and type definitions.
*   `./supabase`: Contains Supabase configuration and potentially database schema or functions.

## 4. Key Features (User-focused)

The application offers a range of features tailored to each user role:

*   **Hosteller:**
    *   Browse and search for hostels with various filters.
    *   View detailed information about hostels, including images, amenities, and room types.
    *   Book rooms in selected hostels.
    *   Manage their bookings and view booking history.
    *   Create and manage a wishlist of preferred hostels.
    *   Manage their user profile, including:
        *   Viewing and editing personal information (name, email, phone, address, bio).
        *   Updating their password.
        *   Managing notification preferences (e.g., booking updates, promotions, recommendations, app updates).
        *   Adding and managing payment methods.
        *   Configuring privacy settings (e.g., sharing booking history, location services).
        *   Accessing help and support resources (FAQ, Contact Support, Terms & Conditions, Privacy Policy).
        *   Logging out of their account.
*   **Owner:**
    *   List new hostels and manage existing hostel details.
    *   Add and manage rooms within their hostels, including pricing and availability.
    *   View and manage booking requests for their hostels.
    *   Access analytics and reports related to their hostel performance.
    *   Manage their owner profile.
    *   Potentially use features like QR code storefronts.
    *   Manage their subscription plan.
*   **Agent:**
    *   Assist owners with adding and managing hostels and rooms.
    *   View and manage hostels they are associated with.
    *   Manage tasks related to hostel management.
    *   Track their performance.
    *   Manage their agent profile.
*   **Admin:**
    *   Oversee all users (Hostellers, Owners, Agents).
    *   Manage hostels listed on the platform.
    *   Handle complaints and issues.
    *   Access logs and reports for platform activity.
    *   Manage subscription plans.
    *   Send notifications to users.
    *   Configure platform settings.

## 5. Technical Details (Developer-focused)

*   **Authentication and Authorization:** Supabase Authentication is used to handle user registration, login, and session management. Role-based access control is implemented to restrict access to specific pages and functionalities based on the authenticated user's role. The `useAuth.tsx` hook likely provides authentication status and user information throughout the application.
*   **Data Management:** Supabase serves as the primary database, utilizing PostgreSQL. Data fetching, manipulation, and real-time subscriptions are likely handled using the Supabase JavaScript client library, potentially in conjunction with React Query for efficient data management and caching. User profile data, separate from authentication information, is stored and managed in a dedicated 'profiles' table. Type definitions for Supabase tables (`src/integrations/supabase/types.ts`) ensure type safety when interacting with the database.
*   **Routing:** React Router DOM is configured in `src/App.tsx` to handle navigation. Protected routes are likely implemented to ensure only authenticated users with appropriate roles can access specific pages. The `useNavigate` hook is used for programmatic navigation within the application.
*   **UI Components:** The application heavily utilizes a component library, identified as Shadcn UI based on the import paths and component names within `src/components/ui`. These components provide a consistent and accessible user interface across the application. Examples of used components include `Button`, `Card`, `Input`, `Tabs`, `Switch`, `Avatar`, and `InputOTP`.
*   **Routing:** React Router DOM is configured in `src/App.tsx` to handle navigation. Protected routes are likely implemented to ensure only authenticated users with appropriate roles can access specific pages.
*   **Component Architecture:** The application utilizes a component-based architecture with a clear separation between UI components (in `src/components/ui`), reusable components, and page-specific components. Layout components (`AdminLayout.tsx`, `AgentLayout.tsx`, `OwnerLayout.tsx`) provide consistent structure for different sections of the app.
*   **State Management:** Local component state is managed using React hooks (`useState`, `useReducer`). Global state, particularly for authentication and potentially shared data, might be managed through React Context or libraries like Zustand or Redux if needed (though not explicitly indicated by the file structure alone).
*   **API Interactions:** Interactions with the Supabase backend are likely encapsulated in functions within `src/lib/supabase.ts` or in dedicated data fetching hooks.
*   **Form Handling and Validation:** Forms are managed using React Hook Form, and input validation is handled using Zod schemas, providing a robust and type-safe approach to form management.
*   **Styling:** Tailwind CSS is configured in `tailwind.config.ts` and used throughout the application for styling. The component library in `src/components/ui` likely provides pre-styled and accessible UI elements.
*   **Utilities:** The `src/lib/utils.ts` file contains general utility functions that can be reused across the application. Custom hooks in `src/hooks` encapsulate specific logic for features like toast notifications (`use-toast.ts`) or mobile detection (`use-mobile.tsx`).

This document provides a high-level overview and technical breakdown of the application based on the provided file structure. A more detailed document would require examining the code within each file to understand the specific implementation details and logic.
