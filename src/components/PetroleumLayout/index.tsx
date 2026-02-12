import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import PetroleumSidebar from "../PetroleumSidebar";

interface PetroleumLayoutProps {
  children: React.ReactNode;
}

export default function PetroleumLayout({ children }: PetroleumLayoutProps) {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PetroleumSidebar onLogout={logout} />
      <div className="flex-1 ml-64">{children}</div>
    </div>
  );
}
