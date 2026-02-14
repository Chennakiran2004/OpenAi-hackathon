import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import CarbonCreditSidebar from "../CarbonCreditSidebar";

interface CarbonCreditLayoutProps {
  children: React.ReactNode;
}

export default function CarbonCreditLayout({ children }: CarbonCreditLayoutProps) {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CarbonCreditSidebar onLogout={logout} />
      <div className="flex-1 ml-64">{children}</div>
    </div>
  );
}
