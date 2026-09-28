import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends Component<{children: ReactNode}, {error: any}> {
  state = { error: null };
  static getDerivedStateFromError(error: any) { return { error }; }
  render() {
    if (this.state.error) return <div style={{padding: 20, color: 'red', background: 'white', zIndex: 9999, position: 'relative'}}><h1>UI Crash!</h1><pre style={{whiteSpace: 'pre-wrap'}}>{String((this.state.error as any)?.stack || this.state.error)}</pre></div>;
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
