import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { loginUser } from '../api';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const Login = ({ onLogin }) => {
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Try backend login first
            const result = await loginUser(data.email, data.password);
            if (result.access_token) {
                sessionStorage.setItem('admin_auth_smart', 'true');
                onLogin();
                toast.success('Welcome back, Principal!');
            }
        } catch (error) {
            // Fallback to demo login
            if (data.email === 'principal@school.edu' && data.password === 'admin123') {
                sessionStorage.setItem('admin_auth_smart', 'true');
                onLogin();
                toast.success('Welcome back, Principal!');
            } else {
                toast.error('Invalid credentials. Use: principal@school.edu / admin123');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="glass-card max-w-md w-full"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                            Principal Access
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">Secure Authentication Required</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Admin Email</label>
                        <input
                            type="email"
                            {...register('email')}
                            className={`input-modern ${errors.email ? 'border-red-500' : ''}`}
                            placeholder="principal@school.edu"
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Secure Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            className={`input-modern ${errors.password ? 'border-red-500' : ''}`}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="btn-gradient w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Authenticating...
                            </>
                        ) : (
                            '🔐 Authenticate'
                        )}
                    </motion.button>
                </form>

                <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="text-xs text-slate-500 text-center">
                        🔑 Demo Credentials: principal@school.edu / admin123
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;