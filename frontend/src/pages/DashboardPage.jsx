import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';
import StudentsTab from '../components/Dashboard/StudentsTab';
import RegisterTab from '../components/Dashboard/RegisterTab';
import AnalyticsTab from '../components/Dashboard/AnalyticsTab';
import MLTab from '../components/Dashboard/MLTab';
import DigitalCardModal from '../components/Dashboard/DigitalCardModal';
import { getStudents } from '../api';

const tabs = [
    { id: 'students', label: 'Students', icon: 'groups', color: 'from-blue-600 to-blue-800' },
    { id: 'add', label: 'Register', icon: 'add_card', color: 'from-emerald-600 to-teal-800' },
    { id: 'dashboard', label: 'Analytics', icon: 'insights', color: 'from-purple-600 to-pink-800' },
    { id: 'ml', label: 'ML Intelligence', icon: 'psychology', color: 'from-indigo-600 to-purple-800' }
];

const DashboardPage = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('students');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [testModal, setTestModal] = useState(false);
    const [testStudent, setTestStudent] = useState(null);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = () => {
        setLoading(true);
        const stored = getStudents();
        if (stored.length === 0) {
            const sampleData = [
                {
                    id: '1001',
                    name: 'Kiara Advani',
                    rollNo: '2024CS101',
                    class: '12th Grade',
                    email: 'kiara@academy.edu',
                    mobile: '+91 9876543210',
                    aadhaar: 'XXXX-4321',
                    prevResult: '96.5',
                    interest: 'Artificial Intelligence, ML',
                    goal: 'MIT Research',
                    social: 'https://linkedin.com/in/kiara',
                    dob: '2006-03-15',
                    attendance: 96,
                    examScore: 89,
                    parentEngagement: 8.5,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '1002',
                    name: 'Rahul Verma',
                    rollNo: '2024CS102',
                    class: '12th Grade',
                    email: 'rahul@academy.edu',
                    mobile: '9988776655',
                    aadhaar: 'XXXX-5678',
                    prevResult: '94.2',
                    interest: 'Cybersecurity',
                    goal: 'Stanford CS',
                    social: 'https://github.com/rahulv',
                    dob: '2006-07-22',
                    attendance: 72,
                    examScore: 58,
                    parentEngagement: 4.2,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '1003',
                    name: 'Priya Patel',
                    rollNo: '2024CS103',
                    class: '11th Grade',
                    email: 'priya@academy.edu',
                    mobile: '9876543210',
                    aadhaar: 'XXXX-7890',
                    prevResult: '88.5',
                    interest: 'Data Science',
                    goal: 'IIT Bombay',
                    attendance: 88,
                    examScore: 76,
                    parentEngagement: 7.0,
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('smart_student_id_v2', JSON.stringify(sampleData));
            setStudents(sampleData);
            setTestStudent(sampleData[0]); // Set test student
        } else {
            setStudents(stored);
            setTestStudent(stored[0]); // Set test student
        }
        setLoading(false);
    };

    const handleTestModal = () => {
        console.log("Opening test modal for:", testStudent?.name);
        setTestModal(true);
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center py-20">
                    <div className="loading-spinner w-10 h-10"></div>
                </div>
            );
        }

        switch (activeTab) {
            case 'students':
                return <StudentsTab students={students} setStudents={setStudents} />;
            case 'add':
                return <RegisterTab students={students} setStudents={setStudents} />;
            case 'dashboard':
                return <AnalyticsTab students={students} />;
            case 'ml':
                return <MLTab students={students} setStudents={setStudents} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <Navbar onLogout={onLogout} />

            {/* Test Button - Remove this after confirming modal works */}
            <div className="mb-4 flex justify-end">
                <button
                    onClick={handleTestModal}
                    className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-all shadow-lg"
                >
                    🧪 Test Modal Popup
                </button>
            </div>

            <div className="flex gap-2 mb-6 bg-black/30 p-1.5 rounded-full backdrop-blur-md overflow-x-auto scrollbar-hide">
                {tabs.map(tab => (
                    <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2.5 px-4 border-none font-semibold rounded-full cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 text-sm whitespace-nowrap ${activeTab === tab.id
                            ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-blue-500/30`
                            : 'text-slate-300 hover:bg-white/10'
                            }`}
                    >
                        <span className="material-symbols-outlined text-base">{tab.icon}</span>
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 rounded-full -z-10"
                                transition={{ type: "spring", duration: 0.5 }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, type: "spring" }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>

            {/* Test Modal */}
            <AnimatePresence>
                {testModal && testStudent && (
                    <DigitalCardModal
                        student={testStudent}
                        onClose={() => {
                            console.log("Closing test modal");
                            setTestModal(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardPage;