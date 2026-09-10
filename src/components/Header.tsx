import React from 'react';
import {
  Sprout,
  ShieldCheck,
  Languages,
  PhoneCall,
  CloudSun,
  BookOpen,
  History,
  Boxes,
  Activity
} from 'lucide-react';

interface HeaderProps {
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  activeTab: 'scanner' | 'spoilage' | 'directory' | 'weather' | 'helpline';
  onSelectTab: (tab: 'scanner' | 'spoilage' | 'directory' | 'weather' | 'helpline') => void;
  historyCount: number;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  activeTab,
  onSelectTab,
  historyCount,
  onOpenHistory
}) => {
  const isHi = language === 'hi';

  return (
    <header className="sticky top-0 z-40 bg-emerald-950/95 backdrop-blur-md border-b border-emerald-800/60 text-white shadow-lg shadow-emerald-950/20">
      {/* Top Banner with Tagline and Quick Hotline */}
      <div className="bg-emerald-900/80 px-4 py-1.5 text-xs text-emerald-100 flex flex-wrap items-center justify-between border-b border-emerald-800/40">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span className="inline-flex items-center gap-1 bg-emerald-700/60 px-2 py-0.5 rounded text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            {isHi ? 'प्रमाणित कृषि सुरक्षा' : 'Agricultural Crop Protection'}
          </span>
          <span className="hidden sm:inline text-emerald-300 font-serif italic text-xs">
            “Protect Your Crops. Improve Your Harvest.”
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden md:flex items-center gap-1.5 text-emerald-200">
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isHi ? 'किसान हेल्पलाइन:' : 'Kisan Toll-Free:'}{' '}
              <strong className="text-white font-mono">1800-180-1551</strong>
            </span>
          </div>

          {/* Language Toggle */}
          <button
            id="btn-language-toggle"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs font-medium transition-colors border border-emerald-700/80"
            title="Switch Language"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-300" />
            <span>{isHi ? 'English' : 'हिंदी (Hindi)'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onSelectTab('scanner')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-emerald-900/40 ring-2 ring-emerald-400/30 group-hover:ring-emerald-400 transition-all">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif uppercase">
                  FASAL DETECTION
                </h1>
                <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/30 uppercase">
                  <Activity className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
                  AI Vision
                </span>
              </div>
              <p className="text-xs text-emerald-300 font-medium tracking-normal">
                {isHi
                  ? 'फसल सुरक्षा एवं रोग निदान प्रणाली'
                  : 'Protect Your Crops. Improve Your Harvest.'}
              </p>
            </div>
          </button>

          {/* Mobile scan history icon */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenHistory}
              className="relative p-2 rounded-lg bg-emerald-900 text-emerald-200 hover:text-white border border-emerald-700/60"
              title="Recent Scans"
            >
              <History className="w-4 h-4" />
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-semibold">
          <button
            id="nav-tab-scanner"
            onClick={() => onSelectTab('scanner')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'scanner'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/40'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>{isHi ? 'फसल जांच (स्कैनर)' : 'Crop Health Scanner'}</span>
          </button>

          <button
            id="nav-tab-spoilage"
            onClick={() => onSelectTab('spoilage')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'spoilage'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/40'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <Boxes className="w-4 h-4 text-amber-400" />
            <span>{isHi ? 'भंडारण व सड़न' : 'Spoilage & Storage'}</span>
          </button>

          <button
            id="nav-tab-directory"
            onClick={() => onSelectTab('directory')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'directory'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/40'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-300" />
            <span>{isHi ? 'रोग संदर्शिका' : 'Disease Field Guide'}</span>
          </button>

          <button
            id="nav-tab-weather"
            onClick={() => onSelectTab('weather')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'weather'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/40'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <CloudSun className="w-4 h-4 text-amber-300" />
            <span>{isHi ? 'छिड़काव मौसम' : 'Spray Weather Advisory'}</span>
          </button>

          <button
            id="nav-tab-helpline"
            onClick={() => onSelectTab('helpline')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'helpline'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/40'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-emerald-300" />
            <span>{isHi ? 'किसान सहायता' : 'Farmer Support'}</span>
          </button>

          {/* Desktop History Button */}
          <button
            id="btn-scan-history"
            onClick={onOpenHistory}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-emerald-200 hover:bg-emerald-900/60 hover:text-white border border-emerald-800/80 transition-all ml-1"
            title="View Past Scans"
          >
            <History className="w-4 h-4 text-emerald-400" />
            <span>{isHi ? 'इतिहास' : 'History'}</span>
            {historyCount > 0 && (
              <span className="bg-amber-400 text-emerald-950 font-black text-[11px] px-1.5 py-0.2 rounded-full">
                {historyCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
