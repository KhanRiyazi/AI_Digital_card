import React from 'react';
import { motion } from 'framer-motion';
import { History, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format } from 'date-fns';

const TrainingHistory = ({ metrics, status }) => {
    const getPerformanceIcon = (r2Score) => {
        if (r2Score >= 0.7) return <TrendingUp className="w-4 h-4 text-green-500" />;
        if (r2Score >= 0.5) return <Minus className="w-4 h-4 text-yellow-500" />;
        return <TrendingDown className="w-4 h-4 text-red-500" />;
    };

    const getPerformanceColor = (r2Score) => {
        if (r2Score >= 0.7) return 'text-green-600 dark:text-green-400';
        if (r2Score >= 0.5) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    // Mock historical data (in production, this would come from API)
    const historicalData = [
        {
            id: 1,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            r2_score: 0.72,
            rmse: 12.5,
            mae: 9.8,
            samples: 1500,
        },
        {
            id: 2,
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            r2_score: 0.68,
            rmse: 13.2,
            mae: 10.1,
            samples: 1200,
        },
        {
            id: 3,
            date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
            r2_score: 0.65,
            rmse: 14.1,
            mae: 10.5,
            samples: 1000,
        },
    ];

    const currentMetrics = metrics || {
        r2_score: 0.75,
        rmse: 11.8,
        mae: 9.2,
        training_date: new Date(),
        samples_trained: 2000,
        best_model: 'xgboost'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
        >
            <div className="flex items-center mb-6">
                <History className="w-6 h-6 mr-2 text-purple-500" />
                <h2 className="text-xl font-semibold">Training History</h2>
            </div>

            {/* Current Model Metrics */}
            <div className="mb-6">
                <h3 className="font-semibold mb-3 text-sm">Current Model Performance</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                        <div className="text-xs text-slate-500">R² Score</div>
                        <div className={`text-xl font-bold ${getPerformanceColor(currentMetrics.r2_score)}`}>
                            {(currentMetrics.r2_score * 100).toFixed(1)}%
                        </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div className="text-xs text-slate-500">RMSE</div>
                        <div className="text-xl font-bold">{currentMetrics.rmse?.toFixed(1)}</div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div className="text-xs text-slate-500">MAE</div>
                        <div className="text-xl font-bold">{currentMetrics.mae?.toFixed(1)}</div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div className="text-xs text-slate-500">Samples</div>
                        <div className="text-xl font-bold">{currentMetrics.samples_trained}</div>
                    </div>
                </div>
                <div className="mt-3 text-xs text-slate-400 text-center">
                    Last trained: {currentMetrics.training_date ? format(new Date(currentMetrics.training_date), 'MMM dd, yyyy') : 'Today'}
                </div>
            </div>

            {/* Historical Data */}
            <div>
                <h3 className="font-semibold mb-3 text-sm">Previous Training Runs</h3>
                <div className="space-y-3">
                    {historicalData.map((run, idx) => (
                        <motion.div
                            key={run.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                    {getPerformanceIcon(run.r2_score)}
                                    <span className="text-sm font-medium">
                                        R²: {(run.r2_score * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <span className="text-xs text-slate-400">
                                    {format(run.date, 'MMM dd, yyyy')}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                    <span className="text-slate-500">RMSE:</span>
                                    <span className="ml-1 font-medium">{run.rmse}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">MAE:</span>
                                    <span className="ml-1 font-medium">{run.mae}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">Samples:</span>
                                    <span className="ml-1 font-medium">{run.samples}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Status Indicator */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    <span className="text-sm">Model Status</span>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${status?.is_trained ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-medium">
                            {status?.is_trained ? 'Active' : 'Not Trained'}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TrainingHistory;