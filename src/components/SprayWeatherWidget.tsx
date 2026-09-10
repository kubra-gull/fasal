import React, { useState } from 'react';
import {
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface SprayWeatherWidgetProps {
  language: 'en' | 'hi';
}

export const SprayWeatherWidget: React.FC<SprayWeatherWidgetProps> = ({ language }) => {
  const isHi = language === 'hi';

  const [locationName, setLocationName] = useState('Central Plains / Agro Region');
  const [temperature, setTemperature] = useState(24);
  const [windSpeed, setWindSpeed] = useState(6);
  const [humidity, setHumidity] = useState(62);
  const [rainProbability, setRainProbability] = useState(15);

  // Evaluate spray condition
  const isWindGood = windSpeed >= 3 && windSpeed <= 10;
  const isTempGood = temperature >= 15 && temperature <= 30;
  const isRainGood = rainProbability <= 25;
  const isHumidityGood = humidity >= 50 && humidity <= 75;

  const score = [isWindGood, isTempGood, isRainGood, isHumidityGood].filter(Boolean).length;

  const getSprayVerdict = () => {
    if (score === 4) {
      return {
        status: isHi ? 'छिड़काव के लिए आदर्श समय' : 'Optimal Spray Window',
        color: 'bg-emerald-600 text-white',
        border: 'border-emerald-500',
        summary: isHi
          ? 'हवा की गति शांत है, वर्षा का कोई खतरा नहीं है। कीटनाशक या फफूंदनाशक छिड़काव के लिए यह उत्तम समय है।'
          : 'Low drift risk, stable temperature, and no immediate rain expected. Ideal for chemical or organic spraying.'
      };
    } else if (score >= 2) {
      return {
        status: isHi ? 'सावधानीपूर्वक छिड़काव करें' : 'Marginal Spray Condition',
        color: 'bg-amber-500 text-stone-950',
        border: 'border-amber-400',
        summary: isHi
          ? 'कुछ मौसम घटक सामान्य से भिन्न हैं। मोटे बूंदों वाले नोज़ल (Anti-drift nozzle) का प्रयोग करें।'
          : 'Moderate wind or temperature. Use drift-reduction nozzles and monitor wind direction.'
      };
    } else {
      return {
        status: isHi ? 'छिड़काव न करें (असुरक्षित)' : 'Unfavorable / Do Not Spray',
        color: 'bg-red-600 text-white',
        border: 'border-red-500',
        summary: isHi
          ? 'तेज हवा अथवा वर्षा की संभावना से दवा बहने व पत्तियों के जलने का खतरा है।'
          : 'High wind drift or imminent rain risk will wash away expensive chemicals and contaminate borders.'
      };
    }
  };

  const verdict = getSprayVerdict();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 rounded-2xl p-6 sm:p-8 text-white border border-emerald-800 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold uppercase tracking-wider border border-emerald-600/40">
            <CloudSun className="w-3.5 h-3.5 text-amber-300" />
            {isHi ? 'मौसम आधारित छिड़काव परामर्श' : 'Spray Weather & Drift Advisory'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
            {isHi ? 'दवा छिड़काव मौसम अनुकूलता कैलकुलेटर' : 'Agrochemical Spray Feasibility Calculator'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
            {isHi
              ? 'तेज हवा (10 किमी/घंटा से अधिक) दवा को उड़ा देती है और बारिश में दवा धुल जाती है। अपने खेत की परिस्थितियों के अनुसार सर्वोत्तम समय जानें।'
              : 'Applying fungicides or pesticides in unsuitable wind or humidity wastes chemical cost and risks crop scorch. Check current field parameters before filling tanks.'}
          </p>
        </div>
      </div>

      {/* Main Advisory Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-8">
        {/* Verdict Box */}
        <div className={`p-5 rounded-2xl border-2 ${verdict.border} ${verdict.color} shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
          <div className="space-y-1">
            <div className="text-xs font-bold tracking-wider uppercase opacity-90">
              {isHi ? 'वर्तमान छिड़काव सिफारिश' : 'Current Application Recommendation'}
            </div>
            <h3 className="text-xl sm:text-2xl font-black">{verdict.status}</h3>
            <p className="text-xs sm:text-sm opacity-95 leading-relaxed">{verdict.summary}</p>
          </div>

          <div className="shrink-0 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
              {isHi ? 'मौसम स्कोर' : 'Weather Fit'}
            </div>
            <div className="text-2xl font-black">{score}/4</div>
          </div>
        </div>

        {/* Sliders / Metrics */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wide">
            {isHi ? 'खेत मौसम पैरामीटर समायोजित करें:' : 'Field Environmental Conditions:'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Wind Speed */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-emerald-600" />
                  <span>{isHi ? 'हवा की गति (Wind Speed)' : 'Wind Speed'}</span>
                </label>
                <span className="text-sm font-extrabold text-stone-900 font-mono">
                  {windSpeed} km/h
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={windSpeed}
                onChange={(e) => setWindSpeed(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="text-[11px] text-stone-500 flex justify-between">
                <span>{isHi ? 'शांत (0-2)' : 'Calm (<3)'}</span>
                <span className="text-emerald-700 font-semibold">{isHi ? 'आदर्श (3-10)' : 'Ideal (3-10)'}</span>
                <span className="text-red-600">{isHi ? 'तेज (>12)' : 'High (>12)'}</span>
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-amber-600" />
                  <span>{isHi ? 'तापमान (Temperature)' : 'Ambient Temperature'}</span>
                </label>
                <span className="text-sm font-extrabold text-stone-900 font-mono">
                  {temperature}°C
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="text-[11px] text-stone-500 flex justify-between">
                <span>10°C</span>
                <span className="text-emerald-700 font-semibold">{isHi ? 'आदर्श (18-28°C)' : 'Ideal (18-28°C)'}</span>
                <span className="text-red-600">{isHi ? 'अत्यधिक (>32°C)' : 'Extreme (>32°C)'}</span>
              </div>
            </div>

            {/* Rain Probability */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span>{isHi ? 'बारिश की संभावना (Rain Probability)' : 'Rain Probability (Next 4h)'}</span>
                </label>
                <span className="text-sm font-extrabold text-stone-900 font-mono">
                  {rainProbability}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rainProbability}
                onChange={(e) => setRainProbability(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="text-[11px] text-stone-500 flex justify-between">
                <span className="text-emerald-700 font-semibold">{isHi ? 'सुरक्षित (<20%)' : 'Safe (<20%)'}</span>
                <span>{isHi ? 'मध्यम (30-50%)' : 'Moderate'}</span>
                <span className="text-red-600">{isHi ? 'जोखिम (>60%)' : 'Rain Risk (>60%)'}</span>
              </div>
            </div>

            {/* Humidity */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4 text-teal-600" />
                  <span>{isHi ? 'हवा में नमी (Relative Humidity)' : 'Relative Humidity'}</span>
                </label>
                <span className="text-sm font-extrabold text-stone-900 font-mono">
                  {humidity}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="text-[11px] text-stone-500 flex justify-between">
                <span>{isHi ? 'सूखा (<40%)' : 'Dry (<40%)'}</span>
                <span className="text-emerald-700 font-semibold">{isHi ? 'आदर्श (50-70%)' : 'Ideal (50-70%)'}</span>
                <span>{isHi ? 'अति नम (>85%)' : 'Very Humid (>85%)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agronomist Timing Protocol Box */}
        <div className="rounded-xl bg-stone-50 p-5 border border-stone-200 space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>{isHi ? 'छिड़काव के लिए दिन का सबसे अच्छा समय' : 'Best Time of Day for Spraying'}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700">
            <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
              <strong className="text-emerald-800 font-bold block">
                {isHi ? 'प्रातः काल (सुबह 6:00 से 9:30)' : 'Morning Window (6:00 AM - 9:30 AM)'}
              </strong>
              <p className="text-stone-600 text-xs">
                {isHi
                  ? 'ओस सूखने के बाद छिड़काव करें। हवा शांत रहती है एवं धूप हल्की होती है।'
                  : 'Spray immediately once morning dew has evaporated. Wind velocity is calm and foliage absorbs systemic sprays efficiently.'}
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
              <strong className="text-emerald-800 font-bold block">
                {isHi ? 'सायंकाल (शाम 4:00 से 6:30)' : 'Late Afternoon (4:00 PM - 6:30 PM)'}
              </strong>
              <p className="text-stone-600 text-xs">
                {isHi
                  ? 'कीटनाशक व जैविक नीम के तेल के लिए सबसे उत्तम, क्योंकि मधुमक्खियां अपने छत्ते में लौट चुकी होती हैं।'
                  : 'Best for bio-pesticides and neem solutions. Minimizes harm to beneficial honeybees and pollinators.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
