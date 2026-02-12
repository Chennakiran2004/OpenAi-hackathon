import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CanvasJSReact from "@canvasjs/react-charts";
import PetroleumLayout from "../PetroleumLayout";
import { Card, Button, LoadingSkeleton } from "../ui";
import SearchableSelect from "../ui/SearchableSelect";
import type { SelectOption } from "../ui";
import {
  getErrorMessage,
  getPetroleumCrudeForecast,
  getPetroleumDemandSupplyGap,
  getPetroleumFilters,
  getPetroleumImportCosts,
  getPetroleumIntelligence,
  getPetroleumRefineryAnalysis,
  getPetroleumTradeBalance,
  listPetroleumCrudeProduction,
  listPetroleumImportExportSnapshot,
  listPetroleumProductProduction,
  listPetroleumRefineryProcessing,
  listPetroleumTrade,
} from "../../api/clientapi";
import type {
  PaginatedResponse,
  PetroleumCrudeForecastResponse,
  PetroleumCrudeProductionRecord,
  PetroleumDemandSupplyGapResponse,
  PetroleumFilterOptions,
  PetroleumImportCostAnalysisResponse,
  PetroleumImportExportSnapshotRecord,
  PetroleumIntelligenceResponse,
  PetroleumProductProductionRecord,
  PetroleumRefineryAnalysisResponse,
  PetroleumRefineryProcessingRecord,
  PetroleumTradeBalanceResponse,
  PetroleumTradeRecord,
} from "../../api/types";
import { formatDate, formatNumber } from "../../utils/formatters";
import {
  HiExclamationCircle,
  HiArrowRight,
  HiArrowLeft,
} from "react-icons/hi";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

type PetroleumTabKey =
  | "dashboard"
  | "crude"
  | "refinery"
  | "demand-supply"
  | "import-costs"
  | "explorer";

type ExplorerDatasetKey =
  | "crude"
  | "refineries"
  | "products"
  | "trade"
  | "snapshot";

type ExplorerRow =
  | PetroleumCrudeProductionRecord
  | PetroleumRefineryProcessingRecord
  | PetroleumProductProductionRecord
  | PetroleumTradeRecord
  | PetroleumImportExportSnapshotRecord;

const PETROLEUM_TABS: PetroleumTabKey[] = [
  "dashboard",
  "crude",
  "refinery",
  "demand-supply",
  "import-costs",
  "explorer",
];

const EXPLORER_DATASETS: Array<{ key: ExplorerDatasetKey; label: string }> = [
  { key: "crude", label: "Crude" },
  { key: "refineries", label: "Refineries" },
  { key: "products", label: "Products" },
  { key: "trade", label: "Trade" },
  { key: "snapshot", label: "Snapshot" },
];

const MONTH_NAMES: Record<number, string> = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

function toOptions(items: string[]): SelectOption[] {
  return items.map((item) => ({ value: item, label: item }));
}

function toYearOptions(items: number[]): SelectOption[] {
  return [...items]
    .sort((a, b) => b - a)
    .map((year) => ({ value: year, label: String(year) }));
}

function formatKmt(value: number): string {
  return `${formatNumber(value)} KMT`;
}

function formatInrCrore(value: number): string {
  return `₹${formatNumber(value)} Cr`;
}

function formatUsdMillion(value: number): string {
  return `$${formatNumber(value)} Mn`;
}

