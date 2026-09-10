import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  ShieldCheck,
  ChevronRight,
  Pill,
  Leaf,
  Calendar,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { AgroDiseaseGuideItem } from '../types';

interface DiseaseDirectoryProps {
  language: 'en' | 'hi';
  onSelectSampleForTest?: (sampleId: string) => void;
}

export const DiseaseDirectory: React.FC<DiseaseDirectoryProps> = ({
  language,
  onSelectSampleForTest
}) => {
  const isHi = language === 'hi';
  const [diseases, setDiseases] = useState<AgroDiseaseGuideItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDisease, setSelectedDisease] = useState<AgroDiseaseGuideItem | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch('/api/disease-catalog');
        const data = await res.json();
        if (data.catalog) {
          setDiseases(data.catalog);
        }
      } catch (e) {
        console.error('Failed to load disease catalog', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const types = ['All', 'Fungal', 'Bacterial', 'Viral', 'Pest', 'Storage Spoilage'];

  const filtered = diseases.filter((d) => {
    const matchesType = selectedType === 'All' || d.type === selectedType;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nameHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.causes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-green-950 to-emerald-900 rounded-2xl p-6 sm:p-8 text-white border border-emerald-800 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold uppercase tracking-wider border border-emerald-600/40">
            <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
            {isHi ? 'कृषि रोग एवं कीट फील्ड गाइड' : 'Agricultural Crop Pathology Directory'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
            {isHi ? 'प्रमुख फसलों की बीमारियां, लक्षण एवं नियंत्रण' : 'Crop Disease & Pest Field Directory'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
            {isHi
              ? 'गेहूं, धान, आलू, टमाटर, कपास, मक्का आदि के फफूंद, जीवाणु, वायरस एवं भंडारण रोगों की संपूर्ण वैज्ञानिक जानकारी।'
              : 'Comprehensive agronomist directory covering foliar blights, rusts, vascular wilts, virus leaf curls, and insect damage across major staple crops.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedType === type
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder={isHi ? 'रोग या फसल खोजें...' : 'Search disease or crop...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Directory Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-stone-500 text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
          <span>{isHi ? 'रोग संदर्शिका लोड हो रही है...' : 'Loading pathology catalog...'}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full bg-stone-100 relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="bg-emerald-800/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {item.crop}
                    </span>
                    <span className="bg-stone-900/80 text-stone-200 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {item.type}
                    </span>
                  </div>

                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      item.severity === 'Critical'
                        ? 'bg-red-600 text-white'
                        : item.severity === 'Severe'
                        ? 'bg-orange-600 text-white'
                        : 'bg-amber-500 text-stone-950'
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-emerald-700 font-semibold">{item.nameHindi}</p>
                  </div>

                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{item.season}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-stone-700 uppercase">
                      {isHi ? 'प्रमुख लक्षण:' : 'Key Symptoms:'}
                    </div>
                    <ul className="text-xs text-stone-600 space-y-1">
                      {item.symptoms.slice(0, 2).map((s, idx) => (
                        <li key={idx} className="line-clamp-1 flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 text-xs space-y-1">
                    <div className="font-bold text-stone-700 flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{isHi ? 'अनुशंसित उपचार:' : 'Recommended Cure:'}</span>
                    </div>
                    <p className="text-stone-600 line-clamp-2">{item.recommendedCures[0]}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedDisease(item)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 text-stone-700 text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-stone-200"
                >
                  <span>{isHi ? 'विस्तृत विवरण देखें' : 'View Full Treatment Protocol'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disease Detail Modal */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  {selectedDisease.crop} • {selectedDisease.type}
                </span>
                <h3 className="text-lg font-bold">{selectedDisease.name}</h3>
                <p className="text-xs text-emerald-200">{selectedDisease.nameHindi}</p>
              </div>
              <button
                onClick={() => setSelectedDisease(null)}
                className="p-1.5 rounded-lg hover:bg-emerald-800 text-emerald-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700">
              <div className="space-y-1">
                <h4 className="font-bold text-stone-900">{isHi ? 'रोग का कारण व अनुकूल मौसम:' : 'Pathogen & Spread:'}</h4>
                <p className="text-stone-600">{selectedDisease.causes}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-stone-900">{isHi ? 'पहचान के लक्षण:' : 'Full Symptoms:'}</h4>
                <ul className="space-y-1.5 pl-4 list-disc text-stone-600">
                  {selectedDisease.symptoms.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-stone-900">{isHi ? 'अनुशंसित उपचार एवं स्प्रे:' : 'Cures & Sprays:'}</h4>
                <div className="space-y-2">
                  {selectedDisease.recommendedCures.map((cure, idx) => (
                    <div key={idx} className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                      {cure}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-stone-900">{isHi ? 'भविष्य की रोकथाम:' : 'Prevention:'}</h4>
                <ul className="space-y-1 pl-4 list-disc text-stone-600">
                  {selectedDisease.prevention.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDisease(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold"
              >
                {isHi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
