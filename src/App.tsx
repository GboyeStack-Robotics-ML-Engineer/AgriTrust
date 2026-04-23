import React, { useState, useEffect } from 'react';
import { Moon, Sun, Leaf, BarChart2, Home as HomeIcon } from 'lucide-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen font-sans bg-white dark:bg-neutral-950 transition-colors duration-300">
      
      {/* Universal Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold shadow-lg shadow-green-600/20 group-hover:scale-105 transition-transform">
              <Leaf size={20} />
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
              AgriTrust <span className="text-neutral-400 font-medium whitespace-nowrap">Edge</span>
            </h1>
          </div>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setCurrentView('home')}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
                currentView === 'home' 
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white' 
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900'
              }`}
            >
              <HomeIcon size={18} /> Home
            </button>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
                currentView === 'dashboard' 
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white' 
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900'
              }`}
            >
              <BarChart2 size={18} /> <span className="hidden sm:inline">Dashboard</span>
            </button>

            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-2" />

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-grow transition-opacity duration-300">
        {currentView === 'home' ? (
          <Home onLaunch={() => setCurrentView('dashboard')} />
        ) : (
          <Dashboard />
        )}
      </main>

    </div>
  );
}
