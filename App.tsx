import React, { useState } from 'react';
import ScannerHero from './components/ScannerHero';
import LoadingScan from './components/LoadingScan';
import ScanReport from './components/ScanReport';
import { scanWebsite } from './services/geminiService';
import { AppState, SecurityReport } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [targetUrl, setTargetUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleScan = async (url: string) => {
    setAppState(AppState.SCANNING);
    setTargetUrl(url);
    setErrorMessage('');
    
    try {
      const data = await scanWebsite(url);
      setReport(data);
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to complete the scan. Please check your connection or try again later.");
      setAppState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setReport(null);
    setTargetUrl('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      
      {/* Navigation / Header */}
      <nav className="w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer" onClick={resetApp}>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                CheckBefore<span className="text-blue-600">Scam</span>
              </span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-blue-600 transition-colors">Safety Guide</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Report Scam</a>
              <a href="#" className="hover:text-blue-600 transition-colors">API</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {appState === AppState.IDLE && (
          <ScannerHero onScan={handleScan} isLoading={false} />
        )}

        {appState === AppState.SCANNING && (
          <LoadingScan />
        )}

        {appState === AppState.RESULT && report && (
          <ScanReport report={report} url={targetUrl} onReset={resetApp} />
        )}

        {appState === AppState.ERROR && (
           <div className="flex flex-col items-center justify-center py-20 px-4">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Scan Failed</h2>
              <p className="text-slate-500 mb-8 text-center max-w-md">{errorMessage}</p>
              <button 
                onClick={resetApp}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
           </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto no-print">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} CheckBeforeScam. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-slate-400 text-sm">
            <span className="hover:text-slate-600 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms</span>
            <span className="hover:text-slate-600 cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;