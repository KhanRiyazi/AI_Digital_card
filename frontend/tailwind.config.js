/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite',
                'bounce-slow': 'bounce 1s ease-in-out infinite',
                'spin-slow': 'spin 3s linear infinite',
                'shimmer': 'shimmer 3s infinite',
                'scale-in': 'scaleIn 0.3s ease-out',
                'rotate-in': 'rotateIn 0.3s ease-out',
                'float': 'float 3s ease-in-out infinite',
                'border-pulse': 'borderPulse 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 5px rgba(59,130,246,0.5)' },
                    '50%': { boxShadow: '0 0 20px rgba(59,130,246,0.8)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                rotateIn: {
                    '0%': { opacity: '0', transform: 'rotate(-5deg) scale(0.9)' },
                    '100%': { opacity: '1', transform: 'rotate(0) scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                borderPulse: {
                    '0%, 100%': { borderColor: 'rgba(59, 130, 246, 0.3)' },
                    '50%': { borderColor: 'rgba(59, 130, 246, 0.8)' },
                },
            },
        },
    },
    plugins: [],
}