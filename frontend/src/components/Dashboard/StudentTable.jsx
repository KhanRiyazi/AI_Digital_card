import React, { useState } from 'react';
import DigitalCardModal from './DigitalCardModal';

const StudentTable = ({ students, onDelete }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const viewCard = (student) => {
        console.log("🔘 View Card clicked for:", student.name);
        console.log("Student data:", student);
        setSelectedStudent(student);
        setShowModal(true);
    };

    const closeModal = () => {
        console.log("🔘 Closing modal");
        setShowModal(false);
        setTimeout(() => setSelectedStudent(null), 100);
    };

    const editStudent = (student) => {
        console.log("✏️ Edit student:", student.name);
        window.dispatchEvent(new CustomEvent('editStudent', { detail: student }));
    };

    if (students.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-2">school</span>
                <p>📭 No students registered. Add new scholar.</p>
            </div>
        );
    }

    return (
        <>
            <div className="mb-4">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">search</span>
                    <input
                        type="text"
                        placeholder="Search by name, roll number or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-modern pl-10"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="text-blue-400 bg-black/20 text-xs">
                            <th className="p-3 text-left">Student</th>
                            <th className="p-3 text-left">Roll ID</th>
                            <th className="p-3 text-left hidden md:table-cell">Class</th>
                            <th className="p-3 text-left hidden lg:table-cell">Contact</th>
                            <th className="p-3 text-left">Card</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student, index) => (
                            <tr
                                key={student.id}
                                className="border-b border-white/10 hover:bg-white/5 transition-all duration-200"
                            >
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <strong className="text-sm">{student.name}</strong>
                                            <br />
                                            <small className="text-slate-400 text-xs">{student.email}</small>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 text-sm font-mono">{student.rollNo}</td>
                                <td className="p-3 text-sm hidden md:table-cell">
                                    <span className="px-2 py-1 bg-blue-500/20 rounded-full text-xs">{student.class}</span>
                                </td>
                                <td className="p-3 text-sm hidden lg:table-cell">{student.mobile || '—'}</td>
                                <td className="p-3">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            viewCard(student);
                                        }}
                                        className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs hover:bg-blue-700 transition-all cursor-pointer"
                                    >
                                        🎫 View Card
                                    </button>
                                </td>
                                <td className="p-3">
                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => editStudent(student)}
                                            className="bg-slate-700 text-white px-2 py-1.5 rounded text-xs hover:bg-slate-600 transition-all cursor-pointer"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(student.id)}
                                            className="bg-red-600 text-white px-2 py-1.5 rounded text-xs hover:bg-red-700 transition-all cursor-pointer"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredStudents.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                        No students match your search.
                    </div>
                )}
            </div>

            {/* Modal - Render conditionally */}
            {showModal && selectedStudent && (
                <DigitalCardModal
                    student={selectedStudent}
                    onClose={closeModal}
                />
            )}
        </>
    );
};

export default StudentTable;