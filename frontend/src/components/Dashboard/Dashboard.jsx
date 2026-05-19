import React from 'react';
import StatsCard from './StatsCard';
import Charts from './Charts';
import { TrendingUp, Users, Brain, Award } from 'lucide-react';

const Dashboard = ({ data }) => {
    const stats = [
        {
            title: 'Total Predictions',
            value: data?.total_predictions || 0,
            icon: TrendingUp,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'Average Score',
            value: `${Math.round(data?.average_score || 0)}%`,
            icon: Award,
            color: 'from-green-500 to-emerald-500',
        },
        {
            title: 'Model Accuracy',
            value: '85%',
            icon: Brain,
            color: 'from-purple-500 to-pink-500',
        },
        {
            title: 'Students Analyzed',
            value: data?.total_predictions || 0,
            icon: Users,
            color: 'from-orange-500 to-red-500',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Welcome back! Here's an overview of your prediction analytics.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Charts data={data} />
                <div className="glass-card p-6">
                    <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {data?.recent_trend?.slice(-5).reverse().map((score, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                <span className="text-sm">Prediction {idx + 1}</span>
                                <span className={`font-semibold ${score >= 70 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500'
                                    }`}>
                                    {Math.round(score)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;