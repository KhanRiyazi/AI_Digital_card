import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Download, RefreshCw } from 'lucide-react';

const PredictionResult = ({ prediction, onReset }) => {
    if (!prediction) return null;

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'Low': return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-500' };
            case 'Medium': return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-500' };
            case 'High': return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-500' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-500' };
        }
    };

    const getScoreMessage = (score) => {
        if (score >= 85) return { emoji: '🎉', message: 'Excellent! Outstanding performance!' };
        if (score >= 70) return { emoji: '👍', message: 'Good job! Keep up the great work!' };
        if (score >= 50) return { emoji: '📈', message: 'Average. Room for improvement.' };
        return { emoji: '⚠️', message: 'Needs attention. Consider intervention.' };
    };

    const scoreMessage = getScoreMessage(prediction.predicted_score);
    const riskStyle = getRiskColor(prediction.risk_level);

    const handleExport = () => {
        const exportData = {
            prediction: prediction,
            exportDate: new Date().toISOString(),
            modelVersion: '1.0'
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prediction-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mt-6"
        >
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-500" />
                    Prediction Results
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={handleExport}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Export results"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onReset}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="New prediction"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Score Card */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
                    <div className="text-6xl font-bold gradient-text mb-2">
                        {Math.round(prediction.predicted_score)}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">out of 100</div>
                    <div className="mt-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${riskStyle.bg} ${riskStyle.text}`}>
                            {prediction.risk_level} Risk Level
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="text-2xl">{scoreMessage.emoji}</span>
                        <p className="text-sm mt-1">{scoreMessage.message}</p>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Performance Analysis
                    </h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div className="text-xs text-slate-500">Confidence Interval</div>
                            <div className="font-semibold">
                                {Math.round(prediction.confidence_interval?.[0] || prediction.predicted_score - 8)} -
                                {Math.round(prediction.confidence_interval?.[1] || prediction.predicted_score + 8)}
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div className="text-xs text-slate-500">Model Used</div>
                            <div className="font-semibold">XGBoost v1.0</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            {prediction.recommendations && prediction.recommendations.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-semibold mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Personalized Recommendations
                    </h3>
                    <div className="space-y-2">
                        {prediction.recommendations.map((rec, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
                            >
                                <span className="text-lg mr-3">📌</span>
                                <span className="text-sm">{rec}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Disclaimer */}
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-start">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                    This prediction is based on machine learning models and historical data. Results should be used as guidance, not as absolute certainty.
                </p>
            </div>
        </motion.div>
    );
};

export default PredictionResult;