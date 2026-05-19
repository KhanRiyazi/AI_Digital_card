import React from 'react';
import { motion } from 'framer-motion';

const Navbar = ({ onLogout }) => {
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="glass-header"
        >
            <div className="logo-glow">
                <motion.h1
                    className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                >
                    🎓 Smart Digital ID
                </motion.h1>
                <p className="text-xs text-slate-400 mt-1">QR Secure · AI Intelligence · Principal Control</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span>{currentTime.toLocaleTimeString()}</span>
                </div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="admin-chip flex items-center gap-2 bg-blue-500/20 rounded-full px-4 py-2 border border-blue-500/40"
                >
                    <span className="material-symbols-outlined text-sm">shield_person</span>
                    <span className="text-sm font-medium">Principal</span>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onLogout}
                        className="bg-red-600 text-white px-3 py-1 rounded-full text-xs hover:bg-red-700 transition-all"
                    >
                        Logout
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Navbar;