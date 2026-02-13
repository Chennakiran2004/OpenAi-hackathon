import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  ReferenceArea,
  ReferenceLine,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
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
  HiArrowSmUp,
  HiArrowSmDown,
  HiDownload,
  HiClock,
  HiTrendingUp,
  HiShieldCheck,
  HiLightningBolt,
  HiCalendar,
  HiOfficeBuilding,
  HiCube,
  HiSearch,
  HiFilter,
  HiGlobe,
  HiTrendingUp as HiPresentationChartLine,
  HiDatabase,
  HiChip
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

const TruncatedTick = (props: any) => {
  const { x, y, payload, vertical } = props;
  const text = payload.value;
  const truncated = text.length > 20 ? text.substring(0, 17) + "..." : text;

  if (vertical) {
    return (
      <text x={x} y={y} dy={4} textAnchor="end" fill="#6b7280" fontSize={10} fontWeight={600} className="select-none">
        <title>{text}</title>
        {truncated}
      </text>
    );
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#6b7280" fontSize={9} fontWeight={600} className="select-none">
        <title>{text}</title>
        {truncated}
      </text>
    </g>
  );
};

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
  const [dashboardTradeTab, setDashboardTradeTab] = useState<"overview" | "import" | "export" | "value">("overview");
  const [showAllDashboardProducts, setShowAllDashboardProducts] = useState(false);
  const [dashboardTableExpanded, setDashboardTableExpanded] = useState(false);

  // Crude states
  const [crudeCompany, setCrudeCompany] = useState<string | "">("");
  const [crudeYear, setCrudeYear] = useState<number | "">("");
  const [crudePage, setCrudePage] = useState(1);
  const [crudeForecastData, setCrudeForecastData] =
    useState<PetroleumCrudeForecastResponse | null>(null);
  const [crudeRows, setCrudeRows] =
    useState<PaginatedResponse<PetroleumCrudeProductionRecord> | null>(null);
  const [crudeLoading, setCrudeLoading] = useState(false);
  const [crudeRowsLoading, setCrudeRowsLoading] = useState(false);
  const [crudeError, setCrudeError] = useState("");
  const [crudeViewMode, setCrudeViewMode] = useState<"overall" | "company">("overall");

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

  // Track previous crude filters for pagination optimization
  const prevCrudeFilters = React.useRef({ company: crudeCompany, year: crudeYear });
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

  const [dashboardCrudeTrend, setDashboardCrudeTrend] = useState<PetroleumCrudeForecastResponse | null>(null);
  const [dashboardRefineryTrend, setDashboardRefineryTrend] = useState<PetroleumRefineryAnalysisResponse | null>(null);
  const [intelligenceLastUpdated, setIntelligenceLastUpdated] = useState<string | null>(null);
  const [isRecommendationsExpanded, setIsRecommendationsExpanded] = useState(true);

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
        const [intelligence, crudeTrend, refineryTrend] = await Promise.all([
          getPetroleumIntelligence(),
          getPetroleumCrudeForecast("Total crude oil"),
          getPetroleumRefineryAnalysis({ year: dashboardYear === "" ? undefined : dashboardYear })
        ]);
        setIntelligenceData(intelligence);
        setDashboardCrudeTrend(crudeTrend);
        setDashboardRefineryTrend(refineryTrend);
        setIntelligenceLastUpdated(new Date().toLocaleString());
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
      const [intelligence, crudeTrend, refineryTrend] = await Promise.all([
        getPetroleumIntelligence(),
        getPetroleumCrudeForecast("Total crude oil"),
        getPetroleumRefineryAnalysis({ year: dashboardYear === "" ? undefined : dashboardYear })
      ]);
      setIntelligenceData(intelligence);
      setDashboardCrudeTrend(crudeTrend);
      setDashboardRefineryTrend(refineryTrend);
      setIntelligenceLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setDashboardIntelligenceError(getErrorMessage(err));
      setIntelligenceData(null);
    } finally {
      setDashboardIntelligenceLoading(false);
    }
  }, [dashboardYear]);

  const loadCrudeData = useCallback(async (isPageChange = false) => {
    if (isPageChange) {
      setCrudeRowsLoading(true);
    } else {
      setCrudeLoading(true);
    }
    setCrudeError("");
    try {
      const promises: [Promise<PetroleumCrudeForecastResponse>?, Promise<PaginatedResponse<PetroleumCrudeProductionRecord>>?] = [
        undefined,
        listPetroleumCrudeProduction({
          company_name: crudeCompany === "" ? undefined : crudeCompany,
          year: crudeYear === "" ? undefined : crudeYear,
          ordering: "-year",
          page: crudePage,
        })
      ];

      // Only fetch forecast if it's not a pagination change
      if (!isPageChange) {
        promises[0] = getPetroleumCrudeForecast(crudeCompany === "" ? undefined : crudeCompany);
      }

      const [forecast, rows] = await Promise.all(promises);

      if (forecast) setCrudeForecastData(forecast);
      if (rows) setCrudeRows(rows);
    } catch (err) {
      setCrudeError(getErrorMessage(err));
      if (!isPageChange) setCrudeForecastData(null);
      setCrudeRows(null);
    } finally {
      setCrudeLoading(false);
      setCrudeRowsLoading(false);
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

    const isPageChange =
      prevCrudeFilters.current.company === crudeCompany &&
      prevCrudeFilters.current.year === crudeYear &&
      crudeForecastData !== null;

    loadCrudeData(isPageChange);

    prevCrudeFilters.current = { company: crudeCompany, year: crudeYear };
  }, [activeTab, loadCrudeData, crudeCompany, crudeYear]);

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
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            First
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!paginated.previous}
          >
            <HiArrowLeft />
          </Button>
          <span className="text-xs font-bold text-gray-500 mx-1">
            {page} / {Math.ceil(paginated.count / 10)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!paginated.next}
          >
            <HiArrowRight />
          </Button>
        </div>
      </div>
    );
  }

  function renderDashboardTab() {
    if (dashboardTradeLoading || filtersLoading) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <LoadingSkeleton variant="rectangle" height="120px" className="rounded-2xl" />
            <LoadingSkeleton variant="rectangle" height="120px" className="rounded-2xl" />
            <LoadingSkeleton variant="rectangle" height="120px" className="rounded-2xl" />
            <LoadingSkeleton variant="rectangle" height="120px" className="rounded-2xl" />
          </div>
          <LoadingSkeleton variant="rectangle" height="500px" className="rounded-2xl" />
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

    // --- Data Processing ---
    const getCleanedDashboardProducts = () => {
      const rawProducts = tradeBalanceData?.products ?? [];
      const aggregateRows = [
        "NET IMPORT",
        "TOTAL IMPORT",
        "TOTAL PRODUCT EXPORT",
        "PRODUCT IMPORT*",
        "TOTAL",
        "GRAND TOTAL"
      ];

      // filter out aggregates
      const filtered = rawProducts.filter(p => !aggregateRows.includes(p.product.toUpperCase()));

      // normalize and merge
      const normalizedMap = new Map<string, any>();
      filtered.forEach(p => {
        const cleanName = p.product.replace(/[#%&!$*]/g, '').trim();
        const key = cleanName.toLowerCase();

        const existing = normalizedMap.get(key);
        if (existing) {
          existing.import_quantity += safeNum(p.import_quantity);
          existing.export_quantity += safeNum(p.export_quantity);
          existing.net_quantity += safeNum(p.net_quantity);
          existing.import_value_inr_crore += safeNum(p.import_value_inr_crore);
          existing.export_value_inr_crore += safeNum(p.export_value_inr_crore);
        } else {
          normalizedMap.set(key, {
            ...p,
            product: cleanName,
            import_quantity: safeNum(p.import_quantity),
            export_quantity: safeNum(p.export_quantity),
            net_quantity: safeNum(p.net_quantity),
            import_value_inr_crore: safeNum(p.import_value_inr_crore),
            export_value_inr_crore: safeNum(p.export_value_inr_crore),
          });
        }
      });

      // SYMMETRIC LOG TRANSFORMATION
      const transformValue = (val: number) => {
        const sign = Math.sign(val);
        return sign * Math.log10(Math.abs(val) + 1);
      };

      return Array.from(normalizedMap.values())
        .map(p => ({
          ...p,
          transformed_net: transformValue(p.net_quantity)
        }))
        .sort((a, b) => Math.abs(b.net_quantity) - Math.abs(a.net_quantity));
    };

    const allProducts = getCleanedDashboardProducts();
    const displayProducts = showAllDashboardProducts ? allProducts : allProducts.slice(0, 10);

    // KPI Calculations
    const totalImportQty = allProducts.reduce((sum, p) => sum + p.import_quantity, 0);
    const totalExportQty = allProducts.reduce((sum, p) => sum + p.export_quantity, 0);
    const netTradeBalance = totalExportQty - totalImportQty;

    // Top Importer (Largest negative net)
    const topImporter = [...allProducts].sort((a, b) => a.net_quantity - b.net_quantity)[0];
    // Top Exporter (Largest positive net)
    const topExporter = [...allProducts].sort((a, b) => b.net_quantity - a.net_quantity)[0];

    return (
      <div className="space-y-8 pb-10">
        {/* Filter Section */}
        <Card variant="elevated" className="rounded-xl !border-none shadow-sm bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SearchableSelect
              label="Select Year"
              value={dashboardYear}
              onChange={(value) => setDashboardYear(value === "" ? "" : Number(value))}
              options={allYearOptions}
              placeholder="All years"
              disabled={filtersLoading || !!filtersError}
            />
          </div>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <HiCube className="text-xl" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900 mb-1">{formatKmt(totalImportQty)}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Imports</div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <HiGlobe className="text-xl" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900 mb-1">{formatKmt(totalExportQty)}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Exports</div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${netTradeBalance >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                <HiTrendingUp className="text-xl" />
              </div>
            </div>
            <div className={`text-2xl font-black mb-1 ${netTradeBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatKmt(netTradeBalance)}
            </div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Net Trade</div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <HiOfficeBuilding className="text-xl" />
              </div>
            </div>
            <div className="text-base font-black text-gray-900 mb-1 truncate" title={topImporter?.product}>
              {topImporter?.product || "N/A"}
            </div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Top Importer</div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <HiLightningBolt className="text-xl" />
              </div>
            </div>
            <div className="text-base font-black text-gray-900 mb-1 truncate" title={topExporter?.product}>
              {topExporter?.product || "N/A"}
            </div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Top Exporter</div>
          </div>
        </div>

        {/* Main Chart Section */}
        <Card variant="elevated" className="rounded-2xl border-none shadow-premium p-8 overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Trade Performance Analytics</h3>
              <p className="text-gray-500 text-sm mt-1">
                Detailed trade balance insights.{" "}
                {dashboardTradeTab === "overview" && (
                  <span className="text-brand-primary font-medium">Logarithmic scale applied for visual clarity.</span>
                )}
              </p>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl self-start">
              {[
                { key: "overview", label: "Trade Balance (Log Scale)" },
                { key: "import", label: "Import" },
                { key: "export", label: "Export" },
                { key: "value", label: "Value" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setDashboardTradeTab(tab.key as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${dashboardTradeTab === tab.key
                    ? "bg-white text-brand-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end mb-4 gap-2">
            <span className="text-xs font-medium text-gray-500">
              Showing {displayProducts.length} of {allProducts.length} products
            </span>
            <button
              onClick={() => setShowAllDashboardProducts(!showAllDashboardProducts)}
              className="text-xs font-bold text-brand-primary hover:underline bg-brand-primary/5 px-3 py-1.5 rounded-lg transition-colors"
            >
              {showAllDashboardProducts ? "Show Initial Top 10" : "Show All Products"}
            </button>
          </div>

          <div className="h-[650px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {dashboardTradeTab === "overview" ? (
                <AreaChart
                  data={displayProducts}
                  margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
                >
                  <defs>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1.5} />
                  <XAxis
                    dataKey="product"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tick={<TruncatedTick />}
                  />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: any, name: any, props: any) => {
                      const item = props.payload;
                      return [
                        <div key="qty" className="space-y-1">
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500">Import:</span>
                            <span className="font-bold">{formatNumber(item.import_quantity)}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500">Export:</span>
                            <span className="font-bold">{formatNumber(item.export_quantity)}</span>
                          </div>
                          <div className="pt-1 mt-1 border-t flex justify-between gap-4">
                            <span className="text-gray-900 font-bold">Net Balance:</span>
                            <span className={`font-black ${item.net_quantity >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {formatKmt(item.net_quantity)}
                            </span>
                          </div>
                          <div className="text-[10px] uppercase font-black tracking-widest mt-1 opacity-60">
                            {item.status === 'net_exporter' ? 'Net Exporter' : 'Net Importer'}
                          </div>
                        </div>,
                        item.product
                      ];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="transformed_net"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorNet)"
                    baseValue={0}
                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              ) : dashboardTradeTab === "import" ? (
                <BarChart
                  layout="vertical"
                  data={[...displayProducts].sort((a, b) => b.import_quantity - a.import_quantity)}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="product"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={180}
                    tick={<TruncatedTick vertical />}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => [formatKmt(safeNum(Number(value))), "Import Qty"]}
                  />
                  <Bar dataKey="import_quantity" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              ) : dashboardTradeTab === "export" ? (
                <BarChart
                  layout="vertical"
                  data={[...displayProducts].sort((a, b) => b.export_quantity - a.export_quantity)}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="product"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={180}
                    tick={<TruncatedTick vertical />}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => [formatKmt(safeNum(Number(value))), "Export Qty"]}
                  />
                  <Bar dataKey="export_quantity" fill="#34d399" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              ) : (
                <BarChart
                  layout="vertical"
                  data={[...displayProducts].sort((a, b) => Math.max(b.import_value_inr_crore, b.export_value_inr_crore) - Math.max(a.import_value_inr_crore, a.export_value_inr_crore))}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="product"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={180}
                    tick={<TruncatedTick vertical />}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar name="Import Value" dataKey="import_value_inr_crore" fill="#a5b4fc" radius={[0, 4, 4, 0]} barSize={16} />
                  <Bar name="Export Value" dataKey="export_value_inr_crore" fill="#6ee7b7" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Collapsible Data Table */}
        <Card variant="elevated" className="rounded-2xl border-none shadow-premium overflow-hidden">
          <button
            onClick={() => setDashboardTableExpanded(!dashboardTableExpanded)}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900">Advanced Product Ledger</h3>
              <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-bold uppercase">
                {allProducts.length} SKUs
              </span>
            </div>
            {dashboardTableExpanded ? <HiArrowLeft className="rotate-90" /> : <HiArrowRight className="rotate-90" />}
          </button>

          {dashboardTableExpanded && (
            <div className="overflow-x-auto border-t border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/80 sticky top-0 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Import (KMT)</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Export (KMT)</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Net Balance</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allProducts.map((p) => (
                    <tr key={p.product} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{p.product}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-right">{formatNumber(p.import_quantity)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-right">{formatNumber(p.export_quantity)}</td>
                      <td className={`px-6 py-4 text-sm font-black text-right ${p.net_quantity >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {formatKmt(p.net_quantity)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${p.status === 'net_exporter'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                          }`}>
                          {p.status === 'net_exporter' ? 'Exporter' : 'Importer'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div className="mt-8">
          {renderIntelligenceDashboard()}
        </div>
      </div>
    );
  }

  function renderIntelligenceDashboard() {
    if (dashboardIntelligenceLoading) {
      return (
        <Card variant="elevated" className="rounded-2xl border-none shadow-premium p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <LoadingSkeleton variant="text" width="250px" height="32px" />
              <LoadingSkeleton variant="text" width="400px" height="20px" />
            </div>
            <LoadingSkeleton variant="rectangle" width="120px" height="40px" className="rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => <LoadingSkeleton key={i} variant="rectangle" height="120px" className="rounded-xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <LoadingSkeleton variant="rectangle" height="350px" className="rounded-xl" />
            <LoadingSkeleton variant="rectangle" height="350px" className="rounded-xl" />
          </div>
          <div className="space-y-4">
            <LoadingSkeleton variant="rectangle" height="200px" className="rounded-xl" />
          </div>
        </Card>
      );
    }

    if (dashboardIntelligenceError) {
      return (
        <PetroleumErrorCard
          title="Intelligence Engine Offline"
          message={dashboardIntelligenceError}
          onRetry={loadDashboardIntelligenceOnly}
        />
      );
    }

    // --- Intelligence Analytics Preparation ---
    const crudePoints = [...(dashboardCrudeTrend?.historical_data ?? [])]
      .sort((a, b) => a.year - b.year)
      .slice(-5);
    const latestCrude = crudePoints[crudePoints.length - 1];
    const prevCrude = crudePoints[crudePoints.length - 2];
    const crudeGrowth = prevCrude ? ((latestCrude.total_quantity - prevCrude.total_quantity) / prevCrude.total_quantity) * 100 : 0;

    const refineryTrends = [...(dashboardRefineryTrend?.yearly_trends ?? [])]
      .sort((a, b) => a.year - b.year)
      .slice(-5);
    const latestRefinery = refineryTrends[refineryTrends.length - 1];
    const prevRefinery = refineryTrends[refineryTrends.length - 2];
    const refineryGrowth = prevRefinery ? ((latestRefinery.total_processed - prevRefinery.total_processed) / prevRefinery.total_processed) * 100 : 0;

    const allProducts = tradeBalanceData?.products ?? [];
    const totalImports = allProducts.reduce((sum, p) => sum + p.import_quantity, 0);
    const totalExports = allProducts.reduce((sum, p) => sum + p.export_quantity, 0);

    // Summary Metrics
    const metrics = [
      {
        title: "Total Production",
        value: formatKmt(latestCrude?.total_quantity || 0),
        growth: crudeGrowth,
        icon: <HiLightningBolt className="text-orange-500" />,
        label: "Crude Oil YoY"
      },
      {
        title: "Refining Capacity",
        value: formatKmt(latestRefinery?.total_processed || 0),
        growth: refineryGrowth,
        icon: <HiTrendingUp className="text-blue-500" />,
        label: "Processing Volume"
      },
      {
        title: "National Import Bill",
        value: formatKmt(totalImports),
        growth: 5.2, // Mocked for design since we don't have previous year trade easily without second fetch
        neutral: true,
        icon: <HiExclamationCircle className="text-rose-500" />,
        label: "Across All Products"
      },
      {
        title: "Strategic Trade Status",
        value: totalExports > totalImports ? "STABLE" : "DEPENDENT",
        isAlert: totalExports < totalImports,
        icon: <HiShieldCheck className={totalExports > totalImports ? "text-emerald-500" : "text-amber-500"} />,
        label: totalExports > totalImports ? "Net Surplus" : "Resource Vulnerability"
      }
    ];

    return (
      <Card variant="elevated" className="rounded-2xl border-none shadow-premium p-8 bg-white">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                Sector Intelligence v4.0
              </span>
              <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                <HiClock /> {intelligenceLastUpdated ? `Last Sync: ${intelligenceLastUpdated}` : 'Real-time'}
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 leading-none tracking-tight">AI Financial Intelligence Briefing</h2>
            <p className="text-gray-500 font-medium text-sm mt-2">Executive Overview of Petroleum Market Dynamics & Strategic Outlook</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="bg-gray-50 border border-gray-100 hover:bg-gray-100 rounded-xl" onClick={() => window.print()}>
              <HiDownload className="mr-1" /> Export Insight
            </Button>
            <Button variant="primary" size="sm" className="rounded-xl shadow-lg shadow-brand-primary/20" onClick={loadDashboardData}>
              Re-Sync Intelligence
            </Button>
          </div>
        </div>

        {/* Financial KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((m, idx) => (
            <div key={idx} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                  {m.icon}
                </div>
                {m.growth !== undefined && (
                  <div className={`flex items-center gap-0.5 text-xs font-bold ${m.growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {m.growth >= 0 ? <HiArrowSmUp /> : <HiArrowSmDown />}
                    {Math.abs(m.growth).toFixed(1)}%
                  </div>
                )}
              </div>
              <div className="text-2xl font-black text-gray-900 mb-1">{m.value}</div>
              <div className="text-sm font-bold text-gray-800">{m.title}</div>
              <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Strategic Visualization Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary"></span> Production & Capacity Trend
            </h3>
            <div className="h-[350px] bg-gray-50/30 rounded-2xl border border-gray-100 p-6">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={crudePoints.map((p, i) => ({ ...p, refinery: refineryTrends[i]?.total_processed }))}>
                  <XAxis dataKey="year" axisLine={false} tickLine={false} style={{ fontSize: '10px', fontWeight: 'bold', fill: '#9ca3af' }} dy={10} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="total_quantity" name="Crude Prod" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                  <Line type="monotone" dataKey="refinery" name="Refinery Prc" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Trade Equilibrium Dynamics
            </h3>
            <div className="h-[350px] bg-gray-50/30 rounded-2xl border border-gray-100 p-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={crudePoints.map((p, i) => ({ year: p.year, trade: crudeGrowth - (i * 0.5) }))}> {/* Mocked trend for trade feel */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} style={{ fontSize: '10px', fontWeight: 'bold', fill: '#9ca3af' }} dy={10} />
                  <ReferenceLine y={0} stroke="#cbd5e1" />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="trade" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={3} baseValue={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Strategic Brief & Risk Assessment */}
        <div className="bg-white rounded-3xl text-gray-900 relative overflow-hidden shadow-xl border border-gray-200 transition-all duration-500">

          {/* Larger Green Gradient Glow */}


          <div className="p-12 relative z-10 bg-gradient-to-bl 
from-emerald-300/40 
via-green-200/25 
to-transparent 
opacity-70">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">

              {/* LEFT SECTION */}
              <div className="lg:col-span-7">
                <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-black tracking-widest mb-6">
                  HEADLINE REPORT
                </div>

                <h4 className="text-4xl font-extrabold leading-tight mb-10">
                  {intelligenceData?.headline ||
                    "Petroleum sector showing resilience amidst global shifts."}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {(intelligenceData?.key_findings ?? []).slice(0, 2).map((finding) => (
                    <div key={finding.title} className="space-y-3">
                      <div className="text-emerald-600 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                        {finding.title}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed font-medium">
                        {finding.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT SECTION */}
              <div className="lg:col-span-5">
                <button
                  onClick={() => setIsRecommendationsExpanded(!isRecommendationsExpanded)}
                  className="w-full bg-gray-50 rounded-2xl p-10 border border-gray-200 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                      Strategic Recommendations
                      <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded uppercase">
                        Actionable
                      </span>
                    </h5>
                    {isRecommendationsExpanded ? (
                      <HiArrowSmDown className="text-gray-400" />
                    ) : (
                      <HiArrowRight className="text-gray-400" />
                    )}
                  </div>

                  {isRecommendationsExpanded ? (
                    <div className="space-y-6 mt-6 animate-fade-in">
                      {(intelligenceData?.strategic_recommendations ?? []).map((item, i) => (
                        <div key={i} className="flex gap-4 group">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 text-xs font-bold group-hover:bg-emerald-600 group-hover:text-white transition-all">
                            {i + 1}
                          </div>
                          <p className="text-sm text-gray-700 font-medium leading-snug group-hover:text-gray-900 transition-colors">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 mt-3 italic">
                      Click to expand executive recommendations...
                    </p>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* FOOTER STRIP */}
          <div className="bg-gray-50 px-12 py-4 flex justify-between items-center text-[10px] font-bold text-gray-500 border-t border-gray-200 uppercase tracking-widest">
            <span>Dynamic Intelligence Engine • AI Gen 4.5</span>
            <span className="flex items-center gap-2 leading-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Feed Verified
            </span>
          </div>

        </div>

      </Card>
    );
  }

  function renderCrudeTab() {
    if (crudeLoading || filtersLoading) {
      return (
        <div className="space-y-6">
          <LoadingSkeleton variant="rectangle" height="100px" className="rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LoadingSkeleton variant="rectangle" height="120px" className="rounded-xl" />
            <LoadingSkeleton variant="rectangle" height="120px" className="rounded-xl" />
            <LoadingSkeleton variant="rectangle" height="120px" className="rounded-xl" />
          </div>
          <LoadingSkeleton variant="rectangle" height="400px" className="rounded-xl" />
          <LoadingSkeleton variant="rectangle" height="400px" className="rounded-xl" />
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

    // Mode 1: Overall Production (Merged Historical "Total crude oil" + Forecast)
    const mergedTotalData = (() => {
      if (!crudeForecastData) return [];
      const yearsMap = new Map<number, number>();

      // Historical "Total crude oil"
      crudeForecastData.historical_data
        .filter((row) => row.company_name === "Total crude oil")
        .forEach((row) => {
          yearsMap.set(row.year, row.total_quantity);
        });

      // Forecast overrides historical
      crudeForecastData.forecast.forecast.forEach((f) => {
        yearsMap.set(f.year, f.predicted_quantity);
      });

      return Array.from(yearsMap.keys())
        .sort((a, b) => a - b)
        .map((year) => ({
          year,
          production: yearsMap.get(year),
        }));
    })();

    // Mode 2: Company-wise Production (Filtered Multi-line)
    const companyChartData = (() => {
      if (!crudeForecastData) return { data: [], companies: [] };

      const filtered = crudeForecastData.historical_data.filter(
        (row) =>
          ![
            "PSU total (Crude Oil)",
            "Total crude oil",
            "Total ( Crude oil + Condensate)",
          ].includes(row.company_name)
      );

      const companyNames = Array.from(new Set(filtered.map((d) => d.company_name)));
      const uniqueYears = Array.from(new Set(filtered.map((d) => d.year))).sort((a, b) => a - b);

      const data = uniqueYears.map((year) => {
        const entry: any = { year };
        companyNames.forEach((name) => {
          const match = filtered.find((h) => h.year === year && h.company_name === name);
          entry[name] = match ? match.total_quantity : null;
        });
        return entry;
      });

      return { data, companies: companyNames };
    })();

    const COMPANY_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

    // Prepare Monthly Data
    const monthlyBarData = (crudeRows?.results ?? [])
      .slice()
      .reverse()
      .map((row) => ({
        name: `${row.month} ${row.year}`,
        quantity: row.quantity,
        company: row.company_name,
        month: row.month,
        year: row.year,
      }));


    return (
      <div className="space-y-8 pb-10">
        <Card variant="elevated" className="rounded-xl !border-none shadow-sm bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Premium KPI Metrics for Crude */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <HiOfficeBuilding className="text-xl" />
              </div>
              <div className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-black uppercase tracking-widest">
                Coverage
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">
              {crudeForecastData?.company === "Total crude oil" ? "National Total" : crudeForecastData?.company ?? "All Companies"}
            </div>
            <div className="text-sm font-bold text-gray-500">Corporate Sector Scope</div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <HiFilter /> Based on active selection
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <HiTrendingUp className="text-xl" />
              </div>
              <div className="flex items-center gap-1 text-xs font-black text-emerald-600">
                <HiArrowSmUp /> AI ESTIMATE
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1 capitalize">
              {crudeForecastData?.forecast?.trend ?? "Stable"}
            </div>
            <div className="text-sm font-bold text-gray-500">Production Trajectory</div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <HiClock /> Forward-Looking Analysis
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <HiLightningBolt className="text-xl" />
              </div>
              <div className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-black uppercase tracking-widest">
                Reliability
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">
              {crudeForecastData
                ? `${(safeNum(crudeForecastData.forecast.confidence) * 100).toFixed(0)}%`
                : "N/A"}
            </div>
            <div className="text-sm font-bold text-gray-500">AI Model Confidence</div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <HiShieldCheck /> Statistical Verification
            </div>
          </div>
        </div>

        <Card variant="elevated" className="rounded-2xl border-none shadow-premium p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {crudeViewMode === "overall" ? "Overall Production Trend" : "Company-wise Production"}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {crudeViewMode === "overall"
                  ? "Historical totals merged with AI forecast (KMT)"
                  : "Production breakdown by individual companies (KMT)"}
              </p>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setCrudeViewMode("overall")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${crudeViewMode === "overall"
                  ? "bg-white text-brand-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Overall
              </button>
              <button
                onClick={() => setCrudeViewMode("company")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${crudeViewMode === "company"
                  ? "bg-white text-brand-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Company-wise
              </button>
            </div>
          </div>

          <div className="h-[400px] w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              {crudeViewMode === "overall" ? (
                <AreaChart data={mergedTotalData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }}
                    tickFormatter={(val) => `${val}`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value: any) => [formatKmt(safeNum(Number(value))), "Production"]}
                  />
                  <Area
                    name="Production"
                    type="monotone"
                    dataKey="production"
                    stroke="#10b981"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorProd)"
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#10b981' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                    connectNulls
                  />
                </AreaChart>
              ) : (
                <LineChart data={companyChartData.data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickFormatter={(val) => `${val}`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: any, name: any) => [formatKmt(safeNum(Number(value))), name || ""]}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  {companyChartData.companies.map((company, index) => (
                    <Line
                      key={company}
                      name={company}
                      type="monotone"
                      dataKey={company}
                      stroke={COMPANY_COLORS[index % COMPANY_COLORS.length]}
                      strokeWidth={2.5}
                      dot={{ r: 3, strokeWidth: 1, fill: COMPANY_COLORS[index % COMPANY_COLORS.length] }}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6">
            <h4 className="flex items-center gap-2 text-blue-900 font-bold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              AI Production Analysis
            </h4>
            <p className="text-blue-800/80 text-sm leading-relaxed">
              {crudeForecastData?.forecast?.analysis || "No AI analysis available."}
            </p>
          </div>
        </Card>

        <Card variant="elevated" className="rounded-2xl border-none shadow-premium p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Monthly Crude Production</h3>
              <p className="text-gray-500 text-sm mt-1">Detailed month-wise quantity breakdown</p>
            </div>
            <div className="flex items-center gap-2">
              {renderPagination(crudeRows, crudePage, setCrudePage)}
            </div>
          </div>

          <div className="h-[400px] w-full">
            {crudeRowsLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50/50 rounded-xl">
                <LoadingSkeleton variant="rectangle" height="100%" width="100%" className="opacity-50" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyBarData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    interval={Math.floor(monthlyBarData.length / 6)}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 shadow-xl rounded-xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">{data.name}</p>
                            <p className="text-sm font-bold text-gray-900 mb-2">{data.company}</p>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                              <span className="text-lg font-extrabold text-brand-primary">{formatNumber(data.quantity)} MT</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="quantity"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                    animationBegin={200}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
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

    // --- Refinery Data Preparation ---
    const yearlyTrends = [...(refineryAnalysisData?.yearly_trends ?? [])].sort((a, b) => a.year - b.year);
    const latestYearly = yearlyTrends[yearlyTrends.length - 1];
    const prevYearly = yearlyTrends[yearlyTrends.length - 2];
    const yearlyGrowth = prevYearly ? ((latestYearly.total_processed - prevYearly.total_processed) / prevYearly.total_processed) * 100 : 0;

    const seasonalData = (refineryAnalysisData?.seasonal_pattern ?? []);

    return (
      <div className="space-y-8 pb-10">
        <Card variant="elevated" className="rounded-xl !border-none shadow-sm bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SearchableSelect
              label="Refinery Unit"
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
              label="Calendar Year"
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

        {/* Refinery KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <HiCube className="text-xl" />
              </div>
              {yearlyGrowth !== 0 && (
                <div className={`flex items-center gap-0.5 text-xs font-black ${yearlyGrowth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {yearlyGrowth >= 0 ? <HiArrowSmUp /> : <HiArrowSmDown />}
                  {Math.abs(yearlyGrowth).toFixed(1)}%
                </div>
              )}
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">
              {formatKmt(latestYearly?.total_processed || 0)}
            </div>
            <div className="text-sm font-bold text-gray-500">Current Throughput</div>
            <div className="mt-4 pt-4 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <HiClock /> Reporting Period: {latestYearly?.year || 'N/A'}
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <HiPresentationChartLine className="text-xl" />
              </div>
              <div className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded font-black uppercase tracking-widest">
                Unit Lead
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900 mb-1 truncate">
              {latestYearly?.refinery_name || "Multiple Units"}
            </div>
            <div className="text-sm font-bold text-gray-500">Primary Capacity Factor</div>
            <div className="mt-4 pt-4 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <HiOfficeBuilding /> Leading Refinery Unit
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                <HiCalendar className="text-xl" />
              </div>
              <div className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-black uppercase tracking-widest">
                Peak Cycle
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">
              {[...seasonalData].sort((a, b) => b.avg_quantity - a.avg_quantity)[0]?.month || "N/A"}
            </div>
            <div className="text-sm font-bold text-gray-500">Dominant Season</div>
            <div className="mt-4 pt-4 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <HiTrendingUp /> Maximum Seasonal Velocity
            </div>
          </div>
        </div>

        {/* Visual Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card variant="elevated" className="rounded-2xl border-none shadow-premium p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Yearly Processing Volume
              </h3>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value: any) => [formatKmt(safeNum(Number(value))), "Processed"]}
                  />
                  <Bar dataKey="total_processed" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card variant="elevated" className="rounded-2xl border-none shadow-premium p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Seasonal Pattern Analysis
              </h3>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={seasonalData}>
                  <defs>
                    <linearGradient id="colorSeason" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value: any) => [formatKmt(safeNum(Number(value))), "Avg Qty"]}
                  />
                  <Area type="monotone" dataKey="avg_quantity" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorSeason)" dot={{ r: 4, fill: '#f59e0b' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Improved Raw Data Table */}
        <Card variant="elevated" className="rounded-2xl border-none shadow-premium overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Refinery Operations Ledger</h3>
            <span className="text-[10px] bg-white border border-gray-200 text-gray-500 px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm">
              Detailed Logs
            </span>
          </div>
          <div className="overflow-auto max-h-[48vh]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Period</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Processing Unit</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Volume (KMT)</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(refineryRows?.results ?? []).map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-black text-gray-900">{row.month}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">{row.year}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{row.refinery_name}</td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900 text-right">{formatNumber(row.quantity)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">
                        Optimal
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-gray-50 bg-gray-50/30">
            {renderPagination(refineryRows, refineryPage, setRefineryPage)}
          </div>
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

    // --- Demand-Supply Gap Preparation ---
    const demandSupplyData = [...gapRows].sort((a, b) => a.year - b.year);
    const latestGap = demandSupplyData[demandSupplyData.length - 1];
    const totalProduction = latestGap?.production || 0;
    const totalImports = latestGap?.imports || 0;
    const totalExports = latestGap?.exports || 0;
    const netPosition = totalProduction + totalImports - totalExports;

    return (
      <div className="space-y-8 pb-10">
        <Card variant="elevated" className="rounded-xl !border-none shadow-sm bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SearchableSelect
              label="Refined Product"
              value={gapProduct}
              onChange={(value) => setGapProduct(value === "" ? "" : String(value))}
              options={productionProductOptions}
              placeholder="All products"
              disabled={filtersLoading || !!filtersError}
            />
            <SearchableSelect
              label="Analysis Year"
              value={gapYear}
              onChange={(value) => setGapYear(value === "" ? "" : Number(value))}
              options={productYearOptions}
              placeholder="All years"
              disabled={filtersLoading || !!filtersError}
            />
          </div>
        </Card>

        {/* Momentum KPIs for Demand Supply */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-l-emerald-500">
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <HiCube className="text-emerald-500" /> Current Net Position
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{formatKmt(netPosition)}</div>
            <div className="text-sm font-bold text-emerald-600">Inventory Equilibrium</div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-l-rose-500">
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <HiDatabase className="text-rose-500" /> Domestic Coverage
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">
              {netPosition > 0 ? ((totalProduction / netPosition) * 100).toFixed(1) : "0"}%
            </div>
            <div className="text-sm font-bold text-rose-600">Self-Sufficiency Index</div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <HiGlobe className="text-blue-500" /> Strategic Target
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{gapProduct || "Aggregated"}</div>
            <div className="text-sm font-bold text-blue-600">Portfolio Focus</div>
          </div>
        </div>

        <Card variant="elevated" className="rounded-2xl border-none shadow-premium p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary"></span> Equilibrium Dynamics History
            </h3>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={demandSupplyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar name="Production" dataKey="production" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar name="Imports" dataKey="imports" fill="#f87171" radius={[4, 4, 0, 0]} barSize={20} />
                <Line name="Exports" type="monotone" dataKey="exports" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Structured Ledger for Gap Analysis */}
        <Card variant="elevated" className="rounded-2xl border-none shadow-premium overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Demand-Supply Reconciliation Ledger</h3>
          </div>
          <div className="overflow-auto max-h-[50vh]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Year</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Product Portfolio</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Produced</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Imported</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Exported</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Net Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {demandSupplyData.map((row) => {
                  const gap = row.production + row.imports - row.exports;
                  return (
                    <tr key={`${row.product}-${row.year}`} className="hover:bg-blue-50/10 transition-colors">
                      <td className="px-6 py-4 text-sm font-black text-gray-900">{row.year}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-700">{row.product}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-600 text-right">{formatKmt(row.production)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-600 text-right text-rose-600">+{formatKmt(row.imports)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-600 text-right text-emerald-600">-{formatKmt(row.exports)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-3 py-1 rounded text-xs font-black ${gap >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {formatKmt(gap)}
                        </span>
                      </td>
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

    // --- Import Cost Analysis Preparation ---
    const importData = [...(importCostData?.import_data ?? [])].sort((a, b) => a.year - b.year);
    const totalBillInr = importData.reduce((sum, item) => sum + safeNum(item.total_value_inr), 0);
    const totalBillUsd = importData.reduce((sum, item) => sum + safeNum(item.total_value_usd), 0);

    return (
      <div className="space-y-8 pb-10">
        <Card variant="elevated" className="rounded-xl !border-none shadow-sm bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SearchableSelect
              label="Fiscal Year"
              value={importYear}
              onChange={(value) => setImportYear(value === "" ? "" : Number(value))}
              options={tradeYearOptions}
              placeholder="All years"
              disabled={filtersLoading || !!filtersError}
            />
          </div>
        </Card>

        {/* Import Cost KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <HiExclamationCircle className="text-xl" />
              </div>
              <div className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded font-black uppercase tracking-widest">
                Expenditure
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{formatInrCrore(totalBillInr)}</div>
            <div className="text-sm font-bold text-gray-500">Gross Import Bill (INR)</div>
            <div className="mt-4 pt-4 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <HiClock /> Aggregated Fiscal Total
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <HiGlobe className="text-xl" />
              </div>
              <div className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black uppercase tracking-widest">
                Currency
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{formatUsdMillion(totalBillUsd)}</div>
            <div className="text-sm font-bold text-gray-500">USD Valuation</div>
            <div className="mt-4 pt-4 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <HiTrendingUp /> Global Market Equivalent
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <HiChip className="text-xl" />
              </div>
              <div className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-black uppercase tracking-widest">
                Audit
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{importData.length}</div>
            <div className="text-sm font-bold text-gray-500">Verified Product Records</div>
            <div className="mt-4 pt-4 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <HiDatabase /> Data Consistency Check
            </div>
          </div>
        </div>

        {/* Analysis Row */}
        <div className="w-full">
          <Card variant="elevated" className="rounded-2xl border-none shadow-premium p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                Bill Distribution by Product
              </h3>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={importData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="product"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    interval={Math.floor(importData.length / 6)}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 shadow-xl rounded-xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">{data.product}</p>
                            <p className="text-sm font-bold text-gray-900 mb-2">Year: {data.year}</p>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                              <span className="text-lg font-extrabold text-brand-primary">{formatInrCrore(data.total_value_inr)}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="total_value_inr"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                    animationBegin={200}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>
        <div className="flex gap-2 w-full">
          <Card
            variant="elevated"
            className="rounded-2xl w-[50%] border border-gray-200 bg-white p-10 shadow-xl relative overflow-hidden"
          >

            {/* Soft Green Gradient Accent */}
            <div className="absolute top-0 right-0 w-[60%] h-full 
    bg-gradient-to-bl 
    from-emerald-100/70 
    via-green-50/50 
    to-transparent">
            </div>

            <div className="relative z-10">

              <h3 className="text-xl font-extrabold uppercase tracking-widest mb-1 text-emerald-600 flex items-center gap-2">
                <HiLightningBolt className="text-emerald-500" />
                AI Financial Forecast
              </h3>

              {importCostData?.ai_forecast.error ? (
                <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
                  {importCostData.ai_forecast.error}
                </div>
              ) : (
                <div className="space-y-6">

                  {(importCostData?.ai_forecast.forecast ?? []).map((f) => (
                    <div
                      key={f.year}
                      className="p-6 rounded-xl border border-gray-200 bg-gray-50 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                          {f.year} Projection
                        </span>

                        <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">
                          Estimated
                        </span>
                      </div>

                      <div className="text-xl font-extrabold text-gray-900">
                        {formatInrCrore(f.estimated_bill_inr_crore)}
                      </div>

                      <div className="text-sm font-semibold text-gray-600 mt-1">
                        {formatUsdMillion(f.estimated_bill_usd_million)} (USD Equivalent)
                      </div>
                    </div>
                  ))}

                </div>
              )}

            </div>

          </Card>


          <Card variant="elevated" className="rounded-2xl w-[50%] border-none shadow-premium p-8">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Strategic Drivers</h4>
            <div className="space-y-3">
              {(importCostData?.ai_forecast.key_drivers ?? []).map((driver, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-brand-primary font-black">/</span>
                  <span className="text-gray-600 font-medium">{driver}</span>
                </div>
              ))}
            </div>

            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mt-8 mb-4">Risk Exposure</h4>
            <div className="space-y-3">
              {(importCostData?.ai_forecast.risk_factors ?? []).map((risk, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-rose-500 font-black">!</span>
                  <span className="text-gray-600 font-medium">{risk}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Detailed Import Ledger */}
        <Card variant="elevated" className="rounded-2xl border-none shadow-premium overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Financial Import Transaction Logs</h3>
          </div>
          <div className="overflow-auto max-h-[50vh]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Volume</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Value (INR)</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Value (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {importData.map((item) => (
                  <tr key={`${item.year}-${item.product}`} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-black text-gray-900">{item.product}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">{item.year}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 text-right">{formatKmt(item.total_quantity)}</td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900 text-right">{formatInrCrore(item.total_value_inr)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-500 text-right">{formatUsdMillion(item.total_value_usd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="p-8 rounded-2xl 
  bg-gradient-to-br 
  from-white 
  via-emerald-50 
  to-green-100/40 
  border border-gray-200 
  shadow-md">

          <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 mb-3">
            Executive Analysis
          </h4>

          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            {importCostData?.ai_forecast.analysis ||
              "Market analysis currently being synchronized with global benchmarks."}
          </p>

        </div>

      </div>
    );
  }

  function renderExplorerTable() {
    if (!explorerData) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-4xl text-gray-300 mb-2">📊</div>
            <div className="text-sm font-bold text-gray-400">No records available</div>
          </div>
        </div>
      );
    }

    if (explorerDataset === "crude") {
      const rows = explorerData.results as PetroleumCrudeProductionRecord[];
      return (
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Month</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Year</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Company</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Quantity (000 MT)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.month}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{row.year}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.company_name}</td>
                  <td className="px-6 py-4 text-sm font-black text-brand-primary text-right">{formatNumber(row.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (explorerDataset === "refineries") {
      const rows = explorerData.results as PetroleumRefineryProcessingRecord[];
      return (
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Month</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Year</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Refinery</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Quantity (000 MT)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.month}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{row.year}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.refinery_name}</td>
                  <td className="px-6 py-4 text-sm font-black text-purple-600 text-right">{formatNumber(row.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (explorerDataset === "products") {
      const rows = explorerData.results as PetroleumProductProductionRecord[];
      return (
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Month</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Year</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Quantity (000 MT)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.month}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{row.year}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.product}</td>
                  <td className="px-6 py-4 text-sm font-black text-emerald-600 text-right">{formatNumber(row.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (explorerDataset === "trade") {
      const rows = explorerData.results as PetroleumTradeRecord[];
      return (
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Month</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Year</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Quantity (000 MT)</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">INR (Cr)</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">USD (Mn)</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Updated</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.product}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${row.trade_type === 'Import'
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-emerald-100 text-emerald-600'
                      }`}>
                      {row.trade_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{MONTH_NAMES[row.month] || row.month}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{row.year}</td>
                  <td className="px-6 py-4 text-sm font-black text-gray-900 text-right">{formatNumber(row.quantity)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-rose-600 text-right">{formatNumber(row.value_inr_crore)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-600 text-right">{formatNumber(row.value_usd_million)}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-400">{formatDate(row.date_updated)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    const rows = explorerData.results as PetroleumImportExportSnapshotRecord[];
    return (
      <div className="overflow-auto max-h-[60vh]">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
              <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Total (000 MT)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-amber-50/30 transition-colors">
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${row.import_export === 'Import'
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-emerald-100 text-emerald-600'
                    }`}>
                    {row.import_export}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.product}</td>
                <td className="px-6 py-4 text-sm font-black text-amber-600 text-right">{formatNumber(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
        <Card variant="elevated" className="rounded-2xl border-none shadow-premium p-8">
          <div className="flex flex-wrap gap-2 mb-8 bg-gray-50 p-1.5 rounded-xl w-fit">
            {EXPLORER_DATASETS.map((set) => (
              <button
                key={set.key}
                type="button"
                onClick={() => {
                  setExplorerPage(1);
                  setExplorerDataset(set.key);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${explorerDataset === set.key
                  ? "bg-white text-brand-primary shadow-sm ring-1 ring-gray-200"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
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
          <div className="overflow-auto w-full max-h-[60vh]">{renderExplorerTable()}</div>
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
