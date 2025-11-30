import React from 'react';
import { SecurityReport } from '../types';
import { 
  Shield, ShieldAlert, ShieldCheck, Server, Globe, Lock, AlertTriangle, 
  ExternalLink, RefreshCw, Download, FileJson, FileText, Printer 
} from 'lucide-react';

interface ScanReportProps {
  report: SecurityReport;
  url: string;
  onReset: () => void;
}

const ScanReport: React.FC<ScanReportProps> = ({ report, url, onReset }) => {
  const { score, riskLevel, details, summary, groundingUrls } = report;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRiskColor = (level: string) => {
    if (level === 'Safe') return 'text-green-600 bg-green-100';
    if (level === 'Suspicious') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const RiskIcon = riskLevel === 'Safe' ? ShieldCheck : riskLevel === 'Suspicious' ? AlertTriangle : ShieldAlert;

  // Export handlers
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `security_report_${new URL(url).hostname}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDownloadCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Target URL", url],
      ["Scan Date", new Date().toISOString()],
      ["Risk Level", riskLevel],
      ["Security Score", score.toString()],
      ["Summary", `"${summary.replace(/"/g, '""')}"`],
      ["Hosting Provider", `"${details.hosting.replace(/"/g, '""')}"`],
      ["SSL Certificate", `"${details.ssl.replace(/"/g, '""')}"`],
      ["Domain Age", `"${details.domainAge.replace(/"/g, '""')}"`],
      ["Blacklist Status", `"${details.blacklist.replace(/"/g, '""')}"`],
      ["Sources", `"${(groundingUrls || []).join(', ')}"`]
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.join(",")).join("\n");
      
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", csvContent);
    downloadAnchorNode.setAttribute("download", `security_report_${new URL(url).hostname}.csv`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      
      {/* Export Toolbar */}
      <div className="flex justify-between items-center mb-6 no-print">
        <h3 className="text-xl font-bold text-slate-800">Security Audit Report</h3>
        <div className="flex gap-2">
            <button onClick={handleDownloadJSON} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors" title="Download JSON">
                <FileJson size={16} /> <span className="hidden sm:inline">JSON</span>
            </button>
            <button onClick={handleDownloadCSV} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors" title="Download CSV">
                <FileText size={16} /> <span className="hidden sm:inline">CSV</span>
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors" title="Print / Save as PDF">
                <Printer size={16} /> <span className="hidden sm:inline">Print / PDF</span>
            </button>
        </div>
      </div>

      <div className="printable-area">
        {/* Header / Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            
            {/* Score Circle */}
            <div className="relative flex-shrink-0 group">
                <div className={`w-40 h-40 rounded-full border-8 flex flex-col items-center justify-center ${getScoreColor(score)}`}>
                    <span className="text-5xl font-bold">{score}</span>
                    <span className="text-sm font-medium uppercase mt-1 opacity-80">Safety Score</span>
                </div>
                {riskLevel === 'Safe' && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-lg no-print">
                        VERIFIED
                    </div>
                )}
            </div>

            {/* Key Findings */}
            <div className="flex-grow text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 truncate max-w-md">{url}</h2>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide flex items-center gap-2 ${getRiskColor(riskLevel)}`}>
                    <RiskIcon size={16} />
                    {riskLevel}
                </span>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed">{summary}</p>
            </div>
            </div>
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Card 1: Hosting */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                <div className="bg-indigo-50 p-3 rounded-lg">
                    <Server className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Hosting & Server</h4>
                    <p className="text-slate-800 font-medium">{details.hosting}</p>
                </div>
            </div>
            </div>

            {/* Card 2: SSL */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                <div className="bg-emerald-50 p-3 rounded-lg">
                    <Lock className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">SSL Certificate</h4>
                    <p className="text-slate-800 font-medium">{details.ssl}</p>
                </div>
            </div>
            </div>

            {/* Card 3: Domain Age */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Domain Info</h4>
                    <p className="text-slate-800 font-medium">{details.domainAge}</p>
                </div>
            </div>
            </div>

            {/* Card 4: Blacklist */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                <div className="bg-rose-50 p-3 rounded-lg">
                    <Shield className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Blacklist Status</h4>
                    <p className="text-slate-800 font-medium">{details.blacklist}</p>
                </div>
            </div>
            </div>
        </div>

        {/* Sources / Grounding */}
        {groundingUrls && groundingUrls.length > 0 && (
            <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Intelligence Sources (Free Resources)</h4>
                <div className="flex flex-wrap gap-2">
                    {groundingUrls.map((sourceUrl, idx) => (
                        <a 
                        key={idx} 
                        href={sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full transition-colors"
                        >
                            {new URL(sourceUrl).hostname} <ExternalLink size={10} />
                        </a>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-center mt-12 no-print">
        <button 
            onClick={onReset}
            className="flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all shadow-lg"
        >
            <RefreshCw size={20} />
            Check Another Website
        </button>
      </div>
    </div>
  );
};

export default ScanReport;