import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import DigitalCardPreview from './DigitalCardPreview';
import { addStudent, updateStudent } from '../../api';

const studentSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    rollNo: z.string().min(1, 'Roll number is required'),
    class: z.string().min(1, 'Class is required'),
    email: z.string().email('Invalid email'),
    mobile: z.string().min(10, 'Mobile number is required'),
    aadhaar: z.string().optional(),
    prevResult: z.string().optional(),
    interest: z.string().optional(),
    goal: z.string().optional(),
    social: z.string().optional(),
    dob: z.string().optional(),
});

const RegisterTab = ({ students, setStudents }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [previewData, setPreviewData] = useState({});

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            name: '',
            rollNo: '',
            class: '',
            email: '',
            mobile: '',
            aadhaar: '',
            prevResult: '',
            interest: '',
            goal: '',
            social: '',
            dob: ''
        }
    });

    const formValues = watch();

    useEffect(() => {
        setPreviewData(formValues);
    }, [formValues]);

    useEffect(() => {
        const handleEdit = (e) => {
            const student = e.detail;
            Object.keys(student).forEach(key => {
                if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
                    setValue(key, student[key] || '');
                }
            });
            setEditId(student.id);
            setIsEditing(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        window.addEventListener('editStudent', handleEdit);
        return () => window.removeEventListener('editStudent', handleEdit);
    }, [setValue]);

    const onSubmit = async (data) => {
        if (isEditing && editId) {
            const updated = updateStudent(editId, data);
            if (updated) {
                const index = students.findIndex(s => s.id === editId);
                const newStudents = [...students];
                newStudents[index] = updated;
                setStudents(newStudents);
            }
        } else {
            const newStudent = addStudent(data);
            setStudents([...students, newStudent]);
        }
        resetForm();
    };

    const resetForm = () => {
        reset({
            name: '',
            rollNo: '',
            class: '',
            email: '',
            mobile: '',
            aadhaar: '',
            prevResult: '',
            interest: '',
            goal: '',
            social: '',
            dob: ''
        });
        setIsEditing(false);
        setEditId(null);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card"
            >
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-blue-400">assignment_ind</span>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                        {isEditing ? '✏️ Edit Academic Card' : '🎯 Register New Student'}
                    </h3>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Full Name *</label>
                                <input type="text" {...register('name')} className={`input-modern ${errors.name ? 'border-red-500' : ''}`} placeholder="e.g., Ananya Sharma" />
                                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Roll Number *</label>
                                <input type="text" {...register('rollNo')} className={`input-modern ${errors.rollNo ? 'border-red-500' : ''}`} placeholder="2024CS001" />
                                {errors.rollNo && <p className="text-red-400 text-xs mt-1">{errors.rollNo.message}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Class/Grade *</label>
                                <input type="text" {...register('class')} className={`input-modern ${errors.class ? 'border-red-500' : ''}`} placeholder="12th - A" />
                                {errors.class && <p className="text-red-400 text-xs mt-1">{errors.class.message}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Email *</label>
                                <input type="email" {...register('email')} className={`input-modern ${errors.email ? 'border-red-500' : ''}`} placeholder="student@academy.edu" />
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Mobile Number *</label>
                                <input type="tel" {...register('mobile')} className={`input-modern ${errors.mobile ? 'border-red-500' : ''}`} placeholder="+91 9876543210" />
                                {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile.message}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Aadhaar (Last 4)</label>
                                <input type="text" {...register('aadhaar')} className="input-modern" placeholder="XXXX-1234" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Previous Result (%)</label>
                                <input type="text" {...register('prevResult')} className="input-modern" placeholder="94.5%" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">🎯 Interest</label>
                                <input type="text" {...register('interest')} className="input-modern" placeholder="AI/ML, Computer Science" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">🚀 Academic Goal</label>
                                <input type="text" {...register('goal')} className="input-modern" placeholder="IIT CSE / MIT Research" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">🔗 Social Link</label>
                                <input type="text" {...register('social')} className="input-modern" placeholder="https://linkedin.com/in/student" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">📅 Date of Birth</label>
                                <input type="date" {...register('dob')} className="input-modern" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6 flex-wrap">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-gradient"
                        >
                            {isSubmitting ? '⏳ Saving...' : (isEditing ? '✏️ Update Card' : '💾 Save Digital Card')}
                        </motion.button>
                        {isEditing && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={resetForm}
                                className="btn-outline"
                            >
                                Cancel Edit
                            </motion.button>
                        )}
                    </div>
                </form>
            </motion.div>

            <DigitalCardPreview formData={previewData} isEditing={isEditing} editId={editId} />
        </div>
    );
};

export default RegisterTab;