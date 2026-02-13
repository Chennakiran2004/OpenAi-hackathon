import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getCrops,
  getImpact,
  getResult,
  optimize,
  getCropAvailability,
  getHistory,
  getPredict,
  getErrorMessage,
  getStoredUser,
  getAccessToken,
  getProduction,
  getDemandSupply,
  getCropPrices,
} from '../api/clientapi';
import type {
  CropOption,
  OptimizeResponse,
  CropAvailabilityResponse,
  PredictResponse,
  ProductionData,
  DemandSupply,
  CropPrice,
  AISummary,
} from '../api/types';
import {
  mapOptimizeResultsToRecommendations,
  mapImpactResponseToSummary,
} from '../api/mappers';
import type {
  ProcessingStatus,
  Recommendation,
  WeightConfig,
  ImpactSummary,
} from '../components/types';
type RecruiterContextValue = {
  cropId: number | null;
  setCropId: (value: number | null) => void;
  cropOptions: CropOption[];
  cropOptionsLoading: boolean;
  quantity: number;
  setQuantity: (value: number) => void;
  urgency: string;
  setUrgency: (value: string) => void;
  deliveryWindow: string;
  setDeliveryWindow: (value: string) => void;
  priceCap: string;
  setPriceCap: (value: string) => void;
  climateMode: boolean;
  setClimateMode: (value: boolean) => void;
  transportMode: string;
  setTransportMode: (value: string) => void;
  weights: WeightConfig;
  setWeights: (value: WeightConfig) => void;
  recommendations: Recommendation[];
  impacts: ImpactSummary | null;
  recentQueries: OptimizeResponse[];
  impactsLoading: boolean;
  status: ProcessingStatus;
  progress: number;
  aiSummary: string | AISummary | null;
  optimizationError: string | null;
  runOptimization: () => Promise<void>;
  loadCrops: () => Promise<void>;
  loadImpact: () => Promise<void>;
  cropAvailability: CropAvailabilityResponse | null;
  cropAvailabilityLoading: boolean;
  loadCropAvailability: (cropId: number | null) => void;
  history: OptimizeResponse[];
  historyLoading: boolean;
  loadHistory: () => Promise<void>;
  prediction: PredictResponse | null;
  predictionLoading: boolean;
  loadPrediction: (cropId: number | null) => void;
  productionData: ProductionData[];
  productionLoading: boolean;
  loadProduction: (cropId?: number, cropYear?: number, season?: string) => Promise<void>;
  demandSupply: DemandSupply[];
  demandSupplyLoading: boolean;
  loadDemandSupply: () => Promise<void>;
  cropPrices: CropPrice[];
  pricesLoading: boolean;
  loadCropPrices: (cropId?: number, year?: number) => Promise<void>;
};

const RecruiterContext = createContext<RecruiterContextValue | null>(null);

