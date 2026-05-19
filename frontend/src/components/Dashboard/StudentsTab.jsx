import React from 'react';
import { motion } from 'framer-motion';
import StudentTable from './StudentTable';
import { deleteStudent } from '../../api';

const StudentsTab = ({ students, setStudents }) => {
    const handleDelete = (id) => {
        const updated = deleteStudent(id);
        setStudents(updated);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="glass-card"
        >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-400 text-2xl">school</span>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                        Enrolled Scholars
                    </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="material-symbols-outlined text-sm">people</span>
                    <span>{students.length} Total Students</span>
                </div>
            </div>

            <StudentTable students={students} onDelete={handleDelete} />
        </motion.div>
    );
};

export default StudentsTab;