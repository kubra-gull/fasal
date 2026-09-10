import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CropScanner } from './components/CropScanner';
import { AnalysisResultView } from './components/AnalysisResultView';
import { PostHarvestSpoilageGuide } from './components/PostHarvestSpoilageGuide';
import { DiseaseDirectory } from './components/DiseaseDirectory';
import { SprayWeatherWidget } from './components/SprayWeatherWidget';
import { FarmerHelpline } from './components/FarmerHelpline';
import { AgronomistConsultationModal } from './components/AgronomistConsultationModal';
import { DiagnosticHistoryModal } from './components/DiagnosticHistoryModal';
import { CropAnalysisResult } from './types';
import { Sprout, ShieldCheck, Heart, AlertCircle } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'hi'>(() => {
    return (localStorage.getItem('fasal_language') as 'en' | 'hi') || 'en';
  });

  const [activeTab, setActiveTab] = useState<'scanner' | 'spoilage' | 'directory' | 'weather' | 'helpline'>('scanner');
  const [currentResult, setCurrentResult] = useState<CropAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [history, setHistory] = useState<CropAnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem('fasal_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('fasal_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('fasal_history', JSON.stringify(history));
  }, [history]);

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleAnalyzeCrop = async (payload: {
    imageBase64: string;
    mimeType: string;
    cropHint: string;
    stageHint: string;
    fieldNotes: string;
    sampleId?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          language
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server error during crop analysis');
      }

      const data = await response.json();
      if (data.success && data.result) {
        const resultWithImage: CropAnalysisResult = {
          ...data.result,
          imageUrl: payload.imageBase64
        };
        setCurrentResult(resultWithImage);
        setHistory((prev) => [resultWithImage, ...prev.slice(0, 19)]); // Keep last 20
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('Could not parse crop diagnosis results.');
      }
    } catch (err: any) {
      console.error('Crop Analysis Failed:', err);
      setErrorMessage(
        language === 'hi'
          ? 'फसल विश्लेषण में समस्या आई। कृपया नेटवर्क या फोटो जांचें और पुनः प्रयास करें।'
          : err.message || 'Analysis could not be completed. Please try again with a clear photo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('fasal_history');
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Application Header */}
      <Header
        language={language}
        onToggleLanguage={handleToggleLanguage}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setErrorMessage(null);
        }}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold text-red-700 hover:underline ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'scanner' && (
          <>
            {currentResult ? (
              <AnalysisResultView
                result={currentResult}
                language={language}
                onReset={() => setCurrentResult(null)}
                onOpenConsult={() => setIsConsultOpen(true)}
              />
            ) : (
              <CropScanner
                onAnalyze={handleAnalyzeCrop}
                isLoading={isLoading}
                language={language}
              />
            )}
          </>
        )}

        {activeTab === 'spoilage' && (
          <PostHarvestSpoilageGuide
            language={language}
            onSelectSampleForTest={(sampleId) => {
              setActiveTab('scanner');
              // Let the user test on scanner
            }}
          />
        )}

        {activeTab === 'directory' && (
          <DiseaseDirectory
            language={language}
            onSelectSampleForTest={(sampleId) => {
              setActiveTab('scanner');
            }}
          />
        )}

        {activeTab === 'weather' && <SprayWeatherWidget language={language} />}

        {activeTab === 'helpline' && <FarmerHelpline language={language} />}
      </main>

      {/* AI Agronomist Follow-up Modal */}
      <AgronomistConsultationModal
        isOpen={isConsultOpen}
        onClose={() => setIsConsultOpen(false)}
        result={currentResult}
        language={language}
      />

      {/* Diagnostic Scan History Modal */}
      <DiagnosticHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(res) => {
          setCurrentResult(res);
          setActiveTab('scanner');
        }}
        onClearHistory={handleClearHistory}
        language={language}
      />

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-200 border-t border-emerald-900 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="text-xl font-extrabold text-white tracking-tight uppercase font-serif">
                  FASAL DETECTION
                </span>
              </div>
              <p className="text-emerald-300 font-serif italic text-sm">
                “Protect Your Crops. Improve Your Harvest.”
              </p>
              <p className="text-xs text-emerald-400/90 leading-relaxed max-w-md">
                {language === 'hi'
                  ? 'किसानों को फसल की बीमारियां, सड़न, दृश्य क्षति और अस्वस्थ परिस्थितियों की समय रहते पहचान करने में मदद करने के लिए समर्पित स्मार्ट कृषि निदान प्रणाली।'
                  : 'Empowering farmers with AI-driven diagnostic pathology to detect foliar diseases, warehouse spoilage, nutrient deficiencies, and pest attacks before irreversible yield loss occurs.'}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {language === 'hi' ? 'मुख्य सुविधाएं' : 'Diagnostic Modules'}
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-300">
                <li>
                  <button onClick={() => setActiveTab('scanner')} className="hover:text-white">
                    {language === 'hi' ? 'फसल स्वास्थ्य परीक्षक' : 'AI Health Scanner'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('spoilage')} className="hover:text-white">
                    {language === 'hi' ? 'भंडारण व गोदाम सड़न गाइड' : 'Post-Harvest Spoilage'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('directory')} className="hover:text-white">
                    {language === 'hi' ? 'पादप रोग फील्ड गाइड' : 'Disease Field Catalog'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('weather')} className="hover:text-white">
                    {language === 'hi' ? 'छिड़काव मौसम सलाहकार' : 'Spray Weather Window'}
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {language === 'hi' ? 'किसान सहायता' : 'Emergency Hotlines'}
              </h4>
              <p className="text-xs text-emerald-300">
                {language === 'hi' ? 'टोल-फ्री किसान कॉल सेंटर:' : 'National Toll-Free:'}
              </p>
              <p className="text-base font-black font-mono text-amber-300">1800-180-1551</p>
              <p className="text-[11px] text-emerald-400">
                {language === 'hi' ? 'सभी 22 भारतीय भाषाओं में उपलब्ध' : 'Available 6 AM - 10 PM daily'}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400">
            <p>
              © {new Date().getFullYear()} FASAL DETECTION. {language === 'hi' ? 'समस्त अधिकार सुरक्षित।' : 'All rights reserved.'}
            </p>
            <p className="text-[11px] text-emerald-400/80 max-w-md text-center sm:text-right">
              {language === 'hi'
                ? 'अस्वीकरण: एआई निदान कृषक निर्णयों में सहायता हेतु है। गंभीर महामारी की स्थिति में स्थानीय कृषि अधिकारी या केवीके से परामर्श लें।'
                : 'Disclaimer: AI pathology assists field decisions. For large-scale outbreaks, always consult your certified agricultural extension officer.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
