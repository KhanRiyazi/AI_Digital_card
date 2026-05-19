import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';

const DigitalCardPreview = ({ formData, isEditing, editId }) => {
    const qrRef = useRef(null);

    useEffect(() => {
        if (qrRef.current) {
            const tempId = isEditing && editId ? editId : 'preview_' + Date.now();
            const previewLink = `${window.location.origin}${window.location.pathname}?view=card&id=${tempId}`;
            QRCode.toCanvas(qrRef.current, previewLink, { width: 65, height: 65, margin: 1 }, (error) => {
                if (error) console.error(error);
            });
        }
    }, [formData, isEditing, editId]);

    const name = formData.name?.trim() || 'Scholar Name';
    const roll = formData.rollNo?.trim() || 'Roll ID';
    const cls = formData.class?.trim() || 'Grade';
    const mobile = formData.mobile?.trim() || '—';
    const aadhaar = formData.aadhaar?.trim() || 'XXXX';
    const result = formData.prevResult?.trim() || '—';
    const interest = formData.interest?.trim() || 'Computer Science';
    const goal = formData.goal?.trim() || 'Top University';
    const social = formData.social?.trim() || '';

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="premium-digital-card bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/15 sticky top-4"
        >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl border-2 border-white/50 mb-2">
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-xl font-bold">{name}</h2>
                    <p className="text-sm opacity-80">{roll}</p>
                </div>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-white/5 rounded-xl p-2 hover:bg-white/10 transition-all">
                        <div className="text-xs opacity-70">CLASS</div>
                        <strong className="text-sm">{cls}</strong>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2 hover:bg-white/10 transition-all">
                        <div className="text-xs opacity-70">MOBILE</div>
                        <strong className="text-sm">{mobile}</strong>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2 hover:bg-white/10 transition-all">
                        <div className="text-xs opacity-70">AADHAAR</div>
                        <strong className="text-sm">{aadhaar}</strong>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2 hover:bg-white/10 transition-all">
                        <div className="text-xs opacity-70">RESULT</div>
                        <strong className="text-sm">{result}%</strong>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2 hover:bg-white/10 transition-all col-span-2">
                        <div className="text-xs opacity-70">💡 INTEREST</div>
                        <strong className="text-sm truncate block">{interest}</strong>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2 hover:bg-white/10 transition-all col-span-2">
                        <div className="text-xs opacity-70">🎯 GOAL</div>
                        <strong className="text-sm truncate block">{goal}</strong>
                    </div>
                </div>

                {social && (
                    <div className="mb-3">
                        <a href={social} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline inline-flex items-center gap-1 break-all">
                            <span className="material-symbols-outlined text-xs">link</span>
                            {social.substring(0, 40)}{social.length > 40 ? '...' : ''}
                        </a>
                    </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-white/20">
                    <canvas ref={qrRef} className="bg-white p-1 rounded-lg shadow-md"></canvas>
                    <div className="text-right">
                        <div className="text-xs text-slate-400">Preview Mode</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Save to generate QR</div>
                    </div>
                </div>

                <div className="text-center mt-2 text-[10px] text-slate-500">
                    {isEditing && editId ? 'Preview - Save to update' : 'Live Preview'}
                </div>
            </div>
        </motion.div>
    );
};

export default DigitalCardPreview;