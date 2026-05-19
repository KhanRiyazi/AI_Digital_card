import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PredictionForm from '../components/Prediction/PredictionForm';
import PredictionResult from '../components/Prediction/PredictionResult';
import FeatureImportance from '../components/Prediction/FeatureImportance';
import { predictSingle } from '../api';
import toast from 'react-hot-toast';

const PredictPage = () => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const handlePredict = async (formData) => {
        setLoading(true);
        try {
            const result = await predictSingle(formData);
            console.log('Prediction result:', result); // Debug log
            setPrediction(result);
            setShowResult(true);
            toast.success('Prediction completed successfully!');
            // Scroll to result
            setTimeout(() => {
                const resultElement = document.getElementById('prediction-result');
                if (resultElement) {
                    resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        } catch (error) {
            console.error('Prediction error:', error);
            toast.error(error.response?.data?.detail || 'Failed to get prediction');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setPrediction(null);
        setShowResult(false);
        toast('Form reset. Ready for new prediction.', { icon: '🔄' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold gradient-text">Student Performance Predictor</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Enter student details to get AI-powered performance predictions and personalized recommendations
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form Section - Takes 2/3 of the space */}
                <div className="lg:col-span-2">
                    <PredictionForm onPredict={handlePredict} loading={loading} />
                </div>

                {/* Feature Importance Sidebar */}
                <div className="lg:col-span-1">
                    <FeatureImportance />
                </div>
            </div>

            {/* Results Section */}
            {showResult && prediction && (
                <div id="prediction-result" className="mt-8">
                    <PredictionResult prediction={prediction} onReset={handleReset} />
                </div>
            )}
        </div>
    );
};

export default PredictPage;