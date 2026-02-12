import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSkeleton } from '../ui';
import SearchableSelect from '../ui/SearchableSelect';
import type { SelectOption } from '../ui';
import Sidebar from '../Sidebar';
import { getCrops, getStates, getPredict, getErrorMessage } from '../../api/clientapi';
import { useAuth } from '../../contexts/AuthContext';
import type { CropOption, StateOption, PredictResponse } from '../../api/types';
import CanvasJSReact from '@canvasjs/react-charts';
import { HiTrendingUp, HiTrendingDown, HiExclamation, HiLightBulb, HiChip } from 'react-icons/hi';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function DemandPrediction() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Form state
    const [cropId, setCropId] = useState<number | ''>('');
    const [stateId, setStateId] = useState<number | ''>('');

    // Options state
    const [crops, setCrops] = useState<CropOption[]>([]);
    const [states, setStates] = useState<StateOption[]>([]);

    // Loading states
    const [cropsLoading, setCropsLoading] = useState(false);
    const [statesLoading, setStatesLoading] = useState(false);
    const [predictionLoading, setPredictionLoading] = useState(false);

    // Prediction data
    const [predictionData, setPredictionData] = useState<PredictResponse | null>(null);
    const [error, setError] = useState<string>('');

    // Load crops and states on mount
    useEffect(() => {
        loadCrops();
        loadStates();
    }, []);

    // Load prediction when crop or state changes
    useEffect(() => {
        if (cropId) {
            loadPrediction();
        } else {
            setPredictionData(null);
        }
    }, [cropId, stateId]);

    async function loadCrops() {
        setCropsLoading(true);
        try {
            const data = await getCrops();
            setCrops(data);
        } catch (err) {
            console.error('Failed to load crops:', err);
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
            console.error('Failed to load states:', err);
        } finally {
            setStatesLoading(false);
        }
    }

    async function loadPrediction() {
        if (!cropId) return;

        setPredictionLoading(true);
        setError('');
        try {
            const data = await getPredict(
                cropId as number,
                stateId ? (stateId as number) : undefined
            );
            setPredictionData(data);
        } catch (err) {
            setError(getErrorMessage(err));
            setPredictionData(null);
        } finally {
            setPredictionLoading(false);
        }
    }

    const cropOptions: SelectOption[] = crops.map(c => ({ value: c.id, label: c.name }));
    const stateOptions: SelectOption[] = states.map(s => ({ value: s.id, label: s.name }));

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar onLogout={logout} />
            <div className="flex-1 ml-64 p-8 animate-fade-in">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Demand Prediction
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Analyze historical trends and predict future crop production
                        </p>
                    </div>

                    {/* Filters */}
                    <Card variant="elevated" className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SearchableSelect
                                label="Select Crop"
                                required
                                value={cropId}
                                onChange={(value) => setCropId(value === '' ? '' : Number(value))}
                                options={cropOptions}
                                placeholder={cropsLoading ? 'Loading crops...' : 'Choose a crop'}
                                disabled={cropsLoading}
                            />
                            <SearchableSelect
                                label="Select State (Optional)"
                                value={stateId}
                                onChange={(value) => setStateId(value === '' ? '' : Number(value))}
                                options={stateOptions}
                                placeholder={statesLoading ? 'Loading states...' : 'All states'}
                                disabled={statesLoading}
                            />
                        </div>
                    </Card>

                    {/* Loading State */}
                    {predictionLoading && (
                        <div>
                            <LoadingSkeleton variant="card" className="mb-6" />
                            <LoadingSkeleton variant="card" />
                        </div>
                    )}

                    {/* Error State */}
                    {error && !predictionLoading && (
                        <Card variant="elevated" className="text-center py-12">
                            <div className="flex justify-center mb-4">
                                <HiExclamation className="text-red-500 text-6xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Prediction</h3>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <Button onClick={loadPrediction}>Try Again</Button>
                        </Card>
                    )}

                    {/* Empty State */}
                    {!cropId && !predictionLoading && (
                        <Card variant="elevated" className="text-center py-12">
                            <div className="flex justify-center mb-4">
                                <HiTrendingUp className="text-green-500 text-6xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Select a Crop to View Predictions
                            </h3>
                            <p className="text-gray-600">
                                Choose a crop from the dropdown above to see historical data and AI-powered predictions
                            </p>
                        </Card>
                    )}

                    {/* Prediction Results */}
                    {predictionData && !predictionLoading && !error && (
                        <>

                            {/* AI Prediction */}
                            <Card variant="elevated" className="border-l-4 border-brand-primary">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-brand-light rounded-xl text-brand-primary">
                                        <HiChip className="text-4xl" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-brand-primary mb-4">
                                            AI Prediction & Forecast
                                        </h3>

                                        {predictionData.prediction.error ? (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                                                {predictionData.prediction.error}
                                            </div>
                                        ) : (
                                            <>
                                                {/* Trend Summary */}
                                                <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-brand-light rounded-lg border border-primary-200">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className={`p-2 rounded-lg ${predictionData.prediction.trend === 'increasing' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                            {predictionData.prediction.trend === 'increasing' ? <HiTrendingUp className="text-3xl" /> : <HiTrendingDown className="text-3xl" />}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-gray-900 text-lg capitalize">
                                                                {predictionData.prediction.trend} Trend
                                                            </span>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-sm text-gray-600">Confidence:</span>
                                                                <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
                                                                    <div
                                                                        className="bg-brand-primary h-2 rounded-full transition-all"
                                                                        style={{ width: `${predictionData.prediction.confidence * 100}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-sm font-semibold text-brand-primary">
                                                                    {(predictionData.prediction.confidence * 100).toFixed(0)}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed">
                                                        {predictionData.prediction.analysis}
                                                    </p>
                                                </div>

                                                {/* Forecast Graph */}
                                                {predictionData.prediction.forecast && predictionData.prediction.forecast.length > 0 && (
                                                    <div className="mb-6">
                                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                                            5-Year Demand Forecast
                                                        </h4>

                                                        {/* CanvasJS Chart */}
                                                        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                                                            <CanvasJSChart options={{
                                                                animationEnabled: true,
                                                                theme: "light2",
                                                                backgroundColor: "#ffffff",
                                                                title: {
                                                                    text: `${predictionData.crop.name} Demand Forecast`,
                                                                    fontSize: 18,
                                                                    fontFamily: "Manrope, sans-serif",
                                                                    fontColor: "#1f2937"
                                                                },
                                                                axisX: {
                                                                    title: "Year",
                                                                    labelFontSize: 12,
                                                                    labelFontFamily: "Manrope, sans-serif"
                                                                },
                                                                axisY: {
                                                                    title: "Predicted Demand (Million Tonnes)",
                                                                    labelFontSize: 12,
                                                                    labelFontFamily: "Manrope, sans-serif",
                                                                    suffix: "M"
                                                                },
                                                                data: [{
                                                                    type: "spline",
                                                                    color: "#10b981",
                                                                    lineColor: "#10b981",
                                                                    markerColor: "#059669",
                                                                    markerSize: 8,
                                                                    xValueFormatString: "####",
                                                                    yValueFormatString: "#,##0.00M tonnes",
                                                                    dataPoints: predictionData.prediction.forecast.map(point => ({
                                                                        x: point.year,
                                                                        y: point.predicted_demand_tonnes / 1000000,
                                                                        label: point.year.toString(),
                                                                        indexLabel: point.year === predictionData.prediction.current_year + 1 ? "Next Year" : "",
                                                                        indexLabelFontColor: "#059669"
                                                                    }))
                                                                }],
                                                                height: 300
                                                            }} />
                                                        </div>

                                                        {/* AI Suggestions */}
                                                        <div className="space-y-3">
                                                            <h5 className="text-sm font-semibold text-gray-700 mb-2">AI Recommendations</h5>
                                                            {predictionData.prediction.forecast.map((point, index) => {
                                                                const isCurrentYear = point.year === predictionData.prediction.current_year + 1;
                                                                return (
                                                                    <div key={point.year} className={`p-3 rounded-lg border ${isCurrentYear
                                                                        ? 'bg-primary-50 border-brand-primary'
                                                                        : 'bg-gray-50 border-gray-200'
                                                                        }`}>
                                                                        <div className="flex items-start gap-2">
                                                                            <HiLightBulb className="text-brand-primary text-xl mt-0.5" />
                                                                            <div className="flex-1">
                                                                                <div className="flex items-center gap-2 mb-1">
                                                                                    <span className={`text-sm font-bold ${isCurrentYear ? 'text-brand-primary' : 'text-gray-700'}`}>
                                                                                        {point.year}
                                                                                        {isCurrentYear && <span className="ml-2 text-xs bg-brand-primary text-white px-2 py-0.5 rounded">Next Year</span>}
                                                                                    </span>
                                                                                    <span className="text-xs text-gray-500">•</span>
                                                                                    <span className="text-xs font-medium text-gray-600">
                                                                                        {(point.predicted_demand_tonnes / 1000000).toFixed(2)}M tonnes
                                                                                    </span>
                                                                                    <span className="text-xs text-gray-500">•</span>
                                                                                    <span className={`text-xs font-medium ${point.confidence >= 0.7 ? 'text-green-600' :
                                                                                        point.confidence >= 0.5 ? 'text-yellow-600' :
                                                                                            'text-orange-600'
                                                                                        }`}>
                                                                                        {(point.confidence * 100).toFixed(0)}% confidence
                                                                                    </span>
                                                                                </div>
                                                                                <p className="text-xs text-gray-600 leading-relaxed">
                                                                                    {point.suggestion}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Summary Stats */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                        <div className="text-sm text-green-600 mb-1">Highest Forecast</div>
                                                        <div className="text-2xl font-bold text-green-900">
                                                            {(Math.max(...predictionData.prediction.forecast.map(p => p.predicted_demand_tonnes)) / 1000000).toFixed(2)}M
                                                        </div>
                                                        <div className="text-xs text-green-700 mt-1">
                                                            Year {predictionData.prediction.forecast.reduce((max, p) =>
                                                                p.predicted_demand_tonnes > max.predicted_demand_tonnes ? p : max
                                                            ).year}
                                                        </div>
                                                    </div>
                                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                                        <div className="text-sm text-blue-600 mb-1">Lowest Forecast</div>
                                                        <div className="text-2xl font-bold text-blue-900">
                                                            {(Math.min(...predictionData.prediction.forecast.map(p => p.predicted_demand_tonnes)) / 1000000).toFixed(2)}M
                                                        </div>
                                                        <div className="text-xs text-blue-700 mt-1">
                                                            Year {predictionData.prediction.forecast.reduce((min, p) =>
                                                                p.predicted_demand_tonnes < min.predicted_demand_tonnes ? p : min
                                                            ).year}
                                                        </div>
                                                    </div>
                                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                                        <div className="text-sm text-purple-600 mb-1">Average Forecast</div>
                                                        <div className="text-2xl font-bold text-purple-900">
                                                            {(predictionData.prediction.forecast.reduce((sum, p) => sum + p.predicted_demand_tonnes, 0) / predictionData.prediction.forecast.length / 1000000).toFixed(2)}M
                                                        </div>
                                                        <div className="text-xs text-purple-700 mt-1">
                                                            {predictionData.prediction.forecast.length} years
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
