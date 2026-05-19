import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, RefreshCw, HelpCircle } from 'lucide-react';

const PredictionForm = ({ onPredict, loading }) => {
    const [formData, setFormData] = useState({
        study_hours_per_week: 20,
        previous_score: 75,
        attendance_percentage: 85,
        sleep_hours_per_night: 7,
        extracurricular_activities: 'Yes',
        parental_involvement: 'Medium',
        internet_access: 'Yes',
        tutoring_sessions_per_week: 1,
        gender: 'Female',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onPredict(formData);
    };

    const handleReset = () => {
        setFormData({
            study_hours_per_week: 20,
            previous_score: 75,
            attendance_percentage: 85,
            sleep_hours_per_night: 7,
            extracurricular_activities: 'Yes',
            parental_involvement: 'Medium',
            internet_access: 'Yes',
            tutoring_sessions_per_week: 1,
            gender: 'Female',
        });
    };

    const inputFields = [
        { label: 'Study Hours/Week', name: 'study_hours_per_week', type: 'number', min: 0, max: 60, step: 0.5, icon: '📚', tooltip: 'Hours spent studying per week' },
        { label: 'Previous Score', name: 'previous_score', type: 'number', min: 0, max: 100, step: 1, icon: '📝', tooltip: 'Previous exam score (0-100)' },
        { label: 'Attendance %', name: 'attendance_percentage', type: 'number', min: 0, max: 100, step: 1, icon: '🎯', tooltip: 'Class attendance percentage' },
        { label: 'Sleep Hours/Night', name: 'sleep_hours_per_night', type: 'number', min: 0, max: 16, step: 0.5, icon: '😴', tooltip: 'Average sleep hours per night' },
        { label: 'Tutoring Sessions/Week', name: 'tutoring_sessions_per_week', type: 'number', min: 0, max: 10, step: 1, icon: '👨‍🏫', tooltip: 'Number of tutoring sessions per week' },
    ];

    const selectFields = [
        { label: 'Extracurricular Activities', name: 'extracurricular_activities', options: ['Yes', 'No'], icon: '🎨' },
        { label: 'Parental Involvement', name: 'parental_involvement', options: ['Low', 'Medium', 'High'], icon: '👪' },
        { label: 'Internet Access', name: 'internet_access', options: ['Yes', 'No'], icon: '🌐' },
        { label: 'Gender', name: 'gender', options: ['Male', 'Female'], icon: '👤' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                    <span className="mr-2">📊</span>
                    Student Information
                </h2>
                <button
                    type="button"
                    onClick={handleReset}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Reset form"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Number Input Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                    {inputFields.map((field) => (
                        <div key={field.name} className="relative group">
                            <label className="block text-sm font-medium mb-2 flex items-center">
                                <span className="mr-1">{field.icon}</span>
                                {field.label}
                                <div className="relative ml-1 group/tooltip">
                                    <HelpCircle className="w-3 h-3 text-slate-400 cursor-help" />
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap z-10">
                                        {field.tooltip}
                                    </div>
                                </div>
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="input-field"
                                step={field.step}
                                min={field.min}
                                max={field.max}
                                required
                            />
                            <div className="mt-1 text-xs text-slate-400">
                                Range: {field.min} - {field.max}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Select Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                    {selectFields.map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium mb-2 flex items-center">
                                <span className="mr-1">{field.icon}</span>
                                {field.label}
                            </label>
                            <select
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="input-field"
                                required
                            >
                                {field.options.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Predict Performance</span>
                        </>
                    )}
                </button>
            </form>

            {/* Tips Section */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-xs text-blue-800 dark:text-blue-300 flex items-start">
                    <span className="mr-2">💡</span>
                    <span>Tip: More accurate inputs lead to better predictions. Update student data regularly for best results.</span>
                </p>
            </div>
        </motion.div>
    );
};

export default PredictionForm;