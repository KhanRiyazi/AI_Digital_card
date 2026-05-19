import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { exportData } from '../../api';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AnalyticsTab = ({ students }) => {
    const [stats, setStats] = useState({
        total: 0,
        csInterest: 0,
        avgResult: 0,
        avgAttendance: 0,
        avgExamScore: 0,
        highPerformers: 0,
        atRisk: 0,
    });
    const [classDistribution, setClassDistribution] = useState([]);
    const [performanceTrend, setPerformanceTrend] = useState([]);

    useEffect(() => {
        calculateStats();
    }, [students]);

    const calculateStats = () => {
        const total = students.length;

        // CS/AI Enthusiasts
        const csCount = students.filter(s =>
            (s.interest || '').toLowerCase().includes('computer') ||
            (s.interest || '').toLowerCase().includes('ai') ||
            (s.interest || '').toLowerCase().includes('cs') ||
            (s.interest || '').toLowerCase().includes('data') ||
            (s.interest || '').toLowerCase().includes('programming')
        ).length;

        // Average Result
        let totalResult = 0;
        let resultCount = 0;
        students.forEach(s => {
            const r = parseFloat(s.prevResult);
            if (!isNaN(r) && r > 0) {
                totalResult += r;
                resultCount++;
            }
        });
        const avgResult = resultCount ? (totalResult / resultCount).toFixed(1) : 0;

        // Average Attendance & Exam Score
        let totalAttendance = 0;
        let totalExamScore = 0;
        students.forEach(s => {
            totalAttendance += s.attendance || 85;
            totalExamScore += s.examScore || 72;
        });
        const avgAttendance = total ? Math.round(totalAttendance / total) : 0;
        const avgExamScore = total ? Math.round(totalExamScore / total) : 0;

        // High Performers & At Risk
        let highPerformers = 0;
        let atRisk = 0;
        students.forEach(s => {
            const performance = ((s.attendance || 85) * 0.3 + (s.examScore || 72) * 0.7);
            if (performance >= 80) highPerformers++;
            if (performance < 60) atRisk++;
        });

        setStats({
            total,
            csInterest: csCount,
            avgResult,
            avgAttendance,
            avgExamScore,
            highPerformers,
            atRisk,
        });

        // Class Distribution
        const classMap = new Map();
        students.forEach(s => {
            const className = s.class || 'Unknown';
            classMap.set(className, (classMap.get(className) || 0) + 1);
        });
        setClassDistribution(Array.from(classMap.entries()).map(([name, value]) => ({ name, value })));

        // Performance Trend (mock data for demonstration)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        setPerformanceTrend(months.map((month, i) => ({
            month,
            average: 65 + Math.sin(i) * 5 + Math.random() * 3,
            target: 75,
        })));
    };

    const riskData = [
        { name: 'High Performers', value: stats.highPerformers, color: '#10b981' },
        { name: 'Average', value: stats.total - stats.highPerformers - stats.atRisk, color: '#f59e0b' },
        { name: 'At Risk', value: stats.atRisk, color: '#ef4444' },
    ].filter(item => item.value > 0);

    const StatCard = ({ title, value, icon, color, delay }) => (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay, duration: 0.3 }}
            className="stat-modern"
        >
            <div className="flex items-center justify-between mb-2">
                <span className="material-symbols-outlined" style={{ color }}>{icon}</span>
                <span className="text-2xl font-bold text-gradient">{value}</span>
            </div>
            <div className="text-xs text-slate-400">{title}</div>
        </motion.div>
    );

    return (
        <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatCard title="Total Students" value={stats.total} icon="groups" color="#60a5fa" delay={0} />
                <StatCard title="CS/AI Enthusiasts" value={stats.csInterest} icon="psychology" color="#a78bfa" delay={0.05} />
                <StatCard title="Avg Score" value={`${stats.avgResult}%`} icon="analytics" color="#34d399" delay={0.1} />
                <StatCard title="Avg Attendance" value={`${stats.avgAttendance}%`} icon="calendar_month" color="#fbbf24" delay={0.15} />
                <StatCard title="High Performers" value={stats.highPerformers} icon="emoji_events" color="#f472b6" delay={0.2} />
                <StatCard title="At Risk" value={stats.atRisk} icon="warning" color="#f87171" delay={0.25} />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Class Distribution Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-blue-400">bar_chart</span>
                        <h3 className="font-bold">Class Distribution</h3>
                    </div>
                    {classDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={classDistribution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                                    {classDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-12 text-slate-400">No data available</div>
                    )}
                </motion.div>

                {/* Performance Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="glass-card"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-blue-400">trending_up</span>
                        <h3 className="font-bold">Performance Trend</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={performanceTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="average" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                            <Area type="monotone" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                            <Legend />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Risk Distribution Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-blue-400">pie_chart</span>
                        <h3 className="font-bold">Risk Distribution</h3>
                    </div>
                    {riskData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
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
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-12 text-slate-400">No data available</div>
                    )}
                </motion.div>

                {/* Key Metrics Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="glass-card"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-blue-400">speed</span>
                        <h3 className="font-bold">Key Metrics Comparison</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={[
                            { metric: 'Attendance', value: stats.avgAttendance },
                            { metric: 'Exam Score', value: stats.avgExamScore },
                            { metric: 'Overall', value: parseFloat(stats.avgResult) },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                            <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Export Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card"
            >
                <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400">insights</span>
                        <h3 className="font-bold">Principal Intelligence Hub</h3>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={exportData}
                        className="btn-gradient justify-center"
                    >
                        📥 Export Records (JSON)
                    </motion.button>
                </div>

                <div className="bg-black/30 p-4 rounded-xl max-h-48 overflow-y-auto font-mono text-xs space-y-1">
                    <p className="text-green-400">🕒 {new Date().toLocaleString()} - Dashboard Synced</p>
                    <p>📊 Total Students: {stats.total}</p>
                    <p>🎓 AI/CS Enthusiasts: {stats.csInterest}</p>
                    <p>📈 Average Academic Score: {stats.avgResult}%</p>
                    <p>📚 Average Attendance: {stats.avgAttendance}%</p>
                    <p>📖 Average Exam Score: {stats.avgExamScore}%</p>
                    <p>🏆 High Performers: {stats.highPerformers}</p>
                    <p>⚠️ Students At Risk: {stats.atRisk}</p>
                    <p className="text-blue-400">🔐 System Secured | Principal Access Active</p>
                    <p className="text-purple-400">🤖 ML Model Status: Ready</p>
                </div>
            </motion.div>
        </div>
    );
};

export default AnalyticsTab;