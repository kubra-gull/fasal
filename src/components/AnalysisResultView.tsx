import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Volume2,
  VolumeX,
  Printer,
  MessageSquare,
  ArrowLeft,
  Calendar,
  Layers,
  Thermometer,
  Pill,
  Leaf,
  Bug,
  HelpCircle,
  Share2,
  Clock,
  Warehouse
} from 'lucide-react';
import { CropAnalysisResult } from '../types';

interface AnalysisResultViewProps {
  result: CropAnalysisResult;
  language: 'en' | 'hi';
  onReset: () => void;
  onOpenConsult: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  result,
  language,
  onReset,
  onOpenConsult
}) => {
  const isHi = language === 'hi';
  const [activeTreatmentTab, setActiveTreatmentTab] = useState<'organic' | 'chemical'>('organic');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = result.summaryVoiceScript || 
      `${result.cropName}: ${result.diseaseName}. ${result.immediateAction}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.92; // slightly slower for clarity
    utterance.pitch = 1.0;

    // Try selecting Hindi voice if language is Hindi
    if (isHi) {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 text-white border-red-700';
      case 'severe':
        return 'bg-red-500 text-white border-red-600';
      case 'moderate':
        return 'bg-amber-500 text-white border-amber-600';
      case 'low':
        return 'bg-yellow-500 text-stone-950 border-yellow-600';
      case 'none':
      default:
        return 'bg-emerald-600 text-white border-emerald-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Healthy':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <CheckCircle className="w-4 h-4 text-emerald-600" />
        };
      case 'Post-Harvest Spoilage':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: <Warehouse className="w-4 h-4 text-amber-700" />
        };
      case 'Pest Damage':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-300',
          icon: <Bug className="w-4 h-4 text-rose-700" />
        };
      default:
        return {
          bg: 'bg-orange-100 text-orange-900 border-orange-300',
          icon: <AlertTriangle className="w-4 h-4 text-orange-700" />
        };
    }
  };

  const statusInfo = getStatusBadge(result.healthStatus);

  return (
    <div className="w-full space-y-6 print:m-0 print:p-0">
      {/* Top Controls Bar (Hidden in Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold border border-stone-200 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHi ? 'दूसरी फसल स्कैन करें' : 'Scan Another Crop'}</span>
        </button>

        <div className="flex items-center gap-2">
          {speechSupported && (
            <button
              type="button"
              id="btn-voice-readout"
              onClick={handleToggleVoice}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                isPlayingAudio
                  ? 'bg-amber-500 text-stone-950 border-amber-600 animate-pulse'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4 text-stone-950" />
                  <span>{isHi ? 'आवाज़ रोकें' : 'Stop Audio'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <span>{isHi ? 'सलाह आवाज़ में सुनें' : 'Listen to Agronomist Voice'}</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            id="btn-consult-agronomist"
            onClick={onOpenConsult}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isHi ? 'विशेषज्ञ से प्रश्न पूछें' : 'Ask Agronomist'}</span>
          </button>

          <button
            type="button"
            id="btn-print-report"
            onClick={handlePrintReport}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-all"
            title="Print or Save PDF"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{isHi ? 'रिपोर्ट प्रिंट करें' : 'Print / PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Diagnostic Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden print:border-none print:shadow-none">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white p-6 sm:p-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg}`}
                >
                  {statusInfo.icon}
                  <span>{result.healthStatus}</span>
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getSeverityBadge(
                    result.severity
                  )}`}
                >
                  {isHi ? `गंभीरता: ${result.severity}` : `Severity: ${result.severity}`}
                </span>

                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-800/80 text-stone-200 border border-stone-700">
                  {isHi ? `एआई सटीकता: ${result.confidence}%` : `Confidence: ${result.confidence}%`}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-white">
                {result.diseaseName}
              </h2>

              {result.diseaseNameLocal && (
                <p className="text-sm text-emerald-300 font-medium mt-0.5">
                  {result.diseaseNameLocal}
                </p>
              )}

              {result.scientificName && (
                <p className="text-xs text-stone-300 italic mt-1 font-mono">
                  Pathogen: {result.scientificName}
                </p>
              )}
            </div>

            {/* Quick Crop Tag */}
            <div className="bg-stone-800/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-stone-700 shrink-0 space-y-1 text-right md:text-right">
              <div className="text-[11px] text-stone-400 uppercase font-semibold">
                {isHi ? 'पहचानी गई फसल' : 'Identified Crop'}
              </div>
              <div className="text-base font-bold text-white flex items-center justify-end gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>{result.cropName}</span>
              </div>
              <div className="text-[11px] text-emerald-300 font-medium">
                {result.cropType} • {result.affectedPart}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Urgent Immediate Action Banner */}
          <div className="rounded-xl bg-amber-50/80 border-2 border-amber-400 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow">
              <AlertTriangle className="w-5 h-5 font-bold" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-sm font-extrabold text-amber-950 uppercase tracking-wide flex items-center gap-2">
                <span>{isHi ? 'आपातकालीन कार्रवाई (अगले 24-48 घंटों में)' : 'Immediate Action Required (Next 24-48 Hours)'}</span>
                <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded font-bold">URGENT</span>
              </h4>
              <p className="text-xs sm:text-sm text-stone-800 font-semibold leading-relaxed">
                {result.immediateAction}
              </p>
            </div>
          </div>

          {/* Grid: Symptoms & Pathology Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visual Symptoms Observed */}
            <div className="bg-stone-50/80 rounded-xl p-5 border border-stone-200/80 space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>{isHi ? 'देखे गए मुख्य लक्षण' : 'Observed Visual Symptoms'}</span>
              </h4>
              <ul className="space-y-2">
                {result.visualSymptoms.map((symp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                    <span>{symp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Root Cause & Spread Conditions */}
            <div className="bg-stone-50/80 rounded-xl p-5 border border-stone-200/80 space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-amber-700" />
                <span>{isHi ? 'रोग का मुख्य कारण एवं अनुकूल मौसम' : 'Probable Cause & Favorable Weather'}</span>
              </h4>
              <div className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                <p>
                  <strong className="text-stone-900">{isHi ? 'रोगज़नक़ (Pathogen): ' : 'Pathogen / Cause: '}</strong>
                  {result.causeAndPathogen}
                </p>
                <p>
                  <strong className="text-stone-900">{isHi ? 'अनुकूल परिस्थितियां: ' : 'Weather Conditions: '}</strong>
                  {result.favorableConditions}
                </p>
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-600">{isHi ? 'उपज जोखिम:' : 'Yield Loss Risk:'}</span>
                  <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    {result.yieldLossRisk}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment & Medicine Prescription Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-emerald-700" />
                  <span>{isHi ? 'उपचार योजना एवं दवा की खुराक' : 'Recommended Treatment & Control Plan'}</span>
                </h3>
                <p className="text-xs text-stone-500">
                  {isHi
                    ? 'जैविक अथवा रासायनिक उपचार में से अपनी कृषि पद्धति अनुसार विकल्प चुनें:'
                    : 'Select between eco-friendly biological remedies or targeted agrochemical controls:'}
                </p>
              </div>

              {/* Treatment Mode Toggle Tabs */}
              <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-bold">
                <button
                  type="button"
                  id="tab-organic-treatment"
                  onClick={() => setActiveTreatmentTab('organic')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                    activeTreatmentTab === 'organic'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5" />
                  <span>{isHi ? 'जैविक व प्राकृतिक' : 'Organic & Biological'}</span>
                </button>

                <button
                  type="button"
                  id="tab-chemical-treatment"
                  onClick={() => setActiveTreatmentTab('chemical')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                    activeTreatmentTab === 'chemical'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Pill className="w-3.5 h-3.5" />
                  <span>{isHi ? 'रासायनिक नियंत्रण' : 'Agrochemical Control'}</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Organic Treatments */}
            {activeTreatmentTab === 'organic' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    {isHi
                      ? 'जैविक समाधान पर्यावरण, मित्र कीटों और मानव स्वास्थ्य के लिए सुरक्षित हैं।'
                      : 'Eco-friendly solutions safe for soil microorganisms, beneficial pollinators, and residue-free harvest.'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.organicTreatments.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex items-start gap-3 hover:border-emerald-400 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Chemical Controls */}
            {activeTreatmentTab === 'chemical' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    {isHi
                      ? 'सावधानी: छिड़काव करते समय मास्क और दस्ताने पहनें। कटाई से पहले प्रतीक्षा अवधि (PHI) का ध्यान रखें।'
                      : 'Caution: Wear safety gloves and face mask during spraying. Respect Pre-Harvest Interval (PHI) days before harvesting.'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.chemicalControls.map((chem, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white border-2 border-stone-200 hover:border-emerald-600 transition-all shadow-sm space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-stone-900">
                            {chem.medicineName}
                          </h4>
                          {chem.activeIngredient && (
                            <p className="text-xs text-stone-500 font-mono">
                              Active: {chem.activeIngredient}
                            </p>
                          )}
                        </div>
                        {chem.safetyIntervalDays > 0 && (
                          <span className="shrink-0 text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                            PHI: {chem.safetyIntervalDays} days
                          </span>
                        )}
                      </div>

                      <div className="bg-stone-50 p-2.5 rounded-lg text-xs font-semibold text-stone-800 flex items-center justify-between">
                        <span className="text-stone-500">{isHi ? 'अनुशंसित खुराक:' : 'Recommended Dosage:'}</span>
                        <span className="text-emerald-700 font-bold">{chem.dosage}</span>
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed">
                        {chem.instructions}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Long Term Preventive Cultural Measures */}
          <div className="bg-stone-50/80 rounded-xl p-5 border border-stone-200/80 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{isHi ? 'भविष्य की रोकथाम एवं कृषि प्रबंधन' : 'Long-Term Cultural & Preventive Practices'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {result.preventiveMeasures.map((prev, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 shrink-0" />
                  <span>{prev}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spoilage & Storage Advisory (if applicable) */}
          {result.spoilageOrStorageAdvisory && (
            <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-200/70 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-amber-700" />
                <span>{isHi ? 'भंडारण एवं कटाई उपरांत सुरक्षा सलाह' : 'Post-Harvest & Storage Protection Advisory'}</span>
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {result.spoilageOrStorageAdvisory}
              </p>
            </div>
          )}

          {/* Spoken Voice Script Preview Card */}
          <div className="bg-emerald-900 text-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>{isHi ? 'किसान सलाह ऑडियो सारांश:' : 'Agronomist Voice Brief:'}</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium italic">
                “{result.summaryVoiceScript}”
              </p>
            </div>
            {speechSupported && (
              <button
                type="button"
                onClick={handleToggleVoice}
                className="shrink-0 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow"
              >
                {isPlayingAudio ? (isHi ? 'बंद करें' : 'Stop') : (isHi ? 'सुनें' : 'Play Audio')}
              </button>
            )}
          </div>
        </div>

        {/* Footer Signature */}
        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 text-xs text-stone-500 flex flex-wrap items-center justify-between gap-2">
          <span>FASAL DETECTION — “Protect Your Crops. Improve Your Harvest.”</span>
          <span className="font-mono text-[11px] text-stone-400">
            Scan ID: {result.id} • {new Date(result.timestamp).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};
