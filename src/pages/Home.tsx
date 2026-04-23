import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Leaf, Wallet, ShieldCheck, ChevronRight, Fingerprint, Radar, Coins } from 'lucide-react';

// Smoother scroll transition with useSpring to dampen the scroll tracking
const HeroFadeSection = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "center start"] // Fade out faster
  });
  
  // Apply a spring to the scroll progress for a buttery smooth feel
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const opacity = useTransform(smoothScroll, [0, 0.8], [1, 0]);
  const filter = useTransform(smoothScroll, [0, 0.8], ["blur(0px)", "blur(24px)"]);
  const scale = useTransform(smoothScroll, [0, 1], [1, 0.95]); // Less aggressive scale
  const y = useTransform(smoothScroll, [0, 1], [0, 150]); 

  return (
    <div ref={ref} className="w-full relative z-10">
      <motion.div style={{ opacity, scale, y, filter }} className={className}>
        {children}
      </motion.div>
    </div>
  );
}

// Snaps into sharp focus with improved thresholds and spring smoothing
const FocusSection = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 30%"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 });

  const opacity = useTransform(smoothScroll, [0, 1], [0.2, 1]);
  const filter = useTransform(smoothScroll, [0, 1], ["blur(20px)", "blur(0px)"]);
  const scale = useTransform(smoothScroll, [0, 1], [0.96, 1]);
  const y = useTransform(smoothScroll, [0, 1], [60, 0]);

  return (
    <div ref={ref} className="w-full relative z-20">
      <motion.div style={{ opacity, filter, scale, y }} className={className}>
        {children}
      </motion.div>
    </div>
  );
}

// High-quality, verified Unsplash source URLs that reliably load
const IMAGES = [
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1200&auto=format&fit=crop", // Crop field
  "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop", // Digital payment / Terminal
  "https://images.unsplash.com/photo-1589828135805-728b7eebd7fb?q=80&w=1200&auto=format&fit=crop"  // Smiling African farmer / worker
];

const TypingText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  // Split into words first, then characters, to ensure words wrap as a whole block
  const words = text.split(" ");
  
  return (
    <motion.span
      className="inline-flex flex-wrap lg:flex-nowrap py-2"
      style={{ columnGap: '0.25em' }}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.04, delayChildren: delay } },
        hidden: {},
      }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex whitespace-nowrap">
          {Array.from(word).map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 15, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 150, damping: 10 } }
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
};

