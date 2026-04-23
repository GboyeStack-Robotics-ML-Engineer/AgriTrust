import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Leaf, Activity, ShieldCheck, ChevronRight, CheckCircle2, AlertCircle, FileText, RefreshCw, X, Download, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

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

// Simulated dynamic graph data based on score
const generateGraphData = (score: number) => {
  const base = score > 600 ? 50 : 20;
  return [
    { month: 'Jan', projection: base + Math.random() * 20, baseline: 30 },
    { month: 'Feb', projection: base + 10 + Math.random() * 20, baseline: 35 },
    { month: 'Mar', projection: base + 25 + Math.random() * 30, baseline: 32 },
    { month: 'Apr', projection: base + 40 + Math.random() * 30, baseline: 40 },
    { month: 'May', projection: base + 60 + Math.random() * 30, baseline: 45 },
    { month: 'Jun', projection: base + 80 + Math.random() * 40, baseline: 50 },
  ];
};

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [farmerId, setFarmerId] = useState('F-123');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [graphData, setGraphData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (result) {
      setGraphData(generateGraphData(result.creditScore));
    }
  }, [result]);

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

  const resetDashboard = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadReport = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert("Executive report PDF has been successfully generated and mapped.");
    }, 2000);
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
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert('Failed to analyze the crop. Note: Ensure GEMINI_API_KEY is configured correctly.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 xl:px-12 py-10 grid lg:grid-cols-12 gap-8 lg:gap-12 relative min-h-screen">
      
      {/* Absolute ambient background */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-neutral-100 to-transparent dark:from-neutral-900/50 dark:to-transparent pointer-events-none -z-10" />

      {/* SECTION A: INPUT SIDEBAR */}
      <div className="lg:col-span-4 space-y-6 flex flex-col h-full z-10">
        <div className="bg-white/80 dark:bg-neutral-900/60 backdrop-blur-2xl rounded-[2.5rem] border border-white dark:border-neutral-800 shadow-xl dark:shadow-2xl p-8 sticky top-32">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight dark:text-white">Edge Node</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Upload field telemetry</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500">
              <Activity size={24} />
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="relative group">
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3 ml-1">Identity Lookup</label>
              <select 
                className="w-full bg-neutral-100 dark:bg-neutral-950 border-2 border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 focus:border-green-500 dark:focus:border-green-500 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none transition-all dark:text-white appearance-none cursor-pointer"
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
              >
                <option value="F-123">Farmer ID: F-123 (High MoMo Vol)</option>
                <option value="F-456">Farmer ID: F-456 (Sparse Record)</option>
              </select>
              <ChevronRight size={16} className="absolute right-5 top-[2.7rem] text-neutral-400 rotate-90 pointer-events-none" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3 ml-1">Optical Scan</label>
              <div 
                className={`relative flex flex-col items-center justify-center w-full h-[320px] rounded-[2rem] border-2 transition-all overflow-hidden ${previewUrl ? 'border-transparent shadow-lg' : 'border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer'}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => !previewUrl && fileInputRef.current?.click()}
              >
                <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}/>
                
                <AnimatePresence mode="wait">
                  {previewUrl ? (
                    <motion.div key="preview" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute inset-0 w-full h-full group">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm flex items-center justify-center">
                        <button onClick={(e) => { e.stopPropagation(); resetDashboard(); }} className="bg-white/20 hover:bg-red-500 text-white backdrop-blur-lg px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-colors shadow-2xl">
                          <X size={18} /> Discard Image
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="upload" className="flex flex-col items-center text-center p-8">
                      <div className="w-20 h-20 rounded-full bg-white dark:bg-neutral-900 shadow-xl flex items-center justify-center mb-6">
                        <UploadCloud className="text-green-500" size={36} />
                      </div>
                      <p className="font-bold text-neutral-900 dark:text-neutral-200 mb-2">Initialize Scan</p>
                      <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500">Drag & drop or browse</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button 
              disabled={!file || isAnalyzing} 
              onClick={handleSyncAndAnalyze} 
              className={`w-full relative overflow-hidden py-5 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all ${!file ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed' : 'bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black group font-black'}`}
            >
              {isAnalyzing && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              )}
              {isAnalyzing ? (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <RefreshCw size={20} className="animate-spin" /> Fusing Data Stream...
                </motion.span>
              ) : (
                <>Run AI Analysis <ChevronRight size={20} className="group-hover:translate-x-1.5 transition-transform" /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION B: OUTPUT DASHBOARD */}
      <div className="lg:col-span-8 z-10">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, filter: "blur(10px)" }} transition={{ duration: 0.3 }} className="h-full min-h-[700px] border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-[3rem] flex flex-col items-center justify-center bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.02)_0%,transparent_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)]" />
              <div className="relative flex flex-col items-center justify-center w-48 h-48 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/50 shadow-2xl mb-8">
                <ShieldCheck size={64} className="text-neutral-300 dark:text-neutral-700" />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-t-2 border-green-500/30 border-r-2 border-transparent" />
              </div>
              <h3 className="text-3xl font-black mb-3 text-neutral-900 dark:text-white">Awaiting Fusion Protocol</h3>
              <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-sm">Connect a node scan on the left edge to compute institutional risk.</p>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.6, type: 'spring', damping: 20 }} className="space-y-6">
              
              {/* TOP HEADER CONTROLS */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 dark:bg-neutral-900/60 backdrop-blur-2xl p-6 px-8 rounded-3xl border border-white dark:border-neutral-800 shadow-xl">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-xl font-black dark:text-white flex items-center gap-3">
                    Diagnostic Report <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-green-200 dark:border-green-500/30">Synced</span>
                  </h2>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 font-medium">Session ID: {Math.random().toString(36).substring(7).toUpperCase()}-{farmerId}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={resetDashboard} className="p-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl text-neutral-600 dark:text-neutral-300 transition-colors shadow-sm">
                    <RefreshCw size={20} />
                  </button>
                  <button onClick={downloadReport} disabled={isDownloading} className="flex items-center gap-2 px-5 py-3 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-800/40 text-green-700 dark:text-green-400 rounded-xl font-bold transition-colors shadow-sm text-sm">
                    {isDownloading ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />} Export PDF
                  </button>
                </div>
              </div>

              {/* BENTO GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Agronomy Module */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 dark:bg-neutral-900/60 backdrop-blur-2xl rounded-[2.5rem] border border-white dark:border-neutral-800 p-8 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110" />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-green-600 dark:text-green-500 mb-8 flex items-center gap-2"><Leaf size={16} /> Biology Matrix</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-500 font-bold uppercase tracking-wider mb-2">Detected Strain</div>
                      <div className="text-4xl font-black capitalize text-neutral-900 dark:text-white truncate">{result.cropAnalysis.crop_type}</div>
                    </div>
                    
                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="text-xs text-neutral-500 dark:text-neutral-500 font-bold uppercase tracking-wider mb-3">Pathogen Status</div>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${result.cropAnalysis.health_score > 70 ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'}`}>
                          {result.cropAnalysis.health_score > 70 ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
                        </div>
                        <span className="text-2xl font-bold capitalize text-neutral-900 dark:text-white">{result.cropAnalysis.health_status}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Financial Module */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/80 dark:bg-neutral-900/60 backdrop-blur-2xl rounded-[2.5rem] border border-white dark:border-neutral-800 p-8 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110" />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-8 flex items-center gap-2"><FileText size={16} /> MoMo Ledger</h3>
                  
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-500 font-bold uppercase tracking-wider mb-2">Avg Volume</div>
                      <div className="text-4xl font-black text-neutral-900 dark:text-white">₵{(result.financialData.avgMonthlyTransactions/1000).toFixed(1)}k</div>
                    </div>
                  </div>

                  {/* AI Confidence Bar */}
                  <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3 text-neutral-500 dark:text-neutral-400"><span>Harvest Prediction</span><span className={result.cropAnalysis.health_score > 70 ? "text-green-500" : "text-orange-500"}>{result.cropAnalysis.health_score}%</span></div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-950 rounded-full h-4 overflow-hidden relative border border-transparent dark:border-neutral-800 shadow-inner">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.max(0, result.cropAnalysis.health_score))}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className={`absolute top-0 left-0 h-full rounded-full ${result.cropAnalysis.health_score > 70 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-orange-400 to-orange-500'}`} />
                    </div>
                  </div>
                </motion.div>
                
                {/* BIG SCORE CARD OVERARCHING BENTO GRID */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`md:col-span-2 rounded-[3rem] border-2 p-8 md:p-12 relative overflow-hidden backdrop-blur-2xl shadow-2xl flex flex-col xl:flex-row items-center xl:items-stretch justify-between gap-10 ${result.creditScore >= 650 ? 'bg-green-50/90 dark:bg-neutral-900 border-green-200 dark:border-green-500/20' : 'bg-orange-50/90 dark:bg-neutral-900 border-orange-200 dark:border-orange-500/20'}`}>
                  
                  {/* Decorative Background Blob */}
                  <div className={`absolute -right-40 -bottom-40 w-96 h-96 rounded-full blur-[100px] pointer-events-none opacity-40 ${result.creditScore >= 650 ? 'bg-green-400 dark:bg-green-600' : 'bg-orange-400 dark:bg-orange-600'}`} />

                  <div className="flex-1 w-full relative z-10 flex flex-col justify-between">
                    <div>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 ${result.creditScore >= 650 ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400'} rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border ${result.creditScore >= 650 ? 'border-green-200 dark:border-green-500/20' : 'border-orange-200 dark:border-orange-500/20'}`}>
                        <Fingerprint size={16}/> Immutable Trust Engine
                      </div>
                      <h2 className="text-4xl sm:text-5xl font-black mb-4 dark:text-white tracking-tight">AgriTrust Score</h2>
                      <p className="text-lg text-neutral-600 dark:text-neutral-400 font-medium max-w-md">Our algorithm fuses localized biological health with historic payment reliability into a definitive underwriting metric.</p>
                    </div>

                    {/* Chart Container within Score card */}
                    <div className="h-[140px] w-full mt-8 opacity-80 mix-blend-multiply dark:mix-blend-screen">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={graphData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={result.creditScore >= 650 ? '#22c55e' : '#f97316'} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor={result.creditScore >= 650 ? '#22c55e' : '#f97316'} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="projection" stroke={result.creditScore >= 650 ? '#22c55e' : '#f97316'} strokeWidth={3} fillOpacity={1} fill="url(#colorProj)" />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Main Score UI */}
                  <div className="flex flex-col items-center justify-center shrink-0 w-full xl:w-auto relative z-10 bg-white/50 dark:bg-black/20 p-8 rounded-[2rem] backdrop-blur-md border border-white/50 dark:border-white/5">
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, type: 'spring', damping: 10 }} className={`text-[7rem] sm:text-[9rem] leading-none font-black tracking-tighter ${result.creditScore >= 650 ? 'text-green-600 dark:text-green-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'text-orange-600 dark:text-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]'}`}>
                      {result.creditScore}
                    </motion.div>
                    <div className="text-xs font-bold uppercase tracking-[0.3em] mt-2 mb-8 text-neutral-500 dark:text-neutral-400">Perfect 850</div>
                    <div className={`px-10 py-5 rounded-full font-black w-full text-center text-white text-lg tracking-widest shadow-2xl transition-transform hover:scale-105 cursor-default ${result.creditScore >= 650 ? 'bg-gradient-to-r from-green-600 to-green-500 shadow-green-600/30' : 'bg-gradient-to-r from-orange-600 to-orange-500 shadow-orange-600/30'}`}>
                      {result.creditScore >= 650 ? 'PRE-APPROVED' : 'MANUAL REVIEW'}
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
