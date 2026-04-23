/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { UploadCloud, Leaf, Activity, ShieldCheck, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AnalysisResult {
  cropAnalysis: {
    crop_type: string;
    health_status: string;
    health_score: number;
  };
  financialData: {
    farmerId: string;
    avgMonthlyTransactions: number;
    loanRepaymentHistory: string;
    tenureMonths: number;
  };
  creditScore: number;
}

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [farmerId, setFarmerId] = useState('F-123');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    if (selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setResult(null); // Reset previous result when a new image is selected
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleSyncAndAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('farmer_id', farmerId);

    try {
      // Intentionally call the backend without full origin so it proxies naturally
      const response = await fetch('/api/analyze-crop', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze the crop. Note: The preview environment must have process.env.GEMINI_API_KEY configured correctly.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-green-600 flex items-center justify-center text-white font-bold">
            <Leaf size={18} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-800">AgriTrust Edge</h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-neutral-500">
          <span className="hidden sm:inline">Pilot Program v1.0</span>
          <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          Status: Edge Online
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-8 grid lg:grid-cols-12 gap-8">
        
        {/* SECTION A: EDGE SIMULATION (INPUT) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold tracking-tight mb-1">Edge Simulation</h2>
            <p className="text-neutral-500 text-sm mb-6">Upload a local field scan to initiate the sync process.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Farmer ID</label>
                <select 
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                  value={farmerId}
                  onChange={(e) => setFarmerId(e.target.value)}
                >
                  <option value="F-123">F-123 (Established history)</option>
                  <option value="F-456">F-456 (New/Sparse history)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Crop Image</label>
                <div 
                  className={`relative flex flex-col items-center justify-center w-full min-h-[220px] rounded-xl border-2 border-dashed transition-colors ${previewUrl ? 'border-green-400 bg-green-50/50' : 'border-neutral-300 hover:bg-neutral-50 cursor-pointer'}`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => !previewUrl && fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                  />
                  
                  {previewUrl ? (
                    <div className="relative w-full h-full p-2 flex flex-col items-center group">
                      <img src={previewUrl} alt="Crop preview" className="max-h-48 rounded-lg object-contain" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewUrl(null); setResult(null); }}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur text-neutral-700 hover:text-red-600 px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center p-6">
                      <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                        <UploadCloud className="text-neutral-400" size={24} />
                      </div>
                      <p className="text-sm font-medium text-neutral-700">Click to upload or drag and drop</p>
                      <p className="text-xs text-neutral-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                disabled={!file || isAnalyzing}
                onClick={handleSyncAndAnalyze}
                className="w-full mt-4 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Syncing & Analyzing...
                  </>
                ) : (
                  <>
                    Sync & Analyze <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* SECTION B: MICROFINANCE DASHBOARD (OUTPUT) */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[400px] border border-dashed border-neutral-300 rounded-2xl flex flex-col items-center justify-center text-neutral-400 bg-neutral-50/50 p-8 text-center"
              >
                <ShieldCheck size={48} className="mb-4 text-neutral-300" strokeWidth={1.5} />
                <h3 className="text-lg font-medium text-neutral-600 mb-2">Awaiting Edge Data</h3>
                <p className="text-sm max-w-sm">Upload a crop image to see the fused agricultural and financial risk assessment dashboard.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold tracking-tight">Microfinance Dashboard</h2>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">Live Sync Complete</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CARD 1: Agronomy */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-neutral-500 mb-4">
                      <Leaf size={16} />
                      <h3 className="text-sm font-medium uppercase tracking-wider">Agronomy Layer</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-neutral-500 mb-1">Detected Crop</div>
                        <div className="text-lg font-semibold capitalize">{result.cropAnalysis.crop_type}</div>
                      </div>
                      <div className="h-px bg-neutral-100"></div>
                      <div>
                        <div className="text-xs text-neutral-500 mb-1">Health Status</div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold capitalize">{result.cropAnalysis.health_status}</span>
                          {/* Crude sentiment color based on text logic, could be refined */}
                          {result.cropAnalysis.health_score > 70 ? (
                            <CheckCircle2 size={18} className="text-green-500" />
                          ) : (
                            <AlertCircle size={18} className="text-orange-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* CARD 2: Edge Data */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm"
                  >
                     <div className="flex items-center gap-2 text-neutral-500 mb-4">
                      <Activity size={16} />
                      <h3 className="text-sm font-medium uppercase tracking-wider">Edge Telemetry</h3>
                    </div>
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="text-xs text-neutral-500 flex justify-between mb-2">
                          <span>AI Crop Health Score</span>
                          <span className="font-medium text-neutral-800">{result.cropAnalysis.health_score}/100</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, Math.max(0, result.cropAnalysis.health_score))}%` }}
                            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                            className={`h-2.5 rounded-full ${result.cropAnalysis.health_score > 70 ? 'bg-green-500' : result.cropAnalysis.health_score > 40 ? 'bg-yellow-400' : 'bg-red-500'}`}
                          ></motion.div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-neutral-500 mb-1">Financial History</div>
                          <div className="text-sm font-medium capitalize">{result.financialData.loanRepaymentHistory}</div>
                        </div>
                        <div>
                          <div className="text-xs text-neutral-500 mb-1">Avg Vol/Mo</div>
                          <div className="text-sm font-medium">₵{result.financialData.avgMonthlyTransactions.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* CARD 3: The Solution */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className={`rounded-2xl border p-6 flex flex-col md:flex-row items-center justify-between gap-6 ${
                    result.creditScore >= 650 
                      ? 'bg-green-50/50 border-green-200' 
                      : 'bg-orange-50/50 border-orange-200'
                  }`}
                >
                  <div>
                    <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-500 mb-1">Final Risk Assessment</h3>
                    <div className="text-neutral-900 font-semibold text-lg">AgriTrust Trust Score</div>
                    <p className="text-sm text-neutral-600 max-w-sm mt-2">
                      Generated by combining historical mobile money transactions with predictive edge crop health data.
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center min-w-[200px]">
                    <div className={`text-5xl font-black tracking-tighter ${
                      result.creditScore >= 650 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      >
                        {result.creditScore}
                      </motion.span>
                    </div>
                    <div className="text-neutral-400 text-xs font-medium uppercase tracking-widest mt-1">out of 850</div>
                    
                    <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-bold w-full text-center ${
                       result.creditScore >= 650 
                       ? 'bg-green-600 text-white shadow-md shadow-green-600/20' 
                       : 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    }`}>
                      {result.creditScore >= 650 ? 'PRE-APPROVED' : 'MANUAL REVIEW REQUIRED'}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

