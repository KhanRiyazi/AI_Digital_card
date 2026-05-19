import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

const DigitalCardModal = ({ student, onClose }) => {
    const qrRef = useRef(null);
    const [showShareOptions, setShowShareOptions] = useState(false);

    useEffect(() => {
        if (qrRef.current && student) {
            const shareLink = `${window.location.origin}${window.location.pathname}?view=card&id=${student.id}`;
            qrRef.current.innerHTML = '';

            if (typeof QRCode !== 'undefined') {
                try {
                    // Responsive QR code size based on screen
                    const qrSize = window.innerWidth < 640 ? 55 : 70;
                    new QRCode(qrRef.current, {
                        text: shareLink,
                        width: qrSize,
                        height: qrSize,
                        colorDark: "#000000",
                        colorLight: "#ffffff"
                    });
                } catch (error) {
                    console.error("QR Error:", error);
                }
            }
        }
    }, [student]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const getShareLink = () => {
        return `${window.location.origin}${window.location.pathname}?view=card&id=${student.id}`;
    };

    const getShareText = () => {
        return `🎓 OFFICIAL DIGITAL ID CARD\n━━━━━━━━━━━━━━━━━━━━━\nName: ${student.name}\nRoll No: ${student.rollNo}\nClass: ${student.class}\nAadhaar: ${student.aadhaar || 'Not provided'}\nResult: ${student.prevResult || 'N/A'}%\nInterest: ${student.interest || 'Computer Science'}\nGoal: ${student.goal || 'Academic Excellence'}\n━━━━━━━━━━━━━━━━━━━━━\n🔗 Verify: ${getShareLink()}`;
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('✓ Link copied to clipboard!', {
                duration: 2000,
                icon: '📋',
                style: { background: '#1e293b', color: '#fff' }
            });
            return true;
        } catch (err) {
            toast.error('Failed to copy', { duration: 1500 });
            return false;
        }
    };

    const handleNativeShare = async () => {
        const shareLink = getShareLink();
        const shareText = getShareText();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${student.name} - Digital ID Card`,
                    text: shareText,
                    url: shareLink,
                });
                toast.success('Shared successfully!', { duration: 1500, icon: '🎉' });
                setShowShareOptions(false);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    await copyToClipboard(shareLink);
                }
            }
        } else {
            await copyToClipboard(shareLink);
        }
    };

    const shareViaWhatsApp = () => {
        const shareLink = getShareLink();
        const text = `${getShareText()}\n${shareLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        toast.success('Opening WhatsApp...', { duration: 1500, icon: '💚' });
        setShowShareOptions(false);
    };

    const shareViaEmail = () => {
        const shareLink = getShareLink();
        const subject = `Digital ID Card - ${student.name}`;
        const body = getShareText();
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
        toast.success('Opening Email...', { duration: 1500, icon: '📧' });
        setShowShareOptions(false);
    };

    const copyShareLink = async () => {
        await copyToClipboard(getShareLink());
        setShowShareOptions(false);
    };

    const downloadQRCode = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = `${student.name.replace(/\s/g, '_')}_QR.png`;
            link.href = canvas.toDataURL();
            link.click();
            toast.success('QR Code saved!', { duration: 1500, icon: '📥' });
        }
    };

    if (!student) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-[95%] sm:max-w-[420px] md:max-w-[450px] lg:max-w-[480px] mx-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Responsive Digital Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/20">

                    {/* Responsive Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-bold border border-white/50">
                                    {student.name?.charAt(0).toUpperCase() || 'S'}
                                </div>
                                <div>
                                    <div className="text-[8px] sm:text-[9px] md:text-[10px] text-white/60 uppercase tracking-wider">STUDENT ID</div>
                                    <div className="text-[10px] sm:text-[11px] md:text-xs font-mono text-white/90">{student.rollNo}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] sm:text-xs md:text-sm font-bold text-white">{student.class}</div>
                            </div>
                        </div>
                        <div className="mt-1 sm:mt-1.5 md:mt-2">
                            <div className="text-sm sm:text-base md:text-lg font-bold text-white truncate">{student.name}</div>
                        </div>
                    </div>

                    {/* Responsive Body */}
                    <div className="p-3 sm:p-4 md:p-5">
                        {/* Responsive Info Grid - 2 columns on all screens */}
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-4">
                            <div className="bg-white/10 rounded-lg p-1.5 sm:p-2 md:p-2.5">
                                <div className="text-[7px] sm:text-[8px] md:text-[9px] text-blue-400 font-semibold">📧 EMAIL</div>
                                <div className="text-[9px] sm:text-[10px] md:text-xs font-medium truncate text-white/80">{student.email}</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-1.5 sm:p-2 md:p-2.5">
                                <div className="text-[7px] sm:text-[8px] md:text-[9px] text-blue-400 font-semibold">📞 MOBILE</div>
                                <div className="text-[9px] sm:text-[10px] md:text-xs font-medium text-white/80">{student.mobile || 'Not provided'}</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-1.5 sm:p-2 md:p-2.5">
                                <div className="text-[7px] sm:text-[8px] md:text-[9px] text-blue-400 font-semibold">🆔 AADHAAR</div>
                                <div className="text-[9px] sm:text-[10px] md:text-xs font-mono text-white/80">{student.aadhaar || 'XXXX-XXXX'}</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-1.5 sm:p-2 md:p-2.5">
                                <div className="text-[7px] sm:text-[8px] md:text-[9px] text-blue-400 font-semibold">📊 RESULT</div>
                                <div className="text-[9px] sm:text-[10px] md:text-xs font-medium text-white/80">
                                    <span className="text-green-400 font-bold">{student.prevResult || 'N/A'}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Interest & Goal */}
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-4">
                            <div className="bg-purple-500/10 rounded-lg p-1.5 sm:p-2 md:p-2.5 border border-purple-500/20">
                                <div className="text-[7px] sm:text-[8px] md:text-[9px] text-purple-400 font-semibold">💡 INTEREST</div>
                                <div className="text-[9px] sm:text-[10px] md:text-xs font-medium text-white/80">{student.interest || 'Computer Science'}</div>
                            </div>
                            <div className="bg-orange-500/10 rounded-lg p-1.5 sm:p-2 md:p-2.5 border border-orange-500/20">
                                <div className="text-[7px] sm:text-[8px] md:text-[9px] text-orange-400 font-semibold">🎯 GOAL</div>
                                <div className="text-[9px] sm:text-[10px] md:text-xs font-medium text-white/80">{student.goal || 'Academic Excellence'}</div>
                            </div>
                        </div>

                        {/* Portfolio Link */}
                        {student.social && (
                            <div className="mb-2 sm:mb-3 md:mb-4">
                                <a href={student.social} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-blue-500/10 rounded-lg py-1.5 sm:py-2 border border-blue-500/20 hover:bg-blue-500/20 transition-all group">
                                    <span className="text-blue-400 text-[10px] sm:text-xs">🔗</span>
                                    <span className="text-blue-400 text-[9px] sm:text-[10px] md:text-xs font-medium group-hover:underline">View Portfolio</span>
                                    <span className="text-blue-400 text-[8px] sm:text-[9px]">↗</span>
                                </a>
                            </div>
                        )}

                        {/* QR & Share - Responsive Row */}
                        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/10">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="bg-white p-1 sm:p-1.5 rounded-lg relative group shadow-lg">
                                    <div ref={qrRef} className="w-[45px] h-[45px] sm:w-[55px] sm:h-[55px] md:w-[65px] md:h-[65px]"></div>
                                    <button onClick={downloadQRCode} className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white text-[7px] sm:text-[8px] gap-1">
                                        📥 Save
                                    </button>
                                </div>
                                <div>
                                    <div className="text-[7px] sm:text-[8px] md:text-[9px] text-white/40 uppercase tracking-wider">Scan to Verify</div>
                                    <div className="text-[6px] sm:text-[7px] text-white/30 font-mono">Secure Digital ID</div>
                                </div>
                            </div>

                            {/* Share Button Responsive */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowShareOptions(!showShareOptions)}
                                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl transition-all duration-200 shadow-lg hover:scale-105 active:scale-95 cursor-pointer text-[10px] sm:text-xs md:text-sm flex items-center gap-1 sm:gap-2"
                                >
                                    <span>📤</span>
                                    <span className="hidden sm:inline">Share</span>
                                    <span className="sm:hidden">Share</span>
                                    <span className="text-[8px] sm:text-[9px]">▼</span>
                                </button>

                                {/* Share Dropdown */}
                                {showShareOptions && (
                                    <div className="absolute bottom-full right-0 mb-2 w-40 sm:w-48 bg-slate-800 rounded-lg sm:rounded-xl overflow-hidden shadow-2xl border border-white/10 animate-fade-in z-10">
                                        <div className="p-1 border-b border-white/10">
                                            <div className="text-[7px] sm:text-[8px] text-white/40 px-2 sm:px-3 py-1 uppercase tracking-wider">Share via</div>
                                        </div>
                                        {navigator.share && (
                                            <button onClick={handleNativeShare} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left hover:bg-white/10 transition-colors flex items-center gap-2 text-[10px] sm:text-xs">
                                                <span>📱</span> Native Share
                                            </button>
                                        )}
                                        <button onClick={shareViaWhatsApp} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left hover:bg-white/10 transition-colors flex items-center gap-2 text-[10px] sm:text-xs">
                                            <span>💚</span> WhatsApp
                                        </button>
                                        <button onClick={shareViaEmail} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left hover:bg-white/10 transition-colors flex items-center gap-2 text-[10px] sm:text-xs">
                                            <span>📧</span> Email
                                        </button>
                                        <button onClick={copyShareLink} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left hover:bg-white/10 transition-colors flex items-center gap-2 text-[10px] sm:text-xs border-t border-white/10">
                                            <span>🔗</span> Copy Link
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-white/5 flex justify-between">
                            <div className="text-[6px] sm:text-[7px] text-white/30 uppercase tracking-wider">Smart Digital ID System™</div>
                            <div className="text-[6px] sm:text-[7px] text-white/30 font-mono">Valid: 2024 - 2025</div>
                        </div>
                    </div>
                </div>

                {/* Responsive Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full mt-2 sm:mt-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer text-xs sm:text-sm shadow-lg"
                >
                    ✕ Close Card
                </button>
            </div>
        </div>,
        document.body
    );
};

export default DigitalCardModal;