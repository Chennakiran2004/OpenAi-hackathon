import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSkeleton } from '../ui';
import Sidebar from '../Sidebar';
import { getImpact, getErrorMessage } from '../../api/clientapi';
import { useAuth } from '../../contexts/AuthContext';
import type { ImpactResponse } from '../../api/types';
import { formatCurrency, formatCarbon, formatRelativeTime, formatTonnes } from '../../utils/formatters';

export default function ImpactDashboard() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [data, setData] = useState<ImpactResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadImpact();
    }, []);

    async function loadImpact() {
        setLoading(true);
        setError('');
        try {
            const result = await getImpact();
            setData(result);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar onLogout={logout} />
                <div className="flex-1 ml-64 p-8">
                    <div className="max-w-7xl mx-auto">
                        <LoadingSkeleton variant="text" width="300px" height="40px" className="mb-8" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <LoadingSkeleton variant="card" count={4} />
                        </div>
                        <LoadingSkeleton variant="card" />
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
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Impact Data</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Button onClick={loadImpact}>Try Again</Button>
                    </Card>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const carbonSavingsPercent = data.total_carbon_footprint_kg > 0
        ? (data.carbon_saved_kg / data.total_carbon_footprint_kg) * 100
        : 0;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar onLogout={logout} />
            <div className="flex-1 ml-64 p-8 animate-fade-in">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gradient-primary mb-2">
                            Impact Dashboard
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Track your procurement efficiency and environmental impact
                        </p>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Queries */}
                        <Card variant="glass" className="hover-lift animate-slide-up">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-lg bg-blue-500/20">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-100 mb-1">
                                {data.total_queries}
                            </div>
                            <div className="text-slate-400 text-sm">Total Queries</div>
                        </Card>

                        {/* Total Cost Managed */}
                        <Card variant="glass" className="hover-lift animate-slide-up" style={{ animationDelay: '50ms' }}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-lg bg-emerald-500/20">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-emerald-400 mb-1">
                                {formatCurrency(data.total_optimized_cost)}
                            </div>
                            <div className="text-slate-400 text-sm">Total Cost Managed</div>
                        </Card>

                        {/* Carbon Footprint */}
                        <Card variant="glass" className="hover-lift animate-slide-up" style={{ animationDelay: '100ms' }}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-lg bg-amber-500/20">
                                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-amber-400 mb-1">
                                {formatCarbon(data.total_carbon_footprint_kg)}
                            </div>
                            <div className="text-slate-400 text-sm">Carbon Tracked</div>
                        </Card>

                        {/* Carbon Saved */}
                        <Card variant="glass" className="hover-lift animate-slide-up" style={{ animationDelay: '150ms' }}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-lg bg-green-500/20">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-green-400 mb-1">
                                {formatCarbon(data.carbon_saved_kg)}
                            </div>
                            <div className="text-slate-400 text-sm">
                                Carbon Saved ({carbonSavingsPercent.toFixed(1)}%)
                            </div>
                        </Card>
                    </div>

                    {/* Carbon Savings Visualization */}
                    {data.total_carbon_footprint_kg > 0 && (
                        <Card variant="glass" className="mb-8">
                            <h3 className="text-xl font-bold text-slate-100 mb-4">Carbon Impact</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-400">Total Carbon Footprint</span>
                                        <span className="text-amber-400 font-semibold">
                                            {formatCarbon(data.total_carbon_footprint_kg)}
                                        </span>
                                    </div>
                                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-400">Carbon Saved</span>
                                        <span className="text-green-400 font-semibold">
                                            {formatCarbon(data.carbon_saved_kg)}
                                        </span>
                                    </div>
                                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000"
                                            style={{ width: `${carbonSavingsPercent}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Recent Queries */}
                    <Card variant="glass">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-100">Recent Queries</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/history')}
                            >
                                View All →
                            </Button>
                        </div>

                        {data.recent_queries.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📊</div>
                                <p className="text-slate-400 mb-6">No queries yet</p>
                                <Button onClick={() => navigate('/dashboard')}>
                                    Create Your First Query
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {data.recent_queries.slice(0, 5).map((query) => {
                                    const bestResult = query.results[0];
                                    return (
                                        <div
                                            key={query.id}
                                            onClick={() => navigate(`/results/${query.id}`)}
                                            className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-200 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="font-semibold text-slate-100">
                                                            {formatTonnes(query.required_quantity_tonnes)} of {query.crop_name}
                                                        </span>
                                                        <span className="text-slate-500">→</span>
                                                        <span className="text-slate-600 text-sm">
                                                            {query.district_name}, {query.state_name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                                        <span>{formatRelativeTime(query.created_at)}</span>
                                                        {bestResult && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="text-emerald-400">
                                                                    Best: {formatCurrency(bestResult.total_cost)}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
