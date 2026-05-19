import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Train, Settings, AlertCircle } from 'lucide-react';
import { trainModel } from '../../api';
import toast from 'react-hot-toast';

const ModelTraining = ({ onTrainingComplete }) => {
    const [config, setConfig] = useState({
        model_type: 'xgboost',
        test_size: 0.2,
        random_state: 42,
        use_grid_search: false,
        n_iterations: 100,
    });
    const [training, setTraining] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTraining(true);
        setProgress(0);

        // Simulate progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 10;
            });
        }, 500);

        try {
            const response = await trainModel(config);
            toast.success(response.message || 'Training started successfully!');
            setProgress(100);
            setTimeout(() => {
                onTrainingComplete();
                setTraining(false);
                setProgress(0);
            }, 1000);
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Training failed');
            setTraining(false);
            setProgress(0);
        } finally {
            clearInterval(interval);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
        >
            <div className="flex items-center mb-6">
                <Train className="w-6 h-6 mr-2 text-blue-500" />
                <h2 className="text-xl font-semibold">Train New Model</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Model Type</label>
                    <select
                        name="model_type"
                        value={config.model_type}
                        onChange={handleChange}
                        className="input-field"
                        disabled={training}
                    >
                        <option value="random_forest">Random Forest</option>
                        <option value="gradient_boosting">Gradient Boosting</option>
                        <option value="xgboost">XGBoost (Recommended)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Test Size: {config.test_size}</label>
                    <input
                        type="range"
                        name="test_size"
                        min="0.1"
                        max="0.4"
                        step="0.01"
                        value={config.test_size}
                        onChange={handleChange}
                        className="w-full"
                        disabled={training}
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>More training data</span>
                        <span>More validation data</span>
                    </div>
                </div>

                <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="use_grid_search"
                            checked={config.use_grid_search}
                            onChange={handleChange}
                            className="w-4 h-4"
                            disabled={training}
                        />
                        <span className="text-sm font-medium">Use Grid Search for Hyperparameter Tuning</span>
                    </label>
                    <p className="text-xs text-slate-400 mt-1 ml-7">
                        May increase training time but can improve model performance
                    </p>
                </div>

                {config.use_grid_search && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        <label className="block text-sm font-medium mb-2">Number of Iterations</label>
                        <input
                            type="number"
                            name="n_iterations"
                            value={config.n_iterations}
                            onChange={handleChange}
                            min="10"
                            max="500"
                            step="10"
                            className="input-field"
                            disabled={training}
                        />
                    </motion.div>
                )}

                {training && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Training Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            />
                        </div>
                        <p className="text-xs text-slate-400 text-center">
                            This may take a few minutes. Please don't close the page.
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={training}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                    {training ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Training in Progress...</span>
                        </>
                    ) : (
                        <>
                            <Settings className="w-4 h-4" />
                            <span>Start Training</span>
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800 dark:text-yellow-300">
                        Training will replace the current model. Make sure you have enough training data for best results.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default ModelTraining;