import React, { useState } from 'react';
import { ShieldCheck, Search, AlertCircle } from 'lucide-react';

interface ScannerHeroProps {
  onScan: (url: string) => void;
  isLoading: boolean;
}

const ScannerHero: React.FC<ScannerHeroProps> = ({ onScan, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    // Basic URL validation
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    
    if (!pattern.test(url)) {
        setError('Please enter a valid website format (e.g., example.com)');
        return;
    }

    setError('');
    onScan(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 md:py-20 text-center">
      <div className="mb-8 flex justify-center">
        <div className="bg-blue-100 p-4 rounded-full">
            <ShieldCheck className="w-16 h-16 text-blue-600" />
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
        CHECK<span className="text-blue-600">BEFORE</span>SCAM
      </h1>
      
      <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Enter any website URL to check if it is safe. 
        We use AI to aggregate data from free resources like VirusTotal and Blacklists.
        Export your detailed safety report in JSON, CSV, or PDF.
      </p>

      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto group">
        <div className={`absolute inset-0 bg-blue-200 rounded-xl blur transition duration-500 group-hover:bg-blue-300 ${isLoading ? 'opacity-50' : 'opacity-25'}`}></div>
        <div className="relative flex items-center bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 p-2">
          <Search className="w-6 h-6 text-slate-400 ml-3" />
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            disabled={isLoading}
            className="w-full px-4 py-4 text-lg text-slate-800 focus:outline-none placeholder:text-slate-400 disabled:bg-white"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className={`
              bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg 
              transition-all duration-200 text-lg shadow-lg flex-shrink-0
              ${isLoading ? 'opacity-70 cursor-wait' : ''}
            `}
          >
            {isLoading ? 'Scanning...' : 'Check Safety'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 flex items-center justify-center text-red-500 space-x-2 animate-pulse">
            <AlertCircle size={20} />
            <span>{error}</span>
        </div>
      )}

      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-500">
        <div className="flex flex-col items-center space-y-2">
            <span className="font-semibold text-slate-700">✓ AI-Powered Scan</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
            <span className="font-semibold text-slate-700">✓ Free Intelligence Sources</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
            <span className="font-semibold text-slate-700">✓ Export PDF / CSV / JSON</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
            <span className="font-semibold text-slate-700">✓ Instant Report</span>
        </div>
      </div>
    </div>
  );
};

export default ScannerHero;