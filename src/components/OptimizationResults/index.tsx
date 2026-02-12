import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Badge, Spinner, LoadingSkeleton } from "../ui";
import Sidebar from "../Sidebar";
import { getResult, getErrorMessage } from "../../api/clientapi";
import { useAuth } from "../../contexts/AuthContext";
import type { ResultDetailResponse, OptimizeResultItem } from "../../api/types";
import {
  formatCurrency,
  formatDistance,
  formatCarbon,
  formatDeliveryTime,
} from "../../utils/formatters";
import {
  HiExclamationCircle,
  HiChip,
  HiCurrencyRupee,
  HiLightningBolt,
  HiArrowLeft,
  HiHome,
  HiSwitchHorizontal,
} from "react-icons/hi";
import { RiSeedlingFill } from "react-icons/ri";
import { FaTrain, FaTruck } from "react-icons/fa";

export default function OptimizationResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [data, setData] = useState<ResultDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [sortBy, setSortBy] = useState<"cost" | "time" | "carbon">("cost");

  useEffect(() => {
    if (id) {
      loadResults(id);
    }
  }, [id]);

  async function loadResults(queryId: string) {
    setLoading(true);
    setError("");
    try {
      const result = await getResult(queryId);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function getSortedResults(results: OptimizeResultItem[]) {
    const sorted = [...results];
    switch (sortBy) {
      case "cost":
        return sorted.sort(
          (a, b) => parseFloat(a.total_cost) - parseFloat(b.total_cost),
        );
      case "time":
        return sorted.sort(
          (a, b) => a.estimated_delivery_days - b.estimated_delivery_days,
        );
      case "carbon":
        return sorted.sort(
          (a, b) => a.carbon_footprint_kg - b.carbon_footprint_kg,
        );
      default:
        return sorted;
    }
  }

  function getBadgeVariant(
    category: string,
  ): "best-cost" | "fastest" | "lowest-carbon" | "default" {
    if (category === "best_cost") return "best-cost";
    if (category === "fastest") return "fastest";
    if (category === "lowest_carbon") return "lowest-carbon";
    return "default";
  }

  function getBadgeLabel(category: string): React.ReactNode {
    if (category === "best_cost")
      return (
        <span className="flex items-center gap-1">
          <HiCurrencyRupee /> Best Cost
        </span>
      );
    if (category === "fastest")
      return (
        <span className="flex items-center gap-1">
          <HiLightningBolt /> Fastest
        </span>
      );
    if (category === "lowest_carbon")
      return (
        <span className="flex items-center gap-1">
          <RiSeedlingFill /> Lowest Carbon
        </span>
      );
    return "";
  }

  function formatTransportMode(mode?: string | null): string {
    if (!mode) return "N/A";
    if (mode === "road") return "Road";
    if (mode === "rail") return "Rail";
    if (mode === "both") return "Road + Rail";
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  }

  function getTransportIcon(mode?: string | null): React.ReactNode {
    if (mode === "road") return <FaTruck className="w-4 h-4" />;
    if (mode === "rail") return <FaTrain className="w-4 h-4" />;
    if (mode === "both") return <HiSwitchHorizontal className="w-4 h-4" />;
    return <HiSwitchHorizontal className="w-4 h-4" />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar onLogout={logout} />
        <div className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <LoadingSkeleton
              variant="text"
              width="300px"
              height="40px"
              className="mb-4"
            />
            <LoadingSkeleton
              variant="text"
              width="500px"
              height="24px"
              className="mb-8"
            />
            <LoadingSkeleton variant="card" count={3} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar onLogout={logout} />
        <div className="flex-1 ml-64 p-8 flex items-center justify-center">
          <Card variant="elevated" className="max-w-md text-center">
            <div className="flex justify-center mb-4">
              <HiExclamationCircle className="text-red-500 text-6xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Results
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const sortedResults = getSortedResults(data.results);
  const hasResults = sortedResults.length > 0;
  const bestCostResult = hasResults ? sortedResults[0] : null;
  const fastestResult = hasResults
    ? sortedResults.reduce((min, r) =>
        r.estimated_delivery_days < min.estimated_delivery_days ? r : min,
      )
    : null;
  const lowestCarbonResult = hasResults
    ? sortedResults.reduce((min, r) =>
        r.carbon_footprint_kg < min.carbon_footprint_kg ? r : min,
      )
    : null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={logout} />
      <div className="flex-1 ml-64 p-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/history")}
                className="flex items-center gap-2"
              >
                <HiArrowLeft className="w-5 h-5" />
                Back to History
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2"
              >
                <HiHome className="w-5 h-5" />
                Dashboard
              </Button>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">
              Optimization Results
            </h1>
            <p className="text-gray-600 text-lg font-medium">
              {data.required_quantity_tonnes} tonnes of {data.crop_name} to{" "}
              {data.district_name}, {data.state_name}
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card
              variant="elevated"
              className="border-t-4 border-brand-primary"
            >
              <div className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-1">
                Best Cost Option
              </div>
              <div className="text-2xl font-bold text-brand-primary">
                {formatCurrency(bestCostResult?.total_cost || 0)}
              </div>
              <div className="text-gray-500 text-sm mt-1 font-medium">
                {bestCostResult?.supplier_state_name || "N/A"}
              </div>
            </Card>
            <Card
              variant="elevated"
              className="border-t-4 border-brand-warning"
            >
              <div className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-1">
                Fastest Delivery
              </div>
              <div className="text-2xl font-bold text-brand-warning">
                {fastestResult
                  ? formatDeliveryTime(fastestResult.estimated_delivery_days)
                  : "N/A"}
              </div>
              <div className="text-gray-500 text-sm mt-1 font-medium">
                {fastestResult?.supplier_state_name || "N/A"}
              </div>
            </Card>
            <Card
              variant="elevated"
              className="border-t-4 border-brand-highlight"
            >
              <div className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-1">
                Lowest Carbon
              </div>
              <div className="text-2xl font-bold text-brand-highlight">
                {lowestCarbonResult
                  ? formatCarbon(lowestCarbonResult.carbon_footprint_kg)
                  : "N/A"}
              </div>
              <div className="text-gray-500 text-sm mt-1 font-medium">
                {lowestCarbonResult?.supplier_state_name || "N/A"}
              </div>
            </Card>
          </div>

          {hasResults ? (
            <>
              {/* Sort Controls */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-gray-600 text-sm font-bold uppercase tracking-wider">
                  Sort by:
                </span>
                <div className="flex gap-2">
                  {[
                    {
                      value: "cost",
                      label: (
                        <span className="flex items-center gap-1">
                          <HiCurrencyRupee /> Cost
                        </span>
                      ),
                      key: "cost" as const,
                    },
                    {
                      value: "time",
                      label: (
                        <span className="flex items-center gap-1">
                          <HiLightningBolt /> Time
                        </span>
                      ),
                      key: "time" as const,
                    },
                    {
                      value: "carbon",
                      label: (
                        <span className="flex items-center gap-1">
                          <RiSeedlingFill /> Carbon
                        </span>
                      ),
                      key: "carbon" as const,
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.key)}
                      className={`
                                        px-4 py-2 rounded-lg text-sm font-bold transition-all duration-250 flex items-center gap-1
                                        ${
                                          sortBy === option.key
                                            ? "bg-brand-primary text-white shadow-sm"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }
                                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Table */}
              <Card
                variant="glass"
                className="overflow-hidden border-0 shadow-lg"
              >
                <div className="overflow-auto max-h-[60vh]">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-brand-light/95 backdrop-blur-md z-10 border-b border-brand-primary/20">
                      <tr>
                        <th className="text-left p-4 text-gray-900 font-bold text-xs uppercase tracking-wider">
                          Mode of Transport
                        </th>
                        <th className="text-left p-4 text-gray-900 font-bold text-xs uppercase tracking-wider">
                          Supplier State
                        </th>
                        <th className="text-left p-4 text-gray-900 font-bold text-xs uppercase tracking-wider">
                          Total Cost
                        </th>
                        <th className="text-left p-4 text-gray-900 font-bold text-xs uppercase tracking-wider">
                          Distance
                        </th>
                        <th className="text-left p-4 text-gray-900 font-bold text-xs uppercase tracking-wider">
                          Delivery Time
                        </th>

                        <th className="text-left p-4 text-gray-900 font-bold text-xs uppercase tracking-wider">
                          Carbon Footprint
                        </th>
                        <th className="text-left p-4 text-gray-900 font-bold text-xs uppercase tracking-wider">
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedResults.map((result, index) => (
                        <tr
                          key={result.id}
                          className={`
                                                border-b border-gray-100 transition-colors duration-200
                                                hover:bg-brand-light/20 cursor-pointer
                                                ${index === 0 ? "bg-primary-50/30" : "bg-white"}
                                              `}
                        >
                          <td className="p-4">
                            <div className="inline-flex items-center gap-2 font-semibold text-gray-800">
                              {getTransportIcon(result.transport_mode)}
                              {formatTransportMode(result.transport_mode)}
                            </div>
                            <div className="text-xs text-brand-primary/60 font-medium mt-1">
                              Transport: {formatCurrency(result.transportation_cost)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-gray-900">
                              {result.supplier_state_name}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              {formatCurrency(result.price_per_tonne)}/tonne
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-brand-primary text-lg">
                              {formatCurrency(result.total_cost)}
                            </div>
                          </td>
                          <td className="text-gray-600 font-medium p-4">
                            {formatDistance(result.distance_km)}
                          </td>
                          <td className="text-gray-600 font-medium p-4">
                            {formatDeliveryTime(result.estimated_delivery_days)}
                          </td>
                          <td className="text-gray-600 font-medium p-4">
                            {formatCarbon(result.carbon_footprint_kg)}
                          </td>
                          <td className="p-4">
                            {result.ranking_category && (
                              <Badge
                                variant={getBadgeVariant(
                                  result.ranking_category,
                                )}
                              >
                                {getBadgeLabel(result.ranking_category)}
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          ) : (
            <Card variant="elevated" className="mb-6 text-center py-10">
              <div className="flex justify-center mb-4">
                <HiExclamationCircle className="text-amber-500 text-5xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No recommendations found
              </h3>
              <p className="text-gray-600 mb-6">
                No supplier options matched this query. Try a new optimization
                request.
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => navigate("/optimize")}>
                  New Optimization
                </Button>
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                  Back to Dashboard
                </Button>
              </div>
            </Card>
          )}

          {/* AI Summary Card */}

          {data.ai_summary && (
            <Card
              variant="elevated"
              className="mt-6 animate-slide-up border-l-4 border-brand-primary overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-light rounded-xl text-brand-primary">
                  <HiChip className="text-4xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-brand-primary mb-3 font-display">
                    AI Recommendation
                  </h3>
                  {typeof data.ai_summary === "string" ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line font-medium">
                      {data.ai_summary}
                    </p>
                  ) : (
                    <>
                      {data.ai_summary.headline && (
                        <h4 className="text-lg font-bold text-gray-900 mb-3">
                          {data.ai_summary.headline}
                        </h4>
                      )}
                      {data.ai_summary.points &&
                        Array.isArray(data.ai_summary.points) && (
                          <ul className="space-y-2">
                            {data.ai_summary.points.map(
                              (point: any, index: number) => {
                                if (typeof point === "string") {
                                  return (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="text-brand-primary mt-1 font-bold">
                                        •
                                      </span>
                                      <span className="text-gray-700 leading-relaxed font-medium">
                                        {point}
                                      </span>
                                    </li>
                                  );
                                } else if (
                                  typeof point === "object" &&
                                  point !== null
                                ) {
                                  // Render object with title/detail or fallback to JSON
                                  return (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="text-brand-primary mt-1 font-bold">
                                        •
                                      </span>
                                      <span className="text-gray-700 leading-relaxed font-medium">
                                        {point.title ? (
                                          <strong className="text-gray-900">
                                            {point.title}
                                          </strong>
                                        ) : null}
                                        {point.detail
                                          ? `: ${point.detail}`
                                          : ""}
                                        {!point.title && !point.detail
                                          ? JSON.stringify(point)
                                          : ""}
                                      </span>
                                    </li>
                                  );
                                } else {
                                  return null;
                                }
                              },
                            )}
                          </ul>
                        )}
                    </>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
