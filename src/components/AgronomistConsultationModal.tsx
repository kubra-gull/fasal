import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  User,
  Bot,
  RefreshCw,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { ConsultationMessage, CropAnalysisResult } from '../types';

interface AgronomistConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CropAnalysisResult | null;
  language: 'en' | 'hi';
}

export const AgronomistConsultationModal: React.FC<AgronomistConsultationModalProps> = ({
  isOpen,
  onClose,
  result,
  language
}) => {
  const isHi = language === 'hi';
  const [messages, setMessages] = useState<ConsultationMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const cropText = result?.cropName || (isHi ? 'आपकी फसल' : 'your crop');
      const conditionText = result?.diseaseName || (isHi ? 'रोग स्थिति' : 'crop condition');

      const welcomeMsg: ConsultationMessage = {
        id: 'msg-welcome',
        sender: 'assistant',
        text: isHi
          ? `नमस्ते किसान भाई! मैं फ़सल डिटेक्शन का कृषि परामर्शक (Agronomist) हूँ। हमने आपकी ${cropText} में ${conditionText} का विश्लेषण किया है। दवा की खुराक, टंकी में मिश्रण, मौसम या कटाई संबंधी कोई भी सवाल पूछें!`
          : `Hello Farmer! I am your Fasal Detection AI Agronomist. We have analyzed ${conditionText} on your ${cropText}. How can I assist you with spray timing, tank-mix compatibility, dosage per acre, or safety guidelines?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen, result, isHi, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const quickQuestions = isHi
    ? [
        'क्या इस दवा को यूरिया या खाद के साथ मिला सकते हैं?',
        'कल बारिश होने की संभावना है, क्या आज छिड़काव करें?',
        'एक एकड़ में कितना लीटर पानी और दवा लगेगी?',
        'छिड़काव के कितने दिन बाद फसल तोड़ी जा सकती है?'
      ]
    : [
        'Can I tank-mix this fungicide with urea or micronutrients?',
        'Rain is forecasted tomorrow; should I spray now or wait?',
        'What is the water volume and chemical dose per acre?',
        'How many days before harvest must I stop spraying (PHI)?'
      ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ConsultationMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsSending(true);

    try {
      const response = await fetch('/api/crop-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend.trim(),
          cropName: result?.cropName,
          diseaseName: result?.diseaseName,
          chatHistory: messages,
          language
        })
      });

      const data = await response.json();
      const botMsg: ConsultationMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: data.answer || (isHi ? 'कृपया स्थानीय कृषि विज्ञान केंद्र (KVK) से संपर्क करें।' : 'Please verify with your local agricultural officer.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ConsultationMessage = {
        id: 'bot-err-' + Date.now(),
        sender: 'assistant',
        text: isHi
          ? 'माफ़ कीजिए, संपर्क में त्रुटि हुई। कृपया कुछ समय बाद पुनः प्रयास करें।'
          : 'Failed to connect with advisory service. Please check your network.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isHi ? 'कृषि विशेषज्ञ परामर्श (AI Agronomist)' : 'AI Agronomist Consultation'}
              </h3>
              <p className="text-xs text-emerald-200">
                {result ? `${result.cropName} • ${result.diseaseName}` : 'Crop Health Follow-Up'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-stone-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-none'
                    : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 ${
                    msg.sender === 'user' ? 'text-emerald-200 text-right' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-stone-800 text-stone-200 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-xs text-stone-500 italic p-2 bg-white rounded-xl border border-stone-200 w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
              <span>{isHi ? 'कृषि विशेषज्ञ जवाब तैयार कर रहे हैं...' : 'Agronomist formulating response...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Prompts */}
        <div className="p-3 bg-white border-t border-stone-200 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHi ? 'अक्सर पूछे जाने वाले सवाल:' : 'Quick Farmer Inquiries:'}</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                disabled={isSending}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 text-stone-700 text-[11px] font-medium border border-stone-200 whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-stone-100 border-t border-stone-200 flex items-center gap-2"
        >
          <input
            type="text"
            id="input-consultation"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              isHi
                ? 'दवा, छिड़काव या फसल सुरक्षा के बारे में पूछें...'
                : 'Ask about spray mixing, rainfall safety, dosages...'
            }
            className="flex-1 px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          />

          <button
            type="submit"
            id="btn-send-consultation"
            disabled={!inputQuery.trim() || isSending}
            className={`p-2.5 rounded-xl font-semibold text-white transition-all ${
              inputQuery.trim() && !isSending
                ? 'bg-emerald-700 hover:bg-emerald-800 shadow'
                : 'bg-stone-300 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