export function RecruiterProvider({ children }: { children: React.ReactNode }) {

  const [cropId, setCropId] = useState<number | null>(null);
  const [cropOptions, setCropOptions] = useState<CropOption[]>([]);
  const [cropOptionsLoading, setCropOptionsLoading] = useState(false);
  const [quantity, setQuantity] = useState(10);
  const [urgency, setUrgency] = useState('Standard');
  const [deliveryWindow, setDeliveryWindow] = useState('3-5 days');
  const [priceCap, setPriceCap] = useState('');
  const [climateMode, setClimateMode] = useState(false);
  const [transportMode, setTransportMode] = useState('both');
  const [weights, setWeights] = useState<WeightConfig>({
    cost: 50,
    time: 25,
    carbon: 25,
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [impacts, setImpacts] = useState<ImpactSummary | null>(null);
  const [recentQueries, setRecentQueries] = useState<OptimizeResponse[]>([]);
  const [impactsLoading, setImpactsLoading] = useState(false);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [aiSummary, setAiSummary] = useState<string | AISummary | null>(null);
  const [optimizationError, setOptimizationError] = useState<string | null>(null);
  const [cropAvailability, setCropAvailability] = useState<CropAvailabilityResponse | null>(null);
  const [cropAvailabilityLoading, setCropAvailabilityLoading] = useState(false);
  const [history, setHistory] = useState<OptimizeResponse[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictResponse | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [productionData, setProductionData] = useState<ProductionData[]>([]);
  const [productionLoading, setProductionLoading] = useState(false);
  const [demandSupply, setDemandSupply] = useState<DemandSupply[]>([]);
  const [demandSupplyLoading, setDemandSupplyLoading] = useState(false);
  const [cropPrices, setCropPrices] = useState<CropPrice[]>([]);
  const [pricesLoading, setPricesLoading] = useState(false);

  const progressPercent = useMemo(
    () => (status === 'running' || status === 'done' ? Math.min(100, progress) : 0),
    [status, progress]
  );

  const loadCrops = useCallback(async () => {
    setCropOptionsLoading(true);
    try {
      const list = await getCrops();
      setCropOptions(list);
    } catch {
      setCropOptions([]);
    } finally {
      setCropOptionsLoading(false);
    }
  }, []);

  const loadImpact = useCallback(async () => {
    setImpactsLoading(true);
    try {
      const data = await getImpact();
      setImpacts(mapImpactResponseToSummary(data));
      setRecentQueries(data.recent_queries ?? []);
    } catch {
      setImpacts(null);
      setRecentQueries([]);
    } finally {
      setImpactsLoading(false);
    }
  }, []);

  const loadCropAvailability = useCallback((cropIdParam: number | null) => {
    if (cropIdParam == null) {
      setCropAvailability(null);
      return;
    }
    setCropAvailabilityLoading(true);
    getCropAvailability(cropIdParam)
      .then(setCropAvailability)
      .catch(() => setCropAvailability(null))
      .finally(() => setCropAvailabilityLoading(false));
  }, []);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const list = await getHistory();
      setHistory(list);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const loadPrediction = useCallback((cropIdParam: number | null) => {
    if (cropIdParam == null) {
      setPrediction(null);
      return;
    }
    setPredictionLoading(true);
    const stored = getStoredUser();
    const stateId = stored?.profile?.state;
    getPredict(cropIdParam, stateId)
      .then(setPrediction)
      .catch(() => setPrediction(null))
      .finally(() => setPredictionLoading(false));
  }, []);

  const loadProduction = useCallback(async (cropId?: number, cropYear?: number, season?: string) => {
    setProductionLoading(true);
    try {
      const stored = getStoredUser();
      const stateId = stored?.profile?.state;
      const list = await getProduction(cropId, stateId, cropYear, season);
      setProductionData(list);
    } catch {
      setProductionData([]);
    } finally {
      setProductionLoading(false);
    }
  }, []);

  const loadDemandSupply = useCallback(async () => {
    setDemandSupplyLoading(true);
    try {
      const list = await getDemandSupply();
      setDemandSupply(list);
    } catch {
      setDemandSupply([]);
    } finally {
      setDemandSupplyLoading(false);
    }
  }, []);

  const loadCropPrices = useCallback(async (cropId?: number, year?: number) => {
    setPricesLoading(true);
    try {
      const stored = getStoredUser();
      const stateId = stored?.profile?.state;
      const list = await getCropPrices(cropId, stateId, year);
      setCropPrices(list);
    } catch {
      setCropPrices([]);
    } finally {
      setPricesLoading(false);
    }
  }, []);

  const runOptimization = useCallback(async () => {
    const stored = getStoredUser();
    const stateId = stored?.profile?.state;
    const districtId = stored?.profile?.district;

    if (cropId == null) {
      setOptimizationError('Please select a crop.');
      return;
    }
    if (stateId == null || districtId == null) {
      setOptimizationError('Your profile must have a state and district. Update your account or re-login.');
      return;
    }
    if (quantity < 1) {
      setOptimizationError('Quantity must be at least 1 tonne.');
      return;
    }

    setOptimizationError(null);
    setStatus('running');
    setProgress(30);

    try {
      const response = await optimize({
        crop_id: cropId,
        state_id: stateId,
        district_id: districtId,
        quantity_tonnes: quantity,
        transport_mode: transportMode,
      });
      setProgress(70);

      const mapped = mapOptimizeResultsToRecommendations(response.results, response.crop_name);
      setRecommendations(mapped);

      let summary: string | AISummary | null = null;
      try {
        const detail = await getResult(response.id);
        summary = detail.ai_summary ?? null;
      } catch {
        summary = null;
      }
      setAiSummary(summary);
      setProgress(100);
      setStatus('done');
      loadHistory();
    } catch (err) {
      setOptimizationError(getErrorMessage(err));
      setStatus('done');
      setProgress(0);
      setRecommendations([]);
      setAiSummary(null);
    }
  }, [cropId, quantity, loadHistory, transportMode]);

  useEffect(() => {
    // Only load crops if user is authenticated
    const token = getAccessToken();
    if (!token) return;
    loadCrops();
  }, [loadCrops]);

  useEffect(() => {
    // Only load impact and history if user is authenticated
    const token = getAccessToken();
    if (!token) return;
    loadImpact();
    loadHistory();
  }, [loadImpact, loadHistory]);

  useEffect(() => {
    // Only load crop availability if user is authenticated
    const token = getAccessToken();
    if (!token) return;
    loadCropAvailability(cropId);
  }, [cropId, loadCropAvailability]);

  useEffect(() => {
    // Only load prediction if user is authenticated
    const token = getAccessToken();
    if (!token) return;
    loadPrediction(cropId);
  }, [cropId, loadPrediction]);

  const value: RecruiterContextValue = {
    cropId,
    setCropId,
    cropOptions,
    cropOptionsLoading,
    quantity,
    setQuantity,
    urgency,
    setUrgency,
    deliveryWindow,
    setDeliveryWindow,
    priceCap,
    setPriceCap,
    climateMode,
    setClimateMode,
    transportMode,
    setTransportMode,
    weights,
    setWeights,
    recommendations,
    impacts,
    recentQueries,
    impactsLoading,
    status,
    progress: progressPercent,
    aiSummary,
    optimizationError,
    runOptimization,
    loadCrops,
    loadImpact,
    cropAvailability,
    cropAvailabilityLoading,
    loadCropAvailability,
    history,
    historyLoading,
    loadHistory,
    prediction,
    predictionLoading,
    loadPrediction,
    productionData,
    productionLoading,
    loadProduction,
    demandSupply,
    demandSupplyLoading,
    loadDemandSupply,
    cropPrices,
    pricesLoading,
    loadCropPrices,
  };

  return (
    <RecruiterContext.Provider value={value}>
      {children}
    </RecruiterContext.Provider>
  );
}

export function useRecruiter(): RecruiterContextValue {
  const ctx = useContext(RecruiterContext);
  if (!ctx) throw new Error('useRecruiter must be used within RecruiterProvider');
  return ctx;
}
