import React, { useEffect, useState } from 'react';
import { Lock, Globe, Server, Database } from 'lucide-react';

const steps = [
  { text: "Resolving DNS...", icon: Globe },
  { text: "Checking Blacklists...", icon: Database },
  { text: "Analyzing SSL Certificate...", icon: Lock },
  { text: "Verifying Server Reputation...", icon: Server },
  { text: "Finalizing Security Score...", icon: ShieldCheck }
];

import { ShieldCheck } from 'lucide-react';

const LoadingScan: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = steps[currentStep].icon;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative w-32 h-32 mb-8 bg-blue-50 rounded-full flex items-center justify-center border-4 border-blue-100">
         <div className="scanner-line bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
         <ActiveIcon className="w-16 h-16 text-blue-600 animate-pulse" />
      </div>

      <h3 className="text-2xl font-bold text-slate-800 mb-2">{steps[currentStep].text}</h3>
      <p className="text-slate-500">Please wait while we gather intelligence sources.</p>
      
      <div className="w-full max-w-md mt-8 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingScan;
