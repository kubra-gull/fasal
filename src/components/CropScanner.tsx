import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Camera,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Leaf,
  Layers,
  FileText,
  Info,
  ChevronRight,
  Eye
} from 'lucide-react';
import { AGRICULTURAL_CROPS, GROWTH_STAGES, SAMPLE_CROP_CASES } from '../data/sampleCases';
import { SampleCropCase } from '../types';

interface CropScannerProps {
  onAnalyze: (payload: {
    imageBase64: string;
    mimeType: string;
    cropHint: string;
    stageHint: string;
    fieldNotes: string;
    sampleId?: string;
  }) => Promise<void>;
  isLoading: boolean;
  language: 'en' | 'hi';
}

export const CropScanner: React.FC<CropScannerProps> = ({
  onAnalyze,
  isLoading,
  language
}) => {
  const isHi = language === 'hi';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [cropHint, setCropHint] = useState<string>('Auto-Detect (स्वचालित पहचान)');
  const [stageHint, setStageHint] = useState<string>('All Stages / Not Sure');
  const [fieldNotes, setFieldNotes] = useState<string>('');
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Analysis progress step indicator during AI processing
  const [analysisStep, setAnalysisStep] = useState<number>(0);

  const analysisStepsEn = [
    'Calibrating agricultural vision model...',
    'Inspecting leaf lamina and vascular veins...',
    'Identifying fungal, bacterial, or pest pathogens...',
    'Evaluating crop severity & yield loss risk...',
    'Formulating bio-organic and chemical treatment plan...'
  ];

  const analysisStepsHi = [
    'कृषि दृष्टि मॉडल अंशांकित किया जा रहा है...',
    'पत्तियों, तनों एवं ऊतकों का विश्लेषण जारी...',
    'फफूंद, जीवाणु, कीट या पोषण कमी की पहचान...',
    'रोग गंभीरता एवं उपज हानि का आंकलन...',
    'जैविक उपचार एवं रासायनिक दवा की खुराक तैयार हो रही है...'
  ];

  const activeSteps = isHi ? analysisStepsHi : analysisStepsEn;

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setAnalysisStep(0);
      interval = setInterval(() => {
        setAnalysisStep((prev) => (prev < activeSteps.length - 1 ? prev + 1 : prev));
      }, 900);
    } else {
      setAnalysisStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading, activeSteps.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError(isHi ? 'कृपया मान्य फोटो (JPEG, PNG, WebP) अपलोड करें।' : 'Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setValidationError(null);
    setSelectedSampleId(null);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError(isHi ? 'कृपया मान्य फोटो अपलोड करें।' : 'Please drop a valid image file.');
      return;
    }

    setValidationError(null);
    setSelectedSampleId(null);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: SampleCropCase) => {
    setSelectedImage(sample.imageUrl);
    setSelectedSampleId(sample.id);
    setValidationError(null);
    setCropHint(sample.crop);
    setMimeType('image/jpeg');
    setFieldNotes(`Sample check: ${sample.title} - ${sample.description}`);
  };

  const handleSubmitAnalysis = async () => {
    if (!selectedImage) {
      setValidationError(isHi ? 'कृपया पहले पौधे, पत्ती या फल की फोटो अपलोड करें।' : 'Please upload or capture a crop photograph first.');
      return;
    }

    setValidationError(null);
    await onAnalyze({
      imageBase64: selectedImage,
      mimeType,
      cropHint: cropHint.includes('Auto-Detect') ? '' : cropHint,
      stageHint,
      fieldNotes,
      sampleId: selectedSampleId || undefined
    });
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedSampleId(null);
    setValidationError(null);
    setFieldNotes('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const quickSymptoms = [
    { label: isHi ? 'पत्तियां पीली पड़ रही हैं' : 'Yellowing leaves (Chlorosis)', text: 'Yellowing leaf margins and chlorosis.' },
    { label: isHi ? 'काले/भूरे धब्बे' : 'Dark necrotic spots', text: 'Dark brown or black necrotic lesions.' },
    { label: isHi ? 'पत्तियां मुड़ रही हैं' : 'Leaf curling / cupping', text: 'Upward leaf curling and puckering.' },
    { label: isHi ? 'सफेद पाउडर या फफूंद' : 'White powdery mold', text: 'White powdery growth on foliage.' },
    { label: isHi ? 'सड़न व बदबूदार नमी' : 'Water-soaked soft rot', text: 'Soft water-soaked rotting tissue.' },
    { label: isHi ? 'कीटों द्वारा खाए छेद' : 'Ragged insect holes', text: 'Chewed holes and skeletonized leaves.' }
  ];

  const handleAddQuickNote = (note: string) => {
    setFieldNotes((prev) => (prev ? `${prev} | ${note}` : note));
  };

  return (
    <div className="w-full space-y-8">
      {/* Hero Intro Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-emerald-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-semibold uppercase tracking-wider border border-emerald-600/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {isHi ? 'कृषि एआई फसल स्वास्थ्य परीक्षक' : 'AI Crop Health & Pathology Scanner'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif">
            {isHi ? 'फसल की बीमारी तुरंत पहचानें, सही उपचार पाएं' : 'Identify Crop Diseases & Spoilage in Seconds'}
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed">
            {isHi
              ? 'खेत से पत्ती, तने, फल या अनाज की फोटो खींचें या अपलोड करें। हमारा कृषि एआई तुरंत बीमारी, कीट नुकसान, पोषण की कमी या भंडारण सड़न की पहचान कर जैविक और रासायनिक उपचार बताएगा।'
              : 'Upload or capture clear photos of affected leaves, stems, fruits, or stored grains. Our agronomist AI diagnoses visible diseases, nutrient deficiencies, pest damage, and warehouse spoilage with exact dosages and prevention.'}
          </p>
        </div>
      </div>

      {/* Main Scanner Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Upload & Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>{isHi ? '1. फसल की फोटो अपलोड या कैप्चर करें' : '1. Upload or Capture Crop Photo'}</span>
                <span className="text-amber-600 font-normal text-xs">({isHi ? 'अनिवार्य' : 'Required'})</span>
              </label>

              {selectedImage && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {isHi ? 'हटाएं / नया चुनें' : 'Clear / New photo'}
                </button>
              )}
            </div>

            {/* Upload Area */}
            {!selectedImage ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[300px] ${
                  isDragOver
                    ? 'border-emerald-600 bg-emerald-50/70 scale-[0.99]'
                    : 'border-stone-300 hover:border-emerald-500 bg-stone-50/50 hover:bg-stone-50'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-4 shadow-inner ring-4 ring-emerald-50">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <h3 className="text-base font-bold text-stone-800 mb-1">
                  {isHi ? 'फोटो यहां खींचें या डिवाइस से चुनें' : 'Drag and drop crop photo here'}
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mb-6">
                  {isHi
                    ? 'पत्ती, फल, तने या भंडारण अनाज की स्पष्ट फोटो चुनें (JPG, PNG, WebP)'
                    : 'Supports clear close-up photos of leaves, fruits, stems, or storage grains'}
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    id="btn-upload-file"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isHi ? 'गैलरी / फाइल चुनें' : 'Select From Device'}</span>
                  </button>

                  <button
                    type="button"
                    id="btn-open-camera"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>{isHi ? 'कैमरे से फोटो लें' : 'Take Photo (Camera)'}</span>
                  </button>
                </div>

                {/* Hidden File Inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              /* Image Preview Card */
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-950 flex items-center justify-center min-h-[300px] max-h-[420px] shadow-sm">
                <img
                  src={selectedImage}
                  alt="Crop Specimen Preview"
                  className="w-full h-full object-contain max-h-[420px]"
                />

                {/* Overlay Badge */}
                <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-emerald-300 flex items-center gap-1.5 border border-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isHi ? 'फोटो तैयार है' : 'Image Ready for AI Diagnosis'}</span>
                </div>

                {selectedSampleId && (
                  <div className="absolute bottom-3 left-3 right-3 bg-stone-900/90 backdrop-blur-md p-2.5 rounded-xl text-xs text-stone-200 border border-stone-700/80 flex items-center justify-between">
                    <span className="font-medium truncate">
                      {SAMPLE_CROP_CASES.find((s) => s.id === selectedSampleId)?.title}
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                      Sample Case
                    </span>
                  </div>
                )}
              </div>
            )}

            {validationError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* Right Column: Agronomic Context & Action (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-700" />
                <span>{isHi ? '2. फसल एवं खेत का विवरण (वैकल्पिक)' : '2. Field & Crop Context (Optional)'}</span>
              </h3>

              {/* Crop Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  {isHi ? 'फसल का नाम (Crop Name)' : 'Select Crop / Plant Variety'}
                </label>
                <div className="relative">
                  <select
                    id="select-crop-hint"
                    value={cropHint}
                    onChange={(e) => setCropHint(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    {AGRICULTURAL_CROPS.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Growth Stage Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-stone-500" />
                    {isHi ? 'फसल की अवस्था (Growth Stage)' : 'Crop Growth Stage'}
                  </span>
                </label>
                <div className="relative">
                  <select
                    id="select-stage-hint"
                    value={stageHint}
                    onChange={(e) => setStageHint(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    {GROWTH_STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Quick Observation Chips */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  {isHi ? 'दिखने वाले मुख्य लक्षण (तुरंत चुनें):' : 'Visible Symptoms Checklist:'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickSymptoms.map((symp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddQuickNote(symp.text)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 text-[11px] font-medium border border-stone-200 transition-colors"
                    >
                      + {symp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Farmer Notes Textarea */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-stone-500" />
                  <span>{isHi ? 'अतिरिक्त टिप्पणियां या मौसम (Farmer Notes):' : 'Additional Notes (Weather, Soil, Moisture):'}</span>
                </label>
                <textarea
                  id="textarea-field-notes"
                  value={fieldNotes}
                  onChange={(e) => setFieldNotes(e.target.value)}
                  placeholder={
                    isHi
                      ? 'उदा. पिछले 3 दिनों से लगातार बारिश और कोहरा है, पत्तियों पर भूरे धब्बे फैल रहे हैं...'
                      : 'e.g., Heavy rains last week, dark lesions spreading on lower leaves, sprinkler irrigated...'
                  }
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>

            {/* Diagnostic Action Button */}
            <div className="pt-2">
              <button
                type="button"
                id="btn-diagnose-crop"
                disabled={isLoading}
                onClick={handleSubmitAnalysis}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg transition-all ${
                  isLoading
                    ? 'bg-emerald-800 text-white/80 cursor-wait'
                    : selectedImage
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-emerald-700/25 hover:shadow-emerald-700/35 hover:-translate-y-0.5'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                    <span>{isHi ? 'कृषि एआई जांच जारी है...' : 'AI Analyzing Crop Health...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span>{isHi ? 'बीमारी पहचानें एवं उपचार पाएं' : 'Detect Disease & Get Treatment'}</span>
                  </>
                )}
              </button>

              {/* Inspection Progress Tracker */}
              {isLoading && (
                <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                      {activeSteps[analysisStep]}
                    </span>
                    <span className="text-emerald-700 font-mono">
                      {Math.round(((analysisStep + 1) / activeSteps.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${((analysisStep + 1) / activeSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Instant Test Presets Library */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-700" />
              <span>{isHi ? 'परीक्षण हेतु नमूने (1-क्लिक से जांचें)' : 'Sample Cases for Instant Testing'}</span>
            </h3>
            <p className="text-xs text-stone-500">
              {isHi
                ? 'यदि अभी आपके पास खेत की फोटो नहीं है, तो नीचे दिए गए वास्तविक मामलों पर क्लिक करके तुरंत जांच प्रणाली का परीक्षण करें:'
                : 'No farm photo on hand? Click any real agricultural case study below to test instant diagnostic detection:'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SAMPLE_CROP_CASES.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`group text-left rounded-xl overflow-hidden border transition-all flex flex-col bg-white hover:shadow-md ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/40 shadow-sm'
                    : 'border-stone-200 hover:border-emerald-300'
                }`}
              >
                <div className="relative h-36 w-full overflow-hidden bg-stone-100">
                  <img
                    src={sample.imageUrl}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      sample.status === 'Healthy'
                        ? 'bg-green-600 text-white'
                        : sample.status === 'Post-Harvest Spoilage'
                        ? 'bg-amber-600 text-white'
                        : sample.severity === 'Critical'
                        ? 'bg-red-600 text-white'
                        : 'bg-orange-500 text-white'
                    }`}
                  >
                    {sample.status}
                  </span>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {sample.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">
                      {sample.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
                    <span>{isSelected ? (isHi ? 'चयनित है' : 'Selected') : (isHi ? 'क्लिक कर जांचें' : 'Click to test')}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
