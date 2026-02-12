import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HiChartBar,
  HiTrendingUp,
  HiCog,
  HiScale,
  HiCurrencyDollar,
  HiDatabase,
  HiChip,
  HiSwitchHorizontal,
  HiUser,
  HiLogout,
} from "react-icons/hi";

interface PetroleumSidebarProps {
  onLogout: () => void;
}

export default function PetroleumSidebar({ onLogout }: PetroleumSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      path: "/petroleum/dashboard",
      label: "Dashboard",
      icon: <HiChartBar className="w-5 h-5" />,
    },
    {
      path: "/petroleum/crude",
      label: "Crude Oil",
      icon: <HiTrendingUp className="w-5 h-5" />,
    },
    {
      path: "/petroleum/refinery",
      label: "Refinery",
      icon: <HiCog className="w-5 h-5" />,
    },
    {
      path: "/petroleum/demand-supply",
      label: "Demand-Supply",
      icon: <HiScale className="w-5 h-5" />,
    },
    {
      path: "/petroleum/import-costs",
      label: "Import Costs",
      icon: <HiCurrencyDollar className="w-5 h-5" />,
    },
    {
      path: "/petroleum/explorer",
      label: "Data Explorer",
      icon: <HiDatabase className="w-5 h-5" />,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <button
          onClick={() => navigate("/petroleum/dashboard")}
          className="flex items-start gap-3 group"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-100 text-green-700 text-xl shadow-sm group-hover:scale-105 transition">
            <HiChip className="w-6 h-6" />
          </div>
          <div className="flex justify-start flex-col">
            <h1
              className="text-lg font-semibold text-gray-800"
              style={{ textAlign: "justify" }}
            >
              BKS
            </h1>
            <p className="text-xs text-gray-500">Petroleum Intelligence</p>
          </div>
        </button>
      </div>

      <div className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                text-sm font-medium transition-all duration-200 group
                ${
                  active
                    ? "bg-green-100 text-green-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <div
                className={`
                  w-9 h-9 flex items-center justify-center rounded-lg transition-all
                  ${
                    active
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-100 text-gray-500 group-hover:bg-green-50 group-hover:text-green-600"
                  }
                `}
              >
                {item.icon}
              </div>
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={() => navigate("/profile")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 group"
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 group-hover:bg-brand-primary group-hover:text-white transition">
            <HiUser className="w-5 h-5" />
          </div>
          <span>Profile</span>
        </button>
        <button
          onClick={() => navigate("/choose-sector")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brand-primary hover:bg-green-50 transition-all duration-200 group"
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-green-100 text-green-700 group-hover:bg-green-200 transition">
            <HiSwitchHorizontal className="w-5 h-5" />
          </div>
          <span>Switch Sector</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 group"
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-100 text-red-600 group-hover:bg-red-200 transition">
            <HiLogout className="w-5 h-5" />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
