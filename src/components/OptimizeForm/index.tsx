import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, Select, Spinner } from "../ui";
import type { SelectOption } from "../ui";
import MainLayout from "../MainLayout";
import {
  getCrops,
  getStates,
  getDistricts,
  getCropAvailability,
  optimize,
  getErrorMessage,
} from "../../api/clientapi";
import type { CropOption, StateOption, DistrictOption } from "../../api/types";
import SearchableSelect from "../ui/SearchableSelect";
import {
  HiTruck,
  HiCurrencyDollar,
  HiLightningBolt,
  HiInformationCircle,
} from "react-icons/hi";
import { RiTrainFill } from "react-icons/ri";
import { FaLeaf } from "react-icons/fa";
import { showSuccess, showError, showWarning, showInfo } from '../../utils/toast';

export default function OptimizeForm() {
  const navigate = useNavigate();

  // Form state
  const [cropId, setCropId] = useState<number | "">("");
  const [stateId, setStateId] = useState<number | "">("");
  const [districtId, setDistrictId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<string>("");
  const [transportMode, setTransportMode] = useState<string>("both");

  // Options state
  const [crops, setCrops] = useState<CropOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);

  // Loading states
  const [cropsLoading, setCropsLoading] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  // Availability preview
  const [availabilityInfo, setAvailabilityInfo] = useState<string>("");

  // Error state
  const [error, setError] = useState<string>("");

  // Load crops on mount
  useEffect(() => {
    loadCrops();
    loadStates();
  }, []);

  // Load districts when state changes
  useEffect(() => {
    if (stateId) {
      loadDistricts(stateId);
    } else {
      setDistricts([]);
      setDistrictId("");
    }
  }, [stateId]);

  // Load crop availability when crop changes
  useEffect(() => {
    if (cropId) {
      loadCropAvailability(cropId);
    } else {
      setAvailabilityInfo("");
    }
  }, [cropId]);

  // Auto-fill state and district from user's profile in localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('tf_stored_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.profile) {
          // Auto-fill state if available
          if (user.profile.state) {
            setStateId(user.profile.state);
          }
          // Auto-fill district if available (will load after state districts are loaded)
          if (user.profile.district) {
            setDistrictId(user.profile.district);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load user profile from localStorage:', error);
    }
  }, []);

  async function loadCrops() {
    setCropsLoading(true);
    try {
      const data = await getCrops();
      setCrops(data);
    } catch (err) {
      console.error("Failed to load crops:", err);
      showError('Failed to load crops. Please refresh the page.');
    } finally {
      setCropsLoading(false);
    }
  }

  async function loadStates() {
    setStatesLoading(true);
    try {
      const data = await getStates();
      setStates(data);
    } catch (err) {
      console.error("Failed to load states:", err);
      showError('Failed to load states. Please try again.');
    } finally {
      setStatesLoading(false);
    }
  }

  async function loadDistricts(stateIdValue: number) {
    setDistrictsLoading(true);
    try {
      const data = await getDistricts(stateIdValue);
      setDistricts(data);
    } catch (err) {
      console.error("Failed to load districts:", err);
      showError('Failed to load districts. Please try again.');
    } finally {
      setDistrictsLoading(false);
    }
  }

  async function loadCropAvailability(cropIdValue: number) {
    setAvailabilityLoading(true);
    try {
      const data = await getCropAvailability(cropIdValue);
      const topStates = data.states.slice(0, 3);
      const info = `Available in ${data.states.length} states. Top producers: ${topStates.map((s) => s.state__name).join(", ")}`;
      setAvailabilityInfo(info);
    } catch (err) {
      console.error("Failed to load crop availability:", err);
      setAvailabilityInfo("");
    } finally {
      setAvailabilityLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!cropId || !stateId || !districtId || !quantity) {
      setError("Please fill in all required fields");
      return;
    }

    const qtyNum = parseFloat(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0 || qtyNum > 100000) {
      setError("Quantity must be between 1 and 100,000 tonnes");
      return;
    }

    setSubmitting(true);
    try {
      showInfo('Finding best suppliers...');
      const result = await optimize({
        crop_id: cropId as number,
        state_id: stateId as number,
        district_id: districtId as number,
        quantity_tonnes: qtyNum,
        transport_mode: transportMode,
      });

      showSuccess('Optimization complete! Redirecting to results...');
      // Navigate to results page
      navigate(`/results/${result.id}`);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      showError(errorMsg || 'Optimization failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const cropOptions: SelectOption[] = crops.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  const stateOptions: SelectOption[] = states.map((s) => ({
    value: s.id,
    label: s.name,
  }));
  const districtOptions: SelectOption[] = districts.map((d) => ({
    value: d.id,
    label: d.name,
  }));
  return (
    <MainLayout>
      <div className="p-8 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gradient-primary mb-2">
              Optimize Procurement
            </h1>
            <p className="text-gray-600 text-lg">
              Find the best suppliers with AI-powered optimization
            </p>
          </div>

          {/* Main Form Card */}
          <Card variant="glass" className="animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Crop Selection */}
              <SearchableSelect
                label="Select Crop"
                required
                value={cropId}
                onChange={(value) =>
                  setCropId(value === "" ? "" : Number(value))
                }
                options={cropOptions}
                placeholder={
                  cropsLoading ? "Loading crops..." : "Choose a crop"
                }
                disabled={cropsLoading}
              />

              {/* Crop Availability Info */}
              {availabilityLoading && (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Spinner size="sm" />
                  <span>Checking availability...</span>
                </div>
              )}
              {availabilityInfo && !availabilityLoading && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                  <HiInformationCircle className="w-5 h-5 inline mr-2 text-emerald-500" />
                  {availabilityInfo}
                </div>
              )}

              {/* State Selection */}
              <SearchableSelect
                label="Destination State"
                value={stateId}
                onChange={(value) =>
                  setStateId(value === "" ? "" : Number(value))
                }
                options={stateOptions}
                placeholder={statesLoading ? "Loading states..." : "All states"}
                disabled={statesLoading}
              />

              {/* District Selection */}
              <SearchableSelect
                label="Destination District"
                value={districtId}
                onChange={(value) =>
                  setDistrictId(value === "" ? "" : Number(value))
                }
                options={districtOptions}
                placeholder={
                  districtsLoading
                    ? "Loading districts..."
                    : "Select destination district"
                }
                disabled={!stateId || districtsLoading}
              />

              {/* Quantity Input */}
              <Input
                label="Quantity Required"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity in tonnes"
                min={1}
                max={100000}
                step={1}
                required
                helperText="Enter quantity between 1 and 100,000 tonnes"
              />

              {/* Transport Mode Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-3">
                  Transport Mode <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      value: "road",
                      label: "Road Only",
                      icon: <HiTruck className="w-8 h-8 mx-auto" />,
                    },
                    {
                      value: "rail",
                      label: "Rail Only",
                      icon: <RiTrainFill className="w-8 h-8 mx-auto" />,
                    },
                    {
                      value: "both",
                      label: "Both",
                      icon: (
                        <div className="flex justify-center gap-1">
                          <HiTruck className="w-6 h-6" />
                          <RiTrainFill className="w-6 h-6" />
                        </div>
                      ),
                    },
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setTransportMode(mode.value)}
                      style={{ borderColor: "rgb(52 211 153 / 1)" }}
                      className={`
                      p-4 rounded-lg border-2 bg-white transition-all duration-200 shadow-sm
                      ${transportMode === mode.value
                          ? "bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200 shadow-md"
                          : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/40"
                        }
                    `}
                    >
                      <div className="mb-2 flex justify-center">{mode.icon}</div>
                      <div className="text-sm font-semibold">{mode.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2">
                  <HiInformationCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={submitting}
                disabled={submitting}
              >
                {submitting ? "Optimizing..." : "Find Best Options"}
              </Button>
            </form>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card variant="glass" className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                  <HiCurrencyDollar className="w-8 h-8" />
                </div>
              </div>
              <div className="text-slate-400 text-sm mb-1">Best Cost</div>
              <div className="text-emerald-400 font-semibold text-lg">
                Optimized Pricing
              </div>
            </Card>
            <Card variant="glass" className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <HiLightningBolt className="w-8 h-8" />
                </div>
              </div>
              <div className="text-slate-400 text-sm mb-1">
                Fastest Delivery
              </div>
              <div className="text-blue-400 font-semibold text-lg">
                Minimal Transit Time
              </div>
            </Card>
            <Card variant="glass" className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full text-green-600">
                  <FaLeaf className="w-8 h-8" />
                </div>
              </div>
              <div className="text-slate-400 text-sm mb-1">Lowest Carbon</div>
              <div className="text-green-400 font-semibold text-lg">
                Eco-Friendly Routes
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
