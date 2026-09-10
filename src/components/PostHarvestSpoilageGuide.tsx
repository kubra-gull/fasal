import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  Warehouse,
  Wind,
  Droplets,
  ShieldCheck,
  CheckCircle,
  Thermometer,
  Search
} from 'lucide-react';

interface PostHarvestSpoilageGuideProps {
  language: 'en' | 'hi';
  onSelectSampleForTest?: (sampleId: string) => void;
}

export const PostHarvestSpoilageGuide: React.FC<PostHarvestSpoilageGuideProps> = ({
  language,
  onSelectSampleForTest
}) => {
  const isHi = language === 'hi';
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Grains' | 'Fruits' | 'Vegetables' | 'Tubers'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const spoilageCases = [
    {
      id: 'onion-storage-black-mold',
      crop: 'Onion & Garlic',
      category: 'Vegetables',
      spoilageName: 'Black Mold & Bacterial Soft Rot',
      spoilageNameHi: 'प्याज का काला फफूंद एवं गीली सड़न',
      pathogen: 'Aspergillus niger & Erwinia carotovora',
      visibleDamage: 'Black soot-like powdery fungal patches on dry outer papery scales; soft mushy bulb neck leaking smelly fluid.',
      unhealthyCondition: 'Warm storage above 25°C with high relative humidity (>80%), poor air ventilation, thick-necked uncurated bulbs.',
      preventiveProtocol: [
        'Complete field curing until bulb neck is paper-dry and tightly closed',
        'Store in slatted wooden crates with minimum 30cm clearance from floor and walls',
        'Ensure continuous cross-ventilation with exhaust fans in godowns'
      ],
      severity: 'Critical',
      sampleTestId: 'onion-storage-black-mold',
      imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'grain-wheat-rice-mold',
      crop: 'Wheat, Rice & Maize Grains',
      category: 'Grains',
      spoilageName: 'Grain Mycotoxin & Storage Weevil Spoilage',
      spoilageNameHi: 'अनाज में फफूंदी, जाला व घुन (सुंडी) प्रकोप',
      pathogen: 'Aspergillus flavus (Aflatoxins) & Sitophilus oryzae (Rice Weevil)',
      visibleDamage: 'Clumped grain kernels covered with greenish-yellow mold; hollowed powdery grains with insect exit holes and sour smell.',
      unhealthyCondition: 'Moisture content above 12-14% at bagging time; damp floor contact; leaking silo roofs; grain temperature heating up.',
      preventiveProtocol: [
        'Sun dry grains thoroughly until moisture drops below 10-12% before bagging',
        'Use hermetic super-grain bags or Pusa bins with airtight sealing',
        'Place neem leaves or food-grade diatomaceous earth in storage drums'
      ],
      severity: 'Critical',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'potato-tuber-dry-rot',
      crop: 'Potato Tubers',
      category: 'Tubers',
      spoilageName: 'Fusarium Dry Rot & Soft Bacterial Rot',
      spoilageNameHi: 'आलू का सूखा सड़न एवं कंद गलन रोग',
      pathogen: 'Fusarium sambucinum & Pectobacterium carotovorum',
      visibleDamage: 'Sunken brown dry wrinkled cavities lined with white-pink fungal mycelium inside tuber; or rapid watery liquefaction.',
      unhealthyCondition: 'Mechanical wounding during harvest digging; rough sorting; unhealed cuts; storage temperatures exceeding 10°C.',
      preventiveProtocol: [
        'Allow 10-14 days curing at 15°C and 90% RH immediately after digging for skin suberization (wound healing)',
        'Cold storage maintenance at strictly 2-4°C (seed potatoes) or 8-10°C (table potatoes with sprout inhibitor)',
        'Never wash potatoes before storing; discard cuts and bruises'
      ],
      severity: 'Severe',
      imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tomato-transit-rot',
      crop: 'Tomato & Capsicum',
      category: 'Fruits',
      spoilageName: 'Rhizopus Soft Rot & Sour Rot (Transit Decay)',
      spoilageNameHi: 'टमाटर की परिवहन सड़न व खट्टी गलन',
      pathogen: 'Rhizopus stolonifer & Geotrichum candidum',
      visibleDamage: 'Water-soaked soft collapse of whole fruit with coarse white whiskery mold turning black; rapid leak onto neighboring crates.',
      unhealthyCondition: 'Harvesting fruits during or immediately after rain; tight stacking in non-ventilated plastic sacks; fruit compression.',
      preventiveProtocol: [
        'Harvest during cool dry mornings at breaker/pink stage rather than over-ripe red stage',
        'Use rigid plastic crates with side vents instead of gunny bags',
        'Disinfect harvesting crates with 0.1% sodium hypochlorite'
      ],
      severity: 'Critical',
      imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'apple-blue-mold',
      crop: 'Apple & Pear',
      category: 'Fruits',
      spoilageName: 'Blue Mold & Penicillium Decay',
      spoilageNameHi: 'सेब की नीली फफूंद सड़न (पेनिसिलियम)',
      pathogen: 'Penicillium expansum (produces patulin toxin)',
      visibleDamage: 'Soft, light-brown circular watery rot with characteristic blue-green powdery spore cushions smelling musty/earthy.',
      unhealthyCondition: 'Stem punctures, fingernail scratches during picking, contaminated flume water in sorting lines.',
      preventiveProtocol: [
        'Sanitize sorting dump water with chlorine or peracetic acid',
        'Handle fruit with soft cotton gloves to avoid fingernail skin breaks',
        'Store in Controlled Atmosphere (CA) at 0-1°C with 1-2% O2'
      ],
      severity: 'Severe',
      imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const filteredCases = spoilageCases.filter((item) => {
    const matchesCategory = selectedFilter === 'All' || item.category === selectedFilter;
    const matchesSearch =
      item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.spoilageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.visibleDamage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 rounded-2xl p-6 sm:p-8 text-white border border-amber-800/60 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
            <Boxes className="w-3.5 h-3.5 text-amber-400" />
            {isHi ? 'भंडारण खराबी व सड़न सुरक्षा' : 'Post-Harvest Loss & Spoilage Prevention'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
            {isHi ? 'कटाई उपरांत फसल सड़न एवं गोदाम खराबी निदान' : 'Harvest Spoilage & Storage Damage Guide'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {isHi
              ? 'गोदामों और बोरियों में फफूंद, नमी, सड़न और बदबू से 20-30% उपज बर्बाद हो जाती है। यहां जानें दृश्यमान क्षति (Visible Damage) के लक्षण एवं सुरक्षित भंडारण के मानक।'
              : 'Over 25% of agricultural harvest is lost post-harvest due to improper curing, storage molds, mycotoxins, and transit decay. Identify visible storage damage early to protect your produce value.'}
          </p>
        </div>
      </div>

      {/* Storage Golden Rules */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900">
              {isHi ? '1. नमी नियंत्रण (<12%)' : '1. Safe Moisture Limit (<12%)'}
            </h4>
            <p className="text-[11px] text-stone-500 mt-1">
              {isHi
                ? 'भंडारण से पूर्व अनाजों को अच्छी धूप में सुखाएं ताकि फफूंद न पनप सके।'
                : 'Thoroughly sun-dry cereal grains until moisture is below 12% before packing.'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900">
              {isHi ? '2. हवादार लकड़ी के क्रेट्स' : '2. Adequate Ventilation'}
            </h4>
            <p className="text-[11px] text-stone-500 mt-1">
              {isHi
                ? 'प्याज, आलू व फलों को फर्श से 1 फीट ऊपर हवादार जालीदार रैक पर रखें।'
                : 'Elevate storage crates 30cm off the floor on slatted pallets to prevent moisture build-up.'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900">
              {isHi ? '3. छंटाई व क्योरिंग (Curing)' : '3. Curing & Bruise Sorting'}
            </h4>
            <p className="text-[11px] text-stone-500 mt-1">
              {isHi
                ? 'कटे-फटे या चोटिल कंदों को अलग करें; घाव सूखने के बाद ही गोदाम में रखें।'
                : 'Discard bruised or cut produce immediately so pathogens do not infect entire lots.'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['All', 'Grains', 'Fruits', 'Vegetables', 'Tubers'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder={isHi ? 'सड़न या फसल खोजें...' : 'Search spoilage symptoms...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Spoilage Cases Grid */}
      <div className="space-y-4">
        {filteredCases.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm hover:border-amber-400 transition-all grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Image Col (3 cols) */}
            <div className="lg:col-span-3 rounded-xl overflow-hidden bg-stone-100 h-48 lg:h-auto relative border border-stone-200">
              <img
                src={item.imageUrl}
                alt={item.spoilageName}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-amber-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                {item.category}
              </span>
            </div>

            {/* Details Col (9 cols) */}
            <div className="lg:col-span-9 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900">
                      {item.spoilageName}
                    </h3>
                    <p className="text-xs text-amber-800 font-semibold">{item.spoilageNameHi}</p>
                  </div>
                  <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                    {item.severity} Risk
                  </span>
                </div>

                <p className="text-xs text-stone-500 font-mono">
                  Pathogen / Vector: {item.pathogen}
                </p>

                {/* Visible Damage Box */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="text-[11px] font-bold text-stone-700 uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isHi ? 'दृश्यमान क्षति (Visible Damage Signs):' : 'Visible Damage & Spoilage Signs:'}</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {item.visibleDamage}
                  </p>
                </div>

                {/* Unhealthy Conditions */}
                <div className="text-xs text-stone-600">
                  <strong className="text-stone-800">
                    {isHi ? 'अस्वस्थ भंडारण परिस्थितियां: ' : 'Unhealthy Storage Causes: '}
                  </strong>
                  {item.unhealthyCondition}
                </div>
              </div>

              {/* Prevention Checklist */}
              <div className="pt-3 border-t border-stone-100">
                <div className="text-xs font-bold text-emerald-800 mb-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isHi ? 'बचाव प्रोटोकॉल:' : 'Safe Storage Protocols:'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.preventiveProtocol.map((p, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-stone-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
