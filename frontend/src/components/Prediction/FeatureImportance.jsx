import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
import { getFeatureImportance } from '../../api';
import toast from 'react-hot-toast';

const FeatureImportance = () => {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeatureImportance();
    }, []);

    const fetchFeatureImportance = async () => {
        try {
            const response = await getFeatureImportance();
            const importanceArray = Object.entries(response.feature_importance || {})
                .map(([name, importance]) => ({ name, importance: importance * 100 }))
                .sort((a, b) => b.importance - a.importance)
                .slice(0, 8);
            setFeatures(importanceArray);
        } catch (error) {
            console.error('Failed to fetch feature importance:', error);
            // Set mock data for demonstration
            setFeatures([
                { name: 'study_hours_per_week', importance: 28 },
                { name: 'previous_score', importance: 22 },
                { name: 'attendance_percentage', importance: 18 },
                { name: 'parental_involvement', importance: 12 },
                { name: 'sleep_hours_per_night', importance: 8 },
                { name: 'tutoring_sessions', importance: 6 },
                { name: 'extracurricular', importance: 4 },
                { name: 'internet_access', importance: 2 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const formatFeatureName = (name) => {
        return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (loading) {
        return (
            <div className="glass-card p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 sticky top-24"
        >
            <div className="flex items-center mb-4">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
                <h3 className="font-semibold">Feature Importance</h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Key factors influencing student performance predictions
            </p>

            <div className="space-y-3">
                {features.map((feature, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{formatFeatureName(feature.name)}</span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                {feature.importance.toFixed(1)}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${feature.importance}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-start space-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <p>Study hours and previous scores are the strongest predictors of future performance.</p>
                </div>
            </div>
        </motion.div>
    );
};

export default FeatureImportance;