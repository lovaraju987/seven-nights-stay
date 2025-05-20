// src/components/owner/OwnerLayout.tsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  HomeIcon,
  PlusIcon,
  BedDoubleIcon,
  CalendarIcon,
  CreditCardIcon,
  BarChartIcon,
  QrCodeIcon,
  UserIcon,
} from "lucide-react";

const OwnerLayout: React.FC = () => {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 rounded hover:bg-gray-100 ${
      isActive ? "bg-gray-200 font-semibold" : ""
    }`;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-6">
          <h2 className="text-xl font-bold">Owner Portal</h2>
        </div>
        <nav className="space-y-1 px-2">
          <NavLink to="/owner/dashboard" className={linkClasses}>
            <HomeIcon className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink to="/owner/add-hostel" className={linkClasses}>
            <PlusIcon className="h-5 w-5 mr-3" />
            Add Hostel
          </NavLink>
          <NavLink to="/owner/manage-hostel" className={linkClasses}>
            <BedDoubleIcon className="h-5 w-5 mr-3" />
            My Hostels
          </NavLink>
          <NavLink to="/owner/manage-rooms" className={linkClasses}>
            <CalendarIcon className="h-5 w-5 mr-3" />
            Manage Rooms
          </NavLink>
          <NavLink to="/owner/bookings" className={linkClasses}>
            <CalendarIcon className="h-5 w-5 mr-3" />
            Bookings
          </NavLink>
          <NavLink to="/owner/subscription" className={linkClasses}>
            <CreditCardIcon className="h-5 w-5 mr-3" />
            Subscription
          </NavLink>
          <NavLink to="/owner/qr-storefront" className={linkClasses}>
            <QrCodeIcon className="h-5 w-5 mr-3" />
            QR Storefront
          </NavLink>
          <NavLink to="/owner/analytics" className={linkClasses}>
            <BarChartIcon className="h-5 w-5 mr-3" />
            Analytics
          </NavLink>
          <NavLink to="/owner/profile" className={linkClasses}>
            <UserIcon className="h-5 w-5 mr-3" />
            Profile
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerLayout;