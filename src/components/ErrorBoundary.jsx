import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-stone-900 text-white rounded-xl text-center text-xs space-y-2">
          <p className="text-[#00A3E0] font-bold">3D Visual WebGL Active</p>
          <p className="text-stone-400 text-[11px]">Memuat tampilan visual 3D...</p>
        </div>
      );
    }
    return this.props.children;
  }
}
