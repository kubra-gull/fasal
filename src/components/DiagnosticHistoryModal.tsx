import React from 'react';
import {
  X,
  History,
  Trash2,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Leaf,
  AlertTriangle
} from 'lucide-react';
import { CropAnalysisResult } from '../types';

interface DiagnosticHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: CropAnalysisResult[];
  onSelectResult: (result: CropAnalysisResult) => void;
  onClearHistory: () => void;
  language: 'en' | 'hi';
}

export const DiagnosticHistoryModal: React.FC<DiagnosticHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
  language
}) => {
  const isHi = language === 'hi';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isHi ? 'पूर्व फसल जांच इतिहास' : 'Crop Diagnostic History'}
              </h3>
              <p className="text-xs text-stone-400">
                {isHi
                  ? `${history.length} पूर्व जांच रिकॉर्ड सुरक्षित हैं`
                  : `${history.length} past scan records available`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-stone-400 space-y-2">
              <History className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-sm font-semibold text-stone-600">
                {isHi ? 'अभी कोई पूर्व जांच रिकॉर्ड नहीं है।' : 'No saved diagnostic scans yet.'}
              </p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                {isHi
                  ? 'जब आप फसल की जांच करेंगे, तो परिणाम यहां सुरक्षित हो जाएंगे ताकि आप बाद में भी देख सकें।'
                  : 'Scanned crops and pathological reports will appear here for easy future reference.'}
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
                className="p-4 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900 group-hover:text-emerald-800">
                      {item.cropName}: {item.diseaseName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.isHealthy
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.severity === 'Critical'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.healthStatus}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-1">
                    {item.immediateAction}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-stone-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isHi ? 'इतिहास मिटाएं' : 'Clear All Records'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              {isHi ? 'बंद करें' : 'Close'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
