import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "../ui";
import CarbonCreditLayout from "../CarbonCreditLayout";
import {
  calculateEmission,
  getErrorMessage,
  getIndustryDetails,
  getTokenBalance,
  submitCoalData,
  updateIndustryEmission,
  uploadGovtData,
} from "../../api/clientapi";
import type {
  CarbonEmissionResponse,
  CarbonIndustryDetailsResponse,
  CarbonSubmitCoalDataResponse,
  CarbonTokenBalanceResponse,
  CarbonUpdateEmissionResponse,
  CarbonUploadGovtDataResponse,
} from "../../api/types";
import {
  HiExclamationCircle,
  HiCheckCircle,
  HiArrowRight,
  HiDocumentText,
  HiClock,
} from "react-icons/hi";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type CarbonTabKey =
  | "dashboard"
  | "upload-data"
  | "calculate"
  | "update-emission"
  | "industry"
  | "token-balance";

const CARBON_TABS: CarbonTabKey[] = [
  "dashboard",
  "upload-data",
  "calculate",
  "update-emission",
  "industry",
  "token-balance",
];

type CoalCsvRow = {
  state: string;
  category: string;
  receipt2023: number;
  consumption2023: number;
  receipt2024: number;
  consumption2024: number;
};

function isValidWalletAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function toNum(raw: string | undefined): number {
  if (!raw) return 0;
  const parsed = Number(raw.replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCoalCsv(text: string): CoalCsvRow[] {
  const lines = text
    .split(/\r\n|\n|\r/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  const getIndex = (pattern: RegExp): number =>
    headers.findIndex((header) => pattern.test(header));

  const stateIdx = getIndex(/^States$/i);
  const categoryIdx = getIndex(/^Category$/i);
  const receipt23Idx = getIndex(/2023-24.*Total Receipt/i);
  const consumption23Idx = getIndex(/2023-24.*Total Consumption/i);
  const receipt24Idx = getIndex(/2024-25.*Total Receipt/i);
  const consumption24Idx = getIndex(/2024-25.*Total Consumption/i);

  if (
    stateIdx < 0 ||
    categoryIdx < 0 ||
    receipt23Idx < 0 ||
    consumption23Idx < 0 ||
    receipt24Idx < 0 ||
    consumption24Idx < 0
  ) {
    return [];
  }

  return lines
    .slice(1)
    .map(parseCsvLine)
    .map((cells) => ({
      state: (cells[stateIdx] || "").trim(),
      category: (cells[categoryIdx] || "").trim(),
      receipt2023: toNum(cells[receipt23Idx]),
      consumption2023: toNum(cells[consumption23Idx]),
      receipt2024: toNum(cells[receipt24Idx]),
      consumption2024: toNum(cells[consumption24Idx]),
    }))
    .filter((row) => row.state && !/total/i.test(row.state));
}

function ErrorCard({ title, message }: { title: string; message: string }) {
  return (
    <Card variant="elevated" className="text-center py-8">
      <div className="flex justify-center mb-3">
        <HiExclamationCircle className="text-red-500 text-5xl" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{message}</p>
    </Card>
  );
}

function KeyValueRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

export default function CarbonCreditSector() {
  const navigate = useNavigate();
  const params = useParams<{ tab?: string }>();

  const rawTab = params.tab;
  const activeTab: CarbonTabKey =
    rawTab && CARBON_TABS.includes(rawTab as CarbonTabKey)
      ? (rawTab as CarbonTabKey)
      : "dashboard";

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadResult, setUploadResult] =
    useState<CarbonUploadGovtDataResponse | null>(null);
  const [uploadedCoalRows, setUploadedCoalRows] = useState<CoalCsvRow[]>([]);

  const [stateName, setStateName] = useState("");
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState("");
  const [calcResult, setCalcResult] = useState<CarbonEmissionResponse | null>(
    null,
  );

  const [altCalcLoading, setAltCalcLoading] = useState(false);
  const [altCalcError, setAltCalcError] = useState("");
  const [altCalcResult, setAltCalcResult] =
    useState<CarbonSubmitCoalDataResponse | null>(null);

  const [updateWallet, setUpdateWallet] = useState("");
  const [updateEmissionValue, setUpdateEmissionValue] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateResult, setUpdateResult] =
    useState<CarbonUpdateEmissionResponse | null>(null);

  const [industryWallet, setIndustryWallet] = useState("");
  const [industryLoading, setIndustryLoading] = useState(false);
  const [industryError, setIndustryError] = useState("");
  const [industryResult, setIndustryResult] =
    useState<CarbonIndustryDetailsResponse | null>(null);

  const [balanceWallet, setBalanceWallet] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState("");
  const [balanceResult, setBalanceResult] =
    useState<CarbonTokenBalanceResponse | null>(null);

  useEffect(() => {
    if (!rawTab || !CARBON_TABS.includes(rawTab as CarbonTabKey)) {
      navigate("/carbon-credit/dashboard", { replace: true });
    }
  }, [navigate, rawTab]);

  async function onUploadGovtData(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!uploadFile) {
      setUploadError("Please select a CSV file to upload.");
      return;
    }
    setUploadLoading(true);
    setUploadError("");
    try {
      const response = await uploadGovtData(uploadFile);
      setUploadResult(response);
      const csvText = await uploadFile.text();
      setUploadedCoalRows(parseCoalCsv(csvText));
    } catch (err) {
      setUploadError(getErrorMessage(err));
    } finally {
      setUploadLoading(false);
    }
  }

  async function onCalculateEmission(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const state = stateName.trim().toLowerCase();
    if (!state) {
      setCalcError("State is required.");
      return;
    }
    setCalcLoading(true);
    setCalcError("");
    try {
      const response = await calculateEmission({ state });
      setCalcResult(response);
    } catch (err) {
      setCalcError(getErrorMessage(err));
    } finally {
      setCalcLoading(false);
    }
  }

  async function onSubmitCoalData() {
    const state = stateName.trim().toLowerCase();
    if (!state) {
      setAltCalcError("State is required.");
      return;
    }
    setAltCalcLoading(true);
    setAltCalcError("");
    try {
      const response = await submitCoalData({ state });
      setAltCalcResult(response);
    } catch (err) {
      setAltCalcError(getErrorMessage(err));
    } finally {
      setAltCalcLoading(false);
    }
  }

  async function onUpdateIndustryEmission(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const wallet = updateWallet.trim();
    const emission = Number(updateEmissionValue);
    if (!isValidWalletAddress(wallet)) {
      setUpdateError("Enter a valid industry wallet address.");
      return;
    }
    if (!Number.isFinite(emission) || emission < 0) {
      setUpdateError("Emission must be a non-negative number.");
      return;
    }
    setUpdateLoading(true);
    setUpdateError("");
    try {
      const response = await updateIndustryEmission({
        industryAddress: wallet,
        emission,
      });
      setUpdateResult(response);
    } catch (err) {
      setUpdateError(getErrorMessage(err));
    } finally {
      setUpdateLoading(false);
    }
  }

  async function onFetchIndustryDetails(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const wallet = industryWallet.trim();
    if (!isValidWalletAddress(wallet)) {
      setIndustryError("Enter a valid wallet address.");
      return;
    }
    setIndustryLoading(true);
    setIndustryError("");
    try {
      const response = await getIndustryDetails(wallet);
      setIndustryResult(response);
    } catch (err) {
      setIndustryError(getErrorMessage(err));
    } finally {
      setIndustryLoading(false);
    }
  }

  async function onFetchTokenBalance(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const wallet = balanceWallet.trim();
    if (!isValidWalletAddress(wallet)) {
      setBalanceError("Enter a valid wallet address.");
      return;
    }
    setBalanceLoading(true);
    setBalanceError("");
    try {
      const response = await getTokenBalance(wallet);
      setBalanceResult(response);
    } catch (err) {
      setBalanceError(getErrorMessage(err));
    } finally {
      setBalanceLoading(false);
    }
  }

  function renderDashboard() {
    return (
      <div className="space-y-6">
        <Card variant="elevated">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Carbon Credit Workflow
          </h2>
          <p className="text-gray-600 mb-6">
            Upload data, calculate state emissions, sync industry emission
            updates, and review cap status with token balance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { label: "Upload Data", path: "/carbon-credit/upload-data" },
              { label: "Calculate", path: "/carbon-credit/calculate" },
              { label: "Update", path: "/carbon-credit/update-emission" },
              { label: "Industry", path: "/carbon-credit/industry" },
              { label: "Balance", path: "/carbon-credit/token-balance" },
            ].map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="justify-between border border-gray-200"
                onClick={() => navigate(item.path)}
              >
                {item.label}
                <HiArrowRight className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated">
            <div className="flex items-center gap-2 mb-3">
              <HiDocumentText className="text-brand-primary" />
              <h3 className="font-semibold text-gray-900">Latest Upload</h3>
            </div>
            {uploadResult ? (
              <>
                <KeyValueRow
                  label="Status"
                  value={uploadResult.success ? "Success" : "Failed"}
                />
                <KeyValueRow
                  label="Total Records"
                  value={uploadResult.totalRecords}
                />
              </>
            ) : (
              <p className="text-sm text-gray-500">
                No upload completed in this session.
              </p>
            )}
          </Card>

          <Card variant="elevated">
            <div className="flex items-center gap-2 mb-3">
              <HiClock className="text-brand-primary" />
              <h3 className="font-semibold text-gray-900">
                Latest Calculation
              </h3>
            </div>
            {calcResult ? (
              <>
                <KeyValueRow label="State" value={calcResult.state} />
                <KeyValueRow
                  label="Coal Consumed"
                  value={calcResult.coalConsumed}
                />
                <KeyValueRow label="Emission" value={calcResult.emission} />
              </>
            ) : (
              <p className="text-sm text-gray-500">
                No emission calculated in this session.
              </p>
            )}
          </Card>

          <Card variant="elevated">
            <div className="flex items-center gap-2 mb-3">
              <HiCheckCircle className="text-brand-primary" />
              <h3 className="font-semibold text-gray-900">
                Latest Blockchain Update
              </h3>
            </div>
            {updateResult ? (
              <>
                <KeyValueRow
                  label="Success"
                  value={updateResult.success ? "Yes" : "No"}
                />
                <KeyValueRow
                  label="Tx Hash"
                  value={<span className="text-xs">{updateResult.txHash}</span>}
                />
              </>
            ) : (
              <p className="text-sm text-gray-500">
                No emission update submitted yet.
              </p>
            )}
          </Card>
        </div>
      </div>
    );
  }

  function renderUploadTab() {
    const uploadChartData = uploadedCoalRows.map((row, index) => ({
      index: index + 1,
      state: row.state,
      category: row.category,
      receipt2023: row.receipt2023,
      consumption2023: row.consumption2023,
      receipt2024: row.receipt2024,
      consumption2024: row.consumption2024,
    }));
    const aggregatedByStateMap = new Map<
      string,
      {
        state: string;
        receipt2023: number;
        consumption2023: number;
        receipt2024: number;
        consumption2024: number;
      }
    >();

    uploadedCoalRows.forEach((row) => {
      const existing = aggregatedByStateMap.get(row.state);
      if (existing) {
        existing.receipt2023 += row.receipt2023;
        existing.consumption2023 += row.consumption2023;
        existing.receipt2024 += row.receipt2024;
        existing.consumption2024 += row.consumption2024;
      } else {
        aggregatedByStateMap.set(row.state, {
          state: row.state,
          receipt2023: row.receipt2023,
          consumption2023: row.consumption2023,
          receipt2024: row.receipt2024,
          consumption2024: row.consumption2024,
        });
      }
    });
    const aggregatedChartData = Array.from(aggregatedByStateMap.values());
    const chartWidth = Math.max(900, aggregatedChartData.length * 90);

    return (
      <div className="space-y-6 ">
        <Card variant="elevated" className="max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Upload Government Dataset
          </h2>
          <p className="text-gray-600 mb-6">
            Upload the CSV file used for state coal consumption and emission
            calculations.
          </p>

          <form onSubmit={onUploadGovtData} className="space-y-4">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(event) =>
                setUploadFile(event.target.files?.[0] ?? null)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            />
            <Button type="submit" loading={uploadLoading}>
              Upload CSV
            </Button>
          </form>

          {uploadError && (
            <p className="mt-4 text-sm text-red-600">{uploadError}</p>
          )}

          {uploadResult && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
              {uploadResult.totalRecords > 0 ? (
                <>
                  <p className="text-green-800 font-semibold">
                    Upload completed
                  </p>
                  <p className="text-sm text-green-700">
                    Total records: {uploadResult.totalRecords}
                  </p>
                </>
              ) : (
                <p className="text-green-800 font-semibold">Upload successful</p>
              )}
            </div>
          )}
        </Card>

        {uploadResult && (
          <Card variant="elevated" style={{ width: "100%" }}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Uploaded File Insights
            </h3>
            <p className="text-gray-600 mb-5">
              Graph: state-level aggregated trends. Table: raw uploaded rows.
            </p>

            {uploadChartData.length === 0 ? (
              <p className="text-sm text-gray-500">
                No CSV rows available to visualize. Ensure file headers match
                the expected coal format.
              </p>
            ) : (
              <>
                <div className="mb-6 overflow-x-auto">
                  <div style={{ width: chartWidth, height: 360 }}>
                    <LineChart
                      width={chartWidth}
                      height={360}
                      data={aggregatedChartData}
                      margin={{ top: 12, right: 20, left: 0, bottom: 72 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e7eb"
                      />
                      <XAxis
                        dataKey="state"
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={-35}
                        textAnchor="end"
                        height={70}
                        style={{ fontSize: "11px", fill: "#6b7280" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        style={{ fontSize: "11px", fill: "#6b7280" }}
                      />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="consumption2023"
                        name="2023-24 Consumption"
                        stroke="#16a34a"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="consumption2024"
                        name="2024-25 Consumption"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </div>
                </div>

                <div className="max-h-[420px] overflow-y-auto overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="sticky top-0 z-10 bg-white text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="sticky top-0 z-10 bg-white text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          State
                        </th>
                        <th className="sticky top-0 z-10 bg-white text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="sticky top-0 z-10 bg-white text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          2023-24 Receipt
                        </th>
                        <th className="sticky top-0 z-10 bg-white text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          2023-24 Consumption
                        </th>
                        <th className="sticky top-0 z-10 bg-white text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          2024-25 Receipt
                        </th>
                        <th className="sticky top-0 z-10 bg-white text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          2024-25 Consumption
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadChartData.map((row) => (
                        <tr
                          key={`${row.state}-${row.index}`}
                          className="border-b border-gray-100"
                        >
                          <td className="py-2 px-3 text-sm text-gray-700">
                            {row.index}
                          </td>
                          <td className="py-2 px-3 text-sm text-gray-700">
                            {row.state}
                          </td>
                          <td className="py-2 px-3 text-sm text-gray-700">
                            {row.category}
                          </td>
                          <td className="py-2 px-3 text-sm text-gray-700">
                            {row.receipt2023}
                          </td>
                          <td className="py-2 px-3 text-sm text-gray-700">
                            {row.consumption2023}
                          </td>
                          <td className="py-2 px-3 text-sm text-gray-700">
                            {row.receipt2024}
                          </td>
                          <td className="py-2 px-3 text-sm text-gray-700">
                            {row.consumption2024}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        )}
      </div>
    );
  }

  function renderCalculateTab() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Calculate Emission
          </h2>
          <p className="text-gray-600 mb-6">
            Uses `/emission/calculate` endpoint.
          </p>

          <form onSubmit={onCalculateEmission} className="space-y-4">
            <select
              value={stateName}
              onChange={(event) => setStateName(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Select state</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="telangana">Telangana</option>
              <option value="gujarat">Gujarat</option>
            </select>
            <Button type="submit" loading={calcLoading}>
              Calculate
            </Button>
          </form>

          {calcError && (
            <p className="mt-4 text-sm text-red-600">{calcError}</p>
          )}

          {calcResult && (
            <div className="mt-6 rounded-lg border border-gray-200 p-4">
              <KeyValueRow label="State" value={calcResult.state} />
              <KeyValueRow
                label="Coal Consumed"
                value={calcResult.coalConsumed}
              />
              <KeyValueRow label="Emission" value={calcResult.emission} />
            </div>
          )}
        </Card>

        {/* <Card variant="elevated">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Alternative Submission</h2>
          <p className="text-gray-600 mb-6">Uses `/submit-coal-data` endpoint.</p>

          <Button onClick={onSubmitCoalData} loading={altCalcLoading}>
            Submit Coal Data
          </Button>

          {altCalcError && <p className="mt-4 text-sm text-red-600">{altCalcError}</p>}

          {altCalcResult && (
            <div className="mt-6 rounded-lg border border-gray-200 p-4">
              <KeyValueRow label="Success" value={altCalcResult.success ? "Yes" : "No"} />
              <KeyValueRow label="State" value={altCalcResult.state} />
              <KeyValueRow label="Coal Consumed" value={altCalcResult.coalConsumed} />
              <KeyValueRow label="Emission" value={altCalcResult.emission} />
            </div>
          )}
        </Card> */}
      </div>
    );
  }

  function renderUpdateTab() {
    return (
      <Card variant="elevated" className="max-w-3xl">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Update Industry Emission
        </h2>
        <p className="text-gray-600 mb-6">
          Sends emission update request and returns blockchain transaction hash.
        </p>

        <form onSubmit={onUpdateIndustryEmission} className="space-y-4">
          <input
            value={updateWallet}
            onChange={(event) => setUpdateWallet(event.target.value)}
            placeholder="Industry wallet address"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          />
          <input
            type="number"
            min="0"
            value={updateEmissionValue}
            onChange={(event) => setUpdateEmissionValue(event.target.value)}
            placeholder="Emission value"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          />
          <Button type="submit" loading={updateLoading}>
            Update Emission
          </Button>
        </form>

        {updateError && (
          <p className="mt-4 text-sm text-red-600">{updateError}</p>
        )}

        {updateResult && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-semibold text-green-800">
              Update successful
            </p>
            <p className="mt-1 text-xs text-green-700 break-all">
              {updateResult.txHash}
            </p>
          </div>
        )}
      </Card>
    );
  }

  function renderIndustryTab() {
    return (
      <Card variant="elevated" className="max-w-3xl">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Industry Details
        </h2>
        <p className="text-gray-600 mb-6">
          Check industry cap, total emission, and status.
        </p>

        <form onSubmit={onFetchIndustryDetails} className="space-y-4">
          <input
            value={industryWallet}
            onChange={(event) => setIndustryWallet(event.target.value)}
            placeholder="Wallet address"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          />
          <Button type="submit" loading={industryLoading}>
            Fetch Details
          </Button>
        </form>

        {industryError && (
          <p className="mt-4 text-sm text-red-600">{industryError}</p>
        )}

        {industryResult && (
          <div className="mt-6 rounded-lg border border-gray-200 p-4">
            <KeyValueRow
              label="Wallet"
              value={<span className="text-xs">{industryResult.wallet}</span>}
            />
            <KeyValueRow label="Name" value={industryResult.name} />
            <KeyValueRow label="State" value={industryResult.state} />
            <KeyValueRow label="Cap" value={industryResult.cap} />
            <KeyValueRow
              label="Total Emission"
              value={industryResult.totalEmission}
            />
            <KeyValueRow label="Status" value={industryResult.status} />
            <KeyValueRow label="Difference" value={industryResult.difference} />
          </div>
        )}
      </Card>
    );
  }

  function renderBalanceTab() {
    return (
      <Card variant="elevated" className="max-w-3xl">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Token Balance</h2>
        <p className="text-gray-600 mb-6">
          Fetch available carbon credit token balance by wallet.
        </p>

        <form onSubmit={onFetchTokenBalance} className="space-y-4">
          <input
            value={balanceWallet}
            onChange={(event) => setBalanceWallet(event.target.value)}
            placeholder="Wallet address"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          />
          <Button type="submit" loading={balanceLoading}>
            Fetch Balance
          </Button>
        </form>

        {balanceError && (
          <p className="mt-4 text-sm text-red-600">{balanceError}</p>
        )}

        {balanceResult && (
          <div className="mt-6 rounded-lg border border-gray-200 p-4">
            <KeyValueRow label="Balance" value={balanceResult.balance} />
          </div>
        )}
      </Card>
    );
  }

  function renderContent() {
    if (activeTab === "dashboard") return renderDashboard();
    if (activeTab === "upload-data") return renderUploadTab();
    if (activeTab === "calculate") return renderCalculateTab();
    if (activeTab === "update-emission") return renderUpdateTab();
    if (activeTab === "industry") return renderIndustryTab();
    if (activeTab === "token-balance") return renderBalanceTab();
    return (
      <ErrorCard title="Invalid tab" message="Please choose a valid section." />
    );
  }

  return (
    <CarbonCreditLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Carbon Credit Dashboard
          </h1>
          <p className="text-gray-600">
            Government emission intelligence with blockchain-backed industry
            tracking.
          </p>
        </div>
        {renderContent()}
      </div>
    </CarbonCreditLayout>
  );
}