export default function Home({ onLaunch }: { onLaunch: () => void }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((s) => (s + 1) % 3);
    }, 5000);
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
    <div className="w-full flex justify-center flex-col items-center overflow-x-hidden">
      
      {/* Hero Section */}
      <HeroFadeSection className="w-full min-h-[95vh] flex items-center justify-center pt-24 pb-16 px-6 xl:px-16 relative overflow-visible">
        {/* Background Ambient Glows */}
        <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-green-500/10 blur-[180px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-emerald-500/10 blur-[180px] rounded-full pointer-events-none" />

        <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 w-full">
          
          {/* Left: Text Guide */}
          <div className="flex flex-col items-start text-left lg:col-span-7 xl:col-span-7 pr-0 xl:pr-4 w-full">
            <div className="w-full text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-black tracking-tighter text-neutral-900 dark:text-white leading-[1.1] mb-8">
              <div className="w-full">
                <TypingText text="Farm the Future." />
              </div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-400 mt-0 lg:mt-2 w-full">
                <TypingText text="Score the Trust." delay={0.8} />
              </div>
            </div>
            
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed mb-12">
              Bridging the gap between the soil and modern finance. AgriTrust Edge combines pure biological capability with mobile money data to guarantee micro-loans for smallholder farmers securely.
            </motion.p>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}>
              <button 
                onClick={onLaunch}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 font-bold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-full overflow-hidden shadow-2xl shadow-green-900/20 dark:shadow-white/10 transition-transform hover:scale-105 active:scale-95 text-lg"
              >
                Launch Dashboard <ChevronRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Right: Dynamic Interactive Animation */}
          <div className="relative h-[450px] lg:h-[600px] w-full max-w-[600px] mx-auto lg:max-w-none rounded-[3rem] bg-white/50 dark:bg-neutral-900/40 border border-white/80 dark:border-neutral-800 backdrop-blur-3xl overflow-hidden flex items-center justify-center p-8 shadow-2xl shadow-neutral-200/50 dark:shadow-black/50 lg:col-span-5 xl:col-span-5">
            
            {/* Subtle inner grid pattern for depth */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }} />

            <AnimatePresence mode="wait">
              {/* STEP 0: COMPUTER VISION */}
              {activeStep === 0 && (
                <motion.div key="step-0" initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} transition={{ duration: 0.5 }} className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative flex flex-col items-center justify-center w-80 h-80 border-2 border-green-500/30 rounded-[3rem] bg-white/40 dark:bg-neutral-900/60 backdrop-blur-xl overflow-hidden shadow-[0_0_80px_rgba(34,197,94,0.15)]">
                    <Leaf size={140} className="text-neutral-300 dark:text-neutral-800 opacity-50" />
                    
                    {/* Laser */}
                    <motion.div animate={{ top: ['-20%', '120%', '-20%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-0 right-0 h-1 bg-green-400 shadow-[0_0_30px_rgba(74,222,128,1)] z-10" />
                    
                    {/* Tags */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: [0, 1, 0], y: [10, 0, 0] }} transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.1, 0.9] }} className="absolute bottom-6 left-6 right-6 bg-neutral-900/80 backdrop-blur-md border border-green-500/30 text-[11px] text-green-400 font-mono p-4 rounded-2xl shadow-2xl">
                      <div className="mb-1">&gt; SYNC_DIAGNOSTIC</div>
                      <div className="text-white mb-1">&gt; CROP: MAIZE (98%)</div>
                      <div>&gt; PATHOGENS: CLEAR</div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* STEP 1: FINANCIAL DATA */}
              {activeStep === 1 && (
                <motion.div key="step-1" initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} transition={{ duration: 0.5 }} className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="w-full max-w-sm flex flex-col gap-5">
                    {[
                      { amount: "+₵1,500.00", desc: "Harvest Sale", delay: 0 },
                      { amount: "-₵250.00", desc: "Fertilizer MoMo", delay: 0.1 },
                      { amount: "-₵100.00", desc: "Utility Payment", delay: 0.2 },
                    ].map((item, i) => (
                      <motion.div key={i} initial={{ x: 60, opacity: 0, filter: "blur(10px)" }} animate={{ x: 0, opacity: 1, filter: "blur(0px)" }} transition={{ delay: item.delay, duration: 0.6, type: 'spring', damping: 14 }} className="bg-white/80 dark:bg-neutral-800/90 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 p-5 rounded-2xl flex items-center justify-between shadow-xl">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${i === 0 ? 'bg-green-50 dark:bg-green-500/20 text-green-500 dark:text-green-400' : 'bg-blue-50 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400'}`}>
                            <Coins size={24} />
                          </div>
                          <div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider mb-1">MoMo Transfer</div>
                            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">{item.desc}</div>
                          </div>
                        </div>
                        <div className={`text-lg font-black ${i === 0 ? 'text-green-600 dark:text-green-400' : 'text-neutral-700 dark:text-neutral-300'}`}>{item.amount}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: TRUST SCORE */}
              {activeStep === 2 && (
                <motion.div key="step-2" initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} transition={{ duration: 0.5 }} className="absolute inset-0 flex items-center justify-center p-8">
                  <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', damping: 14 }} className="bg-white/90 dark:bg-gradient-to-br dark:from-green-500/10 dark:to-neutral-900 border border-white dark:border-green-500/20 backdrop-blur-xl p-12 rounded-[3.5rem] flex flex-col items-center justify-center shadow-2xl dark:shadow-[0_0_100px_rgba(34,197,94,0.15)] w-full max-w-sm text-center">
                    <ShieldCheck size={80} className="text-green-500 mb-6 drop-shadow-sm" />
                    <div className="text-neutral-500 dark:text-neutral-400 text-sm font-bold tracking-widest uppercase mb-3">AgriTrust Score</div>
                    <div className="text-8xl font-black text-neutral-900 dark:text-white mb-8 tracking-tighter drop-shadow-sm">785</div>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3.5 rounded-full text-base font-black tracking-widest shadow-xl shadow-green-500/30">
                      PRE-APPROVED
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </HeroFadeSection>

      {/* Interactive Fusion Section */}
      <FocusSection className="w-full px-6 xl:px-16 py-16 md:py-24 bg-neutral-50/80 dark:bg-neutral-950/50 relative border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Text Guide */}
          <div className="flex flex-col gap-6">
            <div className="mb-8">
              <h2 className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white mb-6 leading-[1.1] tracking-tight">How Fusion Works</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg md:text-xl leading-relaxed max-w-lg">We eliminate the bank's risk by algorithmically predicting future capability alongside past reliability.</p>
            </div>

            <div className="space-y-4">
              {steps.map((step, i) => (
                <div 
                  key={i} 
                  onMouseEnter={() => setActiveStep(i)}
                  className={`p-5 md:p-6 rounded-[2rem] cursor-pointer transition-all duration-500 border ${
                    activeStep === i 
                    ? 'border-green-500/20 bg-white dark:bg-neutral-900 shadow-2xl shadow-green-500/5 scale-[1.02] origin-left' 
                    : 'border-transparent hover:bg-white/50 dark:hover:bg-neutral-900/50 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-2xl shrink-0 ${activeStep === i ? 'bg-green-50 dark:bg-green-500/10 shadow-inner' : 'bg-neutral-100 dark:bg-neutral-800'}`}>
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">{step.title}</h3>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-base">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dynamic Interactive Carousel */}
          <div className="relative h-[350px] lg:h-[500px] w-full rounded-[3rem] bg-neutral-200 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
            <AnimatePresence mode="wait">
              <motion.img 
                key={`img-${activeStep}`}
                src={IMAGES[activeStep]}
                initial={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Custom easing for premium feel
                className="absolute inset-0 w-full h-full object-cover"
                alt="Feature illustration"
              />
            </AnimatePresence>
            
            {/* Elegant overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Active Indicator dots inside image */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-4 z-10">
              {[0, 1, 2].map((dot) => (
                <div 
                  key={dot}
                  className={`h-2.5 rounded-full transition-all duration-700 ease-out ${activeStep === dot ? 'w-10 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]' : 'w-2.5 bg-white/40 hover:bg-white/70'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </FocusSection>
      
    </div>
  );
}
