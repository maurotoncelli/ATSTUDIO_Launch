import { useState, useEffect } from 'react';

export default function PilotForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    projectType: 'WebGL',
    timeline: 'Q2 2026',
    budget: 10000,
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-pilot-form', handleOpen);
    
    return () => {
      window.removeEventListener('open-pilot-form', handleOpen);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Invia a Netlify Forms
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setIsSubmitting(false);
        setTimeout(() => {
          handleClose();
          setFormData({
            name: '',
            email: '',
            company: '',
            website: '',
            projectType: 'WebGL',
            timeline: 'Q2 2026',
            budget: 10000,
            details: ''
          });
        }, 2000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      // Potresti aggiungere uno stato di errore qui
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? parseInt(value) : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#02040a] p-6 md:p-8 lg:p-12"
      onClick={handleClose}
    >
      {/* Modal: Ottimizzato per mobile - tutto visibile in una schermata */}
      <div 
        className="pilot-modal relative bg-transparent max-w-4xl w-full my-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '1.5rem 1.5rem' }}
      >
        {/* Close button - Mobile friendly */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-8 md:right-0 md:-top-12 text-[#f0f4ff]/60 hover:text-[#f0f4ff] active:text-[#f0f4ff] transition-colors text-3xl md:text-3xl font-light z-20 w-12 h-12 flex items-center justify-center"
          aria-label="Close"
        >
          ✕
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start">
          {/* Left: Info */}
          <div className="md:col-span-4 space-y-3 md:space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#f0f4ff] leading-tight tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Candidatura Pilot
            </h2>
            <div className="h-px w-12 bg-[#a6c1ff]/30"></div>
            <p className="text-[#c7d2ff]/60 text-sm md:text-base lg:text-lg leading-relaxed tracking-wide hidden md:block">
              Stiamo selezionando 3 partner visionari per il nostro lancio Q2 2026. Raccontaci del tuo progetto.
            </p>
          </div>

          {/* Right: Form */}
          <div className="md:col-span-8">
            {submitStatus === 'success' ? (
              <div className="py-12 md:py-20 text-center md:text-left">
                <p className="text-2xl md:text-3xl lg:text-4xl text-[#f0f4ff] font-light italic" style={{ fontFamily: 'Playfair Display, serif' }}>Candidatura ricevuta.</p>
                <p className="text-[#c7d2ff]/60 text-base md:text-lg mt-3 tracking-widest uppercase">Ti contatteremo presto.</p>
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit} 
                className="space-y-5 md:space-y-14 lg:space-y-20"
                name="pilot-application"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
              >
                {/* Hidden field for Netlify Forms */}
                <input type="hidden" name="form-name" value="pilot-application" />
                {/* Honeypot field for spam protection */}
                <input type="hidden" name="bot-field" />
                {/* Row 1: Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 md:gap-y-12 lg:gap-y-20">
                  <div className="relative">
                    <label className="block text-sm md:text-base lg:text-lg tracking-[0.15em] md:tracking-[0.2em] text-[#c7d2ff]/70 uppercase mb-3">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b-2 md:border-b border-[#f0f4ff]/30 pb-4 text-[#f0f4ff] text-lg md:text-xl lg:text-2xl focus:border-[#f0f4ff] outline-none transition-colors placeholder:text-[#c7d2ff]/20"
                      placeholder="Mario Rossi"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm md:text-base lg:text-lg tracking-[0.15em] md:tracking-[0.2em] text-[#c7d2ff]/70 uppercase mb-3">
                      Indirizzo Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b-2 md:border-b border-[#f0f4ff]/30 pb-4 text-[#f0f4ff] text-lg md:text-xl lg:text-2xl focus:border-[#f0f4ff] outline-none transition-colors placeholder:text-[#c7d2ff]/20"
                      placeholder="mario@esempio.it"
                    />
                  </div>
                </div>

                {/* Row 2: Company + Website */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 md:gap-y-12 lg:gap-y-20">
                  <div className="relative">
                    <label className="block text-sm md:text-base lg:text-lg tracking-[0.15em] md:tracking-[0.2em] text-[#c7d2ff]/70 uppercase mb-3">
                      Azienda / Brand
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b-2 md:border-b border-[#f0f4ff]/30 pb-4 text-[#f0f4ff] text-lg md:text-xl lg:text-2xl focus:border-[#f0f4ff] outline-none transition-colors placeholder:text-[#c7d2ff]/20"
                      placeholder="Acme SRL"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm md:text-base lg:text-lg tracking-[0.15em] md:tracking-[0.2em] text-[#c7d2ff]/70 uppercase mb-3">
                      Sito Web
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b-2 md:border-b border-[#f0f4ff]/30 pb-4 text-[#f0f4ff] text-lg md:text-xl lg:text-2xl focus:border-[#f0f4ff] outline-none transition-colors placeholder:text-[#c7d2ff]/20"
                      placeholder="https://esempio.it"
                    />
                  </div>
                </div>

                {/* Row 3: Project Vision (full width) */}
                <div className="relative">
                  <label className="block text-sm md:text-base lg:text-lg tracking-[0.15em] md:tracking-[0.2em] text-[#c7d2ff]/70 uppercase mb-3">
                    Visione Progetto
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-transparent border-b-2 md:border-b border-[#f0f4ff]/30 pb-4 text-[#f0f4ff] text-lg md:text-xl lg:text-2xl focus:border-[#f0f4ff] outline-none transition-colors resize-none placeholder:text-[#c7d2ff]/20 leading-relaxed"
                    placeholder="Raccontaci del tuo progetto..."
                  />
                </div>

                {/* Submit */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 pt-2 md:pt-4 lg:pt-8">
                  <p className="text-xs md:text-sm lg:text-base text-[#c7d2ff]/40 tracking-[0.2em] uppercase max-w-[250px] hidden md:block leading-relaxed">
                    Consulenza personalizzata per candidati selezionati.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative px-8 md:px-12 lg:px-16 py-5 md:py-6 lg:py-7 border-2 md:border-2 border-[#f0f4ff]/50 md:border-[#f0f4ff]/40 text-[#f0f4ff] text-base md:text-lg lg:text-xl tracking-[0.25em] md:tracking-[0.3em] font-medium md:font-light hover:border-[#f0f4ff] hover:bg-[#f0f4ff]/5 active:scale-95 transition-all duration-300 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    <span className="relative z-10">{isSubmitting ? 'Invio...' : 'Candidati Ora'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .pilot-modal {
          animation: couture-in 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes couture-in {
          from { transform: translateY(40px); opacity: 0; filter: blur(10px); }
          to { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #f0f4ff;
          -webkit-box-shadow: 0 0 0px 1000px transparent inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}
