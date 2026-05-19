import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ModelTraining from '../components/Training/ModelTraining';
import TrainingHistory from '../components/Training/TrainingHistory';
import { getModelMetrics, getTrainingStatus } from '../api';
import toast from 'react-hot-toast';

const TrainingPage = () => {
    const [metrics, setMetrics] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [metricsData, statusData] = await Promise.all([
                getModelMetrics(),
                getTrainingStatus()
            ]);
            setMetrics(metricsData);
            setStatus(statusData);
        } catch (error) {
            console.error('Failed to fetch training data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTrainingComplete = () => {
        fetchData();
        toast.success('Model training completed successfully!');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">Loading training data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold gradient-text">Model Training</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Train and optimize machine learning models for better predictions
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
                <ModelTraining onTrainingComplete={handleTrainingComplete} />
                <TrainingHistory metrics={metrics} status={status} />
            </div>
        </div>
    );
};

export default TrainingPage;