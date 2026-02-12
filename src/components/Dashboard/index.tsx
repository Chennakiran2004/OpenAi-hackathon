import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSkeleton } from '../ui';
import Sidebar from '../Sidebar';
import { getImpact, getErrorMessage } from '../../api/clientapi';
import { useAuth } from '../../contexts/AuthContext';
import type { ImpactResponse } from '../../api/types';
import { formatCurrency, formatCarbon, formatRelativeTime, formatTonnes } from '../../utils/formatters';
import { HiExclamationCircle, HiChartBar, HiSearch, HiArrowRight } from 'react-icons/hi';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [data, setData] = useState<ImpactResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
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

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar onLogout={logout} />

            {/* Main Content */}
            <div className="flex-1 ml-64">
                <div className="p-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">
                            Welcome, {user?.name || 'User'}
                        </h1>
                        <p className="text-gray-600 font-medium">
                            {user?.profile?.designation || 'Officer'}, {user?.profile?.state_name || 'India'}
                        </p>
                    </div>

                    {loading ? (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <LoadingSkeleton variant="card" count={3} />
                            </div>
                            <LoadingSkeleton variant="card" />
                        </div>
                    ) : error ? (
                        <Card variant="elevated" className="text-center py-12">
                            <div className="flex justify-center mb-4">
                                <HiExclamationCircle className="text-red-500 text-6xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <Button onClick={loadDashboardData}>Try Again</Button>
                        </Card>
                    ) : data ? (
                        <>
                            {/* Metrics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {/* Total Queries */}
                                <Card variant="elevated" className="text-center group hover:border-brand-primary transition-all duration-300">
                                    <div className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wider">Total Queries</div>
                                    <div className="text-4xl font-bold text-gray-900 mb-1">
                                        {data.total_queries}
                                    </div>
                                    <div className="text-gray-400 text-xs font-medium">Procurement requests</div>
                                </Card>

                                {/* Money Saved */}
                                <Card variant="elevated" className="text-center group hover:border-green-400 transition-all duration-300">
                                    <div className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wider">Money Saved</div>
                                    <div className="text-4xl font-bold text-green-600 mb-1">
                                        {formatCurrency(data.total_optimized_cost)}
                                    </div>
                                    <div className="text-gray-400 text-xs font-medium">Through optimization</div>
                                </Card>

                                {/* Carbon Saved */}
                                <Card variant="elevated" className="text-center group hover:border-brand-primary transition-all duration-300">
                                    <div className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wider">Carbon Saved</div>
                                    <div className="text-4xl font-bold text-green-600 mb-1">
                                        {formatCarbon(data.carbon_saved_kg)}
                                    </div>
                                    <div className="text-gray-400 text-xs font-medium">Environmental impact</div>
                                </Card>
                            </div>

                            {/* Recent Queries */}
                            <Card variant="elevated">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 font-display">Recent Queries</h2>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate('/history')}
                                        className="flex items-center gap-1 group"
                                    >
                                        View All <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>

                                {data.recent_queries.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="flex justify-center mb-4">
                                            <HiChartBar className="text-gray-300 text-6xl" />
                                        </div>
                                        <p className="text-gray-500 mb-6 font-medium">No queries yet</p>
                                        <Button onClick={() => navigate('/optimize')}>
                                            Create Your First Query
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Crop</th>
                                                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                                                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                                                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">View</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.recent_queries.slice(0, 5).map((query) => (
                                                    <tr
                                                        key={query.id}
                                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <td className="py-3 px-4 text-gray-900 font-semibold">{query.crop_name}</td>
                                                        <td className="py-3 px-4 text-gray-700 font-medium">
                                                            {formatTonnes(query.required_quantity_tonnes)}
                                                        </td>
                                                        <td className="py-3 px-4 text-gray-600 text-sm">
                                                            {query.district_name}, {query.state_name}
                                                        </td>
                                                        <td className="py-3 px-4 text-gray-600 text-sm font-medium">
                                                            {formatRelativeTime(query.created_at)}
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <button
                                                                onClick={() => navigate(`/results/${query.id}`)}
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors group"
                                                            >
                                                                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Card>

                            {/* Quick Action */}
                            <div className="mt-8 text-center">
                                <Button
                                    size="lg"
                                    onClick={() => navigate('/optimize')}
                                    className="px-8 flex items-center gap-2 mx-auto"
                                >
                                    <HiSearch /> New Optimization Query
                                </Button>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
