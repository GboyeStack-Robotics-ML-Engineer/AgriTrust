import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Activity, Wallet, ShieldCheck, ChevronRight, Fingerprint, Radar, Coins } from 'lucide-react';

export default function Home({ onLaunch }: { onLaunch: () => void }) {
  const [activeStep, setActiveStep] = useState(0);

  // Auto cycle steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((s) => (s + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      title: "Edge Telemetry",
      desc: "Computer vision analyzes field scans in real-time, instantly diagnosing crop health, pathogen risk, and yield potential.",
      icon: <Radar size={24} className="text-green-500" />
    },
    {
      title: "Financial Footprint",
      desc: "We securely aggregate sparse mobile money transactions (MoMo), transforming basic utility payments into a robust financial history.",
      icon: <Wallet size={24} className="text-blue-500" />
    },
    {
      title: "Data Fusion Score",
      desc: "Our engine converges biological viability with payment history to output an infallible 'AgriTrust Score' for micro-lending.",
      icon: <Fingerprint size={24} className="text-orange-500" />
    }
  ];

  return (
    <div className="w-full flex justify-center flex-col items-center">
      
      {/* Hero Section */}
      <div className="w-full min-h-[85vh] flex flex-col items-center justify-center pt-24 pb-12 px-6 xl:px-16 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-sm font-semibold mb-8 text-neutral-800 dark:text-neutral-200">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span> Live on Edge Preview
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl font-black tracking-tighter text-neutral-900 dark:text-white leading-[1.1] mb-8">
            Farm the Future. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-400">Score the Trust.</span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl text-center leading-relaxed mb-12">
            Bridging the gap between soil and finance. AgriTrust Edge combines biological crop capability with mobile money data to guarantee micro-loans for smallholder farmers.
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            onClick={onLaunch}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-full overflow-hidden shadow-2xl dark:shadow-white/10 transition-transform hover:scale-105"
          >
            Launch Dashboard <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>

      {/* Interactive Fusion Section */}
      <div className="w-full px-6 xl:px-16 py-24 bg-neutral-50 dark:bg-neutral-900/50 relative border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Text Guide */}
          <div className="flex flex-col gap-6">
            <div className="mb-8">
              <h2 className="text-4xl font-black text-neutral-900 dark:text-white mb-4">How Fusion Works</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg">We eliminate the bank's risk by predicting future capability alongside past reliability.</p>
            </div>

            {steps.map((step, i) => (
              <div 
                key={i} 
                onMouseEnter={() => setActiveStep(i)}
                className={`p-6 rounded-3xl cursor-pointer transition-all duration-500 border ${
                  activeStep === i 
                  ? 'border-green-500/30 bg-white dark:bg-neutral-800 shadow-xl shadow-green-500/5 scale-105 origin-left' 
                  : 'border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800/80 opacity-60'
                }`}
              >
                <div className="flex items-start gap-5">
                  <div className={`p-3 rounded-2xl ${activeStep === i ? 'bg-green-50 dark:bg-green-500/10' : 'bg-neutral-100 dark:bg-neutral-800'}`}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm md:text-base">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Dynamic Interactive Animation */}
          <div className="relative h-[600px] w-full rounded-[3rem] bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden flex items-center justify-center p-8 shadow-2xl">
              
            <AnimatePresence mode="wait">
              {/* STEP 0: COMPUTER VISION */}
              {activeStep === 0 && (
                <motion.div key="step-0" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative flex flex-col items-center justify-center w-72 h-72 border-2 border-green-500/40 rounded-[2.5rem] bg-neutral-900/40 backdrop-blur-md overflow-hidden shadow-[0_0_60px_rgba(34,197,94,0.15)]">
                    <Leaf size={120} className="text-neutral-900 dark:text-white opacity-20" />
                    
                    {/* Laser */}
                    <motion.div animate={{ top: ['-10%', '110%', '-10%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute left-0 right-0 h-1.5 bg-green-400 shadow-[0_0_20px_rgba(74,222,128,1)] z-10" />
                    
                    {/* Tags */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, times: [0, 0.1, 0.9] }} className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur border border-green-500/30 text-[10px] text-green-400 font-mono p-3 rounded-xl">
                      <div>&gt; DIAGNOSTIC RUNNING</div>
                      <div className="text-white">&gt; CROP: MAIZE</div>
                      <div>&gt; PATHOGENS: NONE</div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* STEP 1: FINANCIAL DATA */}
              {activeStep === 1 && (
                <motion.div key="step-1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="w-full max-w-sm flex flex-col gap-4">
                    {[1, 2, 3].map((item, i) => (
                      <motion.div key={i} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 * i, duration: 0.5, type: 'spring' }} className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-5 rounded-2xl flex items-center justify-between shadow-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center">
                            <Coins size={20} className="text-blue-500 dark:text-blue-400"/>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider mb-1">MoMo Transfer</div>
                            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">Utility Repayment</div>
                          </div>
                        </div>
                        <div className="text-base font-bold text-green-600 dark:text-green-400">+₵1,500.00</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: TRUST SCORE */}
              {activeStep === 2 && (
                <motion.div key="step-2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} className="absolute inset-0 flex items-center justify-center p-8">
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="bg-white dark:bg-gradient-to-br dark:from-green-500/20 dark:to-neutral-900 border border-neutral-200 dark:border-green-500/30 p-10 rounded-[3rem] flex flex-col items-center justify-center shadow-2xl dark:shadow-[0_0_80px_rgba(34,197,94,0.2)] w-full max-w-sm">
                    <ShieldCheck size={72} className="text-green-500 mb-6" />
                    <div className="text-neutral-500 dark:text-neutral-400 text-sm font-bold tracking-widest uppercase mb-2">AgriTrust Score</div>
                    <div className="text-8xl font-black text-neutral-900 dark:text-white mb-6 tracking-tighter drop-shadow-sm">785</div>
                    <div className="bg-green-600 text-white px-6 py-2.5 rounded-full text-sm font-black tracking-wider shadow-lg shadow-green-600/30">
                      PRE-APPROVED
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
      
    </div>
  );
}
