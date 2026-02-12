import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSkeleton, Input } from '../ui';
import Sidebar from '../Sidebar';
import { getHistory, getErrorMessage } from '../../api/clientapi';
import { useAuth } from '../../contexts/AuthContext';
import type { HistoryItem } from '../../api/types';
import { formatRelativeTime, formatTonnes, formatCurrency } from '../../utils/formatters';
import { HiSearch, HiExclamationCircle, HiClipboardList, HiClock, HiViewList, HiArrowRight } from 'react-icons/hi';

export default function QueryHistory() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = history.filter(item =>
                item.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.state_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.district_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredHistory(filtered);
        } else {
            setFilteredHistory(history);
        }
    }, [searchTerm, history]);

    async function loadHistory() {
        setLoading(true);
        setError('');
        try {
            const data = await getHistory();
            setHistory(data);
            setFilteredHistory(data);
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
                    <div className="max-w-5xl mx-auto">
                        <LoadingSkeleton variant="text" width="300px" height="40px" className="mb-8" />
                        <LoadingSkeleton variant="card" count={5} />
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading History</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Button onClick={loadHistory}>Try Again</Button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar onLogout={logout} />
            <div className="flex-1 ml-64 p-8 animate-fade-in">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">
                            Query History
                        </h1>
                        <p className="text-gray-600 text-lg font-medium">
                            View and revisit your past procurement optimizations
                        </p>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by crop, state, or district..."
                            icon={<HiSearch className="w-5 h-5 text-gray-400" />}
                        />
                    </div>

                    {/* History List */}
                    {filteredHistory.length === 0 ? (
                        <Card variant="elevated" className="text-center py-12">
                            <div className="flex justify-center mb-4">
                                <HiClipboardList className="text-gray-300 text-6xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">
                                {searchTerm ? 'No Results Found' : 'No History Yet'}
                            </h3>
                            <p className="text-gray-600 mb-6 font-medium">
                                {searchTerm
                                    ? 'Try a different search term'
                                    : 'Start by creating your first optimization query'}
                            </p>
                            {!searchTerm && (
                                <Button onClick={() => navigate('/optimize')}>
                                    Create New Query
                                </Button>
                            )}
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredHistory.map((item, index) => {
                                const bestResult = item.results.reduce((best, current) =>
                                    parseFloat(current.total_cost) < parseFloat(best.total_cost) ? current : best
                                    , item.results[0]);

                                return (
                                    <Card
                                        key={item.id}
                                        variant="elevated"
                                        onClick={() => navigate(`/results/${item.id}`)}
                                        className="animate-slide-up group cursor-pointer hover:border-brand-primary transition-all duration-300"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="text-xl font-bold text-gray-900 font-display">
                                                        {formatTonnes(item.required_quantity_tonnes)} of {item.crop_name}
                                                    </h3>
                                                    <span className="text-gray-400 font-bold">→</span>
                                                    <span className="text-brand-primary font-bold">
                                                        {item.district_name}, {item.state_name}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <HiClock className="text-brand-primary" />
                                                        {formatRelativeTime(item.created_at)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <HiViewList className="text-brand-primary" />
                                                        {item.results.length} options found
                                                    </span>
                                                </div>

                                                {bestResult && (
                                                    <div className="flex items-center gap-6 text-sm bg-primary-50 p-3 rounded-lg border border-primary-100">
                                                        <div>
                                                            <span className="text-gray-600 font-bold uppercase tracking-wider text-xs">Best Source: </span>
                                                            <span className="text-brand-primary font-bold">
                                                                {bestResult.supplier_state_name}
                                                            </span>
                                                        </div>
                                                        <div className="h-4 w-px bg-primary-200"></div>
                                                        <div>
                                                            <span className="text-gray-600 font-bold uppercase tracking-wider text-xs">Total Cost: </span>
                                                            <span className="text-brand-primary font-bold">
                                                                {formatCurrency(bestResult.total_cost)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-2 text-gray-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all">
                                                <HiArrowRight className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    {/* Stats */}
                    {filteredHistory.length > 0 && !searchTerm && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card variant="elevated" className="text-center group hover:border-brand-primary transition-all">
                                <div className="text-3xl font-bold text-brand-primary mb-1">
                                    {filteredHistory.length}
                                </div>
                                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Queries</div>
                            </Card>
                            <Card variant="elevated" className="text-center group hover:border-brand-primary transition-all">
                                <div className="text-3xl font-bold text-brand-primary mb-1">
                                    {new Set(filteredHistory.map(h => h.crop_name)).size}
                                </div>
                                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Different Crops</div>
                            </Card>
                            <Card variant="elevated" className="text-center group hover:border-brand-primary transition-all">
                                <div className="text-3xl font-bold text-brand-primary mb-1">
                                    {filteredHistory.reduce((sum, h) => sum + h.results.length, 0)}
                                </div>
                                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Options Analyzed</div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
