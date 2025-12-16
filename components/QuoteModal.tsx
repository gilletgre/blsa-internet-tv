import React, { useState } from 'react';
import { refineText } from '../services/geminiService';
import { Copy, X, Wand2, Mail, CheckCircle2 } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, summary }) => {
  const [message, setMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAiDraft = async () => {
    setIsAiLoading(true);
    const draft = await refineText(summary, 'quote');
    setMessage(draft);
    setIsAiLoading(false);
  };

  const fullText = `DEMANDE DE DEVIS\n\nMESSAGE:\n${message}\n\n----------------\n\nRÉCAPITULATIF:\n${summary}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up ring-1 ring-slate-900/5">
        {/* Header */}
        <div className="bg-slate-50/80 px-6 py-5 border-b border-slate-100 flex justify-between items-center backdrop-blur-sm">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg text-brand-600 shadow-sm ring-1 ring-slate-100">
              <Mail className="w-5 h-5" />
            </div>
            Demander un devis
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-slate-700">Message d'accompagnement</label>
              <button 
                onClick={handleAiDraft}
                disabled={isAiLoading}
                className="text-xs flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 hover:bg-brand-100 transition-all font-medium"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                {isAiLoading ? 'Rédaction IA...' : 'Rédiger avec IA'}
              </button>
            </div>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex: Bonjour, pourriez-vous me confirmer la disponibilité pour..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500 h-32 resize-none placeholder-slate-400 shadow-sm"
            />
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 max-h-48 overflow-y-auto">
            <pre className="text-xs text-slate-500 font-mono whitespace-pre-wrap">{summary}</pre>
          </div>
        </div>

        <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 font-medium hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-200"
          >
            Annuler
          </button>
          <button 
            onClick={handleCopy}
            className={`px-6 py-2.5 flex items-center gap-2 font-bold rounded-xl text-white transition-all shadow-lg shadow-brand-500/20 ${copied ? 'bg-emerald-500' : 'bg-brand-600 hover:bg-brand-500'}`}
          >
            {copied ? (
               <><CheckCircle2 className="w-4 h-4" /> Copié !</>
            ) : (
               <><Copy className="w-4 h-4" /> Copier tout</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};