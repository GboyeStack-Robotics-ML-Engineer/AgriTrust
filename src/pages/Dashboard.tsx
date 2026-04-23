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

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [farmerId, setFarmerId] = useState('F-123');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFileSelection(e.dataTransfer.files[0]);
  };

  const handleFileSelection = (selectedFile: File) => {
    if (selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
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
      const response = await fetch('/api/analyze-crop', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Analysis failed');
      setResult(await response.json());
    } catch (error) {
      alert('Failed to analyze the crop. Note: Ensure GEMINI_API_KEY is configured correctly.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-none px-4 sm:px-6 lg:px-12 py-8 grid lg:grid-cols-12 gap-8">
      {/* SECTION A: INPUT */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm h-full">
          <h2 className="text-xl font-bold tracking-tight mb-2 dark:text-white">Edge Simulation</h2>
          <p className="text-neutral-500 text-sm mb-8">Upload a local field scan to initiate data fusion.</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-neutral-300">Select Farmer ID</label>
              <select 
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
              >
                <option value="F-123">F-123 (Established history)</option>
                <option value="F-456">F-456 (New/Sparse history)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-neutral-300">Crop Image</label>
              <div 
                className={`relative flex flex-col items-center justify-center w-full min-h-[260px] rounded-2xl border-2 border-dashed transition-all ${previewUrl ? 'border-green-400 bg-green-50/50 dark:bg-green-500/10' : 'border-neutral-300 dark:border-neutral-700 cursor-pointer'}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => !previewUrl && fileInputRef.current?.click()}
              >
                <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}/>
                {previewUrl ? (
                  <div className="relative w-full h-full p-4 flex flex-col items-center group">
                    <img src={previewUrl} alt="Preview" className="max-h-56 rounded-xl object-contain" />
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewUrl(null); setResult(null); }} className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 text-sm px-4 py-2 opacity-0 group-hover:opacity-100 rounded-full shadow transition-all dark:text-white">Remove</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4"><UploadCloud className="text-neutral-400" size={32} /></div>
                    <p className="font-medium dark:text-white">Click or drag & drop</p>
                  </div>
                )}
              </div>
            </div>

            <button disabled={!file || isAnalyzing} onClick={handleSyncAndAnalyze} className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 group">
              {isAnalyzing ? "Processing..." : <>Sync & Analyze <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION B: OUTPUT */}
      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full min-h-[500px] border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-3xl flex flex-col items-center justify-center text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/30 p-10 text-center">
              <ShieldCheck size={48} className="mb-4" />
              <h3 className="text-2xl font-semibold mb-2 dark:text-neutral-500">Awaiting Edge Data</h3>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <h2 className="text-2xl font-bold dark:text-white">Microfinance Overview</h2>
                <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase">Live Sync Verified</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8">
                  <h3 className="text-sm font-bold uppercase text-green-600 dark:text-green-500 mb-6 flex gap-2"><Leaf size={18} /> Agronomy Layer</h3>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Detected Crop</div>
                  <div className="text-3xl font-bold capitalize dark:text-white mb-6">{result.cropAnalysis.crop_type}</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Health Status</div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-semibold capitalize dark:text-white">{result.cropAnalysis.health_status}</span>
                    {result.cropAnalysis.health_score > 70 ? <CheckCircle2 size={24} className="text-green-500"/> : <AlertCircle size={24} className="text-orange-500"/>}
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8">
                  <h3 className="text-sm font-bold uppercase text-blue-600 dark:text-blue-500 mb-6 flex gap-2"><Activity size={18} /> Edge Telemetry</h3>
                  <div className="flex justify-between text-sm font-medium mb-2 dark:text-neutral-300"><span>AI Confidence</span><span>{result.cropAnalysis.health_score}%</span></div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-3 mb-8">
                     <motion.div animate={{ width: `${Math.min(100, Math.max(0, result.cropAnalysis.health_score))}%` }} className="h-full rounded-full bg-green-500"></motion.div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                       <div className="text-xs text-neutral-500 mb-1 uppercase">Repayment</div>
                       <div className="text-lg font-bold capitalize text-green-600 dark:text-green-400">{result.financialData.loanRepaymentHistory}</div>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                       <div className="text-xs text-neutral-500 mb-1 uppercase">MoMo Vol</div>
                       <div className="text-lg font-bold dark:text-white">₵{(result.financialData.avgMonthlyTransactions/1000).toFixed(1)}k</div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className={`rounded-3xl border-2 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 ${result.creditScore >= 650 ? 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-800' : 'bg-orange-50 dark:bg-orange-950/20 border-orange-300 dark:border-orange-800'}`}>
                <div className="max-w-lg">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase mb-4"><ShieldCheck size={14}/> Final Risk Assessment</div>
                  <h2 className="text-4xl font-black mb-4 dark:text-white">AgriTrust Score</h2>
                  <p className="text-lg text-neutral-600 dark:text-neutral-400">By fusing biological predictions with historical footprints, we eliminate traditional risks.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`text-8xl font-black tracking-tighter ${result.creditScore >= 650 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>{result.creditScore}</div>
                  <div className="text-sm font-bold uppercase tracking-[0.2em] mt-2 mb-6 text-neutral-400">out of 850</div>
                  <div className={`px-8 py-3 rounded-full font-black w-full text-center text-white ${result.creditScore >= 650 ? 'bg-green-600 dark:bg-green-500' : 'bg-orange-600 dark:bg-orange-500'}`}>
                    {result.creditScore >= 650 ? 'PRE-APPROVED' : 'MANUAL REVIEW'}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