function safeNum(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function PetroleumErrorCard({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card variant="elevated" className="text-center py-10">
      <div className="flex justify-center mb-4">
        <HiExclamationCircle className="text-red-500 text-5xl" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <Button onClick={onRetry}>Try Again</Button>
    </Card>
  );
}

export default function PetroleumSector() {
  const navigate = useNavigate();
  const params = useParams<{ tab?: string }>();

  const rawTab = params.tab;
  const activeTab: PetroleumTabKey =
    rawTab && PETROLEUM_TABS.includes(rawTab as PetroleumTabKey)
      ? (rawTab as PetroleumTabKey)
      : "dashboard";

  useEffect(() => {
    if (!rawTab || !PETROLEUM_TABS.includes(rawTab as PetroleumTabKey)) {
      navigate("/petroleum/dashboard", { replace: true });
    }
  }, [navigate, rawTab]);

  const [filters, setFilters] = useState<PetroleumFilterOptions | null>(null);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [filtersError, setFiltersError] = useState("");

  // Dashboard states
  const [dashboardYear, setDashboardYear] = useState<number | "">("");
  const [tradeBalanceData, setTradeBalanceData] =
    useState<PetroleumTradeBalanceResponse | null>(null);
  const [intelligenceData, setIntelligenceData] =
    useState<PetroleumIntelligenceResponse | null>(null);
  const [dashboardTradeLoading, setDashboardTradeLoading] = useState(false);
  const [dashboardIntelligenceLoading, setDashboardIntelligenceLoading] = useState(false);
  const [dashboardTradeError, setDashboardTradeError] = useState("");
  const [dashboardIntelligenceError, setDashboardIntelligenceError] = useState("");

  // Crude states
  const [crudeCompany, setCrudeCompany] = useState<string | "">("");
  const [crudeYear, setCrudeYear] = useState<number | "">("");
  const [crudePage, setCrudePage] = useState(1);
  const [crudeForecastData, setCrudeForecastData] =
    useState<PetroleumCrudeForecastResponse | null>(null);
  const [crudeRows, setCrudeRows] =
    useState<PaginatedResponse<PetroleumCrudeProductionRecord> | null>(null);
  const [crudeLoading, setCrudeLoading] = useState(false);
  const [crudeError, setCrudeError] = useState("");

  // Refinery states
  const [refineryName, setRefineryName] = useState<string | "">("");
  const [refineryYear, setRefineryYear] = useState<number | "">("");
  const [refineryPage, setRefineryPage] = useState(1);
  const [refineryAnalysisData, setRefineryAnalysisData] =
    useState<PetroleumRefineryAnalysisResponse | null>(null);
  const [refineryRows, setRefineryRows] =
    useState<PaginatedResponse<PetroleumRefineryProcessingRecord> | null>(null);
  const [refineryLoading, setRefineryLoading] = useState(false);
  const [refineryError, setRefineryError] = useState("");

  // Demand-supply states
  const [gapProduct, setGapProduct] = useState<string | "">("");
  const [gapYear, setGapYear] = useState<number | "">("");
  const [gapData, setGapData] = useState<PetroleumDemandSupplyGapResponse | null>(
    null,
  );
  const [gapLoading, setGapLoading] = useState(false);
  const [gapError, setGapError] = useState("");

  // Import cost states
  const [importYear, setImportYear] = useState<number | "">("");
  const [importCostData, setImportCostData] =
    useState<PetroleumImportCostAnalysisResponse | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState("");

  // Explorer states
  const [explorerDataset, setExplorerDataset] =
    useState<ExplorerDatasetKey>("trade");
  const [explorerPage, setExplorerPage] = useState(1);
  const [explorerYear, setExplorerYear] = useState<number | "">("");
  const [explorerProduct, setExplorerProduct] = useState<string | "">("");
  const [explorerTradeType, setExplorerTradeType] = useState<string | "">("");
  const [explorerCompany, setExplorerCompany] = useState<string | "">("");
  const [explorerRefinery, setExplorerRefinery] = useState<string | "">("");
  const [explorerImportExport, setExplorerImportExport] = useState<string | "">(
    "",
  );
  const [explorerData, setExplorerData] = useState<
    PaginatedResponse<ExplorerRow> | null
  >(null);
  const [explorerLoading, setExplorerLoading] = useState(false);
  const [explorerError, setExplorerError] = useState("");

  useEffect(() => {
    async function loadFilters() {
      setFiltersLoading(true);
      setFiltersError("");
      try {
        const response = await getPetroleumFilters();
        setFilters(response);
      } catch (err) {
        setFiltersError(getErrorMessage(err));
      } finally {
        setFiltersLoading(false);
      }
    }

    loadFilters();
  }, []);

  const loadDashboardData = useCallback(async () => {
    setDashboardTradeLoading(true);
    setDashboardIntelligenceLoading(true);
    setDashboardTradeError("");
    setDashboardIntelligenceError("");
    try {
      const tradeBalance = await getPetroleumTradeBalance(
        dashboardYear === "" ? undefined : dashboardYear,
      );
      setTradeBalanceData(tradeBalance);
      setDashboardTradeLoading(false);

      try {
        const intelligence = await getPetroleumIntelligence();
        setIntelligenceData(intelligence);
      } catch (err) {
        setDashboardIntelligenceError(getErrorMessage(err));
        setIntelligenceData(null);
      } finally {
        setDashboardIntelligenceLoading(false);
      }
    } catch (tradeErr) {
      setDashboardTradeError(getErrorMessage(tradeErr));
      setTradeBalanceData(null);
      setIntelligenceData(null);
      setDashboardTradeLoading(false);
      setDashboardIntelligenceLoading(false);
    }
  }, [dashboardYear]);

  const loadDashboardIntelligenceOnly = useCallback(async () => {
    setDashboardIntelligenceLoading(true);
    setDashboardIntelligenceError("");
    try {
      const intelligence = await getPetroleumIntelligence();
      setIntelligenceData(intelligence);
    } catch (err) {
      setDashboardIntelligenceError(getErrorMessage(err));
      setIntelligenceData(null);
    } finally {
      setDashboardIntelligenceLoading(false);
    }
  }, []);

  const loadCrudeData = useCallback(async () => {
    setCrudeLoading(true);
    setCrudeError("");
    try {
      const [forecast, rows] = await Promise.all([
        getPetroleumCrudeForecast(crudeCompany === "" ? undefined : crudeCompany),
        listPetroleumCrudeProduction({
          company_name: crudeCompany === "" ? undefined : crudeCompany,
          year: crudeYear === "" ? undefined : crudeYear,
          ordering: "-year",
          page: crudePage,
        }),
      ]);
      setCrudeForecastData(forecast);
      setCrudeRows(rows);
    } catch (err) {
      setCrudeError(getErrorMessage(err));
      setCrudeForecastData(null);
      setCrudeRows(null);
    } finally {
      setCrudeLoading(false);
    }
  }, [crudeCompany, crudeYear, crudePage]);

  const loadRefineryData = useCallback(async () => {
    setRefineryLoading(true);
    setRefineryError("");
    try {
      const [analysis, rows] = await Promise.all([
        getPetroleumRefineryAnalysis({
          refinery: refineryName === "" ? undefined : refineryName,
          year: refineryYear === "" ? undefined : refineryYear,
        }),
        listPetroleumRefineryProcessing({
          refinery_name: refineryName === "" ? undefined : refineryName,
          year: refineryYear === "" ? undefined : refineryYear,
          ordering: "-year",
          page: refineryPage,
        }),
      ]);
      setRefineryAnalysisData(analysis);
      setRefineryRows(rows);
    } catch (err) {
      setRefineryError(getErrorMessage(err));
      setRefineryAnalysisData(null);
      setRefineryRows(null);
    } finally {
      setRefineryLoading(false);
    }
  }, [refineryName, refineryYear, refineryPage]);

  const loadGapData = useCallback(async () => {
    setGapLoading(true);
    setGapError("");
    try {
      const response = await getPetroleumDemandSupplyGap({
        product: gapProduct === "" ? undefined : gapProduct,
        year: gapYear === "" ? undefined : gapYear,
      });
      setGapData(response);
    } catch (err) {
      setGapError(getErrorMessage(err));
      setGapData(null);
    } finally {
      setGapLoading(false);
    }
  }, [gapProduct, gapYear]);

  const loadImportCostData = useCallback(async () => {
    setImportLoading(true);
    setImportError("");
    try {
      const response = await getPetroleumImportCosts(
        importYear === "" ? undefined : importYear,
      );
      setImportCostData(response);
    } catch (err) {
      setImportError(getErrorMessage(err));
      setImportCostData(null);
    } finally {
      setImportLoading(false);
    }
  }, [importYear]);

  const loadExplorerData = useCallback(async () => {
    setExplorerLoading(true);
    setExplorerError("");
    try {
      if (explorerDataset === "crude") {
        const rows = await listPetroleumCrudeProduction({
          page: explorerPage,
          year: explorerYear === "" ? undefined : explorerYear,
          company_name: explorerCompany === "" ? undefined : explorerCompany,
          ordering: "-year",
        });
        setExplorerData(rows as PaginatedResponse<ExplorerRow>);
      }

      if (explorerDataset === "refineries") {
        const rows = await listPetroleumRefineryProcessing({
          page: explorerPage,
          year: explorerYear === "" ? undefined : explorerYear,
          refinery_name: explorerRefinery === "" ? undefined : explorerRefinery,
          ordering: "-year",
        });
        setExplorerData(rows as PaginatedResponse<ExplorerRow>);
      }

      if (explorerDataset === "products") {
        const rows = await listPetroleumProductProduction({
          page: explorerPage,
          year: explorerYear === "" ? undefined : explorerYear,
          product: explorerProduct === "" ? undefined : explorerProduct,
          ordering: "-year",
        });
        setExplorerData(rows as PaginatedResponse<ExplorerRow>);
      }

      if (explorerDataset === "trade") {
        const rows = await listPetroleumTrade({
          page: explorerPage,
          year: explorerYear === "" ? undefined : explorerYear,
          product: explorerProduct === "" ? undefined : explorerProduct,
          trade_type:
            explorerTradeType === "" ? undefined : (explorerTradeType as "Import" | "Export"),
          ordering: "-year",
        });
        setExplorerData(rows as PaginatedResponse<ExplorerRow>);
      }

      if (explorerDataset === "snapshot") {
        const rows = await listPetroleumImportExportSnapshot({
          page: explorerPage,
          product: explorerProduct === "" ? undefined : explorerProduct,
          import_export:
            explorerImportExport === ""
              ? undefined
              : (explorerImportExport as "Import" | "Export"),
        });
        setExplorerData(rows as PaginatedResponse<ExplorerRow>);
      }
    } catch (err) {
      setExplorerError(getErrorMessage(err));
      setExplorerData(null);
    } finally {
      setExplorerLoading(false);
    }
  }, [
    explorerDataset,
    explorerPage,
    explorerYear,
    explorerProduct,
    explorerTradeType,
    explorerCompany,
    explorerRefinery,
    explorerImportExport,
  ]);

  useEffect(() => {
    if (activeTab !== "dashboard") return;
    loadDashboardData();
  }, [activeTab, loadDashboardData]);

  useEffect(() => {
    if (activeTab !== "crude") return;
    loadCrudeData();
  }, [activeTab, loadCrudeData]);

  useEffect(() => {
    if (activeTab !== "refinery") return;
    loadRefineryData();
  }, [activeTab, loadRefineryData]);

  useEffect(() => {
    if (activeTab !== "demand-supply") return;
    loadGapData();
  }, [activeTab, loadGapData]);

  useEffect(() => {
    if (activeTab !== "import-costs") return;
    loadImportCostData();
  }, [activeTab, loadImportCostData]);

  useEffect(() => {
    if (activeTab !== "explorer") return;
    loadExplorerData();
  }, [activeTab, loadExplorerData]);

  const gapRows = useMemo(() => {
    if (!gapData) return [];

    const map = new Map<
      string,
      {
        year: number;
        product: string;
        production: number;
        imports: number;
        exports: number;
      }
    >();

    gapData.production.forEach((item) => {
      const key = `${item.product}-${item.year}`;
      map.set(key, {
        year: item.year,
        product: item.product,
        production: item.domestic_production,
        imports: 0,
        exports: 0,
      });
    });

    gapData.imports.forEach((item) => {
      const key = `${item.product}-${item.year}`;
      const current = map.get(key) ?? {
        year: item.year,
        product: item.product,
        production: 0,
        imports: 0,
        exports: 0,
      };
      current.imports = item.import_quantity;
      map.set(key, current);
    });

    gapData.exports.forEach((item) => {
      const key = `${item.product}-${item.year}`;
      const current = map.get(key) ?? {
        year: item.year,
        product: item.product,
        production: 0,
        imports: 0,
        exports: 0,
      };
      current.exports = item.export_quantity;
      map.set(key, current);
    });

    return Array.from(map.values()).sort((a, b) => b.year - a.year);
  }, [gapData]);

  const totalImportBill = useMemo(() => {
    if (!importCostData) return 0;
    return importCostData.import_data.reduce(
      (sum, row) => sum + safeNum(row.total_value_inr),
      0,
    );
  }, [importCostData]);

  const totalImportUsd = useMemo(() => {
    if (!importCostData) return 0;
    return importCostData.import_data.reduce(
      (sum, row) => sum + safeNum(row.total_value_usd),
      0,
    );
  }, [importCostData]);

  const companyOptions = toOptions(filters?.companies ?? []);
  const refineryOptions = toOptions(filters?.refineries ?? []);
  const productionProductOptions = toOptions(filters?.production_products ?? []);
  const tradeProductOptions = toOptions(filters?.trade_products ?? []);

  const allYears = useMemo(() => {
    if (!filters) return [] as number[];
    const merged = [
      ...filters.years.crude_production,
      ...filters.years.refinery_processing,
      ...filters.years.product_production,
      ...filters.years.trade,
    ];
    return Array.from(new Set(merged)).sort((a, b) => b - a);
  }, [filters]);

  const allYearOptions = toYearOptions(allYears);
  const crudeYearOptions = toYearOptions(filters?.years.crude_production ?? []);
  const refineryYearOptions = toYearOptions(filters?.years.refinery_processing ?? []);
  const productYearOptions = toYearOptions(filters?.years.product_production ?? []);
  const tradeYearOptions = toYearOptions(filters?.years.trade ?? []);

  function renderPagination(
    paginated: PaginatedResponse<unknown> | null,
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
  ) {
    if (!paginated || paginated.count === 0) return null;
    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing page {page}
          {paginated.count > 0 ? ` • ${paginated.count} total records` : ""}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!paginated.previous}
          >
            <HiArrowLeft /> Prev
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!paginated.next}
          >
            Next <HiArrowRight />
          </Button>
        </div>
      </div>
    );
  }

  function renderDashboardTab() {
    if (dashboardTradeLoading || filtersLoading) {
      return (
        <div className="space-y-4">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
      );
    }

    if (dashboardTradeError) {
      return (
        <PetroleumErrorCard
          title="Error Loading Petroleum Dashboard"
          message={dashboardTradeError}
          onRetry={loadDashboardData}
        />
      );
    }

    const products = tradeBalanceData?.products ?? [];
    const sortedProducts = [...products].sort(
      (a, b) => safeNum(b.net_quantity) - safeNum(a.net_quantity),
    );
    const importerCount = products.filter((p) => p.status === "net_importer").length;
    const exporterCount = products.filter((p) => p.status === "net_exporter").length;
    const totalImportValue = products.reduce(
      (sum, p) => sum + safeNum(p.import_value_inr_crore),
      0,
    );
    const chartMinWidth = Math.max(1100, sortedProducts.length * 80);
    const tradeChartOptions = {
      animationEnabled: true,
      theme: "light2",
      backgroundColor: "#ffffff",
      title: {
        text: "Trade Balance Trend by Product",
        fontSize: 20,
        fontFamily: "Manrope, sans-serif",
        fontColor: "#1f2937",
      },
      axisX: {
        title: "Products",
        labelAngle: -55,
        labelFontSize: 11,
        labelFontFamily: "Manrope, sans-serif",
        lineColor: "#d1d5db",
        tickColor: "#d1d5db",
        gridThickness: 0,
      },
      axisY: {
        title: "Net Quantity (KMT)",
        labelFontSize: 11,
        labelFontFamily: "Manrope, sans-serif",
        lineColor: "#d1d5db",
        tickColor: "#d1d5db",
        gridColor: "#e5e7eb",
        gridThickness: 1,
        ...({
          labelFormatter: (e: { value: number }) => formatKmt(e.value),
          includeZero: true,
          stripLines: [
            {
              value: 0,
              color: "#9ca3af",
              thickness: 1.2,
            },
          ],
        } as Record<string, unknown>),
      },
      ...({
        toolTip: {
          shared: false,
          contentFormatter: (e: {
            entries?: Array<{
              dataPoint?: {
                label?: string;
                y?: number;
              };
            }>;
          }) => {
            const point = e.entries?.[0]?.dataPoint;
            const yValue = safeNum(point?.y ?? 0);
            const status = yValue < 0 ? "Net Importer" : "Net Exporter";
            return `${point?.label ?? "Unknown"}<br/>${status}: ${formatKmt(yValue)}`;
          },
        },
      } as Record<string, unknown>),
      data: [
        {
          type: "spline",
          lineColor: "#10b981",
          color: "#10b981",
          lineThickness: 2.5,
          markerSize: 6,
          markerType: "circle",
          markerColor: "#059669",
          dataPoints: sortedProducts.map((item) => {
            const netQty = safeNum(item.net_quantity);
            return {
              y: netQty,
              label: item.product,
            };
          }),
        },
      ],
    };

    return (
      <div className="space-y-6">
        <Card variant="elevated">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SearchableSelect
              label="Year Filter"
              value={dashboardYear}
              onChange={(value) => setDashboardYear(value === "" ? "" : Number(value))}
              options={allYearOptions}
              placeholder="All years"
              disabled={filtersLoading || !!filtersError}
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" className="text-center">
            <div className="text-sm text-gray-500 font-medium">Total Import Value</div>
            <div className="text-3xl font-bold text-brand-primary mt-1">
              {formatInrCrore(totalImportValue)}
            </div>
            <div className="text-xs text-gray-500 mt-1">From trade balance products</div>
          </Card>
          <Card variant="elevated" className="text-center">
            <div className="text-sm text-gray-500 font-medium">Net Importer Products</div>
            <div className="text-3xl font-bold text-red-600 mt-1">{importerCount}</div>
          </Card>
          <Card variant="elevated" className="text-center">
            <div className="text-sm text-gray-500 font-medium">Net Exporter Products</div>
            <div className="text-3xl font-bold text-green-600 mt-1">{exporterCount}</div>
          </Card>
        </div>

        <Card variant="elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Trade Balance by Product</h3>
          {sortedProducts.length === 0 ? (
            <div className="text-sm text-gray-500">No trade balance data available.</div>
          ) : (
            <div className="overflow-x-auto">
              <div style={{ minWidth: `${chartMinWidth}px` }}>
                <CanvasJSChart
                  options={{
                    ...tradeChartOptions,
                    height: 420,
                  }}
                />
              </div>
            </div>
          )}
        </Card>

        <Card variant="elevated">
          <h3 className="text-lg font-bold text-brand-primary mb-3">AI Intelligence Briefing</h3>
          {dashboardIntelligenceLoading ? (
            <div className="space-y-3">
              <LoadingSkeleton variant="text" />
              <LoadingSkeleton variant="text" />
              <LoadingSkeleton variant="card" />
            </div>
          ) : dashboardIntelligenceError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700 mb-3">{dashboardIntelligenceError}</p>
              <Button variant="ghost" size="sm" onClick={loadDashboardIntelligenceOnly}>
                Retry AI Intelligence
              </Button>
            </div>
          ) : (
            <>
              <p className="text-gray-800 font-semibold mb-4">
                {intelligenceData?.headline || "No intelligence headline available."}
              </p>
              <div className="space-y-3 mb-4">
                {(intelligenceData?.key_findings ?? []).map((finding) => (
                  <div key={finding.title} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="font-semibold text-gray-900">{finding.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{finding.detail}</div>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Strategic Recommendations</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {(intelligenceData?.strategic_recommendations ?? []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </Card>
      </div>
    );
  }

  function renderCrudeTab() {
    if (crudeLoading || filtersLoading) {
      return (
        <div className="space-y-4">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
      );
    }

    if (crudeError) {
      return (
        <PetroleumErrorCard
          title="Error Loading Crude Oil Data"
          message={crudeError}
          onRetry={loadCrudeData}
        />
      );
    }

    return (
      <div className="space-y-6">
        <Card variant="elevated">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchableSelect
              label="Company"
              value={crudeCompany}
              onChange={(value) => {
                setCrudePage(1);
                setCrudeCompany(value === "" ? "" : String(value));
              }}
              options={companyOptions}
              placeholder="All companies"
              disabled={filtersLoading || !!filtersError}
            />
            <SearchableSelect
              label="Year"
              value={crudeYear}
              onChange={(value) => {
                setCrudePage(1);
                setCrudeYear(value === "" ? "" : Number(value));
              }}
              options={crudeYearOptions}
              placeholder="All years"
              disabled={filtersLoading || !!filtersError}
            />
          </div>
        </Card>

        <Card variant="elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Crude Production Forecast</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="text-xs text-gray-500">Company</div>
              <div className="text-lg font-bold text-brand-primary mt-1">
                {crudeForecastData?.company ?? "All"}
              </div>
            </div>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="text-xs text-gray-500">Trend</div>
              <div className="text-lg font-bold text-gray-900 mt-1 capitalize">
                {crudeForecastData?.forecast?.trend ?? "N/A"}
              </div>
            </div>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="text-xs text-gray-500">Confidence</div>
              <div className="text-lg font-bold text-gray-900 mt-1">
                {crudeForecastData
                  ? `${(safeNum(crudeForecastData.forecast.confidence) * 100).toFixed(0)}%`
                  : "N/A"}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-4">
            {crudeForecastData?.forecast?.analysis || "No AI analysis available."}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-600">Year</th>
                  <th className="text-left py-2 text-gray-600">Historical Quantity</th>
                  <th className="text-left py-2 text-gray-600">Forecast Quantity</th>
                </tr>
              </thead>
              <tbody>
                {crudeForecastData?.historical_data.map((row) => {
                  const forecastMatch = crudeForecastData.forecast.forecast.find(
                    (f) => f.year === row.year,
                  );
                  return (
                    <tr key={`hist-${row.year}`} className="border-b border-gray-100">
                      <td className="py-2 text-gray-800">{row.year}</td>
                      <td className="py-2 text-gray-700">{formatKmt(row.total_quantity)}</td>
                      <td className="py-2 text-gray-700">
                        {forecastMatch ? formatKmt(forecastMatch.predicted_quantity) : "-"}
                      </td>
                    </tr>
                  );
                })}
                {crudeForecastData?.forecast.forecast
                  .filter((f) => !(crudeForecastData.historical_data || []).some((h) => h.year === f.year))
                  .map((f) => (
                    <tr key={`fc-${f.year}`} className="border-b border-gray-100">
                      <td className="py-2 text-gray-800">{f.year}</td>
                      <td className="py-2 text-gray-500">-</td>
                      <td className="py-2 text-brand-primary font-semibold">{formatKmt(f.predicted_quantity)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card variant="elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Crude Production Data</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-600">Month</th>
                  <th className="text-left py-2 text-gray-600">Year</th>
                  <th className="text-left py-2 text-gray-600">Company</th>
                  <th className="text-left py-2 text-gray-600">Quantity (000 MT)</th>
                </tr>
              </thead>
              <tbody>
                {(crudeRows?.results ?? []).map((row) => (
                  <tr key={row.id} className="border-b border-gray-100">
                    <td className="py-2">{row.month}</td>
                    <td className="py-2">{row.year}</td>
                    <td className="py-2">{row.company_name}</td>
                    <td className="py-2">{formatNumber(row.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination(crudeRows, crudePage, setCrudePage)}
        </Card>
      </div>
    );
  }

  function renderRefineryTab() {
    if (refineryLoading || filtersLoading) {
      return (
        <div className="space-y-4">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
      );
    }

    if (refineryError) {
      return (
        <PetroleumErrorCard
          title="Error Loading Refinery Analysis"
          message={refineryError}
          onRetry={loadRefineryData}
        />
      );
    }

    const maxYearly = Math.max(
      ...(refineryAnalysisData?.yearly_trends.map((row) => safeNum(row.total_processed)) ?? [1]),
      1,
    );

    return (
      <div className="space-y-6">
        <Card variant="elevated">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchableSelect
              label="Refinery"
              value={refineryName}
              onChange={(value) => {
                setRefineryPage(1);
                setRefineryName(value === "" ? "" : String(value));
              }}
              options={refineryOptions}
              placeholder="All refineries"
              disabled={filtersLoading || !!filtersError}
            />
            <SearchableSelect
              label="Year"
              value={refineryYear}
              onChange={(value) => {
                setRefineryPage(1);
                setRefineryYear(value === "" ? "" : Number(value));
              }}
              options={refineryYearOptions}
              placeholder="All years"
              disabled={filtersLoading || !!filtersError}
            />
          </div>
        </Card>

        <Card variant="elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Yearly Processing Trends</h3>
          <div className="space-y-3">
            {(refineryAnalysisData?.yearly_trends ?? []).map((trend) => {
              const widthPct = (safeNum(trend.total_processed) / maxYearly) * 100;
              return (
                <div key={`${trend.refinery_name}-${trend.year}`}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">
                      {trend.refinery_name} ({trend.year})
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatKmt(trend.total_processed)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary" style={{ width: `${Math.max(widthPct, 4)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card variant="elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Seasonal Pattern</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(refineryAnalysisData?.seasonal_pattern ?? []).map((point) => (
              <div key={point.month} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-500">{point.month}</div>
                <div className="text-base font-semibold text-gray-900">{formatKmt(point.avg_quantity)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Raw Refinery Processing Data</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-600">Month</th>
                  <th className="text-left py-2 text-gray-600">Year</th>
                  <th className="text-left py-2 text-gray-600">Refinery</th>
                  <th className="text-left py-2 text-gray-600">Qty (000 MT)</th>
                </tr>
              </thead>
              <tbody>
                {(refineryRows?.results ?? []).map((row) => (
                  <tr key={row.id} className="border-b border-gray-100">
                    <td className="py-2">{row.month}</td>
                    <td className="py-2">{row.year}</td>
                    <td className="py-2">{row.refinery_name}</td>
                    <td className="py-2">{formatNumber(row.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination(refineryRows, refineryPage, setRefineryPage)}
        </Card>
      </div>
    );
  }

  function renderDemandSupplyTab() {
    if (gapLoading || filtersLoading) {
      return (
        <div className="space-y-4">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
      );
    }

    if (gapError) {
      return (
        <PetroleumErrorCard
          title="Error Loading Demand-Supply Gap"
          message={gapError}
          onRetry={loadGapData}
        />
      );
    }

    const latest = gapRows[0];
    const production = latest?.production ?? 0;
    const imports = latest?.imports ?? 0;
    const exports = latest?.exports ?? 0;

    return (
      <div className="space-y-6">
        <Card variant="elevated">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchableSelect
              label="Product"
              value={gapProduct}
              onChange={(value) => setGapProduct(value === "" ? "" : String(value))}
              options={productionProductOptions}
              placeholder="All products"
              disabled={filtersLoading || !!filtersError}
            />
            <SearchableSelect
              label="Year"
              value={gapYear}
              onChange={(value) => setGapYear(value === "" ? "" : Number(value))}
              options={productYearOptions}
              placeholder="All years"
              disabled={filtersLoading || !!filtersError}
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" className="text-center">
            <div className="text-sm text-gray-500">Domestic Production</div>
            <div className="text-3xl font-bold text-brand-primary mt-1">{formatKmt(production)}</div>
          </Card>
          <Card variant="elevated" className="text-center">
            <div className="text-sm text-gray-500">Imports</div>
            <div className="text-3xl font-bold text-red-600 mt-1">{formatKmt(imports)}</div>
          </Card>
          <Card variant="elevated" className="text-center">
            <div className="text-sm text-gray-500">Exports</div>
            <div className="text-3xl font-bold text-green-600 mt-1">{formatKmt(exports)}</div>
          </Card>
        </div>

        <Card variant="elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Yearly Gap View</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-600">Year</th>
                  <th className="text-left py-2 text-gray-600">Product</th>
                  <th className="text-left py-2 text-gray-600">Produced</th>
                  <th className="text-left py-2 text-gray-600">Imported</th>
                  <th className="text-left py-2 text-gray-600">Exported</th>
                  <th className="text-left py-2 text-gray-600">Gap (P+I-E)</th>
                </tr>
              </thead>
              <tbody>
                {gapRows.map((row) => {
                  const gap = row.production + row.imports - row.exports;
                  return (
                    <tr key={`${row.product}-${row.year}`} className="border-b border-gray-100">
                      <td className="py-2">{row.year}</td>
                      <td className="py-2">{row.product}</td>
                      <td className="py-2">{formatKmt(row.production)}</td>
                      <td className="py-2">{formatKmt(row.imports)}</td>
                      <td className="py-2">{formatKmt(row.exports)}</td>
                      <td className="py-2 font-semibold text-gray-900">{formatKmt(gap)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  function renderImportCostsTab() {
    if (importLoading || filtersLoading) {
      return (
        <div className="space-y-4">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
      );
    }

    if (importError) {
      return (
        <PetroleumErrorCard
          title="Error Loading Import Cost Analysis"
          message={importError}
          onRetry={loadImportCostData}
        />
      );
    }

    return (
      <div className="space-y-6">
        <Card variant="elevated">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchableSelect
              label="Year"
              value={importYear}
              onChange={(value) => setImportYear(value === "" ? "" : Number(value))}
              options={tradeYearOptions}
              placeholder="All years"
              disabled={filtersLoading || !!filtersError}
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" className="text-center">
            <div className="text-sm text-gray-500">Total Import Bill</div>
            <div className="text-2xl font-bold text-brand-primary mt-1">{formatInrCrore(totalImportBill)}</div>
          </Card>
          <Card variant="elevated" className="text-center">
            <div className="text-sm text-gray-500">USD Equivalent</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{formatUsdMillion(totalImportUsd)}</div>
          </Card>
          <Card variant="elevated" className="text-center">
            <div className="text-sm text-gray-500">Records</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{importCostData?.import_data.length ?? 0}</div>
          </Card>
        </div>

        <Card variant="elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Import Data by Product</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-600">Year</th>
                  <th className="text-left py-2 text-gray-600">Product</th>
                  <th className="text-left py-2 text-gray-600">Quantity</th>
                  <th className="text-left py-2 text-gray-600">INR Crore</th>
                  <th className="text-left py-2 text-gray-600">USD Million</th>
                </tr>
              </thead>
              <tbody>
                {(importCostData?.import_data ?? []).map((item) => (
                  <tr key={`${item.year}-${item.product}`} className="border-b border-gray-100">
                    <td className="py-2">{item.year}</td>
                    <td className="py-2">{item.product}</td>
                    <td className="py-2">{formatKmt(item.total_quantity)}</td>
                    <td className="py-2">{formatInrCrore(item.total_value_inr)}</td>
                    <td className="py-2">{formatUsdMillion(item.total_value_usd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card variant="elevated">
          <h3 className="text-lg font-bold text-brand-primary mb-4">AI Forecast and Risk Signals</h3>
          {importCostData?.ai_forecast.error ? (
            <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 text-orange-700">
              {importCostData.ai_forecast.error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {(importCostData?.ai_forecast.forecast ?? []).map((f) => (
                  <div key={f.year} className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                    <div className="text-sm text-gray-600">{f.year}</div>
                    <div className="text-xl font-bold text-brand-primary mt-1">
                      {formatInrCrore(f.estimated_bill_inr_crore)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {formatUsdMillion(f.estimated_bill_usd_million)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Drivers</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {(importCostData?.ai_forecast.key_drivers ?? []).map((driver) => (
                      <li key={driver}>{driver}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Risk Factors</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {(importCostData?.ai_forecast.risk_factors ?? []).map((risk) => (
                      <li key={risk}>{risk}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-4 leading-relaxed">
                {importCostData?.ai_forecast.analysis}
              </p>
            </>
          )}
        </Card>
      </div>
    );
  }

  function renderExplorerTable() {
    if (!explorerData) {
      return <div className="text-sm text-gray-500">No records.</div>;
    }

    if (explorerDataset === "crude") {
      const rows = explorerData.results as PetroleumCrudeProductionRecord[];
      return (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-600">Month</th>
              <th className="text-left py-2 text-gray-600">Year</th>
              <th className="text-left py-2 text-gray-600">Company</th>
              <th className="text-left py-2 text-gray-600">Qty (000 MT)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100">
                <td className="py-2">{row.month}</td>
                <td className="py-2">{row.year}</td>
                <td className="py-2">{row.company_name}</td>
                <td className="py-2">{formatNumber(row.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (explorerDataset === "refineries") {
      const rows = explorerData.results as PetroleumRefineryProcessingRecord[];
      return (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-600">Month</th>
              <th className="text-left py-2 text-gray-600">Year</th>
              <th className="text-left py-2 text-gray-600">Refinery</th>
              <th className="text-left py-2 text-gray-600">Qty (000 MT)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100">
                <td className="py-2">{row.month}</td>
                <td className="py-2">{row.year}</td>
                <td className="py-2">{row.refinery_name}</td>
                <td className="py-2">{formatNumber(row.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (explorerDataset === "products") {
      const rows = explorerData.results as PetroleumProductProductionRecord[];
      return (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-600">Month</th>
              <th className="text-left py-2 text-gray-600">Year</th>
              <th className="text-left py-2 text-gray-600">Product</th>
              <th className="text-left py-2 text-gray-600">Qty (000 MT)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100">
                <td className="py-2">{row.month}</td>
                <td className="py-2">{row.year}</td>
                <td className="py-2">{row.product}</td>
                <td className="py-2">{formatNumber(row.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (explorerDataset === "trade") {
      const rows = explorerData.results as PetroleumTradeRecord[];
      return (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-600">Product</th>
              <th className="text-left py-2 text-gray-600">Type</th>
              <th className="text-left py-2 text-gray-600">Month</th>
              <th className="text-left py-2 text-gray-600">Year</th>
              <th className="text-left py-2 text-gray-600">Qty (000 MT)</th>
              <th className="text-left py-2 text-gray-600">INR Cr</th>
              <th className="text-left py-2 text-gray-600">USD Mn</th>
              <th className="text-left py-2 text-gray-600">Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100">
                <td className="py-2">{row.product}</td>
                <td className="py-2">{row.trade_type}</td>
                <td className="py-2">{MONTH_NAMES[row.month] || row.month}</td>
                <td className="py-2">{row.year}</td>
                <td className="py-2">{formatNumber(row.quantity)}</td>
                <td className="py-2">{formatNumber(row.value_inr_crore)}</td>
                <td className="py-2">{formatNumber(row.value_usd_million)}</td>
                <td className="py-2">{formatDate(row.date_updated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    const rows = explorerData.results as PetroleumImportExportSnapshotRecord[];
    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 text-gray-600">Type</th>
            <th className="text-left py-2 text-gray-600">Product</th>
            <th className="text-left py-2 text-gray-600">Total (000 MT)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="py-2">{row.import_export}</td>
              <td className="py-2">{row.product}</td>
              <td className="py-2">{formatNumber(row.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function renderExplorerTab() {
    if (explorerLoading || filtersLoading) {
      return (
        <div className="space-y-4">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
      );
    }

    if (explorerError) {
      return (
        <PetroleumErrorCard
          title="Error Loading Data Explorer"
          message={explorerError}
          onRetry={loadExplorerData}
        />
      );
    }

    return (
      <div className="space-y-6">
        <Card variant="elevated">
          <div className="flex flex-wrap gap-2 mb-4">
            {EXPLORER_DATASETS.map((set) => (
              <button
                key={set.key}
                type="button"
                onClick={() => {
                  setExplorerPage(1);
                  setExplorerDataset(set.key);
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium border ${
                  explorerDataset === set.key
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:border-brand-accent"
                }`}
              >
                {set.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(explorerDataset === "crude" || explorerDataset === "refineries" || explorerDataset === "products" || explorerDataset === "trade") && (
              <SearchableSelect
                label="Year"
                value={explorerYear}
                onChange={(value) => {
                  setExplorerPage(1);
                  setExplorerYear(value === "" ? "" : Number(value));
                }}
                options={allYearOptions}
                placeholder="All years"
                disabled={filtersLoading || !!filtersError}
              />
            )}

            {explorerDataset === "crude" && (
              <SearchableSelect
                label="Company"
                value={explorerCompany}
                onChange={(value) => {
                  setExplorerPage(1);
                  setExplorerCompany(value === "" ? "" : String(value));
                }}
                options={companyOptions}
                placeholder="All companies"
                disabled={filtersLoading || !!filtersError}
              />
            )}

            {explorerDataset === "refineries" && (
              <SearchableSelect
                label="Refinery"
                value={explorerRefinery}
                onChange={(value) => {
                  setExplorerPage(1);
                  setExplorerRefinery(value === "" ? "" : String(value));
                }}
                options={refineryOptions}
                placeholder="All refineries"
                disabled={filtersLoading || !!filtersError}
              />
            )}

            {(explorerDataset === "products" || explorerDataset === "trade" || explorerDataset === "snapshot") && (
              <SearchableSelect
                label="Product"
                value={explorerProduct}
                onChange={(value) => {
                  setExplorerPage(1);
                  setExplorerProduct(value === "" ? "" : String(value));
                }}
                options={
                  explorerDataset === "products"
                    ? productionProductOptions
                    : tradeProductOptions
                }
                placeholder="All products"
                disabled={filtersLoading || !!filtersError}
              />
            )}

            {explorerDataset === "trade" && (
              <SearchableSelect
                label="Trade Type"
                value={explorerTradeType}
                onChange={(value) => {
                  setExplorerPage(1);
                  setExplorerTradeType(value === "" ? "" : String(value));
                }}
                options={[
                  { value: "Import", label: "Import" },
                  { value: "Export", label: "Export" },
                ]}
                placeholder="All types"
              />
            )}

            {explorerDataset === "snapshot" && (
              <SearchableSelect
                label="Import / Export"
                value={explorerImportExport}
                onChange={(value) => {
                  setExplorerPage(1);
                  setExplorerImportExport(value === "" ? "" : String(value));
                }}
                options={[
                  { value: "Import", label: "Import" },
                  { value: "Export", label: "Export" },
                ]}
                placeholder="All"
              />
            )}
          </div>
        </Card>

        <Card variant="elevated">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Dataset Records</h3>
          <div className="overflow-x-auto">{renderExplorerTable()}</div>
          {renderPagination(explorerData, explorerPage, setExplorerPage)}
        </Card>
      </div>
    );
  }

  return (
    <PetroleumLayout>
      <div className="p-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">
              Petroleum Sector Intelligence
            </h1>
            <p className="text-gray-600 text-lg">
              Monitor production, trade, demand-supply gaps and AI-driven market insights.
            </p>
          </div>

          {filtersError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              Unable to load petroleum filters: {filtersError}
            </div>
          )}

          {activeTab === "dashboard" && renderDashboardTab()}
          {activeTab === "crude" && renderCrudeTab()}
          {activeTab === "refinery" && renderRefineryTab()}
          {activeTab === "demand-supply" && renderDemandSupplyTab()}
          {activeTab === "import-costs" && renderImportCostsTab()}
          {activeTab === "explorer" && renderExplorerTab()}
        </div>
      </div>
    </PetroleumLayout>
  );
}
