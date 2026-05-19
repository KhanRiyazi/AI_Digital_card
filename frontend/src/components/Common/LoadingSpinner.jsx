import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoBack = () => {
        window.history.back();
    };

    render() {
        if (this.state.hasError) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="min-h-screen flex items-center justify-center p-4"
                >
                    <div className="glass-card max-w-md w-full text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-red-400 text-4xl">error</span>
                        </div>

                        <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
                        <p className="text-slate-400 text-sm mb-4">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReload}
                                className="btn-gradient"
                            >
                                <span className="material-symbols-outlined text-sm">refresh</span>
                                Reload Page
                            </button>
                            <button
                                onClick={this.handleGoBack}
                                className="btn-outline"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Go Back
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                            <details className="mt-4 text-left">
                                <summary className="text-xs text-slate-400 cursor-pointer">Error Details</summary>
                                <pre className="text-xs text-red-400 mt-2 p-2 bg-black/30 rounded overflow-auto max-h-40">
                                    {this.state.error?.stack}
                                    {'\n\n'}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </motion.div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;