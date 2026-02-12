import React from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowRight, HiChip } from "react-icons/hi";
import { RiSeedlingFill } from "react-icons/ri";
import { Card, Button } from "../ui";
import { setStoredSector } from "../../api/clientapi";
import type { UserSector } from "../../api/clientapi";

function getSectorRoute(sector: UserSector): string {
  return sector === "petroleum" ? "/petroleum/dashboard" : "/dashboard";
}

export default function SectorSelect() {
  const navigate = useNavigate();

  function handleSelect(sector: UserSector) {
    setStoredSector(sector);
    navigate(getSectorRoute(sector), { replace: true });
  }

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Choose Your Sector
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Select the workspace you want to continue with.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            variant="elevated"
            className="border-2 border-green-200 hover:border-brand-primary transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                <RiSeedlingFill className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Agriculture</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Continue with Bharat Krishi Setu optimization, prediction, and impact
              dashboards.
            </p>
            <Button
              fullWidth
              onClick={() => handleSelect("agriculture")}
              className="justify-center"
            >
              Open Agriculture Dashboard <HiArrowRight className="w-4 h-4" />
            </Button>
          </Card>

          <Card
            variant="elevated"
            className="border-2 border-blue-100 hover:border-brand-primary transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <HiChip className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Petroleum</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Continue with crude, refinery, trade balance, and intelligence
              dashboards.
            </p>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => handleSelect("petroleum")}
              className="justify-center"
            >
              Open Petroleum Dashboard <HiArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
