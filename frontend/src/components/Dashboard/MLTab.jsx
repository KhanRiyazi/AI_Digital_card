import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { predictPerformance } from '../../api';
import toast from 'react-hot-toast';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#7f1d1d'];

const MLTab = ({ students, setStudents }) => {
    const [mlResultsCache, setMlResultsCache] = useState({});
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analyzingAll, setAnalyzingAll] = useState(false);
    const [metrics, setMetrics] = useState({
        attendance_rate: 85,
        average_exam_score: 72,
        parent_engagement: 6.5
    });
    const [predictionHistory, setPredictionHistory] = useState([]);

    useEffect(() => {
        const cached = localStorage.getItem('ml_results_cache');
        if (cached) {
            setMlResultsCache(JSON.parse(cached));
        }
        const history = localStorage.getItem('prediction_history');
        if (history) {
            setPredictionHistory(JSON.parse(history));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('ml_results_cache', JSON.stringify(mlResultsCache));
    }, [mlResultsCache]);

    useEffect(() => {
        localStorage.setItem('prediction_history', JSON.stringify(predictionHistory.slice(-20)));
    }, [predictionHistory]);

    const handlePredict = async () => {
        if (!selectedStudent) {
            toast.error('Please select a student first');
            return;
        }

        setLoading(true);
        const schoolLevel = selectedStudent.class?.toLowerCase().includes('12') ? 'high' : 'middle';

        try {
            const result = await predictPerformance({
                ...metrics,
                student_teacher_ratio: 25,
                school_level: schoolLevel
            });
            setMlResultsCache(prev => ({ ...prev, [selectedStudent.id]: result }));
            setPredictionHistory(prev => [{
                studentName: selectedStudent.name,
                timestamp: new Date().toISOString(),
                score: result.prediction,
                risk: result.risk_category
            }, ...prev]);
            toast.success(`Prediction complete! Score: ${(result.prediction * 100).toFixed(0)}%`);
        } catch (error) {
            toast.error('Prediction failed. Make sure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyzeAll = async () => {
        setAnalyzingAll(true);
        let analyzed = 0;
        for (const student of students) {
            if (!mlResultsCache[student.id]) {
                const schoolLevel = student.class?.toLowerCase().includes('12') ? 'high' : 'middle';
                try {
                    const result = await predictPerformance({
                        attendance_rate: student.attendance || 85,
                        average_exam_score: student.examScore || 72,
                        student_teacher_ratio: 25,
                        parent_engagement: student.parentEngagement || 6.5,
                        school_level: schoolLevel
                    });
                    setMlResultsCache(prev => ({ ...prev, [student.id]: result }));
                    analyzed++;
                    await new Promise(resolve => setTimeout(resolve, 200));
                } catch (e) {
                    console.error(`Error analyzing ${student.name}:`, e);
                }
            }
        }
        setAnalyzingAll(false);
        toast.success(`Analyzed ${analyzed} students!`);
    };

    const riskData = [
        { name: 'Low Risk', value: Object.values(mlResultsCache).filter(r => r?.risk_category?.includes('Low')).length },
        { name: 'Moderate Risk', value: Object.values(mlResultsCache).filter(r => r?.risk_category?.includes('Moderate')).length },
        { name: 'High Risk', value: Object.values(mlResultsCache).filter(r => r?.risk_category?.includes('High')).length },
        { name: 'Critical Risk', value: Object.values(mlResultsCache).filter(r => r?.risk_category?.includes('Critical')).length },
    ].filter(item => item.value > 0);

    const stats = {
        total: students.length,
        analyzed: Object.keys(mlResultsCache).length,
        atRisk: Object.values(mlResultsCache).filter(r => (r?.prediction || 0) < 0.5).length,
        highPotential: Object.values(mlResultsCache).filter(r => (r?.prediction || 0) >= 0.75).length,
        avgScore: Object.values(mlResultsCache).length > 0
            ? Math.round(Object.values(mlResultsCache).reduce((sum, r) => sum + (r?.prediction || 0), 0) / Object.values(mlResultsCache).length * 100)
            : 0
    };

    const predictionResult = selectedStudent ? mlResultsCache[selectedStudent.id] : null;
    const getRiskClass = () => {
        if (predictionResult?.risk_category?.includes('Low')) return 'border-l-green-500 bg-gradient-to-r from-green-500/10 to-black/30';
        if (predictionResult?.risk_category?.includes('Moderate')) return 'border-l-orange-500 bg-gradient-to-r from-orange-500/10 to-black/30';
        if (predictionResult?.risk_category?.includes('High')) return 'border-l-red-500 bg-gradient-to-r from-red-500/10 to-black/30';
        return 'border-l-red-800 bg-gradient-to-r from-red-800/10 to-black/30';
    };

    return (
        <div className="space-y-4">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="stat-modern">
                    <div className="stat-number">{stats.total}</div>
                    <div className="text-sm">Total Students</div>
                </motion.div>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.05 }} className="stat-modern">
                    <div className="stat-number text-blue-400">{stats.analyzed}</div>
                    <div className="text-sm">Analyzed</div>
                </motion.div>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="stat-modern">
                    <div className="stat-number text-orange-400">{stats.atRisk}</div>
                    <div className="text-sm">At Risk</div>
                </motion.div>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.15 }} className="stat-modern">
                    <div className="stat-number text-green-400">{stats.highPotential}</div>
                    <div className="text-sm">High Potential</div>
                </motion.div>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="stat-modern">
                    <div className="stat-number">{stats.avgScore}%</div>
                    <div className="text-sm">Avg ML Score</div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Student List */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-400">school</span>
                            <h3 className="font-bold">Students from Digital IDs</h3>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAnalyzeAll}
                            disabled={analyzingAll || students.length === 0}
                            className="btn-gradient justify-center bg-gradient-to-r from-purple-600 to-purple-800 disabled:opacity-50 text-xs py-1.5 px-3"
                        >
                            {analyzingAll ? (
                                <>
                                    <span className="loading-spinner w-3 h-3"></span>
                                    Analyzing...
                                </>
                            ) : (
                                '📊 Analyze All'
                            )}
                        </motion.button>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-2">
                        {students.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">No students registered</div>
                        ) : (
                            students.map(student => {
                                const cached = mlResultsCache[student.id];
                                let riskIndicator = '⚪';
                                let riskColor = '#94a3b8';

                                if (cached) {
                                    if (cached.risk_category?.includes('Low')) {
                                        riskIndicator = '🟢';
                                        riskColor = '#10b981';
                                    } else if (cached.risk_category?.includes('Moderate')) {
                                        riskIndicator = '🟡';
                                        riskColor = '#f59e0b';
                                    } else {
                                        riskIndicator = '🔴';
                                        riskColor = '#ef4444';
                                    }
                                }

                                const score = cached ? (cached.prediction * 100).toFixed(0) + '%' : 'Not analyzed';

                                return (
                                    <motion.div
                                        key={student.id}
                                        whileHover={{ x: 5 }}
                                        onClick={() => {
                                            setSelectedStudent(student);
                                            setMetrics({
                                                attendance_rate: student.attendance || 85,
                                                average_exam_score: student.examScore || 72,
                                                parent_engagement: student.parentEngagement || 6.5
                                            });
                                        }}
                                        className={`bg-black/30 rounded-xl p-3 cursor-pointer transition-all border-l-4 ${selectedStudent?.id === student.id
                                                ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-l-purple-400'
                                                : 'border-l-blue-500 hover:bg-blue-500/20'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <strong className="text-sm">{student.name}</strong>
                                                <br />
                                                <small className="text-slate-400 text-xs">{student.rollNo} | {student.class}</small>
                                            </div>
                                            <div className="text-right">
                                                <span style={{ color: riskColor }}>{riskIndicator}</span>
                                                <span className="text-xs ml-1">{score}</span>
                                            </div>
                                        </div>
                                        <div className="mt-1 text-xs text-blue-400">💡 {student.interest || 'General'}</div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </motion.div>

                {/* Prediction Panel */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-blue-400">psychology</span>
                        <h3 className="font-bold">AI Prediction Engine</h3>
                    </div>

                    <div className="bg-black/30 rounded-xl p-3 mb-4">
                        <div className="text-slate-400 text-xs flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">person</span>
                            SELECTED STUDENT
                        </div>
                        <div className="font-bold text-base mt-1">{selectedStudent?.name || 'None selected'}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{selectedStudent?.rollNo || 'Select a student from the left panel'}</div>
                    </div>

                    {selectedStudent && (
                        <>
                            <div className="mb-4">
                                <div className="font-semibold text-xs mb-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">science</span>
                                    What-If Analysis
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                                            <label>Attendance Rate</label>
                                            <span>{metrics.attendance_rate}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={metrics.attendance_rate}
                                            onChange={(e) => setMetrics({ ...metrics, attendance_rate: parseFloat(e.target.value) })}
                                            className="w-full h-1.5 bg-blue-500 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                                            <label>Exam Score</label>
                                            <span>{metrics.average_exam_score}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={metrics.average_exam_score}
                                            onChange={(e) => setMetrics({ ...metrics, average_exam_score: parseFloat(e.target.value) })}
                                            className="w-full h-1.5 bg-blue-500 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                                            <label>Parent Engagement (1-10)</label>
                                            <span>{metrics.parent_engagement}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            step="0.5"
                                            value={metrics.parent_engagement}
                                            onChange={(e) => setMetrics({ ...metrics, parent_engagement: parseFloat(e.target.value) })}
                                            className="w-full h-1.5 bg-blue-500 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handlePredict}
                                disabled={loading}
                                className="btn-gradient w-full justify-center bg-gradient-to-r from-green-600 to-green-800 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Consulting AI Model...
                                    </>
                                ) : (
                                    '🔮 Generate ML Prediction'
                                )}
                            </motion.button>
                        </>
                    )}

                    <AnimatePresence>
                        {predictionResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`mt-4 rounded-xl p-3 border-l-4 ${getRiskClass()}`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${predictionResult.risk_category?.includes('Low') ? 'bg-green-500' :
                                            predictionResult.risk_category?.includes('Moderate') ? 'bg-orange-500' : 'bg-red-500'
                                        }`}>
                                        {predictionResult.risk_category}
                                    </span>
                                    <span className="text-xl font-bold">{(predictionResult.prediction * 100).toFixed(0)}%</span>
                                </div>
                                <div className="text-sm mb-1">
                                    <strong>💡 Recommendation:</strong> {predictionResult.recommendation}
                                </div>
                                <div className="text-xs opacity-80 mt-2 pt-2 border-t border-white/10">
                                    🔍 Confidence: {(predictionResult.confidence_score * 100).toFixed(0)}% |
                                    Key Factors: {predictionResult.key_factors?.join(', ')}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!selectedStudent && (
                        <div className="text-center py-12 text-slate-400">
                            <span className="material-symbols-outlined text-4xl mb-2">psychology</span>
                            <p>Select a student from the left panel<br />to start prediction</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Risk Distribution Chart */}
            {riskData.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-blue-400">donut_large</span>
                        <h3 className="font-bold">ML Risk Distribution</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={riskData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {riskData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            )}

            {/* Prediction History */}
            {predictionHistory.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="glass-card"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-blue-400">history</span>
                        <h3 className="font-bold">Recent Predictions</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-slate-400 border-b border-white/10">
                                    <th className="text-left p-2">Student</th>
                                    <th className="text-left p-2">Score</th>
                                    <th className="text-left p-2">Risk Level</th>
                                    <th className="text-left p-2">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {predictionHistory.slice(0, 5).map((pred, idx) => (
                                    <tr key={idx} className="border-b border-white/5">
                                        <td className="p-2">{pred.studentName}</td>
                                        <td className="p-2 font-bold">{(pred.score * 100).toFixed(0)}%</td>
                                        <td className="p-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${pred.risk?.includes('Low') ? 'bg-green-500/20 text-green-400' :
                                                    pred.risk?.includes('Moderate') ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {pred.risk}
                                            </span>
                                        </td>
                                        <td className="p-2 text-xs text-slate-400">{new Date(pred.timestamp).toLocaleTimeString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default MLTab;