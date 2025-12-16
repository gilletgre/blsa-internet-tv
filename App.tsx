import React, { useState, useMemo, useRef } from 'react';
import { OrderForm, INITIAL_DATA, STEPS } from './types';
import { QuoteModal } from './components/QuoteModal';
import { refineText } from './services/geminiService';
import { OptionCard, Toggle, VisualInput } from './components/VisualInputs';
import { 
  ChevronRight, 
  ChevronLeft, 
  LayoutDashboard, 
  Map, 
  UserCircle, 
  Receipt,
  Tv, 
  Globe,
  Sparkles,
  ArrowRight,
  Send,
  MapPin,
  Calendar,
  Building,
  User,
  Smartphone,
  Mail
} from 'lucide-react';

export default function App() {
  const [data, setData] = useState<OrderForm>(INITIAL_DATA);
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiRefining, setIsAiRefining] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const topRef = useRef<HTMLDivElement>(null);

  const updateField = (field: keyof OrderForm, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleAiRefineNotes = async () => {
    if (!data.notes) return;
    setIsAiRefining(true);
    const refined = await refineText(data.notes, 'notes');
    updateField('notes', refined);
    setIsAiRefining(false);
  };

  const summaryText = useMemo(() => {
    return `COMMANDE FLEX+ (${new Date().toLocaleDateString()})
--------------------------------
PRODUIT: ${data.pack}
INSTALL: ${data.installExpress ? 'EXPRESS (Best Effort)' : 'Standard'}
--------------------------------
CLIENT:  ${data.clientName}
ID:      ${data.clientId}
CONTACT: ${data.contactName}
TEL:     ${data.clientPhone}
EMAIL:   ${data.clientEmail}
--------------------------------
ADRESSE: ${data.street} ${data.complement}, ${data.zip} ${data.city}
RDV:     ${data.date || 'À définir'} (${data.slot})
--------------------------------
NOTES:   ${data.notes || 'N/A'}`;
  }, [data]);

  // Encode data for Netlify
  const encode = (data: any) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "flex-order", ...data })
    })
      .then(() => {
        alert("✅ Commande envoyée avec succès !");
        setIsSubmitting(false);
        // Optional: Reset form or redirect
      })
      .catch(error => {
        alert("❌ Erreur lors de l'envoi.");
        console.error(error);
        setIsSubmitting(false);
      });
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Dynamic Content Rendering ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Product
        return (
          <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <OptionCard 
                title="Pack Flex+"
                description="Internet Ultra-Rapide + Télévision Premium. L'offre complète."
                icon={<Tv size={32} />}
                selected={data.pack.includes("Flex+")}
                onClick={() => updateField('pack', "Pack Flex+ (Internet + TV)")}
                accentColor="bg-brand-500"
              />
              <OptionCard 
                title="Pack Flex (Net)"
                description="Connexion Internet seule. Simplicité et performance."
                icon={<Globe size={32} />}
                selected={!data.pack.includes("Flex+")}
                onClick={() => updateField('pack', "Pack Flex (Internet seul)")}
                accentColor="bg-sky-500"
              />
            </div>

            <div className="glass-card p-8 rounded-3xl border-l-8 border-l-brand-500 shadow-lg">
               <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
                    <Sparkles size={24} />
                  </div>
                  Préférence d'installation
               </h3>
               <Toggle 
                  label="Demander une Installation Express (Best Effort)" 
                  checked={data.installExpress}
                  onChange={(v) => updateField('installExpress', v)}
               />
            </div>
          </div>
        );

      case 1: // Address
        return (
          <div className="space-y-10 animate-fade-in">
             <div className="glass-card p-8 rounded-3xl space-y-8 border-l-8 border-l-emerald-500 shadow-lg">
               <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                 <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <MapPin size={24} />
                 </div>
                 Localisation
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-2">
                   <VisualInput label="Rue et numéro" value={data.street} onChange={e => updateField('street', e.target.value)} placeholder="Ex: Rue de la Loi 16" />
                 </div>
                 <VisualInput label="Boîte / Complément" value={data.complement} onChange={e => updateField('complement', e.target.value)} placeholder="Apt 4B" />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <VisualInput label="Code Postal" value={data.zip} onChange={e => updateField('zip', e.target.value)} placeholder="1000" />
                 <VisualInput label="Ville" value={data.city} onChange={e => updateField('city', e.target.value)} placeholder="Bruxelles" />
               </div>
             </div>

             <div className="glass-card p-8 rounded-3xl space-y-8 border-l-8 border-l-purple-500 shadow-lg">
               <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                 <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <Calendar size={24} />
                 </div>
                 Planification
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <VisualInput type="date" label="Date souhaitée" value={data.date} onChange={e => updateField('date', e.target.value)} />
                 <div className="space-y-3">
                    <label className="text-xs uppercase font-bold text-slate-400 ml-1">Créneau</label>
                    <div className="flex gap-4">
                      {["Matin", "Après-midi"].map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => updateField('slot', slot)}
                          className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold text-lg ${data.slot.includes(slot) ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                 </div>
               </div>
             </div>
          </div>
        );

      case 2: // Client
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Visual Client Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-shadow duration-500">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
               
               <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                     <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-white shadow-md">
                        <Building className="w-10 h-10 text-brand-600" />
                     </div>
                     <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{data.clientName}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-bold font-mono">CLIENT VIP</span>
                            <p className="text-slate-400 font-mono text-sm font-medium">{data.clientId}</p>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-brand-200 transition-colors">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                           <User size={14} /> Contact Principal
                        </label>
                        <p className="font-xl font-bold text-slate-800">{data.contactName}</p>
                     </div>
                     <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-brand-200 transition-colors">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                           <Mail size={14} /> Email
                        </label>
                        <p className="font-lg font-medium text-slate-800 break-all">{data.clientEmail}</p>
                     </div>
                     <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-brand-200 transition-colors md:col-span-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                           <Smartphone size={14} /> Téléphone
                        </label>
                        <p className="font-xl font-bold text-slate-800 tracking-wide">{data.clientPhone}</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <p className="text-slate-400 text-sm text-center italic flex items-center justify-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               Données synchronisées en temps réel avec le CRM.
            </p>
          </div>
        );

      case 3: // Billing & Notes
        return (
          <div className="space-y-10 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <VisualInput icon={<Building size={20} />} label="Convention" value={data.convention} disabled className="opacity-70 bg-slate-50 cursor-not-allowed" />
                <VisualInput icon={<Receipt size={20} />} label="Référence PO" value={data.poRef} onChange={e => updateField('poRef', e.target.value)} placeholder="Ex: PO-2024-X99" />
             </div>
             
             <div className="relative group">
                <div className="flex justify-between items-end mb-3 px-1">
                   <label className="text-sm uppercase font-bold text-slate-500 tracking-wide">Notes Techniques & Instructions</label>
                   <button 
                      onClick={handleAiRefineNotes}
                      disabled={isAiRefining || !data.notes}
                      className="text-sm flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 hover:bg-brand-100 disabled:opacity-50 transition-all font-bold"
                   >
                     <Sparkles size={16} className={isAiRefining ? 'animate-spin' : ''} />
                     {isAiRefining ? 'Optimisation...' : 'Améliorer avec IA'}
                   </button>
                </div>
                <textarea 
                  className="w-full h-48 bg-white border-2 border-slate-200 rounded-3xl p-6 text-slate-800 text-lg placeholder-slate-300 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all resize-none shadow-sm"
                  placeholder="Instructions d'accès, codes porte, particularités techniques..."
                  value={data.notes}
                  onChange={e => updateField('notes', e.target.value)}
                />
             </div>
          </div>
        );
      
      default: return null;
    }
  };

  const stepsIcons = [<LayoutDashboard />, <Map />, <UserCircle />, <Receipt />];

  return (
    <div className="min-h-screen text-slate-800 font-sans pb-24 bg-slate-50/50" ref={topRef}>
      
      {/* --- Top Navigation --- */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-6 md:px-12 py-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-600/20 transform hover:rotate-3 transition-transform">
               <LayoutDashboard className="text-white" size={24} />
             </div>
             <div>
               <h1 className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">Flex+</h1>
               <p className="text-xs text-brand-600 uppercase tracking-[0.2em] font-bold mt-1">Commander</p>
             </div>
          </div>

          <div className="hidden md:flex gap-3 bg-slate-100 p-1.5 rounded-2xl">
             {STEPS.slice(0, 4).map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(idx)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2.5 ${currentStep === idx ? 'bg-white text-brand-700 shadow-md ring-1 ring-slate-200/50 transform scale-105' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
                >
                   {React.cloneElement(stepsIcons[idx] as React.ReactElement<any>, { size: 16, strokeWidth: 2.5 })}
                   {step.title}
                </button>
             ))}
          </div>

          <button onClick={() => setIsModalOpen(true)} className="md:hidden text-slate-600 bg-slate-100 p-3 rounded-xl active:bg-slate-200">
             <Receipt size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        
        {/* --- Main Content --- */}
        <div className="lg:col-span-8">
           <div className="mb-10 flex items-end justify-between border-b-2 border-slate-100 pb-6">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">{STEPS[currentStep].title}</h2>
                <p className="text-lg text-slate-500 font-medium">{STEPS[currentStep].description}</p>
              </div>
              <span className="text-8xl font-black text-slate-100 select-none -mb-10 -mr-6 pointer-events-none opacity-50">0{currentStep + 1}</span>
           </div>

           {renderStepContent()}

           {/* Navigation Footer */}
           <div className="mt-16 flex items-center justify-between pt-8 border-t-2 border-slate-100">
              <button 
                onClick={() => goToStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-8 py-4 rounded-2xl text-slate-500 hover:text-slate-900 hover:bg-white border-2 border-transparent hover:border-slate-100 disabled:opacity-30 transition-all font-bold flex items-center gap-3 text-lg"
              >
                <ChevronLeft size={24} />
                Retour
              </button>

              {currentStep < 3 ? (
                 <button 
                  onClick={() => goToStep(currentStep + 1)}
                  className="group relative px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all flex items-center gap-3 overflow-hidden text-lg"
                 >
                   <span className="relative z-10 flex items-center gap-3">Suivant <ArrowRight size={24} /></span>
                 </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-10 py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-500 shadow-xl shadow-brand-500/30 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed text-lg transform hover:-translate-y-1"
                >
                   {isSubmitting ? 'Envoi...' : 'Confirmer'} <Send size={24} />
                </button>
              )}
           </div>
        </div>

        {/* --- Live Summary Sidebar --- */}
        <div className="hidden lg:block lg:col-span-4 pl-4">
           <div className="sticky top-32 space-y-8">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
                   <h3 className="text-xl font-extrabold text-slate-900">Récapitulatif</h3>
                   <div className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 border border-green-100">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      LIVE UPDATE
                   </div>
                </div>
                
                <div className="space-y-6 text-base">
                   <div className="flex justify-between items-center group">
                      <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Pack</span>
                      <span className="text-slate-900 font-bold text-right group-hover:text-brand-600 transition-colors">{data.pack.split('(')[0]}</span>
                   </div>
                   <div className="flex justify-between items-center group">
                      <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Install</span>
                      <span className={`text-right font-bold transition-colors ${data.installExpress ? 'text-brand-600' : 'text-slate-900'}`}>{data.installExpress ? 'Express' : 'Standard'}</span>
                   </div>
                   <div className="flex justify-between items-center group">
                      <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Ville</span>
                      <span className="text-slate-900 font-bold text-right truncate max-w-[150px] group-hover:text-brand-600 transition-colors">{data.city || '...'}</span>
                   </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100">
                   <button 
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-4 rounded-2xl bg-slate-50 hover:bg-white border-2 border-slate-200 hover:border-brand-200 text-slate-700 hover:text-brand-600 font-bold transition-all flex justify-center items-center gap-3 shadow-sm hover:shadow-md"
                   >
                     <Receipt size={20} />
                     Générer le Devis
                   </button>
                </div>
              </div>
           </div>
        </div>

      </div>

      <QuoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        summary={summaryText}
      />
    </div>
  );
}