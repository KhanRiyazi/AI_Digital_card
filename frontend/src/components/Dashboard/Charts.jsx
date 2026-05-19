import React from 'react';
import {
    LineChart,
    Line,
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
} from 'recharts';

const Charts = ({ data }) => {
    const trendData = data?.recent_trend?.map((score, idx) => ({
        name: `Day ${idx + 1}`,
        score: Math.round(score),
    })) || [];

    const riskData = data?.risk_distribution ? [
        { name: 'Low Risk', value: data.risk_distribution.Low, color: '#10b981' },
        { name: 'Medium Risk', value: data.risk_distribution.Medium, color: '#f59e0b' },
        { name: 'High Risk', value: data.risk_distribution.High, color: '#ef4444' },
    ] : [];

    return (
        <div className="space-y-6">
            <div className="glass-card p-6">
                <h3 className="font-semibold text-lg mb-4">Performance Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: 'none',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6', r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="glass-card p-6">
                <h3 className="font-semibold text-lg mb-4">Risk Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
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
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Charts;