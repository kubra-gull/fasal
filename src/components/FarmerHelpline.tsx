import React from 'react';
import {
  PhoneCall,
  ShieldAlert,
  MapPin,
  ExternalLink,
  LifeBuoy,
  MessageCircle,
  Clock,
  HeartHandshake
} from 'lucide-react';

interface FarmerHelplineProps {
  language: 'en' | 'hi';
}

export const FarmerHelpline: React.FC<FarmerHelplineProps> = ({ language }) => {
  const isHi = language === 'hi';

  const helplines = [
    {
      title: isHi ? 'राष्ट्रीय किसान कॉल सेंटर (KCC)' : 'Kisan Call Center (National Toll-Free)',
      number: '1800-180-1551',
      hours: isHi ? 'सुबह 6:00 से रात 10:00 (सभी 22 भारतीय भाषाएं)' : '6:00 AM - 10:00 PM (All 22 Indian Regional Languages)',
      desc: isHi
        ? 'कृषि वैज्ञानिकों द्वारा फसलों के रोग, कीट, बीज, उर्वरक व मौसम पर निःशुल्क सलाह।'
        : 'Direct telephonic support with agricultural extension scientists regarding crop diseases, dosages, and weather.'
    },
    {
      title: isHi ? 'कृषि विज्ञान केंद्र (KVK) नेटवर्क' : 'Krishi Vigyan Kendra (KVK) Extension',
      number: '1800-11-2004',
      hours: isHi ? 'कार्य दिवस: सुबह 9:30 से शाम 5:30' : 'Mon - Sat: 9:30 AM - 5:30 PM',
      desc: isHi
        ? 'जिलेवार स्थानीय मिट्टी परीक्षण, बीज प्रमाणन एवं फील्ड प्रदर्शन इकाइयां।'
        : 'District-level demonstration units, local soil testing labs, and certified resistant seed varieties.'
    },
    {
      title: isHi ? 'कीटनाशक व बीज गुणवत्ता हेल्पलाइन' : 'Pesticide & Agrochemical Quality Vigilance',
      number: '1800-180-1552',
      hours: isHi ? '24x7 स्वचालित शिकायत एवं सत्यापन' : '24x7 Quality & Adulteration Grievance Cell',
      desc: isHi
        ? 'नकली कीटनाशक या अमानक उर्वरक की शिकायत एवं बैच नंबर सत्यापन।'
        : 'Report counterfeit or substandard agrochemicals and verify genuine batch QR codes.'
    }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-green-950 to-stone-900 rounded-2xl p-6 sm:p-8 text-white border border-emerald-800 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold uppercase tracking-wider border border-emerald-600/40">
            <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
            {isHi ? 'किसान मित्र एवं आपातकालीन सेवा' : 'Emergency Agricultural Support & Helplines'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
            {isHi ? 'कृषि सहायता केंद्र एवं आपातकालीन नंबर' : 'Farmer Support Hotlines & Agricultural Centers'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
            {isHi
              ? 'यदि खेत में अचानक कोई महामारी, कीट प्रकोप या फसल पीली पड़ रही हो, तो तुरंत संपर्क करें।'
              : 'Direct access to government agricultural extension scientists, plant pathologists, and verified diagnostic centers.'}
          </p>
        </div>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {helplines.map((hl, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border-2 border-stone-200 hover:border-emerald-600 p-6 shadow-sm flex flex-col justify-between space-y-4 transition-all"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>

              <h3 className="text-base font-bold text-stone-900">{hl.title}</h3>

              <div className="pt-2">
                <a
                  href={`tel:${hl.number}`}
                  className="text-lg font-black font-mono text-emerald-700 hover:underline block"
                >
                  {hl.number}
                </a>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{hl.hours}</span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed pt-1">
                {hl.desc}
              </p>
            </div>

            <a
              href={`tel:${hl.number}`}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{isHi ? 'कॉल करें (निःशुल्क)' : 'Call Now (Toll-Free)'}</span>
            </a>
          </div>
        ))}
      </div>

      {/* Outbreak Alert Notice */}
      <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-300 text-stone-800 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm uppercase">
          <ShieldAlert className="w-5 h-5 text-amber-700" />
          <span>{isHi ? 'सावधानी: नकली कीटनाशकों से फसल बचाएं' : 'Farmer Advisory: Beware of Adulterated Agrochemicals'}</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          {isHi
            ? 'दवा खरीदते समय हमेशा पक्का बिल लें। डिब्बे पर CIB&RC पंजीकरण संख्या और निर्माण तिथि अवश्य जांचें। अत्यधिक सस्ते अथवा बिना लेबल वाली दवाओं के प्रयोग से पत्तियां जलने का खतरा रहता है।'
            : 'Always insist on a printed cash memo with batch number and CIB&RC registration stamp when purchasing crop protection chemicals. Never purchase unsealed or unlabeled sprays.'}
        </p>
      </div>
    </div>
  );
};
